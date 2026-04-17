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
  // Loop 4：RBAC（7-11, 7-12, 7-13）
  // ============================================================

  // ── 7-11 概念（1/2）：誰都能刪 Pod ──
  {
    title: '誰都能刪 Pod？',
    subtitle: '實習生 kubectl delete namespace production',
    section: 'Loop 4：RBAC',
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
    section: 'Loop 4：RBAC',
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
    section: 'Loop 4：RBAC',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三個 YAML 組合</p>
        </div>
      </div>
    ),
    code: `# Role — 只讀：get / list / watch
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
    section: 'Loop 4：RBAC',
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
            <p>$ kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa</p>
            <p className="text-red-400">Error from server (Forbidden): cannot create resource "pods"</p>
          </div>
        </div>

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

好，接下來是大家的實作時間。

[▶ 下一頁]`,
  },

  // ── 7-12 學員實作 ──
  {
    title: '學員實作：RBAC',
    subtitle: '⏱ 巡堂確認',
    section: 'Loop 4：RBAC',
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
kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa`,
    notes: `必做題是跟著我剛才的步驟做一遍。建 ServiceAccount、Role、RoleBinding，然後用 --as 測試。確認 get pods 成功，delete pod 被拒。

挑戰題是自己寫一個新的 Role，允許 get、list、create、update、delete deployments，但不能碰 secrets。然後建一個新的 ServiceAccount 綁上去，用 --as 測試能操作 Deployment 但不能讀 Secret。提示：resources 那個欄位可以寫多條 rule，每條 rule 指定不同的 resources 和 verbs。

大家動手做，有問題舉手。

[▶ 下一頁]`,
  },

  // ── 7-13 回頭操作：RBAC ──
  {
    title: '回頭操作：RBAC 常見坑',
    subtitle: 'Loop 4 小結',
    section: 'Loop 4：RBAC',
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
    section: 'Loop 4：RBAC',
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

  // ============================================================
  // Loop 5：NetworkPolicy（7-14, 7-15, 7-16）
  // ============================================================

  // ── 7-14 概念（1/2）：全通不安全 ──
  {
    title: '叢集內全通不安全',
    subtitle: 'K8s 預設：所有 Pod 互通 → 橫向移動攻擊',
    section: 'Loop 5：NetworkPolicy',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：預設全通</p>
          <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg mt-2">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="border-2 border-blue-500/70 rounded-lg p-2 bg-blue-900/20 text-center min-w-[80px]">
                <p className="text-blue-400 text-sm font-bold">Frontend</p>
              </div>
              <span className="text-green-400 font-bold">→</span>
              <div className="border-2 border-cyan-500/70 rounded-lg p-2 bg-cyan-900/20 text-center min-w-[80px]">
                <p className="text-cyan-400 text-sm font-bold">API</p>
              </div>
              <span className="text-green-400 font-bold">→</span>
              <div className="border-2 border-amber-500/70 rounded-lg p-2 bg-amber-900/20 text-center min-w-[80px]">
                <p className="text-amber-400 text-sm font-bold">DB</p>
              </div>
            </div>
            <div className="flex items-center justify-center mt-2 gap-2">
              <span className="text-blue-400 text-xs">Frontend</span>
              <span className="text-red-400 font-bold text-sm">── 也能直連 ──→</span>
              <span className="text-amber-400 text-xs">DB</span>
              <span className="text-red-400 text-xs ml-1">危險！</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">橫向移動攻擊</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>1. 前端 Pod 有安全漏洞，被入侵</p>
            <p>2. 網路全通 → 攻擊者從前端直連 DB</p>
            <p>3. 讀取或修改資料 → 完蛋</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：NetworkPolicy</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>Docker → <code className="text-xs">docker network create</code> 隔離（以 network 為單位）</p>
            <p>K8s → <span className="text-green-400 font-bold">NetworkPolicy</span>（Pod 等級防火牆，用 label 篩選，更精細）</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們繼續因果鏈。上一個 Loop 用 RBAC 管住了「人」。開發人員只能看不能刪，實習生碰不到生產環境。人的問題解決了。

但是 Pod 之間呢？

K8s 預設的網路策略是什麼？全通。叢集裡面所有的 Pod，不管在哪個 Namespace，不管掛什麼 label，都可以互相通訊。前端 Pod 可以連 API Pod，API Pod 可以連 MySQL Pod。這很合理。但同時，前端 Pod 也可以直接連 MySQL Pod。這就不合理了。

前端為什麼需要直連資料庫？正常架構下不需要。前端只需要連 API，API 再去連資料庫。但預設情況下，K8s 不會阻止前端直連資料庫。

這有什麼問題？假設你的前端 Pod 有一個安全漏洞，被攻擊者入侵了。如果網路是全通的，攻擊者可以從前端 Pod 直接連到資料庫 Pod，讀取或者修改資料。這叫橫向移動，是安全攻擊裡最常見的手法之一。入侵一個弱點之後，在內部網路裡面橫著走，一路打到高價值目標。

用 Docker 的經驗來想。Docker 有 network 隔離的概念。你建一個 frontend-net、一個 backend-net，把前端容器放在 frontend-net，把資料庫放在 backend-net。不同 network 的容器不能互相連線。Docker Compose 裡面你也可以用 networks 欄位做隔離。

K8s 的做法比 Docker 更靈活，叫 NetworkPolicy。NetworkPolicy 是 Pod 等級的防火牆。你可以用 label 篩選目標 Pod，然後指定只有哪些 Pod 才能連進來或連出去。比 Docker 的 network 隔離更精細，因為 Docker 的隔離是以整個 network 為單位，K8s 可以做到以單個 Pod 為單位。

[▶ 下一頁]`,
  },

  // ── 7-14 概念（2/2）：ingress/egress 規則 + YAML ──
  {
    title: 'NetworkPolicy YAML 結構',
    subtitle: 'podSelector + policyTypes + ingress/egress',
    section: 'Loop 5：NetworkPolicy',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">四個區塊</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p><code className="text-cyan-400 text-xs">podSelector</code> → 這條規則套用在誰身上</p>
            <p><code className="text-cyan-400 text-xs">policyTypes</code> → 管 Ingress（進）還是 Egress（出）</p>
            <p><code className="text-cyan-400 text-xs">ingress.from</code> → 允許誰連進來</p>
            <p><code className="text-cyan-400 text-xs">egress.to</code> → 允許連出去到哪</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-3 rounded-lg text-sm">
          <p className="text-amber-400 font-semibold">注意別搞混！</p>
          <p className="text-slate-300 text-xs mt-1">NetworkPolicy 的 Ingress（L3/L4 進入流量）≠ Ingress Controller（L7 HTTP 路由）</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-1 text-sm">重要觀念</p>
          <p className="text-sm text-slate-300">被 Ingress / Egress policy 選中的方向 → 預設拒絕未允許流量（方向別白名單）</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-3 rounded-lg text-sm">
          <p className="text-amber-400 font-semibold">CNI 支援注意</p>
          <div className="text-xs text-slate-300 mt-1 space-y-1">
            <p>✓ k3s 預設安裝 → 有內建 network policy controller</p>
            <p>✓ <span className="text-green-400">Calico</span>、<span className="text-green-400">Cilium</span>、Weave → 明確支援；minikube 做 Lab 常用 Calico</p>
          </div>
        </div>
      </div>
    ),
    code: `# 保護 DB：只讓 API Pod 連進來
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
spec:
  podSelector:
    matchLabels:
      role: database        # 套用在 DB Pod
  policyTypes:
    - Ingress               # 只管進來的流量
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api      # 只有 API 能連
      ports:
        - protocol: TCP
          port: 3306         # 只開 MySQL port`,
    notes: `來看 NetworkPolicy 的 YAML 結構。一共四個區塊。

第一個是 podSelector，指定「這條規則套用在誰身上」。比如 matchLabels role: database，就是套用在所有帶 role=database 這個 label 的 Pod 上面。

第二個是 policyTypes，指定管「進來的流量」還是「出去的流量」。Ingress 是進入 Pod 的流量，Egress 是離開 Pod 的流量。你可以只管其中一種，也可以兩種都管。

這裡要特別注意一個容易混淆的點。NetworkPolicy 裡面的 Ingress 跟我們第六堂學的 Ingress Controller 完全是兩回事。NetworkPolicy 的 Ingress 是指「進入 Pod 的網路流量」，是 Layer 3 和 Layer 4 的概念。Ingress Controller 是 HTTP 路由器，是 Layer 7 的概念。名字碰巧一樣而已，不要搞混。

第三個區塊是 ingress 規則。from 裡面用 podSelector 指定「允許誰連進來」。ports 裡面指定允許的 port 和 protocol。

第四個區塊是 egress 規則，格式類似，用 to 和 ports 指定「允許連出去到哪裡」。

來看一個具體的例子。我要保護資料庫 Pod，只讓 API Pod 連進來。podSelector 設 matchLabels role: database，表示這條規則套用在帶 role=database 的 Pod 上。policyTypes 設 Ingress，只管進來的流量。ingress from podSelector matchLabels role: api，表示只有帶 role=api 的 Pod 才能連進來。ports 設 TCP 3306，只允許 MySQL 的 port。

翻譯成白話：資料庫只接受 API 的連線，而且只接受 3306 port。其他任何 Pod 想連資料庫的任何 port，全部擋掉。

這裡有一個非常重要的觀念。NetworkPolicy 不是「一加就全部鎖死」，而是看你宣告哪個方向。如果某個 Pod 被帶有 Ingress 的 policy 選中，它的 ingress 會變成白名單模式；如果被帶有 Egress 的 policy 選中，它的 egress 也會變成白名單模式。只寫 Ingress，不會順便把 Egress 也鎖住；反過來也一樣。

最後提一個很重要的實務注意事項。NetworkPolicy 這個東西是 K8s 的 API 規格，但實際執行還是要靠底層網路外掛或對應 controller。Calico、Cilium、Weave 都是常見選項。k3s 的預設安裝本身有 network policy controller，所以不是「Flannel 就一定不支援」這麼簡單；如果你在安裝時額外把它關掉，policy 才會存在但不生效。

如果你想在 minikube 上做最可預期的 Lab，常見做法是用 minikube start --cni=calico 重新建叢集。實際排錯時，如果你 apply 成功但流量還是全通，第一步先確認目前叢集到底用哪個 CNI / controller，第二步再檢查 selector、policyTypes 和 ports 有沒有寫對。

好，接下來我們實際操作一下。

[▶ 下一頁]`,
  },

  // ── 7-15 實作（1/2）：部署三服務 + 驗證全通 ──
  {
    title: 'NetworkPolicy 實作：部署 + 驗證全通',
    subtitle: '三個服務：frontend / api / database',
    section: 'Loop 5：NetworkPolicy',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 1-2：部署 + 驗證預設全通</p>
        </div>
      </div>
    ),
    code: `# Step 1：部署三個服務（都用 nginx 模擬，差別只是 label）
kubectl apply -f networkpolicy-lab.yaml
kubectl get pods -l "role in (frontend,api,database)"
kubectl get svc

# Step 2：驗證預設全通（還沒套 NetworkPolicy）
# frontend → db（不應該通，但預設全通）
FRONTEND_POD=$(kubectl get pods -l role=frontend \\
  -o jsonpath='{.items[0].metadata.name}')
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80
# ✓ 有回應 = 全通（不安全！）

# api → db（應該通）
API_POD=$(kubectl get pods -l role=api \\
  -o jsonpath='{.items[0].metadata.name}')
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80
# ✓ 有回應 = 全通`,
    notes: `好，我們來實作。這個實驗要部署三個服務：frontend、api、database。然後先驗證預設全通，再套上 NetworkPolicy，驗證隔離效果。

先部署。networkpolicy-lab.yaml 裡面有三個 Deployment 和三個 Service。三個 Deployment 都用 nginx 來模擬，差別只是 label 不同。frontend 的 Pod 帶 role=frontend，api 的帶 role=api，database 的帶 role=database。

kubectl apply -f networkpolicy-lab.yaml

等 Pod 跑起來。kubectl get pods -l "role in (frontend,api,database)" 六個 Pod 都是 Running。好。看一下 Service。kubectl get svc 有 frontend-svc、api-svc、db-svc 三個 ClusterIP Service。

現在還沒套 NetworkPolicy，所有 Pod 之間應該是全通的。我們來驗證。

先從 frontend Pod 連 database。你會看到 nginx 的預設歡迎頁面。有回應，表示 frontend 可以連到 database。在正常的安全架構下，這不應該被允許。

再從 api Pod 連 database。一樣有回應。api 也能連 database。這個是合理的，因為 API 需要存取資料庫。

[▶ 下一頁]`,
  },

  // ── 7-15 實作（2/2）：套 NetworkPolicy + 驗證隔離 ──
  {
    title: 'NetworkPolicy 驗證：隔離生效',
    subtitle: 'api → db ✓　frontend → db ✗',
    section: 'Loop 5：NetworkPolicy',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3-5：套 NetworkPolicy + 重新測試</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✓ api → db：通過</p>
          <p className="text-xs text-slate-300">role=api 在允許清單 → 正常回應</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">✗ frontend → db：被擋（CNI 支援時）</p>
          <p className="text-xs text-slate-300">role=frontend 不在允許清單 → 3 秒後 timeout</p>
          <p className="text-xs text-slate-400 mt-1">CNI 不支援 → 還是會通，概念理解即可</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✓ frontend → api：不受影響</p>
          <p className="text-xs text-slate-300">NetworkPolicy 只套在 DB Pod，API Pod 沒有限制</p>
        </div>
      </div>
    ),
    code: `# Step 3：套上 NetworkPolicy
kubectl apply -f networkpolicy-db-only-api.yaml
kubectl get networkpolicy
# NAME                POD-SELECTOR     AGE
# db-allow-api-only   role=database    5s

# Step 4：重新測試
# api → db（應該通）
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80
# ✓ 有回應

# frontend → db（CNI 支援 → timeout；不支援 → 還是通）
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80
# ✗ wget: download timed out（被擋了！）

# Step 5：frontend → api 不受影響
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://api-svc:80
# ✓ 有回應`,
    notes: `好，現在套上 NetworkPolicy。

kubectl apply -f networkpolicy-db-only-api.yaml

這個 NetworkPolicy 的內容就是剛才概念講的那個 YAML。podSelector 選 role=database 的 Pod，只允許 role=api 的 Pod 透過 TCP port 80 連進來。

kubectl get networkpolicy 你會看到 db-allow-api-only 這條 NetworkPolicy，POD-SELECTOR 顯示 role=database。

好，現在重新測試。先從 api 連 database。kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80 還是有回應。因為 api Pod 帶 role=api label，在允許清單裡面。

再從 frontend 連 database。kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80 如果你的 CNI 支援 NetworkPolicy，這個指令會在 3 秒後 timeout。因為 frontend Pod 的 label 是 role=frontend，不在 NetworkPolicy 的允許清單裡面，流量被擋掉了。

如果你的 CNI 不支援，這邊還是會成功。不用擔心，概念你已經理解了。在生產環境用 Calico 或 Cilium 就會生效。

最後確認一下 frontend 連 api 還是通的。有回應。因為我們的 NetworkPolicy 只套在 database Pod 上面，api Pod 沒有任何 NetworkPolicy 限制，所以 frontend 連 api 不受影響。

這就是 NetworkPolicy 的效果。database 被保護起來了，只有 api 能連。frontend 連 database 被擋，但 frontend 連 api 不受影響。三層架構的網路隔離就是這樣做的。

[▶ 下一頁]`,
  },

  // ── 7-15 學員實作 ──
  {
    title: '學員實作：NetworkPolicy',
    subtitle: '⏱ 巡堂確認',
    section: 'Loop 5：NetworkPolicy',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">必做</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. 部署 frontend + api + db 三個服務</p>
            <p>2. 驗證預設全通：frontend → db 有回應</p>
            <p>3. apply NetworkPolicy</p>
            <p>4. 驗證：api → db ✓、frontend → db ✗（或理解概念）</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">挑戰</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>在 API Pod 加一條 <code className="text-cyan-400">egress</code> 規則：</p>
            <p>- API 只能連 DB，不能連外網</p>
            <p>- 提示：policyTypes 加 Egress，egress 區塊用 podSelector 指定目標</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">巡堂檢查清單</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>□ kubectl get networkpolicy → db-allow-api-only 存在</p>
            <p>□ POD-SELECTOR 顯示 role=database</p>
            <p>□ api → db 測試通過</p>
            <p>□ frontend → db 測試被擋（或 CNI 不支援已理解）</p>
          </div>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題是跟著剛才的步驟做一遍，確認 api 能連 db、frontend 不能連 db。挑戰題是在 api Pod 上面加一條 egress 規則，限制 api 只能連 database，不能連外網。提示：在 policyTypes 裡面加 Egress，然後在 egress 區塊裡用 podSelector 指定目標。大家動手做。

[▶ 下一頁]`,
  },

  // ── 7-16 回頭操作：NetworkPolicy ──
  {
    title: '回頭操作：NetworkPolicy 常見坑',
    subtitle: 'Loop 5 小結 — 下午因果鏈回顧',
    section: 'Loop 5：NetworkPolicy',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">1.</span>
              <div>
                <p>CNI 不支援</p>
                <p className="text-xs text-slate-400">先確認 CNI / controller；minikube 做 Lab 常用 Calico：minikube start --cni=calico</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">2.</span>
              <div>
                <p>podSelector label 不匹配</p>
                <p className="text-xs text-slate-400">Pod 帶 app=database，Policy 寫 role=database → 沒套到任何 Pod</p>
                <p className="text-xs text-slate-400">用 kubectl get pods --show-labels 確認</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold shrink-0">3.</span>
              <div>
                <p>忘了寫 policyTypes</p>
                <p className="text-xs text-slate-400">K8s 會自動推斷，但明確寫出來是好習慣</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">下午因果鏈回顧</p>
          <div className="text-sm text-slate-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400 text-xs">RBAC 管人</span>
              <span className="text-slate-400">+</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400 text-xs">NetworkPolicy 管網路</span>
            </div>
            <p className="mt-2 text-slate-400 text-xs">誰能操作 → 限制了，Pod 間通訊 → 隔離了</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-3 rounded-lg text-sm text-amber-300">
          <p>接下來：把四堂課學的所有東西串在一起</p>
          <p>從一個完全空的 Namespace → 一步一步建出完整系統</p>
        </div>
      </div>
    ),
    notes: `好，回頭確認一下大家的 NetworkPolicy 做到了。

kubectl get networkpolicy 看一下。有 db-allow-api-only 這條嗎？POD-SELECTOR 欄位顯示的是 role=database 嗎？好。

如果你的 CNI 支援 NetworkPolicy，你應該看到 api 連 db 成功、frontend 連 db 被擋。如果 CNI 不支援，兩個都能連也沒關係，重點是你理解了 YAML 在寫什麼。

常見的坑。第一個，CNI 不支援。這是最常碰到的。你 apply 了 NetworkPolicy，kubectl get networkpolicy 也看得到，但流量照通。因為底層的 CNI 沒有執行這條規則。解法是換支援的 CNI，比如 minikube start --cni=calico。

第二個坑，podSelector 的 label 寫錯。比如你的 Pod 帶的是 app=database，但 NetworkPolicy 的 podSelector 寫的是 role=database。label 不匹配，NetworkPolicy 根本沒有套到任何 Pod 上面。用 kubectl get pods --show-labels 確認 Pod 的 label 跟 NetworkPolicy 裡寫的一致。

第三個坑，忘了寫 policyTypes。如果你不寫 policyTypes，K8s 會根據你有沒有寫 ingress 和 egress 區塊來自動推斷。但明確寫出來是好習慣，避免搞混。

好，Loop 5 結束。到目前為止下午的兩個 Loop 解決了兩個問題。RBAC 管住了人，不該有權限的人做不了危險操作。NetworkPolicy 管住了 Pod 之間的網路，不該連的連不到。

接下來進入今天最重頭戲的部分。我們要把四堂課學的所有東西串在一起，從一個完全空的 Namespace 開始，一步一步建出一套完整的系統。準備好了嗎？

[▶ 下一頁]`,
  },

  // ── 7-16 學員實作解答：NetworkPolicy ──
  {
    title: '解答：只允許 api → database（port 3306）',
    subtitle: 'Loop 5 完成',
    section: 'Loop 5：NetworkPolicy',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做解答：NetworkPolicy YAML 關鍵片段</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p>spec:</p>
            <p className="text-green-400">{'  '}podSelector:</p>
            <p>{'    '}matchLabels:</p>
            <p>{'      '}app: database{'  '}# 套用到 database Pod</p>
            <p>{'  '}policyTypes: [Ingress]</p>
            <p>{'  '}ingress:</p>
            <p>{'  - '}from:</p>
            <p>{'    - '}podSelector:</p>
            <p>{'        '}matchLabels:</p>
            <p className="text-green-400">{'          '}app: api{'  '}# 只允許 api Pod 連進來</p>
            <p>{'    '}ports:</p>
            <p>{'    - '}port: 3306</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證指令</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># 從 frontend pod exec，連 database（應該超時被擋）</p>
            <p>kubectl exec {'<frontend-pod>'} -- curl database-svc:3306 --connect-timeout 3</p>
            <p className="text-slate-500 mt-1"># 從 api pod exec，連 database（應該成功）</p>
            <p>kubectl exec {'<api-pod>'} -- curl database-svc:3306 --connect-timeout 3</p>
            <p className="text-slate-500 mt-1"># 清理</p>
            <p>kubectl delete networkpolicy allow-api-to-db</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">預期結果</p>
          <p className="text-xs text-slate-300 mt-1">frontend → database：超時（Connection timed out）；api → database：成功連線</p>
        </div>
      </div>
    ),
    notes: `來看解答。

NetworkPolicy 的 podSelector 決定「這條規則套到哪個 Pod」，這裡是 app: database。ingress 的 from.podSelector 決定「誰可以連進來」，這裡是 app: api。ports 限制只開 3306。

驗證的方式是 kubectl exec 進去不同的 Pod，用 curl 或 wget 去試連 database-svc:3306。從 frontend Pod 連應該超時，從 api Pod 連應該成功。超時就表示 NetworkPolicy 有效果。

如果兩個都能連，最常見的原因是 CNI 不支援 NetworkPolicy，或者 label 不匹配，Policy 沒有套到正確的 Pod。用 kubectl get pods --show-labels 確認 label。

清理：kubectl delete networkpolicy allow-api-to-db。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 6：從零部署上（7-17, 7-18, 7-19）
  // ============================================================

  // ── 7-17 概念（1/2）：12 步引導上（步驟 1-6）──
  {
    title: '從零部署完整系統：12 步（上）',
    subtitle: '步驟 1-6：底層到上層，一步步疊上去',
    section: 'Loop 6：從零部署（上）',
    duration: '12',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">目標架構</p>
          <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap justify-center text-sm">
              <span className="text-slate-400">使用者</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded text-purple-400">Ingress</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400">Frontend x2</span>
              <span className="text-slate-400">/</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">API x3~10</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-400">MySQL (StatefulSet)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-cyan-400 border-b border-slate-600">
                <th className="text-left py-1 pr-1 w-8">#</th>
                <th className="text-left py-1 pr-2">做什麼</th>
                <th className="text-left py-1 pr-2">對應概念</th>
                <th className="text-left py-1 w-16">堂次</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">1</td>
                <td className="py-1 pr-2">建 Namespace（prod）</td>
                <td className="py-1 pr-2 font-mono text-green-400">Namespace</td>
                <td className="py-1">第五堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">2</td>
                <td className="py-1 pr-2">建 Secret（DB 密碼）</td>
                <td className="py-1 pr-2 font-mono text-green-400">Secret</td>
                <td className="py-1">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">3</td>
                <td className="py-1 pr-2">建 ConfigMap（API 設定）</td>
                <td className="py-1 pr-2 font-mono text-green-400">ConfigMap</td>
                <td className="py-1">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">4</td>
                <td className="py-1 pr-2">MySQL StatefulSet + PVC</td>
                <td className="py-1 pr-2 font-mono text-green-400">StatefulSet</td>
                <td className="py-1">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">5</td>
                <td className="py-1 pr-2">API Deployment + Probe</td>
                <td className="py-1 pr-2 font-mono text-green-400">Deploy+Probe</td>
                <td className="py-1">五+七</td>
              </tr>
              <tr>
                <td className="py-1 pr-1 text-cyan-400 font-bold">6</td>
                <td className="py-1 pr-2">Frontend Deployment</td>
                <td className="py-1 pr-2 font-mono text-green-400">Deployment</td>
                <td className="py-1">第五堂</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/40 p-3 rounded-lg text-sm text-amber-300">
          順序不能亂：Secret → ConfigMap → MySQL → API → Frontend，每一步依賴前一步
        </div>
      </div>
    ),
    notes: `好，從這個 Loop 開始，我們進入今天最核心的部分：從零部署一套完整的生產級系統。

四堂課下來，你學了 Pod、Deployment、Service、Ingress、ConfigMap、Secret、PV、PVC、StatefulSet、Helm、Probe、Resource limits、HPA、RBAC、NetworkPolicy。一大堆概念，每個都分開學過，每個都做過實作。但你有沒有試過把它們全部串在一起？從一個完全空的叢集開始，一步一步建出一個完整的系統？

這就是我們接下來要做的事情。

先看目標架構。使用者透過瀏覽器輸入 myapp.local 這個域名。請求先到 Ingress Controller，Ingress 根據路徑做路由。根路徑 / 導到前端 Service，/api 開頭的導到 API Service。前端有兩個副本。API 有三個副本，加上 HPA 可以自動擴到十個。API 連 MySQL 資料庫，MySQL 用 StatefulSet 跑一個實例，掛 PVC 做持久化。

所有 Pod 都有 Probe 做健康檢查，都有 Resource limits 做資源控制。NetworkPolicy 限制前端只能連 API、API 只能連 MySQL，三層隔離。Secret 存資料庫密碼，ConfigMap 存 API 的設定。

一共 12 個步驟。大家看投影片上的表格。每一步我都標了對應的概念和對應哪堂課學的。

步驟一，建 Namespace。我們不用 default，建一個叫 prod 的 Namespace，把所有資源放在裡面。為什麼？第五堂學的，Namespace 做環境隔離，生產環境有自己的 Namespace。

步驟二，建 Secret。MySQL 需要 root 密碼，這個密碼不能明文寫在 YAML 裡面，用 Secret 存。第六堂學的。

步驟三，建 ConfigMap。API 需要知道資料庫的地址和 Port，這些設定用 ConfigMap 存。第六堂學的。

步驟四，部署 MySQL。用 StatefulSet 加 PVC 加 Headless Service。為什麼用 StatefulSet 不用 Deployment？第六堂學的，因為資料庫需要穩定的網路標識和獨立的儲存。為什麼用 Headless Service？因為 StatefulSet 的每個 Pod 需要自己的 DNS 名稱，像 mysql-0.mysql-headless.prod.svc.cluster.local。

步驟五，部署 API。用 Deployment 跑三個副本。YAML 裡面同時配了 livenessProbe、readinessProbe、startupProbe 三種健康檢查。設了 resources requests 和 limits 做資源控制。從 Secret 讀取資料庫密碼，從 ConfigMap 讀取資料庫地址。一個 Deployment 的 YAML 裡面用到了五六個概念。

步驟六，部署前端。也是用 Deployment，跑兩個副本。前端用 nginx 加上自訂的 ConfigMap 做反向代理，把 /api 開頭的請求轉給 API Service。

這是前六步。從 Namespace 到 Secret 到 ConfigMap 到 MySQL 到 API 到前端，底層到上層，一步一步疊上去。每一步都依賴前一步。Secret 要先建好 MySQL 才能讀到密碼。ConfigMap 要先建好 API 才能讀到設定。MySQL 要先跑起來 API 才能連。順序不能亂。

下一個影片我們就來實際敲指令，把步驟一到六做出來。

[▶ 下一頁]`,
  },

  // ── 7-17 概念（2/2）：步驟 1-6 細節 ──
  {
    title: '步驟 1-6 的 YAML 重點',
    subtitle: '每一步用到哪些概念、為什麼這樣設計',
    section: 'Loop 6：從零部署（上）',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 4：MySQL YAML 三合一</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p><span className="text-green-400 font-mono">Headless Service</span> → clusterIP: None，給 Pod 獨立 DNS</p>
            <p><span className="text-green-400 font-mono">StatefulSet</span> → 穩定序號 mysql-0，有序啟動</p>
            <p><span className="text-green-400 font-mono">volumeClaimTemplates</span> → 每個 Pod 自己的 PVC</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 5：API YAML 五合一</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p><span className="text-green-400 font-mono">Deployment</span> replicas: 3</p>
            <p><span className="text-green-400 font-mono">Probe</span> → liveness + readiness + startup 三種</p>
            <p><span className="text-green-400 font-mono">Resources</span> → requests + limits</p>
            <p><span className="text-green-400 font-mono">Secret</span> → envFrom secretRef 讀密碼</p>
            <p><span className="text-green-400 font-mono">ConfigMap</span> → envFrom configMapRef 讀設定</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
          <p className="text-green-400 font-semibold mb-1 text-sm">依賴鏈</p>
          <div className="flex items-center gap-1 flex-wrap justify-center text-xs">
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Namespace</span>
            <span className="text-green-400 font-bold">→</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Secret</span>
            <span className="text-green-400 font-bold">→</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">ConfigMap</span>
            <span className="text-green-400 font-bold">→</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">MySQL</span>
            <span className="text-green-400 font-bold">→</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">API</span>
            <span className="text-green-400 font-bold">→</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Frontend</span>
          </div>
        </div>
      </div>
    ),
    notes: `我再補充一下各步驟 YAML 的重點，讓大家在動手之前先有個心理地圖。

步驟四的 MySQL YAML 是最複雜的，裡面有三個資源寫在一個檔案裡。第一個是 Headless Service，clusterIP 設成 None。為什麼？因為 StatefulSet 的每個 Pod 需要自己的 DNS 名稱。普通 Service 只有一個 ClusterIP，所有 Pod 共用。Headless Service 讓每個 Pod 有獨立的 DNS，像 mysql-0.mysql-headless.prod.svc.cluster.local。第二個是 StatefulSet 本身。第三個是 volumeClaimTemplates，寫在 StatefulSet 裡面，自動幫每個 Pod 建一個 PVC。

步驟五的 API YAML 是概念最密集的。一個 Deployment 的 YAML 裡面同時用到了五六個概念。replicas 3 是 Deployment 的基本功能。livenessProbe、readinessProbe、startupProbe 是第七堂上午學的。resources requests 和 limits 也是第七堂上午學的。envFrom secretRef 讀 Secret 裡的密碼，envFrom configMapRef 讀 ConfigMap 裡的設定，這兩個是第六堂學的。

依賴鏈要特別注意。Namespace 要最先建，因為後面所有資源都在這個 Namespace 裡面。Secret 和 ConfigMap 要在 MySQL 和 API 之前建好，因為 Pod 啟動時會去讀它們。如果 Secret 不存在，Pod 會出現 CreateContainerConfigError 錯誤。MySQL 要在 API 之前跑起來，因為 API 啟動時會連資料庫。如果資料庫還沒 Ready，API 的 readinessProbe 會一直失敗。

好，概念清楚了，下一支影片我們動手敲指令。

[▶ 下一頁]`,
  },

  // ── 7-18 實作示範上（1/2）：步驟 1-4 ──
  {
    title: '實作示範：步驟 1-4',
    subtitle: 'Namespace → Secret → ConfigMap → MySQL',
    section: 'Loop 6：從零部署（上）',
    duration: '12',
    code: `# Step 1：建 Namespace
kubectl apply -f final-project/01-namespace.yaml
kubectl get ns prod

# Step 2：建 Secret
kubectl apply -f final-project/02-secret.yaml
kubectl get secret -n prod

# Step 3：建 ConfigMap
kubectl apply -f final-project/03-configmap.yaml
kubectl get configmap -n prod

# Step 4：部署 MySQL（三合一：Headless Service + StatefulSet + PVC）
kubectl apply -f final-project/04-mysql.yaml
kubectl get pods -n prod -w          # 等 mysql-0 → 1/1 Running
kubectl get pvc -n prod              # mysql-data-mysql-0 → Bound
kubectl get svc -n prod              # mysql-headless → clusterIP: None`,
    notes: `好，動手做。大家打開終端機。final-project 目錄裡面有 12 個編了號的 YAML 檔案，從 01 到 12。我們按順序來。

步驟一，建 Namespace。

kubectl apply -f final-project/01-namespace.yaml

看一下。

kubectl get ns prod

Status 是 Active。好，我們有了一個乾淨的 prod Namespace。接下來所有資源都放在裡面。

步驟二，建 Secret。

kubectl apply -f final-project/02-secret.yaml

kubectl get secret -n prod

你會看到 mysql-secret 這個 Secret。注意每個指令都要加 -n prod，因為我們的東西在 prod Namespace。如果你覺得每次加 -n prod 很煩，可以用 kubectl config set-context --current --namespace=prod 把預設 Namespace 切成 prod。但我建議上課的時候還是手動加，養成好習慣。生產環境不小心在預設 Namespace 操作是很危險的。

步驟三，建 ConfigMap。

kubectl apply -f final-project/03-configmap.yaml

kubectl get configmap -n prod

你會看到 api-config 這個 ConfigMap。裡面存了資料庫的地址 mysql-0.mysql-headless.prod.svc.cluster.local、port 3306、database 名字。這些設定等一下 API 會用環境變數的方式讀進去。

步驟四，部署 MySQL。這是六步裡面最關鍵的一步。

kubectl apply -f final-project/04-mysql.yaml

這個檔案裡面有三個資源：一個 Headless Service、一個 StatefulSet、一個包含在 StatefulSet 裡的 volumeClaimTemplate。一次 apply 就全部建好。

kubectl get pods -n prod -w

看 mysql-0 的狀態。它會從 Pending 變成 ContainerCreating 變成 Running。MySQL 啟動比較慢，可能要 30 到 60 秒。等到 READY 變成 1/1 就好了。

按 Ctrl+C 停止 watch。看一下 PVC。

kubectl get pvc -n prod

你會看到 mysql-data-mysql-0 這個 PVC，Status 是 Bound。這是 StatefulSet 的 volumeClaimTemplates 自動建的。每個 Pod 有自己的 PVC。

看一下 Service。

kubectl get svc -n prod

有 mysql-headless。clusterIP 是 None，因為它是 Headless Service。

[▶ 下一頁]`,
  },

  // ── 7-18 實作示範上（2/2）：步驟 5-6 ──
  {
    title: '實作示範：步驟 5-6',
    subtitle: 'API Deployment → Frontend Deployment',
    section: 'Loop 6：從零部署（上）',
    duration: '10',
    code: `# Step 5：部署 API（五合一：Deploy + Probe + Resource + Secret + ConfigMap）
kubectl apply -f final-project/05-api.yaml
kubectl get pods -n prod -l app=api   # 等 3 個 Pod 都 1/1 Running
kubectl get svc -n prod               # api-svc

# Step 6：部署 Frontend
kubectl apply -f final-project/06-frontend.yaml
kubectl get pods -n prod -l app=frontend   # 等 2 個 Pod 都 Running

# 確認目前狀態
kubectl get all -n prod
# 預期：1 StatefulSet + 2 Deployment + 6 Pod + 3 Service`,
    notes: `步驟五，部署 API。

kubectl apply -f final-project/05-api.yaml

這個 YAML 很豐富。Deployment 裡面設了 replicas 3、設了 livenessProbe、readinessProbe、startupProbe、設了 resources requests 和 limits、從 Secret 讀密碼用 envFrom secretRef、從 ConfigMap 讀設定用 envFrom configMapRef。同時還建了一個 ClusterIP Service 叫 api-svc。

kubectl get pods -n prod -l app=api

等三個 Pod 都是 Running 1/1。如果有 Pod 卡在 0/1，可能是 readinessProbe 還沒通過。等一下就好了。

步驟六，部署前端。

kubectl apply -f final-project/06-frontend.yaml

kubectl get pods -n prod -l app=frontend

兩個 Pod 都是 Running。前端用 nginx 加上 ConfigMap 掛載的自訂設定檔，裡面設定了 /api/ 的反向代理規則，會把 /api 開頭的請求轉給 api-svc。

到這裡，步驟一到六全部做完了。我們來看一下目前的狀態。

kubectl get all -n prod

你會看到一個 StatefulSet、兩個 Deployment、五個以上的 Pod、三個 Service。功能面上，你的系統已經可以跑了。但還少了 Ingress 讓外面連進來、HPA 做自動擴縮、NetworkPolicy 做網路隔離。這些是下半場的步驟七到十二。

好，大家先跟到步驟六。做完的人可以先歇一下，等一下我們繼續步驟七。

[▶ 下一頁]`,
  },

  // ── 7-19 回頭操作 ──
  {
    title: '回頭操作：確認步驟 1-6',
    subtitle: '常見坑 + 中場打氣',
    section: 'Loop 6：從零部署（上）',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">確認清單</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>{'✓'} <code className="text-xs">statefulset.apps/mysql</code> READY 1/1</p>
            <p>{'✓'} <code className="text-xs">deployment.apps/api</code> READY 3/3</p>
            <p>{'✓'} <code className="text-xs">deployment.apps/frontend</code> READY 2/2</p>
            <p>{'✓'} <code className="text-xs">service/mysql-headless, api-svc, frontend-svc</code></p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見的坑</p>
          <div className="text-sm text-slate-300 space-y-2">
            <p><span className="text-red-400 font-bold">1.</span> 忘了 <code className="text-xs">-n prod</code> → 在 default 裡面找不到東西</p>
            <p><span className="text-red-400 font-bold">2.</span> MySQL Pod 一直 Pending → <code className="text-xs">describe pod</code> 看 PVC/StorageClass</p>
            <p><span className="text-red-400 font-bold">3.</span> API Pod 0/1 → startupProbe 還在跑，等幾十秒</p>
          </div>
        </div>

        <div className="bg-cyan-900/30 border border-cyan-500/50 p-3 rounded-lg text-center">
          <p className="text-cyan-400 font-semibold">你已經完成了整個系統最核心的部分</p>
          <p className="text-sm text-slate-300 mt-1">資料庫在跑、API 在跑、前端在跑 -- 接下來是錦上添花</p>
        </div>
      </div>
    ),
    notes: `好，中場確認一下。

kubectl get all -n prod

大家看一下你的輸出。

有 statefulset.apps/mysql 嗎？READY 是 1/1 嗎？
有 deployment.apps/api 嗎？READY 是 3/3 嗎？
有 deployment.apps/frontend 嗎？READY 是 2/2 嗎？
有 service/mysql-headless、service/api-svc、service/frontend-svc 嗎？

如果以上全部是的，你的進度就對了。

常見的坑。第一個，忘了加 -n prod。你在 default Namespace 裡面看不到東西，不是因為沒建，是因為你看錯地方了。kubectl get pods -n prod，記得加 -n prod。

第二個，MySQL Pod 一直卡在 Pending。kubectl describe pod mysql-0 -n prod 看一下 Events。如果看到 no persistent volumes available for this claim，表示 StorageClass 沒有設好。k3s 和 minikube 預設都有一個 local-path 或 standard 的 StorageClass，通常不會有問題。如果你自己搭的叢集可能需要手動建 StorageClass。

第三個，API Pod 的 READY 是 0/1 不是 1/1。不要緊張，等一下。可能是 startupProbe 還在跑。startupProbe 設了 initialDelaySeconds 加上 periodSeconds 乘以 failureThreshold，可能要等幾十秒才會通過。等它變成 1/1 就好了。如果等了兩分鐘還是 0/1，describe pod 看 Events。

好，做到這裡的同學，我要跟你們說，你已經完成了整個系統最核心的部分。資料庫在跑了，API 在跑了，前端也在跑了。接下來的步驟七到十二是加上外部入口、自動擴縮、安全策略。是錦上添花。但核心骨架已經搭好了。

繼續往下走。

[▶ 下一頁]`,
  },

  // ── 7-19 學員實作解答：從零部署上（步驟 1-6）──
  {
    title: '解答：步驟 1-6 驗收指令',
    subtitle: 'Loop 6 完成',
    section: 'Loop 6：從零部署（上）',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做解答：驗收三個指令</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># 1. 確認 Pod 狀態</p>
            <p>kubectl get pods -n prod</p>
            <p className="text-slate-500"># mysql-0  Running  → StatefulSet 正常</p>
            <p className="text-slate-500 mt-1"># 2. 確認 PVC 已綁定</p>
            <p>kubectl get pvc -n prod</p>
            <p className="text-slate-500"># STATUS: Bound  → 資料不會丟</p>
            <p className="text-slate-500 mt-1"># 3. 進 MySQL 確認能連線</p>
            <p>kubectl exec -n prod mysql-0 -- \</p>
            <p>{'  '}mysql -u root -pmy-secret-password \</p>
            <p>{'  '}-e "SHOW DATABASES;"</p>
            <p className="text-slate-500 mt-1"># 清理（做完全部步驟再清）</p>
            <p>kubectl delete namespace prod</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">步驟 1-6 清單</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p><span className="text-green-400">1.</span> Namespace prod</p>
            <p><span className="text-green-400">2.</span> Secret（mysql-secret）</p>
            <p><span className="text-green-400">3.</span> ConfigMap（mysql-config）</p>
            <p><span className="text-green-400">4.</span> PVC（mysql-pvc）</p>
            <p><span className="text-green-400">5.</span> MySQL StatefulSet + Headless Service</p>
            <p><span className="text-green-400">6.</span> 驗證 mysql-0 Running + PVC Bound</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">預期結果</p>
          <p className="text-xs text-slate-300 mt-1">mysql-0 Running、PVC Bound、SHOW DATABASES 顯示資料庫列表</p>
        </div>
      </div>
    ),
    notes: `來看步驟 1 到 6 的驗收。

三個關鍵指令。第一個，kubectl get pods -n prod，確認 mysql-0 是 Running。第二個，kubectl get pvc -n prod，確認 STATUS 是 Bound，代表 PVC 成功掛載了 PV，資料不會因為 Pod 重啟而消失。第三個，kubectl exec 進去 mysql-0，執行 SHOW DATABASES，能看到資料庫列表就表示 MySQL 本身是正常的。

步驟 1 到 6 是整個系統的核心基礎：Namespace 隔離環境、Secret 保存密碼、ConfigMap 放設定、PVC 持久化資料、StatefulSet 管理有狀態的資料庫。這五個層次缺一不可。

注意：kubectl delete namespace prod 這個清理指令留到步驟 7 到 12 全部做完再執行，現在先不要清理。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 7：從零部署下（7-20, 7-21, 7-22）
  // ============================================================

  // ── 7-20 概念（1/2）：12 步下（步驟 7-12）──
  {
    title: '12 步（下）：步驟 7-12',
    subtitle: '功能完整 → 安全加固 → 彈性擴縮 → 驗證',
    section: 'Loop 7：從零部署（下）',
    duration: '12',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-cyan-400 border-b border-slate-600">
                <th className="text-left py-1 pr-1 w-8">#</th>
                <th className="text-left py-1 pr-2">做什麼</th>
                <th className="text-left py-1 pr-2">對應概念</th>
                <th className="text-left py-1 w-16">堂次</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">7</td>
                <td className="py-1 pr-2">建 Ingress</td>
                <td className="py-1 pr-2 font-mono text-green-400">Ingress</td>
                <td className="py-1">第六堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">8</td>
                <td className="py-1 pr-2">建 HPA</td>
                <td className="py-1 pr-2 font-mono text-green-400">HPA</td>
                <td className="py-1">第七堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">9</td>
                <td className="py-1 pr-2">建 NetworkPolicy</td>
                <td className="py-1 pr-2 font-mono text-green-400">NetworkPolicy</td>
                <td className="py-1">第七堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-amber-400 font-bold">10</td>
                <td className="py-1 pr-2">建 RBAC（選做）</td>
                <td className="py-1 pr-2 font-mono text-green-400">RBAC</td>
                <td className="py-1">第七堂</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-1 pr-1 text-cyan-400 font-bold">11</td>
                <td className="py-1 pr-2">完整驗證</td>
                <td className="py-1 pr-2 font-mono text-green-400">全部</td>
                <td className="py-1">全部</td>
              </tr>
              <tr>
                <td className="py-1 pr-1 text-amber-400 font-bold">12</td>
                <td className="py-1 pr-2">壓測 + 故障模擬（選做）</td>
                <td className="py-1 pr-2 font-mono text-green-400">HPA+自癒</td>
                <td className="py-1">五+七</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">NetworkPolicy 三層隔離</p>
          <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap justify-center text-xs">
              <span className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded text-purple-400">Ingress</span>
              <span className="text-green-400 font-bold">→</span>
              <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400">Frontend</span>
              <span className="text-green-400 font-bold">→</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400">API</span>
              <span className="text-green-400 font-bold">→</span>
              <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-400">MySQL</span>
            </div>
            <p className="text-center text-xs text-red-400 mt-2">Frontend → MySQL 被擋 / 外部 → API 被擋</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，繼續。步驟七到十二。

步驟七，建 Ingress。

kubectl apply -f final-project/07-ingress.yaml

kubectl get ingress -n prod

你會看到 myapp-ingress，HOST 是 myapp.local。path / 導到 frontend-svc，path /api 導到 api-svc。如果你想在本機測試，需要在 /etc/hosts 裡面加一行 127.0.0.1 myapp.local，然後用 minikube tunnel 或者 port-forward 來連。不過在課堂上我們主要確認 Ingress 有建好就行。

步驟八，建 HPA。

kubectl apply -f final-project/08-hpa.yaml

kubectl get hpa -n prod

API 的 HPA 設定是 CPU 超過 50% 就自動擴容，最少 3 個、最多 10 個。TARGETS 欄位現在可能顯示 unknown，等 metrics-server 收集到數據就會有數字。

步驟九，建 NetworkPolicy。

kubectl apply -f final-project/09-networkpolicy.yaml

kubectl get networkpolicy -n prod

你會看到三條 NetworkPolicy。db-policy 保護 MySQL，只讓 api 連。api-policy 保護 API，只讓 frontend 和 Ingress Controller 連。frontend-policy 保護前端，只讓 Ingress Controller 連。三層隔離，非常嚴謹。

步驟十是選做的 RBAC。建一個 prod-viewer Role，讓某個 ServiceAccount 只能在 prod Namespace 裡面看東西不能改。這個跟 Loop 4 做的一樣，只是 Namespace 不同。有興趣的同學可以做，時間不夠的跳過。

[▶ 下一頁]`,
  },

  // ── 7-20 概念（2/2）：完整驗證 ──
  {
    title: '步驟 11：完整驗證',
    subtitle: '12 步全部到位，一個一個確認',
    section: 'Loop 7：從零部署（下）',
    duration: '8',
    code: `# Step 11：完整驗證 — 確認所有資源都在
kubectl get all -n prod
# Pod x6+, Deployment x2, StatefulSet x1, Service x3

kubectl get pvc -n prod              # mysql-data-mysql-0 → Bound
kubectl get ingress -n prod          # myapp-ingress → myapp.local
kubectl get hpa -n prod              # api-hpa → CPU 目標 50%
kubectl get networkpolicy -n prod    # 三條 policy
kubectl get secret -n prod           # mysql-secret
kubectl get configmap -n prod        # api-config`,
    notes: `步驟十一，完整驗證。這一步最重要，我們要確認所有東西都在。

kubectl get all -n prod

你會看到很多東西。我來一個一個確認。Pod 至少有 6 個：mysql-0、api 的三個、frontend 的兩個。Deployment 有兩個：api 和 frontend。StatefulSet 有一個：mysql。Service 有三個：mysql-headless、api-svc、frontend-svc。ReplicaSet 也會列出來。

kubectl get pvc -n prod

mysql-data-mysql-0，Bound。

kubectl get ingress -n prod

myapp-ingress，HOST 是 myapp.local。

kubectl get hpa -n prod

api-hpa，TARGETS 有數字了（或 unknown 也沒關係）。

kubectl get networkpolicy -n prod

三條 policy。

kubectl get secret -n prod

mysql-secret。

kubectl get configmap -n prod

api-config。

全部都在。恭喜，你剛才從一個空的 Namespace 開始，部署了一套完整的生產級系統。用到了 Namespace、Secret、ConfigMap、StatefulSet、PVC、Deployment、Probe、Resource limits、Service、Ingress、HPA、NetworkPolicy。四堂課學的核心概念全部串在一起了。

步驟十二是選做的壓測。跟上午做 HPA 實作一樣，跑一個 busybox Pod 不斷打 api-svc，觀察 HPA 自動擴容。有時間的同學可以做，能看到 Pod 數量從 3 自動增加到 5、6、7 是很有成就感的。

[▶ 下一頁]`,
  },

  // ── 7-21 壓測 + 故障模擬（1/2）──
  {
    title: '壓測：HPA 自動擴縮',
    subtitle: '親眼看到 Pod 從 3 自動增加到 5、6、7',
    section: 'Loop 7：從零部署（下）',
    duration: '8',
    code: `# 壓測：開另一個終端機跑 busybox 不斷打 API
kubectl run load-test -n prod --image=busybox:1.36 --rm -it --restart=Never -- \\
  sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"

# 原終端機觀察 HPA
kubectl get hpa -n prod -w
# TARGETS: 20% → 40% → 60% → 超過 50% 開始擴容
# REPLICAS: 3 → 4 → 5 → ...

# 第三個終端機觀察 Pod 變化
kubectl get pods -n prod -l app=api -w
# 新 Pod：Pending → ContainerCreating → Running`,
    notes: `好，步驟七到十在上一支影片已經帶著做完了。這支影片我們來做步驟十二的壓測和故障模擬，然後讓大家自由練習。

先做壓測。跟上午 HPA 的實作方式一模一樣，只是這次是在 prod Namespace 裡面。

開另一個終端機，跑壓測 Pod。

kubectl run load-test -n prod --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"

回到原來的終端機，觀察 HPA。

kubectl get hpa -n prod -w

大家看 TARGETS 欄位。CPU 使用率在爬。20%、40%、60%。超過 50% 的時候，REPLICAS 開始增加。3 變 4、4 變 5。

同時你可以開第三個終端機看 Pod 的變化。

kubectl get pods -n prod -l app=api -w

新的 Pod 一個一個冒出來。Pending、ContainerCreating、Running。全自動的。

壓測跑個一兩分鐘就好。回到壓測終端機按 Ctrl+C 停止。然後繼續 watch HPA。CPU 使用率會慢慢降，大概五分鐘後 REPLICAS 自動縮回 3。

[▶ 下一頁]`,
  },

  // ── 7-21 故障模擬（2/2）──
  {
    title: '故障模擬：砍 Pod + 砍 Node',
    subtitle: 'Deployment 自我修復 + 多節點容錯',
    section: 'Loop 7：從零部署（下）',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">故障模擬 1：砍 Pod</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-green-400 space-y-1">
            <p>kubectl delete pod api-xxx -n prod</p>
            <p>kubectl get pods -n prod -l app=api -w</p>
            <p className="text-slate-400"># 幾秒內 Deployment 自動補一個新的</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">故障模擬 2：砍 Node（多節點環境）</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-green-400 space-y-1">
            <p>kubectl drain {'<node>'} --ignore-daemonsets --delete-emptydir-data</p>
            <p>kubectl get pods -n prod -o wide -w</p>
            <p className="text-slate-400"># Pod 自動搬到其他 Node</p>
            <p className="text-amber-400"># 記得 uncordon 加回來</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">親眼看到三件事</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>1. HPA 自動擴縮</p>
            <p>2. Deployment 自我修復</p>
            <p>3. Node 故障時 Pod 自動搬家</p>
          </div>
          <p className="text-xs text-slate-400 mt-2">這三個能力 = K8s 在生產環境的核心價值</p>
        </div>
      </div>
    ),
    notes: `好，壓測做完了。接下來做一個故障模擬。

我要故意砍一個 API Pod。

kubectl get pods -n prod -l app=api

挑一個 Pod 的名字。

kubectl delete pod api-某某某 -n prod

kubectl get pods -n prod -l app=api -w

大家看，舊的 Pod 被刪了，但幾秒鐘之內 Deployment 就補了一個新的。Pending、ContainerCreating、Running。全程不需要人介入。如果你不盯著看，你甚至不會知道有一個 Pod 被砍過。

這就是 Deployment 的自我修復能力。第五堂學的。你設了 replicas 3，K8s 就會確保永遠有 3 個 Pod 在跑。少了就補，多了就刪。

如果你是多節點環境，還可以做一個更刺激的實驗。把整個 Node drain 掉，模擬一台機器故障。

kubectl drain 某個worker節點名 --ignore-daemonsets --delete-emptydir-data

這台 Node 上面的所有 Pod 會被驅逐到其他 Node 上面。你用 kubectl get pods -n prod -o wide -w 看，Pod 會在其他 Node 重新建起來。這就是 K8s 多節點架構的價值。單機 Docker 做不到這件事。

drain 完之後記得把 Node 加回來。

kubectl uncordon 那個節點名

好，故障模擬做完了。你親眼看到了三件事。第一，HPA 自動擴縮。第二，Deployment 自我修復。第三，Node 故障時 Pod 自動搬家。這三個能力加在一起，就是 K8s 在生產環境的核心價值。

[▶ 下一頁]`,
  },

  // ── 7-21 學員實作 ──
  {
    title: '學員實作時間',
    subtitle: '必做：12 步從頭到尾自己做 / 挑戰：Helm WordPress + Probe + HPA',
    section: 'Loop 7：從零部署（下）',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">必做題</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>把 12 個步驟從頭到尾自己做一遍</p>
            <p>不看指令，自己敲。做不出來再看</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">挑戰題</p>
          <div className="text-sm text-slate-300 space-y-2">
            <p>用 Helm 安裝 WordPress，再加 Probe + HPA</p>
            <div className="bg-slate-900 p-2 rounded font-mono text-xs text-green-400">
              <p>helm install my-wordpress bitnami/wordpress \</p>
              <p>{'  '}--set resources.requests.cpu=100m</p>
            </div>
            <p className="text-xs text-slate-400">然後建 HPA 綁到 WordPress 的 Deployment</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">清理</p>
          <div className="bg-slate-900 p-2 rounded font-mono text-xs text-green-400">
            kubectl delete namespace prod
          </div>
          <p className="text-xs text-slate-400 mt-1">一行搞定，Namespace 底下全部一起刪</p>
        </div>
      </div>
    ),
    notes: `接下來是大家的自由練習時間。必做題是把 12 個步驟從頭到尾自己做一遍。不看我的指令，自己敲。做不出來就看一下。能不看就不看。

挑戰題是用 Helm 安裝一個 WordPress，然後自己加上 Probe 和 HPA。提示：helm install my-wordpress bitnami/wordpress --set resources.requests.cpu=100m。然後再建一個 HPA 綁到 WordPress 的 Deployment 上面。

做完實驗之後，清理很簡單。

kubectl delete namespace prod

一行搞定。Namespace 底下的所有東西全部一起刪掉。這也是為什麼用 Namespace 做環境隔離的好處之一，清理起來特別方便。

大家動手做。

【巡堂：走動確認學員進度。重點關注：(1) 是否按順序做、(2) MySQL Pod 有沒有起來、(3) API Pod 的 Probe 有沒有通過。卡住的學員優先協助。做完必做題的引導去挑戰題。】

[▶ 下一頁]`,
  },

  // ── 7-22 回頭操作 ──
  {
    title: '回頭操作：確認 12 步',
    subtitle: 'Loop 6-7 小結：從零到完整系統',
    section: 'Loop 7：從零部署（下）',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">你做到哪一步了？</p>
          <div className="text-sm text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400 text-xs">最低標準</span>
              <span>步驟 1-6 做完，MySQL + API + Frontend 都在跑</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400 text-xs">理想狀態</span>
              <span>步驟 1-11 全部做完，所有資源都有</span>
            </div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見的坑</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p><span className="text-red-400 font-bold">1.</span> 步驟順序錯 → Secret 不存在時 Pod 出 CreateContainerConfigError</p>
            <p><span className="text-red-400 font-bold">2.</span> HPA TARGETS 一直 unknown → metrics-server 或 requests 問題</p>
            <p><span className="text-red-400 font-bold">3.</span> Ingress 連不上 → minikube 要 <code className="text-xs">minikube tunnel</code></p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg text-center">
          <p className="text-green-400 font-semibold">從零到完整系統：四堂課的威力</p>
          <p className="text-sm text-slate-300 mt-1">每堂課學的小零件，全部組裝起來就是生產級系統</p>
        </div>
      </div>
    ),
    notes: `好，回頭確認。你的 12 步做到幾步了？

最低標準是步驟一到六做完了。kubectl get all -n prod 能看到 MySQL、API、Frontend 都在跑。

理想狀態是步驟一到十一全部做完。kubectl get all, pvc, ingress, hpa, networkpolicy, secret, configmap -n prod 全部都有東西。

如果你還沒做完也不用急。回去之後有時間可以自己練。YAML 檔案都在 final-project 目錄裡面，按編號做就對了。

常見的坑。第一個，步驟順序搞錯。比如先建 API Deployment 再建 Secret。API 的 YAML 裡面引用了 mysql-secret，如果 Secret 不存在，Pod 會出現 CreateContainerConfigError。解法是按順序來：先 Secret 再 ConfigMap 再 MySQL 再 API。依賴關係決定順序。

第二個，HPA 的 TARGETS 一直是 unknown。跟上午一樣，要嘛是 metrics-server 沒裝，要嘛是 Deployment 沒設 resources.requests。我們的 API Deployment 有設 requests，所以應該不會有這個問題。如果還是 unknown，kubectl top pods -n prod 看看 metrics-server 正不正常。

第三個，Ingress 連不上。這個在 minikube 上需要額外設定。minikube 要跑 minikube tunnel 或者 minikube addons enable ingress。k3s 內建 Traefik Ingress Controller。如果只是確認 Ingress 有建好，kubectl get ingress -n prod 看到就行了。

好，從零部署的兩個 Loop 全部結束。你從一個空的 Namespace 開始，一步一步建了 Namespace、Secret、ConfigMap、StatefulSet、Deployment、Service、Ingress、HPA、NetworkPolicy。12 步走完，一套完整的生產級系統就出來了。

這就是四堂課的威力。每堂課學的東西單獨看都只是一個小零件，但全部組裝起來，就是一個完整的系統。

接下來是今天最後的部分：四堂課的總複習。我們要用一條因果鏈把所有概念串起來。

[▶ 下一頁]`,
  },

  // ── 7-22 學員實作解答：從零部署下（步驟 7-12）──
  {
    title: '解答：步驟 7-12 驗收指令',
    subtitle: 'Loop 7 完成',
    section: 'Loop 7：從零部署（下）',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做解答：關鍵驗收指令</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># Ingress 有 ADDRESS</p>
            <p>kubectl get ingress -n prod</p>
            <p className="text-slate-500 mt-1"># API health check</p>
            <p>curl http://{'<NODE-IP>'}/api/health{'  '}# 回傳 200</p>
            <p className="text-slate-500 mt-1"># HPA 壓測觀察 REPLICAS</p>
            <p>kubectl get hpa -n prod -w</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰解答：RBAC 驗證</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># 成功（有 get 權限）</p>
            <p>kubectl --as=system:serviceaccount:prod:readonly-sa \</p>
            <p>{'  '}get pods -n prod</p>
            <p className="text-slate-500 mt-1"># 失敗 → Forbidden（沒有 delete 權限）</p>
            <p>kubectl --as=system:serviceaccount:prod:readonly-sa \</p>
            <p>{'  '}delete pod {'<pod>'} -n prod</p>
            <p className="text-slate-500 mt-1"># 全部做完後清理</p>
            <p>kubectl delete namespace prod</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">預期結果</p>
          <p className="text-xs text-slate-300 mt-1">Ingress 有 ADDRESS、API 回 200、HPA REPLICAS 隨壓測變化、RBAC 驗證成功 / Forbidden</p>
        </div>
      </div>
    ),
    notes: `來看步驟 7 到 12 的驗收。

第一個：kubectl get ingress -n prod，確認 ADDRESS 欄位有 IP。如果在 minikube 需要先跑 minikube tunnel 才會有 ADDRESS。

第二個：curl http://NODE-IP/api/health，回傳 200 代表 Ingress + Service + Deployment 整條路徑都通了。

第三個：kubectl get hpa -n prod -w，用 load-generator 壓測，看 REPLICAS 隨 CPU 使用率自動增加。

RBAC 驗證跟 Loop 4 一樣，但這次是在 prod Namespace 裡面，ServiceAccount 是 readonly-sa。get pods 成功、delete pod 回 Forbidden，就表示權限控制做對了。

全部驗收完畢之後，kubectl delete namespace prod 一次清掉所有資源。Namespace 刪掉，裡面所有的 Pod、Service、PVC 都一起消失。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 8：總複習 + 結業（7-23, 7-24, 7-25）
  // ============================================================

  // ── 7-23 四堂課總複習（1/2）：因果鏈上半 ──
  {
    title: '四堂課完整因果鏈（上）',
    subtitle: 'Docker 扛不住 → K8s → Pod → Service → Ingress → ConfigMap → Secret → PVC → Deployment → StatefulSet → Helm',
    section: 'Loop 8：總複習 + 結業',
    duration: '8',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-400">Docker 扛不住</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded text-cyan-400 font-bold">K8s</span>
              <span className="text-slate-500 text-xs ml-1">容器編排平台</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-500 ml-2">要跑容器</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400">Pod</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="text-slate-500">IP 會變、外面連不到</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">Service</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-500 ml-2">要域名路由</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded text-purple-400">Ingress</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="text-slate-500">設定寫死</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">ConfigMap</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-500 ml-2">密碼明文</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-400">Secret</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="text-slate-500">資料消失</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded text-amber-400">PV/PVC</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-500 ml-2">單點故障</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400">Deployment</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="text-slate-500">DB 特殊需求</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded text-blue-400">StatefulSet</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-500 ml-2">YAML 太多</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">Helm</span>
            </div>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/40 p-3 rounded-lg text-center">
          <p className="text-cyan-400 text-sm font-semibold">到這裡，功能上完整了</p>
          <p className="text-xs text-slate-400">使用者連得進來、前端能跑、API 能跑、資料不會丟</p>
          <p className="text-xs text-slate-400">接下來：生產環境的考驗...</p>
        </div>
      </div>
    ),
    notes: `好，來到今天最後的部分了。四堂課的總複習。我不打算一個一個概念複習定義，那太無聊了。我要做的是用一條完整的因果鏈，從頭到尾串一遍。每一個概念都是因為上一步有問題才引出來的。這條鏈走完，你的腦袋裡就有一張完整的 K8s 知識地圖。

準備好了嗎？我們從最開頭開始。

四堂課之前，你學完了 Docker。你會用 docker run 跑容器，會寫 Dockerfile build Image，會用 Docker Compose 管多個容器。在你的筆電上跑得好好的。

然後第一個問題來了。你的服務上了生產環境，一台伺服器跑所有容器。某天伺服器掛了，全部服務一起掛。或者流量暴增，一台機器扛不住。你想加第二台、第三台，但手動管太痛苦了。你需要一個工具幫你管一群機器上的一群容器。

這就是 Kubernetes。容器編排平台。把一群機器組成一個叢集，你只要告訴 K8s 你想要什麼狀態，K8s 會幫你實現。

K8s 有了。你要跑容器。但 K8s 不直接管容器。它的最小調度單位是 Pod。一個 Pod 可以包含一個或多個容器，共享網路和儲存。多數時候一個 Pod 就跑一個容器。

Pod 跑起來了。但 Pod 有自己的 IP，這個 IP 是叢集內部的，外面連不到。而且 Pod 會被銷毀重建，IP 會變。你需要一個穩定的入口。

這就是 Service。Service 給一組 Pod 提供穩定的 IP 和 DNS 名稱。Pod 掛了換新的，Service 地址不變。流量自動轉到健康的 Pod。

Service 有了，但你的使用者要用 IP 加 Port 連進來，地址又長又醜。你想要用域名，想要 /api 走 API、/ 走前端。

這就是 Ingress。用域名加路徑做 HTTP 路由。第六堂學的，還加了 TLS 做 HTTPS。

OK，服務跑起來了，使用者也連得進來了。但你的設定寫死在 Docker Image 裡面。改一個環境變數就要重新 build Image。

ConfigMap 解決了這個問題。設定抽出來，不寫死在 Image 裡。改設定不用重 build。

設定分離了。但密碼呢？資料庫密碼寫在 ConfigMap 裡面，任何能讀 ConfigMap 的人都看得到。

Secret 解決了這個問題。敏感資料用 Secret 存，至少做了 Base64 編碼，配合 RBAC 可以限制誰能讀。

設定和密碼都分離了。但 MySQL Pod 重啟了一次，資料全部消失。因為容器的檔案系統是暫時性的，容器重啟就沒了。

PV 和 PVC 解決了這個問題。PersistentVolume 是叢集裡的儲存空間，PersistentVolumeClaim 是 Pod 對儲存的申請。資料寫在 PV 裡，Pod 重啟資料還在。

好，你的 API 跑在 Pod 裡面。但你只跑了一個 Pod。這個 Pod 掛了，服務就斷了。你想跑三個副本，壞了一個自動補上。

Deployment 解決了這個問題。你設 replicas 3，K8s 保證永遠有三個 Pod 在跑。還有滾動更新和回滾的能力。

Deployment 很好用，但資料庫不適合用 Deployment。Deployment 的 Pod 名字是隨機的、沒有順序、共用儲存。資料庫需要固定的名字、有序的啟動、獨立的儲存。

StatefulSet 解決了這個問題。每個 Pod 有穩定的序號和 DNS 名稱，每個 Pod 有自己的 PVC。

好，現在你的系統越來越複雜了。一個 MySQL 就要寫 StatefulSet、Headless Service、PVC、Secret，好幾個 YAML。管理起來很痛苦。

Helm 解決了這個問題。K8s 的套件管理器，一行 helm install 搞定一整套安裝。

到這裡，你的系統功能上是完整的了。使用者能連進來，前端能跑，API 能跑，資料庫的資料不會丟。

但生產環境會考驗你。

[▶ 下一頁]`,
  },

  // ── 7-23 四堂課總複習（2/2）：因果鏈下半 + 知識地圖 ──
  {
    title: '四堂課完整因果鏈（下）',
    subtitle: '生產環境的考驗 → Probe → Resource → HPA → RBAC → NetworkPolicy → 12 步完整系統',
    section: 'Loop 8：總複習 + 結業',
    duration: '7',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-2 text-sm">生產環境的考驗</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-400">服務卡死</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">Probe</span>
              <span className="text-slate-500">liveness + readiness + startup</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-400">資源吃光</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">Resource</span>
              <span className="text-slate-500">requests + limits</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-400">流量暴增</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">HPA</span>
              <span className="text-slate-500">自動擴縮</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-400">誰都能刪</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">RBAC</span>
              <span className="text-slate-500">最小權限原則</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="bg-red-900/40 border border-red-500/50 px-2 py-1 rounded text-red-400">全通不安全</span>
              <span className="text-cyan-400 font-bold">→</span>
              <span className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded text-green-400">NetworkPolicy</span>
              <span className="text-slate-500">三層隔離</span>
            </div>
          </div>
        </div>

        <div className="bg-cyan-900/30 border border-cyan-500/50 p-4 rounded-lg text-center">
          <p className="text-cyan-400 font-bold mb-2">12 步 = 全部串起來</p>
          <div className="flex items-center gap-1 flex-wrap justify-center text-xs">
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">NS</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Secret</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">CM</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">MySQL</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">API</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">FE</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">Ingress</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">HPA</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">NP</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">RBAC</span>
            <span className="text-cyan-400">→</span>
            <span className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">驗證</span>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg text-center">
          <p className="text-green-400 font-bold text-lg">這條因果鏈就是你的 K8s 知識地圖</p>
          <p className="text-sm text-slate-300 mt-1">不用背定義，記住這條鏈就夠了</p>
        </div>
      </div>
    ),
    notes: `但生產環境會考驗你。

Pod Running 但服務卡死了，K8s 不知道。所以你學了 Probe。livenessProbe 偵測死亡然後重啟。readinessProbe 偵測未就緒然後不導流量。startupProbe 給慢啟動的應用緩衝時間。

一個 Pod 有 bug，記憶體一直吃，把整台機器吃光了。所以你學了 Resource limits。requests 是保底，limits 是天花板。超過記憶體被 OOMKilled。

流量暴增，三個 Pod 扛不住，手動 scale 來不及。所以你學了 HPA。根據 CPU 使用率自動擴縮，全自動不需要人。

所有人都有 admin 權限，實習生不小心刪了生產環境。所以你學了 RBAC。定義角色、綁定權限，最小權限原則。

所有 Pod 互相全通，前端被入侵攻擊者直接打資料庫。所以你學了 NetworkPolicy。三層隔離，前端只能連 API，API 只能連資料庫。

最後，你把所有概念串在一起，從一個空的 Namespace 開始，12 步建了一套完整的生產級系統。

這就是四堂課完整的因果鏈。Docker 扛不住，K8s 登場。要跑容器，Pod。要穩定入口，Service。要域名路由，Ingress。設定寫死，ConfigMap。密碼明文，Secret。資料消失，PVC。單點故障，Deployment。資料庫特殊，StatefulSet。YAML 太多，Helm。服務卡死，Probe。資源吃光，Resource limits。流量暴增，HPA。誰都能刪，RBAC。全通不安全，NetworkPolicy。

每一個概念都不是憑空出現的。它出現是因為上一步有問題。解決了這個問題，又冒出新問題，又需要新概念。一環扣一環，這就是學習的正確方式。

你不需要背這些概念的定義。你只需要記住這條因果鏈。遇到問題的時候，沿著鏈走就知道該用什麼工具。

這條因果鏈就是你的 K8s 知識地圖。

[▶ 下一頁]`,
  },

  // ── 7-24 學習路線 + Q&A ──
  {
    title: '學習路線建議 + Q&A',
    subtitle: '接下來可以往哪個方向走',
    section: 'Loop 8：總複習 + 結業',
    duration: '10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-cyan-400 border-b border-slate-600">
                <th className="text-left py-1 pr-2">方向</th>
                <th className="text-left py-1">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50">
                <td className="py-2 pr-2 font-semibold text-amber-400">CKA 認證</td>
                <td className="py-2 text-xs">CNCF 官方認證，線上實作考試，業界認可度高。四堂課涵蓋約 60%</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 pr-2 font-semibold text-green-400">Service Mesh</td>
                <td className="py-2 text-xs">Istio — Sidecar Proxy 做流量控制、熔斷、鏈路追蹤</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 pr-2 font-semibold text-purple-400">GitOps</td>
                <td className="py-2 text-xs">ArgoCD — git push 自動部署，版本歷史 + 回滾</td>
              </tr>
              <tr className="border-b border-slate-700/50">
                <td className="py-2 pr-2 font-semibold text-blue-400">監控</td>
                <td className="py-2 text-xs">Prometheus + Grafana — 收集指標 + 儀表板</td>
              </tr>
              <tr>
                <td className="py-2 pr-2 font-semibold text-cyan-400">CI/CD</td>
                <td className="py-2 text-xs">GitHub Actions + ArgoCD = 完整 Pipeline</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2 text-sm">推薦資源</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p><span className="text-amber-400">K8s 官方文件</span> — CKA 考試可查，必須熟悉</p>
            <p><span className="text-amber-400">Killer.sh</span> — CKA 模擬考平台</p>
            <p><span className="text-amber-400">KodeKloud</span> — 互動式練習環境</p>
            <p><span className="text-amber-400">K8s the Hard Way</span> — 從零手動搭建叢集</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，因果鏈串完了。接下來聊聊你學完這四堂課之後可以往哪個方向走。

第一個推薦的方向是考 CKA。CKA 全名 Certified Kubernetes Administrator，CNCF 官方認證。業界認可度非常高，很多公司的 DevOps 職缺會明確要求有 CKA。

CKA 的考試形式是線上實作。不是選擇題，是給你一個真實的 K8s 叢集，讓你在上面操作。兩個小時做完 15 到 20 題。而且考試的時候可以查 K8s 官方文件，所以不用死背指令，重要的是你知道怎麼找、怎麼用。

我們四堂課學的內容大概涵蓋了 CKA 60% 左右的知識點。還需要額外學的包括：用 kubeadm 從零搭建叢集、etcd 備份和還原、Taint 和 Toleration、Node Affinity、PodDisruptionBudget、更深入的網路除錯。這些在 CKA 的備考課程裡都會教。

如果你的角色偏開發不是運維，可以考 CKAD，Certified Kubernetes Application Developer。偏安全可以考 CKS，Certified Kubernetes Security Specialist。

第二個方向是 Service Mesh。我們學了 Service 做基本的流量轉發，但如果你的微服務架構更複雜，需要做流量控制、熔斷、鏈路追蹤，就需要 Service Mesh。最知名的是 Istio。它在每個 Pod 旁邊放一個 Sidecar Proxy，攔截所有進出的流量做管控。還記得第四堂學的 Sidecar 模式嗎？Istio 就是 Sidecar 的極致應用。

第三個方向是 GitOps。我們目前都是手動 kubectl apply 部署的。但在企業環境裡，你不會讓人手動操作生產環境。你會用 GitOps 的方式：把所有 YAML 放在 Git 倉庫裡，用 ArgoCD 這類工具監控倉庫。當你 git push 更新 YAML，ArgoCD 自動幫你 apply 到叢集上。整個部署流程是自動化的，而且有完整的版本歷史和回滾能力。

第四個方向是監控。你的服務跑起來了，但你怎麼知道它跑得好不好？CPU 用了多少、請求量多少、錯誤率多少？這需要監控系統。最常用的組合是 Prometheus 加 Grafana。Prometheus 負責收集指標，Grafana 負責畫漂亮的儀表板。用 Helm 一行就能裝。

第五個方向是 CI/CD 整合。寫好程式碼之後，自動跑測試、自動 build Docker Image、自動 push 到 Registry、自動部署到 K8s。GitHub Actions 可以做到這些。搭配 ArgoCD 就是完整的 CI/CD + GitOps Pipeline。

推薦的學習資源。K8s 官方文件是最好的參考，CKA 考試也能查，一定要熟悉它的結構。Killer.sh 是 CKA 模擬考平台，跟真實考試很像。KodeKloud 有互動式練習環境，適合邊學邊做。如果你想深入理解 K8s 的底層原理，可以挑戰 Kubernetes the Hard Way，從零手動搭建叢集，不用任何工具。

好，接下來是 Q&A 時間。大家有什麼問題都可以問。不管是今天的內容，還是前幾堂課的，或者是你在工作中遇到的 K8s 問題，都可以。

（Q&A 環節，依現場狀況回答）

[▶ 下一頁]`,
  },

  // ── 7-25 結業 ──
  {
    title: '結業',
    subtitle: '四堂課的成長回顧',
    section: 'Loop 8：總複習 + 結業',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">四堂課，你經歷了什麼？</p>
          <div className="text-sm text-slate-300 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold min-w-[60px]">第四堂</span>
              <span>第一次看到 K8s 架構圖，腦袋一片混亂。硬著頭皮寫出第一個 Pod YAML</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold min-w-[60px]">第五堂</span>
              <span>Deployment 自動修復、Service 讓瀏覽器連到 K8s。跨過了一道門</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold min-w-[60px]">第六堂</span>
              <span>Ingress、ConfigMap、Secret、PVC、StatefulSet、Helm。開始像生產系統了</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold min-w-[60px]">第七堂</span>
              <span>Probe + Resource + HPA + RBAC + NetworkPolicy。12 步建完整系統</span>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg text-center">
          <p className="text-green-400 font-bold text-lg mb-2">你手上有了一張完整的地圖</p>
          <p className="text-sm text-slate-300">每個節點你都走過了。接下來的路，你可以自己走了。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">最後三個建議</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p><span className="text-amber-400 font-bold">1.</span> 12 步自己再做一遍，不看講義</p>
            <p><span className="text-amber-400 font-bold">2.</span> 在你自己的專案裡用起來。學過的不用就會忘</p>
            <p><span className="text-amber-400 font-bold">3.</span> 想要有份量的認證，去考 CKA</p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-slate-400 text-lg">大家辛苦了。我們後會有期。</p>
        </div>
      </div>
    ),
    notes: `好，Q&A 結束了。我們的課程也走到終點了。

讓我最後花幾分鐘跟大家說幾句話。

回想四堂課之前，也就是第四堂的第一支影片。那時候你剛學完 Docker，覺得容器很酷。docker run 一行指令就能跑一個 nginx。Docker Compose 讓你一次啟動前端加後端加資料庫。你覺得這東西很方便。

然後我問了你一個問題：如果你有一百台伺服器、五百個容器要管呢？Docker Compose 管得了一台機器上的容器，但管不了一百台機器。服務掛了誰幫你重啟？流量大了誰幫你擴容？機器壞了上面的容器怎麼辦？

就是這個問題把你帶進了 Kubernetes 的世界。

四堂課走下來，你經歷了什麼？

第四堂，你第一次看到 K8s 的架構圖，Master Node、Worker Node、etcd、API Server、Scheduler、Controller Manager，一堆名詞砸過來，腦袋一片混亂。但你硬著頭皮跟著做，寫出了人生第一個 Pod 的 YAML，用 kubectl apply 把它跑起來了。那一刻你發現，K8s 好像也沒那麼恐怖。

第五堂，你學了 Deployment，第一次看到 K8s 自動幫你修復。故意砍一個 Pod，幾秒鐘後新的 Pod 就出現了。你學了 Service，第一次用瀏覽器連到 K8s 裡面跑的 nginx。那個頁面跳出來的時候，你知道你跨過了一道門。

第六堂，事情變得真實了。你用 Ingress 設了域名，用 ConfigMap 和 Secret 分離了設定，用 PVC 讓資料持久化，用 StatefulSet 跑了 MySQL，用 Helm 一行裝好了複雜的應用。你建出來的東西開始像一個真正的生產系統了。

第七堂，也就是今天，你加上了 Probe 做健康檢查、Resource limits 做資源控制、HPA 做自動擴縮、RBAC 做權限管理、NetworkPolicy 做網路隔離。然後你把這些全部串在一起，從一個空的 Namespace 開始，12 步建了一套完整的系統。

你知道嗎，有很多人學 K8s 學了好幾個月，看了一堆文章和影片，但從來沒有從零到一建過一套完整的系統。你今天做到了。

我知道四堂課的資訊量很大。你不可能記住每一條指令、每一個 YAML 的寫法。但沒關係。你不需要記住所有細節。你需要記住的是那條因果鏈。Docker 扛不住所以 K8s。要跑容器所以 Pod。要穩定入口所以 Service。一路走到 NetworkPolicy。

這條因果鏈就是你的地圖。

我用一個比喻來結束。你現在手上有一張完整的地圖。地圖上的每一個節點你都走過了。Pod 走過了、Service 走過了、Ingress 走過了、RBAC 走過了。你知道每個節點是什麼、為什麼在那裡、怎麼到達。

接下來的路，你可以自己走了。

碰到新的問題，拿出地圖看看有沒有對應的節點。地圖上沒有的，查文件、找社群、動手試。你有了基礎，剩下的就是累積經驗。

最後三個建議。第一，把今天的 12 步再自己做一遍，不看講義。做不出來的地方就是還需要加強的。第二，在你自己的專案裡用起來。學過的不用就會忘。第三，如果想要有份量的認證，去考 CKA。

大家辛苦了。四堂課能走到這裡的人都不簡單。希望這門課能成為你技術道路上的一個轉折點。

我們後會有期。

[▶ 課程結束]`,
  },
]
