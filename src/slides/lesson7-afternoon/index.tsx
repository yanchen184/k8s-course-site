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
    notes: `歡迎大家回來！吃飽了嗎？今天下午是整個七天課程的最後一個下午，也是最重頭的實戰時段。

這個下午我們不會再學太多新東西，而是把這七天學的所有概念，用實際的動手操作把它們串在一起。我相信經過了這個下午，大家對 Kubernetes 的整體運作會有一個更完整、更扎實的感受。

我們今天下午的主線是：先做一個完整的三層式應用部署，然後故意把它弄壞，練習排查故障，接著設定高可用配置，最後看看 CI/CD 怎麼跟 K8s 整合。這整個流程，就是你們將來在真實工作中會一直重複的循環。準備好了嗎？我們開始！`,
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
    notes: `讓我們看一下今天下午的完整安排。

一開始 15 分鐘的開場回顧，我會帶大家快速掃過這七天的重點，找回狀態。

接著是三場實戰演練，一場比一場進階：第一場是完整的三層式應用部署，第二場是故障排查三種常見的錯誤，第三場是設定 HPA 和 PDB 做高可用。

中間有一個 15 分鐘的休息。休息完之後我們看 CI/CD 和 GitOps 的概念，這是現代工程團隊的日常。然後整理生產環境的最佳實踐。

最後一個小時，先回顧七天的學習路徑，然後進行畢業典禮和 Q&A。大家有任何問題，在 Q&A 時間盡情問，我們把它好好收個尾。整個下午安排得很緊湊，大家跟緊我！`,
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
    notes: `在開始今天的實戰之前，讓我帶大家快速回顧一下這七天走過的路。

Day 1，我們從 Linux 命令列開始，學了檔案系統、使用者權限、基本的文字操作。沒有這個基礎，後面什麼都做不了。

Day 2，進入 Docker，學了容器是什麼、怎麼建立映像、怎麼用 Dockerfile。容器這個概念是 Kubernetes 的前提。

Day 3，正式進入 Kubernetes，學了 Pod、Deployment、Service 這三個最核心的資源，掌握了基本的部署和更新流程。

Day 4，深入 ConfigMap、Secret、PV/PVC，知道怎麼管理設定、密碼和持久化儲存。這是讓應用程式真正「活起來」的必備知識。

Day 5，網路和安全，Ingress 讓外部流量進來，NetworkPolicy 控制 Pod 之間的通訊，RBAC 管理誰可以做什麼。

Day 6，可觀測性，Prometheus 收集指標、Grafana 畫圖表、日誌集中管理。讓你知道系統裡在發生什麼事。

Day 7 今天，我們就是要把這六天的東西，通通融合在一起，用一個真實的場景走一遍。你會發現，每一個你曾經「好像懂了」的概念，在整合場景裡都會重新活起來，變得更清晰。開始吧！`,
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
    notes: `好，我們正式進入第一場實戰演練，部署一個三層式 Web 應用程式。

三層式架構是業界最常見的 Web 應用架構：前端負責使用者介面，後端負責業務邏輯，資料庫負責持久化儲存。把這三層都放進 Kubernetes，就是我們今天要做的事。

這個演練會用到幾乎所有我們學過的資源：三個 Deployment 分別跑前端、後端和資料庫；三個 Service 讓它們互相通訊；一個 Ingress 讓外部流量進來；ConfigMap 存應用程式的設定；Secret 存資料庫密碼；PVC 讓資料庫的資料持久化保存。

這不是 Hello World，這是一個接近真實工作環境的部署場景。我們接下來會一步一步從最底層的資料庫開始，往上建到前端，最後測試整個應用是否正常運作。準備好了嗎？`,
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
    notes: `開始動手。我們從最底層的資料庫開始，往上疊。這個順序很重要，因為後端需要資料庫，前端需要後端，依賴方向決定部署順序。

第一步，先建立一個獨立的命名空間 demo-app，讓這個演練的所有資源都在自己的命名空間裡，好管理也好清除。

第二步，建立 Secret 存放資料庫密碼。注意我們用 --from-literal 直接在命令列塞入值，這在測試環境很方便，但正式環境要用 Vault 或 Sealed Secrets 這類工具管理。

第三步，部署 PostgreSQL。我們先 apply PVC，確保儲存空間準備好，再 apply Deployment 和 Service。postgres-deploy.yaml 裡的 env 會引用我們剛才建立的 Secret，確保密碼不硬寫在 YAML 裡。

第四步，部署 Backend。先 apply ConfigMap，裡面存放資料庫的連線字串（主機名稱是 postgres-svc，也就是我們剛才建的 Service 名稱），再 apply Backend 的 Deployment 和 Service。

每個 apply 之後，記得用 kubectl get pods 確認 Pod 狀態。Pod 從 Pending 變成 ContainerCreating 再變成 Running 是正常流程，如果卡在 Error 或 CrashLoopBackOff，就先停下來排查。有任何問題舉手！`,
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
    notes: `第五步，部署 Frontend。Frontend 的映像通常是用 Nginx 伺服一個 React 打包後的靜態檔案。Deployment 很簡單，重點是 Service 要設定好，讓 Ingress 找得到它。

第六步，設定 Ingress。這是整個三層架構的入口。我們的 Ingress 規則是：所有到 demo.local 根路徑的請求，轉到 Frontend；所有到 demo.local/api/ 的請求，轉到 Backend。這個模式叫做 path-based routing，是非常常見的 Ingress 設定方式。

設定完之後，用 kubectl get all 看一眼所有資源的狀態，確認沒有問題。然後用 curl 測試 /api/health 端點，確認 Backend 有正常回應。

最後，在瀏覽器打開 http://demo.local，如果你看到前端頁面，而且頁面上顯示的資料是從資料庫來的，那就代表整個三層架構部署成功了！恭喜！

這是一個很大的里程碑，大家給自己鼓個掌。從一個空的 namespace 到一個完整可用的 Web 應用，這就是 Kubernetes 的威力。`,
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
    notes: `部署成功了，但現實世界的應用永遠不是「apply 完就沒事了」。接下來我們練習三種最常見的故障，這三種錯誤我保證你在工作中一定會遇到，而且可能每週都會遇到。

CrashLoopBackOff 是最常見的錯誤之一。字面意思是「崩潰循環退避」，容器啟動後馬上崩潰，K8s 嘗試重啟，但每次重啟失敗後等待時間會越來越長（退避策略）。最終你就會看到這個狀態。

OOMKilled 是 Out Of Memory Killed，記憶體超出限制。這個錯誤很有趣，因為容器不是自己崩潰，是被作業系統的 OOM Killer 強制殺掉的。通常發生在記憶體 limits 設太低，或者應用程式有記憶體洩漏問題。

ImagePullBackOff 是拉映像失敗。可能是映像名字打錯、Tag 不存在、或者要拉私有 Registry 的映像但沒有設定認證。

每種故障的排查邏輯都是一樣的：先看 Pod 狀態，再看 Events，再看 Logs，最後根據線索找到根因。我們來一個個練習。`,
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
    notes: `在正式開始三個故障場景之前，先讓我把排查工具箱介紹清楚。這四個指令是你排查 Kubernetes 問題的核心武器，順序很重要。

第一個：kubectl get pods，這是入口，看哪個 Pod 不對勁。STATUS 欄位告訴你大概是什麼問題，但只是起點，不是終點。

第二個：kubectl describe pod，這是最強的診斷工具。它會顯示 Pod 的完整資訊，包括資源使用、掛載的卷、環境變數，最重要的是最下面的 Events 區塊，K8s 的系統事件都記錄在這裡，幾乎所有故障都會在這裡留下線索。每次排查問題，養成習慣先跑 describe。

第三個：kubectl logs，看應用程式自己吐出的 log。如果是 CrashLoopBackOff，容器可能已經崩潰了，要用 --previous 參數看上一次崩潰的 log。

第四個：kubectl exec，當你需要進到容器裡面直接操作，這個指令讓你開一個互動式 shell。注意有些精簡映像（比如 Alpine）預設沒有 bash，要用 /bin/sh。

記住這個排查順序：get → describe → logs → exec。從寬到窄，從外到內。`,
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
    notes: `好，休息時間到！大家辛苦了，剛才完成了兩場很有份量的實戰演練。

去上廁所、喝水、活動一下筋骨。如果剛才演練有什麼問題還沒搞清楚，趁這個時間來找我或助教。

15 分鐘後我們繼續，接下來的內容會稍微輕鬆一點，HPA 和 PDB 的實作之後，我們會開始做概念介紹（CI/CD 和最佳實踐），最後是今天最期待的畢業典禮。準時回來！`,
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
    notes: `歡迎回來！我們繼續。第三場實戰演練是 HPA 加上 PDB，這兩個是讓 Kubernetes 應用達到高可用的關鍵配置。

HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮容。當你的 Backend CPU 使用率超過 70%，HPA 會自動幫你把 Pod 數量增加，直到用量降下來。當流量減少，HPA 又會縮減 Pod 數量，節省資源。這就是雲原生「彈性伸縮」的精髓。注意 HPA 需要叢集裡有 metrics-server 在運行，否則它看不到 CPU 指標。

PDB，Pod Disruption Budget，Pod 中斷預算。想像你要升級節點，K8s 需要把上面的 Pod 遷移走。如果沒有 PDB，K8s 可能同時把所有 Pod 都趕走，導致服務中斷。設定 minAvailable: 1 就是告訴 K8s：「不管你在做什麼維護，這個 Deployment 至少要有 1 個 Pod 活著。」

HPA 和 PDB 搭配，就能同時做到：流量大的時候自動擴張，維護時不中斷服務。這是生產環境的基本配置。

動手操作：先用 kubectl autoscale 快速建立 HPA，再 apply PDB 的 YAML。建立完後用 kubectl get hpa,pdb 確認兩個資源都在。然後用 kubectl describe hpa 觀察它的狀態，看它目前的 targets 是多少。`,
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
    notes: `接下來我們看 CI/CD 和 GitOps 的概念。這一段比較偏概念介紹，不做完整實作，但了解這個流程對你的職涯非常重要。

先說說 GitOps 是什麼。GitOps 是一種運維理念：把所有基礎設施的狀態，都用 Git 版本控制來管理。你想改一個 Deployment 的副本數？不是手動 kubectl edit，而是修改 Git 裡的 YAML，然後讓工具自動幫你 apply 到叢集。Git 成為所有變更的唯一真相來源（single source of truth）。

流程是這樣的：開發者把程式碼 push 到 GitHub，GitHub Actions 的 workflow 被觸發，它跑測試，build Docker image，push 到 Registry，然後更新存放 K8s YAML 的 Git 儲存庫（通常是一個獨立的 config repo）。

這時候 ArgoCD 登場。ArgoCD 是一個跑在叢集裡的工具，它持續監聽你的 config repo，一旦偵測到 YAML 有變更，就自動把最新版本 sync 到叢集。你完全不需要人工 kubectl apply，一切自動化。

而且 ArgoCD 有一個超棒的 Web UI，可以視覺化地看到每個應用的部署狀態、資源健康狀態，出了問題在介面上就能看到哪裡紅燈。回滾也很簡單，只要在 UI 上點「回滾到某個 commit」，ArgoCD 就幫你搞定。

這個流程是現代 DevOps 團隊的標準配備，學會了，面試的時候說「我用過 GitOps + ArgoCD」絕對是加分項目。`,
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
    notes: `我們把這七天學到的技術，整理成六個「生產環境最佳實踐」的類別。這些不是可選的「最好有」，而是你要把應用真正上線到生產環境，必須做到的事。

資源管理：永遠設定 requests 和 limits。沒有 limits 的 Pod 在壓力下可能吃掉整個節點的資源，影響其他所有人。requests 讓調度器能做出正確的節點選擇，limits 保護節點不被霸佔。

健康檢查：livenessProbe 讓 K8s 知道容器掛了要重啟；readinessProbe 告訴 Service 這個 Pod 準備好接流量了沒有；startupProbe 是給啟動較慢的應用用的，避免啟動期間被 liveness 誤判。這三個 probe 設好，K8s 就能自動處理大部分的故障恢復。

安全性：容器不要用 root，設定 securityContext 限制能力。最小權限原則在 RBAC 上也適用，不要圖省事就用 cluster-admin。

標籤策略：統一的標籤規範讓團隊的管理效率大幅提升，也讓 Prometheus 抓指標和聚合更容易。

部署策略：RollingUpdate 加上 maxUnavailable: 0 加上 readinessProbe，就是零停機部署的最佳組合。

可觀測性：log 要結構化（JSON），應用程式要暴露 metrics 端點，告警規則要基於 SLO 而不是隨意設定閾值。這三個到位，你才真的掌握了生產環境的狀態。`,
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
    notes: `讓我帶大家把七天的學習路徑完整地回顧一遍。

你們從 Linux 命令列開始，第一天很多人還在跟 SSH 連線搏鬥。看看現在，你能部署一個完整的三層式應用，能排查 CrashLoopBackOff，能設定 HPA 自動擴縮容。這個進步是巨大的。

Linux 和 Shell：這是地基。命令列、管道、grep、sed，這些工具你現在應該已經覺得自然多了。每次你進到 Pod 裡面除錯，用的都是這些技能。

Docker：容器化的思維改變了軟體交付方式。build once, run anywhere 這個理念，讓你的應用程式不再依賴特定機器的環境。

Kubernetes 核心資源：Pod、Deployment、Service，這三個是一切的基礎。你現在應該可以不看筆記就寫出基本的 YAML。

設定與儲存：把敏感資訊和應用設定分離，讓應用程式在不同環境間可移植。PVC 讓有狀態的應用也能跑在 K8s 上。

網路與安全：Ingress 是流量的大門，NetworkPolicy 是內部的防火牆，RBAC 是人員的門禁系統。

可觀測性：你現在知道系統壞了要去哪裡看，知道怎麼設定告警讓問題在發生前就被發現。

最後是今天的整合實戰。把所有東西串在一起，這才是真實工作的樣貌。恭喜你們完成了這七天的旅程！`,
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
    notes: `課程結束了，但學習沒有結束。讓我分享幾個接下來可以做的事情。

認證方面，CKA（Certified Kubernetes Administrator）和 CKAD（Certified Kubernetes Application Developer）是業界公認的 Kubernetes 認證。CKAD 比較偏應用開發者，難度略低，建議先考 CKAD 暖身，再挑戰 CKA。考試是純實作，在限時內完成一堆 kubectl 操作，所以熟練度比背答案更重要。

進階技術方面，Helm 是 K8s 的套件管理工具，讓你管理複雜的應用部署。Service Mesh（像 Istio）是更進階的流量管理和安全控制。Kustomize 讓你用 overlay 的方式管理多環境的 K8s 設定。這些都是很有市場需求的技能。

最重要的是持續動手。在本機用 kind 或 minikube 建立練習叢集，把你自己的 side project 容器化，用 K8s 部署。光聽課或看書，記憶力會很快消退；唯有反覆操作，才能真正內化。

課程的 Line 群組會繼續開著，大家有問題可以在上面討論。我也會不定期分享 K8s 相關的最新資訊和文章。`,
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
    notes: `現在是正式的畢業典禮環節。

七天前，很多人是第一次用 SSH 連上 Linux，第一次看到黑色的命令列，第一次聽說 Pod 和 Deployment。

七天之後，你們能夠從零開始，建立一個完整的三層式 Web 應用部署在 Kubernetes 上；能夠看到 CrashLoopBackOff 不慌張，知道要去看哪裡、該怎麼排查；能夠設定 HPA 讓應用自動應對流量波動；能夠用 RBAC 管理叢集的存取控制；能夠理解 CI/CD 流程和 GitOps 的運作方式。

這些能力，在七天前你們完全沒有，或者只有模糊的印象。這個轉變是真實的，是你們花了七天認真學習、認真動手操作換來的。

我要說的是：你們已經不是初學者了。你們具備了足夠的基礎知識和實作能力，可以在工作中開始應用 Kubernetes，可以自己解決問題，可以繼續往更深的地方探索。

剩下的路，是你們自己的。但你們已經踏過了最難的第一步。恭喜你們！`,
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
    notes: `最後的 Q&A 時間，大家可以問任何問題。不用擔心問題太基礎或太進階，也不用擔心問題「偏題」，只要是你心裡有疑惑的，都可以提出來。

常見的問題類型我都歡迎：某個概念還是不太理解、課程裡的某個指令不確定什麼時候用、工作上有一個類似的場景不知道怎麼做、想知道這個技術和另一個技術的差別、不確定自己該往哪個方向繼續學習。

如果你是第一次接觸 K8s，問「Pod 和 Deployment 差在哪」完全沒問題。如果你已經有一些基礎，問「生產環境的多叢集管理怎麼做」也很好。任何問題都有它的價值。

在問答進行的同時，我想請大家掃描一下 QR code 或打開連結，填寫課後問卷。大約五分鐘，填完之後你就完全自由了。你的回饋對我非常重要，無論是哪個地方可以改進，或者哪個部分你覺得特別有幫助，都請誠實填寫。我每次上完課都會認真看問卷，根據大家的意見調整教學內容。

再次感謝大家這七天的參與和投入。看到大家從陌生人變成可以一起討論技術的夥伴，是我最大的成就感來源。祝大家在 K8s 的路上走得愉快，有任何問題，Line 群見！`,
    duration: "15"
  },
]
