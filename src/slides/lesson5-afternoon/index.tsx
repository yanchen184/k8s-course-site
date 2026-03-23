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
  // ── Slide 1 三種 Service 類型比較 ──────────────────
  {
    title: '三種 Service 類型比較',
    subtitle: 'ClusterIP vs NodePort vs LoadBalancer',
    section: 'Service 進階',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">三種 Service 類型</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">類型</th>
                <th className="text-left py-2">存取範圍</th>
                <th className="text-left py-2">使用場景</th>
                <th className="text-left py-2">Docker 對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">ClusterIP</td>
                <td className="py-2">叢集內部</td>
                <td className="py-2">微服務溝通（API / DB）</td>
                <td className="py-2 text-xs">Compose network DNS</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-green-400 font-semibold">NodePort</td>
                <td className="py-2">Node IP + Port</td>
                <td className="py-2">測試環境</td>
                <td className="py-2 text-xs"><code>docker run -p 30080:80</code></td>
              </tr>
              <tr>
                <td className="py-2 text-amber-400 font-semibold">LoadBalancer</td>
                <td className="py-2">外部（雲端 LB）</td>
                <td className="py-2">生產環境</td>
                <td className="py-2 text-xs">雲端負載均衡器</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">遞增關係</p>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="bg-cyan-900/40 border border-cyan-500/40 px-3 py-1 rounded text-cyan-300">ClusterIP</span>
            <span className="text-slate-400 font-bold">⊂</span>
            <span className="bg-green-900/40 border border-green-500/40 px-3 py-1 rounded text-green-300">NodePort</span>
            <span className="text-slate-400 font-bold">⊂</span>
            <span className="bg-amber-900/40 border border-amber-500/40 px-3 py-1 rounded text-amber-300">LoadBalancer</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">NodePort 包含 ClusterIP 的所有功能；LoadBalancer 包含 NodePort 的所有功能</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">怎麼選？</p>
          <div className="text-slate-300 text-xs mt-1 space-y-1">
            <p>叢集內部用 → ClusterIP（預設就好）</p>
            <p>測試需要外部連 → NodePort</p>
            <p>生產環境 → LoadBalancer 或 Ingress</p>
          </div>
        </div>
      </div>
    ),
    notes: `在繼續之前，我們來整理一下三種 Service 類型。

ClusterIP 是預設的，只能在叢集內部存取。適合微服務之間的溝通，比如前端連 API、API 連資料庫。

NodePort 會在每個 Node 上開一個 30000-32767 範圍內的 port，讓外部可以存取。適合測試環境或不想弄太複雜的場景。

LoadBalancer 會跟雲端平台（AWS、GCP、Azure）要一個外部的負載均衡器，自動分配一個公開的 IP。適合生產環境。但在 minikube 上用不了，因為沒有真正的雲端負載均衡器。

這三個類型是遞增的關係。NodePort 包含 ClusterIP 的所有功能 — 你建了一個 NodePort Service，它同時也有 ClusterIP。LoadBalancer 包含 NodePort 的所有功能。

怎麼選？很簡單：叢集內部用 ClusterIP，測試需要外部連用 NodePort，生產環境用 LoadBalancer 或 Ingress（下一堂課會教）。`,
    duration: '5',
  },

  // ── Slide 2 DNS 服務發現圖 ─────────────────────────
  {
    title: 'DNS 與服務發現：概念',
    subtitle: 'CoreDNS — 用名字連 Service，不用記 IP',
    section: 'DNS',
    content: (
      <div className="space-y-4">
        {/* DNS 服務發現圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">DNS 服務發現流程</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-green-400 text-xs font-semibold">App Pod</p>
              <p className="text-slate-500 text-[10px]">curl nginx-svc</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            <div className="bg-purple-900/40 border border-purple-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-purple-400 text-xs font-semibold">CoreDNS</p>
              <p className="text-slate-500 text-[10px]">nginx-svc → 10.96.0.10</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-cyan-400 text-xs font-semibold">Service</p>
              <p className="text-slate-500 text-[10px]">10.96.0.10</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">→</span>
            <div className="flex flex-col gap-1">
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 1</p>
              </div>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 2</p>
              </div>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">DNS 名稱格式</p>
          <div className="bg-slate-900/60 p-3 rounded font-mono text-sm text-slate-300">
            <p>&lt;service-name&gt;.&lt;namespace&gt;.svc.cluster.local</p>
            <p className="mt-1 text-cyan-400">nginx-svc.default.svc.cluster.local</p>
            <div className="flex gap-4 mt-1 text-[10px] text-slate-500">
              <span>服務名</span>
              <span>命名空間</span>
              <span>固定</span>
              <span>固定</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三種寫法（從短到長）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">寫法</th>
                <th className="text-left py-2">什麼時候用</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><code>nginx-svc</code></td>
                <td className="py-2">同一個 Namespace 內（最常用）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code>nginx-svc.default</code></td>
                <td className="py-2">跨 Namespace</td>
              </tr>
              <tr>
                <td className="py-2"><code>nginx-svc.default.svc.cluster.local</code></td>
                <td className="py-2">完整寫法（FQDN）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `剛才我們在 Lab 3 裡面，從臨時 Pod 用 curl http://nginx-svc 連到了 nginx Service。我們用的是 Service 的名字，不是 IP。這是怎麼做到的？

答案是 CoreDNS。K8s 叢集裡面內建了一個 DNS 服務叫做 CoreDNS。每當你建立一個 Service，CoreDNS 就會自動新增一筆 DNS 記錄，把 Service 的名字對應到它的 ClusterIP。

Pod 在啟動的時候，K8s 會自動設定它的 /etc/resolv.conf，把 DNS 指向 CoreDNS。所以 Pod 裡面用 Service 名字做 DNS 查詢，就會被 CoreDNS 解析成 Service 的 IP。

DNS 名稱的完整格式是：<service-name>.<namespace>.svc.cluster.local。比如我們的 nginx-svc 在 default namespace，完整寫法就是 nginx-svc.default.svc.cluster.local。

但你不需要每次都寫這麼長。如果你在同一個 Namespace 裡面，直接寫 nginx-svc 就夠了，K8s 會自動補上後面的部分。如果你要跨 Namespace 存取，寫到 Namespace 就夠了，比如 nginx-svc.production。完整的 FQDN 寫法通常只在需要絕對明確的時候才用。

對照 Docker Compose：Compose 裡面容器名稱也會自動變 DNS，你可以用 http://api:8080 來連。但 Compose 的 DNS 只限同一個 Docker network 裡面的容器。K8s 的 DNS 更強大，同一個 Namespace 用短名稱，跨 Namespace 加上 Namespace 名稱就好了。`,
    duration: '10',
  },

  // ── Slide 3 實作：DNS 驗證 ─────────────────────────
  {
    title: '實作：DNS 驗證',
    subtitle: 'Lab 5：DNS 與服務發現',
    section: 'DNS',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">重點觀察</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>- <code>nslookup</code> 結果的 Server 就是 CoreDNS</p>
            <p>- Address 就是 Service 的 ClusterIP</p>
            <p>- DNS 解析是自動的，你不需要設定任何東西</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：從臨時 Pod 測試 DNS
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh

# Step 2：用短名稱連線
wget -qO- http://nginx-svc
# 看到 nginx 歡迎頁面

# Step 3：用完整 FQDN 連線
wget -qO- http://nginx-svc.default.svc.cluster.local
# 一樣能連到

# Step 4：用 nslookup 看 DNS 解析
nslookup nginx-svc
# Server:    10.96.0.10      ← CoreDNS 的 IP
# Name:      nginx-svc.default.svc.cluster.local
# Address:   10.96.x.x       ← Service 的 ClusterIP

exit`,
    notes: `好，我們來驗證 DNS 是不是真的能用。

建一個臨時的 busybox Pod：kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh。

為什麼這次用 busybox 不用 curl image？因為 busybox 裡面有 wget 和 nslookup 這些工具，等一下都用得到。

進去之後，先用短名稱連：wget -qO- http://nginx-svc。-qO- 的意思是安靜模式（-q），把內容輸出到標準輸出（-O-）。你會看到 nginx 的 HTML 歡迎頁面。

再用完整的 FQDN 試試：wget -qO- http://nginx-svc.default.svc.cluster.local。一樣能連到。這兩種寫法指向同一個 Service。

最重要的來了。用 nslookup 看一下 DNS 解析的過程：nslookup nginx-svc。你會看到 Server 是一個 IP，那個就是 CoreDNS 的地址。下面的 Name 顯示完整的 FQDN，Address 就是 nginx-svc 這個 Service 的 ClusterIP。

這就證明了：你在 Pod 裡面用 Service 名稱，CoreDNS 會自動把它解析成 Service 的 ClusterIP。整個過程完全自動，你不需要修改任何 DNS 設定。

好，輸入 exit 離開。`,
    duration: '10',
  },

  // ── Slide 4 Namespace 隔離圖 ───────────────────────
  {
    title: 'Namespace 概念',
    subtitle: '邏輯隔離 — 同名資源不衝突',
    section: 'Namespace',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm">痛點：你的團隊有 dev 和 staging 環境，兩邊都有 api-deploy、api-svc — 名字衝突！</p>
        </div>

        {/* Namespace 隔離圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Namespace = 邏輯隔離</p>
          <div className="grid grid-cols-2 gap-4">
            {/* dev namespace */}
            <div className="border-2 border-blue-500/60 rounded-lg p-3 bg-blue-900/10">
              <p className="text-blue-400 text-sm font-bold text-center mb-2">Namespace: dev</p>
              <div className="space-y-1">
                <div className="bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded text-center">
                  <p className="text-blue-300 text-xs">api-deploy</p>
                  <p className="text-slate-500 text-[10px]">nginx:1.27</p>
                </div>
                <div className="bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded text-center">
                  <p className="text-blue-300 text-xs">frontend-deploy</p>
                </div>
                <div className="bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">api-svc</p>
                </div>
              </div>
            </div>
            {/* prod namespace */}
            <div className="border-2 border-green-500/60 rounded-lg p-3 bg-green-900/10">
              <p className="text-green-400 text-sm font-bold text-center mb-2">Namespace: staging</p>
              <div className="space-y-1">
                <div className="bg-green-900/30 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">api-deploy</p>
                  <p className="text-slate-500 text-[10px]">nginx:1.28</p>
                </div>
                <div className="bg-green-900/30 border border-green-500/30 px-2 py-1 rounded text-center">
                  <p className="text-green-300 text-xs">frontend-deploy</p>
                </div>
                <div className="bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded text-center">
                  <p className="text-cyan-300 text-xs">api-svc</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-green-400 text-sm text-center mt-2 font-semibold">同名但互不干擾！</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">K8s 預設的 Namespace</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-36">Namespace</th>
                <th className="text-left py-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><code>default</code></td>
                <td className="py-2">你沒指定的話就在這裡</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code>kube-system</code></td>
                <td className="py-2">K8s 系統元件（API Server、CoreDNS...）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code>kube-public</code></td>
                <td className="py-2">公開資源（很少用）</td>
              </tr>
              <tr>
                <td className="py-2"><code>kube-node-lease</code></td>
                <td className="py-2">節點心跳（不用管）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">注意：Namespace 不是安全隔離！</p>
          <div className="text-slate-300 text-xs mt-1 space-y-1">
            <p>- 只是邏輯分組，不是網路隔離</p>
            <p>- 不同 Namespace 的 Pod 預設可以互相連線</p>
            <p>- 要網路隔離需要用 NetworkPolicy（第七堂教）</p>
          </div>
        </div>
      </div>
    ),
    notes: `在講完 Service 和 DNS 之後，我們來學一個很實用的概念 — Namespace，命名空間。

想像一個場景：你的團隊有 dev 開發環境和 staging 測試環境。兩個環境都需要部署同樣的一套微服務：api-deploy、frontend-deploy、api-svc。如果這些東西全部放在 default namespace 裡面，名字就衝突了 — K8s 不允許同一個 Namespace 裡面有兩個同名的 Deployment。

Namespace 就是解決方案。你可以建一個 dev Namespace 和一個 staging Namespace，然後在各自的 Namespace 裡面部署同名的資源。它們互不干擾，各自獨立。

K8s 預設有幾個 Namespace。default 是你不指定 Namespace 的時候資源會待的地方，我們之前的操作都是在 default 裡面。kube-system 放的是 K8s 自己的系統元件，像 API Server、CoreDNS 這些。kube-public 和 kube-node-lease 基本上不用管。

有一點要特別注意：Namespace 只是邏輯上的分組，不是真正的安全隔離。不同 Namespace 的 Pod 預設是可以互相連線的。如果你需要網路層面的隔離，要用 NetworkPolicy，那是第七堂課的內容。

Docker 裡面沒有 Namespace 的概念。最接近的可能是不同的 Docker Compose 專案 — 你可以在不同的目錄下各放一個 compose.yaml，它們的服務名稱可以一樣。但 Compose 的隔離是靠不同的 Docker network 來做的，跟 K8s 的 Namespace 機制不一樣。`,
    duration: '10',
  },

  // ── Slide 5 實作：Namespace ─────────────────────────
  {
    title: '實作：Namespace',
    subtitle: 'Lab 6：建立 + 跨 Namespace 存取',
    section: 'Namespace',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常用的 <code>-n</code> 參數</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p><code>kubectl get pods</code> — 預設 default namespace</p>
            <p><code>kubectl get pods -n dev</code> — 指定 dev namespace</p>
            <p><code>kubectl get pods -A</code> — 所有 namespace</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">跨 Namespace 存取規則</p>
          <div className="text-slate-300 text-xs mt-1 space-y-1">
            <p>同一個 Namespace → 用短名稱：<code>nginx-svc</code></p>
            <p>跨 Namespace → 加 Namespace 名稱：<code>nginx-svc.dev.svc.cluster.local</code></p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm">危險操作：<code>kubectl delete namespace dev</code></p>
          <p className="text-slate-400 text-xs mt-1">會把裡面所有資源一起刪掉！生產環境千萬不要隨便刪 Namespace</p>
        </div>
      </div>
    ),
    code: `# Step 1：建立 Namespace
kubectl apply -f namespace-practice.yaml
kubectl get namespaces

# Step 2：在不同 Namespace 部署同名應用
kubectl create deployment nginx-dev --image=nginx:1.27 -n dev
kubectl get pods -n dev

kubectl create deployment nginx-dev --image=nginx:1.27 -n staging
kubectl get pods -n staging

# Step 3：看全部 Namespace 的資源
kubectl get deployments -A

# Step 4：跨 Namespace 存取
kubectl expose deployment nginx-dev --port=80 -n dev

kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- \\
  wget -qO- http://nginx-dev.dev.svc.cluster.local

# 清理
kubectl delete namespace dev staging`,
    notes: `好，來動手玩 Namespace。

先建立 dev 和 staging 兩個 Namespace：kubectl apply -f namespace-practice.yaml。看一下：kubectl get namespaces。你會看到除了 K8s 預設的那幾個之外，多了 dev 和 staging。

現在在 dev 裡面部署一個 Deployment：kubectl create deployment nginx-dev --image=nginx:1.27 -n dev。-n dev 就是指定 Namespace 為 dev。看看 Pod：kubectl get pods -n dev。你會看到 dev Namespace 裡有一個 Pod 在跑。

再在 staging 裡面部署同名的 Deployment：kubectl create deployment nginx-dev --image=nginx:1.27 -n staging。注意，名字一樣叫 nginx-dev！但因為在不同的 Namespace，完全不衝突。kubectl get pods -n staging。staging 也有自己的 Pod 了。

如果你想一次看所有 Namespace 的 Deployment：kubectl get deployments -A。-A 是 --all-namespaces 的縮寫。你會看到 dev 和 staging 各有一個 nginx-dev。

接下來試試跨 Namespace 存取。先在 dev 建一個 Service：kubectl expose deployment nginx-dev --port=80 -n dev。

然後從 default Namespace 跨過去連：kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-dev.dev.svc.cluster.local。

注意 DNS 名稱：nginx-dev.dev.svc.cluster.local。因為我們是從 default Namespace 跨到 dev Namespace，所以不能只寫 nginx-dev，要加上 Namespace 名稱。如果你只寫 nginx-dev，它會去找 default Namespace 的 nginx-dev Service，那是找不到的。

記住這個規則：同一個 Namespace 用短名稱，跨 Namespace 要加 Namespace 名稱。

實作完之後，清理一下：kubectl delete namespace dev staging。刪除 Namespace 會把裡面所有的資源一起刪掉，很方便但也很危險。在生產環境千萬不要隨便刪 Namespace。`,
    duration: '15',
  },

  // ── Slide 6 Namespace 常用操作 ─────────────────────
  {
    title: 'Namespace 常用操作',
    subtitle: '設定預設 Namespace + 使用建議',
    section: 'Namespace',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">建議</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>- 開發測試：用 Namespace 隔離不同環境</p>
            <p>- 生產環境：不同團隊用不同 Namespace</p>
            <p>- 搭配 RBAC 可以限制「誰能存取哪個 Namespace」（第七堂教）</p>
          </div>
        </div>
      </div>
    ),
    code: `# 切換預設 Namespace 到 dev
kubectl config set-context --current --namespace=dev

# 之後 kubectl get pods 預設就是看 dev 的
kubectl get pods                    # 等於 kubectl get pods -n dev

# 切回 default
kubectl config set-context --current --namespace=default

# 快速確認目前在哪個 Namespace
kubectl config view --minify | grep namespace`,
    notes: `補充一個實用技巧。如果你經常在某個 Namespace 工作，每次都要打 -n dev 很煩。你可以設定預設 Namespace：kubectl config set-context --current --namespace=dev。

設定之後，kubectl get pods 預設就是看 dev 的 Pod，不需要加 -n dev。要切回 default 的話：kubectl config set-context --current --namespace=default。

如果忘記目前在哪個 Namespace，可以用：kubectl config view --minify | grep namespace。

在實際工作中，Namespace 的使用建議是：開發測試用 Namespace 隔離不同環境（dev、staging、production），團隊多的話不同團隊用不同 Namespace。搭配第七堂課會教的 RBAC 權限控制，你可以限制某個工程師只能存取 dev 的 Namespace，不能碰 production。`,
    duration: '5',
  },

  // ── Slide 7 完整練習：前後端部署 ──────────────────
  {
    title: '完整練習：前後端部署',
    subtitle: 'Lab 7：把今天學的全部串起來',
    section: '綜合實作',
    content: (
      <div className="space-y-4">
        {/* 完整架構圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">目標架構</p>
          <div className="border-2 border-slate-600 rounded-lg p-3 bg-slate-800/30">
            <p className="text-slate-400 text-xs text-center mb-2">fullstack-demo namespace</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* 外部 */}
              <div className="text-center">
                <div className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded">
                  <p className="text-amber-400 text-[10px] font-semibold">瀏覽器</p>
                </div>
                <p className="text-slate-500 text-[10px]">:30080</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              {/* Frontend */}
              <div className="text-center">
                <div className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded">
                  <p className="text-cyan-400 text-[10px] font-semibold">frontend-svc</p>
                  <p className="text-slate-500 text-[10px]">NodePort</p>
                </div>
                <p className="text-slate-500 text-[10px] mt-1">nginx x2</p>
              </div>
              <span className="text-slate-400 font-bold">→</span>
              <span className="text-slate-400 text-xs">curl</span>
              <span className="text-slate-400 font-bold">→</span>
              {/* API */}
              <div className="text-center">
                <div className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded">
                  <p className="text-green-400 text-[10px] font-semibold">api-svc</p>
                  <p className="text-slate-500 text-[10px]">ClusterIP</p>
                </div>
                <p className="text-slate-500 text-[10px] mt-1">httpd x2</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">這個練習串起了今天所有概念</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- <span className="text-cyan-400">Namespace</span> → fullstack-demo 做隔離</p>
            <p>- <span className="text-cyan-400">Deployment</span> → 管副本（各 2 個）</p>
            <p>- <span className="text-cyan-400">Service</span> → 存取入口 + 負載均衡</p>
            <p>- <span className="text-cyan-400">DNS</span> → 前端用 <code>api-svc</code> 連到 API</p>
          </div>
        </div>
      </div>
    ),
    code: `# 一行部署所有東西
kubectl apply -f full-stack.yaml

# 驗證清單
# 1. 看到所有資源都 Running
kubectl get all -n fullstack-demo

# 2. 外部存取前端
minikube service frontend-svc -n fullstack-demo

# 3. 前端可以連到 API（叢集內部）
kubectl exec -it <frontend-pod> -n fullstack-demo -- curl http://api-svc

# 4. DNS 解析正常
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 \\
  --rm -it --restart=Never -- nslookup api-svc

# 清理
kubectl delete namespace fullstack-demo`,
    notes: `好，最後一個練習，我們要把今天學的東西全部串起來。建一個完整的前後端應用。

打開 full-stack.yaml，裡面有五個資源：一個 Namespace、兩個 Deployment、兩個 Service。

架構是這樣的：fullstack-demo Namespace 裡面有一個前端（nginx，2 個副本）和一個 API（httpd，2 個副本）。前端用 NodePort Service 暴露給外部，API 用 ClusterIP Service 只在叢集內部提供。前端可以透過 api-svc 這個 DNS 名稱連到 API。

一行部署所有東西：kubectl apply -f full-stack.yaml。然後看看：kubectl get all -n fullstack-demo。你應該看到 2 個 Deployment、2 個 ReplicaSet、4 個 Pod（前端 2 個 + API 2 個）、2 個 Service。

驗證外部存取：minikube service frontend-svc -n fullstack-demo。瀏覽器應該看到 nginx 的歡迎頁面。

驗證前端可以連到 API。找到一個 frontend Pod 的名字，然後：kubectl exec -it <frontend-pod-name> -n fullstack-demo -- curl http://api-svc。你應該看到 httpd 的 "It works!" 頁面。這證明了前端 Pod 可以透過 Service DNS 名稱連到 API Pod。

最後驗證 DNS：kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc。你會看到 api-svc 被解析成它的 ClusterIP。

恭喜大家，你們剛剛完成了一個接近真實場景的部署！Namespace 做隔離、Deployment 管副本、Service 做存取入口和負載均衡、DNS 讓服務之間用名字互連。

實作完之後，清理：kubectl delete namespace fullstack-demo。`,
    duration: '20',
  },

  // ── Slide 8 最終清理 ──────────────────────────────
  {
    title: '最終清理',
    subtitle: '養成好習慣：用完就清',
    section: '清理',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼要清理？</p>
          <div className="space-y-1 text-slate-300 text-sm">
            <p>- minikube 資源有限</p>
            <p>- 養成好習慣：用完就清</p>
            <p>- 下一堂課從乾淨的環境開始</p>
          </div>
        </div>
      </div>
    ),
    code: `# 清理 default namespace 的資源
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
kubectl delete svc nginx-nodeport 2>/dev/null

# 確認乾淨了
kubectl get all`,
    notes: `在結束之前，我們把 default namespace 裡面的東西也清乾淨。

kubectl delete deployment nginx-deploy、kubectl delete svc nginx-svc。再 kubectl get all 確認一下，應該只剩下 kubernetes 系統 Service。

養成好習慣：每次實作完把資源清掉。一來 minikube 的資源有限，二來下一堂課我們要從乾淨的環境開始。`,
    duration: '2',
  },

  // ── Slide 9 今日總結 ──────────────────────────────
  {
    title: '今日總結',
    subtitle: '四個核心概念 + 三個重點',
    section: '總結',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">今天學了四個核心概念</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">概念</th>
                <th className="text-left py-2">做什麼</th>
                <th className="text-left py-2">Docker 對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Deployment</td>
                <td className="py-2">管理 Pod 副本 + 滾動更新 + 回滾</td>
                <td className="py-2 text-xs"><code>docker compose up --scale</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Service</td>
                <td className="py-2">穩定入口 + 負載均衡</td>
                <td className="py-2 text-xs"><code>-p 8080:80</code> + network DNS</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">DNS</td>
                <td className="py-2">用名字連 Service，不用記 IP</td>
                <td className="py-2 text-xs">Compose 容器名稱 DNS</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400 font-semibold">Namespace</td>
                <td className="py-2">邏輯隔離，同名資源不衝突</td>
                <td className="py-2 text-xs">不同 Compose 專案</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">今天的三個重點</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>1. <span className="text-green-400 font-semibold">永遠不要直接管 Pod</span> — 用 Deployment</p>
            <p>2. <span className="text-green-400 font-semibold">永遠不要用 Pod IP</span> — 用 Service</p>
            <p>3. <span className="text-green-400 font-semibold">善用 Namespace</span> — 隔離環境，跨 Namespace 用 FQDN</p>
          </div>
        </div>
      </div>
    ),
    code: `# 今天新增的 kubectl 指令
kubectl get deploy / rs / svc / ns   # 查看各種資源
kubectl scale deploy <name> --replicas=N
kubectl set image deploy/<name> <container>=<image>
kubectl rollout status / history / undo
kubectl expose deployment <name> --port=80
kubectl get endpoints
kubectl config set-context --current --namespace=<ns>`,
    notes: `好，我們來總結今天學到的東西。

今天學了四個核心概念。Deployment 負責管理 Pod 副本，提供滾動更新和回滾功能。Service 提供穩定的存取入口和負載均衡。DNS 讓你用名字而不是 IP 來連 Service。Namespace 提供邏輯隔離，讓不同環境的同名資源不衝突。

三個最重要的重點。第一，永遠不要直接管 Pod。生產環境都用 Deployment，因為它幫你維持副本數量、做滾動更新、支援一鍵回滾。直接跑 Pod 就像用 Docker 的時候只用 docker run 不寫 Compose 一樣，可以但不建議。

第二，永遠不要用 Pod 的 IP。Pod 的 IP 會變，而且有多個 Pod 的時候你不知道該連哪一個。用 Service，它給你一個永遠不變的 ClusterIP 和 DNS 名稱。

第三，善用 Namespace。不同的環境用不同的 Namespace 隔離。同一個 Namespace 裡用 Service 短名稱，跨 Namespace 要用 FQDN：<service>.<namespace>.svc.cluster.local。`,
    duration: '5',
  },

  // ── Slide 10 Docker → K8s 對照表更新 ──────────────
  {
    title: 'Docker → K8s 對照表更新',
    subtitle: '到目前為止的完整對照',
    section: '總結',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Docker</th>
                <th className="text-left py-2">K8s</th>
                <th className="text-center py-2 w-20">學了嗎</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">docker run</code></td>
                <td className="py-2">Pod</td>
                <td className="py-2 text-center text-slate-500">第四堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">docker ps / logs / exec</code></td>
                <td className="py-2"><code className="text-xs">kubectl get / logs / exec</code></td>
                <td className="py-2 text-center text-slate-500">第四堂</td>
              </tr>
              <tr className="border-b border-slate-700 bg-cyan-900/10">
                <td className="py-2"><code className="text-xs">docker compose up --scale web=3</code></td>
                <td className="py-2">Deployment <code className="text-xs">replicas: 3</code></td>
                <td className="py-2 text-center text-cyan-400">今天</td>
              </tr>
              <tr className="border-b border-slate-700 bg-cyan-900/10">
                <td className="py-2"><code className="text-xs">--restart always</code></td>
                <td className="py-2">Deployment（自動重建）</td>
                <td className="py-2 text-center text-cyan-400">今天</td>
              </tr>
              <tr className="border-b border-slate-700 bg-cyan-900/10">
                <td className="py-2"><code className="text-xs">-p 8080:80</code></td>
                <td className="py-2">Service (NodePort / ClusterIP)</td>
                <td className="py-2 text-center text-cyan-400">今天</td>
              </tr>
              <tr className="border-b border-slate-700 bg-cyan-900/10">
                <td className="py-2"><code className="text-xs">--network</code> + 容器名稱 DNS</td>
                <td className="py-2">Service + CoreDNS</td>
                <td className="py-2 text-center text-cyan-400">今天</td>
              </tr>
              <tr className="border-b border-slate-700 bg-cyan-900/10">
                <td className="py-2">不同 Compose 專案</td>
                <td className="py-2">Namespace</td>
                <td className="py-2 text-center text-cyan-400">今天</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">Nginx 反向代理</td>
                <td className="py-2">Ingress</td>
                <td className="py-2 text-center text-slate-500">下一堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">-e ENV_VAR</code></td>
                <td className="py-2">ConfigMap</td>
                <td className="py-2 text-center text-slate-500">下一堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2"><code className="text-xs">.env</code> 密碼</td>
                <td className="py-2">Secret</td>
                <td className="py-2 text-center text-slate-500">下一堂</td>
              </tr>
              <tr>
                <td className="py-2"><code className="text-xs">docker volume</code></td>
                <td className="py-2">PV / PVC</td>
                <td className="py-2 text-center text-slate-500">下一堂</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `我們來更新一下 Docker 到 K8s 的對照表。

上一堂課我們對照了 Pod 等於 docker run、kubectl 等於 docker 的各種指令。今天我們又新增了好幾項。

docker compose up --scale web=3 對應 K8s 的 Deployment replicas。Docker 的 --restart always 對應 Deployment 的自動重建功能。Docker 的 -p 8080:80 對應 K8s 的 Service。Docker Compose 裡容器名稱做 DNS 對應 K8s 的 CoreDNS。不同的 Compose 專案對應 K8s 的 Namespace。

下一堂課我們會繼續補完這張表：Ingress、ConfigMap、Secret、PV/PVC。到第七堂課結束的時候，Docker 的每個功能你都能找到 K8s 的對應物。`,
    duration: '3',
  },

  // ── Slide 11 反思問題 + 下堂預告 ──────────────────
  {
    title: '反思問題 + 下堂預告',
    subtitle: '第六堂：設定與資料',
    section: '總結',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-3">反思問題</p>
          <div className="space-y-3 text-slate-300 text-sm">
            <div className="bg-slate-800/50 p-3 rounded">
              <p className="text-amber-400 font-semibold">問題 1</p>
              <p>你的 API 在跑了、NodePort 也建好了。使用者可以用 <code>http://&lt;node-ip&gt;:30080</code> 存取。</p>
              <p className="mt-1">但生產環境，不可能叫使用者輸入 IP 和 Port。</p>
              <p className="text-cyan-400 font-semibold mt-1">怎麼讓使用者用 https://myapp.com 就能連到你的服務？</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded">
              <p className="text-amber-400 font-semibold">問題 2</p>
              <p>你的資料庫密碼現在寫死在 YAML 裡，推到 Git 就全世界都看到了。</p>
              <p className="text-cyan-400 font-semibold mt-1">怎麼安全地管理這些敏感資訊？</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">下堂課預告：第六堂 — 設定與資料</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">主題</th>
                <th className="text-left py-2">解決什麼</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">Ingress</td>
                <td className="py-2">用域名存取 + HTTPS</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">ConfigMap</td>
                <td className="py-2">把設定從 Image 裡抽出來</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">Secret</td>
                <td className="py-2">安全管理密碼</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">PV / PVC</td>
                <td className="py-2">資料持久化（Pod 死了資料不能丟）</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Helm</td>
                <td className="py-2">套件管理（不要手寫 100 個 YAML）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ kubectl get svc 看到 ClusterIP Service</p>
            <p>✓ kubectl get endpoints 看到 Service 對應的 Pod IP 列表</p>
            <p>✓ 瀏覽器打 worker-IP:30080 看到 nginx 頁面（NodePort）</p>
            <p>✓ 從 Pod 裡 curl http://nginx-svc 用名稱連到 Service（DNS）</p>
            <p>✓ 在不同 Namespace 部署同名 Service 不會衝突</p>
            <p>✓ 跨 Namespace 用 svc.namespace.svc.cluster.local 連到</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg text-center">
          <p className="text-green-400 font-semibold">今天的課程到這裡，大家辛苦了，我們下堂課見！</p>
        </div>
      </div>
    ),
    notes: `最後，留兩個反思問題給大家。

第一個問題：你的 API 服務跑起來了，NodePort 也建好了，使用者可以用 Node 的 IP 加上 30080 port 來存取。但在生產環境，你總不能叫使用者輸入 192.168.1.100:30080 吧？怎麼讓使用者用一個漂亮的域名，比如 https://myapp.com，就能連到你的服務？

第二個問題：假設你的 API 要連資料庫，密碼寫在 Deployment 的 YAML 裡面。如果這個 YAML 推到 Git，全世界都能看到你的資料庫密碼。怎麼辦？

這兩個問題的答案就是下一堂課的內容。下一堂課我們會學 Ingress — 用域名存取你的服務、ConfigMap — 把設定從 Image 裡面抽出來、Secret — 安全地管理密碼、PV/PVC — 資料持久化、以及 Helm — K8s 的套件管理工具。

好，今天的課程到這裡。大家辛苦了，我們下堂課見！`,
    duration: '3',
  },
]
