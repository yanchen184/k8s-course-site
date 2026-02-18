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
    title: '工作負載管理',
    subtitle: 'Deployment、HPA、DaemonSet、StatefulSet',
    section: '第五堂早上',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            ☸️
          </div>
          <div>
            <p className="text-2xl font-semibold">工作負載管理</p>
            <p className="text-slate-400">讓應用程式跑得穩、跑得好、跑得聰明</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">⏰ 時間</p>
            <p>09:00 – 12:00（180 分鐘）</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">🎯 本堂目標</p>
            <p>掌握各種工作負載的設計與選擇</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">🛠 工具</p>
            <p>kubectl、Metrics Server、HPA</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">📋 前置條件</p>
            <p>了解 Pod、Deployment 基本操作</p>
          </div>
        </div>
      </div>
    ),
    notes: `大家早安！歡迎來到第五堂課的早上場。今天我們要深入探討 Kubernetes 的工作負載管理，這是讓應用程式跑得穩、跑得好的關鍵知識。

在過去幾堂課，我們已經學過 Pod 的基本概念，也用過 Deployment 部署過應用程式。今天我們要把這些知識往更深、更廣的方向延伸。不只是「讓 Pod 跑起來」，而是「讓 Pod 以最佳狀態持續運行」。

今天早上的主要角色有四位：Deployment（我們的老朋友，今天要深入認識它）、HPA（讓 Pod 根據負載自動增減數量）、DaemonSet（確保每個節點都有特定 Pod）、StatefulSet（管理有狀態的應用程式）。

我在業界工作時，常常看到工程師光是把服務跑起來就滿足了，卻沒有設定健康檢查、資源限制，結果在高峰期服務崩潰，或記憶體洩漏把整個節點搞垮。今天學完這些知識，你就能避開這些坑。這四種工作負載各有各的使用場景，課程結束後你應該能夠判斷什麼情況要用哪一種。準備好了嗎？我們開始！`,
    duration: '3',
  },

  // ========== 課程大綱 ==========
  {
    title: '今日課程大綱',
    section: '課程總覽',
    content: (
      <div className="grid gap-3">
        {[
          { time: '09:00–09:05', topic: '開場與複習', icon: '🔁' },
          { time: '09:05–09:35', topic: 'Deployment 深入：模板設計、策略', icon: '🚀' },
          { time: '09:35–10:00', topic: '健康檢查：Liveness / Readiness / Startup', icon: '❤️' },
          { time: '10:00–10:25', topic: '資源管理：Request / Limit / QoS', icon: '⚖️' },
          { time: '10:25–10:40', topic: '休息時間', icon: '☕' },
          { time: '10:40–11:10', topic: 'HPA 自動擴縮容', icon: '📈' },
          { time: '11:10–11:30', topic: 'DaemonSet：每個節點一個 Pod', icon: '🛡️' },
          { time: '11:30–11:50', topic: 'StatefulSet：有狀態應用', icon: '🗄️' },
          { time: '11:50–12:00', topic: '課程總結', icon: '🏁' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-sm">{item.time}</p>
              <p className="text-base">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我們先看一下今天早上的課程安排，心裡有個底，知道整體流程。

前面五分鐘是開場和複習上一堂課的重點，確認大家的基礎知識都準備好了。接著三十分鐘深入 Deployment，我們之前用過 Deployment，但今天要更深入理解 Pod 模板的設計細節和部署策略。然後二十五分鐘學健康檢查，這是確保應用程式穩定運行的關鍵機制。接著二十五分鐘探討資源管理，了解如何設定 CPU 和記憶體的限制。

休息之後，三十分鐘學 HPA 自動擴縮容，這是 Kubernetes 最吸引人的功能之一。然後二十分鐘認識 DaemonSet，最後二十分鐘學 StatefulSet。

整個早上的安排很緊湊，但每個主題都很實用。有問題隨時提出來，不要憋著。`,
    duration: '2',
  },

  // ========== 複習 ==========
  {
    title: '快速複習',
    subtitle: '上一堂課的重點回顧',
    section: '開場複習',
    content: (
      <div className="space-y-4">
        <p className="text-lg text-slate-300">第四堂課學了什麼？</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: '📦',
              title: 'ConfigMap / Secret',
              desc: '設定與敏感資料的分離管理',
              color: 'bg-blue-900/30 border-blue-700',
              textColor: 'text-blue-400',
            },
            {
              icon: '💾',
              title: 'Volume 與 PVC',
              desc: '持久化儲存，資料不隨 Pod 消失',
              color: 'bg-green-900/30 border-green-700',
              textColor: 'text-green-400',
            },
            {
              icon: '🌐',
              title: 'Service',
              desc: 'ClusterIP / NodePort / LoadBalancer',
              color: 'bg-purple-900/30 border-purple-700',
              textColor: 'text-purple-400',
            },
            {
              icon: '🔀',
              title: 'Ingress',
              desc: 'HTTP 路由與域名管理',
              color: 'bg-orange-900/30 border-orange-700',
              textColor: 'text-orange-400',
            },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border p-4 rounded-lg`}>
              <p className={`${item.textColor} font-semibold`}>
                {item.icon} {item.title}
              </p>
              <p className="text-slate-300 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">🎯 今天的重點轉移到...</p>
          <p className="text-slate-300">「工作負載本身」— 如何設計、管理、擴縮容</p>
        </div>
      </div>
    ),
    notes: `在進入今天的主題之前，先花五分鐘複習上一堂課學到的東西。好的工程師都知道，新知識要建立在穩固的舊知識上，不然學了等於沒學。

上一堂課我們學了應用程式的「周邊支援」：ConfigMap 和 Secret 負責管理設定和敏感資料，讓設定和程式碼分離；Volume 和 PVC 處理儲存問題，讓資料能持久保存；Service 負責讓 Pod 可以被訪問到，提供穩定的網路端點；Ingress 則是 HTTP 層的路由，讓外部流量可以根據域名或路徑導向不同的服務。

這些周邊支援讓你的應用程式能夠「活著」並且被外界訪問到。但光是活著還不夠。舉個例子：你把一個 Java Spring Boot 應用用 Deployment 部署起來，它確實跑起來了，Service 也設好了。但假設應用啟動需要 60 秒才能載入完畢，這 60 秒內如果有請求進來，用戶會看到錯誤回應。或者，應用因為記憶體洩漏慢慢變慢，但 Pod 還是「活著的」，Kubernetes 不知道要重啟它，用戶就一直收到緩慢的回應，線上問題越燒越大。

這些問題的解法就是今天的課程重點。今天我們的重點從「周邊」轉移回到「工作負載本身」。今天要學的是：怎麼讓 Pod 跑得更穩、更健康、更有效率，以及在不同場景下選擇正確的工作負載類型。

有沒有人想快速複習一下 ConfigMap 和 PVC 的差異？或是對上一堂課有什麼疑問？（等待學員回應）好，讓我們繼續往前。`,
    duration: '5',
  },

  // ========== Deployment 深入：Pod 模板設計 ==========
  {
    title: 'Deployment 深入',
    subtitle: 'Pod 模板設計與資源配置',
    section: 'Deployment',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">Deployment 的 YAML 結構解析</p>
        <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm leading-relaxed">
          <pre className="text-slate-300">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app        # 必須和 template.labels 一致
  template:               # Pod 模板從這裡開始
    metadata:
      labels:
        app: web-app
        version: "1.0"
    spec:
      containers:
      - name: web
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:        # 資源配額設定
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"`}</pre>
        </div>
      </div>
    ),
    notes: `好，讓我們深入 Deployment。大家之前應該已經寫過簡單的 Deployment YAML，現在讓我們把每個欄位都搞清楚，特別是那些看起來簡單但其實很有學問的細節。

Deployment 的 YAML 分成幾個層次。最外層是 apiVersion 和 kind，這個大家都熟了。apiVersion 是 apps/v1，不是 v1，要注意。metadata 放名字和 namespace，重點在 spec 裡面。

spec.replicas 決定要跑幾個 Pod 的副本。這個數字不是越多越好，因為多一個 Pod 就多一份資源消耗。一般建議生產環境至少設 2，這樣一個 Pod 掛掉還有另一個在撐著，不會有服務中斷的窘境。對外服務設 3 更安全，因為滾動更新時還是有 2 個在服務。

spec.selector.matchLabels 是 Deployment 用來「認領」Pod 的方式，透過這個 label selector 知道哪些 Pod 是它管的。這個值必須和 spec.template.metadata.labels 完全一致，不然 Kubernetes 會直接報錯說「selector 對不上」。這個設計乍看麻煩，但讓 Kubernetes 的 selector 機制可以跨越不同的資源物件，非常靈活。

spec.template 就是 Pod 模板，這是 Deployment 最核心的部分。每次 Deployment 需要建立或更新 Pod，都是把這個模板複製出來，填上隨機後綴名稱，然後排程到節點上執行。所以改這裡的任何東西，都會觸發滾動更新。

特別注意 resources 欄位，分成 requests 和 limits 兩部分。requests 告訴 Kubernetes「我至少需要這麼多資源才能正常運作」，是 Kubernetes 排程決策的依據。limits 則是「最多能用這麼多」的硬上限，CPU 超過會被節流，Memory 超過會被系統 OOMKill（強制終止）。

CPU 的單位 100m 代表 0.1 個 CPU 核心，m 是 milliCPU 的意思，1000m 等於一個完整核心。記憶體 128Mi 是 128 Mebibytes，別跟 128MB 搞混，兩者相差不大但要一致。這些數字怎麼設定很有學問，不要亂猜，等一下資源管理那個章節會有完整說明。

實務建議：剛上線的服務如果不確定資源需求，可以先部署到測試環境，觀察幾天的實際 CPU 和記憶體使用量，再根據 P95 的值來設定合理的 requests 和 limits，比憑直覺設靠譜多了。`,
    duration: '10',
  },

  // ========== Deployment 策略 ==========
  {
    title: 'Deployment 更新策略',
    subtitle: 'RollingUpdate vs Recreate',
    section: 'Deployment',
    content: (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-green-400">✅ RollingUpdate（預設）</h3>
          <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg space-y-2">
            <p className="text-slate-300 text-sm">逐步替換舊 Pod，全程維持服務</p>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded">
              <p className="text-slate-400">strategy:</p>
              <p className="text-slate-400">{'  '}type: RollingUpdate</p>
              <p className="text-slate-400">{'  '}rollingUpdate:</p>
              <p className="text-green-400">{'    '}maxSurge: 1</p>
              <p className="text-green-400">{'    '}maxUnavailable: 0</p>
            </div>
            <ul className="text-slate-300 text-xs space-y-1">
              <li>✓ 零停機更新</li>
              <li>✓ 可隨時回滾</li>
              <li>⚠️ 短暫新舊版本共存</li>
            </ul>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-orange-400">⚡ Recreate</h3>
          <div className="bg-orange-900/20 border border-orange-700 p-4 rounded-lg space-y-2">
            <p className="text-slate-300 text-sm">先刪除所有舊 Pod，再建立新 Pod</p>
            <div className="font-mono text-xs bg-slate-900 p-3 rounded">
              <p className="text-slate-400">strategy:</p>
              <p className="text-orange-400">{'  '}type: Recreate</p>
            </div>
            <ul className="text-slate-300 text-xs space-y-1">
              <li>✓ 不會新舊共存</li>
              <li>✓ 適合有狀態或不相容版本</li>
              <li>⚠️ 有短暫停機時間</li>
            </ul>
          </div>
        </div>
        <div className="col-span-2 bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">💡 maxSurge vs maxUnavailable</p>
          <p className="text-slate-300 text-sm">
            maxSurge：更新時最多額外多幾個 Pod &nbsp;｜&nbsp;
            maxUnavailable：更新時最多允許幾個 Pod 不可用
          </p>
        </div>
      </div>
    ),
    notes: `Deployment 的更新策略決定了「升級應用程式的時候，服務會不會中斷」。這是非常實用的知識，直接影響用戶體驗，也是面試常問的題目。

RollingUpdate 是預設策略，也是大多數情況下的最佳選擇。它的原理是：不要一次把所有舊 Pod 都砍掉，而是一批一批地替換。先新增幾個新版本的 Pod，等它們健康了，再刪掉幾個舊版本的 Pod，如此循環，直到全部更新完畢。這樣在整個更新過程中，服務都是可用的。

maxSurge 控制更新過程中最多可以「額外多出來」幾個 Pod。比如你原本有 3 個 Pod，maxSurge 設 1，更新時最多暫時有 4 個 Pod 在跑，用完就縮回去。maxUnavailable 控制更新過程中最多可以有幾個 Pod 不可用。設成 0 表示任何時候都不能有 Pod 停止服務，這樣就能達到真正的零停機更新。兩個參數不能同時為 0，不然更新就卡住了。

舉個真實案例：一家電商公司在雙十一促銷期間需要緊急修 Bug，使用 RollingUpdate 加上 maxUnavailable=0、maxSurge=2 的設定，在服務完全不中斷的情況下完成了部署，用戶完全沒感覺到版本更新。這就是 RollingUpdate 的威力。

Recreate 策略就簡單暴力很多，先把所有舊 Pod 全部刪掉，然後再建立新的 Pod。這段時間內服務是完全不可用的，所以會有停機時間。什麼時候用 Recreate 呢？通常是當新舊版本有資料庫 schema 不相容，或是應用程式不支援多版本共存的情況下，比如有些快取機制要求所有節點版本一致，這時候就不得不接受短暫停機。

還有一個相關指令要知道：kubectl rollout undo deployment/web-app 可以快速回滾到上一個版本。想知道歷史版本清單用 kubectl rollout history deployment/web-app，指定回滾到特定版本用 --to-revision 參數。

一個實務建議：生產環境幾乎都用 RollingUpdate，把 maxUnavailable 設成 0、maxSurge 設成 1 或以百分比設定（如 25%），這樣更新時不會影響任何流量。如果新版本有問題，馬上 rollout undo 就能快速恢復，整個 rollback 通常在幾十秒內完成，比重新 CI/CD 快多了。

另外，建議每次部署都在 metadata.annotations 記錄變更原因，這樣 rollout history 看起來就更有意義，不只是看到一堆版本號。`,
    duration: '12',
  },

  // ========== 健康檢查概念 ==========
  {
    title: '健康檢查：三種 Probe',
    subtitle: 'Liveness、Readiness、Startup',
    section: '健康檢查',
    content: (
      <div className="space-y-4">
        <div className="grid gap-4">
          {[
            {
              name: 'Liveness Probe',
              icon: '💓',
              question: '容器還活著嗎？',
              action: '失敗 → 重啟容器',
              color: 'bg-red-900/30 border-red-700',
              textColor: 'text-red-400',
              example: '應用程式死鎖、無法回應請求',
            },
            {
              name: 'Readiness Probe',
              icon: '✅',
              question: '容器準備好接收流量嗎？',
              action: '失敗 → 從 Service 移除',
              color: 'bg-yellow-900/30 border-yellow-700',
              textColor: 'text-yellow-400',
              example: '啟動中載入設定、連線資料庫',
            },
            {
              name: 'Startup Probe',
              icon: '🚀',
              question: '容器啟動成功了嗎？',
              action: '失敗 → 重啟容器（保護慢啟動）',
              color: 'bg-blue-900/30 border-blue-700',
              textColor: 'text-blue-400',
              example: '舊系統啟動需要 2 分鐘',
            },
          ].map((probe, i) => (
            <div key={i} className={`${probe.color} border p-4 rounded-lg`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`${probe.textColor} font-bold text-lg`}>
                    {probe.icon} {probe.name}
                  </p>
                  <p className="text-slate-300 text-sm">{probe.question}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{probe.action}</p>
                  <p className="text-slate-400 text-xs">{probe.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `健康檢查是 Kubernetes 裡非常重要的機制。沒有健康檢查，Kubernetes 就不知道你的應用程式是不是真的在正常運行，只能假設「容器在跑就代表服務正常」，但這往往是錯的。

我舉個親身經歷過的案例：有一次線上的 Node.js 服務，因為某個異步錯誤卡住了事件迴圈，HTTP 請求全部無回應，但容器 process 並沒有死，CPU 也只有幾個百分點。沒有 Liveness Probe 的話，Kubernetes 以為一切正常，不會做任何事。用戶一直在等回應，後台工程師盯著監控一頭霧水。有了 Liveness Probe 就不一樣了，幾次探測失敗之後容器自動重啟，服務就恢復正常了。

三種 Probe 各有不同的用途：

Liveness Probe 是「活著嗎」的檢查。Kubernetes 定期問你的應用程式「你還好嗎？」如果回答不正確，代表應用程式可能卡住了（比如死鎖、記憶體洩漏到崩潰邊緣、事件迴圈卡住），這時候 Kubernetes 會重啟容器。注意：Liveness Probe 失敗是直接重啟容器，不是從 Service 移除，這個要記清楚。

Readiness Probe 是「準備好了嗎」的檢查。容器不一定一啟動就能處理請求。比如 Spring Boot 應用程式要幾十秒才能完全啟動，資料庫連線要建立，快取要預熱，各種初始化工作要做完。Readiness Probe 失敗時，Kubernetes 不會重啟容器，而是暫時把這個 Pod 從 Service 的 Endpoints 列表中移除，讓流量不進來，等它準備好再自動加回去。這樣滾動更新時，新 Pod 還沒完全就緒就不會接到流量，避免用戶看到錯誤。

Startup Probe 是給「慢啟動應用程式」用的。有些老系統或 Java 應用啟動要一兩分鐘，如果靠 Liveness Probe 來檢查，initialDelaySeconds 設太短的話可能啟動途中就被重啟了，然後又重啟，形成無限重啟的惡性循環。Startup Probe 的作用是：在 Startup Probe 成功之前，完全暫停 Liveness Probe 的檢查，讓容器有充裕的時間完成啟動，成功後才把接力棒交給 Liveness 和 Readiness Probe。

這三種 Probe 可以同時設定，也可以只設定其中幾種，根據應用程式的特性來決定怎麼組合最合適。`,
    duration: '8',
  },

  // ========== Probe 設定方式 ==========
  {
    title: 'Probe 的三種檢查方式',
    subtitle: 'httpGet、tcpSocket、exec',
    section: '健康檢查',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-2">
              🌐 httpGet — 發 HTTP 請求
            </p>
            <pre className="text-slate-300 font-mono text-xs">{`livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10  # 容器啟動後等幾秒才開始檢查
  periodSeconds: 5          # 每幾秒檢查一次
  failureThreshold: 3       # 連續失敗幾次才算失敗`}</pre>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold text-sm mb-2">
              🔌 tcpSocket — 嘗試建立 TCP 連線
            </p>
            <pre className="text-slate-300 font-mono text-xs">{`readinessProbe:
  tcpSocket:
    port: 3306          # 適合資料庫、Redis 等
  initialDelaySeconds: 15
  periodSeconds: 10`}</pre>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold text-sm mb-2">
              💻 exec — 在容器內執行指令
            </p>
            <pre className="text-slate-300 font-mono text-xs">{`livenessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy       # 指令回傳 0 = 健康，非 0 = 失敗
  initialDelaySeconds: 5
  periodSeconds: 5`}</pre>
          </div>
        </div>
      </div>
    ),
    notes: `三種 Probe 各有三種「問問題的方式」，加起來就是九種組合，不過實務上最常用的是 httpGet 配 Liveness/Readiness。

httpGet 是最常用的方式。Kubernetes 對指定的 HTTP endpoint 發 GET 請求，如果回應狀態碼是 200-399 就算健康，其他的就是失敗。幾乎所有 Web 應用程式都應該實作一個 /healthz 或 /health 的路徑，專門回傳健康狀態。這個端點通常只做輕量的檢查：應用程式本身是否正常、最基本的資料庫連線是否存在。注意：/healthz 是 Kubernetes 官方慣用的路徑名稱，/health 也很常見，選一個統一就好。

tcpSocket 方式更簡單，只嘗試跟指定 port 建立 TCP 連線，連得上就算健康，連不上就失敗。不需要應用程式層的配合，適合沒有 HTTP API 的服務，比如資料庫、Redis、MQTT broker。有些 TCP 服務只要 port 在監聽就代表它能正常工作，這時候 tcpSocket 最省事。

exec 方式是在容器內執行一個指令，指令的回傳碼 0 代表健康，非 0 代表失敗。這是最靈活的方式，可以寫成任何複雜的自訂邏輯，比如連接資料庫並查詢一個特定的健康狀態表、檢查某個 lock 檔案是否存在、執行自定義的健康腳本。但 exec 方式有個缺點：每次探測都要在容器內啟動一個子 process，開銷比 httpGet 和 tcpSocket 大，所以 periodSeconds 不要設太短。

幾個重要的參數值得說明：initialDelaySeconds 是容器啟動後等多久才開始第一次探測，設太短容器還在啟動中就被探測了，容易誤判失敗。一般建議根據應用程式正常啟動時間設定，比如你的服務平均 20 秒啟動完成，就設 25 秒，留一點緩衝。periodSeconds 是多久探測一次，太短浪費資源，太長反應太慢，一般 10-30 秒都算合理。failureThreshold 是連續失敗幾次才真的算失敗，設成 3 代表偶發一次失敗不算，要連續 3 次才觸發行動，可以容忍短暫的網路抖動。successThreshold 相反，預設 1，代表只要成功一次就算恢復正常。

實務建議：Liveness Probe 的 failureThreshold 可以設高一點（比如 5-6），避免正常波動就觸發重啟。Readiness Probe 可以嚴格一點，確保只有真正準備好的 Pod 才接收流量。另外，Liveness 和 Readiness 的 httpGet path 可以設成不同路徑，Liveness 只查應用本身存活，Readiness 還額外查外部依賴的連線狀態。`,
    duration: '10',
  },

  // ========== 健康檢查選擇 ==========
  {
    title: 'Liveness vs Readiness vs Startup',
    subtitle: '什麼時候用哪一種？',
    section: '健康檢查',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-3">完整設定範例（三種 Probe 同時使用）</p>
          <pre className="font-mono text-xs text-slate-300">{`spec:
  containers:
  - name: app
    image: my-app:1.0
    startupProbe:          # 1. 先確認啟動完成（最優先）
      httpGet:
        path: /healthz
        port: 8080
      failureThreshold: 30  # 最多等 30 × 10s = 5 分鐘
      periodSeconds: 10
    readinessProbe:        # 2. 確認可以接流量
      httpGet:
        path: /ready
        port: 8080
      periodSeconds: 5
    livenessProbe:         # 3. 持續監控是否活著
      httpGet:
        path: /healthz
        port: 8080
      periodSeconds: 10
      failureThreshold: 3`}</pre>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-blue-900/30 p-3 rounded-lg text-center">
            <p className="text-blue-400 font-semibold">Startup</p>
            <p className="text-slate-300">先跑，通過後才啟用其他 Probe</p>
          </div>
          <div className="bg-yellow-900/30 p-3 rounded-lg text-center">
            <p className="text-yellow-400 font-semibold">Readiness</p>
            <p className="text-slate-300">失敗 → 從 Service 移除，不重啟</p>
          </div>
          <div className="bg-red-900/30 p-3 rounded-lg text-center">
            <p className="text-red-400 font-semibold">Liveness</p>
            <p className="text-slate-300">失敗 → 重啟容器</p>
          </div>
        </div>
      </div>
    ),
    notes: `讓我們把三種 Probe 放在一起看，搞清楚它們的執行順序和相互關係，這是很多人搞混的地方。

執行順序是這樣的：容器啟動後，如果有設定 Startup Probe，Kubernetes 會先跑 Startup Probe，這個期間 Liveness 和 Readiness Probe 都是暫停的，不管你設了什麼都先不跑。等到 Startup Probe 成功，才開始同時執行 Liveness 和 Readiness 兩個 Probe。這個設計非常聰明，讓慢啟動的應用程式有足夠的緩衝時間，又不影響之後的正常監控。

Startup Probe 的 failureThreshold 非常關鍵。以上面的例子，failureThreshold 是 30，periodSeconds 是 10 秒，代表 Kubernetes 最多等 300 秒（5 分鐘）讓應用程式啟動。超過就重啟。這個「最大等待時間 = failureThreshold × periodSeconds」的公式要記住，根據你的應用程式實際啟動時間來設定，別設太短。

Readiness 和 Liveness 的最大差別：Readiness 失敗只是「退出 Service 轉發列表」，容器本身完全不受影響，Pod 還在跑，等恢復健康後 Kubernetes 自動把它加回到 Service 裡。Liveness 失敗就是「直接重啟容器」，這是比較激烈的處置方式。所以在設計上要謹慎判斷：如果你的應用程式在高負載下響應變慢、但還能正常工作，應該讓 Readiness 失敗（暫時不接流量等壓力降低），而不是 Liveness 失敗（重啟可能讓情況更糟、啟動時間浪費、還可能雪崩）。

一個讓很多人踩坑的錯誤設計：把 Liveness Probe 設計成包含對外部依賴的檢查（比如資料庫連線）。這樣的話，資料庫一掛，所有 Pod 的 Liveness Probe 都失敗，全部被重啟。重啟之後資料庫還是掛的，又全部重啟，形成雪崩效應，整個系統全部崩潰。正確做法是：Liveness Probe 只檢查應用程式本身的內部狀態；外部依賴的可用性交給 Readiness Probe 檢查，失敗時只是暫停接流量，不觸發重啟。

最後一個小 tip：三個 Probe 可以針對同一個 /healthz endpoint，也可以各自用不同的 path，比如 /healthz 給 Liveness（只查自身），/ready 給 Readiness（查自身加上外部依賴），這樣設計更清晰也更安全。`,
    duration: '7',
  },

  // ========== 資源管理 ==========
  {
    title: '資源管理',
    subtitle: 'CPU / Memory Request 與 Limit',
    section: '資源管理',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-bold text-lg mb-3">📋 Requests（保證資源）</p>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Kubernetes 排程的依據</li>
              <li>• 節點上至少保留這麼多</li>
              <li>• 影響 Pod 分配到哪個節點</li>
              <li className="text-green-300 font-semibold">「我需要這麼多」</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-red-400 font-bold text-lg mb-3">🚧 Limits（上限資源）</p>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• 容器最多使用的資源量</li>
              <li>• CPU 超過 → 被節流（throttle）</li>
              <li>• Memory 超過 → OOMKilled</li>
              <li className="text-red-300 font-semibold">「最多只能用這麼多」</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">單位說明</p>
          <div className="grid grid-cols-2 gap-4 font-mono text-sm">
            <div>
              <p className="text-k8s-blue">CPU</p>
              <p className="text-slate-300">250m = 0.25 個核心</p>
              <p className="text-slate-300">1000m = 1 = 1 個核心</p>
            </div>
            <div>
              <p className="text-k8s-blue">Memory</p>
              <p className="text-slate-300">128Mi = 128 Mebibytes</p>
              <p className="text-slate-300">1Gi = 1 Gibibyte</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm">
            ⚠️ Request 必須 ≤ Limit；兩者都設才是最佳實踐
          </p>
        </div>
      </div>
    ),
    notes: `資源管理是 Kubernetes 生產環境中非常重要的主題，也是很多初學者忽略的地方。設定不當可能造成一個應用程式把整個節點的資源吃光，影響同節點上的所有其他服務，形成「鄰居效應」。

先說 Request。Request 是你告訴 Kubernetes「我這個容器至少需要這麼多資源才能正常運行」。Kubernetes 在排程 Pod 時，會找到有足夠「可用資源」的節點。可用資源的計算方式是：節點總資源減去已經被其他 Pod 的 Request 預留的資源。注意：這裡看的是 Request，不是實際使用量！一個節點上所有 Pod 的 Request 加起來不能超過節點容量，但實際上因為不是每個 Pod 都會用到 Request 設的那麼多，節點可能同時跑比「靜態計算」更多的服務，這叫做超額訂閱（overcommit），是 Kubernetes 資源管理的彈性所在。

再說 Limit。Limit 是「容器最多能用多少資源」的上限，是硬限制。CPU 如果超過 Limit，Linux 的 cgroup 會限制 CPU 時間，容器會變慢（被節流，throttle），但不會被殺掉。CPU 節流很難察覺，但會讓 latency 升高，應用程式看起來變慢。Memory 就不一樣了，如果超過 Memory Limit，Linux 核心會立刻觸發 OOMKill（Out of Memory Kill），直接把容器殺掉並重啟。所以 Memory Limit 要設得合理，太緊容易莫名其妙被 OOM，太寬鬆可能讓記憶體洩漏慢慢把節點拖垮。

CPU 單位：m 是 milliCPU，1000m 等於一個 CPU 核心。250m 就是四分之一個核心。現代伺服器有幾十個核心，用 milliCPU 這個精細的單位可以更靈活地分配資源。Memory 單位：Mi 是 Mebibyte（1024×1024 bytes），Gi 是 Gibibyte（1024 MiB）。別跟 MB（Megabyte，1000×1000 bytes）搞混了，兩者差距不大但要統一。

Request 和 Limit 都設定是最佳實踐。如果都不設，那個容器可以無限制使用節點資源，非常危險，一旦有記憶體洩漏就是整個節點的災難。如果只設 Request 沒設 Limit，容器有保底資源但能無限超用，資源緊張時影響其他服務。合理的做法是：Request 設成 P50 的正常使用量（日常平均），Limit 設成 P99 峰值用量的 1.5 到 2 倍，既保留彈性又防止失控。

一個實際工具推薦：kubectl top pods 可以查看每個 Pod 當前的資源用量，kubectl top nodes 查看節點資源。搭配 Prometheus + Grafana 做長期監控，才能科學地設定 resources，不是靠猜。`,
    duration: '12',
  },

  // ========== QoS Class ==========
  {
    title: 'QoS Class',
    subtitle: 'Guaranteed、Burstable、BestEffort',
    section: '資源管理',
    content: (
      <div className="space-y-4">
        <div className="grid gap-4">
          {[
            {
              name: 'Guaranteed',
              icon: '🏆',
              color: 'bg-green-900/30 border-green-600',
              textColor: 'text-green-400',
              condition: 'requests == limits（CPU 和 Memory 都設且相等）',
              priority: '最高優先，最後被驅逐',
              example: 'cpu req=500m limit=500m, mem req=256Mi limit=256Mi',
            },
            {
              name: 'Burstable',
              icon: '⚡',
              color: 'bg-yellow-900/30 border-yellow-600',
              textColor: 'text-yellow-400',
              condition: 'requests < limits 或只設了其中一個',
              priority: '中等優先，資源緊張時可能被驅逐',
              example: 'cpu req=100m limit=500m（大多數服務）',
            },
            {
              name: 'BestEffort',
              icon: '🎲',
              color: 'bg-red-900/30 border-red-600',
              textColor: 'text-red-400',
              condition: '沒有設定任何 requests 和 limits',
              priority: '最低優先，節點資源不足時第一個被驅逐',
              example: '不建議在生產環境使用',
            },
          ].map((qos, i) => (
            <div key={i} className={`${qos.color} border p-4 rounded-lg`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className={`${qos.textColor} font-bold text-lg`}>
                    {qos.icon} {qos.name}
                  </p>
                  <p className="text-slate-300 text-sm">條件：{qos.condition}</p>
                  <p className="text-slate-400 text-xs font-mono">{qos.example}</p>
                </div>
                <p className="text-white text-xs text-right w-28 shrink-0">{qos.priority}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `QoS Class（服務品質等級）是 Kubernetes 根據你設定的 Request 和 Limit 自動計算出來的，不需要手動指定，但這個等級直接影響到你的 Pod 在資源緊張時的「生存優先順序」。

為什麼需要 QoS？想像一個情境：節點上突然多個 Pod 同時記憶體用量暴增，節點可用記憶體見底，快要 OOM 了。Kubernetes 必須從哪個 Pod 開始驅逐（evict）？QoS Class 就是這個「誰先被犧牲」的排序依據。

Guaranteed 是最高等級。條件是 CPU 和 Memory 的 Request 和 Limit 都要設定，而且兩者必須完全相等（cpu req=500m 且 cpu limit=500m，memory req=256Mi 且 memory limit=256Mi）。只要滿足，Kubernetes 保證這些 Pod 有穩定的資源供應。當節點記憶體不足需要驅逐 Pod 時，Guaranteed 的 Pod 是最後被犧牲的。適合關鍵服務：資料庫、核心 API、付費流程、金融交易系統。

Burstable 是中等等級。只要 Pod 有設定任何 Request 或 Limit（即使不相等），就落在這個等級。這類 Pod 平時可能只用到 Request 的資源量，但高峰時可以「突發」到 Limit 上限，有一定的彈性。大多數業務服務都是這個等級。在節點資源緊張時，在 BestEffort Pod 都被驅逐之後，才輪到 Burstable。

BestEffort 是最低等級。沒有設定任何 Request 或 Limit 的 Pod。Kubernetes 對這類 Pod 沒有任何資源保證，節點資源一緊張，它們是第一個被趕走的。生產環境絕對不要用這個，但臨時的開發測試腳本、一次性的數據遷移工具可以接受，反正跑完就刪掉。

如何查看 Pod 的 QoS 等級？kubectl describe pod [pod-name]，輸出裡面有 QoS Class 這個欄位，非常清楚。

一個資源架構設計思路：核心有狀態服務（資料庫、訊息佇列）→ Guaranteed；核心無狀態服務（API、業務邏輯）→ Burstable（Request 稍微保守設、Limit 寬鬆一點）；離線批次工作（報表生成、資料同步）→ Burstable 但 Request 設很低，節省成本；臨時腳本和工具 → BestEffort 可接受。千萬不要讓任何生產服務落到 BestEffort，一次節點壓力事件就可能讓你的服務消失，還不一定有告警。`,
    duration: '13',
  },

  // ========== 休息 ==========
  {
    title: '☕ 休息時間',
    subtitle: '休息 15 分鐘',
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          前半場重點回顧完成！喝個水、活動一下。
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">✅ 前半場已學</p>
            <ul className="text-slate-300 text-sm mt-2 text-left space-y-1">
              <li>• Deployment 模板與策略</li>
              <li>• 三種 Probe 健康檢查</li>
              <li>• Request / Limit / QoS</li>
            </ul>
          </div>
          <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
            <p className="text-k8s-blue text-sm font-semibold">🔜 後半場即將</p>
            <ul className="text-slate-300 text-sm mt-2 text-left space-y-1">
              <li>• HPA 自動擴縮容</li>
              <li>• DaemonSet</li>
              <li>• StatefulSet</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們已經完成了前半場的內容。我們學了 Deployment 的深入知識、健康檢查機制、還有資源管理和 QoS。這些知識的組合，已經能讓你把一個應用程式部署得非常穩固。

現在休息 15 分鐘，喝水、上廁所、活動一下。如果對前半場的內容有疑問，可以趁這個時間來問我或助教。

後半場我們會學三個非常有趣的主題：HPA 自動擴縮容，這是很多人學 Kubernetes 的初衷之一；DaemonSet，適合需要在每個節點上跑監控代理的場景；StatefulSet，解決有狀態應用的難題。

15 分鐘後準時回來！`,
    duration: '1',
  },

  // ========== HPA 概念 ==========
  {
    title: 'HPA：水平自動擴縮容',
    subtitle: 'Horizontal Pod Autoscaler',
    section: 'HPA 自動擴縮容',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-8 py-4">
          <div className="text-center">
            <p className="text-4xl">📈</p>
            <p className="text-slate-300 text-sm mt-1">CPU 負載高</p>
          </div>
          <p className="text-k8s-blue text-3xl">→</p>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-white font-bold">HPA</p>
            <p className="text-k8s-blue text-xs">自動判斷</p>
          </div>
          <p className="text-k8s-blue text-3xl">→</p>
          <div className="text-center">
            <p className="text-4xl">🐳🐳🐳🐳🐳</p>
            <p className="text-green-400 text-sm mt-1">自動增加 Pod 數量</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">📋 先決條件</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>✓ 安裝 Metrics Server</li>
              <li>✓ 容器設定 CPU Request</li>
              <li>✓ Deployment 要有 replicas</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">🔧 安裝 Metrics Server</p>
            <pre className="text-green-400 font-mono text-xs">{`kubectl apply -f https://github.com/
  kubernetes-sigs/metrics-server/
  releases/latest/download/
  components.yaml`}</pre>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm">💡 HPA 的工作原理</p>
          <p className="text-slate-300 text-sm">
            每 15 秒查詢一次 Metrics Server → 計算 Pod 目標數量 → 更新 Deployment replicas
          </p>
        </div>
      </div>
    ),
    notes: `休息結束，繼續！後半場第一個主題是 HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。這個功能可以說是很多工程師學 Kubernetes 的主要動機之一。

HPA 解決的問題是：流量不是固定的。白天流量大、晚上流量小；大促活動流量暴增、平常流量平穩。如果 Pod 數量是固定的，要麼平常浪費資源（養了一堆閒置的 Pod），要麼高峰撐不住（Pod 數量不夠，流量打爆）。這在雲端環境裡就是直接燒錢或燒用戶體驗的選擇題。HPA 讓 Kubernetes 能夠根據實際負載自動調整 Pod 數量，負載高就多開幾個 Pod，負載低就縮回來，真正做到「按需使用」，既不浪費又能扛住高峰。

HPA 的工作原理很清晰：每隔 15 秒，HPA 控制器向 Metrics Server 查詢所有受管 Pod 的 CPU 或記憶體使用率，然後用一個簡單的公式計算出「目標 Pod 數量」：目標數量 = ceil（當前 Pod 數 × 當前平均使用率 / 目標使用率）。計算完後更新 Deployment 的 replicas 欄位，Deployment 就自動進行滾動更新，增加或減少 Pod。

要使用 HPA，有幾個前提條件：

第一，Metrics Server 是必需的。Kubernetes 預設沒有內建 Metrics Server，需要另外安裝。Metrics Server 是一個輕量級的資源監控服務，從每個節點的 kubelet 收集 CPU 和記憶體使用數據，提供給 HPA 和 kubectl top 使用。上面的安裝指令是官方推薦的一行安裝方式。注意：有些 Kubernetes 發行版（比如 GKE、EKS）可能已經預裝了 Metrics Server，安裝前先確認一下。

第二，容器必須設定 CPU Request。HPA 計算 CPU 使用率的方式是「實際 CPU 用量 ÷ CPU Request」，沒有 Request 就沒辦法算出百分比，HPA 就無法判斷何時需要擴容。這也是前面我們強調要設 resources 的原因之一。

第三，要有 Deployment（或 ReplicaSet、StatefulSet）。HPA 是透過修改控制器的 replicas 欄位來擴縮的，必須先有這些資源。

實務小提醒：HPA 和 Deployment 的 replicas 可能衝突。當你的 HPA 在控制 Deployment 的 replicas 時，不要直接去改 Deployment 的 replicas 欄位（比如用 kubectl scale），因為 HPA 下一次調整時會覆蓋你的修改。把 replicas 的控制權完全交給 HPA 就好。`,
    duration: '10',
  },

  // ========== HPA YAML 設定 ==========
  {
    title: 'HPA YAML 設定',
    subtitle: 'kubectl autoscale 與 YAML 兩種方式',
    section: 'HPA 自動擴縮容',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">
            方式一：快速指令（適合測試）
          </p>
          <pre className="text-green-400 font-mono text-sm">{`kubectl autoscale deployment web-app \\
  --cpu-percent=50 \\
  --min=2 \\
  --max=10`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">方式二：YAML（適合生產）</p>
          <pre className="text-slate-300 font-mono text-xs">{`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2      # 最少幾個 Pod
  maxReplicas: 10     # 最多幾個 Pod
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50  # 目標 CPU 使用率 50%`}</pre>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs">查看 HPA 狀態</p>
          <code className="text-green-400 text-sm font-mono">
            kubectl get hpa web-app-hpa
          </code>
        </div>
      </div>
    ),
    notes: `HPA 的設定方式有兩種，一種是快速指令，一種是 YAML 設定檔，各有適合的場景。

快速指令 kubectl autoscale 是最方便的方式，一行搞定，適合快速測試。參數說明：cpu-percent 是目標 CPU 使用率，設 50 代表當所有受管 Pod 的平均 CPU 使用率超過 Request 的 50% 時就開始擴容；min 和 max 分別是最少和最多的 Pod 數量，這兩個值是 HPA 的邊界，無論負載多高都不會超過 max，無論負載多低都不會低於 min。這個指令背後其實也是建立一個 HPA 物件，只是省略了手動寫 YAML。

YAML 方式更詳細也更靈活，適合版本控制和生產環境管理。spec.scaleTargetRef 指定要控制哪個 Deployment（或其他支援的資源）。minReplicas 很重要，不要設成 0，原因是：如果縮到 0 了，沒有任何 Pod 在跑，Metrics Server 收集不到指標，HPA 就不知道什麼時候該擴回來，服務就永遠處於 0 個 Pod 的狀態，形成死結。maxReplicas 是硬上限，防止異常流量或系統 bug 造成無限擴容，把雲端帳單炸掉。

HPA 不止能用 CPU，metrics 也可以設定 memory，或是透過 Prometheus Adapter 使用自訂指標（比如每秒請求數 RPS、佇列長度等），這讓 HPA 的應用場景非常廣泛。但這是進階用法，今天先學 CPU 為主。

排錯小指南：HPA 設定好了但不擴容，最常見的原因有：一、忘記安裝 Metrics Server；二、容器沒有設定 CPU Request，HPA 計算不出百分比；三、TARGETS 顯示 unknown 代表拿不到指標，通常是 Metrics Server 問題；四、CPU 使用率一直低於目標，不需要擴容（這其實是正常的）。

查看 HPA 狀態用 kubectl get hpa，可以看到 TARGETS 欄位（current/target）、MINPODS/MAXPODS、REPLICAS。如果想看詳細的事件和描述，用 kubectl describe hpa [name]，裡面有擴縮的原因和時間。

HPA 有「冷卻時間」機制：擴容之後預設 3 分鐘內不會再次擴容；縮容之後預設 5 分鐘內不會再縮。這是為了避免 Pod 數量因為短暫的流量波動而不停跳動，造成系統不穩定。生產環境可以在 HPA 的 spec.behavior 裡自訂這些冷卻時間，這是 autoscaling/v2 才有的功能。`,
    duration: '12',
  },

  // ========== HPA 壓力測試 ==========
  {
    title: '壓力測試：觀察 HPA 動作',
    subtitle: '用 busybox 模擬 CPU 壓力',
    section: 'HPA 自動擴縮容',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">步驟一：建立一個 Deployment 和 HPA</p>
          <pre className="text-green-400 font-mono text-xs">{`kubectl create deployment stress-test \\
  --image=nginx --port=80
kubectl autoscale deployment stress-test \\
  --cpu-percent=30 --min=1 --max=8`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">步驟二：製造 CPU 壓力</p>
          <pre className="text-green-400 font-mono text-xs">{`kubectl run -i --tty load-generator \\
  --rm --image=busybox:1.28 \\
  --restart=Never -- /bin/sh -c \\
  "while true; do wget -q -O- \\
   http://stress-test; done"`}</pre>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">步驟三：觀察 HPA 自動擴縮</p>
          <pre className="text-green-400 font-mono text-xs">{`# 每秒更新，觀察 Pod 數量變化
kubectl get hpa stress-test --watch

# 另一個視窗觀察 Pod
kubectl get pods --watch`}</pre>
        </div>
        <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg">
          <p className="text-green-400 text-sm">
            🎯 預期結果：CPU 負載上升 → HPA 自動增加 Pod → 壓力分散
          </p>
        </div>
      </div>
    ),
    notes: `理論說了夠多，現在來實際看 HPA 動作。這個壓力測試示範是 HPA 最直觀的展示，你親眼看到 Pod 數量自動增加，對 HPA 的運作原理會有非常深的印象，比只讀 YAML 深十倍。

步驟一，建立一個簡單的 Deployment 和對應的 HPA。這裡用 nginx 作為示範服務，並且要先確認 nginx 的 Deployment 有設定 CPU Request（如果用 kubectl create deployment 快速建立的話，記得補上 resources）。我們把 CPU 目標設很低（30%），這樣比較容易觸發擴容，方便示範。min 設 1 所以平常只有一個 Pod，max 設 8 作為上限。

步驟二，用 busybox 這個輕量工具容器製造 CPU 壓力。busybox 是 Kubernetes 工程師最常用的偵錯工具之一，幾 MB 大小，但包含 wget、curl、sh 等很多基本工具。這個容器啟動後，會無限迴圈對 stress-test 的 nginx 發 HTTP 請求，每次請求都消耗一點 CPU。注意 --rm 參數，Ctrl+C 停掉後容器會自動刪除，不留垃圾。另外 -i --tty 讓你能看到輸出，wget 的回應會持續滾動顯示。

步驟三，在另一個終端機視窗用 --watch 持續觀察 HPA 狀態。你會看到 TARGETS 那欄慢慢從比如 5%/30% 變成 40%/30%、80%/30%，超過 30% 之後，HPA 就會計算新的目標 Pod 數量並更新 REPLICAS。從 1 開始，每隔 15 秒（HPA 的評估週期）可能變成 2、3、更多，最多到 8。

等到你按 Ctrl+C 停掉 load-generator，CPU 負載開始下降，不過注意：縮容不會立刻發生，HPA 有 5 分鐘的縮容冷卻期，確保負載是真的降下來而不是短暫波動。5 分鐘後，你會看到 Pod 數量慢慢縮回到 1。

這個完整的擴縮循環就是 HPA 在生產環境的工作日常：偵測負載 → 計算目標 Pod 數 → 擴容消化流量 → 負載下降 → 等待冷卻 → 縮容節省成本。一家做外送服務的公司，用 HPA 在午餐和晚餐高峰時自動把 API 服務從 5 個 Pod 擴到 20 個，高峰過後縮回 5 個，一個月省了大概 30% 的雲端費用。這就是 HPA 的商業價值！`,
    duration: '8',
  },

  // ========== DaemonSet 概念 ==========
  {
    title: 'DaemonSet',
    subtitle: '每個節點跑一個 Pod',
    section: 'DaemonSet',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4 py-2">
          {['Node 1', 'Node 2', 'Node 3'].map((node, i) => (
            <div key={i} className="bg-slate-800/70 border border-slate-600 p-4 rounded-lg text-center">
              <p className="text-k8s-blue font-semibold text-sm">{node}</p>
              <div className="mt-2 bg-green-900/30 border border-green-700 px-3 py-2 rounded">
                <p className="text-green-400 text-xs">📊 log-agent</p>
                <p className="text-slate-400 text-xs">DaemonSet Pod</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">什麼是 DaemonSet？</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 確保每個（或特定）節點有一個 Pod</li>
              <li>• 節點加入叢集 → 自動新增 Pod</li>
              <li>• 節點移除叢集 → 自動清除 Pod</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">常見使用場景</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>📊 日誌收集（Fluentd、Filebeat）</li>
              <li>📈 節點監控（Prometheus Node Exporter）</li>
              <li>🌐 CNI 網路插件（Calico、Flannel）</li>
              <li>🛡️ 安全代理（Falco）</li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm font-semibold">
            💡 vs Deployment：DaemonSet 不設 replicas，由節點數量決定 Pod 數量
          </p>
        </div>
      </div>
    ),
    notes: `進入下一個工作負載類型：DaemonSet。這個類型的應用場景非常明確，一旦理解了就很難用錯。

DaemonSet 的名字很有趣，daemon 是 Unix/Linux 系統裡「背景常駐服務」的意思，就像 Linux 上的 syslogd、sshd、cron 這類服務，默默在背景跑著、從不停歇。DaemonSet 就是「確保叢集每個節點上都跑著指定背景服務的機制」。

DaemonSet 和 Deployment 最大的差別在於：Deployment 說「我要 3 個 Pod，至於跑在哪些節點上不重要」；DaemonSet 說「我要在每個節點上都有一個 Pod，至於數量跟節點數一樣就好」。所以 DaemonSet 沒有 replicas 欄位，Pod 數量不由你決定，而是由叢集中節點的數量決定的。10 個節點就有 10 個 Pod，20 個節點就有 20 個 Pod，完全自動。

DaemonSet 的生命週期跟節點同步：當你新增一個節點到叢集，DaemonSet 控制器立刻在那個節點上排程並啟動一個新的 Pod；當你移除一個節點，那個節點上的 DaemonSet Pod 也會自動被清理掉，乾乾淨淨，不需要人工介入。

DaemonSet 最典型的使用場景是「基礎設施類的支援服務」，這些服務必須覆蓋到每個節點，才能達到完整的監控或管理效果：

日誌收集：Fluentd、Filebeat、Logstash 這類工具在每個節點上收集所有 Pod 的日誌（Pod 日誌寫到節點的 /var/log/pods 目錄），然後統一送到集中的日誌系統（Elasticsearch、Grafana Loki）。如果某個節點沒有日誌收集代理，那個節點上的日誌就會斷掉。

節點監控：Prometheus 的 Node Exporter 在每個節點上收集 CPU、記憶體、磁碟、網路等硬體層面的指標。每個節點需要一個，才能全面掌握整個叢集的硬體健康狀況。

網路插件（CNI）：Calico、Flannel、Weave Net 這些 CNI 插件本身也是用 DaemonSet 部署的，每個節點都需要有網路代理才能讓 Pod 之間互通。這是 Kubernetes 叢集最底層的基礎設施。

安全審計：Falco 這類運行時安全工具在每個節點上監控系統呼叫，偵測異常行為（比如有 Pod 突然開始讀取 /etc/passwd）。

小練習：kubectl get daemonset -n kube-system，你會看到叢集本身就有幾個 DaemonSet 在跑，這說明即使是 Kubernetes 自身也大量使用 DaemonSet 來管理基礎設施服務。`,
    duration: '10',
  },

  // ========== DaemonSet YAML ==========
  {
    title: 'DaemonSet YAML 設定',
    subtitle: '實作：部署日誌收集代理',
    section: 'DaemonSet',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">DaemonSet YAML 範例（日誌收集）</p>
          <pre className="text-slate-300 font-mono text-xs leading-relaxed">{`apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-agent
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: log-agent
  template:
    metadata:
      labels:
        app: log-agent
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd:v1.16
        resources:
          limits:
            memory: "200Mi"
            cpu: "100m"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
          readOnly: true
      volumes:
      - name: varlog
        hostPath:                  # 掛載節點的 /var/log
          path: /var/log`}</pre>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs mb-1">常用指令</p>
          <pre className="text-green-400 font-mono text-xs">{`kubectl get daemonset -n monitoring
kubectl get pods -n monitoring -o wide  # 確認每個節點都有 Pod`}</pre>
        </div>
      </div>
    ),
    notes: `DaemonSet 的 YAML 結構和 Deployment 非常相似，差別主要在 kind 是 DaemonSet，以及沒有 replicas 欄位。如果你習慣寫 Deployment，切換到 DaemonSet 幾乎沒有學習成本。

這個範例是部署 Fluentd 日誌收集代理，讓每個節點都有一個 Fluentd 收集日誌。重點看 volumes 和 volumeMounts 的部分：我們用了 hostPath 這種 Volume 類型，它直接把節點主機的 /var/log 目錄掛載到容器裡的 /var/log。這樣 Fluentd 就能讀取節點上所有的日誌檔案，包括系統日誌（/var/log/syslog）和所有 Pod 的日誌（/var/log/pods/）。這就是為什麼日誌收集一定要用 hostPath，因為 Pod 的日誌是寫到節點檔案系統上的，不在容器的 overlay filesystem 裡。

注意 readOnly: true 這個設定。日誌收集代理只需要讀取日誌，不需要寫入節點的 /var/log，所以設成唯讀。這是最小權限原則的體現，能用唯讀就用唯讀，降低安全風險。萬一這個容器被攻擊者入侵，唯讀掛載至少保護了節點的日誌不被篡改。

關於 namespace 的設計，把基礎設施服務（監控、日誌、安全）放在專用的 namespace（monitoring、kube-system、logging）是個好習慣，和業務應用程式隔離開來。這樣做的好處：namespace 有 ResourceQuota 可以限制資源用量、RBAC 可以精細控制存取權限、kubectl get pods 不同 namespace 不會互相干擾。

部署後用 kubectl get pods -n monitoring -o wide 可以看到每個 Pod 被分配到哪個節點，確認每個節點都有一個 Pod。如果某個節點缺少 Pod，最常見原因是那個節點有 taint（污點），而你的 DaemonSet 沒有設定對應的 tolerations 容忍這個 taint，所以排程器跳過了那個節點。這個概念叫做 Taint 和 Toleration，是 Kubernetes 進階調度的重要機制，有空可以深入研究。

一個安全警示：DaemonSet Pod 如果使用 hostPath 掛載節點目錄，表示這個容器有存取節點檔案系統的能力，安全風險較高。生產環境要謹慎選擇掛載範圍，並搭配 RBAC 和 Pod Security Standards 來限制 DaemonSet 的能力，避免成為攻擊跳板。`,
    duration: '10',
  },

  // ========== StatefulSet 概念 ==========
  {
    title: 'StatefulSet',
    subtitle: '有狀態應用的管理利器',
    section: 'StatefulSet',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm font-semibold mb-3">Deployment Pod（無狀態）</p>
            {['pod-abc12', 'pod-xyz89', 'pod-qwe45'].map((name, i) => (
              <div key={i} className="bg-slate-700/50 p-2 rounded mb-2 text-sm font-mono">
                <span className="text-slate-400">web-deploy-</span>
                <span className="text-yellow-400">{name.slice(4)}</span>
                <p className="text-xs text-slate-500">隨機名稱、隨機 IP、共用儲存</p>
              </div>
            ))}
          </div>
          <div className="bg-k8s-blue/10 border border-k8s-blue/50 p-4 rounded-lg">
            <p className="text-k8s-blue text-sm font-semibold mb-3">StatefulSet Pod（有狀態）</p>
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-slate-700/50 p-2 rounded mb-2 text-sm font-mono">
                <span className="text-slate-400">mysql-</span>
                <span className="text-green-400">{i}</span>
                <p className="text-xs text-slate-500">
                  穩定名稱 · 穩定 DNS · 專屬 PVC
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {[
            { icon: '🏷️', title: '穩定 Pod 名稱', desc: 'mysql-0, mysql-1...' },
            { icon: '🌐', title: '穩定 DNS', desc: '固定的網路標識' },
            { icon: '💾', title: '穩定儲存', desc: '每個 Pod 有專屬 PVC' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-2xl">{item.icon}</p>
              <p className="text-slate-300 font-semibold">{item.title}</p>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `StatefulSet 解決了一個 Deployment 解決不了的問題：有狀態應用程式的管理。這是很多工程師第一次嘗試在 Kubernetes 上跑資料庫時會踩到的坑。

什麼叫「有狀態」？簡單說，就是這個 Pod 有「個人資料」，不能隨意替換成另一個一模一樣的 Pod。比如 MySQL 的主節點和從節點分別儲存著不同的資料，或者雖然有資料複製但各自有獨立的 binlog 位置。你不能把主節點的 Pod 刪掉後，用一個全新的 Pod 來替代它，因為新 Pod 沒有原來的資料，也不知道自己在 MySQL 叢集裡應該扮演什麼角色。

我見過一個真實案例：有個小型公司把 PostgreSQL 用 Deployment 部署到 Kubernetes，沒有掛 PVC，也沒有用 StatefulSet。結果有一天工程師不小心執行了 kubectl rollout restart，所有 Pod 被刪除重建，但新 Pod 的資料是空的，三個月的業務資料就這樣消失了。這個故事告訴我們：有狀態的服務一定要認真對待。

對比一下 Deployment 和 StatefulSet 的 Pod 有什麼不同：

Deployment 的 Pod 名稱是隨機後綴的（web-deploy-7d9b-abc12），每次 Pod 重建，名字變、IP 變、分配到哪個節點也可能變，這些 Pod 是「可互換的」，任何一個頂替任何一個都沒問題，因為它們是無狀態的。

StatefulSet 的 Pod 名稱是固定有序號的（mysql-0、mysql-1、mysql-2），序號從 0 開始，永遠不變。Pod 被刪除後重建，還是叫 mysql-0，還是掛同一個 PVC，還是有同一個 DNS 名稱。這個 Pod 是不可替換的，它有自己的「身份」。

StatefulSet 的三大核心保證：

第一，穩定的 Pod 名稱和序號。mysql-0 永遠是 mysql-0，重啟幾次都不會變。這讓應用程式可以用固定的名字來識別特定的節點，比如 Kafka 的 broker ID 就可以對應 Pod 的序號。

第二，穩定的網路標識。配合 Headless Service（clusterIP: None），每個 Pod 都有固定的 DNS 名稱：mysql-0.mysql.default.svc.cluster.local。其他服務可以直接定址到特定的 Pod，不需要透過 Service 的負載均衡。這是 MySQL 主從複製能正確設定 master host 的關鍵。

第三，穩定的儲存。StatefulSet 透過 volumeClaimTemplates 為每個 Pod 自動建立獨立的 PVC，Pod-0 有自己的 PVC、Pod-1 有自己的 PVC，互不干擾。Pod 重建後 Kubernetes 確保還是掛同一個 PVC，資料完整保留。

這三大保證讓 StatefulSet 非常適合管理資料庫（MySQL、PostgreSQL）、分散式儲存（Cassandra、MongoDB Replica Set）、訊息佇列（Kafka）等有狀態的中介軟體。`,
    duration: '10',
  },

  // ========== StatefulSet vs Deployment ==========
  {
    title: 'StatefulSet YAML 與 vs Deployment',
    subtitle: '有什麼不同？何時選哪個？',
    section: 'StatefulSet',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">StatefulSet 關鍵 YAML 欄位</p>
          <pre className="text-slate-300 font-mono text-xs">{`apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: "mysql"     # 必填！對應 Headless Service
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:    # 為每個 Pod 自動建立 PVC
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi`}</pre>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          {[
            { label: '選 Deployment', items: ['Web 服務', 'API Server', '無狀態微服務'], color: 'bg-blue-900/30 border-blue-700', textColor: 'text-blue-400' },
            { label: '選 StatefulSet', items: ['MySQL / PostgreSQL', 'Kafka / RabbitMQ', 'Elasticsearch'], color: 'bg-green-900/30 border-green-700', textColor: 'text-green-400' },
            { label: '選 DaemonSet', items: ['日誌收集', '節點監控', 'CNI 插件'], color: 'bg-purple-900/30 border-purple-700', textColor: 'text-purple-400' },
          ].map((col, i) => (
            <div key={i} className={`${col.color} border p-3 rounded-lg`}>
              <p className={`${col.textColor} font-semibold mb-2`}>{col.label}</p>
              {col.items.map((item, j) => (
                <p key={j} className="text-slate-300">{item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `StatefulSet 的 YAML 結構和 Deployment 很像，但有幾個關鍵差別，搞清楚這些差別就能正確使用 StatefulSet。

第一個關鍵差別：serviceName 是必填欄位。StatefulSet 需要配合一個 Headless Service（spec.clusterIP: None）才能讓每個 Pod 有固定的 DNS 名稱。serviceName 就是指定那個 Headless Service 的名字。當 Headless Service 叫 mysql 時，Pod mysql-0 的完整 DNS 就是 mysql-0.mysql.default.svc.cluster.local。記得要單獨建立這個 Headless Service，不要忘了這一步，不然 StatefulSet 能跑起來，但 Pod 之間的 DNS 定址會有問題。

第二個關鍵差別：volumeClaimTemplates 是 StatefulSet 特有的欄位，Deployment 完全沒有這個。它定義了 PVC 的模板，StatefulSet 控制器會根據這個模板，為每個 Pod 自動建立一個獨立的 PVC。Pod 0 對應 data-mysql-0，Pod 1 對應 data-mysql-1，以此類推，命名規則是：template 的 name + 連接符 + StatefulSet 名稱 + 連接符 + Pod 序號。當 Pod 被刪除重建後，Kubernetes 確保新的 Pod 還是掛載同一個 PVC，資料完全保留，這是 StatefulSet 最核心的能力。

重要注意事項：刪除 StatefulSet 時，PVC 不會一起被刪除，需要手動清理。這是 Kubernetes 故意的設計，保護你不會因為一個 kubectl delete 就把所有資料都刪光。清理時記得先確認 PVC 裡的資料是否已經備份，然後再手動 kubectl delete pvc。

StatefulSet 的 Pod 建立和刪除都有嚴格的順序：建立時從序號 0 開始，等 Pod-0 變成 Ready 才建立 Pod-1，以此類推，一個接一個。刪除時反向，從最大序號開始，反向刪除。這個設計確保了主從架構的正確初始化順序，比如 MySQL 主節點（mysql-0）一定先啟動，從節點才能跟主節點建立複製關係。

工作負載選型決策樹，只要回答三個問題就能選對：問題一：需要在每個節點都跑一個 Pod 嗎？是 → DaemonSet；否 → 下一題。問題二：Pod 需要穩定的身份、固定 DNS、或獨立的持久儲存嗎？是 → StatefulSet；否 → 下一題。問題三：其他一般服務 → Deployment。這三個問題能幫你在 99% 的情況下做出正確選擇，剩下的 1% 是需要 Job 或 CronJob 的批次工作，那是下一堂課的主題。`,
    duration: '10',
  },

  // ========== 課程總結 ==========
  {
    title: '課程總結',
    subtitle: '工作負載管理重點回顧',
    section: '總結',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: '🚀',
              title: 'Deployment',
              points: ['RollingUpdate 零停機更新', 'Recreate 適合不相容版本升級', 'rollout undo 快速回滾'],
              color: 'bg-blue-900/30 border-blue-700',
              textColor: 'text-blue-400',
            },
            {
              icon: '❤️',
              title: '健康檢查',
              points: ['Liveness → 失敗就重啟', 'Readiness → 失敗退出 Service', 'Startup → 保護慢啟動應用'],
              color: 'bg-red-900/30 border-red-700',
              textColor: 'text-red-400',
            },
            {
              icon: '⚖️',
              title: '資源管理',
              points: ['Request = 排程依據', 'Limit = 使用上限', 'QoS 決定驅逐優先順序'],
              color: 'bg-yellow-900/30 border-yellow-700',
              textColor: 'text-yellow-400',
            },
            {
              icon: '📈',
              title: 'HPA',
              points: ['需要 Metrics Server', 'CPU Request 是計算基礎', 'minReplicas 不要設 0'],
              color: 'bg-green-900/30 border-green-700',
              textColor: 'text-green-400',
            },
            {
              icon: '🛡️',
              title: 'DaemonSet',
              points: ['每個節點一個 Pod', '節點加入自動部署', '適合監控 / 日誌收集'],
              color: 'bg-purple-900/30 border-purple-700',
              textColor: 'text-purple-400',
            },
            {
              icon: '🗄️',
              title: 'StatefulSet',
              points: ['穩定名稱：mysql-0, mysql-1', '穩定儲存：每 Pod 專屬 PVC', '適合資料庫 / 訊息佇列'],
              color: 'bg-orange-900/30 border-orange-700',
              textColor: 'text-orange-400',
            },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border p-3 rounded-lg`}>
              <p className={`${item.textColor} font-bold mb-2`}>
                {item.icon} {item.title}
              </p>
              <ul className="text-slate-300 text-xs space-y-1">
                {item.points.map((p, j) => (
                  <li key={j}>• {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `好，讓我們把今天早上學到的東西做個完整的總結。內容很多，但每個知識點都非常實用，是 Kubernetes 生產環境的日常。

Deployment 深入：今天我們不只是「會用」Deployment，而是深入理解了 Pod 模板的設計細節，特別是 selector.matchLabels 和 template.labels 必須一致這個關鍵點，以及 resources 欄位的正確設定方式。更新策略有兩種：RollingUpdate 是零停機更新，maxUnavailable=0、maxSurge=1 是推薦的生產設定；Recreate 適合新舊版本有不相容問題的場合，接受短暫停機。rollout undo 是你的後悔藥，出問題馬上用，幾十秒就能恢復。

健康檢查：三種 Probe 各司其職，不能混淆。Liveness Probe 確保容器本身存活，失敗就重啟；Readiness Probe 確保容器可以接流量，失敗就從 Service 移除但不重啟；Startup Probe 給慢啟動應用保護時間，期間暫停 Liveness 的檢查。三種 Probe 都支援 httpGet、tcpSocket、exec 三種探測方式。Liveness Probe 只檢查自身，不要把外部依賴加進去，避免雪崩效應。

資源管理：Request 是排程依據，告訴 Kubernetes「我至少需要這麼多」；Limit 是硬上限，CPU 超過被節流（throttle），Memory 超過被 OOMKill。兩個都設才是最佳實踐。QoS Class 由 Request 和 Limit 的設定組合自動決定：req==limit 是 Guaranteed（最高保障）；有設 req 或 limit 是 Burstable（中等）；都沒設是 BestEffort（最低，不建議生產使用）。節點資源緊張時，BestEffort 最先被驅逐，Guaranteed 最後。

HPA 自動擴縮：按需調整 Pod 數量，高峰擴容、低谷縮容，節省成本又能扛流量。前提：安裝 Metrics Server、設定 CPU Request、有 Deployment。設計要點：minReplicas 至少 2、maxReplicas 設合理上限、autoscale/v2 版本支援更豐富的指標和行為設定。

DaemonSet：「每個節點一個 Pod」，節點加入自動部署、節點離開自動清理。適合日誌收集（Fluentd、Filebeat）、節點監控（Node Exporter）、網路插件（Calico、Flannel）、安全審計（Falco）等基礎設施服務。用 hostPath 掛載節點目錄時注意安全，搭配 readOnly 和最小權限原則。

StatefulSet：解決有狀態應用的三大難題：穩定 Pod 名稱（mysql-0 永遠是 mysql-0）、穩定網路 DNS（配合 Headless Service）、穩定獨立儲存（volumeClaimTemplates 為每個 Pod 建立專屬 PVC）。Pod 建立和刪除有嚴格順序，保護主從架構的正確初始化。適合資料庫（MySQL、PostgreSQL）、訊息佇列（Kafka）、分散式儲存（Cassandra）。

選型決策方法：每個節點都要？DaemonSet；需要穩定身份和獨立儲存？StatefulSet；其他？Deployment。記住這個決策樹，你就不會選錯了。

下午我們繼續學習 Job、CronJob，以及 Namespace 和資源配額管理。今天的知識量比較大，有問題隨時提，也可以趁午飯時間消化一下。午飯後見！`,
    duration: '10',
  },
]
