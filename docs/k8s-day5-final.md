# 第五堂 — 從單機到叢集：Deployment 與 Service（完整投影片 + 逐字稿）

> 25 頁投影片，含 PPT 提詞內容 + 可直接念的逐字稿
> 對象：已完成第四堂（Pod + kubectl）的容器初學者
> 故事線：一個 Pod 不夠 → Deployment 管副本 → 別人連不到 → Service 暴露 → 用 DNS 名稱連

---

## 第 1 頁 | 開場 + 回顧（5min）

### PPT 上的內容

**第四堂我們學了什麼**

| 主題 | 一句話 |
|:---:|---------|
| K8s 架構 | Master（4 元件）+ Worker（3 元件），kubectl 跟 API Server 說話 |
| YAML 四欄位 | apiVersion、kind、metadata、spec |
| Pod | K8s 最小部署單位，一個 Pod 包一個容器 |
| kubectl 五指令 | get / describe / logs / exec / delete |
| 排錯流程 | get 看狀態 → describe 看 Events → logs 看日誌 |

**第四堂的反思問題：**
> 「怎麼讓 K8s 自動維持 3 個 nginx 在跑？Pod 掛了一個，自動補一個新的？」

**→ 答案就是今天要學的：Deployment**

**今天的旅程：**

```
Deployment（管副本）→ Service（讓別人連得到）→ DNS（用名字連）→ Namespace（隔離環境）
```

### 逐字稿

歡迎回來！上一堂課我們正式進入了 Kubernetes 的世界。我們搞懂了 K8s 的架構，Master Node 有 API Server、etcd、Scheduler、Controller Manager 四個元件，Worker Node 有 kubelet、kube-proxy、Container Runtime 三個元件。然後我們動手寫了 Pod 的 YAML，學會了 kubectl 的五個核心指令：get 查看、describe 看細節、logs 看日誌、exec 進容器、delete 刪除。最後我們還練習了排錯：先 get 看狀態，再 describe 看 Events，最後 logs 看日誌。

上一堂課結束的時候，我留了一個反思問題：「怎麼讓 K8s 自動維持 3 個 nginx 在跑？Pod 掛了一個，自動補一個新的？」大家有想到答案嗎？

答案就是今天要學的主角 — Deployment。但光有 Deployment 還不夠，Pod 跑起來了，別人要怎麼連到你的服務？所以我們還要學 Service。用了 Service 之後，你會發現用 IP 連太麻煩了，所以我們還要學 DNS 和服務發現。最後我們會學 Namespace，讓你的 dev 環境和 staging 環境可以隔離開來。

今天的旅程就是：Deployment → Service → DNS → Namespace。

不過在開始之前，我們要先做一件很重要的事 — 把環境從 minikube 單節點升級成 k3s 多節點叢集。為什麼？因為 Deployment 的擴容、Pod 分散到不同 Node、NodePort 從任何機器都能連，這些你用 minikube 單節點是完全看不到效果的。所以 k3s 不是可選的，是必修的。

---

## 第 2 頁 | 多節點環境搭建：Multipass + k3s（20min）

### PPT 上的內容

**痛點：minikube 只有一個 Node**

```
minikube（單節點）：
┌──────────────┐
│   Node 1     │
│ Pod Pod Pod  │  ← 全部擠在同一台，看不出「分散部署」的效果
└──────────────┘

k3s 多節點：
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Master  │  │ Worker 1 │  │ Worker 2 │
│   Pod    │  │   Pod    │  │   Pod    │  ← Pod 分散在不同 Node！
└──────────┘  └──────────┘  └──────────┘
```

**工具介紹**

| 工具 | 一句話說明 |
|------|-----------|
| k3s | Rancher 開源的輕量版 K8s，安裝只要 30 秒 |
| Multipass | Canonical 出品，一行指令開 Ubuntu VM |

**Docker 對照：**

| 動作 | Docker Swarm | K3s |
|------|-------------|-----|
| 初始化叢集 | `docker swarm init` | `curl -sfL https://get.k3s.io \| sh -` |
| 加入節點 | `docker swarm join --token ...` | `curl -sfL https://get.k3s.io \| K3S_URL=... K3S_TOKEN=... sh -` |
| 查看節點 | `docker node ls` | `kubectl get nodes` |

**實作步驟（跟著做）：**

```bash
# 1. 安裝 Multipass
# macOS
brew install multipass
# Windows
choco install multipass
# Linux
sudo snap install multipass

# 2. 建立 3 台 VM（master + 2 worker）
multipass launch --name k3s-master --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker1 --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker2 --cpus 2 --memory 2G --disk 10G

# 3. 在 master 安裝 k3s
multipass exec k3s-master -- bash -c "curl -sfL https://get.k3s.io | sh -"

# 4. 取得 join token 和 master IP
TOKEN=$(multipass exec k3s-master sudo cat /var/lib/rancher/k3s/server/node-token)
MASTER_IP=$(multipass info k3s-master | grep IPv4 | awk '{print $2}')

# 5. worker 加入叢集
for i in 1 2; do
  multipass exec k3s-worker$i -- bash -c \
    "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$TOKEN sh -"
done

# 6. 驗證 — 應該看到 3 個 Ready
multipass exec k3s-master -- sudo kubectl get nodes

# 7. 把 kubeconfig 複製到本機
multipass exec k3s-master -- sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/k3s-config
sed -i "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config
export KUBECONFIG=~/.kube/k3s-config
kubectl get nodes
```

### 逐字稿

好，在進入 Deployment 之前，我們必須先升級環境。

上一堂課我們用的是 minikube，它很方便、一行指令就能啟動，但有一個致命的限制 — 它只有一個 Node。所有的 Pod 都跑在同一台機器上。等一下我們教 Deployment 擴容到 5 個副本，你用 `kubectl get pods -o wide` 看，5 個 Pod 全部擠在同一個 Node 上，完全感受不到「分散部署」的意義。後面教 NodePort，你只有一個 Node IP 能連，體會不到「任何 Node 都能進」的效果。再後面教 DaemonSet，每個 Node 跑一份，但你只有一個 Node，那跟普通 Pod 有什麼差別？

所以我們現在要升級到 k3s。k3s 是 Rancher Labs 開源的一個輕量版 Kubernetes，功能跟 K8s 一樣但安裝超級快、資源佔用少很多。名字為什麼叫 k3s？因為 K8s 有 8 個字母（K-u-b-e-r-n-e-t-e-s），k3s 只有 3 個字母，代表它砍掉了很多肥肉，但核心功能全部保留。

那我們要怎麼在你的電腦上跑出 3 台 Node 呢？用 Multipass。Multipass 是 Canonical 出品的工具，Canonical 就是做 Ubuntu 那家公司。它讓你一行指令就能建一台 Ubuntu 虛擬機，比手動裝 VM 快多了。

好，來動手。我已經幫大家準備了一個一鍵腳本 `setup-k3s.sh`，但我們先一步一步走過去，理解每一步在幹嘛。

首先安裝 Multipass。macOS 用 `brew install multipass`，Windows 用 `choco install multipass`，Linux 用 `snap install multipass`。大家根據自己的系統來。

裝好之後，我們建 3 台 VM。用 `multipass launch` 指令，`--name` 給它命名，`--cpus 2` 分配 2 顆 CPU，`--memory 2G` 分配 2GB 記憶體，`--disk 10G` 分配 10GB 硬碟。我們建一台 master 和兩台 worker。

[停頓 5 秒等學員跑指令]

VM 建好之後，我們在 master 上安裝 k3s。就一行指令：`curl -sfL https://get.k3s.io | sh -`。沒了，就這麼簡單。如果你用過 kubeadm 裝過 K8s，你會感動到想哭，因為 kubeadm 要裝一堆前置套件、設定 cgroup driver、處理各種相容性問題。k3s 就一行，30 秒搞定。

裝好 master 之後，我們需要取得兩個東西：join token 和 master 的 IP。Token 是讓 worker 證明「我有權加入這個叢集」的憑證，IP 是讓 worker 知道 master 在哪裡。

用 Docker 的經驗來對照，這就像 Docker Swarm。`docker swarm init` 初始化叢集，然後它會給你一個 `docker swarm join --token xxx` 的指令，你在其他機器上跑那行指令就能加入。k3s 的邏輯一模一樣，只是指令不同。

拿到 token 和 IP 之後，我們用一個 for 迴圈讓兩台 worker 加入叢集。加入的指令也是 `curl -sfL https://get.k3s.io | sh -`，只是多了兩個環境變數：`K3S_URL` 告訴它 master 在哪，`K3S_TOKEN` 證明你有權限加入。

[停頓 10 秒等學員跑指令]

好，現在來驗證。跑 `multipass exec k3s-master -- sudo kubectl get nodes`。大家猜猜看，應該會看到幾個 Node？

[停頓 3 秒讓學員思考]

沒錯，3 個。一個 master，兩個 worker，狀態都是 Ready。恭喜你，你現在有一個真正的多節點 K8s 叢集了！

最後一步，我們把 kubeconfig 複製到本機，這樣你就不用每次都 `multipass exec` 進去 master 跑 kubectl，直接在本機就能操作。複製出來之後記得把 IP 從 127.0.0.1 改成 master 的實際 IP，然後設定 `KUBECONFIG` 環境變數指向這個檔案。

跑一下 `kubectl get nodes`，如果看到 3 個 Ready 的 Node，就代表你的環境完全搞定了。

如果你懶得一步一步打，課程資料夾裡有一個 `setup-k3s.sh`，一鍵幫你搞定整個流程。但我建議你至少手動跑過一次，理解每一步在幹嘛。

好，不管你用 minikube 還是 k3s，接下來的操作都一樣。正式進入今天的主題 — Deployment。

---

## 第 2 頁 | 痛點：Pod 的脆弱（5min）

### PPT 上的內容

**回顧：Pod 被刪了就沒了**

```bash
kubectl delete pod my-nginx    # 刪掉
kubectl get pods               # 空的，沒人幫你重建
```

**如果這是生產環境的 API...**

```
使用者 → 你的 API Pod → 💥 Pod 掛了
使用者 → ❌ 503 Service Unavailable
```

**我們需要什麼？**

1. **自動重建** — Pod 掛了，自動再補一個
2. **多副本** — 不要只跑一個，跑 3 個分散風險
3. **版本更新** — 換新版本不能停機

**Docker 的做法 vs K8s 的做法：**

| 需求 | Docker | K8s |
|------|--------|-----|
| 多副本 | `docker compose up --scale web=3` | Deployment `replicas: 3` |
| 自動重啟 | `--restart always`（只管同一台） | Controller Manager 跨 Node 重建 |
| 滾動更新 | 自己寫腳本 | `kubectl set image` 一行搞定 |

### 逐字稿

好，我們先來回顧一個第四堂課的場景。上次我們建了一個 nginx Pod，然後用 `kubectl delete pod` 把它刪掉了。刪掉之後呢？就真的沒了。`kubectl get pods` 一看，空空如也，沒有任何人幫你重新建一個。

如果這是你公司的生產環境，跑的是使用者在用的 API 服務，Pod 一掛、使用者就看到 503 Service Unavailable。這顯然不行。

所以我們需要三個東西。第一，自動重建：Pod 掛了，有人自動幫你再補一個新的。第二，多副本：不要只跑一個 Pod，跑 3 個，就算掛了一個，還有 2 個在服務。第三，版本更新：要換新版本的時候，不能整個停掉再換，使用者會斷線。

用 Docker 的經驗來想，多副本你可能會用 `docker compose up --scale web=3`，但它只能在一台機器上。自動重啟你可能用 `--restart always`，但如果那台機器整個掛了呢？Docker 幫不了你。滾動更新？Docker Compose 基本做不到，你得自己寫腳本。

在 K8s 裡面，這三個需求全部靠一個東西就搞定了 — Deployment。

---

## 第 3 頁 | Deployment 三層關係（10min）

### PPT 上的內容

**Deployment → ReplicaSet → Pod**

```
┌─────────────────────────────────────┐
│           Deployment                │  ← 你管這個
│  ┌───────────────────────────────┐  │
│  │         ReplicaSet            │  │  ← 自動建立，你不用管
│  │  ┌───────┐ ┌───────┐ ┌─────┐ │  │
│  │  │ Pod 1 │ │ Pod 2 │ │Pod 3│ │  │  ← 自動維持數量
│  │  └───────┘ └───────┘ └─────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**每一層的職責：**

| 層級 | 職責 | 你需要操作嗎？ |
|------|------|:---:|
| Deployment | 定義「期望狀態」+ 管滾動更新 | 需要 |
| ReplicaSet | 維持 Pod 數量 = 期望數量 | 不需要（自動） |
| Pod | 實際跑容器 | 不需要（自動） |

**對照 Docker Compose：**

```yaml
# Docker Compose — 你只能 scale，沒有自動修復
services:
  web:
    image: nginx:1.27
    deploy:
      replicas: 3        # 只在 Swarm 模式有效

# K8s Deployment — 自動維持副本數 + 自動修復
spec:
  replicas: 3
```

### 逐字稿

來認識 Deployment 的結構。Deployment 有一個三層關係：Deployment 管 ReplicaSet，ReplicaSet 管 Pod。

你作為使用者，只需要管 Deployment 這一層。你告訴 Deployment：「我要 3 個 nginx Pod」，Deployment 就會自動建立一個 ReplicaSet，ReplicaSet 再去建立 3 個 Pod。

那 ReplicaSet 是幹嘛的？它的唯一職責就是：維持 Pod 的數量等於你期望的數量。你說要 3 個，它就確保隨時有 3 個在跑。如果掛了一個只剩 2 個，它就補一個。如果多了一個變成 4 個（不太可能但理論上），它就刪一個。

那為什麼不讓 Deployment 直接管 Pod，中間為什麼要多一個 ReplicaSet？原因是滾動更新。當你更新 image 版本的時候，Deployment 會建立一個新的 ReplicaSet（跑新版本），然後逐步把舊 ReplicaSet 裡的 Pod 縮減、新 ReplicaSet 裡的 Pod 增加，直到全部換完。舊的 ReplicaSet 會保留下來（但 Pod 數量是 0），這樣如果你要回滾，它可以直接把舊的 ReplicaSet 重新擴容。

用 Docker Compose 對照的話，Compose 裡面也有 `replicas`，但那個只在 Docker Swarm 模式下有效，而且沒有自動修復的能力。K8s 的 Deployment 不只能設定副本數，還能在 Pod 掛掉的時候自動重建，這就是 Controller Manager 在背後幫你做的事。

---

## 第 4 頁 | Deployment YAML 拆解（10min）

### PPT 上的內容

**完整的 Deployment YAML：**

```yaml
apiVersion: apps/v1              # 注意：不是 v1，是 apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  labels:
    app: nginx
spec:
  replicas: 3                    # 要幾個副本
  selector:                      # 用什麼標籤找 Pod
    matchLabels:
      app: nginx
  template:                      # Pod 的範本（長得像 Pod YAML）
    metadata:
      labels:
        app: nginx               # ⚠️ 要跟 selector 一致！
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
```

**對照 Pod YAML：**

| 欄位 | Pod YAML | Deployment YAML |
|------|----------|----------------|
| apiVersion | `v1` | `apps/v1` |
| kind | `Pod` | `Deployment` |
| 容器定義 | 直接寫在 `spec.containers` | 包在 `spec.template.spec.containers` |
| 多了什麼 | 沒有 | `replicas` + `selector` + `template` |

**三個容易搞混的 labels：**
1. `metadata.labels` — Deployment 自己的標籤
2. `spec.selector.matchLabels` — 用來找 Pod 的選擇器
3. `spec.template.metadata.labels` — Pod 的標籤

**→ 第 2 和第 3 的值必須一致，否則 Deployment 找不到自己的 Pod！**

### 逐字稿

好，我們來看 Deployment 的 YAML 怎麼寫。大家打開 `deployment.yaml` 這個檔案。

首先注意 `apiVersion` 不是 `v1` 了，而是 `apps/v1`。記得上一堂課講過，不同的資源類型用不同的 apiVersion。Pod 和 Service 用 `v1`，但 Deployment、ReplicaSet 用 `apps/v1`。

`kind: Deployment`，我們要建的是 Deployment。

`spec` 裡面有三個新東西。第一個是 `replicas: 3`，告訴 K8s 我要維持 3 個 Pod。

第二個是 `selector`，它定義了 Deployment 用什麼條件來找到屬於自己的 Pod。這裡我們用 `matchLabels: app: nginx`，意思是「找所有 label 有 app=nginx 的 Pod」。

第三個是 `template`，這是 Pod 的範本。你仔細看 template 裡面的內容，是不是跟上一堂課寫的 Pod YAML 幾乎一模一樣？有 metadata、有 labels、有 spec、有 containers。差別在於不需要 apiVersion 和 kind，因為 Deployment 已經知道 template 就是用來建 Pod 的。

這裡有一個非常重要的細節：`spec.selector.matchLabels` 和 `spec.template.metadata.labels` 的值必須一致。為什麼？因為 Deployment 是靠 selector 來「認領」Pod 的。如果 selector 說找 `app: nginx`，但 Pod 的 label 是 `app: web`，Deployment 就找不到自己的 Pod，會一直以為 Pod 不夠然後拼命建新的。

大家可能會覺得這個設計有點囉唆 — 為什麼不自動幫我對齊？這是因為 K8s 的設計哲學是「明確勝於隱式」，所有東西都要你明確寫出來，減少意外。雖然囉唆但出錯的機率比較低。

---

## 第 5 頁 | 實作：建立 Deployment（15min）

### PPT 上的內容

**Lab 1：第一個 Deployment**

**Step 1：部署**
```bash
kubectl apply -f deployment.yaml
```

**Step 2：查看三層結構**
```bash
kubectl get deployments              # Deployment
kubectl get replicasets              # ReplicaSet（自動建立的）
kubectl get pods                     # 3 個 Pod
kubectl get pods -o wide             # 看 Pod 的 IP 和 Node
```

**Step 3：重點實驗 — 刪掉一個 Pod**
```bash
kubectl delete pod <任意一個 pod 名字>
kubectl get pods                     # 馬上會看到新的 Pod！
```

**Step 4：擴縮容**
```bash
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods                     # 5 個
kubectl scale deployment nginx-deploy --replicas=3
kubectl get pods                     # 回到 3 個
```

**對照 Docker：**
```bash
# Docker Compose
docker compose up --scale web=5      # 擴到 5 個（僅限單機）

# K8s
kubectl scale deployment nginx-deploy --replicas=5   # 跨 Node 擴容
```

### 逐字稿

好，概念講完了，我們馬上來動手。請大家打開終端機，確認叢集還在跑（minikube 用 `minikube status`，k3s 用 `kubectl get nodes`）。

先部署我們的 Deployment：

```
kubectl apply -f deployment.yaml
```

看到 `deployment.apps/nginx-deploy created`，成功了。

現在我們來驗證三層結構。先看 Deployment：

```
kubectl get deployments
```

你會看到 `nginx-deploy`，READY 欄位顯示 `3/3`，表示 3 個副本都準備好了。如果你看到 `0/3` 或 `1/3`，表示 Pod 還在建立中，等一下就好了。

再看 ReplicaSet：

```
kubectl get replicasets
```

你會看到一個名字像 `nginx-deploy-xxxxxxx` 的 ReplicaSet，它是 Deployment 自動建立的，你完全不需要手動建。DESIRED 和 CURRENT 都是 3。

最後看 Pod：

```
kubectl get pods
```

你會看到 3 個 Pod，名字的格式是 `nginx-deploy-xxxxxxx-xxxxx`。前面是 Deployment 的名字，中間是 ReplicaSet 的 hash，最後是 Pod 自己的 random 字串。

好，現在來做最精彩的實驗。隨便挑一個 Pod，把它刪掉：

```
kubectl delete pod nginx-deploy-xxxxxxx-xxxxx
```

然後馬上 `kubectl get pods`。大家猜猜看，會看到什麼？

[停頓 3 秒讓學員思考]

答案是：你還是會看到 3 個 Pod！但仔細看名字，有一個 Pod 的名字跟剛才不一樣，而且 AGE 顯示幾秒鐘。這就是 ReplicaSet 在做的事 — 它偵測到 Pod 數量從 3 變成 2，不符合期望狀態，所以馬上補了一個新的。這就是「自我修復」。

記得上一堂課我們刪掉 Pod 之後，它就真的消失了。現在有了 Deployment，Pod 變成了「刪不掉」的 — 你刪一個，它就補一個。除非你刪的是 Deployment 本身。

接下來試試擴縮容。把副本數從 3 擴到 5：

```
kubectl scale deployment nginx-deploy --replicas=5
```

再 `kubectl get pods`，你會看到 5 個 Pod。多出來的 2 個正在建立中。然後縮回 3 個：

```
kubectl scale deployment nginx-deploy --replicas=3
```

再看一下，多的 Pod 會被刪掉，回到 3 個。

對照一下 Docker Compose，Compose 也可以用 `docker compose up --scale web=5` 來擴容，但它只能在一台機器上。K8s 的 scale 可以讓 Pod 分散到不同的 Node 上，這在多節點叢集裡是非常大的優勢。

---

## 第 6 頁 | 滾動更新概念（10min）

### PPT 上的內容

**場景：nginx 1.27 要更新到 1.28**

**不用 K8s 的做法（停機更新）：**
```
1. 停掉所有舊版本 Pod
2. 部署新版本 Pod
3. 服務中斷！使用者看到 503！
```

**K8s 滾動更新（Rolling Update）：**
```
舊 Pod: [v1.27] [v1.27] [v1.27]
                                    ← 先建一個新的
步驟 1: [v1.27] [v1.27] [v1.27] [v1.28]
                                    ← 砍一個舊的
步驟 2: [v1.27] [v1.27]          [v1.28]
                                    ← 再建一個新的
步驟 3: [v1.27] [v1.27] [v1.28] [v1.28]
                                    ← 再砍一個舊的
步驟 4: [v1.27]          [v1.28] [v1.28]
...
最終:            [v1.28] [v1.28] [v1.28]
```

**→ 整個過程服務不中斷！**

**底層原理：**
```
Deployment
 ├── 舊 ReplicaSet（v1.27）: 3 → 2 → 1 → 0
 └── 新 ReplicaSet（v1.28）: 0 → 1 → 2 → 3
```

### 逐字稿

接下來我們要講一個 Deployment 最強大的功能 — 滾動更新。

想像一個場景：你的 nginx 現在跑的是 1.27 版，你想更新到 1.28 版。如果沒有 K8s，你怎麼做？最粗暴的方式就是：停掉所有舊版本的容器，然後部署新版本。但這中間有一段時間是沒有任何容器在跑的，使用者就會看到 503 錯誤。在開發環境也許還好，但在生產環境，這是絕對不能接受的。

K8s 的 Deployment 用的是「滾動更新」策略。它不會一次把所有舊 Pod 砍掉，而是一個一個來。先建一個新版本的 Pod，確認它跑起來了，然後砍掉一個舊版本的 Pod。再建一個新的，再砍一個舊的。就這樣逐步替換，直到全部都換成新版本。整個過程中，始終有 Pod 在服務，使用者完全感覺不到更新在進行。

底層的原理是什麼呢？還記得 ReplicaSet 嗎？Deployment 更新的時候，會建立一個新的 ReplicaSet，然後逐步把舊 ReplicaSet 的 Pod 數量從 3 降到 0，同時把新 ReplicaSet 的 Pod 數量從 0 升到 3。就像一個蹺蹺板，一邊下去、一邊上來。

而且舊的 ReplicaSet 不會被刪掉，它只是 Pod 數量變成 0 而已。這是為了回滾預留的 — 如果新版本有 bug，你可以一行指令回到舊版本，K8s 只要把舊 ReplicaSet 重新擴容、新 ReplicaSet 縮減就好了。

---

## 第 7 頁 | 實作：滾動更新與回滾（15min）

### PPT 上的內容

**Lab 2：滾動更新**

**Step 1：更新 image**
```bash
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
```

**Step 2：即時觀察**
```bash
kubectl rollout status deployment/nginx-deploy
# 會看到 Pod 逐步替換的過程
```

**Step 3：確認**
```bash
kubectl describe deployment nginx-deploy | grep Image
# 應該看到 nginx:1.28
```

**Step 4：故意搞壞 — 更新到不存在的 image**
```bash
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
kubectl get pods                      # 新 Pod 一直 ImagePullBackOff
```

**Step 5：回滾**
```bash
kubectl rollout undo deployment/nginx-deploy
kubectl get pods                      # 全部回到正常！
```

**常用 rollout 指令：**

| 指令 | 功能 |
|------|------|
| `kubectl rollout status` | 查看更新進度 |
| `kubectl rollout history` | 查看歷史版本 |
| `kubectl rollout undo` | 回滾到上一版 |
| `kubectl rollout undo --to-revision=1` | 回滾到指定版本 |

### 逐字稿

好，我們來實際操作滾動更新。

首先，確認一下目前的 image 版本：

```
kubectl describe deployment nginx-deploy | grep Image
```

應該看到 `nginx:1.27`。好，現在我們把它更新到 `nginx:1.28`：

```
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
```

這個指令的格式是 `kubectl set image deployment/<deployment名> <容器名>=<新image>`。這裡的 `nginx=nginx:1.28`，前面那個 `nginx` 是容器的名字（在 YAML 的 `containers.name` 定義的），後面是新的 image。

執行之後，馬上用 `rollout status` 來觀察更新進度：

```
kubectl rollout status deployment/nginx-deploy
```

你會看到類似這樣的輸出：

```
Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
deployment "nginx-deploy" successfully rolled out
```

看到 `successfully rolled out` 就表示更新完成了。

我們再驗證一下：

```
kubectl describe deployment nginx-deploy | grep Image
```

現在應該是 `nginx:1.28` 了。你也可以看一下 ReplicaSet：

```
kubectl get rs
```

你會看到兩個 ReplicaSet。一個的 DESIRED 是 3（新版本），另一個的 DESIRED 是 0（舊版本保留著）。

好，接下來做一個更有趣的實驗 — 故意搞壞它。我們更新到一個根本不存在的 image 版本：

```
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
```

然後看 Pod：

```
kubectl get pods
```

你會看到有幾個 Pod 的狀態是 `ImagePullBackOff` 或 `ErrImagePull`。跟第四堂課一樣的錯誤！K8s 拉不到 `nginx:9.9.9` 這個 image。

但是注意看，舊版本的 Pod 還活著！K8s 不會把所有舊 Pod 都砍掉才建新的，它是逐步替換的。所以即使新版本有問題，服務也不會完全中斷。

怎麼辦？回滾！一行指令：

```
kubectl rollout undo deployment/nginx-deploy
```

然後看 Pod：

```
kubectl get pods
```

太好了，全部都回到 Running 狀態了。K8s 把壞掉的新 Pod 砍掉，重新擴容了之前的 ReplicaSet。

你還可以用 `rollout history` 查看歷史版本，用 `--to-revision` 回滾到指定的版本號。

這個回滾機制在生產環境非常重要。半夜發布了一個有 bug 的版本，你可以在幾秒鐘內回到上一個穩定版本，不需要重新 build、重新部署。

---

## 第 8 頁 | 小結：Deployment（3min）

### PPT 上的內容

**Deployment 三件事：**

1. **維持副本數** — 你說 3 個，它就永遠保持 3 個
2. **滾動更新** — 不停機地換新版本
3. **一鍵回滾** — 新版本有 bug？秒回舊版本

**關鍵指令：**

```bash
kubectl apply -f deployment.yaml     # 建立 / 更新
kubectl get deploy                   # 查看
kubectl scale deploy <name> --replicas=N  # 擴縮容
kubectl set image deploy/<name> <container>=<image>  # 更新版本
kubectl rollout status deploy/<name> # 看更新進度
kubectl rollout undo deploy/<name>   # 回滾
```

**→ 生產環境幾乎不會直接用 Pod，都是用 Deployment**

### 逐字稿

好，我們來總結一下 Deployment 的三個核心功能。

第一，維持副本數。你告訴它要 3 個 Pod，它就永遠幫你保持 3 個。Pod 掛了自動重建，你想擴容一行 scale 指令。

第二，滾動更新。更新 image 版本的時候，K8s 會逐步替換，整個過程服務不中斷。

第三，一鍵回滾。新版本有問題？`rollout undo` 一行指令，秒回上一個穩定版本。

螢幕上列了常用的六個指令，大家記下來。

有一個重要的觀念要記住：在生產環境中，你幾乎不會直接建 Pod。所有的應用程式都是用 Deployment 來管理的。直接建 Pod 就像你用 Docker 的時候不寫 Compose 檔案、純用 `docker run` 一樣 — 不是不行，但很原始。

好，Deployment 搞定了。但現在有一個問題：3 個 Pod 跑起來了，它們各自有自己的 IP。但這些 IP 是叢集內部的，外面連不到。而且 Pod 隨時可能被砍掉重建，IP 就會變。那別人要怎麼穩定地連到你的服務？

這就是接下來要講的 Service。

---

## 第 9 頁 | 痛點：Pod IP 的問題（5min）

### PPT 上的內容

**Pod IP 的兩大問題：**

**問題 1：IP 會變**
```
kubectl get pods -o wide
# Pod 1: 10.244.0.5
# Pod 2: 10.244.0.6
# Pod 3: 10.244.0.7

# 刪掉 Pod 1，新 Pod 的 IP 變了
# Pod 4: 10.244.0.8  ← 不是 10.244.0.5 了！
```

**問題 2：有 3 個 Pod，該連哪一個？**
```
前端 → ???
       10.244.0.5（Pod 1）
       10.244.0.6（Pod 2）
       10.244.0.7（Pod 3）
```

**如果寫死 IP...**
```yaml
# 前端設定（寫死 IP 的後果）
API_HOST=10.244.0.5      # Pod 重建 → IP 變了 → 斷線！
```

**Docker 怎麼解決的？**
```bash
# Docker Compose 用容器名稱做 DNS
docker compose up
# 前端可以用 http://api:8080 連到 API
# Docker 自動做了 DNS 解析
```

**→ K8s 的解決方案：Service**

### 逐字稿

好，我們的 Deployment 建好了，3 個 nginx Pod 正在跑。我們來看一下它們的 IP：

```
kubectl get pods -o wide
```

每個 Pod 都有一個 IP，像 `10.244.0.5`、`10.244.0.6`、`10.244.0.7`。但這些 IP 有兩個致命的問題。

第一，IP 會變。剛剛我們做了一個實驗，刪掉一個 Pod，K8s 自動重建了一個新的。但新 Pod 的 IP 跟原來的不一樣。如果你的前端寫死了 API 的 IP，Pod 一重建就斷線了。

第二，你有 3 個 Pod，前端到底該連哪一個？如果只連其中一個，那另外兩個不就白跑了嗎？而且如果那個 Pod 剛好掛了呢？

大家回想一下 Docker Compose 的經驗。在 Docker Compose 裡面，你不需要知道 API 容器的 IP，你可以直接用容器名稱 `http://api:8080` 來連。Docker 在背後自動幫你做了 DNS 解析。

K8s 也有類似的機制，而且更強大。K8s 的解決方案叫做 Service。Service 就是一個穩定的存取入口，它會做兩件事：第一，給你一個永遠不變的地址；第二，把流量自動分配到後面的多個 Pod。

---

## 第 10 頁 | Service 概念：ClusterIP（10min）

### PPT 上的內容

**Service = 穩定入口 + 負載均衡**

```
               ┌─────────┐
前端 Pod ───→  │  Service │ ──→  Pod 1 (10.244.0.5)
               │ nginx-svc│ ──→  Pod 2 (10.244.0.6)
               │10.96.0.10│ ──→  Pod 3 (10.244.0.7)
               └─────────┘
                 IP 不會變！     IP 會變，但不影響
```

**Service 怎麼知道要轉發給哪些 Pod？→ Label Selector**

```yaml
# Service 的 selector
spec:
  selector:
    app: nginx        # 找所有 label 有 app=nginx 的 Pod

# Pod 的 labels（在 Deployment template 裡定義的）
metadata:
  labels:
    app: nginx        # 被 Service 選中！
```

**Endpoints = Service 背後的 Pod IP 列表**

```bash
kubectl get endpoints nginx-svc
# NAME        ENDPOINTS
# nginx-svc   10.244.0.5:80, 10.244.0.6:80, 10.244.0.7:80
```

**ClusterIP（預設類型）：**
- Service 拿到一個叢集內部的虛擬 IP（如 10.96.0.10）
- 只能在叢集內部存取
- 適合：內部微服務之間的溝通

**對照 Docker：**

| Docker Compose | K8s Service |
|----------------|-------------|
| 容器名稱自動做 DNS | Service 名稱做 DNS |
| DNS 輪詢（基本的負載分配） | kube-proxy 負載均衡（更可靠） |
| `http://api:8080` | `http://api-svc:80` |

### 逐字稿

來看 Service 的核心概念。Service 做兩件事：第一，提供一個穩定的、不會變的 IP 地址和 DNS 名稱；第二，自動把流量負載均衡到後面的 Pod。

看圖：前端 Pod 連的是 Service 的 IP（比如 10.96.0.10），不管後面的 Pod 怎麼增減、IP 怎麼變，Service 的 IP 永遠不變。Service 會自動把請求分配到後面健康的 Pod 上。

那 Service 怎麼知道要把流量轉給哪些 Pod？答案是 Label Selector，跟 Deployment 一樣的機制。你在 Service 的 YAML 裡面寫 `selector: app: nginx`，Service 就會去找所有 label 有 `app: nginx` 的 Pod，把它們加進轉發清單。

你可以用 `kubectl get endpoints` 來查看 Service 背後有哪些 Pod。Endpoints 就是 Pod 的 IP 列表。Pod 被刪了、新建了，Endpoints 會自動更新，你不需要手動操作。

ClusterIP 是 Service 的預設類型。它會拿到一個叢集內部的虛擬 IP，只能在叢集裡面存取。適合用在微服務之間的溝通，比如前端連 API、API 連資料庫。

用 Docker Compose 來對照：Compose 裡面容器名稱會自動變成 DNS，你可以用 `http://api:8080` 來連。K8s 的 Service 也一樣，你可以用 `http://api-svc:80` 來連。差別是 K8s 的 Service 有 kube-proxy 在底層做真正的負載均衡，而 Docker Compose 只有 DNS 層面的輪詢，沒有健康檢查、沒有自動踢掉壞掉的容器。

---

## 第 11 頁 | Service YAML 拆解（5min）

### PPT 上的內容

**ClusterIP Service YAML：**

```yaml
apiVersion: v1                   # Service 用 v1
kind: Service
metadata:
  name: nginx-svc                # Service 的名字（等一下 DNS 會用到）
spec:
  type: ClusterIP                # 預設類型，可以省略
  selector:
    app: nginx                   # ← 要跟 Pod 的 label 一致！
  ports:
    - port: 80                   # Service 自己監聽的 port
      targetPort: 80             # 轉發到 Pod 的 port
```

**port vs targetPort：**

```
外部 → Service:80 (port) → Pod:80 (targetPort)

# 也可以不一樣：
外部 → Service:8080 (port) → Pod:80 (targetPort)
# 使用者連 8080，Service 把它轉到 Pod 的 80
```

**對照 Docker `-p` 參數：**

```bash
docker run -p 8080:80 nginx
#            ↑     ↑
#          host   container
#          (port)  (targetPort)
```

### 逐字稿

來看 Service 的 YAML。比 Deployment 簡單多了。

`apiVersion: v1`，Service 的 API 版本跟 Pod 一樣是 `v1`。`kind: Service`。

`spec` 裡面三個重點。`type: ClusterIP` 是 Service 的類型，ClusterIP 是預設值，你不寫也行。`selector` 是用來找 Pod 的，這裡寫 `app: nginx`，跟 Deployment 裡 Pod 的 label 一致。

`ports` 有兩個欄位容易搞混。`port` 是 Service 自己監聽的 port，也就是別人連 Service 時用的 port。`targetPort` 是 Service 要轉發到 Pod 的哪個 port。通常這兩個一樣，都是 80。但如果你想讓使用者連 8080、實際轉到 Pod 的 80，就可以把 port 寫 8080、targetPort 寫 80。

用 Docker 來對照，`docker run -p 8080:80`，左邊的 8080 是 host port，右邊的 80 是 container port。Service 的 `port` 就像 host port，`targetPort` 就像 container port。

---

## 第 12 頁 | 實作：ClusterIP Service（15min）

### PPT 上的內容

**Lab 3：建立 ClusterIP Service**

**service-clusterip.yaml：**
```yaml
# service-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP               # 預設類型，可省略
  selector:
    app: nginx                   # 跟 Deployment 的 Pod label 一致
  ports:
    - port: 80                   # Service 監聽的 port
      targetPort: 80             # 轉發到 Pod 的 port
```

**Step 1：建立 Service**
```bash
kubectl apply -f service-clusterip.yaml
```

**Step 2：查看 Service**
```bash
kubectl get services                 # 看到 nginx-svc
kubectl get svc                      # 縮寫
kubectl describe service nginx-svc   # 看 Endpoints
```

**Step 3：驗證 — 從另一個 Pod 存取**
```bash
# 建一個臨時 Pod，用完自動刪除
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh

# 進去後，用 Service 名稱連線
curl http://nginx-svc
curl http://nginx-svc
curl http://nginx-svc
# 每次都能連到！
exit
```

**重點觀察：`describe` 裡的 Endpoints**
```bash
kubectl describe svc nginx-svc
# Endpoints: 10.244.0.5:80, 10.244.0.6:80, 10.244.0.7:80
# 這就是 Service 背後的 Pod IP 列表
```

### 逐字稿

好，來建我們的第一個 Service。

```
kubectl apply -f service-clusterip.yaml
```

成功了。來看看：

```
kubectl get svc
```

你會看到兩個 Service。一個是 `kubernetes`，這是 K8s 系統自帶的，不用管。另一個就是我們剛建的 `nginx-svc`，TYPE 是 ClusterIP，CLUSTER-IP 欄位有一個 IP 地址。

我們用 `describe` 看更多細節：

```
kubectl describe svc nginx-svc
```

重點看 `Endpoints` 那一行。你會看到三個 IP 加上 port，像 `10.244.0.5:80, 10.244.0.6:80, 10.244.0.7:80`。這就是 Service 背後的三個 Pod。Service 會把流量輪流分配到這三個 Pod 上。

好，ClusterIP Service 只能在叢集內部存取。我們要怎麼驗證呢？建一個臨時的 Pod，從叢集裡面去連：

```
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
```

這行指令做了幾件事：用 `curlimages/curl` 這個 image 建一個臨時 Pod，`--rm` 表示離開後自動刪除，`-it` 進入互動模式，`--restart=Never` 表示不要自動重啟。

進去之後，試試用 Service 名稱連線：

```
curl http://nginx-svc
```

你應該會看到 nginx 的歡迎頁面！再多 curl 幾次，每次都能成功。

注意我們用的是 `nginx-svc` 這個名稱，不是 IP。K8s 的 CoreDNS 會自動把 Service 名稱解析成 Service 的 ClusterIP。這個我們等下會詳細講。

輸入 `exit` 離開，臨時 Pod 會自動刪除。

---

## 第 13 頁 | Service 進階：NodePort（10min）

### PPT 上的內容

**ClusterIP 的限制：只有叢集內部能連**

```
瀏覽器 → ❌ → ClusterIP Service（10.96.0.10）
                叢集內部才能連到這個 IP
```

**NodePort = 在每個 Node 上開一個 Port**

```
瀏覽器 → Node IP:30080 → Service → Pod
         任何一個 Node 都可以
```

**NodePort 範圍：30000 - 32767**

```yaml
spec:
  type: NodePort
  ports:
    - port: 80             # Service 內部 port
      targetPort: 80       # Pod 的 port
      nodePort: 30080      # Node 上開的 port（你指定或讓 K8s 隨機分配）
```

**三個 port 的關係：**

```
外部 → nodePort (30080) → port (80) → targetPort (80)
       Node 上的         Service 的    Pod 的
```

**對照 Docker：**

```bash
docker run -p 30080:80 nginx
#            ↑       ↑
#        host port   container port
# 相當於 NodePort 的 nodePort 和 targetPort
```

### 逐字稿

ClusterIP Service 解決了叢集內部的溝通問題，但如果你想從外部存取呢？比如你想在瀏覽器打開 nginx 的頁面。ClusterIP 的 IP 是叢集內部的虛擬 IP，從外面連不到。

這時候就需要 NodePort。NodePort 會在每個 Node 上開一個 port（範圍 30000 到 32767），外部流量從這個 port 進來，然後轉發到 Service，Service 再轉發到 Pod。

YAML 裡面多了兩個東西：`type: NodePort` 把 Service 類型從 ClusterIP 改成 NodePort；`ports` 裡面多了一個 `nodePort: 30080`，這是在 Node 上開的 port。你可以自己指定（在 30000-32767 範圍內），也可以不寫讓 K8s 隨機分配。

現在有三個 port，容易搞混，我們理清一下。最外面是 `nodePort`（30080），這是 Node 上開的，外部用這個連。中間是 `port`（80），這是 Service 的 port，叢集內部用這個連。最裡面是 `targetPort`（80），這是 Pod 的 port。

流量的路線是：外部 → Node:30080 → Service:80 → Pod:80。

對照 Docker 的 `-p 30080:80`，nodePort 就像 host port，targetPort 就像 container port。差別是 Docker 只在一台機器上開 port，K8s 的 NodePort 會在每個 Node 上都開同一個 port。所以不管你連哪個 Node 的 30080，都能到達你的服務。

---

## 第 14 頁 | 實作：NodePort Service（10min）

### PPT 上的內容

**Lab 4：建立 NodePort Service**

**service-nodeport.yaml：**
```yaml
# service-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx                  # 跟 Deployment 的 Pod label 一致
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080           # 30000-32767 範圍內
```

**Step 1：建立**
```bash
kubectl apply -f service-nodeport.yaml
```

**Step 2：查看**
```bash
kubectl get svc
# NAME              TYPE        CLUSTER-IP    PORT(S)
# nginx-nodeport    NodePort    10.96.x.x     80:30080/TCP
```

**Step 3：從外部存取**
```bash
# minikube 用戶
minikube ip                                  # 取得 Node IP
curl http://<minikube-ip>:30080
minikube service nginx-nodeport              # 自動開瀏覽器

# k3s 用戶
multipass info k3s-worker1 | grep IPv4       # 取得任一 Node IP
curl http://<node-ip>:30080
```

**port-forward vs NodePort：**

| | port-forward | NodePort |
|--|-------------|----------|
| 用途 | 開發除錯 | 測試/輕量生產 |
| 持續性 | 關掉終端就斷 | 永久有效 |
| port 範圍 | 任意 | 30000-32767 |

### 逐字稿

來建一個 NodePort Service。

```
kubectl apply -f service-nodeport.yaml
```

看一下 Service 列表：

```
kubectl get svc
```

你會看到 `nginx-nodeport` 的 TYPE 是 `NodePort`，PORT(S) 欄位顯示 `80:30080/TCP`，意思是 Service 的 80 port 對應到 Node 的 30080 port。

現在我們從外部來存取。先取得 Node 的 IP。minikube 用 `minikube ip`，k3s 用 `multipass info k3s-worker1 | grep IPv4`。

記下 IP，然後用 curl：

```
curl http://<node-ip>:30080
```

你應該看到 nginx 的歡迎頁面。也可以直接在瀏覽器打開 `http://<node-ip>:30080`。

minikube 用戶還有一個更方便的指令：

```
minikube service nginx-nodeport
```

它會自動幫你打開瀏覽器。

大家回想一下，上一堂課我們用 `port-forward` 也能讓外部連到 Pod。那 port-forward 和 NodePort 有什麼差別？port-forward 是臨時的，關掉終端就斷了，適合開發除錯。NodePort 是永久的，只要 Service 存在就一直有效，適合測試環境或輕量的生產環境。

不過 NodePort 也有限制：port 範圍只有 30000 到 32767，記起來不方便。而且讓使用者輸入 IP 加 port 也不專業。那生產環境怎麼辦？先留個懸念，第六堂課會講 Ingress 和 LoadBalancer。

實作完之後，我們先把 NodePort Service 刪掉，留著 ClusterIP 給後面的 Lab 用：

```
kubectl delete svc nginx-nodeport
```

---

## 第 15 頁 | 三種 Service 類型比較（5min）

### PPT 上的內容

**三種 Service 類型：**

| 類型 | 存取範圍 | 使用場景 | 對照 Docker |
|------|---------|---------|-----------|
| **ClusterIP** | 叢集內部 | 微服務之間溝通（API ↔ DB） | Docker Compose network DNS |
| **NodePort** | Node IP + Port | 測試環境、簡單的外部存取 | `docker run -p 30080:80` |
| **LoadBalancer** | 外部（雲端 LB） | 生產環境（AWS ELB/GCP LB） | 雲端負載均衡器 |

**它們是遞增關係：**

```
ClusterIP ⊂ NodePort ⊂ LoadBalancer

NodePort 包含 ClusterIP 的所有功能
LoadBalancer 包含 NodePort 的所有功能
```

**怎麼選？**

```
叢集內部用 → ClusterIP（預設就好）
測試需要外部連 → NodePort
生產環境 → LoadBalancer（搭配雲端）或 Ingress
```

### 逐字稿

在繼續之前，我們來整理一下三種 Service 類型。

ClusterIP 是預設的，只能在叢集內部存取。適合微服務之間的溝通，比如前端連 API、API 連資料庫。

NodePort 會在每個 Node 上開一個 30000-32767 範圍內的 port，讓外部可以存取。適合測試環境或不想弄太複雜的場景。

LoadBalancer 會跟雲端平台（AWS、GCP、Azure）要一個外部的負載均衡器，自動分配一個公開的 IP。適合生產環境。但在本地環境（minikube / k3s）通常用不了，因為沒有真正的雲端負載均衡器。k3s 內建了一個簡易的 LoadBalancer（ServiceLB），但功能有限。

這三個類型是遞增的關係。NodePort 包含 ClusterIP 的所有功能 — 你建了一個 NodePort Service，它同時也有 ClusterIP。LoadBalancer 包含 NodePort 的所有功能。

怎麼選？很簡單：叢集內部用 ClusterIP，測試需要外部連用 NodePort，生產環境用 LoadBalancer 或 Ingress（下一堂課會教）。

---

## 第 16 頁 | DNS 與服務發現：概念（10min）

### PPT 上的內容

**在 Lab 3 裡面我們做了：**
```bash
curl http://nginx-svc       # 用名字連 Service，不用 IP
```

**這是怎麼做到的？→ CoreDNS**

- K8s 內建 DNS 服務（CoreDNS）
- 每建立一個 Service → CoreDNS 自動新增 DNS 記錄
- Pod 裡面的 `/etc/resolv.conf` 預設指向 CoreDNS

**DNS 名稱格式：**

```
<service-name>.<namespace>.svc.cluster.local

nginx-svc.default.svc.cluster.local
    ↑         ↑      ↑       ↑
  服務名    命名空間  固定    固定
```

**三種寫法（從短到長）：**

| 寫法 | 什麼時候用 |
|------|----------|
| `nginx-svc` | 同一個 Namespace 內（最常用） |
| `nginx-svc.default` | 跨 Namespace（指定 Namespace） |
| `nginx-svc.default.svc.cluster.local` | 完整寫法（FQDN） |

**對照 Docker：**

```bash
# Docker Compose
# 容器名稱自動變 DNS，但只限同一個 network
curl http://api:8080

# K8s
# Service 名稱自動變 DNS，跨 Namespace 也能用
curl http://api-svc:80
curl http://api-svc.production.svc.cluster.local
```

### 逐字稿

剛才我們在 Lab 3 裡面，從臨時 Pod 用 `curl http://nginx-svc` 連到了 nginx Service。我們用的是 Service 的名字，不是 IP。這是怎麼做到的？

答案是 CoreDNS。K8s 叢集裡面內建了一個 DNS 服務叫做 CoreDNS。每當你建立一個 Service，CoreDNS 就會自動新增一筆 DNS 記錄，把 Service 的名字對應到它的 ClusterIP。

Pod 在啟動的時候，K8s 會自動設定它的 `/etc/resolv.conf`，把 DNS 指向 CoreDNS。所以 Pod 裡面用 Service 名字做 DNS 查詢，就會被 CoreDNS 解析成 Service 的 IP。

DNS 名稱的完整格式是：`<service-name>.<namespace>.svc.cluster.local`。比如我們的 nginx-svc 在 default namespace，完整寫法就是 `nginx-svc.default.svc.cluster.local`。

但你不需要每次都寫這麼長。如果你在同一個 Namespace 裡面，直接寫 `nginx-svc` 就夠了，K8s 會自動補上後面的部分。如果你要跨 Namespace 存取，寫到 Namespace 就夠了，比如 `nginx-svc.production`。完整的 FQDN 寫法通常只在需要絕對明確的時候才用。

對照 Docker Compose：Compose 裡面容器名稱也會自動變 DNS，你可以用 `http://api:8080` 來連。但 Compose 的 DNS 只限同一個 Docker network 裡面的容器。K8s 的 DNS 更強大，同一個 Namespace 用短名稱，跨 Namespace 加上 Namespace 名稱就好了。

---

## 第 17 頁 | 實作：DNS 驗證（10min）

### PPT 上的內容

**Lab 5：DNS 與服務發現**

**Step 1：從臨時 Pod 測試 DNS**
```bash
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
```

**Step 2：用短名稱連線**
```bash
wget -qO- http://nginx-svc
# 看到 nginx 歡迎頁面 ✅
```

**Step 3：用完整 FQDN 連線**
```bash
wget -qO- http://nginx-svc.default.svc.cluster.local
# 一樣能連到 ✅
```

**Step 4：用 nslookup 看 DNS 解析**
```bash
nslookup nginx-svc
# Server:    10.96.0.10      ← CoreDNS 的 IP
# Name:      nginx-svc.default.svc.cluster.local
# Address:   10.96.x.x       ← Service 的 ClusterIP
```

**重點觀察：**
- `nslookup` 結果的 Server 就是 CoreDNS
- Address 就是 Service 的 ClusterIP
- DNS 解析是自動的，你不需要設定任何東西

### 逐字稿

好，我們來驗證 DNS 是不是真的能用。

建一個臨時的 busybox Pod：

```
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
```

為什麼這次用 busybox 不用 curl image？因為 busybox 裡面有 `wget` 和 `nslookup` 這些工具，等一下都用得到。

進去之後，先用短名稱連：

```
wget -qO- http://nginx-svc
```

`-qO-` 的意思是安靜模式（`-q`），把內容輸出到標準輸出（`-O-`）。你會看到 nginx 的 HTML 歡迎頁面。

再用完整的 FQDN 試試：

```
wget -qO- http://nginx-svc.default.svc.cluster.local
```

一樣能連到。這兩種寫法指向同一個 Service。

最重要的來了。用 `nslookup` 看一下 DNS 解析的過程：

```
nslookup nginx-svc
```

你會看到 Server 是一個 IP，那個就是 CoreDNS 的地址。下面的 Name 顯示完整的 FQDN，Address 就是 nginx-svc 這個 Service 的 ClusterIP。

這就證明了：你在 Pod 裡面用 Service 名稱，CoreDNS 會自動把它解析成 Service 的 ClusterIP。整個過程完全自動，你不需要修改任何 DNS 設定。

好，輸入 `exit` 離開。

---

## 第 18 頁 | Namespace 概念（10min）

### PPT 上的內容

**痛點：名字衝突**

```
你的團隊有 dev 環境和 staging 環境
兩個環境都有 api-deploy、frontend-deploy、api-svc

如果全部放在 default namespace → 名字衝突！
```

**Namespace = 邏輯隔離**

```
┌─── Namespace: dev ──────────┐  ┌─── Namespace: staging ────────┐
│                              │  │                                │
│  api-deploy (nginx:1.27)    │  │  api-deploy (nginx:1.28)      │
│  frontend-deploy             │  │  frontend-deploy               │
│  api-svc                     │  │  api-svc                       │
│                              │  │                                │
└──────────────────────────────┘  └────────────────────────────────┘

同名但互不干擾！
```

**K8s 預設的 Namespace：**

| Namespace | 用途 |
|-----------|------|
| `default` | 你沒指定的話就在這裡 |
| `kube-system` | K8s 系統元件（API Server、CoreDNS...） |
| `kube-public` | 公開資源（很少用） |
| `kube-node-lease` | 節點心跳（不用管） |

**注意：Namespace 不是安全隔離！**
- Namespace 只是邏輯分組，不是網路隔離
- 不同 Namespace 的 Pod 預設可以互相連線
- 要網路隔離需要用 NetworkPolicy（後面會教）

**對照 Docker：**
- Docker 沒有 Namespace 的概念
- 最接近的是不同的 Docker Compose 專案（不同的 project name）

### 逐字稿

在講完 Service 和 DNS 之後，我們來學一個很實用的概念 — Namespace，命名空間。

想像一個場景：你的團隊有 dev 開發環境和 staging 測試環境。兩個環境都需要部署同樣的一套微服務：api-deploy、frontend-deploy、api-svc。如果這些東西全部放在 default namespace 裡面，名字就衝突了 — K8s 不允許同一個 Namespace 裡面有兩個同名的 Deployment。

Namespace 就是解決方案。你可以建一個 `dev` Namespace 和一個 `staging` Namespace，然後在各自的 Namespace 裡面部署同名的資源。它們互不干擾，各自獨立。

K8s 預設有幾個 Namespace。`default` 是你不指定 Namespace 的時候資源會待的地方，我們之前的操作都是在 default 裡面。`kube-system` 放的是 K8s 自己的系統元件，像 API Server、CoreDNS 這些。`kube-public` 和 `kube-node-lease` 基本上不用管。

有一點要特別注意：Namespace 只是邏輯上的分組，不是真正的安全隔離。不同 Namespace 的 Pod 預設是可以互相連線的。如果你需要網路層面的隔離，要用 NetworkPolicy，後面會教。

Docker 裡面沒有 Namespace 的概念。最接近的可能是不同的 Docker Compose 專案 — 你可以在不同的目錄下各放一個 compose.yaml，它們的服務名稱可以一樣。但 Compose 的隔離是靠不同的 Docker network 來做的，跟 K8s 的 Namespace 機制不一樣。

---

## 第 19 頁 | 實作：Namespace（15min）

### PPT 上的內容

**Lab 6：Namespace 實作**

**namespace-practice.yaml：**
```yaml
# namespace-practice.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
```

**Step 1：建立 Namespace**
```bash
kubectl apply -f namespace-practice.yaml
kubectl get namespaces
```

**Step 2：在不同 Namespace 部署同名應用**
```bash
# dev 環境
kubectl create deployment nginx-dev --image=nginx:1.27 -n dev
kubectl get pods -n dev

# staging 環境（同名！）
kubectl create deployment nginx-dev --image=nginx:1.27 -n staging
kubectl get pods -n staging
```

**Step 3：看全部 Namespace 的資源**
```bash
kubectl get deployments --all-namespaces
kubectl get deployments -A              # 縮寫
```

**Step 4：跨 Namespace 存取**
```bash
# 在 dev 建 Service
kubectl expose deployment nginx-dev --port=80 -n dev

# 從 default namespace 跨到 dev
kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- \
  wget -qO- http://nginx-dev.dev.svc.cluster.local
```

**常用的 `-n` 參數：**
```bash
kubectl get pods                    # 預設 default namespace
kubectl get pods -n dev             # 指定 dev namespace
kubectl get pods -A                 # 所有 namespace
```

### 逐字稿

好，來動手玩 Namespace。

先建立 dev 和 staging 兩個 Namespace：

```
kubectl apply -f namespace-practice.yaml
```

看一下：

```
kubectl get namespaces
```

你會看到除了 K8s 預設的那幾個之外，多了 `dev` 和 `staging`。

現在在 dev 裡面部署一個 Deployment：

```
kubectl create deployment nginx-dev --image=nginx:1.27 -n dev
```

`-n dev` 就是指定 Namespace 為 dev。看看 Pod：

```
kubectl get pods -n dev
```

你會看到 dev Namespace 裡有一個 Pod 在跑。

再在 staging 裡面部署同名的 Deployment：

```
kubectl create deployment nginx-dev --image=nginx:1.27 -n staging
```

注意，名字一樣叫 `nginx-dev`！但因為在不同的 Namespace，完全不衝突。

```
kubectl get pods -n staging
```

staging 也有自己的 Pod 了。

如果你想一次看所有 Namespace 的 Deployment：

```
kubectl get deployments -A
```

`-A` 是 `--all-namespaces` 的縮寫。你會看到 dev 和 staging 各有一個 nginx-dev。

接下來試試跨 Namespace 存取。先在 dev 建一個 Service：

```
kubectl expose deployment nginx-dev --port=80 -n dev
```

然後從 default Namespace 跨過去連：

```
kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-dev.dev.svc.cluster.local
```

注意 DNS 名稱：`nginx-dev.dev.svc.cluster.local`。因為我們是從 default Namespace 跨到 dev Namespace，所以不能只寫 `nginx-dev`，要加上 Namespace 名稱。如果你只寫 `nginx-dev`，它會去找 default Namespace 的 nginx-dev Service，那是找不到的。

記住這個規則：同一個 Namespace 用短名稱，跨 Namespace 要加 Namespace 名稱。

實作完之後，清理一下：

```
kubectl delete namespace dev staging
```

刪除 Namespace 會把裡面所有的資源一起刪掉，很方便但也很危險。在生產環境千萬不要隨便刪 Namespace。

---

## 第 20 頁 | Namespace 常用操作（5min）

### PPT 上的內容

**設定預設 Namespace（不用每次打 -n）：**

```bash
# 切換預設 Namespace 到 dev
kubectl config set-context --current --namespace=dev

# 之後 kubectl get pods 預設就是看 dev 的
kubectl get pods                    # 等於 kubectl get pods -n dev

# 切回 default
kubectl config set-context --current --namespace=default
```

**快速確認目前在哪個 Namespace：**

```bash
kubectl config view --minify | grep namespace
```

**建議：**
- 開發測試：用 Namespace 隔離不同環境
- 生產環境：不同團隊用不同 Namespace
- 搭配 RBAC 可以限制「誰能存取哪個 Namespace」（後面會教）

### 逐字稿

補充一個實用技巧。如果你經常在某個 Namespace 工作，每次都要打 `-n dev` 很煩。你可以設定預設 Namespace：

```
kubectl config set-context --current --namespace=dev
```

設定之後，`kubectl get pods` 預設就是看 dev 的 Pod，不需要加 `-n dev`。要切回 default 的話：

```
kubectl config set-context --current --namespace=default
```

如果忘記目前在哪個 Namespace，可以用：

```
kubectl config view --minify | grep namespace
```

在實際工作中，Namespace 的使用建議是：開發測試用 Namespace 隔離不同環境（dev、staging、production），團隊多的話不同團隊用不同 Namespace。搭配後面會教的 RBAC 權限控制，你可以限制某個工程師只能存取 dev 的 Namespace，不能碰 production。

---

## 第 21 頁 | 完整練習：前後端部署（20min）

### PPT 上的內容

**Lab 7：完整部署實戰**

**目標架構：**
```
外部瀏覽器
     │
     ▼ :30080
┌─────────────────── fullstack-demo namespace ──────────────────┐
│                                                                │
│   frontend-svc (NodePort)        api-svc (ClusterIP)          │
│        │                              │                        │
│   ┌────┴────┐                    ┌────┴────┐                  │
│   │frontend │ ──── curl ────→    │  api    │                  │
│   │ (nginx) │                    │ (httpd) │                  │
│   │ x2 副本 │                    │ x2 副本 │                  │
│   └─────────┘                    └─────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

**full-stack.yaml（一個檔案搞定）：**

```yaml
# full-stack.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fullstack-demo
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: fullstack-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: fullstack-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: httpd
          image: httpd:2.4
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: fullstack-demo
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
---
apiVersion: v1
kind: Service
metadata:
  name: api-svc
  namespace: fullstack-demo
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 80
```

```bash
kubectl apply -f full-stack.yaml
kubectl get all -n fullstack-demo
```

**驗證清單：**
```bash
# 1. 看到所有資源都 Running
kubectl get all -n fullstack-demo

# 2. 外部存取前端
# minikube 用戶：
minikube service frontend-svc -n fullstack-demo
# k3s 用戶：
curl http://<node-ip>:30080

# 3. 前端可以連到 API（叢集內部）
kubectl exec -it <frontend-pod> -n fullstack-demo -- curl http://api-svc

# 4. DNS 解析正常
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 \
  --rm -it --restart=Never -- nslookup api-svc
```

### 逐字稿

好，最後一個練習，我們要把今天學的東西全部串起來。建一個完整的前後端應用。

打開 `full-stack.yaml`，裡面有五個資源：一個 Namespace、兩個 Deployment、兩個 Service。

架構是這樣的：`fullstack-demo` Namespace 裡面有一個前端（nginx，2 個副本）和一個 API（httpd，2 個副本）。前端用 NodePort Service 暴露給外部，API 用 ClusterIP Service 只在叢集內部提供。前端可以透過 `api-svc` 這個 DNS 名稱連到 API。

一行部署所有東西：

```
kubectl apply -f full-stack.yaml
```

然後看看：

```
kubectl get all -n fullstack-demo
```

你應該看到 2 個 Deployment、2 個 ReplicaSet、4 個 Pod（前端 2 個 + API 2 個）、2 個 Service。

驗證外部存取。minikube 用戶可以用 `minikube service frontend-svc -n fullstack-demo` 自動開瀏覽器。k3s 用戶直接用 Node IP 加 30080：

```
curl http://<node-ip>:30080
```

應該看到 nginx 的歡迎頁面。

驗證前端可以連到 API。找到一個 frontend Pod 的名字，然後：

```
kubectl exec -it <frontend-pod-name> -n fullstack-demo -- curl http://api-svc
```

你應該看到 httpd 的 "It works!" 頁面。這證明了前端 Pod 可以透過 Service DNS 名稱連到 API Pod。

最後驗證 DNS：

```
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc
```

你會看到 api-svc 被解析成它的 ClusterIP。

恭喜大家，你們剛剛完成了一個接近真實場景的部署！Namespace 做隔離、Deployment 管副本、Service 做存取入口和負載均衡、DNS 讓服務之間用名字互連。

實作完之後，清理：

```
kubectl delete namespace fullstack-demo
```

---

## 第 22 頁 | 最終清理（2min）

### PPT 上的內容

**清理 default namespace 的資源：**

```bash
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
kubectl delete svc nginx-nodeport 2>/dev/null

# 確認乾淨了
kubectl get all
```

**為什麼要清理？**
- 本地叢集資源有限
- 養成好習慣：用完就清
- 下一堂課從乾淨的環境開始

### 逐字稿

在結束之前，我們把 default namespace 裡面的東西也清乾淨。

```
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
```

再 `kubectl get all` 確認一下，應該只剩下 kubernetes 系統 Service。

養成好習慣：每次實作完把資源清掉。一來本地叢集的資源有限，二來下一堂課我們要從乾淨的環境開始。

---

## 第 23 頁 | 今日總結（5min）

### PPT 上的內容

**今天學了四個核心概念：**

| 概念 | 做什麼 | Docker 對照 |
|------|--------|-----------|
| **Deployment** | 管理 Pod 副本 + 滾動更新 + 回滾 | `docker compose up --scale` |
| **Service** | 穩定入口 + 負載均衡 | `-p 8080:80` + network DNS |
| **DNS** | 用名字連 Service，不用記 IP | Compose 容器名稱 DNS |
| **Namespace** | 邏輯隔離，同名資源不衝突 | 不同 Compose 專案 |

**今天的三個重點：**

1. **永遠不要直接管 Pod** — 用 Deployment，它幫你維持副本、滾動更新、一鍵回滾
2. **永遠不要用 Pod IP** — 用 Service，它給你穩定的 IP 和 DNS 名稱
3. **善用 Namespace** — 隔離環境，同名資源不衝突，跨 Namespace 用 FQDN

**kubectl 新指令清單：**

```bash
kubectl get deploy / rs / svc / ns   # 查看各種資源
kubectl scale deploy <name> --replicas=N
kubectl set image deploy/<name> <container>=<image>
kubectl rollout status / history / undo
kubectl expose deployment <name> --port=80
kubectl get endpoints
kubectl config set-context --current --namespace=<ns>
```

### 逐字稿

好，我們來總結今天學到的東西。

今天學了四個核心概念。Deployment 負責管理 Pod 副本，提供滾動更新和回滾功能。Service 提供穩定的存取入口和負載均衡。DNS 讓你用名字而不是 IP 來連 Service。Namespace 提供邏輯隔離，讓不同環境的同名資源不衝突。

三個最重要的重點。第一，永遠不要直接管 Pod。生產環境都用 Deployment，因為它幫你維持副本數量、做滾動更新、支援一鍵回滾。直接跑 Pod 就像用 Docker 的時候只用 `docker run` 不寫 Compose 一樣，可以但不建議。

第二，永遠不要用 Pod 的 IP。Pod 的 IP 會變，而且有多個 Pod 的時候你不知道該連哪一個。用 Service，它給你一個永遠不變的 ClusterIP 和 DNS 名稱。

第三，善用 Namespace。不同的環境用不同的 Namespace 隔離。同一個 Namespace 裡用 Service 短名稱，跨 Namespace 要用 FQDN：`<service>.<namespace>.svc.cluster.local`。

---

## 第 24 頁 | Docker → K8s 對照表更新（3min）

### PPT 上的內容

**到目前為止的完整對照：**

| Docker | K8s | 學了嗎 |
|--------|-----|:---:|
| `docker run` | Pod | 第四堂 |
| `docker ps / logs / exec` | `kubectl get / logs / exec` | 第四堂 |
| `docker compose up --scale web=3` | Deployment `replicas: 3` | 今天 |
| `--restart always` | Deployment（自動重建） | 今天 |
| `-p 8080:80` | Service (NodePort / ClusterIP) | 今天 |
| `--network` + 容器名稱 DNS | Service + CoreDNS | 今天 |
| 不同 Compose 專案 | Namespace | 今天 |
| Nginx 反向代理 | Ingress | 下一堂 |
| `-e ENV_VAR` | ConfigMap | 下一堂 |
| `.env` 密碼 | Secret | 下一堂 |
| `docker volume` | PV / PVC | 下一堂 |

### 逐字稿

我們來更新一下 Docker 到 K8s 的對照表。

上一堂課我們對照了 Pod 等於 `docker run`、kubectl 等於 docker 的各種指令。今天我們又新增了好幾項。

`docker compose up --scale web=3` 對應 K8s 的 Deployment replicas。Docker 的 `--restart always` 對應 Deployment 的自動重建功能。Docker 的 `-p 8080:80` 對應 K8s 的 Service。Docker Compose 裡容器名稱做 DNS 對應 K8s 的 CoreDNS。不同的 Compose 專案對應 K8s 的 Namespace。

下一堂課我們會繼續補完這張表：Ingress、ConfigMap、Secret、PV/PVC。到第七堂課結束的時候，Docker 的每個功能你都能找到 K8s 的對應物。

---

## 第 25 頁 | 反思問題 + 下堂預告（3min）

### PPT 上的內容

**反思問題：**

> 你的 API 在跑了、NodePort 也建好了。使用者可以用 `http://<node-ip>:30080` 存取。
>
> 但是生產環境，你不可能叫使用者輸入 IP 和 Port。
>
> **問題 1：怎麼讓使用者用 `https://myapp.com` 就能連到你的服務？**
>
> **問題 2：你的資料庫密碼現在寫死在 YAML 裡，推到 Git 就全世界都看到了。怎麼安全地管理這些敏感資訊？**

**下堂課預告：第六堂 — 設定與資料**

| 主題 | 解決什麼 |
|------|---------|
| Ingress | 用域名存取 + HTTPS |
| ConfigMap | 把設定從 Image 裡抽出來 |
| Secret | 安全管理密碼 |
| PV / PVC | 資料持久化（Pod 死了資料不能丟） |
| Helm | 套件管理（不要手寫 100 個 YAML） |

### 逐字稿

最後，留兩個反思問題給大家。

第一個問題：你的 API 服務跑起來了，NodePort 也建好了，使用者可以用 Node 的 IP 加上 30080 port 來存取。但在生產環境，你總不能叫使用者輸入 `192.168.1.100:30080` 吧？怎麼讓使用者用一個漂亮的域名，比如 `https://myapp.com`，就能連到你的服務？

第二個問題：假設你的 API 要連資料庫，密碼寫在 Deployment 的 YAML 裡面。如果這個 YAML 推到 Git，全世界都能看到你的資料庫密碼。怎麼辦？

這兩個問題的答案就是下一堂課的內容。下一堂課我們會學 Ingress — 用域名存取你的服務、ConfigMap — 把設定從 Image 裡面抽出來、Secret — 安全地管理密碼、PV/PVC — 資料持久化、以及 Helm — K8s 的套件管理工具。

好，今天的課程到這裡。大家辛苦了，我們下堂課見！
