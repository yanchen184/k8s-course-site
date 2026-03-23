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
    notes: `快速回顧上一堂：K8s 架構是 Master（API Server、etcd、Scheduler、Controller Manager）加 Worker（kubelet、kube-proxy、Container Runtime）。我們寫了 Pod YAML，用 kubectl get / describe / logs / exec / delete 五個指令操作 Pod，還練了排錯流程：get 看狀態 → describe 看 Events → logs 看日誌。

上一堂結尾的反思問題：「怎麼讓 K8s 自動維持 3 個 nginx？Pod 掛了一個，自動補一個？」答案就是今天的主角 — Deployment。

光有 Deployment 還不夠。Pod 跑起來了，別人怎麼連到你的服務？所以還要學 Service。用了 Service 之後，用 IP 連太麻煩，所以還要學 DNS。最後學 Namespace，把 dev 和 staging 環境隔離。今天的路線：Deployment → Service → DNS → Namespace。

在開始之前，先升級環境 — 從 minikube 單節點換成 k3s 多節點叢集。為什麼？因為 Deployment 擴容、Pod 分散到不同 Node、NodePort 從任何 Node 都能連，這些用 minikube 單節點完全看不到效果。`,
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
    notes: `minikube 只有一個 Node，Deployment 擴容到 5 個副本全部擠在同一台、NodePort 只有一個 IP 能連、DaemonSet 每個 Node 跑一份但只有一個 Node — 這些效果全部看不到。所以我們要升級到 k3s 多節點。

k3s 是 Rancher Labs 開源的輕量版 K8s，核心功能一樣但安裝只要一行指令、資源佔用少很多。名字由來：K8s 有 8 個字母（K-u-b-e-r-n-e-t-e-s），k3s 砍掉肥肉只留 3 個。

用 Multipass 在本機跑 3 台 Ubuntu VM。Multipass 是 Canonical（做 Ubuntu 那家公司）出品，一行指令建一台 VM。

安裝步驟：macOS 用 brew install multipass，Windows 用 choco install multipass，Linux 用 snap install multipass。

建 3 台 VM：multipass launch --name k3s-master --cpus 2 --memory 2G --disk 10G，同樣建 k3s-worker1 和 k3s-worker2。

在 master 裝 k3s：curl -sfL https://get.k3s.io | sh -，一行搞定。對比 kubeadm 要裝前置套件、設定 cgroup driver、處理相容性，k3s 30 秒完成。

裝好 master 後取兩個東西：join token（worker 加入叢集的憑證）和 master IP（worker 要知道 master 在哪）。對照 Docker Swarm：docker swarm init 後拿到 docker swarm join --token xxx，k3s 邏輯一樣，只是指令不同。

用 for 迴圈讓兩台 worker 加入，加入指令多兩個環境變數：K3S_URL 指向 master、K3S_TOKEN 帶上憑證。

驗證：multipass exec k3s-master -- sudo kubectl get nodes，應該看到 3 個 Node 都是 Ready。

最後把 kubeconfig 複製到本機，把 IP 從 127.0.0.1 改成 master 實際 IP，設定 KUBECONFIG 環境變數。之後直接在本機跑 kubectl get nodes 就能操作叢集。

課程資料夾有 setup-k3s.sh 一鍵腳本，但建議至少手動跑過一次。`,
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
    notes: `回想第四堂課：kubectl delete pod 刪掉 nginx Pod 之後，kubectl get pods 一看，空的，沒人幫你重建。生產環境跑 API 服務，Pod 一掛使用者就看到 503。

所以我們需要三樣東西：一、自動重建 — Pod 掛了自動補新的；二、多副本 — 跑 3 個 Pod，掛一個還有 2 個在服務；三、版本更新 — 換新版本不能停機。

Docker 對照：多副本用 docker compose up --scale web=3，但只限單機。自動重啟用 --restart always，但整台機器掛了就沒救。滾動更新？Docker Compose 做不到，得自己寫腳本。

K8s 裡面這三個需求靠一個東西搞定 — Deployment。`,
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
    notes: `Deployment 三層結構：Deployment → ReplicaSet → Pod。你只管 Deployment 這一層，告訴它「我要 3 個 nginx Pod」，它自動建 ReplicaSet，ReplicaSet 再建 3 個 Pod。

ReplicaSet 的唯一職責：維持 Pod 數量 = 期望數量。你說 3 個，掛了一個剩 2 個，它補一個；多了一個變 4 個，它刪一個。

為什麼 Deployment 不直接管 Pod，中間要多一層 ReplicaSet？因為滾動更新。更新 image 版本時，Deployment 建一個新的 ReplicaSet 跑新版本，逐步把舊 ReplicaSet 的 Pod 數量從 3 降到 0、新的從 0 升到 3。舊 ReplicaSet 保留（Pod 數量 = 0），回滾時直接重新擴容。

Docker Compose 對照：Compose 的 replicas 只在 Swarm 模式下有效，沒有自動修復。K8s 的 Deployment 靠 Controller Manager 在背後做自動重建。`,
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
    notes: `打開 deployment.yaml。apiVersion 從 v1 變成 apps/v1 — Pod 和 Service 用 v1，Deployment 和 ReplicaSet 用 apps/v1。

spec 裡三個新東西：

一、replicas: 3 — 維持 3 個 Pod。

二、selector — Deployment 用什麼條件找到自己的 Pod。matchLabels: app: nginx 就是「找所有 label 有 app=nginx 的 Pod」。

三、template — Pod 的範本。裡面的結構跟上一堂課寫的 Pod YAML 幾乎一樣（metadata、labels、spec、containers），只是不需要 apiVersion 和 kind。

關鍵細節：spec.selector.matchLabels 和 spec.template.metadata.labels 必須一致。Deployment 靠 selector 認領 Pod，如果 selector 寫 app: nginx 但 Pod label 寫 app: web，Deployment 找不到自己的 Pod，會一直以為不夠然後拼命建新的。

K8s 設計哲學是「明確勝於隱式」，不會自動幫你對齊 — 囉唆但出錯機率低。`,
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
    notes: `kubectl apply -f deployment.yaml，看到 deployment.apps/nginx-deploy created 就成功了。

驗證三層結構。kubectl get deployments — 看到 nginx-deploy 的 READY 是 3/3，表示 3 個副本就緒。kubectl get replicasets — 看到 nginx-deploy-xxxxxxx 這個自動建立的 ReplicaSet，DESIRED 和 CURRENT 都是 3。kubectl get pods — 3 個 Pod，命名格式是 nginx-deploy-<ReplicaSet hash>-<隨機字串>。

重點實驗：隨便刪一個 Pod — kubectl delete pod nginx-deploy-xxxxxxx-xxxxx，然後馬上 kubectl get pods。結果：還是 3 個 Pod，但有一個名字不同、AGE 只有幾秒。ReplicaSet 偵測到數量從 3 變 2，馬上補了一個新的。上一堂直接建的 Pod 刪了就沒了，現在有 Deployment 的 Pod 是「刪不掉」的 — 除非你刪 Deployment 本身。

擴縮容：kubectl scale deployment nginx-deploy --replicas=5 擴到 5 個，kubectl get pods -o wide 看 Pod 分散在不同 Node。kubectl scale deployment nginx-deploy --replicas=3 縮回 3 個，多的 Pod 會被刪掉。

Docker 對照：docker compose up --scale web=5 只能在同一台機器，K8s 的 scale 會把 Pod 分散到不同 Node。`,
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
    notes: `滾動更新場景：nginx 從 1.27 升到 1.28。沒有 K8s 的做法是停掉所有舊容器再部署新版本，中間服務中斷使用者看到 503。

K8s 的滾動更新策略：先建一個 1.28 的 Pod，確認跑起來了，砍一個 1.27 的 Pod；再建一個新的，再砍一個舊的 — 逐步替換直到全部換完。整個過程始終有 Pod 在服務，零停機。

底層原理：Deployment 建一個新 ReplicaSet 跑 1.28，舊 ReplicaSet 的 Pod 從 3 降到 0，新的從 0 升到 3 — 蹺蹺板式替換。

舊 ReplicaSet 不會被刪掉，只是 Pod 數量變 0。這是為了回滾 — 新版本有 bug 時，kubectl rollout undo 一行指令，K8s 把舊 ReplicaSet 重新擴容、新的縮減就好了。`,
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
    notes: `先確認目前版本：kubectl describe deployment nginx-deploy | grep Image，應該看到 nginx:1.27。

更新到 1.28：kubectl set image deployment/nginx-deploy nginx=nginx:1.28。指令格式是 kubectl set image deployment/<名稱> <容器名>=<新 image>，前面的 nginx 是 YAML 裡 containers.name 定義的容器名。

觀察更新進度：kubectl rollout status deployment/nginx-deploy，看到 "successfully rolled out" 就完成了。

故意搞壞實驗：更新到不存在的版本 kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9。kubectl get pods 會看到新 Pod 狀態是 ImagePullBackOff 或 ErrImagePull，但舊版本的 Pod 還活著 — K8s 是逐步替換的，不會把舊 Pod 全砍掉，所以服務不會完全中斷。

回滾：kubectl rollout undo deployment/nginx-deploy。再 kubectl get pods，全部回到 Running。K8s 把壞掉的新 Pod 砍掉，重新擴容舊的 ReplicaSet。

也可以用 kubectl rollout history deployment/nginx-deploy 看歷史版本，用 kubectl rollout undo --to-revision=1 回到指定版本。`,
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

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ kubectl get nodes 看到 3 個 Ready 的節點（k3s 多節點叢集）</p>
            <p>✓ kubectl get deployment 看到 READY = 3/3</p>
            <p>✓ kubectl get pods -o wide 看到 Pod 分散在不同 Node</p>
            <p>✓ kubectl delete pod 後自動重建（自我修復）</p>
            <p>✓ kubectl rollout undo 成功回滾到上一版</p>
            <p>✓ kubectl scale deployment --replicas=5 成功擴容</p>
          </div>
        </div>
      </div>
    ),
    code: `kubectl apply -f deployment.yaml            # 建立 / 更新
kubectl get deploy                           # 查看
kubectl scale deploy <name> --replicas=N     # 擴縮容
kubectl set image deploy/<name> <c>=<image>  # 更新版本
kubectl rollout status deploy/<name>         # 看更新進度
kubectl rollout undo deploy/<name>           # 回滾`,
    notes: `Deployment 三個核心功能：一、維持副本數 — kubectl scale deployment 擴縮容，Pod 掛了自動重建。二、滾動更新 — kubectl set image 更新版本，逐步替換不停機。三、一鍵回滾 — kubectl rollout undo 秒回上一版。

六個常用指令：kubectl apply -f 建立、kubectl get deploy 查看、kubectl scale deploy 擴縮容、kubectl set image 更新版本、kubectl rollout status 看進度、kubectl rollout undo 回滾。

生產環境幾乎不會直接建 Pod，都用 Deployment。直接建 Pod 就像用 Docker 不寫 Compose 只用 docker run — 不是不行，但很原始。

接下來的問題：3 個 Pod 各有自己的 IP，但這些 IP 是叢集內部的，外面連不到，而且 Pod 重建後 IP 會變。別人怎麼穩定連到你的服務？這就是 Service。`,
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
    notes: `kubectl get pods -o wide 看每個 Pod 的 IP，像 10.244.0.5、10.244.0.6、10.244.0.7。兩個問題：

一、IP 會變 — 剛剛刪 Pod 重建後新 Pod IP 不同。前端寫死 IP 的話，Pod 一重建就斷線。

二、3 個 Pod 該連哪個 — 只連一個，另外兩個白跑；那個 Pod 掛了就斷線。

Docker Compose 對照：Compose 裡不用知道 IP，直接用容器名稱 http://api:8080 連，Docker 自動做 DNS 解析。

K8s 的解決方案是 Service — 給你一個不會變的地址，加上自動負載均衡把流量分配到多個 Pod。`,
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
    notes: `Service 做兩件事：一、提供穩定不變的 IP 和 DNS 名稱；二、自動負載均衡到後面的 Pod。前端 Pod 連 Service IP（如 10.96.0.10），不管後面 Pod 怎麼增減、IP 怎麼變，Service IP 永遠不變。

Service 怎麼知道轉發給哪些 Pod？靠 Label Selector — 跟 Deployment 一樣。YAML 裡寫 selector: app: nginx，Service 找所有 label 有 app=nginx 的 Pod。用 kubectl get endpoints 查看 Service 背後的 Pod IP 列表，Pod 增刪時 Endpoints 自動更新。

ClusterIP 是 Service 預設類型，拿到叢集內部虛擬 IP，只能在叢集裡存取。適合微服務之間溝通：前端連 API、API 連資料庫。

Docker Compose 對照：Compose 容器名稱自動做 DNS，用 http://api:8080 連。K8s Service 也用名稱連 http://api-svc:80，但多了負載均衡 — Compose 只有 DNS 解析，沒有負載均衡。`,
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
    notes: `Service YAML：apiVersion: v1（跟 Pod 一樣），kind: Service。

spec 三個重點：type: ClusterIP（預設值，可省略）；selector: app: nginx（跟 Pod label 一致）；ports 的 port 和 targetPort。

port vs targetPort 容易搞混：port 是 Service 監聽的 port（別人連 Service 用的），targetPort 是轉發到 Pod 的 port。通常兩個一樣都是 80。如果想讓外部連 8080 實際轉到 Pod 的 80，就寫 port: 8080、targetPort: 80。對照 Docker：docker run -p 8080:80，左邊 = port，右邊 = targetPort。

建立：kubectl apply -f service-clusterip.yaml。kubectl get svc 會看到兩個 Service — kubernetes 是系統自帶的不用管，nginx-svc 是我們建的，TYPE 是 ClusterIP。

kubectl describe svc nginx-svc 看 Endpoints — 三個 Pod IP 加 port，如 10.244.0.5:80, 10.244.0.6:80, 10.244.0.7:80。Service 把流量輪流分配到這三個 Pod。

驗證：建臨時 Pod 從叢集內部連 — kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh，進去後 curl http://nginx-svc 看到 nginx 歡迎頁面。用的是 Service 名稱不是 IP，CoreDNS 自動把名稱解析成 ClusterIP。`,
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
    notes: `ClusterIP 只能叢集內部存取，外部連不到。NodePort 在每個 Node 上開一個 port（範圍 30000-32767），外部流量從這個 port 進來 → 轉發到 Service → 再轉發到 Pod。

YAML 差異：type: NodePort，ports 多一個 nodePort: 30080（可自己指定 30000-32767，也可不寫讓 K8s 隨機分配）。

三個 port 的關係：nodePort（30080）= Node 上開的，外部用這個連；port（80）= Service 的 port，叢集內部用；targetPort（80）= Pod 的 port。流量路線：外部 → Node:30080 → Service:80 → Pod:80。

Docker 對照：docker run -p 30080:80，nodePort 像 host port，targetPort 像 container port。差別是 Docker 只在一台機器開 port，K8s NodePort 在每個 Node 都開同一個 port — 連任何 Node 的 30080 都能到達服務。`,
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
    notes: `kubectl apply -f service-nodeport.yaml。kubectl get svc 看到 nginx-nodeport 的 TYPE 是 NodePort，PORT(S) 顯示 80:30080/TCP。

從外部存取：minikube ip 取得 IP，curl http://<minikube-ip>:30080 看到 nginx 歡迎頁。或用 minikube service nginx-nodeport 自動開瀏覽器。

port-forward vs NodePort：port-forward 是臨時的（關掉終端就斷），適合開發除錯；NodePort 是永久的（Service 存在就有效），適合測試環境。port-forward 不限 port 範圍，NodePort 只有 30000-32767。

NodePort 限制：port 範圍固定、讓使用者輸入 IP 加 port 不專業。生產環境用 Ingress 或 LoadBalancer — 下一堂課會講。

清理：kubectl delete svc nginx-nodeport，留 ClusterIP 給後面 Lab 用。`,
    duration: '10',
  },
]
