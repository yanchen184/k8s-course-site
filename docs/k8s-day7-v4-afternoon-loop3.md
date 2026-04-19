# 第七堂下午逐字稿 v4 — Loop 3：從零部署（任務排程系統，講師示範）

> 影片：7-8（1 問題）、7-9（2 解法 + 3 示範上）、7-10（3 示範中）、7-11（3 示範下）、7-12（4 學員實作）、7-13（5 回頭操作）
> 主線：用一套真實系統，把四堂課所有核心組件全部串起來
> 系統架構：Frontend → Backend API → Redis Queue → Worker → PostgreSQL
> Loop 結構：1 問題 → 2 解法 → 3 示範 → 4 學員實作 → 5 回頭操作

---

# 影片 7-8：Loop 3 第一步 — 問題（~10min）

## 本集重點

- 問題：學了 K8s 很多組件，但從來沒有把它們全部串在一起過
- 每個 Loop 只學了一個組件，真實系統需要同時用十幾個
- 選題說明：為什麼是任務排程系統，覆蓋哪些組件
- 架構圖：六個服務，十二個 K8s 核心組件

## 逐字稿

好，上午搞定了 HPA 和 RBAC。下午進入最後一個部分，也是整個課程最重要的環節。

我們來直接面對一個問題。到目前為止，你學了很多東西。Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、HPA、RBAC、Job、CronJob。

但你可能有一個感覺：我好像知道每個組件是什麼，但要我從零建一套系統，我不知道要從哪裡開始。

這個感覺是正常的。我們之前是一個一個學，每個 Loop 只動到一個組件。但真實的系統需要同時把這些組件組合在一起，而且每個地方都要做出選擇：這裡用 Deployment 還是 StatefulSet？這個 Service 要用 ClusterIP 還是 NodePort？這裡需不需要 PVC？

你沒有辦法靠記憶把這些選擇背起來。你需要的是一次完整的親眼示範，看一個真實的系統是怎麼從零組起來的。

下午我們就做這件事。我來示範，你跟著看，同時理解每一個選擇背後的原因。

這套系統叫做任務排程系統。先讓我說明它的功能。

使用者打開瀏覽器，建立一個任務：每天早上九點寄出報表 Email。點送出。這個請求打到 Backend API，API 把任務丟進 Redis Queue，然後馬上回應使用者任務已建立。

這時候有一個 Worker 一直在跑，不斷從 Queue 裡面拿任務出來處理。處理完，把結果存進 PostgreSQL。另外有一個 CronJob，定時觸發，把到期的排程任務撈出來丟進 Queue，讓 Worker 去執行。

這就是非同步任務系統的標準架構。業界的 Celery、Bull、Sidekiq，都是這個模式。

我選這個系統的原因只有一個：它能覆蓋最多的 K8s 核心組件。

我們來數一下。

Deployment，跑 Frontend、Backend、Worker 這些無狀態的服務。StatefulSet，跑 PostgreSQL，因為資料庫需要穩定的身份和持久的磁碟。PVC，PostgreSQL 的資料要落磁碟。ConfigMap，存 DB 主機名、Redis 位址這些設定值。Secret，存 DB 密碼、Redis 密碼。Service，每個服務之間的內部通訊。Ingress，對外暴露 Frontend 和 Backend API。HPA，Backend 流量高時自動擴 Pod。RBAC，給 Worker 最小的讀取 ConfigMap 權限。Job，一次性的資料庫 schema migration。CronJob，定時觸發排程任務。DaemonSet，我會解釋 Worker 為什麼不用 DaemonSet，以及 DaemonSet 真正適合的場景。

十二個核心組件，一套系統。我們開始。

---

# 影片 7-9：Loop 3 第二步 + 第三步（上）— 解法 + 示範：基礎建設（~18min）

## 本集重點

- 解法：這套系統的完整架構選型，每個選擇的原因
- Service 三種類型的選擇原則：ClusterIP / NodePort / LoadBalancer
- 為什麼用 Ingress 不用 NodePort 對外暴露
- 示範：Namespace、Secret、ConfigMap
- 示範：PostgreSQL（StatefulSet）— 為什麼不用 Deployment
- Headless Service 是什麼，StatefulSet 為什麼要搭配它
- 示範：Redis（Deployment）— 為什麼這裡不用 StatefulSet

## 逐字稿

好，在動手之前，先把這套系統的架構選型講清楚。每個地方用什麼組件、為什麼，你要在心裡有一張圖。

### 架構選型

Frontend 和 Backend API 用 Deployment。這兩個服務是無狀態的，Pod 隨時可以砍掉重建，不怕資料丟失。

PostgreSQL 用 StatefulSet。不是 Deployment。原因很具體，等一下部署的時候細講。

Redis 用 Deployment。雖然 Redis 也在存資料，但在這個架構裡它只是暫存的任務佇列。等一下說明。

Worker 用 Deployment。不是 DaemonSet。等一下說明。

Service 的類型，這裡要講清楚。K8s 的 Service 有三種類型。

ClusterIP 是預設類型，只在叢集內部可以存取，外面完全連不進來。用在：服務之間的內部通訊。PostgreSQL、Redis、Backend API 的 Service，全部用 ClusterIP。這些服務只需要叢集內部可以連到，不需要對外暴露。用 ClusterIP 是最安全的選擇，不會意外把資料庫暴露到外面。

NodePort 在每個 Node 上開一個固定的 Port，通常在 30000 到 32767 的範圍，外部可以透過 Node 的 IP 加上這個 Port 連進來。缺點是 Port 號很醜，而且每個需要對外的服務都要佔一個 Port，管理起來很麻煩。適合測試環境，不適合生產。

LoadBalancer 讓雲端提供商幫你建一個真正的 Load Balancer，給你一個公開 IP。適合生產環境，但要在雲端上才有。本機的 minikube 或 k3s 通常沒有雲端 LoadBalancer，Service type 設成 LoadBalancer 會一直 pending 。

那我們怎麼對外暴露 Frontend 和 Backend？用 Ingress。Ingress 是統一的流量入口，一個 Ingress Controller 在叢集裡跑，所有對外流量都打它，它再根據域名和路徑路由到不同的 Service。Frontend 和 Backend 自己的 Service 用 ClusterIP，Ingress 負責對外暴露。這樣的好處是 TLS 集中在 Ingress 處理、路由規則集中管理、後端 Service 不用暴露多個 Port。

Worker 不需要 Service。Service 的作用是讓別人連進來。Worker 是主動去 Redis Queue 拉任務，沒有人要連到 Worker，所以不需要 Service。

好，架構清楚了，開始動手。

### 建立 Namespace

第一步建 Namespace，把這套系統跟叢集上其他東西隔開。

指令：kubectl create namespace taskscheduler

之後所有指令都加 -n taskscheduler。生產環境的標準做法是一個系統一個 Namespace，或者 dev、staging、production 各自獨立，資源不互相干擾，權限也可以按 Namespace 分開控管。

### 建立 Secret

密碼放 Secret，不是 ConfigMap。

Secret 和 ConfigMap 的分界線只有一條：洩漏出去會有問題的東西放 Secret，不會有問題的放 ConfigMap。DB 密碼、Redis 密碼、JWT secret，全部放 Secret。DB 主機名、Port 號、DB 名稱，放 ConfigMap。

來看 YAML：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: taskscheduler
type: Opaque
stringData:
  postgres-password: "MyPostgresP@ssw0rd"
  redis-password: "MyRedisP@ssw0rd"
  jwt-secret: "MyJwtSuperSecret"
```

stringData 和 data 的差別：stringData 你填明文，K8s 幫你 base64 encode 再存。data 你要自己先 base64 encode 填進去。用 stringData 比較方便，但記得這個 YAML 不要放進 git，或者用 Sealed Secrets 這類工具管理。

指令：kubectl apply -f secret.yaml

驗證：

指令：kubectl get secret app-secrets -n taskscheduler

你只會看到 NAME、TYPE、DATA 欄位數量，看不到值。就算 describe 也看不到值。這是 K8s 的設計，防止 Secret 在 log 或終端機輸出中洩漏。

### 建立 ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: taskscheduler
data:
  POSTGRES_HOST: "postgres-service"
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "taskdb"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  API_URL: "http://backend-service:3000"
```

注意 POSTGRES_HOST 的值是 postgres-service，這就是等一下我們要建的 Service 名稱。K8s 有內建 DNS，每個 Service 建立之後，叢集內部就可以用 Service 名稱直接連到它。在同一個 Namespace 裡，直接用短名稱就夠了，K8s DNS 自動解析。Pod 重啟換了 IP 也沒關係，Service 的 DNS 名稱不變。

指令：kubectl apply -f configmap.yaml

### 部署 PostgreSQL — 為什麼用 StatefulSet 不用 Deployment

這是很多人剛學 K8s 會問的問題。PostgreSQL 也是跑在 Pod 裡，為什麼不能用 Deployment？

Deployment 的 Pod 有幾個特性。Pod 名稱是隨機的，重啟之後名稱會換，可能跑到不同的 Node 上。如果你用 Deployment 跑 PostgreSQL，今天 Pod 在 Node A，掛著某個磁碟。Pod 重啟後跑到 Node B，B 上沒有那個磁碟，或者掛到不同的 PVC，資料就消失了。

StatefulSet 解決的是三件事。第一，Pod 有穩定的名稱。postgres-0、postgres-1，重啟後名稱不變。第二，Pod 有穩定的 DNS，postgres-0.postgres-service 這個名稱永遠指向 postgres-0 這個 Pod，不管它在哪個 Node 上。第三，每個 Pod 有自己的 PVC，postgres-0 永遠掛自己的那個 PVC，重啟之後還是掛同一個磁碟，資料不丟。

判斷原則就是：這個服務需要「穩定的身份（固定名稱和固定儲存）」嗎？需要就用 StatefulSet，不需要就用 Deployment。

來看 YAML：

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: taskscheduler
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

幾個重點。env 裡面 DB 名稱從 ConfigMap 拿，密碼從 Secret 拿，用 valueFrom 注入成環境變數，PostgreSQL 的啟動 script 讀這些環境變數做初始化。

volumeClaimTemplates 是 StatefulSet 特有的欄位，Deployment 沒有。StatefulSet 用這個模板自動幫每個 Pod 建一個專屬的 PVC。我們只有一個副本，所以建一個 PVC，名字是 postgres-storage-postgres-0。如果有三個副本，就建三個，分別叫 postgres-storage-postgres-0、postgres-storage-postgres-1、postgres-storage-postgres-2，每個 Pod 掛自己的。

accessModes 設 ReadWriteOnce，代表這個 PVC 只能被一個 Node 上的 Pod 掛載。PostgreSQL 不需要多個 Node 同時寫同一個磁碟，ReadWriteOnce 就夠了。

PostgreSQL 的 Service 要用 Headless Service：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: taskscheduler
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None
```

clusterIP: None 就是 Headless Service。普通的 ClusterIP Service 有一個虛擬 IP，流量打進來 K8s 做負載均衡發給後端 Pod，你不知道打到哪一個。Headless Service 沒有虛擬 IP，DNS 查詢直接回傳 Pod 的真實 IP 列表，而且每個 Pod 可以用穩定的 DNS 名稱定址，postgres-0.postgres-service。

StatefulSet 要搭配 Headless Service 的原因是：有些場景你需要連到特定的 Pod，不能隨機。比如 PostgreSQL 主從複製，Slave 要連到 Master，不能連到隨機一個節點。我們這個系統只有一個副本，沒有主從，但還是用 Headless Service，這是搭配 StatefulSet 的標準做法。

指令：kubectl apply -f postgres.yaml

指令：kubectl get statefulset -n taskscheduler

等 READY 顯示 1/1。

指令：kubectl get pvc -n taskscheduler

你會看到 postgres-storage-postgres-0，狀態是 Bound，代表已經分配到實際的儲存空間。

### 部署 Redis — 為什麼這裡用 Deployment 不用 StatefulSet

Redis 也有持久化的功能，為什麼不用 StatefulSet？

在這套系統裡，Redis 只是暫存的任務佇列，不是主要資料庫。任務真正的狀態存在 PostgreSQL。Redis 裡的任務如果因為 Pod 重啟消失，CronJob 下次觸發時會重新把待執行的任務撈出來再丟進去，系統自動恢復。重啟丟資料是可以接受的。

判斷原則：這份資料重啟之後能不能自動重建？能就 Deployment，不能就 StatefulSet。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: taskscheduler
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
        command: ["redis-server", "--requirepass", "$(REDIS_PASSWORD)"]
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
  namespace: taskscheduler
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

Redis 的 Service 用普通的 ClusterIP，不是 Headless Service。Redis 不需要主從定址，任何 Redis 實例都行，普通的 ClusterIP Service 負載均衡就夠了。

指令：kubectl apply -f redis.yaml

指令：kubectl get pods -n taskscheduler

等 postgres-0 和 redis 的 Pod 都是 Running。

驗證 PostgreSQL 可以連進去：

指令：kubectl exec -it postgres-0 -n taskscheduler -- psql -U postgres -d taskdb

進去之後：

指令：\l

指令：\q

能進去代表基礎建設完成。

---

# 影片 7-10：Loop 3 第三步（中）— 示範：Job + RBAC + Backend + Frontend（~18min）

## 本集重點

- Job 跑一次性 DB migration：為什麼不用 Deployment
- restartPolicy Never vs OnFailure 的差別
- RBAC：給 Backend 最小讀取 ConfigMap 的權限
- envFrom vs 逐一列 env：什麼時候用哪個
- readinessProbe：Pod Running 不等於可以接流量
- Backend Service 為什麼用 ClusterIP 不用 NodePort

## 逐字稿

基礎建設好了，下一步部署應用程式。

### 資料庫初始化 Job

第一件事是跑 schema migration，建立資料表。

為什麼用 Job 不用 Deployment 去跑這個？Deployment 的目標是讓 Pod 一直保持存活。Migration 跑完程序退出，Deployment 看到 Pod 死了就一直重啟它。你的 migration 會反覆跑，產生衝突或錯誤。Job 是為跑完就結束的任務設計的，Pod 結束之後 Job 不重啟，只記錄成功或失敗。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
  namespace: taskscheduler
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

restartPolicy Never 和 OnFailure 的差別。Never 是 Pod 失敗了，不重啟這個 Pod，Job 重新建一個新的 Pod 來跑，舊的 Pod 留著讓你看 log。OnFailure 是原地重啟同一個 Pod，log 會被覆蓋。Migration 用 Never 比較好，每次失敗都有獨立的 Pod 記錄，比較好 debug。

backoffLimit 3 代表總共最多重試三次，三次都失敗 Job 標記為 Failed，你知道有問題要去查。

指令：kubectl apply -f db-migrate-job.yaml

指令：kubectl get job -n taskscheduler

等 COMPLETIONS 顯示 1/1，代表 migration 成功。

指令：kubectl logs job/db-migrate -n taskscheduler

看 log 確認沒有錯誤。

### RBAC — 給 Backend 最小權限

Backend API 在 runtime 需要讀 ConfigMap。我們用 RBAC 只給讀取的權限，不給多餘的。

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backend-sa
  namespace: taskscheduler
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: backend-role
  namespace: taskscheduler
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: backend-rolebinding
  namespace: taskscheduler
subjects:
- kind: ServiceAccount
  name: backend-sa
  namespace: taskscheduler
roleRef:
  kind: Role
  name: backend-role
  apiGroup: rbac.authorization.k8s.io
```

這是早上學的 RBAC，現在用在真實系統上。ServiceAccount 是 Pod 的身份，Role 定義能做什麼，RoleBinding 把身份和權限綁在一起。verbs 只有 get 和 list，沒有 create、update、delete。

指令：kubectl apply -f backend-rbac.yaml

### 部署 Backend API

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: taskscheduler
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
  namespace: taskscheduler
spec:
  selector:
    app: backend
  ports:
  - port: 3000
    targetPort: 3000
```

幾個重點細講。

serviceAccountName: backend-sa，把 Pod 的身份設成剛才建的 ServiceAccount。K8s 自動把對應的 token 掛進 Pod，Pod 就有 RBAC 定義的讀取 ConfigMap 的權限。

envFrom 的 configMapRef 是「一次把整個 ConfigMap 所有 key 都設成環境變數」。ConfigMap 裡有六個 key，Pod 啟動後這六個全部都變成環境變數，不用一條一條列。但 Secret 不建議用 envFrom，因為 Secret 裡的所有欄位都會暴露給容器，不符合最小權限。Secret 要用 env.valueFrom.secretKeyRef 一條一條明確列，只讓容器看到它需要的那幾個。

resources.requests.cpu 設 100m。這是 HPA 運作的前提。HPA 計算「目前使用量除以 request 等於百分比」，沒有 request 就算不出百分比，HPA 的 TARGETS 欄位會一直顯示 unknown。

readinessProbe。Pod 進入 Running 狀態不代表應用程式已經準備好接流量。Node.js 啟動需要幾秒，連資料庫也需要時間。readinessProbe 每隔幾秒打一次 /health 端點，只有回應 200 的時候，K8s 才把這個 Pod 加進 Service 的後端列表，開始分流量給它。沒有 readinessProbe，Pod 一起來就被分到流量，但應用還沒初始化完成，使用者會看到錯誤。

Backend Service 用 ClusterIP 不用 NodePort。Backend 只需要叢集內部可以連到它，Ingress 負責把外部流量轉進來。用 NodePort 會額外在每個 Node 開一個 30000+ 的 Port，多餘的攻擊面，沒有必要。

指令：kubectl apply -f backend.yaml

指令：kubectl get pods -n taskscheduler -l app=backend

等兩個 backend Pod 都 Running 且 READY 顯示 1/1，代表 readinessProbe 通過，Pod 準備好接流量了。

驗證：

指令：kubectl port-forward service/backend-service 3000:3000 -n taskscheduler

另開終端機：

指令：curl http://localhost:3000/health

看到 {"status":"ok"} 代表後端正常。

### 部署 Frontend

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: taskscheduler
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
  namespace: taskscheduler
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
```

Frontend 是 Nginx 靜態伺服器，serve build 出來的 React 靜態檔。一樣 ClusterIP，對外暴露交給 Ingress。

指令：kubectl apply -f frontend.yaml

---

# 影片 7-11：Loop 3 第三步（下）— 示範：Worker + CronJob + Ingress + HPA（~18min）

## 本集重點

- Worker 為什麼不需要 Service
- Deployment vs DaemonSet：判斷原則詳細說明
- CronJob schedule 語法、concurrencyPolicy 三個選項說明
- Ingress 為什麼用 path rewrite，rewrite-target 在做什麼
- HPA 前提確認（CPU request 已設）
- 全系統驗收清單

## 逐字稿

### Worker Deployment

Worker 跑起來之後，要不要幫它建 Service？

不需要。Service 的作用是讓別人連進來。Backend API 有 HTTP 端點，需要 Service 讓 Ingress 能轉發。Worker 是主動去 Redis Queue 拉任務，沒有人要連到它，它連到 Redis。方向是反的，Worker 是 client，Redis 是 server。所以 Worker 不需要 Service。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
  namespace: taskscheduler
spec:
  replicas: 3
  selector:
    matchLabels:
      app: worker
  template:
    metadata:
      labels:
        app: worker
    spec:
      containers:
      - name: worker
        image: your-registry/task-worker:v1
        command: ["node", "worker.js"]
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

三個 Worker 副本，三個同時從 Redis Queue 拿任務。Redis 的 BLPOP 是原子操作，同一個任務只會被一個 Worker 拿走，不會重複執行。

指令：kubectl apply -f worker.yaml

### Deployment vs DaemonSet — 詳細說明

有人會說：Worker 要一直跑，是不是每個 Node 都要有一個？聽起來像 DaemonSet？

DaemonSet 的定義是：保證叢集中每個符合條件的 Node 上都跑一個 Pod。你有五個 Node 就有五個 Pod，你加到十個 Node 就自動變十個 Pod。

DaemonSet 適合的場景是跟 Node 綁定的任務。日誌收集 Agent：每個 Node 上的 Pod 都在 Node 的本機磁碟上產生 log，你需要每個 Node 都有一個收集 Agent 去讀自己節點上的 log。你沒辦法讓一個 Agent 跨節點讀另一台的本機磁碟。監控 Agent：node-exporter 收集 Node 層級的 CPU、記憶體使用率，每個 Node 一個。網路插件：kube-proxy 在每個 Node 上管理 iptables 規則。

Worker 消費的是 Redis Queue 裡的任務，跟 Node 數量完全沒關係。我有三個 Node 不代表我需要三個 Worker，我有三個 Worker 也不代表我只能有三個 Node。Worker 的數量取決於任務量，不取決於 Node 數量。

如果你改成 DaemonSet，你叢集有 100 個 Node，你就有 100 個 Worker。這不是你要的。

判斷原則：問自己一個問題，這個服務跟 Node 的數量綁定嗎？綁定就 DaemonSet，不綁定就 Deployment。

### CronJob

CronJob 負責每分鐘掃一次資料庫，把到期的排程任務撈出來丟進 Redis Queue：

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: task-scheduler
  namespace: taskscheduler
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

schedule 語法是 Cron 格式，五個欄位從左到右是分、時、日、月、週。全星號代表每分鐘。幾個常用的範例：0 9 * * * 是每天早上九點，0 */6 * * * 是每六小時，0 9 * * 1-5 是週一到週五早上九點。

concurrencyPolicy 有三個選項。Allow 是預設，允許同時跑多個 Job。Forbid 是如果上一個還沒跑完，這次跳過不跑，防止同一批任務被重複入隊，我們用這個。Replace 是砍掉上一個還在跑的 Job，起一個新的，適合跑最新的就好、舊的不重要的場景。

successfulJobsHistoryLimit 和 failedJobsHistoryLimit 是保留最近幾個 Job 的記錄，讓你之後可以看 log。設 0 代表不保留，馬上清掉。

指令：kubectl apply -f cronjob.yaml

等一分鐘：

指令：kubectl get job -n taskscheduler

你會看到 CronJob 自動建立了 Job，跑完之後 COMPLETIONS 顯示 1/1。

### 設定 Ingress

Frontend 和 Backend 的 Service 都是 ClusterIP，外面連不進來。用 Ingress 對外開放：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: taskscheduler-ingress
  namespace: taskscheduler
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
  - host: task.example.com
    http:
      paths:
      - path: /api(/|$)(.*)
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

path rewrite 說明一下。使用者打 task.example.com/api/tasks。Ingress 的 path pattern 是 /api(/|$)(.*) ，第二個括號 (.*) 捕捉到 tasks。rewrite-target 是 /$2，意思是把路徑改成 /tasks 再轉發給 Backend。如果沒有 rewrite，Backend 收到的是 /api/tasks，但你的 API route 是 /tasks，就 404 了。

ingressClassName: nginx 是指定用哪個 Ingress Controller。叢集上可能有多個，這裡指定 nginx 的那個。

指令：kubectl apply -f ingress.yaml

指令：kubectl get ingress -n taskscheduler

確認 ADDRESS 有 IP 位址，代表 Ingress Controller 接管了這個規則。

### 設定 HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: taskscheduler
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

這是早上學的 HPA，現在用在真實系統上。Backend 的 CPU 平均超過 70% 就擴，低於 70% 就縮，最少兩個最多十個。HPA 能運作的前提是 Pod 必須設 resources.requests.cpu，我們的 Backend YAML 裡設了 100m，沒問題。

指令：kubectl apply -f hpa.yaml

指令：kubectl get hpa -n taskscheduler

TARGETS 欄位顯示目前使用率和目標，REPLICAS 是 2。

打壓力：

指令：hey -z 60s -c 50 http://task.example.com/api/health

觀察 HPA：

指令：kubectl get hpa backend-hpa -n taskscheduler -w

你會看到 CPU 使用率上升，REPLICAS 跟著往上長。

### 全系統驗收清單

指令：kubectl get all -n taskscheduler

確認以下都正常：

StatefulSet postgres — READY 1/1
Deployment redis — READY 1/1
Deployment backend — READY 2/2 以上
Deployment frontend — READY 2/2
Deployment worker — READY 3/3
CronJob task-scheduler — ACTIVE 0

指令：kubectl get secret,configmap -n taskscheduler

Secret app-secrets 存在，ConfigMap app-config 存在。

指令：kubectl get serviceaccount,role,rolebinding -n taskscheduler

ServiceAccount backend-sa、Role backend-role、RoleBinding backend-rolebinding 都存在。

全部確認，系統完整部署完成。

---

# 影片 7-12：Loop 3 第四步 — 學員實作（~15min）

## 本集重點

- 學員自己按照步驟把整套系統建起來
- 巡堂確認清單：每個關鍵資源都要 Running / Bound / READY
- 挑戰題：把 Backend replicas 改成 4，觀察 HPA 怎麼反應
- 常見錯誤：Pending PVC、Pod CrashLoopBackOff、Secret 名稱拼錯

## 逐字稿

好，換大家動手了。

我把今天的 YAML 全部放在 taskscheduler-all.yaml 裡，你只需要照順序跑這幾個指令。

順序很重要，因為後面的服務依賴前面的。第一步，建 Namespace 和基礎資源：

指令：kubectl apply -f secret.yaml

指令：kubectl apply -f configmap.yaml

第二步，部署資料庫和佇列：

指令：kubectl apply -f postgres.yaml

指令：kubectl apply -f redis.yaml

等兩個都 Running，再繼續：

指令：kubectl get pods -n taskscheduler

第三步，跑資料庫初始化：

指令：kubectl apply -f db-migrate-job.yaml

等 Job 完成：

指令：kubectl get job -n taskscheduler

第四步，部署應用程式：

指令：kubectl apply -f backend-rbac.yaml

指令：kubectl apply -f backend.yaml

指令：kubectl apply -f frontend.yaml

指令：kubectl apply -f worker.yaml

第五步，收尾：

指令：kubectl apply -f cronjob.yaml

指令：kubectl apply -f ingress.yaml

指令：kubectl apply -f hpa.yaml

然後跑驗收：

指令：kubectl get all -n taskscheduler

大家動手，有問題舉手。

巡堂確認清單。StatefulSet postgres 的 READY 要是 1/1。Deployment redis、backend、frontend、worker 的 READY 要是對應 replicas 的數字。Job db-migrate 的 COMPLETIONS 要是 1/1。

挑戰題。你的 Backend Deployment 現在是 2 個副本，HPA 設了最多 10 個、CPU 目標 70%。現在手動把 replicas 改成 4，但不改 HPA：

指令：kubectl scale deployment backend --replicas=4 -n taskscheduler

觀察 HPA 的行為：

指令：kubectl get hpa backend-hpa -n taskscheduler -w

你會發現，如果 CPU 使用率低於 70%，HPA 過一段時間會把 replicas 縮回 2。這就是 HPA 和手動 scale 的衝突：HPA 是最終控制者，它會把 replicas 調整成它認為對的數字，不管你手動設了什麼。

常見的錯誤說三個。

第一，PVC Pending。kubectl get pvc -n taskscheduler 看到 STATUS 是 Pending，不是 Bound。原因通常是叢集沒有對應的 StorageClass 可以動態佈建。kubectl get storageclass 確認有沒有預設的 StorageClass。k3s 內建 local-path，minikube 用 standard。

第二，Pod CrashLoopBackOff。kubectl logs pod 名稱 -n taskscheduler 看最後幾行。最常見是找不到 DB（Migration 還沒跑完就部署 Backend）、Secret 名稱拼錯（env 裡的 secretKeyRef.name 要完全對應）、ConfigMap 的 key 打錯。

第三，HPA TARGETS 顯示 unknown。原因是 Pod 沒有設 resources.requests.cpu，或者 metrics-server 還沒收集到數據。等一分鐘再看，通常就有了。

---

# 影片 7-13：Loop 3 第五步 — 回頭操作 + 因果鏈總結（~10min）

## 本集重點

- 每個組件解決了什麼問題，以及為什麼是這個組件不是別的
- Loop 3 因果鏈小結
- 如果這套系統真的要上生產，還差什麼
- 銜接 Loop 4：換你從零自架（短網址服務）

## 逐字稿

好，回頭把整個系統串一遍。

我們用一組問題和答案來回顧，每個組件是什麼、解決了什麼問題、為什麼選它不選別的。

問題：服務跑在哪裡？答：Deployment 管理 Pod，Pod 跑容器。無狀態服務用 Deployment，可以隨意擴縮、重啟。

問題：PostgreSQL Pod 重啟，資料全部消失。答：Deployment 的 Pod 名稱不固定、儲存不固定。StatefulSet 給每個 Pod 固定的名稱和固定的 PVC，重啟之後還是掛同一個磁碟。判斷原則：需要穩定身份就用 StatefulSet，不需要就用 Deployment。

問題：Redis 也有儲存，為什麼用 Deployment 不用 StatefulSet？答：Redis 在這個架構裡是暫存佇列，資料丟了系統會自動補回來。重啟丟資料是可以接受的，不需要穩定身份。

問題：PostgreSQL 的 Service 為什麼要用 Headless Service？答：StatefulSet 的 Pod 需要可以被穩定名稱定址，postgres-0.postgres-service 永遠指向 postgres-0。普通的 ClusterIP Service 只有虛擬 IP，沒有 Pod 個別的 DNS 名稱。

問題：內部通訊的 Service 為什麼用 ClusterIP 不用 NodePort？答：ClusterIP 只在叢集內部可見，最安全，不會意外把資料庫暴露出去。NodePort 在每個 Node 開一個額外的 Port，增加攻擊面，沒有必要。

問題：對外暴露為什麼用 Ingress 不用 NodePort？答：NodePort 的 Port 號在 30000 以上，地址醜、沒有域名、功能少。Ingress 統一入口，域名路由、SSL、rewrite 全部在這裡處理，一個 Ingress 管所有對外服務。

問題：設定寫死在 Image 裡，改設定要重新 build。答：ConfigMap 存非機密設定，Secret 存密碼，注入成環境變數，Image 跟設定解耦。

問題：Backend 需要讀 ConfigMap，但 Pod 預設沒有 K8s API 的權限。答：ServiceAccount 是 Pod 的身份，Role 定義能做什麼，RoleBinding 綁在一起。只給 get 和 list configmaps，最小權限。

問題：流量暴增，Pod 不夠用，手動 scale 太慢。答：HPA 每 15 秒查 CPU 使用率，自動擴縮。前提是 Pod 要設 resources.requests.cpu。

問題：資料庫初始化是一次性的，不該一直跑。答：Job 跑完就結束，不重啟。失敗最多重試 backoffLimit 次。

問題：要定時觸發排程任務。答：CronJob 按 Cron 語法定時建立 Job。concurrencyPolicy: Forbid 防止重複入隊。

問題：Worker 需要多個平行處理，為什麼是 Deployment 不是 DaemonSet？答：Worker 數量跟 Node 數量無關，跟任務量有關。DaemonSet 是每個 Node 一個，語義不對。Deployment 設 replicas，要幾個設幾個。

這就是完整的因果鏈。一套系統，十二個組件，每一個都是為了解決前一步的問題。

---

如果這套系統要上生產，還需要什麼？

監控：Prometheus 收集 metrics，Grafana 畫圖，AlertManager 打告警。日誌：EFK 集中收集所有 Pod 的 log。備份：PostgreSQL 定期備份到 S3。CI/CD：GitHub Actions 自動 build、測試、用 Helm deploy 到 K8s。多環境：dev、staging、production 各自獨立 Namespace 或獨立叢集。TLS：Cert-manager 自動申請 Let's Encrypt 憑證，掛到 Ingress。

每一個都可以再開一堂課。

好，Loop 3 結束。你剛才看到的是一套完整系統從零部署的完整過程。下一個 Loop，換你自己動手。

Loop 4 的主題是短網址服務。我只給你需求和組件清單，你自己設計架構，自己寫 YAML，自己部署。如果卡住，你的旁邊有人，我也會在。

---

*Loop 3 逐字稿完畢。*
