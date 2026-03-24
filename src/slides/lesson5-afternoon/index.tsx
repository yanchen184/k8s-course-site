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
  // Loop 4：ClusterIP Service（5-12, 5-13, 5-14）
  // ============================================================

  // ── 5-12 概念（1/2）：Pod IP 三大問題 + Service 解法 ──
  {
    title: 'Pod IP 三大問題 → Service 解法',
    subtitle: 'IP 會變、流量沒分散、外面連不到',
    section: 'Loop 4：ClusterIP Service',
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
    notes: `歡迎回來，下午的第一個主題是 Service。

上午我們學完了 Deployment 的三大能力：擴縮容、滾動更新、自我修復。Deployment 把 Pod 管得服服貼貼的，你說要三個就三個，掛了自動補，更新不停機。

但是現在有一個問題。這些 Pod 跑起來了，各自有各自的 IP。你用 kubectl get pods -o wide 可以看到每個 Pod 的 IP，像 10.42.0.15、10.42.1.8、10.42.2.12 之類的。

問題一：這些 IP 會變。上午我們做了自我修復的實驗，刪掉一個 Pod，新的 Pod 會拿到一個全新的 IP。如果你的前端 Pod 把後端 Pod 的 IP 寫死在設定裡，比如寫 API_HOST 等於 10.42.0.15，結果那個 Pod 掛了重建，IP 變成 10.42.0.20 了。前端還在連 10.42.0.15，連不上，服務斷了。

問題二：你有三個 Pod，使用者到底該連哪一個？如果三個使用者全部連同一個 Pod，另外兩個 Pod 閒在那邊，那你擴容的意義在哪裡？你需要一個東西幫你把流量分散到三個 Pod 上。

問題三：Pod 的 IP 是叢集內部的虛擬 IP。你在自己的電腦上打開瀏覽器，輸入 10.42.0.15，是連不上的。這個 IP 只有在叢集裡面的 Pod 才能存取。

三個問題：IP 會變、流量沒分散、外面連不到。K8s 的解決方案就是 Service。

第四堂課我們在全貌介紹的時候已經提過 Service 的概念了。當時說 Service 是 Pod 前面的穩定代理人，不管後面的 Pod 怎麼換，Service 的地址不變。今天我們來實際建一個。

Service 有三種類型：ClusterIP、NodePort、LoadBalancer。我們先從 ClusterIP 開始，它是預設類型，也是最常用的。 [▶ 下一頁]`,
  },

  // ── 5-12 概念（2/2）：ClusterIP 原理 + Service YAML ──
  {
    title: 'ClusterIP Service 原理',
    subtitle: 'selector 對應 Pod Labels + port / targetPort',
    section: 'Loop 4：ClusterIP Service',
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
    notes: `ClusterIP 會給你一個叢集內部的虛擬 IP。這個 IP 不會變，只要 Service 存在，IP 就不變。叢集裡面的任何 Pod 都可以用這個 IP 來存取你的服務。Service 會自動把流量負載均衡到後面的 Pod 上，你不用操心該連哪一個。

那 Service 怎麼知道要把流量轉給哪些 Pod？答案就是上午學的 Labels 和 Selector。

你在 Service 的 YAML 裡面設定 selector，比如 app: nginx。Service 就會去找所有有 app: nginx 標籤的 Pod，把它們加進轉發清單。這就是為什麼上午要先教 Labels 和 Selector，因為 Service 也靠這個機制來找 Pod。

我們來看 Service 的 YAML 怎麼寫。

apiVersion 是 v1，跟 Pod 一樣。kind 是 Service。metadata 裡面的 name 很重要，等一下 DNS 會用到這個名字。

spec 裡面有三個重點。

第一個是 type: ClusterIP。這是預設值，你不寫也行，K8s 會自動幫你設成 ClusterIP。

第二個是 selector。這裡寫 app: nginx，意思是「我這個 Service 要服務所有 label 有 app=nginx 的 Pod」。這個值必須跟 Deployment template 裡 Pod 的 labels 一致。上午的黃金法則又出現了：Deployment 的 selector、Pod 的 labels、Service 的 selector，三者要對上。

第三個是 ports。ports 裡面有兩個欄位：port 和 targetPort。port 是 Service 自己監聽的 Port，也就是別人連 Service 的時候用的 Port。targetPort 是 Service 要轉發到 Pod 的哪個 Port。通常這兩個一樣，都寫 80。但如果你想讓別人用 8080 連 Service、Service 再轉到 Pod 的 80，也可以。用 Docker 來對照，docker run -p 8080:80，左邊的 8080 就像 port，右邊的 80 就像 targetPort。

Service 建好之後，K8s 會在背後維護一個東西叫 Endpoints。Endpoints 就是 Service 對應的 Pod IP 列表。你用 kubectl get endpoints 加上 Service 名字就能看到。比如你的 nginx Service 後面有三個 Pod，Endpoints 就會列出三個 IP 加上 Port。Pod 被刪了重建，Endpoints 會自動更新。Pod 數量 scale 上去了，Endpoints 也會自動增加。你完全不需要手動操作。

還有一個非常好用的功能：DNS。K8s 內建了 CoreDNS 服務，你建一個 Service 之後，K8s 會自動在 DNS 裡面註冊一筆記錄。Service 的名字就是 DNS 名字。比如你的 Service 叫 nginx-svc，其他 Pod 就可以直接用 http://nginx-svc 來連，不需要知道 Service 的 IP 是多少。

整理一下。ClusterIP Service 解決了三個問題：IP 會變的問題，Service 的 IP 不會變。流量不知道分給誰的問題，Service 自動負載均衡。用 IP 太麻煩的問題，Service 有 DNS 名字。

但是 ClusterIP 有一個限制：它是叢集內部的 IP，只有叢集裡面的 Pod 能連。你在外面的瀏覽器打開 Service 的 IP，還是連不上。那外面的人怎麼辦？這個問題留到 Loop 5 用 NodePort 來解決。我們先把 ClusterIP 搞熟。 [▶ 下一頁]`,
  },

  // ── 5-13 實作（1/2）：ClusterIP 建立 + 驗證 ──
  {
    title: 'Lab：建立 ClusterIP Service',
    subtitle: 'apply → get svc → get endpoints → curl 驗證',
    section: 'Loop 4：ClusterIP Service',
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
    notes: `好，來建我們的第一個 Service。

先確認 Deployment 還在跑。kubectl get deployments，看到 nginx-deploy 的 READY 是 3/3。kubectl get pods -o wide，三個 Pod 分散在不同 Node 上，記下它們的 IP。

現在我們來寫 Service 的 YAML 檔案。建一個檔案叫 service-clusterip.yaml，內容是這樣的。

apiVersion: v1，Service 用 v1。kind: Service。metadata 的 name 寫 nginx-svc。spec 裡面，type 寫 ClusterIP，這行其實可以省略因為 ClusterIP 是預設值，但我建議寫出來讓 YAML 更清楚。selector 寫 app: nginx，跟 Deployment template 裡 Pod 的 labels 一致。ports 裡面 port 寫 80，targetPort 也寫 80。

檔案寫好了，apply 它。

kubectl apply -f service-clusterip.yaml。

看到 service/nginx-svc created，成功了。

來看看 Service 的狀態。kubectl get svc，svc 是 service 的縮寫。

你會看到兩個 Service。第一個是 kubernetes，這是 K8s 系統自帶的，不用管。第二個就是我們剛建的 nginx-svc，TYPE 是 ClusterIP，CLUSTER-IP 欄位有一個 IP 地址，比如 10.43.0.150 之類的。PORT(S) 是 80/TCP。

這個 10.43.0.150 就是 Service 的 ClusterIP，它不會變。只要 Service 存在，這個 IP 就一直是這個。

接下來看 Endpoints。kubectl get endpoints nginx-svc。

你會看到 ENDPOINTS 欄位列出了三個 IP 加上 Port，比如 10.42.0.15:80, 10.42.1.8:80, 10.42.2.12:80。這三個就是 Service 後面的三個 Pod 的 IP。你可以對照一下 kubectl get pods -o wide，會發現 IP 是對得上的。

好，ClusterIP 只能在叢集內部連。我們要怎麼驗證呢？建一個臨時的 Pod 進去測試。

執行 kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh。

這行指令做了幾件事：用 curlimages/curl 這個輕量的 image 建一個臨時 Pod，--rm 表示離開後自動刪除，-it 進入互動模式，--restart=Never 表示不要自動重啟，最後的 sh 是進入 shell。

進去之後，用 Service 名字連線：curl http://nginx-svc。

你應該會看到 nginx 的歡迎頁面，那段很熟悉的 Welcome to nginx 的 HTML。

再多 curl 幾次，每次都能成功。你會注意到不管你 curl 多少次，連的都是 nginx-svc 這個名字，不需要知道任何 Pod 的 IP。Service 在背後幫你做了負載均衡，把請求分散到三個 Pod 上。

試試看完整的 DNS 名字：curl http://nginx-svc.default.svc.cluster.local。一樣可以連到。這個格式是 Service名字.Namespace.svc.cluster.local。因為我們在 default Namespace 裡，所以中間是 default。在同一個 Namespace 裡面，你直接用 nginx-svc 就夠了，不需要打那麼長。

輸入 exit 離開，臨時 Pod 會自動刪除。

最後做一個重要的驗證。我們刪掉一個 Pod，看 Endpoints 會不會自動更新。

先看一下目前的 endpoints。kubectl get endpoints nginx-svc，記下三個 IP。

然後刪掉一個 Pod。kubectl delete pod 加上任一 Pod 的名字。

等幾秒鐘，再看 endpoints。kubectl get endpoints nginx-svc。

你會發現 Endpoints 裡的 IP 列表變了。被刪掉的那個 Pod 的 IP 不見了，取而代之的是新建的 Pod 的 IP。Service 自動偵測到 Pod 的變化，更新了 Endpoints。整個過程你不需要做任何事。

這就是 Service 的威力。Pod 可以隨便掛、隨便重建，IP 怎麼變都無所謂，Service 的地址永遠不變，Endpoints 自動更新，流量永遠能到達健康的 Pod。 [▶ 下一頁]`,
  },

  // ── 5-13 學員實作 ──
  {
    title: '學員實作：ClusterIP Service',
    subtitle: 'Loop 4 練習題',
    section: 'Loop 4：ClusterIP Service',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：httpd Deployment + ClusterIP Service</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 httpd Deployment：<code className="text-green-400">image: httpd</code>，replicas: 2</li>
            <li>建 ClusterIP Service：selector 跟 Pod labels 一致</li>
            <li>用 busybox curl 進去連 <code className="text-green-400">httpd-svc</code></li>
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
    notes: `學員實作時間。必做：自己建一個 httpd 的 Deployment 加 ClusterIP Service。Deployment 用 httpd 這個 image，replicas 設 2。Service 的 selector 要跟 Deployment 的 Pod labels 一致。然後用 busybox curl 進去連 httpd-svc，你應該會看到 It works! 這個 httpd 的預設頁面。挑戰題：kubectl get endpoints 觀察，然後 scale Deployment 從 2 改成 4，再看 endpoints 是不是跟著變多了。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-14 回頭操作 ──
  {
    title: 'ClusterIP 排錯 + 常見坑',
    subtitle: '回頭操作 Loop 4',
    section: 'Loop 4：ClusterIP Service',
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
            <li>busybox curl <code className="text-green-400">http://nginx-svc</code> -- nginx 歡迎頁</li>
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
    notes: `來帶大家走一遍 ClusterIP Service 的操作。

首先確認 Deployment 在跑，kubectl get deployments，READY 3/3。

建立 Service，kubectl apply -f service-clusterip.yaml。

查看 Service，kubectl get svc，看到 nginx-svc 的 TYPE 是 ClusterIP。

查看 Endpoints，kubectl get endpoints nginx-svc，看到三個 Pod 的 IP。

驗證連線，kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh，進去之後 curl http://nginx-svc，看到 nginx 歡迎頁。exit 離開。

這就是 ClusterIP Service 的完整流程。

現在講一個非常常見的坑。你建了 Service，但 curl 連不到，一直 timeout 或者 connection refused。怎麼排錯？

第一步，kubectl get endpoints 加上 Service 名字。如果你看到 ENDPOINTS 那一欄是空的，沒有列出任何 IP，那問題八成是 selector 沒對上。

什麼意思？就是你 Service 的 selector 寫的標籤，跟 Pod 實際的標籤不一致。比如 Service 的 selector 寫 app: nginx，但你的 Pod 的 label 是 app: my-nginx，差一個字母，Service 就找不到 Pod，Endpoints 就是空的。

排錯方式很簡單。kubectl describe svc 加上 Service 名字，看 Selector 那一行，確認它的值。然後 kubectl get pods --show-labels，確認 Pod 的 labels。兩邊對一下，看哪裡不一樣。

還有一個常見的錯誤是 targetPort 寫錯了。Service 可以連上 Pod，但 Pod 裡面的容器不是監聽那個 Port。比如你的容器監聽 8080，但 targetPort 寫了 80。curl 會拿到 connection refused。

記住這個排錯流程：連不上 → 先看 endpoints 有沒有 IP → 沒有就檢查 selector → 有的話就檢查 targetPort。這個流程可以解決百分之九十的 Service 問題。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 5：NodePort + 三種比較（5-15, 5-16, 5-17）
  // ============================================================

  // ── 5-15 概念（1/2）：NodePort 原理 ──
  {
    title: 'NodePort -- 讓外面的人連進來',
    subtitle: '在每個 Node 上開 Port（30000-32767）',
    section: 'Loop 5：NodePort + 三種比較',
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
    notes: `上一個 Loop 我們學了 ClusterIP Service。ClusterIP 給了我們一個叢集內部的穩定地址，叢集裡面的 Pod 可以用 Service 名字互相找到對方，流量自動負載均衡到後面的 Pod。問題解決了？解決了一半。

叢集裡面的 Pod 互相連通了，但你的使用者不在叢集裡面。使用者在外面，他們打開瀏覽器，輸入你的服務地址，想看到你的網站。ClusterIP 的 IP 是叢集內部的虛擬 IP，只有叢集裡面的 Pod 能連到，外面的電腦完全連不上。

那我們需要一種方式，讓叢集外面的人也能連到 Service。

第一個方案是 NodePort。

NodePort 的原理非常簡單。它在叢集裡每一個 Node 上都開一個 Port。這個 Port 的範圍是 30000 到 32767。外面的人用 Node 的 IP 加上這個 Port 就能連進來。

舉個例子。你有三個 Node，IP 分別是 192.168.64.2、192.168.64.3、192.168.64.4。你建了一個 NodePort Service，分配到的 Port 是 30080。那外面的人用 192.168.64.2:30080 可以連到你的服務，用 192.168.64.3:30080 也可以，用 192.168.64.4:30080 也可以。三個 Node 都行，因為 NodePort 在每個 Node 上都開了同一個 Port。

流量的路線是這樣的：外部請求到達 Node 的 30080 Port，Node 上的 kube-proxy 接收到之後，轉發給 Service，Service 再負載均衡到後面的 Pod。Pod 不一定跑在你連的那個 Node 上，但沒關係，kube-proxy 會幫你轉到正確的 Pod 上，不管 Pod 在哪個 Node。

來看 NodePort Service 的 YAML。跟 ClusterIP 的差別不大，主要改兩個地方。

第一，type 從 ClusterIP 改成 NodePort。

第二，ports 裡面多了一個 nodePort 欄位，值是 30080。你可以自己指定一個 30000 到 32767 之間的數字，也可以不寫讓 K8s 隨機分配一個。

現在有三個 Port，容易搞混，我幫大家理清一下。

最外面是 nodePort，就是 Node 上開的那個 Port，30080。這是外面的人用的，他們用 Node IP 加 nodePort 連進來。

中間是 port，就是 Service 自己監聽的 Port，80。這是叢集內部用的，其他 Pod 用 Service 名字加 port 連。

最裡面是 targetPort，就是 Pod 上容器監聽的 Port，80。這是最終接收請求的地方。

流量路線：外部到 nodePort 30080，轉到 Service 的 port 80，再轉到 Pod 的 targetPort 80。

用 Docker 來對照。docker run -p 30080:80 nginx，左邊的 30080 就像 nodePort，右邊的 80 就像 targetPort。差別在於 Docker 只在一台機器上開 Port，K8s 的 NodePort 在每個 Node 上都開。所以你連任何一個 Node 都能存取到服務，這比 Docker 靈活很多。 [▶ 下一頁]`,
  },

  // ── 5-15 概念（2/2）：LoadBalancer + 三種比較 ──
  {
    title: '三種 Service 類型比較',
    subtitle: 'ClusterIP vs NodePort vs LoadBalancer',
    section: 'Loop 5：NodePort + 三種比較',
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
    notes: `NodePort 適合什麼場景？開發測試環境很好用。你想快速讓別人連到你的服務，不想搞什麼負載均衡器或域名設定，直接 NodePort 一開，給對方一個 IP 加 Port 就能連了。簡單粗暴但有效。

但 NodePort 也有限制。第一，Port 範圍只有 30000 到 32767，一千多個。服務多了可能不夠用。第二，讓使用者記住 IP 加 Port 這種地址太不專業了。你能想像告訴你的客戶「請打開 192.168.64.2:30080」嗎？他們可能以為你在開玩笑。

生產環境一般不用 NodePort，而是用 LoadBalancer 或 Ingress。

LoadBalancer 是第三種 Service 類型。它會向雲端服務商申請一個外部的負載均衡器。比如你在 AWS 上跑 K8s，建一個 LoadBalancer Service，AWS 會自動幫你建一個 ELB，分配一個公開的 IP 或域名。使用者直接用這個地址連，LoadBalancer 把流量分到你的 Node，再到 Service，再到 Pod。

LoadBalancer 的 YAML 更簡單，type 改成 LoadBalancer 就好了。但它只在雲端環境才有意義。在本地的 k3s 或 minikube 上，沒有真正的雲端負載均衡器，LoadBalancer Service 會一直卡在 Pending 狀態。k3s 有一個內建的 ServiceLB 可以模擬，但功能有限。

好，三種 Service 類型都講完了，我們用一個表來比較。

ClusterIP，存取範圍是叢集內部，適合微服務之間的溝通，比如 API 連資料庫。對照 Docker 的話就像 Docker Compose 的服務名稱 DNS。

NodePort，存取範圍是外部通過 Node IP 加 Port，適合開發測試或簡單的外部存取。對照 Docker 就像 docker run -p。

LoadBalancer，存取範圍是外部通過雲端負載均衡器，適合生產環境。對照 Docker 的話就是雲端的 ALB 或 ELB。

有一個重點：這三種是遞增關係。NodePort 包含了 ClusterIP 的所有功能。你建了一個 NodePort Service，它同時也有 ClusterIP。叢集內部可以用 ClusterIP 連，外部可以用 NodePort 連。LoadBalancer 包含了 NodePort 的所有功能。你建了一個 LoadBalancer Service，它同時有 ClusterIP 和 NodePort。

怎麼選？很簡單。叢集內部的服務用 ClusterIP，這是預設的，不用多想。測試環境想從外面連就用 NodePort。生產環境用 LoadBalancer，或者更常見的做法是用 Ingress。Ingress 不是 Service 類型，它是另外一個東西，坐在 Service 前面做 HTTP 路由。第六堂課會講。

好，概念講完了，接下來動手建 NodePort Service。 [▶ 下一頁]`,
  },

  // ── 5-16 實作（1/2）：NodePort 建立 + 外部驗證 ──
  {
    title: 'Lab：建立 NodePort Service',
    subtitle: 'apply → curl Node IP:30080 → 瀏覽器打開',
    section: 'Loop 5：NodePort + 三種比較',
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
    notes: `好，來動手建 NodePort Service。

先確認 nginx Deployment 還在跑，kubectl get deployments，READY 3/3。ClusterIP Service 也應該還在，kubectl get svc，看到 nginx-svc。

現在我們再建一個 NodePort Service。建一個檔案叫 service-nodeport.yaml。

apiVersion: v1，kind: Service，metadata 的 name 寫 nginx-nodeport。spec 裡面，type 寫 NodePort。selector 一樣是 app: nginx，跟前面的 ClusterIP Service 指向同一組 Pod。ports 裡面，port 寫 80，targetPort 寫 80，nodePort 寫 30080。

注意這裡我們同時有兩個 Service 指向同一個 Deployment 的 Pod，這完全沒問題。一個 Service 走叢集內部，一個 Service 走外部，各走各的路，互不影響。

好，apply 它。

kubectl apply -f service-nodeport.yaml。

看到 service/nginx-nodeport created。

查看 Service 列表。kubectl get svc。

你會看到三個 Service。kubernetes 是系統的，nginx-svc 是我們的 ClusterIP，nginx-nodeport 是我們剛建的 NodePort。注意看 nginx-nodeport 的 TYPE 是 NodePort，PORT(S) 欄位顯示 80:30080/TCP，意思是 Service 的 80 Port 映射到 Node 的 30080 Port。

接下來，我們從叢集外面來連。

首先要拿到 Node 的 IP。如果你用 k3s 加 multipass，執行 multipass list，會看到每個虛擬機的 IP。或者用 kubectl get nodes -o wide，看 INTERNAL-IP 那一欄。

假設你的某個 Node IP 是 192.168.64.3。在你自己的電腦上（不是在叢集裡面），執行 curl http://192.168.64.3:30080。

你應該會看到 nginx 的歡迎頁面。Welcome to nginx。太好了，我們成功從叢集外面連到了叢集裡面的 Pod。

NodePort 的一個特點是每個 Node 都開了同一個 Port。所以試試另一個 Node 的 IP，比如 192.168.64.4，curl http://192.168.64.4:30080。一樣可以連到。甚至你連 master Node 的 IP 也可以，雖然 Pod 不一定跑在 master 上，但 kube-proxy 會幫你把流量轉到正確的 Pod。

你也可以在瀏覽器裡打開 http://192.168.64.3:30080，會看到 nginx 的歡迎頁面。這跟第四堂課用 port-forward 不同，port-forward 是臨時的，你關掉終端機就斷了。NodePort 是永久的，只要 Service 存在就一直有效。 [▶ 下一頁]`,
  },

  // ── 5-16 學員實作 ──
  {
    title: '學員實作：NodePort Service',
    subtitle: 'Loop 5 練習題',
    section: 'Loop 5：NodePort + 三種比較',
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
            <li>從 busybox Pod 用 <code className="text-green-400">nginx-svc</code> 連（走 ClusterIP）</li>
            <li>從外面用 <code className="text-green-400">Node-IP:30080</code> 連（走 NodePort）</li>
            <li>驗證兩條路都通</li>
          </ul>
        </div>
      </div>
    ),
    notes: `學員實作時間。必做：自己建一個 NodePort Service 指向 nginx Deployment，從你的電腦 curl Node IP 加 NodePort 看到 nginx 歡迎頁。記得要先查 Node 的 IP。挑戰題：同時保留 ClusterIP 和 NodePort 兩個 Service 指向同一個 Deployment，從 busybox Pod 裡面用 nginx-svc 連（走 ClusterIP），同時從外面用 Node IP 加 NodePort 連，驗證兩條路都通。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-17 回頭操作 ──
  {
    title: 'NodePort 排錯 + Loop 4-5 小結',
    subtitle: '回頭操作 Loop 5',
    section: 'Loop 5：NodePort + 三種比較',
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
    notes: `來帶大家走一遍 NodePort 的操作。

確認 Deployment 在跑，kubectl get deployments，READY 3/3。

建立 NodePort Service，kubectl apply -f service-nodeport.yaml。

查看 Service，kubectl get svc，看到 nginx-nodeport 的 TYPE 是 NodePort，PORT(S) 是 80:30080/TCP。

拿到 Node IP，kubectl get nodes -o wide，看 INTERNAL-IP。

從外面 curl，curl http:// 加上 Node IP 冒號 30080。看到 nginx 歡迎頁就成功了。

如果你 curl 之後一直沒回應或者 connection refused，檢查兩件事。

第一，確認你用的是 Node 的 IP，不是 Pod 的 IP，也不是 Service 的 ClusterIP。Pod IP 和 ClusterIP 都是叢集內部的，外面連不到。你要用 kubectl get nodes -o wide 看到的那個 INTERNAL-IP。

第二，如果你的環境有防火牆（比如雲端的安全群組或本機的 iptables），確認 30080 Port 有開放。防火牆擋住的話，curl 會一直卡住沒回應。k3s 用 multipass 的話通常不會有這個問題，但如果你用的是雲端虛擬機，記得開放安全群組。

好，三種 Service 做個一句話回顧。

ClusterIP：叢集內部的穩定入口，微服務之間互相連用這個。

NodePort：在每個 Node 上開 Port，讓外面的人連得到，開發測試用這個。

LoadBalancer：向雲端要一個負載均衡器，生產環境用這個，或者用 Ingress。

下午我們用了兩個 Loop 學了 Service。Loop 4 學了 ClusterIP，解決了叢集內部 Pod 之間互連的問題。Pod IP 會變沒關係，Service 的地址不變。用 Service 名字就能連，DNS 自動解析。Loop 5 學了 NodePort，解決了叢集外部存取的問題。在 Node 上開一個 Port，外面的使用者終於能看到你的服務了。

加上上午的三個 Loop，今天一共學了五個 Loop。從擴縮容、滾動更新、自我修復，到 ClusterIP、NodePort。一條因果鏈下來：Deployment 管好了 Pod，但外面連不到，所以需要 Service。Service 的 ClusterIP 解決了叢集內部，NodePort 解決了外部。每一步都是上一步沒解決的問題引出來的。

下一個 Loop 我們會學 DNS 和 Namespace。DNS 讓你用名字找服務，Namespace 讓你隔離不同的環境。繼續沿著這條因果鏈往下走。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 6：DNS + Namespace（5-18, 5-19, 5-20）
  // ============================================================

  // ── 5-18 概念（1/2）：DNS 服務發現 ──
  {
    title: 'DNS 服務發現 -- 用名字找服務',
    subtitle: 'CoreDNS 自動註冊 Service DNS',
    section: 'Loop 6：DNS + Namespace',
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
    notes: `上一個 Loop 我們把三種 Service 類型都學完了。ClusterIP 讓叢集內部的 Pod 互相連，NodePort 讓外面的使用者連進來，LoadBalancer 是雲端生產環境用的。到這裡，你的服務不管是對內還是對外，都有穩定的入口了。

但是我要問大家一個問題。你在叢集內部用 ClusterIP 連其他服務的時候，你是怎麼連的？你是不是要先 kubectl get svc 查到 ClusterIP 的 IP，比如 10.43.0.150，然後在你的程式碼裡面寫 API_HOST 等於 10.43.0.150？

你覺得這樣合理嗎？

想想看，ClusterIP 的 IP 雖然不會像 Pod IP 那樣隨便變，但如果你把 Service 刪了重建，IP 就會變。而且你看看那個 IP，10.43.0.150，你背得起來嗎？你的團隊有十幾個微服務，每個都有一個 ClusterIP，你要記十幾個 IP？這跟用電話號碼一樣，你不會去背每個朋友的手機號碼，你會存到通訊錄裡面用名字找。

那在 K8s 裡面，這個「通訊錄」就是 DNS。

其實我們之前已經偷偷用過了。Loop 4 的 ClusterIP 實作裡面，我們在 busybox Pod 裡面 curl http://nginx-svc，直接用 Service 的名字就能連到。當時我提了一句是 CoreDNS 在幫忙，但沒有展開。今天正式來講清楚。

K8s 叢集裡面內建了一個 DNS 服務叫做 CoreDNS。你在 kube-system 這個 Namespace 裡面可以看到它，kubectl get pods -n kube-system，會有一兩個叫 coredns 的 Pod。

CoreDNS 做的事情非常簡單：你每建一個 Service，CoreDNS 就自動註冊一筆 DNS 記錄。Service 叫什麼名字，DNS 就叫什麼名字。比如你建了一個 Service 叫 nginx-svc，CoreDNS 就會記住「nginx-svc 對應 10.43.0.150」。任何 Pod 在叢集裡面做 DNS 查詢 nginx-svc，CoreDNS 就回答 10.43.0.150。

那 Pod 怎麼知道要找 CoreDNS？K8s 在建每個 Pod 的時候，都會自動設定 Pod 裡面的 /etc/resolv.conf，把 DNS server 指向 CoreDNS 的地址。所以你在 Pod 裡面用任何工具做 DNS 查詢，像 curl、wget、nslookup，都會自動走 CoreDNS。你完全不用做任何設定。

好，DNS 名字有三種寫法。

最短的寫法就是 Service 名字本身，比如 nginx-svc。這個只在同一個 Namespace 裡面才有效。因為不同的 Namespace 裡面可能有同名的 Service。

完整的 DNS 名字格式是：Service 名字，點，Namespace 名字，點，svc，點，cluster.local。比如 nginx-svc.default.svc.cluster.local。拆開來看，nginx-svc 是服務名，default 是 Namespace 名，svc 和 cluster.local 是固定的後綴。

如果你要跨 Namespace 連線，只需要寫到 Namespace 就行了，比如 nginx-svc.dev。K8s 會自動幫你補上後面的 svc.cluster.local。 [▶ 下一頁]`,
  },

  // ── 5-18 概念（2/2）：Namespace ──
  {
    title: 'Namespace -- 叢集裡的資料夾',
    subtitle: '隔離環境：dev / prod 同名不衝突',
    section: 'Loop 6：DNS + Namespace',
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
    notes: `等一下，我剛剛一直在提 Namespace，什麼是 Namespace？

Namespace 中文叫命名空間，你可以把它想成叢集裡面的「資料夾」。就像你電腦裡面用資料夾來分類檔案一樣，K8s 用 Namespace 來分類和隔離資源。

最常見的用法是用來隔離不同的環境。比如你的團隊有 dev 開發環境和 prod 正式環境。兩個環境都有 nginx-svc 這個 Service，但它們不能互相干擾。dev 的 nginx-svc 跑的可能是測試版本，prod 的跑的是正式版本。如果全部放在同一個 Namespace，名字就衝突了，K8s 不允許同一個 Namespace 有兩個同名的 Service。

有了 Namespace，你可以建一個 dev Namespace 和一個 prod Namespace，各自部署各自的。名字一樣但互不影響。dev 裡面的 nginx-svc 的 DNS 是 nginx-svc.dev，prod 裡面的是 nginx-svc.prod。完全隔開。

K8s 預設有幾個 Namespace。default 就是你什麼都沒指定的時候資源會待的地方。我們之前所有的操作，Pod、Deployment、Service，全部都是在 default 裡面。kube-system 放的是 K8s 自己的系統元件，像 API Server、CoreDNS、kube-proxy 這些。kube-public 和 kube-node-lease 基本上你不用管。

有一個重要的觀念：Namespace 只是邏輯上的分組，不是網路上的隔離。不同 Namespace 的 Pod 預設是可以互相連線的，只要你用完整的 DNS 名字。比如在 default 裡面的 Pod，可以用 curl nginx-svc.dev.svc.cluster.local 連到 dev 裡面的 Service。真正的網路隔離要靠 NetworkPolicy，第七堂課會教。

用 Docker 來對照的話，Docker 沒有 Namespace 這個概念。最接近的是不同目錄下的 Docker Compose 專案，不同的 project name 會建立不同的 network，服務名稱可以一樣。但 Docker Compose 的隔離靠的是不同的 Docker network，跟 K8s 的 Namespace 機制不太一樣。

好，概念講完了。總結一下：DNS 讓你用名字找服務，不用記 IP。Namespace 讓你隔離環境，同名服務不衝突。DNS 加上 Namespace，就構成了 K8s 的服務發現機制。同 Namespace 用短名字，跨 Namespace 帶上 Namespace 名字，就這麼簡單。

接下來我們動手驗證。 [▶ 下一頁]`,
  },

  // ── 5-19 實作（1/2）：DNS 驗證 + Namespace 建立 ──
  {
    title: 'Lab：DNS 驗證 + Namespace 實作',
    subtitle: 'nslookup + 建 dev Namespace + 跨 Namespace 連線',
    section: 'Loop 6：DNS + Namespace',
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
    notes: `好，來動手。我們分兩段做，先驗證 DNS，再玩 Namespace。

先確認 Deployment 和 ClusterIP Service 還在跑。kubectl get deployments，看到 nginx-deploy 的 READY 是 3/3。kubectl get svc，看到 nginx-svc 的 TYPE 是 ClusterIP。如果不在了，先 apply 把它們建回來。

第一段，驗證 DNS。建一個臨時的 busybox Pod 進去測試。

kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh

為什麼用 busybox？因為它裡面有 nslookup 和 wget 這些工具，很適合做 DNS 測試。

進去之後，先用 nslookup 看一下 DNS 解析。

nslookup nginx-svc

你會看到兩個重要的資訊。第一個是 Server，顯示一個 IP，那個就是 CoreDNS 的地址。第二個是 Name 和 Address，Name 會顯示完整的 FQDN nginx-svc.default.svc.cluster.local，Address 會顯示 Service 的 ClusterIP。

這就證明了 CoreDNS 在運作。你用 nginx-svc 這個短名字查詢，CoreDNS 幫你補上了完整的 default.svc.cluster.local 後綴，然後回傳了 Service 的 IP。

接下來用 wget 實際連一下。

wget -qO- http://nginx-svc

你會看到 nginx 的歡迎頁面。用名字就能連到，不需要知道任何 IP。

再試試完整的 FQDN 寫法。

wget -qO- http://nginx-svc.default.svc.cluster.local

一樣可以連到。這兩個寫法指向同一個 Service。

輸入 exit 離開。

好，DNS 驗證完了。接下來玩 Namespace。

第一步，建一個 dev Namespace。

kubectl create namespace dev

看一下所有的 Namespace。

kubectl get namespaces

你會看到除了 K8s 預設的那幾個，多了一個 dev。

第二步，在 dev 裡面部署 nginx。

kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev

注意 -n dev，這個參數指定資源要建在 dev Namespace 裡面。如果你忘了加 -n，資源就會建到 default 去，這是新手最常犯的錯。

看看 dev 裡面的 Pod。

kubectl get pods -n dev

你會看到一個 nginx Pod 在 dev 裡面跑著。

第三步，在 dev 裡面建一個 Service。

kubectl expose deployment nginx-deploy --port=80 -n dev

kubectl expose 是一個快速建 Service 的指令，它會自動幫你設定好 selector，不用寫 YAML。

現在我們來做跨 Namespace 存取。從 default 的 Pod 連到 dev 的 Service。

kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-deploy.dev.svc.cluster.local

注意 DNS 名字：nginx-deploy.dev.svc.cluster.local。Service 的名字是 nginx-deploy（因為 expose 預設用 Deployment 的名字），Namespace 是 dev。因為我們的 busybox 是在 default Namespace，所以不能只寫 nginx-deploy，要帶上 Namespace 名字。

你應該會看到 nginx 的歡迎頁面。太好了，跨 Namespace 連線成功。

最後看一下 dev 裡面所有的資源。

kubectl get all -n dev

你會看到 Deployment、ReplicaSet、Pod、Service 全部列出來。

如果你想一次看所有 Namespace 的 Pod，用 -A 參數。

kubectl get pods -A

你會看到 default 的 Pod、dev 的 Pod、kube-system 的 Pod，全部列在一起。 [▶ 下一頁]`,
  },

  // ── 5-19 學員實作 ──
  {
    title: '學員實作：DNS + Namespace',
    subtitle: 'Loop 6 練習題',
    section: 'Loop 6：DNS + Namespace',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：跨 Namespace 連線</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 dev Namespace</li>
            <li>在 dev 部署 httpd Deployment + Service</li>
            <li>從 default 的 busybox curl <code className="text-green-400">httpd-svc.dev.svc.cluster.local</code></li>
            <li>你應該看到 <code className="text-cyan-400">It works!</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：兩個 Namespace 不同版本</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>建 prod Namespace</li>
            <li>dev 部署 nginx 1.26，prod 部署 nginx 1.27</li>
            <li>從 busybox 分別 curl 兩個 Namespace 的 Service</li>
            <li>看 Server header 版本號是不是不一樣</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，學員實作時間。必做的部分：建一個 dev Namespace，在裡面部署 httpd 的 Deployment 加 Service，然後從 default 的 busybox 用 httpd-svc.dev.svc.cluster.local 連過去，你應該看到 It works! 的頁面。挑戰的部分：建一個 prod Namespace，在 dev 部署 nginx 1.26，在 prod 部署 nginx 1.27，然後從 busybox 分別 curl 兩個 Namespace 的 Service，看看回傳的 Server header 版本號是不是不一樣。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-20 回頭操作 ──
  {
    title: 'DNS + Namespace 常見坑',
    subtitle: '回頭操作 Loop 6',
    section: 'Loop 6：DNS + Namespace',
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
    notes: `來帶大家走一遍。

先驗證 DNS。建 busybox 臨時 Pod，kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh。進去之後 nslookup nginx-svc，看到 CoreDNS 回傳 Service 的 IP。wget -qO- http://nginx-svc，看到 nginx 歡迎頁。exit 離開。

再來 Namespace。kubectl create namespace dev。kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev。kubectl expose deployment nginx-deploy --port=80 -n dev。然後跨 Namespace 連線，kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-deploy.dev.svc.cluster.local。看到 nginx 歡迎頁就成功了。

講一個非常常見的坑。你在某個 Namespace 工作的時候，跑 kubectl 忘記加 -n 參數。資源就建到 default 去了。你在 dev 裡面一直找不到，其實它在 default 裡面。排錯方式很簡單：kubectl get pods -A 看一下所有 Namespace，找到資源在哪裡。

還有一個坑是跨 Namespace 的 DNS 格式寫錯。記住格式：Service名字.Namespace名字.svc.cluster.local。同 Namespace 用短名字就好，跨 Namespace 至少要帶到 Namespace 名字。

實作完了記得清理。kubectl delete namespace dev。刪除 Namespace 會把裡面所有的資源一起刪掉。如果你有建 prod 也一起刪了，kubectl delete namespace prod。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 7：DaemonSet + CronJob（5-21, 5-22, 5-23）
  // ============================================================

  // ── 5-21 概念（1/2）：DaemonSet ──
  {
    title: 'DaemonSet -- 每個 Node 都跑一份',
    subtitle: '日誌收集、監控 agent、kube-proxy',
    section: 'Loop 7：DaemonSet + CronJob',
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
        - name: collector
          image: busybox:1.36
          command: ["sh", "-c",
            "while true; do echo \\"[$(date)] collecting logs from $(hostname)\\"; sleep 30; done"]`,
    notes: `上一個 Loop 我們學了 DNS 和 Namespace。DNS 讓你用名字找服務，Namespace 讓你隔離不同的環境。這兩個加上之前的 Deployment 和 Service，你已經可以在 K8s 裡面部署一套完整的微服務架構了。

但 Deployment 有一個前提：你要告訴它「我要幾個副本」。三個、五個、十個，你指定 replicas，K8s 就幫你維持那個數量，然後由 Scheduler 決定 Pod 要放在哪些 Node 上。

今天我們來看兩個不一樣的場景。

第一個場景：每台 Node 都要跑一份。

什麼意思？想像你的叢集有三台機器。你想在每台機器上跑一個日誌收集的 agent，比如 Fluentd 或 Filebeat。它的工作是收集那台機器上所有容器的日誌，然後送到集中式的日誌平台。這種東西不是「我要 N 個」，而是「每台機器都要有一個」。你有三台 Node 就要三個，有十台就要十個。新加了一台 Node 進叢集，日誌收集也要自動在上面跑起來。有一台 Node 被移除了，那個 Pod 就跟著消失。

用 Deployment 能做到嗎？可以，但很彆扭。你要把 replicas 設成跟 Node 數量一樣，但 Scheduler 不保證每台 Node 剛好一個，它可能把兩個 Pod 放在同一台 Node 上。你還得設定一堆親和性規則來確保分散。太麻煩了。

K8s 有一個專門為這個場景設計的東西，叫 DaemonSet。Daemon 就是守護程序的意思，在 Linux 裡面 daemon 是一直在背景跑的服務。DaemonSet 確保每個 Node 上剛好跑一個 Pod，不多不少。

新 Node 加入叢集，DaemonSet 自動在上面建一個 Pod。Node 被移除，Pod 跟著消失。你完全不需要手動管理。

其實你已經見過 DaemonSet 了，只是你可能沒注意到。kube-proxy 就是用 DaemonSet 部署的。你跑 kubectl get daemonsets -n kube-system 看看，會看到 kube-proxy 或者 svclb 之類的 DaemonSet。它們在每個 Node 上都跑了一份，確保每台機器的網路功能正常。

DaemonSet 的 YAML 跟 Deployment 非常像。我來唸一下重點的差別。kind 從 Deployment 改成 DaemonSet。apiVersion 一樣是 apps/v1。spec 裡面沒有 replicas 這個欄位，因為 DaemonSet 的副本數不是你決定的，是由 Node 的數量決定的。其他部分，selector、template、containers，跟 Deployment 一模一樣。 [▶ 下一頁]`,
  },

  // ── 5-21 概念（2/2）：CronJob + 三者比較 ──
  {
    title: 'CronJob -- 定時跑任務',
    subtitle: 'schedule + jobTemplate + Completed 狀態',
    section: 'Loop 7：DaemonSet + CronJob',
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
  schedule: "*/1 * * * *"    # 每分鐘一次
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: hello
              image: busybox:1.36
              command: ["sh", "-c",
                "echo 'Hello from CronJob!' && date"]
          restartPolicy: Never`,
    notes: `好，第一個場景講完了。來看第二個場景：定時任務。

你有沒有這種需求：每天凌晨三點備份資料庫，每小時清理一次暫存檔，每五分鐘檢查一下某個 API 有沒有回應。

在 Docker 裡面你怎麼做？可能是在容器裡面裝 cron，或者在宿主機上跑 crontab，然後用 docker exec 去執行指令。這些做法都不太乾淨。

K8s 提供了 CronJob 來處理定時任務。CronJob 的名字很直覺，就是 Cron 加上 Job。Cron 是 Linux 的定時排程機制，Job 是 K8s 裡面「跑一次就結束」的任務。CronJob 就是把兩者結合在一起：按照你設定的時間表，定時建立 Job。

CronJob 的 YAML 有一個關鍵欄位叫 schedule，用 cron 語法。如果你用過 Linux 的 crontab，這個格式你一定認識。五個欄位：分鐘、小時、日期、月份、星期幾。比如 */1 * * * * 表示每分鐘執行一次，0 3 * * * 表示每天凌晨三點執行，*/5 * * * * 表示每五分鐘一次。

CronJob 的運作流程是這樣的。到了排程時間，CronJob Controller 建立一個 Job。Job 建立一個 Pod。Pod 跑你指定的 command。command 跑完了，Pod 狀態變成 Completed。下次排程時間到了，又建一個新的 Job 和 Pod。

所以你跑 kubectl get pods 的時候，CronJob 的 Pod 狀態不會是 Running，而是 Completed。很多新手看到 Completed 會以為出了問題，其實這是正常的，表示任務跑完了。

做一個對比。Deployment 的 Pod 是長期運行的，狀態是 Running，你希望它一直活著。CronJob 的 Pod 是短暫的，跑完就結束，狀態是 Completed。DaemonSet 的 Pod 跟 Deployment 一樣是長期 Running 的，只是副本數由 Node 數量決定。

整理一下三者的差異。Deployment 是你指定副本數，Pod 長期跑，用來跑無狀態的應用服務。DaemonSet 是每個 Node 一個，Pod 長期跑，用來跑節點級的服務像日誌收集和監控。CronJob 是定時觸發，Pod 跑完就結束，用來做備份和清理這類定時任務。

好，概念講完了，下一支影片我們來動手建 DaemonSet 和 CronJob。 [▶ 下一頁]`,
  },

  // ── 5-22 實作 ──
  {
    title: 'Lab：DaemonSet + CronJob 實作',
    subtitle: 'apply → 觀察 Pod 分佈 + Job 狀態',
    section: 'Loop 7：DaemonSet + CronJob',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">DaemonSet 操作</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f daemonset.yaml</code></li>
            <li><code className="text-green-400">kubectl get daemonsets</code> -- DESIRED = Node 數量</li>
            <li><code className="text-green-400">kubectl get pods -o wide -l app=log-collector</code> -- 每個 Node 一個</li>
            <li><code className="text-green-400">kubectl logs &lt;pod-name&gt;</code> -- 每 30 秒印一行</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">CronJob 操作</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f cronjob.yaml</code></li>
            <li><code className="text-green-400">kubectl get cronjobs</code> -- 看 SCHEDULE</li>
            <li>等一分鐘...</li>
            <li><code className="text-green-400">kubectl get jobs</code> -- 看到 Job，COMPLETIONS 1/1</li>
            <li><code className="text-green-400">kubectl get pods</code> -- 狀態是 <code className="text-cyan-400">Completed</code>（不是 Running！）</li>
            <li><code className="text-green-400">kubectl logs &lt;pod-name&gt;</code> -- Hello from CronJob! + 時間戳</li>
          </ol>
        </div>
      </div>
    ),
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
    section: 'Loop 7：DaemonSet + CronJob',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 DaemonSet -- 確認每個 Node 都有 Pod</li>
            <li>建 CronJob -- 等一兩分鐘看到 Job 和 Completed 的 Pod</li>
            <li>kubectl logs 看 CronJob 的輸出</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>改 CronJob schedule 為 <code className="text-green-400">"*/2 * * * *"</code>（每兩分鐘）</li>
            <li>觀察 Job 出現的間隔是不是真的變成兩分鐘</li>
          </ul>
        </div>
      </div>
    ),
    notes: `學員實作時間。必做：照著剛才的步驟建 DaemonSet，確認每個 Node 都有 Pod。建 CronJob，等一兩分鐘看到 Job 和 Completed 的 Pod，看一下 logs。挑戰：把 CronJob 的 schedule 改成 "*/2 * * * *"，每兩分鐘一次，觀察 Job 出現的間隔是不是真的變成兩分鐘。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-23 回頭操作 ──
  {
    title: 'DaemonSet + CronJob 常見坑',
    subtitle: '回頭操作 Loop 7',
    section: 'Loop 7：DaemonSet + CronJob',
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
    notes: `來帶大家走一遍。

DaemonSet 的部分。kubectl apply -f daemonset.yaml。kubectl get daemonsets，看到 DESIRED 和 READY 的數字等於你的 Node 數。kubectl get pods -o wide -l app=log-collector，每個 Node 上一個 Pod。

CronJob 的部分。kubectl apply -f cronjob.yaml。kubectl get cronjobs，看到 schedule。等一分鐘，kubectl get jobs，看到 Job。kubectl get pods，看到 Completed 的 Pod。kubectl logs 加上 Pod 名字，看到 Hello from CronJob 和時間戳。

兩個常見的坑。

第一，CronJob 的 Pod 狀態是 Completed，不是 Running。很多同學看到 Completed 會以為出問題了，想辦法去修。不需要修，這就是正常的。CronJob 的 Pod 就是跑完就結束。如果你看到的狀態是 Error 或 CrashLoopBackOff，那才是有問題。

第二，DaemonSet 的 YAML 不需要 replicas 欄位。如果你從 Deployment 的 YAML 複製過來改成 DaemonSet，記得把 replicas 那行刪掉。加了 replicas 不會報錯，但 K8s 會忽略它，可能造成混淆。

做完了記得清理。kubectl delete daemonset log-collector。kubectl delete cronjob hello-cron。CronJob 刪掉之後，它建的 Job 和 Pod 也會跟著被清理。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 8：綜合實作 + 總結（5-24, 5-25, 5-26）
  // ============================================================

  // ── 5-24 綜合實作引導（1/2）：Step 1-5 ──
  {
    title: '綜合實作：從零串完整鏈路',
    subtitle: 'Namespace → Deployment → ClusterIP → 驗證 → NodePort',
    section: 'Loop 8：綜合實作 + 總結',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">10 步驟完整鏈路（Step 1-5）</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li><code className="text-green-400">kubectl create namespace my-app</code></li>
            <li><code className="text-green-400">kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app</code></li>
            <li><code className="text-green-400">kubectl expose deployment nginx-deploy --port=80 -n my-app</code></li>
            <li>叢集內驗證：<code className="text-green-400">kubectl run test --image=busybox:1.36 --rm -it --restart=Never -n my-app -- wget -qO- http://nginx-deploy</code></li>
            <li>建 NodePort Service（YAML，nodePort: 30080）<code className="text-green-400">kubectl apply -f nodeport.yaml</code></li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">這就是最基本的 K8s 服務上線流程</p>
          <p className="text-slate-300 text-xs mt-1">真實工作場景中部署新服務大概就是這個順序</p>
        </div>
      </div>
    ),
    notes: `好，今天學了很多東西。從早上的 k3s 多節點、擴縮容、滾動更新、回滾、自我修復、Labels，到下午的 ClusterIP、NodePort、DNS、Namespace、DaemonSet、CronJob。一整天的內容。

現在我們要做一件事：把這些東西從零到一串起來。不是回顧，是真正的從頭到尾動手做一遍。為什麼？因為之前每個 Loop 都是單獨練一個功能，你可能知道每個功能怎麼用，但不一定知道它們怎麼組合在一起。

這個練習模擬的是一個最基本的 K8s 服務上線流程。在真實的工作場景中，你部署一個新服務大概就是這個順序。

Step 1，建 Namespace。

kubectl create namespace my-app

為什麼第一步是建 Namespace？因為你不會把東西直接丟到 default 裡面。真實的專案都會有自己的 Namespace。這是一個好習慣，跟 Docker Compose 你會建一個專案目錄一樣。

Step 2，建 Deployment。

kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app

在 my-app 裡面建一個 nginx 的 Deployment，三個副本。等幾秒鐘，看一下 Pod 跑起來了沒有。

kubectl get pods -o wide -n my-app

三個 Pod 分散在不同的 Node 上，全部 Running。

Step 3，建 ClusterIP Service。

kubectl expose deployment nginx-deploy --port=80 -n my-app

expose 指令預設建的就是 ClusterIP。

Step 4，從叢集內部驗證。

kubectl run test --image=busybox:1.36 --rm -it --restart=Never -n my-app -- wget -qO- http://nginx-deploy

注意我們的 busybox 也建在 my-app Namespace 裡面，所以可以用短名字 nginx-deploy 直接連。你應該看到 nginx 的歡迎頁面。叢集內部的連線沒問題了。

Step 5，建 NodePort Service，讓外面也能連。

這裡用 YAML 比較好，因為 expose 指令建 NodePort 的時候沒辦法指定 nodePort 的值。你可以建一個 nodeport.yaml：

apiVersion: v1，kind: Service，metadata 的 name 寫 nginx-nodeport，namespace 寫 my-app。spec 裡面 type: NodePort，selector: app: nginx-deploy，ports 裡面 port 80，targetPort 80，nodePort 30080。

kubectl apply -f nodeport.yaml [▶ 下一頁]`,
  },

  // ── 5-24 綜合實作引導（2/2）：Step 6-10 ──
  {
    title: '綜合實作：擴縮容 → 更新 → 回滾 → 清理',
    subtitle: 'Step 6-10：完成完整生命周期',
    section: 'Loop 8：綜合實作 + 總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">10 步驟完整鏈路（Step 6-10）</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside" start={6}>
            <li>外部驗證：<code className="text-green-400">curl http://&lt;Node-IP&gt;:30080</code></li>
            <li>擴縮容：<code className="text-green-400">kubectl scale deployment nginx-deploy --replicas=5 -n my-app</code> &rarr; 縮回 3</li>
            <li>滾動更新：<code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:1.28 -n my-app</code></li>
            <li>回滾：<code className="text-green-400">kubectl rollout undo deployment/nginx-deploy -n my-app</code></li>
            <li>清理：<code className="text-green-400">kubectl delete namespace my-app</code> -- 一行搞定</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">下堂課會加上</p>
          <div className="text-slate-300 text-xs mt-1 space-y-1">
            <p>Ingress -- 用域名路由，不用記 IP:Port</p>
            <p>ConfigMap -- 把設定從 Image 抽出來</p>
            <p>Secret -- 管密碼等敏感資訊</p>
            <p>PV / PVC -- 資料持久化</p>
          </div>
        </div>
      </div>
    ),
    notes: `Step 6，從外面驗證。

找到 Node 的 IP，curl http:// 加上 Node IP 冒號 30080。看到 nginx 歡迎頁面，外部存取也通了。

Step 7，擴縮容。

kubectl scale deployment nginx-deploy --replicas=5 -n my-app

kubectl get pods -n my-app，五個 Pod。

kubectl scale deployment nginx-deploy --replicas=3 -n my-app

回到三個。

Step 8，滾動更新。

kubectl set image deployment/nginx-deploy nginx=nginx:1.28 -n my-app

kubectl rollout status deployment/nginx-deploy -n my-app

看到 successfully rolled out。用 kubectl describe deployment nginx-deploy -n my-app 確認 Image 已經是 1.28。

Step 9，回滾。

假設 1.28 有問題，退回去。

kubectl rollout undo deployment/nginx-deploy -n my-app

kubectl describe deployment nginx-deploy -n my-app，確認 Image 回到 1.27。

Step 10，清理。

kubectl delete namespace my-app

一行搞定，Namespace 裡面所有的東西都刪乾淨了。

這十個步驟就是一個最基本的 K8s 服務生命周期。建環境、部署、對內暴露、對外暴露、擴縮容、更新、回滾、清理。第六堂課我們會在這個基礎上再加上 Ingress 用域名路由、ConfigMap 管設定、Secret 管密碼、PV/PVC 做資料持久化。每加一個功能，你的服務就離正式上線更近一步。 [▶ 下一頁]`,
  },

  // ── 5-25 學員自由練習 ──
  {
    title: '學員自由練習',
    subtitle: '從零做一遍完整鏈路 + 挑戰題',
    section: 'Loop 8：綜合實作 + 總結',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：跟著 10 步驟完整做一遍</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>kubectl create namespace my-app</li>
            <li>kubectl create deployment ... --replicas=3 -n my-app</li>
            <li>kubectl expose deployment ... -n my-app</li>
            <li>busybox curl 驗證</li>
            <li>建 NodePort Service（30080）</li>
            <li>curl Node-IP:30080</li>
            <li>scale 3 &rarr; 5 &rarr; 3</li>
            <li>set image nginx:1.27 &rarr; 1.28</li>
            <li>rollout undo</li>
            <li>delete namespace my-app</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰 1：同時部署兩個服務</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>nginx（app: frontend）+ httpd（app: api）</li>
            <li>各自 Deployment + ClusterIP + NodePort</li>
            <li>nginx 用 30080，httpd 用 30081</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰 2：跨 Namespace DNS</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>從 busybox curl <code className="text-green-400">frontend-svc.my-app.svc.cluster.local</code></li>
            <li>curl <code className="text-green-400">api-svc.my-app.svc.cluster.local</code></li>
          </ul>
        </div>
      </div>
    ),
    notes: `學員自由練習時間。

必做：跟著剛才的十個步驟完整做一遍。Namespace、Deployment、ClusterIP、busybox 驗證、NodePort、外部 curl、scale、滾動更新、回滾、清理。整套走一遍。

挑戰 1：同時部署兩個服務。在 my-app 裡同時部署 nginx（標籤 app: frontend）和 httpd（標籤 app: api）。各自有 Deployment 加 ClusterIP Service 加 NodePort Service。nginx 用 NodePort 30080，httpd 用 NodePort 30081。從外面分別 curl 兩個 NodePort 驗證。

挑戰 2：跨 Namespace DNS。用 busybox Pod 從叢集內部 curl 兩個 Service 的 DNS 名字。curl frontend-svc.my-app.svc.cluster.local。curl api-svc.my-app.svc.cluster.local。

回顧題：不看筆記列出今天學的所有 kubectl 指令。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 5-26 總結（1/2）：因果鏈回顧 + 指令清單 ──
  {
    title: '第五堂總結：因果鏈回顧',
    subtitle: '從 Deployment 到完整服務上線流程',
    section: 'Loop 8：綜合實作 + 總結',
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
    notes: `好，最後一支影片，我們來做第五堂的總結。

今天一整天下來，我們走了一條很長的因果鏈。每一個概念都是因為上一步沒解決的問題才引出來的，不是隨便排的。我帶大家用因果鏈的方式快速回顧一遍。

第四堂結尾我們用 Deployment 跑了三個 Pod，但那是在 minikube 單節點上，三個 Pod 全擠在同一台，完全看不出分散的效果。所以今天第一件事就是升級到 k3s 多節點叢集。裝好 k3s 之後，kubectl get pods -o wide 一看，Pod 真的分散在不同的 Node 上了。

Pod 分散了之後，我們開始學 Deployment 的三個核心能力。第一個是擴縮容。流量大了，kubectl scale 把副本從三個拉到五個。流量小了，縮回三個。Pod 自動在多個 Node 之間分散。

第二個是滾動更新。新版本要上線，kubectl set image 一行指令，K8s 自動逐步替換，舊的一個一個砍，新的一個一個建，服務不中斷。

第三個是回滾。新版本上了才發現有 bug，kubectl rollout undo 一行指令退回去。K8s 把舊的 ReplicaSet 重新擴容，幾秒鐘就恢復了。

然後我們問了一個問題：Pod 掛了 K8s 真的會自動補嗎？動手驗證了自我修復。刪掉一個 Pod，馬上就有新的出現。在多節點上更震撼，就算整台 Node 掛了，Pod 也會被調度到其他 Node 上重建。

接著我們搞清楚了 K8s 靠什麼認親。Labels 和 Selector 是 K8s 的認親機制。Deployment 的 selector、Pod 的 labels、Service 的 selector，三者要對上。這是最容易出錯的地方。

上午搞定了 Deployment，下午的問題來了：Pod 跑起來了，但外面的人連不到。ClusterIP Service 解決了叢集內部的連線，給了一個穩定的地址加上自動負載均衡。但 ClusterIP 只能叢集內部用。

外面也要連怎麼辦？NodePort Service 在每個 Node 上開一個 Port，外面的人用 Node IP 加上 Port 就能連進來。三種 Service 類型我們做了一個完整的比較。

用了 Service 之後，叢集內部 Pod 之間用 IP 連太蠢了。DNS 服務發現出場，K8s 的 CoreDNS 自動幫每個 Service 註冊 DNS 名字，Pod 裡面直接用 Service 名字就能連。

DNS 名字有一個 Namespace 的部分，這就帶出了 Namespace。Namespace 是叢集裡的資料夾，用來隔離不同環境。dev 和 prod 各自有自己的 Namespace，同名的 Service 不衝突。同 Namespace 用短名字，跨 Namespace 帶上 Namespace 名字。

然後我們學了兩個特殊的工作負載。DaemonSet 確保每個 Node 上跑一個 Pod，適合日誌收集和監控 agent 這種節點級服務。CronJob 按照排程定時建 Job 執行任務，適合備份和清理。

最後我們把所有東西從零串了一遍。Namespace、Deployment、ClusterIP、NodePort、擴縮容、滾動更新、回滾，十個步驟走完就是一個最基本的服務上線流程。

螢幕上列了今天新學的所有 kubectl 指令，大家截圖存起來。 [▶ 下一頁]`,
  },

  // ── 5-26 總結（2/2）：Docker 對照表 + 回家作業 + 預告 ──
  {
    title: '回家作業 + 下堂課預告',
    subtitle: 'Docker 對照表 + 因果鏈繼續走',
    section: 'Loop 8：綜合實作 + 總結',
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

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">回家作業</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><strong className="text-white">從零做一遍完整鏈路</strong>，不看筆記</li>
            <li>在兩個 Namespace 各部署一個服務，跨 Namespace curl</li>
            <li>建 DaemonSet + CronJob，觀察行為</li>
          </ol>
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
    notes: `還有更新過的 Docker 到 K8s 對照表，Docker 的 scale 對應 Deployment 的 replicas，Docker 的 -p 對應 Service，Docker network 的 DNS 對應 CoreDNS，不同 Compose 專案對應 Namespace，crontab 對應 CronJob。

回家作業三個。第一，從零做一遍完整鏈路，不看筆記。Namespace、Deployment、Service、scale、滾動更新、回滾，整套走一遍。做到不看筆記也能完成，你就真正搞懂了。第二，在兩個 Namespace 各部署一個服務，從 busybox 跨 Namespace curl。第三，建一個 DaemonSet 和一個 CronJob，觀察它們的行為。

最後預告下堂課。

今天你的服務已經可以對外了，NodePort 讓外面的人連得到。但是 192.168.64.3:30080 這種地址也太醜了吧？你能叫客戶輸入這個嗎？所以下堂課要學 Ingress，讓你用漂亮的域名來路由，myapp.com 到前端，myapp.com/api 到後端。

你的設定現在寫死在 YAML 裡面，改設定就要重新 build Image，太痛苦了。所以下堂課要學 ConfigMap，把設定從 Image 抽出來。

密碼呢？你不會把資料庫密碼寫在 ConfigMap 裡吧？ConfigMap 沒有加密，所有人都看得到。所以要學 Secret，專門管敏感資訊。

還有一個問題。Pod 掛了重建，容器裡面的資料就消失了。如果是資料庫，資料沒了可不是鬧著玩的。所以要學 PV 和 PVC，讓資料持久化。

最後，你現在每個功能都要寫一個 YAML 檔案，一個服務可能有五六個 YAML。管起來很麻煩。所以要學 Helm，K8s 的套件管理工具，用一個 chart 把所有東西打包在一起。

打個比方。今天你的團隊學會了讓服務對外。但這個服務現在穿著睡衣出門，沒有域名、沒有設定管理、沒有密碼保護、資料也沒有持久化。下堂課就是給它穿上正式的衣服，域名、設定、密碼、資料持久化，一件一件穿上去，讓它真正可以上線面對客戶。

好，今天的課程到這裡。大家辛苦了，回去做回家作業，我們下堂課見。 [▶ 第五堂結束]`,
  },
]
