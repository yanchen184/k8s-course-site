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

這四種工作負載各有各的使用場景，課程結束後你應該能夠判斷什麼情況要用哪一種。準備好了嗎？我們開始！`,
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
    notes: `在進入今天的主題之前，先花五分鐘複習上一堂課學到的東西。

上一堂課我們學了應用程式的「周邊支援」：ConfigMap 和 Secret 負責管理設定和敏感資料，讓設定和程式碼分離；Volume 和 PVC 處理儲存問題，讓資料能持久保存；Service 負責讓 Pod 可以被訪問到，提供穩定的網路端點；Ingress 則是 HTTP 層的路由，讓外部流量可以根據域名或路徑導向不同的服務。

今天我們的重點轉移了。我們不再關注「周邊」，而是回到「工作負載本身」。也就是說：你已經知道怎麼讓 Pod 跑起來，怎麼讓 Pod 能被訪問到。今天要學的是：怎麼讓 Pod 跑得更穩、更健康、更有效率，以及在不同場景下選擇正確的工作負載類型。

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
    notes: `好，讓我們深入 Deployment。大家之前應該已經寫過簡單的 Deployment YAML，現在讓我們把每個欄位都搞清楚。

Deployment 的 YAML 分成幾個層次。最外層是 apiVersion 和 kind，這個大家都熟了。metadata 放名字和標籤。重點在 spec 裡面。

spec.replicas 決定要跑幾個 Pod 的副本。spec.selector.matchLabels 是 Deployment 用來「認領」Pod 的方式，Deployment 透過這個 label selector 知道哪些 Pod 是它管的。

spec.template 就是 Pod 模板，這是 Deployment 最核心的部分。每次 Deployment 建立或更新 Pod，都是用這個模板複製出來的。模板裡面的 metadata.labels 必須和外面 selector.matchLabels 完全一致，不然 Kubernetes 會報錯。

特別注意 resources 這個欄位，分成 requests 和 limits 兩部分。requests 告訴 Kubernetes 這個容器「至少需要」多少資源，Kubernetes 調度 Pod 到節點時，會根據 requests 來判斷節點有沒有足夠的空間。limits 則是「最多能用」多少資源，超過就會被限制或甚至殺掉。

CPU 的單位 100m 代表 0.1 個 CPU 核心，m 是 milliCPU 的意思。記憶體 128Mi 是 128 mebibytes。這些數字怎麼設定是有學問的，等一下資源管理那個章節會詳細說明。`,
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
    notes: `Deployment 的更新策略決定了「升級應用程式的時候，服務會不會中斷」。這是非常實用的知識，直接影響用戶體驗。

RollingUpdate 是預設策略，也是大多數情況下的最佳選擇。它的原理是：不要一次把所有舊 Pod 都砍掉，而是一批一批地替換。先新增幾個新版本的 Pod，等它們健康了，再刪掉幾個舊版本的 Pod，如此循環，直到全部更新完畢。這樣在整個更新過程中，服務都是可用的。

maxSurge 控制更新過程中最多可以「額外多出來」幾個 Pod。比如你原本有 3 個 Pod，maxSurge 設 1，更新時最多暫時有 4 個 Pod 在跑。maxUnavailable 控制更新過程中最多可以有幾個 Pod 不可用。設成 0 表示任何時候都不能有 Pod 停止服務，這樣就能達到真正的零停機更新。

Recreate 策略就簡單暴力很多，先把所有舊 Pod 全部刪掉，然後再建立新的 Pod。這段時間內服務是完全不可用的，所以會有停機時間。什麼時候用 Recreate 呢？通常是當新舊版本有資料庫 schema 不相容，或是應用程式不支援多版本共存的情況下。

還有一個相關指令要知道：kubectl rollout undo deployment/web-app 可以快速回滾到上一個版本，這是 RollingUpdate 的一大優點。

一個實務建議：生產環境幾乎都用 RollingUpdate，把 maxUnavailable 設成 0、maxSurge 設成 1，這樣更新時不會影響任何流量，如果新版本有問題，馬上 rollout undo 就能恢復。`,
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

三種 Probe 各有不同的用途：

Liveness Probe 是「活著嗎」的檢查。Kubernetes 定期問你的應用程式「你還好嗎？」如果回答不正確，代表應用程式可能卡住了（比如死鎖、記憶體洩漏到崩潰邊緣），這時候 Kubernetes 會重啟容器。注意：Liveness Probe 失敗不是從 Service 移除，而是直接重啟。

Readiness Probe 是「準備好了嗎」的檢查。容器不一定一啟動就能處理請求。比如 Spring Boot 應用程式要幾十秒才能完全啟動，資料庫連線要建立，快取要預熱。Readiness Probe 失敗時，Kubernetes 不會重啟容器，而是暫時把這個 Pod 從 Service 的轉發列表中移除，等它準備好再加回來。

Startup Probe 是給「慢啟動應用程式」用的。有些老系統啟動要兩三分鐘，如果用 Liveness Probe 來檢查，可能啟動途中就被重啟了，形成無限重啟的惡性循環。Startup Probe 的作用是：在 Startup Probe 成功之前，暫停 Liveness Probe 的檢查，讓容器有足夠的時間完成啟動。

這三種 Probe 可以同時設定，也可以只設定其中幾種，根據應用程式的特性來決定。`,
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

httpGet 是最常用的方式。Kubernetes 對指定的 HTTP endpoint 發 GET 請求，如果回應狀態碼是 200-399 就算健康，其他的就是失敗。幾乎所有 Web 應用程式都應該實作一個 /healthz 或 /health 的路徑，專門回傳健康狀態。這個端點通常只做輕量的檢查：應用程式本身是否正常、最基本的資料庫連線是否存在。

tcpSocket 方式更簡單，只嘗試跟指定 port 建立 TCP 連線，連得上就算健康，連不上就失敗。不需要應用程式層的配合，適合沒有 HTTP API 的服務，比如資料庫、Redis、MQTT broker。

exec 方式是在容器內執行一個指令，指令的回傳碼 0 代表健康，非 0 代表失敗。這是最靈活的方式，可以寫成任何複雜的檢查邏輯。上面例子用的是 cat /tmp/healthy，如果這個檔案存在就是健康。應用程式可以定期更新這個檔案來「投票」自己是健康的。

幾個重要的參數：initialDelaySeconds 是容器啟動後要等多久才開始第一次檢查，設太短的話容器還在啟動中就開始被檢查了，容易誤判失敗。periodSeconds 是多久檢查一次。failureThreshold 是連續失敗幾次才真的算失敗，可以避免偶發性錯誤就觸發重啟。

實務建議：Liveness Probe 不要設得太嚴格，避免正常波動就觸發重啟。Readiness Probe 可以設嚴格一點，確保只有真正準備好的 Pod 才接收流量。`,
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
    notes: `讓我們把三種 Probe 放在一起看，搞清楚它們的執行順序和相互關係。

執行順序是這樣的：容器啟動後，如果有設定 Startup Probe，Kubernetes 會先跑 Startup Probe，這個期間 Liveness 和 Readiness Probe 都是暫停的。等到 Startup Probe 成功，才開始同時執行 Liveness 和 Readiness 兩個 Probe。

Startup Probe 的 failureThreshold 非常關鍵。以上面的例子，failureThreshold 是 30，periodSeconds 是 10 秒，代表 Kubernetes 最多等 300 秒（5 分鐘）讓應用程式啟動。超過就重啟。這樣就算是很慢的應用程式也不會被 Liveness Probe 提前中斷。

Readiness 和 Liveness 的最大差別：Readiness 失敗只是「退出服務」，容器本身不受影響，等恢復後自動加回去。Liveness 失敗就是「被殺掉重啟」，容器是真的重新啟動一次。所以如果你的應用程式在高負載下響應變慢，這時候應該讓 Readiness 失敗（退出服務等恢復），而不是 Liveness 失敗（重啟可能讓情況更糟）。

一個常見的錯誤設計：把 Liveness Probe 設計成檢查外部依賴（比如資料庫連線）。這樣的話，資料庫一掛，所有 Pod 都會被重啟，但重啟也沒用因為資料庫還是掛的，反而造成雪崩。Liveness Probe 應該只檢查「應用程式本身的健康狀態」，外部依賴的檢查交給 Readiness Probe。`,
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
    notes: `資源管理是 Kubernetes 生產環境中非常重要的主題。設定不當可能造成一個應用程式把整個節點的資源吃光，影響同節點上的其他服務。

先說 Request。Request 是你告訴 Kubernetes「我這個容器至少需要這麼多資源才能正常運行」。Kubernetes 在排程 Pod 時，會找到有足夠「可用資源」的節點。可用資源的計算方式是：節點總資源減去已經被其他 Pod 的 Request 預留的資源。注意：這裡看的是 Request，不是實際使用量。

再說 Limit。Limit 是「容器最多能用多少資源」的上限。CPU 如果超過 Limit，Linux 的 cgroup 會限制 CPU 時間，容器會變慢，但不會被殺掉。Memory 就不一樣了，如果超過 Memory Limit，Linux 核心會觸發 OOMKill（Out of Memory Kill），直接把容器殺掉。所以 Memory Limit 要設得合理，太緊容易被 OOM，太寬鬆可能讓記憶體洩漏把節點拖垮。

CPU 單位：m 是 milliCPU，1000m 等於一個 CPU 核心。250m 就是四分之一個核心。現代伺服器有幾十個核心，把 CPU 細分成 milliCPU 讓資源分配更精細。Memory 單位：Mi 是 Mebibyte（1024×1024 bytes），Gi 是 Gibibyte（1024 MB）。別跟 MB（Megabyte，1000×1000 bytes）搞混了。

一個最佳實踐：Request 和 Limit 都設定，不要只設其中一個。如果都不設，那個容器可以無限制使用節點資源，非常危險。如果只設 Request 沒設 Limit，容器可以超用很多資源，在資源緊張時影響其他服務。合理的做法是：Request 設成平時的正常使用量，Limit 設成峰值用量的 1.5 到 2 倍。`,
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
    notes: `QoS Class（服務品質等級）是 Kubernetes 根據你設定的 Request 和 Limit 自動計算出來的，不需要你手動指定。它決定了當節點資源緊張時，哪些 Pod 會先被驅逐（evict）。

Guaranteed 是最高等級。條件是 CPU 和 Memory 的 Request 和 Limit 都要設定，而且兩者必須相等。只要滿足這個條件，Kubernetes 保證這些 Pod 在節點上有穩定的資源供應。當節點記憶體不足需要驅逐 Pod 時，Guaranteed 的 Pod 是最後被犧牲的。適合關鍵服務：資料庫、核心 API、付費服務。

Burstable 是中等等級。只要 Pod 有設定 Request 或 Limit（不需要兩者都設且相等），就會落在這個等級。這類 Pod 平時可能用不到 Limit 那麼多資源，但高峰時可以「突發」到 Limit 上限。大多數業務服務都是這個等級，在一般情況下不會有問題，但在節點資源緊張時，可能在 BestEffort Pod 之後被驅逐。

BestEffort 是最低等級。沒有設定任何 Request 或 Limit 的 Pod 就是 BestEffort。Kubernetes 對這類 Pod 沒有任何資源保證，節點資源一緊張，它們是第一個被趕走的。生產環境絕對不要用這個，但開發或測試環境的非關鍵工作可能可以接受。

如何查看 Pod 的 QoS 等級？用 kubectl describe pod [pod-name]，輸出裡面有 QoS Class 這個欄位。

一個設計建議：資料庫和狀態服務設 Guaranteed；一般業務服務設 Burstable；批次處理或臨時任務可以 Burstable 偏低 Request。千萬不要讓核心服務落到 BestEffort。`,
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
    notes: `休息結束，繼續！後半場第一個主題是 HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。

HPA 解決的問題是：流量不是固定的。白天流量大、晚上流量小；大促活動流量暴增、平常流量平穩。如果 Pod 數量是固定的，要麼平常浪費資源，要麼高峰撐不住。HPA 讓 Kubernetes 能夠根據實際負載自動調整 Pod 數量，負載高就多開幾個 Pod，負載低就縮回來，真正做到「按需使用」。

HPA 的工作原理很簡單：每隔 15 秒，HPA 控制器向 Metrics Server 查詢所有受管 Pod 的 CPU 或記憶體使用率，然後用公式計算出「目標 Pod 數量」，最後更新 Deployment 的 replicas 欄位。Deployment 就會按照新的 replicas 進行擴縮。

要使用 HPA，有幾個前提條件。第一個是 Metrics Server。Kubernetes 預設沒有內建 Metrics Server，需要另外安裝。Metrics Server 收集所有節點和 Pod 的 CPU、記憶體使用數據。上面的安裝指令是官方的一行安裝方式，把 components.yaml 套用到叢集就完成了。

第二個前提：容器必須設定 CPU Request。因為 HPA 計算 CPU 使用率的方式是「實際用量 / Request」，沒有 Request 就沒辦法計算百分比，HPA 就不知道什麼時候該擴容。

第三個前提：要有 Deployment。HPA 是透過修改 Deployment 的 replicas 來工作的，所以必須先有一個 Deployment。`,
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
    notes: `HPA 的設定方式有兩種，一種是快速指令，一種是 YAML 設定檔。

快速指令 kubectl autoscale 是最方便的方式，一行搞定。參數說明：cpu-percent 是目標 CPU 使用率，這裡設 50 代表當平均 CPU 使用率超過 Request 的 50% 時就開始擴容，低於某個閾值就縮容；min 和 max 分別是最少和最多的 Pod 數量。這個指令背後其實也是建立一個 HPA 物件，只是省略了手動寫 YAML。

YAML 方式更詳細也更靈活。spec.scaleTargetRef 指定要控制哪個 Deployment。minReplicas 很重要，不要設成 0（除非你真的要縮到 0），因為如果縮到 0 了，沒有 Pod 可以提供指標，HPA 就不知道什麼時候該擴回來。maxReplicas 是硬上限，防止異常情況下無限擴容，把你的雲端帳單炸掉。metrics 設定擴縮的依據，最常用的是 CPU 使用率，也可以設定記憶體或自訂指標。

一個很常見的問題：HPA 設定好了，但為什麼不擴容？最常見的原因有：忘記安裝 Metrics Server、容器沒有設定 CPU Request、Deployment 的 replicas 是固定的而不是由 HPA 控制。

查看 HPA 狀態用 kubectl get hpa，可以看到當前 Pod 數量、目標 CPU 使用率、實際 CPU 使用率。如果看到 TARGETS 顯示 unknown，通常是 Metrics Server 有問題。

HPA 有一個「冷卻時間」機制：擴容觸發後，預設 3 分鐘內不會再次擴容；縮容觸發後，預設 5 分鐘內不會再次縮容。這是為了防止 Pod 數量因為短暫波動而頻繁變動。`,
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
    notes: `理論說了夠多，現在來實際看 HPA 動作。這個示範是 HPA 最直觀的展示，你親眼看到 Pod 數量自動增加，會對 HPA 有很深的印象。

步驟一，建立一個簡單的 Deployment 和對應的 HPA。我們把 CPU 目標設很低（30%），這樣比較容易觸發擴容，方便示範。min 設 1 所以平常只有一個 Pod，max 設 8。

步驟二，用 busybox 這個小工具容器製造 CPU 壓力。這個 busybox 容器啟動後，會無限迴圈對 stress-test 的 nginx 發 HTTP 請求，持續消耗 CPU。注意加了 --rm 參數，Ctrl+C 停掉之後容器會自動刪除，不會留下垃圾。

步驟三，在另一個終端機視窗用 --watch 持續觀察 HPA 狀態。你會看到 TARGETS 那欄的百分比慢慢升高，超過 30% 之後，REPLICAS 欄位會開始增加，從 1 變 2，再變 3，甚至更多。

等到你按 Ctrl+C 停掉 load-generator，CPU 負載下降，稍等幾分鐘（HPA 縮容有冷卻時間），你會看到 Pod 數量慢慢縮回 1。

這個過程就是 HPA 的完整工作週期：偵測負載 → 計算需要幾個 Pod → 擴容 → 負載下降 → 縮容。在真實的生產環境中，這個機制能幫你在促銷活動時自動應對流量洪峰，活動結束後自動節省成本。非常強大！`,
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
    notes: `進入下一個工作負載類型：DaemonSet。

DaemonSet 的名字很有趣，daemon 是 Unix/Linux 系統裡「背景服務程序」的意思，DaemonSet 就是「在每個節點上跑一個背景服務的集合」。

DaemonSet 和 Deployment 最大的差別在於：Deployment 說「我要 3 個 Pod」；DaemonSet 說「我要在每個節點上都有一個 Pod」。所以 DaemonSet 的 Pod 數量不是由 replicas 決定的，而是由叢集中節點的數量決定的。10 個節點就有 10 個 Pod，20 個節點就有 20 個 Pod，完全自動。

當你新增一個節點到叢集，DaemonSet 自動在上面跑一個 Pod；當你移除一個節點，對應的 Pod 也自動被清理掉。不需要手動管理。

DaemonSet 最典型的使用場景是「基礎設施服務」，這些服務需要在每個節點上都有。比如日誌收集：Fluentd 或 Filebeat 在每個節點上收集那個節點的所有 Pod 的日誌，然後送到集中的日誌系統（Elasticsearch、Loki 等）。節點監控：Prometheus 的 Node Exporter 在每個節點上收集 CPU、記憶體、磁碟等硬體指標。網路插件：Calico、Flannel 這些 CNI 插件本身也是用 DaemonSet 部署的，每個節點都需要有網路代理。

你可能已經在用 DaemonSet 了而不自知：kubectl get daemonset -n kube-system，你會看到叢集本身就有幾個 DaemonSet 在跑。`,
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
    notes: `DaemonSet 的 YAML 結構和 Deployment 非常相似，差別主要在 kind 和沒有 replicas 欄位。

這個範例是部署 Fluentd 日誌收集代理，讓每個節點都有一個 Fluentd 收集日誌。重點看 volumes 和 volumeMounts 的部分，我們用了一種叫 hostPath 的 Volume 類型，它直接把節點主機上的 /var/log 目錄掛載到容器裡的 /var/log。這樣 Fluentd 就能讀取節點上所有的日誌檔案，包括系統日誌和所有 Pod 寫到節點的日誌。

注意 readOnly: true，日誌收集代理只需要讀取日誌，不需要寫入，設成唯讀可以提升安全性。

關於 namespace，把基礎設施服務放在專用的 namespace（比如 monitoring 或 kube-system）是個好習慣，和業務應用程式隔離開來。

部署後用 kubectl get pods -n monitoring -o wide 可以看到每個 Pod 被分配到哪個節點，確認每個節點都有一個 Pod 在跑。如果某個節點缺少 Pod，可能是那個節點有 taint（污點）導致 Pod 無法排程，這是一個進階主題，之後的課程會提到。

一個重要注意事項：DaemonSet Pod 使用 hostPath 掛載節點目錄時，有很高的權限，可以存取節點的檔案系統。要謹慎選擇掛載哪些目錄，避免安全漏洞。生產環境通常需要搭配 RBAC 和 PodSecurityPolicy 來限制 DaemonSet 的能力。`,
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
    notes: `StatefulSet 解決了一個 Deployment 解決不了的問題：有狀態應用程式的管理。

什麼叫「有狀態」？簡單說，就是這個 Pod 有「個人資料」，不能隨意替換。比如 MySQL 的主節點和從節點有不同的資料，你不能把主節點的 Pod 刪掉後，用一個隨機的新 Pod 來替代它，因為新 Pod 不知道自己要扮演主還是從，也沒有原來的資料。

對比一下 Deployment 和 StatefulSet 的 Pod：Deployment 的 Pod 名稱是隨機的（deployment-name-xxxx-yyyy），每次 Pod 重建，名字都會變，IP 也會變，分配到哪個 PVC 也是不確定的。StatefulSet 的 Pod 名稱是固定的（statefulset-name-0、statefulset-name-1...），序號從 0 開始，永遠不變。Pod 重建後還是用同一個名字、同一個 PVC、同一個網路標識。

StatefulSet 三大保證：第一，穩定的 Pod 名稱和序號，mysql-0 永遠是 mysql-0，不會換名字。第二，穩定的網路標識，配合 Headless Service，每個 Pod 有固定的 DNS 名稱，比如 mysql-0.mysql-headless-svc.default.svc.cluster.local，其他服務可以直接定址到特定的 Pod。第三，穩定的儲存，StatefulSet 為每個 Pod 自動建立獨立的 PVC，Pod 重建後還是掛載同一個 PVC，資料不會丟失。

這三個特性讓 StatefulSet 非常適合管理資料庫（MySQL、PostgreSQL）、分散式儲存（Cassandra、MongoDB Replica Set）、訊息佇列（Kafka）等有狀態的中介軟體。`,
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
    notes: `StatefulSet 的 YAML 和 Deployment 很像，但有幾個關鍵差別。

第一個差別：serviceName 是必填欄位。StatefulSet 需要配合一個 Headless Service（clusterIP: None 的 Service）才能讓每個 Pod 有固定的 DNS 名稱。serviceName 就是指定那個 Headless Service 的名字。沒有這個設定，StatefulSet 無法提供穩定的 DNS 標識。

第二個差別：volumeClaimTemplates。這是 StatefulSet 特有的欄位，Deployment 沒有。它定義了 PVC 的模板，StatefulSet 會根據這個模板，為每個 Pod 自動建立一個獨立的 PVC。Pod 0 對應 data-mysql-0，Pod 1 對應 data-mysql-1，以此類推。當 Pod 被刪除重建後，Kubernetes 確保新的 Pod 還是掛載同一個 PVC。注意：PVC 不會隨 StatefulSet 一起刪除，需要手動清理，這是保護資料的安全設計。

StatefulSet 的 Pod 建立和刪除也有固定順序：建立時從序號 0 開始，一個接一個，等前一個 Ready 才建立下一個；刪除時從最大序號開始，反向刪除。這確保了主從架構的正確初始化順序。

那麼，如何選擇工作負載類型？可以問自己三個問題：是否需要在每個節點都跑一個？用 DaemonSet。是否需要穩定的網路標識或獨立儲存？用 StatefulSet。其他一般服務？用 Deployment。這三個問題能幫你在絕大多數情況下做出正確選擇。`,
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
    notes: `好，讓我們把今天早上學到的東西做個總結。

Deployment 深入：我們學了 Pod 模板的詳細設計，特別是 resources 欄位的設定。更新策略有兩種，RollingUpdate 是零停機更新，適合大多數情況；Recreate 是先全刪再重建，適合新舊版本不相容的場合。遇到問題還能用 rollout undo 快速回滾，這是非常安全的操作方式。

健康檢查：三種 Probe 各有職責。Liveness 確保容器活著，失敗就重啟。Readiness 確保容器可以接受流量，失敗就暫時退出 Service。Startup 保護慢啟動的應用程式。三種 Probe 都支援 httpGet、tcpSocket、exec 三種探測方式。

資源管理：Request 是告訴 Kubernetes 「我需要這麼多資源」，是排程的依據。Limit 是「最多只能用這麼多」，CPU 超過被節流，Memory 超過被 OOMKill。QoS Class 由 Request 和 Limit 的設定方式決定，Guaranteed 最穩，BestEffort 最不穩，生產環境至少要 Burstable。

HPA：讓 Pod 根據負載自動擴縮，需要先安裝 Metrics Server，容器要設定 CPU Request，minReplicas 不要設成 0，maxReplicas 要設合理上限。

DaemonSet：確保每個節點都有一個 Pod，適合監控代理、日誌收集、網路插件等基礎設施服務。

StatefulSet：管理有狀態應用，提供穩定的 Pod 名稱、穩定的 DNS、穩定的獨立儲存，適合資料庫和訊息佇列等有狀態中介軟體。

下午我們會繼續學習 Job、CronJob，以及工作負載的進階操作。午飯後見！`,
    duration: '10',
  },
]
