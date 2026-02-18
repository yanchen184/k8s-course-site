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
    title: '服務暴露',
    subtitle: 'Service、Ingress、NetworkPolicy',
    section: '第五堂下午',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            🌐
          </div>
          <div>
            <p className="text-2xl font-semibold">第五堂下午 — 13:00–17:00</p>
            <p className="text-slate-400">讓外部世界可以存取你的應用程式</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { label: 'Service 深入', icon: '🔌', desc: '四種類型、Endpoints' },
            { label: 'DNS 服務發現', icon: '📡', desc: 'CoreDNS、跨 Namespace' },
            { label: 'Ingress', icon: '🚪', desc: 'HTTP 路由、TLS/HTTPS' },
            { label: 'NetworkPolicy', icon: '🛡️', desc: '網路隔離與白名單' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-k8s-blue">{item.label}</p>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `歡迎大家回來！午休吃飽了嗎？希望大家都有補充到足夠的能量，因為下午的課程內容非常實用，而且跟你們之後的工作直接相關。下午的主題是「服務暴露」，這可以說是 Kubernetes 最實用的一塊，因為它直接關係到你的應用程式能不能讓外界存取到。

讓我先用一個真實情境帶大家入戲：想像你是剛加入新創公司的後端工程師，今天終於把電商後端的 Docker Image 部署到公司的 Kubernetes 叢集上。kubectl get pods 顯示 Pod 是 Running 狀態，你心情超好。結果 PM 問你：「功能可以用了嗎？」你打開 API 網址一試，完全連不上。為什麼？因為 Pod 跑起來了，不代表外界可以存取它。這就是服務暴露要解決的問題。

上午我們學了 Pod、Deployment、ReplicaSet 這些計算資源，能夠部署和管理應用程式的運行。但問題是——Pod 部署起來後，它有一個叢集內部的 IP，這個 IP 是動態分配的，Pod 重建就會換，而且外部網路根本無法直接路由到 Pod IP。要讓服務可以被存取，我們需要一套額外的網路機制。

今天下午，我們會從四個主題循序漸進地解決這個問題：第一，Service 的四種類型深入分析，每種都有明確的使用場景，選對工具才事半功倍；第二，CoreDNS 服務發現，搞懂 Kubernetes 內部那個很長的域名格式是什麼意思，讓服務之間可以用名字互相找到；第三，Ingress，現在業界最主流的 HTTP 服務對外方式，一個入口管理所有 HTTP 服務；第四，NetworkPolicy，網路防火牆，用白名單方式限制 Pod 之間的流量，加強安全性。

今天下午有大量的實作。特別是最後那個「完整對外服務」組合實作，會讓大家把 Deployment、Service、Ingress 全部串起來，這是真實環境中幾乎每天都用到的部署模式。學完今天，你就能獨立完成一個 Kubernetes 服務從部署到對外的完整流程。準備好了嗎？我們開始！`,
  },

  // ========== Service 概念回顧 ==========
  {
    title: 'Service 是什麼？',
    subtitle: '解決 Pod IP 不穩定的問題',
    section: 'Service 深入',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400 font-semibold text-lg">❌ 沒有 Service 的問題</p>
          <ul className="text-slate-300 mt-2 space-y-1">
            <li>• Pod IP 每次重建都會改變</li>
            <li>• 多個 Pod 副本時，流量怎麼分配？</li>
            <li>• 外部無法直接進入 Pod</li>
          </ul>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400 font-semibold text-lg">✓ Service 的解法</p>
          <ul className="text-slate-300 mt-2 space-y-1">
            <li>• 提供穩定的虛擬 IP（ClusterIP）</li>
            <li>• 透過 Label Selector 自動找到後端 Pod</li>
            <li>• 內建負載均衡，流量分散到多個 Pod</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-400"># Service 透過 selector 找到 Pod</p>
          <p><span className="text-yellow-400">selector:</span></p>
          <p className="ml-4"><span className="text-green-400">app: my-web</span>  <span className="text-slate-500"># 符合這個 Label 的 Pod 都是後端</span></p>
        </div>
      </div>
    ),
    notes: `先快速回顧一下為什麼需要 Service。上午我們知道 Pod 是 Kubernetes 最基本的運行單元，但 Pod 有一個致命弱點：它的 IP 是不固定的。這個問題在單機 Docker 環境不明顯，但到了 Kubernetes 這種大規模集群，就變成了一個嚴重的工程挑戰。

讓我給大家講一個具體場景。你的電商系統有前端、後端 API、以及 MySQL 資料庫，全部跑在 Kubernetes 上。後端 API Pod 的 IP 是 10.244.1.5，前端程式碼裡寫了 const API_URL = "http://10.244.1.5:8080"。某天晚上，後端 Pod 所在的節點出現硬體問題，Kubernetes 自動把 Pod 搬到另一個節點，新 Pod 的 IP 變成 10.244.3.12。這時候前端的所有 API 請求全部失敗，因為舊 IP 已經失效了。你要在半夜爬起來改程式碼、重新部署，非常狼狽。

這就是 Pod IP 不穩定帶來的問題。更麻煩的是，當你的後端 API 有三個 Pod 副本在跑，你要怎麼知道要連哪一個？總不能在前端程式碼裡寫三個 IP 然後自己做負載均衡吧？

Service 就是解決這兩個問題的抽象層。它的核心機制是這樣的：首先，Service 提供一個穩定的虛擬 IP，稱為 ClusterIP。這個 IP 在 Service 存活期間永遠不會改變，不管後端 Pod 怎麼來來去去。其次，Service 透過 Label Selector 動態追蹤後端 Pod。只要 Pod 帶有符合 selector 條件的 Label，就會自動被加入 Service 的後端清單；Pod 消失了就自動移除。第三，Service 內建負載均衡，流量會自動分散到所有健康的後端 Pod。

把 Service 想像成公司的總機：總機電話號碼固定（ClusterIP），打進來的電話會自動轉給空閒的員工（Pod），員工請假了系統自動跳過（Pod 不健康時從 Endpoints 移除）。這樣解決了所有問題，前端只需要記 Service 的 ClusterIP 或 DNS 名稱，不需要知道任何 Pod 的 IP。

了解了 Service 的核心設計理念，接下來我們深入看四種具體的 Service 類型。`,
  },

  // ========== ClusterIP 與 NodePort ==========
  {
    title: 'ClusterIP 與 NodePort',
    subtitle: '最基礎的兩種 Service 類型',
    section: 'Service 深入',
    duration: '10',
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-blue-400">ClusterIP（預設）</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <p className="text-slate-300">🔒 只能在叢集內部存取</p>
            <p className="text-slate-300">📦 適合：服務之間的通訊</p>
            <p className="text-slate-300">🌐 虛擬 IP：僅限叢集內</p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
            <p><span className="text-yellow-400">spec:</span></p>
            <p className="ml-4"><span className="text-cyan-400">type:</span> <span className="text-green-400">ClusterIP</span></p>
            <p className="ml-4"><span className="text-cyan-400">selector:</span></p>
            <p className="ml-8"><span className="text-green-400">app: my-web</span></p>
            <p className="ml-4"><span className="text-cyan-400">ports:</span></p>
            <p className="ml-6"><span className="text-slate-400">- port: 80</span></p>
            <p className="ml-8"><span className="text-slate-400">targetPort: 8080</span></p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-orange-400">NodePort</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
            <p className="text-slate-300">🌍 外部可直接存取節點 IP</p>
            <p className="text-slate-300">🔢 埠號範圍：30000–32767</p>
            <p className="text-slate-300">📍 格式：NodeIP:NodePort</p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
            <p><span className="text-yellow-400">spec:</span></p>
            <p className="ml-4"><span className="text-cyan-400">type:</span> <span className="text-orange-400">NodePort</span></p>
            <p className="ml-4"><span className="text-cyan-400">selector:</span></p>
            <p className="ml-8"><span className="text-green-400">app: my-web</span></p>
            <p className="ml-4"><span className="text-cyan-400">ports:</span></p>
            <p className="ml-6"><span className="text-slate-400">- port: 80</span></p>
            <p className="ml-8"><span className="text-slate-400">targetPort: 8080</span></p>
            <p className="ml-8"><span className="text-orange-400">nodePort: 30080</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `我們來看前兩種 Service 類型：ClusterIP 和 NodePort。這兩個是最基礎、最常用的，搞懂了之後後面的 LoadBalancer 和 ExternalName 也就很好理解了。

先說 ClusterIP。ClusterIP 是 Service 的預設類型，如果你建立 Service 時不指定 type，預設就是 ClusterIP。它的核心特性是：分配一個虛擬 IP，但這個 IP 只在 Kubernetes 叢集內部可以路由，外部網路完全無法直接存取。

你可能會問：那這有什麼用？用處非常大。叢集裡的微服務彼此通訊，全部都用 ClusterIP。舉個電商的例子：前端 Pod 要呼叫後端 API，走 api-service 的 ClusterIP；後端 API 要查 MySQL 資料庫，走 mysql-service 的 ClusterIP；MySQL 服務不需要對外，放在 ClusterIP 後面，只有叢集內部可以連，安全性大幅提升。這是最正確的微服務通訊方式。

ClusterIP YAML 的重點是 selector 和 ports。selector 用 Label 選取後端 Pod，這個和 Deployment 的 matchLabels 是同一套機制。ports 裡面有兩個欄位要搞清楚：port 是 Service 對外開放的連接埠，也就是其他服務連 ClusterIP 時用的 port；targetPort 是後端 Pod 實際在監聽的連接埠。這兩個可以不同，比如你的 Python Flask App 監聽 5000 port，但你希望 Service 對外說自己是 80 port，就把 port 設 80、targetPort 設 5000。

接下來是 NodePort。NodePort 在 ClusterIP 的功能之上多加了一個對外暴露機制：它讓 Kubernetes 在每個 Node（工作節點）上開放一個特定的埠號，這個埠號的範圍是 30000 到 32767。任何可以到達 Kubernetes 節點 IP 的外部機器，都可以用「節點 IP:NodePort 埠號」來存取這個 Service。

舉個例子：叢集有三個節點，IP 分別是 192.168.1.10、192.168.1.11、192.168.1.12，你設定 nodePort: 30080。那麼從外部機器，連任何一個節點 IP 加 30080 都能到達這個 Service，比如 curl http://192.168.1.10:30080。你不需要記哪個 Pod 在哪個節點，任何節點都可以進入。

NodePort 的使用場景是開發測試和學習環境。它的好處是不需要額外的基礎設施（不需要 LB），設定簡單，馬上可以從外部存取。缺點是埠號範圍只有 30000-32767，不能用標準的 80 或 443，而且你要記得節點 IP，不適合大規模的生產環境服務對外。生產環境對外通常用 Ingress，我們等一下會學到。

現在大家把這兩個 YAML 記下來，理解 port 和 targetPort 的差別，這個概念在後面會反覆用到。`,
  },

  // ========== LoadBalancer 與 ExternalName ==========
  {
    title: 'LoadBalancer 與 ExternalName',
    subtitle: '雲端整合與外部服務對接',
    section: 'Service 深入',
    duration: '10',
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-green-400">LoadBalancer</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
            <p className="text-slate-300">☁️ 需要雲端平台支援（AWS/GCP/Azure）</p>
            <p className="text-slate-300">🌐 自動建立雲端 LB，取得公網 IP</p>
            <p className="text-slate-300">✅ 生產環境對外服務首選</p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
            <p><span className="text-cyan-400">type:</span> <span className="text-green-400">LoadBalancer</span></p>
            <p className="text-slate-500 mt-1"># 自動分配 EXTERNAL-IP</p>
            <p className="text-slate-500"># kubectl get svc 可查看</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-sm">
            <p className="text-yellow-400">⚠️ 本地裸機環境需搭配</p>
            <p className="text-slate-300">MetalLB 才有 EXTERNAL-IP</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-purple-400">ExternalName</h3>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
            <p className="text-slate-300">🔗 把 Service 名稱對應到外部域名</p>
            <p className="text-slate-300">🏢 適合：對接外部資料庫、第三方 API</p>
            <p className="text-slate-300">📌 不建立 ClusterIP，純粹 DNS 別名</p>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
            <p><span className="text-cyan-400">type:</span> <span className="text-purple-400">ExternalName</span></p>
            <p><span className="text-cyan-400">externalName:</span></p>
            <p className="ml-2"><span className="text-green-400">db.example.com</span></p>
            <p className="text-slate-500 mt-1"># 叢集內存取 svc name</p>
            <p className="text-slate-500"># DNS 解析到外部域名</p>
          </div>
        </div>
      </div>
    ),
    notes: `繼續看後兩種類型：LoadBalancer 和 ExternalName。這兩個類型是針對特定場景設計的，LoadBalancer 是雲端生產環境的主力，ExternalName 則是一個很巧妙的橋接機制。

先說 LoadBalancer。當你在 AWS EKS、Google GKE、Azure AKS 這些雲端託管的 Kubernetes 平台上建立 type: LoadBalancer 的 Service，神奇的事情就發生了：Kubernetes 會自動呼叫雲端平台的 API，在雲端上建立一個真實的四層負載均衡器（AWS 叫做 ELB/NLB，GCP 叫做 Cloud Load Balancing，Azure 叫做 Azure Load Balancer），然後把一個公網 IP 分配給你。你的服務就有了一個對外的公網 IP。

這個體驗非常流暢，完全自動化。你只要 kubectl apply 一個 YAML，等個一兩分鐘，kubectl get svc 就可以看到 EXTERNAL-IP 欄位出現了一個真實的公網 IP 地址。把這個 IP 設到你的 DNS A 記錄，服務就對外了。雲端 LB 還帶有自動健康檢查、跨可用區流量分發、SSL 終止等企業級功能，非常強大。

但有個重要的成本問題要注意：每個 LoadBalancer Service 都會建立一個獨立的雲端 LB，費用是按小時計算的。AWS ALB 大概一個月幾十美金，如果你有十個微服務，每個都用 LoadBalancer Service，光是 LB 費用就是一筆不小的開銷。這就是為什麼生產環境通常改用一個 LoadBalancer 給 Ingress Controller 用，然後所有 HTTP 服務都透過 Ingress 規則路由，而不是每個服務各自建一個 LB Service。這個策略我們在 Ingress 那節會詳細說明。

在本地裸機環境，沒有雲端 API，LoadBalancer Service 的 EXTERNAL-IP 欄位會一直顯示 pending，因為沒有東西可以分配 IP。這時候有個開源工具叫 MetalLB，它可以模擬雲端 LB 的行為，從你指定的 IP 範圍裡分配一個 IP 給 LoadBalancer Service，讓本地環境也可以測試 LoadBalancer 類型。我們的練習環境先用 NodePort 模式，課後大家可以自己嘗試裝 MetalLB。

接下來說 ExternalName。這個類型比較特殊，它不是把叢集內的 Pod 暴露出去，而是反過來：把外部的服務「引入」叢集的 Service 體系裡。它本質上是一個 DNS CNAME 別名。

具體用法：假設公司的 MySQL 資料庫是在雲端的 RDS 上，DNS 地址是 prod-db.rds.us-east-1.amazonaws.com，它不在 Kubernetes 叢集裡。你可以建一個 ExternalName Service，name 叫做 mysql，externalName 設定為 prod-db.rds.us-east-1.amazonaws.com。這樣，叢集裡的 Pod 連 mysql 這個 Service 名稱，CoreDNS 就會把它解析成那個很長的 RDS 域名，然後繼續連到外部的 RDS。

這樣做的好處很明顯：應用程式程式碼裡只寫 mysql，完全不知道後面是什麼。如果哪天要從 RDS 搬到自己維護的 MySQL，或者換到另一個 RDS endpoint，只需要改 ExternalName 這個 Service 的 YAML，應用程式完全不用改，也不用重新部署。這是一種很好的解耦設計。

四種 Service 類型使用場景速查：ClusterIP 給叢集內部服務互相通訊用（最常用）；NodePort 給開發測試時臨時對外存取用；LoadBalancer 給雲端生產環境對外服務用；ExternalName 給把外部服務接入叢集 DNS 體系用。記住這四個場景，遇到問題就知道該用哪種。`,
  },

  // ========== Endpoints ==========
  {
    title: 'Endpoints：Service 的後端清單',
    subtitle: 'Service 如何知道要把流量送到哪裡',
    section: 'Service 深入',
    duration: '10',
    content: (
      <div className="space-y-5">
        <p className="text-slate-300">
          每個 Service 都對應一個同名的 <span className="text-k8s-blue font-bold">Endpoints</span> 物件，記錄所有符合 selector 的 Pod IP
        </p>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-400"># 查看 Endpoints</p>
          <p><span className="text-green-400">kubectl get endpoints my-service</span></p>
          <p className="text-slate-500 mt-2">NAME         ENDPOINTS</p>
          <p className="text-slate-300">my-service   10.244.1.5:8080,10.244.2.7:8080</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold">✓ 有 selector</p>
            <p className="text-slate-300 text-sm mt-1">Kubernetes 自動管理 Endpoints，Pod 新增/刪除自動更新</p>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
            <p className="text-purple-400 font-semibold">手動 Endpoints</p>
            <p className="text-slate-300 text-sm mt-1">Service 不設 selector，手動建立 Endpoints 對應外部 IP</p>
          </div>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
          <p className="text-slate-400"># 手動 Endpoints（對應外部服務）</p>
          <p><span className="text-yellow-400">apiVersion:</span> v1</p>
          <p><span className="text-yellow-400">kind:</span> Endpoints</p>
          <p><span className="text-yellow-400">metadata:</span></p>
          <p className="ml-4"><span className="text-cyan-400">name:</span> external-db</p>
          <p><span className="text-yellow-400">subsets:</span></p>
          <p className="ml-4"><span className="text-slate-400">- addresses:</span></p>
          <p className="ml-8"><span className="text-slate-400">- ip: 192.168.10.5</span></p>
          <p className="ml-6"><span className="text-slate-400">ports:</span></p>
          <p className="ml-8"><span className="text-slate-400">- port: 5432</span></p>
        </div>
      </div>
    ),
    notes: `讓我們更深入理解 Service 背後的關鍵機制——Endpoints。這個機制很多人學 K8s 一陣子都還沒搞清楚，但它對於除錯 Service 問題至關重要。

每當你建立一個 Service，Kubernetes 的控制面（具體是 Endpoint Controller 這個元件）會同時自動建立一個和 Service 同名的 Endpoints 物件。注意是 Endpoints，複數，不是 Endpoint。這個 Endpoints 物件的核心資料就是一個清單，記錄了所有目前符合 Service selector 條件的 Pod 的 IP 地址和 port 號。

舉個例子：你有一個 ClusterIP Service 叫做 api-service，selector 設定 app: backend-api。叢集裡有三個帶有 app: backend-api 這個 Label 的 Pod，IP 分別是 10.244.1.5、10.244.2.7、10.244.3.2，都在 8080 port 監聽。那麼 Endpoints 物件就會記錄這三個 Pod 的 IP 和 port：10.244.1.5:8080, 10.244.2.7:8080, 10.244.3.2:8080。當流量進入 Service，kube-proxy 就會從這個清單裡選一個 IP 轉發流量。

Endpoints 是動態更新的。當 Deployment 擴展副本數，新 Pod 啟動並且通過 readiness probe 後，它的 IP 就會自動加入 Endpoints。當 Pod 被刪除、重建、或者 readiness probe 失敗，它的 IP 就會自動從 Endpoints 移除。這個機制保證了 Service 後面永遠只有健康的 Pod 在接收流量。

這就是為什麼 Kubernetes 的滾動更新這麼平滑：新 Pod 起來、readiness 通過後才加入 Endpoints，舊 Pod 被移出 Endpoints 後才真正終止，整個過程流量不中斷。

你可以用 kubectl get endpoints api-service 查看，或者 kubectl describe endpoints api-service 看更詳細的資訊。如果 Endpoints 顯示空的，代表 selector 沒有匹配到任何 Pod，要去檢查 Label 是否正確。這是排查 Service 問題的第一步：確認 Endpoints 有沒有 Pod IP。

還有一個進階用法值得了解：手動管理 Endpoints。如果建立 Service 時不設定 selector，Kubernetes 就不會自動管理 Endpoints。你可以手動建立一個同名的 Endpoints 物件，直接指定外部服務的 IP 和 port。這樣可以把叢集外部的服務——比如機房裡跑在裸機上的 PostgreSQL、或者 VPN 後面的舊系統——接入 Kubernetes 的 Service 體系，讓叢集內的 Pod 用 Service 名稱來存取。這比 ExternalName 更靈活，因為你可以直接指定 IP，不需要依賴 DNS；而且可以指定多個 IP，自帶負載均衡。

記住這個除錯技巧：遇到 Service 連不上，永遠先看 Endpoints。Endpoints 空了就是 selector 問題；Endpoints 有 IP 但連不上就是 Pod 本身或防火牆問題。`,
  },

  // ========== DNS 與服務發現 ==========
  {
    title: 'DNS 與服務發現',
    subtitle: 'CoreDNS：叢集內部的域名系統',
    section: 'DNS 與服務發現',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-lg">
          <span className="text-3xl">📡</span>
          <div>
            <p className="font-semibold text-k8s-blue">CoreDNS</p>
            <p className="text-slate-300 text-sm">Kubernetes 內建的 DNS 伺服器，以 Pod 形式運行在 kube-system namespace</p>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-3">Service DNS 完整格式</p>
          <div className="text-center">
            <code className="text-2xl">
              <span className="text-green-400">my-svc</span>
              <span className="text-slate-500">.</span>
              <span className="text-blue-400">my-ns</span>
              <span className="text-slate-500">.</span>
              <span className="text-yellow-400">svc</span>
              <span className="text-slate-500">.</span>
              <span className="text-purple-400">cluster.local</span>
            </code>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3 text-center text-xs text-slate-400">
            <span>Service 名稱</span>
            <span>Namespace</span>
            <span>固定</span>
            <span>叢集域名</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-900/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">同 Namespace（簡寫）</p>
            <code className="text-slate-300">http://my-svc:8080</code>
          </div>
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">跨 Namespace（完整）</p>
            <code className="text-slate-300">http://my-svc.other-ns</code>
          </div>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
          <p className="text-slate-400"># 查看 CoreDNS</p>
          <p><span className="text-green-400">kubectl get pods -n kube-system | grep coredns</span></p>
        </div>
      </div>
    ),
    notes: `好，Service 的四種類型學完了，現在來看 DNS 與服務發現。這個主題非常重要，因為在實際開發中，你幾乎不會用 ClusterIP 的 IP 位址來連 Service，而是用 DNS 域名。原因很簡單：IP 雖然比 Pod IP 穩定，但還是一串數字，而且跨環境（開發、測試、生產）IP 不一樣，用 DNS 名稱更通用。

Kubernetes 在安裝時就會自動部署一個 DNS 伺服器叫做 CoreDNS，它以 Pod 的形式跑在 kube-system 這個 Namespace 裡。你可以用 kubectl get pods -n kube-system 看到 coredns 的 Pod 正在運行。CoreDNS 的核心功能是：把 Service 名稱解析成 ClusterIP，讓叢集裡任何 Pod 都可以用名字來找到其他 Service，就像一般網際網路的 DNS 把域名解析成 IP 一樣。

每個 Service 在 CoreDNS 裡都被自動建立一條 DNS 記錄，完整格式如下：Service名稱.Namespace名稱.svc.cluster.local

讓我把這個格式拆開解釋：第一段是 Service 的名稱，也就是你 YAML 裡 metadata.name 的值；第二段是 Service 所在的 Namespace 名稱；第三段 svc 是固定的，代表這是一個 Service 資源的 DNS 記錄（區別於 Pod 的 DNS 記錄）；第四段 cluster.local 是這個 Kubernetes 叢集的域名後綴，大多數叢集預設是 cluster.local，但也可以自訂。

舉個具體例子：你在 production Namespace 裡建了一個叫做 backend-api 的 Service，它的完整 CoreDNS 記錄就是 backend-api.production.svc.cluster.local，解析出來就是這個 Service 的 ClusterIP。

當然，backend-api.production.svc.cluster.local 這個名字很長，不可能每次都手打這麼長的域名。CoreDNS 有搜尋域（search domain）的機制：叢集裡的 Pod，它的 /etc/resolv.conf 裡面設定了 search 搜尋域清單，同 Namespace 的域名、.svc.cluster.local 等都在這個清單裡。所以當你的程式碼寫 http://backend-api:8080，DNS 解析時會自動嘗試補全後綴：先試 backend-api.production.svc.cluster.local，如果解析成功就用這個 IP。

實際結果是：同 Namespace 的 Service 只需要寫 Service 名稱就夠了，DNS 自動補全。比如同在 production Namespace 的前端 Pod 連後端，寫 http://backend-api:8080 就可以。跨 Namespace 的話，最少要帶上目標 Namespace：http://backend-api.production，DNS 會幫你補全 .svc.cluster.local。

這個機制讓你的程式碼完全不依賴 IP，服務名稱就是連線地址，不管 Pod 怎麼重建、IP 怎麼變，程式碼不需要做任何修改。`,
  },

  // ========== 跨 Namespace 通訊 ==========
  {
    title: '跨 Namespace 服務發現',
    subtitle: '不同命名空間的服務如何通訊',
    section: 'DNS 與服務發現',
    duration: '15',
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">frontend Namespace</p>
            <div className="bg-slate-800 p-3 rounded font-mono text-xs">
              <p className="text-slate-400"># 連同 NS 的 Service</p>
              <p className="text-green-400">http://cart-svc:8080</p>
              <p className="text-slate-400 mt-2"># 連 backend NS 的 Service</p>
              <p className="text-yellow-400">http://api-svc.backend</p>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">backend Namespace</p>
            <div className="bg-slate-800 p-3 rounded font-mono text-xs">
              <p className="text-slate-400"># 連 database NS 的 Service</p>
              <p className="text-yellow-400">http://mysql-svc.database</p>
              <p className="text-slate-400 mt-2"># 完整格式</p>
              <p className="text-purple-400">mysql-svc.database.svc.cluster.local</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-400"># 在 Pod 內部測試 DNS 解析</p>
          <p><span className="text-green-400">kubectl run test --image=busybox -it --rm -- nslookup my-svc.default</span></p>
          <p className="text-slate-500 mt-2">Server:    10.96.0.10</p>
          <p className="text-slate-500">Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local</p>
          <p className="text-slate-500 mt-1">Name:      my-svc.default</p>
          <p className="text-slate-300">Address 1: 10.100.45.12 my-svc.default.svc.cluster.local</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ NetworkPolicy 預設允許跨 NS</p>
          <p className="text-slate-300">如果需要隔離，要設定 NetworkPolicy（稍後介紹）</p>
        </div>
      </div>
    ),
    notes: `我們來深入看跨 Namespace 的服務通訊，這在真實的多團隊、多環境 Kubernetes 架構中非常重要。

在實際的企業微服務架構中，我們通常用 Namespace 來做邏輯隔離和組織管理。常見的做法有幾種：按照應用層次分（frontend、backend、database）、按照環境分（dev、staging、production）、或者按照團隊分（team-payment、team-order、team-inventory）。這樣的好處是職責清晰、Resource Quota 可以分開設定、RBAC 權限也可以分開控制。

一旦你的服務分散在不同 Namespace，它們之間的通訊就需要跨 Namespace 存取。Kubernetes 預設允許所有跨 Namespace 的網路通訊，只要你知道正確的 DNS 名稱就能連到。

跨 Namespace 通訊的 DNS 格式規則如下。同 Namespace 內的服務互相連線，直接用 Service 名稱即可，比如 cart-svc 或者 http://cart-svc:8080，DNS 自動補全後綴。跨 Namespace 的連線，需要在 Service 名稱後面加上目標 Namespace，比如 frontend Namespace 裡的 Pod 要連 backend Namespace 裡的 api-svc，就寫 http://api-svc.backend 或者完整版 http://api-svc.backend.svc.cluster.local。兩種寫法都可以，短版依賴 DNS 搜尋域補全，完整版更明確不會出錯。

這裡有個實際工程師常用的技巧：在 Pod 裡面用 nslookup 或 dig 來驗證 DNS 解析是否正確。比如 kubectl run debug-pod --image=busybox -it --rm -- nslookup api-svc.backend，如果看到正確的 ClusterIP 被解析出來，代表 DNS 路徑正常。如果解析失敗（NXDOMAIN 或 timeout），通常有幾種可能：Service 名稱寫錯、Namespace 名稱寫錯、或者 CoreDNS 本身有問題。按這個順序排查，大部分問題都能找到。

讓我也提一個常見的坑：在 YAML 或程式碼裡寫跨 Namespace 的連線地址時，初學者常常忘記加 Namespace，結果 DNS 解析到同 Namespace 根本不存在的 Service，或者解析失敗。養成習慣：只要是跨 Namespace 的連線，一定帶上完整的 Service 名稱和 Namespace，或者直接用完整的 FQDN（Fully Qualified Domain Name）。

另外要特別強調的是：Kubernetes 預設的網路策略是「全部允許（allow-all）」，任何 Pod 都可以連到任何其他 Pod 或 Service，不管是不是同個 Namespace。這在開發環境很方便，但在生產環境是一個安全風險——你的前端 Pod 理論上可以直接連到資料庫的 Service，繞過後端 API。如果有攻擊者拿到了前端 Pod 的控制權，他就可以直接查資料庫。

解決這個問題的工具就是 NetworkPolicy，我們等一下會學到。NetworkPolicy 讓你定義白名單規則，明確指定哪些 Pod 可以連哪些 Service，其餘全部拒絕。

好，DNS 服務發現我們學完了。接下來是課程中場休息，15 分鐘後回來學 Ingress，下半場的重頭戲！`,
  },

  // ========== 休息 ==========
  {
    title: '☕ 休息時間',
    subtitle: '休息 15 分鐘',
    section: '中場休息',
    duration: '1',
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">稍微休息一下！</p>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">已完成</p>
            <p className="text-green-400">✓ Service 四種類型</p>
            <p className="text-green-400">✓ Endpoints 機制</p>
            <p className="text-green-400">✓ CoreDNS 服務發現</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">下半場</p>
            <p className="text-k8s-blue">🚪 Ingress 七層路由</p>
            <p className="text-k8s-blue">🛡️ NetworkPolicy 隔離</p>
            <p className="text-k8s-blue">🔨 完整實作</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們先休息 15 分鐘。趕快去倒杯水、上廁所、伸展一下身體。長時間坐著看螢幕很傷，動一動再回來。

上半場我們把 Service 從頭到尾學了一遍：四種類型的使用場景和適合的環境、Endpoints 的運作機制與除錯方法、CoreDNS 服務發現的 DNS 格式和搜尋域機制，以及跨 Namespace 的連線方式與預設全通的安全隱患。這些是 Kubernetes 網路架構的地基，搞懂了後面學 Ingress 和 NetworkPolicy 就更有感覺，知其然也知其所以然。

下半場的重頭戲是 Ingress——現在業界最主流的 HTTP 服務對外方式。之後是 NetworkPolicy 的網路隔離，最後是完整的組合實作，把 Deployment、Service、Ingress 全部串起來，完成一個從部署到對外的完整流程。

15 分鐘後準時回來，我們繼續！`,
  },

  // ========== Ingress 概念 ==========
  {
    title: 'Ingress：七層 HTTP 路由',
    subtitle: '用一個入口管理所有 HTTP 服務',
    section: 'Ingress',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-300 text-lg">
            Ingress 是 Kubernetes 的 <span className="text-k8s-blue font-bold">七層（HTTP/HTTPS）路由</span> 資源，
            根據 <span className="text-green-400">Host</span> 和 <span className="text-yellow-400">Path</span> 把請求分發到對應的 Service
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-center space-y-3">
            <div className="inline-block bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">外部請求</div>
            <div className="text-slate-500">↓</div>
            <div className="inline-block bg-purple-600 px-4 py-2 rounded-lg text-sm">
              Ingress Controller<br />
              <span className="text-xs text-purple-200">（實際執行路由的元件）</span>
            </div>
            <div className="flex justify-center gap-8 text-slate-500">
              <span>↙</span><span>↓</span><span>↘</span>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-green-700 px-3 py-2 rounded">api-svc</div>
              <div className="bg-green-700 px-3 py-2 rounded">web-svc</div>
              <div className="bg-green-700 px-3 py-2 rounded">admin-svc</div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold">按 Host 路由</p>
            <p className="text-slate-300">api.example.com → api-svc</p>
            <p className="text-slate-300">www.example.com → web-svc</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">按 Path 路由</p>
            <p className="text-slate-300">/api/* → api-svc</p>
            <p className="text-slate-300">/static/* → cdn-svc</p>
          </div>
        </div>
      </div>
    ),
    notes: `休息回來，精神好一點了嗎？我們進入下半場的重頭戲：Ingress。這個主題是現在業界最標準的 Kubernetes 服務對外方式，非常實用，學完直接可以用在工作上。

先讓我說一個背景問題，幫大家建立學習 Ingress 的動機。假設你的電商系統有十個微服務需要對外暴露：前台網站、後台管理、會員 API、商品 API、訂單 API、金流 API、物流 API、通知 API、搜尋 API、推薦 API。如果每個服務都建一個 LoadBalancer Service，你就要建立十個雲端 LB，每個 LB 每個月費用幾十美金，十個加起來一個月可能要好幾千塊台幣，而且每個服務有自己的 IP，DNS 管理也很麻煩。有沒有更好的做法？

Ingress 就是解決方案。Ingress 是 Kubernetes 裡專門處理 HTTP/HTTPS 七層路由的資源。核心思路是：只用一個對外的入口點（一個 LB 的 IP），然後根據 HTTP 請求的 Host 域名或 URL Path，把流量分發到不同的後端 Service。

比如這樣：api.example.com 的請求路由到 api-svc；www.example.com 的請求路由到 web-svc；admin.example.com 的請求路由到 admin-svc；www.example.com/api/v1 的請求路由到 api-v1-svc。所有服務共用同一個對外 IP 和 LB，背後的路由邏輯全部在 Ingress 規則裡定義，費用大幅降低，管理也更集中。

這裡有一個非常重要的概念必須搞清楚，很多初學者會搞混：Ingress 資源（YAML 檔）和 Ingress Controller（實際執行路由的程式）是兩個不同的東西，必須同時存在才能運作。

Ingress 資源只是一個「規則宣告」，你寫的 YAML 告訴 Kubernetes 你希望怎麼路由流量，但 Kubernetes 本身不會自動執行這些規則。真正執行路由的是 Ingress Controller——一個跑在叢集裡的程式，它持續監聽 Ingress 資源的變化，然後動態更新自己的路由設定。

最常用的 Ingress Controller 是 nginx-ingress，也就是把大家熟悉的 nginx 包裝成 Kubernetes Controller，用 nginx 的 upstream 和 server 設定來實現 Ingress 的路由規則。除了 nginx-ingress 之外，還有 Traefik、HAProxy Ingress、Contour（基於 Envoy）等，各有優劣，但 nginx-ingress 是最普及的，文件最完整，遇到問題也最容易找到解答。

所以用 Ingress 需要兩步：第一步，安裝 Ingress Controller；第二步，建立 Ingress 規則。我們接下來先安裝 Controller。`,
  },

  // ========== Ingress Controller 安裝 ==========
  {
    title: 'nginx-ingress Controller 安裝',
    subtitle: '讓 Ingress 規則真正生效',
    section: 'Ingress',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-2">
          <p className="text-slate-400"># 方法一：用 Helm 安裝（推薦）</p>
          <p><span className="text-green-400">helm repo add ingress-nginx \</span></p>
          <p><span className="text-green-400 ml-2">https://kubernetes.github.io/ingress-nginx</span></p>
          <p><span className="text-green-400">helm repo update</span></p>
          <p><span className="text-green-400">helm install ingress-nginx ingress-nginx/ingress-nginx \</span></p>
          <p><span className="text-green-400 ml-2">--namespace ingress-nginx --create-namespace</span></p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-400"># 方法二：直接套用官方 YAML</p>
          <p><span className="text-green-400">kubectl apply -f https://raw.githubusercontent.com/</span></p>
          <p><span className="text-green-400 ml-2">kubernetes/ingress-nginx/main/deploy/static/</span></p>
          <p><span className="text-green-400 ml-2">provider/cloud/deploy.yaml</span></p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p className="text-slate-400"># 確認安裝成功</p>
          <p><span className="text-green-400">kubectl get pods -n ingress-nginx</span></p>
          <p><span className="text-green-400">kubectl get svc -n ingress-nginx</span></p>
          <p className="text-slate-500 mt-1"># 看到 ingress-nginx-controller RUNNING 即成功</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ 本地環境注意</p>
          <p className="text-slate-300">LoadBalancer 可能沒有 EXTERNAL-IP，可改用 NodePort 模式或安裝 MetalLB</p>
        </div>
      </div>
    ),
    notes: `來，我們實際安裝 nginx-ingress Controller。這是業界最常用的 Ingress Controller，由 Kubernetes 官方社群維護，GitHub star 數超過一萬五，文件非常完整。

第一種方法是用 Helm 安裝，這是最推薦的方式。先讓我解釋一下 Helm 是什麼：Helm 是 Kubernetes 的套件管理工具，概念上類似 Linux 的 apt/yum 或者 Node.js 的 npm。你可以把複雜的一組 Kubernetes YAML 打包成一個「Chart」，設定好可調整的參數，然後一個指令就能安裝整套服務。很多 Kubernetes 生態的工具都有對應的 Helm Chart，比如 Prometheus、Grafana、cert-manager、ArgoCD 等等，所以早點學好 Helm 非常值得。

安裝步驟：先用 helm repo add 加入 ingress-nginx 的 Chart 倉庫，然後 helm repo update 更新本地快取，最後 helm install 安裝。我們把它裝到 ingress-nginx 這個獨立的 Namespace（--namespace ingress-nginx --create-namespace 會自動建立這個 Namespace）。

第二種方法是直接 kubectl apply 官方提供的 YAML 檔案。這個 YAML 檔案包含了所有需要的資源：Namespace、ServiceAccount、ClusterRole、ClusterRoleBinding、ConfigMap、Service、Deployment 等等，一個 apply 全部搞定。這個方法的缺點是版本升級比較麻煩，要手動管理 YAML 版本。

安裝完之後，用 kubectl get pods -n ingress-nginx 確認 Pod 狀態，應該會看到一個叫做 ingress-nginx-controller-xxxxx 的 Pod 在 Running。再用 kubectl get svc -n ingress-nginx 查看 Service，你會看到一個 ingress-nginx-controller 的 Service，type 是 LoadBalancer。

在雲端環境（EKS、GKE、AKS），這個 LoadBalancer Service 會自動取得一個公網 IP（EXTERNAL-IP 欄位），你把你的域名 DNS A 記錄指向這個 IP，所有流向這個 IP 的 HTTP/HTTPS 請求都會進入 nginx-ingress Controller，再根據你定義的 Ingress 規則路由到對應的 Service。

在本地環境，EXTERNAL-IP 會顯示 pending，因為沒有雲端的 LB 服務。解決方案有兩個：一是安裝 MetalLB，它可以從你指定的 IP 段分配一個本地 IP 給 LoadBalancer Service；二是把 Service 改成 NodePort 模式，然後用節點 IP + NodePort 來存取。我們的練習環境用後者，等一下實作我會示範。

Controller 安裝好之後，我們來看怎麼寫 Ingress 規則。`,
  },

  // ========== Ingress YAML 規則 ==========
  {
    title: 'Ingress YAML 規則詳解',
    subtitle: '定義路由規則',
    section: 'Ingress',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm space-y-1">
          <p><span className="text-yellow-400">apiVersion:</span> networking.k8s.io/v1</p>
          <p><span className="text-yellow-400">kind:</span> Ingress</p>
          <p><span className="text-yellow-400">metadata:</span></p>
          <p className="ml-4"><span className="text-cyan-400">name:</span> my-ingress</p>
          <p className="ml-4"><span className="text-cyan-400">annotations:</span></p>
          <p className="ml-8"><span className="text-slate-400">nginx.ingress.kubernetes.io/rewrite-target: /</span></p>
          <p><span className="text-yellow-400">spec:</span></p>
          <p className="ml-4"><span className="text-cyan-400">ingressClassName:</span> nginx</p>
          <p className="ml-4"><span className="text-cyan-400">rules:</span></p>
          <p className="ml-4"><span className="text-slate-400">- host: </span><span className="text-green-400">api.example.com</span></p>
          <p className="ml-8"><span className="text-cyan-400">http:</span></p>
          <p className="ml-10"><span className="text-cyan-400">paths:</span></p>
          <p className="ml-10"><span className="text-slate-400">- path: /</span></p>
          <p className="ml-12"><span className="text-slate-400">pathType: Prefix</span></p>
          <p className="ml-12"><span className="text-cyan-400">backend:</span></p>
          <p className="ml-14"><span className="text-cyan-400">service:</span></p>
          <p className="ml-16"><span className="text-green-400">name: api-svc</span></p>
          <p className="ml-16"><span className="text-green-400">port:</span></p>
          <p className="ml-18 pl-2"><span className="text-green-400">number: 80</span></p>
        </div>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">pathType</p>
            <p className="text-slate-300">Prefix: /api 匹配 /api/*</p>
            <p className="text-slate-300">Exact: 精確匹配</p>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">annotations</p>
            <p className="text-slate-300">nginx 特殊設定</p>
            <p className="text-slate-300">rewrite、timeout 等</p>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold">ingressClassName</p>
            <p className="text-slate-300">指定哪個 Ingress Controller 處理</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，Controller 裝好了，來看 Ingress 的 YAML 規則怎麼寫。這個 YAML 我建議大家邊聽邊跟著自己敲一遍，記憶效果會好很多。

先看 apiVersion：networking.k8s.io/v1，這是 Kubernetes 1.19 以後才正式穩定（GA）的版本。如果你看到舊文章或教程用的是 extensions/v1beta1 或 networking.k8s.io/v1beta1，那是舊版寫法，Kubernetes 1.22 之後已經完全移除，現在一律用 networking.k8s.io/v1。如果你複製舊 YAML 遇到問題，先檢查 apiVersion 有沒有過時。

metadata 裡有一個很重要的欄位：annotations。Ingress 本身的 spec 欄位只定義標準的路由規則，但 nginx-ingress 有很多額外的進階功能，是透過 annotation 來設定的。這些 annotation 的格式是 nginx.ingress.kubernetes.io/設定名稱: 值。

常用的 annotation 有：nginx.ingress.kubernetes.io/rewrite-target 用來重寫 URL，比如把 /api/v1/users 重寫成 /users 再轉發給後端（當你的後端 API 不包含路由前綴時很有用）；nginx.ingress.kubernetes.io/proxy-body-size 設定允許上傳的最大 body 大小，預設 1m，如果有檔案上傳功能要設大一點；nginx.ingress.kubernetes.io/proxy-read-timeout 設定 nginx 等待後端回應的逾時秒數；nginx.ingress.kubernetes.io/ssl-redirect 設定是否自動把 HTTP 導向 HTTPS。不同的 Ingress Controller 有不同的 annotation 集合，要用 nginx-ingress 的功能就查 nginx-ingress 的官方文件。

spec 裡面的重點欄位：ingressClassName 指定這個 Ingress 資源要由哪個 Ingress Controller 來處理，值要和你安裝 Controller 時的名稱一致。如果你叢集裡裝了多個 Ingress Controller（比如一個 nginx 和一個 Traefik），就需要這個欄位來區分哪些 Ingress 規則給哪個 Controller 處理。

rules 是路由規則的清單，可以有很多條規則。每條規則可以指定 host（域名），比如 api.example.com。如果不指定 host，這條規則適用進來的所有域名，是一個 catch-all 規則。

每個 host 下面有 http.paths，就是這個域名下的路徑路由規則。path 是 URL 路徑的匹配模式，pathType 指定匹配方式：Prefix 是前綴匹配，比如 path: /api 會匹配所有 /api/xxx 的請求；Exact 是精確匹配，路徑必須完全一樣才匹配；ImplementationSpecific 是由 Controller 自己決定匹配語義，各 Controller 行為可能不同，通常不推薦用。

backend 指定匹配成功後要把流量轉發到哪個 Service 的哪個 port。一個 Ingress 資源可以定義很多條規則，不同 host 和 path 分別路由到不同 Service，全部由同一個 nginx Controller 處理，這就是 Ingress 節省 LB 費用的方式。`,
  },

  // ========== TLS/HTTPS ==========
  {
    title: 'Ingress TLS/HTTPS',
    subtitle: '加密你的 HTTP 流量',
    section: 'Ingress',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-slate-300 font-semibold">Step 1：建立 TLS Secret</p>
            <div className="bg-slate-800 p-3 rounded-lg font-mono text-xs space-y-1">
              <p className="text-slate-400"># 從憑證檔案建立 Secret</p>
              <p className="text-green-400">kubectl create secret tls my-tls-secret \</p>
              <p className="text-green-400 ml-2">--cert=tls.crt \</p>
              <p className="text-green-400 ml-2">--key=tls.key</p>
              <p className="text-slate-400 mt-2"># 或用 cert-manager 自動申請</p>
              <p className="text-green-400"># Let's Encrypt 免費憑證</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-slate-300 font-semibold">Step 2：Ingress 加入 tls 設定</p>
            <div className="bg-slate-800 p-3 rounded-lg font-mono text-xs space-y-1">
              <p><span className="text-cyan-400">spec:</span></p>
              <p className="ml-2"><span className="text-yellow-400">tls:</span></p>
              <p className="ml-4"><span className="text-slate-400">- hosts:</span></p>
              <p className="ml-8"><span className="text-green-400">- api.example.com</span></p>
              <p className="ml-6"><span className="text-slate-400">secretName: </span><span className="text-purple-400">my-tls-secret</span></p>
              <p className="ml-2"><span className="text-yellow-400">rules:</span></p>
              <p className="ml-4"><span className="text-slate-400">- host: api.example.com</span></p>
              <p className="ml-6"><span className="text-slate-400">  ...</span></p>
            </div>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🔐 cert-manager 自動化 TLS</p>
          <p className="text-slate-300 text-sm mt-1">
            生產環境推薦安裝 cert-manager，自動向 Let's Encrypt 申請並更新免費 TLS 憑證，
            只需在 Ingress 加上 <code className="text-green-400">cert-manager.io/cluster-issuer: letsencrypt</code> annotation
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg font-mono text-sm">
          <p className="text-slate-400"># nginx 自動 HTTP → HTTPS 轉向</p>
          <p className="text-green-400">nginx.ingress.kubernetes.io/ssl-redirect: "true"</p>
        </div>
      </div>
    ),
    notes: `有了 HTTP 路由之後，HTTPS 加密是生產環境的必備需求。沒有 HTTPS 的網站，現代瀏覽器會顯示「不安全」警告，對使用者體驗和信任度影響很大，更別說安全性了。讓我們看怎麼在 Ingress 上設定 TLS。

TLS 的完整名稱是 Transport Layer Security，它是 HTTPS 的基礎協議，用來加密客戶端和伺服器之間的通訊，防止中間人攻擊和資料竊聽。在 Ingress 上設定 TLS，nginx-ingress Controller 會在 443 port 進行 SSL/TLS 握手，解密後再把明文請求轉發給後端 Service（這叫做 SSL termination，TLS 終止在 nginx 層，後端可以跑 HTTP）。

設定 TLS 需要兩步：

第一步，建立 TLS Secret。TLS 需要兩個檔案：憑證（tls.crt，包含公鑰和 CA 簽名）和私鑰（tls.key）。Kubernetes 的 Secret 資源可以安全地儲存這些敏感資料，Secret type 設為 kubernetes.io/tls 就是 TLS Secret。用 kubectl create secret tls 指令可以直接把憑證和私鑰檔案封裝成 Secret，存到 Kubernetes 的 etcd 裡（有加密，比放在硬碟上安全）。

第二步，在 Ingress spec 加上 tls 欄位，指定哪些 host 要啟用 HTTPS，以及使用哪個 TLS Secret。這樣 nginx-ingress Controller 就會去讀這個 Secret 裡的憑證，設定 nginx 的 SSL 配置，讓這些域名的 443 port 提供加密的 HTTPS 服務。

關於憑證怎麼取得，有幾種選項：開發環境可以用 openssl 自己產生自簽憑證，雖然瀏覽器會顯示「您的連線不是私人連線」的警告（因為是自簽的 CA 不在系統信任清單），但功能上完全正常，適合本地測試。付費選項有 DigiCert、Comodo、Sectigo 等，提供商業等級的 TLS 憑證，有 EV 憑證（綠色地址欄）等高級選項，但費用較高。

生產環境強烈推薦使用 Let's Encrypt 搭配 cert-manager。Let's Encrypt 是一個非營利的憑證頒發機構（CA），提供完全免費的 DV（Domain Validated）TLS 憑證，被所有主流瀏覽器信任。cert-manager 是 Kubernetes 上的憑證管理工具，可以自動向 Let's Encrypt 申請憑證、建立 TLS Secret、並且在憑證即將到期前（Let's Encrypt 憑證有效期 90 天）自動更新。有了 cert-manager，你的憑證管理完全自動化，再也不用擔心憑證過期忘記更新（之前在傳統架構每年都要手動更新一次，常常忘記，造成網站 HTTPS 失效的事故）。

安裝 cert-manager 之後，建立 ClusterIssuer 資源來設定 Let's Encrypt 的 API 端點，然後只需要在 Ingress 的 annotation 加一行 cert-manager.io/cluster-issuer: letsencrypt，cert-manager 就會全自動幫你申請憑證、建立 TLS Secret、設定 Ingress。

最後，幾乎所有生產環境都會加上自動 HTTP 轉 HTTPS 的設定：annotation 裡加 nginx.ingress.kubernetes.io/ssl-redirect: "true"，nginx 就會把所有 80 port 的 HTTP 請求自動 302 重導向到 443 port 的 HTTPS，確保使用者一定走加密連線，不會有人不小心用 HTTP 傳送密碼。`,
  },

  // ========== NetworkPolicy 概念 ==========
  {
    title: 'NetworkPolicy：網路隔離',
    subtitle: '從預設允許到白名單管控',
    section: 'NetworkPolicy',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-red-400 font-semibold">❌ 預設情況（無 NetworkPolicy）</p>
            <p className="text-slate-300 text-sm mt-2">所有 Pod 可以互相通訊，跨 Namespace 也可以。就像一個沒有任何防火牆的網路。</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-semibold">✓ 有 NetworkPolicy</p>
            <p className="text-slate-300 text-sm mt-2">套用 NetworkPolicy 的 Pod 只允許規則中明確允許的流量，其餘全部拒絕。</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="font-semibold text-k8s-blue mb-3">NetworkPolicy 的關鍵概念</p>
          <div className="space-y-2 text-sm">
            {[
              { key: 'podSelector', desc: '這個 Policy 套用到哪些 Pod（用 Label 選取）' },
              { key: 'ingress 規則', desc: '允許哪些「進入」流量（from）' },
              { key: 'egress 規則', desc: '允許哪些「流出」流量（to）' },
              { key: 'policyTypes', desc: '指定 Policy 控制 Ingress/Egress 或兩者都管' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-700/50 p-2 rounded">
                <code className="text-green-400 w-32 flex-shrink-0">{item.key}</code>
                <span className="text-slate-300">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ 需要 CNI 支援</p>
          <p className="text-slate-300">Calico、Cilium、Weave 等 CNI 才支援 NetworkPolicy；Flannel 預設不支援</p>
        </div>
      </div>
    ),
    notes: `學完了如何暴露服務，現在來學如何保護服務：NetworkPolicy。這個主題在資安意識越來越高的今天，在生產環境部署中是不可缺少的一環。

讓我先用一個真實案例說明為什麼需要 NetworkPolicy。2017 年，Tesla 的 Kubernetes 叢集被駭客入侵，因為叢集沒有足夠的存取控制，駭客透過一個公開的 Kubernetes Dashboard 進入叢集，然後橫向移動，找到了 AWS 的 IAM 憑證，最終用來挖礦。這個案例的問題之一就是叢集內部網路完全沒有隔離，攻擊者進入後可以任意連接任何服務。如果有 NetworkPolicy，橫向移動會困難得多。

Kubernetes 預設情況下，叢集裡所有的 Pod 都可以互相通訊，不管是不是同個 Namespace，也不管服務類型。從安全角度看，這就是一個「扁平網路」——就像一個辦公室裡所有人都可以走進任何一個辦公室、打開任何一個文件夾。如果某個 Pod 被攻擊者控制，他就可以用這個 Pod 對叢集裡的所有其他 Pod 和 Service 發動攻擊，把叢集當成跳板繼續往裡面挖。

NetworkPolicy 就是 Kubernetes 的網路防火牆。它讓你可以定義精確的存取規則：哪些 Pod 可以連到哪些 Pod、允許哪些 Port 的流量、允許哪些 IP 範圍的外部流量。

最核心的設計哲學是：NetworkPolicy 採用白名單機制。一旦你對某個 Pod 套用了任何 NetworkPolicy，這個 Pod 預設就進入「拒絕所有」的狀態，只有在 NetworkPolicy 規則裡明確允許的流量才能通過。這和傳統防火牆的預設行為一樣，安全性很高。

NetworkPolicy 有幾個核心概念必須搞清楚：podSelector 決定這個 Policy 管的是哪些 Pod，用 Label 選取，空的 podSelector 代表選取 Namespace 裡所有 Pod。policyTypes 指定這個 Policy 管入站（Ingress）、出站（Egress）還是兩者都管，不指定就預設只管 Ingress。ingress 欄位定義允許哪些「進入」流量，from 可以指定來源是哪些 Pod（用 podSelector）、哪些 Namespace（用 namespaceSelector），或者哪些 IP 範圍（用 ipBlock）。egress 欄位定義允許哪些「流出」流量，to 同樣可以指定目的地 Pod、Namespace、或 IP 範圍。

最後一個很重要的注意事項：NetworkPolicy 需要 CNI（Container Network Interface）支援才能生效。Calico 和 Cilium 都支援 NetworkPolicy；Flannel 預設不支援（需要搭配 Calico 的 Canal 模式）。如果你的叢集 CNI 不支援，NetworkPolicy 雖然可以建立，但完全不起作用，這非常危險，讓你以為有保護但實際上沒有。所以在開始設定 NetworkPolicy 之前，先確認你的 CNI 支援。`,
  },

  // ========== NetworkPolicy YAML ==========
  {
    title: 'NetworkPolicy YAML 實例',
    subtitle: 'podSelector、ingress/egress 規則寫法',
    section: 'NetworkPolicy',
    duration: '10',
    content: (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-slate-300 font-semibold text-sm">只允許 frontend 連 backend API</p>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-xs space-y-0.5">
            <p><span className="text-yellow-400">apiVersion:</span> networking.k8s.io/v1</p>
            <p><span className="text-yellow-400">kind:</span> NetworkPolicy</p>
            <p><span className="text-yellow-400">metadata:</span></p>
            <p className="ml-2"><span className="text-cyan-400">name:</span> allow-frontend-only</p>
            <p className="ml-2"><span className="text-cyan-400">namespace:</span> backend</p>
            <p><span className="text-yellow-400">spec:</span></p>
            <p className="ml-2"><span className="text-cyan-400">podSelector:</span></p>
            <p className="ml-4"><span className="text-cyan-400">matchLabels:</span></p>
            <p className="ml-6"><span className="text-green-400">app: api</span></p>
            <p className="ml-2"><span className="text-cyan-400">policyTypes:</span></p>
            <p className="ml-4"><span className="text-slate-400">- Ingress</span></p>
            <p className="ml-2"><span className="text-cyan-400">ingress:</span></p>
            <p className="ml-4"><span className="text-slate-400">- from:</span></p>
            <p className="ml-8"><span className="text-slate-400">- namespaceSelector:</span></p>
            <p className="ml-12"><span className="text-cyan-400">matchLabels:</span></p>
            <p className="ml-14"><span className="text-green-400">name: frontend</span></p>
            <p className="ml-10"><span className="text-cyan-400">podSelector:</span></p>
            <p className="ml-12"><span className="text-cyan-400">matchLabels:</span></p>
            <p className="ml-14"><span className="text-green-400">role: web</span></p>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-slate-300 font-semibold text-sm">拒絕所有進入流量（預設拒絕模板）</p>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-xs space-y-0.5">
            <p><span className="text-yellow-400">spec:</span></p>
            <p className="ml-2"><span className="text-cyan-400">podSelector:</span> <span className="text-slate-500">{'{}'}</span></p>
            <p className="ml-2"><span className="text-slate-500"># 選取所有 Pod</span></p>
            <p className="ml-2"><span className="text-cyan-400">policyTypes:</span></p>
            <p className="ml-4"><span className="text-slate-400">- Ingress</span></p>
            <p className="ml-2"><span className="text-slate-500"># 沒有 ingress 規則 = 拒絕全部</span></p>
          </div>
          <p className="text-slate-300 font-semibold text-sm mt-4">允許 egress 到 DNS（port 53）</p>
          <div className="bg-slate-800 p-3 rounded-lg font-mono text-xs space-y-0.5">
            <p><span className="text-cyan-400">egress:</span></p>
            <p className="ml-2"><span className="text-slate-400">- ports:</span></p>
            <p className="ml-6"><span className="text-slate-400">- protocol: UDP</span></p>
            <p className="ml-8"><span className="text-slate-400">port: 53</span></p>
            <p className="ml-4"><span className="text-slate-400">- protocol: TCP</span></p>
            <p className="ml-8"><span className="text-slate-400">port: 53</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `來看幾個實際的 NetworkPolicy YAML 範例，結合場景來理解每一種寫法的用途和細節。

第一個範例是生產環境最常見的場景：只允許 frontend Namespace 裡有 role: web 這個 Label 的 Pod 連進來 backend Namespace 裡的 api Pod，其他任何來源都拒絕。

拆開分析這個 YAML：spec.podSelector.matchLabels 選取 app: api 的 Pod，這些就是要被保護的目標 Pod。policyTypes 只有 Ingress，代表這個 Policy 只管進入這些 Pod 的流量，不管它們發出去的流量。ingress 規則的 from 陣列裡，有一個項目同時包含了 namespaceSelector 和 podSelector，這兩個在同一個 list item 裡就是 AND 關係，必須同時滿足才算匹配：必須來自帶有 name: frontend 這個 Label 的 Namespace，而且發起連線的 Pod 要有 role: web 這個 Label。這樣就精確限制了只有特定 Namespace 裡的特定 Pod 可以連進來。

這裡有個常見的坑要注意：namespaceSelector 是根據 Namespace 的 Label 來選取的，不是根據 Namespace 的名字！所以你需要先給你的 Namespace 加上 Label，比如 kubectl label namespace frontend name=frontend，才能用 namespaceSelector matchLabels name: frontend 選到它。Kubernetes 1.21 之後，每個 Namespace 會自動帶一個 kubernetes.io/metadata.name 的 Label，值就是 Namespace 的名稱，就不需要手動加了，直接用 kubernetes.io/metadata.name: frontend 來選。

還有一個重要的語法陷阱：from 陣列裡如果是兩個獨立的 list item，就是 OR 關係；在同一個 list item 裡同時有 namespaceSelector 和 podSelector，就是 AND 關係。這個差異在 YAML 縮排上只差一個 "-"，但語義完全不同，寫 NetworkPolicy 時要特別小心這個。

第二個範例是「拒絕所有進入流量」的安全加固模板。podSelector 是空的（{}），代表選取這個 Namespace 裡的所有 Pod；policyTypes 只有 Ingress；但是沒有 ingress 規則。空的 ingress 規則 = 不允許任何進入流量。這是安全加固的起手式，先全部鎖死，再用其他更細粒度的 NetworkPolicy 逐一開放需要的通訊路徑，採用最小權限原則。

第三個範例是 egress 到 DNS 的放行規則，這個很多人忘記，然後被自己鎖死。如果你鎖了某個 Namespace 的 egress（出站流量），Pod 連 DNS 查詢都做不了，因為 CoreDNS 在 kube-system Namespace，port 53 的流量也被你鎖了。DNS 一掛，這些 Pod 什麼 Service 都連不到，因為域名解析不了。解決方法是：在你的 default-deny egress 策略之外，加一條允許到 port 53（UDP 和 TCP 都要允許）的 egress 規則，讓 DNS 查詢可以出去。

把這三個模板記起來：精確允許特定來源、預設拒絕、以及 DNS 放行。這套組合是 Kubernetes 安全加固的標準做法。`,
  },

  // ========== 實作：完整對外服務 ==========
  {
    title: '🔨 實作：完整對外服務',
    subtitle: 'Deployment + Service + Ingress 三合一',
    section: '實作',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {[
            { step: '1', icon: '📦', title: 'Deployment', desc: '部署 nginx 應用' },
            { step: '2', icon: '🔌', title: 'ClusterIP Service', desc: '叢集內部連線' },
            { step: '3', icon: '🚪', title: 'Ingress', desc: 'HTTP 路由對外' },
          ].map((item) => (
            <div key={item.step} className="bg-slate-800/50 p-3 rounded-lg">
              <div className="w-8 h-8 bg-k8s-blue rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">{item.step}</div>
              <span className="text-2xl">{item.icon}</span>
              <p className="font-semibold text-k8s-blue mt-1">{item.title}</p>
              <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-xs space-y-0.5">
          <p className="text-slate-400"># 一口氣 apply 整份 YAML（用 --- 分隔多個資源）</p>
          <p><span className="text-green-400">kubectl apply -f full-stack-app.yaml</span></p>
          <p className="text-slate-400 mt-2"># 確認所有資源</p>
          <p><span className="text-green-400">kubectl get deploy,svc,ingress</span></p>
          <p className="text-slate-400 mt-2"># 測試（如果是 NodePort Controller）</p>
          <p><span className="text-green-400">curl http://&lt;NODE_IP&gt;:&lt;NODEPORT&gt; -H "Host: demo.example.com"</span></p>
          <p className="text-slate-400 mt-2"># 或修改 /etc/hosts 後直接 curl</p>
          <p><span className="text-green-400">echo "&lt;NODE_IP&gt; demo.example.com" | sudo tee -a /etc/hosts</span></p>
          <p><span className="text-green-400">curl http://demo.example.com</span></p>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">📁 lab 檔案</p>
          <p className="text-slate-300">lab/lesson5-afternoon/full-stack-app.yaml</p>
        </div>
      </div>
    ),
    notes: `好，現在進入今天下午最重要的實作環節。我們要把 Deployment、Service、Ingress 這三個資源組合在一起，完成一個完整的對外服務部署。這個三合一組合是 Kubernetes 上 HTTP 服務的標準部署模式，幾乎在所有真實的 K8s 專案裡都會用到。

請打開 lab/lesson5-afternoon/full-stack-app.yaml，這個檔案裡用 --- 分隔符，包含了三個 Kubernetes 資源的定義，一個 YAML 檔案搞定整個部署。

第一個資源是 Deployment，部署一個三副本的 nginx 應用。replicas: 3 代表三個 Pod 副本，每個 Pod 有 app: demo-web 這個 Label，這個 Label 非常重要，Service 和 Ingress 都靠它來找到這些 Pod。容器跑的是 nginx:alpine，監聽 80 port。

第二個資源是 ClusterIP Service，用 selector: app: demo-web 把符合條件的 Pod（也就是上面的三個 nginx Pod）加入後端清單。Service 的 port 是 80，targetPort 也是 80。這個 Service 不對外暴露，只有叢集內部可以存取，包括 Ingress Controller。

第三個資源是 Ingress，把 demo.example.com 這個域名的所有路徑（path: /, pathType: Prefix）路由到上面這個 ClusterIP Service 的 80 port。ingressClassName: nginx 指定用我們安裝的 nginx-ingress Controller 來處理。

實作步驟：第一步，kubectl apply -f full-stack-app.yaml，一次 apply 三個資源。第二步，kubectl get deploy,svc,ingress 確認三個資源都建立成功，Deployment 的 READY 要顯示 3/3，Ingress 要有 ADDRESS（如果是 NodePort 模式可能沒有，沒關係）。第三步，kubectl get pods 確認三個 Pod 都是 Running 狀態。

測試方式：在 NodePort 模式下，nginx-ingress Controller 的 Service 是 NodePort，先用 kubectl get svc -n ingress-nginx 找到 NodePort 的埠號（80 對應的那個，大概是 3xxxx）。然後有兩種測試方式：

方式一，用 curl 帶 Host header：curl http://任意節點IP:NodePort -H "Host: demo.example.com"，這個方式不需要改 /etc/hosts，nginx 根據 Host header 來做路由，所以帶正確的 Host header 即可。

方式二，修改本機的 /etc/hosts（Linux/Mac 在 /etc/hosts，Windows 在 C:\Windows\System32\drivers\etc\hosts），加一行 節點IP demo.example.com，然後直接 curl http://demo.example.com 或用瀏覽器打開，就像真實域名一樣完全正常的流程。

操作過程中如果遇到問題，排查步驟：kubectl describe ingress my-ingress 看 Ingress 的 Events 欄位，有問題通常在這裡有提示；kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller 看 Controller 的日誌，每個請求和路由結果都有記錄；kubectl get endpoints demo-web-svc 看後端 Pod 有沒有正確加入 Endpoints。

（讓大家開始實作，巡視並幫助同學解決問題，預留約 15 分鐘的操作時間）`,
  },

  // ========== 實作：加入 NetworkPolicy ==========
  {
    title: '🔨 實作：加入網路隔離',
    subtitle: '限制資料庫只能被 API 存取',
    section: '實作',
    duration: '20',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">為 demo-web 加入 NetworkPolicy，只允許來自 Ingress Controller 的流量</p>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-xs space-y-0.5">
          <p><span className="text-yellow-400">apiVersion:</span> networking.k8s.io/v1</p>
          <p><span className="text-yellow-400">kind:</span> NetworkPolicy</p>
          <p><span className="text-yellow-400">metadata:</span></p>
          <p className="ml-2"><span className="text-cyan-400">name:</span> allow-ingress-controller</p>
          <p><span className="text-yellow-400">spec:</span></p>
          <p className="ml-2"><span className="text-cyan-400">podSelector:</span></p>
          <p className="ml-4"><span className="text-cyan-400">matchLabels:</span></p>
          <p className="ml-6"><span className="text-green-400">app: demo-web</span></p>
          <p className="ml-2"><span className="text-cyan-400">policyTypes:</span></p>
          <p className="ml-4"><span className="text-slate-400">- Ingress</span></p>
          <p className="ml-2"><span className="text-cyan-400">ingress:</span></p>
          <p className="ml-4"><span className="text-slate-400">- from:</span></p>
          <p className="ml-8"><span className="text-slate-400">- namespaceSelector:</span></p>
          <p className="ml-12"><span className="text-cyan-400">matchLabels:</span></p>
          <p className="ml-14"><span className="text-green-400">kubernetes.io/metadata.name: ingress-nginx</span></p>
          <p className="ml-4"><span className="text-cyan-400">ports:</span></p>
          <p className="ml-6"><span className="text-slate-400">- protocol: TCP</span></p>
          <p className="ml-8"><span className="text-slate-400">port: 80</span></p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-400 mb-1">套用 Policy</p>
            <code className="text-green-400 text-xs">kubectl apply -f netpol.yaml</code>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-400 mb-1">驗證：從其他 Pod 連看看</p>
            <code className="text-green-400 text-xs">kubectl run test --image=busybox -it --rm -- wget demo-web-svc</code>
          </div>
        </div>
      </div>
    ),
    notes: `繼續實作，這個部分是今天最有挑戰性、也最貼近真實生產環境安全需求的練習。我們要在剛才完成的 Deployment + Service + Ingress 基礎上，加入 NetworkPolicy 來限制進入 demo-web Pod 的流量。

先說清楚這個 NetworkPolicy 要達成的安全目標：demo-web 這些 Pod 只能接受來自 ingress-nginx Namespace 的流量（也就是 Ingress Controller Pod）。叢集裡的其他任何 Pod，不管是哪個 Namespace，都不能直接連進來。

為什麼要這樣設定？因為在正確的架構裡，外部流量的路徑應該是：外部請求 → Ingress Controller Pod（nginx-ingress Namespace） → Service → demo-web Pod。Ingress Controller 是流量的唯一合法入口，它根據 Ingress 規則決定請求要路由到哪個 Service。如果叢集裡有其他 Pod 可以繞過 Ingress，直接連 demo-web-svc，那 Ingress 的流量控制和 TLS 終止就形同虛設。設定 NetworkPolicy 確保只有 Ingress Controller 可以進來，強制所有流量都走正確的路徑。

YAML 重點解析：podSelector 選 app: demo-web 的 Pod，也就是我們要保護的對象。policyTypes 只設 Ingress，因為我們現在只限制進入流量，不限制 Pod 發出去的流量。ingress.from 裡用 namespaceSelector 選 kubernetes.io/metadata.name: ingress-nginx 的 Namespace，這是 Kubernetes 1.21 之後每個 Namespace 自動帶的 Label（值就是 Namespace 名稱），不需要手動加 Label，非常方便。ports 限制只允許 TCP 80 port 的流量進來，其他 port 都拒絕。

實作步驟：第一步，kubectl apply -f netpol.yaml 套用 NetworkPolicy。第二步，驗證 NetworkPolicy 效果——這是最重要的，因為很多 CNI 不支援 NetworkPolicy，套用了也沒效果，要確認。用 kubectl run test --image=busybox -it --rm -- wget -T 5 http://demo-web-svc，如果 NetworkPolicy 生效，這個 wget 應該會超時（timeout）或者被 reset，因為 test Pod 在 default Namespace，不是 ingress-nginx，不在允許清單裡。如果 wget 成功，代表 NetworkPolicy 沒有效果，要檢查 CNI 是否支援。

第三步，確認正常流量還是通的——透過 Ingress Controller 的存取（curl 帶 Host header）應該還是正常的，因為 Ingress Controller 的 Pod 在 ingress-nginx Namespace，在 NetworkPolicy 的允許清單裡。如果這條路也不通，代表 NetworkPolicy 有問題，要排查。

常見問題排查：如果 test Pod 的 wget 成功了（NetworkPolicy 沒效），先 kubectl get pods -n kube-system 確認 CNI 是什麼，Flannel 預設不支援；如果 Ingress 的路由失敗了，kubectl describe networkpolicy allow-ingress-controller 看 Policy 的細節，確認 namespaceSelector 的 Label 名稱是否正確。

進階挑戰（給完成的同學）：試著再加一條 NetworkPolicy，限制 demo-web Pod 的 egress，只允許它連到 DNS（port 53）和 mysql-svc（port 3306），其他 egress 全部拒絕。這模擬了生產環境裡對應用程式出站流量的嚴格控制。

（讓大家自己操作 15-20 分鐘，助教巡視協助。這個實作有一定難度，鼓勵大家多嘗試，遇到問題正常，排查問題的過程本身就是學習）`,
  },

  // ========== 課程總結 ==========
  {
    title: '課程總結',
    subtitle: '今天學了什麼？',
    section: '總結',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: 'Service 四種類型',
              color: 'blue',
              items: ['ClusterIP：叢集內部通訊', 'NodePort：開發測試對外', 'LoadBalancer：雲端生產環境', 'ExternalName：對接外部服務'],
            },
            {
              title: 'DNS 服務發現',
              color: 'green',
              items: ['CoreDNS：叢集內建 DNS', 'svc.namespace.svc.cluster.local', '同 NS 直接用名稱', '跨 NS 加上 Namespace'],
            },
            {
              title: 'Ingress',
              color: 'purple',
              items: ['七層 HTTP/HTTPS 路由', 'nginx-ingress Controller', 'Host/Path 路由規則', 'TLS/HTTPS 憑證管理'],
            },
            {
              title: 'NetworkPolicy',
              color: 'orange',
              items: ['預設允許 → 白名單模式', 'podSelector 選取目標', 'ingress/egress 規則', '需要 CNI 支援（Calico/Cilium）'],
            },
          ].map((section, i) => (
            <div
              key={i}
              className={`bg-\${section.color}-900/30 border border-\${section.color}-700 p-4 rounded-lg`}
            >
              <p className={`text-\${section.color}-400 font-semibold mb-2`}>{section.title}</p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className={`text-\${section.color}-400 mt-0.5`}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">🎯 核心概念</p>
          <p className="text-slate-300 mt-1">
            Deployment 管理應用運行，Service 提供穩定存取入口，Ingress 做 HTTP 七層路由，NetworkPolicy 加強安全隔離。四者組合，構成完整的 Kubernetes 服務發布體系。
          </p>
        </div>
      </div>
    ),
    notes: `好，今天下午的內容非常豐富，從 Service 到 DNS 到 Ingress 到 NetworkPolicy，涵蓋了 Kubernetes 網路的全貌。讓我用一個完整的故事把今天學到的全部串起來，幫大家做一個有脈絡的總結。

想像你要在 Kubernetes 上部署一個電商系統，從零開始，把今天學的工具一個一個用起來。

首先，你部署了三個微服務：前端 Web、後端 API、MySQL 資料庫，每個都是一個 Deployment。然後你要讓這些服務可以互相通訊，同時對外提供服務。

第一步，內部服務連線——用 ClusterIP Service。前端 Pod 要連後端 API，建一個 api-service（ClusterIP），selector 選後端 Pod。後端 API 要連 MySQL，建一個 mysql-service（ClusterIP），selector 選 MySQL Pod。ClusterIP 只在叢集內部，外部進不來，安全。這是 Service 四種類型裡最常用的一種。

第二步，服務之間互相用名字連——CoreDNS 負責。前端程式碼裡寫 http://api-service:8080，DNS 自動解析成 ClusterIP。後端寫 mysql://mysql-service:3306，同樣自動解析。完全不需要記 IP，Pod 重建 IP 改了也沒關係。跨 Namespace 的話加 Namespace：http://api-service.backend.svc.cluster.local。

第三步，對外服務——用 Ingress。你不想為前端和後端分別建 LoadBalancer Service（費用高），所以裝了 nginx-ingress Controller，然後建一個 Ingress 規則：www.myshop.com → frontend-svc，api.myshop.com → api-svc。一個 LB IP 搞定兩個對外服務。再加上 TLS 設定，搭配 cert-manager 自動申請 Let's Encrypt 憑證，https://www.myshop.com 就這樣完成了。

第四步，安全隔離——NetworkPolicy 上場。建一個 NetworkPolicy，限制 MySQL Pod 只接受來自後端 API Pod 的連線。這樣前端 Pod 即使知道 mysql-service 的名稱，直接連也會被拒絕，只有後端 API 可以操作資料庫。再建一個 NetworkPolicy 限制後端 API Pod 只接受來自 Ingress Controller 的流量，確保所有外部流量都走正確的入口。

這就是一個完整的、安全的 Kubernetes 服務架構：Deployment 管理運行 → ClusterIP Service 提供穩定入口 → CoreDNS 讓服務用名字通訊 → Ingress 做 HTTP 七層路由對外 → NetworkPolicy 加固安全隔離。每個工具各司其職，組合在一起就是業界標準的生產環境架構。

今天學到的每一個概念在真實工作中都會用到。明天我們繼續往前，學習 PersistentVolume 讓 Kubernetes 管理有狀態的資料儲存，以及 Helm 套件管理讓我們可以更方便地部署複雜的應用。大家今天表現非常好，回去好好複習今天的筆記和實作，有問題歡迎在群組提問！`,
  },

  // ========== Q&A ==========
  {
    title: 'Q & A',
    subtitle: '有任何問題嗎？',
    section: 'Q&A',
    duration: '10',
    content: (
      <div className="space-y-6">
        <div className="text-center text-6xl">🙋</div>
        <div className="grid gap-4">
          {[
            { q: 'ClusterIP 和 NodePort 怎麼選？', a: '開發/測試用 NodePort，生產環境 ClusterIP + Ingress' },
            { q: 'Ingress 和 LoadBalancer Service 有什麼差別？', a: 'LB Service 是四層（TCP/UDP），Ingress 是七層（HTTP），可以做 Host/Path 路由' },
            { q: 'NetworkPolicy 沒效怎麼排查？', a: '先確認 CNI 支援，再 kubectl describe netpol 確認 selector 是否正確' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-k8s-blue font-semibold">Q: {item.q}</p>
              <p className="text-slate-300 text-sm mt-1">A: {item.a}</p>
            </div>
          ))}
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg text-center">
          <p className="text-green-400 font-semibold">👏 今天辛苦了！</p>
          <p className="text-slate-300 text-sm mt-1">
            下一堂：Persistent Volume、StatefulSet 與 Helm
          </p>
        </div>
      </div>
    ),
    notes: `最後十分鐘，開放問題時間。我列了幾個大家今天最容易有疑問的點先做解答，然後再看大家有沒有其他問題。

第一個常見問題：ClusterIP 和 NodePort 怎麼選？原則很簡單，在叢集內部互相呼叫的服務，永遠用 ClusterIP。要對外暴露的服務，開發測試環境用 NodePort 方便，生產環境標準做法是 ClusterIP 加上 Ingress，而不是直接用 NodePort 對外。

第二個常見問題：Ingress 和 LoadBalancer Service 有什麼差別？LoadBalancer Service 工作在四層（TCP/UDP），它不理解 HTTP，只是把 TCP 連線轉發過去；Ingress 工作在七層（HTTP/HTTPS），可以讀 HTTP Header，根據 Host 域名和 URL Path 做路由，同一個 IP 可以服務多個 HTTP 應用。一個對外的 HTTP 服務，標準做法是：一個 LoadBalancer Service 給 Ingress Controller 用，其他所有 HTTP 服務都用 Ingress 規則，不要每個服務都建 LoadBalancer Service。

第三個常見問題：NetworkPolicy 沒效怎麼排查？第一步確認你的 CNI 支援 NetworkPolicy，kubectl get pods -n kube-system 看有沒有 calico 或 cilium 的 Pod；第二步 kubectl describe networkpolicy 確認 podSelector 的 Label 有沒有選到正確的 Pod；第三步 kubectl get pods --show-labels 確認 Pod 的 Label 是否和 Policy 裡的 matchLabels 一致。

大家還有什麼問題嗎？今天的內容非常豐富，Service、DNS、Ingress、NetworkPolicy，每個主題都有很多細節，如果課後複習時有問題，可以在群組發問。

下一堂我們會學 Persistent Volume 和 StatefulSet，讓 Kubernetes 能夠管理有狀態的應用，比如資料庫；還有 Helm 套件管理。今天大家辛苦了，明天見！`,
  },
]
