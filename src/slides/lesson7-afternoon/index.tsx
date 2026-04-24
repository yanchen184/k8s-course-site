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
// 第七堂下午 Loop 4 — 從零建完整系統（任務排程系統）+ 短網址產品實作
// 影片：7-8（系統設計）、7-9（邊建邊解釋）、7-10（QA）、7-11~7-14（短網址產品實作）
// 主架構：Frontend → Backend API → Redis Queue → Task Runner → MySQL
// 以 public/docs/day7-loop4-deploy.md 與 public/docs/day7-loop4-urlshortener.md 為手稿來源，50 張一一對應
// ============================================================

export const slides: Slide[] = [
  // ============================================================
  // 7-8 我們要建什麼？（3 張）
  // ============================================================

  // ── [1/45] 為什麼選這個系統 ──
  {
    title: '[1/45] 為什麼選這個系統',
    subtitle: 'Loop 4：從零建完整系統',
    section: '7-8 我們要建什麼？',
    duration: '2',
    content: (
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-cyan-900/40 to-purple-900/40 border border-cyan-500/50 p-6 rounded-lg text-center">
          <p className="text-cyan-300 text-lg font-semibold mb-3">下午的總複習</p>
          <p className="text-slate-300 text-sm">你學了很多組件，但從來沒有全部串在一起過</p>
          <p className="text-slate-300 text-sm mt-1">任務排程系統能覆蓋最多的 K8s 組件</p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">涵蓋 12 個 K8s 組件</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、HPA、RBAC、Job、CronJob、DaemonSet（對比說明）
          </p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-lg text-sm text-amber-300 text-center">
          不是在背指令，是在練習做選擇
        </div>
      </div>
    ),
    notes: `好，上午解決了 HPA 和 RBAC。現在進入今天最後一個部分，也是整個課程最重要的環節。

到目前為止你學了 Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、HPA、RBAC、Job、CronJob。每個組件你應該都知道它是什麼。

但如果我現在叫你從零建一套完整的系統，你知道要從哪裡開始嗎？第一步做什麼、第二步做什麼、這裡用哪個組件、那裡為什麼不用另一個？

這就是今天下午要做的事。我選的系統叫做「任務排程系統」，它能覆蓋最多的 K8s 組件，一次把 12 個都串起來。

[▶ PPT 2/45：系統功能]`,
  },

  // ── [2/45] 系統功能 ──
  {
    title: '[2/45] 系統功能',
    subtitle: '使用者建立任務 → Queue → 執行 → 存 DB',
    section: '7-8 我們要建什麼？',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">使用者情境</p>
          <p className="text-slate-300 text-sm">建立任務：「每天早上九點寄出報表 Email」</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-sm text-center">資料流</p>
          <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
            <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-300">Frontend</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-300">Backend API</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-300">Redis Queue</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded text-purple-300">Task Runner</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-300">MySQL</span>
          </div>
          <div className="flex items-center gap-2 justify-center text-xs mt-3 pt-3 border-t border-slate-700">
            <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-300">CronJob</span>
            <span className="text-slate-500">每分鐘掃</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-300">MySQL</span>
            <span className="text-slate-500">撈到期任務</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-300">Redis Queue</span>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-3 rounded-lg text-xs text-slate-400">
          Backend 不自己跑任務，把任務丟進 Queue；Task Runner 從 Queue 拿任務執行，結果存進 MySQL
        </div>
      </div>
    ),
    notes: `系統功能很單純。使用者在網頁上建立一個任務，例如「每天早上九點寄出報表 Email」，然後點送出。

Backend API 把這個任務丟進 Redis Queue，馬上回應「任務已建立」，使用者不用等。

Task Runner 在背景從 Queue 拿任務執行，執行結果存進 MySQL。

另外有一個 CronJob，每分鐘觸發一次，把資料庫裡到期的排程任務撈出來，丟進 Queue，讓 Task Runner 去跑。

為什麼要這樣設計？因為任務可能要跑很久。如果 Backend 自己跑，使用者就要一直等。非同步架構的好處就是 API 馬上回應，重活交給後面的 worker。這是業界標準做法。

[▶ PPT 3/45：12 個組件對應位置]`,
  },

  // ── [3/45] 12 個組件對應位置 ──
  {
    title: '[3/45] 12 個組件對應位置',
    subtitle: '每個組件用在哪、為什麼',
    section: '7-8 我們要建什麼？',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-cyan-300">
                <th className="border border-slate-700 p-2 text-left">組件</th>
                <th className="border border-slate-700 p-2 text-left">用在哪裡</th>
                <th className="border border-slate-700 p-2 text-left">為什麼</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr><td className="border border-slate-700 p-2 font-mono text-cyan-400">Deployment</td><td className="border border-slate-700 p-2">Frontend / Backend / Task Runner</td><td className="border border-slate-700 p-2">無狀態，Pod 隨時可重建</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-cyan-400">StatefulSet</td><td className="border border-slate-700 p-2">MySQL</td><td className="border border-slate-700 p-2">需要穩定 Pod 名稱和固定儲存</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono text-cyan-400">PVC</td><td className="border border-slate-700 p-2">MySQL</td><td className="border border-slate-700 p-2">持久化資料</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-cyan-400">ConfigMap</td><td className="border border-slate-700 p-2">DB 主機/Port/DB 名稱</td><td className="border border-slate-700 p-2">非機密設定</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono text-cyan-400">Secret</td><td className="border border-slate-700 p-2">DB 密碼 / Redis 密碼 / JWT</td><td className="border border-slate-700 p-2">機密資料</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-cyan-400">Service</td><td className="border border-slate-700 p-2">所有服務</td><td className="border border-slate-700 p-2">叢集內部互連</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono text-cyan-400">Ingress</td><td className="border border-slate-700 p-2">Frontend / Backend</td><td className="border border-slate-700 p-2">對外域名路由</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-cyan-400">HPA</td><td className="border border-slate-700 p-2">Backend API</td><td className="border border-slate-700 p-2">CPU 自動擴縮</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono text-cyan-400">RBAC</td><td className="border border-slate-700 p-2">Backend SA</td><td className="border border-slate-700 p-2">最小讀取 ConfigMap 權限</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-cyan-400">Job</td><td className="border border-slate-700 p-2">DB migration</td><td className="border border-slate-700 p-2">一次性任務</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono text-cyan-400">CronJob</td><td className="border border-slate-700 p-2">定時排程觸發</td><td className="border border-slate-700 p-2">每分鐘掃一次到期任務</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-amber-400">DaemonSet</td><td className="border border-slate-700 p-2">對比說明（不用）</td><td className="border border-slate-700 p-2">跟 Node 數量綁定才用</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `把 12 個組件列出來，告訴你每個用在哪、為什麼要用它。

Deployment 放在 Frontend、Backend、Task Runner 這三個地方，因為它們都是無狀態的服務，Pod 隨時可以重建，不影響功能。

StatefulSet 給 MySQL，因為資料庫需要穩定的 Pod 名稱和固定的儲存。PVC 配合 StatefulSet 做資料持久化。

ConfigMap 放非機密的設定，像 DB 主機名、port、DB 名稱。Secret 放機密，DB 密碼、Redis 密碼、JWT secret。分界線只有一條：洩漏會不會出事。

Service 每個服務都有一個，用來叢集內部互相連接。Ingress 只給對外的 Frontend 和 Backend 路由。

HPA 給 Backend，CPU 自動擴縮。RBAC 給 Backend 的 ServiceAccount 最小權限，只能讀 ConfigMap。

Job 做 DB migration，一次性任務。CronJob 做定時排程觸發，每分鐘掃一次到期任務。

DaemonSet 這裡刻意列出來但打括號，是「對比說明，不用」。等一下講 Task Runner 會解釋為什麼這套系統不用 DaemonSet。

這個對應表就是我們接下來 40 分鐘要建的整套系統。

[▶ PPT 4/45：前置確認 Node Ready]`,
  },

  // ============================================================
  // 7-9 前置（2 張）
  // ============================================================

  // ── [4/45] 前置確認 Node Ready ──
  {
    title: '[4/45] 前置確認：兩個 Node 都要 Ready',
    subtitle: '動工前先看 Node 狀態',
    section: '7-9 前置確認',
    duration: '1',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">檢查指令</p>
          <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`kubectl get nodes`}</code></pre>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded-lg">
          <p className="text-green-300 text-sm font-semibold mb-1">期待：兩個都 Ready</p>
          <p className="text-slate-400 text-xs">ubuntu-master 和 ubuntu-worker 都要是 Ready 狀態</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-300 text-sm font-semibold mb-1">常見狀況：worker NotReady</p>
          <p className="text-slate-400 text-xs">可能是 master IP 換過（VM 重啟後 IP 飄移），worker 的 k3s-agent 還連著舊 IP。下一頁示範修復。</p>
        </div>
      </div>
    ),
    notes: `動工前一定要先看 Node 狀態。

打 kubectl get nodes，兩個 Node 都要是 Ready。如果 worker 是 NotReady，最常見的原因是 master 的 IP 換過了。

你用 VM 跑 k3s，重開機之後 IP 可能會飄移。master 的 IP 變了，worker 的 k3s-agent 還連著舊的 IP，連不上就會 NotReady。

下一頁我示範怎麼修。

[▶ PPT 5/45：IP 飄移修復]`,
  },

  // ── [5/45] IP 飄移修復 ──
  {
    title: '[5/45] 修復 worker NotReady（IP 飄移）',
    subtitle: 'master 拿 token → worker 改設定',
    section: '7-9 前置確認',
    duration: '2',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1">1. master 取新 token</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`sudo cat /var/lib/rancher/k3s/server/node-token`}</code></pre>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1">2. worker 停 agent、改設定檔</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`sudo systemctl stop k3s-agent
sudo nano /etc/systemd/system/k3s-agent.service.env`}</code></pre>
          <p className="text-slate-400 mt-2">改 K3S_URL 成 master 新 IP（例：https://192.168.43.133:6443），K3S_TOKEN 貼剛才的 token</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1">3. worker 重啟 agent</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`sudo systemctl daemon-reload
sudo systemctl start k3s-agent`}</code></pre>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1">4. master 確認</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`kubectl get nodes -w`}</code></pre>
          <p className="text-slate-400 mt-2">等兩個 Node 都是 Ready 再繼續</p>
        </div>
      </div>
    ),
    notes: `四個動作就能修好。

第一步，在 master 上拿新的 token。sudo cat /var/lib/rancher/k3s/server/node-token，複製起來。

第二步，到 worker 機器上把 k3s-agent 停掉，然後編輯設定檔 /etc/systemd/system/k3s-agent.service.env。把 K3S_URL 改成 master 現在的 IP，例如 https://192.168.43.133:6443，K3S_TOKEN 填剛才拿到的那串。

第三步，daemon-reload 讓 systemd 重讀設定，然後 start k3s-agent。

第四步，回到 master 打 kubectl get nodes -w，加 -w 是 watch，會一直看。等 worker 從 NotReady 變 Ready 就繼續。

好，兩個 Node 都 Ready 之後，開始動工。

[▶ PPT 6/45：第一段過場]`,
  },

  // ============================================================
  // 第一段 基礎層 00~03（11 張）
  // ============================================================

  // ── [6/45] 第一段過場 ──
  {
    title: '[6/45] 第一段：基礎層（00~03）',
    subtitle: 'Namespace → Secret → ConfigMap → MySQL',
    section: '7-9 第一段：基礎層',
    duration: '1',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/50 p-6 rounded-lg text-center">
          <p className="text-cyan-300 text-xl font-semibold mb-2">第一段：基礎層</p>
          <p className="text-slate-300 text-sm">隔離、機密、設定、資料庫</p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-mono">00</p>
            <p className="text-slate-300 mt-1">Namespace</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-mono">01</p>
            <p className="text-slate-300 mt-1">Secret</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-mono">02</p>
            <p className="text-slate-300 mt-1">ConfigMap</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-cyan-400 font-mono">03</p>
            <p className="text-slate-300 mt-1">MySQL</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-lg text-sm text-amber-300 text-center">
          這四個先建好，後面的服務才有地方放、才有設定可讀、才有資料庫可連
        </div>
      </div>
    ),
    notes: `現在進入第一段，基礎層。四個組件：00 Namespace、01 Secret、02 ConfigMap、03 MySQL。

順序是有意義的。Namespace 要先建，所有後面的資源都要放進 tasks namespace 裡。Secret 跟 ConfigMap 要比 Pod 先建，因為 Pod 起來的時候會去讀這兩個，沒有就啟動失敗。MySQL 放第一段最後，因為它是所有服務的資料最終歸宿，後面的 migration、Backend、Task Runner 都依賴它。

這一段跑完你會得到一個隔離的 namespace，裡面有機密、有設定、有跑起來的資料庫。

[▶ PPT 7/45：Namespace]`,
  },

  // ── [7/45] Namespace ──
  {
    title: '[7/45] Namespace — 隔離這套系統',
    subtitle: '00-namespace.yaml',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-4 rounded text-xs overflow-x-auto"><code>{`apiVersion: v1
kind: Namespace
metadata:
  name: tasks        # ★ 所有 -n tasks 對應這個名稱`}</code></pre>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1 text-sm">指令</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs"><code>{`kubectl apply -f 00-namespace.yaml`}</code></pre>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-slate-300">
            建立 <span className="text-cyan-300 font-mono">tasks</span> namespace，隔離這套系統。所有後續指令都要加 <span className="text-cyan-300 font-mono">-n tasks</span>。
          </p>
          <p className="text-amber-300 mt-2">
            改這裡全部要跟著改——YAML 裡每一份資源的 namespace、每一行指令的 -n tasks、RoleBinding 的 subjects namespace，都對應這個名字。
          </p>
        </div>
      </div>
    ),
    notes: `第一個最簡單：建 Namespace。

為什麼要建 namespace？隔離。如果你所有東西都丟在 default 裡，跟其他人、跟其他系統的資源混在一起，一眼看不出哪個屬於誰。一個 kubectl delete 打錯，別人系統也死了。

Namespace 只有一個欄位重要：metadata.name。我叫它 tasks。apply 之後，後面所有資源都加 namespace: tasks，所有指令都加 -n tasks。

這個 name 是你的鐵律。改這裡所有地方都要跟著改——YAML 裡面的 namespace 欄位、指令的 -n、RoleBinding 的 subjects.namespace，全部都要對應。

[▶ PPT 8/45：Secret YAML]`,
  },

  // ── [8/45] Secret YAML ──
  {
    title: '[8/45] Secret — 機密資料',
    subtitle: '01-secret.yaml',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-4 rounded text-xs overflow-x-auto"><code>{`apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: tasks
type: Opaque        # ★ 重點 1：通用型 Secret，適合任意 key-value
stringData:         # ★ 重點 2：填明文，K8s 自動 base64 encode
  mysql-password: "MyMysqlP@ssw0rd"
  redis-password: "MyRedisP@ssw0rd"
  jwt-secret: "MyJwtSuperSecret"`}</code></pre>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-2 rounded">
            <p className="text-cyan-300 font-semibold">type: Opaque</p>
            <p className="text-slate-400 mt-1">通用型 Secret，適合任意 key-value 機密</p>
          </div>
          <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-2 rounded">
            <p className="text-cyan-300 font-semibold">stringData vs data</p>
            <p className="text-slate-400 mt-1">stringData 明文、K8s 自動 encode；data 要自己先 base64</p>
          </div>
        </div>
      </div>
    ),
    notes: `第二個：Secret。

type: Opaque 是通用型，適合任意 key-value 的機密資料。K8s 還有其他 type，例如 kubernetes.io/tls 給憑證用、kubernetes.io/dockerconfigjson 給 registry 認證，這些是特殊型，欄位格式固定。你一般做機密用 Opaque 就對了。

stringData 跟 data 差在：stringData 填明文，K8s 幫你 base64 encode；data 要你自己先 base64，否則會爛掉。我用 stringData，因為明文比較好維護、改錯也直接看得到。

這裡放三個機密：MySQL 的 admin 密碼、Redis 的密碼、JWT 的簽章 secret。

[▶ PPT 9/45：Secret 說明]`,
  },

  // ── [9/45] Secret 說明與驗證 ──
  {
    title: '[9/45] Secret 說明與驗證',
    subtitle: '不要推進 git',
    section: '7-9 第一段：基礎層',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1 text-sm">指令</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs"><code>{`kubectl apply -f 01-secret.yaml
kubectl get secret app-secrets -n tasks`}</code></pre>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-green-500 p-3 rounded text-xs">
          <p className="text-slate-300">輸出：<span className="text-green-300 font-mono">secret/app-secrets created</span></p>
          <p className="text-slate-300 mt-1">get 時 DATA 欄位顯示 <span className="text-cyan-300 font-mono">3</span>，代表三個欄位都存進去</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-300 text-sm font-semibold">這個 YAML 不要推進 git</p>
          <p className="text-slate-400 text-xs mt-1">密碼明文寫在檔案裡，推上去等於公開密碼。真實專案要用 Sealed Secrets、External Secrets 或 Vault 管理。</p>
        </div>
      </div>
    ),
    notes: `apply 下去，輸出 secret/app-secrets created。打 get 看一下，DATA 顯示 3，代表三個欄位都存進去了。

重要提醒：這個 YAML 不要推進 git。密碼是明文寫在檔案裡，推上去就等於公開密碼。

真實專案會怎麼做？用 Sealed Secrets、External Secrets Operator 或 HashiCorp Vault。這些工具讓你可以把加密後的 Secret 推進 git，叢集裡面再解密。這堂課為了簡化，直接用明文，但你進公司不要這樣做。

[▶ PPT 10/45：ConfigMap YAML]`,
  },

  // ── [10/45] ConfigMap YAML ──
  {
    title: '[10/45] ConfigMap — 非機密設定',
    subtitle: '02-configmap.yaml',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-4 rounded text-xs overflow-x-auto"><code>{`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: tasks
data:
  MYSQL_HOST: "mysql-service"   # ★ Service 名稱，不是 IP
  MYSQL_PORT: "3306"
  MYSQL_DATABASE: "taskdb"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  API_URL: "http://backend-service:3000"`}</code></pre>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs"><code>{`kubectl apply -f 02-configmap.yaml`}</code></pre>
        </div>
      </div>
    ),
    notes: `ConfigMap 放非機密的設定。

data 底下每一個 key-value 都是一個環境變數。MYSQL_HOST 設成 mysql-service、PORT 是 3306、DB 叫 taskdb。REDIS_HOST 設成 redis-service、PORT 6379。還有 backend 內部 API URL。

apply 下去，一行 configmap/app-config created。

[▶ PPT 11/45：ConfigMap 說明]`,
  },

  // ── [11/45] ConfigMap 說明 ──
  {
    title: '[11/45] ConfigMap — 為什麼值是 Service 名稱',
    subtitle: 'K8s DNS 自動解析',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold text-sm mb-1">重點 1：MYSQL_HOST 的值是 Service 名稱，不是 IP</p>
          <p className="text-slate-400 text-xs">K8s 內建 CoreDNS 自動解析，Pod 重啟換 IP 也不影響</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold text-sm mb-1">重點 2：API_URL 叢集內部用 Service 名稱通訊</p>
          <p className="text-slate-400 text-xs">不需要真實 IP，也不走外網</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">Service 名稱 → 真 IP 怎麼發生？</p>
          <p className="text-slate-400">
            Pod 裡面打 <span className="text-cyan-300 font-mono">mysql-service</span> → 問叢集的 CoreDNS → CoreDNS 回 Service 的 ClusterIP → kube-proxy 把流量轉到實際的 mysql-0 Pod。Pod 換 IP，Service 的 endpoints 自動更新，呼叫端完全無感。
          </p>
        </div>
      </div>
    ),
    notes: `為什麼 MYSQL_HOST 的值我寫 mysql-service 而不是一個 IP？

K8s 內建 DNS 叫 CoreDNS，每個 Service 都會自動註冊成 DNS name。你的 Pod 只要連 mysql-service，DNS 就解析到 Service 的 ClusterIP，再由 kube-proxy 把流量轉到背後真正的 Pod。

這樣做的好處是：Pod 重啟 IP 變了你不用管，Service 的 endpoints 自動更新。如果你寫死 IP，每次 Pod 重啟你就要改 ConfigMap，然後重啟所有用到它的服務。那就垮了。

API_URL 同理，叢集內部互相通訊一律用 Service 名稱，不需要真實 IP，也不走外網。

[▶ PPT 12/45：MySQL 為什麼 StatefulSet]`,
  },

  // ── [12/45] MySQL 為什麼 StatefulSet ──
  {
    title: '[12/45] MySQL — 為什麼不用 Deployment',
    subtitle: '有穩定身份的三件事',
    section: '7-9 第一段：基礎層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold text-sm">判斷原則</p>
          <p className="text-slate-300 text-sm mt-1">需要穩定的身份（固定名稱 + 固定儲存）嗎？需要就 StatefulSet，不需要就 Deployment。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">StatefulSet 解決三件事</p>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-900/50 p-2 rounded">
              <p className="text-cyan-300 font-semibold">1. 穩定名稱</p>
              <p className="text-slate-400">mysql-0，重啟名字不變（metadata.name + 序號）</p>
            </div>
            <div className="bg-slate-900/50 p-2 rounded">
              <p className="text-cyan-300 font-semibold">2. 穩定 DNS</p>
              <p className="text-slate-400">mysql-0.mysql-service 永遠指向 mysql-0（CoreDNS 自動建）</p>
            </div>
            <div className="bg-slate-900/50 p-2 rounded">
              <p className="text-cyan-300 font-semibold">3. 每個 Pod 自己的 PVC</p>
              <p className="text-slate-400">重啟後還是同一個磁碟，資料不丟</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-amber-500 p-3 rounded text-xs">
          <p className="text-slate-300">
            老實說，replicas: 1 的 MySQL 用 Deployment + 手動 PVC 也能跑。業界用 StatefulSet 的理由：語意清楚、未來擴充容易、面試標準答案（說「資料庫用 Deployment」會被電）。
          </p>
        </div>
      </div>
    ),
    notes: `現在要建 MySQL。第一個問題：為什麼不用 Deployment，要用 StatefulSet？

判斷原則我講過：需要穩定的身份嗎？穩定名稱跟穩定儲存。需要就 StatefulSet。

StatefulSet 解決三件事。第一，Pod 有穩定名稱 mysql-0，名字由 metadata.name 加上序號組成。重啟名字不變。第二，Pod 有穩定 DNS mysql-0.mysql-service，這條記錄是 CoreDNS 自動幫你建的，不用你設定。第三，每個 Pod 有自己的 PVC，重啟後還是同一個磁碟，資料不丟。

老實講，replicas 等於 1 的 MySQL 你用 Deployment 加手動 PVC 也能跑。那業界為什麼還是用 StatefulSet？三個理由：語意清楚，看到 StatefulSet 就知道是有狀態服務，維護的人不會亂動。未來擴充方便，換成有 replication 的架構時 StatefulSet 是標準基礎。面試標準答案，說「資料庫用 Deployment」會被電。

[▶ PPT 13/45：Operator 演進路線]`,
  },

  // ── [13/45] Operator 演進 ──
  {
    title: '[13/45] 現代生產環境：用 Operator',
    subtitle: 'MySQL Operator 這類 Operator 把維運邏輯包進去',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: mysql.oracle.com/v2
kind: InnoDBCluster
metadata:
  name: my-db
spec:
  instances: 3
  router:
    instances: 1
  secretName: my-db-secret`}</code></pre>

        <div className="bg-slate-800/40 border-l-4 border-green-500 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold mb-1">MySQL Operator for Kubernetes 幫你搞定</p>
          <p className="text-slate-400">自動選 Primary、Replica 同步、Primary 掛掉自動 Failover、Router 幫你做讀寫分離。你只要說「3 個實例、1 個 Router」，剩下它處理。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm text-center mb-3">演進路線</p>
          <div className="space-y-2 text-xs text-center">
            <div className="bg-red-900/30 border border-red-500/40 py-2 px-3 rounded">
              <p className="text-red-300 font-semibold">Deployment</p>
              <p className="text-slate-400">不適合，沒有身份保證</p>
            </div>
            <p className="text-cyan-400">↓</p>
            <div className="bg-cyan-900/30 border border-cyan-500/40 py-2 px-3 rounded">
              <p className="text-cyan-300 font-semibold">StatefulSet（這堂課教的）</p>
              <p className="text-slate-400">手動管，業界標準</p>
            </div>
            <p className="text-cyan-400">↓</p>
            <div className="bg-green-900/30 border border-green-500/40 py-2 px-3 rounded">
              <p className="text-green-300 font-semibold">Operator / MySQL Operator</p>
              <p className="text-slate-400">現代生產環境，全自動</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs text-amber-300">
          這堂課教 StatefulSet 是讓你理解底層原理。不懂 StatefulSet，連 Operator 在幹嘛都看不懂。
        </div>
      </div>
    ),
    notes: `但話說回來，現代生產環境其實更進一步，直接用 Operator。

例如 MySQL Operator for Kubernetes。你只要寫這麼短一段 YAML：kind InnoDBCluster、instances 3、router instances 1、secretName 指定密碼，它幫你把三個 MySQL 實例建起來組成 InnoDB Cluster，自動選一個當 Primary、其他當 Replica、資料同步、Primary 掛掉自動 Failover，Router 幫你做讀寫分離。

這就是 Operator 的威力。它把所有維運邏輯包進去，你用宣告式的方式描述「我要什麼」，Operator 負責「怎麼做」。

所以 MySQL 的演進路線是：Deployment 不適合，沒有身份保證。StatefulSet 是業界標準，要手動管理，這堂課教的就是這個。Operator 是現代生產環境的做法，全自動。

為什麼這堂課不直接教 Operator？因為不懂 StatefulSet，你連 Operator 在做什麼都看不懂。Operator 底下其實還是在用 StatefulSet 管 Pod，只是上層幫你做掉了所有決定。先懂底層，才看得懂抽象。

[▶ PPT 14/45：StatefulSet YAML]`,
  },

  // ── [14/45] StatefulSet YAML ──
  {
    title: '[14/45] MySQL StatefulSet YAML',
    subtitle: '03-mysql.yaml（第一部分）',
    section: '7-9 第一段：基礎層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: tasks
spec:
  serviceName: "mysql-service"   # ★ 對應 Headless Service
  replicas: 1
  selector:
    matchLabels: { app: mysql }
  template:
    metadata:
      labels: { app: mysql }
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports: [{ containerPort: 3306 }]
        env:
        - name: MYSQL_DATABASE
          valueFrom: { configMapKeyRef: { name: app-config, key: MYSQL_DATABASE } }
        - name: MYSQL_ROOT_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: mysql-password } }
        volumeMounts:
        - { name: mysql-storage, mountPath: /var/lib/mysql }
        readinessProbe:              # ★ 通過才算 Ready，migration Job 要等這個
          exec:
            command: ["sh", "-c", "mysqladmin ping -h 127.0.0.1 -uroot -p\\"$MYSQL_ROOT_PASSWORD\\""]
          initialDelaySeconds: 15
          periodSeconds: 5
  volumeClaimTemplates:              # ★ StatefulSet 特有
  - metadata: { name: mysql-storage }
    spec:
      accessModes: ["ReadWriteOnce"]   # ★ 同時只能一個 Node 掛載
      resources: { requests: { storage: 1Gi } }`}</code></pre>

        <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs overflow-x-auto"><code>{`kubectl apply -f 03-mysql.yaml
kubectl wait pod/mysql-0 -n tasks --for=condition=Ready --timeout=120s
kubectl exec -it mysql-0 -n tasks -- mysql -uroot -p"MyMysqlP@ssw0rd" -D taskdb`}</code></pre>
      </div>
    ),
    notes: `這份 YAML 稍微長一點，我挑關鍵的地方講。

serviceName: mysql-service，這個欄位很重要，它對應等下要建的 Headless Service，K8s 就是靠這個組出穩定 DNS 名稱。

env 區段我示範兩種注入：MYSQL_DATABASE 來自 ConfigMap，MYSQL_ROOT_PASSWORD 來自 Secret。valueFrom 讓你指定來源，不要把密碼寫死在 YAML 裡。

readinessProbe 用 exec 跑 mysqladmin ping 指令。Pod 起來不代表 DB 可以接連線，MySQL 還要十幾秒做初始化。這個 probe 通過才算 Ready，等一下 migration Job 會等這個。

volumeClaimTemplates 是 StatefulSet 獨有的。它是一個「模板」，每個 Pod 會自動建一個專屬的 PVC，名字叫 mysql-storage-mysql-0。重啟還是同一個磁碟，資料不丟。accessModes ReadWriteOnce 是單一 MySQL 的標準做法，同時只能一個 Node 掛載。

[▶ PPT 15/45：Headless Service]`,
  },

  // ── [15/45] Headless Service ──
  {
    title: '[15/45] Headless Service — StatefulSet 的搭檔',
    subtitle: 'clusterIP: None',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: v1
kind: Service
metadata:
  name: mysql-service
  namespace: tasks
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
  clusterIP: None   # ★ Headless，DNS 直接回 Pod IP`}</code></pre>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs space-y-2">
          <p className="text-slate-300">
            Headless Service 沒有虛擬 IP，DNS 直接回傳 Pod 真實 IP。
          </p>
          <p className="text-slate-300">
            讓你可以用穩定名稱定址到特定 Pod，StatefulSet 標準做法。
          </p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">對比：一般 ClusterIP Service</p>
          <p className="text-slate-400">
            一般 Service 有虛擬 IP，DNS 回傳那個虛擬 IP，流量由 kube-proxy 分散。Headless 沒虛擬 IP，DNS 直接告訴你所有 Pod 的 IP，你要連哪個自己挑。
          </p>
        </div>
      </div>
    ),
    notes: `MySQL 的 Service 比較特別，用 Headless Service。關鍵一行就是 clusterIP: None。

一般 Service 會有一個虛擬 IP，DNS 解析回傳那個虛擬 IP，kube-proxy 負責把流量分散到後面的 Pod。

Headless 就是沒有虛擬 IP，DNS 直接告訴你「背後所有 Pod 的真實 IP」。這讓你可以用穩定名稱去定址到特定 Pod，而不是讓 kube-proxy 隨便轉。

StatefulSet 就是要搭 Headless Service 用，這是標準做法。

[▶ PPT 16/45：Pod DNS 命名]`,
  },

  // ── [16/45] Pod DNS 命名 ──
  {
    title: '[16/45] Pod DNS 命名規則',
    subtitle: 'K8s 自動建 DNS，不需要你寫任何設定',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/40">
          <p className="text-cyan-300 font-semibold mb-2 text-sm text-center">自動建立的 DNS</p>
          <pre className="text-slate-100 text-sm text-center"><code>mysql-0.mysql-service.tasks.svc.cluster.local</code></pre>
          <p className="text-slate-500 text-xs text-center mt-2">Pod 名稱.Service 名稱.Namespace.svc.cluster.local</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">為什麼是 mysql-0？</p>
          <p className="text-slate-400">
            StatefulSet Pod 命名固定是「StatefulSet 名稱-序號」：第一個叫 mysql-0，第二個 mysql-1，以此類推。重啟後名字不變。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-semibold">StatefulSet</p>
            <p className="text-slate-300 font-mono mt-1">mysql-0</p>
            <p className="text-slate-500 mt-1">固定身份</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-red-300 font-semibold">Deployment</p>
            <p className="text-slate-300 font-mono mt-1">backend-7c8b85c4ff-w7rxm</p>
            <p className="text-slate-500 mt-1">隨機名，每次重啟換</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs text-amber-300">
          StatefulSet Pod 有固定身份，Deployment Pod 是無名氏——這就是資料庫要用 StatefulSet 的根本原因
        </div>
      </div>
    ),
    notes: `K8s 自動幫你建 DNS，不需要你寫任何設定。

只要 StatefulSet 設了 serviceName: mysql-service，CoreDNS 就自動建這條記錄：mysql-0.mysql-service.tasks.svc.cluster.local。

格式是：Pod 名稱.Service 名稱.Namespace.svc.cluster.local。

為什麼是 mysql-0 這個名字？因為 StatefulSet 的 Pod 命名規則固定：StatefulSet 名稱加序號。第一個是 mysql-0，第二個 mysql-1。重啟後名字不變。

對比一下 Deployment。Deployment 的 Pod 名稱長這樣：backend-7c8b85c4ff-w7rxm。後面那串是隨機生成的，每次重啟都換一個新的。

StatefulSet 的 Pod 有固定身份，Deployment 的 Pod 是無名氏。這就是為什麼資料庫要用 StatefulSet——名字固定，DNS 才能穩定定址。

apply 一下跑起來，等 mysql-0 READY 1/1，記得 readinessProbe 通過才算真的好。你可以用 kubectl wait 指令等它：kubectl wait pod/mysql-0 --for=condition=Ready。確認進得去資料庫：kubectl exec -it mysql-0 -n tasks -- mysql -uroot -p"MyMysqlP@ssw0rd" -D taskdb。

[▶ PPT 17/45：基礎層 checklist]`,
  },

  // ── [17/45] 基礎層 checklist ──
  {
    title: '[17/45] 基礎層告一段落 — 來對一遍',
    subtitle: '六項都綠才繼續往下',
    section: '7-9 第一段：基礎層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-amber-300">
                <th className="border border-slate-700 p-2 text-left">指令</th>
                <th className="border border-slate-700 p-2 text-left">看什麼</th>
                <th className="border border-slate-700 p-2 text-left">期待</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr><td className="border border-slate-700 p-2 font-mono">kubectl get namespace tasks</td><td className="border border-slate-700 p-2">STATUS</td><td className="border border-slate-700 p-2 text-green-300">Active</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">kubectl get secret app-secrets -n tasks</td><td className="border border-slate-700 p-2">DATA</td><td className="border border-slate-700 p-2 text-green-300">3</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">kubectl get configmap app-config -n tasks</td><td className="border border-slate-700 p-2">DATA</td><td className="border border-slate-700 p-2 text-green-300">6</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">kubectl get statefulset -n tasks</td><td className="border border-slate-700 p-2">READY</td><td className="border border-slate-700 p-2 text-green-300">1/1</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">kubectl get pvc -n tasks</td><td className="border border-slate-700 p-2">STATUS</td><td className="border border-slate-700 p-2 text-green-300">Bound</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">kubectl get pods -n tasks</td><td className="border border-slate-700 p-2">mysql-0</td><td className="border border-slate-700 p-2 text-green-300">Running 1/1</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/40 border border-cyan-500/40 p-3 rounded-lg text-slate-300 text-sm text-center">
          都綠就繼續；有一項沒綠，先停一下查一下，通常幾秒就好
        </div>
      </div>
    ),
    notes: `基礎層四個組件都跑完了，來對一下。

我自己寫完會回頭看一遍，六個指令一次打完：Namespace 是 Active、Secret DATA 是 3、ConfigMap DATA 是 6（MYSQL/REDIS 各三個 key 加一個 API_URL）、StatefulSet READY 1/1、PVC Bound、mysql-0 Running 1/1。

都綠就繼續。如果有一項沒綠，先停一下看一下——像 PVC 卡 Pending，通常就是 StorageClass 沒設，k3s 有內建 local-path 一般沒事；mysql-0 沒起來就 describe 看 Events、看 logs，幾秒就知道怎麼回事。

OK，基礎層過了，接資料層。

[▶ PPT 18/45：第二段過場]`,
  },

  // ============================================================
  // 第二段 資料層 04~07（10 張）
  // ============================================================

  // ── [18/45] 第二段過場 ──
  {
    title: '[18/45] 第二段：資料層（04~07）',
    subtitle: 'Redis → Job → RBAC → Backend',
    section: '7-9 第二段：資料層',
    duration: '1',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-red-900/40 to-amber-900/40 border border-red-500/50 p-6 rounded-lg text-center">
          <p className="text-red-300 text-xl font-semibold mb-2">第二段：資料層</p>
          <p className="text-slate-300 text-sm">Queue、Migration、權限、API</p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-red-400 font-mono">04</p>
            <p className="text-slate-300 mt-1">Redis</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-red-400 font-mono">05</p>
            <p className="text-slate-300 mt-1">Job</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-red-400 font-mono">06</p>
            <p className="text-slate-300 mt-1">RBAC</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-red-400 font-mono">07</p>
            <p className="text-slate-300 mt-1">Backend</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-lg text-sm text-amber-300 text-center">
          順序：Redis 起來 → Job 跑 migration 建表 → RBAC 給權限 → Backend 上線
        </div>
      </div>
    ),
    notes: `第二段：資料層。四個組件：Redis Queue、DB migration Job、Backend 的 RBAC、還有 Backend 本身。

順序是有意義的。Redis 獨立跑，先起來。Job 跑 migration，要 MySQL 已經 Ready——所以第一段的 mysql 要先好。RBAC 幫 Backend 準備身份。最後 Backend 上線，依賴 Redis、MySQL、RBAC 全部就緒。

[▶ PPT 19/45：Redis Deployment]`,
  },

  // ── [19/45] Redis Deployment YAML ──
  {
    title: '[19/45] Redis — 為什麼用 Deployment',
    subtitle: '資料重啟能不能自動重建',
    section: '7-9 第二段：資料層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold">判斷原則</p>
          <p className="text-slate-300 mt-1">這份資料重啟後能不能自動重建？能就 Deployment，不能就 StatefulSet。</p>
          <p className="text-slate-400 mt-1">Redis 在這裡只是暫存佇列，Pod 重啟資料消失、CronJob 下次觸發會重新入隊，可以接受。</p>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: apps/v1
kind: Deployment
metadata: { name: redis, namespace: tasks }
spec:
  replicas: 1
  selector: { matchLabels: { app: redis } }
  template:
    metadata: { labels: { app: redis } }
    spec:
      containers:
      - name: redis
        image: redis:7
        # ★ exec form 不走 shell，用 /bin/sh -c 才能做 $REDIS_PASSWORD 替換
        command: ["/bin/sh", "-c", "redis-server --requirepass $REDIS_PASSWORD"]
        env:
        - name: REDIS_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: redis-password } }
        ports: [{ containerPort: 6379 }]
---
apiVersion: v1
kind: Service
metadata: { name: redis-service, namespace: tasks }
spec:
  selector: { app: redis }
  ports: [{ port: 6379, targetPort: 6379 }]`}</code></pre>

        <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs overflow-x-auto"><code>{`kubectl apply -f 04-redis.yaml
kubectl get pods -n tasks -l app=redis
kubectl exec deploy/redis -n tasks -- redis-cli -a MyRedisP@ssw0rd ping`}</code></pre>
      </div>
    ),
    notes: `Redis 這裡最關鍵的判斷：為什麼不用 StatefulSet？

判斷原則講過了，資料重啟後能不能自動重建？能就 Deployment。

Redis 在這套系統只是 Queue，暫存使用者任務。Pod 重啟資料消失，但 CronJob 每分鐘會把到期任務重新撈出來入隊。資料可以重建，用 Deployment 就好。

YAML 有個小陷阱：command 用 exec form（陣列那種寫法）不會走 shell，你在裡面寫 $REDIS_PASSWORD 不會被替換。所以我用 /bin/sh -c 包一層，把整個 redis-server 指令當字串丟進去，shell 才會做環境變數替換。

env 從 Secret 取 redis-password。Service 用一般 ClusterIP 就好，不需要 Headless，因為 Redis 是 replicas 1、沒有穩定身份需求。

[▶ PPT 20/45：Service 三種類型]`,
  },

  // ── [20/45] Service 三類型 ──
  {
    title: '[20/45] Service 三種類型怎麼選',
    subtitle: '這套系統為什麼選 ClusterIP + Ingress',
    section: '7-9 第二段：資料層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-cyan-300">
                <th className="border border-slate-700 p-2 text-left">類型</th>
                <th className="border border-slate-700 p-2 text-left">特性</th>
                <th className="border border-slate-700 p-2 text-left">適合場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr><td className="border border-slate-700 p-2 font-mono text-green-400">ClusterIP（預設）</td><td className="border border-slate-700 p-2">只在叢集內部可存取，有虛擬 IP</td><td className="border border-slate-700 p-2">內部服務互連（Redis、Backend）</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-purple-400">Headless（clusterIP: None）</td><td className="border border-slate-700 p-2">沒有虛擬 IP，DNS 直接回 Pod IP</td><td className="border border-slate-700 p-2">StatefulSet（MySQL）</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono text-amber-400">NodePort</td><td className="border border-slate-700 p-2">Node IP + 30000+ port 對外</td><td className="border border-slate-700 p-2">測試環境</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono text-red-400">LoadBalancer</td><td className="border border-slate-700 p-2">雲端 Load Balancer 給公開 IP</td><td className="border border-slate-700 p-2">雲端生產環境</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">這套系統：對外用 Ingress，不用 NodePort</p>
          <p className="text-slate-400">
            Ingress 統一入口、域名路由、SSL 都集中在一個地方，比 NodePort 乾淨。
          </p>
        </div>
      </div>
    ),
    notes: `趁這裡整理一下 Service 三種類型怎麼選。

ClusterIP 是預設，只在叢集內部可存取。內部服務互連用這個。

NodePort 會把 port 開在每個 Node 的 30000~32767 範圍，從叢集外面打 Node IP 加那個 port 就進得來。測試環境還可以，生產環境不建議，port 難管、沒域名、沒 SSL。

LoadBalancer 是在雲端環境用的，會叫 AWS ELB、GCP Load Balancer 這類服務幫你分一個公開 IP。自架的 k3s 沒這東西。

這套系統對外用 Ingress，不用 NodePort。為什麼？Ingress 統一入口、支援域名路由、SSL 憑證也集中在這裡管。一個域名、多個路徑、後面接不同 Service。

apply Redis，看到 redis-xxxxx Pod Running 就繼續。Redis 是 Deployment、不需要 PVC，啟動比 mysql 快很多。

[▶ PPT 21/45：Job YAML]`,
  },

  // ── [21/45] Job YAML ──
  {
    title: '[21/45] Job — 一次性 DB Migration',
    subtitle: '為什麼不用 Deployment',
    section: '7-9 第二段：資料層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold">為什麼不用 Deployment</p>
          <p className="text-slate-300 mt-1">
            Deployment 讓 Pod 一直存活，migration 跑完程序退出，Deployment 看到 Pod 死就一直重啟。Job 是為跑完就結束的任務設計的。
          </p>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: batch/v1
kind: Job
metadata: { name: db-migrate, namespace: tasks }
spec:
  template:
    spec:
      restartPolicy: Never   # ★ Pod 失敗不重啟舊 Pod，Job 另建新 Pod 重試
      containers:
      - name: migrate
        image: yanchen184/task-api:v1
        command: ["node", "migrate.js"]   # ★ 只跑一次就結束
        env:
        - name: MYSQL_HOST
          valueFrom: { configMapKeyRef: { name: app-config, key: MYSQL_HOST } }
        - name: MYSQL_DATABASE
          valueFrom: { configMapKeyRef: { name: app-config, key: MYSQL_DATABASE } }
        - name: MYSQL_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: mysql-password } }
  backoffLimit: 3   # ★ 最多重試三次`}</code></pre>
      </div>
    ),
    notes: `Job 的第一個問題：為什麼不用 Deployment？

Deployment 的設計是讓 Pod 一直保持存活，Pod 死了就拉起來。Migration 的程序跑完就退出，Deployment 看到 Pod 死就一直重啟，永遠跑不完。

Job 就是為「跑完就結束的任務」設計的。Pod 結束不重啟，只記錄成功或失敗。

關鍵三個欄位：
restartPolicy Never：Pod 失敗不在原地重啟這個 Pod，Job 另外建一個新 Pod 重試，舊的留著方便看 log。
command: node migrate.js，只跑這一次。
backoffLimit: 3，最多重試三次，超過就標記 Job 失敗，不會無限重試。

image 用 yanchen184/task-api:v1，這個 image 裡面同時有 API 伺服器跟 migrate.js，靠 command 決定跑哪個。

[▶ PPT 22/45：Job 驗證]`,
  },

  // ── [22/45] Job 說明與驗證 ──
  {
    title: '[22/45] Job 驗證與 log',
    subtitle: 'COMPLETIONS 1/1 才算成功',
    section: '7-9 第二段：資料層',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1 text-sm">指令</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs"><code>{`kubectl apply -f 05-db-migrate-job.yaml
kubectl get job -n tasks
kubectl logs job/db-migrate -n tasks`}</code></pre>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold mb-1">成功的 log</p>
          <pre className="text-slate-300"><code>{`Connected to MySQL
Migration complete: tasks table ready`}</code></pre>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded text-xs">
          <p className="text-red-300 font-semibold mb-1">常見錯誤</p>
          <ul className="text-slate-400 space-y-1 list-disc list-inside">
            <li>MYSQL_HOST 沒對到 mysql-service</li>
            <li>mysql-password 拼錯</li>
            <li>mysql-0 還沒 Ready（要先做完第一段巡堂）</li>
          </ul>
        </div>
      </div>
    ),
    notes: `apply 下去，看 get job。COMPLETIONS 欄位從 0/1 變成 1/1 才算成功。

前面第一段巡堂已經確認 mysql-0 Ready，所以這時候 apply Job，migrate.js 可以直接連上 mysql-service。萬一短暫連不到，backoffLimit 3 會自動重試最多三次，通常幾秒內就會變綠。

看 log：kubectl logs job/db-migrate -n tasks。成功訊息是 Connected to MySQL、Migration complete: tasks table ready。

如果看到 Error：檢查 ConfigMap 的 MYSQL_HOST 是不是對應 mysql-service，Secret 的 mysql-password 有沒有拼錯。還有最重要的，mysql-0 要真的 Ready，第一段巡堂表沒過就不要來這裡。

[▶ PPT 23/45：RBAC YAML]`,
  },

  // ── [23/45] RBAC YAML ──
  {
    title: '[23/45] RBAC — Backend 最小權限',
    subtitle: '只給 get/list configmaps',
    section: '7-9 第二段：資料層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-slate-300">
            Backend API 需要在執行時讀取 ConfigMap（取得 DB 連線資訊）。這個 SA 就是給 Backend Pod 用的身份，限制它只能讀 ConfigMap，其他什麼都不能做。
          </p>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: v1
kind: ServiceAccount
metadata: { name: backend-sa, namespace: tasks }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: backend-role, namespace: tasks }
rules:
- apiGroups: [""]             # ★ 空字串 = core group
  resources: ["configmaps"]
  verbs: ["get", "list"]      # ★ 只允許讀
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: backend-rolebinding, namespace: tasks }
subjects:
- kind: ServiceAccount
  name: backend-sa
  namespace: tasks
roleRef:
  kind: Role
  name: backend-role           # ★ 名字要跟 Role.metadata.name 完全一致
  apiGroup: rbac.authorization.k8s.io`}</code></pre>
      </div>
    ),
    notes: `RBAC 三件套：ServiceAccount、Role、RoleBinding。

ServiceAccount 是 Pod 用的身份。就像 Pod 的身分證，K8s 看到這個 Pod 打 API 過來，會看它是用哪個 SA。

Role 定義權限。apiGroups 空字串代表 core group，ConfigMap、Pod、Service 這些最核心的資源都在這裡。resources: configmaps，verbs: get、list——只允許讀，不給寫入或刪除。

RoleBinding 把 SA 綁到 Role。subjects 是「誰」，roleRef 是「給什麼權限」。roleRef.name 要跟上面 Role 的 metadata.name 完全一致，拼錯不會報錯但權限不會生效，這是 RBAC 最坑的地方。

[▶ PPT 24/45：RBAC 驗證]`,
  },

  // ── [24/45] RBAC 驗證 ──
  {
    title: '[24/45] RBAC 套用與驗證',
    subtitle: 'apply 輸出三行',
    section: '7-9 第二段：資料層',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs"><code>{`kubectl apply -f 06-rbac.yaml`}</code></pre>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold mb-1">三行輸出</p>
          <ul className="text-slate-300 space-y-1 font-mono">
            <li>serviceaccount/backend-sa created</li>
            <li>role.rbac.authorization.k8s.io/backend-role created</li>
            <li>rolebinding.rbac.authorization.k8s.io/backend-rolebinding created</li>
          </ul>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">之後要在 Backend Deployment 裡引用</p>
          <p className="text-slate-400 font-mono">spec.template.spec.serviceAccountName: backend-sa</p>
        </div>
      </div>
    ),
    notes: `apply，三行輸出：SA、Role、RoleBinding 各 created 一次。

注意這三個資源全部在 tasks namespace，是 namespace 等級的權限。如果你要給 cluster 等級的權限，要用 ClusterRole + ClusterRoleBinding，這堂課不需要。

RBAC 建好之後，等一下的 Backend Deployment 會在 spec.template.spec.serviceAccountName 欄位引用 backend-sa，Pod 才會拿到這個身份。

[▶ PPT 25/45：Backend Deployment YAML]`,
  },

  // ── [25/45] Backend YAML ──
  {
    title: '[25/45] Backend API — Deployment + Service',
    subtitle: '07-backend.yaml',
    section: '7-9 第二段：資料層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: apps/v1
kind: Deployment
metadata: { name: backend, namespace: tasks }
spec:
  replicas: 2
  selector: { matchLabels: { app: backend } }
  template:
    metadata: { labels: { app: backend } }
    spec:
      serviceAccountName: backend-sa   # ★ Pod 用這個身份
      containers:
      - name: backend
        image: yanchen184/task-api:v1
        ports: [{ containerPort: 3000 }]
        envFrom:
        - configMapRef: { name: app-config }   # ★ 整包 ConfigMap 一次注入
        env:
        - name: MYSQL_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: mysql-password } }
        - name: REDIS_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: redis-password } }
        - name: JWT_SECRET
          valueFrom: { secretKeyRef: { name: app-secrets, key: jwt-secret } }
        resources:
          requests: { cpu: "100m", memory: "128Mi" }   # ★ HPA 的分母
          limits:   { cpu: "500m", memory: "256Mi" }
        readinessProbe:
          httpGet: { path: /health, port: 3000 }        # ★ /health 200 才接流量
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata: { name: backend-service, namespace: tasks }
spec:
  selector: { app: backend }
  ports: [{ port: 3000, targetPort: 3000 }]`}</code></pre>
      </div>
    ),
    notes: `Backend 這份 YAML 集大成，把前面學的都用上了。

serviceAccountName: backend-sa，引用剛建的 SA，Pod 有讀 ConfigMap 的權限。沒設這行的話會用 default SA，通常沒有任何權限。

envFrom configMapRef：整包 ConfigMap 一次注入成環境變數。一行寫完，裡面 7 個 key 全部變成環境變數。

下面 env 區段三個 Secret 一條條明確列出。**為什麼 Secret 不用 envFrom？** 下一頁細講。

resources 設 requests 和 limits，requests cpu 100m 特別重要，這是 HPA 計算百分比的分母。

readinessProbe 打 /health，回 200 才加進 Service 後端列表。

[▶ PPT 26/45：Backend 四個重點]`,
  },

  // ── [26/45] Backend 四個重點 ──
  {
    title: '[26/45] Backend 四個重點',
    subtitle: 'SA、envFrom、resources、readinessProbe',
    section: '7-9 第二段：資料層',
    duration: '2',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold">1. serviceAccountName: backend-sa</p>
          <p className="text-slate-400 mt-1">Pod 有讀 ConfigMap 的權限。沒設會用 default SA（通常無權限）。</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold">2. envFrom configMapRef — 一次整包注入</p>
          <p className="text-slate-400 mt-1">把 ConfigMap 所有 key 設成環境變數。</p>
          <p className="text-amber-300 mt-1">Secret 不建議用 envFrom，改用 env.valueFrom.secretKeyRef 一條條明確列，只讓容器看到需要的欄位。</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold">3. resources.requests.cpu: 100m</p>
          <p className="text-slate-400 mt-1">HPA 的前提。沒設 HPA 算不出百分比，TARGETS 會是 unknown。</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded">
          <p className="text-cyan-300 font-semibold">4. readinessProbe /health</p>
          <p className="text-slate-400 mt-1">Pod Running 不等於可以接流量。/health 回 200，K8s 才把 Pod 加進 Service 後端列表。</p>
        </div>
      </div>
    ),
    notes: `前面 YAML 裡面標的四個星號，一個一個講。

第一個，serviceAccountName: backend-sa。Pod 用這個身份跟 API Server 講話。沒設的話是 default SA，通常沒任何權限，Pod 裡面程式打 K8s API 會被拒。

第二個，envFrom vs env。envFrom configMapRef 把整包 ConfigMap 一次注入，方便。但 Secret 不建議這樣做，為什麼？你想想，Secret 裡面可能有 10 個欄位，Backend 只需要 3 個，你整包注入等於所有欄位都變成容器的環境變數。萬一有人 exec 進去打 env，什麼秘密都看光了。用 env.valueFrom.secretKeyRef 一條條明確列，這個容器只看得到它需要的那幾個，最小暴露。

第三個，resources.requests.cpu 100m。這是 HPA 的分母。HPA 計算 CPU 百分比是「實際用量 / requests」，沒 requests 就算不出來。等下看 HPA TARGETS 如果是 unknown，九成是這裡忘記設。

第四個，readinessProbe。Pod Running 不代表能接流量，程式可能還在初始化、連 DB、load cache。readinessProbe 打 /health 回 200，K8s 才把這個 Pod 加進 Service 的後端。沒設的話一 Running 就接流量，可能打到還沒 ready 的 Pod。

[▶ PPT 27/45：Backend 驗證]`,
  },

  // ── [27/45] Backend 驗證 ──
  {
    title: '[27/45] Backend 驗證 /health',
    subtitle: 'port-forward + curl',
    section: '7-9 第二段：資料層',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <p className="text-cyan-400 font-semibold mb-1">部署</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded"><code>{`kubectl apply -f 07-backend.yaml
kubectl get pods -n tasks -l app=backend`}</code></pre>
          <p className="text-slate-400 mt-2">等兩個 backend Pod 都 READY 1/1（readinessProbe /health 通過才算好）</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <p className="text-cyan-400 font-semibold mb-1">快速驗證</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded"><code>{`# 終端 A
kubectl port-forward service/backend-service 3000:3000 -n tasks

# 終端 B
curl http://localhost:3000/health
# => {"status":"ok"}`}</code></pre>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          驗證完 Ctrl+C 停掉 port-forward
        </div>
      </div>
    ),
    notes: `apply 之後等兩個 backend Pod READY 1/1。readinessProbe 通過才算好，大概 5 到 15 秒。

怎麼驗證真的有起來？不用等 Ingress，先用 port-forward。

kubectl port-forward service/backend-service 3000:3000，把叢集裡的 3000 port 轉到你本機的 3000。另一個終端打 curl localhost:3000/health，回 {"status":"ok"} 代表 Backend 活著、能接流量。

驗證完 Ctrl+C 停掉 port-forward。port-forward 只是暫時的工具，真正對外還是要靠等一下的 Ingress。

[▶ PPT 28/45：資料層 checklist]`,
  },

  // ── [28/45] 資料層 checklist ──
  {
    title: '[28/45] 資料層告一段落 — 來對一遍',
    subtitle: '七項都綠才繼續往下',
    section: '7-9 第二段：資料層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-amber-300">
                <th className="border border-slate-700 p-2 text-left">指令</th>
                <th className="border border-slate-700 p-2 text-left">期待</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr><td className="border border-slate-700 p-2 font-mono">get pods</td><td className="border border-slate-700 p-2">redis Running 1/1；backend x2 Running 1/1</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">get job</td><td className="border border-slate-700 p-2">db-migrate COMPLETIONS 1/1</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">logs job/db-migrate</td><td className="border border-slate-700 p-2">Migration complete: tasks table ready</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">get sa,role,rolebinding</td><td className="border border-slate-700 p-2">backend-sa / backend-role / backend-rolebinding</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">can-i get configmaps --as=system:serviceaccount:tasks:backend-sa</td><td className="border border-slate-700 p-2 text-green-300">yes</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">can-i delete pods --as=system:serviceaccount:tasks:backend-sa</td><td className="border border-slate-700 p-2 text-red-300">no</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">curl /health</td><td className="border border-slate-700 p-2">{`{"status":"ok"}`}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/40 border border-cyan-500/40 p-3 rounded text-slate-300 text-sm text-center">
          都綠就繼續；有一項沒綠，先停一下查一下，通常幾秒就好
        </div>
      </div>
    ),
    notes: `資料層四個組件也跑完了，一樣回頭對一下。

七個指令一次打完。前面幾個就是看狀態——Redis、Backend Pod 都 Running、Job 跑過一次、三個 RBAC 資源都在。

我覺得最有趣的是兩個 can-i，一定要加 --as=system:serviceaccount:tasks:backend-sa 偽裝成那個 SA 來測——不加就是測你自己的 admin 身分，兩個都會回 yes，看不出 RBAC 有沒有生效。加了之後 get configmaps 回 yes、delete pods 回 no，這兩個一起過，就知道 RBAC 真的有在擋，而且剛好只開該開的——這才是最小權限原則。

最後 curl /health 回 ok，代表 Backend 真的活著、能處理請求。

都綠就繼續。有一項沒綠先停一下查一下，通常幾秒就好。

[▶ PPT 29/45：第三段過場]`,
  },

  // ============================================================
  // 第三段 應用層 08~12（13 張）
  // ============================================================

  // ── [29/45] 第三段過場 ──
  {
    title: '[29/45] 第三段：應用層（08~12）',
    subtitle: 'Frontend → Task Runner → CronJob → Ingress → HPA',
    section: '7-9 第三段：應用層',
    duration: '1',
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/50 p-6 rounded-lg text-center">
          <p className="text-green-300 text-xl font-semibold mb-2">第三段：應用層</p>
          <p className="text-slate-300 text-sm">使用者看得到的 / 跑背景的 / 對外的 / 自動擴縮的</p>
        </div>

        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-green-400 font-mono">08</p>
            <p className="text-slate-300 mt-1">Frontend</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-green-400 font-mono">09</p>
            <p className="text-slate-300 mt-1">Task Runner</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-green-400 font-mono">10</p>
            <p className="text-slate-300 mt-1">CronJob</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-green-400 font-mono">12</p>
            <p className="text-slate-300 mt-1">Ingress</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded text-center">
            <p className="text-green-400 font-mono">11</p>
            <p className="text-slate-300 mt-1">HPA</p>
          </div>
        </div>
      </div>
    ),
    notes: `最後一段：應用層。五個組件：Frontend、Task Runner、CronJob、Ingress、HPA。

Frontend 是使用者看得到的網頁。Task Runner 在背景跑任務。CronJob 定時觸發。Ingress 對外路由。HPA 自動擴縮。

跑完這一段，整套系統就通了。

[▶ PPT 30/45：Frontend]`,
  },

  // ── [30/45] Frontend ──
  {
    title: '[30/45] Frontend — Deployment + Service',
    subtitle: '08-frontend.yaml',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: apps/v1
kind: Deployment
metadata: { name: frontend, namespace: tasks }
spec:
  replicas: 2       # ★ 兩副本，避免單點故障
  selector: { matchLabels: { app: frontend } }
  template:
    metadata: { labels: { app: frontend } }
    spec:
      containers:
      - name: frontend
        image: yanchen184/task-frontend:v1
        ports: [{ containerPort: 80 }]
        env:
        - name: REACT_APP_API_URL
          value: "http://task.example.com/api"
        resources:
          requests: { cpu: "50m", memory: "64Mi" }
---
apiVersion: v1
kind: Service
metadata: { name: frontend-service, namespace: tasks }
spec:
  selector: { app: frontend }
  ports: [{ port: 80, targetPort: 80 }]`}</code></pre>

        <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs overflow-x-auto"><code>{`kubectl apply -f 08-frontend.yaml
kubectl get pods -n tasks -l app=frontend`}</code></pre>
      </div>
    ),
    notes: `Frontend 最單純，就是一個純前端。

replicas: 2，兩個副本避免單點故障。一個 Pod 掛了另一個繼續服務。

image 是我打包好的 React 靜態資源，裡面跑 nginx 提供靜態檔案。

REACT_APP_API_URL 是編譯期決定的，實際上在這裡設只是記錄用，因為 React build 完這個變數已經編進去 bundle 了。production 的話要 build 時就設好。

apply 下去就好，沒有什麼特別的。

[▶ PPT 31/45：Task Runner 為什麼沒 Service]`,
  },

  // ── [31/45] Task Runner 用 Deployment ──
  {
    title: '[31/45] Task Runner 用 Deployment 就好 — 兩個判斷',
    subtitle: '沒人要連它、跟 Node 數量無關',
    section: '7-9 第三段：應用層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">🧠 判斷 1：要不要 Service？→ 有沒有人要連你</p>
          <div className="bg-slate-800/50 p-3 rounded mt-2 space-y-2">
            <div className="flex items-center gap-2 justify-center">
              <span className="bg-blue-900/40 px-3 py-1 rounded">Frontend</span>
              <span className="text-cyan-400">→</span>
              <span className="bg-cyan-900/40 px-3 py-1 rounded">Backend Service</span>
              <span className="text-green-400">✓ 有人連 → 要 Service</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="bg-purple-900/40 px-3 py-1 rounded">Task Runner</span>
              <span className="text-cyan-400">→</span>
              <span className="bg-red-900/40 px-3 py-1 rounded">Redis Service</span>
              <span className="text-amber-400">✗ 自己去拉 → 不需要</span>
            </div>
          </div>
          <p className="text-slate-300 mt-2">Service 的作用是讓別人連進來。Task Runner 主動去 Redis 拉任務，沒人要連它。</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">🧠 判斷 2：要不要 DaemonSet？→ 跟 Node 數量有沒有關</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-800/50 p-2 rounded">
              <p className="text-amber-300 font-semibold">DaemonSet 場景</p>
              <p className="text-slate-300">日誌 Agent / node-exporter / kube-proxy — 每台 Node 都要一份</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded">
              <p className="text-green-300 font-semibold">Task Runner</p>
              <p className="text-slate-300">消費 Queue，3 Node 不用 3 個、100 Node 也不用 100 個</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-green-500 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold">結論：Deployment + 沒有 Service</p>
          <p className="text-slate-400 mt-1">副本數跟 Queue 長度有關，不是 Node 數。要調整就 scale，自由度最高。</p>
        </div>
      </div>
    ),
    notes: `Task Runner 跟前面組件不太一樣，有兩個地方要判斷：要不要 Service？要不要用 DaemonSet？這兩個問題其實都有很乾淨的判斷原則，講完之後你以後遇到任何 worker 類的服務都能直接套。

第一個問題：要不要 Service？答案回到 Service 的本質——Service 是「讓別人連進來」的入口。Frontend 要連 Backend，所以 Backend 有 Service；Backend 要連 Redis，所以 Redis 有 Service。Task Runner 呢？它不是被動等人連，是主動去 Redis Queue 拉任務。方向是反的，沒人要連它。沒人連你，Service 就沒必要。

這個觀念很重要：Service 不是「所有 Pod 都要配一個」，是「有人要連你的時候才配」。

第二個問題：要不要用 DaemonSet？DaemonSet 的定義是「每個 Node 一份」。什麼時候需要這個？日誌收集 agent，每台 Node 要收自己本機的 log；node-exporter，每台 Node 要暴露自己的指標；kube-proxy，每台 Node 要管自己的 iptables。共同點是——跟 Node 綁定。

Task Runner 跟 Node 有關嗎？沒有。它消費 Queue，Queue 長副本就多、Queue 短副本就少。3 個 Node 不代表要 3 個 Runner，擴到 100 Node 也不該有 100 個 Runner。跟 Node 數量無關 → 用 Deployment。

兩個判斷合起來：Task Runner = Deployment + 沒有 Service。副本數自己決定，跟 Queue 長度掛鉤，這個設計自由度最高。

[▶ PPT 32/45：Task Runner YAML]`,
  },

  // ── [32/45] Task Runner YAML ──
  {
    title: '[32/45] Task Runner — Deployment YAML',
    subtitle: '09-task-runner.yaml',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: apps/v1
kind: Deployment
metadata: { name: task-runner, namespace: tasks }
spec:
  replicas: 3       # ★ 跟業務量有關，跟 Node 數量無關
  selector: { matchLabels: { app: task-runner } }
  template:
    metadata: { labels: { app: task-runner } }
    spec:
      containers:
      - name: task-runner
        image: yanchen184/task-runner:v1
        command: ["node", "task-runner.js"]
        envFrom:
        - configMapRef: { name: app-config }
        env:
        - name: MYSQL_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: mysql-password } }
        - name: REDIS_PASSWORD
          valueFrom: { secretKeyRef: { name: app-secrets, key: redis-password } }
        resources:
          requests: { cpu: "200m", memory: "256Mi" }
          limits:   { cpu: "1000m", memory: "512Mi" }`}</code></pre>

        <div className="bg-slate-800/40 border-l-4 border-green-500 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold">三副本同時拉 Queue，會不會重複？</p>
          <p className="text-slate-400 mt-1">
            不會。Redis BLPOP 是原子操作，同一個任務只會被一個 Task Runner 拿走。
          </p>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs overflow-x-auto"><code>{`kubectl apply -f 09-task-runner.yaml
kubectl get pods -n tasks -l app=task-runner`}</code></pre>
      </div>
    ),
    notes: `Task Runner 的 YAML，長得跟一般 Deployment 差不多。

幾個重點：replicas 3，這個 3 是跟業務量有關，不是跟 Node 數量有關。你預估同時要處理多少任務，就開幾個 worker。

command: node task-runner.js，這個 image 跟 Backend 是不同的 image（task-runner:v1），跑的也是不同程式。

envFrom 一樣整包 ConfigMap，env 兩個密碼從 Secret 取。沒有 serviceAccountName，因為 Task Runner 不需要讀 K8s API，沒需求就不給權限，最小原則。

三個 Task Runner 同時從 Redis Queue 拉任務會不會重複？不會。Redis 的 BLPOP 是原子操作，同一個任務只會被一個 worker 拿走，K8s 層面完全不用處理。

apply，看到三個 task-runner Pod 全部 Running。

[▶ PPT 33/45：CronJob YAML]`,
  },

  // ── [33/45] CronJob YAML ──
  {
    title: '[33/45] CronJob — 定時排程觸發',
    subtitle: '10-cronjob.yaml',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: batch/v1
kind: CronJob
metadata: { name: task-scheduler, namespace: tasks }
spec:
  schedule: "* * * * *"            # ★ 每分鐘觸發
  concurrencyPolicy: Forbid        # ★ 上一個沒跑完就跳過
  successfulJobsHistoryLimit: 3    # ★ 保留 3 次成功記錄
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure  # ★ 失敗原地重試
          containers:
          - name: scheduler
            image: yanchen184/task-scheduler:v1
            command: ["node", "enqueue-due-tasks.js"]
            envFrom:
            - configMapRef: { name: app-config }
            env:
            - name: MYSQL_PASSWORD
              valueFrom: { secretKeyRef: { name: app-secrets, key: mysql-password } }
            - name: REDIS_PASSWORD
              valueFrom: { secretKeyRef: { name: app-secrets, key: redis-password } }`}</code></pre>
      </div>
    ),
    notes: `CronJob 長得像 Job 多包一層 schedule。

schedule: 五個星號，每分鐘觸發。

jobTemplate 裡面就是標準 Job 的內容。restartPolicy: OnFailure，失敗在原地重試這個 Pod，跟 Job 的 Never 不一樣（Never 是建新 Pod，OnFailure 是原地重啟）。

這個 scheduler 的工作很單純：掃資料庫找到期的任務、把它們丟進 Redis Queue。業務邏輯不複雜，但一定要按時跑。

[▶ PPT 34/45：Cron 語法]`,
  },

  // ── [34/45] Cron 語法 ──
  {
    title: '[34/45] Cron 語法',
    subtitle: '分 時 日 月 週',
    section: '7-9 第三段：應用層',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/40">
          <p className="text-cyan-300 font-mono text-center text-lg">* * * * *</p>
          <p className="text-slate-500 text-xs text-center mt-2">分 時 日 月 週</p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded flex items-center justify-between">
            <span className="text-cyan-300 font-mono">* * * * *</span>
            <span className="text-slate-300">每分鐘</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded flex items-center justify-between">
            <span className="text-cyan-300 font-mono">0 9 * * *</span>
            <span className="text-slate-300">每天早上九點</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded flex items-center justify-between">
            <span className="text-cyan-300 font-mono">0 */6 * * *</span>
            <span className="text-slate-300">每六小時</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded flex items-center justify-between">
            <span className="text-cyan-300 font-mono">*/5 * * * *</span>
            <span className="text-slate-300">每五分鐘</span>
          </div>
        </div>
      </div>
    ),
    notes: `Cron 語法五個欄位：分、時、日、月、週。

每個欄位可以是具體數字、星號（代表任意）、逗號（代表多個）、斜線加數字（代表間隔）。

五個星號：每分鐘。0 9 星星星：每天早上 9 點整（分是 0、時是 9、其他任意）。0 斜線 6 三個星：每 6 小時整點（分 0、時每 6 小時）。斜線 5 後面四個星：每 5 分鐘。

記不住也沒關係，crontab.guru 這個網站把你的 cron 翻譯成人話。

[▶ PPT 35/45：concurrencyPolicy]`,
  },

  // ── [35/45] concurrencyPolicy ──
  {
    title: '[35/45] concurrencyPolicy 三個選項',
    subtitle: 'Allow / Forbid / Replace',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="space-y-2 text-xs">
          <div className="bg-slate-800/40 border-l-4 border-slate-500 p-3 rounded">
            <p className="text-slate-300 font-semibold">Allow（預設）</p>
            <p className="text-slate-400 mt-1">允許同時跑多個 Job，上一個還沒跑完也再起一個</p>
          </div>
          <div className="bg-slate-800/40 border-l-4 border-green-500 p-3 rounded">
            <p className="text-green-300 font-semibold">Forbid ← 這套系統用這個</p>
            <p className="text-slate-400 mt-1">上一個還沒跑完就跳過這次。防止重複入隊。</p>
          </div>
          <div className="bg-slate-800/40 border-l-4 border-amber-500 p-3 rounded">
            <p className="text-amber-300 font-semibold">Replace</p>
            <p className="text-slate-400 mt-1">砍掉上一個，起一個新的</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <p className="text-cyan-400 font-semibold mb-1">驗證</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded"><code>{`kubectl apply -f 10-cronjob.yaml
kubectl get cronjob -n tasks
# SCHEDULE * * * * *、SUSPEND False、LAST SCHEDULE 一分鐘後出現時間

kubectl get job -n tasks
# 每分鐘有新的 task-scheduler-xxxxxxx COMPLETIONS 1/1`}</code></pre>
        </div>
      </div>
    ),
    notes: `concurrencyPolicy 三個選項，業務場景決定用哪個。

Allow 是預設，允許同時跑多個。上一次 Job 還沒跑完，下一次時間到就再起一個。適合跑得快、互不影響的任務。

Forbid 是這套系統用的。上一次沒跑完就跳過這次。為什麼？因為 scheduler 是「撈到期任務丟 Queue」，如果上一次還在跑、這一次又跑，可能同一個任務被丟兩次。Forbid 保證同一時間最多一個 scheduler 在跑。

Replace 是砍掉上一個、起新的。適合每次都要跑最新狀態，舊的沒用了的場景。

apply 之後等一分鐘，get job 就會看到第一個 task-scheduler Job 跑完。

[▶ PPT 36/45：Ingress k3s Traefik]`,
  },

  // ── [36/45] Ingress Traefik ──
  {
    title: '[36/45] Ingress — k3s 用 Traefik',
    subtitle: '不是 nginx',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold">關鍵事實</p>
          <p className="text-slate-300 mt-1">k3s 內建的 Ingress Controller 是 Traefik，不是 nginx。</p>
          <p className="text-slate-400 mt-1">你 annotation 寫成 nginx 那套語法會失效。</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/40 border border-red-500/40 p-3 rounded">
            <p className="text-red-300 font-semibold mb-1">nginx 做 path rewrite</p>
            <p className="text-slate-400 font-mono">nginx.ingress.kubernetes.io/rewrite-target: /$2</p>
            <p className="text-slate-500 mt-1">加 capture group 在 path 裡面</p>
          </div>
          <div className="bg-slate-800/40 border border-green-500/40 p-3 rounded">
            <p className="text-green-300 font-semibold mb-1">Traefik 做 path rewrite</p>
            <p className="text-slate-400 font-mono">Middleware: stripPrefix</p>
            <p className="text-slate-500 mt-1">獨立的 Middleware 資源，Ingress 用 annotation 引用</p>
          </div>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold">為什麼需要 path rewrite？</p>
          <p className="text-slate-400 mt-1">
            使用者打 /api/tasks，Backend 只知道自己的 route 是 /tasks。要把 /api 前綴剝掉才不會 404。
          </p>
        </div>
      </div>
    ),
    notes: `Ingress 這裡最容易踩坑的一件事：k3s 的 Ingress Controller 是 Traefik，不是 nginx。

你在網路上找教學，九成是 nginx 的範例，annotation 長這樣：nginx.ingress.kubernetes.io/rewrite-target: /$2，然後 path 裡面加一個 capture group。你套上去 k3s，Traefik 不認這個 annotation，失效。

Traefik 的做法不一樣。它用獨立資源叫 Middleware，你先定義一個 Middleware 說「stripPrefix /api」，然後 Ingress 用 annotation 引用這個 Middleware。下一頁看 YAML。

為什麼需要 path rewrite？使用者在瀏覽器打 /api/tasks，路徑帶到 Backend 的時候，Backend 其實是寫 /tasks 這條路由。我們希望 Backend 收到的是 /tasks 不是 /api/tasks。所以要把 /api 前綴剝掉。

[▶ PPT 37/45：Middleware + Ingress YAML]`,
  },

  // ── [37/45] Middleware + Ingress YAML ──
  {
    title: '[37/45] Middleware + Ingress YAML',
    subtitle: '12-ingress.yaml',
    section: '7-9 第三段：應用層',
    duration: '3',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata: { name: strip-api-prefix, namespace: tasks }
spec:
  stripPrefix:
    prefixes: [/api]    # ★ 剝掉 /api，否則 Backend 收到 /api/tasks 會 404
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tasks-ingress
  namespace: tasks
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: tasks-strip-api-prefix@kubernetescrd   # ★ namespace-名稱@kubernetescrd
spec:
  ingressClassName: traefik   # ★ 用 Traefik
  rules:
  - host: task.example.com
    http:
      paths:
      - path: /api            # ★ /api → backend
        pathType: Prefix
        backend:
          service: { name: backend-service, port: { number: 3000 } }
      - path: /                # ★ / → frontend
        pathType: Prefix
        backend:
          service: { name: frontend-service, port: { number: 80 } }`}</code></pre>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold">annotation 格式</p>
          <p className="text-slate-300 mt-1">
            <span className="font-mono">namespace-middleware名稱@kubernetescrd</span>——少一個字都不認
          </p>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs overflow-x-auto"><code>{`kubectl apply -f 12-ingress.yaml
kubectl get ingress -n tasks`}</code></pre>
      </div>
    ),
    notes: `Middleware 先定義，kind Middleware，spec.stripPrefix.prefixes /api。

Ingress 引用 Middleware 的關鍵是 annotation：traefik.ingress.kubernetes.io/router.middlewares，值是 tasks-strip-api-prefix@kubernetescrd。

這個格式要記熟：namespace 連字號 middleware 名稱，後面 @kubernetescrd。少一個字、拼錯都不認。

ingressClassName: traefik，明確告訴 K8s 用 Traefik。

rules 裡面 path 有兩條：/api 路由到 backend-service:3000，/ 路由到 frontend-service:80。順序重要，/api 要寫在 / 前面。

apply 下去，kubectl get ingress，ADDRESS 欄位出現 Node IP 代表 Traefik 接管了這個 Ingress。

[▶ PPT 38/45：hosts 測試]`,
  },

  // ── [38/45] hosts 測試 ──
  {
    title: '[38/45] 本機 hosts 測試',
    subtitle: '在電腦加 task.local 對應',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">Step 1 — 先 SSH 到 master 查自己的 VM IP</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`hostname -I | awk '{print $1}'   # 記下這個 IP，下面 <VM_IP> 換成它`}</code></pre>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <p className="text-cyan-400 font-semibold mb-1">Step 2 — Windows（PowerShell 管理員）</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`Add-Content -Path "C:\\Windows\\System32\\drivers\\etc\\hosts" \`
  -Value "<VM_IP>  task.local"

Get-Content "C:\\Windows\\System32\\drivers\\etc\\hosts" | Select-String "task.local"`}</code></pre>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <p className="text-cyan-400 font-semibold mb-1">Step 2 — Mac / Linux</p>
          <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`echo "<VM_IP>  task.local" | sudo tee -a /etc/hosts`}</code></pre>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold mb-1">Step 3 — 瀏覽器測試</p>
          <ul className="text-slate-300 space-y-1">
            <li><span className="font-mono text-cyan-300">http://task.local</span> → Frontend</li>
            <li><span className="font-mono text-cyan-300">http://task.local/api/tasks</span> → Backend API</li>
          </ul>
        </div>
      </div>
    ),
    notes: `本機測試要改 hosts。注意——是改你自己電腦的 hosts，不是 VM 上的。

先到 VM 上打 hostname -I 抓自己的 IP，每個人的 VM IP 不一樣所以不能抄寫死的。把抓到的 IP 記下來，下面指令中 <VM_IP> 都換成這個值。

Windows 開 PowerShell 管理員權限，Add-Content 那行把 IP 和 task.local 寫進 hosts。

Mac Linux 一行 echo sudo tee。

加完瀏覽器開 http://task.local 看到 Frontend 畫面，開 http://task.local/api/tasks 打到 Backend。

Ingress 通了，你就有一個像樣的「域名入口」——這才是真實系統該有的樣子，而不是靠 IP 加 port 那種測試級做法。

[▶ PPT 39/45：HPA YAML]`,
  },

  // ── [39/45] HPA YAML ──
  {
    title: '[39/45] HPA — Backend 自動擴縮',
    subtitle: '11-hpa.yaml',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata: { name: backend-hpa, namespace: tasks }
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend    # ★ 對應 Backend Deployment 的 metadata.name
  minReplicas: 2     # ★ 最少 2 副本
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70   # ★ CPU > requests 的 70% 就擴容`}</code></pre>
      </div>
    ),
    notes: `HPA 給 Backend 用，因為 Backend 是流量入口，容易吃 CPU。Task Runner 跟 CronJob 是背景 worker，不自動擴縮。

scaleTargetRef 指向 backend Deployment，名字要完全一致。

minReplicas 2：最少保持 2 個副本，低負載也不縮到 0。maxReplicas 10：最多擴到 10 個。

averageUtilization 70：CPU 使用率超過 requests 的 70% 就擴容。requests 是分母——Backend Deployment 裡我設 100m，所以 70m 就開始擴。沒設 requests 的話這裡算不出來，TARGETS 會是 unknown。

[▶ PPT 40/45：HPA 驗證]`,
  },

  // ── [40/45] HPA 驗證 ──
  {
    title: '[40/45] HPA 驗證 TARGETS',
    subtitle: 'cpu: X%/70% 有數字才正常',
    section: '7-9 第三段：應用層',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <pre className="bg-slate-950 text-slate-100 p-2 rounded"><code>{`kubectl apply -f 11-hpa.yaml
kubectl get hpa -n tasks`}</code></pre>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold mb-1">期待</p>
          <p className="text-slate-300 font-mono">TARGETS 欄位：cpu: X%/70%</p>
          <p className="text-slate-400 mt-1">有數字不是 unknown，代表 metrics-server 收到了 backend 的 CPU 數據</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded text-xs">
          <p className="text-red-300 font-semibold mb-1">TARGETS 是 unknown？</p>
          <ul className="text-slate-400 space-y-1 list-disc list-inside">
            <li>Backend Deployment 沒設 resources.requests.cpu</li>
            <li>metrics-server 沒裝或還沒收到 metrics（等 1 分鐘）</li>
          </ul>
        </div>
      </div>
    ),
    notes: `apply HPA，get 看 TARGETS 欄位。

期待是 cpu: X%/70%，X 是當下 CPU 使用率。有數字就對了。

如果看到 unknown，兩個最常見原因：Backend Deployment 忘記設 resources.requests.cpu，HPA 算不出百分比。或 metrics-server 還沒收到 metrics，剛部署的話等一分鐘再看。

metrics-server 是 HPA 的資料來源，k3s 內建有。一般 k8s 要自己裝。

[▶ PPT 41/45：巡堂驗收 #3]`,
  },

  // ── [41/45] 巡堂驗收 #3 ──
  {
    title: '[41/45] 應用層告一段落 — 來對一遍',
    subtitle: '五項都綠，整套系統就活了',
    section: '7-9 第三段：應用層',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-amber-300">
                <th className="border border-slate-700 p-2 text-left">指令</th>
                <th className="border border-slate-700 p-2 text-left">期待</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr><td className="border border-slate-700 p-2 font-mono">get pods</td><td className="border border-slate-700 p-2">frontend x2 Running；task-runner x3 Running</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">get cronjob</td><td className="border border-slate-700 p-2">LAST SCHEDULE 有時間；SUSPEND False</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">get hpa</td><td className="border border-slate-700 p-2">TARGETS cpu: X%/70%（非 unknown）</td></tr>
              <tr className="bg-slate-800/30"><td className="border border-slate-700 p-2 font-mono">get ingress</td><td className="border border-slate-700 p-2">ADDRESS 出現 Node IP</td></tr>
              <tr><td className="border border-slate-700 p-2 font-mono">logs -l app=task-runner --tail=20</td><td className="border border-slate-700 p-2">task-runner started, waiting for tasks...</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-cyan-300 text-sm text-center">
          都綠就繼續；有一項沒綠，先停一下查一下，通常幾秒就好
        </div>
      </div>
    ),
    notes: `應用層四個組件也跑完了，最後一次回頭對一下。

pods 看 frontend 兩個、task-runner 三個都 Running。cronjob 等一分鐘，LAST SCHEDULE 有時間、SUSPEND 是 False。hpa 的 TARGETS 要有百分比，不是 unknown。ingress 的 ADDRESS 有 Node IP，代表對外入口通了。最後用 -l app=task-runner 看三個 worker 的 log，都有 started, waiting for tasks... 那行，worker 活著在等工作。

五項都綠 → 組件全部站起來了。但「站起來」跟「活著」不一樣——前面三次巡堂都是在看狀態，看每個組件自己 OK 沒 OK。接下來我們換個角度，不看狀態，看一筆任務真的在系統裡怎麼流。組件之間有沒有串起來，只有端到端走一圈才看得出來。

[▶ PPT 42/45：全系統驗收]`,
  },

  // ── [42/45] 端到端 walkthrough ──
  {
    title: '[42/45] 走這一圈 — 12 個組件真實運作一次',
    subtitle: '瀏覽器新增一筆任務，看它從 Ingress 一路流到 DB 再被 Runner 吃掉',
    section: '全系統驗收（E2E）',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/40 p-3 rounded">
          <p className="text-cyan-300 font-semibold mb-1">操作順序（在 http://task.local 上）</p>
          <ol className="text-slate-300 space-y-1 list-decimal list-inside">
            <li>打開瀏覽器進 <span className="font-mono text-cyan-300">http://task.local</span> — Frontend 顯示任務列表</li>
            <li>在輸入框打一筆任務標題，按「新增」— Backend 寫入 MySQL</li>
            <li>刷新頁面 — 新任務出現，代表 Frontend ← Backend ← MySQL 整串連通</li>
            <li>等一分鐘，看 <span className="font-mono text-cyan-300">kubectl logs -l app=task-runner</span> — CronJob 把待處理任務丟進 Redis Queue、Task Runner 消費後寫回 MySQL、頁面狀態從 pending 變 done</li>
          </ol>
        </div>

        <div className="bg-slate-800/40 border border-slate-700 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">這一圈走完，12 個組件全部都真實運作過一次</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
            <div>① Ingress 路由（task.local → backend-service）</div>
            <div>② Frontend 顯示（Deployment + Service）</div>
            <div>③ Backend 寫入（Deployment + HPA）</div>
            <div>④ MySQL 儲存（StatefulSet + PVC）</div>
            <div>⑤ CronJob 掃描（每分鐘觸發 Job）</div>
            <div>⑥ Redis Queue 傳遞（Deployment）</div>
            <div>⑦ Task Runner 消費（Deployment x3）</div>
            <div>⑧ Task Runner 寫回（狀態從 pending → done）</div>
            <div>⑨ RBAC 讓 Backend 能讀 ConfigMap（SA + Role + RoleBinding）</div>
            <div>⑩ Secret 注入（DB / Redis 密碼）</div>
            <div>⑪ ConfigMap 注入（連線參數）</div>
            <div>⑫ Namespace 隔離（-n tasks）</div>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-2 rounded text-green-300 text-xs text-center">
          一筆任務走完整圈 → 整套系統是活的 🎉 下一張：9 個檢查點逐項驗收
        </div>
      </div>
    ),
    notes: `現在做最終驗收。前面的巡堂都是分段看組件狀態，這裡要走一圈端到端，讓一筆任務真的在系統裡跑完整個生命週期。

操作很簡單。瀏覽器打開 http://task.local，看到 Frontend 畫面，這代表 Ingress 路由對了、Frontend Pod 活著、Service 通了。

在輸入框打一筆任務標題，按新增。這一按，請求走 Ingress 到 Backend，Backend 連 MySQL 寫一筆 row。這裡面 Backend 的 DB 連線密碼是 Secret 來的、連線位址是 ConfigMap 來的。

刷新頁面，看到剛新增的任務出現在列表。這代表 Frontend 呼叫 Backend、Backend 查 MySQL、資料回到瀏覽器，整條回傳鏈是通的。

等一分鐘。CronJob 觸發 Job，Job 掃描 MySQL 找 pending 的任務，丟進 Redis Queue。Task Runner 三個 Pod 裡面有一個會搶到這筆任務，處理完之後把狀態寫回 MySQL。

這時候再刷新頁面，任務狀態從 pending 變 done。

這一圈走完，十二個組件全部都真實運作過一次：Ingress 路由、Frontend 顯示、Backend 寫入、MySQL 儲存、CronJob 掃描、Redis Queue 傳遞、Task Runner 消費、Task Runner 寫回、RBAC 讓 Backend 能讀 ConfigMap、Secret 注入密碼、ConfigMap 注入連線參數、Namespace 隔離。

每個組件都不是擺好看的，它們在這一筆任務的生命週期裡各自發揮作用。這就是整套系統活了。

但光是「流程走通」還不夠，下一張我們用 9 個檢查點逐項指令驗收一次，確認每一層都健康。[▶ PPT 43/45：9 個檢查點]`,
  },

  // ── [43/48] 9 個檢查點逐項驗收 ──
  {
    title: '[43/48] 9 個檢查點 — 每一層都下一次指令驗收',
    subtitle: '狀態 / DB / Cache / Job / RBAC / Cron / Runner / API / UI',
    section: '全系統驗收（E2E）',
    duration: '5',
    content: (
      <div className="space-y-2 text-[11px]">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">① 狀態總覽</p>
            <p className="font-mono text-slate-300">kubectl get all -n tasks</p>
            <p className="text-slate-400">all Pod READY、HPA TARGETS 有值</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">② MySQL tasks table</p>
            <p className="font-mono text-slate-300">mysql ... -e "SHOW TABLES;"</p>
            <p className="text-slate-400">看到 <code className="text-amber-300">tasks</code> → migration 成功</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">③ Redis 密碼驗證</p>
            <p className="font-mono text-slate-300">redis-cli -a ... ping</p>
            <p className="text-slate-400">回 <code className="text-amber-300">PONG</code></p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">④ Job migration log</p>
            <p className="font-mono text-slate-300">kubectl logs job/db-migrate</p>
            <p className="text-slate-400">Migration complete</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-amber-500">
            <p className="text-amber-300 font-semibold">⑤ RBAC 最小權限</p>
            <p className="font-mono text-slate-300">auth can-i get configmaps ✓</p>
            <p className="font-mono text-slate-300">auth can-i delete pods ✗</p>
            <p className="font-mono text-slate-300">auth can-i get secrets ✗</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">⑥ CronJob 觸發</p>
            <p className="font-mono text-slate-300">kubectl get job -n tasks</p>
            <p className="text-slate-400">task-scheduler-xxx Complete</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">⑦ Task Runner log</p>
            <p className="font-mono text-slate-300">logs -l app=task-runner</p>
            <p className="text-slate-400">waiting for tasks...</p>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border-l-2 border-cyan-500">
            <p className="text-cyan-300 font-semibold">⑧ Ingress + Backend API</p>
            <p className="font-mono text-slate-300">curl -H Host:task.local .../api/tasks</p>
            <p className="text-slate-400">JSON 回得來</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/50 p-2 rounded">
          <p className="text-green-300 font-semibold">⑨ Frontend 畫面</p>
          <p className="text-slate-300">瀏覽器 <code className="text-cyan-300">http://task.local</code> 看到任務管理系統 → 9 項全綠 = 系統真的活著 🎉</p>
        </div>
      </div>
    ),
    notes: `上一張我們用操作流程走完端到端，這一張換角度——每一層分別下一次指令，確認它真的健康。九個檢查點。

① 狀態總覽：kubectl get all -n tasks。mysql-0、redis、backend x2、frontend x2、task-runner x3 全部 READY。HPA 的 TARGETS 要有 cpu 百分比不是 unknown。CronJob LAST SCHEDULE 有時間。PVC mysql-storage-mysql-0 是 Bound。secret、configmap、serviceaccount、role、rolebinding 全部都在。

② MySQL 的 tasks table 要在。kubectl exec mysql-0 -- mysql ... -e "SHOW TABLES;"，看到 tasks 這一行，代表 migration Job 有成功跑過，表建好了。

③ Redis 有密碼保護。kubectl exec deploy/redis -- redis-cli -a MyRedisP@ssw0rd ping，回 PONG 代表 Redis 正常且 Secret 裡的密碼對。

④ Migration log。kubectl logs job/db-migrate，看到 Connected to MySQL、Migration complete: tasks table ready。確認 Job 不是死在中間。

⑤ RBAC 最小權限驗證。這一步最重要，分三次 can-i：
- can-i get configmaps → yes，backend-sa 讀得到 ConfigMap（應用需要）
- can-i delete pods → no，沒給就不能做
- can-i get secrets → no，Secret 也拿不到
三個一起測才叫最小權限落實。

⑥ CronJob 真的每分鐘跑。kubectl get job -n tasks，看到多個 task-scheduler-xxx 都 Complete。再 kubectl logs -l app=task-scheduler --tail=5，看到 Scanning for due tasks，代表有在掃資料庫。

⑦ Task Runner 三個 Pod。kubectl logs -l app=task-runner --tail=20，三個都印 task-runner started, waiting for tasks。想即時看就加 -f，Ctrl+C 停。

⑧ 對外入口。curl -H "Host: task.local" http://<Node IP>/api/tasks，回 JSON 就代表 Ingress 路由對、Backend API 連得到 MySQL。

⑨ 最後瀏覽器直接打 http://task.local，看到任務管理系統的畫面。九項全綠，系統不只是站起來，而是真的活著。

到這裡下午的 Loop 4 主系統就全部走完。[▶ PPT 44/48：7-10 QA 四題]`,
  },

  // ============================================================
  // 7-10 QA + 學員題目 + 解答（3 張）
  // ============================================================

  // ── [44/48] 7-10 QA 四題 ──
  {
    title: '[44/48] 7-10 QA — 四個高頻問題',
    subtitle: 'PVC Pending / CrashLoop / HPA unknown / Queue 不消費',
    section: '7-10 QA',
    duration: '4',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/40 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-300 font-semibold">Q1：PVC 一直是 Pending？</p>
          <p className="text-slate-400 mt-1">
            <span className="font-mono">kubectl get storageclass</span> 確認有預設 StorageClass（k3s 內建 local-path）。
            <span className="font-mono"> describe pvc</span> 看 Events。
          </p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-300 font-semibold">Q2：Pod 一直 CrashLoopBackOff？</p>
          <p className="text-slate-400 mt-1 mb-1"><span className="font-mono">kubectl logs</span> 看最後幾行。三個常見原因：</p>
          <ol className="text-slate-400 list-decimal list-inside space-y-1">
            <li>資料庫還沒準備好就部署 Backend（先等 mysql Running、migration 跑完）</li>
            <li>Secret 名稱拼錯（secretKeyRef.name 要完全對應）</li>
            <li>ConfigMap 的 key 打錯（configMapKeyRef.key 要完全一樣）</li>
          </ol>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-300 font-semibold">Q3：HPA TARGETS 一直 unknown？</p>
          <p className="text-slate-400 mt-1">Pod 沒設 <span className="font-mono">resources.requests.cpu</span>，或 metrics-server 剛啟動還在收集，等一分鐘。</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-300 font-semibold">Q4：Task Runner 啟動但 Queue 任務沒被消費？</p>
          <p className="text-slate-400 mt-1"><span className="font-mono">logs -l app=task-runner</span> 看 log。最常見是 Redis 連線失敗：redis-service 存在？Redis Pod Running？ConfigMap/Secret 值正確？</p>
        </div>
      </div>
    ),
    notes: `系統建起來了，講最高頻的四個踩坑。

Q1，PVC Pending。先打 get storageclass 看有沒有預設的 StorageClass。k3s 內建 local-path。如果沒有，PVC 永遠 Pending，沒人分磁碟給它。describe pvc 看 Events 會告訴你原因。

Q2，Pod CrashLoopBackOff。logs 看最後幾行，三個最常見的原因：一、資料庫還沒準備好 Backend 就上來了，程式連不到 DB 崩掉；二、Secret 名稱拼錯，secretKeyRef.name 有差一個字就是整個 Pod 起不來；三、ConfigMap 的 key 打錯，同樣的問題。這三個加起來涵蓋 80% 的 CrashLoop。

Q3，HPA TARGETS unknown。講過很多次了，Pod 沒設 requests.cpu HPA 算不出百分比。或 metrics-server 剛啟動還在收集，等一分鐘。

Q4，Task Runner 啟動但 Queue 任務沒被消費。看 task-runner 的 log，通常是 Redis 連線失敗。檢查 redis-service 存在、Pod Running、ConfigMap 的 REDIS_HOST 跟 Secret 的 redis-password 都對。

[▶ PPT 45/48：短網址產品實作]`,
  },

  // ── [45/48] 短網址產品實作 ──
  {
    title: '[45/48] 學生實作：短網址服務',
    subtitle: '不是寫產品，而是把產品正確放上 K8s',
    section: '7-11 短網址產品實作',
    duration: '6',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/50 p-3 rounded">
          <p className="text-cyan-300 font-semibold mb-1">這一段要做的事</p>
          <p className="text-slate-300">把一個已經寫好的產品部署到 Kubernetes，最後做到「能用、能恢復、資料不丟」。</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded">
          <p className="text-cyan-400 font-semibold mb-2 text-center">架構</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-300">Browser</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-300">Ingress</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-300">Frontend</span>
            <span className="text-cyan-400">/api /r →</span>
            <span className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded text-purple-300">API</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-300">PostgreSQL + PVC</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-semibold">入口</p>
            <p className="text-slate-400 mt-1">Frontend + Ingress 讓使用者能建立短網址、點短網址。</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-semibold">邏輯</p>
            <p className="text-slate-400 mt-1">API 負責建立短網址、查詢、redirect，是無狀態服務。</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-semibold">資料</p>
            <p className="text-slate-400 mt-1">PostgreSQL + PVC 保存短網址，Pod 重建後資料還要在。</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-semibold">學生不用寫程式碼</p>
            <p className="text-slate-400 mt-1">產品程式、Dockerfile、YAML 都已準備好；學生負責部署、驗收、排錯。</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-semibold">驗收標準很清楚</p>
            <p className="text-slate-400 mt-1">網站能開、能建立短網址、能 redirect、刪 Pod 後能恢復、DB 資料不丟。</p>
          </div>
        </div>
      </div>
    ),
    notes: `接下來不是再多講一個概念，而是讓大家真的部署一個產品。

這個產品叫短網址服務。使用者輸入長網址，系統產生 short.local/r/abc123 這種短網址。使用者打短網址，API 查 PostgreSQL 找原始網址，然後 redirect 過去。

這一張先不要急著講 YAML。先讓學生知道，現在要做的事情不是「寫一個 app」，而是「把一個已經存在的 app 放上 Kubernetes」。

我選這個題目有三個原因。第一，它像一個真的產品，最後可以打開網頁、建立短網址、點短網址跳轉。第二，不用 queue、worker、cron 這些額外概念，兩小時比較穩。第三，它還是能把 Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、Probe、Resource、HPA 都串起來。

你可以帶學生先看架構，只回答三個問題：入口是誰？邏輯是誰？資料放哪裡？入口是 Frontend 加 Ingress，邏輯是 API，資料是 PostgreSQL 加 PVC。

這次學生不用寫程式碼。產品程式已經寫好，Dockerfile 已經準備好，YAML 也已經準備好。學生要做的是部署、觀察、驗收、排錯。這更接近這門課的目標：知道一個產品放到 K8s 上，需要哪些運行元件。

[▶ PPT 46/48：手動部署流程]`,
  },

  // ── [46/48] 手動部署流程 ──
  {
    title: '[46/48] 2 小時部署流程',
    subtitle: '9 份 YAML，不是 9 個步驟，而是 9 個部署問題',
    section: '7-12 手動部署',
    duration: '6',
    content: (
      <div className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2">
          {[
            ['00', 'Namespace', '問題：這個產品放在哪個隔離空間？'],
            ['01', 'Secret', '問題：敏感資訊放哪裡？'],
            ['02', 'ConfigMap', '問題：非敏感設定放哪裡？'],
            ['03', 'PostgreSQL', '問題：資料要不要保留？'],
            ['04', 'Migration Job', '問題：資料表誰來建立？'],
            ['05', 'API', '問題：誰處理建立短網址與 redirect？'],
            ['06', 'Frontend', '問題：誰提供操作介面？'],
            ['07', 'HPA', '問題：流量變大怎麼辦？'],
            ['08', 'Ingress', '問題：使用者怎麼進產品？'],
            ['驗收', 'Browser + kubectl', '問題：怎樣才算真的部署完成？'],
          ].map(([step, name, desc]) => (
            <div key={step} className="bg-slate-800/40 border border-slate-700 p-2 rounded">
              <p className="text-cyan-300 font-semibold"><span className="font-mono">{step}</span> {name}</p>
              <p className="text-slate-400 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <pre className="bg-slate-950 text-slate-100 p-3 rounded overflow-x-auto"><code>{`kubectl apply -f apps/k8s/url-shortener/00-namespace.yaml
kubectl apply -f apps/k8s/url-shortener/01-secret.yaml
kubectl apply -f apps/k8s/url-shortener/02-configmap.yaml
kubectl apply -f apps/k8s/url-shortener/03-postgres.yaml
kubectl apply -f apps/k8s/url-shortener-local/04-migrate-job.yaml
kubectl apply -f apps/k8s/url-shortener-local/05-api.yaml
kubectl apply -f apps/k8s/url-shortener-local/06-frontend.yaml
kubectl apply -f apps/k8s/url-shortener/07-hpa.yaml
kubectl apply -f apps/k8s/url-shortener/08-ingress.yaml`}</code></pre>
      </div>
    ),
    notes: `流程分成九個檔案。每個檔案只負責一層，這樣學生比較不會迷路。

這一張的講法很重要。不要把它講成「照順序 apply 九份 YAML」。要講成：每一份 YAML 都在回答一個部署問題。

00 建 Namespace，回答這個產品要放在哪個隔離空間。01 建 Secret，回答敏感資訊放哪裡。02 建 ConfigMap，回答非敏感設定放哪裡。03 建 PostgreSQL StatefulSet 和 PVC，回答資料要不要保留。04 跑 Migration Job，回答資料表誰來建立。05 部署 API，回答誰處理建立短網址與 redirect。06 部署 Frontend，回答誰提供操作介面。07 掛 HPA 到 API，回答流量變大怎麼辦。08 建 Ingress，回答使用者怎麼進產品。

這裡我建議不要一開始就給學生 helm install。先讓他們一步一步 apply，因為這是最後一次把所有元件串起來。手動做完一次，學生才知道 Helm 到底幫他們包了什麼。

你可以直接提醒學生：你現在不是在背九個檔案，而是在學怎麼回答九個部署問題。

[▶ PPT 47/50：YAML 大複習]`,
  },

  // ── [47/50] YAML 大複習 ──
  {
    title: '[47/50] YAML 大複習：每份檔案到底做了什麼',
    subtitle: '把 9 份 manifest 對回 K8s 核心觀念',
    section: '7-12 手動部署',
    duration: '7',
    content: (
      <div className="space-y-2 text-[11px]">
        <div className="grid grid-cols-3 gap-2">
          {[
            ['00 Namespace', 'Namespace', '產品邊界；後續所有資源都放在 url-shortener。'],
            ['01 Secret', 'Secret', '放 postgres-password；DB / API / Job 都從這裡拿密碼。'],
            ['02 ConfigMap', 'ConfigMap', '放 DB host、port、database、user；host 是 Service DNS。'],
            ['03 PostgreSQL', 'Headless Service + StatefulSet + PVC', 'DB 需要穩定名稱與持久化儲存。'],
            ['04 Migration', 'Job + init container', '先等 DB，再執行 node migrate.js 建資料表。'],
            ['05 API', 'Deployment + Service', '無狀態邏輯層；probe、resources、Secret/ConfigMap 注入。'],
            ['06 Frontend', 'Deployment + Service', '靜態網站；Ingress 的 / 會導到這裡。'],
            ['07 HPA', 'HorizontalPodAutoscaler', '指向 url-api；需要 CPU requests 和 metrics-server。'],
            ['08 Ingress', 'Ingress', 'short.local path routing：/api、/r 到 API，/ 到 Frontend。'],
          ].map(([file, kind, desc]) => (
            <div key={file} className="bg-slate-800/40 border border-slate-700 p-2 rounded">
              <p className="text-cyan-300 font-semibold">{file}</p>
              <p className="text-amber-300 font-mono mt-1">{kind}</p>
              <p className="text-slate-400 mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-cyan-300 text-center">
          一鍵部署不是魔法；Helm 只是把這些 YAML template 化，讓它可重複部署、可調參、可升級回滾。
        </div>
      </div>
    ),
    notes: `這張是整段 7-12 最重要的收束。你要讓學生知道，每份 YAML 不是孤立檔案，而是在複習一個 K8s 核心觀念。

00 Namespace：建立產品邊界。後面所有資源都放在 url-shortener。

01 Secret：放 postgres-password。DB、API、migration 都會用到它。這裡複習敏感資訊不要放 ConfigMap。

02 ConfigMap：放 POSTGRES_HOST、PORT、DB、USER。注意 host 是 postgres-service，不是 IP。這裡複習 Service DNS。

03 PostgreSQL：這份其實建了 headless Service、StatefulSet 和 PVC template。DB 要穩定名稱和穩定儲存，所以用 StatefulSet，不用 Deployment。

04 Migration Job：這份複習 Job 和 init container。init container 先等 DB 可以連，Job 再跑 node migrate.js 建 short_links table。

05 API：這份複習 Deployment、Service、ConfigMap/Secret 注入、resources、livenessProbe、readinessProbe。API 是無狀態邏輯層，所以用 Deployment。

06 Frontend：也是 Deployment 加 Service，但比 API 單純。它沒有 DB 依賴，Ingress 的根路徑會導到它。

07 HPA：這份不是部署 app，而是建立擴縮規則。它指向 url-api，並依 CPU utilization 擴縮。

08 Ingress：這是對外入口。同一個 short.local，/api 和 /r 導到 API，/ 導到 Frontend。這就是產品對外看起來像同一個網站的原因。

最後直接連到 Helm：一鍵部署不是魔法。Helm 只是把這些 YAML template 化，讓它可以重複部署、調參、升級、回滾。

[▶ PPT 48/50：Image 也要被交付]`,
  },

  // ── [48/50] Image 交付 ──
  {
    title: '[48/50] Image 也要被交付',
    subtitle: '避免全班同時拉 Docker Hub，被 rate limit 擋住',
    section: '7-12 手動部署',
    duration: '5',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border border-amber-500/50 p-3 rounded">
          <p className="text-amber-300 font-semibold mb-1">問題</p>
          <p className="text-slate-300">YAML 寫對了，但如果 image 拉不下來，Pod 還是起不來。全班同時拉 Docker Hub 很容易被限流。</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-3 rounded">
          <p className="text-cyan-300 font-semibold mb-2 text-center">Local image workflow</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {['source code', 'docker build', 'docker save', 'k3s ctr import', 'kubectl apply / helm install'].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-slate-200 font-mono">{step}</span>
                {index < 4 && <span className="text-cyan-400">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold">學生 build</p>
            <pre className="bg-slate-950 text-slate-100 p-2 rounded mt-2 overflow-x-auto"><code>{`./scripts/build-local-images.sh
./scripts/save-k3s-images.sh`}</code></pre>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold">匯入 k3s node</p>
            <pre className="bg-slate-950 text-slate-100 p-2 rounded mt-2 overflow-x-auto"><code>{`./scripts/load-images-to-k3s-multipass.sh
./scripts/check-k3s-images.sh`}</code></pre>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-cyan-300 text-center">
          docker build 是產生 image；k3s ctr import 是把 image 放進 Kubernetes 會使用的 containerd。
        </div>
      </div>
    ),
    notes: `這張要補一個非常實務的問題：Image 也要被交付。

以前上課可能遇過，全班同時從 Docker Hub 拉 image，結果被 rate limit，大家的 Pod 都卡在 ImagePullBackOff。這不是 YAML 寫錯，而是外部 registry 限流。

所以短網址 Lab 預設改成本地 image workflow：學生先從 source code docker build，產生 url-shortener-api:lab 和 url-shortener-frontend:lab。接著 docker save 匯出 tar，再用 k3s ctr images import 把 image 放進每個 k3s node 的 containerd。最後才 kubectl apply 或 helm install。

這裡一定要講清楚：docker build 是把 image 放在學生電腦的 Docker 裡；k3s 跑 Pod 用的是 VM 裡的 containerd。兩邊不是同一個地方，所以不能只 build，還要 import。

另外 PostgreSQL 和 busybox 也要考慮。只 build API 和 Frontend 還不夠，postgres:15 和 busybox:1.36 如果沒有匯入 k3s node，Pod 還是可能對外拉 image。

local YAML 會使用 imagePullPolicy: Never。這代表不要對外拉 image，只使用 node 上已經有的 image。如果忘記匯入，就會看到 ErrImageNeverPull。這是預期的錯誤訊號。

[▶ PPT 49/50：驗收清單]`,
  },

  // ── [49/50] 驗收清單 ──
  {
    title: '[49/50] 驗收清單',
    subtitle: '先驗產品能不能用，再驗 K8s 有沒有提供自我修復',
    section: '7-13 驗收',
    duration: '5',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/40 p-3 rounded">
          <p className="text-green-300 font-semibold mb-2">功能驗收</p>
          <ol className="text-slate-300 space-y-1 list-decimal list-inside">
            <li>打開 <span className="font-mono text-cyan-300">http://short.local</span></li>
            <li>輸入 <span className="font-mono text-cyan-300">https://kubernetes.io/</span> 並建立短網址</li>
            <li>點 <span className="font-mono text-cyan-300">/r/&lt;code&gt;</span>，瀏覽器 redirect 到原始網址</li>
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold">K8s 驗收</p>
            <pre className="bg-slate-950 text-slate-100 p-2 rounded mt-2 overflow-x-auto"><code>{`kubectl get all -n url-shortener
kubectl get pvc -n url-shortener
kubectl get hpa -n url-shortener`}</code></pre>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold">故障驗收</p>
            <pre className="bg-slate-950 text-slate-100 p-2 rounded mt-2 overflow-x-auto"><code>{`kubectl delete pod -l app=url-api -n url-shortener
kubectl delete pod postgres-0 -n url-shortener`}</code></pre>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-amber-300">
          刪 API Pod 後 Deployment 要補回；刪 DB Pod 後 StatefulSet 要重建 postgres-0，PVC 裡的短網址資料還在。
        </div>
      </div>
    ),
    notes: `驗收分成兩種，一種是產品驗收，一種是 K8s 驗收。

這一張要故意分成兩層來講。第一層是產品驗收，第二層是 Kubernetes 驗收。不要讓學生以為 kubectl get pods 全綠就叫完成。

產品驗收很清楚。打開 short.local，輸入 kubernetes.io，建立短網址，點短網址，瀏覽器真的跳過去。這代表 Ingress、Frontend、API、DB 串起來了。

K8s 驗收看三個指令：get all、get pvc、get hpa。學生要能說出每個物件在這個產品裡負責什麼。這是在驗證平台能力，不只是驗證功能。

最後做兩個故障測試。刪 API Pod，Deployment 要自動補回。刪 postgres-0，StatefulSet 要重建 postgres-0，而且 PVC 要掛回來，剛剛建立的短網址資料不能丟。

你可以直接下結論給學生：如果只能用、不能恢復，不算部署完成；如果能恢復、但資料會丟，也不算部署完成。

做到這裡，學生就不是只看過 K8s，而是真的把一個產品跑上 K8s 了。

[▶ PPT 50/50：Helm 一個指令]`,
  },

  // ── [50/50] Helm 一個指令 ──
  {
    title: '[50/50] 最後收尾：Helm 一個指令',
    subtitle: '手動做一次是為了理解，Helm 是把這套系統變成可交付產品',
    section: '7-14 Helm 收尾',
    duration: '6',
    content: (
      <div className="space-y-3 text-xs">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded overflow-x-auto"><code>{`helm install url-shortener ./apps/helm/url-shortener \\
  -n url-shortener \\
  --create-namespace \\
  -f ./apps/helm/url-shortener/values-local.yaml`}</code></pre>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold mb-1">可以調整</p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li><span className="font-mono">image.tag</span>：部署版本</li>
              <li><span className="font-mono">replicaCount.api</span>：API Pod 數</li>
              <li><span className="font-mono">resources.api.requests.cpu</span>：CPU request</li>
              <li><span className="font-mono">hpa.maxReplicas</span>：HPA 上限</li>
              <li><span className="font-mono">ingress.host</span>：對外 domain</li>
              <li><span className="font-mono">postgres.storageSize</span>：DB 磁碟大小</li>
            </ul>
          </div>

          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold mb-1">升級與回滾</p>
            <pre className="bg-slate-950 text-slate-100 p-2 rounded overflow-x-auto"><code>{`helm upgrade url-shortener ./apps/helm/url-shortener \\
  -n url-shortener \\
  --set replicaCount.api=3 \\
  --set hpa.maxReplicas=10

helm rollback url-shortener 1 -n url-shortener`}</code></pre>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold mb-1">為什麼先手動？</p>
            <p className="text-slate-300">因為你要先知道一個產品拆開來有哪些 K8s 元件、每個元件負責什麼。</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 p-3 rounded">
            <p className="text-cyan-300 font-semibold mb-1">為什麼最後 Helm？</p>
            <p className="text-slate-300">因為工作上要重複部署、調參、升級、回滾，不會每天手動 apply 八九個 YAML。</p>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-cyan-300 text-center">
          Helm 不是取代 K8s；Helm 是把剛剛那一整套 K8s 元件打包成可重複部署、可調參、可回滾的產品。
        </div>
      </div>
    ),
    notes: `最後收在 Helm。

這一張不要只教指令。真正要講清楚的是：為什麼剛剛先手動做一次，最後又說可以一個指令完成？

前面一步一步 apply，是為了理解每個 K8s 元件負責什麼。但正式工作不會每天手動 apply 八九個 YAML。通常會用 Helm，把這些 YAML 變成 chart。

一個 helm install，就能把剛剛所有東西都建起來：Secret、ConfigMap、PostgreSQL StatefulSet、PVC、Migration Job、API、Frontend、Service、HPA、Ingress。

這裡可以直接對照剛剛的 YAML：01 Secret 對 templates/secret.yaml，02 ConfigMap 對 templates/configmap.yaml，03 PostgreSQL 對 templates/postgres.yaml，04 migration 對 templates/migrate-job.yaml，05 API 對 templates/api.yaml，06 Frontend 對 templates/frontend.yaml，07 HPA 對 templates/hpa.yaml，08 Ingress 對 templates/ingress.yaml。

但 Helm 不會幫你 build image，也不會幫你 import image。values-local.yaml 只是告訴 Helm 使用 url-shortener-api:lab、url-shortener-frontend:lab，pullPolicy 用 Never。

然後可以用 values 調整。image.tag 控制部署版本，replicaCount.api 控制 API 幾個 Pod，resources 控制 requests 和 limits，hpa 控制自動擴縮，ingress.host 控制網域，postgres.storageSize 控制 DB 磁碟大小。

升級用 helm upgrade，出問題用 helm rollback。

最後帶走一句話：K8s 教你的是系統怎麼組成；Helm 教你的是怎麼把這套系統變成可以重複交付的產品。

這堂課到這裡。下課。`,
  },
]
