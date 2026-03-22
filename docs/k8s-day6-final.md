# 第六堂 — Ingress + 配置管理 + 資料持久化（完整投影片 + 逐字稿）

> 45 頁投影片，含 PPT 提詞內容 + 可直接念的逐字稿
> 對象：已完成第五堂（Service + DNS + Namespace）的容器初學者
> 故事線：NodePort 太醜 → Ingress 用域名 → 設定寫死在 Image → ConfigMap/Secret 分離 → 資料會消失 → PV/PVC → 有狀態應用 → StatefulSet → YAML 太多 → Helm

---

## 第 1 頁 | 開場 + 回顧（5min）

### PPT 上的內容

**第五堂我們學了什麼**

| 主題 | 一句話 |
|:---:|---------|
| k3s 多節點 | 1 Master + 2 Worker，真正的叢集 |
| Deployment | 管副本 + 自我修復 + 滾動更新 |
| Service | ClusterIP（內部）/ NodePort（外部）讓 Pod 被連到 |
| DNS | `<service>.<namespace>.svc.cluster.local` 用名字連 |
| Namespace | dev / staging / prod 環境隔離 |

**第五堂的反思問題：**
> 「使用者要輸入 `IP:30080` 才能連進來。生產環境怎麼讓使用者用 `myapp.com` 就能用？」

**→ 答案就是今天要學的：Ingress**

**今天的旅程：**

```
上午：Ingress（域名存取）→ ConfigMap（設定外部化）→ Secret（密碼管理）
下午：PV/PVC（資料持久化）→ StatefulSet（有狀態應用）→ Helm（套件管理）
```

### 逐字稿

歡迎回來！上一堂課我們做了很多事情。我們用 k3s 建了一個真正的多節點叢集 — 1 個 Master 加 2 個 Worker。然後我們把 Deployment 學透了：副本數維持、自我修復、滾動更新和回滾。接著學了 Service，ClusterIP 讓叢集內部的 Pod 互相連，NodePort 開一個 port 讓外面連進來。也學了 DNS — 在叢集裡面可以用服務名稱直接連，不用記 IP。最後學了 Namespace，把 dev、staging、prod 環境隔離開來。

上一堂結束的時候我留了個問題：「使用者要輸入 IP 加 Port 才能連進來，生產環境怎麼讓使用者用域名就能用？」大家有想到嗎？

答案就是今天要學的 Ingress。但 Ingress 只是今天的開胃菜。你想想看，你的 API 連進來了，但資料庫密碼還寫死在 YAML 裡面，推到 Git 就全世界都看到了；你的 Pod 跑 MySQL，Pod 一重啟資料就沒了。這些問題今天通通要解決。

今天的行程：上午先搞定 Ingress，讓使用者用域名連到你的服務。然後學 ConfigMap 和 Secret，把設定和密碼從程式碼裡抽出來。下午解決資料消失的問題 — PV、PVC、StatefulSet。最後用 Helm 一鍵部署複雜應用，不用再自己手寫一大堆 YAML。

內容很多，但每一個都會動手做。好，我們開始。

---

## 第 2 頁 | 痛點：NodePort 的問題（5min）

### PPT 上的內容

**回顧：上堂課用 NodePort 對外**

```
使用者 → http://192.168.1.100:30080 → NodePort Service → Pod
```

**生產環境的問題：**

| 問題 | 說明 |
|------|------|
| Port 醜 | 使用者要記 `:30080`，不專業 |
| Port 有限 | NodePort 範圍 30000-32767，最多幾百個 |
| 沒有域名 | 使用者要記 IP，換機器就連不到 |
| 沒有 HTTPS | 明文傳輸，不安全 |
| 每個服務一個 Port | 10 個服務 = 10 個 NodePort，管不動 |

**我們想要的：**

```
使用者 → https://myapp.com     → 前端
使用者 → https://api.myapp.com → API
```

**Docker 時代怎麼解決？→ Nginx 反向代理**

```nginx
server {
    server_name myapp.com;
    location / { proxy_pass http://frontend:80; }
}
server {
    server_name api.myapp.com;
    location / { proxy_pass http://api:3000; }
}
```

**K8s 的等價物 → Ingress**

### 逐字稿

好，先回顧一下上堂課的成果。我們用 NodePort Service 讓外部可以存取應用，使用者在瀏覽器輸入 `http://192.168.1.100:30080` 就能看到頁面。

但你把這個網址丟給你的主管看看？他一定會說：「這什麼東西？使用者要記 IP 加 Port？你在開玩笑嗎？」

NodePort 有幾個致命的問題。第一，Port 醜 — 30080 這種數字不是正常人會記的。第二，Port 有限 — NodePort 只能用 30000 到 32767 這個範圍，你有幾百個微服務怎麼辦？第三，沒有域名，使用者要記 IP 地址。第四，沒有 HTTPS。第五，每個服務要開一個 NodePort，10 個服務就是 10 個 Port，管理起來是噩夢。

我們想要的是什麼？使用者輸入 `https://myapp.com` 就到前端，輸入 `https://api.myapp.com` 就到 API。一個 IP、標準的 80/443 Port、用域名區分不同服務。

如果你之前用過 Docker，這個問題你怎麼解決的？沒錯，就是在前面放一台 Nginx 當反向代理。在 Nginx 設定檔裡面寫 `server_name` 和 `location`，根據域名和路徑把流量轉到不同的後端容器。

K8s 的 Ingress 做的事情完全一樣 — 它就是 K8s 世界裡的 Nginx 反向代理。但它比你自己手寫 Nginx 設定檔更強大，因為它跟 K8s 整合在一起，可以自動發現 Service、自動更新路由規則。

---

## 第 3 頁 | Ingress 架構（10min）

### PPT 上的內容

**Ingress 的兩個角色：**

```
                    ┌─── Ingress（規則）
                    │     定義「什麼域名 / 路徑 → 哪個 Service」
                    │
使用者 ──→ Ingress Controller ──→ Service A ──→ Pod
             │                ──→ Service B ──→ Pod
             │
             └─── Ingress Controller（執行者）
                   實際接收流量、執行路由規則的 Pod
                   常見：nginx-ingress、Traefik（k3s 內建）
```

**分清楚兩個東西：**

| 名稱 | 是什麼 | 類比 |
|------|--------|------|
| Ingress | YAML 規則定義（kind: Ingress） | Nginx 的設定檔 `nginx.conf` |
| Ingress Controller | 實際跑的 Pod，讀取 Ingress 規則並執行 | Nginx 程式本身 |

**→ 沒有 Ingress Controller，寫再多 Ingress 規則都沒用！**

**對照 Docker：**

| Docker | K8s |
|--------|-----|
| `nginx.conf` 設定檔 | Ingress YAML |
| Nginx 容器 | Ingress Controller Pod |
| `docker compose up nginx` | `helm install ingress-nginx` |

### 逐字稿

在開始寫 Ingress YAML 之前，有一個觀念一定要搞清楚：Ingress 其實分成兩個東西。

第一個叫 Ingress，注意它只是一份 YAML 規則。你在裡面寫：「`myapp.com` 這個域名，`/` 路徑導到 frontend-svc，`/api` 路徑導到 api-svc」。它只是規則，本身不會做任何事。

第二個叫 Ingress Controller，它是一個真的在跑的 Pod。它會去讀你寫的 Ingress 規則，然後實際接收外部流量、根據規則轉發到對應的 Service。常見的 Ingress Controller 有 nginx-ingress 和 Traefik。k3s 內建的就是 Traefik。

用 Docker 來對照：Ingress 就像 `nginx.conf` 設定檔，裡面寫路由規則。Ingress Controller 就像 Nginx 這個程式本身，負責讀設定檔然後執行。你不可能光有一個 `nginx.conf` 就期望它自己跑起來，對吧？你得有 Nginx 程式在跑才行。

同樣的道理，在 K8s 裡面，你不能光寫 Ingress YAML 就覺得搞定了。如果叢集裡沒有 Ingress Controller 在跑，你的 Ingress 規則就只是一份被忽略的 YAML，流量完全進不來。

k3s 幫我們省了一步 — 它安裝的時候就自動帶了 Traefik 當 Ingress Controller。如果你用的是 minikube，要自己 `minikube addons enable ingress` 來啟用 nginx-ingress。

---

## 第 4 頁 | Ingress YAML 拆解（10min）

### PPT 上的內容

**Path-based Routing 的 Ingress YAML：**

```yaml
apiVersion: networking.k8s.io/v1    # Ingress 用的 API 群組
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: nginx           # 指定用哪個 Ingress Controller
  rules:
    - http:
        paths:
          - path: /                 # 路徑 /
            pathType: Prefix        # 前綴匹配（/ 開頭的都算）
            backend:
              service:
                name: frontend-svc  # 導到哪個 Service
                port:
                  number: 80        # Service 的 Port

          - path: /api              # 路徑 /api
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 3000
```

**pathType 的差異：**

| pathType | `/api` 會匹配到... |
|----------|---------------------|
| `Prefix` | `/api`、`/api/`、`/api/users`、`/api/v2/data` |
| `Exact` | 只有 `/api`，其他都不匹配 |

**對照 Nginx：**

```nginx
# Nginx 設定檔                    # K8s Ingress YAML
location / {                       path: /
    proxy_pass frontend:80;            backend: frontend-svc:80
}
location /api {                    path: /api
    proxy_pass api:3000;               backend: api-svc:3000
}
```

### 逐字稿

來看 Ingress 的 YAML 怎麼寫。打開 `ingress-basic.yaml`，先看最後面的 Ingress 部分。

首先 `apiVersion` 是 `networking.k8s.io/v1`，注意跟 Deployment 的 `apps/v1` 不一樣，Ingress 屬於網路類的資源。`kind: Ingress`。

`spec` 裡面有一個 `ingressClassName`，這是告訴 K8s 要用哪個 Ingress Controller 來處理這條規則。如果你的叢集裡裝了好幾個 Controller，就用這個欄位來指定。k3s 用 `traefik`，nginx-ingress 用 `nginx`。

重點在 `rules` 裡面。每一條 rule 定義了路由規則。`paths` 是一個陣列，每個元素有三個東西：`path`（URL 路徑）、`pathType`（匹配方式）、`backend`（導向哪個 Service）。

我們這個範例有兩條路徑規則。`path: /` 導向 `frontend-svc` 的 port 80，`path: /api` 導向 `api-svc` 的 port 3000。

`pathType` 有兩個選項。`Prefix` 是前綴匹配，只要路徑以 `/api` 開頭的都算，包括 `/api/users`、`/api/v2/data`。`Exact` 是精確匹配，只有完全是 `/api` 才算，`/api/users` 就不匹配了。大部分情況用 `Prefix` 就對了。

對照 Nginx 來看，`path: /` 加 `backend: frontend-svc:80` 就等於 Nginx 的 `location / { proxy_pass frontend:80; }`。格式不一樣，但做的事情完全一樣。

---

## 第 5 頁 | 實作：Path-based Routing（15min）

### PPT 上的內容

**Lab 1：部署 Ingress + 驗證**

**Step 1：確認 Ingress Controller 在跑**
```bash
# k3s
kubectl get pods -n kube-system | grep traefik
# minikube
minikube addons enable ingress
```

**Step 2：部署**
```bash
kubectl apply -f ingress-basic.yaml
kubectl get ingress
kubectl describe ingress app-ingress
```

**Step 3：測試 path routing**
```bash
curl http://<NODE-IP>/        # → Nginx 歡迎頁（frontend）
curl http://<NODE-IP>/api     # → "Hello from API"（api）
```

**出問題了？排錯流程：**
```bash
kubectl describe ingress app-ingress   # 看 Events
kubectl get svc                        # 確認 Service 存在
kubectl get endpoints                  # 確認 Service 有 Endpoints
kubectl logs -n kube-system <traefik-pod>  # 看 Controller 日誌
```

### 逐字稿

好，講完了概念，馬上動手做。請大家打開終端機。

首先確認 Ingress Controller 有在跑。如果你用 k3s：

```
kubectl get pods -n kube-system | grep traefik
```

應該看到 Traefik 的 Pod 是 Running 狀態。如果你用 minikube，先跑 `minikube addons enable ingress`，然後 `kubectl get pods -n ingress-nginx`，等到 Pod 變成 Running。

Controller 確認了，來部署我們的應用和 Ingress 規則：

```
kubectl apply -f ingress-basic.yaml
```

這個檔案裡面包含了 frontend 的 Deployment 和 Service、API 的 Deployment 和 Service，還有 Ingress 規則。一次 apply 全部搞定。

查看 Ingress：

```
kubectl get ingress
```

你會看到 `app-ingress`，ADDRESS 欄位可能一開始是空的，等幾秒就會出現 IP。`describe` 看一下細節：

```
kubectl describe ingress app-ingress
```

Rules 那邊會列出你定義的路由規則。

現在來測試。先拿到 Node 的 IP，然後 curl：

```
curl http://<NODE-IP>/
```

應該看到 Nginx 的歡迎頁面。再試：

```
curl http://<NODE-IP>/api
```

應該看到 `Hello from API`。成功了！同一個 IP、同一個 Port（80），根據 URL 路徑的不同，流量被導到不同的 Service。這就是 Ingress 的威力。

如果沒成功，排錯流程跟之前一樣。`describe ingress` 看 Events 有沒有錯誤訊息。`kubectl get endpoints` 確認 Service 後面確實有 Pod。最後看 Ingress Controller 的日誌找線索。

---

## 第 6 頁 | Host-based Routing（10min）

### PPT 上的內容

**另一種路由方式：根據域名（Host）**

```yaml
spec:
  rules:
    - host: app.example.com      # 域名 1 → 前端
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80

    - host: api.example.com      # 域名 2 → API
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

**Path-based vs Host-based：**

| 方式 | URL 範例 | 適合 |
|------|----------|------|
| Path-based | `myapp.com/` + `myapp.com/api` | 前後端在同一個域名 |
| Host-based | `app.myapp.com` + `api.myapp.com` | 微服務各有自己的域名 |

**本地測試：修改 /etc/hosts**
```bash
echo "<NODE-IP> app.example.com api.example.com" >> /etc/hosts
curl http://app.example.com      # → 前端
curl http://api.example.com      # → API
```

### 逐字稿

剛才的 Path-based routing 是用 URL 路徑來區分。還有另一種方式是 Host-based routing — 用域名來區分。

`app.example.com` 導到前端，`api.example.com` 導到 API。跟 Nginx 裡面寫多個 `server_name` 是一模一樣的概念。

YAML 寫法很簡單，就是在 rules 裡面加上 `host` 欄位。每個 host 是一條獨立的規則。

什麼時候用 Path-based，什麼時候用 Host-based？如果你的前端和 API 是同一個應用的一部分，用 Path-based 就好，`myapp.com/` 是前端、`myapp.com/api` 是後端。但如果你是微服務架構，每個服務都是獨立的團隊在維護，那給每個服務一個獨立的域名比較乾淨，就用 Host-based。

我們來動手試試。先部署：

```
kubectl apply -f ingress-host.yaml
```

但有一個問題 — `app.example.com` 這個域名不存在，DNS 解析不到。在本地測試的話，我們修改 `/etc/hosts` 來模擬：

```
sudo sh -c 'echo "<NODE-IP> app.example.com api.example.com" >> /etc/hosts'
```

然後 curl 試試看：

```
curl http://app.example.com
curl http://api.example.com
```

兩個不同的域名，同一個 IP，但 Ingress Controller 根據 HTTP 請求裡的 Host header，把流量導到不同的 Service。

做完記得把 `/etc/hosts` 加的那行刪掉。

---

## 第 7 頁 | Ingress 進階：TLS 與 Annotations（10min）

### PPT 上的內容

**TLS / HTTPS 概念**

```yaml
spec:
  tls:
    - hosts:
        - app.example.com
      secretName: app-tls-secret   # 憑證存在 Secret 裡

  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
```

```bash
# 建立 TLS Secret（自簽憑證，學習用）
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout tls.key -out tls.crt \
  -subj "/CN=app.example.com"

kubectl create secret tls app-tls-secret \
  --cert=tls.crt --key=tls.key
```

**常用 Annotations：**

| Annotation | 功能 |
|-----------|------|
| `nginx.ingress.kubernetes.io/rewrite-target: /` | URL 重寫 |
| `nginx.ingress.kubernetes.io/ssl-redirect: "true"` | 強制 HTTPS |
| `nginx.ingress.kubernetes.io/proxy-body-size: "10m"` | 上傳檔案大小限制 |
| `cert-manager.io/cluster-issuer: letsencrypt` | 自動申請 Let's Encrypt 憑證 |

**→ 生產環境通常搭配 cert-manager 自動管理 HTTPS 憑證**

### 逐字稿

快速講一下 TLS。在生產環境，你的網站一定要走 HTTPS，不然瀏覽器會顯示「不安全」。

Ingress 支援 TLS，做法是把 SSL 憑證存在一個 Secret 裡面，然後在 Ingress YAML 的 `tls` 區塊指定要用哪個 Secret。這樣 Ingress Controller 就會用這個憑證來處理 HTTPS 連線。

建立 TLS Secret 的方式是用 `kubectl create secret tls`，把 `.crt` 和 `.key` 檔案傳進去。學習的時候可以用 `openssl` 自己簽一張憑證，但生產環境通常會搭配 cert-manager 這個工具，它可以自動幫你跟 Let's Encrypt 申請免費的 HTTPS 憑證，到期自動續約。非常好用，但今天先不深入，知道有這個東西就好。

另外提一下 Annotations。Ingress 有很多進階功能是透過 annotations 來控制的。比如 `rewrite-target` 可以做 URL 重寫，`ssl-redirect` 可以強制把 HTTP 請求轉到 HTTPS，`proxy-body-size` 可以設定上傳檔案的大小限制。這些 annotations 是跟 Ingress Controller 相關的，nginx-ingress 和 Traefik 的 annotations 名稱不一樣，用的時候要查對應的文件。

好，Ingress 的部分到這裡。你已經知道怎麼讓使用者用域名存取你的服務了。接下來我們要解決另一個問題 — 設定管理。

---

## 第 8 頁 | 痛點：設定寫死在 Image 裡（5min）

### PPT 上的內容

**場景：你的 API 需要連資料庫**

```dockerfile
# Dockerfile — 設定寫死在 Image 裡
FROM node:18
ENV DB_HOST=192.168.1.50
ENV DB_PORT=3306
ENV DB_PASSWORD=my-secret-pw
COPY . /app
CMD ["node", "server.js"]
```

**問題：**

| 問題 | 說明 |
|------|------|
| 環境不同 | dev 的 DB 跟 prod 的 DB 不一樣，要建兩個 Image？ |
| 密碼外洩 | 密碼寫在 Dockerfile 裡，push 到 Docker Hub 全世界看到 |
| 改設定要重建 | 改一個環境變數就要重新 build Image |

**Docker 的解法：**

```bash
# 用 -e 注入環境變數，不寫死在 Image 裡
docker run -e DB_HOST=192.168.1.50 \
           -e DB_PASSWORD=my-secret-pw \
           myapp
```

**K8s 的解法：**

| Docker | K8s | 用途 |
|--------|-----|------|
| `-e KEY=value` | **ConfigMap** | 一般設定（不敏感） |
| `-e PASSWORD=xxx` | **Secret** | 敏感資料（密碼、Key） |

### 逐字稿

好，Ingress 搞定了。現在使用者可以用域名連到你的服務。但我們來看看你的 Dockerfile 裡面有什麼問題。

假設你的 API 需要連資料庫。你可能在 Dockerfile 裡面寫了 `ENV DB_HOST=192.168.1.50`、`ENV DB_PASSWORD=my-secret-pw`。Build 成 Image，push 到 Docker Hub，完美。

完美個頭。

第一個問題：你的 dev 環境的資料庫 IP 跟 prod 環境的不一樣。你是要建兩個 Image 嗎？`myapp:dev` 和 `myapp:prod`？只是因為 IP 不一樣就要建兩個 Image？

第二個問題更嚴重：密碼寫在 Dockerfile 裡面。你把 Image push 到 Docker Hub，全世界的人都能看到你的資料庫密碼。恭喜你，你的資料庫被駭了。

第三個問題：改一個環境變數就要重新 build Image。每次改設定都要跑 CI/CD？太蠢了。

用 Docker 的經驗，你知道正確的做法是用 `-e` 在 run 的時候才注入環境變數，不要寫死在 Image 裡。K8s 的做法一模一樣，只是工具升級了 — 一般設定用 ConfigMap，敏感資料用 Secret。

---

## 第 9 頁 | ConfigMap 概念（10min）

### PPT 上的內容

**ConfigMap = K8s 版的環境變數管理器**

```
ConfigMap（存設定）──→ Pod（用設定）
  APP_ENV=production       env: APP_ENV=production
  LOG_LEVEL=info           env: LOG_LEVEL=info
  API_URL=http://api:3000  env: API_URL=http://api:3000
```

**三種建立方式：**

```bash
# 方式 1：指令 + literal
kubectl create configmap app-config \
  --from-literal=APP_ENV=production \
  --from-literal=LOG_LEVEL=info

# 方式 2：指令 + 檔案
kubectl create configmap nginx-conf \
  --from-file=nginx.conf

# 方式 3：YAML（宣告式）
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
```

**兩種注入方式：**

| 方式 | 用法 | 適合 |
|------|------|------|
| 環境變數 | `envFrom` / `env.valueFrom` | 簡單的 key-value 設定 |
| Volume 掛載 | `volumes` + `volumeMounts` | 設定檔（nginx.conf 等） |

### 逐字稿

ConfigMap，就是 K8s 版的環境變數管理器。你把設定集中存在一個 ConfigMap 物件裡，然後讓需要這些設定的 Pod 去引用它。

建立 ConfigMap 有三種方式。最快的是用指令加 `--from-literal`，直接在命令列寫 key=value。第二種是 `--from-file`，把一整個檔案（比如 nginx.conf）存進 ConfigMap，key 是檔案名稱，value 是檔案內容。第三種是寫 YAML，適合放在 Git 裡做版本管理。

建好之後怎麼讓 Pod 用？兩種方式。第一種是注入為環境變數，用 `envFrom` 可以把 ConfigMap 裡面所有的 key 一次全部變成環境變數。或者用 `env.valueFrom.configMapKeyRef` 逐一指定要哪幾個 key。

第二種是掛載為 Volume，ConfigMap 裡的每個 key 會變成一個檔案。這種方式適合用在設定檔，比如你要把 nginx.conf 掛進 Nginx 容器裡面。

用 Docker 的經驗來對照：`-e APP_ENV=production` 就等於 ConfigMap 的環境變數注入。`-v ./nginx.conf:/etc/nginx/nginx.conf` 就等於 ConfigMap 的 Volume 掛載。概念完全一樣，只是管理方式更結構化了。

---

## 第 10 頁 | 實作：ConfigMap 環境變數注入（15min）

### PPT 上的內容

**Lab 3：ConfigMap + 環境變數**

**Step 1：部署**
```bash
kubectl apply -f configmap-literal.yaml
```

**Step 2：驗證環境變數有注入**
```bash
kubectl logs deployment/app-with-config | head -20
# 看到 APP_ENV=production、LOG_LEVEL=info 等
```

**Step 3：修改 ConfigMap**
```bash
kubectl edit configmap app-config
# 把 LOG_LEVEL 改成 debug
```

**Step 4：⚠️ 環境變數不會自動更新！**
```bash
kubectl logs deployment/app-with-config | grep LOG_LEVEL
# 還是 info！

# 要重啟 Pod 才會生效
kubectl rollout restart deployment/app-with-config
kubectl logs deployment/app-with-config | grep LOG_LEVEL
# 現在才是 debug
```

**重點：**
- 環境變數注入：修改 ConfigMap 後，**Pod 不會自動更新**，要 rollout restart
- Volume 掛載：修改 ConfigMap 後，**Pod 裡的檔案會自動更新**（30-60 秒）

### 逐字稿

來動手做。先部署 ConfigMap 和使用它的 Deployment：

```
kubectl apply -f configmap-literal.yaml
```

這個 YAML 裡面有一個 ConfigMap 叫 `app-config`，存了 APP_ENV、LOG_LEVEL、API_URL、MAX_CONNECTIONS 四個設定。還有一個 Deployment，用 busybox 跑 `env | sort` 印出所有環境變數，然後 sleep。

看看日誌：

```
kubectl logs deployment/app-with-config | head -20
```

你應該能在輸出裡找到 `APP_ENV=production`、`LOG_LEVEL=info` 等。ConfigMap 的值成功注入為環境變數了。

現在來一個重要的實驗。修改 ConfigMap：

```
kubectl edit configmap app-config
```

把 `LOG_LEVEL` 從 `info` 改成 `debug`，存檔離開。

大家猜猜看，Pod 裡的環境變數會自動更新嗎？

[停頓 3 秒]

答案是：不會！`kubectl logs` 看一下，還是 `info`。為什麼？因為環境變數是在 Pod 啟動的時候注入的，啟動之後就定死了。ConfigMap 改了，已經跑著的 Pod 不知道。

要讓新的值生效，你得重啟 Pod：

```
kubectl rollout restart deployment/app-with-config
```

重啟之後再看日誌，現在才是 `debug`。

這是一個很重要的知識點。但如果你用 Volume 掛載的方式，ConfigMap 修改後，Pod 裡的檔案會自動更新，大概 30 到 60 秒。為什麼兩種方式行為不一樣？因為環境變數是 process 啟動時讀一次就定了，但檔案系統上的檔案可以被 kubelet 定期同步更新。

---

## 第 11 頁 | 實作：ConfigMap 掛載為檔案（15min）

### PPT 上的內容

**Lab 4：ConfigMap 掛載 Nginx 設定檔**

**ConfigMap 裡存 nginx 設定：**
```yaml
data:
  default.conf: |
    server {
        listen 80;
        location /healthz { return 200 'OK'; }
    }
```

**掛載到 Pod：**
```yaml
volumeMounts:
  - name: nginx-conf-volume
    mountPath: /etc/nginx/conf.d    # 整個目錄
volumes:
  - name: nginx-conf-volume
    configMap:
      name: nginx-config
```

**熱更新測試：**
```bash
kubectl edit configmap nginx-config
# 改 'OK' → 'HEALTHY'
# 等 30-60 秒
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
# 檔案自動更新了！但 Nginx 需要手動 reload
kubectl exec deploy/nginx-custom -- nginx -s reload
```

**⚠️ subPath 的坑：**
```yaml
# 用 subPath 只掛一個檔案（不覆蓋整個目錄）
mountPath: /etc/nginx/conf.d/default.conf
subPath: default.conf
# 但 subPath 不支援熱更新！
```

### 逐字稿

接下來做 ConfigMap 掛載為檔案的練習。這次我們要用 ConfigMap 來管理 Nginx 的設定檔。

部署：

```
kubectl apply -f configmap-nginx.yaml
```

先驗證設定檔有掛進去：

```
kubectl exec deployment/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

應該看到我們在 ConfigMap 裡寫的 Nginx 設定。測試一下 healthz 端點：

```
kubectl port-forward svc/nginx-custom-svc 8080:80 &
curl http://localhost:8080/healthz
```

應該回 `OK`。

現在來測試熱更新。修改 ConfigMap：

```
kubectl edit configmap nginx-config
```

把 `/healthz` 回應的 `OK` 改成 `HEALTHY`，存檔。

等大概 30 到 60 秒，再看檔案：

```
kubectl exec deployment/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

檔案內容自動更新了！不用重啟 Pod。但注意，Nginx 本身不會自動 reload。檔案雖然改了，但 Nginx process 還是用舊的設定在跑。你得手動 reload：

```
kubectl exec deployment/nginx-custom -- nginx -s reload
```

然後 curl 一下，現在回 `HEALTHY` 了。

這裡要提醒一個坑。如果你用 `subPath` 掛載，就是只掛一個檔案而不是覆蓋整個目錄，那熱更新就不會生效。這是 K8s 的已知行為，不是 bug。所以如果你需要熱更新，就不要用 `subPath`。但不用 `subPath` 的話，整個目錄會被覆蓋，原本目錄裡的其他檔案就不見了。這是一個取捨。

清理一下 port-forward：

```
kill %1
```

---

## 第 12 頁 | Secret 概念（10min）

### PPT 上的內容

**Secret = 管敏感資料的 ConfigMap**

| | ConfigMap | Secret |
|--|-----------|--------|
| 用途 | 一般設定 | 密碼、API Key、憑證 |
| 儲存 | 明文 | Base64 編碼 |
| 記憶體 | 存在 etcd | 存在 etcd（可加密） |
| 查看 | `kubectl get cm -o yaml` 直接看到值 | `kubectl describe secret` 只顯示大小 |

**⚠️ Base64 不是加密！**

```bash
echo -n "my-secret-pw" | base64         # → bXktc2VjcmV0LXB3
echo "bXktc2VjcmV0LXB3" | base64 -d    # → my-secret-pw
# 任何人都能解碼！
```

**三種 Secret 類型：**

| 類型 | 用途 | 範例 |
|------|------|------|
| `Opaque` | 通用（最常用） | 資料庫密碼、API Key |
| `kubernetes.io/tls` | TLS 憑證 | HTTPS 用的 cert + key |
| `kubernetes.io/dockerconfigjson` | Docker Registry 認證 | 拉私有 Image |

**最佳實踐：**
1. **不要**把 Secret YAML commit 到 Git
2. 用 `kubectl create secret` 指令建立（不用手動 Base64）
3. 生產環境用 Vault / AWS Secrets Manager

### 逐字稿

ConfigMap 管一般設定，那密碼呢？密碼、API Key、SSL 憑證這些敏感資料，用 Secret 來管。

Secret 和 ConfigMap 很像，都是存 key-value 的，用法也幾乎一樣。差別在哪？首先，Secret 的值是用 Base64 編碼存的，不是明文。其次，用 `kubectl describe secret` 的時候，它只會顯示每個 key 的大小，不會直接把值印出來，算是多了一層防偷看。

但我要特別強調一件事：Base64 編碼不是加密！

我們來做一個實驗。`echo -n "my-secret-pw" | base64`，得到 `bXktc2VjcmV0LXB3`。反過來 `echo "bXktc2VjcmV0LXB3" | base64 -d`，馬上就解回 `my-secret-pw`。任何拿到這個值的人都能輕鬆解碼，根本不需要密碼或 key。所以 Secret 的安全性不是靠編碼，而是靠 RBAC 權限控制 — 只有被授權的人才能 `kubectl get secret`。

Secret 有三種類型。最常用的是 `Opaque`，就是通用型，什麼都能存。`kubernetes.io/tls` 專門存 TLS 憑證，就是剛才 Ingress HTTPS 用的那個。`kubernetes.io/dockerconfigjson` 是存 Docker Registry 的帳號密碼，讓 kubelet 能拉私有 Image。

最佳實踐：第一，絕對不要把 Secret 的 YAML 檔 commit 到 Git。你的 Git repo 如果是公開的，全世界都能解碼你的密碼。就算是私有 repo，也不建議。第二，建議用 `kubectl create secret` 指令來建立，不用自己手動 Base64 編碼。第三，生產環境建議用外部的 Secret 管理工具，比如 HashiCorp Vault 或 AWS Secrets Manager。

---

## 第 13 頁 | 實作：Secret + MySQL（15min）

### PPT 上的內容

**Lab 5：用 Secret 管理 MySQL 密碼**

**Step 1：部署**
```bash
kubectl apply -f secret-db.yaml
```

**Step 2：查看 Secret**
```bash
kubectl get secret mysql-secret
kubectl describe secret mysql-secret   # 只顯示大小，不顯示值
kubectl get secret mysql-secret -o yaml  # 看到 Base64 值
echo "cm9vdHBhc3N3b3JkMTIz" | base64 -d  # → rootpassword123
```

**Step 3：驗證 MySQL**
```bash
kubectl get pods -l app=mysql -w        # 等 Running
kubectl exec -it deployment/mysql-deploy -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
```

**推薦：用指令建立（不用手動 Base64）**
```bash
kubectl create secret generic my-secret \
  --from-literal=username=admin \
  --from-literal=password=supersecret
```

### 逐字稿

來動手。部署 Secret 和 MySQL：

```
kubectl apply -f secret-db.yaml
```

這個檔案裡面有一個 Secret 存了 MySQL 的 root 密碼、使用者帳號、使用者密碼和資料庫名稱。還有一個 MySQL 的 Deployment 和 Service。

先看看 Secret 長什麼樣：

```
kubectl describe secret mysql-secret
```

注意看，它只顯示每個 key 的大小（bytes），不會顯示值。這是 Secret 和 ConfigMap 的一個差異 — ConfigMap 的 describe 會直接秀出值，Secret 不會。

但如果你用 `-o yaml` 看呢？

```
kubectl get secret mysql-secret -o yaml
```

你會看到 Base64 編碼的值。隨便挑一個解碼試試：

```
echo "cm9vdHBhc3N3b3JkMTIz" | base64 -d
```

得到 `rootpassword123`。所以我再強調一次，Base64 不是加密，任何有權限 `kubectl get secret` 的人都能拿到明文。安全性靠的是 RBAC — 第七堂會教。

等 MySQL Pod 跑起來（大概 30 秒），驗證一下：

```
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123 -e "SHOW DATABASES;"
```

應該看到 `myappdb` 在列表裡。Secret 的值成功透過 `envFrom` 注入為環境變數，MySQL 讀到了 `MYSQL_ROOT_PASSWORD` 和 `MYSQL_DATABASE`，自動建立了資料庫。

對了，我在 YAML 裡面有一段註解掉的 `stringData`。如果你覺得手動 Base64 編碼很煩，可以用 `stringData` 直接寫明文，K8s 會在存進 etcd 的時候自動幫你編碼。或者更好的方式，直接用指令建立：

```
kubectl create secret generic my-secret --from-literal=username=admin --from-literal=password=supersecret
```

完全不用碰 Base64。

---

## 第 14 頁 | 整合實作：Ingress + ConfigMap + Secret（15min）

### PPT 上的內容

**把上午學的全部串起來**

```
                        Ingress
                       /       \
                      /         \
使用者 → app.example.com    api.example.com
              ↓                    ↓
         frontend-svc          api-svc
              ↓                    ↓
         Nginx Pod             API Pod
         (ConfigMap:              (ConfigMap: API_URL, LOG_LEVEL)
          nginx.conf)             (Secret: DB_PASSWORD)
                                   ↓
                              mysql-svc
                                   ↓
                              MySQL Pod
                              (Secret: ROOT_PASSWORD)
```

**你已經會了：**
- [x] Ingress 讓使用者用域名連進來
- [x] ConfigMap 管理 Nginx 設定檔和 API 設定
- [x] Secret 管理 MySQL 密碼

**但還有一個問題...**

### 逐字稿

好，上午學了三個東西：Ingress、ConfigMap、Secret。我們來整理一下它們怎麼搭配在一起。

看這個架構圖。使用者透過 Ingress 進來，`app.example.com` 導到前端的 Nginx，`api.example.com` 導到後端的 API。Nginx 的設定檔用 ConfigMap 管理，不用寫死在 Image 裡。API 的設定（LOG_LEVEL、API_URL）用 ConfigMap 管理，API 連資料庫的密碼用 Secret 管理。MySQL 的 root 密碼也用 Secret 管理。

整個流量從使用者到資料庫，每一層的設定和密碼都不是寫死在 Image 裡面的。同一個 Image 可以部署到 dev 和 prod，只要換 ConfigMap 和 Secret 就好。這就是「設定外部化」的精神。

大家有沒有覺得「哇，學了這麼多東西，終於有點像真正的系統了」？但別高興太早，還有一個大問題我們沒解決。

---

## 第 15 頁 | 痛點：Pod 重啟資料消失（5min）

### PPT 上的內容

**實驗：資料消失了！**

```bash
# 進 MySQL Pod，建立一張表
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> CREATE DATABASE testdb;
> USE testdb;
> CREATE TABLE users (id INT, name VARCHAR(50));
> INSERT INTO users VALUES (1, 'Alice');
> SELECT * FROM users;    # Alice 在！
> exit

# 刪掉 Pod（模擬 Pod 重啟）
kubectl delete pod -l app=mysql

# 等新 Pod 跑起來，再查
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> USE testdb;              # ERROR: Unknown database 'testdb'
# 💥 資料全部不見了！
```

**為什麼？**

```
Pod 的檔案系統 = 容器的 overlay filesystem
Pod 被刪 → 容器被刪 → filesystem 被刪 → 資料不見
```

**Docker 也一樣：**
```bash
docker run --name mysql mysql:8.0       # 不掛 volume
docker rm -f mysql                      # 資料不見

docker run -v mydata:/var/lib/mysql mysql:8.0  # 掛 volume
docker rm -f mysql                      # 資料還在！
```

**K8s 的解法 → PersistentVolume + PersistentVolumeClaim**

### 逐字稿

好，下午了，吃飽了嗎？我們來面對一個殘酷的現實。

上午我們部署了 MySQL，建了資料庫，存了資料。但如果我告訴你，把 MySQL 的 Pod 刪掉重建，你的資料全部消失，你會怎麼想？

來做個實驗。進 MySQL 建一張表，插入一筆資料 Alice。查一下，Alice 在。好，現在退出 MySQL。

```
kubectl delete pod -l app=mysql
```

刪掉 Pod。Deployment 會自動幫你重建一個新的 Pod。等新 Pod 跑起來，再進 MySQL 查一下...

`USE testdb` — ERROR: Unknown database 'testdb'。

資料全部不見了。不只是表不見了，連資料庫都不見了。

為什麼？因為 Pod 的檔案系統就是容器的 overlay filesystem。Pod 被刪了，容器被刪了，filesystem 也跟著被刪了。裡面的所有資料通通消失。

用 Docker 的經驗來想，這跟你 `docker run mysql` 不掛 Volume 是一模一樣的。容器刪了，資料就沒了。Docker 的解法是什麼？掛 Volume 啊！`docker run -v mydata:/var/lib/mysql`，資料就存在 Volume 裡，容器怎麼刪都不怕。

K8s 也是同樣的道理。我們需要一種「獨立於 Pod 之外」的儲存空間，Pod 來來去去，資料穩穩地待著。K8s 提供的方案是 PersistentVolume（PV）和 PersistentVolumeClaim（PVC）。

---

## 第 16 頁 | PV + PVC 概念（10min）

### PPT 上的內容

**PV 和 PVC 的關係：**

```
管理員                              使用者（開發者）
  │                                   │
  ├─ 建立 PV                          ├─ 建立 PVC
  │  「我有 10GB 的 SSD」              │  「我需要 5GB 的儲存」
  │                                   │
  └─────────── K8s 自動配對 ──────────┘
                  (Binding)
                    │
                    ↓
               Pod 使用 PVC
               「把 PVC 掛到 /data」
```

**Docker 對照：**

| Docker | K8s | 角色 |
|--------|-----|------|
| `docker volume create mydata` | PersistentVolume (PV) | 建立儲存空間 |
| `-v mydata:/var/lib/mysql` | PersistentVolumeClaim (PVC) | 使用儲存空間 |

**為什麼要分 PV 和 PVC？**

- PV = 管理員管的（「公司有哪些儲存資源」）
- PVC = 開發者用的（「我的 App 需要多少空間」）
- **職責分離** — 開發者不需要知道底層用 NFS 還是 SSD

**AccessMode（存取模式）：**

| 模式 | 縮寫 | 意思 |
|------|------|------|
| ReadWriteOnce | RWO | 只能被一個 Node 讀寫（最常用） |
| ReadOnlyMany | ROX | 可以被多個 Node 唯讀 |
| ReadWriteMany | RWX | 可以被多個 Node 讀寫（需 NFS 等） |

### 逐字稿

PV 和 PVC，名字聽起來很嚇人，但概念其實很簡單。

用一個生活化的比喻：PV 就像「停車場的車位」，PVC 就像「停車位的租約」。停車場管理員（K8s 管理員）先把車位劃好（建立 PV），然後車主（開發者）提交租約申請（建立 PVC），管理系統自動幫你配對一個適合的車位，這個過程叫 Binding。配對成功後，車主就能用那個車位停車了（Pod 掛載 PVC）。

對照 Docker 來看：`docker volume create mydata` 就像建立 PV — 創造一塊儲存空間。`docker run -v mydata:/var/lib/mysql` 就像 PVC — 把那塊儲存空間掛到容器裡。Docker 把這兩步合在一起，K8s 拆成兩步。

為什麼要拆？因為在大公司裡，管儲存的人跟寫程式的人不是同一個人。管理員負責「我們公司有幾台 NAS、幾塊 SSD、每塊多大」，這是 PV。開發者只要說「我的 MySQL 需要 10GB 空間」，這是 PVC。開發者不需要知道底層是 NFS 還是 AWS EBS 還是什麼。

PV 有一個重要的屬性叫 AccessMode，決定這塊儲存可以怎麼被使用。RWO（ReadWriteOnce）是最常用的，表示同時只能被一個 Node 掛載讀寫。ROX 是多 Node 唯讀。RWX 是多 Node 讀寫，但不是所有儲存系統都支援，通常需要 NFS 之類的網路儲存。

---

## 第 17 頁 | 實作：PV + PVC 靜態佈建（20min）

### PPT 上的內容

**Lab 6：PV + PVC + 資料持久化驗證**

**Step 1：部署**
```bash
kubectl apply -f pv-pvc.yaml
```

**Step 2：查看 Binding 狀態**
```bash
kubectl get pv          # STATUS: Bound
kubectl get pvc         # STATUS: Bound
```

**Step 3：查看 Pod 寫入的資料**
```bash
kubectl logs deployment/app-with-storage
```

**Step 4：重點實驗 — 刪 Pod，資料還在嗎？**
```bash
kubectl delete pod -l app=app-with-storage
# 等新 Pod 跑起來
kubectl logs deployment/app-with-storage
# 之前的資料還在！加上新的一行！
```

**對照上午的 MySQL：**
```
沒掛 PVC → 刪 Pod → 💥 資料消失
有掛 PVC → 刪 Pod → ✅ 資料還在
```

### 逐字稿

來做實驗。部署 PV、PVC 和使用 PVC 的 Deployment：

```
kubectl apply -f pv-pvc.yaml
```

先看 PV 和 PVC 的狀態：

```
kubectl get pv
kubectl get pvc
```

兩個的 STATUS 都應該是 `Bound`，表示 K8s 已經把 PVC 和 PV 配對成功了。如果你看到 `Pending`，表示沒有合適的 PV 可以配對 — 可能是 storageClassName 不一致，或者 PV 的容量不夠大。

看看 Pod 的日誌：

```
kubectl logs deployment/app-with-storage
```

你會看到它寫入了一行「寫入時間」和「Pod 名稱」，然後印出目前檔案的內容。

好，現在來做最關鍵的實驗。刪掉 Pod：

```
kubectl delete pod -l app=app-with-storage
```

等新 Pod 跑起來，再看日誌：

```
kubectl logs deployment/app-with-storage
```

大家注意看 — 檔案裡面不是只有一行，而是兩行！第一行是剛才被刪掉的那個 Pod 寫的，第二行是新 Pod 寫的。這代表什麼？代表第一個 Pod 寫的資料在 Pod 被刪掉後還活著，新 Pod 掛載同一個 PVC，讀到了舊資料，然後又追加了一行。

對照上午的 MySQL — 沒掛 PVC 的 MySQL 刪了 Pod 資料就沒了，掛了 PVC 的話資料就還在。這就是 PV/PVC 存在的意義。

---

## 第 18 頁 | PV 回收策略（5min）

### PPT 上的內容

**PVC 刪掉後，PV 裡的資料怎麼處理？**

| ReclaimPolicy | 行為 | 用途 |
|---------------|------|------|
| `Retain` | PVC 刪掉後，PV 和資料都保留 | 生產環境（資料不能丟） |
| `Delete` | PVC 刪掉後，PV 和資料都刪除 | 開發環境（自動清理） |
| `Recycle` | 清空資料後 PV 可重新使用 | **已棄用，不要用** |

**實驗：**
```bash
# 刪掉 PVC
kubectl delete pvc local-pvc
kubectl get pv    # STATUS: Released（不是 Available）

# Retain 策略下，PV 變成 Released 狀態
# 需要管理員手動清理後才能重新使用
```

### 逐字稿

有一個相關的概念要提一下 — ReclaimPolicy，就是回收策略。

當你把 PVC 刪掉的時候，PV 裡的資料要怎麼處理？三個選項。

`Retain` — 保留。PVC 刪了，但 PV 和裡面的資料都還在。PV 的狀態會變成 `Released`，表示它曾經被綁過但現在沒有 PVC 了。要讓這個 PV 能再被新的 PVC 使用，管理員得手動清理。生產環境通常用這個，因為資料不能隨便丟。

`Delete` — 刪除。PVC 一刪，PV 也跟著刪，資料也消失。雲端環境常用這個，因為 PV 通常對應到一個雲端磁碟（EBS、Azure Disk），PVC 刪了磁碟也一起刪，省錢。

`Recycle` — 已棄用，不要用。

我們的範例用的是 `Retain`。

---

## 第 19 頁 | StorageClass + 動態佈建（15min）

### PPT 上的內容

**靜態佈建 vs 動態佈建：**

| | 靜態佈建 | 動態佈建 |
|--|---------|---------|
| 流程 | 管理員先建 PV → 使用者建 PVC → 配對 | 使用者建 PVC → **自動建 PV** |
| 適合 | 學習、小規模 | 生產環境 |
| 問題 | 要事先建好所有 PV，麻煩 | 需要 StorageClass |

**StorageClass = 告訴 K8s「怎麼自動建 PV」**

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path              # k3s 內建
provisioner: rancher.io/local-path
reclaimPolicy: Delete
```

**動態佈建的 PVC：**
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: local-path   # 指定 StorageClass
  # 不用事先建 PV，K8s 自動建！
```

**k3s 內建 local-path StorageClass：**
```bash
kubectl get storageclass
# NAME                   PROVISIONER
# local-path (default)   rancher.io/local-path
```

### 逐字稿

剛才我們做的是「靜態佈建」— 管理員先建好 PV，使用者再建 PVC 去配對。但你想想看，如果你有 100 個微服務，每個都需要 PVC，管理員要事先建 100 個 PV？太累了。

所以 K8s 有「動態佈建」— 使用者只要建 PVC，K8s 自動幫你建 PV。這就是 StorageClass 的功能。

StorageClass 就像一份說明書，告訴 K8s：「當有人申請 PVC 的時候，用什麼方式自動建立 PV」。比如在 AWS 上，StorageClass 會告訴 K8s「去 AWS 自動建一塊 EBS 磁碟」。在 k3s 上，內建的 `local-path` StorageClass 會在 Node 的本機目錄建立儲存空間。

查看你的叢集有哪些 StorageClass：

```
kubectl get storageclass
```

k3s 會有一個 `local-path`，而且後面標了 `(default)`，表示如果 PVC 沒指定 storageClassName，就用這個。

用動態佈建的話，PVC 只要指定 `storageClassName: local-path`，不用事先建 PV，K8s 就會根據 StorageClass 的設定自動建一個 PV 給你。在生產環境，基本上都是用動態佈建。靜態佈建只有在學習或特殊情況下才會用到。

---

## 第 20 頁 | 痛點：Deployment 不適合跑資料庫（5min）

### PPT 上的內容

**問題：用 Deployment 跑 MySQL 有什麼問題？**

| 問題 | 說明 |
|------|------|
| Pod 名稱不固定 | `mysql-deploy-abc-xyz`，每次重建名字不同 |
| 沒有順序 | 3 個副本同時啟動，主從架構搞不定 |
| 共用 PVC | 所有 Pod 搶同一塊儲存，資料衝突 |
| 沒有穩定網路 | 別人怎麼連到特定的 Pod？（主庫 vs 從庫） |

**資料庫需要什麼？**
1. **固定名稱** — `mysql-0` 永遠是主庫
2. **有序啟動** — 主庫先起來，從庫再連上去
3. **獨立儲存** — 每個 Pod 有自己的 PVC
4. **穩定 DNS** — 能直接連到 `mysql-0` 而不是隨機一個

**→ StatefulSet**

### 逐字稿

好，PV/PVC 解決了資料持久化的問題。但如果我要跑 MySQL 主從架構呢？一個主庫、兩個從庫？

用 Deployment 可以嗎？試試看。`replicas: 3`，掛一個 PVC。

第一個問題：三個 Pod 的名字是隨機的，`mysql-deploy-abc-xyz`、`mysql-deploy-def-uvw`。重建之後名字又變了。你的主庫到底是哪一個？從庫怎麼知道要連哪一個？

第二個問題：三個 Pod 同時啟動。但 MySQL 主從架構需要主庫先啟動、拿到 binlog position，從庫再連上去同步。同時啟動會出問題。

第三個問題：三個 Pod 共用同一個 PVC。三個 MySQL instance 同時寫同一塊磁碟？資料一定亂掉。

第四個問題：Service 是負載均衡的，流量隨機分配。但你寫入操作要送到主庫，讀取操作可以送到從庫。怎麼指定？

Deployment 設計給「無狀態」的應用 — API、Web Server 這種，Pod 之間沒有差別，隨便殺一個再補一個都行。但資料庫是「有狀態」的，每個 Pod 都有自己的身份。

K8s 提供了一個專門給有狀態應用的資源 — StatefulSet。

---

## 第 21 頁 | StatefulSet 概念（10min）

### PPT 上的內容

**StatefulSet vs Deployment：**

| 特性 | Deployment | StatefulSet |
|------|-----------|-------------|
| Pod 名稱 | random（`abc-xyz`） | 固定序號（`mysql-0`, `mysql-1`） |
| 啟動順序 | 全部同時 | 依序（0 → 1 → 2） |
| 刪除順序 | 隨機 | 反序（2 → 1 → 0） |
| PVC | 所有 Pod 共用 | 每個 Pod 獨立 PVC |
| DNS | 只有 Service DNS | 每個 Pod 有自己的 DNS |
| 適用 | 無狀態（API、Web） | 有狀態（DB、Cache、MQ） |

**StatefulSet 的三個保證：**

```
StatefulSet: mysql (replicas: 3)
  ├── mysql-0  → PVC: mysql-data-mysql-0  → DNS: mysql-0.mysql-headless
  ├── mysql-1  → PVC: mysql-data-mysql-1  → DNS: mysql-1.mysql-headless
  └── mysql-2  → PVC: mysql-data-mysql-2  → DNS: mysql-2.mysql-headless
```

1. **穩定的身份** — Pod 名稱不變，刪掉重建還是 `mysql-0`
2. **獨立的儲存** — 每個 Pod 有自己的 PVC（volumeClaimTemplates）
3. **有序的生命週期** — 啟動 0→1→2，刪除 2→1→0

**必須搭配 Headless Service：**
```yaml
spec:
  clusterIP: None     # 關鍵！不做負載均衡
```

### 逐字稿

StatefulSet 給你三個保證。

第一，穩定的身份。Pod 的名稱是固定的 — `mysql-0`、`mysql-1`、`mysql-2`。不管 Pod 被刪幾次重建幾次，`mysql-0` 永遠是 `mysql-0`。不像 Deployment 每次重建名字都變。

第二，獨立的儲存。每個 Pod 自動建立自己的 PVC。`mysql-0` 的 PVC 叫 `mysql-data-mysql-0`，`mysql-1` 的叫 `mysql-data-mysql-1`。即使 Pod 被刪掉重建，新的 `mysql-0` 還是會掛回 `mysql-data-mysql-0` 這個 PVC，資料不會搞混。

第三，有序的生命週期。啟動的時候先起 `mysql-0`，確認它 Ready 之後再起 `mysql-1`，再起 `mysql-2`。刪除的時候反過來，先刪 `mysql-2`，再 `mysql-1`，最後 `mysql-0`。

StatefulSet 必須搭配 Headless Service。什麼是 Headless Service？就是 `clusterIP: None` 的 Service。普通 Service 做負載均衡，你連到 Service 的 IP，它隨機分配給後面的 Pod。但 Headless Service 不做負載均衡，它讓每個 Pod 有自己的 DNS 記錄。

`mysql-0.mysql-headless.default.svc.cluster.local` — 直接連到 `mysql-0`。
`mysql-1.mysql-headless.default.svc.cluster.local` — 直接連到 `mysql-1`。

這樣你的應用就可以指定「寫入連 mysql-0（主庫），讀取連 mysql-1（從庫）」。

Docker 對照的話，StatefulSet 就像你手動 `docker run --name mysql-0` 加 `-v mysql0-data:/var/lib/mysql`，每個容器都有固定的名字和獨立的 Volume。只不過 K8s 把這些自動化了。

---

## 第 22 頁 | StatefulSet YAML 拆解（10min）

### PPT 上的內容

**StatefulSet YAML 重點：**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless     # ← 對應 Headless Service
  replicas: 2
  selector:
    matchLabels:
      app: mysql-sts
  template:
    # ... 跟 Deployment 的 template 一樣

  # ← 這是 StatefulSet 獨有的
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi
```

**跟 Deployment 的差異：**

| 欄位 | Deployment | StatefulSet |
|------|-----------|-------------|
| `serviceName` | 沒有 | 必須指定 Headless Service |
| `volumeClaimTemplates` | 沒有（用 volumes） | 自動為每個 Pod 建 PVC |
| 其他 | 一樣 | 一樣 |

### 逐字稿

來看 YAML 怎麼寫。打開 `statefulset-mysql.yaml`。

你會發現 StatefulSet 的 YAML 跟 Deployment 非常像。`apiVersion` 一樣是 `apps/v1`，`selector` 和 `template` 的寫法完全一樣。差別只有兩個地方。

第一個是 `serviceName: mysql-headless`，這是告訴 StatefulSet 要搭配哪個 Headless Service。這個欄位 Deployment 沒有。

第二個是 `volumeClaimTemplates`。Deployment 裡面你用 `volumes` 搭配一個已經存在的 PVC。但 StatefulSet 用 `volumeClaimTemplates`，它是一個「PVC 範本」— K8s 會根據這個範本，為每個 Pod 自動建立獨立的 PVC。

`mysql-0` 建立的時候，K8s 自動建一個 PVC 叫 `mysql-data-mysql-0`（格式是 `<template-name>-<pod-name>`）。`mysql-1` 建立的時候，自動建 `mysql-data-mysql-1`。每個 Pod 有自己的 PVC，資料完全獨立。

其他部分跟 Deployment 一模一樣。如果你已經會寫 Deployment，StatefulSet 只要多學 `serviceName` 和 `volumeClaimTemplates` 這兩個欄位就好了。

---

## 第 23 頁 | 實作：StatefulSet MySQL（20min）

### PPT 上的內容

**Lab 7：StatefulSet 部署 MySQL**

**Step 1：部署**
```bash
kubectl apply -f statefulset-mysql.yaml
```

**Step 2：觀察有序啟動**
```bash
kubectl get pods -w
# mysql-0: Pending → Running (先)
# mysql-1: Pending → Running (後)
```

**Step 3：驗證固定名稱 + 獨立 PVC**
```bash
kubectl get pods -l app=mysql-sts     # mysql-0, mysql-1
kubectl get pvc                        # mysql-data-mysql-0, mysql-data-mysql-1
```

**Step 4：驗證資料獨立**
```bash
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
kubectl delete pod mysql-0
kubectl get pods -w                    # mysql-0 重建（同名！）
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
# testdb 還在！
```

**Step 5：有序縮容**
```bash
kubectl scale statefulset mysql --replicas=1
# mysql-1 先被刪，mysql-0 留著
```

### 逐字稿

動手做。部署 StatefulSet：

```
kubectl apply -f statefulset-mysql.yaml
```

馬上用 `-w` 觀察：

```
kubectl get pods -w
```

注意看順序 — `mysql-0` 先進 Pending，然後 ContainerCreating，然後 Running。`mysql-0` 變成 Running 之後，`mysql-1` 才開始建立。這就是有序啟動。如果你之前用 Deployment，三個 Pod 是同時開始建的。

等兩個都 Running 了，按 Ctrl+C。看看 Pod 名稱：

```
kubectl get pods -l app=mysql-sts
```

`mysql-0`、`mysql-1`。不是 random hash，是固定的序號。

看 PVC：

```
kubectl get pvc
```

`mysql-data-mysql-0`、`mysql-data-mysql-1`。每個 Pod 有自己的 PVC。

來驗證資料獨立性。進 mysql-0 建一個資料庫：

```
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
```

然後刪掉 mysql-0：

```
kubectl delete pod mysql-0
```

觀察 — mysql-0 會被重建，而且名字還是 `mysql-0`！不像 Deployment 重建的 Pod 會有新的 random 名字。

等它 Running 後，再查：

```
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
```

testdb 還在！因為新的 mysql-0 掛載的還是 `mysql-data-mysql-0` 這個 PVC，資料沒有丟。

最後試試縮容：

```
kubectl scale statefulset mysql --replicas=1
```

注意看，mysql-1 被刪了，mysql-0 留著。是從最大編號開始刪的，不是隨機的。擴回 2 個的時候，mysql-1 會重新建立。

---

## 第 24 頁 | 痛點：YAML 太多了（5min）

### PPT 上的內容

**回顧今天寫了多少 YAML：**

```
ingress-basic.yaml      — Deployment x2 + Service x2 + Ingress
ingress-host.yaml       — Ingress
configmap-literal.yaml  — ConfigMap + Deployment
configmap-nginx.yaml    — ConfigMap + Deployment + Service
secret-db.yaml          — Secret + Deployment + Service
pv-pvc.yaml            — PV + PVC + Deployment
statefulset-mysql.yaml  — Headless Service + Secret + StatefulSet
```

**一個真實的系統可能有：**
- 3 個 Deployment + 3 個 Service
- 2 個 ConfigMap + 3 個 Secret
- 1 個 StatefulSet + 2 個 PVC
- 1 個 Ingress
- **= 15+ 個 YAML 檔案**

**問題：**
1. YAML 太多，管不動
2. dev / staging / prod 只差一些參數，但要維護三份
3. 要裝一個 MySQL？自己寫 StatefulSet + Headless Service + PVC + Secret...

**Docker 時代怎麼解決？→ docker-compose.yml（一個檔管全部）**
**K8s 的解法 → Helm**

### 逐字稿

好，回顧一下今天做了多少事。打開你的 lesson6 目錄，數一下 YAML 檔案... 7 個。而且每個檔案裡面都不只一個資源。加起來大概有 20 幾個 K8s 物件。

這還只是一個學習用的小系統。真實的生產環境可能有十幾個微服務，每個服務都有 Deployment、Service、ConfigMap、可能還有 Secret、Ingress、PVC。加起來幾十個 YAML 檔案。

然後你要部署到 dev、staging、prod 三個環境。三個環境基本上一樣，只是 replicas 不同、Image tag 不同、資料庫連線不同。你是要維護三套 YAML？改了一個東西要改三個地方？

更慘的是，如果你想在 K8s 上跑一個 MySQL，你得自己寫 StatefulSet、Headless Service、PVC、Secret... 幾百行 YAML。但 MySQL 這種東西不是每個人都在用嗎？為什麼每個人都要自己寫一遍？

用 Docker 的經驗來想，Docker Compose 用一個 `docker-compose.yml` 就能管理整個系統。K8s 有沒有類似的東西？

有 — Helm。

---

## 第 25 頁 | Helm 概念（10min）

### PPT 上的內容

**Helm = K8s 的套件管理器**

| 概念 | 說明 | 對照 |
|------|------|------|
| Helm | 套件管理工具 | apt / yum / brew |
| Chart | 一包 YAML 範本 | .deb / .rpm 安裝包 |
| Release | Chart 安裝後的實例 | 安裝好的軟體 |
| Repository | Chart 的倉庫 | apt 的 source list |
| values.yaml | 客製化參數 | 軟體的設定檔 |

**三個核心功能：**

```
1. 一鍵安裝 — helm install my-redis bitnami/redis
   （不用自己寫 StatefulSet + Service + Secret + PVC）

2. 參數化 — values.yaml 管理所有可變參數
   replicas: 3          # dev 用 1，prod 用 3
   image.tag: "7.2"     # 版本
   auth.password: "xxx" # 密碼

3. 版本管理 — helm upgrade / helm rollback
   升級失敗？一行指令回滾
```

**對照 Docker Compose：**

| Docker Compose | Helm |
|---------------|------|
| `docker-compose.yml` | Chart（一包 YAML 範本） |
| `docker compose up` | `helm install` |
| `docker compose down` | `helm uninstall` |
| `.env` 檔案 | `values.yaml` |

### 逐字稿

Helm 就是 K8s 的套件管理器。就像你在 Ubuntu 上用 `apt install mysql` 一行指令就能裝好 MySQL，Helm 讓你用 `helm install my-mysql bitnami/mysql` 一行指令就能在 K8s 上部署一整套 MySQL — StatefulSet、Headless Service、PVC、Secret 全部幫你搞定。

Helm 有幾個核心概念。Chart 就是一個安裝包，裡面包了所有需要的 YAML 範本。Release 是 Chart 安裝後的實例，你可以用同一個 Chart 安裝多個 Release（比如一個 Redis 給 cache 用，另一個 Redis 給 session 用）。Repository 是 Chart 的倉庫，最大的公開倉庫是 Bitnami。values.yaml 是參數檔，讓你客製化安裝。

Helm 的三個核心功能。第一，一鍵安裝 — 別人已經把最佳實踐寫成 Chart 了，你直接裝就好。第二，參數化 — 同一個 Chart，dev 環境設 replicas 為 1，prod 設 3，只要改 values.yaml。第三，版本管理 — 升級了新版本發現有 bug？`helm rollback` 一行指令回到上一版。

對照 Docker Compose 來看：Chart 就像 `docker-compose.yml`，定義了整個系統的結構。`helm install` 就像 `docker compose up`。`helm uninstall` 就像 `docker compose down`。`values.yaml` 就像 `.env` 檔案。

---

## 第 26 頁 | 實作：Helm 安裝 Redis（15min）

### PPT 上的內容

**Lab 8：Helm 基本操作**

**Step 1：安裝 Helm**
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

**Step 2：加入 Chart 倉庫**
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo redis
```

**Step 3：一鍵安裝 Redis**
```bash
helm install my-redis bitnami/redis --set auth.password=myredis123
```

**Step 4：看看 Helm 幫你建了什麼**
```bash
kubectl get all -l app.kubernetes.io/instance=my-redis
# Deployment / StatefulSet / Service / Secret / PVC 全自動！
helm list
helm status my-redis
```

### 逐字稿

來體驗一下 Helm 的威力。先安裝 Helm：

```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

加入 Bitnami 的 Chart 倉庫：

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

搜尋 Redis 的 Chart：

```
helm search repo redis
```

你會看到 `bitnami/redis` 以及版本資訊。

現在一行指令安裝 Redis：

```
helm install my-redis bitnami/redis --set auth.password=myredis123
```

等它跑完，看看 Helm 幫你建了什麼：

```
kubectl get all -l app.kubernetes.io/instance=my-redis
```

你會看到 StatefulSet、Service、Secret... 全部自動建好了。如果這些你自己寫 YAML，可能要寫個上百行。Helm 一行指令搞定。

查看已安裝的 Release：

```
helm list
```

看 Release 的詳細資訊：

```
helm status my-redis
```

它會告訴你怎麼連到 Redis、密碼存在哪個 Secret 裡等。

---

## 第 27 頁 | Helm upgrade + rollback（10min）

### PPT 上的內容

**升級：改參數**
```bash
helm upgrade my-redis bitnami/redis \
  --set auth.password=myredis123 \
  --set replica.replicaCount=2
```

**查看歷史**
```bash
helm history my-redis
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         deployed    Upgrade complete
```

**回滾**
```bash
helm rollback my-redis 1
helm history my-redis
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         superseded  Upgrade complete
# 3         deployed    Rollback to 1
```

**清理**
```bash
helm uninstall my-redis
```

**對照 K8s 原生：**

| 操作 | kubectl | Helm |
|------|---------|------|
| 安裝 | `kubectl apply -f *.yaml`（自己管） | `helm install`（一行） |
| 更新 | 改 YAML + `kubectl apply` | `helm upgrade --set` |
| 回滾 | `kubectl rollout undo`（只能 Deployment） | `helm rollback`（整個系統） |
| 刪除 | `kubectl delete -f *.yaml`（一個一個） | `helm uninstall`（一行） |

### 逐字稿

安裝好之後，假設你想加一個 Redis 從庫：

```
helm upgrade my-redis bitnami/redis --set auth.password=myredis123 --set replica.replicaCount=2
```

注意 `--set auth.password` 要重複帶，不然 upgrade 的時候密碼會被清掉。這是 Helm 的一個小坑。

看升級歷史：

```
helm history my-redis
```

你會看到 REVISION 1 是原始安裝，REVISION 2 是剛才的升級。

如果升級後發現有問題，一行指令回滾：

```
helm rollback my-redis 1
```

再看 history，多了一個 REVISION 3，描述是「Rollback to 1」。

對照 K8s 原生操作 — `kubectl rollout undo` 只能回滾單一個 Deployment。但如果你的系統有 Deployment + StatefulSet + ConfigMap + Secret 一起改了呢？`kubectl rollout undo` 搞不定。但 `helm rollback` 可以把整個 Release 的所有資源一起回滾，因為 Helm 記錄的是整個 Release 的快照。

最後清理：

```
helm uninstall my-redis
```

一行指令把 Redis 相關的所有資源全部清掉。

---

## 第 28 頁 | Helm values.yaml（10min）

### PPT 上的內容

**用 values.yaml 管理參數（取代一堆 --set）**

```bash
# 查看 Chart 有哪些可設定的參數
helm show values bitnami/redis | head -50
```

**建立自己的 values 檔：**
```yaml
# my-redis-values.yaml
auth:
  password: "myredis123"

master:
  persistence:
    size: 2Gi

replica:
  replicaCount: 2
  persistence:
    size: 1Gi
```

```bash
# 用 -f 指定 values 檔
helm install my-redis bitnami/redis -f my-redis-values.yaml

# 不同環境用不同的 values 檔
helm install redis-dev  bitnami/redis -f values-dev.yaml
helm install redis-prod bitnami/redis -f values-prod.yaml
```

**→ 同一個 Chart，不同的 values 檔 = 不同環境的部署**

### 逐字稿

剛才我們用 `--set` 在命令列傳參數。但如果參數很多，命令列就會超長。更好的方式是用 `values.yaml` 檔案。

先看看 Chart 有哪些參數可以設定：

```
helm show values bitnami/redis | head -50
```

會印出一大堆，每個參數都有註解說明用途。

你可以建一個自己的 values 檔案，只寫你想改的參數。比如我要密碼是 `myredis123`，master 的 PVC 是 2GB，replica 有 2 個、每個 PVC 是 1GB。把這些寫在 `my-redis-values.yaml` 裡面。

安裝的時候用 `-f` 指定：

```
helm install my-redis bitnami/redis -f my-redis-values.yaml
```

這個做法最大的好處是什麼？你可以為不同環境建不同的 values 檔。`values-dev.yaml` 裡面 replicas 設 1、PVC 設 1GB。`values-prod.yaml` 裡面 replicas 設 3、PVC 設 100GB。同一個 Chart，不同的 values 檔，搞定多環境部署。

是不是跟 Docker Compose 的 `.env` 檔案很像？概念完全一樣，只是 Helm 的 values 功能更強大，可以做巢狀結構、條件判斷等等。

---

## 第 29 頁 | 總結 + 反思問題（5min）

### PPT 上的內容

**今天學了 8 個東西：**

| 主題 | 一句話 | Docker 對照 |
|------|--------|------------|
| Ingress | 域名 + 路徑路由 | Nginx 反向代理 |
| ConfigMap | 一般設定外部化 | `-e ENV_VAR` |
| Secret | 敏感資料管理 | `-e PASSWORD=xxx` |
| PV | 儲存空間（管理員建） | `docker volume create` |
| PVC | 使用儲存空間（開發者用） | `-v volume:/path` |
| StorageClass | 自動建 PV | Volume driver |
| StatefulSet | 有狀態應用部署 | `docker run --name fixed` |
| Helm | K8s 套件管理 | Docker Compose 進化版 |

**今天的核心觀念：**
1. 設定和程式碼分離（ConfigMap + Secret）
2. 資料和 Pod 分離（PV/PVC）
3. 複雜度用工具管理（Helm）

**反思問題：**
> 你的系統全部跑起來了。但 API 的程式死鎖了，K8s 還是顯示 Running，流量照送，使用者看到 502。
> **K8s 怎麼知道 Pod「活著但不健康」？**
> — 下堂課：Probe（健康檢查）+ Resource + RBAC

### 逐字稿

好，今天的內容非常多，我們來做個總結。

今天學了 8 個東西。Ingress — 讓使用者用域名和路徑連到不同的服務，不用再記 IP 和 Port。ConfigMap — 把一般設定從 Image 裡抽出來，環境不同只要換 ConfigMap。Secret — 管理密碼和敏感資料，記住 Base64 不是加密。PV 和 PVC — 讓資料在 Pod 重啟後還在，PV 是管理員建的儲存空間，PVC 是開發者的使用申請。StorageClass — 自動建 PV，不用管理員手動建。StatefulSet — 給有狀態應用用的，固定名稱、有序啟動、獨立 PVC。Helm — K8s 的套件管理，一鍵安裝複雜應用。

今天有三個核心觀念。第一，設定和程式碼分離 — ConfigMap 和 Secret 讓你同一個 Image 部署到不同環境。第二，資料和 Pod 分離 — PV/PVC 讓你的資料不會因為 Pod 重啟而消失。第三，複雜度用工具管理 — YAML 太多就用 Helm。

最後留一個反思問題。你的系統全部跑起來了，Ingress 設好了、ConfigMap 分離了、PVC 也掛了。但你的 API Pod 裡面的程式死鎖了，不再處理任何請求。問題是 K8s 還是顯示 Running — 因為 process 沒有退出，K8s 以為它好好的。Service 照樣把流量送過去，使用者看到的是 502 Bad Gateway。

K8s 怎麼知道一個 Pod「活著但不健康」？你要怎麼告訴 K8s 別再送流量給這個 Pod？

提示：想想 Docker 的 `HEALTHCHECK` 指令。

下堂課我們來教 Probe — 健康檢查、Resource 管理和 RBAC 權限控制。到時候見！
