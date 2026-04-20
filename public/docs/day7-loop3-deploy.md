# Loop 3 — 從零建完整系統（任務排程系統）

> 系統架構：Frontend → Backend API → Redis Queue → Task Runner → PostgreSQL
> 涵蓋 12 個 K8s 組件：Deployment, StatefulSet, PVC, ConfigMap, Secret, Service, Ingress, HPA, RBAC, Job, CronJob, DaemonSet（對比說明）

> **⚠️ 待處理（上課前要做）：**
> 1. **RBAC 真實化**：目前 Backend 用 `envFrom` 注入 ConfigMap，RBAC 只是示範用途。
>    需要改 `apps/task-api/server.js`，改成啟動時用 K8s SDK 主動讀 ConfigMap。
>    然後 build + push `yanchen184/task-api:v2`，並更新 `apps/k8s/07-backend.yaml` 的 image 為 v2、拿掉 `envFrom`。
>    這樣 RBAC 拿掉後 Backend 會真的報 403，驗收才有意義。
>    （`server.js` 和 `package.json` 已改好，只差 Docker Desktop 開起來 build + push）

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

### 前置確認：兩個 Node 都要 Ready

```
指令：kubectl get nodes
```

確認 ubuntu-master 和 ubuntu-worker 都是 Ready 狀態。如果 worker 是 NotReady，可能是 master IP 換過（VM 重啟後 IP 飄移），worker 的 k3s-agent 還連著舊 IP。

**修復 worker NotReady（IP 飄移）：**

在 master 取得新的 token：
```
指令（在 master 上）：sudo cat /var/lib/rancher/k3s/server/node-token
```

在 worker 重新設定：
```
指令（在 worker 上）：sudo systemctl stop k3s-agent
指令（在 worker 上）：sudo nano /etc/systemd/system/k3s-agent.service.env
```

把 `K3S_URL` 改成 master 現在的 IP，例如 `https://192.168.43.133:6443`，`K3S_TOKEN` 填剛才拿到的 token，然後：

```
指令（在 worker 上）：sudo systemctl daemon-reload
指令（在 worker 上）：sudo systemctl start k3s-agent
```

回到 master 確認：
```
指令：kubectl get nodes -w
```

等兩個 Node 都是 Ready 再繼續。

---

### 第一段：基礎層（00~03）

---

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tasks        # ★ 重點 1：所有後續 -n tasks 都對應這個名稱，改這裡全部要跟著改
```

```
指令：kubectl apply -f 00-namespace.yaml
```

建立 `tasks` namespace，隔離這套系統，所有後續指令都加 `-n tasks`。

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: tasks
type: Opaque        # ★ 重點 1：Opaque 是通用型 Secret，適合任意 key-value 機密資料
stringData:         # ★ 重點 2：填明文，K8s 自動 base64 encode；若用 data 欄位則要自己先 encode
  postgres-password: "MyPostgresP@ssw0rd"
  redis-password: "MyRedisP@ssw0rd"
  jwt-secret: "MyJwtSuperSecret"
```

```
指令：kubectl apply -f 01-secret.yaml
指令：kubectl get secret app-secrets -n tasks
```

`stringData` 填明文，K8s 幫你 base64 encode。這個 YAML 不要推進 git。輸出顯示 `secret/app-secrets created`，`DATA 3` 代表三個欄位（postgres-password、redis-password、jwt-secret）都存進去了。

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: tasks
data:
  POSTGRES_HOST: "postgres-service"   # ★ 重點 1：值是 Service 名稱不是 IP，K8s DNS 自動解析，Pod 換 IP 不受影響
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "taskdb"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  API_URL: "http://backend-service:3000"  # ★ 重點 2：叢集內部 URL，用 Service 名稱通訊，不需要真實 IP
```

```
指令：kubectl apply -f 02-configmap.yaml
```

POSTGRES_HOST 的值是 Service 名稱，K8s 內建 DNS 自動解析，Pod 重啟換 IP 也不影響。

### PostgreSQL（StatefulSet）

**為什麼不用 Deployment？**

判斷原則：**需要穩定的身份（固定名稱和固定儲存）嗎？需要就 StatefulSet，不需要就 Deployment。**

StatefulSet 解決三件事：
1. Pod 有穩定名稱：`postgres-0`，重啟後名稱不變（名字由 `metadata.name` + 序號組成，叫 `postgres` 就是 `postgres-0`）
2. Pod 有穩定 DNS：`postgres-0.postgres-service` 永遠指向 postgres-0（CoreDNS 自動建，不用你設定）
3. 每個 Pod 有自己的 PVC：重啟後還是同一個磁碟，資料不丟

**老實說，`replicas: 1` 的 PostgreSQL 用 Deployment + 手動建 PVC 也能跑。** 業界用 StatefulSet 的理由是：

- **語意清楚**：看到 StatefulSet 就知道是有狀態服務，維護的人不會亂動
- **未來擴充**：換成有 replication 的架構時，StatefulSet 是標準基礎
- **面試標準答案**：說「資料庫用 Deployment」會被電

**現代生產環境其實更進一步，直接用 Operator：**

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: my-db
spec:
  instances: 3
  storage:
    size: 10Gi
```

CloudNativePG（CNPG）這類 Operator 把所有維運邏輯包進去——自動選 Leader、Replica 同步、Primary 掛掉自動 Failover、備份還原全自動。你只要說「我要 3 個實例、10Gi 磁碟」，剩下的 Operator 幫你搞定。

演進路線：
```
Deployment（不適合，沒有身份保證）
    ↓
StatefulSet（手動管，業界標準，這堂課教的）
    ↓
Operator / CNPG（現代生產環境，全自動）
```

這堂課教 StatefulSet 是讓你理解底層原理。不懂 StatefulSet，連 Operator 在幹嘛都看不懂。

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: tasks
spec:
  serviceName: "postgres-service"   # ★ 重點 1：對應 Headless Service 名稱，K8s 用這個組出穩定 DNS（postgres-0.postgres-service）
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
        readinessProbe:              # ★ 重點 2：通過才算 Ready，migration Job 要等這個，否則 DB 還沒好就連線會失敗
          exec:
            command: ["pg_isready", "-U", "postgres"]
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:             # ★ 重點 3：StatefulSet 特有，自動幫每個 Pod 建專屬 PVC，重啟後還是同一個磁碟
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]   # ★ 重點 4：同時只能一個 Node 掛載，單一 PostgreSQL 標準做法
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
  clusterIP: None   # ★ 重點 1：Headless，DNS 直接回 Pod IP 而非虛擬 IP，StatefulSet 才能用穩定名稱定址特定 Pod
```

Headless Service 沒有虛擬 IP，DNS 直接回傳 Pod 真實 IP，讓你可以用穩定名稱定址到特定 Pod。StatefulSet 標準做法。

**K8s 自動幫你建 DNS，不需要你寫任何設定。**

只要 StatefulSet 設了 `serviceName: "postgres-service"`，K8s 內建的 CoreDNS 就自動建立這條記錄：

```
postgres-0.postgres-service.tasks.svc.cluster.local
```

格式是：`Pod名稱.Service名稱.Namespace.svc.cluster.local`

**為什麼是 `postgres-0`？**

StatefulSet 的 Pod 命名規則固定是 `StatefulSet名稱-序號`：第一個 Pod 叫 `postgres-0`，第二個叫 `postgres-1`，以此類推。重啟後名字不變。

這跟 Deployment 完全不同——Deployment 的 Pod 名稱是隨機的（例如 `backend-7c8b85c4ff-w7rxm`），每次重啟換一個新名字。StatefulSet 的 Pod 有固定身份，Deployment 的 Pod 是無名氏。這就是為什麼資料庫要用 StatefulSet：名字固定，DNS 才能穩定定址。

```
指令：kubectl apply -f 03-postgres.yaml
指令：kubectl get statefulset -n tasks
指令：kubectl get pvc -n tasks
```

你會看到 `statefulset.apps/postgres created` 和 `service/postgres-service created` 兩行。

等 READY 顯示 1/1，PVC STATUS 從 Pending 變成 Bound（local-path provisioner 在 Pod 實際排到某個 Node 後才 bind，要等一下）。

```
指令：kubectl get pods -n tasks -w
```

等 `postgres-0` 從 `ContainerCreating` 變成 `Running`，READY 從 `0/1` 變成 `1/1`（readinessProbe 通過才算真的好）。

也可以用這個直接等到 Ready：
```
指令：kubectl wait pod/postgres-0 -n tasks --for=condition=Ready --timeout=60s
```

輸出 `pod/postgres-0 condition met` 才繼續下一步，否則 migration 會連不上 DB。

確認進得去資料庫：
```
指令：kubectl exec -it postgres-0 -n tasks -- psql -U postgres -d taskdb
```

進去後輸入 `\q` 退出。

---

## ⏸ 巡堂驗收 — 第一段

確認 00~03 全部跑成功後再繼續。

```
kubectl get namespace tasks
kubectl get secret app-secrets -n tasks
kubectl get configmap app-config -n tasks
kubectl get statefulset -n tasks
kubectl get pvc -n tasks
kubectl get pods -n tasks
```

**每個指令要看什麼：**

| 指令 | 看什麼欄位 | 期待輸出 |
|------|-----------|---------|
| `kubectl get namespace tasks` | STATUS | `Active` |
| `kubectl get secret app-secrets -n tasks` | DATA | `3`（postgres-password、redis-password、jwt-secret） |
| `kubectl get configmap app-config -n tasks` | DATA | `7`（POSTGRES_HOST 等七個 key） |
| `kubectl get statefulset -n tasks` | READY | `1/1` |
| `kubectl get pvc -n tasks` | STATUS | `Bound`（postgres-storage-postgres-0） |
| `kubectl get pods -n tasks` | STATUS / READY | `postgres-0` Running `1/1` |

全部確認才喊繼續，有任何一個不對先停下來。

---

### 第二段：資料層（04~07）

---

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
        command: ["/bin/sh", "-c", "redis-server --requirepass $REDIS_PASSWORD"]  # ★ 重點 1：exec form 不走 shell，用 /bin/sh -c 包才能做 $REDIS_PASSWORD 環境變數替換
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
指令：kubectl apply -f 04-redis.yaml
指令：kubectl get pods -n tasks
```

看到 `redis-xxxxx` Pod Running 就好。Redis 是 Deployment，不需要 PVC，啟動比 postgres 快很多。

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
      restartPolicy: Never   # ★ 重點 1：Pod 失敗不重啟舊 Pod，Job 另建新 Pod 重試，舊的留著方便看 log
      containers:
      - name: migrate
        image: yanchen184/task-api:v1
        command: ["node", "migrate.js"]   # ★ 重點 2：只跑一次就結束，跟 Deployment 持續存活的設計相反
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
  backoffLimit: 3   # ★ 重點 3：最多重試三次，超過就標記 Job 失敗，不無限重試
```

`restartPolicy: Never`：Pod 失敗不重啟這個 Pod，Job 建一個新 Pod 重試，舊的留著看 log。`backoffLimit: 3`：最多重試三次。

```
指令：kubectl apply -f 05-db-migrate-job.yaml
指令：kubectl get job -n tasks
```

COMPLETIONS 欄位從 `0/1` 變成 `1/1` 才算成功。Job 有 init container 先等 postgres ready，再跑 migrate.js。

```
指令：kubectl logs job/db-migrate -n tasks
```

成功的 log 是：
```
Connected to PostgreSQL
Migration complete: tasks table ready
```

如果看到 `Error`，檢查 ConfigMap 的 POSTGRES_HOST 是否對應 postgres-service，以及 Secret 的 postgres-password 是否正確。

### RBAC — Backend 最小權限

Backend API 需要在執行時讀取 ConfigMap（取得 DB 連線資訊）。這個 SA 就是給 Backend Pod 用的身份，限制它只能讀 ConfigMap，其他什麼都不能做。

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
- apiGroups: [""]          # ★ 重點 1：空字串代表 core group，ConfigMap、Pod、Service 都在這裡
  resources: ["configmaps"]
  verbs: ["get", "list"]   # ★ 重點 2：只允許讀，不給寫入或刪除，落實最小權限原則
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
  name: backend-role        # ★ 重點 3：名字要跟上面 Role 的 metadata.name 完全一致，拼錯不會報錯但權限不會生效
  apiGroup: rbac.authorization.k8s.io
```

```
指令：kubectl apply -f 06-rbac.yaml
```

三行輸出：`serviceaccount/backend-sa created`、`role.rbac.authorization.k8s.io/backend-role created`、`rolebinding.rbac.authorization.k8s.io/backend-rolebinding created`。

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
      serviceAccountName: backend-sa   # ★ 重點 1：Pod 用這個身份跟 API Server 溝通，沒設會用 default SA（通常無任何權限）
      containers:
      - name: backend
        image: yanchen184/task-api:v1
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config            # ★ 重點 2：整包 ConfigMap 一次注入所有 key 為環境變數，Secret 不建議這樣做
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
            cpu: "100m"          # ★ 重點 3：HPA 的分母，沒設這行 HPA 算不出 CPU 百分比，TARGETS 會顯示 unknown
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "256Mi"
        readinessProbe:
          httpGet:
            path: /health        # ★ 重點 4：Pod Running 不等於可接流量，/health 回 200 才加入 Service 後端列表
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
指令：kubectl apply -f 07-backend.yaml
指令：kubectl get pods -n tasks -l app=backend
```

等兩個 backend Pod 都 READY 1/1（readinessProbe `/health` 通過才算好）。

快速驗證 Backend API：
```
指令：kubectl port-forward service/backend-service 3000:3000 -n tasks
```

另一個終端機打：`curl http://localhost:3000/health`，回傳 `{"status":"ok"}` 代表正常。`Ctrl+C` 停掉 port-forward。

---

## ⏸ 巡堂驗收 — 第二段

確認 04~07 全部跑成功後再繼續。

```
kubectl get pods -n tasks
kubectl get job -n tasks
kubectl logs job/db-migrate -n tasks
kubectl get serviceaccount,role,rolebinding -n tasks
kubectl auth can-i get configmaps --as=system:serviceaccount:tasks:backend-sa -n tasks
kubectl auth can-i delete pods --as=system:serviceaccount:tasks:backend-sa -n tasks
curl -H "Host: task.local" http://192.168.43.133/health
```

**每個指令要看什麼：**

| 指令 | 看什麼欄位 | 期待輸出 |
|------|-----------|---------|
| `kubectl get pods -n tasks` | STATUS / READY | `redis-xxxxx` Running `1/1`；`backend-xxxxx` x2 Running `1/1` |
| `kubectl get job -n tasks` | COMPLETIONS | `db-migrate` 顯示 `1/1` |
| `kubectl logs job/db-migrate -n tasks` | log 內容 | 出現 `Migration complete: tasks table ready` |
| `kubectl get serviceaccount,role,rolebinding -n tasks` | 三個資源 | `backend-sa`、`backend-role`、`backend-rolebinding` 全部存在 |
| `can-i get configmaps` | 輸出 | `yes` |
| `can-i delete pods` | 輸出 | `no` |
| `curl ... /health` | HTTP 回傳 | `{"status":"ok"}` |

全部確認才喊繼續，有任何一個不對先停下來。

---

### 第三段：應用層（08~12）

---

### Frontend

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: tasks
spec:
  replicas: 2       # ★ 重點 1：兩個副本，一個 Pod 掛掉另一個繼續服務，避免單點故障
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
指令：kubectl apply -f 08-frontend.yaml
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
  replicas: 3       # ★ 重點 1：三個 Task Runner 同時消費 Queue，數量跟業務量有關，跟 Node 數量無關（這就是不用 DaemonSet 的原因）
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
指令：kubectl apply -f 09-task-runner.yaml
指令：kubectl get pods -n tasks -l app=task-runner
```

三個 task-runner Pod 全部 Running，三個同時從 Redis Queue 拉任務。

### CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: task-scheduler
  namespace: tasks
spec:
  schedule: "* * * * *"           # ★ 重點 1：Cron 語法「分 時 日 月 週」，五個星號 = 每分鐘觸發
  concurrencyPolicy: Forbid        # ★ 重點 2：上一個 Job 還沒跑完就跳過，防止同一批任務被重複入隊
  successfulJobsHistoryLimit: 3    # ★ 重點 3：只保留最近 3 次成功記錄，防止 Job 物件無限堆積佔用 etcd
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure  # ★ 重點 4：失敗在同一個 Pod 原地重試，跟 Job 的 Never（建新 Pod）不同
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
指令：kubectl apply -f 10-cronjob.yaml
指令：kubectl get cronjob -n tasks
```

SCHEDULE 顯示 `* * * * *`，SUSPEND 是 False，LAST SCHEDULE 等一分鐘後會出現時間。

等一分鐘後，CronJob 自動建 Job，用這個觀察：
```
指令：kubectl get job -n tasks
```

COMPLETIONS 1/1 代表第一次觸發成功。看 log：
```
指令：kubectl logs -l job-name -n tasks --selector=job-name=$(kubectl get jobs -n tasks --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1].metadata.name}')
```

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
      - /api    # ★ 重點 1：剝掉 /api 前綴，Backend 收到的是 /tasks 而非 /api/tasks，否則路由 404
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tasks-ingress
  namespace: tasks
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: tasks-strip-api-prefix@kubernetescrd   # ★ 重點 2：格式固定是 namespace-名稱@kubernetescrd，少一個字都不認
spec:
  ingressClassName: traefik   # ★ 重點 3：指定用 Traefik，k3s 預設 Ingress Controller，若用 k8s 標準版改成 nginx
  rules:
  - host: task.example.com
    http:
      paths:
      - path: /api             # ★ 重點 4：/api 路由到 backend-service，/ 路由到 frontend-service，順序不能反
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
指令：kubectl apply -f 12-ingress.yaml
指令：kubectl get ingress -n tasks
```

ADDRESS 欄位出現 Node IP（`192.168.43.131,192.168.43.133`）代表 Traefik 已經接管這個 Ingress。

**本機測試**：在你的電腦加一行 hosts 對應（不是在 VM 上）：

Windows（PowerShell 系統管理員）：
```
指令：Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "192.168.43.133  task.local"
```

確認有加進去：
```
指令：Get-Content "C:\Windows\System32\drivers\etc\hosts" | Select-String "task.local"
```

Mac/Linux：
```
指令：echo "192.168.43.133  task.local" | sudo tee -a /etc/hosts
```

加完開瀏覽器 `http://task.local` 就能看到 Frontend 畫面，`http://task.local/api/tasks` 打到 Backend API。

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
    name: backend    # ★ 重點 1：管理哪個 Deployment，名稱要跟 Backend Deployment 的 metadata.name 完全一致
  minReplicas: 2     # ★ 重點 2：最少保持 2 個副本，低負載時不會縮到 0，維持基本可用性
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70   # ★ 重點 3：CPU 超過 requests 的 70% 就擴容，分母是 requests.cpu（100m），一定要設
```

```
指令：kubectl apply -f 11-hpa.yaml
指令：kubectl get hpa -n tasks
```

TARGETS 欄位看到 `cpu: X%/70%`（有數字不是 unknown）才算正常，代表 metrics-server 收到了 backend 的 CPU 數據。

---

## ⏸ 巡堂驗收 — 第三段

確認 08~12 全部跑成功後再繼續。

```
kubectl get pods -n tasks
kubectl get cronjob -n tasks
kubectl get hpa -n tasks
kubectl get ingress -n tasks
kubectl logs -l app=task-runner -n tasks --tail=20
```

**每個指令要看什麼：**

| 指令 | 看什麼欄位 | 期待輸出 |
|------|-----------|---------|
| `kubectl get pods -n tasks` | STATUS / READY | `frontend-xxxxx` x2 Running `2/2`；`task-runner-xxxxx` x3 Running `3/3` |
| `kubectl get cronjob -n tasks` | LAST SCHEDULE | 有時間戳（等一分鐘後出現），SUSPEND 是 `False` |
| `kubectl get hpa -n tasks` | TARGETS | `cpu: X%/70%`，有數字不是 `unknown` |
| `kubectl get ingress -n tasks` | ADDRESS | 出現 Node IP（例如 `192.168.43.131,192.168.43.133`） |
| `kubectl logs -l app=task-runner ...` | log 內容 | 出現 `task-runner started, waiting for tasks...` |

全部確認才喊繼續，有任何一個不對先停下來。

---

### 全系統驗收

**1. 狀態總覽**

```
指令：kubectl get all -n tasks
```

期待看到：
- `pod/postgres-0` READY 1/1
- `pod/redis-xxxxx` READY 1/1
- `pod/backend-xxxxx` x2 READY 1/1
- `pod/frontend-xxxxx` x2 READY 1/1
- `pod/task-runner-xxxxx` x3 READY 1/1
- `pod/db-migrate-xxxxx` STATUS Completed
- `statefulset.apps/postgres` READY 1/1
- `horizontalpodautoscaler.autoscaling/backend-hpa` TARGETS `cpu: X%/70%`
- `cronjob.batch/task-scheduler` LAST SCHEDULE 有時間

```
指令：kubectl get pvc -n tasks
```

`postgres-storage-postgres-0` STATUS 是 Bound。

```
指令：kubectl get secret,configmap,serviceaccount,role,rolebinding -n tasks
```

`secret/app-secrets`、`configmap/app-config`、`serviceaccount/backend-sa`、`role/backend-role`、`rolebinding/backend-rolebinding` 全部存在。

---

**2. PostgreSQL — tasks table 存在**

```
指令：kubectl exec postgres-0 -n tasks -- psql -U postgres -d taskdb -c '\dt'
```

看到 `public | tasks | table | postgres` 代表 migration 有跑成功，表建好了。

---

**3. Redis — 有密碼保護**

```
指令：kubectl exec deploy/redis -n tasks -- redis-cli -a MyRedisP@ssw0rd ping
```

回傳 `PONG` 代表 Redis 正常且密碼正確。

---

**4. Job — migration log**

```
指令：kubectl logs job/db-migrate -n tasks
```

看到：
```
Connected to PostgreSQL
Migration complete: tasks table ready
```

---

**5. RBAC — backend-sa 最小權限驗證**

```
指令：kubectl auth can-i get configmaps --as=system:serviceaccount:tasks:backend-sa -n tasks
```

回傳 `yes`，backend-sa 可以讀 ConfigMap。

```
指令：kubectl auth can-i delete pods --as=system:serviceaccount:tasks:backend-sa -n tasks
```

回傳 `no`，沒有刪 Pod 的權限。

```
指令：kubectl auth can-i get secrets --as=system:serviceaccount:tasks:backend-sa -n tasks
```

回傳 `no`，不能讀 Secret，最小權限原則落實。

---

**6. CronJob — 每分鐘觸發**

```
指令：kubectl get job -n tasks
```

看到多個 `task-scheduler-xxxxxxx` Job，STATUS 都是 Complete，代表 CronJob 每分鐘觸發成功。

看最新一次 CronJob 的 log：
```
指令：kubectl logs -l app=task-scheduler -n tasks --tail=5
```

輸出 `Scanning for due tasks...`，代表有在掃資料庫。

---

**7. Task Runner — 等待任務**

```
指令：kubectl logs -l app=task-runner -n tasks --tail=20
```

三個 task-runner Pod 都輸出 `task-runner started, waiting for tasks...`，代表正常連到 Redis Queue 等待任務。

持續監看（有新任務進來就即時顯示）：
```
指令：kubectl logs -l app=task-runner -n tasks -f
```

`-f` 是 follow 模式，新 log 一出來就即時印出，按 `Ctrl+C` 停止。

---

**8. Ingress + Backend API — 對外可用**

```
指令：curl -H "Host: task.local" http://192.168.43.133/api/tasks
```

回傳 JSON：`{"tasks":[...]}` 代表 Ingress 路由正確，Backend API 可以打到 PostgreSQL 拿資料。

或者本機瀏覽器直接開 `http://task.local/api/tasks`。

---

**9. Frontend — 看到畫面**

瀏覽器開 `http://task.local`，看到任務管理系統的畫面，代表 Frontend → Ingress → frontend-service 全部通。

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
