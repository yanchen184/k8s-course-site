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
    title: '第六堂：Ingress + 配置管理',
    subtitle: 'Ingress、ConfigMap、Secret',
    section: '開場',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第五堂我們學了什麼</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-center py-2 w-28">主題</th>
                <th className="text-left py-2">一句話</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">k3s 多節點</td>
                <td className="py-2">1 Master + 2 Worker，真正的叢集</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Deployment</td>
                <td className="py-2">管副本 + 自我修復 + 滾動更新</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">Service</td>
                <td className="py-2">ClusterIP（內部）/ NodePort（外部）讓 Pod 被連到</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="text-center py-2">DNS</td>
                <td className="py-2">{`<service>.<namespace>.svc.cluster.local`} 用名字連</td>
              </tr>
              <tr>
                <td className="text-center py-2">Namespace</td>
                <td className="py-2">dev / staging / prod 環境隔離</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">第五堂的反思問題</p>
          <p className="text-slate-300 text-sm italic">{`「使用者要輸入 IP:30080 才能連進來。生產環境怎麼讓使用者用 myapp.com 就能用？」`}</p>
          <p className="text-cyan-400 font-semibold mt-2">→ 答案就是今天要學的：Ingress</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天的旅程</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">前半段：</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Ingress</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">ConfigMap</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Secret</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">後半段：</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">PV/PVC</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">StatefulSet</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">Helm</span>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `上一堂回顧：k3s 建多節點叢集（k3s-install.sh 裝 Master，k3s agent --server 加 Worker）。Deployment 管副本數、自我修復、kubectl rollout undo 回滾。Service 的 ClusterIP 讓叢集內互連、NodePort 開 30000-32767 讓外部連。CoreDNS 讓 Pod 用 service-name.namespace.svc.cluster.local 連，不用記 IP。Namespace 用 kubectl create ns dev 做環境隔離。

上一堂留的問題：「使用者要輸入 IP:30080 才能連進來，生產環境怎麼讓使用者用域名連？」答案就是 Ingress。

但 Ingress 只是今天的一部分。資料庫密碼寫死在 YAML 裡 push 到 Git 就外洩了；Pod 跑 MySQL 一重啟資料就沒了。今天通通要解決。

行程：Ingress 用域名對外 → ConfigMap / Secret 管設定和密碼 → PV/PVC/StatefulSet 解決資料持久化 → Helm 一鍵部署。開始。`,
    duration: '5',
  },

  // ── Slide 2 痛點：NodePort 的問題 ────────────────────
  {
    title: '痛點：NodePort 的問題',
    subtitle: '生產環境不能用 IP:30080',
    section: 'Ingress',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">回顧：上堂課用 NodePort 對外</p>
          <div className="flex items-center gap-2 flex-wrap text-sm text-slate-300">
            <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-1 rounded">使用者</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-slate-700 px-2 py-1 rounded font-mono text-xs">http://192.168.1.100:30080</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-1 rounded">NodePort Service</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded">Pod</span>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">生產環境的問題</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">問題</th>
                <th className="text-left py-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">Port 醜</td>
                <td className="py-2">使用者要記 :30080，不專業</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">Port 有限</td>
                <td className="py-2">NodePort 範圍 30000-32767，最多幾百個</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">沒有域名</td>
                <td className="py-2">使用者要記 IP，換機器就連不到</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">沒有 HTTPS</td>
                <td className="py-2">明文傳輸，不安全</td>
              </tr>
              <tr>
                <td className="py-2">每服務一個 Port</td>
                <td className="py-2">10 個服務 = 10 個 NodePort，管不動</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">我們想要的</p>
          <div className="space-y-1 text-sm font-mono text-slate-300">
            <p>使用者 → https://myapp.com → 前端</p>
            <p>使用者 → https://api.myapp.com → API</p>
          </div>
          <p className="text-cyan-400 font-semibold mt-3">K8s 的等價物 → Ingress</p>
        </div>
      </div>
    ),
    code: `# Docker 時代怎麼解決？→ Nginx 反向代理
# nginx.conf
server {
    server_name myapp.com;
    location / { proxy_pass http://frontend:80; }
}
server {
    server_name api.myapp.com;
    location / { proxy_pass http://api:3000; }
}`,
    notes: `上堂課用 NodePort Service 對外，使用者輸入 http://192.168.1.100:30080 連進來。

NodePort 的問題：Port 只能用 30000-32767，使用者要記 IP 加 Port；沒有域名、沒有 HTTPS；每個服務要佔一個 NodePort，10 個服務就 10 個 Port。

我們要的是：https://myapp.com 到前端、https://api.myapp.com 到 API。一個 IP、標準 80/443 Port、用域名區分服務。

Docker 時代怎麼解的？前面放 Nginx 當反向代理，nginx.conf 裡寫 server_name myapp.com + location / { proxy_pass http://frontend:80; }，根據域名和路徑轉發流量。

K8s 的 Ingress 做一模一樣的事 — 就是叢集裡的 Nginx 反向代理，但它跟 K8s 整合，能自動發現 Service、自動更新路由規則。`,
    duration: '5',
  },

  // ── Slide 3 Ingress 架構圖 ──────────────────────────
  {
    title: 'Ingress 架構',
    subtitle: 'Ingress 規則 + Ingress Controller',
    section: 'Ingress',
    content: (
      <div className="space-y-4">
        {/* Ingress 架構圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Ingress 架構</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* 使用者 */}
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg">
              <p className="text-amber-400 text-sm font-semibold">使用者</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            {/* Ingress Controller */}
            <div className="border-2 border-cyan-500/70 rounded-lg p-3 bg-cyan-900/20 min-w-[180px]">
              <p className="text-cyan-400 text-sm font-bold text-center mb-2">Ingress Controller</p>
              <p className="text-slate-400 text-xs text-center">(Traefik / Nginx)</p>
              <div className="mt-2 bg-slate-800/60 border border-slate-600 px-2 py-1 rounded text-center">
                <p className="text-slate-300 text-xs">讀取 Ingress 規則</p>
                <p className="text-slate-300 text-xs">執行路由轉發</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">→</span>
                <span className="text-slate-400 text-xs">/</span>
                <span className="text-slate-400 font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded">
                  <p className="text-green-400 text-xs font-semibold">Service A</p>
                  <p className="text-slate-400 text-[10px]">frontend-svc</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded">
                  <p className="text-green-300 text-xs">Pod</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">→</span>
                <span className="text-slate-400 text-xs">/api</span>
                <span className="text-slate-400 font-bold">→</span>
                <div className="bg-blue-900/40 border border-blue-500/50 px-3 py-2 rounded">
                  <p className="text-blue-400 text-xs font-semibold">Service B</p>
                  <p className="text-slate-400 text-[10px]">api-svc</p>
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="bg-blue-900/40 border border-blue-500/30 px-2 py-1 rounded">
                  <p className="text-blue-300 text-xs">Pod</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">分清楚兩個東西</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-36">名稱</th>
                <th className="text-left py-2">是什麼</th>
                <th className="text-left py-2 w-36">類比</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Ingress</td>
                <td className="py-2">YAML 規則定義（kind: Ingress）</td>
                <td className="py-2">nginx.conf</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400 font-semibold">Ingress Controller</td>
                <td className="py-2">實際跑的 Pod，讀取規則並執行</td>
                <td className="py-2">Nginx 程式本身</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 text-sm font-semibold">沒有 Ingress Controller，寫再多 Ingress 規則都沒用！</p>
        </div>
      </div>
    ),
    notes: `Ingress 分成兩個東西，一定要分清楚。

Ingress（kind: Ingress）：一份 YAML 規則，寫「myapp.com 的 / 導到 frontend-svc、/api 導到 api-svc」。它本身不會做任何事。

Ingress Controller：一個實際在跑的 Pod，讀取 Ingress 規則，接收外部流量並轉發到對應 Service。常見的有 nginx-ingress 和 Traefik，k3s 內建 Traefik。

Docker 對照：Ingress = nginx.conf 設定檔；Ingress Controller = Nginx 程式本身。光有 nginx.conf 沒有 Nginx 程式，什麼都不會發生。同理，叢集裡沒有 Ingress Controller 在跑，Ingress YAML 就是一份被忽略的檔案。

k3s 安裝時自帶 Traefik，用 kubectl get pods -n kube-system | grep traefik 可以確認。minikube 要自己跑 minikube addons enable ingress 啟用 nginx-ingress。`,
    duration: '10',
  },

  // ── Slide 4 Ingress YAML 拆解 ──────────────────────
  {
    title: 'Ingress YAML 拆解',
    subtitle: 'Path-based Routing',
    section: 'Ingress',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">pathType 的差異</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">pathType</th>
                <th className="text-left py-2">/api 會匹配到...</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-cyan-400">Prefix</td>
                <td className="py-2">/api、/api/、/api/users、/api/v2/data</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-cyan-400">Exact</td>
                <td className="py-2">只有 /api，其他都不匹配</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照 Nginx</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Nginx 設定檔</p>
              <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
                <p>{`location / {`}</p>
                <p className="pl-4">{`proxy_pass frontend:80;`}</p>
                <p>{`}`}</p>
                <p>{`location /api {`}</p>
                <p className="pl-4">{`proxy_pass api:3000;`}</p>
                <p>{`}`}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 mb-1">K8s Ingress YAML</p>
              <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
                <p>{`path: /`}</p>
                <p className="pl-4">{`backend: frontend-svc:80`}</p>
                <p>{`path: /api`}</p>
                <p className="pl-4">{`backend: api-svc:3000`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `apiVersion: networking.k8s.io/v1    # Ingress 用的 API 群組
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: traefik         # k3s 用 traefik；minikube 用 nginx
  rules:
    - http:
        paths:
          - path: /                 # 路徑 /
            pathType: Prefix        # 前綴匹配（/ 開頭的都算）
            backend:
              service:
                name: frontend-svc  # 導到哪個 Service
                port:
                  number: 80        # Service 的 Port

          - path: /api              # 路徑 /api
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 3000`,
    notes: `看 Ingress YAML 欄位。

apiVersion: networking.k8s.io/v1 — 網路類資源，跟 Deployment 的 apps/v1 不同。

spec.ingressClassName：指定用哪個 Ingress Controller。k3s 填 traefik，nginx-ingress 填 nginx。叢集裝了多個 Controller 時靠這個欄位區分。

spec.rules[].http.paths[] 每個元素三個欄位：path（URL 路徑）、pathType（匹配方式）、backend（導向哪個 Service + port）。

這個範例：path: / → frontend-svc:80，path: /api → api-svc:3000。

pathType 兩個選項：Prefix 前綴匹配，/api 開頭的都算（/api/users、/api/v2/data）；Exact 精確匹配，只有 /api 本身。大部分用 Prefix。

對照 Nginx：path: / + backend: frontend-svc:80 就等於 location / { proxy_pass frontend:80; }。`,
    duration: '10',
  },

  // ── Slide 5 實作：Path-based Routing ────────────────
  {
    title: '實作：Path-based Routing',
    subtitle: 'Lab 1：部署 Ingress + 驗證',
    section: 'Ingress',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">實作步驟</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-cyan-400 font-semibold">Step 1：</span>確認 Ingress Controller 在跑</p>
            <p><span className="text-cyan-400 font-semibold">Step 2：</span>部署應用 + Ingress 規則</p>
            <p><span className="text-cyan-400 font-semibold">Step 3：</span>測試 path routing</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">出問題了？排錯流程</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. <code className="text-xs bg-slate-700 px-1 rounded">kubectl describe ingress</code> — 看 Events</p>
            <p>2. <code className="text-xs bg-slate-700 px-1 rounded">kubectl get svc</code> — 確認 Service 存在</p>
            <p>3. <code className="text-xs bg-slate-700 px-1 rounded">kubectl get endpoints</code> — 確認有 Endpoints</p>
            <p>4. <code className="text-xs bg-slate-700 px-1 rounded">kubectl logs -n kube-system &lt;traefik-pod&gt;</code> — Controller 日誌</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：確認 Ingress Controller
# k3s
kubectl get pods -n kube-system | grep traefik
# minikube
minikube addons enable ingress

# Step 2：部署
kubectl apply -f ingress-basic.yaml
kubectl get ingress
kubectl describe ingress app-ingress

# Step 3：測試 path routing
curl http://<NODE-IP>/        # → Nginx 歡迎頁（frontend）
curl http://<NODE-IP>/api     # → "Hello from API"（api）`,
    notes: `動手做。打開終端機。

確認 Ingress Controller 在跑：
kubectl get pods -n kube-system | grep traefik
看到 Traefik Pod 是 Running 就對了。minikube 的話先 minikube addons enable ingress，再 kubectl get pods -n ingress-nginx 等 Running。

部署應用 + Ingress 規則：
kubectl apply -f ingress-basic.yaml
這個檔案包含 frontend Deployment/Service、API Deployment/Service、Ingress 規則。

查看 Ingress：
kubectl get ingress — 看到 app-ingress，ADDRESS 欄位可能一開始空的，等幾秒會出現 IP。
kubectl describe ingress app-ingress — Rules 列出路由規則。

測試：
curl http://<NODE-IP>/ — 看到 Nginx 歡迎頁（frontend）。
curl http://<NODE-IP>/api — 看到 Hello from API。
同一個 IP、Port 80，根據 URL 路徑導到不同 Service。

排錯流程：kubectl describe ingress 看 Events → kubectl get endpoints 確認 Service 後面有 Pod → kubectl logs -n kube-system <traefik-pod> 看 Controller 日誌。`,
    duration: '15',
  },

  // ── Slide 6 Host-based Routing 圖 ──────────────────
  {
    title: 'Host-based Routing',
    subtitle: '根據域名路由',
    section: 'Ingress',
    content: (
      <div className="space-y-4">
        {/* Host-based routing 示意圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Host-based Routing</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded">
                <p className="text-amber-400 text-xs font-semibold">app.myapp.local</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
                <p className="text-cyan-400 text-xs font-bold">Ingress Controller</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded">
                <p className="text-green-400 text-xs font-semibold">Frontend Service</p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded">
                <p className="text-amber-400 text-xs font-semibold">api.myapp.local</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
                <p className="text-cyan-400 text-xs font-bold">Ingress Controller</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="bg-blue-900/40 border border-blue-500/50 px-3 py-2 rounded">
                <p className="text-blue-400 text-xs font-semibold">API Service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Path-based vs Host-based</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">方式</th>
                <th className="text-left py-2">URL 範例</th>
                <th className="text-left py-2 w-40">適合</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">Path-based</td>
                <td className="py-2 font-mono text-xs">myapp.com/ + myapp.com/api</td>
                <td className="py-2">前後端同域名</td>
              </tr>
              <tr>
                <td className="py-2">Host-based</td>
                <td className="py-2 font-mono text-xs">app.myapp.com + api.myapp.com</td>
                <td className="py-2">微服務各有域名</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Host-based Routing YAML
spec:
  rules:
    - host: app.example.com      # 域名 1 → 前端
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80

    - host: api.example.com      # 域名 2 → API
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 3000

# 本地測試：修改 /etc/hosts
echo "<NODE-IP> app.example.com api.example.com" >> /etc/hosts
curl http://app.example.com      # → 前端
curl http://api.example.com      # → API`,
    notes: `Path-based 用 URL 路徑區分，Host-based 用域名區分。app.example.com 導前端，api.example.com 導 API。對照 Nginx 就是多個 server_name 區塊。

YAML 寫法：rules 裡加 host 欄位，每個 host 是一條獨立規則。

選擇時機：前後端同一個應用 → Path-based（myapp.com/ + myapp.com/api）。微服務各團隊獨立 → Host-based（app.myapp.com + api.myapp.com）。

動手做：
kubectl apply -f ingress-host.yaml

本地測試域名不存在，改 /etc/hosts 模擬：
sudo sh -c 'echo "<NODE-IP> app.example.com api.example.com" >> /etc/hosts'

測試：
curl http://app.example.com — 前端
curl http://api.example.com — API
同一個 IP，Ingress Controller 根據 HTTP Host header 轉發到不同 Service。

做完刪掉 /etc/hosts 加的那行。`,
    duration: '10',
  },

  // ── Slide 7 TLS 與 Annotations ─────────────────────
  {
    title: 'Ingress 進階：TLS 與 Annotations',
    subtitle: 'HTTPS 與進階設定',
    section: 'Ingress',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常用 Annotations</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Annotation</th>
                <th className="text-left py-2 w-36">功能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">nginx.ingress.kubernetes.io/rewrite-target: /</td>
                <td className="py-2">URL 重寫</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">nginx.ingress.kubernetes.io/ssl-redirect: "true"</td>
                <td className="py-2">強制 HTTPS</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">nginx.ingress.kubernetes.io/proxy-body-size: "10m"</td>
                <td className="py-2">上傳大小限制</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs">cert-manager.io/cluster-issuer: letsencrypt</td>
                <td className="py-2">自動 HTTPS 憑證</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">生產環境通常搭配 cert-manager 自動管理 HTTPS 憑證</p>
        </div>
      </div>
    ),
    code: `# TLS / HTTPS 設定
spec:
  tls:
    - hosts:
        - app.example.com
      secretName: app-tls-secret   # 憑證存在 Secret 裡

  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80

# 建立 TLS Secret（自簽憑證，學習用）
openssl req -x509 -nodes -days 365 \\
  -newkey rsa:2048 \\
  -keyout tls.key -out tls.crt \\
  -subj "/CN=app.example.com"

kubectl create secret tls app-tls-secret \\
  --cert=tls.crt --key=tls.key`,
    notes: `TLS：Ingress YAML 的 spec.tls 指定域名和 secretName，Ingress Controller 就會用該 Secret 裡的憑證處理 HTTPS。

建立 TLS Secret：
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=app.example.com"
kubectl create secret tls app-tls-secret --cert=tls.crt --key=tls.key

生產環境搭配 cert-manager，自動跟 Let's Encrypt 申請免費憑證、到期自動續約。今天先知道有這工具就好。

Annotations：Ingress 的進階功能透過 metadata.annotations 控制。
- rewrite-target: / → URL 重寫
- ssl-redirect: "true" → 強制 HTTP 轉 HTTPS
- proxy-body-size: "10m" → 上傳大小限制
注意：nginx-ingress 和 Traefik 的 annotation 名稱不同，用的時候查對應文件。

Ingress 到這裡。接下來解決設定管理。`,
    duration: '10',
  },

  // ── Slide 8 痛點：設定寫死在 Image 裡 ─────────────
  {
    title: '痛點：設定寫死在 Image 裡',
    subtitle: '為什麼需要 ConfigMap',
    section: 'ConfigMap',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">問題</th>
                <th className="text-left py-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">環境不同</td>
                <td className="py-2">dev 的 DB 跟 prod 的 DB 不一樣，要建兩個 Image？</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">密碼外洩</td>
                <td className="py-2">密碼寫在 Dockerfile，push 到 Docker Hub 全世界看到</td>
              </tr>
              <tr>
                <td className="py-2">改設定要重建</td>
                <td className="py-2">改一個環境變數就要重新 build Image</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">K8s 的解法</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-36">Docker</th>
                <th className="text-left py-2 w-28">K8s</th>
                <th className="text-left py-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">-e KEY=value</td>
                <td className="py-2 text-cyan-400 font-semibold">ConfigMap</td>
                <td className="py-2">一般設定（不敏感）</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs">-e PASSWORD=xxx</td>
                <td className="py-2 text-cyan-400 font-semibold">Secret</td>
                <td className="py-2">敏感資料（密碼、Key）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Dockerfile — 設定寫死在 Image 裡（錯誤示範）
FROM node:18
ENV DB_HOST=192.168.1.50
ENV DB_PORT=3306
ENV DB_PASSWORD=my-secret-pw    # 密碼寫死！
COPY . /app
CMD ["node", "server.js"]

# Docker 的解法：用 -e 注入環境變數
docker run -e DB_HOST=192.168.1.50 \\
           -e DB_PASSWORD=my-secret-pw \\
           myapp`,
    notes: `看一個常見錯誤：在 Dockerfile 裡寫 ENV DB_HOST=192.168.1.50、ENV DB_PASSWORD=my-secret-pw，docker build 打包成 Image，docker push 到 Docker Hub。

三個問題：
1. dev 和 prod 的 DB IP 不同，難道要 docker build 兩個 Image？只因為 IP 不一樣？
2. 密碼寫在 Dockerfile 裡，docker push 到公開 Registry，全世界都能 docker pull 下來看到你的密碼。
3. 改一個環境變數就要重新 docker build，每次都跑 CI/CD。

Docker 的正確做法：docker run -e DB_HOST=xxx -e DB_PASSWORD=yyy myapp，run 的時候才注入，不寫死在 Image。

K8s 一模一樣，工具升級了：docker run -e KEY=value 的等價物是 ConfigMap（一般設定）和 Secret（密碼、API Key）。`,
    duration: '5',
  },

  // ── Slide 9 ConfigMap 概念 + 注入方式對比圖 ────────
  {
    title: 'ConfigMap 概念',
    subtitle: 'K8s 版的環境變數管理器',
    section: 'ConfigMap',
    content: (
      <div className="space-y-4">
        {/* ConfigMap 注入方式對比圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">ConfigMap 兩種注入方式</p>
          <div className="grid grid-cols-2 gap-4">
            {/* 環境變數 */}
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/10">
              <p className="text-green-400 text-sm font-bold text-center mb-2">環境變數注入</p>
              <div className="space-y-2">
                <div className="bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">ConfigMap</p>
                  <p className="text-slate-400 text-[10px]">APP_ENV=production</p>
                </div>
                <p className="text-center text-slate-400 text-xs">envFrom</p>
                <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">Pod</p>
                  <p className="text-slate-400 text-[10px]">env: APP_ENV=production</p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] mt-2 text-center">適合：簡單 key-value 設定</p>
              <p className="text-red-400 text-[10px] text-center">修改後不會自動更新</p>
            </div>
            {/* Volume 掛載 */}
            <div className="border-2 border-blue-500/70 rounded-lg p-3 bg-blue-900/10">
              <p className="text-blue-400 text-sm font-bold text-center mb-2">Volume 掛載</p>
              <div className="space-y-2">
                <div className="bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">ConfigMap</p>
                  <p className="text-slate-400 text-[10px]">nginx.conf: server ...</p>
                </div>
                <p className="text-center text-slate-400 text-xs">volumeMounts</p>
                <div className="bg-blue-900/40 border border-blue-500/30 px-2 py-1 rounded text-center">
                  <p className="text-blue-300 text-xs">Pod</p>
                  <p className="text-slate-400 text-[10px]">/etc/nginx/nginx.conf</p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] mt-2 text-center">適合：設定檔（nginx.conf 等）</p>
              <p className="text-green-400 text-[10px] text-center">修改後自動更新（30-60s）</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三種建立方式</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. <code className="text-xs bg-slate-700 px-1 rounded">--from-literal</code> — 命令列直接寫 key=value</p>
            <p>2. <code className="text-xs bg-slate-700 px-1 rounded">--from-file</code> — 把整個檔案存進 ConfigMap</p>
            <p>3. <span className="text-cyan-400">YAML 宣告式</span> — 放在 Git 做版本管理</p>
          </div>
        </div>
      </div>
    ),
    code: `# 方式 1：指令 + literal
kubectl create configmap app-config \\
  --from-literal=APP_ENV=production \\
  --from-literal=LOG_LEVEL=info

# 方式 2：指令 + 檔案
kubectl create configmap nginx-conf \\
  --from-file=nginx.conf

# 方式 3：YAML（宣告式）
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"`,
    notes: `ConfigMap 就是 K8s 版的環境變數管理器，把設定集中存在一個物件裡，Pod 去引用它。

三種建立方式：
1. kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info — 命令列直接寫 key=value。
2. kubectl create configmap nginx-conf --from-file=nginx.conf — 整個檔案存進去，key 是檔名，value 是檔案內容。
3. 寫 YAML（kind: ConfigMap，data 區塊列 key-value），適合放 Git 做版本管理。

兩種注入方式：
1. 環境變數：Pod spec 用 envFrom.configMapRef 把所有 key 一次變環境變數，或 env.valueFrom.configMapKeyRef 逐一指定。注意：修改 ConfigMap 後 Pod 不會自動更新，要 kubectl rollout restart。
2. Volume 掛載：Pod spec 用 volumes.configMap + volumeMounts，每個 key 變成容器內一個檔案。修改 ConfigMap 後 30-60 秒檔案自動更新。

Docker 對照：docker run -e APP_ENV=production = ConfigMap 環境變數注入。docker run -v ./nginx.conf:/etc/nginx/nginx.conf = ConfigMap Volume 掛載。`,
    duration: '10',
  },

  // ── Slide 10 實作：ConfigMap 環境變數注入 ───────────
  {
    title: '實作：ConfigMap 環境變數注入',
    subtitle: 'Lab 3：修改 ConfigMap 後的行為',
    section: 'ConfigMap',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">重點發現</p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-300">環境變數注入：修改 ConfigMap 後，<span className="text-red-400 font-semibold">Pod 不會自動更新</span>，要 rollout restart</p>
            <p className="text-slate-300">Volume 掛載：修改 ConfigMap 後，<span className="text-green-400 font-semibold">Pod 裡的檔案會自動更新</span>（30-60 秒）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼行為不同？</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>環境變數是 process 啟動時讀一次就定死了</p>
            <p>檔案系統上的檔案可以被 kubelet 定期同步更新</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：部署
kubectl apply -f configmap-literal.yaml

# Step 2：驗證環境變數有注入
kubectl logs deployment/app-with-config | head -20
# 看到 APP_ENV=production、LOG_LEVEL=info 等

# Step 3：修改 ConfigMap
kubectl edit configmap app-config
# 把 LOG_LEVEL 改成 debug

# Step 4：環境變數不會自動更新！
kubectl logs deployment/app-with-config | grep LOG_LEVEL
# 還是 info！

# 要重啟 Pod 才會生效
kubectl rollout restart deployment/app-with-config
kubectl logs deployment/app-with-config | grep LOG_LEVEL
# 現在才是 debug`,
    notes: `部署：
kubectl apply -f configmap-literal.yaml
裡面有 ConfigMap（app-config，存 APP_ENV / LOG_LEVEL / API_URL / MAX_CONNECTIONS）和一個 Deployment（busybox 跑 env | sort 印環境變數）。

驗證注入成功：
kubectl logs deployment/app-with-config | head -20
看到 APP_ENV=production、LOG_LEVEL=info。

重點實驗 — 修改 ConfigMap 後 Pod 會自動更新嗎？
kubectl edit configmap app-config
把 LOG_LEVEL 從 info 改成 debug，存檔。

kubectl logs deployment/app-with-config | grep LOG_LEVEL
還是 info。環境變數在 Pod 啟動時注入，之後就定死了。

要生效必須重啟：
kubectl rollout restart deployment/app-with-config
kubectl logs deployment/app-with-config | grep LOG_LEVEL
現在才是 debug。

對比：Volume 掛載方式修改 ConfigMap 後 30-60 秒檔案自動更新，不用重啟。原因：環境變數是 process 啟動時讀一次，檔案系統可以被 kubelet 定期同步。`,
    duration: '15',
  },

  // ── Slide 11 實作：ConfigMap 掛載為檔案 ────────────
  {
    title: '實作：ConfigMap 掛載為檔案',
    subtitle: 'Lab 4：Nginx 設定檔 + 熱更新',
    section: 'ConfigMap',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">掛載方式</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>ConfigMap 的每個 key → 容器內的一個檔案</p>
            <p>修改 ConfigMap → 30-60 秒後檔案自動更新</p>
            <p>但應用程式可能需要手動 reload</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">subPath 的坑</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>用 subPath 只掛一個檔案（不覆蓋整個目錄）</p>
            <p className="text-red-400 font-semibold">但 subPath 不支援熱更新！</p>
            <p>需要熱更新就不要用 subPath，但整個目錄會被覆蓋</p>
          </div>
        </div>
      </div>
    ),
    code: `# ConfigMap 裡存 nginx 設定
data:
  default.conf: |
    server {
        listen 80;
        location /healthz { return 200 'OK'; }
    }

# 掛載到 Pod
volumeMounts:
  - name: nginx-conf-volume
    mountPath: /etc/nginx/conf.d    # 整個目錄
volumes:
  - name: nginx-conf-volume
    configMap:
      name: nginx-config

# 熱更新測試
kubectl edit configmap nginx-config
# 改 'OK' → 'HEALTHY'
# 等 30-60 秒
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
# 檔案自動更新了！但 Nginx 需要手動 reload
kubectl exec deploy/nginx-custom -- nginx -s reload`,
    notes: `部署：
kubectl apply -f configmap-nginx.yaml

驗證設定檔掛進去了：
kubectl exec deployment/nginx-custom -- cat /etc/nginx/conf.d/default.conf

測試 healthz：
kubectl port-forward svc/nginx-custom-svc 8080:80 &
curl http://localhost:8080/healthz
回 OK。

熱更新測試：
kubectl edit configmap nginx-config
把 OK 改成 HEALTHY，存檔。等 30-60 秒：
kubectl exec deployment/nginx-custom -- cat /etc/nginx/conf.d/default.conf
檔案自動更新了，不用重啟 Pod。

但 curl 還是回 OK — 因為 Nginx process 還在用舊設定。手動 reload：
kubectl exec deployment/nginx-custom -- nginx -s reload
再 curl，回 HEALTHY。

subPath 的坑：volumeMounts 加 subPath 只掛單一檔案不覆蓋整個目錄，但 subPath 不支援熱更新（K8s 已知行為）。需要熱更新就不要用 subPath，但整個目錄會被覆蓋。

清理：kill %1`,
    duration: '15',
  },

  // ── Slide 12 Secret 概念 ──────────────────────────
  {
    title: 'Secret 概念',
    subtitle: 'Base64 不是加密！',
    section: 'Secret',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Secret vs ConfigMap</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-20"></th>
                <th className="text-left py-2">ConfigMap</th>
                <th className="text-left py-2">Secret</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">用途</td>
                <td className="py-2">一般設定</td>
                <td className="py-2">密碼、API Key、憑證</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">儲存</td>
                <td className="py-2">明文</td>
                <td className="py-2">Base64 編碼</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">查看</td>
                <td className="py-2">describe 直接看到值</td>
                <td className="py-2">describe 只顯示大小</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Base64 不是加密！任何人都能解碼！</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p>echo -n "my-secret-pw" | base64 → bXktc2VjcmV0LXB3</p>
            <p>echo "bXktc2VjcmV0LXB3" | base64 -d → my-secret-pw</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三種 Secret 類型</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-40">類型</th>
                <th className="text-left py-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">Opaque</td>
                <td className="py-2">通用（最常用）— 資料庫密碼、API Key</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">kubernetes.io/tls</td>
                <td className="py-2">TLS 憑證 — HTTPS 用的 cert + key</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs">kubernetes.io/dockerconfigjson</td>
                <td className="py-2">Docker Registry 認證 — 拉私有 Image</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">最佳實踐</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. <span className="text-red-400 font-semibold">不要</span>把 Secret YAML commit 到 Git</p>
            <p>2. 用 <code className="text-xs bg-slate-700 px-1 rounded">kubectl create secret</code> 指令建立</p>
            <p>3. 生產環境用 Vault / AWS Secrets Manager</p>
          </div>
        </div>
      </div>
    ),
    notes: `Secret 管密碼、API Key、SSL 憑證等敏感資料。跟 ConfigMap 一樣存 key-value，用法幾乎相同。

差異：Secret 的值用 Base64 編碼存；kubectl describe secret 只顯示每個 key 的 bytes 大小，不印值。

重點：Base64 不是加密！
echo -n "my-secret-pw" | base64 → bXktc2VjcmV0LXB3
echo "bXktc2VjcmV0LXB3" | base64 -d → my-secret-pw
任何人都能解碼。Secret 的安全性靠 RBAC 權限控制 — 只有被授權的人才能 kubectl get secret。

三種類型：
- Opaque：通用型，資料庫密碼、API Key
- kubernetes.io/tls：TLS 憑證（Ingress HTTPS 用的）
- kubernetes.io/dockerconfigjson：Docker Registry 帳密，讓 kubelet 能 docker pull 私有 Image

最佳實踐：
1. 不要把 Secret YAML commit 到 Git — Base64 不是加密，公開 repo 等於公開密碼
2. 用 kubectl create secret generic --from-literal=key=value 建立，不用手動 Base64
3. 生產環境用 HashiCorp Vault 或 AWS Secrets Manager`,
    duration: '10',
  },

  // ── Slide 13 實作：Secret + MySQL ──────────────────
  {
    title: '實作：Secret + MySQL',
    subtitle: 'Lab 5：用 Secret 管理 MySQL 密碼',
    section: 'Secret',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">實作步驟</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-cyan-400 font-semibold">Step 1：</span>部署 Secret + MySQL Deployment</p>
            <p><span className="text-cyan-400 font-semibold">Step 2：</span>查看 Secret（describe 只顯示大小）</p>
            <p><span className="text-cyan-400 font-semibold">Step 3：</span>驗證 MySQL 成功讀取密碼</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">推薦：用指令建立（不用手動 Base64）</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded">
            <p>kubectl create secret generic my-secret \</p>
            <p className="pl-4">--from-literal=username=admin \</p>
            <p className="pl-4">--from-literal=password=supersecret</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：部署
kubectl apply -f secret-db.yaml

# Step 2：查看 Secret
kubectl get secret mysql-secret
kubectl describe secret mysql-secret   # 只顯示大小，不顯示值
kubectl get secret mysql-secret -o yaml  # 看到 Base64 值
echo "cm9vdHBhc3N3b3JkMTIz" | base64 -d  # → rootpassword123

# Step 3：驗證 MySQL
kubectl get pods -l app=mysql -w        # 等 Running
kubectl exec -it deployment/mysql-deploy -- \\
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"`,
    notes: `部署：
kubectl apply -f secret-db.yaml
包含 Secret（MySQL root 密碼、使用者帳密、資料庫名稱）+ MySQL Deployment + Service。

查看 Secret：
kubectl describe secret mysql-secret — 只顯示每個 key 的 bytes 大小，不顯示值（跟 ConfigMap 不同）。
kubectl get secret mysql-secret -o yaml — 看到 Base64 值。
echo "cm9vdHBhc3N3b3JkMTIz" | base64 -d → rootpassword123。再次強調 Base64 不是加密，安全性靠 RBAC（第七堂教）。

驗證 MySQL：
kubectl get pods -l app=mysql -w — 等 Running（約 30 秒）。
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123 -e "SHOW DATABASES;"
看到 myappdb，表示 Secret 透過 envFrom 注入的 MYSQL_ROOT_PASSWORD 和 MYSQL_DATABASE 生效了。

YAML 裡有註解掉的 stringData 區塊 — 可以直接寫明文，K8s 存進 etcd 時自動 Base64 編碼。更推薦用指令：
kubectl create secret generic my-secret --from-literal=username=admin --from-literal=password=supersecret
完全不用碰 Base64。`,
    duration: '15',
  },

  // ── Slide 14 整合實作：Ingress + ConfigMap + Secret ─
  {
    title: '整合：Ingress + ConfigMap + Secret',
    subtitle: '把前面學的全部串起來',
    section: '整合',
    content: (
      <div className="space-y-4">
        {/* 整合架構圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">整合架構</p>
          <div className="flex flex-col gap-3">
            {/* 使用者 → Ingress */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded">
                <p className="text-amber-400 text-xs font-semibold">使用者</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
                <p className="text-cyan-400 text-xs font-bold">Ingress</p>
              </div>
            </div>
            {/* 兩條路徑 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-green-500/50 rounded-lg p-3 bg-green-900/10">
                <p className="text-green-400 text-xs font-bold mb-1">app.example.com</p>
                <div className="space-y-1">
                  <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                    <p className="text-green-300 text-xs">Nginx Pod</p>
                  </div>
                  <div className="bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded text-center">
                    <p className="text-cyan-300 text-[10px]">ConfigMap: nginx.conf</p>
                  </div>
                </div>
              </div>
              <div className="border border-blue-500/50 rounded-lg p-3 bg-blue-900/10">
                <p className="text-blue-400 text-xs font-bold mb-1">api.example.com</p>
                <div className="space-y-1">
                  <div className="bg-blue-900/40 border border-blue-500/30 px-2 py-1 rounded text-center">
                    <p className="text-blue-300 text-xs">API Pod</p>
                  </div>
                  <div className="bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded text-center">
                    <p className="text-cyan-300 text-[10px]">ConfigMap: API_URL, LOG_LEVEL</p>
                  </div>
                  <div className="bg-amber-900/30 border border-amber-500/30 px-2 py-1 rounded text-center">
                    <p className="text-amber-300 text-[10px]">Secret: DB_PASSWORD</p>
                  </div>
                  <div className="bg-purple-900/30 border border-purple-500/30 px-2 py-1 rounded text-center">
                    <p className="text-purple-300 text-[10px]">MySQL Pod (Secret: ROOT_PASSWORD)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">你已經會了</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p className="text-green-400">Ingress 讓使用者用域名連進來</p>
            <p className="text-green-400">ConfigMap 管理 Nginx 設定檔和 API 設定</p>
            <p className="text-green-400">Secret 管理 MySQL 密碼</p>
          </div>
          <p className="text-amber-400 font-semibold mt-3">但還有一個問題... Pod 重啟資料會消失！</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ 瀏覽器打 myapp.local 看到前端頁面（Ingress path-based routing）</p>
            <p>✓ api.myapp.local 和 app.myapp.local 分別導到不同 Service（host-based）</p>
            <p>✓ kubectl get configmap 看到自己建的 ConfigMap</p>
            <p>✓ kubectl exec 進 Pod，echo $DB_HOST 輸出 ConfigMap 的值</p>
            <p>✓ kubectl get secret -o yaml 看到 Base64 編碼的值</p>
            <p>✓ Pod 裡的 $DB_PASSWORD 是原始密碼（K8s 自動解碼）</p>
          </div>
        </div>
      </div>
    ),
    notes: `整合回顧：使用者 → Ingress（app.example.com 導前端、api.example.com 導 API）→ Nginx 設定檔用 ConfigMap Volume 掛載 → API 的 LOG_LEVEL/API_URL 用 ConfigMap envFrom 注入 → DB 密碼用 Secret envFrom 注入 → MySQL root 密碼也用 Secret。

核心概念：同一個 Image 部署到 dev 和 prod，只換 ConfigMap 和 Secret。docker run -e 和 -v 的升級版，但設定集中管理、可以版本控制。

但還有一個問題：kubectl delete pod mysql-xxx，Pod 重建後資料全部消失。下半段解決這個。`,
    duration: '15',
  },
]
