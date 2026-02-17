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
  // ========== 開場 ==========
  {
    section: '第三堂下午',
    title: 'Dockerfile 與 Docker Compose',
    subtitle: '從零打包映像檔，到多容器應用部署',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-4xl">
            🐳
          </div>
          <div>
            <p className="text-2xl font-semibold">第三堂下午</p>
            <p className="text-slate-400">13:00 – 17:00（240 分鐘）</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          {[
            { label: '上半場', value: 'Dockerfile & docker build' },
            { label: '下半場', value: 'Docker Compose & 多容器應用' },
            { label: '講師', value: '謝智宇' },
            { label: '助教', value: '陳彥彤' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-blue-400 font-semibold">{item.label}</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `好，大家午餐吃得還好嗎？希望大家精神飽滿，因為下午的內容非常精彩，也是整個課程裡最實用的一段。

早上我們打好了 Docker 的觀念基礎，知道容器是什麼、怎麼跑一個現成的映像檔。但你們有沒有想過：那些映像檔是從哪裡來的？別人的 Node.js 專案、Python 爬蟲、Go 後端，怎麼變成一個可以直接跑的 Docker 映像檔？答案就是今天上半場的主角：Dockerfile。

下午的課分兩大塊。上半場三個主題：第一是 Dockerfile 的語法和撰寫方式，學怎麼把你自己的程式打包成映像檔；第二是 docker build 實作，了解 Layer Cache 的原理，學會怎麼讓 build 更快；第三是 Multi-stage Build，這是一個讓映像檔變小的進階技巧，在生產環境非常重要。中間休息 15 分鐘。下半場也是三個主題：Docker Compose 的語法和結構、常用指令操作，最後是多容器應用實戰，我們會把 frontend、backend、database 三個服務用 Compose 串在一起跑起來，這也是現代開發最常見的本地環境架構。

今天的內容都很有實際應用價值。不管你是要在公司導入 Docker，還是準備繼續學 Kubernetes，這些都是必備的技能。好，我們開始！`,
  },

  // ========== 課程大綱 ==========
  {
    title: '今日下午課程大綱',
    section: '課程總覽',
    duration: '2',
    content: (
      <div className="grid gap-3">
        {[
          { time: '13:00–13:05', topic: '開場與回顧', icon: '🎯' },
          { time: '13:05–13:35', topic: 'Dockerfile 基礎語法', icon: '📄' },
          { time: '13:35–14:00', topic: 'docker build 實作：Layer Cache & .dockerignore', icon: '🔨' },
          { time: '14:00–14:20', topic: 'Multi-stage Build：縮小映像檔', icon: '✂️' },
          { time: '14:20–14:35', topic: '休息時間', icon: '☕' },
          { time: '14:35–15:05', topic: 'Docker Compose 入門', icon: '🗂️' },
          { time: '15:05–15:30', topic: 'docker-compose 指令實作', icon: '⚙️' },
          { time: '15:30–16:00', topic: '多容器應用實戰', icon: '🏗️' },
          { time: '16:00–16:20', topic: '課程總結與 Q&A', icon: '🎓' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 px-4 py-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-blue-400 text-xs">{item.time}</p>
              <p className="text-base">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `這是今天下午的時間安排，讓大家心裡有個底。

整個下午 240 分鐘分成兩大段，中間有一段 15 分鐘的休息。上半場專注在 Dockerfile 的撰寫和映像檔 build 的技巧；下半場進入 Docker Compose 和多容器應用的實戰。

時間上我們會盡量照這個安排走，但實作環節可能會根據大家的進度做調整。如果某個部分有人卡住，我們可以稍微延長討論時間，不用擔心。有問題隨時提出來，不要悶著等我問你。

特別說明一下：今天會有大量的實際操作，每個主題後面都有動手練習。光聽我講是學不會的，一定要自己動手打指令、跑看看，才能真正記住。有遇到錯誤很正常，看懂錯誤訊息也是學習的一部分。準備好了嗎？開始！`,
  },

  // ========== Dockerfile 是什麼 ==========
  {
    title: 'Dockerfile 是什麼？',
    section: 'Dockerfile 基礎',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-5 rounded-lg">
          <p className="text-xl text-slate-200">
            Dockerfile 是一個<span className="text-blue-400 font-bold">純文字指令檔</span>，
            描述如何一步一步建立 Docker 映像檔
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-3xl mb-2">📄</p>
            <p className="font-bold text-blue-400">Dockerfile</p>
            <p className="text-slate-400 text-sm">建立指令</p>
          </div>
          <div className="flex items-center justify-center text-3xl text-blue-400">→</div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-3xl mb-2">📦</p>
            <p className="font-bold text-green-400">Image</p>
            <p className="text-slate-400 text-sm">映像檔（唯讀）</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">💡 核心思想</p>
          <p className="text-yellow-200">把「如何安裝/設定你的應用程式」的步驟，用程式碼記錄下來 → Infrastructure as Code</p>
        </div>
      </div>
    ),
    notes: `我們先來搞清楚 Dockerfile 到底是什麼。

最簡單的理解方式：Dockerfile 就是一份「食譜」。它告訴 Docker：要做出這道菜（映像檔），你需要哪些食材（基底映像），要做哪些步驟（安裝套件、複製檔案、設定環境），最後端出什麼成品（容器啟動時執行的指令）。

在沒有 Docker 的年代，要把一個應用程式部署到新伺服器，你需要：先安裝作業系統、安裝執行環境（Node.js、Python、JDK...）、安裝相依套件、複製程式碼、設定環境變數，每一步都可能出錯，每台伺服器都要重做一遍，常常搞得「我電腦上可以，到你那就掛掉」。

有了 Dockerfile，這些步驟被固定在一個文字檔裡，任何人、任何機器執行 docker build，都能得到完全相同的映像檔。這就是「Infrastructure as Code」的精神：把基礎設施的設定，用程式碼的方式管理，可以版本控制、可以審查、可以重現。

Dockerfile 的語法非常簡單，每一行都是「指令 + 參數」的格式。接下來我們逐一認識最重要的幾個指令。`,
  },

  // ========== FROM, RUN, COPY ==========
  {
    title: 'FROM、RUN、COPY',
    subtitle: '最常用的三個指令',
    section: 'Dockerfile 基礎',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># 基礎映像：從哪裡出發</p>
          <p><span className="text-blue-400 font-bold">FROM</span> <span className="text-green-400">node:18-alpine</span></p>
          <p className="mt-3 text-slate-500"># 在映像檔內執行 Shell 指令</p>
          <p><span className="text-blue-400 font-bold">RUN</span> <span className="text-yellow-300">npm install -g pnpm</span></p>
          <p className="mt-3 text-slate-500"># 從 host 把檔案複製進去</p>
          <p><span className="text-blue-400 font-bold">COPY</span> <span className="text-orange-400">package.json .</span></p>
          <p><span className="text-blue-400 font-bold">COPY</span> <span className="text-orange-400">src/ ./src/</span></p>
        </div>
        <div className="grid gap-3">
          {[
            { cmd: 'FROM', color: 'blue', desc: '指定基底映像（必填，必須是第一行）' },
            { cmd: 'RUN', color: 'yellow', desc: '在 build 階段執行指令，結果會被 commit 成新 layer' },
            { cmd: 'COPY', color: 'orange', desc: '把 host 上的檔案複製到映像檔內' },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg`}>
              <code className={`text-${item.color}-400 font-bold w-16 shrink-0`}>{item.cmd}</code>
              <p className="text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `現在來看 Dockerfile 最常用的三個指令：FROM、RUN、COPY。

FROM 是每個 Dockerfile 的第一行，也是唯一必填的指令，用來指定基底映像（base image）。你不需要從空白的 Linux 系統開始，Docker Hub 上有各種官方映像可以直接用，比如 node:18-alpine 就是已經裝好 Node.js 18 的 Alpine Linux 環境，ubuntu:22.04 是乾淨的 Ubuntu，python:3.11-slim 是精簡版的 Python 環境。選對基底映像能省去很多安裝步驟。

Alpine 是一個極度精簡的 Linux 發行版，只有幾 MB，很適合用來做容器基底，讓映像檔更小。加了 slim 或 alpine 後綴的官方映像，都是官方提供的精簡版本。

RUN 指令是在 build 時期執行 Shell 指令。安裝套件、建立目錄、設定權限，這些都用 RUN 來做。每個 RUN 指令會在映像檔裡形成一個新的 layer，這個很重要，後面講 cache 時會深入說明。常見做法是把相關的指令合併在同一個 RUN 裡，用 && 串接，避免產生太多 layer。

COPY 是把你本地（host）的檔案或目錄複製到映像檔裡面。語法是 COPY 來源 目標，來源是相對於 Dockerfile 所在目錄的路徑，目標是映像檔內的路徑。這是把你的應用程式程式碼放進映像檔的主要方式。

這三個指令組合起來，已經能寫出一個基本可用的 Dockerfile 了。接下來再學幾個指令，讓 Dockerfile 更完整。`,
  },

  // ========== WORKDIR, EXPOSE, CMD, ENTRYPOINT ==========
  {
    title: 'WORKDIR、EXPOSE、CMD、ENTRYPOINT',
    subtitle: '目錄、埠口與啟動指令',
    section: 'Dockerfile 基礎',
    duration: '9',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
          <p><span className="text-purple-400 font-bold">WORKDIR</span> <span className="text-slate-300">/app</span></p>
          <p className="text-slate-500 text-xs mt-1 mb-3"># 設定工作目錄，後續指令都在此執行</p>
          <p><span className="text-cyan-400 font-bold">EXPOSE</span> <span className="text-slate-300">3000</span></p>
          <p className="text-slate-500 text-xs mt-1 mb-3"># 文件用：宣告容器監聽的埠口</p>
          <p><span className="text-green-400 font-bold">CMD</span> <span className="text-slate-300">["node", "server.js"]</span></p>
          <p className="text-slate-500 text-xs mt-1 mb-3"># 容器啟動時的預設指令（可被覆蓋）</p>
          <p><span className="text-orange-400 font-bold">ENTRYPOINT</span> <span className="text-slate-300">["node"]</span></p>
          <p className="text-slate-500 text-xs mt-1"># 容器的主程式（通常不被覆蓋）</p>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold">CMD vs ENTRYPOINT</p>
          <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
            <div>
              <p className="text-green-400">CMD</p>
              <p className="text-slate-300">可被 docker run 的參數覆蓋</p>
            </div>
            <div>
              <p className="text-orange-400">ENTRYPOINT</p>
              <p className="text-slate-300">固定執行，參數附加在後面</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `繼續看剩下四個重要指令：WORKDIR、EXPOSE、CMD、ENTRYPOINT。

WORKDIR 是設定工作目錄，類似 Linux 的 cd 指令，但它同時也會在不存在時自動建立這個目錄。設定 WORKDIR 之後，後面所有的 RUN、COPY、CMD 等指令，都預設在這個目錄下執行。最常見的做法是在 Dockerfile 裡設定 WORKDIR /app，把應用程式都放在 /app 目錄下，結構清晰、路徑固定。

EXPOSE 用來宣告容器內部會使用的網路埠口。注意：EXPOSE 只是文件性的宣告，它本身不做任何端口映射，不會讓 host 能直接存取這個埠口。實際的端口映射要在執行 docker run 時用 -p 參數指定。但寫上 EXPOSE 有兩個好處：一是讓閱讀 Dockerfile 的人知道這個容器預計使用哪個埠口；二是在 docker run 使用 -P（大寫 P）時，Docker 會自動把 EXPOSE 的埠口對應到隨機的 host 埠口。

CMD 是容器啟動時執行的預設指令。一個 Dockerfile 只能有一個有效的 CMD，如果寫多個，只有最後一個生效。CMD 的特色是可以被 docker run 後面的參數覆蓋，所以它是「預設值」的概念。

ENTRYPOINT 則是容器的主程式，比 CMD 更硬性。當你設定了 ENTRYPOINT，docker run 後面的參數會變成 ENTRYPOINT 的附加參數，而不是取代它。一個常見的搭配是把 ENTRYPOINT 設成主程式（比如 node），把 CMD 設成預設的腳本路徑（比如 server.js），這樣你可以很方便地切換要執行的腳本，但又確保一定是用 node 來跑。

記住：推薦用 JSON array 格式（方括號、雙引號），也就是 exec 格式，這樣不會經過 shell 包裝，訊號傳遞更直接，容器的 PID 1 就是你的程式，而不是 sh。`,
  },

  // ========== 完整 Dockerfile 範例 ==========
  {
    title: '完整 Dockerfile 範例',
    subtitle: 'Node.js 應用程式',
    section: 'Dockerfile 基礎',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm leading-relaxed">
          <p className="text-slate-500"># 1. 基底映像</p>
          <p><span className="text-blue-400">FROM</span> <span className="text-green-400">node:18-alpine</span></p>
          <p className="mt-2 text-slate-500"># 2. 工作目錄</p>
          <p><span className="text-purple-400">WORKDIR</span> /app</p>
          <p className="mt-2 text-slate-500"># 3. 先複製 package.json（利用 cache）</p>
          <p><span className="text-blue-400">COPY</span> package*.json ./</p>
          <p><span className="text-blue-400">RUN</span> npm ci --only=production</p>
          <p className="mt-2 text-slate-500"># 4. 複製程式碼</p>
          <p><span className="text-blue-400">COPY</span> . .</p>
          <p className="mt-2 text-slate-500"># 5. 宣告埠口</p>
          <p><span className="text-cyan-400">EXPOSE</span> 3000</p>
          <p className="mt-2 text-slate-500"># 6. 啟動指令</p>
          <p><span className="text-green-400">CMD</span> ["node", "server.js"]</p>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">💡 注意順序</p>
          <p className="text-yellow-200">先 COPY package.json → RUN npm install → 再 COPY 其他程式碼，才能善用 cache！</p>
        </div>
      </div>
    ),
    notes: `好，現在我們把前面學的指令組合成一個完整的 Dockerfile，用一個真實的 Node.js 應用程式作為範例。

首先，FROM node:18-alpine 選定 Node.js 18 的 Alpine 版本作為基底，這個映像已經包含了 Node.js 和 npm，不需要再手動安裝。

接著 WORKDIR /app 設定工作目錄，後面所有指令都在 /app 下執行。

然後是一個關鍵技巧：先只複製 package.json 和 package-lock.json，執行 npm ci 安裝相依套件，再複製其他的程式碼。為什麼這樣做？因為 Docker 的 layer cache 機制！npm install 是整個 build 過程中最耗時的步驟，如果你的 package.json 沒有變更，Docker 會直接用之前 cache 住的 layer，不需要重新安裝套件。但如果你把 COPY . . 放在 npm install 之前，只要任何一個源碼檔案有改動，就會讓 npm install 的 cache 失效，每次 build 都要重新裝套件，非常慢。

npm ci 比 npm install 更適合在 CI/CD 和 Dockerfile 中使用，因為它嚴格按照 package-lock.json 安裝，速度更快也更穩定。--only=production 或 --omit=dev 則是跳過 dev dependencies，讓映像檔更小。

最後 EXPOSE 3000 宣告埠口，CMD 設定啟動指令。

現在請大家在自己的電腦上建立一個資料夾，新增一個這樣的 Dockerfile，我們等一下會用這個來做 docker build 的實作。`,
  },

  // ========== docker build 基礎 ==========
  {
    title: 'docker build 實作',
    subtitle: '從 Dockerfile 建立映像檔',
    section: 'docker build 實作',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># 基本語法</p>
          <p><span className="text-green-400">docker build</span> <span className="text-yellow-300">-t myapp:1.0</span> <span className="text-orange-400">.</span></p>
          <p className="mt-4 text-slate-500"># 常用選項</p>
          <p><span className="text-green-400">docker build</span></p>
          <p className="pl-4"><span className="text-yellow-300">-t myapp:latest</span>  <span className="text-slate-400"># 標記名稱:版本</span></p>
          <p className="pl-4"><span className="text-yellow-300">-f Dockerfile.prod</span> <span className="text-slate-400"># 指定 Dockerfile</span></p>
          <p className="pl-4"><span className="text-yellow-300">--no-cache</span>        <span className="text-slate-400"># 強制不使用 cache</span></p>
          <p className="pl-4"><span className="text-yellow-300">--build-arg KEY=val</span> <span className="text-slate-400"># 傳入 build 參數</span></p>
          <p className="pl-4 text-orange-400">.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">查看建好的映像</p>
            <code className="text-green-400">docker images</code>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">刪除映像</p>
            <code className="text-red-400">docker rmi myapp:1.0</code>
          </div>
        </div>
      </div>
    ),
    notes: `Dockerfile 寫好了，下一步就是 docker build，把 Dockerfile 轉換成映像檔。

最基本的指令是：docker build -t myapp:1.0 .

拆解來看：docker build 是主指令；-t 是 tag，設定這個映像的名稱和版本標籤，格式是名稱:版本，如果不指定版本，預設是 latest；最後的 . 是 build context，就是說把哪個目錄的內容提供給 Docker daemon，通常就是 Dockerfile 所在的目錄。注意這個點很重要，不能省略。

Build context 的概念：當你執行 docker build，Docker 會把整個 build context 目錄的內容打包傳給 Docker daemon（如果是遠端的 daemon，就真的會透過網路傳輸）。這就是為什麼 .dockerignore 很重要，要把不必要的檔案排除，不然 node_modules 這種幾百 MB 的目錄，每次 build 都要傳送一次，非常慢。

-f 選項可以指定不同名稱的 Dockerfile，比如你可能有 Dockerfile 和 Dockerfile.prod 兩個，對應開發和生產環境的不同設定。

--no-cache 強制不使用 cache，完全重新 build，適合在遇到奇怪問題要確認時使用，或是 CI/CD 裡需要確保每次都是乾淨 build 的情況。

build 完成後，用 docker images 可以列出本機上所有的映像檔，包括名稱、版本、ID、大小等資訊。確認映像建立成功了嗎？讓大家現在動手試試 build。`,
  },

  // ========== Layer Cache 原理 ==========
  {
    title: 'Image Layer 與 Cache 原理',
    subtitle: '理解 Docker 如何加速 Build',
    section: 'docker build 實作',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="space-y-2">
          {[
            { layer: 'Layer 1', label: 'FROM node:18-alpine', color: 'blue', note: '來自 base image' },
            { layer: 'Layer 2', label: 'WORKDIR /app', color: 'purple', note: '幾乎瞬間完成' },
            { layer: 'Layer 3', label: 'COPY package.json + RUN npm ci', color: 'yellow', note: '最耗時，要 cache 住' },
            { layer: 'Layer 4', label: 'COPY . .', color: 'orange', note: '程式碼有改就重跑' },
            { layer: 'Layer 5', label: 'CMD', color: 'green', note: '只是設定，不執行' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 bg-${item.color}-900/30 border border-${item.color}-700/50 px-4 py-2 rounded-lg text-sm`}>
              <span className={`text-${item.color}-400 font-mono w-16 shrink-0`}>{item.layer}</span>
              <code className="text-slate-200 flex-1">{item.label}</code>
              <span className="text-slate-400 text-xs">{item.note}</span>
            </div>
          ))}
        </div>
        <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg text-sm">
          <p className="text-green-400 font-semibold">⚡ Cache 命中規則</p>
          <p className="text-slate-300">某一層有變更 → 該層之後的所有層都重新 build（cache 失效）</p>
        </div>
      </div>
    ),
    notes: `Docker 映像檔是由多個 layer 疊加而成的，這是 Docker 最核心的設計之一，也是 docker build 速度快的秘密。

每一條 Dockerfile 指令（FROM、RUN、COPY 等）都會產生一個新的 layer，這個 layer 記錄的是相對於上一層的差異，有點像 Git 的 commit。這些 layer 是唯讀的、可以共享的。如果兩個映像都用了同一個 FROM node:18-alpine 作為基底，這一層只需要下載一次，磁碟上也只存一份。

build cache 的邏輯是：Docker 在 build 時，對每一層都會計算一個 hash 值，如果這一層的輸入（指令內容 + 來源檔案的 hash）和之前 build 時完全相同，就直接使用 cache，不重新執行。一旦某一層 cache 失效（有任何輸入變更），這一層之後的所有層都必須重新執行，因為後面的層是建立在前面的結果上的。

這就是為什麼 Dockerfile 的指令順序非常重要！把「不常變的指令」放前面，「常變的指令」放後面，才能讓 cache 被最大化利用。

以 Node.js 為例：package.json 不是每次改程式碼都會變，所以先 COPY package.json 並 RUN npm install，這一層只要 package.json 沒變就能 cache。但如果先 COPY . . 再 npm install，那每次任何一個 .js 檔案有改動，都會讓 npm install 的 cache 失效，每次 build 都要重裝套件。

一個常見的優化技巧：合併 RUN 指令，比如 RUN apt-get update && apt-get install -y git curl，用 && 串在一行，這樣只產生一個 layer，而不是三個，讓映像檔更小、結構更簡潔。`,
  },

  // ========== .dockerignore ==========
  {
    title: '.dockerignore',
    subtitle: '告訴 Docker 哪些檔案不要打包',
    section: 'docker build 實作',
    duration: '8',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">類似 <code className="text-yellow-400">.gitignore</code>，避免不必要的檔案進入 build context</p>
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># .dockerignore</p>
          <p className="text-slate-400">node_modules</p>
          <p className="text-slate-400">npm-debug.log</p>
          <p className="text-slate-400">.git</p>
          <p className="text-slate-400">.gitignore</p>
          <p className="text-slate-400">.env</p>
          <p className="text-slate-400">*.test.js</p>
          <p className="text-slate-400">README.md</p>
          <p className="text-slate-400">dist/</p>
          <p className="text-slate-400">coverage/</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">⚠️ 沒有 .dockerignore</p>
            <p className="text-slate-300">node_modules 可能幾百 MB，每次 build 都要傳輸</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">✓ 有 .dockerignore</p>
            <p className="text-slate-300">只傳必要的源碼，build context 輕量快速</p>
          </div>
        </div>
      </div>
    ),
    notes: `.dockerignore 這個檔案很多人不知道，但它非常重要，能大幅提升 build 的速度。

它的用途和 .gitignore 非常類似：列在裡面的檔案和目錄，在 docker build 時不會被包含進 build context，Docker daemon 就不會收到這些檔案。

最典型的例子是 node_modules。一個普通的 Node.js 專案，node_modules 可能幾百 MB，裡面有幾萬個檔案。如果沒有 .dockerignore，每次執行 docker build，這幾百 MB 的 node_modules 都要被打包傳送給 Docker daemon，即使你在 Dockerfile 裡完全不用它（因為你會在容器內重新執行 npm install）。把 node_modules 加入 .dockerignore，可以讓 build context 從幾百 MB 瞬間降到只有幾 MB，build 速度顯著提升。

另外，.env 檔案通常包含敏感的環境變數，比如資料庫密碼、API key，絕對不應該被打包進映像檔裡。映像檔可能會被推送到 Docker Hub 或其他 registry，如果裡面包含敏感資訊，就會有安全問題。.git 目錄也很大，而且映像檔不需要 git history，也應該排除。

建議：每次建立新專案，就在根目錄建立 .dockerignore，把 node_modules、.git、.env、測試相關的檔案都排除。這是一個好習慣，就像每個專案都應該有 .gitignore 一樣。`,
  },

  // ========== Multi-stage Build 概念 ==========
  {
    title: 'Multi-stage Build',
    subtitle: '大幅縮小映像檔的進階技巧',
    section: 'Multi-stage Build',
    duration: '8',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-300 mb-3">問題：Build 工具（compiler、test runner）只有 build 時需要，執行時根本不需要，為什麼要留在映像檔裡？</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-red-400 font-semibold">❌ 沒有 Multi-stage</p>
            <div className="bg-red-900/20 border border-red-800 p-3 rounded-lg text-sm font-mono">
              <p>FROM node:18</p>
              <p className="text-slate-500"># 包含 gcc、make、所有</p>
              <p className="text-slate-500"># build tool → 很大！</p>
              <p className="text-yellow-400 mt-2">映像大小：800MB+</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-green-400 font-semibold">✓ 使用 Multi-stage</p>
            <div className="bg-green-900/20 border border-green-800 p-3 rounded-lg text-sm font-mono">
              <p className="text-blue-400">FROM node:18 AS builder</p>
              <p className="text-slate-500"># build 階段</p>
              <p className="mt-2 text-blue-400">FROM node:18-alpine</p>
              <p className="text-slate-500"># 只複製產出物</p>
              <p className="text-green-400 mt-2">映像大小：80MB</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg text-sm">
          <p className="text-blue-400 font-semibold">核心概念：用一個 Dockerfile 定義多個階段，最終映像只含最後階段的結果</p>
        </div>
      </div>
    ),
    notes: `Multi-stage Build 是 Docker 17.05 之後加入的功能，解決了一個長期困擾開發者的問題：映像檔太大。

為什麼映像檔會很大？很多程式語言需要 build 過程，比如 TypeScript 要編譯成 JavaScript、Go 要編譯成執行檔、React 前端要打包成靜態檔案。這個 build 過程需要各種工具，比如 TypeScript compiler、webpack、各種 dev dependencies。但是！這些工具只有在 build 的時候需要，等程式碼編譯完成後，線上跑的容器根本不需要這些 build 工具，只需要執行產出的檔案。

但在沒有 Multi-stage Build 之前，常見的做法有兩種：方案一，把所有東西塞進同一個映像，包括 build 工具和執行環境，映像很大，有安全疑慮（攻擊面大）；方案二，用 CI/CD 先在外部 build，再把產出物放進精簡映像，但流程複雜、要維護兩個 Dockerfile。

Multi-stage Build 讓你在同一個 Dockerfile 裡定義多個 FROM 階段，每個階段可以有自己的基底映像，可以用 COPY --from=<stage> 把前一個階段的檔案複製過來。最終的映像只包含最後一個階段的內容。

以一個 TypeScript 應用程式為例：第一個階段（builder）用 node:18 裝所有開發工具、安裝 dev dependencies、執行 tsc 編譯；第二個階段用 node:18-alpine，只複製第一階段編譯出來的 dist 目錄和 package.json，安裝 production dependencies。最終映像裡完全沒有 TypeScript compiler、沒有 dev dependencies，大小可以從幾百 MB 降到幾十 MB。`,
  },

  // ========== Multi-stage Build 實作 ==========
  {
    title: 'Multi-stage Build 實作',
    subtitle: 'TypeScript App 範例',
    section: 'Multi-stage Build',
    duration: '12',
    content: (
      <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm leading-relaxed">
        <p className="text-slate-500"># ====== Stage 1: Build ======</p>
        <p><span className="text-blue-400">FROM</span> node:18 <span className="text-yellow-300">AS builder</span></p>
        <p><span className="text-purple-400">WORKDIR</span> /app</p>
        <p><span className="text-blue-400">COPY</span> package*.json ./</p>
        <p><span className="text-blue-400">RUN</span> npm ci</p>
        <p><span className="text-blue-400">COPY</span> . .</p>
        <p><span className="text-blue-400">RUN</span> npm run build</p>
        <p className="mt-4 text-slate-500"># ====== Stage 2: Production ======</p>
        <p><span className="text-blue-400">FROM</span> node:18-alpine</p>
        <p><span className="text-purple-400">WORKDIR</span> /app</p>
        <p><span className="text-blue-400">COPY</span> package*.json ./</p>
        <p><span className="text-blue-400">RUN</span> npm ci <span className="text-slate-400">--omit=dev</span></p>
        <p className="text-slate-500"># 只複製 build 產出物</p>
        <p><span className="text-blue-400">COPY</span> <span className="text-yellow-300">--from=builder</span> /app/dist ./dist</p>
        <p><span className="text-cyan-400">EXPOSE</span> 3000</p>
        <p><span className="text-green-400">CMD</span> ["node", "dist/server.js"]</p>
      </div>
    ),
    notes: `來看一個實際的 Multi-stage Build 範例。

第一個階段叫做 builder，使用完整的 node:18（不是 alpine），因為 build 工具可能有原生模組，需要完整的編譯環境。先複製 package.json 安裝所有相依套件（包括 dev dependencies，因為 TypeScript compiler 等工具在這裡），複製所有源碼，執行 npm run build 把 TypeScript 編譯成 JavaScript 輸出到 dist 目錄。

第二個階段是真正的生產映像，使用輕量的 node:18-alpine。這個階段只安裝 production dependencies，然後用一個特殊語法 COPY --from=builder 把第一個階段的 /app/dist 目錄複製過來。最終映像裡只有 Alpine Linux + Node.js runtime + production npm packages + 編譯後的 JavaScript 檔案，完全沒有 TypeScript、webpack、eslint 等 build 工具。

關鍵語法解說：AS builder 是幫這個 stage 取名，可以用任何你喜歡的名字。COPY --from=builder 後面跟著的是 stage 名稱，或者也可以用 stage 的索引（0, 1, 2...），但用名稱更易讀。你也可以引用完全不同的映像，比如 COPY --from=nginx:latest /etc/nginx/nginx.conf /etc/nginx/nginx.conf，直接從 nginx 的官方映像複製設定檔過來。

實際效果：一個中型的 TypeScript 應用，沒有 multi-stage 可能是 600-800MB，加上 multi-stage 可以降到 80-150MB，不只節省磁碟空間和傳輸時間，攻擊面也小很多，因為映像裡沒有不必要的工具。這在 Kubernetes 環境中非常重要，每個 node 都要拉映像，小映像可以顯著提升部署速度。現在請大家動手建立這個 Dockerfile，實際 build 看看大小差距。`,
  },

  // ========== 休息 ==========
  {
    title: '☕ 休息時間',
    subtitle: '休息 15 分鐘',
    duration: '15',
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">休息一下，等等進入 Docker Compose！</p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block text-left">
          <p className="text-slate-400 text-sm mb-2">下半場預告</p>
          <ul className="space-y-2 text-slate-300">
            <li>🗂️ Docker Compose 語法與結構</li>
            <li>⚙️ docker-compose 常用指令</li>
            <li>🏗️ 多容器應用實戰</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，上半場到這裡告一段落。我們已經學完了 Dockerfile 的所有重要指令、docker build 的操作和 cache 優化技巧，以及 Multi-stage Build 的概念和實作。這些東西加在一起，已經讓你具備了把任何應用程式打包成 Docker 映像的能力。

現在休息 15 分鐘，去上廁所、喝水、活動一下筋骨。這段時間也可以把剛才的東西消化一下，有不懂的地方可以趁這個機會過來問我或助教。

休息結束後，我們進入下半場：Docker Compose。下半場的內容和上半場有直接的連結，你在上半場 build 出來的映像，正好可以在 Docker Compose 裡使用。我們會學怎麼用一個 YAML 檔案描述和啟動多個容器，這在實際開發和部署中非常常用。15 分鐘後見！`,
  },

  // ========== Docker Compose 介紹 ==========
  {
    title: 'Docker Compose 是什麼？',
    section: 'Docker Compose 入門',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-5 rounded-lg">
          <p className="text-xl text-slate-200">
            Docker Compose 是一個用來<span className="text-blue-400 font-bold">定義和執行多容器應用</span>的工具，
            用一個 <span className="text-yellow-400 font-bold">docker-compose.yml</span> 檔案管理所有服務
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
          {[
            { icon: '📋', title: '宣告式設定', desc: '用 YAML 描述你要的環境，而不是打一長串 docker run 指令' },
            { icon: '🔗', title: '服務協調', desc: '自動處理容器間的網路連線和啟動順序' },
            { icon: '♻️', title: '一鍵操作', desc: 'up/down 一個指令啟動或停止整個應用' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-3xl mb-2">{item.icon}</p>
              <p className="font-bold text-blue-400 mb-1">{item.title}</p>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg text-sm">
          <span className="text-blue-400 font-semibold">現代用法：</span>
          <span className="text-slate-300 ml-1">新版已整合為 </span>
          <code className="text-yellow-400">docker compose</code>
          <span className="text-slate-300">（不加破折號），舊版為 </span>
          <code className="text-yellow-400">docker-compose</code>
        </div>
      </div>
    ),
    notes: `好，休息回來，精神好一些了嗎？我們進入下半場：Docker Compose。

在講 Docker Compose 之前，先想想一個問題：真實的應用程式很少只有一個容器。一個典型的 Web 應用可能有：前端靜態檔案的 nginx、後端 API 服務的 Node.js 或 Python、資料庫的 PostgreSQL 或 MySQL、快取服務的 Redis，還可能有消息佇列的 RabbitMQ。如果用 docker run 來管理這些容器，你得記住每個容器的指令，包括埠口映射、環境變數、volume 掛載、網路設定，而且每次要啟動整個應用，就要一個一個 docker run，順序也要對，非常麻煩。

Docker Compose 解決了這個問題。它讓你用一個 YAML 檔案，把所有容器的設定都宣告在裡面，然後一個 docker compose up 指令，整個應用就起來了；一個 docker compose down，全部停掉。這就是「宣告式管理」的威力：你只需要描述你「想要什麼」，不需要寫出「怎麼一步一步做到」。

Docker Compose 最初是一個獨立工具（docker-compose，有破折號），後來 Docker 把它整合進 Docker CLI 本身，新版用法是 docker compose（空格，沒有破折號）。兩個指令功能一樣，但新版直接內建不需要另外安裝。課程中我們用新版 docker compose，但如果你的環境是舊版，docker-compose 也完全可以。`,
  },

  // ========== docker-compose.yml 結構 ==========
  {
    title: 'docker-compose.yml 結構',
    subtitle: 'YAML 格式的服務定義',
    section: 'Docker Compose 入門',
    duration: '12',
    content: (
      <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm leading-relaxed">
        <p><span className="text-blue-400">version</span>: <span className="text-green-400">'3.9'</span></p>
        <p className="mt-2"><span className="text-blue-400">services</span>:</p>
        <p className="pl-4"><span className="text-yellow-300">web</span>:</p>
        <p className="pl-8"><span className="text-purple-400">image</span>: nginx:alpine</p>
        <p className="pl-8"><span className="text-purple-400">ports</span>:</p>
        <p className="pl-10 text-slate-300">- "8080:80"</p>
        <p className="pl-8"><span className="text-purple-400">depends_on</span>:</p>
        <p className="pl-10 text-slate-300">- api</p>
        <p className="pl-4 mt-2"><span className="text-yellow-300">api</span>:</p>
        <p className="pl-8"><span className="text-purple-400">build</span>: ./api</p>
        <p className="pl-8"><span className="text-purple-400">environment</span>:</p>
        <p className="pl-10 text-slate-300">- DB_HOST=db</p>
        <p className="pl-10 text-slate-300">- NODE_ENV=production</p>
        <p className="pl-8"><span className="text-purple-400">volumes</span>:</p>
        <p className="pl-10 text-slate-300">- ./api:/app</p>
        <p className="pl-4 mt-2"><span className="text-yellow-300">db</span>:</p>
        <p className="pl-8"><span className="text-purple-400">image</span>: postgres:15</p>
        <p className="pl-8"><span className="text-purple-400">environment</span>:</p>
        <p className="pl-10 text-slate-300">- POSTGRES_PASSWORD=secret</p>
        <p className="pl-8"><span className="text-purple-400">volumes</span>:</p>
        <p className="pl-10 text-slate-300">- pgdata:/var/lib/postgresql/data</p>
        <p className="mt-2"><span className="text-blue-400">volumes</span>:</p>
        <p className="pl-4"><span className="text-yellow-300">pgdata</span>:</p>
      </div>
    ),
    notes: `讓我們仔細解讀 docker-compose.yml 的結構，這是 Docker Compose 的核心，每一行都有它的意義。

最頂層是 version，指定 Compose file 的格式版本，不同版本支援的功能有些不同，目前推薦用 3.9 或直接省略（新版 Docker Compose 已不強制要求 version 欄位）。

最重要的頂層 key 是 services，裡面定義每一個容器服務。以上面的例子，我們定義了三個服務：web（nginx）、api（自定義 Node.js 應用）、db（PostgreSQL）。

每個 service 裡常用的設定項目：
image 指定要使用的映像，可以是 Docker Hub 上的映像名稱；build 則是指定一個目錄，Docker Compose 會在這個目錄找 Dockerfile 自動 build。兩個只會用其中一個。

ports 設定埠口映射，格式是 "host埠:容器埠"，和 docker run 的 -p 一樣。

environment 設定環境變數，可以是 KEY=VALUE 的 list 格式，或是 key: value 的 map 格式。這是傳入密碼、資料庫連線設定等的主要方式。

volumes 設定資料卷，可以是相對路徑的目錄掛載（./api:/app 把 host 的 ./api 目錄掛到容器的 /app），也可以是名稱 volume（pgdata:/var/lib/postgresql/data，用於資料持久化）。

depends_on 設定服務依賴順序，web 依賴 api，表示啟動 web 之前要先確保 api 容器起來。注意：depends_on 只確保容器啟動，不確保服務就緒（比如資料庫要幾秒才能接受連線），所以應用程式本身要有重試機制。

頂層的 volumes 區塊用來聲明具名 volume，這些 volume 由 Docker 管理，資料存在 Docker 的 volume 目錄裡，不受容器刪除影響。這是資料庫資料持久化的標準方式。`,
  },

  // ========== networks 與 volumes ==========
  {
    title: 'networks 與 volumes 深入',
    section: 'Docker Compose 入門',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-blue-400">🌐 networks</h3>
            <div className="bg-slate-900 p-3 rounded-lg font-mono text-sm">
              <p className="text-blue-400">networks</p>
              <p className="pl-4 text-yellow-300">frontend:</p>
              <p className="pl-6">driver: bridge</p>
              <p className="pl-4 mt-1 text-yellow-300">backend:</p>
              <p className="pl-6">driver: bridge</p>
            </div>
            <p className="text-slate-400 text-sm">預設會建立一個網路，同 compose 的服務可互相連線，用服務名稱當 DNS hostname</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-green-400">💾 volumes</h3>
            <div className="bg-slate-900 p-3 rounded-lg font-mono text-sm">
              <p className="text-green-400">volumes</p>
              <p className="pl-4 text-yellow-300">pgdata:</p>
              <p className="pl-6 text-slate-500"># Docker 管理的 volume</p>
              <p className="pl-4 mt-1 text-yellow-300">redis-data:</p>
              <p className="pl-6">driver: local</p>
            </div>
            <p className="text-slate-400 text-sm">具名 volume 存活於容器生命週期之外，刪除容器也不會丟失資料</p>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg text-sm">
          <p className="text-blue-400 font-semibold">🔑 關鍵特性：服務名稱即 DNS</p>
          <p className="text-slate-300 mt-1">api 容器連資料庫只需用 <code className="text-yellow-400">db:5432</code>，不需要知道 IP，因為 Compose 自動配置 DNS</p>
        </div>
      </div>
    ),
    notes: `Networks 和 volumes 是 Docker Compose 裡非常重要的兩個概念，我們深入說明一下。

先講 networks。Docker Compose 有一個超方便的特性：預設情況下，在同一個 compose 檔案裡定義的所有服務，都會被自動加入同一個預設的 bridge 網路，而且每個服務的名稱會自動成為 DNS hostname。

這意味著什麼？假設你有一個叫 api 的服務和一個叫 db 的服務，api 連接資料庫時，直接在程式碼裡用 db:5432 就可以了，完全不需要知道資料庫容器的 IP 位址。這大幅簡化了容器間的連線設定。在 kubernetes 裡也有類似的 Service DNS 機制，概念是相通的。

你也可以自定義多個網路，把不同的服務分配到不同網路，實現網路隔離。比如前端服務只加入 frontend 網路，後端服務同時加入 frontend 和 backend 網路，資料庫只加入 backend 網路，這樣前端容器就無法直接連到資料庫，提高安全性。

再講 volumes。volumes 有兩種類型：第一種是 bind mount（目錄掛載），把 host 的目錄掛進容器，常用在開發環境中把源碼掛進容器，這樣修改 host 上的程式碼，容器裡立刻可以看到變化，不需要重新 build；第二種是 named volume（具名卷），由 Docker 自己管理，存在特定的 Docker 目錄下，主要用於資料庫等需要持久化儲存的服務，容器刪除再重建，資料依然在。

實際操作中，開發環境通常用 bind mount 掛源碼方便修改，生產環境的資料庫用 named volume 確保資料不丟失。`,
  },

  // ========== docker-compose 常用指令 ==========
  {
    title: 'docker compose 常用指令',
    subtitle: 'up、down、logs、exec',
    section: 'docker-compose 指令實作',
    duration: '10',
    content: (
      <div className="space-y-3">
        {[
          {
            cmd: 'docker compose up',
            opts: '-d',
            desc: '啟動所有服務（-d 背景執行）',
            color: 'green',
          },
          {
            cmd: 'docker compose down',
            opts: '-v',
            desc: '停止並移除容器（-v 同時刪除 volumes）',
            color: 'red',
          },
          {
            cmd: 'docker compose logs',
            opts: '-f api',
            desc: '查看服務 log（-f 持續追蹤）',
            color: 'yellow',
          },
          {
            cmd: 'docker compose exec',
            opts: 'api sh',
            desc: '進入指定服務的容器執行指令',
            color: 'blue',
          },
          {
            cmd: 'docker compose ps',
            opts: '',
            desc: '查看所有服務的狀態',
            color: 'purple',
          },
          {
            cmd: 'docker compose build',
            opts: '--no-cache',
            desc: '重新 build 有 build 設定的服務',
            color: 'orange',
          },
        ].map((item, i) => (
          <div key={i} className={`bg-slate-800/50 p-3 rounded-lg flex items-center gap-3 text-sm`}>
            <code className={`text-${item.color}-400 shrink-0`}>
              {item.cmd} <span className="text-slate-400">{item.opts}</span>
            </code>
            <span className="text-slate-300 text-right ml-auto">{item.desc}</span>
          </div>
        ))}
      </div>
    ),
    notes: `Docker Compose 的指令設計非常直觀，幾乎和 docker 的子指令一一對應，只是多了服務管理的能力。

docker compose up 是最常用的指令，啟動 compose 檔案裡定義的所有服務。加上 -d（detach）參數就是背景執行，不加的話會在前台顯示所有服務的 log，Ctrl+C 就會停止。加上 --build 可以在啟動前先重新 build 映像，確保用的是最新的程式碼。常見用法：docker compose up -d --build。

docker compose down 是停止並清理的指令，會停止所有容器並移除它們（但預設不刪除 volumes 和映像）。加上 -v 會同時刪除 named volumes，通常在完全重置環境時使用，注意資料庫的資料也會一起刪除！加上 --rmi all 還會刪除 build 出來的映像。

docker compose logs 查看服務的輸出。加上 -f 是「follow」的意思，持續追蹤新的 log，類似 tail -f。後面可以指定服務名稱，只看特定服務的 log，比如 docker compose logs -f api 只追蹤 api 服務。

docker compose exec 在指定的容器裡執行指令，最常用的是進入容器的 shell，比如 docker compose exec api sh（alpine 用 sh）或 docker compose exec api bash（ubuntu 用 bash），進去之後就可以直接在容器裡 debug。

docker compose ps 查看所有服務的狀態，包括容器 ID、使用的映像、狀態（running/exited）、端口映射。

docker compose build 只重新 build 映像，不啟動。加上 --no-cache 確保完全重新 build，不使用 cache。`,
  },

  // ========== 實作：docker compose 操作 ==========
  {
    title: '🔨 實作：啟動你的第一個 Compose 應用',
    section: 'docker-compose 指令實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># Step 1: 建立 docker-compose.yml</p>
          <p className="text-blue-400">version: '3.9'</p>
          <p className="text-blue-400">services:</p>
          <p className="pl-4 text-yellow-300">web:</p>
          <p className="pl-6 text-slate-300">image: nginx:alpine</p>
          <p className="pl-6 text-slate-300">ports:</p>
          <p className="pl-8 text-slate-300">- "8080:80"</p>
          <p className="pl-4 mt-2 text-yellow-300">redis:</p>
          <p className="pl-6 text-slate-300">image: redis:7-alpine</p>
        </div>
        <div className="grid gap-2 text-sm">
          {[
            { step: '2', cmd: 'docker compose up -d', note: '啟動（背景執行）' },
            { step: '3', cmd: 'docker compose ps', note: '確認兩個容器都在 running' },
            { step: '4', cmd: 'docker compose logs web', note: '查看 nginx 的 log' },
            { step: '5', cmd: 'docker compose exec redis redis-cli ping', note: '確認 redis 回應 PONG' },
            { step: '6', cmd: 'docker compose down', note: '清理環境' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">{item.step}</span>
              <code className="text-green-400 flex-1">{item.cmd}</code>
              <span className="text-slate-400 text-xs">{item.note}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `好，現在輪到大家動手了。我們用一個最簡單的兩服務範例來練習 docker compose 的基本操作流程。

Step 1：建立工作目錄和 docker-compose.yml。找一個空的目錄，建立 docker-compose.yml，把上面的內容複製進去。這個 compose 定義了兩個服務：nginx 網頁伺服器和 Redis 快取服務，兩個都是公開的官方映像，不需要自己 build。

Step 2：docker compose up -d。在 docker-compose.yml 所在的目錄執行這個指令。Docker Compose 會先去 pull 這兩個映像（如果本地沒有），然後建立網路，啟動兩個容器。-d 讓它在背景執行，你不會被 log 淹沒。

Step 3：docker compose ps。確認兩個容器都顯示 running 狀態。你也會看到 web 服務的端口映射 0.0.0.0:8080->80/tcp。

Step 4：打開瀏覽器輸入 http://localhost:8080，應該可以看到 nginx 的歡迎頁面，確認 web 服務在正常工作。

Step 5：docker compose logs web 查看 nginx 的 log，你應該會看到剛才瀏覽器請求的記錄。試試 docker compose logs -f web，然後再開一個瀏覽器頁面，觀察 log 即時更新。

Step 6：docker compose exec redis redis-cli ping。進入 redis 容器執行 redis-cli ping，如果回應 PONG，表示 Redis 服務正常運作。

最後 docker compose down 清理環境。

大家動手試試，遇到問題舉手。都完成了嗎？注意觀察各個指令的輸出，理解它們的意思。`,
  },

  // ========== 多容器應用架構 ==========
  {
    title: '多容器應用實戰',
    subtitle: 'Frontend + Backend + Database',
    section: '多容器應用實戰',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="bg-blue-900/50 border border-blue-700 p-4 rounded-lg text-center">
            <p className="text-3xl">🌐</p>
            <p className="font-bold text-blue-400">Frontend</p>
            <p className="text-slate-400">React / Vue</p>
            <p className="text-slate-500 text-xs">Port 3000</p>
          </div>
          <div className="text-blue-400 text-2xl">→</div>
          <div className="bg-green-900/50 border border-green-700 p-4 rounded-lg text-center">
            <p className="text-3xl">⚙️</p>
            <p className="font-bold text-green-400">Backend API</p>
            <p className="text-slate-400">Node.js / Flask</p>
            <p className="text-slate-500 text-xs">Port 8080</p>
          </div>
          <div className="text-green-400 text-2xl">→</div>
          <div className="bg-orange-900/50 border border-orange-700 p-4 rounded-lg text-center">
            <p className="text-3xl">🗄️</p>
            <p className="font-bold text-orange-400">Database</p>
            <p className="text-slate-400">PostgreSQL</p>
            <p className="text-slate-500 text-xs">Port 5432</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-blue-400">瀏覽器存取</p>
            <p className="text-slate-300">localhost:3000</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-green-400">API 內部通訊</p>
            <p className="text-slate-300">api:8080</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-orange-400">DB 只接受內部</p>
            <p className="text-slate-300">db:5432 (不對外)</p>
          </div>
        </div>
      </div>
    ),
    notes: `最後這個環節，我們把今天學的所有東西串在一起，實作一個真實的三層應用架構：前端、後端 API、資料庫。

這個三層架構是現代 Web 應用最常見的形式。前端是 React 或 Vue 這類的 JavaScript 框架，負責使用者介面；後端是 Node.js、Python Flask 或其他語言的 API 服務，處理商業邏輯；資料庫儲存持久化資料。

在 Docker Compose 的環境裡，這三個服務的網路規劃是這樣的：前端服務的埠口對外開放（3000:3000），讓瀏覽器可以存取；後端 API 服務對外開放（8080:8080），讓前端的 JavaScript 可以發 API 請求；資料庫則完全不對外開放，只在 Compose 的內部網路裡，只有後端服務可以連接。

這種設計有很好的安全性：使用者永遠接觸不到資料庫，所有資料庫操作都必須透過後端 API，後端可以做身份驗證和資料驗證。這個架構在 Kubernetes 裡也會用到，只是用 Service 和 Ingress 來做類似的事。

今天我們會實作一個簡化版本，讓大家體驗完整的多容器應用是怎麼用 Compose 組合起來的。`,
  },

  // ========== 多容器 Compose 完整範例 ==========
  {
    title: '多容器 docker-compose.yml',
    section: '多容器應用實戰',
    duration: '15',
    content: (
      <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs leading-relaxed overflow-auto max-h-96">
        <p className="text-blue-400 text-sm">services:</p>
        <p className="pl-2 text-yellow-300 text-sm">frontend:</p>
        <p className="pl-4 text-slate-300">build: ./frontend</p>
        <p className="pl-4 text-slate-300">ports:</p>
        <p className="pl-6 text-slate-300">- "3000:3000"</p>
        <p className="pl-4 text-slate-300">environment:</p>
        <p className="pl-6 text-slate-300">- REACT_APP_API_URL=http://localhost:8080</p>
        <p className="pl-4 text-slate-300">depends_on:</p>
        <p className="pl-6 text-slate-300">- api</p>
        <p className="pl-2 mt-2 text-yellow-300 text-sm">api:</p>
        <p className="pl-4 text-slate-300">build: ./api</p>
        <p className="pl-4 text-slate-300">ports:</p>
        <p className="pl-6 text-slate-300">- "8080:8080"</p>
        <p className="pl-4 text-slate-300">environment:</p>
        <p className="pl-6 text-slate-300">- DATABASE_URL=postgresql://user:pass@db:5432/myapp</p>
        <p className="pl-6 text-slate-300">- NODE_ENV=development</p>
        <p className="pl-4 text-slate-300">depends_on:</p>
        <p className="pl-6 text-slate-300">- db</p>
        <p className="pl-4 text-slate-300">volumes:</p>
        <p className="pl-6 text-slate-300">- ./api:/app</p>
        <p className="pl-6 text-slate-300">- /app/node_modules</p>
        <p className="pl-2 mt-2 text-yellow-300 text-sm">db:</p>
        <p className="pl-4 text-slate-300">image: postgres:15-alpine</p>
        <p className="pl-4 text-slate-300">environment:</p>
        <p className="pl-6 text-slate-300">- POSTGRES_USER=user</p>
        <p className="pl-6 text-slate-300">- POSTGRES_PASSWORD=pass</p>
        <p className="pl-6 text-slate-300">- POSTGRES_DB=myapp</p>
        <p className="pl-4 text-slate-300">volumes:</p>
        <p className="pl-6 text-slate-300">- pgdata:/var/lib/postgresql/data</p>
        <p className="pl-4 text-slate-300">ports:</p>
        <p className="pl-6 text-slate-300">- "5432:5432"</p>
        <p className="mt-2 text-blue-400 text-sm">volumes:</p>
        <p className="pl-2 text-yellow-300 text-sm">pgdata:</p>
      </div>
    ),
    notes: `來逐段分析這個完整的三層應用 docker-compose.yml。

frontend 服務：用 build: ./frontend 指定從 ./frontend 目錄的 Dockerfile 建立映像；埠口 3000:3000 對外開放讓瀏覽器存取；environment 設定 REACT_APP_API_URL，告訴前端 React 應用 API 在哪裡；depends_on api 確保後端服務先啟動。

api 服務：也是用 build，從 ./api 目錄建立；埠口 8080:8080 對外；environment 裡的 DATABASE_URL 是後端連資料庫的連線字串，注意 @db:5432 裡的 db 是 Compose 服務的名稱，Docker Compose 會自動解析成正確的 IP，這就是之前說的「服務名稱即 DNS」；volumes 裡有兩條：./api:/app 把本地的 api 目錄掛進容器，方便開發時即時看到程式碼變更；/app/node_modules 這一條很特別，它是一個「匿名 volume」，目的是防止 host 的 node_modules（可能不存在或版本不同）覆蓋掉容器內 npm install 建立的 node_modules，這是 Node.js 容器化開發的標準技巧。

db 服務：使用官方的 postgres:15-alpine 映像；environment 設定 PostgreSQL 的使用者名稱、密碼、資料庫名稱；volumes 掛載 named volume pgdata 到 PostgreSQL 的資料目錄，確保資料庫資料持久化；這裡我們開放了 5432:5432 方便開發時用 DB GUI 工具（如 pgAdmin、TablePlus）連接，但生產環境不應該把資料庫埠口對外開放。

最後 volumes 區塊宣告了 pgdata 這個 named volume。

把這個 compose 檔案搭配各自的 Dockerfile，就是一個完整的本地開發環境。整個 team 只要有 Docker 和 Docker Compose，clone repo 之後一個 docker compose up，環境就起來了，不需要各自安裝 PostgreSQL、Node.js 等。這就是 Docker Compose 最大的價值。`,
  },

  // ========== 開發環境的 Compose 技巧 ==========
  {
    title: '開發環境實用技巧',
    subtitle: 'Hot Reload 與環境變數管理',
    section: '多容器應用實戰',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="space-y-2">
          <h3 className="text-blue-400 font-bold">📁 使用 .env 檔案</h3>
          <div className="bg-slate-900 p-3 rounded-lg font-mono text-sm">
            <p className="text-slate-500"># .env</p>
            <p className="text-green-400">POSTGRES_PASSWORD=devpassword</p>
            <p className="text-green-400">NODE_ENV=development</p>
            <p className="mt-2 text-slate-500"># docker-compose.yml 自動讀取 .env</p>
            <p className="text-slate-300">environment:</p>
            <p className="pl-4 text-yellow-300">- POSTGRES_PASSWORD=${'${POSTGRES_PASSWORD}'}</p>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-blue-400 font-bold">🔄 程式碼修改即時生效（Bind Mount）</h3>
          <div className="bg-slate-900 p-3 rounded-lg font-mono text-sm">
            <p className="text-slate-300">volumes:</p>
            <p className="pl-4 text-yellow-300">- ./api:/app</p>
            <p className="text-slate-500 text-xs mt-1"># 結合 nodemon / air / watchdog 自動重啟</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ .env 要加入 .gitignore 和 .dockerignore！</p>
          <p className="text-yellow-200">密碼等敏感資訊不應該進版本控制或映像檔</p>
        </div>
      </div>
    ),
    notes: `在實際的開發工作中，有幾個 Docker Compose 的實用技巧值得特別介紹。

第一個是 .env 檔案。Docker Compose 有一個很方便的特性：它會自動讀取 docker-compose.yml 同目錄下的 .env 檔案，讓你在 YAML 裡用 ${變數名} 的語法引用環境變數。這樣資料庫密碼、API key 等敏感資訊可以放在 .env 裡，不用寫死在 YAML 裡，方便不同環境用不同的值。

重要提醒：.env 一定要加入 .gitignore，不要 commit 到 git repo 裡，同時也要加入 .dockerignore 避免被打包進映像。通常在 repo 裡放一個 .env.example，列出需要設定的變數但不填真實值，讓其他開發者知道需要建立哪些環境變數。

第二個技巧是 bind mount 搭配熱重載（hot reload）。開發時最痛苦的事之一是每次改程式碼都要重新 build 映像、重啟容器。用 bind mount 把源碼目錄掛進容器後，容器直接讀取 host 上的檔案，修改 host 的程式碼後容器立刻可以看到變化。再搭配語言的熱重載工具：Node.js 用 nodemon、Go 用 air、Python 用 --reload 選項，當檔案變更時自動重啟服務，就實現了真正的「存檔即生效」開發體驗，不需要重新 build 映像。

特別注意：這個 bind mount + hot reload 的設定只適合開發環境，生產環境的 Dockerfile 應該用 COPY 把源碼打包進映像，不依賴 host 的目錄。很多人會維護兩個 Compose 檔案：docker-compose.yml 給開發用，docker-compose.prod.yml 給生產用，或者用 override 的方式管理兩個環境的差異。`,
  },

  // ========== 課程總結 ==========
  {
    title: '課程總結',
    subtitle: '今天你學會了什麼',
    section: '課程總結',
    duration: '8',
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-400 font-bold text-lg mb-2">📄 Dockerfile</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• FROM / RUN / COPY</li>
              <li>• WORKDIR / EXPOSE</li>
              <li>• CMD vs ENTRYPOINT</li>
              <li>• Layer Cache 優化</li>
              <li>• .dockerignore</li>
            </ul>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
            <p className="text-purple-400 font-bold text-lg mb-2">✂️ Multi-stage</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 兩階段 build 流程</li>
              <li>• COPY --from</li>
              <li>• 大幅縮小映像大小</li>
              <li>• Build tool 不進生產映像</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-bold text-lg mb-2">🗂️ Docker Compose</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• YAML 結構與語法</li>
              <li>• services/networks/volumes</li>
              <li>• up / down / logs / exec</li>
              <li>• 多容器應用實戰</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg text-center">
          <p className="text-yellow-400 font-semibold">🚀 下一步</p>
          <p className="text-slate-300">明天下午：進入 Kubernetes！你的 Docker 知識將直接被應用。</p>
        </div>
      </div>
    ),
    notes: `好，我們來回顧一下今天下午學了什麼，讓知識在腦子裡留下清楚的印象。

第一大塊是 Dockerfile。你現在知道 Dockerfile 的每一行指令的意義：FROM 選基底映像、RUN 執行 build 時的指令、COPY 複製檔案、WORKDIR 設定工作目錄、EXPOSE 宣告埠口、CMD 設定預設啟動指令、ENTRYPOINT 設定固定的主程式。你也學到了怎麼善用 Layer Cache 加速 build，以及 .dockerignore 的重要性。

第二大塊是 Multi-stage Build。這是一個立刻可以用在實際專案的技巧，把 build 工具和執行環境分開，讓生產映像只包含真正需要的東西，大幅縮小映像大小，也提高了安全性。

第三大塊是 Docker Compose。從 docker-compose.yml 的語法結構，到 services、networks、volumes 的設定，再到 docker compose up/down/logs/exec 的實際操作，還有多容器應用的完整範例。你現在有能力用 Compose 架起一個前後端分離加資料庫的完整開發環境。

這三塊知識是相輔相成的：Dockerfile 用來定義單一服務的映像，Multi-stage Build 優化這個映像，Docker Compose 把多個映像組合成一個完整的應用。

明天上午我們會繼續深入 Docker 的進階主題，明天下午正式進入 Kubernetes！今天學的所有 Docker 知識，在 K8s 裡都會直接用到。Kubernetes 裡的每個 Pod 都是由一個或多個容器組成，容器就是用你今天學會的 Dockerfile 打包的映像。`,
  },

  // ========== Q&A 與作業 ==========
  {
    title: 'Q&A 與課後練習',
    section: '課程總結',
    duration: '12',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-blue-400 mb-4">📝 回家作業</h3>
          <ol className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
              <span>為你自己的一個小專案（或今天的範例）撰寫 Dockerfile，成功執行 docker build 和 docker run</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
              <span>把上面的專案改成 Multi-stage Build，比較 build 前後的映像大小（docker images）</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
              <span>（選做）建立一個 docker-compose.yml 包含 app + redis，成功執行 docker compose up -d</span>
            </li>
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold">💡 遇到問題</p>
            <p className="text-yellow-200">Line 群組發問，助教盡快回覆</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-semibold">📅 明天預告</p>
            <p className="text-slate-300">上午 Docker 進階 → 下午進入 Kubernetes！</p>
          </div>
        </div>
      </div>
    ),
    notes: `最後留一點時間給大家提問。今天的內容比較密集，從 Dockerfile 的基礎語法到 Docker Compose 的多容器實戰，中間還夾了 Layer Cache 和 Multi-stage Build 這些進階主題，有任何不清楚的地方，現在是最好的機會。

（等待並回答問題）

回家作業分三個層次：

必做：為一個小專案（可以用今天的 Node.js 範例，也可以用自己的任何小程式）撰寫 Dockerfile，確保能成功 docker build 和 docker run。這個練習能幫你把今天學的語法真正消化吸收，從理解到能獨立使用。

進階：把這個專案改成 Multi-stage Build，然後用 docker images 比較兩個映像的大小，你會非常直觀地看到 multi-stage 的效果。

選做：建立一個 docker-compose.yml，把你的應用加上 Redis（或任何你覺得有趣的服務），練習 docker compose up/down/logs/exec 這些操作。

今天學的 Docker 技能，不只是為了接下來學 Kubernetes 的準備，它本身在工作中也是立刻可以用的。很多公司的開發環境已經全面 Docker 化，理解 Dockerfile 和 Docker Compose，會讓你在 code review 和環境設定上更有能力。

明天上午我們會繼續深入 Docker 的進階主題，下午正式進入 Kubernetes 的世界！帶著今天對容器的理解，你會發現學 K8s 的時候很多概念都能類比過來，學起來更快。今天辛苦了，回家好好休息，明天見！`,
  },
]
