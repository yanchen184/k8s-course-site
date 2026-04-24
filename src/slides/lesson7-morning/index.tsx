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
  // Loop 2：RBAC 權限控制（對應 public/docs/day7-loop2-rbac.md）
  // 7-5 概念（2 張） + 7-6 實戰（7 張） + 7-7 學員實作（3 張）= 12 張
  // ============================================================


  // ── [1/12] 7-5 概念（1/2）：誰都能刪 Pod + RBAC 核心邏輯 ──
  {
    title: '誰都能刪 Pod？RBAC 解決的問題',
    subtitle: '實習生一個指令，毀掉 production',
    section: '7-5：RBAC 概念',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded">
          <p className="text-red-400 font-semibold mb-2">恐怖故事</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>十個開發者全拿 <code className="text-red-400">cluster-admin</code> 的 kubeconfig</p>
            <p>某天實習生跑清理腳本：</p>
            <div className="bg-slate-900 p-2 rounded font-mono text-red-400 text-xs">
              kubectl delete namespace production
            </div>
            <p className="text-xs text-slate-400">production 底下所有東西瞬間消失（業界真實案例）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">RBAC 核心邏輯</p>
          <p className="text-slate-300 mb-2">誰（Subject）+ 能做什麼（Role）= 綁定（Binding）</p>
          <ul className="text-slate-300 space-y-1 list-disc list-inside">
            <li><b className="text-cyan-300">Subject</b>：User、Group、ServiceAccount</li>
            <li><b className="text-cyan-300">Role</b>：定義允許的操作清單</li>
            <li><b className="text-cyan-300">Binding</b>：把 Role 綁到 Subject 身上</li>
          </ul>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          <b>Default Deny</b>：沒寫 = 沒權限。跟防火牆相反 — RBAC 預設全擋，一條一條開。
        </div>
      </div>
    ),
    notes: `講一個真實故事開場。

你們公司十個開發者，全部都拿著 cluster-admin 的 kubeconfig。某天實習生跑了一個清理腳本，腳本裡有個 bug：kubectl delete namespace production。production 底下所有東西瞬間消失。這在業界真實發生過。

Docker 更糟。Docker 根本沒有內建的權限控制。只要你能連到 Docker Socket，你就等於 root。K8s 至少提供了一套完整的權限控制機制，叫 RBAC。

RBAC 全名 Role-Based Access Control，中文叫基於角色的存取控制。核心邏輯一句話：誰加上能做什麼等於綁定。

三個元素。第一，Subject 是「誰」，可以是 User、Group、或 ServiceAccount。第二，Role 是「能做什麼」，定義操作清單。第三，Binding 把兩個綁在一起。

最重要的觀念：RBAC 是 Default Deny，預設拒絕。沒列進 Role 的就是沒權限。跟防火牆剛好相反——防火牆預設全通，你要一條一條擋；RBAC 預設全擋，你要一條一條開。

所以寫 Role 的時候你不用寫「不能碰 Secret」，你不列它，它就碰不到。這個觀念等一下實作的時候會反覆驗證。

[▶ 下一頁：四個物件 + ServiceAccount]`,
  },

  // ── [2/12] 7-5 概念（2/2）：四個物件 + SA + 企業設計 ──
  {
    title: '四個 RBAC 物件 + ServiceAccount',
    subtitle: '門禁卡比喻 + 企業真實設計',
    section: '7-5：RBAC 概念',
    duration: '2',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold mb-2">四個物件</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900">
                <th className="border border-slate-700 p-1 text-cyan-300">物件</th>
                <th className="border border-slate-700 p-1 text-cyan-300">範圍</th>
                <th className="border border-slate-700 p-1 text-cyan-300">比喻</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-700 p-1 font-mono">Role</td>
                <td className="border border-slate-700 p-1">單一 Namespace</td>
                <td className="border border-slate-700 p-1">3 樓門禁卡</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="border border-slate-700 p-1 font-mono">ClusterRole</td>
                <td className="border border-slate-700 p-1">整個叢集</td>
                <td className="border border-slate-700 p-1">萬能卡</td>
              </tr>
              <tr>
                <td className="border border-slate-700 p-1 font-mono">RoleBinding</td>
                <td className="border border-slate-700 p-1">單一 Namespace</td>
                <td className="border border-slate-700 p-1">發卡給員工</td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="border border-slate-700 p-1 font-mono">ClusterRoleBinding</td>
                <td className="border border-slate-700 p-1">整個叢集</td>
                <td className="border border-slate-700 p-1">發萬能卡</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold mb-1">ServiceAccount 不只給 Pod</p>
          <p className="text-slate-300">SA 原本給 Pod 跟 API Server 溝通用，但也能<b className="text-amber-300">包成 kubeconfig 發給真人工程師</b>。下一段就示範。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded">
          <p className="text-cyan-400 font-semibold mb-1">企業真實設計</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>開發者：自己的 dev ns 完整權限、prod 只讀</li>
            <li>SRE：所有 ns 完整權限</li>
            <li>實習生：dev 只讀、prod 禁止</li>
            <li>CI/CD：有部署權限、沒刪除權限</li>
          </ul>
        </div>
      </div>
    ),
    notes: `RBAC 一共四個物件，兩兩成對。

Role 跟 ClusterRole 定義「能做什麼」，差別在範圍。Role 只在一個 Namespace 裡有效。ClusterRole 整個叢集有效，不限 Namespace。

RoleBinding 跟 ClusterRoleBinding 負責「把 Role 發給 Subject」。RoleBinding 只在一個 Namespace 裡生效。ClusterRoleBinding 整個叢集生效。

門禁卡比喻。Role 是 3 樓研發部的門禁卡，ClusterRole 是所有樓層都能進的萬能卡。RoleBinding 就是把卡發給某個員工。企業絕對不會把萬能卡發給實習生。

ServiceAccount 這個觀念要特別講。SA 原本是給 Pod 跟 API Server 溝通用的身份，每個 Namespace 預設都有一個 default SA。但重點來了——SA 不只給 Pod 用，它也可以給真人工程師當身份。你把一個 SA 的 Token 包成 kubeconfig 發給新同事，他就能用 kubectl 連叢集，權限受你設的 Role 限制。這就是下一段 7-6 要做的事。

最後講企業真實設計。開發者在自己的 dev namespace 完整權限，在 prod 只讀。SRE 所有 namespace 完整權限。實習生 dev 只讀、prod 禁止。CI/CD 有部署權限、沒刪除權限。這樣就算有人手滑，損害限制在可控範圍。

好，概念結束。接下來進 7-6，我們實際做一次——給新同事 Alice 產一份 kubeconfig。[▶ 下一頁：Alice 情境]`,
  },

  // ── [3/12] 7-6（1/7）：情境開場 Alice 報到 ──
  {
    title: '情境：新同事 Alice 報到',
    subtitle: '目標：給她一份 kubeconfig，上班就能用',
    section: '7-6：RBAC 實戰',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">Alice 的需求</p>
          <ul className="text-slate-300 space-y-1 list-disc list-inside">
            <li>自己的 namespace <code className="text-amber-300">dev-alice</code> 練習部署</li>
            <li>不能碰 default / kube-system / production</li>
            <li>不能看 cluster 層級資源（node、pv）</li>
            <li>拿一份 kubeconfig 檔案，<code className="text-amber-300">export KUBECONFIG</code> 就能用</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-1">七步驟</p>
          <ol className="text-slate-300 space-y-0.5 list-decimal list-inside">
            <li>建 namespace + ServiceAccount</li>
            <li>建 Role + RoleBinding（YAML）</li>
            <li><code className="text-amber-300">--as</code> 快速驗 Role 生效</li>
            <li>抓 cluster 資訊（server + CA）</li>
            <li>產 Token</li>
            <li>組 kubeconfig</li>
            <li>切身份驗收</li>
          </ol>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-xs text-amber-300">
          做完這七步，Alice 今天就能上班。
        </div>
      </div>
    ),
    notes: `想像一個情境。公司來了新工程師 Alice，今天要給她權限。她要什麼？

第一，有自己的 namespace，叫 dev-alice，讓她練習部署東西。

第二，不能碰其他 namespace。default、kube-system、production 這些全部禁止。她只能在自己的沙盒裡玩。

第三，不能看 cluster 層級資源。node、pv 這些她都不需要看。

第四，拿一份 kubeconfig 檔案。她在自己電腦 export KUBECONFIG 就能用 kubectl，權限受我們設的 Role 限制。

整個流程七步驟。建 namespace 加 SA，建 Role 加 RoleBinding，用 --as 快速驗，抓 cluster 資訊，產 Token，組 kubeconfig，切身份驗收。

做完這七步，Alice 今天就能上班。我們一步一步來。[▶ Part 1：建 namespace + SA]`,
  },

  // ── [4/12] 7-6（2/7）：Part 1 建 namespace + SA ──
  {
    title: 'Part 1：建 namespace + ServiceAccount',
    subtitle: '身份字串 system:serviceaccount:<ns>:<sa>',
    section: '7-6：RBAC 實戰',
    duration: '1',
    content: (
      <div className="space-y-3 text-xs">
        <div className="bg-slate-800/50 p-3 rounded font-mono space-y-1">
          <p className="text-slate-500"># 建 namespace</p>
          <p className="text-green-300">kubectl create namespace dev-alice</p>
          <p className="text-slate-500 mt-1"># 建 ServiceAccount（建在自己的 ns）</p>
          <p className="text-green-300">kubectl create serviceaccount dev-alice -n dev-alice</p>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded">
          <p className="text-cyan-300 font-semibold mb-1">身份字串格式</p>
          <p className="font-mono text-amber-300">system:serviceaccount:&lt;ns&gt;:&lt;sa&gt;</p>
          <p className="text-slate-300 mt-1">Alice 的身份是：<code className="text-amber-300">system:serviceaccount:dev-alice:dev-alice</code></p>
          <p className="text-slate-400 mt-1 text-[10px]">記住這個格式 — 後面 --as 跟 subjects 都要用</p>
        </div>
      </div>
    ),
    notes: `Part 1 很簡單，兩個指令。

kubectl create namespace dev-alice，建一個新的 namespace。這是 Alice 的沙盒，接下來所有東西都建在這裡。

kubectl create serviceaccount dev-alice -n dev-alice，建一個 SA。這個 SA 就是 Alice 的身份。注意名字跟 namespace 同名是為了好記，實務上可以叫 alice-sa 之類的。

重點是身份字串的格式：system:serviceaccount 冒號 namespace 冒號 sa 名稱。Alice 的身份就是 system:serviceaccount:dev-alice:dev-alice。

這個格式要記住。等一下 --as 要用它，RoleBinding 的 subjects 也要用到類似的結構。很多學員卡在格式寫錯，會被 forbidden。[▶ Part 2：Role + RoleBinding YAML]`,
  },

  // ── [5/12] 7-6（3/7）：Part 2 Role + RoleBinding YAML ──
  {
    title: 'Part 2：Role + RoleBinding（YAML）',
    subtitle: '一個 YAML 檔兩個物件，用 --- 分隔',
    section: '7-6：RBAC 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-[11px]">
        <div className="bg-slate-900 p-2 rounded font-mono overflow-x-auto">
          <pre className="text-slate-300 whitespace-pre">{`apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer-role
  namespace: dev-alice
rules:
  - apiGroups: [""]              # ★ 空字串 = core（Pod/Service/ConfigMap/Secret）
    resources: ["pods", "services", "configmaps"]
    verbs: ["get", "list", "watch", "create", "update", "delete"]
  - apiGroups: ["apps"]          # ★ Deployment 屬於 apps group
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch", "create", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: alice-dev-binding
  namespace: dev-alice
subjects:
  - kind: ServiceAccount
    name: dev-alice
    namespace: dev-alice
roleRef:
  kind: Role
  name: developer-role
  apiGroup: rbac.authorization.k8s.io`}</pre>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">套用 + 檢查</p>
          <div className="font-mono space-y-0.5">
            <p className="text-green-300">kubectl apply -f rbac-alice.yaml</p>
            <p className="text-green-300">kubectl get role,rolebinding -n dev-alice</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">注意</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li><b>secrets 沒列</b> → Alice 看不到密碼（Default Deny）</li>
            <li><code className="text-amber-300">roleRef</code> 建好不能改，要改只能砍掉重建</li>
          </ul>
        </div>
      </div>
    ),
    notes: `Part 2 是 RBAC 的核心。一個 YAML 檔寫兩個物件，用三個減號分隔。

第一個物件 Role。apiVersion 是 rbac.authorization.k8s.io/v1，kind Role。重點在 rules 這個陣列。

第一條 rule：apiGroups 空字串。空字串代表 core API group，裡面包含 Pod、Service、ConfigMap、Secret 這些基礎資源。resources 列 pods、services、configmaps——注意 secrets 我故意沒寫。verbs 給完整 CRUD：get、list、watch、create、update、delete。

第二條 rule：apiGroups apps。Deployment 跟 ReplicaSet 屬於 apps 這個 group，不在 core 裡面，要另外寫一條。

第二個物件 RoleBinding。subjects 指定綁誰——kind ServiceAccount、name dev-alice、namespace dev-alice。roleRef 指定綁哪個 Role——kind Role、name developer-role、apiGroup rbac.authorization.k8s.io。這個 apiGroup 是固定寫法，不能改不能省。

兩個指令套用。kubectl apply -f rbac-alice.yaml 會看到兩行輸出，Role 跟 RoleBinding 都 created。kubectl get role,rolebinding -n dev-alice 確認兩個都在。

最重要的觀念再講一次：secrets 我沒列，所以 Alice 碰不到 secrets。這就是 Default Deny，沒寫就是沒權限。

還有一個雷：roleRef 一旦建好就不能改。你如果打錯 name，只能砍掉 RoleBinding 重建。[▶ Part 3：--as 快速驗]`,
  },

  // ── [6/12] 7-6（4/7）：Part 3 --as 快速驗 + auth can-i ──
  {
    title: 'Part 3：--as 快速驗 Role 生效',
    subtitle: 'auth can-i 只問不做，admin 快速確認',
    section: '7-6：RBAC 實戰',
    duration: '2',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-cyan-900/20 border border-cyan-500/40 p-2 rounded">
          <p className="text-cyan-300 font-semibold mb-1">為什麼用 auth can-i</p>
          <p className="text-slate-300"><code className="text-amber-300">--as</code> 真的執行動作（測 delete 會真的刪）；<code className="text-amber-300">auth can-i</code> 只問不做，只回 yes / no，安全。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-2 rounded">
          <p className="text-green-400 font-semibold mb-1">✓ 可以 get pods</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl auth can-i get pods \</p>
            <p className="text-green-300">  --as=system:serviceaccount:dev-alice:dev-alice \</p>
            <p className="text-green-300">  -n dev-alice</p>
            <p className="text-green-400 mt-1">yes</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-2 rounded">
          <p className="text-red-400 font-semibold mb-1">✗ 不能 get secrets</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl auth can-i get secrets \</p>
            <p className="text-green-300">  --as=system:serviceaccount:dev-alice:dev-alice \</p>
            <p className="text-green-300">  -n dev-alice</p>
            <p className="text-red-400 mt-1">no</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">列出所有權限（稽核神器）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl auth can-i --list \</p>
            <p className="text-green-300">  --as=system:serviceaccount:dev-alice:dev-alice \</p>
            <p className="text-green-300">  -n dev-alice</p>
          </div>
        </div>
      </div>
    ),
    notes: `Part 3 是中間的關鍵步驟。在產 kubeconfig 之前，先用 admin 身份模擬 Alice，確認 Role 設定是對的。

K8s 有兩個工具可以模擬身份。第一個 --as，第二個 auth can-i。差別是：--as 真的執行動作，所以你測 delete 的話會真的刪到東西；auth can-i 只問不做，只回 yes 或 no，安全得多。

我們這裡用 auth can-i。格式：kubectl auth can-i 加上動詞加上資源，後面帶 --as 指定身份，再加 -n 指定 namespace。

第一個測：can-i get pods。回 yes，代表 Role 有 get pods 的權限，設定對了。

第二個測：can-i get secrets。回 no。為什麼？因為我們 Role 沒列 secrets。Default Deny——沒寫就是沒權限。

第三個是稽核神器：can-i --list。它會列出這個身份能做的所有事，給你一張完整權限清單。企業稽核或 debug 權限問題的時候很好用。

這三個指令跑完，確認 Role 設對了，下一步才安心產 kubeconfig。[▶ Part 4：抓 cluster 資訊]`,
  },

  // ── [7/12] 7-6（5/7）：Part 4 抓 cluster 資訊（CA k3s 備援） ──
  {
    title: 'Part 4：抓 cluster 資訊',
    subtitle: 'server + CA 憑證，k3s 有備援',
    section: '7-6：RBAC 實戰',
    duration: '2',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded font-mono">
          <p className="text-slate-500"># server URL</p>
          <p className="text-green-300">CLUSTER_SERVER=$(kubectl config view --minify \</p>
          <p className="text-green-300">  -o jsonpath='{`{.clusters[0].cluster.server}`}')</p>
          <p className="text-slate-500 mt-1"># CA 憑證（base64 編碼）</p>
          <p className="text-green-300">CA_DATA=$(kubectl config view --minify --raw \</p>
          <p className="text-green-300">  -o jsonpath='{`{.clusters[0].cluster.certificate-authority-data}`}')</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">⚠️ k3s 備援</p>
          <p className="text-slate-300 mb-1">k3s 的 <code>certificate-authority-data</code> 有時抓出來是空的 — 從檔案讀：</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">if [ -z "$CA_DATA" ]; then</p>
            <p className="text-green-300">  CA_DATA=$(sudo cat \</p>
            <p className="text-green-300">    /var/lib/rancher/k3s/server/tls/server-ca.crt \</p>
            <p className="text-green-300">    | base64 -w 0)</p>
            <p className="text-green-300">fi</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">驗證（畫面不會有輸出，要自己 echo）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">echo "Server: $CLUSTER_SERVER"</p>
            <p className="text-green-300">echo "CA 長度: ${`{#CA_DATA}`}"</p>
          </div>
          <p className="text-slate-400 mt-1">預期：Server 是 https://127.0.0.1:6443，CA 長度 &gt; 1000</p>
        </div>
      </div>
    ),
    notes: `Part 4 抓 cluster 資訊。kubeconfig 需要兩樣東西：API Server 的 URL，跟 CA 憑證用來驗證 server 身份。

第一行：CLUSTER_SERVER 等於 kubectl config view --minify，後面加 jsonpath 抓 clusters 第一個的 server 欄位。

第二行：CA_DATA 等於一樣的指令，但抓 certificate-authority-data 這個欄位。certificate-authority-data 是 base64 編碼的 CA 憑證。

這兩行一打你會發現畫面什麼都沒有。這是正常的——它們只是把值存進 shell 變數。要確認有抓到，echo 出來看。CLUSTER_SERVER 應該是 https://127.0.0.1:6443，CA 長度應該大於 1000 字元。

k3s 有個雷要特別講。k3s 的 kubeconfig 有時候不是用 certificate-authority-data 這個欄位，而是用 certificate-authority 指向檔案路徑。這時候上面那行會抓到空字串。

備援方案：寫一段 if，如果 CA_DATA 是空的，就從 /var/lib/rancher/k3s/server/tls/server-ca.crt 這個檔案讀出來，轉成 base64。這個檔案路徑是 k3s 固定的位置。

跑完這一步，兩個變數都有值了，下一步產 Token。[▶ Part 5-6：Token + kubeconfig]`,
  },

  // ── [8/12] 7-6（6/7）：Part 5+6 產 Token + 組 kubeconfig ──
  {
    title: 'Part 5-6：產 Token + 組 kubeconfig',
    subtitle: 'create token 即席產生 + cat EOF 組檔案',
    section: '7-6：RBAC 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-[11px]">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Part 5：產 Token（1 年效期）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">TOKEN=$(kubectl create token dev-alice \</p>
            <p className="text-green-300">  -n dev-alice --duration=8760h)</p>
            <p className="text-green-300">echo "${`{TOKEN:0:40}`}..."</p>
          </div>
          <p className="text-slate-400 mt-1">K8s 1.24+ 不自動產 Token Secret，要用 create token</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Part 6：組 kubeconfig</p>
          <div className="bg-slate-900 p-2 rounded font-mono overflow-x-auto">
            <pre className="text-green-300 whitespace-pre">{`cat > alice-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: dev-alice
  user:
    token: $TOKEN
contexts:
- name: alice@k3s
  context:
    cluster: k3s
    user: dev-alice
    namespace: dev-alice
current-context: alice@k3s
EOF`}</pre>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">給外部使用者：換 127.0.0.1 成實際 IP</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">sed -i \</p>
            <p className="text-green-300">  's|https://127.0.0.1:6443|https://192.168.43.133:6443|' \</p>
            <p className="text-green-300">  alice-kubeconfig.yaml</p>
          </div>
        </div>
      </div>
    ),
    notes: `Part 5 產 Token。kubectl create token dev-alice -n dev-alice --duration=8760h。--duration 8760h 就是 365 天，一年。你可以改成 1h、24h 看需求。

講一個 K8s 1.24 的變化。以前你建 SA，K8s 會自動產一個 Secret 存 Token，你去撈那個 Secret 就好。1.24 之後預設不自動產了，所以我們用 kubectl create token 這個新指令即席產生。要永久用，要自己手動建一個 type 是 kubernetes.io/service-account-token 的 Secret。

Token 是一串很長的 JWT。echo 前 40 個字元看一下，確認有東西。

Part 6 組 kubeconfig。用 cat 加 heredoc 語法寫一個 YAML 檔。結構三個部分：clusters 裡放 server 跟 CA，users 裡放 user 名稱跟 token，contexts 把前兩者綁在一起，current-context 指定預設用哪個 context。

注意這裡 context 有個 namespace 欄位設 dev-alice。這是 Alice 的預設 namespace，她打 kubectl get pods 不加 -n 就會看 dev-alice，很方便。

最後一個雷：kubeconfig 裡的 server 預設是 https://127.0.0.1:6443，只有在 master 本機能連。Alice 要從自己電腦連，必須換成 master 對外 IP。用 sed -i 一行替換。這個步驟常忘記，對方拿到 kubeconfig 連不到伺服器就會來問你。[▶ Part 7：切身份驗收]`,
  },

  // ── [9/12] 7-6（7/7）：Part 7 切身份驗收 + 常見坑 ──
  {
    title: 'Part 7：切身份驗收 + 常見坑',
    subtitle: 'export KUBECONFIG 切成 Alice，測四種情境',
    section: '7-6：RBAC 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded font-mono">
          <p className="text-slate-500"># 切成 Alice</p>
          <p className="text-green-300">export KUBECONFIG=$PWD/alice-kubeconfig.yaml</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-900/30 border border-green-500/50 p-2 rounded">
            <p className="text-green-400 font-semibold mb-1">✓ 自己 ns 完整權限</p>
            <div className="font-mono text-green-300 space-y-0.5">
              <p>kubectl get pods</p>
              <p>kubectl run mypod --image=nginx</p>
              <p>kubectl get pods</p>
            </div>
          </div>

          <div className="bg-red-900/30 border border-red-500/50 p-2 rounded">
            <p className="text-red-400 font-semibold mb-1">✗ 其他 ns 被擋</p>
            <div className="font-mono text-green-300 space-y-0.5">
              <p>kubectl get pods -n default</p>
              <p>kubectl get pods -n kube-system</p>
            </div>
            <p className="text-red-400 mt-1 text-[10px]">Forbidden</p>
          </div>

          <div className="bg-red-900/30 border border-red-500/50 p-2 rounded">
            <p className="text-red-400 font-semibold mb-1">✗ 不能讀 Secret</p>
            <div className="font-mono text-green-300">kubectl get secret</div>
            <p className="text-red-400 mt-1 text-[10px]">Forbidden</p>
          </div>

          <div className="bg-red-900/30 border border-red-500/50 p-2 rounded">
            <p className="text-red-400 font-semibold mb-1">✗ cluster 層級擋</p>
            <div className="font-mono text-green-300 space-y-0.5">
              <p>kubectl get nodes</p>
              <p>kubectl get ns</p>
            </div>
            <p className="text-red-400 mt-1 text-[10px]">Forbidden</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded font-mono">
          <p className="text-slate-500"># 切回 admin</p>
          <p className="text-green-300">unset KUBECONFIG</p>
          <p className="text-green-300">kubectl get nodes  <span className="text-slate-500"># ✓ 全權</span></p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">常見坑</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside text-[11px]">
            <li>--as 格式不對 → 要寫 <code>system:serviceaccount:&lt;ns&gt;:&lt;sa&gt;</code></li>
            <li>Role / SA / RoleBinding 不同 ns → 三者 namespace 要一致</li>
            <li>k3s CA_DATA 空的 → 用 if 備援從檔案讀</li>
            <li>給 Alice 的 kubeconfig 忘記換 IP → 對方連不到</li>
          </ul>
        </div>
      </div>
    ),
    notes: `Part 7 是驗收，也是最爽的一步。前面六步全部為了這一刻。

export KUBECONFIG 指向我們剛才組的 alice-kubeconfig.yaml，後面所有 kubectl 指令都會用 Alice 的身份。

四個情境要測。

第一，自己 ns 完整權限。kubectl get pods，空列表——對，因為 ns 是新的還沒東西。kubectl run mypod --image=nginx，成功！Pod 跑起來了。kubectl get pods，看到 mypod 了。

第二，其他 ns 被擋。kubectl get pods -n default、kubectl get pods -n kube-system，都回 Forbidden。Alice 進不去別人的 ns。

第三，不能讀 Secret。kubectl get secret，回 Forbidden。因為 Role 沒列 secrets。

第四，cluster 層級擋。kubectl get nodes、kubectl get ns，都 Forbidden。因為這些是 cluster 範圍的資源，Role 只能管 namespace 內的，管不到 cluster 層級。

最後 unset KUBECONFIG，切回 admin 身份。kubectl get nodes 可以了，全權回來。

四個常見坑快速講。--as 格式要完整寫 system:serviceaccount:ns:sa，少一段就 forbidden。Role、SA、RoleBinding 三個物件的 namespace 要一致。k3s 的 CA_DATA 常常是空的，用 if 備援從檔案讀。給別人的 kubeconfig 別忘了把 127.0.0.1 換成實際 IP。

好，7-6 結束。你們看到了從零到可交付 kubeconfig 的完整流程。接下來 7-7 換你們自己做。[▶ 7-7：學員實作]`,
  },

  // ── [10/12] 7-7（1/3）：學員實作題目 ──
  {
    title: '7-7 學員實作：建 backend-dev',
    subtitle: '照 Alice 的流程，做 backend 團隊的帳號',
    section: '7-7：學員實作',
    duration: '2',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/40 border-l-4 border-green-500 p-2 rounded">
          <p className="text-green-300 font-semibold mb-1">🎯 情境</p>
          <p className="text-slate-300">backend 團隊新人要一個受限帳號 <code className="text-amber-300">backend-dev</code>，只能看不能改。</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">必做題要求</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>namespace: <code className="text-amber-300">backend-team</code></li>
            <li>SA: <code className="text-amber-300">backend-dev</code></li>
            <li>權限：
              <ul className="list-disc list-inside ml-4">
                <li>✓ get / list / watch pods + services + configmaps + deployments</li>
                <li>✗ 不能碰 secrets</li>
                <li>✗ 不能 delete / create / update（只讀）</li>
              </ul>
            </li>
            <li>產 <code className="text-amber-300">backend-kubeconfig.yaml</code></li>
            <li><code className="text-amber-300">export KUBECONFIG</code> 切身份驗證</li>
          </ul>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-2 rounded">
          <p className="text-green-300 font-semibold mb-1">驗收條件</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>✓ <code>kubectl get pods</code> 有結果（空也算）</li>
            <li>✗ <code>kubectl get secret</code> → Forbidden</li>
            <li>✗ <code>kubectl delete pod xxx</code> → Forbidden</li>
            <li>✗ <code>kubectl get pods -n default</code> → Forbidden</li>
          </ul>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-amber-300">
          🏆 挑戰題：加一個 <code>sre-user</code> 用 ClusterRoleBinding 綁 cluster-admin，感受兩端差異。
        </div>
      </div>
    ),
    notes: `好，換你們做。情境跟 Alice 類似，但這次你自己做一遍 backend-dev。

必做題要求四件事。第一，namespace backend-team。第二，SA 叫 backend-dev。第三，權限——能 get、list、watch pods、services、configmaps、deployments，不能碰 secrets，不能 delete、create、update，只能看。這跟 Alice 的權限設計不同，Alice 有完整 CRUD，backend-dev 只給讀。第四，產 backend-kubeconfig.yaml，export KUBECONFIG 自己切身份驗。

驗收四條。kubectl get pods 有結果、get secret 被擋、delete pod 被擋、跨 ns 被擋。四條全綠才算過。

挑戰題給行有餘力的。加一個 sre-user，用 ClusterRole 跟 ClusterRoleBinding 綁 cluster-admin，讓他整個 cluster 全權。跟 backend-dev 的只讀做對比，你會很有感——同一套 RBAC 機制可以做出天差地遠的權限。

下一頁給你們完整指令清單，照著打就能跑完。[▶ 下一頁：完整指令卡]`,
  },

  // ── [11/12] 7-7（2/3）：學員完整指令卡 ──
  {
    title: '7-7 學員完整指令卡',
    subtitle: '照著打，從建立到驗收到清理',
    section: '7-7：學員實作',
    duration: '8',
    content: (
      <div className="space-y-1 text-[10px]">
        <div className="bg-slate-900 p-2 rounded font-mono overflow-x-auto">
          <pre className="text-slate-300 whitespace-pre">{`# ─── Part 1：建 namespace + SA ───
kubectl create namespace backend-team
kubectl create serviceaccount backend-dev -n backend-team

# ─── Part 2：建 Role + RoleBinding ───
cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: backend-dev-role
  namespace: backend-team
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: backend-dev-binding
  namespace: backend-team
subjects:
  - kind: ServiceAccount
    name: backend-dev
    namespace: backend-team
roleRef:
  kind: Role
  name: backend-dev-role
  apiGroup: rbac.authorization.k8s.io
EOF
kubectl get sa,role,rolebinding -n backend-team

# ─── Part 3：--as 快速驗 ───
kubectl auth can-i get pods --as=system:serviceaccount:backend-team:backend-dev -n backend-team
kubectl auth can-i get secrets --as=system:serviceaccount:backend-team:backend-dev -n backend-team

# ─── Part 4：抓 cluster 資訊 ───
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CA_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')
if [ -z "$CA_DATA" ]; then
  CA_DATA=$(sudo cat /var/lib/rancher/k3s/server/tls/server-ca.crt | base64 -w 0)
fi

# ─── Part 5：產 Token ───
TOKEN=$(kubectl create token backend-dev -n backend-team --duration=8760h)

# ─── Part 6：組 kubeconfig ───
cat > backend-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: backend-dev
  user:
    token: $TOKEN
contexts:
- name: backend-dev@k3s
  context:
    cluster: k3s
    user: backend-dev
    namespace: backend-team
current-context: backend-dev@k3s
EOF
sed -i 's|https://127.0.0.1:6443|https://192.168.43.133:6443|' backend-kubeconfig.yaml

# ─── Part 7：切身份驗收 ───
export KUBECONFIG=$PWD/backend-kubeconfig.yaml
kubectl get pods                    # ✓ 空列表
kubectl get secret                  # ✗ Forbidden
kubectl delete pod any-name         # ✗ Forbidden
kubectl get pods -n default         # ✗ Forbidden
unset KUBECONFIG

# ─── Part 8：清理 ───
kubectl delete namespace backend-team
rm backend-kubeconfig.yaml`}</pre>
        </div>
      </div>
    ),
    notes: `這一頁就是照著打的完整指令清單，八個 Part。

Part 1 建 namespace 加 SA，兩個指令。

Part 2 建 Role 跟 RoleBinding。用 cat heredoc 語法把 YAML 直接 apply 進去，不用存成檔案。注意 verbs 只給 get、list、watch，沒有 create、update、delete。這跟 Alice 的設計不同，backend-dev 只能看。

Part 3 用 auth can-i 快速驗。can-i get pods 應該回 yes，can-i get secrets 應該回 no。兩個都對了再往下。

Part 4 抓 cluster 資訊。記得 k3s 備援的 if 要加進去，不然 CA_DATA 可能是空的。

Part 5 產 Token，8760h 一年。

Part 6 組 kubeconfig。注意 context 裡 namespace 設 backend-team，這樣 backend-dev 打 kubectl get pods 預設就看 backend-team。sed 那行把 127.0.0.1 換成實際 Node IP，192.168.43.133 那邊你要換成你自己機器的 IP。

Part 7 切身份驗收。四個測試：get pods 空列表、get secret 被擋、delete pod 被擋、跨 ns 被擋。四條全綠才算過。最後 unset KUBECONFIG 切回 admin。

Part 8 清理。kubectl delete namespace backend-team 會把裡面的 SA、Role、RoleBinding 全部連帶刪掉。rm 把 kubeconfig 檔案也刪掉。

給你們 15 分鐘做。有問題舉手。[▶ 下一頁：Loop 2 收斂]`,
  },

  // ── [12/12] 7-7（3/3）：Loop 2 因果鏈 + 承接 Loop 3 ──
  {
    title: 'Loop 2 收斂 — 從管「服務」到管「人」',
    subtitle: 'RBAC 把權限分明 → 炸也只炸自己的',
    section: '7-7：Loop 2 總結',
    duration: '1',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">Loop 2 因果鏈</p>
          <div className="space-y-1 text-slate-300">
            <p>1. <b className="text-red-400">誰都能刪</b> → 實習生一個指令毀掉 production</p>
            <p>2. <b className="text-amber-300">RBAC 最小權限</b> → 誰能看、誰能改、誰能刪，分明清楚</p>
            <p>3. <b className="text-cyan-300">ServiceAccount 不只給 Pod</b> → 包成 kubeconfig 發給真人</p>
            <p>4. <b className="text-green-400">每人一個 namespace sandbox</b> → 炸也只炸自己的</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">今天學到的實戰技能</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>寫 Role / RoleBinding YAML</li>
            <li>用 <code className="text-amber-300">--as</code> / <code className="text-amber-300">auth can-i</code> 驗權限</li>
            <li>產 Token + 組 kubeconfig</li>
            <li>把 SA 包成給真人用的身份</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">清理（Loop 2 結束）</p>
          <div className="font-mono text-green-300 space-y-0.5">
            <p>kubectl delete namespace dev-alice</p>
            <p>kubectl delete namespace backend-team</p>
            <p>rm -f alice-kubeconfig.yaml backend-kubeconfig.yaml</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/40 p-3 rounded text-xs">
          <p className="text-cyan-300 font-semibold mb-1">承接 Loop 3</p>
          <p className="text-slate-300">權限搞定了，但服務本身健康嗎？下一段 Probe 健康檢查——<b className="text-amber-300">Running 不代表服務正常</b>。</p>
        </div>
      </div>
    ),
    notes: `Loop 2 結束，一句話收一下因果鏈。

第一層：誰都能刪。實習生一個指令毀掉 production 的那個故事。

第二層：RBAC 最小權限。我們用 Role 定義「能做什麼」，用 RoleBinding 把 Role 綁到 SA 身上。誰能看、誰能改、誰能刪，分明清楚。

第三層：ServiceAccount 不只給 Pod。這個觀念很多人一開始會卡住——SA 我以為只是給 Pod 用的？不是，SA 是一個身份，Pod 可以用，真人也可以用。包成 kubeconfig 發出去就能用。

第四層：每人一個 namespace sandbox。Alice 有 dev-alice，backend-dev 有 backend-team。彼此隔離，炸也只炸自己的。

今天學到的四個實戰技能：寫 Role YAML、用 --as 跟 auth can-i 驗權限、產 Token 組 kubeconfig、把 SA 包成給真人用的身份。這四個加起來你就能當新同事的 onboarding 人員了。

但我們還沒講完生產就緒。權限搞定了，但服務本身健康嗎？Loop 3 我們進 Probe 健康檢查。Running 不代表服務正常——這個觀念會顛覆你對 kubectl get pods 的信任。[▶ Loop 3：Probe]`,
  },


  // ============================================================
  // Loop 3：Probe 健康檢查（對應 public/docs/day7-loop3-probe.md）
  // 7-2 概念（2 張） + 7-3 實戰（5 張） + 7-4 學員實作（2 張）= 9 張
  // ============================================================

  // ── [1/9] 7-2 概念（1/2）：Running 在騙你 ──
  {
    title: 'Running ≠ 可用',
    subtitle: 'kubectl get pods 顯示 Running，不代表服務正常',
    section: '7-2：Probe 概念',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded text-xs">
          <p className="text-red-400 font-semibold mb-1">Running 只代表一件事</p>
          <p className="text-slate-300">容器裡的主行程還活著。process 還在 → K8s 就說你 Running。但「活著」不等於「能服務」。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">三種「Running 但壞掉」的真實場景</p>
          <ul className="text-slate-300 space-y-1 list-disc list-inside">
            <li><b className="text-amber-300">Java GC 死迴圈</b>：process 沒 crash，CPU 100%，request 永遠不回應</li>
            <li><b className="text-amber-300">連線池滿了</b>：process 還活著，回 500 錯誤</li>
            <li><b className="text-amber-300">Spring Boot 啟動 30 秒</b>：Pod Running，但 app 在 load config，打進去全 503</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">沒有 Probe 的後果</p>
          <p className="text-slate-300">K8s <b>永遠不會發現</b>服務壞了，要等客服接到客訴、工程師被叫起床、手動 <code className="text-green-300">kubectl delete pod</code> 才救得了。</p>
        </div>
      </div>
    ),
    notes: `進 Loop 3。從第四堂到現在，你怎麼確認服務正常？大部分人打 kubectl get pods，看到 STATUS Running 就覺得沒事了。今天我要跟你們說一件殘酷的事——Running 這個狀態在騙你。

Running 只代表一件事：容器裡面的主行程還在跑。process 活著，K8s 就認為你 Running。但活著不等於能服務。

舉三個真實場景。場景一，Java app 進入 GC 死迴圈。process 沒 crash、記憶體還在、CPU 飆到 100%，但所有進來的 request 都不回應。kubectl get pods 看？Running。

場景二，連線池滿了。你的 API 活著，但所有 request 回 500。K8s 看？Running。

場景三，Spring Boot 啟動要 30 秒。容器起來了 K8s 標 Running，但 app 還在 load config、連 DB、暖 cache。這 30 秒的流量全 503。K8s 看？Running。

這三種，K8s 永遠不會自己發現，除非你設 Probe。沒 Probe 的狀況是什麼？是凌晨三點客服接到客訴，打給你，你被叫起床 kubectl delete pod 手動救。我想你們應該都不想這樣。

Probe 就是 K8s 的自動值班工程師。下一頁我給你們看三種 Probe 各自解什麼問題。[▶ 下一頁：三種 Probe]`,
  },

  // ── [2/9] 7-2 概念（2/2）：三種 Probe 對比表 ──
  {
    title: '三種 Probe 一張表看懂',
    subtitle: 'Liveness / Readiness / Startup 各司其職',
    section: '7-2：Probe 概念',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <table className="w-full text-left">
            <thead>
              <tr className="text-cyan-400 border-b border-slate-700">
                <th className="py-1"></th>
                <th className="py-1">Liveness</th>
                <th className="py-1">Readiness</th>
                <th className="py-1">Startup</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-1 text-amber-300 font-semibold">問題</td>
                <td className="py-1">你還活著嗎？</td>
                <td className="py-1">能接流量嗎？</td>
                <td className="py-1">啟動完了嗎？</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-1 text-amber-300 font-semibold">失敗後果</td>
                <td className="py-1 text-red-400">Kill + Restart</td>
                <td className="py-1 text-yellow-400">從 endpoints 拔掉</td>
                <td className="py-1 text-cyan-400">暫停 L/R 檢查</td>
              </tr>
              <tr>
                <td className="py-1 text-amber-300 font-semibold">用途</td>
                <td className="py-1">救活死掉 app</td>
                <td className="py-1">避免流量打壞 pod</td>
                <td className="py-1">保護慢啟動 app</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">白話版</p>
          <ul className="text-slate-300 space-y-0.5">
            <li><b className="text-red-400">Liveness</b>：「你再不回我我就殺了你。」→ 暴力，換一個</li>
            <li><b className="text-yellow-400">Readiness</b>：「你還沒好？那我暫時不給你工作。」→ 溫柔，等它好</li>
            <li><b className="text-cyan-400">Startup</b>：「啟動中請勿打擾。」→ 保護傘，啟動完就關閉</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">三種檢查方式</p>
          <ul className="text-slate-300 space-y-0.5">
            <li><code className="text-green-300">httpGet</code>：打 URL，2xx/3xx 算過（Web API 最常用）</li>
            <li><code className="text-green-300">tcpSocket</code>：連 port 算過（DB、Redis）</li>
            <li><code className="text-green-300">exec</code>：執行指令 exit 0 算過（自訂邏輯）</li>
          </ul>
        </div>

        <div className="bg-slate-900/70 border border-slate-600 p-2 rounded text-[11px]">
          <span className="text-slate-400">vs Docker HEALTHCHECK：</span>
          <span className="text-slate-300">Docker 只有一種、只標記 unhealthy；K8s 三種各自負責重啟或切流量。</span>
        </div>
      </div>
    ),
    notes: `K8s 用三種 Probe 解決 Running 不等於可用的問題。一張表看懂。

Liveness 問「你還活著嗎」。失敗就 kill 重啟。用來救活死掉但沒 crash 的 app。就像 GC 死迴圈那個例子——process 活著但沒回應，Liveness 打不通就殺掉重建。白話：你再不回我我就殺了你。暴力，但有效。

Readiness 問「能接流量嗎」。失敗不會殺 pod，而是把 pod 從 Service endpoints 拔掉，流量改導去別的健康 pod。等它恢復了再加回來。用在暫時過載、連線池滿、暖機中這些會自己好的狀況。白話：你還沒好？那我暫時不給你工作。溫柔，等它好。

Startup 問「啟動完了嗎」。專門給啟動特別慢的 app 用。啟動期間 Liveness 跟 Readiness 不會跑，避免還沒啟動完就被誤殺。Startup 通過一次後就永久關閉，交棒給另外兩個。白話：啟動中請勿打擾。保護傘。

Kill 重啟、拔流量、啟動保護——這三個後果你記住就好。至於怎麼檢查，三種方式。httpGet 打 URL 回 2xx/3xx 算過，Web API 最常用，我們待會 demo 就用這個。tcpSocket 只連 port，連上就算過，適合 DB、Redis。exec 執行指令 exit 0 算過，自訂檢查邏輯。

Docker 有個 HEALTHCHECK 聽起來功能一樣，差別是 Docker 只標記 unhealthy 給你看，不會幫你重啟也不會切流量。K8s 三種 Probe 各司其職，這是 K8s 強的地方。

概念講完，進實戰。我設計了五個 demo，兩兩對照，讓你親眼看到加跟沒加的差別。[▶ Demo 1a：沒 Probe 的慘狀]`,
  },

  // ── [3/9] 7-3 實戰（1/5）：Demo 1a 沒 Probe 的慘狀 ──
  {
    title: 'Demo 1a：沒 Probe → Running 在騙你',
    subtitle: '證明沒 Probe 時，K8s 完全不知道服務壞了',
    section: '7-3：Probe 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">nginx-no-probe.yaml（最簡 Deployment，無 Probe）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre">{`spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports: [{containerPort: 80}]
  # 沒有 livenessProbe
  # 沒有 readinessProbe`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">部署 + 破壞（rm index.html）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl apply -f nginx-no-probe.yaml</p>
            <p className="text-green-300">POD1=$(kubectl get pods -l app=nginx-no-probe \</p>
            <p className="text-green-300">  -o jsonpath='{`{.items[0].metadata.name}`}')</p>
            <p className="text-green-300">kubectl exec $POD1 -- rm /usr/share/nginx/html/index.html</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">觀察（重點看這裡）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get pods -l app=nginx-no-probe</p>
            <p className="text-slate-400">  <span className="text-red-400">→ Running，RESTARTS: 0（K8s 以為沒事）</span></p>
            <p className="text-green-300 mt-1">kubectl exec $POD1 -- \</p>
            <p className="text-green-300">  curl -s -o /dev/null -w "%{`{http_code}`}\\n" localhost</p>
            <p className="text-slate-400">  <span className="text-red-400">→ 403（實際壞了，但沒人救）</span></p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-2 rounded text-[11px]">
          <b className="text-red-400">結論：</b>Running 在騙你。沒 Probe = K8s 瞎子。
        </div>
      </div>
    ),
    notes: `Demo 1a，對照組。我們先看沒 Probe 是什麼慘狀，等一下加 Probe 就能看出差別。

nginx-no-probe.yaml 最簡單的 Deployment，一個 nginx 容器，什麼 Probe 都沒設。kubectl apply 部署。

抓 pod 名字存到 POD1 變數，用 jsonpath 取 items[0] 第一個。接下來破壞——kubectl exec 進容器 rm 掉 /usr/share/nginx/html/index.html，nginx 的首頁檔案。

為什麼 rm index.html 可以觸發？因為 nginx 預設打 / 會回這個檔案，檔案不在就回 403 Forbidden。403 在 200-399 範圍外，Probe 會算失敗。

現在觀察。kubectl get pods 看，STATUS 還是 Running、RESTARTS 還是 0。K8s 以為這個 pod 好好的。

但 kubectl exec 進去 curl localhost，回 403。服務實際上壞了，但 K8s 不知道。這就是沒 Probe 的慘狀——K8s 是瞎子，Running 在騙你。

如果這是 production，客服會接到客訴、工程師會被叫起床、要人進去手動 delete pod 才救得了。沒人救它。

這頁要記住一句話：Running 在騙你，沒 Probe 等於 K8s 瞎子。下一頁加上 Liveness，看會發生什麼變化。[▶ Demo 1b：加 Liveness]`,
  },

  // ── [4/9] 7-3 實戰（2/5）：Demo 1b 加 Liveness 自動救援 ──
  {
    title: 'Demo 1b：加 Liveness → 自動救援',
    subtitle: '同樣 rm index.html，K8s 自動重啟容器',
    section: '7-3：Probe 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">nginx-liveness.yaml（加 livenessProbe）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre">{`livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5      # 啟動後等 5 秒再檢查
  periodSeconds: 10           # 每 10 秒戳一次
  failureThreshold: 3         # 連續失敗 3 次才判定
  timeoutSeconds: 1           # 1 秒沒回應算超時`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">部署 + 同樣的破壞</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl apply -f nginx-liveness.yaml</p>
            <p className="text-green-300">POD2=$(kubectl get pods -l app=nginx-liveness \</p>
            <p className="text-green-300">  -o jsonpath='{`{.items[0].metadata.name}`}')</p>
            <p className="text-green-300">kubectl exec $POD2 -- rm /usr/share/nginx/html/index.html</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">觀察重啟（約 30 秒內）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get pods -l app=nginx-liveness -w</p>
            <p className="text-slate-400">  <span className="text-green-400">→ RESTARTS: 0 → 1（K8s 自動救了！）</span></p>
            <p className="text-green-300 mt-1">kubectl describe pod $POD2</p>
            <p className="text-slate-400">  <span className="text-amber-300">→ Events: Liveness probe failed: 403</span></p>
            <p className="text-slate-400">  <span className="text-amber-300">→ Events: will be restarted</span></p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-2 rounded text-[11px]">
          <b className="text-green-400">結論：</b>同樣的破壞，沒 Probe 壞到底；有 Liveness → 30 秒自動救活。
        </div>
      </div>
    ),
    notes: `Demo 1b，關鍵對照。同樣一個 nginx、同樣 rm index.html，這次加上 livenessProbe，看會發生什麼。

YAML 加了 livenessProbe 區塊。四個參數解釋一下。

initialDelaySeconds 5，容器啟動後先等 5 秒再開始檢查。給程式初始化緩衝，不然還沒起來就被 probe 打到算失敗很冤。

periodSeconds 10，每 10 秒戳一次。不要太頻繁，浪費資源。

failureThreshold 3，連續失敗 3 次才判定不健康。不是一次就炸，可能只是網路抖一下，給三次容錯空間。

timeoutSeconds 1，每次打最多等 1 秒，超時算失敗。

所以觸發重啟要多久？10 秒乘 3 次等於 30 秒。

apply 部署、抓 POD2 名字、exec 進去 rm index.html。跟上一頁一模一樣的破壞。

現在關鍵：kubectl get pods -w，watch 模式看。30 秒內你會看到 RESTARTS 欄位從 0 變 1。K8s 自己偵測到 probe 失敗、自己 kill 容器、自己重啟。重啟後 nginx 重新 init，index.html 檔案回來了，probe 通過。服務自動復活。

kubectl describe pod 看 Events 區塊，會看到 Liveness probe failed statuscode 403、will be restarted、Started container 這些記錄。完整的救援軌跡。

同樣的破壞，沒 Probe 壞到底、要人救；有 Liveness 30 秒自動救活、完全不用人。這就是 Liveness 的價值——K8s 的自動值班工程師。

但 Liveness 有個問題：從破壞到被殺中間這 30 秒，流量還是會打進壞 pod。下一頁我們看 Readiness 怎麼解。[▶ Demo 2a：沒 Readiness]`,
  },

  // ── [5/9] 7-3 實戰（3/5）：Demo 2a 沒 Readiness 流量打到壞 pod ──
  {
    title: 'Demo 2a：沒 Readiness → 1/3 流量看 403',
    subtitle: '只有 Liveness 不夠，那 30 秒內流量還在打壞 pod',
    section: '7-3：Probe 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-[11px]">
          <b className="text-amber-300">問題：</b>Liveness 從破壞到殺掉要 30 秒，這段時間流量照樣打進壞 pod → 使用者看到 403
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">nginx-liveness-only.yaml（3 replicas + Service，只有 Liveness）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre">{`spec:
  replicas: 3       # 3 個 pod 共同接流量
  # livenessProbe: ...（只有這個）
  # 沒有 readinessProbe

---
kind: Service
metadata:
  name: nginx-liv-svc`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">部署 + 破壞一個 pod</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl apply -f nginx-liveness-only.yaml</p>
            <p className="text-green-300">POD3=$(kubectl get pods -l app=nginx-liv-only \</p>
            <p className="text-green-300">  -o jsonpath='{`{.items[0].metadata.name}`}')</p>
            <p className="text-green-300">kubectl exec $POD3 -- rm /usr/share/nginx/html/index.html</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">觀察流量：3 個 IP 都還在，使用者 1/3 機率中獎</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get endpoints nginx-liv-svc</p>
            <p className="text-slate-400">  <span className="text-red-400">→ 3 個 IP 都還在（沒拔壞 pod）</span></p>
            <p className="text-green-300 mt-1">kubectl run curl-test --image=curlimages/curl \</p>
            <p className="text-green-300">  --rm -it --restart=Never \</p>
            <p className="text-green-300">  -- sh -c "for i in \\$(seq 1 9); do \</p>
            <p className="text-green-300">    curl -s -o /dev/null -w '%{`{http_code}`}\\n' \</p>
            <p className="text-green-300">    nginx-liv-svc; done"</p>
            <p className="text-slate-400">  <span className="text-red-400">→ 200, 200, 403, 200, 403, 200, ...（1/3 機率）</span></p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-2 rounded text-[11px]">
          <b className="text-red-400">結論：</b>只設 Liveness，從破壞到被殺的 30 秒，使用者有 1/3 流量看 403。需要 Readiness 補刀。
        </div>
      </div>
    ),
    notes: `Demo 2a，第二組對照組。Liveness 很好用，但它有個問題——從破壞到被殺中間有 30 秒空窗，這段時間流量照樣打進壞 pod。使用者會看到錯誤。我們實測一下。

這次 replicas 開 3，配一個 ClusterIP Service。3 個 pod 共同接流量，壞其中一個。

apply 部署、抓 POD3、破壞它——跟前面一樣的 rm。

現在觀察兩件事。第一，kubectl get endpoints，還是 3 個 IP。因為沒設 Readiness，K8s 不知道要把壞 pod 從 endpoints 拔掉。第二，我們狂 curl 打 service 9 次。

這裡用 kubectl run 跑一個暫時的 curl 容器，for 迴圈打 9 次、每次只印 HTTP status code、換行。--rm 跑完自動刪。

結果會看到 200 跟 403 交錯出現，大概 1/3 機率看到 403。因為 Service 輪流把流量導給 3 個 pod，中獎到壞 pod 就 403。

這就是只設 Liveness 的盲點——K8s 會自動救，但救之前的那 30 秒，使用者還是看到錯誤。

要讓使用者完全無感，我們還需要 Readiness 把壞 pod 從流量中隔離。下一頁加上它。[▶ Demo 2b：加 Readiness]`,
  },

  // ── [6/9] 7-3 實戰（4/5）：Demo 2b 加 Readiness 拔流量無感 ──
  {
    title: 'Demo 2b：加 Readiness → 拔流量，使用者無感',
    subtitle: '同樣 rm html，流量自動避開壞 pod',
    section: '7-3：Probe 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">nginx-readiness.yaml（Liveness + Readiness 都設）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre">{`livenessProbe:
  httpGet: {path: /, port: 80}
  periodSeconds: 10
  failureThreshold: 3      # 30 秒才殺
readinessProbe:
  httpGet: {path: /, port: 80}
  periodSeconds: 5         # 比 Liveness 頻繁
  failureThreshold: 2      # 10 秒就拔流量`}</pre>
          </div>
          <p className="text-slate-400 mt-1 text-[10px]">★ Readiness periodSeconds 比 Liveness 短 → 先拔流量再殺</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">部署 + 同樣的破壞（等 15 秒看 Readiness 反應）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl apply -f nginx-readiness.yaml</p>
            <p className="text-green-300">POD4=$(kubectl get pods -l app=nginx-readiness \</p>
            <p className="text-green-300">  -o jsonpath='{`{.items[0].metadata.name}`}')</p>
            <p className="text-green-300">kubectl exec $POD4 -- rm /usr/share/nginx/html/index.html</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">觀察：endpoints 少一個 IP，但 pod 還活著</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get endpoints nginx-rdy-svc</p>
            <p className="text-slate-400">  <span className="text-green-400">→ 3 → 2（壞 pod 被拔了）</span></p>
            <p className="text-green-300 mt-1">kubectl get pods -l app=nginx-readiness</p>
            <p className="text-slate-400">  <span className="text-yellow-400">→ Running，READY 0/1，RESTARTS 0（沒被殺！）</span></p>
            <p className="text-green-300 mt-1">kubectl run curl-test --image=curlimages/curl \</p>
            <p className="text-green-300">  --rm -it --restart=Never \</p>
            <p className="text-green-300">  -- sh -c "for i in \\$(seq 1 9); do \</p>
            <p className="text-green-300">    curl -s -o /dev/null -w '%{`{http_code}`}\\n' \</p>
            <p className="text-green-300">    nginx-rdy-svc; done"</p>
            <p className="text-slate-400">  <span className="text-green-400">→ 200, 200, 200, 200, 200, 200, 200, 200, 200（全綠！）</span></p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/40 p-2 rounded text-[11px]">
          <b className="text-green-400">結論：</b>同一招 rm html，沒 Readiness 1/3 流量看 403；有 Readiness → 使用者完全無感。
        </div>
      </div>
    ),
    notes: `Demo 2b，高潮。同樣的破壞、同樣的 rm，這次加 Readiness，看使用者體驗會變怎樣。

YAML Liveness 跟 Readiness 都設。注意一個細節——Readiness 的 periodSeconds 比 Liveness 短。Liveness 10 秒乘 3 次等於 30 秒才殺，Readiness 5 秒乘 2 次等於 10 秒就拔流量。這個設計是故意的：讓 Readiness 先反應、先拔流量，流量已經導開後 Liveness 再慢慢殺。使用者感受就是無縫切換。

apply 部署、抓 POD4、rm 破壞。跟前面完全一樣的動作。

現在觀察。第一，kubectl get endpoints，你會看到從 3 個 IP 變成 2 個。壞 pod 的 IP 被拔了。流量已經不會導給它。第二，kubectl get pods，壞 pod 的 STATUS 還是 Running、RESTARTS 還是 0，但 READY 欄位變成 0/1。這個很重要——Readiness 失敗不會殺 pod，它只控制流量方向。

第三，狂 curl service 9 次。結果全部是 200、完全沒看到 403。使用者完全感覺不到有 pod 壞掉。

再等一下下，30 秒到了 Liveness 也會觸發重啟。重啟完 Readiness 先通過，pod 重新加回 endpoints、開始接流量。整個過程使用者完全無感、沒看到任何錯誤。

同一招 rm html，兩種 probe 兩種後果。沒 Readiness 使用者 1/3 流量中獎、有 Readiness 使用者無感。這就是 Readiness 的價值——它是 K8s 的交通警察，只管流量方向，不殺人。

Liveness 跟 Readiness 分工合作：Liveness 殺掉重建、Readiness 拔流量不殺。production 部署一定要兩個都設。下一頁講 Startup。[▶ Startup 延伸]`,
  },

  // ── [7/9] 7-3 實戰（5/5）：Startup 延伸講解 ──
  {
    title: 'Startup Probe：慢啟動 app 的保護傘',
    subtitle: '啟動期的 Liveness 盲區，用 Startup 補',
    section: '7-3：Probe 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-red-900/20 border border-red-500/40 p-2 rounded">
          <p className="text-red-400 font-semibold mb-1">情境：Legacy Java app 啟動要 2 分鐘</p>
          <p className="text-slate-300">Liveness 設 <code className="text-amber-300">initialDelaySeconds: 30</code>？30 秒後 Liveness 打進去失敗 → kill → restart → 又 2 分鐘 → 又 kill → <b className="text-red-400">無限循環，pod 永遠起不來</b>。</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">❌ 爛解法：把 initialDelaySeconds 調到 180</p>
          <p className="text-slate-300">問題：穩定運行後如果卡住，要等 3 分鐘才會被救。<b>為了啟動犧牲了運行期敏感度。</b></p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-green-400 font-semibold mb-1">✅ 正解：Startup Probe</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre">{`startupProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  failureThreshold: 30    # 容忍次數
  periodSeconds: 5        # → 最多等 30 × 5 = 150 秒
livenessProbe:
  periodSeconds: 10       # 運行期維持敏感
  failureThreshold: 3`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Startup 運作邏輯</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>啟動期 <b>只跑 Startup</b>（容忍 150 秒）</li>
            <li>Startup 成功 <b>一次</b> → <b className="text-green-400">永久關閉</b></li>
            <li>換 Liveness / Readiness 接手，用正常短間隔</li>
            <li>啟動慢 + 運行期敏感 <b>兩個都要</b></li>
          </ul>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded text-[11px]">
          <b className="text-amber-300">為什麼不 demo？</b>nginx 啟動 &lt; 1 秒，很難做出慢啟動場景。記住這個工具，實際遇到慢啟動 app 再用。挑戰題會要你自己實作。
        </div>
      </div>
    ),
    notes: `Startup Probe 延伸講解，不做 demo，為什麼不 demo 我等一下解釋。

情境先講清楚。假設你手上有一個 legacy Java app，啟動要 2 分鐘。你想：我 Liveness 設 initialDelaySeconds 30 秒，應該夠了吧。錯了。30 秒後 Liveness 打進去，app 還在啟動、回不了 request。probe 失敗三次就殺掉。殺掉又重啟，又要 2 分鐘，又被殺。無限循環，pod 永遠起不來。這是真實會發生的生產事故。

爛解法一、把 initialDelaySeconds 調到 180 秒。可以，pod 能起來了。但問題是啟動完、穩定運行之後，如果卡住，要等 3 分鐘才會被救。你為了啟動期犧牲了運行期的敏感度。不好。

正解是用 Startup Probe。Startup 就是專門為這個場景設計的保護傘。

看 YAML。startupProbe 打 /actuator/health 這種輕量健康檢查端點。failureThreshold 30、periodSeconds 5，意思是最多容忍 30 乘 5 等於 150 秒。這 150 秒內 Startup 一直打，哪怕打 29 次失敗只要第 30 次成功也算過。

Startup 的神奇之處：啟動期間 Liveness 跟 Readiness 不會跑。只有 Startup 在守。Startup 成功一次後永久關閉，不再執行。Liveness 跟 Readiness 這時候才接手、用正常的短間隔開始檢查。

所以你得到的是什麼？啟動期有 150 秒容忍、運行期有 30 秒敏感。兩邊都要。

為什麼不 demo？因為 nginx 啟動不到 1 秒，你很難做出慢啟動場景讓 Startup 有表現機會。如果要 demo 我要 fake 一個 sleep 60 的 initContainer，或者換 Spring Boot，兩個都會讓節奏亂掉。所以 Startup 我們用講的，你知道有這個工具、遇到慢啟動 app 知道要用就好。挑戰題會讓你自己加上去跑一遍。

五個 demo 講完，進學員實作。[▶ 學員實作題目]`,
  },

  // ── [8/9] 7-4 學員實作（1/2）：題目 + 驗收條件 ──
  {
    title: '7-4 學員實作：自己部署 Probe 全餐',
    subtitle: 'nginx + Liveness + Readiness + Service，照著指令卡跑一次',
    section: '7-4：學員實作',
    duration: '2',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">題目場景</p>
          <p className="text-slate-300">你剛學會三種 Probe，現在自己部署 nginx + Liveness + Readiness + Service，照指令卡驗證三件事：Liveness 重啟、Readiness 拔流量、整體使用者無感。</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">必做題要求</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>Deployment：<code className="text-amber-300">my-probe</code>，replicas 3，image <code className="text-amber-300">nginx:1.27</code></li>
            <li>Liveness 打 <code>/</code> port 80，<code>initialDelay 5, period 10, threshold 3</code></li>
            <li>Readiness 打 <code>/</code> port 80，<code>initialDelay 3, period 5, threshold 2</code></li>
            <li>ClusterIP Service：<code className="text-amber-300">my-probe-svc</code></li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">驗收條件（4 條全綠才算過）</p>
          <ul className="text-slate-300 space-y-0.5">
            <li>✅ 部署後三個 pod 都 Running + READY 1/1</li>
            <li>✅ <code className="text-green-300">rm index.html</code> 後 15 秒內 endpoints 從 3 變 2</li>
            <li>✅ 30 秒內 RESTARTS +1</li>
            <li>✅ 重啟後 endpoints 自動加回 3</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/40 p-2 rounded">
          <p className="text-cyan-300 font-semibold mb-1">🏆 挑戰題：Startup Probe</p>
          <p className="text-slate-300">加 <code className="text-amber-300">startupProbe</code> 打 <code>/</code>、<code>failureThreshold: 30</code>、<code>periodSeconds: 5</code>（容忍 150 秒）。用 <code>kubectl describe pod</code> 觀察 Events 裡 Startup probe 的記錄，確認 Startup 先通過才輪到 Liveness。</p>
        </div>
      </div>
    ),
    notes: `好，換你們做。前面五個 demo 都是我做給你們看，現在你自己做一遍。

情境很單純：部署一個 nginx，同時加 Liveness 跟 Readiness、配一個 Service。照著下一頁的指令卡跑一遍，目標是親眼驗證三件事——Liveness 真的會重啟、Readiness 真的會拔流量、整體使用者無感。

必做題要求四個。Deployment 名字 my-probe、replicas 3、image nginx:1.27。Liveness 打根路徑 port 80、參數用標準組合 initialDelay 5 period 10 threshold 3。Readiness 也打根路徑、但 period 5 threshold 2，比 Liveness 快、先拔流量。最後一個 ClusterIP Service 叫 my-probe-svc。

驗收條件四條全綠才算過。第一，部署後三個 pod 都 Running 而且 READY 1/1。第二，rm index.html 後 15 秒內看 endpoints 會從 3 變 2，這是 Readiness 拔流量。第三，30 秒內 RESTARTS 加 1，這是 Liveness 重啟。第四，重啟完 endpoints 自動加回 3，恢復正常。

挑戰題給行有餘力的。加一個 startupProbe，failureThreshold 30、periodSeconds 5，容忍 150 秒。你不需要真的做出慢啟動 app，只要加上這個設定、部署後用 kubectl describe pod 看 Events，你會看到 Startup probe 先執行、通過後才換 Liveness 開始檢查。這樣就驗證了 Startup 的運作機制。

下一頁完整指令卡，照著打就行。有問題舉手。[▶ 下一頁：完整指令卡]`,
  },

  // ── [9/9] 7-4 學員實作（2/2）：完整指令卡 + Loop 3 收斂 ──
  {
    title: '7-4 完整指令卡 + Loop 3 收斂',
    subtitle: '照著打，從部署到驗收到清理',
    section: '7-4：學員實作',
    duration: '8',
    content: (
      <div className="space-y-1 text-[10px]">
        <div className="bg-slate-900 p-2 rounded font-mono overflow-x-auto">
          <pre className="text-slate-300 whitespace-pre">{`# ─── Part 1：寫 YAML + 部署 ───
cat > my-probe.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-probe
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-probe
  template:
    metadata:
      labels:
        app: my-probe
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet: {path: /, port: 80}
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            httpGet: {path: /, port: 80}
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 2
---
apiVersion: v1
kind: Service
metadata:
  name: my-probe-svc
spec:
  selector: {app: my-probe}
  ports: [{port: 80, targetPort: 80}]
EOF

kubectl apply -f my-probe.yaml
kubectl get pods -l app=my-probe
kubectl get endpoints my-probe-svc           # 3 個 IP

# ─── Part 2：破壞一個 pod ───
POD=$(kubectl get pods -l app=my-probe -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD -- rm /usr/share/nginx/html/index.html

# ─── Part 3：觀察 Readiness 拔流量（15 秒內）───
kubectl get endpoints my-probe-svc           # 3 → 2
kubectl get pods -l app=my-probe             # pod 還 Running，READY 變 0/1

# ─── Part 4：觀察 Liveness 重啟（30 秒內）───
kubectl get pods -l app=my-probe -w
# → 看到 RESTARTS +1，Ctrl+C 離開

# ─── Part 5：查看失敗事件 ───
kubectl describe pod $POD | grep -A5 Events

# ─── Part 6：清理（Loop 3 全部）───
kubectl delete -f nginx-no-probe.yaml --ignore-not-found
kubectl delete -f nginx-liveness.yaml --ignore-not-found
kubectl delete -f nginx-liveness-only.yaml --ignore-not-found
kubectl delete -f nginx-readiness.yaml --ignore-not-found
kubectl delete -f my-probe.yaml --ignore-not-found
rm -f nginx-no-probe.yaml nginx-liveness.yaml nginx-liveness-only.yaml nginx-readiness.yaml my-probe.yaml`}</pre>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/40 p-2 rounded text-[11px]">
          <p className="text-cyan-300 font-semibold mb-1">Loop 3 因果鏈</p>
          <p className="text-slate-300 text-[10px]">Running 在騙你 → Liveness 自動救援（殺掉重建）→ Readiness 避免流量打壞 pod（拔流量不殺）→ 同招 rm html 兩種後果 → <b className="text-amber-300">production 部署必備組合</b>。</p>
        </div>
      </div>
    ),
    notes: `完整指令卡六步。

Part 1 寫 YAML 加部署。用 cat heredoc 把 Deployment + Service 兩個物件一次寫進 my-probe.yaml。注意 Deployment 跟 Service 中間用三個橫線 --- 分隔，這是 YAML 多文件語法。apply 下去，kubectl get pods 看三個 pod 都 Running，kubectl get endpoints 看 3 個 IP。

Part 2 破壞一個 pod。抓 POD 變數、exec 進去 rm index.html。

Part 3 觀察 Readiness 反應，15 秒內。kubectl get endpoints 會看到從 3 變 2。kubectl get pods 會看到壞 pod 還 Running 但 READY 從 1/1 變 0/1。這就是 Readiness 拔流量、不殺 pod。

Part 4 觀察 Liveness 重啟，30 秒內。kubectl get pods -w 用 watch 模式看，RESTARTS 從 0 變 1。Ctrl+C 離開。

Part 5 查看失敗事件。kubectl describe pod grep Events，會看到 Liveness probe failed 403、Readiness probe failed 403、Killing、Started 這些記錄。完整的救援軌跡留在這裡。

Part 6 清理。kubectl delete -f 把 Deployment 跟 Service 都刪掉。

挑戰題的話，在 Part 1 的 YAML 加上 startupProbe 區塊，apply 重新跑一遍，看 describe pod 的 Events，你會看到 Startup 先執行、通過後才是 Liveness 跟 Readiness 接手。

最後 Loop 3 收斂一下。因果鏈：Running 在騙你、沒 probe K8s 不知道死活——加 Liveness 自動救援、殺掉重建——加 Readiness 避免流量打壞 pod、拔流量不殺——同一招 rm html 兩種 probe 兩種後果——這組 Liveness + Readiness 是 production 部署必備組合。

給你們 10 分鐘做。做完下午的 Loop 4 我們把 Probe 跟 ConfigMap、Secret、Service 全部整合，做一個完整的 production-ready 部署。[▶ 中午休息 / Loop 4：整合部署]`,
  },


  // ============================================================
]