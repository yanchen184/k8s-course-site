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
    notes: `各位同學早安，歡迎來到第四堂課。前三堂課我們從 Linux 基礎開始，學會了終端機操作、檔案管理和網路指令；接著進入 Docker 的世界，學會了用 Image 跑 Container、用 Port 和 Volume 跟外面溝通；第三堂課我們更進一步，學會了用 Dockerfile 打包自己的應用程式，還用 Docker Compose 一次跑多個容器。

到目前為止，我們所有的操作都是在一台機器上完成的。這在開發和測試的時候完全沒問題，但如果要把應用程式上線到生產環境，只靠一台機器、靠 Docker Compose 是不夠的。從今天開始，我們要進入 Kubernetes 的領域。

今天上午兩個小時是純聽課，我會帶大家把 Kubernetes 的全貌走一遍：它為什麼存在、核心概念有哪些、架構長什麼樣子。下午才會開始動手寫 YAML、部署 Pod。

不過在我講課的這段時間，請大家先把 minikube 裝起來。螢幕上有完整的安裝指令，就是這四個步驟：下載 minikube、下載 kubectl、啟動叢集、驗證。安裝需要一點時間，趁我講概念的時候讓它在背景跑，等我們講到實作的時候就可以直接用了。`,
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

它的來歷其實很有意思。Google 內部有一套系統叫做 Borg，從 2003 年就開始用了，專門管理 Google 全球資料中心裡面數十億個容器。2014 年，Google 把 Borg 的核心思想和多年的運維經驗整理出來，開源了一個專案叫做 Kubernetes，這個名字來自希臘語，是「舵手」的意思。後來 Google 把它捐給了 CNCF，也就是雲原生計算基金會。因為 Kubernetes 這個字太長了，所以大家習慣縮寫成 K8s，K 和 s 之間剛好 8 個字母。

回到剛剛的五個問題，K8s 每一個都有對應的解決方案。調度問題？K8s 有一個叫 Scheduler 的組件，會自動看哪台機器的資源最充足，然後把容器分配過去。故障恢復？某台機器掛了，K8s 會自動偵測到，然後把上面的容器搬到其他健康的機器上重新建立。彈性擴縮？你可以一行指令把副本數從 3 個改成 10 個，甚至可以設定根據 CPU 使用率自動擴縮。滾動更新？K8s 會逐步用新版本的容器替換舊版本，整個過程零停機。服務發現？K8s 內建 DNS，容器之間用名字就能找到對方，不用記 IP。

除了這些之外，K8s 還提供了很多其他能力，像是負載均衡、配置管理、密碼管理、儲存管理等等。可以說目前 Kubernetes 已經是容器編排領域的行業標準，不管是 Google、AWS、Azure 還是阿里雲，所有主流雲平台都支援 Kubernetes。`,
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
    notes: `好，現在我們來認識 Kubernetes 的核心概念。我不會一次把所有概念丟給你，而是從一個最簡單的例子開始，一步步引入。

首先是 Node，就是「節點」。一個 Node 就是一台機器，可以是實體伺服器，也可以是虛擬機。你的 K8s 叢集就是由好幾個 Node 組成的。

接下來是 Pod。Pod 是 Kubernetes 裡面最小的調度單位，注意不是容器，而是 Pod。一個 Pod 裡面可以包含一個或多個容器，這些容器共享網路和儲存。你可以把 Pod 想成是容器外面包的一層殼。不過在實際使用中，我們建議一個 Pod 裡面只放一個容器，這樣比較好管理和擴展。什麼時候會在一個 Pod 裡面放多個容器呢？通常是 Sidecar 模式，也就是主程式旁邊放一個輔助容器，比如做日誌收集或監控。用 Docker 的概念來對照，你用 docker run 跑一個容器，就大概等於 K8s 裡面的一個 Pod。

假設我們的系統有一個應用程式和一個資料庫，分別放在兩個 Pod 裡。應用程式要連資料庫，就需要知道資料庫 Pod 的 IP。但這裡有兩個問題：第一，Pod 的 IP 是叢集內部的，外面的世界連不到；第二，Pod 不是一個穩定的東西，它可能會因為故障被銷毀然後重建，重建之後 IP 就變了。如果你的應用程式寫死了資料庫的 IP，Pod 一重建就連不上了。

為了解決這個問題，K8s 提供了 Service。Service 就是一個穩定的存取入口。你把一組 Pod 封裝成一個 Service，不管後面的 Pod 怎麼換、IP 怎麼變，Service 的地址始終不變，它會自動把請求轉發到健康的 Pod 上。用 Docker 來對照，有點像你用 docker run -p 做 port mapping，只不過 Service 更強大，它還能自動做負載均衡和故障轉移。

Service 有幾種類型。ClusterIP 是預設的，只能在叢集內部存取，適合像資料庫這種不需要暴露給外部的服務。NodePort 會在每個 Node 上開一個 Port，讓外部可以連進來。還有 LoadBalancer 是搭配雲平台的負載均衡器使用的。`,
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

先說 Ingress。剛剛講到 NodePort 可以讓外部連到叢集內的 Service，但它是用 IP 加上一個很大的 Port 號來存取的，比如 192.168.1.100:30080。在開發測試的時候這樣用沒問題，但生產環境總不能讓使用者輸入一串 IP 和 Port 吧？使用者期望的是打開瀏覽器輸入 www.example.com 就能用。

這就是 Ingress 的作用。Ingress 是一個 HTTP 層的路由器，可以根據域名或路徑把請求轉發到不同的 Service。比如 www.example.com 導到前端的 Service，api.example.com 導到後端的 Service，還可以配置 SSL 憑證來支援 HTTPS。用 Docker 的經驗來對照，Ingress 的角色就像你在 Docker 環境裡面架一個 Nginx 做反向代理，只不過在 K8s 裡面這是一個內建的資源物件，設定起來更方便。

接下來是 ConfigMap。大家回想一下，在 Docker 的時候，如果你的應用程式要連資料庫，資料庫的地址可能是用環境變數傳進去的，像 docker run -e DB_HOST=xxx。但如果你把地址直接寫死在 Image 裡面呢？一旦資料庫換了地址，你就得重新 build Image、重新部署，非常麻煩。

K8s 提供了 ConfigMap 來解決這個問題。你可以把所有的設定資訊，像是資料庫地址、Port、各種參數，全部放到 ConfigMap 裡面。應用程式的 Image 裡面完全不包含這些設定。當設定需要修改的時候，只要改 ConfigMap 然後重新載入 Pod 就好了，不需要重新 build Image。

不過有一點要注意：ConfigMap 裡面的資料是明文儲存的。如果是密碼、API Key 這類敏感資訊呢？就不應該放在 ConfigMap 裡面，而是要用 Secret。Secret 和 ConfigMap 的用法幾乎一模一樣，差別在於 Secret 會做一層 Base64 編碼。但我要特別強調，Base64 只是編碼，不是加密，任何人拿到 Base64 的字串都可以解碼回來。所以光靠 Secret 本身並不能保證安全，還需要搭配 K8s 的 RBAC 權限控制等機制。用 Docker 來對照，Secret 的角色就像你的 .env 檔案。`,
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
    notes: `接下來是 Volume、Deployment 和 StatefulSet 這三個概念。

Volume 大家應該很熟悉，因為在 Docker 的時候就用過了。容器一旦被銷毀，裡面的資料就跟著消失。對於資料庫來說這顯然不行，所以我們需要 Volume 把資料存到容器外面。K8s 的 Volume 概念跟 Docker 的 Volume 非常類似，都是把資料掛載到外部。不同的是，K8s 的 Volume 支援更多種類的儲存後端，除了本地磁碟之外，還可以掛載 NFS、雲端硬碟等等。

接下來是 Deployment，這是一個非常重要的概念。假設你的應用程式只跑一個 Pod，這個 Pod 一旦掛了，服務就停了。解決方法很直覺：多跑幾個副本。Deployment 就是用來管理 Pod 副本的控制器。你告訴它「我要 3 個 nginx 的 Pod」，它就會幫你保持 3 個。如果其中一個掛了，它會自動再補一個新的上來。你要更新版本的時候，它會用滾動更新的方式，逐步把舊版本的 Pod 替換成新版本，整個過程不中斷服務。

這裡要提一個層級關係：當你建立一個 Deployment 的時候，K8s 會自動建立一個 ReplicaSet，ReplicaSet 再去建立和管理 Pod。所以是三層：Deployment 管 ReplicaSet，ReplicaSet 管 Pod。但你不需要直接操作 ReplicaSet，你只管 Deployment 就好了。用 Docker 來對照，Deployment 有點像 docker compose up --scale web=3，但功能強大得多。

最後是 StatefulSet。Deployment 適合無狀態的應用，什麼是無狀態？就是每個副本都一模一樣、可以互相替換，像前端、API Server 這種。但資料庫呢？每個副本有自己的資料，資料還要持久化、要保證一致性，這就是有狀態的應用。StatefulSet 就是專門給這種有狀態應用設計的。它跟 Deployment 很像，但多了幾個保證：每個 Pod 有穩定的名字，像 mysql-0、mysql-1；部署和刪除是有順序的；每個 Pod 有自己獨立的儲存。不過實務上，很多團隊會選擇把資料庫放在 K8s 叢集外面單獨管理，因為 StatefulSet 的操作確實比較複雜。`,
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
    notes: `好，我們來做一個小結。剛剛一口氣講了 8 個核心概念，我們用一張表來整理一下，並且對照你已經會的 Docker 來加深記憶。

Node 就是一台機器，對照過來就是你跑 Docker 的那台 Linux 主機。Pod 是容器的包裝，K8s 最小的調度單位，對照 Docker 就是 docker run 一個容器。Service 是穩定的存取入口，提供負載均衡和服務發現，對照 Docker 就是 -p 做 port mapping 加上 Docker Network 的 DNS 功能。Ingress 是 HTTP 層的路由器，對照 Docker 裡面自己架 Nginx 做反向代理。ConfigMap 管設定、Secret 管密碼，對照 Docker 就是環境變數和 .env 檔案。Volume 管資料持久化，這個 Docker 也有，概念一樣。Deployment 管理無狀態應用的多個副本，對照 Docker Compose 的 --scale。StatefulSet 管理有狀態應用，這個 Docker 沒有對應的功能，只能自己手動管理。

大家不需要把每個概念的細節都記住，因為後面四堂課我們會一個一個展開來教、一個一個動手實作。今天只要在腦子裡有一個全局的地圖就夠了。

好，概念的部分到這裡，我們休息 10 分鐘。休息回來之後，我們來看 K8s 的架構，也就是這些概念在底層是怎麼運作的。`,
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
    notes: `休息回來，我們繼續。接下來要看 Kubernetes 的架構，也就是底層是怎麼運作的。

Kubernetes 是一個典型的 Master-Worker 架構。簡單來說就像一家公司：Master Node 是管理層，負責做決策、下指令；Worker Node 是員工，負責真正幹活。你的應用程式是跑在 Worker Node 上的。

我們先來看 Worker Node。每個 Worker Node 上有三個核心組件。

第一個是 Container Runtime，也就是容器執行時期。它負責實際的容器操作：拉映像檔、建立容器、啟動和停止容器。每個 Worker Node 上都必須安裝。大家在學 Docker 的時候接觸過的 Docker Engine，其實就是一種 Container Runtime。但在 Kubernetes 的世界裡，主流用的是 containerd。有趣的是，Docker Engine 的底層其實也是用 containerd。所以你可以把 containerd 理解為 Docker 背後真正做事的那個引擎。在 K8s 裡面不需要裝 Docker，直接用 containerd 就行了，更輕量。

第二個組件是 kubelet，你可以把它想成是這個 Node 的管家。kubelet 負責管理這個 Node 上所有的 Pod。當 Master Node 說「在你這台機器上跑一個 nginx Pod」，kubelet 就會接收到這個指令，然後調用 Container Runtime 來把容器跑起來。同時 kubelet 會持續監控這些 Pod 的運行狀況，定期把 Node 的狀態回報給 Master Node。用 Docker 的概念來對照，kubelet 的角色有點像 Docker Daemon，但它只管理自己這一台 Node 上的 Pod。

第三個是 kube-proxy，負責網路代理和負載均衡。當一個請求進來的時候，kube-proxy 負責把它轉發到正確的 Pod。而且它會做智慧路由：如果同一個 Node 上就有目標 Pod，就優先轉給同一個 Node 上的，不用再跑到其他 Node 去，這樣可以減少網路開銷。用 Docker 來對照，kube-proxy 的角色就像 Docker 的 port mapping 加上網路橋接，但更智慧。`,
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
    notes: `看完 Worker Node，我們來看 Master Node。Master Node 上有四個核心組件，它們協同合作來管理整個叢集。

第一個是 API Server，它是整個叢集的大門。所有的請求，不管是你用 kubectl 下的指令、用 Dashboard 做的操作、還是叢集內部組件之間的溝通，全部都要先經過 API Server。API Server 除了轉發請求之外，還負責認證和授權，確認你是誰、你有沒有權限做這件事。你可以把它想成公司的大門加上接待處加上保全，所有人進出都要經過它。

第二個是 etcd。etcd 是一個鍵值儲存系統，概念跟 Redis 很像。它的角色是叢集的大腦或者說資料庫，負責儲存整個叢集所有資源的狀態。比如叢集裡有幾個 Node、幾個 Pod、每個 Pod 跑在哪個 Node 上、它的狀態是什麼，這些資訊全部記錄在 etcd 裡面。這裡要特別注意一點：etcd 只儲存叢集的狀態資訊，你的應用程式的資料，比如 MySQL 裡面的資料，是不會存在 etcd 裡面的。

第三個是 Scheduler，也就是調度器。當你建立一個新的 Pod 的時候，Scheduler 負責決定這個 Pod 要跑在哪個 Node 上。它會看每個 Node 的 CPU 使用率、記憶體使用率等資訊，然後把 Pod 分配到資源最充足的那個 Node。比如 Node 1 已經用了 80% 的資源，Node 2 只用了 20%，那新的 Pod 就會被分到 Node 2。

第四個是 Controller Manager，控制器管理器。它的工作是持續監控所有資源的狀態，看「現在的狀態」跟「你期望的狀態」是不是一致的。如果不一致，它就會自動修復。舉個例子：你說要 3 個 nginx Pod，結果有一個 Pod 掛了，只剩 2 個。Controller Manager 發現了，就會通知 Scheduler 再分配一個新的 Pod，讓數量回到 3 個。

我們用一個完整的流程來串起來。當你在終端輸入 kubectl create deployment nginx --replicas=3，這個請求首先到達 API Server，API Server 驗證你的權限，通過之後把「要 3 個 nginx Pod」這個期望狀態記錄到 etcd。接著 Scheduler 發現有 3 個 Pod 還沒有分配到 Node，它看了看各個 Node 的資源狀況，決定分配到哪些 Node。對應 Node 上的 kubelet 收到通知後，呼叫 Container Runtime 把容器跑起來。之後 Controller Manager 持續監控，只要有 Pod 掛了，就會觸發整個流程重新來一遍，確保始終有 3 個 Pod 在運行。`,
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
    notes: `好，我們把剛剛講的內容用一張架構圖來整理。大家看螢幕上這張圖。

最上面是 Master Node，裡面有四個組件：API Server 是大門，所有請求先經過它；etcd 是大腦，記錄所有狀態；Scheduler 負責調度，決定 Pod 跑在哪；Controller Manager 負責監控和自動修復。

下面是多個 Worker Node，每個上面都有 kubelet、kube-proxy 和 Container Runtime 三個組件，然後 Pod 就跑在 Worker Node 上面。

整個流程就是：你用 kubectl 跟 API Server 說話，API Server 再指揮底下的各個組件來完成你要的操作。這就是 K8s 的核心架構。

聽起來好像組件很多、很複雜，但不用擔心。等一下我們在實作的時候，會執行一個 kubectl get pods -n kube-system 的指令，你就會親眼看到 API Server、etcd、Scheduler、kube-proxy 這些組件都是以 Pod 的形式跑在叢集裡面的。沒錯，K8s 是用 K8s 的方式來跑自己的組件，非常有意思。`,
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
    notes: `概念和架構都講完了，接下來要解決一個很實際的問題：我們的 K8s 叢集要用什麼來跑？

市面上有很多方案，我幫大家整理成三種。第一種是 minikube，它可以在一台電腦上模擬一個完整的 K8s 叢集，Master 和 Worker 合在同一台，底層跑在 Docker 或者虛擬機裡面。安裝就一行指令，非常適合學習。今天我們就用 minikube。

第二種是 k3s，它是 Rancher 開發的輕量級 K8s 發行版，可以很方便地搭建多節點的叢集。等到第五堂課教 Deployment 和 Service 的時候，我們會需要多個 Node 來看 Pod 是怎麼分散部署的，那時候會換成 k3s。

第三種是 RKE 或 kubeadm 這類比較正式的生產環境方案，安裝和配置比較複雜，之後有機會再討論。

不管用哪種方案，有一個東西是不變的，就是 kubectl。kubectl 是 K8s 的命令列工具，用來跟叢集互動。不管你底層用的是 minikube、k3s、還是 AWS 上的 EKS，kubectl 的指令都是一模一樣的。學一次，到處都能用。

大家看一下螢幕上的對照表。docker ps 對應 kubectl get pods，docker logs 對應 kubectl logs，docker exec -it 對應 kubectl exec -it，docker compose up 對應 kubectl apply -f。是不是很像？其實 kubectl 的設計就是跟 Docker 類似的思路，所以你有 Docker 的基礎，上手 kubectl 會非常快。唯一要注意的是 exec 的語法，kubectl 要在容器指令前面加兩個破折號 --，這是它跟 Docker 不一樣的地方。`,
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
    notes: `好，終於到了動手的時間！大家打開終端，我們一步一步來。

第一步，先確認 minikube 有沒有裝好。輸入 minikube version，如果有看到版本號就表示安裝成功了。再輸入 minikube status，如果之前有跑 minikube start，應該會看到 host、kubelet、apiserver 的狀態都是 Running。如果還沒跑或者狀態不對，就先執行 minikube start，這個過程第一次跑可能要花幾分鐘，因為它要下載映像檔和初始化叢集，大家耐心等一下。

叢集啟動之後，我們來驗證一下。輸入 kubectl get nodes，你應該會看到一個節點，名字叫 minikube，狀態是 Ready。加上 -o wide 可以看到更多資訊，包括這個節點的 IP、作業系統、Container Runtime 版本。再試試 kubectl cluster-info，會告訴你 API Server 跑在哪個地址上。

接下來是最有趣的部分。輸入 kubectl get pods -n kube-system，這裡的 -n kube-system 是指定命名空間為 kube-system，也就是 K8s 系統自己的命名空間。你會看到 etcd、kube-apiserver、kube-controller-manager、kube-scheduler、kube-proxy、coredns 這些 Pod 都在跑。還記得剛剛講的架構圖嗎？每一個組件現在都活生生地出現在你面前了。K8s 用 Pod 來跑自己的組件，是不是很酷？

再來輸入 kubectl get ns，可以看到叢集預設建立了幾個命名空間：default 是你的應用程式預設放的地方，kube-system 是系統組件放的地方，kube-public 和 kube-node-lease 是其他用途的。

然後我們來看看 Node 的詳細資訊。輸入 kubectl describe node minikube，這個指令會輸出很多內容。重點看幾個地方：Roles 會顯示 control-plane，因為 minikube 把 Master 和 Worker 合在一起了；Container Runtime 可以看到是 containerd 還是 Docker；再往下看可以看到 CPU 和記憶體的容量和已分配量，以及這個 Node 上面跑了哪些 Pod。

最後試試 minikube dashboard，它會自動打開瀏覽器，帶你到一個圖形化的管理介面。在這裡你可以用滑鼠點擊的方式來瀏覽叢集裡的所有資源，比 kubectl 更直觀。不過在日常工作中，kubectl 還是主力工具，Dashboard 比較適合用來做一些快速的查看和監控。

大家跟著我一步一步做完之後，可以自己多試幾個 kubectl 指令，比如 kubectl get all 看所有資源、kubectl api-resources 看 K8s 支援的所有資源類型。多打幾次就會越來越熟悉了。`,
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
    notes: `好，我們來總結一下今天上午的內容。

首先我們回答了「為什麼需要 Kubernetes」這個問題。當容器的數量從幾個增長到成百上千、需要跨多台機器運行的時候，Docker 和 Docker Compose 就力不從心了。K8s 提供了調度、故障恢復、彈性擴縮、滾動更新和服務發現這五大能力，完美解決了這些問題。

接著我們認識了 8 個核心概念：Pod 是最小調度單位、Service 是穩定的存取入口、Ingress 是 HTTP 路由器、ConfigMap 和 Secret 管設定和密碼、Volume 管資料持久化、Deployment 和 StatefulSet 分別管無狀態和有狀態的應用。每一個概念我們都有 Docker 的對照，幫助大家把新知識跟已有經驗連結起來。

然後我們看了 K8s 的架構：Master Node 有 API Server、etcd、Scheduler、Controller Manager 四個組件；Worker Node 有 kubelet、kube-proxy、Container Runtime 三個組件。我們還走了一遍完整的流程，理解了從你下指令到 Pod 跑起來，中間經歷了哪些步驟。

最後我們動手裝了 minikube，用 kubectl 探索了叢集，親眼在 kube-system 裡面看到了那些架構組件。

下午我們要開始寫 YAML 了。首先會講 YAML 配置檔案的基本格式，然後寫第一個 Pod 來跑 nginx，做完整的生命週期操作：建立、查看、檢查、看日誌、進容器、刪除。之後會故意把 Pod 搞壞，學會用 describe 指令來排錯，這個技能在實際工作中非常重要。最後會做一個多容器的 Pod，用 Sidecar 模式讓 nginx 和 busybox 共享 Volume。

學完這幾個章節之後，你的 minikube status 會顯示 Running，你會用 get、describe、logs、exec、delete 五個 kubectl 指令，能獨立寫出 Pod YAML 把 nginx 部署到叢集上，碰到 ImagePullBackOff 也知道怎麼查、怎麼修。

好，這個章節就到這裡，我們下一章見。`,
    duration: "5"
  },
]
