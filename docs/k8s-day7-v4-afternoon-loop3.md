# 第七堂下午逐字稿 v4 — Loop 3：從零部署（任務排程系統，講師示範）

> 影片：7-8（系統設計 + 為什麼）、7-9（邊打指令邊講，所有組件一路建到完成）、7-10（QA + Helm 示範 install/upgrade/rollback/values + 學員題目 + 解答）
> 主線：用一套真實系統，把四堂課所有核心組件全部串起來
> 系統架構：Frontend → Backend API → Redis Queue → Task Runner → PostgreSQL

---

# 影片 7-8：我們要建什麼？（~8min）

## 本集重點

- 問題：學了很多組件，但從來沒有全部串在一起過
- 系統功能說明：任務排程系統
- 架構圖：六個服務，12 個 K8s 核心組件
- 每個組件用在哪裡，為什麼用這個

## 逐字稿

好，上午解決了 HPA 和 RBAC。現在進入今天最後一個部分，也是整個課程最重要的環節。

我想先問大家一個問題。到目前為止你學了 Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、HPA、RBAC、Job、CronJob。每個組件你應該都知道它是什麼。

但如果我現在叫你從零建一套完整的系統，你知道要從哪裡開始嗎？第一步做什麼、第二步做什麼、這裡用哪個組件、那裡為什麼不用另一個？

這就是今天下午要做的事。我親自示範一套完整系統從零建起來，你跟著看，看每一個選擇的背後是什麼原因。

這套系統叫做任務排程系統。說明一下它的功能。

使用者打開瀏覽器，建立一個任務：每天早上九點寄出報表 Email。點送出，請求打到 Backend API，API 把任務丟進 Redis Queue，馬上回應使用者任務已建立。

有一個 Task Runner 一直在跑，不斷從 Queue 拿任務出來執行，執行完把結果存進 PostgreSQL。另外有一個 CronJob 定時觸發，把到期的排程任務撈出來丟進 Queue，Task Runner 去執行。

這是非同步任務系統的標準架構。業界的 Celery、Bull、Sidekiq，都是這個模式。

我選這個系統是因為它能覆蓋最多的 K8s 組件。來數一下，同時說明每個組件用在哪裡、為什麼用它。

Deployment 用在 Frontend、Backend API、Task Runner。這三個服務都是無狀態的，Pod 隨時可以砍掉重建，不怕資料丟。

StatefulSet 用在 PostgreSQL，不是 Deployment。因為資料庫需要穩定的 Pod 名稱和固定的儲存，Pod 重啟之後還是要接回同一個磁碟。Deployment 做不到這件事。

PVC 給 PostgreSQL 持久化儲存。

ConfigMap 存 DB 主機名、Redis 位址、Port 號這些設定值。

Secret 存 DB 密碼、Redis 密碼、JWT secret 這些機密資料。

Service，每個服務都要有，讓叢集內部的服務可以互相連。

Ingress 對外暴露 Frontend 和 Backend API，走域名路由。

HPA 給 Backend API，流量高的時候自動擴 Pod。

RBAC 給 Task Runner，讓它有讀取 ConfigMap 的最小權限。

Job 跑一次性的資料庫 schema migration。

CronJob 定時觸發排程任務。

DaemonSet，我會在過程中解釋 Task Runner 為什麼不用 DaemonSet，DaemonSet 真正適合的場景是什麼。

十二個組件，一套系統。我們開始。

---

# 影片 7-9：從零到完成 — 邊建邊解釋（~40min）

## 本集重點

- Namespace：隔離這套系統
- Secret vs ConfigMap：分別存什麼、為什麼分開
- PostgreSQL（StatefulSet）：Deployment 為什麼不行
- Headless Service：StatefulSet 為什麼要搭配它
- Redis（Deployment）：為什麼這裡不用 StatefulSet
- Service 類型選擇：ClusterIP / NodePort / LoadBalancer
- Job：一次性任務為什麼不用 Deployment
- RBAC：Task Runner 的最小權限
- Backend / Frontend（Deployment + Service）
- readinessProbe：Pod Running 不等於可以接流量
- envFrom vs 逐一列 env：Secret 為什麼不能用 envFrom
- Task Runner Deployment：為什麼不需要 Service
- DaemonSet vs Deployment：判斷原則
- CronJob：schedule 語法、concurrencyPolicy
- Ingress：path rewrite 在做什麼
- HPA：前提條件

## 逐字稿

### Namespace

第一步，建一個 Namespace 把這套系統隔開。

指令：kubectl create namespace tasks

為什麼要建 Namespace？你的叢集上可能同時跑著這套系統、一個電商後台、一個內部監控工具。如果全部放在 default namespace，所有 Pod、Service、ConfigMap 混在一起，kubectl get pods 看到幾十個不知道哪個是哪個。Namespace 是邏輯上的隔離牆，每個系統有自己的空間，資源不互相干擾，RBAC 的權限也可以按 Namespace 分開控管。

之後所有指令都加 -n tasks。

---

### Secret — 密碼放這裡，不是 ConfigMap

密碼和機密資料放 Secret，不是 ConfigMap。分界線只有一條：洩漏出去會有問題的放 Secret，不會有問題的放 ConfigMap。

DB 密碼、Redis 密碼、JWT secret，放 Secret。DB 主機名、Port 號、DB 名稱，放 ConfigMap。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: tasks
type: Opaque
stringData:
  postgres-password: "MyPostgresP@ssw0rd"
  redis-password: "MyRedisP@ssw0rd"
  jwt-secret: "MyJwtSuperSecret"
```

stringData 和 data 的差別。stringData 你填明文，K8s 幫你 base64 encode 再存。data 你要自己先 base64 encode 才能填進去。用 stringData 比較方便，但這個 YAML 不要推進 git，或者用 Sealed Secrets 這類工具管理。

指令：kubectl apply -f secret.yaml

驗證：

指令：kubectl get secret app-secrets -n tasks

只看到 NAME 和 TYPE，看不到值。describe 也看不到值。這是 K8s 的設計，防止 Secret 在終端機輸出中洩漏。

---

### ConfigMap — 設定值放這裡

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: tasks
data:
  POSTGRES_HOST: "postgres-service"
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "taskdb"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  API_URL: "http://backend-service:3000"
```

注意 POSTGRES_HOST 的值是 postgres-service。這是等一下我們要建的 Service 名稱。K8s 有內建 DNS，每個 Service 建立之後，叢集內部就可以用 Service 名稱直接連到它。在同一個 Namespace 裡用短名稱就夠，K8s DNS 自動解析。Pod 重啟換了 IP 也沒關係，Service 的 DNS 名稱不變，ConfigMap 裡的值永遠有效。

指令：kubectl apply -f configmap.yaml

---

### PostgreSQL（StatefulSet）— 為什麼不用 Deployment

這裡是很多人第一次遇到的疑問。PostgreSQL 也是跑在 Pod 裡，為什麼不用 Deployment？

Deployment 的 Pod 名稱是隨機的，比如 postgres-7d4f8-xkjqp，重啟之後名稱會換，可能跑到不同的 Node 上。如果今天 Pod 在 Node A 掛著某個磁碟，重啟後跑到 Node B，B 上沒有那個磁碟，資料就消失了。

StatefulSet 解決三件事。第一，Pod 有穩定的名稱：postgres-0、postgres-1，重啟後名稱不變。第二，Pod 有穩定的 DNS：postgres-0.postgres-service 永遠指向 postgres-0 這個 Pod，不管它在哪個 Node。第三，每個 Pod 有自己的 PVC：postgres-0 永遠掛自己的 PVC，重啟後還是同一個磁碟，資料不丟。

判斷原則就這一句：這個服務需要穩定的身份（固定名稱和固定儲存）嗎？需要就 StatefulSet，不需要就 Deployment。

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: tasks
spec:
  serviceName: "postgres-service"
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_DB
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: postgres-password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 5Gi
```

volumeClaimTemplates 是 StatefulSet 特有的，Deployment 沒有。StatefulSet 用這個模板自動幫每個 Pod 建一個專屬的 PVC。一個副本就建一個 PVC，名字是 postgres-storage-postgres-0。三個副本就建三個，每個 Pod 自己一個，不共享。

accessModes 設 ReadWriteOnce，代表這個 PVC 只能被一個 Node 掛載。PostgreSQL 不需要多個 Node 同時寫同一個磁碟，ReadWriteOnce 就夠了。

PostgreSQL 的 Service 要用 Headless Service：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: tasks
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None
```

clusterIP: None 就是 Headless Service。普通的 ClusterIP Service 有一個虛擬 IP，流量打進來 K8s 做負載均衡隨機發給後端 Pod，你不知道打到哪一個。Headless Service 沒有虛擬 IP，DNS 查詢直接回傳 Pod 的真實 IP，而且每個 Pod 可以用穩定名稱定址，postgres-0.postgres-service。

StatefulSet 要搭配 Headless Service，因為有些場景你需要連到特定的 Pod。比如 PostgreSQL 主從複製，Slave 要連到 Master，不能連到隨機一個節點。我們這個系統只有一個副本，沒有主從，但還是用 Headless Service，這是搭配 StatefulSet 的標準做法。

指令：kubectl apply -f postgres.yaml

指令：kubectl get statefulset -n tasks

等 READY 顯示 1/1。

指令：kubectl get pvc -n tasks

你會看到 postgres-storage-postgres-0，STATUS 是 Bound，代表已經分配到實際的儲存空間。

---

### Redis（Deployment）— 為什麼這裡不用 StatefulSet

Redis 也在存資料，為什麼用 Deployment 不用 StatefulSet？

在這套系統裡，Redis 只是暫存的任務佇列，不是主要資料庫。任務真正的狀態存在 PostgreSQL。Redis 裡的任務如果因為 Pod 重啟消失，CronJob 下次觸發時會重新把待執行的任務撈出來再丟進去，系統自動恢復。重啟丟資料是可以接受的。

判斷原則：這份資料重啟之後能不能自動重建？能就 Deployment，不能就 StatefulSet。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: tasks
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7
        command: ["/bin/sh", "-c", "redis-server --requirepass $REDIS_PASSWORD"]
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-password
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: tasks
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

Redis 的 Service 用普通的 ClusterIP，不是 Headless Service。Redis 不需要主從定址，任何一個 Redis 實例都行，普通的負載均衡就夠了。

說到 Service 類型，這裡把三種統一說清楚。

ClusterIP 是預設，只在叢集內部可以存取，外面連不進來。PostgreSQL、Redis、Backend API、Frontend 的 Service，全部用 ClusterIP。這些服務只需要叢集內部可以連，不需要對外暴露，用 ClusterIP 最安全。

NodePort 在每個 Node 上開一個固定的 Port，範圍 30000 到 32767，外部可以用 Node IP 加這個 Port 連進來。缺點是 Port 號醜、沒有域名、功能少。適合測試環境，不適合生產。

LoadBalancer 讓雲端提供商幫你建一個真正的 Load Balancer，給你一個公開 IP。要在雲端上才有，本機的 k3s 或 minikube 用 LoadBalancer type 會一直 pending。

這套系統對外暴露用 Ingress，不是 NodePort 或 LoadBalancer。Ingress 統一入口，域名路由、SSL、rewrite 全部在這裡處理，一個 Ingress 管所有對外服務。

指令：kubectl apply -f redis.yaml

指令：kubectl get pods -n tasks

等 postgres-0 和 redis 的 Pod 都是 Running。

驗證 PostgreSQL：

指令：kubectl exec -it postgres-0 -n tasks -- psql -U postgres -d taskdb

進去之後：

指令：\l

指令：\q

能進去代表資料庫正常。

---

### Job — 一次性資料庫初始化

第一個應用程式不是 Backend，是一個 Job，負責跑資料庫 schema migration，建立資料表。

為什麼用 Job 不用 Deployment？Deployment 的目標是讓 Pod 一直保持存活。Migration 跑完程序退出，Deployment 看到 Pod 死了就一直重啟它，你的 migration 會反覆跑，產生衝突或錯誤。Job 是為跑完就結束的任務設計的，Pod 結束之後 Job 不重啟，只記錄成功或失敗。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
  namespace: tasks
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migrate
        image: your-registry/task-api:v1
        command: ["node", "migrate.js"]
        env:
        - name: POSTGRES_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_HOST
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_DB
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: postgres-password
  backoffLimit: 3
```

restartPolicy Never，Pod 失敗了不重啟這個 Pod，Job 建一個新的 Pod 重試，舊的 Pod 留著讓你看 log。backoffLimit 3，最多重試三次，三次都失敗 Job 標記為 Failed，你知道有問題要去查。

指令：kubectl apply -f db-migrate-job.yaml

指令：kubectl get job -n tasks

等 COMPLETIONS 顯示 1/1，migration 成功。

指令：kubectl logs job/db-migrate -n tasks

看 log 確認沒有錯誤。

---

### RBAC — 給 Backend 最小讀取權限

Backend API 在 runtime 需要讀 ConfigMap。用 RBAC 只給讀取的權限，不給多餘的。

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backend-sa
  namespace: tasks
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: backend-role
  namespace: tasks
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: backend-rolebinding
  namespace: tasks
subjects:
- kind: ServiceAccount
  name: backend-sa
  namespace: tasks
roleRef:
  kind: Role
  name: backend-role
  apiGroup: rbac.authorization.k8s.io
```

上午學的 RBAC，現在用在真實系統上。verbs 只有 get 和 list，沒有 create、update、delete。

指令：kubectl apply -f backend-rbac.yaml

---

### Backend API（Deployment + Service）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: tasks
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      serviceAccountName: backend-sa
      containers:
      - name: backend
        image: your-registry/task-api:v1
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: postgres-password
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: tasks
spec:
  selector:
    app: backend
  ports:
  - port: 3000
    targetPort: 3000
```

幾個重點。

serviceAccountName: backend-sa，把 Pod 的身份設成剛才建的 ServiceAccount，K8s 自動把對應的 token 掛進去，Pod 就有讀取 ConfigMap 的權限。

envFrom 的 configMapRef 是一次把整個 ConfigMap 所有 key 都設成環境變數，不用一條一條列。但 Secret 不建議用 envFrom，那樣 Secret 裡的所有欄位都會暴露給容器，不符合最小權限。Secret 要用 env.valueFrom.secretKeyRef 一條一條明確列，只讓容器看到需要的那幾個。

resources.requests.cpu 設 100m。這是 HPA 的前提。HPA 計算目前使用量除以 request 等於百分比，沒有 request 就算不出來，HPA 的 TARGETS 會一直顯示 unknown。

readinessProbe。Pod Running 不等於可以接流量。Node.js 啟動需要幾秒，連資料庫也需要時間。readinessProbe 每隔幾秒打一次 /health，只有回應 200，K8s 才把這個 Pod 加進 Service 的後端列表，開始分流量。沒有 readinessProbe，Pod 一起來就被打流量，但應用還沒初始化完成，使用者看到錯誤。

Backend Service 用 ClusterIP。外部的請求先打 Ingress，Ingress 轉給 Backend 的 ClusterIP Service。用 NodePort 會額外開一個 30000+ 的 Port，多餘的攻擊面，沒必要。

指令：kubectl apply -f backend.yaml

指令：kubectl get pods -n tasks -l app=backend

等兩個 backend Pod 都 Running 且 READY 顯示 1/1，readinessProbe 通過才會顯示 1/1。

驗證：

指令：kubectl port-forward service/backend-service 3000:3000 -n tasks

另開終端機：

指令：curl http://localhost:3000/health

看到 {"status":"ok"} 代表後端正常。

---

### Frontend（Deployment + Service）

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: tasks
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/task-frontend:v1
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_API_URL
          value: "http://task.example.com/api"
        resources:
          requests:
            cpu: "50m"
            memory: "64Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: tasks
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
```

Frontend 是 Nginx 靜態伺服器，serve build 出來的 React 靜態檔。ClusterIP Service，對外暴露交給 Ingress。

指令：kubectl apply -f frontend.yaml

---

### Task Runner（Deployment）— 為什麼沒有 Service，為什麼不是 DaemonSet

Task Runner 跑起來，要不要建 Service？不需要。Service 的作用是讓別人連進來。Task Runner 是主動去 Redis Queue 拉任務，沒有人要連到它，它連到 Redis。方向是反的，Task Runner 是 client，Redis 是 server，所以 Task Runner 不需要 Service。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: task-runner
  namespace: tasks
spec:
  replicas: 3
  selector:
    matchLabels:
      app: task-runner
  template:
    metadata:
      labels:
        app: task-runner
    spec:
      containers:
      - name: task-runner
        image: your-registry/task-task-runner:v1
        command: ["node", "task-runner.js"]
        envFrom:
        - configMapRef:
            name: app-config
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: postgres-password
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-password
        resources:
          requests:
            cpu: "200m"
            memory: "256Mi"
          limits:
            cpu: "1000m"
            memory: "512Mi"
```

三個副本，三個同時從 Queue 拉任務，吞吐量是一個的三倍。Redis 的 BLPOP 是原子操作，同一個任務只會被一個 Task Runner 拿走，不會重複執行。

有人會問：Task Runner 要一直跑，是不是每個 Node 都要有一個，聽起來像 DaemonSet？

DaemonSet 的定義是：保證每個 Node 上都跑一個 Pod。你有五個 Node 就有五個 Pod，加到十個 Node 就自動變十個 Pod。

DaemonSet 適合跟 Node 綁定的任務。日誌收集 Agent：每個 Node 上的 Pod 都在 Node 的本機磁碟上產生 log，你需要每個 Node 都有一個 Agent 去讀自己節點上的 log。跨節點讀別人的本機磁碟做不到。監控 Agent：node-exporter 收集 Node 層級的 metrics，每個 Node 一個。網路插件：kube-proxy 在每個 Node 上管理 iptables 規則，每個 Node 要有。

Task Runner 消費的是 Redis Queue 裡的任務，跟 Node 數量完全沒關係。三個 Node 不代表要三個 Worker，三個 Task Runner 也不代表只能有三個 Node。Task Runner 數量取決於任務量，不取決於 Node 數量。

如果你用 DaemonSet，叢集擴到 100 個 Node 就有 100 個 Task Runner，這不是你要的。

判斷原則一句話：跟 Node 數量綁定就用 DaemonSet，不綁定就用 Deployment。

指令：kubectl apply -f task-runner.yaml

---

### CronJob — 定時觸發排程任務

CronJob 每分鐘掃一次資料庫，把到期的任務撈出來丟進 Queue：

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: task-scheduler
  namespace: tasks
spec:
  schedule: "* * * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: scheduler
            image: your-registry/task-scheduler:v1
            command: ["node", "enqueue-due-tasks.js"]
            envFrom:
            - configMapRef:
                name: app-config
            env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: postgres-password
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: redis-password
```

schedule 的 Cron 語法，五個欄位從左到右是分、時、日、月、週。全星號代表每分鐘。0 9 * * * 是每天早上九點，0 */6 * * * 是每六小時，*/5 * * * * 是每五分鐘。

concurrencyPolicy 三個選項。Allow 是預設，允許同時跑多個 Job。Forbid 是上一個還沒跑完就跳過這次，防止同一批任務被重複入隊，我們用這個。Replace 是砍掉上一個還在跑的，起一個新的，適合跑最新的就好、舊的不重要的場景。

指令：kubectl apply -f cronjob.yaml

等一分鐘：

指令：kubectl get job -n tasks

你會看到 CronJob 自動建立了 Job，COMPLETIONS 1/1。

---

### Ingress — 對外暴露，為什麼用 Ingress 不用 NodePort

Frontend 和 Backend 的 Service 都是 ClusterIP，外面連不進來。用 Ingress 對外開放。

為什麼是 Ingress 不是 NodePort？NodePort 的 Port 號在 30000 以上，地址醜、沒有域名、沒有 SSL、沒有路由功能。你有五個服務就要開五個 NodePort，管理起來是噩夢。Ingress 統一入口，一個 Ingress Controller 在叢集裡跑，所有對外流量都打它，它根據域名和路徑路由到不同的 Service。TLS、rewrite、IP 白名單全部集中在這裡處理。

k3s 內建的 Ingress Controller 是 Traefik，不是 nginx。所以 ingressClassName 要寫 traefik，不是 nginx。

Traefik 的 path strip 要用 Middleware 做。先建一個 Middleware 把 /api 前綴剝掉：

```yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: strip-api-prefix
  namespace: tasks
spec:
  stripPrefix:
    prefixes:
      - /api
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tasks-ingress
  namespace: tasks
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: tasks-strip-api-prefix@kubernetescrd
spec:
  ingressClassName: traefik
  rules:
  - host: task.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 3000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

path rewrite 說明。使用者打 task.example.com/api/tasks，Traefik 先比對 /api 這條規則，然後 Middleware strip-api-prefix 把 /api 剝掉，Backend 收到的是 /tasks。如果沒有 strip，Backend 收到的是 /api/tasks，你的 API route 是 /tasks，就 404 了。

Middleware 的 annotation 格式是 namespace-middleware名稱@kubernetescrd，這是 Traefik CRD 的固定寫法，記住這個格式。

指令：kubectl apply -f ingress.yaml

指令：kubectl get ingress -n tasks

確認 ADDRESS 有 IP，代表 Ingress Controller 接管了這條規則。

---

### HPA — 自動擴縮

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: tasks
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

上午學的 HPA，現在用在真實系統上。CPU 超過 70% 就擴，低於 70% 就縮。HPA 能運作的前提是 Pod 要設 resources.requests.cpu，Backend 的 YAML 設了 100m，沒問題。

指令：kubectl apply -f hpa.yaml

指令：kubectl get hpa -n tasks

TARGETS 顯示目前 CPU 使用率和目標。

### 全系統驗收

指令：kubectl get all -n tasks

確認 StatefulSet postgres READY 1/1、Deployment redis/backend/frontend/task-runner 都 READY、CronJob 存在。

指令：kubectl get pvc -n tasks

postgres-storage-postgres-0 STATUS 是 Bound。

指令：kubectl get secret,configmap,serviceaccount,role,rolebinding -n tasks

全部都存在，系統完整部署完成。

---

# 影片 7-10：QA + 學員題目 + 解答（~15min）

## 本集重點

- 老師 QA：常見問題統一回答
- 學員題目：自己從零建短網址服務
- 解答提示

## 逐字稿

好，先回答幾個剛才操作過程中常見的問題。

Q：PVC 一直是 Pending，不是 Bound，怎麼辦？

A：kubectl get pvc -n tasks 看 STATUS，如果是 Pending，原因通常是叢集沒有對應的 StorageClass 可以動態佈建。kubectl get storageclass 確認有沒有預設的 StorageClass，k3s 內建 local-path，minikube 用 standard。如果 StorageClass 存在但還是 Pending，kubectl describe pvc 看 Events，通常會寫清楚為什麼找不到合適的 PV。

Q：Pod 一直 CrashLoopBackOff，怎麼查？

A：kubectl logs pod名稱 -n tasks 看最後幾行。最常見的是三個原因。第一，資料庫還沒準備好，Migration 還沒跑完就部署了 Backend，Backend 連不上 DB 就 crash。順序要對，先等 postgres Running，跑完 migration 再部署 Backend。第二，Secret 名稱拼錯，env 裡的 secretKeyRef.name 要完全對應 Secret 的名字。第三，ConfigMap 的 key 打錯，valueFrom.configMapKeyRef.key 要跟 ConfigMap 裡的 key 名稱完全一樣。

Q：HPA 的 TARGETS 一直顯示 unknown，怎麼辦？

A：兩個原因。第一，Pod 沒有設 resources.requests.cpu，HPA 算不出百分比。回去 Deployment YAML 加上 requests，重新 apply。第二，metrics-server 剛啟動還在收集數據，等一分鐘再看。如果等五分鐘還是 unknown，kubectl top pods -n tasks 看看能不能出現數字，不能的話看 metrics-server 的 logs。

Q：Task Runner 啟動了，但 Queue 裡的任務沒有被消費？

A：kubectl logs -l app=task-runner -n tasks 看 Task Runner 的 log。最常見是 Redis 連線失敗，通常是 REDIS_HOST 或 REDIS_PASSWORD 設錯。確認 redis-service 存在、Redis Pod 是 Running 狀態，然後確認 ConfigMap 和 Secret 的值對不對。

---

### Helm 示範 — 同一套系統，用 Helm 管理

好，QA 結束。在進入學員題目之前，我要用剛才這套系統示範一件事。

你剛才用 kubectl apply 一個一個把 YAML 打上去。這在管理一套系統的時候有個問題：版本怎麼追蹤？rollback 怎麼做？要換一個設定值，你要去找哪個 YAML 改，apply 之後怎麼知道有沒有漏掉？

這就是 Helm 要解決的問題。我把這套任務排程系統包成一個 Helm Chart，接下來示範四件事：install、upgrade、rollback、換 values。

---

先清掉剛才用 kubectl apply 建的東西：

指令：kubectl delete namespace tasks

等 namespace 刪乾淨：

指令：kubectl get ns

---

**Step 1 — helm install**

一行部署整套系統：

指令：helm install task-system ./apps/helm/task-system

這一行做的事，等於你剛才打的所有 kubectl apply 加起來。

看部署狀態：

指令：helm list

指令：kubectl get all -n tasks

等所有 Pod READY，migration Job 也跑完。

---

**Step 2 — helm upgrade（換 image tag + 擴副本）**

現在假設你出了 v2，backend 副本要從 2 擴到 3：

指令：helm upgrade task-system ./apps/helm/task-system -f apps/helm/values-v2.yaml

Helm 只更新有變的資源，沒變的不動。

看 history：

指令：helm history task-system

你會看到兩個 REVISION，REVISION 1 是 install，REVISION 2 是這次 upgrade。

---

**Step 3 — helm rollback**

upgrade 之後發現 v2 有問題，一行 rollback：

指令：helm rollback task-system 1

rollback 不是覆蓋 REVISION 1，它建立一個新的 REVISION 3，內容跟 REVISION 1 一樣。history 完整保留，你知道每一次動了什麼。

指令：helm history task-system

---

**Step 4 — --set 換單一 value**

不用改 values.yaml，直接 --set 覆蓋單一值：

指令：helm upgrade task-system ./apps/helm/task-system --set replicas.backend=5

指令：kubectl get pods -n tasks -l app=backend

backend Pod 從 2 個變 5 個。--set 適合臨時調整，正式環境還是用 values 檔記錄。

---

四個操作總結：

| 操作 | 指令 |
|------|------|
| 部署整套系統 | `helm install task-system ./apps/helm/task-system` |
| 升級版本 | `helm upgrade task-system ./apps/helm/task-system -f values-v2.yaml` |
| 查歷史 | `helm history task-system` |
| Rollback | `helm rollback task-system 1` |
| 換單一值 | `helm upgrade task-system ./apps/helm/task-system --set replicas.backend=5` |
| 清除整套 | `helm uninstall task-system` |

這就是為什麼生產環境都用 Helm 管理，不用裸 YAML。版本有歷史、rollback 一行、設定值集中在一個地方。

---

好，QA 結束。換大家動手了。

下一個 Loop 是學員自架。主題是短網址服務。我給你需求，你自己設計架構，自己寫 YAML，自己部署。

這套系統的功能：使用者輸入一個長網址，系統回傳一個短網址，比如 short.ly/abc123。使用者打短網址，系統查資料庫，跳轉到原始的長網址。

需要的組件：Frontend、Backend API、資料庫（你來選用什麼）。你要決定哪些東西用 Deployment，哪些用 StatefulSet，Service 用哪種類型，需不需要 Ingress，需不需要 HPA，需不需要 RBAC。

這個決策過程就是今天下午的重點。你不是在背指令，你是在練習做選擇。

給你一些提示。短網址的資料不能丟，你選的資料庫要能持久化。短網址查詢的流量可能很高，你考慮一下要不要加 HPA。短網址服務對外要用域名，不是 IP 加 Port。

題目就這樣，動手吧。有問題可以舉手，但先試試看自己想。

---

解答時間。

資料庫選 PostgreSQL 或 Redis 都合理。PostgreSQL 比較完整，支援複雜查詢。Redis 速度很快，短網址查詢幾乎都是 key-value lookup，Redis 很適合。如果你選 Redis 做持久化，這時候要用 StatefulSet，因為資料不能丟了。

服務清單：Frontend Deployment + ClusterIP Service、Backend API Deployment + ClusterIP Service、資料庫 StatefulSet + Headless Service + PVC。

是否需要 HPA？短網址服務的讀取流量可能很高，Backend API 加 HPA 是合理的。記得設 resources.requests.cpu。

是否需要 RBAC？如果 Backend 需要在 runtime 讀取 K8s 的 ConfigMap 或 Secret，需要。如果你只是在 Pod 啟動時注入環境變數，不需要 ServiceAccount 也能跑。

Ingress 一定要，對外要用域名，不用 NodePort。

這就是一套完整的判斷流程。你從需求出發，一個一個決定用什麼組件，這才是真正的 K8s 工程師在做的事情。

今天的課程到這裡結束。謝謝大家。
