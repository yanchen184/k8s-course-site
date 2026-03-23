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
    notes: `K8s 預設網路政策是全通。所有 Pod 之間都可以互相通訊，不管在同一個 Namespace 還是不同 Namespace。

生產環境這就是安全隱患。前端 Pod 只需要連 API，不應該能直接連資料庫。如果前端 Pod 被入侵了，攻擊者可以直接存取資料庫。

Docker 的做法是 docker network create 隔離，不同 network 的容器不能互連。K8s 的 NetworkPolicy 更精細 — Pod 等級的防火牆，可以用 label selector 指定「只有帶某個 label 的 Pod 才能連我」。`,
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
    notes: `NetworkPolicy 四個欄位：podSelector 指定規則套用在哪些 Pod；policyTypes 指定管 ingress（進來）還是 egress（出去）；ingress/egress 區塊定義具體規則。

容易混淆的點：NetworkPolicy 的「ingress」是「進入 Pod 的流量」（網路層），跟第六堂的「Ingress Controller」（HTTP 路由）完全不同。

看 YAML 範例。podSelector 選 role: database，只套用在 DB Pod 上。policyTypes 設 Ingress，只管進來的流量。ingress.from 的 podSelector 設 role: api，只有帶 role=api 的 Pod 才能連進來。ports 設 TCP 3306，只開 MySQL port。

重要：一旦設了 NetworkPolicy，所有不在規則裡的流量都會被拒絕。預設全拒、只開明確允許的。`,
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
    notes: `networkpolicy-db.yaml 裡面有四個資源：假的 DB Deployment（nginx 模擬）、DB Service、假的 API Deployment、一條 NetworkPolicy。

kubectl apply -f networkpolicy-db.yaml，等 Pod 跑起來。

從 API Pod 連 DB：有回應表示連線成功。從一個沒有 role=api label 的 Pod 連 DB：3 秒後 timeout，流量被 NetworkPolicy 擋掉了。

注意：NetworkPolicy 需要 CNI 支援。Calico、Cilium、Weave 支援；k3s 預設的 Flannel 不支援。如果兩個都能連，就是 CNI 不支援。生產環境用 Calico 或 Cilium。`,
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
    notes: `小結：K8s 預設全通，加 NetworkPolicy 後變預設拒絕。常見設計按三層架構：前端只接受 Ingress Controller、API 只接受前端、DB 只接受 API。`,
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
    notes: `DaemonSet 保證每個 Node 上恰好跑一個 Pod。加新 Node 自動建 Pod，移除 Node 自動刪 Pod。

對比 Deployment：replicas: 3 由 Scheduler 決定分布在哪些 Node，可能 Node A 跑 2 個、Node C 一個都沒有。DaemonSet 則是每個 Node 各一個。

典型用途：日誌收集（Fluentd/Filebeat）、監控 agent（Prometheus Node Exporter）、網路插件（kube-proxy 本身就是 DaemonSet）。

YAML 跟 Deployment 幾乎一樣，差別在 kind: DaemonSet，沒有 replicas 欄位 — 副本數就是 Node 數。Docker Compose 沒有對應的概念。`,
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
    notes: `Deployment 是「跑了就不停」，適合 Web Server。Job 是「跑完就結束」，適合資料庫遷移、批次處理、備份。Pod 跑完主行程就停，狀態變 Completed。失敗時根據 backoffLimit 重試。

CronJob 是定時版的 Job，給 cron 表達式按排程建立 Job。cron 五個欄位：分、時、日、月、星期。語法跟 Linux crontab 完全一樣。

實作：先 kubectl apply -f daemonset.yaml，kubectl get daemonset 看 DESIRED 和 CURRENT 等於 Node 數量。再 kubectl apply -f cronjob.yaml，等一兩分鐘後 kubectl get jobs 會看到 CronJob 每分鐘建一個新 Job。successfulJobsHistoryLimit: 3 只保留最近 3 個成功的 Job。`,
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
    notes: `排錯 SOP 固定四步：
1. kubectl get pods — 看 STATUS 異常
2. kubectl describe pod — 看 Events 區塊
3. kubectl logs — 看應用日誌
4. kubectl exec -it -- sh — 進容器內部檢查

對應 Docker：docker ps → docker inspect → docker logs → docker exec。

常見 STATUS 對照：ImagePullBackOff = image 名字打錯或私有倉庫沒認證。CrashLoopBackOff = 應用啟動就 crash，先看 logs。Pending = 沒有 Node 有足夠資源。OOMKilled = 記憶體超過 limits。CreateContainerConfigError = ConfigMap/Secret 不存在。

進階工具：kubectl get events --sort-by=.lastTimestamp 看叢集事件、kubectl top pods/nodes 看資源用量、K9s 終端機版管理器。`,
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
    notes: `etcd 是 K8s 的資料庫，所有 Deployment、Pod、Service、Secret、ConfigMap 全部存在 etcd 裡。etcd 掛了沒備份 = 整個叢集狀態消失。

備份指令：etcdctl snapshot save，需要指定 --endpoints、--cacert、--cert、--key 四個參數。還原：etcdctl snapshot restore。CKA 必考。

k3s 環境裡 etcd 被換成 SQLite（單節點）或嵌入式 etcd（多節點），操作方式不同。要練 etcd 備份還原，建議用 kubeadm 建的叢集。`,
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
    notes: `總複習：從空的 Namespace 部署完整生產級應用。

架構：Ingress（myapp.local）→ / 走前端（2 副本）、/api 走 API（3 副本 + HPA）→ MySQL（StatefulSet + PVC）。所有 Pod 設 Probe + Resource limits。NetworkPolicy 逐層隔離：Frontend → API → DB。`,
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
    notes: `12 步，每步對應一個概念，涵蓋第五堂到第七堂幾乎所有知識點。打開 final-exam 目錄，裡面有所有 YAML 檔案。`,
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
    notes: `Step 1：kubectl apply -f namespace.yaml，確認 Status 是 Active。

Step 2：kubectl apply -f secret.yaml，存 MySQL 密碼。注意後續所有指令都要加 -n prod。

Step 3：kubectl apply -f configmap.yaml，應該看到 api-config 和 frontend-nginx-config 兩個 ConfigMap。

Step 4：kubectl apply -f mysql-statefulset.yaml。這一步串了 StatefulSet + PVC + Headless Service + Secret 注入。MySQL 啟動需要 30-60 秒，mysql-0 從 0/1 變成 1/1 Running。kubectl get pvc -n prod 應該看到 mysql-data-mysql-0 狀態 Bound — 這是 volumeClaimTemplates 自動建的。`,
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
    notes: `Step 5：kubectl apply -f api-deployment.yaml。API Deployment 包含 3 副本、liveness/readiness/startup 三種 Probe、resource requests/limits、ConfigMap 和 Secret 環境變數注入。等三個 Pod 都是 Running。

Step 6：kubectl apply -f frontend-deployment.yaml。2 個副本，透過 ConfigMap 掛載自訂 nginx.conf（設定 /api/ 反向代理）。

Step 7：kubectl apply -f services.yaml。應該看到 api-svc、frontend-svc 兩個 ClusterIP Service，加上 Step 4 的 mysql-headless 共三個。

Step 8：kubectl apply -f ingress.yaml。myapp.local 域名，/ 走前端、/api 走 API。`,
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
    notes: `Step 9：kubectl apply -f networkpolicy.yaml。三條規則：DB 只接受 API、API 只接受前端和 Ingress Controller、前端只接受 Ingress Controller。

Step 10：kubectl apply -f hpa.yaml。API CPU 超過 70% 自動擴容，最多 10 個 Pod。

Step 11：kubectl get all -n prod 驗證。預期：3 Deployment + 1 StatefulSet、6+ Pod 全部 Running、3 Service + 1 Ingress、3 NetworkPolicy + 1 HPA、1 PVC Bound。

Step 12（選做）：跑壓測 Pod 打 api-svc，觀察 HPA 擴容。清理：kubectl delete namespace prod。`,
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
    notes: `四堂課回顧：
- 第四堂：架構 + Pod + kubectl → 跑一個容器（等同 docker run）
- 第五堂：Deployment + Service + DNS → 多副本 + 可存取
- 第六堂：Ingress + ConfigMap/Secret + PV/PVC + Helm → 專業化部署
- 第七堂：Probe + Resource/HPA + RBAC + NetworkPolicy → 生產級

投影片上的 Docker → K8s 對照表：docker run → Pod、-p → Service、volume → PVC、HEALTHCHECK → Probe、--memory/--cpus → resources、docker network → NetworkPolicy。每個 Docker 概念在 K8s 都有對應物。`,
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
    notes: `知識地圖分六大類：
- 工作負載：Pod、ReplicaSet、Deployment、StatefulSet、DaemonSet、Job/CronJob
- 網路：Service（ClusterIP/NodePort/LB）、Ingress、CoreDNS、NetworkPolicy
- 配置：ConfigMap、Secret、Namespace
- 儲存：PV、PVC、StorageClass
- 運維：Probe、Resource requests/limits、HPA、kubectl top
- 安全：RBAC（Role/RoleBinding）、ServiceAccount、NetworkPolicy

工作中遇到問題先對照這張圖找對應概念，再查官方文件。`,
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
    notes: `推薦下一步：CKA（Certified Kubernetes Administrator），CNCF 官方認證，線上實作考試（不是選擇題）。

四堂課涵蓋 CKA 約 60%。額外要學：kubeadm 搭建叢集、etcd 備份還原、網路除錯、Taint/Toleration、Node Affinity、PodDisruptionBudget。

資源：K8s 官方文件（考試可查）、Killer.sh（模擬考）、KodeKloud（互動練習）、Kubernetes the Hard Way（底層原理）。`,
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
    notes: `六題常見面試題：

Q1 Pod vs Container：Pod 是最小調度單位，可包含多個 Container，共享網路（同一個 IP）和儲存。

Q2 Deployment vs StatefulSet：Deployment 適合無狀態（API），StatefulSet 適合有狀態（DB）— 穩定網路標識（pod-0, pod-1）+ 獨立 PVC。

Q3 livenessProbe vs readinessProbe：liveness 失敗重啟容器，readiness 失敗從 Service endpoints 移除。

Q4 requests vs limits：requests 是保底（Scheduler 排程依據），limits 是天花板（超過 CPU 被 throttle、超過 memory 被 OOMKill）。

Q5 滾動更新不停機：Deployment Rolling Update + readinessProbe 確保新 Pod ready 才接流量。

Q6 只有 API 能連 DB：NetworkPolicy 的 ingress.from.podSelector 限制只有 role=api 的 Pod 能連。`,
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
    notes: `七堂課總結：
- 第 1-3 堂（Docker）：docker run → Docker Compose → Dockerfile + CI
- 第 4-7 堂（K8s）：Pod → Deployment + Service → Ingress + ConfigMap + PV + Helm → Probe + HPA + RBAC + NetworkPolicy

你現在具備的能力：在 K8s 叢集上部署多服務應用、設定 Probe/Resource/HPA、做 RBAC 權限控制和 NetworkPolicy 網路隔離、用 Helm 管理套件、有系統化的排錯流程。

下一步建議：在工作中實際操作，遇到問題查官方文件。準備好了就挑戰 CKA 認證。`,
    duration: '5',
  },
]
