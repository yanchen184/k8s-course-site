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
  // ── Slide 1 開場 ───────────────────────────────
  {
    title: "第四堂：Kubernetes 全貌 + 環境搭建",
    subtitle: "從 Docker 到容器編排的新世界",
    section: "開場",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">前三堂我們走過的路</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-center py-2 w-20">堂次</th>
                <th className="text-left py-2">學了什麼</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Day 1</td>
                <td className="py-2">Linux 基礎 — 終端機、檔案、網路</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Day 2</td>
                <td className="py-2">Docker 基礎 — Image、Container、Port、Volume</td>
              </tr>
              <tr>
                <td className="text-center py-2">Day 3</td>
                <td className="py-2">Docker 進階 — Dockerfile、Docker Compose</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">今天開始：Kubernetes</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>- 上午：概念 + 架構 + 環境搭建（不寫 YAML，純聽課）</p>
            <p>- 下午：Pod 實作（寫 YAML、部署、排錯）</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">先裝起來！趁我講課的時候讓它跑</p>
          <p className="text-slate-400 text-sm">安裝指令請見 code 區塊</p>
        </div>
      </div>
    ),
    code: `# 1. 安裝 minikube（Ubuntu / Debian）
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# 2. 安裝 kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl

# 3. 啟動叢集（需要先有 Docker）
minikube start

# 4. 驗證
minikube status
kubectl get nodes`,
    notes: `各位同學早安，歡迎來到第四堂課。前三堂課我們從 Linux 基礎開始，認識了 CLI 的操作——cd 切目錄、mkdir 建資料夾、touch 建檔案、vim 和 nano 編輯文字檔；接著進入 Docker 的世界，用 docker pull 拉 image、docker build 打包自己的 image、docker run 把 image 跑起來變成 container；第三堂課再用 Dockerfile 定義打包流程，用 docker compose up 一次把多個 container 串起來跑。

到目前為止，所有操作都是在一台機器上完成的。開發測試沒問題，但要上線到生產環境，只靠一台機器、靠 Docker Compose 是不夠的。從今天開始，我們進入 Kubernetes 的領域。

在我講概念的這段時間，請大家先把 minikube 裝起來。螢幕上有完整的安裝指令，就是這四個步驟：下載 minikube、下載 kubectl、minikube start 啟動叢集、kubectl get nodes 驗證。安裝需要一點時間，趁我講的時候讓它在背景跑，等講到實作就可以直接用了。`,
    duration: "5"
  },

  // ── Slide 2 為什麼需要 Kubernetes ─────────────────
  {
    title: "為什麼需要 Kubernetes",
    subtitle: "容器越來越多，怎麼管？",
    section: "核心概念",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">容器越來越多，怎麼管？</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-center py-2 w-24">容器數量</th>
                <th className="text-left py-2">管理方式</th>
                <th className="text-left py-2">問題</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">1-5 個</td>
                <td className="py-2"><code>docker run</code></td>
                <td className="py-2">沒問題</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">5-20 個</td>
                <td className="py-2">Docker Compose</td>
                <td className="py-2">單機極限</td>
              </tr>
              <tr>
                <td className="text-center py-2">成百上千</td>
                <td className="py-2">？？？</td>
                <td className="py-2">腳本管不動了</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">容器多了、機器多了之後的五大問題</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-blue-400 font-semibold">調度</span> — 容器該放哪台機器？哪台有空位？</p>
            <p>2. <span className="text-blue-400 font-semibold">故障恢復</span> — 某台機器掛了，上面的容器怎麼辦？</p>
            <p>3. <span className="text-blue-400 font-semibold">彈性擴縮</span> — 流量暴增，怎麼快速加容器？退了怎麼縮回來？</p>
            <p>4. <span className="text-blue-400 font-semibold">滾動更新</span> — 更新版本的時候，怎麼不中斷服務？</p>
            <p>5. <span className="text-blue-400 font-semibold">服務發現</span> — 容器之間怎麼互相找到對方？</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Docker Compose 能解決嗎？</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- Docker Compose 只能管一台機器上的容器</p>
            <p>- 跨機器？它做不到</p>
            <p>- 自動故障恢復？它做不到</p>
            <p>- 自動擴縮容？它做不到</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">我們需要一個「容器的管理平台」</p>
        </div>
      </div>
    ),
    notes: `好，我們先來聊一個問題：為什麼需要 Kubernetes？

大家回想一下，上一堂課我們用 Docker Compose 把好幾個容器串在一起跑，感覺很方便對不對？一個 docker compose up 就全部起來了。但是我請大家想像一個場景：假設你在一間電商公司工作，你的系統有前端、後端 API、資料庫、Redis 快取、訊息佇列，每個服務可能還要跑好幾個副本來分散流量。算一算，光一套系統可能就要跑二三十個容器，如果再加上測試環境、預備環境，容器數量可能就上百了。

這個時候問題就來了。第一，這些容器要分散到好幾台機器上跑，那每個容器該放哪台機器？哪台機器的 CPU 和記憶體還有空間？第二，如果某台機器突然掛了，上面跑的十幾個容器就全部停了，怎麼辦？第三，像雙十一或者週年慶的時候，流量突然暴增好幾倍，你需要快速地多開一些容器來應對，流量退了之後又要縮回來，不然浪費資源。第四，你的應用程式更新版本了，要怎麼做到逐步替換、不中斷服務？第五，容器之間要互相溝通，但容器的 IP 會變，它們怎麼找到彼此？

這五個問題，Docker Compose 一個都解決不了。因為 Docker Compose 的設計就是管一台機器上的容器，它沒有辦法跨機器調度，也沒有自動故障恢復和彈性擴縮的能力。

所以我們需要一個更高層次的工具，一個能管理跨多台機器、成百上千個容器的平台。這就是 Kubernetes 存在的理由。`,
    duration: "10"
  },

  // ── Slide 3 K8s 是什麼 + 能力 ─────────────────────
  {
    title: "K8s 是什麼",
    subtitle: "容器的管理平台（容器編排引擎）",
    section: "核心概念",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">一句話：容器的管理平台（容器編排引擎）</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>- Google 內部用 <span className="text-blue-400 font-semibold">Borg</span> 系統管理數十億個容器</p>
            <p>- 2014 年 Google 把經驗開源 → <span className="text-blue-400 font-semibold">Kubernetes</span></p>
            <p>- 捐給 CNCF（Cloud Native Computing Foundation）</p>
            <p>- K8s = K + 8個字母 + s = Kubernetes</p>
            <p>- 目前是容器編排領域的<span className="text-blue-400 font-semibold">行業標準</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">K8s 解決的問題（對應上一頁）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">問題</th>
                <th className="text-left py-2">K8s 怎麼解決</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">調度</td>
                <td className="py-2">Scheduler 自動把容器分配到最適合的機器</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">故障恢復</td>
                <td className="py-2">機器掛了 → 自動把容器搬到其他機器重建</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">彈性擴縮</td>
                <td className="py-2">一行指令或自動根據負載增減容器數量</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">滾動更新</td>
                <td className="py-2">逐步用新版本替換舊版本，零停機</td>
              </tr>
              <tr>
                <td className="py-2">服務發現</td>
                <td className="py-2">內建 DNS，容器用名字就能找到對方</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">其他能力</p>
          <p className="text-slate-300 text-sm">災難恢復、負載均衡、配置管理、密碼管理、儲存管理</p>
        </div>
      </div>
    ),
    notes: `那 Kubernetes 到底是什麼？用一句話來說，它就是一個容器的管理平台，學術一點的說法叫「容器編排引擎」。

Google 內部有一套系統叫做 Borg，從 2003 年就開始用了，專門管理 Google 全球資料中心裡面數十億個容器。2014 年，Google 把 Borg 的核心思想整理出來，開源了 Kubernetes，希臘語「舵手」的意思，後來捐給了 CNCF（雲原生計算基金會）。因為 Kubernetes 太長了，大家縮寫成 K8s——K 和 s 之間剛好 8 個字母。

回到剛剛的五個問題，K8s 每一個都有對應的解決方案。調度？K8s 的 Scheduler 組件會自動看哪台機器資源最充足，把容器分配過去。故障恢復？某台機器掛了，K8s 自動偵測到，把容器搬到其他健康的機器重建。彈性擴縮？一行 kubectl scale 指令把副本數從 3 改成 10，也可以設定根據 CPU 使用率自動擴縮。滾動更新？逐步用新版本容器替換舊版本，零停機。服務發現？內建 DNS，容器之間用名字找到對方，不用記 IP。

除了這些，K8s 還有負載均衡、配置管理、密碼管理、儲存管理等能力。目前所有主流雲平台——Google GKE、AWS EKS、Azure AKS——都支援 Kubernetes，它就是容器編排的行業標準。`,
    duration: "5"
  },

  // ── Slide 4 核心概念：Node + Pod + Service ─────────
  {
    title: "核心概念：Node + Pod + Service",
    subtitle: "從一個最簡單的例子開始，一步步引入概念",
    section: "核心概念",
    content: (
      <div className="space-y-3">
        {/* 示意圖：User → Service → Pods on Nodes */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* 外部使用者 */}
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-amber-400 text-xs font-semibold">外部使用者</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            {/* Service */}
            <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-cyan-400 text-xs font-semibold">Service</p>
              <p className="text-slate-500 text-[10px]">穩定入口</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            {/* Nodes with Pods */}
            <div className="flex gap-2">
              <div className="border border-green-500/40 rounded-lg p-2 bg-green-900/20">
                <p className="text-green-400 text-[10px] font-semibold mb-1 text-center">Node 1</p>
                <div className="flex gap-1">
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                    <p className="text-green-300 text-[10px]">Pod A</p>
                  </div>
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                    <p className="text-green-300 text-[10px]">Pod B</p>
                  </div>
                </div>
              </div>
              <div className="border border-green-500/40 rounded-lg p-2 bg-green-900/20">
                <p className="text-green-400 text-[10px] font-semibold mb-1 text-center">Node 2</p>
                <div className="flex gap-1">
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                    <p className="text-green-300 text-[10px]">Pod C</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Node（節點）</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 一台機器（實體機或虛擬機）</p>
              <p>- K8s 叢集由多個 Node 組成</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Pod（最小調度單位）</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 一個或多個容器的組合</p>
              <p>- 容器在 Pod 裡共享網路和儲存</p>
              <p>- 最佳實踐：一個 Pod 放一個容器</p>
              <p>- 多容器 → Sidecar 模式</p>
              <p>- 對照：<code>docker run</code> 一個容器 ≈ 一個 Pod</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">為什麼需要 Service？</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>問題 1：Pod IP 是叢集內部的 → 外面連不到</p>
            <p>問題 2：Pod 會被銷毀重建 → IP 會變</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Service = 穩定的存取入口</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- Pod 掛了換新的 → Service 地址不變</p>
            <p>- 自動轉發到健康的 Pod</p>
            <p>- 對照：<code>docker run -p 8080:80</code> 做 port mapping</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Service 類型</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">類型</th>
                <th className="text-left py-2">作用</th>
                <th className="text-left py-2">存取範圍</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">ClusterIP（預設）</td>
                <td className="py-2">叢集內部存取</td>
                <td className="py-2">內部</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">NodePort</td>
                <td className="py-2">在 Node 上開 Port</td>
                <td className="py-2">外部</td>
              </tr>
              <tr>
                <td className="py-2">LoadBalancer</td>
                <td className="py-2">外部負載均衡器</td>
                <td className="py-2">外部</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，現在來認識 Kubernetes 的核心概念。從一個最簡單的例子開始，一步步引入。

首先是 Node，就是「節點」，一個 Node 就是一台機器，可以是實體伺服器或虛擬機。K8s 叢集由多個 Node 組成。

接下來是 Pod，K8s 最小的調度單位——注意不是容器，而是 Pod。一個 Pod 裡面可以包含一個或多個容器，這些容器共享網路和儲存，你可以把 Pod 想成容器外面包的一層殼。實際使用中，建議一個 Pod 放一個容器，比較好管理和擴展。什麼時候放多個容器？Sidecar 模式——主程式旁邊放一個輔助容器做日誌收集或監控。用 Docker 對照：docker run 跑一個容器，大概等於 K8s 裡一個 Pod。

接著來看 Service。假設你的應用程式 Pod 要連資料庫 Pod，需要知道對方的 IP。但有兩個問題：第一，Pod IP 是叢集內部的，外面連不到；第二，Pod 可能因故障被銷毀重建，重建後 IP 就變了。你的程式寫死 IP，Pod 一重建就斷線了。

K8s 的 Service 解決這個問題。Service 是一個穩定的存取入口——不管後面的 Pod 怎麼換、IP 怎麼變，Service 地址不變，自動把請求轉發到健康的 Pod。對照 Docker：像 docker run -p 做 port mapping，但 Service 還多了自動負載均衡和故障轉移。

Service 有三種類型：ClusterIP 是預設的，只能叢集內部存取，適合資料庫這種不需要暴露給外部的服務；NodePort 在每個 Node 上開一個 Port 讓外部連進來；LoadBalancer 搭配雲平台的負載均衡器使用。`,
    duration: "15"
  },

  // ── Slide 5 核心概念：Ingress + ConfigMap + Secret ──
  {
    title: "核心概念：Ingress + ConfigMap + Secret",
    subtitle: "HTTP 路由 + 設定檔 + 敏感資料管理",
    section: "核心概念",
    content: (
      <div className="space-y-3">
        {/* 示意圖：Ingress 路由 + ConfigMap/Secret */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg space-y-3">
          {/* Ingress 路由示意 */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg">
              <p className="text-amber-400 text-xs font-semibold">使用者</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg">
              <p className="text-cyan-400 text-xs font-semibold">Ingress</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-bold">→</span>
                <span className="text-slate-400 text-xs font-mono">/api</span>
                <span className="text-slate-400 text-sm font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-[10px] font-semibold">API Service</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm font-bold">→</span>
                <span className="text-slate-400 text-xs font-mono">/</span>
                <span className="text-slate-500 text-xs">{"   "}</span>
                <span className="text-slate-400 text-sm font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-[10px] font-semibold">Frontend Service</p>
                </div>
              </div>
            </div>
          </div>
          {/* ConfigMap / Secret → Pod */}
          <div className="border-t border-slate-700 pt-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="bg-blue-900/40 border border-blue-500/40 px-2 py-1 rounded">
                <p className="text-blue-300 text-[10px] font-mono">ConfigMap: DB_HOST=xxx</p>
              </div>
              <span className="text-slate-400 text-sm font-bold">→</span>
              <div className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded" style={{minWidth: 0}}>
                <p className="text-green-300 text-[10px]">Pod 環境變數</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-900/40 border border-red-500/40 px-2 py-1 rounded">
                <p className="text-red-300 text-[10px] font-mono">Secret: PASSWORD=***</p>
              </div>
              <span className="text-slate-400 text-sm font-bold">→</span>
              <div className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded" style={{minWidth: 0}}>
                <p className="text-green-300 text-[10px]">Pod 環境變數</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Ingress — HTTP 路由器</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- NodePort 用 IP + Port 存取 → 開發測試 OK</p>
            <p>- 生產環境要用域名（<code>www.example.com</code>）</p>
            <p>- Ingress = 管理外部 HTTP 存取的入口</p>
            <p className="pl-4">- 不同域名 → 不同 Service</p>
            <p className="pl-4">- 不同路徑（<code>/api</code>、<code>/web</code>）→ 不同 Service</p>
            <p className="pl-4">- 可配置 SSL 憑證（HTTPS）</p>
            <p>- 對照 Docker：在 Docker 裡面用 Nginx 做反向代理</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">ConfigMap — 設定檔管理</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 問題：資料庫地址寫死在 Image 裡 → 改地址就要重新 build</p>
              <p>- ConfigMap = 把設定抽出來，跟 Image 分離</p>
              <p>- 修改設定 → 不用重新 build Image</p>
              <p>- 修改 ConfigMap → 重新載入 Pod 即可</p>
            </div>
            <div className="mt-2 bg-amber-900/30 border border-amber-500/40 p-2 rounded">
              <p className="text-amber-400 text-xs font-semibold">注意：明文儲存，不放密碼</p>
            </div>
            <p className="text-slate-400 text-xs mt-2">對照：docker run -e DB_HOST=xxx</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Secret — 敏感資料管理</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 密碼、API Key、憑證 → 不該放 ConfigMap</p>
              <p>- Secret = 跟 ConfigMap 類似，但做了 Base64 編碼</p>
            </div>
            <div className="mt-2 bg-amber-900/30 border border-amber-500/40 p-2 rounded">
              <p className="text-amber-400 text-xs font-semibold">注意：Base64 是編碼不是加密，需搭配其他安全機制</p>
            </div>
            <p className="text-slate-400 text-xs mt-2">對照：.env 檔案</p>
          </div>
        </div>
      </div>
    ),
    notes: `繼續往下看三個概念：Ingress、ConfigMap 和 Secret。

先說 Ingress。剛剛講到 NodePort 讓外部用 IP 加 Port 連進來，比如 192.168.1.100:30080。開發測試可以，但生產環境不能讓使用者輸入 IP 和 Port，使用者要的是 www.example.com。

Ingress 就是 HTTP 層的路由器，根據域名或路徑把請求轉發到不同的 Service。比如 www.example.com 導到前端 Service，api.example.com 導到後端 Service，還可以配置 SSL 憑證支援 HTTPS。對照 Docker：就像你架 Nginx 做反向代理，但在 K8s 裡面是內建的資源物件，用 YAML 就能設定。

接著是 ConfigMap。回想 Docker 的做法：docker run -e DB_HOST=xxx 把資料庫地址用環境變數傳進去。但如果地址寫死在 Image 裡面呢？資料庫換地址就得重新 docker build、重新部署。

K8s 的 ConfigMap 把設定抽出來——資料庫地址、Port、各種參數全部放 ConfigMap，Image 裡面不包含任何設定。修改設定只要改 ConfigMap 再重啟 Pod，不需要重新 build Image。

注意：ConfigMap 是明文儲存的。密碼、API Key 這類敏感資訊要用 Secret。Secret 用法跟 ConfigMap 幾乎一樣，但會做一層 Base64 編碼。特別強調：Base64 是編碼不是加密，拿到字串就能用 base64 -d 解回來。光靠 Secret 不能保證安全，還要搭配 RBAC 權限控制。對照 Docker：Secret 就像你的 .env 檔案。`,
    duration: "10"
  },

  // ── Slide 6 核心概念：Volume + Deployment + StatefulSet ──
  {
    title: "核心概念：Volume + Deployment + StatefulSet",
    subtitle: "資料持久化 + 副本管理 + 有狀態應用",
    section: "核心概念",
    content: (
      <div className="space-y-3">
        {/* 示意圖：Deployment → ReplicaSet → Pods */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <div className="flex flex-col items-start gap-1 pl-2">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg">
                <p className="text-cyan-400 text-xs font-semibold">Deployment</p>
                <p className="text-slate-500 text-[10px]">你管這個</p>
              </div>
            </div>
            <div className="flex items-center gap-1 pl-4">
              <span className="text-slate-500 text-sm">└→</span>
              <div className="bg-blue-900/40 border border-blue-500/50 px-3 py-2 rounded-lg">
                <p className="text-blue-400 text-xs font-semibold">ReplicaSet</p>
                <p className="text-slate-500 text-[10px]">自動管理</p>
              </div>
            </div>
            <div className="flex items-center gap-1 pl-12">
              <span className="text-slate-500 text-sm">└→</span>
              <div className="flex gap-2">
                {["Pod 1", "Pod 2", "Pod 3"].map((pod) => (
                  <div key={pod} className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded text-center">
                    <p className="text-green-300 text-[10px] font-semibold">{pod}</p>
                  </div>
                ))}
              </div>
              <span className="text-slate-500 text-[10px] ml-2">實際跑的</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Volume — 資料持久化</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 問題：容器被銷毀 → 裡面的資料消失</p>
            <p>- 資料庫需要持久化 → 不能讓資料跟著容器消失</p>
            <p>- Volume = 把資料存在容器外面</p>
            <p className="pl-4">- 可掛載到本地磁碟或遠端儲存（NFS、雲端硬碟）</p>
            <p className="pl-4">- 容器重啟 → 資料不遺失</p>
            <p>- 對照：<code>docker volume</code>、<code>-v /host:/container</code></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Deployment — 管理無狀態應用</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 問題：只跑一個 Pod → 掛了就停服務</p>
            <p>- 解決：多跑幾個副本（replicas）</p>
            <p>- Deployment = 管理 Pod 副本的控制器</p>
            <p className="pl-4">- 副本控制：定義要跑 3 個 → 掛了一個 → 自動補一個</p>
            <p className="pl-4">- 滾動更新：逐步替換新版本，不中斷服務</p>
            <p className="pl-4">- 三層關係：<code>Deployment → ReplicaSet → Pod</code></p>
            <p className="pl-4">- ReplicaSet 是自動建立的，你只管 Deployment</p>
            <p>- 對照：<code>docker compose up --scale web=3</code></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">StatefulSet — 管理有狀態應用</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- Deployment 適合：前端、API（無狀態，每個副本一樣）</p>
            <p>- 資料庫不適合用 Deployment → 每個副本有自己的資料</p>
            <p>- StatefulSet = 給有狀態應用用的</p>
            <p className="pl-4">- 穩定的網路標識（<code>mysql-0</code>、<code>mysql-1</code>、<code>mysql-2</code>）</p>
            <p className="pl-4">- 有序部署和刪除（先 0 再 1 再 2）</p>
            <p className="pl-4">- 每個 Pod 有自己獨立的儲存</p>
          </div>
          <div className="mt-2 bg-amber-900/30 border border-amber-500/40 p-2 rounded">
            <p className="text-amber-400 text-xs font-semibold">實務建議：資料庫可以不放 K8s，在外面單獨跑</p>
          </div>
        </div>
      </div>
    ),
    notes: `接下來是 Volume、Deployment 和 StatefulSet。

Volume 在 Docker 就用過了——容器銷毀，裡面的資料消失，所以用 docker volume 或 -v /host:/container 把資料掛載到外面。K8s 的 Volume 概念一樣，但支援更多儲存後端：除了本地磁碟，還能掛 NFS、AWS EBS、GCP Persistent Disk 這些雲端硬碟。

接著是 Deployment。你的應用程式只跑一個 Pod，掛了就停服務。解決方法：多跑幾個副本。Deployment 就是管理 Pod 副本的控制器——你告訴它「我要 3 個 nginx Pod」，它就保持 3 個。掛了一個，自動補一個。更新版本時用滾動更新，逐步替換舊版本 Pod，不中斷服務。

層級關係：你建 Deployment，K8s 自動建 ReplicaSet，ReplicaSet 再建 Pod。三層：Deployment → ReplicaSet → Pod。你不需要直接操作 ReplicaSet，只管 Deployment。對照 Docker：有點像 docker compose up --scale web=3，但 Deployment 多了自動修復和滾動更新。

最後是 StatefulSet。Deployment 適合無狀態應用——每個副本一模一樣、可互相替換，像前端、API Server。但資料庫不行，每個副本有自己的資料、要持久化、要保證一致性，這就是有狀態應用。StatefulSet 跟 Deployment 很像，但多了幾個保證：每個 Pod 有穩定的名字（mysql-0、mysql-1），部署和刪除有順序（先 0 再 1 再 2），每個 Pod 有獨立的儲存。實務上很多團隊把資料庫放在 K8s 外面單獨管理，因為 StatefulSet 操作比較複雜。`,
    duration: "10"
  },

  // ── Slide 7 核心概念小結 ───────────────────────────
  {
    title: "核心概念小結",
    subtitle: "8 個核心概念一張表",
    section: "核心概念",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">概念</th>
                <th className="text-left py-2">做什麼</th>
                <th className="text-left py-2">Docker 對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Node</td>
                <td className="py-2">一台機器，叢集的組成單位</td>
                <td className="py-2">你的那台 Linux 主機</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Pod</td>
                <td className="py-2">容器的包裝，最小調度單位</td>
                <td className="py-2"><code>docker run</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Service</td>
                <td className="py-2">穩定的存取入口，負載均衡</td>
                <td className="py-2"><code>-p 8080:80</code> + <code>--network</code> DNS</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Ingress</td>
                <td className="py-2">HTTP 路由器，域名和路徑轉發</td>
                <td className="py-2">Nginx 反向代理</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">ConfigMap</td>
                <td className="py-2">設定檔管理（明文）</td>
                <td className="py-2"><code>-e ENV_VAR=value</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Secret</td>
                <td className="py-2">敏感資料管理（Base64）</td>
                <td className="py-2"><code>.env</code> 檔案</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Volume</td>
                <td className="py-2">資料持久化</td>
                <td className="py-2"><code>docker volume</code> / <code>-v</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">Deployment</td>
                <td className="py-2">管理無狀態應用的副本</td>
                <td className="py-2"><code>docker compose --scale</code></td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-semibold">StatefulSet</td>
                <td className="py-2">管理有狀態應用（資料庫）</td>
                <td className="py-2">手動管理，Docker 沒有對應</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">關係圖</p>
          <p className="text-slate-300 text-sm font-mono">
            Ingress → Service → Deployment → ReplicaSet → Pod ← ConfigMap / Secret
          </p>
          <p className="text-slate-300 text-sm font-mono pl-56">← Volume</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">後面四堂課會一個一個展開來教、一個一個動手做</p>
        </div>
      </div>
    ),
    notes: `好，小結一下。剛剛講了 8 個核心概念，螢幕上這張表把每個概念對照 Docker 列出來了，大家快速掃一眼。

重點記住這條關係鏈：Ingress → Service → Deployment → ReplicaSet → Pod，然後 ConfigMap 和 Secret 注入設定到 Pod，Volume 掛載儲存給 Pod。這就是 K8s 資源之間的核心關係。

好，概念的部分到這裡，休息 10 分鐘。回來之後看 K8s 的架構——這些概念在底層是怎麼運作的。`,
    duration: "5"
  },

  // ── Slide 8 K8s 架構：Worker Node ─────────────────
  {
    title: "K8s 架構：Worker Node",
    subtitle: "Master-Worker 架構 — Worker 上的三個組件",
    section: "架構",
    content: (
      <div className="space-y-3">
        {/* Worker Node 內部結構示意圖 */}
        <div className="bg-slate-900/60 border-2 border-cyan-500/40 rounded-lg p-4">
          <p className="text-cyan-400 text-xs font-semibold mb-2 tracking-wider">Worker Node</p>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-900/40 border border-blue-500/40 px-3 py-1 rounded">
              <p className="text-blue-300 text-[10px] font-semibold">kubelet</p>
            </div>
            <div className="bg-blue-900/40 border border-blue-500/40 px-3 py-1 rounded">
              <p className="text-blue-300 text-[10px] font-semibold">kube-proxy</p>
            </div>
            <div className="bg-blue-900/40 border border-blue-500/40 px-3 py-1 rounded">
              <p className="text-blue-300 text-[10px] font-semibold">containerd</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["Pod", "Pod", "Pod"].map((p, i) => (
              <div key={i} className="bg-green-900/40 border border-green-500/40 px-3 py-1.5 rounded">
                <p className="text-green-300 text-[10px] font-semibold">{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">K8s = Master-Worker 架構</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- <span className="text-blue-400 font-semibold">Master Node</span> → 管理整個叢集（公司管理層）</p>
            <p>- <span className="text-blue-400 font-semibold">Worker Node</span> → 跑你的應用程式（實際幹活的員工）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">1. Container Runtime（容器執行時期）</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 負責：拉映像檔、建容器、啟動/停止容器</p>
            <p>- 每個 Worker Node 都必須裝</p>
            <p>- Docker 用的是 Docker Engine</p>
            <p>- K8s 主流用 <span className="text-blue-400 font-semibold">containerd</span>（Docker 的底層也是用它）</p>
            <p>- 對照：你之前裝的 Docker，其實底層就是 containerd</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">2. kubelet（節點管家）</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 負責：管理這個 Node 上的所有 Pod</p>
            <p>- 從 API Server 接收指令：「要在你這邊跑一個 nginx Pod」</p>
            <p>- 確保 Pod 按照預期運行</p>
            <p>- 定期回報 Node 狀態給 API Server</p>
            <p>- 對照：像 Docker Daemon，但只管這一台 Node</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">3. kube-proxy（網路代理）</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 負責：網路代理和負載均衡</p>
            <p>- 請求進來 → 轉發到正確的 Pod</p>
            <p>- 智慧路由：優先選同一個 Node 上的 Pod → 減少網路開銷</p>
            <p>- 對照：Docker 的 port mapping + 網路橋接</p>
          </div>
        </div>
      </div>
    ),
    notes: `休息回來。接下來看 K8s 的架構，也就是底層怎麼運作的。

K8s 是 Master-Worker 架構：Master Node 負責做決策、下指令；Worker Node 負責跑你的應用程式。

先看 Worker Node，每個上面有三個核心組件。

第一個是 Container Runtime（容器執行時期），負責拉映像檔、建容器、啟動和停止容器。你學 Docker 時用的 Docker Engine 就是一種 Container Runtime，但 K8s 主流用 containerd。Docker Engine 底層其實也是用 containerd，所以 containerd 就是 Docker 背後真正做事的引擎。K8s 不需要裝 Docker，直接用 containerd 更輕量。

第二個是 kubelet，這個 Node 的管家。Master 說「在你這台跑一個 nginx Pod」，kubelet 接收指令，調用 Container Runtime 把容器跑起來。同時持續監控 Pod 運行狀況，定期把 Node 狀態回報給 Master。對照 Docker：像 Docker Daemon，但只管這一台 Node。

第三個是 kube-proxy，負責網路代理和負載均衡。請求進來時，kube-proxy 轉發到正確的 Pod。它會做智慧路由：同一個 Node 上有目標 Pod 就優先轉過去，減少跨 Node 網路開銷。對照 Docker：像 port mapping 加網路橋接，但更智慧。`,
    duration: "15"
  },

  // ── Slide 9 K8s 架構：Master Node ─────────────────
  {
    title: "K8s 架構：Master Node",
    subtitle: "Master Node 上的四個組件",
    section: "架構",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">1. API Server（叢集的大門）</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 所有請求的唯一入口</p>
              <p>- <code>kubectl</code> → API Server → 其他組件</p>
              <p>- 負責認證、授權、存取控制</p>
              <p>- 就像公司的大門 + 接待處 + 保全</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">2. etcd（叢集的大腦 / 資料庫）</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 鍵值儲存系統（類似 Redis）</p>
              <p>- 儲存叢集中所有資源的狀態</p>
              <p className="pl-4">- 有幾個 Node？幾個 Pod？每個 Pod 跑在哪？</p>
            </div>
            <div className="mt-2 bg-amber-900/30 border border-amber-500/40 p-2 rounded">
              <p className="text-amber-400 text-xs font-semibold">注意：只存叢集狀態，不存你的應用資料</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">3. Scheduler（調度器）</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 新 Pod 要跑在哪個 Node？</p>
              <p>- 看哪個 Node 資源最充足 → 分配過去</p>
              <p>- 例：Node 1 用了 80%，Node 2 用了 20% → 分到 Node 2</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">4. Controller Manager（控制器管理器）</p>
            <div className="text-slate-300 text-sm space-y-1">
              <p>- 持續監控「現在狀態」vs「期望狀態」</p>
              <p>- 發現不一致 → 自動修復</p>
              <p>- 例：你說要 3 個 Pod，掛了一個只剩 2 → 自動補一個</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">完整流程範例</p>
          <div className="text-slate-300 text-sm font-mono space-y-1">
            <p>你輸入：kubectl create deployment nginx --replicas=3</p>
            <p className="mt-2">1. kubectl 把請求送到 → API Server</p>
            <p>2. API Server 驗證你的權限 → 通過</p>
            <p>3. API Server 把「要 3 個 nginx Pod」記錄到 → etcd</p>
            <p>4. Scheduler 發現有 3 個 Pod 還沒分配 → 分配到合適的 Node</p>
            <p>5. 對應 Node 的 kubelet 收到通知 → 把容器跑起來</p>
            <p>6. Controller Manager 持續監控 → Pod 掛了就重新分配</p>
          </div>
        </div>
      </div>
    ),
    notes: `看完 Worker Node，來看 Master Node。四個核心組件。

第一個 API Server，整個叢集的大門。所有請求——kubectl 指令、Dashboard 操作、叢集內部組件溝通——全部先經過 API Server。它還負責認證和授權：確認你是誰、有沒有權限做這件事。

第二個 etcd，鍵值儲存系統，概念跟 Redis 很像。負責儲存整個叢集所有資源的狀態：有幾個 Node、幾個 Pod、每個 Pod 跑在哪、狀態是什麼。注意：etcd 只存叢集狀態，不存你的應用資料（MySQL 的資料不在 etcd 裡）。

第三個 Scheduler（調度器）。新 Pod 建立時，Scheduler 看每個 Node 的 CPU、記憶體使用率，把 Pod 分配到資源最充足的 Node。例如 Node 1 用了 80%、Node 2 用了 20%，新 Pod 分到 Node 2。

第四個 Controller Manager（控制器管理器）。持續監控「現在狀態」vs「期望狀態」，不一致就自動修復。例如你要 3 個 nginx Pod，掛了一個剩 2 個，Controller Manager 發現後通知 Scheduler 補一個回到 3 個。

用一個完整流程串起來：你輸入 kubectl create deployment nginx --replicas=3 → 請求到 API Server → 驗證權限通過 → 期望狀態記錄到 etcd → Scheduler 發現 3 個 Pod 沒分配，分到合適的 Node → 對應 Node 的 kubelet 收到通知，調用 containerd 把容器跑起來 → Controller Manager 持續監控，Pod 掛了就重跑這個流程。`,
    duration: "15"
  },

  // ── Slide 10 K8s 架構圖 ───────────────────────────
  {
    title: "K8s 架構圖",
    subtitle: "Master + Worker 完整架構",
    section: "架構",
    content: (
      <div className="space-y-3">
        {/* 精緻架構圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          {/* kubectl */}
          <div className="text-center mb-2">
            <div className="inline-block bg-amber-900/40 border border-amber-500/50 px-4 py-1.5 rounded-lg">
              <p className="text-amber-400 text-xs font-semibold font-mono">kubectl</p>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm mb-2">▼</div>

          {/* Master Node */}
          <div className="border-2 border-blue-500/40 rounded-lg p-3 mb-3 bg-blue-900/10">
            <p className="text-blue-400 text-xs font-semibold mb-2 tracking-wider">Master Node (Control Plane)</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "API Server", desc: "大門" },
                { name: "etcd", desc: "大腦" },
                { name: "Scheduler", desc: "調度" },
                { name: "Controller Mgr", desc: "監控" },
              ].map((item) => (
                <div key={item.name} className="bg-blue-900/40 border border-blue-500/30 p-2 rounded text-center">
                  <p className="text-blue-300 text-[10px] font-semibold">{item.name}</p>
                  <p className="text-slate-500 text-[9px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 連接線 */}
          <div className="flex justify-center gap-16 text-slate-500 text-sm mb-2">
            <span>▼</span>
            <span>▼</span>
          </div>

          {/* Worker Nodes */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Worker Node 1", pods: ["nginx", "api"] },
              { name: "Worker Node 2", pods: ["db", "redis"] },
            ].map((worker) => (
              <div key={worker.name} className="border-2 border-cyan-500/40 rounded-lg p-3 bg-cyan-900/10">
                <p className="text-cyan-400 text-[10px] font-semibold mb-2 tracking-wider">{worker.name}</p>
                <div className="flex gap-1 mb-2">
                  <div className="bg-slate-800/80 border border-slate-600 px-1.5 py-0.5 rounded">
                    <p className="text-slate-300 text-[9px]">kubelet</p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-600 px-1.5 py-0.5 rounded">
                    <p className="text-slate-300 text-[9px]">kube-proxy</p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-600 px-1.5 py-0.5 rounded">
                    <p className="text-slate-300 text-[9px]">containerd</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {worker.pods.map((pod) => (
                    <div key={pod} className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded">
                      <p className="text-green-300 text-[10px] font-semibold">{pod}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">一句話版本</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 你用 <code>kubectl</code> → 跟 API Server 說話 → API Server 指揮整個叢集</p>
            <p>- 等一下實作就會在 <code>kube-system</code> namespace 裡親眼看到這些組件</p>
          </div>
        </div>
      </div>
    ),
    notes: `把剛剛講的內容用螢幕上這張架構圖整理一下。

最上面 Master Node 四個組件：API Server 是大門、etcd 記狀態、Scheduler 決定 Pod 跑在哪、Controller Manager 監控和自動修復。

下面多個 Worker Node，每個有 kubelet、kube-proxy、Container Runtime，Pod 跑在上面。

整個流程：你用 kubectl 跟 API Server 說話，API Server 指揮底下各組件完成操作。

等一下實作時，我們會跑 kubectl get pods -n kube-system，你會親眼看到 API Server、etcd、Scheduler、kube-proxy 這些組件都是以 Pod 的形式跑在叢集裡——K8s 用自己的方式跑自己的組件。`,
    duration: "5"
  },

  // ── Slide 11 環境方案 ─────────────────────────────
  {
    title: "環境方案",
    subtitle: "minikube / k3s / RKE 比較 + kubectl 指令對照",
    section: "實作",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">三種方案比較</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">方案</th>
                <th className="text-left py-2">適合場景</th>
                <th className="text-center py-2">節點數</th>
                <th className="text-center py-2">安裝難度</th>
                <th className="text-center py-2">什麼時候教</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">minikube</td>
                <td className="py-2">個人學習</td>
                <td className="py-2 text-center">單節點</td>
                <td className="py-2 text-center">一行指令</td>
                <td className="py-2 text-center">今天（第四堂）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-blue-400 font-semibold">k3s</td>
                <td className="py-2">輕量生產 / 多節點學習</td>
                <td className="py-2 text-center">多節點</td>
                <td className="py-2 text-center">一行指令</td>
                <td className="py-2 text-center">第五堂</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-semibold">RKE / kubeadm</td>
                <td className="py-2">企業生產叢集</td>
                <td className="py-2 text-center">多節點</td>
                <td className="py-2 text-center">較複雜</td>
                <td className="py-2 text-center">待定</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">minikube</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- 在一台電腦上模擬一個完整的 K8s 叢集</p>
            <p>- Master + Worker 合在同一台</p>
            <p>- 底層跑在 Docker 或虛擬機裡面</p>
            <p>- 適合學習和本地測試，不適合生產</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">kubectl = K8s 的命令列工具</p>
          <p className="text-slate-300 text-sm">不管用 minikube、k3s 還是雲端 K8s → kubectl 指令都一樣。學一次，到處用。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Docker → kubectl 指令對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Docker 指令</th>
                <th className="text-left py-2">kubectl 指令</th>
                <th className="text-left py-2">功能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker ps</code></td>
                <td className="py-1"><code>kubectl get pods</code></td>
                <td className="py-1">看運行中的容器/Pod</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker logs &lt;id&gt;</code></td>
                <td className="py-1"><code>kubectl logs &lt;pod&gt;</code></td>
                <td className="py-1">看日誌</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker exec -it &lt;id&gt; bash</code></td>
                <td className="py-1"><code>kubectl exec -it &lt;pod&gt; -- bash</code></td>
                <td className="py-1">進容器</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker stop/rm &lt;id&gt;</code></td>
                <td className="py-1"><code>kubectl delete pod &lt;pod&gt;</code></td>
                <td className="py-1">停止/刪除</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker compose up -f</code></td>
                <td className="py-1"><code>kubectl apply -f xxx.yaml</code></td>
                <td className="py-1">用檔案部署</td>
              </tr>
              <tr>
                <td className="py-1"><code>docker images</code></td>
                <td className="py-1"><code>kubectl get deployments</code></td>
                <td className="py-1">看部署的應用</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `概念和架構講完了，接下來解決一個實際問題：K8s 叢集用什麼來跑？

三種方案。第一種 minikube，在一台電腦上模擬完整 K8s 叢集，Master 和 Worker 合一台，底層跑在 Docker 裡。一行 minikube start 就搞定，今天用這個。

第二種 k3s，Rancher 開發的輕量級 K8s 發行版，方便搭建多節點叢集。第五堂課教 Service 和 Deployment 時會換成 k3s，讓你看到 Pod 分散部署到不同 Node。

第三種 RKE 或 kubeadm，正式生產環境方案，安裝配置比較複雜，之後再討論。

不管用哪種方案，kubectl 指令都一樣。kubectl 是 K8s 的命令列工具——minikube、k3s、AWS EKS、GCP GKE，kubectl 指令通用。

看螢幕上的對照表：docker ps 對應 kubectl get pods，docker logs 對應 kubectl logs，docker exec -it 對應 kubectl exec -it ... -- bash（注意多了兩個破折號 --），docker compose up -f 對應 kubectl apply -f xxx.yaml。有 Docker 基礎，上手 kubectl 很快。`,
    duration: "10"
  },

  // ── Slide 12 實作：minikube + kubectl ──────────────
  {
    title: "實作：minikube + kubectl",
    subtitle: "7 個步驟帶你探索 K8s 叢集",
    section: "實作",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 1：確認安裝成功</p>
            <div className="text-slate-300 text-sm font-mono space-y-1">
              <p>minikube version</p>
              <p>minikube status</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 2：啟動叢集</p>
            <div className="text-slate-300 text-sm font-mono space-y-1">
              <p>minikube start</p>
              <p className="text-slate-400"># host: Running, kubelet: Running, apiserver: Running</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 3：驗證叢集</p>
            <div className="text-slate-300 text-sm font-mono space-y-1">
              <p>kubectl get nodes</p>
              <p>kubectl get nodes -o wide</p>
              <p>kubectl cluster-info</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 4：親眼看到架構組件</p>
            <div className="text-slate-300 text-sm font-mono space-y-1">
              <p>kubectl get pods -n kube-system</p>
              <p>kubectl get ns</p>
            </div>
            <p className="text-slate-400 text-xs mt-1">對照剛剛的架構圖，每個組件都在這裡</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 5：看 Node 詳細資訊</p>
          <div className="text-slate-300 text-sm font-mono">
            <p>kubectl describe node minikube</p>
          </div>
          <div className="text-slate-400 text-xs mt-2 space-y-1">
            <p>- Roles: control-plane（Master + Worker 合一）</p>
            <p>- Container Runtime: containerd 或 docker</p>
            <p>- CPU / Memory 容量和已分配量</p>
            <p>- 上面跑了哪些 Pod</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 6：打開 Dashboard</p>
            <div className="text-slate-300 text-sm font-mono">
              <p>minikube dashboard</p>
            </div>
            <p className="text-slate-400 text-xs mt-1">會自動開瀏覽器，圖形介面看叢集所有資源</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 7：基本 kubectl 探索</p>
            <div className="text-slate-300 text-sm font-mono space-y-1">
              <p>kubectl get all</p>
              <p>kubectl get all -n kube-system</p>
              <p>kubectl api-resources</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，動手時間。打開終端。

Step 1：確認安裝。輸入 minikube version 看到版本號就表示裝好了。minikube status 看到 host、kubelet、apiserver 都是 Running 就表示叢集在跑。如果還沒跑，先執行 minikube start，第一次會下載映像檔，要花幾分鐘。

Step 2-3：驗證叢集。kubectl get nodes 會看到一個節點叫 minikube，狀態 Ready。加 -o wide 多看 IP、作業系統、Container Runtime 版本。kubectl cluster-info 看 API Server 的地址。

Step 4：kubectl get pods -n kube-system，-n 指定命名空間為 kube-system（K8s 系統組件的命名空間）。你會看到 etcd、kube-apiserver、kube-controller-manager、kube-scheduler、kube-proxy、coredns 這些 Pod 都在跑——對照剛剛的架構圖，每個組件都活生生出現在你面前了。再跑 kubectl get ns 看所有命名空間：default 放你的應用、kube-system 放系統組件、kube-public 和 kube-node-lease 是其他用途。

Step 5：kubectl describe node minikube 輸出很多內容，重點看：Roles 顯示 control-plane（Master + Worker 合一）、Container Runtime 是 containerd 還是 Docker、CPU 和記憶體的容量與已分配量、上面跑了哪些 Pod。

Step 6：minikube dashboard 自動打開瀏覽器，圖形介面瀏覽叢集資源。日常工作 kubectl 是主力，Dashboard 適合快速查看和監控。

Step 7：kubectl get all 看所有資源、kubectl get all -n kube-system 看系統資源、kubectl api-resources 看 K8s 支援的所有資源類型。`,
    duration: "50"
  },

  // ── Slide 13 上午總結 + 下午預告 ───────────────────
  {
    title: "上午總結 + 下午預告",
    subtitle: "回顧今天上午的內容，預告下午實作",
    section: "總結",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">上午學了什麼</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">主題</th>
                <th className="text-left py-2">內容</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">為什麼需要 K8s</td>
                <td className="py-2">Docker 單機的五個極限 → K8s 全部解決</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">K8s 是什麼</td>
                <td className="py-2">Google 開源的容器編排引擎，行業標準</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">8 個核心概念</td>
                <td className="py-2">Pod / Service / Ingress / ConfigMap / Secret / Volume / Deployment / StatefulSet</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">K8s 架構</td>
                <td className="py-2">Master 4 組件 + Worker 3 組件</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">環境方案</td>
                <td className="py-2">minikube（今天）/ k3s（第五堂）/ RKE</td>
              </tr>
              <tr>
                <td className="py-2">實作</td>
                <td className="py-2">minikube 安裝 + kubectl 探索 + 親眼看到架構組件</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">下午要做的事</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. YAML 基本格式（apiVersion / kind / metadata / spec）</p>
            <p>2. 寫第一個 Pod YAML（nginx）→ 完整生命週期操作</p>
            <p className="pl-4 text-slate-400"><code>apply → get → describe → logs → exec → delete</code></p>
            <p>3. 故意搞壞 Pod → 學會用 <code>describe</code> 排錯</p>
            <p className="pl-4 text-slate-400">打錯 image 名 → <code>ImagePullBackOff</code> → 找原因 → 修正</p>
            <p>4. 多容器 Pod（Sidecar 模式）</p>
            <p className="pl-4 text-slate-400">nginx + busybox 共享 Volume</p>
            <p>5. 自由練習時間</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">學完這幾個章節你會：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>- <code>minikube status</code> 顯示 Running，<code>kubectl get nodes</code> 看到 Ready</p>
            <p>- 會用 <code>get</code>、<code>describe</code>、<code>logs</code>、<code>exec</code>、<code>delete</code> 五個指令</p>
            <p>- 能獨立寫出 Pod YAML，部署 nginx 並用 <code>port-forward</code> 在瀏覽器看到頁面</p>
            <p>- 看到 <code>ImagePullBackOff</code> 知道怎麼查、怎麼修</p>
          </div>
        </div>
      </div>
    ),
    notes: `總結今天上午。螢幕上的表已經列出來了，我快速帶過重點。

上午做了三件事：第一，理解為什麼需要 K8s——Docker Compose 管不了跨機器、成百上千個容器的調度、故障恢復、彈性擴縮、滾動更新和服務發現。第二，認識 8 個核心概念和 Master-Worker 架構的 7 個組件，每個都對照了 Docker。第三，動手裝好 minikube，用 kubectl get nodes、kubectl get pods -n kube-system、kubectl describe node 實際探索了叢集。

下午開始寫 YAML。流程是：先講 YAML 格式（apiVersion / kind / metadata / spec 四個必填欄位），然後寫第一個 Pod 跑 nginx，跑完整生命週期：kubectl apply -f 建立 → kubectl get pods 查看 → kubectl describe pod 檢查 → kubectl logs 看日誌 → kubectl exec -it 進容器 → kubectl delete pod 刪除。接著故意打錯 image 名觸發 ImagePullBackOff，用 describe 排錯。最後做多容器 Pod（nginx + busybox 共享 Volume 的 Sidecar 模式）。

好，休息一下，下午見。`,
    duration: "5"
  },
]
