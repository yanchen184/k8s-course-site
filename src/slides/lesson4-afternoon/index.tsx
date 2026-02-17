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
    notes: `歡迎大家回到下午的課程！吃飽了嗎？接下來我們要進入 Kubernetes 最核心的實作部分，今天下午可以說是整個課程裡最「手忙腳亂」的時段，因為有大量的實際操作。

先講一下今天下午的學習路徑。上午我們理解了 K8s 的架構概念，知道有 Master、有 Node、有 etcd、有 API Server 這些元件。但概念再清楚，不動手就只是紙上談兵。下午我們要真正跟 Kubernetes 互動，用指令建立資源、觀察狀態、修改設定、排查問題。

今天下午結束的時候，我希望每個人都有能力：寫一份 YAML 設定檔、用 kubectl 把它部署上去、觀察 Pod 的狀態、做一次滾動更新、用 ConfigMap 管理設定值。這些不是抽象目標，都是我們今天下午會實際操作的內容。

這堂課的密度比較高，如果有地方跟不上，請立刻舉手，不要悶頭自己撐。我寧可慢一點確保大家都跟上，也不要一個人站在前面自說自話。準備好了嗎？我們先從 YAML 開始，因為 K8s 的所有操作幾乎都圍繞著 YAML 檔案。`,
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
    notes: `在進入 Kubernetes 之前，我們必須先搞懂 YAML。因為 K8s 的幾乎所有設定都是用 YAML 寫的：Pod 的設定是 YAML、Deployment 是 YAML、Service 是 YAML、ConfigMap 是 YAML。你可以把 YAML 想成是 K8s 的「語言」，不懂這個語言就沒辦法跟 K8s 溝通。

YAML 全名是 YAML Ain't Markup Language，這個遞迴縮寫有點幽默。它的設計目標是「人類可讀性」，和 JSON 或 XML 比起來，YAML 看起來更像是普通的文字，沒有那麼多括號和引號。

YAML 最基本的單位是鍵值對，格式是：鍵名加冒號加空格加值。注意冒號後面一定要有一個空格，沒有空格就是錯的。值可以是字串、數字、布林值（true/false）、null 等不同型別。

YAML 用縮排來表示層次結構，這是 YAML 最重要的規則也是最常出錯的地方。縮排必須用空格，絕對不能用 Tab。通常用 2 個空格代表一層，縮排層次不一致就會解析失敗。

有一個好消息是，現代的編輯器像 VS Code 裝了 YAML 插件之後，會自動幫你處理縮排，還會提示語法錯誤。我強烈建議大家裝 VS Code 的 Kubernetes 擴充套件，它能直接對 K8s YAML 進行語法檢查，非常好用。

有沒有人以前用過 YAML？如果有，你一定痛過縮排的問題，哈哈。沒用過的同學要特別記住：Tab 是你的敵人，空格是你的朋友。整個課程的 YAML 檔案我都會用 2 空格縮排，大家跟著這個格式走就對了。`,
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
    notes: `繼續 YAML 的進階部分。除了簡單的鍵值對，你在 K8s 裡最常見到的還有兩種結構：列表和巢狀物件。

列表用破折號開頭，每個破折號代表一個元素。比如 containers 是一個列表，裡面的每個 - name: xxx 就是一個容器的設定物件。注意破折號和冒號的對齊關係，破折號和上面的鍵名要在同一縮排層，破折號後面的內容再縮排一層。這個常常讓初學者頭痛，慢慢就習慣了。

多行字串有兩種寫法：豎線 | 保留換行符號，折疊 > 把換行替換成空格。在 K8s 裡比較常用豎線，因為腳本指令需要保留換行。

另一個常見陷阱是 YAML 的型別推斷。YAML 會自動猜測值的型別，比如 1.25 會被當成浮點數，而 docker image tag 通常是字串，所以寫 image: nginx:1.25 沒問題（因為有冒號所以是字串），但有些情況下你需要明確加引號強制指定為字串，特別是看起來像數字的字串。

還有一個陷阱是 yes/no/true/false/on/off 這些值，YAML 都會把它們解析成布林值。如果你的設定值就是字串 "true"，要加引號。在 K8s 的 annotation 裡這個坑特別多。

好，YAML 的基礎就這些。最後提醒：遇到 YAML 解析錯誤，第一件事就是仔細看縮排有沒有對齊，九成的 YAML 問題都是縮排出了問題。接下來我們看 K8s 資源的通用結構，到時候你就知道這些 YAML 語法要怎麼套用了。`,
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
    notes: `好，現在我們進入真正的 Kubernetes YAML 結構。K8s 裡每一種資源，不管是 Pod、Deployment 還是 Service，都遵循同一個四欄位的頂層結構：apiVersion、kind、metadata、spec。這四個欄位是你必須背起來的，因為每一份 K8s YAML 都從這裡開始。

第一個是 apiVersion，告訴 K8s 你用的是哪個版本的 API。K8s 的 API 分成核心群組和具名群組。Pod、Service、ConfigMap 等基礎資源屬於核心群組，apiVersion 寫 v1。Deployment、ReplicaSet 等工作負載資源屬於 apps 群組，寫 apps/v1。CronJob 屬於 batch 群組，寫 batch/v1。記不住沒關係，用 kubectl api-resources 指令可以查，或是直接問文件。

第二個是 kind，就是你要建立什麼類型的資源，值是大寫開頭的字串，比如 Pod、Deployment、Service。這個你一定要對，打錯 K8s 會直接報錯找不到這種資源。

第三個是 metadata，裡面放的是資源的「身份資訊」：name 是必填的，在同一個 namespace 裡必須唯一；namespace 是選填的，不填就放到 default；labels 是鍵值對的集合，用來標記和篩選資源；annotations 也是鍵值對，放一些補充的非結構化資訊，比如說明文字、部署工具的版本號等。

第四個是 spec，這裡定義你「希望這個資源長什麼樣」，也就是 desired state（期望狀態）。每種 kind 的 spec 格式都不一樣，Pod 的 spec 有 containers；Deployment 的 spec 有 replicas、selector、template。這個部分的詳細格式你需要查文件，但整體邏輯是一致的。

還有一個你沒辦法直接設定，但會出現在 kubectl get 輸出裡的欄位是 status，那是 K8s 根據實際情況自動填入的，記錄這個資源「目前實際的狀態」。K8s 的核心機制就是不斷對比 spec（期望）和 status（現實），然後調整讓現實趨近期望，這叫做 reconcile loop。

花點時間把這個結構記住，之後看任何 YAML 檔你都能快速理解它的意圖。`,
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
    notes: `現在讓我們來寫第一份真正的 K8s YAML：一個最簡單的 Pod。請大家打開你的編輯器，跟著我一起寫。

這個 Pod 設定有幾個地方值得解釋：

containers 是一個列表，這個 Pod 只有一個容器叫做 nginx，使用的是 nginx:1.25 這個 Docker 映像檔。注意：一定要指定 image tag（冒號後面的版本號），不要只寫 nginx 不加版本。如果只寫 nginx，K8s 預設去拉 latest tag，而 latest 代表的版本可能隨時變化，這在生產環境是很危險的做法。

containerPort 告訴 K8s 這個容器會監聽哪個連接埠。注意，這個設定主要是文件說明用途，即使不寫，容器一樣能接受連線；但寫出來讓其他人一看 YAML 就知道這個容器的服務端口，是很好的習慣。

labels 是我特別想強調的。metadata 裡面的 labels 為這個 Pod 打上標籤，app: nginx 是很常見的慣例，代表這個 Pod 屬於 nginx 這個應用。後面你會看到，Deployment 用 selector 來選取 Pod，就是靠 labels 做的。養成一開始就加 labels 的習慣，後面你會感謝你自己。

現在請大家在你的練習環境裡創一個目錄，在裡面建立這個 YAML 檔，然後用 kubectl apply -f minimal-pod.yaml 套用它。指令輸完後，用 kubectl get pods 確認 Pod 出現了。等一下，不要急，Pod 剛建立的時候狀態可能是 ContainerCreating，要等它變成 Running 才算好了。這個等待過程就是 K8s 在幫你把容器啟動起來。`,
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
    notes: `繼續 Pod 的進階設定，這次看兩個重要的主題：多容器 Pod 和資源限制。

先說多容器 Pod。一個 Pod 可以跑多個容器，這些容器共享同一個網路命名空間（所以可以用 localhost 互相溝通）和存儲卷。最常見的是 Sidecar 模式，主容器跑你的應用程式，Sidecar 容器提供輔助功能，比如收集日誌、注入設定、做安全代理等。Istio 的 Envoy Proxy 就是這樣注入到你的 Pod 裡的。不過要注意，多容器 Pod 的容器是同生共死的，Pod 重啟所有容器都會重啟。

然後是資源限制，這個在生產環境非常重要，不設的話容器可能吃掉整個 Node 的資源。資源設定分兩層：requests 是「我至少需要這麼多」，排程器會根據這個決定把 Pod 放到哪個 Node；limits 是「我最多能用這麼多」，超過了 CPU 會被節流（throttling），超過了 Memory 會被 OOMKilled（直接 kill 掉）。

CPU 的單位是 m（millicores），1000m 等於 1 個 CPU core。100m 就是 0.1 個 core。Memory 的單位可以用 Mi（Mebibytes，1024 × 1024 bytes）或 Gi（Gibibytes）。128Mi 大概是 134MB。

最佳實踐是：一定要設 requests，最好也設 limits，requests 要設得比較保守（你確定需要的），limits 設高一點留一些緩衝。不要把 requests 設得比 limits 還高，那樣 YAML 會直接報錯。`,
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
    notes: `kubectl 是你和 Kubernetes 溝通的主要工具，就像 SSH 是你和 Linux 伺服器溝通的工具一樣。花時間熟悉 kubectl 的常用指令，之後的工作效率會大幅提升。

apply 是最常用的建立和更新指令。-f 後面接 YAML 檔案路徑，也可以接一個目錄，kubectl 會套用目錄裡所有的 YAML 檔。apply 的好處是具有「冪等性」，執行一次和執行十次效果一樣，已存在的資源會被更新，不存在的會被建立。這在自動化部署的場景非常重要。

get 用來列出資源。kubectl get pods 列出目前 namespace 的所有 Pod，加 -o wide 可以看到更多資訊，包括 Pod 的 IP 和跑在哪個 Node 上。加 -n namespace名稱 可以查其他 namespace 的資源，加 --all-namespaces 或 -A 可以查所有 namespace。

describe 是你在 debug 時最常用到的指令。kubectl describe pod nginx-pod 會顯示這個 Pod 的完整資訊，包括事件（Events）區塊，這裡會記錄 K8s 對這個 Pod 做了什麼操作，包括 pull image、start container、發生了什麼錯誤。Pod 狀態不對的時候，先跑 describe 看 Events，通常能找到問題所在。

現在大家跟我一起操作：先確認你的 nginx-pod 在跑，然後用 kubectl describe pod nginx-pod 看看輸出的內容，特別注意最下方的 Events 區塊，看看 K8s 對這個 Pod 做了什麼事。這個觀察習慣要從現在養起。`,
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
    notes: `繼續 kubectl 的指令。logs、exec、delete 是你每天都會用到的三個操作。

logs 用來查看容器的輸出日誌。不加任何選項就顯示目前為止的所有 log；加 -f（follow）就是即時追蹤，就像 Linux 的 tail -f；加 --tail=N 可以只看最後 N 行，在 log 很多的時候很實用。如果一個 Pod 裡有多個容器，必須用 -c 指定容器名稱，不然 kubectl 不知道你要看哪個容器的 log。

exec 讓你進入一個正在跑的容器裡執行指令，類似 Docker 的 exec 指令。-it 是 interactive + tty 的意思，讓你可以進入互動式的 shell。-- 後面是要在容器裡執行的指令，通常是 bash 或 sh。進到容器之後，你就像在一台 Linux 機器裡一樣，可以查看檔案、檢查程序、測試網路連線。這是 debug 容器問題最直接的方法。想離開的時候輸入 exit 或按 Ctrl+D。

delete 刪除資源。可以指定資源名稱，或是直接用 -f 指定 YAML 檔，K8s 會刪除 YAML 裡面定義的所有資源。預設刪除有一個「優雅停止期」（grace period），K8s 會先發 SIGTERM 信號給容器，等容器自己關閉，超時才強制 SIGKILL。如果你想立刻刪掉，加 --grace-period=0 --force。

特別注意：直接建立的 Pod（kubectl apply -f pod.yaml）被刪了就不見了，K8s 不會自動幫你重建。只有 Deployment 等控制器管理的 Pod，被刪了才會自動被重建。這是很多初學者容易搞混的地方，等一下學 Deployment 就會更清楚了。`,
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
    notes: `kubectl get pods -w 這個指令非常實用，-w 是 watch 的縮寫，執行後不會立刻回到命令提示符，而是持續在畫面上更新 Pod 的狀態。這讓你可以即時觀察 Pod 從被建立到跑起來的整個過程，或是觀察你操作了某個指令之後 Pod 狀態如何變化。用 Ctrl+C 結束監看。

讓我們來認識一下 Pod 的主要狀態：

Pending：K8s 已經接受了這個 Pod 的建立請求，但還沒真正開始啟動。可能是在等待排程（找哪個 Node 可以放）、或是在拉 container image。如果 image 很大或是 image registry 很慢，可能會在這個狀態停留比較久。

ContainerCreating：已經選好 Node，正在把容器啟動起來。

Running：至少一個容器正在跑，而且通過了 readiness 探針（如果有設定的話）。

CrashLoopBackOff：容器啟動之後馬上崩潰，K8s 嘗試重啟，然後又崩潰，不斷重複，越等越久再試（Exponential Backoff）。看到這個狀態，第一個動作是 kubectl logs 看 log 找原因，通常是設定錯誤、程式 bug、或是依賴服務沒起來。

OOMKilled：容器使用的記憶體超過了你設的 limit，被 Linux OOM Killer 強制殺掉。解法是調高 limit，或是找出程式的記憶體洩漏。

ImagePullBackOff 也很常見，代表 K8s 拉不到 image，可能是 image 名稱打錯、tag 不存在、或是需要登入私有 registry 沒有設定 imagePullSecrets。

現在大家來做個練習：先 kubectl delete pod nginx-pod 刪掉 Pod，然後馬上開另一個終端機視窗跑 kubectl get pods -w，再去第一個視窗重新 kubectl apply -f minimal-pod.yaml，在第二個視窗觀察 Pod 狀態從 Pending 變到 Running 的過程。這個操作很有成就感！`,
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
    notes: `Namespace 是 Kubernetes 裡一個非常重要的概念，讓你在同一個叢集裡建立多個虛擬的隔離空間。不同 namespace 之間的資源是邏輯隔離的，但它們還是跑在同一個實體叢集上。

為什麼需要 Namespace？想像你有一個 K8s 叢集，你想同時跑開發環境（dev）、測試環境（staging）、和生產環境（production）。如果沒有 namespace，這三個環境的 Pod、Service 名稱都必須全部唯一，管理起來非常混亂。有了 namespace，你在 dev 和 production 裡都可以有一個叫 api-server 的 Pod，互不干擾，也更容易管理。

另一個常見用途是按照團隊或應用劃分 namespace，每個團隊管理自己的 namespace，用 RBAC 限制他們只能操作自己 namespace 的資源，實現多租戶隔離。

K8s 預設會有幾個 namespace：default 是你不指定 namespace 時的預設位置；kube-system 放的是 K8s 本身的系統元件，比如 CoreDNS、kube-proxy、metric-server，不要隨便動這裡的東西；kube-public 的內容所有人都可以讀，通常放叢集公開資訊；kube-node-lease 放 Node 的心跳資訊。

指令操作方面：kubectl get namespaces 列出所有 namespace；kubectl create namespace 建立新的 namespace；-n 或 --namespace 選項讓你指定要操作哪個 namespace，不加的話就是 default。如果你發現 kubectl get pods 什麼都沒有，但你確定有部署東西，八成是 namespace 搞錯了，加上 -A 或 --all-namespaces 看看所有 namespace 的 Pod。

一個很實用的設定是改變預設 namespace，用 kubectl config set-context --current --namespace=production 之後，所有指令不加 -n 就會自動操作 production namespace，省得每次都要輸入 -n。記得切換完要切回來！`,
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
    notes: `休息完了，精神好一點了嗎？讓我們進入 Deployment，這是整個下午最核心的主題。

先問大家一個問題：如果你直接建立一個 Pod，然後這個 Pod 因為 Node 故障或是容器崩潰而消失了，K8s 會不會自動幫你重建？答案是不會！直接建立的 Pod 是不被保護的，它死了就死了。這在生產環境是完全不能接受的。

這就是 Deployment 存在的意義。Deployment 是一個控制器，它告訴 K8s：「我要跑 3 個副本的 nginx，如果任何一個 Pod 掛掉，你就幫我補一個回來。」K8s 的 Deployment Controller 會持續監視這三個 Pod 的狀態，少了就補，多了就刪，確保永遠有 3 個在跑。

Deployment 的 spec 有三個重要欄位：

replicas：要維持幾個 Pod 副本，可以隨時用 kubectl scale 動態調整，或直接改 YAML 再 apply。

selector.matchLabels：告訴 Deployment 它管理哪些 Pod，用 label 來匹配。這個必須和 template.metadata.labels 一致，不然 K8s 會報錯。這個設計是有意的：selector 和 template labels 必須相同，確保 Deployment 建立的 Pod 一定能被它自己管理到。

template：這是建立 Pod 的模板，裡面的結構和你直接寫 Pod YAML 一樣，只是不需要 apiVersion 和 kind，因為 Deployment 知道它要建的是 Pod。

一個容易混淆的點：Deployment 不直接管理 Pod，它管理的是 ReplicaSet，ReplicaSet 再管理 Pod。所以你 kubectl get all 會看到 deployment / replicaset / pod 三層。一般來說你只需要操作 Deployment，不用直接動 ReplicaSet。

現在跟著我操作：把這個 YAML 存成 nginx-deployment.yaml，然後 kubectl apply 套用，再用 kubectl get pods 和 kubectl get deployment 觀察一下。你應該會看到三個 Pod 被建立出來。`,
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
    notes: `Deployment 最強大的功能之一是滾動更新（Rolling Update）。這讓你可以在完全不中斷服務的情況下，把應用程式從舊版本更新到新版本。

滾動更新的過程是這樣的：假設你有 3 個 Pod 跑著 nginx:1.25，你要更新到 nginx:1.26。K8s 不會一次把 3 個 Pod 全部殺掉再重建，而是逐個替換：先建一個 nginx:1.26 的 Pod，等它 Ready，再殺掉一個舊的，這樣循環直到全部換完。整個過程中永遠有 Pod 在提供服務，所以用戶完全感受不到中斷。

觸發滾動更新有兩種方式：一是用 kubectl set image 指令直接更改 image 版本；二是修改 YAML 裡的 image tag，然後 kubectl apply。我比較推薦第二種，因為 YAML 檔有版本記錄，之後回頭看部署歷史更清楚。

kubectl rollout status 讓你即時觀察滾動更新的進度，它會告訴你目前有幾個新版本的 Pod 已經 Ready，什麼時候全部完成。在 CI/CD pipeline 裡，這個指令非常重要，你的部署腳本可以等 rollout status 回傳成功才繼續下一步，確保新版本真的部署完成才算成功。

kubectl rollout history 可以看這個 Deployment 的更新歷史。預設每次更新都會保留一個 revision，你可以看到哪個 revision 對應哪個版本。如果你加 --record 選項（舊版本支援，新版本改用 annotation 記錄），還可以看到是什麼指令觸發了這次更新，非常方便 audit。`,
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
    notes: `有了滾動更新，就必須有回滾（rollback）的能力。因為新版本可能有 bug，部署上去之後才發現不對，這時候你需要快速回到上一個好的版本。

kubectl rollout undo 就是回滾指令。不加任何參數，回到上一個 revision（也就是你最近一次更新之前的狀態）；加 --to-revision=N 可以回到任意一個歷史版本。回滾本身也是一個「更新」操作，K8s 會用同樣的滾動更新機制，把 Pod 逐個換回舊版本，服務不中斷。

實際操作場景是這樣的：你剛更新了 nginx:1.26，馬上有人回報說有問題，你立刻跑 kubectl rollout undo，幾秒鐘內所有 Pod 就恢復成 nginx:1.25。這種快速回滾能力是 Deployment 相對於直接管理 Pod 最大的優勢之一。

一個常見問題是 rollout history 的 CHANGE-CAUSE 欄位顯示 none，這是因為預設不記錄更新原因。你可以在 YAML 裡加上 annotations: kubernetes.io/change-cause: "更新 nginx 到 1.26 修復 CVE-xxx"，這樣 rollout history 就能看到每次更新的原因，對 audit 和 troubleshoot 很有幫助。

另外兩個實用的 rollout 指令：pause 可以暫停正在進行中的滾動更新，讓你有機會觀察新版本的一部分 Pod 表現如何，沒問題再 resume 繼續。這是一種金絲雀發布（Canary Release）的簡單實現方式，讓你在全量更新前先小範圍驗證新版本。`,
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
    notes: `ConfigMap 解決了一個在容器化應用中非常常見的問題：設定值管理。

想像你把應用程式打包成 Docker image，image 裡有程式碼和所有依賴。但有些東西不適合放進 image 裡，比如資料庫的連線字串、環境變數（production / staging / dev）、各種設定檔的內容，因為這些東西在不同環境下是不同的，你不可能為每個環境分別打包一個 image。

解決方法是把設定值從 image 中分離出來，放到 ConfigMap 裡，讓容器在啟動的時候注入進去。這樣同一個 image 在 dev 和 production 環境表現不同，是因為 ConfigMap 的值不同，而不是 image 不同。這符合 Twelve-Factor App 的設計原則。

ConfigMap 的 data 欄位可以放兩種東西：鍵值對（像環境變數）、或是整個設定檔的內容（用 YAML 的多行字串語法）。

在 Pod 裡使用 ConfigMap 有兩種主要方式：

第一種是注入環境變數。用 envFrom.configMapRef 可以一次把整個 ConfigMap 的所有鍵值對都注入成環境變數，非常方便。用 env.valueFrom.configMapKeyRef 則可以只取 ConfigMap 裡的某一個鍵。

第二種是掛載成檔案（volumes）。這次投影片沒放出來但要提一下：如果 ConfigMap 裡存的是設定檔內容，可以把 ConfigMap 掛載成 Volume，讓容器以讀取檔案的方式使用設定，這對有設定檔需求的應用（比如 nginx.conf）非常方便。

最後要提醒：ConfigMap 是用來存一般的設定值，不要在 ConfigMap 裡放密碼或私鑰這類敏感資訊。敏感資訊要用 Secret，雖然 Secret 預設只是 Base64 編碼（不是加密），但至少在 RBAC 的控制下可以限制哪些 Pod 才能存取，而且在 etcd 可以設定加密 at rest。`,
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
    notes: `Label 和 Selector 是 Kubernetes 裡一個非常核心的設計模式，你一定要理解它，因為它貫穿了整個 K8s 的資源管理體系。

Label 是附加在 K8s 資源上的鍵值對標籤，就像你在檔案夾上貼標籤一樣，用來描述和分類資源。一個資源可以有多個 label，label 可以任意自訂。比如你可以用 app: nginx 標記這個 Pod 屬於 nginx 應用；用 env: production 標記這是生產環境的 Pod；用 version: v1.25 標記版本號。

Selector 是用來根據 label 選取資源的機制。kubectl get pods -l app=nginx 就是選取所有帶有 app=nginx 這個 label 的 Pod，可以同時指定多個條件用逗號分隔。

Label 在 K8s 裡的作用非常廣泛。Deployment 的 selector.matchLabels 用來選取它管理的 Pod。Service 的 selector 用來選取它要轉發流量給哪些 Pod。HorizontalPodAutoscaler 用 selector 選取它要擴縮的 Pod。理解 label 和 selector 的關係，你就理解了 K8s 資源之間是如何「連接」在一起的。

K8s 社群有一套推薦的 label 命名慣例，用 app.kubernetes.io/ 作為前綴，比如 app.kubernetes.io/name: nginx、app.kubernetes.io/version: "1.25"、app.kubernetes.io/component: database。這些標準化的 label 讓不同工具（比如 Helm、monitoring 工具）能夠更好地理解你的應用架構。

除了 label，還有 annotation 也是鍵值對，但 annotation 不能被 selector 用來過濾，通常放的是非識別性的資訊，比如部署工具的說明、change cause、CI/CD 的 pipeline ID 等。

現在請大家在你的 nginx-pod 上加幾個 label，然後用 kubectl get pods -l 指令嘗試篩選，體驗一下 label 的威力。`,
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
