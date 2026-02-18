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
    title: 'K8s 基本操作',
    subtitle: '第四堂下午 — 13:00–17:00',
    section: '開場',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            ☸️
          </div>
          <div>
            <p className="text-2xl font-semibold">K8s 基本操作</p>
            <p className="text-slate-400">YAML 撰寫、kubectl 指令、Deployment 與 ConfigMap</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">今日主軸</p>
            <p className="text-slate-300">從 YAML 到實際部署應用</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">學完能做什麼</p>
            <p className="text-slate-300">獨立操作 Pod / Deployment</p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🎯 今日目標</p>
          <p className="text-slate-200">會寫 YAML → 會用 kubectl → 能部署並更新一個真實應用程式</p>
        </div>
      </div>
    ),
    notes: `歡迎大家回到下午的課程！吃飽了嗎？相信大家剛剛補充了足夠的能量，因為接下來這四個小時，我們要進入 Kubernetes 最核心的實作部分，今天下午可以說是整個課程裡最「手忙腳亂」的時段——有大量的指令、大量的 YAML、大量的實際操作。

先講一下今天下午的學習路徑。上午我們理解了 K8s 的架構概念，知道有 Master、有 Node、有 etcd、有 API Server 這些元件。但概念再清楚，不動手就只是紙上談兵。就像學開車，你可以把引擎原理講得一清二楚，但你不坐上駕駛座就永遠不會開。下午我們要真正跟 Kubernetes 互動——用指令建立資源、觀察狀態、修改設定、排查問題。

今天下午結束的時候，我希望每個人都有能力：寫一份 YAML 設定檔、用 kubectl 把它部署上去、觀察 Pod 的狀態、做一次滾動更新、用 ConfigMap 管理設定值。這些不是抽象目標，都是我們今天下午會實際操作的內容。每個主題我都設計了動手練習，請大家一定要跟著敲指令，光看是學不會的。

讓我分享一個真實的故事：我第一次接觸 K8s 的時候，花了整整一個星期看文件、看影片，以為自己完全理解了。結果第一次要在公司環境部署的時候，完全不知道從哪裡下手——YAML 的縮排一直報錯，kubectl 的指令記不住，Pod 狀態是 CrashLoopBackOff 不知道怎麼排查。那種挫折感非常真實。後來我花了兩天密集操作，把同樣的 Deployment 建立、刪除、更新、回滾各做了十幾遍，才真正把這些東西記進腦子裡。所以今天的關鍵不是抄我的指令，而是理解每個操作的意圖和背後的邏輯。

這堂課的密度比較高，如果有地方跟不上，請立刻舉手，不要悶頭自己撐。我寧可慢一點確保大家都跟上，也不要一個人站在前面自說自話。準備好了嗎？我們先從 YAML 開始，因為 K8s 的所有操作幾乎都圍繞著 YAML 檔案轉。`,
  },

  // ========== 今日課程大綱 ==========
  {
    title: '今日下午課程大綱',
    section: '課程總覽',
    duration: '2',
    content: (
      <div className="grid gap-3">
        {[
          { time: '13:00–13:05', topic: '開場與目標確認', icon: '🎯' },
          { time: '13:05–13:35', topic: 'YAML 語法基礎', icon: '📝' },
          { time: '13:35–13:50', topic: 'K8s YAML 通用結構', icon: '🏗️' },
          { time: '13:50–14:05', topic: 'Pod YAML 撰寫', icon: '📦' },
          { time: '14:05–14:25', topic: 'kubectl 常用指令', icon: '⌨️' },
          { time: '14:25–14:35', topic: 'Pod 生命週期觀察', icon: '🔍' },
          { time: '14:35–14:50', topic: 'Namespace 概念與操作', icon: '📂' },
          { time: '14:50–15:05', topic: '☕ 休息時間', icon: '☕' },
          { time: '15:05–15:25', topic: 'Deployment 建立與管理', icon: '🚀' },
          { time: '15:25–15:45', topic: '滾動更新與回滾', icon: '🔄' },
          { time: '15:45–16:05', topic: 'ConfigMap 建立與使用', icon: '⚙️' },
          { time: '16:05–16:25', topic: 'Label 與 Selector', icon: '🏷️' },
          { time: '16:25–16:40', topic: '進階 kubectl 技巧', icon: '🛠️' },
          { time: '16:40–16:50', topic: 'Q&A', icon: '💬' },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${item.topic.includes('休息') ? 'bg-yellow-900/30 border border-yellow-700/50' : 'bg-slate-800/50'}`}>
            <span className="text-xl w-8 text-center">{item.icon}</span>
            <div className="flex-1">
              <span className="text-k8s-blue text-sm mr-3">{item.time}</span>
              <span>{item.topic}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我們先看一下今天下午的行程安排，讓大家心裡有個底。

整個下午分成兩大段，中間有 15 分鐘休息。第一段從 13:00 到 14:50，我們會把基礎打好：YAML 語法、K8s 資源結構、Pod 操作、kubectl 指令、還有 Namespace 的概念。

休息之後進入第二段，這段更偏向實際的應用部署場景：Deployment 管理多個副本、滾動更新與版本回滾、ConfigMap 管理設定、Label 篩選資源、最後是一些進階的 kubectl 技巧。

看起來很多，但每個主題都是緊密相連的，學完前面的馬上就會用到後面的。比如你學完 YAML 語法，馬上就要用它來寫 Pod 的設定檔；學完 Pod，馬上就要用 kubectl 操作它；學完 kubectl，馬上就要觀察 Pod 的生命週期。這樣串聯學習的效果遠比各自獨立學好很多。

有一件事要先說：今天下午的指令和 YAML 非常多，不用全部背起來。重點是理解每個東西是幹什麼用的、什麼時候該用哪個指令。實際工作的時候，你隨時可以查手冊或文件。今天的目標是建立概念框架，讓你看到一個 YAML 檔知道它在做什麼，看到一個 kubectl 指令知道它的意圖。好，開始！`,
  },

  // ========== YAML 語法基礎 1 ==========
  {
    title: 'YAML 語法基礎',
    subtitle: '縮排、鍵值對、資料型別',
    section: 'YAML 入門',
    duration: '8',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">YAML = YAML Ain't Markup Language，人類可讀的資料序列化格式</p>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-500"># 鍵值對（key: value）</p>
          <p><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">my-app</span></p>
          <p><span className="text-blue-400">version</span><span className="text-slate-400">: </span><span className="text-orange-400">1</span></p>
          <p><span className="text-blue-400">enabled</span><span className="text-slate-400">: </span><span className="text-purple-400">true</span></p>
          <p className="mt-3 text-slate-500"># 縮排代表層次（用空格，不能用 Tab！）</p>
          <p><span className="text-blue-400">metadata</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">my-pod</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">namespace</span><span className="text-slate-400">: </span><span className="text-green-400">default</span></p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-red-900/30 border border-red-700/50 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">❌ 錯誤</p>
            <code className="text-slate-300 font-mono">metadata:<br/>	name: foo</code>
            <p className="text-red-300 text-xs mt-1">使用 Tab 縮排</p>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">✓ 正確</p>
            <code className="text-slate-300 font-mono">metadata:<br/>  name: foo</code>
            <p className="text-green-300 text-xs mt-1">使用 2 個空格</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">💡 小技巧</p>
            <p className="text-slate-300 text-xs">VS Code 會自動幫你轉換 Tab 為空格</p>
          </div>
        </div>
      </div>
    ),
    notes: `在進入 Kubernetes 之前，我們必須先搞懂 YAML。因為 K8s 的幾乎所有設定都是用 YAML 寫的：Pod 的設定是 YAML、Deployment 是 YAML、Service 是 YAML、ConfigMap 是 YAML。你可以把 YAML 想成是 K8s 的「語言」，不懂這個語言就沒辦法跟 K8s 溝通。有工程師形容得很傳神：「學 K8s，一半的時間都在學 YAML。」這雖然有點誇張，但確實反映了 YAML 的重要性。

YAML 全名是 YAML Ain't Markup Language，這個遞迴縮寫有點幽默，有點自我解嘲的味道。它的設計目標是「人類可讀性」，和 JSON 或 XML 比起來，YAML 看起來更像是普通的文字筆記，沒有那麼多大括號、中括號和引號，寫起來更接近自然語言。很多現代的設定格式都選擇 YAML，包括 GitHub Actions、Docker Compose、Ansible 等等。

YAML 最基本的單位是鍵值對，格式是：鍵名加冒號加空格加值。注意冒號後面一定要有一個空格，沒有空格就會解析失敗。值可以是字串、數字、布林值（true/false）、null 等不同型別，YAML 會根據值的格式自動判斷型別。比如 42 是整數，3.14 是浮點數，true 是布林值，而加了引號的 "42" 就是字串。

YAML 用縮排來表示層次結構，這是 YAML 最重要的規則，也是最常讓初學者踩坑的地方。縮排必須用空格，絕對不能用 Tab 鍵——這一點和 Python 不同，Python 允許 Tab，但 YAML 不行。通常用 2 個空格代表一層（也有人用 4 個），但同一份文件要保持一致，縮排層次不一致就會解析失敗，K8s 會給你一個很難懂的錯誤訊息。

有一個超級常見的實際場景：你從網路上複製了一份 YAML，貼到編輯器裡，結果裡面混有 Tab 字元，kubectl apply 就報錯了。這種情況讓人非常崩潰，因為肉眼根本看不出 Tab 和空格的差別。解決方法是在 VS Code 右下角確認「空格數」設定，或是用「顯示所有字元」選項把不可見字元顯示出來。

有一個好消息是，VS Code 裝了 YAML 語言支援套件之後，會自動幫你把 Tab 轉換成空格，還會用紅色底線提示語法錯誤。我強烈建議大家裝 VS Code 的 YAML 擴充套件（Red Hat 出的那個），再加上 Kubernetes 擴充套件，它能直接對 K8s YAML 欄位進行型別檢查和自動補全，非常好用，輸入到一半就能看到可以填什麼值。

有沒有人以前用過 YAML？如果有，你一定痛過縮排的問題，哈哈。沒用過的同學要特別記住這個口訣：Tab 是你的敵人，空格是你的朋友。整個課程的 YAML 檔案我都會用 2 個空格縮排，大家跟著這個格式走就對了。遇到任何 YAML 解析錯誤，第一個反應就是檢查縮排——這個習慣能幫你省掉大量排查時間。`,
  },

  // ========== YAML 語法基礎 2 - 列表 ==========
  {
    title: 'YAML 語法：列表與多行文字',
    subtitle: '序列（List）與特殊字串',
    section: 'YAML 入門',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
            <p className="text-slate-500 mb-2"># 列表寫法（- 開頭）</p>
            <p><span className="text-blue-400">containers</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">- </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">nginx:1.25</span></p>
            <p><span className="text-slate-400">- </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">sidecar</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">busybox</span></p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
            <p className="text-slate-500 mb-2"># 多行字串（| 保留換行）</p>
            <p><span className="text-blue-400">command</span><span className="text-slate-400">: |</span></p>
            <p><span className="text-slate-400">  </span><span className="text-green-400">#!/bin/sh</span></p>
            <p><span className="text-slate-400">  </span><span className="text-green-400">echo "Hello"</span></p>
            <p><span className="text-slate-400">  </span><span className="text-green-400">sleep 3600</span></p>
            <p className="mt-2 text-slate-500"># 單行字串列表</p>
            <p><span className="text-blue-400">args</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">- </span><span className="text-green-400">"--port=8080"</span></p>
            <p><span className="text-slate-400">- </span><span className="text-green-400">"--verbose"</span></p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">⚠️ 常見陷阱</p>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm font-mono">
            <div>
              <p className="text-red-400"># ❌ 字串沒加引號（誤判型別）</p>
              <p className="text-slate-300">version: 1.25 <span className="text-red-400">← 被當成數字</span></p>
            </div>
            <div>
              <p className="text-green-400"># ✓ 加引號確保字串</p>
              <p className="text-slate-300">version: <span className="text-green-400">"1.25"</span></p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `繼續 YAML 的進階部分。除了簡單的鍵值對，你在 K8s 裡最常見到的還有兩種結構：列表和巢狀物件，這是寫 K8s YAML 最核心的技巧。

列表用破折號（-）開頭，每個破折號代表一個元素。比如 containers 是一個列表，裡面的每個 - name: xxx 就是一個容器的設定物件。注意破折號和縮排的關係：破折號本身和上面的鍵名保持同一縮排層次，破折號後面跟的物件屬性則再往右縮排兩格（相對於破折號的位置）。這個對齊規則常常讓初學者頭痛，可以這樣記：破折號是第一個屬性的「前綴」，把破折號想成佔了兩個字元，後面的屬性和它左邊對齊。

來看一個具體的例子：如果你有兩個容器，第一個叫 nginx，第二個叫 sidecar，YAML 裡就是兩個破折號開頭的物件，分別有各自的 name 和 image 屬性。每個 - name: 就代表列表裡的一個容器物件的開始。

多行字串有兩種寫法，在 K8s 的 command 和 script 場景很常用：豎線 | 保留換行符號，每一行就是一行；折疊 > 把換行替換成空格，整個多行文字被合併成一行。在 K8s 裡比較常用豎線，因為 Shell 腳本需要保留換行，不然多個指令就全擠在同一行了。

另一個常見陷阱是 YAML 的自動型別推斷。YAML 會根據你寫的值的格式自動猜測型別，這有時候會出人意料。比如 version: 1.25 裡的 1.25 會被當成浮點數 1.25，但如果你要的是字串 "1.25"（比如 docker image tag），就要加引號：version: "1.25"。image: nginx:1.25 沒問題，因為有冒號所以被當成字串，但 image: nginx:latest 裡的 latest 有時候在某些 YAML parser 下也需要加引號，保險起見可以都加。

還有一個讓很多人踩坑的是布林值。YAML 1.1 規範把 yes、no、on、off、true、false 全部都視為布林值。所以如果你的設定值本來是字串 "yes"，不加引號就會被解析成 true，可能造成行為不符合預期。特別是 K8s 的 annotation 裡這個坑很深，因為 annotation 的值都是字串，但如果你不加引號寫 value: true，有些工具處理的時候可能出問題。

另外要知道，多份 YAML 可以放在同一個檔案裡，用三個破折號 --- 作為分隔符。在 K8s 裡很常見一個檔案同時定義 Deployment 和 Service，用 --- 隔開，kubectl apply 一次套用兩個資源，非常方便管理相關聯的資源。

好，YAML 的基礎就這些。最後一個重點提醒：遇到 YAML 解析錯誤，第一件事就是仔細檢查縮排有沒有對齊，九成的 YAML 問題都是縮排出了問題。接下來我們看 K8s 資源的通用結構，你就知道這些 YAML 語法要怎麼套用到真實的 K8s 設定裡了。`,
  },

  // ========== K8s YAML 通用結構 ==========
  {
    title: 'K8s YAML 通用結構',
    subtitle: 'apiVersion, kind, metadata, spec',
    section: 'K8s 資源結構',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># 每個 K8s 資源都有這四個頂層欄位</p>
          <p><span className="text-purple-400">apiVersion</span><span className="text-slate-400">: </span><span className="text-green-400">v1</span><span className="text-slate-500">   # API 群組/版本</span></p>
          <p><span className="text-purple-400">kind</span><span className="text-slate-400">: </span><span className="text-yellow-400">Pod</span><span className="text-slate-500">   # 資源類型</span></p>
          <p><span className="text-purple-400">metadata</span><span className="text-slate-400">:</span><span className="text-slate-500">   # 識別資訊</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">my-pod</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">namespace</span><span className="text-slate-400">: </span><span className="text-green-400">default</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">labels</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">app</span><span className="text-slate-400">: </span><span className="text-green-400">my-app</span></p>
          <p><span className="text-purple-400">spec</span><span className="text-slate-400">:</span><span className="text-slate-500">   # 期望狀態</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">containers</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  - </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">nginx:1.25</span></p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-700/50">
            <p className="text-purple-400 font-semibold">apiVersion</p>
            <p className="text-slate-300">v1 / apps/v1 / batch/v1</p>
            <p className="text-slate-500 text-xs">不同資源屬於不同 API 群組</p>
          </div>
          <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-700/50">
            <p className="text-yellow-400 font-semibold">kind</p>
            <p className="text-slate-300">Pod / Deployment / Service / ConfigMap</p>
            <p className="text-slate-500 text-xs">告訴 K8s 你要建立什麼</p>
          </div>
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700/50">
            <p className="text-blue-400 font-semibold">metadata</p>
            <p className="text-slate-300">name、namespace、labels、annotations</p>
            <p className="text-slate-500 text-xs">辨識和描述這個資源</p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg border border-green-700/50">
            <p className="text-green-400 font-semibold">spec</p>
            <p className="text-slate-300">你希望這個資源長什麼樣</p>
            <p className="text-slate-500 text-xs">每種 kind 的 spec 格式不同</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們進入真正的 Kubernetes YAML 結構。K8s 裡每一種資源，不管是 Pod、Deployment 還是 Service，都遵循同一個四欄位的頂層結構：apiVersion、kind、metadata、spec。這四個欄位是你必須背起來的，因為每一份 K8s YAML 都從這裡開始。你可以把這個結構想成是每個 K8s 資源的「身份證格式」，不管你要建立什麼，一定要先填這四個欄位。

第一個是 apiVersion，告訴 K8s 你用的是哪個版本的 API。K8s 的 API 分成核心群組和具名群組。Pod、Service、ConfigMap、Namespace 等基礎資源屬於核心群組（core group），apiVersion 寫 v1。Deployment、ReplicaSet、StatefulSet 等工作負載資源屬於 apps 群組，寫 apps/v1。CronJob、Job 屬於 batch 群組，寫 batch/v1。記不住沒關係，用 kubectl api-resources 指令可以查每種資源對應的 API 群組和版本。這個指令我建議大家現在就跑一次，印象會更深刻。

第二個是 kind，就是你要建立什麼類型的資源，值是大寫開頭的駝峰命名字串，比如 Pod、Deployment、Service、ConfigMap、Namespace。這個欄位打錯了，K8s 會直接報「no kind registered」的錯誤。

第三個是 metadata，裡面放的是資源的「身份資訊」。name 是必填的，同一個 namespace 裡同類型的資源名稱不能重複，比如不能有兩個名字都叫 nginx-pod 的 Pod。namespace 是選填的，不填就放到 default namespace。labels 是鍵值對的集合，用來標記、分類和篩選資源——後面講 Selector 的時候你會深刻體會到 labels 的重要性。annotations 也是鍵值對，但不用於選取，通常放補充的後設資訊，比如部署工具的版本號、CI/CD 的 build ID、change cause 記錄等。

第四個是 spec，這裡定義你「希望這個資源長什麼樣」，也就是 desired state（期望狀態）。每種 kind 的 spec 格式都不一樣，Pod 的 spec 主要有 containers 列表；Deployment 的 spec 有 replicas（副本數）、selector（選取哪些 Pod）、template（Pod 模板）；Service 的 spec 有 selector（選取後端 Pod）、ports（連接埠對應）。spec 的詳細格式需要查文件，但整體邏輯是一致的——你在 spec 裡描述你要的最終狀態，K8s 幫你實現它。

還有一個你不能直接設定、但會出現在 kubectl get 輸出裡的欄位是 status，那是 K8s 根據實際情況自動填入的，記錄這個資源「目前實際的狀態」，比如 Pod 的 IP、Container 的啟動狀況、Deployment 的當前副本數等。K8s 的核心設計哲學就是不斷對比 spec（你想要什麼）和 status（現在是什麼），然後透過控制器的 reconcile loop 調整，讓 status 趨近 spec。這個 desired state 的設計讓 K8s 非常強大——你宣告你要什麼，K8s 負責實現，就算中間有節點故障、容器崩潰，K8s 也會自動修復回你要的狀態。

實際工作中，你可能會遇到有人說「這個資源的 spec 是什麼？」或者「status 顯示什麼？」，現在你就知道這兩個詞代表的意義了。花幾分鐘把這個四欄位的結構記熟，之後看任何 YAML 檔，你都能快速理解它的意圖。接下來我們就把這個框架套用到最基礎的 Pod YAML 上，讓它從抽象概念變成真實可以 apply 的設定檔。`,
  },

  // ========== Pod YAML 最簡 Pod ==========
  {
    title: 'Pod YAML 撰寫：最簡 Pod',
    subtitle: '從最基本的開始',
    section: 'Pod 操作',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># minimal-pod.yaml</p>
          <p><span className="text-purple-400">apiVersion</span><span className="text-slate-400">: </span><span className="text-green-400">v1</span></p>
          <p><span className="text-purple-400">kind</span><span className="text-slate-400">: </span><span className="text-yellow-400">Pod</span></p>
          <p><span className="text-purple-400">metadata</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">nginx-pod</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">labels</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">app</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
          <p><span className="text-purple-400">spec</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">containers</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  - </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">nginx:1.25</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">ports</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">    - </span><span className="text-blue-400">containerPort</span><span className="text-slate-400">: </span><span className="text-orange-400">80</span></p>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold">🔨 立刻試試看</p>
          <div className="font-mono text-sm mt-2 space-y-1">
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl apply -f minimal-pod.yaml</span></p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `現在讓我們來寫第一份真正的 K8s YAML：一個最簡單的 Pod。請大家打開你的編輯器，跟著我一起寫，這不只是看——請你真的在鍵盤上敲出每一行。

這個 Pod 設定有幾個地方值得細細解釋：

首先是 apiVersion: v1 和 kind: Pod，這對組合告訴 K8s 你要建立一個核心 API 的 Pod 資源。如果你打錯 kind 的大小寫，比如寫成 pod（小寫），K8s 會回報找不到這種資源類型。

metadata.name 是這個 Pod 的名字，在同一個 namespace 裡必須唯一。建立之後你用 kubectl get pods 就會看到這個名字出現在清單裡。

metadata.labels 是我特別想強調的部分。為這個 Pod 打上 app: nginx 的標籤看起來是個小細節，但在 Kubernetes 的世界裡非常關鍵。後面你會看到 Deployment 用 selector 來選取它要管理的 Pod、Service 用 selector 選取它要把流量送到哪些 Pod，全部都是靠 labels 來做匹配的。養成一開始就加 labels 的習慣，後面你一定會感謝你自己。

spec.containers 是一個列表，這個 Pod 只有一個容器叫做 nginx，使用 nginx:1.25 這個 Docker 映像檔。這裡有一個非常重要的最佳實踐：image tag 一定要指定，不要只寫 nginx 不加版本號。如果只寫 nginx，K8s 會去拉 latest tag，但 latest 指向的版本可能隨時被 image 作者更新，今天拉的 latest 和明天拉的 latest 可能是不同版本，這在生產環境中是非常危險的行為——你的 Pod 重啟一次，可能就跑著不同版本的程式碼了。永遠指定明確的版本號，這是容器化部署的黃金原則。

containerPort: 80 告訴 K8s（和看 YAML 的工程師）這個容器監聽 80 連接埠。補充一個常讓人誤解的地方：containerPort 的設定對容器實際能不能接受連線完全沒有影響，它純粹是文件說明的作用（類似 Dockerfile 的 EXPOSE 指令）。即使你不寫這個欄位，容器一樣可以正常監聽 80 port。但寫出來讓其他人一眼就知道服務在哪個 port，是非常好的習慣，特別是在多容器 Pod 或微服務架構裡，這種清楚的文件描述價值很高。

現在請大家在你的練習環境裡建一個工作目錄，把這份 YAML 存成 minimal-pod.yaml，然後用 kubectl apply -f minimal-pod.yaml 套用它。輸完指令之後，用 kubectl get pods 確認 Pod 出現了。剛建立的時候狀態可能是 ContainerCreating，要等它變成 Running 才算完全啟動。這段等待的時間就是 K8s 在幫你從 Container Registry 拉取 image，然後在 Node 上把容器啟動起來。如果是第一次拉 nginx 的 image，可能需要幾十秒，有耐心等一下。`,
  },

  // ========== Pod YAML 多容器與資源限制 ==========
  {
    title: 'Pod YAML：多容器與資源限制',
    subtitle: 'Sidecar 模式與 resources 設定',
    section: 'Pod 操作',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># 多容器 Pod + 資源限制</p>
          <p><span className="text-blue-400">  containers</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  - </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">main-app</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">nginx:1.25</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">resources</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">      </span><span className="text-blue-400">requests</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">        </span><span className="text-blue-400">cpu</span><span className="text-slate-400">: </span><span className="text-orange-400">"100m"</span></p>
          <p><span className="text-slate-400">        </span><span className="text-blue-400">memory</span><span className="text-slate-400">: </span><span className="text-orange-400">"128Mi"</span></p>
          <p><span className="text-slate-400">      </span><span className="text-blue-400">limits</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">        </span><span className="text-blue-400">cpu</span><span className="text-slate-400">: </span><span className="text-orange-400">"500m"</span></p>
          <p><span className="text-slate-400">        </span><span className="text-blue-400">memory</span><span className="text-slate-400">: </span><span className="text-orange-400">"256Mi"</span></p>
          <p><span className="text-slate-400">  - </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">log-sidecar</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">busybox</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">command</span><span className="text-slate-400">: [</span><span className="text-green-400">"sh"</span><span className="text-slate-400">, </span><span className="text-green-400">"-c"</span><span className="text-slate-400">, </span><span className="text-green-400">"tail -f /dev/null"</span><span className="text-slate-400">]</span></p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">requests（最低保障）</p>
            <p className="text-slate-300">排程器用來決定放在哪個 Node</p>
          </div>
          <div className="bg-red-900/30 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">limits（最高上限）</p>
            <p className="text-slate-300">超過會被 OOMKilled 或 CPU Throttle</p>
          </div>
        </div>
      </div>
    ),
    notes: `繼續 Pod 的進階設定，這次看兩個在生產環境非常重要的主題：多容器 Pod（Sidecar 模式）和資源限制（Resource Requests/Limits）。

先說多容器 Pod。一個 Pod 可以跑多個容器，這些容器共享同一個網路命名空間（意思是它們可以用 localhost 互相溝通、共享同一個 IP 位址）和存儲卷（Volume）。最常見的使用模式叫做 Sidecar 模式：主容器（main container）跑你的應用程式，Sidecar 容器提供輔助功能，比如收集和轉送日誌（Fluentd、Logstash）、注入設定和憑證、做安全代理（Service Mesh 裡的 Envoy Proxy）等。以 Istio Service Mesh 為例，它就是自動把 Envoy Proxy 注入到你每個 Pod 裡，作為 Sidecar 容器，攔截所有進出流量並做加密和觀察，而你的主容器完全不需要改任何程式碼。

要注意的是，多容器 Pod 裡的所有容器是同生共死的：Pod 被刪掉，裡面所有容器都跟著消失；某個容器崩潰觸發 Pod 重啟，所有容器都要重啟。所以不要把功能上沒有緊密耦合關係的服務塞進同一個 Pod，該分開就分開。

然後是資源限制，這個在生產環境非常重要，不設的話一個行為不正常的容器可能吃掉整個 Node 的 CPU 或記憶體，影響到同一個 Node 上所有其他的 Pod，造成雪崩效應。

資源設定分兩層：requests 是「我至少需要這麼多資源」，K8s 的排程器（Scheduler）會根據 requests 決定把 Pod 放到哪個 Node——只有有足夠可用資源（超過 requests 的量）的 Node 才會被選中。limits 是「我最多能用這麼多資源」，超過了 CPU 限制，K8s 不會殺容器，而是對它做 CPU Throttling（節流），讓它跑得更慢；超過了 Memory 限制，Linux 的 OOM Killer 就會直接把這個容器 kill 掉，Pod 狀態會變成 OOMKilled，你在 kubectl describe 裡可以看到。

CPU 的單位是 m，代表 millicores，1000m 等於 1 個 CPU core。所以 100m 就是 0.1 個 core，500m 就是半個 core。Memory 的單位推薦用 Mi（Mebibytes，1024 × 1024 bytes）或 Gi（Gibibytes），不要用 MB 或 GB（因為 YAML 裡的 M 代表 Megabytes，1000 × 1000，和 Mi 不同）。128Mi 大約是 134 MB。

實際上怎麼設定 requests 和 limits 的值？新應用剛部署的時候，你可以先給一個估計值，跑一段時間後用 kubectl top pods 指令觀察實際資源使用量，再根據觀察結果調整。另外，如果你用 Kubernetes 的 VPA（Vertical Pod Autoscaler），它可以自動幫你建議和調整資源設定，非常方便。

最佳實踐：requests 一定要設（不然排程器沒辦法做合理的資源規劃）；limits 強烈建議設，特別是 Memory limits（不設 Memory limits 的話，一個記憶體洩漏的程式可以把整個 Node 吃垮）；requests 要根據實際觀察值設定，不要太保守（會浪費資源）也不要太激進（會被排程到資源不夠的 Node）。`,
  },

  // ========== kubectl 基礎指令 ==========
  {
    title: 'kubectl 基礎指令',
    subtitle: 'apply, create, get, describe',
    section: 'kubectl 操作',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3 font-mono text-sm">
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-slate-500 mb-1"># 建立/更新資源（推薦）</p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl apply -f pod.yaml</span></p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl apply -f ./manifests/</span><span className="text-slate-500">  # 整個目錄</span></p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-slate-500 mb-1"># 查看資源</p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods</span></p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods -o wide</span><span className="text-slate-500">  # 顯示 IP 和 Node</span></p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get all</span><span className="text-slate-500">  # 所有資源類型</span></p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-slate-500 mb-1"># 詳細資訊（最重要的 debug 指令）</p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl describe pod nginx-pod</span></p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">💡 apply vs create</p>
          <p className="text-slate-300">apply：不存在就建立，存在就更新（推薦日常使用）</p>
          <p className="text-slate-300">create：只能建立，已存在會報錯（適合一次性場景）</p>
        </div>
      </div>
    ),
    notes: `kubectl 是你和 Kubernetes 溝通的主要工具，就像 SSH 是你和 Linux 伺服器溝通的工具一樣。你可以把 kubectl 想成是 K8s 的 CLI 控制台，幾乎所有的操作——建立資源、查看狀態、排查問題、更新設定——都透過它來完成。花時間熟悉 kubectl 的常用指令，之後工作效率會大幅提升。

先來說 apply 指令。kubectl apply -f 是建立和更新資源最推薦的方式。-f 後面接 YAML 檔案路徑，也可以接一個目錄（kubectl apply -f ./k8s/），kubectl 會把目錄裡所有的 .yaml 和 .yml 檔都套用一遍。apply 具有「冪等性」——意思是不管執行幾次結果都一樣：資源不存在就建立，已存在就更新成 YAML 裡描述的狀態，不存在的欄位維持現有值。這個特性讓 apply 非常適合放進 CI/CD pipeline，每次部署都跑 kubectl apply，不用擔心重複執行的副作用。

create 和 apply 的差別在於：create 只能建立全新的資源，如果資源已經存在就報錯。通常只在一次性測試、快速驗證時用 create，正式的部署流程都用 apply。

get 指令用來列出資源。kubectl get pods 列出目前 namespace 裡的所有 Pod，輸出的 STATUS 欄顯示每個 Pod 的狀態，RESTARTS 欄顯示容器重啟次數。加上 -o wide 選項可以看到更多資訊，包括 Pod 的 IP 位址和跑在哪個 Node 上——這個在多節點叢集裡 debug 網路問題的時候特別有用。加 -n namespace名稱 可以查指定 namespace 的資源，加 --all-namespaces 或縮寫 -A 可以看所有 namespace 的資源，適合在叢集層級做全局排查。

kubectl get all 會列出目前 namespace 裡所有類型的資源，包括 Pod、Deployment、ReplicaSet、Service 等，一次看全貌，非常方便。

describe 是你在 debug 時最常用到的指令，沒有之一。kubectl describe pod nginx-pod 會顯示這個 Pod 的完整詳細資訊，包括：基本資訊（所在 Node、IP、Labels）、容器資訊（image、ports、resource limits）、掛載的 Volume、以及最重要的——Events 區塊。

Events 區塊記錄了 K8s 對這個 Pod 做的每一個操作，包括「Scheduled 到哪個 Node」、「正在 Pulling image」、「Successfully pulled image」、「Container started」，以及任何失敗的事件和原因。當你的 Pod 一直不啟動、或是狀態不對的時候，kubectl describe 看 Events 幾乎是第一個要做的動作，80% 的情況下你在這裡就能找到問題所在。

還有一個重要的 get 用法是加上 -o yaml 輸出原始的 YAML 格式，kubectl get pod nginx-pod -o yaml 可以看到 K8s 實際存在 etcd 裡的完整資源設定，包括 K8s 自動加入的 annotation 和 status 欄位，對理解 K8s 的內部運作非常有幫助。

現在大家跟我一起操作：先確認你的 nginx-pod 在 Running 狀態，然後用 kubectl describe pod nginx-pod 看看輸出的內容，特別注意最下方的 Events 區塊，觀察 K8s 對這個 Pod 做了哪些操作。這個觀察習慣要從現在開始養成。`,
  },

  // ========== kubectl logs/exec/delete ==========
  {
    title: 'kubectl logs, exec, delete',
    subtitle: '查看日誌、進入容器、刪除資源',
    section: 'kubectl 操作',
    duration: '10',
    content: (
      <div className="space-y-4 font-mono text-sm">
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-slate-500 mb-1"># 查看日誌</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl logs nginx-pod</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl logs nginx-pod -f</span><span className="text-slate-500">  # 持續追蹤</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl logs nginx-pod --tail=50</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl logs nginx-pod -c nginx</span><span className="text-slate-500">  # 多容器時指定</span></p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-slate-500 mb-1"># 進入容器執行指令</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl exec -it nginx-pod -- bash</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl exec nginx-pod -- cat /etc/nginx/nginx.conf</span></p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-slate-500 mb-1"># 刪除資源</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl delete pod nginx-pod</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl delete -f pod.yaml</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl delete pod nginx-pod --grace-period=0</span><span className="text-slate-500">  # 強制刪除</span></p>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-xs">
          <p className="text-yellow-400 font-semibold">⚠️ 單一 Pod 被刪除後不會自動重建，Deployment 管理的 Pod 才會！</p>
        </div>
      </div>
    ),
    notes: `繼續 kubectl 的指令。logs、exec、delete 是你每天都會用到的三個核心操作，把這三個學好，你就能處理大多數的日常 K8s 維運任務。

logs 用來查看容器的輸出日誌，相當於直接讀取容器的 stdout 和 stderr。不加任何選項顯示目前為止的所有 log（可能會很長）；加 -f（follow）就是即時追蹤，程式實時輸出的 log 會馬上出現，就像 Linux 的 tail -f，按 Ctrl+C 結束追蹤；加 --tail=N 只顯示最後 N 行，在 log 量很大的時候非常好用，比如 --tail=100 只看最近 100 行。

如果 Pod 之前崩潰過，想看它崩潰前的 log，可以加 --previous 選項，kubectl logs nginx-pod --previous，這樣看的是前一個容器實例的 log，對找出 crash 原因非常重要。如果一個 Pod 裡有多個容器，必須用 -c 指定容器名稱，不然 kubectl 不知道你要看哪個容器的 log，直接報錯。

exec 讓你進入一個正在跑的容器裡面執行指令，非常像 Docker 的 docker exec 指令。-i 是 interactive（互動式，保持 stdin 開啟），-t 是 tty（分配一個偽終端機），兩個合起來寫 -it 讓你可以進入互動式的 shell，就像 SSH 進一台主機一樣。-- 後面是要在容器裡執行的指令，通常是 bash（Debian/Ubuntu 系的 image）或是 sh（Alpine 系的輕量 image 通常沒有 bash）。

進到容器之後，你可以做任何需要直接排查的操作：cat 設定檔、ps 查看程序、curl 測試 API 連通性、ls 確認檔案存不存在等等。需要退出的時候輸入 exit 或按 Ctrl+D。這是在沒有其他辦法的情況下，直接進容器排查問題的最後手段，建議只在開發測試環境使用，生產環境要謹慎，因為對跑著的容器做任何修改都不會持久化（重啟後就消失了）。

還有一個很實用的 exec 用法是不進入互動式 shell，直接執行一個指令然後看輸出：kubectl exec nginx-pod -- cat /etc/nginx/nginx.conf 直接把 nginx 設定檔的內容印出來，不需要進入互動模式，適合快速查看某個資訊。

delete 刪除資源。kubectl delete pod nginx-pod 刪除指定名稱的 Pod；kubectl delete -f pod.yaml 刪除 YAML 檔案裡定義的所有資源，方便刪除整組相關資源；kubectl delete pods --all 刪除目前 namespace 裡所有的 Pod（小心使用！）。

K8s 刪除資源的時候有一個「優雅停止期」（graceful termination period），預設 30 秒。K8s 先對容器發 SIGTERM 信號，給它機會優雅地完成當前處理、關閉連線、儲存狀態，30 秒後如果還沒停止，才強制發 SIGKILL。如果你想跳過等待立刻強制刪除，加 --grace-period=0 --force，但要注意強制刪除可能導致服務的客戶端連線直接被切斷，生產環境要謹慎。

特別要注意一件事：直接用 kubectl apply -f pod.yaml 建立的 Pod，被 delete 了就不見了，K8s 不會自動幫你重建，因為沒有控制器在管它。只有 Deployment 這類工作負載控制器管理的 Pod，被刪了才會自動被重建補回來。這是很多初學者容易搞混的地方，等一下學 Deployment 的時候你就會完全理解這個差異了。`,
  },

  // ========== Pod 生命週期觀察 ==========
  {
    title: 'Pod 生命週期觀察',
    subtitle: 'kubectl get pods -w 即時監看',
    section: 'Pod 操作',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-500"># -w (watch) 即時監看 Pod 狀態變化</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods -w</span></p>
          <p className="text-slate-300 mt-2">NAME        READY   STATUS              RESTARTS   AGE</p>
          <p className="text-yellow-400">nginx-pod   0/1     Pending             0          0s</p>
          <p className="text-yellow-400">nginx-pod   0/1     ContainerCreating   0          1s</p>
          <p className="text-green-400">nginx-pod   1/1     Running             0          5s</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { status: 'Pending', color: 'yellow', desc: '等待排程或 Pull 映像檔' },
            { status: 'ContainerCreating', color: 'blue', desc: '正在啟動容器' },
            { status: 'Running', color: 'green', desc: '容器正常執行中' },
            { status: 'CrashLoopBackOff', color: 'red', desc: '容器不斷崩潰重啟' },
            { status: 'OOMKilled', color: 'red', desc: '記憶體超出 limit' },
            { status: 'Completed', color: 'purple', desc: '容器成功執行完畢（Job）' },
          ].map((s, i) => (
            <div key={i} className={`bg-${s.color}-900/30 border border-${s.color}-700/50 p-3 rounded-lg`}>
              <p className={`text-${s.color}-400 font-semibold text-xs font-mono`}>{s.status}</p>
              <p className="text-slate-300 text-xs mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `kubectl get pods -w 這個指令非常實用，-w 是 watch 的縮寫，執行後不會立刻回到命令提示符，而是持續在畫面上即時更新 Pod 的狀態變化。這讓你可以動態觀察 Pod 從被建立到完全跑起來的整個過程，或是觀察你做了某個操作（比如更新 image、刪除 Pod）之後，系統如何反應、狀態如何流轉。用 Ctrl+C 結束監看。另一個類似的做法是 watch kubectl get pods，每兩秒重整一次輸出，適合在終端機比較小的時候使用。

讓我們來認識 Pod 的主要狀態，這些你在日常操作中一定會反覆碰到：

Pending：K8s 已經接受了這個 Pod 的建立請求，但還沒真正開始啟動。可能是在等待 Scheduler 找到合適的 Node（如果所有 Node 資源都不夠，可能就一直 Pending 下去），也可能是 Scheduler 已經分配好 Node，但 Node 上的 kubelet 正在拉 container image。如果 image 很大（幾個 GB）或是 image registry 連線很慢，Pending 的時間可能會長達幾分鐘。

ContainerCreating：Scheduler 已選好 Node，kubelet 已拉好 image，正在建立容器並啟動中。通常這個階段很短暫，幾秒鐘就會進入 Running。

Running：至少一個容器正在執行中。但要注意，Running 不代表應用程式正常服務——如果你設定了 readinessProbe，容器要通過 readiness 探針才算真正 Ready；READY 欄位的 1/1 表示 Pod 裡的 1 個容器都 Ready 了。

CrashLoopBackOff：容器啟動之後馬上崩潰，K8s 嘗試重啟，但又崩潰，不斷重複。每次重啟之間的等待時間會以指數級增長（10 秒、20 秒、40 秒、80 秒…最多 5 分鐘），這就是 Backoff 的意思，避免不斷重啟消耗過多資源。看到這個狀態，第一個動作是 kubectl logs pod名稱 --previous 看前一次崩潰時的 log，找出程式崩潰的原因。常見原因有：程式本身有 bug、設定檔錯誤導致程式啟動失敗、缺少必要的環境變數、依賴的外部服務（資料庫、API）還沒就緒等。

OOMKilled：容器使用的記憶體超過了 limits.memory 的設定值，被 Linux 內核的 OOM Killer 強制殺掉。你在 kubectl describe 的 Container 資訊裡可以看到 Last State: Terminated, Reason: OOMKilled。解法有兩個：一是調高 limits.memory 的數值；二是找出程式的記憶體洩漏並修復。

ImagePullBackOff（或 ErrImagePull）也很常見，代表 K8s 拉不到指定的 container image。常見原因：image 名稱或 tag 打錯（比如寫成 ngnix 而不是 nginx）、image tag 不存在（比如你指定的版本號其實沒有 push 到 registry）、image 在私有 registry 裡但沒有設定 imagePullSecrets（認證資訊）。遇到這個狀態，先用 kubectl describe 看 Events 確認確切的錯誤訊息。

Terminating：Pod 正在關閉中，等待 grace period 結束（預設 30 秒）或容器自己優雅退出。如果 Pod 一直卡在 Terminating 停不下來，可以用 --grace-period=0 --force 強制刪除。

現在請大家做個練習：先在一個終端機跑 kubectl get pods -w，然後在另一個終端機跑 kubectl delete pod nginx-pod，在第一個視窗觀察 Pod 從 Terminating 消失的過程；接著再跑 kubectl apply -f minimal-pod.yaml，觀察 Pod 從 Pending 到 ContainerCreating 到 Running 的完整生命週期。這種即時觀察非常有助於建立對 K8s 工作原理的直覺感。`,
  },

  // ========== Namespace 概念 ==========
  {
    title: 'Namespace 概念與操作',
    subtitle: '叢集中的虛擬隔離空間',
    section: 'Namespace',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 w-full">
            <p className="text-center text-k8s-blue font-bold mb-3">Kubernetes 叢集</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { ns: 'default', desc: '預設 namespace', pods: ['nginx-pod', 'my-app'], color: 'blue' },
                { ns: 'kube-system', desc: 'K8s 系統元件', pods: ['coredns', 'kube-proxy'], color: 'red' },
                { ns: 'production', desc: '生產環境', pods: ['api-server', 'db-proxy'], color: 'green' },
              ].map((ns, i) => (
                <div key={i} className={`bg-${ns.color}-900/30 border border-${ns.color}-700/50 p-3 rounded-lg`}>
                  <p className={`text-${ns.color}-400 font-semibold text-sm`}>{ns.ns}</p>
                  <p className="text-slate-500 text-xs mb-2">{ns.desc}</p>
                  {ns.pods.map((p, j) => (
                    <div key={j} className="bg-slate-700/50 p-1 rounded text-xs text-slate-300 mb-1">{p}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm space-y-1">
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get namespaces</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl create namespace production</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods -n kube-system</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl config set-context --current --namespace=production</span></p>
        </div>
      </div>
    ),
    notes: `Namespace 是 Kubernetes 裡一個非常重要的概念，讓你在同一個實體叢集裡建立多個虛擬的隔離空間。不同 namespace 之間的資源是邏輯隔離的——同名的資源可以分別存在於不同 namespace 而不會衝突，但它們底層還是共享同一批 Node 的計算資源。Namespace 是軟性隔離，不是容器層級的強硬隔離，所以安全性上還需要搭配 RBAC、NetworkPolicy 等機制來強化。

為什麼需要 Namespace？讓我用一個很常見的實際場景說明。想像你的公司有一個 K8s 叢集，你想同時跑開發環境（dev）、測試環境（staging）和生產環境（production）。如果沒有 namespace，這三個環境的 Pod、Service、ConfigMap 名稱全部都必須唯一，而且你在排查問題的時候很難快速辨認哪個資源屬於哪個環境。有了 namespace，你在 dev 和 production 裡都可以有一個叫 api-server 的 Pod，互不干擾。你執行 kubectl get pods -n production 就只看到生產環境的 Pod，視角清晰，管理方便。

另一個非常普遍的用途是多團隊隔離。大型公司的 K8s 叢集可能由多個產品團隊共用，每個團隊有自己的 namespace。搭配 RBAC（Role-Based Access Control），你可以限制 A 團隊的工程師只有 A 命名空間的操作權限，看不到也動不了 B 團隊的資源。這叫做多租戶（multi-tenancy）管理，是企業級 K8s 平台的重要設計模式。

K8s 預設建立幾個系統 namespace：default 是你不指定 namespace 時的預設位置，新手最常待在這裡；kube-system 放的是 K8s 本身的系統元件，包括 CoreDNS（叢集內 DNS 服務）、kube-proxy（負責 Service 流量轉發）、kube-apiserver、scheduler 等，這個 namespace 的東西不要隨便動，刪掉系統 Pod 可能讓整個叢集出問題；kube-public 的內容所有使用者都可以讀，通常放叢集的基本資訊；kube-node-lease 放各個 Node 的心跳（Lease）物件，讓 Control Plane 知道哪些 Node 還活著。

指令操作方面：kubectl get namespaces（或縮寫 kubectl get ns）列出所有 namespace，你可以看到 STATUS 和 AGE；kubectl create namespace production 建立一個叫 production 的 namespace，也可以用 YAML 的方式 kubectl apply -f namespace.yaml 建立，這樣可以加上 labels 等後設資訊。

幾乎所有的 kubectl 指令都支援 -n 或 --namespace 選項來指定 namespace，不加的話預設就是 default。如果你常常在某個特定 namespace 操作，可以用 kubectl config set-context --current --namespace=production 把目前 context 的預設 namespace 改成 production，之後所有指令就自動對 production namespace 操作，不用每次都加 -n。記得做完操作要切回去，或是用工具如 kubens（kubectx 套件的一部分）來快速切換，這在管理多個 namespace 的時候非常方便。

還有一個很常見的 debug 場景：你跑 kubectl get pods 顯示 No resources found，但你確定剛才部署了東西。這種時候八成是 namespace 搞錯了，加上 -A 或 --all-namespaces 看看所有 namespace 的 Pod，很可能你的 Pod 就在某個你沒預期到的 namespace 裡。

最後補充一個重要的知識點：不是所有的 K8s 資源都屬於某個 namespace。像 Node、PersistentVolume、StorageClass、ClusterRole 這類叢集層級的資源是 namespace 無關的（cluster-scoped），不屬於任何 namespace，用 kubectl get 不加 -n 就能查到全叢集的資源。你可以用 kubectl api-resources --namespaced=true 列出所有 namespace-scoped 的資源類型，--namespaced=false 列出叢集層級的資源類型。`,
  },

  // ========== 休息 ==========
  {
    title: '☕ 休息時間',
    subtitle: '15 分鐘，等等進入 Deployment',
    duration: '1',
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          上了兩個小時了，讓我們稍微喘口氣！
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400 mb-2">下半場主題</p>
          <p className="text-xl text-k8s-blue">Deployment · 滾動更新 · ConfigMap · Label</p>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg max-w-md mx-auto">
          <p className="text-k8s-blue font-semibold">💡 休息前快速回顧</p>
          <ul className="text-slate-300 text-sm text-left mt-2 space-y-1">
            <li>✓ YAML 縮排要用空格不能用 Tab</li>
            <li>✓ K8s 資源有四個頂層欄位</li>
            <li>✓ kubectl apply / get / describe / logs / exec</li>
            <li>✓ Namespace 是叢集的虛擬隔離空間</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，我們已經上了差不多一個半小時了，讓我們休息 15 分鐘。

趁休息的時候可以上廁所、活動一下。剛才學了不少東西：YAML 語法、K8s 資源結構、Pod 的撰寫、kubectl 的常用指令、還有 Namespace 的概念。這些是 K8s 操作的基礎，接下來下半段要建立在這個基礎上。

如果剛才有任何地方沒跟上，趁現在可以來問我或助教，我們幫你補上進度。

15 分鐘後我們繼續，進入今天最精彩的部分：Deployment！Deployment 是你在生產環境最常用到的 K8s 資源類型，學完之後你就能部署一個有多個副本、可以滾動更新、可以版本回滾的應用程式。準時回來！`,
  },

  // ========== Deployment 概念與建立 ==========
  {
    title: 'Deployment 建立與管理',
    subtitle: 'replicas, selector, template',
    section: 'Deployment',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># nginx-deployment.yaml</p>
          <p><span className="text-purple-400">apiVersion</span><span className="text-slate-400">: </span><span className="text-green-400">apps/v1</span></p>
          <p><span className="text-purple-400">kind</span><span className="text-slate-400">: </span><span className="text-yellow-400">Deployment</span></p>
          <p><span className="text-purple-400">metadata</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">nginx-deployment</span></p>
          <p><span className="text-purple-400">spec</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">replicas</span><span className="text-slate-400">: </span><span className="text-orange-400">3</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">selector</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">matchLabels</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">      </span><span className="text-blue-400">app</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
          <p><span className="text-slate-400">  </span><span className="text-blue-400">template</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">metadata</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">      </span><span className="text-blue-400">labels</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">        </span><span className="text-blue-400">app</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
          <p><span className="text-slate-400">    </span><span className="text-blue-400">spec</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">      </span><span className="text-blue-400">containers</span><span className="text-slate-400">:</span></p>
          <p><span className="text-slate-400">      - </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
          <p><span className="text-slate-400">        </span><span className="text-blue-400">image</span><span className="text-slate-400">: </span><span className="text-green-400">nginx:1.25</span></p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-700/50">
            <p className="text-orange-400 font-semibold">replicas</p>
            <p className="text-slate-300">要跑幾個 Pod 副本</p>
          </div>
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700/50">
            <p className="text-blue-400 font-semibold">selector</p>
            <p className="text-slate-300">用 matchLabels 選取管理哪些 Pod</p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg border border-green-700/50">
            <p className="text-green-400 font-semibold">template</p>
            <p className="text-slate-300">建立 Pod 時用的模板</p>
          </div>
        </div>
      </div>
    ),
    notes: `休息完了，精神好一點了嗎？讓我們進入 Deployment，這是整個下午最核心的主題，也是你在真實工作中每天都要操作的 K8s 資源類型。

先問大家一個問題：如果你直接用 kubectl apply -f pod.yaml 建立一個 Pod，然後這個 Pod 因為 Node 硬體故障或是容器崩潰而消失了，K8s 會不會自動幫你重建？答案是：不會！直接建立的 Pod（也叫做「裸 Pod」，Bare Pod）沒有任何控制器保護它，一旦消失就真的消失了。在 K8s 的世界裡，裸 Pod 只適合在開發和測試環境用來快速驗證一些東西，生產環境絕對不應該直接跑裸 Pod。

這就是 Deployment 存在的意義。Deployment 是 K8s 裡的一種「工作負載控制器」（Workload Controller），它告訴 K8s：「我要永遠維持 3 個副本的 nginx 在跑，不管發生什麼事，你都要幫我維持這個狀態。」K8s 的 Deployment Controller 持續運行一個 reconcile loop，不斷比對「期望的副本數」（你設定的 replicas）和「目前實際跑著的副本數」，如果少了就自動建立新的 Pod 補回來，多了就刪除多餘的。這種自我修復（self-healing）的能力是 Kubernetes 最核心的價值之一。

讓我用一個真實場景說明 Deployment 的威力。假設你部署了一個 Web API，replicas 設成 3（三個副本）。某天半夜，一台 Node 的硬碟爆了，機器掛掉，上面的 2 個 Pod 就消失了。如果是裸 Pod，你早上來上班才發現你的服務只剩三分之一的處理能力。但如果是 Deployment，K8s 在幾秒鐘內就自動在其他健康的 Node 上建立了 2 個新的 Pod，你的服務幾乎不受影響，你甚至可能完全不知道有節點故障發生過，直到你早上查 Events 才發現。這就是為什麼生產環境要用 Deployment。

現在來看 Deployment 的 YAML 結構，有三個核心欄位：

replicas 設定要維持幾個 Pod 副本。你可以隨時用 kubectl scale deployment nginx-deployment --replicas=5 動態調整（不需要改 YAML），也可以改 YAML 裡的數值再 kubectl apply，兩種方式都可以。但注意，如果你同時用兩種方式（有時用指令改、有時用 YAML 改），可能造成實際 replicas 和 YAML 裡的值不一致，GitOps 的最佳實踐是所有變更都透過 YAML 來管理，保持 YAML 是唯一真相來源（Single Source of Truth）。

selector.matchLabels 告訴 Deployment 它管理哪些 Pod：帶有 app: nginx 標籤的 Pod 都歸我管。這個欄位必須和 template.metadata.labels 裡的標籤完全一致，否則 K8s 會拒絕建立這個 Deployment——因為如果不一致，Deployment 建立的 Pod 反而不會被自己的 selector 選到，邏輯上根本說不通。

template 是建立 Pod 的模板，裡面的 metadata.labels 和 spec 的結構和你直接寫 Pod YAML 完全一樣，只是不需要頂層的 apiVersion 和 kind（因為 Deployment 知道它要建立的就是 Pod）。每次 Deployment 需要建立新的 Pod 時，就會用這個 template 來建。

一個很多人一開始搞不清楚的點：Deployment 不直接管理 Pod，而是管理一個中間層叫做 ReplicaSet，再由 ReplicaSet 去管理 Pod。你跑 kubectl get all 會看到三層：deployment → replicaset → pod。每次你更新 Deployment 的 template（比如換一個新的 image），K8s 會建立一個新的 ReplicaSet，然後慢慢把 Pod 從舊 ReplicaSet 切換到新 ReplicaSet——這就是滾動更新的機制。舊的 ReplicaSet 不會馬上刪掉，保留起來是為了支持回滾功能。一般來說你不需要直接操作 ReplicaSet，操作 Deployment 就夠了。

現在跟著我一起操作：把這份 YAML 存成 nginx-deployment.yaml，kubectl apply 套用，然後用 kubectl get pods 看三個 Pod 被建立出來；再用 kubectl get deployment 看 Deployment 的狀態，READY 欄位顯示 3/3 就代表三個副本都已就緒；用 kubectl get replicaset 看中間那層 ReplicaSet。接著做一個驗證：用 kubectl delete pod 刪掉其中一個 Pod，然後立刻觀察，你會看到 K8s 馬上自動建立一個新的 Pod 補回來，這就是 Deployment 的自我修復能力。`,
  },

  // ========== 滾動更新 ==========
  {
    title: '滾動更新',
    subtitle: 'kubectl rollout status / history',
    section: '滾動更新與回滾',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-500"># 更新 image（觸發滾動更新）</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl set image deployment/nginx-deployment nginx=nginx:1.26</span></p>
          <p className="mt-2 text-slate-500"># 觀察滾動更新進度</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout status deployment/nginx-deployment</span></p>
          <p className="text-slate-300">Waiting for deployment "nginx-deployment" rollout to finish...</p>
          <p className="text-slate-300">1 out of 3 new replicas have been updated...</p>
          <p className="text-green-400">deployment "nginx-deployment" successfully rolled out</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">滾動更新策略（RollingUpdate）</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex gap-1">
              {['🟢','🟢','🟢'].map((e,i)=><span key={i}>{e}</span>)}
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex gap-1">
              {['🔵','🟢','🟢'].map((e,i)=><span key={i}>{e}</span>)}
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex gap-1">
              {['🔵','🔵','🟢'].map((e,i)=><span key={i}>{e}</span>)}
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex gap-1">
              {['🔵','🔵','🔵'].map((e,i)=><span key={i}>{e}</span>)}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">🟢 舊版本 → 🔵 新版本，逐步替換，服務不中斷</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># 查看更新歷史</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout history deployment/nginx-deployment</span></p>
        </div>
      </div>
    ),
    notes: `Deployment 最強大的功能之一是滾動更新（Rolling Update）。這讓你可以在完全不中斷服務的情況下，把正在提供流量的應用程式從舊版本更新到新版本，用戶完全感受不到中斷。這在持續交付（Continuous Delivery）的工作流程中是非常關鍵的能力。

讓我來解釋滾動更新的運作機制。假設你有 3 個 Pod 跑著 nginx:1.25，你要更新到 nginx:1.26。K8s 不會採用「先殺光再重建」的方式（那樣會造成服務中斷），而是逐步替換：先建立 1 個 nginx:1.26 的新 Pod，等它通過 readinessProbe 確認 Ready，再停掉 1 個舊的 nginx:1.25 Pod，然後再建 1 個新 Pod，等它 Ready，再停 1 個舊的，如此循環直到全部替換完成。整個過程中永遠有 Pod 在提供服務，服務不中斷。

這個過程由兩個參數控制，在 Deployment spec.strategy.rollingUpdate 裡設定：maxSurge（最多同時多幾個 Pod，預設 25%）和 maxUnavailable（最多同時有幾個 Pod 不可用，預設 25%）。對於 3 個副本的 Deployment，maxSurge=1 代表更新時最多可以跑到 4 個 Pod；maxUnavailable=0 代表任何時刻都不能有 Pod 處於不可用狀態，確保服務容量不下降。你可以根據自己的需求調整這兩個值，追求更快的更新速度或更保守的服務保障。

觸發滾動更新有兩種主要方式。第一種是用指令直接更改：kubectl set image deployment/nginx-deployment nginx=nginx:1.26，這個指令直接更新 Deployment 的 container image 設定。第二種是修改 YAML 檔案裡的 image 版本，然後 kubectl apply，這讓你在 Git 裡留下版本記錄。在 GitOps 的工作流程裡，所有的部署都透過 Git commit 觸發，所以第二種方式更符合最佳實踐，任何時候都能在 Git history 裡找到是誰、什麼時候、部署了什麼版本。

kubectl rollout status 是查看滾動更新進度的指令，執行後會一直等待直到更新完成才回到命令提示符，過程中會印出目前有多少新版本的 Pod 已經 Ready。在 CI/CD pipeline 裡，這個指令扮演非常重要的角色：你的部署腳本在跑完 kubectl apply 之後，緊接著跑 kubectl rollout status --timeout=5m，等它成功才繼續後面的步驟（比如跑整合測試、發 Slack 通知說部署成功）。如果 5 分鐘內沒有成功，kubectl rollout status 會退出並回傳非零的 exit code，你的 CI/CD pipeline 就會知道部署失敗，可以觸發告警和自動回滾。

kubectl rollout history 可以查看 Deployment 的歷史更新記錄，每次更新會建立一個新的 revision 號碼（1、2、3……）。預設 K8s 保留最多 10 個歷史 revision（可以用 spec.revisionHistoryLimit 調整）。搭配 kubectl rollout history deployment/nginx-deployment --revision=2 可以看指定 revision 的詳細資訊，包括那個版本使用的是什麼 image。

要讓 CHANGE-CAUSE 欄位顯示有意義的資訊（而不是 none），可以在 kubectl apply 的時候加上 annotation：kubectl annotate deployment nginx-deployment kubernetes.io/change-cause="更新 nginx 到 1.26，修復 CVE-2024-xxx 安全漏洞"，或者直接在 YAML 的 metadata.annotations 裡寫好，這樣每次 apply 的時候 change-cause 就自動記錄下來，是非常好的文件化習慣。`,
  },

  // ========== 版本回滾 ==========
  {
    title: '版本回滾',
    subtitle: 'kubectl rollout undo',
    section: '滾動更新與回滾',
    duration: '10',
    content: (
      <div className="space-y-4 font-mono text-sm">
        <div className="bg-slate-800 p-4 rounded-lg space-y-1">
          <p className="text-slate-500"># 查看更新歷史（要看 revision 號碼）</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout history deployment/nginx-deployment</span></p>
          <p className="text-slate-300">REVISION  CHANGE-CAUSE</p>
          <p className="text-slate-300">1         &lt;none&gt;</p>
          <p className="text-slate-300">2         &lt;none&gt;</p>
          <p className="mt-3 text-slate-500"># 回滾到上一個版本</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout undo deployment/nginx-deployment</span></p>
          <p className="mt-2 text-slate-500"># 回滾到指定 revision</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout undo deployment/nginx-deployment --to-revision=1</span></p>
          <p className="mt-2 text-slate-500"># 暫停滾動更新（先暫停再改，改完再繼續）</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout pause deployment/nginx-deployment</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl rollout resume deployment/nginx-deployment</span></p>
        </div>
        <div className="bg-green-900/30 border border-green-700/50 p-3 rounded-lg text-xs font-sans">
          <p className="text-green-400 font-semibold">✓ 最佳實踐</p>
          <p className="text-slate-300">在 YAML 的 metadata.annotations 加上 kubernetes.io/change-cause 紀錄變更原因，rollout history 才看得到 CHANGE-CAUSE</p>
        </div>
      </div>
    ),
    notes: `有了滾動更新，就必須有回滾（Rollback）的能力，這兩個功能是硬幣的兩面，缺一不可。在快速迭代的開發環境下，新版本部署上線後才發現 bug 是常有的事；具備秒級回滾的能力，是讓你能夠放心快速部署的心理保障。

kubectl rollout undo 就是回滾指令。不加任何參數，就回到上一個 revision（也就是最近一次更新之前的狀態）；加 --to-revision=N 可以回到任何一個特定的歷史版本。回滾本身也是一個「更新」操作，K8s 會用完全相同的滾動更新機制把 Pod 逐個換回舊版本，整個過程服務不中斷，用戶無感。

讓我描述一個我親身經歷過的典型場景：某個下午你把 API 服務從 v1.5 更新到 v1.6，十分鐘後 Slack 上開始有人說「哇幹怎麼一直 500 錯誤」，監控告警也跳出來了。你立刻跑 kubectl rollout undo deployment/api-server，30 秒內所有 Pod 都回到 v1.5，告警解除，同事恢復正常工作。然後你有充足的時間去查 v1.6 的 bug，修好了再重新上線。這就是為什麼回滾能力在生產環境如此重要——它讓你在「快速推進」和「系統穩定」之間取得平衡，出問題不怕，回滾就好，修完再上。

kubectl rollout history 讓你看更新歷史，最多保留 spec.revisionHistoryLimit 個版本（預設 10）。你可以在 rollout history 上看到所有的 revision 號碼，用 --revision=N 看特定版本的詳細資訊，包括那個版本的 image。搭配有意義的 CHANGE-CAUSE annotation，你的 rollout history 就像一份清晰的部署日誌：「revision 3：升級 nginx 到 1.26 修復安全漏洞」、「revision 4：調整 memory limits 解決 OOM 問題」，任何時候想知道「之前的某個版本是什麼樣的」都能查到。

pause 和 resume 是一對非常強大的指令組合，可以用來實現一種簡單版的金絲雀發布（Canary Release）。比如你的 Deployment 有 10 個副本，你先跑 kubectl rollout pause，然後更新 image 觸發滾動更新，K8s 開始替換第一個 Pod，但因為 pause 了，替換完第一個就停下來。這時候你有 9 個舊版本的 Pod 和 1 個新版本的 Pod 同時在跑，可以觀察這個新版本的表現——看 log、看監控指標、甚至讓部分流量走新版本。如果沒問題，跑 kubectl rollout resume 讓更新繼續；如果發現問題，kubectl rollout undo 立刻回到全部舊版本。這個技術雖然不如正式的金絲雀部署方案（比如用 Argo Rollouts 或 Flagger）那麼完整，但不需要任何額外工具，在緊急情況下非常好用。

一個進階的使用情境：在 CI/CD pipeline 裡，你可以先 pause，部署一個 Pod，跑快速冒煙測試，測試通過再 resume。這樣比起直接全量更新更保守，適合改動比較大的版本。

最後要提一個限制：kubectl rollout undo 只能回到有歷史記錄的 revision，如果 revisionHistoryLimit 設得太小（比如設成 0 就完全不保留歷史），你就沒辦法回滾了。所以在追求節省 etcd 空間的同時，要在 revisionHistoryLimit 和回滾能力之間做適當的取捨，通常保留 3-5 個版本就夠用了。`,
  },

  // ========== ConfigMap ==========
  {
    title: 'ConfigMap 建立與使用',
    subtitle: '把設定值從容器映像中分離',
    section: 'ConfigMap',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 font-mono text-sm">
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-slate-500 mb-2"># 建立 ConfigMap</p>
            <p><span className="text-purple-400">apiVersion</span><span className="text-slate-400">: </span><span className="text-green-400">v1</span></p>
            <p><span className="text-purple-400">kind</span><span className="text-slate-400">: </span><span className="text-yellow-400">ConfigMap</span></p>
            <p><span className="text-purple-400">metadata</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">app-config</span></p>
            <p><span className="text-purple-400">data</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">APP_ENV</span><span className="text-slate-400">: </span><span className="text-green-400">production</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">LOG_LEVEL</span><span className="text-slate-400">: </span><span className="text-green-400">info</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">config.yaml</span><span className="text-slate-400">: |</span></p>
            <p><span className="text-slate-400">    </span><span className="text-green-400">host: localhost</span></p>
            <p><span className="text-slate-400">    </span><span className="text-green-400">port: 5432</span></p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-slate-500 mb-2"># Pod 中使用 ConfigMap</p>
            <p><span className="text-blue-400">    env</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">    - </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">APP_ENV</span></p>
            <p><span className="text-slate-400">      </span><span className="text-blue-400">valueFrom</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">        </span><span className="text-blue-400">configMapKeyRef</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">          </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">app-config</span></p>
            <p><span className="text-slate-400">          </span><span className="text-blue-400">key</span><span className="text-slate-400">: </span><span className="text-green-400">APP_ENV</span></p>
            <p className="mt-2"><span className="text-blue-400">    envFrom</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">    - </span><span className="text-blue-400">configMapRef</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">        </span><span className="text-blue-400">name</span><span className="text-slate-400">: </span><span className="text-green-400">app-config</span></p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ ConfigMap vs Secret</p>
          <p className="text-slate-300">ConfigMap 存一般設定，Secret 存密碼/憑證（Base64 編碼，但不是加密！）</p>
        </div>
      </div>
    ),
    notes: `ConfigMap 解決了一個在容器化應用中非常普遍且重要的問題：設定值管理。這個議題在面試中也很常被問到，理解它的設計哲學和正確用法非常有價值。

讓我先說問題是什麼。你把應用程式打包成 Docker image，image 裡有程式碼、執行環境和所有依賴，是一個不可變的（immutable）建置產物。但很多設定是環境相關的：連接 dev 資料庫的 URL 和連接 production 資料庫的 URL 不同、日誌等級 dev 用 debug 而 production 用 info、feature flag 在不同環境開啟不同的功能。如果你把這些設定硬編碼（hardcode）進 image，你就要為每個環境分別打包一個 image，維護起來是噩夢，而且違反了「一個 image，到處跑」的容器化原則。

ConfigMap 的出現讓你可以把設定值從 image 中完全分離出來。同一個 image 在 dev 和 production 環境表現不同，原因是它們使用不同的 ConfigMap，而不是不同的 image。這符合 Twelve-Factor App 的第三個原則：「在環境中儲存設定」（Store config in the environment）。這個設計讓你可以在任何環境部署同一個 image，只需要替換對應的 ConfigMap，部署流程大幅簡化。

ConfigMap 的 data 欄位支援兩種格式：一是簡單的鍵值對，像 APP_ENV: production 和 LOG_LEVEL: info，這些通常用來注入成環境變數；二是整個設定檔的內容，使用 YAML 多行字串語法，鍵名是檔案名稱（比如 config.yaml:），值是整個設定檔的內容。

在 Pod 裡使用 ConfigMap 主要有兩種方式，各有適合的場景：

第一種是注入成環境變數。envFrom.configMapRef 一次把整個 ConfigMap 的所有鍵值對都批量注入成環境變數，如果你的 ConfigMap 有 10 個設定值，你不需要寫 10 次，一個 envFrom 就搞定了，非常簡潔。env.valueFrom.configMapKeyRef 是更精細的控制，只取 ConfigMap 裡特定的一個鍵，並且可以重新命名（比如 ConfigMap 裡叫 APP_ENV，但你想在容器裡以 ENVIRONMENT 這個環境變數名稱存取）。環境變數注入的限制是：ConfigMap 更新後，容器需要重啟才能看到新的值，因為環境變數是在容器啟動時確定的，之後不會自動更新。

第二種是掛載成 Volume（檔案）。把 ConfigMap 掛載成 Volume，ConfigMap 的每個 key 都會變成掛載目錄裡的一個檔案，值就是檔案的內容。這對有設定檔需求的應用非常適合，比如你有一個 nginx 的設定，可以把 nginx.conf 的內容放進 ConfigMap，然後掛載到 /etc/nginx/nginx.conf。Volume 掛載的一個重要優點是：ConfigMap 更新後，掛載的檔案會自動更新（大約一分鐘內），容器不需要重啟就能讀到新設定（前提是你的程式支援 hot-reload）。

實際操作：先 kubectl apply 建立 ConfigMap，然後用 kubectl get configmap app-config -o yaml 確認它的內容；接著建立引用這個 ConfigMap 的 Pod，進入容器後用 env 指令查看環境變數，確認 APP_ENV 和 LOG_LEVEL 都正確注入了。

最後的重要提醒：ConfigMap 是用來存一般的非敏感設定值。千萬不要把密碼、資料庫連線字串（含密碼）、API 金鑰、TLS 私鑰這類敏感資訊放進 ConfigMap，因為 ConfigMap 的內容在 K8s 裡是明文儲存的，有 kubectl get configmap 權限的人都能直接看到內容。敏感資訊要用 Secret，Secret 雖然預設只是 Base64 編碼（不是真正的加密），但它有專門的存取控制機制，在 etcd 可以設定 encryption at rest，在 RBAC 上可以更精細地限制誰能讀取哪些 Secret。有些組織會搭配外部的 Secret 管理工具，比如 HashiCorp Vault 或 AWS Secrets Manager，讓 Secret 的管理更加安全和完整。`,
  },

  // ========== Label 與 Selector ==========
  {
    title: 'Label 與 Selector',
    subtitle: 'kubectl get pods -l, matchLabels',
    section: 'Label 與 Selector',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
            <p className="text-slate-500 mb-2"># Pod 設定 labels</p>
            <p><span className="text-blue-400">metadata</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">  </span><span className="text-blue-400">labels</span><span className="text-slate-400">:</span></p>
            <p><span className="text-slate-400">    </span><span className="text-blue-400">app</span><span className="text-slate-400">: </span><span className="text-green-400">nginx</span></p>
            <p><span className="text-slate-400">    </span><span className="text-blue-400">env</span><span className="text-slate-400">: </span><span className="text-yellow-400">production</span></p>
            <p><span className="text-slate-400">    </span><span className="text-blue-400">version</span><span className="text-slate-400">: </span><span className="text-green-400">v1.25</span></p>
            <p className="mt-3 text-slate-500"># 用 Label 篩選</p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods -l app=nginx</span></p>
            <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods -l env=production,app=nginx</span></p>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
              <p className="text-k8s-blue font-semibold">常見 Label 慣例</p>
              <div className="font-mono text-xs mt-2 space-y-1 text-slate-300">
                <p>app: &lt;應用名稱&gt;</p>
                <p>env: dev / staging / production</p>
                <p>version: v1.0</p>
                <p>tier: frontend / backend / db</p>
                <p>component: api / worker / cron</p>
              </div>
            </div>
            <div className="bg-blue-900/30 border border-blue-700/50 p-3 rounded-lg text-sm">
              <p className="text-blue-400 font-semibold">Deployment matchLabels</p>
              <p className="text-slate-300 text-xs mt-1">selector.matchLabels 必須和 template.metadata.labels 完全一致</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
          <p className="text-slate-500"># 顯示 labels / 設定 labels</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl get pods --show-labels</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl label pod nginx-pod env=staging</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl label pod nginx-pod env-</span><span className="text-slate-500">  # 刪除 label</span></p>
        </div>
      </div>
    ),
    notes: `Label 和 Selector 是 Kubernetes 裡一個非常核心的設計模式，幾乎貫穿了整個 K8s 資源管理體系。如果你只能從這門課帶走一個概念，我會說是「Label 讓 K8s 資源之間建立鬆耦合的關聯」——理解這個，你就理解了 K8s 最精妙的設計之一。

Label（標籤）是附加在 K8s 資源上的任意鍵值對，可以類比成你在書上貼的便利貼，用來描述和分類資源。一個資源可以有多個 label，比如一個 Pod 可以同時有 app: nginx、env: production、version: v1.25、tier: frontend 這四個標籤，描述了它的應用名稱、環境、版本和層次。Label 的鍵和值都是字串，可以完全自訂，但建議遵循一定的命名慣例，之後說明。

Selector（選擇器）是根據 label 篩選資源的機制，就像 SQL 的 WHERE 條件。kubectl get pods -l app=nginx 選出所有帶有 app=nginx 標籤的 Pod；kubectl get pods -l env=production,app=nginx 用逗號同時指定多個條件，兩個條件都要滿足（AND 邏輯）。你也可以用更複雜的集合型 selector，比如 tier in (frontend, backend) 或 env notin (dev)，在 kubectl 指令裡用引號包住整個 selector 表達式。

Label 和 Selector 的核心威力在於它們讓 K8s 資源之間建立動態的、鬆耦合的關聯。讓我舉幾個具體例子：

Deployment 透過 spec.selector.matchLabels 找到它要管理的 Pod。比如 matchLabels: {app: nginx}，代表所有帶有 app: nginx 標籤的 Pod 都歸這個 Deployment 管。如果你手動建立一個帶有 app: nginx 標籤的 Pod，這個 Deployment 可能會把它也計入 replica 數量，這是一個需要注意的陷阱。

Service（下一堂課的主角）透過 spec.selector 選擇要把流量轉發給哪些 Pod。假設 Service 的 selector 是 app: nginx，不管這些 Pod 是哪個 Deployment 建立的、Pod 名字叫什麼，只要帶著 app: nginx 的標籤，Service 就把流量送給它。這種「基於 label 而不是基於資源名稱的關聯」讓系統非常靈活——你換了 Pod，只要 label 還在，Service 就能正確路由。

NetworkPolicy（網路策略，控制 Pod 間的網路流量）也是用 selector 來決定哪些 Pod 受到哪條策略的影響。HorizontalPodAutoscaler（水平自動擴縮）也用 selector 找到要擴縮的目標。基本上，K8s 裡幾乎所有的「我要作用在誰身上」的設定，都是用 selector + label 實現的。

關於命名慣例，K8s 官方推薦用帶有前綴的標準化 label 鍵名，比如：app.kubernetes.io/name 放應用名稱、app.kubernetes.io/version 放版本號、app.kubernetes.io/component 放元件類型（database、cache、frontend）、app.kubernetes.io/part-of 放上層應用名稱。這些標準化的 label 讓 Helm、Prometheus、Grafana 等工具能自動識別和理解你的應用架構，是大型環境必備的習慣。

Label 和 annotation 的區別也值得一提：annotation 也是鍵值對，但它無法被 selector 用來過濾，通常放的是非識別性的後設資訊，比如 CI/CD pipeline ID、部署工具版本、change cause 說明、負責人聯絡資訊等。大原則是：需要被 selector 篩選的資訊放 label，純粹記錄用的資訊放 annotation。

動手練習：在你的 nginx Deployment 的 YAML 裡加上 env: staging 和 tier: frontend 兩個 label（放在 template.metadata.labels 裡），apply 之後用 kubectl get pods -l tier=frontend 篩選看看，確認 label 有正確設定；再用 kubectl get pods --show-labels 看所有 Pod 完整的 label 清單。最後試試 kubectl label pod nginx-pod-xxx env=production 動態加 label，然後 kubectl label pod nginx-pod-xxx env- 刪除這個 label，感受 label 的靈活性。`,
  },

  // ========== 進階 kubectl 技巧 ==========
  {
    title: '進階 kubectl 技巧',
    subtitle: 'port-forward, cp, exec',
    section: '進階技巧',
    duration: '15',
    content: (
      <div className="space-y-4 font-mono text-sm">
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-slate-500 mb-1"># port-forward：把 Pod 的連接埠轉到本機</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl port-forward pod/nginx-pod 8080:80</span></p>
          <p className="text-slate-300">Forwarding from 127.0.0.1:8080 -&gt; 80</p>
          <p className="text-slate-500 text-xs mt-1"># 瀏覽器打開 http://localhost:8080 即可存取 Pod</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-slate-500 mb-1"># cp：在本機與容器間複製檔案</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl cp nginx-pod:/etc/nginx/nginx.conf ./nginx.conf</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl cp ./custom.conf nginx-pod:/etc/nginx/conf.d/</span></p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg">
          <p className="text-slate-500 mb-1"># exec 進階用法</p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl exec nginx-pod -- curl http://localhost:80</span></p>
          <p><span className="text-slate-400">$ </span><span className="text-green-400">kubectl exec -it nginx-pod -c log-sidecar -- sh</span></p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
          <div className="bg-green-900/30 p-3 rounded-lg border border-green-700/50">
            <p className="text-green-400 font-semibold">port-forward 用途</p>
            <p className="text-slate-300">本地 debug、測試 API、不需要 Service 直接存取 Pod</p>
          </div>
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700/50">
            <p className="text-blue-400 font-semibold">⚠️ 注意事項</p>
            <p className="text-slate-300">port-forward 是臨時的，ctrl+C 就斷了，不適合生產環境存取</p>
          </div>
        </div>
      </div>
    ),
    notes: `最後這個部分介紹幾個進階但非常實用的 kubectl 技巧，這些指令在你 debug K8s 應用的時候會很常用到。

第一個是 port-forward，把 Pod 的連接埠轉發到你的本機。語法是 kubectl port-forward pod/Pod名稱 本機端口:Pod端口。執行後不會回到命令提示符，會一直保持轉發狀態。這個功能最大的用途是在開發和除錯的時候，讓你可以在本機直接用瀏覽器或 curl 存取 Pod 裡跑的服務，不需要建立 Service 也不需要 Ingress。比如你的 Pod 在跑一個 API 服務在 8080 port，你用 port-forward 轉到本機的 8080，就可以用 Postman 直接測試這個 API。

第二個是 cp，可以在你的本機和容器之間複製檔案。從容器複製出來：kubectl cp Pod名:/容器內路徑 ./本地路徑；複製進去：kubectl cp ./本地路徑 Pod名:/容器內路徑。這在需要從容器裡撈 log 檔案或設定檔、或是臨時把設定推進去的時候很方便。但記住，這種方式修改容器裡的檔案是臨時的，Pod 重啟後就恢復原狀，正確做法還是透過 ConfigMap 或 Volume 來管理設定。

第三個是更進階的 exec 用法。如果你只是要執行一個指令而不想互動，可以直接在 -- 後面加指令，不加 -it。比如 kubectl exec nginx-pod -- cat /etc/nginx/nginx.conf 直接印出設定檔，結果就輸出在終端機，馬上回到命令提示符。如果 Pod 有多個容器，用 -c 指定要進入哪個容器。

這三個技巧加上之前學的 logs 和 describe，構成了你 debug K8s 應用的完整工具箱。記住：出問題先看 describe，再看 logs，有需要就 exec 進去手動排查，用 port-forward 從外面測試服務。這套流程能解決九成以上的 K8s 問題。`,
  },

  // ========== Q&A ==========
  {
    title: 'Q&A 與課程回顧',
    subtitle: '有任何問題都可以問！',
    section: 'Q&A',
    duration: '10',
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-5 rounded-xl">
          <p className="text-k8s-blue font-bold text-lg mb-4">今天學了什麼？</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: '📝', item: 'YAML 語法：縮排、鍵值對、列表' },
              { icon: '🏗️', item: 'K8s 資源四欄位：apiVersion, kind, metadata, spec' },
              { icon: '📦', item: 'Pod YAML：最簡、多容器、資源限制' },
              { icon: '⌨️', item: 'kubectl：apply, get, describe, logs, exec, delete' },
              { icon: '🔍', item: 'Pod 生命週期觀察與狀態判讀' },
              { icon: '📂', item: 'Namespace：叢集的虛擬隔離空間' },
              { icon: '🚀', item: 'Deployment：replicas, selector, template' },
              { icon: '🔄', item: '滾動更新與回滾：rollout status/undo' },
              { icon: '⚙️', item: 'ConfigMap：設定值與映像分離' },
              { icon: '🏷️', item: 'Label 與 Selector：資源的篩選機制' },
              { icon: '🛠️', item: '進階 kubectl：port-forward, cp, exec' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-slate-300">{item.item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🎯 下堂課預告</p>
          <p className="text-slate-200">Service、Ingress、儲存管理（PV/PVC）</p>
        </div>
        <div className="text-center text-2xl">🙋 有問題嗎？現在是好時機！</div>
      </div>
    ),
    notes: `好，我們今天下午的課程接近尾聲了。讓我們快速回顧一下今天學了哪些東西。

首先是 YAML 語法，這是一切的基礎。記住：縮排用空格，不能用 Tab；冒號後面要有空格；列表元素用破折號開頭。

然後是 K8s 資源的四個頂層欄位，這四個一定要背起來：apiVersion 告訴 K8s 你用的 API 版本、kind 是資源類型、metadata 是身份資訊（name、labels）、spec 是期望狀態。

Pod 的撰寫，包括最簡單的單容器 Pod、Sidecar 模式的多容器、以及 requests/limits 的資源限制。

kubectl 常用指令：apply 套用設定、get 查看資源、describe 看詳細資訊（debug 首選）、logs 看日誌、exec 進容器、delete 刪除。

Namespace 提供叢集內的邏輯隔離，不同環境或團隊用不同 Namespace 管理。

Deployment 是最重要的工作負載資源，保證 Pod 副本數量、支援滾動更新和回滾。

ConfigMap 把設定值從 image 裡分離出來，實現同一個 image 在不同環境有不同行為。

Label 和 Selector 是 K8s 資源互相關聯的機制，Deployment 找 Pod、Service 找 Pod，都靠 Label。

最後是進階 kubectl 技巧：port-forward 做本地調試、cp 複製檔案、exec 進容器排查。

今天的內容確實很多，不用擔心一下子記不住，這些都需要反覆操作才會熟悉。現在有大概 10 分鐘的 Q&A 時間，有任何問題都可以問，不管是今天的內容還是以前堆積的疑問都可以。下堂課我們會進入 Service 和 Ingress，讓你的應用程式能夠被外部存取，然後是 PV/PVC 存儲管理。今天辛苦了，大家表現得很好！`,
  },
]
