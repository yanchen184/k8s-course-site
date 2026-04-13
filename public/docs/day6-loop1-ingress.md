# Day 6 Loop 1 — Ingress

---

## 6-2 Ingress 概念（~5 min）

### ① 課程內容

📄 6-2 第 1 張

上堂課做了 NodePort，讓外部可以連進來。但連線網址長這樣：`http://192.168.1.100:30080`。這個給使用者用？不行。

我們要的是 `https://myapp.com`，標準的 80/443，用域名不用記 IP。

先說清楚今天練什麼、不練什麼。

Ingress 解決的是**叢集內部的路由問題**：一個 IP 進來，怎麼分給不同的 Service。「全世界的人打網址連進來」需要額外兩件事：公網 IP（雲端或自建機房），和真實域名（去 DNS 商買）。這兩件事不在今天範圍。今天練的是地基，有了這個，之後接公網 IP 才有意義。

80 和 443 是 HTTP/HTTPS 的標準 port。瀏覽器的規則是：你打 `http://myapp.com`，瀏覽器自動連 port 80；你打 `https://myapp.com`，自動連 port 443。這兩個 port 不用寫出來，瀏覽器知道預設就是這個。

NodePort 給你的是 30000–32767 這個範圍，沒辦法用標準 port。所以用戶要記一個奇怪的網址：`http://192.168.1.100:30080`。這不是正常網站該有的樣子。

這個問題，Docker 時代用 Nginx 反向代理來解。K8s 的等價解法叫 **Ingress**。

Ingress 是兩個東西，要分清楚。

第一個是 **Ingress YAML**，就是一份路由規則：`/api` 導去哪個 Service、`www.myapp.local` 導去哪個 Service。這份 YAML 本身只是設定，不會做任何事。

第二個是 **Ingress Controller**，一個真正跑在叢集裡的 Pod，持續監聽 80/443。每次有請求進來，它就查你寫的那份 YAML，決定流量要轉去哪個 Service。

規則表本身不會接電話，要有 Controller 拿著表才有用。

常見的 Ingress Controller 有 Nginx、Traefik、HAProxy，標準 K8s 不內建，要自己裝。k3s 預設幫你裝好 **Traefik**，所以我們直接用，不用額外設定。

好，直接開始做。

---

📄 6-2 第 2 張

**今天的實作目標**

```
使用者輸入 http://<NODE-IP>/       → 前端（nginx）
使用者輸入 http://<NODE-IP>/api    → API（http-echo）
使用者輸入 http://www.myapp.local  → 前端（nginx）
使用者輸入 http://api.myapp.local  → API（http-echo）
```

一個 IP、標準 80 Port，用路徑或域名區分不同服務。NodePort 再見。

---

📄 6-2 第 3 張

**兩種路由方式 + YAML 結構**

| 方式 | URL 範例 | 適合場景 |
|------|---------|---------|
| Path-based | `myapp.com/` + `myapp.com/api` | 前後端同域名 |
| Host-based | `www.myapp.com` + `api.myapp.com` | 微服務各有域名 |

Ingress 的 `apiVersion` 是 `networking.k8s.io/v1`，不是 `apps/v1`。記住這張表：

| 資源 | apiVersion |
|------|-----------|
| Pod、Service、ConfigMap | `v1` |
| Deployment | `apps/v1` |
| **Ingress** | **`networking.k8s.io/v1`** |

Docker 時代你自己寫 nginx.conf，K8s 用 Ingress YAML；Docker 跑 Nginx 容器，K8s 用 Ingress Controller Pod。做的事情一樣，整合進叢集之後不用手動 reload，Service 變了路由自動更新。

---

## 6-3 Ingress 實作（~20 min）

### ② 所有指令＋講解

**Step 1：確認 Ingress Controller 在跑**

```bash
kubectl get pods -n kube-system | grep traefik
```

- `-n kube-system`：namespace 是 K8s 用來隔離資源的空間，就像資料夾。系統元件都跑在 `kube-system` 這個 namespace，你自己建的資源預設在 `default`
- `| grep traefik`：篩出 Traefik Pod

預期輸出：
```
traefik-7d9f5b8c4d-abc12   1/1   Running   0   2d
```

`READY 1/1`、`STATUS Running`：可以繼續。沒有輸出 → k3s 沒裝好；`CrashLoopBackOff` → `kubectl logs -n kube-system <pod-name>` 看原因。

你會同時看到另外兩個東西：

```bash
kubectl get pods -n kube-system
```

```
svclb-traefik-xxxxxxxx   2/2   Running   0   2d
traefik-7d9f5b8c4d-abc12   1/1   Running   0   2d
```

`svclb-traefik` 是 k3s 內建的 **Klipper Load Balancer**，這是 k3s 特有的元件。

標準 K8s 沒有 LoadBalancer 實作，建 LoadBalancer 型 Service 要靠雲端平台（AWS、GCP）提供真實的 Load Balancer。k3s 在地端環境沒有雲端，所以內建了 Klipper——它用 DaemonSet 在每個 Node 上跑一個 Pod，把 Node 的 80/443 port 接到 Traefik Service，讓 Traefik 能監聽標準 port。

```bash
kubectl get svc -n kube-system | grep traefik
```

```
traefik   LoadBalancer   10.43.x.x   192.168.x.x   80:xxxxx/TCP,443:xxxxx/TCP   2d
```

`EXTERNAL-IP` 就是你 VM 的 IP，等等 curl 用這個。

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

> API 後端用 `hashicorp/http-echo`，這個 image 會直接回傳你指定的文字，不需要額外設定路徑，適合教學示範。啟動時加 `-text="API Server"` 引數，任何路徑都回同一個字串。

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
curl http://<NODE-IP>/api    # → API Server
```

> k3d 環境：NODE-IP 是 Docker 內部 IP，需改用 `localhost:8080`（k3d 預設 port mapping）

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

這裡的 `host:` 欄位對應的是 HTTP 請求裡的 Host header。瀏覽器打一個域名時，會自動在請求裡帶上 `Host: www.myapp.local`，Ingress Controller 就靠這個欄位判斷要走哪條規則。等一下用 curl 測試時，如果不是透過 `/etc/hosts` 解析，就要手動加 `-H "Host: www.myapp.local"` 才會被正確路由。

```bash
kubectl apply -f ingress-host.yaml
```

`/etc/hosts` 是 Linux 的本機 DNS 覆蓋檔。系統在查 DNS 之前，會先查這個檔案。你在裡面加一行 `IP 域名`，這台機器就會把這個域名解析成你指定的 IP，不影響其他機器，只有這台有效。正式環境在 DNS 服務商設定，本地測試用 `/etc/hosts` 模擬：

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

**Q：Ingress 和 Ingress Controller 有什麼差？少了哪一個會怎樣？**

A：Ingress 是你寫的 YAML 規則（路由地圖），定義哪個路徑或域名導到哪個 Service，本身不處理任何請求。Ingress Controller 是真正跑在叢集裡的 Pod（我們用 Traefik），讀取 Ingress 規則後實際路由流量。少了 Controller，Ingress apply 進去沒有任何效果；少了 Ingress YAML，Controller 不知道要把流量導哪裡。

**Q：為什麼兩個 Service 用 ClusterIP 而不是 NodePort？**

A：有 Ingress 了，外部流量由 Ingress Controller 統一接管，再轉給 ClusterIP Service。Service 不需要自己對外開 Port，更安全，也不用記一堆不同的 Port 號。

**Q：`pathType: Prefix` 和 `Exact` 差在哪？**

A：`Prefix` 前綴匹配，`/api` 可以匹配 `/api`、`/api/users`、`/api/v1/orders`，API 路由幾乎都用這個。`Exact` 精確匹配，`/api` 只匹配 `/api` 本身，`/api/` 或 `/api/anything` 都不匹配，適合需要嚴格控制的端點。

**Q：k3s 和 minikube 的 Ingress Controller 有什麼不同？**

A：k3s 預設內建 Traefik，`ingressClassName` 要填 `traefik`，不需要額外安裝。minikube 預設沒有，要 `minikube addons enable ingress` 啟用 Nginx Ingress Controller，`ingressClassName` 填 `nginx`。

**Q：練習用 `/etc/hosts`，正式環境怎麼讓全世界的人連進來？**

A：三件事。第一，買真實域名，在 DNS 商後台加一筆 A Record 指向你叢集的公網 IP。第二，取得公網 IP——雲端建 LoadBalancer 型 Service 平台會自動給；地端要設路由器 Port Forwarding 或裝 MetalLB。第三，Ingress Controller 的角色沒變，還是同一個 Traefik，只是現在接的是來自世界各地的真實請求，不是你自己的 curl。

`/etc/hosts` 就是在自己門牌貼一張貼紙寫「總統府」，只有你自己信。DNS 是去戶政事務所登記，全世界的 GPS 才會找到你。

---

## 加碼示範：讓全世界真的連進來

### Demo A — ngrok（5 分鐘，不需要域名）

ngrok 是一個打洞工具。一個指令，它幫你在本機和外網之間開一條隧道，給你一個公網 URL，全世界都能連。不需要買域名、不需要設定 DNS、不需要公網 IP。

**安裝**

```bash
# macOS
brew install ngrok

# Ubuntu/Debian
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

去 [ngrok.com](https://ngrok.com) 免費註冊，拿到 authtoken 後設定一次：

```bash
ngrok config add-authtoken <your-token>
```

**打洞**

k3s 的 Traefik 直接監聽 Node 的 80 port，所以直接打 80：

```bash
ngrok http 80
```

輸出：
```
Forwarding   https://cf11-118-166-0-33.ngrok-free.app -> http://localhost:80
```

現在任何人打開 `https://cf11-118-166-0-33.ngrok-free.app`，流量就進來了。

```bash
# 驗證兩條路由都通
curl -H "ngrok-skip-browser-warning: true" https://cf11-xxx.ngrok-free.app/
curl -H "ngrok-skip-browser-warning: true" https://cf11-xxx.ngrok-free.app/api
```

> `-H "ngrok-skip-browser-warning: true"`：ngrok 免費版瀏覽器直接開會看到一個警告頁，curl 加這個 header 跳過它，直接打到後端。

**限制**：免費版每次重啟 URL 都會變，只能跑 1 個 session，有流量上限。夠教學示範用。

---

### Demo B — DuckDNS（免費域名，長期有效）

ngrok 的 URL 是隨機字串，而且重啟就換。如果你想要一個固定的、真實的域名（`yourname.duckdns.org`），用 DuckDNS。

**DuckDNS** 是免費的動態 DNS 服務，給你一個 `yourname.duckdns.org` 子域名，可以指向任何 IP，永久免費。

**Step 1：申請域名**

去 [duckdns.org](https://duckdns.org)，用 GitHub 帳號登入，在 domains 欄位輸入想要的名字，按 **add domain**。

你會拿到：
- 域名：`yourname.duckdns.org`
- token：一串 UUID（頁面上方顯示）

**Step 2：把域名指向你的 VM IP**

```bash
# 查 VM 的 IP
kubectl get nodes -o wide    # 看 INTERNAL-IP，例如 192.168.64.10

# 更新 DuckDNS 指向
curl "https://www.duckdns.org/update?domains=yourname&token=your-token&ip=192.168.64.10"
```

回傳 `OK` 表示成功。

**Step 3：確認 DNS 解析**

```bash
dig +short yourname.duckdns.org
# 應該回傳 192.168.64.10
```

**Step 4：用域名連進來**

```bash
curl http://yourname.duckdns.org/
curl http://yourname.duckdns.org/api
```

同一個 Traefik，同一份 Ingress YAML，現在用真實域名進來了。

> **這台 VM 在家裡內網的話**：DuckDNS 指向的是 192.168.x.x，這是內網 IP，只有同一個網路裡的機器能連。要讓外網連進來，還需要在路由器做 Port Forwarding（80/443 → VM IP），或用雲端機器。DuckDNS 本身沒有限制，只是幫你做 DNS 解析。

**Domain 更新小工具（選用）**

如果你的 IP 會變，可以加一個 cron 定時更新：

```bash
# 每 5 分鐘自動更新 IP
echo "*/5 * * * * curl -s 'https://www.duckdns.org/update?domains=yourname&token=your-token&ip=' > /dev/null" | crontab -
```

---

## 6-4 回頭操作 Loop 1（~5 min）

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

**三個坑**

1. `/etc/hosts` 忘記加 → `grep myapp.local /etc/hosts` 確認
2. `ingressClassName` 填了 nginx → 改成 traefik
3. `pathType` 沒填 → 每個 path 必填，apply 會報 validation error

**清理**

```bash
kubectl delete -f ingress-basic.yaml
kubectl delete -f ingress-host.yaml
kubectl delete -f shop.yaml
kubectl get all    # 確認只剩 kubernetes Service
```
