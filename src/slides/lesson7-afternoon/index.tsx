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
  // ── Slide 1 痛點：全通不安全 ──────────────────────
  {
    title: '痛點：全通不安全',
    subtitle: 'K8s 預設所有 Pod 互通',
    section: 'NetworkPolicy',
    content: (
      <div className="space-y-4">
        {/* NetworkPolicy 流量管控圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">三層架構的流量管控</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Frontend */}
            <div className="border-2 border-blue-500/70 rounded-lg p-3 bg-blue-900/20 text-center min-w-[100px]">
              <p className="text-blue-400 text-sm font-bold">Frontend</p>
              <p className="text-slate-400 text-[10px]">前端 Pod</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-green-400 font-bold text-xs">允許</span>
              <span className="text-green-400 font-bold">→</span>
            </div>
            {/* API */}
            <div className="border-2 border-cyan-500/70 rounded-lg p-3 bg-cyan-900/20 text-center min-w-[100px]">
              <p className="text-cyan-400 text-sm font-bold">API</p>
              <p className="text-slate-400 text-[10px]">後端 Pod</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-green-400 font-bold text-xs">允許</span>
              <span className="text-green-400 font-bold">→</span>
            </div>
            {/* DB */}
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/20 text-center min-w-[100px]">
              <p className="text-amber-400 text-sm font-bold">DB</p>
              <p className="text-slate-400 text-[10px]">資料庫 Pod</p>
            </div>
          </div>
          {/* 禁止的連線 */}
          <div className="flex items-center justify-center mt-3 gap-2">
            <div className="border border-blue-500/40 rounded px-2 py-1 bg-blue-900/10 text-center">
              <p className="text-blue-400 text-xs">Frontend</p>
            </div>
            <span className="text-red-400 font-bold text-xs">──✕──</span>
            <div className="border border-amber-500/40 rounded px-2 py-1 bg-amber-900/10 text-center">
              <p className="text-amber-400 text-xs">DB</p>
            </div>
            <span className="text-red-400 text-xs ml-2">拒絕！前端不能直連 DB</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">問題</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 前端 Pod 不應該能直接連 DB</p>
            <p>- 其他 Namespace 的 Pod 不應該能連你的服務</p>
            <p>- 如果一個 Pod 被入侵，攻擊者可以橫向移動到任何地方</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker vs K8s</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>Docker → <code className="text-xs">docker network create</code> 隔離不同 network 的容器</p>
            <p>K8s → NetworkPolicy（Pod 等級的防火牆，更精細）</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們繼續。

先講下一個主題的痛點。K8s 預設的網路政策是什麼？全通。所有 Pod 之間都可以互相通訊，不管在同一個 Namespace 還是不同 Namespace。

這在開發環境沒什麼問題，但在生產環境就是一個安全隱患。想想看，你的前端 Pod 應該只需要連 API，不應該能直接連資料庫。如果前端 Pod 被入侵了，攻擊者不應該能直接存取資料庫。但預設情況下，他可以。

這跟你家的網路一樣。如果所有設備都在同一個 WiFi 下面，任何設備都能看到其他設備。企業環境會把訪客 WiFi 和內部網路隔開，K8s 也需要類似的隔離。

用 Docker 的經驗來想，Docker 有 network 隔離。你建一個 frontend-net、一個 backend-net，不同 network 的容器不能互連。K8s 的做法更精細 — NetworkPolicy，Pod 等級的防火牆。你可以指定「只有帶某個 label 的 Pod 才能連我」，比 Docker 的 network 隔離更靈活。`,
    duration: '5',
  },

  // ── Slide 2 NetworkPolicy 概念 + YAML ─────────────
  {
    title: 'NetworkPolicy 概念',
    subtitle: 'Pod 等級的防火牆',
    section: 'NetworkPolicy',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">NetworkPolicy 的邏輯</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p><code className="text-xs text-cyan-400">podSelector</code> — 這條規則套用在誰身上</p>
            <p><code className="text-xs text-cyan-400">policyTypes</code> — 管進來（Ingress）還是出去（Egress）</p>
            <p><code className="text-xs text-cyan-400">ingress</code> — 允許誰連進來</p>
            <p><code className="text-xs text-cyan-400">egress</code> — 允許連出去到哪裡</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">注意：這裡的 Ingress/Egress 不是 Ingress Controller！</p>
          <div className="text-slate-300 text-xs mt-1">
            <p>NetworkPolicy 的 ingress = 進入 Pod 的流量（網路層概念）</p>
            <p>Ingress Controller = HTTP 路由（第六堂學的）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">重要觀念</p>
          <p className="text-slate-300 text-sm">一旦設了 NetworkPolicy，所有不在規則裡的流量都會被拒絕。預設全拒、只開你明確允許的。</p>
        </div>
      </div>
    ),
    code: `# 範例：DB 只允許 API Pod 連
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
spec:
  podSelector:
    matchLabels:
      role: database          # 套用在 DB Pod 上
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api       # 只允許 role=api 的 Pod 進來
      ports:
        - protocol: TCP
          port: 3306          # 只允許 3306 port`,
    notes: `NetworkPolicy 的結構很直覺。podSelector 指定這條規則套用在哪些 Pod 上。policyTypes 指定管的是 ingress（進來的流量）還是 egress（出去的流量），或兩者都管。然後用 ingress 和 egress 區塊定義具體的規則。

這裡要特別提醒一個容易混淆的點。NetworkPolicy 裡的「ingress」跟第六堂學的「Ingress Controller」完全是兩回事。NetworkPolicy 的 ingress 是指「進入 Pod 的流量」，是網路層的概念。Ingress Controller 是 HTTP 路由的概念。名字一樣但意思不同，不要搞混。

來看一個具體的例子。我要讓資料庫只接受 API Pod 的連線。podSelector 選 role: database，這條規則只套用在有這個 label 的 Pod 上。policyTypes 設 Ingress，只管進來的流量。ingress.from 裡面的 podSelector 設 role: api，表示只有帶 role=api label 的 Pod 才能連進來。ports 設 TCP 3306，只允許連 MySQL 的 port。

重要觀念：一旦你在某個 Pod 上設了 NetworkPolicy，所有不在規則裡的流量都會被拒絕。預設全拒、只開你明確允許的。這跟傳統的防火牆邏輯一樣。`,
    duration: '10',
  },

  // ── Slide 3 實作：NetworkPolicy ────────────────────
  {
    title: '實作：NetworkPolicy',
    subtitle: 'Lab 5：DB 只允許 API 連',
    section: 'NetworkPolicy',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">注意：NetworkPolicy 需要支援的 CNI</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>Calico / Cilium / Weave → 支援</p>
            <p>Flannel（k3s 預設）→ 不支援</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：部署 DB + API + NetworkPolicy
kubectl apply -f networkpolicy-db.yaml
kubectl get pods -l "role in (database,api)"

# Step 2：從 API Pod 連 DB（應該成功）
API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')
kubectl exec $API_POD -- curl -s --max-time 3 http://fake-db-svc:3306
# 有回應 = 連線成功

# Step 3：從其他 Pod 連 DB（應該被擋）
kubectl run test-block --image=curlimages/curl --rm -it --restart=Never -- \\
  curl -s --max-time 3 http://fake-db-svc:3306
# timeout = 被擋了`,
    notes: `好，我們來實作。networkpolicy-db.yaml 裡面有四個資源：一個假的 DB Deployment（用 nginx 模擬）、一個 DB Service、一個假的 API Deployment、還有一條 NetworkPolicy。

先部署：kubectl apply -f networkpolicy-db.yaml

等 Pod 跑起來之後，先從 API Pod 連 DB。你應該會看到回應 — 可能是一堆亂碼，因為我們是用 HTTP 打 MySQL port，但重點是有回應，表示連線成功。

現在從一個沒有 role=api label 的 Pod 來連 DB。如果 NetworkPolicy 有生效，這個請求會在 3 秒後 timeout，因為流量被擋掉了。

這裡有一個重要的注意事項：NetworkPolicy 需要 CNI 插件的支援。Calico、Cilium、Weave 都支援，但 k3s 預設使用的 Flannel 不支援 NetworkPolicy。如果你的測試結果是兩個都能連，那就是 CNI 不支援。在生產環境你會用 Calico 或 Cilium，它們都支援。`,
    duration: '15',
  },

  // ── Slide 4 NetworkPolicy 小結 ────────────────────
  {
    title: 'NetworkPolicy 小結',
    subtitle: 'Pod 之間的防火牆',
    section: 'NetworkPolicy',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">五個重點</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. K8s 預設全通，NetworkPolicy 加上後變成預設拒絕</p>
            <p>2. <code className="text-xs text-cyan-400">podSelector</code> — 規則套用在誰身上</p>
            <p>3. <code className="text-xs text-cyan-400">ingress</code> — 允許誰連進來</p>
            <p>4. <code className="text-xs text-cyan-400">egress</code> — 允許連出去到哪裡</p>
            <p>5. 需要支援的 CNI（Calico / Cilium）</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見的 NetworkPolicy 設計</p>
          <div className="space-y-1 text-slate-300 text-sm font-mono">
            <p>前端 → 只接受 Ingress Controller 的流量</p>
            <p>API  → 只接受前端和 Ingress Controller 的流量</p>
            <p>DB   → 只接受 API 的流量</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ 建立 NetworkPolicy 後，frontend curl db-svc timeout（被擋了）</p>
            <p>✓ api curl db-svc 成功（API → DB 允許）</p>
            <p>✓ kubectl get pods -o wide 看到 DaemonSet 在每個 Node 都有一個 Pod</p>
            <p>✓ kubectl get cronjob 看到排程任務</p>
          </div>
        </div>
      </div>
    ),
    notes: `NetworkPolicy 小結。K8s 預設所有 Pod 互通，加上 NetworkPolicy 之後變成預設拒絕、只允許明確指定的流量。常見的設計就是按照三層架構：前端只接受 Ingress Controller、API 只接受前端、DB 只接受 API。

好，我們繼續下一個主題。休息五分鐘。`,
    duration: '2',
  },

  // ── Slide 5 DaemonSet ─────────────────────────────
  {
    title: 'DaemonSet：每個 Node 跑一份',
    subtitle: '日誌收集、監控 agent 的好幫手',
    section: '特殊工作負載',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Deployment vs DaemonSet</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-600 rounded-lg p-3 bg-slate-800/40">
              <p className="text-blue-400 text-sm font-bold text-center mb-2">Deployment (replicas: 3)</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16">Node A:</span>
                  <span className="bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded text-blue-300">Pod</span>
                  <span className="bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded text-blue-300">Pod</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16">Node B:</span>
                  <span className="bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded text-blue-300">Pod</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16">Node C:</span>
                  <span className="text-slate-500">（沒有）</span>
                </div>
              </div>
            </div>
            <div className="border border-slate-600 rounded-lg p-3 bg-slate-800/40">
              <p className="text-green-400 text-sm font-bold text-center mb-2">DaemonSet</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16">Node A:</span>
                  <span className="bg-green-900/40 border border-green-500/30 px-2 py-0.5 rounded text-green-300">Pod</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16">Node B:</span>
                  <span className="bg-green-900/40 border border-green-500/30 px-2 py-0.5 rounded text-green-300">Pod</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16">Node C:</span>
                  <span className="bg-green-900/40 border border-green-500/30 px-2 py-0.5 rounded text-green-300">Pod</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">用途</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 日誌收集（Fluentd / Filebeat）</p>
            <p>- 監控 agent（Prometheus Node Exporter）</p>
            <p>- 網路插件（kube-proxy 本身就是 DaemonSet）</p>
          </div>
        </div>
      </div>
    ),
    code: `# DaemonSet YAML — 跟 Deployment 幾乎一樣，但沒有 replicas
apiVersion: apps/v1
kind: DaemonSet            # 不是 Deployment
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: logger
          image: busybox:1.36`,
    notes: `好，接下來講兩個特殊的工作負載類型。第一個是 DaemonSet。

Deployment 你設 replicas: 3，K8s 會在叢集裡跑 3 個 Pod，至於分布在哪些 Node 上，由 Scheduler 決定。可能 Node A 跑 2 個、Node B 跑 1 個、Node C 一個都沒有。

DaemonSet 不一樣。它保證每個 Node 上恰好跑一個 Pod。加一個新 Node，自動在上面建一個 Pod。移除一個 Node，對應的 Pod 也自動消失。

什麼場景需要這個？最經典的就是日誌收集。你想收集每個 Node 上所有容器的日誌，就需要每個 Node 上都有一個日誌收集器。還有監控 agent，比如 Prometheus 的 Node Exporter，需要在每個 Node 上收集硬體指標。其實 K8s 自己的 kube-proxy 就是用 DaemonSet 跑的。

DaemonSet 的 YAML 跟 Deployment 幾乎一樣，差別在 kind: DaemonSet，而且沒有 replicas 欄位 — 因為副本數就是 Node 數，不需要你指定。

Docker 沒有直接對應的概念。Docker Compose 做不到「每台機器一個」這種事。`,
    duration: '10',
  },

  // ── Slide 6 Job + CronJob ─────────────────────────
  {
    title: 'Job + CronJob',
    subtitle: '跑完就結束的任務 / 定時任務',
    section: '特殊工作負載',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Deployment vs Job</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p><span className="text-blue-400 font-semibold">Deployment</span>：跑了就不停（Web Server）</p>
            <p><span className="text-green-400 font-semibold">Job</span>：跑完就結束（資料遷移、批次處理）</p>
            <p><span className="text-amber-400 font-semibold">CronJob</span>：排程任務（每分鐘 / 每天 / 每週 建一個 Job）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Cron 語法</p>
          <div className="bg-slate-900/60 p-3 rounded text-xs font-mono text-slate-300 space-y-1">
            <p className="text-slate-400">┌──── 分 (0-59)</p>
            <p className="text-slate-400">│ ┌──── 時 (0-23)</p>
            <p className="text-slate-400">│ │ ┌──── 日 (1-31)</p>
            <p className="text-slate-400">│ │ │ ┌──── 月 (1-12)</p>
            <p className="text-slate-400">│ │ │ │ ┌──── 星期 (0-6)</p>
            <p className="text-slate-400">│ │ │ │ │</p>
            <p>* * * * *</p>
            <p className="mt-2"><span className="text-cyan-400">*/1 * * * *</span>  = 每分鐘</p>
            <p><span className="text-cyan-400">0 3 * * *</span>    = 每天凌晨 3 點</p>
            <p><span className="text-cyan-400">0 0 * * 0</span>    = 每週日午夜</p>
          </div>
        </div>
      </div>
    ),
    code: `# DaemonSet 實作
kubectl apply -f daemonset.yaml
kubectl get daemonset
kubectl get pods -l app=log-collector -o wide

# Job + CronJob 實作
kubectl apply -f cronjob.yaml
kubectl get jobs
kubectl logs job/one-time-job
kubectl get cronjobs
# 等 1-2 分鐘
kubectl get jobs    # CronJob 每分鐘建一個新 Job`,
    notes: `第二個特殊工作負載是 Job 和 CronJob。

到目前為止我們用的都是 Deployment，它的特性是「跑了就不停」，適合 Web Server、API 這種需要持續服務的應用。但有些任務是跑完就結束的，比如資料庫遷移、批次處理、備份。這些任務用 Deployment 不太對，因為你不需要它一直跑。

Job 就是為這種場景設計的。它建立一個 Pod，Pod 跑完主行程就停了，Job 的狀態變成 Completed。如果 Pod 失敗了，Job 會根據 backoffLimit 重試。

CronJob 就是定時版的 Job。你給一個 cron 表達式，CronJob 就會按照排程定時建立 Job。

cron 語法有五個欄位：分、時、日、月、星期。*/1 * * * * 就是每分鐘。0 3 * * * 就是每天凌晨 3 點。如果你用過 Linux 的 crontab，語法完全一樣。

快速實作。先部署 DaemonSet，你會看到 DESIRED 和 CURRENT 等於你的 Node 數量。接下來是 Job 和 CronJob，等一兩分鐘之後你會看到 CronJob 每分鐘建了一個新的 Job。successfulJobsHistoryLimit: 3 表示只保留最近 3 個成功的 Job，舊的會自動清理。`,
    duration: '15',
  },

  // ── Slide 7 日誌與除錯 ────────────────────────────
  {
    title: '日誌與除錯',
    subtitle: '排錯 SOP + 常見問題',
    section: '日誌與除錯',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">排錯 SOP（固定四步）</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p><span className="text-cyan-400 font-semibold">Step 1：</span><code className="text-xs">kubectl get pods</code> → 看 STATUS 有沒有異常</p>
            <p><span className="text-cyan-400 font-semibold">Step 2：</span><code className="text-xs">kubectl describe pod</code> → 看 Events 區塊</p>
            <p><span className="text-cyan-400 font-semibold">Step 3：</span><code className="text-xs">kubectl logs</code> → 看應用日誌</p>
            <p><span className="text-cyan-400 font-semibold">Step 4：</span><code className="text-xs">kubectl exec -it -- sh</code> → 進容器內部檢查</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見問題對照表</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-40">STATUS</th>
                <th className="text-left py-2">原因</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1"><code className="text-xs text-red-400">ImagePullBackOff</code></td>
                <td className="py-1 text-xs">Image 名字打錯、私有倉庫沒認證</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code className="text-xs text-red-400">CrashLoopBackOff</code></td>
                <td className="py-1 text-xs">應用啟動就 crash，看 logs</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code className="text-xs text-amber-400">Pending</code></td>
                <td className="py-1 text-xs">沒有 Node 有足夠資源</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code className="text-xs text-red-400">OOMKilled</code></td>
                <td className="py-1 text-xs">記憶體超過 limits</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code className="text-xs text-amber-400">CreateContainerConfigError</code></td>
                <td className="py-1 text-xs">ConfigMap/Secret 不存在</td>
              </tr>
              <tr>
                <td className="py-1"><code className="text-xs text-amber-400">0/1 Ready</code></td>
                <td className="py-1 text-xs">readinessProbe 失敗</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">推薦工具</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p><code className="text-xs text-cyan-400">kubectl get events --sort-by=.lastTimestamp</code> — 叢集事件</p>
            <p><code className="text-xs text-cyan-400">kubectl top pods / nodes</code> — 資源用量</p>
            <p><span className="text-cyan-400 font-semibold">K9s</span> — 終端機版 K8s 管理器（推薦！）</p>
            <p><span className="text-cyan-400 font-semibold">Lens</span> — 圖形化 K8s 管理器</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來講日誌和除錯。這其實把前幾堂零散學的排錯技巧做一個系統化的整理。

排錯的 SOP 固定四步。第一步，kubectl get pods 看 STATUS 有沒有異常。第二步，kubectl describe pod 看 Events 區塊，K8s 會在這裡記錄發生了什麼事。第三步，kubectl logs 看你的應用日誌。第四步，如果前面三步看不出問題，用 kubectl exec 進容器內部檢查。

這四步跟 Docker 的排錯流程幾乎一樣：docker ps 看狀態、docker inspect 看細節、docker logs 看日誌、docker exec 進容器。你學 Docker 的經驗在這裡完全用得上。

常見問題我列了一個對照表。ImagePullBackOff 通常是 image 名字打錯或私有倉庫沒設認證。CrashLoopBackOff 是應用啟動就 crash，先看 logs。Pending 是沒有 Node 有足夠資源，先 describe 看原因。OOMKilled 是記憶體超過 limits。

進階工具推薦三個。kubectl get events 可以看叢集層級的事件。kubectl top 可以看 CPU 和記憶體使用量。然後是 K9s，一個終端機版的 K8s 管理器，非常好用。`,
    duration: '15',
  },

  // ── Slide 8 etcd 備份概念 ─────────────────────────
  {
    title: 'etcd 備份（CKA 必考）',
    subtitle: 'K8s 的資料庫',
    section: '日誌與除錯',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">etcd = K8s 的資料庫</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>你的所有 YAML、所有狀態、所有設定 → 全部存在 etcd 裡</p>
            <p className="text-red-400 font-semibold">etcd 掛了 = 整個叢集的狀態全部消失</p>
          </div>
        </div>
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold">在我們的 k3s 環境不做實作，知道概念就好</p>
        </div>
      </div>
    ),
    code: `# 備份 etcd（概念，CKA 必考）
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# 還原
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db`,
    notes: `最後一個小主題：etcd 備份。這個我只講概念，不做實作，因為在我們的 k3s 環境裡操作比較複雜。但這個概念在 CKA 考試裡是必考的，所以我提一下。

還記得第四堂講架構的時候，etcd 是什麼？它是 K8s 的資料庫。你所有的 Deployment、Pod、Service、Secret、ConfigMap，全部都存在 etcd 裡。如果 etcd 掛了又沒有備份，你整個叢集的狀態就全部消失了。所有資源都要重新建立。

所以在生產環境，定期備份 etcd 是非常重要的。備份指令就是 etcdctl snapshot save，還原就是 etcdctl snapshot restore。你要指定 etcd 的憑證才能連上去。

在 k3s 的環境裡，etcd 被換成了 SQLite（單節點）或嵌入式 etcd（多節點），操作方式略有不同。如果你之後要考 CKA，建議用 kubeadm 建的叢集來練習 etcd 備份和還原。

好，知識講完了！接下來是今天的重頭戲 — 總複習實戰。我們休息十分鐘，回來之後從一個空的 Namespace 開始，把四堂課學到的東西全部用上。`,
    duration: '5',
  },

  // ── Slide 9 總複習架構圖 ──────────────────────────
  {
    title: '總複習：從零部署完整系統',
    subtitle: '12 步部署 — 四堂課知識大融合',
    section: '總複習',
    content: (
      <div className="space-y-4">
        {/* 總複習架構圖 — 精美版 */}
        <div className="bg-slate-900/60 border-2 border-cyan-500/40 p-4 rounded-lg">
          <p className="text-cyan-400 font-bold mb-4 text-center text-base">完整生產級系統架構</p>

          {/* Namespace 外框 */}
          <div className="border-2 border-slate-500/50 rounded-lg p-3 bg-slate-800/30">
            <p className="text-slate-400 text-xs font-bold mb-3">Namespace: prod</p>

            {/* Ingress 入口 */}
            <div className="flex justify-center mb-3">
              <div className="border-2 border-purple-500/70 rounded-lg px-4 py-2 bg-purple-900/20 text-center">
                <p className="text-purple-400 text-sm font-bold">Ingress</p>
                <p className="text-purple-300 text-[10px]">myapp.local</p>
                <div className="flex gap-3 mt-1 text-[10px]">
                  <span className="text-slate-300">/ → frontend</span>
                  <span className="text-slate-300">/api → api</span>
                </div>
              </div>
            </div>

            {/* 分流箭頭 */}
            <div className="flex justify-center gap-12 mb-2">
              <span className="text-slate-400">↓</span>
              <span className="text-slate-400">↓</span>
            </div>

            {/* Service 層 */}
            <div className="flex justify-center gap-4 mb-2 flex-wrap">
              <div className="border border-green-500/50 rounded px-3 py-1 bg-green-900/10 text-center">
                <p className="text-green-400 text-xs font-semibold">frontend-svc</p>
              </div>
              <div className="border border-green-500/50 rounded px-3 py-1 bg-green-900/10 text-center">
                <p className="text-green-400 text-xs font-semibold">api-svc</p>
              </div>
              <div className="border border-green-500/50 rounded px-3 py-1 bg-green-900/10 text-center">
                <p className="text-green-400 text-xs font-semibold">mysql-headless</p>
              </div>
            </div>

            <div className="flex justify-center gap-12 mb-2">
              <span className="text-slate-400">↓</span>
              <span className="text-slate-400">↓</span>
              <span className="text-slate-400">↓</span>
            </div>

            {/* Pod 層 */}
            <div className="flex justify-center gap-3 mb-3 flex-wrap">
              {/* Frontend Pods */}
              <div className="border-2 border-blue-500/60 rounded-lg p-2 bg-blue-900/10 text-center min-w-[120px]">
                <p className="text-blue-400 text-xs font-bold mb-1">Frontend Deployment</p>
                <div className="flex gap-1 justify-center">
                  <div className="bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded">
                    <p className="text-blue-300 text-[10px]">Pod x2</p>
                  </div>
                </div>
                <div className="mt-1 flex gap-1 flex-wrap justify-center">
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">Probe</span>
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">Resource</span>
                </div>
              </div>

              {/* API Pods */}
              <div className="border-2 border-cyan-500/60 rounded-lg p-2 bg-cyan-900/10 text-center min-w-[120px]">
                <p className="text-cyan-400 text-xs font-bold mb-1">API Deployment</p>
                <div className="flex gap-1 justify-center">
                  <div className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                    <p className="text-cyan-300 text-[10px]">Pod x3</p>
                  </div>
                </div>
                <div className="mt-1 flex gap-1 flex-wrap justify-center">
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">Probe</span>
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">Resource</span>
                  <span className="bg-amber-700/50 text-amber-400 text-[8px] px-1 rounded">HPA</span>
                </div>
                <div className="mt-1 flex gap-1 flex-wrap justify-center">
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">ConfigMap</span>
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">Secret</span>
                </div>
              </div>

              {/* MySQL */}
              <div className="border-2 border-amber-500/60 rounded-lg p-2 bg-amber-900/10 text-center min-w-[120px]">
                <p className="text-amber-400 text-xs font-bold mb-1">MySQL StatefulSet</p>
                <div className="flex gap-1 justify-center">
                  <div className="bg-amber-900/40 border border-amber-500/30 px-2 py-0.5 rounded">
                    <p className="text-amber-300 text-[10px]">Pod x1</p>
                  </div>
                </div>
                <div className="mt-1 flex gap-1 flex-wrap justify-center">
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">PVC</span>
                  <span className="bg-slate-700/50 text-slate-400 text-[8px] px-1 rounded">Secret</span>
                </div>
              </div>
            </div>

            {/* NetworkPolicy 底部 */}
            <div className="border border-red-500/40 rounded-lg p-2 bg-red-900/10 text-center">
              <p className="text-red-400 text-xs font-semibold">NetworkPolicy：Frontend → API → DB（逐層隔離）</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，回來了。總複習實戰的時間到了。

我們要從一個完全空的 Namespace 開始，部署一套完整的生產級應用。架構是這樣的：使用者透過 Ingress 用域名進來，/ 走前端、/api 走 API。API 連 MySQL 資料庫。前端有 2 個副本，API 有 3 個副本加上 HPA 自動擴縮，MySQL 用 StatefulSet 加 PVC 跑 1 個實例。所有 Pod 都有 Probe 和 Resource limits。NetworkPolicy 確保前端只能連 API、API 只能連 DB。`,
    duration: '5',
  },

  // ── Slide 10 12 步部署表 ──────────────────────────
  {
    title: '12 步部署',
    subtitle: '每一步對應一個概念',
    section: '總複習',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-center py-2 w-12">步驟</th>
                <th className="text-left py-2">做什麼</th>
                <th className="text-center py-2 w-20">第幾堂</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">1</td>
                <td className="py-1">建 Namespace</td>
                <td className="text-center py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">2</td>
                <td className="py-1">建 Secret（DB 密碼）</td>
                <td className="text-center py-1 text-cyan-400">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">3</td>
                <td className="py-1">建 ConfigMap（API 設定）</td>
                <td className="text-center py-1 text-cyan-400">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">4</td>
                <td className="py-1">部署 MySQL（StatefulSet + PVC）</td>
                <td className="text-center py-1 text-cyan-400">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">5</td>
                <td className="py-1">部署 API（Deployment + Probe + Resource）</td>
                <td className="text-center py-1 text-cyan-400">五 + 七</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">6</td>
                <td className="py-1">部署前端（Deployment）</td>
                <td className="text-center py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">7</td>
                <td className="py-1">建 Service</td>
                <td className="text-center py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">8</td>
                <td className="py-1">建 Ingress</td>
                <td className="text-center py-1 text-cyan-400">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">9</td>
                <td className="py-1">設 NetworkPolicy</td>
                <td className="text-center py-1 text-cyan-400">第七堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">10</td>
                <td className="py-1">設 HPA</td>
                <td className="text-center py-1 text-cyan-400">第七堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-1">11</td>
                <td className="py-1">完整驗證</td>
                <td className="text-center py-1 text-cyan-400">全部</td>
              </tr>
              <tr>
                <td className="text-center py-1">12</td>
                <td className="py-1">壓測 HPA（選做）</td>
                <td className="text-center py-1 text-cyan-400">第七堂</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `一共 12 步。大家看投影片上的表格，每一步都對應到前幾堂學的知識。這就是為什麼這是「總複習」— 你會用到第五堂到第七堂學的幾乎所有概念。

大家打開 final-exam 目錄，裡面有所有的 YAML 檔案。我們一步一步來。`,
    duration: '5',
  },

  // ── Slide 11 總複習 Step 1-4 ──────────────────────
  {
    title: '總複習 Step 1-4',
    subtitle: 'Namespace → Secret → ConfigMap → MySQL',
    section: '總複習',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證重點</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- Namespace: prod 狀態是 Active</p>
            <p>- Secret: mysql-secret 已建立</p>
            <p>- ConfigMap: api-config + frontend-nginx-config</p>
            <p>- MySQL: mysql-0 變成 1/1 Running + PVC 自動建立</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：建 Namespace
kubectl apply -f final-exam/namespace.yaml
kubectl get ns prod

# Step 2：建 Secret
kubectl apply -f final-exam/secret.yaml
kubectl get secret -n prod

# Step 3：建 ConfigMap
kubectl apply -f final-exam/configmap.yaml
kubectl get configmap -n prod

# Step 4：部署 MySQL
kubectl apply -f final-exam/mysql-statefulset.yaml
kubectl get pods -n prod -w
# 等 mysql-0 變成 1/1 Running
kubectl get pvc -n prod`,
    notes: `好，開始。Step 1 建 Namespace。看一下 Status 是 Active，好。

Step 2 建 Secret，存 MySQL 的密碼。注意所有資源都要加 -n prod，因為我們的東西都在 prod Namespace 裡。

Step 3 建 ConfigMap，存 API 的設定和前端的 nginx 設定。你應該看到 api-config 和 frontend-nginx-config 兩個 ConfigMap。

Step 4 部署 MySQL。這是最重要的一步，因為 StatefulSet 加 PVC 加 Headless Service 加 Secret 注入，把第六堂學的好幾個概念串在一起了。

MySQL 啟動比較慢，可能需要 30 到 60 秒。你會看到 mysql-0 從 0/1 慢慢變成 1/1 Running。順便看一下 PVC 有沒有自動建立，你應該看到 mysql-data-mysql-0 這個 PVC，狀態是 Bound。這就是 StatefulSet 的 volumeClaimTemplates 自動幫你建的。`,
    duration: '15',
  },

  // ── Slide 12 總複習 Step 5-8 ──────────────────────
  {
    title: '總複習 Step 5-8',
    subtitle: 'API → Frontend → Service → Ingress',
    section: '總複習',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">API Deployment 用到的概念</p>
          <div className="flex gap-2 flex-wrap text-xs">
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">Deployment</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">Probe x3</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">Resource</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">ConfigMap</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">Secret</span>
          </div>
        </div>
      </div>
    ),
    code: `# Step 5：部署 API（3 副本 + Probe + Resource + ConfigMap + Secret）
kubectl apply -f final-exam/api-deployment.yaml
kubectl get pods -n prod -l app=api

# Step 6：部署前端（2 副本 + ConfigMap 掛載 nginx 設定）
kubectl apply -f final-exam/frontend-deployment.yaml
kubectl get pods -n prod -l app=frontend

# Step 7：建 Service
kubectl apply -f final-exam/services.yaml
kubectl get svc -n prod

# Step 8：建 Ingress
kubectl apply -f final-exam/ingress.yaml
kubectl get ingress -n prod`,
    notes: `Step 5 部署 API。這個 Deployment 有 3 個副本，有 liveness、readiness、startup 三種 Probe，有 resource requests 和 limits，還從 ConfigMap 和 Secret 載入環境變數。一個 YAML 裡面用到了五個概念。

等三個 Pod 都是 Running。

Step 6 部署前端。兩個 Pod。前端還透過 ConfigMap 掛載了自訂的 nginx 設定檔，裡面設定了 /api/ 的反向代理。

Step 7 建 Service。你應該看到 api-svc 和 frontend-svc 兩個 ClusterIP Service。加上之前 Step 4 建的 mysql-headless，一共三個 Service。

Step 8 建 Ingress。Ingress 設定了 myapp.local 這個域名，/ 走前端、/api 走 API。

到這一步，你的應用在功能上已經完整了。接下來的 Step 9 和 10 是加上安全和彈性。`,
    duration: '15',
  },

  // ── Slide 13 總複習 Step 9-12 ─────────────────────
  {
    title: '總複習 Step 9-12',
    subtitle: 'NetworkPolicy → HPA → 驗證 → 壓測',
    section: '總複習',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Step 11 完整驗證 — 你應該看到</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 3 個 Deployment + 1 個 StatefulSet</p>
            <p>- 6+ 個 Pod（全部 Running）</p>
            <p>- 3 個 Service + 1 個 Ingress</p>
            <p>- 3 個 NetworkPolicy + 1 個 HPA</p>
            <p>- 1 個 PVC（Bound）</p>
          </div>
        </div>
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">恭喜！你從一個空的 Namespace 部署了完整的生產級應用。</p>
        </div>
      </div>
    ),
    code: `# Step 9：設 NetworkPolicy
kubectl apply -f final-exam/networkpolicy.yaml
kubectl get networkpolicy -n prod

# Step 10：設 HPA
kubectl apply -f final-exam/hpa.yaml
kubectl get hpa -n prod

# Step 11：完整驗證
kubectl get all -n prod
kubectl get pvc -n prod
kubectl get ingress -n prod
kubectl get networkpolicy -n prod
kubectl get hpa -n prod

# Step 12：壓測（選做）
kubectl run load-test --image=busybox:1.36 -n prod --rm -it --restart=Never -- \\
  sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"

# 清理
kubectl delete namespace prod`,
    notes: `Step 9 設 NetworkPolicy。我們有三條規則：DB 只接受 API 的連線、API 只接受前端和 Ingress Controller 的連線、前端只接受 Ingress Controller 的連線。三層隔離。

Step 10 設 HPA。API 的 CPU 超過 70% 就自動擴容，最多 10 個 Pod。

Step 11 完整驗證。用 kubectl get all -n prod 看一下所有資源。你應該看到一大堆東西：3 個 Deployment、1 個 StatefulSet、6 個以上的 Pod、3 個 Service、1 個 HPA。再看 PVC、Ingress、NetworkPolicy 也都在。

恭喜！你剛才從一個空的 Namespace 開始，部署了一套完整的生產級應用。用到了 Namespace、Secret、ConfigMap、StatefulSet、PVC、Deployment、Probe、Resource、Service、Ingress、NetworkPolicy、HPA。這就是四堂課學到的所有核心概念。

Step 12 是選做的壓測。最後別忘了清理：kubectl delete namespace prod。一行就搞定。`,
    duration: '15',
  },

  // ── Slide 14 Docker → K8s 對照表 ─────────────────
  {
    title: '課程回顧：Docker → K8s 對照表',
    subtitle: '四堂課的旅程',
    section: '課程回顧',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">四堂課的進化</p>
          <div className="space-y-1 text-slate-300 text-sm font-mono">
            <p><span className="text-cyan-400">第四堂</span>：K8s 架構 + Pod + kubectl → 能跑一個容器</p>
            <p><span className="text-cyan-400">第五堂</span>：Deployment + Service + DNS → 多副本 + 可存取</p>
            <p><span className="text-cyan-400">第六堂</span>：Ingress + ConfigMap + PV + Helm → 專業化</p>
            <p><span className="text-cyan-400">第七堂</span>：Probe + Resource + RBAC + NetworkPolicy → 生產級</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker → K8s 完整對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1">Docker</th>
                <th className="text-left py-1">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 text-xs">
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker run</code></td>
                <td className="py-1">Pod</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker compose up</code></td>
                <td className="py-1"><code>kubectl apply -f</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>-p 8080:80</code></td>
                <td className="py-1">Service (NodePort)</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">Nginx 反向代理</td>
                <td className="py-1">Ingress</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>-e ENV_VAR</code></td>
                <td className="py-1">ConfigMap</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>docker volume</code></td>
                <td className="py-1">PVC</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>HEALTHCHECK</code></td>
                <td className="py-1">Probe (liveness/readiness)</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>--memory --cpus</code></td>
                <td className="py-1">resources requests/limits</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1"><code>--scale web=5</code></td>
                <td className="py-1">HPA</td>
              </tr>
              <tr>
                <td className="py-1"><code>docker network</code> 隔離</td>
                <td className="py-1">NetworkPolicy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，總複習做完了。我們來回顧一下整個四堂課的旅程。

第四堂，你第一次認識 K8s，學了架構、Pod、kubectl 的基本指令。那時候你能做的就是跑一個容器，跟 docker run 差不多。

第五堂，你學了 Deployment 和 Service，能夠跑多個副本、讓 Pod 之間互相連線、讓外面的人連進來。

第六堂，你學了 Ingress 讓使用者用域名連、ConfigMap 和 Secret 管理設定、PV 和 PVC 做資料持久化、Helm 做套件管理。

第七堂，也就是今天，你學了 Probe 做健康檢查、Resource 和 HPA 管理資源和自動擴縮、RBAC 做權限控制、NetworkPolicy 做網路隔離。然後你把所有東西串起來，做了一次完整的生產級部署。

投影片上有一張完整的 Docker → K8s 對照表。你在 Docker 課程裡學的每一個概念，都能在 K8s 找到對應的東西。K8s 不是一個全新的東西，它是 Docker 的延伸和進化。`,
    duration: '5',
  },

  // ── Slide 15 知識地圖 ─────────────────────────────
  {
    title: 'K8s 核心知識地圖',
    subtitle: '四堂課的全部概念分類',
    section: '課程回顧',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">工作負載</p>
            <div className="space-y-1 text-slate-300 text-xs">
              <p>Pod / ReplicaSet / Deployment</p>
              <p>StatefulSet / DaemonSet</p>
              <p>Job / CronJob</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">網路</p>
            <div className="space-y-1 text-slate-300 text-xs">
              <p>Service (ClusterIP / NodePort / LB)</p>
              <p>Ingress / CoreDNS</p>
              <p>NetworkPolicy</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">配置管理</p>
            <div className="space-y-1 text-slate-300 text-xs">
              <p>ConfigMap / Secret</p>
              <p>Namespace</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">儲存</p>
            <div className="space-y-1 text-slate-300 text-xs">
              <p>PersistentVolume (PV)</p>
              <p>PersistentVolumeClaim (PVC)</p>
              <p>StorageClass</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">運維監控</p>
            <div className="space-y-1 text-slate-300 text-xs">
              <p>Probe (liveness/readiness/startup)</p>
              <p>Resource requests/limits</p>
              <p>HPA / kubectl top</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">安全</p>
            <div className="space-y-1 text-slate-300 text-xs">
              <p>RBAC (Role / RoleBinding)</p>
              <p>ServiceAccount</p>
              <p>NetworkPolicy</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <p className="text-cyan-400 font-semibold text-sm">工具</p>
          <p className="text-slate-300 text-xs">kubectl / Helm / K9s / Lens</p>
        </div>
      </div>
    ),
    notes: `這張知識地圖把四堂課的所有概念做了一個分類。工作負載有六種：Pod、ReplicaSet、Deployment、StatefulSet、DaemonSet、Job/CronJob。網路有四個：Service、Ingress、CoreDNS、NetworkPolicy。配置管理有 ConfigMap、Secret、Namespace。儲存有 PV、PVC、StorageClass。運維有 Probe、Resource、HPA。安全有 RBAC 和 NetworkPolicy。

你不需要全部背下來，但建議你把這張圖印出來貼在電腦旁邊。當你在工作中遇到某個問題的時候，先看看這張圖上有沒有對應的概念，然後去查文件。`,
    duration: '5',
  },

  // ── Slide 16 接下來學什麼 + CKA ──────────────────
  {
    title: '接下來學什麼',
    subtitle: '推薦的學習路線',
    section: '課程回顧',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">學習路線</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-400 text-xs shrink-0">現在</span>
              <span>能部署和管理應用</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-1 rounded text-cyan-400 text-xs shrink-0">下一步</span>
              <span>CKA 認證（涵蓋約 60%，額外學 kubeadm、etcd、Taint/Toleration）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-900/40 border border-purple-500/30 px-2 py-1 rounded text-purple-400 text-xs shrink-0">進階</span>
              <span>CKAD / CKS / Istio / ArgoCD / Operator</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">推薦資源</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- Kubernetes 官方文件（考試可以查！）</p>
            <p>- Killer.sh — CKA 模擬考</p>
            <p>- KodeKloud — 互動式練習</p>
            <p>- K8s the Hard Way — 從零手動搭建（理解底層）</p>
          </div>
        </div>
      </div>
    ),
    notes: `學完這四堂課之後，接下來學什麼？我推薦考 CKA — Certified Kubernetes Administrator。它是 CNCF 官方認證，業界認可度很高。考試是線上實作，不是選擇題，你要在真實的叢集上操作。

我們四堂課學的內容大概涵蓋了 CKA 約 60% 的知識點。還需要額外學的包括：用 kubeadm 從零搭建叢集、etcd 備份和還原、網路除錯、Taint/Toleration 和 Node Affinity、PDB。

推薦資源方面，K8s 官方文件是最好的學習資料，而且 CKA 考試可以查官方文件。Killer.sh 是很好的模擬考平台。KodeKloud 有互動式練習環境。如果你想深入理解底層原理，可以挑戰 Kubernetes the Hard Way。`,
    duration: '5',
  },

  // ── Slide 17 面試題 ──────────────────────────────
  {
    title: '常見面試題',
    subtitle: '測試自己學會了沒',
    section: '課程回顧',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-cyan-400 font-semibold">Q1：Pod 和 Container 的差別？</p>
              <p className="text-slate-400 text-xs">→ Pod 是最小調度單位，可包含多個 Container，共享網路和儲存</p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold">Q2：Deployment 和 StatefulSet 的差別？</p>
              <p className="text-slate-400 text-xs">→ Deployment 適合無狀態（API），StatefulSet 適合有狀態（DB），有穩定標識和獨立 PVC</p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold">Q3：livenessProbe 和 readinessProbe 的差別？</p>
              <p className="text-slate-400 text-xs">→ liveness 失敗重啟容器，readiness 失敗從 Service 移除</p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold">Q4：requests 和 limits 的差別？</p>
              <p className="text-slate-400 text-xs">→ requests 是保底（排程依據），limits 是天花板（硬限制）</p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold">Q5：如何實現滾動更新不停機？</p>
              <p className="text-slate-400 text-xs">→ Deployment Rolling Update + readinessProbe</p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold">Q6：如何確保只有 API 能連 DB？</p>
              <p className="text-slate-400 text-xs">→ NetworkPolicy 限制 ingress 流量</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `最後給大家一些常見的 K8s 面試題，你可以用來測試自己學會了沒。

第一題：Pod 和 Container 的差別是什麼？答案是 Pod 是 K8s 最小的調度單位，一個 Pod 裡面可以有多個 Container，它們共享網路和儲存。

第二題：Deployment 和 StatefulSet 的差別？Deployment 適合無狀態的應用，像 API Server。StatefulSet 適合有狀態的，像資料庫，因為它提供穩定的網路標識和每個 Pod 獨立的 PVC。

第三題：liveness 和 readiness 的差別？liveness 失敗重啟容器，readiness 失敗從 Service 移除。

第四題：requests 和 limits 的差別？requests 是保底、排程依據，limits 是天花板、硬限制。

第五題：如何實現滾動更新不停機？靠 Deployment 的 Rolling Update 策略加上 readinessProbe。

第六題：如何確保只有 API 能連 DB？用 NetworkPolicy 限制 DB Pod 的 ingress 流量。

這六題涵蓋了四堂課的核心概念。如果你都能流暢地回答，恭喜你，K8s 的基礎已經很扎實了。`,
    duration: '5',
  },

  // ── Slide 18 結語 ─────────────────────────────────
  {
    title: '結業',
    subtitle: '從零到能部署生產級 K8s 應用',
    section: '結語',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">七堂課的旅程</p>
          <div className="space-y-1 text-slate-300 text-sm font-mono">
            <p>第一堂（Docker 基礎）：docker run → 跑一個容器</p>
            <p>第二堂（Docker 進階）：Docker Compose → 跑多個容器</p>
            <p>第三堂（Docker 實戰）：Dockerfile + CI → 自動化</p>
            <p>第四堂（K8s 入門）：Pod + kubectl → 在叢集上跑</p>
            <p>第五堂（服務與網路）：Deployment + Service → 多副本 + 可存取</p>
            <p>第六堂（設定與資料）：Ingress + ConfigMap + PV + Helm → 專業化</p>
            <p>第七堂（生產就緒）：Probe + HPA + RBAC + NetworkPolicy → 生產級</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">你已經具備的能力</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 能在 K8s 叢集上部署和管理多服務應用</p>
            <p>- 會設定健康檢查、資源限制、自動擴縮</p>
            <p>- 會做基本的權限控制和網路隔離</p>
            <p>- 會用 Helm 安裝和管理複雜應用</p>
            <p>- 有一套系統化的排錯流程</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">總複習你做到了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ 瀏覽器打域名看到前端頁面</p>
            <p>✓ 前端能呼叫 API → API 能讀寫 MySQL</p>
            <p>✓ 刪掉一個 API Pod → 自動重建 → 服務不中斷</p>
            <p>✓ 前端 Pod 連不到 DB（NetworkPolicy 生效）</p>
            <p>✓ 壓測後 API 自動擴容（HPA 生效）</p>
          </div>
        </div>

        <div className="bg-cyan-900/30 border border-cyan-500/40 p-4 rounded-lg text-center">
          <p className="text-cyan-400 font-bold text-lg">Keep Learning. Keep Building.</p>
        </div>
      </div>
    ),
    notes: `好，我們的課程到這裡就全部結束了。

讓我們最後回顧一下你走過的路。七堂課，從第一堂用 docker run 跑一個容器開始，到今天能從零部署一套完整的生產級 Kubernetes 應用。你會設定健康檢查讓 K8s 自動幫你重啟不健康的 Pod、會設定資源限制避免一個 Pod 吃光所有資源、會用 HPA 在流量暴增的時候自動擴容、會用 RBAC 控制誰能做什麼、會用 NetworkPolicy 隔離網路流量。

說實話，能學到這裡的人不多。容器和 K8s 的學習曲線是很陡的，很多人學到 Deployment 就放棄了。但你堅持學完了。

最後我想說的是，今天學到的東西只是 K8s 的基礎。K8s 的生態系統非常龐大，有太多東西可以深入學習。但你已經有了一個扎實的地基，接下來不管是考 CKA、學 Service Mesh、還是在工作中用 K8s，你都有足夠的基礎知識去理解和學習更進階的概念。

Keep Learning. Keep Building. 大家辛苦了，我們七堂課的容器課程到這裡圓滿結束。謝謝大家！`,
    duration: '5',
  },
]
