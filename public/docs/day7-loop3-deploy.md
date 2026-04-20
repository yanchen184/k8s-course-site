# Loop 3 — 從零建完整系統（任務排程系統）

> 系統架構：Frontend → Backend API → Redis Queue → Task Runner → PostgreSQL
> 涵蓋 12 個 K8s 組件：Deployment, StatefulSet, PVC, ConfigMap, Secret, Service, Ingress, HPA, RBAC, Job, CronJob, DaemonSet（對比說明）

---

## 7-8 我們要建什麼？

**為什麼選這個系統**

你學了很多組件，但從來沒有全部串在一起過。任務排程系統能覆蓋最多的 K8s 組件。

**系統功能**

使用者建立任務（每天早上九點寄出報表 Email）→ Backend API 把任務丟進 Redis Queue → Task Runner 從 Queue 拿任務執行 → 結果存進 PostgreSQL。CronJob 定時觸發，把到期的排程任務撈出來丟進 Queue。

**12 個組件對應位置**

| 組件 | 用在哪裡 | 為什麼 |
|------|---------|--------|
| Deployment | Frontend / Backend / Task Runner | 無狀態，Pod 隨時可重建 |
| StatefulSet | PostgreSQL | 需要穩定 Pod 名稱和固定儲存 |
| PVC | PostgreSQL | 持久化資料 |
| ConfigMap | DB 主機名 / Port / DB 名稱 | 非機密設定 |
| Secret | DB 密碼 / Redis 密碼 / JWT | 機密資料 |
| Service | 所有服務 | 叢集內部互連 |
| Ingress | Frontend / Backend | 對外域名路由 |
| HPA | Backend API | CPU 自動擴縮 |
| RBAC | Backend SA | 最小讀取 ConfigMap 權限 |
| Job | DB migration | 一次性任務 |
| CronJob | 定時排程觸發 | 每分鐘掃一次到期任務 |
| DaemonSet | 對比說明（Task Runner 為什麼不用） | 跟 Node 數量綁定才用 |

---

## 7-9 從零到完成 — 邊建邊解釋

### Namespace

```
指令：kubectl create namespace tasks
```

隔離這套系統，所有指令之後都加 `-n tasks`。

### Secret

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

```
指令：kubectl apply -f secret.yaml
指令：kubectl get secret app-secrets -n tasks
```

`stringData` 填明文，K8s 幫你 base64 encode。這個 YAML 不要推進 git。

### ConfigMap

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

```
指令：kubectl apply -f configmap.yaml
```

POSTGRES_HOST 的值是 Service 名稱，K8s 內建 DNS 自動解析，Pod 重啟換 IP 也不影響。

### PostgreSQL（StatefulSet）

**為什麼不用 Deployment？**

判斷原則：**需要穩定的身份（固定名稱和固定儲存）嗎？需要就 StatefulSet，不需要就 Deployment。**

StatefulSet 解決三件事：
1. Pod 有穩定名稱：`postgres-0`，重啟後名稱不變
2. Pod 有穩定 DNS：`postgres-0.postgres-service` 永遠指向 postgres-0
3. 每個 Pod 有自己的 PVC：重啟後還是同一個磁碟，資料不丟

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

`volumeClaimTemplates` 是 StatefulSet 特有的，自動幫每個 Pod 建專屬 PVC。

PostgreSQL 用 **Headless Service**（`clusterIP: None`）：

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

Headless Service 沒有虛擬 IP，DNS 直接回傳 Pod 真實 IP，讓你可以用穩定名稱定址到特定 Pod。StatefulSet 標準做法。

```
指令：kubectl apply -f postgres.yaml
指令：kubectl get statefulset -n tasks
指令：kubectl get pvc -n tasks
```

等 READY 1/1，PVC STATUS 是 Bound。

```
指令：kubectl exec -it postgres-0 -n tasks -- psql -U postgres -d taskdb
```

### Redis（Deployment）

**為什麼不用 StatefulSet？**

判斷原則：**這份資料重啟之後能不能自動重建？能就 Deployment，不能就 StatefulSet。**

Redis 在這套系統只是暫存佇列，Pod 重啟資料消失，CronJob 下次觸發會重新入隊，可以接受。

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

Redis 用普通 ClusterIP Service，不需要 Headless。

**Service 類型三種選一**

| 類型 | 特性 | 適合場景 |
|------|------|---------|
| ClusterIP（預設）| 只在叢集內部可存取 | 內部服務互連 |
| NodePort | Node IP + 30000+ Port 對外 | 測試環境 |
| LoadBalancer | 雲端 Load Balancer，給公開 IP | 雲端生產環境 |

這套系統對外用 Ingress，不用 NodePort。Ingress 統一入口，域名路由、SSL 都集中在這裡。

```
指令：kubectl apply -f redis.yaml
指令：kubectl get pods -n tasks
指令：kubectl exec -it postgres-0 -n tasks -- psql -U postgres -d taskdb
```

### Job — 一次性 DB Migration

**為什麼不用 Deployment？**

Deployment 讓 Pod 一直保持存活，migration 跑完程序退出，Deployment 看到 Pod 死了就一直重啟。Job 是為跑完就結束的任務設計的，Pod 結束不重啟，只記錄成功或失敗。

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
        image: yanchen184/task-api:v1
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

`restartPolicy: Never`：Pod 失敗不重啟這個 Pod，Job 建一個新 Pod 重試，舊的留著看 log。`backoffLimit: 3`：最多重試三次。

```
指令：kubectl apply -f db-migrate-job.yaml
指令：kubectl get job -n tasks
指令：kubectl logs job/db-migrate -n tasks
```

等 COMPLETIONS 1/1。

### RBAC — Backend 最小權限

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

```
指令：kubectl apply -f backend-rbac.yaml
```

### Backend API

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
        image: yanchen184/task-api:v1
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

**重點說明**

- `serviceAccountName: backend-sa`：Pod 有讀取 ConfigMap 的權限
- `envFrom configMapRef`：一次把整個 ConfigMap 所有 key 設成環境變數。**Secret 不建議用 envFrom**，改用 `env.valueFrom.secretKeyRef` 一條一條明確列，只讓容器看到需要的欄位
- `resources.requests.cpu: 100m`：HPA 的前提，沒設 HPA 算不出百分比
- `readinessProbe`：Pod Running 不等於可以接流量。只有 /health 回傳 200，K8s 才把這個 Pod 加進 Service 後端列表

```
指令：kubectl apply -f backend.yaml
指令：kubectl get pods -n tasks -l app=backend
指令：kubectl port-forward service/backend-service 3000:3000 -n tasks
```

### Frontend

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
        image: yanchen184/task-frontend:v1
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

```
指令：kubectl apply -f frontend.yaml
```

### Task Runner — 為什麼沒有 Service，為什麼不是 DaemonSet

**為什麼沒有 Service？**

Service 的作用是讓別人連進來。Task Runner 是主動去 Redis Queue 拉任務，沒有人要連到它。方向是反的，Task Runner 不需要 Service。

**為什麼不是 DaemonSet？**

DaemonSet：保證每個 Node 上都跑一個 Pod。Node 數量決定 Pod 數量。

適合 DaemonSet 的場景：日誌收集 Agent（每個 Node 的本機 log）、node-exporter（Node 層級 metrics）、kube-proxy（每個 Node 管 iptables）。

**判斷原則：跟 Node 數量綁定就用 DaemonSet，不綁定就用 Deployment。**

Task Runner 消費 Redis Queue，跟 Node 數量無關。三個 Node 不代表要三個 Task Runner。叢集擴到 100 個 Node 不應該有 100 個 Task Runner。

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
        image: yanchen184/task-runner:v1
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

三個副本同時從 Queue 拉任務，Redis 的 BLPOP 是原子操作，同一個任務只會被一個 Task Runner 拿走，不重複執行。

```
指令：kubectl apply -f task-runner.yaml
```

### CronJob

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
            image: yanchen184/task-scheduler:v1
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

**Cron 語法：分 時 日 月 週**

- `* * * * *`：每分鐘
- `0 9 * * *`：每天早上九點
- `0 */6 * * *`：每六小時
- `*/5 * * * *`：每五分鐘

**concurrencyPolicy 三個選項**

- `Allow`（預設）：允許同時跑多個 Job
- `Forbid`：上一個還沒跑完就跳過這次（防止重複入隊，這套系統用這個）
- `Replace`：砍掉上一個，起一個新的

```
指令：kubectl apply -f cronjob.yaml
指令：kubectl get job -n tasks
```

等一分鐘，CronJob 自動建立 Job，COMPLETIONS 1/1。

### Ingress — k3s 用 Traefik

k3s 內建 Ingress Controller 是 Traefik，不是 nginx。

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

Middleware 把 /api 前綴剝掉，Backend 收到的是 /tasks 而不是 /api/tasks，否則 404。Annotation 格式：`namespace-middleware名稱@kubernetescrd`。

```
指令：kubectl apply -f ingress.yaml
指令：kubectl get ingress -n tasks
```

### HPA

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

```
指令：kubectl apply -f hpa.yaml
指令：kubectl get hpa -n tasks
```

### 全系統驗收

```
指令：kubectl get all -n tasks
指令：kubectl get pvc -n tasks
指令：kubectl get secret,configmap,serviceaccount,role,rolebinding -n tasks
```

StatefulSet postgres READY 1/1、Deployment redis/backend/frontend/task-runner 都 READY、CronJob 存在、PVC Bound。

---

## 7-10 QA + 學員題目 + 解答

**QA**

> Q：PVC 一直是 Pending？

`kubectl get storageclass` 確認有沒有預設 StorageClass。k3s 內建 `local-path`。`kubectl describe pvc` 看 Events 找原因。

> Q：Pod 一直 CrashLoopBackOff？

`kubectl logs pod名稱 -n tasks` 看最後幾行。常見三個原因：
1. 資料庫還沒準備好就部署 Backend（順序要對，先等 postgres Running 跑完 migration）
2. Secret 名稱拼錯（secretKeyRef.name 要完全對應）
3. ConfigMap 的 key 打錯（configMapKeyRef.key 要完全一樣）

> Q：HPA TARGETS 一直顯示 unknown？

Pod 沒設 resources.requests.cpu，或 metrics-server 剛啟動還在收集，等一分鐘。

> Q：Task Runner 啟動但 Queue 裡的任務沒被消費？

`kubectl logs -l app=task-runner -n tasks` 看 log。最常見是 Redis 連線失敗，確認 redis-service 存在、Redis Pod Running、ConfigMap 和 Secret 的值正確。

**學員題目：短網址服務**

使用者輸入長網址，系統回傳短網址（short.ly/abc123）。打短網址，系統查資料庫，跳轉到原始長網址。

自己決定：用什麼資料庫？哪些用 Deployment / StatefulSet？Service 用哪種類型？需不需要 Ingress / HPA / RBAC？

提示：短網址資料不能丟，資料庫要能持久化。查詢流量可能很高，考慮 HPA。對外要用域名，不是 IP + Port。

**解答**

資料庫選 PostgreSQL 或 Redis 都合理。如果選 Redis 做持久化，這時候要用 **StatefulSet**（資料不能丟了，跟 Loop 3 Redis 用 Deployment 的判斷原則相同）。

架構：Frontend Deployment + ClusterIP Service、Backend API Deployment + ClusterIP Service、資料庫 StatefulSet + Headless Service + PVC。

HPA：Backend API 加，記得設 resources.requests.cpu。

RBAC：Backend 需要 runtime 讀 ConfigMap 才需要，只注入環境變數的話不需要。

Ingress：一定要，對外用域名。

這就是完整的判斷流程。從需求出發，一個一個決定用什麼組件，這才是真正的 K8s 工程師在做的事情。
