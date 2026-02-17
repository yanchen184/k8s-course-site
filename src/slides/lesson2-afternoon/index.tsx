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
    title: "Docker 入門",
    subtitle: "從容器概念到實際操作",
    section: "第二堂下午",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-4xl">
            🐳
          </div>
          <div>
            <p className="text-2xl font-semibold">Docker 入門</p>
            <p className="text-slate-400">容器化技術基礎與實作</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold">時間</p>
            <p>13:00 – 17:00（240 分鐘）</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold">目標</p>
            <p>能獨立執行容器，掌握常用 Docker 指令</p>
          </div>
        </div>
      </div>
    ),
    notes: `大家午休回來，精神好一點了嗎？下午的主題是 Docker，也是整個課程的核心里程碑。

上午我們學了 Linux 的基本操作，打好了地基。下午要蓋磚頭了——Docker 容器技術，這是你邁向 Kubernetes 最重要的一步。

我先說一個真實的故事：一個小組花了三天時間排查 Bug，最後發現問題是「環境不一樣」——開發者的電腦是 macOS，測試機是 Ubuntu，生產環境是 CentOS，三個地方的 Python 版本不同，函式庫依賴衝突。這類問題幾乎每個開發團隊都遇過，而 Docker 的出現，正是為了解決這個痛點。

今天下午四個小時，我們會從「為什麼需要 Docker」講起，理解容器和虛擬機的差異，學習 Docker 架構，然後大量實作：執行容器、管理容器、掛 Volume、注入環境變數、設定資源限制。

課程節奏會比上午快一點，因為大家已經有了 Linux 基礎，指令的學習曲線相對平緩。遇到不懂的立刻舉手，不要等到課後才消化。準備好了嗎？我們開始！`,
    duration: "5"
  },

  // ========== 課程大綱 ==========
  {
    title: "今日下午課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-3">
        {[
          { time: "13:00-13:05", topic: "開場說明", icon: "🎬" },
          { time: "13:05-14:05", topic: "為什麼需要 Docker / 容器 vs VM / Docker 架構 / 安裝驗證", icon: "📚" },
          { time: "14:05-14:20", topic: "休息時間", icon: "☕" },
          { time: "14:20-14:50", topic: "docker run 基本操作", icon: "🚀" },
          { time: "14:50-15:15", topic: "常用指令：ps / images / logs / exec / stop / rm", icon: "⌨️" },
          { time: "15:15-15:40", topic: "Volume 基礎：Bind Mount vs Named Volume", icon: "💾" },
          { time: "15:40-16:00", topic: "環境變數注入：-e 與 --env-file", icon: "🔧" },
          { time: "16:00-16:15", topic: "資源限制：--memory, --cpus", icon: "⚙️" },
          { time: "16:15-17:00", topic: "課程總結與 Q&A", icon: "🎯" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-blue-400 text-sm">{item.time}</p>
              <p>{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我們先看一下今天下午的課程安排。

前一個小時是理論的部分，我們要搞清楚 Docker 解決了什麼問題、容器和虛擬機有什麼差異、Docker 的整體架構是什麼。理論部分很重要，有了正確的心智模型，後面的操作才不會死記硬背。

14:05 到 14:20 是 15 分鐘休息，建議去活動一下，因為後半段都是高密度的實作。

休息之後，後面三個半小時全是動手操作。Docker Run、常用管理指令、Volume 掛載、環境變數、資源限制，這些是日常使用 Docker 最頻繁的功能，每個都要親手打一遍才算真的學到。

整個課程的節奏是：我先說明概念和語法，Demo 一遍，然後你們跟著做，遇到問題就舉手。不要只是看我做，每個指令都要自己敲一次。

有任何問題，隨時提出來，不要等到課後才想說「剛才那個我不太懂」。我們現在就開始！`,
    duration: "3"
  },

  // ========== 為什麼需要 Docker：環境不一致問題 ==========
  {
    title: "「在我電腦上可以跑啊！」",
    subtitle: "Works on My Machine — 開發者的噩夢",
    section: "為什麼需要 Docker",
    content: (
      <div className="space-y-6">
        <div className="bg-red-900/30 border border-red-700 p-5 rounded-lg">
          <p className="text-xl text-red-300 italic">
            "It works on my machine..."
          </p>
          <p className="text-slate-400 mt-2">— 每個開發者都說過的話</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <p className="text-3xl">💻</p>
            <p className="font-semibold text-green-400">開發環境</p>
            <p className="text-sm text-slate-400">macOS<br />Python 3.11<br />Library A v1.2</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <p className="text-3xl">🖥️</p>
            <p className="font-semibold text-yellow-400">測試環境</p>
            <p className="text-sm text-slate-400">Ubuntu 20.04<br />Python 3.9<br />Library A v1.0</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <p className="text-3xl">☁️</p>
            <p className="font-semibold text-red-400">生產環境</p>
            <p className="text-sm text-slate-400">CentOS 7<br />Python 3.6<br />Library A v0.9</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">💡 根本問題</p>
          <p className="text-yellow-200">軟體依賴的「環境」無法跨機器精確複製</p>
        </div>
      </div>
    ),
    notes: `來，我要說一個你們一定聽過或經歷過的故事。

一個工程師在自己的 MacBook 上開發了一個 Python 應用，在本機測試完全沒問題，信心滿滿地把程式碼推到測試環境，結果：「ModuleNotFoundError」、「DeprecationWarning」、甚至直接執行失敗。他花了半天找問題，最後發現：他的 Mac 用的是 Python 3.11，測試機是 Python 3.9，某個函式的行為在這兩個版本之間有差異。

這種問題叫做「環境不一致」，是軟體開發中最令人抓狂的問題之一，因為程式碼本身沒有 Bug，問題在「跑程式的環境」不一樣。

環境包括什麼？作業系統版本、Runtime 版本（Python、Node.js、Java）、套件和函式庫的版本、系統環境變數、甚至時區設定。任何一個細節不同，都可能導致行為差異。

以前的解法是寫一份超詳細的部署文件，列出每個步驟：「先安裝 Python 3.11，然後用 pip 安裝這些套件，注意版本要完全一樣……」但即使有文件，手動配置還是容易出錯，而且有人不照文件做，又回到原點。

Docker 的思路完全不同：**把應用程式和它所需要的整個環境打包在一起**，成為一個可攜式的單元。不管在哪台機器、哪個作業系統上執行這個打包好的東西，行為都完全一樣。這就是容器化技術要解決的核心問題。`,
    duration: "10"
  },

  // ========== 環境問題深挖 ==========
  {
    title: "環境不一致的代價",
    section: "為什麼需要 Docker",
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-red-400">傳統痛點</h3>
            {[
              "手動安裝依賴，版本容易搞錯",
              "「部署文件」越寫越長，維護困難",
              "新進成員環境設定要花一整天",
              "生產環境緊急修復時誰也不確定會不會動到別的東西",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
                <span className="text-red-400 flex-shrink-0">✗</span>
                <p className="text-slate-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-green-400">Docker 帶來的改變</h3>
            {[
              "環境打包成 Image，一次定義到處執行",
              "新人直接 docker run，五分鐘跑起來",
              "開發、測試、生產用同一個 Image",
              "版本回退只要換個 Image tag",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <p className="text-slate-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold">🎯 Docker 的核心承諾</p>
          <p className="text-blue-200">Build once, run anywhere — 打包一次，到處執行</p>
        </div>
      </div>
    ),
    notes: `我們來深挖一下這個問題有多嚴重，以及 Docker 帶來了什麼改變。

傳統的做法，每次在新機器上部署一個應用，要手動執行一堆安裝步驟：安裝語言 Runtime、安裝套件管理工具、安裝函式庫、設定環境變數、建立目錄結構……而且每個步驟都有失敗的可能，一旦出錯，從哪裡開始重來都不清楚。

更麻煩的是：一個應用可能有十幾個依賴，每個依賴又有自己的依賴，形成複雜的依賴樹。某天其中一個套件發布新版，不更新有安全漏洞，更新了可能和其他套件不相容——這就是所謂的「依賴地獄」（Dependency Hell）。

來看 Docker 怎麼解決：Image 是一個包含應用程式和所有依賴的「快照」，包括作業系統工具、語言 Runtime、套件、設定檔、原始碼。這個快照是不可變的（immutable），一旦建立就固定了，不會因為外部環境變化而改變。

實際的影響：新進工程師第一天，只要安裝 Docker，然後執行一個 docker run 指令，整個開發環境就起來了，不需要看一份 20 頁的環境設定文件。CI/CD 流水線中，每次建置都是全新、乾淨、一致的環境，排除了「上次跑成功、這次失敗但程式碼沒變」的謎之問題。

Docker 的口號是 "Build once, run anywhere"，打包一次，到處執行。這個承諾在實際使用中基本做到了，這也是為什麼 Docker 問世不到十年，就成為整個雲端和 DevOps 生態系的標準基礎設施。`,
    duration: "10"
  },

  // ========== 容器 vs 虛擬機：架構差異 ==========
  {
    title: "容器 vs 虛擬機",
    subtitle: "架構差異與資源效率",
    section: "容器 vs 虛擬機",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
          <h3 className="text-xl font-bold text-purple-400 text-center">虛擬機（VM）</h3>
          <div className="space-y-2 text-sm text-center">
            {["App A", "App B"].map((app, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700 p-2 rounded">
                <p>{app}</p>
                <p className="text-slate-400">Guest OS（完整作業系統）</p>
                <p className="text-slate-400">虛擬硬體</p>
              </div>
            ))}
            <div className="bg-slate-700 p-2 rounded">Hypervisor（VMware / VirtualBox）</div>
            <div className="bg-slate-600 p-2 rounded">Host OS</div>
            <div className="bg-slate-500 p-2 rounded">實體硬體</div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
          <h3 className="text-xl font-bold text-blue-400 text-center">容器（Container）</h3>
          <div className="space-y-2 text-sm text-center">
            {["App A", "App B"].map((app, i) => (
              <div key={i} className="bg-blue-900/40 border border-blue-700 p-2 rounded">
                <p>{app}</p>
                <p className="text-slate-400">Libs / Bins</p>
              </div>
            ))}
            <div className="bg-blue-800/60 p-2 rounded">Docker Engine</div>
            <div className="bg-slate-600 p-2 rounded">Host OS（Linux Kernel）</div>
            <div className="bg-slate-500 p-2 rounded">實體硬體</div>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們要理解容器和虛擬機的差異，這是 Docker 入門最重要的概念之一。

先說虛擬機。VM 的做法是在實體硬體上跑一個 Hypervisor（比如 VMware、VirtualBox），Hypervisor 模擬出一組虛擬硬體，然後在這個虛擬硬體上安裝一個完整的 Guest OS，最後才在 Guest OS 裡跑你的應用程式。

這樣做的代價是什麼？每個 VM 都需要一個完整的 OS，光 Guest OS 本身就可能佔用幾 GB 的磁碟空間和幾百 MB 的記憶體。啟動一個 VM 需要幾分鐘，因為要走完完整的 OS 開機流程。

容器的做法完全不同。容器直接共享宿主機（Host）的 Linux Kernel，不需要自己的完整 OS。每個容器只包含應用程式和它的直接依賴——函式庫、執行檔、設定檔。Docker Engine 利用 Linux 的 namespace 和 cgroup 機制，讓每個容器看起來像是獨立的系統，但實際上共用同一個 Kernel。

效果是什麼？容器映像只要幾十 MB（基礎映像），而不是幾 GB。啟動時間是秒級甚至毫秒級，而不是分鐘級。同一台機器可以跑幾十甚至幾百個容器，而只能跑少數幾個 VM。

重要概念補充：容器共享 Kernel 代表容器不能輕易換 Kernel。比如在 Linux 上，你無法直接跑一個「Windows 容器」，因為 Windows 應用程式需要 Windows Kernel。Docker Desktop 在 Mac 和 Windows 上能跑 Linux 容器，是因為它在背後偷偷起了一個輕量 Linux VM。這個細節在進階使用時會有影響。`,
    duration: "10"
  },

  // ========== 容器 vs VM：效能比較 ==========
  {
    title: "容器 vs 虛擬機：效率比較",
    section: "容器 vs 虛擬機",
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-4 text-blue-400">比較項目</th>
              <th className="p-4">🐳 Container</th>
              <th className="p-4">🖥️ VM</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {[
              ["啟動時間", "秒級（&lt;1s）", "分鐘級（1-5 min）"],
              ["映像大小", "MB 級（幾十 MB）", "GB 級（幾 GB）"],
              ["記憶體使用", "低（共享 Kernel）", "高（獨立 OS）"],
              ["隔離程度", "程序級隔離", "硬體級隔離"],
              ["可攜性", "極高（Image 即環境）", "較差（鏡像大，依賴 Hypervisor）"],
              ["安全邊界", "共享 Kernel（風險較高）", "完全隔離（更安全）"],
            ].map(([item, container, vm], i) => (
              <tr key={i} className="border-b border-slate-800">
                <td className="p-4 font-semibold">{item}</td>
                <td className="p-4 text-green-400" dangerouslySetInnerHTML={{ __html: container }} />
                <td className="p-4 text-orange-400">{vm}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg mt-4">
          <p className="text-blue-400 font-semibold">💡 實務上的選擇</p>
          <p className="text-slate-300 text-sm">容器用於應用部署；VM 用於強隔離需求（多租戶、不同 OS）</p>
        </div>
      </div>
    ),
    notes: `我們來比較一下容器和虛擬機各方面的差異。

啟動時間：容器幾乎是瞬間啟動，通常在一秒以內，有些輕量容器甚至幾百毫秒。VM 要走完整的 OS 開機流程，通常需要一到五分鐘。在雲端彈性伸縮的場景中，啟動速度是關鍵，容器有很大優勢。

映像大小：一個 Docker 容器映像通常幾十到幾百 MB。一個 VM 鏡像動輒好幾 GB，因為包含了完整 OS。磁碟空間和網路傳輸成本差很多。

記憶體使用：容器只跑應用程式本身，沒有 OS overhead，記憶體效率遠高於 VM。同樣的硬體，容器可以密集部署更多服務。

隔離程度：這是容器的相對弱點。VM 有完整的硬體隔離，容器只有程序級隔離，共享同一個 Kernel。理論上，如果容器有嚴重安全漏洞可能影響到宿主機。VM 的安全邊界更清晰，這也是為什麼高安全要求的環境（如多租戶雲端）傾向用 VM。

實務選擇：這不是「容器好」或「VM 好」的問題，而是根據需求選擇。大多數現代應用部署選容器，因為輕量快速。但如果你需要跑多個完全不同的 OS，或是有強隔離的安全需求，VM 是更好的選擇。在雲端環境中，兩者常常混用：在 VM 上跑 Docker，在容器裡跑應用。`,
    duration: "10"
  },

  // ========== Docker 架構 ==========
  {
    title: "Docker 架構",
    subtitle: "Daemon, Client, Registry, Image, Container",
    section: "Docker 架構",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-2 text-center text-sm items-center">
          <div className="bg-green-900/40 border border-green-700 p-3 rounded-lg col-span-1">
            <p className="text-2xl">👤</p>
            <p className="font-semibold text-green-400">Docker Client</p>
            <p className="text-slate-400 text-xs">docker run ...</p>
          </div>
          <div className="text-slate-500 text-2xl">→</div>
          <div className="bg-blue-900/40 border border-blue-700 p-3 rounded-lg col-span-1">
            <p className="text-2xl">⚙️</p>
            <p className="font-semibold text-blue-400">Docker Daemon</p>
            <p className="text-slate-400 text-xs">dockerd</p>
          </div>
          <div className="text-slate-500 text-2xl">↔</div>
          <div className="bg-purple-900/40 border border-purple-700 p-3 rounded-lg col-span-1">
            <p className="text-2xl">📦</p>
            <p className="font-semibold text-purple-400">Registry</p>
            <p className="text-slate-400 text-xs">Docker Hub</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Image（映像）",
              color: "yellow",
              items: ["容器的唯讀模板", "由 Dockerfile 建立", "可以有多個版本（tag）", "類比：程式的安裝檔"],
            },
            {
              label: "Container（容器）",
              color: "cyan",
              items: ["Image 的執行實例", "有獨立的讀寫層", "可啟動、停止、刪除", "類比：程式執行中的 Process"],
            },
          ].map((box) => (
            <div key={box.label} className={`bg-slate-800/50 p-4 rounded-lg border border-${box.color}-700/50`}>
              <p className={`font-bold text-${box.color}-400 mb-2`}>{box.label}</p>
              <ul className="space-y-1">
                {box.items.map((item, j) => (
                  <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className={`text-${box.color}-400`}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `現在來認識 Docker 的整體架構，有五個核心組件：Client、Daemon、Registry、Image、Container。

Docker Client 就是你在終端機輸入的 docker 指令，它是使用者和 Docker 系統互動的入口。你輸入 docker run nginx，Client 把這個請求發送給 Daemon。

Docker Daemon（dockerd）是在背景持續運行的服務，負責真正執行所有操作：下載 Image、建立容器、管理網路和儲存。Daemon 監聽來自 Client 的請求，通常透過 Unix socket 或 TCP 通訊。

Registry 是 Image 的儲存庫，就像 GitHub 是程式碼的儲存庫。Docker Hub 是最大的公開 Registry，上面有幾百萬個官方和社群 Image。公司通常也會架設私有 Registry，用來存放自己的 Image。

Image（映像）是容器的模板，是唯讀的。你可以把它想像成程式的安裝包：有這個安裝包，就能在任何支援的機器上產生一模一樣的執行環境。Image 是分層（layer）構成的，每一層代表一個步驟（比如安裝某個套件），多個 Image 可以共用相同的層，節省磁碟空間。

Container（容器）是 Image 的執行實例。一個 Image 可以產生多個 Container，就像一個程式安裝檔可以安裝多次。Container 在 Image 的唯讀層上面加了一個可寫層，容器裡的任何修改都寫在這個可寫層，不影響原始 Image。

記住這個流程：你寫指令 → Client 發給 Daemon → Daemon 從 Registry 拉 Image → 根據 Image 建立 Container → Container 跑起來。`,
    duration: "20"
  },

  // ========== 安裝 Docker 與基本驗證 ==========
  {
    title: "安裝 Docker 與基本驗證",
    section: "環境設定",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># Ubuntu 安裝（練習機已預裝，僅供參考）</p>
          <pre className="text-green-400 text-sm">{`curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 驗證安裝</p>
          <pre className="text-green-400 text-sm">{`docker version          # 查看版本
docker info             # 查看系統資訊
docker run hello-world  # 跑第一個容器`}</pre>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">✓ hello-world 成功輸出</p>
          <pre className="text-slate-300 text-xs mt-2">{`Hello from Docker!
This message shows that your installation appears to be working correctly.`}</pre>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">💡 如果看到 permission denied，記得加 sudo 或重新登入讓 usermod 生效</p>
        </div>
      </div>
    ),
    notes: `我們的練習機已經預裝好 Docker 了，不需要現在安裝。但我還是說一下安裝方式，讓大家知道如何在自己的機器上裝。

最簡單的 Ubuntu 安裝方法是用官方的一鍵安裝腳本：curl -fsSL https://get.docker.com | sh。腳本執行完後，要把當前使用者加到 docker 群組：sudo usermod -aG docker $USER，然後重新登入讓設定生效。加入 docker 群組的目的是讓你可以不加 sudo 直接執行 docker 指令。

驗證安裝有三個步驟：

第一步，docker version，顯示 Client 和 Daemon 的版本號。如果只顯示 Client 版本，代表 Daemon 沒在跑，要用 sudo systemctl start docker 啟動。

第二步，docker info，顯示更詳細的系統資訊，包括當前有幾個容器、幾個 Image、儲存驅動等。

第三步，docker run hello-world，這是 Docker 官方提供的測試 Image，執行成功會顯示「Hello from Docker!」和一段說明 Docker 運作流程的文字。這個 hello-world 其實是一個很好的教學材料，它的輸出說明了 Docker 拉取 Image、建立容器、執行、輸出的完整流程。

大家現在連到練習機，把這三個指令依序執行一遍，確認 Docker 可以正常運作。有問題舉手。

（等待學員操作，約 3 分鐘）

好，基本環境確認沒問題了，我們繼續往下走。`,
    duration: "10"
  },

  // ========== 休息 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          理論部分結束！休息一下，等等進入大量實作
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400">下半場預告</p>
          <p className="text-xl text-blue-400">docker run、容器管理、Volume、環境變數、資源限制</p>
        </div>
      </div>
    ),
    notes: `好，理論部分告一段落。我們花了一個小時搞清楚：為什麼需要 Docker、容器和 VM 的差異、Docker 的五個核心組件。

現在休息 15 分鐘，去活動一下，喝點水。後面三個多小時全是動手操作，要保持精力。

如果剛才理論部分有任何疑問，可以趁這個時候過來問我。休息結束後我們就不會再回頭複習理論，直接進入實作。

14:20 準時繼續，我們直接從 docker run 開始！`,
    duration: "1"
  },

  // ========== docker run 基本操作 ==========
  {
    title: "docker run 基本操作",
    subtitle: "-d, -p, --name, -e, -v",
    section: "容器操作",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 基本語法</p>
          <code className="text-green-400">docker run [選項] IMAGE [指令]</code>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { flag: "-d", desc: "背景執行（detach）", example: "docker run -d nginx" },
            { flag: "-p", desc: "埠映射 host:container", example: "docker run -p 8080:80 nginx" },
            { flag: "--name", desc: "指定容器名稱", example: "docker run --name web nginx" },
            { flag: "-e", desc: "設定環境變數", example: 'docker run -e ENV=prod nginx' },
            { flag: "-v", desc: "掛載 Volume", example: "docker run -v /data:/data nginx" },
            { flag: "--rm", desc: "容器停止後自動刪除", example: "docker run --rm alpine echo hi" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <code className="text-yellow-400 font-bold">{item.flag}</code>
              <p className="text-slate-300 text-sm mt-1">{item.desc}</p>
              <code className="text-green-400 text-xs mt-1 block">{item.example}</code>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `歡迎回來！現在進入最重要的實作部分，從 docker run 開始。

docker run 是你和 Docker 最頻繁的互動指令，它做的事情是：如果 Image 不在本地就先拉下來，然後建立一個新容器並啟動它。

語法是：docker run [選項] IMAGE [要在容器裡執行的指令]

六個最重要的選項：

-d（detach）：把容器丟到背景跑，你的終端機不被佔用，可以繼續輸入其他指令。正式環境的服務幾乎都加 -d。不加 -d 的話，容器的輸出直接打到你的終端，Ctrl+C 會停止容器。

-p（publish）：把容器內部的 port 對映到宿主機的 port。格式是 宿主機port:容器port。比如 -p 8080:80 代表你瀏覽器連 localhost:8080，就會到達容器內的 80 port。沒有 -p，容器的網路是封閉的，外面連不進去。

--name：給容器取一個有意義的名字，方便後續管理。不指定的話，Docker 會隨機取一個像 "loving_einstein" 的名字。正式環境一定要加 --name，否則管理多個容器時很混亂。

-e（environment）：注入環境變數，格式是 -e VARIABLE=value。很多應用程式靠環境變數接收設定，比如資料庫連線字串、API Key 等。

-v（volume）：掛載儲存，把宿主機的目錄或 Docker Volume 掛到容器內的路徑。容器本身的儲存是暫時的，重啟後資料消失，需要持久化的資料必須用 Volume。

--rm：容器停止後自動刪除，適合測試用的一次性容器。不加的話，停止的容器還會留著，需要手動 docker rm。

現在我們來跑一個 nginx：docker run -d -p 8080:80 --name my-nginx nginx。然後用瀏覽器開 http://localhost:8080，應該看到 nginx 的歡迎頁面。大家跟著做！`,
    duration: "30"
  },

  // ========== 容器管理指令 ==========
  {
    title: "容器管理常用指令",
    subtitle: "ps / images / logs / exec / stop / rm",
    section: "容器操作",
    content: (
      <div className="space-y-3">
        {[
          {
            cmd: "docker ps",
            desc: "列出執行中的容器",
            detail: "加 -a 顯示所有（包含已停止）",
          },
          {
            cmd: "docker images",
            desc: "列出本地所有 Image",
            detail: "顯示 REPOSITORY, TAG, IMAGE ID, SIZE",
          },
          {
            cmd: "docker logs",
            desc: "查看容器輸出日誌",
            detail: "加 -f 持續追蹤（follow），加 --tail 50 只看最後 50 行",
          },
          {
            cmd: "docker exec",
            desc: "在執行中的容器內執行指令",
            detail: "docker exec -it 容器名 bash 進入互動式 shell",
          },
          {
            cmd: "docker stop",
            desc: "優雅停止容器（發 SIGTERM）",
            detail: "容器有時間做清理，再強制停止",
          },
          {
            cmd: "docker rm",
            desc: "刪除已停止的容器",
            detail: "加 -f 強制刪除執行中的容器",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-4 bg-slate-800/50 p-3 rounded-lg items-start">
            <code className="text-green-400 font-bold w-32 flex-shrink-0 text-sm">{item.cmd}</code>
            <div>
              <p className="text-slate-200 text-sm">{item.desc}</p>
              <p className="text-slate-500 text-xs mt-1">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `有了容器跑起來之後，你需要管理它們。這六個指令是日常操作最常用的，幾乎每天都會用到。

docker ps：列出當前正在執行的容器，包括容器 ID、Image 名稱、建立時間、狀態、Port 映射、容器名稱。加上 -a 參數（docker ps -a）會顯示所有容器，包括已停止的。如果你發現 docker ps 什麼都沒有，但你剛才有執行容器，可能容器已經退出了，加 -a 看看狀態。

docker images：列出你本地所有的 Image，顯示來源（REPOSITORY）、標籤（TAG）、映像 ID、建立時間、大小。剛才拉下來的 nginx Image 應該在這裡。

docker logs：查看容器的輸出日誌，對 debug 非常有用。-f 是 follow，讓你持續看新的輸出，類似 tail -f。--tail 50 只看最後 50 行，避免日誌太多一次輸出幾千行。

docker exec：在一個已在執行的容器裡執行額外的指令。最常用的是 docker exec -it 容器名稱 bash（或 sh），這樣你就進入容器內部的 shell，可以直接在裡面執行指令、看檔案、debug。-i 是 interactive，-t 是 tty，兩個合起來 -it 讓你有互動式的終端機體驗。

docker stop：優雅地停止一個容器，先發 SIGTERM 訊號給容器，讓應用程式有機會做清理（關閉資料庫連線、寫入暫存資料等），如果在 10 秒內沒停，才強制殺掉。

docker rm：刪除一個已停止的容器。注意：容器停止不等於刪除，已停止的容器還佔用磁碟空間。加 -f 可以直接刪除執行中的容器（先強制停止再刪除）。

實作練習：現在請對剛才的 my-nginx 容器執行 docker logs my-nginx，docker exec -it my-nginx bash，在容器裡面輸入 ls /etc/nginx，然後 exit 出來，最後 docker stop my-nginx，docker rm my-nginx。把整個生命週期走一遍。`,
    duration: "25"
  },

  // ========== Volume：Bind Mount vs Named Volume ==========
  {
    title: "Volume 基礎",
    subtitle: "Bind Mount vs Named Volume",
    section: "儲存管理",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-orange-900/30 border border-orange-700 p-4 rounded-lg">
            <p className="text-orange-400 font-bold text-lg mb-2">📁 Bind Mount</p>
            <p className="text-slate-300 text-sm mb-3">直接掛載宿主機的目錄或檔案到容器</p>
            <pre className="text-green-400 text-xs bg-slate-900/50 p-2 rounded">{`docker run -v /host/path:/container/path nginx`}</pre>
            <ul className="mt-3 space-y-1 text-slate-400 text-xs">
              <li>• 宿主機路徑必須存在</li>
              <li>• 適合開發時掛載原始碼</li>
              <li>• 可以直接在宿主機編輯</li>
            </ul>
          </div>
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-400 font-bold text-lg mb-2">🗃️ Named Volume</p>
            <p className="text-slate-300 text-sm mb-3">由 Docker 管理的具名儲存空間</p>
            <pre className="text-green-400 text-xs bg-slate-900/50 p-2 rounded">{`docker volume create mydata
docker run -v mydata:/data nginx`}</pre>
            <ul className="mt-3 space-y-1 text-slate-400 text-xs">
              <li>• Docker 管理存放位置</li>
              <li>• 適合正式環境資料持久化</li>
              <li>• 生命週期與容器獨立</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2"># Volume 管理指令</p>
          <pre className="text-green-400 text-sm">{`docker volume ls            # 列出所有 Volume
docker volume inspect mydata # 查看詳細資訊
docker volume rm mydata     # 刪除 Volume`}</pre>
        </div>
      </div>
    ),
    notes: `容器的儲存有一個關鍵特性：容器的可寫層在容器被刪除後，資料也跟著消失。這對大多數服務（資料庫、上傳的檔案）來說是不可接受的，所以我們需要 Volume。

Volume 的本質是把宿主機的儲存空間掛進容器，讓容器裡的應用程式讀寫一個「外部」路徑，這個路徑的資料即使容器刪除了也不消失。

Volume 有兩種主要類型：

Bind Mount（綁定掛載）：你直接指定宿主機上的一個絕對路徑，把它掛進容器。語法是 -v /宿主機路徑:/容器路徑。宿主機和容器都能讀寫同一份資料，適合開發環境——你可以在宿主機上用 VS Code 編輯程式碼，容器裡的應用馬上看到更新，不需要重新 build Image。

Named Volume（具名卷）：由 Docker 自己管理的儲存空間，你只需要給它一個名字，Docker 決定它實際存在宿主機哪個位置（通常在 /var/lib/docker/volumes/）。語法是 -v 卷名:/容器路徑。Named Volume 適合正式環境，因為它的生命週期和容器是獨立的——你可以刪掉容器再建一個新的，掛上同一個 Named Volume，資料還在。

什麼時候用哪個？開發環境用 Bind Mount，把原始碼掛進去方便即時修改。正式環境用 Named Volume，讓 Docker 管理資料的存放，比較乾淨，也比較容易做備份（docker volume inspect 可以找到實際路徑）。

實作練習：先建立一個 Named Volume，docker volume create testdata。然後跑一個 busybox 容器掛上去，在裡面寫入一個檔案，docker run --rm -v testdata:/data busybox sh -c "echo hello > /data/test.txt"。再跑另一個容器讀取，docker run --rm -v testdata:/data busybox cat /data/test.txt。確認資料在容器之間是共享且持久的。`,
    duration: "25"
  },

  // ========== 環境變數注入 ==========
  {
    title: "環境變數注入",
    subtitle: "-e 與 --env-file",
    section: "設定管理",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 方法一：-e 直接注入單一變數</p>
          <pre className="text-green-400 text-sm">{`docker run -e DB_HOST=localhost \\
           -e DB_PORT=5432 \\
           -e DB_NAME=mydb \\
           myapp:latest`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 方法二：--env-file 批次注入</p>
          <pre className="text-green-400 text-sm">{`# 先建立 .env 檔案
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
APP_SECRET=my-secret-key

# 然後注入
docker run --env-file .env myapp:latest`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 在容器內查看環境變數</p>
          <pre className="text-green-400 text-sm">{`docker exec -it myapp env | grep DB`}</pre>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm font-semibold">⚠️ 安全提醒</p>
          <p className="text-yellow-200 text-sm">.env 檔含有敏感資訊，不要 commit 到 Git！加到 .gitignore</p>
        </div>
      </div>
    ),
    notes: `環境變數注入是 Docker 設定管理中最重要的模式，幾乎所有設計良好的容器化應用都靠環境變數接收設定。

為什麼用環境變數而不是設定檔？因為同一個 Image 可以在不同環境（開發/測試/生產）使用，每個環境的設定不同，但 Image 本身不能改。透過環境變數，在執行時動態注入設定，Image 保持不變。這符合 12-Factor App 的設計原則，也是 Kubernetes ConfigMap 和 Secret 的設計基礎。

-e 是最直接的方式，在 docker run 後面加 -e 變數名=值。有多個變數就加多個 -e，或是每個 -e 用反斜線換行（這是 shell 的換行接續，不是 Docker 語法）。缺點是指令越來越長，一堆 -e 很難閱讀。

--env-file 更適合多變數的情況。先把所有環境變數寫在一個純文字檔案（通常命名為 .env），格式是 KEY=VALUE 一行一個，然後用 --env-file .env 一次注入所有變數。這樣 docker run 指令保持簡潔，環境變數集中管理，不同環境可以維護不同的 .env 檔。

安全提醒很重要：.env 檔案通常包含密碼、API Key、資料庫連線字串等敏感資訊，絕對不能 commit 到版本控制系統（Git）裡。你的 .gitignore 必須包含 .env。在 Kubernetes 裡，這類敏感設定要用 Secret 而不是 ConfigMap。今天只是 Docker 層面，K8s 的部分之後會深入講。

實作練習：建立一個 .env 檔，寫入 APP_ENV=development 和 DEBUG=true，然後執行 docker run --rm --env-file .env alpine env，確認環境變數有被注入。`,
    duration: "20"
  },

  // ========== 資源限制 ==========
  {
    title: "資源限制",
    subtitle: "--memory, --cpus",
    section: "資源管理",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 記憶體限制</p>
          <pre className="text-green-400 text-sm">{`docker run --memory 512m nginx    # 最多 512 MB
docker run --memory 1g nginx      # 最多 1 GB
docker run -m 256m nginx          # -m 是縮寫`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># CPU 限制</p>
          <pre className="text-green-400 text-sm">{`docker run --cpus 0.5 nginx   # 最多使用 0.5 個 CPU
docker run --cpus 2 nginx     # 最多使用 2 個 CPU`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2 text-sm"># 組合使用 + 查看</p>
          <pre className="text-green-400 text-sm">{`docker run -d -m 256m --cpus 0.5 --name limited nginx
docker stats limited  # 即時查看資源用量`}</pre>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm">💡 為什麼要設資源限制？</p>
          <p className="text-slate-300 text-sm">防止單一容器吃掉所有資源，影響同一主機上的其他容器或服務</p>
        </div>
      </div>
    ),
    notes: `資源限制是正式環境部署容器時不可缺少的設定，但很多初學者會忽略。

為什麼要限制資源？想像你的伺服器上跑了十個容器，其中一個因為記憶體洩漏（memory leak）不斷吃記憶體，最後把整台機器的記憶體吃光，導致其他容器也死掉，影響所有服務。設定資源限制是防禦性設計，讓一個容器出問題不會拖垮整個主機。

在 Kubernetes 的環境中，資源限制（limits）和資源請求（requests）是 Pod 定義的必要欄位，不設定的話，Pod 可能被強制驅逐（eviction）。今天在 Docker 層面先理解這個概念，K8s 的部分之後會深入。

記憶體限制用 --memory 或 -m，後面接數字和單位：m 是 MB，g 是 GB。設定了記憶體上限後，如果容器嘗試使用超過上限的記憶體，Linux Kernel 的 OOM Killer 會殺掉容器進程。容器會出現 Exit Code 137（代表被 OOM Kill），這是排查記憶體問題的重要線索。

CPU 限制用 --cpus，後面接小數點數字，代表可以使用的 CPU 核心數。0.5 代表半個核，2 代表兩個核。注意這是相對的上限（throttling），不是獨佔某個核心，容器的 CPU 使用量達到上限時 Kernel 會節流，讓它跑慢一點。

docker stats 是即時監控工具，顯示每個容器的 CPU 使用率、記憶體用量、網路和磁碟 IO。Ctrl+C 停止。這在排查「到底是哪個容器在消耗資源」時非常有用。

實作：執行 docker run -d -m 256m --cpus 0.5 --name limited nginx，然後 docker stats limited 觀察資源使用。再用 docker inspect limited 找到設定中的 Memory 和 NanoCpus 欄位，確認限制確實生效。`,
    duration: "15"
  },

  // ========== 課程總結 ==========
  {
    title: "今日總結",
    section: "回顧",
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            { icon: "✅", text: "理解環境不一致問題，知道 Docker 為何而生" },
            { icon: "✅", text: "能說明容器和 VM 的架構差異與效能比較" },
            { icon: "✅", text: "了解 Docker 五大組件：Daemon、Client、Registry、Image、Container" },
            { icon: "✅", text: "能執行 docker run 並搭配 -d、-p、--name、-e、-v 選項" },
            { icon: "✅", text: "能用 ps / logs / exec / stop / rm 管理容器完整生命週期" },
            { icon: "✅", text: "理解 Bind Mount 和 Named Volume 的差異和使用場景" },
            { icon: "✅", text: "能用 -e 和 --env-file 注入環境變數" },
            { icon: "✅", text: "能設定 --memory 和 --cpus 資源限制並用 docker stats 監控" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
              <span className="text-xl">{item.icon}</span>
              <p className="text-slate-200 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold">🎯 下一步</p>
          <p className="text-slate-300 text-sm">第三堂：Dockerfile 與 Image 建置、docker-compose、進入 Kubernetes</p>
        </div>
      </div>
    ),
    notes: `讓我們來回顧今天下午學到的東西，這個清單代表你現在已經具備的能力。

我們從根本上理解了 Docker 解決的問題：環境不一致。這不只是一個理論概念，這是每個開發和維運工程師的真實痛點，而 Docker 用「把環境打包」的方式解決了它。

我們深入比較了容器和虛擬機：VM 是硬體虛擬化，容器是 OS 層虛擬化，共享 Kernel，所以更輕量、更快速。這個理解對你日後架構設計有重要影響。

我們認識了 Docker 的五個核心組件，知道一個 docker run 指令背後發生了什麼事。

實作部分我們走了完整的容器生命週期：建立、執行、日誌查看、進入容器、停止、刪除。加上 Volume 掛載、環境變數注入、資源限制，這些是 90% 的日常 Docker 操作所需要的技能。

下一堂課，我們會進入更進階的 Docker 使用：寫 Dockerfile 自己建立 Image，用 docker-compose 管理多個容器，然後就是整個課程的重頭戲——Kubernetes 叢集管理。Docker 是 K8s 的基礎，今天學到的 Image、Container、Volume、環境變數的概念，在 Kubernetes 裡都有直接對應的概念。你今天投入的時間，是非常值得的。`,
    duration: "10"
  },

  // ========== Q&A ==========
  {
    title: "Q & A",
    subtitle: "有任何問題嗎？",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">🙋‍♀️ 🙋 🙋‍♂️</p>
        <p className="text-2xl text-slate-300">
          課程 Q&A 時間，有任何問題都可以提出來
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">今天沒跟上的概念？</p>
            <p className="text-slate-400 text-sm">現在提出來，我們一起複習一遍</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">回家練習遇到問題？</p>
            <p className="text-slate-400 text-sm">課程 Line 群組，助教 24h 內回覆</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在是今天最後的開放問答時間。不管是今天任何一個主題的疑問，或是對整個課程方向的問題，都歡迎現在提出來。

讓我先分享幾個常見問題的預答：

問：docker stop 和 docker kill 有什麼差別？
答：stop 先發 SIGTERM 讓應用程式優雅結束，等 10 秒後如果沒停，才發 SIGKILL 強制殺掉。kill 直接發 SIGKILL 立刻強制結束，應用程式沒有機會清理。一般用 stop，除非容器卡住不動了才用 kill。

問：為什麼我的容器跑起來又馬上停掉了（Exit immediately）？
答：Docker 容器的生命週期和它的主要程序（PID 1）綁定。主程序退出，容器就停止。常見原因：一、應用程式沒有前台程序，跑完就結束了（比如 dockerfile 的 CMD 是一個腳本，腳本執行完就退出）；二、應用程式啟動就報錯退出了。排查方法：docker logs 容器名，看有沒有錯誤輸出。

問：Bind Mount 和 Named Volume 資料刪掉了能找回來嗎？
答：Bind Mount 的資料在宿主機的指定路徑，除非你手動刪，不然不會消失，用 rm 就會刪掉。Named Volume 的資料在 Docker 管理的路徑下，docker volume rm 才會刪掉，容器刪除不影響 Volume。

問：容器之間怎麼互相通訊？
答：這個問題很好！Default 情況下，同一台宿主機上的容器可以透過 Docker 的 bridge 網路互通，用容器的名稱當作 hostname 就能連到對方。docker-compose 會自動建立共用網路，K8s 則有 Service 概念。這些下堂課會詳細說明。

還有其他問題嗎？今天大家吸收了很多，如果一時消化不完，可以先做課後練習，很多問題在動手操作中自然就解開了。課程 Line 群組隨時可以提問，助教會盡快回覆。明天見！`,
    duration: "5"
  },
]
