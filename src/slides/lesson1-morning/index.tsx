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
    title: "Kubernetes 入門",
    subtitle: "從新手到叢集管理員實務班",
    section: "第一堂課",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            ☸️
          </div>
          <div>
            <p className="text-2xl font-semibold">Linux 操作入門</p>
            <p className="text-slate-400">比較 Linux 與 Windows 差異、Linux 基礎概念</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">講師</p>
            <p>謝智宇</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">助教</p>
            <p>陳彥彤</p>
          </div>
        </div>
      </div>
    ),
    notes: `大家好，非常歡迎大家來到這個 Kubernetes 從新手到叢集管理員的實務課程！

我是今天的講師謝智宇，大家可以叫我智宇老師。旁邊這位是助教陳彥彤，如果大家在上課過程中有任何操作問題，或是電腦環境出了狀況，都可以舉手請助教過來協助，不用擔心打擾到其他人。

在正式進入 Kubernetes 之前，我們需要先打好基礎，特別是 Linux 的基礎。你可能會問：我來學 K8s，為什麼要先學 Linux？這是個很好的問題。因為 Kubernetes 完全是建構在 Linux 之上的，所有的節點、Pod、容器，底層都是 Linux 在運作。如果你不懂 Linux，你在操作 K8s 的時候會非常吃力，尤其是在除錯或是排查問題的時候。

整個課程的學習路徑是：先打好 Linux 基礎 → 學習 Docker 容器技術 → 最後進入 Kubernetes 叢集管理。每一步都建立在前一步的基礎上。

今天上午我們會花三個小時，從最基本的概念開始，帶大家認識 Linux 這個強大的作業系統。到了今天結束，你應該可以用 SSH 連上一台 Linux 主機，執行基本的指令。準備好了嗎？我們開始！`,
    duration: "3"
  },

  // ========== 課程大綱 ==========
  {
    title: "今日課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-4">
        {[
          { time: "09:00-09:30", topic: "破冰與環境確認", icon: "🤝" },
          { time: "09:30-10:00", topic: "為什麼要學 Linux？", icon: "🤔" },
          { time: "10:00-10:30", topic: "Linux vs Windows 差異比較", icon: "⚔️" },
          { time: "10:30-10:45", topic: "休息時間", icon: "☕" },
          { time: "10:45-11:30", topic: "Linux 核心概念與發行版", icon: "🐧" },
          { time: "11:30-12:00", topic: "實作：第一次登入 Linux", icon: "💻" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-sm">{item.time}</p>
              <p className="text-lg">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我們先看一下今天上午的課程安排，這樣大家心裡有個底，知道接下來會學什麼。

9:00 到 9:30 是破冰活動，讓大家互相認識，同時確認每個人的電腦環境都能正常連線到練習主機。

9:30 到 10:00 我們會討論為什麼要學 Linux。理解「為什麼」很重要，它會讓你的學習更有方向感和動力，知道自己學的東西將來要用在哪裡。

10:00 到 10:30 會深入比較 Linux 和 Windows 的差異。很多同學是從 Windows 背景過來的，了解這些差異能幫助你更快適應 Linux 的思維方式。

10:30 到 10:45 是 15 分鐘休息，大家可以活動一下筋骨、上廁所、喝水。

10:45 到 11:30 進入 Linux 的核心概念，包括檔案系統結構和使用者權限。

最後 11:30 到 12:00 是實作時間，讓每個人親自動手，用 SSH 登入一台真正的 Linux 主機。這是最重要的環節！整個上午的安排都是循序漸進的，有問題隨時提出來。`,
    duration: "2"
  },

  // ========== 破冰：自我介紹 ==========
  {
    title: "自我介紹",
    subtitle: "讓我們互相認識一下",
    section: "破冰活動",
    content: (
      <div className="space-y-6">
        <p className="text-xl">請分享：</p>
        <div className="grid gap-4">
          {[
            { q: "你的名字 / 怎麼稱呼", icon: "👋" },
            { q: "目前的工作或學習領域", icon: "💼" },
            { q: "為什麼想學 Kubernetes？", icon: "🎯" },
            { q: "有沒有用過 Linux？", icon: "🐧" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <p>{item.q}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `在正式上課之前，我想先花時間讓大家互相認識。了解各位的背景，能幫助我調整教學深度，讓這堂課對每個人都更有價值。

我先自我介紹：我叫謝智宇，在 Linux、雲端技術和 DevOps 領域工作超過十年。我最初是大學時因為課業需要接觸 Linux，面對黑色終端機畫面有點茫然，但慢慢找到節奏後，發現 Linux 的設計邏輯非常清晰，功能又強大。現在我每天的工作，從管理雲端伺服器、維護 Kubernetes 叢集，到撰寫自動化腳本、排查系統問題，全都離不開 Linux。

旁邊這位是助教陳彥彤，實作時如果有問題可以找他協助。

關於我的教學風格：我喜歡互動式教學，有問題隨時舉手，不要等我特別邀請。很多人心裡有疑問但不好意思問，帶著疑問往下走，後面就越來越難跟上。你的問題很可能也是其他人想問的，提出來大家都受益。今天有大量實作，請務必親自動手打指令，光看是學不會的。

現在輪到大家了。請一個一個做簡短的自我介紹，大約 30 秒到 1 分鐘，輕鬆聊就好。可以分享：你的名字和稱呼偏好、目前的工作或學習領域、為什麼想學 Kubernetes 或 Linux、有沒有用過 Linux 的經驗。

（進行自我介紹環節，約 5-7 分鐘）

感謝大家的介紹！從大家的背景可以看出，班上組成相當多元：有後端工程師、維運人員、學生，有的已有 Linux 基礎，有的完全是新手。這完全沒問題。

有 Linux 基礎的同學，今天可以系統化整理知識，把以前用過但不確定原理的東西搞清楚，建立更完整的認知框架。完全新手的同學，這堂課就是為你們設計的。Linux 不難，只是語法和 Windows 不同，思維方式也略有差異。只要跟著步驟走，今天結束前你一定能獨立登入 Linux 主機並執行基本指令。

大家的工作背景也是彼此的資源。後端開發的同學對程式邏輯熟悉，系統維運的同學對網路和儲存更了解，遇到相關主題時，我可能會請有經驗的同學補充看法，讓大家從不同角度理解同一個概念。

整個課程的學習路徑：今天打好 Linux 基礎 → 第二堂學 Docker 容器 → 第三堂進入 Kubernetes 叢集管理。每一步都建立在前一步上，今天的基礎打得好，後面學習會事半功倍。準備好了嗎？我們正式開始！

學習路徑補充說明：我們整個課程安排是從 Linux 基礎出發，建立紮實的命令列操作能力；第二天進入 Docker 容器技術，理解容器化的思維；第三天才真正進入 Kubernetes 叢集管理。這樣的安排是有道理的，因為 Kubernetes 裡面大量的除錯和操作都需要 Linux 指令。跳過基礎直接學 K8s，就像跳過打字就想寫程式，每個步驟都會卡住。所以今天的基礎很重要，請認真投入。

另外提醒：課程過程中會有很多實作操作，請不要只是看我示範就算了。每次我做完示範，都要自己再動手操作一遍，哪怕只是重複執行同一個指令，肌肉記憶的建立需要親身體驗。有問題立刻問，不要等到課後才來找我，那時候可能已經跟不上了。大家有什麼學習目標或期待可以先跟我說，這樣我可以針對性地調整重點。

無論你的背景如何，今天結束時每個人都會有同等的收穫：成功連上 Linux 主機，執行第一個指令，理解 Linux 和 Windows 的核心差異，為後續的 Docker 和 Kubernetes 學習打好基礎。讓我們一起加油！`,
    duration: "10"
  },

  // ========== 環境確認 ==========
  {
    title: "環境確認",
    subtitle: "確保每個人都準備好了",
    section: "課前準備",
    content: (
      <div className="space-y-6">
        <p className="text-xl">請確認你有以下工具：</p>
        <div className="grid gap-3">
          {[
            { item: "一台可以上網的電腦（Windows/Mac 都可以）", check: true },
            { item: "SSH 連線工具（Windows: PuTTY 或 Terminal）", check: true },
            { item: "課程提供的 Linux 主機 IP 與帳號", check: true },
            { item: "一顆好奇的心！", check: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="text-green-400 text-xl">✓</span>
              <p>{item.item}</p>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg mt-6">
          <p className="text-yellow-400 font-semibold">💡 小提示</p>
          <p className="text-yellow-200">如果環境有問題，請舉手找助教協助</p>
        </div>
      </div>
    ),
    notes: `在正式開始教內容之前，先確認每個人的環境都能正常連上練習主機，這樣後面的實作才能順利進行。

需要準備的東西分四類：

一、硬體：一台可以上網的電腦，Windows、Mac、或 Linux 原生都可以。

二、SSH 連線工具。Windows 10/11 內建 Terminal（Windows 終端機），在開始選單搜尋「Terminal」即可。如果是舊版 Windows，需要下載安裝 PuTTY（免費）。Mac 直接打開「終端機」應用程式（Finder → 應用程式 → 工具程式）。Linux 原生用戶直接打開終端機。

三、練習主機資訊。助教一會兒會發給大家主機的 IP 位址、帳號和初始密碼，先收好等一下用。

四、最重要的心態準備：願意動手試、不怕出錯。Linux 學習最常見的障礙不是難度太高，而是怕打錯指令。其實打錯沒關係，看懂錯誤訊息反而是學習的機會。

現在請大家確認：能打開終端機嗎？有沒有收到主機資訊？遇到問題現在就舉手，助教過去幫忙。確保每個人都準備好了再繼續。`,
    duration: "3"
  },

  // ========== 為什麼要學 Linux ==========
  {
    title: "為什麼要學 Linux？",
    section: "動機與背景",
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-k8s-blue">伺服器市場</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-5xl font-bold text-green-400">96.3%</p>
            <p className="text-slate-400">全球前 100 萬網站使用 Linux</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-k8s-blue">雲端平台</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-5xl font-bold text-blue-400">90%+</p>
            <p className="text-slate-400">AWS、GCP、Azure 上運行 Linux</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-k8s-blue">容器技術</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-5xl font-bold text-purple-400">100%</p>
            <p className="text-slate-400">Docker/K8s 原生運行於 Linux</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-k8s-blue">職涯發展</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-5xl font-bold text-orange-400">+30%</p>
            <p className="text-slate-400">具 Linux 技能薪資溢價</p>
          </div>
        </div>
      </div>
    ),
    notes: `那為什麼我們要學 Linux 呢？讓我用一些數據來說明。

首先看伺服器市場，全球前 100 萬個網站中，有超過 96% 是跑在 Linux 上面的。你平常用的 Google、Facebook、Netflix，後台全部都是 Linux。

再來看雲端平台，不管是 AWS、Google Cloud 還是 Azure，上面運行的虛擬機有超過 90% 是 Linux。即使是微軟自己的 Azure，Linux 的使用率也超過 Windows。

然後是容器技術，這也是我們這門課的主題。Docker 和 Kubernetes 是原生在 Linux 上開發的，雖然現在 Windows 和 Mac 也可以跑，但底層還是需要 Linux。

最後是職涯發展，根據人力市場調查，具備 Linux 技能的工程師，薪資比一般 IT 人員高出 20% 到 30%。

所以學會 Linux，不只是為了這門課，更是為了你的職涯發展。`,
    duration: "3"
  },

  // ========== K8s 與 Linux 的關係 ==========
  {
    title: "Kubernetes 與 Linux",
    subtitle: "為什麼要先學 Linux 才能學 K8s？",
    section: "課程脈絡",
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 text-6xl">
          <span>🐧</span>
          <span className="text-k8s-blue">→</span>
          <span>🐳</span>
          <span className="text-k8s-blue">→</span>
          <span>☸️</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="font-bold text-xl">Linux</p>
            <p className="text-slate-400 text-sm">作業系統基礎</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="font-bold text-xl">Docker</p>
            <p className="text-slate-400 text-sm">容器化技術</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="font-bold text-xl">Kubernetes</p>
            <p className="text-slate-400 text-sm">容器編排</p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🎯 學習路徑</p>
          <p>Linux 是地基，Docker 是磚塊，Kubernetes 是建築師</p>
        </div>
      </div>
    ),
    notes: `你可能會問，我是來學 Kubernetes 的，為什麼要先學 Linux？

讓我用一個比喻來說明。如果把 IT 技能比喻成蓋房子，Linux 就是地基，Docker 是磚塊，而 Kubernetes 就是建築師。

沒有穩固的地基，房子蓋不起來。同樣的，不懂 Linux，你在操作 Kubernetes 的時候會很痛苦。

舉個例子，當你的 Pod 出問題的時候，你需要進到容器裡面去 debug。這時候你要會基本的 Linux 指令，像是看 log、檢查檔案、查看網路連線等等。

所以我們這門課的安排是：先學 Linux 基礎，再學 Docker 容器，最後才進入 Kubernetes。這樣一步一步來，學起來會更順暢。`,
    duration: "2"
  },

  // ========== Linux 是什麼 ==========
  {
    title: "Linux 是什麼？",
    section: "基礎概念",
    content: (
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="text-8xl">🐧</div>
          <div className="space-y-4">
            <p className="text-xl">
              Linux 是一個<span className="text-k8s-blue font-bold">開源</span>的
              <span className="text-green-400 font-bold">作業系統核心</span>
            </p>
            <ul className="space-y-2 text-slate-300">
              <li>• 1991 年由 Linus Torvalds 創造</li>
              <li>• 基於 Unix 設計哲學</li>
              <li>• 完全免費、原始碼公開</li>
              <li>• 全球數百萬開發者共同維護</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 italic">
            "Just for fun" — Linus Torvalds 最初只是想學習作業系統怎麼運作
          </p>
        </div>
      </div>
    ),
    notes: `那，讓我們正式進入主題。Linux 到底是什麼？

Linux 是一個開源的作業系統核心，由 Linus Torvalds 在 1991 年創建，當時他只是一個想理解作業系統原理的芬蘭大學生，把自己寫的程式碼放到網路上分享，沒想到引來全世界開發者一起貢獻。Linux 這個名字是 Linus 和 Unix 的組合，因為它借鑒了 Unix 的設計哲學，但完全是重新開發的，不是複製 Unix 的程式碼。

重要概念：Linux 嚴格來說只是作業系統的核心（kernel），負責管理硬體資源、記憶體、處理程序排程。我們日常說的「Linux 系統」，其實是 Linux 核心加上各種工具程式和使用者介面的組合，稱為「Linux 發行版」（distribution）。常見發行版有 Ubuntu、CentOS、Debian、Fedora 等，它們的核心都是 Linux，但附帶的工具和設定有所不同。

三十多年來，Linux 已成為全球最關鍵的作業系統之一，運行著網際網路的基礎設施。連微軟都在 Windows 11 裡內建了 WSL（Windows Subsystem for Linux），讓 Windows 用戶可以直接跑 Linux 環境，這充分說明了 Linux 在現代 IT 世界的地位。`,
    duration: "3"
  },

  // ========== Linux vs Windows ==========
  {
    title: "Linux vs Windows",
    subtitle: "兩種作業系統的根本差異",
    section: "概念比較",
    content: (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-4 text-k8s-blue">比較項目</th>
              <th className="p-4">
                <span className="inline-flex items-center gap-2">
                  🐧 Linux
                </span>
              </th>
              <th className="p-4">
                <span className="inline-flex items-center gap-2">
                  🪟 Windows
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            <tr className="border-b border-slate-800">
              <td className="p-4 font-semibold">授權方式</td>
              <td className="p-4 text-green-400">開源免費（GPL）</td>
              <td className="p-4 text-orange-400">商業授權（付費）</td>
            </tr>
            <tr className="border-b border-slate-800">
              <td className="p-4 font-semibold">操作介面</td>
              <td className="p-4">以命令列為主</td>
              <td className="p-4">以圖形介面為主</td>
            </tr>
            <tr className="border-b border-slate-800">
              <td className="p-4 font-semibold">檔案系統</td>
              <td className="p-4">ext4, xfs, btrfs</td>
              <td className="p-4">NTFS, FAT32</td>
            </tr>
            <tr className="border-b border-slate-800">
              <td className="p-4 font-semibold">路徑分隔</td>
              <td className="p-4 font-mono text-green-400">/home/user</td>
              <td className="p-4 font-mono text-blue-400">C:\\Users\\user</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold">大小寫</td>
              <td className="p-4 text-yellow-400">區分大小寫</td>
              <td className="p-4">不區分大小寫</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
    notes: `現在讓我們來比較 Linux 和 Windows 的差異，這對從 Windows 背景過來的同學特別重要，了解差異能幫助你更快適應 Linux 的思維方式。

第一個差異是授權方式。Windows 是商業軟體，需要購買授權，個人版、專業版、企業版都有不同費用。Linux 的核心和大多數發行版是開源免費的，Ubuntu、CentOS、Debian 都可以免費下載使用，這是企業選擇 Linux 作為伺服器的重要原因之一。

第二個差異是操作介面。Windows 的 GUI（圖形使用者介面）是主要操作方式，命令列是輔助工具。Linux 的命令列（CLI）才是主要操作方式，特別是在伺服器環境，通常完全沒有 GUI，全靠命令列管理。這就是為什麼學 Linux 要從命令列開始。

第三個差異是路徑分隔符號。Windows 用反斜線，比如 C:\Users\student。Linux 用正斜線 /，比如 /home/student。另外，Linux 路徑有大小寫區分，Desktop 和 desktop 是兩個不同的目錄，這是初學者很容易踩到的坑。

第四個差異是檔案系統。Windows 有 C 槽、D 槽等磁碟機代號。Linux 只有一個根目錄 /，所有東西都掛在這個樹狀結構下，沒有磁碟代號的概念。

第五個差異是軟體安裝方式。Windows 通常是下載安裝程式雙擊安裝。Linux 用套件管理器，比如 Ubuntu 的 apt install，一行指令就能安裝軟體，而且會自動處理相依性問題。大家慢慢習慣就好，我們下堂課會詳細介紹套件管理。`,
    duration: "4"
  },

  // ========== 為什麼 CLI ==========
  {
    title: "為什麼伺服器用命令列？",
    section: "概念理解",
    content: (
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-red-400">❌ 圖形介面的問題</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-red-400">•</span>
              <span>需要顯示卡、記憶體資源</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400">•</span>
              <span>遠端連線延遲高</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400">•</span>
              <span>難以自動化、寫腳本</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400">•</span>
              <span>操作無法複製重現</span>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-green-400">✓ 命令列的優勢</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-green-400">•</span>
              <span>資源消耗極低</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400">•</span>
              <span>遠端操作快速流暢</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400">•</span>
              <span>可寫成腳本自動執行</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400">•</span>
              <span>指令可複製、版本控制</span>
            </li>
          </ul>
        </div>
      </div>
    ),
    notes: `你可能會問，2025 年了，還需要用命令列？有 GUI 不是更方便嗎？讓我給你幾個現實面的理由。

第一個理由：伺服器沒有 GUI。真實的 Linux 伺服器環境，為了節省資源和降低安全攻擊面，通常完全不安裝圖形介面。你連上去就是一個終端機。學不會命令列，就無法管理伺服器。

第二個理由：自動化腳本。你可以把一系列命令列指令寫成腳本，讓系統自動執行，比如每天凌晨備份資料庫、每小時清理暫存檔案。GUI 操作很難自動化，命令列卻可以。在 DevOps 和雲端管理中，自動化是核心能力。

第三個理由：遠端管理效率高。命令列只傳輸文字，佔用的網路頻寬極小；GUI 要傳輸整個畫面，網路慢時根本無法使用。用 SSH 連到世界各地的伺服器，命令列永遠比 GUI 遠端桌面流暢。

第四個理由：強大的組合能力。Linux 的設計哲學是：每個工具只做好一件事，但可以用管道（pipe）把多個工具串在一起完成複雜任務。這種組合方式讓命令列的威力遠超過任何圖形介面。

我知道一開始命令列看起來很嚇人，但就像學開車一樣，剛開始覺得複雜，但一旦熟悉了，就會覺得它快得多。今天大家要邁出第一步。`,
    duration: "3"
  },

  // ========== Linux 發行版 ==========
  {
    title: "Linux 發行版",
    subtitle: "同一個核心，不同的包裝",
    section: "生態系統",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-300">
          Linux 核心 + 工具程式 + 套件管理 = 發行版（Distribution）
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-2xl font-bold text-red-400 mb-2">Red Hat 系</p>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• RHEL（企業版）</li>
              <li>• CentOS / Rocky Linux</li>
              <li>• Fedora</li>
            </ul>
            <p className="text-xs text-slate-500 mt-2">套件管理: yum/dnf</p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 p-4 rounded-lg">
            <p className="text-2xl font-bold text-orange-400 mb-2">Debian 系</p>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• Debian</li>
              <li>• Ubuntu</li>
              <li>• Linux Mint</li>
            </ul>
            <p className="text-xs text-slate-500 mt-2">套件管理: apt</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-400 mb-2">其他</p>
            <ul className="text-slate-300 space-y-1 text-sm">
              <li>• Arch Linux</li>
              <li>• Alpine（容器常用）</li>
              <li>• SUSE</li>
            </ul>
            <p className="text-xs text-slate-500 mt-2">各有特色</p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">📌 本課程使用</p>
          <p>Ubuntu 22.04 LTS — 社群資源豐富，適合學習</p>
        </div>
      </div>
    ),
    notes: `說了這麼多，Linux 其實只是一個核心。核心加上工具程式、套件管理系統、使用者介面等，組合在一起，才形成一個完整的「Linux 發行版」（distribution，簡稱 distro）。

主要的發行版可以分幾個家族：

Debian 家族：Debian 是最重要的基礎發行版之一，它的衍生版 Ubuntu 是目前最流行的桌面和伺服器 Linux，使用 apt 套件管理器。Ubuntu 有 LTS（Long-Term Support）版本，每兩年發布一次，支援五年，非常適合生產環境。我們課程的練習環境就是用 Ubuntu。

Red Hat 家族：Red Hat Enterprise Linux（RHEL）是企業市場的老大哥，很多大公司的核心系統都在跑。CentOS 曾是 RHEL 的免費版本，但已停止支援。現在的替代品是 AlmaLinux 和 Rocky Linux，以及 Fedora（開發版本）。這個家族使用 yum/dnf 套件管理器。

Alpine Linux：非常小巧（基礎映像才幾 MB），常用在 Docker 容器裡，追求最小化原則。

在 Kubernetes 的世界裡，大多數節點和容器基於 Ubuntu 或 CentOS/RHEL 系統。了解這些發行版的差異，能幫助你在實際工作中快速上手不同的環境。課程中我們主要用 Ubuntu，但教的基礎概念在各發行版上都通用。`,
    duration: "4"
  },

  // ========== 休息提示 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          休息一下，等等我們要開始動手操作了！
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400">下半場預告</p>
          <p className="text-xl text-k8s-blue">Linux 核心概念 & 第一次登入</p>
        </div>
      </div>
    ),
    notes: `好，我們已經上了將近一個小時了，讓我們休息 15 分鐘。

這 15 分鐘可以上廁所、喝水、活動一下筋骨。如果對剛才的內容有疑問，也可以趁這個時候來問我或助教。

休息結束後，我們會進入 Linux 的核心概念部分，包括檔案系統結構和使用者權限，然後進行今天最重要的實作環節：讓每個人親自 SSH 登入一台 Linux 主機。

15 分鐘後準時回來，我們繼續！`,
    duration: "1"
  },

  // ========== Linux 檔案系統階層 ==========
  {
    title: "Linux 檔案系統結構",
    subtitle: "一切都是檔案",
    section: "核心概念",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm">
          <pre className="text-green-400">{`/                    # 根目錄 (root)
├── bin/             # 基本指令 (ls, cp, mv...)
├── etc/             # 設定檔
├── home/            # 使用者家目錄
│   └── student/     # 你的目錄在這裡
├── var/             # 可變資料 (log, cache...)
├── tmp/             # 暫存檔
├── usr/             # 使用者程式
└── root/            # root 使用者的家目錄`}</pre>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">/etc</p>
            <p className="text-slate-300">系統設定檔都在這裡</p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">/home</p>
            <p className="text-slate-300">一般使用者的家目錄</p>
          </div>
          <div className="bg-yellow-900/30 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold">/var/log</p>
            <p className="text-slate-300">系統日誌檔</p>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold">/tmp</p>
            <p className="text-slate-300">暫存檔（重開機會清空）</p>
          </div>
        </div>
      </div>
    ),
    notes: `休息回來，繼續。

Linux 有一個很重要的設計哲學：一切皆是檔案。不只是文字文件、圖片這些「檔案」，連設備、程序、網路連線在 Linux 裡都被視為檔案來操作。這個概念很強大，讓你可以用統一的方式操作所有東西。

Linux 的檔案系統是一個樹狀結構，頂端是根目錄 /（唸作 root）。所有東西都掛在這個樹下，包括硬碟、USB 隨身碟、網路磁碟，都掛載（mount）到這個樹的某個節點上。

幾個重要目錄：

/home：所有一般使用者的家目錄都在這裡。比如你的帳號是 student，你的家目錄就是 /home/student，縮寫成 ~ （tilde）。這是你登入後的預設位置，也是你有完整讀寫權限的地方。

/etc：系統設定檔都放在這裡。nginx 的設定、SSH 的設定、網路設定，幾乎所有服務的設定檔都在 /etc 裡，而且都是純文字格式，可以直接用編輯器修改。

/var：存放會隨時間變化的資料，最重要的是 /var/log，所有的系統和服務日誌都在這裡。除錯的時候第一件事就是看 log。

/tmp：暫存檔案放這裡，系統重開後會清空。

/usr：應用程式和使用者工具。/usr/bin 存放大部分指令的執行檔，/usr/lib 是函式庫。

記住這些目錄的位置，對你日後的 Linux 和 Kubernetes 操作非常有幫助。`,
    duration: "4"
  },

  // ========== 使用者與權限 ==========
  {
    title: "使用者與權限",
    subtitle: "誰可以做什麼事",
    section: "核心概念",
    content: (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-2xl font-bold text-red-400 mb-2">root</p>
            <p className="text-slate-300">系統管理員，擁有最高權限</p>
            <p className="text-yellow-400 text-sm mt-2">⚠️ 權力越大，責任越大</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-400 mb-2">一般使用者</p>
            <p className="text-slate-300">有限的權限，只能存取自己的檔案</p>
            <p className="text-green-400 text-sm mt-2">✓ 日常操作應該用這個</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="font-semibold text-k8s-blue mb-2">檔案權限表示法</p>
          <div className="font-mono text-lg">
            <span className="text-yellow-400">-rwx</span>
            <span className="text-green-400">r-x</span>
            <span className="text-blue-400">r--</span>
            <span className="text-slate-400 ml-4">檔案</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-slate-400">
            <span>擁有者權限</span>
            <span>群組權限</span>
            <span>其他人權限</span>
          </div>
        </div>
      </div>
    ),
    notes: `Linux 是一個多使用者系統，不同的人登入有不同的身份和權限。這個設計讓 Linux 非常安全，也讓多人共用同一台伺服器成為可能。

最重要的使用者是 root，這是系統管理員帳號，擁有最高權限，可以做任何事：讀取所有檔案、修改系統設定、刪除整個系統。所以有一句話：「權力越大，責任越大」。一般情況下，我們不直接用 root 登入，而是用一般帳號，需要高權限時用 sudo 指令暫時提升。這樣即使操作失誤，損害也被限制在一般使用者的權限範圍內。

每個檔案都有三組權限：
- 擁有者（owner）的權限
- 所屬群組（group）的權限  
- 其他人（others）的權限

每組權限由三個字元組成：r（read 讀取）、w（write 寫入）、x（execute 執行），減號代表沒有該權限。

執行 ls -l 可以看到檔案的詳細資訊，第一欄就是權限字串，比如：
-rwxr-xr-- 代表：普通檔案（-），擁有者有讀寫執行（rwx），群組有讀取和執行（r-x），其他人只能讀取（r--）。

在 Kubernetes 的世界裡，理解權限非常重要。容器裡的程序通常以特定使用者身份執行，掛載的檔案有特定的所有者，這些都和 Linux 的使用者權限模型直接相關。

在 Kubernetes 的世界裡，每個 Pod 裡的容器都有自己的使用者和權限設定。了解 Linux 使用者與權限的基礎，能幫助你理解為什麼某些容器操作需要特殊設定，以及如何排查權限相關的問題。`,
    duration: "4"
  },

  // ========== SSH 連線 ==========
  {
    title: "SSH 連線",
    subtitle: "遠端登入 Linux 主機",
    section: "實作準備",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-slate-300">
          SSH（Secure Shell）是一種加密的遠端連線協定
        </p>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># 連線語法</p>
          <code className="text-green-400 text-xl">
            ssh 使用者名稱@主機IP
          </code>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># 範例</p>
          <code className="text-green-400 text-xl">
            ssh student@192.168.1.100
          </code>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">💡 小提示</p>
          <p className="text-yellow-200">第一次連線會問你是否信任這台主機，輸入 yes 即可</p>
        </div>
      </div>
    ),
    notes: `現在我們要來實際動手了。要操作遠端的 Linux 主機，我們需要用 SSH 連線。

SSH 全名是 Secure Shell，是一種加密的遠端連線協定，讓你可以安全地連上遠端伺服器執行指令。「加密」很重要，代表你輸入的帳號密碼和執行的指令，在網路傳輸過程中是加密的，不會被中間人竊取。

連線語法非常簡單：ssh 使用者名稱@主機IP

比如帳號是 student、主機 IP 是 192.168.1.100，就輸入：ssh student@192.168.1.100

第一次連線到一台主機，SSH 會顯示主機的「指紋」（fingerprint），問你是否信任這台主機。這是防止中間人攻擊的機制，確認 IP 正確後輸入 yes 按 Enter。SSH 會把這台主機的指紋記住，以後連線就不會再問了。

輸入密碼時，畫面上不會顯示任何東西，連星號都沒有，這是正常的 Linux 安全機制。輸入完密碼直接按 Enter 就好。

登入成功後，命令提示字元會變成類似 student@hostname:~$ 的格式，代表你正式進入了 Linux 主機。$ 表示你是一般使用者，如果是 # 則表示 root。

想要登出，輸入 exit 或按 Ctrl+D，就會回到本地終端機。`,
    duration: "3"
  },

  // ========== 實作：登入 Linux ==========
  {
    title: "🔨 實作時間",
    subtitle: "登入你的第一台 Linux 主機",
    section: "動手做",
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># Step 1: 開啟終端機</p>
          <p className="text-slate-300">Windows: 搜尋「Terminal」或「PowerShell」</p>
          <p className="text-slate-300">Mac: 開啟「終端機」應用程式</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># Step 2: 輸入 SSH 指令</p>
          <code className="text-green-400">ssh student@[助教提供的IP]</code>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># Step 3: 輸入密碼</p>
          <p className="text-slate-300">密碼輸入時不會顯示，輸入完按 Enter</p>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">✓ 成功登入後會看到</p>
          <code className="text-slate-300">student@k8s-lab:~$</code>
        </div>
      </div>
    ),
    notes: `好，現在是今天最重要的環節：請大家跟著我一步一步操作，第一次登入 Linux 主機。

**Step 1：打開終端機**
Windows 用戶：在開始選單搜尋「Terminal」或「Windows 終端機」，點擊開啟。如果找不到，可以用 PowerShell 或 Command Prompt 替代。
Mac 用戶：在 Finder 打開「應用程式 → 工具程式 → 終端機」，或是直接 Spotlight 搜尋「Terminal」。
Linux 用戶：直接打開你習慣的終端機模擬器。

**Step 2：輸入 SSH 指令**
在終端機輸入：ssh student@[助教提供的IP位址]
請把方括號裡的部分換成助教給你的實際 IP。帳號固定是 student。按 Enter。

**Step 3：處理主機指紋確認**
第一次連線到這台主機，SSH 會顯示一段警告，問你：「Are you sure you want to continue connecting (yes/no)?」
這是正常的，輸入 yes 然後按 Enter。

**Step 4：輸入密碼**
輸入助教提供的密碼，注意密碼輸入時畫面不會有任何顯示，輸完直接按 Enter。如果密碼輸錯了，會提示 Permission denied，再試一次。

**Step 5：確認成功登入**
成功登入後，你會看到命令提示字元變成：student@hostname:~$
這表示你已經在 Linux 主機裡面了！~ 是你的家目錄 /home/student，$ 代表一般使用者身份。

**常見問題排查：**
如果出現 Connection timed out：IP 可能輸錯了，或是主機防火牆設定問題，舉手請助教確認。
如果出現 Permission denied (publickey)：SSH 設定問題，需要助教協助調整。
如果出現 REMOTE HOST IDENTIFICATION HAS CHANGED：代表主機指紋改變了（可能是重裝或換了不同主機），需要執行 ssh-keygen -R [IP] 清除舊記錄。

**操作確認時間（約 5 分鐘）：**
現在請大家自己操作。有問題舉手，助教會過去協助。等大家都登入成功後，我們繼續執行第一個 Linux 指令。登入成功的同學，可以先試試輸入 whoami 看看輸出什麼。

（巡視確認每位學員都成功登入）

太好了！大家都登入成功了。這是你們第一次真正進入 Linux 系統，從這個命令提示字元開始，你就是這台 Linux 主機的操作者了。

常見問題補充說明：

很多同學第一次用命令列會有點不習慣，因為打了指令之後沒有彩色的確認視窗，只是顯示一行結果（有時甚至沒有任何輸出）。這是正常的，Linux 的設計哲學是「沒有消息就是好消息」，成功執行就沒有提示，有問題才會顯示錯誤訊息。

關於密碼輸入：Linux 終端機在輸入密碼時不顯示任何字元（包括星號），這是刻意設計的安全機制，防止旁邊的人看到密碼長度。如果不確定有沒有在輸入，可以直接按 Enter 試試，輸入錯誤了再重新輸入。

登入成功的判斷：看到 student@hostname:~$ 這樣的提示字元就是成功了。~ 是你的家目錄的符號，$ 代表一般使用者。如果你看到 # 結尾，代表你是 root，要特別小心。`,
    duration: "10"
  },

  // ========== 第一個指令 ==========
  {
    title: "你的第一個 Linux 指令",
    section: "基礎指令",
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># 看看我是誰</p>
          <code className="text-green-400 text-xl">whoami</code>
          <p className="text-slate-500 mt-2">輸出: student</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># 我現在在哪裡</p>
          <code className="text-green-400 text-xl">pwd</code>
          <p className="text-slate-500 mt-2">輸出: /home/student</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 mb-2"># 這裡有什麼</p>
          <code className="text-green-400 text-xl">ls</code>
          <p className="text-slate-500 mt-2">輸出: (列出目錄內容)</p>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🎯 試試看！</p>
          <p>在你的終端機輸入這三個指令</p>
        </div>
      </div>
    ),
    notes: `大家都登入成功了，太棒了！現在讓我們來執行第一批 Linux 指令，感受一下命令列的操作方式。

**whoami — 我是誰**
輸入 whoami 按 Enter，Linux 會告訴你目前登入的使用者名稱。應該顯示 student。這個指令很簡單，但在 Kubernetes 的 debug 中很有用，確認你在容器裡以什麼身份在跑。

**pwd — 我在哪裡**
pwd 是 Print Working Directory 的縮寫，顯示你目前所在的完整路徑。應該顯示 /home/student，這是你的家目錄。在 Linux 裡，任何時候都要知道自己在哪個目錄，不然下指令很容易搞錯位置。

**ls — 這裡有什麼**
ls 是最常用的指令之一，列出當前目錄的內容，就像 Windows 的「開啟資料夾看裡面有什麼」。新建的使用者家目錄可能是空的或有少數幾個預設目錄。之後我們會學到 ls -l（顯示詳細資訊）、ls -a（顯示隱藏檔案）等變形。

**指令說明的使用方式**
忘記指令用法怎麼辦？有三個方法：
1. 指令 --help：比如 ls --help，快速顯示選項說明
2. man 指令：比如 man ls，打開完整的操作手冊（按 q 離開）
3. 直接 Google：「linux ls command examples」

現在大家把這三個指令都輸入一次，看看輸出。有沒有看到不一樣的結果，或是有疑問的地方？

（等待操作，回答問題）

這三個指令是 Linux 操作的起點，以後每次打開終端機，你的肌肉記憶就會自動先跑這幾個指令：whoami 確認身份，pwd 確認位置，ls 看目錄內容。`,
    duration: "5"
  },

  // ========== 常用指令預告 ==========
  {
    title: "常用指令預告",
    subtitle: "下堂課會學到",
    section: "預告",
    content: (
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { cmd: "ls", desc: "列出目錄內容" },
          { cmd: "cd", desc: "切換目錄" },
          { cmd: "pwd", desc: "顯示目前位置" },
          { cmd: "mkdir", desc: "建立目錄" },
          { cmd: "cp", desc: "複製檔案" },
          { cmd: "mv", desc: "移動/重新命名" },
          { cmd: "rm", desc: "刪除檔案" },
          { cmd: "cat", desc: "顯示檔案內容" },
        ].map((item, i) => (
          <div key={i} className="bg-slate-800/50 p-3 rounded-lg flex items-center gap-4">
            <code className="text-green-400 font-bold text-lg w-16">{item.cmd}</code>
            <span className="text-slate-300">{item.desc}</span>
          </div>
        ))}
      </div>
    ),
    notes: `這些是下午和明天會學到的常用指令，先讓大家有個印象，不用現在就記住。

ls 列出目錄內容、cd 切換目錄、pwd 顯示目前位置、mkdir 建立目錄、cp 複製檔案、mv 移動或重新命名、rm 刪除檔案、cat 顯示檔案內容。

這些指令名字都來自英文縮寫：cd 是 change directory，cp 是 copy，mv 是 move，rm 是 remove，cat 是 concatenate（串接），ls 是 list。記住縮寫來源，下次忘記指令名稱時更容易想起來。

下午的課我們會一個一個詳細講解並實際操作，今天先有個印象就好。這些基礎指令是所有 Linux 操作的起點，也是進入 Docker 和 Kubernetes 的前提。掌握了這些，你就具備了自主探索 Linux 世界的能力。`,
    duration: "2"
  },

  // ========== 課後作業 ==========
  {
    title: "課後練習",
    section: "作業",
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-k8s-blue mb-4">📝 回家作業</h3>
          <ol className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="bg-k8s-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
              <span>自己在家用 SSH 連線到練習主機</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-k8s-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
              <span>執行 whoami、pwd、ls 三個指令並截圖</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-k8s-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
              <span>（選擇性）閱讀課本第一章</span>
            </li>
          </ol>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">💡 遇到問題怎麼辦？</p>
          <p className="text-yellow-200">可以在課程 Line 群組發問，助教會盡快回覆</p>
        </div>
      </div>
    ),
    notes: `在下課前，我說明一下回家作業，分三個層次：

必做（所有人）：自己在家用 SSH 連線到練習主機，成功登入後執行 whoami、pwd、ls 三個指令，截圖保存。下次上課時我會確認大家完成。這個練習的目的是讓你熟悉 SSH 連線的完整流程，確保你在家也能自主操作。

選做（有興趣的）：閱讀課本第一章，預習 Linux 檔案系統和基本指令的部分。預習過的同學，下午的課會學得更快。

進階（想多學的）：在自己的電腦上用 WSL2（Windows 用戶）或虛擬機裝一個 Ubuntu，嘗試在本地環境練習今天學的東西，不用遠端連線也可以練。

如果回家練習遇到問題，不要卡著不動，在課程 Line 群組發問，助教會盡快回覆。學習過程遇到問題是正常的，重要的是不要放棄、積極求助。`,
    duration: "2"
  },

  // ========== 課程總結 ==========
  {
    title: "今日總結",
    section: "回顧",
    content: (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[
            { icon: "✅", text: "了解為什麼要學 Linux（伺服器、雲端、K8s）" },
            { icon: "✅", text: "知道 Linux 和 Windows 的主要差異" },
            { icon: "✅", text: "認識 Linux 檔案系統結構" },
            { icon: "✅", text: "理解使用者與權限的概念" },
            { icon: "✅", text: "成功用 SSH 連線到 Linux 主機" },
            { icon: "✅", text: "執行了第一個 Linux 指令" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `讓我們來回顧一下今天學到的內容。

我們了解了為什麼要學 Linux：它是伺服器、雲端、容器技術的基礎，也是職場中越來越重要的技能。

我們比較了 Linux 和 Windows 的差異：授權方式、操作介面、路徑語法、軟體安裝方式都不同。

我們認識了 Linux 的檔案系統結構：根目錄 /、家目錄 /home、設定檔目錄 /etc、日誌目錄 /var/log 等重要位置。

我們理解了使用者與權限的概念：root 是最高管理員，一般使用者用 sudo 提升權限，每個檔案有擁有者、群組、其他人的三組讀寫執行權限。

最重要的：我們成功用 SSH 連線到 Linux 主機，並且執行了第一批 Linux 指令！

這是你進入 Linux 世界的第一步。從這裡開始，我們會一點一點建立更完整的能力，最終達到管理 Kubernetes 叢集的目標。很棒的開始！`,
    duration: "2"
  },

  // ========== 下堂課預告 ==========
  {
    title: "下堂課預告",
    subtitle: "Linux 基本操作",
    section: "預告",
    content: (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <p className="text-slate-400">下午 13:00 - 16:00</p>
        </div>
        <div className="grid gap-4">
          {[
            "檔案系統導覽與操作",
            "基本指令操作 (ls, cd, pwd, mkdir)",
            "nano 編輯器使用",
            "實作：建立自己的檔案和目錄",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
              <span className="text-k8s-blue text-2xl">{i + 1}</span>
              <p className="text-lg">{item}</p>
            </div>
          ))}
        </div>
        <div className="text-center text-slate-400 mt-8">
          <p>中午好好休息，下午見！ 👋</p>
        </div>
      </div>
    ),
    notes: `下堂課是下午 1 點到 4 點，我們會繼續學習 Linux 基本操作。

第一部分是檔案系統導覽和操作，我們會學習在目錄之間移動（cd）、建立和刪除檔案（mkdir、rm）、複製和移動（cp、mv）。

第二部分是 nano 編輯器，這是終端機裡最簡單的文字編輯器，讓你可以直接修改設定檔，不需要圖形介面。

第三部分是實作時間，讓大家動手建立自己的目錄結構，編輯一個設定檔，體驗完整的 Linux 操作流程。

中午好好休息，吃個飯，補充體力，下午精神好才能學得好。今天上午的課到這裡，有問題現在可以提，沒問題的話我們就下課了，下午 1 點見！`,
    duration: "2"
  },

  // ========== Q&A ==========
  {
    title: "Q & A",
    subtitle: "有任何問題嗎？",
    content: (
      <div className="text-center space-y-8">
        <p className="text-8xl">🙋‍♀️ 🙋 🙋‍♂️</p>
        <p className="text-2xl text-slate-300">
          現在是發問時間，有任何問題都可以提出來
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400 mb-2">聯絡方式</p>
          <p className="text-xl">課程 Line 群組 | 助教信箱</p>
        </div>
      </div>
    ),
    notes: `好，現在是開放提問時間。不管是今天上課的任何內容，還是對整個課程的疑問，都歡迎提出來。

以下是一些常見問題的預答，如果你正好有這些疑問，希望有幫助：

問：課程結束後，我需要有自己的 Linux 主機嗎？
答：不一定。練習主機在課程期間都可以繼續使用。如果想長期練習，可以考慮：用 WSL2（Windows 用戶免費）在本地跑 Linux；或是租用雲端 VM，AWS、GCP、Azure 都有免費方案；或在自己電腦上裝 VirtualBox 虛擬機。

問：學完這個課程，我能做什麼工作？
答：掌握 Linux + Docker + Kubernetes 是進入 DevOps、SRE（可靠性工程師）、雲端工程師、後端工程師等職位的重要加分項。很多公司的 JD 都會列 Kubernetes 經驗為加分或必要條件。

問：這門課有多難？我擔心跟不上。
答：這門課從零基礎設計，只要跟著做，動手練習，一定能學會。遇到卡關請立刻問，不要拖到下一堂課。

問：之後有什麼學習資源推薦？
答：官方文件是最好的資源：Kubernetes.io、Docker Docs。書籍推薦：《The Linux Command Line》（有中譯本）。網路資源：LinuxCommand.org、Linux Journey。

還有其他問題嗎？歡迎繼續提問。如果課後想到問題，記得在 Line 群組發問，或者下午的課上提出來都可以。

課程 Line 群組的使用：課後有問題可以在群組發問，助教會在 24 小時內回覆。發問時請附上你輸入的指令和完整的錯誤訊息，這樣才能幫你快速找到問題所在。記得把錯誤截圖或複製貼上，只說「跑不動」我們很難幫你除錯。

感謝大家今天的參與，下午見！

【預期難搞學員問題 — 第一堂早上】

Q：你說 Container 像「輕量 VM」，但這個比喻不精確吧？Container 根本不虛擬化硬體，只是 namespace 加 cgroup 的組合。

A：這個批評非常到位！「輕量 VM」確實是一個入門友善但不嚴謹的比喻。精確的說法是：Container 是利用 Linux Kernel 的 namespace（隔離程序、網路、掛載點）和 cgroup（限制資源使用）機制，讓多個應用程式在同一個 OS 核心上互相隔離運行。它跟 VM 的本質差異在於：VM 虛擬化的是「硬體」，每個 VM 有自己的 OS kernel；Container 虛擬化的是「作業系統層」，共享宿主機的 kernel。如果有學員之後去面試，這個精確解釋會讓面試官印象深刻。

Q：docker run -d 的 -d detach 模式為什麼要加？不加的話會怎樣？

A：非常好的問題！不加 -d 的話，容器的 stdout/stderr 會直接輸出到你的終端機，而且 Ctrl+C 或關掉視窗就會停止容器。加了 -d 之後，容器在背景執行，你的終端機繼續可以使用。開發時偶爾不加 -d 方便直接看 log，正式環境或長時間運行的服務一定要加 -d。搭配 docker logs <container> 可以隨時查看背景容器的輸出。

Q：Docker Hub 上的 Image 都可以信任嗎？有沒有安全疑慮？

A：這是一個很重要的問題！Docker Hub 上的 Image 來源良莠不齊。使用原則：優先選 Official Image（官方標籤，由 Docker 或軟體官方維護）；其次是 Verified Publisher（已驗證的發行商）；避免使用來路不明的個人 Image，尤其是下載量很少的。正式環境建議使用私有 Registry（如 AWS ECR、GCR、Harbor），並定期掃描 Image 漏洞（使用 docker scout 或 Trivy）。
`,
    duration: "5"
  },
]
