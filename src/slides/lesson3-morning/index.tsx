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
    title: "容器進階操作",
    subtitle: "第三堂早上 — 深入掌握 Docker 核心技術",
    section: "第三堂課",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            🐳
          </div>
          <div>
            <p className="text-2xl font-semibold">容器進階操作</p>
            <p className="text-slate-400">生命週期 • 網路 • 儲存 • 資源管理</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">時間</p>
            <p>09:00 – 12:00（180 分鐘）</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">先備知識</p>
            <p>Docker 基礎操作、映像檔概念</p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🎯 今天學完你將能夠</p>
          <p className="text-slate-300">管理容器完整生命週期、設定容器網路與埠號、掌握 Volume 與環境變數、控制資源使用上限</p>
        </div>
      </div>
    ),
    notes: `大家早安！歡迎來到第三堂的早上，今天進入的主題是容器進階操作。

昨天我們打好了 Linux 基礎，了解了 Docker 的基本概念，跑了第一個容器。今天我們要往更深的地方走，這些內容是你以後在實務工作中每天都會用到的東西。

今天上午的核心主題有四塊：第一是容器生命週期管理，弄清楚一個容器從出生到消亡會經歷哪些狀態，以及怎麼正確地停止一個容器。第二是容器間通訊，多個容器要怎麼互相溝通，這是部署多服務架構的基礎。第三是埠號映射，怎麼把容器內的服務暴露給外面用。第四是 Volume 儲存、環境變數管理和資源限制，這些是讓容器在生產環境跑得穩的關鍵技術。

今天的內容量比較多，但都是非常實用的技術。有問題隨時舉手，我們一起加油！`,
    duration: "3",
  },

  // ========== 課程大綱 ==========
  {
    title: "今日課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-3">
        {[
          { time: "09:00–09:10", topic: "開場與前堂複習", icon: "📋" },
          { time: "09:10–09:35", topic: "容器生命週期", icon: "🔄" },
          { time: "09:35–10:00", topic: "容器間通訊與自訂網路", icon: "🌐" },
          { time: "10:00–10:20", topic: "埠號映射", icon: "🔌" },
          { time: "10:20–10:35", topic: "休息時間", icon: "☕" },
          { time: "10:35–11:00", topic: "Volume 深入：Bind Mount vs Named Volume", icon: "💾" },
          { time: "11:00–11:15", topic: "環境變數管理", icon: "🔑" },
          { time: "11:15–11:30", topic: "資源限制與監控", icon: "📊" },
          { time: "11:30–12:00", topic: "課程總結與 Q&A", icon: "🎯" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-xs">{item.time}</p>
              <p className="text-base">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `先看一下今天上午的課程安排，讓大家心裡有個底。

九點到九點十分先做開場和前堂複習，確認大家昨天的內容都消化了。然後進入主題，九點十分到九點三十五分講容器生命週期，理解容器的各種狀態和正確的停止方式。

九點三十五到十點，我們深入容器網路，特別是多個容器怎麼互相溝通這個在 K8s 裡非常關鍵的主題。十點到十點二十分講埠號映射，學會怎麼把容器內的服務開放出去。

十點二十到三十五分休息十五分鐘。

下半段從十點三十五開始，先深入 Volume 儲存的兩種方式：Bind Mount 和 Named Volume，搞清楚什麼時候用哪個。十一點到十一點十五分講環境變數管理，這個對安全性很重要。十一點十五到三十分是資源限制，學會幫容器設定 CPU 和記憶體的上限。

最後三十分鐘做總結和問答，把今天學到的連結起來。每一段都有實作，請大家準備好跟著動手。`,
    duration: "2",
  },

  // ========== 前堂複習 ==========
  {
    title: "前堂複習",
    subtitle: "鞏固昨天的基礎",
    section: "開場複習",
    content: (
      <div className="space-y-5">
        <p className="text-lg text-slate-300">你還記得這些嗎？</p>
        <div className="grid gap-3">
          {[
            {
              q: "docker run vs docker start 的差別？",
              a: "run 是建立新容器；start 是啟動已存在的容器",
            },
            {
              q: "docker ps 和 docker ps -a 差在哪裡？",
              a: "ps 只看執行中的；ps -a 包括已停止的",
            },
            {
              q: "映像檔（Image）和容器（Container）的關係？",
              a: "Image 是模板（唯讀），Container 是執行中的實例",
            },
            {
              q: "如何進入執行中的容器？",
              a: "docker exec -it <容器名稱> /bin/sh",
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-yellow-400 text-sm font-semibold">Q: {item.q}</p>
              <p className="text-green-400 text-sm mt-1">A: {item.a}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `在開始新內容之前，先來快速複習一下前面學過的東西。如果有哪個問題你馬上知道答案，代表學得很好；如果有點模糊也沒關係，正好趁現在再想一遍。

第一個問題：docker run 和 docker start 的差別是什麼？docker run 是完整地建立一個新容器然後啟動它，如果本地沒有映像檔會先去 Docker Hub 拉取。docker start 是把一個已經存在、但處於停止狀態的容器重新啟動，不會建立新的容器。這個區別很重要，因為 run 每次都是全新的，而 start 是重用之前的容器。

第二個問題：docker ps 和 docker ps -a 的差別。沒有加 -a 的 docker ps 只顯示目前「執行中」的容器。加了 -a 之後，也會顯示所有「已停止」的容器。在除錯的時候，如果你找不到一個容器，記得加 -a，可能它只是停了但還存在。

第三個問題：Image 和 Container 的關係。Image 就像是程式的安裝包，是唯讀的模板。Container 是用那個模板跑起來的實例，可以有讀寫層。同一個 Image 可以同時跑多個 Container，它們共享映像層但各自有獨立的寫入層。

第四個問題：怎麼進入執行中的容器。使用 docker exec -it 加上容器名稱或 ID，再加上你要執行的 shell，通常是 /bin/sh 或 /bin/bash。-i 讓標準輸入保持開啟，-t 分配一個偽終端，兩個一起用才能互動式操作。

大家對這些有沒有問題？有疑問現在提出來，我們快速澄清再繼續。`,
    duration: "5",
  },

  // ========== 容器生命週期狀態 ==========
  {
    title: "容器生命週期",
    subtitle: "從誕生到消亡的每個階段",
    section: "容器生命週期",
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          {[
            { state: "Created", color: "bg-blue-500" },
            { state: "→", color: "" },
            { state: "Running", color: "bg-green-500" },
            { state: "↔", color: "" },
            { state: "Paused", color: "bg-yellow-500" },
          ].map((item, i) =>
            item.color ? (
              <span key={i} className={`${item.color} text-white px-3 py-1 rounded-full font-semibold`}>
                {item.state}
              </span>
            ) : (
              <span key={i} className="text-slate-400 text-xl">{item.state}</span>
            )
          )}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          {[
            { state: "Running", color: "bg-green-500" },
            { state: "→", color: "" },
            { state: "Stopped", color: "bg-red-500" },
            { state: "→", color: "" },
            { state: "Deleted", color: "bg-slate-600" },
          ].map((item, i) =>
            item.color ? (
              <span key={i} className={`${item.color} text-white px-3 py-1 rounded-full font-semibold`}>
                {item.state}
              </span>
            ) : (
              <span key={i} className="text-slate-400 text-xl">{item.state}</span>
            )
          )}
        </div>
        <div className="grid gap-2 text-sm">
          {[
            { state: "Created", cmd: "docker create", desc: "容器建立但尚未啟動" },
            { state: "Running", cmd: "docker start / run", desc: "容器正在執行中" },
            { state: "Paused", cmd: "docker pause", desc: "容器程序暫停（凍結）" },
            { state: "Stopped", cmd: "docker stop / kill", desc: "容器已停止執行" },
            { state: "Deleted", cmd: "docker rm", desc: "容器從系統移除" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
              <code className="text-green-400 w-28 flex-shrink-0 text-xs">{item.cmd}</code>
              <span className="text-yellow-400 w-20 flex-shrink-0">{item.state}</span>
              <span className="text-slate-300">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `好，進入今天的第一個主題：容器生命週期。一個容器從建立到刪除，會經歷幾個明確的狀態，了解這些狀態和對應的指令，是管理容器的基本功。

第一個狀態是 Created（已建立）。用 docker create 指令可以建立一個容器但不啟動它，這個容器存在於系統中，佔用少量資源，但主程序還沒跑起來。這個狀態在實際使用中比較少見，大多數人都直接用 docker run 一步完成建立加啟動。

第二個狀態是 Running（執行中）。這是容器最主要的狀態，主程序在執行，在 docker ps 裡可以看到。用 docker start 可以啟動一個 Created 或 Stopped 的容器，進入 Running 狀態。

第三個狀態是 Paused（暫停）。docker pause 會凍結容器的所有程序，它們停在當下那個瞬間，不消耗 CPU，但記憶體還在。用 docker unpause 可以繼續。這個狀態在做快照或除錯時有用，但實際使用不多。

第四個狀態是 Stopped（已停止）。容器的主程序已結束，但容器本身還存在，可以用 docker start 重新啟動，也可以用 docker logs 查看執行期間的輸出。docker ps -a 才看得到 Stopped 的容器。

第五個狀態是 Deleted（已刪除）。docker rm 把容器完全從系統移除，包括容器的寫入層。注意，只有在 Stopped 狀態才能刪除，執行中的容器要加 -f 強制刪除。刪除後容器就真的消失了，這也是為什麼資料要放 Volume 的原因。

理解這個狀態機，對排查「為什麼我的容器不見了」這類問題非常有幫助。`,
    duration: "10",
  },

  // ========== SIGTERM vs SIGKILL ==========
  {
    title: "SIGTERM vs SIGKILL",
    subtitle: "正確停止容器的方式",
    section: "容器生命週期",
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg space-y-3">
            <p className="text-2xl font-bold text-green-400">docker stop</p>
            <p className="text-slate-300 text-sm">先送 SIGTERM，給程序優雅關閉的機會</p>
            <div className="bg-slate-900/50 p-2 rounded font-mono text-xs text-green-300">
              <p># 預設等 10 秒</p>
              <p>docker stop &lt;容器&gt;</p>
              <p># 自訂等待秒數</p>
              <p>docker stop -t 30 &lt;容器&gt;</p>
            </div>
            <p className="text-green-400 text-xs">✓ 推薦用法：資料庫、訊息佇列等有狀態服務</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg space-y-3">
            <p className="text-2xl font-bold text-red-400">docker kill</p>
            <p className="text-slate-300 text-sm">直接送 SIGKILL，立即強制終止</p>
            <div className="bg-slate-900/50 p-2 rounded font-mono text-xs text-red-300">
              <p># 強制殺掉</p>
              <p>docker kill &lt;容器&gt;</p>
              <p># 也可指定信號</p>
              <p>docker kill -s SIGTERM &lt;容器&gt;</p>
            </div>
            <p className="text-red-400 text-xs">⚠️ 可能造成資料遺失，謹慎使用</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">🔄 docker stop 的運作流程</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="bg-blue-600 px-2 py-1 rounded text-white">送出 SIGTERM</span>
            <span className="text-slate-400">→</span>
            <span className="bg-yellow-700 px-2 py-1 rounded text-white">等待 10 秒</span>
            <span className="text-slate-400">→</span>
            <span className="bg-red-600 px-2 py-1 rounded text-white">若未停止則 SIGKILL</span>
          </div>
        </div>
      </div>
    ),
    notes: `接下來說一個很多初學者沒搞清楚的概念：docker stop 和 docker kill 的差別，以及背後的 Linux 信號機制。

在 Linux 裡，結束一個程序可以用不同的信號（Signal）。最重要的兩個是 SIGTERM 和 SIGKILL。SIGTERM（信號 15）是一個「請你停下來」的禮貌請求，程序收到之後可以選擇如何回應：做一些收尾工作，比如關閉資料庫連線、把還沒寫的資料刷新到磁碟、清理暫存檔案，然後正常退出。這叫「優雅關閉」（Graceful Shutdown）。SIGKILL（信號 9）就不一樣了，它是「我現在馬上要你死」，作業系統直接強制結束程序，程序沒有任何機會做收尾，可能導致資料損毀或狀態不一致。

docker stop 的流程是：先送 SIGTERM 給容器的主程序，然後等待一段時間（預設 10 秒）。如果程序在這段時間內正常退出了，就完成了。如果超過時間還沒退出，才送 SIGKILL 強制終止。你可以用 -t 參數調整等待時間，比如 docker stop -t 30 讓程序有 30 秒收尾。

docker kill 則是直接送 SIGKILL，不等待，立刻強制終止。

在實務上，幾乎所有情況都應該用 docker stop，讓服務有機會優雅關閉。只有在容器卡死、怎麼都不回應的情況下，才用 docker kill。這個概念在 Kubernetes 裡同樣重要，K8s 在停止 Pod 的時候也是先 SIGTERM 再 SIGKILL，你的應用程式需要正確處理 SIGTERM，才能做到零資料遺失的滾動更新。

記住這個原則：正常操作用 stop，緊急情況才用 kill。`,
    duration: "15",
  },

  // ========== 容器間通訊 ==========
  {
    title: "容器間通訊",
    subtitle: "預設 bridge 網路的限制",
    section: "容器間通訊",
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">Docker 預設網路模式</p>
          <div className="font-mono text-sm bg-slate-900 p-3 rounded text-green-300">
            <p># 查看網路清單</p>
            <p>docker network ls</p>
            <p className="text-slate-500 mt-2"># 預設有三個：</p>
            <p>bridge   # 預設容器網路</p>
            <p>host     # 共用宿主機網路</p>
            <p>none     # 無網路</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">❌ 預設 bridge 的限制</p>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• 容器間只能用 IP 互連，無 DNS 解析</li>
            <li>• 容器 IP 是動態分配，重啟後可能改變</li>
            <li>• 無法用容器名稱直接通訊（ping container-name ❌）</li>
          </ul>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✓ 解法：建立自訂網路</p>
          <p className="text-slate-300 text-sm">自訂 bridge 網路內建 DNS，容器可以用名稱互相通訊</p>
        </div>
      </div>
    ),
    notes: `下一個主題是容器間通訊。當你的應用不只一個容器，比如一個 Web API 容器要連到一個 MySQL 容器，它們要怎麼找到彼此？這是實務上非常重要的問題。

先說 Docker 預設的網路情況。執行 docker network ls 可以看到 Docker 安裝時會自動建立三個網路：bridge、host 和 none。

預設情況下，你用 docker run 跑起來的容器都會加入叫做 bridge 的這個預設網路。在這個網路裡，每個容器會被分配一個私有 IP，比如 172.17.0.2。容器之間可以用這個 IP 互相通訊，也可以通過宿主機存取外部網路。

但是，預設 bridge 網路有一個很大的問題：它不提供 DNS 解析。也就是說，你沒辦法用容器的名稱去找到它，只能用它的 IP。這帶來兩個麻煩：第一，你得先知道對方的 IP，這需要先用 docker inspect 查。第二，容器每次重啟或重建，IP 可能都不一樣，你的設定就失效了。

如果你在程式碼裡寫死 mysql 的 IP 是 172.17.0.5，過幾天容器重建後 IP 變成 172.17.0.3，你的應用就連不到資料庫了，這在實務中是很常見的坑。

解法是什麼？建立自訂網路。這是下一張投影片的主題。`,
    duration: "10",
  },

  // ========== 自訂網路 ==========
  {
    title: "自訂 Docker 網路",
    subtitle: "讓容器用名稱互相找到彼此",
    section: "容器間通訊",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm space-y-2">
          <p className="text-slate-400"># 1. 建立自訂 bridge 網路</p>
          <p className="text-green-300">docker network create my-app-net</p>
          <p className="text-slate-400 mt-3"># 2. 啟動容器時加入網路</p>
          <p className="text-green-300">docker run -d --name mysql-db \</p>
          <p className="text-green-300 pl-4">--network my-app-net \</p>
          <p className="text-green-300 pl-4">-e MYSQL_ROOT_PASSWORD=secret \</p>
          <p className="text-green-300 pl-4">mysql:8</p>
          <p className="text-slate-400 mt-3"># 3. 另一個容器加入同一個網路</p>
          <p className="text-green-300">docker run -d --name web-api \</p>
          <p className="text-green-300 pl-4">--network my-app-net \</p>
          <p className="text-green-300 pl-4">my-api-image</p>
          <p className="text-slate-400 mt-3"># 4. web-api 可以直接用名稱連 mysql</p>
          <p className="text-green-300">docker exec web-api ping mysql-db  ✓</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold">network connect</p>
            <p className="text-slate-400 font-mono text-xs mt-1">docker network connect &lt;網路&gt; &lt;容器&gt;</p>
            <p className="text-slate-300 text-xs mt-1">讓已執行的容器加入網路</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold">network inspect</p>
            <p className="text-slate-400 font-mono text-xs mt-1">docker network inspect &lt;網路&gt;</p>
            <p className="text-slate-300 text-xs mt-1">查看網路詳細設定與成員</p>
          </div>
        </div>
      </div>
    ),
    notes: `自訂 bridge 網路是解決容器間通訊問題的正確方法，讓我一步步帶大家看怎麼做。

第一步，建立自訂網路。指令很簡單：docker network create my-app-net。這樣就建立了一個叫 my-app-net 的 bridge 網路。你可以根據你的應用取一個有意義的名字，比如 wordpress-net 或 backend-network。

第二步，啟動容器時指定要加入哪個網路，用 --network 參數。這裡我們啟動一個 MySQL 容器，給它取名叫 mysql-db，加入 my-app-net 網路。

第三步，啟動另一個容器，比如你的 Web API，同樣加入 my-app-net 網路，給它取名 web-api。

第四步，神奇的事情發生了：在自訂 bridge 網路裡，Docker 有內建的 DNS 服務，所以 web-api 可以直接用 mysql-db 這個容器名稱去連 MySQL，不需要知道 IP。你可以用 docker exec web-api ping mysql-db 測試，會成功的。如果是在預設 bridge 網路就不行了。

兩個補充指令很有用：docker network connect 可以讓一個已經在執行中的容器加入某個網路，不需要重啟容器。docker network inspect 可以看一個網路的詳細資訊，包括子網路範圍、閘道 IP，以及哪些容器在這個網路裡。

這個自訂網路 + 容器名稱 DNS 的概念非常重要，因為 Kubernetes 的 Service DNS 就是建立在類似的原理上。在 K8s 裡，你可以用 service-name 直接在叢集內部連到一個服務，不用管它的 Pod IP，原理和這裡是一樣的。`,
    duration: "15",
  },

  // ========== 埠號映射 ==========
  {
    title: "埠號映射",
    subtitle: "把容器服務暴露到外面",
    section: "埠號映射",
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">語法與範例</p>
          <div className="font-mono text-sm space-y-3">
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-slate-400"># -p 宿主機埠:容器埠</p>
              <p className="text-green-300">docker run -p 8080:80 nginx</p>
              <p className="text-slate-500 text-xs mt-1">→ 宿主機 8080 → 容器 80</p>
            </div>
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-slate-400"># -P 自動分配宿主機高埠號</p>
              <p className="text-green-300">docker run -P nginx</p>
              <p className="text-slate-500 text-xs mt-1">→ 宿主機隨機高埠 → 容器 80</p>
            </div>
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-slate-400"># 安全綁定：只對本機開放</p>
              <p className="text-green-300">docker run -p 127.0.0.1:3306:3306 mysql:8</p>
              <p className="text-slate-500 text-xs mt-1">→ 只有本機可連，外部無法存取</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">查看映射狀況</p>
            <p className="font-mono text-xs text-slate-300 mt-1">docker port &lt;容器名&gt;</p>
            <p className="font-mono text-xs text-slate-300">docker ps（PORTS 欄）</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold">⚠️ 安全注意</p>
            <p className="text-slate-300 text-xs mt-1">資料庫埠（3306, 5432）建議綁 127.0.0.1，避免直接暴露到外部網路</p>
          </div>
        </div>
      </div>
    ),
    notes: `埠號映射是讓外部可以連到容器服務的機制。容器在一個隔離的網路環境裡，外面要連進去，需要設定映射規則，告訴 Docker：「宿主機的某個埠收到的流量，轉發到容器的某個埠」。

最常用的方式是 -p 宿主機埠:容器埠。這個語法要從右往左讀：容器內的 80 埠，映射到宿主機的 8080 埠。當有人連到這台機器的 8080，流量就進入容器的 80 埠。範例：docker run -p 8080:80 nginx，啟動後你在瀏覽器輸入 http://localhost:8080 就能看到 nginx 的歡迎頁面。

第二種是大寫 -P，Docker 會自動從高埠號（通常是 32768 以上）隨機分配一個宿主機埠，對應到映像檔裡 EXPOSE 指令宣告的埠。用 docker ps 可以看到它分配了哪個埠。這個方式適合在本地開發環境快速測試多個容器，不用手動管理埠號衝突。

第三種非常重要：安全綁定。如果你寫 -p 3306:3306，MySQL 的 3306 埠就對宿主機的所有網路介面開放，包括對外的網路卡。如果這台機器是在公網上，任何人都可以嘗試連你的 MySQL，這是安全風險！

正確做法是加上 IP：-p 127.0.0.1:3306:3306，這樣 MySQL 埠只對本機開放，外部完全無法連接。只有在同一台機器上跑的程式，或通過 SSH 連進來的人，才能存取這個資料庫。

記住這個原則：對外的服務用 -p 0.0.0.0 或不寫 IP；對內的服務，特別是資料庫，用 -p 127.0.0.1 綁定本機。在 K8s 裡，這個概念對應到 Service 的 ClusterIP 和 NodePort 的設計。`,
    duration: "20",
  },

  // ========== 休息 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          伸展筋骨，等等進入 Volume 和儲存！
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">已學完</p>
            <p className="text-slate-400">容器生命週期</p>
            <p className="text-slate-400">SIGTERM / SIGKILL</p>
            <p className="text-slate-400">容器網路 & 埠號映射</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold">等等學</p>
            <p className="text-slate-400">Bind Mount vs Named Volume</p>
            <p className="text-slate-400">環境變數管理</p>
            <p className="text-slate-400">資源限制</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold">思考問題</p>
            <p className="text-slate-400">容器刪除後，裡面的資料去哪了？</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，前半段到這裡，讓我們休息 15 分鐘。上廁所、喝水、活動一下。

趁休息前，拋給大家一個思考問題：容器刪除後，裡面的資料去哪了？

比如你跑了一個 MySQL 容器，把資料庫寫進去了，然後 docker rm 把容器刪掉，資料還在嗎？

你心裡有答案嗎？15 分鐘後我們解答這個問題，進入 Volume 儲存的主題。15 分鐘後準時回來！`,
    duration: "1",
  },

  // ========== Volume 概覽 ==========
  {
    title: "Volume 儲存",
    subtitle: "讓資料在容器消失後繼續存在",
    section: "Volume 深入",
    content: (
      <div className="space-y-5">
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400 font-semibold">🔥 容器刪除 = 容器層的資料全部消失</p>
          <p className="text-slate-300 text-sm mt-1">容器的寫入層（Container Layer）是暫時的，docker rm 後資料就不見了</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold text-lg mb-2">Bind Mount</p>
            <p className="text-slate-300 text-sm">把宿主機的某個目錄掛載到容器內</p>
            <div className="font-mono text-xs text-blue-200 mt-2 bg-slate-900 p-2 rounded">
              -v /host/path:/container/path
            </div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
            <p className="text-purple-400 font-semibold text-lg mb-2">Named Volume</p>
            <p className="text-slate-300 text-sm">由 Docker 管理的命名儲存空間</p>
            <div className="font-mono text-xs text-purple-200 mt-2 bg-slate-900 p-2 rounded">
              -v volume-name:/container/path
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-2">Volume 相關指令</p>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-slate-300">
            <span>docker volume ls</span>
            <span>docker volume inspect</span>
            <span>docker volume rm</span>
          </div>
        </div>
      </div>
    ),
    notes: `休息時間思考的問題，答案是：對，容器刪除後，容器層裡的資料就消失了。

這是容器架構的設計，容器是無狀態的、短暫的。容器的寫入層（Container Layer）只存在於容器的生命週期內，docker rm 的時候一起被清掉。這對無狀態的應用沒有問題，但如果你的 MySQL 資料庫跑在容器裡，而資料就存在容器層，那刪掉容器就等於把你的資料庫清空，這當然是不可接受的。

解法是 Volume，讓資料存在容器的生命週期之外，容器可以建了又刪，但資料一直保留著。

Docker 有兩種主要的 Volume 方式：Bind Mount 和 Named Volume。

Bind Mount 是把宿主機的一個具體路徑掛載到容器內的某個路徑。宿主機和容器看到的是同一份資料，修改任何一方另一方都能看到。語法是 -v /宿主機路徑:/容器路徑，你需要明確指定一個絕對路徑。

Named Volume 是 Docker 自己管理的儲存空間，你只給它一個名字，不用管它實際存在宿主機的哪裡（其實在 /var/lib/docker/volumes/）。語法是 -v volume名稱:/容器路徑。Docker 負責它的生命週期管理。

這兩種方式各有適用場景，接下來我們詳細比較。`,
    duration: "5",
  },

  // ========== Bind Mount ==========
  {
    title: "Bind Mount 實戰",
    subtitle: "直接掛載宿主機目錄",
    section: "Volume 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm space-y-2">
          <p className="text-slate-400"># 把本機 ./app 目錄掛入容器的 /usr/share/nginx/html</p>
          <p className="text-green-300">docker run -d -p 8080:80 \</p>
          <p className="text-green-300 pl-4">-v $(pwd)/app:/usr/share/nginx/html \</p>
          <p className="text-green-300 pl-4">--name my-nginx nginx</p>
          <p className="text-slate-400 mt-3"># 開發用：即時看到程式碼修改效果</p>
          <p className="text-green-300">docker run -d -p 3000:3000 \</p>
          <p className="text-green-300 pl-4">-v $(pwd):/app \</p>
          <p className="text-green-300 pl-4">--workdir /app node:20 npm start</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">✓ Bind Mount 適合</p>
            <ul className="text-slate-300 text-xs space-y-1 mt-1">
              <li>• 本地開發：即時同步程式碼</li>
              <li>• 設定檔掛入容器</li>
              <li>• 讓容器寫 log 到宿主機</li>
            </ul>
          </div>
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">⚠️ Bind Mount 注意</p>
            <ul className="text-slate-300 text-xs space-y-1 mt-1">
              <li>• 宿主機路徑必須存在</li>
              <li>• 路徑綁定宿主機，跨機器不可攜</li>
              <li>• 生產環境建議用 Named Volume</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `Bind Mount 的語法是 -v 宿主機路徑:容器路徑，兩邊都必須是絕對路徑。在 Linux/Mac 可以用 $(pwd) 代表目前目錄，Windows 的 PowerShell 則用 ${PWD}。

第一個範例是開發靜態網站：把本機的 app 目錄掛到 nginx 的 HTML 目錄，你在本機用編輯器修改 app 目錄下的 HTML 檔案，重新整理瀏覽器就能看到最新版，不需要重新建 Image 或重啟容器，開發效率大幅提升。

第二個範例是 Node.js 開發環境：把整個程式碼目錄掛到容器的 /app，容器裡跑的 Node 看到的就是你本機最新的程式碼。配合 nodemon 這類熱重載工具，存檔就自動生效。這是很多開發者的日常工作流程。

Bind Mount 的優點是直觀、靈活、容易在宿主機直接查看和編輯內容。但它有幾個限制：宿主機路徑必須預先存在，不然 Docker 會自動建立一個空目錄，可能不是你想要的結果。另外，路徑是硬綁在宿主機上的，如果你的設定寫 /home/user/myapp，搬到另一台機器上路徑不一樣就出問題了。

這就是為什麼生產環境通常用 Named Volume 而不是 Bind Mount。開發環境的靈活性需求不同，Bind Mount 很合適；生產環境要的是可靠性和可攜性，Named Volume 更好。`,
    duration: "10",
  },

  // ========== Named Volume ==========
  {
    title: "Named Volume 實戰",
    subtitle: "交給 Docker 管理儲存空間",
    section: "Volume 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm space-y-2">
          <p className="text-slate-400"># 建立 named volume（可省略，run 時自動建立）</p>
          <p className="text-green-300">docker volume create mysql-data</p>
          <p className="text-slate-400 mt-3"># 使用 named volume 跑 MySQL</p>
          <p className="text-green-300">docker run -d --name db \</p>
          <p className="text-green-300 pl-4">-v mysql-data:/var/lib/mysql \</p>
          <p className="text-green-300 pl-4">-e MYSQL_ROOT_PASSWORD=secret \</p>
          <p className="text-green-300 pl-4">mysql:8</p>
          <p className="text-slate-400 mt-3"># 就算刪掉容器，資料還在</p>
          <p className="text-green-300">docker rm -f db</p>
          <p className="text-green-300">docker volume ls  # mysql-data 仍然存在 ✓</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { cmd: "docker volume ls", desc: "列出所有 volume" },
            { cmd: "docker volume inspect mysql-data", desc: "查看詳細資訊（含路徑）" },
            { cmd: "docker volume rm mysql-data", desc: "刪除 volume（⚠️ 資料永久消失）" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-green-400 font-mono text-xs">{item.cmd}</p>
              <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `Named Volume 的使用方式和 Bind Mount 類似，但是左邊不是路徑，而是一個名字。比如 -v mysql-data:/var/lib/mysql，意思是：把叫做 mysql-data 的 Volume 掛到容器的 /var/lib/mysql 目錄。

如果 mysql-data 這個 Volume 還不存在，Docker 會自動建立它，不需要預先 docker volume create。當然你也可以事先建立，更明確。

重點示範：我先跑一個 MySQL 容器，用 Named Volume 存放資料。然後我刻意用 docker rm -f 把容器強制刪掉。再執行 docker volume ls，你會看到 mysql-data 還在。接著建立一個新的 MySQL 容器，掛上同一個 Volume，你的資料就回來了，完全沒有遺失。這就是 Named Volume 的核心價值：容器的生命週期和資料的生命週期是獨立的。

三個重要指令：docker volume ls 列出所有 Volume；docker volume inspect 可以看到這個 Volume 的詳細資訊，包括它在宿主機上的實際路徑，通常在 /var/lib/docker/volumes/，一般不建議直接去那個目錄操作；docker volume rm 刪除 Volume，這個操作是不可逆的，資料會永久消失，執行前請確認你真的不需要那份資料了。

還有一個清理指令值得記：docker volume prune，它會刪除所有沒有被任何容器使用的 Volume，可以釋放磁碟空間。但同樣需要謹慎，確認那些 Volume 的資料不再需要了再執行。

在 Kubernetes 裡，PersistentVolume 和 PersistentVolumeClaim 就是 Named Volume 概念的進階版，你對 Named Volume 理解越深，K8s 的儲存機制就越容易理解。`,
    duration: "10",
  },

  // ========== 環境變數管理 ==========
  {
    title: "環境變數管理",
    subtitle: "設定、安全性與 .env 最佳實踐",
    section: "環境變數管理",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm space-y-2">
          <p className="text-slate-400"># 方法一：-e 直接設定單一變數</p>
          <p className="text-green-300">docker run -e MYSQL_ROOT_PASSWORD=secret \</p>
          <p className="text-green-300 pl-4">-e MYSQL_DATABASE=myapp mysql:8</p>
          <p className="text-slate-400 mt-3"># 方法二：--env-file 從檔案讀取（推薦）</p>
          <p className="text-green-300">docker run --env-file .env mysql:8</p>
          <p className="text-slate-400 mt-3"># .env 檔案格式</p>
          <p className="text-yellow-300">MYSQL_ROOT_PASSWORD=s3cr3tP@ssw0rd</p>
          <p className="text-yellow-300">MYSQL_DATABASE=myapp</p>
          <p className="text-yellow-300">MYSQL_USER=appuser</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">🔒 安全注意</p>
            <ul className="text-slate-300 text-xs space-y-1 mt-1">
              <li>• .env 加入 .gitignore，絕對不要 commit</li>
              <li>• docker inspect 可看到所有環境變數</li>
              <li>• 生產環境用 Docker Secrets 或 Vault</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">✓ 查看容器環境變數</p>
            <p className="font-mono text-xs text-slate-300 mt-1">docker exec &lt;容器&gt; env</p>
            <p className="font-mono text-xs text-slate-300">docker inspect &lt;容器&gt; | grep Env</p>
          </div>
        </div>
      </div>
    ),
    notes: `環境變數是容器化應用傳遞設定的標準方式。不同的環境（開發、測試、生產）用不同的設定，但程式碼保持一致，這是 12 Factor App 方法論的核心原則之一。

最直接的方式是用 -e 參數，每個 -e 設定一個環境變數。比如 -e MYSQL_ROOT_PASSWORD=secret。這個方式適合快速測試，或者只有一兩個變數的情況。但如果你的應用有十幾個設定，一行指令就會很長很亂。

更好的方式是 --env-file，從一個檔案讀取環境變數。建一個 .env 文字檔，每行一個 KEY=VALUE，然後在 docker run 時加上 --env-file .env。這樣指令簡潔，設定集中管理，也方便修改。

講到安全性，這裡要特別強調：.env 檔案包含密碼、API Key 等敏感資訊，絕對不能提交到 Git 倉庫。你應該在 .gitignore 裡加上 .env，並且在倉庫裡放一個 .env.example，裡面只有變數名稱但沒有真實的值，作為範本讓其他開發者知道要設定哪些變數。

另一個安全注意點：docker inspect 可以看到容器的所有環境變數，包括密碼。所以在多人環境裡，有 Docker 權限就能看到敏感資訊。在更嚴格的生產環境，應該用 Docker Secrets 或 HashiCorp Vault 這類工具來管理機密資訊，把敏感資料和容器設定分離。

在 Kubernetes 裡，對應的概念是 ConfigMap（非機密設定）和 Secret（機密設定）。理解環境變數管理的最佳實踐，對 K8s 的設定管理也非常有幫助。`,
    duration: "15",
  },

  // ========== 資源限制 ==========
  {
    title: "資源限制",
    subtitle: "防止單一容器耗盡宿主機資源",
    section: "資源限制",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm space-y-2">
          <p className="text-slate-400"># 限制記憶體：最多 512MB，超過會被 OOM killed</p>
          <p className="text-green-300">docker run -d --memory 512m --name web nginx</p>
          <p className="text-slate-400 mt-3"># 限制 CPU：最多使用 1.5 顆核心</p>
          <p className="text-green-300">docker run -d --cpus 1.5 --name worker myapp</p>
          <p className="text-slate-400 mt-3"># 同時設定兩者（推薦生產環境）</p>
          <p className="text-green-300">docker run -d \</p>
          <p className="text-green-300 pl-4">--memory 1g --memory-swap 1g \</p>
          <p className="text-green-300 pl-4">--cpus 2 \</p>
          <p className="text-green-300 pl-4">--name api-service my-api</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">📊 即時監控資源使用量</p>
          <div className="font-mono text-sm space-y-1">
            <p className="text-green-300">docker stats              <span className="text-slate-500"># 即時顯示所有容器</span></p>
            <p className="text-green-300">docker stats web worker   <span className="text-slate-500"># 只看指定容器</span></p>
            <p className="text-green-300">docker stats --no-stream  <span className="text-slate-500"># 只拍一次快照</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `資源限制是生產環境容器管理中不可或缺的一環。如果你在一台機器上跑多個容器，而沒有設定資源上限，一個失控的容器可能耗盡整台機器的記憶體或 CPU，導致其他容器也跟著受影響，整個系統掛掉。這在實務中是真實發生過的事故。

記憶體限制用 --memory 參數，後面可以加 m（MB）或 g（GB）。比如 --memory 512m 表示這個容器最多只能用 512MB 記憶體。如果容器嘗試使用超過這個上限，Linux 核心的 OOM Killer（Out-Of-Memory Killer）會直接 kill 掉容器的程序，容器就停了。

--memory-swap 設定 swap 的上限。如果設成和 --memory 一樣的值，表示不允許使用 swap，只能用實體記憶體。在 K8s 裡通常也這樣設，避免因為用 swap 而造成效能不穩定。

CPU 限制用 --cpus 參數，可以是小數。--cpus 1.5 表示最多使用 1.5 個 CPU 核心的算力。注意這是上限，不是保留。如果容器目前的工作量只需要 0.3 顆核心，它就只用那麼多。

docker stats 是監控的好工具，可以即時看到每個容器目前用了多少 CPU、記憶體、網路和磁碟 IO，就像 Linux 的 top 指令，但是針對容器的。執行後會持續更新，按 Ctrl+C 停止。如果加上 --no-stream 參數，就只輸出一次快照，適合拿來寫腳本或做記錄。

這個資源限制的概念在 Kubernetes 裡對應到 Pod 的 resources.limits 和 resources.requests，是 K8s 排程器決定 Pod 要放在哪個節點的重要依據。設好資源限制，讓你的叢集更穩定、更可預測。`,
    duration: "15",
  },

  // ========== 課程總結 ==========
  {
    title: "今日課程總結",
    subtitle: "你今天學到了什麼",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "🔄",
              title: "容器生命週期",
              points: ["Created → Running → Stopped → Deleted", "docker stop（SIGTERM 優雅關閉）", "docker kill（SIGKILL 強制終止）"],
              color: "border-blue-700",
              titleColor: "text-blue-400",
            },
            {
              icon: "🌐",
              title: "容器間通訊",
              points: ["預設 bridge 無 DNS", "自訂 network：container name = DNS", "docker network create / connect"],
              color: "border-green-700",
              titleColor: "text-green-400",
            },
            {
              icon: "🔌",
              title: "埠號映射",
              points: ["-p 主機:容器 明確映射", "-P 自動分配高埠號", "127.0.0.1:埠 安全綁本機"],
              color: "border-yellow-700",
              titleColor: "text-yellow-400",
            },
            {
              icon: "💾",
              title: "Volume & 設定",
              points: ["Bind Mount：掛本機目錄", "Named Volume：Docker 管理", "--env-file .env 安全設定", "--memory / --cpus 資源限制"],
              color: "border-purple-700",
              titleColor: "text-purple-400",
            },
          ].map((section, i) => (
            <div key={i} className={`bg-slate-800/50 border ${section.color} p-4 rounded-lg`}>
              <p className={`${section.titleColor} font-semibold mb-2`}>
                {section.icon} {section.title}
              </p>
              <ul className="text-slate-300 text-xs space-y-1">
                {section.points.map((p, j) => (
                  <li key={j}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-center">
          <p className="text-k8s-blue font-semibold">🎯 下堂課預告：Kubernetes 基礎入門</p>
          <p className="text-slate-300 text-sm mt-1">Pod、Deployment、Service — 容器編排的世界</p>
        </div>
      </div>
    ),
    notes: `我們來把今天上午學到的東西快速整理一下。

第一塊：容器生命週期。容器有五種狀態：Created、Running、Paused、Stopped、Deleted。最重要的一個觀念是 docker stop 和 docker kill 的差別。stop 是先 SIGTERM 讓程序優雅關閉，kill 是直接 SIGKILL 強制終止。記住：正常操作用 stop，緊急情況才用 kill。

第二塊：容器間通訊。預設 bridge 網路沒有 DNS，容器間只能用 IP 互連，IP 還可能每次都不一樣，非常不穩定。解法是建立自訂網路，在自訂網路裡，容器可以用名稱直接通訊，Docker 有內建 DNS 解析。

第三塊：埠號映射。-p 主機:容器 是最常用的方式，記住語法要從右往左讀。大寫 -P 是自動分配。最重要的安全習慣：資料庫等不應對外暴露的埠，用 127.0.0.1:埠 綁定本機。

第四塊：Volume 和設定管理。Bind Mount 掛宿主機目錄，適合開發環境；Named Volume 由 Docker 管理，適合生產環境有狀態服務。環境變數用 --env-file 管理，.env 不能放進 Git。資源限制是生產環境必做的事，保護宿主機不被單一容器拖垮。

今天這些內容都是 Kubernetes 的前置知識。K8s 的網路、儲存、設定管理，本質上都是今天這些概念的進階版本。打好這個基礎，下堂課進入 K8s 會順暢很多。有問題現在問，趁還記得！`,
    duration: "5",
  },

  // ========== Q&A 與課後作業 ==========
  {
    title: "課後作業 & Q&A",
    section: "課程總結",
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-k8s-blue mb-4">📝 動手作業</h3>
          <ol className="space-y-3 text-slate-300">
            {[
              "跑一個 MySQL 容器，用 Named Volume 保存資料，刪除容器後重新建立，確認資料還在",
              "建立自訂網路，跑 nginx 和 curl 兩個容器在同一網路，用容器名稱互相 ping",
              "跑一個 nginx 容器，設 --memory 256m --cpus 0.5，用 docker stats 觀察資源使用",
              "（進階）建立 .env 檔案，用 --env-file 啟動 PostgreSQL，並用 docker exec 進入容器驗證變數",
            ].map((task, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-k8s-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm">{task}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">❓ 還有問題嗎？</p>
          <p className="text-slate-300 text-sm mt-1">現在是 Q&A 時間，任何今天的內容都可以問！</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <p className="text-slate-400 text-sm">下午 13:00 繼續 — Docker Compose 多服務編排</p>
        </div>
      </div>
    ),
    notes: `最後留一些時間給大家問問題，也說明一下課後作業。

作業設計了四個層次：

第一題是驗證 Named Volume 的核心概念：跑一個 MySQL 容器，寫入一些資料，然後刪掉容器，再建一個新的 MySQL 容器掛上同一個 Volume，確認資料還在。這個練習讓你親身體驗到 Volume 的價值。

第二題是驗證自訂網路的 DNS 功能：建立一個自訂網路，在裡面跑一個 nginx 和一個有 curl 指令的容器，從 curl 容器用 nginx 的容器名稱去 ping 或發 HTTP 請求，確認名稱解析有效。可以用 alpine 加上 curl 或 busybox 作為測試容器。

第三題是觀察資源限制的效果：跑一個 nginx 容器，設定記憶體和 CPU 上限，然後用 docker stats 觀察它的使用量，感受一下監控工具的使用方式。

第四題是進階題：把所有的環境變數放進 .env 檔案，用 --env-file 啟動 PostgreSQL，完成後進到容器裡執行 env 指令，確認環境變數正確設定了。

這些作業都建立在今天課堂上教過的內容上，獨立完成的話應該可以做到。遇到問題先試著自己解決，實在解不開再去課程群組問。助教和我都在群組裡。

現在開放問答，今天任何內容有不清楚的地方都可以問。下午一點我們繼續，進入 Docker Compose 的世界，學習如何用一個設定檔管理多個容器。`,
    duration: "5",
  },
]
