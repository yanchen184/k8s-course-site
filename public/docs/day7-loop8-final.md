# Day 7 Loop 8 — 七堂課總複習 + 結業

---

## 7-23 七堂課總結（~15 min）

### ① 課程內容

**七堂課，我們究竟學會了什麼**

這個 Loop 不複習定義，不背指令清單。從第一堂課的 Linux 指令走到現在，我想讓你看到一條完整的因果鏈。每一個概念出現都是因為上一步有問題，解決了問題又冒出新問題，一環扣一環。

走完這條鏈，你的腦袋裡就有一張完整的七堂課知識地圖。

---

📄 7-23 第 1 張

**七堂課的完整旅程**

我們從最底層開始。

第一堂，學 **Linux**。為什麼？因為容器跑在 Linux 上，不懂 Linux 就沒辦法操作伺服器、沒辦法排錯、沒辦法理解後面所有東西的底層。

第二堂、第三堂，學 **Docker**。因為現代軟體部署的標準是容器。docker run、Dockerfile、Docker Compose，讓你可以在任何機器上跑一樣的環境，開發和生產不再有「在我電腦上沒問題」的問題。

然後 Docker Compose 在生產環境遇到了五個它做不到的事：

| Docker Compose 做不到 | K8s 怎麼解 |
|:---|:---|
| 跨機器分配容器 | Scheduler 自動決定 Pod 排到哪個 Node |
| 機器掛了自動恢復 | ReplicaSet 偵測到 Pod 消失，自動重建 |
| 流量暴增彈性擴縮 | HPA 自動根據 CPU 擴縮 Pod 數量 |
| 不停機更新 | Rolling Update + Probe 確保新 Pod 健康才切流量 |
| 跨機器服務發現 | Service + CoreDNS，Pod 用名稱互連，IP 變了沒關係 |

這五個問題，就是第四堂到第七堂我們花了四天解決的事。

---

📄 7-23 第 2 張

**K8s 因果鏈：從 Pod 到生產就緒**

Docker 管不了一群機器 → 所以學了 **Kubernetes**：容器編排平台，你告訴它想要什麼狀態，它幫你維持。

---

K8s 有了，要跑容器，但 K8s 不直接管容器。它的最小調度單位是 Pod，一個 Pod 可以包含一個或多個容器，共享網路和儲存。

因為需要 K8s 能管理的最小單位 → 所以學了 **Pod**

Pod 跑起來了，但 Pod 的 IP 是叢集內部的，外面連不到，而且 Pod 銷毀重建 IP 會變。

因為 Pod IP 不穩定、外部連不進去 → 所以學了 **Service**：給一組 Pod 提供穩定的 IP 和 DNS 名稱，Pod 掛了換新的，Service 地址不變

---

📄 7-23 第 3 張

**對外路由與設定分離**

Service 有了，但使用者要用 IP + Port 連進來，地址又長又醜，沒辦法用域名，沒辦法做路徑分流。

因為需要域名路由和 HTTPS → 所以學了 **Ingress**：用域名 + 路徑做 HTTP 路由，第六堂還加了 TLS

服務跑起來了，但設定寫死在 Docker Image 裡，改一個環境變數就要重新 build Image。

因為設定寫死在 Image 裡 → 所以學了 **ConfigMap**：設定外部化，改設定不用重 build

設定分離了，但密碼呢？資料庫密碼寫在 ConfigMap 裡，任何有 kubectl 權限的人都看得到。

因為密碼明文放 ConfigMap 不安全 → 所以學了 **Secret**：Base64 編碼 + RBAC 控制誰能讀

---

📄 7-23 第 4 張

**資料持久化與有狀態服務**

設定和密碼都分離了。MySQL Pod 重啟一次，資料全部消失。容器的檔案系統是暫時性的，容器重啟就沒了。

因為 Pod 重啟資料消失 → 所以學了 **PV + PVC**：PersistentVolume 是叢集裡的儲存空間，PVC 是 Pod 對儲存的申請，資料寫在 PV 裡，Pod 重啟資料還在

你的 API 只跑了一個 Pod，這個 Pod 掛了，服務就斷了。

因為單點故障、沒有副本 → 所以學了 **Deployment**：設 replicas 3，K8s 保證永遠有三個 Pod 在跑，還有滾動更新和回滾的能力

Deployment 很好用，但資料庫不適合用 Deployment。Deployment 的 Pod 名字是隨機的、沒有順序、共用儲存。資料庫需要固定的名字、有序的啟動、獨立的儲存。

因為資料庫需要固定身份和獨立儲存 → 所以學了 **StatefulSet**：每個 Pod 有穩定序號和 DNS 名稱（mysql-0、mysql-1），每個 Pod 有自己的 PVC

---

📄 7-23 第 5 張

**Helm 與生產就緒**

系統越來越複雜，一個 MySQL 就要寫 StatefulSet、Headless Service、PVC、Secret，好幾個 YAML，管理起來很痛苦。

因為 YAML 太多太散，難以管理 → 所以學了 **Helm**：K8s 套件管理器，一行 `helm install` 搞定整套安裝

到這裡功能上完整了，但生產環境會繼續考驗你。

Pod Running 但服務卡死了，K8s 不知道 → 所以學了 **Probe**：livenessProbe 偵測死亡後重啟、readinessProbe 偵測未就緒後不導流量、startupProbe 給慢啟動的應用緩衝時間

一個 Pod 有 bug，記憶體一直吃，把整台機器吃光 → 所以學了 **Resource limits**：requests 是保底，limits 是天花板，超過記憶體被 OOMKilled

流量暴增，三個 Pod 扛不住，手動 scale 來不及 → 所以學了 **HPA**：根據 CPU 使用率自動擴縮，全自動不需要人

所有人都有 admin 權限，實習生不小心刪了生產環境 → 所以學了 **RBAC**：定義角色、綁定權限，最小權限原則

所有 Pod 互相全通，前端被入侵後攻擊者直接打資料庫 → 所以學了 **NetworkPolicy**：三層隔離，前端只能連 API，API 只能連資料庫

---

📄 7-23 第 6 張

**七堂課完整知識地圖**

| 堂次 | 問題 | 解法 |
|:---|:---|:---|
| 第 1 堂 | 不懂 Linux 就沒辦法操作伺服器 | Linux 基礎指令、檔案系統、網路 |
| 第 2-3 堂 | 環境不一致、部署複雜 | Docker：Image、Container、Compose |
| 第 4-7 堂：Docker Compose 做不到 → K8s 解法 | | |
| | 跨機器分配容器 | Scheduler + Node |
| | 機器掛了自動恢復 | ReplicaSet（Deployment） |
| | 流量暴增彈性擴縮 | HPA |
| | 不停機更新 | Rolling Update + Probe |
| | 跨機器服務發現 | Service + CoreDNS |
| 深入 K8s | Pod IP 不穩定 | Service |
| | 地址醜、不能用域名 | Ingress |
| | 設定寫死在 Image | ConfigMap |
| | 密碼明文不安全 | Secret |
| | Pod 重啟資料消失 | PV + PVC |
| | 資料庫需要固定身份 | StatefulSet |
| | YAML 太多太散 | Helm |
| | 服務卡死 K8s 不知道 | Probe |
| | 資源吃光 OOM | Resource limits |
| | 誰都能刪生產環境 | RBAC |
| | 所有 Pod 全通不安全 | NetworkPolicy |

七堂課，49 小時。每一個概念都不是憑空出現的，它出現是因為上一步有問題。

你現在有的不只是一堆指令，而是一張從問題出發的知識地圖。下次遇到生產問題，你知道沿著這張地圖往哪個方向走。

---

## 7-24 學習路線 + Q&A（~10 min）

### ② 所有內容

**學完這四堂課，接下來可以走哪個方向？**

---

**方向一：考 CKA**

CKA 全名 Certified Kubernetes Administrator，CNCF 官方認證，業界認可度非常高。CKA 考的是叢集管理和故障排除能力。很多 DevOps 職缺會明確要求有 CKA。

考試形式是線上實作，不是選擇題。給你一個真實的 K8s 叢集，兩個小時做完 15 到 20 題。考試可以查 K8s 官方文件，不需要死背指令，重要的是你知道怎麼找、怎麼用。

我們四堂課的內容大概涵蓋了 CKA 60% 左右的知識點。還需要額外學的包括：用 kubeadm 從零搭建叢集（kubeadm 是官方提供的安裝工具，用來初始化 control plane 和加入 worker node）、etcd 備份和還原（etcd 是 K8s 的分散式鍵值資料庫，存所有叢集狀態，像是 Pod 資訊、設定等等，是叢集的「記憶」）、Taint 和 Toleration（Taint 是給 Node 打污點標記，表示「不是特別允許的 Pod 不能排到這台」；Toleration 是 Pod 聲明「我可以接受這個污點」才能排上去，常用在 GPU Node 只讓需要 GPU 的 Pod 使用）、Node Affinity（讓 Pod 偏好或必須排到有特定 label 的 Node，比 nodeSelector 更有彈性）、PodDisruptionBudget、更深入的網路除錯。

如果角色偏開發不是運維，可以考 **CKAD**（Certified Kubernetes Application Developer），考的是 Pod、Deployment、Service 這些應用層面的操作。偏安全可以考 **CKS**（Certified Kubernetes Security Specialist），考的是 RBAC、NetworkPolicy、Image 安全掃描這些安全相關的知識。

---

**方向二：Service Mesh — Istio**

我們學了 Service 做基本的流量轉發。但如果你的微服務架構更複雜，需要做流量控制、熔斷、鏈路追蹤，就需要 Service Mesh。Service Mesh 是微服務架構下的網路管理層，它不需要改應用程式本身，就能幫你做這些事情。

什麼是熔斷？熔斷（Circuit Breaker）就是當某個服務一直失敗，自動「斷路」停止繼續呼叫它，避免錯誤像骨牌一樣擴散到整個系統。鏈路追蹤（Distributed Tracing）則是追蹤一個請求從入口到各個微服務的完整路徑，找出哪一段最慢或出錯。

最知名的是 **Istio**。它在每個 Pod 旁邊放一個 Sidecar Proxy，攔截所有進出的流量做管控。Sidecar 是一個設計模式：把輔助功能放在主容器旁邊的第二個容器裡，主容器跑應用，Sidecar 跑網路代理，兩者在同一個 Pod 裡共享網路。還記得第四堂學的 Sidecar 模式嗎？Istio 就是 Sidecar 的極致應用。

---

**方向三：GitOps — ArgoCD**

我們目前都是手動 `kubectl apply` 部署的。但在企業環境裡，你不會讓人手動操作生產環境。

GitOps 是一種部署方式：Git 倉庫是唯一的事實來源，所有變更都透過 git commit。好處是可以 audit（誰改了什麼）、rollback（git revert）、review（PR 流程），全部都有跡可查。

具體做法是把所有 YAML 放在 Git 倉庫裡，用 **ArgoCD** 監控倉庫。ArgoCD 是 GitOps 工具，它會持續監控 Git 倉庫，發現 YAML 有變更就自動 apply 到叢集。你 `git push` 更新 YAML，ArgoCD 自動幫你 apply 到叢集上。整個部署流程是自動化的，而且有完整的版本歷史和回滾能力。

---

**方向四：監控 — Prometheus + Grafana**

你的服務跑起來了，但你怎麼知道它跑得好不好？CPU 用了多少、請求量多少、錯誤率多少？

最常用的組合是 **Prometheus + Grafana**。Prometheus 負責收集指標，Grafana 負責畫漂亮的儀表板。用 Helm 一行就能裝起來。

---

**方向五：CI/CD 整合 — GitHub Actions**

寫好程式碼之後，自動跑測試、自動 build Docker Image、自動 push 到 Registry、自動部署到 K8s。**GitHub Actions** 可以做到這些。搭配 ArgoCD 就是完整的 CI/CD + GitOps Pipeline。

---

**推薦學習資源**

- **K8s 官方文件**（kubernetes.io/docs）：最好的參考，CKA 考試也能查，一定要熟悉它的結構
- **Killer.sh**：CKA 模擬考平台，跟真實考試環境很像，強烈推薦考前練習
- **KodeKloud**：有互動式練習環境，適合邊學邊做，也有 CKA 備考課程
- **Kubernetes the Hard Way**：想深入理解底層原理，從零手動搭建叢集，不用任何工具

---

**Q&A 時間**

大家有什麼問題都可以問。不管是今天的內容、前幾堂課的，或者你在工作中遇到的 K8s 問題，都可以。

---

### ③ QA

**Q：CKA 難不難？學完這門課能去考嗎？**

A：有一定難度，但可以準備。我們的課程涵蓋了大概 60% 的知識點，剩下 40% 主要是叢集管理和底層維運的部分，需要再補一輪備考課程。CKA 的考題偏實務，是在真實叢集上操作，不是選擇題，所以動手練習比死背重要。建議學完這門課之後，再花 4 到 6 週用 KodeKloud 或 Killer.sh 練習，通過率很高。

---

**Q：我們學的 k3s 跟生產環境的差距有多大？**

A：API 層面幾乎一樣。你寫的 Pod YAML、Deployment YAML、Service YAML，在 k3s 和正式 K8s 叢集上都能跑，不需要改。主要差距在：k3s 預設用 SQLite 不是 etcd、少了一些高可用設定、Control Plane 是合在一起的而不是分開的多台。但對應用開發者來說幾乎無感，對運維來說才需要注意。我們學的那些 kubectl 指令和 YAML 格式，在 GKE、EKS、AKS 全部通用。

---

**Q：Helm 和 K8s Operator 的差別？**

A：Helm 是套件管理器，幫你把一堆 YAML 打包成一個 Chart，方便安裝和升級。Operator 是一個更深層的概念，它是一個跑在 K8s 裡的控制器，會不斷監控特定資源的狀態並採取行動。舉個例子：Helm 安裝 MySQL 就是把 MySQL 相關的 YAML 全部跑起來，裝完就沒事了。MySQL Operator 則是在叢集裡跑一個「懂 MySQL 的機器人」，它知道怎麼做主從切換、怎麼做備份、怎麼做版本升級。簡單講：Helm 管安裝，Operator 管生命週期。

---

**Q：學完 K8s 後找工作有什麼用？**

A：現在雲端原生是主流，幾乎所有稍具規模的公司都在用 K8s 或往 K8s 走。對後端工程師來說，懂 K8s 代表你能理解自己的服務怎麼部署、怎麼擴縮、怎麼監控，不是只會寫程式。對 DevOps 或 SRE 來說，K8s 幾乎是必備技能，CKA 證照更是履歷上的加分項。就算你不直接操作 K8s，懂了這些概念，和維運團隊溝通的時候你就不會鴨子聽雷。

---

## 7-25 結業（例外格式）

好，Q&A 結束了。我們的課程也走到終點了。

讓我最後花幾分鐘跟大家說幾句話。

---

**四堂課的成長回顧**

回想第四堂的第一支影片。那時候你剛學完 Docker，覺得容器很酷。docker run 一行指令跑一個 nginx，Docker Compose 一次啟動前端加後端加資料庫，你覺得這東西很方便。

然後我問了你一個問題：如果你有一百台伺服器、五百個容器要管呢？

就是這個問題把你帶進了 Kubernetes 的世界。

四堂課走下來，你經歷了什麼？

第四堂，你第一次看到 K8s 的架構圖，Master Node、Worker Node、etcd、API Server、Scheduler、Controller Manager，一堆名詞砸過來，腦袋一片混亂。但你硬著頭皮跟著做，寫出了人生第一個 Pod 的 YAML，用 kubectl apply 把它跑起來了。那一刻你發現，K8s 好像也沒那麼恐怖。

第五堂，你學了 Deployment，第一次看到 K8s 自動幫你修復。故意砍一個 Pod，幾秒鐘後新的 Pod 就出現了。你學了 Service，第一次用瀏覽器連到 K8s 裡面跑的 nginx。那個頁面跳出來的時候，你知道你跨過了一道門。

第六堂，事情變得真實了。你用 Ingress 設了域名，用 ConfigMap 和 Secret 分離了設定，用 PVC 讓資料持久化，用 StatefulSet 跑了 MySQL，用 Helm 一行裝好了複雜的應用。你建出來的東西開始像一個真正的生產系統了。

第七堂，也就是今天，你加上了 Probe 做健康檢查、Resource limits 做資源控制、HPA 做自動擴縮、RBAC 做權限管理、NetworkPolicy 做網路隔離。然後你把這些全部串在一起，從一個空的 Namespace 開始，12 步建了一套完整的系統。

有很多人學 K8s 學了好幾個月，看了一堆文章和影片，但從來沒有從零到一建過一套完整的系統。你今天做到了。

---

**地圖比喻**

我知道四堂課的資訊量很大。你不可能記住每一條指令、每一個 YAML 的寫法。但沒關係。你不需要記住所有細節。你需要記住的是那條因果鏈。

這條因果鏈就是你的地圖。

你現在手上有一張完整的地圖。地圖上的每一個節點你都走過了。Pod 走過了、Service 走過了、Ingress 走過了、RBAC 走過了。你知道每個節點是什麼、為什麼在那裡、怎麼到達。

接下來的路，你可以自己走了。

碰到新的問題，拿出地圖看看有沒有對應的節點。地圖上沒有的，查文件、找社群、動手試。你有了基礎，剩下的就是累積經驗。

---

**回家作業**

最後留一個作業，讓你把四堂課學過的東西全部用起來。

目標：在自己的機器上，用 Helm 跑起一套完整的服務。不用自己寫 YAML，全部用 Helm 裝。

推薦題目：

1. 用 Helm 安裝 WordPress（含 MariaDB + PVC）
2. 用 Helm 安裝 Prometheus + Grafana
3. 讓 CPU 和記憶體的指標在 Grafana 儀表板上顯示出來

大方向的 Helm 指令：

```bash
# 加入 Bitnami 和 Prometheus Community 的 repo
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# 安裝 WordPress（含 MariaDB）
helm install my-blog bitnami/wordpress \
  --set wordpressUsername=admin \
  --set wordpressPassword=mypass123 \
  --set mariadb.auth.rootPassword=rootpass123

# 安裝 kube-prometheus-stack（Prometheus + Grafana 整合包）
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# 確認 Pod 都跑起來
kubectl get pods -n monitoring
```

裝完之後，用 `kubectl port-forward` 或 `kubectl get svc` 找到 Grafana 的入口，打開瀏覽器登入（預設帳號 admin，密碼在 Secret 裡），找到 Kubernetes 相關的 Dashboard，看到 CPU 和記憶體的圖表，作業就完成了。

這不是一個有標準答案的作業，過程中你一定會踩到坑。踩坑、查文件、解決問題，這就是 K8s 學習的正確姿勢。

---

**三個最後建議**

**第一：把今天的 12 步再自己做一遍，不看講義。**
做不出來的地方就是還需要加強的。找出來，補強它，這是最有效率的複習。

**第二：在自己的專案裡用起來。**
學過的東西不用就會忘。找一個你自己的服務，哪怕只是一個 side project，把它部署到 K8s 上，讓它在叢集裡真正跑起來。

**第三：如果想要一個份量夠的認證，去考 CKA。**
CKA 是開啟下一個職涯機會最直接的方式。考試的準備過程本身也是很好的鞏固，你會發現很多細節你以為懂了，備考的時候才真正搞清楚。

---

大家辛苦了。四堂課能走到這裡的人都不簡單。

希望這門課能成為你技術道路上的一個轉折點。

我們後會有期。
