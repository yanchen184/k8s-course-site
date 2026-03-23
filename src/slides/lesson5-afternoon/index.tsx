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
    notes: `整理三種 Service 類型。

ClusterIP：預設類型，只能在叢集內部存取。前端連 API、API 連資料庫，都用這個。

NodePort：在每個 Node 上開一個 30000-32767 的 port，外部用 node-ip:port 存取。適合測試環境。

LoadBalancer：跟雲端平台（AWS、GCP、Azure）要一個外部負載均衡器，自動分配公開 IP。適合生產環境。minikube 上沒有真正的雲端負載均衡器，所以用不了。

三個類型是遞增關係：NodePort 包含 ClusterIP 功能，LoadBalancer 包含 NodePort 功能。建一個 NodePort Service，它同時也有 ClusterIP。

選法：叢集內部用 ClusterIP，測試要外部連用 NodePort，生產環境用 LoadBalancer 或 Ingress（下一堂課教）。`,
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
    notes: `剛才在 Lab 3，從臨時 Pod 用 curl http://nginx-svc 連到了 nginx Service。用的是名字不是 IP，靠的就是 CoreDNS。

K8s 叢集內建 CoreDNS。每當你建立一個 Service，CoreDNS 自動新增一筆 DNS 記錄，把 Service 名字對應到 ClusterIP。Pod 啟動時，K8s 自動設定 /etc/resolv.conf 指向 CoreDNS，所以 Pod 裡用 Service 名字查詢，CoreDNS 會解析成 Service IP。

DNS 完整格式：<service-name>.<namespace>.svc.cluster.local。nginx-svc 在 default namespace，完整就是 nginx-svc.default.svc.cluster.local。

三種寫法：同 Namespace 直接寫 nginx-svc，K8s 自動補後綴。跨 Namespace 寫到 namespace 名稱，如 nginx-svc.production。完整 FQDN 只在需要絕對明確時才用。

Docker Compose 對照：Compose 容器名稱也會變 DNS，用 http://api:8080 連。但 Compose DNS 只限同一個 Docker network。K8s 的 CoreDNS 可以跨 Namespace，加上 namespace 名稱就好。`,
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
    notes: `來驗證 DNS。

建臨時 busybox Pod：kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh。用 busybox 是因為裡面有 wget 和 nslookup。

短名稱連線：wget -qO- http://nginx-svc。-q 安靜模式，-O- 輸出到標準輸出。會看到 nginx HTML 歡迎頁面。

完整 FQDN：wget -qO- http://nginx-svc.default.svc.cluster.local。一樣能連到，兩種寫法指向同一個 Service。

重點：nslookup nginx-svc。Server 那行是 CoreDNS 的地址，Name 顯示完整 FQDN，Address 是 nginx-svc 的 ClusterIP。這證明 Pod 裡用 Service 名稱，CoreDNS 自動解析成 ClusterIP，不需要手動設定 DNS。

輸入 exit 離開。`,
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
    notes: `Namespace，命名空間。

場景：團隊有 dev 和 staging 環境，都要部署 api-deploy、frontend-deploy、api-svc。全部放 default namespace，名字衝突 — K8s 不允許同 Namespace 有兩個同名 Deployment。

解法：建 dev 和 staging 兩個 Namespace，各自部署同名資源，互不干擾。

K8s 預設 Namespace：default 是沒指定時的預設位置，我們之前操作都在這裡。kube-system 放系統元件（API Server、CoreDNS）。kube-public 和 kube-node-lease 不用管。

注意：Namespace 只是邏輯分組，不是安全隔離。不同 Namespace 的 Pod 預設可以互連。要網路隔離得用 NetworkPolicy（第七堂課教）。

Docker 對照：最接近的是不同目錄的 Docker Compose 專案，服務名稱可以一樣。但 Compose 隔離靠不同 Docker network，跟 K8s Namespace 機制不同。`,
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
    notes: `動手玩 Namespace。

建立 dev 和 staging：kubectl apply -f namespace-practice.yaml。kubectl get namespaces 確認多了 dev 和 staging。

在 dev 部署：kubectl create deployment nginx-dev --image=nginx:1.27 -n dev。-n dev 指定 Namespace。kubectl get pods -n dev 確認 Pod 在跑。

在 staging 部署同名 Deployment：kubectl create deployment nginx-dev --image=nginx:1.27 -n staging。名字一樣叫 nginx-dev，不同 Namespace 不衝突。kubectl get pods -n staging 確認。

看所有 Namespace 的 Deployment：kubectl get deployments -A。-A 是 --all-namespaces 的縮寫，dev 和 staging 各有一個 nginx-dev。

跨 Namespace 存取：先在 dev 建 Service：kubectl expose deployment nginx-dev --port=80 -n dev。

從 default 跨過去連：kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-dev.dev.svc.cluster.local。

DNS 名稱用 nginx-dev.dev.svc.cluster.local，因為從 default 跨到 dev，不能只寫 nginx-dev，否則會去找 default 的 nginx-dev Service，找不到。規則：同 Namespace 用短名稱，跨 Namespace 加 namespace 名稱。

清理：kubectl delete namespace dev staging。刪 Namespace 會連帶刪除裡面所有資源，生產環境不要隨便刪。`,
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
    notes: `實用技巧：每次打 -n dev 很煩，可以設定預設 Namespace。

kubectl config set-context --current --namespace=dev，之後 kubectl get pods 預設看 dev。切回 default：kubectl config set-context --current --namespace=default。

確認目前在哪個 Namespace：kubectl config view --minify | grep namespace。

使用建議：開發測試用 Namespace 隔離環境（dev、staging、production），不同團隊用不同 Namespace。搭配 RBAC（第七堂課教），可以限制工程師只能存取 dev Namespace，不能碰 production。`,
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
    notes: `最後一個練習，把今天學的全部串起來，建一個前後端應用。

full-stack.yaml 裡面五個資源：一個 Namespace、兩個 Deployment、兩個 Service。

架構：fullstack-demo Namespace 裡，前端（nginx x2）用 NodePort Service 暴露給外部，API（httpd x2）用 ClusterIP Service 只在叢集內部。前端透過 api-svc DNS 名稱連 API。

部署：kubectl apply -f full-stack.yaml。kubectl get all -n fullstack-demo 確認 2 個 Deployment、2 個 ReplicaSet、4 個 Pod、2 個 Service。

驗證外部存取：minikube service frontend-svc -n fullstack-demo，瀏覽器看到 nginx 歡迎頁面。

驗證前端連 API：找到 frontend Pod 名字，kubectl exec -it <frontend-pod-name> -n fullstack-demo -- curl http://api-svc，看到 httpd 的 "It works!" 頁面。這證明前端 Pod 透過 Service DNS 連到 API Pod。

驗證 DNS：kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc，確認 api-svc 解析成 ClusterIP。

清理：kubectl delete namespace fullstack-demo。`,
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
    notes: `總結今天四個核心概念：

Deployment：kubectl create deployment 建立，kubectl scale 調副本，kubectl set image 更新映像檔，kubectl rollout undo 回滾。

Service：kubectl expose deployment 建立，ClusterIP 叢集內部用，NodePort 外部用 node-ip:port 存取。kubectl get endpoints 看 Service 對應哪些 Pod IP。

DNS：CoreDNS 自動把 Service 名稱解析成 ClusterIP。同 Namespace 用短名稱 nginx-svc，跨 Namespace 用 nginx-svc.dev.svc.cluster.local。

Namespace：kubectl create namespace 建立，-n 指定操作的 Namespace，-A 看所有 Namespace。

三個重點：第一，不要直接管 Pod，用 Deployment 維持副本、滾動更新、一鍵回滾。第二，不要用 Pod IP，用 Service 的 ClusterIP 和 DNS 名稱。第三，善用 Namespace 隔離環境，跨 Namespace 用 FQDN。`,
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
    notes: `更新 Docker 到 K8s 對照表。

今天新增的對照：docker compose up --scale web=3 對應 Deployment replicas。--restart always 對應 Deployment 自動重建。-p 8080:80 對應 Service（NodePort/ClusterIP）。Docker Compose 容器名稱 DNS 對應 CoreDNS。不同 Compose 專案對應 Namespace。

下一堂課繼續補：Ingress、ConfigMap、Secret、PV/PVC。`,
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
    notes: `兩個反思問題。

第一：API 跑起來了，NodePort 建好了，使用者用 192.168.1.100:30080 存取。生產環境不可能這樣。怎麼讓使用者用 https://myapp.com 連到服務？答案是 Ingress。

第二：API 要連資料庫，密碼寫在 YAML 裡推到 Git，全世界看到密碼。怎麼辦？答案是 Secret。

下一堂課內容：Ingress 用域名存取服務、ConfigMap 把設定從 Image 抽出來、Secret 管理密碼、PV/PVC 資料持久化、Helm 套件管理。

我們下堂課見。`,
    duration: '3',
  },
]
