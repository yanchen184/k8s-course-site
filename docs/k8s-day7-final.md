# 第七堂 — 生產就緒：安全、監控與總複習（完整投影片 + 逐字稿）

> 35 頁投影片，含 PPT 提詞內容 + 可直接念的逐字稿
> 對象：已完成第四～六堂的容器學員
> 故事線：程式卡死沒人知 → Probe → 資源被吃光 → Resource limits → 流量暴增 → HPA → 誰都能刪 → RBAC → 全通不安全 → NetworkPolicy → 總複習串起來

---

## 第 1 頁 | 開場 + 回顧（5min）

### PPT 上的內容

**第六堂我們學了什麼**

| 主題 | 一句話 |
|:---:|---------|
| Ingress | 用域名 + 路徑規則取代 NodePort，一個入口分流多個 Service |
| ConfigMap | 設定檔抽出來，不寫死在 Image 裡 |
| Secret | 敏感資料（密碼、Token）用 Base64 編碼儲存 |
| PV / PVC | Pod 重啟資料不見？用 PVC 申請持久化儲存 |
| StatefulSet | 資料庫用 StatefulSet，每個 Pod 有穩定名稱 + 自己的 PVC |
| Helm | K8s 的套件管理器，一行裝好複雜應用 |

**第六堂的反思問題：**
> 「你的系統全部跑起來了，但你怎麼知道 API 有沒有卡死？Pod 顯示 Running，流量照送，使用者看到 502。怎麼辦？」

**→ 答案就是今天第一個主題：Probe（健康檢查）**

**今天的旅程：**

```
Probe（健康檢查）→ Resource/HPA（資源管理）→ RBAC（權限控制）
→ NetworkPolicy（網路隔離）→ DaemonSet/Job/CronJob（特殊工作負載）
→ 日誌與除錯 → 總複習實戰（12 步部署）→ 課程回顧
```

### 逐字稿

歡迎回來！今天是我們 Kubernetes 課程的最後一堂，也是最重要的一堂。前面三堂課你已經學會了怎麼部署應用、設定網路、管理資料。但老實說，到目前為止我們部署的東西還不能算「生產就緒」。今天我們要補齊最後一塊拼圖。

先快速回顧第六堂。我們學了 Ingress，讓使用者可以用域名連到你的服務，不用記 IP 和 Port。學了 ConfigMap 和 Secret，把設定和密碼從程式碼裡抽出來。學了 PV 和 PVC，讓資料不會因為 Pod 重啟就消失。學了 StatefulSet，專門用來跑資料庫這種需要穩定身份和獨立儲存的應用。最後學了 Helm，一行指令就能裝好複雜的應用。

上堂課結束的時候，我留了一個反思問題：「你的 API 跑起來了，Service 也建好了，但你怎麼知道 API 有沒有卡死？」K8s 顯示 Pod 是 Running 狀態，但你的程式可能已經死鎖了、資料庫連線池滿了、或者任何原因導致它其實沒辦法正常服務。這時候 K8s 還是傻傻地把流量轉過去，使用者就看到 502。

怎麼辦？答案就是今天第一個主題 — Probe，健康檢查。

今天的內容非常豐富。我們會先學 Probe、Resource 管理加 HPA、然後是 RBAC。接著學 NetworkPolicy、DaemonSet 和 Job/CronJob、日誌與除錯，最後做一個從零到一的總複習實戰，把四堂課學的東西全部串起來。準備好了嗎？我們開始。

---

## 第 2 頁 | 痛點：Pod Running 不代表服務正常（5min）

### PPT 上的內容

**Pod 狀態 Running ≠ 應用正常**

```
場景 1：API 死鎖
  Pod 狀態：Running ✅
  實際情況：程式碼卡在無窮迴圈，不回應任何請求 ❌

場景 2：DB 連線池滿了
  Pod 狀態：Running ✅
  實際情況：每個請求都回 500 Internal Server Error ❌

場景 3：應用還在啟動
  Pod 狀態：Running ✅
  實際情況：Spring Boot 要啟動 60 秒，前 60 秒的請求全部失敗 ❌
```

**Docker 怎麼做？**

```dockerfile
# Dockerfile 的 HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1
```

**K8s 的做法更強大：三種 Probe，各司其職**

### 逐字稿

我們先深入理解這個痛點。大家在第五堂學過，kubectl get pods 看到 STATUS 是 Running，就覺得沒事了。但 Running 只代表「容器的主行程還在跑」，不代表你的應用能正常服務。

舉三個場景。第一，你的 API 程式碼有 bug，進入了死鎖或無窮迴圈。容器還在，行程還在，K8s 以為一切正常，但其實你的 API 一個請求都回應不了。第二，你的 API 連資料庫，但連線池滿了，每個請求都回 500。第三，你用 Spring Boot 寫 API，它啟動要 60 秒，但 K8s 在容器啟動的瞬間就把流量轉過去了，前 60 秒的使用者全部看到錯誤。

用 Docker 的經驗來想，Dockerfile 有一個 HEALTHCHECK 指令，可以定期檢查容器是不是健康的。但 Docker 的 HEALTHCHECK 只有一種，而且功能很有限 — 它只能決定容器是不是 healthy，不能做更細緻的事情。

K8s 在這方面強大得多。它有三種 Probe，每一種負責不同的事情。我們一個一個來看。

---

## 第 3 頁 | 三種 Probe 概念（10min）

### PPT 上的內容

**三種 Probe，各司其職**

| Probe | 中文 | 問的問題 | 失敗怎麼辦 | 適用場景 |
|-------|------|---------|-----------|---------|
| **livenessProbe** | 存活探測 | 你還活著嗎？ | 重啟容器 | 偵測死鎖、無窮迴圈 |
| **readinessProbe** | 就緒探測 | 你準備好接流量了嗎？ | 從 Service 移除 | 啟動中、暫時過載 |
| **startupProbe** | 啟動探測 | 你啟動完了嗎？ | 重啟容器 | 啟動慢的應用（Java） |

**生活化比喻：餐廳**

```
livenessProbe  = 廚師還有心跳嗎？  → 沒有 → 換一個廚師（重啟）
readinessProbe = 廚師準備好出菜了嗎？ → 沒有 → 先不要送單進去（不轉流量）
startupProbe   = 廚師還在熱鍋嗎？  → 是的 → 等他熱好再檢查其他的
```

**三種檢查方式：**

| 方式 | 寫法 | 適合檢查什麼 |
|------|------|------------|
| HTTP GET | `httpGet: path: /health` | Web API（最常用） |
| TCP Socket | `tcpSocket: port: 3306` | 資料庫、Redis |
| exec 指令 | `exec: command: [...]` | 自訂檢查邏輯 |

### 逐字稿

K8s 有三種 Probe。第一種叫 livenessProbe，存活探測，它問的問題是：「你還活著嗎？」如果 liveness 檢查失敗了，K8s 會直接重啟這個容器。這適合偵測那些不會自己恢復的問題，比如死鎖、無窮迴圈。

第二種叫 readinessProbe，就緒探測，它問的問題是：「你準備好接受流量了嗎？」如果 readiness 檢查失敗了，K8s 不會重啟容器，而是把這個 Pod 從 Service 的 Endpoints 裡移除，暫時不把流量轉給它。等它恢復了，再加回來。這適合那些「暫時不能服務但會自己恢復」的場景，比如應用正在啟動中、或者暫時過載。

第三種叫 startupProbe，啟動探測。這是給那些啟動特別慢的應用用的。比如你的 Java 應用啟動要 60 秒，如果沒有 startupProbe，livenessProbe 在 Pod 啟動後就開始檢查，60 秒內一直失敗，連續失敗超過閾值，K8s 就會重啟容器。然後又啟動、又失敗、又重啟，陷入無窮迴圈。有了 startupProbe，K8s 會先等 startupProbe 通過之後，才開始跑 liveness 和 readiness。

我用一個餐廳的比喻。livenessProbe 就像檢查廚師還有沒有心跳 — 沒心跳就換一個。readinessProbe 就像問廚師準備好出菜沒 — 還沒好就先不送單進去。startupProbe 就像廚師還在熱鍋 — 等他熱好再說。

三種 Probe 各自有三種檢查方式。HTTP GET 最常用，指定一個路徑和 port，K8s 會定期去打那個 URL，回傳 200-399 就是成功。TCP Socket 適合資料庫和 Redis 這種不是 HTTP 的服務，K8s 只檢查 port 能不能連上。exec 是執行一個指令，回傳值是 0 就是成功。

---

## 第 4 頁 | Probe YAML 拆解（10min）

### PPT 上的內容

**完整的 Probe YAML：**

```yaml
spec:
  containers:
    - name: api
      image: nginx:1.27
      ports:
        - containerPort: 80
      livenessProbe:
        httpGet:
          path: /                    # 檢查的路徑
          port: 80                   # 檢查的 port
        initialDelaySeconds: 5       # 啟動後等 5 秒才開始
        periodSeconds: 10            # 每 10 秒檢查一次
        failureThreshold: 3          # 連續失敗 3 次才判定
        timeoutSeconds: 1            # 每次檢查的超時
      readinessProbe:
        httpGet:
          path: /
          port: 80
        initialDelaySeconds: 3
        periodSeconds: 5
        failureThreshold: 2
```

**四個關鍵參數：**

| 參數 | 預設值 | 白話解釋 |
|------|:---:|---------|
| `initialDelaySeconds` | 0 | 啟動後先等幾秒再開始檢查 |
| `periodSeconds` | 10 | 多久檢查一次 |
| `failureThreshold` | 3 | 連續失敗幾次才算不健康 |
| `timeoutSeconds` | 1 | 每次檢查等多久算超時 |

**Docker HEALTHCHECK 對照：**

| Docker | K8s |
|--------|-----|
| `--interval=30s` | `periodSeconds: 30` |
| `--timeout=3s` | `timeoutSeconds: 3` |
| `--retries=3` | `failureThreshold: 3` |
| `--start-period=5s` | `initialDelaySeconds: 5` |
| 只有一種 | liveness + readiness + startup 三種 |

### 逐字稿

好，我們來看 YAML 怎麼寫。大家打開 `deployment-probe.yaml` 這個檔案。

livenessProbe 的設定寫在 container 底下。`httpGet` 指定用 HTTP GET 方式檢查，`path: /` 表示打根路徑，`port: 80` 表示打 80 port。

接下來四個參數很重要。`initialDelaySeconds: 5` 表示 Pod 啟動後先等 5 秒再開始檢查，給你的應用一點啟動時間。`periodSeconds: 10` 表示每 10 秒檢查一次。`failureThreshold: 3` 表示連續失敗 3 次才判定為不健康 — 不是失敗一次就重啟，這樣太敏感了，可能只是網路抖了一下。`timeoutSeconds: 1` 表示每次檢查如果 1 秒內沒回應就算超時。

readinessProbe 的寫法一模一樣，只是參數可以不同。通常 readiness 的 `initialDelaySeconds` 會設短一點，`periodSeconds` 也短一點，因為我們想要 Pod 準備好了就趕快讓流量進來。

對照 Docker 的 HEALTHCHECK，概念幾乎一一對應。`--interval` 對應 `periodSeconds`，`--timeout` 對應 `timeoutSeconds`，`--retries` 對應 `failureThreshold`，`--start-period` 對應 `initialDelaySeconds`。最大的差別是 Docker 只有一種 HEALTHCHECK，K8s 有三種，各負責不同的事。

---

## 第 5 頁 | 實作：Probe + 故意搞壞（15min）

### PPT 上的內容

**Lab 1：Health Check**

**Step 1：部署**
```bash
kubectl apply -f deployment-probe.yaml
kubectl get pods -l app=api-probe-demo
```

**Step 2：確認 Probe 狀態**
```bash
kubectl describe pods -l app=api-probe-demo | grep -A10 "Liveness\|Readiness"
```

**Step 3：故意讓 livenessProbe 失敗**
```bash
POD_NAME=$(kubectl get pods -l app=api-probe-demo -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
kubectl get pods -l app=api-probe-demo -w
# 觀察 RESTARTS 欄位會增加！
```

**預期結果：**
```
NAME                 READY   STATUS    RESTARTS   AGE
api-probe-demo-xxx   1/1     Running   0          2m
api-probe-demo-xxx   0/1     Running   1          2m30s   ← 重啟了！
api-probe-demo-xxx   1/1     Running   1          2m35s   ← 恢復正常
```

### 逐字稿

概念講完了，我們馬上來動手。請大家打開終端機。

先部署帶 Probe 的 Deployment：

```
kubectl apply -f deployment-probe.yaml
```

然後查看 Pod 狀態：

```
kubectl get pods -l app=api-probe-demo
```

兩個 Pod 都是 Running，READY 是 1/1，RESTARTS 是 0。到目前為止一切正常。

我們來看看 Probe 的詳細資訊：

```
kubectl describe pods -l app=api-probe-demo | grep -A10 "Liveness\|Readiness"
```

你會看到 Liveness 和 Readiness 的設定，包括 HTTP GET 的路徑、delay、period、threshold 這些參數。

好，現在我們來做壞事。我要讓 livenessProbe 失敗。nginx 的 livenessProbe 是打 `GET /`，如果我把 `index.html` 刪掉，nginx 就會回 403 或 404，livenessProbe 就會判定失敗。

先抓一個 Pod 的名字：

```
POD_NAME=$(kubectl get pods -l app=api-probe-demo -o jsonpath='{.items[0].metadata.name}')
```

然後進去刪掉 index.html：

```
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
```

現在開始觀察：

```
kubectl get pods -l app=api-probe-demo -w
```

大家猜猜看，接下來會發生什麼？

[停頓 3 秒讓學員思考]

因為 `initialDelaySeconds` 是 5 秒、`periodSeconds` 是 10 秒、`failureThreshold` 是 3，所以大概要等 30 秒左右，livenessProbe 會連續失敗 3 次，然後 K8s 就會重啟這個容器。你會看到 RESTARTS 欄位從 0 變成 1。

重啟之後會怎樣？因為容器是重新啟動的，nginx 會重新載入預設的 `index.html`，所以 livenessProbe 又通過了，Pod 恢復正常。

這就是 livenessProbe 的威力 — 它不只能偵測問題，還能自動修復（透過重啟）。

按 Ctrl+C 停止 watch。等一下做 RBAC 的時候我們會把這些清理掉，現在先留著。

---

## 第 6 頁 | startupProbe 概念（5min）

### PPT 上的內容

**為什麼需要 startupProbe？**

```
Java Spring Boot 啟動要 60 秒

沒有 startupProbe：
  0s  → Pod 建立
  5s  → livenessProbe 開始 → 第 1 次失敗（initialDelay=5）
  15s → 第 2 次失敗（period=10）
  25s → 第 3 次失敗 → 重啟！（但應用才啟動 25 秒）
  ∞   → 永遠啟動不了，一直在重啟迴圈

有 startupProbe：
  0s  → Pod 建立
  5s  → startupProbe 開始（每 5 秒檢查，最多 10 次 = 等 55 秒）
  60s → startupProbe 通過！
  60s → 開始跑 livenessProbe 和 readinessProbe
```

**startupProbe YAML：**

```yaml
startupProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 10     # 5 + (5 x 10) = 最多等 55 秒
```

### 逐字稿

剛才我們講了 liveness 和 readiness，還有一個 startupProbe 我要單獨拿出來講，因為它的用途很特別。

想像你的 Java Spring Boot 應用啟動要 60 秒。如果你只設了 livenessProbe，`initialDelaySeconds` 設 5 秒、`periodSeconds` 10 秒、`failureThreshold` 3 次，那麼第 5 秒開始第一次檢查，第 15 秒第二次，第 25 秒第三次 — 連續失敗 3 次，K8s 就重啟容器。但你的應用要 60 秒才能啟動啊！結果就是永遠啟動不了，陷入無窮重啟迴圈。

你可能會想：那我把 `initialDelaySeconds` 設成 60 不就好了？可以，但這有個問題 — 如果你的應用在運行過程中真的掛了，K8s 也要等 60 秒才開始檢查。這就失去了快速偵測故障的意義。

startupProbe 就是解決這個問題的。在 startupProbe 通過之前，liveness 和 readiness 都不會跑。你可以給 startupProbe 一個比較寬鬆的檢查設定，比如每 5 秒檢查一次、最多失敗 10 次，那就是 `5 + 5 x 10 = 55 秒`。啟動完之後，liveness 和 readiness 才接手，用比較嚴格的設定去監控。

我們的 Lab 裡 nginx 啟動很快所以不太需要 startupProbe，但在總複習實戰的 API Deployment 裡，我有加上 startupProbe 給大家看。

好，Probe 這個章節就到這裡。我們做個小結。

---

## 第 7 頁 | Probe 小結（2min）

### PPT 上的內容

**Probe 三分鐘總結**

1. **livenessProbe** → 掛了就重啟（偵測死鎖）
2. **readinessProbe** → 沒好就不給流量（啟動中、暫時過載）
3. **startupProbe** → 啟動慢的應用先等它（Java/Python ML）
4. **三種方式**：HTTP GET（Web API）、TCP Socket（DB）、exec（自訂）
5. **四個參數**：initialDelay、period、failureThreshold、timeout

**最佳實踐：**
- 生產環境一定要設 liveness + readiness
- 啟動超過 30 秒的應用加 startupProbe
- liveness 的 `initialDelaySeconds` 要大於應用啟動時間
- readiness 通常設得比 liveness 敏感（period 短、threshold 低）

### 逐字稿

好，Probe 做個快速小結。記住三個重點：livenessProbe 掛了就重啟，readinessProbe 沒好就不給流量，startupProbe 給啟動慢的應用一個緩衝期。三種檢查方式：HTTP GET、TCP Socket、exec。四個關鍵參數：initialDelay、period、failureThreshold、timeout。

生產環境一定要同時設 liveness 和 readiness，這是基本要求。啟動超過 30 秒的應用記得加 startupProbe。

好，接下來進入下一個主題：Resource 管理。你的 Pod 如果不限制資源，一個有 bug 的 Pod 可以把整台機器的 CPU 和記憶體都吃光，其他 Pod 全部跟著掛。怎麼防止？

---

## 第 8 頁 | 痛點：資源被吃光（5min）

### PPT 上的內容

**一個 Pod 吃光所有資源**

```
Node 總共 4GB 記憶體

Pod A（你的 API）：需要 500MB
Pod B（你的前端）：需要 200MB
Pod C（有 memory leak 的 bug）：不斷吃記憶體...

時間線：
  0min  → Pod C: 500MB
  5min  → Pod C: 1GB
  10min → Pod C: 2GB
  15min → Pod C: 3.5GB → Node 記憶體不足！
  結果  → Linux OOM Killer 出動，隨機殺掉行程
         → 你的 API 被殺了，不是因為它有 bug
```

**Docker 的做法：**
```bash
docker run --memory=128m --cpus=0.5 nginx
```

**K8s 的做法更精細：requests + limits**

### 逐字稿

好，接下來講 Resource 管理。

先講痛點。假設你的 Node 有 4GB 記憶體，上面跑了三個 Pod。Pod A 是你的 API，需要 500MB。Pod B 是你的前端，需要 200MB。Pod C 是另一個團隊的應用，程式碼有 memory leak。

如果你沒有設任何資源限制，Pod C 會不斷吃記憶體。五分鐘 1GB、十分鐘 2GB、十五分鐘 3.5GB。然後整台 Node 的記憶體不夠了。這時候 Linux 的 OOM Killer 會出動，它會「隨機」殺掉行程來釋放記憶體。你的 API Pod 可能就被殺了，不是因為你的 API 有 bug，而是因為隔壁的 Pod 把資源吃光了。

這就像合租公寓裡有個室友用水不關水龍頭，整棟大樓停水，你也沒水用。

Docker 的做法是 `docker run --memory=128m --cpus=0.5`，很直覺，設一個上限。K8s 也可以設上限，但它多了一個概念叫「requests」— 不只有上限，還有下限。我們來看這兩個東西是什麼。

---

## 第 9 頁 | requests vs limits（10min）

### PPT 上的內容

**requests 和 limits**

| | requests | limits |
|---|---------|--------|
| 中文 | 資源請求（保底） | 資源上限（天花板） |
| 用途 | Scheduler 排程依據 | 實際的硬限制 |
| 超過會怎樣 | 不會超過（這是保證給你的） | CPU 被節流、記憶體被 OOMKilled |

**比喻：飯店自助餐**
```
requests = 你預約了 2 個座位（飯店保證留給你）
limits   = 你最多只能坐 4 個座位（就算餐廳很空也不行）
```

**CPU 單位：**
```
1 CPU = 1000m（毫核 millicores）
"100m" = 0.1 CPU
"500m" = 0.5 CPU
```

**記憶體單位：**
```
"64Mi"  = 64 MiB
"128Mi" = 128 MiB
"1Gi"   = 1 GiB
```

**YAML 寫法：**
```yaml
resources:
  requests:
    cpu: "100m"        # 保底 0.1 核
    memory: "64Mi"     # 保底 64Mi
  limits:
    cpu: "200m"        # 最多 0.2 核
    memory: "128Mi"    # 超過就 OOMKilled
```

### 逐字稿

K8s 的資源管理有兩個概念：requests 和 limits。

requests 是「請求」，可以理解成保底。你告訴 K8s：「我的 Pod 至少需要這麼多資源」。Scheduler 在決定把 Pod 放到哪個 Node 的時候，會看 requests。如果一個 Node 的剩餘資源不夠你的 requests，Scheduler 就不會把 Pod 排到那個 Node。所以 requests 是保證給你的最低資源。

limits 是「限制」，就是天花板。你告訴 K8s：「我的 Pod 最多只能用這麼多」。超過 limits 會怎樣？CPU 和記憶體的處理方式不同。CPU 超過 limits，K8s 會節流，就是把你的 CPU 時間片切小，你的程式會變慢但不會被殺。記憶體超過 limits，K8s 會直接殺掉容器，這就是 OOMKilled。

用自助餐來比喻：requests 就像你預約了 2 個座位，飯店保證留給你。limits 就像你最多只能坐 4 個座位，就算餐廳很空你也不能佔更多。

CPU 的單位是 millicores，1 CPU 等於 1000m。所以 `"100m"` 就是 0.1 核，`"500m"` 就是半核。記憶體用 Mi 或 Gi，跟你平常認知的 MB、GB 差不多，只是用的是 1024 進位。

對照 Docker，`docker run --memory=128m` 對應的是 K8s 的 `limits.memory`。Docker 沒有 requests 的概念，因為 Docker 通常只跑在一台機器上，不需要排程。

---

## 第 10 頁 | QoS 等級 + OOMKilled Demo（10min）

### PPT 上的內容

**三種 QoS（Quality of Service）等級**

| QoS | 條件 | 被殺優先順序 |
|-----|------|:---:|
| **Guaranteed** | requests = limits（每個容器都設，且相等） | 最後被殺 |
| **Burstable** | 有設 requests 但 requests ≠ limits | 中間 |
| **BestEffort** | 完全沒設 requests 和 limits | 最先被殺 |

**→ 生產環境至少要設 requests，讓你的 Pod 不是 BestEffort**

**Lab 2：OOMKilled 實驗**
```bash
# 記憶體限制 128Mi，但程式要用 256Mi
kubectl apply -f deployment-resources.yaml
kubectl get pods -l app=oom-demo -w
# 看到 OOMKilled → CrashLoopBackOff
```

### 逐字稿

K8s 會根據你怎麼設 requests 和 limits，給 Pod 一個 QoS 等級。這個等級決定了當 Node 資源不夠的時候，誰先被犧牲。

三種等級。Guaranteed 是最高級的，條件是每個容器都設了 requests 和 limits，而且兩個值相等。這表示你明確知道自己要用多少資源，K8s 保證給你。資源緊張的時候，Guaranteed 的 Pod 最後才會被殺。

Burstable 是中間的，條件是有設 requests 但跟 limits 不同。意思是你需要至少這麼多，但可以用更多。

BestEffort 是最低級的，完全沒設 requests 和 limits。K8s 不知道你要用多少資源，資源緊張的時候你第一個被殺。

生產環境至少要設 requests，讓你的 Pod 是 Burstable 而不是 BestEffort。最好的做法是 requests 和 limits 都設，設成一樣就是 Guaranteed。

好，我們來做一個 OOMKilled 的實驗。deployment-resources.yaml 裡面有一個 `oom-demo` 的 Deployment，它跑的是 stress 工具，會嘗試吃 256Mi 記憶體，但我們的 limits 只給 128Mi。

```
kubectl apply -f deployment-resources.yaml
kubectl get pods -l app=oom-demo -w
```

大家看，Pod 啟動之後立刻因為記憶體超標被殺掉了，STATUS 顯示 OOMKilled。然後 K8s 嘗試重啟，又被殺，又重啟。重啟幾次之後，STATUS 變成 CrashLoopBackOff，K8s 開始用退避策略，每次等更久才重啟。

這就是 OOMKilled。在生產環境看到 OOMKilled，代表你的 limits 設太小，或者你的程式有 memory leak。先用 `kubectl describe pod` 確認是 OOMKilled，再決定是加大 limits 還是修 bug。

---

## 第 11 頁 | HPA 自動擴縮（15min）

### PPT 上的內容

**HPA = Horizontal Pod Autoscaler**

**痛點：流量暴增**
```
平常：2 個 Pod 就夠用
大促銷：流量翻 10 倍，2 個 Pod 撐不住
凌晨：沒人用，2 個 Pod 浪費資源
```

**HPA 做的事：**
```
CPU 超過 50% → 自動加 Pod → 流量分攤 → CPU 降回來
CPU 很低     → 自動減 Pod → 省資源
```

**對照 Docker：**
```bash
# Docker — 手動 scale
docker compose up --scale web=10

# K8s HPA — 自動 scale
# CPU > 50% 就加 Pod，最少 2 個、最多 8 個
```

**HPA YAML：**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-resources-demo     # 要擴縮的 Deployment
  minReplicas: 2                 # 最少 2 個
  maxReplicas: 8                 # 最多 8 個
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50 # CPU 超過 50% 就擴
```

**前提：Deployment 必須設 resources.requests（HPA 要算百分比）**

### 逐字稿

講完 Resource 的靜態限制，接下來講動態的 — HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。

痛點很直覺。你的電商網站平常 2 個 Pod 就夠了，但大促銷的時候流量翻 10 倍，2 個 Pod 扛不住。你如果手動 `kubectl scale` 當然可以，但你不可能 24 小時盯著。凌晨沒人用的時候，10 個 Pod 閒在那裡浪費資源。

HPA 做的事情很簡單：它監控 Pod 的 CPU 使用率（或其他指標），超過你設的閾值就自動增加 Pod 數量，低於閾值就減少。完全自動。

Docker 的做法是手動 scale。K8s 的 HPA 是自動 scale，你只要設好規則，它幫你決定什麼時候該加、什麼時候該減。

看 YAML。`scaleTargetRef` 指定要擴縮哪個 Deployment。`minReplicas` 和 `maxReplicas` 設定最少和最多的 Pod 數。`metrics` 設定擴縮的依據，這裡是 CPU 使用率超過 50% 就擴容。

有一個很重要的前提：你的 Deployment 必須設 `resources.requests`。為什麼？因為 HPA 算的是百分比。CPU 使用率 50% 是相對於 requests 的 50%，如果你沒設 requests，HPA 不知道 100% 是多少，就無法計算百分比。

另外，HPA 需要 metrics-server 才能取得 CPU 使用量。minikube 需要另外啟用：

```
minikube addons enable metrics-server
```

啟用之後等一兩分鐘讓 metrics-server 的 Pod 跑起來，就可以用 `kubectl top pods` 和 `kubectl top nodes` 查看資源使用量了。如果你用的是 k3s，它內建了 metrics-server，不需要額外安裝。

我們來實際操作一下。

---

## 第 12 頁 | 實作：HPA 壓測（15min）

### PPT 上的內容

**Lab 3：HPA 壓測**

**Step 0：確認 metrics-server 已啟用**
```bash
minikube addons enable metrics-server
kubectl get pods -n kube-system -l k8s-app=metrics-server
# 等到 Running 才能繼續
```

**Step 1：確認 Deployment 有 resource limits**
```bash
kubectl apply -f deployment-resources.yaml
kubectl delete deployment oom-demo     # 只留 api-resources-demo
```

**Step 1.5：建立 Service（壓測需要透過 Service 存取）**
```bash
kubectl expose deployment api-resources-demo --port=80 --target-port=80 --name=api-resources-demo
```

**Step 2：部署 HPA**
```bash
kubectl apply -f hpa.yaml
kubectl get hpa
```

**Step 3：壓測**
```bash
# 另開一個終端機
kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://api-resources-demo > /dev/null 2>&1; done"
```

**Step 4：觀察（原本的終端機）**
```bash
kubectl get hpa -w
# TARGETS 欄位：0% → 23% → 67% → ...
# REPLICAS 欄位：2 → 3 → 4 → ...
```

**Step 5：停止壓測（Ctrl+C），觀察縮回來**

### 逐字稿

好，我們來看 HPA 的實際效果。先確認 metrics-server 有在跑。如果你還沒啟用，執行 `minikube addons enable metrics-server`，然後等一兩分鐘讓它的 Pod 跑起來。

確認 metrics-server 之後，確保 api-resources-demo 這個 Deployment 在跑，它有設 resource requests。把 oom-demo 刪掉，我們不需要它了。

接下來建一個 Service，因為等一下壓測要透過 Service 的 DNS 名稱去打流量：

```
kubectl expose deployment api-resources-demo --port=80 --target-port=80 --name=api-resources-demo
```

部署 HPA：

```
kubectl apply -f hpa.yaml
kubectl get hpa
```

你會看到 TARGETS 欄位可能顯示 `<unknown>/50%`，這表示 metrics-server 還在收集資料，等一下就會有數字了。如果一直是 unknown，表示 metrics-server 沒裝或沒正常運作。

現在我們來壓測。開另一個終端機，跑一個壓測 Pod：

```
kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://api-resources-demo > /dev/null 2>&1; done"
```

這個 Pod 會不斷用 wget 打你的 API，模擬流量暴增。

回到原本的終端機，觀察 HPA：

```
kubectl get hpa -w
```

大家看 TARGETS 欄位，CPU 使用率會慢慢上升。當它超過 50% 的時候，REPLICAS 欄位就會開始增加。2 變 3、3 變 4。這就是 HPA 在自動擴容。

壓測跑個一兩分鐘之後，回到壓測的終端機按 Ctrl+C 停止。然後繼續觀察 HPA。CPU 使用率會慢慢降下來，大概等 5 分鐘左右，REPLICAS 會自動縮回 2。這就是自動縮容。

HPA 的縮容有一個冷卻期，預設是 5 分鐘，避免流量剛降就縮、流量一來又擴、反覆抖動。

---

## 第 13 頁 | Resource + HPA 小結（2min）

### PPT 上的內容

**Resource + HPA 三分鐘總結**

1. **requests** = 保底資源，Scheduler 用來排程
2. **limits** = 天花板，CPU 超過被節流、記憶體超過被 OOMKilled
3. **QoS** = Guaranteed > Burstable > BestEffort（沒設 = 最先被殺）
4. **HPA** = 根據 CPU（或自訂指標）自動加減 Pod
5. **HPA 前提** = Deployment 必須設 requests + 叢集要有 metrics-server

**最佳實踐：**
- 生產環境必設 requests + limits
- requests 設實際用量的 70-80%
- limits 設實際用量的 150-200%
- HPA 的 maxReplicas 要考慮 Node 的承載力

### 逐字稿

好，Resource 和 HPA 做個快速小結。requests 是保底，limits 是天花板。CPU 超過 limits 被節流，記憶體超過被 OOMKilled。QoS 三個等級：Guaranteed 最不容易被殺，BestEffort 最先被殺，生產環境至少要設 requests。HPA 根據 CPU 使用率自動擴縮 Pod，前提是要設 requests 和裝 metrics-server。

好，接下來講 RBAC — 權限控制。想像一下，現在你的同事都有 kubectl 的 admin 權限，任何人都可以 `kubectl delete namespace prod`。是不是想到就覺得可怕？

---

## 第 14 頁 | 痛點：誰都能刪（5min）

### PPT 上的內容

**一條指令毀掉整個生產環境**

```bash
# 實習生不小心打了這個：
kubectl delete namespace prod
# 整個生產環境的所有資源全部消失 💥
```

**目前的狀態：**
- 所有人都用同一個 kubeconfig
- 所有人都是 cluster-admin
- 開發人員能存取生產環境
- 沒有操作日誌

**Docker 有這個問題嗎？**
→ Docker 沒有內建的權限控制
→ 能連到 Docker Socket 就等於 root
→ K8s 至少有 RBAC 可以細分權限

**K8s RBAC 的邏輯：**
```
誰（Subject）+ 能做什麼（Role）= RoleBinding
```

### 逐字稿

好，接下來我們要講一個在企業環境裡非常非常重要的主題 — RBAC，Role-Based Access Control，基於角色的存取控制。

先講一個恐怖故事。假設你的公司有一個 K8s 叢集，跑著生產環境。你的同事 — 或者更恐怖的，一個實習生 — 拿到了 kubectl 的 admin 權限。某一天他在跑一個清理腳本，不小心打了 `kubectl delete namespace prod`。猜猜發生什麼事？

[停頓 2 秒]

prod Namespace 底下的所有東西：Deployment、Pod、Service、Secret、PVC，全部消失了。生產環境直接掛。

這不是我編的，這種事在業界真的發生過。而且目前我們的實驗環境就是這個狀態：所有人用同一個 kubeconfig，所有人都是 cluster-admin，開發人員可以直接操作生產環境。

Docker 有沒有這個問題？Docker 更糟。Docker 完全沒有內建的權限控制，只要你能連到 Docker Socket，你就等於 root。K8s 至少提供了 RBAC 機制讓你細分權限。

RBAC 的邏輯非常簡單，三個字：誰、能做什麼、綁定起來。「誰」叫 Subject，可以是 User、Group 或 ServiceAccount。「能做什麼」叫 Role，定義了允許的操作。「綁定起來」叫 RoleBinding。就這三個概念。

---

## 第 15 頁 | RBAC 四個物件（15min）

### PPT 上的內容

**RBAC 四個物件**

| 物件 | 作用範圍 | 職責 |
|------|---------|------|
| **Role** | 單一 Namespace | 定義「能對什麼資源做什麼動作」 |
| **ClusterRole** | 整個叢集 | 同上，但跨 Namespace |
| **RoleBinding** | 單一 Namespace | 把 Role 綁到某人身上 |
| **ClusterRoleBinding** | 整個叢集 | 把 ClusterRole 綁到某人身上 |

**比喻：公司門禁卡**

```
Role           = 門禁卡（3F 研發部可進出）
ClusterRole    = 萬能卡（所有樓層可進出）
RoleBinding    = 把門禁卡發給某人
ClusterRoleBinding = 把萬能卡發給某人
```

**ServiceAccount = Pod 的身份**

```
人用 User/Group 認證
Pod 用 ServiceAccount 認證
每個 Namespace 預設都有一個 default ServiceAccount
```

**Role YAML：**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
  - apiGroups: [""]              # core API（Pod、Service）
    resources: ["pods", "services"]
    verbs: ["get", "list", "watch"]  # 只能看
```

### 逐字稿

RBAC 有四個物件。Role 和 ClusterRole 定義「能做什麼」，差別是作用範圍：Role 只在一個 Namespace 裡有效，ClusterRole 在整個叢集有效。RoleBinding 和 ClusterRoleBinding 負責「把權限給誰」，差別也是作用範圍。

用公司門禁卡來比喻。Role 就像一張門禁卡，上面寫著「可以進出 3 樓研發部」。ClusterRole 就像萬能卡，所有樓層都能進出。RoleBinding 就是把門禁卡發給某個人。ClusterRoleBinding 就是把萬能卡發給某個人。

這裡還有一個概念叫 ServiceAccount。人類使用 K8s 是透過 User 或 Group 認證的，但 Pod 呢？Pod 也需要跟 K8s API Server 溝通，比如有些應用需要列出所有 Pod。Pod 的身份就是 ServiceAccount。每個 Namespace 預設都有一個 `default` ServiceAccount，如果你不指定，Pod 就會用 default。

來看 Role 的 YAML。`rules` 裡面定義了允許的操作。`apiGroups` 指定 API 組，空字串 `""` 代表 core API，就是 Pod、Service 這些最基礎的資源。`resources` 指定能操作哪些資源類型。`verbs` 指定能做什麼動作：get 是查看單個、list 是列出所有、watch 是即時監控。注意沒有 create、update、delete，所以這是一個只讀的 Role。

---

## 第 16 頁 | 實作：只讀使用者（15min）

### PPT 上的內容

**Lab 4：RBAC 只讀使用者**

**Step 1：建立 SA + Role + RoleBinding**
```bash
kubectl apply -f rbac-viewer.yaml
```

**Step 2：用 viewer-sa 的身份查看 Pod（成功）**
```bash
kubectl get pods --as=system:serviceaccount:default:viewer-sa
```

**Step 3：嘗試建立 Pod（被拒絕）**
```bash
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa
# Error from server (Forbidden): pods is forbidden
```

**Step 4：嘗試刪除（被拒絕）**
```bash
kubectl delete deployment nginx-deploy --as=system:serviceaccount:default:viewer-sa
# Error from server (Forbidden)
```

**→ 這就是最小權限原則：只給需要的權限，不多給**

### 逐字稿

好，我們來實作。打開 `rbac-viewer.yaml`，裡面有三個資源：一個 ServiceAccount 叫 `viewer-sa`，一個 Role 叫 `pod-viewer`，一個 RoleBinding 把兩個綁起來。

先部署：

```
kubectl apply -f rbac-viewer.yaml
```

現在來測試。我們用 `--as` 這個旗標模擬用 viewer-sa 的身份操作。先試查看 Pod：

```
kubectl get pods --as=system:serviceaccount:default:viewer-sa
```

成功了！可以看到 Pod 列表。因為我們的 Role 有 `get` 和 `list` 的權限。

現在試建立一個 Pod：

```
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa
```

大家猜猜看結果是什麼？

[停頓 2 秒]

`Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:default:viewer-sa" cannot create resource "pods" in API group "" in the namespace "default"`

被拒絕了！因為我們的 Role 沒有 `create` 這個 verb。再試刪除：

```
kubectl delete deployment nginx-deploy --as=system:serviceaccount:default:viewer-sa
```

一樣被拒絕。沒有 `delete` 權限。

這就是 RBAC 的威力。你可以給開發人員一個只讀的權限，讓他能查看 Pod 的狀態和日誌去排錯，但不能修改或刪除任何東西。這叫做「最小權限原則」— 只給他需要的權限，不多給。

在企業環境裡，通常會這樣設計：開發人員在 dev 和 staging Namespace 有完整權限，但在 prod Namespace 只有讀取權限。部署由 CI/CD Pipeline（比如 ArgoCD）來做，不是由人手動操作。

---

## 第 17 頁 | RBAC 小結（3min）

### PPT 上的內容

**RBAC 三分鐘總結**

1. **Role** — 定義權限（能對什麼資源做什麼動作）
2. **RoleBinding** — 把 Role 綁到人或 ServiceAccount
3. **ClusterRole / ClusterRoleBinding** — 跨 Namespace 的版本
4. **ServiceAccount** — Pod 的身份
5. **--as** — 模擬其他身份操作（測試權限用）

**常見的 RBAC 設計：**

| 角色 | dev Namespace | staging | prod |
|------|:---:|:---:|:---:|
| 開發人員 | 完整權限 | 完整權限 | 只讀 |
| SRE / DevOps | 完整權限 | 完整權限 | 完整權限 |
| 實習生 | 只讀 | 不給 | 不給 |
| CI/CD Pipeline | 不需要 | 部署權限 | 部署權限 |

### 逐字稿

RBAC 小結。四個物件：Role 定義權限、RoleBinding 綁定權限、加上跨 Namespace 的 ClusterRole 和 ClusterRoleBinding。ServiceAccount 是 Pod 的身份。`--as` 旗標可以模擬其他身份來測試權限。

實務上的 RBAC 設計通常是按角色和環境的交叉矩陣來規劃的。開發人員在 dev 有完整權限，prod 只有只讀。SRE 和 DevOps 所有環境都有完整權限。實習生最多只能在 dev 看看。CI/CD Pipeline 負責在 staging 和 prod 做部署。

CKA 考試裡 RBAC 是必考題，所以如果你之後有打算考認證，今天學的東西一定要多練習。

好，接下來進入下一個主題 — NetworkPolicy，Pod 之間的防火牆。

---

## 第 18 頁 | 痛點：全通不安全（5min）

### PPT 上的內容

**K8s 預設：所有 Pod 之間全部互通**

```
┌──────────────────────────────────┐
│          Kubernetes 叢集          │
│                                  │
│  [前端]  ←──→  [API]  ←──→  [DB] │
│     ↕             ↕            ↕  │
│  [前端]  ←──→  [API]  ←──→  [DB] │
│                                  │
│  所有 Pod 都能跟所有 Pod 講話！    │
└──────────────────────────────────┘
```

**問題：**
- 前端 Pod 不應該能直接連 DB
- 其他 Namespace 的 Pod 不應該能連你的服務
- 如果一個 Pod 被入侵，攻擊者可以横向移動到任何地方

**Docker 的做法：**
```bash
# Docker network 隔離
docker network create frontend-net
docker network create backend-net
# 不同 network 的容器不能互連
```

**K8s 的做法：NetworkPolicy（Pod 等級的防火牆）**

### 逐字稿

好，我們繼續。先講這個主題的痛點。K8s 預設的網路政策是什麼？全通。所有 Pod 之間都可以互相通訊，不管在同一個 Namespace 還是不同 Namespace。

這在開發環境沒什麼問題，但在生產環境就是一個安全隱患。想想看，你的前端 Pod 應該只需要連 API，不應該能直接連資料庫。如果前端 Pod 被入侵了，攻擊者不應該能直接存取資料庫。但預設情況下，他可以。

這跟你家的網路一樣。如果所有設備都在同一個 WiFi 下面，任何設備都能看到其他設備。企業環境會把訪客 WiFi 和內部網路隔開，K8s 也需要類似的隔離。

用 Docker 的經驗來想，Docker 有 network 隔離。你建一個 `frontend-net`、一個 `backend-net`，不同 network 的容器不能互連。K8s 的做法更精細 — NetworkPolicy，Pod 等級的防火牆。你可以指定「只有帶某個 label 的 Pod 才能連我」，比 Docker 的 network 隔離更靈活。

---

## 第 19 頁 | NetworkPolicy 概念（10min）

### PPT 上的內容

**NetworkPolicy 的邏輯**

```yaml
spec:
  podSelector:     # 這條規則套用在誰身上
  policyTypes:     # 管進來（Ingress）還是出去（Egress）
  ingress:         # 允許誰連進來
  egress:          # 允許連出去到哪裡
```

**注意：這裡的 Ingress/Egress 不是 Ingress Controller！**
- NetworkPolicy 的 ingress = 進入 Pod 的流量
- NetworkPolicy 的 egress = 離開 Pod 的流量
- 跟 Ingress Controller（第六堂學的）是完全不同的概念

**範例：DB 只允許 API Pod 連**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
spec:
  podSelector:
    matchLabels:
      role: database          # 套用在 DB Pod 上
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api       # 只允許 role=api 的 Pod 進來
      ports:
        - protocol: TCP
          port: 3306          # 只允許 3306 port
```

### 逐字稿

NetworkPolicy 的結構很直覺。`podSelector` 指定這條規則套用在哪些 Pod 上。`policyTypes` 指定管的是 ingress（進來的流量）還是 egress（出去的流量），或兩者都管。然後用 `ingress` 和 `egress` 區塊定義具體的規則。

這裡要特別提醒一個容易混淆的點。NetworkPolicy 裡的「ingress」跟第六堂學的「Ingress Controller」完全是兩回事。NetworkPolicy 的 ingress 是指「進入 Pod 的流量」，是網路層的概念。Ingress Controller 是 HTTP 路由的概念。名字一樣但意思不同，不要搞混。

來看一個具體的例子。我要讓資料庫只接受 API Pod 的連線。`podSelector` 選 `role: database`，這條規則只套用在有這個 label 的 Pod 上。`policyTypes` 設 `Ingress`，只管進來的流量。`ingress.from` 裡面的 `podSelector` 設 `role: api`，表示只有帶 `role=api` label 的 Pod 才能連進來。`ports` 設 TCP 3306，只允許連 MySQL 的 port。

重要觀念：一旦你在某個 Pod 上設了 NetworkPolicy，所有不在規則裡的流量都會被拒絕。預設全拒、只開你明確允許的。這跟傳統的防火牆邏輯一樣。

---

## 第 20 頁 | 實作：NetworkPolicy（15min）

### PPT 上的內容

**Lab 5：DB 只允許 API 連**

**Step 1：部署 DB + API + NetworkPolicy**
```bash
kubectl apply -f networkpolicy-db.yaml
kubectl get pods -l "role in (database,api)"
```

**Step 2：從 API Pod 連 DB（應該成功）**
```bash
API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')
kubectl exec $API_POD -- curl -s --max-time 3 http://fake-db-svc:3306
# 有回應 = 連線成功 ✅
```

**Step 3：從其他 Pod 連 DB（應該被擋）**
```bash
kubectl run test-block --image=curlimages/curl --rm -it --restart=Never -- \
  curl -s --max-time 3 http://fake-db-svc:3306
# timeout = 被擋了 ✅
```

**⚠️ 注意：NetworkPolicy 需要對應的 controller / CNI**
- k3s 預設安裝 ✅（內建 network policy controller）
- Calico ✅ Cilium ✅ Weave ✅
- minikube 做 Lab 常用 Calico：`minikube start --cni=calico`（需要重建叢集）

### 逐字稿

好，我們來實作。`networkpolicy-db.yaml` 裡面有四個資源：一個假的 DB Deployment（用 nginx 模擬）、一個 DB Service、一個假的 API Deployment、還有一條 NetworkPolicy。

先部署：

```
kubectl apply -f networkpolicy-db.yaml
```

等 Pod 跑起來之後，先從 API Pod 連 DB：

```
API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')
kubectl exec $API_POD -- curl -s --max-time 3 http://fake-db-svc:3306
```

你應該會看到回應 — 可能是一堆亂碼，因為我們是用 HTTP 打 MySQL port，但重點是有回應，表示連線成功。

現在從一個沒有 `role=api` label 的 Pod 來連 DB：

```
kubectl run test-block --image=curlimages/curl --rm -it --restart=Never -- \
  curl -s --max-time 3 http://fake-db-svc:3306
```

如果 NetworkPolicy 有生效，這個請求會在 3 秒後 timeout，因為流量被擋掉了。

這裡有一個重要的注意事項：NetworkPolicy 需要底層網路外掛或對應 controller 支援。Calico、Cilium、Weave 都支援；k3s 的預設安裝本身也有 network policy controller。如果你的測試結果是兩個都能連，不要直接下結論說「Flannel 不支援」，先確認目前叢集的 controller / CNI，再檢查 selector、policyTypes 和 ports。

如果你想在 minikube 上做最可預期的 Lab，可以用 Calico 啟動：`minikube start --cni=calico`。注意這需要重建叢集，所以建議在做完其他 Lab 之後再試。在生產環境你也常會看到 Calico 或 Cilium。

這個 Lab 的目的是讓你理解 NetworkPolicy 的概念和 YAML 怎麼寫。在總複習實戰裡我們也會用到 NetworkPolicy。

---

## 第 21 頁 | NetworkPolicy 小結（2min）

### PPT 上的內容

**NetworkPolicy 總結**

1. K8s 預設全通，NetworkPolicy 加上後變成預設拒絕
2. `podSelector` — 規則套用在誰身上
3. `ingress` — 允許誰連進來
4. `egress` — 允許連出去到哪裡
5. 需要支援的 CNI（Calico / Cilium）

**常見的 NetworkPolicy 設計：**
```
前端 → 只接受 Ingress Controller 的流量
API  → 只接受前端和 Ingress Controller 的流量
DB   → 只接受 API 的流量
```

### 逐字稿

NetworkPolicy 小結。K8s 預設所有 Pod 互通，加上 NetworkPolicy 之後變成預設拒絕、只允許明確指定的流量。常見的設計就是按照三層架構：前端只接受 Ingress Controller、API 只接受前端、DB 只接受 API。

好，接下來我們來看兩個特殊的工作負載類型。

---

## 第 22 頁 | DaemonSet（10min）

### PPT 上的內容

**DaemonSet = 每個 Node 跑一份**

```
Deployment（replicas: 3）：
  Node A: [Pod] [Pod]
  Node B: [Pod]
  Node C: （沒有）

DaemonSet：
  Node A: [Pod]    ← 保證每個 Node 恰好一個
  Node B: [Pod]
  Node C: [Pod]
```

**用途：**
- 日誌收集（Fluentd / Filebeat）
- 監控 agent（Prometheus Node Exporter）
- 網路插件（kube-proxy 本身就是 DaemonSet）

**Docker 對照：**
沒有直接對應。Docker Compose 沒辦法指定「每台機器一個」。

**YAML 跟 Deployment 幾乎一樣，但沒有 `replicas`：**

```yaml
apiVersion: apps/v1
kind: DaemonSet            # 不是 Deployment
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:                # Pod 範本跟 Deployment 一模一樣
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: logger
          image: busybox:1.36
```

### 逐字稿

好，接下來講兩個特殊的工作負載類型。第一個是 DaemonSet。

Deployment 你設 `replicas: 3`，K8s 會在叢集裡跑 3 個 Pod，至於分布在哪些 Node 上，由 Scheduler 決定。可能 Node A 跑 2 個、Node B 跑 1 個、Node C 一個都沒有。

DaemonSet 不一樣。它保證每個 Node 上恰好跑一個 Pod。加一個新 Node，自動在上面建一個 Pod。移除一個 Node，對應的 Pod 也自動消失。

什麼場景需要這個？最經典的就是日誌收集。你想收集每個 Node 上所有容器的日誌，就需要每個 Node 上都有一個日誌收集器。還有監控 agent，比如 Prometheus 的 Node Exporter，需要在每個 Node 上收集硬體指標。其實 K8s 自己的 kube-proxy 就是用 DaemonSet 跑的。

DaemonSet 的 YAML 跟 Deployment 幾乎一樣，差別在 `kind: DaemonSet`，而且沒有 `replicas` 欄位 — 因為副本數就是 Node 數，不需要你指定。

Docker 沒有直接對應的概念。Docker Compose 做不到「每台機器一個」這種事。

---

## 第 23 頁 | Job + CronJob（15min）

### PPT 上的內容

**Job = 跑完就結束的一次性任務**

```
Deployment：跑了就不停（Web Server）
Job：跑完就結束（資料遷移、批次處理）
```

**CronJob = 排程任務（定時 Job）**

```
CronJob 每分鐘建一個 Job → Job 建一個 Pod → Pod 跑完就結束
```

**Cron 語法：**
```
┌───────── 分鐘 (0-59)
│ ┌───────── 小時 (0-23)
│ │ ┌───────── 日 (1-31)
│ │ │ ┌───────── 月 (1-12)
│ │ │ │ ┌───────── 星期 (0-6，0=週日)
│ │ │ │ │
* * * * *

"*/1 * * * *"  = 每分鐘
"0 */2 * * *"  = 每 2 小時
"0 3 * * *"    = 每天凌晨 3 點
"0 0 * * 0"    = 每週日午夜
```

**Docker 對照：**
```bash
# Docker — 用 cron 或 host 的排程
docker run --rm my-backup-script

# K8s CronJob — 叢集內建排程
kubectl apply -f cronjob.yaml
```

### 逐字稿

第二個特殊工作負載是 Job 和 CronJob。

到目前為止我們用的都是 Deployment，它的特性是「跑了就不停」，適合 Web Server、API 這種需要持續服務的應用。但有些任務是跑完就結束的，比如資料庫遷移、批次處理、備份。這些任務用 Deployment 不太對，因為你不需要它一直跑。

Job 就是為這種場景設計的。它建立一個 Pod，Pod 跑完主行程就停了，Job 的狀態變成 Completed。如果 Pod 失敗了，Job 會根據 `backoffLimit` 重試。

CronJob 就是定時版的 Job。你給一個 cron 表達式，CronJob 就會按照排程定時建立 Job。

cron 語法有五個欄位：分、時、日、月、星期。`*/1 * * * *` 就是每分鐘。`0 3 * * *` 就是每天凌晨 3 點。如果你用過 Linux 的 crontab，語法完全一樣。

Docker 的做法是用 host 機器的 cron 去定時跑 `docker run`，但這依賴 host 機器。K8s 的 CronJob 是叢集層級的排程，不依賴任何特定的 Node。

---

## 第 24 頁 | 實作：DaemonSet + CronJob（10min）

### PPT 上的內容

**Lab 6 + Lab 7**

**DaemonSet：**
```bash
kubectl apply -f daemonset.yaml
kubectl get daemonset
kubectl get pods -l app=log-collector -o wide
# 每個 Node 一個 Pod
kubectl logs -l app=log-collector --tail=3
```

**Job + CronJob：**
```bash
kubectl apply -f cronjob.yaml
kubectl get jobs                   # 一次性 Job
kubectl logs job/one-time-job      # 看日誌
kubectl get cronjobs               # CronJob
# 等 1-2 分鐘
kubectl get jobs                   # CronJob 會建出新的 Job
kubectl get pods --sort-by=.metadata.creationTimestamp
```

### 逐字稿

快速實作。先部署 DaemonSet：

```
kubectl apply -f daemonset.yaml
kubectl get daemonset
```

你會看到 DESIRED 和 CURRENT 等於你的 Node 數量。用 `-o wide` 看 Pod 分佈：

```
kubectl get pods -l app=log-collector -o wide
```

每個 Node 都有一個。看日誌的話，每個 Pod 都在每 30 秒印一行日誌。

接下來是 Job 和 CronJob：

```
kubectl apply -f cronjob.yaml
kubectl get jobs
```

你會看到 `one-time-job` 這個 Job，COMPLETIONS 會從 0/1 變成 1/1。看它的日誌：

```
kubectl logs job/one-time-job
```

CronJob 的話：

```
kubectl get cronjobs
```

SCHEDULE 欄位顯示 `*/1 * * * *`。等一兩分鐘之後再看 jobs，你會看到 CronJob 每分鐘建了一個新的 Job。`successfulJobsHistoryLimit: 3` 表示只保留最近 3 個成功的 Job，舊的會自動清理。

好，DaemonSet 和 Job/CronJob 就到這裡。這兩個概念不複雜，但在生產環境很常用。

---

## 第 25 頁 | 日誌與除錯（15min）

### PPT 上的內容

**排錯流程（固定 SOP）**

```
Step 1：kubectl get pods             → 看 STATUS 有沒有異常
Step 2：kubectl describe pod <name>  → 看 Events 區塊
Step 3：kubectl logs <name>          → 看應用日誌
Step 4：kubectl exec -it <name> -- sh → 進容器內部檢查
```

**常見問題對照表：**

| STATUS | 原因 | 解法 |
|--------|------|------|
| `ImagePullBackOff` | Image 名字打錯、私有倉庫沒設認證 | 改 image、加 imagePullSecrets |
| `CrashLoopBackOff` | 應用啟動就 crash | `kubectl logs` 看日誌、`describe` 看 exit code |
| `Pending` | 沒有 Node 有足夠資源 | `describe` 看原因、加 Node 或調 requests |
| `OOMKilled` | 記憶體超過 limits | 加大 limits 或修 memory leak |
| `CreateContainerConfigError` | ConfigMap/Secret 不存在 | 建立缺少的 ConfigMap/Secret |
| `0/1 Ready` | readinessProbe 失敗 | 檢查 Probe 設定、應用是否正常 |

**進階工具：**
- `kubectl get events --sort-by=.lastTimestamp` — 叢集事件
- `kubectl top pods / nodes` — 資源用量（需要 metrics-server）
- K9s — 終端機版 K8s 管理器（推薦！）
- Lens — 圖形化 K8s 管理器

### 逐字稿

好，接下來講日誌和除錯。這其實把前幾堂零散學的排錯技巧做一個系統化的整理。

排錯的 SOP 固定四步。第一步，`kubectl get pods` 看 STATUS 有沒有異常。第二步，`kubectl describe pod` 看 Events 區塊，K8s 會在這裡記錄發生了什麼事。第三步，`kubectl logs` 看你的應用日誌。第四步，如果前面三步看不出問題，用 `kubectl exec` 進容器內部檢查。

這四步跟 Docker 的排錯流程幾乎一樣：`docker ps` 看狀態、`docker inspect` 看細節、`docker logs` 看日誌、`docker exec` 進容器。你學 Docker 的經驗在這裡完全用得上。

常見問題我列了一個對照表。`ImagePullBackOff` 通常是 image 名字打錯或私有倉庫沒設認證。`CrashLoopBackOff` 是應用啟動就 crash，先看 logs。`Pending` 是沒有 Node 有足夠資源，先 describe 看原因。`OOMKilled` 是記憶體超過 limits。`CreateContainerConfigError` 通常是 ConfigMap 或 Secret 不存在。

進階工具推薦三個。`kubectl get events` 可以看叢集層級的事件。`kubectl top` 可以看 CPU 和記憶體使用量。然後是 K9s，一個終端機版的 K8s 管理器，非常好用，你可以用鍵盤快速查看和管理所有資源。如果你喜歡圖形化介面，可以試 Lens。

---

## 第 26 頁 | etcd 備份概念（5min）

### PPT 上的內容

**etcd = K8s 的資料庫**

```
你的所有 YAML、所有狀態、所有設定 → 全部存在 etcd 裡
etcd 掛了 = 整個叢集的狀態全部消失
```

**備份 etcd（概念，CKA 必考）：**
```bash
# 備份
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# 還原
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db
```

**在我們的 minikube 環境不做實作，知道概念就好**

### 逐字稿

最後一個小主題：etcd 備份。這個我只講概念，不做實作，因為在我們的 minikube 環境裡操作比較複雜。但這個概念在 CKA 考試裡是必考的，所以我提一下。

還記得第四堂講架構的時候，etcd 是什麼？它是 K8s 的資料庫。你所有的 Deployment、Pod、Service、Secret、ConfigMap，全部都存在 etcd 裡。如果 etcd 掛了又沒有備份，你整個叢集的狀態就全部消失了。所有資源都要重新建立。

所以在生產環境，定期備份 etcd 是非常重要的。備份指令就是 `etcdctl snapshot save`，還原就是 `etcdctl snapshot restore`。你要指定 etcd 的憑證才能連上去，這些憑證通常在 `/etc/kubernetes/pki/etcd/` 下面。

在 minikube 的環境裡，etcd 是以靜態 Pod 的形式跑在 kube-system 裡的，你可以用 `kubectl get pods -n kube-system` 看到它。但 minikube 主要是學習用途，我們不在上面做備份還原的實作。如果你之後要考 CKA，建議用 kubeadm 建的叢集來練習 etcd 備份和還原。

好，知識講完了！接下來是今天的重頭戲 — 總複習實戰。我們從一個空的 Namespace 開始，把四堂課學到的東西全部用上。

---

## 第 27 頁 | 總複習實戰：架構說明（5min）

### PPT 上的內容

**總複習：從零部署完整系統**

**目標架構：**
```
使用者 → Ingress（myapp.local）
          ├── /     → frontend-svc → frontend Pod x2
          └── /api  → api-svc     → api Pod x3（HPA 自動擴縮）
                                        ↓
                                   mysql-headless → mysql Pod x1（StatefulSet + PVC）

NetworkPolicy：前端→API→DB，逐層隔離
所有 Pod 都有 Probe + Resource limits
```

**12 步部署：**

| 步驟 | 做什麼 | 對應第幾堂學的 |
|:---:|--------|:---:|
| 1 | 建 Namespace | 第五堂 |
| 2 | 建 Secret（DB 密碼） | 第六堂 |
| 3 | 建 ConfigMap（API 設定） | 第六堂 |
| 4 | 部署 MySQL（StatefulSet + PVC） | 第六堂 |
| 5 | 部署 API（Deployment + Probe + Resource） | 第五堂 + 第七堂 |
| 6 | 部署前端（Deployment） | 第五堂 |
| 7 | 建 Service | 第五堂 |
| 8 | 建 Ingress | 第六堂 |
| 9 | 設 NetworkPolicy | 第七堂 |
| 10 | 設 HPA | 第七堂 |
| 11 | 完整驗證 | 全部 |
| 12 | 壓測 HPA（選做） | 第七堂 |

### 逐字稿

好，總複習實戰的時間到了。

我們要從一個完全空的 Namespace 開始，部署一套完整的生產級應用。架構是這樣的：使用者透過 Ingress 用域名進來，`/` 走前端、`/api` 走 API。API 連 MySQL 資料庫。前端有 2 個副本，API 有 3 個副本加上 HPA 自動擴縮，MySQL 用 StatefulSet 加 PVC 跑 1 個實例。所有 Pod 都有 Probe 和 Resource limits。NetworkPolicy 確保前端只能連 API、API 只能連 DB。

一共 12 步。大家看投影片上的表格，每一步都對應到前幾堂學的知識。這就是為什麼這是「總複習」— 你會用到第五堂到第七堂學的幾乎所有概念。

大家打開 `final-exam` 目錄，裡面有所有的 YAML 檔案。我們一步一步來。

---

## 第 28 頁 | 總複習 Step 1-4（15min）

### PPT 上的內容

**Step 1：建 Namespace**
```bash
kubectl apply -f final-exam/namespace.yaml
kubectl get ns prod
```

**Step 2：建 Secret**
```bash
kubectl apply -f final-exam/secret.yaml
kubectl get secret -n prod
```

**Step 3：建 ConfigMap**
```bash
kubectl apply -f final-exam/configmap.yaml
kubectl get configmap -n prod
```

**Step 4：部署 MySQL**
```bash
kubectl apply -f final-exam/mysql-statefulset.yaml
kubectl get pods -n prod -w
# 等 mysql-0 變成 1/1 Running
kubectl get pvc -n prod
# 應該看到自動建立的 PVC
```

### 逐字稿

好，開始。Step 1 建 Namespace。

```
kubectl apply -f final-exam/namespace.yaml
```

看一下有沒有建好：

```
kubectl get ns prod
```

Status 是 Active，好。

Step 2 建 Secret，存 MySQL 的密碼。

```
kubectl apply -f final-exam/secret.yaml
kubectl get secret -n prod
```

注意所有資源都要加 `-n prod`，因為我們的東西都在 prod Namespace 裡。

Step 3 建 ConfigMap，存 API 的設定和前端的 nginx 設定。

```
kubectl apply -f final-exam/configmap.yaml
kubectl get configmap -n prod
```

你應該看到 `api-config` 和 `frontend-nginx-config` 兩個 ConfigMap。

Step 4 部署 MySQL。這是最重要的一步，因為 StatefulSet 加 PVC 加 Headless Service 加 Secret 注入，把第六堂學的好幾個概念串在一起了。

```
kubectl apply -f final-exam/mysql-statefulset.yaml
kubectl get pods -n prod -w
```

MySQL 啟動比較慢，可能需要 30 到 60 秒。你會看到 `mysql-0` 從 `0/1` 慢慢變成 `1/1 Running`。等到 Ready 了就可以 Ctrl+C。

順便看一下 PVC 有沒有自動建立：

```
kubectl get pvc -n prod
```

你應該看到 `mysql-data-mysql-0` 這個 PVC，狀態是 Bound。這就是 StatefulSet 的 `volumeClaimTemplates` 自動幫你建的。

---

## 第 29 頁 | 總複習 Step 5-8（15min）

### PPT 上的內容

**Step 5：部署 API**
```bash
kubectl apply -f final-exam/api-deployment.yaml
kubectl get pods -n prod -l app=api
# 3 個 Pod 都是 Running
```

**Step 6：部署前端**
```bash
kubectl apply -f final-exam/frontend-deployment.yaml
kubectl get pods -n prod -l app=frontend
# 2 個 Pod 都是 Running
```

**Step 7：建 Service**
```bash
kubectl apply -f final-exam/services.yaml
kubectl get svc -n prod
# api-svc (ClusterIP) + frontend-svc (ClusterIP)
```

**Step 8：建 Ingress**
```bash
kubectl apply -f final-exam/ingress.yaml
kubectl get ingress -n prod
```

### 逐字稿

Step 5 部署 API。這個 Deployment 有 3 個副本，有 liveness、readiness、startup 三種 Probe，有 resource requests 和 limits，還從 ConfigMap 和 Secret 載入環境變數。一個 YAML 裡面用到了五個概念。

```
kubectl apply -f final-exam/api-deployment.yaml
kubectl get pods -n prod -l app=api
```

等三個 Pod 都是 Running。

Step 6 部署前端。

```
kubectl apply -f final-exam/frontend-deployment.yaml
kubectl get pods -n prod -l app=frontend
```

兩個 Pod。前端還透過 ConfigMap 掛載了自訂的 nginx 設定檔，裡面設定了 `/api/` 的反向代理。

Step 7 建 Service。

```
kubectl apply -f final-exam/services.yaml
kubectl get svc -n prod
```

你應該看到 `api-svc` 和 `frontend-svc` 兩個 ClusterIP Service。加上之前 Step 4 建的 `mysql-headless`，一共三個 Service。

Step 8 建 Ingress。

```
kubectl apply -f final-exam/ingress.yaml
kubectl get ingress -n prod
```

Ingress 設定了 `myapp.local` 這個域名，`/` 走前端、`/api` 走 API。

到這一步，你的應用在功能上已經完整了。接下來的 Step 9 和 10 是加上安全和彈性。

---

## 第 30 頁 | 總複習 Step 9-12（15min）

### PPT 上的內容

**Step 9：設 NetworkPolicy**
```bash
kubectl apply -f final-exam/networkpolicy.yaml
kubectl get networkpolicy -n prod
# db-policy, api-policy, frontend-policy
```

**Step 10：設 HPA**
```bash
kubectl apply -f final-exam/hpa.yaml
kubectl get hpa -n prod
```

**Step 11：完整驗證**
```bash
kubectl get all -n prod          # 一覽所有資源
kubectl get pvc -n prod          # PVC
kubectl get ingress -n prod      # Ingress
kubectl get networkpolicy -n prod # NetworkPolicy
kubectl get hpa -n prod          # HPA
```

**Step 12：壓測（選做）**
```bash
kubectl run load-test --image=busybox:1.36 -n prod --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"
# 另一個終端機：kubectl get hpa -n prod -w
```

### 逐字稿

Step 9 設 NetworkPolicy。我們有三條規則：DB 只接受 API 的連線、API 只接受前端和 Ingress Controller 的連線、前端只接受 Ingress Controller 的連線。三層隔離。

```
kubectl apply -f final-exam/networkpolicy.yaml
kubectl get networkpolicy -n prod
```

Step 10 設 HPA。API 的 CPU 超過 70% 就自動擴容，最多 10 個 Pod。

```
kubectl apply -f final-exam/hpa.yaml
kubectl get hpa -n prod
```

Step 11 完整驗證。用 `kubectl get all -n prod` 看一下所有資源：

```
kubectl get all -n prod
```

你應該看到一大堆東西：3 個 Deployment、1 個 StatefulSet、6 個以上的 Pod、3 個 Service、1 個 HPA。再看 PVC、Ingress、NetworkPolicy 也都在。

恭喜！你剛才從一個空的 Namespace 開始，部署了一套完整的生產級應用。用到了 Namespace、Secret、ConfigMap、StatefulSet、PVC、Deployment、Probe、Resource、Service、Ingress、NetworkPolicy、HPA。這就是四堂課學到的所有核心概念。

Step 12 是選做的壓測。如果你有時間的話，可以跑一個壓測 Pod 打 API，然後觀察 HPA 自動擴容。做完了按 Ctrl+C 停止壓測，等幾分鐘看 Pod 自動縮回來。

最後別忘了清理：

```
kubectl delete namespace prod
```

一行就搞定，Namespace 底下的所有東西全部一起刪掉。

---

## 第 31 頁 | 課程回顧：Docker → K8s 完整對照表（5min）

### PPT 上的內容

**四堂課的旅程**

```
第四堂：K8s 架構 + Pod + kubectl           → 能跑一個容器
第五堂：Deployment + Service + DNS         → 能跑多個 + 讓外面連
第六堂：Ingress + ConfigMap + PV + Helm    → 域名 + 設定 + 資料
第七堂：Probe + Resource + RBAC + 總複習   → 生產就緒
```

**Docker → K8s 完整對照表：**

| 你在 Docker 學的 | K8s 的對應 |
|-----------------|-----------|
| `docker run` | Pod |
| `docker compose up` | `kubectl apply -f` |
| `docker ps / logs / exec` | `kubectl get / logs / exec` |
| `-p 8080:80` | Service (NodePort) |
| `--network` + DNS | Service DNS (CoreDNS) |
| Nginx 反向代理 | Ingress |
| `-e ENV_VAR` | ConfigMap |
| `-e PASSWORD=xxx` | Secret |
| `docker volume` | PVC |
| `--restart always` | Deployment replicas |
| `HEALTHCHECK` | Probe (liveness/readiness) |
| `--memory --cpus` | resources requests/limits |
| `--scale web=5` | HPA |
| `docker compose.yml` | Helm Chart |
| `docker network` 隔離 | NetworkPolicy |

### 逐字稿

好，總複習做完了。我們來回顧一下整個四堂課的旅程。

第四堂，你第一次認識 K8s，學了架構、Pod、kubectl 的基本指令。那時候你能做的就是跑一個容器，跟 `docker run` 差不多。

第五堂，你學了 Deployment 和 Service，能夠跑多個副本、讓 Pod 之間互相連線、讓外面的人連進來。

第六堂，你學了 Ingress 讓使用者用域名連、ConfigMap 和 Secret 管理設定、PV 和 PVC 做資料持久化、Helm 做套件管理。

第七堂，也就是今天，你學了 Probe 做健康檢查、Resource 和 HPA 管理資源和自動擴縮、RBAC 做權限控制、NetworkPolicy 做網路隔離。然後你把所有東西串起來，做了一次完整的生產級部署。

投影片上有一張完整的 Docker → K8s 對照表。你在 Docker 課程裡學的每一個概念，都能在 K8s 找到對應的東西。`docker run` 對應 Pod，`-p 8080:80` 對應 Service，`HEALTHCHECK` 對應 Probe，`--memory` 對應 resources。K8s 不是一個全新的東西，它是 Docker 的延伸和進化。

---

## 第 32 頁 | 知識地圖（5min）

### PPT 上的內容

**K8s 核心知識地圖**

```
                    ┌── Pod
                    ├── ReplicaSet
         工作負載 ──┤── Deployment
                    ├── StatefulSet
                    ├── DaemonSet
                    └── Job / CronJob

                    ┌── Service (ClusterIP / NodePort / LoadBalancer)
          網路 ────┤── Ingress
                    ├── CoreDNS
                    └── NetworkPolicy

                    ┌── ConfigMap
         配置管理 ──┤── Secret
                    └── Namespace

                    ┌── PersistentVolume (PV)
          儲存 ────┤── PersistentVolumeClaim (PVC)
                    └── StorageClass

                    ┌── Probe (liveness / readiness / startup)
         運維監控 ──┤── Resource requests / limits
                    ├── HPA
                    └── kubectl logs / describe / top

                    ┌── RBAC (Role / RoleBinding)
          安全 ────┤── ServiceAccount
                    └── NetworkPolicy

          工具 ────── kubectl / Helm / K9s / Lens
```

### 逐字稿

這張知識地圖把四堂課的所有概念做了一個分類。工作負載有六種：Pod、ReplicaSet、Deployment、StatefulSet、DaemonSet、Job/CronJob。網路有四個：Service、Ingress、CoreDNS、NetworkPolicy。配置管理有 ConfigMap、Secret、Namespace。儲存有 PV、PVC、StorageClass。運維有 Probe、Resource、HPA。安全有 RBAC 和 NetworkPolicy。

你不需要全部背下來，但建議你把這張圖印出來貼在電腦旁邊。當你在工作中遇到某個問題的時候，先看看這張圖上有沒有對應的概念，然後去查文件。

---

## 第 33 頁 | 接下來學什麼 + CKA（5min）

### PPT 上的內容

**推薦的學習路線**

```
你現在在這裡 ──→ 能部署和管理應用
                  ↓
下一步 ──→ CKA 認證（Certified Kubernetes Administrator）
           ├── 考試費 $395 USD
           ├── 線上實作考試，2 小時
           ├── 我們學的內容涵蓋了 CKA 約 60% 的知識點
           └── 需要額外學：kubeadm、etcd 備份還原、網路除錯、
               Taint/Toleration、Node Affinity、PDB
                  ↓
進階 ──→ CKAD（開發者）/ CKS（安全）
         Istio Service Mesh
         ArgoCD GitOps
         Operator Pattern
```

**推薦資源：**
- Kubernetes 官方文件（考試可以查！）
- Killer.sh — CKA 模擬考
- KodeKloud — 互動式練習
- K8s the Hard Way — 從零手動搭建（理解底層）

### 逐字稿

學完這四堂課之後，接下來學什麼？我推薦考 CKA — Certified Kubernetes Administrator。它是 CNCF 官方認證，業界認可度很高。考試是線上實作，不是選擇題，你要在真實的叢集上操作。

我們四堂課學的內容大概涵蓋了 CKA 約 60% 的知識點。還需要額外學的包括：用 kubeadm 從零搭建叢集、etcd 備份和還原（今天有講概念）、網路除錯（像是 DNS 解析失敗怎麼查）、Taint/Toleration 和 Node Affinity（控制 Pod 排程到哪個 Node）、PDB（Pod Disruption Budget，維護時保證最少幾個 Pod 在跑）。

如果你工作角色偏開發，可以考 CKAD。偏安全可以考 CKS。

更進階的話，可以學 Istio Service Mesh（微服務流量管理）、ArgoCD（GitOps 持續部署）、Operator Pattern（自訂控制器）。

推薦資源方面，K8s 官方文件是最好的學習資料，而且 CKA 考試可以查官方文件。Killer.sh 是很好的模擬考平台。KodeKloud 有互動式練習環境。如果你想深入理解底層原理，可以挑戰 Kubernetes the Hard Way。

---

## 第 34 頁 | 常見面試題（5min）

### PPT 上的內容

**K8s 面試常見問題（練習回答）**

1. **Pod 和 Container 的差別是什麼？**
   → Pod 是 K8s 最小調度單位，可以包含多個 Container，共享網路和儲存

2. **Deployment 和 StatefulSet 的差別？**
   → Deployment 適合無狀態應用（API），StatefulSet 適合有狀態應用（DB），StatefulSet 有穩定的網路標識和獨立的 PVC

3. **livenessProbe 和 readinessProbe 的差別？**
   → liveness 失敗重啟容器，readiness 失敗從 Service 移除

4. **requests 和 limits 的差別？**
   → requests 是保底（排程依據），limits 是天花板（硬限制）

5. **如何實現滾動更新不停機？**
   → Deployment 的 Rolling Update 策略 + readinessProbe

6. **如何確保只有 API 能連 DB？**
   → NetworkPolicy 限制 ingress 流量

### 逐字稿

最後給大家一些常見的 K8s 面試題，你可以用來測試自己學會了沒。

第一題：Pod 和 Container 的差別是什麼？答案是 Pod 是 K8s 最小的調度單位，一個 Pod 裡面可以有多個 Container，它們共享網路和儲存。

第二題：Deployment 和 StatefulSet 的差別？Deployment 適合無狀態的應用，像 API Server。StatefulSet 適合有狀態的，像資料庫，因為它提供穩定的網路標識和每個 Pod 獨立的 PVC。

第三題：liveness 和 readiness 的差別？今天學的。liveness 失敗重啟容器，readiness 失敗從 Service 移除。

第四題：requests 和 limits 的差別？也是今天學的。requests 是保底、排程依據，limits 是天花板、硬限制。

第五題：如何實現滾動更新不停機？靠 Deployment 的 Rolling Update 策略加上 readinessProbe，確保新 Pod 準備好了才把流量轉過去、舊 Pod 才被終止。

第六題：如何確保只有 API 能連 DB？用 NetworkPolicy 限制 DB Pod 的 ingress 流量，只允許帶有 `role=api` label 的 Pod 連進來。

這六題涵蓋了四堂課的核心概念。如果你都能流暢地回答，恭喜你，K8s 的基礎已經很扎實了。

---

## 第 35 頁 | 結業 + 結語（5min）

### PPT 上的內容

**四堂課，你從零到能部署生產級 K8s 應用**

```
第一堂（Docker 基礎）：docker run → 跑一個容器
第二堂（Docker 進階）：Docker Compose → 跑多個容器
第三堂（Docker 實戰）：Dockerfile + CI → 自動化
第四堂（K8s 入門）：Pod + kubectl → 在叢集上跑
第五堂（服務與網路）：Deployment + Service → 多副本 + 可存取
第六堂（設定與資料）：Ingress + ConfigMap + PV + Helm → 專業化
第七堂（生產就緒）：Probe + HPA + RBAC + NetworkPolicy → 生產級
```

**你已經具備的能力：**
- 能在 K8s 叢集上部署和管理多服務應用
- 會設定健康檢查、資源限制、自動擴縮
- 會做基本的權限控制和網路隔離
- 會用 Helm 安裝和管理複雜應用
- 有一套系統化的排錯流程

**Keep Learning. Keep Building.**

### 逐字稿

好，我們的課程到這裡就全部結束了。

讓我們最後回顧一下你走過的路。七堂課，從第一堂連 `ls` 和 `cd` 是什麼都還不太確定，到第二堂學會用 `docker run` 跑容器，第三堂學會寫 Dockerfile 和 Docker Compose，第四堂第一次接觸 K8s 寫出人生第一個 Pod YAML，到今天 — 你從一個完全空的 Namespace 開始，一步一步部署了一套有 Probe、有 Resource limits、有 HPA 自動擴縮、有 RBAC 權限控制、有 NetworkPolicy 網路隔離的完整生產級應用。

你知道這代表什麼嗎？這代表你已經具備了在真實工作環境中部署和維運 Kubernetes 應用的基本能力。你不再只是會用 `docker run` 跑一個容器的人了。

說實話，能學到這裡的人不多。容器和 K8s 的學習曲線是很陡的，中間有太多讓人想放棄的時刻 — YAML 的縮排錯了改半天、Pod 一直 CrashLoopBackOff 不知道為什麼、Service 怎麼都連不上。但你撐過來了。每一次的 debug、每一次看到 `Running` 狀態的那一刻，都讓你變得更強。

接下來呢？我建議你做三件事。

第一，把今天的總複習 12 步再自己從頭做一遍，不看講義，能做到多少就多少。做不出來的地方就是你還需要加強的。

第二，如果你想要一個有份量的認證，去考 CKA。我們四堂課涵蓋了 CKA 大約 60% 的知識點，再補上 kubeadm、etcd 備份還原、Taint/Toleration 這些，你就夠了。CKA 考試可以查官方文件，所以不用死背，重要的是動手能力。

第三，在你自己的專案或工作中真正用起來。學過的東西不用就會忘，用過才是你的。哪怕只是把一個小的 side project 部署到 minikube 上，都是很好的練習。

最後我想說的是，今天學到的東西是 K8s 的基礎，但這個基礎非常扎實。K8s 的生態系統很龐大 — Service Mesh、GitOps、Operator、eBPF，還有太多東西可以探索。但你已經有了地基。有了地基，蓋什麼都不怕。

Keep Learning. Keep Building. 大家辛苦了，七堂課的容器課程到這裡圓滿結束。希望這門課能成為你技術生涯的一個轉折點。我們後會有期！
