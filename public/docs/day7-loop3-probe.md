# Loop 3 — Probe 健康檢查

---

## 7-2 Probe 概念（5 分鐘純概念）

### Running ≠ 可用

你打 `kubectl get pods`，看到 STATUS 是 `Running`。你以為沒事了——**Running 這個狀態在騙你**。

Running 只代表一件事：容器裡的主行程還活著。process 還在，K8s 就說你 Running。但「活著」不等於「能服務」。

**真實場景**：
- **Java GC 死迴圈**：process 沒 crash，但 CPU 100%，request 打進去永遠不回應
- **連線池滿了**：process 還活著，回 500 錯誤
- **Spring Boot 啟動要 30 秒**：Pod Running 了，但 app 還在 load config，打進去全 503

這三種狀況，K8s **永遠不會發現**，除非你有 Probe。

### 三種 Probe 一張表看懂

| | **Liveness** | **Readiness** | **Startup** |
|---|---|---|---|
| **問題** | 你還活著嗎？ | 能接流量嗎？ | 啟動完了嗎？ |
| **失敗後果** | Kill + Restart | 從 Service endpoints 拔掉 | 暫停 Liveness/Readiness |
| **用途** | 救活死掉的 app | 避免流量打到壞 pod | 保護慢啟動 app |

**白話版**：
- **Liveness**：「你再不回我我就殺了你。」→ 暴力，換一個
- **Readiness**：「你還沒好？那我暫時不給你工作。」→ 溫柔，等它好
- **Startup**：「啟動中請勿打擾。」→ 保護傘，啟動完就關閉

### 三種檢查方式

| 方式 | 適合 |
|------|------|
| `httpGet`：打 URL，2xx/3xx 算過 | Web API（最常用） |
| `tcpSocket`：連 port，連上算過 | DB、Redis |
| `exec`：執行指令，exit 0 算過 | 自訂檢查邏輯 |

### Docker vs K8s 對照

Docker 的 `HEALTHCHECK` 只有一種，只標記 unhealthy，不會重啟也不會切流量。K8s 三種 Probe 各司其職。

---

## 7-3 Probe 實戰（15 分鐘）

五個 demo，兩兩對照。**同一個破壞動作（rm index.html），看不同設定的差異**。

---

### Demo 1a：沒 Probe 的慘狀

**目的**：證明 K8s 在沒 Probe 時，**完全不知道服務壞了**。

`nginx-no-probe.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-no-probe
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-no-probe
  template:
    metadata:
      labels:
        app: nginx-no-probe
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
```

部署 + 破壞：

```
指令：kubectl apply -f nginx-no-probe.yaml
指令：kubectl get pods -l app=nginx-no-probe
指令：POD1=$(kubectl get pods -l app=nginx-no-probe -o jsonpath='{.items[0].metadata.name}')
指令：kubectl exec $POD1 -- rm /usr/share/nginx/html/index.html
```

觀察結果：

```
指令：kubectl get pods -l app=nginx-no-probe
指令：kubectl exec $POD1 -- curl -s -o /dev/null -w "%{http_code}\n" localhost
```

- `kubectl get pods` → STATUS 永遠是 `Running`，RESTARTS 永遠是 0
- 但 `curl` 回 **403** — 實際上壞掉了
- **K8s 以為一切正常，但使用者看到錯誤**

這就是「Running 在騙你」的證據。

---

### Demo 1b：加 Liveness → 自動救援

**目的**：同樣的破壞，有了 Liveness 會發生什麼。

`nginx-liveness.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-liveness
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-liveness
  template:
    metadata:
      labels:
        app: nginx-liveness
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

**參數說明**：
- `initialDelaySeconds: 5`：容器啟動後等 5 秒再開始檢查
- `periodSeconds: 10`：每 10 秒檢查一次
- `failureThreshold: 3`：連續失敗 3 次才判定不健康（不要一次就炸）
- `timeoutSeconds: 1`：1 秒沒回應算超時

部署 + 破壞：

```
指令：kubectl apply -f nginx-liveness.yaml
指令：POD2=$(kubectl get pods -l app=nginx-liveness -o jsonpath='{.items[0].metadata.name}')
指令：kubectl exec $POD2 -- rm /usr/share/nginx/html/index.html
```

觀察重啟：

```
指令：kubectl get pods -l app=nginx-liveness -w
```

約 30 秒內（10 秒 × 3 次）會看到：

```
NAME                             READY   STATUS    RESTARTS   AGE
nginx-liveness-xxx               1/1     Running   0          2m
nginx-liveness-xxx               0/1     Running   0          2m30s
nginx-liveness-xxx               1/1     Running   1          2m35s
```

**RESTARTS 從 0 變 1** — K8s 自動殺掉容器重啟。重啟後 nginx 重新 init，index.html 回來了。

按 `Ctrl+C` 停 watch。看事件：

```
指令：kubectl describe pod $POD2
```

Events 會看到：
- `Liveness probe failed: HTTP probe failed with statuscode: 403`
- `Container nginx failed liveness probe, will be restarted`

`Killing` 不是死掉，是 k8s 把舊容器殺掉、自動重啟新的。**記得看 `Restart Count`**，從 0 變 1 就代表重啟過一次。

**結論**：**同樣的破壞**，沒 probe → 壞到底；有 Liveness → 30 秒自動救活。

---

### Demo 2a：沒 Readiness → 流量打到壞 pod

**目的**：證明只有 Liveness 不夠，使用者在「失敗→被殺」那段時間還是會看到錯誤。

這次用 **3 replicas + Service**，只設 Liveness，沒 Readiness。

`nginx-liveness-only.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-liv-only
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-liv-only
  template:
    metadata:
      labels:
        app: nginx-liv-only
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
            failureThreshold: 6    # 60 秒才重啟，空窗期夠長
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-liv-svc
spec:
  selector:
    app: nginx-liv-only
  ports:
    - port: 80
      targetPort: 80
```

部署 + 破壞其中一個 pod：

```
指令：kubectl apply -f nginx-liveness-only.yaml
指令：kubectl get pods -l app=nginx-liv-only
指令：POD3=$(kubectl get pods -l app=nginx-liv-only -o jsonpath='{.items[0].metadata.name}')
指令：kubectl exec $POD3 -- rm /usr/share/nginx/html/index.html
```

觀察 endpoints 和流量：

```
指令：kubectl get endpoints nginx-liv-svc
指令：kubectl run curl-test --image=curlimages/curl --rm -it --restart=Never -- sh -c "for i in \$(seq 1 9); do curl -s -o /dev/null -w '%{http_code}\n' nginx-liv-svc; done"
```

- `endpoints` → 3 個 IP 都還在（K8s 沒把壞 pod 拔掉）
- 9 次 curl → 會看到 `200, 200, 403, 200, 403, ...` 交錯（1/3 機率打到壞 pod）

**結論**：只有 Liveness，從「破壞」到「被殺」中間約 30 秒，**使用者有 1/3 流量看到 403**。

---

### Demo 2b：加 Readiness → 拔流量無感

**目的**：同樣的破壞，加上 Readiness 會自動避開壞 pod。

`nginx-readiness.yaml`（Liveness + Readiness 都設）：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-readiness
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-readiness
  template:
    metadata:
      labels:
        app: nginx-readiness
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
            failureThreshold: 6    # 60 秒才重啟，空窗期夠長
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 2
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-rdy-svc
spec:
  selector:
    app: nginx-readiness
  ports:
    - port: 80
      targetPort: 80
```

**為什麼 Readiness 的 periodSeconds 比 Liveness 短**：Readiness 要快速反應（5 秒 × 2 次 = 10 秒拔流量），Liveness 慢慢來沒關係（10 秒 × 6 次 = 60 秒才殺）。這樣 Readiness 先拔流量，流量已經被導開了再 Liveness 殺。

部署 + 破壞：

```
指令：kubectl apply -f nginx-readiness.yaml
指令：POD4=$(kubectl get pods -l app=nginx-readiness -o jsonpath='{.items[0].metadata.name}')
指令：kubectl exec $POD4 -- rm /usr/share/nginx/html/index.html
```

等 15 秒（Readiness 先反應）：

```
指令：kubectl get endpoints nginx-rdy-svc
指令：kubectl get pods -l app=nginx-readiness
```

- `endpoints` → **從 3 個 IP 變 2 個**（壞 pod 被拔）
- `get pods` → 壞 pod 還是 `Running`，READY 欄位變 `0/1`（還沒被殺）
- **Pod 沒被殺，但流量已經避開**

打 service 驗證使用者無感：

```
指令：kubectl run curl-test --image=curlimages/curl --rm -it --restart=Never -- sh -c "for i in \$(seq 1 9); do curl -s -o /dev/null -w '%{http_code}\n' nginx-rdy-svc; done"
```

9 次 curl → **全部 200**。使用者完全不知道有 pod 壞掉。

再等一下，Liveness 也會觸發重啟（30 秒）。重啟完 Readiness 通過，pod 重新加回 endpoints。整個過程使用者**無感**。

**結論**：同一個破壞，沒 Readiness → 1/3 流量看 403；有 Readiness → 使用者完全無感。

---

### Liveness vs Readiness 關鍵對比

| | Liveness | Readiness |
|---|---|---|
| 失敗做什麼 | **Kill pod + Restart** | **從 endpoints 拔掉** |
| Pod 會被殺嗎 | ✅ 會 | ❌ 不會 |
| RESTARTS 欄位 | +1 | 不變 |
| 適合 | 死鎖、卡住的 app | 暫時過載、暖機中 |

**同一招 rm html**：
- Liveness 設定 → RESTARTS +1
- Readiness 設定 → RESTARTS 0，但 endpoints 少一個 IP

---

### Startup 延伸講解（不做 demo）

**場景**：Legacy Java app 啟動要 2 分鐘。你 Liveness 設 `initialDelaySeconds: 30` 想說夠了吧？**錯了**。

30 秒後 Liveness 打進去失敗 → kill → restart → 又要 2 分鐘 → 又 kill → **無限循環，pod 永遠起不來**。

**爛解法**：`initialDelaySeconds: 180`。問題是穩定運行後如果卡住，要等 3 分鐘才會被救——為了啟動犧牲了運行期敏感度。

**正解**：用 Startup Probe。

```yaml
startupProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  failureThreshold: 30
  periodSeconds: 5
# → 最多等 30 × 5 = 150 秒
```

- 啟動期只跑 Startup（容忍 150 秒）
- Startup 成功**一次**後 → **永久關閉**，Liveness / Readiness 接手用正常短間隔
- 啟動慢 + 運行期敏感，兩個都要

**為什麼不 demo**：nginx 啟動 < 1 秒，很難做出慢啟動場景。知道這個工具存在、遇到慢啟動 app 時知道要用就好。挑戰題會讓你自己實作。

---

### 清理這段的所有資源

```
指令：kubectl delete -f nginx-no-probe.yaml
指令：kubectl delete -f nginx-liveness.yaml
指令：kubectl delete -f nginx-liveness-only.yaml
指令：kubectl delete -f nginx-readiness.yaml
```

---

## 7-4 學員實作（10 分鐘）

### 題目場景

你剛學會三種 Probe，現在自己部署一個 nginx，同時加上 Liveness + Readiness + Service，照著指令卡跑一次完整流程驗證三件事：
1. Liveness 真的會重啟壞 pod
2. Readiness 真的會把壞 pod 從 endpoints 拔掉
3. 整體使用者無感

### 必做題要求

- Deployment：`my-probe`，replicas 3
- image：`nginx:1.27`
- Liveness + Readiness 都設，打 `/`，port 80
- Liveness：`initialDelaySeconds: 5, periodSeconds: 10, failureThreshold: 3`
- Readiness：`initialDelaySeconds: 3, periodSeconds: 5, failureThreshold: 2`
- ClusterIP Service：`my-probe-svc`

### 驗收條件

- ✅ 部署後三個 pod 都 Running + READY 1/1
- ✅ `rm index.html` 後 15 秒內 endpoints 從 3 變 2
- ✅ 30 秒內 RESTARTS +1
- ✅ 重啟後 endpoints 自動加回 3

### 完整指令清單（照著打）

```bash
# ─── Part 1：寫 YAML ───
cat > my-probe.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-probe
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-probe
  template:
    metadata:
      labels:
        app: my-probe
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
            failureThreshold: 6    # 60 秒才重啟，空窗期夠長
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 2
---
apiVersion: v1
kind: Service
metadata:
  name: my-probe-svc
spec:
  selector:
    app: my-probe
  ports:
    - port: 80
      targetPort: 80
EOF

# ─── Part 2：部署 + 確認 ───
kubectl apply -f my-probe.yaml
kubectl get pods -l app=my-probe
kubectl get endpoints my-probe-svc                  # 3 個 IP

# ─── Part 3：破壞一個 pod ───
POD=$(kubectl get pods -l app=my-probe -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD -- rm /usr/share/nginx/html/index.html

# ─── Part 4：觀察 Readiness 拔流量（約 15 秒內）───
kubectl get endpoints my-probe-svc                  # 3 → 2
kubectl get pods -l app=my-probe                    # pod 還 Running，READY 變 0/1

# ─── Part 5：觀察 Liveness 重啟（30 秒內）───
kubectl get pods -l app=my-probe -w
# 看到 RESTARTS +1，Ctrl+C 離開 watch

# ─── Part 6：查看失敗事件 ───
kubectl describe pod $POD | grep -A5 Events

# ─── Part 7：清理 ───
kubectl delete -f my-probe.yaml
```

### 挑戰題：Startup Probe

情境：假設 nginx 啟動要 2 分鐘（模擬慢啟動）。加一個 Startup Probe，確保啟動期間 Liveness 不會誤殺，Startup 通過後才由 Liveness 接手。

要求：
- 加 `startupProbe` 打 `/`，`failureThreshold: 30`，`periodSeconds: 5`（容忍 150 秒）
- 部署後觀察 Startup 先通過，才輪到 Liveness 開始檢查
- 用 `kubectl describe pod` 看 Events，找 Startup probe 的記錄

### Loop 3 因果鏈

Running 在騙你（沒 probe K8s 不知道死活）→ Liveness 自動救援（殺掉重建）→ Readiness 避免流量打到壞 pod（拔流量不殺）→ 同一招 rm html，兩種 probe 兩種後果 → 生產級 K8s 部署必備組合。

---

## 清理（Loop 3 結束）

```
指令：kubectl delete -f nginx-no-probe.yaml --ignore-not-found
指令：kubectl delete -f nginx-liveness.yaml --ignore-not-found
指令：kubectl delete -f nginx-liveness-only.yaml --ignore-not-found
指令：kubectl delete -f nginx-readiness.yaml --ignore-not-found
指令：kubectl delete -f my-probe.yaml --ignore-not-found
指令：rm -f nginx-no-probe.yaml nginx-liveness.yaml nginx-liveness-only.yaml nginx-readiness.yaml my-probe.yaml
```

下一段：Loop 4 整合部署。Probe 讓服務能自我修復，下一段把 Probe 跟 ConfigMap、Secret、Service 全部整合起來，做一個完整的 production-ready 部署。
