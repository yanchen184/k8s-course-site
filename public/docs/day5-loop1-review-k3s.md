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

---
> 📋 **翻頁** → 下一張：minikube 只有一個 Node — 看不出分散的效果

**minikube 單節點的三大限制**

- **限制 ①：Pod 不會分散到不同 Node**
  - minikube 只有 1 個 Node，所有 Pod 全部擠在同一台機器
  - 用 `kubectl get pods -o wide` 看 NODE 欄位，永遠是同一個名字
  - 感受不到「分散部署」、「高可用」的意義

> **補充說明：分散部署 vs 高可用**
>
> **分散部署（手段）**：把服務部署到不同的機器/資料中心/地區，目的是分散壓力、避免單點故障。例如 3 台 Web Server 分別在台北、東京、美國。
>
> **高可用（目標）**：系統發生故障時能自動切換、持續運作，使用者感知不到中斷。用「幾個九」衡量（99.99% = 四個九 ≈ 每年停機 52 分鐘）。例如 1 台掛了，流量自動導向另一台，使用者完全沒感覺。
>
> 簡單來說：**分散部署是手段，高可用是目標**。minikube 只有 1 個 Node，兩個都做不到——Node 掛了 Pod 全死，沒有第二台可切換，也沒有分散可言。

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

**環境說明**

- 你已經有一台 Ubuntu VM（之前課程用的）→ 這台當 **master**
- 老師提供的 OVF 檔匯入後開出第二台 Ubuntu → 這台當 **worker**
- 兩台都在 VMware 裡跑，網路設定 NAT 或 Host-Only（能互連就好）

**匯入 OVF / 改 hostname**

- VMware 匯入 OVF：File → Open → 選 .ovf 檔 → 開機
- 兩台 VM 的 hostname 要不同，否則 k3s 叢集會認不清楚誰是誰
  - master 叫 `k3s-master`，worker 叫 `k3s-worker`
  - 改完 hostname 要重新登入才生效

**查各台 VM 的 IP**

- 兩台 IP 都要記下來，後面會用到
- 用 `ip addr show` 或 `hostname -I` 查詢

---
> 📋 **翻頁** → 下一張：k3s 安裝實作：VMware 建 VM + 安裝 k3s

**在 master 安裝 k3s server**

- 只要一行 curl 指令，腳本自動處理：下載二進位、設定 systemd service、產生 kubeconfig
- 安裝完後 k3s 服務立即啟動，kubeconfig 自動寫入 `/etc/rancher/k3s/k3s.yaml`

**取得 Join Token 和 Master IP**

- **Token 位置**：`/var/lib/rancher/k3s/server/node-token`（只有 root 可讀）
- **Token 用途**：worker 用來向 master 證明加入權限，類似 Docker Swarm 的 join token

**Worker 加入叢集**

- 在 worker VM 上執行 curl 安裝，但多設定兩個環境變數：
  - `K3S_URL`：master 的 API Server 地址，格式 `https://MASTER_IP:6443`
  - `K3S_TOKEN`：剛才取得的 node-token
- k3s 偵測到這兩個環境變數，自動以 agent（worker）模式安裝

---
> 📋 **翻頁** → 下一張：kubeconfig 設定 + 驗證 Pod 分散

**驗證雙節點**

- 在 master 上執行 `sudo kubectl get nodes`
- 正常狀態：2 個節點，STATUS 全部是 `Ready`
- 剛加入的節點可能短暫顯示 `NotReady`，等 10-30 秒後自動變 Ready

---

### ② 所有指令＋講解

---

**Step 0：匯入 OVF（在 VMware 操作）**

1. VMware → File → Open → 選老師提供的 `.ovf` 檔
2. 設定 VM 名稱（建議 `k3s-worker`），選存放位置
3. 開機，等待開機完成

---

**Step 1：改 hostname**

在 **master VM** 上執行：
```bash
sudo hostnamectl set-hostname k3s-master
```

在 **worker VM** 上執行：
```bash
sudo hostnamectl set-hostname k3s-worker
```

- `hostnamectl set-hostname`：修改系統 hostname，重新登入後生效
- hostname 不同很重要：k3s 用 hostname 識別 node 名稱，兩台一樣會衝突

打完要看：
```bash
hostname
```
輸出 `k3s-master` 或 `k3s-worker` 確認改成功。

---

**Step 2：查各台 IP**

在每台 VM 上執行：
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

或更簡單：
```bash
hostname -I
```

打完要看：
```
192.168.x.x   # 記下這個 IP，master 的 IP 後面要用
```

> 老師提示：兩台 IP 都寫在白板上，學員對照自己的 IP 確認。

---

**Step 3：在 master 安裝 k3s（在 master VM 執行）**

```bash
curl -sfL https://get.k3s.io | sh -
```

- `curl -sfL https://get.k3s.io`：下載 k3s 安裝腳本
  - `-s`：silent，不顯示進度條
  - `-f`：HTTP 錯誤時不輸出錯誤頁面
  - `-L`：follow redirects
- `| sh -`：把下載的腳本直接 pipe 給 sh 執行

打完要看：
```
[INFO]  Finding release for channel stable
[INFO]  Using v1.28.x+k3s1 as release
[INFO]  Downloading binary k3s
[INFO]  Installing k3s to /usr/local/bin/k3s
...
[INFO]  systemd: Starting k3s
```
看到 `systemd: Starting k3s` 就代表安裝並啟動成功。

異常：
- 網路超時 → 重跑同一行指令（安裝腳本是冪等的）

---

**Step 4：取得 Join Token（在 master VM 執行）**

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

- `/var/lib/rancher/k3s/server/node-token`：k3s 安裝後自動產生的 token 檔案（需要 sudo）

打完要看：
```
K10abc123def456::server:789xyz...（一長串隨機字元）
```
把這串 token 複製起來，等一下 worker 要用。

---

**Step 5：Worker 加入叢集（在 worker VM 執行）**

把 `MASTER_IP` 換成剛才查到的 master IP，`TOKEN` 換成剛才複製的 token：

```bash
curl -sfL https://get.k3s.io | \
  K3S_URL=https://MASTER_IP:6443 \
  K3S_TOKEN=你的TOKEN \
  sh -
```

- `K3S_URL=https://MASTER_IP:6443`：告訴腳本 master 的 API Server 位址（port 6443 是 K8s 預設）
- `K3S_TOKEN=...`：加入叢集的憑證
- k3s 腳本偵測到 `K3S_URL` 就自動以 agent（worker）模式安裝

打完要看：
```
[INFO]  systemd: Starting k3s-agent
```
注意最後是 `k3s-agent` 不是 `k3s`，確認 worker 以 agent 身份加入。

---

**Step 6：驗證雙節點（在 master VM 執行）**

```bash
sudo kubectl get nodes
```

打完要看：
```
NAME          STATUS   ROLES                  AGE   VERSION
k3s-master    Ready    control-plane,master   5m    v1.28.x+k3s1
k3s-worker    Ready    <none>                 1m    v1.28.x+k3s1
```

欄位說明：
- `STATUS`：`Ready` 代表可接受 Pod 調度；`NotReady` 代表 kubelet 尚未準備好
- `ROLES`：`control-plane,master` 是主節點；`<none>` 是 worker 節點

異常狀況：
- worker 顯示 `NotReady`：等 30 秒再重查，kubelet 啟動需要時間
- worker 沒出現：確認 Token 和 Master IP 有沒有填錯

---

### ③ 題目

1. worker 加入叢集時，`K3S_URL` 和 `K3S_TOKEN` 這兩個環境變數各代表什麼？缺少其中一個會發生什麼事？
2. 為什麼兩台 VM 的 hostname 必須不同？如果一樣會怎樣？
3. 操作題：執行完整流程後，用 `sudo kubectl get nodes` 驗證叢集狀態，說明 ROLES 欄位中 master 和 worker 的差異。

---

### ④ 解答

1. `K3S_URL` 告訴安裝腳本 master API Server 的地址（`https://IP:6443`），讓 worker 知道要連哪裡；`K3S_TOKEN` 是加入叢集的身分憑證，讓 master 確認這台機器有權限加入。缺少 `K3S_URL` 時腳本會以 server（master）模式安裝，變成又多一台 master；缺少 `K3S_TOKEN` 時 worker 無法通過 master 的認證，加入失敗。

2. k3s 用 hostname 當作 node 名稱在叢集內識別。兩台 hostname 一樣時，第二台加入叢集後 k3s 會認為是同一個 node 重新連線，導致 node 狀態混亂（只顯示一個 node 或互相覆蓋）。

3. master 節點的 ROLES 欄位顯示 `control-plane,master`，代表它是叢集的控制平面，負責管理和調度；worker 節點的 ROLES 顯示 `<none>`，代表純粹是執行 Pod 的工作節點，沒有特殊角色。
