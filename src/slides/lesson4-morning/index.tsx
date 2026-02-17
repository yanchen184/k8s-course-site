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
  // ========== 開場 ==========
  {
    title: "Kubernetes 架構深探",
    subtitle: "從設計哲學到核心元件",
    section: "第四堂早上",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            ☸️
          </div>
          <div>
            <p className="text-2xl font-semibold">Kubernetes 架構</p>
            <p className="text-slate-400">Control Plane、Worker Node、Pod、Deployment、Service</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">時間</p>
            <p>09:00 – 12:00（180 分鐘）</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">目標</p>
            <p>理解 K8s 架構與核心物件</p>
          </div>
        </div>
      </div>
    ),
    notes: `大家早安！歡迎來到第四堂課的早上場。今天是整個課程中概念密度最高的一堂，我們要從頭把 Kubernetes 的架構拆解清楚。

在開始之前，我先問一下大家昨天的學習狀況。Docker 的部分有沒有還不清楚的？有沒有在家試過 docker run 或 docker build？如果有任何疑問，現在是補充的好時機，因為今天的內容會大量依賴 Docker 的概念。

今天三個小時，我們的目標是讓每一位同學都能在腦子裡畫出 Kubernetes 的架構圖，知道每個元件在做什麼，以及當你執行 kubectl apply 的時候，背後到底發生了哪些事情。這個架構圖非常重要，你之後遇到任何 K8s 問題，都要回到這張圖來找答案。準備好了嗎？我們開始！`,
    duration: "3",
  },

  // ========== 今日大綱 ==========
  {
    title: "今日課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-3">
        {[
          { time: "09:00–09:10", topic: "開場與 Docker 回顧", icon: "🐳" },
          { time: "09:10–09:25", topic: "為什麼需要 K8s？痛點分析", icon: "😩" },
          { time: "09:25–09:35", topic: "K8s 歷史：Borg → 開源 → CNCF", icon: "📜" },
          { time: "09:35–10:05", topic: "Control Plane 元件深探", icon: "🧠" },
          { time: "10:05–10:25", topic: "Worker Node 元件", icon: "⚙️" },
          { time: "10:25–10:40", topic: "休息時間", icon: "☕" },
          { time: "10:40–11:05", topic: "Pod 概念與生命週期", icon: "📦" },
          { time: "11:05–11:25", topic: "Deployment 與 ReplicaSet", icon: "🔄" },
          { time: "11:25–11:40", topic: "Service 概念", icon: "🔌" },
          { time: "11:40–12:00", topic: "課程總結與 Q&A", icon: "🎯" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-sm">{item.time}</p>
              <p className="text-base">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我帶大家快速看過今天的行程，這樣心裡有個底。

早上分兩個大段落，中間休息 15 分鐘。

第一段 09:00 到 10:25，我們會從 Docker 回顧出發，一路帶到 K8s 的由來、整體架構、Control Plane 和 Worker Node 的每個元件。這個部分比較偏理論，但是是之後所有操作的地基，請認真記下來。

中間休息之後，10:40 到 12:00 我們進入 Kubernetes 最重要的三個物件：Pod、Deployment、Service。這個部分我會搭配圖表和 YAML 範例，讓大家對這些物件有具體的感覺，為下午的實作做準備。

整體而言，今天的學習目標是讓大家能夠在紙上畫出 K8s 的架構圖，並說明每個元件的職責。這個能力非常重要，面試的時候肯定會被問到！`,
    duration: "2",
  },

  // ========== Docker 回顧 ==========
  {
    title: "Docker 快速回顧",
    subtitle: "在進入 K8s 之前，確認基礎知識",
    section: "開場回顧",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-k8s-blue">核心概念</h3>
          {[
            { icon: "📄", term: "Dockerfile", desc: "定義映像的食譜" },
            { icon: "🖼️", term: "Image", desc: "靜態的應用程式快照" },
            { icon: "📦", term: "Container", desc: "Image 的執行實例" },
            { icon: "🗄️", term: "Registry", desc: "映像倉庫（如 Docker Hub）" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-white">{item.term}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-k8s-blue">Docker 做到了什麼</h3>
          <div className="space-y-2">
            {[
              "✓ 環境一致性（本地 = 正式）",
              "✓ 快速啟動（秒級）",
              "✓ 隔離的程序空間",
              "✓ 依賴打包在一起",
            ].map((item, i) => (
              <p key={i} className="text-green-400 bg-slate-800/50 p-2 rounded">{item}</p>
            ))}
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg mt-4">
            <p className="text-yellow-400 font-semibold">但是…</p>
            <p className="text-yellow-200 text-sm">管理幾百個容器怎麼辦？</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，在正式進入 Kubernetes 之前，讓我們花幾分鐘快速複習 Docker。這不是要重講昨天的內容，而是要建立一個橋梁，讓你明白 K8s 是在解決什麼問題。

Docker 讓我們可以把應用程式和它的所有依賴打包成一個映像，然後在任何地方執行，做到「本地跑得起來，正式環境也跑得起來」這個目標。這是很大的進步，以前常發生的「在我的電腦可以跑，在你的電腦壞掉」的問題幾乎消失了。

Docker 的工作流程你們應該很熟悉：寫 Dockerfile 定義映像、docker build 建出映像、docker push 推到 Registry、然後在伺服器 docker pull 下來用 docker run 跑起來。

但是有個問題：當你的服務規模變大，需要部署幾十台、幾百台伺服器的時候，靠 Docker 指令手動管理每一個容器，會變得極其痛苦。這個痛點，就是 Kubernetes 出現的原因。接下來我們就來看看，手動管理的痛有多深。`,
    duration: "8",
  },

  // ========== 手動管理痛點 ==========
  {
    title: "手動管理 100 台機器的痛點",
    subtitle: "這不是技術問題，是人力不可能的任務",
    section: "為什麼需要 K8s",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-red-400">😩 你需要手動做的事</h3>
          {[
            { icon: "💀", text: "一台掛了，手動重啟服務" },
            { icon: "📈", text: "流量暴增，手動擴充容器數量" },
            { icon: "🔄", text: "版本更新，逐台 SSH 進去更新" },
            { icon: "⚖️", text: "手動決定容器要跑在哪台機器" },
            { icon: "🔍", text: "哪台機器資源不夠？逐一查看" },
            { icon: "🌐", text: "服務間怎麼互相找到彼此？" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 p-3 rounded-lg">
              <span className="text-xl">{item.icon}</span>
              <p className="text-slate-300 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-lg mb-2">想像一下…</p>
            <p className="text-slate-300 text-sm">
              100 台機器 × 每台 20 個容器 = <span className="text-red-400 font-bold text-xl">2000 個容器</span>
            </p>
            <p className="text-slate-400 text-sm mt-2">
              同時上線，同時需要監控、更新、排查問題
            </p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 p-4 rounded-lg">
            <p className="text-orange-400 font-semibold">凌晨 3 點</p>
            <p className="text-slate-300 text-sm">5 台主機同時掛掉，你要怎麼辦？</p>
          </div>
          <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">K8s 的答案</p>
            <p className="text-slate-300 text-sm">自動化這一切，讓你只需要描述「想要的狀態」</p>
          </div>
        </div>
      </div>
    ),
    notes: `讓我說一個真實的情境。假設你是一個中型電商公司的 DevOps 工程師，你們有 100 台伺服器，每台上面跑著大約 20 個容器，加起來是 2000 個容器，負責不同的服務：前端、後端、資料庫、快取、訊息隊列、搜尋服務…等等。

某個星期五晚上，你準備去吃飯，突然 LINE 炸了：「網站掛了！」你打開電腦，發現有 5 台機器因為硬碟滿了自動重啟，上面的容器都死掉了。你需要：一、查出哪 5 台機器出問題；二、確認每台上面死了哪些容器；三、逐一 SSH 進去重新啟動這些容器；四、確認重啟之後服務真的恢復正常。光是這 4 個步驟，在沒有自動化工具的情況下，可能就要花你 1 到 2 個小時。

更慘的是，如果你的服務要更新版本，你需要逐台機器 SSH 進去，停掉舊容器，拉新映像，啟動新容器，還要確保更新過程中服務不中斷。如果有 50 台機器需要更新，你可能要花大半天，而且全程高度集中精神，一個指令打錯就可能造成服務中斷。

這種手動管理的方式，人工成本高、出錯率高、沒有可重現性，根本不適合大規模的生產環境。而 Kubernetes 的出現，就是要解決這個問題：讓你只需要描述你「想要的狀態」，剩下的讓 K8s 自動幫你搞定。這就是所謂的「宣告式管理」，我們後面會詳細解釋。`,
    duration: "8",
  },

  // ========== K8s 解決了什麼 ==========
  {
    title: "K8s 解決了哪些問題？",
    subtitle: "容器編排的核心能力",
    section: "為什麼需要 K8s",
    content: (
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            icon: "🔄",
            title: "自動重啟",
            desc: "容器掛掉？K8s 自動重新啟動",
            color: "bg-blue-900/30 border-blue-700",
            textColor: "text-blue-400",
          },
          {
            icon: "📈",
            title: "自動擴縮容",
            desc: "流量暴增時自動增加容器數量",
            color: "bg-green-900/30 border-green-700",
            textColor: "text-green-400",
          },
          {
            icon: "🚀",
            title: "滾動更新",
            desc: "零停機時間更新應用版本",
            color: "bg-purple-900/30 border-purple-700",
            textColor: "text-purple-400",
          },
          {
            icon: "⚖️",
            title: "智慧排程",
            desc: "根據資源自動決定容器放哪台機器",
            color: "bg-orange-900/30 border-orange-700",
            textColor: "text-orange-400",
          },
          {
            icon: "🔍",
            title: "服務發現",
            desc: "服務間自動互相找到彼此",
            color: "bg-red-900/30 border-red-700",
            textColor: "text-red-400",
          },
          {
            icon: "🏥",
            title: "自我修復",
            desc: "持續監控，讓系統維持期望狀態",
            color: "bg-teal-900/30 border-teal-700",
            textColor: "text-teal-400",
          },
        ].map((item, i) => (
          <div key={i} className={`${item.color} border p-4 rounded-lg`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <p className={`font-bold ${item.textColor}`}>{item.title}</p>
            </div>
            <p className="text-slate-300 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    ),
    notes: `上一張投影片我們看到手動管理的各種痛點，那 Kubernetes 是怎麼解決這些問題的？

自動重啟：在 K8s 裡，你告訴它「我要跑 3 個這個服務的副本」，K8s 會持續監控這 3 個副本。哪個掛掉了，它會立刻自動在其他機器上重新啟動一個新的，不需要人工介入。

自動擴縮容：K8s 可以根據 CPU 使用率、記憶體用量，甚至是自訂的指標，自動增加或減少容器數量。流量高的時候自動 scale up，流量低的時候 scale down，不浪費資源。

滾動更新：更新應用程式的時候，K8s 會逐步替換舊容器，確保在任何時刻都有足夠的健康容器在提供服務，做到零停機時間更新。

智慧排程：你不需要決定容器跑在哪台機器上，K8s 的 Scheduler 會根據每台機器的資源使用情況，自動選擇最合適的機器來放置容器。

服務發現：每個服務都有穩定的 DNS 名稱，即使後面的容器 IP 一直在變化，其他服務也能透過名稱找到它。

自我修復：K8s 的核心理念是「宣告式管理」，你描述你想要的狀態，K8s 負責讓現實狀態趨向你描述的狀態，如果有偏差就自動修正。這就是 K8s 最強大的地方。`,
    duration: "7",
  },

  // ========== K8s 歷史 ==========
  {
    title: "Kubernetes 的誕生",
    subtitle: "從 Google Borg 到改變世界的開源專案",
    section: "K8s 歷史",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-4xl mb-2">🏭</p>
            <p className="text-k8s-blue font-bold">2003</p>
            <p className="font-semibold">Google Borg</p>
            <p className="text-slate-400 text-xs mt-1">內部容器排程系統，管理全球數十億個容器</p>
          </div>
          <div className="text-k8s-blue text-3xl">→</div>
          <div className="flex-1 bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-4xl mb-2">🌐</p>
            <p className="text-k8s-blue font-bold">2014</p>
            <p className="font-semibold">Kubernetes 開源</p>
            <p className="text-slate-400 text-xs mt-1">Google 以 Borg 的經驗重寫，用 Go 語言開發</p>
          </div>
          <div className="text-k8s-blue text-3xl">→</div>
          <div className="flex-1 bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-4xl mb-2">🏛️</p>
            <p className="text-k8s-blue font-bold">2016</p>
            <p className="font-semibold">加入 CNCF</p>
            <p className="text-slate-400 text-xs mt-1">成為 CNCF 的第一個孵化專案，走向中立治理</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold">名字由來</p>
            <p className="text-slate-300">希臘文「舵手」（κυβερνήτης），縮寫 K8s（K + 8個字母 + s）</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold">原創語言</p>
            <p className="text-slate-300">Go（Golang），效能高且部署簡單</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold">目前版本</p>
            <p className="text-slate-300">1.29+，每 4 個月釋出一個主要版本</p>
          </div>
        </div>
      </div>
    ),
    notes: `Kubernetes 不是憑空出現的，它背後有十多年 Google 內部系統的積累。

2003 年，Google 內部就已經在用一個叫 Borg 的系統來管理容器了。當時 Google 的規模非常大，光是 Google Search、Gmail、YouTube 等服務，每週需要跑幾十億個工作。Borg 就是用來管理這些工作的排程系統，Google 工程師從這十多年的經驗中學到了非常多寶貴的教訓。

2014 年，Google 的幾位工程師，包括當初設計 Borg 的人，決定把這些經驗重新整理，用 Go 語言從頭開發一個新的系統，並以開源的方式釋出，這就是 Kubernetes 的誕生。名字來自希臘文的「舵手」，意思是掌舵的人，象徵管理和引導容器的工作。K8s 是它的縮寫，因為 Kubernetes 中間有 8 個字母，所以寫成 K8s，這個縮寫在業界非常普遍。

2016 年，Kubernetes 加入了 CNCF（Cloud Native Computing Foundation，雲原生計算基金會），不再只是 Google 的專案，而是由 Linux Foundation 旗下的中立組織管理，讓 AWS、Microsoft、Red Hat 等公司都能平等地參與貢獻。這個決定讓 Kubernetes 的生態系快速成長，成為整個雲原生生態的核心基礎設施。`,
    duration: "5",
  },

  // ========== CNCF 生態 ==========
  {
    title: "CNCF 與 K8s 生態系",
    subtitle: "K8s 只是冰山一角",
    section: "K8s 歷史",
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-bold text-lg mb-2">CNCF Landscape</p>
          <p className="text-slate-300 text-sm">雲原生生態有超過 1,000 個專案，涵蓋各個面向</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { category: "容器執行環境", items: ["containerd", "CRI-O"], color: "text-blue-400" },
            { category: "服務網格", items: ["Istio", "Linkerd"], color: "text-purple-400" },
            { category: "監控可觀測性", items: ["Prometheus", "Grafana"], color: "text-orange-400" },
            { category: "CI/CD", items: ["ArgoCD", "Flux"], color: "text-green-400" },
            { category: "儲存", items: ["Rook", "Longhorn"], color: "text-yellow-400" },
            { category: "日誌", items: ["Fluentd", "Loki"], color: "text-red-400" },
            { category: "安全", items: ["Falco", "OPA"], color: "text-teal-400" },
            { category: "Serverless", items: ["Knative", "OpenFaaS"], color: "text-pink-400" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <p className={`font-semibold text-xs ${item.color}`}>{item.category}</p>
              {item.items.map((name, j) => (
                <p key={j} className="text-slate-300 text-sm">{name}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">📌 本課程重點</p>
          <p className="text-slate-300 text-sm">先紮實掌握 K8s 核心，生態工具按需學習</p>
        </div>
      </div>
    ),
    notes: `了解了 K8s 的歷史，我們再看看它所在的生態系。

CNCF Landscape 是雲原生生態的全景圖，裡面有超過 1000 個專案，涵蓋從容器執行環境、服務網格、監控告警、CI/CD 流程、儲存、日誌收集到安全和 Serverless 等各個面向。這個生態系非常龐大，光是看那個全景圖就會覺得頭皮發麻。

別被這些名字嚇到。K8s 本身是這個生態的核心，就像一個平台，其他的工具都是在這個平台上建立起來的。

這門課的重點是 Kubernetes 本身的核心概念和操作。等你把 K8s 核心學好了，其他工具只是「在 K8s 上面跑的應用程式」，學起來會快很多。所以不要現在就想著要學 Istio、Prometheus 等等，先把今天的架構搞清楚，打好基礎。

這就好像你學程式語言，先學好 Python 的基礎語法，之後要學 Django、FastAPI 才會快。如果基礎沒打好就跳去學框架，每個地方都會卡住。`,
    duration: "5",
  },

  // ========== K8s 整體架構 ==========
  {
    title: "K8s 整體架構",
    subtitle: "一張圖看懂 Master 與 Worker",
    section: "架構概覽",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border-2 border-blue-600 p-4 rounded-lg">
            <p className="text-blue-400 font-bold text-lg mb-3">🧠 Control Plane（Master）</p>
            <div className="space-y-2">
              {[
                { name: "API Server", desc: "所有操作的入口" },
                { name: "etcd", desc: "叢集狀態資料庫" },
                { name: "Scheduler", desc: "決定 Pod 放哪裡" },
                { name: "Controller Manager", desc: "維持期望狀態" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/70 px-3 py-2 rounded flex justify-between">
                  <span className="text-blue-300 font-mono text-sm">{item.name}</span>
                  <span className="text-slate-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-green-900/30 border-2 border-green-600 p-4 rounded-lg">
            <p className="text-green-400 font-bold text-lg mb-3">⚙️ Worker Node</p>
            <div className="space-y-2">
              {[
                { name: "kubelet", desc: "Node 的代理人" },
                { name: "kube-proxy", desc: "網路規則管理" },
                { name: "Container Runtime", desc: "實際執行容器" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/70 px-3 py-2 rounded flex justify-between">
                  <span className="text-green-300 font-mono text-sm">{item.name}</span>
                  <span className="text-slate-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="bg-green-800/30 mt-3 p-2 rounded border border-green-700">
              <p className="text-xs text-slate-400">每個 Node 上的 Pod</p>
              <div className="flex gap-2 mt-1">
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">Pod A</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">Pod B</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">Pod C</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <p className="text-slate-400 text-sm">你（kubectl）→ API Server → etcd / Scheduler / Controllers → kubelet → Container</p>
        </div>
      </div>
    ),
    notes: `在深入每個元件之前，先讓大家有一個整體的架構圖在腦子裡。這很重要，等一下講每個元件的時候，你要能對應到這張圖的哪個位置。

Kubernetes 叢集分成兩種角色：Control Plane（也叫 Master Node）和 Worker Node。

Control Plane 是叢集的大腦，負責做決策和管理整個叢集的狀態。它裡面有四個主要元件：API Server 是所有操作的入口；etcd 是儲存叢集所有狀態的資料庫；Scheduler 決定每個新的 Pod 要放到哪台 Worker Node 上；Controller Manager 則是持續監控叢集狀態，確保現實和你宣告的狀態一致。

Worker Node 是實際跑工作負載的機器，你的應用程式容器都在這裡執行。每個 Worker Node 上有三個主要元件：kubelet 是 Node 上的代理人，負責和 Control Plane 溝通，接收指令並確保容器跑起來；kube-proxy 管理網路規則，讓 Pod 之間可以互相通訊；Container Runtime 就是實際執行容器的引擎，預設是 containerd。

當你執行 kubectl apply 的時候，指令送到 API Server，API Server 把狀態存到 etcd，Scheduler 看到有新的 Pod 需要安排，選一個適合的 Worker Node，然後那個 Node 上的 kubelet 收到指令，叫 Container Runtime 把容器跑起來。這整個流程，我們接下來會一個一個拆解清楚。`,
    duration: "5",
  },

  // ========== Control Plane: API Server & etcd ==========
  {
    title: "Control Plane 深探（一）",
    subtitle: "API Server 與 etcd",
    section: "Control Plane 元件",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
            <p className="text-blue-400 font-bold text-xl mb-2">API Server</p>
            <p className="text-slate-300 text-sm mb-3">叢集的唯一入口，所有請求都必須經過它</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 提供 RESTful API</li>
              <li>• 身份驗證 & 授權（RBAC）</li>
              <li>• 資料寫入前的驗證</li>
              <li>• 與 etcd 溝通的唯一橋樑</li>
            </ul>
            <div className="mt-3 bg-slate-800/70 p-2 rounded font-mono text-sm text-green-400">
              kubectl get pods → API Server
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-purple-900/30 border border-purple-600 p-4 rounded-lg">
            <p className="text-purple-400 font-bold text-xl mb-2">etcd</p>
            <p className="text-slate-300 text-sm mb-3">叢集的分散式鍵值資料庫，儲存所有狀態</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 儲存所有 K8s 物件的狀態</li>
              <li>• 高可用性（通常 3 或 5 個節點）</li>
              <li>• 使用 Raft 共識演算法</li>
              <li>• <span className="text-yellow-400">備份 etcd = 備份整個叢集</span></li>
            </ul>
            <div className="mt-3 bg-slate-800/70 p-2 rounded font-mono text-sm text-purple-400">
              etcd ← 只有 API Server 能讀寫
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，開始深入 Control Plane 的每個元件。這個部分有點技術，但非常重要。

首先是 API Server，它是整個 Kubernetes 叢集的入口和核心。你使用 kubectl 執行的每一個指令，最終都是在向 API Server 發送 HTTP 請求。API Server 的工作有幾個：第一，身份驗證，確認你是不是有權限操作這個叢集；第二，授權，確認你有沒有權限執行這個特定的操作，這用的是 RBAC（Role-Based Access Control，角色型存取控制）機制；第三，驗證請求內容，確保你提交的 YAML 格式正確；第四，把資料寫入 etcd 或從 etcd 讀出資料。

API Server 是唯一可以直接讀寫 etcd 的元件，其他元件都只能透過 API Server 來獲取或更新叢集狀態。

然後是 etcd，這是一個分散式的鍵值資料庫，儲存整個叢集的所有狀態：有哪些 Node、有哪些 Pod、每個 Pod 在哪台 Node 上、有哪些 Service、Service 對應到哪些 Pod…所有這些資訊都存在 etcd 裡面。

有一句很重要的話：備份 etcd 等於備份整個叢集。如果 etcd 資料遺失，你的叢集資訊就全部消失了。所以在生產環境，etcd 通常部署 3 個或 5 個節點來做高可用，並且要定期備份。這是 K8s 運維中最重要的工作之一，請務必記住。`,
    duration: "12",
  },

  // ========== Control Plane: Scheduler & Controller Manager ==========
  {
    title: "Control Plane 深探（二）",
    subtitle: "Scheduler 與 Controller Manager",
    section: "Control Plane 元件",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="bg-orange-900/30 border border-orange-600 p-4 rounded-lg">
            <p className="text-orange-400 font-bold text-xl mb-2">Scheduler</p>
            <p className="text-slate-300 text-sm mb-3">決定新 Pod 要放在哪個 Node 上</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 監視未排程的 Pod</li>
              <li>• 篩選：哪些 Node 符合要求？</li>
              <li>• 評分：哪個 Node 最適合？</li>
              <li>• 支援 Affinity、Taints 等策略</li>
            </ul>
            <div className="mt-3 bg-slate-800/70 p-2 rounded text-sm">
              <span className="text-slate-400">考量因素：</span>
              <span className="text-orange-300 ml-2">CPU、記憶體、Node 標籤</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-teal-900/30 border border-teal-600 p-4 rounded-lg">
            <p className="text-teal-400 font-bold text-xl mb-2">Controller Manager</p>
            <p className="text-slate-300 text-sm mb-3">一組控制器的集合，維持期望狀態</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• <span className="text-teal-300">ReplicaSet Controller</span>：維持副本數量</li>
              <li>• <span className="text-teal-300">Deployment Controller</span>：管理滾動更新</li>
              <li>• <span className="text-teal-300">Node Controller</span>：監控 Node 健康</li>
              <li>• <span className="text-teal-300">Endpoints Controller</span>：更新服務端點</li>
            </ul>
            <div className="mt-3 bg-slate-800/70 p-2 rounded text-sm text-slate-400">
              現狀 ≠ 期望？→ 採取行動修正
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `繼續看 Control Plane 的另外兩個元件：Scheduler 和 Controller Manager。

Scheduler 的工作是：當有一個新的 Pod 需要被安排的時候，決定它應該跑在哪台 Worker Node 上。Scheduler 不會隨機選，它有一套嚴謹的流程：首先過濾，找出哪些 Node 滿足這個 Pod 的基本需求，比如有沒有足夠的 CPU 和記憶體；然後評分，在符合條件的 Node 中，根據各種策略算出分數，選出最高分的那台。

影響 Scheduler 決策的因素很多：Node 上剩餘的資源、Node 的標籤（Label）、Pod 設定的節點親和性（Affinity）或反親和性（Anti-Affinity）、Node 的 Taint（污點）等等。這些進階設定我們後面實作課會再介紹。

Controller Manager 裡面其實包含了很多不同的 Controller，每個 Controller 負責管理一類 K8s 物件。最重要的概念是：每個 Controller 都在跑一個「調和迴圈」（Reconcile Loop），不斷比較「現在的狀態」和「期望的狀態」，如果兩者不一致，就採取行動讓現狀趨向期望狀態。

舉例：ReplicaSet Controller 監控某個 ReplicaSet 需要 3 個副本。如果因為某台 Node 掛了，現在只有 2 個 Pod 在跑，Controller 就會立刻請求 API Server 建立一個新的 Pod，直到副本數恢復到 3 個為止。這就是 K8s 的自我修復能力的來源。`,
    duration: "13",
  },

  // ========== Worker Node 元件 ==========
  {
    title: "Worker Node 元件",
    subtitle: "真正執行你應用程式的地方",
    section: "Worker Node 元件",
    content: (
      <div className="space-y-4">
        {[
          {
            name: "kubelet",
            icon: "🤖",
            color: "bg-green-900/30 border-green-600",
            titleColor: "text-green-400",
            desc: "Node 上的代理人，接收 API Server 的指令",
            details: [
              "監控 API Server，取得分配給本 Node 的 Pod",
              "叫 Container Runtime 啟動或停止容器",
              "定期向 API Server 回報 Node 和 Pod 的健康狀態",
              "執行 Liveness / Readiness Probe",
            ],
          },
          {
            name: "kube-proxy",
            icon: "🌐",
            color: "bg-blue-900/30 border-blue-600",
            titleColor: "text-blue-400",
            desc: "管理 Node 上的網路規則，實現 Service 的負載均衡",
            details: [
              "維護 iptables 或 ipvs 規則",
              "讓 Service 的虛擬 IP 能路由到正確的 Pod",
              "跨 Node 的 Pod 間通訊",
            ],
          },
          {
            name: "Container Runtime",
            icon: "📦",
            color: "bg-purple-900/30 border-purple-600",
            titleColor: "text-purple-400",
            desc: "實際執行容器的引擎，K8s 1.24+ 預設為 containerd",
            details: [
              "負責拉取映像（pull image）",
              "啟動、停止容器",
              "透過 CRI（Container Runtime Interface）與 kubelet 溝通",
            ],
          },
        ].map((item, i) => (
          <div key={i} className={`${item.color} border p-4 rounded-lg`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className={`font-bold text-lg ${item.titleColor}`}>{item.name}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
                <ul className="grid grid-cols-2 gap-1">
                  {item.details.map((d, j) => (
                    <li key={j} className="text-slate-300 text-xs flex items-start gap-1">
                      <span className="text-slate-500">•</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `現在看 Worker Node 上的三個核心元件。

kubelet 是 Worker Node 的代理人，它是 Node 上唯一直接和 Control Plane 溝通的元件。kubelet 啟動後，會持續監聽 API Server，看有沒有分配給這台 Node 的 Pod 需要啟動。接到指令後，kubelet 會叫 Container Runtime 把容器跑起來，並且定期向 API Server 回報這些容器和整台 Node 的健康狀況。kubelet 也負責執行你在 Pod 設定裡定義的 Liveness Probe（存活探針）和 Readiness Probe（就緒探針），用來判斷容器是否正常運作。

kube-proxy 負責 Node 上的網路規則。當你在 K8s 裡建立一個 Service，K8s 會分配給它一個虛擬 IP（ClusterIP）。kube-proxy 就是負責讓這個虛擬 IP 的流量能正確路由到後端的 Pod。它通過修改 Linux 的 iptables 或 ipvs 規則來實現這個功能。每台 Node 上都有 kube-proxy，確保每台機器都有最新的網路路由規則。

Container Runtime 是實際跑容器的引擎。早期 K8s 直接使用 Docker，但從 K8s 1.24 開始，K8s 不再直接支援 Docker，改用 containerd 作為預設的容器執行環境。containerd 是 Docker 的底層核心，功能一樣，但更精簡。kubelet 透過 CRI（Container Runtime Interface）這個標準介面和 Container Runtime 溝通，只要實作了 CRI，任何容器執行環境都可以配合 K8s 使用。`,
    duration: "20",
  },

  // ========== 休息 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘 — 10:25 ~ 10:40",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🧘 🚶</p>
        <p className="text-2xl text-slate-300">讓大腦消化一下架構概念</p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block text-left">
          <p className="text-slate-400 mb-3">下半場預告：K8s 最核心的三個物件</p>
          <div className="space-y-2">
            <p className="text-k8s-blue">📦 Pod — 最小的部署單位</p>
            <p className="text-green-400">🔄 Deployment — 宣告式管理、滾動更新</p>
            <p className="text-orange-400">🔌 Service — 服務發現與負載均衡</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們已經把 Kubernetes 的架構層面講完了，讓我們休息 15 分鐘。

趁這個時間，我建議大家在腦子裡回想一下剛才講的架構：Control Plane 有哪些元件，各自負責什麼；Worker Node 有哪些元件，各自負責什麼。如果腦子裡還是模糊的，可以翻看一下剛才的投影片，或是問我或助教。

下半場我們要進入 Kubernetes 的核心物件：Pod、Deployment、Service。這三個東西是你每天操作 K8s 最常接觸的，也是理解 K8s 工作方式的關鍵。休息回來，我們繼續！`,
    duration: "1",
  },

  // ========== Pod 概念 ==========
  {
    title: "Pod — 最小的部署單位",
    subtitle: "K8s 裡面的一切，從 Pod 開始",
    section: "Pod 概念",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-lg mb-3">Pod 是什麼？</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• K8s 可以建立和管理的最小單位</li>
              <li>• 包含一個或多個容器</li>
              <li>• 同一個 Pod 內的容器共享：</li>
            </ul>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {["網路（IP）", "儲存（Volume）", "生命週期"].map((item, i) => (
                <div key={i} className="bg-k8s-blue/20 p-2 rounded text-center text-xs text-k8s-blue">{item}</div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm">
            <p className="text-slate-400"># 最簡單的 Pod YAML</p>
            <pre className="text-green-400 mt-2">{`apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: nginx:latest`}</pre>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-lg mb-3">Pod vs Container</p>
            <div className="space-y-3">
              <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
                <p className="text-green-400 font-semibold">Container（Docker）</p>
                <p className="text-slate-300 text-sm">打包的應用程式環境</p>
              </div>
              <div className="text-center text-slate-400">↓ K8s 在外面包一層</div>
              <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
                <p className="text-blue-400 font-semibold">Pod（K8s）</p>
                <p className="text-slate-300 text-sm">容器的包裝，提供共享網路/儲存、統一排程</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm">💡 重要概念</p>
            <p className="text-yellow-200 text-sm">Pod 是「暫時性」的，不是「持久性」的。Pod 死掉就不會自己回來，需要 Deployment 管理。</p>
          </div>
        </div>
      </div>
    ),
    notes: `休息回來，精神好一點了嗎？我們進入 K8s 最核心的物件：Pod。

Pod 是 Kubernetes 可以建立和管理的最小單位。你不能直接讓 K8s 管理一個「容器」，你只能讓 K8s 管理一個「Pod」，而 Pod 裡面可以包含一個或多個容器。

為什麼要有 Pod 這個概念，而不直接管理容器呢？因為 Pod 在容器外面加了一個抽象層，讓同一個 Pod 裡的容器可以共享網路（同一個 IP）、共享儲存（Volume），並且有統一的生命週期。這讓某些需要緊密協作的容器可以被放在一起，就像跑在同一台機器上一樣方便。

YAML 是 K8s 描述物件的方式。這個最簡單的 Pod YAML，用 apiVersion 指定 API 版本、kind 說明這是什麼類型的物件、metadata 放名稱等 metadata、spec 描述你想要的規格，包括容器名稱和使用的映像。

有一個非常重要的概念：Pod 是「暫時性」（ephemeral）的，不是「持久性」的。Pod 一旦死掉，它就消失了，不會自動重生。如果你要讓應用程式持續運行，你不應該直接建立 Pod，而應該用 Deployment 來管理。Deployment 會確保你的 Pod 一直保持在你設定的數量。我們接下來就會講 Deployment。`,
    duration: "10",
  },

  // ========== 多容器 Pod ==========
  {
    title: "多容器 Pod",
    subtitle: "Sidecar 模式：讓容器協同合作",
    section: "Pod 概念",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-3">常見的多容器模式</p>
            <div className="space-y-3">
              {[
                {
                  pattern: "Sidecar",
                  desc: "輔助主容器，例如 log 收集代理",
                  color: "text-blue-400",
                },
                {
                  pattern: "Ambassador",
                  desc: "代理容器，處理網路請求轉發",
                  color: "text-green-400",
                },
                {
                  pattern: "Adapter",
                  desc: "轉換主容器的輸出格式",
                  color: "text-orange-400",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-700/50 p-3 rounded">
                  <span className={`font-semibold text-sm ${item.color} w-24 flex-shrink-0`}>{item.pattern}</span>
                  <p className="text-slate-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-3">Sidecar 範例 YAML</p>
            <pre className="text-green-400 font-mono text-xs">{`spec:
  containers:
  - name: app          # 主容器
    image: my-app:v1
  - name: log-agent   # Sidecar
    image: fluentd:v1
    volumeMounts:
    - name: app-logs
      mountPath: /logs`}</pre>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">同一個 Pod 內的容器</p>
          <div className="grid grid-cols-3 gap-4 text-sm text-center">
            <div>
              <p className="text-slate-400">用 localhost 互相溝通</p>
              <p className="text-green-400 font-mono">localhost:8080</p>
            </div>
            <div>
              <p className="text-slate-400">共享 Volume</p>
              <p className="text-green-400">/shared-data/</p>
            </div>
            <div>
              <p className="text-slate-400">同時啟動/停止</p>
              <p className="text-green-400">統一生命週期</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `一個 Pod 通常只有一個主容器，但在某些情況下，我們會在同一個 Pod 裡放多個容器，這些額外的容器叫做 Sidecar 容器。

最常見的使用場景是 Sidecar 模式：主容器負責業務邏輯，Sidecar 容器做輔助工作。比如主容器跑你的 Web API，Sidecar 跑一個 Fluentd 代理，負責把主容器的 log 收集起來送到中央 log 系統。

Sidecar 模式的好處是：你可以把業務邏輯和基礎設施邏輯分開，業務開發者不需要關心 log 怎麼收集，只要專注寫 API；Sidecar 由維運團隊統一維護和更新，兩邊可以獨立部署。

因為同一個 Pod 的容器共享網路，它們可以用 localhost 互相溝通，就像跑在同一台機器上一樣方便，不需要做複雜的網路設定。它們也共享 Volume，可以透過掛載同一個目錄來傳遞檔案，這也是 log 收集常用的方式：主容器把 log 寫到共享 Volume，Sidecar 從共享 Volume 讀 log 並轉送出去。

在 K8s 的 Istio 服務網格中，也大量使用 Sidecar 模式：每個 Pod 都會自動注入一個 Envoy Proxy Sidecar，負責攔截所有進出流量，做加密、監控、限流等功能。多容器 Pod 是一個強大但也容易誤用的功能，如果容器之間沒有強烈的耦合關係，通常建議分開成不同 Pod。`,
    duration: "8",
  },

  // ========== Pod 生命週期 ==========
  {
    title: "Pod 生命週期",
    subtitle: "從建立到結束，每個狀態都有意義",
    section: "Pod 概念",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          {[
            { status: "Pending", desc: "等待排程或拉取映像", color: "bg-yellow-600" },
            { status: "Running", desc: "至少一個容器在跑", color: "bg-green-600" },
            { status: "Succeeded", desc: "所有容器正常結束", color: "bg-blue-600" },
            { status: "Failed", desc: "容器異常終止", color: "bg-red-600" },
            { status: "Unknown", desc: "無法取得狀態", color: "bg-slate-600" },
          ].map((item, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`${item.color} rounded px-2 py-1 text-white text-sm font-bold mb-1`}>{item.status}</div>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-3">健康探針（Probe）</p>
            <div className="space-y-2 text-sm">
              {[
                { name: "Liveness Probe", desc: "容器是否還活著？失敗則重啟", color: "text-green-400" },
                { name: "Readiness Probe", desc: "容器是否準備好接收流量？", color: "text-blue-400" },
                { name: "Startup Probe", desc: "容器是否完成啟動？", color: "text-orange-400" },
              ].map((probe, i) => (
                <div key={i} className="flex gap-3 bg-slate-700/50 p-2 rounded">
                  <span className={`font-semibold ${probe.color} w-36 flex-shrink-0`}>{probe.name}</span>
                  <span className="text-slate-300">{probe.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-3">重啟策略（RestartPolicy）</p>
            <div className="space-y-2 text-sm">
              {[
                { policy: "Always（預設）", desc: "永遠重啟，適合 Web 服務" },
                { policy: "OnFailure", desc: "失敗才重啟，適合批次任務" },
                { policy: "Never", desc: "永不重啟，適合一次性任務" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-700/50 p-2 rounded">
                  <span className="text-orange-400 font-mono">{item.policy}</span>
                  <span className="text-slate-400 ml-2 text-xs">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `Pod 有幾個不同的狀態，理解這些狀態對你日後排查問題非常有幫助。

Pending：Pod 已經被建立，但還沒開始執行。可能的原因是 Scheduler 還在找合適的 Node、或是容器映像還在拉取中。

Running：至少有一個容器正在執行中。注意 Running 不代表應用程式完全正常，只是容器程序有在跑。

Succeeded：Pod 裡的所有容器都已經成功完成並退出（exit code 0）。適合批次任務的結束狀態。

Failed：Pod 裡有容器以非零的 exit code 退出了，代表程式出錯了。

Unknown：無法取得 Pod 的狀態，通常是 Node 和 API Server 失去聯繫了。

除了 Pod 狀態，你還需要了解三種健康探針。Liveness Probe 是最基本的：K8s 定期探測你的容器還活著嗎？如果探測失敗，K8s 會重啟容器。Readiness Probe 更細緻：容器程序活著，但應用程式還沒準備好接收流量，比如還在初始化或載入資料，這時候 Readiness Probe 可以讓 K8s 知道「先別把流量送過來」，等應用準備好了再說。Startup Probe 是給啟動時間比較長的應用用的，讓 Liveness Probe 不會因為應用還在啟動就誤判成失敗。

掌握這些探針的設定，可以讓你的應用在 K8s 上更穩定，避免流量被送到還沒準備好的容器。`,
    duration: "7",
  },

  // ========== Deployment & ReplicaSet ==========
  {
    title: "Deployment 與 ReplicaSet",
    subtitle: "宣告式管理的核心：告訴 K8s 你想要什麼",
    section: "Deployment 與 ReplicaSet",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-lg mb-2">物件層次</p>
            <div className="space-y-2">
              <div className="bg-purple-900/30 border border-purple-600 p-3 rounded flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-purple-400 font-bold">Deployment</p>
                  <p className="text-slate-400 text-xs">管理滾動更新策略、版本歷史</p>
                </div>
              </div>
              <div className="text-center text-slate-500 text-sm">↓ 建立並管理</div>
              <div className="bg-blue-900/30 border border-blue-600 p-3 rounded flex items-center gap-3">
                <span className="text-2xl">🔢</span>
                <div>
                  <p className="text-blue-400 font-bold">ReplicaSet</p>
                  <p className="text-slate-400 text-xs">確保指定數量的 Pod 副本一直在跑</p>
                </div>
              </div>
              <div className="text-center text-slate-500 text-sm">↓ 建立並管理</div>
              <div className="bg-green-900/30 border border-green-600 p-3 rounded flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-green-400 font-bold">Pod × N</p>
                  <p className="text-slate-400 text-xs">實際跑應用程式的最小單位</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-xs">
            <p className="text-slate-400 mb-2"># Deployment YAML 範例</p>
            <pre className="text-green-400">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3        # 3 個副本
  selector:
    matchLabels:
      app: my-app
  template:          # Pod 模板
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:v2`}</pre>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來看 Deployment，這是你日常操作 K8s 最常用的物件。

我們說過，不要直接建立 Pod，因為 Pod 死掉了不會自動重生。實際上，你應該建立 Deployment，讓 Deployment 來管理你的 Pod。

K8s 的物件有三個層次：Deployment 管理 ReplicaSet，ReplicaSet 管理 Pod。

ReplicaSet 的工作很單純：確保在任何時候，都有你指定數量的 Pod 副本在跑。如果少了，就補充；如果多了，就刪除。但 ReplicaSet 本身不處理更新的問題，只管數量。

Deployment 是在 ReplicaSet 上加了一層，負責管理你的應用程式版本和滾動更新。當你更新 Deployment 的映像版本時，Deployment 會建立一個新的 ReplicaSet，然後逐漸把流量從舊的 ReplicaSet 轉移到新的 ReplicaSet，這就是滾動更新。如果更新有問題，你可以一鍵回滾到上一個版本，因為舊的 ReplicaSet 還在。

這個 YAML 的重點：replicas: 3 告訴 K8s 我要 3 個副本；selector 告訴 ReplicaSet 要管哪些 Pod（透過 Label 篩選）；template 是 Pod 的模板，ReplicaSet 用這個模板建立新的 Pod。宣告式管理的精髓就在這裡：你不說「你現在去建立 3 個 Pod」，你說「我想要的狀態是有 3 個 Pod 在跑」，K8s 自己去達成這個目標。`,
    duration: "12",
  },

  // ========== 滾動更新 ==========
  {
    title: "滾動更新（Rolling Update）",
    subtitle: "零停機時間更新你的應用程式",
    section: "Deployment 與 ReplicaSet",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-bold mb-3">更新過程（replicas: 3）</p>
          <div className="space-y-3">
            {[
              {
                step: "初始狀態",
                pods: ["v1", "v1", "v1"],
                colors: ["bg-blue-600", "bg-blue-600", "bg-blue-600"],
              },
              {
                step: "開始更新",
                pods: ["v1", "v1", "v2"],
                colors: ["bg-blue-600", "bg-blue-600", "bg-green-600"],
              },
              {
                step: "繼續更新",
                pods: ["v1", "v2", "v2"],
                colors: ["bg-blue-600", "bg-green-600", "bg-green-600"],
              },
              {
                step: "更新完成",
                pods: ["v2", "v2", "v2"],
                colors: ["bg-green-600", "bg-green-600", "bg-green-600"],
              },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-slate-400 text-sm w-20 flex-shrink-0">{row.step}</span>
                <div className="flex gap-2">
                  {row.pods.map((v, j) => (
                    <span key={j} className={`${row.colors[j]} text-white px-3 py-1 rounded text-sm font-mono`}>{v}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">回滾（Rollback）</p>
            <code className="text-green-400">kubectl rollout undo deployment/my-app</code>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">查看歷史</p>
            <code className="text-green-400">kubectl rollout history deployment/my-app</code>
          </div>
        </div>
      </div>
    ),
    notes: `滾動更新是 Deployment 最強大的功能之一，讓你可以在不中斷服務的情況下更新應用程式。

來看這個圖。假設你有 3 個 v1 版本的 Pod 在跑，現在要更新到 v2 版本。

舊的做法：把 3 個 v1 Pod 全部停掉，再啟動 3 個 v2 Pod。問題是在這個中間有一段時間沒有 Pod 在提供服務，造成服務中斷。

K8s 的滾動更新做法：先啟動一個新的 v2 Pod，等它健康了之後，再停掉一個舊的 v1 Pod。接著啟動第二個 v2 Pod，再停掉第二個 v1 Pod，如此逐步替換。在整個更新過程中，永遠有足夠的 Pod 在提供服務，用戶幾乎感覺不到服務中斷。

你可以透過 Deployment 的 strategy 設定來控制滾動更新的行為，比如 maxUnavailable（允許多少個 Pod 同時不可用）和 maxSurge（允許超出期望副本數多少個）。

更棒的是，如果更新之後發現新版本有問題，你可以執行 kubectl rollout undo 立刻回滾到上一個版本，K8s 會把剛才的滾動更新反向執行一遍，把 v2 Pod 換回 v1 Pod。而且 K8s 預設保留多個版本的 ReplicaSet 歷史，你可以回滾到任意一個過去的版本。這讓部署變得非常安全：有問題立刻回退，沒有後顧之憂。`,
    duration: "8",
  },

  // ========== Service 概念 ==========
  {
    title: "Service — 穩定的存取端點",
    subtitle: "Pod IP 會變，Service IP 不會",
    section: "Service 概念",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-3">為什麼需要 Service？</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Pod 是暫時性的，IP 隨時會變</li>
              <li>• 多個 Pod 副本，要怎麼做負載均衡？</li>
              <li>• 其他服務要怎麼找到你的應用？</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-3">Service 的作用</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">→</span>
                <span className="text-slate-300">提供穩定的 IP 和 DNS 名稱</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">→</span>
                <span className="text-slate-300">自動對後端 Pod 做負載均衡</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">→</span>
                <span className="text-slate-300">透過 Label Selector 選擇 Pod</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-k8s-blue font-bold">三種 Service 類型</p>
          {[
            {
              type: "ClusterIP",
              icon: "🔒",
              color: "bg-blue-900/30 border-blue-600",
              titleColor: "text-blue-400",
              desc: "只能在叢集內部存取，服務間通訊的標準方式",
            },
            {
              type: "NodePort",
              icon: "🚪",
              color: "bg-orange-900/30 border-orange-600",
              titleColor: "text-orange-400",
              desc: "在每台 Node 開啟一個固定 Port，可從叢集外部存取",
            },
            {
              type: "LoadBalancer",
              icon: "⚖️",
              color: "bg-green-900/30 border-green-600",
              titleColor: "text-green-400",
              desc: "請雲端供應商建立外部 Load Balancer，生產環境常用",
            },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border p-3 rounded-lg`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{item.icon}</span>
                <span className={`font-bold ${item.titleColor}`}>{item.type}</span>
              </div>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `最後一個核心概念：Service。

前面說過 Pod 是暫時性的，每次 Pod 重建，它的 IP 都會不一樣。這就帶來一個問題：如果你的前端服務要呼叫後端服務，後端 Pod 的 IP 一直在變，前端要怎麼找到後端？

這就是 Service 要解決的問題。Service 提供一個穩定的存取端點：一個固定的 IP（ClusterIP）和一個 DNS 名稱，不管背後的 Pod 怎麼換來換去，Service 的 IP 和 DNS 名稱都不會變。前端只需要連到這個穩定的 Service 名稱，Service 會自動把流量分發到健康的 Pod 上。

三種 Service 類型：

ClusterIP 是預設類型，只能在叢集內部存取。A 服務要呼叫 B 服務，用 ClusterIP Service 就夠了。它的 DNS 名稱格式是 服務名稱.命名空間.svc.cluster.local，通常縮寫成服務名稱就可以了。

NodePort 在每台 Node 上開放一個固定的 Port（預設範圍 30000-32767），讓叢集外面的人可以透過任意一台 Node 的 IP 加上這個 Port 來存取服務。開發和測試環境常用，生產環境通常不用。

LoadBalancer 是生產環境最常用的方式。它會要求雲端供應商（AWS、GCP、Azure）建立一個外部的負載均衡器，分配一個公開的 IP，讓外部流量可以進來。費用較高，但最適合對外服務。

理解這三種類型的差異，可以讓你在設計 K8s 應用架構的時候，選擇最合適的暴露方式。`,
    duration: "15",
  },

  // ========== 課程總結 ==========
  {
    title: "今日課程總結",
    subtitle: "你今天學到了什麼？",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "K8s 的由來",
              items: ["Google Borg 的十年積累", "2014 開源，2016 加入 CNCF", "解決手動管理百台機器的痛點"],
              icon: "📜",
              color: "text-purple-400",
            },
            {
              title: "Control Plane",
              items: ["API Server：唯一入口", "etcd：叢集狀態資料庫", "Scheduler + Controller Manager"],
              icon: "🧠",
              color: "text-blue-400",
            },
            {
              title: "Worker Node",
              items: ["kubelet：Node 代理人", "kube-proxy：網路規則", "Container Runtime：執行容器"],
              icon: "⚙️",
              color: "text-green-400",
            },
            {
              title: "核心物件",
              items: ["Pod：最小部署單位", "Deployment：宣告式管理 + 滾動更新", "Service：穩定的存取端點"],
              icon: "📦",
              color: "text-orange-400",
            },
          ].map((section, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{section.icon}</span>
                <p className={`font-bold ${section.color}`}>{section.title}</p>
              </div>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className="text-slate-500">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-center">
          <p className="text-k8s-blue font-semibold text-lg">下午預告 🚀</p>
          <p className="text-slate-300">實際動手！用 kubectl 建立 Pod、Deployment、Service</p>
        </div>
      </div>
    ),
    notes: `今天早上三個小時，我們從 Docker 的問題出發，一路走到 Kubernetes 的核心架構和物件，內容非常密集。讓我幫大家做一個總結。

首先是 K8s 的由來：手動管理大量容器的痛點催生了容器編排系統，Google 把十多年的 Borg 經驗開源成 Kubernetes，並捐給 CNCF 維護，形成了今天龐大的雲原生生態。

然後是架構：K8s 叢集分成 Control Plane 和 Worker Node 兩個角色。Control Plane 是大腦，包含 API Server、etcd、Scheduler、Controller Manager；Worker Node 是手腳，包含 kubelet、kube-proxy、Container Runtime。

最後是三個核心物件：Pod 是最小部署單位，通常你不直接建立 Pod，而是用 Deployment 來管理；Deployment 提供宣告式管理和滾動更新，它管理 ReplicaSet，ReplicaSet 管理 Pod；Service 提供穩定的存取端點，讓 Pod IP 的變動不影響服務間的通訊，根據需要選擇 ClusterIP、NodePort 或 LoadBalancer。

今天這些概念是整個 K8s 學習的基礎，如果你能把這張架構圖畫出來並說明每個元件的職責，你就已經跨越了 K8s 學習最重要的一個門檻。下午我們要開始動手操作，用 kubectl 把今天的概念全部在真實環境裡跑過一遍，到那時候你會對這些概念有更深的理解。吃個午飯、充個電，下午見！`,
    duration: "10",
  },
]
