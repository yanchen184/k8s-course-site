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
    notes: `【① 課程內容】
第四堂完整回顧：K8s 架構兩大角色——Master Node（apiserver、etcd、scheduler、controller-manager）和 Worker Node（kubelet、kube-proxy、Container Runtime）。YAML 四大必填欄位：apiVersion、kind、metadata、spec。Pod 是最小部署單位，是「臨時的」，沒有自我修復能力。kubectl 五大指令：get、describe、logs、exec、delete。排錯三板斧：get → describe（看 Events）→ logs。

minikube 三大限制：① Pod 全擠同一台 Node，感受不到分散；② NodePort 只有一個 Node IP；③ DaemonSet 只跑一個 Pod 跟普通 Pod 無差。

k3s 是 Rancher Labs 的輕量版 K8s，完全相容 K8s API，一行 curl 30 秒安裝。Multipass 是 Canonical 出品的 VM 管理工具，一行指令建 Ubuntu VM。

【③④ 題目 + 解答】
題目 1：minikube 和 k3s 的關鍵差異是什麼？從「學習多節點行為」的角度說明。
解答：minikube 單節點，Pod 全擠同一台，無法觀察分散部署、NodePort 多節點可連、DaemonSet 每 Node 一份。k3s 多節點叢集，完整體驗上述效果，且完全相容 K8s API。

題目 2：Master Node 四個元件各自的職責？
解答：kube-apiserver 是所有操作的唯一入口；etcd 是叢集鍵值資料庫；kube-scheduler 決定 Pod 調度到哪個 Node；controller-manager 監控實際狀態確保與期望一致。

題目 3：排錯三板斧的執行順序？為什麼要這樣排？
解答：get → describe → logs。get 快速看 STATUS 判斷大類；describe 看 Events，原因通常直接寫在這；logs 看容器內部錯誤，適合 CrashLoopBackOff。

[▶ 下一頁]`,
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
    notes: `【① 課程內容】
minikube 單節點三大限制：
① replicas:3 → 三個 Pod 全擠同一台，Node 掛了全死、無處可搬。
② NodePort 只有一個 Node IP，體驗不到多節點連入效果。
③ DaemonSet 只跑一個 Pod，跟 replicas:1 無差。

k3s 解法：多節點真實叢集，完全相容 K8s API，curl 一行搞定。名字由來：K8s 是 10 字母縮寫，half as big 5 字母就是 K3s。環境方案：VMware 建兩台 Ubuntu VM，NAT 網路互通，一台 master 一台 worker。

Docker 對照：Docker Swarm init vs k3s curl 安裝；docker node ls vs kubectl get nodes；join token 位置和格式不同。

【③④ 題目 + 解答】
題目 1：minikube 和 k3s 的關鍵差異是什麼？
解答：minikube 單節點，三個 Pod 共享命運，看不出分散部署、NodePort 多節點、DaemonSet 效果；k3s 真正多節點叢集，完全相容 K8s API，kubectl 指令和 YAML 格式完全一樣。

題目 2：用 VMware 建 k3s 環境的網路要怎麼設定？
解答：兩台 VM 都用 NAT 網路（同一個 VMnet），互相能 ping 到即可。master IP 要記下來，worker 加入時要用。

題目 3：為什麼 minikube 的 DaemonSet 看不出效果？
解答：DaemonSet 是「每個 Node 跑一個 Pod」，minikube 只有一個 Node，所以只跑一個 Pod，跟 replicas:1 的 Deployment 沒有差別，感受不到「每節點一份」的意義。

[▶ 下一頁]`,
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
    notes: `【① 課程內容】
OVF 匯入的 Ubuntu VM，SSH 連線後可能出現 .bashrc 相關錯誤訊息。.bashrc 是每次登入自動執行的設定檔，損壞就每次報錯。

解法：從 Windows 本機直接跑 ssh 指令，不用先進 VM：
ssh user@<vm-ip> "mv ~/.bashrc ~/.bashrc.bak"

這行指令 SSH 進去後直接備份壞掉的 .bashrc，整個過程不需要進互動介面。跑完重新 SSH 就乾淨了。沒遇到這個問題可以跳過。

【② 指令講解】
指令：ssh user@192.168.43.130 "mv ~/.bashrc ~/.bashrc.bak"
- ssh user@<ip>：連線到 VM（換成你的 VM IP）
- "mv ~/.bashrc ~/.bashrc.bak"：直接跑 mv 備份壞掉的設定檔，不進互動介面
- 打完要看：沒有報錯，就代表成功；重新 SSH 連線確認無錯誤訊息

異常狀況：
- Permission denied：確認 VM IP 和 user 帳號是否正確
- 沒有遇到錯誤訊息：直接跳過這步

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
    notes: `【① 課程內容】
兩台 VM 都從同一個 OVF 匯入，hostname 預設一樣，k3s 用 hostname 識別節點，名字相同會衝突，所以先改。master 安裝只要一行 curl，k3s 腳本自動處理所有前置作業。worker 加入時設定 K3S_URL 和 K3S_TOKEN 兩個環境變數，k3s 自動以 agent 模式安裝。

【② 指令講解】
1. 改 hostname + 重開機（兩台各做一次）
   sudo hostnamectl set-hostname ubuntu-master  # master 用
   sudo hostnamectl set-hostname ubuntu-worker  # worker 用
   sudo reboot
   打完要看：重新 SSH 連線後，提示符前面名稱已改變

2. 確認 master IP
   ip addr show | grep "inet " | grep -v 127
   打完要看：192.168.x.x，記下來，worker 加入時要用

3. 在 master 安裝 k3s
   curl -sfL https://get.k3s.io | sh -
   打完要看：最後出現 [INFO] systemd: Starting k3s 表示成功
   sudo kubectl get nodes  → 看到 1 個 Ready

4. 取得 token（master 上）
   sudo cat /var/lib/rancher/k3s/server/node-token
   打完要看：K10abc123...（一長串），複製起來

5. Worker 加入叢集（換掉 <master-ip> 和 <token>）
   curl -sfL https://get.k3s.io | K3S_URL=https://<master-ip>:6443 K3S_TOKEN=<token> sh -
   K3S_URL：master API Server 地址，port 6443
   K3S_TOKEN：加入叢集的身份憑證
   打完要看：[INFO] systemd: Starting k3s-agent（注意是 agent 不是 k3s）

6. 回 master 驗證
   sudo kubectl get nodes
   打完要看：ubuntu-master（control-plane,master）+ ubuntu-worker（none），兩個都 Ready
   異常：worker 顯示 NotReady → 等 30 秒再查，kubelet 啟動需要時間

【③④ 題目 + 解答】
題目 1：K3S_URL 和 K3S_TOKEN 各代表什麼？缺一個會怎樣？
解答：K3S_URL 告訴安裝腳本 master API Server 位址；K3S_TOKEN 是身份憑證。缺 K3S_URL 腳本以 server（master）模式安裝；缺 K3S_TOKEN worker 無法通過 master 認證，加入失敗。

題目 2：為什麼兩台 VM 要先改 hostname 才能建叢集？
解答：k3s 用 hostname 識別節點，兩台 VM 同名就會衝突，叢集狀態混亂，所以要先改成不同名字。

[▶ 下一頁]`,
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
    notes: `【① 課程內容】
kubeconfig 是 k3s 在 master 產生的連線設定檔，位置 /etc/rancher/k3s/k3s.yaml。問題：檔案裡的 server 地址寫 127.0.0.1（master 自己看自己），複製到本機後 kubectl 會連自己的 127.0.0.1，不是 VM，所以必須用 sed 替換成 master 的實際 IP。KUBECONFIG 環境變數告訴 kubectl 讀哪個 config 檔，設好之後本機直接打 kubectl，不用再進 VM。

【② 指令講解】
1. 複製 kubeconfig 到本機
   sudo cat /etc/rancher/k3s/k3s.yaml  → 複製整個輸出，貼到本機 ~/.kube/k3s-config

2. 替換 IP（Linux/macOS）
   sed -i "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config
   -i：直接修改檔案；s/舊/新/g：全部替換

   Windows 方式：用記事本開啟 k3s-config，手動把 127.0.0.1 改成 master 實際 IP

3. 設定環境變數
   export KUBECONFIG=~/.kube/k3s-config          # Linux/macOS
   $env:KUBECONFIG = "C:\Users\..\.kube\k3s-config"  # Windows PowerShell

4. 驗證本機直連
   kubectl get nodes
   打完要看：ubuntu-master + ubuntu-worker，兩個 Ready，不用 multipass exec 了

5. 部署 Deployment 驗證 Pod 分散
   kubectl create deployment my-nginx --image=nginx --replicas=3
   kubectl get pods -o wide
   打完要看：NODE 欄位有不同 Node 名稱，不是全部同一台

異常狀況：
- Unable to connect：sed 替換失敗，確認 MASTER_IP 有值
- certificate signed by unknown authority：嘗試加 --insecure-skip-tls-verify

【③④ 題目 + 解答】
題目：為什麼把 kubeconfig 複製到本機後必須用 sed 替換 IP？
解答：k3s 在 master 上產生 kubeconfig 時，server 欄位寫 127.0.0.1（localhost）。複製到本機後，本機的 127.0.0.1 是自己，kubectl 會嘗試連本機的 6443 port，根本沒有服務，必須改成 master VM 的實際 IP。

題目：操作題：設定好 kubeconfig 後，部署 nginx replicas=3，用 -o wide 確認 Pod 分散。
解答：kubectl get pods -o wide 的 NODE 欄位應顯示不同 Node 名稱，這就是多節點分散部署的效果，minikube 時 NODE 全部相同。

[▶ 下一頁]`,
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
    code: `# 現場 demo：scale up，感受 Pod 立刻增加
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods -w
# → 看到新 Pod 從 Pending → ContainerCreating → Running
# → -o wide 確認分散在不同 Node
kubectl get pods -o wide`,
    notes: `【① 課程內容】
裸 Pod（naked Pod）沒有守護機制，刪了就沒了。Deployment 三層結構：Deployment → ReplicaSet（自動建立）→ Pod。第二層 ReplicaSet 永遠在監控 Pod 數量，少了就補，多了就刪；滾動更新時新舊 RS 並存讓服務不中斷；回滾時把舊 RS 的 replicas 從 0 改回目標數量。

Deployment YAML 三個新欄位：replicas（副本數）、selector.matchLabels（認領 Pod 的條件）、template（Pod 的模板）。注意 selector.matchLabels 和 template.metadata.labels 必須完全一致！

apiVersion 差異：Pod/Service 用 v1；Deployment/ReplicaSet/DaemonSet/StatefulSet 用 apps/v1。

背後機制：kubectl scale → API Server → etcd 寫入 → Controller Manager 偵測差異 → Scheduler 分配 Node → kubelet 啟動容器。

【③④ 題目 + 解答】
題目 1：Deployment 為什麼需要 ReplicaSet 這一層？
解答：ReplicaSet 讓滾動更新可以新舊並存，更新時建新 RS 並逐步縮小舊 RS，服務不中斷；回滾時把舊 RS 的 replicas 從 0 改回來，不需要重建 Pod。沒有這層，更新必須先刪舊 Pod 再建新 Pod，有停機風險。

題目 2：以下 YAML 的錯誤在哪？selector: matchLabels: app: web，template: labels: app: nginx
解答：selector.matchLabels 是 app: web，template.metadata.labels 是 app: nginx，不一致。kubectl apply 會報錯 selector does not match template labels，無法建立；即使繞過，RS 找不到 app: web 的 Pod，會無限建新 Pod。

題目 3：apiVersion: v1 和 apps/v1 各對應哪些資源？
解答：v1：Pod、Service、ConfigMap、Secret；apps/v1：Deployment、ReplicaSet、DaemonSet、StatefulSet。

[▶ 下一頁]`,
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
    code: `# 現場 demo：scale down，感受 Pod 立刻減少
kubectl scale deployment nginx-deploy --replicas=2
kubectl get pods -w
# → 多餘的 Pod 被 Terminating → 消失
# → 服務仍然運作，只是少了幾個副本`,
    notes: `【① 課程內容】
縮容：流量退了，多餘的 Pod 佔著資源（雲端佔著費用），用 kubectl scale 縮回來。K8s 自動砍掉多的 Pod，你只需要說「我要幾個」。

水平擴縮容（Horizontal Scaling）：加減副本數量，規格不變。比喻：多請幾個廚師。無狀態應用首選，可以理論上加到幾百個副本。

垂直擴縮容（Vertical Scaling）：加大單個 Pod 的 CPU/記憶體。比喻：給廚師更大的鍋。有硬體上限，通常需要重啟 Pod。

Docker 對照：Docker Compose --scale 只能在單台機器加容器；K8s scale 是跨 Node，每台機器都出力，本質差異。

HPA 預告（第七堂）：CPU 超 70% 自動加 Pod，退了自動縮，全自動不用手動打指令。

【③④ 題目 + 解答】
題目 1：水平擴縮容和垂直擴縮容的差異？在 K8s 中為什麼水平更常用？
解答：水平是加副本數量、垂直是加單個 Pod 的 CPU/記憶體。水平更常用因為：無上限（只要叢集夠大）、不需重啟 Pod、跨 Node 分散負載。垂直有硬體上限、通常需重啟。

題目 2：Docker Compose --scale 和 kubectl scale 的本質差異？
解答：Docker Compose 只在單台機器加容器，受限於那台機器的 CPU/記憶體；kubectl scale 是跨 Node 的，Pod 分散到不同機器，每台都出力，可以突破單機限制。

題目 3：操作題：把 nginx-deploy 副本數擴容到 6，用 -o wide 確認 Pod 分散在不同 Node。
解答：kubectl scale deployment nginx-deploy --replicas=6，然後 kubectl get pods -o wide，NODE 欄位應有不同 Node 名稱，Scheduler 預設盡量分散。

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
    notes: `【① 課程內容】
Labels（標籤）：附在 K8s 資源上的 key=value 鍵值對，完全自訂，不影響功能本身，只是標記。
Selector（選擇器）：用 label 條件篩選一群資源，讓 Deployment 知道哪些 Pod 是自己管的。

Deployment YAML 三處 Labels：
① metadata.labels：Deployment 自己的 label（給外部選這個 Deployment 用）
② spec.selector.matchLabels：認領條件（Deployment 找「自己的 Pod」的 key）
③ spec.template.metadata.labels：Pod 的 label（建出來的 Pod 帶這個標籤）

關係：② 和 ③ 必須完全一致，Deployment 才能認領自己建出的 Pod。① 可以和 ②③ 不同。② ③ 不一致的後果：Deployment 找不到自己的 Pod，以為數量不夠，一直無限建新 Pod，數量失控。

常見 Label Key 慣例：app（應用名稱）、env（環境：prod/staging）、version（版本號）、tier（層級：frontend/backend）。

【③④ 題目 + 解答】
題目 1：Deployment YAML 裡 labels 出現在哪三個地方？哪兩個必須一致？
解答：① metadata.labels（Deployment 自己的）、② selector.matchLabels（認領條件）、③ template.metadata.labels（Pod 的 label）。② 和 ③ 必須完全一致，否則 Deployment 找不到自己的 Pod，無限補 Pod。

題目 2：② 和 ③ 不一致會造成什麼現象？如何排查？
解答：kubectl apply 直接報錯 selector does not match template labels；即使繞過，kubectl get pods 會看到 Pod 不斷增加，RS DESIRED 和 READY 永遠不一致，用 kubectl describe deployment 看 Events 可以看到不斷 ScalingReplicaSet。

[▶ 下一頁]`,
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
    notes: `【① 課程內容】
實作流程：清掉舊 Deployment → 重建 replicas:3 → 觀察三層結構（Deployment → ReplicaSet → Pod）→ 測試自我修復 → scale 擴縮容 → -o wide 看 Pod 分散不同 Node。

scale 對象是 Deployment，不是 Pod。kubectl edit deployment 也能改 replicas，但容易手誤，生產環境建議用 kubectl scale，更安全明確。

【② 指令講解】
1. 清掉重建
   kubectl delete deployment my-nginx
   kubectl create deployment my-nginx --image=nginx --replicas=3
   打完要看：deployment.apps/my-nginx created

2. 查看三層結構
   kubectl get deployments  → READY: 3/3，UP-TO-DATE: 3，AVAILABLE: 3
   kubectl get rs           → NAME 格式 <Deployment名>-<hash>，DESIRED=3 CURRENT=3 READY=3
   kubectl get pods -o wide → NODE 欄位有不同 Node 名稱（分散！）

3. 測試自我修復
   kubectl delete pod <pod-name>  → 立刻查 kubectl get pods
   打完要看：一個 ContainerCreating 的新 Pod 出現，幾秒後 Running，總數恢復 3

4. 擴容
   kubectl scale deployment my-nginx --replicas=5
   kubectl get pods -o wide  → 多兩個 Pod，NODE 有分散
   kubectl get deploy        → READY: 5/5

5. 縮容
   kubectl scale deployment my-nginx --replicas=2
   kubectl get pods          → 三個 Terminating，最後剩兩個 Running

異常排查：
- READY 一直 0/3：kubectl describe deployment my-nginx 看 Events
- AVAILABLE 小於 READY：Pod 跑起來但健康檢查失敗

【③④ 題目 + 解答】
題目 1：kubectl get pods 裡有 1 個 RESTARTS=5，其他是 0，可能是什麼原因？如何排查？
解答：RESTARTS 高代表容器不斷崩潰（CrashLoopBackOff）。排查：kubectl describe pod <name> 看 Events 和退出碼；kubectl logs <name> 看錯誤輸出；kubectl logs <name> --previous 看上一次崩潰的日誌。

題目 2：READY、UP-TO-DATE、AVAILABLE 三個欄位的差異？
解答：READY 是通過就緒探針的 Pod 數/期望數；UP-TO-DATE 是已更新到最新模板版本的 Pod 數；AVAILABLE 是健康且達 minReadySeconds 的 Pod 數（預設 0 等同 READY）。

題目 3：操作題：把 nginx-deploy 擴容到 6，用 -o wide 確認 Pod 分散在不同 Node。
解答：kubectl scale deployment nginx-deploy --replicas=6，kubectl get pods -o wide，6 個 Pod 分散在 k3s-master、k3s-worker1、k3s-worker2，每節點約 2 個（Scheduler 盡量均衡）。

[▶ 下一頁]`,
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
    notes: `【③ 題目（Lab 1：你被叫去救火）】
情境：你是新入職的工程師。同事部署了一個 API 服務但設定有問題，YAML 裡有兩個 bug，自己找。

任務：
1. 把 YAML 存成 api-service.yaml，apply 到叢集
2. 觀察發生什麼事（用學過的指令自己查）
3. 找出兩個 bug，各自說明問題
4. 修好 YAML，重新 apply，讓 READY 變成 3/3
5. kubectl scale 擴到 5，確認 Pod 分散在不同 Node

驗收：kubectl get deploy → READY: 3/3；scale 5 後 kubectl get pods -o wide → NODE 欄位有分散

老師：宣布開始後去巡堂，結束前帶大家看答案，重點說明兩個 bug 的原理。

【④ 解答（Lab 1 詳解）】
Bug 1：selector / label 不一致
- selector.matchLabels.app = api，但 template.metadata.labels.app = backend
- kubectl apply 時報錯：spec.selector does not match template labels
- 即使繞過，Deployment 找不到自己的 Pod，誤以為副本數不足，一直補新 Pod，數量失控

Bug 2：replicas 不足
- replicas: 1，但老闆要求至少 3 個

修復後的 YAML 關鍵部分：
spec:
  replicas: 3           # 改這裡
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api        # 改這裡，和 selector 一致

完整操作：
kubectl apply -f api-service.yaml
kubectl get deploy          # READY: 3/3
kubectl scale deployment api-service --replicas=5
kubectl get pods -o wide    # 看 NODE 欄位
kubectl delete deployment api-service

老師補充說明重點：
- K8s apply 做 validation，selector/template labels 不一致直接報錯，讓學生看 Error 訊息並解讀
- Bug 1 是最常見的 YAML 坑，熟記三處 labels 的關係就能預防
- Bug 2 提醒：replicas 要符合實際需求，不能寫完就不管

[▶ 下一頁]`,
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
    notes: `【① 課程內容】
本節為學生獨立練習後的帶做確認（對應 Lab 1 結束後）。老師帶大家走一遍擴縮容操作，確認每個步驟都做到，並點出兩個常見坑。

Lab 設計邏輯回顧：Bug 1 selector/label 不一致（READY 永遠 0/3）；Bug 2 replicas:1 不足（改成 3）；修好後還要 scale 到 5 確認分散，把 scale 指令練進去。

探索建議：kubectl describe deployment 的 Events 區塊記錄每次 scale 操作，Scaled up/down replica set 的歷史清晰可查，排查問題時很有用。

【② 指令講解（帶做一遍）】
1. 確認 Deployment 存在
   kubectl get deploy
   打完要看：my-httpd，READY 2/2（或你 Lab 用的 api-service）

2. 擴容
   kubectl scale deployment my-httpd --replicas=5
   kubectl get pods -o wide
   打完要看：5 個 Pod Running，NODE 欄位有不同 Node 名稱

3. 縮容
   kubectl scale deployment my-httpd --replicas=1
   kubectl get pods
   打完要看：剩 1 個 Running，其他 Terminating → 消失

4. 探索 Events
   kubectl describe deployment my-httpd
   打完要看 Events 區塊：Scaled up replica set ... to 5 / Scaled down ... to 1

【③④ 題目 + 解答（兩個常見坑）】
坑 1：kubectl scale pod <pod-name>
原因：Pod 沒有 replicas 概念，scale 對象必須是 Deployment
正確做法：kubectl scale deployment <name> --replicas=N

坑 2：只用 kubectl get pods，沒加 -o wide
原因：少了 NODE 欄位，看不到 Pod 分散到哪台 Node
正確做法：kubectl get pods -o wide，確認 NODE 欄位有不同 Node

驗收確認：
- kubectl get deploy → READY: 正確數量/正確數量
- kubectl get pods -o wide → NODE 欄位確實有分散

[▶ 下一頁]`,
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
    notes: `【① 課程內容】
停機更新的問題：傳統做法先全部砍掉舊 Pod 再建新 Pod，中間服務中斷。使用者看到 502/503，電商幾秒 = 幾萬損失。

滾動更新（Rolling Update）流程：核心原則「建一個新的，砍一個舊的」不斷循環。全程至少有一個 Pod 在服務，零停機。K8s 預設策略就是 Rolling Update，不用特別設定。

底層機制 ReplicaSet 蹺蹺板：Deployment 建新 ReplicaSet（RS）。新 RS 副本數 0→1→2→N，舊 RS 副本數 N→...→0。用 kubectl get rs 觀察這個現象。

舊 ReplicaSet 為什麼保留？更新完成後舊 RS 副本數歸零但物件還在，這是「回滾備份」，需要回滾時直接把舊 RS 擴容，速度極快。

更新策略參數：
- maxSurge（預設 25%）：更新過程中最多可超出期望副本數幾個（無條件進位）
- maxUnavailable（預設 25%）：最多允許幾個 Pod 不可用（無條件捨去）
- 範例：3 個副本時 maxSurge=1（最多 4 個），maxUnavailable=0（不允許任何不可用）

回滾機制：kubectl rollout undo deployment/<name> → 舊 RS 副本數重新增加，新 RS 縮減回 0。K8s 預設保留 10 個歷史版本（spec.revisionHistoryLimit）。

Docker 對照：Docker Compose docker-compose up 是直接替換，沒有原生滾動更新。K8s 把這件事做成一等公民，開箱即用。

【② 指令講解】
現場示範兩件事：

① 自訂 maxSurge / maxUnavailable，感受「更新中多一個 Pod」
kubectl patch deployment nginx-deploy --patch '{"spec":{"strategy":{"rollingUpdate":{"maxSurge":1,"maxUnavailable":0}}}}'
→ patch 是用 JSON 或 YAML 局部更新資源，不需要改 YAML 重 apply
kubectl set image deployment/nginx-deploy nginx=nginx:1.27
kubectl get pods -w
→ watch 更新過程：看到短暫出現 4 個 Pod（3 期望 + 1 maxSurge），沒有任何 Pod 先被砍（maxUnavailable=0）

② 查歷史版本
kubectl rollout history deployment/nginx-deploy
→ 看到 REVISION 欄位，數字越大越新
kubectl rollout history deployment/nginx-deploy --revision=1
→ 看某個版本的詳細資訊（包含 image 版本）
kubectl rollout undo deployment/nginx-deploy --to-revision=1
→ 回滾到指定版本（不是只回「上一版」）

【③④ 題目 + 解答】
題目 1：滾動更新過程中，為什麼「舊 ReplicaSet 不會被立刻刪除」？這個設計解決了什麼問題？
解答：舊 RS 保留是為了支援「快速回滾」。回滾時直接擴容舊 RS、縮減新 RS，不需要重新 build/push image，整個回滾過程可以在秒級完成。如果把舊 RS 刪掉，就只能重新部署，速度慢很多。

題目 2：maxSurge=0, maxUnavailable=1 代表什麼？更新期間流量會有影響嗎？
解答：maxSurge=0 表示更新期間 Pod 總數不能超過期望值；maxUnavailable=1 表示最多允許 1 個 Pod 不可用。更新流程變成「先砍 1 個舊的，再建 1 個新的」，期間有 1 個 Pod 短暫不在線，流量會有輕微影響，適合可以接受短暫降容的場景。

[▶ 下一頁]`,
    code: `# 現場示範：自訂 maxSurge / maxUnavailable
# 先確認有一個 nginx Deployment 在跑（replicas: 3）
kubectl get deploy nginx-deploy

# 套用自訂策略（maxSurge=1, maxUnavailable=0）
kubectl patch deployment nginx-deploy --patch '
spec:
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0'

# 觸發更新，watch Pod 數量變化
kubectl set image deployment/nginx-deploy nginx=nginx:1.27
kubectl get pods -w
# → 更新期間最多 4 個 Pod 同時存在（3 + maxSurge 1）
#   不會有任何一個 Pod 先被砍（maxUnavailable 0）

# 查歷史版本
kubectl rollout history deployment/nginx-deploy
# → 看到 REVISION 1 / 2，CHANGE-CAUSE 欄位

# 看某個版本的詳細資訊
kubectl rollout history deployment/nginx-deploy --revision=1

# 回滾到指定版本
kubectl rollout undo deployment/nginx-deploy --to-revision=1`,
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
    code: `# 現場 demo：看 rollout history + 舊 RS 沒有消失
kubectl rollout history deployment/nginx-deploy
# → REVISION 1 / 2，記下版本號

# 看舊 RS 還在（副本歸零但沒刪）
kubectl get rs
# → 舊 RS DESIRED=0 CURRENT=0，新 RS DESIRED=3

# 回滾到上一版
kubectl rollout undo deployment/nginx-deploy
kubectl get pods -w   # 看切換過程

# 精確回到指定版本
kubectl rollout undo deployment/nginx-deploy --to-revision=1`,
    notes: `【① 課程內容】
本張投影片重點：回滾原理 + 指令總覽 + Docker 對照。

回滾原理：舊 RS 沒被刪，只是副本歸零 → 回滾 = 把舊 RS 重新擴容。舊 Image 在本機快取 → 回滾速度極快（通常幾十秒）。revisionHistoryLimit 預設保留 10 個版本。

指令總覽：
- 觸發滾動更新：kubectl set image deployment/名稱 容器名=新image
- 看更新進度：kubectl rollout status deployment/名稱
- 回滾到上一版：kubectl rollout undo deployment/名稱
- 回滾到指定版本：kubectl rollout undo --to-revision=N
- 看歷史版本：kubectl rollout history deployment/名稱

Docker 對照：Docker Compose docker-compose up -d = 砍舊建新，中間有空窗期。K8s 的滾動更新是生產環境標配。

【② 指令講解】
（本節為概念補充，詳細指令逐步說明在 5-7 實作。）

【③④ 題目 + 解答】
題目 1：rollout undo 執行後，舊 ReplicaSet 和新 ReplicaSet 的副本數會怎麼變化？
解答：執行 rollout undo 後，舊 RS（副本數原本為 0）會重新擴容至期望副本數，新 RS（副本數原本為 3）會縮減回 0。兩個 RS 都保留，只是角色互換。

題目 2：rollout history 列出 revision 1、2、3。現在想直接回到 revision 1，要怎麼做？只用 rollout undo 能辦到嗎？
解答：不能。rollout undo 不帶參數只回「上一版」（現在 revision 3 → 回到 2）。要精確回到 revision 1，必須用 kubectl rollout undo deployment/<name> --to-revision=1。

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
    notes: `【① 課程內容】
實作目標：把 nginx-deploy 從目前版本更新到 nginx:1.28，觀察滾動更新蹺蹺板，故意更新成錯誤版本練習回滾，使用 --to-revision 指定版本回滾。

操作順序：確認目前 image 版本 → 觸發更新並即時觀察 rollout 狀態 → 看 RS 副本數變化（蹺蹺板）→ 查歷史版本 → 故意設定不存在的 image 版本 → 觀察 ImagePullBackOff → 執行 rollout undo 回滾 → 確認服務恢復。

注意事項：kubectl set image 和 kubectl edit 都能觸發滾動更新。rollout status 會持續輸出直到完成，Ctrl+C 中斷只是停止「看」，更新仍繼續。rollout history 預設 CHANGE-CAUSE 是 <none>，需用 annotate 補記錄。--to-revision=0 等於 undo（回上一版），不是第一版。

【② 指令講解】
確認目前版本：kubectl describe deployment nginx-deploy | grep Image
→ describe deployment nginx-deploy：查看 Deployment 詳細資訊；| grep Image：只過濾出含 Image 的那行
→ 打完要看：Image: nginx:1.25
→ 異常：輸出空白 → Deployment 名稱打錯，用 kubectl get deployment 確認

觸發滾動更新：kubectl set image deployment/nginx-deploy nginx=nginx:1.28
→ set image：更新指定 Deployment 的 container image；nginx=nginx:1.28 格式是「容器名稱=新 image」
→ 打完要看：deployment.apps/nginx-deploy image updated（只代表接受指令，不代表完成）
→ 異常：Error from server (NotFound) → 名稱錯誤；unable to find container named "nginx" → 容器名稱打錯

即時觀察更新：kubectl rollout status deployment/nginx-deploy
→ 打完要看：逐步輸出直到 successfully rolled out
→ 異常：卡著不動超過 2 分鐘 → 開另一個 terminal 跑 kubectl get pods 查狀態；exceeded its progress deadline → 超時需 undo；Ctrl+C 中斷輸出不影響更新繼續進行

觀察 RS 蹺蹺板：kubectl get rs
→ 更新進行中：看到兩個 RS，舊 RS DESIRED 在減少，新 RS DESIRED 在增加
→ 更新完成後：舊 RS DESIRED=0 但物件還在（這是回滾備份）

查歷史：kubectl rollout history deployment/nginx-deploy
→ REVISION 數字越大越新；CHANGE-CAUSE 預設是 <none>

補記原因：kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"
→ 異常：--overwrite is false → 加 --overwrite 旗標；annotation 加在 Deployment，不在 Pod

故意製造壞更新：kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
→ 打完要看：指令本身成功，但 Pod 會 ImagePullBackOff

觀察失敗 Pod：kubectl get pods
→ 舊 Pod 還在 Running，新 Pod 卡在 ImagePullBackOff

回滾上一版：kubectl rollout undo deployment/nginx-deploy
→ 打完要看：deployment.apps/nginx-deploy rolled back
→ 連做兩次 undo 會在最後兩個版本之間來回跳

回滾指定版本：kubectl rollout undo deployment/nginx-deploy --to-revision=1
→ 異常：unable to find specified revision → revision 不存在或超過 revisionHistoryLimit

【③④ 題目 + 解答】
題目 1：執行 kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9 之後，用什麼指令確認 Pod 出現問題？預期看到什麼狀態？
解答：用 kubectl get pods 觀察，會看到新 Pod STATUS 顯示 ImagePullBackOff 或 ErrImagePull。舊 Pod 仍然是 Running（滾動更新發現新 Pod 不健康，不會繼續砍舊 Pod）。

題目 2：kubectl rollout undo 不加任何參數，跑兩次，最後會在哪個版本？為什麼？
解答：假設共有 revision 1、2、3，目前是 revision 3。第一次 undo → 回到 revision 2；第二次 undo → 回到 revision 3（因為 undo 是切換到上一版，而上一版現在變成 3）。結論：連做兩次 undo 會在最後兩個版本之間來回切換。

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
    notes: `【① 課程內容】
本張為學員實作題目頁。必做題完整流程：建 nginx:1.26 Deployment replicas:3 → set image 更新到 1.27 → rollout status 看更新過程 → get rs 確認兩個 ReplicaSet → rollout undo 回滾 → describe | grep Image 確認回到 1.26。

挑戰題：故意用不存在的版本 nginx:99.99，觀察 ImagePullBackOff，注意舊 Pod 還活著（滾動更新的安全機制），再用 rollout undo 救回來。實際工作常見：打錯 Image tag → rollout undo 一行搞定。

【② 指令講解】
（本頁為學員實作，指令已在 5-7 第一張詳細說明。）

【③④ 題目 + 解答】
必做題解答：
1. kubectl create deployment nginx-deploy --image=nginx:1.26 --replicas=3
2. kubectl set image deployment/nginx-deploy nginx=nginx:1.28（依版本調整）
3. kubectl rollout status deployment/nginx-deploy（看到 successfully rolled out）
4. kubectl get rs（看到兩個 RS，一個 3/3，一個 0/0）
5. kubectl rollout undo deployment/nginx-deploy
6. kubectl describe deployment nginx-deploy | grep Image（確認回到舊版）

挑戰題解答：
- kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9 → 指令成功但 Pod 拉不到 image
- kubectl get pods → 新 Pod 狀態 ImagePullBackOff，舊 Pod 仍然 Running
- 重點觀察：K8s 不會把舊 Pod 全砍，滾動更新偵測到新 Pod 不健康，暫停替換
- kubectl rollout undo deployment/nginx-deploy → 壞掉的新 Pod 被砍，舊 Pod 恢復

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
    notes: `【① 課程內容】
本節目標：先帶做一遍滾動更新三指令（5 分鐘），再給學生做 Lab 2 情境題（15 分鐘）：版本事故，強制用 --to-revision 精確回滾。

帶做順序：
1. kubectl set image 觸發更新
2. kubectl rollout status 看進度
3. kubectl rollout undo 回滾（帶做）
4. kubectl rollout history 查歷史（帶做）
5. kubectl rollout undo --to-revision=<n> 指定版本（帶做）

兩個常見坑：
- 坑 1：set image 搞混容器名。等號前面是容器名稱，不是 Deployment 名稱。容器名稱在 spec.template.spec.containers 的 name 欄位，用 kubectl create deployment 建的預設跟 image 名稱相同。
- 坑 2：rollout undo 以為回初始版。undo = 回上一版，不是回到最開始。要精確回到某個版本，用 --to-revision 指定 revision 號。

【② 指令講解】
（本節複習已學指令，無新指令，重點在組合應用。）

【③④ 題目 + 解答】
題目：承接「帶做一遍」後，請說明以下情境：現有 revision 歷史是 1（nginx:1.25）、2（nginx:1.28）、3（nginx:9.9.9 壞版），現在想回到 nginx:1.25，應該執行什麼指令？為什麼不能直接用 rollout undo 不帶參數？

解答：
  kubectl rollout history deployment/nginx-deploy
  # 確認 revision 1 是 nginx:1.25
  kubectl rollout undo deployment/nginx-deploy --to-revision=1
原因：目前在 revision 3，rollout undo 不帶參數只回 revision 2（nginx:1.28），不是 revision 1（nginx:1.25）。必須用 --to-revision=1 才能精確指定。

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
    notes: `【① 課程內容】
Lab 2 情境：深夜 11 點收到警報，有人把 API 更新到壞掉的版本，服務正在掛掉。不准用 rollout undo 不帶參數，要找到正確版本精確回滾。

準備環境（學生自己跑）：
1. kubectl create deployment night-api --image=httpd:2.4 --replicas=2
2. kubectl annotate deployment night-api kubernetes.io/change-cause="v1: 正常版本"
3. kubectl rollout status deployment/night-api
4. kubectl set image deployment/night-api httpd=httpd:99.99.99
5. kubectl annotate deployment night-api kubernetes.io/change-cause="v2: 緊急更新（錯誤版本）" --overwrite

任務（不給指令提示，自己想）：確認 Pod 壞掉狀態 → 查部署歷史找正常版本 → 回滾到那個版本（不准用 rollout undo 不帶參數）→ 驗證 Pod 全 Running 且跑 httpd:2.4。

【② 指令講解】
（Lab 不給指令提示，考驗學員能否組合 rollout history + --to-revision 解決問題。）

【③④ 題目 + 解答（Lab 2 完整詳解）】
Step 1：確認 Pod 狀態
kubectl get pods  → 看到 ErrImagePull 或 ImagePullBackOff
kubectl get deploy  → READY: 0/2 或 1/2

Step 2：查部署歷史
kubectl rollout history deployment/night-api
→ REVISION 1：v1: 正常版本；REVISION 2：v2: 緊急更新（錯誤版本）
→ 目標版本是 revision 1（httpd:2.4）

Step 3：精確回滾到 revision 1
kubectl rollout undo deployment/night-api --to-revision=1
→ deployment.apps/night-api rolled back

Step 4：驗收
kubectl get pods  → 全部 Running
kubectl describe deployment night-api | grep Image  → Image: httpd:2.4
kubectl describe pod <pod-name> | grep Image  → 也能確認
kubectl rollout history deployment/night-api  → revision 3 會出現（每次 rollout 都是新的 revision）

清理：kubectl delete deployment night-api

老師補充說明：
- rollout undo 不帶參數只回「上一版」——這裡 revision 2 → revision 1 剛好對，但如果有四個 revision 且已 undo 過一次，再 undo 就在最後兩版間來回，永遠跳不到更舊的
- --to-revision 才能精確指定任意歷史版本，是生產環境的正確做法
- 每次 rollout（包括 undo）都會產生一個新的 revision，history 越來越長
- kubectl describe deployment | grep Image 或 describe pod | grep Image 都能確認 image，前者看 Deployment spec，後者看 Pod 實際跑的

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
    code: `# 現場 demo：手動刪 Pod，看 K8s 自動補回來
kubectl get pods   # 確認 3 個 Running

kubectl delete pod <你的pod名稱>   # 刪一個

kubectl get pods -w
# → 馬上看到新 Pod 出現，AGE 是幾秒
# → 舊 Pod Terminating，新 Pod Running
# → 副本數永遠維持在 3`,
    notes: `【① 課程內容】
自我修復（Self-Healing）是什麼：當 Pod 掛掉（崩潰、被手動刪除、節點故障），K8s 會自動補回來。不是魔法，是 ReplicaSet 的 Controller Loop 在背後持續運作。核心機制：「實際狀態 vs 期望狀態」的差異偵測與修正。

Controller Manager 的角色：kube-controller-manager 是 K8s 控制平面元件，裡面跑著各種 Controller。每個 Controller 跑一個 reconciliation loop（調和循環）：持續問「現在實際有幾個 Pod？」對比「Deployment 期望幾個？」，差多少就補多少、多幾個就刪幾個。這就是為什麼手動刪一個 Pod 它會自己長回來。

複習說明：Labels 三處位置（Deployment 本身 / selector / Pod template）已在 5-3 介紹過。本節重點是「進階操作」：用指令實際操控 label、觀察 K8s 如何反應。

Labels 進階操作場景：--show-labels 看 Pod 所有 label；-l 過濾操作；手動對 Pod 加 label；批次用 label 刪 Pod 觸發自我修復；「孤兒 Pod」實驗。

孤兒 Pod（Orphan Pod）：把受 Deployment 管轄 Pod 的 label 改掉（不符合 selector），Deployment 看不到它以為少了副本，立刻補新 Pod。舊 Pod 變「沒人管的孤兒」繼續跑。最終結果：原本 3 個 → 變成 4 個（3 個被管 + 1 個孤兒）。用途：除錯時先把問題 Pod 從 Deployment 隔離，不影響其他 Pod，慢慢調查。

pod-template-hash：K8s 自動加在每個 Pod 上的 label，值是 Pod template 內容的 hash。由 ReplicaSet controller 設定。滾動更新時區分新舊版本的 Pod。不要手動刪它，刪掉後 Pod 脫離 ReplicaSet 管理變孤兒。

Label vs Annotation 差別（常考）：
- Label：能被 selector 選取；適合短識別標籤（app=nginx）；用途是關聯資源
- Annotation：不能被 selector 選取；適合長文字/JSON/說明；典型用途是 change-cause、CI/CD 資訊

【② 指令講解】
（本節為概念課，指令集中在 5-10 實作。）

【③④ 題目 + 解答】
題目 1：「孤兒 Pod」是怎麼產生的？在什麼除錯場景下會刻意製造孤兒 Pod？
解答：對受 Deployment 管轄的 Pod 執行 kubectl label pod <name> app=other --overwrite，把 label 改成不符合 selector 的值，Deployment 就看不到這個 Pod，立刻補一個新的。舊 Pod 繼續跑但沒有任何 controller 管理。除錯用途：當某個 Pod 出現異常行為，先把它從 Deployment「摘出來」（改 label），讓 Deployment 補一個正常 Pod 繼續服務，再對孤兒 Pod 執行 kubectl exec 或 kubectl describe 調查，不影響正常 Pod 的服務。

題目 2：Label 和 Annotation 有什麼差別？各自適合用在什麼場合？
解答：Label 設計用來被 selector 選取，適合用於資源關聯（Service 選 Pod、Deployment 認領 Pod）和過濾查詢。值要簡短，不建議放長文字。Annotation 設計用來存放「給人看的 metadata」，不能被 selector 選取，適合放部署說明、變更原因、工具自動寫入的資訊（如 change-cause）。值可以很長，也可以是 JSON。

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

        <div className="bg-purple-900/30 border border-purple-500/40 p-4 rounded-lg">
          <p className="text-purple-400 font-semibold mb-2">真實場景：用 Label 做 GPU 排程</p>
          <p className="text-slate-300 text-sm mb-3">公司叢集有些機器有 GPU、有些沒有。K8s 預設不知道哪台有 GPU，要自己貼標籤告訴它。</p>
          <div className="space-y-2 text-sm">
            <div className="bg-slate-900/50 p-2 rounded font-mono text-xs">
              <p className="text-slate-500 mb-1"># 先幫有 GPU 的機器貼標籤（只需做一次）</p>
              <p className="text-green-400">kubectl label node gpu-node-1 gpu=true</p>
              <p className="text-green-400">kubectl label node gpu-node-2 gpu=true</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/50 p-2 rounded">
                <p className="text-yellow-300 mb-1">Node 現況</p>
                <p className="text-slate-300">gpu-node-1 → 🏷️ gpu=true</p>
                <p className="text-slate-300">gpu-node-2 → 🏷️ gpu=true</p>
                <p className="text-slate-400">cpu-node-1 → （沒貼）</p>
                <p className="text-slate-400">cpu-node-2 → （沒貼）</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <p className="text-yellow-300 mb-1">Deployment YAML</p>
                <p className="text-slate-300">spec:</p>
                <p className="text-slate-300 pl-2">template:</p>
                <p className="text-slate-300 pl-4">spec:</p>
                <p className="text-cyan-400 pl-6">nodeSelector:</p>
                <p className="text-green-400 pl-8">gpu: "true"</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs">nodeSelector 的意思：「只把我的 Pod 排到有 gpu=true 標籤的機器上」</p>
          </div>
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
kubectl get pods -l env=test

# 看所有 Node 及其 Label（確認機器名稱用這個）
kubectl get nodes --show-labels`,
    notes: `【① 課程內容】
本張重點：Labels 進階操作概念 + Selector 機制 + Label vs Annotation 對照。

Labels 三處位置黃金法則（Deployment selector / Pod template labels / Service selector 三者要對上）：
- Deployment selector：matchLabels: app: nginx → 我要管有這標籤的 Pod
- Pod template labels：app: nginx → 建出來的 Pod 帶這標籤
- Service selector：app: nginx → 把流量導到有這標籤的 Pod
→ 三個沒對上 = Deployment 認不到 Pod / Service 導不到流量，是最常見的配對錯誤

進階用法預告：
- kubectl get pods --show-labels → 看所有 label
- kubectl get pods -l app=nginx → 用 label 篩選
- kubectl label pod <name> env=test → 手動加 label（只影響這個 Pod，不影響 Deployment）

真實場景補充：Label 不只用在 Pod，也可以貼在 Node 上，搭配 nodeSelector 做 Pod 排程控制。
典型用途：GPU 機器貼 gpu=true → Deployment 裡加 nodeSelector: gpu: "true" → Scheduler 只會把 Pod 排到有 GPU 的機器。
操作說明：
1. kubectl get nodes 先確認你的機器名稱（名字不是固定的，要看實際叢集）
2. kubectl label node <node-name> gpu=true → 貼標籤
3. Deployment YAML spec.template.spec 下加 nodeSelector: gpu: "true"
→ 下次 Scheduler 安排新 Pod 時，只有有 gpu=true 的 Node 才是候選

【② 指令講解】
kubectl get pods --show-labels
→ 在輸出最後加一欄 LABELS，顯示每個 Pod 的所有 label
→ 打完要看：app=nginx 和 pod-template-hash 兩個 label

kubectl get pods -l app=nginx
→ -l 是 --selector 縮寫，只列出有 app=nginx label 的 Pod
→ 異常：No resources found → 沒有任何 Pod 有這個 label，確認 key/value 是否打對

kubectl label pod <pod-name> env=test
→ 只在這個 Pod 生命週期內有效，Pod 重啟後消失（Pod 是 immutable，重啟等於重建）
→ 異常：already has a value → 加 --overwrite

【③④ 題目 + 解答】
題目 1：為什麼 Deployment selector 和 Pod template labels 必須一致？如果不一致會發生什麼？
解答：Deployment 靠 selector 找 Pod。如果 selector 是 app=nginx 但 template labels 是 app=web，Deployment 建出的 Pod 不符合 selector，它以為 Pod 不夠然後不斷建新 Pod，陷入死循環。K8s 建立 Deployment 時會直接報錯 The Deployment is invalid，阻止這種配置。

題目 2：kubectl get pods -l app=nginx 和 kubectl get pods --show-labels 有什麼不同用途？
解答：-l app=nginx 是篩選，只列出符合條件的 Pod，適合 Pod 很多時快速找到目標。--show-labels 是顯示所有 Pod 並附上標籤欄位，適合確認每個 Pod 的 label 是否正確，不篩選。兩者可以組合：kubectl get pods -l app=nginx --show-labels。

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
    notes: `【① 課程內容】
實作目標：親眼看到 Pod 被刪掉後自動補回來，觀察 Pod 上的 label，手動給 Pod 加 label，用 -l 過濾 Pod，用 label 做批次刪除，看 Deployment 的 selector 設定。

自我修復觀察重點：刪掉 Pod 後，注意看新 Pod 的 AGE 欄位，會看到一個很年輕的新 Pod 出現。Pod 的 NAME 會不一樣（有隨機 suffix），但功能完全相同。這代表 reconciliation loop 偵測到 Pod 數量不足，自動補上了。

注意事項：kubectl label pod 加上的 label 只在這個 Pod 生命週期內有效，Pod 重啟後消失。如果想讓所有 Pod 都有某個 label，要改 Deployment 的 template.metadata.labels。kubectl delete pod -l <selector> 很強大，操作前一定要先用 kubectl get pods -l 確認選到的是哪些 Pod，再執行刪除。

【② 指令講解】
查看 Pod 所有 Labels：kubectl get pods --show-labels
→ 打完要看：app=nginx 和 pod-template-hash 兩個 label
→ 異常：LABELS 欄位只有 pod-template-hash 沒有 app → Deployment template labels 設定有問題

手動給 Pod 加 Label：kubectl label pod <pod-name> env=test
→ 打完要看：pod/xxx labeled，再用 --show-labels 確認多了 env=test
→ 異常：already has a value → 加 --overwrite；Pod 名稱打錯 → NotFound

用 Label 過濾（精確比對）：kubectl get pods -l app=nginx
→ 打完要看：只顯示符合條件的 Pod
→ 異常：No resources found → label key/value 打錯

觀察自我修復：kubectl delete pod <pod-name>
→ 刪除後立刻跑 kubectl get pods
→ 打完要看：新 Pod 的 AGE 只有 2 秒，NAME 不同，STATUS 是 ContainerCreating
→ 異常：Pod 刪掉後沒有新 Pod 補回 → spec.replicas 可能是 0，或有 ResourceQuota 限制

用 Label 批次刪除 Pod：kubectl delete pod -l app=nginx
→ 先用 kubectl get pods -l app=nginx 確認要刪的範圍再執行
→ 打完要看：每個被刪的 Pod 都會輸出 deleted，馬上看到 Deployment 正在補新 Pod

查看 Deployment 的 Selector：kubectl describe deployment nginx-deploy
→ 打完要看：Selector、Replicas、StrategyType、Pod Template Labels 是否一致
→ 異常：Selector 和 Pod Template Labels 不一致 → bug，需要重建 Deployment

【③④ 題目 + 解答】
題目（Lab 3 預告）：
情境：正式環境跑著 3 個 Pod 的 nginx 服務。其中一個 Pod 行為異常，你需要把它「隔離」出來調查，同時不能中斷服務。

任務：確認目前有 3 個 Pod → 選一個 Pod 把 app label 改成 app=isolated → 觀察 Pod 總數 → 對孤兒 Pod 執行 kubectl describe → 調查完畢手動刪除孤兒 Pod。

解答要點：
- 改 label 後 Pod 總數變 4（3 個 app=nginx + 1 個 app=isolated）
- Deployment READY 仍然是 3/3（已自動補一個新 Pod）
- 孤兒 Pod 繼續存活但不受任何 controller 管理，是穩定的調查對象
- 調查完一定要手動刪，否則殘留孤兒 Pod 佔用資源

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
    notes: `【① 課程內容】
Lab 3 情境：正式環境跑著 3 個 Pod 的 nginx 服務。其中一個 Pod 行為異常（回應很慢，但還沒死）。需要把它「隔離」出來調查，同時不能中斷服務。

為什麼用孤兒 Pod 而不是其他方法：
- 直接刪 Pod：Pod 消失，無法調查根本原因
- scale 到 1 留問題 Pod：其他正常 Pod 被砍，服務降容影響用戶
- 改 label 孤兒化：Deployment 補新 Pod 繼續服務，舊 Pod 穩定存活等你查

任務：確認 3 個 Pod（--show-labels 看）→ 選一個 Pod 把 app label 改成 app=isolated → 觀察 Pod 總數變幾個 Deployment READY 是什麼 → 對孤兒 Pod 執行 kubectl describe 找出 Node Events 狀態 → 調查完畢手動刪除孤兒 Pod 確認恢復 3 個 Pod。

驗收：能說出孤兒 Pod 在哪個 Node；能說明 Deployment 為什麼自動補 Pod；最後 kubectl get pods 回到 3 個 Running。

【② 指令講解】
（Lab 不給指令提示，考驗學員能否應用 label 操作。）

【③④ 題目 + 解答（Lab 3 完整詳解）】
Step 1：確認 Pod + 看 labels
kubectl get pods --show-labels
→ 記下一個 Pod 的名字，例如 nginx-deploy-xxx-aaa

Step 2：改 label，孤兒化
kubectl label pod nginx-deploy-xxx-aaa app=isolated --overwrite
→ 輸出：pod/nginx-deploy-xxx-aaa labeled

Step 3：觀察
kubectl get pods --show-labels
→ 看到 4 個 Pod：3 個 app=nginx + 1 個 app=isolated
kubectl get deploy
→ READY 仍然是 3/3（Deployment 已自動補一個新 Pod）

Step 4：調查孤兒 Pod
kubectl describe pod nginx-deploy-xxx-aaa
→ 重點看：Node、Labels（確認 app=isolated）、Events

Step 5：清理
kubectl delete pod nginx-deploy-xxx-aaa
kubectl get pods  → 回到 3 個

老師補充說明重點：
- 孤兒化的核心：改掉 label → 脫離 Deployment selector → Deployment 以為副本不足 → 補新 Pod
- 孤兒 Pod 不受任何控制器管，不會被自動重啟也不會被自動刪除，是穩定的調查對象
- 這是生產環境工程師實際使用的技巧，不是玩具實驗
- 調查完一定要手動刪，否則殘留孤兒 Pod 佔用資源

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
    notes: `【① 課程內容】
上午回顧重點：
- Deployment 完整生命週期：建立 → 更新（滾動）→ 失敗 → 回滾
- ReplicaSet 的角色：滾動更新的蹺蹺板、自我修復的執行者
- Labels 三處位置：Deployment 本身 / selector / Pod template，三者關係
- Selector 是 K8s 資源關聯的核心機制

本節操作：帶做一遍 Loop 3 操作 → 上午小測驗 → 對照解答確認理解 → 提問與補充說明。

【② 指令講解】
（本節為複習段，以問答為主，無新指令。）

【③④ 題目 + 解答（上午小測驗，共 5 題）】
第 1 題：nginx:1.25 → nginx:1.28 完整流程（至少 3 個指令，依序排列）
解答：
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
kubectl rollout status deployment/nginx-deploy
kubectl describe deployment nginx-deploy | grep Image
加分：kubectl get rs（看 RS 蹺蹺板）、kubectl rollout history（看版本歷史）

第 2 題：kubectl rollout undo 跑兩次，最後在哪個版本？為什麼？
解答：回到 nginx:1.28（undo 之前的那個版本）。第一次 undo 從版本 N 切到 N-1，K8s 同時記錄為新的 revision N+1。第二次 undo 從 N+1 切回 N。兩次 undo 等於在兩個版本之間來回切換，不會繼續往更舊的走。

第 3 題：YAML 有 bug（selector.matchLabels.app=web 但 template.labels.app=website），找出來說明問題
解答：selector 和 pod template labels 不一致。建立時 K8s 直接報錯（The Deployment is invalid）。即使繞過，controller loop 永遠找不到符合 selector 的 Pod，會不斷創建新 Pod，Pod 數量失控增長。修正：把 template.metadata.labels.app 改為 web。

第 4 題：一次刪掉所有 app=api 的 Pod，驗證 Deployment 已補回來
解答：
kubectl get pods -l app=api（先確認範圍）
kubectl delete pod -l app=api（批次刪除）
kubectl get pods（立刻看到 ContainerCreating 狀態）
kubectl get pods -l app=api（等幾秒後確認 10 個全部 Running，AGE 很短）

第 5 題：pod-template-hash 是什麼？是誰加的？可以手動刪除嗎？
解答：K8s 自動加上的 label，由 ReplicaSet controller 設定。值是 Pod template 內容的 hash，用來區分同一個 Deployment 在不同版本（revision）下建出的 Pod。不建議手動刪除：刪掉後 Pod 脫離 ReplicaSet 管理，變成孤兒 Pod，Deployment 會補新的，且孤兒不會被自動清理。

[▶ 下一頁]`,
  },
]
