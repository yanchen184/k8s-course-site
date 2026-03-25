# 第四堂上午逐字稿 v3 (Part 2) — 因果鏈敘事

> 接續 Part 1 的 4-1 ~ 4-4
> 4 支影片，涵蓋架構 + 動手做

---

# 影片 4-5：K8s 架構（上）— 誰在現場幹活（~12min）

## 本集重點

- 八個概念認識了，但誰在背後讓這些事情發生？→ 需要認識架構
- K8s = Master-Worker 架構（公司比喻：管理層 vs 現場員工）
- Worker Node 三組件：
  - Container Runtime（containerd）→ 真正跑容器的
  - kubelet → 接指令、管 Pod、回報狀態的工頭
  - kube-proxy → 管網路轉發的交通指揮
- Docker 和 containerd 的關係：Docker = 上層介面 + 底層 containerd，K8s 1.24 起直接用 containerd
- OCI 標準：Docker build 的 Image 在 containerd 上一樣能跑

| Worker 組件 | 職責 | 比喻 |
|:---|:---|:---|
| Container Runtime (containerd) | 拉 Image、建容器、跑容器 | 工人手上的工具 |
| kubelet | 從 Master 接指令、管 Pod、回報狀態 | 工地的工頭 |
| kube-proxy | 維護網路規則、轉發流量、負載均衡 | 交通指揮 |

## 逐字稿

上一支影片我們用因果鏈的方式認識了八個核心概念。從 Pod 開始，一路解決問題，最後到 Deployment 和 StatefulSet。最後我留了一個問題：Pod 掛了會自動重建，是誰偵測到的？新 Pod 是誰建的？放在哪台機器上是誰決定的？

這些問題我們在講概念的時候一直跳過，因為當時重點是「有什麼」。現在要換個角度，看「誰在做」。

K8s 是一個典型的 Master-Worker 架構。這個架構你一定不陌生，因為很多系統都是這樣設計的。我用一個比喻來幫你理解。

你把 K8s 叢集想像成一家工廠。工廠裡面有兩種人：管理層和現場員工。管理層坐在辦公室裡，負責做決策。這個訂單交給誰做、原料怎麼分配、產線出了問題怎麼處理，都是管理層在決定。現場員工在車間裡幹活，搬原料、操作機器、組裝產品、出貨。管理層不會自己去搬貨，員工也不會自己決定生產計畫，各司其職。

在 K8s 裡面，Master Node 就是管理層，Worker Node 就是現場員工。你的應用程式，也就是你的 Pod，全部跑在 Worker Node 上。Master Node 不跑你的程式，它只負責管理和調度。就像工廠的總經理不會自己去產線上擰螺絲，他只負責下指令和做決策。

一個叢集通常有一個或多個 Master Node，和多個 Worker Node。生產環境裡 Master 通常三個，做高可用，避免單點故障。Worker 可能幾十個甚至上百個，看你的業務量。我們今天用的 minikube 是特殊情況，單節點，Master 和 Worker 合在一台機器上，方便學習用的。

好，管理層和員工我們知道了。先來看員工，也就是 Worker Node。每個 Worker Node 上面有三個核心組件。

第一個問題：Pod 裡面要跑容器，容器是誰跑起來的？總得有一個程式負責拉 Image、建立容器、啟動容器吧？這個程式就是 Container Runtime，容器執行環境。沒有它，容器根本跑不起來。就像工人手上的工具，沒有工具再厲害的工人也沒辦法幹活。

學 Docker 的時候，我們用的 Container Runtime 是 Docker Engine。但在 K8s 裡面，主流用的是 containerd。

你可能會問，containerd 是什麼？跟 Docker 是什麼關係？其實 Docker 可以分成兩層來理解。上面一層是你看得到的東西：docker 指令、Docker Desktop、docker compose，這些是使用者介面。下面一層是真正跑容器的核心引擎，就是 containerd。以前 K8s 是通過 Docker 來跑容器的，等於繞了一圈，先找 Docker，Docker 再找 containerd。後來 K8s 社群覺得，既然我真正需要的只是底層的 containerd，何必多繞一層？多一層就多了複雜度和效能開銷。所以從 K8s 1.24 版本開始，K8s 直接跟 containerd 溝通，不再需要 Docker 了。

你可能會想：那我之前用 Docker 打包的 Image 還能用嗎？完全可以。因為不管是 Docker 還是 containerd，它們打包出來的映像檔格式是一樣的，都遵循 OCI 標準。OCI 就是 Open Container Initiative，開放容器標準。你用 docker build 打包的 Image，推到 Docker Hub 上，K8s 的 containerd 拉下來跑，完全沒問題。所以你之前學的 Docker 技能一點都沒有浪費。

好，Container Runtime 負責跑容器。但容器跑起來了，誰來管它？誰告訴 Container Runtime「你要跑一個 nginx」？Container Runtime 就是一個工具，工具不會自己決定要做什麼。你家的電鑽不會自己決定在哪面牆上鑽洞，得有人拿著它、告訴它鑽哪裡。

這就是第二個組件，kubelet。kubelet 是每個 Worker Node 上的管理員，你可以叫它工頭。它的工作分三個部分。

第一，從 Master Node 那裡接收指令。比如 Master 說「你這台機器上要跑一個 nginx 的 Pod」，kubelet 收到之後就去叫 Container Runtime 把容器拉起來。

第二，持續監控。容器建好之後，kubelet 不會就這樣走了。它會一直盯著這台 Node 上所有 Pod 的狀態。哪個 Pod 還在跑、哪個掛了、CPU 和記憶體各用了多少，kubelet 全都知道。

第三，定期回報。kubelet 會把收集到的狀態資訊回報給 Master Node。這樣 Master 才知道每台 Worker 的情況。如果 kubelet 突然不回報了，Master 就會懷疑這台 Worker 是不是掛了。

就像工地的工頭。老闆說今天要蓋三面牆，工頭收到之後安排工人去施工。施工過程中工頭會一直巡視，看進度有沒有落後、有沒有人出狀況。如果出了問題，工頭會立刻回報給老闆。kubelet 就是做這件事的。注意一個重點：kubelet 是每個 Node 上都有一個的，每台 Worker 都有自己的工頭。不是一個工頭管所有工地，是每個工地都有一個駐場工頭。

好，容器跑起來了，也有人管了。但你想想，你的 API Pod 要呼叫資料庫 Pod，流量從 API 發出去，經過 Service，然後到達資料庫 Pod。這中間是誰在做轉發？我們前面講 Service 的時候說 Service 會把請求轉到後面健康的 Pod，但這個「轉」的動作，具體是誰在執行？

答案是第三個組件，kube-proxy。kube-proxy 在每個 Node 上維護一套網路規則。你建一個 Service，Service 有一個虛擬 IP。當有請求打到這個虛擬 IP 的時候，kube-proxy 負責把請求轉發到後面實際的 Pod。Service 的 IP 和 Port 怎麼對應到哪幾個 Pod，這些規則都是 kube-proxy 在管的。

如果一個 Service 後面有三個 Pod，kube-proxy 還負責做負載均衡，把請求平均分配到不同的 Pod，不會所有流量都打到同一個 Pod 上。

你可以把它想成工廠的物流調度。貨車來了，物流告訴它往左邊走去 A 倉庫卸貨，下一輛車往右邊走去 B 倉庫。確保每個地方都有材料送到，不會全部堆在同一個地方。

跟 kubelet 一樣，kube-proxy 也是每個 Node 上都有一個。因為網路規則要在每台機器上都生效，流量不管從哪個 Node 進來都要能正確轉發。

來整理一下。Worker Node 上三個組件：Container Runtime 是工具，沒有它容器跑不起來。kubelet 是工頭，沒有它 Master 的指令傳不到這台機器上。kube-proxy 是交通指揮，沒有它網路流量到不了正確的 Pod。三個缺一不可，它們合作讓一台機器成為叢集裡一個合格的 Worker。

但是你有沒有注意到，Worker 只是在「執行」。誰告訴 Worker 要跑什麼？誰決定把 Pod 放在哪台 Worker 上？誰在監控副本數量夠不夠？這些決策是誰做的？答案就在 Master Node 上。下一支影片我們來看管理層。

---

# 影片 4-6：K8s 架構（下）— 誰在背後指揮 + 完整流程（~15min）

## 本集重點

- Master Node 四組件的因果鏈：
  - 你下 kubectl 指令 → 誰收？→ API Server（叢集大門）
  - 收到「要 3 個 nginx」→ 記在哪？→ etcd（叢集的記憶）→ 備份很重要
  - 記住了但現在 0 個 → 誰發現不對？→ Controller Manager（期望 vs 實際）
  - 要補 3 個 → 放哪台？→ Scheduler（看資源分配）
  - 決定了 → kubelet 收到 → containerd 跑起來
- 每個組件掛了會怎樣？逐一分析
- 完整流程：kubectl create deployment nginx --replicas=3 走一遍
- 故障自動恢復流程

| Master 組件 | 職責 | 掛了會怎樣 |
|:---|:---|:---|
| API Server | 接收所有請求、身份驗證 | 無法下指令，但現有 Pod 繼續跑 |
| etcd | 儲存叢集所有狀態 | 失去記憶，最嚴重 |
| Controller Manager | 比較期望 vs 實際，觸發修復 | Pod 掛了沒人補 |
| Scheduler | 決定 Pod 放哪個 Node | 新 Pod 排隊等不到分配 |

## 逐字稿

上一支影片我們看了 Worker Node 上的三個組件。Container Runtime 跑容器、kubelet 管 Pod、kube-proxy 管網路。它們是在現場幹活的。但我們留了一個問題：Worker 只是在執行，誰告訴它要執行什麼？

答案在 Master Node 上。Master Node 是管理層，不跑你的應用程式，但它指揮整個叢集的運作。Master Node 上有四個核心組件，我們用因果鏈的方式一個一個來認識。

假設你坐在電腦前面，在終端機裡敲了一行指令：kubectl create deployment nginx --replicas=3。意思是「我要三個 nginx 的 Pod」。好，你按了 Enter。這個指令發出去了，第一個問題：誰收的？

收指令的就是第一個組件，API Server。

API Server 是整個叢集的大門。不管你要對叢集做什麼操作，全部都要先經過 API Server。你用 kubectl 下指令，kubectl 是發給 API Server 的。你用 Dashboard 圖形介面看叢集狀態，Dashboard 也是問 API Server 的。叢集裡面的其他組件要互相溝通，也是通過 API Server 中轉。它就像公司的大門警衛加總機。所有人進公司先過警衛驗證身份，再通過總機轉接到正確的部門。

API Server 收到你的請求之後，第一件事不是馬上去建 Pod，而是先驗證：你是誰？你有權限建 Deployment 嗎？這是安全機制，後面第七堂課講 RBAC 的時候會詳細說。驗證通過了，API Server 說好，你要三個 nginx，我知道了。

接下來第二個問題：API Server 知道了「要三個 nginx」，但這個資訊記在哪裡？如果 API Server 只是記在自己的記憶體裡，一重啟就忘了，那不是很危險嗎？

所以需要一個地方永久保存這個資訊。這就是第二個組件，etcd。

etcd 是一個分散式的鍵值儲存系統。如果你學過 Redis，概念有點像，就是用 key 對應 value 的方式存資料。但 etcd 存的不是你的業務資料，它存的是整個叢集的狀態。哪些 Node 是健康的、有多少個 Pod、每個 Pod 跑在哪個 Node 上、Deployment 的副本數設成多少、Service 的設定是什麼，所有的管理資訊都記在 etcd 裡面。你可以把它想成公司的檔案室，公司的所有記錄都在這裡：員工名冊、專案進度、資源分配表。

所以 API Server 收到你的指令之後，就把「有一個 Deployment 叫 nginx，期望副本數 3」這筆資料寫進 etcd。現在叢集有了記憶。

這裡我要特別強調一件事：etcd 是整個叢集裡面最重要的東西。Node 掛了可以加新的，Pod 掛了會自動重建，Deployment 設定可以重新 apply。但 etcd 的資料丟了，叢集就真的失去了所有記憶。所有的 Deployment、Service、ConfigMap、Secret，全部都沒了，你得從頭來過。所以在生產環境裡，etcd 的備份是運維的第一要務。一般建議至少每天備份一次，備份檔案存到叢集外面的安全位置。這是面試也會問的重點。

好，etcd 記住了「要三個 nginx Pod」。但是現在實際上是零個 Pod 在跑。etcd 只是一個資料庫，它不會自己去建 Pod。那誰來發現「期望三個但實際零個，不對勁」？

這就是第三個組件，Controller Manager。

Controller Manager 是整個叢集的監工。它的工作方式非常有特色：持續不斷地比較兩件事。第一件事，你期望的狀態是什麼，就是你在 YAML 或指令裡說的「我要三個 nginx」。第二件事，現在叢集的實際狀態是什麼，就是現在到底有幾個 nginx Pod 在跑。如果期望和實際不一樣，Controller Manager 就會採取行動把實際狀態修正成期望狀態。

這個「比較期望和實際、然後修正」的機制，在 K8s 裡面有一個專有名詞，叫控制迴圈，Control Loop。這是 K8s 最核心的設計理念。你可以把它想像成恆溫空調。你設定溫度 25 度，空調會持續量測室溫。太熱就吹冷氣降溫，降到 25 度就停。過一陣子室溫又上去了，它又開始吹。你不需要告訴它什麼時候開、什麼時候關，你只要說「我要 25 度」。Controller Manager 就是 K8s 裡的恆溫器。

回到我們的例子。Controller Manager 看了一眼 etcd，發現有一個 Deployment 叫 nginx，期望三個 Pod，但現在是零個。零不等於三，不行。Controller Manager 就會觸發動作：建立一個 ReplicaSet，要求三個 Pod。

好，Controller Manager 說「要建三個 Pod」。但這三個 Pod 要放在哪台 Worker 上？你的叢集有五台 Worker，有的忙有的閒，不能隨便放。

這就是第四個組件，Scheduler，調度器。

Scheduler 的工作就是「選位子」。它會看每台 Worker Node 的資源使用狀況。Worker 1 的 CPU 用了百分之八十，快滿了。Worker 2 只用了百分之二十，很空。Worker 3 用了百分之五十。Scheduler 會根據這些資訊做最佳分配，盡量讓負載均勻。比如把 Pod 1 和 Pod 2 放到 Worker 2，Pod 3 放到 Worker 3。分配結果寫回 etcd。

你可以把 Scheduler 想成公司的 HR。新任務來了，HR 看看哪個部門人手比較充裕，就把任務派給那個部門。不會把所有任務都塞給一個已經加班到爆的團隊。而且 Scheduler 不只看資源，它還可以考慮你設定的規則。比如「這個 Pod 只能跑在有 SSD 的 Node 上」，或者「這兩個 Pod 不能放在同一台 Node 上避免單點故障」。Scheduler 會把這些規則全部考慮進去。

Scheduler 分配好了，接下來就是 Worker Node 上的 kubelet 接手。Worker 2 的 kubelet 從 API Server 那裡收到通知：你要跑兩個 nginx Pod。kubelet 就去叫 containerd 拉映像檔、建容器、啟動。Worker 3 的 kubelet 也一樣，收到一個 Pod 的任務，開始執行。

Pod 跑起來之後，kubelet 持續監控狀態，定期回報給 API Server。Controller Manager 也持續在看：期望三個，實際三個，一切正常。

我們來把完整流程從頭走一遍。你在終端機輸入 kubectl create deployment nginx --replicas=3，按 Enter。

第一步，kubectl 把請求發給 API Server。API Server 驗證身份和權限，通過了。

第二步，API Server 把「nginx Deployment，期望三副本」寫進 etcd。

第三步，Controller Manager 發現 etcd 裡有新的 Deployment，期望三個 Pod 但實際零個。觸發建立 ReplicaSet，要求三個 Pod。

第四步，三個 Pod 目前是 Pending 狀態，等待分配。Scheduler 看各 Node 資源，決定 Pod 1 和 Pod 3 去 Worker 1，Pod 2 去 Worker 2。分配資訊寫回 etcd。

第五步，Worker 1 的 kubelet 收到通知，叫 containerd 跑兩個 nginx。Worker 2 的 kubelet 也收到通知，跑一個。

第六步，全部跑起來了。kubelet 回報狀態，Controller Manager 確認：期望三，實際三，正常。

然後有一天，Worker 1 的硬碟壞了，整台掛了，上面兩個 Pod 跟著停了。

第七步，kubelet 回報中斷。Controller Manager 發現只剩一個健康的 Pod，但期望是三個。一不等於三，觸發建立兩個新 Pod。

第八步，Scheduler 把兩個新 Pod 分配到還活著的 Worker 2。kubelet 建容器、啟動。幾十秒後恢復正常。

整個過程你一行指令都不需要下。凌晨三點 Worker 掛了，你繼續睡覺，K8s 自己搞定。這就是我們第一支影片說的「故障自動恢復」，現在你知道背後是哪些組件在合作了。

最後聊聊如果某個組件掛了會怎樣。

API Server 掛了：你沒辦法下指令，kubectl 打不通，Dashboard 也看不到。但已經在跑的 Pod 不受影響，繼續跑。只是你不能做任何新的操作。

etcd 掛了：叢集失去記憶，什麼狀態都查不到。這是最嚴重的，所以要備份。

Controller Manager 掛了：Pod 掛了沒人發現、沒人補。副本數可能慢慢減少。但已經在跑的 Pod 繼續跑。

Scheduler 掛了：新的 Pod 沒人分配，一直排隊。但已經跑起來的 Pod 不受影響。

kubelet 掛了：那台 Node 上的 Pod 沒人管了。Master 過一段時間偵測到失聯，會把上面的 Pod 標記為失敗，然後在其他 Node 上重建。

你有沒有發現一個規律？除了 etcd 之外，其他組件掛了，已經在跑的 Pod 都不會馬上受影響。這就是分散式系統的好處，某個零件壞了不會整台機器立刻停擺。但長期來看每個組件都很重要，所以生產環境才要做高可用。

來看一下架構圖。上面是 Master Node，裡面有 API Server、etcd、Scheduler、Controller Manager。下面是多個 Worker Node，每個 Worker 上有 kubelet、kube-proxy、Container Runtime，還有你的 Pod。你通過 kubectl 跟 API Server 溝通，API Server 指揮整個叢集。所有組件之間的溝通都經過 API Server，它是整個叢集的神經中樞。

好，架構講完了。概念也講完了。講了這麼多，都是理論。是時候親眼看看了。下一支影片，我們裝環境、啟動叢集。

---

# 影片 4-7：動手做（上）— 裝 minikube（~10min）

## 本集重點

- 架構都搞清楚了，來動手驗證
- 三種環境方案比較：

| 方案 | 適合場景 | 節點數 | 安裝難度 | 本課程使用時機 |
|:---|:---|:---|:---|:---|
| minikube | 個人學習、本機開發 | 單節點 | 一行指令 | 今天（Day 4） |
| k3s | 輕量多節點、邊緣運算 | 多節點 | 簡單 | Day 5 |
| RKE / kubeadm | 企業生產叢集 | 多節點 | 較複雜 | 介紹概念 |

- kubectl = K8s 的命令列工具 → 不管底層是什麼，指令都一樣
- 安裝驗證流程：
  ```
  minikube version
  minikube start
  kubectl get nodes
  kubectl cluster-info
  ```

## 逐字稿

前面四支影片我們從 Docker 的五個痛點出發，一路認識了八個核心概念，又看了 Master-Worker 架構和每個組件的分工。到這裡為止，你腦中應該已經有一張比較完整的 K8s 地圖了。

但是地圖跟實際走路是兩回事。講了這麼多理論，你可能已經等不及想打開終端機了。好，我們來動手。

在開始之前，先聊一下環境方案。K8s 的環境搭建方式有好幾種，就像你要學開車，可以用模擬器練、可以在駕訓班的封閉場地練、也可以直接上路。不同的方式適合不同的階段。

我們這門課會用到三種方案。

第一種是 minikube，適合個人學習和本機開發。它在你的電腦上模擬一個 K8s 叢集，把 Master 和 Worker 合在一台機器上。安裝只要一行指令，非常簡單。但它是單節點的，看不到 Pod 分散到不同 Node 的效果，不適合模擬生產環境。我們今天用它。

第二種是 k3s，Rancher Labs 開發的輕量級 K8s 發行版。它把 K8s 精簡了很多，安裝也很簡單，但它是真正的多節點叢集。第五堂課我們會用它，在 VMware 裡面開兩台 Ubuntu 虛擬機，一台當 Master 一台當 Worker，體驗真正的多節點環境。到時候你就能看到 Pod 被 Scheduler 分配到不同 Node 上了。

第三種是 RKE 或者 kubeadm，適合企業生產叢集。安裝比較複雜，但功能最完整、最接近真實的生產環境配置。這個我們課程裡不會實際操作，但會介紹概念，讓你知道有這個東西。

為什麼今天用 minikube？因為今天我們只需要學 Pod 和基本操作，單節點完全夠用。而且 minikube 裝起來最簡單，不需要額外的虛擬機，你筆電上就能跑。等第五堂課我們學 Deployment 和 Service 的時候，需要看到跨節點的效果，那時候再換 k3s。

這裡先講一下 kubectl，因為很多初學者會搞混 minikube 和 kubectl 的關係。

kubectl 是 K8s 的命令列工具，就像你學 Docker 時用的 docker 指令。docker ps 看容器，docker logs 看日誌，docker exec 進容器。kubectl 邏輯一樣，只是換了一套指令名稱。

kubectl 跟 minikube 是兩個不同的東西。minikube 是幫你建叢集的工具，建好之後它的任務基本上就完成了。kubectl 是你跟叢集溝通的工具，建好叢集之後你日常操作全靠它。打個比方，minikube 像是蓋房子的建築工人，kubectl 像是住在裡面的管家。房子蓋好之後，你跟管家打交道，不用再找建築工人。

而且 kubectl 有一個很大的好處：不管你的叢集是 minikube、k3s、還是 AWS 上的 EKS、GCP 上的 GKE，kubectl 的指令完全一樣。學一次，到處用。你在本機的 minikube 上練的指令，到了公司的生產叢集上一模一樣地敲就對了。底層的叢集換了，kubectl 的用法不變。這是 K8s 生態系統的一個巨大優勢，也是為什麼我們要花時間把 kubectl 學好。

好，來動手。如果你在第一支影片的時候有照著螢幕上的指示先跑安裝指令，現在應該已經裝好了。讓我們來驗證。

首先執行 minikube version。如果你看到類似「minikube version: v1.32.0」這樣的輸出，就代表安裝成功了。如果顯示指令找不到，那代表安裝沒成功或者路徑沒設對，回去看一下安裝步驟。

接下來看叢集是不是已經在跑。執行 minikube status。如果顯示 host: Running、kubelet: Running、apiserver: Running，那就代表叢集正在運行。你看到沒有？host 在跑、kubelet 在跑、apiserver 在跑。kubelet 和 apiserver 就是我們前兩支影片講的那兩個組件。minikube 的狀態輸出直接對應到架構概念，你現在看到的不再是抽象的名詞了。

如果叢集還沒啟動，執行 minikube start。這個指令會下載 K8s 的映像檔，建立一個虛擬機或容器，取決於你的 driver 設定，然後在裡面啟動 K8s 叢集。第一次跑會比較久，大概三到五分鐘，因為要下載東西。之後再啟動就快了，映像檔已經在本地了。

minikube start 跑完之後，它會自動幫你設定好 kubectl，讓 kubectl 指向你的 minikube 叢集。這個設定其實是寫在一個叫 kubeconfig 的檔案裡，通常在你的 home 目錄下的 .kube/config。kubectl 每次執行指令的時候都會去讀這個檔案，知道要連哪個叢集、用什麼身份。你現在不需要手動去改這個檔案，minikube 都幫你設好了。但後面如果你同時有多個叢集，就需要了解 kubeconfig 的切換，到時候再說。

好，來用 kubectl 探索。

第一個指令，kubectl get nodes。你應該會看到一行輸出，一個 Node，名字叫 minikube，狀態 Ready，角色 control-plane。Ready 代表這個 Node 是健康的。control-plane 就是 Master 的意思。因為 minikube 是單節點，Master 和 Worker 合在一起，所以只有一個 Node 同時扮演兩個角色。等第五堂課用 k3s，你就會看到兩個 Node 了，一個 control-plane、一個 worker。

第二個指令，kubectl cluster-info。這會顯示 API Server 的位址和 CoreDNS 的位址。API Server 就是上一支影片講的叢集大門，你看到它跑在一個 https 的位址上，通常是 https 加上一個 IP 和 Port。CoreDNS 就是叢集內部的 DNS 服務，讓 Pod 可以用 Service 名字找到對方。

你可能會問，為什麼 API Server 用 https 不是 http？因為安全。所有跟叢集的溝通都要加密，這是 K8s 的安全設計。kubectl 發出的每一個請求都帶著你的身份憑證，經過 TLS 加密傳輸給 API Server。API Server 驗證你的身份之後才會處理。這些細節你現在不用深究，知道有這層安全機制就好。

好，到這裡叢集跑起來了，kubectl 也能用了。我們驗證了三件事：minikube 安裝成功、叢集正常運行、kubectl 可以跟叢集溝通。接下來我們要去叢集裡面看看，前面講的那些架構組件，是不是真的都在裡面跑。

---

# 影片 4-8：動手做（下）— 親眼看到架構組件（~15min）

## 本集重點

- kubectl get pods -n kube-system → 逐一對照架構圖
- K8s 用 Pod 跑自己的組件 → 自己管自己
- kubectl describe node → Container Runtime 版本、CPU/Memory、Pod 列表
- Namespace = 叢集裡的資料夾（kube-system / default / kube-public / kube-node-lease）
- minikube dashboard → 圖形介面
- Docker vs kubectl 指令對照：

| Docker 指令 | kubectl 指令 | 用途 |
|:---|:---|:---|
| `docker ps` | `kubectl get pods` | 看運行中的容器/Pod |
| `docker logs <container>` | `kubectl logs <pod>` | 看日誌 |
| `docker exec -it <container> bash` | `kubectl exec -it <pod> -- bash` | 進容器 |
| `docker stop + rm` | `kubectl delete pod <pod>` | 刪除 |
| `docker compose up -f` | `kubectl apply -f` | 用檔案部署 |
| — | `kubectl describe <resource>` | 查看詳細資訊 |
| — | `kubectl api-resources` | 列出所有資源類型 |

- 上午總結 + 下午預告（YAML → 第一個 Pod）

## 逐字稿

上一支影片我們裝好了 minikube，用 kubectl get nodes 確認叢集在跑，用 kubectl cluster-info 看到了 API Server 的位址。環境就緒了，現在來做最有意思的部分：親眼看到前面講的架構組件。

執行 kubectl get pods -n kube-system。

這裡有一個新東西，-n kube-system。-n 是指定 Namespace。什麼是 Namespace？你就把它想成叢集裡面的資料夾。你電腦上用資料夾分類檔案，K8s 用 Namespace 分類資源。kube-system 這個 Namespace 是 K8s 自動建立的，專門用來放它自己的管理組件。你自己建的 Pod 預設會放在另一個叫 default 的 Namespace 裡面。用資料夾分開，管理組件跟你的應用不會混在一起。

好，你按下 Enter 之後，應該會看到一堆 Pod，狀態都是 Running。讓我們一個一個來對照。

第一個，etcd-minikube。眼熟吧？這就是 etcd，叢集的資料庫。前一支影片我們說所有叢集狀態都記在 etcd 裡面，它就在這裡跑著。

第二個，kube-apiserver-minikube。這就是 API Server，叢集的大門。你剛才敲的每一行 kubectl 指令，全部都是通過它處理的。你現在看到它是一個 Pod，它是以 Pod 的身份在這個叢集裡面跑的。

第三個，kube-scheduler-minikube。Scheduler，調度器。決定新 Pod 放在哪個 Node。不過我們現在只有一個 Node，所以它現在的工作很輕鬆，所有 Pod 都只能放同一個地方。等第五堂課有多個 Node 的時候，它就忙起來了。

第四個，kube-controller-manager-minikube。Controller Manager，那個二十四小時不睡覺的監工。持續比較期望狀態和實際狀態。

第五個，kube-proxy 加上一串隨機字元。kube-proxy，負責網路轉發。每個 Node 上都有一個。

第六個，coredns 加上一串隨機字元。CoreDNS 不是我們前面講的七個架構組件之一，但它非常重要。它是叢集內部的 DNS 服務。還記得我們講 Service 的時候說 Pod 可以用 Service 名字互相找到對方嗎？就是 CoreDNS 在背後做解析。

你注意到一件很有意思的事了嗎？K8s 的管理組件本身就是用 Pod 跑的。K8s 用 Pod 管理自己的組件，自己管自己。API Server 是一個 Pod，etcd 是一個 Pod，Scheduler 也是一個 Pod。這是一個非常優雅的設計。就像一個工廠的管理軟體本身也跑在這個工廠的電腦上一樣。

好，組件都看到了。接下來看看 Node 的詳細資訊。執行 kubectl describe node minikube。

這個指令的輸出比較長，不要被嚇到。我帶你看幾個重要的部分。

最上面是基本資訊。Name 是 minikube，Roles 是 control-plane。Labels 區塊有一些標籤，這些標籤後面可以用來做調度規則，比如 Scheduler 可以根據標籤來決定 Pod 放哪裡。

往下滑，找到 System Info 區塊。這裡有幾個重點。Container Runtime 會顯示 containerd 加上版本號。看到了嗎？驗證了我們前面說的：K8s 用的是 containerd，不是 Docker。Kubelet Version 會顯示 kubelet 的版本，通常跟你的 K8s 版本一致。Operating System 是 linux，Architecture 是 amd64。

再往下，Capacity 和 Allocatable 區塊。Capacity 是這台 Node 的總資源，CPU 幾核、記憶體多大。Allocatable 是可以分配給 Pod 使用的量，會比 Capacity 少一點，因為 K8s 會保留一些資源給系統自己用。還記得 Scheduler 怎麼決定 Pod 放哪裡嗎？它看的就是這些數字。哪台 Node 的 Allocatable 資源還有餘量，就把 Pod 往那邊送。

最下面有一個 Non-terminated Pods 區塊，列出這個 Node 上所有正在跑的 Pod。你會看到剛才在 kube-system 裡看到的那些管理組件全部列在這裡。一台 Node、上面跑著哪些 Pod、各用了多少資源，一目了然。

接下來看看叢集裡面有哪些 Namespace。執行 kubectl get ns。ns 是 namespace 的簡寫，kubectl 很多資源都有簡寫，以後用熟了打簡寫會快很多。

你會看到四個 Namespace。default 是預設的，你之後建的 Pod 如果不指定 Namespace 就會放在這裡。kube-system 就是剛才看的，放管理組件。kube-public 放一些公開可讀的資訊。kube-node-lease 記錄 Node 的心跳，K8s 用它來判斷 Node 還活不活著。最常用的就是 default 和 kube-system，其他兩個知道有就好。

好，來看一個好玩的東西。執行 minikube dashboard。

這會在你的瀏覽器裡打開 K8s 的 Dashboard，一個圖形化的管理介面。左邊是導覽列，你可以看到 Namespaces、Nodes、Pods、Services、Deployments 各種資源。你點 Workloads 裡面的 Pods，選 kube-system 這個 Namespace，就會看到剛才用 kubectl 看到的那些 Pod，用圖形化的方式呈現。每個 Pod 的狀態、IP、啟動時間都列得清清楚楚。

你也可以點 Cluster 裡面的 Nodes，看到 minikube 這個 Node 的 CPU 和記憶體使用率。跟剛才 kubectl describe node 看到的資訊是一樣的，只是換了圖表的方式呈現。

Dashboard 對初學者很有幫助，直觀地理解叢集狀態。但日常工作中，大部分工程師還是用 kubectl，打指令比點滑鼠快得多，而且可以寫成腳本自動化。兩種方式各有優點，看場景選擇。

好，最後我們來做一個 Docker 和 kubectl 的指令對照，幫你建立直覺。

docker ps 看容器，對應 kubectl get pods 看 Pod。docker logs 看日誌，對應 kubectl logs。docker exec -it 進容器，對應 kubectl exec -it，注意 kubectl 的版本要在 Pod 名稱後面加兩個破折號再接命令。docker stop 和 rm 停止刪除容器，對應 kubectl delete pod。docker compose up -f 用檔案部署，對應 kubectl apply -f 用 YAML 部署。

邏輯完全一樣，只是換了指令名稱。如果你 Docker 用得熟，kubectl 上手會非常快。

還有一個很實用的指令：kubectl api-resources。它會列出 K8s 支援的所有資源類型。Pod、Service、Deployment、ConfigMap 全部都在裡面。你會發現 K8s 的資源類型非常多，好幾十種。不用慌，常用的就是我們上午講的那八個。其他的用到再學。

這個指令還會顯示每種資源的簡寫。pods 簡寫 po，services 簡寫 svc，deployments 簡寫 deploy，namespaces 簡寫 ns。以後用熟了就直接打簡寫，kubectl get po、kubectl get svc，又快又省事。

好，最後做一個上午的完整總結。

我們從一個問題開始：Docker 在一台機器上跑得很好，但到了生產環境，五個問題逼出了 K8s。

然後我們用因果鏈認識了八個核心概念。要跑容器用 Pod。Pod 的 IP 會變、外面連不到，加 Service。Service 的地址太醜使用者不能用，加 Ingress。設定寫死在 Image 要重 build，用 ConfigMap。密碼不能明文放，用 Secret。資料不能跟著容器消失，用 Volume。一個 Pod 掛了就停服務，用 Deployment。資料庫有狀態不能亂來，用 StatefulSet。八個概念，每一個都是因為前一步沒解決的問題。

接著我們看了架構。Worker Node 上 Container Runtime 跑容器、kubelet 管 Pod、kube-proxy 管網路。Master Node 上 API Server 收指令、etcd 記狀態、Controller Manager 監控修復、Scheduler 分配資源。我們用一個完整的部署流程把所有組件串了起來。

最後我們裝好了 minikube，用 kubectl 親手探索叢集，在 kube-system 裡親眼看到了每一個架構組件都以 Pod 的形式在跑。用 describe node 看了 Container Runtime 是 containerd、看了 CPU 和記憶體、看了上面跑了哪些 Pod。還打開了 Dashboard 的圖形介面。

這就是上午的全部內容。你現在對 K8s 有了一個清晰的全貌：它是什麼、為什麼需要它、有哪些概念、架構長什麼樣、環境怎麼搭。

下午我們就要開始真正的實作了。先學 YAML 的基本格式，因為 K8s 的所有資源都是用 YAML 來定義的。然後寫你的第一個 Pod，把 nginx 跑起來，對它做各種操作。接著我們會故意把 Pod 搞壞，學會用 describe 和 logs 來排錯。最後還會做一個多容器的 Pod，體驗 Sidecar 模式。

準備好了嗎？休息十分鐘，下午見。
