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
    title: "組態管理",
    subtitle: "ConfigMap、Secret、ResourceQuota、排程策略",
    section: "第六堂早上",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            ⚙️
          </div>
          <div>
            <p className="text-2xl font-semibold">第六堂 — 上午場</p>
            <p className="text-slate-400">09:00–12:00（180 分鐘）</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          {[
            { icon: "🗺️", label: "ConfigMap", desc: "設定外部化" },
            { icon: "🔒", label: "Secret", desc: "敏感資訊保護" },
            { icon: "📊", label: "ResourceQuota", desc: "Namespace 資源配額" },
            { icon: "📌", label: "排程策略", desc: "Taints / Affinity" },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-k8s-blue font-semibold">{item.label}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `大家早安！歡迎來到第六堂課。我先確認一下大家昨天的學習狀況——上一堂我們學了什麼？

上一堂課我們深入了解了 Pod 的生命週期、健康檢查（liveness / readiness probe），還有 Deployment 的滾動更新策略。大家對那些概念還有沒有問題？（停頓讓學員回應）

很好。今天上午我們要進入 Kubernetes 非常關鍵的一個主題：組態管理（Configuration Management）。這個主題非常實用，因為幾乎所有正式環境的 K8s 應用都會用到。

先跟大家說明一下今天的學習地圖。今天分成兩大區塊：前面是組態與機密管理（ConfigMap 和 Secret），後面是資源控管與排程策略（ResourceQuota、LimitRange、Taints & Tolerations、Affinity）。

這些概念看起來很多，但核心思路都是一樣的：讓你的應用程式更「可配置」、更「可控制」、更「有秩序」。學完今天，你就能設計出一個真正可以上生產環境的 Kubernetes 配置。準備好了嗎？我們開始！`,
    duration: "3",
  },

  // ========== 課程大綱 ==========
  {
    title: "今日課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-3">
        {[
          { time: "09:00–09:05", topic: "開場與複習", icon: "🤝" },
          { time: "09:05–09:40", topic: "ConfigMap 深入：4 種建立 × 3 種使用 × 更新機制", icon: "🗺️" },
          { time: "09:40–10:15", topic: "Secret：類型 × base64 × 安全最佳實踐", icon: "🔒" },
          { time: "10:15–10:30", topic: "☕ 休息", icon: "☕" },
          { time: "10:30–10:55", topic: "ResourceQuota：Namespace 資源配額", icon: "📊" },
          { time: "10:55–11:10", topic: "LimitRange：預設容器資源限制", icon: "📏" },
          { time: "11:10–11:30", topic: "Taints & Tolerations", icon: "🚧" },
          { time: "11:30–11:45", topic: "Node Affinity & Pod Affinity/Anti-Affinity", icon: "🧲" },
          { time: "11:45–12:00", topic: "課程總結 & Q&A", icon: "🏁" },
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
    notes: `讓我們先看一下今天的安排，大家心裡有個底。

今天上午的前半段（到 10:15）專注在組態與機密管理。ConfigMap 負責非敏感的設定資料，Secret 負責密碼、憑證這類敏感資訊。這兩個是相輔相成的，一起學效果最好。

休息之後，後半段進入資源管控與排程策略。ResourceQuota 和 LimitRange 是讓不同團隊公平共用 K8s 叢集的機制，非常重要。最後的 Taints & Tolerations 和 Affinity 是控制 Pod 落到哪個 Node 的進階排程策略，在多租戶或特殊硬體環境（比如 GPU Node）裡很常用。

今天的內容實作比較多，大家要隨時打開終端機跟著操作。如果哪個步驟卡住了，不要等我講完再問，直接舉手，我們停下來解決，這樣學習效果最好。

9 點到 10 點 15 分，先把 ConfigMap 和 Secret 搞清楚，這是很多面試題的考點，也是日常維運最常用到的功能。開始！`,
    duration: "2",
  },

  // ========== ConfigMap 簡介 ==========
  {
    title: "ConfigMap 是什麼？",
    subtitle: "把設定從程式碼裡拿出來",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-6">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-lg">核心概念</p>
          <p className="text-slate-300 mt-1">
            ConfigMap 是 Kubernetes 的鍵值對（key-value）物件，
            用來儲存<span className="text-yellow-400 font-bold">非敏感</span>的設定資料，
            讓設定與容器映像檔分離。
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-900/30 border border-red-700/50 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">❌ 沒有 ConfigMap</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 設定寫死在 Image 裡</li>
              <li>• 改設定 = 重 build Image</li>
              <li>• 不同環境要維護多個 Image</li>
              <li>• 無法動態調整</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 有了 ConfigMap</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 設定儲存在 K8s 叢集中</li>
              <li>• 改設定不需重 build</li>
              <li>• 同一個 Image 用在不同環境</li>
              <li>• 可動態更新並自動載入</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-1">常見用途</p>
          <div className="flex flex-wrap gap-2">
            {["資料庫主機位址", "API 端點 URL", "環境名稱（dev/prod）", "應用程式設定檔", "Feature Flags"].map((item, i) => (
              <span key={i} className="bg-k8s-blue/20 text-k8s-blue px-2 py-1 rounded text-sm">{item}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `好，正式進入 ConfigMap。讓我從一個大家一定遇過的問題開始說起。

假設你寫了一個 Node.js 應用，裡面有一行：const dbHost = "192.168.1.50"。這在開發環境沒問題，但你要部署到正式環境的時候，資料庫 IP 是另一個。你怎麼辦？如果設定寫死在程式碼裡，你得改程式碼、重新 build Image、重新 push，整個 CI/CD 流程跑一遍。如果是緊急狀況需要切換資料庫，這樣就太慢了。

這就是 ConfigMap 要解決的問題：把設定從應用程式的 Image 裡「拿出來」，儲存在 Kubernetes 叢集裡，讓同一個 Image 可以在不同環境使用不同的設定。

ConfigMap 的資料格式非常簡單，就是鍵值對。Key 是設定項目的名稱，Value 可以是一個簡單的字串，也可以是整個設定檔案的內容。

有一點非常重要：ConfigMap 是給「非敏感」資料用的。像是資料庫主機名稱、Port 號、功能開關（Feature Flag）、環境名稱，這些放 ConfigMap 沒問題。但密碼、API 金鑰、TLS 憑證，絕對不能放 ConfigMap，要用下一節我們會講的 Secret。

理解了這個前提，我們來看 ConfigMap 怎麼建立。`,
    duration: "5",
  },

  // ========== ConfigMap 4種建立方式 ==========
  {
    title: "ConfigMap 建立方式",
    subtitle: "4 種方式，場景各不同",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* 方式1 字面值 */}
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">① 字面值（--from-literal）</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">{`kubectl create configmap app-config \\
  --from-literal=DB_HOST=db.example.com \\
  --from-literal=DB_PORT=5432`}</pre>
          </div>
          {/* 方式2 檔案 */}
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">② 單一檔案（--from-file）</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">{`# 以檔名為 key，檔案內容為 value
kubectl create configmap nginx-conf \\
  --from-file=nginx.conf`}</pre>
          </div>
          {/* 方式3 目錄 */}
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">③ 整個目錄（--from-file=dir/）</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">{`# 目錄內每個檔案都成為一個 key
kubectl create configmap app-configs \\
  --from-file=./configs/`}</pre>
          </div>
          {/* 方式4 YAML */}
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">④ YAML 宣告式</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">{`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "db.example.com"
  DB_PORT: "5432"
  app.properties: |
    timeout=30
    retry=3`}</pre>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <span className="text-yellow-400 font-semibold">💡 建議：</span>
          <span className="text-yellow-200">正式環境用 YAML（可版本控制），快速測試用 --from-literal</span>
        </div>
      </div>
    ),
    notes: `ConfigMap 有四種建立方式，每種適合不同的場景，我一一說明。

第一種：字面值（--from-literal）。這是最快的方式，直接在指令上把 key-value 寫進去。適合快速測試或者設定項目很少的情況。缺點是如果有很多設定項目，指令會變得很長，而且沒辦法版本控制。

第二種：從單一檔案（--from-file）。這個方式適合你已經有一個設定檔，比如 nginx.conf，想直接整個塞進 ConfigMap。Key 預設是檔案名稱，Value 是整個檔案的內容。你也可以自訂 key 名稱：--from-file=my-key=./nginx.conf。

第三種：從整個目錄。如果你有一個資料夾裡面放了很多設定檔，用 --from-file=目錄路徑/ 可以把整個目錄的所有檔案都塞進同一個 ConfigMap，每個檔案名稱都成為一個 key。

第四種：YAML 宣告式。這是正式環境最推薦的方式，因為 YAML 檔案可以放進 Git 做版本控制，團隊成員可以 review 設定變更，也可以搭配 GitOps 工具自動同步。注意到 data 裡面有兩種格式：簡單字串（DB_HOST: "db.example.com"），以及多行文字（用 | 開頭的），後者適合整個設定檔的內容。

實際工作上，快速實驗用字面值，CI/CD 或正式環境一定要用 YAML。現在大家試試建立一個簡單的 ConfigMap：kubectl create configmap test-config --from-literal=ENV=dev --from-literal=LOG_LEVEL=info，然後用 kubectl describe configmap test-config 看看結果。`,
    duration: "10",
  },

  // ========== ConfigMap 使用方式 envFrom / env valueFrom ==========
  {
    title: "ConfigMap 使用方式（環境變數）",
    subtitle: "envFrom 全量注入 vs env valueFrom 精準注入",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">① envFrom — 全量注入</p>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre">{`spec:
  containers:
  - name: app
    image: myapp:latest
    envFrom:
    - configMapRef:
        name: app-config
# ConfigMap 的所有 key 都變成
# 容器內的環境變數`}</pre>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">② env valueFrom — 精準注入</p>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre">{`spec:
  containers:
  - name: app
    image: myapp:latest
    env:
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_HOST
    - name: DATABASE_PORT
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_PORT`}</pre>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-900/20 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">envFrom 優點</p>
            <p className="text-slate-300">YAML 簡潔、新增設定不需改 Pod spec</p>
          </div>
          <div className="bg-blue-900/20 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">valueFrom 優點</p>
            <p className="text-slate-300">可重新命名 key、只引入需要的設定</p>
          </div>
        </div>
      </div>
    ),
    notes: `知道怎麼建立 ConfigMap 之後，接下來要知道怎麼在 Pod 裡「使用」它。最常見的方式是透過環境變數，有兩種做法。

第一種是 envFrom，意思是「從某個 ConfigMap 取得所有的 key，全部注入成環境變數」。寫法很簡單，只需要一個 configMapRef 指定 ConfigMap 的名稱，ConfigMap 裡面的所有鍵值對都會變成容器的環境變數。優點是 YAML 很簡潔，以後新增設定項目只要修改 ConfigMap，不用動 Pod 的 spec。缺點是一次注入全部，如果不同 Pod 只需要部分設定，可能會造成混亂。

第二種是 env 搭配 valueFrom，這是「精準注入」，你可以指定要從哪個 ConfigMap 的哪個 key 取值，還可以重新命名。比如 ConfigMap 裡的 key 是 DB_HOST，你可以把它注入成容器環境變數 DATABASE_HOST，名稱不需要一樣。這種方式適合你只想用 ConfigMap 裡的部分設定，或者需要統一命名規範的情況。

兩種方式我實際工作都有用到。如果是整個應用的設定都放在一個 ConfigMap，envFrom 最方便。如果是不同 ConfigMap 只取特定幾個 key，valueFrom 更精確。

記得一個限制：環境變數注入是「一次性」的，Pod 啟動時把值複製進去，之後 ConfigMap 更新了，環境變數「不會」自動更新，要重啟 Pod 才能取到新值。這是很多人踩過的坑。`,
    duration: "10",
  },

  // ========== ConfigMap Volume 掛載 & 更新機制 ==========
  {
    title: "ConfigMap Volume 掛載與更新機制",
    subtitle: "動態載入設定的最佳方式",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/80 p-4 rounded-lg">
          <p className="text-purple-400 font-semibold mb-2">③ Volume 掛載 — 設定檔形式</p>
          <pre className="text-xs font-mono text-slate-300 whitespace-pre">{`spec:
  volumes:
  - name: config-vol
    configMap:
      name: nginx-config
  containers:
  - name: nginx
    image: nginx:latest
    volumeMounts:
    - name: config-vol
      mountPath: /etc/nginx/conf.d
      readOnly: true
# ConfigMap 每個 key 在目錄下對應一個檔案`}</pre>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
            <p className="text-yellow-400 font-semibold mb-2">🔄 更新機制比較</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-1 text-slate-400">方式</th>
                  <th className="text-left py-1 text-slate-400">自動更新？</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr><td className="py-1">環境變數 (envFrom)</td><td className="text-red-400">✗ 需重啟 Pod</td></tr>
                <tr><td className="py-1">Volume 掛載</td><td className="text-green-400">✓ 約 60 秒自動同步</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
            <p className="text-k8s-blue font-semibold mb-2">常見指令</p>
            <pre className="text-xs font-mono text-green-400 whitespace-pre">{`# 查看 ConfigMap
kubectl get configmap
kubectl describe cm app-config

# 編輯（觸發自動更新）
kubectl edit configmap app-config

# 替換整個 ConfigMap
kubectl apply -f configmap.yaml`}</pre>
          </div>
        </div>
      </div>
    ),
    notes: `第三種使用 ConfigMap 的方式是 Volume 掛載，這也是最強大的方式。

原理是這樣：你把 ConfigMap 掛成一個 Volume，然後把這個 Volume 掛到容器裡的某個目錄。ConfigMap 裡的每一個 key 都會成為該目錄下的一個「檔案」，key 是檔名，value 是檔案內容。

舉一個很典型的例子：你有一個 nginx.conf 設定檔，希望可以動態修改，不用重 build Image。做法是：把 nginx.conf 的內容放進 ConfigMap，然後用 Volume 掛到 /etc/nginx/conf.d/ 目錄。每次更新 ConfigMap，nginx 的設定檔就自動更新了（不過 nginx 本身可能需要 reload，這是應用層的問題）。

這就帶到一個很重要的問題：ConfigMap 更新後，Pod 裡的值什麼時候會跟著更新？

如果你用環境變數（envFrom 或 valueFrom），答案是「不會自動更新」。環境變數在 Pod 啟動時就寫入了，之後更改 ConfigMap 對已運行的 Pod 沒有任何影響。要看到新值，必須重啟 Pod（kubectl rollout restart deployment）。

如果你用 Volume 掛載，答案是「會自動更新」，通常在 60 秒以內 kubelet 會同步新的 ConfigMap 內容到掛載的檔案。但注意，這只是「檔案更新了」，你的應用程式要怎麼反應到這個更新，是應用程式自己的責任，比如 nginx 要執行 nginx -s reload 才會真的重新讀設定。

這個差異在實際工作中很重要，不少新手誤以為改了 ConfigMap 就萬事大吉，結果 Pod 裡的設定還是舊的。`,
    duration: "10",
  },

  // ========== Secret 簡介與類型 ==========
  {
    title: "Secret 是什麼？",
    subtitle: "敏感資訊的專用容器",
    section: "Secret 深入",
    content: (
      <div className="space-y-5">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">Secret vs ConfigMap</p>
          <p className="text-slate-300 mt-1 text-sm">
            Secret 和 ConfigMap 用法幾乎相同，但專門用來儲存<span className="text-red-400 font-bold">敏感資料</span>（密碼、Token、憑證），
            並提供額外的存取控制機制。
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-orange-400 font-bold text-lg mb-2">Opaque</p>
            <p className="text-slate-400 text-sm">預設類型，任意鍵值對</p>
            <pre className="text-xs text-green-400 mt-2 font-mono">{`# 密碼、API Key
type: Opaque`}</pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-bold text-lg mb-2">kubernetes.io/tls</p>
            <p className="text-slate-400 text-sm">TLS 憑證與私鑰</p>
            <pre className="text-xs text-green-400 mt-2 font-mono">{`# tls.crt / tls.key
type: kubernetes.io/tls`}</pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-purple-400 font-bold text-lg mb-2">dockerconfigjson</p>
            <p className="text-slate-400 text-sm">私有 Registry 認證</p>
            <pre className="text-xs text-green-400 mt-2 font-mono">{`# imagePullSecrets 用
type: kubernetes.io/
  dockerconfigjson`}</pre>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ 重要認知</p>
          <p className="text-yellow-200">Secret 的 value 預設只是 base64 編碼，並非加密。強烈建議搭配 etcd 加密、RBAC、或外部 Vault 系統使用。</p>
        </div>
      </div>
    ),
    notes: `進到 Secret 了。先說一個很多人搞混的觀念：Secret 跟 ConfigMap 的用法幾乎完全一樣，差別在於 Secret 是設計來存放敏感資料的，Kubernetes 對它有一些額外的保護機制，比如 RBAC 可以單獨控制誰能讀 Secret，而且 Pod 的 spec 不會直接顯示 Secret 的值。

Secret 有三種最常見的類型，我一一說明。

Opaque 是預設類型，名字很奇怪，意思是「不透明」。你可以用來存任何你想存的 key-value，比如資料庫密碼、第三方 API 金鑰、JWT 簽名 secret 等。這是最常用的類型。

kubernetes.io/tls 是專門給 TLS 憑證用的類型。裡面有兩個固定的 key：tls.crt 是憑證內容，tls.key 是對應的私鑰。這個類型通常搭配 Ingress 使用，設定 HTTPS。

kubernetes.io/dockerconfigjson 是給 Docker Registry 認證用的。當你的叢集需要從私有 Registry 拉 Image，比如公司的 Harbor 或 AWS ECR，就需要建立這種類型的 Secret，然後在 Pod spec 裡用 imagePullSecrets 引用它，才能成功拉取。

最後我要特別提醒一個非常重要的概念：很多人以為 Secret 裡的值是「加密」的，其實不是！Secret 的值只是用 base64 做了「編碼」，這只是一種格式轉換，不是加密。任何人拿到 base64 字串都可以輕易解碼。所以 Secret 的安全性，必須靠 RBAC 控制誰能讀取，以及 etcd 加密來保障。這是面試和實際工作中很重要的概念。`,
    duration: "8",
  },

  // ========== Secret base64 & 建立方式 ==========
  {
    title: "Secret 建立方式",
    subtitle: "base64 編碼與 kubectl 指令",
    section: "Secret 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/80 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">方式一：kubectl 指令（自動 base64）</p>
          <pre className="text-green-400 text-xs font-mono whitespace-pre">{`# Opaque Secret
kubectl create secret generic db-secret \\
  --from-literal=DB_PASSWORD=my-secret-pass \\
  --from-literal=DB_USER=admin

# TLS Secret
kubectl create secret tls my-tls \\
  --cert=tls.crt --key=tls.key

# Docker Registry
kubectl create secret docker-registry regcred \\
  --docker-server=registry.example.com \\
  --docker-username=user --docker-password=pass`}</pre>
        </div>
        <div className="bg-slate-800/80 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">方式二：YAML（需手動 base64 編碼）</p>
          <pre className="text-green-400 text-xs font-mono whitespace-pre">{`# 先用指令產生 base64：
# echo -n "my-secret-pass" | base64
# 輸出: bXktc2VjcmV0LXBhc3M=

apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  DB_PASSWORD: bXktc2VjcmV0LXBhc3M=   # base64
  DB_USER: YWRtaW4=                     # base64

# 或使用 stringData（直接填明文，K8s 自動編碼）
stringData:
  DB_PASSWORD: my-secret-pass`}</pre>
        </div>
      </div>
    ),
    notes: `Secret 的建立方式和 ConfigMap 很類似，但有一個重要的不同：Secret 的 value 必須是 base64 編碼的字串。

先解釋 base64。這是一種把任意二進位資料轉換成純文字的編碼方式，方便在 YAML 這種純文字格式裡存放任意資料。要 base64 編碼一個字串，用 Linux 指令：echo -n "my-secret-pass" | base64，-n 是避免 echo 在結尾加換行符號（不加 -n 的話 base64 結果會不對，這是很常見的錯誤）。

kubectl create secret generic 是最方便的建立方式，你直接填明文的值，kubectl 會自動幫你做 base64 編碼，不用自己算。這是測試和快速建立時推薦的方式。

如果你要寫 YAML，有兩種欄位可以用：data 欄位裡面要填 base64 編碼的值；stringData 欄位可以直接填明文字串，Kubernetes 在存進 etcd 之前會自動幫你編碼。一般建議用 stringData 在開發環境比較方便，但要注意如果你把含 stringData 的 YAML 推到 Git，等於把明文密碼推到版本控制了，非常危險！正式環境的做法是：不要把含有明文密碼的 YAML 存進 Git，改用 Sealed Secrets、External Secrets Operator 或 HashiCorp Vault 來管理。

現在大家動手建立一個 db-secret：kubectl create secret generic db-secret --from-literal=DB_PASSWORD=supersecret123 --from-literal=DB_USER=admin。建立後執行 kubectl get secret db-secret -o yaml，看看輸出的 data 欄位是什麼格式。`,
    duration: "7",
  },

  // ========== Secret 使用方式 ==========
  {
    title: "Secret 使用方式",
    subtitle: "Volume 掛載（推薦） vs 環境變數",
    section: "Secret 深入",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-600/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 推薦：Volume 掛載</p>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre">{`spec:
  volumes:
  - name: secret-vol
    secret:
      secretName: db-secret
  containers:
  - name: app
    volumeMounts:
    - name: secret-vol
      mountPath: /etc/secrets
      readOnly: true
# /etc/secrets/DB_PASSWORD
# /etc/secrets/DB_USER`}</pre>
          </div>
          <div className="bg-orange-900/30 border border-orange-600/50 p-4 rounded-lg">
            <p className="text-orange-400 font-semibold mb-2">⚠️ 謹慎：環境變數注入</p>
            <pre className="text-xs font-mono text-slate-300 whitespace-pre">{`spec:
  containers:
  - name: app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: DB_PASSWORD
# 問題：
# env 可能被 debug 工具看見
# kubectl describe pod 看得到 key 名稱
# 子程序會繼承環境變數`}</pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-1">Volume 掛載的安全優勢</p>
          <ul className="text-slate-300 space-y-1">
            <li>• Secret 更新後約 60 秒自動同步（不需重啟 Pod）</li>
            <li>• 可設定 readOnly: true 防止意外寫入</li>
            <li>• 以檔案形式存在，不會暴露在 /proc/PID/environ</li>
          </ul>
        </div>
      </div>
    ),
    notes: `Secret 的使用方式和 ConfigMap 一樣有兩大類：Volume 掛載和環境變數。但這裡有個明確的安全性建議：Secret 應該優先用 Volume 掛載，而不是環境變數。

為什麼？讓我解釋環境變數方式的問題。

第一，環境變數會暴露在 /proc/[PID]/environ 這個虛擬檔案裡，任何能夠讀取該路徑的程序都能看到。在某些容器逃逸或程序注入的攻擊場景，這是資訊洩露的來源。

第二，透過 kubectl exec 進入容器後，env 指令可以直接看到所有環境變數，包括密碼。

第三，子程序會繼承父程序的環境變數，這可能造成意外的密碼傳播。

Volume 掛載的方式，Secret 的值是以「檔案」的形式存在，而不是環境變數。應用程式在需要的時候讀取特定檔案，這樣密碼的存取更受控制。另外，Volume 掛載的 Secret 在 ConfigMap 更新後也同樣會自動同步，不需要重啟 Pod。

當然，有些程式框架或舊有系統只支援從環境變數讀取設定，這種情況下環境變數方式也可以接受，但要額外注意存取控制。

實作上最常見的 Volume 掛載模式是：把 Secret 掛到 /etc/secrets/ 或類似的目錄，然後把這個目錄設定為 readOnly: true，應用程式從這個目錄讀取對應的設定檔。`,
    duration: "10",
  },

  // ========== Secret 安全性最佳實踐 ==========
  {
    title: "Secret 安全性最佳實踐",
    subtitle: "不只是 base64 這麼簡單",
    section: "Secret 深入",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "🔐",
              title: "啟用 etcd 加密",
              desc: "Secret 存入 etcd 時進行 AES 加密（EncryptionConfiguration）",
              color: "bg-blue-900/30 border-blue-700/50",
              textColor: "text-blue-400",
            },
            {
              icon: "🛡️",
              title: "RBAC 最小權限",
              desc: "只有需要用 Secret 的 ServiceAccount 才授予讀取權限",
              color: "bg-green-900/30 border-green-700/50",
              textColor: "text-green-400",
            },
            {
              icon: "🚫",
              title: "不要推入 Git",
              desc: "含明文密碼的 YAML 不得進入版本控制",
              color: "bg-red-900/30 border-red-700/50",
              textColor: "text-red-400",
            },
            {
              icon: "🏦",
              title: "考慮外部 Vault",
              desc: "生產環境用 HashiCorp Vault、AWS Secrets Manager 或 Sealed Secrets",
              color: "bg-purple-900/30 border-purple-700/50",
              textColor: "text-purple-400",
            },
          ].map((item, i) => (
            <div key={i} className={`border p-4 rounded-lg ${item.color}`}>
              <p className={`font-semibold mb-1 ${item.textColor}`}>{item.icon} {item.title}</p>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold mb-2">🔍 快速稽核指令</p>
          <pre className="text-green-400 font-mono text-xs whitespace-pre">{`# 列出所有 Secret（避免明文 value 外洩，不要加 -o yaml 在公開場合）
kubectl get secrets -A

# 確認特定 Secret 的 type
kubectl get secret db-secret -o jsonpath='{.type}'

# 解碼 base64（驗證時使用）
kubectl get secret db-secret -o jsonpath='{.data.DB_PASSWORD}' | base64 -d`}</pre>
        </div>
      </div>
    ),
    notes: `Secret 的安全性是一個很大的話題，我把最重要的幾個實踐整理出來。

第一，啟用 etcd 加密（EncryptionConfiguration）。預設情況下，Secret 存在 etcd 裡只是 base64 編碼，並沒有加密。如果有人能直接存取 etcd 的資料，就能讀到所有 Secret 的值。為了防止這種情況，K8s 支援在 etcd level 對 Secret 進行 AES 加密。這個設定需要在 API Server 的啟動參數裡設定 EncryptionConfiguration，在 GKE、EKS 等雲端平台通常有選項可以開啟。

第二，RBAC 最小權限。用 RBAC（Role-Based Access Control）嚴格控制誰能讀 Secret。只有真正需要用到 Secret 的 ServiceAccount 才授予 get 和 list 的權限，其他的一律拒絕。這樣即使叢集裡有惡意程序，沒有對應的 RBAC 權限就讀不到 Secret。

第三，永遠不要把含有明文密碼的 YAML 推入 Git。這個我在業界見過太多次了，整個資料庫密碼就這樣躺在 GitHub public repo 上。解決方案是用 Sealed Secrets（把 Secret 加密後才推入 Git）或者 External Secrets Operator（從 AWS Secrets Manager、Vault 等外部系統動態拉取 Secret）。

第四，生產環境考慮外部 Vault 系統。HashiCorp Vault 是業界標準的 Secret 管理工具，支援動態 Secret 生成、自動輪換、詳細的存取稽核。這已經超出 K8s 原生 Secret 的範疇，但大型生產環境都應該往這個方向走。

稽核現有叢集的 Secret 安全性：kubectl get secrets -A 列出所有 namespace 的 Secret，看看有沒有不應該存在的；搭配 RBAC 審計確認每個 Secret 的存取權限是否符合最小權限原則。`,
    duration: "10",
  },

  // ========== 休息 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">放鬆一下，等等進入資源管控！</p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400">下半場預告</p>
          <p className="text-xl text-k8s-blue">ResourceQuota × LimitRange × Taints × Affinity</p>
        </div>
      </div>
    ),
    notes: `好，我們已經把 ConfigMap 和 Secret 學完了，這是今天最核心的組態管理部分。大家先休息 15 分鐘，上廁所、喝水、活動筋骨。

對剛才的 ConfigMap 或 Secret 有任何問題，可以趁這個時候來找我或助教。

15 分鐘後我們繼續，下半場主題是資源管控和排程策略，這些是讓 K8s 叢集在多團隊環境下正常運作的重要機制。準時回來！`,
    duration: "1",
  },

  // ========== ResourceQuota ==========
  {
    title: "ResourceQuota",
    subtitle: "Namespace 層級的資源配額",
    section: "資源管控",
    content: (
      <div className="space-y-4">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">為什麼需要 ResourceQuota？</p>
          <p className="text-slate-300 mt-1">多個團隊共用同一個叢集時，防止某個 Namespace 無限消耗資源，影響其他人。</p>
        </div>
        <div className="bg-slate-800/80 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">ResourceQuota YAML 範例</p>
          <pre className="text-xs font-mono text-green-400 whitespace-pre">{`apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-a-quota
  namespace: team-a
spec:
  hard:
    # Pod 數量
    pods: "20"
    # CPU：request 上限
    requests.cpu: "4"
    # Memory：request 上限
    requests.memory: "8Gi"
    # CPU：limit 上限
    limits.cpu: "8"
    # Memory：limit 上限
    limits.memory: "16Gi"
    # Service 數量
    services: "10"
    # ConfigMap 數量
    configmaps: "20"
    # PersistentVolumeClaim 數量
    persistentvolumeclaims: "5"`}</pre>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs font-mono text-green-400">
          {`kubectl get resourcequota -n team-a\nkubectl describe resourcequota team-a-quota -n team-a`}
        </div>
      </div>
    ),
    notes: `休息完了，進入後半段的第一個主題：ResourceQuota。

先說一個真實場景。你的公司有一個 K8s 叢集，有三個開發團隊共用，分別用 team-a、team-b、team-c 三個 Namespace 隔離。某天 team-a 的開發者搞錯了，設定了一個迴圈把 CPU 資源用完，結果整個叢集的 team-b 和 team-c 的應用都因為搶不到資源開始出問題。這是一個很經典的「嘈雜鄰居」（noisy neighbor）問題。

ResourceQuota 就是解決這個問題的：它讓你在 Namespace 層級設定「這個 Namespace 最多可以用多少資源」，超過配額就不讓你建立新的資源。

ResourceQuota 可以限制的東西很多，最常用的幾類：CPU 和 Memory 的 request/limit 上限（注意，要分開設定，request 是調度時用的，limit 是實際執行時的最大值）；Pod、Service、ConfigMap、PVC 的數量上限。

設定了 ResourceQuota 之後有一個很重要的副作用：如果你的 Pod spec 裡沒有設定 resources.requests，創建 Pod 會失敗！因為 K8s 無法判斷這個 Pod 會用多少資源，所以拒絕建立。這就是為什麼我們接下來要學 LimitRange，給容器設一個預設的 resource 設定。

查看 ResourceQuota 的使用狀況：kubectl describe resourcequota team-a-quota -n team-a，可以看到目前已使用多少、還剩多少配額。`,
    duration: "12",
  },

  // ========== ResourceQuota 實作 ==========
  {
    title: "ResourceQuota 實作",
    subtitle: "建立配額並觀察限制效果",
    section: "資源管控",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Step 1：建立 Namespace 和 Quota</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre">{`kubectl create namespace quota-demo
kubectl apply -f - <<EOF
apiVersion: v1
kind: ResourceQuota
metadata:
  name: demo-quota
  namespace: quota-demo
spec:
  hard:
    pods: "3"
    requests.cpu: "500m"
    requests.memory: "512Mi"
    limits.cpu: "1"
    limits.memory: "1Gi"
EOF`}</pre>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Step 2：查看配額狀態</p>
            <pre className="text-green-400 text-xs font-mono whitespace-pre">{`kubectl describe quota demo-quota \\
  -n quota-demo

# 輸出範例：
Name:            demo-quota
Namespace:       quota-demo
Resource         Used  Hard
--------         ----  ----
limits.cpu       0     1
limits.memory    0     1Gi
pods             0     3
requests.cpu     0     500m
requests.memory  0     512Mi`}</pre>
          </div>
        </div>
        <div className="bg-slate-800/80 p-3 rounded-lg">
          <p className="text-slate-400 text-xs mb-1">Step 3：建立 Pod（有 resources 設定）</p>
          <pre className="text-green-400 text-xs font-mono whitespace-pre">{`kubectl run test-pod --image=nginx -n quota-demo \\
  --overrides='{"spec":{"containers":[{"name":"test-pod","image":"nginx","resources":{"requests":{"cpu":"100m","memory":"64Mi"},"limits":{"cpu":"200m","memory":"128Mi"}}}]}}'

# 嘗試建立第 4 個 Pod → 應該被拒絕！
# Error: pods "test-pod-4" is forbidden:
#   exceeded quota: demo-quota, ...`}</pre>
        </div>
      </div>
    ),
    notes: `來動手實作看看 ResourceQuota 的效果。這個實作我們分三步驟。

第一步：建立一個 demo 用的 Namespace，然後在裡面建立一個 ResourceQuota，設定最多 3 個 Pod，CPU request 上限 500m，Memory request 上限 512Mi。

第二步：用 kubectl describe quota 查看目前的配額使用狀況。你會看到一個表格，列出了每個資源的已使用量和上限，這是監控 Namespace 資源使用的好工具。

第三步：嘗試建立 Pod。注意，有了 ResourceQuota 之後，Pod 必須有 resources 設定，不然會被拒絕。我們用 --overrides 參數手動加上 resources request 和 limit。建立成功後，多建立幾個 Pod 直到超過配額，觀察 K8s 的錯誤訊息。

錯誤訊息大概是這樣：pods "test-pod-4" is forbidden: exceeded quota: demo-quota，後面會列出超過了哪個限制。這個錯誤訊息在實際工作中很常見，看到這個你就知道要去調整 ResourceQuota 或者幫應用程式優化資源用量了。

大家現在動手做，把三個步驟都走一遍。做完之後，用 kubectl delete namespace quota-demo 把測試環境清理掉，保持叢集整潔是好習慣。`,
    duration: "13",
  },

  // ========== LimitRange ==========
  {
    title: "LimitRange",
    subtitle: "為容器設定預設資源限制",
    section: "資源管控",
    content: (
      <div className="space-y-4">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">問題背景</p>
          <p className="text-slate-300 mt-1">設了 ResourceQuota 之後，沒有 resources 設定的 Pod 會被拒絕建立。LimitRange 可以給沒有設定 resources 的容器提供「預設值」，同時設定允許的 min/max 範圍。</p>
        </div>
        <div className="bg-slate-800/80 p-4 rounded-lg">
          <p className="text-slate-400 text-xs mb-2">LimitRange YAML 範例</p>
          <pre className="text-xs font-mono text-green-400 whitespace-pre">{`apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: team-a
spec:
  limits:
  - type: Container
    default:            # 未設定 limit 時的預設值
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:     # 未設定 request 時的預設值
      cpu: "100m"
      memory: "64Mi"
    min:                # 允許設定的最小值
      cpu: "50m"
      memory: "32Mi"
    max:                # 允許設定的最大值
      cpu: "2"
      memory: "2Gi"`}</pre>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold">查看效果</p>
            <pre className="text-xs text-green-400 font-mono">{`kubectl describe limitrange \\
  -n team-a`}</pre>
          </div>
          <div className="bg-yellow-500/20 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold text-xs">💡 LimitRange vs ResourceQuota</p>
            <p className="text-yellow-200 text-xs">LimitRange：每個 Pod 的限制<br />ResourceQuota：整個 Namespace 的限制</p>
          </div>
        </div>
      </div>
    ),
    notes: `LimitRange 跟 ResourceQuota 是配套使用的。我說一個很常見的問題場景。

你設好了 ResourceQuota，然後開發者在 team-a namespace 建立了一個 Pod，但忘了加 resources 設定，結果 Pod 建立失敗，錯誤訊息說「必須設定 resource request/limit」。這讓開發者很困惑，他不知道應該設多少比較合適。

LimitRange 就是來解決這個問題的。它做了兩件事：第一，幫沒有設定 resources 的容器填入預設值；第二，設定允許的 min 和 max 範圍，防止有人設置不合理的值，比如要求 1000 個 CPU 或者只給 1M 記憶體。

LimitRange 的 spec 裡有四個重要欄位：default 是當容器沒有設定 limit 時的預設 limit；defaultRequest 是當容器沒有設定 request 時的預設 request；min 是允許的最小值，設定比這個更小會被拒絕；max 是允許的最大值，設定比這個更大也會被拒絕。

實際工作上，通常 ResourceQuota 和 LimitRange 會一起使用。先設 LimitRange 給一個合理的預設值，再設 ResourceQuota 控制整個 Namespace 的總量。這樣大部分的 Pod 不需要特別設定 resources 就能在配額範圍內正常運作，只有特殊用途的 Pod（比如需要大量 CPU 的批次任務）才需要手動調整。

大家現在去查一下自己的 default namespace 有沒有 LimitRange：kubectl describe limitrange -n default。大部分課程環境可能沒有設定，這也是真實情況中很多初學者叢集的狀態。`,
    duration: "15",
  },

  // ========== Taints & Tolerations ==========
  {
    title: "Taints & Tolerations",
    subtitle: "讓特定 Pod 遠離或靠近特定 Node",
    section: "排程策略",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
            <p className="text-red-400 font-bold mb-2">🚫 Taint（Node 設定）</p>
            <p className="text-slate-300 text-sm mb-2">「這個 Node 我不歡迎一般 Pod，除非你有 Toleration」</p>
            <pre className="text-xs font-mono text-green-400 whitespace-pre">{`# 加上 Taint
kubectl taint nodes node1 \\
  gpu=true:NoSchedule

# 移除 Taint（加 - 符號）
kubectl taint nodes node1 \\
  gpu=true:NoSchedule-

# Taint Effect 三種：
# NoSchedule：不排程
# PreferNoSchedule：盡量不排程
# NoExecute：驅逐已存在的 Pod`}</pre>
          </div>
          <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
            <p className="text-green-400 font-bold mb-2">✅ Toleration（Pod 設定）</p>
            <p className="text-slate-300 text-sm mb-2">「我可以容忍這個 Node 的 Taint，讓我進去吧」</p>
            <pre className="text-xs font-mono text-green-400 whitespace-pre">{`spec:
  tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
  # operator 也可以是 "Exists"
  # （不管 value 是什麼都 tolerate）
  - key: "gpu"
    operator: "Exists"
    effect: "NoSchedule"
  containers:
  - name: gpu-app
    image: gpu-workload:latest`}</pre>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">典型使用場景</p>
          <p className="text-slate-300">GPU Node 只跑 AI 工作負載、維護中的 Node 不接受新 Pod、專屬 Node 只給特定團隊</p>
        </div>
      </div>
    ),
    notes: `進入排程策略。Taints 和 Tolerations 是一對相反的概念，一起理解才有意義。

先說 Taint。Taint 是你在 Node 上打的一個「排斥標記」，意思是「我這個 Node 不歡迎一般的 Pod 來排程，除非你能容忍這個 Taint」。用 kubectl taint 指令加上去，格式是 key=value:effect，比如 gpu=true:NoSchedule。

Taint Effect 有三種：NoSchedule 是最嚴格的，新的 Pod 如果沒有對應的 Toleration，就不會被排程到這個 Node，已存在的 Pod 不受影響；PreferNoSchedule 是盡量避免，但資源不夠的時候還是可能排進來；NoExecute 是最強的，不只拒絕新 Pod，還會把已存在但沒有 Toleration 的 Pod 驅逐出去。

Toleration 是你在 Pod spec 裡設定的「容忍聲明」，意思是「我可以接受帶有這個 Taint 的 Node，請讓我進去」。Toleration 的格式要跟 Node 上的 Taint 匹配：key、value、effect 都要對得上。

一個很經典的使用場景：你有幾台帶 GPU 的高價節點，希望只有 AI/ML 的工作負載才能用，一般應用不要去浪費 GPU 資源。做法是：在 GPU Node 上加 gpu=true:NoSchedule 的 Taint，然後在 AI 工作負載的 Pod spec 裡加對應的 Toleration。這樣只有 AI Pod 能進 GPU Node，一般 Pod 不會去那裡。

另一個場景：Node 要做維護，先加 maintenance=true:NoSchedule，這樣新 Pod 就不會排進去，等現有 Pod 自然結束後就可以安全維護了。`,
    duration: "10",
  },

  // ========== Taints 實作 ==========
  {
    title: "Taints & Tolerations 實作",
    subtitle: "觀察 Pod 的排程行為",
    section: "排程策略",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/80 p-3 rounded-lg">
          <p className="text-slate-400 text-xs mb-2">實作步驟</p>
          <pre className="text-green-400 text-xs font-mono whitespace-pre">{`# 1. 查看現有 Node 的 Taint
kubectl describe nodes | grep Taints

# 2. 對某個 Node 加上 Taint（單節點環境可用 minikube node）
kubectl taint nodes <your-node-name> demo=tainted:NoSchedule

# 3. 建立沒有 Toleration 的 Pod → 會 Pending
kubectl run no-toleration --image=nginx
kubectl get pod no-toleration -o wide  # STATUS: Pending

# 4. 查看為何 Pending
kubectl describe pod no-toleration
# 看 Events 區塊: 0/1 nodes available: 1 node(s) had taint

# 5. 建立有 Toleration 的 Pod → 正常排程
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: with-toleration
spec:
  tolerations:
  - key: "demo"
    operator: "Equal"
    value: "tainted"
    effect: "NoSchedule"
  containers:
  - name: nginx
    image: nginx
EOF

# 6. 清理
kubectl taint nodes <node-name> demo=tainted:NoSchedule-`}</pre>
        </div>
      </div>
    ),
    notes: `讓我們把 Taints 和 Tolerations 的效果親眼看一遍。

第一步，先查看現有 Node 上有沒有 Taint：kubectl describe nodes | grep Taints。大部分的叢集 control-plane 節點會有 node-role.kubernetes.io/control-plane:NoSchedule 這個內建的 Taint，這就是為什麼一般的 Pod 不會排到 control-plane 節點上去的原因，也是 Taints 最基本的應用。

第二步，找一個 Worker Node 的名稱，然後加上一個我們自訂的 Taint：demo=tainted:NoSchedule。

第三步，建立一個普通的 nginx Pod，觀察它的狀態。因為現在叢集裡所有 Worker Node 都有這個 Taint，而這個 Pod 沒有對應的 Toleration，它會一直卡在 Pending 狀態。

第四步，用 kubectl describe pod 看 Events 區塊，你會看到 K8s 調度器在說「0/1 nodes available: 1 node(s) had taint {demo: tainted} that the pod didn't tolerate」。這個錯誤訊息在實際工作中排查 Pod Pending 很有用，遇到這種情況就知道要查 Node 的 Taint 和 Pod 的 Toleration 設定。

第五步，建立一個有對應 Toleration 的 Pod，觀察它能正常排程並進入 Running 狀態。

做完後記得把 Taint 移除（在最後加 - 號），不然後續的實作可能會有問題。`,
    duration: "10",
  },

  // ========== Node Affinity & Pod Affinity ==========
  {
    title: "Node Affinity & Pod Affinity/Anti-Affinity",
    subtitle: "更精細的排程控制",
    section: "排程策略",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/80 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">🖥️ Node Affinity</p>
            <p className="text-slate-400 text-xs mb-2">「我想去有特定 Label 的 Node」</p>
            <pre className="text-xs font-mono text-green-400 whitespace-pre">{`spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/arch
            operator: In
            values:
            - amd64
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: zone
            operator: In
            values: [us-east-1a]`}</pre>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/80 p-3 rounded-lg">
              <p className="text-blue-400 font-semibold mb-1">🧲 Pod Affinity</p>
              <p className="text-slate-400 text-xs mb-1">「我想和有特定 Label 的 Pod 放在同一個 Node（或 zone）」</p>
              <pre className="text-xs font-mono text-green-400 whitespace-pre">{`podAffinity:
  requiredDuringScheduling...:
    - labelSelector:
        matchLabels:
          app: cache
      topologyKey: kubernetes.io/hostname`}</pre>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg">
              <p className="text-red-400 font-semibold mb-1">⚡ Pod Anti-Affinity</p>
              <p className="text-slate-400 text-xs mb-1">「我不想和有特定 Label 的 Pod 在同一個 Node」</p>
              <pre className="text-xs font-mono text-green-400 whitespace-pre">{`podAntiAffinity:
  requiredDuringScheduling...:
    - labelSelector:
        matchLabels:
          app: myapp
      topologyKey: kubernetes.io/hostname`}</pre>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <span className="text-slate-400">required = 硬性要求（不符合就 Pending）　</span>
          <span className="text-slate-400">preferred = 軟性偏好（盡量，無法滿足還是會排程）</span>
        </div>
      </div>
    ),
    notes: `最後一個排程主題：Affinity 和 Anti-Affinity。這比 Taints/Tolerations 更細緻，可以表達更複雜的排程需求。

Node Affinity 的意思是「我想去有特定 Label 的 Node」，比如我的應用只能跑在 amd64 架構的 Node（不能跑 arm64），或是我希望去有 SSD 的 Node，就可以用 Node Affinity 表達。

Node Affinity 有兩種強度：required 是硬性要求，找不到符合條件的 Node 就 Pending；preferred 是軟性偏好，有設定 weight（權重），調度器盡量找符合的 Node，但如果找不到也可以去其他 Node，不會 Pending。

Pod Affinity 是「我想和某些 Pod 放在一起」。比如你有一個後端 API 服務和一個 Redis Cache，希望它們在同一個 Node 以減少網路延遲，就可以在 API Pod 上設定 podAffinity：matchLabels app=cache。topologyKey 是關鍵參數，kubernetes.io/hostname 表示「同一個 Node」，kubernetes.io/zone 表示「同一個可用區」。

Pod Anti-Affinity 是相反的，「我不想和某些 Pod 在一起」。這在高可用部署中非常重要：你有 3 個 replica 的服務，希望它們分散在不同 Node，這樣一個 Node 掛了不會同時影響超過一個 replica。用 podAntiAffinity 加上自己的 app label，就能確保同一個服務的 Pod 分散在不同 Node 上。

這幾個概念背起來比較需要時間，大家先有個印象，實際遇到排程問題的時候再查文件。最重要的是知道「有這個機制可以用」，知道關鍵字就能查到做法。`,
    duration: "15",
  },

  // ========== 課程總結 ==========
  {
    title: "今日課程總結",
    subtitle: "第六堂早上回顧",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              icon: "🗺️",
              title: "ConfigMap",
              items: ["4種建立：字面值/檔案/目錄/YAML", "3種使用：envFrom / valueFrom / Volume", "Volume 掛載可自動更新（~60s）"],
              color: "bg-blue-900/30 border-blue-700/50",
              textColor: "text-blue-400",
            },
            {
              icon: "🔒",
              title: "Secret",
              items: ["3種類型：Opaque / TLS / dockerconfigjson", "base64 編碼 ≠ 加密，安全靠 RBAC+etcd", "推薦 Volume 掛載而非環境變數"],
              color: "bg-red-900/30 border-red-700/50",
              textColor: "text-red-400",
            },
            {
              icon: "📊",
              title: "ResourceQuota & LimitRange",
              items: ["ResourceQuota：Namespace 總量控制", "LimitRange：容器預設值 & min/max 範圍", "兩者搭配使用效果最佳"],
              color: "bg-green-900/30 border-green-700/50",
              textColor: "text-green-400",
            },
            {
              icon: "📌",
              title: "排程策略",
              items: ["Taints：Node 排斥標記，effect 三種", "Tolerations：Pod 容忍聲明", "Affinity/Anti-Affinity：精細排程控制"],
              color: "bg-purple-900/30 border-purple-700/50",
              textColor: "text-purple-400",
            },
          ].map((section, i) => (
            <div key={i} className={`border p-4 rounded-lg ${section.color}`}>
              <p className={`font-bold mb-2 ${section.textColor}`}>{section.icon} {section.title}</p>
              <ul className="space-y-1">
                {section.items.map((item, j) => (
                  <li key={j} className="text-slate-300 text-xs flex items-start gap-1">
                    <span className="text-slate-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-center">
          <p className="text-k8s-blue font-semibold">🍱 午餐休息，下午 13:00 見！</p>
          <p className="text-slate-300 text-sm">下午主題：Helm、Ingress、Persistent Storage</p>
        </div>
      </div>
    ),
    notes: `好，今天上午的內容到這裡，我們來做一個完整的回顧。

首先是 ConfigMap。我們學了四種建立方式：字面值（--from-literal）、單一檔案（--from-file）、整個目錄，以及 YAML 宣告式。正式環境用 YAML，方便版本控制。三種使用方式：envFrom 全量注入環境變數、env valueFrom 精準注入指定 key、Volume 掛載成檔案。重要差別：環境變數方式更新後要重啟 Pod 才生效，Volume 掛載大約 60 秒自動同步。

然後是 Secret。有三種類型：Opaque 是通用型，TLS 是憑證用，dockerconfigjson 是 Registry 認證用。最重要的觀念：Secret 的 value 只是 base64 編碼，不是加密。真正的安全要靠 RBAC 控制存取和 etcd 加密。使用方式上推薦 Volume 掛載而非環境變數，安全性更好。生產環境要考慮 Vault、Sealed Secrets 等外部方案。

ResourceQuota 和 LimitRange 是一對好搭檔。ResourceQuota 控制整個 Namespace 的資源總量；LimitRange 為沒有設定 resources 的容器提供預設值，並設定允許的 min/max 範圍。多團隊共用叢集時這兩個缺一不可。

排程策略部分，Taints 是 Node 上的排斥標記，Effect 有 NoSchedule、PreferNoSchedule、NoExecute 三種；Tolerations 是 Pod 對 Node Taint 的容忍聲明，兩者要匹配才能排程。Node Affinity 讓 Pod 偏好去特定 Node，Pod Anti-Affinity 讓同一服務的 Pod 分散在不同 Node，是高可用部署的關鍵設定。

大家今天學了非常多東西，容我說一句：今天的內容覆蓋了 K8s 生產環境中非常常見的配置模式，每個主題都值得在實際工作中反覆練習。

下午 13:00 我們繼續，主題是 Helm 套件管理、Ingress 流量路由，以及 Persistent Storage。記得好好休息，補充體力！大家有問題現在可以問，或是吃午餐的時候想到什麼，下午再跟我說。`,
    duration: "15",
  },
]
