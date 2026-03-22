import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  // ── Slide 1 開場 + 回顧 ───────────────────────────
  {
    title: '第五堂：從單機到叢集',
    subtitle: 'Deployment 與 Service',
    section: '開場',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第四堂我們學了什麼</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-center py-2 w-28">主題</th>
                <th className="text-left py-2">一句話</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">K8s 架構</td>
                <td className="py-2">Master（4 元件）+ Worker（3 元件），kubectl 跟 API Server 說話</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">YAML 四欄位</td>
                <td className="py-2">apiVersion、kind、metadata、spec</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Pod</td>
                <td className="py-2">K8s 最小部署單位，一個 Pod 包一個容器</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">kubectl 五指令</td>
                <td className="py-2">get / describe / logs / exec / delete</td>
              </tr>
              <tr>
                <td className="text-center py-2">排錯流程</td>
                <td className="py-2">get 看狀態 → describe 看 Events → logs 看日誌</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">第四堂的反思問題</p>
          <p className="text-slate-300 text-sm italic">「怎麼讓 K8s 自動維持 3 個 nginx 在跑？Pod 掛了一個，自動補一個新的？」</p>
          <p className="text-cyan-400 font-semibold mt-2">→ 答案就是今天要學的：Deployment</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天的旅程</p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Deployment</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Service</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">DNS</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Namespace</span>
          </div>
        </div>
      </div>
    ),
    notes: `歡迎回來！上一堂課我們正式進入了 Kubernetes 的世界。我們搞懂了 K8s 的架構，Master Node 有 API Server、etcd、Scheduler、Controller Manager 四個元件，Worker Node 有 kubelet、kube-proxy、Container Runtime 三個元件。然後我們動手寫了 Pod 的 YAML，學會了 kubectl 的五個核心指令：get 查看、describe 看細節、logs 看日誌、exec 進容器、delete 刪除。最後我們還練習了排錯：先 get 看狀態，再 describe 看 Events，最後 logs 看日誌。

上一堂課結束的時候，我留了一個反思問題：「怎麼讓 K8s 自動維持 3 個 nginx 在跑？Pod 掛了一個，自動補一個新的？」大家有想到答案嗎？

答案就是今天要學的主角 — Deployment。但光有 Deployment 還不夠，Pod 跑起來了，別人要怎麼連到你的服務？所以我們還要學 Service。用了 Service 之後，你會發現用 IP 連太麻煩了，所以我們還要學 DNS 和服務發現。最後我們會學 Namespace，讓你的 dev 環境和 staging 環境可以隔離開來。

今天的旅程就是：Deployment → Service → DNS → Namespace。

不過在開始之前，我們先來做一件事 — 把你的實驗環境從 minikube 單節點，升級成 k3s 多節點叢集。這樣等一下教到 Deployment 擴容的時候，你會看到 Pod 真的分散跑在不同的 Node 上。`,
    duration: '5',
  },

  // ── Slide 2 多節點環境搭建：k3s 架構圖 ─────────────
  {
    title: '多節點環境搭建：Multipass + k3s',
    subtitle: '從 minikube 單節點升級到 k3s 多節點叢集',
    section: '環境搭建',
    content: (
      <div className="space-y-4">
        {/* k3s 架構圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">k3s 多節點叢集架構</p>
          <div className="flex items-start justify-center gap-3 flex-wrap">
            {/* Master Node */}
            <div className="border-2 border-cyan-500/70 rounded-lg p-3 bg-cyan-900/20 min-w-[160px]">
              <p className="text-cyan-400 text-sm font-bold text-center mb-2">Master Node</p>
              <div className="space-y-1">
                <div className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">API Server</p>
                </div>
                <div className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">etcd</p>
                </div>
                <div className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">Scheduler</p>
                </div>
                <div className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">Controller Manager</p>
                </div>
                <div className="border-t border-cyan-500/30 mt-2 pt-1">
                  <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                    <p className="text-slate-300 text-xs">kubelet</p>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center mt-1">
                    <p className="text-slate-300 text-xs">kube-proxy</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Worker Node 1 */}
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/20 min-w-[140px]">
              <p className="text-green-400 text-sm font-bold text-center mb-2">Worker 1</p>
              <div className="space-y-1">
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">kubelet</p>
                </div>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">kube-proxy</p>
                </div>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">Container Runtime</p>
                </div>
                <div className="border-t border-green-500/30 mt-2 pt-1">
                  <div className="bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded text-center">
                    <p className="text-blue-300 text-xs">Pod</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Worker Node 2 */}
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/20 min-w-[140px]">
              <p className="text-green-400 text-sm font-bold text-center mb-2">Worker 2</p>
              <div className="space-y-1">
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">kubelet</p>
                </div>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">kube-proxy</p>
                </div>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">Container Runtime</p>
                </div>
                <div className="border-t border-green-500/30 mt-2 pt-1">
                  <div className="bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded text-center">
                    <p className="text-blue-300 text-xs">Pod</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">工具介紹</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">工具</th>
                <th className="text-left py-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">k3s</td>
                <td className="py-2">Rancher 開源的輕量版 K8s，安裝只要 30 秒</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Multipass</td>
                <td className="py-2">Canonical 出品，一行指令開 Ubuntu VM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# 1. 安裝 Multipass（根據你的系統）
# macOS:  brew install multipass
# Windows: choco install multipass
# Linux:  sudo snap install multipass

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
  multipass exec k3s-worker$i -- bash -c \\
    "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$TOKEN sh -"
done

# 6. 驗證 — 應該看到 3 個 Ready
multipass exec k3s-master -- sudo kubectl get nodes`,
    notes: `好，在正式進入 Deployment 之前，我們先來升級一下實驗環境。

上一堂課我們用的是 minikube，它很方便、一行指令就能啟動，但有一個很大的限制 — 它只有一個 Node。所有的 Pod 都跑在同一台機器上，你看不到「Pod 分散到不同 Node」的效果。這就像你學 Docker Swarm 但只有一台電腦，怎麼測都是在同一台上面跑，感受不到叢集的威力。

所以今天我們要升級到 k3s。k3s 是什麼？它是 Rancher Labs 開源的一個輕量版 Kubernetes。你可以把它想成「K8s 的精簡版」，功能一樣但安裝超級快、資源佔用也少很多。名字為什麼叫 k3s？因為 K8s 有 8 個字母（K-u-b-e-r-n-e-t-e-s），k3s 只有 3 個字母，代表它砍掉了很多肥肉，但核心功能全部保留。面試的時候如果有人問你知不知道 k3s，你就可以聊兩句了。

那我們要怎麼在你的電腦上跑出 3 台 Node 呢？用 Multipass。Multipass 是 Canonical 出品的工具，Canonical 就是做 Ubuntu 那家公司。它讓你一行指令就能建一台 Ubuntu 虛擬機，比手動裝 VM 快多了。

好，來動手。首先安裝 Multipass。macOS 用 brew install multipass，Windows 用 choco install multipass，Linux 用 snap install multipass。大家根據自己的系統來。

裝好之後，我們建 3 台 VM。用 multipass launch 指令，--name 給它命名，--cpus 2 分配 2 顆 CPU，--memory 2G 分配 2GB 記憶體，--disk 10G 分配 10GB 硬碟。我們建一台 master 和兩台 worker。

VM 建好之後，我們在 master 上安裝 k3s。就一行指令：curl -sfL https://get.k3s.io | sh -。沒了，就這麼簡單。如果你用過 kubeadm 裝過 K8s，你會感動到想哭，因為 kubeadm 要裝一堆前置套件、設定 cgroup driver、處理各種相容性問題。k3s 就一行，30 秒搞定。

裝好 master 之後，我們需要取得兩個東西：join token 和 master 的 IP。Token 是讓 worker 證明「我有權加入這個叢集」的憑證，IP 是讓 worker 知道 master 在哪裡。

拿到 token 和 IP 之後，我們用一個 for 迴圈讓兩台 worker 加入叢集。加入的指令也是 curl -sfL https://get.k3s.io | sh -，只是多了兩個環境變數：K3S_URL 告訴它 master 在哪，K3S_TOKEN 證明你有權限加入。

好，現在來驗證。跑 multipass exec k3s-master -- sudo kubectl get nodes。大家猜猜看，應該會看到幾個 Node？沒錯，3 個。一個 master，兩個 worker，狀態都是 Ready。恭喜你，你現在有一個真正的多節點 K8s 叢集了！`,
    duration: '15',
  },

  // ── Slide 3 痛點：Pod 的脆弱 ─────────────────────
  {
    title: '痛點：Pod 的脆弱',
    subtitle: 'Pod 被刪了就沒了',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">如果這是生產環境的 API...</p>
          <div className="flex items-center gap-2 text-sm text-slate-300 flex-wrap">
            <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-1 rounded">使用者</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded">API Pod</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="text-red-400 font-bold">Pod 掛了</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300 mt-2 flex-wrap">
            <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-1 rounded">使用者</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="text-red-400 font-bold">503 Service Unavailable</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">我們需要什麼？</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-blue-400 font-semibold">自動重建</span> — Pod 掛了，自動再補一個</p>
            <p>2. <span className="text-blue-400 font-semibold">多副本</span> — 不要只跑一個，跑 3 個分散風險</p>
            <p>3. <span className="text-blue-400 font-semibold">版本更新</span> — 換新版本不能停機</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker vs K8s</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">需求</th>
                <th className="text-left py-2">Docker</th>
                <th className="text-left py-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">多副本</td>
                <td className="py-2"><code className="text-xs">docker compose up --scale web=3</code></td>
                <td className="py-2">Deployment <code className="text-xs">replicas: 3</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">自動重啟</td>
                <td className="py-2"><code className="text-xs">--restart always</code>（只管同一台）</td>
                <td className="py-2">Controller Manager 跨 Node 重建</td>
              </tr>
              <tr>
                <td className="py-2">滾動更新</td>
                <td className="py-2">自己寫腳本</td>
                <td className="py-2"><code className="text-xs">kubectl set image</code> 一行搞定</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `kubectl delete pod my-nginx    # 刪掉
kubectl get pods               # 空的，沒人幫你重建`,
    notes: `好，我們先來回顧一個第四堂課的場景。上次我們建了一個 nginx Pod，然後用 kubectl delete pod 把它刪掉了。刪掉之後呢？就真的沒了。kubectl get pods 一看，空空如也，沒有任何人幫你重新建一個。

如果這是你公司的生產環境，跑的是使用者在用的 API 服務，Pod 一掛、使用者就看到 503 Service Unavailable。這顯然不行。

所以我們需要三個東西。第一，自動重建：Pod 掛了，有人自動幫你再補一個新的。第二，多副本：不要只跑一個 Pod，跑 3 個，就算掛了一個，還有 2 個在服務。第三，版本更新：要換新版本的時候，不能整個停掉再換，使用者會斷線。

用 Docker 的經驗來想，多副本你可能會用 docker compose up --scale web=3，但它只能在一台機器上。自動重啟你可能用 --restart always，但如果那台機器整個掛了呢？Docker 幫不了你。滾動更新？Docker Compose 基本做不到，你得自己寫腳本。

在 K8s 裡面，這三個需求全部靠一個東西就搞定了 — Deployment。`,
    duration: '5',
  },

  // ── Slide 4 Deployment 三層關係圖 ─────────────────
  {
    title: 'Deployment 三層關係',
    subtitle: 'Deployment → ReplicaSet → Pod',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        {/* Deployment 三層關係示意圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Deployment → ReplicaSet → Pod</p>
          {/* Deployment 外框 */}
          <div className="border-2 border-cyan-500/70 rounded-lg p-3 bg-cyan-900/10">
            <p className="text-cyan-400 text-sm font-bold mb-2">Deployment <span className="text-slate-400 font-normal">← 你管這個</span></p>
            {/* ReplicaSet 外框 */}
            <div className="border-2 border-blue-500/60 rounded-lg p-3 bg-blue-900/10 ml-2">
              <p className="text-blue-400 text-sm font-bold mb-2">ReplicaSet <span className="text-slate-400 font-normal">← 自動建立，你不用管</span></p>
              {/* Pod x3 分散在不同 Node */}
              <div className="flex gap-3 flex-wrap ml-2">
                <div className="border border-green-500/50 rounded-lg p-2 bg-green-900/20 flex-1 min-w-[100px]">
                  <p className="text-green-500/70 text-[10px] mb-1 text-center">Node 1</p>
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-2 rounded text-center">
                    <p className="text-green-300 text-xs font-semibold">Pod 1</p>
                    <p className="text-slate-400 text-[10px]">nginx:1.27</p>
                  </div>
                </div>
                <div className="border border-green-500/50 rounded-lg p-2 bg-green-900/20 flex-1 min-w-[100px]">
                  <p className="text-green-500/70 text-[10px] mb-1 text-center">Node 2</p>
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-2 rounded text-center">
                    <p className="text-green-300 text-xs font-semibold">Pod 2</p>
                    <p className="text-slate-400 text-[10px]">nginx:1.27</p>
                  </div>
                </div>
                <div className="border border-green-500/50 rounded-lg p-2 bg-green-900/20 flex-1 min-w-[100px]">
                  <p className="text-green-500/70 text-[10px] mb-1 text-center">Node 1</p>
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-2 rounded text-center">
                    <p className="text-green-300 text-xs font-semibold">Pod 3</p>
                    <p className="text-slate-400 text-[10px]">nginx:1.27</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">每一層的職責</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">層級</th>
                <th className="text-left py-2">職責</th>
                <th className="text-center py-2 w-24">你需要管嗎</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Deployment</td>
                <td className="py-2">定義「期望狀態」+ 管滾動更新</td>
                <td className="py-2 text-center text-green-400">需要</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">ReplicaSet</td>
                <td className="py-2">維持 Pod 數量 = 期望數量</td>
                <td className="py-2 text-center text-slate-400">不需要（自動）</td>
              </tr>
              <tr>
                <td className="py-2 text-green-400 font-semibold">Pod</td>
                <td className="py-2">實際跑容器</td>
                <td className="py-2 text-center text-slate-400">不需要（自動）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `來認識 Deployment 的結構。Deployment 有一個三層關係：Deployment 管 ReplicaSet，ReplicaSet 管 Pod。

你作為使用者，只需要管 Deployment 這一層。你告訴 Deployment：「我要 3 個 nginx Pod」，Deployment 就會自動建立一個 ReplicaSet，ReplicaSet 再去建立 3 個 Pod。

那 ReplicaSet 是幹嘛的？它的唯一職責就是：維持 Pod 的數量等於你期望的數量。你說要 3 個，它就確保隨時有 3 個在跑。如果掛了一個只剩 2 個，它就補一個。如果多了一個變成 4 個（不太可能但理論上），它就刪一個。

那為什麼不讓 Deployment 直接管 Pod，中間為什麼要多一個 ReplicaSet？原因是滾動更新。當你更新 image 版本的時候，Deployment 會建立一個新的 ReplicaSet（跑新版本），然後逐步把舊 ReplicaSet 裡的 Pod 縮減、新 ReplicaSet 裡的 Pod 增加，直到全部換完。舊的 ReplicaSet 會保留下來（但 Pod 數量是 0），這樣如果你要回滾，它可以直接把舊的 ReplicaSet 重新擴容。

用 Docker Compose 對照的話，Compose 裡面也有 replicas，但那個只在 Docker Swarm 模式下有效，而且沒有自動修復的能力。K8s 的 Deployment 不只能設定副本數，還能在 Pod 掛掉的時候自動重建，這就是 Controller Manager 在背後幫你做的事。`,
    duration: '10',
  },

  // ── Slide 5 Deployment YAML 拆解 ──────────────────
  {
    title: 'Deployment YAML 拆解',
    subtitle: '跟 Pod YAML 的差異',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照 Pod YAML</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">欄位</th>
                <th className="text-left py-2">Pod YAML</th>
                <th className="text-left py-2">Deployment YAML</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">apiVersion</td>
                <td className="py-2"><code>v1</code></td>
                <td className="py-2"><code>apps/v1</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">kind</td>
                <td className="py-2"><code>Pod</code></td>
                <td className="py-2"><code>Deployment</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">容器定義</td>
                <td className="py-2"><code>spec.containers</code></td>
                <td className="py-2"><code>spec.template.spec.containers</code></td>
              </tr>
              <tr>
                <td className="py-2">多了什麼</td>
                <td className="py-2">沒有</td>
                <td className="py-2"><code>replicas</code> + <code>selector</code> + <code>template</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">三個容易搞混的 labels</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <code>metadata.labels</code> — Deployment 自己的標籤</p>
            <p>2. <code>spec.selector.matchLabels</code> — 用來找 Pod 的選擇器</p>
            <p>3. <code>spec.template.metadata.labels</code> — Pod 的標籤</p>
          </div>
          <p className="text-red-400 font-semibold mt-2 text-sm">→ 第 2 和第 3 的值必須一致，否則 Deployment 找不到自己的 Pod！</p>
        </div>
      </div>
    ),
    code: `apiVersion: apps/v1              # 注意：不是 v1，是 apps/v1
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
        app: nginx               # 要跟 selector 一致！
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80`,
    notes: `好，我們來看 Deployment 的 YAML 怎麼寫。大家打開 deployment.yaml 這個檔案。

首先注意 apiVersion 不是 v1 了，而是 apps/v1。記得上一堂課講過，不同的資源類型用不同的 apiVersion。Pod 和 Service 用 v1，但 Deployment、ReplicaSet 用 apps/v1。

kind: Deployment，我們要建的是 Deployment。

spec 裡面有三個新東西。第一個是 replicas: 3，告訴 K8s 我要維持 3 個 Pod。

第二個是 selector，它定義了 Deployment 用什麼條件來找到屬於自己的 Pod。這裡我們用 matchLabels: app: nginx，意思是「找所有 label 有 app=nginx 的 Pod」。

第三個是 template，這是 Pod 的範本。你仔細看 template 裡面的內容，是不是跟上一堂課寫的 Pod YAML 幾乎一模一樣？有 metadata、有 labels、有 spec、有 containers。差別在於不需要 apiVersion 和 kind，因為 Deployment 已經知道 template 就是用來建 Pod 的。

這裡有一個非常重要的細節：spec.selector.matchLabels 和 spec.template.metadata.labels 的值必須一致。為什麼？因為 Deployment 是靠 selector 來「認領」Pod 的。如果 selector 說找 app: nginx，但 Pod 的 label 是 app: web，Deployment 就找不到自己的 Pod，會一直以為 Pod 不夠然後拼命建新的。

大家可能會覺得這個設計有點囉唆 — 為什麼不自動幫我對齊？這是因為 K8s 的設計哲學是「明確勝於隱式」，所有東西都要你明確寫出來，減少意外。雖然囉唆但出錯的機率比較低。`,
    duration: '10',
  },

  // ── Slide 6 實作：建立 Deployment ──────────────────
  {
    title: '實作：建立 Deployment',
    subtitle: 'Lab 1：第一個 Deployment',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">重點實驗 — 刪掉一個 Pod</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>刪掉 → 馬上補一個新的 → <span className="text-green-400 font-semibold">自我修復！</span></p>
            <p>Pod 變成「刪不掉」的 — 除非你刪 Deployment 本身</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">擴縮容</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Docker Compose</th>
                <th className="text-left py-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr>
                <td className="py-2"><code className="text-xs">docker compose up --scale web=5</code><br /><span className="text-slate-500 text-xs">（僅限單機）</span></td>
                <td className="py-2"><code className="text-xs">kubectl scale deploy --replicas=5</code><br /><span className="text-slate-500 text-xs">（跨 Node 擴容）</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Step 1：部署
kubectl apply -f deployment.yaml

# Step 2：查看三層結構
kubectl get deployments              # Deployment
kubectl get replicasets              # ReplicaSet（自動建立的）
kubectl get pods                     # 3 個 Pod
kubectl get pods -o wide             # 看 Pod 的 IP 和 Node

# Step 3：重點實驗 — 刪掉一個 Pod
kubectl delete pod <任意一個 pod 名字>
kubectl get pods                     # 馬上會看到新的 Pod！

# Step 4：擴縮容
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods                     # 5 個
kubectl scale deployment nginx-deploy --replicas=3
kubectl get pods                     # 回到 3 個`,
    notes: `好，概念講完了，我們馬上來動手。請大家打開終端機，確認 minikube 還在跑。

先部署我們的 Deployment：kubectl apply -f deployment.yaml。看到 deployment.apps/nginx-deploy created，成功了。

現在我們來驗證三層結構。先看 Deployment：kubectl get deployments。你會看到 nginx-deploy，READY 欄位顯示 3/3，表示 3 個副本都準備好了。如果你看到 0/3 或 1/3，表示 Pod 還在建立中，等一下就好了。

再看 ReplicaSet：kubectl get replicasets。你會看到一個名字像 nginx-deploy-xxxxxxx 的 ReplicaSet，它是 Deployment 自動建立的，你完全不需要手動建。DESIRED 和 CURRENT 都是 3。

最後看 Pod：kubectl get pods。你會看到 3 個 Pod，名字的格式是 nginx-deploy-xxxxxxx-xxxxx。前面是 Deployment 的名字，中間是 ReplicaSet 的 hash，最後是 Pod 自己的 random 字串。

好，現在來做最精彩的實驗。隨便挑一個 Pod，把它刪掉：kubectl delete pod nginx-deploy-xxxxxxx-xxxxx。然後馬上 kubectl get pods。大家猜猜看，會看到什麼？

答案是：你還是會看到 3 個 Pod！但仔細看名字，有一個 Pod 的名字跟剛才不一樣，而且 AGE 顯示幾秒鐘。這就是 ReplicaSet 在做的事 — 它偵測到 Pod 數量從 3 變成 2，不符合期望狀態，所以馬上補了一個新的。這就是「自我修復」。

記得上一堂課我們刪掉 Pod 之後，它就真的消失了。現在有了 Deployment，Pod 變成了「刪不掉」的 — 你刪一個，它就補一個。除非你刪的是 Deployment 本身。

接下來試試擴縮容。把副本數從 3 擴到 5：kubectl scale deployment nginx-deploy --replicas=5。再 kubectl get pods，你會看到 5 個 Pod。多出來的 2 個正在建立中。然後縮回 3 個：kubectl scale deployment nginx-deploy --replicas=3。再看一下，多的 Pod 會被刪掉，回到 3 個。

對照一下 Docker Compose，Compose 也可以用 docker compose up --scale web=5 來擴容，但它只能在一台機器上。K8s 的 scale 可以讓 Pod 分散到不同的 Node 上，這在多節點叢集裡是非常大的優勢。`,
    duration: '15',
  },

  // ── Slide 7 滾動更新流程圖 ─────────────────────────
  {
    title: '滾動更新概念',
    subtitle: 'nginx 1.27 → 1.28，零停機',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        {/* 滾動更新流程圖 - 4 步 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">K8s 滾動更新（Rolling Update）</p>
          <div className="space-y-3">
            {/* 初始狀態 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16 text-right shrink-0">初始</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
              </div>
            </div>
            <div className="text-slate-500 text-xs ml-20">▼ 先建一個新的</div>
            {/* 步驟 1 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16 text-right shrink-0">步驟 1</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
              </div>
            </div>
            <div className="text-slate-500 text-xs ml-20">▼ 砍一個舊的，再建一個新的</div>
            {/* 步驟 2 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16 text-right shrink-0">步驟 2</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
              </div>
            </div>
            <div className="text-slate-500 text-xs ml-20">▼ 繼續替換...</div>
            {/* 步驟 3 */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs w-16 text-right shrink-0">步驟 3</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-blue-900/50 border border-blue-500/50 px-2 py-1 rounded text-blue-300 text-xs">v1.27</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
              </div>
            </div>
            <div className="text-slate-500 text-xs ml-20">▼ 全部換完</div>
            {/* 最終 */}
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xs w-16 text-right font-semibold shrink-0">完成</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
                <span className="bg-green-900/50 border border-green-500/50 px-2 py-1 rounded text-green-300 text-xs">v1.28</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">底層原理：兩個 ReplicaSet 的蹺蹺板</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>Deployment</p>
            <p className="ml-4">├── 舊 ReplicaSet（v1.27）: <span className="text-blue-400">3 → 2 → 1 → 0</span></p>
            <p className="ml-4">└── 新 ReplicaSet（v1.28）: <span className="text-green-400">0 → 1 → 2 → 3</span></p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">→ 整個過程服務不中斷！舊 ReplicaSet 保留用於回滾</p>
        </div>
      </div>
    ),
    notes: `接下來我們要講一個 Deployment 最強大的功能 — 滾動更新。

想像一個場景：你的 nginx 現在跑的是 1.27 版，你想更新到 1.28 版。如果沒有 K8s，你怎麼做？最粗暴的方式就是：停掉所有舊版本的容器，然後部署新版本。但這中間有一段時間是沒有任何容器在跑的，使用者就會看到 503 錯誤。在開發環境也許還好，但在生產環境，這是絕對不能接受的。

K8s 的 Deployment 用的是「滾動更新」策略。它不會一次把所有舊 Pod 砍掉，而是一個一個來。先建一個新版本的 Pod，確認它跑起來了，然後砍掉一個舊版本的 Pod。再建一個新的，再砍一個舊的。就這樣逐步替換，直到全部都換成新版本。整個過程中，始終有 Pod 在服務，使用者完全感覺不到更新在進行。

底層的原理是什麼呢？還記得 ReplicaSet 嗎？Deployment 更新的時候，會建立一個新的 ReplicaSet，然後逐步把舊 ReplicaSet 的 Pod 數量從 3 降到 0，同時把新 ReplicaSet 的 Pod 數量從 0 升到 3。就像一個蹺蹺板，一邊下去、一邊上來。

而且舊的 ReplicaSet 不會被刪掉，它只是 Pod 數量變成 0 而已。這是為了回滾預留的 — 如果新版本有 bug，你可以一行指令回到舊版本，K8s 只要把舊 ReplicaSet 重新擴容、新 ReplicaSet 縮減就好了。`,
    duration: '10',
  },

  // ── Slide 8 實作：滾動更新與回滾 ──────────────────
  {
    title: '實作：滾動更新與回滾',
    subtitle: 'Lab 2：更新 image + 故意搞壞 + 回滾',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常用 rollout 指令</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">指令</th>
                <th className="text-left py-2">功能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">kubectl rollout status</code></td>
                <td className="py-2">查看更新進度</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">kubectl rollout history</code></td>
                <td className="py-2">查看歷史版本</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">kubectl rollout undo</code></td>
                <td className="py-2">回滾到上一版</td>
              </tr>
              <tr>
                <td className="py-2"><code className="text-xs">kubectl rollout undo --to-revision=1</code></td>
                <td className="py-2">回滾到指定版本</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">回滾機制在生產環境非常重要 — 半夜發布有 bug 的版本，幾秒鐘內回到穩定版本</p>
        </div>
      </div>
    ),
    code: `# Step 1：更新 image
kubectl set image deployment/nginx-deploy nginx=nginx:1.28

# Step 2：即時觀察
kubectl rollout status deployment/nginx-deploy
# 會看到 Pod 逐步替換的過程

# Step 3：確認
kubectl describe deployment nginx-deploy | grep Image
# 應該看到 nginx:1.28

# Step 4：故意搞壞 — 更新到不存在的 image
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
kubectl get pods                      # 新 Pod 一直 ImagePullBackOff

# Step 5：回滾
kubectl rollout undo deployment/nginx-deploy
kubectl get pods                      # 全部回到正常！`,
    notes: `好，我們來實際操作滾動更新。

首先，確認一下目前的 image 版本：kubectl describe deployment nginx-deploy | grep Image。應該看到 nginx:1.27。好，現在我們把它更新到 nginx:1.28：kubectl set image deployment/nginx-deploy nginx=nginx:1.28。

這個指令的格式是 kubectl set image deployment/<deployment名> <容器名>=<新image>。這裡的 nginx=nginx:1.28，前面那個 nginx 是容器的名字（在 YAML 的 containers.name 定義的），後面是新的 image。

執行之後，馬上用 rollout status 來觀察更新進度：kubectl rollout status deployment/nginx-deploy。你會看到類似這樣的輸出：Waiting for rollout to finish: 1 out of 3 new replicas have been updated... deployment "nginx-deploy" successfully rolled out。看到 successfully rolled out 就表示更新完成了。

好，接下來做一個更有趣的實驗 — 故意搞壞它。我們更新到一個根本不存在的 image 版本：kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9。

然後看 Pod：kubectl get pods。你會看到有幾個 Pod 的狀態是 ImagePullBackOff 或 ErrImagePull。但是注意看，舊版本的 Pod 還活著！K8s 不會把所有舊 Pod 都砍掉才建新的，它是逐步替換的。所以即使新版本有問題，服務也不會完全中斷。

怎麼辦？回滾！一行指令：kubectl rollout undo deployment/nginx-deploy。然後看 Pod：kubectl get pods。太好了，全部都回到 Running 狀態了。K8s 把壞掉的新 Pod 砍掉，重新擴容了之前的 ReplicaSet。

這個回滾機制在生產環境非常重要。半夜發布了一個有 bug 的版本，你可以在幾秒鐘內回到上一個穩定版本，不需要重新 build、重新部署。`,
    duration: '15',
  },

  // ── Slide 9 Deployment 小結 ────────────────────────
  {
    title: 'Deployment 小結',
    subtitle: '三件事 + 六個指令',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Deployment 三件事</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-green-400 font-semibold">維持副本數</span> — 你說 3 個，它就永遠保持 3 個</p>
            <p>2. <span className="text-green-400 font-semibold">滾動更新</span> — 不停機地換新版本</p>
            <p>3. <span className="text-green-400 font-semibold">一鍵回滾</span> — 新版本有 bug？秒回舊版本</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm">→ 生產環境幾乎不會直接用 Pod，都是用 Deployment</p>
        </div>
      </div>
    ),
    code: `kubectl apply -f deployment.yaml            # 建立 / 更新
kubectl get deploy                           # 查看
kubectl scale deploy <name> --replicas=N     # 擴縮容
kubectl set image deploy/<name> <c>=<image>  # 更新版本
kubectl rollout status deploy/<name>         # 看更新進度
kubectl rollout undo deploy/<name>           # 回滾`,
    notes: `好，我們來總結一下 Deployment 的三個核心功能。

第一，維持副本數。你告訴它要 3 個 Pod，它就永遠幫你保持 3 個。Pod 掛了自動重建，你想擴容一行 scale 指令。

第二，滾動更新。更新 image 版本的時候，K8s 會逐步替換，整個過程服務不中斷。

第三，一鍵回滾。新版本有問題？rollout undo 一行指令，秒回上一個穩定版本。

螢幕上列了常用的六個指令，大家記下來。

有一個重要的觀念要記住：在生產環境中，你幾乎不會直接建 Pod。所有的應用程式都是用 Deployment 來管理的。直接建 Pod 就像你用 Docker 的時候不寫 Compose 檔案、純用 docker run 一樣 — 不是不行，但很原始。

好，Deployment 搞定了。但現在有一個問題：3 個 Pod 跑起來了，它們各自有自己的 IP。但這些 IP 是叢集內部的，外面連不到。而且 Pod 隨時可能被砍掉重建，IP 就會變。那別人要怎麼穩定地連到你的服務？

這就是接下來要講的 Service。`,
    duration: '3',
  },

  // ── Slide 10 痛點：Pod IP 的問題 ───────────────────
  {
    title: '痛點：Pod IP 的問題',
    subtitle: 'IP 會變 + 多個 Pod 該連哪一個',
    section: 'Service',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題 1：IP 會變</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>Pod 1: 10.244.0.5 → 刪掉重建 → Pod 4: 10.244.0.<span className="text-red-400 font-bold">8</span></p>
            <p className="text-slate-400">寫死 IP 的後果：Pod 重建 → IP 變了 → 斷線！</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題 2：3 個 Pod，該連哪一個？</p>
          <div className="text-slate-300 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-1 rounded">前端</span>
              <span className="text-slate-400 font-bold">→ ???</span>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-xs">10.244.0.5（Pod 1）</span>
                <span className="text-slate-400 text-xs">10.244.0.6（Pod 2）</span>
                <span className="text-slate-400 text-xs">10.244.0.7（Pod 3）</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 怎麼解決的？</p>
          <div className="text-slate-300 text-sm">
            <p>Docker Compose 用容器名稱做 DNS：<code>curl http://api:8080</code></p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold">→ K8s 的解決方案：Service</p>
        </div>
      </div>
    ),
    notes: `好，我們的 Deployment 建好了，3 個 nginx Pod 正在跑。我們來看一下它們的 IP：kubectl get pods -o wide。每個 Pod 都有一個 IP，像 10.244.0.5、10.244.0.6、10.244.0.7。但這些 IP 有兩個致命的問題。

第一，IP 會變。剛剛我們做了一個實驗，刪掉一個 Pod，K8s 自動重建了一個新的。但新 Pod 的 IP 跟原來的不一樣。如果你的前端寫死了 API 的 IP，Pod 一重建就斷線了。

第二，你有 3 個 Pod，前端到底該連哪一個？如果只連其中一個，那另外兩個不就白跑了嗎？而且如果那個 Pod 剛好掛了呢？

大家回想一下 Docker Compose 的經驗。在 Docker Compose 裡面，你不需要知道 API 容器的 IP，你可以直接用容器名稱 http://api:8080 來連。Docker 在背後自動幫你做了 DNS 解析。

K8s 也有類似的機制，而且更強大。K8s 的解決方案叫做 Service。Service 就是一個穩定的存取入口，它會做兩件事：第一，給你一個永遠不變的地址；第二，把流量自動分配到後面的多個 Pod。`,
    duration: '5',
  },

  // ── Slide 11 Service 流量圖 ────────────────────────
  {
    title: 'Service 概念：ClusterIP',
    subtitle: '穩定入口 + 負載均衡',
    section: 'Service',
    content: (
      <div className="space-y-4">
        {/* Service 流量圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Service = 穩定入口 + 負載均衡</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-amber-400 text-xs font-semibold">前端 Pod</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            <div className="bg-cyan-900/40 border-2 border-cyan-500/70 px-4 py-3 rounded-lg text-center">
              <p className="text-cyan-400 text-sm font-bold">Service</p>
              <p className="text-cyan-300 text-xs">nginx-svc</p>
              <p className="text-slate-400 text-[10px]">10.96.0.10</p>
              <p className="text-green-400 text-[10px] font-semibold">IP 不會變！</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-sm font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">Pod A</p>
                  <p className="text-slate-500 text-[10px]">10.244.0.5</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-sm font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">Pod B</p>
                  <p className="text-slate-500 text-[10px]">10.244.0.6</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-sm font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">Pod C</p>
                  <p className="text-slate-500 text-[10px]">10.244.0.7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Service 怎麼知道要轉發給哪些 Pod？→ Label Selector</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>Service 的 <code>selector: app: nginx</code> → 找所有 label 有 <code>app=nginx</code> 的 Pod</p>
            <p>Endpoints = Service 背後的 Pod IP 列表（自動更新）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照 Docker</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Docker Compose</th>
                <th className="text-left py-2">K8s Service</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">容器名稱自動做 DNS</td>
                <td className="py-2">Service 名稱做 DNS</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">只有 DNS，沒有負載均衡</td>
                <td className="py-2">DNS + 自動負載均衡</td>
              </tr>
              <tr>
                <td className="py-2"><code>http://api:8080</code></td>
                <td className="py-2"><code>http://api-svc:80</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `來看 Service 的核心概念。Service 做兩件事：第一，提供一個穩定的、不會變的 IP 地址和 DNS 名稱；第二，自動把流量負載均衡到後面的 Pod。

看圖：前端 Pod 連的是 Service 的 IP（比如 10.96.0.10），不管後面的 Pod 怎麼增減、IP 怎麼變，Service 的 IP 永遠不變。Service 會自動把請求分配到後面健康的 Pod 上。

那 Service 怎麼知道要把流量轉給哪些 Pod？答案是 Label Selector，跟 Deployment 一樣的機制。你在 Service 的 YAML 裡面寫 selector: app: nginx，Service 就會去找所有 label 有 app: nginx 的 Pod，把它們加進轉發清單。

你可以用 kubectl get endpoints 來查看 Service 背後有哪些 Pod。Endpoints 就是 Pod 的 IP 列表。Pod 被刪了、新建了，Endpoints 會自動更新，你不需要手動操作。

ClusterIP 是 Service 的預設類型。它會拿到一個叢集內部的虛擬 IP，只能在叢集裡面存取。適合用在微服務之間的溝通，比如前端連 API、API 連資料庫。

用 Docker Compose 來對照：Compose 裡面容器名稱會自動變成 DNS，你可以用 http://api:8080 來連。K8s 的 Service 也一樣，你可以用 http://api-svc:80 來連。差別是 K8s 的 Service 多了負載均衡的能力，Docker Compose 只有 DNS 解析，沒有負載均衡。`,
    duration: '10',
  },

  // ── Slide 12 Service YAML + 實作 ──────────────────
  {
    title: 'Service YAML + 實作',
    subtitle: 'Lab 3：ClusterIP Service',
    section: 'Service',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">port vs targetPort</p>
          <div className="flex items-center gap-2 text-sm text-slate-300 flex-wrap">
            <span className="text-slate-400">外部</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-1 rounded">Service:80 <span className="text-slate-500">(port)</span></span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded">Pod:80 <span className="text-slate-500">(targetPort)</span></span>
          </div>
          <p className="text-slate-400 text-xs mt-2">對照 Docker：<code>docker run -p 8080:80</code> — 左邊 = port，右邊 = targetPort</p>
        </div>
      </div>
    ),
    code: `# --- Service YAML ---
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP                # 預設類型，可省略
  selector:
    app: nginx                   # 要跟 Pod 的 label 一致！
  ports:
    - port: 80                   # Service 監聽的 port
      targetPort: 80             # 轉發到 Pod 的 port

# --- 實作步驟 ---
# Step 1：建立 Service
kubectl apply -f service-clusterip.yaml

# Step 2：查看
kubectl get svc
kubectl describe svc nginx-svc   # 看 Endpoints

# Step 3：從另一個 Pod 驗證
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
# 進去後：
curl http://nginx-svc
curl http://nginx-svc
curl http://nginx-svc
# 每次都能連到！
exit`,
    notes: `來看 Service 的 YAML。比 Deployment 簡單多了。

apiVersion: v1，Service 的 API 版本跟 Pod 一樣是 v1。kind: Service。

spec 裡面三個重點。type: ClusterIP 是 Service 的類型，ClusterIP 是預設值，你不寫也行。selector 是用來找 Pod 的，這裡寫 app: nginx，跟 Deployment 裡 Pod 的 label 一致。

ports 有兩個欄位容易搞混。port 是 Service 自己監聽的 port，也就是別人連 Service 時用的 port。targetPort 是 Service 要轉發到 Pod 的哪個 port。通常這兩個一樣，都是 80。但如果你想讓使用者連 8080、實際轉到 Pod 的 80，就可以把 port 寫 8080、targetPort 寫 80。

好，來建我們的第一個 Service。kubectl apply -f service-clusterip.yaml。來看看：kubectl get svc。你會看到兩個 Service。一個是 kubernetes，這是 K8s 系統自帶的，不用管。另一個就是我們剛建的 nginx-svc，TYPE 是 ClusterIP，CLUSTER-IP 欄位有一個 IP 地址。

我們用 describe 看更多細節：kubectl describe svc nginx-svc。重點看 Endpoints 那一行。你會看到三個 IP 加上 port，像 10.244.0.5:80, 10.244.0.6:80, 10.244.0.7:80。這就是 Service 背後的三個 Pod。Service 會把流量輪流分配到這三個 Pod 上。

好，ClusterIP Service 只能在叢集內部存取。我們要怎麼驗證呢？建一個臨時的 Pod，從叢集裡面去連：kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh。進去之後，試試用 Service 名稱連線：curl http://nginx-svc。你應該會看到 nginx 的歡迎頁面！再多 curl 幾次，每次都能成功。注意我們用的是 nginx-svc 這個名稱，不是 IP。K8s 的 CoreDNS 會自動把 Service 名稱解析成 Service 的 ClusterIP。`,
    duration: '15',
  },

  // ── Slide 13 ClusterIP vs NodePort 對比圖 ──────────
  {
    title: 'Service 進階：NodePort',
    subtitle: '讓外部也能連到你的服務',
    section: 'Service',
    content: (
      <div className="space-y-4">
        {/* ClusterIP vs NodePort 對比圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">ClusterIP vs NodePort</p>
          <div className="grid grid-cols-2 gap-4">
            {/* ClusterIP */}
            <div className="border border-blue-500/50 rounded-lg p-3 bg-blue-900/10">
              <p className="text-blue-400 text-sm font-bold text-center mb-2">ClusterIP</p>
              <div className="space-y-2">
                <div className="border border-slate-600 rounded p-2 bg-slate-800/50">
                  <p className="text-slate-500 text-[10px] text-center mb-1">叢集邊界</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="bg-green-900/40 border border-green-500/30 px-1 py-0.5 rounded text-green-300 text-[10px]">Pod</span>
                    <span className="text-green-400 text-xs">→</span>
                    <span className="bg-cyan-900/40 border border-cyan-500/40 px-1 py-0.5 rounded text-cyan-300 text-[10px]">Svc</span>
                    <span className="text-green-400 text-xs">→</span>
                    <span className="bg-green-900/40 border border-green-500/30 px-1 py-0.5 rounded text-green-300 text-[10px]">Pod</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="bg-red-900/40 border border-red-500/40 px-2 py-0.5 rounded text-red-300 text-[10px]">外部</span>
                  <span className="text-red-400 text-xs font-bold">X</span>
                  <span className="text-slate-500 text-[10px]">連不到</span>
                </div>
              </div>
            </div>
            {/* NodePort */}
            <div className="border border-green-500/50 rounded-lg p-3 bg-green-900/10">
              <p className="text-green-400 text-sm font-bold text-center mb-2">NodePort</p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="bg-amber-900/40 border border-amber-500/40 px-1 py-0.5 rounded text-amber-300 text-[10px]">外部</span>
                  <span className="text-green-400 text-xs">→</span>
                  <span className="text-slate-400 text-[10px]">:30080</span>
                </div>
                <div className="border border-slate-600 rounded p-2 bg-slate-800/50">
                  <p className="text-slate-500 text-[10px] text-center mb-1">叢集邊界</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-slate-400 text-[10px]">Node</span>
                    <span className="text-green-400 text-xs">→</span>
                    <span className="bg-cyan-900/40 border border-cyan-500/40 px-1 py-0.5 rounded text-cyan-300 text-[10px]">Svc</span>
                    <span className="text-green-400 text-xs">→</span>
                    <span className="bg-green-900/40 border border-green-500/30 px-1 py-0.5 rounded text-green-300 text-[10px]">Pod</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三個 port 的關係</p>
          <div className="flex items-center gap-2 text-sm text-slate-300 flex-wrap">
            <span className="text-slate-400">外部</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-1 rounded">nodePort <span className="text-slate-500">(30080)</span></span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-1 rounded">port <span className="text-slate-500">(80)</span></span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded">targetPort <span className="text-slate-500">(80)</span></span>
          </div>
          <p className="text-slate-400 text-xs mt-2">NodePort 範圍：30000 - 32767</p>
        </div>
      </div>
    ),
    code: `# --- NodePort Service YAML ---
spec:
  type: NodePort
  ports:
    - port: 80             # Service 內部 port
      targetPort: 80       # Pod 的 port
      nodePort: 30080      # Node 上開的 port

# --- 實作 ---
kubectl apply -f service-nodeport.yaml
kubectl get svc

# 從外部存取
minikube ip
curl http://<minikube-ip>:30080

# 或者用 minikube 內建指令
minikube service nginx-nodeport`,
    notes: `ClusterIP Service 解決了叢集內部的溝通問題，但如果你想從外部存取呢？比如你想在瀏覽器打開 nginx 的頁面。ClusterIP 的 IP 是叢集內部的虛擬 IP，從外面連不到。

這時候就需要 NodePort。NodePort 會在每個 Node 上開一個 port（範圍 30000 到 32767），外部流量從這個 port 進來，然後轉發到 Service，Service 再轉發到 Pod。

YAML 裡面多了兩個東西：type: NodePort 把 Service 類型從 ClusterIP 改成 NodePort；ports 裡面多了一個 nodePort: 30080，這是在 Node 上開的 port。你可以自己指定（在 30000-32767 範圍內），也可以不寫讓 K8s 隨機分配。

現在有三個 port，容易搞混，我們理清一下。最外面是 nodePort（30080），這是 Node 上開的，外部用這個連。中間是 port（80），這是 Service 的 port，叢集內部用這個連。最裡面是 targetPort（80），這是 Pod 的 port。

流量的路線是：外部 → Node:30080 → Service:80 → Pod:80。

對照 Docker 的 -p 30080:80，nodePort 就像 host port，targetPort 就像 container port。差別是 Docker 只在一台機器上開 port，K8s 的 NodePort 會在每個 Node 上都開同一個 port。所以不管你連哪個 Node 的 30080，都能到達你的服務。`,
    duration: '10',
  },

  // ── Slide 14 實作：NodePort + port-forward 比較 ────
  {
    title: '實作：NodePort Service',
    subtitle: 'Lab 4 + port-forward vs NodePort',
    section: 'Service',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">port-forward vs NodePort</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28"></th>
                <th className="text-left py-2">port-forward</th>
                <th className="text-left py-2">NodePort</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">用途</td>
                <td className="py-2">開發除錯</td>
                <td className="py-2">測試/輕量生產</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">持續性</td>
                <td className="py-2">關掉終端就斷</td>
                <td className="py-2">永久有效</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">port 範圍</td>
                <td className="py-2">任意</td>
                <td className="py-2">30000-32767</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">NodePort 限制：port 範圍固定、記起來不方便、不適合正式生產環境</p>
          <p className="text-slate-400 text-xs mt-1">→ 生產環境用 Ingress 或 LoadBalancer（下一堂課）</p>
        </div>
      </div>
    ),
    code: `# Step 1：建立
kubectl apply -f service-nodeport.yaml

# Step 2：查看
kubectl get svc
# NAME              TYPE        CLUSTER-IP    PORT(S)
# nginx-nodeport    NodePort    10.96.x.x     80:30080/TCP

# Step 3：從外部存取
minikube ip
curl http://<minikube-ip>:30080

# 或者用 minikube 內建指令（自動開瀏覽器）
minikube service nginx-nodeport

# 實作完清理
kubectl delete svc nginx-nodeport`,
    notes: `來建一個 NodePort Service。kubectl apply -f service-nodeport.yaml。

看一下 Service 列表：kubectl get svc。你會看到 nginx-nodeport 的 TYPE 是 NodePort，PORT(S) 欄位顯示 80:30080/TCP，意思是 Service 的 80 port 對應到 Node 的 30080 port。

現在我們從外部來存取。先取得 minikube 的 IP：minikube ip。記下這個 IP，然後用 curl：curl http://<minikube-ip>:30080。你應該看到 nginx 的歡迎頁面。也可以直接在瀏覽器打開。

minikube 還有一個更方便的指令：minikube service nginx-nodeport。它會自動幫你打開瀏覽器。

大家回想一下，上一堂課我們用 port-forward 也能讓外部連到 Pod。那 port-forward 和 NodePort 有什麼差別？port-forward 是臨時的，關掉終端就斷了，適合開發除錯。NodePort 是永久的，只要 Service 存在就一直有效，適合測試環境或輕量的生產環境。

不過 NodePort 也有限制：port 範圍只有 30000 到 32767，記起來不方便。而且讓使用者輸入 IP 加 port 也不專業。那生產環境怎麼辦？先留個懸念，下一堂課會講 Ingress 和 LoadBalancer。

實作完之後，我們先把 NodePort Service 刪掉，留著 ClusterIP 給後面的 Lab 用：kubectl delete svc nginx-nodeport。`,
    duration: '10',
  },
]
