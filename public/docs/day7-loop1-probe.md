# Day 7 Loop 1 — Probe 健康檢查

---

## 7-2 Probe 概念（~15 min）

### ① 課程內容

📄 7-2 第 1 張

上一堂課做了 Ingress、ConfigMap、Secret、PV、StatefulSet、Helm，服務看起來很體面。但我今天要跟大家說一件殘酷的事情：**穿得漂亮不代表扛得住**。

從第四堂到現在，你怎麼確認服務正常？打 `kubectl get pods`，看到 STATUS 是 `Running`、READY 是 `1/1`、RESTARTS 是 `0`，覺得沒事了。

但我要告訴你，**Running 這個狀態在騙你**。Running 只代表一件事：容器裡面的主行程還在跑。process 活著，K8s 就認為你是 Running。

---

📄 7-2 第 2 張

**三個你遇過的場景**

場景一：**API 死鎖**。兩個執行緒互相等對方釋放鎖，卡住了。process 還活著，但不處理任何請求。K8s 顯示 Running，使用者看到的是請求超時。

場景二：**資料庫連線池滿了**。連線池只有 10 個連線，全部被佔住，每個新請求都拿不到連線，回 500 錯誤。K8s 顯示 Running，使用者看到的是錯誤頁面。

場景三：**Java Spring Boot 啟動太慢**。啟動要 60 秒，但 Pod 建好容器跑起來 K8s 馬上說 Running。前 60 秒的請求全部失敗。

三個場景，同一個問題：**K8s 不知道你的服務到底正不正常**，它只知道 process 有沒有在跑。

---

📄 7-2 第 3 張

**Docker 的做法：一種 HEALTHCHECK**

用過 Docker 的人可能用過 `HEALTHCHECK`，可以每 30 秒 curl 一下 `/health`，不成功就標記 unhealthy。但 Docker 的 HEALTHCHECK 只有一種，而且功能很有限，它只能標記 unhealthy，不會幫你重啟，也不會幫你把流量切掉。

K8s 在這方面強大得多。它有**三種 Probe**，探針，每一種負責不同的事情。

| Probe | 問的問題 | 失敗怎麼辦 | 適用場景 |
|:------|:---------|:-----------|:---------|
| livenessProbe | 你還活著嗎？ | 重啟容器 | 死鎖、無窮迴圈 |
| readinessProbe | 準備好接流量了嗎？ | 從 Service 移除 | 啟動中、暫時過載 |
| startupProbe | 啟動完了嗎？ | 重啟容器 | Java 慢啟動 |

---

📄 7-2 第 4 張

**三種 Probe 詳細說明**

**livenessProbe（存活探測）**：K8s 定期去戳你的 Pod，如果連續失敗超過 failureThreshold 次，就直接重啟容器。注意是重啟容器，不是刪 Pod。容器重啟後程式重新初始化，死鎖就解開了。

**readinessProbe（就緒探測）**：失敗的時候 K8s 不重啟容器，而是把這個 Pod 從 Service 的 Endpoints 裡面移除。白話就是不再把流量轉給它。等它恢復了再加回來。適合「暫時不能服務但會自己恢復」的情況。

**兩者最大的差別**：livenessProbe 失敗是換人（重啟），readinessProbe 失敗是讓你休息（不導流量）。

**startupProbe（啟動探測）**：專門給啟動特別慢的應用。K8s 會先等 startupProbe 通過，才開始跑 liveness 和 readiness。你可以給 startupProbe 設寬鬆的限制，比如最多等 150 秒。啟動完成後 startupProbe 就不再檢查了，交給 liveness 和 readiness 接手。

---

📄 7-2 第 5 張

**餐廳比喻**

- **livenessProbe**：檢查廚師還有沒有心跳。沒心跳就換一個新廚師。
- **readinessProbe**：問廚師準備好出菜了嗎？還沒好就先不送單給他。
- **startupProbe**：廚師剛上班還在熱鍋子，等他熱好再讓他接單。

---

📄 7-2 第 6 張

**三種檢查方式**

| 檢查方式 | 寫法 | 適合 |
|:---------|:-----|:-----|
| HTTP GET | `httpGet: path: /health` | Web API（最常用） |
| TCP Socket | `tcpSocket: port: 3306` | 資料庫、Redis |
| exec 指令 | `exec: command: [...]` | 自訂檢查邏輯 |

httpGet：K8s 去打那個 URL，回傳 200 到 399 就是成功。最常用，Web API 幾乎都用這個。

tcpSocket：K8s 嘗試連某個 port，連上就是成功。適合資料庫、Redis 這種不是 HTTP 的服務。

exec：在容器裡執行一個指令，回傳值是 0 就是成功。適合需要自訂檢查邏輯的場景。

---

📄 7-2 第 7 張

**YAML 四個關鍵參數**

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5    # 容器啟動後先等幾秒再開始檢查
  periodSeconds: 10          # 每幾秒檢查一次
  failureThreshold: 3        # 連續失敗幾次才判定不健康
  timeoutSeconds: 1          # 每次檢查等幾秒沒回應算超時
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 3
  periodSeconds: 5
  failureThreshold: 2
```

readinessProbe 的 periodSeconds 通常比 liveness 短，因為我們希望 Pod 準備好了就趕快接流量。

---

📄 7-2 第 8 張

**Docker vs K8s 對照**

| Docker HEALTHCHECK | K8s Probe |
|:-------------------|:----------|
| `--interval=30s` | `periodSeconds: 30` |
| `--timeout=3s` | `timeoutSeconds: 3` |
| `--retries=3` | `failureThreshold: 3` |
| `--start-period=5s` | `initialDelaySeconds: 5` |
| 只有一種 | liveness + readiness + startup 三種 |

最大的差別：Docker 只有一種 HEALTHCHECK，K8s 有三種，各負責不同的事。

最後想一下：如果你**完全不設 Probe** 會怎樣？壞掉的 Pod 繼續收請求。程式死鎖了，K8s 不知道，Service 照樣把流量送過去。使用者不斷看到錯誤，直到有人手動去 `kubectl describe pod` 才發現問題。生產環境不設 Probe，就像開車不裝後照鏡。

概念講完了，下一支影片我們來動手做，故意把服務搞壞，看 K8s 怎麼處理。

---

## 7-3 Probe 實作（~15 min）

### ② 所有指令＋講解

**Step 1：建立 deployment-probe.yaml**

```yaml
# deployment-probe.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-probe-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-probe
  template:
    metadata:
      labels:
        app: nginx-probe
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3
            timeoutSeconds: 1
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 2
```

重點說明：

- `livenessProbe.httpGet.path: /`：打 nginx 的根路徑。nginx 預設回 200，Probe 通過。
- `initialDelaySeconds: 5`：容器啟動後先等 5 秒再開始。nginx 啟動很快，但留點緩衝。
- `periodSeconds: 10`：每 10 秒戳一次，不要太頻繁浪費資源。
- `failureThreshold: 3`：連續失敗 3 次才重啟。不是失敗一次就重啟，可能只是網路抖了一下。
- `timeoutSeconds: 1`：等 1 秒沒回應就算超時。
- `readinessProbe`：打相同路徑，但 periodSeconds 設 5 秒，比 liveness 頻繁，Pod 好了就快點接流量。

---

**Step 2：部署**

```bash
kubectl apply -f deployment-probe.yaml
```

預期輸出：
```
deployment.apps/nginx-probe-demo created
```

---

**Step 3：確認 Pod 狀態和 Probe 設定**

```bash
kubectl get pods -l app=nginx-probe
```

預期輸出：
```
NAME                              READY   STATUS    RESTARTS   AGE
nginx-probe-demo-6d8f7b9c4-abc   1/1     Running   0          30s
nginx-probe-demo-6d8f7b9c4-xyz   1/1     Running   0          30s
```

兩個 Pod 都 Running，READY 1/1，RESTARTS 0。

```bash
kubectl describe pods -l app=nginx-probe | grep -A10 "Liveness\|Readiness"
```

你會看到：
```
Liveness:   http-get http://:80/ delay=5s timeout=1s period=10s success=1 failure=3
Readiness:  http-get http://:80/ delay=3s timeout=1s period=5s success=1 failure=2
```

這就是我們設的參數，確認 Probe 有正確吃進去。

---

**Step 4：故意搞壞 — 刪掉 index.html**

原理：nginx 的 livenessProbe 打根路徑 `/`，nginx 會回傳 `/usr/share/nginx/html/index.html`，狀態碼 200，Probe 通過。如果把 index.html 刪掉，nginx 找不到這個檔案，回 **403 Forbidden**。403 不在 200～399 的範圍，Probe 失敗。

先抓第一個 Pod 的名字：

```bash
POD_NAME=$(kubectl get pods -l app=nginx-probe -o jsonpath='{.items[0].metadata.name}')
echo $POD_NAME
```

- `-o jsonpath`：從 JSON 輸出裡取出特定欄位，`items[0]` 是第一個 Pod。

進去刪掉 index.html：

```bash
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
```

- `kubectl exec`：在容器裡執行指令。
- `--`：分隔 kubectl 的參數和容器內的指令。
- `rm /usr/share/nginx/html/index.html`：刪掉 nginx 的首頁檔案。

---

**Step 5：觀察重啟**

```bash
kubectl get pods -l app=nginx-probe -w
```

- `-w`：watch 模式，即時顯示狀態變化。

算一下時間：periodSeconds 10 秒 × failureThreshold 3 次 = 最多等 30 秒。你會看到：

```
NAME                              READY   STATUS    RESTARTS   AGE
nginx-probe-demo-6d8f7b9c4-abc   1/1     Running   0          2m
nginx-probe-demo-6d8f7b9c4-abc   0/1     Running   0          2m30s
nginx-probe-demo-6d8f7b9c4-abc   1/1     Running   1          2m35s
```

RESTARTS 從 0 變成 1。K8s 重啟了這個容器。重啟後 nginx 重新載入，index.html 恢復，livenessProbe 又通過了。

按 `Ctrl+C` 停止 watch。

---

**Step 6：看 Events 確認原因**

```bash
kubectl describe pod $POD_NAME
```

找到 Events 區塊，你會看到：

```
Warning  Unhealthy  ...  Liveness probe failed: HTTP probe failed with statuscode: 403
Warning  Killing    ...  Container nginx failed liveness probe, will be restarted
Normal   Pulled     ...  Container image "nginx:1.27" already present
Normal   Started    ...  Started container nginx
```

這就是完整的記錄：K8s 偵測到 403，判定失敗，重啟容器，重新啟動。

---

**排錯指令**

```bash
# Probe 狀態詳細
kubectl describe pod <pod-name>

# 如果想看 readinessProbe 對 endpoints 的影響，先建 Service
kubectl get endpoints

# 看容器 logs
kubectl logs <pod-name>
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| `initialDelaySeconds` 設 0 | Pod 啟動就一直重啟 | 至少設 3 到 5 秒給程式初始化 |
| `path` 寫錯（比如 `/health` 但沒有這個路徑） | Pod 一直被重啟但看不出原因 | 確認 path 是你的應用確實會回 200 的路徑 |
| `port` 跟容器實際監聽的不一樣 | 每次 Probe 都 connection refused | port 要跟 containerPort 一致 |

---

### ③ QA

**Q：livenessProbe 和 readinessProbe 可以同時設嗎？同時失敗會怎樣？**

A：可以同時設，這也是最常見的做法。如果 liveness 和 readiness 打同一個路徑，當路徑不通時，readiness 先失敗（它的 periodSeconds 比較短），Pod 從 Service 移除，不再收流量。再過幾秒 liveness 也失敗，達到 failureThreshold 之後容器被重啟。重啟完成後 readiness 先通過，Pod 重新加回 Service 開始接流量，liveness 也跟著通過。這兩個同時設是互補的，不是衝突的。

**Q：startupProbe 通過之後就不跑了嗎？那誰來保護啟動慢的服務？**

A：對，startupProbe 通過之後就不再執行了，交棒給 liveness 和 readiness。startupProbe 只負責「等待啟動完成」這件事。啟動完成後，liveness 負責偵測死鎖等問題，readiness 負責控制流量。三個 Probe 分工，不是同一件事。

**Q：readinessProbe 失敗了但容器沒被重啟，那這個 Pod 還在浪費資源嗎？**

A：從資源的角度來說，Pod 還在跑，requests 還是佔著。但它不會收到任何流量。這個設計是故意的，因為 readinessProbe 失敗的場景（比如暫時過載、連線池滿了）通常是可以自己恢復的。如果你重啟容器，反而可能讓問題更嚴重。等它恢復了，readinessProbe 通過，自然重新加入 Service。

**Q：為什麼 Probe 的 path 設 `/` 而不是設 `/health`？**

A：看你的應用有沒有 `/health` 這個端點。nginx 沒有，所以用根路徑 `/`。正式的後端 API 通常會專門建一個 `/health` 或 `/healthz` 端點，只做最輕量的健康確認（比如 return 200），不查資料庫、不做複雜邏輯，讓 Probe 打這個。用根路徑的問題是，根路徑可能需要存取資料庫或做其他事情，萬一根路徑邏輯有問題，Probe 就會一直失敗。

---

## 7-4 回頭操作 Loop 1（~5 min）

### ④ 學員實作

**必做**

自己從零寫一個 nginx Deployment，加上 livenessProbe，部署之後 exec 進去刪 index.html，觀察 K8s 自動重啟容器，RESTARTS 欄位從 0 變成 1。

要求：
- Deployment 名稱：`my-nginx-probe`，replicas: 1
- image: nginx:1.27
- livenessProbe 用 httpGet 打根路徑，port 80
- `initialDelaySeconds: 5`，`periodSeconds: 10`，`failureThreshold: 3`

部署後的驗證步驟：
1. `kubectl get pods` 確認 Running
2. `kubectl exec <pod-name> -- rm /usr/share/nginx/html/index.html`
3. `kubectl get pods -w` 等 30 秒內看到 RESTARTS 加 1
4. `kubectl describe pod <pod-name>` 在 Events 找到 `Liveness probe failed`

---

**挑戰**

同時設 readinessProbe 和 startupProbe，並建一個對應的 Service。

要求：
- 在同一個 Deployment 加上 readinessProbe（httpGet `/`，port 80）
- 加上 startupProbe（httpGet `/`，port 80，failureThreshold: 30，periodSeconds: 5）
- 建一個 ClusterIP Service 指向這個 Deployment

觀察：
- 刪 index.html 後用 `kubectl get endpoints <service-name>` 觀察 Pod IP 從 endpoints 消失（readinessProbe 失敗）
- 等容器重啟後觀察 Pod IP 重新出現在 endpoints（readinessProbe 通過）

---

### ⑤ 學員實作解答

**必做解答**

```yaml
# my-nginx-probe.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx-probe
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-nginx-probe
  template:
    metadata:
      labels:
        app: my-nginx-probe
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3
            timeoutSeconds: 1
```

部署：

```bash
kubectl apply -f my-nginx-probe.yaml
kubectl get pods -l app=my-nginx-probe
```

觸發重啟：

```bash
# 取得 Pod 名稱
POD_NAME=$(kubectl get pods -l app=my-nginx-probe -o jsonpath='{.items[0].metadata.name}')

# 刪掉 index.html
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html

# 觀察（等 30 秒內看到 RESTARTS 加 1）
kubectl get pods -l app=my-nginx-probe -w
```

確認 Events：

```bash
kubectl describe pod $POD_NAME
# 找 Events 裡的 "Liveness probe failed" 和 "will be restarted"
```

---

**三個常見坑**

1. **`initialDelaySeconds` 太短**：設 0 的話容器一啟動就開始檢查，nginx 雖然快，但 Pod 網路初始化可能還沒完成，造成不必要的失敗記錄。建議至少 3～5 秒。

2. **`path` 寫錯**：你設了 `path: /health` 但 nginx 沒有 `/health` 路徑，每次 Probe 都是 404，Pod 會一直被重啟。確認 path 是你的應用確實會回 200 的端點。

3. **`port` 寫錯**：容器 `containerPort` 是 80，但 Probe 的 `port` 寫成 8080，K8s 每次都連不上，Probe 一直失敗，Pod 一直重啟。port 要和容器實際監聽的 port 一致。

---

**清理**

```bash
kubectl delete -f my-nginx-probe.yaml
kubectl delete -f deployment-probe.yaml

# 確認清乾淨
kubectl get pods
```
