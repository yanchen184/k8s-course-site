import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  image?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  // ============================================================
  // 5-1：第四堂回顧 + 為什麼需要多節點（2 張）
  // ============================================================

  // ── 5-1（1/2）：開場 + 因果鏈回顧 ──
  {
    title: '第五堂：Deployment 進階 — 從單節點到真正的叢集',
    subtitle: '擴縮容 → 滾動更新 → 自我修復 → Labels/Selector',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第四堂因果鏈回顧</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">Docker 扛不住</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Pod</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Service</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Ingress</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">ConfigMap</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Secret</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Volume</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Deployment</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StatefulSet</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">八個概念 → 架構 → YAML → Pod CRUD → 排錯 → Sidecar → kubectl 進階 → 環境變數 → Deployment 初體驗</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">第四堂下半場實作回顧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">學會的技能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">架構</td>
                <td className="py-2">Master 4 元件 + Worker 3 元件，kubectl → API Server</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">YAML</td>
                <td className="py-2">apiVersion / kind / metadata / spec 四欄位</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Pod CRUD</td>
                <td className="py-2">get / describe / logs / exec / delete</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Deployment</td>
                <td className="py-2">replicas:3 跑三個 nginx Pod</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `各位同學大家好，歡迎來到第五堂課。

在正式開始之前，我先幫大家快速回顧一下第四堂課我們走過的路。第四堂課的量很大，我們從頭到尾跑了一整條因果鏈。

一開始我們問的是：Docker 在一台機器上跑得很好，但規模一大就扛不住了，五個問題逼出了 K8s。進到 K8s 之後，第一步要跑容器，學了 Pod。Pod 跑起來了，但 IP 會變、外面連不到，學了 Service。Service 可以連但地址太醜，學了 Ingress。設定寫死在 Image 裡，學了 ConfigMap。密碼不能放 ConfigMap，學了 Secret。容器掛了資料消失，學了 Volume。只有一個 Pod 掛了就停服務，學了 Deployment。資料庫有狀態，學了 StatefulSet。

這八個概念建立了全貌之後，我們換了角度看架構。Master Node 有四個元件，API Server、etcd、Scheduler、Controller Manager。Worker Node 有三個元件，kubelet、kube-proxy、Container Runtime。kubectl 是你跟叢集溝通的橋梁，所有指令都是送給 API Server。

然後我們動手了。先學了 YAML 的四欄位格式，接著建了第一個 Pod，練了 CRUD，學了排錯三板斧：get 看狀態、describe 看 Events、logs 看日誌。下午還學了 Sidecar 多容器模式、kubectl 的進階技巧、用環境變數跑 MySQL。最後一個環節，我們體驗了 Deployment，用 replicas 3 跑了三個 nginx Pod。

[▶ 下一頁]

---
【5-1 學生問答題（回顧提問用）】

Q1. minikube 和 k3s 的關鍵差異是什麼？從「學習多節點行為」的角度說明。
A1. minikube 是單節點，所有 Pod 跑在同一台機器，無法觀察 Pod 分散部署、NodePort 多節點可連、DaemonSet 每 Node 一份等行為。k3s 是真實的多節點叢集，可以完整體驗上述效果，且完全相容 K8s API。

Q2. 請說出 Master Node 四個元件的名稱和各自的職責，各用一句話說明。
A2. 四個元件：
- kube-apiserver：所有操作的唯一入口，kubectl 透過它和叢集溝通
- etcd：叢集的鍵值資料庫，儲存所有資源的期望狀態
- kube-scheduler：決定新 Pod 要調度到哪個 Worker Node
- controller-manager：持續監控實際狀態，確保與期望狀態一致

Q3. 「排錯三板斧」的執行順序是什麼？為什麼要按這個順序？
A3. 順序：get → describe → logs。先用 get 快速看 STATUS，判斷問題大類（Pending/CrashLoop/ImagePull）；再用 describe 看 Events，通常原因直接寫在這裡（如 image pull 失敗、資源不足）；最後才用 logs 看容器內部錯誤，適合 CrashLoopBackOff 這類容器有跑起來但一直掛掉的狀況。`,
  },

  // ── 5-1（2/2）：minikube 的問題 + 為什麼需要多節點 + k3s 介紹 ──
  {
    title: 'minikube 只有一個 Node — 看不出分散的效果',
    subtitle: '三個 Pod 全擠同一台，Node 掛了全死 → 需要多節點',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：minikube 只有一個 Node</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>replicas:3 → 三個 Pod 全擠同一台，<strong className="text-white">共享命運</strong></li>
            <li>Node 掛了 → 三個 Pod 全死，<strong className="text-red-400">無處可搬</strong></li>
            <li>scale 到 5 → 五個全在一台，CPU/記憶體就是上限</li>
            <li>DaemonSet → 只跑一個 Pod，跟 replicas:1 無差別</li>
            <li>NodePort → 只有一個 Node IP，體會不到「連任何 Node 都能進」</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：k3s 多節點叢集</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">比較</th>
                <th className="pb-2 pr-4">minikube</th>
                <th className="pb-2">k3s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">節點數</td>
                <td className="py-2 pr-4 text-red-400">單節點</td>
                <td className="py-2 text-green-400">多節點（真正的叢集）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">用途</td>
                <td className="py-2 pr-4">本機開發測試</td>
                <td className="py-2">開發 / 邊緣 / 生產皆可</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">安裝</td>
                <td className="py-2 pr-4">minikube start</td>
                <td className="py-2">curl 一行搞定</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Pod 分散</td>
                <td className="py-2 pr-4 text-red-400">全擠同一台</td>
                <td className="py-2 text-green-400">自動分散到不同 Node</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">環境方案：VMware + k3s</p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="bg-cyan-900/40 border border-cyan-500/30 px-3 py-2 rounded text-center">
              <p className="text-cyan-400 font-bold">k3s-master</p>
              <p className="text-slate-400 text-xs">2 CPU / 2G RAM</p>
            </div>
            <span className="text-slate-500 text-xl">+</span>
            <div className="bg-cyan-900/40 border border-cyan-500/30 px-3 py-2 rounded text-center">
              <p className="text-cyan-400 font-bold">k3s-worker1</p>
              <p className="text-slate-400 text-xs">2 CPU / 2G RAM</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">VMware 建兩台 Ubuntu 22.04 VM，NAT 網路互通即可</p>
        </div>
      </div>
    ),
    notes: `好，我現在問大家一個問題。第四堂最後那個 Deployment 實驗，你 kubectl get pods -o wide 的時候，三個 Pod 的 NODE 欄位寫的是什麼？

都是同一個，對不對？因為我們用的是 minikube，minikube 就只有一個 Node。三個 Pod 全部擠在同一台機器上。

那我們回想一下，第一支影片講 K8s 解決的五個問題，其中第二個是什麼？機器掛了，上面的容器全死了，K8s 會自動搬到其他機器。但你現在只有一台機器，搬到哪裡？無處可搬。你的三個 Pod 看起來有三個副本，但其實跟只有一個沒差太多。因為它們共享命運，那台 Node 一掛，三個 Pod 全死。

Deployment 的擴縮容也是一樣。你 scale 到 5 個 Pod，5 個全在同一台，那台的 CPU 和記憶體就是上限。你加再多副本也不會多出新的運算資源，因為就只有那一台機器。

還有後面要教的 DaemonSet，它的功能是每個 Node 跑一份。但你只有一個 Node，那 DaemonSet 就只會跑一個 Pod，跟普通 Deployment replicas 1 有什麼差別？看不出來。

NodePort Service 也是，它在每個 Node 上開一個 Port 讓外面連。但你只有一個 Node，只有一個 IP 能連，體會不到「連任何一個 Node 都能進」的效果。

所以結論很明確：如果你要親眼看到排程分散、NodePort 多節點入口、DaemonSet 每節點一份，這一段課程最好用多節點環境。沒有多節點，很多現象只能靠想像，沒辦法現場驗證。

那怎麼辦？如果你只是想在本機做多節點示範，minikube 其實也支援 multi-node。不過這門課後續會改用 k3s，因為它更輕量，也更貼近常見的多 VM 實作環境。我們需要一個真正能跑多節點的 K8s 叢集。

這就要介紹 k3s 了。k3s 是 Rancher Labs 開發的輕量版 Kubernetes。官方對名字的說法是：Kubernetes 這個 10-letter word 可縮寫成 K8s，half as big 的 5-letter word 可寫成 K3s。重點不是「只剩 3 個字母」，而是它保留 Kubernetes API 相容性，同時把安裝和資源占用做得更輕。你之前學的所有 kubectl 指令、所有 YAML 格式，在 k3s 上一樣適用。

k3s 跟 minikube 的常見使用情境不太一樣。minikube 常拿來做本機學習和開發測試；k3s 是一個真正的 K8s 發行版，可以跑多節點，也常見於邊緣運算和輕量化部署。很多 IoT 的場景都用 k3s，因為它資源佔用少，一台樹莓派都跑得動。

那我們的環境方案是這樣的。用 VMware 在你的電腦上開兩台 Ubuntu 虛擬機。這你已經很熟了，就是一般開 VM 的流程。我們開兩台 VM，一台裝 k3s master，一台裝 k3s worker，加入同一個叢集。這樣就有兩個 Node 了。

網路設定用 NAT 就好，兩台 VM 在同一個 VMnet 裡面，互相能 ping 到就行。如果你的電腦記憶體夠大，想開三台也可以，一台 master 兩台 worker，效果更明顯。但兩台就夠用了，重點是看到 Pod 分散在不同 Node。

好，方案確定了，下一支影片我們來動手裝。

[▶ 下一頁]

---
【背景補充：k3s vs Docker Swarm 對照】
| 動作 | Docker Swarm | k3s |
|------|-------------|-----|
| 初始化叢集 | docker swarm init | curl -sfL https://get.k3s.io | sh - |
| 加入節點 | docker swarm join --token ... | K3S_URL=... K3S_TOKEN=... curl ... | sh - |
| 查看節點 | docker node ls | kubectl get nodes |
| 節點 Join Token | docker swarm join-token worker | cat /var/lib/rancher/k3s/server/node-token |

minikube 三大限制（可用來回答學生疑問）：
① Pod 不分散：kubectl get pods -o wide，NODE 欄位永遠同一個名字
② NodePort 只有一個 Node IP，體會不到多節點入口
③ DaemonSet 只跑一個 Pod，看不出「每 Node 一份」效果`,
  },

  // ============================================================
  // 5-2：k3s 安裝實作（3 張）
  // ============================================================

  // ── 5-2（0/3）：踩坑：.bashrc 壞掉 ──
  {
    title: '踩坑：SSH 連進去有一堆錯誤訊息',
    subtitle: 'OVF 匯入的 VM，.bashrc 壞掉 → 一行指令修好',
    section: '5-2：k3s 安裝實作',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：SSH 連進去看到一堆錯誤</p>
          <p className="text-slate-300 text-sm">OVF 匯入的 Ubuntu VM，SSH 連線後出現 .bashrc 相關錯誤訊息</p>
          <p className="text-slate-400 text-xs mt-2">原因：.bashrc 設定檔損壞，每次登入都會觸發</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：從 Windows 直接修，不用進 VM</p>
          <div className="bg-slate-900/50 p-3 rounded text-sm font-mono">
            <p className="text-slate-400"># 在 Windows 本機跑（不用先登入）</p>
            <p className="text-green-400">ssh user@&lt;vm-ip&gt; "mv ~/.bashrc ~/.bashrc.bak"</p>
          </div>
          <p className="text-slate-300 text-sm mt-2">把壞掉的 .bashrc 移走，重新 SSH 就乾淨了</p>
        </div>
      </div>
    ),
    code: `# 在 Windows PowerShell 跑（換成你的 VM IP）
ssh user@192.168.43.130 "mv ~/.bashrc ~/.bashrc.bak"

# 重新 SSH 連進去，沒有錯誤訊息就修好了
ssh user@192.168.43.130`,
    notes: `在開始裝 k3s 之前，先說一個踩坑。

這批 OVF 匯入的 Ubuntu VM，有些同學 SSH 連進去的時候會看到一堆錯誤訊息，跟 .bashrc 有關。.bashrc 是 Linux 每次登入時會自動執行的設定檔，壞掉的話每次登入都會報錯，很煩。

解法很簡單，而且不用先成功登入才能修。你在 Windows 本機的 PowerShell 直接跑這行：

指令：ssh user@192.168.43.130 "mv ~/.bashrc ~/.bashrc.bak"

把你的 VM IP 換進去。這行指令的意思是：SSH 連進去，直接跑 mv 把壞掉的 .bashrc 改名備份，然後就斷線。整個過程不需要你進到 VM 的互動介面。

跑完之後再重新 SSH 連進去，沒有錯誤訊息就修好了。

如果你連線沒有遇到這個問題，跳過這步，直接繼續裝 k3s。

[▶ 下一頁]`,
  },

  // ── 5-2（1/3）：VMware 建 VM + k3s 安裝 ──
  {
    title: 'k3s 安裝實作：VMware 建 VM + 安裝 k3s',
    subtitle: '一行 curl 搞定 master，token + IP 讓 worker 加入',
    section: '5-2：k3s 安裝實作',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 1-3：改名 + 裝 master</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>兩台 VM 各改 hostname（避免 k3s 節點名稱衝突）</li>
            <li>確認 IP → Master 上一行 curl 裝 k3s</li>
            <li><code className="text-green-400">sudo kubectl get nodes</code> → 1 個 Ready</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 4-6：Worker 加入 + 驗證</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>取得 master 的 token + IP</li>
            <li>Worker 用 K3S_URL + K3S_TOKEN 加入叢集</li>
            <li><code className="text-green-400">sudo kubectl get nodes</code> → 兩個 Ready</li>
          </ul>
        </div>
      </div>
    ),
    code: `# ── master VM ──
# Step 1：改 hostname（兩台名字不能一樣）
sudo hostnamectl set-hostname ubuntu-master
sudo reboot

# Step 2：確認 IP
ip addr show | grep "inet " | grep -v 127
# → 記下 192.168.x.x

# Step 3：裝 k3s
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes   # 1 個 Ready

# Step 4：取得 token
sudo cat /var/lib/rancher/k3s/server/node-token
# → 複製這串 token

# ── worker VM ──
# Step 5：改 hostname
sudo hostnamectl set-hostname ubuntu-worker
sudo reboot

# Step 6：加入叢集（換掉 <master-ip> 和 <token>）
curl -sfL https://get.k3s.io | \\
  K3S_URL=https://<master-ip>:6443 \\
  K3S_TOKEN=<token> sh -

# ── 回到 master 驗證 ──
sudo kubectl get nodes   # 兩個 Ready`,
    notes: `好，上一支影片我們說清楚了為什麼需要多節點，這支影片直接動手裝。你對 VMware 操作已經很熟了，所以建 VM 這個部分我快速帶過，重點放在 k3s 的安裝。

進到每台 VM 之前，先做一件重要的事：改電腦名稱。因為兩台 VM 都是從同一個 OVF 匯入的，名字預設一樣。k3s 用電腦名稱來識別節點，名字一樣就會衝突，所以要先改。

先進 master VM，跑：

指令：sudo hostnamectl set-hostname ubuntu-master

然後重開機：

指令：sudo reboot

重開機完成，SSH 重新連進去。再進 worker VM，一樣改名：

指令：sudo hostnamectl set-hostname ubuntu-worker

指令：sudo reboot

兩台都改好之後，先確認 master 的 IP。

指令：ip addr show | grep "inet " | grep -v 127

你會看到一個 192.168 開頭的 IP，把它記下來，等一下 worker 加入要用。

接下來在 master VM 上安裝 k3s。就這一行。

指令：curl -sfL https://get.k3s.io | sh -

就這樣，一行。k3s 就一行 curl，三十秒搞定，所有東西都幫你裝好了。

裝完之後，先驗證一下 master 有沒有裝好。

指令：sudo kubectl get nodes

你應該會看到一個節點 ubuntu-master，狀態是 Ready。目前只有一個節點，因為 worker 還沒加入。

接下來取得 join token。master 裝好之後會產生一個 token，worker 要用這個 token 才能加入叢集。就像俱樂部的會員邀請碼，有碼才能進。

指令：sudo cat /var/lib/rancher/k3s/server/node-token

你會看到一長串字元，把它複製起來。

切換到 worker VM，跑這個指令，把 master-ip 和 token 換成你剛才記下的值。

指令：curl -sfL https://get.k3s.io | K3S_URL=https://<master-ip>:6443 K3S_TOKEN=<token> sh -

等個三十秒左右，worker 就加入了。

回到 master 驗證：

指令：sudo kubectl get nodes

現在你應該看到兩個節點了。ubuntu-master 和 ubuntu-worker，狀態都是 Ready。如果 worker 的狀態還是 NotReady，再等個幾秒，它在做初始化。

看到兩個 Ready，恭喜你，你現在擁有一個真正的多節點 K8s 叢集了。

[▶ 下一頁]

---
【指令講解】

curl -sfL https://get.k3s.io | sh -
- curl：下載 k3s 安裝腳本
  - -s：silent，不顯示進度條
  - -f：fail silently，HTTP 錯誤時不輸出錯誤頁面
  - -L：follow redirects（跟隨 301/302 轉址）
- | sh -：把下載的腳本直接 pipe 給 sh 執行
打完要看：最後一行出現 [INFO]  systemd: Starting k3s 就代表安裝並啟動成功
異常：若網路超時，重跑同一行指令即可（安裝腳本是冪等的）

sudo cat /var/lib/rancher/k3s/server/node-token
- /var/lib/rancher/k3s/server/node-token：k3s 安裝後自動產生的 token 檔案（只有 root 可讀）
- sudo：需要 root 權限才能讀取
打完要看：輸出一長串類似 K10abc123def456::server:789xyz... 的隨機字元
異常：輸出空白 → 確認 k3s 是否安裝完成（sudo kubectl get nodes 看狀態）

curl -sfL https://get.k3s.io | K3S_URL=https://<master-ip>:6443 K3S_TOKEN=<token> sh -
- K3S_URL：環境變數，告訴安裝腳本 master 的 API Server 位址（port 6443 是 K8s API Server 預設 port）
- K3S_TOKEN：環境變數，worker 加入叢集的身分憑證
- k3s 腳本偵測到 K3S_URL 就自動以 agent（worker）模式安裝，而非 server（master）模式
打完要看：最後出現 [INFO]  systemd: Starting k3s-agent（注意是 k3s-agent，不是 k3s）

sudo kubectl get nodes
- 在 master 上查看叢集所有節點（k3s 的 kubectl 需要 sudo 才能讀取 kubeconfig）
打完要看：
  NAME             STATUS   ROLES                  AGE   VERSION
  ubuntu-master    Ready    control-plane,master   5m    v1.28.x+k3s1
  ubuntu-worker    Ready    <none>                 2m    v1.28.x+k3s1
- ROLES 欄位：control-plane,master 是主節點；<none> 是 worker 節點
異常：
- worker 顯示 NotReady → 等待 30 秒再重查，kubelet 啟動和憑證交換需要時間
- worker 沒出現 → 確認 K3S_URL 和 K3S_TOKEN 設定是否正確

【5-2 學生問答題詳解】

Q1. worker 加入叢集時，K3S_URL 和 K3S_TOKEN 這兩個環境變數各代表什麼？缺少其中一個會發生什麼事？
A1. K3S_URL 告訴安裝腳本 master API Server 的地址（https://<IP>:6443），讓 worker 知道要連哪裡；K3S_TOKEN 是加入叢集的身分憑證，讓 master 確認這台機器有權限加入。缺少 K3S_URL 時腳本會以 server（master）模式安裝；缺少 K3S_TOKEN 時 worker 無法通過 master 的認證，加入會失敗。

Q2. 為什麼把 kubeconfig 複製到本機後，必須用 sed 把 127.0.0.1 改成 master 的實際 IP？
A2. kubeconfig 裡的 server 欄位記錄 API Server 地址。k3s 在 master 上產生這個檔案時，預設寫 127.0.0.1（因為 master 自己連自己用 localhost）。複製到本機後，本機的 127.0.0.1 是自己，不是 master VM，所以 kubectl 會連到本機的 6443 port（根本沒有服務），必須改成 master VM 的實際 IP。

Q3. 執行完整的 k3s 安裝流程後，用 kubectl get nodes 驗證叢集狀態，master 和 worker 的 ROLES 欄位有何差異？
A3. master 節點的 ROLES 欄位顯示 control-plane,master，代表它是叢集的控制平面，負責管理和調度；worker 節點的 ROLES 顯示 <none>，代表純粹是執行 Pod 的工作節點，沒有特殊角色。`,
  },

  // ── 5-2（2/2）：kubeconfig 設定 + 部署驗證 Pod 分散 ──
  {
    title: 'kubeconfig 設定 + 驗證 Pod 分散',
    subtitle: '本機 kubectl 直連 k3s → 部署 Deployment → Pod 分散在不同 Node',
    section: '5-2：k3s 安裝實作',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">kubeconfig 設定（本機直接操作叢集）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>複製 k3s.yaml 到本機 ~/.kube/</li>
            <li>把 127.0.0.1 改成 master 實際 IP</li>
            <li>設定 KUBECONFIG 環境變數</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">驗證：Pod 分散了！</p>
          <div className="bg-slate-900/50 p-3 rounded text-sm font-mono">
            <p className="text-slate-400"># kubectl get pods -o wide</p>
            <p className="text-slate-300">NAME                  READY   NODE</p>
            <p className="text-slate-300">my-nginx-xxx-abc      1/1     <span className="text-cyan-400">k3s-master</span></p>
            <p className="text-slate-300">my-nginx-xxx-def      1/1     <span className="text-green-400">k3s-worker1</span></p>
            <p className="text-slate-300">my-nginx-xxx-ghi      1/1     <span className="text-cyan-400">k3s-master</span></p>
          </div>
          <p className="text-slate-400 text-xs mt-2">minikube 時 NODE 全是 minikube；k3s 分散到不同 Node → Deployment 真正的威力</p>
        </div>
      </div>
    ),
    code: `# Step 7：kubeconfig 設定（在 master VM 裡面跑）
sudo cat /etc/rancher/k3s/k3s.yaml
# → 複製整個內容

# 把內容貼到本機 C:\Users\你的名字\.kube\k3s-config
# 把檔案裡的 127.0.0.1 改成 master 的實際 IP

# Windows PowerShell 設定環境變數
$env:KUBECONFIG = "C:\Users\你的名字\.kube\k3s-config"

# 直接在本機 PowerShell 操作
kubectl get nodes    # 兩個 Ready

# 部署 Deployment 驗證分散
kubectl create deployment my-nginx --image=nginx --replicas=3
kubectl get pods -o wide   # 看 NODE 欄位`,
    notes: `第七步，設定 kubeconfig，讓你在本機就能操作叢集，不用每次都進到 master VM 裡面打指令。

先在 master VM 裡面把 kubeconfig 印出來。

指令：sudo cat /etc/rancher/k3s/k3s.yaml

你會看到一大串 YAML，把它整個複製起來。

然後在你的 Windows 本機，用記事本或 VS Code 建一個新檔案，貼進去，存到 C:\Users\你的名字\.kube\k3s-config。如果 .kube 資料夾不存在，建一個就好。

複製出來之後要改一個地方。這個檔案裡面的 server 地址寫的是 127.0.0.1，但你在本機，不是在 master VM 裡面，所以要把 127.0.0.1 改成 master VM 的實際 IP。就是你剛才 ip addr show 看到的那個 192.168 開頭的 IP。

改完之後，在 PowerShell 設定環境變數。

指令：$env:KUBECONFIG = "C:\Users\你的名字\.kube\k3s-config"

現在直接打 kubectl get nodes，不用進 VM 了，直接在本機操作。兩個 Ready 的節點。

好，環境搞定了，來做今天最重要的驗證。我們部署一個 Deployment，然後看 Pod 有沒有分散。

指令：kubectl create deployment my-nginx --image=nginx --replicas=3

等個幾秒，Pod 跑起來之後。

指令：kubectl get pods -o wide

注意看 NODE 那一欄。如果一切順利，你會看到有些 Pod 跑在 master，有些跑在 worker。Pod 分散在不同 Node 上了。

這就是跟 minikube 最大的差別。minikube 的時候 NODE 那欄全部是 minikube，三個 Pod 擠在同一台。現在有了 k3s 多節點，Scheduler 會自動決定 Pod 放哪台，把它們分散開來。

想像一下，如果 worker 掛了，上面的 Pod 會被 K8s 自動搬到 master 上。你的服務不會中斷。這就是多節點的價值，也是 Deployment 真正的威力。

環境準備好了，接下來我們深入 Deployment 的進階功能。第四堂課我們學了 Deployment 的基礎：建立、三層關係、寫 YAML。今天要學三個進階功能：擴縮容、滾動更新、回滾。

[▶ 下一頁]

---
【指令講解】

sudo cat /etc/rancher/k3s/k3s.yaml
- /etc/rancher/k3s/k3s.yaml：k3s 的 kubeconfig 檔案位置，記錄連線資訊（server URL、憑證、token）
- 注意：檔案裡的 server 地址預設是 127.0.0.1，複製到本機後必須改成 master VM 的實際 IP
打完要看：輸出一大段 YAML 內容，找到 server: https://127.0.0.1:6443 這行確認需要替換

sed -i "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config（Linux/macOS 版本）
$env:KUBECONFIG = "C:\Users\你的名字\.kube\k3s-config"（Windows PowerShell）
- KUBECONFIG 環境變數：告訴 kubectl 要讀哪個 config 檔（預設是 ~/.kube/config）
- 設定後在本機直接跑 kubectl get nodes，不需要再 multipass exec 或 SSH 進 VM
打完要看（kubectl get nodes 後）：
  NAME             STATUS   ROLES                  AGE   VERSION
  ubuntu-master    Ready    control-plane,master   10m   v1.28.x+k3s1
  ubuntu-worker    Ready    <none>                 7m    v1.28.x+k3s1
異常：
- Unable to connect to the server → kubeconfig 裡的 IP 沒有改成 master 實際 IP
- certificate signed by unknown authority → 嘗試加 --insecure-skip-tls-verify 或重新複製 kubeconfig

kubectl create deployment my-nginx --image=nginx --replicas=3
- create deployment：命令式建立 Deployment（快速用，正式環境建議用 YAML）
- --image=nginx：使用 nginx 映像（預設拉最新版）
- --replicas=3：建立 3 個 Pod 副本
打完要看：deployment.apps/my-nginx created

kubectl get pods -o wide
- -o wide：顯示更多欄位，包含 IP 和所在 Node
打完要看（重點是 NODE 欄位）：
  NAME                  READY   STATUS    RESTARTS   AGE   IP           NODE
  my-nginx-xxx-abc      1/1     Running   0          2m    10.42.1.5    ubuntu-master
  my-nginx-xxx-def      1/1     Running   0          2m    10.42.2.6    ubuntu-worker
  my-nginx-xxx-ghi      1/1     Running   0          2m    10.42.0.7    ubuntu-master
重點：不同 Pod 的 NODE 欄位顯示不同 Node 名稱 → 這就是分散部署的效果！`,
  },

  // ============================================================
  // 5-3：擴縮容概念（2 張）
  // ============================================================

  // ── 5-3（1/2）：問題 + kubectl scale + 背後機制 ──
  {
    title: '擴縮容概念：流量暴增怎麼辦？',
    subtitle: '三個 Pod 扛一千 QPS → 週年慶一萬 QPS → 加 Pod',
    section: '5-3：擴縮容概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：流量暴增 10 倍，3 個 Pod 扛不住</p>
          <p className="text-slate-300 text-sm">平常 1,000 QPS → 三個 Pod 各處理 ~333 → 綽綽有餘</p>
          <p className="text-slate-300 text-sm">週年慶 10,000 QPS → 回應從 100ms 飆到 5s → 使用者跑了</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：kubectl scale — 一行指令加 Pod</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1">
            <code className="text-green-400 text-sm">kubectl scale deployment my-nginx --replicas=10</code>
          </div>
          <p className="text-slate-300 text-sm mt-2">K8s 自動建 7 個新 Pod，Scheduler 分散到不同 Node</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">背後機制（用第四堂架構串一遍）</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">kubectl scale</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">API Server</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">etcd 寫入</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Controller Manager</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Scheduler 分配</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">kubelet 啟動</span>
          </div>
        </div>
      </div>
    ),
    notes: `上一支影片我們把 k3s 多節點裝好了，也驗證了 Pod 確實分散在不同 Node 上。環境有了，接下來開始深入 Deployment 的進階功能。

先問大家一個問題。你的電商網站平常每秒處理一千個請求，三個 Pod 分工合作，每個 Pod 處理三百多個，綽綽有餘。但是下個月有週年慶促銷活動，你的老闆跟你說，預計流量會是平常的十倍。一秒鐘一萬個請求。三個 Pod 還扛得住嗎？

扛不住。每個 Pod 的處理能力是有上限的，CPU 就那麼多、記憶體就那麼大。三個 Pod 分三千個請求可以，分一萬個就撐爆了。回應時間從一百毫秒飆到五秒，使用者等不了就關掉了，你的營收直接腰斬。

怎麼辦？加 Pod。三個不夠就加到十個，十個不夠加到二十個。每個 Pod 處理的量少了，回應時間就正常了。

在 K8s 裡面，加 Pod 的操作非常簡單。一行指令。

kubectl scale deployment my-nginx --replicas=10

就這樣。Deployment 的副本數從 3 變成 10。K8s 會自動建 7 個新的 Pod，而且 Scheduler 會把它們分散到不同的 Node 上，讓每台機器的負擔均衡。

你可能會問，背後到底發生了什麼事？我們用第四堂學的架構知識來串一遍。

你打 kubectl scale，這個指令送到 API Server。API Server 把 Deployment 的 replicas 從 3 改成 10，寫進 etcd。Controller Manager 一直在監控 etcd 裡的資料，它發現 Deployment 的期望狀態是 10 個 Pod，但現在只有 3 個，差了 7 個。於是 Controller Manager 通知 Scheduler：「我需要 7 個新 Pod，請分配。」Scheduler 看看各個 Node 的資源狀況，k3s-master 的 CPU 用了百分之四十，k3s-worker1 用了百分之三十，那就這台放四個那台放三個。分配好之後，Scheduler 把決定寫回 etcd。各個 Node 上的 kubelet 發現自己被分配了新 Pod，就開始拉 Image、啟動容器。

整個流程跟第四堂講的「建一個 Pod」的流程一模一樣，只是這次一口氣建七個。架構沒變，只是量變了。

[▶ 下一頁]

---
【Deployment 三層結構補充說明】
Deployment → ReplicaSet（自動建立）→ Pod 1 / Pod 2 / Pod 3

- Deployment：管理「期望狀態」（幾個副本、哪個映像）；更新映像時建新 ReplicaSet 做滾動更新；回滾時把舊 RS 重新擴容
- ReplicaSet：維持 Pod 數量等於 replicas 設定值；Pod 少了就補，Pod 多了就刪；通常不直接操作，由 Deployment 代管
- Pod：實際跑容器的最小單位

為什麼需要 ReplicaSet 這一層（可用來回答學生疑問）：
滾動更新時新舊 RS 並存，Deployment 建新 RS（新版本），同時縮小舊 RS（舊版本），保持服務不中斷。如果沒有這層，更新和回滾都必須重新建立 Pod，有停機風險。

【5-3 學生問答題詳解（供老師帶討論）】

Q1. 為什麼 Deployment 需要 ReplicaSet 這一層？如果 Deployment 直接管 Pod，滾動更新時會有什麼問題？
A1. ReplicaSet 讓滾動更新可以新舊並存：更新時 Deployment 建新 RS（新版本映像）並逐步縮小舊 RS，保持服務不中斷。如果沒有 RS 這層，Deployment 直接管 Pod，更新時必須先刪舊 Pod 再建新 Pod，有短暫停機風險；且回滾無法快速實現，因為沒有保存舊版本的 RS 歷史。

Q2. 以下 YAML 有一個錯誤，找出來並說明後果：
  selector.matchLabels: app: web
  template.metadata.labels: app: nginx
A2. 錯誤：selector.matchLabels 是 app: web，但 template.metadata.labels 是 app: nginx，兩者不一致。後果：kubectl apply 會報錯 "selector does not match template labels"，無法建立 Deployment。即便強制通過，ReplicaSet 也永遠找不到 app: web 的 Pod（因為建出來的 Pod 都帶 app: nginx），會無限建新 Pod。

Q3. apiVersion: v1 和 apiVersion: apps/v1 分別對應哪些 K8s 資源？
A3. v1：Pod、Service、ConfigMap、Secret、Namespace。apps/v1：Deployment、ReplicaSet、DaemonSet、StatefulSet。`,
  },

  // ── 5-3（2/3）：縮容 + 水平 vs 垂直 + Docker 對照 + HPA 預告 ──
  {
    title: '縮容 + 水平 vs 垂直擴縮容',
    subtitle: '流量退了 scale 回來 → 省資源省錢',
    section: '5-3：擴縮容概念',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">縮容：流量退了，多的 Pod 砍掉省錢</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1">
            <code className="text-green-400 text-sm">kubectl scale deployment my-nginx --replicas=3</code>
          </div>
          <p className="text-slate-300 text-sm mt-2">你只要說「我要 3 個」，K8s 處理剩下的</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">水平 vs 垂直擴縮容</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">方式</th>
                <th className="pb-2 pr-4">做法</th>
                <th className="pb-2">比喻</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-green-400 font-semibold">水平（Horizontal）</td>
                <td className="py-2 pr-4">加 Pod 數量</td>
                <td className="py-2">多請幾個廚師</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">垂直（Vertical）</td>
                <td className="py-2 pr-4">加 CPU / 記憶體</td>
                <td className="py-2">給廚師更大的鍋</td>
              </tr>
            </tbody>
          </table>
          <p className="text-slate-400 text-xs mt-2">水平擴縮容是 K8s 最常用的方式，無狀態應用幾乎都靠加副本扛流量</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">Docker 對照 + HPA 預告</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Docker Compose：<code className="text-slate-400">docker compose up --scale web=10</code> → 只能單機</li>
            <li>K8s scale：跨 Node 分散，每台機器出一份力 → <strong className="text-white">本質差異</strong></li>
            <li>HPA（第七堂）：CPU 超 70% 自動加 Pod，退了自動縮 → 全自動</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，週年慶結束了，流量退回正常水準。十個 Pod 有七個閒在那裡，CPU 空轉，佔著記憶體不做事。如果你的叢集跑在雲端，多的 Pod 還佔著雲端的運算資源，那是要花錢的。所以你要把多餘的 Pod 縮回來。

kubectl scale deployment my-nginx --replicas=3

K8s 會砍掉多的七個 Pod。砍哪七個？K8s 有自己的策略，會考慮 Pod 的啟動時間、所在 Node 的負載等等。但你不用管這些細節，你只要說「我要 3 個」，K8s 處理剩下的。

這個操作叫做水平擴縮容，英文是 Horizontal Scaling。水平的意思是加減副本的數量，每個副本的規格不變。你不是讓一個 Pod 變得更強，而是讓 Pod 的數量變多。就像餐廳生意太好，你不是讓一個廚師變成超人，而是多請幾個廚師。每個廚師的能力一樣，但人多力量大。

另一種擴容方式叫垂直擴縮容，Vertical Scaling。垂直的意思是加大單個 Pod 的 CPU 和記憶體。就像給廚師更大的鍋子和更強的爐灶。但垂直擴容有上限，一台機器的 CPU 就那麼多，你不可能無限加。而且改 CPU 和記憶體通常需要重啟 Pod。水平擴縮容沒有這個問題，理論上你可以加到幾百個副本，只要你的叢集有足夠的 Node 和資源。

所以在 K8s 裡面，水平擴縮容是最常用的。大部分的無狀態應用，API、前端、微服務，都是靠加副本來扛流量。

對照一下 Docker。Docker Compose 也可以做擴容，docker compose up --scale web=10，但它只能在一台機器上加容器。那台機器的 CPU 和記憶體是上限，加再多容器也沒用。K8s 的 scale 是跨 Node 的，Pod 分散在不同機器上，每台機器都出一份力。這是本質的差異。

最後預告一下。你可能想說，流量暴增的時候我怎麼知道？難道我要二十四小時盯著螢幕看流量圖表，手動打 scale 指令嗎？不用。K8s 有一個功能叫 HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。你設定一個規則，比如 CPU 使用率超過百分之七十就自動加 Pod，降到百分之三十就自動縮。連 scale 指令都不用打，K8s 全自動。第七堂課會詳細講。今天我們先學手動 scale，理解原理。

好，概念講完了，下一支影片我們來動手操作。

[▶ 下一頁]`,
  },

  // ── 5-3（3/3）：Labels / Selector 概念 ──
  {
    title: 'Labels 與 Selector：K8s 資源關聯的核心',
    subtitle: 'Deployment 怎麼認領 Pod？靠 selector 找 label',
    section: '5-3：擴縮容概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Labels（標籤）是什麼</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>附加在 K8s 資源上的 <code className="text-green-400">key=value</code> 鍵值對，完全自訂</li>
            <li>同一資源可以有多個 label，label 本身不影響功能</li>
            <li>真正發揮作用要靠 <strong className="text-white">Selector</strong> 來篩選</li>
          </ul>
          <table className="w-full text-sm mt-3">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-4">常見 Key</th>
                <th className="pb-1">範例</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700"><td className="py-1 pr-4 text-green-400">app</td><td className="py-1">app=nginx</td></tr>
              <tr className="border-t border-slate-700"><td className="py-1 pr-4 text-green-400">env</td><td className="py-1">env=prod / env=staging</td></tr>
              <tr className="border-t border-slate-700"><td className="py-1 pr-4 text-green-400">tier</td><td className="py-1">tier=frontend / tier=backend</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Deployment YAML 的三處 Labels（重點！）</p>
          <div className="bg-slate-900/50 p-3 rounded text-xs font-mono space-y-0.5">
            <div className="text-slate-300">metadata:</div>
            <div className="text-slate-300 pl-4">labels:</div>
            <div className="pl-8"><span className="text-blue-300">app: nginx</span>  <span className="text-slate-500"># ① Deployment 自己的 label</span></div>
            <div className="text-slate-300">spec:</div>
            <div className="text-slate-300 pl-4">selector:</div>
            <div className="text-slate-300 pl-6">matchLabels:</div>
            <div className="pl-10"><span className="text-yellow-300">app: nginx</span>  <span className="text-slate-500"># ② selector（認領條件）</span></div>
            <div className="text-slate-300 pl-4">template:</div>
            <div className="text-slate-300 pl-6">metadata:</div>
            <div className="text-slate-300 pl-8">labels:</div>
            <div className="pl-12"><span className="text-red-300">app: nginx</span>  <span className="text-slate-500"># ③ Pod 的 label（必須跟 ② 一致！）</span></div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">最常踩的坑</p>
          <p className="text-slate-300 text-sm">② selector 和 ③ Pod template labels <strong className="text-white">必須完全一致</strong>，否則 Deployment 永遠找不到自己的 Pod → 一直瘋狂補新 Pod</p>
        </div>
      </div>
    ),
    notes: `在繼續實作之前，我要先教一個概念，Labels 和 Selector。這個概念非常重要，後面的 Service、DaemonSet 都會用到，而且是最常踩坑的地方之一。

Labels 是標籤，就是你貼在 K8s 資源上的 key=value 格式的標記。比如 app=nginx，env=prod，tier=backend。完全自訂，K8s 不限制你用什麼 key 或 value，只要是合法字串就好。

Selector 是選擇器，用 label 條件來篩選出一群資源。Deployment 用 selector 來認領「哪些 Pod 是我管的」。

在 Deployment 的 YAML 裡，Labels 出現在三個地方。

第一個是 metadata.labels，這是 Deployment 本身的 label，給別人來選這個 Deployment 用的。

第二個是 spec.selector.matchLabels，這是 Deployment 的選擇條件，它用這個條件去找它的 Pod。

第三個是 spec.template.metadata.labels，這是 Pod 的 label，Pod 建出來之後會帶上這個標籤。

現在最關鍵的一點：② 和 ③ 必須完全一致。如果 selector 說我要找 app=nginx，但 Pod template 的 label 是 app=website，那 Deployment 的 selector 永遠找不到自己建出來的 Pod，它以為一個 Pod 都沒有，就一直補一直補，Pod 數量失控。

這是一個很常見的 bug，等一下學員實作我們就會來練習找這個問題。

[▶ 下一頁]

---
【三處 Labels 的關係（補充記憶口訣）】

① metadata.labels（Deployment 自己的 label）→ 給外部（例如 Service）選這個 Deployment 用
② spec.selector.matchLabels（認領條件）→ Deployment 用這個條件找「自己的 Pod」
③ spec.template.metadata.labels（Pod 的 label）→ 建出來的 Pod 會帶這個標籤

關鍵規則：② 和 ③ 必須完全一致，Deployment 才能「認領」自己建出來的 Pod
① 可以和 ②③ 不同，它是讓外部選這個 Deployment 本身用的

② ③ 不一致的後果：Deployment 找不到自己的 Pod，誤以為數量不夠，一直無限建新 Pod

常見 Label 慣例（不強制，但建議遵守）：
- app: nginx/api（應用程式名稱）
- env: prod/staging（環境）
- version: v1.28（版本號）
- tier: frontend/backend（層級）`,
  },

  // ============================================================
  // 5-4：擴縮容實作（1 張操作 + 1 張學員實作）
  // ============================================================

  // ── 5-4（1/2）：擴縮容實作示範 ──
  {
    title: '擴縮容實作：scale 3 → 5 → 2',
    subtitle: 'kubectl scale + get pods -o wide 觀察分散',
    section: '5-4：擴縮容實作',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>清掉舊 Deployment，重新建 replicas:3</li>
            <li><code className="text-green-400">kubectl get pods -o wide</code> → 看 NODE 分散</li>
            <li><code className="text-green-400">kubectl scale --replicas=5</code> → 新 Pod 出現 + 分散</li>
            <li><code className="text-green-400">kubectl scale --replicas=2</code> → 多的 Pod Terminating</li>
            <li><code className="text-green-400">kubectl get deploy</code> → READY 欄位變化</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">重點提醒</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>scale 對象是 <strong className="text-white">Deployment</strong>，不是 Pod</li>
            <li><code className="text-green-400">kubectl edit deployment</code> 也能改 replicas，但容易手誤</li>
            <li>生產環境操作越簡單越安全 → 建議用 <code className="text-green-400">kubectl scale</code></li>
          </ul>
        </div>
      </div>
    ),
    code: `# 清掉重建
kubectl delete deployment my-nginx
kubectl create deployment my-nginx --image=nginx --replicas=3

# 看分散
kubectl get pods -o wide
kubectl get deploy         # READY: 3/3

# 擴容到 5
kubectl scale deployment my-nginx --replicas=5
kubectl get pods -o wide   # 新 Pod 出現 + 分散
kubectl get deploy         # READY: 5/5

# 縮容到 2
kubectl scale deployment my-nginx --replicas=2
kubectl get pods           # 三個 Terminating
kubectl get deploy         # READY: 2/2`,
    notes: `好，上一支影片講了擴縮容的概念，這支影片我們直接動手操作。請大家打開終端機，確認你的 k3s 叢集還在跑，kubectl get nodes 看到兩個 Ready 的節點。

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

[▶ 下一頁]

---
【指令講解】

kubectl apply -f nginx-deployment.yaml
- apply：宣告式套用，若資源不存在則建立，若已存在則更新（diff 後套用差異）
- -f nginx-deployment.yaml：指定 YAML 檔案路徑
打完要看：deployment.apps/nginx-deploy created（首次建立）或 configured（更新）

kubectl get deployments（縮寫：kubectl get deploy）
- 列出目前 namespace 所有 Deployment
打完要看：
  NAME           READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deploy   3/3     3            3           30s
欄位說明：
- READY：實際跑起來的 Pod 數 / 期望副本數（3/3 代表全部就緒）
- UP-TO-DATE：已更新到最新版本的 Pod 數量
- AVAILABLE：健康且可接受流量的 Pod 數量
異常：READY 一直是 0/3 → 查 kubectl describe deployment nginx-deploy 看 Events

kubectl get replicasets（縮寫：kubectl get rs）
打完要看：
  NAME                      DESIRED   CURRENT   READY   AGE
  nginx-deploy-7d9f5b8c4d   3         3         3       45s
欄位說明：
- NAME：格式為 <Deployment名稱>-<隨機hash>，hash 由 Pod template 內容決定
- DESIRED / CURRENT / READY：期望數 / 實際已建數 / 健康就緒數
注意：更新映像後會看到兩個 RS，舊的 DESIRED=0，新的 DESIRED=3，這是正常的滾動更新行為

kubectl scale deployment nginx-deploy --replicas=5（擴容）
kubectl scale deployment nginx-deploy --replicas=3（縮容）
- scale deployment <name>：調整指定 Deployment 的副本數
- --replicas=N：設定期望副本數
打完要看：deployment.apps/nginx-deploy scaled
立刻查 kubectl get pods：擴容時看到新 Pod ContainerCreating；縮容時看到多餘 Pod Terminating
異常：'error: deployment not found' → Deployment 名稱打錯，先 kubectl get deploy 確認名稱

kubectl describe deployment nginx-deploy
打完要看（關鍵區塊）：
- Replicas 行：desired=期望、updated=已更新、total=總數、available=可用、unavailable=不可用
- StrategyType: RollingUpdate（預設滾動更新策略）
- Events 區塊：記錄每次 scale 操作，如 Scaled up replica set ... to 5

測試自我修復（刪 Pod 後自動補回）：
kubectl delete pod <pod-name>
打完要看：pod deleted，立刻再 kubectl get pods 會看到新 Pod ContainerCreating → 幾秒後 Running，總數維持 replicas 設定值

【5-4 學生問答題詳解】

Q1. kubectl get pods 後發現 1 個 RESTARTS 是 5，其他是 0，如何排查？
A1. RESTARTS 高代表容器不斷崩潰後被重啟（CrashLoopBackOff）。排查步驟：先 kubectl describe pod <pod-name> 看 Events 和 Last State 的退出碼（Exit Code）；再 kubectl logs <pod-name> 看容器輸出的錯誤訊息；若容器已崩潰，用 kubectl logs <pod-name> --previous 看上一次容器的日誌。

Q2. READY、UP-TO-DATE、AVAILABLE 三個欄位的差異？
A2.
- READY：通過就緒探針（readinessProbe）的 Pod 數 / 期望數，代表真正可接收流量的數量
- UP-TO-DATE：已更新到當前 Deployment 最新模板版本的 Pod 數，更新進行中時這個數字逐步增加
- AVAILABLE：健康且已達到 minReadySeconds 設定時間的 Pod 數（預設 minReadySeconds=0 時等同 READY）

Q3. 操作題：把 nginx-deploy 擴容到 6，確認 Pod 分散
A3. 操作步驟：
  kubectl scale deployment nginx-deploy --replicas=6
  kubectl get pods -o wide
觀察 NODE 欄位，6 個 Pod 應分散到 k3s-master、k3s-worker1 等節點（Scheduler 預設盡量分散）。`,
  },

  // ── 5-4（2/3）：Lab 1 — 你被叫去救火 ──
  {
    title: 'Lab 1：你被叫去救火',
    subtitle: '新入職工程師接手有 bug 的 YAML，找問題、修好、擴容',
    section: '5-4：擴縮容實作',
    duration: '12',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">情境</p>
          <p className="text-slate-300 text-sm">你是新入職的工程師。同事部署了一個 API 服務但設定有問題，你要接手修好。這份 YAML 裡有 <strong className="text-white">兩個 bug</strong>，自己找。</p>
        </div>

        <div className="bg-slate-900/80 p-3 rounded-lg text-xs font-mono leading-5">
          <div><span className="text-purple-400">apiVersion</span><span className="text-slate-300">: apps/v1</span></div>
          <div><span className="text-purple-400">kind</span><span className="text-slate-300">: Deployment</span></div>
          <div><span className="text-purple-400">metadata</span><span className="text-slate-300">:</span></div>
          <div className="pl-4"><span className="text-purple-400">name</span><span className="text-slate-300">: api-service</span></div>
          <div><span className="text-purple-400">spec</span><span className="text-slate-300">:</span></div>
          <div className="pl-4"><span className="text-purple-400">replicas</span><span className="text-slate-300">: </span><span className="text-red-400">1</span></div>
          <div className="pl-4"><span className="text-purple-400">selector</span><span className="text-slate-300">:</span></div>
          <div className="pl-6"><span className="text-purple-400">matchLabels</span><span className="text-slate-300">:</span></div>
          <div className="pl-8"><span className="text-yellow-300">app: api</span></div>
          <div className="pl-4"><span className="text-purple-400">template</span><span className="text-slate-300">:</span></div>
          <div className="pl-6"><span className="text-purple-400">metadata</span><span className="text-slate-300">:</span></div>
          <div className="pl-8"><span className="text-purple-400">labels</span><span className="text-slate-300">:</span></div>
          <div className="pl-10"><span className="text-red-400">app: backend</span></div>
          <div className="pl-6"><span className="text-purple-400">spec</span><span className="text-slate-300">:</span></div>
          <div className="pl-8"><span className="text-purple-400">containers</span><span className="text-slate-300">:</span></div>
          <div className="pl-8"><span className="text-slate-300">- </span><span className="text-purple-400">name</span><span className="text-slate-300">: api</span></div>
          <div className="pl-10"><span className="text-purple-400">image</span><span className="text-slate-300">: nginx:1.25</span></div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">任務</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>把 YAML 存成 <code className="text-green-400">api-service.yaml</code>，apply 到叢集</li>
            <li>觀察發生什麼事（用學過的指令自己查）</li>
            <li>找出兩個 bug，各自說明問題是什麼</li>
            <li>修好 YAML，重新 apply，讓 READY 變成 <strong className="text-white">3/3</strong></li>
            <li>用 <code className="text-green-400">kubectl scale</code> 擴到 <strong className="text-white">5</strong>，確認 Pod 分散在不同 Node</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
          驗收：READY 3/3 → scale 5 → <code className="text-green-400">kubectl get pods -o wide</code> 看 NODE 欄位分散
        </div>
      </div>
    ),
    code: `# ── 把以下內容存成 api-service.yaml ──
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: api
        image: nginx:1.25

# ── Step 1：apply 並觀察 ──
kubectl apply -f api-service.yaml
kubectl get deploy          # 看 READY 欄位
kubectl get pods            # 看 Pod 狀態
kubectl describe deployment api-service

# ── Step 2：修好後重新 apply ──
kubectl apply -f api-service.yaml

# ── Step 3：驗收 + 擴容 ──
kubectl get deploy          # READY: 3/3
kubectl scale deployment api-service --replicas=5
kubectl get pods -o wide    # 確認 NODE 分散`,
    notes: `這是 Lab 1，你被叫去救火。

規則：YAML 裡有兩個 bug，不告訴你在哪裡。你要自己 apply，觀察叢集的反應，再用學過的指令找出問題。

提示方向：想想剛才教的 Labels/Selector 概念，還有老闆對副本數的要求。

做完五個步驟才算完成，記得最後要 scale 到 5 確認 Pod 分散。

有問題舉手。

[▶ 下一頁]

---
【Lab 1 詳解（老師帶講答案用）】

Bug 1：selector / label 不一致
- selector.matchLabels.app = api，但 template.metadata.labels.app = backend
- K8s apply 時會報錯：spec.selector does not match template labels
- 即使繞過 validation，Deployment 找不到自己的 Pod，誤以為副本數不足，一直補新 Pod，數量失控
- 修法：把 template.metadata.labels.app 改成 api（和 selector 一致）

Bug 2：replicas 不足
- replicas: 1，但老闆要求至少 3 個
- 修法：把 replicas 改成 3

修復後的 YAML 關鍵部分：
  spec:
    replicas: 3           # ← Bug 2 修這裡
    selector:
      matchLabels:
        app: api
    template:
      metadata:
        labels:
          app: api        # ← Bug 1 修這裡，和 selector 一致

完整操作步驟：
  kubectl apply -f api-service.yaml     # 修好後重新 apply
  kubectl get deploy                    # 驗收：READY 3/3
  kubectl scale deployment api-service --replicas=5
  kubectl get pods -o wide             # 看 NODE 欄位確認分散
  kubectl delete deployment api-service  # 清理

老師補充說明重點：
- K8s apply 時做 validation，selector 和 template labels 不一致直接報錯，讓學生看 Error 訊息並解讀
- Bug 1 是最常見的 YAML 坑，熟記三處 labels 的關係（① Deployment 自己、② selector、③ Pod template）就能預防
- Bug 2 提醒學生：replicas 不是寫完就不管，要符合實際需求`,
  },

  // ============================================================
  // 5-5：回頭操作 Loop 1（1 張）
  // ============================================================

  {
    title: '回頭操作 Loop 1：擴縮容常見坑',
    subtitle: 'scale 的是 Deployment 不是 Pod、別忘了 -o wide',
    section: '5-5：回頭操作 Loop 1',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做一遍</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get deploy</code> → 確認 Deployment 存在</li>
            <li><code className="text-green-400">kubectl scale deployment my-httpd --replicas=5</code></li>
            <li><code className="text-green-400">kubectl get pods -o wide</code> → 確認分散</li>
            <li><code className="text-green-400">kubectl scale deployment my-httpd --replicas=1</code></li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">兩個常見坑</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">坑</th>
                <th className="pb-2">正確做法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1</td>
                <td className="py-2 pr-4"><code className="text-red-400">kubectl scale pod xxx</code></td>
                <td className="py-2">scale 對象是 <strong className="text-white">Deployment</strong>，Pod 沒有 replicas</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2</td>
                <td className="py-2 pr-4">只用 <code className="text-red-400">kubectl get pods</code></td>
                <td className="py-2">要加 <code className="text-green-400">-o wide</code> 才看得到 NODE 欄位</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">探索建議</p>
          <p className="text-slate-300 text-sm"><code className="text-green-400">kubectl describe deployment my-httpd</code> → Events 區塊會記錄每次 scale 的紀錄</p>
          <p className="text-slate-400 text-xs mt-1">例如：Scaled up replica set my-httpd-xxxxx to 5 / Scaled down ... to 1</p>
        </div>
      </div>
    ),
    notes: `好，時間差不多了，我們來回頭操作一遍，確認大家都做到了。

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

[▶ 下一頁]

---
【5-5 回頭操作：常見坑整理（老師巡堂提示用）】

坑 1：kubectl scale pod <pod-name> → 錯誤，Pod 沒有 replicas 概念
正確做法：kubectl scale deployment <deployment-name> --replicas=N

坑 2：只看 kubectl get pods，沒有加 -o wide
正確做法：kubectl get pods -o wide，NODE 欄位才能確認分散效果

探索指令：
kubectl describe deployment my-httpd
→ 看 Events 區塊，每次 scale 都會記錄一筆，類似：
  Scaled up replica set my-httpd-xxxxx to 5
  Scaled down replica set my-httpd-xxxxx to 1

本節學生角色：獨立練習（老師巡堂）
Lab 設計邏輯：
- Bug 1：selector.matchLabels: app: api vs template.labels: app: backend（READY 永遠 0/3）
- Bug 2：replicas: 1（老闆要求至少 3 個）
- 修好後還要 scale 到 5 確認 Pod 分散

注意：Lab 2「版本事故」在 Loop 3（5-8）做，需要先學 rollout 系列指令。`,
  },

  // ============================================================
  // 5-6：滾動更新 + 回滾概念（2 張）
  // ============================================================

  // ── 5-6（1/2）：問題 + 滾動更新四步驟 ──
  {
    title: '滾動更新概念：版本更新不停機',
    subtitle: 'nginx:1.26 → 1.27，逐步替換，任何時刻都有 Pod 在服務',
    section: '5-6：滾動更新 + 回滾概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：版本更新有空窗期</p>
          <p className="text-slate-300 text-sm">最土的方法：先砍舊 Pod → 再建新 Pod → 中間<strong className="text-red-400">幾秒到幾十秒沒人服務</strong></p>
          <p className="text-slate-400 text-xs mt-1">電商幾秒 = 幾萬損失，金融幾秒 = 交易出錯</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Rolling Update — 逐步替換</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">Step 1</span>
              <span className="text-slate-300">建 1 個 v2 Pod → 3 v1 + 1 v2（四個都接客）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">Step 2</span>
              <span className="text-slate-300">v2 健康 → 砍 1 個 v1 → 2 v1 + 1 v2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">Step 3</span>
              <span className="text-slate-300">再建 v2、砍 v1 → 1 v1 + 2 v2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">Step 4</span>
              <span className="text-slate-300">最後一輪 → 0 v1 + 3 v2 ✅</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">就像接力賽，下一棒跑起來了上一棒才放手</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">背後機制：新舊 ReplicaSet 蹺蹺板</p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="bg-red-900/30 border border-red-500/30 px-3 py-2 rounded text-center">
              <p className="text-red-400 font-bold">舊 RS (v1)</p>
              <p className="text-slate-400 text-xs">3 → 2 → 1 → 0</p>
            </div>
            <span className="text-slate-500 text-xl">⇄</span>
            <div className="bg-green-900/30 border border-green-500/30 px-3 py-2 rounded text-center">
              <p className="text-green-400 font-bold">新 RS (v2)</p>
              <p className="text-slate-400 text-xs">0 → 1 → 2 → 3</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">舊 RS 不刪除（副本歸零），保留給回滾用</p>
        </div>
      </div>
    ),
    notes: `上一個 Loop 我們學了擴縮容，可以根據流量調整 Pod 的數量。但是另一個問題來了。

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

[▶ 下一頁]`,
  },

  // ── 5-6（2/2）：回滾 + 指令總覽 + Docker 對照 ──
  {
    title: '回滾：一行指令退回上一版',
    subtitle: 'rollout undo → 舊 ReplicaSet 重新擴容，預設保留 10 個版本',
    section: '5-6：滾動更新 + 回滾概念',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">回滾原理</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>舊 RS 沒被刪，只是副本歸零 → 回滾 = 把舊 RS 重新擴容</li>
            <li>舊 Image 在本機快取 → 回滾速度極快（通常幾十秒）</li>
            <li><code className="text-green-400">revisionHistoryLimit</code> 預設保留 <strong className="text-white">10</strong> 個版本</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">滾動更新 + 回滾指令總覽</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">操作</th>
                <th className="pb-2">指令</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">觸發滾動更新</td>
                <td className="py-2"><code className="text-green-400">kubectl set image deployment/名稱 容器名=新image</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">看更新進度</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout status deployment/名稱</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">回滾到上一版</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout undo deployment/名稱</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">回滾到指定版本</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout undo --to-revision=N</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">看歷史版本</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout history deployment/名稱</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">Docker 對照</p>
          <p className="text-slate-300 text-sm">Docker / Docker Compose <strong className="text-red-400">沒有</strong>內建滾動更新。<code className="text-slate-400">docker compose up -d</code> = 砍舊建新，中間有空窗。K8s 的滾動更新是生產環境標配。</p>
        </div>
      </div>
    ),
    notes: `那 Deployment 背後是怎麼實現的？記得我們第四堂講的三層關係：Deployment 管 ReplicaSet，ReplicaSet 管 Pod。滾動更新的秘密就在 ReplicaSet 這一層。

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

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-7：滾動更新實作（2 張 + 1 張學員實作）
  // ============================================================

  // ── 5-7（1/2）：滾動更新 + 回滾操作示範 ──
  {
    title: '滾動更新實作：set image + rollout',
    subtitle: 'nginx:1.26 → 1.27 → 看 ReplicaSet → rollout undo 回滾',
    section: '5-7：滾動更新實作',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程（改 YAML → apply）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 <code className="text-green-400">nginx:1.26</code> Deployment, replicas:3</li>
            <li>改 YAML 的 image 從 1.26 → <code className="text-green-400">1.27</code></li>
            <li><code className="text-green-400">kubectl apply -f deployment.yaml</code> 觸發滾動更新</li>
            <li><code className="text-green-400">kubectl rollout status</code> 看更新進度</li>
            <li><code className="text-green-400">kubectl get pods -w</code> 看 Pod 逐步替換（Terminating / ContainerCreating）</li>
            <li><code className="text-green-400">kubectl get rs</code> → 兩個 ReplicaSet（新 3/舊 0）</li>
            <li><code className="text-green-400">kubectl rollout undo</code> → 回到 1.26</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">觀察技巧：兩個終端並排</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>終端 1：<code className="text-cyan-400">kubectl get pods -w</code>（持續觀察 Pod 增減）</p>
            <p>終端 2：改 YAML → <code className="text-cyan-400">kubectl apply -f</code>（觸發更新）</p>
            <p className="text-slate-400 text-xs mt-1">終端 1 會即時顯示：新 Pod Creating → Running，舊 Pod Terminating → 消失</p>
          </div>
        </div>
      </div>
    ),
    code: `# 終端 1（持續觀察）
kubectl get pods -w

# 終端 2（操作）
# 1. 確認版本
kubectl describe deployment my-nginx | grep Image  # nginx:1.26

# 2. 改 YAML image 從 1.26 → 1.27，然後 apply
kubectl apply -f deployment.yaml
kubectl rollout status deployment/my-nginx

# 3. 驗證
kubectl get rs            # 兩個 RS：新版 3/3、舊版 0/0
kubectl describe deployment my-nginx | grep Image  # nginx:1.27

# 4. 回滾
kubectl rollout undo deployment/my-nginx
kubectl rollout status deployment/my-nginx
kubectl describe deployment my-nginx | grep Image  # 回到 1.26

# 5. 看歷史版本
kubectl rollout history deployment/my-nginx

# 補充快捷方式（不用改檔案）
kubectl set image deployment/my-nginx nginx=nginx:1.27`,
    notes: `好，這支影片我們來實際操作滾動更新和回滾。請大家打開終端機。

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

[▶ 下一頁]`,
  },

  // ── 5-7（2/2）：學員實作題目 ──
  {
    title: '學員實作：滾動更新 + 回滾練習',
    subtitle: '必做：完整流程 | 挑戰：故意更新到不存在的版本',
    section: '5-7：滾動更新實作',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">必做題：完整滾動更新 + 回滾流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 <code className="text-green-400">nginx:1.26</code> Deployment, replicas:3</li>
            <li><code className="text-green-400">set image</code> 更新到 <strong className="text-white">1.27</strong></li>
            <li><code className="text-green-400">rollout status</code> 看更新過程</li>
            <li><code className="text-green-400">get rs</code> 確認兩個 ReplicaSet</li>
            <li><code className="text-green-400">rollout undo</code> 回滾</li>
            <li><code className="text-green-400">describe | grep Image</code> 確認回到 1.26</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-3">挑戰題：故意用不存在的版本</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl set image deployment/my-nginx nginx=nginx:99.99</code></li>
            <li><code className="text-green-400">kubectl get pods</code> → 新 Pod 狀態 <code className="text-red-400">ImagePullBackOff</code></li>
            <li>注意：<strong className="text-white">舊 Pod 還活著</strong>（滾動更新的安全機制）</li>
            <li><code className="text-green-400">kubectl rollout undo</code> → 救回來</li>
          </ol>
          <p className="text-slate-400 text-xs mt-2">實際工作常見：打錯 Image tag → rollout undo 一行搞定</p>
        </div>
      </div>
    ),
    code: `# 必做
kubectl create deployment my-nginx --image=nginx:1.26 --replicas=3
kubectl set image deployment/my-nginx nginx=nginx:1.27
kubectl rollout status deployment/my-nginx
kubectl get rs
kubectl rollout undo deployment/my-nginx
kubectl describe deployment my-nginx | grep Image

# 挑戰：故意用不存在的版本
kubectl set image deployment/my-nginx nginx=nginx:99.99
kubectl get pods       # ImagePullBackOff（舊 Pod 還活著）
kubectl rollout undo deployment/my-nginx`,
    notes: `好，接下來是你們的實作時間。螢幕上有兩個題目。

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

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ============================================================
  // 5-8：回頭操作 Loop 2（2 張：帶做 + Lab 2 情境題）
  // ============================================================

  // ── 5-8（1/2）：帶做 + 常見坑 + 上午小結 ──
  {
    title: '回頭操作 Loop 2 + 前兩個 Loop 小結',
    subtitle: 'set image → rollout status → rollout undo 三指令',
    section: '5-8：回頭操作 Loop 2',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做一遍（三個指令）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl set image deployment/my-nginx nginx=nginx:1.27</code></li>
            <li><code className="text-green-400">kubectl rollout status deployment/my-nginx</code></li>
            <li><code className="text-green-400">kubectl rollout undo deployment/my-nginx</code></li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">兩個常見坑</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">坑</th>
                <th className="pb-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1</td>
                <td className="py-2 pr-4">set image 搞混容器名</td>
                <td className="py-2">等號前是<strong className="text-white">容器名</strong>，不是 Deployment 名</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2</td>
                <td className="py-2 pr-4">rollout undo 以為回初始版</td>
                <td className="py-2">undo = 回<strong className="text-white">上一版</strong>，要指定版本用 --to-revision</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">前兩個 Loop 因果鏈</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">minikube 只有 1 Node</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">k3s 多節點</span>
            <span className="text-slate-500">→</span>
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">流量暴增</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">擴縮容</span>
            <span className="text-slate-500">→</span>
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">版本更新</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">滾動更新+回滾</span>
          </div>
        </div>
      </div>
    ),
    notes: `好，時間到了，我們來回頭操作，然後做上午總結。

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

第一件事，搭建 k3s 多節點環境。minikube 只有一個 Node，看不到 Pod 分散的效果。我們用 VMware 開了兩台 VM，裝了 k3s，一台 master 一台 worker。驗證了 Pod 確實分散在不同 Node 上。

第二件事，學了 Deployment 的擴縮容。流量來了 kubectl scale 加 Pod，流量退了 scale 縮回來。一行指令，Pod 自動分散到不同 Node。背後是 Controller Manager 偵測差異、Scheduler 分配 Node、kubelet 啟動容器。

第三件事，學了滾動更新和回滾。kubectl set image 觸發更新，Deployment 逐步替換舊 Pod 為新 Pod，零停機。背後是新舊 ReplicaSet 的蹺蹺板。萬一新版有問題，kubectl rollout undo 一行指令回到上一版。

三件事串起來就是一條因果鏈。只有一個 Node 看不到分散的效果，所以裝了 k3s 多節點。多節點之後流量來了要加 Pod，所以學了擴縮容。Pod 數量會調了，但版本也要更新，所以學了滾動更新。新版可能有問題，所以學了回滾。每一步都是上一步沒解決的問題。

[▶ 下一頁]`,
  },

  // ── 5-8（2/2）：Lab 2 — 版本事故（深夜 11 點）──
  {
    title: 'Lab 2：版本事故（深夜 11 點）',
    subtitle: '有人推了壞版本，服務正在掛掉，不准用 rollout undo 不帶參數',
    section: '5-8：回頭操作 Loop 2',
    duration: '15',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">情境</p>
          <p className="text-slate-300 text-sm">深夜 11 點，你收到警報。有人把 API 更新到壞掉的版本，服務正在掛掉。不准用 <code className="text-red-400">rollout undo</code> 不帶參數，你要找到正確版本精確回滾。</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">準備環境（依序執行）</p>
          <div className="text-xs font-mono space-y-1">
            <div><span className="text-green-400">kubectl create deployment</span> night-api --image=<span className="text-cyan-300">httpd:2.4</span> --replicas=2</div>
            <div><span className="text-green-400">kubectl annotate deployment</span> night-api kubernetes.io/change-cause=<span className="text-cyan-300">"v1: 正常版本"</span></div>
            <div><span className="text-green-400">kubectl rollout status</span> deployment/night-api</div>
            <div><span className="text-green-400">kubectl set image</span> deployment/night-api httpd=<span className="text-cyan-300">httpd:99.99.99</span></div>
            <div><span className="text-green-400">kubectl annotate deployment</span> night-api kubernetes.io/change-cause=<span className="text-cyan-300">"v2: 緊急更新（錯誤版本）"</span> --overwrite</div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">任務（不給指令提示，自己想）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認目前 Pod 壞掉的狀態</li>
            <li>查部署歷史，找到哪個版本是正常的 <code className="text-cyan-300">httpd:2.4</code></li>
            <li>回滾到那個版本（<strong className="text-red-400">不准用</strong> <code className="text-red-400">rollout undo</code> 不帶參數）</li>
            <li>驗證 Pod 全部 Running，確認現在跑的是 <code className="text-cyan-300">httpd:2.4</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
          驗收：<code className="text-green-400">kubectl get pods</code> 全 Running ｜ 說出你用哪個指令確認 image 版本
        </div>
      </div>
    ),
    code: `# 準備環境（照順序貼上執行）
kubectl create deployment night-api --image=httpd:2.4 --replicas=2
kubectl annotate deployment night-api kubernetes.io/change-cause="v1: 正常版本"
kubectl rollout status deployment/night-api
kubectl set image deployment/night-api httpd=httpd:99.99.99
kubectl annotate deployment night-api kubernetes.io/change-cause="v2: 緊急更新（錯誤版本）" --overwrite

# 你的任務從這裡開始（自己找指令）
# 清理
kubectl delete deployment night-api`,
    notes: `這是 Lab 2，版本事故。

這個 Lab 不給指令提示，只有任務說明。你要用剛才教的 rollout history 和 --to-revision 解決問題。

規則：不能用 rollout undo 不帶參數。為什麼？因為不帶參數的 undo 只會往「上一版」走。這裡只有兩個 revision，undo 剛好回得去。但如果有四個 revision 而你已經 undo 過一次，再 undo 就又跳回來了，永遠在最後兩版之間來回。帶 --to-revision 才能精確。

準備環境那五行先照順序跑，等 Pod 壞掉之後再開始任務。

有問題舉手。

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-9：自我修復 + Labels/Selector 概念（2 張）
  // ============================================================

  // ── 5-9（1/2）：自我修復原理 + 多節點震撼 ──
  {
    title: '自我修復：Pod 掛了，K8s 自動補回來',
    subtitle: 'Controller Manager 持續監控 → 期望 3 個只剩 2 個 → 補 1 個',
    section: '5-9：自我修復 + Labels/Selector',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：Pod 掛了怎麼辦？</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>程式 bug → 記憶體洩漏 → Pod 掛了</li>
            <li>Node 整台死機 → 上面的 Pod 全死</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：宣告式管理 — 自動修復</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">1</span>
              <span className="text-slate-300">Controller Manager 持續監控：期望 3 vs 實際 2 → 差 1 個</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">2</span>
              <span className="text-slate-300">通知 Scheduler → 找有空位的 Node</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">3</span>
              <span className="text-slate-300">kubelet 在該 Node 啟動新 Pod → 幾秒鐘恢復</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">多節點更震撼</p>
          <p className="text-slate-300 text-sm">Node 2 掛了 → kubelet 停止心跳 → ~40s 後判定 NotReady → Pod 被調度到 Node 1 / Node 3 重建</p>
          <p className="text-slate-400 text-xs mt-1">整台機器掛了，服務不受影響 — 這就是多節點的真正威力</p>
        </div>
      </div>
    ),
    notes: `上午我們花了兩個 Loop 學了擴縮容和滾動更新。擴縮容讓你可以根據流量動態調整副本數，滾動更新讓你換版本的時候不用停機。這兩個功能加在一起，Deployment 已經非常強大了。

但是我要問大家一個問題：Pod 掛了，真的會自動補回來嗎？

我們之前在擴縮容的時候有做過一個小實驗，刪掉一個 Pod，馬上就看到一個新的出現。但那只是在單節點上做的，而且只刪了一個。今天我們有多節點的 k3s 叢集，我想帶大家做一個更震撼的實驗，讓你真正感受到 K8s 的自我修復能力。

不過在做實驗之前，先來理解自我修復的原理。

還記得第四堂講的 K8s 架構嗎？Master Node 上有一個 Controller Manager。這個 Controller Manager 裡面跑著很多 Controller，其中有一個叫 Deployment Controller。它的工作非常單純：每隔一小段時間就去檢查一下，現在實際跑著的 Pod 數量，跟你在 Deployment 裡面設定的 replicas 數量，是不是一樣的。

假設你設定 replicas 是 3，現在有 3 個 Pod 在跑，一切正常。突然有一個 Pod 掛了，可能是程式 bug 導致記憶體洩漏，可能是容器裡面的主程序意外退出了。Controller Manager 偵測到現在只剩 2 個 Pod 在跑，不符合期望的 3 個，它就會告訴 Scheduler 說「我需要一個新的 Pod」。Scheduler 找一個有空位的 Node，在上面啟動新的 Pod。整個過程你完全不需要介入，通常幾秒鐘就完成了。

這就是我們一直在說的宣告式管理。你告訴 K8s「我要 3 個 Pod」，K8s 就想辦法維持 3 個。不管 Pod 是被你手動刪的、還是自己掛的、還是所在的 Node 整台死機了，K8s 都會幫你補回來。

在多節點的環境裡面，自我修復更震撼。假設你有三個 Node，三個 Pod 分別跑在不同的 Node 上。Node 2 突然掛了，可能是硬碟壞了、可能是 kernel panic、可能是電源線被清潔阿姨踢掉了。Node 2 上面的 Pod 也跟著掛了。K8s 怎麼處理？首先，kubelet 會停止回報心跳，Controller Manager 大約 40 秒之後判定 Node 2 已經 NotReady。然後它會把 Node 2 上面的 Pod 標記為要驅逐，接著 Scheduler 把這些 Pod 調度到還活著的 Node 1 或 Node 3 上重建。整台機器掛了，服務不受影響。這就是為什麼我一直說多節點才能看到 K8s 真正的威力。

[▶ 下一頁]`,
  },

  // ── 5-9（2/2）：Labels + Selector 概念 ──
  {
    title: 'Labels + Selector：K8s 的認親機制',
    subtitle: 'Deployment 靠 Labels 認 Pod，Service 也靠 Labels 認 Pod',
    section: '5-9：自我修復 + Labels/Selector',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Labels = 貼在資源上的標籤</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1 text-sm font-mono">
            <p className="text-slate-300">app: nginx</p>
            <p className="text-slate-300">env: production</p>
            <p className="text-slate-300">team: backend</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">就像超市商品標籤：乳製品、冷藏、特價 — 任意數量的 key:value</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Selector = 用 Labels 篩選資源</p>
          <p className="text-slate-300 text-sm">「給我所有 <code className="text-green-400">app=nginx</code> 的 Pod」→ K8s 找出符合的 Pod</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-3">黃金法則：三者要對上</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">位置</th>
                <th className="pb-2">作用</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Deployment selector</td>
                <td className="py-2">matchLabels: app: nginx → 我要管有這標籤的 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Pod template labels</td>
                <td className="py-2">app: nginx → 建出來的 Pod 帶這標籤</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Service selector</td>
                <td className="py-2">app: nginx → 把流量導到有這標籤的 Pod</td>
              </tr>
            </tbody>
          </table>
          <p className="text-red-400 text-xs mt-2">三個沒對上 = Deployment 認不到 Pod / Service 導不到流量 → 最常見的配對錯誤</p>
        </div>
      </div>
    ),
    code: `# 看 Pod 的 Labels
kubectl get pods --show-labels

# 用 Label 篩選
kubectl get pods -l app=nginx

# 手動加標籤
kubectl label pod <pod-name> env=test

# 看篩選結果
kubectl get pods -l env=test`,
    notes: `好，自我修復的原理搞懂了。但這裡有一個很重要的問題：K8s 怎麼知道哪些 Pod 屬於哪個 Deployment？

你想想看，一個叢集裡面可能有幾十個 Deployment，跑著上百個 Pod。Deployment A 管 nginx 的 Pod，Deployment B 管 API 的 Pod，Deployment C 管前端的 Pod。當一個 nginx 的 Pod 掛了，K8s 怎麼知道要通知哪個 Deployment 去補？是靠名字嗎？不是。Pod 的名字是隨機的，nginx-deploy-abc123-xyz，這個名字每次都不一樣。

答案是 Labels。

Labels 是貼在 K8s 資源上的標籤。每個標籤是一組 key-value，比如 app: nginx、env: production、team: backend。你可以在任何資源上貼任意數量的標籤。它就像超市裡商品上的分類標籤，一瓶牛奶上面可能貼了「乳製品」、「冷藏」、「特價」三個標籤。

Labels 本身沒有什麼神奇的，它就是一組 metadata。真正有用的是 Selector。Selector 是用 Labels 來篩選資源的機制。你說「給我所有 app 等於 nginx 的 Pod」，K8s 就去找所有有 app: nginx 標籤的 Pod 還給你。

回到 Deployment 的 YAML，你還記得裡面有三個地方跟 Labels 有關嗎？

第一個，metadata.labels，這是 Deployment 自己的標籤。就像你的身分證上的名字，用來描述 Deployment 本身。

第二個，spec.selector.matchLabels，這是 Deployment 的選擇器。它告訴 Deployment：「你要管理的 Pod，必須有這些標籤。」比如 matchLabels 寫 app: nginx，Deployment 就只管有 app: nginx 標籤的 Pod。

第三個，spec.template.metadata.labels，這是 Pod 範本的標籤。Deployment 建出來的 Pod 會帶上這些標籤。

這三個地方有一個黃金法則：第二個和第三個的值必須一致。如果 selector 說找 app: nginx，但 template 裡 Pod 的標籤是 app: web，那 Deployment 建出來的 Pod 自己都認不回來，它會以為 Pod 不夠然後一直建新的，陷入死循環。

而且等一下我們要學的 Service 也會用到 Selector。Service 的 selector 也要設成 app: nginx，這樣 Service 才知道要把流量轉給哪些 Pod。所以你要記住：Deployment 的 selector、Pod template 的 labels、Service 的 selector，三者要對上。這是 K8s 裡面最常見的配對錯誤之一。

Labels 和 Selector 在 kubectl 裡面也很好用。kubectl get pods --show-labels 可以看到每個 Pod 的所有標籤。kubectl get pods -l app=nginx 可以用 label 篩選 Pod，只列出有 app=nginx 標籤的。這在 Pod 很多的時候非常方便，你不用一個一個看名字，直接用標籤篩。

好，概念講完了。這個 Label 和 Selector 的機制其實就是 K8s 的「認親機制」。Deployment 靠它認 Pod，Service 靠它認 Pod，後面的 NetworkPolicy、HPA 也靠它。可以說 Labels 和 Selector 是 K8s 裡面最基礎的關聯方式，搞懂了後面很多東西就通了。

接下來我們馬上動手，先做自我修復的實驗，再來玩 Labels。

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-10：自我修復 + Labels 實作（1 張 + 1 張學員實作）
  // ============================================================

  // ── 5-10（1/2）：自我修復實測 + Labels 操作 ──
  {
    title: '自我修復 + Labels 實作',
    subtitle: 'delete Pod 看自動補回 → --show-labels → -l 篩選 → 改標籤造孤兒',
    section: '5-10：自我修復 + Labels 實作',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">自我修復實測</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認 3/3 在跑 → <code className="text-green-400">kubectl get pods -o wide</code></li>
            <li>刪一個 Pod → 馬上 get pods → 新 Pod 出現（AGE 幾秒）</li>
            <li>一次刪兩個 → 幾秒後恢復 3 個 Running</li>
            <li>新 Pod 不一定回原 Node → Scheduler 看哪台空閒</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Labels 操作</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get pods --show-labels</code> → 看 app=nginx 標籤</li>
            <li><code className="text-green-400">kubectl get pods -l app=nginx</code> → 用 label 篩選</li>
            <li><code className="text-green-400">kubectl label pod &lt;name&gt; env=test</code> → 手動加標籤</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">思考題：改掉 app label 會怎樣？</p>
          <p className="text-slate-300 text-sm"><code className="text-green-400">kubectl label pod &lt;name&gt; app=other --overwrite</code></p>
          <p className="text-slate-300 text-sm mt-1">→ 改標籤的 Pod 變<strong className="text-white">孤兒</strong>（還活著但不屬於 Deployment）</p>
          <p className="text-slate-300 text-sm">→ Deployment 發現少一個 → 補新的 → <strong className="text-white">變成 4 個 Pod</strong></p>
        </div>
      </div>
    ),
    code: `# 自我修復
kubectl get pods -o wide
kubectl delete pod <pod-name>
kubectl get pods              # 馬上看到新 Pod

# Labels
kubectl get pods --show-labels
kubectl get pods -l app=nginx
kubectl label pod <pod-name> env=test
kubectl get pods -l env=test

# 挑戰：改 app label 造孤兒
kubectl label pod <pod-name> app=other --overwrite
kubectl get pods              # 4 個 Pod！
kubectl get pods --show-labels # 3 個 app=nginx + 1 個 app=other
kubectl delete pod <orphan>   # 清理孤兒`,
    notes: `好，概念講完了，我們來動手。先確認一下 Deployment 還在跑。

執行 kubectl get deployments，你應該看到 nginx-deploy 的 READY 是 3/3。如果不是，先跑 kubectl apply -f deployment.yaml 把它建起來。

再跑 kubectl get pods -o wide，看到三個 Pod，注意看 NODE 那一欄，三個 Pod 分別跑在哪些 Node 上面。如果你用的是 k3s 多節點叢集，你應該會看到 Pod 分散在不同的 Node 上。這就是 Scheduler 在做的事，它會盡量把 Pod 分開來，避免全部擠在同一台。

好，開始第一個實驗。自我修復。

隨便挑一個 Pod，複製它的名字，然後刪掉它。

kubectl delete pod 加上你複製的 Pod 名字。

刪掉之後馬上跑 kubectl get pods。你會看到還是三個 Pod，但有一個的 AGE 是幾秒鐘，名字也不一樣了。這就是 ReplicaSet 偵測到 Pod 數量從 3 變成 2，立刻補了一個新的。

我們再大膽一點，一次刪兩個。用 kubectl delete pod 把兩個 Pod 的名字都列上去。

馬上 kubectl get pods，你會看到有兩個新的 Pod 正在建立。幾秒鐘之後跑一次 kubectl get pods，三個 Pod 全部 Running，又恢復正常了。

你可以試試用 kubectl get pods -o wide 看一下新 Pod 跑在哪個 Node 上。Scheduler 不一定會放回原來的 Node，它會看哪個 Node 比較空閒就放哪個。

好，自我修復實測完了。接下來玩 Labels。

跑 kubectl get pods --show-labels。

你會在最右邊看到一個 LABELS 欄位，每個 Pod 都有一個 app=nginx 的標籤，還有一個 pod-template-hash 的標籤。app=nginx 是你在 Deployment 的 template 裡定義的，pod-template-hash 是 K8s 自動加的，用來區分不同版本的 ReplicaSet。

現在用 label 來篩選。跑 kubectl get pods -l app=nginx。

你會看到跟 kubectl get pods 一樣的結果，因為目前所有 Pod 都有 app=nginx。但如果你的叢集裡同時跑著其他 Deployment 的 Pod，-l 就很有用了，它只會列出你要的那些。

接下來我們手動幫某個 Pod 加一個標籤。先記下任意一個 Pod 的名字，然後執行 kubectl label pod 加上 Pod 名字 env=test。

再跑 kubectl get pods --show-labels。你會看到那個 Pod 多了一個 env=test 的標籤。其他兩個 Pod 沒有。

用 label 篩選試試看。kubectl get pods -l env=test，只會列出那一個 Pod。kubectl get pods -l app=nginx，還是三個，因為 env=test 是額外加的，不影響原本的 app=nginx。

[▶ 下一頁]`,
  },

  // ── 5-10（2/2）：Lab 3 — 除錯工程師 ──
  {
    title: 'Lab 3：除錯工程師',
    subtitle: '生產環境有 Pod 行為異常，隔離它、調查它、不影響服務',
    section: '5-10：自我修復 + Labels 實作',
    duration: '15',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">情境</p>
          <p className="text-slate-300 text-sm">正式環境跑著 3 個 Pod 的 nginx 服務。你收到報告，<strong className="text-white">其中一個 Pod 行為異常</strong>（回應很慢，但還沒死）。你需要把它「隔離」出來調查，<strong className="text-white">同時不能中斷服務</strong>。</p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1">為什麼用孤兒 Pod 而不是直接刪？</p>
          <table className="w-full text-xs">
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700"><td className="py-1 pr-3 text-red-400">直接刪 Pod</td><td className="py-1">Pod 消失，無法調查根本原因</td></tr>
              <tr className="border-t border-slate-700"><td className="py-1 pr-3 text-red-400">scale 到 1</td><td className="py-1">其他正常 Pod 被砍，服務降容</td></tr>
              <tr className="border-t border-slate-700"><td className="py-1 pr-3 text-green-400">✅ 改 label 孤兒化</td><td className="py-1">Deployment 補新 Pod 繼續服務，舊 Pod 穩定等你查</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">任務</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認目前有 3 個 Pod 在跑（用 <code className="text-green-400">--show-labels</code> 看）</li>
            <li>選一個 Pod，把它的 <code className="text-green-400">app</code> label 改成 <code className="text-green-400">app=isolated</code></li>
            <li>觀察：Pod 總數變幾個？Deployment 的 READY 是什麼？</li>
            <li>對孤兒 Pod 執行 <code className="text-green-400">kubectl describe</code>，找出它的 Node、Events、狀態</li>
            <li>調查完畢，手動刪除孤兒 Pod，確認恢復 3 個 Pod</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
          驗收：能說出孤兒 Pod 在哪個 Node？Events 有什麼？Deployment 為什麼自動補 Pod？
        </div>
      </div>
    ),
    code: `# 準備（如果還沒有 nginx-deploy）
kubectl create deployment nginx-deploy --image=nginx:1.25 --replicas=3

# Step 1：確認 Pod + 看 labels
kubectl get pods --show-labels

# Step 2：選一個 Pod，改它的 app label
kubectl label pod <pod-name> app=isolated --overwrite

# Step 3：觀察
kubectl get pods --show-labels   # 4 個 Pod！
kubectl get deploy               # READY 仍然是 3/3

# Step 4：調查孤兒 Pod
kubectl describe pod <那個 pod-name>

# Step 5：清理
kubectl delete pod <孤兒-pod-name>
kubectl get pods                 # 回到 3 個`,
    notes: `這是 Lab 3，除錯工程師。

先說明這個技巧為什麼在生產環境有價值。Deployment 會一直維持副本數，如果你只是 exec 進去查，Pod 可能被重啟打斷你的調查。如果你 scale 到 1，其他正常 Pod 被砍，用戶受影響。最乾淨的做法是把有問題的 Pod 從 Deployment 「摘出來」，Deployment 自動補一個新的 Pod 繼續服務，問題 Pod 獨立存活讓你慢慢調查。調查完再手動刪掉。

這是真實 K8s 工程師會用的除錯技巧，不是玩具實驗。

好，學員開始做。選哪個 Pod 都可以，步驟照 PPT 上面做。做完能回答三個問題：孤兒 Pod 在哪個 Node？Deployment 的 READY 有沒有變？Events 裡有什麼有趣的東西？

有問題舉手。

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ============================================================
  // 5-11：回頭操作 + 上午總結（1 張）
  // ============================================================

  {
    title: '回頭操作 Loop 3 + 上午總結',
    subtitle: '三個 Loop：擴縮容 → 滾動更新 → 自我修復 + Labels',
    section: '5-11：回頭操作 + 上午總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做一遍</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get deployments</code> → 確認 3/3</li>
            <li><code className="text-green-400">kubectl delete pod &lt;name&gt;</code> → 看自我修復</li>
            <li><code className="text-green-400">kubectl get pods --show-labels</code> → 看標籤</li>
            <li><code className="text-green-400">kubectl get pods -l app=nginx</code> → label 篩選</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">上午三個 Loop 因果鏈總結</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Loop</th>
                <th className="pb-2 pr-4">學了什麼</th>
                <th className="pb-2">核心指令</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">1</td>
                <td className="py-2 pr-4">擴縮容</td>
                <td className="py-2"><code className="text-green-400">kubectl scale</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">2</td>
                <td className="py-2 pr-4">滾動更新 + 回滾</td>
                <td className="py-2"><code className="text-green-400">set image / rollout undo</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">3</td>
                <td className="py-2 pr-4">自我修復 + Labels</td>
                <td className="py-2"><code className="text-green-400">--show-labels / -l</code></td>
              </tr>
            </tbody>
          </table>
          <p className="text-slate-400 text-xs mt-2">三個能力合在一起，Deployment 就是管理無狀態應用的瑞士刀</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">下午預告</p>
          <p className="text-slate-300 text-sm">Pod 跑起來了，Deployment 管得很好 → 但外面的人怎麼連進來？</p>
          <p className="text-slate-300 text-sm">Pod IP 會變、叢集外連不到 → 下午主角：<strong className="text-white">Service</strong></p>
        </div>
      </div>
    ),
    notes: `好，我們來帶大家把剛才的操作走一遍。

先確認 Deployment 在跑，kubectl get deployments，看到 3/3。

接著 delete 一個 Pod，kubectl delete pod 加上 Pod 名字。馬上 kubectl get pods，看到新的 Pod 出現了。

然後看 Labels，kubectl get pods --show-labels。每個 Pod 都有 app=nginx。

用 label 篩選，kubectl get pods -l app=nginx，列出所有 nginx 的 Pod。

如果你剛才有做挑戰題——把 app label 改掉觀察孤兒 Pod——記得把孤兒清掉，kubectl delete pod 加上孤兒的名字。

Labels 和 Selector 最重要的一件事我再強調一次：Deployment 的 selector、Pod template 的 labels、還有待會要學的 Service 的 selector，三者要對上。只要有一個沒對上，不是 Deployment 認不到 Pod，就是 Service 導不到流量。這是新手最容易踩的坑。

好，來做上午的總結。今天上午我們用了三個 Loop，學了 Deployment 的三個核心能力。

Loop 1，擴縮容。kubectl scale 一行指令就能把副本數從 3 改成 5 再改回 2，Pod 自動在多個 Node 之間分散。

Loop 2，滾動更新和回滾。kubectl set image 更新版本，K8s 自動逐步替換，服務不中斷。萬一新版本有問題，kubectl rollout undo 一行指令退回去。

Loop 3，自我修復加 Labels。Pod 掛了 K8s 自動補回來，甚至整台 Node 掛了也能把 Pod 搬到其他 Node 上重建。而 K8s 靠的就是 Labels 和 Selector 這套認親機制，來知道哪些 Pod 屬於哪個 Deployment。

這三個能力合在一起，Deployment 就是你在 K8s 裡面管理無狀態應用的瑞士刀。擴縮容、更新、修復，全部自動化。

但是問題來了。Pod 跑起來了，Deployment 管得很好，可是外面的使用者怎麼連進來？你的 Pod 有 IP 沒錯，但那是叢集內部的 IP，外面的人根本看不到。而且 Pod 的 IP 會變，寫死 IP 連線早晚會斷。

怎麼辦？下午我們就來解決這個問題。下午的主角是 Service。

休息一下，下午見。

[▶ 下一頁]`,
  },
]
