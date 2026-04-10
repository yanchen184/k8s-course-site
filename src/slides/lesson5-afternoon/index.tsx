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
  // ============================================================
  // 5-12：ClusterIP Service（5-12, 5-13, 5-14）
  // ============================================================

  // ── 5-12 概念（1/2）：Pod IP 三大問題 + Service 解法 ──
  {
    title: 'Pod IP 三大問題 → Service 解法',
    subtitle: 'IP 會變、流量沒分散、外面連不到',
    section: '5-12：ClusterIP Service',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">Pod IP 三大問題</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">IP 會變</strong> -- Pod 掛了重建，IP 就不同了。寫死 IP 連線早晚會斷。</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">流量沒分散</strong> -- 3 個 Pod 你連哪個？全連同一個，擴容的意義在哪？</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">外面連不到</strong> -- Pod IP 是叢集內部虛擬 IP，瀏覽器打不開。</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">解法：Service</p>
          <div className="space-y-2 text-slate-300 text-sm">
            <p>Service = <strong className="text-white">穩定入口</strong> + <strong className="text-white">負載均衡</strong></p>
            <p>不管後面的 Pod 怎麼換，Service 的地址不變</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三種 Service 類型</p>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="bg-cyan-900/40 border border-cyan-500/40 px-3 py-1 rounded text-cyan-300">ClusterIP</span>
            <span className="text-slate-400 font-bold">⊂</span>
            <span className="bg-green-900/40 border border-green-500/40 px-3 py-1 rounded text-green-300">NodePort</span>
            <span className="text-slate-400 font-bold">⊂</span>
            <span className="bg-amber-900/40 border border-amber-500/40 px-3 py-1 rounded text-amber-300">LoadBalancer</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">先從 ClusterIP 開始 -- 叢集內部的穩定 IP</p>
        </div>
      </div>
    ),
    code: `# 現場 demo：Pod IP 會變
kubectl get pods -o wide   # 記下某個 Pod 的 IP

kubectl delete pod <pod名稱>   # 刪掉它

kubectl get pods -o wide   # 新 Pod IP 不一樣了！
# → 這就是「IP 會變」問題的直接體現`,
    notes: `【① 課程內容】
Pod IP 三大問題：
1. IP 會變：Pod 重啟後 IP 會改變，無法寫死 IP 在程式裡
2. 流量沒分散：Deployment 跑多個 Pod 副本，呼叫方不知道要連哪一個
3. 外面連不到：Pod IP 是叢集內部虛擬 IP，瀏覽器打不開

Service 的定位：
- Service 是穩定的「虛擬入口」：提供固定的 ClusterIP + DNS 名稱
- 同時扮演負載均衡器：把流量分散到後端多個 Pod
- Service 本身不跑 Pod，是一層抽象規則，由 kube-proxy 在每個 Node 上實作

三種 Service 類型遞增包含關係：
ClusterIP（最基礎，內部用）⊂ NodePort（加上 Node 開 Port）⊂ LoadBalancer（加上外部 LB IP）

本 Loop 先學 ClusterIP：叢集內部的穩定虛擬 IP，只有叢集內部的 Pod 能連。

【② 指令講解】
（本張投影片為概念說明，無操作指令）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── 5-12 概念（2/2）：ClusterIP 原理 + Service YAML ──
  {
    title: 'ClusterIP Service 原理',
    subtitle: 'selector 對應 Pod Labels + port / targetPort',
    section: '5-12：ClusterIP Service',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">ClusterIP 流量路線</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-green-400 text-xs font-semibold">其他 Pod</p>
              <p className="text-slate-500 text-[10px]">curl nginx-svc</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">&rarr;</span>
            <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-cyan-400 text-xs font-semibold">Service (ClusterIP)</p>
              <p className="text-slate-500 text-[10px]">10.43.0.150:80</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">&rarr;</span>
            <div className="flex flex-col gap-1">
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 1 (10.42.0.15)</p>
              </div>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 2 (10.42.1.8)</p>
              </div>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 3 (10.42.2.12)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Service YAML 三重點</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold w-32">type</td>
                <td className="py-2">ClusterIP（預設，可省略）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">selector</td>
                <td className="py-2">app: nginx -- 跟 Pod labels 一致</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-cyan-400 font-semibold">ports</td>
                <td className="py-2">port: 80 (Service) / targetPort: 80 (Pod)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">黃金法則（再說一次）</p>
          <p className="text-slate-300 text-xs mt-1">Deployment selector = Pod template labels = Service selector -- 三者要對上！</p>
        </div>
      </div>
    ),
    code: `# service-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP        # 預設值，可省略
  selector:
    app: nginx           # 跟 Pod labels 一致
  ports:
    - port: 80           # Service 監聽的 Port
      targetPort: 80     # 轉發到 Pod 的 Port`,
    notes: `【① 課程內容】
Label Selector 與 Endpoints：
- Service 透過 selector 比對 Pod 的 label，找到所有符合的 Pod
- K8s 自動維護 Endpoints 物件，記錄目前所有健康 Pod 的 IP:Port
- Pod 上線 → 自動加入 Endpoints；Pod 下線 → 自動移除，無需手動更新

ClusterIP 的特性：
- 是一個叢集內部的虛擬 IP（Virtual IP），不綁定任何 Node 或網卡
- 只有叢集內部的 Pod 能連，外部瀏覽器或本機直接連不到

port vs targetPort：
- port：Service 監聽的 port（呼叫方連這個）
- targetPort：流量轉發到 Pod 的哪個 port（Pod 內的應用程式監聽的）
- 兩者可以不同，例如 port: 80 轉發到 targetPort: 8080
- Docker 對照：Docker Compose 同一個 network 下，web 容器可以直接用 db 當主機名稱連線，ClusterIP 就是同樣的概念（Service 名稱即主機名稱）

黃金法則：Deployment selector = Pod template labels = Service selector，三者要對上！

【② 指令講解】
（本張投影片為概念說明，無操作指令）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── 5-13 實作（1/2）：ClusterIP 建立 + 驗證 ──
  {
    title: 'Lab：建立 ClusterIP Service',
    subtitle: 'apply → get svc → get endpoints → curl 驗證',
    section: '5-12：ClusterIP Service',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認 Deployment 在跑：<code className="text-green-400">kubectl get deployments</code> -- READY 3/3</li>
            <li><code className="text-green-400">kubectl apply -f service-clusterip.yaml</code></li>
            <li><code className="text-green-400">kubectl get svc</code> -- 看到 nginx-svc TYPE=ClusterIP</li>
            <li><code className="text-green-400">kubectl get endpoints nginx-svc</code> -- 三個 Pod IP</li>
            <li>建臨時 Pod 驗證：<code className="text-green-400">kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh</code></li>
            <li><code className="text-green-400">curl http://nginx-svc</code> -- 看到 nginx 歡迎頁</li>
            <li><code className="text-green-400">curl http://nginx-svc.default.svc.cluster.local</code> -- 也行</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">驗證 Endpoints 自動更新</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get endpoints nginx-svc</code> -- 記下三個 IP</li>
            <li><code className="text-green-400">kubectl delete pod &lt;name&gt;</code> -- 刪一個 Pod</li>
            <li><code className="text-green-400">kubectl get endpoints nginx-svc</code> -- IP 列表自動更新</li>
          </ol>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
實作 ClusterIP Service 的完整流程：apply → get svc → get endpoints → 進 Pod 驗證連線 → 驗證 Endpoints 自動更新。

【② 指令講解】
環境確認（下午開始前先做）：
kubectl get deploy → 確認 nginx-deploy 在跑（READY 3/3）
若不在，執行 kubectl apply -f nginx-deployment.yaml 重建
kubectl scale deployment nginx-deploy --replicas=3（確保 3 個 Pod）

指令 1：kubectl apply -f service-clusterip.yaml
用途：宣告式套用 Service YAML
參數說明：apply 宣告式套用；-f 指定 YAML 檔路徑
打完要看：service/nginx-svc created（或 configured/unchanged）
異常：error: unable to recognize → YAML 格式錯誤，檢查縮排（用空格不要用 Tab）

指令 2：kubectl get svc
用途：列出所有 Service
打完要看：nginx-svc 的 TYPE=ClusterIP，CLUSTER-IP 有分配到 IP，EXTERNAL-IP 是 (none)

指令 3：kubectl get endpoints nginx-svc（縮寫 kubectl get ep nginx-svc）
用途：查看 Service 對應到哪些 Pod IP
打完要看：ENDPOINTS 欄位列出三個 Pod IP:Port
異常：顯示 (none) → selector 沒對上，用 kubectl get pods --show-labels 確認 Pod label

指令 4：kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
用途：建臨時 Pod 進入叢集內部驗證連線
參數說明：--rm Pod 結束後自動刪除；-it 互動式 terminal；--restart=Never 跑完就結束；-- sh 進入 shell
打完要看：/ $ 提示符代表進入 Pod 內部

指令 5（在 Pod 內）：curl http://nginx-svc
用途：用 Service 名稱驗證叢集內部連線
打完要看：nginx 預設首頁 HTML，包含 Welcome to nginx!
異常：Could not resolve host → CoreDNS 問題；Connection refused → targetPort 設錯

指令 6（在 Pod 內）：curl http://nginx-svc.default.svc.cluster.local
用途：用完整 FQDN 驗證連線（和短名稱效果相同）
打完要看：同樣是 nginx 首頁 HTML

FQDN 每一段的意思：
  nginx-svc          → Service 名稱（metadata.name）
  default            → Namespace 名稱（這個 Service 在哪個 Namespace）
  svc                → 固定值，代表這是 Service 資源
  cluster.local      → 叢集的 DNS 域名（預設值，幾乎不會改）
  完整格式：<service-name>.<namespace>.svc.cluster.local

為什麼短名稱 nginx-svc 也能通？
  Pod 啟動時，K8s 自動在 /etc/resolv.conf 寫入 search domain：
    search default.svc.cluster.local svc.cluster.local cluster.local
  所以 curl http://nginx-svc 會被自動補成 nginx-svc.default.svc.cluster.local
  驗證：在測試 Pod 內執行 cat /etc/resolv.conf 就能看到

什麼時候必須用 FQDN？
  同一個 Namespace 內 → 短名稱就夠（nginx-svc）
  跨 Namespace → 短名稱找不到，必須至少寫到 namespace（nginx-svc.dev）
  最保險 → 完整 FQDN（nginx-svc.dev.svc.cluster.local），5-14 Namespace 會詳細教

指令 7：kubectl describe svc nginx-svc
用途：查看 Service 詳細資訊（Selector、Endpoints、Port 等）
打完要看：Selector: app=nginx，Endpoints 列出 Pod IP

驗證 Endpoints 自動更新：
指令 8：kubectl get endpoints nginx-svc（記下三個 IP）
指令 9：kubectl delete pod <其中一個 Pod 名稱>（刪一個 Pod）
指令 10：kubectl get endpoints nginx-svc（IP 列表自動更新，新 Pod IP 取代舊的）

【③④ 題目 + 解答】
（無，Lab 在下一張）
[▶ 下一頁]`,
  },

  // ── 5-13 學員實作 ──
  {
    title: '學員實作：ClusterIP Service',
    subtitle: 'Loop 4 練習題',
    section: '5-12：ClusterIP Service',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：httpd Deployment + ClusterIP Service</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 httpd Deployment：<code className="text-green-400">image: httpd</code>，replicas: 2</li>
            <li>建 ClusterIP Service：selector 跟 Pod labels 一致</li>
            <li>用測試 Pod 進去連 <code className="text-green-400">httpd-svc</code></li>
            <li>你應該看到 <code className="text-cyan-400">It works!</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：觀察 Endpoints 變化</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl get endpoints</code> 觀察</li>
            <li>scale Deployment 從 2 改成 4</li>
            <li>再看 endpoints 是不是跟著變多了</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 學員實作 Loop 4：建立 httpd ClusterIP Service
kubectl apply -f httpd-deploy.yaml
kubectl apply -f httpd-svc.yaml
kubectl get svc   # 確認 TYPE=ClusterIP

# 進入測試 Pod 驗證連線
kubectl run test-curl --image=curlimages/curl \
  --rm -it --restart=Never -- sh
# 在 Pod 內：
curl http://httpd-svc
# 成功看到 <html><body><h1>It works!</h1></body></html>

# 挑戰：觀察 Endpoints 變化
kubectl get endpoints httpd-svc       # 記下 2 個 Pod IP
kubectl scale deployment httpd --replicas=4
kubectl get endpoints httpd-svc       # Endpoints 自動變 4 個`,
    notes: `【① 課程內容】
學員練習時間：自行從零建立 httpd Deployment + ClusterIP Service，完成叢集內部連線驗證。

【② 指令講解】
必做：
kubectl apply -f httpd-deploy.yaml → 建 httpd Deployment（replicas: 2）
kubectl apply -f httpd-svc.yaml → 建 ClusterIP Service（selector 跟 Pod labels 一致）
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh → 進入測試 Pod
curl http://httpd-svc → 看到 It works! 代表成功

挑戰：
kubectl get endpoints httpd-svc → 記下 2 個 Pod IP
kubectl scale deployment httpd --replicas=4 → scale up
kubectl get endpoints httpd-svc → 確認 Endpoints 自動新增到 4 個

【③④ 題目 + 解答】
（無，Lab 在下一張）
[▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-14 回頭操作 ──
  {
    title: 'ClusterIP 排錯 + 常見坑',
    subtitle: '回頭操作 Loop 4',
    section: '5-12：ClusterIP Service',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get deployments</code> -- READY 3/3</li>
            <li><code className="text-green-400">kubectl apply -f service-clusterip.yaml</code></li>
            <li><code className="text-green-400">kubectl get svc</code> -- nginx-svc TYPE=ClusterIP</li>
            <li><code className="text-green-400">kubectl get endpoints nginx-svc</code> -- 三個 Pod IP</li>
            <li>測試 Pod curl <code className="text-green-400">http://nginx-svc</code> -- nginx 歡迎頁</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Service 連不上？排錯流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get endpoints &lt;svc&gt;</code> -- 空的？selector 沒對上！</li>
            <li><code className="text-green-400">kubectl describe svc &lt;svc&gt;</code> -- 看 Selector 值</li>
            <li><code className="text-green-400">kubectl get pods --show-labels</code> -- 看 Pod labels</li>
            <li>兩邊對一下 -- 差一個字母就找不到</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">另一個坑：targetPort 寫錯</p>
          <p className="text-slate-300 text-xs mt-1">Endpoints 有 IP 但 curl connection refused -- 檢查容器監聽的 Port 跟 targetPort 是否一致</p>
        </div>
      </div>
    ),
    code: `# 現場 demo：排錯流程
# Step 1：先看 Endpoints 是不是空的
kubectl get endpoints nginx-svc
# → ENDPOINTS 欄位是 <none> → selector 問題
# → 有 IP:Port → 連接問題（看 targetPort）

# Step 2：比對 selector vs Pod labels
kubectl describe svc nginx-svc | grep Selector
kubectl get pods --show-labels
# → 找出不一致的地方

# Step 3：看 Service 詳細
kubectl describe svc nginx-svc`,
    notes: `【① 課程內容】
ClusterIP Service 排錯流程總整理：Endpoints 空的 → selector 問題；Endpoints 有 IP 但連不上 → targetPort 問題。

【② 指令講解】
指令 1：kubectl get endpoints [svc]（縮寫 kubectl get ep [svc]）
用途：快速判斷 selector 是否對上
打完要看：若 ENDPOINTS 欄位有 IP → selector 正確；若是 (none) → selector 沒對上
異常：(none) → 執行下面兩個指令交叉比對

指令 2：kubectl describe svc [svc]
用途：查看 Service 的 Selector 設定值
打完要看：Selector: app=nginx
異常：Selector 和 Pod label 不一致 → 修改 YAML 重新 apply

指令 3：kubectl get pods --show-labels
用途：查看 Pod 實際的 labels
打完要看：LABELS 欄位顯示 app=nginx
重點：Selector 值和 Pod labels 值必須完全一致，連空格都不能有

排錯口訣：連不上 → 先看 endpoints 有沒有 IP → 沒有就檢查 selector → 有的話就檢查 targetPort

【③④ 題目 + 解答】
題目 1：我幫你準備了一個 Service YAML，selector 故意打錯成 'app: my-nginx'（但 Pod label 是 'app: nginx'）。
操作：
  kubectl apply -f broken-clusterip.yaml
  kubectl get ep nginx-svc          # 確認 Endpoints 是 (none)
  kubectl get pods --show-labels    # 找出 Pod 實際 label
  kubectl describe svc nginx-svc    # 找出 selector 哪裡錯了
  # 修正 selector 後重新 apply
  kubectl apply -f broken-clusterip.yaml
  kubectl get ep nginx-svc          # 驗收：Endpoints 出現 Pod IP
驗收標準：Endpoints 欄位從 (none) 變成有 Pod IP:80

題目 2：把 Service YAML 的 targetPort 故意改成 81（nginx 只監聯 80），apply 後進測試 Pod curl http://nginx-svc，觀察 error 訊息跟 selector 打錯的 error 有什麼不同。
操作：
  # 修改 service-clusterip.yaml 的 targetPort: 81
  kubectl apply -f service-clusterip.yaml
  kubectl get ep nginx-svc          # Endpoints 有 IP（selector 對了）
  kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
  curl http://nginx-svc             # 觀察 error
驗收標準：看到 'Connection refused'（不是 Could not resolve host），因為 selector 對了但 Pod 沒在 81 監聽。改回 targetPort: 80 後 curl 成功。

題目 3：進入測試 Pod 執行 curl http://nginx-svc，截圖確認看到 'Welcome to nginx!' 字樣。
操作：
  kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
  # 在 Pod 內：
  curl http://nginx-svc
  exit
驗收標準：輸出包含 'Welcome to nginx!'
[▶ 下一頁：Lab 4]`,
  },

  // ── Lab 4：ClusterIP 情境修復 ──
  {
    title: 'Lab 4：API 連線中斷，找出 Bug 並修復',
    subtitle: '情境：selector 和 Pod label 不一致',
    section: '5-12：ClusterIP Service',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">情境說明</p>
          <p className="text-slate-300 text-sm">
            你部署了一個後端 API（nginx 模擬），另一個 Pod 要呼叫它，卻一直連不到。
            收到的錯誤是 <code className="text-red-400">curl: (7) Failed to connect to api-svc port 80: Connection refused</code>。
            請找出問題並修復。
          </p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">任務步驟</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>apply 下方有 bug 的 YAML</li>
            <li>用 <code className="text-green-400">kubectl exec</code> 進入 client Pod 測試連線</li>
            <li>觀察 <code className="text-green-400">kubectl get ep api-svc</code> 找 bug</li>
            <li>修復 YAML（selector 和 Pod label 要一致）</li>
            <li>再次測試連線，確認成功</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">驗收標準</p>
          <p className="text-slate-300 text-xs mt-1">
            kubectl exec client -- curl http://api-svc 回傳 Welcome to nginx!
          </p>
        </div>
      </div>
    ),
    code: `# lab4-buggy.yaml（有 bug，找出並修復）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api          # Pod 的 label 是 app: api
    spec:
      containers:
      - name: api
        image: nginx:1.27
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  type: ClusterIP
  selector:
    app: api-server     # BUG：和 Pod label 不一致！應該是 app: api
  ports:
  - port: 80
    targetPort: 80
---
apiVersion: v1
kind: Pod
metadata:
  name: client
spec:
  containers:
  - name: client
    image: curlimages/curl
    command: ["sleep", "3600"]
---
# 操作指令
kubectl apply -f lab4-buggy.yaml
kubectl exec client -- curl http://api-svc   # 會失敗
kubectl get ep api-svc                        # 看到 (none) → selector 有問題
kubectl get pods --show-labels               # 確認 Pod 實際 label
# 修復：把 Service selector 改成 app: api
# 修復後再次驗證
kubectl apply -f lab4-buggy.yaml
kubectl exec client -- curl http://api-svc   # 應該成功`,
    notes: `【① 課程內容】
Lab 4 情境：ClusterIP Service 的 selector 和 Pod label 不一致，導致 Endpoints 為空，連線失敗。學生需要診斷 → 找出 bug → 修復 → 驗收。

【② 指令講解】
指令 1：kubectl apply -f lab4-buggy.yaml
用途：套用有 bug 的 YAML，建立環境

指令 2：kubectl exec client -- curl http://api-svc
用途：在 client Pod 內測試對 api-svc 的連線
打完要看：失敗，顯示 Connection refused（Service 有建立所以 DNS 解析成功，但 Endpoints 空所以連不到）
→ 這就是 bug 的症狀

指令 3：kubectl get ep api-svc
用途：確認 Endpoints 是否為空
打完要看：(none) → 代表 selector 沒有對到任何 Pod

指令 4：kubectl get pods --show-labels
用途：查看 Pod 實際有哪些 label
打完要看：LABELS 欄位顯示 app=api

交叉比對：
- Service selector：app: api-server（錯的）
- Pod label：app: api（對的）
→ 不一致！

修復：把 Service 的 selector 從 app: api-server 改成 app: api

指令 5（修復後）：kubectl apply -f lab4-buggy.yaml
指令 6（修復後）：kubectl exec client -- curl http://api-svc
打完要看：Welcome to nginx! → 修復成功！

【③④ 題目 + 解答】
題目：為什麼 kubectl get ep api-svc 顯示 (none) 就代表 selector 有問題？
解答：Endpoints 是 K8s 自動維護的物件，記錄符合 Service selector 的所有健康 Pod IP。
若 Endpoints 為 (none)，代表沒有任何 Pod 的 label 能符合 Service 的 selector，流量自然無法轉發，所有連線都會失敗。
[▶ 下一頁]`,
  },

  // ============================================================
  // 5-13：NodePort + 三種比較（5-15, 5-16, 5-17）
  // ============================================================

  // ── 5-15 概念（1/2）：NodePort 原理 ──
  {
    title: 'NodePort -- 讓外面的人連進來',
    subtitle: '在每個 Node 上開 Port（30000-32767）',
    section: '5-13：NodePort + 三種比較',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">NodePort 流量路線</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-amber-400 text-xs font-semibold">外部使用者</p>
              <p className="text-slate-500 text-[10px]">192.168.64.3:30080</p>
            </div>
            <span className="text-slate-400 font-bold">&rarr;</span>
            <div className="bg-blue-900/40 border border-blue-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-blue-400 text-xs font-semibold">Node (kube-proxy)</p>
              <p className="text-slate-500 text-[10px]">nodePort: 30080</p>
            </div>
            <span className="text-slate-400 font-bold">&rarr;</span>
            <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-cyan-400 text-xs font-semibold">Service</p>
              <p className="text-slate-500 text-[10px]">port: 80</p>
            </div>
            <span className="text-slate-400 font-bold">&rarr;</span>
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-green-400 text-xs font-semibold">Pod</p>
              <p className="text-slate-500 text-[10px]">targetPort: 80</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三個 Port 的關係</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Port</th>
                <th className="text-left py-2">誰用</th>
                <th className="text-left py-2">值</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-amber-400 font-semibold">nodePort</td>
                <td className="py-2">外部使用者（Node IP + Port）</td>
                <td className="py-2">30080</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">port</td>
                <td className="py-2">叢集內部（Service 監聽）</td>
                <td className="py-2">80</td>
              </tr>
              <tr>
                <td className="py-2 text-green-400 font-semibold">targetPort</td>
                <td className="py-2">Pod 容器監聽</td>
                <td className="py-2">80</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# service-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - port: 80           # Service Port
      targetPort: 80     # Pod Port
      nodePort: 30080    # Node Port (30000-32767)`,
    notes: `【① 課程內容】
為什麼需要 NodePort：
- ClusterIP 只有叢集內部 Pod 能連
- 開發測試階段需要從外部瀏覽器、Postman 直接打 K8s 服務
- NodePort 讓外部流量能進來

NodePort 的運作原理：
- K8s 在每個 Node 上開放同一個 port（nodePort）
- 外部只要能連到任意一個 Node 的 IP，打 nodePort 就能進入叢集
- 即使某個 Node 上沒有對應的 Pod，流量也會被轉發到有 Pod 的 Node

三個 Port 的完整路徑：
外部請求 → Node IP : nodePort（30000-32767，每個 Node 都開）→ Service : port → Pod : targetPort（應用程式監聽）

【② 指令講解】
（本張投影片為概念說明，無操作指令，參見下張 Lab）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── 5-15 概念（2/2）：LoadBalancer + 三種比較 ──
  {
    title: '三種 Service 類型比較',
    subtitle: 'ClusterIP vs NodePort vs LoadBalancer',
    section: '5-13：NodePort + 三種比較',
    duration: '7',
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
                <td className="py-2 text-xs">雲端 ALB / ELB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">遞增關係</p>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="bg-cyan-900/40 border border-cyan-500/40 px-3 py-1 rounded text-cyan-300">ClusterIP</span>
            <span className="text-slate-400 font-bold">&sub;</span>
            <span className="bg-green-900/40 border border-green-500/40 px-3 py-1 rounded text-green-300">NodePort</span>
            <span className="text-slate-400 font-bold">&sub;</span>
            <span className="bg-amber-900/40 border border-amber-500/40 px-3 py-1 rounded text-amber-300">LoadBalancer</span>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">怎麼選？</p>
          <div className="text-slate-300 text-xs mt-1 space-y-1">
            <p>叢集內部用 &rarr; ClusterIP（預設就好）</p>
            <p>測試需要外部連 &rarr; NodePort</p>
            <p>生產環境 &rarr; LoadBalancer 或 Ingress（第六堂課）</p>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
三種 Service 類型比較：
- ClusterIP：叢集內部，微服務溝通用，Docker Compose network DNS
- NodePort：Node IP + Port，測試環境，docker run -p
- LoadBalancer：雲端 LB，生產環境，AWS ELB / GCP LB

遞增包含關係：ClusterIP ⊂ NodePort ⊂ LoadBalancer
→ NodePort 建好後，ClusterIP 功能仍然保留（叢集內部依然能用 Service 名稱存取）

LoadBalancer 在本地環境的限制：
- multipass/k3s 沒有雲端 LB controller，EXTERNAL-IP 永遠 (pending)
- 需要 MetalLB 或 minikube tunnel 才能模擬

選擇原則：叢集內部 → ClusterIP；測試外部存取 → NodePort；生產 → LoadBalancer 或 Ingress

【② 指令講解】
（本張投影片為概念說明，無操作指令）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── 5-16 實作（1/2）：NodePort 建立 + 外部驗證 ──
  {
    title: 'Lab：建立 NodePort Service',
    subtitle: 'apply → curl Node IP:30080 → 瀏覽器打開',
    section: '5-13：NodePort + 三種比較',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f service-nodeport.yaml</code></li>
            <li><code className="text-green-400">kubectl get svc</code> -- nginx-nodeport TYPE=NodePort, 80:30080/TCP</li>
            <li>拿 Node IP：<code className="text-green-400">kubectl get nodes -o wide</code></li>
            <li>從外面 curl：<code className="text-green-400">curl http://&lt;Node-IP&gt;:30080</code></li>
            <li>試另一個 Node IP -- 一樣能連</li>
            <li>瀏覽器打開 <code className="text-green-400">http://&lt;Node-IP&gt;:30080</code></li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">對比：兩條路都通</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>叢集內部：<code className="text-cyan-400">curl http://nginx-svc</code> -- 走 ClusterIP</p>
            <p>叢集外部：<code className="text-green-400">curl http://Node-IP:30080</code> -- 走 NodePort</p>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
實作 NodePort Service 的完整流程：apply → get svc → 拿 Node IP → 從外部 curl 驗證。

【② 指令講解】
指令 1：kubectl apply -f service-nodeport.yaml
用途：套用 NodePort Service YAML
打完要看：service/nginx-nodeport created

指令 2：kubectl get svc
用途：確認 NodePort 分配
打完要看：PORT(S) 欄位顯示 80:30080/TCP，意思是 Service port 80 映射到 Node port 30080
異常：TYPE 還是 ClusterIP → YAML 的 type 沒改到

指令 3：kubectl get nodes -o wide（或 multipass list）
用途：取得 Node 的 IP
打完要看：INTERNAL-IP 欄位顯示 Node 的 IP，例如 192.168.64.3

指令 4：curl http://[Node-IP]:30080（在你自己的電腦上執行，不是在叢集裡）
用途：從外部驗證 NodePort 連線
打完要看：nginx 首頁 HTML，Welcome to nginx!
異常：Connection refused → nodePort 設錯或防火牆阻擋；Connection timed out → Node IP 不對

port-forward vs NodePort 的差異：
- port-forward：開發除錯臨時使用，終端機關掉就消失
- NodePort：持續存在直到刪除 Service，適合測試環境長期對外

清理：kubectl delete svc nginx-nodeport
→ 打完要看：service "nginx-nodeport" deleted

【③④ 題目 + 解答】
（無，Lab 在下一張）
[▶ 下一頁]`,
  },

  // ── 5-16 學員實作 ──
  {
    title: '學員實作：NodePort Service',
    subtitle: 'Loop 5 練習題',
    section: '5-13：NodePort + 三種比較',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：NodePort 外部存取</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 NodePort Service 指向 nginx Deployment</li>
            <li>查 Node IP：<code className="text-green-400">kubectl get nodes -o wide</code></li>
            <li>從你的電腦 curl <code className="text-green-400">Node-IP:NodePort</code></li>
            <li>看到 nginx 歡迎頁就成功</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：兩條路都通</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>同時保留 ClusterIP 和 NodePort 兩個 Service</li>
            <li>從測試 Pod 用 <code className="text-green-400">nginx-svc</code> 連（走 ClusterIP）</li>
            <li>從外面用 <code className="text-green-400">Node-IP:30080</code> 連（走 NodePort）</li>
            <li>驗證兩條路都通</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 學員實作 Loop 5：建立 NodePort Service
kubectl apply -f service-nodeport.yaml
kubectl get svc   # 確認 TYPE=NodePort, PORT(S) 80:3xxxx/TCP

# 取得 Node IP
kubectl get nodes -o wide

# 從外部連線（瀏覽器或 curl）
curl http://<Node-IP>:<nodePort>

# 叢集內也能用 ClusterIP
kubectl run test-pod --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-nodeport`,
    notes: `【① 課程內容】
學員練習時間：自行建立 NodePort Service，完成從外部電腦的連線驗證。

【② 指令講解】
必做：
kubectl apply -f service-nodeport.yaml → 建 NodePort Service
kubectl get nodes -o wide → 取得 Node IP
curl http://[Node-IP]:30080 → 從自己電腦連，看到 Welcome to nginx! 成功

挑戰（兩條路都通）：
kubectl run test-busybox --image=busybox:1.36 --rm -it --restart=Never -- sh
wget -qO- http://nginx-svc → 在 Pod 裡走 ClusterIP（用 Service 名稱）
exit 後在外部 curl http://[Node-IP]:30080 → 走 NodePort
驗證兩條路同時運作

【③④ 題目 + 解答】
（無，Lab 在下一張）
[▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-17 回頭操作 ──
  {
    title: 'NodePort 排錯 + Loop 4-5 小結',
    subtitle: '回頭操作 Loop 5',
    section: '5-13：NodePort + 三種比較',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f service-nodeport.yaml</code></li>
            <li><code className="text-green-400">kubectl get svc</code> -- NodePort 80:30080/TCP</li>
            <li><code className="text-green-400">kubectl get nodes -o wide</code> -- 拿 Node IP</li>
            <li><code className="text-green-400">curl http://Node-IP:30080</code> -- nginx 歡迎頁</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">curl 沒回應？檢查兩件事</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>確認用的是 <strong className="text-white">Node IP</strong>（不是 Pod IP 或 ClusterIP）</li>
            <li>防火牆有沒有擋 30080 Port</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Loop 4-5 一句話回顧</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p><span className="text-cyan-400 font-semibold">ClusterIP：</span>叢集內部穩定入口，微服務互連用這個</p>
            <p><span className="text-green-400 font-semibold">NodePort：</span>每個 Node 開 Port，外面的人連得到</p>
            <p><span className="text-amber-400 font-semibold">LoadBalancer：</span>雲端負載均衡器，生產環境用這個</p>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
NodePort 排錯流程與 Loop 4-5 小結。

【② 指令講解】
排錯流程：
1. kubectl get svc → 確認 TYPE=NodePort，確認 PORT(S) 格式是 80:30080/TCP
2. kubectl get nodes -o wide → 確認使用的是 INTERNAL-IP（不是 Pod IP 或 ClusterIP）
3. curl http://[Node-IP]:30080 → 從外部測試

常見問題：
- Connection refused → nodePort 設錯，或防火牆阻擋 → 確認 nodePort 範圍 30000-32767
- Connection timed out → Node IP 用錯，應用 kubectl get nodes -o wide 的 INTERNAL-IP

Loop 4-5 小結：
- ClusterIP：叢集內部穩定入口，微服務互連用這個
- NodePort：每個 Node 開 Port，外面的人連得到，開發測試用這個
- LoadBalancer：雲端負載均衡器，生產環境用這個（或 Ingress）

【③④ 題目 + 解答】
題目 1：一個 NodePort Service 的 YAML 寫了 nodePort: 29999，套用後會發生什麼事？
操作：
  # 在 service-nodeport.yaml 把 nodePort 改成 29999
  kubectl apply -f service-nodeport.yaml
  # 觀察終端機的 error 訊息
解答：套用失敗，K8s 會拒絕。NodePort 的合法範圍是 30000-32767，29999 超出範圍，會出現 validation error。

題目 2：你有 3 個 Node（IP 分別是 192.168.1.1、192.168.1.2、192.168.1.3），其中只有 Node 1 上有 nginx Pod，nodePort 是 30080。請問 curl http://192.168.1.2:30080 能成功嗎？
操作：
  kubectl get nodes -o wide    # 找到所有 Node 的 IP
  curl http://<Node1-IP>:30080
  curl http://<Node2-IP>:30080
解答：能成功。NodePort 會在每個 Node 上開 30080，即使該 Node 沒有 Pod，kube-proxy 也會把流量轉發到有 Pod 的 Node 上。

題目 3：為什麼 LoadBalancer Service 在 multipass 環境 EXTERNAL-IP 會一直是 pending？
操作：
  # 把 service-nodeport.yaml 裡的 type 改成 LoadBalancer
  kubectl apply -f service-loadbalancer.yaml
  kubectl get svc    # 觀察 EXTERNAL-IP 欄位
解答：LoadBalancer 需要雲端或 bare-metal LB controller（如 MetalLB）來分配外部 IP。multipass 是本機 VM 環境，沒有這個 controller，所以 K8s 一直在等外部 IP 分配，永遠顯示 pending。
[▶ 下一頁]`,
  },

  // ── Lab 5：NodePort 外部無法連線，診斷兩個 Bug ──
  {
    title: 'Lab 5：老闆說從外面連不到，找出兩個 Bug',
    subtitle: '情境：type 設錯 + targetPort 不一致',
    section: '5-13：NodePort + 三種比較',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">情境說明</p>
          <p className="text-slate-300 text-sm">
            老闆說要從外面連到你的 nginx 服務，你寫了一個 Service YAML，
            但 <code className="text-red-400">kubectl get svc</code> 看起來怪怪的，外面怎麼都連不到。
            這個 YAML 裡藏了兩個 bug，請找出並修復（目標：curl Node-IP:30888 看到 nginx）。
          </p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">任務步驟</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>apply 下方有 bug 的 YAML</li>
            <li>用 <code className="text-green-400">kubectl get svc</code> 觀察 TYPE 和 PORT(S)</li>
            <li>嘗試從外部 curl <code className="text-green-400">Node-IP:30888</code></li>
            <li>找出 Bug 1（type 設錯）和 Bug 2（targetPort 不一致）</li>
            <li>修復兩個 bug，重新 apply，驗證連線成功</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">驗收標準</p>
          <p className="text-slate-300 text-xs mt-1">
            從自己電腦 curl http://&lt;Node-IP&gt;:30888 回傳 Welcome to nginx!
          </p>
        </div>
      </div>
    ),
    code: `# lab5-buggy.yaml（有兩個 bug，找出並修復）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:1.27
        ports:
        - containerPort: 80     # nginx 預設監聽 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-svc
spec:
  type: ClusterIP         # BUG 1：要讓外面連到，應該是 NodePort
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080      # BUG 2：nginx 實際監聽 80，這裡寫 8080 沒人接
    # 修復時要加上 nodePort: 30888
---
# 診斷指令
kubectl get svc web-svc          # 看 TYPE 和 PORT(S)
kubectl get pods -o wide         # 看 Pod 在哪個 Node
kubectl get nodes -o wide        # 拿 Node IP
curl http://[Node-IP]:30888      # 測試（會失敗）

# 修復提示
# Bug 1：把 type: ClusterIP 改成 type: NodePort，加上 nodePort: 30888
# Bug 2：把 targetPort 改成 80（nginx 預設監聽 80）

# 修復後
kubectl apply -f lab5-buggy.yaml
curl http://[Node-IP]:30888      # 應該成功`,
    notes: `【① 課程內容】
Lab 5 情境：老闆要從外面連 nginx，但 Service YAML 有兩個 bug：
Bug 1：type 設成 ClusterIP 而非 NodePort，也沒寫 nodePort → 根本沒開外部 Port
Bug 2：targetPort 寫 8080 但 nginx 監聽 80 → 流量無法到達容器
修復：type 改 NodePort、加 nodePort: 30888、targetPort 改 80

【② 指令講解】
指令 1：kubectl apply -f lab5-buggy.yaml
用途：套用有 bug 的 YAML

指令 2：kubectl get svc web-svc
用途：診斷 Bug 1
打完要看：TYPE 欄位是 ClusterIP → Bug 1 找到了！應改為 NodePort
注意：如果 type 是 ClusterIP，PORT(S) 不會顯示 nodePort，外部根本連不到

指令 3：curl http://[Node-IP]:30888（修復 Bug 1 後）
打完要看：可能 Connection refused → Bug 2 還在
原因：nginx 預設監聽 port 80，但 targetPort 寫了 8080，流量打到容器的 8080 沒人接

Bug 2 診斷：
kubectl describe svc web-svc → 看 TargetPort 值
kubectl exec [pod] -- ss -tlnp 或 netstat -tlnp → 確認容器實際監聽的 Port

修復方法：
- targetPort: 80（nginx 預設監聽 80，targetPort 要跟容器實際監聯的 port 一致）

指令 4（修復後）：kubectl apply -f lab5-buggy.yaml
指令 5（修復後）：curl http://[Node-IP]:30888
打完要看：Welcome to nginx! → 兩個 bug 都修復！

【③④ 題目 + 解答】
題目：自己動手試：把 YAML 裡的 type 改成 ClusterIP，但保留 nodePort: 30888 欄位，apply 看 K8s 的反應，再試著從外部 curl Node-IP:30888，看有沒有回應。
操作：
  # 把 lab5-buggy.yaml 的 type 改成 ClusterIP，保留 nodePort: 30888
  kubectl apply -f lab5-buggy.yaml
  kubectl get svc web-svc    # 看 TYPE 和 PORT(S) 欄位
  curl http://<Node-IP>:30888    # 從外部嘗試連
驗收標準：
  - kubectl get svc 顯示 TYPE=ClusterIP，PORT(S) 欄位不會顯示 30888
  - curl 失敗（Connection refused 或 Connection timed out）
  - 同時確認從叢集內 curl http://web-svc 仍然成功（ClusterIP 功能還在）
[▶ 下一頁]`,
  },

  // ============================================================
  // 5-14：CoreDNS + Namespace（5-18, 5-19, 5-20）
  // ============================================================

  // ── 5-18 概念（1/2）：DNS 服務發現 ──
  {
    title: 'DNS 服務發現 -- 用名字找服務',
    subtitle: 'CoreDNS 自動註冊 Service DNS',
    section: '5-14：CoreDNS + Namespace',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">DNS 服務發現流程</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-green-400 text-xs font-semibold">App Pod</p>
              <p className="text-slate-500 text-[10px]">curl nginx-svc</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">&rarr;</span>
            <div className="bg-purple-900/40 border border-purple-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-purple-400 text-xs font-semibold">CoreDNS</p>
              <p className="text-slate-500 text-[10px]">nginx-svc &rarr; 10.43.0.150</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">&rarr;</span>
            <div className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-cyan-400 text-xs font-semibold">Service</p>
              <p className="text-slate-500 text-[10px]">10.43.0.150</p>
            </div>
            <span className="text-slate-400 text-lg font-bold">&rarr;</span>
            <div className="flex flex-col gap-1">
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 1</p>
              </div>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-center">
                <p className="text-green-300 text-[10px]">Pod 2</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">DNS 完整格式</p>
          <div className="bg-slate-900/60 p-3 rounded font-mono text-sm text-slate-300">
            <p>&lt;service-name&gt;.&lt;namespace&gt;.svc.cluster.local</p>
            <p className="mt-1 text-cyan-400">nginx-svc.default.svc.cluster.local</p>
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
                <td className="py-2"><code>nginx-svc.dev</code></td>
                <td className="py-2">跨 Namespace</td>
              </tr>
              <tr>
                <td className="py-2"><code>nginx-svc.dev.svc.cluster.local</code></td>
                <td className="py-2">完整 FQDN</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# 現場 demo：在 Pod 內用名字找服務
# 建測試 Pod 進入叢集
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh

# 在 Pod 內執行：
nslookup nginx-svc
# → Server: CoreDNS IP
# → Address: nginx-svc 的 ClusterIP

# 短名稱（同 namespace）
curl http://nginx-svc

# 跨 namespace 要用 FQDN
curl http://nginx-svc.default.svc.cluster.local`,
    notes: `【① 課程內容】
CoreDNS 是什麼：
- K8s 內建的 DNS 服務，以 Pod 形式跑在 kube-system namespace
- 你建立一個 Service，CoreDNS 自動新增一筆 DNS 記錄
- Pod 啟動時，/etc/resolv.conf 自動指向 CoreDNS 的 ClusterIP

FQDN 格式（完整網域名稱）：
[service-name].[namespace].svc.cluster.local
例如：nginx-svc.default.svc.cluster.local

三種寫法與使用時機：
- 短名稱（nginx-svc）：同一個 namespace 內，最常用
- 含 namespace（nginx-svc.default）：跨 namespace
- 完整 FQDN（nginx-svc.default.svc.cluster.local）：明確指定或有衝突時

短名稱為何能用：
- Pod 的 /etc/resolv.conf 有 search 欄位：search default.svc.cluster.local svc.cluster.local cluster.local
- DNS 查詢 nginx-svc 時，系統自動嘗試補上 search domain

【② 指令講解】
指令 1：kubectl get pods -n kube-system | grep dns
用途：確認 CoreDNS 在 kube-system 正常運作
打完要看：兩個 coredns Pod 都是 Running 才正常

指令 2：kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
用途：建測試 Pod（busybox 包含 nslookup、wget 工具）
打完要看：/ # 提示符（busybox 的 shell）
注意：固定用 busybox:1.36，避免 latest 版有 DNS 問題

指令 3（在 Pod 內）：nslookup nginx-svc
用途：驗證 CoreDNS 解析
打完要看：Server 顯示 CoreDNS 的 IP；Address 顯示 Service 的 ClusterIP

【③④ 題目 + 解答】
（無，Lab 在最後一張）
[▶ 下一頁]`,
  },

  // ── 5-18 概念（2/2）：Namespace ──
  {
    title: 'Namespace -- 叢集裡的資料夾',
    subtitle: '隔離環境：dev / prod 同名不衝突',
    section: '5-14：CoreDNS + Namespace',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼要 Namespace？</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>dev 和 prod 都有 <code>nginx-svc</code> -- 同一個 Namespace 名字衝突！</p>
            <p>有了 Namespace：<code className="text-cyan-400">nginx-svc.dev</code> vs <code className="text-green-400">nginx-svc.prod</code> -- 互不影響</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">K8s 預設 Namespace</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Namespace</th>
                <th className="text-left py-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">default</td>
                <td className="py-2">你沒指定就在這裡</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">kube-system</td>
                <td className="py-2">K8s 系統元件（CoreDNS、kube-proxy...）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-slate-400">kube-public</td>
                <td className="py-2">公開資源（很少用）</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-400">kube-node-lease</td>
                <td className="py-2">節點心跳（不用管）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">重要觀念</p>
          <p className="text-slate-300 text-xs mt-1">Namespace 只是邏輯分組，<strong className="text-white">不是網路隔離</strong>。不同 Namespace 的 Pod 預設可以互連（用完整 DNS 名字）。真正的網路隔離要靠 NetworkPolicy（第七堂課）。</p>
        </div>
      </div>
    ),
    code: `# 現場 demo：Namespace 操作
# 看現有 namespace
kubectl get namespaces

# 建新 namespace
kubectl create namespace dev

# 在 dev namespace 建 Pod
kubectl run test-pod --image=nginx -n dev

# 比較：不同 namespace 互不干擾
kubectl get pods           # default namespace
kubectl get pods -n dev    # dev namespace
kubectl get pods -A        # 全部 namespace

# 刪 namespace（裡面的資源全部一起刪！）
# kubectl delete namespace dev`,
    notes: `【① 課程內容】
Namespace 的核心概念：
- Namespace 是 K8s 的邏輯隔離單位（非網路隔離！）
- 同一個 Namespace 的資源共用名稱空間，不同 Namespace 的同名資源不衝突
- 重要：Namespace 不是網路隔離，不同 Namespace 的 Pod 預設可以互相連線（除非設了 NetworkPolicy）
- 適合用於：不同環境（dev/staging/prod）、不同團隊、不同應用

預設四個 Namespace：
- default：沒有指定 namespace 時，資源預設放這裡
- kube-system：K8s 系統元件：CoreDNS、kube-proxy、kube-apiserver 等
- kube-public：公開資訊，很少用
- kube-node-lease：Node 心跳租約，K8s 內部用

跨 Namespace 存取：
- 同 Namespace：直接用短名稱 nginx-svc
- 跨 Namespace：必須用 FQDN 或至少含 namespace 的名稱
  例如：從 staging namespace 連 default namespace 的 nginx-svc → wget http://nginx-svc.default.svc.cluster.local

危險操作警告：
kubectl delete namespace dev → 會刪除該 namespace 內所有資源（Deployment、Pod、Service、ConfigMap 全部）

【② 指令講解】
指令 1：kubectl get namespaces（縮寫 kubectl get ns）
用途：列出所有 Namespace
打完要看：看到 default、kube-system、kube-public、kube-node-lease

指令 2：kubectl create namespace dev
用途：建立 dev namespace
打完要看：namespace/dev created

指令 3：kubectl get pods -A（--all-namespaces）
用途：列出所有 Namespace 的 Pod
打完要看：包含 default、dev、kube-system 的所有 Pod

【③④ 題目 + 解答】
（無，Lab 在最後一張）
[▶ 下一頁]`,
  },

  // ── 5-18 實作：DNS 深度偵探（resolv.conf + 刺客教學）──
  {
    title: 'DNS 深度偵探：撥開黑盒子',
    subtitle: 'resolv.conf + nslookup + CoreDNS 刺客教學',
    section: '5-14：CoreDNS + Namespace',
    duration: '10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Pod 的 DNS 設定</p>
          <p className="text-slate-300 text-xs mb-1">進入測試 Pod 後執行：</p>
          <code className="text-green-400 text-xs">cat /etc/resolv.conf</code>
          <div className="mt-2 space-y-1 text-xs text-slate-400">
            <p><span className="text-amber-400">nameserver 10.96.0.10</span> &rarr; CoreDNS 的 ClusterIP</p>
            <p><span className="text-amber-400">search default.svc.cluster.local ...</span> &rarr; 短名稱自動補全後綴</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">手動查 DNS</p>
          <code className="text-green-400 text-xs">nslookup nginx-svc</code>
          <p className="text-slate-400 text-xs mt-1">Server = CoreDNS IP，Address = nginx-svc 的 ClusterIP</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-2">刺客教學：把 CoreDNS 關掉</p>
          <div className="space-y-1 text-xs text-slate-300">
            <p>1. <code className="text-green-400">kubectl scale deployment coredns -n kube-system --replicas=0</code></p>
            <p>2. <code className="text-red-400">curl http://nginx-svc</code> &rarr; 失敗（Name resolution failed）</p>
            <p>3. <code className="text-green-400">curl http://&lt;ClusterIP&gt;</code> &rarr; 成功！IP 直連不需要 DNS</p>
            <p>4. <code className="text-green-400">kubectl scale deployment coredns -n kube-system --replicas=2</code> &rarr; 恢復</p>
          </div>
          <p className="text-amber-400 text-xs mt-2 font-semibold">結論：DNS 解析（名字&rarr;IP）和網路轉發（IP&rarr;Pod）是兩套獨立機制</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm">口訣</p>
          <p className="text-slate-300 text-xs mt-1">DNS 給你地圖（名字變 IP），kube-proxy 帶你走路（IP 變 Pod）</p>
        </div>
      </div>
    ),
    code: `# ① 觀察 DNS 設定（在測試 Pod 內）
cat /etc/resolv.conf
# nameserver 10.96.0.10   ← CoreDNS
# search default.svc.cluster.local svc.cluster.local cluster.local

# ② 手動 DNS 查詢
nslookup nginx-svc
# Server:    10.96.0.10
# Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local
# Address 2: 10.43.0.150 nginx-svc.default.svc.cluster.local

# ③ CoreDNS 在哪裡
kubectl get pod -n kube-system -l k8s-app=kube-dns

# ④ 刺客教學：關掉 CoreDNS
kubectl scale deployment coredns -n kube-system --replicas=0

# 進測試 Pod 測試
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
curl http://nginx-svc          # 失敗：Name resolution failed
curl http://10.43.0.150        # 成功！ClusterIP 直連不需 DNS

# 恢復 CoreDNS
kubectl scale deployment coredns -n kube-system --replicas=2`,
    notes: `【① 課程內容】
DNS 深度偵探：讓學生理解「Service 名稱怎麼變成 IP」這個黑盒子。

/etc/resolv.conf：
- nameserver 10.96.0.10 → 這是 CoreDNS 的 ClusterIP，每個 Pod 預設都向它查詢
- search default.svc.cluster.local ... → 自動補全清單，所以打 nginx-svc 等同打 nginx-svc.default.svc.cluster.local

nslookup nginx-svc：
- 親眼看到 CoreDNS 把名字翻成 ClusterIP
- 學生常問「我怎麼知道 Service 的 IP？」→ 就是 nslookup 回傳的 Address

CoreDNS — 幕後功臣：
- K8s 內建的 DNS 服務，以 Pod 形式跑在 kube-system namespace
- 持續監聽 API Server，Service 一建立就自動新增 DNS 記錄，刪掉就自動移除
- Pod 啟動時 K8s 自動把 /etc/resolv.conf 的 nameserver 指向 CoreDNS，完全不需要手動設定

刺客教學（現場演示）：
步驟 1：先讓學生確認 curl nginx-svc 會通
步驟 2：kubectl scale deployment coredns -n kube-system --replicas=0（把 CoreDNS 關掉）
步驟 3：讓學生再 curl nginx-svc → 報錯 Temporary failure in name resolution
步驟 4：讓學生 curl <ClusterIP 直接 IP> → 還是通！
步驟 5：kubectl scale deployment coredns -n kube-system --replicas=2（恢復）

結論：DNS 解析（名字→IP）和 網路轉發（IP→Pod）是兩套完全獨立的機制。CoreDNS 負責前者，kube-proxy 負責後者。

口訣：「DNS 給你地圖（名字變 IP），kube-proxy 帶你走路（IP 變 Pod）。地圖丟了，認得路也沒用；路斷了（Selector 錯），地圖再準也到不了。」

【② 指令講解】
指令 1（Pod 內）：cat /etc/resolv.conf
用途：查看 Pod 的 DNS 設定
打完要看：nameserver（CoreDNS IP）和 search domain 清單

指令 2（Pod 內）：nslookup nginx-svc
用途：手動解析 Service 名稱
打完要看：Address 應該是 nginx-svc 的 ClusterIP

指令 3：kubectl get pod -n kube-system -l k8s-app=kube-dns
用途：讓學生看到 CoreDNS 是真實跑著的 Pod

指令 4：kubectl scale deployment coredns -n kube-system --replicas=0
用途：關掉 CoreDNS，驗證 DNS 和網路轉發是獨立的

【③④ 題目 + 解答】
Q：如果把 CoreDNS Pod 刪掉（replicas 設為 0），curl <ClusterIP> 會通嗎？curl <Service名稱> 會通嗎？為什麼？

解答：
- curl <ClusterIP> 會通。流量轉發由 Node 上的 kube-proxy（iptables/IPVS）處理，不需要 DNS。
- curl <Service名稱> 會失敗。沒有 CoreDNS 把名稱翻成 IP，程式報 Name resolution failed。
教學意義：讓學生區分「域名解析」和「網路轉發」是兩套獨立的機制。
[▶ 下一頁]`,
  },

  // ── 5-19 實作（1/2）：DNS 驗證 + Namespace 建立 ──
  {
    title: 'Lab：DNS 驗證 + Namespace 實作',
    subtitle: 'nslookup + 建 dev Namespace + 跨 Namespace 連線',
    section: '5-14：CoreDNS + Namespace',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Part 1：DNS 驗證</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh</code></li>
            <li><code className="text-green-400">nslookup nginx-svc</code> -- Server = CoreDNS, Address = ClusterIP</li>
            <li><code className="text-green-400">wget -qO- http://nginx-svc</code> -- nginx 歡迎頁</li>
            <li><code className="text-green-400">wget -qO- http://nginx-svc.default.svc.cluster.local</code> -- 也行</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Part 2：Namespace + 跨 Namespace</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl create namespace dev</code></li>
            <li><code className="text-green-400">kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev</code></li>
            <li><code className="text-green-400">kubectl expose deployment nginx-deploy --port=80 -n dev</code></li>
            <li>跨 Namespace：<code className="text-green-400">wget -qO- http://nginx-deploy.dev.svc.cluster.local</code></li>
            <li><code className="text-green-400">kubectl get all -n dev</code></li>
            <li><code className="text-green-400">kubectl get pods -A</code> -- 所有 Namespace</li>
          </ol>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
實作 DNS 驗證 + Namespace 建立 + 跨 Namespace 連線的完整流程。

【② 指令講解】
Part 1 - DNS 驗證：

指令 1：kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
用途：建測試 Pod 進行 DNS 驗證

指令 2（在 Pod 內）：nslookup nginx-svc
用途：驗證 CoreDNS 解析
打完要看：Server 顯示 CoreDNS IP；Name 顯示完整 FQDN；Address 顯示 ClusterIP

指令 3（在 Pod 內）：wget -qO- http://nginx-svc
用途：用短名稱連線
打完要看：nginx 首頁 HTML

指令 4（在 Pod 內）：wget -qO- http://nginx-svc.default.svc.cluster.local
用途：用完整 FQDN 連線
打完要看：和短名稱相同的 nginx 首頁 HTML（驗證兩種寫法等效）

Part 2 - Namespace 實作：

指令 5：kubectl create namespace dev
用途：建立 dev namespace
打完要看：namespace/dev created

指令 6：kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev
用途：在 dev namespace 建 Deployment
參數說明：-n dev 指定 namespace，不加就會建在 default（新手常犯錯）

指令 7：kubectl expose deployment nginx-deploy --port=80 -n dev
用途：在 dev namespace 建 ClusterIP Service（快速建法，不用寫 YAML）

指令 8：kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-deploy.dev.svc.cluster.local
用途：從 default namespace 連到 dev namespace 的 Service（跨 Namespace 必須用 FQDN）
打完要看：nginx 首頁 HTML → 跨 namespace 連線成功

指令 9：kubectl get all -n dev
用途：查看指定 namespace 的所有資源
打完要看：Deployment、ReplicaSet、Pod、Service 全部列出

【③④ 題目 + 解答】
（無，Lab 在下一張）
[▶ 下一頁]`,
  },

  // ── 5-19 學員實作 ──
  {
    title: '學員實作：DNS + Namespace',
    subtitle: 'Loop 6 練習題',
    section: '5-14：CoreDNS + Namespace',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：跨 Namespace 連線</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 dev Namespace</li>
            <li>在 dev 部署 httpd Deployment + Service</li>
            <li>從 default 的測試 Pod curl <code className="text-green-400">httpd-svc.dev.svc.cluster.local</code></li>
            <li>你應該看到 <code className="text-cyan-400">It works!</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：兩個 Namespace 不同版本</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>建 prod Namespace</li>
            <li>dev 部署 nginx 1.26，prod 部署 nginx 1.27</li>
            <li>從測試 Pod 分別 curl 兩個 Namespace 的 Service</li>
            <li>看 Server header 版本號是不是不一樣</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 學員實作 5-14：CoreDNS + Namespace
kubectl create namespace dev
kubectl create deployment httpd --image=httpd -n dev
kubectl expose deployment httpd --port=80 --name=httpd-svc -n dev

# 從 default namespace 跨 ns 連線
kubectl run test-curl --image=curlimages/curl \
  --rm -it --restart=Never -- sh
# 在 Pod 內（短名稱失敗，FQDN 成功）：
curl http://httpd-svc             # 失敗
curl http://httpd-svc.dev.svc.cluster.local   # 成功`,
    notes: `【① 課程內容】
學員練習時間：自行建立 Namespace、部署服務，完成跨 Namespace 的連線驗證。

【② 指令講解】
必做：
kubectl create namespace dev
kubectl create deployment httpd --image=httpd -n dev
kubectl expose deployment httpd --port=80 --name=httpd-svc -n dev
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
（在 Pod 內）curl http://httpd-svc.dev.svc.cluster.local → 看到 It works! 成功

挑戰（兩個版本同時跑）：
kubectl create namespace prod
kubectl create deployment nginx --image=nginx:1.26 -n dev
kubectl expose deployment nginx --port=80 -n dev
kubectl create deployment nginx --image=nginx:1.27 -n prod
kubectl expose deployment nginx --port=80 -n prod

驗證：
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
（在 Pod 內）curl -I http://nginx.dev.svc.cluster.local → 看 Server header 版本號
（在 Pod 內）curl -I http://nginx.prod.svc.cluster.local → 版本號應該不同

【③④ 題目 + 解答】
（無，Lab 在下一張）
[▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-20 回頭操作 ──
  {
    title: 'DNS + Namespace 常見坑',
    subtitle: '回頭操作 Loop 6',
    section: '5-14：CoreDNS + Namespace',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>busybox <code className="text-green-400">nslookup nginx-svc</code> -- CoreDNS 回傳 ClusterIP</li>
            <li><code className="text-green-400">kubectl create namespace dev</code></li>
            <li><code className="text-green-400">kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev</code></li>
            <li><code className="text-green-400">kubectl expose deployment nginx-deploy --port=80 -n dev</code></li>
            <li>跨 Namespace：<code className="text-green-400">wget -qO- http://nginx-deploy.dev.svc.cluster.local</code></li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">兩個常見坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-white">忘記 -n</strong> -- 資源建到 default 去了。排錯：<code className="text-green-400">kubectl get pods -A</code></li>
            <li><strong className="text-white">跨 Namespace DNS 格式錯</strong> -- 記住：<code>Service名字.Namespace名字.svc.cluster.local</code></li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">清理</p>
          <p className="text-slate-300 text-xs mt-1"><code className="text-green-400">kubectl delete namespace dev</code> -- 刪 Namespace 會把裡面所有資源一起刪掉</p>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
DNS + Namespace 常見坑總整理與清理流程。

【② 指令講解】
指令 1：kubectl get pods -A（當資源建到錯的 namespace 時用）
用途：找出資源建在哪個 namespace
打完要看：NAMESPACE 欄位，找到你建的 Pod/Service 實際在哪裡

指令 2：kubectl config set-context --current --namespace=dev
用途：切換預設 namespace，之後 kubectl 指令不用每次加 -n dev
打完要看：Context "k3s" modified.

指令 3：kubectl config view --minify | grep namespace
用途：確認目前預設 namespace
打完要看：namespace: dev

切回 default：
kubectl config set-context --current --namespace=default

指令 4：kubectl delete namespace dev
用途：刪除 namespace（連同內部所有資源一起刪）
打完要看：namespace "dev" deleted
異常：卡著不動 → namespace 裡有資源需要清除，等 1-2 分鐘

常見坑：
- 忘記 -n → 資源建到 default，用 kubectl get pods -A 定位
- 跨 Namespace DNS 格式錯 → 記住：Service名字.Namespace名字.svc.cluster.local

【③④ 題目 + 解答】
題目 1：進入 busybox Pod，分別用短名稱和 FQDN 執行 wget，確認兩種都能得到 nginx 首頁。
操作：
  kubectl run test-dns --image=busybox:1.36 --rm -it --restart=Never -- sh
  # 在 Pod 內：
  wget -qO- http://nginx-svc                               # 短名稱（同 namespace）
  wget -qO- http://nginx-svc.default.svc.cluster.local    # 完整 FQDN
  exit
驗收標準：兩個指令都回傳 nginx 首頁 HTML

題目 2：建一個 dev namespace，在裡面建 nginx Deployment + Service，然後從 default namespace 的 busybox 用短名稱連它（會失敗），再用 FQDN 連（成功）——親眼看到兩種不同結果。
操作：
  kubectl create namespace dev
  kubectl create deployment nginx --image=nginx:1.27 -n dev
  kubectl expose deployment nginx --port=80 -n dev
  kubectl run test-cross --image=busybox:1.36 --rm -it --restart=Never -- sh
  # 在 Pod 內（Pod 在 default namespace）：
  wget -qO- http://nginx.dev               # 先試短名稱 → 失敗
  wget -qO- http://nginx.dev.svc.cluster.local    # 再試 FQDN → 成功
驗收標準：短名稱失敗（could not resolve host），FQDN 成功（回傳 nginx 首頁）

題目 3：在 staging namespace 建一個 Service，然後真的執行 kubectl delete namespace staging，觀察裡面的 Deployment 和 Pod 也一起消失了。
操作：
  kubectl create namespace staging
  kubectl create deployment web --image=nginx:1.27 --replicas=2 -n staging
  kubectl get all -n staging        # 記下有哪些資源
  kubectl delete namespace staging
  kubectl get all -n staging        # 應該看不到任何東西（或 namespace not found）
驗收標準：delete namespace 之後，kubectl get all -n staging 顯示 'No resources found' 或報錯 namespace 不存在

題目 4：如果把 CoreDNS Pod 刪掉（replicas 設為 0），curl <ClusterIP> 會通嗎？curl <Service名稱> 會通嗎？為什麼？
操作：
  kubectl get svc nginx-svc    # 先記下 ClusterIP
  kubectl scale deployment coredns -n kube-system --replicas=0
  kubectl run test --image=curlimages/curl --rm -it --restart=Never -- sh
  curl http://nginx-svc         # 預期失敗
  curl http://<ClusterIP>       # 預期成功
  exit
  kubectl scale deployment coredns -n kube-system --replicas=2    # 恢復！
解答：
- curl <ClusterIP> 會通。流量轉發由 kube-proxy（iptables/IPVS）處理，不需要 DNS。
- curl <Service名稱> 會失敗。沒有 CoreDNS 把名稱翻成 IP，報 Name resolution failed。
- DNS 解析和網路轉發是兩套獨立機制。
[▶ 下一頁]`,
  },

  // ── Lab 6：跨 Namespace 連線失敗，從短名稱改成 FQDN ──
  {
    title: 'Lab 6：跨團隊連線失敗，改用 FQDN 完成連線',
    subtitle: '情境：短名稱只在同 Namespace 有效，跨 Namespace 要用 FQDN',
    section: '5-14：CoreDNS + Namespace',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">情境說明</p>
          <p className="text-slate-300 text-sm">
            前端團隊在 <code className="text-cyan-400">frontend</code> namespace，
            後端 API 在 <code className="text-green-400">backend</code> namespace。
            前端 Pod 用短名稱 <code className="text-red-400">curl http://api-svc</code> 連後端，
            但一直失敗（Could not resolve host）。
            請找出原因並改用正確的 FQDN 完成連線。
          </p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">任務步驟</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>apply 下方 YAML，建立兩個 namespace 和服務</li>
            <li>進入 frontend Pod，用短名稱測試（會失敗）</li>
            <li>找出原因：短名稱無法跨 namespace</li>
            <li>改用完整 FQDN：<code className="text-green-400">api-svc.backend.svc.cluster.local</code></li>
            <li>驗證連線成功</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">驗收標準</p>
          <p className="text-slate-300 text-xs mt-1">
            從 frontend namespace 的 Pod 執行 curl http://api-svc.backend.svc.cluster.local 成功回傳 Welcome to nginx!
          </p>
        </div>
      </div>
    ),
    code: `# lab6-namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: frontend
---
apiVersion: v1
kind: Namespace
metadata:
  name: backend
---
# 後端 API（在 backend namespace）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: nginx:1.27
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: api-svc
  namespace: backend
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 80
---
# 前端測試 Pod（在 frontend namespace）
apiVersion: v1
kind: Pod
metadata:
  name: frontend-pod
  namespace: frontend
spec:
  containers:
  - name: frontend
    image: curlimages/curl
    command: ["sleep", "3600"]
---
# 操作指令
kubectl apply -f lab6-namespaces.yaml

# 進入前端 Pod 測試
kubectl exec -n frontend frontend-pod -- curl http://api-svc
# 失敗：curl: (6) Could not resolve host: api-svc

# 改用 FQDN
kubectl exec -n frontend frontend-pod -- curl http://api-svc.backend.svc.cluster.local
# 成功：Welcome to nginx!

# 中間格式也可以
kubectl exec -n frontend frontend-pod -- curl http://api-svc.backend

# 清理
kubectl delete namespace frontend backend`,
    notes: `【① 課程內容】
Lab 6 情境：跨 namespace 連線失敗，原因是使用短名稱（DNS 只在同 namespace 有效）。學生需要理解短名稱的限制，並改用 FQDN 完成跨 namespace 連線。

【② 指令講解】
指令 1：kubectl apply -f lab6-namespaces.yaml
用途：建立兩個 namespace、後端服務和前端測試 Pod

指令 2：kubectl exec -n frontend frontend-pod -- curl http://api-svc
用途：測試用短名稱從 frontend namespace 連 backend 的 Service
打完要看：失敗，Could not resolve host: api-svc（預期的失敗）
原因：frontend Pod 的 search domain 是 frontend.svc.cluster.local，找不到 api-svc.backend

指令 3：kubectl exec -n frontend frontend-pod -- curl http://api-svc.backend.svc.cluster.local
用途：用完整 FQDN 跨 namespace 連線
打完要看：Welcome to nginx! → 跨 namespace 連線成功！

指令 4（中間格式驗證）：kubectl exec -n frontend frontend-pod -- curl http://api-svc.backend
打完要看：Welcome to nginx!（K8s 自動補上 .svc.cluster.local）

DNS 三種格式：
- api-svc → 僅限同 namespace
- api-svc.backend → 跨 namespace 中間格式
- api-svc.backend.svc.cluster.local → 完整 FQDN（最明確，推薦用於跨 namespace）

清理：kubectl delete namespace frontend backend（連同內部所有資源一起刪）

【③④ 題目 + 解答】
題目：進入 frontend-pod，先用短名稱 curl http://api-svc（預期失敗），再進入 /etc/resolv.conf 看 search domain，理解為什麼會失敗，最後用 FQDN 成功連線。
操作：
  kubectl exec -n frontend frontend-pod -- curl http://api-svc
  # 預期失敗，記錄 error 訊息
  kubectl exec -n frontend frontend-pod -- cat /etc/resolv.conf
  # 觀察 search domain 是 frontend.svc.cluster.local
  kubectl exec -n frontend frontend-pod -- curl http://api-svc.backend.svc.cluster.local
  # 預期成功
驗收標準：
  - 短名稱 curl 失敗並顯示 'Could not resolve host: api-svc'
  - /etc/resolv.conf 的 search domain 只包含 frontend 相關的 domain
  - FQDN curl 成功回傳 'Welcome to nginx!'
[▶ 下一頁]`,
  },

  // ============================================================
  // 5-15：DaemonSet + CronJob（5-21, 5-22, 5-23）
  // ============================================================

  // ── 5-21 概念（1/2）：DaemonSet ──
  {
    title: 'DaemonSet -- 每個 Node 都跑一份',
    subtitle: '日誌收集、監控 agent、kube-proxy',
    section: '5-15：DaemonSet + CronJob',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">DaemonSet vs Deployment</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-900/30 border border-cyan-500/30 p-3 rounded-lg text-center">
              <p className="text-cyan-400 text-xs font-semibold mb-2">Deployment</p>
              <p className="text-slate-300 text-xs">你指定 replicas = 3</p>
              <p className="text-slate-400 text-[10px]">Scheduler 決定放哪些 Node</p>
            </div>
            <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg text-center">
              <p className="text-green-400 text-xs font-semibold mb-2">DaemonSet</p>
              <p className="text-slate-300 text-xs">每個 Node 自動一個</p>
              <p className="text-slate-400 text-[10px]">沒有 replicas 欄位</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見用途</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>日誌收集：Fluentd / Filebeat -- 每台 Node 收集容器日誌</li>
            <li>監控 agent：Node Exporter -- 每台 Node 回報指標</li>
            <li>kube-proxy 本身就是 DaemonSet！</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">自動管理</p>
          <p className="text-slate-300 text-xs mt-1">新 Node 加入 &rarr; 自動建 Pod。Node 移除 &rarr; Pod 跟著消失。</p>
        </div>
      </div>
    ),
    code: `# daemonset.yaml
apiVersion: apps/v1
kind: DaemonSet
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
        - name: fluentd
          image: fluent/fluentd:v1.16`,
    notes: `【① 課程內容】
DaemonSet 確保每個 Node 上跑且只跑一個 Pod。Node 加入叢集 → 自動建 Pod；Node 移除 → Pod 自動清除。不需要手動管理副本數，Pod 數量永遠等於 Node 數量。

常見用途：
- 日誌收集 agent：Fluentd、Filebeat
- 監控 agent：Prometheus Node Exporter
- 網路插件：kube-proxy（K8s 內建就是 DaemonSet！）

和 Deployment 的核心差別：
- Deployment：你指定 replicas，Scheduler 決定放哪個 Node
- DaemonSet：每個 Node 各一個，YAML 沒有 replicas 欄位

YAML 結構重點：kind: DaemonSet，apiVersion: apps/v1，spec 沒有 replicas。selector.matchLabels 和 template.metadata.labels 必須一致（和 Deployment 相同規則）。

本地環境限制：minikube 只有 1 個 Node，DaemonSet 只看到 1 個 Pod。k3s 多 Node 才能看出「每個 Node 各一個」的效果。學習重點是理解語意，不是一定要看到多個 Pod。

【② 指令講解】
kubectl apply -f daemonset.yaml
→ 用途：套用 DaemonSet YAML
→ 打完要看：daemonset.apps/log-collector created
→ 異常：image 名稱錯誤 → error: DaemonSets is invalid

kubectl get daemonsets（縮寫：kubectl get ds）
→ 用途：列出所有 DaemonSet
→ 打完要看：DESIRED（應有幾個）= Node 數量，CURRENT 和 READY 也要一致
→ 異常：DESIRED != READY → 有 Pod 還在啟動或出問題

kubectl describe daemonset log-collector
→ 用途：查看 DaemonSet 詳細狀態
→ 打完要看：Desired Number of Nodes Scheduled = Current Number of Nodes Scheduled
→ 若有 Pod 失敗，Events 區塊會顯示錯誤

kubectl get pods -o wide
→ 用途：查看 Pod 分布在哪些 Node
→ 打完要看：NODE 欄位 — 每個 Node 名稱應只出現一次
→ 異常：同一個 Node 有兩個 DaemonSet Pod → 代表有問題

【③④ 題目 + 解答】
Q1：部署 DaemonSet，用 kubectl get pods -o wide 確認每個 Node 都有一個 Pod，Pod 數量等於 kubectl get nodes 的數量。
操作：
  kubectl apply -f daemonset.yaml
  kubectl get nodes                           # 記下 Node 數量
  kubectl get pods -o wide -l app=log-collector   # 對比 NODE 欄位
驗收標準：pods -o wide 中 NODE 欄位每個 Node 名稱各出現一次，Pod 總數 = kubectl get nodes 的數量

Q2：試著用 kubectl scale daemonset log-collector --replicas=0，看 K8s 的反應（error 訊息）。
操作：
  kubectl scale daemonset log-collector --replicas=0
  # 觀察終端機的回應
  kubectl get pods -l app=log-collector      # 確認 Pod 數量有沒有改變
驗收標準：看到 'cannot scale a DaemonSet' 或類似 error，Pod 數量不變（DaemonSet 不支援手動 scale）

Q3：試著把 daemonset.yaml 裡加上 replicas: 0 後重新 apply，觀察 K8s 的處理結果。
操作：
  # 在 daemonset.yaml 的 spec 下加一行 replicas: 0
  kubectl apply -f daemonset.yaml
  kubectl get daemonsets    # 觀察 DESIRED 欄位有沒有變
  kubectl get pods -l app=log-collector
驗收標準：DESIRED 仍等於 Node 數量（K8s 忽略 DaemonSet 裡的 replicas 欄位）
[▶ 下一頁]`,
  },

  // ── 5-21 概念（2/2）：CronJob + 三者比較 ──
  {
    title: 'CronJob -- 定時跑任務',
    subtitle: 'schedule + jobTemplate + Completed 狀態',
    section: '5-15：DaemonSet + CronJob',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">CronJob 運作流程</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">排程時間到</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">建 Job</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">建 Pod</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded">跑完 Completed</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三者比較</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">比較</th>
                <th className="text-left py-2">Deployment</th>
                <th className="text-left py-2">DaemonSet</th>
                <th className="text-left py-2">CronJob</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400">副本數</td>
                <td className="py-2">你指定 replicas</td>
                <td className="py-2">每個 Node 一個</td>
                <td className="py-2">每次觸發一個</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400">Pod 狀態</td>
                <td className="py-2">長期 Running</td>
                <td className="py-2">長期 Running</td>
                <td className="py-2">跑完 Completed</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400">用途</td>
                <td className="py-2">無狀態應用</td>
                <td className="py-2">節點級服務</td>
                <td className="py-2">定時任務</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/1 * * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      ttlSecondsAfterFinished: 60
      template:
        spec:
          containers:
            - name: hello
              image: busybox:1.36
              command: ["sh", "-c", "date; echo Hello from CronJob"]
          restartPolicy: OnFailure`,
    notes: `【① 課程內容】
CronJob = 定時排程任務，跑完就結束（不像 Deployment 會一直跑）。等同於 Linux 的 crontab，只是在 K8s 上執行。

三層結構（重要！）：
  CronJob（定時排程規則）→ Job（每次執行建立一個 Job）→ Pod（執行實際工作）

Cron 時間格式（分 時 日 月 星期）：
- "*/1 * * * *" → 每分鐘
- "*/5 * * * *" → 每 5 分鐘
- "0 2 * * *" → 每天凌晨 2 點
- "0 9 * * 1-5" → 週一到週五早上 9 點
記憶技巧：「分時日月週」，全 * 代表「每個」

concurrencyPolicy：Allow（預設，可能資源累積）/ Forbid（跳過）/ Replace（殺舊換新）
歷史保留：successfulJobsHistoryLimit（預設3）/ failedJobsHistoryLimit（預設1）
YAML 重點：restartPolicy 必須是 OnFailure；ttlSecondsAfterFinished 可讓 Job 跑完後自動刪 Pod

【② 指令講解】
kubectl apply -f cronjob.yaml
→ 用途：套用 CronJob YAML
→ 打完要看：cronjob.batch/hello-cron created

kubectl get cronjobs（縮寫：kubectl get cj）
→ 用途：列出所有 CronJob
→ 打完要看：SCHEDULE、SUSPEND（False 才會執行）、LAST SCHEDULE（(none) 代表還沒執行過）
→ 異常：SUSPEND 是 True → CronJob 被暫停，不會執行

kubectl get jobs（等 1 分鐘後）
→ 用途：查看 CronJob 觸發產生的 Job
→ 打完要看：COMPLETIONS 1/1、DURATION；每次觸發都會建一個新 Job
→ 異常：COMPLETIONS 顯示 0/1 且持續不變 → kubectl describe job 看 Events

kubectl get pods
→ 用途：查看 CronJob 產生的 Pod
→ 打完要看：STATUS: Completed（不是 Running！這是正常的）
→ 異常：Error 或 CrashLoopBackOff → 用 kubectl logs 看錯誤原因

kubectl logs [job-pod-name]
→ 用途：查看 CronJob Pod 的輸出
→ 打完要看：指令執行結果（例如日期 + Hello from CronJob）

kubectl delete cronjob hello-cron
→ 用途：刪除 CronJob
→ 注意：刪除後正在執行中的 Job 和 Pod 不會自動刪，需手動清理

【③④ 題目 + 解答】
Q1：部署 CronJob（schedule: '*/1 * * * *'），等 1 分鐘後用 kubectl get jobs 確認有 Job 建立，再用 kubectl logs 看輸出。
操作：
  kubectl apply -f cronjob.yaml    # schedule: '*/1 * * * *'
  kubectl get cronjobs             # 確認 SCHEDULE 欄位正確
  # 等 1 分鐘...
  kubectl get jobs                 # 看到 hello-cron-xxxxx，COMPLETIONS 1/1
  kubectl get pods                 # 找到 STATUS: Completed 的 Pod
  kubectl logs <pod-name>          # 看輸出內容
驗收標準：kubectl get jobs 有記錄，kubectl logs 看到 'Hello from CronJob!' + 時間戳

Q2：修改 CronJob 的 schedule 為 '*/2 * * * *'，重新 apply 後等 2 分鐘，用 kubectl get jobs 確認 Job 觸發間隔真的變長了。
操作：
  # 把 cronjob.yaml 的 schedule 改成 '*/2 * * * *'
  kubectl apply -f cronjob.yaml
  kubectl get jobs    # 觀察 LAST SCHEDULE 和 Job 出現的時間間隔
  # 等 2 分鐘後再執行一次
  kubectl get jobs
驗收標準：兩次 kubectl get jobs 之間新增的 Job 間隔約 2 分鐘

Q3：在 CronJob 的 jobTemplate.spec 加入 ttlSecondsAfterFinished: 30，apply 後等 Job 跑完，觀察 30 秒後 Pod 自動消失。
操作：
  # 在 cronjob.yaml 的 jobTemplate.spec 下加 ttlSecondsAfterFinished: 30
  kubectl apply -f cronjob.yaml
  kubectl get pods    # 等 Job 跑完後看到 Completed
  # 等 30 秒...
  kubectl get pods    # Pod 應該自動消失了
驗收標準：Completed 狀態的 Pod 在 30 秒後自動被清除
[▶ 下一頁]`,
  },

  // ── 5-22 實作 ──
  {
    title: 'Lab：DaemonSet + CronJob 實作',
    subtitle: 'apply → 觀察 Pod 分佈 + Job 狀態',
    section: '5-15：DaemonSet + CronJob',
    duration: '8',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">DaemonSet 操作 + 輸出</p>
          <ol className="text-slate-300 text-xs space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f daemonset.yaml</code></li>
            <li><code className="text-green-400">kubectl get daemonsets</code></li>
            <li><code className="text-green-400">kubectl get pods -o wide -l app=log-collector</code></li>
          </ol>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono mt-2">
            <p className="text-slate-500 mb-0.5">$ kubectl get daemonsets</p>
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DESIRED &nbsp;CURRENT &nbsp;READY</p>
            <p className="text-green-300">log-collector &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2</p>
            <p className="text-slate-500 mt-1 mb-0.5">$ kubectl get pods -o wide -l app=log-collector</p>
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;NODE</p>
            <p className="text-slate-300">log-collector-abc12 &nbsp;&nbsp;&nbsp;Running &nbsp;k3s-master</p>
            <p className="text-slate-300">log-collector-def34 &nbsp;&nbsp;&nbsp;Running &nbsp;k3s-worker</p>
          </div>
          <p className="text-slate-400 text-xs mt-1">DESIRED = 2 = Node 數量，每個 Node 各一個 &mdash; 這就是 DaemonSet</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">CronJob 操作 + 輸出</p>
          <ol className="text-slate-300 text-xs space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f cronjob.yaml</code></li>
            <li><code className="text-green-400">kubectl get cronjobs</code> &mdash; 看 SCHEDULE</li>
            <li>等一分鐘 &rarr; <code className="text-green-400">kubectl get jobs</code> + <code className="text-green-400">kubectl get pods</code></li>
          </ol>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono mt-2">
            <p className="text-slate-500 mb-0.5">$ kubectl get cronjobs</p>
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SCHEDULE &nbsp;&nbsp;&nbsp;&nbsp;SUSPEND &nbsp;LAST SCHEDULE</p>
            <p className="text-green-300">hello-cron &nbsp;*/1 * * * * &nbsp;False &nbsp;&nbsp;&nbsp;30s</p>
            <p className="text-slate-500 mt-1 mb-0.5">$ kubectl get jobs</p>
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COMPLETIONS &nbsp;DURATION</p>
            <p className="text-green-300">hello-cron-xxxxx &nbsp;1/1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3s</p>
            <p className="text-slate-500 mt-1 mb-0.5">$ kubectl get pods</p>
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS</p>
            <p className="text-cyan-300">hello-cron-xxxxx-abc &nbsp;&nbsp;&nbsp;Completed &nbsp;<span className="text-yellow-300">&larr; 正常！不是 Running</span></p>
          </div>
          <p className="text-slate-400 text-xs mt-1">Completed = 任務跑完正常結束，不是錯誤</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-2 rounded text-xs text-slate-300">
          <span className="text-amber-400 font-bold">CronJob 三層結構：</span>
          CronJob &rarr; Job &rarr; Pod &mdash; 每次觸發建一個新 Job，Job 建一個 Pod，跑完就 Completed
        </div>
      </div>
    ),
    code: `# Lab 操作：DaemonSet + CronJob
kubectl apply -f daemonset.yaml
kubectl get daemonsets   # DESIRED = Node 數量
kubectl get pods -o wide -l app=log-collector   # 每個 Node 一個

kubectl apply -f cronjob.yaml
kubectl get cronjobs
# 等 1 分鐘...
kubectl get jobs
kubectl get pods   # STATUS: Completed（正常！）
kubectl logs <job-pod-name>`,
    notes: `好，我們先來建 DaemonSet。

建一個檔案叫 daemonset.yaml。apiVersion 是 apps/v1，kind 是 DaemonSet，metadata 的 name 寫 log-collector。spec 裡面注意，沒有 replicas。selector 的 matchLabels 寫 app: log-collector，template 的 labels 也要寫 app: log-collector，跟 Deployment 一樣的規則，selector 和 template labels 要對上。containers 用 busybox:1.36，command 是一個 while true 的循環，每 30 秒印一行日誌，內容是時間戳加上 collecting logs from 加上 hostname。

寫好了，apply 它。

kubectl apply -f daemonset.yaml

看到 daemonset.apps/log-collector created。

來看看 DaemonSet 的狀態。

kubectl get daemonsets

你會看到 log-collector，DESIRED 欄位顯示一個數字，那就是你的 Node 數量。如果你用 k3s 有兩個 Node，DESIRED 就是 2。CURRENT 和 READY 也應該是同一個數字，表示所有 Pod 都建好了。

接下來重點來了。看看 Pod 分布在哪些 Node 上。

kubectl get pods -o wide -l app=log-collector

這裡我用了 -l 來篩選只看 DaemonSet 的 Pod。你會看到每個 Pod 各自跑在不同的 Node 上。如果你有兩個 Node，就看到兩個 Pod，分別在兩台機器。如果有三個 Node，就三個 Pod，每台一個。

這就是 DaemonSet 的效果：不管你有幾個 Node，每個 Node 剛好一個。你不需要指定 replicas，DaemonSet 自動處理。

看看日誌。挑一個 Pod，kubectl logs 加上 Pod 名字。你會看到每 30 秒一行日誌，印出時間和 hostname。

好，DaemonSet 搞定了。接下來建 CronJob。

建一個檔案叫 cronjob.yaml。apiVersion 是 batch/v1，注意跟 Deployment 和 DaemonSet 不一樣，CronJob 屬於 batch API group。kind 是 CronJob。metadata 的 name 寫 hello-cron。

spec 裡面最重要的是 schedule 欄位，我們寫 "*/1 * * * *"，每分鐘執行一次。然後 jobTemplate 裡面嵌套了 Job 的範本。Job 的 spec 裡面又嵌套了 Pod 的 template。containers 用 busybox:1.36，command 是 echo 'Hello from CronJob!' 加上 date。restartPolicy 寫 Never。

你可能會覺得這個 YAML 嵌套很深：CronJob 裡面有 jobTemplate，jobTemplate 裡面有 template，template 裡面才是 containers。對，確實比 Deployment 深一層，因為 CronJob 管 Job，Job 管 Pod，多了一層。

好，apply 它。

kubectl apply -f cronjob.yaml

看到 cronjob.batch/hello-cron created。

現在 CronJob 建好了，但它不會立刻執行，要等到下一個整分鐘的時候。kubectl get cronjobs 看一下，SCHEDULE 欄位顯示 */1 * * * *，LAST SCHEDULE 可能還是空的。

等一分鐘。

好，一分鐘到了。kubectl get jobs。

你會看到一個 Job 出現了，名字大概是 hello-cron-加上一串數字。COMPLETIONS 欄位顯示 1/1，表示 Job 完成了。

kubectl get pods。

你會看到一個 Pod 的狀態是 Completed。注意不是 Running，是 Completed。因為它的任務是跑一次 echo 就結束了，不是長期運行的。

看看它印了什麼。kubectl logs 加上 Pod 名字。

你會看到 Hello from CronJob! 加上時間戳。

再等一分鐘，kubectl get jobs。又多了一個 Job。kubectl get pods，又多了一個 Completed 的 Pod。CronJob 每分鐘都會建一個新的 Job 和 Pod。

K8s 預設會保留最近三個成功的 Job 和一個失敗的 Job，更早的會自動清理掉。你可以在 CronJob 的 spec 裡面用 successfulJobsHistoryLimit 和 failedJobsHistoryLimit 來調整保留數量。 [▶ 下一頁]`,
  },

  // ── 5-22 學員實作 ──
  {
    title: '學員實作：DaemonSet + CronJob',
    subtitle: 'Loop 7 練習題',
    section: '5-15：DaemonSet + CronJob',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做（三件事）</p>
          <ol className="text-slate-300 text-sm space-y-1.5 list-decimal list-inside">
            <li>
              <strong className="text-white">DaemonSet</strong>：<code className="text-green-400">kubectl apply -f daemonset.yaml</code>
              <br/><span className="text-slate-400 text-xs ml-5">&rarr; get daemonsets 確認 DESIRED = Node 數 &rarr; get pods -o wide 確認每個 Node 各一個</span>
            </li>
            <li>
              <strong className="text-white">CronJob</strong>：<code className="text-green-400">kubectl apply -f cronjob.yaml</code>
              <br/><span className="text-slate-400 text-xs ml-5">&rarr; 等一分鐘 &rarr; get jobs 看到 COMPLETIONS 1/1 &rarr; get pods 看到 Completed</span>
            </li>
            <li>
              <strong className="text-white">看日誌</strong>：<code className="text-green-400">kubectl logs &lt;pod-name&gt;</code>
              <br/><span className="text-slate-400 text-xs ml-5">&rarr; DaemonSet：每 30 秒一行 collecting logs &rarr; CronJob：Hello from CronJob! + 時間</span>
            </li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰（兩個觀察實驗）</p>
          <ol className="text-slate-300 text-sm space-y-1.5 list-decimal list-inside">
            <li>
              <strong className="text-white">改 schedule</strong>：把 CronJob schedule 改成 <code className="text-green-400">"*/2 * * * *"</code>
              <br/><span className="text-slate-400 text-xs ml-5">&rarr; apply 後等 2 分鐘，get jobs 確認間隔真的變長了</span>
            </li>
            <li>
              <strong className="text-white">DaemonSet vs Deployment 分布</strong>：建一個 <code className="text-green-400">replicas=2</code> 的 Deployment
              <br/><span className="text-slate-400 text-xs ml-5">&rarr; get pods -o wide 比較：Deployment 有沒有可能兩個 Pod 擠在同一個 Node？DaemonSet 呢？</span>
            </li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">驗收</p>
          <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl get ds</code> &rarr; DESIRED = READY = Node 數</li>
            <li><code className="text-green-400">kubectl get jobs</code> &rarr; 至少一個 COMPLETIONS 1/1</li>
            <li><code className="text-green-400">kubectl logs</code> &rarr; 兩邊都有正確輸出</li>
          </ul>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
學員練習時間：自行建立 DaemonSet 和 CronJob，完成三個驗證。

【② 指令講解】
必做：
kubectl apply -f daemonset.yaml → kubectl get daemonsets → 確認 DESIRED = Node 數
kubectl get pods -o wide -l app=log-collector → 每個 Node 各一個 Pod
kubectl logs <daemonset-pod> → 看到 collecting logs 輸出

kubectl apply -f cronjob.yaml → kubectl get cronjobs → 看 SCHEDULE
等一分鐘 → kubectl get jobs → COMPLETIONS 1/1
kubectl get pods → 看到 STATUS: Completed
kubectl logs <cronjob-pod> → Hello from CronJob! + 時間戳

挑戰 1：
修改 cronjob.yaml 的 schedule 為 "*/2 * * * *" → apply → 等 2 分鐘
kubectl get jobs → 確認兩個 Job 之間間隔約 2 分鐘

挑戰 2：
kubectl create deployment test-deploy --image=busybox:1.36 --replicas=2 -- sh -c 'sleep 3600'
kubectl get pods -o wide -l app=test-deploy → 觀察 NODE 欄位
→ Deployment 的兩個 Pod 可能擠在同一個 Node
→ DaemonSet 保證每個 Node 各一個
清理：kubectl delete deployment test-deploy

【③④ 題目 + 解答】
（無，Lab 在後面）
[▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-23 回頭操作 ──
  {
    title: 'DaemonSet + CronJob 常見坑',
    subtitle: '回頭操作 Loop 7',
    section: '5-15：DaemonSet + CronJob',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f daemonset.yaml</code></li>
            <li><code className="text-green-400">kubectl get daemonsets</code> -- DESIRED = READY = Node 數</li>
            <li><code className="text-green-400">kubectl get pods -o wide -l app=log-collector</code></li>
            <li><code className="text-green-400">kubectl apply -f cronjob.yaml</code></li>
            <li>等一分鐘 &rarr; <code className="text-green-400">kubectl get jobs</code> &rarr; <code className="text-green-400">kubectl get pods</code></li>
            <li><code className="text-green-400">kubectl logs &lt;pod-name&gt;</code></li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">兩個常見坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>CronJob Pod 狀態 <code className="text-cyan-400">Completed</code> 是正常的，<strong className="text-white">不是錯誤</strong></li>
            <li>DaemonSet YAML 不需要 <code>replicas</code> 欄位（從 Deployment 複製記得刪掉）</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">清理</p>
          <p className="text-slate-300 text-xs mt-1"><code className="text-green-400">kubectl delete daemonset log-collector</code> + <code className="text-green-400">kubectl delete cronjob hello-cron</code></p>
        </div>
      </div>
    ),
    code: `# 回頭操作 Loop 7：常見坑確認
kubectl apply -f daemonset.yaml
kubectl get daemonsets
kubectl get pods -o wide -l app=log-collector

kubectl apply -f cronjob.yaml
kubectl get cronjobs
kubectl get jobs   # 等 1 分鐘後出現
kubectl logs <job-pod-name>

# 清理
kubectl delete daemonset log-collector
kubectl delete cronjob hello-cron`,
    notes: `【① 課程內容】
帶做 DaemonSet + CronJob 完整流程，並說明兩個最常見的錯誤。

【② 指令講解】
帶做流程：
kubectl apply -f daemonset.yaml → kubectl get daemonsets → kubectl get pods -o wide -l app=log-collector
→ 確認 DESIRED = READY = Node 數，每個 Node 各一個 Pod

kubectl apply -f cronjob.yaml → kubectl get cronjobs → 等一分鐘
→ kubectl get jobs（COMPLETIONS 1/1）→ kubectl get pods（Completed）
→ kubectl logs [pod-name]（看到 Hello from CronJob! + 時間戳）

清理指令：
kubectl delete daemonset log-collector
→ 用途：刪除 DaemonSet 及其所有 Pod
→ 打完要看：daemonset.apps "log-collector" deleted

kubectl delete cronjob hello-cron
→ 用途：刪除 CronJob
→ 打完要看：cronjob.batch "hello-cron" deleted
→ 注意：正在執行中的 Job 不會自動刪，需手動清理

【③④ 題目 + 解答】
常見坑 Q1：讓學生看到 CronJob Pod 的 Completed 狀態，執行 kubectl logs 確認它正常跑完（而不是掛掉）。
操作：
  kubectl get pods    # 找到 STATUS: Completed 的 Pod
  kubectl logs <completed-pod-name>    # 看輸出確認有正確執行
  kubectl describe pod <completed-pod-name>    # 看 State 欄位
驗收標準：kubectl logs 有正確輸出（而非空白），describe 顯示 'Reason: Completed'（不是 Error）

常見坑 Q2：複製 Deployment YAML，改 kind 為 DaemonSet 但故意保留 replicas: 3，apply 後觀察 DESIRED 欄位是不是還是 Node 數量（而非 3）。
操作：
  # 建一個保留 replicas: 3 的 DaemonSet YAML
  kubectl apply -f daemonset-with-replicas.yaml
  kubectl get daemonsets    # 看 DESIRED 欄位
  kubectl get nodes         # 對比 Node 數量
驗收標準：DESIRED 等於 Node 數量（不是 3），驗證 K8s 忽略 DaemonSet 裡的 replicas 欄位
[▶ 下一頁]`,
  },


  // -- Lab 7：DaemonSet 情境 Lab --
  {
    title: 'Lab 7：日誌收集工具部署情境',
    subtitle: 'DaemonSet vs Deployment -- 發現問題 → 改寫 → 驗證',
    section: '5-15：DaemonSet + CronJob',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">情境說明</p>
          <p className="text-slate-300 text-sm">你的團隊要部署 Fluentd 日誌收集工具，需要在<strong className="text-white">每個 Node 上都跑一份</strong>。但同事 Jimmy 用 Deployment 部署了，只有一個 Pod，而且 Pod 只跑在其中一個 Node 上。你需要找出問題並改正。</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">任務</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>套用 Jimmy 的 Deployment YAML，觀察 Pod 只在一個 Node 上</li>
            <li>改寫成 DaemonSet YAML（移除 replicas，改 kind）</li>
            <li>kubectl apply 後，驗證每個 Node 都有一個 Pod</li>
          </ol>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗收標準</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl get daemonsets</code> 顯示 DESIRED = Node 數量</li>
            <li><code className="text-green-400">kubectl get pods -o wide</code> 每個 Node 上各一個 Pod</li>
          </ul>
        </div>
      </div>
    ),
    code: `# Step 1: Jimmy 的問題 YAML (Deployment)
# jimmy-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: log-collector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: fluentd
          image: fluent/fluentd:v1.16

# kubectl apply -f jimmy-deployment.yaml
# kubectl get pods -o wide  # 觀察：Pod 只在一個 Node！

---
# Step 2: 正確的 DaemonSet
# daemonset-correct.yaml
apiVersion: apps/v1
kind: DaemonSet           # 改這裡
metadata:
  name: log-collector
spec:
  # 刪除 replicas 欄位
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: fluentd
          image: fluent/fluentd:v1.16

# Step 3: 驗證
# kubectl delete deployment log-collector
# kubectl apply -f daemonset-correct.yaml
# kubectl get daemonsets
# kubectl get pods -o wide -l app=log-collector`,
    notes: `【① 課程內容】
本節為 Loop 7 的學生情境 Lab。情境：你的團隊要部署 Fluentd 日誌收集工具，需要每個 Node 上都跑一份。同事用 Deployment 部署，只有一個 Pod，且只在一個 Node 上跑。學生需要發現問題、改寫成 DaemonSet，並驗證結果。

【② 指令講解】
kubectl apply -f jimmy-deployment.yaml
→ 用途：套用有問題的 Deployment
→ 打完要看：deployment.apps/log-collector created

kubectl get pods -o wide
→ 用途：觀察問題 - Pod 只在一個 Node 上
→ 打完要看：NODE 欄位只出現一個 Node 名稱（問題）

kubectl delete deployment log-collector
→ 用途：刪掉有問題的 Deployment

kubectl apply -f daemonset-correct.yaml
→ 用途：套用正確的 DaemonSet
→ 打完要看：daemonset.apps/log-collector created

kubectl get daemonsets
→ 打完要看：DESIRED = Node 數量（例如 2 或 3）

kubectl get pods -o wide -l app=log-collector
→ 打完要看：每個 Node 名稱各出現一次 → 驗收通過！

【③④ 題目 + 解答】
Q：用 kubectl get pods -o wide 比較 Deployment（replicas=Node數）和 DaemonSet 兩者的 Pod 分布，觀察 Deployment 的 Pod 分布是否真的每台 Node 各一個。
操作：
  # 先確認你有幾個 Node
  kubectl get nodes
  # 部署 replicas=Node數 的 Deployment
  kubectl create deployment test-deploy --image=busybox:1.36 --replicas=2 -- sh -c 'sleep 3600'
  kubectl get pods -o wide -l app=test-deploy
  # 觀察 NODE 欄位：有沒有某個 Node 同時分配了 2 個 Pod？
  # 再看 DaemonSet 的分布
  kubectl get pods -o wide -l app=log-collector
驗收標準：
  - 觀察 Deployment 的 Pod 分布，NODE 欄位可能有 Node 重複出現
  - DaemonSet 的 Node 欄位每個 Node 名稱恰好出現一次
  - 清理：kubectl delete deployment test-deploy
[▶ 下一頁]`,
  },

  // ============================================================
  // 5-17：綜合實作 + 總結
  // ============================================================

  // ── 第 26 張：綜合實作：情境 + 目標架構 ──
  {
    title: '綜合實作：情境 + 目標架構',
    subtitle: '把今天學的零件串成完整服務',
    section: '5-17：綜合實作 + 總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">情境</p>
          <p className="text-slate-300 text-sm">今天學了 Service、DNS、Namespace、DaemonSet、CronJob &mdash; 全是零散的零件。<br/>現在把它們串成一個完整的服務架構。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">目標架構</p>
          <div className="text-slate-300 text-sm font-mono space-y-1">
            <p>外部瀏覽器 &rarr; NodePort(:30080)</p>
            <p className="pl-4">&rarr; frontend-svc &rarr; frontend Deployment (nginx x2)</p>
            <p className="pl-4">&rarr; api-svc (ClusterIP) &rarr; api Deployment (httpd x2)</p>
            <p>+ log-collector DaemonSet（每個 Node 各 1 個）</p>
            <p className="text-cyan-400 mt-2">全在 fullstack-demo Namespace 內</p>
          </div>
        </div>

        <div className="bg-cyan-900/30 border border-cyan-500/30 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">知識點對照</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1">架構元素</th>
                <th className="text-left py-1">對應知識點</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700"><td className="py-1">frontend NodePort</td><td className="py-1">Loop 5：NodePort 對外</td></tr>
              <tr className="border-b border-slate-700"><td className="py-1">api ClusterIP</td><td className="py-1">Loop 4：ClusterIP 內部通訊</td></tr>
              <tr className="border-b border-slate-700"><td className="py-1">curl api-svc</td><td className="py-1">Loop 6：DNS 短名稱</td></tr>
              <tr className="border-b border-slate-700"><td className="py-1">fullstack-demo ns</td><td className="py-1">Loop 6：Namespace 隔離</td></tr>
              <tr><td className="py-1">log-collector</td><td className="py-1">Loop 7：DaemonSet</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# full-stack.yaml
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: fullstack-demo
---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: fullstack-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
---
# Frontend Service（NodePort）
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: fullstack-demo
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: fullstack-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: httpd
          image: httpd:2.4
          ports:
            - containerPort: 80
---
# API Service（ClusterIP）
apiVersion: v1
kind: Service
metadata:
  name: api-svc
  namespace: fullstack-demo
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 80
---
# DaemonSet（log-collector）
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
  namespace: fullstack-demo
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
        - name: log-agent
          image: busybox:1.36
          command: ["sh", "-c", "while true; do echo 'collecting logs...'; sleep 60; done"]`,
    notes: `【① 課程內容】
今天學了一堆零件：ClusterIP、NodePort、DNS、Namespace、DaemonSet、CronJob。
現在要把它們全部串成一個完整的服務架構，模擬真實工作場景的部署流程。

目標架構：
外部瀏覽器 → NodePort（30080）→ frontend Deployment（nginx x2）
frontend Pod 內部 → ClusterIP → api Deployment（httpd x2）
每個 Node → log-collector DaemonSet
全部放在 fullstack-demo Namespace 內

知識點對照：
- frontend-svc NodePort → Loop 5
- api-svc ClusterIP → Loop 4
- curl api-svc 短名稱 → Loop 6 DNS
- fullstack-demo Namespace → Loop 6
- log-collector DaemonSet → Loop 7

【② 指令講解】
（本張為情境說明，操作在下一張）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── 第 27 張：Step 1-3：建環境 ──
  {
    title: '綜合實作 Step 1-3：建環境',
    subtitle: 'apply → 確認資源 → 看 Pod 分布',
    section: '5-17：綜合實作 + 總結',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 1：一次套用所有資源</p>
          <p className="text-slate-300 text-sm font-mono">kubectl apply -f full-stack.yaml</p>
          <p className="text-slate-400 text-xs mt-1">YAML 內 6 個資源用 --- 分隔，一個指令全部建好</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 2：確認所有資源</p>
          <p className="text-slate-300 text-sm font-mono">kubectl get all -n fullstack-demo</p>
          <p className="text-slate-400 text-xs mt-1">所有 Pod Running、兩個 Service 建立完成</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 3：看 Pod 分布</p>
          <p className="text-slate-300 text-sm font-mono">kubectl get pods -o wide -n fullstack-demo</p>
          <p className="text-slate-400 text-xs mt-1">frontend/api 分散不同 Node，log-collector 每 Node 各一個</p>
        </div>
      </div>
    ),
    code: `# Step 1：一次套用所有資源
kubectl apply -f full-stack.yaml
# namespace/fullstack-demo created
# deployment.apps/frontend created
# service/frontend-svc created
# deployment.apps/api created
# service/api-svc created
# daemonset.apps/log-collector created

# Step 2：確認所有資源
kubectl get all -n fullstack-demo

# Step 3：看 Pod 分布在哪些 Node
kubectl get pods -o wide -n fullstack-demo`,
    notes: `【① 課程內容】
用一個 full-stack.yaml 一次建好整個架構：Namespace、兩組 Deployment + Service、一個 DaemonSet，共 6 個資源。

【② 指令講解】
kubectl apply -f full-stack.yaml
→ 用途：一次套用所有資源（YAML 內多個資源用 --- 分隔）
→ 打完要看：每一行都是 created，例如：
   namespace/fullstack-demo created
   deployment.apps/frontend created
   service/frontend-svc created
   deployment.apps/api created
   service/api-svc created
   daemonset.apps/log-collector created
→ 異常：namespaces "fullstack-demo" already exists → 可忽略或先刪除 namespace

kubectl get all -n fullstack-demo
→ 用途：確認 namespace 內所有資源（Pod、Deployment、Service）
→ 打完要看：所有 Pod 都是 Running，兩個 Service 都建立完成
→ 異常：Pod 持續 Pending → kubectl describe pod 看原因

kubectl get pods -o wide -n fullstack-demo
→ 用途：查看 Pod 分布在哪些 Node
→ 打完要看：frontend 和 api 的 Pod 分散在不同 Node；log-collector 每個 Node 各一個

【③④ 題目 + 解答】
（無，本張為操作步驟）
[▶ 下一頁]`,
  },

  // ── 第 28 張：Step 4-6：驗證連線 ──
  {
    title: '綜合實作 Step 4-6：驗證連線',
    subtitle: 'NodePort → ClusterIP + DNS → nslookup',
    section: '5-17：綜合實作 + 總結',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 4：外部連 frontend（NodePort）</p>
          <p className="text-slate-300 text-sm font-mono">curl http://&lt;Node-IP&gt;:30080</p>
          <p className="text-slate-400 text-xs mt-1">驗證 外部 &rarr; Node:30080 &rarr; frontend-svc &rarr; frontend Pod 整條路通</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 5：內部連 api（ClusterIP + DNS）</p>
          <p className="text-slate-300 text-sm font-mono">kubectl exec frontend-pod -- curl http://api-svc</p>
          <p className="text-slate-400 text-xs mt-1">驗證 frontend Pod 用短名稱連 api-svc，ClusterIP + DNS 都通</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 6：DNS 解析驗證</p>
          <p className="text-slate-300 text-sm font-mono">kubectl run ... -- nslookup api-svc</p>
          <p className="text-slate-400 text-xs mt-1">親眼看到 CoreDNS 把 api-svc 翻成 ClusterIP</p>
        </div>
      </div>
    ),
    code: `# Step 4：從外部 curl frontend（NodePort）
kubectl get nodes -o wide   # 拿 Node IP
curl http://<Node-IP>:30080
# 看到 Welcome to nginx!

# Step 5：從 frontend Pod curl api-svc（ClusterIP + DNS）
kubectl get pods -n fullstack-demo | grep frontend
kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc
# 看到 It works!

# Step 6：DNS 解析驗證
kubectl run dns-check -n fullstack-demo --image=busybox:1.36 \
  --rm -it --restart=Never -- nslookup api-svc
# 看到 api-svc 的 ClusterIP`,
    notes: `【① 課程內容】
三步驗證整個架構的連線：外部 NodePort、內部 ClusterIP + DNS、DNS 解析。

【② 指令講解】
curl http://[Node-IP]:30080
→ 用途：從外部驗證 NodePort 是否通
→ 先取得 Node IP：kubectl get nodes -o wide 或 multipass info k3s-worker1 | grep IPv4
→ 打完要看：nginx 預設首頁 HTML（Welcome to nginx!）
→ 異常：Connection refused → nodePort 或 Node IP 填錯

kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc
→ 用途：從 frontend Pod 內驗證能否連到 api-svc（ClusterIP + DNS）
→ 先取得 Pod 名稱：kubectl get pods -n fullstack-demo | grep frontend
→ 打完要看：Apache httpd 的預設首頁 "It works!"
→ 異常：Could not resolve host: api-svc → 確認兩個資源都在同一個 namespace

kubectl run dns-check -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc
→ 用途：DNS 解析驗證，確認 api-svc 能被解析到正確 ClusterIP
→ 打完要看：Name: api-svc / Address 1: 10.96.x.x api-svc.fullstack-demo.svc.cluster.local

【③④ 題目 + 解答】
（無，本張為操作步驟）
[▶ 下一頁]`,
  },

  // ── 第 29 張：Step 7-10：生命周期 ──
  {
    title: '綜合實作 Step 7-10：生命周期',
    subtitle: '擴容 → 滾動更新 → 回滾 → 清理',
    section: '5-17：綜合實作 + 總結',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 7：擴容</p>
          <p className="text-slate-300 text-sm font-mono">kubectl scale deployment frontend --replicas=5 -n fullstack-demo</p>
          <p className="text-slate-400 text-xs mt-1">Pod 從 2 變 5，Endpoints 自動更新</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 8：滾動更新</p>
          <p className="text-slate-300 text-sm font-mono">kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo</p>
          <p className="text-slate-400 text-xs mt-1">Pod 逐一替換，服務不中斷</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">Step 9：回滾</p>
          <p className="text-slate-300 text-sm font-mono">kubectl rollout undo deployment/frontend -n fullstack-demo</p>
          <p className="text-slate-400 text-xs mt-1">一個指令回到上一版</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">Step 10：清理</p>
          <p className="text-slate-300 text-sm font-mono">kubectl delete namespace fullstack-demo</p>
          <p className="text-slate-400 text-xs mt-1">一行刪掉整個 namespace 和所有資源</p>
        </div>
      </div>
    ),
    code: `# Step 7：擴容
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
kubectl get pods -n fullstack-demo

# Step 8：滾動更新
kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo
kubectl rollout status deployment/frontend -n fullstack-demo

# Step 9：回滾
kubectl rollout undo deployment/frontend -n fullstack-demo

# Step 10：清理
kubectl delete namespace fullstack-demo`,
    notes: `【① 課程內容】
完成完整服務生命周期的後半段：擴容 → 滾動更新 → 回滾 → 清理。

【② 指令講解】
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
→ 用途：將 frontend 從 2 副本擴展到 5 副本
→ 打完要看：kubectl get pods -n fullstack-demo 看到 5 個 frontend Pod
→ 延伸：kubectl get ep frontend-svc -n fullstack-demo 確認 Endpoints 從 2 變 5

kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo
→ 用途：滾動更新 frontend 的 nginx 版本
→ 打完要看：kubectl rollout status 顯示逐一替換
→ 異常：ImagePullBackOff → image tag 打錯

kubectl rollout undo deployment/frontend -n fullstack-demo
→ 用途：回滾到上一個版本
→ 打完要看：Pod 逐一替換回 nginx:1.27

kubectl delete namespace fullstack-demo
→ 用途：清理所有資源（一行刪掉 namespace 內所有東西）
→ 打完要看：namespace "fullstack-demo" deleted
→ 注意：刪除需要時間（30秒到2分鐘），先顯示 Terminating 再完成
→ 高危操作：刪前務必確認 namespace 名稱正確

【③④ 題目 + 解答】
Q1：從 frontend Pod exec 進去，分別 curl http://api-svc 和 curl http://api-svc.fullstack-demo.svc.cluster.local，確認兩種都成功回傳 'It works!'。
操作：
  kubectl get pods -n fullstack-demo | grep frontend    # 找 Pod 名稱
  kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc
  kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc.fullstack-demo.svc.cluster.local
驗收標準：兩個指令都回傳 'It works!'，驗證短名稱和 FQDN 等效

Q2：把 frontend Deployment 從 2 副本擴展到 5 副本，然後執行 kubectl get endpoints frontend-svc -n fullstack-demo，觀察 Endpoints 數量有沒有跟著增加。
操作：
  kubectl get ep frontend-svc -n fullstack-demo    # 記下目前 Endpoints 數量
  kubectl scale deployment frontend --replicas=5 -n fullstack-demo
  kubectl get pods -n fullstack-demo               # 等 Pod 都 Running
  kubectl get ep frontend-svc -n fullstack-demo    # 觀察 Endpoints 變化
驗收標準：Endpoints 從 2 個 IP 增加到 5 個 IP，從外部 curl Node:30080 仍然成功

Q3：scale frontend 到 5 副本後，多連幾次 curl Node:30080，用 kubectl logs 分別看不同 frontend Pod，確認流量有被分散到不同 Pod。
操作：
  for i in 1 2 3 4 5; do curl -s http://<Node-IP>:30080 -o /dev/null -w '%{http_code}\n'; done
  kubectl logs <frontend-pod-1> -n fullstack-demo --tail=5
  kubectl logs <frontend-pod-2> -n fullstack-demo --tail=5
驗收標準：多個 Pod 的 logs 都有出現 access log，驗證流量有被分散
[▶ 下一頁]`,
  },

  // ── 第 30 張：學員練習：從零做一遍 ──
  {
    title: '學員練習：你是新來的 K8s 工程師',
    subtitle: '完成部署任務 — 雙服務 + 版本更新 + 運維需求',
    section: '5-17：綜合實作 + 總結',
    duration: '20',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1 text-sm">情境</p>
          <p className="text-slate-300 text-xs">你剛加入一間新創公司，主管交給你以下部署任務。所有資源建在 <code className="text-cyan-400">my-app</code> namespace。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">任務 1：部署雙服務架構（必做）</p>
          <div className="text-slate-300 text-xs space-y-1">
            <p><strong className="text-white">前端</strong>：nginx:1.27，3 副本，外部要能用瀏覽器打開（NodePort 30080）</p>
            <p><strong className="text-white">後端 API</strong>：httpd:2.4，2 副本，只有前端能連到就好（ClusterIP）</p>
            <p className="text-green-400 mt-1">驗收：curl Node-IP:30080 看到 nginx，從前端 Pod curl api-svc 看到 It works!</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">任務 2：版本更新 + 回滾（必做）</p>
          <div className="text-slate-300 text-xs space-y-1">
            <p>PM 說前端要從 nginx:1.27 更新到 nginx:1.28</p>
            <p>更新完發現 1.28 有 bug，立刻回滾到 1.27</p>
            <p className="text-green-400 mt-1">驗收：rollout history 看到版本紀錄</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">任務 3：運維需求（挑戰）</p>
          <div className="text-slate-300 text-xs space-y-1">
            <p>運維說每台 Node 都要裝日誌收集器 &rarr; <strong className="text-white">DaemonSet</strong></p>
            <p>PM 說每分鐘要 health check 前端服務 &rarr; <strong className="text-white">CronJob</strong> curl api-svc</p>
            <p className="text-green-400 mt-1">驗收：DaemonSet Pod 數 = Node 數，CronJob logs 看到成功</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded-lg">
          <p className="text-slate-400 text-xs">清理：<code className="text-green-400">kubectl delete namespace my-app</code></p>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
學員練習時間。情境：你是新來的 K8s 工程師，主管交給你部署任務。

【② 指令講解】
任務 1（雙服務架構）參考指令：
kubectl create namespace my-app
kubectl create deployment frontend --image=nginx:1.27 --replicas=3 -n my-app
kubectl expose deployment frontend --port=80 --type=NodePort --name=frontend-svc -n my-app
kubectl create deployment api --image=httpd:2.4 --replicas=2 -n my-app
kubectl expose deployment api --port=80 --name=api-svc -n my-app
kubectl get nodes -o wide
curl http://<Node-IP>:30080
kubectl exec -n my-app <frontend-pod> -- curl http://api-svc

任務 2（版本更新 + 回滾）參考指令：
kubectl set image deployment/frontend nginx=nginx:1.28 -n my-app
kubectl rollout status deployment/frontend -n my-app
kubectl rollout undo deployment/frontend -n my-app
kubectl rollout history deployment/frontend -n my-app

任務 3（運維需求）參考指令：
kubectl apply -f daemonset.yaml（改 namespace: my-app）
kubectl get ds -n my-app
kubectl get pods -o wide -n my-app -l app=log-collector
kubectl apply -f cronjob.yaml（改 namespace: my-app，command 改 curl api-svc）
kubectl get jobs -n my-app
kubectl logs <job-pod> -n my-app

清理：kubectl delete namespace my-app

【③④ 題目 + 解答】
（題目就是上面三個任務，學員照做即可）
[▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 第 31 張：Lab 8 ──
  {
    title: 'Lab 8：從零建完整 Web 服務架構',
    subtitle: 'Deployment + ClusterIP + NodePort + CronJob -- 全部串起來',
    section: '5-17：綜合實作 + 總結',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">情境說明</p>
          <p className="text-slate-300 text-sm">你需要從零建立一個完整的 web 服務架構，包含對外服務、內部通訊，以及定時健康檢查。</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">任務清單</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建立 nginx Deployment（3 副本）</li>
            <li>建 ClusterIP Service，讓叢集內部可以連</li>
            <li>建 NodePort Service（port 30088），讓外部可以連</li>
            <li>建 CronJob 每分鐘 curl nginx 做 health check</li>
            <li>驗證：<code className="text-green-400">kubectl get all</code> 看到所有資源正常</li>
          </ol>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗收標準</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>3 個 nginx Pod 全部 Running</li>
            <li>從測試 Pod curl nginx-svc 成功（ClusterIP）</li>
            <li>curl Node-IP:30088 看到 nginx 歡迎頁（NodePort）</li>
            <li>CronJob Pod 狀態 Completed，logs 有 Health check OK</li>
          </ul>
        </div>
      </div>
    ),
    code: `# nginx-web-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-web
  template:
    metadata:
      labels:
        app: nginx-web
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
---
# nginx-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP
  selector:
    app: nginx-web
  ports:
    - port: 80
      targetPort: 80
---
# nginx-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx-web
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30088
---
# health-check-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: health-check
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      ttlSecondsAfterFinished: 60
      template:
        spec:
          containers:
            - name: checker
              image: busybox:1.36
              command: ["sh", "-c",
                "wget -qO- http://nginx-svc && echo Health check OK"]
          restartPolicy: OnFailure

# 驗收指令
# kubectl get all
# kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-svc
# curl http://[Node-IP]:30088
# kubectl get jobs   # 等1分鐘後
# kubectl logs [health-check-pod-name]
# 清理：kubectl delete deployment nginx-web && kubectl delete svc nginx-svc nginx-nodeport && kubectl delete cronjob health-check`,
    notes: `【① 課程內容】
本節為 Loop 8 的學生情境 Lab。完整整合今日所學：Deployment、ClusterIP、NodePort、CronJob。情境是從零建一個完整的 web 服務架構，包含外部存取和定時健康檢查。

【② 指令講解】
kubectl apply -f nginx-web-deployment.yaml
→ 打完要看：deployment.apps/nginx-web created

kubectl apply -f nginx-clusterip.yaml
→ 打完要看：service/nginx-svc created

kubectl apply -f nginx-nodeport.yaml
→ 打完要看：service/nginx-nodeport created

kubectl apply -f health-check-cronjob.yaml
→ 打完要看：cronjob.batch/health-check created

kubectl get all
→ 用途：一次確認所有資源
→ 打完要看：3 個 Pod Running，2 個 Service，1 個 Deployment，CronJob 存在

kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-svc
→ 用途：叢集內部 ClusterIP 驗證
→ 打完要看：nginx 歡迎頁 HTML

curl http://[Node-IP]:30088
→ 用途：外部 NodePort 驗證
→ Node IP 取法：kubectl get nodes -o wide
→ 打完要看：nginx 歡迎頁 HTML

kubectl get jobs（等一分鐘後）
→ 打完要看：health-check-xxxxx 的 COMPLETIONS 1/1

kubectl logs [health-check-pod-name]
→ 打完要看：nginx 歡迎頁 HTML + "Health check OK"

【③④ 題目 + 解答】
Q1：在所有資源跑起來後，執行 kubectl run dns-check --image=busybox:1.36 --rm -it --restart=Never -- nslookup nginx-svc，確認 CronJob 的 Pod 能解析到 nginx-svc 的 ClusterIP。
操作：
  kubectl run dns-check --image=busybox:1.36 --rm -it --restart=Never -- nslookup nginx-svc
  # 在輸出中確認 Address 欄位有 ClusterIP
驗收標準：nslookup 回傳 nginx-svc 對應的 ClusterIP，驗證 CronJob Pod 能用短名稱找到 Service

Q2：修改 health-check CronJob 的 schedule 為 '*/2 * * * *'（每兩分鐘），apply 更新，觀察新 Job 觸發的間隔確實變長了。
操作：
  # 把 schedule 改成 '*/2 * * * *'
  kubectl apply -f health-check-cronjob.yaml
  kubectl get cronjobs    # 確認 SCHEDULE 更新
  # 等 2 分鐘
  kubectl get jobs        # 觀察新 Job 出現的時間間隔
驗收標準：kubectl get jobs 顯示新 Job 之間的 LAST SCHEDULE 間隔約 2 分鐘

Q3：故意把 nginx-svc 的 selector 改錯（selector app: nginx-broken），apply 讓 Endpoints 變成空的，等 1 分鐘看 CronJob 的 log 顯示什麼 error，再修好 selector，確認下一次 CronJob 執行成功。
操作：
  # 改錯 selector 後 apply
  kubectl apply -f nginx-clusterip.yaml
  kubectl get ep nginx-svc    # 確認變成 none
  # 等 1 分鐘
  kubectl get pods    # 找最新的 health-check Pod
  kubectl logs <health-check-pod>    # 看 error 訊息
  # 修好 selector 後 apply
  kubectl apply -f nginx-clusterip.yaml
  kubectl get ep nginx-svc    # 確認 Endpoints 恢復
  # 等 1 分鐘
  kubectl logs <next-health-check-pod>    # 確認成功
驗收標準：錯誤的 log 顯示連線失敗，修好後的 log 顯示 'Health check OK'
[▶ 第五堂結束]`,
  },

  // ── 第 32 張：第五堂總結：因果鏈回顧 ──
  {
    title: '第五堂總結：因果鏈回顧',
    subtitle: '從 Deployment 到完整服務上線流程',
    section: '5-17：綜合實作 + 總結',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">今天的因果鏈</p>
          <div className="text-sm space-y-1">
            <p className="text-slate-300">第四堂 Deployment 只有一個 Node &rarr; <span className="text-cyan-400">k3s 多節點</span></p>
            <p className="text-slate-300">&rarr; 流量變了要調整 &rarr; <span className="text-cyan-400">擴縮容</span></p>
            <p className="text-slate-300">&rarr; 新版本要上線 &rarr; <span className="text-cyan-400">滾動更新</span></p>
            <p className="text-slate-300">&rarr; 新版有 bug &rarr; <span className="text-cyan-400">回滾</span></p>
            <p className="text-slate-300">&rarr; Pod 掛了 &rarr; <span className="text-cyan-400">自我修復</span></p>
            <p className="text-slate-300">&rarr; K8s 怎麼認 Pod？ &rarr; <span className="text-cyan-400">Labels + Selector</span></p>
            <p className="text-slate-300">&rarr; 外面連不到 &rarr; <span className="text-green-400">ClusterIP Service</span></p>
            <p className="text-slate-300">&rarr; 外面也要連 &rarr; <span className="text-green-400">NodePort</span></p>
            <p className="text-slate-300">&rarr; 用 IP 太麻煩 &rarr; <span className="text-green-400">DNS 服務發現</span></p>
            <p className="text-slate-300">&rarr; 環境要隔離 &rarr; <span className="text-green-400">Namespace</span></p>
            <p className="text-slate-300">&rarr; 每台 Node 都要跑一份 &rarr; <span className="text-amber-400">DaemonSet</span></p>
            <p className="text-slate-300">&rarr; 定時跑任務 &rarr; <span className="text-amber-400">CronJob</span></p>
            <p className="text-slate-300">&rarr; 全部串起來 &rarr; <span className="text-amber-400">完整服務上線流程</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天新學的 kubectl 指令</p>
          <div className="text-slate-300 text-xs font-mono space-y-1">
            <p>kubectl scale deployment &lt;name&gt; --replicas=N</p>
            <p>kubectl set image deployment/&lt;name&gt; &lt;container&gt;=&lt;image&gt;</p>
            <p>kubectl rollout status / history / undo</p>
            <p>kubectl get svc / endpoints</p>
            <p>kubectl run &lt;name&gt; --image=&lt;img&gt; --rm -it --restart=Never -- &lt;cmd&gt;</p>
            <p>kubectl expose deployment &lt;name&gt; --port=80</p>
            <p>kubectl create namespace &lt;name&gt;</p>
            <p>kubectl get &lt;resource&gt; -n &lt;namespace&gt; / -A</p>
            <p>kubectl get daemonsets / cronjobs / jobs</p>
          </div>
        </div>
      </div>
    ),
    code: `# 今日完整指令速查
kubectl scale deployment <name> --replicas=N
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status deployment/<name>
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>
kubectl get svc / endpoints
kubectl run <name> --image=<img> --rm -it --restart=Never -- sh
kubectl create namespace <ns>
kubectl get pods -n <ns>
kubectl get pods -A
kubectl get daemonsets
kubectl get cronjobs / jobs`,
    notes: `【① 課程內容】
今日因果鏈總覽：每個 K8s 概念都是因為前一步的問題才引出來的。

k3s 多節點 → 擴縮容（流量大了） → 滾動更新（新版本上線） → 回滾（版本有 bug）
→ 自我修復（Pod 掛了） → Labels + Selector（K8s 怎麼認 Pod）
→ ClusterIP（外面連不到） → NodePort（外面也要連）
→ DNS（用 IP 太麻煩） → Namespace（環境要隔離）
→ DaemonSet（每台 Node 都要跑一份） → CronJob（定時跑任務）
→ 綜合實作（全部串起來）

今日新學 kubectl 指令速查清單：
kubectl scale deployment [name] --replicas=N
kubectl set image deployment/[name] [container]=[image]
kubectl rollout status / history / undo
kubectl get svc / endpoints（ep）
kubectl run [name] --image=[img] --rm -it --restart=Never -- [cmd]
kubectl expose deployment [name] --port=80
kubectl create namespace [name]
kubectl get [resource] -n [namespace] / -A
kubectl get daemonsets（ds）/ cronjobs（cj）/ jobs
kubectl get all -n [namespace]
kubectl delete namespace [name]（高危！）

【② 指令講解】
本節為複習整理，詳細指令說明見各 Loop 的② 區塊。

kubectl get all -n fullstack-demo
→ 用途：一次看 namespace 內所有常見資源
→ 注意：DaemonSet 不在 get all 的預設列表，需另外 kubectl get ds -n fullstack-demo

【③④ 題目 + 解答】
Q1：建 dev 和 prod 兩個 Namespace，各部署一個 nginx（不同版本：1.26 vs 1.27），從測試 Pod 用 FQDN 分別 curl 兩個，確認兩個 Namespace 的服務互不影響。
操作：
  kubectl create namespace dev
  kubectl create namespace prod
  kubectl create deployment nginx --image=nginx:1.26 -n dev
  kubectl expose deployment nginx --port=80 -n dev
  kubectl create deployment nginx --image=nginx:1.27 -n prod
  kubectl expose deployment nginx --port=80 -n prod
  kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- sh
  # 在 Pod 內：
  wget -qO- http://nginx.dev.svc.cluster.local    # dev 版本
  wget -qO- http://nginx.prod.svc.cluster.local   # prod 版本
驗收標準：兩個都成功回傳 nginx 首頁，兩個環境共存不衝突

Q2：把 CoreDNS scale 到 0 個副本，然後分別試 curl http://nginx-svc（名稱，預期失敗）和 curl http://ClusterIP（IP 直連，預期成功），對比兩種結果，最後記得把 CoreDNS scale 回來。
操作：
  kubectl get svc nginx-svc    # 先記下 ClusterIP
  kubectl scale deployment coredns -n kube-system --replicas=0
  kubectl run test --image=curlimages/curl --rm -it --restart=Never -- sh
  # 在 Pod 內：
  curl http://nginx-svc         # 預期失敗
  curl http://<ClusterIP>       # 預期成功
  exit
  kubectl scale deployment coredns -n kube-system --replicas=2
驗收標準：名稱失敗（Name resolution）、IP 直連成功；最後 CoreDNS 恢復 2 個副本
[▶ 下一頁]`,
  },

  // ── 第 33 張：回家作業 + 下堂課預告 ──
  {
    title: 'Docker 對照表 + 下堂課預告',
    subtitle: '因果鏈繼續走',
    section: '5-17：綜合實作 + 總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker &rarr; K8s 對照表（更新版）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1">Docker</th>
                <th className="text-left py-1">K8s</th>
                <th className="text-left py-1">哪堂課</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 text-xs">
              <tr className="border-b border-slate-700">
                <td className="py-1">docker run</td>
                <td className="py-1">Pod</td>
                <td className="py-1">第四堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">compose up --scale web=3</td>
                <td className="py-1">Deployment replicas: 3</td>
                <td className="py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">-p 8080:80</td>
                <td className="py-1">Service（NodePort / ClusterIP）</td>
                <td className="py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">Docker network DNS</td>
                <td className="py-1">Service + CoreDNS</td>
                <td className="py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">不同 Compose 專案</td>
                <td className="py-1">Namespace</td>
                <td className="py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">crontab</td>
                <td className="py-1">CronJob</td>
                <td className="py-1 text-cyan-400">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1 text-slate-500">Nginx 反向代理</td>
                <td className="py-1 text-slate-500">Ingress</td>
                <td className="py-1 text-slate-500">下一堂</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">docker volume</td>
                <td className="py-1 text-slate-500">PV / PVC</td>
                <td className="py-1 text-slate-500">下一堂</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">下堂課預告</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>192.168.64.3:30080 太醜了 &rarr; <span className="text-cyan-400">Ingress</span> 用域名路由</p>
            <p>設定寫死在 Image &rarr; <span className="text-cyan-400">ConfigMap</span> 抽出來</p>
            <p>密碼不能明文 &rarr; <span className="text-cyan-400">Secret</span> 管敏感資訊</p>
            <p>Pod 掛了資料消失 &rarr; <span className="text-cyan-400">PV / PVC</span> 持久化</p>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
Docker → K8s 完整對照表（今日更新版）：

Docker / Compose → K8s 對應
docker run -p 8080:80 → Service NodePort（對外暴露 port）
Compose service name（DNS）→ Service ClusterIP + CoreDNS
Compose networks: → Namespace + NetworkPolicy
docker run --restart=always → Deployment
docker run --rm → Job
crontab → CronJob
在所有機器上 docker run → DaemonSet
docker ps → kubectl get pods
docker logs → kubectl logs
docker exec -it → kubectl exec -it

下堂課預告（因果鏈繼續）：
- 192.168.64.3:30080 太醜了 → Ingress（域名路由）
- 設定寫死在 Image → ConfigMap（抽出設定）
- 密碼不能明文 → Secret（加密敏感資訊）
- Pod 掛了資料消失 → PV / PVC（持久化）

【② 指令講解】
本節為回顧整理，無新指令。

【③④ 題目 + 解答】
（無）
[▶ 第五堂結束]`,
  },


  // ============================================================
  // Bonus：進階 YAML（進度超前時加碼，不計入正課）
  // ============================================================

  // ── Bonus-1（1/2）：Resource Requests & Limits 概念 ──
  {
    title: 'Bonus：Resource Requests & Limits',
    subtitle: '沒設 Resource = 讓 Pod 吃到飽，Node 遲早爆',
    section: 'Bonus：進階 YAML',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">沒設 Resource 的三個問題</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>一個 Pod 記憶體洩漏 &rarr; 整個 Node 的其他 Pod 全部 OOM Kill</li>
            <li>Scheduler 不知道 Pod 需要多少資源 &rarr; 排程亂放</li>
            <li>Node 資源不足時，沒設 Resource 的 Pod <strong className="text-white">最先被驅逐</strong></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">requests vs limits</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">欄位</th>
                <th className="text-left py-2">意義</th>
                <th className="text-left py-2">超過怎辦</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">requests</td>
                <td className="py-2">最少需要多少（Scheduler 排程依據）</td>
                <td className="py-2">不限制</td>
              </tr>
              <tr>
                <td className="py-2 text-amber-400 font-semibold">limits</td>
                <td className="py-2">最多能用多少</td>
                <td className="py-2">CPU 節流｜記憶體 OOM Kill</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">CPU 單位</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li><code className="text-green-400">1</code> = 1 vCPU = 1000m</li>
              <li><code className="text-green-400">500m</code> = 0.5 vCPU</li>
              <li>超過 limits &rarr; <strong className="text-amber-300">throttle</strong>（變慢，不 Kill）</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">記憶體單位</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li><code className="text-green-400">Mi</code> = Mebibyte（慣用）</li>
              <li><code className="text-green-400">Gi</code> = Gibibyte</li>
              <li>超過 limits &rarr; <strong className="text-red-400">OOM Kill</strong>（直接砍）</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">QoS Class（K8s 自動分類）</p>
          <div className="flex gap-2 text-xs">
            <span className="bg-green-900/40 border border-green-500/40 px-2 py-1 rounded text-green-300">Guaranteed（requests=limits）</span>
            <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-1 rounded text-amber-300">Burstable（requests&lt;limits）</span>
            <span className="bg-red-900/40 border border-red-500/40 px-2 py-1 rounded text-red-300">BestEffort（沒設）</span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Node 資源不足時：BestEffort 先被驅逐 &rarr; Burstable &rarr; Guaranteed 最後</p>
        </div>
      </div>
    ),
    code: `# Resource 設定範例
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      resources:
        requests:
          cpu: "100m"       # 最少 0.1 vCPU（Scheduler 排程依據）
          memory: "128Mi"   # 最少 128 MB
        limits:
          cpu: "500m"       # 最多 0.5 vCPU（超過 throttle）
          memory: "256Mi"   # 最多 256 MB（超過 OOM Kill）

# Docker 對照
# docker run --memory="256m" --cpus="0.5"  ← 只有 limits
# Docker 沒有 requests 概念（單機不需要排程）`,
    notes: `【① 課程內容】
為什麼需要 Resource：沒設的話一個 Pod 可以吃掉整個 Node 資源，記憶體洩漏會連累其他 Pod 全部 OOM Kill。Scheduler 也無法正確排程。

requests vs limits：
- requests：Pod「最少需要」多少資源，Scheduler 拿來選 Node（Node 可用資源 ≥ requests 才放）
- limits：Pod「最多能用」多少資源，CPU 超過 throttle（變慢），記憶體超過 OOM Kill（直接砍）

CPU 單位：1 = 1 vCPU = 1000m，500m = 0.5 vCPU。超過 limits 只 throttle 不 Kill。
記憶體單位：Mi = Mebibyte（慣用），Gi = Gibibyte。超過 limits 直接 OOM Kill。

QoS Class：
- Guaranteed（requests == limits）→ 最不會被 Kill
- Burstable（requests < limits）→ 中等
- BestEffort（完全沒設）→ 最先被驅逐

Docker 對照：docker run --memory --cpus 對應 limits。Docker 沒有 requests 概念。

【② 指令講解】
（本張為概念說明，操作在下一張）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── Bonus-1（2/2）：Resource 實作 + OOM Kill 觀察 ──
  {
    title: 'Bonus 實作：Resource + OOM Kill 觀察',
    subtitle: 'describe 看資源設定 → 故意 OOM → 看 RESTARTS 飆升',
    section: 'Bonus：進階 YAML',
    duration: '10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl describe pod &lt;name&gt;</code> &mdash; 看 Limits / Requests 欄位</li>
            <li><code className="text-green-400">kubectl describe node k3s-worker1</code> &mdash; 看 Allocated resources</li>
            <li><code className="text-green-400">kubectl describe pod &lt;name&gt; | grep QoS</code> &mdash; 看 QoS Class</li>
            <li>apply OOM 測試 Pod &mdash; 觀察 OOMKilled + RESTARTS</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Node 資源狀況範例</p>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
            <p className="text-slate-500">$ kubectl describe node k3s-worker1</p>
            <p className="text-slate-400 mt-1">Allocated resources:</p>
            <p className="text-slate-400">&nbsp;&nbsp;Resource &nbsp;&nbsp;Requests &nbsp;&nbsp;&nbsp;&nbsp;Limits</p>
            <p className="text-slate-300">&nbsp;&nbsp;cpu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;350m (17%) &nbsp;&nbsp;1500m (75%)</p>
            <p className="text-slate-300">&nbsp;&nbsp;memory &nbsp;&nbsp;&nbsp;360Mi (18%) &nbsp;768Mi (38%)</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-2 text-sm">OOM Kill 實際輸出</p>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RESTARTS</p>
            <p className="text-red-300">oom-test &nbsp;0/1 &nbsp;&nbsp;OOMKilled &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</p>
            <p className="text-red-300">oom-test &nbsp;0/1 &nbsp;&nbsp;CrashLoopBackOff &nbsp;1</p>
            <p className="text-red-300">oom-test &nbsp;0/1 &nbsp;&nbsp;OOMKilled &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2</p>
          </div>
          <p className="text-slate-400 text-xs mt-1">記憶體超過 limits &rarr; OOM Kill &rarr; K8s 重啟 &rarr; 又超過 &rarr; 又 Kill &rarr; CrashLoopBackOff</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">③④ 快問快答</p>
          <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
            <li>RESTARTS 從 0 飆到 5，怎麼判斷是 OOM？ &rarr; <code className="text-green-400">describe pod</code> 看 Last State: OOMKilled</li>
            <li>Scheduler 根據 requests 還是 limits 排程？ &rarr; <strong className="text-white">requests</strong></li>
            <li>沒設 Resource 的 Pod QoS 是什麼？ &rarr; BestEffort，最先被驅逐</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 查看 Pod 的 Resource 設定
kubectl describe pod <pod-name>
# → 看 Containers 區塊的 Limits / Requests

# 查看 Node 資源使用狀況
kubectl describe node k3s-worker1
# → 看 Allocated resources 區塊

# 查看 QoS Class
kubectl describe pod <pod-name> | grep QoS
# → Guaranteed / Burstable / BestEffort

# OOM Kill 實驗
kubectl apply -f oom-test.yaml
kubectl get pods -w
# → OOMKilled → CrashLoopBackOff → RESTARTS 飆升
kubectl delete pod oom-test`,
    notes: `【① 課程內容】
本張為 Resource 實作：查看 Pod 資源設定、Node 資源狀況、QoS Class，以及故意觸發 OOM Kill 觀察行為。

【② 指令講解】
查看 Pod Resource：kubectl describe pod <name>
→ 看 Containers 區塊的 Limits / Requests 欄位
→ 若沒設定，這兩個欄位不顯示

查看 Node 資源：kubectl describe node k3s-worker1
→ 看 Allocated resources 區塊
→ Requests 百分比不應超過 100%；Limits 可以 overcommit

查看 QoS：kubectl describe pod <name> | grep QoS
→ Guaranteed / Burstable / BestEffort

OOM Kill 實驗：
kubectl apply -f oom-test.yaml → kubectl get pods -w
→ 打完要看：OOMKilled → CrashLoopBackOff → RESTARTS 持續增加
→ kubectl delete pod oom-test 清理

【③④ 題目 + 解答】
Q1：RESTARTS 從 0 飆到 5，怎麼判斷是 OOM？
A1：kubectl describe pod → Last State 區塊看 Reason: OOMKilled

Q2：requests.cpu: 100m 和 limits.cpu: 500m 代表什麼？Scheduler 根據哪個排程？
A2：100m = 最少 0.1 vCPU（Scheduler 依據）；500m = 最多 0.5 vCPU。Scheduler 根據 requests。

Q3：沒設 Resource 的 Pod QoS 是什麼？Node 資源不足時誰先被 Kill？
A3：BestEffort，最先被驅逐。

[▶ 下一頁]`,
  },

  // ── Bonus-2（1/2）：Liveness & Readiness Probe 概念 ──
  {
    title: 'Bonus：Liveness & Readiness Probe',
    subtitle: 'Running ≠ 正常服務，K8s 需要主動問',
    section: 'Bonus：進階 YAML',
    duration: '12',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">STATUS: Running ≠ 正常</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>容器跑著但應用程式<strong className="text-white">死鎖</strong>（deadlock）</li>
            <li>啟動中還沒準備好接流量</li>
            <li>記憶體洩漏導致無回應</li>
          </ul>
          <p className="text-slate-400 text-xs mt-2">K8s 需要一個機制「主動問」應用程式是否健康</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三種 Probe</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">Probe</th>
                <th className="text-left py-2">問什麼</th>
                <th className="text-left py-2">失敗動作</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-red-400 font-semibold">liveness</td>
                <td className="py-2">你還活著嗎？</td>
                <td className="py-2"><strong className="text-red-300">重啟容器</strong>（RESTARTS +1）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-amber-400 font-semibold">readiness</td>
                <td className="py-2">準備好接流量了嗎？</td>
                <td className="py-2"><strong className="text-amber-300">從 Endpoints 移除</strong>（不重啟）</td>
              </tr>
              <tr>
                <td className="py-2 text-blue-400 font-semibold">startup</td>
                <td className="py-2">啟動完成了嗎？</td>
                <td className="py-2">保護 liveness 不誤判（慢啟動用）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">三種檢查方式</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li><code className="text-green-400">httpGet</code> &mdash; HTTP GET 回 2xx/3xx</li>
              <li><code className="text-green-400">exec</code> &mdash; 執行指令，exit 0</li>
              <li><code className="text-green-400">tcpSocket</code> &mdash; TCP 連得上</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">重要參數</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li><code className="text-green-400">initialDelaySeconds</code> &mdash; 等幾秒才開始</li>
              <li><code className="text-green-400">periodSeconds</code> &mdash; 每隔幾秒檢查</li>
              <li><code className="text-green-400">failureThreshold</code> &mdash; 連續幾次失敗才觸發</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">liveness vs readiness 關鍵差別</p>
          <p className="text-slate-300 text-xs mt-1">liveness 失敗 = <strong className="text-red-400">重啟</strong>（解決死鎖）｜readiness 失敗 = <strong className="text-amber-400">暫時不給流量</strong>（不重啟，等恢復）</p>
          <p className="text-slate-400 text-xs mt-1">Docker 對照：docker run --health-cmd 對應 liveness 的 exec 方式。Docker 沒有 readiness 概念。</p>
        </div>
      </div>
    ),
    code: `# livenessProbe 範例（httpGet）
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 15   # 等 15 秒再開始
  periodSeconds: 10         # 每 10 秒檢查
  failureThreshold: 3       # 連續 3 次失敗才重啟

# readinessProbe 範例（httpGet）
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3

# livenessProbe 範例（exec）
livenessProbe:
  exec:
    command:
      - cat
      - /tmp/healthy     # 檔案存在 = 健康
  initialDelaySeconds: 5
  periodSeconds: 5`,
    notes: `【① 課程內容】
Running ≠ 正常：容器跑著但應用程式可能死鎖、還在啟動、記憶體洩漏無回應。K8s 用 Probe 主動檢查。

三種 Probe：
- livenessProbe：你還活著嗎？失敗 → 重啟容器（RESTARTS +1）
- readinessProbe：準備好接流量了嗎？失敗 → 從 Service Endpoints 移除（不重啟）
- startupProbe：啟動完成了嗎？啟動期間保護 liveness 不誤判

三種檢查方式：httpGet（HTTP 2xx/3xx）、exec（exit 0）、tcpSocket（TCP 連得上）

重要參數：initialDelaySeconds（等幾秒才開始）、periodSeconds（檢查間隔）、failureThreshold（連續幾次失敗才觸發）

liveness vs readiness 關鍵差別：
- liveness 失敗 → 重啟（解決死鎖/卡死）
- readiness 失敗 → 暫時不給流量（不重啟，適合啟動中或暫時忙碌）
- 兩個可以同時設，職責不同

Docker 對照：docker run --health-cmd 對應 liveness exec。Docker 沒有 readiness 概念。

【② 指令講解】
（本張為概念說明，操作在下一張）

【③④ 題目 + 解答】
（無）
[▶ 下一頁]`,
  },

  // ── Bonus-2（2/2）：Probe 實作 + 失敗觀察 ──
  {
    title: 'Bonus 實作：Probe 失敗觀察',
    subtitle: 'readiness 失敗 → READY 0/1 | liveness 失敗 → RESTARTS 飆升',
    section: 'Bonus：進階 YAML',
    duration: '13',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>apply 正常的 probe-demo（liveness + readiness 都設 /）</li>
            <li><code className="text-green-400">kubectl describe pod</code> 看 Liveness / Readiness 欄位</li>
            <li>改 readinessProbe path 為 /not-exist &rarr; 觀察 READY 0/1</li>
            <li>改 livenessProbe 為 exit 1 &rarr; 觀察 RESTARTS 飆升</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/30 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2 text-sm">readiness 失敗 — 不接流量但不重啟</p>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;STATUS &nbsp;&nbsp;RESTARTS</p>
            <p className="text-amber-300">probe-demo-xxx-yyy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0/1 &nbsp;&nbsp;Running &nbsp;0</p>
          </div>
          <p className="text-slate-400 text-xs mt-1">READY 0/1 + STATUS Running = readiness 失敗，Pod 從 Endpoints 移除</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-2 text-sm">liveness 失敗 — 不斷重啟</p>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;STATUS &nbsp;&nbsp;RESTARTS</p>
            <p className="text-slate-300">probe-demo-xxx-yyy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;Running &nbsp;0</p>
            <p className="text-red-300">probe-demo-xxx-yyy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;Running &nbsp;1 &nbsp;&larr; RESTARTS!</p>
            <p className="text-red-300">probe-demo-xxx-yyy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1 &nbsp;&nbsp;Running &nbsp;2</p>
          </div>
          <p className="text-slate-400 text-xs mt-1">Events 會顯示 "Liveness probe failed" + "Container will be restarted"</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">③④ 快問快答</p>
          <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
            <li>READY 0/1 + Running = ? &rarr; readiness 失敗，不接流量但沒重啟</li>
            <li>Spring Boot 啟動 60 秒但 initialDelaySeconds 只設 10 &rarr; 永遠起不來（一直被 liveness Kill）</li>
            <li>liveness 和 readiness 都失敗 &rarr; liveness 先觸發重啟，readiness 同時移出 Endpoints</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 正常版：liveness + readiness 都檢查 nginx 首頁
kubectl apply -f probe-demo.yaml
kubectl describe pod <pod-name>
# → Liveness: http-get http://:80/ delay=10s period=10s
# → Readiness: http-get http://:80/ delay=5s period=5s

# readiness 失敗實驗：改 path 為 /not-exist（404）
kubectl apply -f probe-demo-broken.yaml
kubectl get pods -w
# → READY 0/1，STATUS Running，RESTARTS 0

# liveness 失敗實驗：exec exit 1（永遠失敗）
kubectl apply -f probe-demo-liveness-fail.yaml
kubectl get pods -w
# → RESTARTS 不斷增加 → CrashLoopBackOff

# 清理
kubectl delete deployment probe-demo`,
    notes: `【① 課程內容】
本張為 Probe 實作：部署帶 Probe 的 Deployment，觀察正常和失敗時的行為差異。

【② 指令講解】
部署正常版：kubectl apply -f probe-demo.yaml
→ kubectl describe pod 看 Liveness / Readiness 欄位
→ 打完要看：Liveness: http-get http://:80/ delay=10s；Readiness: http-get http://:80/ delay=5s

readiness 失敗實驗：kubectl apply -f probe-demo-broken.yaml
→ kubectl get pods -w
→ 打完要看：READY 0/1，STATUS Running，RESTARTS 0
→ 重點：Pod 還活著但不接流量，Service Endpoints 變空

liveness 失敗實驗：kubectl apply -f probe-demo-liveness-fail.yaml
→ kubectl get pods -w
→ 打完要看：等約 30 秒後 RESTARTS 開始增加
→ kubectl describe pod | grep Events → 看到 "Liveness probe failed" + "Container will be restarted"

清理：kubectl delete deployment probe-demo

【③④ 題目 + 解答】
Q1：liveness 和 readiness 同時設定，各自失敗時有什麼不同？
A1：liveness 失敗 → 重啟容器（RESTARTS +1）；readiness 失敗 → 從 Endpoints 移除（不重啟）

Q2：Spring Boot 啟動要 60 秒，livenessProbe initialDelaySeconds 只設 10，會怎樣？
A2：應用還在啟動 → liveness 失敗 → 重啟 → 又在啟動 → 又失敗 → CrashLoopBackOff 永遠起不來。解法：initialDelaySeconds 設 70+ 或用 startupProbe。

Q3：READY 0/1 + STATUS Running 代表什麼？對 Service 有什麼影響？
A3：readiness 失敗，Pod 從 Endpoints 移除，Service 不轉發流量到這個 Pod，但不影響其他健康 Pod。

[▶ Bonus 結束]`,
  },

]