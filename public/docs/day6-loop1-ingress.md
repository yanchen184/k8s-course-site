# Day 6 Loop 1 — Ingress

---

## 6-2 Ingress 概念（~5 min）

### ① 課程內容

📄 6-2 第 1 張

上堂課做了 NodePort，讓外部可以連進來。但連線網址長這樣：`http://192.168.1.100:30080`。這個給使用者用？不行。

我們要的是 `https://myapp.com`，標準的 80/443，用域名不用記 IP。

這個問題，Docker 時代用 Nginx 反向代理來解。K8s 的等價解法叫 **Ingress**。

Ingress 是兩個東西：一張路由地圖（YAML），還有一個讀地圖的 Pod 叫 **Ingress Controller**。我們用 k3s，**Traefik** 已經裝好了。

好，直接開始做。

---

📄 6-2 第 2 張

**今天的實作目標**

```
使用者輸入 http://<NODE-IP>/       → 前端（nginx）
使用者輸入 http://<NODE-IP>/api    → API（httpd）
使用者輸入 http://www.myapp.local  → 前端（nginx）
使用者輸入 http://api.myapp.local  → API（httpd）
```

一個 IP、標準 80 Port，用路徑或域名區分不同服務。NodePort 再見。

---

### ② 所有指令＋講解

本節以概念引入為主，指令集中於 6-3 實作。

---

### ③ 題目

無（概念引入節不出題）

---

### ④ 解答

無

---

## 6-3 Ingress 實作（~20 min）

### ① 課程內容

📄 6-3 第 1 張

**實作架構**

```
curl http://<NODE-IP>/         → frontend-deploy (nginx)  → frontend-svc (ClusterIP:80)
curl http://<NODE-IP>/api      → api-deploy (httpd)        → api-svc (ClusterIP:3000)
```

兩個 Service 都是 **ClusterIP**（不是 NodePort），外部無法直接存取，靠 Ingress Controller 統一對外。這才是 Ingress 的正確用法。

---

📄 6-3 第 2 張

**學員實作：Ingress Path + Host Routing**

依照 6-3 的步驟完成：
1. 確認 Traefik 在跑
2. 部署 `ingress-basic.yaml`，驗證 path routing
3. 部署 `ingress-host.yaml`，設 `/etc/hosts`，驗證 host routing

---

### ② 所有指令＋講解

---

**Step 1：確認 Ingress Controller 在跑**

```bash
kubectl get pods -n kube-system | grep traefik
```

這裡先解釋一個重要概念：

Ingress 本身只是一份 YAML 規則，就像一張路由地圖，本身不處理任何請求。真正把流量導來導去的是 **Ingress Controller**，它是一個跑在叢集裡的 Pod。

我們用 k3s，它預設安裝 **Traefik** 作為 Ingress Controller，不需要額外設定。minikube 的話要 `minikube addons enable ingress` 才有。

- `-n kube-system`：指定 namespace，K8s 系統元件都跑在這裡
- `| grep traefik`：篩出 Traefik 相關 Pod

預期輸出：
```
NAME                                      READY   STATUS    RESTARTS   AGE
traefik-7d9f5b8c4d-abc12                  1/1     Running   0          2d
```

- `READY 1/1`、`STATUS Running`：Ingress Controller 正常，可以繼續
- 完全沒有輸出 → k3s 沒有正確安裝
- `CrashLoopBackOff` → `kubectl logs -n kube-system <traefik-pod-name>` 看原因

---

**Step 2：部署所有資源**

來看一下 `ingress-basic.yaml` 的內容，然後解釋幾個重點：

```yaml
# ingress-basic.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deploy
spec:
  replicas: 1
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
        image: nginx:1.25
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: httpd:2.4
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  selector:
    app: api
  ports:
  - port: 3000
    targetPort: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: traefik
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 3000
```

重點說明 Ingress 這段：

**`apiVersion: networking.k8s.io/v1`** — 注意，Ingress 不是 `apps/v1`，是 `networking.k8s.io/v1`，這是最容易寫錯的地方。

| 資源類型 | apiVersion |
|----------|-----------|
| Pod、Service、ConfigMap | `v1` |
| Deployment、ReplicaSet | `apps/v1` |
| **Ingress** | **`networking.k8s.io/v1`** |

**`ingressClassName: traefik`** — 告訴叢集：這份規則要交給 Traefik 來執行。不同環境不同值，k3s 是 `traefik`，minikube 是 `nginx`。

**`pathType: Prefix`** — 前綴匹配，`/api` 可以匹配 `/api`、`/api/users`、`/api/orders/123`，生產環境幾乎都用這個。如果要精確匹配改成 `Exact`（`/api` 只匹配 `/api` 本身）。

現在 apply：

```bash
kubectl apply -f ingress-basic.yaml
```

預期輸出：
```
deployment.apps/frontend-deploy created
service/frontend-svc created
deployment.apps/api-deploy created
service/api-svc created
ingress.networking.k8s.io/app-ingress created
```

每一行都要看到 `created`。出現 `error` 先看錯誤訊息，通常是 YAML 格式問題或 apiVersion 寫錯。

---

**Step 3：確認資源狀態**

```bash
kubectl get deployments
```

預期輸出：
```
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
api-deploy        1/1     1            1           30s
frontend-deploy   1/1     1            1           30s
```

```bash
kubectl get svc
```

預期輸出：
```
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
api-svc        ClusterIP   10.43.1.200     <none>        3000/TCP   45s
frontend-svc   ClusterIP   10.43.2.100     <none>        80/TCP     45s
kubernetes     ClusterIP   10.43.0.1       <none>        443/TCP    2d
```

兩個 Service 都是 `ClusterIP`，`EXTERNAL-IP <none>` 是正常的。它們不對外，由 Ingress Controller 統一對外。

---

**Step 4：確認 Ingress 狀態**

```bash
kubectl get ingress
```

預期輸出：
```
NAME          CLASS     HOSTS   ADDRESS         PORTS   AGE
app-ingress   traefik   *       192.168.64.10   80      1m
```

欄位說明：
- `CLASS traefik`：確認由 Traefik 負責
- `HOSTS *`：`*` 表示沒有限定域名，用 IP 直接連也可以
- `ADDRESS`：Traefik 的 IP，等等 curl 就用這個
- `PORTS 80`：監聽 HTTP 80

異常：`ADDRESS` 欄位空白 → Traefik 還沒分配 IP，等幾秒再查；或 Traefik 沒跑起來

```bash
kubectl describe ingress app-ingress
```

預期輸出（關鍵區塊）：
```
Rules:
  Host        Path    Backends
  ----        ----    --------
  *
              /       frontend-svc:80 (10.42.1.5:80)
              /api    api-svc:3000 (10.42.2.6:80)
```

`Backends` 括號裡有 Pod IP → Service 正確找到後端 Pod。如果 Backend 顯示 `<error>` 或空白 → Service selector 和 Pod label 不符。

---

**Step 5：取得 Node IP 並驗證 Path-based Routing**

```bash
kubectl get nodes -o wide
```

看 `INTERNAL-IP` 欄位，那就是你要 curl 的 IP。

```bash
curl http://<NODE-IP>/
```

預期輸出：Nginx 歡迎頁（`Welcome to nginx!`）

```bash
curl http://<NODE-IP>/api
```

預期輸出：`<html><body><h1>It works!</h1></body></html>`（httpd 的預設頁）

兩個路徑各自導到不同後端，Path-based Routing 完成。

---

**Step 6：改做 Host-based Routing**

Path routing 是同一個域名用路徑區分。Host routing 更進一步：不同域名導到不同 Service。

```
http://www.myapp.local     → frontend-svc
http://api.myapp.local     → api-svc
```

看一下 `ingress-host.yaml` 的差異，重點是多了 `host:` 欄位：

```yaml
# ingress-host.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress-host
spec:
  ingressClassName: traefik
  rules:
    - host: www.myapp.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
    - host: api.myapp.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 3000
```

有 `host:` 的時候，只有 HTTP 請求的 Host header 符合的才會被這條規則處理。`curl http://www.myapp.local` 時，curl 自動帶 `Host: www.myapp.local`，Traefik 就知道要導到 frontend-svc。

```bash
kubectl apply -f ingress-host.yaml
```

預期輸出：
```
ingress.networking.k8s.io/app-ingress-host created
```

---

**Step 7：設定本地 DNS（/etc/hosts）**

正式環境是在 DNS 服務商設定域名指向 Node IP。本地測試用 `/etc/hosts` 模擬 DNS：

```bash
sudo sh -c 'echo "192.168.64.10 www.myapp.local api.myapp.local" >> /etc/hosts'
```

注意：
- `sudo sh -c '...'`：整個指令用 sudo 執行（`>>` 重導向需要 root 權限）
- 用 `>>` 追加，絕對不要用 `>`（覆蓋整個 /etc/hosts 會出大事）
- 把 `192.168.64.10` 換成你的 Node INTERNAL-IP

設定後確認：
```bash
grep myapp.local /etc/hosts
```

預期輸出：
```
192.168.64.10  www.myapp.local api.myapp.local
```

---

**Step 8：驗證 Host-based Routing**

```bash
curl http://www.myapp.local
```

預期輸出：Nginx 歡迎頁

```bash
curl http://api.myapp.local
```

預期輸出：`It works!`

兩個域名分別導到不同後端，Host-based Routing 完成。

---

**排錯指令組合**

出問題時依序查：

```bash
# 1. 看 Ingress Events 和後端 Pod IP
kubectl describe ingress app-ingress

# 2. 確認 Service 有後端 Pod
kubectl get endpoints
```

預期輸出：
```
NAME           ENDPOINTS           AGE
api-svc        10.42.2.6:80        5m
frontend-svc   10.42.1.5:80        5m
```

`ENDPOINTS <none>` → Service selector 和 Pod label 不符合，檢查兩邊的 label 設定。

```bash
# 3. 看 Traefik 日誌
kubectl logs -n kube-system <traefik-pod-name>
```

---

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| `/etc/hosts` 忘記加或加錯 | `curl: (6) Could not resolve host` | `grep myapp.local /etc/hosts` 確認 |
| `ingressClassName` 寫錯 | 流量沒有被路由，curl 直接拒絕連線 | k3s 要寫 `traefik`，不是 `nginx` |
| `pathType` 沒有填 | `kubectl apply` 時報 validation error | 每個 path 都必須有 `pathType` 欄位 |

---

### ③ 題目

**必做 1**

公司有一個新服務 `shop-deploy`（image: nginx:1.25），你要：
1. 建一個 ClusterIP Service `shop-svc`，port 8080，targetPort 80
2. 在現有的 `app-ingress` 上加一條路由：`/shop` → `shop-svc:8080`
3. 用 `curl http://<NODE-IP>/shop` 驗證，看到 Nginx 歡迎頁

**必做 2**

執行 `kubectl get endpoints` 後，看到 `api-svc` 的 ENDPOINTS 是 `<none>`（沒有後端 Pod）。說明可能是什麼原因？如何排查？

**挑戰題**

在 host-based routing 的基礎上，加入第三個服務：
- 域名：`admin.myapp.local`
- 後端：`admin-deploy`（image: tomcat:10.1）+ `admin-svc`（port: 8080，targetPort 8080）
- 在 `/etc/hosts` 加入新域名，用 `curl http://admin.myapp.local` 驗證

---

### ④ 解答

**必做 1**

```yaml
# 新增 shop-deploy 和 shop-svc（另存 shop.yaml）
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shop-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: shop
  template:
    metadata:
      labels:
        app: shop
    spec:
      containers:
      - name: shop
        image: nginx:1.25
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: shop-svc
spec:
  selector:
    app: shop
  ports:
  - port: 8080
    targetPort: 80
```

```bash
kubectl apply -f shop.yaml
```

修改 `app-ingress`，在 `spec.rules[0].http.paths` 下新增：

```yaml
- path: /shop
  pathType: Prefix
  backend:
    service:
      name: shop-svc
      port:
        number: 8080
```

```bash
kubectl apply -f ingress-basic.yaml    # 重新 apply 更新 Ingress
curl http://<NODE-IP>/shop             # 驗收，看到 Nginx 歡迎頁
```

**必做 2**

ENDPOINTS 是 `<none>` 最常見的原因：Service 的 `selector` 和 Pod 的 `labels` 不一致（拼字錯誤或值不符）。

排查步驟：

```bash
# 查 Service 的 selector 設定
kubectl describe svc api-svc
# 看 Selector: 欄位，例如 app=api

# 查 Pod 實際帶的 label
kubectl get pods --show-labels
# 看 api-deploy 建出來的 Pod，LABELS 欄位是否包含 app=api

# 如果兩者不符，修改 YAML 後重新 apply
kubectl apply -f ingress-basic.yaml
kubectl get endpoints    # 確認 api-svc 出現 IP
```

**挑戰題解答**

```yaml
# admin.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: admin-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: admin
  template:
    metadata:
      labels:
        app: admin
    spec:
      containers:
      - name: admin
        image: tomcat:10.1
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: admin-svc
spec:
  selector:
    app: admin
  ports:
  - port: 8080
    targetPort: 8080
```

在 `ingress-host.yaml` 新增第三條 host 規則：

```yaml
    - host: admin.myapp.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: admin-svc
                port:
                  number: 8080
```

```bash
kubectl apply -f admin.yaml
kubectl apply -f ingress-host.yaml

# 新增 /etc/hosts 記錄
sudo sh -c 'echo "192.168.64.10 admin.myapp.local" >> /etc/hosts'

# 驗收（Tomcat 啟動較慢，等 30 秒再 curl）
curl http://admin.myapp.local
```

---

## 6-4 回頭操作 Loop 1（~5 min）

### ① 課程內容

📄 6-4 第 1 張

**帶做總覽**

這一節是回頭操作（Loop 1），把 6-2 到 6-3 的內容完整走一遍，確認每個步驟都能動。

流程：
1. Path routing 帶做：`ingress-basic.yaml` → `curl NODE-IP`
2. Host routing 帶做：`ingress-host.yaml` → `/etc/hosts` → `curl 域名`
3. 踩坑回顧：三個最容易出錯的地方
4. 清理環境：`kubectl delete`
5. 銜接下一個主題：設定寫死在 Image 裡怎麼辦

---

📄 6-4 第 2 張

**三個常見坑再確認**

帶大家對照自己的操作，看有沒有踩到：

**坑 1：`/etc/hosts` 忘記改**

```bash
curl http://www.myapp.local
# curl: (6) Could not resolve host: www.myapp.local
```

→ 檢查：`grep myapp.local /etc/hosts`，沒有的話加進去

**坑 2：`ingressClassName` 寫錯**

```yaml
ingressClassName: nginx    # 錯！k3s 要寫 traefik
```

→ Ingress apply 成功，但流量完全沒反應。改成 `traefik` 後 `kubectl apply` 重新套用。

**坑 3：`pathType` 沒有填**

```yaml
paths:
  - path: /api
    backend:          # ← 少了 pathType: Prefix
      service:
        ...
```

→ `kubectl apply` 報錯：`spec.rules[0].http.paths[0].pathType: Required value`。補上 `pathType: Prefix` 即可。

---

📄 6-4 第 3 張

**清理環境**

```bash
kubectl delete -f ingress-basic.yaml
kubectl delete -f ingress-host.yaml
```

預期輸出：
```
deployment.apps "frontend-deploy" deleted
service "frontend-svc" deleted
deployment.apps "api-deploy" deleted
service "api-svc" deleted
ingress.networking.k8s.io "app-ingress" deleted
ingress.networking.k8s.io "app-ingress-host" deleted
```

確認清理完成：
```bash
kubectl get all
kubectl get ingress
```

應該只剩 `kubernetes` 這個預設 Service，其他都消失了。

---

📄 6-4 第 4 張

**銜接下一個問題**

Ingress 解決了「怎麼讓使用者用域名連進來」的問題。但你想想看，你的 API 服務要連資料庫，連線字串是什麼？密碼寫在哪？

```yaml
env:
  - name: DB_PASSWORD
    value: "my-super-secret-password"    # ← 寫死在 YAML，推到 Git 全世界都看到
```

這個問題怎麼解？下一段要學的 ConfigMap 和 Secret 就是答案。

---

### ② 所有指令＋講解

本節帶做，無新指令。所有指令均為 6-3 已講解過的重複操作。

---

### ③ 題目

本節無新題目。

---

### ④ 解答

本節無新解答。
