# Day 6 Loop 8 — 綜合實作 + 第六堂總結

---

## 6-23 綜合實作引導（~10 min）

### ① 課程內容

**場景：在 K8s 上部署完整部落格系統**

到目前為止，第六堂學了一堆東西——Ingress、ConfigMap、Secret、PV/PVC、StorageClass、StatefulSet、Helm、Rancher。

那這些東西到底怎麼組在一起？

好，今天最後這個 Loop，我不帶你們一步一步做，而是給你們看一個完整的部落格系統要怎麼在 K8s 上跑起來。前端 + 後端 API + MySQL，三個服務，組合在一起。你們看完之後，6-24 自己動手試。

📄 6-23 第 1 張

這個部落格系統有六個步驟。每一步我們都用過的概念，只是現在全部組在一起。

---

**步驟一：MySQL 資料庫**

MySQL 是有狀態的服務，資料不能消失，所以不用 Deployment，用 StatefulSet。

- **StatefulSet**：有狀態，Pod 序號固定（mysql-0、mysql-1）
- **Headless Service**：給 StatefulSet 一個穩定的 DNS 名稱（`mysql-0.mysql.default.svc.cluster.local`）
- **StorageClass**：自動佈建 PV，不用手動 `kubectl apply -f pv.yaml`
- **volumeClaimTemplates**：每個 MySQL Pod 有自己獨立的 PVC，mysql-0 的資料不會跑到 mysql-1 去
- **Secret**：MySQL 的 root 密碼放 Secret，不能明文寫在 YAML 裡

📄 6-23 第 2 張

---

**步驟二：後端 API**

後端 API 是無狀態的，請求打進來處理完就走，沒有「這個 Pod 跟那個 Pod 不一樣」的問題。所以用 Deployment。

- **Deployment**：無狀態，可以任意擴縮容
- **ConfigMap**：管設定——DB 連線字串（host 是 mysql StatefulSet 的 Headless Service DNS）、日誌等級、API Port
- **Secret**：把 DB 密碼注入進來（跟 MySQL 那邊用同一個 Secret）
- **ClusterIP Service**：後端不直接對外，只給叢集內部用。外部流量透過 Ingress 進來

📄 6-23 第 3 張

---

**步驟三：前端 Nginx**

前端也是無狀態的，Deployment 就夠。

- **Deployment**：跑 Nginx 靜態檔案
- **ConfigMap**：把 `nginx.conf` 掛載進去（Volume 掛載方式），控制 proxy 設定
- **ClusterIP Service**：前端也不直接對外，讓 Ingress 統一管

📄 6-23 第 4 張

---

**步驟四：Ingress**

所有對外的 HTTP 流量，統一從 Ingress 進來，然後根據路徑分流。

- `blog.example.com` → 前端 Nginx Service
- `blog.example.com/api` → 後端 API Service

這樣外部只需要一個 IP、一個域名，後面幾個服務怎麼分，Ingress 說了算。

📄 6-23 第 5 張

---

**步驟五：驗證**

部署完之後，我們用三個場景驗證：

1. `curl blog.example.com` → 看到前端頁面，代表 Ingress + 前端 Service + Nginx Deployment 都正常
2. 砍掉 MySQL Pod：`kubectl delete pod mysql-0`，等它重啟後確認資料還在——這驗證了 PVC 持久化有效
3. 改 ConfigMap 的日誌等級（debug → info），然後 `kubectl rollout restart deployment/blog-api`，新的 Pod 起來後拿到新設定——這驗證了 ConfigMap 注入流程

📄 6-23 第 6 張

---

**步驟六：Rancher 觀察**

打開 Rancher，在 GUI 裡一眼看到：
- 所有 Deployment（前端、後端）的狀態
- StatefulSet（MySQL）的 Pod 序號
- 三個 Service
- Ingress 規則
- PVC 列表（mysql-data-mysql-0、mysql-data-mysql-1）

你用了十幾個 YAML 建起來的系統，在 Rancher 裡面幾個點就看完。這就是為什麼生產環境要用 GUI 監控，不是因為 CLI 不夠強，而是 GUI 讓你一眼看到全局。

📄 6-23 第 7 張

---

**Helm 捷徑**

好，以上六個步驟——你真的要自己寫，大概要寫七八個 YAML 檔，幾百行。

但如果你只是想跑一個 WordPress，不想自己組 MySQL + WordPress + PVC + Ingress，Bitnami 的 Helm Chart 幫你把這一切都包好了。

```bash
helm install my-blog bitnami/wordpress
```

一行指令，WordPress + MariaDB + PVC + Ingress 全部跑起來。

這不是偷懶，這是正確的工程判斷。自己寫 YAML 的情境是：你需要高度客製化、或者你在學原理。套 Helm Chart 的情境是：已知的軟體（WordPress、Prometheus、Redis）、不需要改內部邏輯的。

📄 6-23 第 8 張

6-24 的學員練習就是用 Helm 跑 WordPress，讓你們親手感受「一行裝完整套服務」是什麼感覺。好，開始。

---

### ② 所有指令＋講解

（本節以引導為主，概念說明，無新指令。指令集中於 6-24 學員練習。）

---

### ③ 題目

（本節無練習題。）

---

### ④ 解答

（本節無。）

---

## 6-24 學員自由練習（不錄影片）

這個 section 不錄影，是學員的自由操作時間。老師巡堂，學員照以下步驟自己做。

---

**必做題：用 Helm 安裝 WordPress**

目標：在叢集裡跑起一套 WordPress（含 MariaDB + PVC + Service），打開瀏覽器看到 WordPress 歡迎頁面。

---

**第一步：確認 Bitnami repo 已加入**

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

- `helm repo add bitnami <url>`：把 Bitnami 倉庫加入本地索引
- `helm repo update`：拉最新的 Chart 清單

---

**第二步：安裝 WordPress**

```bash
helm install my-blog bitnami/wordpress \
  --set wordpressUsername=admin \
  --set wordpressPassword=mypass123 \
  --set mariadb.auth.rootPassword=rootpass123
```

- `helm install my-blog bitnami/wordpress`：把 bitnami/wordpress 這個 Chart 安裝成一個叫 `my-blog` 的 Release
- `--set`：直接覆寫 Chart 裡的 values，不用另外寫 values.yaml
- 這一行會同時建立：WordPress Deployment、MariaDB StatefulSet、兩個 PVC、兩個 Service

---

**第三步：等 Pod 跑起來**

```bash
kubectl get pods -w
```

- `-w`：watch，持續觀察狀態變化（Ctrl+C 停止）

等到兩個 Pod（WordPress 和 MariaDB）都是 Running：

```
NAME                              READY   STATUS    RESTARTS   AGE
my-blog-wordpress-xxx             1/1     Running   0          2m
my-blog-mariadb-0                 1/1     Running   0          2m
```

---

**第四步：看 Service，找進入點**

```bash
kubectl get svc my-blog-wordpress
```

輸出：

```
NAME                TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)
my-blog-wordpress   LoadBalancer   10.43.xxx.xxx   <pending>     80:31234/TCP
```

- 如果 EXTERNAL-IP 是 `<pending>`（minikube / k3s 環境常見），用 NodePort 進去：`http://<Node IP>:31234`
- 如果有 Ingress Controller，執行：

```bash
kubectl get ingress
```

看 Ingress 的 host，用瀏覽器打開。

---

**第五步：驗收**

打開瀏覽器，看到 WordPress 歡迎頁面 → 必做題完成。

---

**挑戰題：用 values.yaml 自訂安裝**

不用 `--set`，改用 values.yaml 檔案管理參數，並且啟用 Ingress、設定自訂域名。

建立 `wp-values.yaml`：

```yaml
wordpressUsername: admin
wordpressPassword: my-secure-pass
mariadb:
  auth:
    rootPassword: db-root-pass
ingress:
  enabled: true
  hostname: wordpress.local
```

安裝：

```bash
helm install my-blog bitnami/wordpress -f wp-values.yaml
```

在 `/etc/hosts` 加上：

```
127.0.0.1   wordpress.local
```

（或者改成你的 Node IP）

打開瀏覽器：`http://wordpress.local`，看到 WordPress 歡迎頁面 → 挑戰題完成。

---

**練習結束後清理（可選）**

```bash
helm uninstall my-blog
kubectl get pvc    # PVC 不會自動刪，需要手動清
kubectl delete pvc --all
```

---

## 6-25 第六堂總結（~12 min）

### ① 課程內容（因果鏈回顧 + 今日整理）

📄 6-25 第 1 張

好，最後把今天學的東西全部串起來。

第六堂，從 NodePort 的地址太醜開始，一路推到 Rancher。我們從來沒有「因為這個功能很有用所以介紹它」，每一個新概念出現都是因為前一步有問題。

來，完整的因果鏈：

---

**NodePort 地址太醜**
→ 外部要存取服務，只能用 `NodeIP:Port`，沒辦法用域名，沒辦法做 HTTPS，路徑也沒辦法分流
→ 所以需要 **Ingress**：域名路由 + 路徑路由（Path-based + Host-based）

📄 6-25 第 2 張

**設定寫死在 Image**
→ 連線字串、日誌等級、Port 號全部寫在 Dockerfile 或程式碼裡，換環境要重新 build Image
→ 所以需要 **ConfigMap**：設定外部化，env 注入 vs Volume 掛載兩種用法

**密碼放 ConfigMap 不安全**
→ ConfigMap 明文儲存，任何有 kubectl 權限的人都能看到密碼
→ 所以需要 **Secret**：Base64 編碼（不是加密，是混淆）+ RBAC 控制誰能讀

**三個整合（Ingress + ConfigMap + Secret）**
→ 前面三個概念不是獨立的，實務上 Ingress 做路由、ConfigMap 管設定、Secret 管密碼，三個一起用才是完整的部署

📄 6-25 第 3 張

**MySQL Pod 重啟資料消失**
→ Pod 是無狀態的，刪掉重建，容器裡的資料全部消失
→ 所以需要 **PV + PVC**：持久化儲存（PV 是停車位，PVC 是租約，Pod 透過 PVC 拿到儲存空間）

**手動建 PV 太煩**
→ 每個 PVC 都要先手動建一個 PV，維運量大，容易出錯
→ 所以需要 **StorageClass**：動態佈建，PVC 送出申請，StorageClass 自動建對應的 PV

📄 6-25 第 4 張

**Deployment 不適合跑 DB**
→ Deployment 的 Pod 之間沒有身份區分，一起刪一起建，不適合「每個 DB 節點要有固定身份」的場景
→ 所以需要 **StatefulSet**：固定序號（mysql-0、mysql-1）+ 有序啟動有序縮容 + 每個 Pod 獨立 PVC + Headless Service 提供穩定 DNS

**YAML 太多太散**
→ 一個服務可能要寫十幾個 YAML，版本管理很痛苦，換環境要改幾十個地方
→ 所以需要 **Helm**：一行安裝整套服務 + values.yaml 管多環境參數 + helm rollback 版本回滾

**kubectl 管叢集太痛苦**
→ CLI 只能看文字輸出，要看整個叢集狀況要打很多指令，出問題很難快速定位
→ 所以需要 **Rancher**：Web GUI 一覽全局，所有 Deployment、StatefulSet、Service、Ingress、PVC 都在一個畫面上

📄 6-25 第 5 張

這就是今天的因果鏈。從 NodePort 太醜一路推到 Rancher，每一步都是因為前一步不夠好。

---

### ② 今日新增指令完整清單

📄 6-25 第 6 張

今天新學的指令，完整整理如下：

```bash
# --- Ingress ---
kubectl get ingress                          # 列出所有 Ingress
kubectl describe ingress <name>              # 看 Ingress 的詳細路由規則

# --- PV / PVC / StorageClass ---
kubectl get pv                               # 列出 PersistentVolume（叢集層級的儲存資源）
kubectl get pvc                              # 列出 PersistentVolumeClaim（Pod 對儲存的申請）
kubectl get storageclass                     # 列出 StorageClass（自動佈建的規則）

# --- StatefulSet ---
kubectl get statefulset                      # 列出 StatefulSet（縮寫 kubectl get sts）
kubectl scale statefulset <name> --replicas=N  # StatefulSet 擴縮容

# --- Helm ---
helm repo add <name> <url>                   # 加入 Chart 倉庫到本地索引
helm repo update                             # 更新本地 Chart 索引（拉最新版）
helm search repo <keyword>                   # 搜尋 Chart（如 helm search repo wordpress）
helm install <release-name> <chart>          # 安裝 Chart，建立一個 Release
helm list                                    # 看目前叢集裡所有已安裝的 Release
helm upgrade <release-name> <chart>          # 升級 Release 到新版本
helm history <release-name>                  # 查這個 Release 的所有升級歷史
helm rollback <release-name> <revision>      # 回滾到指定版本號（從 helm history 看）
helm uninstall <release-name>                # 解除安裝，刪除所有相關資源
helm show values <chart>                     # 看這個 Chart 有哪些可用的參數（values）
```

📄 6-25 第 7 張

---

### ③ Docker → K8s 對照表更新

今天的對照表更新最多。把今天學的概念全部加進去：

📄 6-25 第 8 張

| Docker | K8s | 說明 |
|:---|:---|:---|
| docker volume create | PersistentVolume (PV) | 建立儲存空間（停車位） |
| docker run -v | PersistentVolumeClaim (PVC) | 申請使用儲存空間（租約） |
| --name 固定容器名 | StatefulSet 固定序號 | 有狀態服務的身份識別 |
| docker-compose.yml | Helm Chart | 整套服務的定義檔 |
| docker compose up | helm install | 一鍵啟動整套服務 |
| docker compose down | helm uninstall | 一鍵清除整套服務 |
| .env 檔案 | values.yaml | 多環境的參數管理 |
| nginx.conf 反向代理 | Ingress YAML | HTTP 路由規則的定義 |
| Nginx 容器（做反向代理） | Ingress Controller Pod | 實際執行路由規則的程式 |
| docker run -e KEY=VALUE | ConfigMap envFrom | 把設定以環境變數方式注入 Pod |
| .env 裡的密碼 | Secret | 敏感資料管理（Base64 + RBAC） |

這張表從第四堂開始累積到現在，已經蠻完整了。你對照這張表，Docker 學過的東西在 K8s 裡幾乎都有對應，只是名字不一樣、設定方式不一樣。

---

### ④ 回家作業 + 下堂課預告

📄 6-25 第 9 張

**回家作業**

兩件事：

1. **用 Helm 安裝 WordPress**，打開瀏覽器看到 WordPress 歡迎頁面。如果 6-24 做完了就跳過，沒做完的今晚補。

2. **用自己的話寫一段「第六堂因果鏈」**，從「NodePort 太醜」一路推導到「Rancher」。不用很長，重點是你能不能用自己的邏輯說清楚每一步為什麼出現。這個練習的目的不是背，是確認你真的理解了，而不是只是看過。

---

📄 6-25 第 10 張

**下堂課預告：第七堂——生產就緒**

第六堂做完之後，你的服務能跑了。但能跑不等於能上生產環境。

第七堂，四個問題引出四個主題：

**問題一：API 的 process 活著，但不處理請求。K8s 不知道，還是把流量打進去。**
→ 這叫做死鎖。K8s 需要一個方式知道服務是不是真的 ready、真的 healthy。
→ 解法：**Probe 健康檢查**（liveness probe / readiness probe / startup probe）

**問題二：某個 Pod 有記憶體洩漏，把整台 Node 的記憶體吃光，影響其他服務。**
→ K8s 沒有限制，所以任何 Pod 都能吃光資源。
→ 解法：**Resource requests / limits + QoS**，給每個 Pod 設定資源上限

**問題三：流量暴增，手動 scale 來不及。**
→ 凌晨兩點流量突然衝高，你沒辦法一直盯著。
→ 解法：**HPA（Horizontal Pod Autoscaler）**，根據 CPU 使用率自動擴縮容

**問題四：有人打了 `kubectl delete namespace production`。**
→ 不是說笑，這在業界發生過（CloudFlare 事故）。
→ 解法：**RBAC 權限控制**，誰能做什麼操作，明確設定

📄 6-25 第 11 張

**收尾**

今天你給服務穿上了正式的衣服。

域名是門牌——Ingress 讓你有個像樣的地址，不用再記一堆 NodeIP:Port。設定和密碼是名片夾——ConfigMap 和 Secret 讓設定跟程式碼分開，密碼不會裸露在 YAML 裡。資料持久化是保險箱——PV + PVC + StatefulSet 讓你的 DB 資料不會因為 Pod 重啟就消失。套件管理是購物車——Helm 讓你一行安裝整套服務，不用手寫十幾個 YAML。GUI 監控是監控攝影機——Rancher 讓你一眼看到叢集全局。

穿得漂亮不夠，還要扛得住。下堂課，讓這個服務通過生產環境的壓力測試。
