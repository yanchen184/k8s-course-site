# Day 5 Loop 2 — Deployment 擴縮容

---

## 5-3 擴縮容概念（15 min）

### ① 課程內容

**Pod 的脆弱性**

- 直接用 `kubectl apply -f pod.yaml` 建出的 Pod 是「裸 Pod」（naked Pod）
- 裸 Pod 沒有任何守護機制：刪了就沒了，沒有控制器會幫你補回來
- 實際生產環境幾乎不會直接建裸 Pod，一定透過 Deployment 或其他控制器管理
- 只有在 debug、一次性 Job 等情境才會用裸 Pod

**Deployment 三層結構**

```
Deployment
    └── ReplicaSet（自動建立）
            ├── Pod 1
            ├── Pod 2
            └── Pod 3
```

- **第一層 Deployment**：管理「期望狀態」（我要幾個副本、用哪個映像）
  - 當你更新映像版本，Deployment 建一個新 ReplicaSet，做滾動更新
  - 當你回滾，Deployment 把舊的 ReplicaSet 重新擴容
- **第二層 ReplicaSet**：維持 Pod 數量等於 `replicas` 設定值
  - ReplicaSet 永遠在監控：Pod 少了就補，Pod 多了就刪
  - 通常不直接操作 ReplicaSet，由 Deployment 代為管理
- **第三層 Pod**：實際跑容器的最小單位

**為什麼需要 ReplicaSet 這一層**

- **滾動更新時新舊並存**：更新映像時，Deployment 建新 ReplicaSet（新版本），同時縮小舊 ReplicaSet（舊版本），保持服務不中斷
  - 例如：原本 3 個舊 Pod → 先建 1 個新 Pod → 刪 1 個舊 Pod → 建 1 個新 Pod → 刪 1 個舊 Pod...
- **回滾用舊 RS 重新擴容**：Deployment 預設保留最近 10 個 ReplicaSet 的歷史記錄，回滾時只需要把舊 RS 的 `replicas` 從 0 改回目標數量
- 如果沒有這一層，更新和回滾都必須重新建立 Pod，有停機風險

**Deployment YAML 三個新欄位**

```yaml
apiVersion: apps/v1       # 注意：不是 v1，是 apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
spec:
  replicas: 3             # 新欄位①：要維持幾個 Pod 副本
  selector:               # 新欄位②：告訴 Deployment 它要管哪些 Pod
    matchLabels:
      app: nginx
  template:               # 新欄位③：Pod 的模板（建 Pod 時照這個格式建）
    metadata:
      labels:
        app: nginx        # 必須和 selector.matchLabels 一致！
    spec:
      containers:
      - name: nginx       # containers[].name：set image 指令會用到
        image: nginx:1.25
        ports:
        - containerPort: 80
```

**apiVersion 差異**

| 資源類型 | apiVersion | 說明 |
|----------|-----------|------|
| Pod | `v1` | 核心 API 群組，不需要加前綴 |
| Service | `v1` | 核心 API 群組 |
| Deployment | `apps/v1` | apps 擴充 API 群組 |
| ReplicaSet | `apps/v1` | apps 擴充 API 群組 |
| DaemonSet | `apps/v1` | apps 擴充 API 群組 |
| StatefulSet | `apps/v1` | apps 擴充 API 群組 |

- 記法：凡是「管 Pod 副本、有狀態」的控制器，幾乎都是 `apps/v1`；基本資源（Pod、Service、ConfigMap）用 `v1`

**selector.matchLabels 和 template.metadata.labels 必須一致**

- `selector.matchLabels`：告訴 ReplicaSet「哪些 Pod 是我管的」（用 label 來篩選）
- `template.metadata.labels`：這個模板建出來的 Pod 會帶哪些 label
- **不一致的後果**：kubectl apply 時報錯 `selector does not match template labels`，YAML 無法套用
- 常見錯誤：selector 寫 `app: nginx`，template 寫 `app: my-nginx`，這樣 ReplicaSet 找不到自己建出的 Pod，會一直無限建新 Pod

**containers[].name 的用途**

- 每個容器必須有 name，在一個 Pod 有多個容器時用來區分
- `kubectl set image` 指令需要指定容器名稱：
  ```bash
  kubectl set image deployment/nginx-deploy nginx=nginx:1.26
  #                                          ↑ 這裡是 containers[].name
  ```
- 取名建議：和映像名稱保持一致（nginx 容器叫 nginx），避免混淆

**Docker 對照**

| 功能 | Docker Compose | Kubernetes Deployment |
|------|---------------|----------------------|
| 設定副本數 | `deploy.replicas: 3` | `spec.replicas: 3` |
| 擴容 | `docker compose up --scale web=5` | `kubectl scale deployment nginx-deploy --replicas=5` |
| 自我修復 | 需要 `restart: always` + Swarm | 預設行為，Deployment 自動補 Pod |
| 滾動更新 | `docker service update --image ...` | `kubectl set image deployment/...` |

---

**Labels（標籤）與 Selector（選擇器）概念**

> 這個概念跟 Deployment YAML 直接相關，現在一起講清楚，5-9 會再做進階應用。

- **Labels**：附加在 K8s 資源上的 `key=value` 鍵值對，完全自訂，不影響功能本身，只是「標記」
- **Selector**：用 label 條件篩選一群資源，真正發揮 label 的作用

**Deployment YAML 裡 Labels 的三處（最容易搞混）**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  labels:
    app: nginx          # ← ① Deployment 自己的 label（給外部選這個 Deployment 用）
spec:
  selector:
    matchLabels:
      app: nginx        # ← ② Selector（Deployment 用這個條件找「自己的 Pod」）
  template:
    metadata:
      labels:
        app: nginx      # ← ③ Pod 的 label（建出來的 Pod 會帶這個標籤）
```

**三處的關係：**
- ② 和 ③ 必須完全一致，Deployment 才能「認領」自己建出來的 Pod
- ① 可以和 ②③ 不同，它是讓外部（例如 Service）選這個 Deployment 本身用的
- **② ③ 不一致的後果**：Deployment 找不到自己的 Pod，誤以為數量不夠，一直無限建新 Pod

**常見 Label 慣例（不強制）**

| Key | 範例值 | 用途 |
|-----|--------|------|
| `app` | `nginx`、`api` | 應用程式名稱 |
| `env` | `prod`、`staging` | 環境 |
| `version` | `v1.28` | 版本號 |
| `tier` | `frontend`、`backend` | 層級 |

---

### ② 所有指令＋講解

本節以概念為主，指令集中於 5-4 實作。

---

### ③ 題目

1. 為什麼 Deployment 需要 ReplicaSet 這一層？如果 Deployment 直接管 Pod，滾動更新時會有什麼問題？
2. 以下 YAML 有一個錯誤，找出來並說明會造成什麼後果：
   ```yaml
   selector:
     matchLabels:
       app: web
   template:
     metadata:
       labels:
         app: nginx
   ```
3. `apiVersion: v1` 和 `apiVersion: apps/v1` 分別對應哪些 K8s 資源？各舉兩個例子。

---

### ④ 解答

1. ReplicaSet 讓滾動更新可以新舊並存：更新時 Deployment 建新 RS（新版本映像）並逐步縮小舊 RS，保持服務不中斷。如果沒有 RS 這層，Deployment 直接管 Pod，更新時必須先刪舊 Pod 再建新 Pod，有短暫停機風險；且回滾無法快速實現，因為沒有保存舊版本的 RS 歷史。

2. 錯誤：`selector.matchLabels` 是 `app: web`，但 `template.metadata.labels` 是 `app: nginx`，兩者不一致。後果：kubectl apply 會報錯 `selector does not match template labels`，無法建立 Deployment。即便強制通過，ReplicaSet 也永遠找不到 `app: web` 的 Pod（因為建出來的 Pod 都帶 `app: nginx`），會無限建新 Pod。

3. `v1`：Pod、Service、ConfigMap、Secret、Namespace。`apps/v1`：Deployment、ReplicaSet、DaemonSet、StatefulSet。

---

## 5-4 擴縮容實作（25 min）

### ① 課程內容

**實作流程**

1. 撰寫 Deployment YAML 並套用
2. 觀察 Deployment → ReplicaSet → Pod 三層結構
3. 測試自我修復（刪 Pod 看 K8s 自動補）
4. 用 kubectl scale 調整副本數
5. 觀察 Pod 分散在不同 Node（`-o wide` 欄位）

**完整 Deployment YAML 範例**

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
```

---

### ② 所有指令＋講解

---

**套用 Deployment YAML**

```bash
kubectl apply -f nginx-deployment.yaml
```

- `apply`：宣告式套用，若資源不存在則建立，若已存在則更新（diff 後套用差異）
- `-f nginx-deployment.yaml`：指定 YAML 檔案路徑

打完要看：
```
deployment.apps/nginx-deploy created
```
若是更新已存在的 Deployment，則顯示：
```
deployment.apps/nginx-deploy configured
```

---

**查看 Deployment 狀態**

```bash
kubectl get deployments
```

- `get deployments`：列出目前 namespace 所有 Deployment
- 縮寫：`kubectl get deploy`

打完要看：
```
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deploy   3/3     3            3           30s
```

欄位說明：
- `NAME`：Deployment 名稱
- `READY`：`實際跑起來的 Pod 數` / `期望副本數`（如 `3/3` 代表全部就緒）
- `UP-TO-DATE`：已更新到最新版本的 Pod 數量
- `AVAILABLE`：健康且可接受流量的 Pod 數量
- `AGE`：Deployment 存在的時間

異常狀況：
- READY 一直是 `0/3`：查 `kubectl describe deployment nginx-deploy` 看 Events
- AVAILABLE 小於 READY：Pod 跑起來了但健康檢查失敗

---

**查看 ReplicaSet**

```bash
kubectl get replicasets
```

- `get replicasets`：列出 ReplicaSet（縮寫 `kubectl get rs`）

打完要看：
```
NAME                      DESIRED   CURRENT   READY   AGE
nginx-deploy-7d9f5b8c4d   3         3         3       45s
```

欄位說明：
- `NAME`：格式為 `<Deployment名稱>-<隨機hash>`，hash 由 Pod template 內容決定
- `DESIRED`：期望的 Pod 數量（對應 Deployment 的 replicas）
- `CURRENT`：目前已建立的 Pod 數量
- `READY`：健康就緒的 Pod 數量

注意：更新映像後會看到兩個 RS，舊的 DESIRED=0，新的 DESIRED=3，這是正常的滾動更新行為。

---

**查看 Pod 列表**

```bash
kubectl get pods
```

打完要看：
```
NAME                            READY   STATUS    RESTARTS   AGE
nginx-deploy-7d9f5b8c4d-abc12   1/1     Running   0          1m
nginx-deploy-7d9f5b8c4d-def34   1/1     Running   0          1m
nginx-deploy-7d9f5b8c4d-ghi56   1/1     Running   0          1m
```

欄位說明：
- `NAME`：格式為 `<Deployment名>-<RS-hash>-<Pod隨機id>`
- `READY`：`容器就緒數` / `容器總數`（一般 1/1 代表正常）
- `STATUS`：Running / Pending / CrashLoopBackOff / ImagePullBackOff 等
- `RESTARTS`：容器重啟次數，大於 0 要注意

---

**查看 Pod 分散到哪個 Node**

```bash
kubectl get pods -o wide
```

- `-o wide`：輸出更多欄位，包含 IP 和所在 Node

打完要看：
```
NAME                            READY   STATUS    RESTARTS   AGE   IP           NODE
nginx-deploy-7d9f5b8c4d-abc12   1/1     Running   0          2m    10.42.1.5    k3s-worker1
nginx-deploy-7d9f5b8c4d-def34   1/1     Running   0          2m    10.42.2.6    k3s-worker2
nginx-deploy-7d9f5b8c4d-ghi56   1/1     Running   0          2m    10.42.0.7    k3s-master
```

欄位說明（新增欄位）：
- `IP`：Pod 的叢集內部 IP（只在叢集內可連）
- `NODE`：這個 Pod 被調度到哪個 Node
- `NOMINATED NODE`：搶占式調度的候補 Node（通常為 `<none>`）
- `READINESS GATES`：自訂就緒條件（通常為 `<none>`）

重點觀察：不同 Pod 的 NODE 欄位應顯示不同 Node 名稱，這就是「分散部署」的效果！（minikube 環境下這裡全部一樣）

---

**查看 Deployment 詳細資訊**

```bash
kubectl describe deployment nginx-deploy
```

- `describe deployment <name>`：顯示 Deployment 的詳細狀態和事件

打完要看（關鍵區塊）：
```
Name:               nginx-deploy
Namespace:          default
Replicas:           3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:       RollingUpdate
RollingUpdateStrategy:  25% max unavailable, 25% max surge
...
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  3m    deployment-controller  Scaled up replica set nginx-deploy-7d9f5b8c4d to 3
```

重點欄位：
- `Replicas`：desired=期望、updated=已更新、total=總數、available=可用、unavailable=不可用
- `StrategyType: RollingUpdate`：滾動更新策略（預設）
- `Events`：記錄 Deployment 的操作歷史

---

**測試自我修復（刪 Pod）**

```bash
# 先記住其中一個 Pod 的名字
kubectl get pods

# 刪掉它
kubectl delete pod nginx-deploy-7d9f5b8c4d-abc12
```

- `delete pod <pod-name>`：刪除指定 Pod

打完要看：
```
pod "nginx-deploy-7d9f5b8c4d-abc12" deleted
```

立刻再查一次：
```bash
kubectl get pods
```
```
NAME                            READY   STATUS              RESTARTS   AGE
nginx-deploy-7d9f5b8c4d-def34   1/1     Running             0          5m
nginx-deploy-7d9f5b8c4d-ghi56   1/1     Running             0          5m
nginx-deploy-7d9f5b8c4d-xyz99   0/1     ContainerCreating   0          2s    ← 新的 Pod！
```
ReplicaSet 偵測到 Pod 數量從 3 變成 2（少了一個），立即建新 Pod 補回來。幾秒後新 Pod STATUS 變成 Running，Pod 總數恢復為 3。

---

**擴容（增加副本數）**

```bash
kubectl scale deployment nginx-deploy --replicas=5
```

- `scale deployment <name>`：調整指定 Deployment 的副本數
- `--replicas=5`：設定期望副本數為 5

打完要看：
```
deployment.apps/nginx-deploy scaled
```

立刻查：
```bash
kubectl get pods
```
```
NAME                            READY   STATUS              RESTARTS   AGE
nginx-deploy-7d9f5b8c4d-def34   1/1     Running             0          8m
nginx-deploy-7d9f5b8c4d-ghi56   1/1     Running             0          8m
nginx-deploy-7d9f5b8c4d-xyz99   1/1     Running             0          3m
nginx-deploy-7d9f5b8c4d-new01   0/1     ContainerCreating   0          1s    ← 新增的
nginx-deploy-7d9f5b8c4d-new02   0/1     ContainerCreating   0          1s    ← 新增的
```
幾秒後全部變 Running，`kubectl get deployments` 顯示 READY `5/5`。

---

**縮容（減少副本數）**

```bash
kubectl scale deployment nginx-deploy --replicas=3
```

打完要看：
```
deployment.apps/nginx-deploy scaled
```

立刻查：
```bash
kubectl get pods
```
K8s 會隨機終止 2 個 Pod，剩下 3 個 Running。被終止的 Pod 會短暫顯示 `Terminating` 後消失。

---

### ③ 題目

1. 用 `kubectl get pods` 後，發現 3 個 Pod 裡有 1 個 RESTARTS 是 5，其他是 0，可能是什麼原因？如何進一步排查？
2. 解釋 `kubectl get deployments` 輸出中 `READY`、`UP-TO-DATE`、`AVAILABLE` 三個欄位的差異。
3. 操作題：把 nginx-deploy 的副本數擴容到 6，然後用 `kubectl get pods -o wide` 確認 Pod 是否分散在不同 Node 上。

---

### ④ 解答

1. RESTARTS 高代表容器不斷崩潰後被重啟（CrashLoopBackOff）。排查步驟：先 `kubectl describe pod <pod-name>` 看 Events 和 Last State 的退出碼（Exit Code）；再 `kubectl logs <pod-name>` 看容器輸出的錯誤訊息；若容器已崩潰，用 `kubectl logs <pod-name> --previous` 看上一次容器的日誌。

2. 三個欄位的差異：
   - `READY`：顯示「通過就緒探針（readinessProbe）」的 Pod 數 / 期望數，代表真正可接收流量的數量
   - `UP-TO-DATE`：已更新到當前 Deployment 最新模板版本的 Pod 數，更新進行中時這個數字逐步增加
   - `AVAILABLE`：健康且已達到 `minReadySeconds` 設定時間的 Pod 數（預設 minReadySeconds=0 時等同 READY）

3. 操作步驟：
   ```bash
   kubectl scale deployment nginx-deploy --replicas=6
   kubectl get pods -o wide
   ```
   觀察 NODE 欄位，6 個 Pod 應分散到 k3s-master、k3s-worker1、k3s-worker2 三個節點，每個節點約 2 個 Pod（Scheduler 預設盡量分散）。

---

## 5-5 回頭操作 Loop 1 — 學生情境練習（15 min）

### ① 課程內容

本節為學生獨立練習時間。PPT 上有兩個情境題，學生照 PPT 做，不需要老師逐步帶。

**本節情境設計邏輯：**
- 情境題 1（必做）：scale 基本練習，熟悉指令
- 情境題 2（挑戰）：接手壞掉的 Deployment，應用 Labels/Selector 概念找 bug

**老師角色：**
- 宣布開始後去巡堂
- 結束前帶大家看答案

> 📋 學生看的是 PPT 投影片（5-4 第三張），上面有完整 YAML 和任務說明。

---

### ② 所有指令＋講解

（本節以學生操作為主，老師巡堂。無新指令。）

---

### ③ 題目

**情境一：scale 練習（必做）**

1. 建一個 **httpd** Deployment，初始 replicas: 2
2. `kubectl scale` 到 5，用 `-o wide` 看 Node 分散
3. `kubectl scale` 回 1，確認只剩 1 個 Pod

---

**情境二：接手壞掉的 Deployment（情境挑戰）**

同事離職，留下這份 YAML。你 apply 之後，Pod 一直起不來。找出 bug 並修復。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-broken
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: website    # ← 注意這裡
    spec:
      containers:
      - name: web
        image: nginx:1.25
```

**任務：**
1. 把上面 YAML 存成 `broken-deploy.yaml`，apply 到叢集
2. 觀察發生什麼事（Deployment 狀態？Pod 數量？）
3. 找出 bug，說明它會造成什麼問題
4. 修復 YAML，重新 apply，驗證 Pod 正常 Running

**驗收：**
- `kubectl get pods` → STATUS = Running
- `kubectl describe deployment web-broken` → Selector 與 Pod Template Labels 值一致

---

### ④ 解答

**情境一解答**

```bash
kubectl create deployment my-httpd --image=httpd --replicas=2
kubectl scale deployment my-httpd --replicas=5
kubectl get pods -o wide       # 看 NODE 欄位
kubectl scale deployment my-httpd --replicas=1
kubectl get pods               # 只剩 1 個
```

---

**情境二解答**

**Bug 位置：** `selector.matchLabels.app = web`，但 `template.metadata.labels.app = website`，兩者不一致。

**問題說明：**
- Deployment 的 selector 是它用來「認領 Pod」的條件
- apply 時 K8s 會直接報錯（`The Deployment "web-broken" is invalid: spec.selector does not match template labels`）
- 即使繞過，Deployment controller 也永遠找不到自己建出的 Pod，誤以為 Pod 數不足，一直補新 Pod，數量失控增長

**修復：** 把 `template.metadata.labels.app` 從 `website` 改成 `web`，和 selector 一致。

```bash
# 修改 broken-deploy.yaml 後重新 apply
kubectl apply -f broken-deploy.yaml

# 驗收
kubectl get pods          # STATUS = Running
kubectl describe deployment web-broken | grep -A5 Selector

# 清理
kubectl delete deployment web-broken
kubectl delete deployment my-httpd
```

**老師補充說明重點：**
- K8s 在 `apply` 時會做 validation，selector 和 template labels 不一致**直接報錯**，學生可以在 Events 裡看到
- 這是 YAML 最常見的坑之一，熟記三處 labels 的關係就能避免
