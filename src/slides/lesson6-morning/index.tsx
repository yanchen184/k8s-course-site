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
    notes: `歡迎回來！上一堂課我們做了很多事情。我們用 k3s 建了一個真正的多節點叢集 — 1 個 Master 加 2 個 Worker。然後我們把 Deployment 學透了：副本數維持、自我修復、滾動更新和回滾。接著學了 Service，ClusterIP 讓叢集內部的 Pod 互相連，NodePort 開一個 port 讓外面連進來。也學了 DNS — 在叢集裡面可以用服務名稱直接連，不用記 IP。最後學了 Namespace，把 dev、staging、prod 環境隔離開來。

上一堂結束的時候我留了個問題：「使用者要輸入 IP 加 Port 才能連進來，生產環境怎麼讓使用者用域名就能用？」大家有想到嗎？

答案就是今天要學的 Ingress。但 Ingress 只是今天的開胃菜。你想想看，你的 API 連進來了，但資料庫密碼還寫死在 YAML 裡面，推到 Git 就全世界都看到了；你的 Pod 跑 MySQL，Pod 一重啟資料就沒了。這些問題今天通通要解決。

今天的行程：先搞定 Ingress，讓使用者用域名連到你的服務。然後學 ConfigMap 和 Secret，把設定和密碼從程式碼裡抽出來。接著解決資料消失的問題 — PV、PVC、StatefulSet。最後用 Helm 一鍵部署複雜應用，不用再自己手寫一大堆 YAML。

內容很多，但每一個都會動手做。好，我們開始。`,
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
    notes: `好，先回顧一下上堂課的成果。我們用 NodePort Service 讓外部可以存取應用，使用者在瀏覽器輸入 http://192.168.1.100:30080 就能看到頁面。

但你把這個網址丟給你的主管看看？他一定會說：「這什麼東西？使用者要記 IP 加 Port？你在開玩笑嗎？」

NodePort 有幾個致命的問題。第一，Port 醜 — 30080 這種數字不是正常人會記的。第二，Port 有限 — NodePort 只能用 30000 到 32767 這個範圍，你有幾百個微服務怎麼辦？第三，沒有域名，使用者要記 IP 地址。第四，沒有 HTTPS。第五，每個服務要開一個 NodePort，10 個服務就是 10 個 Port，管理起來是噩夢。

我們想要的是什麼？使用者輸入 https://myapp.com 就到前端，輸入 https://api.myapp.com 就到 API。一個 IP、標準的 80/443 Port、用域名區分不同服務。

如果你之前用過 Docker，這個問題你怎麼解決的？沒錯，就是在前面放一台 Nginx 當反向代理。在 Nginx 設定檔裡面寫 server_name 和 location，根據域名和路徑把流量轉到不同的後端容器。

K8s 的 Ingress 做的事情完全一樣 — 它就是 K8s 世界裡的 Nginx 反向代理。但它比你自己手寫 Nginx 設定檔更強大，因為它跟 K8s 整合在一起，可以自動發現 Service、自動更新路由規則。`,
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
    notes: `在開始寫 Ingress YAML 之前，有一個觀念一定要搞清楚：Ingress 其實分成兩個東西。

第一個叫 Ingress，注意它只是一份 YAML 規則。你在裡面寫：「myapp.com 這個域名，/ 路徑導到 frontend-svc，/api 路徑導到 api-svc」。它只是規則，本身不會做任何事。

第二個叫 Ingress Controller，它是一個真的在跑的 Pod。它會去讀你寫的 Ingress 規則，然後實際接收外部流量、根據規則轉發到對應的 Service。常見的 Ingress Controller 有 nginx-ingress 和 Traefik。k3s 內建的就是 Traefik。

用 Docker 來對照：Ingress 就像 nginx.conf 設定檔，裡面寫路由規則。Ingress Controller 就像 Nginx 這個程式本身，負責讀設定檔然後執行。你不可能光有一個 nginx.conf 就期望它自己跑起來，對吧？你得有 Nginx 程式在跑才行。

同樣的道理，在 K8s 裡面，你不能光寫 Ingress YAML 就覺得搞定了。如果叢集裡沒有 Ingress Controller 在跑，你的 Ingress 規則就只是一份被忽略的 YAML，流量完全進不來。

k3s 幫我們省了一步 — 它安裝的時候就自動帶了 Traefik 當 Ingress Controller。如果你用的是 minikube，要自己 minikube addons enable ingress 來啟用 nginx-ingress。`,
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
    notes: `來看 Ingress 的 YAML 怎麼寫。打開 ingress-basic.yaml，先看最後面的 Ingress 部分。

首先 apiVersion 是 networking.k8s.io/v1，注意跟 Deployment 的 apps/v1 不一樣，Ingress 屬於網路類的資源。kind: Ingress。

spec 裡面有一個 ingressClassName，這是告訴 K8s 要用哪個 Ingress Controller 來處理這條規則。如果你的叢集裡裝了好幾個 Controller，就用這個欄位來指定。k3s 用 traefik，nginx-ingress 用 nginx。

重點在 rules 裡面。每一條 rule 定義了路由規則。paths 是一個陣列，每個元素有三個東西：path（URL 路徑）、pathType（匹配方式）、backend（導向哪個 Service）。

我們這個範例有兩條路徑規則。path: / 導向 frontend-svc 的 port 80，path: /api 導向 api-svc 的 port 3000。

pathType 有兩個選項。Prefix 是前綴匹配，只要路徑以 /api 開頭的都算，包括 /api/users、/api/v2/data。Exact 是精確匹配，只有完全是 /api 才算，/api/users 就不匹配了。大部分情況用 Prefix 就對了。

對照 Nginx 來看，path: / 加 backend: frontend-svc:80 就等於 Nginx 的 location / { proxy_pass frontend:80; }。格式不一樣，但做的事情完全一樣。`,
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
    notes: `好，講完了概念，馬上動手做。請大家打開終端機。

首先確認 Ingress Controller 有在跑。如果你用 k3s：

kubectl get pods -n kube-system | grep traefik

應該看到 Traefik 的 Pod 是 Running 狀態。如果你用 minikube，先跑 minikube addons enable ingress，然後 kubectl get pods -n ingress-nginx，等到 Pod 變成 Running。

Controller 確認了，來部署我們的應用和 Ingress 規則：

kubectl apply -f ingress-basic.yaml

這個檔案裡面包含了 frontend 的 Deployment 和 Service、API 的 Deployment 和 Service，還有 Ingress 規則。一次 apply 全部搞定。

查看 Ingress：

kubectl get ingress

你會看到 app-ingress，ADDRESS 欄位可能一開始是空的，等幾秒就會出現 IP。describe 看一下細節：

kubectl describe ingress app-ingress

Rules 那邊會列出你定義的路由規則。

現在來測試。先拿到 Node 的 IP，然後 curl：

curl http://<NODE-IP>/

應該看到 Nginx 的歡迎頁面。再試：

curl http://<NODE-IP>/api

應該看到 Hello from API。成功了！同一個 IP、同一個 Port（80），根據 URL 路徑的不同，流量被導到不同的 Service。這就是 Ingress 的威力。

如果沒成功，排錯流程跟之前一樣。describe ingress 看 Events 有沒有錯誤訊息。kubectl get endpoints 確認 Service 後面確實有 Pod。最後看 Ingress Controller 的日誌找線索。`,
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
    notes: `剛才的 Path-based routing 是用 URL 路徑來區分。還有另一種方式是 Host-based routing — 用域名來區分。

app.example.com 導到前端，api.example.com 導到 API。跟 Nginx 裡面寫多個 server_name 是一模一樣的概念。

YAML 寫法很簡單，就是在 rules 裡面加上 host 欄位。每個 host 是一條獨立的規則。

什麼時候用 Path-based，什麼時候用 Host-based？如果你的前端和 API 是同一個應用的一部分，用 Path-based 就好，myapp.com/ 是前端、myapp.com/api 是後端。但如果你是微服務架構，每個服務都是獨立的團隊在維護，那給每個服務一個獨立的域名比較乾淨，就用 Host-based。

我們來動手試試。先部署：

kubectl apply -f ingress-host.yaml

但有一個問題 — app.example.com 這個域名不存在，DNS 解析不到。在本地測試的話，我們修改 /etc/hosts 來模擬：

sudo sh -c 'echo "<NODE-IP> app.example.com api.example.com" >> /etc/hosts'

然後 curl 試試看：

curl http://app.example.com
curl http://api.example.com

兩個不同的域名，同一個 IP，但 Ingress Controller 根據 HTTP 請求裡的 Host header，把流量導到不同的 Service。

做完記得把 /etc/hosts 加的那行刪掉。`,
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
    notes: `快速講一下 TLS。在生產環境，你的網站一定要走 HTTPS，不然瀏覽器會顯示「不安全」。

Ingress 支援 TLS，做法是把 SSL 憑證存在一個 Secret 裡面，然後在 Ingress YAML 的 tls 區塊指定要用哪個 Secret。這樣 Ingress Controller 就會用這個憑證來處理 HTTPS 連線。

建立 TLS Secret 的方式是用 kubectl create secret tls，把 .crt 和 .key 檔案傳進去。學習的時候可以用 openssl 自己簽一張憑證，但生產環境通常會搭配 cert-manager 這個工具，它可以自動幫你跟 Let's Encrypt 申請免費的 HTTPS 憑證，到期自動續約。非常好用，但今天先不深入，知道有這個東西就好。

另外提一下 Annotations。Ingress 有很多進階功能是透過 annotations 來控制的。比如 rewrite-target 可以做 URL 重寫，ssl-redirect 可以強制把 HTTP 請求轉到 HTTPS，proxy-body-size 可以設定上傳檔案的大小限制。這些 annotations 是跟 Ingress Controller 相關的，nginx-ingress 和 Traefik 的 annotations 名稱不一樣，用的時候要查對應的文件。

好，Ingress 的部分到這裡。你已經知道怎麼讓使用者用域名存取你的服務了。接下來我們要解決另一個問題 — 設定管理。`,
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
    notes: `好，Ingress 搞定了。現在使用者可以用域名連到你的服務。但我們來看看你的 Dockerfile 裡面有什麼問題。

假設你的 API 需要連資料庫。你可能在 Dockerfile 裡面寫了 ENV DB_HOST=192.168.1.50、ENV DB_PASSWORD=my-secret-pw。Build 成 Image，push 到 Docker Hub，完美。

完美個頭。

第一個問題：你的 dev 環境的資料庫 IP 跟 prod 環境的不一樣。你是要建兩個 Image 嗎？myapp:dev 和 myapp:prod？只是因為 IP 不一樣就要建兩個 Image？

第二個問題更嚴重：密碼寫在 Dockerfile 裡面。你把 Image push 到 Docker Hub，全世界的人都能看到你的資料庫密碼。恭喜你，你的資料庫被駭了。

第三個問題：改一個環境變數就要重新 build Image。每次改設定都要跑 CI/CD？太蠢了。

用 Docker 的經驗，你知道正確的做法是用 -e 在 run 的時候才注入環境變數，不要寫死在 Image 裡。K8s 的做法一模一樣，只是工具升級了 — 一般設定用 ConfigMap，敏感資料用 Secret。`,
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
    notes: `ConfigMap，就是 K8s 版的環境變數管理器。你把設定集中存在一個 ConfigMap 物件裡，然後讓需要這些設定的 Pod 去引用它。

建立 ConfigMap 有三種方式。最快的是用指令加 --from-literal，直接在命令列寫 key=value。第二種是 --from-file，把一整個檔案（比如 nginx.conf）存進 ConfigMap，key 是檔案名稱，value 是檔案內容。第三種是寫 YAML，適合放在 Git 裡做版本管理。

建好之後怎麼讓 Pod 用？兩種方式。第一種是注入為環境變數，用 envFrom 可以把 ConfigMap 裡面所有的 key 一次全部變成環境變數。或者用 env.valueFrom.configMapKeyRef 逐一指定要哪幾個 key。

第二種是掛載為 Volume，ConfigMap 裡的每個 key 會變成一個檔案。這種方式適合用在設定檔，比如你要把 nginx.conf 掛進 Nginx 容器裡面。

用 Docker 的經驗來對照：-e APP_ENV=production 就等於 ConfigMap 的環境變數注入。-v ./nginx.conf:/etc/nginx/nginx.conf 就等於 ConfigMap 的 Volume 掛載。概念完全一樣，只是管理方式更結構化了。`,
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
    notes: `來動手做。先部署 ConfigMap 和使用它的 Deployment：

kubectl apply -f configmap-literal.yaml

這個 YAML 裡面有一個 ConfigMap 叫 app-config，存了 APP_ENV、LOG_LEVEL、API_URL、MAX_CONNECTIONS 四個設定。還有一個 Deployment，用 busybox 跑 env | sort 印出所有環境變數，然後 sleep。

看看日誌：

kubectl logs deployment/app-with-config | head -20

你應該能在輸出裡找到 APP_ENV=production、LOG_LEVEL=info 等。ConfigMap 的值成功注入為環境變數了。

現在來一個重要的實驗。修改 ConfigMap：

kubectl edit configmap app-config

把 LOG_LEVEL 從 info 改成 debug，存檔離開。

大家猜猜看，Pod 裡的環境變數會自動更新嗎？

答案是：不會！kubectl logs 看一下，還是 info。為什麼？因為環境變數是在 Pod 啟動的時候注入的，啟動之後就定死了。ConfigMap 改了，已經跑著的 Pod 不知道。

要讓新的值生效，你得重啟 Pod：

kubectl rollout restart deployment/app-with-config

重啟之後再看日誌，現在才是 debug。

這是一個很重要的知識點。但如果你用 Volume 掛載的方式，ConfigMap 修改後，Pod 裡的檔案會自動更新，大概 30 到 60 秒。為什麼兩種方式行為不一樣？因為環境變數是 process 啟動時讀一次就定了，但檔案系統上的檔案可以被 kubelet 定期同步更新。`,
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
    notes: `接下來做 ConfigMap 掛載為檔案的練習。這次我們要用 ConfigMap 來管理 Nginx 的設定檔。

部署：

kubectl apply -f configmap-nginx.yaml

先驗證設定檔有掛進去：

kubectl exec deployment/nginx-custom -- cat /etc/nginx/conf.d/default.conf

應該看到我們在 ConfigMap 裡寫的 Nginx 設定。測試一下 healthz 端點：

kubectl port-forward svc/nginx-custom-svc 8080:80 &
curl http://localhost:8080/healthz

應該回 OK。

現在來測試熱更新。修改 ConfigMap：

kubectl edit configmap nginx-config

把 /healthz 回應的 OK 改成 HEALTHY，存檔。

等大概 30 到 60 秒，再看檔案：

kubectl exec deployment/nginx-custom -- cat /etc/nginx/conf.d/default.conf

檔案內容自動更新了！不用重啟 Pod。但注意，Nginx 本身不會自動 reload。檔案雖然改了，但 Nginx process 還是用舊的設定在跑。你得手動 reload：

kubectl exec deployment/nginx-custom -- nginx -s reload

然後 curl 一下，現在回 HEALTHY 了。

這裡要提醒一個坑。如果你用 subPath 掛載，就是只掛一個檔案而不是覆蓋整個目錄，那熱更新就不會生效。這是 K8s 的已知行為，不是 bug。所以如果你需要熱更新，就不要用 subPath。但不用 subPath 的話，整個目錄會被覆蓋，原本目錄裡的其他檔案就不見了。這是一個取捨。

清理一下 port-forward：

kill %1`,
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
    notes: `ConfigMap 管一般設定，那密碼呢？密碼、API Key、SSL 憑證這些敏感資料，用 Secret 來管。

Secret 和 ConfigMap 很像，都是存 key-value 的，用法也幾乎一樣。差別在哪？首先，Secret 的值是用 Base64 編碼存的，不是明文。其次，用 kubectl describe secret 的時候，它只會顯示每個 key 的大小，不會直接把值印出來，算是多了一層防偷看。

但我要特別強調一件事：Base64 編碼不是加密！

我們來做一個實驗。echo -n "my-secret-pw" | base64，得到 bXktc2VjcmV0LXB3。反過來 echo "bXktc2VjcmV0LXB3" | base64 -d，馬上就解回 my-secret-pw。任何拿到這個值的人都能輕鬆解碼，根本不需要密碼或 key。所以 Secret 的安全性不是靠編碼，而是靠 RBAC 權限控制 — 只有被授權的人才能 kubectl get secret。

Secret 有三種類型。最常用的是 Opaque，就是通用型，什麼都能存。kubernetes.io/tls 專門存 TLS 憑證，就是剛才 Ingress HTTPS 用的那個。kubernetes.io/dockerconfigjson 是存 Docker Registry 的帳號密碼，讓 kubelet 能拉私有 Image。

最佳實踐：第一，絕對不要把 Secret 的 YAML 檔 commit 到 Git。你的 Git repo 如果是公開的，全世界都能解碼你的密碼。就算是私有 repo，也不建議。第二，建議用 kubectl create secret 指令來建立，不用自己手動 Base64 編碼。第三，生產環境建議用外部的 Secret 管理工具，比如 HashiCorp Vault 或 AWS Secrets Manager。`,
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
    notes: `來動手。部署 Secret 和 MySQL：

kubectl apply -f secret-db.yaml

這個檔案裡面有一個 Secret 存了 MySQL 的 root 密碼、使用者帳號、使用者密碼和資料庫名稱。還有一個 MySQL 的 Deployment 和 Service。

先看看 Secret 長什麼樣：

kubectl describe secret mysql-secret

注意看，它只顯示每個 key 的大小（bytes），不會顯示值。這是 Secret 和 ConfigMap 的一個差異 — ConfigMap 的 describe 會直接秀出值，Secret 不會。

但如果你用 -o yaml 看呢？

kubectl get secret mysql-secret -o yaml

你會看到 Base64 編碼的值。隨便挑一個解碼試試：

echo "cm9vdHBhc3N3b3JkMTIz" | base64 -d

得到 rootpassword123。所以我再強調一次，Base64 不是加密，任何有權限 kubectl get secret 的人都能拿到明文。安全性靠的是 RBAC — 第七堂會教。

等 MySQL Pod 跑起來（大概 30 秒），驗證一下：

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123 -e "SHOW DATABASES;"

應該看到 myappdb 在列表裡。Secret 的值成功透過 envFrom 注入為環境變數，MySQL 讀到了 MYSQL_ROOT_PASSWORD 和 MYSQL_DATABASE，自動建立了資料庫。

對了，我在 YAML 裡面有一段註解掉的 stringData。如果你覺得手動 Base64 編碼很煩，可以用 stringData 直接寫明文，K8s 會在存進 etcd 的時候自動幫你編碼。或者更好的方式，直接用指令建立：

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
    notes: `好，前面學了三個東西：Ingress、ConfigMap、Secret。我們來整理一下它們怎麼搭配在一起。

看這個架構圖。使用者透過 Ingress 進來，app.example.com 導到前端的 Nginx，api.example.com 導到後端的 API。Nginx 的設定檔用 ConfigMap 管理，不用寫死在 Image 裡。API 的設定（LOG_LEVEL、API_URL）用 ConfigMap 管理，API 連資料庫的密碼用 Secret 管理。MySQL 的 root 密碼也用 Secret 管理。

整個流量從使用者到資料庫，每一層的設定和密碼都不是寫死在 Image 裡面的。同一個 Image 可以部署到 dev 和 prod，只要換 ConfigMap 和 Secret 就好。這就是「設定外部化」的精神。

大家有沒有覺得「哇，學了這麼多東西，終於有點像真正的系統了」？但別高興太早，還有一個大問題我們沒解決。`,
    duration: '15',
  },
]
