# Day 6 Loop 1 — Ingress

---

## 6-2 Ingress 概念（~15 min）

### ① 課程內容

📄 6-2 第 1 張

**NodePort 的五個致命問題**

先回顧一下上堂課的成果。我們用 NodePort Service 讓外部可以存取應用，使用者要在瀏覽器輸入 `http://192.168.1.100:30080` 才能看到頁面。但這個網址丟給主管看，他一定會問：「使用者真的要記 IP 加 Port 嗎？」

NodePort 在生產環境有五個硬傷：

| 問題 | 說明 |
|------|------|
| Port 醜 | 使用者要記 `:30080`，不專業 |
| Port 有限 | NodePort 只能用 30000–32767，最多幾百個 Port |
| 沒有域名 | 使用者要記 IP，換機器就連不到 |
| 沒有 HTTPS | 明文傳輸，不安全 |
| 每個服務一個 Port | 10 個服務 = 10 個 NodePort，管理噩夢 |

我們想要的目標：
- 使用者輸入 `https://myapp.com` → 前端
- 使用者輸入 `https://api.myapp.com` → API

一個 IP、標準的 80/443 Port、用域名或路徑區分不同服務。

---

📄 6-2 第 2 張

**Docker 對照：你已經懂的東西**

在 Docker 時代，我們怎麼解決這個問題？用 Nginx 做反向代理。

```nginx
# nginx.conf
server {
    server_name myapp.com;
    location / { proxy_pass http://frontend:80; }
    location /api { proxy_pass http://api:3000; }
}
```

K8s 裡面有等價的解法，叫做 **Ingress**。概念是一樣的：一個入口，根據域名或路徑把流量導到不同的後端服務。

| Docker 概念 | K8s 等價物 |
|------------|-----------|
| `nginx.conf` 路由規則 | **Ingress**（YAML 規則定義） |
| Nginx 容器（真正處理請求的） | **Ingress Controller**（真正跑的 Pod） |

這裡有個容易搞混的地方要先說清楚。

---

📄 6-2 第 3 張

**Ingress 的兩個角色**

Ingress 在 K8s 裡其實是兩個東西：

**Ingress（YAML 規則 / 地圖）**
- 是一份 K8s 資源，就是你寫的 YAML
- 裡面定義「什麼路徑 → 導到哪個 Service」
- 本身不處理任何 HTTP 請求，只是一張「路由地圖」

**Ingress Controller（實際跑的 Pod / 司機）**
- 是一個真正在叢集裡跑的 Pod（通常是 Nginx 或 Traefik）
- 它讀取你寫的 Ingress 規則，然後真正幫你把流量路由出去
- 沒有 Controller，Ingress YAML apply 進去也沒用

你可以這樣記：Ingress 是「地圖」，Ingress Controller 是「會看地圖的司機」。地圖畫得再好，沒有司機沒用。

**常見的 Ingress Controller：**
- **Traefik**：k3s 預設內建，開箱即用
- **Nginx Ingress Controller**：minikube 環境要手動啟用（`minikube addons enable ingress`）

> 本課程用 k3s，所以 Traefik 已經裝好了，不需要額外設定。

---

📄 6-2 第 4 張

**Path-based Routing（路徑路由）**

最常見的用法：同一個域名，不同路徑導到不同 Service。

```
http://192.168.1.100/      → frontend-svc (port 80)
http://192.168.1.100/api   → api-svc (port 3000)
```

YAML 寫法：

```yaml
apiVersion: networking.k8s.io/v1     # 注意：不是 apps/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: traefik           # k3s 用 traefik，minikube 用 nginx
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix          # Prefix = 前綴匹配（/ 開頭都符合）
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

**apiVersion 要注意**

| 資源類型 | apiVersion |
|----------|-----------|
| Pod、Service、ConfigMap | `v1` |
| Deployment、ReplicaSet | `apps/v1` |
| **Ingress** | **`networking.k8s.io/v1`** |

Ingress 不是 `apps/v1`，是 `networking.k8s.io/v1`，這個很容易寫錯。

**pathType 兩種模式：**

| pathType | 說明 | 範例 |
|----------|------|------|
| `Prefix` | 前綴匹配，最常用 | `/api` 可匹配 `/api/users`、`/api/orders` |
| `Exact` | 精確匹配，完全一致才過 | `/api` 只匹配 `/api`，`/api/users` 不匹配 |

生產環境幾乎都用 `Prefix`，因為 API 路徑通常有很多層。

---

📄 6-2 第 5 張

**Host-based Routing（域名路由）**

進階用法：不同域名導到不同 Service。

```
http://www.myapp.local     → frontend-svc
http://api.myapp.local     → api-svc
```

YAML 寫法：

```yaml
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

差別在於多了 `host:` 欄位。有 `host` 的時候，只有 HTTP 請求的 Host header 符合的才會被這條規則處理。

**本地測試怎麼模擬域名？**

DNS 要指向你的 Node IP，本地開發用 `/etc/hosts` 模擬：
```
192.168.64.10  www.myapp.local api.myapp.local
```
正式環境就是在 DNS 服務商那邊把域名指向 Node IP 或 LoadBalancer IP。

---

📄 6-2 第 6 張

**TLS/HTTPS 簡介**

Ingress 支援 TLS，讓你的服務可以用 HTTPS。概念：
1. 把 TLS 憑證存進 K8s Secret
2. Ingress YAML 裡的 `tls:` 欄位指向那個 Secret

```yaml
spec:
  tls:
    - hosts:
        - myapp.com
      secretName: myapp-tls-secret    # Secret 裡存著憑證和私鑰
  rules:
    - host: myapp.com
      ...
```

實際生產環境通常用 **cert-manager** 自動申請和更新 Let's Encrypt 憑證，不需要手動管理。這堂課不會做 TLS 實作，知道概念就好。

---

### ② 所有指令＋講解

本節以概念為主，指令集中於 6-3 實作。

---

### ③ 題目

1. NodePort 有哪五個致命問題？Ingress 怎麼解決這些問題？
2. Ingress 和 Ingress Controller 各自的職責是什麼？少了哪一個會怎樣？
3. 以下 YAML 有一個錯誤，找出來並說明原因：
   ```yaml
   apiVersion: apps/v1
   kind: Ingress
   metadata:
     name: my-ingress
   spec:
     ingressClassName: traefik
     rules:
       - http:
           paths:
             - path: /
               backend:
                 service:
                   name: frontend-svc
                   port:
                     number: 80
   ```
4. `pathType: Prefix` 和 `pathType: Exact` 的差別是什麼？各適合什麼場景？

---

### ④ 解答

1. NodePort 的五個問題：Port 醜（30080 這種數字）、Port 有限（只能 30000–32767）、沒有域名（要記 IP）、沒有 HTTPS、每個服務一個 Port（10 個服務 10 個 Port）。Ingress 解法：一個 Ingress Controller 監聽 80/443，根據域名和路徑把流量分發到不同 Service，使用者只看到正常的域名。

2. Ingress 是 YAML 規則（路由地圖），定義哪個路徑或域名對應哪個 Service，本身不處理請求。Ingress Controller 是真正跑在叢集裡的 Pod（如 Traefik、Nginx），讀取 Ingress 規則並實際路由流量。少了 Ingress Controller，Ingress YAML apply 進去後沒有任何效果，流量不會被路由。少了 Ingress YAML，Controller 不知道要把流量導去哪裡。

3. 兩個錯誤：
   - `apiVersion` 應該是 `networking.k8s.io/v1`，不是 `apps/v1`
   - 每個 path 缺少 `pathType` 欄位（必填），apply 時會報 validation error

4. `Prefix` 是前綴匹配，`/api` 可以匹配 `/api`、`/api/users`、`/api/orders/123` 等所有以 `/api` 開頭的路徑，適合 API 路由。`Exact` 是精確匹配，`/api` 只匹配 `/api` 本身，`/api/` 或 `/api/anything` 都不匹配，適合需要嚴格控制的特殊端點（如 `/health`、`/metrics`）。

---

## 6-3 Ingress 實作（~15 min）

### ① 課程內容

📄 6-3 第 1 張

**實作流程**

1. 確認 Traefik 已在跑
2. 用 `ingress-basic.yaml` 部署兩個服務 + Path-based Ingress
3. 用 `curl` 驗證路由正確
4. 改用 `ingress-host.yaml` 做 Host-based routing
5. 設 `/etc/hosts`，用域名 curl 驗證
6. 學排錯技巧

**Lab 架構**

```
curl http://<NODE-IP>/         → frontend-deploy (nginx)  → frontend-svc (ClusterIP:80)
curl http://<NODE-IP>/api      → api-deploy (httpd)        → api-svc (ClusterIP:3000)
```

`ingress-basic.yaml` 裡面一次定義了：
- `frontend-deploy`：Nginx Deployment（模擬前端）
- `frontend-svc`：ClusterIP Service，port 80
- `api-deploy`：httpd Deployment（模擬 API）
- `api-svc`：ClusterIP Service，port 3000
- `app-ingress`：Ingress 路由規則

兩個 Service 都是 **ClusterIP**（不是 NodePort），外部無法直接存取，要靠 Ingress Controller 代為路由。這是 Ingress 的正確用法。

---

📄 6-3 第 2 張

**完整 ingress-basic.yaml**

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

---

📄 6-3 第 3 張

**完整 ingress-host.yaml**

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

---

### ② 所有指令＋講解

---

**確認 Traefik 在跑**

```bash
kubectl get pods -n kube-system | grep traefik
```

- `get pods -n kube-system`：列出 `kube-system` namespace 的 Pod（系統元件都在這）
- `| grep traefik`：篩選出含 "traefik" 字串的行

預期輸出：
```
NAME                                      READY   STATUS    RESTARTS   AGE
traefik-7d9f5b8c4d-abc12                  1/1     Running   0          2d
```

欄位說明：
- `READY 1/1`：Traefik Pod 健康，Ingress Controller 正常運作
- `STATUS Running`：在跑

異常狀況：
- 完全沒有輸出 → k3s 沒有正確安裝，或 Traefik 被停用
- STATUS 是 `CrashLoopBackOff` → `kubectl logs -n kube-system <traefik-pod-name>` 看原因

---

**部署所有資源**

```bash
kubectl apply -f ingress-basic.yaml
```

- `apply -f`：宣告式套用，一次把 YAML 裡所有資源（Deployment、Service、Ingress）都建起來

預期輸出：
```
deployment.apps/frontend-deploy created
service/frontend-svc created
deployment.apps/api-deploy created
service/api-svc created
ingress.networking.k8s.io/app-ingress created
```

每一行都要看到 `created`。如果出現 `error`，先看錯誤訊息，通常是 YAML 格式問題或 apiVersion 寫錯。

---

**確認 Deployment 狀態**

```bash
kubectl get deployments
```

預期輸出：
```
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
api-deploy        1/1     1            1           30s
frontend-deploy   1/1     1            1           30s
```

欄位說明：
- `READY 1/1`：Pod 數量符合預期，容器已就緒

異常狀況：
- READY 是 `0/1` 一直等不到 → `kubectl describe deployment <name>` 看 Events
- 可能是 image pull 失敗（網路問題）或 YAML 設定錯誤

---

**確認 Service 狀態**

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

欄位說明：
- `TYPE ClusterIP`：確認兩個 Service 都是 ClusterIP，沒有對外暴露（由 Ingress 統一對外）
- `EXTERNAL-IP <none>`：正常，ClusterIP 不對外

---

**確認 Ingress 狀態**

```bash
kubectl get ingress
```

- `get ingress`：縮寫 `kubectl get ing`

預期輸出：
```
NAME          CLASS     HOSTS   ADDRESS         PORTS   AGE
app-ingress   traefik   *       192.168.64.10   80      1m
```

欄位說明：
- `CLASS traefik`：確認使用 Traefik Ingress Controller
- `HOSTS *`：`*` 表示沒有限定 host，所有域名（或直接用 IP）都符合
- `ADDRESS`：Traefik Controller 的 IP（就是你等等要 curl 的 IP）
- `PORTS 80`：監聽 HTTP 80 port

異常狀況：
- `ADDRESS` 欄位空白 → Traefik 還沒分配 IP 或 Traefik 沒跑起來

---

**查看 Ingress 路由規則詳情**

```bash
kubectl describe ingress app-ingress
```

預期輸出（關鍵區塊）：
```
Name:             app-ingress
Namespace:        default
Ingress Class:    traefik
Rules:
  Host        Path    Backends
  ----        ----    --------
  *
              /       frontend-svc:80 (10.42.1.5:80)
              /api    api-svc:3000 (10.42.2.6:80)
Events:       <none>
```

重點欄位：
- `Rules` 區塊：確認路由規則正確
- `Backends` 欄位：括號裡是 Pod 的 IP，代表 Service 已找到後端 Pod
- 如果 Backend 顯示 `<error>` 或空白 → Service 找不到 Pod（selector 設定可能有問題）

---

**取得 Node IP**

```bash
kubectl get nodes -o wide
```

- `-o wide`：顯示更多欄位，包含 INTERNAL-IP

預期輸出：
```
NAME         STATUS   ROLES                  AGE   VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE
k3s-master   Ready    control-plane,master   2d    v1.28.5   192.168.64.10   <none>        Ubuntu 22.04
k3s-worker1  Ready    <none>                 2d    v1.28.5   192.168.64.11   <none>        Ubuntu 22.04
```

欄位說明：
- `INTERNAL-IP`：Node 在叢集網路的 IP，等等 curl 用這個
- k3s 的 Traefik 會在所有 Node 的 80 port 監聽，用哪個 Node IP 都可以

---

**測試 Path-based Routing**

```bash
curl http://<NODE-IP>/
```

把 `<NODE-IP>` 換成剛才查到的 INTERNAL-IP，例如 `192.168.64.10`。

預期輸出：
```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

看到 Nginx 歡迎頁代表前端路由正確。

```bash
curl http://<NODE-IP>/api
```

預期輸出：
```html
<html><body><h1>It works!</h1></body></html>
```

看到 Apache httpd 的 "It works!" 代表 `/api` 路由正確，請求被導到 api-svc。

---

**改用 Host-based Routing**

```bash
kubectl apply -f ingress-host.yaml
```

預期輸出：
```
ingress.networking.k8s.io/app-ingress-host created
```

---

**設定本地 DNS（/etc/hosts）**

```bash
sudo sh -c 'echo "192.168.64.10 www.myapp.local api.myapp.local" >> /etc/hosts'
```

- `sudo sh -c '...'`：整個指令用 sudo 執行（`>>` 重導向也需要 root 權限）
- `>>` 是**追加**，不是覆蓋（`>` 會蓋掉整個 /etc/hosts，會出大事）
- 把 `192.168.64.10` 換成你的 Node INTERNAL-IP

設定後驗證：
```bash
grep myapp.local /etc/hosts
```

預期輸出：
```
192.168.64.10  www.myapp.local api.myapp.local
```

---

**測試 Host-based Routing**

```bash
curl http://www.myapp.local
```

預期輸出：
```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

```bash
curl http://api.myapp.local
```

預期輸出：
```html
<html><body><h1>It works!</h1></body></html>
```

兩個域名分別導到不同的後端 Service，Host-based routing 生效。

---

**排錯指令組合**

出問題時依序查：

```bash
# 1. 看 Ingress Events
kubectl describe ingress app-ingress
```

重點看 `Events` 區塊和 `Backends` 欄位是否有 Pod IP。

```bash
# 2. 確認 Service 有後端 Pod
kubectl get endpoints
```

預期輸出：
```
NAME           ENDPOINTS           AGE
api-svc        10.42.2.6:80        5m
frontend-svc   10.42.1.5:80        5m
kubernetes     192.168.64.10:6443  2d
```

- `ENDPOINTS` 欄位有 IP → Service 正確找到 Pod
- `ENDPOINTS <none>` → Service selector 和 Pod label 不符，Pod 找不到

```bash
# 3. 看 Traefik Controller 日誌
kubectl logs -n kube-system <traefik-pod-name>
```

把 `<traefik-pod-name>` 換成第一步查到的 Traefik Pod 名稱，例如 `traefik-7d9f5b8c4d-abc12`。

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
# 新增 shop-deploy 和 shop-svc（加到 ingress-basic.yaml 或另存新檔）
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

修改 `app-ingress`，加入 `/shop` 路由：

```yaml
# 在 spec.rules[0].http.paths 下新增
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

# 如果兩者不符，修改 Service YAML 的 selector 或 Deployment 的 template.labels
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

```yaml
# ingress-host.yaml 新增第三條 host 規則
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
