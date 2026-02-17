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
    notes: `大家好，歡迎來到 Kubernetes 入門課程的第一堂課。

我是今天的講師謝智宇，旁邊這位是助教陳彥彤，如果有任何問題都可以舉手發問，或者找助教協助。

在正式開始 Kubernetes 之前，我們需要先打好基礎。今天的主題是 Linux 操作入門，為什麼要先學 Linux 呢？因為 Kubernetes 是建構在 Linux 之上的，所有的容器、Pod 都是在 Linux 環境中執行。

今天我們會花 3 個小時，從最基本的概念開始，帶大家認識 Linux 這個作業系統。`,
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
    notes: `讓我們先看一下今天的課程安排。

前半小時我們會做一些破冰活動，同時確認大家的學習環境是否都準備好。

接著我們會討論為什麼要學 Linux，這很重要，因為理解「為什麼」會讓學習更有動力。

然後我們會深入比較 Linux 和 Windows 的差異，這對從 Windows 轉換過來的同學特別有幫助。

中間會有 15 分鐘休息，大家可以上廁所、喝水。

下半場我們會介紹 Linux 的核心概念，最後留時間讓大家實際操作，登入一台 Linux 系統。`,
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
    notes: `好，在正式上課之前，我想先認識一下大家。

請大家輪流做個簡短的自我介紹，不用太正式，就是聊聊天的方式。

可以分享你的名字、目前做什麼工作、為什麼想來學 Kubernetes、以及有沒有用過 Linux。

這樣我可以更了解大家的背景，後面上課的時候可以調整講解的深度。

那我們從這邊開始，一個一個來，每個人大約 30 秒就好。

（等待學員自我介紹）

好的，很高興認識大家！我發現有些同學已經有一些 Linux 經驗，有些同學是完全新手，沒關係，我們會從頭開始講。`,
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
    notes: `在開始之前，我們先確認一下大家的環境都準備好了。

首先，你需要一台可以上網的電腦，Windows 或 Mac 都可以。

第二，你需要一個 SSH 連線工具。如果你用 Windows 10 或 11，內建的 Terminal 或 PowerShell 就可以用了。如果是舊版 Windows，可以裝 PuTTY。Mac 的話直接開 Terminal 就好。

第三，等一下助教會發給大家一組 Linux 主機的 IP 位址和登入帳號密碼。

最後，也是最重要的，就是保持一顆好奇的心！學 Linux 一開始可能會覺得有點陌生，但只要願意動手試，很快就會上手。

如果有任何環境問題，現在就可以舉手，助教會過去幫忙。`,
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
    notes: `好，讓我們正式進入主題。Linux 到底是什麼？

Linux 是一個開源的作業系統核心，由一位芬蘭大學生 Linus Torvalds 在 1991 年創造的。

有趣的是，他最初只是想學習作業系統怎麼運作，所以自己寫了一個。他把原始碼公開到網路上，結果全世界的程式設計師都跑來幫忙改進，30 多年後的今天，Linux 已經成為全球最重要的作業系統之一。

Linux 的名字其實是 Linus + Unix 的組合。因為它是基於 Unix 的設計哲學來開發的。

這裡要特別說明一下，嚴格來說，Linux 只是作業系統的「核心」，也就是 kernel。我們平常說的 Linux 作業系統，其實是 Linux kernel 加上其他工具程式組合而成的。`,
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
    notes: `現在讓我們來比較 Linux 和 Windows 的差異。

第一個差異是授權方式。Linux 是開源免費的，任何人都可以下載、使用、修改。Windows 是商業軟體，需要購買授權。這也是為什麼大部分伺服器都選擇 Linux，因為可以省下大量的授權費用。

第二個差異是操作介面。Windows 主要靠滑鼠點選圖形介面，而 Linux 傳統上是用命令列操作。雖然現在 Linux 也有圖形介面，但在伺服器環境，我們幾乎都是用命令列。

第三個差異是檔案系統。Windows 用的是 NTFS，Linux 常用的有 ext4、xfs 等。

第四個差異是路徑的寫法。Windows 用反斜線 backslash 來分隔資料夾，而且通常有 C 槽、D 槽這種概念。Linux 用正斜線 slash，而且整個系統只有一個根目錄，用斜線開頭。

最後一個很重要的差異是大小寫。Linux 區分大小寫，File.txt 和 file.txt 是兩個不同的檔案。Windows 不區分，這兩個會被當成同一個檔案。`,
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
    notes: `你可能會想，都 2025 年了，為什麼還要用命令列？用滑鼠點點不是更方便嗎？

讓我解釋一下為什麼伺服器環境幾乎都用命令列。

首先，圖形介面需要消耗大量資源。你的桌面那些漂亮的視窗、動畫，都需要顯示卡和記憶體來運算。伺服器要處理的是客戶的請求，不是顯示漂亮的畫面，所以這些資源應該用在更有價值的地方。

第二，遠端操作的效率。如果你用遠端桌面連線，畫面要一直傳輸，延遲很高。但如果用命令列，傳輸的只是文字，幾乎感覺不到延遲。

第三，自動化。你可以把一系列指令寫成腳本，一鍵執行。圖形介面的操作很難自動化，總不能讓電腦自己移動滑鼠吧？

最後，可複製性。你做了什麼操作，指令都可以記錄下來，放到版本控制系統裡，其他人可以重現你的步驟。`,
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
    notes: `剛剛說過，Linux 嚴格來說只是一個核心。把核心加上各種工具程式、圖形介面、套件管理系統，打包在一起，就成了一個發行版，英文叫 Distribution，簡稱 distro。

主要的發行版可以分成幾個家族：

Red Hat 系列是企業界最常用的，RHEL 是正式的企業版，要付費的。CentOS 以前是 RHEL 的免費版，但後來 Red Hat 改變政策，社群就另外做了 Rocky Linux 來接替。Fedora 則是 Red Hat 的實驗版，會有比較新的功能。

Debian 系列在開發者社群很流行，Ubuntu 是基於 Debian 的，因為它比較容易安裝和使用，所以很多人學 Linux 都是從 Ubuntu 開始。

其他還有 Arch Linux，它的特色是非常精簡，讓你從零開始自己組裝系統。Alpine 則是特別輕量，常用在容器裡面。

我們這門課會使用 Ubuntu 22.04 LTS。LTS 是 Long Term Support 的意思，代表官方會長期維護這個版本。`,
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
    notes: `好，我們已經上了一個小時左右了，讓我們休息一下。

休息 15 分鐘，大家可以上廁所、倒杯水、伸展一下。

等一下回來，我們會進入 Linux 的核心概念，然後讓大家實際登入 Linux 系統操作。

10:45 準時開始，請大家不要走太遠。`,
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
    notes: `休息回來，讓我們繼續。

Linux 有一個很重要的設計哲學：一切都是檔案。不只是文件是檔案，連硬碟、鍵盤、網路介面，在 Linux 看來都是檔案。

Linux 的檔案系統是一個樹狀結構，最頂端是根目錄，用一個斜線表示。

讓我介紹幾個重要的目錄：

bin 目錄放的是基本指令，像是 ls、cp、mv 這些。

etc 目錄放的是系統設定檔，以後我們改設定都會在這裡操作。

home 目錄是一般使用者的家目錄。每個使用者在這裡有自己的資料夾。比如你的帳號是 student，那你的家目錄就是 /home/student。

var 目錄放的是可變資料，最常用到的是 /var/log，系統日誌都在這裡。

tmp 是暫存目錄，重開機會被清空。

root 目錄是系統管理員 root 使用者的家目錄，注意它不在 /home 下面。`,
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
    notes: `Linux 是一個多使用者系統，不同的人登入有不同的權限。

最重要的使用者是 root，這是系統管理員帳號，擁有最高權限，可以做任何事情。包括刪除整個系統！所以我們有一句話：權力越大，責任越大。

日常操作我們會使用一般使用者帳號，只有在需要的時候才切換到 root 權限。

每個檔案都有權限設定，決定誰可以讀取、寫入、執行。

這串字母看起來可能很複雜，讓我解釋一下。第一個字元表示檔案類型，減號表示一般檔案，d 表示目錄。

接下來每三個字元一組。rwx 代表讀取 read、寫入 write、執行 execute。第一組是檔案擁有者的權限，第二組是所屬群組的權限，第三組是其他人的權限。

減號表示沒有那個權限。比如 r-- 就是只能讀取，不能寫入也不能執行。`,
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
    notes: `現在我們要來實際操作了。要操作遠端的 Linux 主機，我們需要用 SSH 連線。

SSH 全名是 Secure Shell，是一種加密的連線方式。你在網路上傳輸的帳號密碼都會被加密，不會被別人竊聽。

連線的語法很簡單，ssh 空格 使用者名稱 小老鼠 主機 IP。

比如說，如果你的帳號是 student，主機 IP 是 192.168.1.100，那指令就是 ssh student@192.168.1.100。

第一次連線的時候，系統會問你是否信任這台主機，因為它會記住這台主機的指紋。這是為了防止中間人攻擊。正常情況下輸入 yes 就可以了。

然後它會要求你輸入密碼。注意，輸入密碼的時候畫面上不會顯示任何東西，連星號都沒有，這是正常的，輸入完按 Enter 就好。`,
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
    notes: `好，現在請大家跟著我一起做。

首先，打開你的終端機。Windows 用戶可以在開始選單搜尋 Terminal 或 PowerShell。Mac 用戶打開終端機應用程式。

然後輸入 SSH 指令，把 IP 換成助教給你的那個。帳號是 student。

輸入之後按 Enter，第一次連線會問你要不要信任這台主機，輸入 yes 按 Enter。

接著輸入密碼，記得密碼不會顯示在畫面上，這是正常的，輸入完直接按 Enter。

成功登入後，你會看到命令提示字元變成 student@k8s-lab:~$，這表示你已經連上 Linux 主機了！

如果遇到任何問題，請舉手，助教會過去協助。

（等待學員操作，巡視協助）`,
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
    notes: `大家都登入成功了嗎？太好了！

現在讓我們來執行第一個 Linux 指令。

第一個指令是 whoami，就是「我是誰」的意思。輸入 whoami 按 Enter，它會告訴你現在登入的使用者名稱。

第二個指令是 pwd，全名是 print working directory，顯示你現在在哪個目錄。應該會顯示 /home/student，這是你的家目錄。

第三個指令是 ls，這是最常用的指令之一，用來列出目錄的內容。就像 Windows 的「開啟資料夾」看到裡面有什麼檔案。

大家現在就在自己的終端機試試看這三個指令。

（等待學員操作）

有沒有人跑出不一樣的結果？或是有錯誤訊息？`,
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
    notes: `這些是下堂課會學到的常用指令，讓大家先有個印象。

ls 列出目錄內容，cd 切換目錄，pwd 顯示目前位置，mkdir 建立新目錄，cp 複製檔案，mv 移動或重新命名檔案，rm 刪除檔案，cat 顯示檔案內容。

這些指令都是由英文單字縮寫來的。比如 cd 是 change directory，cp 是 copy，mv 是 move，rm 是 remove。

下堂課我們會一個一個詳細講解，並且實際操作。所以今天不用急著記住，有個印象就好。`,
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
    notes: `在今天下課之前，我來說明一下回家作業。

第一，請大家回家後自己再用 SSH 連線一次練習主機，確保你熟悉這個流程。

第二，連線成功後，執行我們剛才教的三個指令：whoami、pwd、ls，然後截圖。這個截圖請保留好，下次上課會用到。

第三，如果有時間的話，可以先閱讀一下課本的第一章，對下堂課會有幫助。

如果回家練習的時候遇到任何問題，可以在課程的 Line 群組發問，助教會盡快回覆。不要一個人卡住，有問題就問！`,
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

我們了解了為什麼要學 Linux，因為它是伺服器、雲端、容器技術的基礎。

我們比較了 Linux 和 Windows 的差異，包括授權方式、操作介面、檔案系統、路徑寫法等等。

我們認識了 Linux 的檔案系統結構，知道根目錄、家目錄、設定檔目錄在哪裡。

我們理解了使用者與權限的概念，知道 root 是最高管理員，也知道如何看懂檔案權限。

最重要的是，我們成功用 SSH 連線到 Linux 主機，並且執行了第一個指令！

這是很棒的開始，你們已經正式踏入 Linux 的世界了。`,
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

我們會學習檔案系統的導覽和操作，怎麼在目錄之間移動，怎麼建立和刪除檔案。

然後會教大家使用 nano 編輯器，這是一個簡單好用的文字編輯器，讓你可以直接在終端機裡面編輯檔案。

最後會有實作時間，讓大家動手建立自己的檔案和目錄結構。

中午好好休息，吃個飯，下午精神好才能學得好。

今天上午的課就到這裡，大家有任何問題嗎？

（回答問題）

好，沒問題的話我們就下課了，下午見！`,
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
    notes: `好的，現在開放提問。

不管是今天上課的內容，還是對後續課程的問題，都歡迎提出來。

如果課後想到問題，也可以在 Line 群組發問，或是寫信給助教。

（等待並回答問題）`,
    duration: "5"
  },
]
