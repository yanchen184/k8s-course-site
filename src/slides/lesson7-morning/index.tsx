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
  // Loop 1：HPA 自動擴縮（對應 public/docs/day7-loop1-hpa.md）
  // 7-1 回顧+環境（3 張）+ 7-2 概念（2 張）+ 7-3 實戰（4 張）+ 7-4 實作（1 張）= 10 張
  // ============================================================

  // ── [1/10] 7-1（1/3）：開場 + 第六堂因果鏈回顧 ──
  {
    title: '第七堂：生產就緒 — 穿得漂亮不代表扛得住',
    subtitle: '從第六堂六招，到今天的兩個戰場',
    section: '7-1：回顧 + 今天的挑戰',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-cyan-400 font-semibold mb-2">第六堂六招因果鏈</p>
          <div className="space-y-1 text-slate-300">
            <p>① <b className="text-amber-300">Ingress</b> — IP+NodePort 地址醜 → 用域名路由</p>
            <p>② <b className="text-amber-300">ConfigMap / Secret</b> — 設定寫死 Image → 設定跟程式分離</p>
            <p>③ <b className="text-amber-300">PV / PVC</b> — Pod 重啟資料消失 → 持久化儲存</p>
            <p>④ <b className="text-amber-300">StatefulSet</b> — 資料庫要穩定身份 → Pod 名字不變、有序啟動</p>
            <p>⑤ <b className="text-amber-300">Helm</b> — YAML 複製貼上地獄 → values.yaml 管理</p>
            <p>⑥ <b className="text-amber-300">Rancher GUI</b> — kubectl 操作成本高 → 圖形化降門檻</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">但服務真的扛得住嗎？</p>
          <p className="text-slate-300">有域名、有設定、有資料庫、有 GUI——<b>穿得漂亮不代表扛得住</b>。今天補兩個生產環境最要命的缺口。</p>
        </div>
      </div>
    ),
    notes: `好，歡迎回來。今天是我們 Kubernetes 課程的第七堂，也是最後一堂。

在開始新內容之前，先把第六堂的因果鏈快速串一遍。為什麼要串？因為今天要講的東西，是建立在前六堂基礎上的最後一哩路。

第六堂的起點是使用者要用 IP 加 NodePort 連進來，地址又長又醜、每次改 port 就爆炸。所以學了 Ingress，用域名路由。

接著發現設定寫死在 Image 裡、改設定要重 build image。所以學了 ConfigMap 跟 Secret，設定跟程式分離。

然後 Pod 重啟資料全消失，資料庫跑在 K8s 裡等於自殺。所以學了 PV 跟 PVC，做持久化。

跑資料庫不只要持久化，還要穩定的身份跟有序啟動。所以學了 StatefulSet，Pod 名字不變、順序上線。

當 YAML 多到爆、每個環境要改一堆值，複製貼上地獄。所以學了 Helm，用 values.yaml 一次管理。

最後 kubectl 管一整個叢集太痛苦，開發者要看日誌、除錯、重啟 Pod，全部靠指令效率太低。所以學了 Rancher GUI，用圖形化界面降低操作門檻。

服務看起來很體面了：有域名、有設定管理、有資料庫、有 GUI。但我今天要跟大家說一件殘酷的事情——穿得漂亮不代表扛得住。

下一頁，今天兩個戰場。[▶ 下一頁]`,
  },

  // ── [2/10] 7-1（2/3）：今天兩個戰場 ──
  {
    title: '今天兩個戰場 — 流量暴增 + 誰都能刪',
    subtitle: 'Loop 1 HPA 解決自動擴縮、Loop 2 RBAC 解決權限管控',
    section: '7-1：回顧 + 今天的挑戰',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded text-xs">
          <p className="text-red-400 font-semibold mb-1">戰場一：流量暴增（雙十一故事）</p>
          <p className="text-slate-300 mb-1">平常 3 個 Pod 夠用，雙十一零點流量翻 10 倍。凌晨 3 點你在睡覺——使用者打不開頁面、每分鐘損失幾十萬。</p>
          <p className="text-slate-300">手動 scale 兩個缺陷：<b className="text-amber-300">反應太慢</b>（你在睡覺）+ <b className="text-amber-300">忘記縮回來</b>（月底帳單傻眼）。</p>
          <p className="text-green-400 font-semibold mt-2">→ Loop 1：HPA（Horizontal Pod Autoscaler）</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded text-xs">
          <p className="text-red-400 font-semibold mb-1">戰場二：誰都能刪（實習生故事）</p>
          <p className="text-slate-300">十個人全拿 <code className="text-red-400">cluster-admin</code>。實習生跑清理腳本，<code className="text-red-400">kubectl delete namespace production</code>——整個生產環境瞬間消失。</p>
          <p className="text-green-400 font-semibold mt-2">→ Loop 2：RBAC（Role-Based Access Control）</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-center">
          <p className="text-cyan-400 font-semibold">上午：Loop 1 HPA → Loop 2 RBAC ｜ 下午：從零建完整系統</p>
        </div>
      </div>
    ),
    notes: `今天我選了生產環境裡兩個最要命的問題，上午各用一個 Loop 解決。

戰場一，流量暴增。想像你的網站平常三個 Pod 夠用，雙十一零點開賣，流量瞬間翻十倍。你在哪？凌晨三點你在睡覺。使用者打不開頁面、下不了單，每分鐘損失幾十萬。等你起床手動 kubectl scale 已經半小時過去了。

手動 scale 有兩個根本問題：第一，反應太慢，沒辦法即時應對。第二，容易忘記縮回來，流量過了還開著十個 Pod，月底帳單傻眼。這個問題用 HPA 解決。

戰場二，誰都能刪。你團隊十個人，全部都拿 cluster-admin 的 kubeconfig。某天實習生跑清理腳本，指令打錯，kubectl delete namespace production。整個生產環境瞬間消失。這個問題用 RBAC 解決。

上午兩個 Loop：Loop 1 HPA、Loop 2 RBAC。下午從零建一套完整系統，把前面學的所有東西串起來。

進 Loop 1 之前，先把環境清乾淨。[▶ 下一頁：環境準備]`,
  },

  // ── [3/10] 7-1（3/3）：環境準備 ──
  {
    title: 'Loop 1 環境準備 — 清理殘留資源',
    subtitle: '第六堂的 Helm release 會吃 CPU，干擾 HPA 觀察',
    section: '7-1：環境準備',
    duration: '5',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">為什麼要清？</p>
          <p className="text-slate-300">monitoring / my-app / my-blog / my-ingress 還在跑會吃 CPU/Memory，HPA 指標會被干擾。PVC 不刪 disk 會佔滿。</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">清理 Helm release</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">helm uninstall monitoring -n default</p>
            <p className="text-green-300">helm uninstall my-app -n default</p>
            <p className="text-green-300">helm uninstall my-blog -n default</p>
            <p className="text-green-300">helm uninstall my-ingress -n default</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">清理殘留 + 釋放磁碟</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl delete all --all -n default</p>
            <p className="text-green-300">kubectl delete pvc --all -n default</p>
            <p className="text-green-300">sudo journalctl --vacuum-size=100M</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">確認環境乾淨</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get pods -n default</p>
            <p className="text-green-300">df -h /</p>
            <p className="text-slate-400">→ pods 應為空、磁碟空間 ≥ 3G</p>
          </div>
        </div>
      </div>
    ),
    notes: `在進 HPA 實作之前，先動手把環境清乾淨。

為什麼要清？第六堂我們部署了四個 Helm release：monitoring、my-app、my-blog、my-ingress。這些都還在跑、會吃 CPU 跟 Memory。等一下 HPA 要觀察 CPU 指標，如果資源被其他東西吃掉，HPA 算出來的百分比會不準。你看到的擴縮行為就會奇怪。

第一步，helm uninstall 把四個 release 全部刪掉。這會連帶刪掉它們建的所有 Deployment、Service、ConfigMap。

第二步，保險起見再 kubectl delete all 跟 kubectl delete pvc。有些殘留資源可能不是 Helm 建的，這一步把它們清掉。PVC 一定要刪，不然 disk 空間會被佔住。

第三步，journalctl vacuum。這個清 systemd 的 log，釋放磁碟空間。log 久了會吃掉幾個 G，不清等一下拉 image 可能空間不夠。

最後確認。kubectl get pods 應該是空的，df -h 看 / 至少 3G 以上。準備好就進 HPA 概念。[▶ 下一頁：HPA 概念]`,
  },

  // ── [4/10] 7-2（1/2）：HPA 概念 ──
  {
    title: 'HPA 解決什麼問題？',
    subtitle: '手動 scale 的兩個致命缺陷 → HPA 全自動擴縮',
    section: '7-2：HPA 概念',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded text-xs">
          <p className="text-red-400 font-semibold mb-1">手動 scale 的兩個致命缺陷</p>
          <ul className="text-slate-300 space-y-1 list-disc list-inside">
            <li><b className="text-amber-300">反應太慢</b>：流量暴增時你在睡覺/吃飯/開會，損失已造成</li>
            <li><b className="text-amber-300">忘記縮回來</b>：當下撐過去，事後沒人記得縮，帳單三倍</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-3 rounded text-xs">
          <p className="text-green-400 font-semibold mb-2">HPA 工作流程（全自動）</p>
          <div className="space-y-1 text-slate-300">
            <p>每 <b className="text-cyan-400">15 秒</b> 問 metrics-server：目前每個 Pod CPU 多少？</p>
            <p>→ 超過門檻（50%）：<b className="text-green-400">增加 Pod</b></p>
            <p>→ 低於門檻：<b className="text-amber-300">等穩定窗口</b>（預設 5 分鐘）後縮 Pod</p>
            <p className="text-slate-400">（穩定窗口防抖：避免流量短暫下降又回升時頻繁縮容）</p>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded text-xs">
          <p className="text-amber-300 font-semibold mb-1">兩個前提（缺一不可）</p>
          <ul className="text-slate-300 space-y-1 list-disc list-inside">
            <li>Pod 要設 <code className="text-green-300">resources.requests.cpu</code>（HPA 算百分比的分母）</li>
            <li>叢集要有 <code className="text-green-300">metrics-server</code>（k3s 內建、minikube 要手動開啟）</li>
          </ul>
        </div>
      </div>
    ),
    notes: `HPA 要解決什麼問題？手動 scale 有兩個致命缺陷。

第一，反應太慢。流量暴增那一刻你可能在睡覺、在吃飯、在開會。等你發現、登入叢集、下指令，幾十分鐘過去了，損失已經造成。

第二，容易忘記縮回來。就算你當下撐過去了，事後誰記得要縮回來？開著十個 Pod 整個月，帳單三倍不是開玩笑。

所以需要自動化。這就是 HPA 存在的理由。

HPA 的工作流程。HPA 每 15 秒去問一次 metrics-server：目前這個 Deployment 每個 Pod 的 CPU 使用率是多少？

超過你設的目標值——比如 50%——HPA 就增加 Pod。新 Pod 啟動後，流量分攤到更多 Pod，CPU 使用率就降下來了。

當流量降下來之後，CPU 也跟著降。但 HPA 不會馬上縮 Pod。它會等一段穩定窗口——預設五分鐘——看到 CPU 連續五分鐘都低於門檻才開始縮。為什麼？因為怕流量只是暫時降了一下馬上又上來。防抖設計。

整個流程全自動，人不用看、不用介入。

有兩個前提缺一不可。第一，Pod 必須設 resources.requests.cpu。HPA 算的是百分比，百分比需要分母，分母就是 requests。沒設 requests，TARGETS 永遠顯示 unknown，HPA 不會動。

第二，叢集要有 metrics-server。k3s 內建，如果用 minikube 要 minikube addons enable metrics-server 啟用。

下一頁看完整 YAML。[▶ 下一頁：HPA YAML]`,
  },

  // ── [5/10] 7-2（2/2）：HPA YAML 完整版 ──
  {
    title: 'HPA YAML 完整版 — 四個關鍵欄位',
    subtitle: '實戰會用一行指令（快）+ 完整 YAML（進階參數）',
    section: '7-2：HPA 概念',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-900 p-2 rounded font-mono text-[11px]">
          <pre className="text-slate-300 whitespace-pre">{`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-resource-demo
spec:
  scaleTargetRef:              # ★1 要管哪個 Deployment
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo
  minReplicas: 2               # ★2 最少 2 個（高可用）
  maxReplicas: 5               # ★3 最多 5 個（VM 保護）
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 2  # ★4 課堂 VM 值（生產設 50~70）`}</pre>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">四個關鍵欄位</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li><code className="text-amber-300">scaleTargetRef.name</code>：要跟 Deployment 的 metadata.name 完全一致</li>
            <li><code className="text-amber-300">minReplicas: 2</code>：沒流量也保留 2 個避免單點故障</li>
            <li><code className="text-amber-300">maxReplicas: 5</code>：單節點 VM 安全值；生產環境可調大</li>
            <li><code className="text-amber-300">averageUtilization: 2</code>：課堂 VM 設 2%（nginx 靜態頁面 CPU 極低）；生產通常 50~70%</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/40 p-2 rounded">
          <p className="text-cyan-300 font-semibold mb-1">實戰兩種建法</p>
          <p className="text-slate-300">Demo 1 用 <code className="text-green-300">kubectl autoscale</code> 一行指令（快、適合實驗）→ Demo 4 升級成完整 YAML 加 <code className="text-green-300">behavior</code>（適合生產、可版控、能調進階參數）</p>
        </div>
      </div>
    ),
    notes: `這是一份完整的 HPA YAML，四個關鍵欄位看清楚。

第一，scaleTargetRef。它告訴 HPA 要管哪個 Deployment。name 一定要跟 Deployment 的 metadata.name 完全一致，寫錯就連不上。

第二，minReplicas 設 2。為什麼不是 1？因為設 1 的話 HPA 縮容後只剩一個 Pod，那個 Pod 掛掉就服務中斷。設 2 維持基本高可用。

第三，maxReplicas 設 5。為什麼不設 10？因為我們用的是單節點 VM 環境，設太大會把節點資源吃光、VM 可能重啟。生產環境你有幾個大 node 可以設到 20、50。

第四，averageUtilization。這個是相對於 requests 的百分比。課堂 VM 我們設 2%——為什麼這麼低？因為 nginx 服務靜態頁面吃 CPU 極低，設 50% busybox 打不上去，課堂就看不到擴容。生產環境通常設 50 到 70。

實戰我們有兩種建法。Demo 1 會用 kubectl autoscale 一行指令——快、適合實驗、但不能調進階參數。Demo 4 重壓測前會升級成完整 YAML、加上 behavior 欄位——這個可以版控、可以調穩定窗口，生產環境就是這樣管的。

好，進實戰。[▶ 下一頁：Demo 1 部署 + 建 HPA]`,
  },

  // ── [6/10] 7-3（1/4）：Demo 1 部署 + 建 HPA（一行版）──
  {
    title: 'Demo 1：部署 nginx + 建 HPA（一行版）',
    subtitle: 'kubectl autoscale 一行指令，快速建 HPA',
    section: '7-3：HPA 實戰',
    duration: '3',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Step 1：確認 metrics-server</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get pods -n kube-system -l k8s-app=metrics-server</p>
            <p className="text-green-300">kubectl top nodes</p>
            <p className="text-green-300">kubectl top pods -A</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Step 2：建 nginx-resource-demo.yaml（貼整段到 VM）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[9px]">
            <pre className="text-slate-300 whitespace-pre">{`cat > nginx-resource-demo.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-resource-demo
spec:
  replicas: 2
  selector:
    matchLabels: {app: nginx-resource}
  template:
    metadata:
      labels: {app: nginx-resource}
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        ports: [{containerPort: 80}]
        resources:
          requests: {cpu: "100m", memory: "128Mi"}   # ★ HPA 分母
          limits:   {cpu: "150m", memory: "256Mi"}   # ★ 單 Pod 上限
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-resource-svc
spec:
  selector: {app: nginx-resource}
  ports: [{port: 80, targetPort: 80}]
EOF`}</pre>
          </div>
          <div className="bg-slate-900 p-2 mt-1 rounded font-mono">
            <p className="text-green-300">kubectl apply -f nginx-resource-demo.yaml</p>
            <p className="text-green-300">kubectl get deploy nginx-resource-demo</p>
            <p className="text-green-300">kubectl get svc nginx-resource-svc</p>
            <p className="text-slate-400">→ READY 2/2，Service 有 CLUSTER-IP</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Step 3：建 HPA（一行指令版）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl autoscale deployment nginx-resource-demo --min=2 --max=5 --cpu=2%</p>
            <p className="text-green-300">kubectl get hpa</p>
            <p className="text-slate-400">→ 剛建好 TARGETS 顯示 unknown/50%，等 30s~1min 變實際數字</p>
          </div>
        </div>
      </div>
    ),
    notes: `Demo 1 的目標很單純——部署 nginx、建 HPA，確認環境能動。

Step 1 確認 metrics-server。跑三個指令：get pods 看 metrics-server 是不是 Running、kubectl top nodes 看節點 CPU memory 有沒有數字、kubectl top pods 看每個 pod 指標。都正常代表 metrics-server 在工作。k3s 內建，應該都沒問題。

Step 2 部署 nginx。YAML 的重點在 resources 區塊。requests.cpu 100m 是 HPA 的分母——等一下 HPA 算百分比就拿這個當基準。limits.cpu 設 150m，這是單 Pod 最高能用 150m。為什麼不是 200？因為我們 maxReplicas 設 5，5 乘以 150m 等於 0.75 個 CPU，單節點 VM 2 核扛得住。設太高會打爆 VM。

apply 下去，get deploy 看 READY 2/2、get svc 看 CLUSTER-IP 有分配到。

Step 3 建 HPA。這是今天第一次用一行指令建 HPA。kubectl autoscale 後面接 deployment 名字、min 2、max 5、cpu 2%。為什麼是 2%？因為課堂 VM 跑 nginx 靜態頁面 CPU 極低，設 50% 根本壓不上去，課堂看不到擴容。生產環境你設 50 到 70。這行指令等同於 18 行 YAML，但不能調進階參數。Demo 4 我們會升級成 YAML 版。

建好 get hpa 看。TARGETS 欄位剛開始顯示 unknown 斜線 50%。unknown 不代表錯——是 metrics-server 還沒回報數據。等 30 秒到 1 分鐘，TARGETS 會變成實際數字，比如 1% 斜線 50%。那就是 HPA 準備好了。

下一頁開始壓測。先輕壓做對照組。[▶ 下一頁：Demo 2 輕壓 sleep 0.1]`,
  },

  // ── [7/10] 7-3（2/4）：Demo 2 輕壓 sleep 0.1（對照組）──
  {
    title: 'Demo 2：輕壓測 sleep 0.1（對照組）',
    subtitle: '證明 HPA 不會亂擴 — 流量低時即使有 HPA 也不動',
    section: '7-3：HPA 實戰',
    duration: '5',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">目的（對照組）</p>
          <p className="text-slate-300">每秒 ~10 次請求，模擬日常低流量。預期 CPU 10-20%、REPLICAS 維持 2。<b>驗證 HPA 不會亂加 Pod。</b></p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">開新終端跑輕壓測</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre-wrap break-all">{`kubectl run load-light --image=busybox:1.36 --rm -it --restart=Never --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.1; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh`}</pre>
          </div>
          <p className="text-slate-400 mt-1">（壓測 pod 自己限制 100m，避免自己吃爆 node）</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">原終端觀察（1 分鐘）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get hpa -w</p>
            <p className="text-slate-400">→ TARGETS 爬到 10-20%，<span className="text-green-400">REPLICAS 維持 2</span></p>
            <p className="text-slate-400">→ Ctrl+C 離開 watch，壓測終端也 Ctrl+C 停掉</p>
          </div>
        </div>
      </div>
    ),
    notes: `Demo 2 的角色是對照組——我要證明 HPA 不是你一壓就會擴。它看比例，比例不過門檻就不動。

開新的終端機跑 load-light。這個指令看起來很長，解釋一下。kubectl run 起一個 busybox pod 叫 load-light。關鍵在 overrides——我用 JSON 覆寫 pod spec，加了兩件事：command 是 while true 無限迴圈，每次 wget 打 service，sleep 0.1 秒；resources.limits.cpu 100m 限制這個壓測 pod 自己最多用 100m。

為什麼要限制壓測 pod？因為 busybox while true 如果不 sleep、又不限資源，壓測 pod 自己就會把 node CPU 吃光、連 kubelet 都餓死、VM 重啟。這是我之前自己測試踩的坑。

sleep 0.1 每秒大概 10 次請求，模擬日常低流量。

回原終端 kubectl get hpa -w，watch 模式看。1 分鐘左右你會看到 TARGETS 從 unknown 變成 10% 或 20%——CPU 有在動但低於 50% 門檻。REPLICAS 欄位維持 2，不擴。這就是對照組——驗證 HPA 不會亂加 pod。

觀察夠了 Ctrl+C 離開 watch，切到壓測終端按 Ctrl+C 停掉 load-light。下一頁中壓測，看門檻邊緣。[▶ 下一頁：Demo 3 中壓 sleep 0.05]`,
  },

  // ── [8/10] 7-3（3/4）：Demo 3 中壓 sleep 0.05（臨界）──
  {
    title: 'Demo 3：中壓測 sleep 0.05（臨界觀察）',
    subtitle: '讓 CPU 爬到接近門檻 — 看 HPA 是在算比例不是看絕對值',
    section: '7-3：HPA 實戰',
    duration: '5',
    content: (
      <div className="space-y-2 text-xs">
        <div className="bg-amber-900/20 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">目的（臨界值）</p>
          <p className="text-slate-300">每秒 ~20 次請求。預期 CPU 30-40%、接近但未過 50%。REPLICAS <b>可能 2 或 3</b>，依 VM 實際表現。</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">開新終端跑中壓測</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre-wrap break-all">{`kubectl run load-medium --image=busybox:1.36 --rm -it --restart=Never --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.05; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">觀察 1 分鐘</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get hpa -w</p>
            <p className="text-slate-400">→ TARGETS 爬到 30-40%，<span className="text-amber-300">REPLICAS 可能 2 或 3</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-900/30 to-red-900/30 border border-amber-500/40 p-2 rounded">
          <p className="text-amber-300 font-semibold mb-1">教學點</p>
          <p className="text-slate-300">HPA 不是「一壓就擴」，是<b>看比例</b>。壓力大小、門檻高低、requests 設多少，三者一起決定擴不擴。</p>
        </div>
      </div>
    ),
    notes: `Demo 3 中壓測，看臨界值。

同樣的結構，換名字叫 load-medium、sleep 從 0.1 降到 0.05，等於每秒 20 次請求。流量是 Demo 2 的兩倍。

kubectl get hpa -w 看。預期 TARGETS 會爬到 30 到 40%，接近但還沒過 50% 門檻。REPLICAS 這邊就看 VM 實際表現——有的 VM 會衝到 50% 以上觸發擴容變 3，有的會卡在 40% 不動。都是正常的。

這一階段的重點不是擴幾個，是讓學員看到 HPA 在算數字、不是按開關。壓力大小、門檻高低、requests 設多少，三者一起決定擴不擴。你如果把 targetCPU 改成 30%——像挑戰題那樣——同樣的中壓就會擴了。門檻越低越敏感。

Ctrl+C 停掉 load-medium，進 Demo 4。重壓、而且要看到縮容。[▶ 下一頁：Demo 4 重壓 + 縮容]`,
  },

  // ── [9/10] 7-3（4/4）：Demo 4 重壓 + 升級 YAML + 看縮容 ──
  {
    title: 'Demo 4：重壓 sleep 0.01 + 升級 YAML + 縮容',
    subtitle: 'behavior 縮短穩定窗口 60 秒，課堂看得到縮容',
    section: '7-3：HPA 實戰',
    duration: '7',
    content: (
      <div className="space-y-2 text-[11px]">
        <div className="bg-cyan-900/20 border border-cyan-500/40 p-2 rounded">
          <p className="text-cyan-300 font-semibold mb-1">Step 1：升級 HPA 加 behavior（一行指令做不到，只能用 YAML）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[9px]">
            <pre className="text-slate-300 whitespace-pre">{`kubectl delete hpa nginx-resource-demo
kubectl scale deployment nginx-resource-demo --replicas=2

cat > hpa-tuned.yaml <<'EOF'
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-resource-demo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 2  # ← 課堂 VM 值，生產設 50~70
  behavior:                            # ★ 進階參數
    scaleDown:
      stabilizationWindowSeconds: 60   # ← 60 秒就縮（預設 300）
EOF

kubectl apply -f hpa-tuned.yaml`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Step 2：重壓 sleep 0.01（每秒 ~100 req）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[10px]">
            <pre className="text-slate-300 whitespace-pre-wrap break-all">{`kubectl run load-heavy --image=busybox:1.36 --rm -it --restart=Never --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.01; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh`}</pre>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Step 3：觀察擴 → 停壓 → 縮（60 秒）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl get hpa -w</p>
            <p className="text-green-300">kubectl get pods -w</p>
            <p className="text-slate-400">→ REPLICAS 2 → 3 → 4 → 5（擴到 max）</p>
            <p className="text-slate-400">→ 壓測終端 Ctrl+C 停，回來等 <span className="text-amber-300">60 秒</span></p>
            <p className="text-slate-400">→ REPLICAS 5 → 4 → 3 → 2（縮回 min）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">Step 4：看完整軌跡</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-green-300">kubectl describe hpa nginx-resource-demo</p>
            <p className="text-slate-400">→ Events：New size 3 / 5（擴）→ New size 4 / 2（縮）</p>
          </div>
        </div>
      </div>
    ),
    notes: `Demo 4 三件事一次做：重壓觸發擴容、升級 YAML 加 behavior 看縮容、看完整軌跡。

Step 1 升級 HPA。為什麼要升級？因為預設的 downscale stabilization window 是 300 秒，也就是停壓後要等五分鐘才開始縮。課堂上等五分鐘太久。

一行 kubectl autoscale 做不到改這個參數——這是進階參數、只能用 YAML。這剛好是教學點：生產環境的 HPA 一定要用 YAML 管理，指令式只適合快速實驗。

先 kubectl delete hpa 把舊的一行版刪掉。然後 apply hpa-tuned.yaml。這個 YAML 多了 behavior 區塊，scaleDown 的 stabilizationWindowSeconds 設 60。就是 60 秒的縮容穩定窗口，不是 300 秒。課堂就看得到縮容。

Step 2 開新終端跑 load-heavy。sleep 0.01 每秒大概 100 次請求。這是真的重壓。

Step 3 回原終端 get hpa -w 跟 get pods -w。預期 TARGETS 飆到 60 到 80%，REPLICAS 從 2 開始擴——2、3、4、5，到 maxReplicas 上限就停。同時 get pods 看新 pod 冒出來，Pending、ContainerCreating、Running。

看到擴到 5 就可以停壓了。壓測終端按 Ctrl+C。回原終端繼續 watch。CPU 一停立刻降到接近 0%。等 60 秒——我們設的穩定窗口——REPLICAS 開始縮：5 回 4、4 回 3、3 回 2。縮到 minReplicas 2 停。

Step 4 kubectl describe hpa 看 Events。你會看到完整的擴縮軌跡：New size 3 reason CPU above target、New size 5 above target、New size 4 below target、New size 2 below target。生產環境排查 HPA 問題就靠這個 Events。

邊等縮容邊講 QA：
Q：TARGETS unknown？最常見是沒設 requests，或 metrics-server 剛啟動。
Q：minReplicas 2，手動 scale 到 1？HPA 會把它拉回 2，HPA 是最終控制者。
Q：擴快縮慢合理嗎？合理。擴慢使用者受影響，縮快容易抖動。

縮回 2 了就進學員實作。[▶ 下一頁：學員實作]`,
  },

  // ── [10/10] 7-4：學員實作 + Loop 1 收斂 ──
  {
    title: '7-4 學員實作 + Loop 1 收斂',
    subtitle: '照著做三階段壓測 + 挑戰題 targetCPU 30%',
    section: '7-4：學員實作',
    duration: '7',
    content: (
      <div className="space-y-1 text-[10px]">
        <div className="bg-slate-800/50 p-2 rounded">
          <p className="text-cyan-400 font-semibold mb-1">必做題要求 + 驗收條件</p>
          <ul className="text-slate-300 space-y-0.5 list-disc list-inside">
            <li>部署 nginx-resource-demo.yaml（含 requests 100m / limits 150m）</li>
            <li>一行指令建 HPA：min=2 max=5 cpu=50%</li>
            <li>三階段壓測：輕壓 0.1（不擴）→ 中壓 0.05（臨界）→ 重壓 0.01（擴到 5）</li>
            <li>升級 hpa-tuned.yaml 加 behavior，停壓後 60 秒內縮回 2</li>
            <li>✅ get hpa TARGETS 有數字 / 重壓 REPLICAS &gt; 2 / 停壓縮回 2 / describe hpa Events 有擴縮記錄</li>
          </ul>
        </div>

        <div className="bg-slate-900 p-2 rounded font-mono">
          <pre className="text-slate-300 whitespace-pre">{`# ─── Part 1：部署 ───
kubectl apply -f nginx-resource-demo.yaml
kubectl get deploy nginx-resource-demo
kubectl get svc nginx-resource-svc

# ─── Part 2：建 HPA（一行版）───
kubectl autoscale deployment nginx-resource-demo --min=2 --max=5 --cpu=2%
kubectl get hpa

# ─── Part 3：輕壓 0.1（對照組，應不擴）───
kubectl run load-light --image=busybox:1.36 --rm -it --restart=Never \\
  --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.1; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
kubectl get hpa -w          # 另一終端觀察

# ─── Part 4：中壓 0.05（臨界）───
kubectl run load-medium --image=busybox:1.36 --rm -it --restart=Never \\
  --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.05; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh

# ─── Part 5：升級 HPA（加 behavior）───
kubectl delete hpa nginx-resource-demo
kubectl scale deployment nginx-resource-demo --replicas=2
kubectl apply -f hpa-tuned.yaml

# ─── Part 6：重壓 0.01 → 擴 → 停壓 → 60 秒縮 ───
kubectl run load-heavy --image=busybox:1.36 --rm -it --restart=Never \\
  --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.01; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
kubectl get hpa -w
kubectl get pods -w

# ─── Part 7：看軌跡 ───
kubectl describe hpa nginx-resource-demo

# ─── 挑戰題：修改 yaml 改 min/max ───
# 編輯 hpa-tuned.yaml：minReplicas: 2 → 3，maxReplicas: 5 → 6
kubectl apply -f hpa-tuned.yaml
kubectl get hpa
# 觀察：無流量也維持 3 個 Pod，重壓最多擴到 6

# ─── 清理 ───
kubectl delete hpa nginx-resource-demo --ignore-not-found
kubectl delete -f nginx-resource-demo.yaml --ignore-not-found
kubectl delete -f hpa-tuned.yaml --ignore-not-found
rm -f nginx-resource-demo.yaml hpa-tuned.yaml`}</pre>
        </div>

        <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/40 p-2 rounded">
          <p className="text-cyan-300 font-semibold mb-1">Loop 1 因果鏈</p>
          <p className="text-slate-300">流量暴增手動來不及 → HPA 監控 CPU 自動擴 → 三階段驗證門檻行為 → 生產用 YAML + behavior 控制節奏 → 全自動不需人介入。</p>
        </div>
      </div>
    ),
    notes: `換你們做。照指令卡跑完整流程，驗證三階段壓測跟縮容。

必做題要求四件事：部署 nginx 含 requests/limits、一行建 HPA、三階段壓測看行為、升級 YAML 看 60 秒縮容。

驗收條件四條：get hpa TARGETS 要有數字不是 unknown；重壓時 REPLICAS 要大於 2；停壓後 60 秒縮回 2；describe hpa Events 要看得到擴縮記錄。

巡堂我會檢查這四條。

挑戰題——修改 hpa-tuned.yaml，把 minReplicas 從 2 改成 3、maxReplicas 從 5 改成 6，重新 apply。觀察兩件事：沒有任何流量，Pod 也會維持 3 個不縮；重壓時最多能擴到 6 個。感受 min/max 這兩個參數如何決定 HPA 的上下邊界。

常見坑四個：unknown 通常是沒設 requests 或 metrics-server 剛啟動；top pods 報 Metrics API not available 是 metrics-server 沒裝；壓測把 VM 打掛通常是壓測 pod 沒設 limits 或 maxReplicas 設太大。

做完清理——hpa delete、deployment delete、yaml rm 掉。

Loop 1 因果鏈一句話：流量暴增手動來不及 → HPA 監控 CPU 自動擴 → 三階段驗證門檻行為 → 生產用 YAML 加 behavior 控制節奏 → 全自動不需人介入。

給你們 15 分鐘做。HPA 讓服務能自己擴縮，但如果誰都能 kubectl delete，擴再多也沒用。Loop 2 來解決權限問題。[▶ Loop 2：RBAC 權限控制]`,
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
          <p className="text-amber-300 font-semibold mb-1">給外部使用者：換 127.0.0.1 成實際 IP（自動偵測）</p>
          <div className="bg-slate-900 p-2 rounded font-mono">
            <p className="text-slate-500"># 自動抓 VM 的對外 IP（也可手動 VM_IP=你的IP）</p>
            <p className="text-green-300">VM_IP=$(hostname -I | awk '{`{print $1}`}')</p>
            <p className="text-green-300">sed -i \</p>
            <p className="text-green-300">  "s|https://127.0.0.1:6443|https://${`{VM_IP}`}:6443|" \</p>
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
VM_IP=$(hostname -I | awk '{print $1}')    # 或手動 VM_IP=你的IP
sed -i "s|https://127.0.0.1:6443|https://\${VM_IP}:6443|" backend-kubeconfig.yaml

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

Part 6 組 kubeconfig。注意 context 裡 namespace 設 backend-team，這樣 backend-dev 打 kubectl get pods 預設就看 backend-team。sed 那行把 127.0.0.1 換成實際 Node IP，VM_IP 用 hostname -I 自動偵測你自己機器的 IP，不需要手動改。

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
          <p className="text-cyan-400 font-semibold mb-1">建 nginx-no-probe.yaml（貼整段到 VM）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[9px]">
            <pre className="text-slate-300 whitespace-pre">{`cat > nginx-no-probe.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-no-probe
spec:
  replicas: 1
  selector:
    matchLabels: {app: nginx-no-probe}
  template:
    metadata:
      labels: {app: nginx-no-probe}
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        ports: [{containerPort: 80}]
        # 故意沒有任何 Probe
EOF`}</pre>
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
          <p className="text-cyan-400 font-semibold mb-1">建 nginx-liveness.yaml（貼整段，加 livenessProbe）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[9px]">
            <pre className="text-slate-300 whitespace-pre">{`cat > nginx-liveness.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-liveness
spec:
  replicas: 1
  selector:
    matchLabels: {app: nginx-liveness}
  template:
    metadata:
      labels: {app: nginx-liveness}
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        ports: [{containerPort: 80}]
        livenessProbe:              # ★ 只加這區塊
          httpGet: {path: /, port: 80}
          initialDelaySeconds: 5    # 啟動後等 5 秒
          periodSeconds: 10         # 每 10 秒戳一次
          failureThreshold: 3       # 連續失敗 3 次才判定
          timeoutSeconds: 1         # 1 秒沒回應算超時
EOF`}</pre>
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
          <p className="text-cyan-400 font-semibold mb-1">建 nginx-liveness-only.yaml（3 replicas + Service）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[9px]">
            <pre className="text-slate-300 whitespace-pre">{`cat > nginx-liveness-only.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-liv-only
spec:
  replicas: 3                    # ★ 3 個 pod 共同接流量
  selector:
    matchLabels: {app: nginx-liv-only}
  template:
    metadata:
      labels: {app: nginx-liv-only}
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        ports: [{containerPort: 80}]
        livenessProbe:             # ★ 只有 Liveness，故意沒 Readiness
          httpGet: {path: /, port: 80}
          periodSeconds: 10
          failureThreshold: 3
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-liv-svc
spec:
  selector: {app: nginx-liv-only}
  ports: [{port: 80, targetPort: 80}]
EOF`}</pre>
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
          <p className="text-cyan-400 font-semibold mb-1">建 nginx-readiness.yaml（Liveness + Readiness 都設）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-[9px]">
            <pre className="text-slate-300 whitespace-pre">{`cat > nginx-readiness.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-readiness
spec:
  replicas: 3
  selector:
    matchLabels: {app: nginx-readiness}
  template:
    metadata:
      labels: {app: nginx-readiness}
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        ports: [{containerPort: 80}]
        livenessProbe:
          httpGet: {path: /, port: 80}
          periodSeconds: 10
          failureThreshold: 3      # 30 秒才殺
        readinessProbe:            # ★ 多加這區塊
          httpGet: {path: /, port: 80}
          periodSeconds: 5         # 比 Liveness 頻繁
          failureThreshold: 2      # 10 秒就拔流量
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-rdy-svc
spec:
  selector: {app: nginx-readiness}
  ports: [{port: 80, targetPort: 80}]
EOF`}</pre>
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