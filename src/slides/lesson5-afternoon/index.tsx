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
    notes: `歡迎大家回來！午休吃飽了嗎？下午的主題是「服務暴露」，這可以說是 Kubernetes 最實用的一塊，因為它直接關係到你的應用程式能不能讓外界存取到。

上午我們學了 Pod、Deployment、ReplicaSet 這些計算資源，能夠部署應用程式了。但問題是——Pod 部署起來後，IP 是動態分配的，隨時會變，而且外部根本進不去。怎麼辦？這就是今天下午要解決的問題。

我們會從 Service 的四種類型深入分析，理解每種適合什麼場景；接著學 DNS 服務發現，搞懂 Kubernetes 內部那個很長的域名格式是什麼意思；然後進入 Ingress，學習如何用一個入口做七層的 HTTP 路由；最後學 NetworkPolicy，用白名單方式限制 Pod 之間的流量，加強安全性。

今天下午有大量的實作，特別是最後那個「完整對外服務」的組合實作，會讓大家把 Deployment + Service + Ingress 全部串起來，這是真實環境中最常見的部署模式。準備好了嗎？我們開始！`,
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
    notes: `先快速回顧一下為什麼需要 Service。上午我們知道 Pod 是 Kubernetes 最基本的運行單元，但 Pod 有一個致命弱點：它的 IP 是不固定的。

當 Pod 因為節點故障、版本更新、或者手動刪除而重建時，它會拿到一個全新的 IP 位址。如果你的前端服務直接記著後端 Pod 的 IP，重建後連線就斷了。更麻煩的是，當你有三個 Pod 副本在跑，你要怎麼知道要連哪一個？

Service 就是解決這些問題的抽象層。它提供一個穩定的虛擬 IP（叫做 ClusterIP），這個 IP 在 Service 的生命週期內不會改變。背後，Service 透過 Label Selector 自動追蹤哪些 Pod 符合條件，動態更新後端清單。而且 Service 本身就包含了負載均衡的功能，流量會自動分散到所有健康的後端 Pod。

你可以把 Service 想像成一個「名片」：它有一個固定的電話號碼（ClusterIP），但接電話的人可能隨時換（Pod 動態替換），而且如果有多個人，電話會自動輪流轉接（負載均衡）。

好，了解了 Service 的基本概念，接下來我們深入看四種 Service 類型。`,
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
    notes: `我們來看前兩種 Service 類型：ClusterIP 和 NodePort。

ClusterIP 是 Service 的預設類型，如果你建立 Service 時不指定 type，就是 ClusterIP。它的特性是：只能在 Kubernetes 叢集內部存取，外部完全無法直接連到它。你會問：這有什麼用？用處很大，叢集裡的微服務彼此通訊就用這個。比如前端 Pod 要呼叫後端 API，後端 API 要查 MySQL 資料庫，這些服務之間的連線都走 ClusterIP Service，不需要暴露到外網，安全又簡單。

ClusterIP 的 YAML 重點就是 selector 和 ports。selector 指定要把流量導向哪些 Pod（用 Label 配對），ports 裡面的 port 是 Service 本身的連接埠，targetPort 是後端 Pod 實際監聽的連接埠。這兩個可以不一樣，比如 Service 對外說「我監聽 80 port」，但實際轉發給 Pod 的 8080 port。

NodePort 在 ClusterIP 的基礎上多了一件事：它在每個節點（Node）上開一個固定的埠號（介於 30000 到 32767 之間），外部可以用「任何節點的 IP + NodePort 的埠號」來存取服務。比如叢集有三個節點，IP 分別是 10.0.0.1、10.0.0.2、10.0.0.3，你設定 nodePort: 30080，那麼用任何一個節點 IP 加 30080，都能連到這個 Service。

NodePort 的優點是簡單，不需要額外的負載均衡器，適合開發測試環境或是學習用途。缺點是埠號範圍受限，而且要記得節點的 IP，不太適合正式的生產環境服務對外。

大家把這兩個 YAML 抄起來，等一下要用到。`,
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
    notes: `繼續看後兩種類型。

LoadBalancer 是雲端環境的主流選擇。當你在 AWS EKS、Google GKE 或 Azure AKS 上建立 LoadBalancer 類型的 Service，Kubernetes 會自動呼叫雲端平台的 API，建立一個實際的雲端負載均衡器（比如 AWS 的 ELB、GCP 的 Cloud Load Balancer），並且分配一個公網 IP 給你。你只要用這個公網 IP，就可以從外部存取服務。

這是生產環境對外服務最常用的方式，因為雲端 LB 有自動的健康檢查、跨可用區的流量分發、還有 DDoS 防護等企業級功能。

但是有個要注意的點：每個 LoadBalancer Service 都會建立一個獨立的雲端 LB，費用是獨立計費的。如果你有十個對外服務，就是十個 LB 的費用。這就是為什麼後面要學 Ingress，用一個 LB 服務多個 HTTP 應用，更省錢也更好管理。

在本地或裸機環境（比如我們的練習環境），沒有雲端 LB，LoadBalancer Service 會一直停在 pending 狀態。這時候需要安裝 MetalLB 這樣的工具，讓它模擬雲端 LB 的行為，分配區域網路的 IP。

ExternalName 比較特殊，它不是用來暴露叢集裡的 Pod，而是用來把叢集內部的 Service 名稱對應到外部的域名。比如你的 MySQL 資料庫不在叢集裡，而是在外部的 RDS 上，你可以建一個 ExternalName Service，指向 your-db.aws.rds.amazonaws.com。叢集裡的 Pod 只需要連 mysql-svc 這個 Service 名稱，DNS 會自動解析到外部的 RDS 域名。

這樣做的好處是：程式碼不需要知道外部服務的真實域名，只知道叢集內的 Service 名稱，之後要換資料庫提供商，只需要改 ExternalName 的值，不用改應用程式。

四種 Service 類型的使用場景總結：ClusterIP 給叢集內部服務通訊用，NodePort 給開發測試時臨時對外用，LoadBalancer 給雲端生產環境對外用，ExternalName 給對接外部服務用。`,
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
    notes: `讓我們更深入理解 Service 背後的機制——Endpoints。

每當你建立一個 Service，Kubernetes 控制面會同時建立一個同名的 Endpoints 物件（注意是 Endpoints，複數，不是 Endpoint）。這個 Endpoints 物件裡面記錄了所有符合 Service selector 條件的 Pod 的 IP 和 port。

當有 Pod 新增（比如 Deployment 擴展副本數），Kubernetes 的 Endpoint Controller 會自動把新 Pod 的 IP 加入 Endpoints。當 Pod 被刪除或是 readiness probe 失敗，它的 IP 也會自動從 Endpoints 裡面移除，確保流量不會送到不健康的後端。

你可以用 kubectl get endpoints my-service 查看 Endpoints 的內容，看到的結果類似 10.244.1.5:8080,10.244.2.7:8080，這就是目前這個 Service 後面有哪些 Pod 在接收流量。

還有一個進階用法：手動管理 Endpoints。如果你建立一個 Service 但不設 selector，Kubernetes 就不會自動建立 Endpoints，你可以手動建立一個同名的 Endpoints 物件，指定你想要的 IP 和 port。這種方式可以用來把叢集外部的服務（比如裸機的 PostgreSQL）接入 Kubernetes 的 Service 體系，讓叢集內的 Pod 用 Service 名稱來存取外部 IP，比 ExternalName 更靈活，因為可以直接指定 IP 而不是域名。

理解 Endpoints 機制很重要，因為在除錯 Service 問題時，第一步通常就是 kubectl get endpoints，看看後端 Pod 有沒有正確被加進去。如果 Endpoints 是空的，通常代表 selector 沒有匹配到任何 Pod，要去檢查 Label 設定是否正確。`,
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
    notes: `好，Service 的四種類型學完了，現在來看 DNS 與服務發現。這個主題很重要，因為在實際開發中，你幾乎不會用 IP 來連 Service，而是用 DNS 域名。

Kubernetes 內建了一個 DNS 伺服器叫做 CoreDNS，它以 Pod 的形式跑在 kube-system 這個 Namespace 裡。CoreDNS 的作用是：把 Service 名稱解析成 ClusterIP，讓叢集裡的 Pod 可以用名字來找到其他服務。

每個 Service 在 CoreDNS 裡都有一個完整的 DNS 名稱，格式是：Service名稱.Namespace.svc.cluster.local

拆開來看：Service 名稱就是你 YAML 裡 metadata.name 的值；Namespace 是 Service 所在的 Namespace；svc 是固定的，代表 Service 類型的資源；cluster.local 是這個 Kubernetes 叢集的域名後綴，預設值就是 cluster.local。

舉個例子：在 production Namespace 裡有個叫做 backend-api 的 Service，它的完整 DNS 名稱就是 backend-api.production.svc.cluster.local。

那麼這麼長的名字要怎麼用？其實在同一個 Namespace 裡，你只需要用 Service 的名字就夠了，DNS 自動補全後綴。比如同 Namespace 的 Pod 要連 backend-api，直接寫 http://backend-api:8080 就行，不需要寫完整域名。

如果要跨 Namespace，最少要帶上 Namespace，比如 http://backend-api.production，DNS 會幫你補全 .svc.cluster.local。當然寫完整版也沒問題。

這個機制讓服務之間的依賴不需要硬寫 IP，服務名稱就是連線的地址，非常適合微服務架構。`,
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
    notes: `我們來深入看跨 Namespace 的服務通訊。

在實際的微服務架構中，我們通常會把不同職責的服務分到不同的 Namespace 來組織和隔離。比如前端相關的放在 frontend Namespace，後端 API 放在 backend Namespace，資料庫放在 database Namespace。

在這種架構下，服務之間的通訊就需要跨 Namespace。規則很簡單：

同 Namespace 的通訊，直接用 Service 名稱就好，比如 http://cart-svc:8080。

跨 Namespace 的通訊，至少要帶上目標服務的 Namespace，比如 frontend Namespace 裡的 Pod 要呼叫 backend Namespace 的 api-svc，就用 http://api-svc.backend。或者用完整格式 api-svc.backend.svc.cluster.local，兩種都可以。

這裡有個很實用的技巧：用 nslookup 或 dig 在 Pod 裡面測試 DNS 解析是否正常工作。我用 kubectl run 啟動一個臨時的 busybox Pod，執行 nslookup my-svc.default，如果 DNS 正常，你會看到它把 Service 名稱解析成一個 ClusterIP。如果解析失敗，通常是 CoreDNS 有問題，或是 Service 名稱/Namespace 寫錯了。

有一個要特別提醒的：Kubernetes 預設允許所有 Pod 之間的通訊，不管是不是同個 Namespace。這表示任何 Pod 都可以連到任何其他 Namespace 的 Service。如果你需要隔離，不讓 frontend 連到 database，就需要 NetworkPolicy，我們等一下會學到。

現在我們有個 15 分鐘的休息，待會回來學 Ingress，我們的重頭戲！`,
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
    notes: `好，我們先休息 15 分鐘。趕快去倒杯水、伸展一下。

上半場我們把 Service 從頭到尾學了一遍：四種類型的使用場景、Endpoints 的運作機制、CoreDNS 服務發現，以及跨 Namespace 的連線方式。這些是 Kubernetes 網路的地基，搞懂了後面學 Ingress 和 NetworkPolicy 就更有感覺。

下半場的重頭戲是 Ingress，這是現在最主流的 HTTP 服務對外方式。之後還有 NetworkPolicy 的網路隔離，然後是最後的實作——把 Deployment、Service、Ingress 全部組合起來，完成一個完整的對外服務部署。

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
    notes: `休息回來，我們進入下半場的重頭戲：Ingress。

先說一個背景問題。假設你的系統有十個微服務需要對外暴露，如果每個都用 LoadBalancer Service，你要建立十個雲端 LB，費用很高，而且管理上也很複雜，十個不同的 IP 要分開記。有沒有更好的做法？

Ingress 就是解決方案。Ingress 是 Kubernetes 裡處理 HTTP/HTTPS 七層路由的資源。只需要一個對外的入口點，根據請求的 Host 域名或 URL Path，把流量分發到不同的 Service。

比如：
- api.example.com 的請求 → 路由到 api-svc
- www.example.com 的請求 → 路由到 web-svc
- www.example.com/admin 的請求 → 路由到 admin-svc

這樣你只需要一個 Load Balancer，背後的路由邏輯全部用 Ingress 規則來定義，省錢又好管理。

但這裡有個重要概念要搞清楚：Ingress 本身只是一個規則定義，它本身不做任何事。真正執行路由的是 Ingress Controller——一個實際跑在叢集裡的程式，它監聽 Ingress 資源的變化，然後相應地更新自己的路由設定。最常見的 Ingress Controller 是 nginx-ingress，也就是把 nginx 包裝成一個 Kubernetes Controller。

所以使用 Ingress 需要兩步：一、安裝 Ingress Controller；二、建立 Ingress 規則。我們接下來先安裝 Controller。`,
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
    notes: `來，我們實際安裝 nginx-ingress Controller。這是業界最常用的 Ingress Controller，由 Kubernetes 官方社群維護。

第一種方法是用 Helm 安裝，這是最推薦的方式。Helm 是 Kubernetes 的套件管理工具（就像 Linux 的 apt 或 yum），可以一鍵安裝一組複雜的 Kubernetes 資源。我們先加入 ingress-nginx 的 Helm 倉庫，然後執行 helm install 就搞定了，nginx-ingress 會被安裝在 ingress-nginx 這個獨立的 Namespace 裡。

第二種方法是直接套用官方提供的 YAML 檔案，適合不想裝 Helm 的情況。但我建議大家學 Helm，因為很多 Kubernetes 工具（prometheus、cert-manager、ArgoCD）都是用 Helm 安裝的，早點學起來很有用。

安裝完之後，用 kubectl get pods -n ingress-nginx 確認 Pod 是不是 Running 狀態。再用 kubectl get svc -n ingress-nginx 看 Service，正常的話你會看到 ingress-nginx-controller 這個 Service，它的 type 是 LoadBalancer。

在雲端環境，這個 LoadBalancer Service 會取得一個公網 IP，你把域名指向這個 IP，所有的 HTTP 請求就進來了。在本地裸機環境，EXTERNAL-IP 可能顯示 pending，需要安裝 MetalLB 或改成 NodePort 模式。我們練習環境用 NodePort，等一下實作時我會再說明。

Controller 安裝好了，接下來寫 Ingress 規則。`,
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
    notes: `好，Controller 裝好了，來看 Ingress 的 YAML 規則怎麼寫。

先看 apiVersion：networking.k8s.io/v1，這是 Kubernetes 1.19 以後的穩定版本，比舊版的 extensions/v1beta1 更標準。

metadata 裡有個重要的欄位：annotations。nginx-ingress 很多進階功能是透過 annotation 來設定的，比如 rewrite-target 是重寫 URL 路徑、proxy-body-size 是設定允許上傳的最大檔案大小、proxy-read-timeout 是設定逾時時間。不同的 Ingress Controller 有不同的 annotation，nginx 的文件很完整，遇到特殊需求去查就好。

spec 裡面有幾個重點：

ingressClassName 指定這個 Ingress 要由哪個 Controller 來處理。如果你叢集裡裝了多個 Ingress Controller，就需要用這個欄位區分。

rules 是路由規則清單。每條規則可以指定 host（域名），比如 api.example.com。如果不指定 host，這條規則適用所有域名。

每個 host 下面有 http.paths，也就是路徑規則。path 是 URL 路徑，pathType 指定匹配方式：Prefix 代表前綴匹配（/api 會匹配 /api/users、/api/posts 等），Exact 是精確匹配。

backend 指定流量要送到哪個 Service 的哪個 port。

這樣，一個 Ingress 資源裡可以定義很多條規則，把不同的 host 和 path 分別路由到不同的 Service。一個 nginx Controller 處理所有進來的流量，根據規則分配。`,
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
    notes: `有了 HTTP 路由之後，HTTPS 加密是生產環境必備的。讓我們看怎麼在 Ingress 上設定 TLS。

第一步是建立 TLS Secret。Kubernetes 的 Secret 資源可以存放敏感資料，TLS Secret 專門用來存放 TLS 憑證（.crt 檔）和私鑰（.key 檔）。如果你已經有憑證，用 kubectl create secret tls 指令就可以把它包裝成 Secret 資源。

第二步是在 Ingress 的 spec 裡加上 tls 設定，指定要用哪個 Secret、哪些 host 要啟用 HTTPS。就這樣，nginx-ingress Controller 會讀取這個 Secret 裡面的憑證，在 443 port 提供 HTTPS 服務。

關於憑證怎麼取得：開發環境可以用 openssl 自己簽一個自簽憑證，雖然瀏覽器會顯示警告，但功能上沒問題。生產環境強烈建議使用 cert-manager 搭配 Let's Encrypt，Let's Encrypt 提供免費的 TLS 憑證，cert-manager 負責自動申請和在憑證到期前自動更新，完全不用手動管理憑證。

安裝 cert-manager 之後，只需要在 Ingress 的 annotation 加一行 cert-manager.io/cluster-issuer: letsencrypt，cert-manager 就會自動幫你申請憑證、建立 TLS Secret、並在需要時更新。這在生產環境非常好用，憑證再也不用怕忘記更新而過期。

還有一個常用的設定：在 annotation 加上 nginx.ingress.kubernetes.io/ssl-redirect: "true"，nginx 會自動把所有 HTTP 請求重導向到 HTTPS，確保使用者一定走加密連線。`,
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
    notes: `學完了如何暴露服務，現在來學如何保護服務：NetworkPolicy。

Kubernetes 預設情況下，叢集裡所有的 Pod 都可以互相通訊，不管是不是同個 Namespace，也不管什麼服務。這在安全性要求高的環境是不可接受的——你不會希望你的前端 Pod 可以直接連到資料庫，或者一個被入侵的 Pod 可以橫向移動攻擊叢集裡的其他服務。

NetworkPolicy 就是 Kubernetes 的網路防火牆。它讓你可以定義規則：某些 Pod 只允許接受特定來源的流量，或只允許連接到特定目的地。

重要概念：NetworkPolicy 是白名單機制。一旦你對某個 Pod 套用了 NetworkPolicy，預設是拒絕所有流量，只有規則中明確允許的才放行。

NetworkPolicy 有四個核心概念：
podSelector 決定這個 Policy 管的是哪些 Pod，用 Label 選取。
ingress 規則定義允許哪些流量「進入」被管的 Pod，from 欄位可以指定來源（可以是 Pod、Namespace、或 CIDR IP 範圍）。
egress 規則定義允許哪些流量「離開」被管的 Pod，to 欄位指定目的地。
policyTypes 指定這個 Policy 管 Ingress、Egress 還是兩者都管。

一個很重要的注意事項：NetworkPolicy 需要 CNI（Container Network Interface）外掛支援才能生效。Calico 和 Cilium 支援得很好，Flannel 預設不支援。如果你的叢集用的 CNI 不支援 NetworkPolicy，Policy 雖然可以建立，但完全沒有作用。所以確認你的 CNI 支援 NetworkPolicy 很重要。`,
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
    notes: `來看幾個實際的 NetworkPolicy YAML 範例。

第一個範例：只允許 frontend Namespace 裡有 role: web 這個 Label 的 Pod 連進來 backend Namespace 裡的 api Pod。

分析這個 YAML：podSelector 選取有 app: api label 的 Pod，這些是要被保護的目標。policyTypes 只有 Ingress，代表我們只管進入流量。ingress 規則的 from 裡同時指定了 namespaceSelector 和 podSelector，這兩個條件是 AND 關係，必須同時滿足：來自 name: frontend 這個 Namespace，而且 Pod 要有 role: web 這個 Label。

要注意：namespaceSelector 是根據 Namespace 的 Label 來選取的，你需要先給 Namespace 加上 Label，比如 kubectl label namespace frontend name=frontend。

第二個範例是「拒絕所有進入流量」的模板。podSelector 是空的，代表選取這個 Namespace 裡的所有 Pod；policyTypes 有 Ingress 但沒有 ingress 規則，代表所有進入流量都拒絕。這是一個安全加固的起手式：先全部鎖死，再用其他 NetworkPolicy 逐一開放需要的通訊。

第三個範例是允許 egress 到 DNS port 53。為什麼要特別允許？因為如果你同時鎖死了 Egress，Pod 連 DNS 都查不了，什麼都連不到。所以記住：如果你要鎖 egress，記得留一條 DNS（UDP/TCP 53）的通道，不然 CoreDNS 解析會失敗。

這些 NetworkPolicy 模板，在真實的安全加固專案中非常實用，建議大家收起來備用。`,
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
    notes: `好，現在進入今天下午最重要的實作環節。我們要把 Deployment、Service、Ingress 這三個資源組合在一起，完成一個完整的對外服務部署。這個模式在實際工作中幾乎每天都用到。

請打開 lab/lesson5-afternoon/full-stack-app.yaml，這個檔案裡用 --- 分隔，包含了三個 Kubernetes 資源。

第一個資源是 Deployment，部署三個 nginx Pod 副本，每個 Pod 有 app: demo-web 這個 Label。

第二個資源是 ClusterIP Service，用 selector app: demo-web 把流量導向這三個 Pod。

第三個資源是 Ingress，把 demo.example.com 的請求路由到這個 Service。

實作步驟：
1. kubectl apply -f full-stack-app.yaml，一次 apply 三個資源。
2. kubectl get deploy,svc,ingress 確認全部建立成功。
3. kubectl get pods 確認 Pod 都是 Running。

測試方式有兩種：一是直接用 curl 帶 Host header：curl http://NODE_IP:NODEPORT -H "Host: demo.example.com"；二是修改本機的 /etc/hosts 文件，把 demo.example.com 指向 NODE_IP，然後直接 curl http://demo.example.com 就像真實域名一樣。

操作過程中如果遇到問題，用 kubectl describe ingress my-ingress 看 Ingress 的事件，或 kubectl logs -n ingress-nginx nginx-ingress-controller 看 Controller 的日誌，幾乎所有問題都可以從這兩個地方找到線索。

（巡視並幫助同學，預留 15 分鐘讓大家自己操作）`,
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
    notes: `繼續實作，在剛才完成的 Deployment + Service + Ingress 基礎上，加入 NetworkPolicy 來限制流量。

這個 NetworkPolicy 的目標是：demo-web 這些 Pod 只能接受來自 ingress-nginx 這個 Namespace 的流量（也就是 Ingress Controller），其他任何 Pod 都不能直接連進來。

為什麼要這樣設定？因為正確的流量路徑應該是：外部請求 → Ingress Controller → Service → Pod。如果有人想繞過 Ingress 直接從叢集內部呼叫 Pod，這個 NetworkPolicy 就會擋住他。

YAML 重點解析：namespaceSelector 用了 kubernetes.io/metadata.name: ingress-nginx，這是 Kubernetes 1.21 之後每個 Namespace 自動有的 Label，值就是 Namespace 的名稱，很方便用來選取特定 Namespace 而不需要手動加 Label。

套用 NetworkPolicy 之後，你可以用 kubectl run 跑一個臨時的 busybox Pod，嘗試用 wget 直接連 demo-web-svc，應該會因為 NetworkPolicy 的限制而被拒絕（timeout 或 connection refused）。這樣就驗證了 NetworkPolicy 確實生效了。

但透過 Ingress Controller 的連線應該還是正常的，因為 ingress-nginx Namespace 的流量是被允許的。

（讓大家自己操作，助教巡視協助，預留 15 分鐘實作時間）

大家都完成了嗎？如果有遇到 NetworkPolicy 沒有效果的情況，通常是 CNI 不支援的問題，或者 Namespace 的 Label 不對，可以用 kubectl describe networkpolicy 來確認設定是否正確。`,
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
              className={`bg-${section.color}-900/30 border border-${section.color}-700 p-4 rounded-lg`}
            >
              <p className={`text-${section.color}-400 font-semibold mb-2`}>{section.title}</p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                    <span className={`text-${section.color}-400 mt-0.5`}>•</span>
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
    notes: `好，今天下午的內容非常豐富，讓我來幫大家做一個完整的總結。

第一塊：Service 四種類型。記住各自的用途：ClusterIP 給叢集內部服務通訊用，是最基礎的也是最常見的；NodePort 適合開發測試時快速對外；LoadBalancer 在雲端環境用，自動建立雲端 LB 取得公網 IP；ExternalName 用來把叢集內的 Service 名稱映射到外部域名。另外要記住 Endpoints 的概念，它是 Service 後端 Pod 清單的具體實現，排查問題時先看 Endpoints。

第二塊：DNS 服務發現。CoreDNS 是叢集的內建 DNS 伺服器，讓 Pod 可以用 Service 名稱而不是 IP 來通訊。完整格式是 service.namespace.svc.cluster.local，同 Namespace 可以直接用 Service 名稱，跨 Namespace 要加 Namespace。

第三塊：Ingress。七層 HTTP 路由的核心，用一個入口管理所有 HTTP 服務。記住 Ingress 本身只是規則，需要 Ingress Controller 才能生效。nginx-ingress 是最常用的 Controller，路由規則可以按 Host 或 Path 分配，TLS 設定讓你支援 HTTPS，生產環境記得用 cert-manager 自動管理憑證。

第四塊：NetworkPolicy。網路隔離的利器，白名單機制，套用後預設拒絕，明確允許才放行。要注意 CNI 的支援，Calico 和 Cilium 都支援，Flannel 預設不支援。

今天的核心是：Deployment + Service + Ingress 的三合一組合，這是 Kubernetes 對外服務最標準的架構，幾乎所有正式的 K8s 應用都用這個模式。把這三個資源的關係搞清楚，你的 K8s 服務部署能力就上了一個台階。

明天我們繼續學 Persistent Volume 和有狀態應用，以及 Helm 套件管理，再往前走一步！`,
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
