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
  // 7-1：第六堂回顧 + 生產環境的挑戰（2 張）
  // ============================================================

  // ── 7-1（1/2）：開場 + 第六堂因果鏈回顧 ──
  {
    title: '第七堂：生產就緒 — 穿得漂亮不代表扛得住',
    subtitle: 'HPA → RBAC → 下午：從零建完整系統',
    section: '7-1：回顧 + 生產環境的挑戰',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第六堂因果鏈回顧</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">NodePort 又長又醜</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Ingress 域名路由</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">ConfigMap / Secret</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">PV / PVC 持久化</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StorageClass 動態佈建</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StatefulSet 跑 DB</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Helm 套件管理</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Rancher GUI</span>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">上堂課的比喻</p>
          <p className="text-slate-300 text-sm">域名=門牌、設定/密碼=名片夾、持久化=保險箱、Helm=購物車、Rancher=監控攝影機</p>
          <p className="text-red-400 font-semibold mt-2">穿得漂亮 ≠ 扛得住生產環境的考驗</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天的因果鏈</p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">HPA 自動擴縮</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">RBAC 權限控管</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="bg-cyan-900/40 border border-cyan-500/50 px-3 py-1 rounded text-cyan-400 font-semibold">從零建完整系統</span>
          </div>
        </div>
      </div>
    ),
    notes: `好，歡迎回來。今天是我們 Kubernetes 課程的第七堂，也是最後一堂。在開始新的內容之前，我們先花幾分鐘把第六堂的因果鏈快速串一遍，確認大家的腦袋裡有一條完整的線。

第六堂的起點是什麼？是第五堂結束的時候，使用者要用 IP 加 NodePort 連進來，地址又長又醜，像是 192.168.1.100:30080 這種東西。你總不能叫使用者記這串數字吧。所以我們學了 Ingress，用域名加路徑做路由。blog.example.com 連到前端，blog.example.com/api 連到後端 API。地址漂亮了，還加了 TLS 做 HTTPS。

接著我們發現設定寫死在 Image 裡面。改一個環境變數就要重新 build Image，密碼寫在 Dockerfile 裡更是災難。所以學了 ConfigMap 管一般設定、Secret 管敏感資料。

設定和密碼分離了，服務跑起來了。結果 MySQL Pod 重啟一次，資料全部消失。所以學了 PV 和 PVC 做持久化儲存。手動建 PV 太煩了，又學了 StorageClass 動態佈建。

有了持久化，可以正式跑資料庫了。但 Deployment 不適合跑資料庫，名字不固定、沒有順序、共用 PVC。所以學了 StatefulSet，固定序號、有序啟動、獨立儲存。

到這裡 YAML 已經多到爆了，一個 MySQL 就要五六個資源。所以學了 Helm，一行 helm install 搞定整套安裝。最後全部用 kubectl 管叢集太痛苦了，學了 Rancher 提供 GUI 管理。

這就是第六堂完整的因果鏈。每一個概念都是因為上一步有沒解決的問題才引出來的。

[▶ 下一頁]`,
  },

  // ── 7-1（2/2）：生產環境四個要命問題 ──
  {
    title: '生產環境的四個要命問題',
    subtitle: '穿上正式衣服了，但壓力測試呢？',
    section: '7-1：回顧 + 生產環境的挑戰',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">四個最常見的要命問題</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">1.</span>
              <div>
                <span className="text-white font-semibold">服務卡死沒人知</span>
                <span className="text-slate-400 ml-2">— API 死鎖，Pod 顯示 Running，使用者看到 502</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">2.</span>
              <div>
                <span className="text-white font-semibold">一個 Pod 吃光整台機器</span>
                <span className="text-slate-400 ml-2">— 記憶體洩漏，其他 Pod 被擠到沒資源</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">3.</span>
              <div>
                <span className="text-white font-semibold">流量暴增</span>
                <span className="text-slate-400 ml-2">— 凌晨三點暴增，你在睡覺，使用者罵翻了</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">4.</span>
              <div>
                <span className="text-white font-semibold">誰都能刪</span>
                <span className="text-slate-400 ml-2">— 實習生 kubectl delete namespace production</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">今天的解法</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-slate-300"><span className="text-red-400">流量暴增</span> → <span className="text-green-400 font-semibold">HPA 自動擴縮</span></div>
            <div className="text-slate-300"><span className="text-red-400">誰都能刪</span> → <span className="text-green-400 font-semibold">RBAC 權限控管</span></div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <p className="text-cyan-400 font-semibold text-sm">上午：Loop 1 HPA → Loop 2 RBAC ｜ 下午：從零建完整系統</p>
        </div>
      </div>
    ),
    notes: `好，我上堂課結尾用了一個比喻：你的服務穿上了正式的衣服。域名是門牌、設定和密碼是名片夾、資料持久化是保險箱、套件管理是購物車、GUI 是監控攝影機。衣服穿好了，看起來很體面。

但我今天要跟大家說一件殘酷的事情。穿得漂亮不代表扛得住。生產環境會用各種方式考驗你的系統。

我舉四個最常見的要命問題。

第一個，服務卡死沒人知。你的 API Pod 裡面的程式死鎖了，或者資料庫連線池滿了。Pod 的 process 還活著，K8s 看到 STATUS 是 Running。Service 照樣把流量往那邊送。使用者呢？看到的是 502 Bad Gateway，或者請求超時。但你在監控儀表板上看到的是一片綠色的 Running。

第二個，一個 Pod 吃光整台機器的資源。有個 Pod 裡面的程式有記憶體洩漏，越吃越多。其他 Pod 被擠到沒資源可用，全部跟著掛。一隻老鼠壞了一鍋粥。

第三個，流量暴增。雙十一來了，平常三個 Pod 夠用，現在三十個都不夠。你手動 kubectl scale 可以，但你不可能 24 小時盯著。凌晨三點流量暴增的時候你在睡覺，等你醒來使用者已經罵翻了。

第四個，誰都能刪。你的叢集上有十個團隊在跑服務，每個人都拿到了 admin 權限。新來的實習生不小心打了 kubectl delete namespace production，整個生產環境消失。

這四個問題，今天我們重點處理兩個。上午 Loop 1 是 HPA，解決流量暴增的問題。上午 Loop 2 是 RBAC，解決權限管控的問題。下午從零建一套完整的系統，把所有東西串在一起。

準備好了嗎？我們從第一個問題開始：流量暴增，手動 scale 來不及。

[▶ 下一頁]`,
  },

  // ============================================================
  // Loop 1-0：環境準備（開始前必做）
  // ============================================================

  // ── 環境準備 ──
  {
    title: '開始前：清乾淨環境',
    subtitle: '第六堂留下的 Helm release 與 PVC 會佔資源，先全部清掉',
    section: 'Loop 1：環境準備',
    duration: '3',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded">
          <p className="text-amber-300 font-semibold mb-1">為什麼要清</p>
          <p className="text-slate-300">第六堂的 monitoring / my-app / my-blog / my-ingress 都還在跑，會吃掉 CPU 與 Memory，等一下 HPA 要觀察指標會被干擾。PVC 也要一起刪，不然 disk 佔滿。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded font-mono text-xs space-y-0.5">
          <p className="text-slate-500"># 1. 卸掉四個 Helm release</p>
          <p className="text-green-300">helm uninstall monitoring -n default</p>
          <p className="text-green-300">helm uninstall my-app -n default</p>
          <p className="text-green-300">helm uninstall my-blog -n default</p>
          <p className="text-green-300">helm uninstall my-ingress -n default</p>
          <p className="text-slate-500 mt-1"># 2. 清掉殘留資源 + PVC</p>
          <p className="text-green-300">kubectl delete all --all -n default</p>
          <p className="text-green-300">kubectl delete pvc --all -n default</p>
          <p className="text-slate-500 mt-1"># 3. 壓縮 journal log（選做）</p>
          <p className="text-green-300">sudo journalctl --vacuum-size=100M</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-2 rounded">
          <p className="text-green-300 font-semibold mb-1">驗證</p>
          <div className="font-mono text-slate-300 space-y-0.5">
            <p><span className="text-green-400">kubectl get pods -n default</span> → <span className="text-cyan-300">No resources found</span></p>
            <p><span className="text-green-400">df -h /</span> → 可用空間 <span className="text-cyan-300">≥ 3G</span></p>
          </div>
        </div>
      </div>
    ),
    notes: `進 Loop 1 之前先把環境清乾淨。

第六堂我們部署了四個 Helm release：monitoring、my-app、my-blog、my-ingress。這些都還在跑，會吃 CPU 和 Memory。等一下我們要觀察 HPA 根據 CPU 使用率自動擴縮容，如果資源被其他東西吃掉，指標會被干擾，你看到的結果會不準。

所以先做三件事：

第一，helm uninstall 四個 release。這會把 Deployment、Service、Ingress 全部拆掉。

第二，kubectl delete all --all -n default 再清一次殘留資源，保險。然後 kubectl delete pvc --all -n default 把 PVC 也刪掉。為什麼要刪 PVC？因為 StatefulSet 卸載不會自動刪 PVC，留著會一直佔 disk 空間。

第三步選做：sudo journalctl --vacuum-size=100M 壓縮系統 log。如果你的 VM disk 很緊，這招可以多擠一點空間出來。

驗證兩點。kubectl get pods -n default 應該回 No resources found，代表沒東西在跑了。df -h / 看根目錄可用空間要 ≥ 3G，不然等一下部署會失敗。

清完就進 Loop 1，來看 HPA 要解決什麼問題。[▶ 下一頁]`,
  },

  // ============================================================
  // Loop 1-1：HPA 概念（2 張：問題 → 解法）
  // ============================================================

  // ── 7-8（1/2）：手動 scale 來不及 ──
  {
    title: '問題：流量暴增，手動 scale 來不及',
    subtitle: 'kubectl scale 是手動的 — 凌晨三點你在睡覺',
    section: 'Loop 1：HPA 概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">場景：雙十一零點流量翻十倍</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded text-xs">平常：3 Pod，CPU 30%</span>
              <span className="text-slate-500">→</span>
              <span className="bg-red-900/60 text-red-300 px-2 py-1 rounded text-xs border border-red-500/50">雙十一：3 Pod 全部 CPU 100%</span>
              <span className="text-slate-500">→</span>
              <span className="bg-red-900/60 text-red-300 px-2 py-1 rounded text-xs border border-red-500/50">超時 → 使用者罵翻</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">手動 scale 的兩個根本問題</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">1.</span>
              <span className="text-slate-300">反應太慢 — 你不可能 24 小時盯 Grafana</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">2.</span>
              <span className="text-slate-300">容易忘記縮回來 — 10 個 Pod 閒著浪費資源</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1">Docker</th>
                <th className="text-left py-1">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1 font-mono text-xs">docker compose up --scale web=10</td>
                <td className="py-1">kubectl scale（手動）</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">沒有自動 scale</td>
                <td className="py-1 text-green-400 font-semibold">HPA（自動 scale）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，上一個 Loop 我們設好了 Resource limits。每個 Pod 有保底有天花板，不會吃光整台機器的資源。但是我現在要跟大家描述另一個場景。

想像你的電商網站。平常日子裡，兩三個 Pod 就夠用了。CPU 使用率大概在 30% 左右，很悠閒。結果雙十一來了，零點一到，流量瞬間翻了十倍。你的三個 Pod 每個 CPU 都飆到 100%，請求開始排隊，回應時間從 100 毫秒暴增到 5 秒，然後開始超時。使用者不斷重試，流量更大，雪崩效應。

你手邊有武器啊。第五堂學了 kubectl scale deployment my-app --replicas=10，把副本數加到 10 個。但問題是你怎麼知道什麼時候該加？你不可能 24 小時盯著 Grafana 的 CPU 圖表吧。凌晨三點流量暴增，你在睡覺。等你七點起床看到告警，使用者已經罵了四個小時了。

然後雙十一結束了，流量回到正常。十個 Pod 閒在那裡什麼事都沒做，但 CPU 和記憶體還是佔著。你忘了把 replicas 調回來，白白浪費資源。

手動 scale 有兩個根本問題。第一，反應太慢，你不可能即時反應。第二，容易忘記縮回來，浪費資源。

Docker Compose 也有 scale 的功能，docker compose up --scale web=10，但一樣是手動的。

K8s 提供了一個自動化的方案，叫 HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。

[▶ 下一頁]`,
  },

  // ── 7-8（2/2）：HPA 自動擴縮 ──
  {
    title: '解法：HPA — 根據 CPU 自動擴縮 Pod',
    subtitle: 'Horizontal Pod Autoscaler：超過閾值加 Pod，降下來減 Pod',
    section: 'Loop 1：HPA 概念',
    duration: '7',
    content: (
      <div className="space-y-3">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">HPA 工作流程</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded">每 15 秒查 metrics</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded">CPU &gt; 50%</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded">加 Pod</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-2 py-1 rounded">CPU 降下來</span>
            <span className="text-slate-500">→</span>
            <span className="bg-amber-900/40 text-amber-300 px-2 py-1 rounded">等 5 分鐘冷卻</span>
            <span className="text-slate-500">→</span>
            <span className="bg-amber-900/40 text-amber-300 px-2 py-1 rounded">減 Pod</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">HPA YAML 拆解</p>
          <div className="text-xs text-slate-300 space-y-1 font-mono">
            <p>apiVersion: autoscaling/v2</p>
            <p>kind: HorizontalPodAutoscaler</p>
            <p>spec:</p>
            <p className="pl-4"><span className="text-cyan-400">scaleTargetRef:</span> <span className="text-slate-500">← 擴縮哪個 Deployment</span></p>
            <p className="pl-8">kind: Deployment</p>
            <p className="pl-8">name: nginx-resource-demo</p>
            <p className="pl-4"><span className="text-green-400">minReplicas: 2</span> <span className="text-slate-500">← 最少保持（高可用）</span></p>
            <p className="pl-4"><span className="text-red-400">maxReplicas: 10</span> <span className="text-slate-500">← 最多擴到（Node 資源有限）</span></p>
            <p className="pl-4"><span className="text-amber-400">metrics:</span></p>
            <p className="pl-8">cpu averageUtilization: <span className="text-amber-400">50</span> <span className="text-slate-500">← 50% of requests</span></p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-xs text-center">前提：Pod 必須設 resources.requests（HPA 算百分比的分母）</p>
          <p className="text-slate-400 text-xs text-center mt-1">需要 metrics-server（k3s 內建）｜ 縮容冷卻期 5 分鐘（防抖動）</p>
        </div>
      </div>
    ),
    code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50

# 或用一行指令：
# kubectl autoscale deployment nginx-resource-demo \\
#   --min=2 --max=10 --cpu=50%`,
    notes: `HPA 做的事情用一句話說就是：監控 Pod 的 CPU 使用率，超過你設的閾值就自動加 Pod，低於閾值就自動減 Pod。全自動，不需要人介入。

HPA 的工作流程是這樣的。它每 15 秒去問 metrics-server：目前每個 Pod 的 CPU 使用率是多少？拿到數據之後做計算。如果平均 CPU 使用率超過你設的目標值，比如 50%，HPA 就會增加 Pod 的數量。新的 Pod 啟動之後，流量分攤到更多 Pod 上面，每個 Pod 的 CPU 使用率就降下來了。

當流量降下來之後，CPU 使用率也跟著降。HPA 發現 CPU 低於目標值了，但它不會馬上縮 Pod。它會等一段冷卻期，預設是 5 分鐘。為什麼要等？因為怕流量只是暫時降了一下馬上又上來。等了 5 分鐘確認流量真的穩定了，HPA 才會開始縮減 Pod 數量。

來看 YAML 怎麼寫。apiVersion 是 autoscaling/v2，kind 是 HorizontalPodAutoscaler。

spec 裡面第一個重點是 scaleTargetRef。它告訴 HPA 要擴縮哪個 Deployment。name 是 nginx-resource-demo，就是我們上一個 Loop 建的那個 nginx Deployment。

minReplicas 設 2，表示最少保持 2 個 Pod。保持最少 2 個是基本的高可用。maxReplicas 設 10，表示最多擴到 10 個 Pod。maxReplicas 要根據你的 Node 總資源來設。

metrics 裡面 averageUtilization 設 50。意思是當所有 Pod 的平均 CPU 使用率超過 50% 的時候就擴容。這裡的 50% 是相對於 requests 的 50%。如果你的 Pod requests cpu 是 100m，那 50% 就是 50m。

這就是為什麼上一個 Loop 我一直強調要設 requests。HPA 算的是百分比。百分比需要一個分母。分母就是 requests。如果你沒設 requests，HPA 不知道 100% 是多少，就沒辦法算百分比，HPA 就不會動。

最後一個前提。HPA 需要 metrics-server。如果你用的是 k3s，好消息，k3s 內建了 metrics-server。如果你用的是 minikube，需要執行 minikube addons enable metrics-server 來啟用它。

概念講完了，下一支影片我們來壓測，親眼看 HPA 自動擴容。

[▶ 下一頁]`,
  },

  // ============================================================
  // Loop 1-2：HPA 實作 + 學員實作（2+1 張）
  // ============================================================

  // ── 7-9（1/3）：壓測觸發擴容 ──
  {
    title: 'HPA 實作：壓測觸發自動擴容',
    subtitle: 'busybox 無限 wget → CPU 飆高 → HPA 加 Pod',
    section: 'Loop 1：HPA 實作',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 0~2：確認環境 + 建 HPA</p>
          <div className="text-xs text-green-400 font-mono space-y-1">
            <p>$ kubectl get pods -n kube-system -l k8s-app=metrics-server</p>
            <p className="text-slate-400"># → 確認 Running</p>
            <p>$ kubectl top pods</p>
            <p className="text-slate-400"># → 有數字 = metrics-server 正常</p>
            <p>$ kubectl apply -f nginx-resource-demo.yaml</p>
            <p className="text-slate-400"># → Deployment + Service 一起建好（含 nginx-resource-svc）</p>
            <p>$ kubectl autoscale deployment nginx-resource-demo \</p>
            <p>    --min=2 --max=10 --cpu=50%</p>
            <p>$ kubectl get hpa</p>
            <p className="text-slate-400"># → TARGETS: 1%/50%, REPLICAS: 2</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Step 3：壓測（另開終端機）</p>
          <div className="text-xs text-green-400 font-mono space-y-1">
            <p>$ kubectl run load-test --image=busybox:1.36 --rm -it \</p>
            <p>    --restart=Never -- sh -c \</p>
            <p>    "while true; do wget -qO- http://nginx-resource-svc {'>'} /dev/null 2{'>'}&1; done"</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">無限迴圈 wget → 每秒幾十~上百次請求</p>
        </div>
      </div>
    ),
    code: `# Step 0：確認 metrics-server
kubectl get pods -n kube-system -l k8s-app=metrics-server
kubectl top nodes
kubectl top pods

# Step 1：部署 Deployment + Service（yaml 已含 nginx-resource-svc）
kubectl apply -f ~/workspace/k8s-course-labs/lesson7/nginx-resource-demo.yaml
kubectl get deploy nginx-resource-demo
kubectl get svc nginx-resource-svc

# Step 2：建 HPA
kubectl autoscale deployment nginx-resource-demo \\
  --min=2 --max=10 --cpu=50%

# Step 3：壓測（另開終端機）
kubectl run load-test --image=busybox:1.36 --rm -it \\
  --restart=Never -- \\
  sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"`,
    notes: `好，概念講完了，我們來親眼看 HPA 自動擴容。這個實驗非常有感覺，大家一定要跟著做。

首先確認 metrics-server 有在跑。kubectl get pods -n kube-system。找 metrics-server 相關的 Pod，確認是 Running。如果你用 k3s，它內建了 metrics-server，應該已經在跑了。

確認之後，打一下 kubectl top nodes 和 kubectl top pods。如果能看到 CPU 和 MEMORY 的數字，表示 metrics-server 正常運作。

好，接下來部署 HPA 用的 nginx。kubectl apply -f ~/workspace/k8s-course-labs/lesson7/nginx-resource-demo.yaml。這個 yaml 裡面同時包含了 Deployment 和 Service，一次建好。確認一下：kubectl get deploy nginx-resource-demo、kubectl get svc nginx-resource-svc。記住 Deployment 有設 resources.requests，這是 HPA 的前提。

好，現在建 HPA。kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=50%。看看 HPA 的狀態。kubectl get hpa。

好，重頭戲來了。開另一個終端機，跑一個壓測 Pod。kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"。

這個指令建了一個 busybox Pod，在裡面跑一個無限迴圈，不斷用 wget 去打 nginx Service。每秒鐘幾十次甚至上百次請求，模擬流量暴增。

[▶ 下一頁]`,
  },

  // ── 7-9（2/3）：觀察擴容 + 縮容 ──
  {
    title: 'HPA 實作：觀察擴容與縮容',
    subtitle: 'CPU 飆高 → Pod 增加 → 停止壓測 → 等 5 分鐘 → Pod 縮回來',
    section: 'Loop 1：HPA 實作',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Step 4：觀察擴容（原本終端機）</p>
          <div className="text-xs text-green-400 font-mono space-y-1">
            <p>$ kubectl get hpa -w</p>
            <p className="text-slate-400"># TARGETS: 1% → 20% → 40% → <span className="text-red-400">60%</span> → REPLICAS: 2 → 3 → 4</p>
            <p>$ kubectl get pods -l app=nginx-resource -w</p>
            <p className="text-slate-400"># → 新 Pod 冒出來：Pending → ContainerCreating → Running</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">Step 5：停止壓測 → 等 5 分鐘 → 縮容</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>壓測終端機按 <span className="text-amber-400 font-bold">Ctrl+C</span> 停止</p>
            <p>回到 HPA watch：CPU 降到 0~1%</p>
            <p className="text-amber-400">等 5 分鐘冷卻期...</p>
            <p>REPLICAS：6 → 5 → 4 → 3 → <span className="text-green-400">2</span>（回到 minReplicas）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">kubectl describe hpa — 看 Events</p>
          <div className="text-xs text-green-400 font-mono space-y-1">
            <p>$ kubectl describe hpa nginx-resource-demo</p>
            <p className="text-slate-400"># Events:</p>
            <p className="text-slate-400"># New size: 3; reason: cpu above target</p>
            <p className="text-slate-400"># New size: 4; reason: cpu above target</p>
            <p className="text-slate-400"># New size: 3; reason: All metrics below target</p>
            <p className="text-slate-400"># New size: 2; reason: All metrics below target</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 4：觀察擴容
kubectl get hpa -w
kubectl get pods -l app=nginx-resource -w

# Step 5：停止壓測 → 等 5 分鐘 → 看縮容
# Ctrl+C 停止壓測 Pod
kubectl get hpa -w

# 看 HPA Events
kubectl describe hpa nginx-resource-demo`,
    notes: `壓測開始了。回到原本的終端機，觀察 HPA。kubectl get hpa -w。

注意看 TARGETS 欄位。CPU 使用率會慢慢上升。從 1% 到 20% 到 40% 到 60%。當它超過 50% 的時候，REPLICAS 欄位就會開始增加。2 變 3、3 變 4。

你也可以同時觀察 Pod 的變化。開第三個終端機。kubectl get pods -l app=nginx-resource -w。你會看到新的 Pod 一個一個冒出來。Pending、ContainerCreating、Running。HPA 正在自動加 Pod。

好，壓測跑個兩三分鐘，讓大家好好感受一下自動擴容的過程。現在回到壓測的終端機，按 Ctrl+C 停止壓測。

停止壓測之後，回到 HPA 的 watch。CPU 使用率會慢慢降下來。1%、0%。但 REPLICAS 不會馬上縮回 2。記得我剛才說的嗎？HPA 有 5 分鐘的縮容冷卻期。它要確認流量真的穩定下來了才會縮。

等大概 5 分鐘，你會看到 REPLICAS 開始減少。從 6 變 5、5 變 4、4 變 3、3 變 2。最終回到 minReplicas 設的 2 個。

按 Ctrl+C 停止 watch。我們來看 HPA 的 Events。kubectl describe hpa nginx-resource-demo。找到 Events 的部分。你會看到 New size: 3; reason: cpu resource utilization above target。然後過了幾分鐘，New size: 2; reason: All metrics below target。

完整的擴容和縮容過程都記錄在 Events 裡面。生產環境排查 HPA 問題的時候，kubectl describe hpa 是最重要的指令。

[▶ 下一頁]`,
  },

  // ── 7-9（3/3）：學員實作時間 ──
  {
    title: '學員實作：HPA 自動擴縮',
    subtitle: '必做 + 挑戰題',
    section: 'Loop 1：HPA 實作',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">必做：壓測看擴容 → 停止看縮容</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold shrink-0">1.</span>
              <span>apply nginx-resource-demo.yaml（含 Deployment + Service）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold shrink-0">2.</span>
              <span>建 HPA（--min=2 --max=10 --cpu=50%）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold shrink-0">3.</span>
              <span>busybox 壓測 → kubectl get hpa -w 看 REPLICAS 增加</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold shrink-0">4.</span>
              <span>Ctrl+C 停止壓測 → 等 5 分鐘 → 看 REPLICAS 縮回 2</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-3">挑戰：改 targetCPU 為 30%</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">A.</span>
              <span>刪掉 HPA → 重建一個 --cpu=30%</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold shrink-0">B.</span>
              <span>壓測 → 觀察：擴容觸發更早（30% 比 50% 更容易達到）</span>
            </div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm text-center">完成指標：kubectl get hpa 看到 REPLICAS &gt; 2（擴容）→ 停止後回到 2（縮容）</p>
        </div>
      </div>
    ),
    code: `# 驗收指令（做完每步後確認）
# Step 1 後：確認 Deployment 有 requests
kubectl get deployment nginx-resource-demo -o yaml | grep -A5 requests

# Step 2 後：確認 HPA 已建立
kubectl get hpa
# TARGETS: ?/50%（等 30-60 秒 metrics 收集，再看是否有數字）

# Step 3 壓測中：觀察 REPLICAS 增加
kubectl get hpa -w

# Step 4 停止壓測後：觀察縮容（約 5 分鐘後 REPLICAS 回到 2）
kubectl get hpa -w

# 查看 HPA 事件記錄（擴縮完成後）
kubectl describe hpa nginx-resource-demo`,
    notes: `接下來是大家的實作時間。必做題：建 HPA，用 busybox 壓測，看到自動擴容，停止壓測看到自動縮容。挑戰題：刪掉 HPA 重新建一個，但 targetCPU 改成 30%。你會發現擴容觸發得更早，因為 30% 的閾值更低，更容易達到。大家動手做。

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },



  // ============================================================
// Loop 2：RBAC
  // ============================================================

  // ── 7-11 概念（1/2）：誰都能刪 Pod ──
  {
    title: '誰都能刪 Pod？',
    subtitle: '實習生 kubectl delete namespace production',
    section: 'Loop 2：RBAC',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">恐怖故事</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>十個開發者，全拿 <code className="text-red-400">cluster-admin</code> 的 kubeconfig</p>
            <p>某天有人跑清理腳本：</p>
            <div className="bg-slate-900 p-2 rounded font-mono text-red-400 text-xs">
              kubectl delete namespace production
            </div>
            <p>Deployment、Pod、Service、Secret、PVC → <span className="text-red-400 font-bold">全部瞬間消失</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker vs K8s</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>Docker → 沒有內建權限控制，連到 Socket 就等於 root</p>
            <p>K8s → <span className="text-cyan-400 font-bold">RBAC</span>（Role-Based Access Control）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">RBAC 核心邏輯</p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="bg-blue-900/40 border border-blue-500/50 px-3 py-1 rounded text-blue-400">誰 Subject</span>
            <span className="text-slate-400 font-bold">+</span>
            <span className="bg-green-900/40 border border-green-500/50 px-3 py-1 rounded text-green-400">能做什麼 Role</span>
            <span className="text-slate-400 font-bold">=</span>
            <span className="bg-amber-900/40 border border-amber-500/50 px-3 py-1 rounded text-amber-400">綁定 Binding</span>
          </div>
        </div>
      </div>
    ),
    notes: `好，大家午休回來了。我們接著上午的因果鏈繼續往下走。

上午我們解決了三個問題。第一個，Pod Running 但服務卡死，用 Probe 解決。第二個，一個 Pod 吃光整台機器資源，用 Resource limits 解決。第三個，流量暴增手動 scale 來不及，用 HPA 解決。三條因果鏈串下來，你的服務已經具備了健康檢查、資源隔離、自動彈性擴縮的能力。

但我在上午結尾的時候提了一個問題，不知道大家還記不記得。你的叢集上有十個開發者，每個人都拿到了 admin 權限的 kubeconfig。某天有個人在跑清理腳本的時候，不小心打了 kubectl delete namespace production。猜猜怎麼了？production Namespace 底下的所有東西，Deployment、Pod、Service、Secret、PVC，全部瞬間消失。整個生產環境掛掉。

這不是我編的。這種事在業界真的發生過。2017 年 GitLab 就出過一次大事故，工程師在操作資料庫的時候誤刪了生產環境的資料，導致服務中斷了好幾個小時。雖然那次不是 K8s 的問題，但道理是一樣的：不該有那麼大權限的人拿到了那麼大的權限。

我們來想想，現在你的叢集是什麼狀態。你用 k3s 或 minikube 建的叢集，所有人用同一個 kubeconfig，所有人都是 cluster-admin。cluster-admin 是什麼？就是上帝權限，什麼都能做。建、改、刪，所有 Namespace、所有資源，通通可以。

Docker 有沒有這個問題？Docker 更糟。Docker 根本沒有內建的權限控制。只要你能連到 Docker Socket，你就等於 root。所有容器你都能停、都能刪、都能進去看。K8s 至少提供了一套完整的權限控制機制，叫做 RBAC。

RBAC，全名 Role-Based Access Control，中文叫基於角色的存取控制。它的核心邏輯只有一句話：誰加上能做什麼等於綁定。用更具體的方式說就是三個元素。第一個是 Subject，就是「誰」，可以是一個使用者 User、一個群組 Group、或者一個 ServiceAccount。第二個是 Role，就是「能做什麼」，定義了允許的操作清單。第三個是 Binding，把 Role 綁到 Subject 身上。

[▶ 下一頁]`,
  },

  // ── 7-11 概念（2/2）：四個物件 + ServiceAccount ──
  {
    title: 'RBAC 四個物件',
    subtitle: '門禁卡比喻：Role = 門禁卡，Binding = 發卡',
    section: 'Loop 2：RBAC',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-cyan-400 border-b border-slate-600">
                <th className="text-left py-1 pr-2">物件</th>
                <th className="text-left py-1 pr-2">作用範圍</th>
                <th className="text-left py-1">職責</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-2 font-mono text-green-400 text-xs">Role</td>
                <td className="py-1 pr-2">單一 Namespace</td>
                <td className="py-1">定義能對什麼資源做什麼動作</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-2 font-mono text-green-400 text-xs">ClusterRole</td>
                <td className="py-1 pr-2">整個叢集</td>
                <td className="py-1">同上，但跨 Namespace</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-2 font-mono text-amber-400 text-xs">RoleBinding</td>
                <td className="py-1 pr-2">單一 Namespace</td>
                <td className="py-1">把 Role 綁到某人身上</td>
              </tr>
              <tr>
                <td className="py-1 pr-2 font-mono text-amber-400 text-xs">ClusterRoleBinding</td>
                <td className="py-1 pr-2">整個叢集</td>
                <td className="py-1">把 ClusterRole 綁到某人身上</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ServiceAccount：Pod 的身份</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>User / Group → 給<span className="text-blue-400">人</span>用</p>
            <p>ServiceAccount → 給<span className="text-green-400">程式（Pod）</span>用</p>
            <p className="text-slate-400 text-xs mt-2">每個 Namespace 預設有 default SA；生產環境建議每個應用建自己的 SA → 最小權限原則</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見 RBAC 設計</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>開發人員 → dev/staging 完整權限，prod <span className="text-amber-400">只讀</span></p>
            <p>SRE/DevOps → 所有 Namespace 完整權限</p>
            <p>實習生 → dev 只讀，staging/prod <span className="text-red-400">不可碰</span></p>
            <p>部署 → 交給 CI/CD（ArgoCD）</p>
          </div>
        </div>
      </div>
    ),
    notes: `RBAC 一共有四個物件。Role 和 ClusterRole 負責定義「能做什麼」，差別是作用範圍。Role 只在一個 Namespace 裡面有效。比如你建了一個 Role 叫 pod-viewer，放在 default Namespace，那這個 Role 只能控制 default Namespace 裡的資源。ClusterRole 是整個叢集有效的，不限 Namespace。

RoleBinding 和 ClusterRoleBinding 負責「把權限給誰」，差別也是作用範圍。RoleBinding 只在一個 Namespace 裡面有效，ClusterRoleBinding 是整個叢集。

我用公司門禁卡來比喻。Role 就像一張門禁卡，上面寫著「可以進出 3 樓研發部」。ClusterRole 就像萬能卡，所有樓層都能進出。RoleBinding 就是把門禁卡發給某個員工。ClusterRoleBinding 就是把萬能卡發給某個員工。你不會把萬能卡發給每個新來的實習生，對吧？但我們現在的叢集就是在做這件事。

好，再講一個重要的概念叫 ServiceAccount。剛才說的 User 和 Group 是給人用的。但 Pod 也需要跟 K8s API Server 溝通。比如有些監控工具需要列出所有 Pod 的狀態，有些自動化工具需要建立或刪除資源。Pod 不是人，它的身份用的就是 ServiceAccount。

每個 Namespace 預設都有一個叫 default 的 ServiceAccount。如果你建 Pod 的時候不指定 ServiceAccount，Pod 就會自動使用 default。在生產環境裡，建議每個應用建自己的 ServiceAccount，然後用 RBAC 給它需要的最小權限。這叫最小權限原則。

來看 Role 的 YAML 怎麼寫。kind 是 Role，metadata 裡面指定名字叫 pod-viewer，namespace 是 default。rules 是重點，它定義了允許的操作。apiGroups 設空字串，代表 core API group，就是 Pod、Service、ConfigMap 這些最基礎的資源。resources 設 pods 和 services，代表能操作 Pod 和 Service。verbs 設 get、list、watch，代表能查看單個、列出全部、即時監控。注意，沒有 create、update、delete、patch 這些動詞。所以這是一個純粹只讀的 Role，能看不能改。

ServiceAccount 的 YAML 非常簡單，就是 kind 是 ServiceAccount，給個名字 viewer-sa，指定 namespace。

RoleBinding 稍微複雜一點，但邏輯很清楚。subjects 指定「綁給誰」，這裡綁給 ServiceAccount viewer-sa。roleRef 指定「綁哪個 Role」，這裡綁 pod-viewer。apiGroup 要寫 rbac.authorization.k8s.io，這是固定寫法。

三個 YAML 組合在一起，就完成了一件事：viewer-sa 這個 ServiceAccount 擁有 pod-viewer 這個 Role 的權限，也就是在 default Namespace 裡面可以 get、list、watch Pod 和 Service。僅此而已，其他什麼都不能做。

常見的 RBAC 設計方案是這樣的。開發人員在 dev Namespace 有完整權限，在 staging 有完整權限，在 prod 只有只讀。SRE 或 DevOps 在所有 Namespace 都有完整權限。實習生只能在 dev 看看，staging 和 prod 碰都不能碰。真正的部署操作交給 CI/CD Pipeline，比如 ArgoCD。這樣就算有人手滑，損害也限制在可控範圍內。

好，概念講完了。接下來我們實際建一個只讀使用者，然後驗證它真的不能刪東西。

[▶ 下一頁]`,
  },

  // ── 7-12 實作（1/2）：RBAC YAML + 操作 ──
  {
    title: 'RBAC 實作：只讀使用者',
    subtitle: 'ServiceAccount + Role + RoleBinding',
    section: 'Loop 2：RBAC',
    duration: '6',
    content: (
      <div className="space-y-3">
        <div className="bg-green-900/20 border border-green-500/40 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm mb-1">① Role — 定義能做什麼</p>
          <div className="text-xs text-slate-300 space-y-0.5">
            <p><span className="text-slate-400">resources:</span> <code className="text-amber-400">pods, services</code></p>
            <p><span className="text-slate-400">verbs:</span> <code className="text-green-400">get, list, watch</code>（只讀，無 delete/create）</p>
          </div>
        </div>
        <div className="bg-blue-900/20 border border-blue-500/40 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm mb-1">② ServiceAccount — Pod 的身份</p>
          <div className="text-xs text-slate-300">
            <p><span className="text-slate-400">name:</span> <code className="text-blue-400">viewer-sa</code>　namespace: default</p>
          </div>
        </div>
        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-1">③ RoleBinding — 把 Role 給 SA</p>
          <div className="text-xs text-slate-300">
            <p><span className="text-slate-400">subjects:</span> <code className="text-blue-400">viewer-sa</code>　→　<span className="text-slate-400">roleRef:</span> <code className="text-green-400">pod-viewer</code></p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs mt-1">
          <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400">viewer-sa</span>
          <span className="text-amber-400 font-bold">→ RoleBinding →</span>
          <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">pod-viewer Role</span>
          <span className="text-slate-400 font-bold">=</span>
          <span className="text-slate-300">只能讀 Pod/Service</span>
        </div>
      </div>
    ),
    code: `# 部署
kubectl apply -f rbac-viewer.yaml
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding
---
# Role — 只讀：get / list / watch
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["pods", "services"]
    verbs: ["get", "list", "watch"]
---
# ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: viewer-sa
  namespace: default
---
# RoleBinding — 把 Role 綁到 SA
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: viewer-binding
  namespace: default
subjects:
  - kind: ServiceAccount
    name: viewer-sa
    namespace: default
roleRef:
  kind: Role
  name: pod-viewer
  apiGroup: rbac.authorization.k8s.io`,
    notes: `好，來動手做。我們要建三個資源：一個 ServiceAccount、一個 Role、一個 RoleBinding。把它們組合起來，做出一個只能看不能改的使用者。

先部署。rbac-viewer.yaml 這個檔案裡面包含了剛才講的三個 YAML，用三個橫線分隔開。

kubectl apply -f rbac-viewer.yaml

你會看到三行輸出。serviceaccount/viewer-sa created。role.rbac.authorization.k8s.io/pod-viewer created。rolebinding.rbac.authorization.k8s.io/viewer-binding created。三個都建好了。

確認一下。kubectl get serviceaccount viewer-sa 看到了，AGE 是幾秒。kubectl get role pod-viewer 看到了。kubectl get rolebinding viewer-binding 也看到了。三個資源都在。

[▶ 下一頁]`,
  },

  // ── 7-12 實作（2/2）：--as 測試驗證 ──
  {
    title: 'RBAC 驗證：--as 模擬身份',
    subtitle: 'get 成功 ✓　delete 被拒 ✗',
    section: 'Loop 2：RBAC',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✓ 查看成功</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
            <p>$ kubectl get pods --as=system:serviceaccount:default:viewer-sa</p>
            <pre className="text-green-400 whitespace-pre-wrap">{`NAME        READY  STATUS   RESTARTS
nginx-xxx   1/1    Running  0`}</pre>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">✗ 刪除被拒</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
            <p>$ kubectl delete pod nginx-xxx --as=system:serviceaccount:default:viewer-sa</p>
            <p className="text-red-400">Error from server (Forbidden): pods "nginx-xxx" is forbidden:</p>
            <p className="text-red-400">User cannot delete resource "pods" in namespace "default"</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">✗ 建立被拒</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
            <p>$ kubectl run test --image=nginx \</p>
            <p>    --as=system:serviceaccount:default:viewer-sa</p>
            <p className="text-red-400">Error from server (Forbidden): cannot create resource "pods"</p>
          </div>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-2 rounded text-xs overflow-x-auto"><code>{`kubectl get pods --as=system:serviceaccount:default:viewer-sa
kubectl delete pod <Pod名稱> --as=system:serviceaccount:default:viewer-sa
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa`}</code></pre>

        <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-300">
          <p>不加 <code className="text-cyan-400">--as</code> → 用預設 admin 身份 → 什麼都能做</p>
          <p className="mt-1 text-slate-400">企業：開發人員綁只讀 Role、CI/CD 綁部署 Role、只有 SRE 拿完整權限</p>
        </div>
      </div>
    ),
    notes: `好，現在來測試。K8s 提供了一個非常好用的旗標叫 --as，可以模擬用其他身份來操作。格式是 system:serviceaccount: 加上 namespace 加上冒號加上名字。

先試用 viewer-sa 的身份查看 Pod。

kubectl get pods --as=system:serviceaccount:default:viewer-sa

大家看，成功了。你可以看到 Pod 的列表。因為 pod-viewer 這個 Role 有 get 和 list 的權限。

好，現在試刪除。隨便找一個 Pod 的名字。

kubectl delete pod nginx-resource-demo-隨便一個hash --as=system:serviceaccount:default:viewer-sa

大家猜結果是什麼？

看，Error from server (Forbidden)。完整的錯誤訊息是 pods 某某某 is forbidden: User "system:serviceaccount:default:viewer-sa" cannot delete resource "pods" in API group "" in the namespace "default"。被拒絕了。因為我們的 Role 沒有 delete 這個 verb。K8s 很精確地告訴你：你沒有刪除 Pod 的權限。

再試建立一個新的 Pod。

kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa

一樣被拒。cannot create resource "pods"。沒有 create 權限。

那如果我們不加 --as 呢？那就是用你預設的 admin 身份。kubectl get pods 正常。kubectl run test-admin --image=nginx 成功建立了。因為你的 admin 有所有權限。kubectl delete pod test-admin 成功刪除。

看到差別了吧。同一個叢集，同一個 Namespace，但不同的身份有不同的權限。viewer-sa 只能看，admin 什麼都能做。這就是 RBAC 的威力。

在企業環境裡，你不會讓每個人都用 admin。你會根據角色建不同的 ServiceAccount 或 User，綁定不同的 Role。開發人員綁只讀的 Role，CI/CD 綁有部署權限的 Role，只有 SRE 才拿完整權限。

好，接下來先介紹另一個檢查權限的指令 kubectl auth can-i，對排錯很有用。

[▶ 下一頁]`,
  },

  // ── 7-12（新增 5/8）：kubectl auth can-i 快速檢查 ──
  {
    title: 'kubectl auth can-i：不用真的執行就能問',
    subtitle: '排錯 / Pipeline 權限自檢的神器',
    section: 'Loop 2：RBAC',
    duration: '4',
    content: (
      <div className="space-y-3">
        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">--as vs auth can-i</p>
          <p className="text-slate-300"><code className="text-amber-300">--as</code> 是<b>真的執行</b>動作（會改到東西）；<code className="text-amber-300">auth can-i</code> 是<b>只問不做</b>，只回 yes / no，安全。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded">
          <p className="text-green-400 font-semibold mb-2 text-sm">✓ 可以 get pods</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
            <p>$ kubectl auth can-i get pods \</p>
            <p>    --as=system:serviceaccount:default:viewer-sa</p>
            <p className="text-green-400">yes</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded">
          <p className="text-red-400 font-semibold mb-2 text-sm">✗ 不能 delete pods</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-slate-300">
            <p>$ kubectl auth can-i delete pods \</p>
            <p>    --as=system:serviceaccount:default:viewer-sa</p>
            <p className="text-red-400">no</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs text-slate-300 space-y-1">
          <p className="text-amber-300 font-semibold">常見用途</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>排錯：Pod 報 forbidden 時，先 can-i 確認是不是 Role 少了 verb</li>
            <li>CI/CD：Pipeline 跑前先 can-i 自檢，少掉部署到一半才失敗</li>
            <li>檢視：<code className="text-amber-300">kubectl auth can-i --list</code> 列出身份能做的所有事</li>
          </ul>
        </div>
      </div>
    ),
    notes: `除了 --as，K8s 還提供另一個很好用的指令：kubectl auth can-i。

兩個差別：--as 是真的執行動作，所以如果你測的是 delete，它真的會去刪。auth can-i 是只問不做，只會回 yes 或 no。安全很多，不會改到東西。

看例子。kubectl auth can-i get pods，帶 --as=system:serviceaccount:default:viewer-sa。回 yes，代表這個身份可以 get pods。

換成 delete。kubectl auth can-i delete pods，一樣帶 --as。回 no。一眼就知道這個身份沒有刪的權限。

三個常見用途。

第一，排錯。線上 Pod 報 forbidden，你不確定是 Role 忘了加 verb 還是 namespace 綁錯。can-i 問一下，yes 就代表權限 OK 問題在別處，no 就代表 Role 設定有問題。一秒定位。

第二，CI/CD Pipeline。部署前先用 can-i 自檢一遍，create deployment、update configmap 這些都回 yes 再跑。少掉那種部署到一半才 forbidden 的痛。

第三，kubectl auth can-i --list。帶 --as 可以列出這個身份能做的所有事。權限稽核的時候很方便。

後面下午的 Loop 4 部署完整系統時，我們也會用 can-i 驗證 backend-sa 的最小權限。

好，接下來換你們實作。[▶ 下一頁]`,
  },

  // ── 7-12 學員實作 ──
  {
    title: '學員實作：RBAC',
    subtitle: '⏱ 巡堂確認',
    section: 'Loop 2：RBAC',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">必做</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. 建 ServiceAccount + Role + RoleBinding</p>
            <p>2. <code className="text-cyan-400 text-xs">kubectl get pods --as=system:serviceaccount:default:viewer-sa</code> → 成功</p>
            <p>3. <code className="text-cyan-400 text-xs">kubectl delete pod xxx --as=system:serviceaccount:default:viewer-sa</code> → Forbidden</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">挑戰</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>寫一個新 Role：</p>
            <p>- 允許 get / list / create / update / delete <code className="text-green-400">deployments</code></p>
            <p>- 不能碰 <code className="text-red-400">secrets</code></p>
            <p>- 提示：rules 可以寫多條，每條指定不同 resources 和 verbs</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">巡堂檢查清單</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>□ kubectl get role pod-viewer → 存在</p>
            <p>□ kubectl get rolebinding viewer-binding → 存在</p>
            <p>□ --as get pods → 成功</p>
            <p>□ --as delete pod → Forbidden</p>
          </div>
        </div>
      </div>
    ),
    code: `# 驗收指令（做完每步後確認）

# Step 1 後：確認三個資源都建好
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding

# Step 2：模擬 viewer-sa 查看 Pod（應該成功）
kubectl get pods --as=system:serviceaccount:default:viewer-sa

# Step 3：模擬 viewer-sa 刪除 Pod（應該 Forbidden）
kubectl delete pod <任意pod名> --as=system:serviceaccount:default:viewer-sa

# 快速確認權限（yes = 有，no = 沒有）
kubectl auth can-i get pods --as=system:serviceaccount:default:viewer-sa
kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa

# 列出這個身份能做的所有事（權限稽核用）
kubectl auth can-i --list --as=system:serviceaccount:default:viewer-sa`,
    notes: `必做題是跟著我剛才的步驟做一遍。建 ServiceAccount、Role、RoleBinding，然後用 --as 測試。確認 get pods 成功，delete pod 被拒。

挑戰題是自己寫一個新的 Role，允許 get、list、create、update、delete deployments，但不能碰 secrets。然後建一個新的 ServiceAccount 綁上去，用 --as 測試能操作 Deployment 但不能讀 Secret。提示：resources 那個欄位可以寫多條 rule，每條 rule 指定不同的 resources 和 verbs。

大家動手做，有問題舉手。

[▶ 下一頁]`,
  },

  // ── 7-13 回頭操作：RBAC ──
  {
    title: '回頭操作：RBAC 常見坑',
    subtitle: 'Loop 4 小結',
    section: 'Loop 2：RBAC',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">1.</span>
              <div>
                <p><code className="text-xs text-red-400">--as</code> 格式寫錯</p>
                <p className="text-xs text-slate-400">✗ --as=viewer-sa | ✓ --as=system:serviceaccount:default:viewer-sa</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">2.</span>
              <div>
                <p>Role 和 SA 不在同一個 Namespace</p>
                <p className="text-xs text-slate-400">Role 在 default、SA 在 dev → dev 裡毫無權限</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">3.</span>
              <div>
                <p>roleRef 的 kind / name / apiGroup 寫錯</p>
                <p className="text-xs text-slate-400">apiGroup 固定 rbac.authorization.k8s.io</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Loop 4 因果鏈</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>上午：Probe 管健康 → Resource 管資源 → HPA 管容量</p>
            <p>→ 都是管「<span className="text-cyan-400">服務</span>」的</p>
            <p className="text-green-400 font-bold mt-2">下午 Loop 4：RBAC 管「人」→ 誰能看、誰能改、誰能刪</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-3 rounded-lg text-sm text-amber-300">
          <p>下一個問題：人管住了，但 Pod 之間呢？</p>
          <p>所有 Pod 預設全通 → 前端被入侵 → 攻擊者直通 DB</p>
        </div>
      </div>
    ),
    notes: `好，回頭確認一下大家的 RBAC 做到了。

kubectl get role pod-viewer 看一下。有沒有？kubectl get rolebinding viewer-binding 有沒有？

然後最重要的測試，用 --as 模擬。

kubectl get pods --as=system:serviceaccount:default:viewer-sa

這行能看到 Pod 列表嗎？能。好。

kubectl delete pod 隨便一個名字 --as=system:serviceaccount:default:viewer-sa

有被拒絕嗎？看到 Forbidden 了嗎？看到了。好，RBAC 就做對了。

來看幾個常見的坑。

第一個坑，--as 的格式寫錯。最常見的錯誤是忘了前面的 system:serviceaccount: 前綴。你不能直接寫 --as=viewer-sa，要寫完整的 system:serviceaccount:default:viewer-sa。冒號分隔，namespace 是 default。如果你的 ServiceAccount 在其他 Namespace，記得把 default 換成對應的 Namespace 名字。

第二個坑，Role 和 ServiceAccount 不在同一個 Namespace。比如 Role 建在 default，ServiceAccount 建在 dev，RoleBinding 也在 default。結果在 dev 裡面這個 ServiceAccount 一點權限都沒有。Role、RoleBinding、和 ServiceAccount 的 Namespace 要配對。

第三個坑，RoleBinding 的 roleRef 寫錯。roleRef 裡面的 kind 要寫 Role 不是 ClusterRole，name 要跟你的 Role 名字完全一樣，apiGroup 固定是 rbac.authorization.k8s.io。如果你用 ClusterRole 搭配 RoleBinding，kind 就要寫 ClusterRole。

好，Loop 4 結束。我們用一句話串一下因果鏈。上午的最後，Probe 確保服務健康、Resource limits 確保資源公平、HPA 確保容量彈性。但這三個都是管「服務」的。下午第一個 Loop，RBAC 開始管「人」。誰能看、誰能改、誰能刪，權限分明。

那下一個問題是什麼？人管住了，但 Pod 之間呢？你的叢集裡面，所有 Pod 預設是全部互通的。前端 Pod 可以直接連資料庫。如果前端被入侵了，攻擊者可以橫向移動到資料庫。這就是下一個 Loop 要解決的問題。

[▶ 下一頁]`,
  },

  // ── 7-13 學員實作解答：RBAC ──
  {
    title: '解答：只讀 Role + ServiceAccount + RoleBinding',
    subtitle: 'Loop 4 完成',
    section: 'Loop 2：RBAC',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做解答：YAML 關鍵片段</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># Role：只讀，沒有 delete</p>
            <p>rules:</p>
            <p>{'- '}apiGroups: [""]</p>
            <p>{'  '}resources: ["pods"]</p>
            <p className="text-green-400">{'  '}verbs: ["get", "list", "watch"]{'  '}# 沒有 delete！</p>
            <p className="text-slate-500 mt-1"># ServiceAccount + RoleBinding 也要建</p>
            <p>subjects:</p>
            <p>{'- '}kind: ServiceAccount</p>
            <p>{'  '}name: viewer-sa</p>
            <p>{'  '}namespace: default</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證指令</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># 成功（有 get 權限）</p>
            <p>kubectl --as=system:serviceaccount:default:viewer-sa get pods</p>
            <p className="text-slate-500 mt-1"># 失敗（沒有 delete 權限）→ Forbidden</p>
            <p>kubectl --as=system:serviceaccount:default:viewer-sa delete pod {'<任意 pod 名>'}</p>
            <p className="text-slate-500 mt-1"># 清理</p>
            <p>kubectl delete sa viewer-sa</p>
            <p>kubectl delete role pod-viewer</p>
            <p>kubectl delete rolebinding viewer-binding</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">預期結果</p>
          <p className="text-xs text-slate-300 mt-1">get pods 成功列出 Pod；delete pod 回傳 Forbidden（403）</p>
        </div>
      </div>
    ),
    notes: `來看解答。

RBAC 的核心是 verbs。這個 Role 只給了 get、list、watch，沒有 delete。有了 delete 才能刪，沒有就被拒。

驗證方式是用 --as 模擬 ServiceAccount 的身份。格式一定要是 system:serviceaccount:namespace:名稱，不能省略前綴。get pods 應該成功，delete pod 應該看到 Error from server (Forbidden)。

如果 get pods 也失敗，最常見的原因是 RoleBinding 的 subjects 裡面 namespace 寫錯，或者 roleRef 的 name 跟 Role 名字不匹配。

清理三個資源：kubectl delete sa viewer-sa、delete role pod-viewer、delete rolebinding viewer-binding。 [▶ 下一頁]`,
  },

  // ── 進階：真的發 kubeconfig 給別人 ──
  {
    title: '進階：真的發一份 kubeconfig 給別人',
    subtitle: '對方用那份登入，就只有你給的權限',
    section: 'Loop 2：RBAC',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 border border-slate-700 p-3 rounded text-xs text-slate-400">
          <p><code className="text-amber-300">--as</code> 是管理員模擬測試用。真實環境要給對方一份獨立的 kubeconfig，他登入就只有對應的權限。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-xs mb-2">Step 1–3：產生 token + 組 kubeconfig</p>
          <pre className="bg-slate-950 text-green-400 p-2 rounded text-xs overflow-x-auto"><code>{`TOKEN=$(kubectl create token viewer-sa --duration=8760h)
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CA_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')

cat > /tmp/viewer-sa.kubeconfig << EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: viewer-sa
  user:
    token: $TOKEN
contexts:
- name: viewer-sa@k3s
  context:
    cluster: k3s
    user: viewer-sa
current-context: viewer-sa@k3s
EOF`}</code></pre>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-xs mb-2">Step 4：換成 master 實際 IP（給外部使用者）</p>
          <pre className="bg-slate-950 text-green-400 p-2 rounded text-xs overflow-x-auto"><code>{`sed -i 's|https://127.0.0.1:6443|https://192.168.43.133:6443|' /tmp/viewer-sa.kubeconfig`}</code></pre>
          <p className="text-slate-400 text-xs mt-1">127.0.0.1 只有在 master 本機才能用，給別人要換成實際 IP</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold text-xs mb-2">Step 5：驗證</p>
          <pre className="bg-slate-950 text-green-400 p-2 rounded text-xs overflow-x-auto"><code>{`# 成功（有 get 權限）
kubectl --kubeconfig=/tmp/viewer-sa.kubeconfig get pods

# 失敗（沒有 delete 權限）→ Forbidden
kubectl --kubeconfig=/tmp/viewer-sa.kubeconfig delete pod <任意名稱>`}</code></pre>
        </div>
      </div>
    ),
    code: `# Step 1：產生 token（一年效期）
TOKEN=$(kubectl create token viewer-sa --duration=8760h)

# Step 2：取得 cluster 資訊
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CA_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')

# Step 3：組成 kubeconfig
cat > /tmp/viewer-sa.kubeconfig << EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: viewer-sa
  user:
    token: $TOKEN
contexts:
- name: viewer-sa@k3s
  context:
    cluster: k3s
    user: viewer-sa
current-context: viewer-sa@k3s
EOF

# Step 4：換成 master 實際 IP
sed -i 's|https://127.0.0.1:6443|https://192.168.43.133:6443|' /tmp/viewer-sa.kubeconfig

# Step 5：驗證
kubectl --kubeconfig=/tmp/viewer-sa.kubeconfig get pods
kubectl --kubeconfig=/tmp/viewer-sa.kubeconfig delete pod <任意名稱>`,
    notes: `--as 是管理員模擬用，不是真的換身份。真實環境要給別人獨立的 kubeconfig。

token 用 kubectl create token 產生，duration 可以設 1h、24h、8760h（一年）。

kubeconfig 裡有三樣東西：cluster（server 位址和 CA）、user（token）、context（把兩者綁在一起）。

注意 server 預設是 127.0.0.1，只有在 master 本機才能用。要給外部的人就要換成 master 的實際 IP。

驗證：get pods 成功，delete pod Forbidden，代表這份 kubeconfig 真的只有 viewer-sa 的權限。

把 /tmp/viewer-sa.kubeconfig 複製給對方，對方 export KUBECONFIG=/path/to/viewer-sa.kubeconfig 後所有 kubectl 操作都受 RBAC 限制。`,
  },

  // ============================================================
  // Loop 3：Probe 健康檢查（對應 public/docs/day7-loop3-probe.md）
  // 7-2 概念（2 張） + 7-3 實作（4 張） + 7-4 學員實作（1 張）= 7 張
  // ============================================================

  // ── Loop 3-1（1/7）：Running 在騙你 ──
  {
    title: 'Loop 3：Probe 健康檢查',
    subtitle: 'Running 不代表服務正常',
    section: '7-2：Probe 概念',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/30 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-300 font-semibold mb-1">殘酷的事實</p>
          <p className="text-slate-300 text-sm">kubectl get pods 看到 Running，不代表服務正常。Running 只代表容器裡面的主行程還在跑——process 活著，K8s 就認為你是 Running。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">三種 Running 卻出包的場景</p>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-900/60 p-2 rounded border-l-2 border-amber-500">
              <p className="text-amber-300 font-semibold">場景一：API 死鎖</p>
              <p className="text-slate-400">process 還活著，但不處理任何請求</p>
            </div>
            <div className="bg-slate-900/60 p-2 rounded border-l-2 border-amber-500">
              <p className="text-amber-300 font-semibold">場景二：連線池滿了</p>
              <p className="text-slate-400">回 500 錯誤，K8s 照樣顯示 Running</p>
            </div>
            <div className="bg-slate-900/60 p-2 rounded border-l-2 border-amber-500">
              <p className="text-amber-300 font-semibold">場景三：Java 啟動要 60 秒</p>
              <p className="text-slate-400">這 60 秒的請求全部失敗</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `上一個 Loop 我們做了 RBAC，權限分明了。但我今天要跟大家說一件殘酷的事情：穿得漂亮不代表扛得住。

從第四堂到現在，你怎麼確認服務正常？打 kubectl get pods，看到 STATUS 是 Running，覺得沒事了。但 Running 這個狀態在騙你。Running 只代表一件事：容器裡面的主行程還在跑。process 活著，K8s 就認為你是 Running。

場景一：API 死鎖，process 還活著，但不處理任何請求。場景二：連線池滿了，回 500 錯誤但 K8s 照樣顯示 Running。場景三：Java 啟動要 60 秒，這 60 秒的請求全部失敗。K8s 不知道你的服務到底正不正常。

所以我們需要 Probe。[▶ 下一頁：三種 Probe]`,
  },

  // ── Loop 3-2（2/7）：三種 Probe ──
  {
    title: '三種 Probe 各司其職',
    subtitle: 'K8s 用三種探針解決 Running 不等於健康的問題',
    section: '7-2：Probe 概念',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800">
                <th className="border border-slate-700 p-2 text-cyan-300">Probe</th>
                <th className="border border-slate-700 p-2 text-cyan-300">問的問題</th>
                <th className="border border-slate-700 p-2 text-cyan-300">失敗怎麼辦</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-700 p-2 font-mono text-amber-300">livenessProbe</td>
                <td className="border border-slate-700 p-2 text-slate-300">你還活著嗎？</td>
                <td className="border border-slate-700 p-2 text-red-300">重啟容器</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="border border-slate-700 p-2 font-mono text-amber-300">readinessProbe</td>
                <td className="border border-slate-700 p-2 text-slate-300">準備好接流量了嗎？</td>
                <td className="border border-slate-700 p-2 text-orange-300">從 Service 移除</td>
              </tr>
              <tr>
                <td className="border border-slate-700 p-2 font-mono text-amber-300">startupProbe</td>
                <td className="border border-slate-700 p-2 text-slate-300">啟動完了嗎？</td>
                <td className="border border-slate-700 p-2 text-red-300">重啟容器（慢啟動用）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">對比 Docker HEALTHCHECK</p>
          <p className="text-slate-400">Docker 只有一種，只會標記 unhealthy，不會幫你重啟也不會切流量。K8s 三種 Probe 各司其職。</p>
        </div>
      </div>
    ),
    notes: `K8s 用三種 Probe——探針——來解這個問題。

第一個 livenessProbe，存活探測，問「你還活著嗎？」失敗就重啟容器。

第二個 readinessProbe，就緒探測，問「準備好接流量了嗎？」失敗不重啟，只把 Pod 從 Service 的 Endpoints 移除，不導流量給它。等它自己恢復再加回來。

第三個 startupProbe，啟動探測，專門給啟動特別慢的應用用的。等它通過，才開始跑 liveness 和 readiness。

對比一下 Docker HEALTHCHECK，Docker 只有一種，只會標記 unhealthy，不會幫你重啟也不會切流量。K8s 三種各司其職，這才是生產等級的健康管理。

詳細用法我們進實作再說。[▶ 下一頁：三種檢查方式]`,
  },

  // ── Loop 3-3（3/7）：三種檢查方式 + YAML 參數 ──
  {
    title: '三種檢查方式 + 四個關鍵參數',
    subtitle: '怎麼檢查 ＋ 多久檢查一次',
    section: '7-3：Probe 實作',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-mono font-semibold">httpGet</p>
            <p className="text-slate-400 mt-1">打 URL，200~399 成功</p>
            <p className="text-slate-500 mt-1 text-[0.7rem]">Web API（最常用）</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-mono font-semibold">tcpSocket</p>
            <p className="text-slate-400 mt-1">連 port，連上成功</p>
            <p className="text-slate-500 mt-1 text-[0.7rem]">資料庫、Redis</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 p-3 rounded">
            <p className="text-green-300 font-mono font-semibold">exec</p>
            <p className="text-slate-400 mt-1">執行指令，exit 0 成功</p>
            <p className="text-slate-500 mt-1 text-[0.7rem]">自訂檢查邏輯</p>
          </div>
        </div>

        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5    # 容器啟動後先等幾秒再開始
  periodSeconds: 10          # 每幾秒檢查一次
  failureThreshold: 3        # 連續失敗幾次才判定不健康
  timeoutSeconds: 1          # 每次檢查等幾秒沒回應算超時`}</code></pre>

        <div className="bg-slate-800/40 border-l-4 border-amber-500 p-2 rounded text-xs text-amber-300">
          readinessProbe 的 periodSeconds 通常比 liveness 短——Pod 準備好了就趕快接流量
        </div>
      </div>
    ),
    notes: `三種檢查方式。

httpGet，打一個 URL，回 200 到 399 算成功。Web API 最常用。tcpSocket，只看 port 連不連得上，適合資料庫、Redis 這種不是 HTTP 的服務。exec，在容器裡跑一段指令，exit 0 算成功，自訂檢查邏輯用的。

YAML 四個關鍵參數。initialDelaySeconds 是容器啟動後先等幾秒再開始檢查。periodSeconds 是每幾秒檢查一次。failureThreshold 是連續失敗幾次才判定不健康——不是失敗一次就重啟，可能只是網路抖了一下。timeoutSeconds 是每次檢查等幾秒沒回應算超時。

readinessProbe 的 periodSeconds 通常比 liveness 短。因為 readinessProbe 管的是流量，Pod 一準備好就要快點加回 Service 開始接流量。

概念講完了，進 demo。[▶ 下一頁：Step 1-3 部署 + 觀察]`,
  },

  // ── Loop 3-4（4/7）：Step 1-3 部署 nginx + Probe ──
  {
    title: 'Step 1-3：部署 nginx + 確認 Probe',
    subtitle: 'deployment-probe.yaml',
    section: '7-3：Probe 實作',
    duration: '4',
    content: (
      <div className="space-y-3">
        <pre className="bg-slate-950 text-slate-100 p-3 rounded text-xs overflow-x-auto"><code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-probe-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-probe
  template:
    metadata:
      labels:
        app: nginx-probe
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet: { path: /, port: 80 }
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3
            timeoutSeconds: 1
          readinessProbe:
            httpGet: { path: /, port: 80 }
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 2`}</code></pre>

        <div className="bg-slate-800/50 p-2 rounded text-xs font-mono space-y-1">
          <p className="text-slate-500"># 部署 + 確認 Probe 設定</p>
          <p className="text-green-300">kubectl apply -f deployment-probe.yaml</p>
          <p className="text-green-300">kubectl get pods -l app=nginx-probe</p>
          <p className="text-green-300">kubectl describe pods -l app=nginx-probe | grep -A10 "Liveness\\|Readiness"</p>
        </div>
      </div>
    ),
    notes: `先建 deployment-probe.yaml。replicas 2、image nginx:1.27、containerPort 80。兩種 Probe 都設。

livenessProbe 打根路徑，initialDelaySeconds 5、periodSeconds 10、failureThreshold 3、timeoutSeconds 1。意思是容器啟動後等 5 秒開始檢查，每 10 秒打一次，連續失敗 3 次才判定不健康，每次等 1 秒沒回應就超時。

readinessProbe 也打根路徑，但 periodSeconds 設 5 秒，比 liveness 頻繁。

apply 下去，兩個 Pod Running，READY 1/1，RESTARTS 0。

describe 確認 Probe 有吃進去，你會看到 Liveness 和 Readiness 兩行，顯示 delay、timeout、period、failure，跟我們設的一致。這樣才算設定正確。

接下來故意把它搞壞。[▶ 下一頁：Step 4-6 故意搞壞]`,
  },

  // ── Loop 3-5（5/7）：Step 4-6 故意搞壞觀察重啟 ──
  {
    title: 'Step 4-6：刪掉 index.html 觀察重啟',
    subtitle: 'livenessProbe 失敗 → K8s 重啟容器',
    section: '7-3：Probe 實作',
    duration: '4',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/40 border-l-4 border-amber-500 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">原理</p>
          <p className="text-slate-400">nginx 預設回 200。刪掉 index.html 後找不到檔案，回 403 Forbidden。403 不在 200~399 的範圍，Probe 失敗。</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs font-mono space-y-1">
          <p className="text-slate-500"># 抓第一個 Pod 名字</p>
          <p className="text-green-300">{`POD_NAME=$(kubectl get pods -l app=nginx-probe -o jsonpath='{.items[0].metadata.name}')`}</p>
          <p className="text-slate-500 mt-1"># 故意搞壞</p>
          <p className="text-green-300">kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html</p>
          <p className="text-slate-500 mt-1"># 觀察（watch 模式）</p>
          <p className="text-green-300">kubectl get pods -l app=nginx-probe -w</p>
        </div>

        <div className="bg-slate-950 p-2 rounded text-xs font-mono">
          <p className="text-slate-400">NAME                       READY   STATUS    RESTARTS   AGE</p>
          <p className="text-slate-300">nginx-probe-demo-...-abc   1/1     Running   0          2m</p>
          <p className="text-amber-300">nginx-probe-demo-...-abc   0/1     Running   0          2m30s</p>
          <p className="text-green-300">nginx-probe-demo-...-abc   1/1     Running   <b>1</b>          2m35s</p>
        </div>

        <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-2 rounded text-xs">
          <p className="text-cyan-300">算一下時間：periodSeconds 10 × failureThreshold 3 = <b>最多等 30 秒</b> 看到重啟</p>
        </div>
      </div>
    ),
    notes: `現在故意把它搞壞。

原理先講清楚。nginx 的 livenessProbe 打根路徑，nginx 會回傳 index.html，狀態碼 200，Probe 通過。如果把 index.html 刪掉，nginx 找不到這個檔案，回 403 Forbidden。403 不在 200 到 399 的範圍，Probe 失敗。

指令三步。先抓第一個 Pod 的名字，用 jsonpath 取 items 零的 metadata name。然後 kubectl exec 進容器，rm /usr/share/nginx/html/index.html 刪掉首頁。最後 kubectl get pods -w，w 是 watch 模式，即時顯示狀態變化。

算一下時間。periodSeconds 10 秒，failureThreshold 3 次，最多等 30 秒看到重啟。你會看到 READY 從 1/1 變 0/1——這是 readinessProbe 先失敗把 Pod 從 Service 拉掉——再過幾秒 RESTARTS 從 0 變 1，livenessProbe 達到 failureThreshold，K8s 重啟容器。重啟完 nginx 重新載入，index.html 恢復，兩個 Probe 都通過。

按 Ctrl+C 停 watch。接下來看 Events 確認原因。[▶ 下一頁：Events + QA]`,
  },

  // ── Loop 3-6（6/7）：Events + QA + 常見坑 ──
  {
    title: 'Events 確認原因 + 三個常見坑',
    subtitle: 'describe pod 看 Probe 失敗記錄',
    section: '7-3：Probe 實作',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-2 rounded text-xs font-mono">
          <p className="text-green-300">kubectl describe pod $POD_NAME</p>
        </div>

        <div className="bg-slate-950 p-2 rounded text-xs font-mono space-y-1">
          <p className="text-slate-500">Events:</p>
          <p className="text-amber-300">Warning  Unhealthy  Liveness probe failed: statuscode: 403</p>
          <p className="text-amber-300">Warning  Killing    Container nginx failed liveness probe, will be restarted</p>
          <p className="text-slate-300">Normal   Pulled     Container image "nginx:1.27" already present</p>
          <p className="text-green-300">Normal   Started    Started container nginx</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-2">三個常見坑</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900">
                <th className="border border-slate-700 p-1 text-cyan-300">坑</th>
                <th className="border border-slate-700 p-1 text-cyan-300">症狀</th>
                <th className="border border-slate-700 p-1 text-cyan-300">解法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-700 p-1 font-mono">initialDelay 設 0</td>
                <td className="border border-slate-700 p-1">Pod 一啟動就重啟</td>
                <td className="border border-slate-700 p-1">至少 3~5 秒</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="border border-slate-700 p-1 font-mono">path 寫錯</td>
                <td className="border border-slate-700 p-1">一直重啟看不出原因</td>
                <td className="border border-slate-700 p-1">確認 path 會回 200</td>
              </tr>
              <tr>
                <td className="border border-slate-700 p-1 font-mono">port 不一致</td>
                <td className="border border-slate-700 p-1">每次 connection refused</td>
                <td className="border border-slate-700 p-1">對齊 containerPort</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/40 p-2 rounded text-xs">
          <p className="text-purple-300 font-semibold mb-1">QA 快速過</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>liveness + readiness 可<b className="text-purple-300">同時設</b>，互補不衝突（最常見）</li>
            <li>startupProbe 通過後<b className="text-purple-300">就交棒</b>，不會再跑</li>
            <li>readinessProbe 失敗<b className="text-purple-300">不重啟</b> Pod，只把它從 Service endpoints 拉掉</li>
          </ul>
        </div>
      </div>
    ),
    notes: `kubectl describe pod，找到 Events 區塊，你會看到完整的記錄。

Warning Unhealthy，Liveness probe failed，statuscode 403——這就是 K8s 偵測到 403 的證據。

Warning Killing，Container nginx failed liveness probe, will be restarted——K8s 決定重啟。

接著是 Normal Pulled，Normal Started，容器重新啟動起來。

這就是完整的因果鏈。Probe 失敗→判定不健康→重啟→恢復。

三個常見坑要特別注意。第一，initialDelaySeconds 設 0，容器一啟動就檢查，程式還沒初始化完就被判不健康，Pod 一直重啟。至少設 3 到 5 秒。

第二，path 寫錯。你設了 /health 但應用沒有這個路徑，每次 Probe 都 404，Pod 一直被重啟但你看不出原因。確認 path 是你的應用確實會回 200 的路徑。

第三，port 跟 containerPort 不一致。每次 Probe 都 connection refused。這個最容易踩到。

QA 快速過三個。liveness 和 readiness 可以同時設，而且是最常見做法，互補不衝突。startupProbe 通過就不跑了，交棒給另外兩個。readinessProbe 失敗 Pod 還在，但不收流量，等它自己恢復。[▶ 下一頁：學員實作]`,
  },

  // ── Loop 3-7（7/7）：學員實作 ──
  {
    title: '學員實作：my-nginx-probe',
    subtitle: '讓 RESTARTS 從 0 變 1',
    section: '7-4：回頭操作 Loop 3',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/40 border-l-4 border-green-500 p-3 rounded text-xs">
          <p className="text-green-300 font-semibold mb-1">🎯 必做題</p>
          <p className="text-slate-300">自己從零寫一個 nginx Deployment，加 livenessProbe，觸發重啟，讓 RESTARTS 從 0 變 1。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">要求</p>
          <ul className="text-slate-300 space-y-1 list-disc list-inside">
            <li>Deployment 名稱：<code className="bg-slate-900 px-1 rounded text-amber-300">my-nginx-probe</code>，replicas: 1</li>
            <li>image: <code className="bg-slate-900 px-1 rounded text-amber-300">nginx:1.27</code></li>
            <li>livenessProbe httpGet 打 <code className="bg-slate-900 px-1 rounded text-amber-300">/</code>、port 80</li>
            <li><code className="bg-slate-900 px-1 rounded text-amber-300">initialDelaySeconds: 5</code>、<code className="bg-slate-900 px-1 rounded text-amber-300">periodSeconds: 10</code>、<code className="bg-slate-900 px-1 rounded text-amber-300">failureThreshold: 3</code></li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">驗證步驟</p>
          <ol className="text-slate-300 space-y-1 list-decimal list-inside">
            <li>kubectl get pods 確認 Running</li>
            <li>kubectl exec ... -- rm /usr/share/nginx/html/index.html</li>
            <li>kubectl get pods -w 等 30 秒內看到 RESTARTS +1</li>
            <li>kubectl describe pod 在 Events 找到 Liveness probe failed</li>
          </ol>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          🏆 挑戰題：再加 readinessProbe + startupProbe + Service，觀察 endpoints 變化
        </div>
      </div>
    ),
    notes: `好，現在是你們的實作時間。我示範完了，換你們自己做一遍。記住目標：讓 RESTARTS 從 0 變成 1。

必做題，自己從零寫一個 nginx Deployment，加上 livenessProbe。Deployment 名稱 my-nginx-probe，replicas 1，image nginx:1.27。livenessProbe 用 httpGet 打根路徑 port 80，initialDelaySeconds 5、periodSeconds 10、failureThreshold 3。

部署後的驗證步驟四步。第一步 kubectl get pods 確認 Running。第二步 kubectl exec 進容器 rm 掉 index.html。第三步 kubectl get pods -w，等 30 秒內看到 RESTARTS 欄位從 0 變 1。第四步 kubectl describe pod，在 Events 裡找到 Liveness probe failed。

挑戰題給行有餘力的。同時設 readinessProbe 和 startupProbe，並建一個對應的 Service。刪 index.html 後用 kubectl get endpoints 觀察 Pod IP 從 endpoints 消失——這是 readinessProbe 失敗把 Pod 從 Service 拉掉。等容器重啟後再看一次，Pod IP 又出現在 endpoints。這樣你就親眼看到 readinessProbe 控制流量、livenessProbe 控制重啟，兩個分工。

給你們 10 到 15 分鐘。做完下課前我們進下午的 Loop 4，從零建完整系統。[▶ Loop 3 結束]`,
  },

  // ============================================================
]