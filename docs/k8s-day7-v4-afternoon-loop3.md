# 第七堂下午逐字稿 v4 — Loop 3：從零部署（任務排程系統，講師示範）

> 影片：7-8（系統設計說明）、7-9（基礎建設）、7-10（後端部署）、7-11（Worker + CronJob）、7-12（Ingress + HPA + RBAC）、7-13（驗收 + 回顧）
> 主線：用一套真實系統，把四堂課所有核心組件全部串起來
> 系統架構：Frontend → Backend API → Redis Queue → Worker → PostgreSQL

---

# 影片 7-8：系統設計 — 我們要建什麼？（~10min）

## 本集重點

- 任務排程系統功能說明
- 完整架構圖：6 個服務、10+ 個 K8s 核心組件
- 為什麼選這個系統：覆蓋最多核心組件
- 學習方式：講師一步一步示範，學員跟著看

## 逐字稿

好，上午搞定了 HPA 和 RBAC。下午我們做一件很爽的事情：從零建一套真實的系統。

不是 Hello World，不是假的 Demo。是一套有前端、有後端、有資料庫、有非同步任務佇列、有 Worker 的完整系統。

這套系統叫做「任務排程系統」。先讓我說明它能做什麼。

使用者打開瀏覽器，建立一個任務：「每天早上九點寄出報表 Email」。點送出。這個請求打到 Backend API，API 把任務丟進 Redis Queue，然後馬上回應使用者「任務已建立」。

這時候，有一個 Worker 一直在跑，不斷從 Queue 裡面拿任務出來處理。處理完，把結果存進 PostgreSQL。另外有一個 CronJob，每天早上九點準時觸發，把排程任務撈出來送給 Worker 執行。

這就是非同步任務系統的標準架構。在業界，Celery、Bull、Sidekiq、Resque，都是這個模式。

現在看架構圖。

六個服務：
- **Frontend**：React，給使用者操作的介面
- **Backend API**：Node.js，處理 HTTP 請求
- **Redis**：任務佇列，暫存待處理的任務
- **Worker**：獨立的 Node.js 程序，從 Queue 取任務執行
- **PostgreSQL**：主資料庫，存任務和執行記錄
- **CronJob**：定時觸發排程任務

現在數一下這套系統會用到哪些 K8s 組件：

Deployment — Frontend 和 Backend API 用這個，無狀態，可以隨意擴縮。

StatefulSet — PostgreSQL 用這個，需要穩定的 Pod 名稱和持久化儲存。

PVC — PostgreSQL 的資料要落磁碟，用 PersistentVolumeClaim。

ConfigMap — 存 DB 主機名、Redis 位址、API URL 這些設定。

Secret — 存 DB 密碼、Redis 密碼這些機密資料。

Service — 每個服務都要有 ClusterIP Service，讓內部可以互相連。

Ingress — 對外暴露 Frontend 和 Backend API，走域名路由。

HPA — Backend API 流量高的時候自動擴 Pod。

RBAC — Worker 需要讀取 ConfigMap 的權限，用 ServiceAccount + Role。

Job — 一次性任務，比如資料庫初始化、schema migration。

CronJob — 定時觸發，每分鐘掃一次排程任務。

DaemonSet — 如果你的 Worker 要每個節點都跑一個，用 DaemonSet。這個系統我們用 Deployment，但我會解釋什麼時候用 DaemonSet。

數一下：Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、HPA、RBAC、Job、CronJob、DaemonSet。十二個核心組件。一套系統全部覆蓋。

這就是我選這個系統的原因。

好，我們開始。你不需要記住所有指令，重點是看懂每一步在解決什麼問題。

---

# 影片 7-9：基礎建設 — Namespace、Secret、ConfigMap、DB（~15min）

## 本集重點

- 建立 Namespace（隔離環境）
- 建立 Secret（DB 密碼、Redis 密碼）
- 建立 ConfigMap（連線設定）
- 部署 PostgreSQL（StatefulSet + PVC）
- 部署 Redis（Deployment）
- 驗證資料庫正常運作

## 逐字稿

好，開始動手。第一步，把基礎建設弄好，包含環境隔離、設定管理、資料庫和佇列。

### 建立 Namespace

首先建立一個獨立的 Namespace，把我們的系統跟其他東西隔開。

```
指令：kubectl create namespace taskscheduler
```

之後所有指令都加 -n taskscheduler，確保在對的 Namespace 操作。

### 建立 Secret

密碼不能放在 ConfigMap，要放 Secret。

建立一個 YAML：

```yaml
# secret.yaml
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

```
指令：kubectl apply -f secret.yaml
```

注意：stringData 是明文，K8s 會自動 base64 encode 存起來。如果你用 data，要自己 base64 encode 之後才能填進去。

驗證：

```
指令：kubectl get secret app-secrets -n taskscheduler
```

你只會看到 NAME 和 TYPE，不會看到值。用 describe 也看不到值。這就是 Secret 的意義。

### 建立 ConfigMap

設定值放 ConfigMap：

```yaml
# configmap.yaml
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

```
指令：kubectl apply -f configmap.yaml
```

注意 POSTGRES_HOST 的值是 `postgres-service`，這就是等一下我們要建的 Service 名稱。K8s 的 DNS 會把這個名字解析成對應的 Pod IP。這是服務發現的核心機制。

### 部署 PostgreSQL（StatefulSet + PVC）

PostgreSQL 是有狀態的服務，用 StatefulSet：

```yaml
# postgres.yaml
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
---
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

重點說明：
- `volumeClaimTemplates`：StatefulSet 特有的，每個 Pod 自動建立自己的 PVC。我們只有一個副本，所以建一個 PVC。
- `clusterIP: None`：Headless Service。StatefulSet 搭配 Headless Service，Pod 可以用穩定的 DNS 名稱 `postgres-0.postgres-service` 互相溝通。

```
指令：kubectl apply -f postgres.yaml
```

```
指令：kubectl get statefulset -n taskscheduler
```

等到 READY 顯示 1/1。

```
指令：kubectl get pvc -n taskscheduler
```

你會看到一個 PVC，狀態是 Bound，這代表已經分配到實際的儲存空間。

### 部署 Redis（Deployment）

Redis 用 Deployment，因為它在這個架構裡是暫存用，重啟不怕丟資料（任務如果丟掉，CronJob 下次還會補回來）：

```yaml
# redis.yaml
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

```
指令：kubectl apply -f redis.yaml
```

```
指令：kubectl get pods -n taskscheduler
```

等 postgres-0 和 redis-xxx 都是 Running。

### 驗證資料庫

確認 PostgreSQL 可以連進去：

```
指令：kubectl exec -it postgres-0 -n taskscheduler -- psql -U postgres -d taskdb
```

進去之後：

```sql
\l
\q
```

能進去就代表基礎建設完成。

好，Namespace、Secret、ConfigMap、PostgreSQL、Redis，全部就緒。下一步部署後端。

---

# 影片 7-10：部署後端 API + 資料庫初始化 Job（~15min）

## 本集重點

- 用 Job 跑一次性的資料庫初始化（schema migration）
- 部署 Backend API（Deployment + Service）
- 用 RBAC 給 Backend 最小權限
- 部署 Frontend（Deployment + Service）
- 驗證 API 正常回應

## 逐字稿

基礎建設好了，下一步部署應用程式。

### 資料庫初始化 Job

第一件事是跑 schema migration，建立資料表。這是一次性的操作，用 Job 最合適。

Job 的特性：跑完就結束，不像 Deployment 一直保持 Pod 存活。

```yaml
# db-migrate-job.yaml
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

重點：`restartPolicy: Never` 加上 `backoffLimit: 3`，失敗最多重試 3 次，之後放棄並報錯，讓你知道 migration 出問題了。

```
指令：kubectl apply -f db-migrate-job.yaml
```

```
指令：kubectl get job -n taskscheduler
```

等 COMPLETIONS 顯示 1/1，代表 migration 成功。

```
指令：kubectl logs job/db-migrate -n taskscheduler
```

看 log 確認沒有錯誤。

### 給 Backend 建立 ServiceAccount 和 RBAC

Backend API 需要讀取 ConfigMap，我們用 RBAC 給最小權限。

這是早上學的東西，直接用：

```yaml
# backend-rbac.yaml
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

```
指令：kubectl apply -f backend-rbac.yaml
```

### 部署 Backend API

```yaml
# backend.yaml
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

重點：
- `serviceAccountName: backend-sa`：Pod 用剛才建的 ServiceAccount，自動帶有 RBAC 權限
- `envFrom: configMapRef`：一次把整個 ConfigMap 所有 key 都設成環境變數，不用一個一個列
- `resources.requests`：設了 CPU request，待會 HPA 才能算百分比
- `readinessProbe`：Pod 準備好才接流量，避免啟動中就被打

```
指令：kubectl apply -f backend.yaml
```

```
指令：kubectl get pods -n taskscheduler -l app=backend
```

等 backend Pod 都 Running 且 READY 是 1/1。

驗證 API：

```
指令：kubectl port-forward service/backend-service 3000:3000 -n taskscheduler
```

另開視窗：

```
指令：curl http://localhost:3000/health
```

看到 `{"status":"ok"}` 代表後端正常。

### 部署 Frontend

```yaml
# frontend.yaml
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

```
指令：kubectl apply -f frontend.yaml
```

好，後端和前端都起來了。下一步部署 Worker 和 CronJob。

---

# 影片 7-11：Worker + CronJob — 非同步任務的核心（~15min）

## 本集重點

- Worker Deployment：持續從 Queue 拿任務執行
- CronJob：定時觸發排程任務
- DaemonSet：什麼情況下 Worker 應該用 DaemonSet
- 驗證任務從建立到執行的完整流程

## 逐字稿

好，現在進入這套系統最有趣的部分：Worker 和 CronJob。

### Worker Deployment

Worker 是這個系統的核心。它一直跑，一直從 Redis Queue 拿任務，一直執行。

Worker 沒有對外提供 HTTP API，所以不需要對外的 Service。只需要 Deployment。

```yaml
# worker.yaml
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

跑三個 Worker 副本，三個同時從 Queue 拿任務，吞吐量是一個的三倍。Redis 的 BLPOP 命令保證每個任務只會被一個 Worker 拿走，不會重複執行。

```
指令：kubectl apply -f worker.yaml
```

### DaemonSet 補充說明

有同學會問：Worker 一直跑，每個節點都要跑，應該用 DaemonSet 嗎？

先說結論：**這個場景用 Deployment，不是 DaemonSet**。

DaemonSet 的語義是「每個節點跑一個」，適合的場景是：
- 節點層級的監控 Agent（每個節點收集自己的 metrics）
- 日誌收集 Agent（每個節點收集自己的 log 檔案）
- 網路插件（每個節點都要有）

Worker 消費 Queue 任務，跟節點數量無關，跟任務量有關。我要三個 Worker 就跑三個，我要十個就跑十個，跟我有幾個節點沒有關係。所以用 Deployment。

但如果你的 Worker 是在讀取節點上的本機檔案，每個節點都要有自己的 Worker 去讀自己的檔案，那才用 DaemonSet。

記住這個判斷原則：問題是「我要幾個」用 Deployment，問題是「每個節點要一個」用 DaemonSet。

### CronJob

CronJob 負責每分鐘掃一次排程任務，把到期的任務丟進 Queue：

```yaml
# cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: task-scheduler
  namespace: taskscheduler
spec:
  schedule: "* * * * *"
  concurrencyPolicy: Forbid
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

重點：
- `schedule: "* * * * *"`：每分鐘執行一次，Cron 語法，五個星號代表「每分每時每天每月每週」
- `concurrencyPolicy: Forbid`：如果上一個 Job 還沒跑完，新的不啟動。防止同一批任務被重複入隊。

```
指令：kubectl apply -f cronjob.yaml
```

```
指令：kubectl get cronjob -n taskscheduler
```

等一分鐘：

```
指令：kubectl get job -n taskscheduler
```

你會看到 CronJob 自動建立了一個 Job，跑完之後 COMPLETIONS 變 1/1。

### 驗證完整流程

現在驗證從建立任務到執行完成的完整路徑。

建立一個任務（透過 port-forward 打 API）：

```
指令：curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"name":"send-report","schedule":"* * * * *","payload":{"to":"user@example.com"}}'
```

看 Worker log：

```
指令：kubectl logs -l app=worker -n taskscheduler --tail=20 -f
```

你會看到 Worker 接到任務，開始執行，輸出執行結果。

等下一分鐘，CronJob 觸發，Worker 再次執行。

這個流程就完整了：API 接任務 → Redis Queue → Worker 執行 → 結果存 PostgreSQL → CronJob 定時觸發循環。

---

# 影片 7-12：Ingress + HPA + 收尾（~12min）

## 本集重點

- 設定 Ingress，對外暴露 Frontend 和 Backend API
- 設定 HPA，讓 Backend 自動擴縮
- 全系統架構回顧
- 驗收清單：所有組件都正常

## 逐字稿

快到終點了。最後兩步：把服務對外暴露，然後加上自動擴縮。

### 設定 Ingress

現在 Frontend 和 Backend 都只有 ClusterIP，外面連不進來。用 Ingress 對外開放：

```yaml
# ingress.yaml
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

這個 Ingress 做了路由分流：`task.example.com/api/xxx` 打到 Backend，其他的打到 Frontend。

```
指令：kubectl apply -f ingress.yaml
```

```
指令：kubectl get ingress -n taskscheduler
```

確認 ADDRESS 有 IP 位址出現。

### 設定 HPA

Backend 流量高的時候要自動擴，用 HPA：

```yaml
# hpa.yaml
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

```
指令：kubectl apply -f hpa.yaml
```

```
指令：kubectl get hpa -n taskscheduler
```

你會看到 TARGETS 顯示目前的 CPU 使用率和目標，REPLICAS 目前是 2。

用 hey 或 ab 打壓力：

```
指令：hey -z 60s -c 50 http://task.example.com/api/health
```

然後觀察 HPA：

```
指令：kubectl get hpa backend-hpa -n taskscheduler -w
```

你會看到 REPLICAS 從 2 慢慢往上長。

### 全系統驗收清單

```
指令：kubectl get all -n taskscheduler
```

確認以下所有組件都正常：

✅ StatefulSet postgres — READY 1/1
✅ Deployment redis — READY 1/1
✅ Deployment backend — READY 2/2（或更多，如果 HPA 已擴）
✅ Deployment frontend — READY 2/2
✅ Deployment worker — READY 3/3
✅ CronJob task-scheduler — ACTIVE 0（沒有在跑表示上次跑完了）
✅ Service postgres-service, redis-service, backend-service, frontend-service — 都存在
✅ PVC postgres-storage-postgres-0 — Bound
✅ Ingress taskscheduler-ingress — 有 ADDRESS

```
指令：kubectl get secret,configmap -n taskscheduler
```

✅ Secret app-secrets — 存在
✅ ConfigMap app-config — 存在

```
指令：kubectl get serviceaccount,role,rolebinding -n taskscheduler
```

✅ ServiceAccount backend-sa — 存在
✅ Role backend-role — 存在
✅ RoleBinding backend-rolebinding — 存在

全部 ✅，這套系統就完整部署完成了。

---

# 影片 7-13：架構回顧 — 每個組件解決了什麼問題（~10min）

## 本集重點

- 完整因果鏈：從「一個 Pod」到「生產就緒的完整系統」
- 每個 K8s 組件對應的業務問題
- 這套系統如果上生產，還需要什麼

## 逐字稿

好，讓我們最後回顧一遍這套系統，用因果鏈把所有組件串起來。

這是我們在這堂課（以及前幾堂課）學過的完整路徑。

**問題：服務跑在哪裡？**
→ Deployment 管理 Pod，Pod 跑容器。

**問題：Pod 重啟，資料庫的資料全部消失。**
→ StatefulSet 給資料庫穩定的身份，PVC 讓資料持久化到磁碟。

**問題：設定寫死在 Image 裡，改一個設定要重新 build。**
→ ConfigMap 存設定，Secret 存密碼，注入到 Pod 的環境變數。

**問題：服務之間怎麼連？Pod IP 每次重啟都變。**
→ Service 提供穩定的 DNS 名稱，K8s 的 kube-dns 幫你解析。

**問題：外面的使用者怎麼連進來？NodePort 太醜，每個服務都要不同 Port。**
→ Ingress 統一入口，用域名和路徑做路由。

**問題：流量暴增，三個 Pod 不夠用，但你在睡覺。**
→ HPA 根據 CPU 使用率自動擴縮 Pod 數量。

**問題：十個開發者都有 admin 權限，誰都可以把生產環境砍掉。**
→ RBAC 根據角色分配最小權限，ServiceAccount 讓 Pod 也有身份。

**問題：資料庫初始化是一次性的操作，不應該一直跑。**
→ Job 執行完就結束，不保持 Pod 存活。

**問題：要定時觸發排程任務。**
→ CronJob 按照 Cron 語法定時建立 Job。

**問題：Worker 需要三個，每個 Worker 消費同一個 Queue。**
→ Deployment 跑三個副本，Redis 的原子操作保證每個任務只被消費一次。

這就是一套完整的生產就緒系統的架構。每一個組件都不是憑空學的，每一個都是為了解決前一步留下的問題。

---

最後說一下，如果這套系統真的要上生產，還需要什麼：

**監控**：Prometheus 收集 metrics，Grafana 畫圖，AlertManager 告警。
**日誌**：EFK（Elasticsearch + Fluentd + Kibana）收集所有 Pod 的 log。
**備份**：PostgreSQL 定期備份到 S3 或 GCS。
**CI/CD**：GitHub Actions 自動 build image、跑測試、deploy 到 K8s。
**多環境**：dev / staging / production 用 Namespace 或獨立叢集隔離。
**憑證**：Cert-manager 自動申請和更新 TLS 憑證。

這些是生產環境的標配。每一個都可以再開一堂課。

但今天你已經掌握了最核心的部分。你已經可以把一套真實的系統部署到 Kubernetes 上，而且你知道每一個組件為什麼存在。

這就夠了。恭喜你。

---

*Loop 3 完整逐字稿完畢。下一個是 Loop 4（學員自架：短網址服務）。*
