# 第五堂上午逐字稿 v3 — 因果鏈敘事（開場 + Loop 1-2）

> 8 支影片：5-1 到 5-8
> 主線：單節點看不出分散 → k3s 多節點 → 擴縮容 → 滾動更新 + 回滾
> 因果鏈銜接第四堂：Deployment 初體驗 → 但 minikube 只有一個 Node

---

# 影片 5-1：第四堂回顧 + 為什麼需要多節點（~10min）

## 本集重點

- 因果鏈快速回顧第四堂：Docker 扛不住 → Pod → Service → Ingress → ConfigMap → Secret → Volume → Deployment → StatefulSet → 架構 → YAML → Pod CRUD → 排錯 → Sidecar → kubectl 進階 → 環境變數 → Deployment 初體驗
- 第四堂最後用 Deployment 跑了 3 個 Pod，但 minikube 只有一個 Node → 全擠同一台
- 問題：Node 掛了 3 個 Pod 全死，分散部署的優勢體現不出來
- 解法：k3s 多節點叢集
- k3s vs minikube 比較
- 環境方案：Multipass 開 VM，一台 master 一台 worker

| 比較 | minikube | k3s |
|:---|:---|:---|
| 節點數 | 單節點 | 多節點（真正的叢集） |
| 用途 | 本機開發測試 | 開發 / 邊緣 / 生產皆可 |
| 安裝 | minikube start | curl 一行搞定 |
| Pod 分散 | 全擠同一台 | 自動分散到不同 Node |

## 逐字稿

各位同學大家好，歡迎來到第五堂課。

在正式開始之前，我先幫大家快速回顧一下第四堂課我們走過的路。第四堂課的量很大，我們從頭到尾跑了一整條因果鏈。

一開始我們問的是：Docker 在一台機器上跑得很好，但規模一大就扛不住了，五個問題逼出了 K8s。進到 K8s 之後，第一步要跑容器，學了 Pod。Pod 跑起來了，但 IP 會變、外面連不到，學了 Service。Service 可以連但地址太醜，學了 Ingress。設定寫死在 Image 裡，學了 ConfigMap。密碼不能放 ConfigMap，學了 Secret。容器掛了資料消失，學了 Volume。只有一個 Pod 掛了就停服務，學了 Deployment。資料庫有狀態，學了 StatefulSet。

這八個概念建立了全貌之後，我們換了角度看架構。Master Node 有四個元件，API Server、etcd、Scheduler、Controller Manager。Worker Node 有三個元件，kubelet、kube-proxy、Container Runtime。kubectl 是你跟叢集溝通的橋梁，所有指令都是送給 API Server。

然後我們動手了。先學了 YAML 的四欄位格式，接著建了第一個 Pod，練了 CRUD，學了排錯三板斧：get 看狀態、describe 看 Events、logs 看日誌。下午還學了 Sidecar 多容器模式、kubectl 的進階技巧、用環境變數跑 MySQL。最後一個環節，我們體驗了 Deployment，用 replicas 3 跑了三個 nginx Pod。

好，我現在問大家一個問題。第四堂最後那個 Deployment 實驗，你 kubectl get pods -o wide 的時候，三個 Pod 的 NODE 欄位寫的是什麼？

都是同一個，對不對？因為我們用的是 minikube，minikube 就只有一個 Node。三個 Pod 全部擠在同一台機器上。

那我們回想一下，第一支影片講 K8s 解決的五個問題，其中第二個是什麼？機器掛了，上面的容器全死了，K8s 會自動搬到其他機器。但你現在只有一台機器，搬到哪裡？無處可搬。你的三個 Pod 看起來有三個副本，但其實跟只有一個沒差太多。因為它們共享命運，那台 Node 一掛，三個 Pod 全死。

Deployment 的擴縮容也是一樣。你 scale 到 5 個 Pod，5 個全在同一台，那台的 CPU 和記憶體就是上限。你加再多副本也不會多出新的運算資源，因為就只有那一台機器。

還有後面要教的 DaemonSet，它的功能是每個 Node 跑一份。但你只有一個 Node，那 DaemonSet 就只會跑一個 Pod，跟普通 Deployment replicas 1 有什麼差別？看不出來。

NodePort Service 也是，它在每個 Node 上開一個 Port 讓外面連。但你只有一個 Node，只有一個 IP 能連，體會不到「連任何一個 Node 都能進」的效果。

所以結論很明確：如果你要親眼看到排程分散、NodePort 多節點入口、DaemonSet 每節點一份，這一段課程最好用多節點環境。沒有多節點，很多現象只能靠想像，沒辦法現場驗證。

那怎麼辦？如果你只是想在本機做多節點示範，minikube 其實也支援 multi-node。不過這門課後續會改用 k3s，因為它更輕量，也更貼近常見的多 VM 實作環境。我們需要一個真正能跑多節點的 K8s 叢集。

這就要介紹 k3s 了。k3s 是 Rancher Labs 開發的輕量版 Kubernetes。官方對名字的說法是：Kubernetes 這個 10-letter word 可縮寫成 K8s，half as big 的 5-letter word 可寫成 K3s。重點不是「只剩 3 個字母」，而是它保留 Kubernetes API 相容性，同時把安裝和資源占用做得更輕。你之前學的所有 kubectl 指令、所有 YAML 格式，在 k3s 上一樣適用。

k3s 跟 minikube 的常見使用情境不太一樣。minikube 常拿來做本機學習和開發測試；k3s 是一個真正的 K8s 發行版，可以跑多節點，也常見於邊緣運算和輕量化部署。很多 IoT 的場景都用 k3s，因為它資源佔用少，一台樹莓派都跑得動。

那我們的環境方案是這樣的。用 Multipass 在你的電腦上開兩台 Ubuntu 虛擬機。Multipass 是 Canonical 出品的工具，就是做 Ubuntu 那家公司。一行指令就能開一台 Ubuntu VM，非常方便。我們開兩台 VM，一台裝 k3s master，一台裝 k3s worker，加入同一個叢集。這樣就有兩個 Node 了。

如果你的電腦記憶體夠大，想開三台也可以，一台 master 兩台 worker，效果更明顯。但兩台就夠用了，重點是看到 Pod 分散在不同 Node。

好，方案確定了，下一支影片我們來動手裝。

---

# 影片 5-2：k3s 安裝實作（~12min）

## 本集重點

- Multipass 安裝 + 建 VM
- Master 節點安裝 k3s
- 取得 token + Worker 節點加入
- kubectl get nodes 驗證兩個節點
- kubeconfig 設定讓本機 kubectl 連到 k3s
- 部署 Deployment → kubectl get pods -o wide → Pod 分散了
- 跟 minikube 對比

## 逐字稿

好，上一支影片我們說清楚了為什麼需要多節點，這支影片直接動手裝。我會一步一步帶著做，大家跟著操作。

第一步，安裝 Multipass。macOS 的同學用 brew install multipass，Windows 用 choco install multipass，Linux 用 sudo snap install multipass。裝好之後在終端機打 multipass version，看到版本號就表示裝好了。

第二步，建虛擬機。我們建兩台，一台當 master，一台當 worker。

multipass launch --name k3s-master --cpus 2 --memory 2G --disk 10G

multipass launch --name k3s-worker1 --cpus 2 --memory 2G --disk 10G

每台分配 2 顆 CPU、2GB 記憶體、10GB 硬碟。如果你的電腦記憶體有 16G 以上，可以再多開一台 worker2，三台效果更好。但 8G 記憶體的同學開兩台就差不多了，不要把自己的電腦搞到卡死。

建 VM 需要一點時間，大概一兩分鐘，它要下載 Ubuntu 映像檔。等它跑完，你可以用 multipass list 看到兩台 VM 都是 Running 狀態。

第三步，在 master 上安裝 k3s。一行指令搞定。

multipass exec k3s-master -- bash -c "curl -sfL https://get.k3s.io | sh -"

就這樣，一行。如果你之前用過 kubeadm 裝過完整版 K8s，你會知道那有多痛苦。要裝 kubelet、kubeadm、kubectl，要設定 cgroup driver，要處理各種相容性問題，搞不好半小時都裝不完。k3s 就一行 curl，三十秒搞定，所有東西都幫你裝好了。

裝完之後，我們先驗證一下 master 有沒有裝好。

multipass exec k3s-master -- sudo kubectl get nodes

你應該會看到一個節點，名字是 k3s-master，狀態是 Ready。目前只有一個節點，因為 worker 還沒加入。

第四步，取得 join token。master 裝好之後會產生一個 token，worker 要用這個 token 才能加入叢集。就像俱樂部的會員邀請碼，有碼才能進。

TOKEN=$(multipass exec k3s-master -- sudo cat /var/lib/rancher/k3s/server/node-token)

再取得 master 的 IP 位址。

MASTER_IP=$(multipass info k3s-master | grep IPv4 | awk '{print $2}')

這兩個值等一下 worker 加入的時候要用到。

第五步，worker 加入叢集。

multipass exec k3s-worker1 -- bash -c "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$TOKEN sh -"

跟裝 master 的指令幾乎一樣，差別在於多了兩個環境變數。K3S_URL 告訴 worker master 在哪裡，K3S_TOKEN 是加入的憑證。如果你用過 Docker Swarm，這個概念一模一樣。docker swarm init 之後它會給你一行 docker swarm join 的指令，裡面也有 token 和 IP。k3s 的邏輯完全相同。

等個三十秒左右，worker 就加入了。

第六步，驗證。回到 master 上看。

multipass exec k3s-master -- sudo kubectl get nodes

現在你應該看到兩個節點了。k3s-master 和 k3s-worker1，狀態都是 Ready。如果 worker 的狀態還是 NotReady，再等個幾秒，它在做初始化。

看到兩個 Ready，恭喜你，你現在擁有一個真正的多節點 K8s 叢集了。

第七步，設定 kubeconfig。現在你每次操作都要打 multipass exec k3s-master 開頭，很麻煩。我們把 master 的 kubeconfig 複製到本機，這樣直接在本機打 kubectl 就能操作叢集。

multipass exec k3s-master -- sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/k3s-config

複製出來之後要改一個地方。k3s.yaml 裡面的 server 地址寫的是 127.0.0.1，但你在本機，不是在 master VM 裡面，所以要改成 master 的實際 IP。

sed -i '' "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config

然後設定環境變數。

export KUBECONFIG=~/.kube/k3s-config

現在直接打 kubectl get nodes，不用再 multipass exec 了，直接在本機操作。兩個 Ready 的節點。

好，環境搞定了，來做今天最重要的驗證。我們部署一個 Deployment，然後看 Pod 有沒有分散。

kubectl create deployment my-nginx --image=nginx --replicas=3

等個幾秒，Pod 跑起來之後。

kubectl get pods -o wide

注意看 NODE 那一欄。如果一切順利，你會看到有些 Pod 跑在 k3s-master，有些跑在 k3s-worker1。Pod 分散在不同 Node 上了。

這就是跟 minikube 最大的差別。minikube 的時候 NODE 那欄全部是 minikube，三個 Pod 擠在同一台。現在有了 k3s 多節點，Scheduler 會自動決定 Pod 放哪台，把它們分散開來。

想像一下，如果 k3s-worker1 掛了，上面的 Pod 會被 K8s 自動搬到 k3s-master 上。你的服務不會中斷。這就是多節點的價值，也是 Deployment 真正的威力。

環境準備好了，接下來我們深入 Deployment 的進階功能。第四堂課我們學了 Deployment 的基礎：建立、三層關係、寫 YAML。今天要學三個進階功能：擴縮容、滾動更新、回滾。

---

# 影片 5-3：Deployment 擴縮容概念（~15min）

## 本集重點

- 問題：平常 3 個 Pod 夠用，流量暴增 10 倍怎麼辦？
- kubectl scale deployment --replicas=N：一行指令調副本數
- 背後機制：Controller Manager → Scheduler → kubelet
- 縮容：流量退了 scale 回來，多的 Pod 被砍
- 水平擴縮容 vs 垂直擴縮容
- 對照 Docker：docker compose up --scale（只能單機）
- 預告 HPA（第七堂自動擴縮）

| 擴容方式 | 做法 | K8s 對應 |
|:---|:---|:---|
| 水平擴縮容 | 加 Pod 數量 | kubectl scale / HPA |
| 垂直擴縮容 | 加 CPU / 記憶體 | Resource requests/limits（第七堂） |

## 逐字稿

上一支影片我們把 k3s 多節點裝好了，也驗證了 Pod 確實分散在不同 Node 上。環境有了，接下來開始深入 Deployment 的進階功能。

先問大家一個問題。你的電商網站平常每秒處理一千個請求，三個 Pod 分工合作，每個 Pod 處理三百多個，綽綽有餘。但是下個月有週年慶促銷活動，你的老闆跟你說，預計流量會是平常的十倍。一秒鐘一萬個請求。三個 Pod 還扛得住嗎？

扛不住。每個 Pod 的處理能力是有上限的，CPU 就那麼多、記憶體就那麼大。三個 Pod 分三千個請求可以，分一萬個就撐爆了。回應時間從一百毫秒飆到五秒，使用者等不了就關掉了，你的營收直接腰斬。

怎麼辦？加 Pod。三個不夠就加到十個，十個不夠加到二十個。每個 Pod 處理的量少了，回應時間就正常了。

在 K8s 裡面，加 Pod 的操作非常簡單。一行指令。

kubectl scale deployment my-nginx --replicas=10

就這樣。Deployment 的副本數從 3 變成 10。K8s 會自動建 7 個新的 Pod，而且 Scheduler 會把它們分散到不同的 Node 上，讓每台機器的負擔均衡。

你可能會問，背後到底發生了什麼事？我們用第四堂學的架構知識來串一遍。

你打 kubectl scale，這個指令送到 API Server。API Server 把 Deployment 的 replicas 從 3 改成 10，寫進 etcd。Controller Manager 一直在監控 etcd 裡的資料，它發現 Deployment 的期望狀態是 10 個 Pod，但現在只有 3 個，差了 7 個。於是 Controller Manager 通知 Scheduler：「我需要 7 個新 Pod，請分配。」Scheduler 看看各個 Node 的資源狀況，k3s-master 的 CPU 用了百分之四十，k3s-worker1 用了百分之三十，那就這台放四個那台放三個。分配好之後，Scheduler 把決定寫回 etcd。各個 Node 上的 kubelet 發現自己被分配了新 Pod，就開始拉 Image、啟動容器。

整個流程跟第四堂講的「建一個 Pod」的流程一模一樣，只是這次一口氣建七個。架構沒變，只是量變了。

好，週年慶結束了，流量退回正常水準。十個 Pod 有七個閒在那裡，CPU 空轉，佔著記憶體不做事。如果你的叢集跑在雲端，多的 Pod 還佔著雲端的運算資源，那是要花錢的。所以你要把多餘的 Pod 縮回來。

kubectl scale deployment my-nginx --replicas=3

K8s 會砍掉多的七個 Pod。砍哪七個？K8s 有自己的策略，會考慮 Pod 的啟動時間、所在 Node 的負載等等。但你不用管這些細節，你只要說「我要 3 個」，K8s 處理剩下的。

這個操作叫做水平擴縮容，英文是 Horizontal Scaling。水平的意思是加減副本的數量，每個副本的規格不變。你不是讓一個 Pod 變得更強，而是讓 Pod 的數量變多。就像餐廳生意太好，你不是讓一個廚師變成超人，而是多請幾個廚師。每個廚師的能力一樣，但人多力量大。

另一種擴容方式叫垂直擴縮容，Vertical Scaling。垂直的意思是加大單個 Pod 的 CPU 和記憶體。就像給廚師更大的鍋子和更強的爐灶。但垂直擴容有上限，一台機器的 CPU 就那麼多，你不可能無限加。而且改 CPU 和記憶體通常需要重啟 Pod。水平擴縮容沒有這個問題，理論上你可以加到幾百個副本，只要你的叢集有足夠的 Node 和資源。

所以在 K8s 裡面，水平擴縮容是最常用的。大部分的無狀態應用，API、前端、微服務，都是靠加副本來扛流量。

對照一下 Docker。Docker Compose 也可以做擴容，docker compose up --scale web=10，但它只能在一台機器上加容器。那台機器的 CPU 和記憶體是上限，加再多容器也沒用。K8s 的 scale 是跨 Node 的，Pod 分散在不同機器上，每台機器都出一份力。這是本質的差異。

最後預告一下。你可能想說，流量暴增的時候我怎麼知道？難道我要二十四小時盯著螢幕看流量圖表，手動打 scale 指令嗎？不用。K8s 有一個功能叫 HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。你設定一個規則，比如 CPU 使用率超過百分之七十就自動加 Pod，降到百分之三十就自動縮。連 scale 指令都不用打，K8s 全自動。第七堂課會詳細講。今天我們先學手動 scale，理解原理。

好，概念講完了，下一支影片我們來動手操作。

---

# 影片 5-4：擴縮容實作（~12min）

## 本集重點

- 建 nginx Deployment replicas:3 → get pods -o wide 看分散
- scale 到 5 → 看新 Pod 出現 + 分散
- scale 到 2 → 看多的 Pod 被 Terminating
- kubectl get deploy 看 READY 欄位
- kubectl edit deployment 也能改 replicas（但建議用 scale 指令）

學員實作題目：
- 必做：建 httpd Deployment replicas:2 → scale 到 5 → 觀察 -o wide → scale 回 1
- 挑戰 1：scale 到 0（會怎樣？Pod 全砍但 Deployment 還在，scale 回來就恢復）
- 挑戰 2（預告體驗）：開兩個終端，模擬「自動擴縮」的感覺
  - 終端 1：kubectl get pods -w（持續觀察，不要關）
  - 終端 2：快速連打以下指令，每次打完等 5 秒看終端 1 的變化
    - kubectl scale deployment nginx-deploy --replicas=5
    - kubectl scale deployment nginx-deploy --replicas=8
    - kubectl scale deployment nginx-deploy --replicas=10
    - kubectl scale deployment nginx-deploy --replicas=3
  - 在終端 1 你會看到 Pod 快速增加、快速減少，非常有感
  - 這就是第七堂 HPA 自動幫你做的事：流量大自動加 Pod，流量小自動砍 Pod。現在你手動模擬，第七堂讓 K8s 全自動

## 逐字稿

好，上一支影片講了擴縮容的概念，這支影片我們直接動手操作。請大家打開終端機，確認你的 k3s 叢集還在跑，kubectl get nodes 看到兩個 Ready 的節點。

如果你剛才跟著 5-2 做過，應該已經有一個 my-nginx 的 Deployment 在跑了。我們先清掉它重新來，從頭做一次比較乾淨。

kubectl delete deployment my-nginx

好，現在重新建一個 Deployment，三個副本。

kubectl create deployment my-nginx --image=nginx --replicas=3

等個幾秒，Pod 跑起來之後，我們來看。

kubectl get pods -o wide

注意看 NODE 那一欄。你應該會看到有的 Pod 在 k3s-master，有的在 k3s-worker1。三個 Pod 分散在兩個 Node 上。如果三個碰巧都在同一台，也不用擔心，Scheduler 的分配會考慮很多因素，不是每次都完美平均。但通常會盡量分散。

再看一下 Deployment 的狀態。

kubectl get deploy

你會看到 READY 欄位顯示 3/3，表示期望 3 個、就緒 3 個。UP-TO-DATE 是 3，表示 3 個都是最新版本。AVAILABLE 是 3，表示 3 個都可用。

好，現在來擴容。假設流量來了，我們把副本數從 3 加到 5。

kubectl scale deployment my-nginx --replicas=5

馬上看 Pod。

kubectl get pods -o wide

你會看到多了兩個 Pod，狀態可能是 ContainerCreating 或者已經是 Running。看 NODE 欄位，新的 Pod 也被分散到不同 Node 上了。再看一下 Deployment。

kubectl get deploy

READY 從 3/3 變成 5/5 了。五個副本，全部就緒。

好，流量退了，我們縮回來。不縮回 3，這次縮到 2 試試看。

kubectl scale deployment my-nginx --replicas=2

馬上看 Pod。

kubectl get pods

你會看到有三個 Pod 的狀態變成 Terminating，正在被關閉。等個幾秒再看，就只剩兩個 Running 的了。K8s 幫你砍掉了多的 Pod，乾淨俐落。

我再介紹另一種改副本數的方法。除了 kubectl scale，你也可以用 kubectl edit deployment my-nginx。執行這個指令會打開一個編輯器，裡面是 Deployment 的完整 YAML。你找到 replicas 那一行，改成你要的數字，存檔退出，K8s 就會自動調整。

但我個人比較建議用 kubectl scale。原因很簡單，scale 指令一目了然，而且不容易手誤改到其他欄位。kubectl edit 打開一大坨 YAML，萬一你手滑改到別的地方，可能會造成意想不到的問題。生產環境操作越簡單越安全。

好，我再補充一個重點。kubectl scale 的對象是 Deployment，不是 Pod。有些剛學的同學會嘗試 kubectl scale pod 什麼什麼，那是不行的。Pod 沒有副本的概念，它就是一個。能 scale 的是 Deployment，因為 Deployment 才有 replicas 這個欄位。

接下來是你們的實作時間。螢幕上有題目，我唸一遍。

必做題：建一個 httpd 的 Deployment，初始副本數 2。然後 scale 到 5，用 kubectl get pods -o wide 觀察 Pod 分散在哪些 Node 上。觀察完之後 scale 回 1。

挑戰題：嘗試 scale 到 0。你猜會怎樣？Pod 全部被砍掉了，但 Deployment 還在。kubectl get deploy 可以看到它，只是 READY 欄位顯示 0/0。然後你 scale 回 3，Pod 就又建回來了。Deployment 沒有消失，它只是暫時沒有 Pod。這在某些場景很有用，比如你要維護某個服務，暫時不想讓它跑，scale 到 0 就好，不用刪 Deployment。

大家動手做，有問題舉手。

---

# 影片 5-5：回頭操作 Loop 1（~5min）

## 本集重點

- 帶做一遍 scale 操作
- 常見坑：scale 的是 Deployment 不是 Pod、忘了看 -o wide
- 探索建議：kubectl describe deployment 看 Events 裡的 scale 記錄

## 逐字稿

好，時間差不多了，我們來回頭操作一遍，確認大家都做到了。

如果你的 httpd Deployment 還在的話，先不用刪，我們直接用它來練。如果你不小心刪掉了，重新建一個就好。kubectl create deployment my-httpd --image=httpd --replicas=2。

第一步，確認 Deployment 存在。

kubectl get deploy

你應該看到 my-httpd，READY 是 2/2。

第二步，擴容。

kubectl scale deployment my-httpd --replicas=5

然後馬上看 Pod。

kubectl get pods -o wide

確認五個 Pod 都在跑，而且注意看 NODE 欄位，有沒有分散到不同 Node。

第三步，縮容。

kubectl scale deployment my-httpd --replicas=1

看 Pod，應該只剩一個。

好，這裡提兩個常見的坑。

第一個坑，有同學打了 kubectl scale pod 然後加 Pod 的名字。這是不行的，Pod 沒有 scale 的概念。你要 scale 的是 Deployment。記住，你永遠操作的是 Deployment，讓 Deployment 去管 Pod。

第二個坑，有同學用 kubectl get pods 看完說「Pod 數量對了」就結束了。但你沒有看 -o wide。-o wide 會顯示 Pod 跑在哪個 Node 上，這是今天很重要的觀察點。沒有 -o wide，你看不到分散的效果，就浪費了 k3s 多節點的意義。

最後給大家一個探索建議。你可以用 kubectl describe deployment my-httpd 看 Events 區塊。每次你 scale，Events 裡面都會記錄一筆。類似 Scaled up replica set my-httpd-xxxxx to 5，或者 Scaled down replica set my-httpd-xxxxx to 1。這些記錄讓你看到 Deployment 的每一次變化，在排查問題的時候非常有用。

好，擴縮容學完了。我們已經可以根據流量動態調整 Pod 的數量。但還有另一個常見的需求：版本更新。你的 API 有新版本要上線，怎麼把舊版換成新版？下一支影片我們來解決這個問題。

---

# 影片 5-6：滾動更新 + 回滾概念（~15min）

## 本集重點

- 問題：API 有新版本 v2，怎麼把 v1 換成 v2？
- 最土的方法：先砍再建 → 中間有空窗期
- Deployment 的滾動更新：逐步替換，零停機
- 四步驟詳解：建 v2 → 健康檢查 → 砍 v1 → 重複
- 背後機制：新 ReplicaSet 擴 + 舊 ReplicaSet 縮
- 回滾：kubectl rollout undo → 舊 ReplicaSet 重新擴容
- kubectl rollout history → 部署歷史
- revisionHistoryLimit 預設保留 10 個版本
- 對照 Docker：Docker 沒有內建滾動更新

| 操作 | 指令 |
|:---|:---|
| 觸發滾動更新 | kubectl set image deployment/名稱 容器名=新image |
| 看更新進度 | kubectl rollout status deployment/名稱 |
| 回滾到上一版 | kubectl rollout undo deployment/名稱 |
| 回滾到指定版本 | kubectl rollout undo deployment/名稱 --to-revision=N |
| 看歷史版本 | kubectl rollout history deployment/名稱 |

## 逐字稿

上一個 Loop 我們學了擴縮容，可以根據流量調整 Pod 的數量。但是另一個問題來了。

假設你是一個後端工程師，你的 API 跑的是 nginx 1.26 版。團隊開發了新功能，打包成新的 Image nginx 1.27。現在要把線上的 v1.26 換成 v1.27。怎麼做？

最直覺的方法，也是最土的方法，就是先把舊的 Pod 全部砍掉，然後用新的 Image 建一批新的。操作很簡單，但有一個致命的問題。在舊的被砍掉、新的還沒跑起來的那段時間，Service 後面沒有任何 Pod 可以處理請求。使用者看到的就是一片空白或者 502 Bad Gateway。

這段空窗期可能只有幾秒到幾十秒，但對電商網站來說，幾秒鐘就是幾萬塊的損失。對金融系統來說，幾秒鐘可能就是一筆交易出錯。生產環境不允許這樣做。

那怎麼辦？你可以自己寫一套更新腳本。先建一批新版的容器，等新的跑穩了再砍舊的。但這個腳本要處理很多邊界情況：新容器啟動失敗怎麼辦？健康檢查怎麼定義？舊容器正在處理的請求怎麼收尾？寫得好是一門學問，寫不好就是半夜出事故。

K8s 的 Deployment 幫你解決了這整件事，而且只需要一行指令。它用的策略叫滾動更新，Rolling Update。

滾動更新的核心概念就是四個字：逐步替換。不是一口氣全砍全建，而是一個一個來。我用一個具體的例子講。

假設你有三個 Pod，都跑 nginx 1.26，我們叫它 v1。你要更新到 nginx 1.27，叫它 v2。

第一步，Deployment 先建一個 v2 的 Pod。現在叢集裡有三個 v1 加一個 v2，一共四個。Service 會把流量導到這四個 Pod，新舊都接客。

第二步，v2 的 Pod 跑起來了，K8s 做健康檢查確認它正常回應。確認沒問題之後，Deployment 砍掉一個 v1 的 Pod。現在兩個 v1 加一個 v2，三個。

第三步，再建一個 v2，確認健康，再砍一個 v1。一個 v1 加兩個 v2。

第四步，再建一個 v2，砍掉最後一個 v1。三個 v2，更新完成。

整個過程，任何時刻都有 Pod 在服務。使用者的請求不會落空。就像接力賽，下一棒跑起來了上一棒才放手，不會出現沒人跑的空檔。

那 Deployment 背後是怎麼實現的？記得我們第四堂講的三層關係：Deployment 管 ReplicaSet，ReplicaSet 管 Pod。滾動更新的秘密就在 ReplicaSet 這一層。

當你觸發更新的時候，Deployment 做了一件事：建立一個全新的 ReplicaSet。舊的 ReplicaSet 管 v1 的 Pod，新的 ReplicaSet 管 v2 的 Pod。然後 Deployment 逐步把舊 ReplicaSet 的副本數從 3 降到 0，同時把新 ReplicaSet 的副本數從 0 升到 3。就像蹺蹺板，一邊下去一邊上來。

你用 kubectl get rs 可以看到兩個 ReplicaSet。一個副本數是 3，那是新版的。另一個副本數是 0，那是舊版的。舊的 ReplicaSet 沒有被刪掉，它還在，只是副本數歸零了。為什麼要保留？因為回滾要用。

這就引出了第二個重要功能：回滾。

萬一 v2 上線之後，使用者回報了 bug。API 的某個功能壞了，回應錯誤的資料。你的老闆衝過來說「趕快退回去」。這時候你怎麼辦？

kubectl rollout undo deployment/my-nginx

一行指令。Deployment 把舊的 ReplicaSet 重新擴容回 3 個副本，新的 ReplicaSet 縮到 0。因為舊的 ReplicaSet 還在、舊版的 Image 也還在本機快取裡，所以回滾速度非常快，通常幾十秒搞定。不需要重新 build Image，不需要重新推到 Registry，直接用之前的版本啟動。

你還可以用 kubectl rollout history deployment/my-nginx 看部署歷史。它會列出每一次的版本號，叫做 revision。如果你不是要回到上一版，而是要回到更早的某個版本，可以指定版本號。

kubectl rollout undo deployment/my-nginx --to-revision=2

K8s 預設會保留最近十個版本的 ReplicaSet 記錄，這個數字由 Deployment 的 revisionHistoryLimit 欄位控制。十個對大多數場景來說夠用了。如果你改得很頻繁、想保留更多歷史，可以把這個數字調大。

最後對照一下 Docker。Docker 完全沒有內建的滾動更新機制。Docker Compose 也沒有。你用 docker compose up -d 更新 Image 版本，它就是直接砍掉舊容器建新容器，中間有空窗期。Docker Swarm 有滾動更新的功能，但很多人不用 Swarm。K8s 的滾動更新是生產環境的標配，也是 K8s 比 Docker 強大的一個重要原因。

好，概念講完了。你現在知道滾動更新是逐步替換、不停機，背後靠的是新舊 ReplicaSet 的蹺蹺板。回滾就是把舊 ReplicaSet 重新啟用。下一支影片我們來動手操作。

---

# 影片 5-7：滾動更新實作（~15min）

## 本集重點

- 確認 Deployment 在跑（nginx:1.26）
- kubectl set image 觸發滾動更新到 1.27
- kubectl rollout status 看逐步替換過程
- kubectl get pods 看新舊 Pod 交替
- kubectl get rs 看兩個 ReplicaSet
- 驗證：kubectl describe pod 確認 Image 是 1.27
- 回滾：kubectl rollout undo
- kubectl rollout history 看歷史
- rollout undo --to-revision=N

學員實作題目：
- 必做：建 nginx:1.26 Deployment → set image 更新到 1.27 → rollout status 看過程 → get rs 看兩個 ReplicaSet → rollout undo 回滾 → 確認回到 1.26
- 挑戰：故意更新到 nginx:99.99（不存在的版本）→ 觀察滾動更新卡住 → rollout undo 救回來

## 逐字稿

好，這支影片我們來實際操作滾動更新和回滾。請大家打開終端機。

先把之前的 Deployment 清掉，我們重新建一個乾淨的環境。

kubectl delete deployment my-nginx
kubectl delete deployment my-httpd

這次我們用 YAML 來建，因為要指定 Image 版本。你可以用 kubectl create deployment 搭配 --image 來指定版本。

kubectl create deployment my-nginx --image=nginx:1.26 --replicas=3

等 Pod 跑起來之後，先確認一下目前的版本。

kubectl describe deployment my-nginx | grep Image

你應該看到 nginx:1.26。三個 Pod 都跑 1.26 版。

好，現在要來觸發滾動更新了。我們把 Image 從 nginx:1.26 更新到 nginx:1.27。用 kubectl set image 指令。

kubectl set image deployment/my-nginx nginx=nginx:1.27

注意這個指令的格式。deployment/my-nginx 是你要更新的 Deployment 名稱。後面的 nginx=nginx:1.27，等號前面的 nginx 是容器的名字，不是 Deployment 的名字。容器名字在哪裡定義的？在 YAML 的 spec.template.spec.containers.name，或者你用 kubectl create deployment 建的時候它預設用 Image 的名字。等號後面是新的 Image。

指令一打完，滾動更新就開始了。馬上用 rollout status 來觀察。

kubectl rollout status deployment/my-nginx

你會看到類似這樣的輸出：

Waiting for deployment "my-nginx" rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for deployment "my-nginx" rollout to finish: 2 out of 3 new replicas have been updated...
deployment "my-nginx" successfully rolled out

看到 successfully rolled out，更新完成了。

現在來驗證。先看 Pod。

kubectl get pods

你會看到三個 Pod，但名字跟之前不一樣了。因為舊的 Pod 被砍掉了，新的 Pod 由新的 ReplicaSet 建的，名字的 hash 不同。如果你動作夠快，在 rollout status 還在跑的時候用另一個終端機看 kubectl get pods，你會看到舊的 Pod 狀態是 Terminating，新的 Pod 狀態是 ContainerCreating 或 Running，非常精彩。

接下來看 ReplicaSet。

kubectl get rs

這裡是重點。你會看到兩個 ReplicaSet。一個的 DESIRED、CURRENT、READY 都是 3，這是新版 1.27 的。另一個的 DESIRED、CURRENT、READY 都是 0，這是舊版 1.26 的。舊的 ReplicaSet 沒有被刪掉，它還在，只是副本數是 0。

最後驗證 Image 版本。

kubectl describe deployment my-nginx | grep Image

現在顯示 nginx:1.27，更新成功。

好，接下來做回滾。假設我們發現 1.27 版有問題，要退回 1.26。

kubectl rollout undo deployment/my-nginx

一行指令。再看 rollout status。

kubectl rollout status deployment/my-nginx

很快就完成了，因為舊的 ReplicaSet 還在，只需要把它擴回來、新的縮掉。

驗證一下。

kubectl describe deployment my-nginx | grep Image

回到 nginx:1.26 了。

kubectl get rs

這次兩個 ReplicaSet 的角色互換了。之前 READY 是 0 的那個，現在 READY 變成 3。之前 READY 是 3 的，現在變成 0。

我們再看看部署歷史。

kubectl rollout history deployment/my-nginx

你會看到一個列表，每一行是一個 revision。revision 1 是最初的版本，revision 2 是更新到 1.27 的那次，revision 3 是回滾回 1.26 的那次。如果你想回到某個特定的 revision，可以用 --to-revision。

kubectl rollout undo deployment/my-nginx --to-revision=2

這會回到 revision 2，也就是 nginx:1.27。

好，接下來是你們的實作時間。螢幕上有兩個題目。

必做題就是我剛才示範的完整流程。建 nginx:1.26 的 Deployment，replicas 3。用 set image 更新到 1.27。用 rollout status 看更新過程。用 get rs 確認看到兩個 ReplicaSet。用 rollout undo 回滾。用 describe 確認回到 1.26。每一步都要自己親手打一遍。

挑戰題更有趣。故意把 Image 更新到一個不存在的版本，nginx:99.99。

kubectl set image deployment/my-nginx nginx=nginx:99.99

然後看 Pod。

kubectl get pods

你會看到有新的 Pod 狀態是 ImagePullBackOff 或 ErrImagePull。因為根本沒有 99.99 這個版本，K8s 拉不到 Image。但注意看，舊版的 Pod 還活著。K8s 不會把所有舊 Pod 都砍掉才建新的，滾動更新的安全機制讓舊 Pod 保留著。所以你的服務雖然沒有完全更新成功，但也沒有完全掛掉。

這時候 rollout undo 就是你的救命稻草。

kubectl rollout undo deployment/my-nginx

回滾之後，壞掉的新 Pod 被砍，舊版的 Pod 恢復。服務回到正常。

這個場景在實際工作中非常常見。開發人員打錯 Image tag，或者推了一個有問題的 Image，滾動更新卡住了。別慌，rollout undo 一行搞定。

大家動手做，有問題舉手。

---

# 影片 5-8：回頭操作 Loop 2 + 上午總結（~5min）

## 本集重點

- 帶做滾動更新 + 回滾
- 常見坑：set image 的語法（容器名 vs Deployment 名）、回滾是回到上一版不是初始版
- 上午總結：k3s 多節點 → 擴縮容 → 滾動更新 + 回滾
- 下午預告

## 逐字稿

好，時間到了，我們來回頭操作，然後做上午總結。

滾動更新的操作流程很簡單，就三個指令。set image 觸發更新，rollout status 看進度，rollout undo 回滾。大家跟我做一遍。

先確認你有一個 Deployment 在跑。kubectl get deploy。如果沒有，建一個。kubectl create deployment my-nginx --image=nginx:1.26 --replicas=3。

觸發更新。

kubectl set image deployment/my-nginx nginx=nginx:1.27

看進度。

kubectl rollout status deployment/my-nginx

等它完成。然後回滾。

kubectl rollout undo deployment/my-nginx

驗證回到 1.26。

kubectl describe deployment my-nginx | grep Image

好，講兩個常見的坑。

第一個坑，set image 的語法。kubectl set image deployment/my-nginx nginx=nginx:1.27。很多同學會搞混等號前面那個 nginx 是什麼。它是容器的名字，不是 Deployment 的名字，也不是 Image 的名字。容器名字在哪裡看？kubectl get deployment my-nginx -o yaml，找 spec.template.spec.containers 下面的 name 欄位。用 kubectl create deployment 建的話，容器名字預設跟 Image 的名字一樣，所以都叫 nginx，容易搞混。如果你的容器名字叫 web-server，那指令就是 kubectl set image deployment/my-nginx web-server=nginx:1.27。

第二個坑，rollout undo 是回到上一版，不是回到初始版。如果你的歷史是 1.26、1.27、1.28，你在 1.28 的時候 rollout undo，回到的是 1.27，不是 1.26。如果你要回到 1.26，要用 --to-revision 指定版本號。很多同學以為 undo 就是回到最開始，結果回到的不是自己想要的版本。

好，來做上午總結。

今天上午我們做了三件事。

第一件事，搭建 k3s 多節點環境。minikube 只有一個 Node，看不到 Pod 分散的效果。我們用 Multipass 開了兩台 VM，裝了 k3s，一台 master 一台 worker。驗證了 Pod 確實分散在不同 Node 上。

第二件事，學了 Deployment 的擴縮容。流量來了 kubectl scale 加 Pod，流量退了 scale 縮回來。一行指令，Pod 自動分散到不同 Node。背後是 Controller Manager 偵測差異、Scheduler 分配 Node、kubelet 啟動容器。

第三件事，學了滾動更新和回滾。kubectl set image 觸發更新，Deployment 逐步替換舊 Pod 為新 Pod，零停機。背後是新舊 ReplicaSet 的蹺蹺板。萬一新版有問題，kubectl rollout undo 一行指令回到上一版。

三件事串起來就是一條因果鏈。只有一個 Node 看不到分散的效果，所以裝了 k3s 多節點。多節點之後流量來了要加 Pod，所以學了擴縮容。Pod 數量會調了，但版本也要更新，所以學了滾動更新。新版可能有問題，所以學了回滾。每一步都是上一步沒解決的問題。

下午我們繼續這條因果鏈。Pod 跑起來了、能 scale、能更新了，但如果 Pod 自己掛了呢？Deployment 會自動補新的，這叫自我修復。在多節點環境下更震撼，因為掛掉的 Pod 會被補到其他 Node 上。然後我們會學 Labels 和 Selector，搞清楚 K8s 怎麼知道哪些 Pod 屬於哪個 Deployment。再來就進入 Service 的世界，解決「外面怎麼連到 Pod」的問題。ClusterIP、NodePort、DNS、Namespace，一路往下走。

休息一下，下午見。
