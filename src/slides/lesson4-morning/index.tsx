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

在開始之前，先提醒大家一件事。等一下我們會需要用到 minikube 這個工具，安裝需要一點時間，所以建議你現在就先把安裝指令跑起來，讓它在背景下載，不影響你聽課。指令在螢幕上，跑完之後再執行 minikube start，讓它把叢集先建起來。好，我們邊裝邊上課。

先回顧一下前三堂。第一堂 Linux 基礎，第二堂 Docker 入門，第三堂 Docker Compose。到第三堂結束，我們已經可以在一台機器上用 Docker Compose 把一整套系統跑起來，跑得很好。

但是現在我要你想像一個場景。你在一家電商公司，業務越來越大，容器越來越多，一台機器頂不住了...

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
    notes: `五個問題一個接一個：

第一，一台機器扛不住了，容器要分散到多台機器。Docker Compose 只管一台，你只能自己 SSH 到每台機器上去跑，管不動。

第二，機器掛了，上面的容器全死了。凌晨三點你被叫醒手動重建，Docker 不會自動搬家。

第三，流量暴增來不及加容器。手動 scale 等你反應過來使用者早就看到 502 了。

第四，更新版本要停機。Docker Compose 沒有內建不停機更新。

第五，跨機器的容器找不到對方。Docker Network 跨不了機器。

五個問題有一個共同點：全部跟「多台機器」有關。Docker 就是單機工具，規模超出一台就無能為力了。

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
    notes: `這就是 Kubernetes 要解決的。K8s 源自 Google 內部的 Borg 系統，2003 年開始用，管了超過十五年，每週啟動二十億個容器。2014 年開源，現在是行業標準。

五個問題一一對應：Scheduler 自動分配、故障自動搬家、自動擴縮容、滾動更新+回滾、內建 DNS 服務發現。

最後一個重要觀念：K8s 是宣告式的。Docker 是命令式，你告訴它每一步怎麼做。K8s 你只說你想要什麼狀態，它自己做到並持續維護。就像跟服務生說「我要牛排七分熟」，不用管廚師怎麼煎。

K8s 解決了五個問題，但它是怎麼做到的？接下來我帶你從跑第一個容器開始，一步步碰到問題、一步步認識核心概念。

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
    notes: `決定用 K8s 了，第一步：把容器跑起來。Docker 是 docker run nginx，K8s 不直接管容器，管的最小單位叫 Pod。

Pod 就是容器的一層包裝，像便利商店飯糰外面的塑膠膜。一個 Pod 裡可以放一個或多個容器，共享網路和儲存，用 localhost 互通。

為什麼多包一層？有時候主程式需要搭配輔助程式，像 API 容器旁邊放一個日誌收集容器，這叫 Sidecar 模式，摩托車+邊車。但大部分情況一 Pod 一容器就好。

Node 就是一台機器，一個叢集有很多 Node，一個 Node 上跑很多 Pod。

Pod 跑起來了。然後呢？問題馬上來了...

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
    notes: `K8s 給 Pod 一個 IP，10.244.0.5。前端 Pod 要連後端，就寫 10.244.0.5。跑了兩天，後端掛了，K8s 重建了一個新 Pod，IP 變成 10.244.0.8。前端還在連 10.244.0.5，連不上了。

而且 Pod IP 是叢集內部的虛擬 IP，外面的使用者根本連不到。

怎麼辦？別直接連 Pod，中間加一層 Service。Service 地址不變，自動追蹤後面健康的 Pod，轉發請求。就像公司總機號碼，不管接線員換幾個，總機永遠不變。

三種類型：ClusterIP（叢集內部，預設，內建 DNS 用名字找對方）、NodePort（開 Port 讓外面連，像 Docker -p）、LoadBalancer（雲端用）。

OK 叢集內部解決了，外面也能用 NodePort 連。但 192.168.1.100:30080 這種地址你會讓使用者打嗎？

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
    notes: `NodePort 地址太醜，使用者要的是 www.myshop.com。所以又多了一層 Ingress。

Ingress 是 HTTP 層的路由器。外部 HTTP 請求進來，根據域名或路徑轉到不同 Service。www.myshop.com 轉前端，/api 轉後端，admin.myshop.com 轉管理後台。還可以設 SSL 憑證支援 HTTPS。

用 Docker 的話就像自己架 Nginx 反向代理。Ingress 是 K8s 版本的 Nginx，用 YAML 設定。

Ingress 只是規則（地圖），需要搭配 Ingress Controller（司機）才能運作。第六堂課實際操作。

Service 在四層做穩定入口，Ingress 在七層做域名路由，配合使用不是取代。

流量路徑：使用者 → Ingress → Service → Pod。

容器能跑、能連、外面也看得到了。但新問題來了：設定寫死在 Image、密碼沒地方放、資料會消失...

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
    notes: `API 要連資料庫，地址寫死在 Image 裡。開發環境 dev-db:3306，上線 prod-db:3306。換環境就要改設定、重 build、重部署。煩不煩？Docker 的時候用 -e 環境變數解決，K8s 用 ConfigMap。

ConfigMap 兩種用法：環境變數注入（簡單但改了要重啟 Pod）、Volume 掛載（會自動更新但程式要偵測）。上限 1MB。

密碼也放 ConfigMap？任何人都看得到。所以敏感資訊放 Secret。Secret 做 Base64 編碼，但 Base64 不是加密！就像中文翻英文，任何人都翻得回來。真正的安全靠 RBAC 權限控制：一般開發者只能看 ConfigMap，不能看 Secret。

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
    notes: `設定和密碼都處理了，還有一個問題：容器掛了資料就沒了。MySQL 存了幾百萬筆訂單，容器重啟資料全消失。Docker 用 docker volume 解決，K8s 也有 Volume。

三種：emptyDir（臨時空目錄，Sidecar 共享用）、hostPath（掛 Node 本地目錄，= Docker -v，但 Pod 換 Node 就讀不到）、遠端儲存（NFS、AWS EBS、GCP Persistent Disk，Pod 換 Node 也能掛回來，生產環境用這個）。

K8s Volume 比 Docker 強在遠端儲存支援。還有 PV/PVC 機制，第六堂詳講。

到這裡解決了六個問題、認識了六個概念。但還有兩個大問題：API 只有一個 Pod 掛了就停服務，資料庫要多副本但每個身份不同...

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
    notes: `API 只有一個 Pod。掛了，Service 後面沒 Pod 轉發，使用者看到錯誤頁面。這叫單點故障，生產環境絕不允許。

怎麼辦？多跑幾個。三個 Pod 分散在不同 Node，掛一個還有兩個。但你要手動建三個嗎？半夜掛了你爬起來補嗎？不用，K8s 有 Deployment。

Deployment 就是管副本的控制器。告訴它跑什麼 Image、跑幾個。自動建、自動監控、掛了自動補。跨 Node 分散。kubectl scale 動態調整副本數，一行指令不用停機。

三層關係：Deployment → ReplicaSet → Pod。ReplicaSet 是 Deployment 自動建的，你只管 Deployment。就像點餐，你跟服務生說，服務生跟廚師說。

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
    notes: `Deployment 還有殺手級功能：滾動更新。

三個 v1 的 Pod，要更新到 v2。第一步，建一個 v2 Pod（現在 3v1+1v2）。第二步，v2 健康了，砍一個 v1（2v1+1v2）。第三步，再建 v2 再砍 v1（1v1+2v2）。第四步，最後一個替換完成（3v2）。全程始終有 Pod 在服務，像接力賽一樣。

萬一 v2 有問題？kubectl rollout undo 一個指令回滾。舊的 ReplicaSet 還在（副本數 0），加回去就好，不用重 build，幾十秒搞定。預設保留 10 個版本。

Deployment 解決了無狀態應用。但資料庫呢？

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

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">實務建議</p>
          <p className="text-slate-300 text-xs">很多團隊選擇<strong className="text-white">不把 DB 放 K8s</strong>，用雲端 RDS / Cloud SQL 託管。K8s 裡只跑無狀態應用（API、前端）-- 這是非常常見的最佳實踐，特別是剛導入 K8s 的團隊。</p>
        </div>
      </div>
    ),
    notes: `資料庫不能用 Deployment。三個 MySQL Pod：mysql-0 是主節點寫入，mysql-1/2 是從節點讀取。身份重要（重啟後名字不能變）、順序重要（主節點要先跑）、儲存獨立（各自的資料不能混）。

所以 K8s 有 StatefulSet。跟 Deployment 很像但三個保證：穩定名稱（mysql-0 永遠是 mysql-0）、有序部署刪除（像搭積木）、獨立儲存。

實務上很多團隊 DB 放 K8s 外面用 RDS 這類託管服務。K8s 只跑無狀態應用。

八概念因果鏈總結：Docker 扛不住 → Pod → IP 會變 → Service → 地址太醜 → Ingress → 設定寫死 → ConfigMap → 密碼明文 → Secret → 資料消失 → Volume → 單點故障 → Deployment → DB 特殊 → StatefulSet。每一個都是上一步沒解決的問題。

接下來換角度：誰在讓這些事情發生？Pod 掛了誰偵測的？新 Pod 誰建的？放哪台機器誰決定的？

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
    notes: `K8s 是 Master-Worker 架構。Master 不跑應用，只做管理。Worker 跑 Pod。生產環境 Master 3 台高可用，Worker 幾十到上百。minikube 是單節點，Master + Worker 合一。`,
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
    notes: `Worker 三組件：Container Runtime（containerd，跑容器）、kubelet（工頭，接指令管 Pod）、kube-proxy（網路代理，Service 轉發）。K8s 1.24 開始直接用 containerd，不需要 Docker。`,
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
    notes: `Master 四組件：API Server（大門）、etcd（資料庫，最重要）、Scheduler（調度）、Controller Manager（控制迴圈，比較期望 vs 實際）。etcd 掛了最嚴重，必須備份。`,
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
    notes: `完整流程：kubectl → API Server 驗證 → etcd 記錄 → Controller Manager 建 ReplicaSet → Scheduler 分配 Node → kubelet 建容器。故障恢復也全自動：Controller Manager 發現少了就補。`,
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
    notes: `架構圖：Master 有 4 組件（API Server、etcd、Scheduler、Controller Manager），Worker 有 3 組件（kubelet、kube-proxy、containerd）+ Pod。K8s 的管理組件自己也是以 Pod 形式跑。`,
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
    notes: `三種方案：minikube（今天，單節點）、k3s（第五堂，多節點）、RKE（生產環境）。kubectl 學一次到處用，跟 Docker CLI 一樣角色。`,
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
    notes: `在 kube-system 裡親眼看到 etcd、API Server、Scheduler、Controller Manager、kube-proxy、CoreDNS 都是以 Pod 形式在跑。describe node 看 Container Runtime 是 containerd。`,
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
    notes: `Namespace 像資料夾，最常用 default 和 kube-system。Dashboard 是圖形介面。Docker vs kubectl 對照表幾乎一對一，唯一差異是 exec 要加 -- 雙減號。`,
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
    notes: `YAML 三規則：空格不能 Tab、冒號後空格、減號列表。四大欄位：apiVersion（API 版本）、kind（資源類型）、metadata（名字標籤）、spec（規格）。對照 Docker Compose 的 YAML 來理解。`,
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
    notes: `apiVersion 速查表：Pod/Service/ConfigMap = v1, Deployment = apps/v1, Ingress = networking.k8s.io/v1。Docker Compose 一檔多服務，K8s 一檔一資源。`,
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
    notes: `逐行解釋 pod.yaml。name 只能小寫 + 數字 + 減號。image 寫明確版本號（不用 latest）。containerPort 是文件記錄，不寫也能跑。統一用 apply 不用 create。`,
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
mkdir -p ~/k8s-labs && cd ~/k8s-labs

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
    notes: `完整 CRUD：apply 建、get 看、describe 查詳情（Events 最重要）、logs 看日誌、exec 進容器、delete 刪除。exec 記得加 -- 雙減號。describe Events 是排錯第一步。`,
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
    notes: `兩道練習題。題目一：httpd Pod，練習改 YAML 和 CRUD 流程。題目二：修改 nginx 歡迎頁 + port-forward 驗證，思考 Pod 刪除後資料是否還在（不在，因為沒掛 Volume）。`,
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
    notes: `三大踩坑：YAML 縮排（Tab vs 空格）、exec 忘加雙減號、Image tag 拼錯或用 latest。上午完整脈絡：Docker 瓶頸 → 八概念 → 架構 → 環境 → YAML → 第一個 Pod。`,
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
    notes: `下午用 Loop 結構：概念 → 示範 → 練習 → 回頭操作。四個 Loop：排錯、Sidecar、kubectl 進階、環境變數。每個 Loop 有練習時間，不用擔心掉隊。`,
  },
]
