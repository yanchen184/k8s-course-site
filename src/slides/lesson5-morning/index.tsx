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
  // 5-1：第四堂回顧 + 為什麼需要多節點（2 張）
  // ============================================================

  // ── 5-1（1/2）：開場 + 因果鏈回顧 ──
  {
    title: '第五堂：Deployment 進階 — 從單節點到真正的叢集',
    subtitle: '擴縮容 → 滾動更新 → 自我修復 → Labels/Selector',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">第四堂因果鏈回顧</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap my-1">
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">Docker 扛不住</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Pod</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Service</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Ingress</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">ConfigMap</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Secret</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Volume</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">Deployment</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">StatefulSet</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">八個概念 → 架構 → YAML → Pod CRUD → 排錯 → Sidecar → kubectl 進階 → 環境變數 → Deployment 初體驗</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">第四堂下半場實作回顧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">學會的技能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">架構</td>
                <td className="py-2">Master 4 元件 + Worker 3 元件，kubectl → API Server</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">YAML</td>
                <td className="py-2">apiVersion / kind / metadata / spec 四欄位</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Pod CRUD</td>
                <td className="py-2">get / describe / logs / exec / delete</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Deployment</td>
                <td className="py-2">replicas:3 跑三個 nginx Pod</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">minikube 三大限制 → 今天換 k3s</p>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex gap-2"><span className="text-red-400">①</span><span>replicas:3 → Pod 全擠同一台，Node 掛了全死</span></div>
            <div className="flex gap-2"><span className="text-red-400">②</span><span>NodePort 只有一個 Node IP，體驗不到多節點連入</span></div>
            <div className="flex gap-2"><span className="text-red-400">③</span><span>DaemonSet 只跑一個 Pod，跟 replicas:1 無差</span></div>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
第四堂完整回顧：K8s 架構兩大角色——Master Node（apiserver、etcd、scheduler、controller-manager）和 Worker Node（kubelet、kube-proxy、Container Runtime）。YAML 四大必填欄位：apiVersion、kind、metadata、spec。Pod 是最小部署單位，是「臨時的」，沒有自我修復能力。kubectl 五大指令：get、describe、logs、exec、delete。排錯三板斧：get → describe（看 Events）→ logs。

minikube 三大限制：① Pod 全擠同一台 Node，感受不到分散；② NodePort 只有一個 Node IP；③ DaemonSet 只跑一個 Pod 跟普通 Pod 無差。

k3s 是 Rancher Labs 的輕量版 K8s，完全相容 K8s API，一行 curl 30 秒安裝。Multipass 是 Canonical 出品的 VM 管理工具，一行指令建 Ubuntu VM。

【③④ 題目 + 解答】
題目 1【確認操作】：你的叢集上有 nginx Deployment，執行 'kubectl get pods -o wide'，看 NODE 欄位。在 minikube 和 k3s 環境各截圖，說出差異在哪裡。
驗收：能指出 minikube 截圖 NODE 全部相同，k3s 截圖 NODE 有不同名稱。

題目 2【三板斧操作確認】：老師幫你部署了一個使用 nginx:99.99.99 的 Deployment，叢集裡有一個 Pod 卡在 ImagePullBackOff。請依序執行三板斧，說出每步看到什麼。
  準備環境：kubectl create deployment bad-image-demo --image=nginx:99.99.99 --replicas=1
  任務：用 get → describe → logs 找出問題，說出 describe 的 Events 裡哪一行告訴你 image pull 失敗。
驗收：能念出 Events 裡含 "Failed to pull image" 或 "ImagePullBackOff" 的那行。

題目 3【清理】：kubectl delete deployment bad-image-demo，確認 Pod 消失。

[▶ 下一頁]`,
  },

  // ── 5-1（1.5/2）：K8s 架構兩大角色回顧 ──
  {
    title: 'K8s 架構兩大角色快速回顧',
    subtitle: 'Master（控制平面）4 元件 + Worker（執行平面）3 元件',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Master Node（控制平面）— 負責決策、管理、排程</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-cyan-800/50 text-cyan-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">kube-apiserver</span>
              <span className="text-slate-300 text-sm">所有指令的唯一入口，kubectl 跟它說話</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-cyan-800/50 text-cyan-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">etcd</span>
              <span className="text-slate-300 text-sm">叢集的資料庫，儲存所有狀態（鍵值對）</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-cyan-800/50 text-cyan-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">kube-scheduler</span>
              <span className="text-slate-300 text-sm">決定 Pod 要放在哪個 Node 上</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-cyan-800/50 text-cyan-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">controller-manager</span>
              <span className="text-slate-300 text-sm">監控叢集狀態，確保實際 = 期望（如 ReplicaSet 控制器）</span>
            </div>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">Worker Node（執行平面）— 負責實際跑容器</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-green-800/50 text-green-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">kubelet</span>
              <span className="text-slate-300 text-sm">Node 的管家，和 API Server 保持心跳，確保容器按 Pod Spec 執行</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-green-800/50 text-green-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">kube-proxy</span>
              <span className="text-slate-300 text-sm">處理 Node 上的網路規則，讓 Service 可以轉發流量</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-green-800/50 text-green-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">Container Runtime</span>
              <span className="text-slate-300 text-sm">真正跑容器的引擎（containerd / CRI-O）</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-1">kubectl 下指令的路徑</p>
          <div className="flex items-center gap-1 text-xs flex-wrap">
            <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded">你的電腦</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded">kube-apiserver</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded">etcd（寫入期望狀態）</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-2 py-0.5 rounded">scheduler（分配 Node）</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">kubelet（執行容器）</span>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
K8s 架構兩大角色快速複習。

Master Node 四個元件：
1. kube-apiserver：所有操作的唯一入口，kubectl 的所有指令都先到這裡；它負責驗證請求、然後寫入 etcd
2. etcd：分散式鍵值資料庫，儲存叢集的所有狀態（期望狀態和實際狀態都在這裡）
3. kube-scheduler：Watch API Server，當有新 Pod 需要調度時，根據資源和規則決定放到哪個 Worker Node
4. controller-manager：持續 Watch 叢集狀態，確保實際 = 期望；ReplicaSet 控制器就住在這裡，Pod 少了就補

Worker Node 三個元件：
1. kubelet：每個 Node 上的管家，向 API Server 定期心跳報告；收到 Pod Spec 後呼叫 Container Runtime 跑容器
2. kube-proxy：維護每個 Node 上的 iptables/ipvs 規則，讓 Service 的流量能轉發到正確的 Pod
3. Container Runtime：真正執行容器的引擎，k8s 現在主流是 containerd（Docker 底層也是它）

kubectl 下指令路徑：你 → apiserver → etcd（記錄期望） → scheduler/controller 接力 → kubelet 執行

【③ 題目】
1.【操作確認】執行 'kubectl get nodes'，指著畫面上的每個欄位說出代表什麼意思。
2.【操作確認】執行 'kubectl get pods -n kube-system'，找到 kube-apiserver、etcd、kube-scheduler 這三個 Pod，說出它們跑在哪個 Node 上。
3.【操作確認】執行 'kubectl apply -f pod.yaml'（用任意一個你的 YAML 檔），馬上執行 'kubectl get events --sort-by=.metadata.creationTimestamp | tail -10'，在輸出裡找出「Scheduled」和「Pulled」事件，說出 Pod 被分配到哪個 Node。

【④ 解答】
1. NAME 是節點名稱；STATUS 是 Ready/NotReady；ROLES 是節點角色（control-plane 或 worker）；AGE 是節點加入多久。
2. 三個系統 Pod 全部跑在 control-plane 那台 Node，因為那些元件本身就屬於 master，不會調度到 worker。
3. Events 的 Scheduled 那行會顯示 "Successfully assigned default/<pod-name> to <node-name>"，這就是 scheduler 決定的目的地。

[▶ 下一頁]`,
  },

  // ── 5-1 YAML + Pod 核心概念 ──
  {
    title: 'YAML 四大必填欄位 + Pod 核心概念',
    subtitle: 'apiVersion / kind / metadata / spec — Pod 是最小部署單位',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '4',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">YAML 四大必填欄位</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-blue-800/50 text-blue-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">apiVersion</span>
              <span className="text-slate-300 text-sm">API 群組版本（v1、apps/v1 等）</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue-800/50 text-blue-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">kind</span>
              <span className="text-slate-300 text-sm">資源類型（Pod、Deployment、Service 等）</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue-800/50 text-blue-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">metadata</span>
              <span className="text-slate-300 text-sm">資源的「身分證」（name、namespace、labels）</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-blue-800/50 text-blue-300 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap">spec</span>
              <span className="text-slate-300 text-sm">期望狀態（這個資源該長什麼樣）</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
          <p className="text-purple-400 font-semibold mb-3">Pod 核心概念</p>
          <div className="space-y-2">
            <div className="flex gap-2 items-start">
              <span className="text-yellow-400 font-bold">①</span>
              <span className="text-slate-300 text-sm">K8s <strong className="text-white">最小部署單位</strong>，不是容器本身</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-yellow-400 font-bold">②</span>
              <span className="text-slate-300 text-sm">一個 Pod 可以包多個容器（但通常一個），共享網路 namespace 和 Volume</span>
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-yellow-400 font-bold">③</span>
              <span className="text-slate-300 text-sm">Pod 是「<strong className="text-red-400">臨時的</strong>」，沒有自我修復能力，刪了就沒了</span>
            </div>
          </div>
          <div className="bg-slate-900/50 p-2 rounded mt-3 text-xs font-mono">
            <p className="text-slate-400"># Pod 刪了就消失，要靠 Deployment 管理</p>
            <p className="text-red-400">kubectl delete pod my-pod  # 直接消失，不會重建</p>
            <p className="text-green-400">kubectl delete pod my-pod  # Deployment 管的 → 自動重建 ✓</p>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
YAML 四大必填欄位：
- apiVersion：告訴 K8s 要用哪個 API 版本解析這份 YAML。Pod 用 v1，Deployment 用 apps/v1
- kind：資源類型，K8s 用這個決定要建什麼東西
- metadata：身分證，name 是必填，namespace 預設 default，labels 是之後 Selector 用的
- spec：最複雜的部分，描述資源期望的狀態（容器名稱、image、port、環境變數等）

Pod 核心概念：
- 最小部署單位：你不直接管容器，你管 Pod；Pod 裡放容器
- 共享網路：同一個 Pod 裡的容器用 localhost 就能互通，共用同一個 IP
- 臨時性：Pod 沒有自我修復，刪了就沒了。這就是為什麼需要 Deployment 來管 Pod

【③ 題目】
1.【操作確認】執行 'kubectl apply -f' 套用以下這個壞掉的 YAML（少了 spec.containers），觀察報錯訊息，說出 K8s 拒絕的原因是哪個欄位：
  apiVersion: v1
  kind: Pod
  metadata:
    name: broken-pod
  spec: {}
驗收：能指出 "spec.containers: Required value" 這行錯誤，說明 spec 裡的 containers 是必填欄位。

2.【操作確認】先確認你有一個 Deployment（'kubectl get deploy'），用名稱選一個 Pod 執行 'kubectl delete pod <name>'，馬上計時並執行 'kubectl get pods -w'，說出幾秒後看到新 Pod。
驗收：能說出幾秒內出現 ContainerCreating 的新 Pod，並說明是 ReplicaSet 偵測到數量不足才補上的。

【④ 解答】
1. 套用 spec: {} 會看到 "ValidationError(Pod.spec): missing required field 'containers'"。spec 負責「期望狀態」，containers 是其中必填的核心欄位，缺了就無法建立。
2. 通常 3-10 秒內出現新 Pod。新 Pod 的 NAME 有不同的隨機 suffix，代表是重新建立的。這就是 ReplicaSet 的 reconciliation loop 在作用。

[▶ 下一頁]`,
  },

  // ── 5-1 kubectl 五大指令 + 排錯三板斧 ──
  {
    title: 'kubectl 五大指令 + 排錯三板斧',
    subtitle: 'get / describe / logs / exec / delete — 三板斧解決九成問題',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '4',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">kubectl 五大指令</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex gap-3 items-center">
              <span className="bg-slate-700 text-green-300 px-2 py-0.5 rounded font-mono w-20 text-center text-xs">get</span>
              <span className="text-slate-300">查看資源列表（快速瀏覽）</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="bg-slate-700 text-green-300 px-2 py-0.5 rounded font-mono w-20 text-center text-xs">describe</span>
              <span className="text-slate-300">查看資源詳細資訊（<span className="text-yellow-400">Events 是排錯關鍵</span>）</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="bg-slate-700 text-green-300 px-2 py-0.5 rounded font-mono w-20 text-center text-xs">logs</span>
              <span className="text-slate-300">查看容器日誌</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="bg-slate-700 text-green-300 px-2 py-0.5 rounded font-mono w-20 text-center text-xs">exec</span>
              <span className="text-slate-300">進入容器執行指令</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="bg-slate-700 text-green-300 px-2 py-0.5 rounded font-mono w-20 text-center text-xs">delete</span>
              <span className="text-slate-300">刪除資源</span>
            </div>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">排錯三板斧（按順序）</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start">
              <span className="bg-red-800/50 text-red-300 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">① get</span>
              <div>
                <code className="text-green-400 text-xs">kubectl get pods</code>
                <p className="text-slate-400 text-xs mt-0.5">看 STATUS：Running / Pending / CrashLoopBackOff / ImagePullBackOff</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-red-800/50 text-red-300 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">② describe</span>
              <div>
                <code className="text-green-400 text-xs">kubectl describe pod &lt;name&gt;</code>
                <p className="text-slate-400 text-xs mt-0.5">看 Events 區塊，通常錯誤原因在這</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="bg-red-800/50 text-red-300 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">③ logs</span>
              <div>
                <code className="text-green-400 text-xs">kubectl logs &lt;pod-name&gt;</code>
                <p className="text-slate-400 text-xs mt-0.5">看容器內部 stderr / stdout（CrashLoopBackOff 必用）</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `# 五大指令
kubectl get pods
kubectl get pods -o wide          # 含 NODE / IP 欄位
kubectl describe pod <pod-name>   # 看 Events
kubectl logs <pod-name>           # 容器日誌
kubectl exec -it <pod-name> -- bash  # 進容器
kubectl delete pod <pod-name>

# 排錯三板斧
kubectl get pods                  # ① 看 STATUS
kubectl describe pod <pod-name>   # ② 看 Events
kubectl logs <pod-name>           # ③ 看日誌`,
    notes: `【① 課程內容】
kubectl 五大指令快速複習：
- get：列出資源，加 -o wide 看更多欄位（IP、Node）
- describe：最詳細的資訊，Events 區塊記錄了 K8s 幫你做了什麼（拉 image、排程、啟動、失敗原因）
- logs：容器的 stdout/stderr，程式裡的 console.log / print 都在這
- exec：進到容器裡面執行指令，debug 神器（-it 是互動模式，-- bash 是要執行的指令）
- delete：刪除資源

排錯三板斧，為什麼要按這個順序：
1. get 先看 STATUS，快速判斷問題大類：Pending（調度問題）/ CrashLoopBackOff（容器一直掛）/ ImagePullBackOff（拉 image 失敗）
2. describe 看 Events，K8s 會把「發生了什麼事」記在 Events 裡，例如「找不到 image」、「資源不足」，通常答案就在這
3. logs 看容器內部錯誤，適合 CrashLoopBackOff 這種容器有跑起來但一直掛掉的狀況

【③ 題目】
1.【三板斧實操】執行以下兩個指令製造問題，然後用三板斧排查，說出每步看到什麼：
  製造 ImagePullBackOff：kubectl create deployment err1 --image=nginx:no-such-tag --replicas=1
  任務：執行 get → describe → logs，說出每步的輸出重點在哪裡，最後說出 describe Events 裡哪行告訴你 image 拉失敗。

2.【三板斧實操】製造 CrashLoopBackOff：
  把以下 YAML 存成 crash-pod.yaml 並 apply：
    apiVersion: v1
    kind: Pod
    metadata:
      name: crash-demo
    spec:
      containers:
      - name: app
        image: busybox
        command: ["sh", "-c", "echo hello && exit 1"]
  任務：等 Pod 進入 CrashLoopBackOff 後，執行 'kubectl logs crash-demo' 和 'kubectl logs crash-demo --previous'，說出兩者差別，說出 logs 裡看到什麼。

【④ 解答】
1. get → STATUS 顯示 ErrImagePull 或 ImagePullBackOff；describe → Events 末段出現 "Failed to pull image...not found"；logs → 因容器沒啟動所以 logs 沒有輸出（這就是為什麼要先 describe）。
2. 'kubectl logs crash-demo' 看目前這次的輸出（"hello"）；'kubectl logs crash-demo --previous' 看上一次崩潰的輸出（也是 "hello"）。能看到輸出表示容器有啟動但 exit code 是 1，用 describe 看 Last State 的 Exit Code。

[▶ 下一頁]`,
  },

  // ── 5-1（2/2）：minikube 的問題 + 為什麼需要多節點 + k3s 介紹 ──
  {
    title: 'minikube 只有一個 Node — 看不出分散的效果',
    subtitle: '三個 Pod 全擠同一台，Node 掛了全死 → 需要多節點',
    section: '5-1：回顧 + 為什麼需要多節點',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：minikube 只有一個 Node</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>replicas:3 → 三個 Pod 全擠同一台，<strong className="text-white">共享命運</strong></li>
            <li>Node 掛了 → 三個 Pod 全死，<strong className="text-red-400">無處可搬</strong></li>
            <li>scale 到 5 → 五個全在一台，CPU/記憶體就是上限</li>
            <li>DaemonSet → 只跑一個 Pod，跟 replicas:1 無差別</li>
            <li>NodePort → 只有一個 Node IP，體會不到「連任何 Node 都能進」</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：k3s 多節點叢集</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">比較</th>
                <th className="pb-2 pr-4">minikube</th>
                <th className="pb-2">k3s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">節點數</td>
                <td className="py-2 pr-4 text-red-400">單節點</td>
                <td className="py-2 text-green-400">多節點（真正的叢集）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">用途</td>
                <td className="py-2 pr-4">本機開發測試</td>
                <td className="py-2">開發 / 邊緣 / 生產皆可</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">安裝</td>
                <td className="py-2 pr-4">minikube start</td>
                <td className="py-2">curl 一行搞定</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Pod 分散</td>
                <td className="py-2 pr-4 text-red-400">全擠同一台</td>
                <td className="py-2 text-green-400">自動分散到不同 Node</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">環境方案：VMware + k3s</p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="bg-cyan-900/40 border border-cyan-500/30 px-3 py-2 rounded text-center">
              <p className="text-cyan-400 font-bold">k3s-master</p>
              <p className="text-slate-400 text-xs">2 CPU / 2G RAM</p>
            </div>
            <span className="text-slate-500 text-xl">+</span>
            <div className="bg-cyan-900/40 border border-cyan-500/30 px-3 py-2 rounded text-center">
              <p className="text-cyan-400 font-bold">k3s-worker1</p>
              <p className="text-slate-400 text-xs">2 CPU / 2G RAM</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">VMware 建兩台 Ubuntu 22.04 VM，NAT 網路互通即可</p>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
minikube 單節點三大限制：
① replicas:3 → 三個 Pod 全擠同一台，Node 掛了全死、無處可搬。
② NodePort 只有一個 Node IP，體驗不到多節點連入效果。
③ DaemonSet 只跑一個 Pod，跟 replicas:1 無差。

k3s 解法：多節點真實叢集，完全相容 K8s API，curl 一行搞定。名字由來：K8s 是 10 字母縮寫，half as big 5 字母就是 K3s。環境方案：VMware 建兩台 Ubuntu VM，NAT 網路互通，一台 master 一台 worker。

Docker 對照：Docker Swarm init vs k3s curl 安裝；docker node ls vs kubectl get nodes；join token 位置和格式不同。

【③④ 題目 + 解答】
題目 1【操作確認】：執行 'kubectl get nodes'，說出你的叢集有幾個節點、名稱各是什麼、哪個是 control-plane。
驗收：能念出兩個節點的名稱，分清楚哪個是 master 哪個是 worker。

題目 2【操作確認】：執行 'kubectl create deployment node-check --image=nginx --replicas=4'，等 Pod 全 Running 後執行 'kubectl get pods -o wide'，數一數 NODE 欄位有幾種不同名稱。
驗收：能看到 Pod 分散在兩個不同 Node，並說出這在 minikube（單節點）上會有什麼不同。

題目 3【操作確認】：執行以下指令，說出 Pod 被分配到哪個 Node：
  kubectl get pods -o wide -l app=node-check
  然後執行 'kubectl delete deployment node-check'。
  說明：為什麼 Scheduler 不會把 6 個 Pod 全部塞到同一個 Node？
驗收：說出 "Scheduler 預設盡量分散到不同 Node 以避免單點故障"，並執行清理。

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-2：k3s 安裝實作（3 張）
  // ============================================================

  // ── 5-2（0/3）：踩坑：.bashrc 壞掉 ──
  {
    title: '踩坑：SSH 連進去有一堆錯誤訊息',
    subtitle: 'OVF 匯入的 VM，.bashrc 壞掉 → 一行指令修好',
    section: '5-2：k3s 安裝實作',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：SSH 連進去看到一堆錯誤</p>
          <p className="text-slate-300 text-sm">OVF 匯入的 Ubuntu VM，SSH 連線後出現 .bashrc 相關錯誤訊息</p>
          <p className="text-slate-400 text-xs mt-2">原因：.bashrc 設定檔損壞，每次登入都會觸發</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：從 Windows 直接修，不用進 VM</p>
          <div className="bg-slate-900/50 p-3 rounded text-sm font-mono">
            <p className="text-slate-400"># 在 Windows 本機跑（不用先登入）</p>
            <p className="text-green-400">ssh user@&lt;vm-ip&gt; "mv ~/.bashrc ~/.bashrc.bak"</p>
          </div>
          <p className="text-slate-300 text-sm mt-2">把壞掉的 .bashrc 移走，重新 SSH 就乾淨了</p>
        </div>
      </div>
    ),
    code: `# 在 Windows PowerShell 跑（換成你的 VM IP）
ssh user@192.168.43.130 "mv ~/.bashrc ~/.bashrc.bak"

# 重新 SSH 連進去，沒有錯誤訊息就修好了
ssh user@192.168.43.130`,
    notes: `【① 課程內容】
OVF 匯入的 Ubuntu VM，SSH 連線後可能出現 .bashrc 相關錯誤訊息。.bashrc 是每次登入自動執行的設定檔，損壞就每次報錯。

解法：從 Windows 本機直接跑 ssh 指令，不用先進 VM：
ssh user@<vm-ip> "mv ~/.bashrc ~/.bashrc.bak"

這行指令 SSH 進去後直接備份壞掉的 .bashrc，整個過程不需要進互動介面。跑完重新 SSH 就乾淨了。沒遇到這個問題可以跳過。

【② 指令講解】
指令：ssh user@192.168.43.130 "mv ~/.bashrc ~/.bashrc.bak"
- ssh user@<ip>：連線到 VM（換成你的 VM IP）
- "mv ~/.bashrc ~/.bashrc.bak"：直接跑 mv 備份壞掉的設定檔，不進互動介面
- 打完要看：沒有報錯，就代表成功；重新 SSH 連線確認無錯誤訊息

異常狀況：
- Permission denied：確認 VM IP 和 user 帳號是否正確
- 沒有遇到錯誤訊息：直接跳過這步

[▶ 下一頁]`,
  },

  // ── 5-2（1/3）：VMware 建 VM + k3s 安裝 ──
  {
    title: 'k3s 安裝實作：VMware 建 VM + 安裝 k3s',
    subtitle: '一行 curl 搞定 master，token + IP 讓 worker 加入',
    section: '5-2：k3s 安裝實作',
    duration: '6',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Step 0：VMware 匯入 OVF</p>
          <div className="flex items-center gap-1 text-xs flex-wrap">
            <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded">File</span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded">Open</span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded">選 .ovf</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-800/50 text-green-300 px-2 py-0.5 rounded">開機</span>
          </div>
          <p className="text-slate-400 text-xs mt-1">匯入兩次 → 得到 master + worker 兩台 VM</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Step 1–2：改 hostname + 查 IP</p>
          <div className="space-y-1 font-mono text-xs">
            <p><span className="text-slate-400"># master</span></p>
            <p className="text-green-400">sudo hostnamectl set-hostname k3s-master</p>
            <p><span className="text-slate-400"># worker</span></p>
            <p className="text-green-400">sudo hostnamectl set-hostname k3s-worker</p>
            <p className="text-green-400">hostname -I  <span className="text-slate-500"># 或 ip addr show</span></p>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Step 3：Master 安裝 k3s</p>
          <p className="font-mono text-xs text-green-400 mb-1">curl -sfL https://get.k3s.io | sh -</p>
          <p className="text-yellow-400 text-xs">✅ 看到 <code>systemd: Starting k3s</code> 才算成功</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-2 text-sm">Step 4–5：取 Token → Worker 加入</p>
          <div className="space-y-1 font-mono text-xs">
            <p className="text-green-400">sudo cat /var/lib/rancher/k3s/server/node-token</p>
            <p className="text-green-400">curl -sfL https://get.k3s.io | K3S_URL=https://&lt;master-ip&gt;:6443 K3S_TOKEN=&lt;token&gt; sh -</p>
          </div>
          <p className="text-yellow-400 text-xs mt-1">✅ 看到 <code>systemd: Starting k3s-agent</code> 才算成功</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Step 6：驗證叢集</p>
          <div className="font-mono text-xs space-y-0.5">
            <p className="text-green-400">sudo k3s kubectl get nodes</p>
            <p className="text-slate-300">ubuntu-master &nbsp;<span className="text-green-400">Ready</span>&nbsp; control-plane,master</p>
            <p className="text-slate-300">ubuntu-worker &nbsp;<span className="text-green-400">Ready</span>&nbsp; &lt;none&gt;</p>
          </div>
        </div>
      </div>
    ),
    code: `# ── master VM ──
# Step 1：改 hostname（兩台名字不能一樣）
sudo hostnamectl set-hostname ubuntu-master
sudo reboot

# Step 2：確認 IP
ip addr show | grep "inet " | grep -v 127
# → 記下 192.168.x.x

# Step 3：裝 k3s
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes   # 1 個 Ready

# Step 4：取得 token
sudo cat /var/lib/rancher/k3s/server/node-token
# → 複製這串 token

# ── worker VM ──
# Step 5：改 hostname
sudo hostnamectl set-hostname ubuntu-worker
sudo reboot

# Step 6：加入叢集（換掉 <master-ip> 和 <token>）
curl -sfL https://get.k3s.io | \\
  K3S_URL=https://<master-ip>:6443 \\
  K3S_TOKEN=<token> sh -

# ── 回到 master 驗證 ──
sudo kubectl get nodes   # 兩個 Ready`,
    notes: `【① 課程內容】
兩台 VM 都從同一個 OVF 匯入，hostname 預設一樣，k3s 用 hostname 識別節點，名字相同會衝突，所以先改。master 安裝只要一行 curl，k3s 腳本自動處理所有前置作業。worker 加入時設定 K3S_URL 和 K3S_TOKEN 兩個環境變數，k3s 自動以 agent 模式安裝。

【② 指令講解】
1. 改 hostname + 重開機（兩台各做一次）
   sudo hostnamectl set-hostname ubuntu-master  # master 用
   sudo hostnamectl set-hostname ubuntu-worker  # worker 用
   sudo reboot
   打完要看：重新 SSH 連線後，提示符前面名稱已改變

2. 確認 master IP
   ip addr show | grep "inet " | grep -v 127
   打完要看：192.168.x.x，記下來，worker 加入時要用

3. 在 master 安裝 k3s
   curl -sfL https://get.k3s.io | sh -
   打完要看：最後出現 [INFO] systemd: Starting k3s 表示成功
   sudo kubectl get nodes  → 看到 1 個 Ready

4. 取得 token（master 上）
   sudo cat /var/lib/rancher/k3s/server/node-token
   打完要看：K10abc123...（一長串），複製起來

5. Worker 加入叢集（換掉 <master-ip> 和 <token>）
   curl -sfL https://get.k3s.io | K3S_URL=https://<master-ip>:6443 K3S_TOKEN=<token> sh -
   K3S_URL：master API Server 地址，port 6443
   K3S_TOKEN：加入叢集的身份憑證
   打完要看：[INFO] systemd: Starting k3s-agent（注意是 agent 不是 k3s）

6. 回 master 驗證
   sudo kubectl get nodes
   打完要看：ubuntu-master（control-plane,master）+ ubuntu-worker（none），兩個都 Ready
   異常：worker 顯示 NotReady → 等 30 秒再查，kubelet 啟動需要時間

【③④ 題目 + 解答】
題目 1：K3S_URL 和 K3S_TOKEN 各代表什麼？缺一個會怎樣？
解答：K3S_URL 告訴安裝腳本 master API Server 位址；K3S_TOKEN 是身份憑證。缺 K3S_URL 腳本以 server（master）模式安裝；缺 K3S_TOKEN worker 無法通過 master 認證，加入失敗。

題目 2：為什麼兩台 VM 要先改 hostname 才能建叢集？
解答：k3s 用 hostname 識別節點，兩台 VM 同名就會衝突，叢集狀態混亂，所以要先改成不同名字。

[▶ 下一頁]`,
  },

  // ── 5-2（2/2）：kubeconfig 設定 + 部署驗證 Pod 分散 ──
  {
    title: 'kubeconfig 設定 + 驗證 Pod 分散',
    subtitle: '本機 kubectl 直連 k3s → 部署 Deployment → Pod 分散在不同 Node',
    section: '5-2：k3s 安裝實作',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">kubeconfig 設定（本機直接操作叢集）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>複製 k3s.yaml 到本機 ~/.kube/</li>
            <li>把 127.0.0.1 改成 master 實際 IP</li>
            <li>設定 KUBECONFIG 環境變數</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">驗證：Pod 分散了！</p>
          <div className="bg-slate-900/50 p-3 rounded text-sm font-mono">
            <p className="text-slate-400"># kubectl get pods -o wide</p>
            <p className="text-slate-300">NAME                  READY   NODE</p>
            <p className="text-slate-300">my-nginx-xxx-abc      1/1     <span className="text-cyan-400">k3s-master</span></p>
            <p className="text-slate-300">my-nginx-xxx-def      1/1     <span className="text-green-400">k3s-worker1</span></p>
            <p className="text-slate-300">my-nginx-xxx-ghi      1/1     <span className="text-cyan-400">k3s-master</span></p>
          </div>
          <p className="text-slate-400 text-xs mt-2">minikube 時 NODE 全是 minikube；k3s 分散到不同 Node → Deployment 真正的威力</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">Docker Swarm vs K3s 對照</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-3">動作</th>
                <th className="pb-1 pr-3">Docker Swarm</th>
                <th className="pb-1">K3s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-yellow-400">初始化叢集</td>
                <td className="py-1 pr-3 font-mono text-xs">docker swarm init</td>
                <td className="py-1 font-mono text-xs text-green-400">curl -sfL https://get.k3s.io | sh -</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-yellow-400">加入節點</td>
                <td className="py-1 pr-3 font-mono text-xs">docker swarm join --token ...</td>
                <td className="py-1 font-mono text-xs text-green-400">K3S_URL=... K3S_TOKEN=... curl ... | sh -</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-yellow-400">查看節點</td>
                <td className="py-1 pr-3 font-mono text-xs">docker node ls</td>
                <td className="py-1 font-mono text-xs text-green-400">kubectl get nodes</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-yellow-400">Join Token</td>
                <td className="py-1 pr-3 font-mono text-xs">docker swarm join-token worker</td>
                <td className="py-1 font-mono text-xs text-green-400">cat /var/lib/.../node-token</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Step 7：kubeconfig 設定（在 master VM 裡面跑）
sudo cat /etc/rancher/k3s/k3s.yaml
# → 複製整個內容

# 把內容貼到本機 C:\Users\你的名字\.kube\k3s-config
# 把檔案裡的 127.0.0.1 改成 master 的實際 IP

# Windows PowerShell 設定環境變數
$env:KUBECONFIG = "C:\Users\你的名字\.kube\k3s-config"

# 直接在本機 PowerShell 操作
kubectl get nodes    # 兩個 Ready

# 部署 Deployment 驗證分散
kubectl create deployment my-nginx --image=nginx --replicas=3
kubectl get pods -o wide   # 看 NODE 欄位`,
    notes: `【① 課程內容】
kubeconfig 是 k3s 在 master 產生的連線設定檔，位置 /etc/rancher/k3s/k3s.yaml。問題：檔案裡的 server 地址寫 127.0.0.1（master 自己看自己），複製到本機後 kubectl 會連自己的 127.0.0.1，不是 VM，所以必須用 sed 替換成 master 的實際 IP。KUBECONFIG 環境變數告訴 kubectl 讀哪個 config 檔，設好之後本機直接打 kubectl，不用再進 VM。

【② 指令講解】
1. 複製 kubeconfig 到本機
   sudo cat /etc/rancher/k3s/k3s.yaml  → 複製整個輸出，貼到本機 ~/.kube/k3s-config

2. 替換 IP（Linux/macOS）
   sed -i "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config
   -i：直接修改檔案；s/舊/新/g：全部替換

   Windows 方式：用記事本開啟 k3s-config，手動把 127.0.0.1 改成 master 實際 IP

3. 設定環境變數
   export KUBECONFIG=~/.kube/k3s-config          # Linux/macOS
   $env:KUBECONFIG = "C:\Users\..\.kube\k3s-config"  # Windows PowerShell

4. 驗證本機直連
   kubectl get nodes
   打完要看：ubuntu-master + ubuntu-worker，兩個 Ready，不用 multipass exec 了

5. 部署 Deployment 驗證 Pod 分散
   kubectl create deployment my-nginx --image=nginx --replicas=3
   kubectl get pods -o wide
   打完要看：NODE 欄位有不同 Node 名稱，不是全部同一台

異常狀況：
- Unable to connect：sed 替換失敗，確認 MASTER_IP 有值
- certificate signed by unknown authority：嘗試加 --insecure-skip-tls-verify

【③④ 題目 + 解答】
題目：為什麼把 kubeconfig 複製到本機後必須用 sed 替換 IP？
解答：k3s 在 master 上產生 kubeconfig 時，server 欄位寫 127.0.0.1（localhost）。複製到本機後，本機的 127.0.0.1 是自己，kubectl 會嘗試連本機的 6443 port，根本沒有服務，必須改成 master VM 的實際 IP。

題目：操作題：設定好 kubeconfig 後，部署 nginx replicas=3，用 -o wide 確認 Pod 分散。
解答：kubectl get pods -o wide 的 NODE 欄位應顯示不同 Node 名稱，這就是多節點分散部署的效果，minikube 時 NODE 全部相同。

[▶ 下一頁]`,
  },

  // ── 5-2（3/3）：常見踩坑排錯 ──
  {
    title: 'k3s 安裝：常見踩坑 & 修復指令',
    subtitle: 'IP 衝突 / sudo kubectl 沒 kubeconfig / 舊節點殘留',
    section: '5-2：k3s 安裝實作',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-2">❌ 問題 1：兩台 VM IP 相同</p>
          <p className="text-slate-300 text-xs mb-1">OVF 匯入後 MAC address 被複製 → DHCP 發同一個 IP</p>
          <p className="text-yellow-400 text-xs font-semibold">修法：VMware → worker VM → Edit Settings → Network Adapter → Advanced → Generate（產生新 MAC）→ 重開機</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-2">❌ 問題 2：sudo kubectl get nodes → connection refused :8080</p>
          <p className="text-slate-300 text-xs mb-1">sudo 不繼承 export KUBECONFIG，kubectl 找不到 config 改連預設 localhost:8080</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1">
            <code className="text-green-400 text-xs">sudo k3s kubectl get nodes  # 用這個取代 sudo kubectl</code>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm mb-2">❌ 問題 3：get nodes 看到多餘的舊節點（NotReady）</p>
          <p className="text-slate-300 text-xs mb-1">之前測試留下的 node 殘留在 etcd 裡</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1">
            <code className="text-green-400 text-xs">sudo k3s kubectl delete node &lt;舊節點名稱&gt;</code>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm mb-1">💡 省力技巧：設定 alias，不用每次打 sudo k3s</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1 font-mono text-xs space-y-0.5">
            <p className="text-green-400">echo "alias kubectl='sudo k3s kubectl'" &gt;&gt; ~/.bashrc</p>
            <p className="text-green-400">source ~/.bashrc</p>
            <p className="text-slate-400 mt-1"># 之後直接打 kubectl get nodes 就好</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">✅ 正常狀態</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1 font-mono text-xs">
            <p className="text-slate-400">$ kubectl get nodes</p>
            <p className="text-slate-300">ubuntu-master &nbsp; Ready &nbsp; control-plane,master</p>
            <p className="text-slate-300">ubuntu-worker &nbsp; Ready &nbsp; &lt;none&gt;</p>
          </div>
        </div>
      </div>
    ),
    code: `# 設定 alias（一次，以後都用 kubectl 就好）
echo "alias kubectl='sudo k3s kubectl'" >> ~/.bashrc
source ~/.bashrc

# 之後所有指令直接用 kubectl
kubectl get nodes
kubectl get pods -o wide
kubectl apply -f xxx.yaml

# 清除殘留舊節點
kubectl delete node <舊節點名稱>

# 確認服務狀態
sudo systemctl status k3s          # master
sudo systemctl status k3s-agent    # worker`,
    notes: `【常見問題總整理】

問題 1：兩台 IP 一樣（OVF 複製 MAC）
- 症狀：worker 加入後 kubectl get nodes 只有一台，或 SSH 連不上
- 原因：VMware OVF 匯入時 MAC address 也被複製，DHCP 發同一個 IP
- 修法：worker VM 關機 → Edit Settings → Network Adapter → Advanced → Generate 產生新 MAC → 開機

問題 2：sudo kubectl get nodes → connection refused localhost:8080
- 症狀：明明 k3s 有跑，kubectl 還是連不上
- 原因：sudo 不繼承 export KUBECONFIG 設定的環境變數，kubectl 找不到 config，預設連 localhost:8080
- 修法：改用 sudo k3s kubectl get nodes，或設定 alias（見下方）

alias 設定（強烈建議在 master 上做一次）：
  echo "alias kubectl='sudo k3s kubectl'" >> ~/.bashrc
  source ~/.bashrc
  設完之後所有指令直接打 kubectl 就好，不用每次 sudo k3s kubectl

問題 3：get nodes 看到多餘 NotReady 節點
- 症狀：節點列表有不認識的節點名稱，STATUS 是 NotReady
- 原因：之前測試/重裝時舊節點資料殘留在 etcd 裡
- 修法：kubectl delete node <名稱>

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-3：擴縮容概念（2 張）
  // ============================================================

  // ── 5-3（1/2）：問題 + kubectl scale + 背後機制 ──
  {
    title: '擴縮容概念：流量暴增怎麼辦？',
    subtitle: '裸 Pod 無守護 → Deployment 三層結構 → 一行指令加 Pod',
    section: '5-3：擴縮容概念',
    duration: '8',
    content: (
      <div className="space-y-3">
        {/* 裸 Pod vs Deployment 三層結構 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
            <p className="text-red-400 font-semibold text-sm mb-2">裸 Pod（Naked Pod）</p>
            <div className="text-center py-2">
              <div className="inline-block bg-red-900/40 border border-red-500/60 text-red-300 text-xs px-3 py-1 rounded">Pod</div>
              <p className="text-slate-400 text-xs mt-2">刪了就沒了<br/>無自我修復</p>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-500/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-2">Deployment 三層結構</p>
            <div className="flex flex-col items-center gap-1 text-xs">
              <div className="bg-blue-900/50 border border-blue-400/60 text-blue-300 px-3 py-1 rounded w-full text-center">Deployment</div>
              <div className="text-slate-500">↓ 自動建立</div>
              <div className="bg-purple-900/50 border border-purple-400/60 text-purple-300 px-3 py-1 rounded w-full text-center">ReplicaSet（監控副本數）</div>
              <div className="text-slate-500">↓ 管理</div>
              <div className="flex gap-1">
                <div className="bg-green-900/50 border border-green-400/60 text-green-300 px-2 py-0.5 rounded">Pod</div>
                <div className="bg-green-900/50 border border-green-400/60 text-green-300 px-2 py-0.5 rounded">Pod</div>
                <div className="bg-green-900/50 border border-green-400/60 text-green-300 px-2 py-0.5 rounded">Pod</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment YAML 三個新欄位 */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-cyan-400 font-semibold text-sm">Deployment YAML — 三個新欄位</p>
            <span className="bg-yellow-900/40 text-yellow-300 text-xs px-2 py-0.5 rounded">apiVersion: apps/v1</span>
          </div>
          <div className="bg-slate-900/70 p-3 rounded text-xs font-mono leading-5">
            <p><span className="text-slate-500"># nginx-deployment.yaml</span></p>
            <p><span className="text-yellow-300">apiVersion: apps/v1</span>  <span className="text-slate-500"># Pod/Service 用 v1；Deployment 用 apps/v1</span></p>
            <p><span className="text-slate-400">kind: Deployment</span></p>
            <p><span className="text-slate-400">metadata:</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;name: nginx-deploy</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;labels:</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</span></p>
            <p><span className="text-slate-400">spec:</span></p>
            <p><span className="text-green-400">&nbsp;&nbsp;replicas: 3</span>  <span className="text-slate-500"># ① 維持幾個 Pod 副本（新欄位）</span></p>
            <p><span className="text-cyan-400">&nbsp;&nbsp;selector:</span>  <span className="text-slate-500"># ② 認領 Pod 的條件（新欄位）</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</span></p>
            <p><span className="text-cyan-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</span></p>
            <p><span className="text-purple-400">&nbsp;&nbsp;template:</span>  <span className="text-slate-500"># ③ Pod 模板（新欄位）</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;metadata:</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:</span></p>
            <p><span className="text-purple-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app: nginx</span>  <span className="text-red-400"># ← 必須和 ② selector 完全一致！</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;spec:</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: nginx</span>  <span className="text-slate-500"># set image 指令會用到這個名稱</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: nginx:1.25</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ports:</span></p>
            <p><span className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- containerPort: 80</span></p>
          </div>
        </div>

        {/* apiVersion 對比 + 解法 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-xs mb-2">apiVersion 速查</p>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-400 border-b border-slate-600"><th className="pb-1 pr-2 text-left">資源</th><th className="pb-1 text-left">apiVersion</th></tr></thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700"><td className="py-1 pr-2">Pod / Service</td><td className="py-1 text-green-400">v1</td></tr>
                <tr className="border-t border-slate-700"><td className="py-1 pr-2">Deployment / RS</td><td className="py-1 text-yellow-400">apps/v1</td></tr>
                <tr className="border-t border-slate-700"><td className="py-1 pr-2">DaemonSet</td><td className="py-1 text-yellow-400">apps/v1</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-xs mb-2">解法：一行指令加 Pod</p>
            <code className="text-green-400 text-xs">kubectl scale deployment nginx-deploy --replicas=10</code>
            <p className="text-slate-400 text-xs mt-2">K8s 自動建 7 個新 Pod<br/>Scheduler 分散到不同 Node</p>
          </div>
        </div>
      </div>
    ),
    code: `# 現場 demo：scale up，感受 Pod 立刻增加
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods -w
# → 看到新 Pod 從 Pending → ContainerCreating → Running
# → -o wide 確認分散在不同 Node
kubectl get pods -o wide`,
    notes: `【① 課程內容】
裸 Pod（naked Pod）沒有守護機制，刪了就沒了。Deployment 三層結構：Deployment → ReplicaSet（自動建立）→ Pod。第二層 ReplicaSet 永遠在監控 Pod 數量，少了就補，多了就刪；滾動更新時新舊 RS 並存讓服務不中斷；回滾時把舊 RS 的 replicas 從 0 改回目標數量。

Deployment YAML 三個新欄位：replicas（副本數）、selector.matchLabels（認領 Pod 的條件）、template（Pod 的模板）。注意 selector.matchLabels 和 template.metadata.labels 必須完全一致！

apiVersion 差異：Pod/Service 用 v1；Deployment/ReplicaSet/DaemonSet/StatefulSet 用 apps/v1。

背後機制：kubectl scale → API Server → etcd 寫入 → Controller Manager 偵測差異 → Scheduler 分配 Node → kubelet 啟動容器。

【③④ 題目 + 解答】
題目 1【動手觀察 RS】：先確認有一個 nginx Deployment 在跑（replicas=3），執行 'kubectl get rs'，記下 RS 的名稱。接著執行 'kubectl scale deployment nginx-deploy --replicas=5'，再次執行 'kubectl get rs'，說出 RS 的 DESIRED 和 READY 數字有沒有變化。
驗收：能看到同一個 RS 的 DESIRED 從 3 變成 5，說出 "ReplicaSet 就是負責維持副本數的那層"。

題目 2【YAML bug 操作】：把以下有 bug 的 YAML 存成 buggy-deploy.yaml 並 apply，觀察發生什麼錯誤：
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: buggy-deploy
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: web
    template:
      metadata:
        labels:
          app: nginx
      spec:
        containers:
        - name: nginx
          image: nginx:1.25
說出 kubectl apply 的錯誤訊息裡哪一行指出問題所在，並修正 YAML 讓它能正常 apply。
驗收：能讀出 "selector does not match template labels" 錯誤，修正後 READY 變成 3/3。

題目 3【操作確認】：執行 'kubectl explain deployment.spec'，找到 replicas、selector、template 三個欄位，說出每個欄位旁邊的說明是什麼。執行 'kubectl delete deployment buggy-deploy' 清理。
驗收：能執行 explain 指令並找到三個欄位的說明，不用背，會查就行。

[▶ 下一頁]`,
  },

  // ── 5-3（2/3）：縮容 + 水平 vs 垂直 + Docker 對照 + HPA 預告 ──
  {
    title: '縮容 + 水平 vs 垂直擴縮容',
    subtitle: '流量退了 scale 回來 → 省資源省錢',
    section: '5-3：擴縮容概念',
    duration: '7',
    content: (
      <div className="space-y-3">
        {/* 縮容指令 + kubectl get deployments 欄位說明 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">縮容：流量退了，多的 Pod 砍掉省錢</p>
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono mb-2">
              <p className="text-green-400">kubectl scale deployment nginx-deploy --replicas=3</p>
            </div>
            <p className="text-slate-400 text-xs">你只要說「我要 3 個」，K8s 自動砍掉多的 Pod</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-xs mb-2">kubectl get deployments — 欄位說明</p>
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
              <p className="text-slate-500">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;UP-TO-DATE &nbsp;AVAILABLE</p>
              <p className="text-slate-300">nginx-deploy &nbsp;3/3 &nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3</p>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <p><span className="text-green-400">READY</span> <span className="text-slate-400">= 通過就緒探針 / 期望數</span></p>
              <p><span className="text-yellow-400">UP-TO-DATE</span> <span className="text-slate-400">= 已更新到最新模板</span></p>
              <p><span className="text-blue-400">AVAILABLE</span> <span className="text-slate-400">= 健康且可服務</span></p>
            </div>
          </div>
        </div>

        {/* 水平 vs 垂直 */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">水平 vs 垂直擴縮容</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">方式</th>
                <th className="pb-2 pr-4">做法</th>
                <th className="pb-2 pr-4">比喻</th>
                <th className="pb-2">限制</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 text-sm">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-green-400 font-semibold">水平（Horizontal）</td>
                <td className="py-2 pr-4">加 Pod 數量</td>
                <td className="py-2 pr-4">多請幾個廚師</td>
                <td className="py-2 text-green-300">無上限，不重啟</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">垂直（Vertical）</td>
                <td className="py-2 pr-4">加 CPU / 記憶體</td>
                <td className="py-2 pr-4">給廚師更大的鍋</td>
                <td className="py-2 text-red-300">有上限，需重啟</td>
              </tr>
            </tbody>
          </table>
          <p className="text-slate-400 text-xs mt-2">K8s 首選水平擴縮容：無狀態應用加副本即可，理論上可加到數百個</p>
        </div>

        {/* Docker Compose vs K8s 完整對照 + HPA 預告 */}
        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm mb-2">Docker Compose vs K8s Deployment 完整對照</p>
          <table className="w-full text-xs mb-2">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-2">功能</th>
                <th className="pb-1 pr-2 text-blue-300">Docker Compose / Swarm</th>
                <th className="pb-1 text-green-300">K8s Deployment</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 align-top">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-2 text-slate-400">副本數 YAML</td>
                <td className="py-1 pr-2 font-mono"><span className="text-blue-200">deploy:</span><br/><span className="text-blue-200">&nbsp;&nbsp;replicas: 3</span></td>
                <td className="py-1 font-mono"><span className="text-green-200">spec:</span><br/><span className="text-green-200">&nbsp;&nbsp;replicas: 3</span></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-2 text-slate-400">手動擴縮</td>
                <td className="py-1 pr-2 font-mono text-blue-200">docker compose up --scale web=5</td>
                <td className="py-1 font-mono text-green-200">kubectl scale deployment nginx-deploy --replicas=5</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-2 text-slate-400">自我修復</td>
                <td className="py-1 pr-2 text-xs"><span className="text-yellow-300">需設定</span> restart: always<br/><span className="text-slate-400">+ Swarm 才跨節點</span></td>
                <td className="py-1 text-xs"><span className="text-green-400">預設行為</span>，不用設定<br/><span className="text-slate-400">Controller Manager 自動補</span></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-2 text-slate-400">滾動更新</td>
                <td className="py-1 pr-2 font-mono text-blue-200">docker service update --image nginx:1.27 web</td>
                <td className="py-1 font-mono text-green-200">kubectl set image deployment/nginx-deploy nginx=nginx:1.27</td>
              </tr>
            </tbody>
          </table>
          <div className="bg-blue-900/30 border border-blue-500/30 p-2 rounded text-xs">
            <span className="text-blue-300 font-semibold">HPA 預告（第七堂）：</span>
            <span className="text-slate-300"> CPU &gt; 70% 自動加 Pod，退了自動縮 — 全自動，不用手動打指令</span>
          </div>
        </div>
      </div>
    ),
    code: `# 現場 demo：scale down，感受 Pod 立刻減少
kubectl scale deployment nginx-deploy --replicas=2
kubectl get pods -w
# → 多餘的 Pod 被 Terminating → 消失
# → 服務仍然運作，只是少了幾個副本`,
    notes: `【① 課程內容】
縮容：流量退了，多餘的 Pod 佔著資源（雲端佔著費用），用 kubectl scale 縮回來。K8s 自動砍掉多的 Pod，你只需要說「我要幾個」。

水平擴縮容（Horizontal Scaling）：加減副本數量，規格不變。比喻：多請幾個廚師。無狀態應用首選，可以理論上加到幾百個副本。

垂直擴縮容（Vertical Scaling）：加大單個 Pod 的 CPU/記憶體。比喻：給廚師更大的鍋。有硬體上限，通常需要重啟 Pod。

Docker 對照：Docker Compose --scale 只能在單台機器加容器；K8s scale 是跨 Node，每台機器都出力，本質差異。

HPA 預告（第七堂）：CPU 超 70% 自動加 Pod，退了自動縮，全自動不用手動打指令。

【③④ 題目 + 解答】
題目 1【擴縮容操作】：把 nginx-deploy 擴容到 6，執行 'kubectl get pods -o wide'，截圖 NODE 欄位，確認有不同 Node 名稱。計時從執行 scale 指令到 6 個 Pod 全部 Running 花了幾秒。
驗收：截圖或說出 NODE 欄位出現兩個不同 Node 名稱；說出大約幾秒完成。

題目 2【縮容操作】：把 nginx-deploy 縮回 2，執行 'kubectl get pods -w' 觀察 Pod 消失過程，說出被砍掉的 Pod 會先顯示什麼狀態。
驗收：能說出 "Terminating" 這個狀態，等 Pod 消失後確認只剩 2 個 Running。

題目 3【驗收完整指令鏈】：依序執行以下指令，每步說出看到什麼：
  kubectl scale deployment nginx-deploy --replicas=4
  kubectl get deploy
  kubectl get pods -o wide
驗收：get deploy 的 READY 欄位顯示 4/4；get pods -o wide 的 NODE 欄位有不同 Node 名稱。

[▶ 下一頁]`,
  },

  // ── 5-3（3/3）：Labels / Selector 概念 ──
  {
    title: 'Labels 與 Selector：K8s 資源關聯的核心',
    subtitle: 'Deployment 怎麼認領 Pod？靠 selector 找 label',
    section: '5-3：擴縮容概念',
    duration: '8',
    content: (
      <div className="space-y-3">
        {/* Labels 簡介 */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">Labels（標籤）是什麼</p>
          <div className="grid grid-cols-2 gap-3">
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li>附在 K8s 資源上的 <code className="text-green-400">key=value</code> 鍵值對</li>
              <li>完全自訂，本身不影響功能</li>
              <li>靠 <strong className="text-white">Selector</strong> 篩選才發揮作用</li>
            </ul>
            <table className="w-full text-xs">
              <thead><tr className="text-slate-400 border-b border-slate-600"><th className="pb-1 pr-2 text-left">Key</th><th className="pb-1 text-left">範例</th></tr></thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700"><td className="py-0.5 pr-2 text-green-400">app</td><td className="py-0.5">app: nginx</td></tr>
                <tr className="border-t border-slate-700"><td className="py-0.5 pr-2 text-green-400">env</td><td className="py-0.5">env: prod</td></tr>
                <tr className="border-t border-slate-700"><td className="py-0.5 pr-2 text-green-400">tier</td><td className="py-0.5">tier: backend</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 三處 Labels — 正確示範 */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-cyan-400 font-semibold text-sm">YAML 三處 Labels（重點！②③ 必須一致）</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono leading-5">
              <p className="text-slate-400">metadata:</p>
              <p className="text-slate-400">&nbsp;&nbsp;labels:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-300">app: nginx</span> <span className="text-slate-500"># ① Deployment 自己的</span></p>
              <p className="text-slate-400">spec:</p>
              <p className="text-slate-400">&nbsp;&nbsp;selector:</p>
              <p className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;matchLabels:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">app: nginx</span> <span className="text-slate-500"># ② 認領條件</span></p>
              <p className="text-slate-400">&nbsp;&nbsp;template:</p>
              <p className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;metadata:</p>
              <p className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">app: nginx</span> <span className="text-green-400"># ③ Pod 的 label ✓</span></p>
            </div>
            <div className="space-y-2">
              <div className="bg-green-900/30 border border-green-500/40 p-2 rounded text-xs">
                <p className="text-green-400 font-semibold mb-1">② = ③ → 正確</p>
                <p className="text-slate-300">Deployment 能認領自己的 Pod，副本數穩定維持在 replicas 設定值</p>
              </div>
              <div className="bg-red-900/30 border border-red-500/50 p-2 rounded text-xs">
                <p className="text-red-400 font-semibold mb-1">② ≠ ③ → 災難</p>
                <p className="text-slate-300">apply 直接報錯：<code className="text-red-300">selector does not match template labels</code></p>
                <p className="text-slate-300 mt-1">即使繞過 → Deployment 找不到 Pod → 無限補新 Pod → 數量失控</p>
              </div>
              <div className="bg-slate-700/50 p-2 rounded text-xs">
                <p className="text-slate-400 font-semibold mb-1">① 可以和 ②③ 不同</p>
                <p className="text-slate-400">① 是 Deployment 自己的標籤（給外部選用）<br/>②③ 是 Deployment 管 Pod 的契約</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
Labels（標籤）：附在 K8s 資源上的 key=value 鍵值對，完全自訂，不影響功能本身，只是標記。
Selector（選擇器）：用 label 條件篩選一群資源，讓 Deployment 知道哪些 Pod 是自己管的。

Deployment YAML 三處 Labels：
① metadata.labels：Deployment 自己的 label（給外部選這個 Deployment 用）
② spec.selector.matchLabels：認領條件（Deployment 找「自己的 Pod」的 key）
③ spec.template.metadata.labels：Pod 的 label（建出來的 Pod 帶這個標籤）

關係：② 和 ③ 必須完全一致，Deployment 才能認領自己建出的 Pod。① 可以和 ②③ 不同。② ③ 不一致的後果：Deployment 找不到自己的 Pod，以為數量不夠，一直無限建新 Pod，數量失控。

常見 Label Key 慣例：app（應用名稱）、env（環境：prod/staging）、version（版本號）、tier（層級：frontend/backend）。

【③④ 題目 + 解答】
題目 1【YAML bug 操作】：把以下 YAML 存成 label-bug.yaml 並 apply，觀察 Pod 狀態。等 30 秒後執行 'kubectl get pods' 再看一次，說出 Pod 數量有沒有變化，再說明原因：
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: label-bug
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: myapp
    template:
      metadata:
        labels:
          app: other
      spec:
        containers:
        - name: nginx
          image: nginx:1.25
驗收：能說出 apply 時報錯（selector does not match template labels），或觀察到 Pod 不斷被建立而 READY 永遠是 0，說出原因並執行 'kubectl delete deployment label-bug' 清理。

題目 2【正確版操作確認】：把上面 YAML 的 template labels 改成 app: myapp（和 selector 一致），重新 apply，確認 READY 變成 2/2。執行 'kubectl get pods --show-labels'，找到 pod-template-hash 這個 label，說出它是什麼值。
驗收：READY 2/2；能在 --show-labels 輸出中找到 pod-template-hash 的值（一串 hex hash）。執行 'kubectl delete deployment label-bug' 清理。

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-4：擴縮容實作（1 張操作 + 1 張學員實作）
  // ============================================================

  // ── 5-4（1/2）：擴縮容實作示範 ──
  {
    title: '擴縮容實作：完整 9 步操作流程',
    subtitle: 'apply → get deploy/rs/pods → describe → delete pod → scale up/down',
    section: '5-4：擴縮容實作',
    duration: '6',
    content: (
      <div className="space-y-3">
        {/* 9 步操作流程 + 指令輸出 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">9 步完整流程</p>
            <ol className="text-slate-300 text-xs space-y-1.5 list-decimal list-inside">
              <li><code className="text-green-400">kubectl apply -f nginx-deployment.yaml</code></li>
              <li><code className="text-green-400">kubectl get deployments</code> <span className="text-slate-500">← READY/UP-TO-DATE/AVAILABLE</span></li>
              <li><code className="text-green-400">kubectl get replicasets</code> <span className="text-slate-500">← 看 RS 層</span></li>
              <li><code className="text-green-400">kubectl get pods</code></li>
              <li><code className="text-green-400">kubectl get pods -o wide</code> <span className="text-slate-500">← 看 NODE 分散</span></li>
              <li><code className="text-green-400">kubectl describe deployment nginx-deploy</code></li>
              <li><code className="text-green-400">kubectl delete pod &lt;name&gt;</code> <span className="text-slate-500">← 自我修復</span></li>
              <li><code className="text-green-400">kubectl scale deployment nginx-deploy --replicas=5</code></li>
              <li><code className="text-green-400">kubectl scale deployment nginx-deploy --replicas=3</code></li>
            </ol>
          </div>

          {/* 指令輸出範例 */}
          <div className="space-y-2">
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
              <p className="text-slate-500 mb-0.5">$ kubectl get deployments</p>
              <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY &nbsp;UP-TO-DATE &nbsp;AVAILABLE</p>
              <p className="text-green-300">nginx-deploy &nbsp;3/3 &nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3</p>
            </div>
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
              <p className="text-slate-500 mb-0.5">$ kubectl get replicasets</p>
              <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DESIRED &nbsp;CURRENT &nbsp;READY</p>
              <p className="text-purple-300">nginx-deploy-7d6b8f &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3</p>
            </div>
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
              <p className="text-slate-500 mb-0.5">$ kubectl get pods -o wide</p>
              <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;IP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NODE</p>
              <p className="text-slate-300">nginx-deploy-xxx-aaa &nbsp;Running &nbsp;10.42.1.10 &nbsp;k3s-worker1</p>
              <p className="text-slate-300">nginx-deploy-xxx-bbb &nbsp;Running &nbsp;10.42.2.11 &nbsp;k3s-worker2</p>
              <p className="text-slate-300">nginx-deploy-xxx-ccc &nbsp;Running &nbsp;10.42.0.12 &nbsp;k3s-master</p>
            </div>
          </div>
        </div>

        {/* describe 欄位說明 + 重點提醒 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-xs mb-2">kubectl describe deployment — 重要欄位</p>
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono space-y-0.5">
              <p><span className="text-yellow-300">Replicas:</span> <span className="text-slate-300">3 desired | 3 updated | 3 total</span></p>
              <p><span className="text-yellow-300">StrategyType:</span> <span className="text-slate-300">RollingUpdate</span></p>
              <p><span className="text-yellow-300">Events:</span></p>
              <p className="text-slate-300">&nbsp;ScalingReplicaSet 3 → 5</p>
            </div>
          </div>
          <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
            <p className="text-amber-400 font-semibold text-xs mb-2">重點提醒</p>
            <ul className="text-slate-300 text-xs space-y-1 list-disc list-inside">
              <li>scale 對象是 <strong className="text-white">Deployment</strong>，不是 Pod</li>
              <li>刪一個 Pod → 立刻自動補回（自我修復）</li>
              <li>生產環境用 <code className="text-green-400">kubectl scale</code>，不用 kubectl edit</li>
            </ul>
          </div>
        </div>

        {/* 自我修復 AGE 示範 */}
        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-xs mb-2">自我修復實際輸出 — 刪 Pod 後 2 秒自動補回</p>
          <div className="bg-slate-900/70 p-2 rounded text-xs font-mono">
            <p className="text-slate-500 mb-1">$ kubectl delete pod nginx-deploy-7d6b8f-aaa  # 刪掉一個</p>
            <p className="text-slate-500 mb-1">$ kubectl get pods  # 立刻查</p>
            <p className="text-slate-400">NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE</p>
            <p className="text-slate-300">nginx-deploy-7d6b8f-bbb &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10m</p>
            <p className="text-slate-300">nginx-deploy-7d6b8f-ccc &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10m</p>
            <p className="text-green-400 font-bold">nginx-deploy-7d6b8f-ddd &nbsp;ContainerCreating &nbsp;2s &nbsp;&nbsp;<span className="text-yellow-300"># ← 新的！</span></p>
          </div>
          <p className="text-slate-400 text-xs mt-1">AGE 只有 2 秒 — K8s 立刻察覺缺口，Controller Manager 自動補回</p>
        </div>
      </div>
    ),
    code: `# Step 1：apply YAML
kubectl apply -f nginx-deployment.yaml

# Step 2-5：觀察三層結構
kubectl get deployments       # READY 3/3, UP-TO-DATE 3, AVAILABLE 3
kubectl get replicasets       # DESIRED=3 CURRENT=3 READY=3
kubectl get pods
kubectl get pods -o wide      # NODE 欄位確認 Pod 分散到不同節點

# Step 6：查看詳細狀態
kubectl describe deployment nginx-deploy

# Step 7：測試自我修復（刪一個 Pod，看它自動補回）
kubectl delete pod nginx-deploy-xxx-aaa
kubectl get pods              # 立刻出現新 Pod ContainerCreating → Running

# Step 8：擴容到 5
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods -o wide      # 5 個 Pod，NODE 分散

# Step 9：縮容到 3
kubectl scale deployment nginx-deploy --replicas=3
kubectl get pods              # 多的 Pod Terminating，剩 3 個 Running`,
    notes: `【① 課程內容】
實作流程：清掉舊 Deployment → 重建 replicas:3 → 觀察三層結構（Deployment → ReplicaSet → Pod）→ 測試自我修復 → scale 擴縮容 → -o wide 看 Pod 分散不同 Node。

scale 對象是 Deployment，不是 Pod。kubectl edit deployment 也能改 replicas，但容易手誤，生產環境建議用 kubectl scale，更安全明確。

【② 指令講解】
1. 清掉重建
   kubectl delete deployment my-nginx
   kubectl create deployment my-nginx --image=nginx --replicas=3
   打完要看：deployment.apps/my-nginx created

2. 查看三層結構
   kubectl get deployments  → READY: 3/3，UP-TO-DATE: 3，AVAILABLE: 3
   kubectl get rs           → NAME 格式 <Deployment名>-<hash>，DESIRED=3 CURRENT=3 READY=3
   kubectl get pods -o wide → NODE 欄位有不同 Node 名稱（分散！）

3. 測試自我修復
   kubectl delete pod <pod-name>  → 立刻查 kubectl get pods
   打完要看：一個 ContainerCreating 的新 Pod 出現，幾秒後 Running，總數恢復 3

4. 擴容
   kubectl scale deployment my-nginx --replicas=5
   kubectl get pods -o wide  → 多兩個 Pod，NODE 有分散
   kubectl get deploy        → READY: 5/5

5. 縮容
   kubectl scale deployment my-nginx --replicas=2
   kubectl get pods          → 三個 Terminating，最後剩兩個 Running

異常排查：
- READY 一直 0/3：kubectl describe deployment my-nginx 看 Events
- AVAILABLE 小於 READY：Pod 跑起來但健康檢查失敗

【③④ 題目 + 解答】
題目 1【製造並排查 RESTARTS 問題】：部署以下會不斷崩潰的 Pod，等它 RESTARTS 超過 3 次，用三板斧找出原因：
  kubectl run crash-loop --image=busybox -- sh -c "exit 1"
  任務：執行 'kubectl get pod crash-loop'（看 RESTARTS 欄位）→ 'kubectl describe pod crash-loop'（找 Events 和 Exit Code）→ 'kubectl logs crash-loop --previous'（看上次崩潰的輸出）
驗收：能說出 RESTARTS 幾次、Exit Code 是什麼、describe 的 Events 顯示 "Back-off restarting failed container"。執行 'kubectl delete pod crash-loop' 清理。

題目 2【操作確認 deploy 欄位】：執行 'kubectl get deployment nginx-deploy'，依序說出 READY、UP-TO-DATE、AVAILABLE 三個欄位目前的數字和含義。接著執行 'kubectl scale deployment nginx-deploy --replicas=6'，等完成後再執行 'kubectl get deployment nginx-deploy'，說出三個欄位的變化。
驗收：scale 後三個欄位的數字都變成 6/6、6、6。

題目 3【完整擴容 + 分散確認】：把 nginx-deploy 擴容到 6，執行 'kubectl get pods -o wide'，截圖 NODE 欄位，說出每個 Node 上各有幾個 Pod。
驗收：NODE 欄位出現不同 Node 名稱，能說出大約均分在兩個 Node 上。

[▶ 下一頁]`,
  },

  // ── 5-4（2/3）：Lab 1 — 你被叫去救火 ──
  {
    title: 'Lab 1：你被叫去救火',
    subtitle: '新入職工程師接手有 bug 的 YAML，找問題、修好、擴容',
    section: '5-4：擴縮容實作',
    duration: '12',
    content: (
      <div className="space-y-3">
        {/* 情境 + 任務 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
            <p className="text-red-400 font-semibold text-sm mb-1">情境</p>
            <p className="text-slate-300 text-xs">你是新入職的工程師，同事部署的 API 服務設定有問題。這份 YAML 裡有 <strong className="text-white">兩個 bug</strong>，自己找！</p>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-1">任務（依序完成）</p>
            <ol className="text-slate-300 text-xs space-y-0.5 list-decimal list-inside">
              <li>存成 <code className="text-green-400">api-service.yaml</code> → apply</li>
              <li>用指令觀察發生什麼事</li>
              <li>找出兩個 bug，說明原因</li>
              <li>修好 → 重新 apply → READY <strong className="text-white">3/3</strong></li>
              <li>scale 到 <strong className="text-white">5</strong> → -o wide 看 NODE 分散</li>
            </ol>
          </div>
        </div>

        {/* 有 bug 的 YAML */}
        <div>
          <p className="text-slate-400 text-xs mb-1">有 bug 的 YAML（2 個問題，自己找）：</p>
          <div className="bg-slate-900/80 p-3 rounded-lg text-xs font-mono leading-5">
            <div><span className="text-purple-400">apiVersion</span><span className="text-slate-300">: apps/v1</span></div>
            <div><span className="text-purple-400">kind</span><span className="text-slate-300">: Deployment</span></div>
            <div><span className="text-purple-400">metadata</span><span className="text-slate-300">:</span></div>
            <div className="pl-4"><span className="text-purple-400">name</span><span className="text-slate-300">: api-service</span></div>
            <div><span className="text-purple-400">spec</span><span className="text-slate-300">:</span></div>
            <div className="pl-4 bg-red-900/30 border border-red-500/50 rounded px-1 flex items-center gap-2"><span className="text-purple-400">replicas</span><span className="text-slate-300">: </span><span className="text-red-400 font-bold">1</span><span className="bg-red-700/60 text-red-200 text-xs px-1.5 py-0.5 rounded font-sans ml-1">Bug 1：應為 3</span></div>
            <div className="pl-4"><span className="text-purple-400">selector</span><span className="text-slate-300">:</span></div>
            <div className="pl-6"><span className="text-purple-400">matchLabels</span><span className="text-slate-300">:</span></div>
            <div className="pl-8"><span className="text-yellow-300">app: api</span></div>
            <div className="pl-4"><span className="text-purple-400">template</span><span className="text-slate-300">:</span></div>
            <div className="pl-6"><span className="text-purple-400">metadata</span><span className="text-slate-300">:</span></div>
            <div className="pl-8"><span className="text-purple-400">labels</span><span className="text-slate-300">:</span></div>
            <div className="pl-10 bg-red-900/30 border border-red-500/50 rounded px-1 flex items-center gap-2"><span className="text-red-400 font-bold">app: backend</span><span className="bg-red-700/60 text-red-200 text-xs px-1.5 py-0.5 rounded font-sans ml-1">Bug 2：應為 app: api（與 selector 一致）</span></div>
            <div className="pl-6"><span className="text-purple-400">spec</span><span className="text-slate-300">:</span></div>
            <div className="pl-8"><span className="text-purple-400">containers</span><span className="text-slate-300">:</span></div>
            <div className="pl-8"><span className="text-slate-300">- </span><span className="text-purple-400">name</span><span className="text-slate-300">: api</span></div>
            <div className="pl-10"><span className="text-purple-400">image</span><span className="text-slate-300">: nginx:1.25</span></div>
          </div>
        </div>

        {/* 驗收條件 */}
        <div className="bg-slate-800/50 p-2 rounded text-xs">
          <span className="text-cyan-400 font-semibold">驗收：</span>
          <span className="text-slate-300">kubectl get deploy → </span>
          <code className="text-green-400">READY 3/3</code>
          <span className="text-slate-300"> → scale 5 → </span>
          <code className="text-green-400">kubectl get pods -o wide</code>
          <span className="text-slate-300"> → NODE 欄位出現不同節點名稱</span>
        </div>
      </div>
    ),
    code: `# ── 把以下內容存成 api-service.yaml ──
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: api
        image: nginx:1.25

# ── Step 1：apply 並觀察 ──
kubectl apply -f api-service.yaml
kubectl get deploy          # 看 READY 欄位
kubectl get pods            # 看 Pod 狀態
kubectl describe deployment api-service

# ── Step 2：修好後重新 apply ──
kubectl apply -f api-service.yaml

# ── Step 3：驗收 + 擴容 ──
kubectl get deploy          # READY: 3/3
kubectl scale deployment api-service --replicas=5
kubectl get pods -o wide    # 確認 NODE 分散`,
    notes: `【③ 題目（Lab 1：你被叫去救火）】
情境：你是新入職的工程師。同事部署了一個 API 服務但設定有問題，YAML 裡有兩個 bug，自己找。

任務：
1. 把 YAML 存成 api-service.yaml，apply 到叢集
2. 觀察發生什麼事（用學過的指令自己查）
3. 找出兩個 bug，各自說明問題
4. 修好 YAML，重新 apply，讓 READY 變成 3/3
5. kubectl scale 擴到 5，確認 Pod 分散在不同 Node

驗收：kubectl get deploy → READY: 3/3；scale 5 後 kubectl get pods -o wide → NODE 欄位有分散

老師：宣布開始後去巡堂，結束前帶大家看答案，重點說明兩個 bug 的原理。

【④ 解答（Lab 1 詳解）】
Bug 1：selector / label 不一致
- selector.matchLabels.app = api，但 template.metadata.labels.app = backend
- kubectl apply 時報錯：spec.selector does not match template labels
- 即使繞過，Deployment 找不到自己的 Pod，誤以為副本數不足，一直補新 Pod，數量失控

Bug 2：replicas 不足
- replicas: 1，但老闆要求至少 3 個

修復後的 YAML 關鍵部分：
spec:
  replicas: 3           # 改這裡
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api        # 改這裡，和 selector 一致

完整操作：
kubectl apply -f api-service.yaml
kubectl get deploy          # READY: 3/3
kubectl scale deployment api-service --replicas=5
kubectl get pods -o wide    # 看 NODE 欄位
kubectl delete deployment api-service

老師補充說明重點：
- K8s apply 做 validation，selector/template labels 不一致直接報錯，讓學生看 Error 訊息並解讀
- Bug 1 是最常見的 YAML 坑，熟記三處 labels 的關係就能預防
- Bug 2 提醒：replicas 要符合實際需求，不能寫完就不管

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-5：回頭操作 Loop 1（1 張）
  // ============================================================

  {
    title: '回頭操作 Loop 1：擴縮容常見坑',
    subtitle: 'scale 的是 Deployment 不是 Pod、別忘了 -o wide',
    section: '5-5：回頭操作 Loop 1',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">scale 指令格式速記（常考坑）</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-red-900/30 border border-red-500/40 p-2 rounded">
              <p className="text-red-400 font-semibold mb-1">錯誤</p>
              <code className="text-red-300">kubectl scale pod nginx-deploy-xxx --replicas=5</code>
              <p className="text-slate-400 mt-1">Pod 沒有 replicas，會報錯</p>
            </div>
            <div className="bg-green-900/30 border border-green-500/40 p-2 rounded">
              <p className="text-green-400 font-semibold mb-1">正確</p>
              <code className="text-green-300">kubectl scale deployment nginx-deploy --replicas=5</code>
              <p className="text-slate-400 mt-1">scale 對象是 Deployment</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">帶做一遍</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get deploy</code> → 確認 Deployment 存在</li>
            <li><code className="text-green-400">kubectl scale deployment my-httpd --replicas=5</code></li>
            <li><code className="text-green-400">kubectl get pods -o wide</code> → 確認分散</li>
            <li><code className="text-green-400">kubectl scale deployment my-httpd --replicas=1</code></li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">兩個常見坑</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">坑</th>
                <th className="pb-2">正確做法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1</td>
                <td className="py-2 pr-4"><code className="text-red-400">kubectl scale pod xxx</code></td>
                <td className="py-2">scale 對象是 <strong className="text-white">Deployment</strong>，Pod 沒有 replicas</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2</td>
                <td className="py-2 pr-4">只用 <code className="text-red-400">kubectl get pods</code></td>
                <td className="py-2">要加 <code className="text-green-400">-o wide</code> 才看得到 NODE 欄位</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">探索建議</p>
          <p className="text-slate-300 text-sm"><code className="text-green-400">kubectl describe deployment my-httpd</code> → Events 區塊會記錄每次 scale 的紀錄</p>
          <p className="text-slate-400 text-xs mt-1">例如：Scaled up replica set my-httpd-xxxxx to 5 / Scaled down ... to 1</p>
        </div>
      </div>
    ),
    code: `# 回頭操作 Loop 1：常見坑確認
# 確認 Deployment 名稱（scale 的對象是 Deployment，不是 Pod）
kubectl get deploy

# Scale up
kubectl scale deployment my-httpd --replicas=5
kubectl get pods -o wide   # 看 Pod 分散到哪些 Node

# Scale down
kubectl scale deployment my-httpd --replicas=2
kubectl get pods -w   # 看多餘 Pod Terminating`,
    notes: `【① 課程內容】
本節為學生獨立練習後的帶做確認（對應 Lab 1 結束後）。老師帶大家走一遍擴縮容操作，確認每個步驟都做到，並點出兩個常見坑。

Lab 設計邏輯回顧：Bug 1 selector/label 不一致（READY 永遠 0/3）；Bug 2 replicas:1 不足（改成 3）；修好後還要 scale 到 5 確認分散，把 scale 指令練進去。

探索建議：kubectl describe deployment 的 Events 區塊記錄每次 scale 操作，Scaled up/down replica set 的歷史清晰可查，排查問題時很有用。

【② 指令講解（帶做一遍）】
1. 確認 Deployment 存在
   kubectl get deploy
   打完要看：my-httpd，READY 2/2（或你 Lab 用的 api-service）

2. 擴容
   kubectl scale deployment my-httpd --replicas=5
   kubectl get pods -o wide
   打完要看：5 個 Pod Running，NODE 欄位有不同 Node 名稱

3. 縮容
   kubectl scale deployment my-httpd --replicas=1
   kubectl get pods
   打完要看：剩 1 個 Running，其他 Terminating → 消失

4. 探索 Events
   kubectl describe deployment my-httpd
   打完要看 Events 區塊：Scaled up replica set ... to 5 / Scaled down ... to 1

【③④ 題目 + 解答（兩個常見坑）】
坑 1：kubectl scale pod <pod-name>
原因：Pod 沒有 replicas 概念，scale 對象必須是 Deployment
正確做法：kubectl scale deployment <name> --replicas=N

坑 2：只用 kubectl get pods，沒加 -o wide
原因：少了 NODE 欄位，看不到 Pod 分散到哪台 Node
正確做法：kubectl get pods -o wide，確認 NODE 欄位有不同 Node

驗收確認：
- kubectl get deploy → READY: 正確數量/正確數量
- kubectl get pods -o wide → NODE 欄位確實有分散

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-6：滾動更新 + 回滾概念（2 張）
  // ============================================================

  // ── 5-6（1/2）：問題 + 滾動更新四步驟 ──
  {
    title: '滾動更新概念：版本更新不停機',
    subtitle: 'nginx:1.26 → 1.27，逐步替換，任何時刻都有 Pod 在服務',
    section: '5-6：滾動更新 + 回滾概念',
    duration: '8',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
            <p className="text-red-400 font-semibold mb-1 text-sm">傳統停機更新</p>
            <p className="text-slate-300 text-xs">全砍舊 Pod → 建新 Pod</p>
            <p className="text-red-400 text-xs font-bold mt-1">中斷幾秒到幾十秒 ❌</p>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-1 text-sm">滾動更新</p>
            <p className="text-slate-300 text-xs">建一個新的，砍一個舊的，循環</p>
            <p className="text-green-400 text-xs font-bold mt-1">全程有 Pod 在服務 ✅</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">RS 蹺蹺板：新 RS 副本 0→N，舊 RS 副本 N→0</p>
          <div className="font-mono text-xs space-y-1">
            <div className="text-slate-500 mb-1">— 更新進行中 —</div>
            <div className="grid grid-cols-5 text-slate-400 border-b border-slate-700 pb-1 gap-1">
              <span className="col-span-2">NAME</span>
              <span className="text-center">DESIRED</span>
              <span className="text-center">CURRENT</span>
              <span className="text-center">READY</span>
            </div>
            <div className="grid grid-cols-5 text-orange-300 gap-1">
              <span className="col-span-2">nginx-deploy-old-rs</span>
              <span className="text-center">2</span>
              <span className="text-center">2</span>
              <span className="text-center">2</span>
            </div>
            <div className="grid grid-cols-5 text-green-300 gap-1">
              <span className="col-span-2">nginx-deploy-new-rs</span>
              <span className="text-center">1</span>
              <span className="text-center">1</span>
              <span className="text-center">0</span>
            </div>
            <div className="text-slate-500 mt-2 mb-1">— 更新完成 —</div>
            <div className="grid grid-cols-5 text-slate-500 gap-1">
              <span className="col-span-2">nginx-deploy-old-rs</span>
              <span className="text-center">0</span>
              <span className="text-center">0</span>
              <span className="text-center">0</span>
            </div>
            <div className="grid grid-cols-5 text-green-300 gap-1">
              <span className="col-span-2">nginx-deploy-new-rs</span>
              <span className="text-center">3</span>
              <span className="text-center">3</span>
              <span className="text-center">3</span>
            </div>
            <p className="text-amber-400 text-xs mt-1">↑ 舊 RS 副本歸零但保留 — 這是回滾備份</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">更新策略參數（replicas=3 範例）</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/70 p-2 rounded text-xs font-mono leading-5">
              <p className="text-slate-400">spec:</p>
              <p className="text-slate-400">&nbsp;&nbsp;strategy:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">type: RollingUpdate</span></p>
              <p className="text-slate-400">&nbsp;&nbsp;&nbsp;&nbsp;rollingUpdate:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">maxSurge: 1</span></p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">maxUnavailable: 0</span></p>
            </div>
            <table className="w-full text-xs self-start">
              <thead>
                <tr className="text-slate-400 border-b border-slate-600">
                  <th className="pb-1 pr-3 text-left">參數</th>
                  <th className="pb-1 pr-3 text-left">預設</th>
                  <th className="pb-1 text-left">效果</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-yellow-400 font-mono">maxSurge</td>
                  <td className="py-1 pr-3">25%</td>
                  <td className="py-1">最多超出 <strong className="text-white">1</strong> 個（無條件進位）→ 同時最多 <strong className="text-white">4</strong> 個 Pod</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1 pr-3 text-yellow-400 font-mono">maxUnavailable</td>
                  <td className="py-1 pr-3">25%</td>
                  <td className="py-1">最多允許 <strong className="text-white">0</strong> 個不可用（無條件捨去 0.75→0）→ 全程不少於 <strong className="text-white">3</strong> 個</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 p-2 rounded text-xs text-slate-300">
          <span className="text-amber-400 font-bold">回滾：</span>
          <code className="text-green-400 mx-1">kubectl rollout undo deployment/&lt;name&gt;</code>
          <span>→ 舊 RS 重新擴容，預設保留 10 個歷史版本</span>
        </div>
      </div>
    ),
    notes: `【① 課程內容】
停機更新的問題：傳統做法先全部砍掉舊 Pod 再建新 Pod，中間服務中斷。使用者看到 502/503，電商幾秒 = 幾萬損失。

滾動更新（Rolling Update）流程：核心原則「建一個新的，砍一個舊的」不斷循環。全程至少有一個 Pod 在服務，零停機。K8s 預設策略就是 Rolling Update，不用特別設定。

底層機制 ReplicaSet 蹺蹺板：Deployment 建新 ReplicaSet（RS）。新 RS 副本數 0→1→2→N，舊 RS 副本數 N→...→0。用 kubectl get rs 觀察這個現象。

舊 ReplicaSet 為什麼保留？更新完成後舊 RS 副本數歸零但物件還在，這是「回滾備份」，需要回滾時直接把舊 RS 擴容，速度極快。

更新策略參數：
- maxSurge（預設 25%）：更新過程中最多可超出期望副本數幾個（無條件進位）
- maxUnavailable（預設 25%）：最多允許幾個 Pod 不可用（無條件捨去）
- 範例：3 個副本時 maxSurge=1（最多 4 個），maxUnavailable=0（不允許任何不可用）

回滾機制：kubectl rollout undo deployment/<name> → 舊 RS 副本數重新增加，新 RS 縮減回 0。K8s 預設保留 10 個歷史版本（spec.revisionHistoryLimit）。

Docker 對照：Docker Compose docker-compose up 是直接替換，沒有原生滾動更新。K8s 把這件事做成一等公民，開箱即用。

【② 指令講解】
現場示範兩件事：

① 自訂 maxSurge / maxUnavailable，感受「更新中多一個 Pod」
kubectl patch deployment nginx-deploy --patch '{"spec":{"strategy":{"rollingUpdate":{"maxSurge":1,"maxUnavailable":0}}}}'
→ patch 是用 JSON 或 YAML 局部更新資源，不需要改 YAML 重 apply
kubectl set image deployment/nginx-deploy nginx=nginx:1.27
kubectl get pods -w
→ watch 更新過程：看到短暫出現 4 個 Pod（3 期望 + 1 maxSurge），沒有任何 Pod 先被砍（maxUnavailable=0）

② 查歷史版本
kubectl rollout history deployment/nginx-deploy
→ 看到 REVISION 欄位，數字越大越新
kubectl rollout history deployment/nginx-deploy --revision=1
→ 看某個版本的詳細資訊（包含 image 版本）
kubectl rollout undo deployment/nginx-deploy --to-revision=1
→ 回滾到指定版本（不是只回「上一版」）

【③④ 題目 + 解答】
題目 1【RS 蹺蹺板觀察】：確認有 nginx-deploy（replicas=3）在跑，執行以下指令並在另一個 terminal 持續觀察 RS 變化：
  觀察：kubectl get rs -w
  觸發更新：kubectl set image deployment/nginx-deploy nginx=nginx:1.27
說出更新進行中看到幾個 RS、舊 RS 的 DESIRED 如何變化、新 RS 的 DESIRED 如何變化。更新完成後 RS 各自的 DESIRED 是幾？
驗收：能說出更新中出現兩個 RS，舊 RS DESIRED 逐步降到 0，新 RS DESIRED 逐步升到 3，更新完舊 RS DESIRED=0 但物件還在。

題目 2【故意設壞版本觀察 RS 行為】：執行 'kubectl set image deployment/nginx-deploy nginx=nginx:0.0.1'，等 30 秒後執行 'kubectl get rs'，說出此時有幾個 RS、各自的 DESIRED 是什麼，再說出舊 Pod 為什麼還活著。
驗收：能說出舊 RS 的 Pod 還在 Running（K8s 沒有全砍），新 RS 的 Pod 卡在 ImagePullBackOff，這就是滾動更新的安全設計。執行 'kubectl rollout undo deployment/nginx-deploy' 恢復。

[▶ 下一頁]`,
    code: `# 現場示範：自訂 maxSurge / maxUnavailable
# 先確認有一個 nginx Deployment 在跑（replicas: 3）
kubectl get deploy nginx-deploy

# 套用自訂策略（maxSurge=1, maxUnavailable=0）
kubectl patch deployment nginx-deploy --patch '
spec:
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0'

# 觸發更新，watch Pod 數量變化
kubectl set image deployment/nginx-deploy nginx=nginx:1.27
kubectl get pods -w
# → 更新期間最多 4 個 Pod 同時存在（3 + maxSurge 1）
#   不會有任何一個 Pod 先被砍（maxUnavailable 0）

# 查歷史版本
kubectl rollout history deployment/nginx-deploy
# → 看到 REVISION 1 / 2，CHANGE-CAUSE 欄位

# 看某個版本的詳細資訊
kubectl rollout history deployment/nginx-deploy --revision=1

# 回滾到指定版本
kubectl rollout undo deployment/nginx-deploy --to-revision=1`,
  },

  // ── 5-6（2/2）：回滾 + 指令總覽 + Docker 對照 ──
  {
    title: '回滾：一行指令退回上一版',
    subtitle: 'rollout undo → 舊 ReplicaSet 重新擴容，預設保留 10 個版本',
    section: '5-6：滾動更新 + 回滾概念',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">回滾原理</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>舊 RS 沒被刪，只是副本歸零 → 回滾 = 把舊 RS 重新擴容</li>
            <li>舊 Image 在本機快取 → 回滾速度極快（通常幾十秒）</li>
            <li><code className="text-green-400">revisionHistoryLimit</code> 預設保留 <strong className="text-white">10</strong> 個版本</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">滾動更新 + 回滾指令總覽</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">操作</th>
                <th className="pb-2">指令</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">觸發滾動更新</td>
                <td className="py-2"><code className="text-green-400">kubectl set image deployment/名稱 容器名=新image</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">看更新進度</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout status deployment/名稱</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">回滾到上一版</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout undo deployment/名稱</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">回滾到指定版本</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout undo --to-revision=N</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">看歷史版本</td>
                <td className="py-2"><code className="text-green-400">kubectl rollout history deployment/名稱</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">Docker 對照</p>
          <p className="text-slate-300 text-sm">Docker / Docker Compose <strong className="text-red-400">沒有</strong>內建滾動更新。<code className="text-slate-400">docker compose up -d</code> = 砍舊建新，中間有空窗。K8s 的滾動更新是生產環境標配。</p>
        </div>
      </div>
    ),
    code: `# 現場 demo：看 rollout history + 舊 RS 沒有消失
kubectl rollout history deployment/nginx-deploy
# → REVISION 1 / 2，記下版本號

# 看舊 RS 還在（副本歸零但沒刪）
kubectl get rs
# → 舊 RS DESIRED=0 CURRENT=0，新 RS DESIRED=3

# 回滾到上一版
kubectl rollout undo deployment/nginx-deploy
kubectl get pods -w   # 看切換過程

# 精確回到指定版本
kubectl rollout undo deployment/nginx-deploy --to-revision=1`,
    notes: `【① 課程內容】
本張投影片重點：回滾原理 + 指令總覽 + Docker 對照。

回滾原理：舊 RS 沒被刪，只是副本歸零 → 回滾 = 把舊 RS 重新擴容。舊 Image 在本機快取 → 回滾速度極快（通常幾十秒）。revisionHistoryLimit 預設保留 10 個版本。

指令總覽：
- 觸發滾動更新：kubectl set image deployment/名稱 容器名=新image
- 看更新進度：kubectl rollout status deployment/名稱
- 回滾到上一版：kubectl rollout undo deployment/名稱
- 回滾到指定版本：kubectl rollout undo --to-revision=N
- 看歷史版本：kubectl rollout history deployment/名稱

Docker 對照：Docker Compose docker-compose up -d = 砍舊建新，中間有空窗期。K8s 的滾動更新是生產環境標配。

【② 指令講解】
（本節為概念補充，詳細指令逐步說明在 5-7 實作。）

【③④ 題目 + 解答】
題目 1【rollout undo 觀察】：假設目前 nginx-deploy 跑的是 nginx:1.27，執行 'kubectl rollout undo deployment/nginx-deploy'，在另一個 terminal 同時觀察 'kubectl get rs -w'，說出 undo 後舊 RS 和新 RS 的 DESIRED 數字如何變化。完成後執行 'kubectl describe deployment nginx-deploy | grep Image' 確認 image 版本。
驗收：能說出 undo 後舊 RS DESIRED 從 0 升回 3，新 RS DESIRED 從 3 降回 0，最後 image 回到 nginx:1.25（或上一版）。

題目 2【精確回滾操作】：建立三個版本的歷史：
  kubectl set image deployment/nginx-deploy nginx=nginx:1.25
  kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="v1: baseline" --overwrite
  kubectl set image deployment/nginx-deploy nginx=nginx:1.27
  kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="v2: upgrade" --overwrite
  kubectl set image deployment/nginx-deploy nginx=nginx:0.0.1
  kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="v3: bad deploy" --overwrite
然後執行 'kubectl rollout history deployment/nginx-deploy'，找到 v1 的 revision 號，用 --to-revision 精確回滾，確認 image 回到 nginx:1.25。
驗收：執行 'kubectl describe deployment nginx-deploy | grep Image' 確認 Image: nginx:1.25。

[▶ 下一頁]`,
  },

          <ol className="text-slate-300 text-xs space-y-1.5 list-decimal list-inside">
            <li><code className="text-green-400">kubectl describe deployment nginx-deploy | grep Image</code> — 確認目前版本 <span className="text-slate-500">→</span> <code className="text-cyan-300">Image: nginx:1.25</code></li>
            <li><code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:1.28</code> — 觸發更新 <span className="text-slate-500">→</span> <code className="text-cyan-300">image updated</code></li>
            <li><code className="text-green-400">kubectl rollout status deployment/nginx-deploy</code> — 即時看進度（見下方輸出）</li>
            <li><code className="text-green-400">kubectl get rs</code> — 看 RS 蹺蹺板 <span className="text-slate-500">→ 舊 DESIRED=0，新 DESIRED=3</span></li>
            <li><code className="text-green-400">kubectl rollout history deployment/nginx-deploy</code> — 查歷史 <span className="text-slate-500">→ REVISION / CHANGE-CAUSE</span></li>
            <li><code className="text-green-400">kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"</code> <span className="text-slate-500">→</span> <code className="text-cyan-300">annotated</code></li>
            <li><code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9</code> — 故意失敗</li>
            <li><code className="text-green-400">kubectl get pods</code> — 新 Pod <code className="text-red-400">ImagePullBackOff</code>，舊 Pod 仍 <code className="text-green-400">Running</code></li>
            <li><code className="text-green-400">kubectl rollout undo deployment/nginx-deploy</code> — 回滾上一版 <span className="text-slate-500">→</span> <code className="text-cyan-300">rolled back</code></li>
            <li><code className="text-green-400">kubectl rollout undo deployment/nginx-deploy --to-revision=1</code> — 指定版本回滾</li>
          </ol>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">完整操作流程</p>
          <ol className="text-slate-300 text-xs space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl describe deployment nginx-deploy | grep Image</code> — 確認目前版本</li>
            <li><code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:1.28</code> — 觸發更新</li>
            <li><code className="text-green-400">kubectl rollout status deployment/nginx-deploy</code> — 即時看進度</li>
            <li><code className="text-green-400">kubectl get rs</code> — 看 RS 蹺蹺板</li>
            <li><code className="text-green-400">kubectl rollout history deployment/nginx-deploy</code> — 查歷史</li>
            <li><code className="text-green-400">kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"</code> — 補記錄</li>
            <li><code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9</code> — 故意失敗</li>
            <li><code className="text-green-400">kubectl get pods</code> — 看 ImagePullBackOff（舊 Pod 仍 Running）</li>
            <li><code className="text-green-400">kubectl rollout undo deployment/nginx-deploy</code> — 回滾上一版</li>
            <li><code className="text-green-400">kubectl rollout undo deployment/nginx-deploy --to-revision=1</code> — 指定版本回滾</li>
          </ol>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1 text-sm">rollout status 輸出範例</p>
          <div className="font-mono text-xs space-y-0.5">
            <p className="text-orange-300">Waiting for deployment "nginx-deploy" rollout to finish: 1 out of 3 new replicas have been updated...</p>
            <p className="text-yellow-300">Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...</p>
            <p className="text-green-400">deployment "nginx-deploy" successfully rolled out</p>
          </div>
          <p className="text-slate-500 text-xs mt-1">Ctrl+C 只停止「看」，更新仍繼續進行</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 p-2 rounded text-xs text-slate-300">
          <span className="text-amber-400 font-bold">坑：</span>rollout history 的 CHANGE-CAUSE 預設是 <code className="text-slate-400">(none)</code>，需用 <code className="text-green-400">annotate</code> 補記錄，否則事故時不知道哪個版本是好的
        </div>
      </div>
    ),
    code: `# 1. 確認目前版本
kubectl describe deployment nginx-deploy | grep Image

# 2. 觸發滾動更新
kubectl set image deployment/nginx-deploy nginx=nginx:1.28

# 3. 即時觀察進度
kubectl rollout status deployment/nginx-deploy
# Waiting for deployment "nginx-deploy" rollout to finish: 1 out of 3 new replicas have been updated...
# Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
# deployment "nginx-deploy" successfully rolled out

# 4. 看 RS 蹺蹺板
kubectl get rs
# → 更新中：舊 RS DESIRED=2, 新 RS DESIRED=1
# → 完成後：舊 RS DESIRED=0（保留備回滾），新 RS DESIRED=3

# 5. 查歷史 + 補記錄
kubectl rollout history deployment/nginx-deploy
kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"

# 6. 故意用不存在的版本
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
kubectl get pods
# → 新 Pod: ImagePullBackOff，舊 Pod 仍然 Running

# 7. 回滾
kubectl rollout undo deployment/nginx-deploy             # 回上一版
kubectl rollout undo deployment/nginx-deploy --to-revision=1  # 指定版本`,
    notes: `【① 課程內容】
實作目標：把 nginx-deploy 從目前版本更新到 nginx:1.28，觀察滾動更新蹺蹺板，故意更新成錯誤版本練習回滾，使用 --to-revision 指定版本回滾。

操作順序：確認目前 image 版本 → 觸發更新並即時觀察 rollout 狀態 → 看 RS 副本數變化（蹺蹺板）→ 查歷史版本 → 故意設定不存在的 image 版本 → 觀察 ImagePullBackOff → 執行 rollout undo 回滾 → 確認服務恢復。

注意事項：kubectl set image 和 kubectl edit 都能觸發滾動更新。rollout status 會持續輸出直到完成，Ctrl+C 中斷只是停止「看」，更新仍繼續。rollout history 預設 CHANGE-CAUSE 是 <none>，需用 annotate 補記錄。--to-revision=0 等於 undo（回上一版），不是第一版。

【② 指令講解】
確認目前版本：kubectl describe deployment nginx-deploy | grep Image
→ describe deployment nginx-deploy：查看 Deployment 詳細資訊；| grep Image：只過濾出含 Image 的那行
→ 打完要看：Image: nginx:1.25
→ 異常：輸出空白 → Deployment 名稱打錯，用 kubectl get deployment 確認

觸發滾動更新：kubectl set image deployment/nginx-deploy nginx=nginx:1.28
→ set image：更新指定 Deployment 的 container image；nginx=nginx:1.28 格式是「容器名稱=新 image」
→ 打完要看：deployment.apps/nginx-deploy image updated（只代表接受指令，不代表完成）
→ 異常：Error from server (NotFound) → 名稱錯誤；unable to find container named "nginx" → 容器名稱打錯

即時觀察更新：kubectl rollout status deployment/nginx-deploy
→ 打完要看：逐步輸出直到 successfully rolled out
→ 異常：卡著不動超過 2 分鐘 → 開另一個 terminal 跑 kubectl get pods 查狀態；exceeded its progress deadline → 超時需 undo；Ctrl+C 中斷輸出不影響更新繼續進行

觀察 RS 蹺蹺板：kubectl get rs
→ 更新進行中：看到兩個 RS，舊 RS DESIRED 在減少，新 RS DESIRED 在增加
→ 更新完成後：舊 RS DESIRED=0 但物件還在（這是回滾備份）

查歷史：kubectl rollout history deployment/nginx-deploy
→ REVISION 數字越大越新；CHANGE-CAUSE 預設是 <none>

補記原因：kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"
→ 異常：--overwrite is false → 加 --overwrite 旗標；annotation 加在 Deployment，不在 Pod

故意製造壞更新：kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
→ 打完要看：指令本身成功，但 Pod 會 ImagePullBackOff

觀察失敗 Pod：kubectl get pods
→ 舊 Pod 還在 Running，新 Pod 卡在 ImagePullBackOff

回滾上一版：kubectl rollout undo deployment/nginx-deploy
→ 打完要看：deployment.apps/nginx-deploy rolled back
→ 連做兩次 undo 會在最後兩個版本之間來回跳

回滾指定版本：kubectl rollout undo deployment/nginx-deploy --to-revision=1
→ 異常：unable to find specified revision → revision 不存在或超過 revisionHistoryLimit

【③④ 題目 + 解答】
題目 1【觀察失敗更新的 Pod 行為】：依序執行以下指令，說出每步看到什麼：
  kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
  （等 15 秒）
  kubectl get pods
  kubectl get rs
說出：新 Pod 的 STATUS 是什麼？舊 Pod 還活著嗎？新 RS 的 READY 是幾？為什麼 K8s 沒有繼續砍舊 Pod？
驗收：能說出新 Pod STATUS = ImagePullBackOff，舊 Pod 仍 Running，K8s 發現新 Pod 不健康所以暫停，不會繼續砍舊 Pod。

題目 2【rollout undo 連跑兩次實驗】：確認目前叢集有多個 revision 歷史，執行 'kubectl rollout history deployment/nginx-deploy' 記下 revision 號。然後連續執行兩次 'kubectl rollout undo deployment/nginx-deploy'（中間等每次完成），每次之後執行 'kubectl describe deployment nginx-deploy | grep Image'，說出兩次 undo 後分別停在哪個 image 版本。
驗收：能說出兩次 undo 在最後兩個版本之間來回切換，並說明為什麼（"undo 總是回到上一版，但上一版的定義會隨每次 undo 而改變"）。執行 'kubectl rollout undo deployment/nginx-deploy --to-revision=1' 恢復到最初版本。

[▶ 下一頁]`,
  },

  // ── 5-7（2/2）：學員實作題目 ──
  {
    title: '學員實作：滾動更新 + 回滾練習',
    subtitle: '必做：完整流程 | 挑戰：故意更新到不存在的版本',
    section: '5-7：滾動更新實作',
    duration: '10',
    content: (
      <div className="space-y-3">
        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-2 text-sm">必做題：完整滾動更新 + 回滾流程</p>
          <ol className="text-slate-300 text-xs space-y-1 list-decimal list-inside">
            <li>建 <code className="text-green-400">nginx:1.26</code> Deployment, replicas:3</li>
            <li><code className="text-green-400">set image</code> 更新到 <strong className="text-white">nginx:1.28</strong></li>
            <li><code className="text-green-400">rollout status</code> — 看到 successfully rolled out</li>
            <li><code className="text-green-400">get rs</code> — 確認兩個 RS（一個 3/3，一個 0/0）</li>
            <li><code className="text-green-400">rollout history</code> — 查版本歷史</li>
            <li><code className="text-green-400">rollout undo</code> — 回滾</li>
            <li><code className="text-green-400">describe | grep Image</code> — 確認回到 1.26</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2 text-sm">挑戰題：故意用不存在的版本 + 精確回滾</p>
          <ol className="text-slate-300 text-xs space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9</code></li>
            <li><code className="text-green-400">kubectl get pods</code> → 新 Pod 狀態 <code className="text-red-400">ImagePullBackOff</code></li>
            <li>注意：<strong className="text-white">舊 Pod 還活著</strong>（滾動更新的安全機制）</li>
            <li><code className="text-green-400">kubectl rollout history</code> → 找到正確版本的 revision 號</li>
            <li><code className="text-green-400">kubectl rollout undo deployment/nginx-deploy --to-revision=1</code> → 精確回滾</li>
          </ol>
          <p className="text-slate-400 text-xs mt-2">實際工作常見：打錯 Image tag → rollout undo 一行搞定</p>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
          驗收：<code className="text-green-400">kubectl get pods</code> 全 Running｜<code className="text-green-400">describe | grep Image</code> 確認版本
        </div>
      </div>
    ),
    code: `# 必做：完整流程
kubectl create deployment nginx-deploy --image=nginx:1.26 --replicas=3
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
kubectl rollout status deployment/nginx-deploy
kubectl get rs
kubectl rollout history deployment/nginx-deploy
kubectl rollout undo deployment/nginx-deploy
kubectl describe deployment nginx-deploy | grep Image

# 挑戰：故意用不存在的版本 + 精確回滾
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
kubectl get pods              # ImagePullBackOff（舊 Pod 還活著）
kubectl rollout history deployment/nginx-deploy   # 找正確 revision
kubectl rollout undo deployment/nginx-deploy --to-revision=1
kubectl get pods              # 確認全 Running`,
    notes: `【① 課程內容】
本張為學員實作題目頁。必做題完整流程：建 nginx:1.26 Deployment replicas:3 → set image 更新到 1.27 → rollout status 看更新過程 → get rs 確認兩個 ReplicaSet → rollout undo 回滾 → describe | grep Image 確認回到 1.26。

挑戰題：故意用不存在的版本 nginx:99.99，觀察 ImagePullBackOff，注意舊 Pod 還活著（滾動更新的安全機制），再用 rollout undo 救回來。實際工作常見：打錯 Image tag → rollout undo 一行搞定。

【② 指令講解】
（本頁為學員實作，指令已在 5-7 第一張詳細說明。）

【③④ 題目 + 解答】
必做題解答：
1. kubectl create deployment nginx-deploy --image=nginx:1.26 --replicas=3
2. kubectl set image deployment/nginx-deploy nginx=nginx:1.28（依版本調整）
3. kubectl rollout status deployment/nginx-deploy（看到 successfully rolled out）
4. kubectl get rs（看到兩個 RS，一個 3/3，一個 0/0）
5. kubectl rollout undo deployment/nginx-deploy
6. kubectl describe deployment nginx-deploy | grep Image（確認回到舊版）

挑戰題解答：
- kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9 → 指令成功但 Pod 拉不到 image
- kubectl get pods → 新 Pod 狀態 ImagePullBackOff，舊 Pod 仍然 Running
- 重點觀察：K8s 不會把舊 Pod 全砍，滾動更新偵測到新 Pod 不健康，暫停替換
- kubectl rollout undo deployment/nginx-deploy → 壞掉的新 Pod 被砍，舊 Pod 恢復

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ============================================================
  // 5-8：回頭操作 Loop 2（2 張：帶做 + Lab 2 情境題）
  // ============================================================

  // ── 5-8（1/2）：帶做 + 常見坑 + 上午小結 ──
  {
    title: '回頭操作 Loop 2 + 前兩個 Loop 小結',
    subtitle: 'set image → rollout status → get rs → rollout undo 四指令帶做',
    section: '5-8：回頭操作 Loop 2',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">帶做一遍（四個指令）</p>
          <ol className="text-slate-300 text-xs space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl set image deployment/nginx-deploy nginx=nginx:1.28</code> — 觸發更新</li>
            <li><code className="text-green-400">kubectl rollout status deployment/nginx-deploy</code> — 看進度</li>
            <li><code className="text-green-400">kubectl rollout history deployment/nginx-deploy</code> — 查歷史，記下 revision 號</li>
            <li><code className="text-green-400">kubectl rollout undo deployment/nginx-deploy --to-revision=1</code> — 精確回滾</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-2 text-sm">兩個常見坑</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-3">#</th>
                <th className="pb-1 pr-3">坑</th>
                <th className="pb-1">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-red-400 font-bold">1</td>
                <td className="py-1 pr-3">set image 搞混容器名</td>
                <td className="py-1">等號前是<strong className="text-white">容器名</strong>，不是 Deployment 名</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-red-400 font-bold">2</td>
                <td className="py-1 pr-3">rollout undo 以為回初始版</td>
                <td className="py-1">undo = 回<strong className="text-white">上一版</strong>，精確指定用 <code className="text-yellow-400">--to-revision=N</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-2 text-sm">前兩個 Loop 因果鏈</p>
          <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">minikube 只有 1 Node</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">k3s 多節點</span>
            <span className="text-slate-500">→</span>
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">流量暴增</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">擴縮容</span>
            <span className="text-slate-500">→</span>
            <span className="bg-red-900/40 text-red-300 px-2 py-0.5 rounded">版本更新</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-2 py-0.5 rounded">滾動更新+回滾</span>
          </div>
        </div>
      </div>
    ),
    code: `# 回頭操作 Loop 2：滾動更新完整流程
# 確認目前版本
kubectl rollout history deployment/nginx-deploy

# 觸發更新
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
kubectl rollout status deployment/nginx-deploy

# 回滾到上一版
kubectl rollout undo deployment/nginx-deploy

# 回滾到指定版本
kubectl rollout undo deployment/nginx-deploy --to-revision=1
kubectl rollout history deployment/nginx-deploy`,
    notes: `【① 課程內容】
本節目標：先帶做一遍滾動更新三指令（5 分鐘），再給學生做 Lab 2 情境題（15 分鐘）：版本事故，強制用 --to-revision 精確回滾。

帶做順序：
1. kubectl set image 觸發更新
2. kubectl rollout status 看進度
3. kubectl rollout undo 回滾（帶做）
4. kubectl rollout history 查歷史（帶做）
5. kubectl rollout undo --to-revision=<n> 指定版本（帶做）

兩個常見坑：
- 坑 1：set image 搞混容器名。等號前面是容器名稱，不是 Deployment 名稱。容器名稱在 spec.template.spec.containers 的 name 欄位，用 kubectl create deployment 建的預設跟 image 名稱相同。
- 坑 2：rollout undo 以為回初始版。undo = 回上一版，不是回到最開始。要精確回到某個版本，用 --to-revision 指定 revision 號。

【② 指令講解】
（本節複習已學指令，無新指令，重點在組合應用。）

【③④ 題目 + 解答】
題目【真實操作找版本 + 精確回滾】：執行以下指令建立三版歷史後，找到 httpd:2.4 對應的 revision 號，用 --to-revision 精確回滾，確認服務恢復：
  kubectl create deployment rev-test --image=httpd:2.4 --replicas=2
  kubectl annotate deployment rev-test kubernetes.io/change-cause="v1: httpd 2.4"
  kubectl set image deployment/rev-test httpd=httpd:2.4.58
  kubectl annotate deployment rev-test kubernetes.io/change-cause="v2: httpd 2.4.58" --overwrite
  kubectl set image deployment/rev-test httpd=httpd:99.99.99
  kubectl annotate deployment rev-test kubernetes.io/change-cause="v3: bad update" --overwrite
任務：
  1. 執行 'kubectl rollout history deployment/rev-test'，找到 v1 的 revision 號
  2. 執行 'kubectl rollout undo deployment/rev-test --to-revision=<v1 revision 號>'
  3. 執行 'kubectl describe deployment rev-test | grep Image' 確認回到 httpd:2.4
  4. 執行 'kubectl delete deployment rev-test' 清理
驗收：步驟 3 輸出為 "Image: httpd:2.4"。說出為什麼不用 rollout undo 不帶參數（目前在 v3，undo 只回 v2 還是壞的）。

[▶ 下一頁]`,
  },

  // ── 5-8（2/2）：Lab 2 — 版本事故（深夜 11 點）──
  {
    title: 'Lab 2：版本事故（深夜 11 點）',
    subtitle: '有人推了壞版本，服務正在掛掉，不准用 rollout undo 不帶參數',
    section: '5-8：回頭操作 Loop 2',
    duration: '15',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">情境</p>
          <p className="text-slate-300 text-sm">深夜 11 點，你收到警報。有人把 API 更新到壞掉的版本，服務正在掛掉。不准用 <code className="text-red-400">rollout undo</code> 不帶參數，你要找到正確版本精確回滾。</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">準備環境（依序執行）</p>
          <div className="text-xs font-mono space-y-1">
            <div><span className="text-green-400">kubectl create deployment</span> night-api --image=<span className="text-cyan-300">httpd:2.4</span> --replicas=2</div>
            <div><span className="text-green-400">kubectl annotate deployment</span> night-api kubernetes.io/change-cause=<span className="text-cyan-300">"v1: 正常版本"</span></div>
            <div><span className="text-green-400">kubectl rollout status</span> deployment/night-api</div>
            <div><span className="text-green-400">kubectl set image</span> deployment/night-api httpd=<span className="text-cyan-300">httpd:99.99.99</span></div>
            <div><span className="text-green-400">kubectl annotate deployment</span> night-api kubernetes.io/change-cause=<span className="text-cyan-300">"v2: 緊急更新（錯誤版本）"</span> --overwrite</div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">任務（不給指令提示，自己想）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認目前 Pod 壞掉的狀態</li>
            <li>查部署歷史，找到哪個版本是正常的 <code className="text-cyan-300">httpd:2.4</code></li>
            <li>回滾到那個版本（<strong className="text-red-400">不准用</strong> <code className="text-red-400">rollout undo</code> 不帶參數）</li>
            <li>驗證 Pod 全部 Running，確認現在跑的是 <code className="text-cyan-300">httpd:2.4</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
          驗收：<code className="text-green-400">kubectl get pods</code> 全 Running ｜ 說出你用哪個指令確認 image 版本
        </div>
      </div>
    ),
    code: `# 準備環境（照順序貼上執行）
kubectl create deployment night-api --image=httpd:2.4 --replicas=2
kubectl annotate deployment night-api kubernetes.io/change-cause="v1: 正常版本"
kubectl rollout status deployment/night-api
kubectl set image deployment/night-api httpd=httpd:99.99.99
kubectl annotate deployment night-api kubernetes.io/change-cause="v2: 緊急更新（錯誤版本）" --overwrite

# 你的任務從這裡開始（自己找指令）
# 清理
kubectl delete deployment night-api`,
    notes: `【① 課程內容】
Lab 2 情境：深夜 11 點收到警報，有人把 API 更新到壞掉的版本，服務正在掛掉。不准用 rollout undo 不帶參數，要找到正確版本精確回滾。

準備環境（學生自己跑）：
1. kubectl create deployment night-api --image=httpd:2.4 --replicas=2
2. kubectl annotate deployment night-api kubernetes.io/change-cause="v1: 正常版本"
3. kubectl rollout status deployment/night-api
4. kubectl set image deployment/night-api httpd=httpd:99.99.99
5. kubectl annotate deployment night-api kubernetes.io/change-cause="v2: 緊急更新（錯誤版本）" --overwrite

任務（不給指令提示，自己想）：確認 Pod 壞掉狀態 → 查部署歷史找正常版本 → 回滾到那個版本（不准用 rollout undo 不帶參數）→ 驗證 Pod 全 Running 且跑 httpd:2.4。

【② 指令講解】
（Lab 不給指令提示，考驗學員能否組合 rollout history + --to-revision 解決問題。）

【③④ 題目 + 解答（Lab 2 完整詳解）】
Step 1：確認 Pod 狀態
kubectl get pods  → 看到 ErrImagePull 或 ImagePullBackOff
kubectl get deploy  → READY: 0/2 或 1/2

Step 2：查部署歷史
kubectl rollout history deployment/night-api
→ REVISION 1：v1: 正常版本；REVISION 2：v2: 緊急更新（錯誤版本）
→ 目標版本是 revision 1（httpd:2.4）

Step 3：精確回滾到 revision 1
kubectl rollout undo deployment/night-api --to-revision=1
→ deployment.apps/night-api rolled back

Step 4：驗收
kubectl get pods  → 全部 Running
kubectl describe deployment night-api | grep Image  → Image: httpd:2.4
kubectl describe pod <pod-name> | grep Image  → 也能確認
kubectl rollout history deployment/night-api  → revision 3 會出現（每次 rollout 都是新的 revision）

清理：kubectl delete deployment night-api

老師補充說明：
- rollout undo 不帶參數只回「上一版」——這裡 revision 2 → revision 1 剛好對，但如果有四個 revision 且已 undo 過一次，再 undo 就在最後兩版間來回，永遠跳不到更舊的
- --to-revision 才能精確指定任意歷史版本，是生產環境的正確做法
- 每次 rollout（包括 undo）都會產生一個新的 revision，history 越來越長
- kubectl describe deployment | grep Image 或 describe pod | grep Image 都能確認 image，前者看 Deployment spec，後者看 Pod 實際跑的

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-9：自我修復 + Labels/Selector 概念（2 張）
  // ============================================================

  // ── 5-9（1/2）：自我修復原理 + 多節點震撼 ──
  {
    title: '自我修復：Pod 掛了，K8s 自動補回來',
    subtitle: 'Controller Manager 持續監控 → 期望 3 個只剩 2 個 → 補 1 個',
    section: '5-9：自我修復 + Labels/Selector',
    duration: '8',
    content: (
      <div className="space-y-3">
        <div className="bg-blue-900/30 border border-blue-500/40 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Reconciliation Loop — Controller Manager 持續問兩個問題</p>
          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
            <div className="bg-slate-900/60 p-2 rounded text-center">
              <p className="text-slate-400 text-xs mb-1">期望狀態（Deployment spec）</p>
              <p className="text-green-400 font-bold text-lg">3 個 Pod</p>
            </div>
            <div className="bg-slate-900/60 p-2 rounded text-center">
              <p className="text-slate-400 text-xs mb-1">實際狀態（Pod 掛了）</p>
              <p className="text-red-400 font-bold text-lg">2 個 Pod</p>
            </div>
          </div>
          <p className="text-amber-300 text-sm text-center">差距 1 → 自動補 1 個新 Pod（幾秒內）→ 永遠維持在 3</p>
        </div>

        <div className="bg-purple-900/30 border border-purple-500/40 p-3 rounded-lg">
          <p className="text-purple-400 font-semibold mb-2">孤兒 Pod（Orphan Pod）— 改 label 讓 Pod 脫離管理</p>
          <div className="space-y-0.5 text-xs font-mono">
            <p className="text-slate-300">原本：3 Pod（app=nginx）→ 都被 Deployment 管</p>
            <p className="text-yellow-300">執行：kubectl label pod pod-A app=isolated --overwrite</p>
            <p className="text-slate-300">pod-A 變孤兒，Deployment 看不到它，以為少了一個</p>
            <p className="text-green-400">Deployment 自動補 1 個新 Pod → 總共 4 個 Pod！</p>
            <p className="text-slate-400">孤兒 pod-A 繼續存活，沒有任何 controller 管它</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">pod-template-hash — K8s 自動加的版本識別 label</p>
          <div className="bg-slate-900/60 p-2 rounded font-mono text-xs mb-2">
            <p className="text-slate-400"># kubectl get pods --show-labels 輸出範例</p>
            <p className="text-slate-300">NAME                            LABELS</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-xkp2r   app=nginx,pod-template-hash=5c8d9f7b6a</p>
          </div>
          <p className="text-slate-400 text-xs">由 ReplicaSet controller 自動加入，代表屬於哪個 RS 版本</p>
          <p className="text-red-400 text-xs mt-1">不要手動刪！刪掉 = Pod 脫離 RS 管理 = 變孤兒</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">Label vs Annotation（常考）</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-3 text-left">特性</th>
                <th className="pb-1 pr-3 text-left text-cyan-400">Label</th>
                <th className="pb-1 text-left text-purple-400">Annotation</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3">能被 selector 選取</td>
                <td className="py-1 pr-3 text-green-400">可以</td>
                <td className="py-1 text-red-400">不行</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3">用途</td>
                <td className="py-1 pr-3">短識別標籤，關聯資源</td>
                <td className="py-1">長文字 / JSON / 說明</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3">典型範例</td>
                <td className="py-1 pr-3 text-green-400">app=nginx</td>
                <td className="py-1 text-purple-300">change-cause: "update to 1.28"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# 現場 demo：手動刪 Pod，看 K8s 自動補回來
kubectl get pods   # 確認 3 個 Running

kubectl delete pod <你的pod名稱>   # 刪一個

kubectl get pods -w
# → 馬上看到新 Pod 出現，AGE 是幾秒
# → 舊 Pod Terminating，新 Pod Running
# → 副本數永遠維持在 3`,
    notes: `【① 課程內容】
自我修復（Self-Healing）是什麼：當 Pod 掛掉（崩潰、被手動刪除、節點故障），K8s 會自動補回來。不是魔法，是 ReplicaSet 的 Controller Loop 在背後持續運作。核心機制：「實際狀態 vs 期望狀態」的差異偵測與修正。

Controller Manager 的角色：kube-controller-manager 是 K8s 控制平面元件，裡面跑著各種 Controller。每個 Controller 跑一個 reconciliation loop（調和循環）：持續問「現在實際有幾個 Pod？」對比「Deployment 期望幾個？」，差多少就補多少、多幾個就刪幾個。這就是為什麼手動刪一個 Pod 它會自己長回來。

複習說明：Labels 三處位置（Deployment 本身 / selector / Pod template）已在 5-3 介紹過。本節重點是「進階操作」：用指令實際操控 label、觀察 K8s 如何反應。

Labels 進階操作場景：--show-labels 看 Pod 所有 label；-l 過濾操作；手動對 Pod 加 label；批次用 label 刪 Pod 觸發自我修復；「孤兒 Pod」實驗。

孤兒 Pod（Orphan Pod）：把受 Deployment 管轄 Pod 的 label 改掉（不符合 selector），Deployment 看不到它以為少了副本，立刻補新 Pod。舊 Pod 變「沒人管的孤兒」繼續跑。最終結果：原本 3 個 → 變成 4 個（3 個被管 + 1 個孤兒）。用途：除錯時先把問題 Pod 從 Deployment 隔離，不影響其他 Pod，慢慢調查。

pod-template-hash：K8s 自動加在每個 Pod 上的 label，值是 Pod template 內容的 hash。由 ReplicaSet controller 設定。滾動更新時區分新舊版本的 Pod。不要手動刪它，刪掉後 Pod 脫離 ReplicaSet 管理變孤兒。

Label vs Annotation 差別（常考）：
- Label：能被 selector 選取；適合短識別標籤（app=nginx）；用途是關聯資源
- Annotation：不能被 selector 選取；適合長文字/JSON/說明；典型用途是 change-cause、CI/CD 資訊

【② 指令講解】
（本節為概念課，指令集中在 5-10 實作。）

【③④ 題目 + 解答】
題目 1【計時自我修復】：確認 nginx-deploy 有 3 個 Pod 在跑。執行以下操作並計時：
  時間點 A：kubectl delete pod -l app=nginx（一次刪全部 3 個）
  時間點 B：等到 'kubectl get pods -l app=nginx' 再次看到 3 個 Running
說出花了幾秒，並說出新 Pod 的 NAME 和舊 Pod 有什麼不同（suffix 隨機）。
驗收：計時說出大約幾秒（通常 10-30 秒），說出新 Pod NAME 的 suffix 不一樣。

題目 2【孤兒 Pod 實驗】：確認 nginx-deploy 有 3 個 Pod（執行 'kubectl get pods --show-labels' 確認）。選第一個 Pod 的名稱，執行 'kubectl label pod <pod-name> app=isolated --overwrite'，接著執行 'kubectl get pods --show-labels'，說出：
  a. 現在共有幾個 Pod？
  b. Deployment 的 READY 是幾？（執行 'kubectl get deploy'）
  c. 孤兒 Pod 和新補的 Pod 各有什麼 label？
最後執行 'kubectl delete pod -l app=isolated' 清理孤兒。
驗收：a. 4 個 Pod；b. READY 仍是 3/3；c. 孤兒是 app=isolated、新的是 app=nginx。

[▶ 下一頁]`,
  },

  // ── 5-9（2/2）：Labels + Selector 概念 ──
  {
    title: 'Labels + Selector：K8s 的認親機制',
    subtitle: 'Deployment 靠 Labels 認 Pod，Service 也靠 Labels 認 Pod',
    section: '5-9：自我修復 + Labels/Selector',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Labels = 貼在資源上的標籤</p>
          <div className="bg-slate-900/50 p-2 rounded mt-1 text-sm font-mono">
            <p className="text-slate-300">app: nginx</p>
            <p className="text-slate-300">env: production</p>
            <p className="text-slate-300">team: backend</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">就像超市商品標籤：乳製品、冷藏、特價 — 任意數量的 key:value</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Selector = 用 Labels 篩選資源</p>
          <p className="text-slate-300 text-sm">「給我所有 <code className="text-green-400">app=nginx</code> 的 Pod」→ K8s 找出符合的 Pod</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-3">黃金法則：三者要對上</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">位置</th>
                <th className="pb-2">作用</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Deployment selector</td>
                <td className="py-2">matchLabels: app: nginx → 我要管有這標籤的 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Pod template labels</td>
                <td className="py-2">app: nginx → 建出來的 Pod 帶這標籤</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Service selector</td>
                <td className="py-2">app: nginx → 把流量導到有這標籤的 Pod</td>
              </tr>
            </tbody>
          </table>
          <p className="text-red-400 text-xs mt-2">三個沒對上 = Deployment 認不到 Pod / Service 導不到流量 → 最常見的配對錯誤</p>
        </div>

        <div className="bg-purple-900/30 border border-purple-500/40 p-4 rounded-lg">
          <p className="text-purple-400 font-semibold mb-2">真實場景：用 Label 做 GPU 排程</p>
          <p className="text-slate-300 text-sm mb-3">公司叢集有些機器有 GPU、有些沒有。K8s 預設不知道哪台有 GPU，要自己貼標籤告訴它。</p>
          <div className="space-y-2 text-sm">
            <div className="bg-slate-900/50 p-2 rounded font-mono text-xs">
              <p className="text-slate-500 mb-1"># 先幫有 GPU 的機器貼標籤（只需做一次）</p>
              <p className="text-green-400">kubectl label node gpu-node-1 gpu=true</p>
              <p className="text-green-400">kubectl label node gpu-node-2 gpu=true</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/50 p-2 rounded">
                <p className="text-yellow-300 mb-1">Node 現況</p>
                <p className="text-slate-300">gpu-node-1 → 🏷️ gpu=true</p>
                <p className="text-slate-300">gpu-node-2 → 🏷️ gpu=true</p>
                <p className="text-slate-400">cpu-node-1 → （沒貼）</p>
                <p className="text-slate-400">cpu-node-2 → （沒貼）</p>
              </div>
              <div className="bg-slate-900/50 p-2 rounded">
                <p className="text-yellow-300 mb-1">Deployment YAML</p>
                <p className="text-slate-300">spec:</p>
                <p className="text-slate-300 pl-2">template:</p>
                <p className="text-slate-300 pl-4">spec:</p>
                <p className="text-cyan-400 pl-6">nodeSelector:</p>
                <p className="text-green-400 pl-8">gpu: "true"</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs">nodeSelector 的意思：「只把我的 Pod 排到有 gpu=true 標籤的機器上」</p>
          </div>
        </div>
      </div>
    ),
    code: `# 看 Pod 的 Labels
kubectl get pods --show-labels

# 用 Label 篩選
kubectl get pods -l app=nginx

# 手動加標籤
kubectl label pod <pod-name> env=test

# 看篩選結果
kubectl get pods -l env=test

# 看所有 Node 及其 Label（確認機器名稱用這個）
kubectl get nodes --show-labels`,
    notes: `【① 課程內容】
本張重點：Labels 進階操作概念 + Selector 機制 + Label vs Annotation 對照。

Labels 三處位置黃金法則（Deployment selector / Pod template labels / Service selector 三者要對上）：
- Deployment selector：matchLabels: app: nginx → 我要管有這標籤的 Pod
- Pod template labels：app: nginx → 建出來的 Pod 帶這標籤
- Service selector：app: nginx → 把流量導到有這標籤的 Pod
→ 三個沒對上 = Deployment 認不到 Pod / Service 導不到流量，是最常見的配對錯誤

進階用法預告：
- kubectl get pods --show-labels → 看所有 label
- kubectl get pods -l app=nginx → 用 label 篩選
- kubectl label pod <name> env=test → 手動加 label（只影響這個 Pod，不影響 Deployment）

真實場景補充：Label 不只用在 Pod，也可以貼在 Node 上，搭配 nodeSelector 做 Pod 排程控制。
典型用途：GPU 機器貼 gpu=true → Deployment 裡加 nodeSelector: gpu: "true" → Scheduler 只會把 Pod 排到有 GPU 的機器。
操作說明：
1. kubectl get nodes 先確認你的機器名稱（名字不是固定的，要看實際叢集）
2. kubectl label node <node-name> gpu=true → 貼標籤
3. Deployment YAML spec.template.spec 下加 nodeSelector: gpu: "true"
→ 下次 Scheduler 安排新 Pod 時，只有有 gpu=true 的 Node 才是候選

【② 指令講解】
kubectl get pods --show-labels
→ 在輸出最後加一欄 LABELS，顯示每個 Pod 的所有 label
→ 打完要看：app=nginx 和 pod-template-hash 兩個 label

kubectl get pods -l app=nginx
→ -l 是 --selector 縮寫，只列出有 app=nginx label 的 Pod
→ 異常：No resources found → 沒有任何 Pod 有這個 label，確認 key/value 是否打對

kubectl label pod <pod-name> env=test
→ 只在這個 Pod 生命週期內有效，Pod 重啟後消失（Pod 是 immutable，重啟等於重建）
→ 異常：already has a value → 加 --overwrite

【③④ 題目 + 解答】
題目 1【label 篩選操作】：確認叢集有 nginx-deploy（3 個 Pod）在跑，執行以下操作：
  a. 'kubectl get pods --show-labels'：說出每個 Pod 有哪些 label
  b. 'kubectl get pods -l app=nginx'：說出顯示幾個 Pod
  c. 'kubectl get pods -l app=notexist'：說出輸出是什麼
  d. 'kubectl label pod <第一個pod名稱> env=debug'，再執行 'kubectl get pods -l env=debug'：說出顯示幾個 Pod
驗收：a. 每個 Pod 有 app=nginx 和 pod-template-hash 兩個 label；b. 3 個；c. "No resources found"；d. 只有 1 個。

題目 2【pod-template-hash 實驗】：執行 'kubectl get pods --show-labels'，複製某個 Pod 的 pod-template-hash 值。執行 'kubectl get pods -l pod-template-hash=<那個值>'，說出顯示幾個 Pod。接著嘗試執行 'kubectl label pod <pod-name> pod-template-hash=fake --overwrite'，說出發生什麼。再執行 'kubectl get pods' 確認 Pod 數量。
驗收：-l pod-template-hash 篩出 3 個 Pod；改掉 pod-template-hash 後 Pod 變成孤兒，Deployment 補新的，Pod 總數變 4 個。執行 'kubectl delete pod -l app!=nginx' 清理。

[▶ 下一頁]`,
  },

  // ============================================================
  // 5-10：自我修復 + Labels 實作（1 張 + 1 張學員實作）
  // ============================================================

  // ── 5-10（1/2）：自我修復實測 + Labels 操作 ──
  {
    title: '自我修復 + Labels 實作',
    subtitle: 'delete Pod 看自動補回 → --show-labels → -l 篩選 → 改標籤造孤兒',
    section: '5-10：自我修復 + Labels 實作',
    duration: '6',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 1 — 看 Labels 輸出</p>
          <div className="bg-slate-900/60 p-2 rounded font-mono text-xs mb-1">
            <p className="text-slate-400">$ kubectl get pods --show-labels</p>
            <p className="text-slate-300">NAME                            READY   STATUS    LABELS</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-xkp2r   1/1     Running   app=nginx,pod-template-hash=5c8d9f7b6a</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-m7r9t   1/1     Running   app=nginx,pod-template-hash=5c8d9f7b6a</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-pq3ns   1/1     Running   app=nginx,pod-template-hash=5c8d9f7b6a</p>
          </div>
          <p className="text-slate-400 text-xs">每個 Pod 有兩個 label：app=nginx（你定義的）和 pod-template-hash（K8s 自動加的）</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 2 — 手動加 label + 用 -l 篩選</p>
          <div className="bg-slate-900/60 p-2 rounded font-mono text-xs mb-1">
            <p className="text-slate-400">$ kubectl label pod nginx-deploy-5c8d9f7b6a-xkp2r env=test</p>
            <p className="text-green-300">pod/nginx-deploy-5c8d9f7b6a-xkp2r labeled</p>
            <p className="text-slate-400 mt-1">$ kubectl get pods -l env=test</p>
            <p className="text-slate-300">NAME                            READY   STATUS    AGE</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-xkp2r   1/1     Running   5m</p>
          </div>
          <p className="text-slate-400 text-xs">-l 只顯示符合的 Pod；用 -l app=nginx 可一次看全部</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3 — 刪一個 Pod，看 AGE = 2s（自我修復）</p>
          <div className="bg-slate-900/60 p-2 rounded font-mono text-xs mb-1">
            <p className="text-slate-400">$ kubectl delete pod nginx-deploy-5c8d9f7b6a-xkp2r</p>
            <p className="text-slate-300">pod "nginx-deploy-5c8d9f7b6a-xkp2r" deleted</p>
            <p className="text-slate-400 mt-1">$ kubectl get pods   # 立刻跑！</p>
            <p className="text-slate-300">NAME                            READY   STATUS              AGE</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-m7r9t   1/1     Running             9m</p>
            <p className="text-green-400">nginx-deploy-5c8d9f7b6a-pq3ns   1/1     Running             9m</p>
            <p className="text-amber-300">nginx-deploy-5c8d9f7b6a-r8vwk   0/1     ContainerCreating   2s</p>
          </div>
          <p className="text-slate-400 text-xs">新 Pod suffix 隨機不同、AGE 只有 2 秒 → reconciliation loop 偵測不足立刻補上</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 4 — 批次刪除 + describe 看 Selector</p>
          <div className="bg-slate-900/60 p-2 rounded font-mono text-xs mb-1">
            <p className="text-slate-400">$ kubectl delete pod -l app=nginx   # 一次刪全部！</p>
            <p className="text-slate-300">pod/nginx-deploy-5c8d9f7b6a-m7r9t deleted</p>
            <p className="text-slate-300">pod/nginx-deploy-5c8d9f7b6a-pq3ns deleted</p>
            <p className="text-slate-300">pod/nginx-deploy-5c8d9f7b6a-r8vwk deleted</p>
            <p className="text-slate-400 mt-1">$ kubectl describe deployment nginx-deploy</p>
            <p className="text-green-400">Selector:  app=nginx</p>
            <p className="text-green-400">Replicas:  3 desired | 3 ready</p>
          </div>
          <p className="text-slate-400 text-xs">操作前先用 kubectl get pods -l app=nginx 確認範圍再刪</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">孤兒化實驗：改掉 app label 會怎樣？</p>
          <div className="bg-slate-900/60 p-2 rounded font-mono text-xs">
            <p className="text-yellow-300">kubectl label pod nginx-deploy-5c8d9f7b6a-xkp2r app=isolated --overwrite</p>
            <p className="text-slate-400 mt-0.5">$ kubectl get pods --show-labels  # 看到 4 個！</p>
            <p className="text-red-300">nginx-deploy-...-xkp2r   app=isolated,...   ← 孤兒</p>
            <p className="text-green-400">nginx-deploy-...-NEW     app=nginx,...      ← 新補的</p>
            <p className="text-slate-400 mt-0.5">$ kubectl get deploy  # READY 仍然 3/3</p>
          </div>
        </div>
      </div>
    ),
    code: `# 自我修復
kubectl get pods -o wide
kubectl delete pod <pod-name>
kubectl get pods              # 馬上看到新 Pod

# Labels
kubectl get pods --show-labels
kubectl get pods -l app=nginx
kubectl label pod <pod-name> env=test
kubectl get pods -l env=test

# 挑戰：改 app label 造孤兒
kubectl label pod <pod-name> app=other --overwrite
kubectl get pods              # 4 個 Pod！
kubectl get pods --show-labels # 3 個 app=nginx + 1 個 app=other
kubectl delete pod <orphan>   # 清理孤兒`,
    notes: `【① 課程內容】
實作目標：親眼看到 Pod 被刪掉後自動補回來，觀察 Pod 上的 label，手動給 Pod 加 label，用 -l 過濾 Pod，用 label 做批次刪除，看 Deployment 的 selector 設定。

自我修復觀察重點：刪掉 Pod 後，注意看新 Pod 的 AGE 欄位，會看到一個很年輕的新 Pod 出現。Pod 的 NAME 會不一樣（有隨機 suffix），但功能完全相同。這代表 reconciliation loop 偵測到 Pod 數量不足，自動補上了。

注意事項：kubectl label pod 加上的 label 只在這個 Pod 生命週期內有效，Pod 重啟後消失。如果想讓所有 Pod 都有某個 label，要改 Deployment 的 template.metadata.labels。kubectl delete pod -l <selector> 很強大，操作前一定要先用 kubectl get pods -l 確認選到的是哪些 Pod，再執行刪除。

【② 指令講解】
查看 Pod 所有 Labels：kubectl get pods --show-labels
→ 打完要看：app=nginx 和 pod-template-hash 兩個 label
→ 異常：LABELS 欄位只有 pod-template-hash 沒有 app → Deployment template labels 設定有問題

手動給 Pod 加 Label：kubectl label pod <pod-name> env=test
→ 打完要看：pod/xxx labeled，再用 --show-labels 確認多了 env=test
→ 異常：already has a value → 加 --overwrite；Pod 名稱打錯 → NotFound

用 Label 過濾（精確比對）：kubectl get pods -l app=nginx
→ 打完要看：只顯示符合條件的 Pod
→ 異常：No resources found → label key/value 打錯

觀察自我修復：kubectl delete pod <pod-name>
→ 刪除後立刻跑 kubectl get pods
→ 打完要看：新 Pod 的 AGE 只有 2 秒，NAME 不同，STATUS 是 ContainerCreating
→ 異常：Pod 刪掉後沒有新 Pod 補回 → spec.replicas 可能是 0，或有 ResourceQuota 限制

用 Label 批次刪除 Pod：kubectl delete pod -l app=nginx
→ 先用 kubectl get pods -l app=nginx 確認要刪的範圍再執行
→ 打完要看：每個被刪的 Pod 都會輸出 deleted，馬上看到 Deployment 正在補新 Pod

查看 Deployment 的 Selector：kubectl describe deployment nginx-deploy
→ 打完要看：Selector、Replicas、StrategyType、Pod Template Labels 是否一致
→ 異常：Selector 和 Pod Template Labels 不一致 → bug，需要重建 Deployment

【③④ 題目 + 解答】
題目（Lab 3 預告）：
情境：正式環境跑著 3 個 Pod 的 nginx 服務。其中一個 Pod 行為異常，你需要把它「隔離」出來調查，同時不能中斷服務。

任務：確認目前有 3 個 Pod → 選一個 Pod 把 app label 改成 app=isolated → 觀察 Pod 總數 → 對孤兒 Pod 執行 kubectl describe → 調查完畢手動刪除孤兒 Pod。

解答要點：
- 改 label 後 Pod 總數變 4（3 個 app=nginx + 1 個 app=isolated）
- Deployment READY 仍然是 3/3（已自動補一個新 Pod）
- 孤兒 Pod 繼續存活但不受任何 controller 管理，是穩定的調查對象
- 調查完一定要手動刪，否則殘留孤兒 Pod 佔用資源

[▶ 下一頁]`,
  },

  // ── 5-10（2/2）：Lab 3 — 除錯工程師 ──
  {
    title: 'Lab 3：除錯工程師',
    subtitle: '生產環境有 Pod 行為異常，隔離它、調查它、不影響服務',
    section: '5-10：自我修復 + Labels 實作',
    duration: '15',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/20 border border-red-500/40 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">情境</p>
          <p className="text-slate-300 text-sm">正式環境跑著 3 個 Pod 的 nginx 服務。你收到報告，<strong className="text-white">其中一個 Pod 行為異常</strong>（回應很慢，但還沒死）。你需要把它「隔離」出來調查，<strong className="text-white">同時不能中斷服務</strong>。</p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1">為什麼用孤兒 Pod 而不是直接刪？</p>
          <table className="w-full text-xs">
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700"><td className="py-1 pr-3 text-red-400">直接刪 Pod</td><td className="py-1">Pod 消失，無法調查根本原因</td></tr>
              <tr className="border-t border-slate-700"><td className="py-1 pr-3 text-red-400">scale 到 1</td><td className="py-1">其他正常 Pod 被砍，服務降容</td></tr>
              <tr className="border-t border-slate-700"><td className="py-1 pr-3 text-green-400">✅ 改 label 孤兒化</td><td className="py-1">Deployment 補新 Pod 繼續服務，舊 Pod 穩定等你查</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">任務</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認目前有 3 個 Pod 在跑（用 <code className="text-green-400">--show-labels</code> 看）</li>
            <li>選一個 Pod，把它的 <code className="text-green-400">app</code> label 改成 <code className="text-green-400">app=isolated</code></li>
            <li>觀察：Pod 總數變幾個？Deployment 的 READY 是什麼？</li>
            <li>對孤兒 Pod 執行 <code className="text-green-400">kubectl describe</code>，找出它的 Node、Events、狀態</li>
            <li>調查完畢，手動刪除孤兒 Pod，確認恢復 3 個 Pod</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-xs text-slate-400">
          驗收：能說出孤兒 Pod 在哪個 Node？Events 有什麼？Deployment 為什麼自動補 Pod？
        </div>
      </div>
    ),
    code: `# 準備（如果還沒有 nginx-deploy）
kubectl create deployment nginx-deploy --image=nginx:1.25 --replicas=3

# Step 1：確認 Pod + 看 labels
kubectl get pods --show-labels

# Step 2：選一個 Pod，改它的 app label
kubectl label pod <pod-name> app=isolated --overwrite

# Step 3：觀察
kubectl get pods --show-labels   # 4 個 Pod！
kubectl get deploy               # READY 仍然是 3/3

# Step 4：調查孤兒 Pod
kubectl describe pod <那個 pod-name>

# Step 5：清理
kubectl delete pod <孤兒-pod-name>
kubectl get pods                 # 回到 3 個`,
    notes: `【① 課程內容】
Lab 3 情境：正式環境跑著 3 個 Pod 的 nginx 服務。其中一個 Pod 行為異常（回應很慢，但還沒死）。需要把它「隔離」出來調查，同時不能中斷服務。

為什麼用孤兒 Pod 而不是其他方法：
- 直接刪 Pod：Pod 消失，無法調查根本原因
- scale 到 1 留問題 Pod：其他正常 Pod 被砍，服務降容影響用戶
- 改 label 孤兒化：Deployment 補新 Pod 繼續服務，舊 Pod 穩定存活等你查

任務：確認 3 個 Pod（--show-labels 看）→ 選一個 Pod 把 app label 改成 app=isolated → 觀察 Pod 總數變幾個 Deployment READY 是什麼 → 對孤兒 Pod 執行 kubectl describe 找出 Node Events 狀態 → 調查完畢手動刪除孤兒 Pod 確認恢復 3 個 Pod。

驗收：能說出孤兒 Pod 在哪個 Node；能說明 Deployment 為什麼自動補 Pod；最後 kubectl get pods 回到 3 個 Running。

【② 指令講解】
（Lab 不給指令提示，考驗學員能否應用 label 操作。）

【③④ 題目 + 解答（Lab 3 完整詳解）】
Step 1：確認 Pod + 看 labels
kubectl get pods --show-labels
→ 記下一個 Pod 的名字，例如 nginx-deploy-xxx-aaa

Step 2：改 label，孤兒化
kubectl label pod nginx-deploy-xxx-aaa app=isolated --overwrite
→ 輸出：pod/nginx-deploy-xxx-aaa labeled

Step 3：觀察
kubectl get pods --show-labels
→ 看到 4 個 Pod：3 個 app=nginx + 1 個 app=isolated
kubectl get deploy
→ READY 仍然是 3/3（Deployment 已自動補一個新 Pod）

Step 4：調查孤兒 Pod
kubectl describe pod nginx-deploy-xxx-aaa
→ 重點看：Node、Labels（確認 app=isolated）、Events

Step 5：清理
kubectl delete pod nginx-deploy-xxx-aaa
kubectl get pods  → 回到 3 個

老師補充說明重點：
- 孤兒化的核心：改掉 label → 脫離 Deployment selector → Deployment 以為副本不足 → 補新 Pod
- 孤兒 Pod 不受任何控制器管，不會被自動重啟也不會被自動刪除，是穩定的調查對象
- 這是生產環境工程師實際使用的技巧，不是玩具實驗
- 調查完一定要手動刪，否則殘留孤兒 Pod 佔用資源

[▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ============================================================
  // 5-11：回頭操作 + 上午總結（1 張）
  // ============================================================

  {
    title: '回頭操作 Loop 3 + 上午總結',
    subtitle: '三個 Loop：擴縮容 → 滾動更新 → 自我修復 + Labels',
    section: '5-11：回頭操作 + 上午總結',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">上午三個 Loop 總結</p>
          <table className="w-full text-xs mb-1">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-1 pr-3">Loop</th>
                <th className="pb-1 pr-3">學了什麼</th>
                <th className="pb-1">核心指令</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-cyan-400 font-bold">1</td>
                <td className="py-1 pr-3">擴縮容</td>
                <td className="py-1"><code className="text-green-400">kubectl scale</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-cyan-400 font-bold">2</td>
                <td className="py-1 pr-3">滾動更新 + 回滾</td>
                <td className="py-1"><code className="text-green-400">set image / rollout undo</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-cyan-400 font-bold">3</td>
                <td className="py-1 pr-3">自我修復 + Labels</td>
                <td className="py-1"><code className="text-green-400">--show-labels / -l / label</code></td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <p className="text-slate-300 font-semibold">三個 Loop 的關聯</p>
            <p><span className="text-cyan-400">Deployment（三層結構）</span> → spec.replicas / selector / template 定義期望</p>
            <p><span className="text-cyan-400">ReplicaSet（蹺蹺板）</span> → 實現擴縮容與滾動更新（新舊 RS 一升一降）</p>
            <p><span className="text-cyan-400">Labels / Selector（認親機制）</span> → Deployment 靠 label 認 Pod、觸發自我修復</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">上午小測驗（5 題，全部操作題）</p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Q1</span>
              <span>建 nginx:1.25 Deployment → 更新到 1.28 → 貼出 <code className="text-green-400">rollout status</code> 的完整輸出（要看到 successfully rolled out）</span>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Q2</span>
              <span>對同一個 Deployment 連跑兩次 <code className="text-green-400">rollout undo</code>，每次都執行 <code className="text-green-400">describe | grep Image</code>，說出最後的 image 是什麼</span>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Q3</span>
              <span>把以下 YAML apply 到叢集，觀察症狀，說出報什麼錯，修好讓 READY 變 2/2：<br /><code className="text-red-400">selector: app=web / template labels: app=website</code></span>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Q4</span>
              <span>執行 <code className="text-green-400">kubectl delete pod -l app=nginx</code>，計時幾秒後 <code className="text-green-400">kubectl get pods</code> 再次看到全部 Running</span>
            </div>
            <div className="flex gap-2">
              <span className="text-amber-400 font-bold shrink-0">Q5</span>
              <span>執行 <code className="text-green-400">kubectl get pods --show-labels</code> 找出 <code className="text-green-400">pod-template-hash</code>，對某個 Pod 用 <code className="text-green-400">--overwrite</code> 改掉它，觀察 Pod 總數變化</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1">下午預告</p>
          <p className="text-slate-300 text-sm">Pod 跑起來、Deployment 管得好 → 但外面的人怎麼連進來？</p>
          <p className="text-slate-300 text-sm">Pod IP 會變、叢集外連不到 → 下午主角：<strong className="text-white">Service</strong></p>
        </div>
      </div>
    ),
    code: `# 上午完整指令速查
# 擴縮容
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods -o wide

# 滾動更新
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
kubectl rollout status deployment/nginx-deploy
kubectl rollout history deployment/nginx-deploy
kubectl rollout undo deployment/nginx-deploy

# 自我修復
kubectl delete pod <pod-name>
kubectl get pods -w   # 看自動補回

# Labels
kubectl get pods --show-labels
kubectl get pods -l app=nginx
kubectl label pod <pod-name> env=test
kubectl label pod <pod-name> app=isolated --overwrite
kubectl delete pod -l app=nginx   # 批次刪`,
    notes: `【① 課程內容】
上午回顧重點：
- Deployment 完整生命週期：建立 → 更新（滾動）→ 失敗 → 回滾
- ReplicaSet 的角色：滾動更新的蹺蹺板、自我修復的執行者
- Labels 三處位置：Deployment 本身 / selector / Pod template，三者關係
- Selector 是 K8s 資源關聯的核心機制

本節操作：帶做一遍 Loop 3 操作 → 上午小測驗 → 對照解答確認理解 → 提問與補充說明。

【② 指令講解】
（本節為複習段，以問答為主，無新指令。）

【③④ 題目 + 解答（上午小測驗，共 5 題，全操作）】
第 1 題：nginx:1.25 → nginx:1.28 完整流程 + 貼出 rollout status 輸出
準備：kubectl create deployment quiz-deploy --image=nginx:1.25 --replicas=3
操作：
  kubectl set image deployment/quiz-deploy nginx=nginx:1.28
  kubectl rollout status deployment/quiz-deploy
  （貼出輸出）
  kubectl describe deployment quiz-deploy | grep Image
預期 rollout status 輸出：
  Waiting for deployment "quiz-deploy" rollout to finish: 1 out of 3 new replicas have been updated...
  Waiting for deployment "quiz-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
  deployment "quiz-deploy" successfully rolled out
預期 grep Image 輸出：Image: nginx:1.28

第 2 題：rollout undo 連跑兩次 + 每次確認 image
  kubectl rollout undo deployment/quiz-deploy
  kubectl describe deployment quiz-deploy | grep Image
  （預期：Image: nginx:1.25）
  kubectl rollout undo deployment/quiz-deploy
  kubectl describe deployment quiz-deploy | grep Image
  （預期：Image: nginx:1.28）
解釋：兩次 undo 在 1.25 和 1.28 之間來回切換，因為每次 undo 都會產生新的 revision，所以 "上一版" 的定義會改變。

第 3 題：YAML bug 操作題
把以下 YAML 存成 quiz3.yaml 並 apply：
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: quiz3
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: web
    template:
      metadata:
        labels:
          app: website
      spec:
        containers:
        - name: nginx
          image: nginx:1.25
預期報錯：The Deployment "quiz3" is invalid: spec.template.metadata.labels: Invalid value...selector does not match template labels
修正：把 template labels 的 app: website 改成 app: web
驗收：kubectl get deploy quiz3 → READY: 2/2
清理：kubectl delete deployment quiz3

第 4 題：批次刪 Pod + 計時
  kubectl get pods -l app=nginx（確認有幾個）
  時間點 A：kubectl delete pod -l app=nginx
  時間點 B：kubectl get pods 看到全部 Running
預期：15-30 秒內，新 Pod 的 AGE 只有幾秒，NAME 的 suffix 和舊 Pod 不同。

第 5 題：改 pod-template-hash 觀察孤兒
  kubectl get pods --show-labels（找到 pod-template-hash 的值，例如 abc12345）
  kubectl label pod <某個pod名> pod-template-hash=tampered --overwrite
  kubectl get pods（觀察總數）
預期：Pod 總數從 3 變 4（被改掉的那個脫離 RS 成孤兒，Deployment 補新的），READY 仍是 3/3。
清理：kubectl delete pod -l pod-template-hash=tampered

[▶ 下一頁]`,
  },
]
