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

// ============================================================
// 第七堂下午 v4 — Loop 3：從零建完整系統（任務排程系統）
// 影片：7-8（系統設計）、7-9（邊建邊解釋）、7-10（QA + Helm + 學員題目）
// 架構：Frontend → Backend API → Redis Queue → Task Runner → PostgreSQL
// ============================================================

export const slides: Slide[] = [
  // ============================================================
  // 7-8：我們要建什麼？（~8min）
  // ============================================================

  // ── 7-8 封面 ──
  {
    title: '[1/45] Loop 3：從零建完整系統',
    subtitle: '任務排程系統 — 把四堂課所有組件串起來',
    section: '7-8 為什麼做這個 Demo',
    duration: '1',
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-cyan-900/40 to-purple-900/40 border border-cyan-500/50 p-6 rounded-lg text-center">
          <p className="text-cyan-300 text-lg font-semibold mb-3">下午的總複習</p>
          <p className="text-slate-300 text-sm">學了這麼多組件，從來沒有全部串在一起過</p>
          <p className="text-slate-300 text-sm mt-1">今天，一套真實系統 → 12 個 K8s 組件 → 從零開始</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-semibold text-sm">7-8</p>
            <p className="text-slate-300 text-xs mt-1">為什麼選這個 Demo</p>
            <p className="text-slate-500 text-xs mt-1">8 分鐘</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-semibold text-sm">7-9</p>
            <p className="text-slate-300 text-xs mt-1">邊建邊解釋</p>
            <p className="text-slate-500 text-xs mt-1">40 分鐘</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-semibold text-sm">7-10</p>
            <p className="text-slate-300 text-xs mt-1">QA + Helm + 題目</p>
            <p className="text-slate-500 text-xs mt-1">15 分鐘</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-lg text-sm text-amber-300 text-center">
          不是在背指令，是在練習做選擇
        </div>
      </div>
    ),
    notes: `好，上午解決了 HPA 和 RBAC。現在進入今天最後一個部分，也是整個課程最重要的環節。

我想先問大家一個問題。到目前為止你學了 Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、HPA、RBAC、Job、CronJob。每個組件你應該都知道它是什麼。

但如果我現在叫你從零建一套完整的系統，你知道要從哪裡開始嗎？第一步做什麼、第二步做什麼、這裡用哪個組件、那裡為什麼不用另一個？

這就是今天下午要做的事。我親自示範一套完整系統從零建起來，你跟著看，看每一個選擇的背後是什麼原因。

這個 Loop 分三段。7-8 先講為什麼選這個系統、架構長什麼樣、組件怎麼分配，大約 8 分鐘。7-9 我打開 terminal 一步一步建，每建一個組件就解釋為什麼用它，大約 40 分鐘。7-10 是 QA、Helm 示範、還有學員題目，大約 15 分鐘。

[▶ 下一頁]`,
  },

  // ── 7-8 系統功能 + 架構圖 ──
  {
    title: '[2/45] 系統功能 — 任務排程系統',
    subtitle: '業界標準非同步任務架構',
    section: '7-8 為什麼做這個 Demo',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">使用者情境</p>
          <p className="text-slate-300 text-sm">建立一個任務：「每天早上九點寄出報表 Email」→ 點送出 → 馬上得到「任務已建立」的回應</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-sm text-center">資料流</p>
          <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
            <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-300">Frontend (React)</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-300">Backend API</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-300">Redis Queue</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded text-purple-300">Task Runner</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-300">PostgreSQL</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-xs mt-3 pt-3 border-t border-slate-700">
            <span className="text-slate-500">定時觸發：</span>
            <span className="bg-orange-900/40 border border-orange-500/50 px-2 py-1 rounded text-orange-300">CronJob</span>
            <span className="text-cyan-400">→</span>
            <span className="text-slate-400">掃到期任務丟進 Queue</span>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded-lg text-sm">
          <p className="text-green-300 font-semibold mb-1">為什麼這個架構</p>
          <p className="text-slate-300 text-xs">這是非同步任務系統的標準架構。業界的 Celery、Bull、Sidekiq，都是這個模式。</p>
        </div>
      </div>
    ),
    notes: `先說明系統的功能。

使用者打開瀏覽器，建立一個任務：每天早上九點寄出報表 Email。點送出，請求打到 Backend API，API 把任務丟進 Redis Queue，馬上回應使用者任務已建立。

有一個 Task Runner 一直在跑，不斷從 Queue 拿任務出來執行，執行完把結果存進 PostgreSQL。另外有一個 CronJob 定時觸發，把到期的排程任務撈出來丟進 Queue，Task Runner 去執行。

這是非同步任務系統的標準架構。業界的 Celery、Bull、Sidekiq，都是這個模式。你以後在公司看到的任務系統，大概都長這樣。

為什麼選這個系統？因為它能覆蓋最多的 K8s 組件。等一下會逐一說明每個組件怎麼對應到這個系統。

[▶ 下一頁]`,
  },

  // ── 7-8 12 組件對照表 ──
  {
    title: '[3/45] 12 個 K8s 組件 — 每個用在哪裡、為什麼',
    subtitle: '一套系統，覆蓋你學過的所有組件',
    section: '7-8 為什麼做這個 Demo',
    duration: '3',
    content: (
      <div className="space-y-2">
        <div className="bg-slate-800/50 p-2 rounded-lg">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-cyan-400 border-b border-slate-600">
                <th className="text-left py-1 pr-2 w-24">組件</th>
                <th className="text-left py-1 pr-2 w-40">用在哪裡</th>
                <th className="text-left py-1">為什麼</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">Deployment</td><td className="py-1">Frontend / Backend / Task Runner</td><td className="py-1 text-slate-400">無狀態，Pod 隨時可重建</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">StatefulSet</td><td className="py-1">PostgreSQL</td><td className="py-1 text-slate-400">需要穩定 Pod 名稱和固定儲存</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">PVC</td><td className="py-1">PostgreSQL 儲存</td><td className="py-1 text-slate-400">持久化資料</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">ConfigMap</td><td className="py-1">DB 主機名 / Port / DB 名稱</td><td className="py-1 text-slate-400">非機密設定</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">Secret</td><td className="py-1">DB 密碼 / Redis 密碼 / JWT</td><td className="py-1 text-slate-400">機密資料</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">Service</td><td className="py-1">所有服務</td><td className="py-1 text-slate-400">叢集內部互連</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">Ingress</td><td className="py-1">Frontend / Backend 對外</td><td className="py-1 text-slate-400">域名路由</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">HPA</td><td className="py-1">Backend API</td><td className="py-1 text-slate-400">流量高自動擴 Pod</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">RBAC</td><td className="py-1">Backend SA</td><td className="py-1 text-slate-400">最小權限讀 ConfigMap</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">Job</td><td className="py-1">DB schema migration</td><td className="py-1 text-slate-400">一次性任務</td></tr>
              <tr className="border-b border-slate-700/50"><td className="py-1 font-mono text-green-400">CronJob</td><td className="py-1">排程觸發器</td><td className="py-1 text-slate-400">定時掃描到期任務</td></tr>
              <tr><td className="py-1 font-mono text-slate-500">DaemonSet</td><td className="py-1 text-slate-500">對比說明</td><td className="py-1 text-slate-500">Task Runner 為什麼不用它</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center">
          12 個組件，一套系統。每個選擇背後都有原因。
        </div>
      </div>
    ),
    notes: `來數一下這套系統用了哪些組件，同時說明每個組件用在哪裡、為什麼用它。

Deployment 用在 Frontend、Backend API、Task Runner。這三個服務都是無狀態的，Pod 隨時可以砍掉重建，不怕資料丟。

StatefulSet 用在 PostgreSQL，不是 Deployment。因為資料庫需要穩定的 Pod 名稱和固定的儲存，Pod 重啟之後還是要接回同一個磁碟。Deployment 做不到這件事。

PVC 給 PostgreSQL 持久化儲存。

ConfigMap 存 DB 主機名、Redis 位址、Port 號這些設定值。

Secret 存 DB 密碼、Redis 密碼、JWT secret 這些機密資料。

Service，每個服務都要有，讓叢集內部的服務可以互相連。

Ingress 對外暴露 Frontend 和 Backend API，走域名路由。

HPA 給 Backend API，流量高的時候自動擴 Pod。

RBAC 給 Backend，讓它有讀取 ConfigMap 的最小權限。這等一下會詳細示範。

Job 跑一次性的資料庫 schema migration。

CronJob 定時觸發排程任務。

DaemonSet 我不會真的用，但會在過程中解釋 Task Runner 為什麼不用 DaemonSet，DaemonSet 真正適合的場景是什麼。

十二個組件，一套系統。我們開始。

[▶ 下一頁]`,
  },

  // ── 7-8 判斷心法總覽 ──
  {
    title: '[4/45] 五個判斷心法 — 接下來反覆用到',
    subtitle: '先記住，等一下每一個都會示範',
    section: '7-8 為什麼做這個 Demo',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-blue-300 font-semibold text-sm">① Deployment vs StatefulSet</p>
          <p className="text-slate-300 text-xs mt-1">需要穩定身份（固定名稱+固定儲存）→ <span className="text-green-400">StatefulSet</span>；不需要 → <span className="text-green-400">Deployment</span></p>
        </div>

        <div className="bg-slate-800/50 border-l-4 border-purple-500 p-3 rounded">
          <p className="text-purple-300 font-semibold text-sm">② Secret vs ConfigMap</p>
          <p className="text-slate-300 text-xs mt-1">洩漏出去會有問題 → <span className="text-green-400">Secret</span>；不會 → <span className="text-green-400">ConfigMap</span></p>
        </div>

        <div className="bg-slate-800/50 border-l-4 border-orange-500 p-3 rounded">
          <p className="text-orange-300 font-semibold text-sm">③ Job vs Deployment</p>
          <p className="text-slate-300 text-xs mt-1">跑完就結束 → <span className="text-green-400">Job</span>；需要一直跑 → <span className="text-green-400">Deployment</span></p>
        </div>

        <div className="bg-slate-800/50 border-l-4 border-pink-500 p-3 rounded">
          <p className="text-pink-300 font-semibold text-sm">④ DaemonSet vs Deployment</p>
          <p className="text-slate-300 text-xs mt-1">跟 Node 數量綁定 → <span className="text-green-400">DaemonSet</span>；不綁定 → <span className="text-green-400">Deployment</span></p>
        </div>

        <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold text-sm">⑤ Service 類型</p>
          <p className="text-slate-300 text-xs mt-1">叢集內部用 → <span className="text-green-400">ClusterIP</span>；對外用 <span className="text-green-400">Ingress</span>（不是 NodePort）</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center mt-2">
          接下來每一個組件上場，都會回來印證這些判斷心法
        </div>
      </div>
    ),
    notes: `在動手之前，先把五個判斷心法寫在黑板上。接下來 40 分鐘，我會反覆用到這五個心法，每個組件上場就印證一次。

第一個：Deployment 還是 StatefulSet？判斷原則是這個服務需不需要穩定的身份，也就是固定的名稱加固定的儲存。需要就 StatefulSet，不需要就 Deployment。PostgreSQL 需要，所以用 StatefulSet。Redis 不需要（任務重啟可以重算），所以用 Deployment。

第二個：Secret 還是 ConfigMap？洩漏出去會有問題的放 Secret，不會有問題的放 ConfigMap。就一條分界線。密碼、Token、JWT Secret 是 Secret。主機名、Port、DB 名稱是 ConfigMap。

第三個：Job 還是 Deployment？跑完就結束的用 Job，要一直跑的用 Deployment。Migration 跑完就退出，用 Job。Backend 要一直跑，用 Deployment。

第四個：DaemonSet 還是 Deployment？跟 Node 數量綁定的用 DaemonSet，不綁定的用 Deployment。Task Runner 的數量看任務量決定，跟 Node 數量沒關係，所以是 Deployment 不是 DaemonSet。

第五個：Service 類型。叢集內部的服務之間用 ClusterIP，對外暴露一律用 Ingress，不要用 NodePort。NodePort 的 Port 醜、沒有域名、管理麻煩，Ingress 統一入口比較好。

記住這五條，接下來就不會迷路。

[▶ 下一頁]`,
  },

  // ============================================================
  // 7-9：邊建邊解釋（~40min）
  // ============================================================

  // ── Namespace ──
  {
    title: '[5/45] Step 1：Namespace — 隔離這套系統',
    subtitle: '第一步永遠是建 Namespace',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-1">為什麼要 Namespace</p>
          <p className="text-slate-300 text-xs">叢集可能同時跑多套系統。全放 default 會混在一起，kubectl get 的時候分不清楚。Namespace 是邏輯隔離牆，RBAC 也能按 Namespace 管控。</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-slate-500"># 建立 Namespace</p>
          <p className="text-green-400">kubectl create namespace tasks</p>
          <p className="text-slate-500 mt-2"># 之後所有指令都要加 -n tasks</p>
          <p className="text-green-400">kubectl get pods -n tasks</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300">
          口訣：先 Namespace，再所有東西
        </div>
      </div>
    ),
    notes: `第一步，建一個 Namespace 把這套系統隔開。

指令：kubectl create namespace tasks

為什麼要建 Namespace？你的叢集上可能同時跑著這套系統、一個電商後台、一個內部監控工具。如果全部放在 default namespace，所有 Pod、Service、ConfigMap 混在一起，kubectl get pods 看到幾十個不知道哪個是哪個。Namespace 是邏輯上的隔離牆，每個系統有自己的空間，資源不互相干擾，RBAC 的權限也可以按 Namespace 分開控管。

之後所有指令都加 -n tasks。

[▶ 下一頁]`,
  },

  // ── Secret 複習卡 ──
  {
    title: '[6/45] 複習：Secret vs ConfigMap — 分界線只有一條',
    subtitle: 'Day 6 Loop 2 學過 · 現在用在真實系統',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold text-sm">分界線</p>
          <p className="text-slate-300 text-xs mt-1">洩漏出去<span className="text-red-400 font-bold">會有問題</span> → Secret</p>
          <p className="text-slate-300 text-xs">洩漏出去<span className="text-green-400 font-bold">沒關係</span> → ConfigMap</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
            <p className="text-red-400 font-semibold text-sm mb-1">Secret（機密）</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• DB 密碼</li>
              <li>• Redis 密碼</li>
              <li>• JWT Secret</li>
              <li>• API Token</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
            <p className="text-green-400 font-semibold text-sm mb-1">ConfigMap（設定）</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• DB 主機名</li>
              <li>• Port 號</li>
              <li>• DB 名稱</li>
              <li>• 環境變數</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/40 p-2 rounded text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">小提醒：</span>Secret 只是 base64 編碼，不是加密。還是要小心 RBAC 權限誰能讀。
        </div>
      </div>
    ),
    notes: `先複習一下 Day 6 Loop 2 學過的 Secret 和 ConfigMap。

很多同學學完還是分不清楚，我教你一個秒懂的方法。只問一個問題：這個值洩漏出去會有問題嗎？會，放 Secret。不會，放 ConfigMap。就這麼簡單。

DB 密碼、Redis 密碼、JWT secret、API token，這些洩漏出去會出大事，放 Secret。DB 主機名、Port 號、DB 名稱，這些就算放 GitHub 上也沒什麼，放 ConfigMap。

有一件事要特別提醒。Secret 不是加密，只是 base64 編碼。你 kubectl get secret -o yaml 看到一串亂碼，那不是加密，是 base64。任何人都能解回明文。所以 Secret 的保護是靠 RBAC 控制誰能讀，不是靠那個編碼。

[▶ 下一頁]`,
  },

  // ── Secret 實作卡 ──
  {
    title: '[7/45] Step 2：Secret — 機密資料',
    subtitle: 'stringData 填明文，K8s 幫你 encode',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: tasks
type: Opaque
stringData:            # ← 填明文，K8s 自動 base64 encode
  postgres-password: "MyPostgresP@ssw0rd"
  redis-password: "MyRedisP@ssw0rd"
  jwt-secret: "MyJwtSuperSecret"`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">stringData vs data</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p><span className="text-green-400 font-mono">stringData</span> → 填明文，K8s 幫你 base64 encode</p>
            <p><span className="text-yellow-400 font-mono">data</span> → 你要自己先 base64 encode</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 01-secret.yaml</p>
          <p className="text-green-400 mt-1">kubectl get secret app-secrets -n tasks</p>
          <p className="text-slate-500 mt-1"># 只看到 NAME 和 TYPE，看不到值 — 這是 K8s 設計的</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-2 rounded text-xs text-red-300">
          <span className="font-semibold">不要推進 git！</span> 生產環境用 Sealed Secrets 或 External Secrets Operator 管理
        </div>
      </div>
    ),
    notes: `密碼和機密資料放 Secret，不是 ConfigMap。看 YAML。

stringData 和 data 的差別很多人搞混。stringData 你填明文，K8s 幫你 base64 encode 再存。data 你要自己先 base64 encode 才能填進去。用 stringData 比較方便，但這個 YAML 不要推進 git，或者用 Sealed Secrets 這類工具管理。

指令：kubectl apply -f 01-secret.yaml

驗證：

指令：kubectl get secret app-secrets -n tasks

只看到 NAME 和 TYPE，看不到值。describe 也看不到值。這是 K8s 的設計，防止 Secret 在終端機輸出中洩漏。

[▶ 下一頁]`,
  },

  // ── ConfigMap 實作卡 ──
  {
    title: '[8/45] Step 3：ConfigMap — 設定值',
    subtitle: '注意：POSTGRES_HOST 填的是 Service 名稱',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: tasks
data:
  POSTGRES_HOST: "postgres-service"   # ← 等一下要建的 Service 名稱
  POSTGRES_PORT: "5432"
  POSTGRES_DB: "taskdb"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"`,
    content: (
      <div className="space-y-3">
        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded">
          <p className="text-cyan-300 font-semibold text-sm mb-1">K8s 內建 DNS — 用 Service 名稱就能連</p>
          <p className="text-slate-300 text-xs">每個 Service 建立後，叢集內部都能用 <span className="font-mono text-green-400">postgres-service</span> 這個名稱連到它。</p>
          <p className="text-slate-300 text-xs mt-1">Pod 重啟換 IP 也沒關係 → Service DNS 名稱永遠不變 → ConfigMap 裡的值永遠有效</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 02-configmap.yaml</p>
          <p className="text-green-400 mt-1">kubectl get configmap app-config -n tasks -o yaml</p>
          <p className="text-slate-500 mt-1"># 這個可以看到值，因為不是機密資料</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          順序重點：Service 還沒建，但 ConfigMap 裡已經填好 Service 名稱 — 這是 K8s 的好處，名稱先定下來
        </div>
      </div>
    ),
    notes: `看 ConfigMap 的 YAML。

注意 POSTGRES_HOST 的值是 postgres-service。這是等一下我們要建的 Service 名稱。K8s 有內建 DNS，每個 Service 建立之後，叢集內部就可以用 Service 名稱直接連到它。在同一個 Namespace 裡用短名稱就夠，K8s DNS 自動解析。Pod 重啟換了 IP 也沒關係，Service 的 DNS 名稱不變，ConfigMap 裡的值永遠有效。

這就是為什麼我們可以先寫 ConfigMap，後建 Service。名稱先約定好，後面建起來就自動連上。

指令：kubectl apply -f 02-configmap.yaml

[▶ 下一頁]`,
  },

  // ── StatefulSet 複習卡 ──
  {
    title: '[9/45] 複習：StatefulSet — 為什麼不用 Deployment？',
    subtitle: 'Day 6 Loop 4 學過 · 現在輪到 PostgreSQL',
    section: '7-9 邊建邊解釋',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">Deployment 的問題</p>
          <p className="text-slate-300 text-xs">Pod 名稱隨機（postgres-7d4f8-xkjqp）。重啟後換名、跑到別的 Node，原本掛的磁碟連不上 → 資料丟</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">StatefulSet 解決三件事</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>① <span className="text-cyan-400 font-semibold">穩定名稱</span>：postgres-0、postgres-1，重啟不變</p>
            <p>② <span className="text-cyan-400 font-semibold">穩定 DNS</span>：postgres-0.postgres-service 永遠指向同一個 Pod</p>
            <p>③ <span className="text-cyan-400 font-semibold">獨立 PVC</span>：每個 Pod 永遠掛自己的磁碟</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center font-semibold">
          判斷心法 ①：需要穩定身份 → StatefulSet；不需要 → Deployment
        </div>
      </div>
    ),
    notes: `這裡是很多人第一次遇到的疑問。PostgreSQL 也是跑在 Pod 裡，為什麼不用 Deployment？

Deployment 的 Pod 名稱是隨機的，比如 postgres-7d4f8-xkjqp，重啟之後名稱會換，可能跑到不同的 Node 上。如果今天 Pod 在 Node A 掛著某個磁碟，重啟後跑到 Node B，B 上沒有那個磁碟，資料就消失了。

StatefulSet 解決三件事。第一，Pod 有穩定的名稱：postgres-0、postgres-1，重啟後名稱不變。第二，Pod 有穩定的 DNS：postgres-0.postgres-service 永遠指向 postgres-0 這個 Pod，不管它在哪個 Node。第三，每個 Pod 有自己的 PVC：postgres-0 永遠掛自己的 PVC，重啟後還是同一個磁碟，資料不丟。

判斷原則就這一句：這個服務需要穩定的身份（固定名稱和固定儲存）嗎？需要就 StatefulSet，不需要就 Deployment。

[▶ 下一頁]`,
  },

  // ── PostgreSQL StatefulSet 實作卡 ──
  {
    title: '[10/45] Step 4：PostgreSQL StatefulSet',
    subtitle: 'volumeClaimTemplates 是 StatefulSet 特有的',
    section: '7-9 邊建邊解釋',
    duration: '3',
    code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: tasks
spec:
  serviceName: "postgres-service"    # ← 對應 Headless Service
  replicas: 1
  selector:
    matchLabels: { app: postgres }
  template:
    metadata:
      labels: { app: postgres }
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: postgres-password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:               # ← StatefulSet 特有
  - metadata: { name: postgres-storage }
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests: { storage: 5Gi }`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">volumeClaimTemplates 的魔法</p>
          <p className="text-slate-300 text-xs">StatefulSet 用這個模板自動幫每個 Pod 建一個 PVC。</p>
          <p className="text-slate-300 text-xs mt-1">3 個副本 → 自動建 3 個 PVC（postgres-storage-postgres-0/1/2），每個 Pod 獨佔一個。</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 03-postgres.yaml</p>
          <p className="text-green-400 mt-1">kubectl get statefulset -n tasks</p>
          <p className="text-slate-500"># 等 READY 顯示 1/1</p>
          <p className="text-green-400 mt-1">kubectl get pvc -n tasks</p>
          <p className="text-slate-500"># postgres-storage-postgres-0 STATUS 顯示 Bound</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          ReadWriteOnce：一個 PVC 只能被一個 Node 掛載 — PostgreSQL 不需要多節點同時寫同個磁碟
        </div>
      </div>
    ),
    notes: `看 YAML。

volumeClaimTemplates 是 StatefulSet 特有的，Deployment 沒有。StatefulSet 用這個模板自動幫每個 Pod 建一個專屬的 PVC。一個副本就建一個 PVC，名字是 postgres-storage-postgres-0。三個副本就建三個，每個 Pod 自己一個，不共享。

accessModes 設 ReadWriteOnce，代表這個 PVC 只能被一個 Node 掛載。PostgreSQL 不需要多個 Node 同時寫同一個磁碟，ReadWriteOnce 就夠了。

還有一個很重要的欄位：serviceName，值是 postgres-service。StatefulSet 必須指向一個 Headless Service，下一張會解釋為什麼。

指令：kubectl apply -f 03-postgres.yaml

指令：kubectl get statefulset -n tasks

等 READY 顯示 1/1。

指令：kubectl get pvc -n tasks

你會看到 postgres-storage-postgres-0，STATUS 是 Bound，代表已經分配到實際的儲存空間。

[▶ 下一頁]`,
  },

  // ── Headless Service 複習 + 實作 ──
  {
    title: '[11/45] Headless Service — StatefulSet 的搭檔',
    subtitle: 'clusterIP: None → Pod 有自己的 DNS',
    section: '7-9 邊建邊解釋',
    duration: '3',
    code: `apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: tasks
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None          # ← 關鍵：Headless Service`,
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 border border-slate-700 p-3 rounded">
            <p className="text-slate-400 font-semibold text-sm mb-1">普通 ClusterIP Service</p>
            <p className="text-xs text-slate-300">有一個虛擬 IP，流量進來做 LB 隨機分給後端 Pod</p>
            <p className="text-xs text-red-400 mt-1">你不知道打到哪一個</p>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded">
            <p className="text-cyan-400 font-semibold text-sm mb-1">Headless Service</p>
            <p className="text-xs text-slate-300">沒有虛擬 IP，DNS 直接回傳 Pod 真實 IP</p>
            <p className="text-xs text-green-400 mt-1">可以定址到特定 Pod</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">為什麼 StatefulSet 要搭 Headless Service</p>
          <p className="text-slate-300 text-xs">有些場景要連到特定 Pod（例如 PostgreSQL 主從複製，Slave 要連 Master）</p>
          <p className="text-slate-300 text-xs mt-1">用 <span className="font-mono text-green-400">postgres-0.postgres-service</span> 就能直接定址到 0 號 Pod</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          我們只有一個副本，其實用普通 Service 也能跑。但 StatefulSet + Headless Service 是標準寫法，記住這個 pattern。
        </div>
      </div>
    ),
    notes: `PostgreSQL 的 Service 要用 Headless Service。看 YAML，重點是 clusterIP: None。

什麼是 Headless Service？普通的 ClusterIP Service 有一個虛擬 IP，流量打進來 K8s 做負載均衡隨機發給後端 Pod，你不知道打到哪一個。Headless Service 沒有虛擬 IP，DNS 查詢直接回傳 Pod 的真實 IP，而且每個 Pod 可以用穩定名稱定址，postgres-0.postgres-service。

StatefulSet 要搭配 Headless Service，因為有些場景你需要連到特定的 Pod。比如 PostgreSQL 主從複製，Slave 要連到 Master，不能連到隨機一個節點。我們這個系統只有一個副本，沒有主從，但還是用 Headless Service，這是搭配 StatefulSet 的標準做法。

建好之後驗證：kubectl exec -it postgres-0 -n tasks -- psql -U postgres -d taskdb，能進去代表資料庫正常。

[▶ 下一頁]`,
  },

  // ── Redis Deployment 複習卡 ──
  {
    title: '[12/45] Redis — 為什麼這裡不用 StatefulSet？',
    subtitle: '同樣存資料，判斷卻不一樣',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">在這套系統裡，Redis 存的是什麼？</p>
          <p className="text-slate-300 text-xs">暫存的任務佇列 — 不是主要資料庫</p>
          <p className="text-slate-300 text-xs mt-1">真正的狀態在 PostgreSQL，Redis 只是中繼站</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">Redis 重啟丟資料，沒關係</p>
          <p className="text-xs text-slate-300">CronJob 每分鐘觸發一次，會重新把待執行的任務從 DB 撈出來丟進 Queue</p>
          <p className="text-xs text-slate-300 mt-1">→ 系統自動恢復，不用手動補</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center font-semibold">
          判斷心法 ①：重啟能自動重建的資料 → Deployment（OK）
        </div>

        <div className="bg-slate-800/40 p-2 rounded text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">補充：</span>如果 Redis 是主要儲存（例如排行榜服務），那就要用 StatefulSet + PVC 來保資料。看用途，不看軟體。
        </div>
      </div>
    ),
    notes: `Redis 也在存資料，為什麼用 Deployment 不用 StatefulSet？

關鍵是：在這套系統裡，Redis 存的是什麼。Redis 只是暫存的任務佇列，不是主要資料庫。任務真正的狀態存在 PostgreSQL。Redis 裡的任務如果因為 Pod 重啟消失，CronJob 下次觸發時會重新把待執行的任務撈出來再丟進去，系統自動恢復。重啟丟資料是可以接受的。

判斷原則：這份資料重啟之後能不能自動重建？能就 Deployment，不能就 StatefulSet。

提醒一下，這是看用途，不是看軟體本身。如果 Redis 是你的主要儲存，比如排行榜、session store，那就要 StatefulSet 加 PVC。判斷標準是「重啟會不會丟資料造成問題」，不是「這是不是資料庫」。

[▶ 下一頁]`,
  },

  // ── Redis 實作卡 ──
  {
    title: '[13/45] Step 5：Redis Deployment + ClusterIP Service',
    subtitle: '用普通 Service，不是 Headless',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: tasks
spec:
  replicas: 1
  selector: { matchLabels: { app: redis } }
  template:
    metadata: { labels: { app: redis } }
    spec:
      containers:
      - name: redis
        image: redis:7
        command: ["/bin/sh", "-c", "redis-server --requirepass $REDIS_PASSWORD"]
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: redis-password
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
  namespace: tasks
spec:
  selector: { app: redis }
  ports: [{ port: 6379, targetPort: 6379 }]
  # 沒有 clusterIP: None → 普通 ClusterIP`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">為什麼 Redis 的 Service 用 ClusterIP 不用 Headless？</p>
          <p className="text-slate-300 text-xs">Redis 不需要主從定址。任何一個 Redis 實例都能存任務，普通 LB 就夠</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 04-redis.yaml</p>
          <p className="text-green-400 mt-1">kubectl get pods -n tasks</p>
          <p className="text-slate-500"># 等 redis Pod Running</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          密碼用 --requirepass 從 Secret 讀入 — 不是硬寫在 YAML 裡
        </div>
      </div>
    ),
    notes: `看 Redis 的 YAML。

Redis 的 Service 用普通的 ClusterIP，不是 Headless Service。Redis 不需要主從定址，任何一個 Redis 實例都行，普通的負載均衡就夠了。

密碼的處理方式要注意。我用 command 讓 Redis 啟動時讀環境變數 REDIS_PASSWORD 當作 requirepass。環境變數是從 Secret 用 secretKeyRef 注入進來的。整條鏈是：Secret → 環境變數 → Redis 啟動參數。沒有一個地方有明文密碼。

指令：kubectl apply -f 04-redis.yaml

指令：kubectl get pods -n tasks

等 postgres-0 和 redis 的 Pod 都是 Running。

[▶ 下一頁]`,
  },

  // ── Service 三種類型總複習 ──
  {
    title: '[14/45] 複習：Service 三種類型總覽',
    subtitle: 'Day 5 Loop 5 學過 · 判斷什麼時候用哪個',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold text-sm">ClusterIP（預設）</p>
          <p className="text-slate-300 text-xs mt-1">只在叢集內部可存取，外面連不進來</p>
          <p className="text-slate-400 text-xs mt-1">→ PostgreSQL、Redis、Backend、Frontend 都用這個</p>
        </div>

        <div className="bg-slate-800/50 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-yellow-300 font-semibold text-sm">NodePort</p>
          <p className="text-slate-300 text-xs mt-1">每個 Node 上開固定 Port（30000-32767），外部可用 Node IP + Port 連</p>
          <p className="text-slate-400 text-xs mt-1">→ Port 醜、沒域名、沒 SSL，只適合測試，不適合生產</p>
        </div>

        <div className="bg-slate-800/50 border-l-4 border-purple-500 p-3 rounded">
          <p className="text-purple-300 font-semibold text-sm">LoadBalancer</p>
          <p className="text-slate-300 text-xs mt-1">雲端提供商幫你建真正的 LB，給公開 IP</p>
          <p className="text-slate-400 text-xs mt-1">→ 本機 k3s/minikube 會 pending，要在 AWS/GCP/Azure 才有</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center font-semibold">
          這套系統對外用 Ingress，不是 NodePort 或 LoadBalancer
        </div>
      </div>
    ),
    notes: `建完兩個資料庫 Service，剛好複習一下 Day 5 Loop 5 學過的三種 Service 類型。

ClusterIP 是預設，只在叢集內部可以存取，外面連不進來。PostgreSQL、Redis、Backend API、Frontend 的 Service，全部用 ClusterIP。這些服務只需要叢集內部可以連，不需要對外暴露，用 ClusterIP 最安全。

NodePort 在每個 Node 上開一個固定的 Port，範圍 30000 到 32767，外部可以用 Node IP 加這個 Port 連進來。缺點是 Port 號醜、沒有域名、功能少。適合測試環境，不適合生產。

LoadBalancer 讓雲端提供商幫你建一個真正的 Load Balancer，給你一個公開 IP。要在雲端上才有，本機的 k3s 或 minikube 用 LoadBalancer type 會一直 pending。

這套系統對外暴露用 Ingress，不是 NodePort 或 LoadBalancer。Ingress 統一入口，域名路由、SSL、rewrite 全部在這裡處理，一個 Ingress 管所有對外服務。

[▶ 下一頁]`,
  },

  // ── Job 複習卡 ──
  {
    title: '[15/45] 複習：Job — 為什麼一次性任務不用 Deployment？',
    subtitle: 'Day 5 Loop 6 學過 · 現在用在 DB migration',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">用 Deployment 的慘劇</p>
          <p className="text-slate-300 text-xs">Deployment 的目標：Pod 一直活著</p>
          <p className="text-slate-300 text-xs mt-1">Migration 跑完自然退出 → Deployment 以為 Pod 死了 → 一直重啟 → migration 反覆跑 → 衝突、錯誤、資料壞掉</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">Job 是專門設計給「跑完就結束」的任務</p>
          <p className="text-xs text-slate-300">Pod 結束 → Job 不重啟，只記錄成功/失敗</p>
          <p className="text-xs text-slate-300 mt-1">可以設 backoffLimit 限制重試次數</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center font-semibold">
          判斷心法 ③：跑完就結束 → Job；要一直跑 → Deployment
        </div>
      </div>
    ),
    notes: `第一個應用程式不是 Backend，是一個 Job，負責跑資料庫 schema migration，建立資料表。

為什麼用 Job 不用 Deployment？Deployment 的目標是讓 Pod 一直保持存活。Migration 跑完程序退出，Deployment 看到 Pod 死了就一直重啟它，你的 migration 會反覆跑，產生衝突或錯誤。Job 是為跑完就結束的任務設計的，Pod 結束之後 Job 不重啟，只記錄成功或失敗。

Day 5 Loop 6 學過 Job 和 CronJob，今天就用在真實場景上。

[▶ 下一頁]`,
  },

  // ── Job 實作卡 ──
  {
    title: '[16/45] Step 6：DB Migration Job',
    subtitle: '跑一次建 schema，跑完就結束',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
  namespace: tasks
spec:
  template:
    spec:
      restartPolicy: Never    # ← Pod 失敗不自己重啟，交給 Job 決定
      containers:
      - name: migrate
        image: yanchen184/task-api:v2
        command: ["node", "migrate.js"]
        env:
        - name: POSTGRES_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_HOST
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: postgres-password
  backoffLimit: 3             # ← 最多重試 3 次`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">restartPolicy: Never</p>
          <p className="text-slate-300 text-xs">Pod 失敗了 → 不重啟這個 Pod → Job 建一個新的 Pod 重試</p>
          <p className="text-slate-300 text-xs">舊的 Pod 留著 → 你可以看 log 查錯</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 05-db-migrate-job.yaml</p>
          <p className="text-green-400 mt-1">kubectl get job -n tasks</p>
          <p className="text-slate-500"># 等 COMPLETIONS 顯示 1/1</p>
          <p className="text-green-400 mt-1">kubectl logs job/db-migrate -n tasks</p>
          <p className="text-slate-500"># 看 log 確認沒有錯誤</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          backoffLimit: 3 — 失敗 3 次就標記 Failed，不會無限重試浪費資源
        </div>
      </div>
    ),
    notes: `看 YAML。

restartPolicy Never，Pod 失敗了不重啟這個 Pod，Job 建一個新的 Pod 重試，舊的 Pod 留著讓你看 log。backoffLimit 3，最多重試三次，三次都失敗 Job 標記為 Failed，你知道有問題要去查。

image 用 task-api:v2，這是 Backend 的 image，裡面除了 server.js 還有 migrate.js 這支腳本，專門跑 schema migration。同一個 image 包兩支程式，啟動時用 command 指定跑哪支，這是常見做法，不用為了 migration 再 build 另一個 image。

指令：kubectl apply -f 05-db-migrate-job.yaml

指令：kubectl get job -n tasks

等 COMPLETIONS 顯示 1/1，migration 成功。

指令：kubectl logs job/db-migrate -n tasks

看 log 確認沒有錯誤。

[▶ 下一頁]`,
  },

  // ── RBAC 複習卡 ──
  {
    title: '[17/45] 複習：RBAC — 給 Pod 操作 K8s API 的身份',
    subtitle: 'Day 7 上午學過 · 今天在真實系統上用',
    section: '7-9 邊建邊解釋',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">為什麼 Backend 要碰 RBAC？</p>
          <p className="text-slate-300 text-xs">我們的 Backend 是故意寫成「<span className="text-green-400 font-semibold">runtime 去讀 ConfigMap</span>」</p>
          <p className="text-slate-300 text-xs mt-1">→ ConfigMap 改了不用重啟 Pod，下次呼叫就拿到新值</p>
          <p className="text-slate-300 text-xs mt-1">→ 但程式呼叫 K8s API 需要<span className="text-green-400 font-semibold">身份+權限</span></p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">RBAC 三兄弟的分工</p>
          <div className="space-y-2 text-xs">
            <div className="flex gap-2"><span className="font-mono text-blue-400 w-32 shrink-0">ServiceAccount</span><span className="text-slate-300">身份（這個 Pod 是誰）</span></div>
            <div className="flex gap-2"><span className="font-mono text-purple-400 w-32 shrink-0">Role</span><span className="text-slate-300">權限（能做什麼）</span></div>
            <div className="flex gap-2"><span className="font-mono text-pink-400 w-32 shrink-0">RoleBinding</span><span className="text-slate-300">把身份跟權限綁在一起</span></div>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          一般的 envFrom 注入環境變數 → 不用 RBAC。主動呼叫 K8s API → 要 RBAC。
        </div>
      </div>
    ),
    notes: `先說明為什麼 Backend 要碰 RBAC。一般的寫法是在 Pod 啟動的時候，把 ConfigMap 的內容透過 envFrom 灌成環境變數，程式讀環境變數就好，這樣根本不需要 RBAC。

但我們這套 Backend 是故意寫成 runtime 去讀 ConfigMap，也就是程式啟動後直接呼叫 K8s API 把 ConfigMap 拉下來。為什麼？因為這樣 ConfigMap 改了不用重啟 Pod，下次呼叫就拿到新的值。生產環境真的有很多服務是這樣做的，比如 feature flag、路由規則、動態白名單。

一旦你的程式要主動呼叫 K8s API，就必須有對應的身份和權限，這就是 RBAC 三兄弟要出場的時候。ServiceAccount 是身份，Role 是權限，RoleBinding 把兩者綁在一起。

[▶ 下一頁]`,
  },

  // ── RBAC 實作卡 ──
  {
    title: '[18/45] Step 7：Backend RBAC — 只給 get/list configmaps',
    subtitle: '最小權限原則 — 只開需要的，不多給',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: v1
kind: ServiceAccount         # ① 身份
metadata:
  name: backend-sa
  namespace: tasks
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role                   # ② 權限
metadata:
  name: backend-role
  namespace: tasks
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  verbs: ["get", "list"]     # ← 只讀，沒有 create/update/delete
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding            # ③ 綁定
metadata:
  name: backend-rolebinding
  namespace: tasks
subjects:
- kind: ServiceAccount
  name: backend-sa
  namespace: tasks
roleRef:
  kind: Role
  name: backend-role
  apiGroup: rbac.authorization.k8s.io`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">verbs 只給 get 和 list</p>
          <p className="text-slate-300 text-xs">沒有 create、update、delete、patch</p>
          <p className="text-slate-300 text-xs mt-1">就算 Backend 程式有 bug / 被攻擊 → 也不能改叢集設定</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 06-rbac.yaml</p>
          <p className="text-green-400 mt-1">kubectl get serviceaccount,role,rolebinding -n tasks</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          等一下部署完 Backend，我會回來示範「拿掉這個 Role 會怎樣」— 驗證 RBAC 真的在擋
        </div>
      </div>
    ),
    notes: `看 YAML。三個資源串在一起。

ServiceAccount 是身份。Role 是權限，verbs 只有 get 和 list，沒有 create、update、delete。Backend 只需要讀，不需要寫，給最小權限就好，這才是 RBAC 的精髓。

RoleBinding 把 ServiceAccount 和 Role 綁在一起，subjects 指向 ServiceAccount，roleRef 指向 Role。

等一下部署完 Backend 之後，我會回來驗證一件事：把這個 Role 拿掉，看 Backend 會不會真的報錯。這樣大家才知道 RBAC 不是裝飾品，是真的在擋。

指令：kubectl apply -f 06-rbac.yaml

[▶ 下一頁]`,
  },

  // ── readinessProbe 複習卡 ──
  {
    title: '[19/45] 複習：readinessProbe — Pod Running ≠ 可以接流量',
    subtitle: 'Day 7 上午學過 · Backend 部署前必看',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">沒有 readinessProbe 的災難</p>
          <p className="text-slate-300 text-xs">Pod Running → K8s 馬上把流量打進來</p>
          <p className="text-slate-300 text-xs">但 Node.js 還沒啟動完 / DB 還沒連上 → 使用者收到錯誤</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">readinessProbe 的作用</p>
          <p className="text-xs text-slate-300">K8s 每隔幾秒打 /health，直到回 200 才把 Pod 加入 Service 後端</p>
          <p className="text-xs text-slate-300 mt-1">→ READY 欄位顯示 1/1 才算真的準備好</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">和 livenessProbe 的差別</p>
          <p className="text-xs text-slate-300"><span className="font-mono text-yellow-400">readiness</span>：「可以接流量嗎」→ 失敗 = 從 Service 拔掉</p>
          <p className="text-xs text-slate-300"><span className="font-mono text-red-400">liveness</span>：「還活著嗎」→ 失敗 = 砍掉重啟</p>
        </div>
      </div>
    ),
    notes: `Backend 的 YAML 等一下會看到 readinessProbe，這裡先複習一下為什麼需要它。

Day 7 上午有學 Probe，重點是這句話：Pod Running 不等於可以接流量。Node.js 啟動需要幾秒，連資料庫也需要時間。Pod 從 K8s 的角度看是 Running，但從使用者的角度看應用還沒 ready。如果 K8s 直接把流量打進來，使用者第一批請求就會拿到錯誤。

readinessProbe 解決這件事。每隔幾秒打一次 /health，只有回 200，K8s 才把這個 Pod 加進 Service 的後端列表。kubectl get pods 看到的 READY 欄位 1/1，就是 readinessProbe 通過的意思。

順便區分一下 readiness 和 liveness。readiness 問「可以接流量嗎」，失敗就從 Service 拔掉，等 ready 了再加回來。liveness 問「還活著嗎」，失敗就直接砍掉重啟。兩個解決不同問題，常常一起用。

[▶ 下一頁]`,
  },

  // ── envFrom vs env 觀念卡 ──
  {
    title: '[20/45] 觀念：envFrom vs env — 為什麼 Secret 不能用 envFrom？',
    subtitle: '最小權限原則在 YAML 上的具體應用',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">envFrom → 一次灌進全部</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mt-1">
            <p>envFrom:</p>
            <p>- configMapRef:</p>
            <p>{'    '}name: app-config</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">→ ConfigMap 有的 key 全部變成環境變數</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">env + valueFrom → 一條一條明確列</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mt-1">
            <p>env:</p>
            <p>- name: POSTGRES_PASSWORD</p>
            <p>{'  '}valueFrom:</p>
            <p>{'    '}secretKeyRef:</p>
            <p>{'      '}name: app-secrets</p>
            <p>{'      '}key: postgres-password</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300">
          ConfigMap 可以用 envFrom，Secret 不建議用 — 最小權限：只讓容器看到需要的欄位
        </div>
      </div>
    ),
    notes: `部署 Backend 前，我先解釋一個很多人會搞混的差別：envFrom 和 env 的差別。

envFrom 的 configMapRef 是一次把整個 ConfigMap 所有 key 都設成環境變數，不用一條一條列。方便。

但 Secret 不建議用 envFrom。為什麼？因為那樣 Secret 裡的所有欄位都會暴露給容器。Backend 可能只需要 postgres-password，但 envFrom 會把 jwt-secret、redis-password 也一起灌進去，容器可以讀到所有密碼。這不符合最小權限。

Secret 要用 env.valueFrom.secretKeyRef 一條一條明確列，只讓容器看到需要的那幾個。

等一下看 Backend 的 YAML 就會發現：ConfigMap 用 envFrom 整包灌，Secret 用 env 一條一條列。這是設計過的。

[▶ 下一頁]`,
  },

  // ── Backend 實作卡 ──
  {
    title: '[21/45] Step 8：Backend Deployment + Service',
    subtitle: '一次看到 6 個概念在同一個 YAML 裡',
    section: '7-9 邊建邊解釋',
    duration: '4',
    code: `apiVersion: apps/v1
kind: Deployment
metadata: { name: backend, namespace: tasks }
spec:
  replicas: 2
  selector: { matchLabels: { app: backend } }
  template:
    metadata: { labels: { app: backend } }
    spec:
      serviceAccountName: backend-sa       # ① RBAC 身份
      containers:
      - name: backend
        image: yanchen184/task-api:v2
        ports: [{ containerPort: 3000 }]
        env:                               # ② Secret 一條條列
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef: { name: app-secrets, key: postgres-password }
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef: { name: app-secrets, key: redis-password }
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef: { name: app-secrets, key: jwt-secret }
        resources:                         # ③ HPA 前提
          requests: { cpu: "100m", memory: "128Mi" }
          limits: { cpu: "500m", memory: "256Mi" }
        readinessProbe:                    # ④ 接流量才顯示 READY
          httpGet: { path: /health, port: 3000 }
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service                              # ⑤ ClusterIP
metadata: { name: backend-service, namespace: tasks }
spec:
  selector: { app: backend }
  ports: [{ port: 3000, targetPort: 3000 }]`,
    content: (
      <div className="space-y-2">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold text-xs mb-1">一個 YAML 串起 6 個概念</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>① <span className="text-green-400 font-mono">serviceAccountName</span> → RBAC 身份（剛建的 backend-sa）</p>
            <p>② <span className="text-green-400 font-mono">env + valueFrom</span> → Secret 一條條列（最小權限）</p>
            <p>③ <span className="text-green-400 font-mono">resources.requests.cpu</span> → HPA 能運作的前提</p>
            <p>④ <span className="text-green-400 font-mono">readinessProbe</span> → 真的 ready 才接流量</p>
            <p>⑤ <span className="text-green-400 font-mono">ClusterIP Service</span> → 對外交給 Ingress</p>
            <p>⑥ <span className="text-green-400 font-mono">replicas: 2</span> → 起手就兩個副本，HPA 再擴</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-2 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 07-backend.yaml</p>
          <p className="text-green-400 mt-1">kubectl get pods -n tasks -l app=backend</p>
          <p className="text-slate-500"># 等兩個 backend 都 Running 且 READY 1/1</p>
          <p className="text-green-400 mt-1">kubectl port-forward service/backend-service 3000:3000 -n tasks</p>
          <p className="text-green-400 mt-1">curl http://localhost:3000/health</p>
          <p className="text-slate-500"># {`{"status":"ok"}`} 代表後端正常</p>
        </div>
      </div>
    ),
    notes: `Backend 是整個系統 YAML 最密集的地方。一個 Deployment YAML 裡同時用到 6 個概念。

第一，serviceAccountName: backend-sa，把 Pod 的身份設成剛才建的 ServiceAccount，K8s 自動把對應的 token 掛進去，Pod 就有讀取 ConfigMap 的權限。

第二，Secret 用 env 一條條列，不用 envFrom，剛剛說過原因。

第三，resources.requests.cpu 設 100m。這是 HPA 的前提。HPA 計算目前使用量除以 request 等於百分比，沒有 request 就算不出來，HPA 的 TARGETS 會一直顯示 unknown。

第四，readinessProbe。剛剛那頁複習過，Pod Running 不等於可以接流量。

第五，Service 用 ClusterIP。外部的請求先打 Ingress，Ingress 轉給 Backend 的 ClusterIP Service。用 NodePort 會額外開一個 30000+ 的 Port，多餘的攻擊面，沒必要。

第六，replicas 2。起手就兩個副本，HPA 之後會再擴。

指令：kubectl apply -f 07-backend.yaml

指令：kubectl get pods -n tasks -l app=backend

等兩個 backend Pod 都 Running 且 READY 顯示 1/1，readinessProbe 通過才會顯示 1/1。

驗證：kubectl port-forward service/backend-service 3000:3000 -n tasks

另開終端機：curl http://localhost:3000/health

看到 status ok 代表後端正常。

[▶ 下一頁]`,
  },

  // ── RBAC 真的 403 驗證卡（亮點！）──
  {
    title: '[22/45] 驗證 RBAC 真的在擋 — 拿掉 Role 會怎樣',
    subtitle: '不是裝飾，是真的會 403',
    section: '7-9 邊建邊解釋',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">現在 Backend 正常 — 能讀到 ConfigMap</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mt-1">
            <p className="text-green-400">kubectl logs -l app=backend -n tasks --tail=5</p>
            <p className="text-slate-500 mt-1"># Loaded ConfigMap from K8s API: [POSTGRES_HOST, ...]</p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">拿掉 Role → 重啟 Pod → crash</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mt-1">
            <p className="text-green-400">kubectl delete role backend-role -n tasks</p>
            <p className="text-green-400">kubectl rollout restart deployment/backend -n tasks</p>
            <p className="text-green-400">kubectl logs -l app=backend -n tasks --tail=10</p>
          </div>
          <p className="text-red-400 text-xs mt-1 font-mono">→ configmaps "app-config" is forbidden (403)</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">加回 Role → 恢復</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mt-1">
            <p className="text-green-400">kubectl apply -f 06-rbac.yaml</p>
            <p className="text-green-400">kubectl rollout restart deployment/backend -n tasks</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center font-semibold">
          這才是 RBAC 在真實系統上的意義 — 不是好看的三個 YAML，是真的會擋
        </div>
      </div>
    ),
    notes: `Backend 起來了，現在我要做一個很重要的示範：證明剛才做的 RBAC 真的有用。

先看現在的狀態。

指令：kubectl logs -l app=backend -n tasks --tail=5

你會看到這行：Loaded ConfigMap from K8s API。這代表 Backend 用 ServiceAccount 的 token 成功呼叫 K8s API 把 ConfigMap 讀下來了。

現在把 Role 拿掉，看會發生什麼事。

指令：kubectl delete role backend-role -n tasks

重啟 Backend 讓它重新讀 ConfigMap：

指令：kubectl rollout restart deployment/backend -n tasks

看 log：

指令：kubectl logs -l app=backend -n tasks --tail=10

你會看到 Pod 在啟動階段就 crash 掉，錯誤訊息是 configmaps app-config is forbidden，而且 status code 是 403。

這就是 RBAC 在擋。Backend 的 ServiceAccount 沒有對應的 Role，API Server 直接拒絕。

把 Role 加回來：

指令：kubectl apply -f 06-rbac.yaml

指令：kubectl rollout restart deployment/backend -n tasks

Backend 又恢復正常。

這才是 RBAC 在真實系統上的意義。不是 YAML 上好看的三個資源，是真的會擋。上午學的最小權限原則，今天在一個真實系統上具體看到效果。

[▶ 下一頁]`,
  },

  // ── Frontend 實作卡 ──
  {
    title: '[23/45] Step 9：Frontend Deployment + Service',
    subtitle: 'React build 出來的靜態檔 + nginx serve',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: apps/v1
kind: Deployment
metadata: { name: frontend, namespace: tasks }
spec:
  replicas: 2
  selector: { matchLabels: { app: frontend } }
  template:
    metadata: { labels: { app: frontend } }
    spec:
      containers:
      - name: frontend
        image: yanchen184/task-frontend:v1
        ports: [{ containerPort: 80 }]
        resources:
          requests: { cpu: "50m", memory: "64Mi" }
---
apiVersion: v1
kind: Service
metadata: { name: frontend-service, namespace: tasks }
spec:
  selector: { app: frontend }
  ports: [{ port: 80, targetPort: 80 }]`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">Frontend 比 Backend 單純很多</p>
          <p className="text-slate-300 text-xs">只是 nginx 靜態伺服器 serve React build 出來的檔案</p>
          <p className="text-slate-300 text-xs mt-1">不用連資料庫、不用 RBAC、不用 readinessProbe（nginx 啟動極快）</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 08-frontend.yaml</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          ClusterIP Service → 對外暴露一樣交給 Ingress
        </div>
      </div>
    ),
    notes: `Frontend 是 nginx 靜態伺服器，serve build 出來的 React 靜態檔。比 Backend 單純很多，不用連資料庫、不用 RBAC。

replicas 2 保有高可用，ClusterIP Service 對外暴露交給 Ingress。

指令：kubectl apply -f 08-frontend.yaml

[▶ 下一頁]`,
  },

  // ── Task Runner 為什麼沒有 Service ──
  {
    title: '[24/45] Step 10：Task Runner — 為什麼不需要 Service？',
    subtitle: 'Service 的作用是「讓別人連進來」',
    section: '7-9 邊建邊解釋',
    duration: '3',
    code: `apiVersion: apps/v1
kind: Deployment
metadata: { name: task-runner, namespace: tasks }
spec:
  replicas: 3                    # ← 3 個同時消費 Queue
  selector: { matchLabels: { app: task-runner } }
  template:
    metadata: { labels: { app: task-runner } }
    spec:
      containers:
      - name: task-runner
        image: yanchen184/task-runner:v1
        command: ["node", "runner.js"]
        envFrom:
        - configMapRef: { name: app-config }
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef: { name: app-secrets, key: postgres-password }
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef: { name: app-secrets, key: redis-password }
# ⚠️ 沒有 Service！`,
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">先問：Service 是什麼？</p>
          <p className="text-slate-300 text-xs">Service 的作用 = 讓別人「連進來」</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">Task Runner 的方向是反的</p>
          <p className="text-slate-300 text-xs">Task Runner 主動去連 Redis 拉任務 → <span className="text-green-400">Task Runner 是 client</span></p>
          <p className="text-slate-300 text-xs">沒有人要連到 Task Runner → <span className="text-red-400">不需要 Service</span></p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">replicas: 3 的意義</p>
          <p className="text-slate-300 text-xs">3 個 Runner 同時從 Queue 拉任務 → 吞吐量 ×3</p>
          <p className="text-slate-300 text-xs mt-1">Redis 的 <span className="font-mono text-green-400">BLPOP</span> 是原子操作 → 同一個任務只會被一個 Runner 拿走</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center">
          判斷心法：有人要連進來 → 要 Service；沒有 → 不用
        </div>
      </div>
    ),
    notes: `Task Runner 跑起來，要不要建 Service？

不需要。Service 的作用是讓別人連進來。Task Runner 是主動去 Redis Queue 拉任務，沒有人要連到它，它連到 Redis。方向是反的，Task Runner 是 client，Redis 是 server，所以 Task Runner 不需要 Service。

三個副本，三個同時從 Queue 拉任務，吞吐量是一個的三倍。Redis 的 BLPOP 是原子操作，同一個任務只會被一個 Task Runner 拿走，不會重複執行。

這是一個常見的誤區，很多同學以為每個 Deployment 都要有 Service。其實不是。判斷原則：有沒有別的服務需要連到這個 Deployment？有就要 Service，沒有就不用。

[▶ 下一頁]`,
  },

  // ── DaemonSet vs Deployment ──
  {
    title: '[25/45] 為什麼 Task Runner 不用 DaemonSet？',
    subtitle: '判斷心法 ④：跟 Node 數量綁定嗎？',
    section: '7-9 邊建邊解釋',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">DaemonSet 的定義</p>
          <p className="text-slate-300 text-xs">保證每個 Node 上都跑一個 Pod</p>
          <p className="text-slate-300 text-xs mt-1">5 個 Node → 5 個 Pod；加到 10 個 Node → 自動變 10 個 Pod</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">DaemonSet 適合跟 Node 綁定的任務</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• <span className="font-mono text-cyan-400">Log Agent</span>（fluentd）：讀 Node 本機磁碟的 log</p>
            <p>• <span className="font-mono text-cyan-400">Metrics Agent</span>（node-exporter）：收 Node 層級 metrics</p>
            <p>• <span className="font-mono text-cyan-400">網路插件</span>（kube-proxy）：管理 Node 的 iptables</p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">Task Runner 根本不該是 DaemonSet</p>
          <p className="text-xs text-slate-300">Task Runner 消費 Redis Queue 的任務，<span className="text-red-400 font-semibold">跟 Node 數量完全沒關係</span></p>
          <p className="text-xs text-slate-300 mt-1">叢集擴到 100 個 Node → 你不需要 100 個 Task Runner</p>
          <p className="text-xs text-slate-300 mt-1">Task Runner 數量 = 任務量決定，不是 Node 數量</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center font-semibold">
          跟 Node 綁定 → DaemonSet；不綁定 → Deployment
        </div>
      </div>
    ),
    notes: `有同學會問：Task Runner 要一直跑，是不是每個 Node 都要有一個，聽起來像 DaemonSet？

這是一個非常經典的誤區，今天把它講清楚。

DaemonSet 的定義是：保證每個 Node 上都跑一個 Pod。你有五個 Node 就有五個 Pod，加到十個 Node 就自動變十個 Pod。

DaemonSet 適合跟 Node 綁定的任務。日誌收集 Agent：每個 Node 上的 Pod 都在 Node 的本機磁碟上產生 log，你需要每個 Node 都有一個 Agent 去讀自己節點上的 log。跨節點讀別人的本機磁碟做不到。監控 Agent：node-exporter 收集 Node 層級的 metrics，每個 Node 一個。網路插件：kube-proxy 在每個 Node 上管理 iptables 規則，每個 Node 要有。

Task Runner 消費的是 Redis Queue 裡的任務，跟 Node 數量完全沒關係。三個 Node 不代表要三個 Worker，三個 Task Runner 也不代表只能有三個 Node。Task Runner 數量取決於任務量，不取決於 Node 數量。

如果你用 DaemonSet，叢集擴到 100 個 Node 就有 100 個 Task Runner，這不是你要的。

判斷原則一句話：跟 Node 數量綁定就用 DaemonSet，不綁定就用 Deployment。

指令：kubectl apply -f 09-task-runner.yaml

[▶ 下一頁]`,
  },

  // ── CronJob 複習 ──
  {
    title: '[26/45] 複習：CronJob — 定時觸發',
    subtitle: 'Day 5 Loop 6 學過 · 現在用在排程掃描',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">Cron 語法五個欄位</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p>* * * * *</p>
            <p>分 時 日 月 週</p>
          </div>
          <div className="text-xs text-slate-300 mt-2 space-y-1">
            <p><span className="font-mono text-green-400">* * * * *</span> → 每分鐘</p>
            <p><span className="font-mono text-green-400">0 9 * * *</span> → 每天早上 9 點</p>
            <p><span className="font-mono text-green-400">*/5 * * * *</span> → 每 5 分鐘</p>
            <p><span className="font-mono text-green-400">0 */6 * * *</span> → 每 6 小時</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">concurrencyPolicy 三個選項</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• <span className="font-mono text-blue-400">Allow</span>（預設）→ 允許同時跑多個</p>
            <p>• <span className="font-mono text-green-400">Forbid</span> → 上一個沒跑完，這次跳過（我們用這個）</p>
            <p>• <span className="font-mono text-yellow-400">Replace</span> → 砍掉舊的，起新的</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          為什麼用 Forbid？防止同一批任務被重複掃描入隊
        </div>
      </div>
    ),
    notes: `CronJob 每分鐘掃一次資料庫，把到期的任務撈出來丟進 Queue。先複習 Cron 語法。

schedule 的 Cron 語法，五個欄位從左到右是分、時、日、月、週。全星號代表每分鐘。0 9 * * * 是每天早上九點，0 斜線 6 星號星號星號是每六小時，斜線 5 星號星號星號星號是每五分鐘。

concurrencyPolicy 三個選項。Allow 是預設，允許同時跑多個 Job。Forbid 是上一個還沒跑完就跳過這次，防止同一批任務被重複入隊，我們用這個。Replace 是砍掉上一個還在跑的，起一個新的，適合跑最新的就好、舊的不重要的場景。

[▶ 下一頁]`,
  },

  // ── CronJob 實作卡 ──
  {
    title: '[27/45] Step 11：CronJob Task Scheduler',
    subtitle: '每分鐘掃一次到期任務丟進 Queue',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: batch/v1
kind: CronJob
metadata: { name: task-scheduler, namespace: tasks }
spec:
  schedule: "* * * * *"          # 每分鐘
  concurrencyPolicy: Forbid      # 上一個沒完 → 跳過
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: scheduler
            image: yanchen184/task-scheduler:v1
            command: ["node", "scheduler.js"]
            envFrom:
            - configMapRef: { name: app-config }
            env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef: { name: app-secrets, key: postgres-password }
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef: { name: app-secrets, key: redis-password }`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 10-cronjob.yaml</p>
          <p className="text-slate-500 mt-1"># 等一分鐘</p>
          <p className="text-green-400 mt-1">kubectl get job -n tasks</p>
          <p className="text-slate-500"># CronJob 自動建 Job，COMPLETIONS 1/1</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">CronJob 會生 Job，Job 會生 Pod</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>CronJob <span className="text-cyan-400">→</span> 時間到建 Job</p>
            <p>Job <span className="text-cyan-400">→</span> 建 Pod 執行</p>
            <p>Pod 跑完 <span className="text-cyan-400">→</span> Job 記錄成功，等下次</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          historyLimit: 3 — 保留最近 3 次成功/失敗紀錄，超過會自動清掉
        </div>
      </div>
    ),
    notes: `看 YAML。

schedule 是 * * * * * 每分鐘。concurrencyPolicy Forbid。historyLimit 各保留 3 筆，避免 Job 一直累積。

指令：kubectl apply -f 10-cronjob.yaml

等一分鐘：

指令：kubectl get job -n tasks

你會看到 CronJob 自動建立了 Job，COMPLETIONS 1/1。CronJob 和 Job 是一對多的關係，CronJob 是模板，每次觸發建一個 Job，Job 建 Pod 去執行，這樣三層結構。

[▶ 下一頁]`,
  },

  // ── Ingress 複習卡 ──
  {
    title: '[28/45] 複習：Ingress — 為什麼不用 NodePort？',
    subtitle: 'Day 6 Loop 1 學過 · 今天 Docker Desktop 用 nginx',
    section: '7-9 邊建邊解釋',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">NodePort 的問題</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• Port 號 30000 以上，地址醜</p>
            <p>• 沒有域名、沒有 SSL、沒有路由</p>
            <p>• 五個服務 = 開五個 NodePort → 管理噩夢</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">Ingress 統一入口</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• 一個 Ingress Controller 管所有對外流量</p>
            <p>• 根據域名、路徑路由到不同 Service</p>
            <p>• TLS、rewrite、IP 白名單集中處理</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">不同環境的 Ingress Controller</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• k3s → 內建 <span className="font-mono text-yellow-400">Traefik</span></p>
            <p>• Docker Desktop / minikube → <span className="font-mono text-green-400">nginx</span>（今天用這個）</p>
          </div>
        </div>
      </div>
    ),
    notes: `Frontend 和 Backend 的 Service 都是 ClusterIP，外面連不進來。用 Ingress 對外開放。

為什麼是 Ingress 不是 NodePort？NodePort 的 Port 號在 30000 以上，地址醜、沒有域名、沒有 SSL、沒有路由功能。你有五個服務就要開五個 NodePort，管理起來是噩夢。Ingress 統一入口，一個 Ingress Controller 在叢集裡跑，所有對外流量都打它，它根據域名和路徑路由到不同的 Service。TLS、rewrite、IP 白名單全部集中在這裡處理。

補充一下 Ingress Controller。不同環境的內建 controller 不一樣，k3s 內建 Traefik，Docker Desktop 和 minikube 都是裝 nginx ingress controller。今天示範用 Docker Desktop，所以 ingressClassName 寫 nginx。

[▶ 下一頁]`,
  },

  // ── Ingress 實作卡（nginx）──
  {
    title: '[29/45] Step 12：Ingress（nginx）— path rewrite',
    subtitle: '同一個域名，路徑分流給不同後端',
    section: '7-9 邊建邊解釋',
    duration: '3',
    code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tasks-ingress
  namespace: tasks
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2   # ← 關鍵
spec:
  ingressClassName: nginx
  rules:
  - host: task.local
    http:
      paths:
      - path: /api(/|$)(.*)                    # 正規式抓 /tasks
        pathType: ImplementationSpecific
        backend:
          service:
            name: backend-service
            port: { number: 3000 }
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port: { number: 80 }`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">path rewrite 在做什麼</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>使用者打 → <span className="font-mono text-yellow-400">task.local/api/tasks</span></p>
            <p>nginx 匹配 <span className="font-mono text-green-400">/api(/|$)(.*)</span>，抓到 <span className="font-mono text-cyan-400">tasks</span></p>
            <p>rewrite-target <span className="font-mono text-green-400">/$2</span> → Backend 收到 <span className="font-mono text-cyan-400">/tasks</span> ✓</p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-2 rounded">
          <p className="text-red-300 text-xs">沒 rewrite → Backend 收到 /api/tasks → API route 只認 /tasks → <span className="font-bold">404</span></p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 12-ingress.yaml</p>
          <p className="text-green-400 mt-1">kubectl get ingress -n tasks</p>
          <p className="text-slate-500 mt-2"># 改 /etc/hosts 加一行：</p>
          <p className="text-yellow-400">127.0.0.1  task.local</p>
        </div>
      </div>
    ),
    notes: `看 Ingress 的 YAML。

使用者打 task.local/api/tasks，nginx 先比對這條正規表示法 /api(/|$)(.*)。括號內的 (.*) 會抓到 tasks 這段路徑，annotation 裡的 rewrite-target /$2 把路徑改寫成 /tasks，Backend 收到的就是 /tasks。如果沒有 rewrite，Backend 收到的是 /api/tasks，你的 API route 只認 /tasks，就 404 了。

這個正規表示法的寫法是 nginx ingress controller 的標準做法。不同 controller 做 path rewrite 的語法不一樣，Traefik 要用 Middleware CRD，nginx 用 annotation 就可以。今天用 Docker Desktop 環境，記住 nginx 這套寫法就好。

指令：kubectl apply -f 12-ingress.yaml

指令：kubectl get ingress -n tasks

確認 ADDRESS 有值（Docker Desktop 上會顯示 localhost），代表 Ingress Controller 接管了這條規則。

要讓瀏覽器用 task.local 連進來，記得改 /etc/hosts 加一行：127.0.0.1 task.local。

[▶ 下一頁]`,
  },

  // ── HPA 複習卡 ──
  {
    title: '[30/45] 複習：HPA — 自動擴縮',
    subtitle: 'Day 7 上午學過 · 前提是 requests.cpu',
    section: '7-9 邊建邊解釋',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">HPA 的公式</p>
          <p className="text-slate-300 text-xs font-mono">使用率 = 目前用量 ÷ requests.cpu</p>
          <p className="text-slate-300 text-xs mt-1">沒設 <span className="font-mono text-yellow-400">requests.cpu</span> → 算不出百分比 → TARGETS 顯示 unknown</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">Backend 的 requests.cpu 是 100m</p>
          <p className="text-xs text-slate-300">HPA 設定 averageUtilization: 70</p>
          <p className="text-xs text-slate-300">CPU 用超過 70m（100m × 70%）→ 擴</p>
          <p className="text-xs text-slate-300">CPU 低於 70m → 縮</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          HPA 的範圍 2~10 個副本。擴到 10 還不夠 → 看是不是該加機器 / 優化程式
        </div>
      </div>
    ),
    notes: `上午學過 HPA。我再快速複習一下，Backend 剛才 YAML 裡面設了 resources.requests.cpu 100m，就是在為 HPA 鋪路。

HPA 計算使用率的公式是：目前 CPU 用量除以 requests.cpu。如果沒設 requests.cpu，這個公式算不出來，HPA 的 TARGETS 會一直顯示 unknown。這是新手最常犯的錯。

averageUtilization 設 70 的意思是：全部副本的平均使用率超過 70% 就擴，低於就縮。Backend 的 requests 是 100m，70% 就是 70m。

[▶ 下一頁]`,
  },

  // ── HPA 實作卡 ──
  {
    title: '[31/45] Step 13：HPA — Backend 2~10 副本',
    subtitle: 'CPU 超過 70% 就擴',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: tasks
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded font-mono text-xs">
          <p className="text-green-400">kubectl apply -f 11-hpa.yaml</p>
          <p className="text-green-400 mt-1">kubectl get hpa -n tasks</p>
          <p className="text-slate-500"># TARGETS 欄位顯示：3%/70% 或 unknown/70%</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">如果 TARGETS 一直 unknown？</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>1. Pod 沒設 <span className="font-mono text-yellow-400">requests.cpu</span> → HPA 算不出百分比</p>
            <p>2. <span className="font-mono text-yellow-400">metrics-server</span> 還沒啟動 → 等 1 分鐘</p>
            <p>3. 等 5 分鐘還 unknown → <span className="font-mono text-green-400">kubectl top pods</span> 看能不能出數字</p>
          </div>
        </div>
      </div>
    ),
    notes: `HPA 的 YAML。

scaleTargetRef 指向 Backend Deployment，min 2、max 10，target 是 CPU 平均使用率 70%。

指令：kubectl apply -f 11-hpa.yaml

指令：kubectl get hpa -n tasks

TARGETS 顯示目前 CPU 使用率和目標。

如果 TARGETS 一直是 unknown，兩個原因。第一，Pod 沒設 resources.requests.cpu，HPA 算不出百分比。回去 Deployment YAML 加上 requests，重新 apply。第二，metrics-server 剛啟動還在收集數據，等一分鐘再看。等五分鐘還是 unknown，用 kubectl top pods 看看能不能出數字，不能的話看 metrics-server 的 log。

[▶ 下一頁]`,
  },

  // ── 全系統驗收 ──
  {
    title: '[32/45] 全系統驗收 — 13 步全部跑完',
    subtitle: 'kubectl get all 一次看全部',
    section: '7-9 邊建邊解釋',
    duration: '2',
    code: `# 看所有資源
kubectl get all -n tasks

# 看 PVC
kubectl get pvc -n tasks

# 看 Secret / ConfigMap / RBAC
kubectl get secret,configmap,serviceaccount,role,rolebinding -n tasks

# 開瀏覽器（已改好 /etc/hosts）
open http://task.local`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">應該看到的畫面</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>✓ StatefulSet <span className="font-mono text-green-400">postgres</span> READY 1/1</p>
            <p>✓ Deployment <span className="font-mono text-green-400">redis/backend/frontend/task-runner</span> 全 READY</p>
            <p>✓ Job <span className="font-mono text-green-400">db-migrate</span> COMPLETIONS 1/1</p>
            <p>✓ CronJob <span className="font-mono text-green-400">task-scheduler</span> 存在（每分鐘觸發）</p>
            <p>✓ PVC <span className="font-mono text-green-400">postgres-storage-postgres-0</span> Bound</p>
            <p>✓ Ingress <span className="font-mono text-green-400">tasks-ingress</span> ADDRESS 有值</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded text-center">
          <p className="text-green-300 font-semibold text-sm">13 步全部打完 = 完整系統上線</p>
          <p className="text-slate-300 text-xs mt-1">12 個 K8s 組件、4 個應用服務、3 層 Queue 架構</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-sm text-amber-300 text-center">
          在瀏覽器建一個任務 → 馬上看到 task-runner 把它處理完 ✓
        </div>
      </div>
    ),
    notes: `好，13 步全部跑完，一套完整的系統就在這裡了。

指令：kubectl get all -n tasks

確認 StatefulSet postgres READY 1/1、Deployment redis、backend、frontend、task-runner 都 READY、CronJob 存在。

指令：kubectl get pvc -n tasks

postgres-storage-postgres-0 STATUS 是 Bound。

指令：kubectl get secret,configmap,serviceaccount,role,rolebinding -n tasks

全部都存在，系統完整部署完成。

打開瀏覽器 task.local，建一個任務，你會看到 task-runner 幾秒內把它處理完，狀態從 pending 變成 done。這是一套真的在跑的非同步任務系統。

從空的 Namespace 到完整系統，13 個步驟。每個步驟背後都有判斷：用什麼組件、為什麼。這個判斷能力，比會打 kubectl apply 重要得多。

7-9 到這邊結束，下一段是 QA 和 Helm 示範。

[▶ 下一頁]`,
  },

  // ========== 7-10: QA + Helm + 學員題目 ==========
  {
    title: '[33/45] 影片 7-10：QA + Helm + 學員題目',
    subtitle: '從操作疑難到產品化管理',
    section: '7-10',
    duration: '~15 min',
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-2xl text-slate-200 mb-2">三個主題</p>
          <p className="text-sm text-slate-400">剛操作完 13 個步驟，先回答常見問題，再示範生產環境怎麼管</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-center">
            <p className="text-3xl mb-2">❓</p>
            <p className="text-cyan-300 font-semibold text-sm">常見 QA</p>
            <p className="text-xs text-slate-300 mt-1">PVC Pending / CrashLoopBackOff / HPA unknown / Task Runner 不消費</p>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/40 p-3 rounded text-center">
            <p className="text-3xl mb-2">⎈</p>
            <p className="text-purple-300 font-semibold text-sm">Helm 示範</p>
            <p className="text-xs text-slate-300 mt-1">install / upgrade / rollback / --set</p>
          </div>
          <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-center">
            <p className="text-3xl mb-2">🎯</p>
            <p className="text-amber-300 font-semibold text-sm">學員題目</p>
            <p className="text-xs text-slate-300 mt-1">從零建一個短網址服務</p>
          </div>
        </div>
      </div>
    ),
    notes: `7-9 結束，進入 7-10。

這一集做三件事。第一，QA，把剛才操作過程中常見的問題統一回答。第二，Helm 示範，剛才是用 kubectl apply 一個一個打，這在管理系統的時候有版本追蹤和 rollback 的問題，Helm 就是解法。第三，學員題目，從零建一個短網址服務。

[▶ 下一頁]`,
  },

  // QA 1: PVC Pending
  {
    title: '[34/45] QA #1：PVC 一直是 Pending 怎麼辦？',
    subtitle: '看 StorageClass 和 Events',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">症狀</p>
          <p className="text-xs text-slate-300">kubectl get pvc 顯示 STATUS = Pending，postgres Pod 起不來</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">排查步驟</p>
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <p className="text-green-400"># 1. 看叢集有沒有預設 StorageClass</p>
            <p>kubectl get storageclass</p>
            <p className="text-green-400"># 2. 看 PVC 的 Events 寫什麼</p>
            <p>kubectl describe pvc postgres-storage-postgres-0 -n tasks</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">常見原因</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• 叢集沒有預設 StorageClass（k3s 內建 local-path、Docker Desktop 有 hostpath）</p>
            <p>• StorageClass 存在但 volumeClaimTemplates 沒指定對應名稱</p>
          </div>
        </div>
      </div>
    ),
    notes: `Q：PVC 一直是 Pending，不是 Bound，怎麼辦？

A：kubectl get pvc -n tasks 看 STATUS，如果是 Pending，原因通常是叢集沒有對應的 StorageClass 可以動態佈建。

kubectl get storageclass 確認有沒有預設的 StorageClass，k3s 內建 local-path，minikube 用 standard，Docker Desktop 用 hostpath。

如果 StorageClass 存在但還是 Pending，kubectl describe pvc 看 Events，通常會寫清楚為什麼找不到合適的 PV。

[▶ 下一頁]`,
  },

  // QA 2: CrashLoopBackOff
  {
    title: '[35/45] QA #2：Pod 一直 CrashLoopBackOff',
    subtitle: '三個最常見原因',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">第一件事：看 logs</p>
          <p className="text-xs font-mono text-green-400">kubectl logs pod名稱 -n tasks --tail=50</p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
            <p className="text-red-300 font-semibold text-sm">原因 1：資料庫還沒準備好</p>
            <p className="text-xs text-slate-300 mt-1">Migration 還沒跑完就部署了 Backend → Backend 連不上 DB 就 crash</p>
            <p className="text-xs text-amber-300 mt-1">解法：先等 postgres Running → 跑完 migration → 再部署 Backend</p>
          </div>

          <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
            <p className="text-red-300 font-semibold text-sm">原因 2：Secret 名稱拼錯</p>
            <p className="text-xs text-slate-300 mt-1">env.valueFrom.secretKeyRef.name 對不上 Secret 名字</p>
          </div>

          <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
            <p className="text-red-300 font-semibold text-sm">原因 3：ConfigMap 的 key 打錯</p>
            <p className="text-xs text-slate-300 mt-1">valueFrom.configMapKeyRef.key 要跟 ConfigMap 裡的 key 名稱完全一樣</p>
          </div>
        </div>
      </div>
    ),
    notes: `Q：Pod 一直 CrashLoopBackOff，怎麼查？

A：kubectl logs pod名稱 -n tasks 看最後幾行。最常見的是三個原因。

第一，資料庫還沒準備好，Migration 還沒跑完就部署了 Backend，Backend 連不上 DB 就 crash。順序要對，先等 postgres Running，跑完 migration 再部署 Backend。

第二，Secret 名稱拼錯，env 裡的 secretKeyRef.name 要完全對應 Secret 的名字。

第三，ConfigMap 的 key 打錯，valueFrom.configMapKeyRef.key 要跟 ConfigMap 裡的 key 名稱完全一樣。

[▶ 下一頁]`,
  },

  // QA 3: HPA unknown
  {
    title: '[36/45] QA #3：HPA TARGETS 一直顯示 unknown',
    subtitle: '兩個原因',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">症狀</p>
          <p className="text-xs font-mono text-slate-300 mt-1">NAME REFERENCE TARGETS{'\n'}backend Deployment/backend &lt;unknown&gt;/70%</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">原因 1：Pod 沒設 resources.requests.cpu</p>
          <p className="text-xs text-slate-300 mt-1">HPA 算百分比的分母就是 requests.cpu，沒設就算不出來</p>
          <p className="text-xs text-amber-300 mt-1">解法：回去 Deployment YAML 補 requests.cpu，重新 apply</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">原因 2：metrics-server 還沒收到數據</p>
          <p className="text-xs text-slate-300 mt-1">剛 apply 完等一分鐘就會出現數字</p>
          <p className="text-xs font-mono text-green-400 mt-1">kubectl top pods -n tasks   # 確認 metrics 有數字</p>
          <p className="text-xs text-slate-400 mt-1">五分鐘還是沒有 → 看 metrics-server logs</p>
        </div>
      </div>
    ),
    notes: `Q：HPA 的 TARGETS 一直顯示 unknown，怎麼辦？

A：兩個原因。

第一，Pod 沒有設 resources.requests.cpu，HPA 算不出百分比。回去 Deployment YAML 加上 requests，重新 apply。

第二，metrics-server 剛啟動還在收集數據，等一分鐘再看。如果等五分鐘還是 unknown，kubectl top pods -n tasks 看看能不能出現數字，不能的話看 metrics-server 的 logs。

[▶ 下一頁]`,
  },

  // QA 4: Task Runner not consuming
  {
    title: '[37/45] QA #4：Task Runner 不消費 Queue 的任務',
    subtitle: '幾乎都是 Redis 連線設錯',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">症狀</p>
          <p className="text-xs text-slate-300">Task Runner Pod 是 Running，但 Queue 裡的任務永遠 pending，沒被消費</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">第一步：看 logs</p>
          <p className="text-xs font-mono text-green-400">kubectl logs -l app=task-runner -n tasks</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">最常見原因：Redis 連不上</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• REDIS_HOST 設錯 → 應該是 Service 名稱 redis-service</p>
            <p>• REDIS_PASSWORD 值錯 → Secret 裡的 redis-password</p>
            <p>• Redis Pod 還沒 Running → kubectl get pod -l app=redis</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm">診斷順序</p>
          <p className="text-xs text-slate-300 mt-1">logs → ConfigMap 的 REDIS_HOST → Secret 的 REDIS_PASSWORD → Redis Pod 狀態</p>
        </div>
      </div>
    ),
    notes: `Q：Task Runner 啟動了，但 Queue 裡的任務沒有被消費？

A：kubectl logs -l app=task-runner -n tasks 看 Task Runner 的 log。

最常見是 Redis 連線失敗，通常是 REDIS_HOST 或 REDIS_PASSWORD 設錯。確認 redis-service 存在、Redis Pod 是 Running 狀態，然後確認 ConfigMap 和 Secret 的值對不對。

QA 結束。接下來示範 Helm。

[▶ 下一頁]`,
  },

  // Helm intro
  {
    title: '[38/45] Helm 示範 — 同一套系統，用 Helm 管理',
    subtitle: '為什麼不裸 YAML？',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-2">裸 YAML 的三個問題</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>✗ 版本怎麼追蹤？改了什麼不記得</p>
            <p>✗ Rollback 怎麼做？找上次的 YAML 重打？</p>
            <p>✗ 要換一個設定值，去哪個檔案改？apply 之後怎麼確認沒漏？</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">Helm 的解法</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>✓ 版本歷史：helm history 看每次動了什麼</p>
            <p>✓ Rollback：helm rollback 一行回到前一版</p>
            <p>✓ 設定集中：所有可變值放在 values.yaml</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-center">
          <p className="text-amber-300 font-semibold text-sm">接下來示範 4 件事</p>
          <p className="text-xs text-slate-300 mt-1">install → upgrade → rollback → --set</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-1">示範前先清場</p>
          <p className="text-xs font-mono text-green-400">kubectl delete namespace tasks{'\n'}kubectl get ns  # 等刪乾淨</p>
        </div>
      </div>
    ),
    notes: `好，QA 結束。在進入學員題目之前，我要用剛才這套系統示範一件事。

你剛才用 kubectl apply 一個一個把 YAML 打上去。這在管理一套系統的時候有個問題：版本怎麼追蹤？rollback 怎麼做？要換一個設定值，你要去找哪個 YAML 改，apply 之後怎麼知道有沒有漏掉？

這就是 Helm 要解決的問題。我把這套任務排程系統包成一個 Helm Chart，接下來示範四件事：install、upgrade、rollback、換 values。

先清掉剛才用 kubectl apply 建的東西。指令：kubectl delete namespace tasks。等 namespace 刪乾淨。

[▶ 下一頁]`,
  },

  // Helm install
  {
    title: '[39/45] Step 1 — helm install',
    subtitle: '一行部署整套系統',
    section: '7-10',
    code: `# 一行部署整套系統
helm install task-system ./apps/helm/task-system

# 查看 release 狀態
helm list

# 確認所有組件都在
kubectl get all -n tasks`,
    content: (
      <div className="space-y-3">
        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">這一行 = 剛才所有 kubectl apply 加起來</p>
          <p className="text-xs text-slate-300">Namespace、Secret、ConfigMap、StatefulSet、Deployment、Service、Job、CronJob、HPA、Ingress、RBAC — 全部一次部署</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">應該看到的畫面</p>
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <p>NAME        NAMESPACE REVISION STATUS   CHART</p>
            <p>task-system tasks     1        deployed task-system-0.1.0</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm">REVISION = 1</p>
          <p className="text-xs text-slate-300 mt-1">Helm 開始追蹤版本。每次 install/upgrade/rollback 都會累加 REVISION</p>
        </div>
      </div>
    ),
    notes: `Step 1，helm install。

指令：helm install task-system ./apps/helm/task-system

這一行做的事，等於你剛才打的所有 kubectl apply 加起來。

看部署狀態，指令：helm list

指令：kubectl get all -n tasks

等所有 Pod READY，migration Job 也跑完。

注意 REVISION 是 1，Helm 從這裡開始追蹤版本。

[▶ 下一頁]`,
  },

  // Helm upgrade
  {
    title: '[40/45] Step 2 — helm upgrade',
    subtitle: '換 image tag、擴副本',
    section: '7-10',
    code: `# 用另一個 values 檔升級（v2 image + backend 副本擴到 3）
helm upgrade task-system ./apps/helm/task-system \\
  -f apps/helm/values-v2.yaml

# 查看版本歷史
helm history task-system`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">Helm 的聰明之處</p>
          <p className="text-xs text-slate-300">只更新「有變的資源」，沒變的完全不動 → Postgres、Redis 這些不動，只改 Backend image 和 replicas</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">helm history 應該看到</p>
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <p>REVISION UPDATED STATUS     DESCRIPTION</p>
            <p>1        ...     superseded Install complete</p>
            <p>2        ...     deployed   Upgrade complete  ← 這次</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm">歷史完整保留</p>
          <p className="text-xs text-slate-300 mt-1">REVISION 1 還在，隨時可以 rollback 回去</p>
        </div>
      </div>
    ),
    notes: `Step 2，helm upgrade。

現在假設你出了 v2，backend 副本要從 2 擴到 3。

指令：helm upgrade task-system ./apps/helm/task-system -f apps/helm/values-v2.yaml

Helm 只更新有變的資源，沒變的不動。

看 history，指令：helm history task-system

你會看到兩個 REVISION，REVISION 1 是 install，REVISION 2 是這次 upgrade。

[▶ 下一頁]`,
  },

  // Helm rollback
  {
    title: '[41/45] Step 3 — helm rollback',
    subtitle: 'v2 有問題？一行回到 v1',
    section: '7-10',
    code: `# rollback 到 REVISION 1
helm rollback task-system 1

# 再看 history
helm history task-system`,
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded">
          <p className="text-red-300 font-semibold text-sm mb-1">情境</p>
          <p className="text-xs text-slate-300">upgrade 到 v2 之後發現 bug，五分鐘內要回到穩定版</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">關鍵觀念：rollback 建立新 REVISION</p>
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <p>REVISION UPDATED STATUS     DESCRIPTION</p>
            <p>1        ...     superseded Install complete</p>
            <p>2        ...     superseded Upgrade complete</p>
            <p>3        ...     deployed   Rollback to 1  ← 新增</p>
          </div>
          <p className="text-xs text-slate-300 mt-2">內容跟 REVISION 1 一樣，但歷史完整保留</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm">為什麼不直接「覆蓋 REVISION 1」？</p>
          <p className="text-xs text-slate-300 mt-1">因為你還可能想 rollback 到 2（如果發現 2 比較好），歷史不可破壞</p>
        </div>
      </div>
    ),
    notes: `Step 3，helm rollback。

upgrade 之後發現 v2 有問題，一行 rollback。

指令：helm rollback task-system 1

rollback 不是覆蓋 REVISION 1，它建立一個新的 REVISION 3，內容跟 REVISION 1 一樣。history 完整保留，你知道每一次動了什麼。

指令：helm history task-system

這個設計很重要，因為你之後可能又想 rollback 到 REVISION 2，歷史不能破壞。

[▶ 下一頁]`,
  },

  // Helm --set
  {
    title: '[42/45] Step 4 — --set 覆蓋單一 value',
    subtitle: '臨時調整不改 values.yaml',
    section: '7-10',
    code: `# 不改 values 檔，直接 --set 臨時覆蓋
helm upgrade task-system ./apps/helm/task-system \\
  --set replicas.backend=5

# 確認 backend Pod 從 2 變 5
kubectl get pods -n tasks -l app=backend`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">--set 適合這些場景</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• 臨時調整副本數應對突發流量</p>
            <p>• 手動改一個 image tag 做實驗</p>
            <p>• CI/CD 流程動態注入版本號</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm mb-1">但正式環境還是要用 values 檔</p>
          <p className="text-xs text-slate-300">--set 的改動沒記錄在檔案裡，下次 upgrade 不帶 --set 就消失。正式環境要「設定 = 檔案」，方便 review、方便 git 追蹤</p>
        </div>
      </div>
    ),
    notes: `Step 4，--set 換單一 value。

不用改 values.yaml，直接 --set 覆蓋單一值。

指令：helm upgrade task-system ./apps/helm/task-system --set replicas.backend=5

指令：kubectl get pods -n tasks -l app=backend

backend Pod 從 2 個變 5 個。

--set 適合臨時調整，正式環境還是用 values 檔記錄。因為 --set 的改動沒寫進檔案，下次不帶 --set 就消失，正式環境每個設定都要可以在 git 裡找到。

[▶ 下一頁]`,
  },

  // Helm summary table
  {
    title: '[43/45] Helm 四個操作總結',
    subtitle: '生產環境就用這五條指令',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 border border-slate-600 p-4 rounded">
          <div className="grid grid-cols-[1fr_2fr] gap-2 text-xs">
            <div className="font-semibold text-cyan-300 py-2 border-b border-slate-600">操作</div>
            <div className="font-semibold text-cyan-300 py-2 border-b border-slate-600">指令</div>

            <div className="py-2 text-slate-300">部署整套系統</div>
            <div className="py-2 font-mono text-green-400">helm install task-system ./apps/helm/task-system</div>

            <div className="py-2 text-slate-300">升級版本</div>
            <div className="py-2 font-mono text-green-400">helm upgrade task-system ./apps/helm/task-system -f values-v2.yaml</div>

            <div className="py-2 text-slate-300">查歷史</div>
            <div className="py-2 font-mono text-green-400">helm history task-system</div>

            <div className="py-2 text-slate-300">Rollback</div>
            <div className="py-2 font-mono text-green-400">helm rollback task-system 1</div>

            <div className="py-2 text-slate-300">換單一值</div>
            <div className="py-2 font-mono text-green-400">helm upgrade task-system ./apps/helm/task-system --set replicas.backend=5</div>

            <div className="py-2 text-slate-300">清除整套</div>
            <div className="py-2 font-mono text-green-400">helm uninstall task-system</div>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-2">為什麼生產環境都用 Helm</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>✓ 版本有歷史（history）</p>
            <p>✓ Rollback 一行（rollback）</p>
            <p>✓ 設定值集中（values.yaml）</p>
            <p>✓ 不用管 apply 順序</p>
          </div>
        </div>
      </div>
    ),
    notes: `四個操作總結：

部署整套系統用 helm install。
升級版本用 helm upgrade 配 -f values 檔。
查歷史用 helm history。
Rollback 用 helm rollback 加 REVISION 編號。
換單一值用 helm upgrade 配 --set。
清除整套用 helm uninstall。

這就是為什麼生產環境都用 Helm 管理，不用裸 YAML。版本有歷史、rollback 一行、設定值集中在一個地方。

Helm 示範到這邊，接下來換你們動手。

[▶ 下一頁]`,
  },

  // Student exercise
  {
    title: '[44/45] 學員題目：從零建短網址服務',
    subtitle: '不是背指令，是練習做選擇',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">系統功能</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>1. 使用者輸入長網址 → 系統回傳短網址（short.ly/abc123）</p>
            <p>2. 使用者打短網址 → 系統查 DB → 跳轉到長網址</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm mb-2">你要做的決策</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>□ Frontend、Backend 用 Deployment 還是 StatefulSet？</p>
            <p>□ DB 選什麼？（PostgreSQL？Redis？）要不要持久化？</p>
            <p>□ Service 用哪種類型（ClusterIP / NodePort / LoadBalancer）？</p>
            <p>□ 需不需要 Ingress？</p>
            <p>□ 需不需要 HPA？</p>
            <p>□ 需不需要 RBAC？</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold text-sm mb-1">提示</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• 短網址資料不能丟 → DB 要持久化</p>
            <p>• 短網址查詢流量可能很高 → 考慮 HPA</p>
            <p>• 對外要用域名，不是 IP:Port → Ingress</p>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-center">
          <p className="text-cyan-300 font-semibold text-sm">先自己試，卡住再舉手</p>
        </div>
      </div>
    ),
    notes: `好，QA 結束。換大家動手了。

下一個 Loop 是學員自架。主題是短網址服務。我給你需求，你自己設計架構，自己寫 YAML，自己部署。

這套系統的功能：使用者輸入一個長網址，系統回傳一個短網址，比如 short.ly/abc123。使用者打短網址，系統查資料庫，跳轉到原始的長網址。

需要的組件：Frontend、Backend API、資料庫（你來選用什麼）。你要決定哪些東西用 Deployment，哪些用 StatefulSet，Service 用哪種類型，需不需要 Ingress，需不需要 HPA，需不需要 RBAC。

這個決策過程就是今天下午的重點。你不是在背指令，你是在練習做選擇。

給你一些提示。短網址的資料不能丟，你選的資料庫要能持久化。短網址查詢的流量可能很高，你考慮一下要不要加 HPA。短網址服務對外要用域名，不是 IP 加 Port。

題目就這樣，動手吧。有問題可以舉手，但先試試看自己想。

[▶ 下一頁]`,
  },

  // Solution guide
  {
    title: '[45/45] 解答：完整判斷流程',
    subtitle: '從需求 → 組件選擇',
    section: '7-10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 border border-slate-600 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">資料庫選型</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• <span className="text-green-400">PostgreSQL</span>：完整、支援複雜查詢 — 未來要擴功能的話合理</p>
            <p>• <span className="text-green-400">Redis</span>：key-value 超快 — 短網址查詢幾乎都是 lookup，很適合</p>
            <p>• <span className="text-amber-300">選 Redis 做主 DB 時 → StatefulSet + PVC（資料不能丟）</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-600 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">完整服務清單</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>✓ Frontend：<span className="text-green-400">Deployment + ClusterIP Service</span></p>
            <p>✓ Backend API：<span className="text-green-400">Deployment + ClusterIP Service + HPA</span></p>
            <p>✓ 資料庫：<span className="text-green-400">StatefulSet + Headless Service + PVC</span></p>
            <p>✓ 對外：<span className="text-green-400">Ingress（短網址要用域名）</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-600 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-sm mb-2">進階判斷</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>• <span className="text-amber-300">HPA</span>：讀取流量高 → 加，記得 Backend 設 requests.cpu</p>
            <p>• <span className="text-amber-300">RBAC</span>：Backend 如果 runtime 讀 ConfigMap → 加 SA+Role。只靠 env 注入就不需要</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded text-center">
          <p className="text-green-300 font-semibold text-sm">這就是真正的 K8s 工程師在做的事</p>
          <p className="text-xs text-slate-300 mt-1">從需求出發，一個一個決定用什麼組件。打 kubectl apply 只是最後一步</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-center">
          <p className="text-amber-300 font-semibold">今天的課程到這裡結束。謝謝大家。</p>
        </div>
      </div>
    ),
    notes: `解答時間。

資料庫選 PostgreSQL 或 Redis 都合理。PostgreSQL 比較完整，支援複雜查詢。Redis 速度很快，短網址查詢幾乎都是 key-value lookup，Redis 很適合。如果你選 Redis 做持久化，這時候要用 StatefulSet，因為資料不能丟了。

服務清單：Frontend Deployment + ClusterIP Service、Backend API Deployment + ClusterIP Service、資料庫 StatefulSet + Headless Service + PVC。

是否需要 HPA？短網址服務的讀取流量可能很高，Backend API 加 HPA 是合理的。記得設 resources.requests.cpu。

是否需要 RBAC？如果 Backend 需要在 runtime 讀取 K8s 的 ConfigMap 或 Secret，需要。如果你只是在 Pod 啟動時注入環境變數，不需要 ServiceAccount 也能跑。

Ingress 一定要，對外要用域名，不用 NodePort。

這就是一套完整的判斷流程。你從需求出發，一個一個決定用什麼組件，這才是真正的 K8s 工程師在做的事情。

今天的課程到這裡結束。謝謝大家。`,
  },

]
