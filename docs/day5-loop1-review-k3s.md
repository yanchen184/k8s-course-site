# Day 5 Loop 1 — 回顧 + k3s 多節點環境建置

---

## 5-1 第四堂回顧 + 為什麼需要多節點（15 min）

### ① 課程內容

**第四堂完整回顧**

- **K8s 架構兩大角色：**
  - Master Node（控制平面）：負責決策、管理、排程
    - `kube-apiserver`：所有指令的唯一入口，kubectl 跟它說話
    - `etcd`：叢集的資料庫，儲存所有狀態（鍵值對）
    - `kube-scheduler`：決定 Pod 要放在哪個 Node 上
    - `controller-manager`：監控叢集狀態，確保實際 = 期望（如 ReplicaSet 控制器）
  - Worker Node（執行平面）：負責實際跑容器
    - `kubelet`：Node 的管家，和 API Server 保持心跳，確保容器按 Pod Spec 執行
    - `kube-proxy`：處理 Node 上的網路規則，讓 Service 可以轉發流量
    - `Container Runtime`：真正跑容器的引擎（containerd / CRI-O）

- **YAML 四大必填欄位：**
  - `apiVersion`：API 群組版本（v1、apps/v1 等）
  - `kind`：資源類型（Pod、Deployment、Service 等）
  - `metadata`：資源的「身分證」（name、namespace、labels）
  - `spec`：期望狀態（這個資源該長什麼樣）

- **Pod 核心概念：**
  - K8s 最小部署單位，不是容器本身
  - 一個 Pod 可以包多個容器（但通常一個），共享網路 namespace 和 Volume
  - Pod 是「臨時的」，沒有自我修復能力，刪了就沒了

- **kubectl 五大指令：**
  - `get`：查看資源列表（快速瀏覽）
  - `describe`：查看資源詳細資訊（Events 是排錯關鍵）
  - `logs`：查看容器日誌
  - `exec`：進入容器執行指令
  - `delete`：刪除資源

- **排錯三板斧：**
  1. `kubectl get pods` → 看 STATUS（Running / Pending / CrashLoopBackOff / ImagePullBackOff）
  2. `kubectl describe pod <name>` → 看 Events 區塊，通常錯誤原因在這
  3. `kubectl logs <pod-name>` → 看容器內部的 stderr / stdout

**minikube 單節點的三大限制**

- **限制 ①：Pod 不會分散到不同 Node**
  - minikube 只有 1 個 Node，所有 Pod 全部擠在同一台機器
  - 用 `kubectl get pods -o wide` 看 NODE 欄位，永遠是同一個名字
  - 感受不到「分散部署」、「高可用」的意義

- **限制 ②：NodePort 只有一個 Node IP**
  - NodePort Service 的特性是「任何一個 Node 的 IP + Port 都能連到服務」
  - minikube 只有一個 Node，體驗不到多節點 NodePort 的效果

- **限制 ③：DaemonSet 看不出每 Node 一份的效果**
  - DaemonSet 的定義是「每個 Node 跑一個 Pod」
  - 單節點只有 1 個 Pod，跟普通 Pod 沒區別，無法感受差異

**k3s 是什麼**

- Rancher Labs（現為 SUSE 旗下）開源的輕量版 Kubernetes
- 完全相容 Kubernetes API — 所有 kubectl 指令、YAML 格式完全一樣
- 名字由來：Kubernetes 是 10 個字母的單字，縮寫為 K8s（首K、尾s、中間8字母）；Half as big 是 5 個字母，因此縮寫為 K3s（首K、尾s、中間3字母）
- 安裝只需一行 curl 指令，30 秒完成（vs kubeadm 需要處理前置套件、cgroup driver、憑證等）
- 資源佔用少，適合本機學習、Edge 環境、IoT
- 注意：k3s 拿掉了部分 alpha/beta 功能和雲端整合元件，但核心 API 完整保留

**Multipass 是什麼**

- Canonical（Ubuntu 母公司）出品的 VM 管理工具
- 一行指令建立 Ubuntu 虛擬機，不需要 VirtualBox / VMware GUI
- 跨平台：macOS / Windows / Linux 都支援
- 適合快速建立本機測試環境、學習叢集

**Docker 對照表**

| 動作 | Docker Swarm | K3s |
|------|-------------|-----|
| 初始化叢集 | `docker swarm init` | `curl -sfL https://get.k3s.io \| sh -` |
| 加入節點 | `docker swarm join --token ...` | `K3S_URL=... K3S_TOKEN=... curl ... \| sh -` |
| 查看節點 | `docker node ls` | `kubectl get nodes` |
| 節點 Join Token | `docker swarm join-token worker` | `cat /var/lib/rancher/k3s/server/node-token` |

---

### ② 所有指令＋講解

本節以回顧為主，主要指令集中在 5-2，此節無新指令。

---

### ③ 題目

1. minikube 和 k3s 的關鍵差異是什麼？從「學習多節點行為」的角度說明。
2. 請說出 Master Node 四個元件的名稱和各自的職責，各用一句話說明。
3. 「排錯三板斧」的執行順序是什麼？為什麼要按這個順序？

---

### ④ 解答

1. minikube 是單節點，所有 Pod 跑在同一台機器，無法觀察 Pod 分散部署、NodePort 多節點可連、DaemonSet 每 Node 一份等行為。k3s 是真實的多節點叢集，可以完整體驗上述效果，且完全相容 K8s API。

2. 四個元件：
   - `kube-apiserver`：所有操作的唯一入口，kubectl 透過它和叢集溝通
   - `etcd`：叢集的鍵值資料庫，儲存所有資源的期望狀態
   - `kube-scheduler`：決定新 Pod 要調度到哪個 Worker Node
   - `controller-manager`：持續監控實際狀態，確保與期望狀態一致

3. 順序：`get` → `describe` → `logs`。先用 get 快速看 STATUS，判斷問題大類（Pending/CrashLoop/ImagePull）；再用 describe 看 Events，通常原因直接寫在這裡（如 image pull 失敗、資源不足）；最後才用 logs 看容器內部錯誤，適合 CrashLoopBackOff 這類容器有跑起來但一直掛掉的狀況。

---

## 5-2 k3s 安裝實作（25 min）

### ① 課程內容

**安裝 Multipass**

- macOS：透過 Homebrew 安裝（需先裝 Homebrew）
- Windows：透過 Chocolatey 安裝（需先裝 Chocolatey），或從官網下載安裝檔
- Linux：透過 snap 安裝（Ubuntu/Debian 預設有 snapd）
- 安裝完成後可用 `multipass version` 驗證

**建立 3 台 VM**

- 命名規範：k3s-master、k3s-worker1、k3s-worker2
- 資源配置建議：2 CPU、2G RAM、10G Disk（最低需求，學習用）
- VM 預設使用最新 LTS Ubuntu 映像
- 第一次執行會下載映像，約 500MB，之後快取起來

**在 master 安裝 k3s server**

- 只要一行 curl 指令，腳本自動處理：下載二進位、設定 systemd service、產生 kubeconfig
- 安裝完後 k3s 服務立即啟動，kubeconfig 自動寫入 `/etc/rancher/k3s/k3s.yaml`
- 預設包含 Traefik ingress controller、local-path storage

**取得 Join Token 和 Master IP**

- **Token 位置**：`/var/lib/rancher/k3s/server/node-token`（只有 root 可讀）
- **Token 用途**：worker 用來向 master 證明加入權限，類似 Docker Swarm 的 join token
- **Master IP 查詢**：用 `multipass info` 取得 VM 的 IPv4 地址

**Worker 加入叢集**

- 加入指令和安裝指令相同（都是 `curl -sfL https://get.k3s.io | sh -`）
- 差別在於加入時多設定兩個環境變數：
  - `K3S_URL`：master 的 API Server 地址，格式 `https://<MASTER_IP>:6443`
  - `K3S_TOKEN`：剛才取得的 node-token
- k3s 偵測到這兩個環境變數，自動以 agent（worker）模式安裝，而非 server（master）模式

**驗證三節點**

- 在 master 上執行 `kubectl get nodes`
- 正常狀態：3 個節點，STATUS 全部是 `Ready`
- 剛加入的節點可能短暫顯示 `NotReady`，等 10-30 秒後自動變 Ready（kubelet 啟動、憑證交換需要時間）
- ROLES 欄位：master 顯示 `control-plane,master`，worker 顯示 `<none>`

**把 kubeconfig 複製到本機**

- k3s 的 kubeconfig 預設在 master 的 `/etc/rancher/k3s/k3s.yaml`
- 問題：這個檔案裡的 server IP 寫的是 `127.0.0.1`（master 自己看自己），複製到本機後連不到
- 解法：用 `sed` 把 `127.0.0.1` 替換成 master 的實際 IP
- `KUBECONFIG` 環境變數：告訴 kubectl 要讀哪個 config 檔（預設是 `~/.kube/config`）
- 設定後在本機直接跑 `kubectl get nodes`，不用再 `multipass exec` 進去 master

---

### ② 所有指令＋講解

---

**安裝 Multipass**

```bash
# macOS
brew install multipass

# Windows
choco install multipass

# Linux
sudo snap install multipass
```

- `brew` / `choco` / `snap`：各平台的套件管理工具
- 安裝完畢可驗證：`multipass version`

打完要看：
```
multipass   1.14.0+mac
multipassd  1.14.0+mac
```
版本號依安裝時間不同，只要有輸出就代表安裝成功。

---

**建立 VM**

```bash
multipass launch --name k3s-master --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker1 --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker2 --cpus 2 --memory 2G --disk 10G
```

- `launch`：建立並啟動一台新 VM
- `--name k3s-master`：VM 名稱，之後用這個名字操作這台 VM
- `--cpus 2`：分配 2 顆虛擬 CPU
- `--memory 2G`：分配 2 GB 記憶體
- `--disk 10G`：分配 10 GB 虛擬硬碟

打完要看：
```
Launched: k3s-master
```
每台 VM 建立成功後各出現一行這樣的訊息。第一次執行會先下載 Ubuntu 映像，輸出如：
```
Retrieving image: 45% |████████████          |
```
耐心等待即可。

異常狀況：
- `insufficient memory`：主機實體記憶體不足，把 `--memory` 改成 `1G`
- `Multipass daemon failed to start`：確認 Multipass 有沒有安裝完整，重新安裝

---

**在 master 安裝 k3s**

```bash
multipass exec k3s-master -- bash -c "curl -sfL https://get.k3s.io | sh -"
```

- `multipass exec k3s-master`：在名為 k3s-master 的 VM 裡執行指令
- `--`：分隔符，之後是要在 VM 內執行的指令
- `bash -c "..."`：用 bash 執行後面的字串
- `curl -sfL https://get.k3s.io`：下載 k3s 安裝腳本
  - `-s`：silent，不顯示進度條
  - `-f`：fail silently，HTTP 錯誤時不輸出錯誤頁面
  - `-L`：follow redirects
- `| sh -`：把下載的腳本直接 pipe 給 sh 執行

打完要看：
```
[INFO]  Finding release for channel stable
[INFO]  Using v1.28.x+k3s1 as release
[INFO]  Downloading hash ...
[INFO]  Downloading binary k3s
[INFO]  Verifying binary download
[INFO]  Installing k3s to /usr/local/bin/k3s
...
[INFO]  systemd: Starting k3s
```
最後看到 `systemd: Starting k3s` 就代表安裝並啟動成功。

異常狀況：
- 若網路超時，重跑同一行指令即可（安裝腳本是冪等的）

---

**取得 Join Token**

```bash
TOKEN=$(multipass exec k3s-master -- sudo cat /var/lib/rancher/k3s/server/node-token)
```

- `TOKEN=$(...)`：把括號內指令的輸出存到 shell 變數 `TOKEN`
- `multipass exec k3s-master --`：進入 k3s-master VM
- `sudo cat /var/lib/rancher/k3s/server/node-token`：讀取 token 檔案（需要 root 權限）
  - `/var/lib/rancher/k3s/server/node-token`：k3s 安裝後自動產生的 token 檔案

打完要看：
```bash
echo $TOKEN
```
輸出類似：
```
K10abc123def456::server:789xyz...（一長串隨機字元）
```
如果 `echo $TOKEN` 是空的，代表取得失敗，確認 k3s-master 安裝是否完成。

---

**取得 Master IP**

```bash
MASTER_IP=$(multipass info k3s-master | grep IPv4 | awk '{print $2}')
```

- `multipass info k3s-master`：顯示 k3s-master VM 的詳細資訊
- `grep IPv4`：過濾出包含 IPv4 的那行
- `awk '{print $2}'`：取出第二個欄位（IP 地址本身）
- 結果存到 `MASTER_IP` 變數

打完要看：
```bash
echo $MASTER_IP
```
輸出類似：`192.168.64.3`（實際 IP 依環境不同）

---

**Worker 加入叢集**

```bash
for i in 1 2; do
  multipass exec k3s-worker$i -- bash -c \
    "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$TOKEN sh -"
done
```

- `for i in 1 2; do ... done`：迴圈，依序對 worker1 和 worker2 執行
- `K3S_URL=https://$MASTER_IP:6443`：環境變數，告訴安裝腳本 master 的 API Server 位址
  - `6443`：K8s API Server 的預設 port
- `K3S_TOKEN=$TOKEN`：環境變數，加入叢集的憑證
- k3s 腳本偵測到 `K3S_URL` 就知道要裝 agent 模式（worker），不裝 server 模式

打完要看（每台 worker 各一次）：
```
[INFO]  Finding release for channel stable
[INFO]  Using v1.28.x+k3s1 as release
...
[INFO]  systemd: Starting k3s-agent
```
注意：最後是 `k3s-agent`，而非 master 的 `k3s`，確認 worker 是以 agent 身份加入。

---

**驗證三節點**

```bash
multipass exec k3s-master -- sudo kubectl get nodes
```

- `sudo kubectl get nodes`：在 master 上查看叢集所有節點
- k3s 的 kubectl 需要 sudo 才能讀取 kubeconfig（或指定 `--kubeconfig`）

打完要看：
```
NAME          STATUS   ROLES                  AGE   VERSION
k3s-master    Ready    control-plane,master   5m    v1.28.x+k3s1
k3s-worker1   Ready    <none>                 2m    v1.28.x+k3s1
k3s-worker2   Ready    <none>                 1m    v1.28.x+k3s1
```

欄位說明：
- `NAME`：節點名稱（即 VM 名稱）
- `STATUS`：`Ready` 代表可接受 Pod 調度；`NotReady` 代表 kubelet 尚未準備好
- `ROLES`：`control-plane,master` 是主節點；`<none>` 是 worker 節點
- `AGE`：節點加入叢集的時間
- `VERSION`：該節點的 k3s / K8s 版本

異常狀況：
- 若 worker 顯示 `NotReady`：等待 30 秒再重查，kubelet 啟動和憑證交換需要時間
- 若 worker 沒出現：確認 `K3S_URL` 和 `K3S_TOKEN` 設定是否正確

---

**複製 kubeconfig 到本機**

```bash
# 複製 kubeconfig
multipass exec k3s-master -- sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/k3s-config

# 替換 IP（127.0.0.1 → master 實際 IP）
sed -i "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config

# 設定環境變數，讓 kubectl 使用這個 config
export KUBECONFIG=~/.kube/k3s-config
```

- `/etc/rancher/k3s/k3s.yaml`：k3s 的 kubeconfig 檔案位置，記錄連線資訊（server URL、憑證、token）
- `> ~/.kube/k3s-config`：把輸出重導向到本機的 `~/.kube/k3s-config` 檔案
- `sed -i "s/127.0.0.1/$MASTER_IP/g"`：
  - `-i`：直接修改檔案（in-place）
  - `s/舊值/新值/g`：把所有 `127.0.0.1` 替換成 master 的實際 IP
  - 必須替換，否則本機的 kubectl 會嘗試連自己的 127.0.0.1，而非 VM
- `export KUBECONFIG=~/.kube/k3s-config`：設定環境變數，kubectl 優先讀這個檔案（預設是 `~/.kube/config`）

**最終驗證**

```bash
kubectl get nodes
```

打完要看：
```
NAME          STATUS   ROLES                  AGE   VERSION
k3s-master    Ready    control-plane,master   10m   v1.28.x+k3s1
k3s-worker1   Ready    <none>                 7m    v1.28.x+k3s1
k3s-worker2   Ready    <none>                 6m    v1.28.x+k3s1
```
和剛才在 master 上看到的結果一樣，但這次是在本機直接執行 kubectl，不需要 `multipass exec`。

異常狀況：
- `Unable to connect to the server`：`sed` 替換失敗，確認 `echo $MASTER_IP` 有值
- `certificate signed by unknown authority`：k3s 自簽憑證問題，嘗試加 `--insecure-skip-tls-verify` 或重新複製 kubeconfig

---

**查看 VM 詳細資訊**

```bash
multipass info k3s-master
```

- `info`：顯示指定 VM 的詳細狀態
- 常用欄位：Name、State（Running/Stopped）、IPv4、Memory（已用/總量）、Disk（已用/總量）

打完要看：
```
Name:           k3s-master
State:          Running
IPv4:           192.168.64.3
Release:        Ubuntu 22.04.3 LTS
Image hash:     abc123...
CPU(s):         2
Load:           0.52 0.58 0.47
Disk usage:     2.5GiB out of 9.5GiB
Memory usage:   1.2GiB out of 1.9GiB
Mounts:         --
```

---

### ③ 題目

1. worker 加入叢集時，`K3S_URL` 和 `K3S_TOKEN` 這兩個環境變數各代表什麼？缺少其中一個會發生什麼事？
2. 為什麼把 kubeconfig 複製到本機後，必須用 `sed` 把 `127.0.0.1` 改成 master 的實際 IP？
3. 操作題：執行完整的 k3s 安裝流程後，用 `kubectl get nodes` 驗證叢集狀態，並描述 ROLES 欄位中 master 和 worker 的差異。

---

### ④ 解答

1. `K3S_URL` 告訴安裝腳本 master API Server 的地址（`https://<IP>:6443`），讓 worker 知道要連哪裡；`K3S_TOKEN` 是加入叢集的身分憑證，讓 master 確認這台機器有權限加入。缺少 `K3S_URL` 時腳本會以 server（master）模式安裝；缺少 `K3S_TOKEN` 時 worker 無法通過 master 的認證，加入會失敗。

2. kubeconfig 裡的 `server` 欄位記錄 API Server 地址。k3s 在 master 上產生這個檔案時，預設寫 `127.0.0.1`（因為 master 自己連自己用 localhost）。複製到本機後，本機的 `127.0.0.1` 是自己，不是 master VM，所以 kubectl 會連到本機的 6443 port（根本沒有服務），必須改成 master VM 的實際 IP。

3. master 節點的 ROLES 欄位顯示 `control-plane,master`，代表它是叢集的控制平面，負責管理和調度；worker 節點的 ROLES 顯示 `<none>`，代表純粹是執行 Pod 的工作節點，沒有特殊角色。
