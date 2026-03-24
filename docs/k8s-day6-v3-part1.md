# 第六堂逐字稿 v3 Part 1 — 開場 + Loop 1-3

> 10 支影片（6-1 到 6-10）
> 接續第五堂結尾 5-26（NodePort 讓服務對外了，但地址太醜、設定寫死、密碼明文）
> 因果鏈：回顧 → Ingress（path + host routing）→ ConfigMap + Secret → 整合實作

---

# 開場

---

# 影片 6-1：第五堂回顧 + 第六堂因果鏈預覽（~10min）

## 本集重點

- 第五堂因果鏈快速串：k3s 多節點 → 擴縮容 → 滾動更新 → 回滾 → 自我修復 → Labels → ClusterIP → NodePort → DNS → Namespace → DaemonSet → CronJob → 從零串完整鏈路
- 第五堂結尾的問題：NodePort 192.168.1.100:30080 太醜
- 今天的因果鏈預覽：Ingress → ConfigMap → Secret → 整合 → PV/PVC → StatefulSet → Helm
- 每一步都是上一步沒解決的問題

**今天的因果鏈：**
```
NodePort 地址太醜 → Ingress（域名路由）
→ 設定寫死在 Image → ConfigMap（設定外部化）
→ 密碼放 ConfigMap 不安全 → Secret（敏感資料管理）
→ 三個串起來 → 整合實作（接近真實部署）
→ Pod 重啟資料消失 → PV/PVC（持久化）
→ Deployment 不適合跑 DB → StatefulSet
→ YAML 太多太散 → Helm（套件管理）
```

## 逐字稿

歡迎回來，第六堂課。

上堂課結束的時候，我說你們的服務「穿著睡衣出門」。今天我們就是要一件一件把正式的衣服穿上去。在開始之前，先花幾分鐘把第五堂走過的因果鏈快速串一遍，確保大家的記憶是熱的。

第四堂結尾我們學了 Deployment 基礎，但那時候只有一個 Node，三個 Pod 全擠在同一台機器上，完全看不出分散的效果。所以第五堂第一件事就是裝 k3s，建了一個真正的多節點叢集，一個 Master 加兩個 Worker。Pod 跑起來之後 kubectl get pods -o wide 一看，真的分散在不同 Node 上了。

有了多節點，我們就開始玩 Deployment 的三個核心能力。流量變了怎麼辦？擴縮容，kubectl scale 拉上去縮回來。新版本要上線？滾動更新，kubectl set image 一行搞定，K8s 自動逐步替換，服務不中斷。新版有 bug？回滾，kubectl rollout undo 一秒退回去。然後我們親手驗證了自我修復，刪掉 Pod 馬上補新的，甚至整台 Node 掛了 Pod 也會被調度到其他 Node。

接著我們搞懂了 Labels 和 Selector，K8s 靠這套機制認親，Deployment 的 selector 和 Pod 的 labels 要對上，Service 的 selector 也要對上。

下午進入了 Service。ClusterIP 讓叢集內部的 Pod 互相連，給了一個穩定的虛擬 IP 加上自動負載均衡。但 ClusterIP 只能叢集內部用，外面的人連不到。所以 NodePort 出場了，在每個 Node 上開一個 Port，外面的人用 Node IP 加上那個 Port 就能連進來。

然後我們發現叢集內部用 IP 連太蠢了，所以學了 DNS。K8s 的 CoreDNS 自動幫每個 Service 註冊 DNS 名字，Pod 裡面用 Service 名字就能連，不用記 IP。DNS 名字裡面有一個 Namespace 的部分，所以我們學了 Namespace，叢集裡的資料夾，用來隔離 dev 和 prod 環境。

最後學了兩個特殊的工作負載。DaemonSet 確保每個 Node 上跑一個 Pod，適合日誌收集和監控。CronJob 按排程定時跑任務，適合備份和清理。最後一個 Loop 我們把所有東西從零串了一遍，十個步驟走完就是一個基本的服務上線流程。

好，回顧完了。現在我問大家一個問題。

第五堂結束的時候，你的服務已經可以對外了。使用者在瀏覽器輸入 192.168.1.100 冒號 30080，可以看到你的網頁。但是，你把這個網址拿去給你的主管看，他會說什麼？「這什麼東西？客戶要記 IP 加 Port？你在開玩笑嗎？」

所以今天的第一個問題就是：怎麼讓使用者用域名連進來？www.myshop.com，不是 192.168.1.100:30080。這就是 Ingress 要解決的事情。

但 Ingress 只是今天的第一站。你想想看，Ingress 讓使用者用域名連進來了，你的 API 也跑起來了。但 API 要連資料庫，資料庫的地址和密碼寫在哪？寫死在 Dockerfile 裡面？build 成 Image 之後，dev 環境和 prod 環境的 IP 不一樣，你是要建兩個 Image？太蠢了。所以要學 ConfigMap，把設定從 Image 抽出來。

設定抽出來了，但密碼呢？資料庫密碼放 ConfigMap 裡面？ConfigMap 是明文的，任何能跑 kubectl 的人都看得到。所以要學 Secret，專門管密碼和敏感資料。

學完 Ingress、ConfigMap、Secret 之後，我們要把它們串起來做一個完整的練習。一個 Namespace 裡面有 Nginx 前端、API 後端、MySQL 資料庫，用 Ingress 做域名路由，用 ConfigMap 管設定，用 Secret 管密碼。這才像一個真正的系統。

那下午呢？下午還有三個問題。Pod 重啟資料消失，需要 PV 和 PVC 做持久化。Deployment 跑資料庫有問題，需要 StatefulSet。YAML 太多太散管不動，需要 Helm。但那是下午的事，上午我們先專注把 Ingress、ConfigMap、Secret 搞定。

每一步都是上一步沒解決的問題。這就是今天的因果鏈。好，開始第一個 Loop。

---

# Loop 1：Ingress

---

# 影片 6-2：Ingress 概念 — NodePort 太醜，使用者要域名（~15min）

## 本集重點

- 接 6-1：NodePort 的五個致命問題
- 使用者要的是 www.myshop.com → 需要 HTTP 層路由器 → Ingress
- Ingress 兩個角色：Ingress（規則/地圖）+ Ingress Controller（司機/執行者）
- k3s 內建 Traefik，minikube 要另外裝 nginx-ingress
- Path-based routing：同域名不同路徑 → 不同 Service
- Host-based routing：不同域名 → 不同 Service
- TLS/HTTPS：Ingress 設 SSL 憑證（cert-manager 簡提）
- Ingress YAML 拆解：apiVersion networking.k8s.io/v1、spec.rules
- 對照 Docker：自己架 Nginx 反向代理
- 第四堂概念篇講過，現在來實際做

**NodePort 的問題：**

| 問題 | 說明 |
|------|------|
| Port 醜 | 使用者要記 `:30080`，不專業 |
| Port 有限 | NodePort 範圍 30000-32767 |
| 沒有域名 | 使用者要記 IP |
| 沒有 HTTPS | 明文傳輸 |
| 每個服務一個 Port | 10 個服務 = 10 個 Port |

**Ingress 兩個角色：**

| 名稱 | 是什麼 | 類比 |
|------|--------|------|
| Ingress | YAML 規則定義 | Nginx 的 nginx.conf |
| Ingress Controller | 實際跑的 Pod，執行規則 | Nginx 程式本身 |

**兩種路由方式：**

| 方式 | URL 範例 | 適合場景 |
|------|----------|---------|
| Path-based | `myapp.com/` + `myapp.com/api` | 前後端同一域名 |
| Host-based | `www.myapp.com` + `api.myapp.com` | 微服務各有域名 |

**Ingress YAML（path-based）：**
```yaml
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

**Ingress YAML（host-based）：**
```yaml
spec:
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

**對照 Docker：**

| Docker | K8s |
|--------|-----|
| nginx.conf 設定檔 | Ingress YAML |
| Nginx 容器 | Ingress Controller Pod |
| 自己寫 server_name + location | spec.rules 裡的 host + paths |

## 逐字稿

上一支影片我們預覽了今天的因果鏈，第一個問題就是 NodePort 太醜。我們來仔細看看 NodePort 到底有哪些問題。

第一，Port 醜。30080 這種數字不是正常使用者會記的。你去逛購物網站，你輸入的是 momo.com，不是 203.69.116.155 冒號 30080。第二，Port 有限。NodePort 的範圍是 30000 到 32767，撐死了兩千多個。如果你的公司有幾百個微服務，每個都要一個 NodePort，很快就不夠用了。第三，沒有域名，使用者要記 IP。IP 會變，換台機器就連不到。第四，沒有 HTTPS，明文傳輸，瀏覽器會顯示「不安全」。第五，每個服務要開一個 Port。你有前端、後端、管理後台三個服務，就要開三個 NodePort，30080、30081、30082，管理起來很痛苦。

我們想要的是什麼？使用者輸入 www.myshop.com 就到前端，api.myshop.com 就到 API。一個 IP，標準的 80 和 443 Port，用域名和路徑來區分不同的服務。

如果你之前用過 Docker，你一定想到了。在 Docker 的時代，這個問題怎麼解決？在最前面放一台 Nginx 當反向代理。在 nginx.conf 裡面寫 server_name www.myshop.com，location 斜線 proxy_pass 到 frontend 容器。再寫一個 server_name api.myshop.com，proxy_pass 到 api 容器。域名路由就搞定了。

K8s 的 Ingress 做的事情完全一樣，它就是 K8s 世界裡的 Nginx 反向代理。但比你自己手寫 nginx.conf 更方便，因為它跟 K8s 整合在一起，可以自動發現 Service、自動更新路由規則。

其實第四堂概念篇我們已經提過 Ingress 了。當時我們在講八大組件的時候帶了一句：Ingress 是讓外面用域名連進來的。那時候只是介紹概念，今天我們要正式動手做。

在開始寫 YAML 之前，有一個觀念一定要搞清楚。Ingress 這個詞其實包含兩個東西。

第一個叫 Ingress，注意它只是一份 YAML 規則。你在裡面寫什麼域名、什麼路徑，導到哪個 Service。它只是一張地圖，本身不會做任何事。

第二個叫 Ingress Controller，它是一個真的在跑的 Pod。它會去讀你寫的 Ingress 規則，然後實際接收外部流量，根據規則轉發到對應的 Service。你可以把它想成一個司機，Ingress 是地圖，Ingress Controller 是拿著地圖開車的司機。沒有司機，地圖放在那裡也沒用。沒有 Ingress Controller，你的 Ingress YAML 就只是一份被忽略的文件。

常見的 Ingress Controller 有兩個。nginx-ingress 是社群最常用的，底層就是 Nginx。Traefik 是另一個選擇，k3s 安裝的時候就自動帶了 Traefik。我們的 k3s 環境已經有 Traefik 了，所以不用另外裝。如果你用 minikube，要自己跑 minikube addons enable ingress 來啟用 nginx-ingress。

好，搞清楚了 Ingress 和 Ingress Controller 的分別之後，來看怎麼寫路由規則。路由有兩種方式。

第一種叫 Path-based routing，用 URL 路徑來區分。同一個域名，斜線到前端 Service，斜線 api 到 API Service。就像 Nginx 裡面一個 server 底下寫多個 location。

第二種叫 Host-based routing，用域名來區分。www.myapp.local 到前端，api.myapp.local 到 API。就像 Nginx 裡面寫多個 server_name。

什麼時候用哪種？如果你的前端和後端是同一個產品的一部分，放在同一個域名底下很自然，那就用 Path-based。如果你是微服務架構，每個服務是不同團隊在維護，給每個服務獨立的域名比較乾淨，那就用 Host-based。當然也可以混用，同一個 Ingress YAML 裡面可以又有 host 又有 path。

來看 Ingress 的 YAML 怎麼寫。

apiVersion 是 networking.k8s.io/v1。注意跟 Deployment 的 apps/v1 不一樣，Ingress 屬於 networking 這個 API group，因為它是網路相關的資源。kind 寫 Ingress。

spec 裡面有一個 ingressClassName，告訴 K8s 要用哪個 Ingress Controller 來處理這條規則。k3s 寫 traefik，nginx-ingress 寫 nginx。

重點在 rules。每一條 rule 有 paths，paths 是一個陣列。每個 path 有三個東西：path 是 URL 路徑，pathType 是匹配方式，backend 是導向哪個 Service。

pathType 有兩個選項。Prefix 是前綴匹配，只要路徑以指定的字串開頭就算。比如你寫 path: /api，那 /api、/api/users、/api/v2/data 全部都會匹配到。Exact 是精確匹配，只有完全一模一樣才算。大部分情況用 Prefix 就對了。

backend 裡面指定 Service 的名字和 Port。service.name 是你的 ClusterIP Service 的名字，port.number 是 Service 暴露的 Port。

Host-based 的 YAML 差不多，就是在 rules 裡面多了一個 host 欄位。每個 host 是一條獨立的規則，底下再接 paths。

最後快速提一下 TLS。在生產環境你的網站一定要走 HTTPS。Ingress 支援 TLS，做法是把 SSL 憑證存在一個 Secret 裡面，然後在 Ingress YAML 的 tls 區塊指定要用哪個 Secret。Ingress Controller 就會用這個憑證來處理 HTTPS 連線。生產環境通常會搭配一個叫 cert-manager 的工具，它可以自動跟 Let's Encrypt 申請免費的 HTTPS 憑證，到期自動續約。今天不深入 TLS，知道有這個機制就好。

用 Docker 的經驗做最後的對照。Docker 時代你自己寫 nginx.conf，K8s 用 Ingress YAML。Docker 時代你跑一個 Nginx 容器，K8s 用 Ingress Controller Pod。格式不一樣，但做的事情完全一樣。差別在於 K8s 的 Ingress 跟叢集整合在一起，Service 加了、改了、刪了，路由自動更新，不用你手動改 nginx.conf 再 reload。

好，概念講完了。接下來我們動手做。

---

# 影片 6-3：Ingress 實作 — path routing + host routing（~15min）

## 本集重點

- 確認 Ingress Controller 在跑（k3s 的 Traefik）
- 部署兩個 Service：frontend（nginx）+ api（httpd）
- 寫 ingress.yaml（path-based）：/ → frontend-svc，/api → api-svc
- curl NODE-IP → 看到 nginx；curl NODE-IP/api → 看到 httpd
- 改成 host-based：www.myapp.local → frontend，api.myapp.local → api
- 修改 /etc/hosts 加入域名映射
- curl www.myapp.local → nginx；curl api.myapp.local → httpd
- 排錯流程：describe ingress、get endpoints、Controller logs

**Step 1：確認 Ingress Controller**
```bash
kubectl get pods -n kube-system | grep traefik
# 看到 traefik Pod 是 Running
```

**Step 2：部署應用 + path-based Ingress**
```bash
kubectl apply -f ingress-basic.yaml
kubectl get deployments
kubectl get svc
kubectl get ingress
kubectl describe ingress app-ingress
```

**Step 3：測試 path routing**
```bash
kubectl get nodes -o wide   # 看 INTERNAL-IP
curl http://<NODE-IP>/      # → Nginx 歡迎頁
curl http://<NODE-IP>/api   # → httpd 頁面
```

**Step 4：改成 host-based**
```bash
kubectl apply -f ingress-host.yaml
sudo sh -c 'echo "<NODE-IP> www.myapp.local api.myapp.local" >> /etc/hosts'
curl http://www.myapp.local       # → Nginx
curl http://api.myapp.local       # → httpd
```

**排錯流程：**
```bash
kubectl describe ingress app-ingress     # 看 Events
kubectl get endpoints                    # 確認 Service 有後端 Pod
kubectl logs -n kube-system <traefik-pod>  # Controller 日誌
```

**學員實作：**
- 必做：部署兩個服務 + path routing Ingress → curl 驗證
- 挑戰：改成 host routing + 第三個服務（admin，用 tomcat image）

## 逐字稿

好，概念講完，動手做。請大家打開終端機。

第一步，確認 Ingress Controller 有在跑。我們用的是 k3s，Traefik 是內建的，安裝 k3s 的時候就自動帶了。

kubectl get pods -n kube-system，然後用 grep traefik 過濾一下。

你應該看到一個或兩個 traefik 開頭的 Pod，狀態是 Running。如果你沒看到，有可能是安裝 k3s 的時候加了 --disable traefik 的參數把它關掉了。那你就需要另外裝 nginx-ingress，但正常情況 k3s 預設是帶 Traefik 的。

Controller 確認了，來部署我們的應用。我準備了一個 ingress-basic.yaml，裡面包含四個東西：frontend 的 Deployment 和 Service，用 nginx image；api 的 Deployment 和 Service，用 httpd image；還有一個 Ingress 規則，path-based routing。

kubectl apply -f ingress-basic.yaml

一次 apply 全部搞定。來看看建了什麼。

kubectl get deployments。兩個 Deployment，frontend-deploy 和 api-deploy，各一個副本。

kubectl get svc。兩個 ClusterIP Service，frontend-svc 和 api-svc。注意是 ClusterIP 不是 NodePort。因為有了 Ingress，我們不需要 NodePort 了。流量從 Ingress Controller 進來，直接轉到 ClusterIP Service。

kubectl get ingress。看到 app-ingress，CLASS 欄位顯示 traefik。ADDRESS 欄位可能一開始是空的，等幾秒就會出現 IP。

kubectl describe ingress app-ingress。看 Rules 那一段，會列出你定義的路由規則。斜線對應 frontend-svc 的 80 Port，斜線 api 對應 api-svc 的 80 Port。

好，來測試。先拿到 Node 的 IP。

kubectl get nodes -o wide，看 INTERNAL-IP 欄位。假設是 192.168.1.100。

curl http://192.168.1.100/

你應該看到 Nginx 的歡迎頁面，就是那個 Welcome to nginx 的 HTML。

curl http://192.168.1.100/api

你應該看到 httpd 的預設頁面，It works! 的字樣。

成功了。同一個 IP，同一個 Port 80，不需要 30080 這種醜陋的 Port 了。根據 URL 路徑的不同，流量被導到不同的 Service。這就是 Path-based routing 的威力。

好，path-based 做完了，來做 host-based。

我另外準備了一個 ingress-host.yaml，差別在 rules 裡面多了 host 欄位。第一條規則 host 是 www.myapp.local，path 斜線導到 frontend-svc。第二條規則 host 是 api.myapp.local，path 斜線導到 api-svc。

kubectl apply -f ingress-host.yaml

但有一個問題。www.myapp.local 這個域名是我們自己編的，DNS 查不到。在本地測試的時候，我們用修改 /etc/hosts 的方式來模擬 DNS。

sudo sh -c 'echo "192.168.1.100 www.myapp.local api.myapp.local" >> /etc/hosts'

把你實際的 Node IP 替換進去。這行指令的意思是告訴你的電腦：www.myapp.local 和 api.myapp.local 這兩個域名都指向 192.168.1.100。

改好了，來測試。

curl http://www.myapp.local

看到 Nginx 的歡迎頁面。

curl http://api.myapp.local

看到 httpd 的 It works! 頁面。

兩個不同的域名，同一個 IP，但 Ingress Controller 根據 HTTP 請求裡面的 Host header，把流量導到不同的 Service。這就是 Host-based routing。

如果測試的時候沒成功，排錯流程跟之前一樣。第一步 kubectl describe ingress 看 Events，有沒有錯誤訊息。第二步 kubectl get endpoints，確認 Service 後面確實有 Pod，如果 endpoints 是空的表示 selector 對不上。第三步看 Ingress Controller 的日誌，kubectl logs -n kube-system 加上 traefik 的 Pod 名字。

最常見的坑有三個。第一，/etc/hosts 忘記改，curl 域名的時候 DNS 解析不到。第二，ingressClassName 寫錯，k3s 要寫 traefik 不是 nginx。第三，pathType 忘記寫，Ingress YAML 裡面每個 path 都必須指定 pathType，不寫會報錯。

學員實作時間。必做題：照著剛才的步驟，部署兩個服務加上 path routing 的 Ingress，用 curl 驗證斜線到 nginx、斜線 api 到 httpd。挑戰題：改成 host routing，再加一個第三個服務，比如用 tomcat image 做一個 admin 服務，admin.myapp.local 導到它。記得 /etc/hosts 也要加上 admin.myapp.local。

---

# 影片 6-4：回頭操作 Loop 1（~5min）

## 本集重點

- 帶做 Ingress path routing + host routing
- 常見坑：/etc/hosts 忘記改、ingressClassName 寫錯、pathType 沒加
- 清理 /etc/hosts 多加的行
- 銜接：Ingress 搞定了，但設定寫死在 Image 裡...

## 逐字稿

來帶大家走一遍。

Path-based routing 的部分。kubectl apply -f ingress-basic.yaml，一次建好 Deployment、Service、Ingress。kubectl get ingress 確認規則有建好。curl NODE-IP 斜線看到 nginx，curl NODE-IP 斜線 api 看到 httpd。

Host-based routing 的部分。kubectl apply -f ingress-host.yaml。改 /etc/hosts 加上域名映射。curl www.myapp.local 看到 nginx，curl api.myapp.local 看到 httpd。

三個常見的坑。

第一，/etc/hosts 忘記改。你 curl www.myapp.local 的時候如果出現 Could not resolve host，那就是 /etc/hosts 沒有加那一行。這是最常見的。

第二，ingressClassName 寫錯。k3s 的 Ingress Controller 是 Traefik，所以 ingressClassName 要寫 traefik。如果你寫了 nginx，K8s 會去找名字叫 nginx 的 Ingress Controller，找不到的話 Ingress 就不會生效。你 describe ingress 會看到 ADDRESS 一直是空的。

第三，pathType 沒加。Ingress YAML 裡面每個 path 都必須指定 pathType，Prefix 或 Exact。這是必填欄位，漏了 kubectl apply 的時候就會報錯。

做完了記得清理。如果你不想讓 /etc/hosts 裡面留著測試用的域名映射，可以手動編輯把那一行刪掉。另外，kubectl delete -f ingress-basic.yaml 和 kubectl delete -f ingress-host.yaml 把資源也清掉。

好，Ingress 搞定了。現在使用者可以用漂亮的域名連到你的服務，不用再輸入 IP 加 Port 了。NodePort 的五個問題，Ingress 全部解決了。

但是，我要問大家另一個問題。你的服務跑起來了，使用者也連得到了。那你的 API 要連資料庫，資料庫的地址和密碼寫在哪裡？

如果你的答案是「寫在 Dockerfile 裡面」或者「寫死在 YAML 的 env 裡面」，那我們有新的問題要解決了。這就是下一個 Loop 要講的 ConfigMap 和 Secret。

---

# Loop 2：ConfigMap + Secret

---

# 影片 6-5：ConfigMap + Secret 概念 — 設定寫死的問題 + 密碼明文的問題（~15min）

## 本集重點

- 接 Loop 1：Ingress 搞定了，服務對外了
- 問題：API 連 DB 的地址寫死在 Image，dev 和 prod 不同 → 要 build 兩個 Image？
- 第四堂概念講過 ConfigMap → 現在實際用
- ConfigMap：把設定抽出來，跟 Image 分離
- 三種建立方式：--from-literal / --from-file / YAML
- 兩種使用方式：env 注入 vs Volume 掛載
- env 注入：改了要重啟 Pod
- Volume 掛載：自動更新（30-60 秒），但 subPath 不更新
- 密碼不能放 ConfigMap → Secret
- Secret 三種類型：Opaque / tls / dockerconfigjson
- Base64 不是加密（第四堂講過，再強調）
- RBAC 控權限（第七堂教）
- Sealed Secret 簡提：生產環境用 RSA 加密，Secret 可安全放 Git
- 對照 Docker：-e → ConfigMap，.env → Secret

**設定寫死的問題：**

| 問題 | 說明 |
|------|------|
| 環境不同 | dev 和 prod 的 DB 不一樣，要 build 兩個 Image？ |
| 密碼外洩 | 密碼寫在 Dockerfile，push 到 registry 全世界看到 |
| 改設定要重建 | 改一個環境變數就要重新 build |

**ConfigMap 三種建立方式：**
```bash
# 方式 1：--from-literal
kubectl create configmap app-config \
  --from-literal=APP_ENV=production \
  --from-literal=LOG_LEVEL=info

# 方式 2：--from-file
kubectl create configmap nginx-conf \
  --from-file=nginx.conf

# 方式 3：YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
```

**兩種注入方式：**

| 方式 | 用法 | 更新行為 | 適合 |
|------|------|---------|------|
| 環境變數 | envFrom / env.valueFrom | 改了要重啟 Pod | 簡單 key-value |
| Volume 掛載 | volumes + volumeMounts | 自動更新 30-60 秒 | 設定檔（nginx.conf） |

**ConfigMap vs Secret：**

| | ConfigMap | Secret |
|--|-----------|--------|
| 用途 | 一般設定 | 密碼、API Key、憑證 |
| 儲存 | 明文 | Base64 編碼（不是加密！） |
| describe | 直接看到值 | 只顯示大小 |
| Docker 對照 | -e KEY=value | .env 密碼 |

**Secret 三種類型：**

| 類型 | 用途 |
|------|------|
| Opaque | 通用（最常用）— 密碼、API Key |
| kubernetes.io/tls | TLS 憑證（Ingress HTTPS） |
| kubernetes.io/dockerconfigjson | Docker Registry 認證（拉私有 Image） |

## 逐字稿

上一個 Loop 我們搞定了 Ingress，使用者可以用域名連到你的服務了。前端用 www.myapp.local，API 用 api.myapp.local，不用再記 IP 加 Port。很好。

但是，現在你的 API 要連資料庫。資料庫的地址在哪？

我看到很多人的做法是這樣。在 Dockerfile 裡面寫 ENV DB_HOST 等於 192.168.1.50，ENV DB_PORT 等於 3306，ENV DB_PASSWORD 等於 my-secret-pw。Build 成 Image，push 到 registry，deploy 到 K8s。看起來沒問題。

但你想過幾個問題嗎？

第一，你的 dev 環境資料庫在 dev-db 冒號 3306，prod 環境在 prod-db 冒號 3306。IP 不一樣。你是要 build 兩個 Image？myapp:dev 一個，myapp:prod 一個？就因為一個環境變數不一樣就要建兩個 Image？如果你有 dev、staging、prod 三個環境，是不是要建三個？加上國際版和國內版呢？五個？太荒謬了。

第二，密碼寫在 Dockerfile 裡面。你把 Image push 到 Docker Hub，如果 repo 是公開的，全世界的人都能 pull 你的 Image 然後 inspect 看到你的資料庫密碼。恭喜你，你的資料庫被駭了。就算是私有 repo，只要有人能 pull 你的 Image 就能看到密碼，安全風險很大。

第三，改一個設定就要重新 build Image。你只是想把 LOG_LEVEL 從 info 改成 debug 看一下日誌，結果要走一遍完整的 CI/CD pipeline：改 Dockerfile、build、push、deploy。就為了一個環境變數？

這些問題用 Docker 的經驗你都知道怎麼解決。不要把設定寫死在 Dockerfile 裡面，用 docker run -e 在啟動的時候注入。-e DB_HOST 等於什麼什麼，-e DB_PASSWORD 等於什麼什麼。設定跟 Image 分離，同一個 Image 不同環境用不同的參數啟動就好。

K8s 的做法一模一樣，只是工具升級了。一般設定用 ConfigMap，敏感資料用 Secret。

其實第四堂概念篇我們已經介紹過 ConfigMap 和 Secret 了。當時我們在講八大組件的時候提過，ConfigMap 管設定，Secret 管密碼。但那時候只是帶一句話，今天我們要真正搞懂它、用起來。

先講 ConfigMap。你可以把 ConfigMap 想成一個集中存放設定的物件。裡面就是 key-value，跟你寫 .env 檔案一樣。APP_ENV 等於 production，LOG_LEVEL 等於 info，DB_HOST 等於 prod-db。把這些東西存在 ConfigMap 裡面，然後讓 Pod 去引用它。

建立 ConfigMap 有三種方式。

第一種，用 kubectl 指令加上 --from-literal。kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info。快速方便，適合臨時測試。

第二種，用 --from-file。kubectl create configmap nginx-conf --from-file=nginx.conf。把一整個檔案存進 ConfigMap，key 就是檔案名稱，value 就是檔案內容。適合設定檔，像 nginx.conf、my.cnf 這種。

第三種，寫 YAML。apiVersion v1，kind ConfigMap，data 裡面列出所有的 key-value。這是最推薦的方式，因為 YAML 可以放進 Git 做版本管理。

建好了之後，怎麼讓 Pod 用到這些設定？兩種方式。

第一種是注入為環境變數。在 Pod 的 YAML 裡面用 envFrom 加上 configMapRef，就可以把 ConfigMap 裡面所有的 key 一次全部變成 Pod 裡的環境變數。或者用 env 加上 valueFrom configMapKeyRef 逐一指定。Pod 裡面的程式讀環境變數就能拿到。

第二種是掛載為 Volume。ConfigMap 裡面的每個 key 會變成一個檔案，value 就是檔案內容。這種方式適合設定檔。比如你要把自訂的 nginx.conf 掛進 Nginx 容器的 /etc/nginx/conf.d 目錄。

這兩種方式有一個很重要的差異：更新行為。如果你用環境變數注入，改了 ConfigMap 之後 Pod 不會自動更新，你必須 kubectl rollout restart 重啟 Pod 才會吃到新的值。因為環境變數是 process 啟動的時候讀一次就定死了。但如果你用 Volume 掛載，改了 ConfigMap 之後，Pod 裡面的檔案會在 30 到 60 秒內自動更新，不用重啟 Pod。不過這裡有一個坑：如果你用了 subPath 掛載，就不會自動更新。這個坑等一下實作的時候會講到。

好，ConfigMap 管一般設定。那密碼呢？

你不會把資料庫密碼放在 ConfigMap 裡面吧？ConfigMap 是明文的。你 kubectl get configmap app-config -o yaml，所有的值直接印出來。任何能跑 kubectl 的人都看得到。

密碼、API Key、SSL 憑證這些敏感資料，要用 Secret 來管。

Secret 和 ConfigMap 很像，都是存 key-value 的，建立和使用的方式幾乎一模一樣。差別在哪？首先，Secret 的值是用 Base64 編碼存的。其次，你 kubectl describe secret 的時候，它只會顯示每個 key 的大小，不會直接把值印出來。

但我要特別強調一件事。這件事第四堂概念篇我已經講過，但因為太重要了，我要再講一次。Base64 編碼不是加密。

echo -n "my-secret-pw" 用 pipe 接 base64，得到一串看起來像亂碼的字。但只要反過來 echo 那串字 pipe base64 -d，馬上就解回明文。任何人都能做。所以 Secret 的安全性不是靠 Base64 編碼，而是靠 RBAC 權限控制。只有被授權的人才能 kubectl get secret。RBAC 怎麼設第七堂會教。

Secret 有三種類型。最常用的是 Opaque，就是通用型，密碼、API Key 都放這裡。kubernetes.io/tls 專門存 TLS 憑證，就是剛才 Ingress HTTPS 提到的那個。kubernetes.io/dockerconfigjson 是存 Docker Registry 的帳號密碼，讓 kubelet 能拉私有 Image。

最後快速提兩分鐘 Sealed Secret。在真實的生產環境，你不會把 Secret 的 YAML 直接 commit 到 Git。因為就算是私有 repo，裡面的 Base64 值一解碼密碼就曝光了。但你又想要所有的 K8s 資源都用 Git 管版本，這就矛盾了。

Sealed Secret 是一個開源工具，它用 RSA 非對稱加密把你的 Secret 加密成 SealedSecret。加密後的 YAML 可以安全地 commit 到 Git，因為只有叢集裡面的 controller 有私鑰能解密。外面的人看到加密後的值也沒用。這就解決了「Secret 怎麼放進 Git」的問題。今天不深入 Sealed Secret，知道有這個東西就好。

用 Docker 的經驗做最後的對照。Docker 的 -e KEY=value 對應 K8s 的 ConfigMap。Docker 的 .env 密碼檔對應 K8s 的 Secret。Docker 的 -v ./nginx.conf:/etc/nginx/nginx.conf 對應 ConfigMap 的 Volume 掛載。概念完全一樣，管理方式更結構化了。

好，概念夠了，接下來動手做。

---

# 影片 6-6：ConfigMap + Secret 實作（~15min）

## 本集重點

- ConfigMap 三種建立方式全做一遍
- Pod 用 envFrom 讀 ConfigMap → 進 Pod 看環境變數
- Volume 掛載 nginx.conf → 修改 ConfigMap → 等自動更新（subPath 不更新的坑）
- Secret：kubectl create secret generic
- Pod 用 env 引用 Secret → 進 Pod echo $PASSWORD
- 整合：MySQL Pod 用 Secret 設密碼、ConfigMap 設其他參數

**Step 1：ConfigMap — 環境變數注入**
```bash
kubectl apply -f configmap-literal.yaml
kubectl logs deployment/app-with-config | head -20
# 看到 APP_ENV=production、LOG_LEVEL=info

# 改 ConfigMap → Pod 不會自動更新
kubectl edit configmap app-config
# 把 LOG_LEVEL 改成 debug
kubectl logs deployment/app-with-config | grep LOG_LEVEL
# 還是 info！
kubectl rollout restart deployment/app-with-config
kubectl logs deployment/app-with-config | grep LOG_LEVEL
# 現在才是 debug
```

**Step 2：ConfigMap — Volume 掛載**
```bash
kubectl apply -f configmap-nginx.yaml
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
kubectl port-forward svc/nginx-custom-svc 8080:80 &
curl http://localhost:8080/healthz   # → OK

# 改 ConfigMap → 檔案自動更新
kubectl edit configmap nginx-config
# 把 'OK' 改成 'HEALTHY'
# 等 30-60 秒
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
# 檔案更新了！但 Nginx 要 reload
kubectl exec deploy/nginx-custom -- nginx -s reload
curl http://localhost:8080/healthz   # → HEALTHY
```

**Step 3：Secret — 建立 + 注入**
```bash
kubectl create secret generic db-cred \
  --from-literal=username=admin \
  --from-literal=password=my-secret-pw

kubectl describe secret db-cred      # 只顯示大小
kubectl get secret db-cred -o yaml   # 看到 Base64
echo "bXktc2VjcmV0LXB3" | base64 -d # → my-secret-pw
```

**Step 4：整合 — MySQL 用 Secret + ConfigMap**
```bash
kubectl apply -f secret-db.yaml
kubectl get pods -l app=mysql -w
kubectl exec -it deployment/mysql-deploy -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
# 看到 myappdb
```

**學員實作：**
- 必做：建 ConfigMap + Secret → MySQL Pod 用 Secret 設密碼 + ConfigMap 設 MYSQL_DATABASE
- 挑戰：Volume 掛載自訂 nginx.conf → 修改 ConfigMap → 觀察自動更新

## 逐字稿

好，概念講完了，四個步驟，一步一步做。

第一步，ConfigMap 的環境變數注入。

kubectl apply -f configmap-literal.yaml

這個 YAML 裡面有一個 ConfigMap 叫 app-config，存了 APP_ENV、LOG_LEVEL、API_URL、MAX_CONNECTIONS 四個設定。還有一個 Deployment，用 busybox 跑 env pipe sort 印出所有環境變數，然後 sleep 等著。

等 Pod 跑起來，看看日誌。

kubectl logs deployment/app-with-config，用 pipe head -20 只看前 20 行。

你應該能在輸出裡面找到 APP_ENV 等於 production、LOG_LEVEL 等於 info。ConfigMap 的值成功注入為環境變數了。

現在來做一個重要的實驗。我們改 ConfigMap，看看 Pod 會不會自動更新。

kubectl edit configmap app-config

找到 LOG_LEVEL，從 info 改成 debug，存檔。

現在 kubectl logs 看一下。你猜結果是什麼？

還是 info。沒有更新。

為什麼？因為環境變數是在 Pod 啟動的時候注入的。Pod 的 process 拿到環境變數之後就定死了，ConfigMap 後來改了，已經跑著的 process 不知道。就像你啟動一個 Java 程式的時候傳了 -D 參數，程式啟動之後你再怎麼改那個參數檔，跑著的 JVM 也不會感應到。

要讓新的值生效，你得重啟 Pod。

kubectl rollout restart deployment/app-with-config

等新的 Pod 起來，再看日誌，現在才是 debug。

記住這個行為：環境變數注入，改了 ConfigMap 要重啟 Pod 才生效。

第二步，ConfigMap 的 Volume 掛載。

kubectl apply -f configmap-nginx.yaml

這個 YAML 裡面有一個 ConfigMap 叫 nginx-config，裡面存了一段 Nginx 設定，定義了一個 /healthz 端點回傳 OK。還有一個 Nginx 的 Deployment，用 volumes 和 volumeMounts 把 ConfigMap 掛載到 /etc/nginx/conf.d 目錄。

先確認設定檔有掛進去。

kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf

看到我們寫的那段 Nginx 設定。

來測試一下。kubectl port-forward svc/nginx-custom-svc 8080:80 &，背景跑 port-forward。然後 curl http://localhost:8080/healthz，回 OK。完美。

現在來測試 Volume 掛載的熱更新。改 ConfigMap。

kubectl edit configmap nginx-config

把 return 200 後面的 OK 改成 HEALTHY，存檔。

等 30 到 60 秒。這次我們不重啟 Pod，直接看檔案。

kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf

檔案內容自動更新了，變成 HEALTHY 了。不用重啟 Pod，kubelet 定期把 ConfigMap 的新內容同步到 Pod 裡面的掛載目錄。

但注意，Nginx process 本身不會自動 reload。檔案雖然改了，Nginx 還是用舊設定在跑。你 curl 一下還是回 OK。要手動 reload。

kubectl exec deploy/nginx-custom -- nginx -s reload

現在再 curl，回 HEALTHY 了。

這裡有一個坑要提醒。如果你用 subPath 掛載，就是只掛一個檔案而不是覆蓋整個目錄，那熱更新不會生效。這是 K8s 的已知行為。所以如果你需要熱更新功能，不要用 subPath。但不用 subPath 的話，整個目錄會被 ConfigMap 覆蓋，原本目錄裡的其他檔案會不見。這是一個取捨，要根據你的場景選擇。

kill %1，把背景的 port-forward 停掉。

第三步，Secret。

不用寫 YAML，直接用指令建。

kubectl create secret generic db-cred --from-literal=username=admin --from-literal=password=my-secret-pw

建好了，看看長什麼樣。

kubectl describe secret db-cred

注意看，它只顯示每個 key 的大小，username 5 bytes，password 12 bytes。不會直接秀值，跟 ConfigMap 不一樣。

但如果你用 -o yaml 看呢？

kubectl get secret db-cred -o yaml

看到 Base64 編碼的值。隨便挑一個 decode 一下，echo 那串字 pipe base64 -d，得到明文。所以我再三強調，Base64 不是加密。安全性靠的是 RBAC 限制誰能 kubectl get secret。

Secret 注入 Pod 的方式跟 ConfigMap 一模一樣，envFrom 或 Volume 掛載，YAML 寫法幾乎一樣，只是把 configMapRef 換成 secretRef。

第四步，整合。MySQL Pod 用 Secret 設密碼，用 ConfigMap 設資料庫名稱。

kubectl apply -f secret-db.yaml

這個 YAML 裡面有一個 Secret 存了 MySQL 的 root 密碼和其他認證資訊，一個 ConfigMap 存了 MYSQL_DATABASE 資料庫名稱，一個 MySQL 的 Deployment 用 envFrom 同時引用 Secret 和 ConfigMap，還有一個 ClusterIP Service。

等 MySQL Pod 跑起來，大概 30 秒。kubectl get pods -l app=mysql -w，等到 Running。

驗證一下。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123 -e "SHOW DATABASES;"

看到 myappdb 在列表裡。Secret 的 MYSQL_ROOT_PASSWORD 和 ConfigMap 的 MYSQL_DATABASE 都成功注入了，MySQL 讀到這些環境變數之後自動建立了資料庫。

這就是 ConfigMap 和 Secret 搭配使用的標準模式。非敏感的設定放 ConfigMap，密碼放 Secret，Pod 用 envFrom 一次把兩個都引用進來。

學員實作時間。必做題：建一個 ConfigMap 存 MYSQL_DATABASE 等於 testdb，建一個 Secret 存 MYSQL_ROOT_PASSWORD，然後部署 MySQL Pod 用 envFrom 引用這兩個，進 MySQL 確認 testdb 存在。挑戰題：用 Volume 掛載方式自訂一個 nginx.conf，然後修改 ConfigMap，等 30 到 60 秒觀察檔案是否自動更新。

---

# 影片 6-7：回頭操作 Loop 2（~5min）

## 本集重點

- 帶做 ConfigMap 環境變數 + Volume 掛載 + Secret + MySQL 整合
- 常見坑：envFrom vs env 搞混、subPath 不自動更新、Base64 編碼忘記
- 銜接：設定和密碼都管好了，串起來做一個完整的練習

## 逐字稿

來帶大家走一遍。

ConfigMap 環境變數注入。kubectl apply -f configmap-literal.yaml。kubectl logs 看到環境變數有注入。kubectl edit configmap 改 LOG_LEVEL，Pod 不會自動更新。kubectl rollout restart，重啟之後才生效。

ConfigMap Volume 掛載。kubectl apply -f configmap-nginx.yaml。kubectl exec cat 確認設定檔掛進去了。kubectl edit configmap 改內容，等一分鐘，檔案自動更新了，但 Nginx 要手動 reload。

Secret。kubectl create secret generic 建好。kubectl describe 只看到大小。kubectl get -o yaml 看到 Base64 值。

整合。kubectl apply -f secret-db.yaml。等 MySQL 起來，kubectl exec 進去確認資料庫存在。

三個常見的坑。

第一，envFrom 和 env 搞混。envFrom 加上 configMapRef 是把整個 ConfigMap 的所有 key 都變成環境變數。env 加上 valueFrom configMapKeyRef 是只挑特定的 key。如果你的 ConfigMap 裡面的 key 名字跟你想要的環境變數名字一樣，用 envFrom 比較省事。如果你想要重新命名，比如 ConfigMap 的 key 叫 db_host 但你要設成 DATABASE_HOST，那就用 env 加 valueFrom 逐一對應。

第二，subPath 不自動更新。如果你用 subPath 掛載單一檔案，ConfigMap 改了之後 Pod 裡的檔案不會自動更新。很多人踩過這個坑，以為 Volume 掛載就一定會自動更新，結果等半天沒反應。記住，只有整個目錄掛載才會自動更新。

第三，Secret 的 YAML 裡面 data 欄位的值要 Base64 編碼。很多人直接寫明文，apply 之後 Pod 拿到的是亂碼。如果你嫌 Base64 麻煩，可以用 stringData 欄位寫明文，K8s 會自動幫你編碼。或者更好，直接用 kubectl create secret 指令建立，完全不用碰 Base64。

好，ConfigMap 和 Secret 都搞定了。到目前為止我們學了三樣東西：Ingress 讓使用者用域名連進來，ConfigMap 把設定從 Image 抽出來，Secret 把密碼安全地管理起來。

那接下來，我們不學新東西了。我們把這三樣串起來，做一個完整的整合實作。一個真正接近生產環境的部署，有前端、有後端、有資料庫，用 Ingress 做路由、用 ConfigMap 管設定、用 Secret 管密碼。

---

# Loop 3：整合實作

---

# 影片 6-8：整合實作引導 — Ingress + ConfigMap + Secret 一起用（~12min）

## 本集重點

- 前兩個 Loop 分別學了 Ingress 和 ConfigMap/Secret
- 串起來：完整服務 = Namespace + Deployment + Service + Ingress + ConfigMap + Secret
- 步驟引導：
  1. Namespace: my-app
  2. Secret（MySQL 密碼）
  3. ConfigMap（MySQL 資料庫名 + API 設定）
  4. MySQL Deployment + ClusterIP Service
  5. Nginx Deployment + ConfigMap（自訂首頁）+ ClusterIP Service
  6. Ingress（myapp.local → nginx，myapp.local/api → httpd API）
- 這是一個「接近真實」的部署

**架構圖：**
```
使用者
  │
  ↓
Ingress（myapp.local）
  ├── /      → frontend-svc → Nginx Pod（ConfigMap: 自訂首頁）
  └── /api   → api-svc      → httpd Pod（ConfigMap: API 設定）
                                 │
                                 ↓
                            mysql-svc → MySQL Pod（Secret: 密碼、ConfigMap: DB 名）
```

**完整步驟：**
```
Step 1：kubectl create namespace my-app
Step 2：建 Secret（MySQL root 密碼）
Step 3：建 ConfigMap（MYSQL_DATABASE + API 設定）
Step 4：部署 MySQL Deployment + ClusterIP Service
Step 5：部署 Nginx Deployment + ClusterIP Service
Step 6：部署 httpd API Deployment + ClusterIP Service
Step 7：建 Ingress（path-based routing）
Step 8：修改 /etc/hosts
Step 9：curl 驗證
```

## 逐字稿

好，前兩個 Loop 分別學了 Ingress 和 ConfigMap 加 Secret。每個 Loop 都是獨立練的。但在真實的工作中，這些東西不會單獨存在，它們是組合在一起的。一個完整的服務部署，通常包含 Namespace、Deployment、Service、Ingress、ConfigMap、Secret，缺一不可。

這個 Loop 我們就來做一個完整的整合。不學新概念，純粹把前面學的東西串在一起。

看螢幕上的架構圖。使用者透過 Ingress 進來。myapp.local 斜線到 Nginx 前端，myapp.local 斜線 api 到 httpd 後端。後端連 MySQL 資料庫。Nginx 的自訂首頁用 ConfigMap 管理。MySQL 的密碼用 Secret 管理，資料庫名稱用 ConfigMap 管理。

一共九個步驟，我帶大家走一遍流程。

Step 1，建 Namespace。所有東西放在 my-app 裡面，不要汙染 default。真實專案一定會有自己的 Namespace，這是好習慣。

Step 2，建 Secret。MySQL 的 root 密碼放在 Secret 裡面。為什麼 Secret 先建？因為後面的 MySQL Deployment 要引用它。被依賴的資源先建，這是一個順序原則。

Step 3，建 ConfigMap。放兩組設定：MYSQL_DATABASE 告訴 MySQL 建哪個資料庫，API 設定給後端用。

Step 4，部署 MySQL。Deployment 加上 ClusterIP Service。MySQL Pod 用 envFrom 引用 Secret 和 ConfigMap。Service 讓叢集內部的其他 Pod 能用 mysql-svc 這個 DNS 名字連到 MySQL。

Step 5，部署 Nginx 前端。Deployment 加上 ClusterIP Service。ConfigMap 掛載一個自訂的 index.html，顯示 My App Frontend 而不是預設的 Welcome to nginx。

Step 6，部署 httpd 做 API。Deployment 加上 ClusterIP Service。

Step 7，建 Ingress。Path-based routing，斜線到 frontend-svc，斜線 api 到 api-svc。

Step 8，修改 /etc/hosts，加上 myapp.local 指向 Node IP。

Step 9，curl 驗證。curl myapp.local 看到自訂的 Nginx 首頁。curl myapp.local/api 看到 httpd 的 It works! 頁面。

九個步驟走完，你就有了一個「接近真實」的部署。多個服務跑在同一個 Namespace 裡面，設定和密碼從 Image 裡抽出來了，使用者用域名就能連進來。

跟第五堂最後的綜合實作比一比。第五堂我們做的是 Namespace、Deployment、ClusterIP、NodePort，然後 scale、滾動更新、回滾。那是一個最基本的服務生命周期。今天在那個基礎上加了三樣東西：Ingress 取代了 NodePort，ConfigMap 管設定，Secret 管密碼。每加一個功能，你的服務就離正式上線更近一步。

有人可能會問，這裡的 MySQL 資料不會消失嗎？答案是會。因為我們還沒有做持久化，Pod 重啟資料就沒了。那是下午要解決的問題，PV 和 PVC。今天上午先把這個架構搭起來，功能先跑通，持久化下午再加。

好，流程講完了，下一支影片我們一步一步把它建起來。

---

# 影片 6-9：整合實作示範（~15min）

## 本集重點

- 一步一步建：Namespace → Secret → ConfigMap → MySQL → Nginx → httpd → Ingress
- 驗證每一步
- 最終 curl myapp.local 看到自訂 Nginx 頁面

**Step 1：Namespace**
```bash
kubectl create namespace my-app
```

**Step 2：Secret**
```bash
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=rootpassword123 \
  -n my-app
```

**Step 3：ConfigMap**
```bash
# MySQL 用的
kubectl create configmap mysql-config \
  --from-literal=MYSQL_DATABASE=myappdb \
  -n my-app

# Nginx 自訂首頁用的
# configmap-frontend.yaml（含 index.html 內容）
kubectl apply -f configmap-frontend.yaml
```

**Step 4-6：MySQL + Nginx + httpd**
```bash
kubectl apply -f integration-all.yaml
kubectl get all -n my-app
```

**Step 7：Ingress**
```bash
kubectl apply -f integration-ingress.yaml
kubectl get ingress -n my-app
```

**Step 8-9：hosts + 驗證**
```bash
sudo sh -c 'echo "<NODE-IP> myapp.local" >> /etc/hosts'
curl http://myapp.local/        # → 自訂 Nginx 首頁
curl http://myapp.local/api     # → httpd It works!
```

**驗證 MySQL：**
```bash
kubectl exec -it deployment/mysql-deploy -n my-app -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
# 看到 myappdb
```

**學員實作：**
- 必做：跟著做一遍完整整合
- 挑戰：加入第三個服務（Redis），ConfigMap 設 Redis 連線參數

## 逐字稿

好，開始一步一步建。大家跟著做。

Step 1，建 Namespace。

kubectl create namespace my-app

所有東西都放在 my-app 裡面。之後每個指令都要加 -n my-app，不然東西會建到 default 去。這是最容易犯的錯。如果你嫌每次都加 -n 很煩，可以 kubectl config set-context --current --namespace=my-app 把預設 Namespace 切過去。但要記得做完之後切回來。

Step 2，建 Secret。

kubectl create secret generic mysql-secret --from-literal=MYSQL_ROOT_PASSWORD=rootpassword123 -n my-app

用指令建，不用手動 Base64。K8s 自動幫你處理。

確認一下。kubectl get secret mysql-secret -n my-app。看到了。kubectl describe secret mysql-secret -n my-app，MYSQL_ROOT_PASSWORD 有 15 bytes，沒問題。

Step 3，建 ConfigMap。

先建 MySQL 用的 ConfigMap。

kubectl create configmap mysql-config --from-literal=MYSQL_DATABASE=myappdb -n my-app

再建 Nginx 自訂首頁用的 ConfigMap。這個用 YAML 比較方便，因為 index.html 的內容比較長。

kubectl apply -f configmap-frontend.yaml

這個 YAML 裡面有一個 ConfigMap 叫 frontend-config，data 裡面有一個 key 叫 index.html，值是一段簡單的 HTML，顯示 My App Frontend 加上一些說明文字。

kubectl get configmap -n my-app。看到 mysql-config 和 frontend-config，兩個都在。

Step 4，部署 MySQL。

kubectl apply -f integration-all.yaml

這個 YAML 是我事先準備好的，裡面包含 MySQL 的 Deployment 和 Service、Nginx 的 Deployment 和 Service、httpd 的 Deployment 和 Service。全部在 my-app Namespace 裡面。

MySQL 的 Deployment 用 envFrom 引用 mysql-secret 和 mysql-config，把密碼和資料庫名稱都注入為環境變數。Nginx 的 Deployment 用 Volume 掛載 frontend-config 裡面的 index.html 到 /usr/share/nginx/html/ 目錄。

等一下，一次 apply 比較快，但我先讓大家看看建了什麼。

kubectl get all -n my-app

三個 Deployment，三組 Pod，三個 ClusterIP Service。MySQL 的 Pod 可能需要 30 秒才會 Running，它要初始化資料庫。等一下再回來看。

先驗證 Secret 和 ConfigMap 有沒有正確注入。

kubectl exec -it deployment/mysql-deploy -n my-app -- mysql -u root -prootpassword123 -e "SHOW DATABASES;"

如果 MySQL 還在啟動，等一下再試。正常的話你會看到 myappdb 在列表裡面。Secret 的密碼和 ConfigMap 的資料庫名稱都成功注入了。

Step 7，建 Ingress。

kubectl apply -f integration-ingress.yaml

這個 YAML 裡面就是一個 Ingress，path-based routing。斜線到 frontend-svc 的 80 Port，斜線 api 到 api-svc 的 80 Port。ingressClassName 是 traefik。

kubectl get ingress -n my-app。看到 integration-ingress，等 ADDRESS 出現。

Step 8，修改 /etc/hosts。

kubectl get nodes -o wide，拿到 Node IP。假設是 192.168.1.100。

sudo sh -c 'echo "192.168.1.100 myapp.local" >> /etc/hosts'

Step 9，最終驗證。

curl http://myapp.local/

你應該看到我們自訂的 HTML 頁面，My App Frontend。不是 Nginx 的預設歡迎頁，是我們用 ConfigMap 掛進去的自訂首頁。

curl http://myapp.local/api

看到 httpd 的 It works! 頁面。

成功了。一個 Namespace 裡面跑了三個服務，MySQL 資料庫用 Secret 管密碼、用 ConfigMap 設資料庫名稱，Nginx 前端用 ConfigMap 掛載自訂首頁，Ingress 做域名路由把流量導到對應的 Service。

這就是一個接近真實的部署。當然還不完美，MySQL 的資料沒有持久化，也沒有 HTTPS。但作為上午三個 Loop 的整合練習，它展示了 Ingress、ConfigMap、Secret 怎麼搭配使用。

學員實作時間。必做題：跟著剛才的步驟完整做一遍。每一步都自己敲指令，不要只是看。做完之後 curl 驗證兩個路徑都通。挑戰題：在 my-app 裡面再加一個 Redis 服務，用 ConfigMap 設定 Redis 的連線參數，用 Ingress 的 path 把 myapp.local/cache 導到 Redis 的 Service。

---

# 影片 6-10：回頭操作 + 上午總結（~5min）

## 本集重點

- 帶做整合實作
- 常見坑：忘記加 -n my-app、Secret 先建才能被引用、/etc/hosts 忘記改
- 上午三個 Loop 總結：NodePort 太醜 → Ingress → 設定寫死 → ConfigMap/Secret → 串起來用
- 下午預告：容器掛了資料消失 → PV/PVC → StatefulSet → Helm

**上午因果鏈回顧：**
```
NodePort 192.168.1.100:30080 太醜
→ Ingress：用域名 + 路徑路由（path-based / host-based）
→ 設定寫死在 Image，換環境要重 build
→ ConfigMap：設定外部化（env 注入 / Volume 掛載）
→ 密碼放 ConfigMap 不安全
→ Secret：敏感資料管理（Base64 編碼 + RBAC 控權限）
→ 三個串起來 → 完整的整合實作
```

**Docker → K8s 對照表（今天新增）：**

| Docker | K8s | 哪一堂學的 |
|:---|:---|:---|
| Nginx 反向代理 | Ingress | 第六堂 |
| -e KEY=value | ConfigMap | 第六堂 |
| .env 密碼 | Secret | 第六堂 |

**下午預告：**
```
MySQL Pod 重啟 → 資料消失 → PV/PVC
手動建 PV 太煩 → StorageClass
Deployment 跑 DB 有問題 → StatefulSet
YAML 太多太散 → Helm
```

## 逐字稿

來帶大家走一遍整合實作的流程。

kubectl create namespace my-app。建 Namespace。

kubectl create secret generic mysql-secret --from-literal=MYSQL_ROOT_PASSWORD=rootpassword123 -n my-app。建 Secret。

kubectl create configmap mysql-config --from-literal=MYSQL_DATABASE=myappdb -n my-app。建 MySQL 的 ConfigMap。

kubectl apply -f configmap-frontend.yaml。建 Nginx 首頁的 ConfigMap。

kubectl apply -f integration-all.yaml。一次部署三個服務。

kubectl apply -f integration-ingress.yaml。建 Ingress。

改 /etc/hosts 加上 myapp.local。

curl myapp.local 看到自訂首頁，curl myapp.local/api 看到 httpd。

三個常見的坑。

第一，忘記加 -n my-app。你的 Secret 建在 default 裡面，MySQL 的 Deployment 在 my-app 裡面找不到 Secret，Pod 就會起不來。狀態會是 CreateContainerConfigError。kubectl describe pod 看 Events 就會看到找不到 Secret 的錯誤訊息。Secret、ConfigMap 和引用它們的 Pod 必須在同一個 Namespace。

第二，建立順序搞錯。Secret 和 ConfigMap 必須在 Deployment 之前建好。如果你先 apply Deployment，Pod 找不到 Secret，就會一直卡在 CreateContainerConfigError。雖然你後來補建 Secret，Pod 也不一定會自動恢復，可能需要手動刪 Pod 讓 Deployment 重建。

第三，/etc/hosts 忘記改。curl myapp.local 的時候出現 Could not resolve host。老問題了，Ingress 那個 Loop 就提過。

好，上午三個 Loop 做完了。我們來總結一下今天上午走過的因果鏈。

出發點是第五堂結束時的問題：NodePort 192.168.1.100:30080 太醜，使用者不會輸入這種地址。所以我們學了 Ingress，讓使用者用域名加路徑連進來，path-based 和 host-based 兩種路由方式。

Ingress 搞定了，服務對外了。但 API 連資料庫的地址和設定寫死在 Image 裡面，換環境就要重 build。所以我們學了 ConfigMap，把設定從 Image 裡抽出來。環境變數注入改了要重啟 Pod，Volume 掛載可以自動更新。

設定抽出來了，但密碼不能放 ConfigMap，因為 ConfigMap 是明文的。所以我們學了 Secret，專門管敏感資料。Base64 不是加密，安全性靠 RBAC。

最後我們把三樣東西串起來做了一個完整的整合實作。Namespace 裡面有 MySQL 資料庫、Nginx 前端、httpd 後端。Secret 管密碼，ConfigMap 管設定，Ingress 做域名路由。九個步驟走完就是一個接近真實的部署。

螢幕上是更新過的 Docker 到 K8s 對照表。Nginx 反向代理對應 Ingress，-e KEY=value 對應 ConfigMap，.env 密碼檔對應 Secret。每學一個新東西，對照表就多一行。

接下來預告一下下午。

剛才我們的 MySQL 跑在 Pod 裡面。如果我現在把那個 Pod 刪掉，Deployment 會自動重建一個新的。但是，新 Pod 裡面的 MySQL 是全新的，之前建的資料庫、插入的資料，全部消失了。因為容器的檔案系統是臨時的，Pod 砍了就沒了。

你說這不是跟 Docker 不掛 volume 一樣嗎？對，完全一樣。Docker 的解法是 docker run -v 掛 volume。K8s 的解法是 PV 和 PVC，PersistentVolume 和 PersistentVolumeClaim。

然後手動建 PV 太煩了，K8s 有 StorageClass 可以自動佈建。Deployment 跑資料庫有一些問題，需要 StatefulSet。最後 YAML 太多太散管不動，要用 Helm 打包。

但那是下午的事。現在大家先把上午的整合實作做完，確保 Ingress、ConfigMap、Secret 都跑通了。休息一下，我們下午繼續。
