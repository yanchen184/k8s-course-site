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
    title: "第四天：Kubernetes 入門",
    subtitle: "從 Docker 到容器編排的新世界",
    section: "開場",
    content: (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <p className="text-6xl mb-3">☸️</p>
          <p className="text-3xl font-bold text-k8s-blue">Kubernetes Architecture</p>
          <p className="text-slate-400 mt-1">09:00 – 12:00 上午場</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-lg text-center opacity-50">
            <p className="text-2xl mb-1">🐧</p>
            <p className="text-slate-400 font-semibold text-sm">Day 1</p>
            <p className="text-slate-500 text-xs">Linux 基礎</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center opacity-50">
            <p className="text-2xl mb-1">🐳</p>
            <p className="text-slate-400 font-semibold text-sm">Day 2</p>
            <p className="text-slate-500 text-xs">Docker 入門</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center opacity-50">
            <p className="text-2xl mb-1">🔧</p>
            <p className="text-slate-400 font-semibold text-sm">Day 3</p>
            <p className="text-slate-500 text-xs">Docker 進階</p>
          </div>
          <div className="bg-blue-900/60 p-4 rounded-lg text-center border-2 border-k8s-blue">
            <p className="text-2xl mb-1">☸️</p>
            <p className="text-k8s-blue font-bold text-sm">Day 4</p>
            <p className="text-blue-300 text-xs font-semibold">Kubernetes!</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">今日議程</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
            <div>
              <p className="text-yellow-400 font-semibold mb-1">上午課程</p>
              <p>為什麼需要 K8s</p>
              <p>K8s 架構深入理解</p>
              <p>核心物件概念</p>
              <p>Minikube + kubectl 入門</p>
            </div>
            <div>
              <p className="text-green-400 font-semibold mb-1">下午課程</p>
              <p>YAML 基礎語法</p>
              <p>Deployment 實戰</p>
              <p>ConfigMap and Label</p>
              <p>進階 kubectl 操作</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `大家早安！歡迎來到第四天！今天是我們整個訓練營最核心的一天，我們要正式進入 Kubernetes 的世界。今天是這趟學習旅程的高峰，學完今天，大家就具備了現代雲原生開發最重要的技能之一。

在開始之前，我想先帶大家做個小回顧，看看這幾天我們走過了什麼路。第一天，我們學了 Linux 基礎操作。為什麼要先學 Linux？因為不管是 Docker 還是 Kubernetes，它們全部都跑在 Linux 上面。那時候我們學了檔案系統、權限管理、程序管理、網路基礎，還有 systemd 服務管理。這些都是底層的基礎知識。有了這些，你才能真正理解後面的技術在做什麼，而不只是照著指令貼。

第二天，我們開始學 Docker。Docker 解決了什麼問題？大家還記得嗎？就是那個「在我電腦可以跑，在你那邊掛了」的千古難題。Docker 用容器技術，把應用程式和它的所有依賴打包在一起，讓你可以在任何地方用同樣的方式執行它。我記得那天大家第一次 docker run 跑起來 nginx 的時候，臉上都有一種「哇，原來這麼簡單」的表情，很好，那個感覺是對的。

第三天，我們繼續深入 Docker，學了怎麼寫 Dockerfile、怎麼用 docker-compose 管理多個服務、網路模式 bridge 和 host 和 none、Volume 持久化儲存，還有多階段構建和 Image 最佳化。大家昨天應該對 Docker 有了相當紮實的理解了。大家有沒有完成那個把 Node.js 應用打包的練習？大部分人應該都完成了，對吧？

那今天，我們面對的是一個更大的挑戰。你已經會用 Docker 跑容器了，但現在問題來了：當你的應用程式需要跑在幾十台、幾百台機器上的時候，你要怎麼管理這些容器？要怎麼確保它們都在正常運作？要怎麼在某台機器掛掉的時候自動把服務移到別的機器？要怎麼在流量高峰的時候快速擴容，流量退去的時候又自動縮容？這些問題，Docker 本身是沒有答案的。而 Kubernetes，就是這些問題的答案。

Kubernetes，也叫 K8s，這個縮寫方式很有趣：K 和 s 之間剛好有 8 個字母，所以叫 K8s。它是由 Google 開源的容器編排平台，現在由 CNCF 也就是 Cloud Native Computing Foundation 維護。K8s 可以幫你自動化容器的部署、擴縮容、故障恢復、服務發現、負載均衡，還有很多很多功能。

我喜歡用一個比喻來解釋 K8s：如果說 Docker 是工廠裡的「工人」，每個工人負責做一件事也就是跑一個容器，那 K8s 就是這個工廠的「廠長」。廠長不需要親自做每一件事，但它負責安排誰做什麼、確保每個工人都有活幹、某個工人病假了就找人替補、業務旺季要招更多工人。K8s 就是這樣的角色，它管理的是整個容器生態系統的運作。

今天上午我們會先理解 K8s 的架構，搞清楚它裡面有哪些組件、各自是做什麼的、它們之間怎麼互動。下午我們會動手寫 YAML、跑容器、做部署。我保證，今天結束的時候，你們對 Kubernetes 會有一個全新的認識，而且已經可以在本機上跑起自己的 K8s 叢集。好，廢話不多說，讓我們開始！大家今天離「會用 Kubernetes」只有一天的距離了，加油！`,
    duration: "10"
  },
  // ── Slide 2 容器管理痛點 ─────────────────────────
  {
    title: "容器管理的五大痛點",
    subtitle: "為什麼光有 Docker 還不夠？",
    section: "為什麼需要 K8s",
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-3">
          <span className="text-2xl">😰</span>
          <div>
            <p className="text-red-400 font-semibold">痛點 1：手動管理太累</p>
            <p className="text-slate-300 text-sm">幾十台機器，每台都要 SSH 進去手動 docker run，出錯機率極高</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-3">
          <span className="text-2xl">💀</span>
          <div>
            <p className="text-red-400 font-semibold">痛點 2：故障不自動恢復</p>
            <p className="text-slate-300 text-sm">容器或機器掛了，服務就中斷，沒有自動重啟、沒有故障轉移機制</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <p className="text-red-400 font-semibold">痛點 3：擴縮容複雜費時</p>
            <p className="text-slate-300 text-sm">流量暴增？要手動 docker run N 次，再更新負載均衡器設定</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <p className="text-red-400 font-semibold">痛點 4：服務發現困難</p>
            <p className="text-slate-300 text-sm">容器 IP 動態分配，跨機器的服務不知道彼此的位置</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg flex items-start gap-3">
          <span className="text-2xl">🔄</span>
          <div>
            <p className="text-red-400 font-semibold">痛點 5：升級回滾高風險</p>
            <p className="text-slate-300 text-sm">不停機升級流程複雜，出問題想快速回滾沒有標準機制</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在讓我們來聊聊為什麼需要 Kubernetes。我要先問大家一個問題：假設你今天負責一個電商網站，它已經用 Docker 容器化了，跑得很好。現在雙十一要來了，老闆說流量可能會暴增十倍，你要怎麼辦？

第一個痛點是手動管理太累了。用純 Docker 的話，你可能會這樣做：SSH 到第一台機器，docker run 跑一個 nginx 容器；再 SSH 到第二台機器，docker run 又跑一個；然後第三台、第四台...如果你有三十台機器，你要 SSH 三十次，手動跑三十個 docker run 指令。而且每次參數都要設定正確，容器名稱、環境變數、網路設定，一個參數打錯就可能造成問題。這不只很累，而且容易出錯。有沒有人光是想像這個場景就覺得很可怕？這就是為什麼我們需要自動化的管理工具。

第二個痛點是故障不自動恢復。假設你好不容易把三十個容器都跑起來了，現在其中一台機器突然死掉了，可能是硬體故障、可能是記憶體不夠被 OOM Kill 了。那台機器上的所有容器就全部消失了。Docker 本身不會自動把那些容器在其他機器上重新跑起來。你可能要有專人 24 小時監控，一旦發現有機器或容器掛掉，就趕快手動去把那些服務重新拉起來。試想一下，半夜兩點，你正在睡覺，突然告警通知叫你起床說服務掛了，你要手動 SSH 進去把容器一個個拉起來。這是真實世界的噩夢場景。

第三個痛點是擴縮容複雜費時。假設活動期間流量暴增，你的 API server 撐不住了，你要從 2 個容器擴展到 20 個容器。用純 Docker 的話，你要手動跑 18 個新容器，然後還要更新你的 Nginx 或其他負載均衡器的設定，把流量分到這 20 個容器上。活動結束後，你還要記得把它縮回去，不然你就白白浪費了很多機器資源，每個月多付很多雲端費用。這整個流程不只麻煩，而且很容易忘記縮容，或者縮容縮錯了把正在服務的容器停掉。

第四個痛點是服務發現困難。在容器環境裡面，容器的 IP 地址是動態分配的，每次啟動可能都不一樣。如果你的前端容器需要連到後端 API 容器，它怎麼知道後端的 IP 是什麼？你可能要手動維護一個服務清單，或者使用某種額外的服務發現工具。但如果容器在不同機器上，而且會動態增減，這個清單就很難維護。一旦後端 IP 變了，前端連不到，整個服務就掛了。這在微服務架構裡是個非常常見的問題。

第五個痛點是升級和回滾高風險。當你要升級一個服務的時候，你希望做到不停機升級，也就是說新版本慢慢上線，舊版本慢慢下線，用戶感覺不到任何中斷。用純 Docker 要實現這個非常複雜：你要先拉起新版本容器，確認它正常，再慢慢停掉舊版本容器，還要更新負載均衡器。如果新版本有 Bug，要能快速回滾回舊版本。這整個流程，手動做非常容易出錯，一個步驟搞錯可能造成服務中斷。這五個痛點，就是為什麼我們需要 Kubernetes 的根本原因！`,
    duration: "10"
  },
  // ── Slide 3 K8s 解決方案與歷史 ──────────────────
  {
    title: "Kubernetes 的誕生：Google 的解法",
    subtitle: "從 Google Borg 到開源的 K8s",
    section: "為什麼需要 K8s",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">🕰️ 歷史脈絡</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="bg-slate-700 px-3 py-2 rounded text-center">
              <p className="text-slate-300 font-semibold">2003</p>
              <p className="text-slate-400 text-xs">Google Borg</p>
            </span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-center">
              <p className="text-slate-300 font-semibold">2013</p>
              <p className="text-slate-400 text-xs">Google Omega</p>
            </span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/60 px-3 py-2 rounded text-center border border-k8s-blue">
              <p className="text-k8s-blue font-bold">2014</p>
              <p className="text-blue-300 text-xs">K8s 開源！</p>
            </span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 px-3 py-2 rounded text-center">
              <p className="text-slate-300 font-semibold">2016</p>
              <p className="text-slate-400 text-xs">CNCF 接管</p>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">K8s 解決的問題</p>
            <ul className="text-sm space-y-1 text-slate-300">
              <li>自動部署與擴縮容</li>
              <li>故障自動恢復（Self-healing）</li>
              <li>內建服務發現與負載均衡</li>
              <li>滾動更新與一鍵回滾</li>
              <li>儲存編排</li>
              <li>Secret 和設定管理</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">K8s 的現況</p>
            <ul className="text-sm space-y-1 text-slate-300">
              <li>GitHub 最多星星的專案之一</li>
              <li>AWS EKS / GKE / AKS 全支援</li>
              <li>全球數萬家企業使用</li>
              <li>CNCF 生態系 1000+ 專案</li>
              <li>DevOps 職缺必備技能</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們知道了容器管理的痛點，那 Kubernetes 是怎麼出現的？這段歷史很有趣，讓我來講給大家聽。

大家知道 Google 每天要跑多少個容器嗎？他們自己公佈的數字是每周要啟動超過二十億個容器。對，你沒有聽錯，是二十億，Billion。那麼 Google 是怎麼管理這些容器的？他們用的是一個叫做 Borg 的內部系統，從 2003 年就開始開發了。Borg 就是 Kubernetes 的前身，很多 K8s 的設計思想都來自 Borg 的十幾年實戰經驗。

後來 Google 又開發了第二代系統叫 Omega，改進了 Borg 的一些架構問題。到了 2014 年，Google 決定把這些多年積累的容器管理智慧，重新用更現代的方式實作，開源出去，讓所有人都能用。這就是 Kubernetes 的誕生。K8s 這個名字來自希臘語的「舵手」，意思是一個管理船隻方向的人，很符合它管理容器的角色。

Kubernetes 在 2016 年捐給了 Cloud Native Computing Foundation，也就是 CNCF，這是 Linux Foundation 旗下的一個基金會，專門維護雲原生相關的開源專案。現在 CNCF 旗下有超過 1000 個開源專案，K8s 是最核心的那一個。

K8s 具體解決了哪些問題呢？讓我逐一說明：

第一，自動部署與擴縮容。你告訴 K8s「我要跑 10 個 nginx 容器」，它就自動幫你跑起來，分配到各個機器上。如果你說「現在要 20 個」，它就自動再增加 10 個。如果設定了 HPA，也就是 Horizontal Pod Autoscaler，它甚至可以根據 CPU 使用率自動調整副本數，完全不需要人工介入。

第二，故障自動恢復。這個非常重要！K8s 會一直監控所有的容器狀態。如果某個容器掛了，它會自動重啟；如果某台機器掛了，它會自動把那台機器上的容器重新調度到其他機器。這個「自癒」能力是 K8s 最強大的特性之一，讓你可以睡個好覺，不用擔心半夜有容器掛掉沒人管。

第三，內建服務發現與負載均衡。K8s 提供了 Service 這個物件，讓你不需要擔心容器 IP 的問題。你只需要知道 Service 的名稱，K8s 會自動幫你找到對應的容器，還會做負載均衡，把流量平均分配到所有健康的 Pod 上。

第四，滾動更新與回滾。K8s 的 Deployment 物件讓你可以做零停機的滾動更新：新版本慢慢上線，舊版本慢慢下線，用戶完全不感知。如果新版本有問題，一個指令 kubectl rollout undo 就可以回滾到上一個版本，非常方便。

現在 K8s 已經是業界標準了。AWS 有 EKS、Google 有 GKE、Azure 有 AKS、Alibaba Cloud 有 ACK，所有主要雲端都有托管的 K8s 服務。學會 K8s，等於獲得了一個可以在任何雲端上工作的通用技能。對大家的職涯發展來說，這非常非常有價值。`,
    duration: "10"
  },
  // ── Slide 4 K8s 整體架構 ─────────────────────────
  {
    title: "Kubernetes 架構全景",
    subtitle: "Control Plane 與 Worker Node 如何協作",
    section: "K8s 架構",
    content: (
      <div className="space-y-4">
        <div className="border border-k8s-blue/50 rounded-xl p-4 bg-blue-950/30">
          <p className="text-k8s-blue font-bold text-center mb-3">Control Plane（大腦）</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-blue-900/40 p-2 rounded text-center">
              <p className="text-k8s-blue text-xs font-semibold">API Server</p>
              <p className="text-slate-400 text-xs mt-1">所有指令的入口</p>
            </div>
            <div className="bg-blue-900/40 p-2 rounded text-center">
              <p className="text-k8s-blue text-xs font-semibold">etcd</p>
              <p className="text-slate-400 text-xs mt-1">叢集狀態資料庫</p>
            </div>
            <div className="bg-blue-900/40 p-2 rounded text-center">
              <p className="text-k8s-blue text-xs font-semibold">Scheduler</p>
              <p className="text-slate-400 text-xs mt-1">決定 Pod 去哪台</p>
            </div>
            <div className="bg-blue-900/40 p-2 rounded text-center">
              <p className="text-k8s-blue text-xs font-semibold">Controller Manager</p>
              <p className="text-slate-400 text-xs mt-1">確保期望狀態</p>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-400 text-sm">API 通訊（HTTPS）</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-slate-600 rounded-xl p-3 bg-slate-800/30">
            <p className="text-slate-300 font-semibold text-sm text-center mb-2">Worker Node 1</p>
            <div className="space-y-1">
              <div className="bg-slate-700/50 p-1 rounded text-xs text-center text-yellow-400">kubelet</div>
              <div className="bg-slate-700/50 p-1 rounded text-xs text-center text-yellow-400">kube-proxy</div>
              <div className="bg-green-900/40 p-1 rounded text-xs text-center text-green-400">Pod Pod</div>
            </div>
          </div>
          <div className="border border-slate-600 rounded-xl p-3 bg-slate-800/30">
            <p className="text-slate-300 font-semibold text-sm text-center mb-2">Worker Node 2</p>
            <div className="space-y-1">
              <div className="bg-slate-700/50 p-1 rounded text-xs text-center text-yellow-400">kubelet</div>
              <div className="bg-slate-700/50 p-1 rounded text-xs text-center text-yellow-400">kube-proxy</div>
              <div className="bg-green-900/40 p-1 rounded text-xs text-center text-green-400">Pod Pod</div>
            </div>
          </div>
          <div className="border border-slate-600 rounded-xl p-3 bg-slate-800/30">
            <p className="text-slate-300 font-semibold text-sm text-center mb-2">Worker Node 3</p>
            <div className="space-y-1">
              <div className="bg-slate-700/50 p-1 rounded text-xs text-center text-yellow-400">kubelet</div>
              <div className="bg-slate-700/50 p-1 rounded text-xs text-center text-yellow-400">kube-proxy</div>
              <div className="bg-green-900/40 p-1 rounded text-xs text-center text-green-400">Pod Pod</div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來看 Kubernetes 的整體架構。這是今天最重要的概念之一，把這張圖搞清楚，後面所有的東西都會更容易理解。

K8s 的架構分成兩個主要部分：Control Plane 和 Worker Node。你可以把整個 K8s 叢集想成一家公司。Control Plane 就是公司的管理層，負責做決策、管理整體狀態；Worker Node 就是公司的員工，負責實際執行工作，也就是跑容器。

先說 Control Plane。Control Plane 通常跑在一台或多台專用的機器上，在大型生產環境中，為了高可用性，Control Plane 本身也會有多個副本，通常是三個主節點。Control Plane 裡面有四個核心組件：API Server、etcd、Scheduler、Controller Manager。

API Server 是整個 K8s 的門面，所有的通訊都要經過它。當你執行 kubectl 指令的時候，實際上是在跟 API Server 說話。API Server 會驗證你的身份、檢查你的請求是否合法，然後把請求處理後存到 etcd 或者從 etcd 讀取資料回傳給你。

etcd 是 K8s 的資料庫，用來儲存整個叢集的所有狀態。你可以把 etcd 想像成 K8s 的「記憶」，所有關於叢集的資訊都在裡面：有哪些節點、跑了哪些 Pod、每個 Pod 的狀態是什麼，全都在 etcd 裡面。etcd 非常重要，如果 etcd 掛了，整個 K8s 叢集就失去記憶了，所以生產環境一定要做 etcd 的備份和高可用設定。

Scheduler 是調度器，當你要建立一個新的 Pod，Scheduler 負責決定這個 Pod 要放到哪台 Worker Node 上。它會根據各個節點的資源使用情況、Pod 的資源需求、親和性規則等等，選出最合適的節點。

Controller Manager 裡面包含了很多個 Controller，每個 Controller 負責管理一種 K8s 資源，確保資源的實際狀態和你期望的狀態保持一致。這就是 K8s 的「宣告式」管理模型。

Worker Node 是實際跑應用程式的機器，每台 Worker Node 上面有三個核心組件：kubelet、kube-proxy、Container Runtime。

kubelet 是 Worker Node 上面最重要的組件，它負責跟 Control Plane 溝通，確保這台節點上需要跑的 Pod 都跑起來了，並且持續回報節點和 Pod 的狀態給 Control Plane。

kube-proxy 負責處理網路規則，讓外部流量可以到達 Pod，也讓不同 Pod 之間可以互相通訊。它主要用 iptables 或 IPVS 來實現流量轉發。

Container Runtime 就是實際跑容器的引擎，現在最常用的是 containerd。大家可能知道以前 K8s 用 Docker 作為 Container Runtime，但從 K8s 1.20 之後，Docker 不再被直接支援，改用 containerd 或 CRI-O。不過 containerd 本身就是 Docker 的底層，所以功能上是一樣的。

這就是 K8s 的整體架構，記住這張圖：Control Plane 是大腦，Worker Node 是手腳。`,
    duration: "10"
  },
  // ── Slide 5 Control Plane 深入 ───────────────────
  {
    title: "Control Plane：K8s 的大腦",
    subtitle: "API Server / etcd / Scheduler / Controller Manager",
    section: "K8s 架構",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-k8s-blue">
            <p className="text-k8s-blue font-bold mb-2">API Server</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>所有操作的唯一入口</li>
              <li>驗證身份與授權（RBAC）</li>
              <li>RESTful API 介面</li>
              <li>kubectl 就是在跟它說話</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-400">
            <p className="text-yellow-400 font-bold mb-2">etcd</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>分散式 key-value store</li>
              <li>儲存所有叢集狀態</li>
              <li>強一致性 (Raft 演算法)</li>
              <li>K8s 的「記憶」，掛了很嚴重</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-green-400">
            <p className="text-green-400 font-bold mb-2">Scheduler（調度器）</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>決定 Pod 要去哪台 Node</li>
              <li>考量資源需求與可用量</li>
              <li>考量親和性 / 反親和性規則</li>
              <li>最佳化資源使用效率</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-400">
            <p className="text-purple-400 font-bold mb-2">Controller Manager</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>包含多個 Controller</li>
              <li>持續監控實際狀態</li>
              <li>趨近期望狀態（Reconciliation）</li>
              <li>Deployment / Node / ReplicaSet...</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm text-center text-slate-300">
          <span className="text-k8s-blue">kubectl apply</span> →
          <span className="text-k8s-blue"> API Server</span> →
          <span className="text-yellow-400"> etcd 儲存</span> →
          <span className="text-purple-400"> Controller</span> →
          <span className="text-green-400"> Scheduler</span> →
          <span className="text-white"> Worker Node</span>
        </div>
      </div>
    ),
    notes: `好，現在讓我們深入來看 Control Plane 的每個組件。這是理解 K8s 如何運作的關鍵，搞清楚這個，你才能真正理解 K8s 為什麼這麼強大。

先講 API Server。API Server 是 K8s 的「門面」，是整個系統唯一的入口點。當你執行 kubectl get pods 的時候，你的 kubectl 工具會把這個請求轉換成一個 HTTP 請求，發送到 API Server。API Server 收到請求後，會做幾件事：第一，驗證你的身份，也就是 Authentication，確認你是誰；第二，檢查你有沒有權限做這件事，也就是 Authorization，K8s 通常用 RBAC 來做授權控制；第三，驗證請求的格式是否正確，也就是 Admission Control；第四，如果是讀取操作，就從 etcd 拿資料回傳；如果是寫入操作，就把資料寫到 etcd。

API Server 提供的是標準的 RESTful API，所以不只是 kubectl，任何可以發 HTTP 請求的工具都可以跟 K8s 互動。這也讓 K8s 很容易和其他系統整合，很多 CI/CD 工具、監控工具都是直接呼叫 API Server 的。

再說 etcd。etcd 的名字來自 /etc 這個 Unix 設定目錄 加上 d 代表 distributed，它是一個分散式的 key-value store，設計目標是高可靠性和強一致性。K8s 把所有的叢集狀態都存在 etcd 裡面：有哪些節點、每個節點的狀態、有哪些 Pod、每個 Pod 在哪台節點、有哪些 Service，所有的資源定義全部都在 etcd 裡。

etcd 使用 Raft 共識算法，需要超過半數節點存活才能正常運作，這就是為什麼 etcd 通常以奇數個節點部署，例如 3 個或 5 個。如果你有 3 個 etcd 節點，允許 1 個掛掉；如果有 5 個，允許 2 個掛掉。在生產環境，etcd 的備份非常重要，因為 etcd 裡面有整個叢集的狀態，如果 etcd 資料遺失，整個叢集就等於失憶了，你需要從備份還原。

然後是 Scheduler，調度器。當一個新的 Pod 被建立、但還沒有被分配到任何節點的時候，Scheduler 就會被觸發。它會做的事情是：首先過濾掉所有不滿足 Pod 需求的節點，比如資源不夠、有 Taint 等，然後對剩下的節點打分，選出最高分的那台節點，把 Pod 分配過去。Scheduler 打分的依據有很多：CPU 和記憶體的剩餘量、親和性規則、資源均衡等。這個過程讓 Pod 可以被最合理地分配到叢集中的各台機器上，充分利用資源。

最後是 Controller Manager。它裡面其實包含了很多個 Controller，每個 Controller 負責一種資源。比如 Deployment Controller 負責管理 Deployment 的副本數；ReplicaSet Controller 負責確保 Pod 副本數正確；Node Controller 負責監控節點，如果節點長時間沒有回報，就把它標記為不可用。所有這些 Controller 都在做同樣的一件事：不斷地比較「期望狀態」和「實際狀態」，如果不一樣，就採取行動讓它們一致。這個模式叫做 Reconciliation Loop，是 K8s 最核心的設計思想。比如你說「我要 3 個 nginx 的副本」，但現在只有 2 個，Controller 就會建立一個新的 Pod，讓副本數變成 3。這種自動修復的能力，就是 K8s 的「自癒」特性。`,
    duration: "10"
  },
  // ── Slide 6 Worker Node & Pod 調度流程 ──────────
  {
    title: "Worker Node 與 Pod 調度流程",
    subtitle: "kubelet / kube-proxy / Container Runtime",
    section: "K8s 架構",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-lg border-t-2 border-yellow-400">
            <p className="text-yellow-400 font-bold mb-2">kubelet</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>Node 上的 K8s 代理人</li>
              <li>接收 Pod Spec 並執行</li>
              <li>確保容器在跑</li>
              <li>持續回報節點狀態</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border-t-2 border-green-400">
            <p className="text-green-400 font-bold mb-2">kube-proxy</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>維護 iptables / IPVS 規則</li>
              <li>實現 Service 流量路由</li>
              <li>Pod 間網路通訊</li>
              <li>負載均衡</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border-t-2 border-purple-400">
            <p className="text-purple-400 font-bold mb-2">Container Runtime</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>實際跑容器</li>
              <li>containerd（現在主流）</li>
              <li>CRI-O</li>
              <li>符合 CRI 介面規範</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">Pod 調度流程（當你 kubectl apply 時）</p>
          <div className="space-y-1 text-sm">
            <p><span className="text-k8s-blue">1.</span> kubectl → API Server（驗證並儲存到 etcd）</p>
            <p><span className="text-k8s-blue">2.</span> Scheduler 發現未調度的 Pod → 選擇節點 → 更新 etcd</p>
            <p><span className="text-k8s-blue">3.</span> 目標節點的 kubelet 監聽到新 Pod → 呼叫 Container Runtime</p>
            <p><span className="text-k8s-blue">4.</span> Container Runtime 拉取 Image → 啟動容器</p>
            <p><span className="text-k8s-blue">5.</span> kubelet 回報 Pod 狀態給 API Server</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在讓我們把 Worker Node 的組件和整個 Pod 的調度流程講清楚。這個流程搞清楚之後，你對 K8s 的理解會大幅提升。

Worker Node 上面有三個核心組件：kubelet、kube-proxy、Container Runtime。

kubelet 是每台 Worker Node 上面最重要的組件，你可以把它理解為「節點上的 K8s 代理人」。kubelet 會持續監聽 API Server，看看有沒有新的 Pod 需要在這台節點上跑。當 Scheduler 決定把某個 Pod 調度到這台節點的時候，kubelet 就會收到這個任務，然後調用 Container Runtime 去把容器跑起來。除此之外，kubelet 還負責監控這台節點上所有容器的狀態，如果某個容器掛了，kubelet 會嘗試重啟它。kubelet 也會持續向 API Server 回報這台節點的健康狀態和資源使用情況，讓 Scheduler 知道這台節點目前的狀況。

kube-proxy 是每台 Worker Node 上面的網路代理，它負責實現 K8s Service 的網路路由功能。當你建立一個 Service，kube-proxy 就會在每台節點上設定對應的 iptables 規則或 IPVS 規則，讓流量可以正確地被路由到對應的 Pod。kube-proxy 也實現了負載均衡的功能，當一個 Service 背後有多個 Pod 的時候，kube-proxy 會把流量均衡地分配到這些 Pod。

Container Runtime 就是實際跑容器的引擎。K8s 使用 CRI，也就是 Container Runtime Interface 這個標準介面來和 Container Runtime 溝通。只要符合 CRI 介面的 Container Runtime 都可以被 K8s 使用。目前最主流的是 containerd，它其實就是 Docker 的底層組件，Docker 也是用 containerd 來跑容器的。另外 CRI-O 也是一個常見的選擇，它是由 Red Hat 開發的輕量級 Container Runtime。

現在讓我們來看整個 Pod 的調度流程，這是理解 K8s 如何工作的關鍵：

第一步，當你執行 kubectl apply -f pod.yaml 的時候，kubectl 把 YAML 轉換成 JSON 格式，發送 HTTP POST 請求到 API Server。API Server 驗證你的身份和請求格式，然後把這個 Pod 的定義儲存到 etcd。此時 Pod 的狀態是 Pending，因為還沒有被分配到任何節點。

第二步，Scheduler 透過 Watch 機制監聽 API Server，發現有一個新的 Pod 還沒有被調度，也就是還沒有 nodeName 欄位。Scheduler 就開始計算：哪台 Worker Node 最適合跑這個 Pod？它會過濾掉資源不夠的節點、過濾掉有 Taint 的節點（除非 Pod 有對應的 Toleration），然後對剩下的節點打分，選出最高分的。最後 Scheduler 更新 etcd，把這個 Pod 的 nodeName 設定為選中的節點。

第三步，被選中的 Worker Node 上的 kubelet 也在持續 Watch API Server。當它看到有個 Pod 的 nodeName 是自己這台節點的時候，就知道「啊，有個新任務！」。kubelet 讀取 Pod 的 Spec，然後調用 Container Runtime（containerd）去拉取 Image 並啟動容器。

第四步，Container Runtime 從 Registry 拉取 Image（如果本地沒有的話），然後建立並啟動容器。

第五步，容器啟動後，kubelet 持續監控它的狀態，並定期向 API Server 回報 Pod 的狀態。當容器成功啟動，Pod 的狀態就會從 Pending 變成 Running。

這個流程大概需要幾秒到幾十秒，主要取決於 Image 是否需要下載。如果 Image 已經在節點上有快取，通常幾秒鐘就可以把 Pod 跑起來。`,
    duration: "10"
  },
  // ── Slide 7 Pod 概念 ─────────────────────────────
  {
    title: "Pod：K8s 的最小部署單位",
    subtitle: "一個或多個容器的集合，共享網路與儲存",
    section: "核心物件概念",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-3">Pod 是什麼？</p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>K8s 的最小調度單位</li>
              <li>可以包含 1 到多個容器</li>
              <li>所有容器共享同一個 IP</li>
              <li>所有容器共享 Volume</li>
              <li>通常一個 Pod 一個容器</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-semibold mb-2">Pod 比喻</p>
            <p className="text-sm text-slate-300 mb-2">Pod 就像一個「房間」：</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>容器 = 房間裡的人</li>
              <li>共享 IP = 共用門牌號碼</li>
              <li>共享 Volume = 共用書桌</li>
              <li>可以用 localhost 互通</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">Pod vs Container vs VM</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-purple-400 font-semibold">VM</p>
              <p className="text-slate-400">獨立 OS、獨立 IP</p>
              <p className="text-slate-400">隔離強，啟動慢</p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-blue-400 font-semibold">Container</p>
              <p className="text-slate-400">共享 OS Kernel</p>
              <p className="text-slate-400">輕量，秒級啟動</p>
            </div>
            <div className="bg-green-900/40 p-2 rounded border border-green-500/30">
              <p className="text-green-400 font-semibold">Pod</p>
              <p className="text-slate-400">K8s 調度單位</p>
              <p className="text-slate-400">可含多個容器</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來聊核心物件概念。K8s 裡面有很多種資源物件，今天我們先講最基礎的四個：Pod、ReplicaSet、Deployment、Service。

先講 Pod，這是 K8s 裡面最基本的部署單位。很多剛接觸 K8s 的人會問：「我用 Docker 的時候，最小的單位是 Container，為什麼 K8s 要多一層 Pod？」這是個很好的問題！

Pod 是 K8s 的最小調度單位。K8s 不直接管理容器，而是管理 Pod。每個 Pod 可以包含一個或多個容器，這些容器在同一個 Pod 裡面會共享網路命名空間和儲存卷。

共享網路命名空間的意思是：同一個 Pod 裡的所有容器，它們的網路介面是共享的。它們有同一個 IP 地址，如果容器 A 想要連到容器 B，只需要用 localhost 加上對應的 Port 就可以了，就像是兩個程式跑在同一台機器上一樣。

我喜歡用「房間」來比喻 Pod：Pod 就是一個房間，容器就是房間裡的人。這個房間只有一個門牌號碼，也就是 IP 地址，但裡面的人可以自由溝通。房間裡的人也可以共用書桌，也就是 Volume，比如一個容器寫的日誌，另一個容器可以讀取。

在實際使用中，大多數情況下一個 Pod 只有一個容器。但有些特殊場景需要多個容器在同一個 Pod 裡：

第一個場景叫做 Sidecar Pattern：比如你的主要應用容器負責跑你的 API，旁邊有個 sidecar 容器負責收集日誌或做監控。這兩個容器需要緊密協作，放在同一個 Pod 裡可以共享本地檔案系統。Istio 的 Envoy proxy 就是典型的 sidecar 容器。

第二個場景叫做 Init Container：在主容器啟動之前，先跑一個初始化容器，做一些初始化工作，比如等待資料庫準備好、初始化設定檔等。

Pod 還有個重要特性：Pod 本身是「短暫的」，它不是設計來永久存在的。如果一個 Pod 掛了，K8s 不會去修復那個 Pod，而是會建立一個全新的 Pod 來替代它。所以 Pod 的 IP 地址可能會改變，這就是為什麼我們需要 Service 來提供一個穩定的存取入口。

另外要注意：直接建立 Pod 通常不是最佳做法，因為 Pod 沒有自動重建的能力。在實際使用中，我們通常透過 Deployment 來管理 Pod，這樣 K8s 會確保 Pod 的數量維持在期望值。`,
    duration: "10"
  },
  // ── Slide 8 ReplicaSet & Deployment ─────────────
  {
    title: "ReplicaSet & Deployment",
    subtitle: "維持副本數，實現滾動更新",
    section: "核心物件概念",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/30">
            <p className="text-k8s-blue font-semibold mb-2">ReplicaSet</p>
            <p className="text-slate-300 text-sm mb-2">確保指定數量的 Pod 副本永遠在跑</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>Pod 掛了 → 自動建立新的</li>
              <li>多了 → 自動刪除多餘的</li>
              <li>透過 selector 選擇管理的 Pod</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-semibold mb-2">Deployment（常用！）</p>
            <p className="text-slate-300 text-sm mb-2">管理 ReplicaSet，提供更豐富的功能</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>滾動更新（Zero downtime）</li>
              <li>版本歷史記錄</li>
              <li>一鍵回滾到任意版本</li>
              <li>暫停 / 恢復更新</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">物件層級關係</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="bg-green-900/40 px-3 py-1 rounded border border-green-500/50 text-green-400">Deployment</span>
            <span className="text-slate-500">管理</span>
            <span className="bg-blue-900/40 px-3 py-1 rounded border border-blue-500/50 text-k8s-blue">ReplicaSet</span>
            <span className="text-slate-500">管理</span>
            <span className="bg-slate-700 px-3 py-1 rounded text-slate-300">Pod</span>
            <span className="text-slate-500">包含</span>
            <span className="bg-slate-600 px-3 py-1 rounded text-slate-300">Container</span>
          </div>
        </div>
        <div className="bg-blue-900/20 p-3 rounded-lg border border-k8s-blue/30">
          <p className="text-k8s-blue text-sm font-semibold">實務上：直接用 Deployment，K8s 自動幫你管 ReplicaSet</p>
        </div>
      </div>
    ),
    notes: `好，現在講 ReplicaSet 和 Deployment，這兩個是日常使用 K8s 最常見的資源物件。

先說 ReplicaSet。ReplicaSet 的功能很簡單但很重要：它確保在任何時候，都有指定數量的 Pod 副本在跑。你告訴 ReplicaSet「我要 3 個 nginx 的副本」，ReplicaSet 就會確保永遠有 3 個 nginx Pod 在運行。

如果其中一個 Pod 掛了，ReplicaSet 的 Controller 會立刻發現，然後建立一個新的 Pod 來補上，讓副本數回到 3 個。反過來，如果你手動建立了一個多餘的 Pod，ReplicaSet 也會把它刪掉，讓副本數保持在 3 個。

ReplicaSet 用 selector 來識別它管理的 Pod：你定義一個 Label Selector，ReplicaSet 只管理有對應 Label 的 Pod。

那 Deployment 又是什麼？Deployment 可以說是 ReplicaSet 的超集，它在 ReplicaSet 的基礎上增加了很多好用的功能，特別是版本管理和滾動更新。

Deployment 的核心功能是滾動更新。當你要更新一個應用的時候，比如從 v1 更新到 v2，Deployment 會這樣做：先建立一個新的 ReplicaSet for v2，逐漸增加 v2 的 Pod 數量，同時逐漸減少 v1 的 Pod 數量，直到所有 Pod 都是 v2。這個過程中，整個服務都沒有中斷，用戶完全感知不到升級的發生。這就是零停機升級。

Deployment 也會保留更新歷史。你可以用 kubectl rollout history 查看所有的更新記錄，如果某次更新有問題，可以用 kubectl rollout undo 快速回滾到上一個版本，或者指定回滾到任意一個歷史版本。

實務上的建議：你幾乎不需要直接建立 ReplicaSet 或 Pod，直接用 Deployment 就好。Deployment 會自動幫你管理 ReplicaSet，你只需要描述你要的最終狀態，K8s 會幫你實現。

物件層級關係是：Deployment 管理 ReplicaSet，ReplicaSet 管理 Pod，Pod 包含 Container。但作為使用者，你只需要定義 Deployment，K8s 會自動幫你建立對應的 ReplicaSet 和 Pod。

有個重要概念：這整個層級都是宣告式的。你不說「請幫我建立 3 個 Pod」，而是說「我的期望狀態是 3 個 Pod」。K8s 會不斷地對比期望狀態和實際狀態，並採取行動讓它們一致。這種宣告式的方式，讓系統具有很強的自癒能力。`,
    duration: "10"
  },
  // ── Slide 9 Service ──────────────────────────────
  {
    title: "Service：穩定的服務入口",
    subtitle: "負載均衡 + 服務發現",
    section: "核心物件概念",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">為什麼需要 Service？</p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>Pod IP 是動態的（Pod 重建就變了）</li>
              <li>Pod 可能有多個副本</li>
              <li>需要一個穩定的存取入口</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">Service 做什麼？</p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>提供固定的 ClusterIP</li>
              <li>DNS 名稱（服務發現）</li>
              <li>自動負載均衡到後端 Pods</li>
              <li>健康檢查，只送流量給健康的 Pod</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
          <p className="text-slate-400 mb-1">Service 類型</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-700/50 p-2 rounded text-center">
              <p className="text-k8s-blue font-semibold text-xs">ClusterIP</p>
              <p className="text-slate-400 text-xs">叢集內部使用</p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded text-center">
              <p className="text-yellow-400 font-semibold text-xs">NodePort</p>
              <p className="text-slate-400 text-xs">對外開放 Node 的 Port</p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded text-center">
              <p className="text-green-400 font-semibold text-xs">LoadBalancer</p>
              <p className="text-slate-400 text-xs">雲端 Load Balancer</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，最後一個核心物件：Service。這個很重要，要理解清楚。

問題出在 Pod 的 IP 是動態的。每次 Pod 被重建，它可能會得到一個不同的 IP 地址。如果你的前端應用直接連到後端 Pod 的 IP，一旦後端 Pod 重建，IP 就變了，前端就連不上了。

而且，你可能有 3 個後端 Pod 副本，你怎麼決定要連哪一個？總不能讓前端去輪流試吧？

Service 就是解決這個問題的。Service 提供一個固定的 ClusterIP 和 DNS 名稱，你只需要連到 Service，Service 就會自動把你的請求轉發到後端健康的 Pod 上，而且它也會做負載均衡。

Service 的類型有三種：ClusterIP 是預設類型，只在叢集內部可以存取，適合微服務之間的通訊；NodePort 會在每台 Worker Node 上開一個固定的 Port，外部可以透過任意節點的 IP + Port 來存取服務；LoadBalancer 是在雲端環境中使用，會自動建立一個雲端 Load Balancer，並分配一個公開的 IP 地址。

Service 透過 Label Selector 來選擇它要把流量送到哪些 Pod。這和 ReplicaSet 的 selector 概念一樣，Service 只會把流量送給有對應 Label 且狀態健康的 Pod。

這四個核心物件，Pod、ReplicaSet、Deployment、Service，是 K8s 的基礎。下午我們會親手寫它們的 YAML 定義。`,
    duration: "5"
  },
  // ── Slide 10 休息 ───────────────────────────────
  {
    title: "休息時間",
    subtitle: "15 分鐘 — 喝水、動一動、回顧前半段",
    section: "休息",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-8xl">☕</p>
        <p className="text-3xl font-bold text-k8s-blue">休息 15 分鐘</p>
        <div className="bg-slate-800/50 p-5 rounded-xl">
          <p className="text-yellow-400 font-semibold mb-3">趁休息時，思考一下這些問題：</p>
          <div className="text-left space-y-2 text-slate-300 text-sm max-w-lg mx-auto">
            <p>K8s 的 Control Plane 有哪四個組件？各自是做什麼的？</p>
            <p>etcd 為什麼那麼重要？它裡面存了什麼？</p>
            <p>Pod、ReplicaSet、Deployment 之間的關係是什麼？</p>
            <p>為什麼需要 Service？Pod 直接通訊有什麼問題？</p>
          </div>
        </div>
        <p className="text-slate-400">下半段：Minikube 安裝 + kubectl 實戰！</p>
      </div>
    ),
    notes: `好，我們前半段講了很多理論：K8s 的架構、Control Plane 的各個組件、Worker Node 的組成、Pod 調度流程、還有四個核心物件。這些概念很重要，是後面所有操作的基礎。

趁休息的時候，大家可以思考幾個問題：Control Plane 有哪四個組件？它們各自負責什麼？etcd 為什麼那麼重要？Pod、ReplicaSet、Deployment 的層級關係是什麼？為什麼需要 Service？這些問題如果都能清楚回答，說明你對前半段的理解很紮實。

後半段我們要從理論進入實戰：先安裝 Minikube，在大家的本機上跑起一個 K8s 叢集，然後用 kubectl 真正操作 K8s，建立第一個 Pod。大家準備好了嗎？休息完我們馬上開始！`,
    duration: "15"
  },
  // ── Slide 11 Minikube 介紹與安裝 ─────────────────
  {
    title: "Minikube：在本機跑 K8s",
    subtitle: "學習環境安裝 step-by-step",
    section: "Minikube 安裝",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Minikube 是什麼？</p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>在本機跑一個單節點 K8s 叢集</li>
              <li>可用 Docker / VirtualBox 作為 Driver</li>
              <li>適合學習和本地開發</li>
              <li>不適合生產環境</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">安裝前置需求</p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>Docker Desktop（已安裝）</li>
              <li>至少 2 CPU、2GB RAM</li>
              <li>20GB 磁碟空間</li>
              <li>網路連線（下載 Image）</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">安裝指令</p>
          <div className="space-y-2 text-sm font-mono">
            <p className="text-green-400"># macOS（Homebrew）</p>
            <p className="text-slate-300">brew install minikube</p>
            <p className="text-green-400"># Windows（Chocolatey）</p>
            <p className="text-slate-300">choco install minikube</p>
            <p className="text-green-400"># 啟動叢集</p>
            <p className="text-yellow-400">minikube start --driver=docker</p>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg text-sm">
          <p className="text-green-400 font-semibold">成功標誌：Done! kubectl is now configured to use "minikube"</p>
        </div>
      </div>
    ),
    notes: `好，休息結束！現在我們進入實戰環節。首先我們要安裝 Minikube，這是一個讓你可以在本機上跑 Kubernetes 的工具。

什麼是 Minikube？Minikube 就是一個「縮小版的 K8s」，它會在你的本機上建立一個單節點的 K8s 叢集。Control Plane 和 Worker Node 都在同一台機器上，非常適合用來學習和本地開發測試。

注意：Minikube 是學習工具，不適合生產環境。生產環境你會用 AWS EKS、Google GKE、或者自己架設的多節點叢集。但對於學習 K8s 來說，Minikube 非常方便。

Minikube 支援多種 Driver：
- Docker Driver：在 Docker 容器裡面跑 K8s，最推薦，因為大家已經裝了 Docker
- VirtualBox Driver：在虛擬機器裡面跑 K8s
- HyperKit Driver（macOS）：使用 macOS 的 Hypervisor

我們今天用 Docker Driver，因為大家都已經裝好 Docker 了。

安裝 Minikube：
- macOS 用 Homebrew：brew install minikube
- Windows 用 Chocolatey：choco install minikube
- 或者直接從 Minikube 官網下載執行檔

安裝完之後，用 minikube start --driver=docker 來啟動叢集。第一次啟動會比較慢，因為要下載 K8s 的各種組件 Image，可能需要幾分鐘。成功之後，你會看到「Done! kubectl is now configured to use minikube」這個訊息。

Minikube 啟動成功後，它也會自動幫你設定好 kubectl，讓 kubectl 連到你本機的 Minikube 叢集。你可以用 kubectl get nodes 來確認，應該會看到一個名為 minikube 的節點，狀態是 Ready。

Minikube 也提供了一個很方便的 Dashboard，可以用 minikube dashboard 來啟動一個瀏覽器介面，用視覺化的方式查看和管理你的叢集。雖然實際工作中我們用 kubectl 指令，但初學的時候 Dashboard 可以幫助你理解叢集的狀態。

另外，Minikube 還有一個很實用的功能：addons。你可以用 minikube addons list 查看所有可用的 addons，用 minikube addons enable 來啟用，比如 metrics-server、ingress 等。這讓你可以在本機上測試很多進階功能。

現在讓大家動手安裝。如果安裝過程中有任何問題，請舉手，我來幫你解決。通常常見的問題是：Docker 沒有啟動、或者 Docker 的資源分配不夠（要在 Docker Desktop 的設定裡把 CPU 和記憶體調高）。`,
    duration: "15"
  },
  // ── Slide 12 kubeconfig & Context ───────────────
  {
    title: "kubeconfig 與 Context 概念",
    subtitle: "如何管理多個 K8s 叢集連線",
    section: "Minikube 安裝",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">kubeconfig 是什麼？</p>
          <p className="text-slate-300 text-sm mb-2">kubectl 的設定檔，預設位置：<span className="text-yellow-400 font-mono">~/.kube/config</span></p>
          <p className="text-slate-300 text-sm">包含：連線哪個叢集、用哪個帳號、當前 Context</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">常用指令</p>
          <div className="space-y-1 font-mono text-sm">
            <p><span className="text-slate-400"># 查看所有 context</span></p>
            <p className="text-slate-300">kubectl config get-contexts</p>
            <p><span className="text-slate-400"># 切換 context</span></p>
            <p className="text-slate-300">kubectl config use-context minikube</p>
            <p><span className="text-slate-400"># 查看當前 context</span></p>
            <p className="text-slate-300">kubectl config current-context</p>
          </div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold mb-1">實務場景</p>
          <p className="text-slate-300">同時管理 dev、staging、production 三個叢集，透過切換 context 來操作不同環境</p>
        </div>
      </div>
    ),
    notes: `好，現在讓我們聊聊 kubeconfig 和 Context 的概念。這個在實際工作中非常重要，因為工程師通常需要同時管理多個 K8s 叢集，比如開發環境、測試環境、生產環境。

kubeconfig 是 kubectl 的設定檔，預設存在 ~/.kube/config 這個路徑。這個檔案用 YAML 格式寫的，裡面包含三種資訊：

第一種是 Clusters：定義你可以連接的叢集清單，每個叢集有一個名稱、API Server 的地址、和叢集的 CA 憑證。

第二種是 Users：定義可以用來認證的帳號清單，每個帳號有一個名稱和對應的認證方式，比如 client certificate、token、或者其他認證方式。

第三種是 Contexts：把 Cluster 和 User 組合在一起，形成一個 Context。Context 說的是「我用哪個帳號連到哪個叢集，預設操作哪個 Namespace」。

當你安裝 Minikube 並啟動叢集後，Minikube 會自動在你的 kubeconfig 裡面添加一個 Context，名稱叫做 minikube。所以你可以直接用 kubectl 操作 Minikube 叢集。

在實際工作中，你可能會有多個 Context：
- minikube：本機的 Minikube 叢集
- dev-cluster：公司的開發環境叢集  
- prod-cluster：生產環境叢集

透過 kubectl config use-context 指令來切換要操作的叢集。切換之後，所有的 kubectl 指令都會針對那個叢集執行。

一個重要的提醒：切換 Context 的時候要特別小心，確認你目前在操作哪個叢集！很多工程師曾經因為 Context 沒切對，在開發環境想測試的指令，卻打到生產環境去了。這是很危險的事情。建議在 zsh 或 bash 的提示符號上顯示當前的 Context，時刻提醒自己在操作哪個環境。

查看當前 Context：kubectl config current-context
查看所有 Context：kubectl config get-contexts
切換 Context：kubectl config use-context [context-name]`,
    duration: "10"
  },
  // ── Slide 13 kubectl 基本語法 ────────────────────
  {
    title: "kubectl 基本語法",
    subtitle: "kubectl [command] [type] [name] [flags]",
    section: "kubectl 入門",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">語法結構</p>
          <p className="font-mono text-lg text-center mb-3">
            <span className="text-green-400">kubectl</span>{" "}
            <span className="text-yellow-400">[command]</span>{" "}
            <span className="text-k8s-blue">[type]</span>{" "}
            <span className="text-purple-400">[name]</span>{" "}
            <span className="text-slate-400">[flags]</span>
          </p>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="text-center">
              <p className="text-green-400 font-semibold">command</p>
              <p className="text-slate-400">get, apply</p>
              <p className="text-slate-400">describe, delete</p>
              <p className="text-slate-400">create, edit</p>
            </div>
            <div className="text-center">
              <p className="text-k8s-blue font-semibold">type</p>
              <p className="text-slate-400">pods / pod / po</p>
              <p className="text-slate-400">nodes / node</p>
              <p className="text-slate-400">services / svc</p>
            </div>
            <div className="text-center">
              <p className="text-purple-400 font-semibold">name</p>
              <p className="text-slate-400">資源名稱</p>
              <p className="text-slate-400">（可省略）</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 font-semibold">flags</p>
              <p className="text-slate-400">-n namespace</p>
              <p className="text-slate-400">-o wide/yaml</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">範例</p>
          <div className="space-y-1 font-mono text-sm text-slate-300">
            <p>kubectl <span className="text-yellow-400">get</span> <span className="text-k8s-blue">pods</span></p>
            <p>kubectl <span className="text-yellow-400">describe</span> <span className="text-k8s-blue">pod</span> <span className="text-purple-400">my-nginx</span></p>
            <p>kubectl <span className="text-yellow-400">delete</span> <span className="text-k8s-blue">pod</span> <span className="text-purple-400">my-nginx</span></p>
            <p>kubectl <span className="text-yellow-400">get</span> <span className="text-k8s-blue">pods</span> <span className="text-slate-400">-n kube-system</span></p>
            <p>kubectl <span className="text-yellow-400">get</span> <span className="text-k8s-blue">all</span> <span className="text-slate-400">-o wide</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來學 kubectl 的基本語法。kubectl 是你跟 K8s 叢集溝通的主要工具，你在終端機輸入的所有 kubectl 指令，最終都是在跟 API Server 說話。

kubectl 的基本語法是：kubectl [command] [type] [name] [flags]

command 是你要做什麼操作：
- get：查看資源
- describe：查看資源的詳細資訊  
- apply：建立或更新資源（通常配合 -f YAML 檔案使用）
- create：建立資源
- delete：刪除資源
- edit：直接編輯資源（會打開 vim）
- logs：查看 Pod 的日誌
- exec：在容器裡面執行指令

type 是你要操作哪種資源。K8s 的資源類型很多，常用的有：
- pods 或 pod 或 po（縮寫）
- nodes 或 node
- services 或 svc
- deployments 或 deploy
- namespaces 或 ns
- configmaps 或 cm

name 是資源的名稱，如果省略，就是查看所有該類型的資源。

flags 是一些額外的選項：
- -n 或 --namespace：指定 Namespace，預設是 default
- -o wide：顯示更多資訊，比如 IP 地址和所在節點
- -o yaml：以 YAML 格式輸出資源的完整定義
- -o json：以 JSON 格式輸出
- --all-namespaces 或 -A：查看所有 Namespace 的資源

一個非常有用的技巧：kubectl 支援自動補全。在 bash 或 zsh 裡面設定好之後，你可以用 Tab 鍵來補全 kubectl 的指令、資源類型、甚至資源名稱。這個功能非常好用，可以大大提升你的工作效率。

設定方式：
kubectl completion bash >> ~/.bashrc（bash 用戶）
kubectl completion zsh >> ~/.zshrc（zsh 用戶）

另外，kubectl 也有 alias 的習慣。很多 K8s 工程師會設定 alias k=kubectl，這樣只要輸入 k 就可以了，節省很多打字時間。

記住幾個基本的指令組合：
kubectl get pods（查看所有 Pod）
kubectl get pods -o wide（查看 Pod 的詳細資訊，包括 IP 和節點）
kubectl get all（查看所有資源）
kubectl describe pod [name]（查看某個 Pod 的詳細資訊，很常用在 Debug）

接下來讓我們一一實際演示這些指令。`,
    duration: "10"
  },
  // ── Slide 14 kubectl get 系列 ────────────────────
  {
    title: "kubectl get 系列指令",
    subtitle: "查看叢集資源狀態",
    section: "kubectl 入門",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">常用 get 指令</p>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-2">
              <span className="text-green-400 w-52 shrink-0">kubectl get nodes</span>
              <span className="text-slate-400">查看所有 Node 的狀態</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 w-52 shrink-0">kubectl get pods</span>
              <span className="text-slate-400">查看 default 空間的 Pod</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 w-52 shrink-0">kubectl get pods -A</span>
              <span className="text-slate-400">查看所有 Namespace 的 Pod</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 w-52 shrink-0">kubectl get all</span>
              <span className="text-slate-400">查看 default 空間所有資源</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 w-52 shrink-0">kubectl get pods -o wide</span>
              <span className="text-slate-400">顯示 IP 和 Node 資訊</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 w-52 shrink-0">kubectl get pod my-pod -o yaml</span>
              <span className="text-slate-400">以 YAML 輸出完整定義</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">kubectl get pods 輸出解讀</p>
          <div className="font-mono text-xs space-y-1">
            <p className="text-slate-400">NAME              READY   STATUS    RESTARTS   AGE</p>
            <p className="text-slate-300">nginx-pod         <span className="text-green-400">1/1</span>     <span className="text-green-400">Running</span>   0          5m</p>
            <p className="text-slate-300">bad-pod           <span className="text-red-400">0/1</span>     <span className="text-red-400">Error</span>     3          2m</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在讓我們來看 kubectl get 這個最常用的指令。kubectl get 是你查看叢集狀態的主要工具，你每天會用到幾十次。

kubectl get nodes 是查看叢集節點的指令。當你執行這個指令，你會看到所有 Worker Node 的清單，包括它們的名稱、狀態、角色、運行時間和 K8s 版本。在 Minikube 上，你只會看到一個節點，名稱是 minikube，狀態是 Ready。

kubectl get pods 是查看 Pod 的指令。預設情況下，它只查看 default Namespace 的 Pod。你會看到每個 Pod 的名稱、READY 欄位、STATUS、RESTARTS 次數和 AGE。

READY 欄位顯示的是「準備好的容器數 / 總容器數」。如果是 1/1，表示 Pod 裡有一個容器，而且這個容器已經準備好了。如果是 0/1，表示容器還沒有準備好，可能是在啟動中或者有問題。

STATUS 欄位顯示 Pod 的狀態：
- Running：Pod 正在正常運行
- Pending：Pod 在等待被調度，或者 Image 還在下載
- Succeeded：Pod 已經正常結束（通常用於一次性任務）
- Failed：Pod 以非零狀態結束（有錯誤）
- CrashLoopBackOff：容器一直在崩潰重啟，通常是應用程式有問題

RESTARTS 顯示這個 Pod 重啟了幾次。如果次數很多，說明容器一直在崩潰，需要去查日誌找原因。

AGE 顯示 Pod 已經跑了多久。

kubectl get pods -A 或 --all-namespaces 可以查看所有 Namespace 的 Pod，這樣你也可以看到 kube-system 裡面的系統 Pod，比如 kube-dns、kube-proxy 等。

kubectl get pods -o wide 會在輸出中多顯示 IP 地址和 Pod 所在的 Node，這在 Debug 的時候很有用，可以讓你知道 Pod 的網路位置和它被調度到哪台機器上。

kubectl get pod [name] -o yaml 可以以 YAML 格式輸出某個 Pod 的完整定義，包括 K8s 自動加上的欄位，比如 Status、Events 等。這在你想了解一個 Pod 的完整狀態時非常有用，也可以用來學習 YAML 的寫法。

一個技巧：如果你想持續監控 Pod 的狀態，可以加上 -w 或 --watch 選項，kubectl get pods -w。這樣指令不會退出，而是會在 Pod 狀態改變的時候即時更新顯示，就像是 watch 指令一樣。`,
    duration: "10"
  },
  // ── Slide 15 kubectl describe & cluster-info ─────
  {
    title: "kubectl describe & cluster-info",
    subtitle: "深入查看資源詳情，了解叢集基本資訊",
    section: "kubectl 入門",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">kubectl describe</p>
          <p className="text-slate-300 text-sm mb-3">查看資源的詳細資訊，包括事件記錄（Debug 最重要的工具！）</p>
          <div className="space-y-1 font-mono text-sm text-slate-300">
            <p>kubectl describe node minikube</p>
            <p>kubectl describe pod [pod-name]</p>
            <p>kubectl describe deployment [name]</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">describe pod 輸出重點</p>
          <div className="font-mono text-xs space-y-1 text-slate-300">
            <p>Name:         nginx-pod</p>
            <p>Namespace:    default</p>
            <p>Node:         minikube/192.168.49.2</p>
            <p>Status:       Running</p>
            <p>IP:           172.17.0.4</p>
            <p className="text-yellow-400">Events:</p>
            <p>  Normal  Scheduled  2m  Successfully assigned...</p>
            <p>  Normal  Pulled     1m  Container image pulled</p>
            <p>  Normal  Started    1m  Started container nginx</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm font-mono">
          <p className="text-green-400 mb-1">kubectl cluster-info</p>
          <p className="text-slate-300">Kubernetes control plane: https://192.168.49.2:8443</p>
          <p className="text-slate-300">CoreDNS: https://192.168.49.2:8443/api/v1/...</p>
        </div>
      </div>
    ),
    notes: `好，現在讓我們學習另外兩個很重要的指令：kubectl describe 和 kubectl cluster-info。

kubectl describe 是你在 Debug 的時候最重要的工具之一。當一個 Pod 不正常的時候，你首先應該用 kubectl describe pod [pod-name] 來查看它的詳細資訊。

kubectl describe pod 會輸出很多資訊，最重要的是最後的 Events 部分。Events 記錄了這個 Pod 從建立到現在所有重要的事件，按時間順序排列。比如：
- Scheduled：Pod 被 Scheduler 分配到某台節點
- Pulling：開始拉取 Image
- Pulled：Image 拉取完成
- Created：容器建立完成
- Started：容器啟動完成

如果 Pod 有問題，Events 裡面通常會有 Warning 級別的事件，說明出了什麼問題。比如：
- FailedScheduling：找不到合適的節點（資源不夠、或者 Taint 的問題）
- Failed to pull image：Image 拉不到，可能是 Image 名稱寫錯了
- CrashLoopBackOff：容器一直在崩潰，需要去看日誌

除了 Events，describe 還會顯示其他有用的資訊：
- Pod 的詳細 Spec，包括所有容器的設定
- Pod 的 IP 地址和所在節點
- Volume 的掛載資訊
- 資源需求和限制
- Init Container 的狀態

kubectl cluster-info 是查看叢集基本資訊的指令，它會顯示 API Server 的地址和 CoreDNS 的地址。這個指令主要用來確認你的 kubectl 是否正確連接到叢集，以及叢集的 API Server 在哪裡。

kubectl version 則是查看 kubectl 和 K8s Server 的版本資訊。有時候 kubectl 版本和 Server 版本不一致，可能會有一些相容性問題，所以這個也值得關注。K8s 官方支援 kubectl 版本和 Server 版本之間相差一個小版本，也就是說如果 Server 是 1.28，kubectl 可以是 1.27 或 1.29，再相差就可能有問題了。

kubectl get nodes -o wide 配合 kubectl describe node 是了解節點狀態的好組合。你可以看到節點的 CPU、記憶體使用情況、分配的 Pod 數量等，這在判斷叢集資源是否充足的時候很有用。

記住：當你在 K8s 裡面遇到問題的時候，排查順序通常是：kubectl get pods（看 Pod 狀態）→ kubectl describe pod（看 Events，找問題）→ kubectl logs（看應用日誌，找更詳細的錯誤）。`,
    duration: "10"
  },
  // ── Slide 16 第一個 Pod ──────────────────────────
  {
    title: "第一個 Pod！",
    subtitle: "kubectl run nginx --image=nginx",
    section: "第一個 Pod",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">建立第一個 Pod</p>
          <div className="space-y-2 font-mono text-sm">
            <p><span className="text-slate-400"># 建立 Pod</span></p>
            <p className="text-yellow-400">kubectl run my-nginx --image=nginx</p>
            <p className="mt-2"><span className="text-slate-400"># 查看 Pod 狀態</span></p>
            <p className="text-yellow-400">kubectl get pods</p>
            <p className="text-slate-400">NAME       READY   STATUS    RESTARTS   AGE</p>
            <p className="text-green-400">my-nginx   1/1     Running   0          10s</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">觀察 Pod 啟動過程</p>
          <div className="font-mono text-xs space-y-1 text-slate-300">
            <p className="text-slate-400">NAME       READY   STATUS             RESTARTS</p>
            <p>my-nginx   0/1     ContainerCreating  0</p>
            <p>my-nginx   0/1     <span className="text-yellow-400">Pending</span>            0</p>
            <p>my-nginx   <span className="text-green-400">1/1</span>     <span className="text-green-400">Running</span>            0</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm font-mono">
          <p className="text-slate-400"># 用 -w 持續監看狀態變化</p>
          <p className="text-yellow-400">kubectl get pods -w</p>
        </div>
      </div>
    ),
    notes: `好，現在到了今天最令人興奮的部分：建立我們的第一個 Pod！

指令很簡單：kubectl run my-nginx --image=nginx

這個指令的意思是：「建立一個名為 my-nginx 的 Pod，裡面跑 nginx 這個 Image」。

執行之後，你應該看到：pod/my-nginx created

然後用 kubectl get pods 來查看 Pod 的狀態。

第一次建立 Pod 的時候，通常會看到 Pod 的狀態從 ContainerCreating 逐漸變成 Running。如果 nginx Image 之前沒有被拉取過，K8s 需要先從 Docker Hub 下載 Image，這可能需要幾十秒。

你可以用 kubectl get pods -w 來持續監看 Pod 的狀態變化，-w 是 watch 的意思，它不會退出，而是會在 Pod 狀態改變的時候即時更新。你可以看到 Pod 從 ContainerCreating 到 Running 的整個過程。

當 Pod 的 READY 欄位顯示 1/1，STATUS 顯示 Running，就表示 Pod 已經成功啟動了！

現在你已經在 K8s 上跑了你的第一個容器！雖然和 docker run 很像，但背後的機制完全不同。你發了一個指令給 API Server，API Server 把 Pod 定義存到 etcd，Scheduler 決定把它調度到哪台節點，kubelet 收到任務後調用 containerd 拉取 Image 並啟動容器，最後把狀態回報回來。這一切都在幾秒鐘內自動完成。

kubectl run 主要用在快速測試或 Debug，在實際工作中，我們通常不用 kubectl run，而是寫 YAML 然後用 kubectl apply -f 來建立資源。但 kubectl run 對於快速測試很方便。`,
    duration: "10"
  },
  // ── Slide 17 Pod 狀態與管理 ──────────────────────
  {
    title: "Pod 狀態查看與管理操作",
    subtitle: "describe / logs / delete",
    section: "第一個 Pod",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">查看 Pod 詳情</p>
          <div className="space-y-1 font-mono text-sm text-slate-300">
            <p className="text-slate-400"># 查看詳細資訊和 Events</p>
            <p className="text-yellow-400">kubectl describe pod my-nginx</p>
            <p className="text-slate-400 mt-2"># 查看容器日誌</p>
            <p className="text-yellow-400">kubectl logs my-nginx</p>
            <p className="text-slate-400 mt-2"># 持續追蹤日誌（像 tail -f）</p>
            <p className="text-yellow-400">kubectl logs -f my-nginx</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">刪除 Pod</p>
          <div className="space-y-1 font-mono text-sm text-slate-300">
            <p className="text-slate-400"># 刪除特定 Pod</p>
            <p className="text-yellow-400">kubectl delete pod my-nginx</p>
            <p className="text-slate-400 mt-2"># 刪除後驗證</p>
            <p className="text-yellow-400">kubectl get pods</p>
            <p className="text-green-400 mt-1">No resources found in default namespace.</p>
          </div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">注意：直接建立的 Pod 刪除後不會自動重建！</p>
          <p className="text-slate-300">這就是為什麼實務上要用 Deployment 管理 Pod</p>
        </div>
      </div>
    ),
    notes: `好，我們的第一個 Pod 已經跑起來了，現在讓我們來看看如何查看它的詳情、日誌，以及如何刪除它。

首先，kubectl describe pod my-nginx 可以查看 Pod 的完整詳情。輸出會包括：Pod 的 Spec（Image、Port、環境變數等）、Pod 的狀態（IP 地址、所在節點、容器狀態）、以及最重要的 Events（從建立到現在所有的事件記錄）。

對於 nginx 這個 Pod，Events 應該顯示：Scheduled（已調度到節點）、Pulled（Image 已拉取）、Created（容器已建立）、Started（容器已啟動）。這說明一切正常。如果中間有任何 Warning 事件，就是出問題的地方。

kubectl logs my-nginx 可以查看容器的標準輸出日誌。對於 nginx，你應該看到 nginx 的啟動日誌，以及每次有 HTTP 請求時的 access log。如果你之前有訪問過這個 nginx（比如透過 port-forward），就會看到請求記錄。

kubectl logs -f my-nginx 是持續追蹤日誌的指令，就像 Linux 的 tail -f 一樣。它不會退出，而是會持續輸出新的日誌。在 Debug 的時候很有用，你可以一邊追蹤日誌，一邊對服務發出請求，看日誌怎麼變化。

如果 Pod 裡有多個容器，你需要用 -c 指定要看哪個容器的日誌，比如 kubectl logs my-pod -c sidecar-container。

kubectl delete pod my-nginx 可以刪除 Pod。刪除後，Pod 就消失了。用 kubectl get pods 確認，你應該看到「No resources found in default namespace.」

注意：我們現在直接用 kubectl run 建立的 Pod，如果這個 Pod 被刪除，它不會自動重建。這是因為我們沒有用任何管理物件（比如 Deployment）來管理它。如果你用 Deployment 建立了 Pod，當 Pod 被刪除時，Deployment 的 Controller 會自動建立一個新的 Pod 來補上，確保副本數維持在期望值。

這就是為什麼在實務上，我們幾乎不會直接建立 Pod，而是用 Deployment 來管理 Pod。Deployment 給了 Pod 「永久性」，而直接建立的 Pod 是「一次性的」。下午我們會學習怎麼寫 Deployment 的 YAML，讓我們的 Pod 具備高可用性。`,
    duration: "10"
  },
  // ── Slide 18 課程總結 ────────────────────────────
  {
    title: "上午課程總結",
    subtitle: "重點回顧 + 下午 YAML 實戰預告",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">今天學到的</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>K8s 解決了哪些容器管理痛點</li>
              <li>Google Borg 的歷史淵源</li>
              <li>Control Plane 四個核心組件</li>
              <li>Worker Node 三個組件</li>
              <li>Pod 調度的完整流程</li>
              <li>Pod、ReplicaSet、Deployment、Service</li>
              <li>Minikube 本機叢集安裝</li>
              <li>kubectl 基本操作指令</li>
            </ul>
          </div>
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
            <p className="text-green-400 font-semibold mb-2">下午要學的</p>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>YAML 語法規則</li>
              <li>Pod YAML 完整撰寫</li>
              <li>Namespace 資源隔離</li>
              <li>Deployment 實戰部署</li>
              <li>ConfigMap 外部化設定</li>
              <li>Label 和 Selector</li>
              <li>進階 kubectl：exec、logs、port-forward</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg text-center">
          <p className="text-2xl mb-2">K8s 核心概念</p>
          <p className="text-slate-300 text-sm">宣告式管理：告訴 K8s「我要什麼」，K8s 負責讓它成真</p>
          <p className="text-slate-400 text-sm mt-1">Reconciliation Loop：持續比對期望狀態與實際狀態，自動修復</p>
        </div>
      </div>
    ),
    notes: `好，上午的課程到這裡告一段落。讓我來幫大家做個總結，回顧一下今天上午學到的重點。

今天上午，我們從「為什麼需要 K8s」開始，說明了容器管理的五大痛點：手動管理太累、故障不自動恢復、擴縮容複雜、服務發現困難、升級回滾高風險。然後介紹了 K8s 的起源，從 Google Borg 到 2014 年的開源 K8s，再到今天成為業界標準的發展歷程。

在 K8s 架構方面，我們學習了 Control Plane 的四個核心組件：API Server 是所有操作的入口、etcd 是叢集的記憶體資料庫、Scheduler 是調度 Pod 的大腦、Controller Manager 持續確保叢集狀態符合期望。我們也學習了 Worker Node 的三個組件：kubelet 是節點上的代理人、kube-proxy 維護網路規則、Container Runtime 實際跑容器。

然後我們學習了 Pod 的調度流程，從你執行 kubectl apply 到 Pod 跑起來，整個流程中每個組件的角色。

在核心物件概念方面，我們學習了四個最重要的資源物件：Pod 是最小的部署單位、ReplicaSet 確保副本數、Deployment 管理 ReplicaSet 並提供滾動更新、Service 提供穩定的服務入口。

在實作方面，我們安裝了 Minikube、設定了 kubectl、理解了 kubeconfig 和 Context 的概念，學習了 kubectl 的基本語法，用 kubectl get、describe 查看叢集資源，並建立了第一個 Pod，查看了它的狀態和日誌，最後刪除了它。

今天最重要的一個概念是：K8s 是宣告式的。你不告訴它「請幫我做這些步驟」，而是告訴它「我想要的最終狀態是什麼」，然後 K8s 的 Reconciliation Loop 會不斷地把實際狀態調整為期望狀態。這個思維方式和傳統的命令式方法不同，需要時間去適應，但一旦適應了，你會發現它非常強大。

下午我們會進入更多實戰操作：YAML 的撰寫、Deployment 的完整操作、ConfigMap、Label、以及更多進階 kubectl 指令。我們會真正動手部署一個應用程式。大家午休好，下午見！`,
    duration: "10"
  },
]
