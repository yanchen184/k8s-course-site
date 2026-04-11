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

```bash
kubectl get pods -n kube-system | grep traefik
```

確認 Traefik Ingress Controller 有在跑。k3s 預設內建，看到 `1/1 Running` 就可以繼續。

```bash
kubectl get nodes -o wide
```

記下 `INTERNAL-IP`，等等 curl 用這個。

---

### ③ QA

**Q：Ingress 和 Ingress Controller 有什麼差？少了哪一個會怎樣？**

A：Ingress 是你寫的 YAML 規則（路由地圖），定義哪個路徑或域名導到哪個 Service，本身不處理任何請求。Ingress Controller 是真正跑在叢集裡的 Pod（我們用 Traefik），讀取 Ingress 規則後實際路由流量。少了 Controller，Ingress apply 進去沒有任何效果；少了 Ingress YAML，Controller 不知道要把流量導哪裡。

**Q：k3s 和 minikube 的 Ingress Controller 有什麼不同？**

A：k3s 預設內建 Traefik，`ingressClassName` 要填 `traefik`，不需要額外安裝。minikube 預設沒有，要 `minikube addons enable ingress` 啟用 Nginx Ingress Controller，`ingressClassName` 填 `nginx`。

---

### ④ 學員實作

無（概念引入節）

### ⑤ 學員實作解答

無

---

## 6-3 Ingress 實作（~20 min）

### ① 課程內容

📄 6-3 第 1 張

這節做兩件事：

1. **Path-based Routing**：`ingress-basic.yaml`，部署前端 + API + Ingress，用路徑區分（`/` vs `/api`）
2. **Host-based Routing**：`ingress-host.yaml`，用域名區分（`www.myapp.local` vs `api.myapp.local`）

兩個 Service 都是 ClusterIP，外部無法直接連，由 Ingress Controller 統一對外。

---

📄 6-3 第 2 張

**學員實作說明**

完成 Path Routing 示範後，自己加一個 `/shop` 路由。

---

### ② 所有指令＋講解

**Step 1：確認 Ingress Controller 在跑**

```bash
kubectl get pods -n kube-system | grep traefik
```

- `-n kube-system`：K8s 系統元件都跑在這個 namespace
- `| grep traefik`：篩出 Traefik Pod

預期輸出：
```
traefik-7d9f5b8c4d-abc12   1/1   Running   0   2d
```

`READY 1/1`、`STATUS Running`：可以繼續。沒有輸出 → k3s 沒裝好；`CrashLoopBackOff` → `kubectl logs -n kube-system <pod-name>` 看原因。

---

**Step 2：部署 ingress-basic.yaml**

先看 YAML 的 Ingress 部分重點：

```yaml
apiVersion: networking.k8s.io/v1    # 注意：不是 apps/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: traefik          # k3s 用 traefik，minikube 用 nginx
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix         # 前綴匹配，/ 開頭都符合
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
          - path: /api
            pathType: Prefix         # /api、/api/users 都符合
            backend:
              service:
                name: api-svc
                port:
                  number: 3000
```

**`apiVersion: networking.k8s.io/v1`** — Ingress 不是 `apps/v1`。記住這個表格：

| 資源 | apiVersion |
|------|-----------|
| Pod、Service、ConfigMap | `v1` |
| Deployment | `apps/v1` |
| **Ingress** | **`networking.k8s.io/v1`** |

**`pathType: Prefix`** — 前綴匹配，`/api` 可以匹配 `/api/users`、`/api/orders`。要精確匹配改成 `Exact`。

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

---

**Step 3：確認狀態**

```bash
kubectl get deployments
kubectl get svc
```

兩個 Service 要是 `ClusterIP`，`EXTERNAL-IP <none>` 是正常的。

```bash
kubectl get ingress
```

預期輸出：
```
NAME          CLASS     HOSTS   ADDRESS         PORTS   AGE
app-ingress   traefik   *       192.168.64.10   80      1m
```

- `HOSTS *`：沒有限定域名，用 IP 直接連也可以
- `ADDRESS`：Traefik 的 IP，等等 curl 用這個
- `ADDRESS` 空白 → Traefik 還沒分配 IP，等幾秒

```bash
kubectl describe ingress app-ingress
```

看 `Rules` 區塊裡 `Backends` 括號有 Pod IP → Service 正確找到後端 Pod。

---

**Step 4：驗證 Path-based Routing**

```bash
kubectl get nodes -o wide    # 看 INTERNAL-IP
curl http://<NODE-IP>/       # → Nginx 歡迎頁
curl http://<NODE-IP>/api    # → It works!
```

---

**Step 5：Host-based Routing**

`ingress-host.yaml` 和 `ingress-basic.yaml` 差一個 `host:` 欄位：

```yaml
rules:
  - host: www.myapp.local    # 只有 Host header 是這個才處理
    http:
      paths:
        - path: /
          ...
  - host: api.myapp.local
    http:
      paths:
        - path: /
          ...
```

```bash
kubectl apply -f ingress-host.yaml
```

模擬 DNS（正式環境在 DNS 服務商設定，本地用 `/etc/hosts`）：

```bash
sudo sh -c 'echo "192.168.64.10 www.myapp.local api.myapp.local" >> /etc/hosts'
grep myapp.local /etc/hosts    # 確認加進去了
```

注意：用 `>>` 追加，絕對不要用 `>`（會覆蓋整個 /etc/hosts）。

```bash
curl http://www.myapp.local    # → Nginx 歡迎頁
curl http://api.myapp.local    # → It works!
```

---

**排錯**

```bash
kubectl describe ingress app-ingress    # 看 Events + Backends
kubectl get endpoints                   # ENDPOINTS <none> → label 不符
kubectl logs -n kube-system <traefik-pod>
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| `/etc/hosts` 忘記加 | `Could not resolve host` | `grep myapp.local /etc/hosts` |
| `ingressClassName` 寫錯 | curl 無回應 | k3s 填 `traefik` |
| `pathType` 沒填 | apply 報 validation error | 每個 path 必填 |

---

### ③ QA

**Q：為什麼兩個 Service 用 ClusterIP 而不是 NodePort？**

A：有 Ingress 了，外部流量由 Ingress Controller 統一接管，再轉給 ClusterIP Service。Service 不需要自己對外開 Port，更安全，也不用記一堆不同的 Port 號。

**Q：`pathType: Prefix` 和 `Exact` 差在哪？**

A：`Prefix` 前綴匹配，`/api` 可以匹配 `/api`、`/api/users`、`/api/v1/orders`，API 路由幾乎都用這個。`Exact` 精確匹配，`/api` 只匹配 `/api` 本身，`/api/` 或 `/api/anything` 都不匹配，適合需要嚴格控制的端點。

---

### ④ 學員實作

公司要加一個新服務 `shop-deploy`（image: httpd:2.4），要求：
1. 建 ClusterIP Service `shop-svc`，port 8080，targetPort 80
2. 在現有 `app-ingress` 加一條路由：`/shop` → `shop-svc:8080`
3. `curl http://<NODE-IP>/shop` 看到 `It works!`

挑戰：在 host-based routing 加第三個服務：
- 域名：`admin.myapp.local`
- 後端：`admin-deploy`（image: tomcat:10.1）+ `admin-svc`（port 8080）
- 在 `/etc/hosts` 加入，`curl http://admin.myapp.local` 驗證

---

### ⑤ 學員實作解答

**必做**

```yaml
# shop.yaml
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
        image: httpd:2.4
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

在 `ingress-basic.yaml` 的 `paths` 下加：

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
kubectl apply -f shop.yaml
kubectl apply -f ingress-basic.yaml
curl http://<NODE-IP>/shop    # → It works!
```

**挑戰**

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

在 `ingress-host.yaml` 加：

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
sudo sh -c 'echo "192.168.64.10 admin.myapp.local" >> /etc/hosts'
curl http://admin.myapp.local    # Tomcat 啟動較慢，等 30 秒
```

---

## 6-4 回頭操作 Loop 1（~5 min）

### ① 課程內容

📄 6-4 第 1 張

回頭確認學員環境都 OK，帶做三個坑的排查，清理環境，銜接下一個主題。

---

### ② 所有指令＋講解

**確認整體狀態**

```bash
kubectl get all
kubectl get ingress
```

**排查三個坑**

坑 1：`/etc/hosts` 沒加
```bash
grep myapp.local /etc/hosts
```

坑 2：`ingressClassName` 寫成 `nginx`
```bash
kubectl get ingress    # 看 CLASS 欄位是否是 traefik
```

坑 3：`pathType` 沒填
```bash
kubectl describe ingress app-ingress    # 看 Events 有無 validation error
```

**清理**

```bash
kubectl delete -f ingress-basic.yaml
kubectl delete -f ingress-host.yaml
kubectl get all    # 確認只剩 kubernetes Service
```

**銜接**

Ingress 解決了域名和路由的問題。但 API 服務要連 DB，密碼怎麼辦？

```yaml
env:
  - name: DB_PASSWORD
    value: "my-super-secret-password"    # ← 寫死在 YAML，推到 Git 全世界都看到
```

下一段：ConfigMap 和 Secret。

---

### ③ QA

**Q：如果有工程師說 `kubectl delete -f` 和 `kubectl apply -f` 的意思是什麼，怎麼回答？**

A：`apply -f` 是宣告式套用，YAML 裡的資源不存在就建，已存在就更新。`delete -f` 是刪除 YAML 裡定義的所有資源，等於把整包東西一次清掉，不用逐一指定資源名稱。

---

### ④ 學員實作

確認自己的環境清乾淨：

```bash
kubectl get all
kubectl get ingress
```

確認只剩 `service/kubernetes`，沒有其他資源。

---

### ⑤ 學員實作解答

若還有殘留資源：

```bash
kubectl delete deployment frontend-deploy api-deploy
kubectl delete svc frontend-svc api-svc
kubectl delete ingress app-ingress app-ingress-host
```
