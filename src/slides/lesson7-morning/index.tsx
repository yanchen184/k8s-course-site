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
  // ── Slide 1 開場 + 回顧 ───────────────────────────
  {
    title: '第七堂：生產就緒',
    subtitle: '安全、監控與總複習',
    section: '開場',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第六堂我們學了什麼</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-center py-2 w-28">主題</th>
                <th className="text-left py-2">一句話</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Ingress</td>
                <td className="py-2">用域名 + 路徑規則取代 NodePort，一個入口分流多個 Service</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">ConfigMap</td>
                <td className="py-2">設定檔抽出來，不寫死在 Image 裡</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Secret</td>
                <td className="py-2">敏感資料（密碼、Token）用 Base64 編碼儲存</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">PV / PVC</td>
                <td className="py-2">Pod 重啟資料不見？用 PVC 申請持久化儲存</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">StatefulSet</td>
                <td className="py-2">資料庫用 StatefulSet，每個 Pod 有穩定名稱 + 自己的 PVC</td>
              </tr>
              <tr>
                <td className="text-center py-2">Helm</td>
                <td className="py-2">K8s 的套件管理器，一行裝好複雜應用</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">第六堂的反思問題</p>
          <p className="text-slate-300 text-sm italic">「你的系統全部跑起來了，但你怎麼知道 API 有沒有卡死？Pod 顯示 Running，流量照送，使用者看到 502。怎麼辦？」</p>
          <p className="text-cyan-400 font-semibold mt-2">→ 答案就是今天第一個主題：Probe（健康檢查）</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天的旅程</p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Probe</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Resource/HPA</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">RBAC</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">NetworkPolicy</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">總複習</span>
          </div>
        </div>
      </div>
    ),
    notes: `快速回顧第六堂：Ingress 用域名分流多個 Service、ConfigMap/Secret 把設定和密碼抽出 Image、PV/PVC 持久化儲存、StatefulSet 跑資料庫、Helm 一行裝好複雜應用。

上堂課的反思問題：「Pod 顯示 Running，但 API 死鎖了、DB 連線池滿了，K8s 還是把流量轉過去，使用者看到 502。」答案就是今天第一個主題 — Probe，健康檢查。

今天的路線：Probe → Resource/HPA → RBAC → NetworkPolicy → 總複習實戰。開始。`,
    duration: '5',
  },

  // ── Slide 2 痛點：Pod Running 不代表服務正常 ─────────
  {
    title: '痛點：Pod Running 不代表正常',
    subtitle: 'Running 只代表容器行程還在',
    section: 'Probe',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">Pod 狀態 Running ≠ 應用正常</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-semibold shrink-0">場景 1：</span>
              <div className="text-slate-300">
                <span className="text-slate-400">API 死鎖</span> — Pod 狀態 Running，實際情況：程式卡在無窮迴圈，不回應任何請求
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-semibold shrink-0">場景 2：</span>
              <div className="text-slate-300">
                <span className="text-slate-400">DB 連線池滿</span> — Pod 狀態 Running，實際情況：每個請求都回 500
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-semibold shrink-0">場景 3：</span>
              <div className="text-slate-300">
                <span className="text-slate-400">應用還在啟動</span> — Pod 狀態 Running，Spring Boot 要啟動 60 秒，前 60 秒全部失敗
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 怎麼做？</p>
          <p className="text-slate-300 text-sm">Dockerfile 的 HEALTHCHECK — 但只有一種，功能有限</p>
          <p className="text-cyan-400 font-semibold mt-3">K8s 的做法更強大：三種 Probe，各司其職</p>
        </div>
      </div>
    ),
    code: `# Dockerfile 的 HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost:8080/health || exit 1`,
    notes: `Running 只代表「容器主行程還活著」，不代表應用能正常服務。

三個場景：一、API 死鎖或無窮迴圈，行程在但不回應任何請求。二、DB 連線池滿，每個請求都回 500。三、Spring Boot 啟動要 60 秒，K8s 在啟動瞬間就轉流量，前 60 秒全部失敗。

Docker 對照：Dockerfile 的 HEALTHCHECK 指令只有一種，只能判定 healthy/unhealthy。K8s 有三種 Probe，各負責不同的事。`,
    duration: '5',
  },

  // ── Slide 3 三種 Probe 對比圖 ─────────────────────
  {
    title: '三種 Probe，各司其職',
    subtitle: 'livenessProbe / readinessProbe / startupProbe',
    section: 'Probe',
    content: (
      <div className="space-y-4">
        {/* 三種 Probe 對比圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">三種 Probe 對比</p>
          <div className="flex gap-3 flex-wrap justify-center">
            {/* livenessProbe */}
            <div className="border-2 border-red-500/70 rounded-lg p-3 bg-red-900/20 min-w-[160px] flex-1">
              <p className="text-red-400 text-sm font-bold text-center mb-2">livenessProbe</p>
              <div className="space-y-2 text-center">
                <div className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded">
                  <p className="text-red-300 text-xs font-semibold">你還活著嗎？</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded">
                  <p className="text-slate-300 text-xs">失敗 → 重啟容器</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded">
                  <p className="text-slate-400 text-xs">偵測死鎖、無窮迴圈</p>
                </div>
              </div>
            </div>
            {/* readinessProbe */}
            <div className="border-2 border-blue-500/70 rounded-lg p-3 bg-blue-900/20 min-w-[160px] flex-1">
              <p className="text-blue-400 text-sm font-bold text-center mb-2">readinessProbe</p>
              <div className="space-y-2 text-center">
                <div className="bg-blue-900/40 border border-blue-500/30 px-2 py-1 rounded">
                  <p className="text-blue-300 text-xs font-semibold">準備好接流量了嗎？</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded">
                  <p className="text-slate-300 text-xs">失敗 → 從 Service 移除</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded">
                  <p className="text-slate-400 text-xs">啟動中、暫時過載</p>
                </div>
              </div>
            </div>
            {/* startupProbe */}
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/20 min-w-[160px] flex-1">
              <p className="text-amber-400 text-sm font-bold text-center mb-2">startupProbe</p>
              <div className="space-y-2 text-center">
                <div className="bg-amber-900/40 border border-amber-500/30 px-2 py-1 rounded">
                  <p className="text-amber-300 text-xs font-semibold">你啟動完了嗎？</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded">
                  <p className="text-slate-300 text-xs">失敗 → 重啟容器</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded">
                  <p className="text-slate-400 text-xs">啟動慢的應用（Java）</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 餐廳比喻 */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">生活化比喻：餐廳</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p><span className="text-red-400 font-semibold">livenessProbe</span> = 廚師還有心跳嗎？ → 沒有 → 換一個廚師（重啟）</p>
            <p><span className="text-blue-400 font-semibold">readinessProbe</span> = 廚師準備好出菜了嗎？ → 沒有 → 先不要送單進去（不轉流量）</p>
            <p><span className="text-amber-400 font-semibold">startupProbe</span> = 廚師還在熱鍋嗎？ → 是的 → 等他熱好再檢查其他的</p>
          </div>
        </div>
      </div>
    ),
    notes: `三種 Probe：

livenessProbe（存活探測）— 失敗就重啟容器。偵測死鎖、無窮迴圈這類不會自己恢復的問題。

readinessProbe（就緒探測）— 失敗不重啟，而是從 Service Endpoints 移除，不轉流量。恢復後自動加回來。適合啟動中、暫時過載的場景。

startupProbe（啟動探測）— 通過之前，liveness 和 readiness 都不會跑。給 Java 這類啟動慢的應用用的，避免啟動期間被 liveness 誤殺進入重啟迴圈。

餐廳比喻：liveness = 廚師有心跳嗎？沒有就換人。readiness = 廚師能出菜嗎？不能就先不送單。startup = 廚師在熱鍋嗎？等他熱好再檢查其他的。`,
    duration: '10',
  },

  // ── Slide 4 Probe 檢查方式圖 ──────────────────────
  {
    title: 'Probe 檢查方式',
    subtitle: 'HTTP GET / TCP Socket / exec',
    section: 'Probe',
    content: (
      <div className="space-y-4">
        {/* 三種檢查方式圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">三種檢查方式</p>
          <div className="flex gap-3 flex-wrap justify-center">
            {/* HTTP GET */}
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/20 min-w-[150px] flex-1">
              <p className="text-green-400 text-sm font-bold text-center mb-2">HTTP GET</p>
              <div className="space-y-2">
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">GET /health</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                  <p className="text-slate-300 text-xs">200-399 = 成功</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                  <p className="text-slate-400 text-xs">適合：Web API（最常用）</p>
                </div>
              </div>
            </div>
            {/* TCP Socket */}
            <div className="border-2 border-purple-500/70 rounded-lg p-3 bg-purple-900/20 min-w-[150px] flex-1">
              <p className="text-purple-400 text-sm font-bold text-center mb-2">TCP Socket</p>
              <div className="space-y-2">
                <div className="bg-purple-900/40 border border-purple-500/30 px-2 py-1 rounded text-center">
                  <p className="text-purple-300 text-xs">connect :3306</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                  <p className="text-slate-300 text-xs">能連上 = 成功</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                  <p className="text-slate-400 text-xs">適合：資料庫、Redis</p>
                </div>
              </div>
            </div>
            {/* exec */}
            <div className="border-2 border-cyan-500/70 rounded-lg p-3 bg-cyan-900/20 min-w-[150px] flex-1">
              <p className="text-cyan-400 text-sm font-bold text-center mb-2">exec 指令</p>
              <div className="space-y-2">
                <div className="bg-cyan-900/40 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">command: [...]</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                  <p className="text-slate-300 text-xs">exit 0 = 成功</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                  <p className="text-slate-400 text-xs">適合：自訂檢查邏輯</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 四個關鍵參數 */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">四個關鍵參數</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-44">參數</th>
                <th className="text-center py-2 w-16">預設</th>
                <th className="text-left py-2">白話</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">initialDelaySeconds</code></td>
                <td className="py-2 text-center">0</td>
                <td className="py-2">啟動後先等幾秒再開始檢查</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">periodSeconds</code></td>
                <td className="py-2 text-center">10</td>
                <td className="py-2">多久檢查一次</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">failureThreshold</code></td>
                <td className="py-2 text-center">3</td>
                <td className="py-2">連續失敗幾次才算不健康</td>
              </tr>
              <tr>
                <td className="py-2"><code className="text-xs">timeoutSeconds</code></td>
                <td className="py-2 text-center">1</td>
                <td className="py-2">每次檢查等多久算超時</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Docker 對照 */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker HEALTHCHECK 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Docker</th>
                <th className="text-left py-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">--interval=30s</code></td>
                <td className="py-2"><code className="text-xs">periodSeconds: 30</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">--timeout=3s</code></td>
                <td className="py-2"><code className="text-xs">timeoutSeconds: 3</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">--retries=3</code></td>
                <td className="py-2"><code className="text-xs">failureThreshold: 3</code></td>
              </tr>
              <tr>
                <td className="py-2">只有一種</td>
                <td className="py-2">liveness + readiness + startup 三種</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `三種檢查方式：HTTP GET 回傳 200-399 就成功，最常用於 Web API。TCP Socket 只檢查 port 能不能連上，適合 MySQL、Redis。exec 執行指令，exit 0 就成功，適合自訂檢查邏輯。

YAML 寫在 container 底下。httpGet 指定 path 和 port。四個關鍵參數：
- initialDelaySeconds: 5 — 啟動後等 5 秒再開始檢查
- periodSeconds: 10 — 每 10 秒檢查一次
- failureThreshold: 3 — 連續失敗 3 次才判定不健康（避免網路抖動誤判）
- timeoutSeconds: 1 — 每次檢查 1 秒沒回應算超時

Docker 對照：--interval = periodSeconds、--timeout = timeoutSeconds、--retries = failureThreshold、--start-period = initialDelaySeconds。差別是 Docker 只有一種 HEALTHCHECK，K8s 有三種。`,
    duration: '10',
  },

  // ── Slide 5 Probe YAML + 實作 ─────────────────────
  {
    title: '實作：Probe + 故意搞壞',
    subtitle: 'Lab 1：Health Check',
    section: 'Probe',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">預期結果</p>
          <div className="bg-slate-900/60 p-3 rounded text-xs font-mono text-slate-300 space-y-1">
            <p>NAME                 READY   STATUS    RESTARTS   AGE</p>
            <p>api-probe-demo-xxx   1/1     Running   0          2m</p>
            <p>api-probe-demo-xxx   0/1     Running   <span className="text-red-400">1</span>          2m30s  ← 重啟了！</p>
            <p>api-probe-demo-xxx   1/1     Running   <span className="text-red-400">1</span>          2m35s  ← 恢復正常</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：部署
kubectl apply -f deployment-probe.yaml
kubectl get pods -l app=api-probe-demo

# Step 2：確認 Probe 狀態
kubectl describe pods -l app=api-probe-demo | grep -A10 "Liveness\\|Readiness"

# Step 3：故意讓 livenessProbe 失敗
POD_NAME=$(kubectl get pods -l app=api-probe-demo -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
kubectl get pods -l app=api-probe-demo -w
# 觀察 RESTARTS 欄位會增加！`,
    notes: `操作步驟：

kubectl apply -f deployment-probe.yaml
kubectl get pods -l app=api-probe-demo
— 確認 READY 1/1、RESTARTS 0。

kubectl describe pods -l app=api-probe-demo | grep -A10 "Liveness\\|Readiness"
— 確認 Probe 設定的 path、delay、period、threshold。

故意搞壞：刪掉 index.html，nginx 回 403/404，livenessProbe 判定失敗。

POD_NAME=$(kubectl get pods -l app=api-probe-demo -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
kubectl get pods -l app=api-probe-demo -w

等約 30 秒（initialDelay 5s + period 10s x failureThreshold 3），RESTARTS 從 0 變 1。重啟後容器重新載入預設 index.html，livenessProbe 通過，Pod 恢復。`,
    duration: '15',
  },

  // ── Slide 6 startupProbe 概念 ──────────────────────
  {
    title: 'startupProbe：啟動慢的救星',
    subtitle: '避免慢啟動應用陷入重啟迴圈',
    section: 'Probe',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">沒有 startupProbe 的慘狀</p>
          <div className="space-y-1 text-slate-300 text-xs font-mono">
            <p>Java Spring Boot 啟動要 60 秒</p>
            <p className="text-slate-500">─────────────────────────────</p>
            <p>0s  → Pod 建立</p>
            <p>5s  → livenessProbe 開始 → 第 1 次失敗（initialDelay=5）</p>
            <p>15s → 第 2 次失敗（period=10）</p>
            <p>25s → 第 3 次失敗 → <span className="text-red-400">重啟！</span>（但應用才啟動 25 秒）</p>
            <p>∞   → <span className="text-red-400">永遠啟動不了，一直在重啟迴圈</span></p>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">有 startupProbe</p>
          <div className="space-y-1 text-slate-300 text-xs font-mono">
            <p>0s  → Pod 建立</p>
            <p>5s  → startupProbe 開始（每 5 秒，最多 10 次 = 等 55 秒）</p>
            <p>60s → <span className="text-green-400">startupProbe 通過！</span></p>
            <p>60s → 開始跑 livenessProbe 和 readinessProbe</p>
          </div>
        </div>
      </div>
    ),
    code: `# startupProbe YAML
startupProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 10     # 5 + (5 x 10) = 最多等 55 秒`,
    notes: `問題：Java Spring Boot 啟動要 60 秒，livenessProbe 設 initialDelay=5、period=10、failure=3，第 25 秒就連續失敗 3 次被重啟。應用永遠啟動不了，無窮重啟迴圈。

錯誤解法：把 initialDelaySeconds 設成 60。問題是運行中真的掛了也要等 60 秒才開始檢查，失去快速偵測的意義。

正確解法：用 startupProbe。startupProbe 通過之前，liveness 和 readiness 都不跑。設定 periodSeconds: 5、failureThreshold: 10，等於最多等 5 + 5x10 = 55 秒。啟動完後 liveness/readiness 接手，用嚴格設定監控。`,
    duration: '5',
  },

  // ── Slide 7 Probe 小結 ────────────────────────────
  {
    title: 'Probe 小結',
    subtitle: '三分鐘總結',
    section: 'Probe',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">五個重點</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-red-400 font-semibold">livenessProbe</span> → 掛了就重啟（偵測死鎖）</p>
            <p>2. <span className="text-blue-400 font-semibold">readinessProbe</span> → 沒好就不給流量（啟動中、暫時過載）</p>
            <p>3. <span className="text-amber-400 font-semibold">startupProbe</span> → 啟動慢的應用先等它（Java/Python ML）</p>
            <p>4. <span className="text-green-400 font-semibold">三種方式</span>：HTTP GET（Web API）、TCP Socket（DB）、exec（自訂）</p>
            <p>5. <span className="text-green-400 font-semibold">四個參數</span>：initialDelay、period、failureThreshold、timeout</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">最佳實踐</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 生產環境一定要設 liveness + readiness</p>
            <p>- 啟動超過 30 秒的應用加 startupProbe</p>
            <p>- liveness 的 initialDelaySeconds 要大於應用啟動時間</p>
            <p>- readiness 通常設得比 liveness 敏感（period 短、threshold 低）</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ kubectl get pods 看到 RESTARTS 數字增加（livenessProbe 觸發重啟）</p>
            <p>✓ readiness 失敗時 kubectl get endpoints 看到 Pod 被移除</p>
            <p>✓ 能解釋 liveness 和 readiness 的差異（重啟 vs 不轉流量）</p>
            <p>✓ 能寫出 HTTP GET 類型的 Probe YAML</p>
          </div>
        </div>
      </div>
    ),
    notes: `小結：liveness 掛了就重啟、readiness 沒好就不轉流量、startup 給慢啟動應用緩衝。三種方式：HTTP GET、TCP Socket、exec。四個參數：initialDelay、period、failureThreshold、timeout。

生產環境必設 liveness + readiness。啟動超過 30 秒的應用加 startupProbe。readiness 通常比 liveness 設得更敏感（period 短、threshold 低）。

休息十分鐘，回來講 Resource 管理。`,
    duration: '2',
  },

  // ── Slide 8 痛點：資源被吃光 ──────────────────────
  {
    title: '痛點：資源被吃光',
    subtitle: '一個 Pod 拖垮整台 Node',
    section: 'Resource',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">一個 Pod 吃光所有資源</p>
          <div className="space-y-1 text-slate-300 text-xs font-mono">
            <p>Node 總共 4GB 記憶體</p>
            <p className="text-slate-500">─────────────────────────────</p>
            <p>Pod A（你的 API）：需要 500MB</p>
            <p>Pod B（你的前端）：需要 200MB</p>
            <p>Pod C（有 memory leak）：不斷吃記憶體...</p>
            <p className="text-slate-500">─────────────────────────────</p>
            <p>0min  → Pod C: 500MB</p>
            <p>5min  → Pod C: 1GB</p>
            <p>10min → Pod C: 2GB</p>
            <p>15min → Pod C: 3.5GB → <span className="text-red-400">Node 記憶體不足！</span></p>
            <p>結果  → Linux OOM Killer 隨機殺行程</p>
            <p>       → <span className="text-red-400">你的 API 被殺了，不是因為它有 bug</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">requests vs limits</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-20"></th>
                <th className="text-left py-2">requests</th>
                <th className="text-left py-2">limits</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400">中文</td>
                <td className="py-2">資源請求（保底）</td>
                <td className="py-2">資源上限（天花板）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400">用途</td>
                <td className="py-2">Scheduler 排程依據</td>
                <td className="py-2">實際的硬限制</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400">超過</td>
                <td className="py-2">不會超過（保證給你）</td>
                <td className="py-2">CPU 被節流、記憶體 OOMKilled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Docker 的做法
docker run --memory=128m --cpus=0.5 nginx

# K8s 的做法
resources:
  requests:
    cpu: "100m"        # 保底 0.1 核
    memory: "64Mi"     # 保底 64Mi
  limits:
    cpu: "200m"        # 最多 0.2 核
    memory: "128Mi"    # 超過就 OOMKilled`,
    notes: `痛點：Node 4GB，Pod C 有 memory leak 不斷吃記憶體，沒設 limits 的話 Linux OOM Killer 隨機殺行程，你的 API Pod 無辜被殺。

Docker 對照：docker run --memory=128m --cpus=0.5，K8s 用 resources.requests 和 resources.limits。

requests = 保底，Scheduler 排程依據。K8s 保證至少給你這麼多資源。
limits = 天花板。CPU 超過被節流（變慢不殺），記憶體超過直接 OOMKilled。

YAML 寫在 container.resources 底下，單位：CPU 用 m（millicores），100m = 0.1 核。記憶體用 Mi/Gi。`,
    duration: '10',
  },

  // ── Slide 9 QoS 等級圖 ────────────────────────────
  {
    title: 'QoS 等級：誰先被殺？',
    subtitle: 'Quality of Service',
    section: 'Resource',
    content: (
      <div className="space-y-4">
        {/* QoS 等級圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">三種 QoS 等級（資源緊張時的殺 Pod 優先順序）</p>
          <div className="space-y-3">
            {/* Guaranteed */}
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/20 flex items-center gap-4">
              <div className="shrink-0 w-24">
                <p className="text-green-400 text-sm font-bold text-center">Guaranteed</p>
                <p className="text-green-300 text-[10px] text-center">最後被殺</p>
              </div>
              <div className="text-slate-300 text-xs flex-1">
                <p>條件：requests = limits（每個容器都設，且相等）</p>
                <p className="text-slate-400 mt-1">明確知道要用多少資源，K8s 保證給你</p>
              </div>
              <div className="bg-green-900/40 border border-green-500/30 px-3 py-1 rounded">
                <p className="text-green-300 text-xs font-semibold">最安全</p>
              </div>
            </div>
            {/* Burstable */}
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/20 flex items-center gap-4">
              <div className="shrink-0 w-24">
                <p className="text-amber-400 text-sm font-bold text-center">Burstable</p>
                <p className="text-amber-300 text-[10px] text-center">中間</p>
              </div>
              <div className="text-slate-300 text-xs flex-1">
                <p>條件：有設 requests 但 requests ≠ limits</p>
                <p className="text-slate-400 mt-1">至少需要這麼多，但可以用更多</p>
              </div>
              <div className="bg-amber-900/40 border border-amber-500/30 px-3 py-1 rounded">
                <p className="text-amber-300 text-xs font-semibold">還行</p>
              </div>
            </div>
            {/* BestEffort */}
            <div className="border-2 border-red-500/70 rounded-lg p-3 bg-red-900/20 flex items-center gap-4">
              <div className="shrink-0 w-24">
                <p className="text-red-400 text-sm font-bold text-center">BestEffort</p>
                <p className="text-red-300 text-[10px] text-center">最先被殺</p>
              </div>
              <div className="text-slate-300 text-xs flex-1">
                <p>條件：完全沒設 requests 和 limits</p>
                <p className="text-slate-400 mt-1">K8s 不知道你要用多少，資源緊張你第一個走</p>
              </div>
              <div className="bg-red-900/40 border border-red-500/30 px-3 py-1 rounded">
                <p className="text-red-300 text-xs font-semibold">危險</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold">→ 生產環境至少要設 requests，讓你的 Pod 不是 BestEffort</p>
        </div>
      </div>
    ),
    code: `# OOMKilled 實驗：記憶體限制 128Mi，但程式要用 256Mi
kubectl apply -f deployment-resources.yaml
kubectl get pods -l app=oom-demo -w
# 看到 OOMKilled → CrashLoopBackOff`,
    notes: `QoS 等級決定 Node 資源不夠時誰先被殺：

Guaranteed — requests = limits（每個容器都設且相等）→ 最後被殺。
Burstable — 有設 requests 但 requests != limits → 中間。
BestEffort — 完全沒設 requests/limits → 最先被殺。

生產環境至少設 requests（避免 BestEffort）。requests = limits 就是 Guaranteed。

OOMKilled 實驗：kubectl apply -f deployment-resources.yaml，oom-demo 跑 stress 工具吃 256Mi，但 limits 只給 128Mi。Pod 啟動後立刻被殺，STATUS 顯示 OOMKilled，反覆重啟後變 CrashLoopBackOff。生產環境看到 OOMKilled = limits 太小或 memory leak。`,
    duration: '10',
  },

  // ── Slide 10 HPA 自動擴縮流程圖 ──────────────────
  {
    title: 'HPA 自動擴縮',
    subtitle: 'Horizontal Pod Autoscaler',
    section: 'Resource',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">痛點：流量暴增</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>平常：2 個 Pod 就夠用</p>
            <p>大促銷：流量翻 10 倍，2 個 Pod 撐不住</p>
            <p>凌晨：沒人用，2 個 Pod 浪費資源</p>
          </div>
        </div>

        {/* HPA 流程圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">HPA 自動擴縮流程</p>
          <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
            <div className="border-2 border-red-500/70 rounded-lg p-2 bg-red-900/20 text-center">
              <p className="text-red-400 font-bold">CPU {'>'} 50%</p>
              <p className="text-red-300">流量暴增</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-cyan-500/70 rounded-lg p-2 bg-cyan-900/20 text-center">
              <p className="text-cyan-400 font-bold">HPA 偵測</p>
              <p className="text-cyan-300">metrics-server</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-green-500/70 rounded-lg p-2 bg-green-900/20 text-center">
              <p className="text-green-400 font-bold">自動增加副本</p>
              <p className="text-green-300">2 → 3 → 4</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-blue-500/70 rounded-lg p-2 bg-blue-900/20 text-center">
              <p className="text-blue-400 font-bold">流量分攤</p>
              <p className="text-blue-300">CPU 降回來</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center text-xs mt-3">
            <div className="border-2 border-green-500/70 rounded-lg p-2 bg-green-900/20 text-center">
              <p className="text-green-400 font-bold">流量下降</p>
              <p className="text-green-300">CPU {'<'} 50%</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-amber-500/70 rounded-lg p-2 bg-amber-900/20 text-center">
              <p className="text-amber-400 font-bold">冷卻 5 分鐘</p>
              <p className="text-amber-300">避免抖動</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-cyan-500/70 rounded-lg p-2 bg-cyan-900/20 text-center">
              <p className="text-cyan-400 font-bold">自動縮回</p>
              <p className="text-cyan-300">4 → 3 → 2</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-blue-500/70 rounded-lg p-2 bg-blue-900/20 text-center">
              <p className="text-blue-400 font-bold">省資源</p>
              <p className="text-blue-300">成本降低</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold">前提：Deployment 必須設 resources.requests（HPA 要算百分比）</p>
        </div>
      </div>
    ),
    code: `# HPA YAML
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-resources-demo     # 要擴縮的 Deployment
  minReplicas: 2                 # 最少 2 個
  maxReplicas: 8                 # 最多 8 個
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50 # CPU 超過 50% 就擴`,
    notes: `HPA（Horizontal Pod Autoscaler）— 根據 CPU 使用率（或自訂指標）自動增減 Pod 數量。

YAML 欄位：
- scaleTargetRef — 要擴縮的 Deployment 名稱
- minReplicas / maxReplicas — Pod 數量範圍
- metrics.resource.target.averageUtilization — CPU 超過此百分比就擴容

重要前提：Deployment 必須設 resources.requests。HPA 算的是「實際用量 / requests」的百分比，沒設 requests 就算不出來，kubectl get hpa 的 TARGETS 會顯示 <unknown>。

HPA 需要 metrics-server 收集指標，minikube 用 minikube addons enable metrics-server 啟用。`,
    duration: '15',
  },

  // ── Slide 11 實作：HPA 壓測 ───────────────────────
  {
    title: '實作：HPA 壓測',
    subtitle: 'Lab 3：看 HPA 自動擴容',
    section: 'Resource',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">觀察重點</p>
          <div className="bg-slate-900/60 p-3 rounded text-xs font-mono text-slate-300 space-y-1">
            <p>NAME       REFERENCE                  TARGETS   MINPODS   MAXPODS   REPLICAS</p>
            <p>api-hpa    Deployment/api-resources    0%/50%    2         8         2</p>
            <p>api-hpa    Deployment/api-resources    23%/50%   2         8         2</p>
            <p>api-hpa    Deployment/api-resources    <span className="text-red-400">67%</span>/50%   2         8         <span className="text-green-400">3</span></p>
            <p>api-hpa    Deployment/api-resources    <span className="text-red-400">82%</span>/50%   2         8         <span className="text-green-400">4</span></p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：確認 Deployment + 建 Service
kubectl apply -f deployment-resources.yaml
kubectl delete deployment oom-demo
kubectl expose deployment api-resources-demo --port=80 --target-port=80

# Step 2：部署 HPA
kubectl apply -f hpa.yaml
kubectl get hpa

# Step 3：壓測（另開終端機）
kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- \\
  sh -c "while true; do wget -qO- http://api-resources-demo > /dev/null 2>&1; done"

# Step 4：觀察
kubectl get hpa -w

# Step 5：停止壓測 Ctrl+C，觀察縮回來`,
    notes: `操作步驟：

kubectl apply -f deployment-resources.yaml
kubectl delete deployment oom-demo
kubectl expose deployment api-resources-demo --port=80 --target-port=80
kubectl apply -f hpa.yaml
kubectl get hpa — TARGETS 可能先顯示 <unknown>/50%，等 metrics-server 收集資料。

壓測（另開終端機）：
kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://api-resources-demo > /dev/null 2>&1; done"

觀察：kubectl get hpa -w，看 TARGETS 的 CPU% 上升，超過 50% 後 REPLICAS 從 2 變 3、4。

停止壓測 Ctrl+C 後，等約 5 分鐘（HPA 縮容冷卻期預設 5 分鐘），REPLICAS 自動縮回 2。`,
    duration: '15',
  },

  // ── Slide 12 Resource + HPA 小結 ──────────────────
  {
    title: 'Resource + HPA 小結',
    subtitle: '三分鐘總結',
    section: 'Resource',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">五個重點</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-cyan-400 font-semibold">requests</span> = 保底資源，Scheduler 用來排程</p>
            <p>2. <span className="text-cyan-400 font-semibold">limits</span> = 天花板，CPU 超過被節流、記憶體超過被 OOMKilled</p>
            <p>3. <span className="text-cyan-400 font-semibold">QoS</span> = Guaranteed {'>'} Burstable {'>'} BestEffort（沒設 = 最先被殺）</p>
            <p>4. <span className="text-cyan-400 font-semibold">HPA</span> = 根據 CPU（或自訂指標）自動加減 Pod</p>
            <p>5. <span className="text-cyan-400 font-semibold">HPA 前提</span> = Deployment 必須設 requests + 叢集要有 metrics-server</p>
          </div>
        </div>
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">最佳實踐</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 生產環境必設 requests + limits</p>
            <p>- requests 設實際用量的 70-80%</p>
            <p>- limits 設實際用量的 150-200%</p>
            <p>- HPA 的 maxReplicas 要考慮 Node 的承載力</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ 故意設太小的 memory limit → 看到 OOMKilled</p>
            <p>✓ kubectl get hpa 看到 TARGETS 欄位顯示 CPU 使用率</p>
            <p>✓ 壓測後 kubectl get pods -w 看到副本自動增加</p>
            <p>✓ 停止壓測後副本自動縮回來</p>
          </div>
        </div>
      </div>
    ),
    notes: `小結：requests = 保底（Scheduler 排程依據），limits = 天花板（CPU 節流、記憶體 OOMKilled）。QoS：Guaranteed > Burstable > BestEffort。HPA 根據 CPU% 自動擴縮，前提是設 requests + 裝 metrics-server。

最佳實踐：requests 設實際用量 70-80%、limits 設 150-200%。HPA 的 maxReplicas 要考慮 Node 承載力。

休息十分鐘，回來講 RBAC。`,
    duration: '2',
  },

  // ── Slide 13 痛點：誰都能刪 ───────────────────────
  {
    title: '痛點：誰都能刪',
    subtitle: '一條指令毀掉整個生產環境',
    section: 'RBAC',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">恐怖故事</p>
          <div className="bg-slate-900/60 p-3 rounded text-sm font-mono text-slate-300">
            <p className="text-slate-400"># 實習生不小心打了這個：</p>
            <p className="text-red-400">kubectl delete namespace prod</p>
            <p className="text-slate-400"># 整個生產環境的所有資源全部消失</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">目前的狀態</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- 所有人都用同一個 kubeconfig</p>
            <p>- 所有人都是 cluster-admin</p>
            <p>- 開發人員能存取生產環境</p>
            <p>- 沒有操作日誌</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker vs K8s</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>Docker → 沒有內建權限控制，能連到 Docker Socket 就等於 root</p>
            <p>K8s → 至少有 RBAC 可以細分權限</p>
          </div>
          <div className="mt-3 bg-cyan-900/30 border border-cyan-500/40 p-3 rounded">
            <p className="text-cyan-400 font-semibold text-sm">RBAC 的邏輯：誰（Subject）+ 能做什麼（Role）= RoleBinding</p>
          </div>
        </div>
      </div>
    ),
    notes: `RBAC（Role-Based Access Control）— 痛點：kubectl delete namespace prod，整個生產環境消失。目前的狀態：所有人用同一個 kubeconfig、都是 cluster-admin。

Docker 對照：Docker 沒有內建權限控制，能連到 Docker Socket 就等於 root。K8s 至少有 RBAC。

RBAC 三個核心概念：
- Subject（誰）— User、Group 或 ServiceAccount
- Role（能做什麼）— 定義允許的 apiGroups、resources、verbs
- RoleBinding（綁定）— 把 Role 綁到 Subject`,
    duration: '5',
  },

  // ── Slide 14 RBAC 四物件關係圖 ────────────────────
  {
    title: 'RBAC 四個物件',
    subtitle: 'Role / ClusterRole / RoleBinding / ClusterRoleBinding',
    section: 'RBAC',
    content: (
      <div className="space-y-4">
        {/* RBAC 四物件關係圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">RBAC 四物件關係</p>
          <div className="space-y-4">
            {/* Namespace 層級 */}
            <div className="border-2 border-cyan-500/40 rounded-lg p-3 bg-cyan-900/10">
              <p className="text-cyan-400 text-xs font-bold mb-2">Namespace 層級</p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="border-2 border-blue-500/70 rounded-lg p-2 bg-blue-900/20 text-center min-w-[120px]">
                  <p className="text-blue-400 text-sm font-bold">Role</p>
                  <p className="text-slate-400 text-[10px]">能對什麼資源</p>
                  <p className="text-slate-400 text-[10px]">做什麼動作</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="border-2 border-green-500/70 rounded-lg p-2 bg-green-900/20 text-center min-w-[120px]">
                  <p className="text-green-400 text-sm font-bold">RoleBinding</p>
                  <p className="text-slate-400 text-[10px]">把 Role 綁到</p>
                  <p className="text-slate-400 text-[10px]">某人身上</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="border-2 border-amber-500/70 rounded-lg p-2 bg-amber-900/20 text-center min-w-[120px]">
                  <p className="text-amber-400 text-sm font-bold">User / SA</p>
                  <p className="text-slate-400 text-[10px]">人用 User</p>
                  <p className="text-slate-400 text-[10px]">Pod 用 ServiceAccount</p>
                </div>
              </div>
            </div>
            {/* Cluster 層級 */}
            <div className="border-2 border-purple-500/40 rounded-lg p-3 bg-purple-900/10">
              <p className="text-purple-400 text-xs font-bold mb-2">Cluster 層級（跨 Namespace）</p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="border-2 border-blue-500/70 rounded-lg p-2 bg-blue-900/20 text-center min-w-[120px]">
                  <p className="text-blue-400 text-sm font-bold">ClusterRole</p>
                  <p className="text-slate-400 text-[10px]">跨 Namespace</p>
                  <p className="text-slate-400 text-[10px]">的權限定義</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="border-2 border-green-500/70 rounded-lg p-2 bg-green-900/20 text-center min-w-[120px]">
                  <p className="text-green-400 text-sm font-bold">ClusterRoleBinding</p>
                  <p className="text-slate-400 text-[10px]">把 ClusterRole</p>
                  <p className="text-slate-400 text-[10px]">綁到某人身上</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="border-2 border-amber-500/70 rounded-lg p-2 bg-amber-900/20 text-center min-w-[120px]">
                  <p className="text-amber-400 text-sm font-bold">User / SA</p>
                  <p className="text-slate-400 text-[10px]">所有 Namespace</p>
                  <p className="text-slate-400 text-[10px]">都有效</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 門禁卡比喻 */}
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">比喻：公司門禁卡</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p><span className="text-blue-400 font-semibold">Role</span> = 門禁卡（3F 研發部可進出）</p>
            <p><span className="text-blue-400 font-semibold">ClusterRole</span> = 萬能卡（所有樓層可進出）</p>
            <p><span className="text-green-400 font-semibold">RoleBinding</span> = 把門禁卡發給某人</p>
            <p><span className="text-green-400 font-semibold">ClusterRoleBinding</span> = 把萬能卡發給某人</p>
          </div>
        </div>
      </div>
    ),
    code: `# Role YAML — 只讀權限
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
  - apiGroups: [""]              # core API（Pod、Service）
    resources: ["pods", "services"]
    verbs: ["get", "list", "watch"]  # 只能看`,
    notes: `四個物件：
- Role — Namespace 內的權限定義
- ClusterRole — 跨 Namespace 的權限定義
- RoleBinding — 把 Role 綁到 Subject（Namespace 內有效）
- ClusterRoleBinding — 把 ClusterRole 綁到 Subject（全叢集有效）

ServiceAccount — Pod 的身份。每個 Namespace 預設有 default SA。Pod 要跟 API Server 溝通（例如列出 Pod）就靠 SA 的權限。

Role YAML 的 rules 欄位：
- apiGroups: [""] — 空字串 = core API（Pod、Service、ConfigMap）
- resources: ["pods", "services"] — 能操作的資源類型
- verbs: ["get", "list", "watch"] — 只有讀取，沒有 create/update/delete = 只讀 Role`,
    duration: '15',
  },

  // ── Slide 15 實作：RBAC 只讀使用者 ────────────────
  {
    title: '實作：RBAC 只讀使用者',
    subtitle: 'Lab 4：最小權限原則',
    section: 'RBAC',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">viewer-sa 能做的事</p>
          <p className="text-slate-300 text-sm">get pods → 成功</p>
          <p className="text-slate-300 text-sm">list services → 成功</p>
        </div>
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">viewer-sa 不能做的事</p>
          <p className="text-slate-300 text-sm">create pod → Forbidden</p>
          <p className="text-slate-300 text-sm">delete deployment → Forbidden</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見的 RBAC 設計</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">角色</th>
                <th className="text-center py-2">dev</th>
                <th className="text-center py-2">staging</th>
                <th className="text-center py-2">prod</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">開發人員</td>
                <td className="py-2 text-center text-green-400">完整</td>
                <td className="py-2 text-center text-green-400">完整</td>
                <td className="py-2 text-center text-amber-400">只讀</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">SRE / DevOps</td>
                <td className="py-2 text-center text-green-400">完整</td>
                <td className="py-2 text-center text-green-400">完整</td>
                <td className="py-2 text-center text-green-400">完整</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">實習生</td>
                <td className="py-2 text-center text-amber-400">只讀</td>
                <td className="py-2 text-center text-red-400">不給</td>
                <td className="py-2 text-center text-red-400">不給</td>
              </tr>
              <tr>
                <td className="py-2">CI/CD Pipeline</td>
                <td className="py-2 text-center text-slate-400">不需要</td>
                <td className="py-2 text-center text-blue-400">部署</td>
                <td className="py-2 text-center text-blue-400">部署</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Step 1：建立 SA + Role + RoleBinding
kubectl apply -f rbac-viewer.yaml

# Step 2：用 viewer-sa 查看 Pod（成功）
kubectl get pods --as=system:serviceaccount:default:viewer-sa

# Step 3：嘗試建立 Pod（被拒絕）
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa
# Error from server (Forbidden): pods is forbidden

# Step 4：嘗試刪除（被拒絕）
kubectl delete deployment nginx-deploy --as=system:serviceaccount:default:viewer-sa
# Error from server (Forbidden)`,
    notes: `操作步驟：

kubectl apply -f rbac-viewer.yaml — 建立 ServiceAccount(viewer-sa) + Role(pod-viewer) + RoleBinding。

測試（用 --as 旗標模擬身份）：
kubectl get pods --as=system:serviceaccount:default:viewer-sa → 成功（有 get/list 權限）
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa → Forbidden（沒有 create）
kubectl delete deployment nginx-deploy --as=system:serviceaccount:default:viewer-sa → Forbidden（沒有 delete）

也可以用 kubectl auth can-i 快速檢查：
kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa → no

企業 RBAC 設計：dev/staging 給開發人員完整權限，prod 只給只讀，部署交給 CI/CD（ArgoCD）。`,
    duration: '15',
  },

  // ── Slide 16 RBAC 小結 ───────────────────────────
  {
    title: 'RBAC 小結',
    subtitle: '三分鐘總結',
    section: 'RBAC',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">五個重點</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-cyan-400 font-semibold">Role</span> — 定義權限（能對什麼資源做什麼動作）</p>
            <p>2. <span className="text-cyan-400 font-semibold">RoleBinding</span> — 把 Role 綁到人或 ServiceAccount</p>
            <p>3. <span className="text-cyan-400 font-semibold">ClusterRole / ClusterRoleBinding</span> — 跨 Namespace 的版本</p>
            <p>4. <span className="text-cyan-400 font-semibold">ServiceAccount</span> — Pod 的身份</p>
            <p>5. <span className="text-cyan-400 font-semibold">--as</span> — 模擬其他身份操作（測試權限用）</p>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ 切換到受限使用者後 kubectl get pods 成功</p>
            <p>✓ kubectl delete pod 被拒絕，顯示 Forbidden</p>
            <p>✓ 能解釋 Role（Namespace 級別）和 ClusterRole（叢集級別）的差異</p>
            <p>✓ kubectl auth can-i delete pods --as=... 回傳 no</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold">接下來進入下一個主題 — NetworkPolicy，Pod 之間的防火牆。</p>
        </div>
      </div>
    ),
    notes: `小結：Role/ClusterRole 定義權限，RoleBinding/ClusterRoleBinding 綁定到 User/Group/SA。--as 旗標測試權限。ServiceAccount 是 Pod 的身份。

CKA 考試 RBAC 是必考題，重點是能手寫 Role + RoleBinding YAML。

接下來講 NetworkPolicy — Pod 之間的防火牆。`,
    duration: '3',
  },
]
