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
    notes: `歡迎回來！今天是我們 Kubernetes 課程的最後一堂，也是最重要的一堂。前面三堂課你已經學會了怎麼部署應用、設定網路、管理資料。但老實說，到目前為止我們部署的東西還不能算「生產就緒」。今天我們要補齊最後一塊拼圖。

先快速回顧第六堂。我們學了 Ingress，讓使用者可以用域名連到你的服務，不用記 IP 和 Port。學了 ConfigMap 和 Secret，把設定和密碼從程式碼裡抽出來。學了 PV 和 PVC，讓資料不會因為 Pod 重啟就消失。學了 StatefulSet，專門用來跑資料庫這種需要穩定身份和獨立儲存的應用。最後學了 Helm，一行指令就能裝好複雜的應用。

上堂課結束的時候，我留了一個反思問題：「你的 API 跑起來了，Service 也建好了，但你怎麼知道 API 有沒有卡死？」K8s 顯示 Pod 是 Running 狀態，但你的程式可能已經死鎖了、資料庫連線池滿了、或者任何原因導致它其實沒辦法正常服務。這時候 K8s 還是傻傻地把流量轉過去，使用者就看到 502。

怎麼辦？答案就是今天第一個主題 — Probe，健康檢查。

今天的內容非常豐富。我們會先學 Probe、Resource 管理加 HPA、然後是 RBAC。接著學 NetworkPolicy、DaemonSet 和 Job/CronJob、日誌與除錯，最後做一個從零到一的總複習實戰，把四堂課學的東西全部串起來。準備好了嗎？我們開始。`,
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
    notes: `我們先深入理解這個痛點。大家在第五堂學過，kubectl get pods 看到 STATUS 是 Running，就覺得沒事了。但 Running 只代表「容器的主行程還在跑」，不代表你的應用能正常服務。

舉三個場景。第一，你的 API 程式碼有 bug，進入了死鎖或無窮迴圈。容器還在，行程還在，K8s 以為一切正常，但其實你的 API 一個請求都回應不了。第二，你的 API 連資料庫，但連線池滿了，每個請求都回 500。第三，你用 Spring Boot 寫 API，它啟動要 60 秒，但 K8s 在容器啟動的瞬間就把流量轉過去了，前 60 秒的使用者全部看到錯誤。

用 Docker 的經驗來想，Dockerfile 有一個 HEALTHCHECK 指令，可以定期檢查容器是不是健康的。但 Docker 的 HEALTHCHECK 只有一種，而且功能很有限 — 它只能決定容器是不是 healthy，不能做更細緻的事情。

K8s 在這方面強大得多。它有三種 Probe，每一種負責不同的事情。我們一個一個來看。`,
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
    notes: `K8s 有三種 Probe。第一種叫 livenessProbe，存活探測，它問的問題是：「你還活著嗎？」如果 liveness 檢查失敗了，K8s 會直接重啟這個容器。這適合偵測那些不會自己恢復的問題，比如死鎖、無窮迴圈。

第二種叫 readinessProbe，就緒探測，它問的問題是：「你準備好接受流量了嗎？」如果 readiness 檢查失敗了，K8s 不會重啟容器，而是把這個 Pod 從 Service 的 Endpoints 裡移除，暫時不把流量轉給它。等它恢復了，再加回來。這適合那些「暫時不能服務但會自己恢復」的場景，比如應用正在啟動中、或者暫時過載。

第三種叫 startupProbe，啟動探測。這是給那些啟動特別慢的應用用的。比如你的 Java 應用啟動要 60 秒，如果沒有 startupProbe，livenessProbe 在 Pod 啟動後就開始檢查，60 秒內一直失敗，連續失敗超過閾值，K8s 就會重啟容器。然後又啟動、又失敗、又重啟，陷入無窮迴圈。有了 startupProbe，K8s 會先等 startupProbe 通過之後，才開始跑 liveness 和 readiness。

我用一個餐廳的比喻。livenessProbe 就像檢查廚師還有沒有心跳 — 沒心跳就換一個。readinessProbe 就像問廚師準備好出菜沒 — 還沒好就先不送單進去。startupProbe 就像廚師還在熱鍋 — 等他熱好再說。`,
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
    notes: `三種 Probe 各自有三種檢查方式。HTTP GET 最常用，指定一個路徑和 port，K8s 會定期去打那個 URL，回傳 200-399 就是成功。TCP Socket 適合資料庫和 Redis 這種不是 HTTP 的服務，K8s 只檢查 port 能不能連上。exec 是執行一個指令，回傳值是 0 就是成功。

好，我們來看 YAML 怎麼寫。大家打開 deployment-probe.yaml 這個檔案。

livenessProbe 的設定寫在 container 底下。httpGet 指定用 HTTP GET 方式檢查，path: / 表示打根路徑，port: 80 表示打 80 port。

接下來四個參數很重要。initialDelaySeconds: 5 表示 Pod 啟動後先等 5 秒再開始檢查，給你的應用一點啟動時間。periodSeconds: 10 表示每 10 秒檢查一次。failureThreshold: 3 表示連續失敗 3 次才判定為不健康 — 不是失敗一次就重啟，這樣太敏感了，可能只是網路抖了一下。timeoutSeconds: 1 表示每次檢查如果 1 秒內沒回應就算超時。

對照 Docker 的 HEALTHCHECK，概念幾乎一一對應。--interval 對應 periodSeconds，--timeout 對應 timeoutSeconds，--retries 對應 failureThreshold，--start-period 對應 initialDelaySeconds。最大的差別是 Docker 只有一種 HEALTHCHECK，K8s 有三種，各負責不同的事。`,
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
    notes: `概念講完了，我們馬上來動手。請大家打開終端機。

先部署帶 Probe 的 Deployment：

kubectl apply -f deployment-probe.yaml

然後查看 Pod 狀態：

kubectl get pods -l app=api-probe-demo

兩個 Pod 都是 Running，READY 是 1/1，RESTARTS 是 0。到目前為止一切正常。

我們來看看 Probe 的詳細資訊：

kubectl describe pods -l app=api-probe-demo | grep -A10 "Liveness\\|Readiness"

你會看到 Liveness 和 Readiness 的設定，包括 HTTP GET 的路徑、delay、period、threshold 這些參數。

好，現在我們來做壞事。我要讓 livenessProbe 失敗。nginx 的 livenessProbe 是打 GET /，如果我把 index.html 刪掉，nginx 就會回 403 或 404，livenessProbe 就會判定失敗。

先抓一個 Pod 的名字，然後進去刪掉 index.html。

現在開始觀察：kubectl get pods -l app=api-probe-demo -w

因為 initialDelaySeconds 是 5 秒、periodSeconds 是 10 秒、failureThreshold 是 3，所以大概要等 30 秒左右，livenessProbe 會連續失敗 3 次，然後 K8s 就會重啟這個容器。你會看到 RESTARTS 欄位從 0 變成 1。

重啟之後會怎樣？因為容器是重新啟動的，nginx 會重新載入預設的 index.html，所以 livenessProbe 又通過了，Pod 恢復正常。

這就是 livenessProbe 的威力 — 它不只能偵測問題，還能自動修復（透過重啟）。`,
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
    notes: `剛才我們講了 liveness 和 readiness，還有一個 startupProbe 我要單獨拿出來講，因為它的用途很特別。

想像你的 Java Spring Boot 應用啟動要 60 秒。如果你只設了 livenessProbe，initialDelaySeconds 設 5 秒、periodSeconds 10 秒、failureThreshold 3 次，那麼第 5 秒開始第一次檢查，第 15 秒第二次，第 25 秒第三次 — 連續失敗 3 次，K8s 就重啟容器。但你的應用要 60 秒才能啟動啊！結果就是永遠啟動不了，陷入無窮重啟迴圈。

你可能會想：那我把 initialDelaySeconds 設成 60 不就好了？可以，但這有個問題 — 如果你的應用在運行過程中真的掛了，K8s 也要等 60 秒才開始檢查。這就失去了快速偵測故障的意義。

startupProbe 就是解決這個問題的。在 startupProbe 通過之前，liveness 和 readiness 都不會跑。你可以給 startupProbe 一個比較寬鬆的檢查設定，比如每 5 秒檢查一次、最多失敗 10 次，那就是 5 + 5 x 10 = 55 秒。啟動完之後，liveness 和 readiness 才接手，用比較嚴格的設定去監控。

我們的 Lab 裡 nginx 啟動很快所以不太需要 startupProbe，但在總複習實戰的 API Deployment 裡，我有加上 startupProbe 給大家看。`,
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
    notes: `好，Probe 做個快速小結。記住三個重點：livenessProbe 掛了就重啟，readinessProbe 沒好就不給流量，startupProbe 給啟動慢的應用一個緩衝期。三種檢查方式：HTTP GET、TCP Socket、exec。四個關鍵參數：initialDelay、period、failureThreshold、timeout。

生產環境一定要同時設 liveness 和 readiness，這是基本要求。啟動超過 30 秒的應用記得加 startupProbe。

好，我們休息一下。回來之後進入下一個主題：Resource 管理。你的 Pod 如果不限制資源，一個有 bug 的 Pod 可以把整台機器的 CPU 和記憶體都吃光，其他 Pod 全部跟著掛。怎麼防止？十分鐘後見。`,
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
    notes: `好，回來了。接下來講 Resource 管理。

先講痛點。假設你的 Node 有 4GB 記憶體，上面跑了三個 Pod。Pod A 是你的 API，需要 500MB。Pod B 是你的前端，需要 200MB。Pod C 是另一個團隊的應用，程式碼有 memory leak。

如果你沒有設任何資源限制，Pod C 會不斷吃記憶體。五分鐘 1GB、十分鐘 2GB、十五分鐘 3.5GB。然後整台 Node 的記憶體不夠了。這時候 Linux 的 OOM Killer 會出動，它會「隨機」殺掉行程來釋放記憶體。你的 API Pod 可能就被殺了，不是因為你的 API 有 bug，而是因為隔壁的 Pod 把資源吃光了。

K8s 的資源管理有兩個概念：requests 和 limits。

requests 是「請求」，可以理解成保底。你告訴 K8s：「我的 Pod 至少需要這麼多資源」。Scheduler 在決定把 Pod 放到哪個 Node 的時候，會看 requests。

limits 是「限制」，就是天花板。超過 limits 會怎樣？CPU 超過 limits，K8s 會節流，你的程式會變慢但不會被殺。記憶體超過 limits，K8s 會直接殺掉容器，這就是 OOMKilled。

用自助餐來比喻：requests 就像你預約了 2 個座位，飯店保證留給你。limits 就像你最多只能坐 4 個座位，就算餐廳很空你也不能佔更多。`,
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
    notes: `K8s 會根據你怎麼設 requests 和 limits，給 Pod 一個 QoS 等級。這個等級決定了當 Node 資源不夠的時候，誰先被犧牲。

三種等級。Guaranteed 是最高級的，條件是每個容器都設了 requests 和 limits，而且兩個值相等。這表示你明確知道自己要用多少資源，K8s 保證給你。資源緊張的時候，Guaranteed 的 Pod 最後才會被殺。

Burstable 是中間的，條件是有設 requests 但跟 limits 不同。意思是你需要至少這麼多，但可以用更多。

BestEffort 是最低級的，完全沒設 requests 和 limits。K8s 不知道你要用多少資源，資源緊張的時候你第一個被殺。

生產環境至少要設 requests，讓你的 Pod 是 Burstable 而不是 BestEffort。最好的做法是 requests 和 limits 都設，設成一樣就是 Guaranteed。

好，我們來做一個 OOMKilled 的實驗。deployment-resources.yaml 裡面有一個 oom-demo 的 Deployment，它跑的是 stress 工具，會嘗試吃 256Mi 記憶體，但我們的 limits 只給 128Mi。

大家看，Pod 啟動之後立刻因為記憶體超標被殺掉了，STATUS 顯示 OOMKilled。然後 K8s 嘗試重啟，又被殺，又重啟。重啟幾次之後，STATUS 變成 CrashLoopBackOff。

在生產環境看到 OOMKilled，代表你的 limits 設太小，或者你的程式有 memory leak。`,
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
    notes: `講完 Resource 的靜態限制，接下來講動態的 — HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。

痛點很直覺。你的電商網站平常 2 個 Pod 就夠了，但大促銷的時候流量翻 10 倍，2 個 Pod 扛不住。你如果手動 kubectl scale 當然可以，但你不可能 24 小時盯著。凌晨沒人用的時候，10 個 Pod 閒在那裡浪費資源。

HPA 做的事情很簡單：它監控 Pod 的 CPU 使用率（或其他指標），超過你設的閾值就自動增加 Pod 數量，低於閾值就減少。完全自動。

看 YAML。scaleTargetRef 指定要擴縮哪個 Deployment。minReplicas 和 maxReplicas 設定最少和最多的 Pod 數。metrics 設定擴縮的依據，這裡是 CPU 使用率超過 50% 就擴容。

有一個很重要的前提：你的 Deployment 必須設 resources.requests。因為 HPA 算的是百分比。CPU 使用率 50% 是相對於 requests 的 50%，如果你沒設 requests，HPA 不知道 100% 是多少，就無法計算百分比。`,
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
    notes: `好，我們來看 HPA 的實際效果。先確保 api-resources-demo 這個 Deployment 在跑，它有設 resource requests。把 oom-demo 刪掉，我們不需要它了。

接下來建一個 Service，因為等一下壓測要透過 Service 的 DNS 名稱去打流量。

部署 HPA：kubectl apply -f hpa.yaml。你會看到 TARGETS 欄位可能顯示 <unknown>/50%，這表示 metrics-server 還在收集資料，等一下就會有數字了。

現在我們來壓測。開另一個終端機，跑一個壓測 Pod。這個 Pod 會不斷用 wget 打你的 API，模擬流量暴增。

回到原本的終端機，觀察 HPA：kubectl get hpa -w。大家看 TARGETS 欄位，CPU 使用率會慢慢上升。當它超過 50% 的時候，REPLICAS 欄位就會開始增加。2 變 3、3 變 4。這就是 HPA 在自動擴容。

壓測跑個一兩分鐘之後，停止。然後繼續觀察 HPA。CPU 使用率會慢慢降下來，大概等 5 分鐘左右，REPLICAS 會自動縮回 2。HPA 的縮容有一個冷卻期，預設是 5 分鐘，避免流量剛降就縮、流量一來又擴、反覆抖動。`,
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
    notes: `好，Resource 和 HPA 做個快速小結。requests 是保底，limits 是天花板。CPU 超過 limits 被節流，記憶體超過被 OOMKilled。QoS 三個等級：Guaranteed 最不容易被殺，BestEffort 最先被殺，生產環境至少要設 requests。HPA 根據 CPU 使用率自動擴縮 Pod，前提是要設 requests 和裝 metrics-server。

我們休息十分鐘，回來之後講 RBAC — 權限控制。想像一下，現在你的同事都有 kubectl 的 admin 權限，任何人都可以 kubectl delete namespace prod。是不是想到就覺得可怕？十分鐘後見。`,
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
    notes: `好，回來了。接下來我們要講一個在企業環境裡非常非常重要的主題 — RBAC，Role-Based Access Control，基於角色的存取控制。

先講一個恐怖故事。假設你的公司有一個 K8s 叢集，跑著生產環境。你的同事 — 或者更恐怖的，一個實習生 — 拿到了 kubectl 的 admin 權限。某一天他在跑一個清理腳本，不小心打了 kubectl delete namespace prod。猜猜發生什麼事？

prod Namespace 底下的所有東西：Deployment、Pod、Service、Secret、PVC，全部消失了。生產環境直接掛。

這不是我編的，這種事在業界真的發生過。而且目前我們的實驗環境就是這個狀態：所有人用同一個 kubeconfig，所有人都是 cluster-admin，開發人員可以直接操作生產環境。

Docker 有沒有這個問題？Docker 更糟。Docker 完全沒有內建的權限控制，只要你能連到 Docker Socket，你就等於 root。K8s 至少提供了 RBAC 機制讓你細分權限。

RBAC 的邏輯非常簡單，三個字：誰、能做什麼、綁定起來。「誰」叫 Subject，可以是 User、Group 或 ServiceAccount。「能做什麼」叫 Role，定義了允許的操作。「綁定起來」叫 RoleBinding。就這三個概念。`,
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
    notes: `RBAC 有四個物件。Role 和 ClusterRole 定義「能做什麼」，差別是作用範圍：Role 只在一個 Namespace 裡有效，ClusterRole 在整個叢集有效。RoleBinding 和 ClusterRoleBinding 負責「把權限給誰」，差別也是作用範圍。

用公司門禁卡來比喻。Role 就像一張門禁卡，上面寫著「可以進出 3 樓研發部」。ClusterRole 就像萬能卡，所有樓層都能進出。RoleBinding 就是把門禁卡發給某個人。ClusterRoleBinding 就是把萬能卡發給某個人。

這裡還有一個概念叫 ServiceAccount。人類使用 K8s 是透過 User 或 Group 認證的，但 Pod 呢？Pod 也需要跟 K8s API Server 溝通，比如有些應用需要列出所有 Pod。Pod 的身份就是 ServiceAccount。每個 Namespace 預設都有一個 default ServiceAccount，如果你不指定，Pod 就會用 default。

來看 Role 的 YAML。rules 裡面定義了允許的操作。apiGroups 指定 API 組，空字串代表 core API，就是 Pod、Service 這些最基礎的資源。resources 指定能操作哪些資源類型。verbs 指定能做什麼動作：get 是查看單個、list 是列出所有、watch 是即時監控。注意沒有 create、update、delete，所以這是一個只讀的 Role。`,
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
    notes: `好，我們來實作。打開 rbac-viewer.yaml，裡面有三個資源：一個 ServiceAccount 叫 viewer-sa，一個 Role 叫 pod-viewer，一個 RoleBinding 把兩個綁起來。

先部署：kubectl apply -f rbac-viewer.yaml

現在來測試。我們用 --as 這個旗標模擬用 viewer-sa 的身份操作。先試查看 Pod：

kubectl get pods --as=system:serviceaccount:default:viewer-sa

成功了！可以看到 Pod 列表。因為我們的 Role 有 get 和 list 的權限。

現在試建立一個 Pod：Error from server (Forbidden)。被拒絕了！因為我們的 Role 沒有 create 這個 verb。再試刪除，一樣被拒絕。

這就是 RBAC 的威力。你可以給開發人員一個只讀的權限，讓他能查看 Pod 的狀態和日誌去排錯，但不能修改或刪除任何東西。這叫做「最小權限原則」— 只給他需要的權限，不多給。

在企業環境裡，通常會這樣設計：開發人員在 dev 和 staging Namespace 有完整權限，但在 prod Namespace 只有讀取權限。部署由 CI/CD Pipeline（比如 ArgoCD）來做，不是由人手動操作。`,
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
    notes: `RBAC 小結。四個物件：Role 定義權限、RoleBinding 綁定權限、加上跨 Namespace 的 ClusterRole 和 ClusterRoleBinding。ServiceAccount 是 Pod 的身份。--as 旗標可以模擬其他身份來測試權限。

實務上的 RBAC 設計通常是按角色和環境的交叉矩陣來規劃的。開發人員在 dev 有完整權限，prod 只有只讀。SRE 和 DevOps 所有環境都有完整權限。實習生最多只能在 dev 看看。CI/CD Pipeline 負責在 staging 和 prod 做部署。

CKA 考試裡 RBAC 是必考題，所以如果你之後有打算考認證，今天學的東西一定要多練習。

好，接下來進入下一個主題 — NetworkPolicy，Pod 之間的防火牆。`,
    duration: '3',
  },
]
