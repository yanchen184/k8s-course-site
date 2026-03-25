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
  // ============================================================
  // 4-1：Docker 扛不住了 — K8s 登場（3 張）
  // ============================================================

  // ── 4-1（1/3）：開場 + 前三堂回顧 + minikube 安裝 ──
  {
    title: '第四堂：Docker 扛不住了 — K8s 登場',
    subtitle: '從單機到叢集，一條因果鏈串起八個核心概念',
    section: '4-1：Docker 扛不住了',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">先跑安裝（背景下載不影響聽課）</p>
          <p className="text-slate-300 text-sm">安裝完成後執行 <code className="text-green-400">minikube start</code> 建立叢集，邊裝邊上課</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">前三堂回顧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">堂次</th>
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">學會的技能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Day 1</td>
                <td className="py-2 pr-4">Linux 基礎</td>
                <td className="py-2">終端機操作、檔案管理、網路設定</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Day 2</td>
                <td className="py-2 pr-4">Docker 入門</td>
                <td className="py-2">Image、Container、Port Mapping、Volume</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Day 3</td>
                <td className="py-2 pr-4">Docker 進階</td>
                <td className="py-2">Dockerfile、Docker Compose、多容器編排</td>
              </tr>
            </tbody>
          </table>
          <p className="text-slate-400 text-xs mt-2">到 Day 3 結束，一台機器上用 Docker Compose 跑得很好。三五個容器、一台機器，管得服服貼貼。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">今天的主線：一條因果鏈</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">Docker 扛不住</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Pod</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Service</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Ingress</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">ConfigMap</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Secret</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Volume</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Deployment</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StatefulSet</span>
          </div>
          <p className="text-slate-400 text-xs text-center mt-1">每解決一個問題，就冒出下一個 -- 因果鏈就是 K8s 的核心</p>
        </div>
      </div>
    ),
    code: `# Ubuntu 安裝 minikube（先跑起來，背景下載）
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start`,
    notes: `各位同學大家好，歡迎來到第四堂課。

在開始之前，先提醒大家一件事。等一下我們會需要用到 minikube 這個工具，安裝需要一點時間，所以建議你現在就先把安裝指令跑起來，讓它在背景下載，不影響你聽課。指令在螢幕上，如果你用的是 Ubuntu，就是這三行。跑完之後再執行 minikube start，讓它把叢集先建起來。好，我們邊裝邊上課。

先回顧一下我們前三堂走過的路。第一堂課學了 Linux 基礎，學會在終端機裡操作檔案、管理網路。第二堂課進入 Docker 的世界，學了 Image、Container、Port Mapping、Volume。第三堂課更進一步，學了 Dockerfile 自己打包 Image，學了 Docker Compose 用一個 YAML 同時管好幾個容器。我們做了一個前端加後端加資料庫的組合，一個 docker compose up 就全部跑起來了。

到第三堂結束的時候，我們已經可以在一台機器上用 Docker Compose 把一整套系統跑起來，而且跑得很好。開發環境、測試環境，三五個容器，一台機器，Docker Compose 管得服服貼貼的。

但是現在我要你想像一個場景。

你在一家電商公司工作，業務越來越大。一開始就是一個 API 加一個資料庫，兩三個容器搞定。但是老闆說要加訊息佇列處理訂單、加 Redis 做快取、加 Elasticsearch 做搜索、加 Prometheus 做監控。容器越來越多，幾十個、上百個。使用者也越來越多，一台機器的 CPU 和記憶體頂不住了。

這時候問題一個接一個地冒出來。

[▶ 下一頁]`,
  },

  // ── 4-1（2/3）：五大問題 + Docker Compose 做不到 ──
  {
    title: 'Docker Compose 的五個死穴',
    subtitle: '電商場景：業務長大後，一台機器扛不住了',
    section: '4-1：Docker 扛不住了',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">Docker Compose 只管一台機器，以下全做不到</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4 w-8">#</th>
                <th className="pb-2 pr-4">問題</th>
                <th className="pb-2">電商場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1</td>
                <td className="py-2 pr-4 font-semibold text-white">跨機器調度</td>
                <td className="py-2">CPU 跑滿了，三十台機器拿 Excel 記誰在哪？</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2</td>
                <td className="py-2 pr-4 font-semibold text-white">故障恢復</td>
                <td className="py-2">凌晨三點硬碟壞了，十幾個容器全停半小時</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">3</td>
                <td className="py-2 pr-4 font-semibold text-white">彈性擴縮</td>
                <td className="py-2">雙十一零點流量暴增十倍，手動 scale 來不及</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">4</td>
                <td className="py-2 pr-4 font-semibold text-white">不停機更新</td>
                <td className="py-2">停舊啟新中間幾十秒空窗 = 幾萬損失</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">5</td>
                <td className="py-2 pr-4 font-semibold text-white">服務發現</td>
                <td className="py-2">DB 重啟 IP 變了，API 還在連舊 IP，服務掛了</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">共同特徵</p>
          <p className="text-slate-300 text-sm">五個問題全部跟<strong className="text-white">「多台機器」</strong>有關。Docker 就是單機工具，規模超出一台它就無能為力。你需要一個管<strong className="text-white">「一群機器」</strong>的工具。</p>
        </div>
      </div>
    ),
    notes: `第一個，一台機器扛不住了，容器要分散到多台機器。你的 CPU 跑滿了、記憶體不夠了，得把容器分到好幾台機器上。但你回頭看看 Docker Compose，它只能管一台機器上的容器。你有三台機器，它沒辦法幫你決定這個容器該跑在哪台上。你只能自己 SSH 到每台機器上去跑 docker compose up，然後自己記住誰在哪裡。三台還勉強，三十台呢？拿 Excel 在那邊記嗎？而且你怎麼知道哪台機器還有空位？每次部署都先 SSH 進去看一下 CPU 用了多少嗎？管不動。

第二個，機器掛了，上面的容器全死了。你好不容易把容器分到三台機器上，凌晨三點第二台的硬碟壞了，整台掛了，上面十幾個容器全停。你被電話叫醒，睡眼惺忪地查哪些容器在那台上，再 SSH 到其他機器一個一個重新部署。半小時過去了，使用者看了半小時的錯誤頁面。Docker 不會幫你做這件事。它不知道哪台掛了，更不會自動搬家。它本來就是設計給單機用的。

第三個，流量暴增，來不及加容器。雙十一零點一到，流量瞬間暴增十倍，API 扛不住，回應時間從一百毫秒飆到五秒。你可以用 docker compose up scale，但只能在一台機器上加，而且得你自己手動去敲。等你反應過來、敲完指令、容器跑起來，好幾分鐘過去了，使用者早就看到一堆 502 然後跑了。流量退了之後你又得記得把多的容器關掉，不然白花錢。你有辦法每天盯著流量圖表手動調嗎？

第四個，更新版本要停機。API 有新版本要上線，最土的做法就是停掉舊容器、啟動新容器。中間那幾秒到幾十秒，使用者連不上。對電商來說，幾秒鐘可能就是幾萬塊的損失。Docker Compose 沒有內建不停機更新。你可以自己寫腳本，但要處理的邊界情況多到你不想面對：新容器啟動失敗怎麼辦？健康檢查怎麼定義？舊容器正在處理的請求怎麼辦？

第五個，跨機器的容器找不到對方。API 在機器一，資料庫在機器二。API 要連資料庫，你把 IP 寫在環境變數裡。結果資料庫重啟了，IP 變了，API 還在連舊的 IP，連不上，服務掛了。Docker Compose 在同一台機器上可以用服務名稱互連，這個我們學過。但跨機器呢？Docker Network 跨不了機器。你要自己搭服務發現系統嗎？那又是另一個工程。

好，整理一下。五個問題：跨機器分配、故障恢復、彈性擴縮、不停機更新、跨機器服務發現。你有沒有注意到一個共同點？全部跟「多台機器」有關。Docker 就是一個單機工具，規模超出一台機器它就無能為力了。你需要一個管「一群機器」的工具。

這就是 Kubernetes 要解決的。

[▶ 下一頁]`,
  },

  // ── 4-1（3/3）：K8s 登場 + 五問題對應解法 + 宣告式管理 ──
  {
    title: 'Kubernetes 登場：五個問題，五個解法',
    subtitle: 'Google Borg 十五年、二十億容器驗證 → 開源 → 行業標準',
    section: '4-1：Docker 扛不住了',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">K8s 背景</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Google 內部 <strong className="text-white">Borg</strong>（2003+），每週啟動<strong className="text-white">20 億</strong>個容器</li>
            <li>2014 年用 Go 重寫開源 → <strong className="text-white">Kubernetes（K8s）</strong>（K 和 s 之間 8 個字母）</li>
            <li>捐給 CNCF → AWS / GCP / Azure / 阿里雲全部提供託管服務</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">問題（紅）→ 解法（綠）一一對應</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4 text-red-400">問題</th>
                <th className="pb-2 text-green-400">K8s 解法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">跨機器調度</td>
                <td className="py-2"><strong className="text-blue-400">Scheduler</strong> 自動看哪台空閒就放哪台</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">故障恢復</td>
                <td className="py-2"><strong className="text-blue-400">Controller</strong> 偵測故障、自動搬家重建</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">彈性擴縮</td>
                <td className="py-2"><strong className="text-blue-400">HPA</strong> CPU 超 70% 自動加，退了自動縮</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">不停機更新</td>
                <td className="py-2"><strong className="text-blue-400">Deployment</strong> 滾動替換 + 一鍵回滾</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">服務發現</td>
                <td className="py-2"><strong className="text-blue-400">Service + CoreDNS</strong> 穩定名稱、跨 Node</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">核心理念：宣告式 vs 命令式</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-2 rounded">
              <p className="text-red-400 font-semibold text-xs mb-1">命令式（Docker）</p>
              <p className="text-slate-400 text-xs">自己站在鍋前：開火、放油、放牛排、翻面、計時</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-2 rounded">
              <p className="text-green-400 font-semibold text-xs mb-1">宣告式（K8s）</p>
              <p className="text-slate-400 text-xs">跟服務生說「牛排七分熟」，廚師自己搞定</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">你告訴 K8s「我要 3 個 nginx」，它自己建、自己修、<strong className="text-white">持續維護</strong>。至於怎麼做到，K8s 自己處理。</p>
        </div>
      </div>
    ),
    notes: `Kubernetes，簡稱 K8s，K 和 s 之間有 8 個字母所以叫 K8s。這個名字來自希臘語，意思是「舵手」或「領航員」，就是在大海上掌舵的那個人。你可以想像你的容器是一艘大船上的貨物，K8s 就是幫你掌舵的船長，決定貨物怎麼擺、航線怎麼走、碰到風浪怎麼應對。

K8s 的故事要從 Google 說起。2003 年左右，Google 內部開發了一套系統叫做 Borg。那個時候 Docker 都還不存在，Docker 是 2013 年才出來的。但 Google 在 2003 年就已經在用容器了，只是他們用的不是 Docker，是自己內部的容器技術。Borg 就是用來管理這些容器的系統。

Borg 管的規模有多大？Google 自己在 2015 年發表的論文裡面說，他們每週要啟動超過二十億個容器。二十億，不是二十個，不是兩萬個，是二十億。Google 搜尋、Gmail、YouTube、Google Maps，這些你每天在用的服務，背後全部都是 Borg 在管。這套系統跑了超過十五年，經過了數十億容器、幾百萬台機器的實戰驗證。

2014 年，Google 決定把 Borg 的核心設計理念拿出來，用 Go 語言從頭重新實作，開源給全世界使用。這就是 Kubernetes 的誕生。注意，K8s 不是 Borg 的開源版本，它是受 Borg 啟發重新設計的。Google 還把另一個內部系統 Omega 的一些改進也融合進去了。

Google 為什麼要把這麼值錢的東西免費送出來？因為他們賭的是雲端市場。如果全世界的人都用 K8s，而 Google 的雲端平台 GCP 對 K8s 的支援最好，那大家就會選 GCP。事實上這個策略部分成功了，GKE 確實是目前公認 K8s 體驗最好的雲端服務之一。

2015 年，Google 把 K8s 捐給了 CNCF，也就是雲端原生運算基金會。CNCF 是 Linux 基金會底下的一個組織，專門管理雲端原生相關的開源專案。K8s 是 CNCF 的第一個專案，也是最重要的一個。把 K8s 捐出去意味著它不再是 Google 一家的東西，而是整個社群共同維護的。這一步非常關鍵，因為如果 K8s 一直是 Google 的，其他雲端廠商不會願意支持競爭對手的產品。捐出去之後，AWS、Azure、阿里雲、騰訊雲全部跳進來一起貢獻，K8s 的生態系統爆炸性成長。

但 K8s 不是一開始就贏的。2014 年 K8s 剛出來的時候，容器編排這個領域是一片混戰。Docker 自己有一個叫 Docker Swarm 的編排工具，用起來最簡單，跟 Docker 無縫整合。Apache 有一個叫 Mesos 的專案，Twitter 和 Airbnb 都在用，擅長管理超大規模的叢集。還有 Cloud Foundry、Nomad 等等。每一個都在搶「誰是容器編排的標準」這個位置。

為什麼最後是 K8s 贏了？三個原因。第一，Google 十五年的 Borg 經驗讓 K8s 的架構設計遠比其他工具成熟，它從一開始就考慮了大規模、高可用、自動修復這些生產環境的需求。Docker Swarm 簡單但功能太少，Mesos 強大但太複雜。K8s 剛好在中間，夠強又不會太難。第二，Google 把 K8s 捐給了 CNCF，讓它變成社群共有的專案。這讓 AWS、Azure、阿里雲這些本來是競爭對手的雲端廠商都願意加入，因為支持 K8s 不等於支持 Google。第三，K8s 的擴展性設計得非常好，你可以用 CRD 和 Operator 在上面加任何功能。這讓整個生態系統爆炸性成長，圍繞 K8s 的工具、外掛、服務多到數不清。

到今天，K8s 的 GitHub repo 有超過十一萬顆星星，超過三千七百個 contributor 來自全球各大公司。CNCF 的年度調查顯示，超過百分之九十六的企業在使用或評估 K8s。它已經不只是一個工具，它是整個雲端原生生態系統的基石。

所有主流雲端服務商都提供了 K8s 的託管服務：AWS 有 EKS，Google 有 GKE，Azure 有 AKS，阿里雲有 ACK，騰訊雲有 TKE。你學會了 K8s，這些平台你都能用，因為底層都是同一套東西。

這也是為什麼你應該花時間學 K8s。它不是某一家公司的私有技術，它是整個行業的標準。你打開任何一個 DevOps 或 SRE 的職缺，十個裡面有八個會要求 Kubernetes 經驗。不讀懂這段歷史，K8s 對你來說只是一個工具。讀懂了，你會知道它為什麼長這樣、為什麼這樣設計、為什麼值得你投資時間。它不是萍水相逢，它是你職業生涯裡面會一直用到的東西。

那 K8s 怎麼解決這五個問題？一個個對回去。

第一，容器要分配到多台機器。K8s 有一個 Scheduler，會自動看每台機器的資源狀況，哪台比較空閒就把容器放到哪台。你不用自己決定。

第二，機器掛了。K8s 持續監控每台機器的狀態，發現掛了就自動把上面的容器搬到其他健康的機器上。不用你半夜起床。

第三，流量暴增。K8s 有自動擴縮容的功能，設定好規則，CPU 超過百分之七十就自動加容器，流量退了自動縮回來。

第四，不停機更新。K8s 內建滾動更新，先啟動新版容器、確認健康了再關舊版，逐步替換。萬一有問題，一個指令回滾。

第五，容器怎麼找到對方。K8s 內建 DNS 和服務發現，每個服務有穩定的名字，不管容器怎麼換、IP 怎麼變，用名字就能找到。

五個問題，五個解決方案，一一對應。K8s 的核心價值就是幫你處理所有「多機器、多容器」的管理工作，讓你專心寫程式。

剛才提到的這些功能，在 K8s 裡面都有對應的核心組件。K8s 的核心組件可多了，我先把名字丟出來讓你有個印象，後面幾支影片會一個一個深入。

容器在 K8s 裡不是直接跑的，它被包在一個叫 Pod 的東西裡面。Pod 之間要互相找到對方、要穩定的連線入口，靠的是 Service。外面的使用者要用域名連進來，靠的是 Ingress。設定資訊不想寫死在 Image 裡，用 ConfigMap 抽出來。密碼這類敏感資訊用 Secret 管理。資料要持久化、不能隨著容器消失，用 Volume。要管理多個 Pod 副本、做擴縮容和滾動更新，用 Deployment。資料庫這種有狀態的應用，用 StatefulSet。

Pod、Service、Ingress、ConfigMap、Secret、Volume、Deployment、StatefulSet。這八個是最核心的，但 K8s 的組件遠不止這些。我們這門課會學到的還包括：ReplicaSet，Deployment 背後自動建的副本管理器。DaemonSet，確保每台機器都跑一份的控制器，適合監控和日誌收集。CronJob，定時執行任務的排程器。Namespace，叢集裡面的資料夾，用來隔離不同環境。PV 和 PVC，持久化儲存的管理機制。HPA，根據 CPU 自動擴縮容的控制器。RBAC，權限控制。NetworkPolicy，網路隔離。Helm，K8s 的套件管理器。還有 Rancher，叢集管理的圖形介面。

聽起來很多對不對？不用怕。我們不會一次全部丟給你，而是用因果鏈一個一個引出來。每解決一個問題，就會冒出下一個問題，然後引出下一個組件。四堂課走完，這些東西你全部都會用。你不需要現在記住這些名字，聽完因果鏈你自然就記住了。

最後講一個很重要的觀念。K8s 的管理方式跟 Docker 有一個根本性的差異。Docker 是命令式的，你告訴它每一步怎麼做：docker run、docker stop、docker rm，一步一步下指令。K8s 是宣告式的，你告訴它你想要什麼狀態：我要三個 nginx 的容器在跑。至於怎麼做到，K8s 自己處理。你不用管它先建哪個、放在哪台機器上、中間有沒有失敗重試。你只要說你要什麼，它就想辦法做到，而且持續維護。就像你跟餐廳服務生說「我要一份牛排七分熟」，你不用管廚師怎麼煎。命令式就是你自己站在鍋子前面，開火、放油、放牛排、翻面、計時，每一步都自己來。

K8s 解決了五個問題，但它是怎麼做到的？它裡面有哪些東西？接下來我帶你從跑第一個容器開始，一步步碰到問題、一步步認識 K8s 的核心概念。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-2：Pod → Service → Ingress — 因果鏈（3 張）
  // ============================================================

  // ── 4-2（1/3）：K8s 不直接管容器 → Pod ──
  {
    title: '要跑容器 → Pod',
    subtitle: 'K8s 不直接管容器，管的最小單位是 Pod',
    section: '4-2：Pod → Service → Ingress',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">問題：K8s 不直接管容器</p>
          <p className="text-slate-300 text-sm">Docker 的世界是 <code className="text-slate-400">docker run nginx</code>，但 K8s 管的最小單位不是 Container，而是 <strong className="text-white">Pod</strong></p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Pod = 容器的包裝</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>便利商店飯糰：米飯和餡料是容器，<strong className="text-white">外面那層塑膠膜就是 Pod</strong></li>
            <li>同一 Pod 裡的容器共享<strong className="text-white">網路</strong>（localhost 互通）和<strong className="text-white">儲存</strong></li>
            <li>Pod 是 K8s 的<strong className="text-white">原子單位</strong> -- 調度、管理、監控都以 Pod 為單位</li>
            <li>絕大多數情況：<strong className="text-white">一個 Pod 一個容器</strong>，先當 Pod = Container 理解</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Sidecar 模式（一個 Pod 多容器的場景）</p>
          <div className="flex items-center justify-center gap-4 my-2">
            <div className="bg-blue-900/40 border border-blue-500/40 p-2 rounded-lg text-center">
              <p className="text-blue-400 font-semibold text-sm">主容器</p>
              <p className="text-slate-400 text-xs">API（寫日誌到檔案）</p>
            </div>
            <div className="text-slate-500 text-xl">+</div>
            <div className="bg-purple-900/40 border border-purple-500/40 p-2 rounded-lg text-center">
              <p className="text-purple-400 font-semibold text-sm">邊車容器</p>
              <p className="text-slate-400 text-xs">日誌收集 → ES</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center">摩托車旁邊掛邊車：主容器是摩托車，輔助容器是邊車</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Node vs Pod vs Container</p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="bg-slate-700/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Node</p>
              <p className="text-slate-400 text-xs">一台機器</p>
            </div>
            <span className="text-slate-500">裡面跑</span>
            <div className="bg-slate-700/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Pod</p>
              <p className="text-slate-400 text-xs">容器的包裝</p>
            </div>
            <span className="text-slate-500">裡面跑</span>
            <div className="bg-slate-700/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Container</p>
              <p className="text-slate-400 text-xs">實際程式</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `上一支影片我們知道了 Docker 扛不住五個問題，所以要用 K8s。好，決定用 K8s 了，第一步是什麼？最基本的，把容器跑起來。

在開始之前，我們先把 K8s 的世界跟 Docker 的世界對照一下，建立一個基本的畫面。

在 Docker 的世界裡，你有一台 Linux 機器，上面裝了 Docker，然後你用 docker run 跑容器。所有的容器都跑在這一台機器上。

K8s 的世界不一樣。K8s 管的不是一台機器，是一群機器。這群機器在 K8s 裡面叫做叢集，cluster。叢集裡面的每一台機器叫做 Node，節點。你的電商公司有三台伺服器，在 K8s 裡就是三個 Node。有十台就是十個 Node。

Node 就是一台機器。可以是公司機房裡的一台實體伺服器，也可以是雲端上的一台虛擬機，也可以是你筆電上的一台 VM。不管它是什麼形式，在 K8s 的眼中它就是一個 Node。每個 Node 上面會跑一些 K8s 的管理程式，像是 kubelet 和 kube-proxy，這些後面架構篇會詳細講。現在你只需要知道：Node 就是機器。

好，機器有了。容器跑在哪裡？在 Docker 裡，容器直接跑在機器上。在 K8s 裡，容器不是直接跑在 Node 上的，中間多了一層叫做 Pod。

Pod 是 K8s 裡面最小的調度單位。注意，不是容器，是 Pod。你可以把 Pod 想成容器外面包了一層殼。就像便利商店的飯糰，米飯和餡料是容器本身，外面那層塑膠膜就是 Pod。K8s 不直接管容器，它管的是 Pod。所有的調度、監控、重啟、擴縮，都是以 Pod 為單位的。

所以現在畫面是這樣的：最外面是叢集，叢集裡面有很多 Node，每個 Node 上面跑很多 Pod，每個 Pod 裡面裝著容器。三層結構：Node 是機器，Pod 是容器的包裝，Container 是實際跑的程式。

在 Docker 的世界裡，你是一台機器上跑一堆容器。在 K8s 的世界裡，你是很多台機器上跑一堆 Pod。而且你不用管每個 Pod 放在哪個 Node 上，K8s 的 Scheduler 會自動幫你決定。這就是從 Docker 到 K8s 最大的觀念轉變：你不再管「機器」，你管的是「我要什麼」，K8s 幫你搞定「放在哪」。

那一個 Pod 裡面只能放一個容器嗎？不一定，一個 Pod 裡面可以放多個容器。這些容器共享同一個網路和儲存空間，可以用 localhost 互相溝通。但什麼時候需要放多個？通常是主程式搭配一個輔助程式，比如 API 容器旁邊放一個日誌收集容器。這種模式叫 Sidecar，邊車模式，下午會詳細做。

不過絕大多數情況下，最佳實踐是一個 Pod 只放一個容器。為什麼？兩個原因。第一是解耦。如果你把 API 和日誌收集塞在同一個 Pod 裡，日誌收集器有 bug 導致 crash，整個 Pod 會重啟，你的 API 也跟著被拉下水。分開放的話，日誌收集器掛了不影響 API。第二是擴展。假設你的 API 流量暴增需要從 3 個擴到 10 個，如果 API 跟日誌收集綁在同一個 Pod，你擴 API 的時候日誌收集也跟著擴了 10 份，但它根本不需要那麼多，白白浪費資源。分開放的話，API 擴 10 個，日誌收集維持 3 個就好，各自獨立擴縮。所以除非兩個容器真的緊密到不能分開，否則就一個 Pod 一個容器。你現在就把 Pod 等於容器來理解就好。

好，回到主線。docker run nginx，在 K8s 就是建一個 nginx 的 Pod，跑在某個 Node 上。K8s 幫你選 Node，你不用管。

Pod 跑起來了。然後呢？問題馬上來了。

[▶ 下一頁]`,
  },

  // ── 4-2（2/3）：Pod IP 會變（10.244.0.5→10.244.0.8）→ Service + 三種類型 ──
  {
    title: 'Pod IP 會變 → Service',
    subtitle: '10.244.0.5 → 10.244.0.8，前端傻傻連舊 IP，一片空白',
    section: '4-2：Pod → Service → Ingress',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：Pod IP 不穩定 + 外面連不到</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1 space-y-1">
            <p className="text-sm text-slate-300">後端 Pod IP = <code className="text-red-400">10.244.0.5</code></p>
            <p className="text-sm text-slate-300">Pod 掛了重建 → 新 IP = <code className="text-red-400">10.244.0.8</code></p>
            <p className="text-sm text-slate-300">前端還在連 <code className="text-red-400">10.244.0.5</code> → <strong className="text-red-400">連不上，一片空白</strong></p>
            <p className="text-sm text-slate-400 mt-1">而且 Pod IP 是叢集內部虛擬 IP，外面的使用者根本連不到</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Service = Pod 前面的穩定代理</p>
          <p className="text-slate-300 text-sm">不管後面 Pod 怎麼換、IP 怎麼變，Service 的地址<strong className="text-white">永遠不變</strong>。自動追蹤健康的 Pod，把請求轉過去。就像公司<strong className="text-white">總機號碼</strong>，不管接線員換幾個人。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Service 三種類型</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">類型</th>
                <th className="pb-2 pr-4">作用</th>
                <th className="pb-2">對照 Docker</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">ClusterIP</td>
                <td className="py-2 pr-4">叢集內部 IP + <strong className="text-white">DNS 名稱</strong>（預設）</td>
                <td className="py-2">Docker Network 容器名互連</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">NodePort</td>
                <td className="py-2 pr-4">每個 Node 開 30000-32767 Port</td>
                <td className="py-2"><code>docker run -p 8080:80</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">LoadBalancer</td>
                <td className="py-2 pr-4">雲端自動分配外部 IP</td>
                <td className="py-2">Docker 沒有對應</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1">ClusterIP + CoreDNS</p>
          <p className="text-slate-300 text-sm">API 直接用 <code className="text-green-400">mysql-service</code> 名稱連 DB，K8s 內建 CoreDNS 自動解析。跟 Docker Compose 服務名互連一樣的概念，但<strong className="text-white">可跨 Node 運作</strong>。</p>
        </div>
      </div>
    ),
    notes: `K8s 給這個 Pod 分配了一個 IP，假設是 10.244.0.5。你的前端 Pod 要連這個後端 Pod，就寫 10.244.0.5。跑了兩天，後端 Pod 掛了。可能是程式 bug 吃光記憶體，可能是 Node 硬體故障，原因很多。K8s 偵測到了，自動幫你重建了一個新的 Pod。問題是，新的 Pod 拿到了一個全新的 IP，10.244.0.8。前端還在傻傻地連 10.244.0.5，連不上了。你的使用者看到的就是一片空白。

這個問題在 Docker 裡我們也碰過。Docker 容器也有內部 IP，重啟就會變。所以 Docker Compose 才讓你用服務名稱互連，不用記 IP。K8s 要解決的是同樣的問題，只是規模更大、跨機器。

而且還有另一個問題。Pod 的 IP 是叢集內部的虛擬 IP，就像公司內網的 IP，外面的使用者根本連不到。你的使用者在家裡打開瀏覽器，用這個 IP 是連不上你的服務的。Docker 也一樣，容器有內部 IP，外面連不到，所以要用 -p 做 Port Mapping。

IP 會變、外面連不到。怎麼辦？K8s 說：別直接連 Pod，中間加一層 Service。

Service 就是 Pod 前面的一個穩定代理人。不管後面的 Pod 怎麼換、IP 怎麼變，Service 的地址不變。Service 會自動追蹤後面有哪些健康的 Pod，把請求轉過去。Pod 掛了換新的，Service 知道，自動更新轉發目標。就像公司的總機號碼，不管接線員換了幾個人，總機號碼永遠不變。

Service 有三種類型。

第一種，ClusterIP，這是預設類型。它給你一個叢集內部的虛擬 IP，只有叢集裡面的 Pod 能存取。什麼時候用？API 要連資料庫，資料庫不需要讓外面連，叢集內部能連就好，用 ClusterIP。

ClusterIP 還有一個超好用的功能：DNS。K8s 內建了 CoreDNS 服務，你建一個 Service，K8s 自動幫你在 DNS 註冊一筆記錄。所以你的 API 不需要用 IP 去連資料庫，直接用 Service 的名字就好。資料庫的 Service 叫 mysql-service，API 就直接連 mysql-service 這個名字，DNS 自動解析成正確的 IP。這跟 Docker Compose 用服務名稱互連是一樣的概念，只是 K8s 的版本可以跨 Node 運作。

第二種，NodePort。它在每個 Node 上開一個 Port，30000 到 32767 之間，讓外面可以通過 Node 的 IP 加這個 Port 連進來。這就像 Docker 的 -p 8080:80，把 Port 映射出來。差別在於 NodePort 在叢集裡每個 Node 上都開同一個 Port，連任何一個 Node 都可以。開發測試很常用，簡單直接。

第三種，LoadBalancer。它向雲端服務商申請一個負載均衡器，自動分配一個外部 IP。AWS、GCP 那些雲環境比較常用，之後再細講。

OK，叢集內部的 Pod 互相找得到了，外部也可以通過 NodePort 連進來了。但是你想想，你會讓使用者用 http 冒號雙斜線 192.168.1.100 冒號 30080 來存取你的網站嗎？不會嘛。這又長又醜又難記。使用者要的是域名，www.myshop.com。

[▶ 下一頁]`,
  },

  // ── 4-2（3/3）：192.168.1.100:30080 太醜 → Ingress + 流量路徑圖 ──
  {
    title: '192.168.1.100:30080 太醜 → Ingress',
    subtitle: 'Ingress = HTTP 路由器，讓使用者用域名連進來',
    section: '4-2：Pod → Service → Ingress',
    duration: '4',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">問題：NodePort 地址使用者不能用</p>
          <p className="text-slate-300 text-sm">你會讓使用者打 <code className="text-red-400">http://192.168.1.100:30080</code> 嗎？又長又醜又難記。使用者要的是 <code className="text-green-400">www.myshop.com</code></p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Ingress = K8s 版 Nginx 反向代理</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>根據<strong className="text-white">域名 / 路徑</strong>將 HTTP 請求轉發到不同 Service</li>
            <li>可設定 SSL 憑證（HTTPS），用 YAML 設定，apply 即生效</li>
            <li>Ingress = 規則（<strong className="text-white">地圖</strong>），Ingress Controller = 執行者（<strong className="text-white">司機</strong>）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">路由範例</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4"><code>www.myshop.com</code></td>
                <td className="py-2">→ 前端 Service</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4"><code>www.myshop.com/api</code></td>
                <td className="py-2">→ 後端 API Service</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code>admin.myshop.com</code></td>
                <td className="py-2">→ 管理後台 Service</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">完整流量路徑（4-2 因果鏈總結）</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">使用者</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded">Ingress</span>
            <span className="text-slate-400 text-xs">（七層 HTTP 路由）</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">Service</span>
            <span className="text-slate-400 text-xs">（四層 TCP 穩定入口）</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">Pod</span>
          </div>
          <div className="mt-3 bg-amber-900/30 border border-amber-500/40 p-2 rounded">
            <p className="text-amber-400 text-xs">Service 和 Ingress 是<strong>配合使用</strong>，不是取代。Service 做穩定入口 + 負載均衡，Ingress 做域名路由。第六堂課實際操作。</p>
          </div>
        </div>
      </div>
    ),
    notes: `所以又多了一層，Ingress。

Ingress 是一個 HTTP 層的路由器。它坐在 Service 前面，接收外部進來的 HTTP 請求，根據域名或路徑轉發到不同的 Service。比如你的電商網站有前端、API、管理後台三個 Service。在 Ingress 裡設定：www.myshop.com 轉到前端，www.myshop.com/api 轉到後端，admin.myshop.com 轉到管理後台。一個域名底下不同路徑導到不同服務，這在實際專案非常常見。你還可以在 Ingress 上設 SSL 憑證，讓網站支援 HTTPS。

用 Docker 的時候你可能自己架一個 Nginx 做反向代理，把不同域名轉到不同容器。Ingress 就是 K8s 版本的 Nginx 反向代理，用 YAML 設定，改完一 apply 規則就生效，不用你自己去改 Nginx 設定檔。

你可能會問：Ingress 跟 Service 不是重複了嗎？不是。Service 解決的是穩定入口和負載均衡，它在四層工作，也就是 TCP/UDP 層。Ingress 解決的是 HTTP 路由，它在七層工作。一般來說 Ingress 在最外面接收 HTTP 請求，轉給 Service，Service 再轉給 Pod。它們是配合使用的。

注意一點，Ingress 本身只是規則定義，說「我想要這樣路由」。它需要搭配一個 Ingress Controller 才能運作。Ingress Controller 是真正處理流量的程式，常見的有 Nginx Ingress Controller、Traefik。Ingress 是地圖，Ingress Controller 是看著地圖開車的司機。沒有地圖不知道往哪開，沒有司機地圖就只是一張紙。第六堂課我們會實際操作。

來整理一下。我們從跑容器開始，碰到了三個問題，引出了三個概念。要跑容器，用 Pod。Pod 的 IP 會變、外面連不到，所以加 Service。Service 用 NodePort 可以從外面連，但地址太醜使用者不能用，所以加 Ingress。流量的路徑是：使用者發請求，先到 Ingress，Ingress 根據域名和路徑轉到對應的 Service，Service 再轉到後面健康的 Pod。

容器能跑、能連、外面也看得到了。但是新的問題又來了。容器跑起來了沒錯，可是資料庫的地址寫死在 Image 裡面，換個環境就要重新 build。密碼也不知道放哪裡。容器掛了資料就沒了。這些問題怎麼辦？下一支影片我們繼續解決。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-3：ConfigMap → Secret → Volume — 因果鏈（2 張）
  // ============================================================

  // ── 4-3（1/2）：設定寫死→ConfigMap / 密碼明文→Secret（+Base64 警告）──
  {
    title: '設定寫死 → ConfigMap / 密碼明文 → Secret',
    subtitle: '兩個問題，兩個解法，一條因果鏈',
    section: '4-3：ConfigMap → Secret → Volume',
    duration: '5',
    content: (
      <div className="space-y-4">
        {/* 第一組因果：設定寫死 → ConfigMap */}
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-1">問題 1：資料庫地址寫死在 Image</p>
          <p className="text-slate-300 text-xs">dev-db:3306 / test-db:3306 / prod-db:3306 三個環境 → 每次換環境要改設定、重新 build Image → 上線的跟測試的不同版本，風險很大</p>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm mb-1">解法 1：ConfigMap -- 設定與 Image 完全分離</p>
          <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
            <li><strong className="text-white">環境變數注入</strong>：簡單設定（DB_HOST、PORT），改了要<strong className="text-amber-400">重啟 Pod</strong></li>
            <li><strong className="text-white">Volume 掛載</strong>：複雜設定檔（nginx.conf），改了<strong className="text-green-400">自動更新不用重啟</strong></li>
            <li>上限 1 MB，超過就該重新想架構</li>
          </ul>
        </div>

        {/* 第二組因果：密碼明文 → Secret */}
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-1">問題 2：密碼也在 ConfigMap → 任何人都看得到</p>
          <p className="text-slate-300 text-xs">十個開發者都有 ConfigMap 權限 → 全部看得到 DB 密碼、API Key、SSL 憑證</p>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm mb-1">解法 2：Secret -- 敏感資料獨立管理</p>
          <p className="text-slate-300 text-xs">用法跟 ConfigMap 幾乎一樣，分成不同資源類型 → 可用 <strong className="text-white">RBAC</strong>（角色型存取控制）分別控制權限。一般開發者只能看 ConfigMap，運維才能看 Secret。</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">Base64 不是加密！</p>
          <p className="text-slate-300 text-xs">Base64 只是編碼格式（中文翻英文，誰都能翻回來），<code className="text-amber-400">base64 --decode</code> 一秒解回原文。千萬不要以為放進 Secret 就安全了。真正安全靠 <strong className="text-white">RBAC 權限控制</strong> + etcd 加密（第七堂講）。</p>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm mb-1">補充：Sealed Secret（進階）</p>
          <p className="text-slate-300 text-xs">想把 Secret YAML 放進 Git？Base64 一解碼密碼就曝光。<strong className="text-white">Sealed Secret</strong> 用 RSA 非對稱加密（公鑰鎖、私鑰開），私鑰只存在叢集裡，外面拿到也解不開。GitOps 團隊必備。課程不深入，知道有就好。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm mb-2">Docker 對照</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-slate-400"><code>docker run -e DB_HOST=xxx</code></div>
            <div className="text-slate-300">→ ConfigMap</div>
            <div className="text-slate-400">Docker Compose <code>.env</code> 檔</div>
            <div className="text-slate-300">→ Secret（都是明文，安全靠檔案權限）</div>
          </div>
        </div>
      </div>
    ),
    notes: `上一支影片我們解決了三件事：容器用 Pod 跑起來了，Pod 之間用 Service 互相找到了，外面的使用者用 Ingress 加域名連進來了。容器能跑、能連、外面也看得到了。

但是新的問題馬上冒出來。

你的 API 容器要連資料庫。資料庫的地址和 Port 寫在哪裡？最直覺的做法就是寫在程式的設定檔裡，然後打包進 Image。問題來了：開發環境的資料庫是 dev-db:3306，測試環境是 test-db:3306，上線是 prod-db:3306。三個環境，三個不同的地址。設定寫死在 Image 裡面，每次換環境就要改設定、重新 build Image、重新部署。煩不煩？更要命的是，上線的 Image 跟測試的 Image 不一樣了，你怎麼確保上線的就是你測過的那個版本？這會帶來很大的風險。

Docker 的時候我們怎麼解決的？用環境變數 -e，或者 Docker Compose 的 environment 區塊，把設定從 Image 抽出來。同一個 Image 在不同環境跑，換環境變數就好。

K8s 提供了一個更完整的方案，叫 ConfigMap。

ConfigMap 就是一個存設定的物件。資料庫地址、Port、各種參數，通通存在 ConfigMap 裡面，讓 Pod 去讀。設定和 Image 完全分離，要改設定就改 ConfigMap，不用重 build Image。

ConfigMap 有兩種使用方式，值得花一點時間比較。

第一種，環境變數注入。Pod 啟動的時候，K8s 把 ConfigMap 裡的值設成環境變數，程式直接讀環境變數。跟 Docker 的 -e 一樣。簡單直覺，適合少量設定，像資料庫地址、Port。但有一個限制：環境變數是 Pod 啟動時注入的，後來改了 ConfigMap，正在跑的 Pod 不會自動更新，你要重啟 Pod 才能拿到新值。

第二種，Volume 掛載。K8s 把 ConfigMap 的內容變成檔案，掛到 Pod 裡面的某個目錄下。程式去讀那個檔案就好。好處是 ConfigMap 改了之後，掛載的檔案會自動更新，不用重啟 Pod。但你的程式要自己偵測檔案變化或定期重新讀取。適合設定內容比較多比較複雜的情況，比如一整個 nginx.conf。

一般來說，簡單的設定用環境變數，複雜的設定檔用 Volume 掛載。實際上很多專案兩種都用：資料庫連線地址用環境變數，nginx 設定檔用 Volume 掛載。順帶一提，ConfigMap 的大小上限是 1 MB。如果你的設定檔超過這個大小，可能需要重新想想架構了。

好，設定的問題解決了。但馬上又來一個問題。

你的資料庫密碼放哪裡？也放 ConfigMap 嗎？ConfigMap 的資料是明文的，任何有權限存取 ConfigMap 的人都看得到。你的叢集裡有十個開發者都有權限看 ConfigMap，那他們都能看到資料庫密碼。API 金鑰、SSL 憑證，這些敏感的東西也全看光了。這不行。

所以 K8s 又提供了一個東西叫 Secret。Secret 跟 ConfigMap 非常像，用法幾乎一樣，差別在於 Secret 的內容會做 Base64 編碼。

但是這裡我要特別講清楚一件事，很多初學者會搞錯：Base64 是編碼，不是加密。加密是用金鑰把資料鎖起來，沒有金鑰打不開。Base64 只是一種轉換格式，就像把中文翻譯成英文，任何人都能翻回來。你拿到一個 Base64 字串，終端機裡執行一個 base64 decode 指令，一秒鐘就解回原文了。所以千萬不要以為放進 Secret 就安全了。

那 Secret 的意義在哪裡？意義在於 K8s 把 Secret 和 ConfigMap 分成兩種不同的資源類型。這樣你就可以用 RBAC 來分別控制權限。RBAC 就是角色型存取控制。你可以設定規則：一般開發者只能看 ConfigMap，不能看 Secret，只有運維人員才能存取 Secret。這樣密碼就不會被隨便看到了。真正的安全是靠權限控制、靠加密機制，不是靠 Base64。第七堂課會講 RBAC 的實際操作。

補充一個進階的東西，叫 Sealed Secret。剛才說 Secret 的 Base64 不安全，那如果你想把 Secret 的 YAML 放進 Git 做版本控制怎麼辦？直接 commit 的話，裡面的 Base64 一解碼密碼就曝光了。Sealed Secret 是一個開源工具，它用 RSA 非對稱加密把你的 Secret 加密成 SealedSecret。什麼是非對稱加密？簡單說就是有兩把鑰匙：一把公鑰、一把私鑰。你用公鑰把密碼鎖起來，鎖起來之後只有私鑰能打開。公鑰可以給任何人，但私鑰只存在你的 K8s 叢集裡面。所以你在本機用公鑰加密 Secret，加密後的 YAML 可以安全地放進 Git，因為就算別人拿到了，沒有私鑰也解不開。只有你的 K8s 叢集能解密並還原成真正的 Secret。如果你的團隊用 GitOps 管理 K8s 資源，Sealed Secret 幾乎是必備的。這個我們課程不會深入實作，但你知道有這個東西，以後在生產環境會用到。

如果對照 Docker 的話，ConfigMap 就像 docker run -e 的環境變數，Secret 就像 Docker Compose 裡的 .env 檔案。Docker 的 .env 檔案也是明文的，安全性也是靠檔案權限控制。概念是類似的。

[▶ 下一頁]`,
  },

  // ── 4-3（2/2）：容器掛了資料消失 → Volume ──
  {
    title: '容器掛了資料消失 → Volume',
    subtitle: '把資料存在 Pod 外面，搬家資料不丟',
    section: '4-3：ConfigMap → Secret → Volume',
    duration: '4',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">問題：MySQL 容器重啟 → 資料全沒了</p>
          <p className="text-slate-300 text-sm">容器的檔案系統是臨時的。幾百萬筆客戶訂單，容器一刪就消失。老闆明天就會請你離開。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Volume -- 資料存在 Pod 外面</p>
          <p className="text-slate-300 text-sm">就像租房子把個人物品放<strong className="text-white">儲物間</strong>，不管搬幾次家，儲物間的東西都在。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">K8s Volume 三種層次</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">類型</th>
                <th className="pb-2 pr-4">特性</th>
                <th className="pb-2">適用場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">emptyDir</td>
                <td className="py-2 pr-4">臨時，Pod 刪就消失</td>
                <td className="py-2">Sidecar 共享暫存檔</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">hostPath</td>
                <td className="py-2 pr-4">Node 本地目錄（= Docker -v）</td>
                <td className="py-2">Pod 換 Node 就讀不到</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">遠端儲存</td>
                <td className="py-2 pr-4">EBS / PD / NFS / Ceph</td>
                <td className="py-2"><strong className="text-green-400">Pod 換 Node 照樣掛載</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">K8s Volume vs Docker Volume</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-2 rounded">
              <p className="text-red-400 font-semibold text-xs mb-1">Docker Volume</p>
              <p className="text-slate-400 text-xs">只存本機磁碟，容器換機器資料就斷了</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-2 rounded">
              <p className="text-green-400 font-semibold text-xs mb-1">K8s Volume</p>
              <p className="text-slate-400 text-xs">可掛遠端儲存（EBS/NFS），Pod 搬到別台 Node 資料還在</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">PV（房子）/ PVC（租約）管理機制 → 第六堂課詳講</p>
        </div>
      </div>
    ),
    notes: `好，設定和密碼都處理了。還有一個問題。

容器掛了，裡面的資料就沒了。這個問題 Docker 的時候我們花了不少時間講。容器是短暫的，隨時可能被銷毀重建。容器裡面的檔案系統是臨時的，容器一刪，資料跟著消失。一般的 API 容器沒關係，它本身不存資料，只是處理請求回傳結果。但資料庫呢？你的 MySQL 容器存了幾百萬筆客戶訂單，結果容器重啟一下，資料全沒了。你老闆明天就會請你離開。

Docker 裡我們用 docker volume 解決，把資料存在容器外面的磁碟上。K8s 也有 Volume，概念一樣，把資料存在 Pod 外面。Pod 被銷毀重建，資料還在。就像租房子，個人物品放儲物間，不管搬幾次家，儲物間的東西都在。

K8s 的 Volume 有好幾種。最簡單的是 emptyDir，一個臨時的空目錄，Pod 裡的多個容器可以共享。但注意，emptyDir 的資料在 Pod 刪除時會消失，不適合持久化。它適合 Sidecar 模式，比如主容器寫日誌，Sidecar 容器讀取日誌並轉發。

真正做持久化的是 hostPath 和遠端儲存。hostPath 就是把 Node 上的某個目錄掛到 Pod 裡，跟 Docker 的 -v 一樣。但 hostPath 有個問題：Pod 被調度到另一個 Node，就讀不到原來那個 Node 的檔案了。

所以生產環境更常用遠端儲存。這是 K8s 的 Volume 比 Docker 強大的地方。Docker 的 volume 基本上就存在本機磁碟。K8s 的 Volume 可以掛到各種地方：本機磁碟可以，NFS 網路儲存可以，AWS 的 EBS、GCP 的 Persistent Disk 可以，分散式儲存 Ceph 也可以。好處是 Pod 被調度到不同 Node，還是可以掛載到同一個遠端儲存，資料不會丟。比如 MySQL Pod 本來在 Node 1，資料存在 AWS EBS 上。Node 1 掛了，K8s 把 MySQL Pod 調度到 Node 2。因為資料在 EBS 上不是在 Node 1 本地，Node 2 的新 Pod 可以重新掛載同一個 EBS，資料完全沒丟。Docker 的 volume 做不到這件事。

K8s 的 Volume 還有一套更完整的管理機制叫 PV 和 PVC。PV 是 Persistent Volume，代表一塊實際的儲存空間。PVC 是 Persistent Volume Claim，代表 Pod 對儲存的申請。就像租房子，PV 是房子，PVC 是租約，Pod 拿著租約去找房子住。第六堂課會詳細講，現在知道有這個東西就好。

到這裡我們解決了三個問題：設定用 ConfigMap、密碼用 Secret、資料用 Volume。加上前一支影片的 Pod、Service、Ingress，我們已經認識了六個概念。每一個都是因為上一步沒解決的問題才出現的。

但還有兩個大問題沒解決。你的 API 只有一個 Pod，掛了就停服務。你的資料庫如果要多個副本，每個副本的資料和身份又不一樣。這些怎麼處理？下一支影片繼續。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-4：Deployment → StatefulSet — 因果鏈（3 張）
  // ============================================================

  // ── 4-4（1/3）：單點故障 → Deployment + 三層關係 ──
  {
    title: '只有一個 Pod 會掛 → Deployment',
    subtitle: '多副本 + 自動修復 + 跨 Node 分散',
    section: '4-4：Deployment → StatefulSet',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">問題：單點故障（Single Point of Failure）</p>
          <p className="text-slate-300 text-sm">API 只有一個 Pod → 不管是 bug 吃光記憶體、硬體故障還是 Node 重啟 → Service 後面沒 Pod 可轉發 → 使用者看到錯誤頁面。生產環境<strong className="text-white">絕對不允許</strong>。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Deployment = Pod 副本的控制器</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>你告訴它兩件事：跑什麼 Image + 跑<strong className="text-white">幾個副本</strong></li>
            <li>Pod 掛了 → <strong className="text-white">自動偵測、自動補</strong>，不管白天半夜</li>
            <li>副本自動分散到不同 Node → 一整台 Node 掛了其他繼續服務</li>
            <li><code className="text-green-400">kubectl scale</code> 動態調整：平常 3 個，活動 10 個，結束改回</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">三層關係（面試常問）</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">Deployment</span>
            <span className="text-slate-500">→ 建 →</span>
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">ReplicaSet</span>
            <span className="text-slate-500">→ 管 →</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">Pod x3</span>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-center">你只管 Deployment（服務生），ReplicaSet（廚師）自動建立，Pod（菜）自動上桌。你不需要直接操作 ReplicaSet。</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">對照 Docker</p>
          <p className="text-slate-300 text-sm"><code>docker compose up --scale web=3</code> → 只能一台機器、掛了不會自動補。Deployment → 跨 Node 分散、掛了自動補、動態調整副本數。</p>
        </div>
      </div>
    ),
    notes: `前三支影片我們一步步解決了怎麼跑容器、怎麼連、怎麼管設定密碼和資料。到目前為止，我們的電商系統是這樣的：一個 API 的 Pod，一個資料庫的 Pod，前面有 Service 讓它們互相找到對方，Ingress 讓使用者用域名連進來，設定放 ConfigMap，密碼放 Secret，資料庫的資料用 Volume 持久化。

聽起來很完美對吧？但有一個致命的問題。

你的 API 只有一個 Pod。不管是程式 bug 導致記憶體洩漏，還是 Node 硬體故障，還是 K8s 升級需要重啟 Node，只要這唯一的 Pod 停了，Service 後面沒有 Pod 可以轉發了，使用者就看到錯誤頁面。這叫單點故障，Single Point of Failure，在正式的生產環境裡絕對不允許。

怎麼辦？很直覺，多跑幾個。你的 API 如果有三個 Pod 在跑，分散在不同的 Node 上，掛了一個還有兩個繼續服務。Service 會自動偵測哪些 Pod 是健康的，把流量只導向還活著的。使用者完全感覺不到有一個掛了。

但你要自己手動建三個 Pod 嗎？掛了一個自己手動補嗎？半夜三點 Pod 掛了你爬起來補嗎？不用。K8s 有一個東西叫 Deployment。

Deployment 是管理 Pod 副本的控制器。你告訴它兩件事：跑什麼 Image，比如 nginx；跑幾個副本，比如 3 個。Deployment 自動建 3 個 Pod，持續監控它們。有一個掛了，自動偵測到，建新的補上，始終維持 3 個。不管白天半夜，不管你有沒有在看，它自動維護。而且這 3 個副本會被分散到不同的 Node，一整台 Node 掛了，其他 Node 上的副本繼續服務。

對照 Docker 的話，Deployment 有點像 docker compose up --scale web=3，但比 Docker 強太多。Docker 的 scale 只能在一台機器上加副本，掛了不會自動補。Deployment 可以跨 Node 分散，掛了自動補。你甚至可以用 kubectl scale 動態調整副本數：平常跑 3 個，活動期間改成 10 個，結束改回 3 個。一行指令，不用停機。

除了副本管理，Deployment 還有一個殺手級功能：滾動更新。

[▶ 下一頁]`,
  },

  // ── 4-4（2/3）：滾動更新四步驟 + 回滾 ──
  {
    title: '滾動更新 + 回滾',
    subtitle: '零停機部署：先接穩再放手，像接力賽',
    section: '4-4：Deployment → StatefulSet',
    duration: '4',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">滾動更新四步驟（v1 → v2，三個副本）</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">1.</span>
              <span className="text-slate-300">建一個 v2 Pod</span>
              <span className="text-slate-500 ml-auto">
                <span className="text-red-400">3xv1</span> + <span className="text-green-400">1xv2</span> = 4 個
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">2.</span>
              <span className="text-slate-300">v2 健康檢查通過 → 砍一個 v1</span>
              <span className="text-slate-500 ml-auto">
                <span className="text-red-400">2xv1</span> + <span className="text-green-400">1xv2</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">3.</span>
              <span className="text-slate-300">再建 v2、確認健康、砍 v1</span>
              <span className="text-slate-500 ml-auto">
                <span className="text-red-400">1xv1</span> + <span className="text-green-400">2xv2</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">4.</span>
              <span className="text-slate-300">最後一輪替換完成</span>
              <span className="text-slate-500 ml-auto">
                <span className="text-green-400">3xv2</span>
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">全程始終有 Pod 在服務，使用者無感。接力賽：<strong className="text-white">下一棒接穩了上一棒才放手</strong>，不會出現空窗期。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">回滾（Rollback）-- 萬一 v2 有問題</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl rollout undo</code> → 幾十秒退回上一版</li>
            <li><code className="text-green-400">kubectl rollout history</code> → 查看部署歷史</li>
            <li>原理：舊 ReplicaSet 還在（副本數縮到 0），回滾 = 把數字加回來，不用重 build</li>
            <li>預設保留 <strong className="text-white">10 個版本</strong>記錄</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">背後原理：新舊 ReplicaSet 交替</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>v1 → v2 時：Deployment 建<strong className="text-white">新 ReplicaSet</strong>（管 v2），保留<strong className="text-white">舊 ReplicaSet</strong>（管 v1）</p>
            <p>新 RS 慢慢擴大 → 舊 RS 慢慢縮小 = 滾動更新</p>
            <p>回滾 = 舊 RS 加回來、新 RS 縮到 0 → 所以極快</p>
          </div>
        </div>
      </div>
    ),
    notes: `還記得第一支影片說的問題四嗎？更新版本要停機。Deployment 的滾動更新是這樣做的。假設你有三個 v1 的 Pod，要更新到 v2。

第一步，Deployment 先建一個 v2 的 Pod。現在叢集裡有三個 v1 加一個 v2，共四個。

第二步，v2 跑起來了，K8s 做健康檢查確認它正常。健康了，Deployment 砍掉一個 v1。現在兩個 v1 加一個 v2。

第三步，再建一個 v2，確認健康，再砍一個 v1。一個 v1 加兩個 v2。

第四步，再建一個 v2，砍掉最後一個 v1。三個都是 v2，更新完成。

整個過程始終有 Pod 在服務，使用者的請求始終有人處理。就像接力賽，下一棒接穩了上一棒才放手，不會出現沒人跑的空窗期。

萬一 v2 有問題呢？部署到一半使用者開始回報錯誤，你正在慌的時候旁邊的資深同事淡定地說：回滾就好了。怎麼回滾？Deployment 內建回滾功能，執行一個 kubectl rollout undo 指令，Deployment 自動把所有 Pod 退回 v1。回滾非常快，因為 K8s 保留了之前版本的記錄，不用重新 build Image，直接用舊的。通常幾十秒搞定。你還可以用 kubectl rollout history 查看部署歷史，要退回更早的版本也是一個指令的事。K8s 預設保留最近十個版本。

這裡解釋一下 Deployment 背後的架構。Deployment 不是直接管 Pod 的，它管的是 ReplicaSet。ReplicaSet 才是真正管 Pod 副本數量的。所以是三層：Deployment 管 ReplicaSet，ReplicaSet 管 Pod。

為什麼多這一層？跟滾動更新有關。你從 v1 更新到 v2 的時候，Deployment 建一個新的 ReplicaSet 管 v2 的 Pod，同時保留舊的 ReplicaSet 管 v1 的 Pod。新的 ReplicaSet 慢慢擴大副本數，舊的慢慢縮小。這就是滾動更新的實現方式。

回滾的時候呢？更簡單。舊的 ReplicaSet 還在，只是副本數被縮到 0。回滾就是把舊的 ReplicaSet 加回去，新的縮到 0。因為 ReplicaSet 還在不用重新建，所以回滾速度非常快。

你平常不需要直接操作 ReplicaSet，它是 Deployment 自動建立和管理的。就像去餐廳點餐，你告訴服務生你要什麼，服務生告訴廚師，廚師去做。你不需要自己跟廚師說話。Deployment 是服務生，ReplicaSet 是廚師。

這是一個常見的面試題：Deployment、ReplicaSet、Pod 三者的關係。Deployment 定義你想要的狀態，包括 Image 版本和副本數。ReplicaSet 是 Deployment 建的，負責維持指定數量的 Pod 副本。Pod 是實際跑容器的地方。你操作 Deployment，Deployment 管 ReplicaSet，ReplicaSet 管 Pod。三層，各有職責。

好，Deployment 解決了無狀態應用的副本管理和更新。但資料庫呢？

[▶ 下一頁]`,
  },

  // ── 4-4（3/3）：StatefulSet + 八概念因果鏈總結圖 ──
  {
    title: '資料庫不能用 Deployment → StatefulSet',
    subtitle: '八個核心概念因果鏈總結',
    section: '4-4：Deployment → StatefulSet',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-1">問題：資料庫是有狀態的，Deployment 管不了</p>
          <p className="text-slate-300 text-xs">MySQL 主從架構：mysql-0 是主節點（寫入），mysql-1/2 是從節點（讀取）。<strong className="text-white">名字不能亂、順序不能錯、資料不能混</strong>。Deployment 的 Pod 名稱隨機、同時建立、共享儲存 -- 全部踩雷。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm mb-2">解法：StatefulSet（vs Deployment）</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-3">特點</th>
                <th className="pb-1 pr-3">Deployment</th>
                <th className="pb-1">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">Pod 名稱</td>
                <td className="py-1 pr-3">隨機（nginx-abc123）</td>
                <td className="py-1 text-cyan-400 font-semibold">穩定有序（mysql-0, 1, 2），重啟不變</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">部署順序</td>
                <td className="py-1 pr-3">同時建立</td>
                <td className="py-1 text-cyan-400 font-semibold">依序（先 0 再 1 再 2），像搭積木</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">儲存</td>
                <td className="py-1 pr-3">共享或無</td>
                <td className="py-1 text-cyan-400 font-semibold">每個 Pod 獨立 Volume，不混</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm mb-2">八個概念的因果鏈</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">Docker 扛不住</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">要跑容器</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Pod</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">IP 會變</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Service</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">地址太醜</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Ingress</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-400">設定寫死</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">ConfigMap</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">密碼明文</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Secret</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">資料消失</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Volume</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-400">單點故障</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Deployment</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">DB 有狀態</span>
              <span className="text-slate-500">→</span>
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StatefulSet</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-center">每一個概念都是因為<strong className="text-white">前一步沒解決的問題</strong>才出現的</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm mb-2">怎麼判斷用哪個？</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>① 需要持久化資料嗎？<span className="text-slate-500"> → </span><span className="text-green-400">不需要 → Deployment</span></p>
            <p>② 每個副本資料獨立嗎？<span className="text-slate-500"> → </span><span className="text-green-400">共享 → Deployment + 外部 DB（RDS）</span></p>
            <p>③ 需要穩定身份+順序？<span className="text-slate-500"> → </span><span className="text-cyan-400">是 → StatefulSet</span></p>
            <p className="text-slate-400 mt-1">簡單說：大部分用 Deployment，只有 DB 類才考慮 StatefulSet</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">補充：DaemonSet（第五堂詳教）</p>
          <p className="text-slate-300 text-xs">Deployment =「我要 N 個 Pod」，DaemonSet =「<strong className="text-white">每台 Node 都要一個</strong>」。適合監控 agent、日誌收集器。新 Node 加入自動建，Node 移除自動消失。</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">實務建議</p>
          <p className="text-slate-300 text-xs">很多團隊選擇<strong className="text-white">不把 DB 放 K8s</strong>，用雲端 RDS / Cloud SQL 託管。K8s 裡只跑無狀態應用 -- 特別是剛導入 K8s 的團隊。</p>
        </div>
      </div>
    ),
    notes: `資料庫不能用 Deployment。為什麼？因為資料庫是有狀態的。

三個 API 的 Pod 是一模一樣的，請求隨便導到哪個都行。但三個 MySQL 的 Pod 呢？完全不一樣。

第一，每個 Pod 的資料可能不同。MySQL 主從架構裡，mysql-0 是主節點負責寫入，mysql-1 和 mysql-2 是從節點只負責讀取。你不能把寫入請求導到從節點。

第二，身份很重要。mysql-0 就是 mysql-0，重啟之後還得是 mysql-0，因為其他節點都認「主節點是 mysql-0」。名字變了，整個複製架構就亂了。

第三，順序很重要。得先把主節點跑起來，從節點才能去連主節點同步資料。從節點比主節點先啟動，它不知道去哪裡同步。

K8s 提供了 StatefulSet 來解決這個問題。StatefulSet 跟 Deployment 很像，也能管多個副本，但有三個特別的地方。

第一，穩定的網路標識。Deployment 建的 Pod 名稱是隨機的，像 nginx-abc123，每次重啟名字都不一樣。StatefulSet 建的 Pod 名稱是有序且穩定的：mysql-0、mysql-1、mysql-2。重啟之後名稱不變。mysql-0 永遠是 mysql-0。

第二，有序的部署和刪除。按順序一個一個建。先建 mysql-0，確保完全跑起來了才建 mysql-1，mysql-1 跑起來才建 mysql-2。刪除反過來，從最後一個開始。就像搭積木，從底層開始搭，拆的時候從頂層開始拆。

第三，每個 Pod 有自己獨立的儲存。不是共享的，各自有各自的磁碟。mysql-0 有自己的 Volume，mysql-1 也有自己的。Pod 重啟了會重新掛載回自己的 Volume，資料不會搞混。

不過說實話，實務上很多團隊選擇不把資料庫放在 K8s 裡面。因為 StatefulSet 的管理比 Deployment 複雜很多，資料庫的備份、還原、主從切換，在 K8s 裡做比裸機上複雜得多。所以很多團隊的做法是：資料庫直接部署在外部機器上，或者用雲端的託管服務，像 AWS 的 RDS、GCP 的 Cloud SQL。讓專業的服務管資料庫，你只負責連線。K8s 裡只跑無狀態的應用，像 API、前端。這是一個非常常見的最佳實踐，特別是剛開始導入 K8s 的團隊。你不需要什麼都放到 K8s 裡，選最適合的方案才是對的。

那實際上怎麼判斷你的服務該用 Deployment 還是 StatefulSet？很簡單，問自己三個問題。第一，你的服務需要持久化資料嗎？如果不需要，像一般的 API 或前端，直接用 Deployment。第二，如果需要持久化，每個副本的資料是獨立的嗎？如果資料是共享的，比如所有副本都連同一個外部資料庫，那還是用 Deployment 加上外部儲存就好。第三，如果每個副本有自己獨立的資料、需要穩定的身份和啟動順序，像 MySQL 主從、Elasticsearch 叢集，那就用 StatefulSet。簡單說，大部分情況用 Deployment 就對了，只有資料庫這類有狀態的東西才需要 StatefulSet。

順帶提一個東西。除了 Deployment 和 StatefulSet，K8s 還有一個控制器叫 DaemonSet。Deployment 是「我要 N 個 Pod」，DaemonSet 是「每台 Node 都要一個 Pod」。什麼時候用？比如你要在每台機器上跑一個監控 agent 收集 CPU 和記憶體的指標，或者每台機器上跑一個日誌收集器。新 Node 加入叢集，DaemonSet 自動在上面建 Pod，Node 被移除，Pod 自動消失。這個第五堂會詳細教，現在先知道有這個東西就好。

好，到這裡我們已經認識了 K8s 的核心概念。讓我用因果鏈的方式做一個總結。

我們一開始的問題是 Docker 只能管一台機器上的容器，所以需要 K8s。進到 K8s 之後，第一步要跑容器，學了 Pod。Pod 跑起來了但 IP 會變、外面連不到，所以學了 Service。Service 可以從外面連但地址太醜使用者不能用，所以學了 Ingress。

容器能跑能連了，但設定寫死在 Image 裡換環境要重 build，所以學了 ConfigMap。密碼也在 ConfigMap 裡任何人都看得到，所以學了 Secret。容器掛了資料消失，所以學了 Volume。

最後，只有一個 Pod 掛了就停服務，所以學了 Deployment。資料庫有狀態不能用 Deployment，所以學了 StatefulSet。

八個概念，每一個都是因為前一步沒解決的問題。這條因果鏈就是 K8s 的核心。後面幾堂課我們會一個一個深入，實際寫 YAML、部署、操作。今天上午先建立全貌的理解。

接下來我們換一個角度。不再看「有什麼概念」，而是看「誰在讓這些事情發生」。Pod 掛了自動重建，是誰偵測到的？是誰建的新 Pod？新 Pod 跑在哪台機器上，是誰決定的？這些答案都在 K8s 的架構裡面。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-5：K8s 架構（上）Worker Node（2 張）
  // ============================================================

  // ── 4-5（1/2）：Master-Worker 概覽 ──
  {
    title: 'K8s 架構：Master-Worker',
    subtitle: '管理層 vs 員工，各司其職',
    section: '4-5：K8s 架構（上）Worker Node',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">公司比喻</p>
          <div className="flex items-center justify-center gap-6 my-2">
            <div className="bg-purple-900/40 border border-purple-500/40 p-3 rounded-lg text-center">
              <p className="text-purple-400 font-semibold text-sm">Master Node</p>
              <p className="text-slate-400 text-xs">管理層（做決策）</p>
              <p className="text-slate-500 text-xs">不跑你的應用</p>
            </div>
            <div className="text-slate-500 text-xl">+</div>
            <div className="bg-green-900/40 border border-green-500/40 p-3 rounded-lg text-center">
              <p className="text-green-400 font-semibold text-sm">Worker Node</p>
              <p className="text-slate-400 text-xs">員工（實際幹活）</p>
              <p className="text-slate-500 text-xs">跑你的 Pod</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4"></th>
                <th className="pb-2 pr-4">Master Node</th>
                <th className="pb-2">Worker Node</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">職責</td>
                <td className="py-2 pr-4">決策、調度、監控</td>
                <td className="py-2">跑容器、執行指令</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">生產數量</td>
                <td className="py-2 pr-4">通常 3 個（高可用）</td>
                <td className="py-2">幾十到上百個</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">組件數</td>
                <td className="py-2 pr-4">4 個核心組件</td>
                <td className="py-2">3 個核心組件</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">minikube</p>
          <p className="text-slate-300 text-sm">Master + Worker 合在一台，方便學習。第五堂課用 k3s 才會看到多節點。</p>
        </div>
      </div>
    ),
    notes: `上一支影片我們用因果鏈的方式認識了八個核心概念。從 Pod 開始，一路解決問題，最後到 Deployment 和 StatefulSet。最後我留了一個問題：Pod 掛了會自動重建，是誰偵測到的？新 Pod 是誰建的？放在哪台機器上是誰決定的？

這些問題我們在講概念的時候一直跳過，因為當時重點是「有什麼」。現在要換個角度，看「誰在做」。

K8s 是一個典型的 Master-Worker 架構。這個架構你一定不陌生，因為很多系統都是這樣設計的。我用一個比喻來幫你理解。

你把 K8s 叢集想像成一家工廠。工廠裡面有兩種人：管理層和現場員工。管理層坐在辦公室裡，負責做決策。這個訂單交給誰做、原料怎麼分配、產線出了問題怎麼處理，都是管理層在決定。現場員工在車間裡幹活，搬原料、操作機器、組裝產品、出貨。管理層不會自己去搬貨，員工也不會自己決定生產計畫，各司其職。

在 K8s 裡面，Master Node 就是管理層，Worker Node 就是現場員工。你的應用程式，也就是你的 Pod，全部跑在 Worker Node 上。Master Node 不跑你的程式，它只負責管理和調度。就像工廠的總經理不會自己去產線上擰螺絲，他只負責下指令和做決策。

一個叢集通常有一個或多個 Master Node，和多個 Worker Node。生產環境裡 Master 通常三個，做高可用，避免單點故障。Worker 可能幾十個甚至上百個，看你的業務量。我們今天用的 minikube 是特殊情況，單節點，Master 和 Worker 合在一台機器上，方便學習用的。

好，管理層和員工我們知道了。先來看員工，也就是 Worker Node。每個 Worker Node 上面有三個核心組件。

[▶ 下一頁]`,
  },

  // ── 4-5（2/2）：Worker 三組件 ──
  {
    title: 'Worker Node 三大組件',
    subtitle: 'Container Runtime + kubelet + kube-proxy',
    section: '4-5：K8s 架構（上）Worker Node',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">組件</th>
                <th className="pb-2 pr-4">比喻</th>
                <th className="pb-2">職責</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Container Runtime</td>
                <td className="py-2 pr-4">工具</td>
                <td className="py-2">拉 Image、建容器、跑容器</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kubelet</td>
                <td className="py-2 pr-4">工頭</td>
                <td className="py-2">接收 Master 指令、管 Pod、回報狀態</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kube-proxy</td>
                <td className="py-2 pr-4">交通指揮</td>
                <td className="py-2">網路規則、Service 轉發、負載均衡</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">containerd vs Docker</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Docker 分兩層：上層（CLI / Desktop）+ 下層（<strong className="text-white">containerd</strong>）</li>
            <li>K8s 1.24+ 直接用 containerd，不再需要 Docker</li>
            <li>Docker build 出來的 Image 在 containerd 上<strong className="text-green-400">照樣能跑</strong>（OCI 標準）</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">缺一不可</p>
          <p className="text-slate-300 text-sm">沒 Runtime → 容器跑不了。沒 kubelet → 指令傳不到。沒 kube-proxy → 流量到不了正確的 Pod。</p>
        </div>
      </div>
    ),
    notes: `第一個問題：Pod 裡面要跑容器，容器是誰跑起來的？總得有一個程式負責拉 Image、建立容器、啟動容器吧？這個程式就是 Container Runtime，容器執行環境。沒有它，容器根本跑不起來。就像工人手上的工具，沒有工具再厲害的工人也沒辦法幹活。

學 Docker 的時候，我們用的 Container Runtime 是 Docker Engine。但在 K8s 裡面，主流用的是 containerd。

你可能會問，containerd 是什麼？跟 Docker 是什麼關係？其實 Docker 可以分成兩層來理解。上面一層是你看得到的東西：docker 指令、Docker Desktop、docker compose，這些是使用者介面。下面一層是真正跑容器的核心引擎，就是 containerd。以前 K8s 是通過 Docker 來跑容器的，等於繞了一圈，先找 Docker，Docker 再找 containerd。後來 K8s 社群覺得，既然我真正需要的只是底層的 containerd，何必多繞一層？多一層就多了複雜度和效能開銷。所以從 K8s 1.24 版本開始，K8s 直接跟 containerd 溝通，不再需要 Docker 了。

這裡很多初學者會緊張：那我之前用 Docker 打包的 Image 還能用嗎？放心，完全可以。因為不管是 Docker 還是 containerd，它們打包出來的映像檔格式是一樣的，都遵循 OCI 標準。OCI 就是 Open Container Initiative，開放容器標準。你用 docker build 打包的 Image，推到 Docker Hub 上，K8s 的 containerd 拉下來跑，完全沒問題。所以你之前學的 Docker 技能一點都沒有浪費。

好，Container Runtime 負責跑容器。但容器跑起來了，誰來管它？誰告訴 Container Runtime「你要跑一個 nginx」？Container Runtime 就是一個工具，工具不會自己決定要做什麼。你家的電鑽不會自己決定在哪面牆上鑽洞，得有人拿著它、告訴它鑽哪裡。

這就是第二個組件，kubelet。kubelet 是每個 Worker Node 上的管理員，你可以叫它工頭。它的工作分三個部分。

第一，從 Master Node 那裡接收指令。比如 Master 說「你這台機器上要跑一個 nginx 的 Pod」，kubelet 收到之後就去叫 Container Runtime 把容器拉起來。

第二，持續監控。容器建好之後，kubelet 不會就這樣走了。它會一直盯著這台 Node 上所有 Pod 的狀態。哪個 Pod 還在跑、哪個掛了、CPU 和記憶體各用了多少，kubelet 全都知道。

第三，定期回報。kubelet 會把收集到的狀態資訊回報給 Master Node。這樣 Master 才知道每台 Worker 的情況。如果 kubelet 突然不回報了，Master 就會懷疑這台 Worker 是不是掛了。

就像工地的工頭。老闆說今天要蓋三面牆，工頭收到之後安排工人去施工。施工過程中工頭會一直巡視，看進度有沒有落後、有沒有人出狀況。如果出了問題，工頭會立刻回報給老闆。kubelet 就是做這件事的。注意一個重點：kubelet 是每個 Node 上都有一個的，每台 Worker 都有自己的工頭。不是一個工頭管所有工地，是每個工地都有一個駐場工頭。

好，容器跑起來了，也有人管了。但你想想，你的 API Pod 要呼叫資料庫 Pod，流量從 API 發出去，經過 Service，然後到達資料庫 Pod。這中間是誰在做轉發？我們前面講 Service 的時候說 Service 會把請求轉到後面健康的 Pod，但這個「轉」的動作，具體是誰在執行？

答案是第三個組件，kube-proxy。kube-proxy 在每個 Node 上維護一套網路規則。你建一個 Service，Service 有一個虛擬 IP。當有請求打到這個虛擬 IP 的時候，kube-proxy 負責把請求轉發到後面實際的 Pod。Service 的 IP 和 Port 怎麼對應到哪幾個 Pod，這些規則都是 kube-proxy 在管的。

如果一個 Service 後面有三個 Pod，kube-proxy 還負責做負載均衡，把請求平均分配到不同的 Pod，不會所有流量都打到同一個 Pod 上。

你可以把它想成工廠的物流調度。貨車來了，物流告訴它往左邊走去 A 倉庫卸貨，下一輛車往右邊走去 B 倉庫。確保每個地方都有材料送到，不會全部堆在同一個地方。

跟 kubelet 一樣，kube-proxy 也是每個 Node 上都有一個。因為網路規則要在每台機器上都生效，流量不管從哪個 Node 進來都要能正確轉發。

來整理一下。Worker Node 上三個組件：Container Runtime 是工具，沒有它容器跑不起來。kubelet 是工頭，沒有它 Master 的指令傳不到這台機器上。kube-proxy 是交通指揮，沒有它網路流量到不了正確的 Pod。三個缺一不可，它們合作讓一台機器成為叢集裡一個合格的 Worker。

但是你有沒有注意到，Worker 只是在「執行」。誰告訴 Worker 要跑什麼？誰決定把 Pod 放在哪台 Worker 上？誰在監控副本數量夠不夠？這些決策是誰做的？答案就在 Master Node 上。下一支影片我們來看管理層。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-6：K8s 架構（下）Master Node + 完整流程（3 張）
  // ============================================================

  // ── 4-6（1/3）：Master 四組件 ──
  {
    title: 'Master Node 四大組件',
    subtitle: 'API Server + etcd + Scheduler + Controller Manager',
    section: '4-6：K8s 架構（下）Master Node',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">組件</th>
                <th className="pb-2 pr-4">比喻</th>
                <th className="pb-2">職責</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">API Server</td>
                <td className="py-2 pr-4">大門警衛 + 總機</td>
                <td className="py-2">所有操作的入口，驗證身份 + 權限</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">etcd</td>
                <td className="py-2 pr-4">檔案室</td>
                <td className="py-2">分散式 KV 儲存，記錄所有叢集狀態</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Scheduler</td>
                <td className="py-2 pr-4">HR / 專案經理</td>
                <td className="py-2">根據資源決定 Pod 跑在哪個 Node</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Controller Manager</td>
                <td className="py-2 pr-4">24h 監工 / 恆溫器</td>
                <td className="py-2">比較期望狀態 vs 實際狀態，持續修正</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">組件掛了會怎樣？</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-white">API Server 掛</strong>：不能下指令，已跑的 Pod 不受影響</li>
            <li><strong className="text-white">Scheduler 掛</strong>：新 Pod 排隊等分配，現有 Pod 不影響</li>
            <li><strong className="text-white">Controller Manager 掛</strong>：Pod 掛了沒人補，副本慢慢減少</li>
            <li><strong className="text-red-400">etcd 掛</strong>：叢集失去記憶，<strong>最嚴重</strong>。一定要定期備份！</li>
          </ul>
        </div>
      </div>
    ),
    notes: `上一支影片我們看了 Worker Node 上的三個組件。Container Runtime 跑容器、kubelet 管 Pod、kube-proxy 管網路。它們是在現場幹活的。但我們留了一個問題：Worker 只是在執行，誰告訴它要執行什麼？

答案在 Master Node 上。Master Node 是管理層，不跑你的應用程式，但它指揮整個叢集的運作。Master Node 上有四個核心組件，我們用因果鏈的方式一個一個來認識。

假設你坐在電腦前面，在終端機裡敲了一行指令：kubectl create deployment nginx --replicas=3。意思是「我要三個 nginx 的 Pod」。好，你按了 Enter。這個指令發出去了，第一個問題：誰收的？

收指令的就是第一個組件，API Server。

API Server 是整個叢集的大門。不管你要對叢集做什麼操作，全部都要先經過 API Server。你用 kubectl 下指令，kubectl 是發給 API Server 的。你用 Dashboard 圖形介面看叢集狀態，Dashboard 也是問 API Server 的。叢集裡面的其他組件要互相溝通，也是通過 API Server 中轉。它就像公司的大門警衛加總機。所有人進公司先過警衛驗證身份，再通過總機轉接到正確的部門。

API Server 收到你的請求之後，第一件事不是馬上去建 Pod，而是先驗證：你是誰？你有權限建 Deployment 嗎？這是安全機制，後面第七堂課講 RBAC 的時候會詳細說。驗證通過了，API Server 說好，你要三個 nginx，我知道了。

接下來第二個問題：API Server 知道了「要三個 nginx」，但這個資訊記在哪裡？如果 API Server 只是記在自己的記憶體裡，一重啟就忘了，那不是很危險嗎？

所以需要一個地方永久保存這個資訊。這就是第二個組件，etcd。

etcd 是一個分散式的鍵值儲存系統。如果你學過 Redis，概念有點像，就是用 key 對應 value 的方式存資料。但 etcd 存的不是你的業務資料，它存的是整個叢集的狀態。哪些 Node 是健康的、有多少個 Pod、每個 Pod 跑在哪個 Node 上、Deployment 的副本數設成多少、Service 的設定是什麼，所有的管理資訊都記在 etcd 裡面。你可以把它想成公司的檔案室，公司的所有記錄都在這裡：員工名冊、專案進度、資源分配表。

所以 API Server 收到你的指令之後，就把「有一個 Deployment 叫 nginx，期望副本數 3」這筆資料寫進 etcd。現在叢集有了記憶。

這裡我要特別強調一件事：etcd 是整個叢集裡面最重要的東西。Node 掛了可以加新的，Pod 掛了會自動重建，Deployment 設定可以重新 apply。但 etcd 的資料丟了，叢集就真的失去了所有記憶。所有的 Deployment、Service、ConfigMap、Secret，全部都沒了，你得從頭來過。所以在生產環境裡，etcd 的備份是運維的第一要務。一般建議至少每天備份一次，備份檔案存到叢集外面的安全位置。這是面試也會問的重點。

好，etcd 記住了「要三個 nginx Pod」。但是現在實際上是零個 Pod 在跑。etcd 只是一個資料庫，它不會自己去建 Pod。那誰來發現「期望三個但實際零個，不對勁」？

這就是第三個組件，Controller Manager。

Controller Manager 是整個叢集的監工。它的工作方式非常有特色：持續不斷地比較兩件事。第一件事，你期望的狀態是什麼，就是你在 YAML 或指令裡說的「我要三個 nginx」。第二件事，現在叢集的實際狀態是什麼，就是現在到底有幾個 nginx Pod 在跑。如果期望和實際不一樣，Controller Manager 就會採取行動把實際狀態修正成期望狀態。

這個「比較期望和實際、然後修正」的機制，在 K8s 裡面有一個專有名詞，叫控制迴圈，Control Loop。這是 K8s 最核心的設計理念。你可以把它想像成恆溫空調。你設定溫度 25 度，空調會持續量測室溫。太熱就吹冷氣降溫，降到 25 度就停。過一陣子室溫又上去了，它又開始吹。你不需要告訴它什麼時候開、什麼時候關，你只要說「我要 25 度」。Controller Manager 就是 K8s 裡的恆溫器。

回到我們的例子。Controller Manager 看了一眼 etcd，發現有一個 Deployment 叫 nginx，期望三個 Pod，但現在是零個。零不等於三，不行。Controller Manager 就會觸發動作：建立一個 ReplicaSet，要求三個 Pod。

好，Controller Manager 說「要建三個 Pod」。但這三個 Pod 要放在哪台 Worker 上？你的叢集有五台 Worker，有的忙有的閒，不能隨便放。

這就是第四個組件，Scheduler，調度器。

Scheduler 的工作就是「選位子」。它會看每台 Worker Node 的資源使用狀況。Worker 1 的 CPU 用了百分之八十，快滿了。Worker 2 只用了百分之二十，很空。Worker 3 用了百分之五十。Scheduler 會根據這些資訊做最佳分配，盡量讓負載均勻。比如把 Pod 1 和 Pod 2 放到 Worker 2，Pod 3 放到 Worker 3。分配結果寫回 etcd。

你可以把 Scheduler 想成公司的 HR。新任務來了，HR 看看哪個部門人手比較充裕，就把任務派給那個部門。不會把所有任務都塞給一個已經加班到爆的團隊。而且 Scheduler 不只看資源，它還可以考慮你設定的規則。比如「這個 Pod 只能跑在有 SSD 的 Node 上」，或者「這兩個 Pod 不能放在同一台 Node 上避免單點故障」。Scheduler 會把這些規則全部考慮進去。

[▶ 下一頁]`,
  },

  // ── 4-6（2/3）：完整流程 ──
  {
    title: '完整流程：kubectl → Pod 跑起來',
    subtitle: 'kubectl create deployment nginx --replicas=3',
    section: '4-6：K8s 架構（下）Master Node',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">從一行指令到 Pod Running</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li><strong className="text-white">kubectl → API Server</strong>：驗證身份和權限</li>
            <li><strong className="text-white">API Server → etcd</strong>：記錄「Deployment nginx, replicas=3」</li>
            <li><strong className="text-white">Controller Manager</strong>：發現期望 3 個 Pod、實際 0 個 → 建 ReplicaSet</li>
            <li><strong className="text-white">Scheduler</strong>：看 Node 資源，分配 Pod（例 Pod1,3 → Worker1, Pod2 → Worker2）</li>
            <li><strong className="text-white">kubelet</strong>：收到通知 → 叫 containerd 拉 Image、建容器、啟動</li>
            <li><strong className="text-white">kubelet</strong>：持續回報狀態 → Controller Manager 確認 3/3 正常</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">故障自動恢復</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Worker1 硬碟壞了 → 上面 2 個 Pod 停了</li>
            <li>Controller Manager：期望 3、實際 1 → 觸發建 2 個新 Pod</li>
            <li>Scheduler：分配到 Worker2 → kubelet 建容器 → 恢復正常</li>
          </ol>
          <p className="text-slate-400 text-xs mt-2">全程你一行指令都不用下，K8s 全自動處理</p>
        </div>
      </div>
    ),
    notes: `Scheduler 分配好了，接下來就是 Worker Node 上的 kubelet 接手。Worker 2 的 kubelet 從 API Server 那裡收到通知：你要跑兩個 nginx Pod。kubelet 就去叫 containerd 拉映像檔、建容器、啟動。Worker 3 的 kubelet 也一樣，收到一個 Pod 的任務，開始執行。

Pod 跑起來之後，kubelet 持續監控狀態，定期回報給 API Server。Controller Manager 也持續在看：期望三個，實際三個，一切正常。

我們來把完整流程從頭走一遍。你在終端機輸入 kubectl create deployment nginx --replicas=3，按 Enter。

第一步，kubectl 把請求發給 API Server。API Server 驗證身份和權限，通過了。

第二步，API Server 把「nginx Deployment，期望三副本」寫進 etcd。

第三步，Controller Manager 發現 etcd 裡有新的 Deployment，期望三個 Pod 但實際零個。觸發建立 ReplicaSet，要求三個 Pod。

第四步，三個 Pod 目前是 Pending 狀態，等待分配。Scheduler 看各 Node 資源，決定 Pod 1 和 Pod 3 去 Worker 1，Pod 2 去 Worker 2。分配資訊寫回 etcd。

第五步，Worker 1 的 kubelet 收到通知，叫 containerd 跑兩個 nginx。Worker 2 的 kubelet 也收到通知，跑一個。

第六步，全部跑起來了。kubelet 回報狀態，Controller Manager 確認：期望三，實際三，正常。

然後有一天，Worker 1 的硬碟壞了，整台掛了，上面兩個 Pod 跟著停了。

第七步，kubelet 回報中斷。Controller Manager 發現只剩一個健康的 Pod，但期望是三個。一不等於三，觸發建立兩個新 Pod。

第八步，Scheduler 把兩個新 Pod 分配到還活著的 Worker 2。kubelet 建容器、啟動。幾十秒後恢復正常。

整個過程你一行指令都不需要下。凌晨三點 Worker 掛了，你繼續睡覺，K8s 自己搞定。這就是我們第一支影片說的「故障自動恢復」，現在你知道背後是哪些組件在合作了。

最後聊聊如果某個組件掛了會怎樣。

API Server 掛了：你沒辦法下指令，kubectl 打不通，Dashboard 也看不到。但已經在跑的 Pod 不受影響，繼續跑。只是你不能做任何新的操作。

etcd 掛了：叢集失去記憶，什麼狀態都查不到。這是最嚴重的，所以要備份。

Controller Manager 掛了：Pod 掛了沒人發現、沒人補。副本數可能慢慢減少。但已經在跑的 Pod 繼續跑。

Scheduler 掛了：新的 Pod 沒人分配，一直排隊。但已經跑起來的 Pod 不受影響。

kubelet 掛了：那台 Node 上的 Pod 沒人管了。Master 過一段時間偵測到失聯，會把上面的 Pod 標記為失敗，然後在其他 Node 上重建。

你有沒有發現一個規律？除了 etcd 之外，其他組件掛了，已經在跑的 Pod 都不會馬上受影響。這就是分散式系統的好處，某個零件壞了不會整台機器立刻停擺。但長期來看每個組件都很重要，所以生產環境才要做高可用。

[▶ 下一頁]`,
  },

  // ── 4-6（3/3）：架構圖 ──
  {
    title: 'K8s 架構總覽',
    subtitle: 'Master（4 組件）+ Worker（3 組件 + Pod）',
    section: '4-6：K8s 架構（下）Master Node',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-purple-900/30 border border-purple-500/40 p-4 rounded-lg">
          <p className="text-purple-400 font-semibold mb-3 text-center">Master Node</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">API Server</p>
              <p className="text-slate-400 text-xs">叢集大門</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">etcd</p>
              <p className="text-slate-400 text-xs">叢集資料庫</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Scheduler</p>
              <p className="text-slate-400 text-xs">Pod 放哪裡</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Controller Manager</p>
              <p className="text-slate-400 text-xs">持續監控修正</p>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm">kubectl → API Server ↕ 互相溝通</div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-900/30 border border-green-500/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2 text-center text-sm">Worker Node 1</p>
            <div className="space-y-1 text-xs">
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kubelet</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kube-proxy</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">containerd</div>
              <div className="bg-blue-900/40 p-1 rounded text-center text-blue-300 mt-2">Pod Pod</div>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-500/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2 text-center text-sm">Worker Node 2</p>
            <div className="space-y-1 text-xs">
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kubelet</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kube-proxy</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">containerd</div>
              <div className="bg-blue-900/40 p-1 rounded text-center text-blue-300 mt-2">Pod</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1 text-sm">K8s 用 Pod 跑自己的管理組件</p>
          <p className="text-slate-300 text-xs">等一下在 kube-system Namespace 裡會親眼看到 etcd、API Server、Scheduler、Controller Manager 都是 Pod</p>
        </div>
      </div>
    ),
    notes: `來看一下架構圖。上面是 Master Node，裡面有 API Server、etcd、Scheduler、Controller Manager。下面是多個 Worker Node，每個 Worker 上有 kubelet、kube-proxy、Container Runtime，還有你的 Pod。你通過 kubectl 跟 API Server 溝通，API Server 指揮整個叢集。所有組件之間的溝通都經過 API Server，它是整個叢集的神經中樞。

好，架構講完了。概念也講完了。講了這麼多，都是理論。是時候親眼看看了。下一支影片，我們裝環境、啟動叢集。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-7：動手做（上）環境搭建（1 張）
  // ============================================================

  {
    title: '環境方案比較 + kubectl',
    subtitle: 'minikube vs k3s vs RKE',
    section: '4-7：環境搭建',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">三種方案</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">方案</th>
                <th className="pb-2 pr-4">特色</th>
                <th className="pb-2">何時用</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">minikube</td>
                <td className="py-2 pr-4">單節點、一行安裝</td>
                <td className="py-2">今天（學 Pod + 基本操作）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">k3s</td>
                <td className="py-2 pr-4">輕量多節點、Rancher Labs</td>
                <td className="py-2">第五堂（真正多 Node 體驗）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">RKE / kubeadm</td>
                <td className="py-2 pr-4">完整企業級、安裝較複雜</td>
                <td className="py-2">生產環境</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">kubectl = 學一次到處用</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>不管 minikube / k3s / AWS EKS / GCP GKE，指令<strong className="text-white">完全一樣</strong></li>
            <li>跟 Docker CLI 角色一樣：你跟叢集溝通的唯一工具</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 驗證安裝
minikube version
minikube status

# 如果還沒啟動
minikube start

# 驗證叢集
kubectl get nodes          # 看到 minikube  Ready
kubectl cluster-info       # 看到 API Server 位址`,
    notes: `前面四支影片我們從 Docker 的五個痛點出發，一路認識了八個核心概念，又看了 Master-Worker 架構和每個組件的分工。到這裡為止，你腦中應該已經有一張比較完整的 K8s 地圖了。

但是地圖跟實際走路是兩回事。講了這麼多理論，你可能已經等不及想打開終端機了。好，我們來動手。

在開始之前，先聊一下環境方案。K8s 的環境搭建方式有好幾種，就像你要學開車，可以用模擬器練、可以在駕訓班的封閉場地練、也可以直接上路。不同的方式適合不同的階段。

我們這門課會用到三種方案。

第一種是 minikube，適合個人學習和本機開發。它在你的電腦上模擬一個 K8s 叢集，把 Master 和 Worker 合在一台機器上。安裝只要一行指令，非常簡單。但它是單節點的，看不到 Pod 分散到不同 Node 的效果，不適合模擬生產環境。我們今天用它。

第二種是 k3s，Rancher Labs 開發的輕量級 K8s 發行版。它把 K8s 精簡了很多，安裝也很簡單，但它是真正的多節點叢集。第五堂課我們會用它，在 VMware 裡面開兩台 Ubuntu 虛擬機，一台當 Master 一台當 Worker，體驗真正的多節點環境。到時候你就能看到 Pod 被 Scheduler 分配到不同 Node 上了。

第三種是 RKE 或者 kubeadm，適合企業生產叢集。安裝比較複雜，但功能最完整、最接近真實的生產環境配置。這個我們課程裡不會實際操作，但會介紹概念，讓你知道有這個東西。

為什麼今天用 minikube？因為今天我們只需要學 Pod 和基本操作，單節點完全夠用。而且 minikube 裝起來最簡單，不需要額外的虛擬機，你筆電上就能跑。等第五堂課我們學 Deployment 和 Service 的時候，需要看到跨節點的效果，那時候再換 k3s。

這裡先講一下 kubectl，因為很多初學者會搞混 minikube 和 kubectl 的關係。

kubectl 是 K8s 的命令列工具，就像你學 Docker 時用的 docker 指令。docker ps 看容器，docker logs 看日誌，docker exec 進容器。kubectl 邏輯一樣，只是換了一套指令名稱。

kubectl 跟 minikube 是兩個不同的東西。minikube 是幫你建叢集的工具，建好之後它的任務基本上就完成了。kubectl 是你跟叢集溝通的工具，建好叢集之後你日常操作全靠它。打個比方，minikube 像是蓋房子的建築工人，kubectl 像是住在裡面的管家。房子蓋好之後，你跟管家打交道，不用再找建築工人。

而且 kubectl 有一個很大的好處：不管你的叢集是 minikube、k3s、還是 AWS 上的 EKS、GCP 上的 GKE，kubectl 的指令完全一樣。學一次，到處用。你在本機的 minikube 上練的指令，到了公司的生產叢集上一模一樣地敲就對了。底層的叢集換了，kubectl 的用法不變。這是 K8s 生態系統的一個巨大優勢，也是為什麼我們要花時間把 kubectl 學好。

好，來動手。如果你在第一支影片的時候有照著螢幕上的指示先跑安裝指令，現在應該已經裝好了。讓我們來驗證。

首先執行 minikube version。如果你看到類似「minikube version: v1.32.0」這樣的輸出，就代表安裝成功了。如果顯示指令找不到，那代表安裝沒成功或者路徑沒設對，回去看一下安裝步驟。

接下來看叢集是不是已經在跑。執行 minikube status。如果顯示 host: Running、kubelet: Running、apiserver: Running，那就代表叢集正在運行。你看到沒有？host 在跑、kubelet 在跑、apiserver 在跑。kubelet 和 apiserver 就是我們前兩支影片講的那兩個組件。minikube 的狀態輸出直接對應到架構概念，你現在看到的不再是抽象的名詞了。

如果叢集還沒啟動，執行 minikube start。這個指令會下載 K8s 的映像檔，建立一個虛擬機或容器，取決於你的 driver 設定，然後在裡面啟動 K8s 叢集。第一次跑會比較久，大概三到五分鐘，因為要下載東西。之後再啟動就快了，映像檔已經在本地了。

minikube start 跑完之後，它會自動幫你設定好 kubectl，讓 kubectl 指向你的 minikube 叢集。這個設定其實是寫在一個叫 kubeconfig 的檔案裡，通常在你的 home 目錄下的 .kube/config。kubectl 每次執行指令的時候都會去讀這個檔案，知道要連哪個叢集、用什麼身份。你現在不需要手動去改這個檔案，minikube 都幫你設好了。但後面如果你同時有多個叢集，就需要了解 kubeconfig 的切換，到時候再說。

好，來用 kubectl 探索。

第一個指令，kubectl get nodes。你應該會看到一行輸出，一個 Node，名字叫 minikube，狀態 Ready，角色 control-plane。Ready 代表這個 Node 是健康的。control-plane 就是 Master 的意思。因為 minikube 是單節點，Master 和 Worker 合在一起，所以只有一個 Node 同時扮演兩個角色。等第五堂課用 k3s，你就會看到兩個 Node 了，一個 control-plane、一個 worker。

第二個指令，kubectl cluster-info。這會顯示 API Server 的位址和 CoreDNS 的位址。API Server 就是上一支影片講的叢集大門，你看到它跑在一個 https 的位址上，通常是 https 加上一個 IP 和 Port。CoreDNS 就是叢集內部的 DNS 服務，讓 Pod 可以用 Service 名字找到對方。

你可能會問，為什麼 API Server 用 https 不是 http？因為安全。所有跟叢集的溝通都要加密，這是 K8s 的安全設計。kubectl 發出的每一個請求都帶著你的身份憑證，經過 TLS 加密傳輸給 API Server。API Server 驗證你的身份之後才會處理。這些細節你現在不用深究，知道有這層安全機制就好。

好，到這裡叢集跑起來了，kubectl 也能用了。我們驗證了三件事：minikube 安裝成功、叢集正常運行、kubectl 可以跟叢集溝通。接下來我們要去叢集裡面看看，前面講的那些架構組件，是不是真的都在裡面跑。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-8：動手做（下）探索叢集（2 張）
  // ============================================================

  // ── 4-8（1/2）：kube-system 組件 ──
  {
    title: '親眼看到架構組件',
    subtitle: 'kubectl get pods -n kube-system',
    section: '4-8：探索叢集',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">kube-system 裡的管理組件</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Pod 名稱</th>
                <th className="pb-2">對應組件</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>etcd-minikube</code></td>
                <td className="py-2">etcd（叢集資料庫）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-apiserver-minikube</code></td>
                <td className="py-2">API Server（叢集大門）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-scheduler-minikube</code></td>
                <td className="py-2">Scheduler（調度器）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-controller-manager-minikube</code></td>
                <td className="py-2">Controller Manager（監工）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-proxy-xxxxx</code></td>
                <td className="py-2">kube-proxy（網路代理）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>coredns-xxxxx</code></td>
                <td className="py-2">CoreDNS（叢集 DNS）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">K8s 用 Pod 管理自己的組件</p>
          <p className="text-slate-300 text-sm">非常優雅的設計 -- 自己就是自己的使用者。</p>
        </div>
      </div>
    ),
    code: `# 看 kube-system 裡的管理組件
kubectl get pods -n kube-system

# 看 Node 詳細資訊
kubectl describe node minikube
# 重點看：Container Runtime（containerd）、Capacity、Allocatable`,
    notes: `上一支影片我們裝好了 minikube，用 kubectl get nodes 確認叢集在跑，用 kubectl cluster-info 看到了 API Server 的位址。環境就緒了，現在來做最有意思的部分：親眼看到前面講的架構組件。

執行 kubectl get pods -n kube-system。

這裡有一個新東西，-n kube-system。-n 是指定 Namespace。什麼是 Namespace？你就把它想成叢集裡面的資料夾。你電腦上用資料夾分類檔案，K8s 用 Namespace 分類資源。kube-system 這個 Namespace 是 K8s 自動建立的，專門用來放它自己的管理組件。你自己建的 Pod 預設會放在另一個叫 default 的 Namespace 裡面。用資料夾分開，管理組件跟你的應用不會混在一起。

好，你按下 Enter 之後，應該會看到一堆 Pod，狀態都是 Running。讓我們一個一個來對照。

第一個，etcd-minikube。眼熟吧？這就是 etcd，叢集的資料庫。前一支影片我們說所有叢集狀態都記在 etcd 裡面，它就在這裡跑著。

第二個，kube-apiserver-minikube。這就是 API Server，叢集的大門。你剛才敲的每一行 kubectl 指令，全部都是通過它處理的。你現在看到它是一個 Pod，它是以 Pod 的身份在這個叢集裡面跑的。

第三個，kube-scheduler-minikube。Scheduler，調度器。決定新 Pod 放在哪個 Node。不過我們現在只有一個 Node，所以它現在的工作很輕鬆，所有 Pod 都只能放同一個地方。等第五堂課有多個 Node 的時候，它就忙起來了。

第四個，kube-controller-manager-minikube。Controller Manager，那個二十四小時不睡覺的監工。持續比較期望狀態和實際狀態。

第五個，kube-proxy 加上一串隨機字元。kube-proxy，負責網路轉發。每個 Node 上都有一個。

第六個，coredns 加上一串隨機字元。CoreDNS 不是我們前面講的七個架構組件之一，但它非常重要。它是叢集內部的 DNS 服務。還記得我們講 Service 的時候說 Pod 可以用 Service 名字互相找到對方嗎？就是 CoreDNS 在背後做解析。

你注意到一件很有意思的事了嗎？K8s 的管理組件本身就是用 Pod 跑的。K8s 用 Pod 管理自己的組件，自己管自己。API Server 是一個 Pod，etcd 是一個 Pod，Scheduler 也是一個 Pod。這是一個非常優雅的設計。就像一個工廠的管理軟體本身也跑在這個工廠的電腦上一樣。

好，組件都看到了。接下來看看 Node 的詳細資訊。執行 kubectl describe node minikube。

這個指令的輸出比較長，不要被嚇到。我帶你看幾個重要的部分。

最上面是基本資訊。Name 是 minikube，Roles 是 control-plane。Labels 區塊有一些標籤，這些標籤後面可以用來做調度規則，比如 Scheduler 可以根據標籤來決定 Pod 放哪裡。

往下滑，找到 System Info 區塊。這裡有幾個重點。Container Runtime 會顯示 containerd 加上版本號。看到了嗎？驗證了我們前面說的：K8s 用的是 containerd，不是 Docker。Kubelet Version 會顯示 kubelet 的版本，通常跟你的 K8s 版本一致。Operating System 是 linux，Architecture 是 amd64。

再往下，Capacity 和 Allocatable 區塊。Capacity 是這台 Node 的總資源，CPU 幾核、記憶體多大。Allocatable 是可以分配給 Pod 使用的量，會比 Capacity 少一點，因為 K8s 會保留一些資源給系統自己用。還記得 Scheduler 怎麼決定 Pod 放哪裡嗎？它看的就是這些數字。哪台 Node 的 Allocatable 資源還有餘量，就把 Pod 往那邊送。

最下面有一個 Non-terminated Pods 區塊，列出這個 Node 上所有正在跑的 Pod。你會看到剛才在 kube-system 裡看到的那些管理組件全部列在這裡。一台 Node、上面跑著哪些 Pod、各用了多少資源，一目了然。

[▶ 下一頁]`,
  },

  // ── 4-8（2/2）：Namespace + Dashboard + Docker 對照 ──
  {
    title: 'Namespace + Dashboard + 指令對照',
    subtitle: '叢集裡的「資料夾」',
    section: '4-8：探索叢集',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Namespace = 叢集裡的資料夾</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Namespace</th>
                <th className="pb-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">default</td>
                <td className="py-2">你的 Pod 預設放這裡</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kube-system</td>
                <td className="py-2">K8s 管理組件</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">kube-public</td>
                <td className="py-2">公開可讀資訊</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">kube-node-lease</td>
                <td className="py-2">Node 心跳記錄</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker vs kubectl 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Docker</th>
                <th className="pb-2">kubectl</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker run nginx</code></td>
                <td className="py-2"><code className="text-green-400">kubectl run nginx --image=nginx</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker ps</code></td>
                <td className="py-2"><code className="text-green-400">kubectl get pods</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker logs</code></td>
                <td className="py-2"><code className="text-green-400">kubectl logs &lt;pod&gt;</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker exec -it</code></td>
                <td className="py-2"><code className="text-green-400">kubectl exec -it &lt;pod&gt; -- bash</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker stop / rm</code></td>
                <td className="py-2"><code className="text-green-400">kubectl delete pod &lt;pod&gt;</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker inspect</code></td>
                <td className="py-2"><code className="text-green-400">kubectl describe pod &lt;pod&gt;</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Namespace
kubectl get ns

# Dashboard（瀏覽器打開）
minikube dashboard`,
    notes: `接下來看看叢集裡面有哪些 Namespace。執行 kubectl get ns。ns 是 namespace 的簡寫，kubectl 很多資源都有簡寫，以後用熟了打簡寫會快很多。

你會看到四個 Namespace。default 是預設的，你之後建的 Pod 如果不指定 Namespace 就會放在這裡。kube-system 就是剛才看的，放管理組件。kube-public 放一些公開可讀的資訊。kube-node-lease 記錄 Node 的心跳，K8s 用它來判斷 Node 還活不活著。最常用的就是 default 和 kube-system，其他兩個知道有就好。

好，來看一個好玩的東西。執行 minikube dashboard。

這會在你的瀏覽器裡打開 K8s 的 Dashboard，一個圖形化的管理介面。左邊是導覽列，你可以看到 Namespaces、Nodes、Pods、Services、Deployments 各種資源。你點 Workloads 裡面的 Pods，選 kube-system 這個 Namespace，就會看到剛才用 kubectl 看到的那些 Pod，用圖形化的方式呈現。每個 Pod 的狀態、IP、啟動時間都列得清清楚楚。

你也可以點 Cluster 裡面的 Nodes，看到 minikube 這個 Node 的 CPU 和記憶體使用率。跟剛才 kubectl describe node 看到的資訊是一樣的，只是換了圖表的方式呈現。

Dashboard 對初學者很有幫助，直觀地理解叢集狀態。但日常工作中，大部分工程師還是用 kubectl，打指令比點滑鼠快得多，而且可以寫成腳本自動化。兩種方式各有優點，看場景選擇。

好，最後我們來做一個 Docker 和 kubectl 的指令對照，幫你建立直覺。

docker ps 看容器，對應 kubectl get pods 看 Pod。docker logs 看日誌，對應 kubectl logs。docker exec -it 進容器，對應 kubectl exec -it，注意 kubectl 的版本要在 Pod 名稱後面加兩個破折號再接命令。docker stop 和 rm 停止刪除容器，對應 kubectl delete pod。docker compose up -f 用檔案部署，對應 kubectl apply -f 用 YAML 部署。

邏輯完全一樣，只是換了指令名稱。如果你 Docker 用得熟，kubectl 上手會非常快。

還有一個很實用的指令：kubectl api-resources。它會列出 K8s 支援的所有資源類型。Pod、Service、Deployment、ConfigMap 全部都在裡面。你會發現 K8s 的資源類型非常多，好幾十種。不用慌，常用的就是我們上午講的那八個。其他的用到再學。

這個指令還會顯示每種資源的簡寫。pods 簡寫 po，services 簡寫 svc，deployments 簡寫 deploy，namespaces 簡寫 ns。以後用熟了就直接打簡寫，kubectl get po、kubectl get svc，又快又省事。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-9：YAML 格式 + Pod 概念（2 張）
  // ============================================================

  // ── 4-9（1/2）：YAML 三規則 + 四大欄位 ──
  {
    title: 'YAML 格式：三規則 + 四大欄位',
    subtitle: '告訴 K8s「我要什麼」的語言',
    section: '4-9：YAML 格式 + Pod 概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">YAML 三大規則（踩坑率最高）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>縮排用<strong className="text-white">空格</strong>，<strong className="text-red-400">絕對不能用 Tab</strong>（VS Code 右下角設 Spaces: 2）</li>
            <li>冒號後面<strong className="text-white">一定要空格</strong>：<code>name: my-pod</code> 不是 <code>name:my-pod</code></li>
            <li>列表用<strong className="text-white">減號 + 空格</strong>：<code>- name: nginx</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">K8s YAML 四大必備欄位</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">欄位</th>
                <th className="pb-2 pr-4">意義</th>
                <th className="pb-2">記法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">apiVersion</td>
                <td className="py-2 pr-4">用哪個 API 版本</td>
                <td className="py-2">用什麼語言溝通</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kind</td>
                <td className="py-2 pr-4">建什麼類型資源</td>
                <td className="py-2">建什麼東西</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">metadata</td>
                <td className="py-2 pr-4">名稱 + 標籤</td>
                <td className="py-2">叫什麼名字</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">spec</td>
                <td className="py-2 pr-4">規格（Image、Port、Volume...）</td>
                <td className="py-2">長什麼樣子</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Pod YAML 基本結構
apiVersion: v1            # API 版本
kind: Pod                 # 資源類型
metadata:                 # 中繼資料
  name: my-nginx          #   Pod 名稱
  labels:                 #   標籤（Service 靠它找 Pod）
    app: nginx
spec:                     # 規格
  containers:             #   容器列表
    - name: nginx         #     容器名稱
      image: nginx:1.27   #     Docker Image
      ports:
        - containerPort: 80`,
    notes: `好，歡迎回來。上午休息之前，我們在 kube-system 這個 Namespace 裡面看到了一堆 Pod。etcd、API Server、Scheduler、Controller Manager，K8s 自己的管理組件全都以 Pod 的身份在跑。我們用 describe node 看了 CPU、記憶體、Container Runtime，還打開了 Dashboard 的圖形介面。到這裡為止，我們已經驗證了一件事：K8s 的叢集是活的，而且裡面已經有東西在跑了。

但是那些都是 K8s 自己的東西。我的 nginx 呢？我的應用程式呢？我怎麼把我自己的容器放進去？

你回想一下 Docker。在 Docker 的世界裡，你要跑一個 nginx，就打 docker run nginx，一行指令搞定。要開 Port 加 -p，要掛 Volume 加 -v，要設環境變數加 -e，所有東西都塞在一行指令後面的參數裡。這是「命令式」的做法，你一步一步告訴 Docker 怎麼做。

但我們在第一支影片就講過，K8s 的設計理念是「宣告式管理」。你不是告訴它「先拉 Image、再建容器、再開 Port」，你是寫一份文件，告訴它「我想要的最終狀態是什麼」。然後 K8s 自己想辦法把現實調整到你描述的狀態。還記得那個恆溫空調的比喻嗎？你只要設定 25 度，空調自己處理。

那這份描述「最終狀態」的文件，用什麼格式寫？答案是 YAML。

YAML 全名是 YAML Ain't Markup Language，一個遞迴縮寫，表示它不是標記語言。其實你已經用過 YAML 了。第三堂課寫 Docker Compose 的時候，docker-compose.yaml 就是一個 YAML 檔案。所以 YAML 的基本感覺你不陌生，你只是可能沒有仔細看它的規則。

今天我們要從「感覺認識」升級到「規則清楚」。因為在 K8s 裡面，所有的資源，Pod、Service、Deployment、ConfigMap，全部都是用 YAML 定義的。YAML 寫錯一個字元，K8s 就會報錯。所以我們要把規則搞清楚。

YAML 的語法有三個重點。

第一個，縮排用空格，絕對不能用 Tab。這是初學者最常踩的坑，待會實作的時候你就會知道有多痛。你在編輯器裡面按 Tab 鍵，看起來好像是空格，但其實它是一個 Tab 字元，YAML 解析器會直接報錯。我強烈建議大家現在就打開你的編輯器，把 Tab 設定成自動轉換為兩個空格。VS Code 的話在右下角可以直接改。vim 的話在設定檔裡加上 set expandtab、set tabstop=2、set shiftwidth=2。這個設定做一次，後面就不會再踩到了。

第二個，冒號後面要有空格。寫 name 冒號空格 my-pod，冒號跟值之間一定要有一個空格。如果你寫 name 冒號 my-pod，中間沒有空格，YAML 會把整段當成一個 key，解析就錯了。

第三個，列表用減號加空格開頭。比如你有一個容器列表，每個容器前面加一個「減號空格」，像「減號空格 name 冒號空格 nginx」這樣。減號後面也要有空格，不能省略。

三個規則，記住了就不會出錯：空格縮排、冒號後空格、列表用減號。

好，語法知道了。那 K8s 的 YAML 到底長什麼樣子？不管你要建什麼資源，每一個 K8s 的 YAML 檔案都有四個必備欄位。

第一個是 apiVersion。你可以把它理解成「你要用哪一版的語言跟 K8s 說話」。不同的資源類型有不同的 apiVersion。Pod 用 v1，Deployment 用 apps/v1，Ingress 用 networking.k8s.io/v1。你不需要背這些，寫的時候查一下就好。螢幕上有一個對照表，大家可以截圖存起來。

第二個是 kind，就是你要建什麼東西。Pod、Service、Deployment、ConfigMap，你要建什麼就寫什麼。

第三個是 metadata，中繼資料，描述這個資源的基本資訊。最重要的是 name，給你的資源取個名字，之後所有指令都靠這個名字操作。還有一個很常用的是 labels，標籤，一組 key-value 配對，比如 app 冒號 nginx。標籤現在先知道就好，等第五堂課學 Service 的時候你就會發現標籤有多重要，Service 就是靠標籤來找到它要轉發的 Pod。

第四個是 spec，specification 的縮寫，規格的意思。你想要什麼容器、用什麼 Image、開什麼 Port、掛什麼 Volume，全部寫在 spec 裡面。spec 是整個 YAML 裡面最重要、也是變化最多的部分。不同資源的 spec 內容完全不一樣。

四個欄位，你可以用四個問題來記。apiVersion 是「你要說哪種語言」，kind 是「你要建什麼」，metadata 是「它叫什麼名字」，spec 是「它長什麼樣子」。

[▶ 下一頁]`,
  },

  // ── 4-9（2/2）：apiVersion 速查 + Pod 概念 + Docker 對照 ──
  {
    title: 'apiVersion 速查 + Pod 概念',
    subtitle: '不用背，查一下就好',
    section: '4-9：YAML 格式 + Pod 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">apiVersion 常見值</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">資源類型</th>
                <th className="pb-2">apiVersion</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Pod / Service / ConfigMap / Secret</td>
                <td className="py-2 text-green-400 font-semibold">v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Deployment / ReplicaSet / DaemonSet</td>
                <td className="py-2 text-green-400 font-semibold">apps/v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">CronJob</td>
                <td className="py-2 text-green-400 font-semibold">batch/v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Ingress</td>
                <td className="py-2 text-green-400 font-semibold">networking.k8s.io/v1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Pod 重點複習</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>K8s <strong className="text-white">最小部署單位</strong>（不是 Container）</li>
            <li>同 Pod 容器共享網路（localhost）+ 儲存（Volume）</li>
            <li>Sidecar 模式：主容器 + 輔助容器（日誌收集 / Proxy）</li>
            <li>最佳實踐：<strong className="text-white">一個 Pod 一個容器</strong></li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">Docker Compose vs K8s YAML</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Compose 的 <code>version: "3"</code> → K8s 的 <code>apiVersion</code></li>
            <li>Compose 一個檔案描述整套系統 → K8s <strong className="text-white">一個檔案一個資源</strong></li>
          </ul>
        </div>
      </div>
    ),
    notes: `現在來跟你已經會的 Docker Compose 做個對照。Docker Compose 裡面寫 version 冒號 3，K8s 對應的是 apiVersion。Docker Compose 的 services 區塊定義你要跑哪些服務，K8s 這邊拆成了 kind 加 spec。Docker Compose 的 image 冒號 nginx，K8s 寫在 spec 底下的 containers 列表裡面。最大的差別是什麼？Docker Compose 一個檔案可以描述一整套系統，前端、後端、資料庫都塞在裡面。K8s 的 YAML 通常一個檔案描述一個資源。你要一個 Pod 寫一個檔案，要一個 Service 再寫一個檔案。雖然可以用三個減號的分隔線把多個資源塞在同一個檔案裡，但我們先養成好習慣，一個檔案一個資源。

好，YAML 搞定了。現在來認識今天的主角，Pod。

Pod 的概念我們在第四支影片已經講過一次了。當時是從「Docker 只管單一容器」這個問題出發，引出「K8s 用 Pod 包一層」。那時候是概念的角度。現在我們已經要動手寫 YAML 了，所以從實作的角度再看一次 Pod。

Pod 是 K8s 最小的部署單位。注意，不是容器，是 Pod。在 Docker 裡面你 docker run 直接跑容器。在 K8s 裡面，K8s 不直接管容器，它管的是 Pod。你可以把 Pod 想成容器的膠囊，外面多包了一層。

一個 Pod 裡面可以放一個或多個容器。同一個 Pod 裡的容器共享兩樣東西。第一，共享網路。同一個 Pod 裡的兩個容器用同一個 IP 位址，彼此之間用 localhost 就能互相通訊。第二，共享儲存。它們可以掛載同一個 Volume，讀寫同一批檔案。

為什麼要多包一層？因為有些場景你需要把兩個緊密耦合的容器放在一起。經典的例子是 Sidecar 模式。你有一個 API 容器把日誌寫到檔案裡，旁邊放一個日誌收集容器負責把日誌傳送到集中式系統。這兩個容器需要共享目錄，放在同一個 Pod 裡最合適。Sidecar 就是「邊車」的意思，主容器是摩托車，輔助容器是掛在旁邊的邊車。

不過絕大多數情況下，最佳實踐是一個 Pod 只放一個容器。你現在就把 Pod 等於一個容器來理解就好。下午我們會實際做一個多容器 Pod，到時候你就更有感覺了。

最後看一下 Docker 和 kubectl 的指令對照。docker run nginx 對應 kubectl run nginx --image=nginx。docker ps 對應 kubectl get pods。docker logs 對應 kubectl logs。docker exec -it 對應 kubectl exec -it，但注意 kubectl 的版本要在 Pod 名字後面加兩個減號再接指令。docker stop 加 docker rm 對應 kubectl delete pod。docker inspect 對應 kubectl describe pod。

幾乎是一對一的對應，邏輯完全一樣，只是換了一套指令。如果你 Docker 用得熟，kubectl 上手會非常快。

好，概念都到位了。YAML 怎麼寫知道了，Pod 是什麼也知道了，指令對照也看過了。接下來就是今天最關鍵的一步：動手寫你的第一個 Pod YAML，把它跑起來。

[▶ 下一頁]`,
  },

  // ============================================================
  // 4-10：第一個 Pod 完整 CRUD（2 張 + 1 張學員實作）
  // ============================================================

  // ── 4-10（1/2）：pod.yaml 完整範例 ──
  {
    title: '第一個 Pod：pod.yaml',
    subtitle: '逐行解釋每一行',
    section: '4-10：第一個 Pod CRUD',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">逐行說明</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">行</th>
                <th className="pb-2 pr-4">內容</th>
                <th className="pb-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">1</td>
                <td className="py-1 pr-4"><code>apiVersion: v1</code></td>
                <td className="py-1">Pod 固定用 v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">2</td>
                <td className="py-1 pr-4"><code>kind: Pod</code></td>
                <td className="py-1">建 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">4</td>
                <td className="py-1 pr-4"><code>name: my-nginx</code></td>
                <td className="py-1">只能小寫 + 數字 + 減號</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">6</td>
                <td className="py-1 pr-4"><code>app: nginx</code></td>
                <td className="py-1">標籤，Service 靠它找 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">10</td>
                <td className="py-1 pr-4"><code>image: nginx:1.27</code></td>
                <td className="py-1">永遠寫明確版本號</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">12</td>
                <td className="py-1 pr-4"><code>containerPort: 80</code></td>
                <td className="py-1">文件記錄（不寫也能跑）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">apply vs create</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl create</code>：只能建立，已存在會報錯</li>
            <li><code className="text-green-400">kubectl apply</code>：不存在就建、存在就更新。<strong className="text-white">統一用 apply</strong></li>
          </ul>
        </div>
      </div>
    ),
    code: `# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80`,
    notes: `好，這是今天上午最重要的一個實作。前面所有影片都在「看」和「理解」，這支影片我們開始「做」。你學了 YAML 的格式，學了 Pod 的概念，現在把這兩樣東西合起來，寫出你人生中第一個 K8s YAML 檔案，然後讓它跑起來。

請大家把終端機打開，編輯器準備好，跟著我一步一步來。

第一步，把練習用的檔案拉下來。我已經把所有的 Lab 檔案放在 GitHub 上了，大家在終端機輸入 git clone https://github.com/yanchen184/k8s-course-labs.git，然後 cd k8s-course-labs/lesson4。裡面有今天所有會用到的 YAML 檔案，包括 pod.yaml、pod-broken.yaml、pod-sidecar.yaml 這些。你不用自己從零開始寫，先用我準備好的檔案跟著做，等熟了之後再自己寫。

在開始之前，先確認一下 minikube 還在跑。輸入 minikube status，看一下狀態。host、kubelet、apiserver 都是 Running 就沒問題。如果不是，輸入 minikube start 重新啟動。

好，環境確認了。打開你的編輯器，建一個新檔案叫 pod.yaml。VS Code、vim、nano 都可以。我一行一行帶你寫。

第一行，apiVersion 冒號空格 v1。Pod 的 API 版本就是 v1，固定的，不用想。

第二行，kind 冒號空格 Pod。我們要建的資源類型就是 Pod。

第三行，metadata 冒號，後面不用寫值，因為底下還有子欄位。

第四行，空兩格，name 冒號空格 my-nginx。這是 Pod 的名字，之後 kubectl 的所有操作都用這個名字。命名規則是只能用小寫英文、數字跟減號，不能有底線、不能有大寫。

第五行，空兩格，labels 冒號，後面也不寫值。

第六行，空四格，app 冒號空格 nginx。這是一個標籤。標籤現在不會用到，但第五堂課學 Service 的時候，Service 就是靠這個標籤找到這個 Pod 的。先寫上，養成好習慣。

第七行，spec 冒號。

第八行，空兩格，containers 冒號。

第九行，空四格，減號空格 name 冒號空格 nginx。這是容器的名字。一個 Pod 裡面可能有多個容器，每個容器要有自己的名字。

第十行，空六格，image 冒號空格 nginx:1.27。這就是我們要跑的 Docker Image。nginx 冒號 1.27 是指定 1.27 版。你也可以寫 nginx:latest 或者只寫 nginx，但在正式環境裡我們永遠建議寫明確的版本號。因為 latest 這個 tag 會隨著 Image 作者的更新而變，今天是 1.27，明天可能就 1.28 了。寫死版本號才能確保每次部署都是同一個東西。

第十一行，空六格，ports 冒號。

第十二行，空八格，減號空格 containerPort 冒號空格 80。這是宣告容器監聽 80 port。我要特別說一下，containerPort 這個欄位其實更像是一個文件記錄。即使不寫它，nginx 一樣會聽 80，因為 nginx Image 本身就設計成監聽 80 的。但寫上去是好習慣，讓看你 YAML 的人一眼就知道這個容器用了什麼 port。

大家注意縮排的層級。apiVersion、kind、metadata、spec 是最外層，不縮排。name、labels、containers 在 metadata 或 spec 底下，縮兩格。app 在 labels 底下，縮四格。image、ports 在容器底下，縮六格。containerPort 在 ports 底下，縮八格。每往下一層多兩格。YAML 的縮排就是結構，縮排錯了整個意思就變了。

寫完存檔。再提醒一次，確認你用的是空格不是 Tab。VS Code 右下角看一下，應該顯示 Spaces: 2。

[▶ 下一頁]`,
  },

  // ── 4-10（2/2）：CRUD 流程 ──
  {
    title: 'Pod 完整 CRUD + Docker 對照',
    subtitle: 'apply → get → describe → logs → exec → delete',
    section: '4-10：第一個 Pod CRUD',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">CRUD 流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f pod.yaml</code> -- 建立（C）</li>
            <li><code className="text-green-400">kubectl get pods</code> -- 看狀態（R）</li>
            <li><code className="text-green-400">kubectl get pods -o wide</code> -- 看 IP + Node</li>
            <li><code className="text-green-400">kubectl describe pod my-nginx</code> -- <strong className="text-white">重點看 Events</strong></li>
            <li><code className="text-green-400">kubectl logs my-nginx</code> -- 看日誌</li>
            <li><code className="text-green-400">kubectl exec -it my-nginx -- /bin/sh</code> -- 進容器</li>
            <li>改 YAML → <code className="text-green-400">kubectl apply -f pod.yaml</code> -- 更新（U）</li>
            <li><code className="text-green-400">kubectl delete pod my-nginx</code> -- 刪除（D）</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">注意：exec 的雙減號 --</p>
          <p className="text-slate-300 text-sm">kubectl exec -it my-nginx <strong className="text-white">--</strong> /bin/sh</p>
          <p className="text-slate-400 text-xs mt-1">雙減號告訴 kubectl：後面是容器指令，不是 kubectl 的參數。Docker 不用加這個。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">describe Events = 排錯最好朋友</p>
          <p className="text-slate-300 text-sm">Scheduled → Pulling → Pulled → Created → Started。卡在 Pulling = 網路或 Image 名錯。</p>
        </div>
      </div>
    ),
    code: `# 建工作目錄
git clone https://github.com/yanchen184/k8s-course-labs.git
cd k8s-course-labs/lesson4

# 部署
kubectl apply -f pod.yaml       # pod/my-nginx created
kubectl get pods                # STATUS: Running, READY: 1/1
kubectl get pods -o wide        # 看 IP + NODE

# 查看 + 進容器
kubectl describe pod my-nginx   # 重點看最下面 Events
kubectl logs my-nginx
kubectl exec -it my-nginx -- /bin/sh
  # 進去後：curl localhost 或 cat /usr/share/nginx/html/index.html
  # exit 離開

# 清理
kubectl delete pod my-nginx`,
    notes: `好，來部署。確認你在 k8s-course-labs/lesson4 目錄下，輸入 kubectl apply -f pod.yaml。

這裡解釋一下 apply。你在網路上可能會看到另一個寫法 kubectl create -f pod.yaml。兩個都能用，但有一個重要差別。create 是「建立」，如果資源已經存在就報錯。apply 是「應用」，資源不存在就建立，已經存在就更新。所以 apply 可以重複執行，改了 YAML 之後再 apply 一次就能更新。我們統一用 apply，因為它更靈活。這也更符合宣告式的精神，你是在宣告「我要這個狀態」，而不是在說「幫我建一個東西」。

執行之後你會看到一行訊息：pod/my-nginx created。代表 K8s 收到了你的請求，正在建立 Pod。

馬上看狀態。輸入 kubectl get pods。

你會看到一行資訊，有 NAME、READY、STATUS、RESTARTS、AGE 這幾個欄位。NAME 是 my-nginx，就是 YAML 裡設定的名字。READY 是 1/1，表示這個 Pod 裡面有一個容器而且已經準備好了。STATUS 如果是 Running，恭喜你，你的第一個 Pod 跑起來了。如果你看到 ContainerCreating，表示正在拉 Image，等幾秒再看一次就好。RESTARTS 是 0，表示沒有重啟過。AGE 是這個 Pod 跑了多久。

加一個參數看更多。輸入 kubectl get pods -o wide。

-o wide 是寬格式輸出。你會多看到 IP 和 NODE 兩個欄位。IP 是這個 Pod 在叢集內部的位址。注意，這個 IP 只能在叢集內部使用，從外面連不到。NODE 顯示 minikube，因為我們只有一個節點。等第五堂課用 k3s 多節點的時候，這裡就會顯示不同的 Node 名稱。

接下來用 describe 看更詳細的資訊。輸入 kubectl describe pod my-nginx。

describe 的輸出比較長，不要被嚇到。往上看你會看到 Name、Namespace、Node、Labels、IP 這些基本資訊。中間是容器的詳細資訊，包括 Image、Port、State。

但我要你特別注意最下面的 Events 區塊。Events 是排錯的時候最重要的資訊來源。你會看到幾行事件紀錄。Scheduled 表示 K8s 決定把這個 Pod 放在哪個 Node 了。Pulling 表示正在拉 Image。Pulled 表示 Image 拉完了。Created 表示容器建好了。Started 表示容器啟動了。你有沒有覺得這個流程很眼熟？這就是我們在架構那兩支影片講的完整流程。Scheduler 分配 Node、kubelet 叫 containerd 拉 Image 建容器啟動，全部被記在 Events 裡了。以後你的 Pod 出問題，第一件事就是來看 Events。如果卡在 Pulling 很久，可能是網路有問題或 Image 名稱寫錯了。如果顯示 Failed，Events 會告訴你具體原因。記住，describe 的 Events 區塊是你排錯的最好朋友。

再來看日誌。輸入 kubectl logs my-nginx。

因為 nginx 剛啟動而且我們還沒發任何請求給它，所以日誌可能很少，只有啟動訊息。這跟 Docker 的 docker logs 完全一樣。

好，現在最精彩的部分。我們要進到容器裡面去。輸入 kubectl exec -it my-nginx -- /bin/sh。

這個指令我拆開來說。kubectl exec 就是在容器裡面執行指令，對應 Docker 的 docker exec。-i 是 interactive，保持標準輸入開啟。-t 是分配一個終端。my-nginx 是 Pod 名字。然後是兩個減號 --。這兩個減號非常重要，我要特別講一下。

為什麼需要兩個減號？因為 kubectl 需要一個分隔符號來區分「給 kubectl 的參數」和「要在容器裡執行的指令」。沒有這個分隔符號的話，kubectl 可能會把 /bin/sh 當成自己的參數來處理。Docker 的 exec 不需要這個雙減號，是因為 Docker 的參數解析方式不同。K8s 多了這一步，但背後的設計其實更嚴謹。這是初學者很容易忘記的一個點，待會常見踩坑我還會再提醒一次。

執行之後你會發現命令提示符變了，可能變成井字號或者一個根目錄的提示。這表示你已經進到容器裡面了。

我們來驗證 nginx 是不是真的在跑。直覺上你可能會想打 curl localhost 來看看。但這裡有一個要注意的地方：nginx 官方的 Docker Image 是基於 Debian 精簡版的，它沒有預裝 curl。你打 curl 會看到 command not found。

不用緊張，有兩個辦法。

第一個辦法比較快，直接用 cat。輸入 cat /usr/share/nginx/html/index.html。/usr/share/nginx/html 是 nginx 預設的網頁根目錄。你會看到一段 HTML，裡面有 Welcome to nginx 的字樣。看到這個就代表 nginx 的檔案確實在那裡，而且 nginx 服務是正常的。

第二個辦法是裝 curl。輸入 apt-get update，跑完之後再輸入 apt-get install -y curl。大概十秒鐘就裝好了。然後打 curl localhost，你就會看到那段完整的歡迎頁面 HTML。在容器裡面安裝額外工具，這本身就是一個很實用的技巧。日常排錯的時候你經常需要在容器裡面裝一些工具來排查問題。不過要記住，這些修改只存在於當前這個容器裡面。Pod 刪掉重建之後，安裝的工具就不見了，因為容器是無狀態的。

好，驗證完了。輸入 exit 離開容器。

最後一步，清理。輸入 kubectl delete pod my-nginx。

你會看到 pod "my-nginx" deleted 的訊息。再用 kubectl get pods 確認，應該已經沒有 Pod 了，或者顯示 No resources found。

恭喜大家，你們剛剛完成了 Pod 的完整 CRUD。C 是 Create，用 kubectl apply 建立。R 是 Read，用 get、describe、logs 查看。U 是 Update，改了 YAML 之後再 apply 就是更新。D 是 Delete，用 kubectl delete 刪除。

把整個流程跟 Docker 對照一下。Docker 是 docker run -d --name my-nginx -p 8080:80 nginx:1.27，然後 docker ps、docker logs、docker exec -it my-nginx /bin/sh，最後 docker stop 加 docker rm。K8s 是 kubectl apply -f pod.yaml，然後 kubectl get pods、kubectl logs、kubectl exec -it my-nginx -- /bin/sh，最後 kubectl delete pod。流程一模一樣，語法稍有不同。最大的差別是 K8s 用一個 YAML 檔案來描述你要什麼，而不是把所有參數塞在一行指令裡面。

好，第一個 Pod 跑完了。現在給大家兩個練習題，鞏固一下剛才學到的東西。

[▶ 下一頁]`,
  },

  // ── 4-10 學員實作題目 ──
  {
    title: '學員實作：Pod 練習',
    subtitle: '兩道題鞏固 CRUD',
    section: '4-10：第一個 Pod CRUD',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 1：httpd:2.4 Pod（基礎）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>複製 pod.yaml → <code>httpd-pod.yaml</code></li>
            <li>name 改 <code>my-httpd</code>、image 改 <code className="text-green-400">httpd:2.4</code>、containerPort 改 <code>80</code></li>
            <li><code>kubectl apply -f httpd-pod.yaml</code> 部署</li>
            <li>進容器 → <code>cat /usr/local/apache2/htdocs/index.html</code>（看到 "It works!"）</li>
            <li>或 <code>kubectl port-forward pod/my-httpd 8080:80</code> → 瀏覽器 localhost:8080</li>
            <li>做完 <code>kubectl delete pod my-httpd</code></li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 2：修改 nginx 歡迎頁（進階）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl apply -f pod.yaml</code> 建 my-nginx</li>
            <li>進容器 → <code>echo "Hello Kubernetes" &gt; /usr/share/nginx/html/index.html</code></li>
            <li>exit → <code>kubectl port-forward pod/my-nginx 8080:80</code></li>
            <li>瀏覽器打開 <code>http://localhost:8080</code> 看到 "Hello Kubernetes"</li>
            <li>Ctrl+C 停止 → 想一想：<strong className="text-white">刪掉 Pod 再重建，改的內容還在嗎？</strong></li>
          </ul>
        </div>
      </div>
    ),
    notes: `題目一：用 httpd Image 建一個 Pod（基礎）

複製 pod.yaml，改名為 httpd-pod.yaml。name 改成 my-httpd，image 改成 httpd:2.4，containerPort 維持 80。

指令：cp pod.yaml httpd-pod.yaml
指令：（編輯 httpd-pod.yaml，把 name 改成 my-httpd，image 改成 httpd:2.4）
指令：kubectl apply -f httpd-pod.yaml
指令：kubectl get pods
指令：kubectl exec -it my-httpd -- cat /usr/local/apache2/htdocs/index.html

應該看到 "It works!"。也可以用 port-forward 從瀏覽器看：

指令：kubectl port-forward pod/my-httpd 8080:80

瀏覽器開 http://localhost:8080。Ctrl+C 停止。

指令：kubectl delete pod my-httpd

題目二：修改 nginx 歡迎頁面（進階挑戰）

指令：kubectl apply -f pod.yaml
指令：kubectl exec -it my-nginx -- /bin/sh

進容器後：

指令：echo "Hello Kubernetes" > /usr/share/nginx/html/index.html
指令：exit

回到本機：

指令：kubectl port-forward pod/my-nginx 8080:80

瀏覽器開 http://localhost:8080，看到 "Hello Kubernetes"。Ctrl+C 停止。

思考：刪掉 Pod 再重建，你改的內容還在嗎？為什麼？（答案：不在，因為沒掛 Volume，容器的檔案系統是臨時的）

指令：kubectl delete pod my-nginx

[▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ============================================================
  // 4-11：回頭操作 + 上午總結（2 張）
  // ============================================================

  // ── 4-11（1/2）：常見踩坑 + 上午回顧 ──
  {
    title: '常見踩坑三兄弟 + 上午回顧',
    subtitle: '初學者最容易犯的錯',
    section: '4-11：上午總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見踩坑</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">坑</th>
                <th className="pb-2 pr-4">症狀</th>
                <th className="pb-2">解法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1. YAML 縮排</td>
                <td className="py-2 pr-4"><code>error parsing</code></td>
                <td className="py-2">每層 2 空格，不混用 Tab</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2. exec 忘加 --</td>
                <td className="py-2 pr-4">指令報錯</td>
                <td className="py-2"><code>exec -it pod <strong>--</strong> /bin/sh</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">3. Image tag</td>
                <td className="py-2 pr-4"><code>ImagePullBackOff</code></td>
                <td className="py-2">寫明確版本號，不用 latest</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">上午回顧</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Docker 五大瓶頸 → 為什麼需要 K8s</li>
            <li>八大核心概念（Pod / Service / Ingress / ConfigMap / Secret / Volume / Deployment / StatefulSet）</li>
            <li>Master-Worker 架構（4 + 3 組件）</li>
            <li>minikube 環境 + kube-system 探索</li>
            <li>YAML 四大欄位 + 第一個 Pod CRUD</li>
          </ol>
          <p className="text-slate-400 text-xs mt-2">從「為什麼需要 K8s」到「跑出第一個 Pod」，完整脈絡</p>
        </div>
      </div>
    ),
    notes: `好，這支影片做兩件事。第一，我從頭到尾快速帶做一遍第一個 Pod，給剛才沒完全跟上的同學一個對照的機會。第二，把上午所有內容做一個完整回顧，然後告訴大家下午的學習方式。

先來快速帶做。打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。如果 pod.yaml 被改壞了，可以用 git checkout pod.yaml 還原。你也可以直接對照螢幕上的內容。就這十二行，我念一遍。apiVersion v1、kind Pod、metadata 底下 name my-nginx、labels 底下 app nginx、spec 底下 containers 列表裡面 name nginx、image nginx:1.27、ports 底下 containerPort 80。注意每一層縮排兩個空格，嚴格對齊。存檔。

然後一路跑下去。

指令：kubectl apply -f pod.yaml
指令：kubectl get pods
指令：kubectl get pods -o wide
指令：kubectl describe pod my-nginx
指令：kubectl logs my-nginx
指令：kubectl exec -it my-nginx -- /bin/sh
指令：cat /usr/share/nginx/html/index.html
指令：exit
指令：kubectl delete pod my-nginx

建立、查看、進去玩、刪掉。整個流程就是這樣。

好，再來聊三個初學者最容易踩到的坑。這三個坑我合稱「踩坑三兄弟」，幾乎每個剛學 K8s 的人都會遇到。

第一個，YAML 縮排錯誤。出現頻率最高。你把 containers 少縮了一格，或者 image 多縮了一格，kubectl apply 就會報錯。錯誤訊息通常是 error parsing pod.yaml 或者 could not find expected key。看到這種錯誤，第一反應就是去檢查縮排。每一層兩個空格，嚴格對齊。特別提醒不要混用空格和 Tab，混了之後 YAML 解析器會直接崩潰。VS Code 裡面可以打開「顯示空白字元」的功能，這樣每一行是空格還是 Tab 一眼就看得出來。

第二個，kubectl exec 忘記加雙減號。你輸入 kubectl exec -it my-nginx /bin/sh，結果報錯。因為沒有那兩個減號，kubectl 把 /bin/sh 當成自己的參數了。記住，Pod 名字和容器指令之間一定要加 -- 兩個減號。這是 kubectl 的分隔符號，告訴它「後面的東西不是給你的，是要傳進容器裡的」。

第三個，Image tag 的問題。你寫 image 冒號 nginx 沒有指定版本，K8s 會拉 latest。但 latest 不是一個固定的版本，它會隨著 Image 作者的更新而變。所以永遠寫明確的版本號。另外如果你把 Image 名字拼錯了，比如 nginx 打成 nginxx，K8s 會一直停在 ImagePullBackOff 的狀態，因為 Docker Hub 上找不到這個 Image。這時候用 describe pod 看 Events 就能看到拉取失敗的原因。下午的排錯實作我們會故意觸發這個錯誤，讓大家練習怎麼看、怎麼修。

好，三個坑都提醒了。現在來做上午的完整回顧。

上午我們走了一條完整的因果鏈。Docker 一台機器跑得好好的，但機器多了容器多了就撞上五個瓶頸，逼出了 K8s。K8s 要管容器就有了 Pod，Pod 的 IP 會變就有了 Service，一路推出八個核心概念。八個概念知道了但誰在背後運作，就去看了架構，Worker Node 三組件幹活、Master Node 四組件指揮。架構理解了就裝 minikube 環境，裝好了就用 kubectl 探索叢集、在 kube-system 親眼看到每個組件都以 Pod 的形式在跑。看完了就問「我怎麼跑自己的東西」，學了 YAML 格式和 Pod 概念，然後寫出第一個 YAML、跑出第一個 Pod、做完了完整的 CRUD。每一步都是因為上一步沒解決的問題而來的。

[▶ 下一頁]`,
  },

  // ── 4-11（2/2）：下午預告 ──
  {
    title: '下午預告：4 個 Loop 實作',
    subtitle: '概念 → 示範 → 練習 → 回頭操作',
    section: '4-11：上午總結',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Loop 結構（每個 Loop 都有練習時間）</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap mb-3">
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">概念影片</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">實作示範</span>
            <span className="text-slate-500">→</span>
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">學員練習</span>
            <span className="text-slate-500">→</span>
            <span className="bg-amber-900/40 text-amber-300 px-3 py-1 rounded">回頭操作</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Loop</th>
                <th className="pb-2">主題</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 1</td>
                <td className="py-2">Pod 生命週期 + 排錯（故意寫錯 YAML / Image 名字）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 2</td>
                <td className="py-2">多容器 Pod + Sidecar 模式（nginx + busybox 共享日誌）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 3</td>
                <td className="py-2">kubectl 進階（port-forward、dry-run、日常必用）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 4</td>
                <td className="py-2">環境變數 + MySQL Pod（env 欄位注入）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">不用擔心掉隊</p>
          <p className="text-slate-300 text-sm">做完的同學可以先往下看，沒做完的同學在<strong className="text-white">回頭操作</strong>環節跟著做。</p>
        </div>
      </div>
    ),
    notes: `現在來講下午的安排。下午跟上午不太一樣。上午是一支影片接一支影片，比較線性地從概念走到實作。下午我們用一個叫 Loop 的結構。每一個 Loop 包含三到四個步驟。第一步是概念影片，我先講清楚原理。第二步是實作示範，我在螢幕上操作給你看。第三步是你自己動手，螢幕上會有練習題目，給你十到十五分鐘的時間做。第四步是回頭操作，我從頭帶做一遍，讓沒跟上的同學可以對照。

下午四個 Loop 分別是。Loop 1 是 Pod 生命週期和排錯，我會帶大家故意寫錯 YAML、故意拼錯 Image 名字，練習看錯誤訊息怎麼查、怎麼修。Loop 2 是多容器 Pod 和 Sidecar 模式，親手體驗兩個容器在同一個 Pod 裡面共享網路、共享 Volume。Loop 3 是 kubectl 進階技巧，包括 port-forward、dry-run 這些日常工作天天用到的東西。Loop 4 是環境變數和 MySQL Pod，學會怎麼把設定注入到容器裡面，為第六堂課的 ConfigMap 和 Secret 做鋪墊。

每個 Loop 結束都有練習時間。做完的同學可以先往下看，沒做完的就在回頭操作的時候跟著一起做。不用擔心掉隊。

好，上午到這裡。大家休息一下，下午見。

[▶ 上午結束]`,
  },
]
