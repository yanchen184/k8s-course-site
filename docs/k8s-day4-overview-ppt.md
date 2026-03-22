# 第四堂上午（前 2 小時）：K8s 全貌

> 目標：不動手，純講課，讓學生對 K8s 有完整的全貌認識
> 時間：09:00 - 11:00（120 分鐘，含 10 分鐘休息）
> 參考：GeekHour K8s 入門課程逐字稿 + 筆記

---

## 第 1 頁 | 開場：從 Docker 到 K8s（5 分鐘）

### PPT 內容

**前三堂回顧**

| 堂次 | 學了什麼 | 會做什麼 |
|:---:|---------|---------|
| Day 1 | Linux 基礎 | 終端機操作、檔案管理 |
| Day 2 | Docker 基礎 | Image / Container / Port / Volume |
| Day 3 | Docker 進階 | Dockerfile / Docker Compose |

**今天開始：Kubernetes**

### 逐字稿

好，歡迎來到第四堂課。前三堂我們學了 Linux 基礎、Docker 基礎和進階。到 Day 3 結束的時候，你已經會用 Docker Compose 在一台電腦上跑多個容器了。

但今天我們要問一個問題：**如果你有 100 台機器、500 個容器，Docker Compose 還夠用嗎？**

今天我們要花兩個小時，先把 Kubernetes 的全貌走過一遍。不動手，純聽課。讓你對 K8s 有一個完整的認識，知道它有哪些元件、解決什麼問題。聽完之後，下半場再來動手操作。

---

## 第 2 頁 | 為什麼需要 Kubernetes（10 分鐘）

### PPT 內容

**Docker 的極限：**

- 單機部署 → 機器掛了，服務全停
- 手動管理容器 → 容器多了管不過來
- 沒有自動重啟 → 容器掛了沒人知道
- 手動擴縮 → 流量暴增時來不及反應
- 滾動更新要自己做 → 更新時服務會中斷

**場景想像：**

> 你是一家電商公司的工程師。雙十一快到了，平常 3 個容器就夠，但雙十一那天流量暴增 10 倍。你要怎麼辦？手動開 30 個容器？分散到 10 台機器上？哪台機器有空？容器掛了怎麼知道？

**Kubernetes 就是為了解決這些問題而生的。**

### 逐字稿

隨著容器化技術的發展，越來越多的企業開始使用容器來部署應用程式。容器化的優點很多——快速部署、環境一致、資源利用率高。

但也帶來了新的問題。最突出的就是：**容器的數量會變得非常多，架構也越來越複雜**。

容器數量少的話，Docker Compose 就能搞定。但當容器數量達到成百上千、甚至數以萬計的時候，用 Docker Compose 管理就變得非常困難了。

想像一下你是電商公司的工程師。平常 3 個容器就夠，但雙十一流量暴增 10 倍。你要手動開 30 個容器？分散到 10 台機器上？哪台機器有空位？容器掛了怎麼知道？掛了之後誰來重啟？

這些問題，就是 Kubernetes 要解決的。

---

## 第 3 頁 | Kubernetes 是什麼（5 分鐘）

### PPT 內容

**一句話：Kubernetes 是容器的管理平台。**

- Google 內部的 Borg 系統 → 2014 年開源 → 捐給 CNCF
- K8s 的名字：Kubernetes 是希臘文「舵手」的意思，K 和 s 之間有 8 個字母，所以簡稱 K8s
- 目前是容器編排領域的行業標準

**K8s 能幫你做什麼：**

| 能力 | 說明 | Docker 對照 |
|------|------|-----------|
| 自動排程 | 自動把容器分配到最適合的機器 | 你自己選機器 |
| 自我修復 | 容器掛了自動重啟、自動替換 | 手動 restart |
| 水平擴展 | 流量大就自動加容器 | 手動 scale |
| 滾動更新 | 更新版本不中斷服務 | 手動停舊起新 |
| 服務發現 | 容器之間用名字互連 | --network DNS |
| 負載均衡 | 自動分配流量到多個容器 | 自己設 nginx |

### 逐字稿

Kubernetes 是由 Google 開源的容器編排引擎。Google 內部有一個叫 Borg 的系統，管理了他們幾十億個容器。2014 年 Google 把 Borg 的經驗開源出來，就成了 Kubernetes。

Kubernetes 這個名字是希臘文「舵手」的意思，因為 K 和 s 之間剛好有 8 個字母，所以大家都簡稱它為 K8s。

它能幫你做什麼呢？

第一，**自動排程**。你有 10 台機器，K8s 會自動決定把容器放到哪台機器上，選資源最充足的那台。

第二，**自我修復**。容器掛了，K8s 會自動幫你重啟或者用新的容器替換掉。

第三，**水平擴展**。流量大了，自動多開幾個容器；流量小了，自動關掉多餘的。

第四，**滾動更新**。更新應用版本的時候，它會一個一個慢慢替換，不會一次全停，所以用戶完全感覺不到。

第五，**服務發現和負載均衡**。容器之間可以用名字互相連線，流量會自動分配到多個容器。

用 Docker Compose 的時候，這些事情都要你自己做。K8s 就是把這些全部自動化了。

---

## 第 4 頁 | 核心概念：從一個容器開始（15 分鐘）

### PPT 內容

**一步一步引入 K8s 的資源物件：**

**Step 1：Node + Pod**

- Node = 一台機器（實體機或虛擬機）
- Pod = K8s 最小調度單位 = 一個或多個容器的組合
- 一般建議一個 Pod 放一個容器
- 多容器 Pod = Sidecar 模式（主程式 + 輔助容器）

**Step 2：為什麼 Pod IP 不可靠 → Service**

- Pod 的 IP 是叢集內部的，外部連不到
- Pod 會被銷毀重建，IP 會變
- Service = 穩定的存取入口，幫你轉發到後面的 Pod
- 內部服務（ClusterIP）vs 外部服務（NodePort）

**Step 3：用域名連 → Ingress**

- NodePort 用 IP + Port 連，不方便
- Ingress = HTTP 層的路由器，可以設域名
- 類似 Docker 裡面的 Nginx 反向代理

### 逐字稿

現在我們來一步步認識 K8s 裡面的各種概念。我不會一次丟給你十個名詞，而是從一個最簡單的場景開始，慢慢加東西。

首先，你有一台機器，在 K8s 裡面叫做 **Node**（節點）。Node 就是一台實體機或虛擬機。

在這個 Node 上面，你可以跑容器。但 K8s 不是直接管容器的，它管的是 **Pod**。Pod 是 K8s 最小的調度單位，你可以把它想成容器外面包了一層。一個 Pod 裡面通常就放一個容器，但也可以放多個——比如一個主程式加一個日誌收集器，這種叫做 Sidecar 模式。

好，現在你的應用跑起來了。但有兩個問題。

第一，Pod 的 IP 是叢集內部的，外面連不到。第二，Pod 不是永久的，它可能會被銷毀重建，重建之後 IP 就變了。那你的前端要連後端，用哪個 IP？

為了解決這個問題，K8s 有一個叫 **Service** 的東西。Service 會給你一個穩定的入口，不管後面的 Pod 怎麼換，Service 的地址不會變，它會自動幫你把請求轉發到健康的 Pod 上。

Service 分內部服務和外部服務。內部服務叫 **ClusterIP**，只有叢集裡面的 Pod 能連。外部服務叫 **NodePort**，它會在每個 Node 上開一個 Port，外面的人就可以用 Node 的 IP 加上這個 Port 來連進來。

但在正式環境，我們不會用 IP 加 Port 來連，而是用域名。這個時候就需要 **Ingress**。Ingress 就像是 HTTP 層的路由器，你可以設定 `app.example.com` 連到 A 服務、`api.example.com` 連到 B 服務。就類似你在 Docker 裡面用 Nginx 反向代理做的事情。

---

## 第 5 頁 | 核心概念：設定與資料（10 分鐘）

### PPT 內容

**Step 4：設定檔不要寫死 → ConfigMap + Secret**

- ConfigMap = 把設定從 Image 裡抽出來（對照 Docker 的 `-e`）
- Secret = 跟 ConfigMap 一樣，但用來存敏感資料（密碼、金鑰）
- Secret 是 Base64 編碼，**不是加密**

**Step 5：資料不要跟容器一起消失 → Volume**

- Pod 砍了資料就沒了（跟 Docker 容器一樣）
- Volume = 把資料存在 Pod 外面（對照 Docker Volume）
- K8s 的 Volume 系統更複雜：PV / PVC / StorageClass

### 逐字稿

好，現在你的應用可以跑、可以連了。但還有兩個問題。

第一個問題是**設定檔**。你的應用要連資料庫，資料庫的地址、帳號密碼寫在哪裡？如果寫死在 Image 裡面，改一個設定就要重新 build Image、重新部署，太麻煩了。

K8s 提供了 **ConfigMap**，你可以把設定抽出來放在 ConfigMap 裡，然後讓 Pod 去讀。改設定的時候只要改 ConfigMap，不用重新 build Image。這就對應 Docker 裡面的 `-e` 環境變數。

但如果是密碼、金鑰這種敏感資料呢？ConfigMap 是明文儲存的，不安全。K8s 提供了 **Secret**，跟 ConfigMap 用法一樣，但會做 Base64 編碼。注意，Base64 只是編碼，不是加密，所以 Secret 也不是百分之百安全的，還需要搭配其他安全機制。

第二個問題是**資料**。Pod 被砍了，裡面的資料就沒了。跟 Docker 一樣的問題。K8s 提供了 **Volume** 來解決。不過 K8s 的 Volume 系統比 Docker 複雜很多，有 PV、PVC、StorageClass 這些概念，我們第六堂課會詳細講。

---

## 第 6 頁 | 核心概念：副本與高可用（10 分鐘）

### PPT 內容

**Step 6：一個 Pod 不夠 → Deployment + StatefulSet**

**Deployment（無狀態應用）：**
- Pod 死了不會自動重建 → 需要 Deployment 來管
- Deployment → ReplicaSet → Pod（三層關係）
- 能力：副本控制、滾動更新、自動擴縮容
- 對照：`docker compose --scale`

**StatefulSet（有狀態應用）：**
- 資料庫不能用 Deployment，因為每個副本有自己的資料
- StatefulSet：穩定的網路標識（mysql-0, mysql-1）、有序部署
- 或者：資料庫不放 K8s 裡面，在外面單獨跑

### 逐字稿

到這裡，你的應用可以跑、可以連、設定可以改、資料可以存了。但還有一個最重要的問題——**高可用性**。

如果你只跑一個 Pod，這個 Pod 掛了，或者它所在的機器掛了，你的服務就停了。怎麼辦？多跑幾個。

但你不會想手動管理這些副本。K8s 提供了 **Deployment** 來幫你管。你只要告訴 Deployment「我要 3 個副本」，它就會幫你維持 3 個 Pod。掛了一個？自動補一個新的。要更新版本？它會一個一個慢慢替換，不會全停。

Deployment 底下其實還有一層叫 **ReplicaSet**，負責管理 Pod 的副本數量。但 ReplicaSet 是 K8s 自動建立的，你不需要手動管它。你只要管 Deployment 就好。

那資料庫呢？資料庫比較特別，每個副本有自己的資料，不能隨便替換。所以 K8s 另外提供了 **StatefulSet**。它跟 Deployment 類似，但多了幾個特性：每個 Pod 有固定的名字（像 mysql-0、mysql-1），啟動順序是固定的，每個 Pod 有自己獨立的儲存空間。

不過老實說，很多團隊選擇不把資料庫放在 K8s 裡面，而是在叢集外面單獨跑。這樣比較簡單，也比較穩。

---

## 第 7 頁 | 核心概念小結（5 分鐘）

### PPT 內容

| 概念 | 一句話 | Docker 對照 |
|------|------|-----------|
| **Pod** | 容器的包裝，最小調度單位 | `docker run` |
| **Service** | 穩定的存取入口 | `-p` + `--network` DNS |
| **Ingress** | HTTP 路由器，設域名 | Nginx 反向代理 |
| **ConfigMap** | 設定檔管理 | `-e ENV_VAR` |
| **Secret** | 敏感資料管理 | `.env` 檔案 |
| **Volume** | 資料持久化 | `docker volume` |
| **Deployment** | 管理無狀態應用的副本 | `docker compose --scale` |
| **StatefulSet** | 管理有狀態應用（資料庫） | 手動管理 |

**記住這張表，後面四堂課就是一個一個展開來教。**

### 逐字稿

好，我們來總結一下剛才講的核心概念。

Pod 是容器的包裝，是 K8s 最小的調度單位。Service 給你一個穩定的存取入口。Ingress 讓你用域名來連。ConfigMap 管設定、Secret 管密碼。Volume 讓資料不會跟著容器消失。Deployment 幫你管副本、做滾動更新。StatefulSet 給資料庫這種有狀態的應用用。

右邊這一欄是 Docker 的對照。你可以看到，K8s 裡面的每一個概念，幾乎都有 Docker 裡面對應的東西，只是更自動化、更強大。

記住這張表，接下來四堂課就是把這些概念一個一個展開來教，讓你動手操作。

---

## 休息 10 分鐘（10:00 - 10:10）

---

## 第 8 頁 | K8s 架構：Master + Worker（15 分鐘）

### PPT 內容

**K8s 是 Master-Worker 架構**

| | Master Node（管理層） | Worker Node（幹活的） |
|--|---------------------|---------------------|
| 角色 | 管理整個叢集 | 運行應用程式 |
| 比喻 | 公司總部 | 工廠工人 |

**Worker Node 三個元件：**

| 元件 | 功能 | 比喻 |
|------|------|------|
| **kubelet** | 管理 Node 上的 Pod，回報狀態給 API Server | 工頭：盯著工人做事，回報給總部 |
| **kube-proxy** | 負責網路轉發和負載均衡 | 交通指揮：決定請求送到哪個 Pod |
| **Container Runtime** | 實際跑容器的軟體（containerd） | 工具箱：Docker Engine 的替代品 |

### 逐字稿

剛才講的是 K8s 裡面有哪些**資源物件**。現在我們來看 K8s 本身的**架構**——它是怎麼運作的。

K8s 是一個典型的 Master-Worker 架構。Master Node 負責管理整個叢集，就像公司總部。Worker Node 負責跑你的應用程式，就像工廠工人。

我們先來看 Worker Node。每個 Worker Node 上面有三個元件。

第一個是 **kubelet**。它就像是工頭，負責管理這個 Node 上面所有的 Pod，確保它們按照預期在運行。它也會定期跟 Master 回報狀態：「我這台機器上跑了哪些 Pod、CPU 用了多少、記憶體用了多少。」

第二個是 **kube-proxy**。它負責網路轉發和負載均衡。當有請求要連到某個 Service 的時候，kube-proxy 會決定把這個請求送到哪個 Pod 上。而且它會優先選擇同一個 Node 上的 Pod，減少跨 Node 的網路開銷。

第三個是 **Container Runtime**，容器執行時期。它就是實際跑容器的軟體。我們之前學 Docker 的時候用的是 Docker Engine，但 K8s 現在主流用的是 containerd。你不需要單獨裝 Docker，containerd 就夠了。

---

## 第 9 頁 | K8s 架構：Master Node 四元件（15 分鐘）

### PPT 內容

**Master Node 四個元件：**

| 元件 | 功能 | 比喻 |
|------|------|------|
| **API Server** | 叢集的大門，所有請求都要經過它 | 接待處：所有人進公司都要先到接待處 |
| **etcd** | 儲存叢集所有狀態資料 | 檔案室：記錄公司所有重要資訊 |
| **Scheduler** | 決定 Pod 跑在哪個 Node | 人事部：新人來了安排到哪個部門 |
| **Controller Manager** | 監控狀態，發現異常就修復 | 品管部：檢查產品，壞了就重做 |

**完整流程舉例：**

```
你下指令：kubectl create deployment nginx --replicas=3

1. kubectl → API Server（接待處收到請求）
2. API Server → etcd（記錄：要 3 個 nginx Pod）
3. Scheduler 發現有 3 個 Pod 還沒分配 → 看哪個 Node 有空 → 分配
4. kubelet 收到通知 → 在自己的 Node 上啟動 Pod
5. Controller Manager 持續監控 → Pod 掛了就重建
```

### 逐字稿

好，Worker Node 搞清楚了，現在來看 Master Node。Master Node 上有四個核心元件。

第一個是 **API Server**，它是整個叢集的大門。你用 kubectl 下的每一條指令，都是先送到 API Server。API Server 會驗證你有沒有權限，然後才把請求轉發給其他元件處理。它就像公司的接待處，所有人進來都要先過這一關。

第二個是 **etcd**。它是一個鍵值儲存系統，用來儲存叢集中所有資源的狀態。比如目前有幾個 Pod、跑在哪個 Node 上、用了多少資源，這些資訊全部存在 etcd 裡面。它就像公司的檔案室，記錄了公司所有的重要資訊。注意，etcd 只存叢集狀態，不存你的應用資料。你資料庫裡面的資料不會存在 etcd 裡。

第三個是 **Scheduler**（調度器）。當你建立一個新的 Pod 的時候，Scheduler 會看哪個 Node 的資源最充足，然後把 Pod 分配到那個 Node 上。它就像人事部，新人來了決定派到哪個部門。

第四個是 **Controller Manager**（控制器管理器）。它會持續監控叢集中所有資源的狀態。比如你說要跑 3 個 Pod，結果有一個掛了只剩 2 個，Controller Manager 就會偵測到，然後自動建立一個新的 Pod 補上。它就像品管部，一直在檢查，有問題就立刻處理。

我用一個完整的流程來讓你理解這四個元件怎麼合作。假設你下了一個指令：`kubectl create deployment nginx --replicas=3`。

1. 你的指令先送到 API Server
2. API Server 把「要 3 個 nginx Pod」這件事記到 etcd
3. Scheduler 發現有 3 個 Pod 還沒被分配，就看哪些 Node 有空位，然後決定分配到哪裡
4. 對應 Node 上的 kubelet 收到通知，在自己的機器上啟動 Pod
5. Controller Manager 持續監控，如果有 Pod 掛了，就重新走一次這個流程

這就是 K8s 的核心運作方式。

---

## 第 10 頁 | K8s 架構圖（5 分鐘）

### PPT 內容

```
┌─────────────────── Master Node ───────────────────┐
│                                                     │
│   ┌─────────┐  ┌──────┐  ┌───────────┐  ┌───────┐ │
│   │   API    │  │ etcd │  │ Scheduler │  │ Ctrl  │ │
│   │  Server  │  │      │  │           │  │  Mgr  │ │
│   └────┬─────┘  └──────┘  └───────────┘  └───────┘ │
│        │                                            │
└────────┼────────────────────────────────────────────┘
         │
    ┌────┴────────────────────────────────────────┐
    │                                              │
┌───▼──── Worker Node 1 ────┐  ┌──── Worker Node 2 ────┐
│                            │  │                        │
│  ┌─────────┐ ┌──────────┐ │  │ ┌─────────┐ ┌────────┐│
│  │ kubelet │ │kube-proxy│ │  │ │ kubelet │ │kube-   ││
│  └─────────┘ └──────────┘ │  │ └─────────┘ │proxy   ││
│  ┌──────────────────────┐ │  │ └────────┘            │
│  │   containerd         │ │  │ ┌──────────────────┐  │
│  │  ┌─────┐  ┌─────┐   │ │  │ │  containerd      │  │
│  │  │Pod 1│  │Pod 2│   │ │  │ │ ┌─────┐ ┌─────┐  │  │
│  │  └─────┘  └─────┘   │ │  │ │ │Pod 3│ │Pod 4│  │  │
│  └──────────────────────┘ │  │ │ └─────┘ └─────┘  │  │
└───────────────────────────┘  │ └──────────────────┘  │
                               └────────────────────────┘
```

**你用 kubectl → API Server → 指揮整個叢集**

### 逐字稿

這張圖就是 K8s 的完整架構。上面是 Master Node，裡面有 API Server、etcd、Scheduler、Controller Manager。

下面是 Worker Node，每個 Node 上面有 kubelet、kube-proxy、containerd，然後裡面跑著你的 Pod。

你用 kubectl 下指令，指令送到 API Server，API Server 是唯一的入口。然後 API Server 去跟 etcd、Scheduler、Controller Manager 協調，最終讓 kubelet 在 Worker Node 上把 Pod 跑起來。

這張圖很重要，建議你拍下來。後面我們實際操作的時候，你會在 `kubectl get pods -n kube-system` 裡面親眼看到這些元件。

---

## 第 11 頁 | 環境搭建方案（10 分鐘）

### PPT 內容

**三種方案：**

| 方案 | 適合場景 | 節點數 | 安裝難度 | 我們什麼時候教 |
|------|---------|:---:|:---:|:---:|
| **minikube** | 個人學習 | 1（單節點） | 最簡單 | 今天（第四堂） |
| **k3s** | 輕量生產 / 多節點練習 | 多節點 | 中等 | 第五堂 |
| **RKE** | 企業生產叢集 | 多節點 | 較複雜 | 待定 |

**minikube：**
- 一台電腦上模擬一個 K8s 叢集
- Master + Worker 合在一台
- 適合學習，不適合生產

**k3s：**
- Rancher 公司出的輕量版 K8s
- 一行指令安裝
- 可以多節點，適合邊緣運算、IoT、小團隊

**kubectl：**
- K8s 的 CLI 工具
- 不管用 minikube、k3s 還是 RKE，kubectl 指令都一樣

### 逐字稿

講完了 K8s 的架構，現在來看怎麼搭建環境。

正式的 K8s 叢集需要好幾台機器——兩台 Master、三台 Worker，至少五台伺服器。這在學習階段太麻煩了。

所以我們有三種方案。

第一種是 **minikube**。它可以在你的電腦上模擬一個 K8s 叢集。Master 和 Worker 合在同一台，一個指令就能啟動。今天我們就用 minikube。

第二種是 **k3s**。它是 Rancher 公司出的輕量版 K8s，精簡了很多元件，用 SQLite 取代 etcd，一行 curl 指令就能裝好。重點是它可以多節點，你可以開兩台虛擬機，一台當 Master、一台當 Worker，體驗真正的多節點環境。我們第五堂教 Deployment 的時候會裝 k3s，因為那個時候你需要看到 Pod 分散在不同的 Node 上。

第三種是 **RKE**，也是 Rancher 出的，但是完整版的 K8s，適合企業正式環境。這個我們之後再討論。

不管你用哪種方案，**kubectl 指令都是一模一樣的**。kubectl 就是 K8s 的 CLI 工具，就像 Docker 有 `docker` 指令一樣。你學會 kubectl，不管連到哪個叢集都能用。

---

## 第 12 頁 | kubectl 指令速查（5 分鐘）

### PPT 內容

**kubectl 對照 docker：**

| 功能 | Docker | kubectl |
|------|--------|---------|
| 查看運行中的 | `docker ps` | `kubectl get pods` |
| 看日誌 | `docker logs` | `kubectl logs` |
| 進容器 | `docker exec -it` | `kubectl exec -it` |
| 停止/刪除 | `docker stop/rm` | `kubectl delete` |
| 用檔案部署 | `docker compose up` | `kubectl apply -f` |

**kubectl 基本動詞：**

| 動詞 | 功能 |
|------|------|
| `get` | 查詢（pods / nodes / services / deployments） |
| `describe` | 看詳細資訊 |
| `apply -f` | 用 YAML 部署 |
| `delete` | 刪除 |
| `logs` | 看日誌 |
| `exec` | 進容器 |
| `scale` | 擴縮容 |

**等等實作的時候會一個一個練。**

### 逐字稿

最後快速帶一下 kubectl 的指令。你可以把它跟 Docker 指令對照著看。

`docker ps` 看運行中的容器，對應 `kubectl get pods` 看 Pod。`docker logs` 看日誌，對應 `kubectl logs`。`docker exec -it` 進容器，對應 `kubectl exec -it`。幾乎是一對一的對應。

kubectl 有幾個常用的動詞：`get` 查詢、`describe` 看詳細資訊、`apply` 用 YAML 部署、`delete` 刪除、`logs` 看日誌、`exec` 進容器、`scale` 擴縮容。

不用現在記住，等一下實作的時候一個一個練，你就會了。

---

## 第 13 頁 | 今天的計畫 + Q&A（5 分鐘）

### PPT 內容

**剛才講了（全貌）：**
- 為什麼需要 K8s
- 8 個核心概念（Pod / Service / Ingress / ConfigMap / Secret / Volume / Deployment / StatefulSet）
- K8s 架構（Master 4 元件 + Worker 3 元件）
- 環境方案（minikube / k3s / RKE）
- kubectl 指令速查

**接下來要做（動手）：**
1. 安裝 minikube → 啟動叢集
2. 用 kubectl 探索叢集 → 親眼看到架構元件
3. 寫第一個 Pod YAML → 完整 CRUD
4. 故意搞壞 Pod → 學會排錯
5. 多容器 Pod（Sidecar）

**有問題嗎？**

### 逐字稿

好，兩個小時的概念講完了。我們來回顧一下。

剛才講了為什麼需要 K8s、8 個核心概念、K8s 的架構有哪些元件、三種環境搭建方案、還有 kubectl 指令速查。

接下來我們要動手了。先裝 minikube，啟動你的第一個 K8s 叢集。然後用 kubectl 去探索叢集，親眼看到剛才架構圖裡面的 API Server、etcd 那些元件真的在跑。然後寫你的第一個 Pod YAML，把 nginx 跑起來。還會故意搞壞一個 Pod，讓你學會怎麼用 `describe` 和 `logs` 排錯。

有問題的話現在可以問。沒問題的話，我們休息一下就開始動手。
