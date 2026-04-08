# Day 5 備用堂 — Deployment 進階 YAML
> 適合插在 loop2 之後，或作為當天進度超前時的加碼內容
> 總時長：約 60 分鐘

---

## Bonus-1 Resource Requests & Limits（20 分鐘）

### ① 課程內容

**為什麼需要 Resource 設定**
- 沒有設定的話，一個 Pod 可以吃掉整個 Node 的 CPU / 記憶體
- 一個 Pod 記憶體洩漏 → 整個 Node 上的其他 Pod 全部被 OOM Kill
- Scheduler 不知道要把 Pod 放哪個 Node（沒有資源需求就沒辦法排程）
- 生產環境必備，沒設 Resource 是最常見的 K8s 踩坑之一

**兩個概念：requests vs limits**

| 欄位 | 意義 | Scheduler 怎麼用 | 超過怎辦 |
|------|------|----------------|---------|
| `requests` | Pod「最少需要」多少資源 | 拿來選 Node（Node 可用資源 ≥ requests 才放） | 不限制 |
| `limits` | Pod「最多能用」多少資源 | 不影響排程 | CPU 被節流（throttle）；記憶體超過 → OOM Kill |

**CPU 單位**
- `1` = 1 顆 vCPU（等於 1000m）
- `500m` = 0.5 顆 vCPU（m = millicores，千分之一核心）
- `100m` = 0.1 顆 vCPU，適合小型服務
- CPU 超過 limits：**不會 Kill**，只會 throttle（速度變慢）

**記憶體單位**
- `Mi` = Mebibyte（1 Mi = 1048576 bytes），慣用
- `Gi` = Gibibyte
- `M` = Megabyte（注意和 Mi 不同）
- 記憶體超過 limits：**直接 OOM Kill**，Pod 重啟（`RESTARTS` 數字增加）

**YAML 寫法**
```yaml
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      resources:
        requests:
          cpu: "100m"       # 最少需要 0.1 顆 CPU
          memory: "128Mi"   # 最少需要 128 MB 記憶體
        limits:
          cpu: "500m"       # 最多用 0.5 顆 CPU
          memory: "256Mi"   # 最多用 256 MB 記憶體
```

**QoS Class（K8s 自動分類）**
- `Guaranteed`：requests == limits（最優先，最不會被 Kill）
- `Burstable`：requests < limits（中等）
- `BestEffort`：完全沒設 requests 和 limits（最低優先，資源不足時第一個被 Kill）
- 實際影響：Node 記憶體不足時，BestEffort 先被驅逐，再來是 Burstable

**Docker 對照**
- `docker run --memory="256m" --cpus="0.5"` 對應 limits
- Docker 沒有 requests 概念（只有單機，不需要排程）

### ② 所有指令＋講解

**查看 Pod 的 Resource 設定**
```bash
kubectl describe pod <pod-name>
```

打完要看（Containers 區塊）：
```
Containers:
  nginx:
    Image:   nginx:1.27
    Limits:
      cpu:     500m
      memory:  256Mi
    Requests:
      cpu:     100m
      memory:  128Mi
```
- 若沒有設定，Limits 和 Requests 欄位不顯示

---

**查看 Node 的資源狀況**
```bash
kubectl describe node k3s-worker1
```

打完要看（Allocated resources 區塊）：
```
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests      Limits
  --------           --------      ------
  cpu                350m (17%)    1500m (75%)
  memory             360Mi (18%)   768Mi (38%)
```
- `Requests` 欄位：目前這個 Node 上所有 Pod 的 requests 總和
- `Limits` 欄位：limits 總和
- 百分比：佔 Node 總資源的比例
- Limits 可以超過 100%（overcommit），但 requests 不應該超過 100%

---

**查看 Pod 的 QoS Class**
```bash
kubectl describe pod <pod-name> | grep QoS
```

打完要看：
```
QoS Class:  Burstable
```
- `Guaranteed`：requests == limits
- `Burstable`：requests < limits，或只設了部分
- `BestEffort`：完全沒設

---

**模擬 OOM Kill（觀察 RESTARTS 增加）**
```yaml
# 建一個記憶體 limits 很小的 Pod，讓它 OOM
apiVersion: v1
kind: Pod
metadata:
  name: oom-test
spec:
  containers:
    - name: stress
      image: polinux/stress
      resources:
        limits:
          memory: "64Mi"
      command: ["stress"]
      args: ["--vm", "1", "--vm-bytes", "128M", "--vm-hang", "1"]
```
```bash
kubectl apply -f oom-test.yaml
kubectl get pods -w   # -w = watch，即時更新
```

打完要看：
```
NAME       READY   STATUS             RESTARTS   AGE
oom-test   0/1     OOMKilled          0          5s
oom-test   0/1     CrashLoopBackOff   1          15s
oom-test   0/1     OOMKilled          1          20s
```
- `OOMKilled`：記憶體超過 limits，被 Linux OOM Killer 殺掉
- `RESTARTS` 數字增加：K8s 自動重啟，但每次都 OOM 所以一直重啟
- `CrashLoopBackOff`：重啟太多次，K8s 開始加退避時間再重啟

```bash
kubectl delete pod oom-test
```

### ③ 題目
1. 你的 API Pod 突然 `RESTARTS` 從 0 變成 5，怎麼判斷是 OOM Kill 還是其他原因？用哪個指令查？
2. `requests.cpu: 100m` 和 `limits.cpu: 500m` 代表什麼意思？Scheduler 是根據哪個來決定把 Pod 放哪個 Node？
3. 一個 Pod 沒有設任何 resource，它的 QoS Class 是什麼？在 Node 資源不足時，它會比有設 resource 的 Pod 更早還是更晚被 Kill？

### ④ 解答
1. 用 `kubectl describe pod <name>`，看 `Last State` 區塊，如果看到 `Reason: OOMKilled` 就是記憶體超限。也可以看 `kubectl get pod <name> -o yaml | grep -A5 lastState`。
2. `100m` = 最少需要 0.1 顆 CPU（Scheduler 用來選 Node，Node 剩餘 CPU ≥ 100m 才排進去）；`500m` = 最多能用 0.5 顆 CPU（超過會被 throttle 但不會 Kill）。Scheduler 根據 **requests** 做排程決策。
3. `BestEffort`。Node 資源不足時，BestEffort 的 Pod **最先**被驅逐（evict）或 Kill，因為它被認為「對資源沒有承諾」。

---

## Bonus-2 Liveness & Readiness Probe（25 分鐘）

### ① 課程內容

**為什麼需要 Probe**
- Pod 的 STATUS 是 `Running` ≠ 應用程式正常在跑
- 常見情況：容器跑著但應用程式死鎖（deadlock）、啟動中還沒準備好接流量、記憶體洩漏導致無回應
- K8s 需要一個機制「主動問」應用程式是否健康

**三種 Probe**

| Probe | 問的問題 | 失敗時的動作 |
|-------|---------|------------|
| `livenessProbe` | 你還活著嗎？ | 殺掉容器重啟（RESTARTS +1） |
| `readinessProbe` | 你準備好接流量了嗎？ | 把 Pod 從 Service Endpoints 移除（不接流量，但不重啟） |
| `startupProbe` | 你啟動完成了嗎？ | 啟動期間保護 liveness 不誤判（慢啟動應用用） |

**Probe 的三種檢查方式**
1. `httpGet`：對指定 path + port 發 HTTP GET，回傳 200-399 算成功
2. `exec`：在容器裡執行指令，exit code 0 算成功
3. `tcpSocket`：嘗試建立 TCP 連線，連得上算成功

**Probe 重要參數**
- `initialDelaySeconds`：容器啟動後等幾秒才開始 probe（讓應用有時間啟動）
- `periodSeconds`：每隔幾秒 probe 一次（預設 10）
- `failureThreshold`：連續失敗幾次才觸發動作（預設 3）
- `timeoutSeconds`：等回應最多幾秒（預設 1）

**livenessProbe 範例（httpGet）**
```yaml
livenessProbe:
  httpGet:
    path: /health       # 你的應用要有這個 endpoint
    port: 8080
  initialDelaySeconds: 15   # 等 15 秒再開始檢查
  periodSeconds: 10         # 每 10 秒檢查一次
  failureThreshold: 3       # 連續失敗 3 次才重啟
```

**readinessProbe 範例（httpGet）**
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3
```

**livenessProbe 範例（exec）**
```yaml
livenessProbe:
  exec:
    command:
      - cat
      - /tmp/healthy     # 檔案存在 = 健康
  initialDelaySeconds: 5
  periodSeconds: 5
```

**liveness vs readiness 的差別（重要！）**
- `liveness` 失敗：**重啟容器**（解決死鎖、卡死問題）
- `readiness` 失敗：**從 Service 移除**（不重啟，只是暫時不給流量，適合啟動中或暫時忙碌）
- 兩個可以同時設，職責不同

**Docker 對照**
- `docker run --health-cmd` 對應 livenessProbe 的 exec 方式
- Docker 沒有 readinessProbe 的概念（單機不需要 Service 路由）

### ② 所有指令＋講解

**完整 Deployment with Probe YAML**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: probe-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: probe-demo
  template:
    metadata:
      labels:
        app: probe-demo
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "300m"
              memory: "256Mi"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 3
```

```bash
kubectl apply -f probe-demo.yaml
```

打完要看：
```
deployment.apps/probe-demo created
```

---

**查看 Pod 的 Probe 狀態**
```bash
kubectl describe pod <pod-name>
```

打完要看（Containers 區塊）：
```
Containers:
  nginx:
    ...
    Liveness:   http-get http://:80/ delay=10s timeout=1s period=10s #success=1 #failure=3
    Readiness:  http-get http://:80/ delay=5s timeout=1s period=5s #success=1 #failure=3
    ...
Conditions:
  Type              Status
  Initialized       True
  Ready             True     ← readinessProbe 通過，Pod 在 Service Endpoints 裡
  ContainersReady   True
  PodScheduled      True
```
- `Ready: True`：readinessProbe 通過，這個 Pod 會接到 Service 的流量
- `Ready: False`：readinessProbe 失敗，Pod 從 Service Endpoints 移除

---

**觀察 readinessProbe 失敗的效果**

故意把 readinessProbe 的 path 改成不存在的路徑：
```yaml
readinessProbe:
  httpGet:
    path: /not-exist   # nginx 沒有這個路徑，會回 404
    port: 80
```

```bash
kubectl apply -f probe-demo-broken.yaml
kubectl get pods -w
```

打完要看：
```
NAME                         READY   STATUS    RESTARTS
probe-demo-xxx-yyy           0/1     Running   0
probe-demo-xxx-yyy           0/1     Running   0   ← READY 是 0/1，不接流量
```
- `0/1`：0 個容器 ready（readinessProbe 失敗）
- `STATUS` 還是 Running（沒有重啟，只是移出 Endpoints）

```bash
kubectl describe svc probe-demo-svc   # 若有建 Service
# Endpoints 欄位：<none>  ← 沒有 ready 的 Pod，Service 不轉發流量
```

---

**觀察 livenessProbe 失敗的效果**

故意讓 livenessProbe 失敗：
```yaml
livenessProbe:
  exec:
    command: ["sh", "-c", "exit 1"]   # 永遠失敗
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3
```

```bash
kubectl apply -f probe-demo-liveness-fail.yaml
kubectl get pods -w
```

打完要看（等約 30 秒）：
```
NAME                     READY   STATUS    RESTARTS   AGE
probe-demo-xxx-yyy       1/1     Running   0          10s
probe-demo-xxx-yyy       1/1     Running   1          35s   ← RESTARTS 增加！
probe-demo-xxx-yyy       1/1     Running   2          60s
```
- `RESTARTS` 增加：livenessProbe 連續失敗 3 次，K8s 重啟容器
- 每次重啟後 livenessProbe 繼續失敗，RESTARTS 不斷增加
- 最終會變成 `CrashLoopBackOff`

```bash
kubectl describe pod <pod-name> | grep -A10 "Events"
```

打完要看：
```
Events:
  Warning  Unhealthy  Liveness probe failed: ...
  Normal   Killing    Container nginx failed liveness probe, will be restarted
```

---

**清理**
```bash
kubectl delete deployment probe-demo
```

### ③ 題目
1. `livenessProbe` 和 `readinessProbe` 同時設定，各自失敗時會發生什麼事？有什麼不同？
2. 你的 Spring Boot 應用啟動要 60 秒，但 `livenessProbe` 的 `initialDelaySeconds` 只設了 10 秒。會發生什麼問題？要怎麼設定才合理？
3. `kubectl get pods` 看到一個 Pod 的 READY 是 `0/1`，STATUS 是 `Running`。代表什麼？對 Service 有什麼影響？

### ④ 解答
1. `livenessProbe` 失敗：容器被 Kill 然後**重啟**（RESTARTS +1，目的是從死鎖或卡死狀態恢復）。`readinessProbe` 失敗：Pod 從 **Service Endpoints 移除**，不再接收流量，但容器不重啟（目的是暫時讓忙碌或未準備好的 Pod 不接流量）。
2. 問題：Spring Boot 還在啟動時，livenessProbe 就開始檢查，應用還沒起來 → 連續失敗 3 次 → K8s 重啟容器 → 重啟後又在啟動 → 又失敗 → 變成 CrashLoopBackOff，永遠起不來。解法：把 `initialDelaySeconds` 設成 70 秒以上，或使用 `startupProbe`（專門處理慢啟動）。
3. `0/1 Running` = 容器在跑，但 readinessProbe 失敗（或還沒通過）。影響：這個 Pod 的 IP 已從 Service 的 Endpoints 移除，Service 不會把流量導到這個 Pod，所以不影響其他健康 Pod 的服務。

---

## Bonus-3 環境變數與 ConfigMap 預覽（15 分鐘）

### ① 課程內容

**為什麼要把設定從 YAML 抽出來**
- 現在你的 DB 密碼和設定值直接寫在 Deployment YAML 裡
- 問題一：Dev / Staging / Prod 三個環境設定不同，要維護三份幾乎一樣的 YAML
- 問題二：密碼寫在 YAML 推到 Git，安全漏洞
- 解法：用環境變數把設定注入，YAML 本身不寫死值

**三種注入方式（從簡單到進階）**

1. **直接寫在 YAML**（最簡單，但不推薦用於密碼）
```yaml
env:
  - name: DB_HOST
    value: "mysql-svc"
  - name: DB_PORT
    value: "3306"
```

2. **從 ConfigMap 注入**（設定值，可以推到 Git）
```yaml
env:
  - name: DB_HOST
    valueFrom:
      configMapKeyRef:
        name: app-config    # ConfigMap 的名稱
        key: db_host        # ConfigMap 裡的 key
```

3. **從 Secret 注入**（密碼，不應推到 Git）
```yaml
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: app-secret    # Secret 的名稱
        key: db_password    # Secret 裡的 key
```

**ConfigMap 是什麼（預覽，第六堂會詳細教）**
- K8s 的設定管理資源，用來存放非敏感的設定值
- 可以用 `kubectl create configmap` 指令建，也可以寫 YAML
- 修改 ConfigMap 後需要重啟 Pod 才能生效（除非用 Volume 掛載）

**今天先學直接寫環境變數，體驗 env 注入**

### ② 所有指令＋講解

**在 Deployment YAML 裡加 env**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: env-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: env-demo
  template:
    metadata:
      labels:
        app: env-demo
    spec:
      containers:
        - name: busybox
          image: busybox:1.36
          command: ["sh", "-c", "echo DB_HOST=$DB_HOST && echo APP_ENV=$APP_ENV && sleep 3600"]
          env:
            - name: DB_HOST
              value: "mysql-svc"
            - name: APP_ENV
              value: "development"
```

```bash
kubectl apply -f env-demo.yaml
```

打完要看：
```
deployment.apps/env-demo created
```

---

**進容器驗證環境變數**
```bash
kubectl get pods   # 找到 env-demo 的 Pod 名字

kubectl exec -it <pod-name> -- sh
```

進去後：
```bash
echo $DB_HOST
# mysql-svc

echo $APP_ENV
# development

env | grep -E "DB_|APP_"
# DB_HOST=mysql-svc
# APP_ENV=development

exit
```

打完要看：環境變數都有值，代表 YAML 裡的 env 設定成功注入

---

**查看 Pod 的環境變數（不進容器）**
```bash
kubectl describe pod <pod-name> | grep -A 20 "Environment"
```

打完要看：
```
Environment:
  DB_HOST:   mysql-svc
  APP_ENV:   development
```

---

**查看 Pod 日誌（確認 command 有印出 env）**
```bash
kubectl logs <pod-name>
```

打完要看：
```
DB_HOST=mysql-svc
APP_ENV=development
```

---

**清理**
```bash
kubectl delete deployment env-demo
```

### ③ 題目
1. 三種環境變數注入方式（直接寫 value / ConfigMap / Secret），各自適合存放什麼樣的資料？
2. 你有三個環境（dev/staging/prod），DB_HOST 的值不同。如果用「直接寫 value」的方式，你需要維護幾份 Deployment YAML？用 ConfigMap 的話呢？
3. 如果你修改了 ConfigMap 的值，已在跑的 Pod 會立刻拿到新值嗎？要怎麼讓新設定生效？

### ④ 解答
1. 直接寫 `value`：非機密、不常變動的設定（如 feature flag 開關）；`ConfigMap`：應用設定（DB host、port、log level 等），可以推到 Git；`Secret`：機密資料（DB 密碼、API Key、憑證），不推到 Git，用 Vault 或 Sealed Secrets 管理。
2. 直接寫 `value` 需要維護 **3 份** 幾乎一樣的 YAML（只有 DB_HOST 不同）。用 ConfigMap 的話，Deployment YAML **只需要一份**，針對不同環境建不同的 ConfigMap，deploy 時套用對應的 ConfigMap 即可。
3. **不會立刻生效**。以 `env` 方式注入的環境變數在 Pod 啟動時就固定了，修改 ConfigMap 後需要重啟 Pod（`kubectl rollout restart deployment <name>`）才能拿到新值。若用 Volume 掛載 ConfigMap 的方式，修改後約 1 分鐘內 Pod 內的檔案會自動更新。

---

## 本堂小結

**今天新學的 YAML 欄位：**
```yaml
spec:
  containers:
    - name: app
      resources:
        requests:         # Scheduler 排程用
          cpu: "100m"
          memory: "128Mi"
        limits:           # 超過就限速 / OOM Kill
          cpu: "500m"
          memory: "256Mi"
      livenessProbe:      # 活著嗎？失敗 → 重啟
        httpGet:
          path: /health
          port: 8080
        initialDelaySeconds: 15
        periodSeconds: 10
        failureThreshold: 3
      readinessProbe:     # 準備好了嗎？失敗 → 移出 Endpoints
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 5
        failureThreshold: 3
      env:
        - name: DB_HOST
          value: "mysql-svc"
```

**第六堂會繼續補完：**
- ConfigMap（把 env value 抽出去管）
- Secret（安全版的 ConfigMap）
- 把 ConfigMap 當成檔案掛進容器（Volume 方式）
