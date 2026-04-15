import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  image?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  // ============================================================
  // 6-1：第五堂回顧 + 因果鏈預覽（2 張）
  // ============================================================

  // ── 6-1（1/2）：開場 + 第五堂因果鏈回顧 ──
  {
    title: '第六堂：Ingress + 配置管理 — 把正式的衣服穿上去',
    subtitle: 'Ingress → ConfigMap → Secret → 整合實作',
    section: '6-1：回顧 + 因果鏈預覽',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第五堂因果鏈回顧</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">k3s 多節點</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">擴縮容</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">滾動更新</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">回滾</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">自我修復</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Labels</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">ClusterIP</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">NodePort</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">DNS</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Namespace</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">DaemonSet</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">CronJob</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">從零串完整鏈路</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">第五堂下半場實作回顧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">學會的技能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Deployment 三能力</td>
                <td className="py-2">擴縮容 / 滾動更新 / 回滾</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">自我修復</td>
                <td className="py-2">刪 Pod 馬上補、Node 掛了自動搬</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Service</td>
                <td className="py-2">ClusterIP + NodePort + DNS</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">特殊工作負載</td>
                <td className="py-2">DaemonSet / CronJob / 從零串完整鏈路</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `歡迎回來，第六堂課。

上堂課結束的時候，我說你們的服務「穿著睡衣出門」。今天我們就是要一件一件把正式的衣服穿上去。在開始之前，先花幾分鐘把第五堂走過的因果鏈快速串一遍，確保大家的記憶是熱的。

第四堂結尾我們學了 Deployment 基礎，但那時候只有一個 Node，三個 Pod 全擠在同一台機器上，完全看不出分散的效果。所以第五堂第一件事就是裝 k3s，建了一個真正的多節點叢集，一個 Master 加兩個 Worker。Pod 跑起來之後 kubectl get pods -o wide 一看，真的分散在不同 Node 上了。

有了多節點，我們就開始玩 Deployment 的三個核心能力。流量變了怎麼辦？擴縮容，kubectl scale 拉上去縮回來。新版本要上線？滾動更新，kubectl set image 一行搞定，K8s 自動逐步替換，服務不中斷。新版有 bug？回滾，kubectl rollout undo 一秒退回去。然後我們親手驗證了自我修復，刪掉 Pod 馬上補新的，甚至整台 Node 掛了 Pod 也會被調度到其他 Node。

接著我們搞懂了 Labels 和 Selector，K8s 靠這套機制認親，Deployment 的 selector 和 Pod 的 labels 要對上，Service 的 selector 也要對上。

下午進入了 Service。ClusterIP 讓叢集內部的 Pod 互相連，給了一個穩定的虛擬 IP 加上自動負載均衡。但 ClusterIP 只能叢集內部用，外面的人連不到。所以 NodePort 出場了，在每個 Node 上開一個 Port，外面的人用 Node IP 加上那個 Port 就能連進來。

然後我們發現叢集內部用 IP 連太蠢了，所以學了 DNS。K8s 的 CoreDNS 自動幫每個 Service 註冊 DNS 名字，Pod 裡面用 Service 名字就能連，不用記 IP。DNS 名字裡面有一個 Namespace 的部分，所以我們學了 Namespace，叢集裡的資料夾，用來隔離 dev 和 prod 環境。

最後學了兩個特殊的工作負載。DaemonSet 確保每個 Node 上跑一個 Pod，適合日誌收集和監控。CronJob 按排程定時跑任務，適合備份和清理。最後一個 Loop 我們把所有東西從零串了一遍，十個步驟走完就是一個基本的服務上線流程。

[▶ 下一頁]`,
  },

  // ── 6-1（2/2）：第五堂結尾的問題 + 今天因果鏈預覽 ──
  {
    title: '第五堂的遺留問題 → 今天的因果鏈',
    subtitle: 'NodePort 太醜、設定寫死、密碼明文 → 一個一個解決',
    section: '6-1：回顧 + 因果鏈預覽',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：NodePort 192.168.1.100:30080</p>
          <p className="text-slate-300 text-sm">主管說：「客戶要記 IP 加 Port？你在開玩笑嗎？」</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">今天的因果鏈</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded text-xs">NodePort 太醜</span>
              <span className="text-slate-500">→</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded text-xs">Ingress（域名路由）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded text-xs">設定寫死在 Image</span>
              <span className="text-slate-500">→</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded text-xs">ConfigMap（設定外部化）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded text-xs">密碼放 ConfigMap 不安全</span>
              <span className="text-slate-500">→</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded text-xs">Secret（敏感資料管理）</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-xs">三個串起來</span>
              <span className="text-slate-500">→</span>
              <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded text-xs">整合實作（接近真實部署）</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-3">下午：PV/PVC → StatefulSet → Helm</p>
        </div>
      </div>
    ),
    notes: `好，回顧完了。現在我問大家一個問題。

第五堂結束的時候，你的服務已經可以對外了。使用者在瀏覽器輸入 192.168.1.100 冒號 30080，可以看到你的網頁。但是，你把這個網址拿去給你的主管看，他會說什麼？「這什麼東西？客戶要記 IP 加 Port？你在開玩笑嗎？」

所以今天的第一個問題就是：怎麼讓使用者用域名連進來？www.myshop.com，不是 192.168.1.100:30080。這就是 Ingress 要解決的事情。

但 Ingress 只是今天的第一站。你想想看，Ingress 讓使用者用域名連進來了，你的 API 也跑起來了。但 API 要連資料庫，資料庫的地址和密碼寫在哪？寫死在 Dockerfile 裡面？build 成 Image 之後，dev 環境和 prod 環境的 IP 不一樣，你是要建兩個 Image？太蠢了。所以要學 ConfigMap，把設定從 Image 抽出來。

設定抽出來了，但密碼呢？資料庫密碼放 ConfigMap 裡面？ConfigMap 是明文的，任何能跑 kubectl 的人都看得到。所以要學 Secret，專門管密碼和敏感資料。

學完 Ingress、ConfigMap、Secret 之後，我們要把它們串起來做一個完整的練習。一個 Namespace 裡面有 Nginx 前端、API 後端、MySQL 資料庫，用 Ingress 做域名路由，用 ConfigMap 管設定，用 Secret 管密碼。這才像一個真正的系統。

那下午呢？下午還有三個問題。Pod 重啟資料消失，需要 PV 和 PVC 做持久化。Deployment 跑資料庫有問題，需要 StatefulSet。YAML 太多太散管不動，需要 Helm。但那是下午的事，上午我們先專注把 Ingress、ConfigMap、Secret 搞定。

每一步都是上一步沒解決的問題。這就是今天的因果鏈。好，開始第一個 Loop。

[▶ 下一頁]`,
  },

  // ============================================================
  // 6-2：Ingress 概念（2 張）
  // ============================================================

  // ── 6-2（0/3）：今天的實作目標 ──
  {
    title: '今天的目標 — 從醜陋的 NodePort 到正常的 URL',
    subtitle: '一個 IP，標準 80 Port，用路徑或域名區分服務',
    section: '6-2：Ingress 概念',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">現在的狀況（NodePort）</p>
          <code className="text-red-300 text-sm">http://192.168.1.100:30080</code>
          <p className="text-slate-400 text-xs mt-1">使用者要記 IP + Port → 不可接受</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">今天做完的樣子（Ingress）</p>
          <table className="w-full text-sm font-mono">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-green-400">curl http://{'<NODE-IP>'}/frontend</td>
                <td className="py-1.5 text-slate-400">→ Message: Hello from frontend</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-green-400">curl http://{'<NODE-IP>'}/api</td>
                <td className="py-1.5 text-slate-400">→ Message: Hello from api</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">curl http://www.myapp.local</td>
                <td className="py-1.5 text-slate-400">→ Message: Hello from frontend</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-3 text-cyan-400">curl http://api.myapp.local</td>
                <td className="py-1.5 text-slate-400">→ Message: Hello from api</td>
              </tr>
            </tbody>
          </table>
          <p className="text-slate-400 text-xs mt-2">同一個 IP + Port 80，用路徑或域名分流</p>
        </div>
      </div>
    ),
    notes: `好，上一張講了因果鏈。在進入概念之前，先讓大家看一下今天做完長什麼樣子。

現在的狀況是 NodePort，使用者要輸入 192.168.1.100 冒號 30080。今天做完，我們要能做到這四件事：

第一，curl http 斜斜 NODE-IP 斜線 frontend，看到 Message: Hello from frontend。第二，curl http 斜斜 NODE-IP 斜線 api，看到 Message: Hello from api。第三，curl http://www.myapp.local，也看到 Hello from frontend。第四，curl http://api.myapp.local，看到 Hello from api。

前兩個是用路徑區分，叫 Path-based routing。後兩個是用域名區分，叫 Host-based routing。同一個 IP，標準的 Port 80，不用再記那些醜陋的 Port 號。

目標清楚了，來看怎麼做到。

[▶ 下一頁]`,
  },

  // ── 6-2（1/3）：NodePort 五個問題 + Ingress 兩個角色 ──
  {
    title: 'Ingress 概念 — NodePort 的五個致命問題',
    subtitle: '使用者要的是 www.myshop.com → 需要 HTTP 層路由器',
    section: '6-2：Ingress 概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">NodePort 的五個問題</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-red-400 font-mono">1</td>
                <td className="py-1.5">Port 醜 — 使用者要記 <code className="text-red-300">:30080</code></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-red-400 font-mono">2</td>
                <td className="py-1.5">Port 有限 — 範圍 30000-32767</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-red-400 font-mono">3</td>
                <td className="py-1.5">沒有域名 — 使用者要記 IP</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-red-400 font-mono">4</td>
                <td className="py-1.5">沒有 HTTPS — 明文傳輸</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-3 text-red-400 font-mono">5</td>
                <td className="py-1.5">每個服務一個 Port — 10 個服務 = 10 個 Port</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Ingress = K8s 世界裡的 Nginx 反向代理</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">名稱</th>
                <th className="pb-2 pr-4">是什麼</th>
                <th className="pb-2">類比</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Ingress</td>
                <td className="py-2 pr-4">YAML 規則定義（地圖）</td>
                <td className="py-2">nginx.conf</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Ingress Controller</td>
                <td className="py-2 pr-4">實際跑的 Pod（司機）</td>
                <td className="py-2">Nginx 程式本身</td>
              </tr>
            </tbody>
          </table>
          <p className="text-slate-400 text-xs mt-2">k3s 內建 Traefik / minikube 用 nginx-ingress</p>
        </div>
      </div>
    ),
    notes: `上一支影片我們預覽了今天的因果鏈，第一個問題就是 NodePort 太醜。我們來仔細看看 NodePort 到底有哪些問題。

第一，Port 醜。30080 這種數字不是正常使用者會記的。你去逛購物網站，你輸入的是 momo.com，不是 203.69.116.155 冒號 30080。第二，Port 有限。NodePort 的範圍是 30000 到 32767，撐死了兩千多個。如果你的公司有幾百個微服務，每個都要一個 NodePort，很快就不夠用了。第三，沒有域名，使用者要記 IP。IP 會變，換台機器就連不到。第四，沒有 HTTPS，明文傳輸，瀏覽器會顯示「不安全」。第五，每個服務要開一個 Port。你有前端、後端、管理後台三個服務，就要開三個 NodePort，30080、30081、30082，管理起來很痛苦。

我們想要的是什麼？使用者輸入 www.myshop.com 就到前端，api.myshop.com 就到 API。一個 IP，標準的 80 和 443 Port，用域名和路徑來區分不同的服務。

如果你之前用過 Docker，你一定想到了。在 Docker 的時代，這個問題怎麼解決？在最前面放一台 Nginx 當反向代理。在 nginx.conf 裡面寫 server_name www.myshop.com，location 斜線 proxy_pass 到 frontend 容器。再寫一個 server_name api.myshop.com，proxy_pass 到 api 容器。域名路由就搞定了。

K8s 的 Ingress 做的事情完全一樣，它就是 K8s 世界裡的 Nginx 反向代理。但比你自己手寫 nginx.conf 更方便，因為它跟 K8s 整合在一起，可以自動發現 Service、自動更新路由規則。

其實第四堂概念篇我們已經提過 Ingress 了。當時我們在講八大組件的時候帶了一句：Ingress 是讓外面用域名連進來的。那時候只是介紹概念，今天我們要正式動手做。

在開始寫 YAML 之前，有一個觀念一定要搞清楚。Ingress 這個詞其實包含兩個東西。

第一個叫 Ingress，注意它只是一份 YAML 規則。你在裡面寫什麼域名、什麼路徑，導到哪個 Service。它只是一張地圖，本身不會做任何事。

第二個叫 Ingress Controller，它是一個真的在跑的 Pod。它會去讀你寫的 Ingress 規則，然後實際接收外部流量，根據規則轉發到對應的 Service。你可以把它想成一個司機，Ingress 是地圖，Ingress Controller 是拿著地圖開車的司機。沒有司機，地圖放在那裡也沒用。沒有 Ingress Controller，你的 Ingress YAML 就只是一份被忽略的文件。

常見的 Ingress Controller 有兩個。nginx-ingress 是社群最常用的，底層就是 Nginx。Traefik 是另一個選擇，k3s 安裝的時候就自動帶了 Traefik。我們的 k3s 環境已經有 Traefik 了，所以不用另外裝。如果你用 minikube，要自己跑 minikube addons enable ingress 來啟用 nginx-ingress。

[▶ 下一頁]`,
  },

  // ── 6-2（2/2）：Path/Host routing + YAML + TLS + Docker 對照 ──
  {
    title: 'Ingress 路由方式 + YAML 拆解',
    subtitle: 'Path-based / Host-based routing + TLS 簡提',
    section: '6-2：Ingress 概念',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">兩種路由方式</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-3">方式</th>
                <th className="pb-2 pr-3">URL 範例</th>
                <th className="pb-2">適合場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-3 text-cyan-400">Path-based</td>
                <td className="py-2 pr-3"><code className="text-green-400 text-xs">myapp.com/</code> + <code className="text-green-400 text-xs">myapp.com/api</code></td>
                <td className="py-2">前後端同域名</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-3 text-cyan-400">Host-based</td>
                <td className="py-2 pr-3"><code className="text-green-400 text-xs">www.myapp.com</code> + <code className="text-green-400 text-xs">api.myapp.com</code></td>
                <td className="py-2">微服務各有域名</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">apiVersion 對照（容易寫錯）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">資源</th>
                <th className="pb-2">apiVersion</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4">Pod / Service / ConfigMap</td>
                <td className="py-1.5 font-mono text-xs text-green-400">v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4">Deployment</td>
                <td className="py-1.5 font-mono text-xs text-green-400">apps/v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4 text-cyan-300 font-semibold">Ingress</td>
                <td className="py-1.5 font-mono text-xs text-cyan-300 font-semibold">networking.k8s.io/v1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker → K8s 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Docker</th>
                <th className="pb-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4">nginx.conf 設定檔</td>
                <td className="py-1.5">Ingress YAML</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4">Nginx 容器</td>
                <td className="py-1.5">Ingress Controller Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4">server_name + location</td>
                <td className="py-1.5">spec.rules 的 host + paths</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Ingress YAML（path-based）
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  ingressClassName: traefik
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-svc
                port:
                  number: 3000`,
    notes: `好，搞清楚了 Ingress 和 Ingress Controller 的分別之後，來看怎麼寫路由規則。路由有兩種方式。

第一種叫 Path-based routing，用 URL 路徑來區分。同一個域名，斜線到前端 Service，斜線 api 到 API Service。就像 Nginx 裡面一個 server 底下寫多個 location。

第二種叫 Host-based routing，用域名來區分。www.myapp.local 到前端，api.myapp.local 到 API。就像 Nginx 裡面寫多個 server_name。

什麼時候用哪種？如果你的前端和後端是同一個產品的一部分，放在同一個域名底下很自然，那就用 Path-based。如果你是微服務架構，每個服務是不同團隊在維護，給每個服務獨立的域名比較乾淨，那就用 Host-based。當然也可以混用，同一個 Ingress YAML 裡面可以又有 host 又有 path。

來看 Ingress 的 YAML 怎麼寫。

apiVersion 是 networking.k8s.io/v1。注意跟 Deployment 的 apps/v1 不一樣，Ingress 屬於 networking 這個 API group，因為它是網路相關的資源。kind 寫 Ingress。

spec 裡面有一個 ingressClassName，告訴 K8s 要用哪個 Ingress Controller 來處理這條規則。k3s 寫 traefik，nginx-ingress 寫 nginx。

重點在 rules。每一條 rule 有 paths，paths 是一個陣列。每個 path 有三個東西：path 是 URL 路徑，pathType 是匹配方式，backend 是導向哪個 Service。

pathType 有兩個選項。Prefix 是前綴匹配，只要路徑以指定的字串開頭就算。比如你寫 path: /api，那 /api、/api/users、/api/v2/data 全部都會匹配到。Exact 是精確匹配，只有完全一模一樣才算。大部分情況用 Prefix 就對了。

backend 裡面指定 Service 的名字和 Port。service.name 是你的 ClusterIP Service 的名字，port.number 是 Service 暴露的 Port。

Host-based 的 YAML 差不多，就是在 rules 裡面多了一個 host 欄位。每個 host 是一條獨立的規則，底下再接 paths。

最後快速提一下 TLS。在生產環境你的網站一定要走 HTTPS。Ingress 支援 TLS，做法是把 SSL 憑證存在一個 Secret 裡面，然後在 Ingress YAML 的 tls 區塊指定要用哪個 Secret。Ingress Controller 就會用這個憑證來處理 HTTPS 連線。生產環境通常會搭配一個叫 cert-manager 的工具，它可以自動跟 Let's Encrypt 申請免費的 HTTPS 憑證，到期自動續約。今天不深入 TLS，知道有這個機制就好。

用 Docker 的經驗做最後的對照。Docker 時代你自己寫 nginx.conf，K8s 用 Ingress YAML。Docker 時代你跑一個 Nginx 容器，K8s 用 Ingress Controller Pod。格式不一樣，但做的事情完全一樣。差別在於 K8s 的 Ingress 跟叢集整合在一起，Service 加了、改了、刪了，路由自動更新，不用你手動改 nginx.conf 再 reload。

好，概念講完了。接下來我們動手做。

[▶ 下一頁]`,
  },

  // ============================================================
  // 6-3：Ingress 實作（1 張 demo app 介紹 + 2 張實作 + 1 張學員實作）
  // ============================================================

  // ── 6-3（0/3）：今天的 Demo App 介紹 ──
  {
    title: '今天的 Demo App：yanchen184/k8s-demo-app',
    subtitle: '貫穿 Ingress → ConfigMap → Secret → Helm 的驗證工具',
    section: '6-3：Ingress 實作',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">這個 app 做什麼？</p>
          <p className="text-slate-300 text-sm mb-3">一個簡單的 PHP 應用，收到 HTTP 請求就印出自己的狀態：</p>
          <div className="bg-slate-900 p-3 rounded font-mono text-sm">
            <p className="text-slate-400">$ curl http://&lt;NODE-IP&gt;/frontend</p>
            <p className="text-green-400">Server: 10.42.1.3:80 (frontend-deploy-abc)</p>
            <p className="text-green-400">Message: Hello from frontend</p>
            <p className="text-green-400">Username: admin</p>
            <p className="text-green-400">Password: mypassword</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼用這個？</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">→</span>
              <div>
                <span className="text-slate-300">Ingress：</span>
                <span className="text-slate-400">curl 不同路徑，Server IP 不同 → 確認路由正確</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">→</span>
              <div>
                <span className="text-slate-300">ConfigMap：</span>
                <span className="text-slate-400">改 USERNAME，curl 馬上看到變化</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">→</span>
              <div>
                <span className="text-slate-300">Secret：</span>
                <span className="text-slate-400">注入 PASSWORD，curl 看到值有沒有套進去</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5">→</span>
              <div>
                <span className="text-slate-300">Helm：</span>
                <span className="text-slate-400">values.yaml 換一個值，curl 驗證整套都變了</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-1">環境變數控制輸出</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-slate-400">MESSAGE=</p>
              <p className="text-green-400">"Hello from frontend"</p>
            </div>
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-slate-400">USERNAME=</p>
              <p className="text-green-400">"admin"</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-center">IMAGE 不變，環境變數不同 → 行為不同</p>
        </div>
      </div>
    ),
    code: `# 直接跑看看效果
kubectl run demo --image=yanchen184/k8s-demo-app:latest \\
  --env="MESSAGE=Hello World" \\
  --env="USERNAME=admin" \\
  --env="PASSWORD=secret123" \\
  --port=80

kubectl expose pod demo --port=80 --type=NodePort

# 取得 NodePort
kubectl get svc demo

# curl 看輸出
curl http://<NODE-IP>:<NodePort>
# Server: 10.42.x.x:80 (demo)
# Message: Hello World
# Username: admin
# Password: secret123`,
    notes: `在開始 Ingress 實作之前，先介紹今天整堂課要用的 demo app。

這個 app 叫做 yanchen184/k8s-demo-app。它就是一個很簡單的 PHP 應用，收到 HTTP 請求，就把自己的狀態印出來。印四行：Server 是自己的 IP 和 Pod 名稱，Message 是 MESSAGE 這個環境變數的值，Username 是 USERNAME 的值，Password 是 PASSWORD 的值。

為什麼用這個 app 而不用 nginx 或 httpd？

因為 nginx 的預設頁面只有一個 HTML，你 curl 到 frontend 或 api 看到的都是一樣的頁面，沒辦法分辨流量有沒有正確路由。這個 app 不一樣，你給不同的 Deployment 設不同的 MESSAGE，curl 就會看到不同的輸出。Server IP 也不一樣，因為是不同的 Pod 在服務。

更重要的是，這個 app 貫穿今天整堂課。Ingress 的時候，curl 不同路徑，看到不同的 Message，確認路由正確。ConfigMap 的時候，把 USERNAME 存進 ConfigMap，curl 看到 Username 欄位有沒有套進去。Secret 的時候，把 PASSWORD 存進 Secret，curl 看到 Password 欄位。Helm 的時候，values.yaml 換一個值，curl 驗證整套都跟著變了。

同一個 app，從頭用到尾，你只要記得 curl 看四行輸出就好。

這個 app 由環境變數控制輸出，IMAGE 本身不變，環境變數不同行為就不同。這本身就是 K8s 的核心概念之一：把設定和程式分開。等一下學 ConfigMap 和 Secret 的時候，你會更深刻體會這件事。

好，介紹完了，開始 Ingress 實作。

[▶ 下一頁]`,
  },

  // ── 6-3（1/3）：確認 Controller + 部署應用 + Path-based routing ──
  {
    title: 'Ingress 實作 — 確認 Controller + Path Routing',
    subtitle: '確認 Traefik → 部署兩個 Service → curl 驗證',
    section: '6-3：Ingress 實作',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 1：確認 Ingress Controller</p>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded mt-1">{`NAME                      READY  STATUS
svclb-traefik-xxx         2/2    Running  ← Klipper LB（k3s 特有）
traefik-7d9f5b8c4d-xxx    1/1    Running  ← Ingress Controller`}</pre>
          <div className="mt-2 space-y-1 text-xs text-slate-400">
            <p><span className="text-cyan-300">traefik</span>：讀 Ingress YAML、做路由的本體</p>
            <p><span className="text-cyan-300">svclb-traefik</span>：Klipper LB，DaemonSet 把 Node 80/443 接給 Traefik（地端版 LoadBalancer）</p>
          </div>
          <pre className="text-xs font-mono text-green-400 bg-slate-900 p-2 rounded mt-2">{`kubectl get svc -n kube-system | grep traefik
traefik  LoadBalancer  10.43.x.x  192.168.64.10  80:xxx/TCP`}</pre>
          <p className="text-slate-400 text-xs mt-1">EXTERNAL-IP = VM 的 IP，等等 curl 用這個</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 2：部署</p>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded">{`deployment.apps/frontend-deploy created
service/frontend-svc created
deployment.apps/api-deploy created
service/api-svc created
ingress.networking.k8s.io/app-ingress created`}</pre>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3：確認狀態</p>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded">{`# kubectl get svc
NAME           TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)
api-svc        ClusterIP   10.43.x.x     <none>        3000/TCP
frontend-svc   ClusterIP   10.43.x.x     <none>        80/TCP

# kubectl get ingress
NAME          CLASS     HOSTS   ADDRESS          PORTS
app-ingress   traefik   *       192.168.64.10    80`}</pre>
          <p className="text-slate-400 text-xs mt-1">ADDRESS 空白 → 等幾秒。兩個 Service 都是 ClusterIP — 有 Ingress 就不需要 NodePort</p>
        </div>

        <div className="bg-slate-800/30 border border-slate-600/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs font-semibold mb-1">Step 4：curl 驗證</p>
          <pre className="text-green-400 text-xs font-mono leading-relaxed">{`curl http://<NODE-IP>/frontend
# Server: 10.42.x.x:80 (frontend-deploy-xxx)
# Message: Hello from frontend

curl http://<NODE-IP>/api
# Server: 10.42.x.x:80 (api-deploy-xxx)
# Message: Hello from api`}</pre>
          <p className="text-slate-400 text-xs mt-1">SERVER_ADDR 不同 → 確認是兩個不同的 Pod 在服務</p>
        </div>
      </div>
    ),
    code: `# Step 1：確認 Controller
kubectl get pods -n kube-system | grep traefik
# svclb-traefik-xxx   2/2  Running  ← Klipper LB
# traefik-xxx         1/1  Running  ← Ingress Controller

kubectl get svc -n kube-system | grep traefik
# traefik  LoadBalancer  10.43.x.x  192.168.64.10  80:xxx/TCP

# Step 2：部署（ingress-basic.yaml 內容如下）
# ---
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: frontend-deploy
# spec:
#   replicas: 1
#   selector:
#     matchLabels:
#       app: frontend
#   template:
#     metadata:
#       labels:
#         app: frontend
#     spec:
#       containers:
#         - name: app
#           image: yanchen184/k8s-demo-app:latest
#           env:
#             - name: MESSAGE
#               value: "Hello from frontend"
#           ports:
#             - containerPort: 80
# ---
# （api-deploy 同理，MESSAGE 改成 "Hello from api"）
# ---
# apiVersion: networking.k8s.io/v1
# kind: Ingress
# metadata:
#   name: app-ingress
# spec:
#   ingressClassName: traefik
#   rules:
#     - http:
#         paths:
#           - path: /frontend
#             pathType: Prefix
#             backend:
#               service:
#                 name: frontend-svc
#                 port:
#                   number: 80
#           - path: /api
#             pathType: Prefix
#             backend:
#               service:
#                 name: api-svc
#                 port:
#                   number: 80

kubectl apply -f ingress-basic.yaml

# Step 3：確認
kubectl get svc
# frontend-svc  ClusterIP  10.43.x.x  <none>  80/TCP
# api-svc       ClusterIP  10.43.x.x  <none>  80/TCP

kubectl get ingress
# NAME         CLASS    HOSTS  ADDRESS        PORTS
# app-ingress  traefik  *      192.168.64.10  80

# Step 4：測試
kubectl get nodes -o wide   # 看 INTERNAL-IP
curl http://<NODE-IP>/frontend
# Server: 10.42.x.x:80 (frontend-deploy-xxx)
# Message: Hello from frontend

curl http://<NODE-IP>/api
# Server: 10.42.x.x:80 (api-deploy-xxx)
# Message: Hello from api`,
    notes: `好，概念講完，動手做。請大家打開終端機。

第一步，確認 Ingress Controller 有在跑。我們用的是 k3s，Traefik 是內建的，安裝 k3s 的時候就自動帶了。

kubectl get pods -n kube-system，然後用 grep traefik 過濾一下。

你會看到兩個 Pod。第一個是 svclb-traefik，第二個是 traefik 本身。

svclb-traefik 是 k3s 特有的元件，叫做 Klipper Load Balancer。標準 K8s 沒有 LoadBalancer 的實作，要靠雲端平台提供。k3s 在地端沒有雲端，所以內建了 Klipper，用 DaemonSet 在每個 Node 上跑一個 Pod，把 Node 的 80 和 443 port 接到 Traefik Service，讓你在地端也能用 LoadBalancer 型 Service。你以後在雲端看到的 LoadBalancer 就是雲端版的 Klipper。

kubectl get svc -n kube-system，看 traefik 那行，EXTERNAL-IP 就是你 VM 的 IP，等等 curl 要用這個。

Controller 確認了，來部署我們的應用。我準備了一個 ingress-basic.yaml。跟之前不一樣的地方是：這次兩個服務都用同一個 image，yanchen184/k8s-demo-app。這個 app 很簡單，它會印出自己的 Server IP 和你設定的 MESSAGE。

frontend-deploy 的 MESSAGE 設成 Hello from frontend，api-deploy 的 MESSAGE 設成 Hello from api。兩個用同一個 image，但環境變數不同，行為就不同。

kubectl apply -f ingress-basic.yaml

一次 apply 全部搞定。來看看建了什麼。

kubectl get svc。兩個 ClusterIP Service。注意是 ClusterIP 不是 NodePort。因為外部流量的入口只有一個，就是 Ingress Controller。流量路徑是：外部用戶 → Traefik → 根據路由規則 → ClusterIP Service → Pod。ClusterIP 就夠用，不需要 NodePort。

kubectl get ingress。看到 app-ingress，ADDRESS 欄位可能一開始是空的，等幾秒就會出現 IP。

好，來測試。先拿到 Node 的 IP。

kubectl get nodes -o wide，看 INTERNAL-IP 欄位。

指令：curl http://<NODE-IP>/frontend

你會看到：
Server: 10.42.x.x:80
Message: Hello from frontend

指令：curl http://<NODE-IP>/api

你會看到：
Server: 10.42.x.x:80
Message: Hello from api

注意兩個回應的 Server IP 不一樣，因為是兩個不同的 Pod 在服務。

成功了。同一個 IP，同一個 Port 80，根據 URL 路徑的不同，流量被導到不同的 Pod，而且你能直接從回應看出差異。這就是 Path-based routing 的威力。

[▶ 下一頁]`,
  },

  // ── 6-3（2/2）：Host-based routing + 排錯 ──
  {
    title: 'Ingress 實作 — Host Routing + 排錯流程',
    subtitle: '修改 /etc/hosts → 域名 curl 驗證 → 排錯三步',
    section: '6-3：Ingress 實作',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 5：Host-based routing</p>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded">{`kubectl apply -f ingress-host.yaml
# → ingress.networking.k8s.io/app-ingress configured

grep myapp.local /etc/hosts
# → 192.168.64.10 www.myapp.local api.myapp.local`}</pre>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">curl 驗證</p>
          <pre className="text-xs font-mono bg-slate-900 p-2 rounded">{`curl http://www.myapp.local
# Server: 10.42.x.x:80 (frontend-deploy-xxx)
# Message: Hello from frontend

curl http://api.myapp.local
# Server: 10.42.x.x:80 (api-deploy-xxx)
# Message: Hello from api`}</pre>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-red-400 text-xs font-semibold mb-1">⚠ /etc/hosts 用 {'>>'} 追加，絕對不能用 {'>'}</p>
          <p className="text-slate-400 text-xs">{'>'} 會覆蓋整個 /etc/hosts，系統所有 DNS 解析會壞掉</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-1">排錯：ENDPOINTS {'<none>'} → label 不符</p>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-2 rounded">{`kubectl get endpoints
# api-svc       10.42.x.x:5678   ← 有 Pod IP = 正常
# frontend-svc  <none>           ← 沒有 = selector 對不上`}</pre>
        </div>
      </div>
    ),
    code: `# Step 5：host-based routing
kubectl apply -f ingress-host.yaml
# ingress.networking.k8s.io/app-ingress configured

# ⚠ >> 追加，絕對不能用 >
sudo sh -c 'echo "<NODE-IP> www.myapp.local api.myapp.local" >> /etc/hosts'

grep myapp.local /etc/hosts
# 192.168.64.10 www.myapp.local api.myapp.local

curl http://www.myapp.local
# Server: 10.42.x.x:80 (frontend-deploy-xxx)
# Message: Hello from frontend

curl http://api.myapp.local
# Server: 10.42.x.x:80 (api-deploy-xxx)
# Message: Hello from api

# 排錯
kubectl describe ingress app-ingress   # 看 Events
kubectl get endpoints
# api-svc      10.42.x.x:5678   ← 有值 = 正常
# frontend-svc <none>           ← 沒值 = selector 對不上
kubectl logs -n kube-system <traefik-pod>`,
    notes: `好，path-based 做完了，來做 host-based。

我另外準備了一個 ingress-host.yaml，差別在 rules 裡面多了 host 欄位。第一條規則 host 是 www.myapp.local，path 斜線導到 frontend-svc。第二條規則 host 是 api.myapp.local，path 斜線導到 api-svc。

kubectl apply -f ingress-host.yaml

但有一個問題。www.myapp.local 這個域名是我們自己編的，DNS 查不到。在本地測試的時候，我們用修改 /etc/hosts 的方式來模擬 DNS。

sudo sh -c 'echo "192.168.1.100 www.myapp.local api.myapp.local" >> /etc/hosts'

把你實際的 Node IP 替換進去。這行指令的意思是告訴你的電腦：www.myapp.local 和 api.myapp.local 這兩個域名都指向 192.168.1.100。

改好了，來測試。

curl http://www.myapp.local

看到 Nginx 的歡迎頁面。

curl http://api.myapp.local

看到 httpd 的 It works! 頁面。

兩個不同的域名，同一個 IP，但 Ingress Controller 根據 HTTP 請求裡面的 Host header，把流量導到不同的 Service。這就是 Host-based routing。

如果測試的時候沒成功，排錯流程跟之前一樣。第一步 kubectl describe ingress 看 Events，有沒有錯誤訊息。第二步 kubectl get endpoints，確認 Service 後面確實有 Pod，如果 endpoints 是空的表示 selector 對不上。第三步看 Ingress Controller 的日誌，kubectl logs -n kube-system 加上 traefik 的 Pod 名字。

最常見的坑有三個。第一，/etc/hosts 忘記改，curl 域名的時候 DNS 解析不到。第二，ingressClassName 寫錯，k3s 要寫 traefik 不是 nginx。第三，pathType 忘記寫，Ingress YAML 裡面每個 path 都必須指定 pathType，不寫會報錯。

[▶ 下一頁]`,
  },

  // ── 加碼 Demo A：ngrok 打洞 ──
  {
    title: '加碼示範 A — ngrok：5 分鐘讓全世界連進來',
    subtitle: '不需域名、不需公網 IP，一個指令打洞',
    section: '6-3：Ingress 實作',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ngrok 是什麼？</p>
          <p className="text-slate-300 text-sm">在本機和外網之間開一條隧道，給你一個公網 URL。不需要買域名、不需要設定 DNS、不需要公網 IP。</p>
          <div className="mt-3 flex items-center gap-2 text-sm font-mono">
            <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">localhost:80</span>
            <span className="text-slate-500">←→</span>
            <span className="bg-blue-900/50 px-2 py-1 rounded text-blue-300">ngrok 隧道</span>
            <span className="text-slate-500">←→</span>
            <span className="bg-green-900/50 px-2 py-1 rounded text-green-300">https://abc.ngrok-free.app</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>去 ngrok.com 免費註冊，拿 authtoken</li>
            <li><code className="text-green-400">ngrok config add-authtoken &lt;token&gt;</code></li>
            <li><code className="text-green-400">ngrok http 80</code>（k3s Traefik 監聽 80）</li>
            <li>拿到 URL，任何人打開都能連</li>
          </ol>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-xs font-semibold mb-1">免費版限制</p>
          <ul className="text-slate-300 text-xs space-y-0.5 list-disc list-inside">
            <li>每次重啟 URL 都會換</li>
            <li>同時只能跑 1 個 session</li>
            <li>有流量上限</li>
          </ul>
          <p className="text-slate-400 text-xs mt-1">教學示範夠用。</p>
        </div>
      </div>
    ),
    code: `# 安裝（Ubuntu/Debian）
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# 設定 authtoken（只需一次）
ngrok config add-authtoken <your-token>

# 打洞（k3s 的 Traefik 監聽 80）
ngrok http 80

# 輸出：
# Forwarding  https://cf11-xxx.ngrok-free.app -> http://localhost:80

# 驗證（curl 加 header 跳過 ngrok 警告頁）
curl -H "ngrok-skip-browser-warning: true" \\
  https://cf11-xxx.ngrok-free.app/
curl -H "ngrok-skip-browser-warning: true" \\
  https://cf11-xxx.ngrok-free.app/api`,
    notes: `好，剛才學員有問：我學了 Ingress，但我朋友還是連不到，那到底在玩什麼？

這是一個非常好的問題。現在來回答。

我們先說清楚：今天練的是叢集內部的路由。流量怎麼從一個 IP 分給不同 Service，這是 Ingress 解決的事。「全世界的人連進來」是另一層的問題，需要公網 IP 和真實域名。

但我現在要讓你看到，加上 ngrok，五分鐘就能讓全世界連進來。

ngrok 是一個打洞工具。一個指令，它在你的本機和外網之間開一條隧道，給你一個公網 URL。不需要買域名，不需要設定 DNS，不需要公網 IP。

去 ngrok.com 免費註冊，拿到 authtoken，一行設定好。然後 ngrok http 80，因為 k3s 的 Traefik 監聽的是 Node 的 80 port。

跑起來之後你會看到一個 URL，https://xxx.ngrok-free.app，這個 URL 全世界都能打開。你現在把這個 URL 傳給你朋友，他打開瀏覽器輸入，就會看到你的 nginx 歡迎頁面，或者加斜線 api 就會看到 API Server Response。

這就是 Ingress 的地基加上 ngrok 的打洞，合起來就是一個任何人都能連的服務。

[▶ 下一頁]`,
  },

  // ── 加碼 Demo B：DuckDNS 真實域名 ──
  {
    title: '加碼示範 B — DuckDNS：免費的真實域名',
    subtitle: 'yourname.duckdns.org，永久免費，指向你的 VM IP',
    section: '6-3：Ingress 實作',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ngrok vs DuckDNS</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">工具</th>
                <th className="pb-2 pr-4">域名</th>
                <th className="pb-2">限制</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-300">ngrok</td>
                <td className="py-2 pr-4"><code className="text-xs">abc.ngrok-free.app</code></td>
                <td className="py-2 text-xs">重啟就換 URL</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-green-300">DuckDNS</td>
                <td className="py-2 pr-4"><code className="text-xs">yourname.duckdns.org</code></td>
                <td className="py-2 text-xs">固定域名，免費永久</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>去 duckdns.org，用 GitHub 帳號登入</li>
            <li>建立子域名（例如 <code className="text-green-400">k8sdemo</code>）→ 拿到 token</li>
            <li>用 curl 把 VM IP 更新進去</li>
            <li><code className="text-green-400">curl http://k8sdemo.duckdns.org/</code> 驗證</li>
          </ol>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-xs font-semibold mb-1">內網限制</p>
          <p className="text-slate-300 text-xs">DuckDNS 指向 192.168.x.x → 只有同網路的人能連。外網要連需要路由器 Port Forwarding（80/443 → VM IP），或改用雲端機器。</p>
        </div>
      </div>
    ),
    code: `# Step 1：在 duckdns.org 建好域名後，更新 IP
DUCK_DOMAIN="yourname"
DUCK_TOKEN="your-token"
NODE_IP=$(kubectl get nodes -o wide --no-headers | awk '{print $6}')

curl "https://www.duckdns.org/update?domains=\${DUCK_DOMAIN}&token=\${DUCK_TOKEN}&ip=\${NODE_IP}"
# 回傳 OK = 成功

# Step 2：確認 DNS 解析
dig +short yourname.duckdns.org
# 應該回傳 VM 的 IP

# Step 3：用真實域名連進來
curl http://yourname.duckdns.org/
curl http://yourname.duckdns.org/api

# 選用：cron 定時更新 IP（IP 會變時）
echo "*/5 * * * * curl -s 'https://www.duckdns.org/update?domains=yourname&token=your-token&ip=' > /dev/null" | crontab -`,
    notes: `ngrok 的問題是：每次重啟 URL 都會換，你要傳給朋友的網址每次都不一樣。

如果你想要一個固定的域名，不用買，用 DuckDNS。

DuckDNS 是一個免費的動態 DNS 服務。它給你一個 yourname.duckdns.org 的子域名，你可以把它指向任何 IP，永久免費。

去 duckdns.org，用 GitHub 帳號登入，輸入你想要的名字，按 add domain，你就有了一個域名。頁面上面有你的 token，一串 UUID。

然後用 curl 把你的 VM IP 更新進去。DUCK_DOMAIN 是你的域名前綴，DUCK_TOKEN 是你的 token，NODE_IP 是 VM 的 IP，kubectl get nodes -o wide 拿到的。

curl 那行送出去，回傳 OK 就表示成功了。

dig 確認 DNS 解析。dig +short yourname.duckdns.org，應該回傳你 VM 的 IP。

然後 curl http://yourname.duckdns.org/ 就能連進來了。

這樣你就有了一個真實的、固定的域名，不用買，不用設定 DNS 商，全世界都能解析。

但有一個限制要說清楚。如果你的 VM 在家裡的內網，DuckDNS 指向的是 192.168.x.x，這個 IP 在外網連不到。外網要連進來，需要在你的家用路由器做 Port Forwarding，把 80 和 443 port 的流量轉發到 VM 的 IP。或者你把 VM 搬到雲端，就沒有這個問題了。

[▶ 下一頁]`,
  },

  // ── 6-4（學員實作）──
  {
    title: '學員實作：在現有 Ingress 加新路由',
    subtitle: '必做：加 /shop 路由 / 挑戰：host routing 加 admin 服務',
    section: '6-4：回頭操作 Loop 1',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Step 6：講師示範（學生跟著做）</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-0.5 mb-2">
            <p>kubectl create deployment shop-deploy --image=yanchen184/k8s-demo-app:latest</p>
            <p>kubectl set env deployment/shop-deploy MESSAGE="Hello from shop"</p>
            <p>kubectl expose deployment shop-deploy --name=shop-svc --port=80</p>
          </div>
          <p className="text-green-400 font-semibold mb-1">學員任務</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>在 <code className="text-green-400">ingress-basic.yaml</code> 的 paths 下加 <code className="text-green-400">/shop</code> 路由（port 80）</li>
            <li><code className="text-green-400">kubectl apply -f ingress-basic.yaml</code></li>
            <li><code className="text-green-400">curl http://&lt;NODE-IP&gt;/shop</code> 看到 <code className="text-green-400">Message: Hello from shop</code></li>
          </ul>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">挑戰題</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>在 host routing 加第三個服務：域名 <code className="text-yellow-300">admin.myapp.local</code></li>
            <li>後端：admin-deploy（image: yanchen184/k8s-demo-app:latest，MESSAGE="Hello from admin"）+ admin-svc（port 8080）</li>
            <li>/etc/hosts 加入，<code className="text-yellow-300">curl http://admin.myapp.local</code> 驗證，看到 <code className="text-yellow-300">Message: Hello from admin</code></li>
          </ul>
        </div>
      </div>
    ),
    notes: `學員實作時間。必做題：公司說要加一個購物服務。部署 shop-deploy，image 用 yanchen184/k8s-demo-app:latest，env 設 MESSAGE="Hello from shop"，建一個 ClusterIP Service 叫 shop-svc，port 8080，targetPort 80。然後在現有的 app-ingress 裡加一條 /shop 的路由，指向 shop-svc:8080。最後 curl http://<NODE-IP>/shop 看到 Message: Hello from shop 就對了。注意：這裡是在「現有 Ingress 加路由」，不是重新建一個新的 Ingress。挑戰題：在 host routing 再加一個 admin.myapp.local，image 一樣用 yanchen184/k8s-demo-app:latest，MESSAGE 改成 Hello from admin，記得 /etc/hosts 也要加。

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ============================================================
  // 6-4：回頭操作 Loop 1（學員實作解答）
  // ============================================================

  {
    title: '解答：在現有 Ingress 加新路由',
    subtitle: '必做解答 + 三個坑 + 清理 + 銜接 ConfigMap',
    section: '6-4：回頭操作 Loop 1',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做題解答</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded space-y-1">
            <p className="text-slate-500"># 1. 講師建好 shop-deploy + shop-svc</p>
            <p>kubectl create deployment shop-deploy --image=yanchen184/k8s-demo-app:latest</p>
            <p>kubectl set env deployment/shop-deploy MESSAGE="Hello from shop"</p>
            <p>kubectl expose deployment shop-deploy --name=shop-svc --port=80</p>
            <p className="text-slate-500 mt-1"># 2. 學員在 ingress-basic.yaml 加 /shop 路由，再 apply</p>
            <p>kubectl apply -f ingress-basic.yaml</p>
            <p className="text-slate-500 mt-1"># 3. 驗收</p>
            <p>curl http://{'<NODE-IP>'}/shop  <span className="text-green-400"># → Message: Hello from shop</span></p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">四個常見的坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-red-300">/etc/hosts 忘記改</strong> — curl 域名出現 could not resolve host</li>
            <li><strong className="text-red-300">ingressClassName 寫錯（nginx）</strong> — k3s 沒有 nginx Controller，ADDRESS 永遠空白，curl timeout</li>
            <li><strong className="text-red-300">ingressClassName 不寫</strong> — 叢集沒有 default IngressClass 時沒人認領，一樣 ADDRESS 空白</li>
            <li><strong className="text-red-300">pathType 沒填</strong> — apply 時直接報錯，必填欄位</li>
          </ul>
          <p className="text-slate-400 text-xs mt-2">最安全：永遠明確寫 <code className="text-green-400">ingressClassName: traefik</code></p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-1">清理</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded">
            <p>kubectl delete all --all</p>
            <p>kubectl delete ingress --all</p>
            <p className="text-slate-500"># 手動刪 /etc/hosts 的測試行</p>
          </div>
          <p className="text-yellow-300 text-xs mt-2">Ingress 搞定了，但設定寫死在 Image 裡... → 下一個 Loop</p>
        </div>
      </div>
    ),
    notes: `來帶大家走一遍。

Path-based routing 的部分。kubectl apply -f ingress-basic.yaml，一次建好 Deployment、Service、Ingress。kubectl get ingress 確認規則有建好。curl NODE-IP 斜線看到 nginx，curl NODE-IP 斜線 api 看到 httpd。

Host-based routing 的部分。kubectl apply -f ingress-host.yaml。改 /etc/hosts 加上域名映射。curl www.myapp.local 看到 nginx，curl api.myapp.local 看到 httpd。

三個常見的坑。

第一，/etc/hosts 忘記改。你 curl www.myapp.local 的時候如果出現 Could not resolve host，那就是 /etc/hosts 沒有加那一行。這是最常見的。

第二，ingressClassName 寫錯。k3s 的 Ingress Controller 是 Traefik，所以 ingressClassName 要寫 traefik。如果你寫了 nginx，K8s 會去找名字叫 nginx 的 Ingress Controller，k3s 沒有裝，找不到就沒人處理這條 Ingress，ADDRESS 一直空白，curl timeout，不是 connection refused。

還有一種情況是完全不寫 ingressClassName。行為取決於叢集有沒有 default IngressClass。有的話 K8s 自動用那個 Controller 處理；沒有的話，沒有任何 Controller 認領，一樣 ADDRESS 空白。kubectl describe ingress 會看到 Warning: no ingress class annotation or ingressClassName field。所以最安全的做法是永遠明確寫 ingressClassName: traefik，不要靠 default，換環境也不會壞。

第三，pathType 沒加。Ingress YAML 裡面每個 path 都必須指定 pathType，Prefix 或 Exact。這是必填欄位，漏了 kubectl apply 的時候就會報錯。

做完了記得清理。如果你不想讓 /etc/hosts 裡面留著測試用的域名映射，可以手動編輯把那一行刪掉。另外，kubectl delete -f ingress-basic.yaml 和 kubectl delete -f ingress-host.yaml 把資源也清掉。

好，Ingress 搞定了。現在使用者可以用漂亮的域名連到你的服務，不用再輸入 IP 加 Port 了。NodePort 的五個問題，Ingress 全部解決了。

但是，我要問大家另一個問題。你的服務跑起來了，使用者也連得到了。那你的 API 要連資料庫，資料庫的地址和密碼寫在哪裡？

如果你的答案是「寫在 Dockerfile 裡面」或者「寫死在 YAML 的 env 裡面」，那我們有新的問題要解決了。這就是下一個 Loop 要講的 ConfigMap 和 Secret。

[▶ 下一頁]`,
  },

  // ============================================================
  // 6-5：ConfigMap + Secret 概念（2 張）
  // ============================================================

  // ── 6-5（0/2）：這節做四件事（引導） ──
  {
    title: '這節做四件事',
    subtitle: 'ConfigMap env 注入 → Volume 掛載 → Secret → MySQL 整合',
    section: '6-5：ConfigMap + Secret 概念',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-3">步驟</th>
                <th className="pb-2 pr-3">YAML</th>
                <th className="pb-2">重點</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-3 text-cyan-400">Step 1</td>
                <td className="py-2 pr-3 font-mono text-xs text-green-400">configmap-literal.yaml</td>
                <td className="py-2">環境變數注入，改了要 rollout restart</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-3 text-cyan-400">Step 2</td>
                <td className="py-2 pr-3 font-mono text-xs text-green-400">configmap-nginx.yaml</td>
                <td className="py-2">Volume 掛載，改了 30 秒自動更新</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-3 text-cyan-400">Step 3</td>
                <td className="py-2 pr-3 text-slate-400 text-xs">指令建立</td>
                <td className="py-2">Secret 建立，觀察 Base64</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-3 text-cyan-400">Step 4</td>
                <td className="py-2 pr-3 font-mono text-xs text-green-400">secret-db.yaml</td>
                <td className="py-2">MySQL 同時用 Secret + ConfigMap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，概念講完了，動手做。今天的 ConfigMap 和 Secret 我們分四個步驟來做。

第一步，ConfigMap 的環境變數注入，用 configmap-literal.yaml。重點是理解「改了 ConfigMap，跑著的 Pod 不會自動更新」。

第二步，ConfigMap 的 Volume 掛載，用 configmap-nginx.yaml。重點是「改了 ConfigMap，30 到 60 秒後檔案自動更新」，跟第一步剛好對比。

第三步，Secret。不用 YAML，直接用 kubectl create secret 指令建。重點是親眼看到 Base64 是什麼樣子，然後解碼，確認 Base64 不是加密。

第四步，整合。用 secret-db.yaml，讓 MySQL 同時從 Secret 拿密碼、從 ConfigMap 拿資料庫名稱。這才是真實環境的標準模式。

四個步驟，開始。

[▶ 下一頁]`,
  },

  // ── 6-5（1/2）：ConfigMap 三種建立 + 兩種使用 ──
  {
    title: 'ConfigMap 概念 — 設定寫死的三大問題',
    subtitle: '三種建立方式 + 兩種注入方式（env vs Volume）',
    section: '6-5：ConfigMap + Secret 概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">設定寫死在 Image 的問題</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>dev 和 prod 的 DB 不一樣 → 要 build 兩個 Image？</li>
            <li>密碼寫在 Dockerfile → push 到 registry 全世界看到</li>
            <li>改一個環境變數 → 要重新 build + push + deploy</li>
          </ul>
        </div>
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">ConfigMap：設定跟 Image 分離</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-3">建立方式</th>
                <th className="pb-2">適合場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">--from-literal</td>
                <td className="py-1.5">快速測試 key=value</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">--from-file</td>
                <td className="py-1.5">整個設定檔（nginx.conf）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">YAML 定義</td>
                <td className="py-1.5">放 Git 版本管理（推薦）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">兩種注入方式</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-3">方式</th>
                <th className="pb-2 pr-3">更新行為</th>
                <th className="pb-2">適合</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">環境變數</td>
                <td className="py-1.5 pr-3 text-red-300">改了要重啟 Pod</td>
                <td className="py-1.5">簡單 key-value</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">Volume 掛載</td>
                <td className="py-1.5 pr-3 text-green-300">自動更新 30-60s</td>
                <td className="py-1.5">設定檔（subPath 不更新！）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `上一個 Loop 我們搞定了 Ingress，使用者可以用域名連到你的服務了。前端用 www.myapp.local，API 用 api.myapp.local，不用再記 IP 加 Port。很好。

但是，現在你的 API 要連資料庫。資料庫的地址在哪？

我看到很多人的做法是這樣。在 Dockerfile 裡面寫 ENV DB_HOST 等於 192.168.1.50，ENV DB_PORT 等於 3306，ENV DB_PASSWORD 等於 my-secret-pw。Build 成 Image，push 到 registry，deploy 到 K8s。看起來沒問題。

但你想過幾個問題嗎？

第一，你的 dev 環境資料庫在 dev-db 冒號 3306，prod 環境在 prod-db 冒號 3306。IP 不一樣。你是要 build 兩個 Image？myapp:dev 一個，myapp:prod 一個？就因為一個環境變數不一樣就要建兩個 Image？如果你有 dev、staging、prod 三個環境，是不是要建三個？加上國際版和國內版呢？五個？太荒謬了。

第二，密碼寫在 Dockerfile 裡面。你把 Image push 到 Docker Hub，如果 repo 是公開的，全世界的人都能 pull 你的 Image 然後 inspect 看到你的資料庫密碼。恭喜你，你的資料庫被駭了。就算是私有 repo，只要有人能 pull 你的 Image 就能看到密碼，安全風險很大。

第三，改一個設定就要重新 build Image。你只是想把 LOG_LEVEL 從 info 改成 debug 看一下日誌，結果要走一遍完整的 CI/CD pipeline：改 Dockerfile、build、push、deploy。就為了一個環境變數？

這些問題用 Docker 的經驗你都知道怎麼解決。不要把設定寫死在 Dockerfile 裡面，用 docker run -e 在啟動的時候注入。-e DB_HOST 等於什麼什麼，-e DB_PASSWORD 等於什麼什麼。設定跟 Image 分離，同一個 Image 不同環境用不同的參數啟動就好。

K8s 的做法一模一樣，只是工具升級了。一般設定用 ConfigMap，敏感資料用 Secret。

其實第四堂概念篇我們已經介紹過 ConfigMap 和 Secret 了。當時我們在講八大組件的時候提過，ConfigMap 管設定，Secret 管密碼。但那時候只是帶一句話，今天我們要真正搞懂它、用起來。

先講 ConfigMap。你可以把 ConfigMap 想成一個集中存放設定的物件。裡面就是 key-value，跟你寫 .env 檔案一樣。APP_ENV 等於 production，LOG_LEVEL 等於 info，DB_HOST 等於 prod-db。把這些東西存在 ConfigMap 裡面，然後讓 Pod 去引用它。

建立 ConfigMap 有三種方式。

第一種，用 kubectl 指令加上 --from-literal。kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info。快速方便，適合臨時測試。

第二種，用 --from-file。kubectl create configmap nginx-conf --from-file=nginx.conf。把一整個檔案存進 ConfigMap，key 就是檔案名稱，value 就是檔案內容。適合設定檔，像 nginx.conf、my.cnf 這種。

第三種，寫 YAML。apiVersion v1，kind ConfigMap，data 裡面列出所有的 key-value。這是最推薦的方式，因為 YAML 可以放進 Git 做版本管理。

建好了之後，怎麼讓 Pod 用到這些設定？兩種方式。

第一種是注入為環境變數。在 Pod 的 YAML 裡面用 envFrom 加上 configMapRef，就可以把 ConfigMap 裡面所有的 key 一次全部變成 Pod 裡的環境變數。或者用 env 加上 valueFrom configMapKeyRef 逐一指定。Pod 裡面的程式讀環境變數就能拿到。

第二種是掛載為 Volume。ConfigMap 裡面的每個 key 會變成一個檔案，value 就是檔案內容。這種方式適合設定檔。比如你要把自訂的 nginx.conf 掛進 Nginx 容器的 /etc/nginx/conf.d 目錄。

這兩種方式有一個很重要的差異：更新行為。如果你用環境變數注入，改了 ConfigMap 之後 Pod 不會自動更新，你必須 kubectl rollout restart 重啟 Pod 才會吃到新的值。因為環境變數是 process 啟動的時候讀一次就定死了。但如果你用 Volume 掛載，改了 ConfigMap 之後，Pod 裡面的檔案會在 30 到 60 秒內自動更新，不用重啟 Pod。不過這裡有一個坑：如果你用了 subPath 掛載，就不會自動更新。這個坑等一下實作的時候會講到。

[▶ 下一頁]`,
  },

  // ── 6-5（2/2）：Secret + Base64 + RBAC + Sealed Secret ──
  {
    title: 'Secret 概念 — 密碼不能放 ConfigMap',
    subtitle: 'Base64 不是加密 + RBAC 控權限 + Sealed Secret',
    section: '6-5：ConfigMap + Secret 概念',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ConfigMap vs Secret</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-3"></th>
                <th className="pb-2 pr-3">ConfigMap</th>
                <th className="pb-2">Secret</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-slate-400">用途</td>
                <td className="py-1.5 pr-3">一般設定</td>
                <td className="py-1.5">密碼、API Key、憑證</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-slate-400">儲存</td>
                <td className="py-1.5 pr-3">明文</td>
                <td className="py-1.5 text-yellow-300">Base64 編碼（不是加密！）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-slate-400">describe</td>
                <td className="py-1.5 pr-3">直接看到值</td>
                <td className="py-1.5">只顯示大小</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-3 text-slate-400">Docker 對照</td>
                <td className="py-1.5 pr-3">-e KEY=value</td>
                <td className="py-1.5">.env 密碼</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Secret 三種類型</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">Opaque</td>
                <td className="py-1.5">通用（最常用）— 密碼、API Key</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 pr-3 text-cyan-400">tls</td>
                <td className="py-1.5">TLS 憑證（Ingress HTTPS）</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-3 text-cyan-400">dockerconfigjson</td>
                <td className="py-1.5">Docker Registry 認證（拉私有 Image）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 p-3 rounded-lg">
          <p className="text-yellow-300 text-sm"><strong>Sealed Secret</strong>：用 RSA 加密後的 Secret 可安全放 Git，只有叢集內的 controller 能解密</p>
        </div>
      </div>
    ),
    notes: `好，ConfigMap 管一般設定。那密碼呢？

你不會把資料庫密碼放在 ConfigMap 裡面吧？ConfigMap 是明文的。你 kubectl get configmap app-config -o yaml，所有的值直接印出來。任何能跑 kubectl 的人都看得到。

密碼、API Key、SSL 憑證這些敏感資料，要用 Secret 來管。

Secret 和 ConfigMap 很像，都是存 key-value 的，建立和使用的方式幾乎一模一樣。差別在哪？首先，Secret 的值是用 Base64 編碼存的。其次，你 kubectl describe secret 的時候，它只會顯示每個 key 的大小，不會直接把值印出來。

但我要特別強調一件事。這件事第四堂概念篇我已經講過，但因為太重要了，我要再講一次。Base64 編碼不是加密。

echo -n "my-secret-pw" 用 pipe 接 base64，得到一串看起來像亂碼的字。但只要反過來 echo 那串字 pipe base64 -d，馬上就解回明文。任何人都能做。所以 Secret 的安全性不是靠 Base64 編碼，而是靠 RBAC 權限控制。只有被授權的人才能 kubectl get secret。RBAC 怎麼設第七堂會教。

Secret 有三種類型。最常用的是 Opaque，就是通用型，密碼、API Key 都放這裡。kubernetes.io/tls 專門存 TLS 憑證，就是剛才 Ingress HTTPS 提到的那個。kubernetes.io/dockerconfigjson 是存 Docker Registry 的帳號密碼，讓 kubelet 能拉私有 Image。

最後快速提兩分鐘 Sealed Secret。在真實的生產環境，你不會把 Secret 的 YAML 直接 commit 到 Git。因為就算是私有 repo，裡面的 Base64 值一解碼密碼就曝光了。但你又想要所有的 K8s 資源都用 Git 管版本，這就矛盾了。

Sealed Secret 是一個開源工具，它用 RSA 非對稱加密把你的 Secret 加密成 SealedSecret。加密後的 YAML 可以安全地 commit 到 Git，因為只有叢集裡面的 controller 有私鑰能解密。外面的人看到加密後的值也沒用。這就解決了「Secret 怎麼放進 Git」的問題。今天不深入 Sealed Secret，知道有這個東西就好。

用 Docker 的經驗做最後的對照。Docker 的 -e KEY=value 對應 K8s 的 ConfigMap。Docker 的 .env 密碼檔對應 K8s 的 Secret。Docker 的 -v ./nginx.conf:/etc/nginx/nginx.conf 對應 ConfigMap 的 Volume 掛載。概念完全一樣，管理方式更結構化了。

好，概念夠了，接下來動手做。

[▶ 下一頁]`,
  },

  // ============================================================
  // 6-6：ConfigMap + Secret 實作（2 張 + 1 張學員實作）
  // ============================================================

  // ── 6-6（1/2）：ConfigMap env + Volume 掛載 ──
  {
    title: 'ConfigMap 實作 — 環境變數注入 + Volume 掛載',
    subtitle: 'env 注入改了要重啟 / Volume 掛載 30-60s 自動更新',
    section: '6-6：ConfigMap + Secret 實作',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 1：環境變數注入</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>ConfigMap 存 MESSAGE / USERNAME</li>
            <li>Pod 用 envFrom + configMapRef 注入</li>
            <li>改 ConfigMap → Pod <strong className="text-red-300">不會</strong>自動更新</li>
            <li><code className="text-green-400">kubectl rollout restart</code> → 才生效</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 2：Volume 掛載</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>ConfigMap 存 nginx.conf 設定</li>
            <li>Volume 掛載到 /etc/nginx/conf.d</li>
            <li>改 ConfigMap → 檔案 <strong className="text-green-300">自動更新</strong>（30-60s）</li>
            <li>但 Nginx 要手動 <code className="text-green-400">nginx -s reload</code></li>
            <li className="text-yellow-300">坑：subPath 掛載不會自動更新！</li>
          </ul>
        </div>
      </div>
    ),
    code: `# Step 1：ConfigMap 環境變數注入
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/configmap-literal.yaml
kubectl get pods -l app=frontend -w
# 等 Pod Running 後 curl 看環境變數
curl http://<NODE-IP>:30080/frontend
# Server: 10.42.x.x:80
# Message: Hello from ConfigMap
# Username: admin

# 改 ConfigMap → Pod 不會自動更新
kubectl edit configmap app-config   # 把 USERNAME 改成 student
curl http://<NODE-IP>:30080/frontend      # 還是 admin！
kubectl rollout restart deployment/frontend-deploy        # 重啟才生效
curl http://<NODE-IP>:30080/frontend      # 現在是 student

# Step 2：ConfigMap Volume 掛載
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/configmap-nginx.yaml
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
curl http://<NODE-IP>:30090/healthz  # → OK

# 改 ConfigMap
kubectl edit configmap nginx-config   # 把 'OK' 改成 'HEALTHY'

# 馬上 reload → 還是 OK！（檔案還沒更新）
kubectl exec deploy/nginx-custom -- nginx -s reload
curl http://<NODE-IP>:30090/healthz  # 還是 OK！

# 等 30-60 秒 → 檔案自動更新
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf  # 已是 HEALTHY
# 現在 reload 才有效
kubectl exec deploy/nginx-custom -- nginx -s reload
curl http://<NODE-IP>:30090/healthz  # → HEALTHY`,
    notes: `好，概念講完了，四個步驟，一步一步做。

第一步，ConfigMap 的環境變數注入。

kubectl apply -f ~/workspace/k8s-course-labs/lesson6/configmap-literal.yaml

這個 YAML 裡面有一個 ConfigMap 叫 app-config，存了 MESSAGE 和 USERNAME 兩個設定。還有一個 Deployment，用 yanchen184/k8s-demo-app 這個 image，它會把環境變數的值顯示在 HTTP response 裡面。

等 Pod 跑起來。

kubectl get pods -l app=frontend -w，等到 Running。

來驗證一下。

curl http://&lt;NODE-IP&gt;:30080/frontend

你會看到 Message: Hello from ConfigMap 和 Username: admin 這樣的輸出。ConfigMap 的值成功注入為環境變數了。

現在來做一個重要的實驗。我們改 ConfigMap，看看 Pod 會不會自動更新。

kubectl edit configmap app-config

找到 USERNAME，從 admin 改成 student，存檔。

現在再 curl 一下。你猜結果是什麼？

還是 admin。沒有更新。

為什麼？因為環境變數是在 Pod 啟動的時候注入的。Pod 的 process 拿到環境變數之後就定死了，ConfigMap 後來改了，已經跑著的 process 不知道。就像你啟動一個 Java 程式的時候傳了 -D 參數，程式啟動之後你再怎麼改那個參數檔，跑著的 JVM 也不會感應到。

要讓新的值生效，你得重啟 Pod。

kubectl rollout restart deployment/frontend-deploy

等新的 Pod 起來，再 curl，現在才顯示 student。

記住這個行為：環境變數注入，改了 ConfigMap 要重啟 Pod 才生效。

第二步，ConfigMap 的 Volume 掛載。

kubectl apply -f ~/workspace/k8s-course-labs/lesson6/configmap-nginx.yaml

這個 YAML 裡面有一個 ConfigMap 叫 nginx-config，裡面存了一段 Nginx 設定，定義了一個 /healthz 端點回傳 OK。還有一個 Nginx 的 Deployment，用 volumes 和 volumeMounts 把 ConfigMap 掛載到 /etc/nginx/conf.d 目錄。

先確認設定檔有掛進去。

kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf

看到我們寫的那段 Nginx 設定。

來測試一下。curl http://&lt;NODE-IP&gt;:30090/healthz，回 OK。完美。

現在來測試 Volume 掛載的熱更新。改 ConfigMap。

kubectl edit configmap nginx-config

把 return 200 後面的 OK 改成 HEALTHY，存檔。

**改完馬上 reload，不等。**

kubectl exec deploy/nginx-custom -- nginx -s reload

然後 curl。

curl http://&lt;NODE-IP&gt;:30090/healthz

還是 OK。為什麼？因為 ConfigMap 的新內容還沒同步到 Pod 裡的檔案，nginx reload 了也是讀舊的，所以沒用。

現在等 30 到 60 秒，再看檔案。

kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf

現在檔案變成 HEALTHY 了。kubelet 定期把 ConfigMap 的新內容同步進來，不用重啟 Pod。

但 nginx 程式本身還不知道，要再 reload 一次。

kubectl exec deploy/nginx-custom -- nginx -s reload

現在再 curl，回 HEALTHY 了。

記住這個對比：env 注入改了，reload 完全沒用，要 rollout restart。Volume 掛載改了，要等檔案同步，同步完再 reload 才生效。

這裡有一個坑要提醒。如果你用 subPath 掛載，就是只掛一個檔案而不是覆蓋整個目錄，那熱更新不會生效。這是 K8s 的已知行為。所以如果你需要熱更新功能，不要用 subPath。但不用 subPath 的話，整個目錄會被 ConfigMap 覆蓋，原本目錄裡的其他檔案會不見。這是一個取捨，要根據你的場景選擇。

[▶ 下一頁]`,
  },

  // ── 6-6（2/2）：Secret 建立 + MySQL 整合 ──
  {
    title: 'Secret 實作 + MySQL 整合',
    subtitle: 'Secret 建立 → Base64 驗證 → MySQL 用 Secret 設密碼',
    section: '6-6：ConfigMap + Secret 實作',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3：Secret 建立 + 驗證</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl create secret generic db-cred</code></li>
            <li><code className="text-green-400">kubectl describe secret</code> → 只顯示 bytes 大小</li>
            <li><code className="text-green-400">kubectl get secret -o yaml</code> → 看到 Base64</li>
            <li><code className="text-green-400">echo Base64值 | base64 -d</code> → 明文（<strong className="text-yellow-300">不是加密！</strong>）</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 4：整合 — app 同時引用 Secret + ConfigMap</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">app-secret</code>（stringData）→ PASSWORD</li>
            <li><code className="text-green-400">app-config</code>（ConfigMap）→ MESSAGE / USERNAME</li>
            <li>envFrom 同時引用兩個，Pod 一次拿到所有環境變數</li>
            <li>curl 看到 <code className="text-green-400">Username: admin</code> + <code className="text-green-400">Password: mypassword</code></li>
          </ul>
        </div>
        <div className="bg-slate-800/30 border border-slate-600/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs font-semibold mb-1">YAML 寫法：stringData vs data</p>
          <table className="w-full text-xs font-mono">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1 pr-3 text-cyan-400">stringData</td>
                <td className="py-1">直接寫明文，K8s 自動做 Base64</td>
              </tr>
              <tr>
                <td className="py-1 pr-3 text-slate-500">data</td>
                <td className="py-1 text-slate-500">值必須先手動 base64 編碼</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Step 3：Secret 建立 + 驗證
kubectl create secret generic db-cred \\
  --from-literal=username=admin \\
  --from-literal=password=my-secret-pw
kubectl describe secret db-cred      # 只顯示大小
kubectl get secret db-cred -o yaml   # 看到 Base64
echo "bXktc2VjcmV0LXB3" | base64 -d # → my-secret-pw

# Step 4：整合 — env 注入 vs Volume 掛載，同一個 ConfigMap 兩種行為
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/secret-db.yaml
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/ingress-step4.yaml   # 只加 Ingress 路由
kubectl get pods -l app=frontend -w
curl http://<NODE-IP>/frontend   # Username: admin / Password: mypassword
curl http://<NODE-IP>/config     # APP_MODE=production / FEATURE_FLAG=false

# 同時改 USERNAME（env 注入）和 config.txt（Volume 掛載）
kubectl edit configmap app-config   # USERNAME→newuser, APP_MODE→debug

# 馬上 curl，兩個都沒變（正常）
curl http://<NODE-IP>/frontend   # Username: admin（舊的）
curl http://<NODE-IP>/config     # APP_MODE=production（舊的）

# 等 30-60s，再 curl → 對比出來了！
curl http://<NODE-IP>/config     # APP_MODE=debug ← Volume 自動更新
curl http://<NODE-IP>/frontend   # Username: admin ← env 注入沒動

# rollout restart，env 才生效；/config 依然是 debug
kubectl rollout restart deployment/frontend-deploy
kubectl get pods -l app=frontend -w
curl http://<NODE-IP>/frontend   # Username: newuser ← 重啟後才生效
curl http://<NODE-IP>/config     # APP_MODE=debug ← 不受重啟影響`,
    notes: `第三步，Secret。

不用寫 YAML，直接用指令建。

kubectl create secret generic db-cred --from-literal=username=admin --from-literal=password=my-secret-pw

建好了，看看長什麼樣。

kubectl describe secret db-cred

注意看，它只顯示每個 key 的大小，username 5 bytes，password 12 bytes。不會直接秀值，跟 ConfigMap 不一樣。

但如果你用 -o yaml 看呢？

kubectl get secret db-cred -o yaml

看到 Base64 編碼的值。隨便挑一個 decode 一下，echo 那串字 pipe base64 -d，得到明文。所以我再三強調，Base64 不是加密。安全性靠的是 RBAC 限制誰能 kubectl get secret。

Secret 注入 Pod 的方式跟 ConfigMap 一模一樣，envFrom 或 Volume 掛載，YAML 寫法幾乎一樣，只是把 configMapRef 換成 secretRef。

第四步，整合。這次我們用 yanchen184/k8s-demo-app，同時 envFrom 引用 ConfigMap 和 Secret。

kubectl apply -f ~/workspace/k8s-course-labs/lesson6/secret-db.yaml

這個 YAML 裡面有一個 ConfigMap 存了 MESSAGE 和 USERNAME，一個 Secret 叫 app-secret 存了 PASSWORD，一個 Deployment 用 envFrom 同時引用兩者，還有一個 NodePort Service。

等 Pod 跑起來。kubectl get pods -l app=frontend -w，等到 Running。

驗證一下。

curl http://&lt;NODE-IP&gt;/frontend

你會看到四行輸出：Server 是 Pod 的 IP、Message 是 Hello K8s、Username 是 admin、Password 是 mypassword。ConfigMap 的值和 Secret 的值同時出現了。

這就是今天最重要的對比實驗。同一份 ConfigMap，同時用兩種方式注入，改了之後行為完全不同。

kubectl apply -f ~/workspace/k8s-course-labs/lesson6/secret-db.yaml，kubectl apply -f ~/workspace/k8s-course-labs/lesson6/ingress-basic.yaml。

等 Pod 跑起來。

curl /frontend，看到 Username: admin，Password: mypassword。curl /config，看到 APP_MODE=production。

現在同時改 ConfigMap 裡的 USERNAME 和 config.txt。

kubectl edit configmap app-config，USERNAME 改成 newuser，APP_MODE 改成 debug，存檔。

馬上 curl 兩個端點。兩個都還是舊的，這是正常的。

等 30 到 60 秒，再 curl /config。

APP_MODE=debug 出來了。Volume 掛載的檔案自動同步了。

再 curl /frontend。還是 admin。env 注入完全沒動。

同一個 ConfigMap，同一個時間改，兩個端點行為完全不同。這就是今天要記住的事。

要讓 env 生效，rollout restart。

kubectl rollout restart deployment/frontend-deploy

等新 Pod 起來，curl /frontend，現在才是 newuser。

結論：env 注入改了要 rollout restart。Volume 掛載改了 30-60 秒自動同步。

[▶ 下一頁]`,
  },

  // ── 6-7（學員實作）──
  {
    title: '學員實作：自己的 ConfigMap + Secret',
    subtitle: '必做：用自己的值跑 Step 4 / 挑戰：觀察 env vs Volume 更新差異',
    section: '6-7：回頭操作 Loop 2',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">必做題</p>
          <p className="text-slate-400 text-xs mb-2">自己的名字、自己的密碼，跑出來才算你的</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>用 <code className="text-cyan-400">kubectl create configmap</code> 建 <code className="text-green-400">app-config</code>（MESSAGE、USERNAME 填你的）</li>
            <li>用 <code className="text-cyan-400">kubectl create secret</code> 建 <code className="text-green-400">app-secret</code>（PASSWORD 填你的）</li>
            <li>apply <code className="text-green-400">student-deploy.yaml</code> + <code className="text-green-400">ingress-step4.yaml</code></li>
            <li>curl <code className="text-cyan-400">/frontend</code> 看到自己的 Username 和 Password</li>
            <li>curl <code className="text-cyan-400">/config</code> 看到 APP_MODE=student</li>
          </ol>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">挑戰題</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-cyan-400">kubectl edit configmap app-config</code>，同時改 USERNAME 和 APP_MODE</li>
            <li>馬上 curl 兩個端點 → 都沒變</li>
            <li>等 30-60 秒 → <code className="text-green-400">/config</code> 自動更新，<code className="text-yellow-400">/frontend</code> 沒動</li>
            <li>rollout restart → <code className="text-green-400">/frontend</code> 才更新</li>
          </ol>
        </div>
      </div>
    ),
    notes: `學員實作時間。

必做題：你要用自己的名字和密碼。

kubectl create configmap app-config --from-literal=MESSAGE="Hello from 你的名字" --from-literal=USERNAME=你的名字 --from-literal=config.txt=$'APP_MODE=student\\nFEATURE_FLAG=true'

kubectl create secret generic app-secret --from-literal=PASSWORD=你的密碼

然後 apply student-deploy.yaml 和 ingress-step4.yaml。等 Pod 起來，curl /frontend 看到你自己的 Username 和 Password，curl /config 看到 APP_MODE=student。

挑戰題：kubectl edit configmap app-config，同時改 USERNAME 和 APP_MODE。馬上 curl，兩個都沒變。等 30 到 60 秒再 curl，/config 更新了，/frontend 還是舊的。這就是 env 注入和 Volume 掛載的核心差異。rollout restart 後 /frontend 才更新。

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ── 6-7（學員實作解答）──
  {
    title: '解答：自己的 ConfigMap + Secret',
    subtitle: '必做解答 + 三個常見坑 + 清理',
    section: '6-7：回頭操作 Loop 2',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做題解答</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded space-y-1">
            <p className="text-slate-500"># 1. 建 ConfigMap</p>
            <p>kubectl create configmap app-config \</p>
            <p>{'  '}--from-literal=MESSAGE="Hello from Bob" \</p>
            <p>{'  '}--from-literal=USERNAME=Bob \</p>
            <p>{`  `}--from-literal=config.txt=${'\'APP_MODE=student\\nFEATURE_FLAG=true\''}</p>
            <p className="text-slate-500 mt-1"># 2. 建 Secret</p>
            <p>kubectl create secret generic app-secret \</p>
            <p>{'  '}--from-literal=PASSWORD=my-own-password</p>
            <p className="text-slate-500 mt-1"># 3. apply + 驗收</p>
            <p>kubectl apply -f student-deploy.yaml</p>
            <p>kubectl apply -f ingress-step4.yaml</p>
            <p>curl http://{'<NODE-IP>'}/frontend  <span className="text-slate-500"># Username: Bob</span></p>
            <p>curl http://{'<NODE-IP>'}/config    <span className="text-slate-500"># APP_MODE=student</span></p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">三個常見的坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-red-300">ConfigMap 名字打錯</strong> — YAML 裡的 configMapRef.name 要跟建立時一樣</li>
            <li><strong className="text-red-300">config.txt 沒有換行</strong> — <code className="text-slate-400">$'...\n...'</code> 語法才有換行</li>
            <li><strong className="text-red-300">env 注入改了不會動</strong> — 要 rollout restart，Volume 掛載才會自動更新</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-1">清理</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded">
            <p>kubectl delete all --all</p>
            <p>kubectl delete configmap --all</p>
            <p>kubectl delete secret --all</p>
            <p>kubectl delete ingress --all</p>
            <p>kubectl get all  <span className="text-slate-500"># 確認只剩 kubernetes Service</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `來對答案。

kubectl create configmap app-config，三個 key：MESSAGE、USERNAME、config.txt。config.txt 要用 $'...' 語法才有換行。

kubectl create secret generic app-secret，PASSWORD 填自己的。

apply student-deploy.yaml 和 ingress-step4.yaml，curl /frontend 看到自己的名字和密碼，curl /config 看到 APP_MODE=student。

三個常見的坑：

第一，ConfigMap 名字打錯。YAML 裡的 configMapRef.name 是 app-config，你建的時候也要叫 app-config，名字不對 Pod 起不來。

第二，config.txt 沒有換行。要用 $'APP_MODE=student\\nFEATURE_FLAG=true' 這個語法，\\n 才會變成真正的換行。

第三，env 注入改了不會動。這是今天的核心觀念，Volume 掛載才會自動更新，env 注入要 rollout restart。

好，清理。kubectl delete all --all，kubectl delete configmap --all，kubectl delete secret --all，kubectl delete ingress --all。kubectl get all 確認只剩 kubernetes Service 就乾淨了。

到目前為止 Ingress、ConfigMap、Secret 都學了。上午的內容到這裡，休息一下，下午繼續。

[▶ 下一頁]`,
  },

  // ============================================================
  // 6-11：PV + PVC 概念
  // ============================================================
  {
    title: 'PV + PVC 概念 — 讓資料跟著儲存空間走，不跟 Pod 走',
    subtitle: '為什麼 Pod 重建資料會消失？PV/PVC 兩層設計解決什麼問題',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-700/40 p-3 rounded-lg">
            <p className="text-red-400 font-semibold text-sm mb-2">問題</p>
            <p className="text-slate-300 text-sm">Pod 重建 → 容器 overlay filesystem 消失 → 資料不見</p>
          </div>
          <div className="bg-green-900/20 border border-green-700/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-2">解法</p>
            <p className="text-slate-300 text-sm">PV（管理員建儲存空間）+ PVC（開發者申請使用）→ K8s 自動配對（Binding）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">PV vs PVC 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">K8s 概念</th>
                <th className="pb-2 pr-4">Docker 對照</th>
                <th className="pb-2">角色</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4 text-cyan-400">PV (PersistentVolume)</td>
                <td className="py-1.5 pr-4"><code className="text-slate-400">docker volume create</code></td>
                <td className="py-1.5">管理員規劃儲存空間</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1.5 pr-4 text-cyan-400">PVC (PersistentVolumeClaim)</td>
                <td className="py-1.5 pr-4"><code className="text-slate-400">-v 掛載</code></td>
                <td className="py-1.5">開發者申請使用</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">AccessMode</p>
            <table className="w-full text-xs">
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-yellow-400 font-mono">RWO</td>
                  <td className="py-1">ReadWriteOnce — 單 Node 讀寫</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-yellow-400 font-mono">ROX</td>
                  <td className="py-1">ReadOnlyMany — 多 Node 唯讀</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-yellow-400 font-mono">RWX</td>
                  <td className="py-1">ReadWriteMany — 多 Node 讀寫（需 NFS）</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">ReclaimPolicy</p>
            <table className="w-full text-xs">
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-green-400 font-mono">Retain</td>
                  <td className="py-1">PVC 刪了 PV 資料保留（生產用）</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-orange-400 font-mono">Delete</td>
                  <td className="py-1">PVC 刪了 PV 一起刪（開發用）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    notes: `這節純概念，不跑指令。容器有自己的 overlay filesystem，writable layer 跟容器同生同死，容器刪了資料就不見了。解法是 PV 和 PVC。PV 是管理員規劃的儲存空間，可以是本機硬碟、NFS、雲端硬碟。PVC 是開發者的申請書，說我要多大、什麼 AccessMode，K8s 自動找符合的 PV 配對，這叫 Binding。AccessMode 三種：RWO 只有一個 Node 可以讀寫（資料庫最常用），ROX 多個 Node 唯讀，RWX 多個 Node 可以讀寫（需要 NFS）。ReclaimPolicy：Retain 是 PVC 刪了 PV 資料保留（生產用），Delete 是 PVC 刪了 PV 一起刪（開發用）。好，開始做。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-12：PV + PVC 實作
  // ============================================================
  {
    title: 'PV + PVC 實作 — MySQL 資料持久化驗證',
    subtitle: '建 PV → 建 PVC → Binding → MySQL 掛載 → 砍 Pod → 資料還在',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">流程步驟</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 PV（管理員規劃儲存空間）</li>
            <li>建 PVC（開發者申請使用）</li>
            <li>等 Binding（K8s 自動配對）</li>
            <li>進 MySQL 寫資料</li>
            <li>砍 Pod（Deployment 自動重建）</li>
            <li>驗證資料還在</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">YAML 重點摘要</p>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-yellow-400 mb-1">PV</p>
              <p className="text-slate-300">storageClassName: manual</p>
              <p className="text-slate-300">hostPath: /tmp/k8s-pv-data</p>
            </div>
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-yellow-400 mb-1">PVC</p>
              <p className="text-slate-300">storageClassName: manual</p>
              <p className="text-slate-400">（要跟 PV 一致）</p>
              <p className="text-slate-300">requests: 1Gi</p>
            </div>
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-yellow-400 mb-1">Deployment</p>
              <p className="text-slate-300">volumes:</p>
              <p className="text-slate-300 pl-2">persistentVolume</p>
              <p className="text-slate-300 pl-4">ClaimName: ...</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-700/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">PVC Pending 排查</p>
          <ul className="text-slate-300 text-xs space-y-0.5 list-disc list-inside">
            <li>storageClassName 不一致</li>
            <li>PV 容量不夠（requests 超過 PV capacity）</li>
            <li>accessModes 不匹配</li>
          </ul>
        </div>
      </div>
    ),
    code: `kubectl apply -f ~/workspace/k8s-course-labs/lesson6/pv-pvc.yaml
kubectl get pv    # STATUS: Bound
kubectl get pvc   # STATUS: Bound

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
# CREATE DATABASE testdb; USE testdb;
# CREATE TABLE users (id INT, name VARCHAR(50));
# INSERT INTO users VALUES (1, 'Alice');
# SELECT * FROM users;  → Alice 在

kubectl delete pod -l app=mysql   # 砍 Pod，Deployment 自動重建

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
# USE testdb; SELECT * FROM users;  → Alice 還在！

# PVC Pending 排查
kubectl describe pvc local-pvc   # 看 Events 區塊`,
    notes: `先把流程講一遍：管理員建 PV → 開發者建 PVC → K8s 自動配對 Binding → Pod 掛載 PVC → 資料跟 PV 走不跟 Pod 走。這叫靜態佈建，PV 要先手動建好。好，apply。看 PV 和 PVC 的狀態，kubectl get pv，STATUS 要是 Bound，代表已配對到 PVC。kubectl get pvc，STATUS 也要是 Bound。如果是 Pending 就有問題，三個原因：storageClassName 不一致、PV 容量不夠、accessModes 不匹配。進 MySQL 建 testdb，寫一筆 Alice 進去，exit。砍 Pod。等新 Pod 起來，再進去 USE testdb; SELECT，Alice 還在。這就是 PVC 掛載的效果，資料跟著 PV 走，不跟 Pod 走。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-13：學員實作 — PVC Pending 故障診斷
  // ============================================================
  {
    title: '學員實作：PVC Pending 故障診斷',
    subtitle: '必做：找出三個錯誤讓 PVC Bound / 挑戰：觀察 PV 1:1 限制',
    section: '6-13：回頭操作 Loop 3',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">必做題</p>
          <p className="text-slate-300 text-sm mb-2">給一個有三個錯誤的 YAML，找出來修好，讓 <code className="text-slate-400">kubectl get pv,pvc</code> 兩個都是 Bound：</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><span className="text-red-400">錯誤一：</span>accessModes: RWX → 應改為 RWO（hostPath 只支援 RWO）</li>
            <li><span className="text-red-400">錯誤二：</span>storageClassName 不一致（PV 和 PVC 要完全一樣）</li>
            <li><span className="text-red-400">錯誤三：</span>requests: 2Gi 超過 PV 的 1Gi（改成 1Gi 或調大 PV 容量）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">挑戰題</p>
          <p className="text-slate-300 text-sm">再建一個 local-pvc2，觀察 STATUS 是 Pending，說明為什麼。</p>
          <p className="text-slate-400 text-xs mt-1">提示：一個 PV 只能給一個 PVC（1:1 限制）</p>
        </div>
      </div>
    ),
    code: `# 必做：修好後驗證
kubectl apply -f broken-pv-pvc.yaml
kubectl get pv,pvc   # 兩個都要 Bound

# 挑戰：PV 1:1 限制
kubectl apply -f local-pvc2.yaml
kubectl get pvc      # local-pvc2 會是 Pending
kubectl describe pvc local-pvc2   # 看 Events 說明原因

# 清理
kubectl delete deployment mysql-deploy
kubectl delete pvc local-pvc
kubectl delete pv local-pv`,
    notes: `學員實作。必做題：我給你一個有問題的 YAML，三個錯誤，找出來修好。錯誤一：accessModes RWX 改 RWO，hostPath 只支援 RWO。錯誤二：storageClassName 不一致，PV 和 PVC 要完全一樣。錯誤三：requests 2Gi 超過 PV 的 1Gi，改成 1Gi 或把 PV 容量調大。修好後 kubectl apply，get pv,pvc 兩個都是 Bound。挑戰：再建一個 local-pvc2，PV 已被 local-pvc 佔走，一個 PV 只能給一個 PVC，所以 local-pvc2 一直 Pending。清理：先刪 mysql-deploy，再刪 PVC，最後刪 PV（順序很重要，不然刪不掉）。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-14：StorageClass + StatefulSet 概念
  // ============================================================
  {
    title: 'StorageClass + StatefulSet 概念',
    subtitle: 'Deployment 跑 DB 的四個問題 → StatefulSet 三個保證 → Headless Service',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-700/40 p-3 rounded-lg">
            <p className="text-red-400 font-semibold text-sm mb-2">Deployment 的問題</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li>Pod 名稱帶 random hash，不知道哪個是主庫</li>
              <li>所有 Pod 同時啟動，主庫未就緒從庫就連入</li>
              <li>共用同一個 PVC，多個 MySQL 同時寫同一塊磁碟</li>
              <li>普通 Service 做 load balance，無法指定連哪個 Pod</li>
            </ul>
          </div>
          <div className="bg-green-900/20 border border-green-700/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-2">StatefulSet 的解法</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li>固定名稱：mysql-0 / mysql-1 / mysql-2</li>
              <li>有序啟動：mysql-0 Ready 才建 mysql-1</li>
              <li>volumeClaimTemplates 自動建獨立 PVC</li>
              <li>Headless Service DNS：mysql-0.mysql-headless</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">動態佈建</p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">PVC</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StorageClass provisioner</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">自動建 PV</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">Deployment vs StatefulSet</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-4">特性</th>
                <th className="pb-1 pr-4">Deployment</th>
                <th className="pb-1">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">Pod 名稱</td>
                <td className="py-1 pr-4 text-slate-400">random hash</td>
                <td className="py-1 text-green-400">固定序號 (0/1/2)</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">啟動順序</td>
                <td className="py-1 pr-4 text-slate-400">同時啟動</td>
                <td className="py-1 text-green-400">有序啟動</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">儲存</td>
                <td className="py-1 pr-4 text-slate-400">共用 PVC</td>
                <td className="py-1 text-green-400">獨立 PVC</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">DNS</td>
                <td className="py-1 pr-4 text-slate-400">ClusterIP 輪詢</td>
                <td className="py-1 text-green-400">Headless，可指定 Pod</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `Deployment 跑 DB 根本上有四個問題。Pod 名稱帶 random hash，你不知道哪個是主庫。所有 Pod 同時啟動，主庫還沒起來從庫就連進來了。所有 Pod 共用同一個 PVC，三個 MySQL 同時寫同一塊磁碟，資料直接壞掉。普通 Service 做 load balance，你不能指定「連 mysql-0 寫、連 mysql-1 讀」。StatefulSet 全部解決。固定名稱 mysql-0、mysql-1、mysql-2。有序啟動，mysql-0 Ready 才建 mysql-1。volumeClaimTemplates 自動為每個 Pod 建獨立 PVC。Headless Service（clusterIP: None）讓每個 Pod 有自己的 DNS，mysql-0.mysql-headless 直接連到 mysql-0。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-15：StatefulSet MySQL 實作
  // ============================================================
  {
    title: 'StatefulSet MySQL 實作 — 三個保證全部驗證',
    subtitle: '有序啟動 → 獨立 PVC → 砍 Pod → 資料還在 → Scale 擴縮容',
    section: '6-15：StatefulSet 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">YAML 重點</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-yellow-400">serviceName: mysql-headless</code>（必填，Headless Service 名稱）</li>
            <li><code className="text-yellow-400">volumeClaimTemplates</code>（在 spec 下，和 template 同級）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">驗證清單</p>
          <table className="w-full text-xs">
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-green-400">有序啟動</td>
                <td className="py-1">kubectl get pods -w，mysql-0 Running 後 mysql-1 才建</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-green-400">Pod 名稱固定</td>
                <td className="py-1">mysql-0、mysql-1（不是 random hash）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-green-400">獨立 PVC</td>
                <td className="py-1">mysql-data-mysql-0、mysql-data-mysql-1（自動建的）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-green-400">資料持久化</td>
                <td className="py-1">砍 Pod 重建後資料還在</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-green-400">Scale 有序</td>
                <td className="py-1">擴容正序，縮容反序</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `kubectl get storageclass   # 確認有 local-path (default)
# 動態佈建：只要建 PVC，local-path provisioner 自動幫你建 PV，不用手動

kubectl apply -f ~/workspace/k8s-course-labs/lesson6/statefulset-mysql.yaml
kubectl get pods -w        # 觀察 mysql-0 Running 後 mysql-1 才建

kubectl get pods -l app=mysql-sts   # NAME: mysql-0, mysql-1（不是 random hash）
kubectl get pvc                     # mysql-data-mysql-0, mysql-data-mysql-1（自動建的）

# 資料持久化驗證
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
kubectl delete pod mysql-0           # 砍掉
kubectl get pods -w                  # 等重建，名字還是 mysql-0
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
# → testdb 還在！

# Headless Service DNS 驗證
kubectl run dns-test --image=busybox:1.28 --restart=Never --rm -it -- nslookup mysql-0.mysql-headless
# → 解析到 mysql-0 的 Pod IP，不是 ClusterIP

# Scale
kubectl scale statefulset mysql --replicas=3
kubectl get pods -w    # mysql-2 最後建
kubectl scale statefulset mysql --replicas=2
kubectl get pods -w    # mysql-2 先 Terminating（反序）
kubectl delete pvc mysql-data-mysql-2`,
    notes: `先確認 StorageClass，kubectl get storageclass，看到 local-path (default) 才繼續。帶一句：這就是動態佈建——等一下你建 PVC 的時候不需要手動建 PV，local-path provisioner 全自動。apply statefulset-mysql.yaml，立刻 kubectl get pods -w，看有序啟動：mysql-0 ContainerCreating、mysql-0 Running、然後 mysql-1 才 Pending。Ctrl+C 後看 pod 名稱是 mysql-0、mysql-1，不是 random hash。kubectl get pvc，看到 mysql-data-mysql-0 和 mysql-data-mysql-1，你沒有手動建任何 PVC，StatefulSet 自動幫你建的。驗證資料持久化：exec 到 mysql-0 建 testdb，delete pod mysql-0，等重建，再 exec 確認 testdb 還在。驗證 Headless Service DNS：跑 busybox nslookup mysql-0.mysql-headless，看到它解析到 Pod IP 而不是 ClusterIP——這就是每個 Pod 有自己 DNS 的效果。最後 Scale 到 3 看有序擴容，Scale 回 2 看反序縮容，記得手動刪 mysql-data-mysql-2 這個殘留的 PVC。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-16：學員實作 — Redis StatefulSet
  // ============================================================
  {
    title: '學員實作：Redis StatefulSet',
    subtitle: '必做：Redis 2 副本 + 獨立 PVC + Pod 重建名稱不變 / 挑戰：Scale 驗證有序',
    section: '6-16：回頭操作 Loop 4',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">必做</p>
          <p className="text-slate-300 text-sm mb-2">寫 Redis StatefulSet（image: redis:7，2 副本，500Mi），驗證三件事：</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>get pods 看到 redis-0 和 redis-1</li>
            <li>get pvc 看到兩個獨立的 PVC</li>
            <li>砍掉 redis-0 等重建確認名字還是 redis-0</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">挑戰</p>
          <p className="text-slate-300 text-sm">Scale mysql 到 3 看有序擴容，Scale 回 1 確認 mysql-2 先被刪（反序）。</p>
        </div>
      </div>
    ),
    code: `kubectl apply -f ~/workspace/k8s-course-labs/lesson6/redis-statefulset.yaml
kubectl get pods -w          # redis-0 先建，redis-1 後建
kubectl get pvc              # redis-data-redis-0, redis-data-redis-1

kubectl delete pod redis-0   # 砍掉
kubectl get pods -w          # 重建後名字還是 redis-0

# 挑戰
kubectl scale statefulset mysql --replicas=3
kubectl get pods -w
kubectl scale statefulset mysql --replicas=1
kubectl get pods -w          # mysql-2 先 Terminating，然後 mysql-1

# 清理
kubectl delete statefulset mysql redis
kubectl delete svc mysql-headless redis-headless
kubectl delete secret mysql-sts-secret
kubectl delete pvc --all`,
    notes: `學員實作。寫一個 Redis StatefulSet，image 用 redis:7，2 個副本，每個 Pod 500Mi 儲存。驗證三件事：get pods 看到 redis-0 和 redis-1，get pvc 看到兩個獨立的 PVC，砍掉 redis-0 等重建確認名字還是 redis-0。挑戰：Scale mysql 到 3 看 mysql-2 最後建，Scale 回 1 確認 mysql-2 先被刪（反序）。清理：statefulset、service、secret、pvc 都要刪，PVC 不會自動刪，要手動 kubectl delete pvc --all。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-17：Helm 概念
  // ============================================================
  {
    title: 'Helm — K8s 的套件管理器',
    subtitle: 'YAML 太多了 → Chart 打包 → helm install 一行搞定 → 版本管理',
    section: '6-17：Helm 概念',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/20 border border-red-700/40 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-1">問題</p>
          <p className="text-slate-300 text-sm">一個 MySQL 需要 Secret + ConfigMap + StatefulSet + Headless Service + PVC，還要 dev/staging/prod 三套 → 每次改要改三個地方</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">解法對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-4">apt/npm/pip</th>
                <th className="pb-1">Helm</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">.deb / 套件包</td>
                <td className="py-1 text-cyan-400">Chart</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">安裝好的軟體</td>
                <td className="py-1 text-cyan-400">Release</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">apt source / npm registry</td>
                <td className="py-1 text-cyan-400">Repository</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">.env</td>
                <td className="py-1 text-cyan-400">values.yaml</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">三個核心功能</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-900 p-2 rounded text-center">
              <p className="text-green-400 font-semibold mb-1">一鍵安裝</p>
              <p className="text-slate-300">helm install my-mysql bitnami/mysql</p>
            </div>
            <div className="bg-slate-900 p-2 rounded text-center">
              <p className="text-green-400 font-semibold mb-1">多環境部署</p>
              <p className="text-slate-300">同一 Chart，-f values-dev.yaml / values-prod.yaml</p>
            </div>
            <div className="bg-slate-900 p-2 rounded text-center">
              <p className="text-green-400 font-semibold mb-1">版本管理 + rollback</p>
              <p className="text-slate-300">helm history / helm rollback</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `問題引出：你剛才手寫了 Secret、Headless Service、StatefulSet、volumeClaimTemplates，這是最精簡的 MySQL。真實生產還要加 ConfigMap、NetworkPolicy、Resource Limits。然後你有 dev、staging、prod 三個環境，三套 YAML 每次改都要改三個地方。全世界有幾百萬人在 K8s 上跑 MySQL，有沒有人把最佳實踐打包好？有，叫 Helm。Helm 就是 K8s 的 apt。Chart 是安裝包，Release 是裝好的實例，Repository 是倉庫，values.yaml 是設定檔。三個核心功能：一，一鍵安裝，helm install my-mysql bitnami/mysql，一行搞定。二，多環境部署，同一個 Chart，dev 用 values-dev.yaml，prod 用 values-prod.yaml，改一個地方三個環境都更新。三，版本管理加 rollback，helm history 看歷史，helm rollback 一行回到上一版，而且是整個 Release 的所有資源一起回滾。好，來裝一個試試看。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-18A：Helm 實作 Part 1
  // ============================================================
  {
    title: 'Helm 實作 Part 1 — 安裝、倉庫、install、upgrade/rollback',
    subtitle: 'helm install → helm list → helm upgrade → helm history → helm rollback',
    section: '6-18A：Helm 實作 Part 1',
    duration: '25',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/20 border border-amber-700/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">k3s 環境注意</p>
          <p className="text-slate-300 text-sm">安裝時要加 <code className="text-yellow-400">--set controller.service.type=NodePort</code>，否則跟 Traefik 搶 80/443，EXTERNAL-IP 會一直 pending。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">REVISION 說明</p>
          <p className="text-slate-300 text-sm">每次 install / upgrade / rollback 都會產生新的 REVISION。rollback 會建新 REVISION，不是覆蓋舊的。</p>
          <div className="font-mono text-xs text-slate-400 mt-2 space-y-0.5">
            <p>REVISION 1 → install</p>
            <p>REVISION 2 → upgrade</p>
            <p>REVISION 3 → rollback to 1（不是覆蓋！）</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：安裝 Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version   # 確認 v3.x

# Step 2：加入倉庫
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm search repo ingress-nginx

# Step 3：一鍵安裝 Nginx Ingress（k3s 要加 NodePort）
helm install my-ingress ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=1 \\
  --set controller.service.type=NodePort

kubectl get all -l app.kubernetes.io/instance=my-ingress
helm list   # REVISION: 1, STATUS: deployed

# Step 4：upgrade + rollback
helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=2 \\
  --set controller.service.type=NodePort

helm history my-ingress   # REVISION 1: superseded, 2: deployed
helm rollback my-ingress 1
helm history my-ingress   # REVISION 3: deployed (Rollback to 1)`,
    notes: `安裝 Helm，curl 那行跑完確認 helm version 是 v3.x。加入兩個倉庫，ingress-nginx 和 prometheus-community，helm repo update 更新索引。helm search repo ingress-nginx 看有什麼 Chart。一鍵安裝 Nginx Ingress，注意 k3s 環境要加 --set controller.service.type=NodePort，不然跟 Traefik 搶 80/443，EXTERNAL-IP 會一直 pending。安裝完 kubectl get all -l app.kubernetes.io/instance=my-ingress，用 label selector 看這個 Release 建了哪些資源。helm list 看到 REVISION 1 STATUS deployed。upgrade 把 replicaCount 改成 2，helm history 看到 REVISION 1 superseded、2 deployed。rollback 到 1，注意 rollback 會建新的 REVISION 3，不是覆蓋舊的。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-19A：學員實作 Part 1
  // ============================================================
  {
    title: '學員實作：install → upgrade → rollback',
    subtitle: '用 my-nginx 跑一遍完整 Helm 生命週期（10 分鐘）',
    section: '6-19A：Helm 學員實作 Part 1',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">目標：自己跑一遍 Helm 核心流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>helm install <strong className="text-yellow-400">my-nginx</strong>，replicaCount=1</li>
            <li>helm upgrade，replicaCount=2，確認副本增加</li>
            <li>helm history 看 REVISION</li>
            <li>helm rollback 回第 1 版</li>
            <li>helm history 確認新 REVISION 產生</li>
            <li>helm uninstall 清理</li>
          </ol>
        </div>

        <div className="bg-amber-900/20 border border-amber-700/40 p-2 rounded">
          <p className="text-amber-300 text-xs">Release 名稱用 <strong>my-nginx</strong>，記得加 <code className="text-yellow-400">--set controller.service.type=NodePort</code></p>
        </div>
      </div>
    ),
    code: `# 學員自己跑，參考指令如下

# Step 1：install（replicaCount=1）
helm install my-nginx ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=1 \\
  --set controller.service.type=NodePort

helm list   # STATUS: deployed, REVISION: 1
kubectl get deployment   # READY: 1/1

# Step 2：upgrade（replicaCount=2）
helm upgrade my-nginx ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=2 \\
  --set controller.service.type=NodePort

kubectl get deployment   # READY: 2/2

# Step 3：看歷史
helm history my-nginx
# REVISION 1: superseded  REVISION 2: deployed

# Step 4：rollback 回第 1 版
helm rollback my-nginx 1

# Step 5：確認新 REVISION
helm history my-nginx
# REVISION 3: deployed  ← rollback 是新 REVISION，不是覆蓋！

kubectl get deployment   # READY: 1/1 （副本回到 1）

# Step 6：清理
helm uninstall my-nginx
helm list   # 應該是空的`,
    notes: `學員自己動手，跑完整 Helm 生命週期。Release 名稱統一用 my-nginx。install 設 replicaCount=1，upgrade 改成 2，helm history 看 REVISION 1 和 2。rollback 回第 1 版，注意 helm history 會出現 REVISION 3，不是回覆蓋 REVISION 1，這是 Helm 的設計，每一步都是新 REVISION，可以追溯。kubectl get deployment 確認副本數從 2 變回 1。跑完 uninstall 清理，helm list 確認空的。這 10 分鐘是要讓你的手記住這幾個指令：install、upgrade、history、rollback、uninstall。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-18B：Helm 實作 Part 2
  // ============================================================
  {
    title: 'Helm 實作 Part 2 — values、多環境、Prometheus+Grafana、自己的 Chart',
    subtitle: 'helm show values → values.yaml → Prometheus+Grafana → helm create',
    section: '6-18B：Helm 實作 Part 2',
    duration: '35',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">四個重點</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-yellow-400">helm show values</strong>：看 Chart 所有可調參數</li>
            <li><strong className="text-yellow-400">多環境</strong>：values-dev.yaml（1副本）/ values-prod.yaml（2副本），-f 帶入</li>
            <li><strong className="text-yellow-400">Prometheus+Grafana</strong>：一行安裝，port-forward 打開 Grafana</li>
            <li><strong className="text-yellow-400">helm create</strong>：產生骨架，templates/ 用 {`{{ .Values.xxx }}`} 注入參數</li>
          </ul>
        </div>

        <div className="bg-amber-900/20 border border-amber-700/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">注意</p>
          <p className="text-slate-300 text-sm">新版 helm create 骨架有 serviceAccount 和 httpRoute，要在 values.yaml 裡關掉，否則 apply 會失敗。</p>
          <div className="font-mono text-xs text-slate-400 mt-1 space-y-0.5">
            <p>serviceAccount.create: false</p>
            <p>httpRoute.enabled: false</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 5：看 Chart 所有參數
helm show values ingress-nginx/ingress-nginx | head -50

# Step 6：多環境部署
# values-dev.yaml: controller.replicaCount: 1
# values-prod.yaml: controller.replicaCount: 2
helm install dev-ingress ingress-nginx/ingress-nginx \\
  -f values-dev.yaml --set controller.service.type=NodePort

# Step 7：Prometheus + Grafana
helm install monitoring prometheus-community/kube-prometheus-stack \\
  --set grafana.adminPassword=admin123
kubectl get pods | grep monitoring
kubectl port-forward svc/monitoring-grafana 3000:80
# 瀏覽器 http://localhost:3000，帳號 admin，密碼 admin123

# Step 8：自己寫 Chart
helm create my-app
# 修改 values.yaml：image.repository: nginx, tag: alpine
# 關掉 serviceAccount.create: false, httpRoute.enabled: false
helm install my-app ./my-app
helm upgrade my-app ./my-app --set image.tag=1.25

# Step 9：清理
helm uninstall my-ingress dev-ingress monitoring my-app
kubectl delete pvc --all
helm list   # 應該是空的`,
    notes: `helm show values 看 Chart 的預設值，head -50 只看前 50 行，這樣你知道有哪些參數可以覆蓋。多環境部署：寫兩個 values 檔，dev 設 1 個副本，prod 設 2 個，用 -f 帶入。注意 -f 和 --set 可以混用，--set 的優先級更高。裝 Prometheus+Grafana，一行搞定，Bitnami 要付費了但 prometheus-community 免費，等 2-3 分鐘 Pod 跑起來，port-forward 打開 localhost:3000，帳號 admin 密碼 admin123，Dashboards 裡看 Pod 的 CPU Memory 圖表。自己寫 Chart，helm create my-app 產生骨架，注意新版骨架有 serviceAccount 和 httpRoute，要在 values.yaml 裡關掉，不然 apply 會失敗。看 templates/deployment.yaml 裡的 image: {{ .Values.image.repository }}:{{ .Values.image.tag }}，這就是模板語法。helm install 裝起來，upgrade 換 image tag。清理 helm uninstall 全部，PVC 要手動刪。[▶ 下一頁]`,
  },

  // ============================================================
  // 6-19B：學員實作 Part 2
  // ============================================================
  {
    title: '學員實作：upgrade 陷阱 + 自己的 Chart + Grafana',
    subtitle: '必做 1：--reuse-values 陷阱 / 必做 2：自己寫 Chart / 挑戰：Grafana',
    section: '6-19B：Helm 學員實作 Part 2',
    duration: '20',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">必做 1：upgrade 陷阱</p>
          <p className="text-slate-300 text-sm mb-1">install 帶 replicaCount=1，upgrade 不帶，觀察副本數被重設；再用 --reuse-values 修正。</p>
          <div className="bg-amber-900/20 border border-amber-700/40 p-2 rounded text-xs text-amber-300">
            upgrade 沒帶的參數 → 重設回 Chart 預設值！生產常見坑，--reuse-values 救你。
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">必做 2：自己的 Chart（httpd）</p>
          <div className="font-mono text-xs text-slate-400 space-y-0.5">
            <p>image.repository: httpd</p>
            <p>image.tag: "latest"</p>
            <p>serviceAccount.create: false</p>
            <p>httpRoute.enabled: false</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded-lg">
          <p className="text-green-400 font-semibold text-xs mb-1">挑戰：Grafana 找到你的 Pod</p>
          <p className="text-slate-400 text-xs">Dashboards → Kubernetes / Compute Resources / Pod → 找 my-service</p>
        </div>
      </div>
    ),
    code: `# 必做 1：upgrade 陷阱
helm install my-ingress ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=1 --set controller.service.type=NodePort

helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --set controller.service.type=NodePort   # 不帶 replicaCount！

kubectl get deployment   # ← 副本數被重設回預設值了？
helm history my-ingress

# 解法：--reuse-values 沿用上次所有 values，--set 只覆蓋你要改的
helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --reuse-values --set controller.replicaCount=2
kubectl get deployment   # ← READY: 2/2
helm uninstall my-ingress

# 必做 2：自己的 Chart（httpd）
helm create my-service
# 修改 my-service/values.yaml：
#   image.repository: httpd
#   image.tag: "latest"
#   serviceAccount.create: false
#   httpRoute.enabled: false

helm install my-service ./my-service
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# → Image: httpd:latest

helm upgrade my-service ./my-service --set image.tag=2.4
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# → Image: httpd:2.4

# 挑戰：Grafana
helm list   # 確認 monitoring 還在
kubectl port-forward svc/monitoring-grafana 3000:80
# http://localhost:3000 → Dashboards → Kubernetes/Compute Resources/Pod → 找 my-service

# 清理全部
helm uninstall my-service monitoring
kubectl delete pvc --all
kubectl get all   # 確認只剩 kubernetes Service`,
    notes: `必做 1 是 upgrade 陷阱。install 設 replicaCount=1，upgrade 的時候只帶 service.type=NodePort，忘記帶 replicaCount。Helm 把它重設回 Chart 預設值，通常是 1 但可能跟你設的不一樣。生產環境這是個坑，你 upgrade 想改一個參數，結果其他參數全被重設了。解法是加 --reuse-values，沿用上次所有的 values，再用 --set 只覆蓋你要改的那一個。必做 2：helm create my-service 產生骨架，修改 values.yaml，把 image 改成 httpd，serviceAccount.create 和 httpRoute.enabled 設 false，不然新版骨架 apply 會失敗。install 起來，describe pod grep Image 確認跑的是 httpd:latest，upgrade 換 tag 到 2.4。挑戰：monitoring 應該還在（上面 18B 裝的），port-forward Grafana，在 Dashboards 裡找到你自己裝的 my-service Pod 的 CPU Memory 圖表。這就是用你剛裝的監控看你剛裝的服務。清理 helm uninstall 全部，delete pvc，確認乾淨。第六堂全部完成。[▶ 完]`,
  },

  // （6-8/6-9/6-10 整合實作已移除）
]
