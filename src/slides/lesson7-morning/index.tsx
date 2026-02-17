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
    title: "安全與監控",
    subtitle: "Kubernetes 叢集的守門員與眼睛",
    section: "第七堂早上",
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            🔐
          </div>
          <div>
            <p className="text-2xl font-semibold">Security &amp; Observability</p>
            <p className="text-slate-400">RBAC・Pod Security・Network Policy・Prometheus・EFK</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-3xl mb-2">🛡️</p>
            <p className="text-k8s-blue font-semibold">安全</p>
            <p className="text-slate-400 text-sm">RBAC / PSS / NetworkPolicy</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-k8s-blue font-semibold">監控</p>
            <p className="text-slate-400 text-sm">Prometheus / Grafana</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-3xl mb-2">📋</p>
            <p className="text-k8s-blue font-semibold">日誌</p>
            <p className="text-slate-400 text-sm">EFK Stack</p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg">
          <p className="text-k8s-blue text-sm font-semibold">⏱️ 09:00–12:00，共 180 分鐘</p>
        </div>
      </div>
    ),
    notes: `大家早安！歡迎來到第七堂課，今天是整個課程的倒數第二堂，我們要進入兩個非常關鍵的主題：安全與監控。

如果前幾堂課教的是「怎麼跑起來」，今天要教的就是「怎麼跑得穩、跑得安全、跑得可見」。一個生產環境的 Kubernetes 叢集，光是讓 Pod 跑起來是不夠的，你還需要確保：只有應該存取的人才能存取資源、容器不能做不該做的事、服務之間的流量有管控、叢集發生問題時你能第一時間知道、出了問題你有日誌可以查。

這六個字可以概括：最小權限原則。今天的所有主題，不管是 RBAC、Pod Security、Network Policy，核心思想都是這六個字——每個主體只給它需要的最小權限。

今天的內容比較有深度，特別是 RBAC 的部分概念比較抽象，我會用大量的類比和範例來幫大家理解。遇到不懂的地方隨時舉手，不要憋著。準備好了嗎？我們開始！`,
    duration: "3",
  },

  // ========== 課程大綱 ==========
  {
    title: "今日課程大綱",
    section: "課程總覽",
    content: (
      <div className="grid gap-3">
        {[
          { time: "09:00–09:05", topic: "開場", icon: "👋" },
          { time: "09:05–09:45", topic: "RBAC 權限管理", icon: "🔑" },
          { time: "09:45–10:10", topic: "Pod Security", icon: "🛡️" },
          { time: "10:10–10:30", topic: "Network Policy", icon: "🌐" },
          { time: "10:30–10:45", topic: "休息時間", icon: "☕" },
          { time: "10:45–11:10", topic: "監控基礎（Metrics / Prometheus / Grafana）", icon: "📊" },
          { time: "11:10–11:30", topic: "日誌管理（EFK Stack）", icon: "📋" },
          { time: "11:30–11:45", topic: "課程總結與 CKA 認證介紹", icon: "🎓" },
          { time: "11:45–12:00", topic: "Q&A", icon: "💬" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-sm">{item.time}</p>
              <p>{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `先看一下今天的時間安排，讓大家心裡有個底。

上半場分三塊：RBAC 是最重要的一塊，花了 40 分鐘，這是 CKA 考試的高頻考點，也是實務中最常遇到「為什麼我沒有權限」問題的根源。Pod Security 和 Network Policy 各花 25 分鐘和 20 分鐘，這兩塊概念相對直觀，重點放在實際的 YAML 寫法。

10:30 到 10:45 是休息。

下半場先是監控：Metrics Server、kubectl top 讓你看即時數據，Prometheus 是業界標準的監控系統，Grafana 負責把數據視覺化。然後是日誌管理，EFK Stack 是 K8s 生態最常見的集中化日誌方案。

最後半小時留給課程總結和 CKA 認證介紹，以及 Q&A 時間。大家有什麼問題可以留到最後的 Q&A，當然上課中隨時舉手也歡迎。`,
    duration: "2",
  },

  // ========== RBAC 概念介紹 ==========
  {
    title: "RBAC 是什麼？",
    subtitle: "Role-Based Access Control，以角色為基礎的存取控制",
    section: "RBAC 權限管理",
    content: (
      <div className="space-y-6">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-lg">
            <span className="text-k8s-blue font-bold">誰</span>（Subject）可以對
            <span className="text-green-400 font-bold">什麼資源</span>（Resource）執行
            <span className="text-yellow-400 font-bold">哪些操作</span>（Verb）？
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-900/40 border border-blue-600 p-4 rounded-lg">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-blue-400 font-bold">Subject（主體）</p>
            <p className="text-slate-300 text-sm mt-2">User<br />Group<br />ServiceAccount</p>
          </div>
          <div className="bg-green-900/40 border border-green-600 p-4 rounded-lg">
            <p className="text-3xl mb-2">📦</p>
            <p className="text-green-400 font-bold">Resource（資源）</p>
            <p className="text-slate-300 text-sm mt-2">pods<br />deployments<br />secrets</p>
          </div>
          <div className="bg-yellow-900/40 border border-yellow-600 p-4 rounded-lg">
            <p className="text-3xl mb-2">⚡</p>
            <p className="text-yellow-400 font-bold">Verb（動作）</p>
            <p className="text-slate-300 text-sm mt-2">get / list<br />create / update<br />delete / watch</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm mb-2">K8s RBAC 四個核心物件</p>
          <div className="flex gap-3 flex-wrap">
            {["ServiceAccount", "Role / ClusterRole", "RoleBinding / ClusterRoleBinding"].map((obj) => (
              <span key={obj} className="bg-k8s-blue/30 text-k8s-blue px-3 py-1 rounded-full text-sm">{obj}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `好，進入正題。RBAC 全名是 Role-Based Access Control，翻成中文是「以角色為基礎的存取控制」。

在 Kubernetes 出現之前，K8s 的存取控制比較混亂，任何連上 API Server 的人幾乎都能做任何事。RBAC 在 K8s 1.8 版成為 GA（Generally Available），現在幾乎所有叢集都是預設啟用的。

RBAC 的核心問題就是這一句話：「誰，可以對什麼資源，做什麼事？」

拆開來說：

「誰」是主體（Subject），在 K8s 裡有三種：User（人類使用者，用 kubeconfig 認證的帳號）、Group（使用者群組）、ServiceAccount（程式身份，專門給 Pod 裡的應用程式使用）。

「什麼資源」就是 K8s 的各種物件：pods、deployments、services、secrets、configmaps 等等，你在 API Server 裡能操作的所有東西都是資源。

「做什麼事」是動詞（Verb）：get（取得單一資源）、list（列出資源）、watch（監聽變化）、create（建立）、update（更新）、patch（部分更新）、delete（刪除）。

K8s RBAC 用四個物件來描述和授予這些權限：ServiceAccount（身份）、Role/ClusterRole（定義能做什麼）、RoleBinding/ClusterRoleBinding（把身份和權限綁在一起）。接下來我們一個一個說。`,
    duration: "10",
  },

  // ========== ServiceAccount ==========
  {
    title: "ServiceAccount",
    subtitle: "給 Pod 裡的程式使用的身份",
    section: "RBAC 權限管理",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">建立 ServiceAccount</p>
            <pre className="text-green-400 text-sm font-mono">{`apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app-sa
  namespace: default`}</pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Pod 使用 ServiceAccount</p>
            <pre className="text-green-400 text-sm font-mono">{`apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-app-sa
  containers:
  - name: app
    image: myapp:v1`}</pre>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">⚠️ 預設 ServiceAccount</p>
          <p className="text-yellow-200 text-sm">每個 Namespace 都有一個 <code className="bg-slate-700 px-1 rounded">default</code> ServiceAccount，Pod 若未指定則自動使用它。建議明確指定，避免意外授權。</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-400 text-sm">Token 自動掛載路徑：</p>
          <code className="text-green-400 text-sm">/var/run/secrets/kubernetes.io/serviceaccount/token</code>
        </div>
      </div>
    ),
    notes: `ServiceAccount 是 K8s RBAC 裡最常用的 Subject（主體），它代表的是「程式的身份」，不是人的身份。

為什麼需要 ServiceAccount？想像一個場景：你有一個應用程式跑在 Pod 裡，它需要呼叫 Kubernetes API 來查詢其他 Pod 的狀態（比如做服務發現）。這個應用程式需要有一個「身份」，API Server 才知道要不要允許它的請求。這個身份就是 ServiceAccount。

每個 Namespace 建立時，K8s 會自動建立一個叫做 default 的 ServiceAccount。如果你的 Pod 沒有明確指定 serviceAccountName，就會自動使用這個 default SA。問題是，default SA 可能被賦予了一些你不想要的權限，或者相反地，你不同的應用程式應該有不同的權限，放在一起不安全。所以最佳實務是：每個應用程式建立自己的 ServiceAccount，明確指定，只給它需要的最小權限。

建立 ServiceAccount 很簡單，就是一個 YAML，kind 是 ServiceAccount，給它一個名字，指定 namespace。然後在 Pod spec 裡加上 serviceAccountName 欄位。

K8s 會自動把 SA 的 Token 掛載到 Pod 裡的一個固定路徑：/var/run/secrets/kubernetes.io/serviceaccount/token。應用程式可以讀取這個 token 來向 API Server 認證。現在 K8s 1.24 以後，Token 是有時效的（預設 1 小時），會自動輪換，更安全。

如果你的 Pod 完全不需要呼叫 K8s API，可以在 Pod spec 加上 automountServiceAccountToken: false，讓 K8s 不要自動掛載 token，減少攻擊面。`,
    duration: "10",
  },

  // ========== Role / ClusterRole ==========
  {
    title: "Role 與 ClusterRole",
    subtitle: "定義「能做什麼」的權限規則",
    section: "RBAC 權限管理",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">Role（Namespace 級別）</p>
            <pre className="text-green-400 text-xs font-mono">{`apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]`}</pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-purple-400 font-semibold mb-2">ClusterRole（叢集級別）</p>
            <pre className="text-green-400 text-xs font-mono">{`apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-reader
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]`}</pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-400 font-semibold mb-1">Role 的特點</p>
              <ul className="text-slate-300 space-y-1">
                <li>• 只在特定 Namespace 生效</li>
                <li>• 無法操作叢集級資源（Node、PV）</li>
              </ul>
            </div>
            <div>
              <p className="text-purple-400 font-semibold mb-1">ClusterRole 的特點</p>
              <ul className="text-slate-300 space-y-1">
                <li>• 可操作叢集級資源</li>
                <li>• 可被 RoleBinding 限縮到單一 Namespace</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">📌 apiGroups 說明</p>
          <p className="text-slate-300">核心資源（Pod/Service/ConfigMap）用 <code className="bg-slate-700 px-1 rounded">""</code>，其他用完整群組名，如 <code className="bg-slate-700 px-1 rounded">apps</code>（Deployment）、<code className="bg-slate-700 px-1 rounded">batch</code>（Job）</p>
        </div>
      </div>
    ),
    notes: `Role 和 ClusterRole 是用來「定義一組權限」的物件。你可以把它理解成工作職責說明書：你被授予了「Pod 閱讀員」這個角色，代表你可以 get、list、watch pods，但不能 create 或 delete。

Role 和 ClusterRole 的差別在於適用範圍：Role 只在它所屬的 Namespace 內生效。如果你在 default namespace 建立了一個 pod-reader Role，它只對 default namespace 的 pods 有效，對 production namespace 的 pods 完全沒有影響。ClusterRole 是叢集級別的，可以操作所有 namespace 的資源，也可以操作叢集級別的資源，比如 Node、PersistentVolume、Namespace 本身。

YAML 的結構說明：rules 是一個陣列，每一條規則包含三個欄位。apiGroups 是 API 群組，Kubernetes 的 API 是分群組的。核心資源（Pod、Service、ConfigMap、Secret）屬於核心群組，apiGroups 填空字串 ""。Deployment、StatefulSet 屬於 apps 群組。Job、CronJob 屬於 batch 群組。resources 就是資源種類，用複數形式，比如 pods、deployments、services。verbs 是允許的動作，常見的有 get、list、watch、create、update、patch、delete，也可以用 * 代表所有動作（但要謹慎使用）。

一個最佳實務：要了解某個資源屬於哪個 apiGroup，可以執行 kubectl api-resources 查看完整列表，第二欄就是 APIGROUP。`,
    duration: "10",
  },

  // ========== RoleBinding / ClusterRoleBinding ==========
  {
    title: "RoleBinding 與 ClusterRoleBinding",
    subtitle: "把身份與權限綁在一起",
    section: "RBAC 權限管理",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">RoleBinding — 把 SA 綁到 Role</p>
          <pre className="text-green-400 text-xs font-mono">{`apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-app-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`}</pre>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-blue-900/40 border border-blue-600 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">ServiceAccount</p>
            <p className="text-slate-400 text-xs">my-app-sa</p>
          </div>
          <div className="flex items-center justify-center text-2xl">→</div>
          <div className="bg-green-900/40 border border-green-600 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">Role</p>
            <p className="text-slate-400 text-xs">pod-reader</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">🔑 四種組合</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-yellow-200">
            <p>RoleBinding + Role → 限單一 NS</p>
            <p>RoleBinding + ClusterRole → 限單一 NS</p>
            <p>ClusterRoleBinding + ClusterRole → 全叢集</p>
            <p className="text-slate-500">ClusterRoleBinding + Role → 無效組合</p>
          </div>
        </div>
      </div>
    ),
    notes: `Role 和 ClusterRole 只是「定義」了一組規則，它本身什麼都不做。要讓權限真正生效，需要 RoleBinding 或 ClusterRoleBinding 把主體和角色綁在一起。這就是「授權」的動作。

RoleBinding 的結構有兩個重要部分：subjects 和 roleRef。subjects 是「誰」，就是我們要授權的主體，可以是 ServiceAccount、User 或 Group。roleRef 是「授予哪個角色」，指向一個 Role 或 ClusterRole。

讓我重點講一下那四種組合，這是初學者最容易搞混的地方：

第一種：RoleBinding 綁 Role，這是最常見的用法。把一個 Namespace 裡的 SA 或 User 綁定到同 Namespace 的 Role。效果是：只在該 Namespace 內有那個 Role 定義的權限。

第二種：RoleBinding 綁 ClusterRole，這個組合非常有用。它讓你可以重複使用 ClusterRole，但把效果限縮到某個特定 Namespace。比如你建立一個 ClusterRole 叫 secret-reader，然後在 production namespace 建立 RoleBinding 把它綁給某個 SA。這個 SA 只能讀 production namespace 的 secrets，不能讀其他 namespace 的。

第三種：ClusterRoleBinding 綁 ClusterRole，效果是全叢集。這個 SA 可以在所有 namespace 執行 ClusterRole 定義的操作。通常只給叢集管理工具使用，一般應用程式盡量避免。

有一個常見的陷阱：subjects 裡的 namespace 必須填正確。如果你的 ServiceAccount 在 production namespace，但 subjects.namespace 寫成 default，授權就不會生效。`,
    duration: "10",
  },

  // ========== kubectl auth can-i ==========
  {
    title: "驗證權限：kubectl auth can-i",
    section: "RBAC 權限管理",
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 確認自己是否有某個權限</p>
            <code className="text-green-400">kubectl auth can-i get pods</code>
            <p className="text-slate-500 text-sm mt-1">→ yes</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 以特定 ServiceAccount 身份查詢</p>
            <code className="text-green-400">kubectl auth can-i list secrets --as=system:serviceaccount:default:my-app-sa</code>
            <p className="text-slate-500 text-sm mt-1">→ no</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 查詢在特定 namespace 的權限</p>
            <code className="text-green-400">kubectl auth can-i delete pods -n production</code>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 列出目前使用者所有權限（K8s 1.26+）</p>
            <code className="text-green-400">kubectl auth can-i --list -n default</code>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">💡 除錯 RBAC 的黃金工具</p>
          <p className="text-slate-300">當遇到 Forbidden 錯誤，第一步就是用 can-i 確認哪個主體缺少哪個權限</p>
        </div>
      </div>
    ),
    notes: `設定好 RBAC 之後，怎麼確認它有沒有正確生效？這時候 kubectl auth can-i 就是你最好的朋友，也是 CKA 考試裡非常常見的操作題。

最基本的用法：kubectl auth can-i get pods，這個指令問的是「我（目前認證的使用者）能不能 get pods？」，K8s 會直接回答 yes 或 no。

更強大的是 --as 旗標，讓你模擬成其他身份來測試。語法是 system:serviceaccount:<namespace>:<serviceaccount-name>。比如要測試 default namespace 的 my-app-sa 能不能 list secrets，就是：kubectl auth can-i list secrets --as=system:serviceaccount:default:my-app-sa。這在除錯和上 CKA 考試的時候超級有用，你可以在 apply 之前先測試 RBAC 設定是否符合預期。

加上 -n 旗標可以指定 namespace：kubectl auth can-i delete pods -n production，問的是「在 production namespace，我能不能 delete pods？」

K8s 1.26 以上還有 --list 選項，會列出目前主體在指定 namespace 的所有權限，讓你一目瞭然。

實際除錯流程：當你的 Pod 或應用程式出現 403 Forbidden，先確認是哪個 ServiceAccount 在發請求，然後用 can-i 搭配 --as 測試，找到缺失的權限，再補上對應的 Role 和 RoleBinding。這個流程要練熟，考試和工作都用得到。`,
    duration: "8",
  },

  // ========== Security Context ==========
  {
    title: "Security Context",
    subtitle: "控制容器的執行安全設定",
    section: "Pod Security",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <pre className="text-green-400 text-xs font-mono">{`apiVersion: v1
kind: Pod
spec:
  securityContext:           # Pod 級別（影響所有容器）
    runAsNonRoot: true       # 禁止以 root 執行
    runAsUser: 1000          # 指定 UID
    fsGroup: 2000            # 掛載磁碟的 GID
  containers:
  - name: app
    image: nginx:alpine
    securityContext:         # 容器級別
      readOnlyRootFilesystem: true   # 根目錄唯讀
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]        # 移除所有 Linux capabilities`}</pre>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">危險設定 ❌</p>
            <ul className="text-slate-300 space-y-1 mt-1">
              <li>• privileged: true（等同 root 主機）</li>
              <li>• runAsUser: 0（以 root 執行）</li>
              <li>• hostPID / hostNetwork: true</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">建議設定 ✅</p>
            <ul className="text-slate-300 space-y-1 mt-1">
              <li>• runAsNonRoot: true</li>
              <li>• readOnlyRootFilesystem: true</li>
              <li>• allowPrivilegeEscalation: false</li>
              <li>• capabilities drop ALL</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `Security Context 是直接寫在 Pod 或 Container spec 裡的安全設定，用來控制容器在 Linux 層面的行為。這是 Pod 安全的第一道防線。

Security Context 有兩個級別：Pod 級別的 securityContext 會影響這個 Pod 裡所有的容器；容器級別的 securityContext 只影響那個特定容器，並且可以覆蓋 Pod 級別的設定。

最重要的幾個欄位解釋：

runAsNonRoot: true。這個設定告訴 K8s，如果容器映像的啟動程序是以 root（UID 0）執行，就拒絕啟動 Pod。這是一個很重要的保護，因為如果容器被攻破，攻擊者拿到的是非 root 身份，能做的事情就受限了很多。

runAsUser: 1000。直接指定容器以哪個 UID 執行。建議和你的容器映像裡的使用者 UID 對應起來。

readOnlyRootFilesystem: true。容器的根目錄檔案系統變成唯讀，程序不能在根目錄寫東西。這個設定可以防止攻擊者在容器裡放惡意程式，也能防止程序意外修改到系統文件。如果你的應用程式需要寫暫存檔，記得另外掛載一個可寫的 emptyDir volume 到 /tmp 之類的路徑。

allowPrivilegeEscalation: false。防止容器裡的程序透過 setuid 等機制提升自己的權限。

capabilities drop ALL。Linux capabilities 是一種細粒度的 root 權限機制，全部 drop 掉是最安全的設定。如果你的程序真的需要特定 capability（比如 NET_BIND_SERVICE 讓非 root 程序可以 bind 低號 port），再明確加回來。

這些設定組合起來，就算容器內的程序被攻擊者控制，能造成的破壞也非常有限。這叫做「防禦縱深」（defense in depth）。`,
    duration: "12",
  },

  // ========== Pod Security Standards ==========
  {
    title: "Pod Security Standards",
    subtitle: "Namespace 級別的 Pod 安全政策",
    section: "Pod Security",
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            {
              name: "Privileged",
              color: "red",
              desc: "無任何限制，允許所有設定",
              use: "系統元件（如 CNI、CSI）",
            },
            {
              name: "Baseline",
              color: "yellow",
              desc: "禁止最危險的設定（privileged、hostPID、hostNetwork 等）",
              use: "一般應用程式的最低標準",
            },
            {
              name: "Restricted",
              color: "green",
              desc: "強制最嚴格的安全設定（runAsNonRoot、readOnly FS 等）",
              use: "需要高安全性的生產環境",
            },
          ].map((item) => (
            <div key={item.name} className={`bg-${item.color}-900/30 border border-${item.color}-700 p-3 rounded-lg`}>
              <div className="flex items-start justify-between">
                <p className={`text-${item.color}-400 font-bold text-lg`}>{item.name}</p>
                <p className="text-slate-400 text-xs">{item.use}</p>
              </div>
              <p className="text-slate-300 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2 text-sm">啟用方式（Namespace label）</p>
          <pre className="text-green-400 text-xs font-mono">{`kubectl label namespace production \\
  pod-security.kubernetes.io/enforce=restricted \\
  pod-security.kubernetes.io/warn=restricted`}</pre>
        </div>
      </div>
    ),
    notes: `Security Context 是寫在每個 Pod YAML 裡的，但如果你有幾十個 Namespace，幾百個 Pod，要確保每個 Pod 都有正確設定，光靠手動審查是不夠的。這時候 Pod Security Standards（PSS）就很重要了。

PSS 是 K8s 1.25 GA 的功能，取代了之前的 PodSecurityPolicy（PSP）。它讓你在 Namespace 級別設定一個安全政策，所有在這個 Namespace 建立的 Pod 都要符合這個政策，否則就會被拒絕或警告。

三個安全等級：Privileged 是最寬鬆的，幾乎沒有任何限制。這個等級主要給叢集的基礎設施元件用，比如網路插件（CNI）、儲存插件（CSI）這些需要操作底層 Linux 的系統服務。一般應用程式不應該用這個等級。Baseline 是入門安全標準，它禁止了最明顯的危險設定：privileged 容器、hostPID、hostNetwork、hostIPC 等可以逃逸到主機的設定。這個等級適合大部分的應用程式，遷移成本相對低。Restricted 是最嚴格的，它要求 runAsNonRoot、readOnlyRootFilesystem、allowPrivilegeEscalation false、capabilities drop ALL 這些都必須設定好。這個等級最安全，但應用程式可能需要修改才能符合。

啟用方式是給 Namespace 打 label。有三種 mode：enforce（不符合的 Pod 直接拒絕）、warn（允許建立但顯示警告）、audit（只記錄到 audit log，不干擾）。建議先用 warn 或 audit 模式觀察，確認現有應用程式都符合後，再切換到 enforce。`,
    duration: "13",
  },

  // ========== Network Policy ==========
  {
    title: "Network Policy",
    subtitle: "控制 Pod 之間的網路流量",
    section: "Network Policy",
    content: (
      <div className="space-y-4">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold">預設行為：所有流量都允許</p>
          <p className="text-slate-300 text-sm">K8s 預設任何 Pod 都可以和任何 Pod 通訊。Network Policy 讓你改變這個預設行為。</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2 text-sm">最佳實務：先預設拒絕所有，再白名單放行</p>
          <pre className="text-green-400 text-xs font-mono">{`# 預設拒絕 Namespace 內所有 ingress 流量
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: production
spec:
  podSelector: {}  # 空 selector = 選擇所有 Pod
  policyTypes:
  - Ingress`}</pre>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold">Ingress</p>
            <p className="text-slate-300">進入 Pod 的流量（in-bound）</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold">Egress</p>
            <p className="text-slate-300">從 Pod 出去的流量（out-bound）</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-xs">
          <p className="text-yellow-400 font-semibold">⚠️ 需要 CNI 插件支援</p>
          <p className="text-yellow-200">Calico、Cilium、Weave Net 等支援 NetworkPolicy；Flannel 預設不支援</p>
        </div>
      </div>
    ),
    notes: `Network Policy 是 K8s 裡控制 Pod 間網路流量的機制，功能類似防火牆規則，但是以 Kubernetes 原生的方式描述。

先說一個很重要的背景：K8s 的預設行為是「所有流量都允許」。任何 Pod 都可以和同叢集任何其他 Pod 通訊，不管 namespace，不管服務。這在開發環境很方便，但在生產環境這是個安全隱患。如果某個 Pod 被攻破，攻擊者可以用它來探測或攻擊叢集裡的其他所有服務。

Network Policy 讓你改變這個預設行為，實施「最小權限」的網路控制。

最常見的做法是：先建立一個「預設拒絕所有」的 NetworkPolicy，再針對每個服務的需求建立白名單。

你看到的這個 YAML 就是「預設拒絕所有 ingress」的寫法。spec.podSelector 是空的（{}），代表選擇這個 Namespace 裡所有的 Pod。policyTypes 只列了 Ingress，代表這個 Policy 只管進入的流量。rules 部分沒有任何條目，代表不允許任何 ingress 流量。

這個 Policy apply 之後，production namespace 裡所有的 Pod 都無法收到來自其他地方的連線，除非你另外建立允許特定流量的 Policy。

注意事項：Network Policy 需要 CNI（Container Network Interface）插件的支援。常見的 Calico、Cilium 都支援。如果你的叢集用 Flannel，預設是不支援 Network Policy 的，需要換 CNI 或加額外元件。`,
    duration: "10",
  },

  // ========== Network Policy Ingress/Egress 規則 ==========
  {
    title: "Network Policy 白名單規則",
    subtitle: "podSelector、namespaceSelector、ipBlock",
    section: "Network Policy",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2 text-sm">允許特定 Pod 存取（白名單）</p>
          <pre className="text-green-400 text-xs font-mono">{`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend        # 這個 Policy 保護 backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend   # 只允許 frontend Pod 存取
      namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: production
    ports:
    - protocol: TCP
      port: 8080`}</pre>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-800 p-2 rounded text-center">
            <p className="text-blue-400 font-semibold">podSelector</p>
            <p className="text-slate-400">用 Label 選擇來源 Pod</p>
          </div>
          <div className="bg-slate-800 p-2 rounded text-center">
            <p className="text-purple-400 font-semibold">namespaceSelector</p>
            <p className="text-slate-400">用 Label 選擇來源 NS</p>
          </div>
          <div className="bg-slate-800 p-2 rounded text-center">
            <p className="text-orange-400 font-semibold">ipBlock</p>
            <p className="text-slate-400">用 CIDR 指定 IP 範圍</p>
          </div>
        </div>
      </div>
    ),
    notes: `前一張投影片我們建立了「拒絕所有」的基礎，現在來看如何建立白名單，讓特定的流量通過。

這個範例的場景是：production namespace 裡有 frontend 和 backend 兩個服務，我們只想讓 frontend 可以呼叫 backend 的 8080 port，其他所有連線都拒絕。

YAML 說明：spec.podSelector.matchLabels 選擇的是「被保護的 Pod」，也就是這個 Policy 要保護誰，這裡是 app: backend 的 Pod。policyTypes: [Ingress] 表示這個 Policy 管理進入 backend Pod 的流量。ingress.from 定義允許哪些來源。這裡同時有 podSelector 和 namespaceSelector，注意它們是在同一個 list item 下（用 - 分開的是 OR，在同一個裡面是 AND）。這裡的意思是：來源 Pod 必須同時滿足有 app: frontend label AND 在 production namespace。ports 指定只允許 TCP 8080。

三種 from 選擇器：podSelector 用 Label 選擇來源 Pod；namespaceSelector 用 Label 選擇來源 Namespace，注意 Namespace 本身要有 label，可以用 kubectl label namespace xxx kubernetes.io/metadata.name=xxx 來設定（K8s 1.21 以後會自動設定這個 label）；ipBlock 用 CIDR 指定外部 IP 範圍，比如允許 LoadBalancer 的 IP，這個主要用於 Egress 規則（讓 Pod 存取外部服務）。

Egress 規則的語法類似，只是把 ingress 換成 egress，from 換成 to。建議同時建立 default-deny-egress 和對應的白名單，防止 Pod 連出去做不該做的事。`,
    duration: "10",
  },

  // ========== 休息 ==========
  {
    title: "☕ 休息時間",
    subtitle: "休息 15 分鐘",
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">
          起來動一動，喝杯水！
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block text-left">
          <p className="text-slate-400 mb-2">下半場預告</p>
          <ul className="space-y-2 text-k8s-blue">
            <li>📊 Metrics Server &amp; Prometheus</li>
            <li>📋 EFK 日誌管理</li>
            <li>🎓 CKA 認證介紹</li>
          </ul>
        </div>
      </div>
    ),
    notes: `我們上半場涵蓋了 RBAC、Pod Security 和 Network Policy，這三塊加起來就是 K8s 安全的核心。給大家 15 分鐘休息，上廁所、喝水、活動一下。下半場我們進入監控和日誌管理，這兩塊概念上比較直觀，操作性強。10:45 準時繼續！`,
    duration: "1",
  },

  // ========== Metrics Server 與 kubectl top ==========
  {
    title: "監控基礎：Metrics Server",
    subtitle: "即時資源使用量查看",
    section: "監控基礎",
    content: (
      <div className="space-y-4">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">Metrics Server 是什麼？</p>
          <p className="text-slate-300">輕量化的叢集監控元件，提供 CPU / Memory 的即時使用量，支援 kubectl top 和 HPA（Horizontal Pod Autoscaler）</p>
        </div>
        <div className="grid gap-3">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 安裝 Metrics Server</p>
            <code className="text-green-400 text-sm">kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml</code>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 查看節點資源使用</p>
            <code className="text-green-400">kubectl top nodes</code>
            <pre className="text-slate-400 text-xs mt-1">{`NAME       CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
worker-1   250m         12%    1024Mi          65%`}</pre>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1"># 查看 Pod 資源使用（排序）</p>
            <code className="text-green-400">kubectl top pods -n production --sort-by=memory</code>
          </div>
        </div>
      </div>
    ),
    notes: `休息結束，我們進入監控部分。K8s 的可觀測性（Observability）通常分三層：Metrics（指標數值）、Logs（日誌文字）、Traces（追蹤鏈路）。今天我們重點介紹前兩層。

Metrics Server 是 K8s 官方提供的輕量級監控元件，它從每個節點的 kubelet 收集 CPU 和 Memory 的即時使用量，並透過 Kubernetes Metrics API 暴露出來。它的特點是：輕量、官方支援、非持久化（只保留最近幾分鐘的數據）。

它最重要的兩個用途：第一是讓 kubectl top 指令可以用。kubectl top nodes 顯示每個節點的 CPU 和 Memory 使用率，kubectl top pods 顯示每個 Pod 的資源使用。注意 CPU 的單位是 millicores（m），250m 就是 0.25 個 CPU 核。Memory 單位是 MiB。

第二個重要用途是支援 HPA（Horizontal Pod Autoscaler）。HPA 根據 CPU 或 Memory 使用率自動調整 Pod 的副本數，它需要 Metrics Server 提供即時數據才能工作。

kubectl top pods 加上 --sort-by=memory 或 --sort-by=cpu 可以排序，快速找出資源消耗最多的 Pod，這在排查效能問題時非常有用。

注意：Metrics Server 只提供即時數據，不存歷史。如果你想看昨天某個時間點的 CPU 使用率，Metrics Server 做不到，你需要 Prometheus 這樣的時間序列資料庫。`,
    duration: "10",
  },

  // ========== Prometheus ==========
  {
    title: "Prometheus 介紹",
    subtitle: "業界標準的時間序列監控系統",
    section: "監控基礎",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-orange-400 font-semibold">Prometheus 架構</p>
              <ul className="text-slate-300 space-y-1 mt-1">
                <li>• Pull-based（主動抓取 /metrics）</li>
                <li>• 時間序列資料庫（TSDB）</li>
                <li>• PromQL 查詢語言</li>
                <li>• AlertManager 告警</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-k8s-blue font-semibold">常用 PromQL 範例</p>
              <pre className="text-green-400 text-xs mt-1 font-mono">{`# CPU 使用率（%）
100 - (avg by (instance)
  (rate(node_cpu_seconds_total
  {mode="idle"}[5m])) * 100)

# Pod 記憶體使用（MB）
container_memory_usage_bytes
  / 1024 / 1024`}</pre>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-purple-400 font-semibold">K8s 整合方式</p>
              <ul className="text-slate-300 space-y-1 mt-1">
                <li>• kube-prometheus-stack（Helm chart）</li>
                <li>• ServiceMonitor CRD（自動發現）</li>
                <li>• Node Exporter（節點指標）</li>
                <li>• kube-state-metrics（K8s 物件狀態）</li>
              </ul>
            </div>
            <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg">
              <p className="text-k8s-blue font-semibold text-xs">📌 資料保存</p>
              <p className="text-slate-300 text-xs">Metrics Server 只保留幾分鐘，Prometheus 可保存數週的歷史數據，支援趨勢分析和告警</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-400 text-sm">Prometheus 資料流</p>
          <div className="flex items-center gap-2 mt-2 text-sm flex-wrap">
            {["應用程式 /metrics", "→", "Prometheus Scrape", "→", "TSDB 儲存", "→", "PromQL 查詢", "→", "Grafana 顯示"].map((step, i) => (
              <span key={i} className={step === "→" ? "text-slate-500" : "bg-slate-700 px-2 py-1 rounded text-slate-200"}>{step}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `Prometheus 是雲原生監控的業界標準，CNCF 畢業項目，幾乎所有的 Kubernetes 生產環境都在用它。

Prometheus 的工作方式是 Pull-based：它定期去抓取（scrape）應用程式暴露的 /metrics 端點，而不是等應用程式主動推送數據。這個設計讓 Prometheus 可以更容易地控制收集頻率，也更容易發現哪些服務掛掉了（因為 scrape 會失敗）。

應用程式的 /metrics 是一個 HTTP endpoint，輸出的是純文字格式的指標，叫做 Exposition format。每行是一個時間序列，包含 metric 名稱、labels（標籤）和值。

Prometheus 把收集到的數據存在自己的時間序列資料庫（TSDB）裡，可以保存數天到數週的歷史數據。

查詢數據用 PromQL，這是 Prometheus 自己的查詢語言。它的語法看起來有點像 SQL，但針對時間序列做了很多特別的函數，比如 rate() 計算每秒增加率、avg_over_time() 計算一段時間的平均值。PromQL 是 CKA 和 CKS 考試的重點，也是日常排查問題的核心工具。

在 K8s 裡，最方便的安裝方式是用 kube-prometheus-stack Helm chart，它會一次安裝 Prometheus、Grafana、AlertManager、Node Exporter 和 kube-state-metrics。ServiceMonitor 是一個 CRD，讓你可以用 Kubernetes 原生的方式定義 Prometheus 要去哪些 Pod 抓取 metrics，非常優雅。

Node Exporter 以 DaemonSet 形式部署在每個節點，收集節點層面的指標（CPU、記憶體、磁碟、網路）。kube-state-metrics 負責把 K8s API 裡的狀態轉成 Prometheus 指標，比如 Deployment 的副本數、Pod 的狀態、PVC 的容量等。`,
    duration: "10",
  },

  // ========== Grafana 儀表板 ==========
  {
    title: "Grafana 儀表板",
    subtitle: "把 Metrics 變成視覺化圖表",
    section: "監控基礎",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
            <p className="text-orange-400 font-semibold">Grafana 核心功能</p>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>📊 支援多種資料來源（Prometheus、InfluxDB、Loki…）</li>
              <li>🎨 豐富的圖表類型（折線圖、熱力圖、儀表板…）</li>
              <li>🔔 整合告警通知（Slack、PagerDuty…）</li>
              <li>🌐 社群儀表板市集（grafana.com/dashboards）</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
            <p className="text-k8s-blue font-semibold">常用 Dashboard ID</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { id: "315", name: "K8s Cluster" },
                { id: "6417", name: "K8s Pods" },
                { id: "1860", name: "Node Exporter" },
                { id: "13332", name: "kube-state" },
              ].map((d) => (
                <div key={d.id} className="bg-slate-700 p-2 rounded text-center">
                  <p className="text-orange-400 font-mono font-bold">{d.id}</p>
                  <p className="text-slate-400 text-xs">{d.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg text-sm">
          <p className="text-green-400 font-semibold">✅ 快速上手流程</p>
          <p className="text-slate-300">1. Grafana → Dashboards → Import → 填入 ID → Load → 選 Prometheus 資料來源 → Import</p>
        </div>
      </div>
    ),
    notes: `有了 Prometheus 的數據，接下來要把它視覺化。Grafana 是最常見的搭配，它就像 Prometheus 的「顯示器」，把原始的數字變成漂亮的圖表。

Grafana 最大的優點之一是可以匯入社群貢獻的儀表板（Dashboard）。在 grafana.com/dashboards 上有數千個現成的儀表板，涵蓋各種技術棧。K8s 相關的儀表板 ID 我列了幾個最常用的：315 是 K8s 叢集概覽，可以看所有節點的 CPU 和 Memory；6417 是 Pod 監控，可以看每個 Pod 的資源使用；1860 是 Node Exporter Full，超詳細的節點指標；13332 是 kube-state-metrics，顯示 K8s 物件狀態。

匯入流程非常簡單：打開 Grafana，點 Dashboards → Import，在 Import via grafana.com 欄位填入 Dashboard ID，點 Load，選擇你的 Prometheus 資料來源，點 Import 就好了。幾秒鐘你就有一個專業的監控儀表板。

除了用現成的，你也可以自己建立 Dashboard。在 Grafana 裡新增一個 Panel，用 PromQL 寫查詢，選擇圖表類型，設定告警閾值。這個技能在工作上很實用，但需要一些練習。

告警功能也很重要：你可以在 Grafana 或 AlertManager 設定告警規則，當 CPU 使用率超過 80% 或 Pod 掛掉時，自動發 Slack 通知或打電話（PagerDuty）。這讓你在出問題之前就能收到預警，而不是用戶投訴了才發現。`,
    duration: "5",
  },

  // ========== EFK Stack ==========
  {
    title: "日誌管理：EFK Stack",
    subtitle: "Elasticsearch + Fluentd + Kibana",
    section: "日誌管理",
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 text-center">
          {[
            { icon: "📋", name: "Fluentd", desc: "收集 & 轉發", color: "blue" },
            { icon: "→", name: "", desc: "", color: "slate" },
            { icon: "🔍", name: "Elasticsearch", desc: "儲存 & 搜尋", color: "yellow" },
            { icon: "→", name: "", desc: "", color: "slate" },
            { icon: "📊", name: "Kibana", desc: "視覺化查詢", color: "orange" },
          ].map((item, i) =>
            item.name ? (
              <div key={i} className={`bg-${item.color}-900/30 border border-${item.color}-700 p-3 rounded-lg`}>
                <p className="text-3xl">{item.icon}</p>
                <p className={`text-${item.color}-400 font-bold text-sm`}>{item.name}</p>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </div>
            ) : (
              <span key={i} className="text-slate-500 text-2xl">{item.icon}</span>
            )
          )}
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2 text-sm">為什麼需要集中化日誌？</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1 text-slate-300">
              <p>❌ kubectl logs 的問題：</p>
              <ul className="text-slate-400 text-xs space-y-1">
                <li>• Pod 重啟後日誌消失</li>
                <li>• 無法跨 Pod 搜尋</li>
                <li>• 無法長期保存</li>
              </ul>
            </div>
            <div className="space-y-1 text-slate-300">
              <p>✅ EFK 的優勢：</p>
              <ul className="text-slate-400 text-xs space-y-1">
                <li>• 日誌持久化儲存</li>
                <li>• 全文搜尋</li>
                <li>• 集中查看所有服務</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
          <p className="text-slate-400 mb-1">現代替代方案</p>
          <div className="flex gap-2 flex-wrap">
            {["Fluent Bit（更輕量）", "Loki + Grafana（省資源）", "OpenSearch（開源 ES）"].map(alt => (
              <span key={alt} className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs">{alt}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `監控（Metrics）告訴你「發生了什麼數字上的變化」，日誌（Logs）告訴你「為什麼發生了這個變化的詳細過程」。兩者缺一不可。

在 K8s 裡，kubectl logs 是查看 Pod 日誌最直接的方式，但它有幾個明顯的限制：Pod 一旦重啟，之前的日誌就消失了；如果你有幾十個 Pod，要查一個請求到底經過哪些服務，需要一個個去查，非常麻煩；日誌無法長期保存，沒辦法做事後分析。

這就是為什麼生產環境需要集中化日誌系統。EFK 是最傳統也最成熟的方案：Fluentd 是日誌收集器，以 DaemonSet 形式部署在每個節點，負責收集節點上所有 Pod 的日誌，做格式轉換和過濾，然後轉發到 Elasticsearch。Elasticsearch 是分散式搜尋引擎，負責儲存大量日誌並提供全文搜尋能力。Kibana 是 Elasticsearch 的視覺化介面，讓你可以用關鍵字搜尋日誌、建立圖表和儀表板。

EFK 的主要缺點是資源消耗高，Elasticsearch 吃記憶體很厲害，在小叢集上要注意。

現代的替代方案：Fluent Bit 是 Fluentd 的精簡版，資源消耗更低，在 K8s 裡越來越常用來取代 Fluentd。Loki 是 Grafana Labs 開發的輕量日誌系統，和 Grafana 整合很好，不像 Elasticsearch 需要索引所有字段，更省資源。如果你已經在用 Prometheus + Grafana，再加 Loki 就有了完整的 Metrics + Logs 解決方案，而且都在同一個 Grafana 界面裡查看，非常方便。`,
    duration: "10",
  },

  // ========== DaemonSet 收集 ==========
  {
    title: "DaemonSet 收集日誌",
    subtitle: "每個節點自動部署收集 Agent",
    section: "日誌管理",
    content: (
      <div className="space-y-4">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">DaemonSet 的特性</p>
          <p className="text-slate-300">確保每個（或部分）節點上都跑一個 Pod 的副本，節點加入叢集時自動部署，節點移除時自動清除</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2 text-sm">Fluent Bit DaemonSet 示意</p>
          <pre className="text-green-400 text-xs font-mono">{`apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    spec:
      containers:
      - name: fluent-bit
        image: fluent/fluent-bit:latest
        volumeMounts:
        - name: varlog
          mountPath: /var/log    # 掛載節點日誌目錄
      volumes:
      - name: varlog
        hostPath:
          path: /var/log         # 節點的日誌路徑`}</pre>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
          <p className="text-slate-400 mb-1">日誌流向</p>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {["Pod stdout/stderr", "→", "節點 /var/log/containers/", "→", "Fluent Bit DaemonSet", "→", "Elasticsearch"].map((s, i) => (
              <span key={i} className={s === "→" ? "text-slate-500" : "bg-slate-700 px-2 py-1 rounded text-slate-200"}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `為什麼 Fluentd 或 Fluent Bit 要用 DaemonSet 部署呢？這和 Kubernetes 的日誌機制有關。

在 K8s 裡，容器的 stdout 和 stderr 會被 kubelet 自動寫到節點的 /var/log/containers/ 目錄下，每個容器一個 log 文件。因為日誌是儲存在節點上，收集日誌的 agent 就必須在每個節點上都跑一個，才能收集到所有節點的日誌。DaemonSet 就是為這個場景設計的。

DaemonSet 的重要特性：當有新節點加入叢集，K8s 會自動在新節點上建立 DaemonSet 的 Pod，不需要手動操作。當節點被移除，該節點上的 DaemonSet Pod 也自動清除。你也可以用 nodeSelector 或 tolerations 讓 DaemonSet 只在特定節點上跑，比如只在 worker 節點跑，不在 master 節點跑。

YAML 說明：Fluent Bit 的 DaemonSet 需要把節點的 /var/log 目錄掛載進去，用的是 hostPath volume，這讓容器可以直接讀取節點上的檔案系統。這也是為什麼日誌收集 DaemonSet 通常需要一些 RBAC 權限和 Security Context 的特別設定——它需要讀取其他 Pod 的日誌文件。

完整的日誌流：Pod 寫 stdout → kubelet 存到 /var/log/containers/ → Fluent Bit DaemonSet 讀取並解析 → 添加 K8s metadata（Pod 名稱、Namespace、Label 等）→ 轉發到 Elasticsearch → Kibana 查詢和視覺化。這個流程完全自動，應用程式只需要把日誌寫到 stdout，不需要知道背後的收集機制。`,
    duration: "10",
  },

  // ========== 課程總結與 CKA ==========
  {
    title: "課程總結與 CKA 認證介紹",
    subtitle: "你已經準備好面對真實的 K8s 世界了",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">整個課程學習路徑回顧</p>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {["Linux 基礎", "Docker 容器", "K8s 核心", "安全監控"].map((s, i) => (
              <div key={i} className="bg-slate-700 p-2 rounded">
                <p className="text-2xl mb-1">{["🐧","🐳","☸️","🔐"][i]}</p>
                <p className="text-slate-300">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">🎓 CKA 考試資訊</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "考試形式", value: "線上、真實叢集、動手操作" },
              { label: "時間", value: "2 小時，17 題左右" },
              { label: "及格分", value: "66 分（滿分 100）" },
              { label: "費用", value: "USD $395（含一次補考）" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-700/50 p-2 rounded">
                <p className="text-slate-400 text-xs">{item.label}</p>
                <p className="text-slate-200 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg text-sm">
          <p className="text-green-400 font-semibold">📚 高頻考點</p>
          <p className="text-slate-300">RBAC・Deployment 升降版・Pod 排程（Taint/Toleration/Affinity）・PV/PVC・NetworkPolicy・故障排查・etcd 備份還原</p>
        </div>
      </div>
    ),
    notes: `我們來做個課程總結，回顧一下這七堂課走過的路。

從第一堂的 Linux 基礎，建立命令列操作能力；第二堂 Docker，理解容器化思維；第三堂開始進入 Kubernetes，部署 Pod、Deployment、Service；第四堂深入 K8s 進階功能，ConfigMap、Secret、資源管理；第五堂 StatefulSet、DaemonSet、PV/PVC；第六堂 Helm、CI/CD；今天第七堂安全與監控。這是一個完整的從 Linux 基礎到 K8s 生產環境的學習路徑。

接下來說 CKA 認證。CKA 是 CNCF（Cloud Native Computing Foundation）認證的 Kubernetes 管理員資格考試，是目前業界最認可的 K8s 認證之一。

考試特點：它是真實叢集的動手操作考試，不是選擇題。你會有 6 個真實的 K8s 叢集，2 個小時完成大約 17 道操作題。可以開一個官方文件瀏覽器（kubernetes.io/docs），所以不需要背所有指令，但要熟悉文件結構，才能快速找到需要的資訊。

高頻考點：根據 CNCF 的官方課綱，重點是：叢集架構與安裝（25%）、工作負載與排程（15%）、服務與網路（20%）、儲存（10%）、故障排查（30%）。故障排查比例最高，反映了工作中最常做的事。

我在投影片上列了幾個高頻考點：RBAC（今天學的）、Deployment 升降版（第三四堂）、Pod 排程相關（Taint/Toleration）、PV/PVC（第五堂）、NetworkPolicy（今天）、故障排查、etcd 備份。這些都是必考的。`,
    duration: "10",
  },

  // ========== 備考建議 ==========
  {
    title: "CKA 備考建議與學習資源",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
            <p className="text-k8s-blue font-semibold">📝 備考策略</p>
            <ol className="text-slate-300 space-y-2 list-decimal list-inside">
              <li>每天練習 kubectl，建立肌肉記憶</li>
              <li>用 killer.sh 模擬考試環境</li>
              <li>熟悉 kubernetes.io/docs 文件結構</li>
              <li>練習速記常用 YAML 結構</li>
              <li>設好 alias（<code className="bg-slate-700 px-1 rounded">alias k=kubectl</code>）</li>
            </ol>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
            <p className="text-green-400 font-semibold">🔗 學習資源</p>
            <ul className="text-slate-300 space-y-2">
              <li>• <span className="text-blue-400">Killer.sh</span> — 官方配套模擬題庫</li>
              <li>• <span className="text-blue-400">KodeKloud</span> — 互動式 K8s 課程</li>
              <li>• <span className="text-blue-400">Play with Kubernetes</span> — 免費練習環境</li>
              <li>• <span className="text-blue-400">kubernetes.io/docs</span> — 官方文件</li>
              <li>• <span className="text-blue-400">GitHub: chadmcrowell/CKA-Exercises</span></li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold">💡 考試技巧</p>
          <p className="text-yellow-200 text-sm">考試時優先做有把握的題目，不確定的先標記跳過；使用 <code className="bg-slate-800 px-1 rounded">--dry-run=client -o yaml</code> 快速生成 YAML 模板；善用 kubectl explain</p>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg text-center">
          <p className="text-green-400 text-xl font-bold">🎉 感謝大家七堂課的陪伴！</p>
          <p className="text-slate-300 text-sm mt-1">持續練習，期待在 CKA 成功榜上看到你的名字！</p>
        </div>
      </div>
    ),
    notes: `最後分享一些備考建議，這是我看過很多學員考 CKA 後整理出來的實戰心得。

第一，每天練習 kubectl。熟練度非常重要，因為考試時間緊，每道題只有幾分鐘，如果每個指令都要查，時間根本不夠。建議在家每天都打幾個 kubectl 指令，建立肌肉記憶。

第二，用 alias 加速。考試開始第一件事就是設 alias k=kubectl，這樣打 k get pods 比打 kubectl get pods 節省了 5 個字元，累積下來節省很多時間。還可以設 export do="--dry-run=client -o yaml" 讓生成 YAML 更快。

第三，--dry-run=client -o yaml 是神技。比如 kubectl create deployment nginx --image=nginx $do > deploy.yaml，一行指令就生成 Deployment YAML，比手打快太多了。kubectl run、kubectl create 大部分指令都支援這個旗標。

第四，killer.sh 是購買 CKA 考試後附贈的，提供兩次模擬考試機會，題目難度比真實考試稍難，是最接近真實環境的練習平台。一定要做。

第五，文件瀏覽器。考試中可以開一個瀏覽器分頁，只能看 kubernetes.io/docs 和 kubernetes.io/blog。考試前要熟悉文件的結構，知道 RBAC、NetworkPolicy、PV 等的文件在哪裡，才能快速找到。不是要你背，是要你知道在哪裡查。

給大家的最後一句話：這七堂課打下的基礎已經足夠應對 CKA 考試，剩下的就是練習量。持續動手操作，不要只看不做。期待在 CKA 社群的成功榜上看到大家的名字！`,
    duration: "5",
  },

  // ========== Q&A ==========
  {
    title: "Q&A",
    subtitle: "有什麼問題，現在就問！",
    section: "Q&A",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-8xl">💬</p>
        <p className="text-2xl text-slate-300">任何問題都歡迎！</p>
        <div className="grid grid-cols-2 gap-4 text-left text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">今天可能的問題方向</p>
            <ul className="text-slate-300 space-y-1">
              <li>🔑 RBAC 設定沒有生效？</li>
              <li>🌐 Network Policy 流量沒有被擋？</li>
              <li>📊 Prometheus 抓不到 metrics？</li>
              <li>📋 EFK 日誌沒有出現？</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">課後聯絡方式</p>
            <ul className="text-slate-300 space-y-1">
              <li>💬 課程 Line 群組</li>
              <li>📧 助教 Email</li>
              <li>📝 課後作業批改</li>
              <li>🎓 CKA 考後心得分享</li>
            </ul>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-xl">感謝大家！繼續加油 ☸️</p>
        </div>
      </div>
    ),
    notes: `好，現在進入最後的 Q&A 環節，有 15 分鐘，任何問題都可以問。

今天的內容量很大，從 RBAC 到 Pod Security、Network Policy、Prometheus、EFK，每一塊都可以單獨深入學習。如果對某個部分有疑問，現在是最好的時機。

我特別列了幾個今天課程中常見的問題方向：RBAC 設定了但還是出現 Forbidden，通常是 RoleBinding 的 namespace 不對或 serviceAccountName 沒有指定；Network Policy 設定了但流量還是沒有被擋，通常是 CNI 不支援或 podSelector 的 label 寫錯；Prometheus 抓不到 metrics，通常是 ServiceMonitor 設定不正確或 Pod 沒有暴露 /metrics endpoint；EFK 日誌沒有出現，通常是 Fluent Bit 的 volume mount 路徑不對或 Elasticsearch 掛掉了。

下課之後也可以在 Line 群組繼續問問題，助教會盡快回覆。課後作業如果有問題，也歡迎在群組討論。

最後再次感謝大家七堂課以來的參與和學習熱情。Kubernetes 的世界非常廣闊，今天我們學的這些只是入門，後面還有很多值得探索的領域：Istio 服務網格、Argo Workflow、多叢集管理等等。希望大家帶著今天學到的知識，繼續在 K8s 的路上走下去。加油！`,
    duration: "7",
  },
]
