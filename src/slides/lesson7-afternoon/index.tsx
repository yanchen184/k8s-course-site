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
    title: "實戰演練與課程總結",
    subtitle: "第七堂下午 — 把學過的一切串在一起",
    section: "第七堂下午",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            🏆
          </div>
          <div>
            <p className="text-2xl font-semibold">實戰演練與課程總結</p>
            <p className="text-slate-400">13:00–17:00（240 分鐘）</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">今天下午</p>
            <p>三場實戰演練 + CI/CD + 最佳實踐</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">課程終點</p>
            <p>畢業典禮 & Q&A</p>
          </div>
        </div>
        <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold">🎯 今天的目標</p>
          <p className="text-green-200">用一個完整的三層式應用，把七天所學全部串連起來</p>
        </div>
      </div>
    ),
    notes: `歡迎大家回來！吃飽了嗎？精神有沒有好一點？今天下午是整個七天課程的最後一個下午，也是最重頭的實戰時段。我知道大家午餐後可能有點昏昏欲睡，但我保證，今天下午的內容會讓你們清醒過來，因為我們要動手做很多事情。

這個下午我們不會再學太多新東西，而是把這七天學的所有概念，用實際的動手操作把它們串在一起。學 Kubernetes 最大的陷阱就是「懂了很多概念，但一旦自己動手就卡關」——今天下午就是要打破這個障礙。

我相信學一個技術最好的方式，不是背文件，而是在一個完整的場景裡，把每個工具都用在它該用的地方，讓你真正體會為什麼需要它。我在業界帶過很多工程師，凡是能在實際專案裡跑過一遍完整流程的，技術成長速度都是其他人的兩三倍。

今天下午的主線是：先做一個完整的三層式應用部署，然後故意把它弄壞，練習排查故障，接著設定高可用配置，最後看看 CI/CD 怎麼跟 K8s 整合。這整個流程，就是你們將來在真實工作中會一直重複的循環：部署、壞掉、排查、修好、優化。準備好了嗎？我們開始！`,
    duration: "3"
  },

  // ========== 下午課程大綱 ==========
  {
    title: "下午課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-3">
        {[
          { time: "13:00–13:15", topic: "開場回顧：七堂課精華快速複習", icon: "🔁" },
          { time: "13:15–14:00", topic: "實戰演練一：三層式應用部署", icon: "🏗️" },
          { time: "14:00–14:30", topic: "實戰演練二：故障排查三連擊", icon: "🔍" },
          { time: "14:30–14:45", topic: "休息時間", icon: "☕" },
          { time: "14:45–15:15", topic: "實戰演練三：HPA + PDB 高可用配置", icon: "📈" },
          { time: "15:15–15:40", topic: "CI/CD 與 GitOps：GitHub Actions + ArgoCD", icon: "🔄" },
          { time: "15:40–16:00", topic: "生產環境最佳實踐整理", icon: "🛡️" },
          { time: "16:00–16:15", topic: "課程總結：七天學習路徑回顧", icon: "🗺️" },
          { time: "16:15–17:00", topic: "畢業典禮與 Q&A", icon: "🎓" },
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
    notes: `讓我們看一下今天下午的完整安排。整個下午分成九個段落，我帶大家快速瀏覽一遍，讓你心裡有個底。

一開始 15 分鐘的開場回顧，我會帶大家快速掃過這七天的重點，找回手感，也讓剛才午休睡太熟的同學重新 boot up。

接著是最重頭的三場實戰演練：13:15 到 14:00 是第一場，完整部署一個三層式應用，從建立命名空間到瀏覽器看到頁面。14:00 到 14:30 是第二場，故障排查三連擊，我們會故意製造三種常見錯誤來練習診斷。中間 14:30 到 14:45 是休息時間，大家可以趁機對一下剛才不懂的地方。

休息後，14:45 到 15:15 是第三場實戰，HPA 加上 PDB 的高可用配置，這是讓應用在生產環境穩定運行的關鍵設定。15:15 到 15:40 介紹 CI/CD 和 GitOps 流程，這是現代工程團隊的日常，值得好好了解。15:40 到 16:00 整理生產環境最佳實踐，把七天學的技術串成一個可以帶回去用的清單。

最後一個小時，先做七天學習路徑的總回顧，然後進行畢業典禮和 Q&A。大家有任何問題，在 Q&A 時間盡情提出，我們把整個課程好好收個尾。今天下午的安排很緊湊，跟緊我，我們一起衝！`,
    duration: "2"
  },

  // ========== 開場回顧 ==========
  {
    title: "七天學習，快速回顧",
    subtitle: "你走了多遠？",
    section: "開場回顧",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { day: "Day 1", topic: "Linux 基礎", icon: "🐧", detail: "命令列、檔案系統、權限" },
            { day: "Day 2", topic: "Docker 容器", icon: "🐳", detail: "映像、容器、Dockerfile" },
            { day: "Day 3", topic: "K8s 入門", icon: "☸️", detail: "Pod、Deployment、Service" },
            { day: "Day 4", topic: "進階資源", icon: "📦", detail: "ConfigMap、Secret、PV/PVC" },
            { day: "Day 5", topic: "網路與安全", icon: "🔒", detail: "Ingress、NetworkPolicy、RBAC" },
            { day: "Day 6", topic: "可觀測性", icon: "📊", detail: "Prometheus、Grafana、logging" },
            { day: "Day 7", topic: "實戰整合", icon: "🏆", detail: "今天，把一切串在一起！" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${i === 6 ? 'bg-k8s-blue/20 border-k8s-blue' : 'bg-slate-800/50 border-slate-700'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className={`font-bold text-sm ${i === 6 ? 'text-k8s-blue' : 'text-slate-400'}`}>{item.day}</span>
              </div>
              <p className={`font-semibold ${i === 6 ? 'text-white' : 'text-slate-300'}`}>{item.topic}</p>
              <p className="text-slate-500 text-xs">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `在開始今天的實戰之前，讓我帶大家快速回顧一下這七天走過的路。這不是重新上課，而是幫大家把記憶的「快取」暖機一下，讓等一下動手的時候不用現查。

Day 1，我們從 Linux 命令列開始。很多人那天第一次用 SSH 連進一台遠端伺服器，第一次在黑色視窗裡打指令。我記得有同學問我 ls 和 dir 有什麼差別——那個問題很正常，因為這是真的從零開始。我們學了基本的檔案操作、目錄結構、檔案權限的 rwx 讀法，還有如何用 grep 找東西、用 pipe 串接指令。這些技能現在天天都在用，你進 Pod 裡除錯的時候、查 log 的時候，用的都是 Day 1 的東西。

Day 2，進入 Docker。我們理解了「容器」這個革命性的概念：把應用程式和它所有的依賴打包成一個可移植的映像，不管在哪台機器上都能跑出一樣的結果。我們學了怎麼寫 Dockerfile，怎麼 build 映像，怎麼 run 容器，怎麼把映像 push 到 Registry。容器是 Kubernetes 的前提，沒有 Day 2，就沒有後面的所有東西。

Day 3，正式進入 Kubernetes。這一天是很多人的轉折點，因為 K8s 的概念層次比 Docker 複雜很多。我們學了 Pod 是什麼、為什麼需要 Deployment 而不是直接管理 Pod、Service 如何讓 Pod 對外提供穩定的存取點。還記得第一次 kubectl apply 成功的感覺嗎？那個瞬間真的很有成就感。

Day 4，深入設定與儲存。ConfigMap 讓你把設定值從程式碼裡拆出來，不同環境可以用不同設定。Secret 讓你安全地管理密碼和憑證，不把敏感資訊寫死在 YAML 裡。PersistentVolume 和 PVC 解決了容器重啟後資料消失的問題，讓資料庫這類有狀態的應用也能在 K8s 上跑。

Day 5，網路與安全。Ingress 讓外部的流量有個統一的入口，根據網域名稱或路徑分發到不同的服務。NetworkPolicy 讓你控制 Pod 之間的通訊，就像在應用層面架了防火牆。RBAC 管理誰可以對叢集做什麼操作，這是企業環境的必備。

Day 6，可觀測性。系統上線之後，你怎麼知道它有沒有問題？怎麼在問題發生前就察覺到異常？Prometheus 收集指標，Grafana 畫出漂亮的儀表板，Loki 做日誌聚合，再加上告警規則，讓你的系統「透明」起來。

Day 7 就是今天。我們要用一個真實的場景，把前六天所有的知識點全部用一遍。你會發現，每一個你曾經「好像懂了」的概念，放到整合場景裡都會重新變清晰，因為你看到了它在整個系統裡扮演的角色。這種體驗是任何文件都無法給你的。開始吧！`,
    duration: "10"
  },

  // ========== 實戰一：架構說明 ==========
  {
    title: "實戰演練一：三層式應用部署",
    subtitle: "Frontend + Backend + Database",
    section: "實戰演練一",
    content: (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 text-4xl">
          <div className="bg-blue-900/50 border border-blue-700 p-4 rounded-lg text-center">
            <p>🌐</p>
            <p className="text-sm text-blue-400 mt-1">Frontend</p>
            <p className="text-xs text-slate-500">React/Nginx</p>
          </div>
          <span className="text-k8s-blue text-3xl">→</span>
          <div className="bg-green-900/50 border border-green-700 p-4 rounded-lg text-center">
            <p>⚙️</p>
            <p className="text-sm text-green-400 mt-1">Backend</p>
            <p className="text-xs text-slate-500">Node.js/Python</p>
          </div>
          <span className="text-k8s-blue text-3xl">→</span>
          <div className="bg-orange-900/50 border border-orange-700 p-4 rounded-lg text-center">
            <p>🗄️</p>
            <p className="text-sm text-orange-400 mt-1">Database</p>
            <p className="text-xs text-slate-500">PostgreSQL</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
          <p className="text-k8s-blue font-semibold">今天要用到的 K8s 資源：</p>
          <div className="grid grid-cols-3 gap-2">
            {["Deployment × 3", "Service × 3", "Ingress × 1", "ConfigMap × 2", "Secret × 1", "PVC × 1"].map((r, i) => (
              <span key={i} className="bg-slate-700 px-2 py-1 rounded text-slate-300">{r}</span>
            ))}
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">🎯 目標</p>
          <p>從零開始，部署一個可從瀏覽器訪問的完整 Web 應用</p>
        </div>
      </div>
    ),
    notes: `好，我們正式進入第一場實戰演練，部署一個三層式 Web 應用程式。在開始動手之前，我想先花幾分鐘說明架構，讓大家對整體有個清楚的畫面，這樣等一下每個步驟的目的就會很清楚。

三層式架構是業界最常見的 Web 應用架構。前端（Frontend）負責使用者看到的介面，通常是用 React、Vue 這類框架寫的，打包後用 Nginx 伺服靜態檔案。後端（Backend）負責業務邏輯，接收前端的 API 請求、處理資料、和資料庫溝通，用 Node.js、Python、Go 都常見。資料庫（Database）負責持久化儲存，這裡我們用 PostgreSQL。

把這三層都放進 Kubernetes 之後，各層之間的溝通是透過 Kubernetes Service 完成的。前端容器打 API 請求到 backend-svc，後端連資料庫連到 postgres-svc。從外部進來的流量則透過 Ingress 轉發：根路徑轉到前端，/api 路徑轉到後端。整個流量路徑是：使用者 → Ingress Controller → Frontend Service → Frontend Pod，或者 使用者 → Ingress → Backend Service → Backend Pod → Postgres Service → Postgres Pod。

我們這個演練會用到幾乎所有我們學過的資源類型：三個 Deployment、三個 Service、一個 Ingress、兩個 ConfigMap（一個存後端設定、一個存前端環境變數）、一個 Secret（存資料庫密碼）、一個 PVC（讓資料庫資料持久化保存，不會因為 Pod 重啟而消失）。

這不是 Hello World，這是接近真實工作環境的部署場景。從現在開始，請打開你的終端機，我們要一步一步從最底層的資料庫開始往上建。依賴順序決定部署順序：資料庫先起來，後端才能連上去；後端先起來，前端才能打到 API。跟我來！`,
    duration: "5"
  },

  // ========== 實戰一：部署 DB + Backend ==========
  {
    title: "🔨 動手做：部署 Database & Backend",
    section: "實戰演練一",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 1. 建立命名空間 & Secret</p>
          <p className="text-green-400">kubectl create ns demo-app</p>
          <p className="text-green-400">{"kubectl create secret generic db-secret \\"}</p>
          <p className="text-green-400">{"  --from-literal=POSTGRES_PASSWORD=secret123 \\"}</p>
          <p className="text-green-400">{"  -n demo-app"}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 2. 部署 PostgreSQL（附 PVC）</p>
          <p className="text-green-400">kubectl apply -f postgres-pvc.yaml -n demo-app</p>
          <p className="text-green-400">kubectl apply -f postgres-deploy.yaml -n demo-app</p>
          <p className="text-green-400">kubectl apply -f postgres-svc.yaml -n demo-app</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 3. 部署 Backend API</p>
          <p className="text-green-400">kubectl apply -f backend-configmap.yaml -n demo-app</p>
          <p className="text-green-400">kubectl apply -f backend-deploy.yaml -n demo-app</p>
          <p className="text-green-400">kubectl apply -f backend-svc.yaml -n demo-app</p>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">✅ 驗證步驟</p>
          <p className="font-mono text-yellow-200">kubectl get pods -n demo-app</p>
          <p className="text-yellow-200">確認所有 Pod 都是 Running</p>
        </div>
      </div>
    ),
    notes: `開始動手了。打開你的終端機，確認你的 kubeconfig 是指向正確的叢集。今天的演練我們全程在 demo-app 這個命名空間裡操作，所以每個指令都要記得加 -n demo-app，或者等一下我會示範怎麼設定預設命名空間，這樣就不用每次打了。

第一步：建立命名空間。kubectl create ns demo-app。命名空間的好處是隔離性，這個演練的所有資源都在這個 ns 裡，等一下演練結束，一個 kubectl delete ns demo-app 就可以把所有資源清乾淨，不會留下殘骸影響其他工作。如果你們的叢集是共用的，命名空間也是劃分各個團隊資源的邊界。

第二步：建立 Secret。我們用 --from-literal 直接在命令列塞入資料庫密碼。這個指令背後做的事情是：把你傳入的值用 base64 編碼後，存到 etcd 裡。注意 base64 不是加密，任何人拿到 Secret 物件都可以 base64 decode 出原始值。所以在正式生產環境，我們會用 Vault、External Secrets Operator 或 Sealed Secrets 來做更安全的 Secret 管理，不會把密碼直接存在叢集的 etcd 裡。但在今天的練習環境，--from-literal 就夠用了。

第三步：部署 PostgreSQL。注意我們是先 apply PVC，再 apply Deployment。順序很重要！先建立 PersistentVolumeClaim，讓儲存空間準備好，等 Deployment 起來的時候掛載點已經就位。postgres-pvc.yaml 裡面定義了我們需要多少空間（通常是幾 GB）和存取模式（ReadWriteOnce，表示一次只能被一個節點掛載，適合資料庫）。

postgres-deploy.yaml 裡有幾個重要的設定要注意：第一，replicas 是 1，資料庫不像無狀態應用可以隨意擴縮容，要做資料庫的水平擴展需要額外的架構設計；第二，env 區塊裡的 POSTGRES_PASSWORD 是引用我們剛才建的 Secret，寫法是 valueFrom.secretKeyRef，這樣密碼就不會直接出現在 YAML 裡；第三，volumeMounts 和 volumes 把 PVC 掛載到容器的 /var/lib/postgresql/data 目錄，這是 PostgreSQL 儲存資料的路徑。

postgres-svc.yaml 建立一個 ClusterIP Service，這樣 Backend 就可以用 postgres-svc 這個 DNS 名稱連到資料庫，不需要知道 Pod 的 IP。在 Kubernetes 裡，Pod IP 是會變的（Pod 死掉重建就換 IP），但 Service 的 DNS 名稱是固定的，這是應用程式連資料庫的正確姿勢。

第四步：部署 Backend。先 apply ConfigMap，裡面存放資料庫連線字串。連線字串的主機名稱是 postgres-svc.demo-app.svc.cluster.local，但在同一個命名空間裡可以簡寫成 postgres-svc，K8s 的 DNS 會自動補全。Backend Deployment 的 env 區塊同時引用了 ConfigMap（取得連線字串）和 Secret（取得密碼），把兩種設定的來源分開是好的做法。

apply 完每個 YAML 之後，立刻跑 kubectl get pods -n demo-app 確認狀態。Pod 從 Pending 轉成 ContainerCreating 再轉成 Running 是正常的，大概等 30 秒到 1 分鐘。如果 3 分鐘後還在 Pending，就需要排查了——通常是 PVC 沒有可用的 PV，或者節點資源不足。

等兩個 Pod 都是 Running 之後，我們來驗證 Backend 真的可以連到資料庫。用 kubectl exec 進到 Backend Pod 裡，試著用 psql 或 curl 連一下資料庫的健康檢查端點。如果回應正常，恭喜，第一層和第二層之間的連線已經通了！有任何問題舉手，我們一起解決。`,
    duration: "20"
  },

  // ========== 實戰一：部署 Frontend + Ingress ==========
  {
    title: "🔨 動手做：部署 Frontend & Ingress",
    section: "實戰演練一",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 1. 部署 Frontend (Nginx + React Build)</p>
          <p className="text-green-400">kubectl apply -f frontend-deploy.yaml -n demo-app</p>
          <p className="text-green-400">kubectl apply -f frontend-svc.yaml -n demo-app</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 2. 設定 Ingress 統一入口</p>
          <p className="text-green-400">kubectl apply -f ingress.yaml -n demo-app</p>
          <p className="text-slate-400 mt-2 mb-1"># ingress.yaml 路由規則：</p>
          <p className="text-slate-300">{"demo.local/        → frontend-svc:80"}</p>
          <p className="text-slate-300">{"demo.local/api/    → backend-svc:3000"}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 3. 完整驗證</p>
          <p className="text-green-400">kubectl get all -n demo-app</p>
          <p className="text-green-400">kubectl get ingress -n demo-app</p>
          <p className="text-green-400">curl http://demo.local/api/health</p>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg text-sm">
          <p className="text-green-400 font-semibold">🎉 成功標準</p>
          <p className="text-slate-300">瀏覽器打開 http://demo.local，看到前端頁面並能讀到資料庫資料</p>
        </div>
      </div>
    ),
    notes: `資料庫和後端都起來了，現在我們把最後一層，也就是 Frontend 加上去，然後設定 Ingress 讓整個應用程式可以從外部存取。這是整個部署流程的收尾，做完之後你就可以用瀏覽器打開我們部署的應用了。

第五步：部署 Frontend。frontend-deploy.yaml 裡跑的映像是一個 Nginx 容器，Nginx 伺服的是 React build 之後的靜態檔案。這是最常見的前端部署方式：開發環境用 npm run dev，生產環境 build 成靜態檔案放到 Nginx 裡。

前端的 Deployment 相對簡單，沒有太多環境變數需要設定。但有一件事要注意：前端的 API 端點 URL 是在 build 時決定的，不是執行時。所以如果你換了 Backend 的 Service 名稱，你需要重新 build 前端映像。這是前端部署常見的一個設計考量點。

apply frontend-svc.yaml，建立一個 ClusterIP Service。前端的 Service 不需要對外，因為外部流量是透過 Ingress 進來的，Ingress 再轉給這個 Service。

第六步：設定 Ingress。這是整個三層架構的統一入口。ingress.yaml 裡定義了兩條路由規則：第一條，所有到 demo.local 根路徑（和子路徑）的請求，轉到 frontend-svc 的 80 port；第二條，所有到 demo.local/api/ 的請求，轉到 backend-svc 的 3000 port。

這個模式叫做 path-based routing（基於路徑的路由），是最常見的 Ingress 設定方式。另一種方式是 host-based routing（基於主機名稱），比如 app.example.com 轉前端、api.example.com 轉後端。兩種方式各有適用場景，path-based 適合同一個域名下的前後端分離，host-based 適合微服務各自有獨立子域名的架構。

apply 完 ingress.yaml 之後，用 kubectl get ingress -n demo-app 確認 Ingress 資源已建立，並且有取得 External IP 或 Host。如果你用的是本地叢集（kind 或 minikube），可能需要額外設定讓 Ingress 可以存取，或者用 kubectl port-forward 來測試。

最後，執行完整驗證：kubectl get all -n demo-app 看所有資源狀態，應該看到 6 個 Pod 都是 Running，6 個 Service 都在，1 個 Ingress。然後用 curl http://demo.local/api/health 測試 Backend 是否透過 Ingress 可以存取。如果回傳 200 OK，再打開瀏覽器輸入 http://demo.local，看到前端頁面並且頁面上的資料是從資料庫來的，那就大功告成了！

這是一個很大的里程碑。從零建立一個命名空間，到一個完整可用的三層 Web 應用，用了大概 15 分鐘和不到 20 個 kubectl 指令。這就是 Kubernetes 宣告式管理的威力——你只需要描述你想要什麼狀態，K8s 幫你把它實現。大家給自己鼓個掌！`,
    duration: "20"
  },

  // ========== 實戰二：故障排查概覽 ==========
  {
    title: "實戰演練二：故障排查三連擊",
    subtitle: "CrashLoopBackOff｜OOMKilled｜ImagePullBackOff",
    section: "實戰演練二",
    content: (
      <div className="space-y-5">
        <p className="text-slate-300">每種錯誤都有它的「症狀→診斷→治療」流程：</p>
        <div className="space-y-3">
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💥</span>
              <p className="text-red-400 font-bold text-lg">CrashLoopBackOff</p>
            </div>
            <p className="text-slate-300 text-sm">容器啟動後馬上崩潰，K8s 不斷重啟，進入退避等待循環</p>
            <p className="text-slate-500 text-xs mt-1">常見原因：程式 bug、設定檔錯誤、缺少環境變數</p>
          </div>
          <div className="bg-orange-900/30 border border-orange-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💾</span>
              <p className="text-orange-400 font-bold text-lg">OOMKilled</p>
            </div>
            <p className="text-slate-300 text-sm">容器使用記憶體超過 limits，被作業系統 OOM Killer 殺掉</p>
            <p className="text-slate-500 text-xs mt-1">常見原因：記憶體 limits 設太低、記憶體洩漏（leak）</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🚫</span>
              <p className="text-yellow-400 font-bold text-lg">ImagePullBackOff</p>
            </div>
            <p className="text-slate-300 text-sm">K8s 無法從 Registry 拉取指定的容器映像</p>
            <p className="text-slate-500 text-xs mt-1">常見原因：映像名稱/Tag 錯誤、私有 Registry 未授權</p>
          </div>
        </div>
      </div>
    ),
    notes: `部署成功了，但現實世界的應用永遠不是「apply 完就沒事了」。真正考驗工程師功力的，不是把東西部署上去，而是出了問題能不能找到根因、多快修好。接下來我們練習三種最常見的故障，我保證你在工作中一定會遇到，而且不只遇到一次。

先說說為什麼要特別練「故障排查」。很多工程師在 apply YAML 成功之後就放鬆了，但生產環境的問題往往在幾小時或幾天後才浮現——一個版本更新帶進了 bug、流量突然增加記憶體不夠用、Image Registry 的認證過期。這時候你需要在壓力下快速診斷，每多花一分鐘，就多一分鐘的服務中斷。

第一個：CrashLoopBackOff。這是最常見的錯誤狀態，新手工程師看到這個往往第一反應是「為什麼一直重啟？」字面翻譯是「崩潰循環退避」——容器啟動後馬上崩潰，K8s 嘗試重啟，但每次重啟失敗後等待時間會越來越長，從 10 秒、20 秒、40 秒……最長到 5 分鐘。這個退避策略是為了避免無限快速重啟消耗資源。常見原因包括：應用程式在啟動時讀取了不存在的設定檔、引用了不存在的環境變數、程式本身有啟動期間的 bug、或者 port 被佔用。

第二個：OOMKilled。Out Of Memory Killed，記憶體超出限制被殺。這個錯誤比較狡猾，因為容器不是自己崩潰，是被 Linux 核心的 OOM Killer 強制殺掉的。你的程式可能運行得很好，只是記憶體用量超過了 Kubernetes 設定的 limits，就被無情地殺掉了。這種情況下容器的 Exit Code 通常是 137（128 + SIGKILL 的 9）。常見原因：limits 設太低、應用程式有記憶體洩漏、或者跑了一個記憶體密集的操作沒有考慮到峰值用量。

第三個：ImagePullBackOff。Kubernetes 在建立 Pod 時，第一步是從 Registry 拉取容器映像，如果拉不到，Pod 就永遠停在這個狀態。背後可能的原因：映像名稱打錯了（包括大小寫）、Tag 不存在（常見：把 latest 當作萬能，但 latest 不一定存在）、Registry 是私有的但沒有設定認證 Secret、或者叢集的網路無法連到 Registry。

我們現在開始逐一示範這三種故障的診斷和修復過程。`,
    duration: "5"
  },

  // ========== 實戰二：排查示範 ==========
  {
    title: "🔨 故障排查：診斷工具箱",
    section: "實戰演練二",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 第一步：看整體狀態</p>
          <p className="text-green-400">kubectl get pods -n demo-app</p>
          <p className="text-slate-500 mt-1">{"→ 找出 STATUS 不是 Running 的 Pod"}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 第二步：看 Events（最重要！）</p>
          <p className="text-green-400">kubectl describe pod &lt;pod-name&gt; -n demo-app</p>
          <p className="text-slate-500 mt-1">{"→ 翻到最下面的 Events，錯誤訊息都在這"}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 第三步：看應用程式 Log</p>
          <p className="text-green-400">kubectl logs &lt;pod-name&gt; -n demo-app</p>
          <p className="text-green-400">kubectl logs &lt;pod-name&gt; --previous -n demo-app</p>
          <p className="text-slate-500 mt-1">{"→ --previous 看上一次崩潰的 log（CrashLoop 必用）"}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 進階：進入容器除錯</p>
          <p className="text-green-400">{"kubectl exec -it <pod-name> -n demo-app -- /bin/sh"}</p>
        </div>
      </div>
    ),
    notes: `在正式演練三個故障場景之前，讓我把排查工具箱介紹清楚。這四個指令，加上一套清晰的排查思路，是你在 Kubernetes 世界裡生存的核心武器。我每次排查問題都是這個順序，從不跳步驟。

第一個指令：kubectl get pods。這是所有排查的起點。你看的是 STATUS 欄位，Running 是正常，其他狀態都代表有問題。Pending 代表 Pod 還沒被調度到節點上，通常是資源不足或者 nodeSelector 找不到符合的節點；ContainerCreating 代表正在拉映像或建立容器，如果卡超過 3 分鐘就要懷疑了；CrashLoopBackOff 代表容器反覆崩潰重啟；OOMKilled 代表記憶體超限被殺；ImagePullBackOff 或 ErrImagePull 代表映像拉不到；Terminating 代表正在刪除中，如果卡住可能是有 finalizer 沒清理。

另外注意 READY 欄，格式是「就緒容器數/總容器數」。0/1 代表容器在跑但 readinessProbe 沒過，Pod 不會接到流量。RESTARTS 欄顯示重啟次數，如果一個 Pod 的 restarts 是 50，說明它已經崩潰了 50 次，肯定有問題。

第二個指令：kubectl describe pod，這是我最常用的排查工具。describe 輸出的資訊量很大，但最重要的是兩個部分：一是 Containers 區塊，顯示資源 requests/limits、掛載的 Volume、設定的環境變數（這裡可以確認環境變數有沒有正確傳進去）；二是最底下的 Events 區塊，K8s 系統事件都記錄在這裡。舉個例子，如果映像拉不到，Events 裡會看到 Failed to pull image "xxx": rpc error... 如果是 Pod 被 OOM 殺掉，Events 裡會有 OOMKilled 的記錄。幾乎所有問題，在 Events 裡都有線索。我養成了一個習慣：排查任何 Pod 問題，第一件事就是 describe 看 Events。

第三個指令：kubectl logs。看應用程式自己吐出的 log，這是排查應用層問題的關鍵。有幾個常用參數：-f 是 follow，持續輸出新的 log（像 tail -f）；--previous 或 -p 是看前一個（已死掉的）容器的 log，這對排查 CrashLoopBackOff 非常重要，因為容器可能已經重啟了，現在跑的是新的容器，你要看的是上一個容器崩潰前的最後幾行 log；-c 是指定容器名稱，一個 Pod 可以有多個容器（sidecar 模式），要看特定容器的 log 用這個參數；--since=1h 只看最近一小時的 log。

第四個指令：kubectl exec。當 log 和 describe 還不夠，你需要「進到容器裡面親眼看看」時，用這個。常見用途：確認環境變數是否正確設定（echo $DB_HOST）、測試網路連線（curl postgres-svc:5432、ping backend-svc）、查看設定檔內容（cat /app/config.json）、查看檔案系統（ls /data/）。注意：exec 只能在容器還活著的時候用，如果容器已經崩潰了，就只能用 --previous 看 log 了。

現在我們實際演練。我會故意製造這三種故障，然後帶著大家用上面的工具組一步一步找到根因並修復。

場景一，CrashLoopBackOff：我會部署一個設定了錯誤環境變數名稱的 Backend，讓它在啟動時因為找不到必要的 DB_URL 而崩潰。我們會用 describe 看 Events，用 logs --previous 看崩潰前的 log，找到問題是環境變數名稱拼錯了（DB_URL 被寫成 DB_URl），然後修正 ConfigMap 重新 rollout。

場景二，OOMKilled：我會把 Backend 的 memory limits 設成極小的值（例如 10Mi），然後讓它跑一個需要 50Mi 記憶體的操作，讓它被 OOM 殺掉。我們會用 describe 看到 OOMKilled 的 Exit Code 137，然後把 limits 調整到合理的值修復問題。

場景三，ImagePullBackOff：我會故意把 Frontend 的映像名稱打錯一個字母，讓 K8s 找不到這個映像。我們會用 describe 看到 Failed to pull image 的 Events，確認是映像名稱錯誤，修正 YAML 後重新 apply。

每一種故障的排查流程都是：get pods 發現異常 → describe 看 Events 找線索 → logs 看應用層 log → 根據線索修復 → 驗證修復有效。把這個流程刻進你的肌肉記憶裡。`,
    duration: "25"
  },

  // ========== 休息 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘 — 14:30–14:45",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          完成了兩場實戰演練，你很棒！
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400">下半場預告</p>
          <ul className="text-k8s-blue text-left mt-2 space-y-1">
            <li>📈 實戰演練三：HPA + PDB 高可用配置</li>
            <li>🔄 CI/CD 與 GitOps 概念</li>
            <li>🛡️ 生產環境最佳實踐</li>
            <li>🎓 課程總結 & 畢業典禮</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，休息時間到！大家辛苦了。剛才兩場實戰演練很有份量，請起來走一走，喝點水，讓眼睛和頸椎休息一下。如果剛才有任何操作卡住、沒跟上，趁這 15 分鐘來找我或助教，我們幫你補上。14:45 準時繼續，下半場同樣精彩！`,
    duration: "1"
  },

  // ========== 實戰三：HPA + PDB ==========
  {
    title: "實戰演練三：HPA + PDB 高可用配置",
    subtitle: "讓應用程式在壓力下保持穩定",
    section: "實戰演練三",
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-400 font-bold text-lg mb-2">📈 HPA</p>
            <p className="text-slate-300 text-sm font-semibold">Horizontal Pod Autoscaler</p>
            <p className="text-slate-400 text-sm mt-2">根據 CPU/記憶體使用率，自動調整 Pod 數量</p>
            <div className="bg-slate-800 p-2 rounded mt-3 text-xs font-mono">
              <p className="text-green-400">minReplicas: 2</p>
              <p className="text-green-400">maxReplicas: 10</p>
              <p className="text-green-400">cpu.targetAverageUtilization: 70</p>
            </div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
            <p className="text-purple-400 font-bold text-lg mb-2">🛡️ PDB</p>
            <p className="text-slate-300 text-sm font-semibold">Pod Disruption Budget</p>
            <p className="text-slate-400 text-sm mt-2">升級或維護時，確保最少幾個 Pod 保持運行</p>
            <div className="bg-slate-800 p-2 rounded mt-3 text-xs font-mono">
              <p className="text-green-400">minAvailable: 1</p>
              <p className="text-slate-400">{"# 或 maxUnavailable: 1"}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 建立 HPA（需要先有 metrics-server）</p>
          <p className="text-green-400">{"kubectl autoscale deployment backend \\"}</p>
          <p className="text-green-400">{"  --cpu-percent=70 --min=2 --max=10 -n demo-app"}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-sm font-mono">
          <p className="text-slate-400 mb-2"># 建立 PDB</p>
          <p className="text-green-400">kubectl apply -f backend-pdb.yaml -n demo-app</p>
          <p className="text-green-400">kubectl get hpa,pdb -n demo-app</p>
        </div>
      </div>
    ),
    notes: `歡迎回來！精神好了嗎？我們繼續。第三場實戰演練是 HPA 加上 PDB 的高可用配置。這兩個資源可能是你在課程裡第一次聽到，但我跟你保證，它們是生產環境的必備武器，一旦你理解了它們的運作邏輯，你會發現少了它們根本就不敢把應用放上線。

讓我先說一個真實的故事。有個電商公司把他們的後端部署到 Kubernetes 上，一開始跑得很好。某天下午突然一個促銷活動開始，流量在 5 分鐘內暴增 10 倍。因為他們沒有設定 HPA，固定的 3 個 Pod 全部撐到 CPU 100%，response time 從 200ms 拉到 10 秒，最後服務開始返回 503 錯誤。促銷活動白白損失了幾十萬的訂單。如果他們有 HPA，Kubernetes 會在 CPU 超過閾值時自動擴展 Pod，把流量撐下來。這就是為什麼 HPA 不是可選的，是必須的。

HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮容。「水平」的意思是增減 Pod 的數量（相對於「垂直」是增減單個 Pod 的 CPU/記憶體）。HPA 持續監控目標 Deployment 的資源使用率，當使用率超過設定的閾值，自動增加 Pod 數量；當使用率下降，再縮減 Pod 數量。這個監控數據來自 metrics-server，所以 HPA 的前提是叢集裡有 metrics-server 在運行。

設定 HPA 最簡單的方式是用 kubectl autoscale 指令：--cpu-percent=70 表示目標 CPU 使用率是 70%，也就是「維持平均 CPU 使用率在 70% 左右」；--min=2 表示最少 2 個 Pod，不管流量多低都不會縮到 0，保持最低可用性；--max=10 表示最多 10 個 Pod，不讓它無限擴張吃掉所有節點資源。

這裡有個概念要釐清：HPA 的 CPU 使用率是相對於 requests 的。如果你設 requests.cpu 是 500m，然後實際使用了 400m，使用率就是 80%，觸發擴容。所以 requests 設合理的值非常重要，設太低 HPA 會過度敏感，設太高 HPA 很難觸發。

做 HPA 之後，用 kubectl describe hpa backend -n demo-app 觀察它的狀態。看 Targets 欄位：格式是「current/target」，比如 45%/70% 代表現在 CPU 是 45%，目標是 70%，所以不需要擴容。如果你想看 HPA 自動擴容的效果，可以用 ab（Apache Benchmark）或 k6 對 Backend 打壓測，觀察 Pod 數量隨著 CPU 升高而增加。

現在說 PDB，Pod Disruption Budget，Pod 中斷預算。這個名字聽起來很複雜，但概念很簡單：在做計畫性中斷（drain 節點、升級叢集、滾動更新）的時候，我允許最多幾個 Pod 同時不可用？

想像你有 3 個 Backend Pod，你要升級節點，Kubernetes 需要把節點上的 Pod 驅逐走（evict）再升級。如果沒有 PDB，K8s 可能同時把這 3 個 Pod 全部驅逐，導致服務完全中斷。設定 PDB 的 minAvailable: 1，就是告訴 K8s：「這個 Deployment 至少要有 1 個 Pod 在運行，不管你在做什麼操作，都不能讓可用 Pod 數量低於 1。」K8s 在執行 drain 的時候會尊重這個約束，一次只驅逐不超過限制數量的 Pod。

PDB 有兩種寫法：minAvailable 設最少要有幾個 Pod 可用，或者 maxUnavailable 設最多允許幾個 Pod 不可用。這兩個是等價的，用哪個看你的習慣。推薦用 maxUnavailable: 1，意思是「滾動更新或維護時，最多允許 1 個 Pod 暫時不可用」，這樣即使有一個 Pod 在遷移，服務還是有其他 Pod 繼續提供服務。

動手時間：先用 kubectl autoscale 建立 HPA，再寫一個 backend-pdb.yaml 並 apply。PDB 的 YAML 很簡單：apiVersion 是 policy/v1（注意不同 K8s 版本的 apiVersion 不同），spec 裡設 selector（選到 backend 的 Pod）和 minAvailable 或 maxUnavailable。apply 完之後用 kubectl get hpa,pdb -n demo-app 一次看兩個資源的狀態。

最後驗證 PDB 有效的方式：kubectl drain 一個節點（如果你的叢集有多個節點的話），觀察它驅逐 Pod 的時候是否有遵守 PDB 的約束，不讓可用 Pod 數量低於 minAvailable。

HPA + PDB 是一對黃金搭檔：HPA 讓你的應用能彈性應對流量波動，PDB 讓你的維護操作不會影響服務可用性。這兩個一起設，才能說你的 Kubernetes 部署達到「生產就緒」的水準。`,
    duration: "30"
  },

  // ========== CI/CD 與 GitOps ==========
  {
    title: "CI/CD 與 GitOps 概念",
    subtitle: "讓程式碼自動從 Git 流向 Kubernetes",
    section: "CI/CD 與 GitOps",
    content: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {[
            { label: "開發者 Push", icon: "👨‍💻" },
            { label: "GitHub", icon: "🐙" },
            { label: "Actions 觸發", icon: "⚡" },
            { label: "Build Image", icon: "🐳" },
            { label: "Push to Registry", icon: "📦" },
            { label: "ArgoCD 偵測", icon: "🔍" },
            { label: "K8s 更新", icon: "☸️" },
          ].map((s, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-slate-800 px-3 py-2 rounded-lg text-center">
                <p className="text-xl">{s.icon}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
              {i < arr.length - 1 && <span className="text-k8s-blue">→</span>}
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">⚡ GitHub Actions（CI 部分）</p>
            <ul className="text-slate-300 space-y-1">
              <li>• Push 到 main 觸發 workflow</li>
              <li>• 執行測試、Build Docker Image</li>
              <li>• Push 到 Container Registry</li>
              <li>• 更新 Helm values / kustomize</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">🔄 ArgoCD（CD 部分）</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 持續監聽 Git 儲存庫</li>
              <li>• 偵測到 YAML 變更就自動 sync</li>
              <li>• 視覺化顯示 K8s 資源狀態</li>
              <li>• 支援回滾到任意 Git commit</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `接下來我們看 CI/CD 和 GitOps 的概念。這一段比較偏概念和架構介紹，不做完整實作，但了解這個流程對你的工程師職涯非常重要。在面試中，說「我用過 GitOps + ArgoCD」幾乎是現代後端和 DevOps 職位的加分標配。

先說說為什麼需要 CI/CD。在沒有 CI/CD 的團隊裡，發布流程大概是這樣：開發者本機 build 一個映像，手動 push 到 Registry，SSH 到伺服器，手動跑一堆 kubectl 指令，然後祈禱沒出問題。這個流程有很多問題：容易出錯（手動操作就是容易出錯）、沒有測試保護（沒跑測試就上線的事情不罕見）、難以追蹤（誰在什麼時候 deploy 了什麼版本？）、難以回滾（要回到上個版本需要手動操作）。CI/CD 就是要把這個流程自動化、標準化、可重複、可審計。

CI，Continuous Integration（持續整合），指的是每次開發者 push 程式碼，自動跑一套測試和驗證流程，確保新的程式碼沒有破壞現有功能。CD，Continuous Delivery 或 Continuous Deployment（持續交付/持續部署），指的是把驗證通過的程式碼自動部署到環境中。

GitOps 是一種具體的 CD 實踐方式：把所有基礎設施的期望狀態，包括 K8s 的 YAML、Helm values、Kustomize 設定，全部用 Git 版本控制。你想改一個 Deployment 的副本數？不是手動 kubectl edit，而是修改 Git 裡的 YAML，提一個 PR，讓同事 review，merge 之後，工具自動幫你 apply 到叢集。Git 成為所有變更的唯一真相來源（single source of truth）。好處是：所有變更都有完整的歷史記錄（Git commit）、可以 code review（提 PR）、可以隨時回滾到任意 commit。

現在看完整的 CI/CD + GitOps 流程：

第一步，開發者在 feature branch 開發完功能，開一個 PR 到 main 分支。PR 一提出，GitHub Actions 就被觸發，自動跑 unit test 和 integration test。測試通過才能被 merge。這就是 CI 的核心——每次整合都要通過測試把關。

第二步，PR 被 merge 到 main 之後，GitHub Actions 再次被觸發，這次跑的是 CD workflow：build Docker Image，Tag 通常是 git commit SHA（這樣可以精確追蹤哪個 commit 對應哪個映像），然後 push 到 Container Registry（GCR、ECR、Docker Hub 都行）。

第三步，CI workflow 做完映像之後，還要更新 config repository 裡的 YAML。你通常會有兩個 repo：一個是 app repo（放程式碼），一個是 config repo（放 K8s YAML）。CI 會自動修改 config repo 裡的映像 tag（從舊 SHA 改成新 SHA），並提交一個 commit。這個 commit 是變更的「事實記錄」——任何人都能看到「這次部署是把映像從 abc123 換成 def456」。

第四步，ArgoCD 登場。ArgoCD 是一個跑在 K8s 叢集裡的 GitOps 工具，它持續監聽 config repo，大約每 3 分鐘同步一次（或者用 webhook 立即觸發）。一旦偵測到 config repo 有新的 commit，ArgoCD 就比較「Git 裡定義的期望狀態」和「叢集裡的實際狀態」，如果不一樣，就自動執行 kubectl apply 讓叢集狀態和 Git 同步。這就是 GitOps 的核心：Git is the source of truth，叢集的狀態要和 Git 保持一致。

ArgoCD 有一個很棒的 Web UI，可以視覺化地看到每個應用的部署狀態：哪些資源是健康的（綠燈）、哪些有問題（紅燈）、目前 deploy 的是哪個版本、和 Git 有沒有 out of sync。回滾也非常簡單：在 UI 上點「History」，找到你要的 commit，點「Rollback」，ArgoCD 就把叢集的狀態回退到那個時間點。再也不需要手動找舊的 YAML 去 apply。

這套流程建立之後，開發者的工作流程就很乾淨：寫程式碼、開 PR、merge、等幾分鐘，新版本就自動上線了。不需要任何人手動 deploy，不需要任何人記得跑哪些指令。而且每次部署都有完整的 audit trail，出了問題一眼就能看到是哪個 commit 引起的。這是現代工程團隊的正確打開方式。`,
    duration: "25"
  },

  // ========== 生產環境最佳實踐 ==========
  {
    title: "生產環境最佳實踐",
    subtitle: "從「能動」到「放心上線」",
    section: "最佳實踐",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 資源管理</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 永遠設定 requests & limits</li>
              <li>• 用 LimitRange 設定命名空間預設值</li>
              <li>• 用 ResourceQuota 控制命名空間總量</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">🏥 健康檢查</p>
            <ul className="text-slate-300 space-y-1">
              <li>• livenessProbe：容器是否還活著</li>
              <li>• readinessProbe：是否可以接收流量</li>
              <li>• startupProbe：啟動時間較長的應用</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">🔒 安全性</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 禁止容器以 root 身份執行</li>
              <li>• 設定 readOnlyRootFilesystem</li>
              <li>• 最小權限 RBAC，不用 cluster-admin</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold mb-2">🏷️ 標籤策略</p>
            <ul className="text-slate-300 space-y-1">
              <li>• app, version, env, team 標準標籤</li>
              <li>• 用標籤驅動 Service 選擇器</li>
              <li>• 方便 kubectl 篩選和監控聚合</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">🚀 部署策略</p>
            <ul className="text-slate-300 space-y-1">
              <li>• RollingUpdate + maxUnavailable: 0</li>
              <li>• 搭配 readinessProbe 確保零停機</li>
              <li>• 重要服務考慮 Blue/Green 部署</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-orange-400 font-semibold mb-2">📊 可觀測性</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 結構化 JSON log（方便查詢）</li>
              <li>• 暴露 /metrics 端點</li>
              <li>• 設定告警規則（SLO 導向）</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `我們把這七天學到的技術，整理成六個「生產環境最佳實踐」的類別。注意我說的不是「最好有」，而是「必須有」——這些是你要把應用真正上線到生產環境、能讓你晚上安心睡覺的最低標準。

第一個：資源管理。永遠設定 requests 和 limits，這件事的重要性怎麼強調都不為過。沒有 requests，Kubernetes 的調度器無法做出正確的節點選擇，可能把 Pod 調度到已經負載很高的節點上，造成資源爭搶。沒有 limits，一個有 memory leak 的容器可以無限吃記憶體，最終把整個節點的記憶體吃光，影響同一個節點上所有其他應用——這在生產環境是非常嚴重的爆炸半徑（blast radius）。

更進一步，用 LimitRange 在命名空間層級設定預設的 requests 和 limits，這樣即使開發者忘記設，也有一個安全的預設值。用 ResourceQuota 限制整個命名空間能使用的 CPU 和記憶體總量，避免某個命名空間的爆炸影響整個叢集。

第二個：健康檢查。三個 probe 各有用途，缺一不可。livenessProbe 讓 K8s 知道「容器還活著嗎？」——如果 liveness check 失敗，K8s 會殺掉並重啟容器，自動恢復死鎖或無響應的狀態。readinessProbe 讓 K8s 知道「容器準備好接流量了嗎？」——如果 readiness check 失敗，K8s 把這個 Pod 從 Service 的 Endpoints 移除，流量就不會打到還沒準備好的 Pod 上。這是零停機部署的關鍵：新 Pod 的 readinessProbe 通過之前，流量不會切過去。startupProbe 是給啟動時間較長的應用（比如 JVM 應用，啟動可能要 60 秒），避免在啟動期間被 liveness 誤判為掛掉而重啟，造成永遠起不來的循環。

第三個：安全性。容器不要用 root 執行是基本原則——如果容器被攻擊者突破，root 身份意味著攻擊者有更大的破壞能力。在 securityContext 裡設 runAsNonRoot: true 和 runAsUser: 1000（非 root 用戶）。readOnlyRootFilesystem: true 讓容器的根檔案系統只讀，應用程式無法在容器內寫入任意路徑，減少惡意程式碼的活動空間。RBAC 最小權限原則：每個 ServiceAccount 只給它需要的最小權限，絕對不要圖省事給 cluster-admin。cluster-admin 等於叢集裡的超級用戶，一旦這個 ServiceAccount 被攻擊者拿到，整個叢集都完蛋了。

第四個：標籤策略。統一的標籤規範看起來像是「整齊」的問題，但實際上對管理效率影響很大。建議至少要有這幾個標籤：app（應用名稱，比如 backend）、version（版本，比如 1.2.3 或 git SHA）、env（環境，比如 production、staging）、team（負責的團隊）。有了這些標籤，你可以用 kubectl get pods -l team=platform 快速找到某個團隊所有的 Pod；Prometheus 可以用 team 標籤聚合告警；Service 的 selector 用 app 和 env 標籤精確選擇正確的 Pod。

第五個：部署策略。RollingUpdate 加上 maxUnavailable: 0 是零停機部署的基礎。maxUnavailable: 0 表示在滾動更新過程中，不允許任何一個 Pod 變成不可用，這樣在任何時刻都有 100% 的副本在提供服務。但只有這個還不夠，還要搭配 readinessProbe——新 Pod 通過 readiness check 之後，才算「可用」，K8s 才會繼續關掉下一個舊 Pod。這樣才能真正確保「舊 Pod 退役之前，新 Pod 已經準備好接手」。對於需要更嚴格零停機保證的服務，可以考慮 Blue/Green 部署：同時跑新舊兩個版本，用 Service 的 selector 瞬間切換流量，確認新版本 OK 之後再關掉舊版本。

第六個：可觀測性。Log 一定要結構化成 JSON 格式，不要用純文字。結構化 Log 的好處是機器可以解析，可以用 jq 過濾、用 Loki 查詢、用 ELK 搜索。你的應用程式一定要暴露 /metrics 端點，讓 Prometheus 可以抓取指標。告警規則要基於 SLO（Service Level Objective）而不是隨便設一個閾值——比如「99.9% 的請求在 500ms 內完成」，告警就根據這個目標設計，而不是「CPU 超過 80% 就告警」這種意義模糊的規則。`,
    duration: "20"
  },

  // ========== 課程總結：七天回顧 ==========
  {
    title: "七天學習路徑回顧",
    subtitle: "你的 Kubernetes 成長地圖",
    section: "課程總結",
    content: (
      <div className="space-y-5">
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-k8s-blue/30"></div>
          {[
            { label: "Linux & Shell", desc: "命令列操作、檔案系統、使用者權限", icon: "🐧" },
            { label: "Docker & 容器化", desc: "映像建構、容器生命週期、Registry", icon: "🐳" },
            { label: "K8s 核心資源", desc: "Pod、Deployment、Service、Namespace", icon: "☸️" },
            { label: "設定與儲存", desc: "ConfigMap、Secret、PV/PVC、StorageClass", icon: "📦" },
            { label: "網路與安全", desc: "Ingress、NetworkPolicy、RBAC、PSS", icon: "🔒" },
            { label: "可觀測性", desc: "Prometheus、Grafana、Loki、告警", icon: "📊" },
            { label: "整合實戰", desc: "三層部署、故障排查、HPA/PDB、GitOps", icon: "🏆" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 mb-3 relative">
              <div className="w-12 h-12 bg-k8s-blue/20 border border-k8s-blue rounded-full flex items-center justify-center text-xl z-10 flex-shrink-0">
                {item.icon}
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg flex-1">
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `讓我帶大家把七天的學習路徑完整地回顧一遍。這不只是一個知識清單，而是一段成長的旅程。我想讓你們意識到你們走了多遠的路。

七天前，這個房間裡（或這個螢幕前），很多人是第一次用 SSH 連上遠端伺服器的。我記得第一天有同學問我 ls 和 dir 的差別，有人找不到 home 目錄在哪，有人打 sudo 的時候忘記空格。這些都是真實發生過的，沒有任何嘲笑的意思，因為每個工程師都是從這裡開始的。

Linux 和 Shell：這是地基，是一切的前提。命令列不只是一個工具，它是你和系統溝通的語言。grep、awk、sed、pipe，這些在第一天聽起來像咒語的東西，現在你們每次進 Pod 裡除錯都會用到。掌握了 Shell，你才能真正理解系統在做什麼。

Docker 和容器化：這是整個現代雲原生世界的基礎。容器化的思維——把應用程式和所有依賴打包，讓它在任何環境都能一致地運行——改變了軟體交付的方式。你現在知道怎麼寫 Dockerfile，知道 build 和 run 的差別，知道什麼是 Layer Cache，知道映像和容器的關係。這些知識讓你能夠理解為什麼 Kubernetes 管理的是「Pod 裡的容器」而不是直接管理「伺服器上的程序」。

Kubernetes 核心資源：Pod、Deployment、Service 這三個是一切的骨架。Pod 是最小部署單位，Deployment 管理 Pod 的生命週期和滾動更新，Service 提供穩定的網路端點。你現在應該不需要看文件就能寫出一個基本的 Deployment YAML，知道 selector 和 labels 的匹配關係，知道 replicas 和 rolling update 的運作方式。

設定與儲存：ConfigMap 和 Secret 讓應用程式的設定和機密資訊與程式碼分離，讓同一份映像可以在開發、測試、生產三個環境用不同的設定跑起來。PVC 和 PV 解決了「容器是無狀態的，但資料庫需要持久化」的矛盾，讓 PostgreSQL、MySQL、Redis 這類有狀態的應用也能跑在 Kubernetes 上。

網路與安全：Ingress 是應用程式對外的大門，讓你不需要為每個服務都準備一個 LoadBalancer IP，省錢又省事。NetworkPolicy 是 Pod 層面的防火牆，讓你精確控制哪些 Pod 可以和哪些 Pod 通訊，大幅縮小攻擊面。RBAC 讓叢集的存取控制從「每個人都有 kubectl 就有所有權限」變成「按最小權限原則，每個角色只能做它需要做的事」。

可觀測性：Prometheus 收集指標、Grafana 畫圖、Loki 聚合 log、AlertManager 發告警。把這四個工具串在一起，你的系統就從一個「黑盒子」變成「透明的玻璃」，每個服務的健康狀態、每個 API 的延遲分布、每個 Pod 的資源消耗，都能一覽無遺。

整合實戰：今天下午的所有演練，就是把上面六天的知識點全部融合在一個真實場景裡。三層式部署、故障排查、HPA 和 PDB、CI/CD 和 GitOps、最佳實踐清單，這些不是獨立的知識點，而是一個系統的不同面向。掌握了今天的整合視角，你對 Kubernetes 的理解就從「會用一些指令」進化到「理解整個系統的設計哲學」。

這個差距，是你七天前和七天後的你的最大不同。`,
    duration: "15"
  },

  // ========== 接下來的路 ==========
  {
    title: "結業之後，繼續前進",
    subtitle: "你的 Kubernetes 學習才剛開始",
    section: "課程總結",
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">📚 建議繼續學習</p>
            <ul className="text-slate-300 space-y-1">
              <li>• CKA / CKAD 認證</li>
              <li>• Helm Charts 深入</li>
              <li>• Service Mesh（Istio/Linkerd）</li>
              <li>• Kustomize / GitOps 實作</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">🛠️ 動手練習</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 用 kind / minikube 在本機練習</li>
              <li>• 把自己的 Side Project 容器化</li>
              <li>• 貢獻 CNCF 開源專案</li>
              <li>• 寫技術部落格記錄學習</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">👥 社群資源</p>
            <ul className="text-slate-300 space-y-1">
              <li>• CNCF 官方文件 (kubernetes.io)</li>
              <li>• CNCF Slack 頻道</li>
              <li>• KubeCon 會議演講</li>
              <li>• 課程 Line 群持續交流</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-purple-400 font-semibold mb-2">🎯 短期目標設定</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 一個月內把課程實作做一遍</li>
              <li>• 三個月內考取 CKAD</li>
              <li>• 六個月內在工作中導入 K8s</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `課程即將結束，但你的 Kubernetes 學習旅程才正要開始。我想跟大家分享幾個具體的後續方向，讓這七天學到的東西能夠繼續積累，而不是三個禮拜後就都忘了。

首先說認證。CKA（Certified Kubernetes Administrator）和 CKAD（Certified Kubernetes Application Developer）是業界公認最有含金量的 Kubernetes 認證，來自 CNCF 基金會。這兩個考試都是純實作，在 2 小時的限制時間內完成一系列 kubectl 操作任務，沒有選擇題。CKAD 比較偏應用開發者，考的是我們這七天學的大部分內容：Pod、Deployment、Service、ConfigMap、Secret、Ingress、Health Probes、資源管理。建議先考 CKAD，因為它的範圍和這門課高度重疊，考過之後對你的履歷是很強的加分。CKA 更偏管理員，涵蓋叢集建置、etcd 備份、節點管理等進階內容。有了這七天的基礎，專心備考 1-2 個月應該可以通過 CKAD。

進階技術方面，有幾個方向值得深入：Helm 是 Kubernetes 的套件管理工具，讓你把一個應用的所有 K8s YAML 打包成一個可重用的 Chart，用 values.yaml 來做多環境的設定差異化。很多公司的生產環境都是用 Helm 管理應用，所以這個技能很實用。Service Mesh（Istio 或 Linkerd）是進階的流量管理工具，能做 mTLS（服務間的加密通訊）、流量可觀測性、流量分割（A/B 測試、Canary 部署）等，是大型微服務架構的標配。Kustomize 讓你不需要 Helm 就能管理多環境的 K8s 設定，是原生的 K8s 工具，kubectl 內建支援。

動手練習方面，最重要的建議：**不要停止動手**。光看文件或影片學到的，會在三個禮拜內忘得一乾二淨。在本機用 kind（Kubernetes in Docker）或 minikube 建一個練習叢集，今晚就可以裝好開始玩。把你自己有的 Side Project 容器化，然後用今天學的三層架構部署上去。這是讓知識真正「長進你身體裡」的最有效方式。

如果你有在寫技術部落格，非常鼓勵你把學到的東西寫下來。寫作是一種深度學習——你以為你懂了，但當你試著用文字解釋給別人聽，才會發現哪些地方其實沒懂透。而且寫出來的東西在面試時也是很好的作品集。

社群方面，kubernetes.io 的官方文件品質非常高，英文很好讀，幾乎所有問題都能在上面找到答案。CNCF 的 Slack 有各種主題的頻道，遇到卡關可以在上面問。每年兩次的 KubeCon 大會（北美和歐洲）的演講都會公開在 YouTube，是了解業界最新趨勢的好方式。課程的 Line 群組我會繼續維持，大家有問題歡迎在上面討論。

最後給大家一個具體的目標建議：一個月內，把今天的三層式部署演練在自己的本機重做一遍，不看筆記；三個月內，報名並通過 CKAD 考試；六個月內，找機會在工作上把 Kubernetes 用起來。有了方向，學習就有動力。加油！`,
    duration: "5"
  },

  // ========== 畢業典禮 ==========
  {
    title: "🎓 畢業典禮",
    subtitle: "七天的努力，值得被記念",
    section: "畢業典禮",
    content: (
      <div className="text-center space-y-8">
        <div className="text-8xl">🎓</div>
        <div className="space-y-4">
          <p className="text-3xl font-bold text-k8s-blue">恭喜完成課程！</p>
          <p className="text-xl text-slate-300">你從 Linux 新手，成長為能夠</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-left max-w-lg mx-auto">
          {[
            "部署完整三層式應用到 Kubernetes",
            "排查 Pod 故障並找到根本原因",
            "設定自動擴縮容 (HPA) 和高可用",
            "使用 RBAC 管理叢集存取權限",
            "設定 Ingress 暴露服務給外部",
            "用 Prometheus/Grafana 監控系統",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 bg-green-900/20 border border-green-700/50 p-2 rounded">
              <span className="text-green-400 text-base">✓</span>
              <p className="text-slate-300">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-lg italic">「你已經不是初學者了。」</p>
      </div>
    ),
    notes: `現在是正式的畢業典禮環節。讓我們暫停一下，給這個時刻應有的重量。

七天前，你們坐在這裡，很多人是帶著忐忑的心情來的——「Kubernetes 這麼複雜，我真的學得會嗎？」、「這些英文縮寫我連發音都不確定」、「我連 Docker 都不太懂，直接跳到 K8s 會不會太跳」。這些擔心我理解，因為我第一次接觸 K8s 的時候也是這個感覺。

七天之後，看看你們做到了什麼。你能夠用 kubectl 從零開始建立一個完整的三層式 Web 應用，資料庫、後端、前端，全部跑在 Kubernetes 上，外面用 Ingress 開放存取。你遇到了 CrashLoopBackOff，不再驚慌，知道要 describe 看 Events，用 --previous 看崩潰前的 log，根據錯誤訊息找到根因。你設定了 HPA 讓應用在流量高峰自動擴展，設定了 PDB 讓維護操作不會中斷服務。你理解了 CI/CD 和 GitOps 的流程，知道現代工程團隊是怎麼把程式碼從 git push 一路自動化部署到 Kubernetes 的。你知道哪些生產環境的最佳實踐是必做的，不只是「能動」而是「能放心上線」。

這些能力，在七天前你們完全沒有，或者只有模糊的印象。這個轉變是真實的，是你們花了七天認真學習、認真動手操作換來的。每次演練遇到卡關還是繼續往前，每次出現奇怪的錯誤訊息還是翻文件找答案，這些都是你們自己努力的結果。

我想說一件事：學技術最難的不是理解概念，而是在不確定的時候繼續動手。很多人在遇到不懂的東西時會退縮，說「等我搞清楚了再試」，然後永遠沒有試。你們沒有，你們在還不確定的情況下，還是把指令打出去，看看會發生什麼，然後根據結果調整。這種學習態度，比任何知識點都更有價值，它會讓你在 Kubernetes 之後的所有技術學習裡都受益。

所以請給自己一個真心的掌聲。你已經不是初學者了。從今天開始，你是一個有 Kubernetes 實戰經驗的工程師，你有資格在履歷上寫上這個技能，有資格在技術討論中分享你的觀點，有資格繼續往更深、更廣的方向探索。恭喜你們！`,
    duration: "10"
  },

  // ========== Q&A ==========
  {
    title: "Q & A",
    subtitle: "任何問題，現在都是好時機",
    section: "畢業典禮",
    content: (
      <div className="space-y-8">
        <div className="text-center text-8xl">🙋</div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">可以問的主題</p>
            <ul className="text-slate-300 space-y-1">
              <li>• 課程任何概念的深入說明</li>
              <li>• 實際工作場景的建議</li>
              <li>• 技術選型的考量</li>
              <li>• 職涯方向的建議</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">課後聯繫方式</p>
            <ul className="text-slate-300 space-y-1">
              <li>💬 課程 Line 群組</li>
              <li>📧 講師 Email</li>
              <li>🐙 GitHub（課程範例 Repo）</li>
              <li>📝 課後問卷（請填寫！）</li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg text-center">
          <p className="text-yellow-400 font-semibold">📝 離開前，請填寫課後問卷</p>
          <p className="text-yellow-200 text-sm mt-1">你的回饋是我改進課程的最大動力，大約 5 分鐘</p>
        </div>
      </div>
    ),
    notes: `最後的 Q&A 時間，也是這門課最後的一個環節。大家可以問任何問題，真的是任何問題。不用擔心問題太基礎或太進階，不用擔心問題「跑題」，只要是你心裡有疑惑或想深入了解的，都可以提出來。這 45 分鐘是屬於你們的。

讓我先說幾句開場白。這七天的課程，我們從 Linux 基礎操作一路走到了 Kubernetes 的安全與監控，涵蓋了非常廣泛的內容。各位能夠堅持到最後，真的非常不容易。

在這個 Q&A 環節，我想先拋幾個問題給大家思考：學完這門課，你最想馬上在工作中應用的技術是什麼？你覺得哪個部分最難理解，需要再花時間研究？你有沒有遇到什麼問題，在課程中沒有得到滿意的解答？

如果沒有人立刻發問，沒關係，我先說幾個常見的後續問題。很多人學完 K8s 之後的第一個問題是：我怎麼在公司真正導入 K8s？答案是循序漸進。不要一開始就把所有服務都遷移到 K8s，先選一個非核心、低風險的服務開始，熟悉整個流程之後再擴展。第二個常見問題是：Kubernetes 和 Docker Swarm 哪個比較好？現實是 K8s 已經成為業界標準，大型生產環境幾乎都用 K8s，但如果你的服務規模很小，Docker Compose 其實就夠了。

關於繼續學習的路線，我建議大家接下來可以考慮 CKA 認證（Certified Kubernetes Administrator），這個認證在業界非常有公信力。準備過程本身也是很好的學習機會。另外，Helm 也是值得深入學習的工具，它讓 K8s 應用的部署和管理更加標準化。

感謝各位這七天的陪伴和參與，希望這門課對大家有實質的幫助。課後如果有任何問題，歡迎透過提供的聯絡方式繼續討論。祝大家在 K8s 的學習和工作道路上一切順利！`,
    duration: "45"
  },
]
