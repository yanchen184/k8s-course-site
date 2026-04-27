# 第七堂下午逐字稿 v3 — 因果鏈敘事（Loop 4-8）

> 15 支影片：7-11 到 7-25
> 主線：RBAC 權限控制 → NetworkPolicy 網路隔離 → 從零部署完整系統 → 四堂課總複習 → 結業
> 因果鏈銜接上午：Probe/Resource/HPA 都設好了，服務扛得住了，但人和網路還沒管

---

# 影片 7-11：RBAC 概念 — 誰都能刪 Pod（~15min）

## 本集重點

- 接上午因果鏈：Probe + Resource + HPA 搞定了服務穩定性，但「人」的問題還沒解決
- 恐怖故事：實習生 kubectl delete namespace production
- RBAC = Role-Based Access Control，基於角色的存取控制
- 核心邏輯：誰（Subject）+ 能做什麼（Role）= 綁定（RoleBinding）
- 四個物件：Role、ClusterRole、RoleBinding、ClusterRoleBinding
- Role vs ClusterRole：單一 Namespace vs 整個叢集
- 比喻：公司門禁卡
- ServiceAccount：Pod 的身份（不是人，是程式）
- 常見場景：開發者只讀、運維完整權限

| 物件 | 作用範圍 | 職責 |
|:---|:---|:---|
| Role | 單一 Namespace | 定義能對什麼資源做什麼動作 |
| ClusterRole | 整個叢集 | 同上，但跨 Namespace |
| RoleBinding | 單一 Namespace | 把 Role 綁到某人身上 |
| ClusterRoleBinding | 整個叢集 | 把 ClusterRole 綁到某人身上 |

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["pods", "services"]
    verbs: ["get", "list", "watch"]
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: viewer-sa
  namespace: default
```

```yaml
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
  apiGroup: rbac.authorization.k8s.io
```

## 逐字稿

好，大家午休回來了。我們接著上午的因果鏈繼續往下走。

上午我們解決了三個問題。第一個，Pod Running 但服務卡死，用 Probe 解決。第二個，一個 Pod 吃光整台機器資源，用 Resource limits 解決。第三個，流量暴增手動 scale 來不及，用 HPA 解決。三條因果鏈串下來，你的服務已經具備了健康檢查、資源隔離、自動彈性擴縮的能力。

但我在上午結尾的時候提了一個問題，不知道大家還記不記得。你的叢集上有十個開發者，每個人都拿到了 admin 權限的 kubeconfig。某天有個人在跑清理腳本的時候，不小心打了 kubectl delete namespace production。猜猜怎麼了？production Namespace 底下的所有東西，Deployment、Pod、Service、Secret、PVC，全部瞬間消失。整個生產環境掛掉。

這不是我編的。這種事在業界真的發生過。2017 年 GitLab 就出過一次大事故，工程師在操作資料庫的時候誤刪了生產環境的資料，導致服務中斷了好幾個小時。雖然那次不是 K8s 的問題，但道理是一樣的：不該有那麼大權限的人拿到了那麼大的權限。

我們來想想，現在你的叢集是什麼狀態。你用 k3s 或 minikube 建的叢集，所有人用同一個 kubeconfig，所有人都是 cluster-admin。cluster-admin 是什麼？就是上帝權限，什麼都能做。建、改、刪，所有 Namespace、所有資源，通通可以。

Docker 有沒有這個問題？Docker 更糟。Docker 根本沒有內建的權限控制。只要你能連到 Docker Socket，你就等於 root。所有容器你都能停、都能刪、都能進去看。K8s 至少提供了一套完整的權限控制機制，叫做 RBAC。

RBAC，全名 Role-Based Access Control，中文叫基於角色的存取控制。它的核心邏輯只有一句話：誰加上能做什麼等於綁定。用更具體的方式說就是三個元素。第一個是 Subject，就是「誰」，可以是一個使用者 User、一個群組 Group、或者一個 ServiceAccount。第二個是 Role，就是「能做什麼」，定義了允許的操作清單。第三個是 Binding，把 Role 綁到 Subject 身上。

RBAC 一共有四個物件。Role 和 ClusterRole 負責定義「能做什麼」，差別是作用範圍。Role 只在一個 Namespace 裡面有效。比如你建了一個 Role 叫 pod-viewer，放在 default Namespace，那這個 Role 只能控制 default Namespace 裡的資源。ClusterRole 是整個叢集有效的，不限 Namespace。

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

---

# 影片 7-12：RBAC 實作 — 只讀使用者（~12min）

## 本集重點

- 建 ServiceAccount + Role + RoleBinding
- 用 --as 模擬身份測試
- get pods 成功、delete pod 被拒
- 驗證權限隔離

學員實作：
- 必做：建只讀 Role + RoleBinding，驗證不能 delete
- 挑戰：建一個可以管 Deployment 但不能碰 Secret 的 Role

```bash
# Step 1：建立三個資源
kubectl apply -f rbac-viewer.yaml

# Step 2：確認建好了
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding

# Step 3：用 viewer-sa 的身份查看 Pod（應該成功）
kubectl get pods --as=system:serviceaccount:default:viewer-sa

# Step 4：用 viewer-sa 的身份嘗試刪除（應該被拒）
kubectl delete pod <任意pod名> --as=system:serviceaccount:default:viewer-sa

# Step 5：用 viewer-sa 的身份嘗試建立（應該被拒）
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa

# Step 6：確認用預設 admin 身份可以操作
kubectl get pods
kubectl run test-admin --image=nginx
kubectl delete pod test-admin
```

## 逐字稿

好，來動手做。我們要建三個資源：一個 ServiceAccount、一個 Role、一個 RoleBinding。把它們組合起來，做出一個只能看不能改的使用者。

先部署。rbac-viewer.yaml 這個檔案裡面包含了剛才講的三個 YAML，用三個橫線分隔開。

kubectl apply -f rbac-viewer.yaml

你會看到三行輸出。serviceaccount/viewer-sa created。role.rbac.authorization.k8s.io/pod-viewer created。rolebinding.rbac.authorization.k8s.io/viewer-binding created。三個都建好了。

確認一下。

kubectl get serviceaccount viewer-sa

看到了，AGE 是幾秒。

kubectl get role pod-viewer

看到了。

kubectl get rolebinding viewer-binding

也看到了。三個資源都在。

好，現在來測試。K8s 提供了一個非常好用的旗標叫 --as，可以模擬用其他身份來操作。格式是 system:serviceaccount: 加上 namespace 加上冒號加上名字。

先試用 viewer-sa 的身份查看 Pod。

kubectl get pods --as=system:serviceaccount:default:viewer-sa

大家看，成功了。你可以看到 Pod 的列表。因為 pod-viewer 這個 Role 有 get 和 list 的權限。

好，現在試刪除。隨便找一個 Pod 的名字。

kubectl delete pod nginx-resource-demo-隨便一個hash --as=system:serviceaccount:default:viewer-sa

大家猜結果是什麼？

看，Error from server (Forbidden)。完整的錯誤訊息是 pods 某某某 is forbidden: User "system:serviceaccount:default:viewer-sa" cannot delete resource "pods" in API group "" in the namespace "default"。

被拒絕了。因為我們的 Role 沒有 delete 這個 verb。K8s 很精確地告訴你：你沒有刪除 Pod 的權限。

再試建立一個新的 Pod。

kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa

一樣被拒。cannot create resource "pods"。沒有 create 權限。

那如果我們不加 --as 呢？那就是用你預設的 admin 身份。

kubectl get pods

正常。

kubectl run test-admin --image=nginx

成功建立了。因為你的 admin 有所有權限。

kubectl delete pod test-admin

成功刪除。

看到差別了吧。同一個叢集，同一個 Namespace，但不同的身份有不同的權限。viewer-sa 只能看，admin 什麼都能做。這就是 RBAC 的威力。

在企業環境裡，你不會讓每個人都用 admin。你會根據角色建不同的 ServiceAccount 或 User，綁定不同的 Role。開發人員綁只讀的 Role，CI/CD 綁有部署權限的 Role，只有 SRE 才拿完整權限。

好，接下來是大家的實作時間。必做題是跟著我剛才的步驟做一遍。建 ServiceAccount、Role、RoleBinding，然後用 --as 測試。確認 get pods 成功，delete pod 被拒。

挑戰題是自己寫一個新的 Role，允許 get、list、create、update、delete deployments，但不能碰 secrets。然後建一個新的 ServiceAccount 綁上去，用 --as 測試能操作 Deployment 但不能讀 Secret。提示：resources 那個欄位可以寫多條 rule，每條 rule 指定不同的 resources 和 verbs。

大家動手做，有問題舉手。

---

# 影片 7-13：回頭操作 Loop 4（~5min）

## 本集重點

- 帶做 RBAC
- 常見坑：--as 格式寫錯、忘記指定 namespace、roleRef 寫錯
- Loop 4 小結：RBAC 解決了「誰都能刪」的問題

## 逐字稿

好，回頭確認一下大家的 RBAC 做到了。

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

---

# 影片 7-14：NetworkPolicy 概念 — 叢集內全通不安全（~15min）

## 本集重點

- 接 Loop 4：RBAC 控制了「人」的權限，但 Pod 之間呢？
- K8s 預設：所有 Pod 全部互通
- 問題：前端 Pod 可以直接連 DB，如果前端被入侵，攻擊者直通 DB
- Docker 對照：docker network 做隔離
- NetworkPolicy = Pod 等級的防火牆
- 核心結構：podSelector + policyTypes + ingress/egress
- 注意：這裡的 ingress/egress 跟 Ingress Controller 不同
- 一旦套了 NetworkPolicy，不在規則內的流量全部被拒
- CNI 支援注意：Flannel 不支援、Calico/Cilium 支援

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
spec:
  podSelector:
    matchLabels:
      role: database
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api
      ports:
        - protocol: TCP
          port: 3306
```

## 逐字稿

好，我們繼續因果鏈。上一個 Loop 用 RBAC 管住了「人」。開發人員只能看不能刪，實習生碰不到生產環境。人的問題解決了。

但是 Pod 之間呢？

K8s 預設的網路策略是什麼？全通。叢集裡面所有的 Pod，不管在哪個 Namespace，不管掛什麼 label，都可以互相通訊。前端 Pod 可以連 API Pod，API Pod 可以連 MySQL Pod。這很合理。但同時，前端 Pod 也可以直接連 MySQL Pod。這就不合理了。

前端為什麼需要直連資料庫？正常架構下不需要。前端只需要連 API，API 再去連資料庫。但預設情況下，K8s 不會阻止前端直連資料庫。

這有什麼問題？假設你的前端 Pod 有一個安全漏洞，被攻擊者入侵了。如果網路是全通的，攻擊者可以從前端 Pod 直接連到資料庫 Pod，讀取或者修改資料。這叫橫向移動，是安全攻擊裡最常見的手法之一。入侵一個弱點之後，在內部網路裡面橫著走，一路打到高價值目標。

用 Docker 的經驗來想。Docker 有 network 隔離的概念。你建一個 frontend-net、一個 backend-net，把前端容器放在 frontend-net，把資料庫放在 backend-net。不同 network 的容器不能互相連線。Docker Compose 裡面你也可以用 networks 欄位做隔離。

K8s 的做法比 Docker 更靈活，叫 NetworkPolicy。NetworkPolicy 是 Pod 等級的防火牆。你可以用 label 篩選目標 Pod，然後指定只有哪些 Pod 才能連進來或連出去。比 Docker 的 network 隔離更精細，因為 Docker 的隔離是以整個 network 為單位，K8s 可以做到以單個 Pod 為單位。

來看 NetworkPolicy 的 YAML 結構。一共四個區塊。

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

---

# 影片 7-15：NetworkPolicy 實作（~12min）

## 本集重點

- 部署 frontend + api + db 三個 Deployment + Service
- 驗證預設全通：frontend → db OK
- apply NetworkPolicy
- 驗證隔離：api → db OK，frontend → db 被擋（如果 CNI 支援）

學員實作：
- 必做：三個服務 + NetworkPolicy → 驗證
- 挑戰：加 egress 規則限制 Pod 對外連線

```bash
# Step 1：部署三個服務
kubectl apply -f networkpolicy-lab.yaml
kubectl get pods -l "role in (frontend,api,database)"
kubectl get svc

# Step 2：先驗證全通（還沒套 NetworkPolicy）
# 從 frontend 連 db
FRONTEND_POD=$(kubectl get pods -l role=frontend -o jsonpath='{.items[0].metadata.name}')
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80
# 應該有回應 = 全通

# 從 api 連 db
API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80
# 應該有回應 = 全通

# Step 3：套上 NetworkPolicy
kubectl apply -f networkpolicy-db-only-api.yaml
kubectl get networkpolicy

# Step 4：再次測試
# 從 api 連 db（應該通）
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80

# 從 frontend 連 db（如果 CNI 支援 NetworkPolicy，應該被擋）
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80
# timeout = 被擋了

# Step 5：確認 frontend 連 api 還是通的
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://api-svc:80
```

## 逐字稿

好，我們來實作。這個實驗要部署三個服務：frontend、api、database。然後先驗證預設全通，再套上 NetworkPolicy，驗證隔離效果。

先部署。networkpolicy-lab.yaml 裡面有三個 Deployment 和三個 Service。三個 Deployment 都用 nginx 來模擬，差別只是 label 不同。frontend 的 Pod 帶 role=frontend，api 的帶 role=api，database 的帶 role=database。

kubectl apply -f networkpolicy-lab.yaml

等 Pod 跑起來。

kubectl get pods -l "role in (frontend,api,database)"

六個 Pod 都是 Running。好。看一下 Service。

kubectl get svc

有 frontend-svc、api-svc、db-svc 三個 ClusterIP Service。

現在還沒套 NetworkPolicy，所有 Pod 之間應該是全通的。我們來驗證。

先從 frontend Pod 連 database。

FRONTEND_POD=$(kubectl get pods -l role=frontend -o jsonpath='{.items[0].metadata.name}')

kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80

你會看到 nginx 的預設歡迎頁面。有回應，表示 frontend 可以連到 database。在正常的安全架構下，這不應該被允許。

再從 api Pod 連 database。

API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')

kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80

一樣有回應。api 也能連 database。這個是合理的，因為 API 需要存取資料庫。

好，現在套上 NetworkPolicy。

kubectl apply -f networkpolicy-db-only-api.yaml

這個 NetworkPolicy 的內容就是剛才概念講的那個 YAML。podSelector 選 role=database 的 Pod，只允許 role=api 的 Pod 透過 TCP port 80 連進來。

kubectl get networkpolicy

你會看到 db-allow-api-only 這條 NetworkPolicy，POD-SELECTOR 顯示 role=database。

好，現在重新測試。

先從 api 連 database。

kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80

還是有回應。因為 api Pod 帶 role=api label，在允許清單裡面。

再從 frontend 連 database。

kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80

如果你的 CNI 支援 NetworkPolicy，這個指令會在 3 秒後 timeout。因為 frontend Pod 的 label 是 role=frontend，不在 NetworkPolicy 的允許清單裡面，流量被擋掉了。

如果你的 CNI 不支援，這邊還是會成功。不用擔心，概念你已經理解了。在生產環境用 Calico 或 Cilium 就會生效。

最後確認一下 frontend 連 api 還是通的。

kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://api-svc:80

有回應。因為我們的 NetworkPolicy 只套在 database Pod 上面，api Pod 沒有任何 NetworkPolicy 限制，所以 frontend 連 api 不受影響。

這就是 NetworkPolicy 的效果。database 被保護起來了，只有 api 能連。frontend 連 database 被擋，但 frontend 連 api 不受影響。三層架構的網路隔離就是這樣做的。

接下來是大家的實作時間。必做題是跟著剛才的步驟做一遍，確認 api 能連 db、frontend 不能連 db。挑戰題是在 api Pod 上面加一條 egress 規則，限制 api 只能連 database，不能連外網。提示：在 policyTypes 裡面加 Egress，然後在 egress 區塊裡用 podSelector 指定目標。大家動手做。

---

# 影片 7-16：回頭操作 Loop 5（~5min）

## 本集重點

- 帶做 NetworkPolicy
- 常見坑：CNI 不支援、podSelector label 寫錯、忘了 policyTypes
- Loop 5 小結：NetworkPolicy 解決了「叢集內全通」的問題
- 下午因果鏈回顧：RBAC 管人 + NetworkPolicy 管 Pod 之間的網路

## 逐字稿

好，回頭確認一下大家的 NetworkPolicy 做到了。

kubectl get networkpolicy 看一下。有 db-allow-api-only 這條嗎？POD-SELECTOR 欄位顯示的是 role=database 嗎？好。

如果你的 CNI 支援 NetworkPolicy，你應該看到 api 連 db 成功、frontend 連 db 被擋。如果 CNI 不支援，兩個都能連也沒關係，重點是你理解了 YAML 在寫什麼。

常見的坑。第一個，CNI 不支援。這是最常碰到的。你 apply 了 NetworkPolicy，kubectl get networkpolicy 也看得到，但流量照通。因為底層的 CNI 沒有執行這條規則。解法是換支援的 CNI，比如 minikube start --cni=calico。

第二個坑，podSelector 的 label 寫錯。比如你的 Pod 帶的是 app=database，但 NetworkPolicy 的 podSelector 寫的是 role=database。label 不匹配，NetworkPolicy 根本沒有套到任何 Pod 上面。用 kubectl get pods --show-labels 確認 Pod 的 label 跟 NetworkPolicy 裡寫的一致。

第三個坑，忘了寫 policyTypes。如果你不寫 policyTypes，K8s 會根據你有沒有寫 ingress 和 egress 區塊來自動推斷。但明確寫出來是好習慣，避免搞混。

好，Loop 5 結束。到目前為止下午的兩個 Loop 解決了兩個問題。RBAC 管住了人，不該有權限的人做不了危險操作。NetworkPolicy 管住了 Pod 之間的網路，不該連的連不到。

接下來進入今天最重頭戲的部分。我們要把四堂課學的所有東西串在一起，從一個完全空的 Namespace 開始，一步一步建出一套完整的系統。準備好了嗎？

---

# 影片 7-17：從零部署引導 — 完整系統 12 步（上）（~12min）

## 本集重點

- 四堂課學了所有概念，現在串起來
- 目標架構：使用者 → Ingress → 前端 / API → MySQL
- 完整系統需要 12 個步驟，涵蓋四堂課所有核心概念
- 步驟 1-6 概述：Namespace → Secret → ConfigMap → MySQL → API → Frontend

| 步驟 | 做什麼 | 對應概念 | 對應學的堂次 |
|:---:|:---|:---|:---:|
| 1 | 建 Namespace（prod） | Namespace | 第五堂 |
| 2 | 建 Secret（DB 密碼） | Secret | 第六堂 |
| 3 | 建 ConfigMap（API 設定） | ConfigMap | 第六堂 |
| 4 | MySQL StatefulSet + PVC + Headless Service | StatefulSet + PVC | 第六堂 |
| 5 | API Deployment + Service + Probe + Resource | Deployment + Probe + Resource | 第五堂 + 第七堂 |
| 6 | Frontend Deployment + Service | Deployment | 第五堂 |
| 7 | Ingress | Ingress | 第六堂 |
| 8 | HPA | HPA | 第七堂 |
| 9 | NetworkPolicy | NetworkPolicy | 第七堂 |
| 10 | RBAC（選做） | RBAC | 第七堂 |
| 11 | 完整驗證 | 全部 | 全部 |
| 12 | 壓測 + 故障模擬（選做） | HPA + 自我修復 | 第五堂 + 第七堂 |

## 逐字稿

好，從這個 Loop 開始，我們進入今天最核心的部分：從零部署一套完整的生產級系統。

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

---

# 影片 7-18：從零部署（上）實作示範（~12min）

## 本集重點

- 帶著做步驟 1-6
- 每一步都驗證結果

```bash
# Step 1：建 Namespace
kubectl apply -f final-project/01-namespace.yaml
kubectl get ns prod

# Step 2：建 Secret
kubectl apply -f final-project/02-secret.yaml
kubectl get secret -n prod

# Step 3：建 ConfigMap
kubectl apply -f final-project/03-configmap.yaml
kubectl get configmap -n prod

# Step 4：部署 MySQL
kubectl apply -f final-project/04-mysql.yaml
kubectl get pods -n prod -w
# 等 mysql-0 變成 1/1 Running
kubectl get pvc -n prod
kubectl get svc -n prod

# Step 5：部署 API
kubectl apply -f final-project/05-api.yaml
kubectl get pods -n prod -l app=api
# 等 3 個 Pod 都 Running
kubectl get svc -n prod

# Step 6：部署 Frontend
kubectl apply -f final-project/06-frontend.yaml
kubectl get pods -n prod -l app=frontend
# 等 2 個 Pod 都 Running
kubectl get svc -n prod
```

## 逐字稿

好，動手做。大家打開終端機。final-project 目錄裡面有 12 個編了號的 YAML 檔案，從 01 到 12。我們按順序來。

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

步驟五，部署 API。

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

---

# 影片 7-19：回頭操作 + 中場確認（~5min）

## 本集重點

- 確認步驟 1-6 都做到了
- 常見坑：忘了 -n prod、MySQL Pod 一直 Pending（PVC 問題）、API Pod 0/1（Probe 還沒過）
- 中場打氣：你已經完成了整個系統的核心部分

## 逐字稿

好，中場確認一下。

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

---

# 影片 7-20：完整系統 12 步（下）（~12min）

## 本集重點

- 步驟 7-12：Ingress → HPA → NetworkPolicy → RBAC → 驗證 → 壓測
- 功能完整 → 安全加固 → 彈性擴縮 → 完整驗證

```bash
# Step 7：建 Ingress
kubectl apply -f final-project/07-ingress.yaml
kubectl get ingress -n prod

# Step 8：建 HPA
kubectl apply -f final-project/08-hpa.yaml
kubectl get hpa -n prod

# Step 9：建 NetworkPolicy
kubectl apply -f final-project/09-networkpolicy.yaml
kubectl get networkpolicy -n prod

# Step 10（選做）：建 RBAC
kubectl apply -f final-project/10-rbac.yaml
kubectl get role,rolebinding -n prod

# Step 11：完整驗證
kubectl get all -n prod
kubectl get pvc -n prod
kubectl get ingress -n prod
kubectl get hpa -n prod
kubectl get networkpolicy -n prod
kubectl get secret -n prod
kubectl get configmap -n prod

# Step 12（選做）：壓測
kubectl run load-test -n prod --image=busybox:1.36 --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"
# 另一個終端機
kubectl get hpa -n prod -w
```

## 逐字稿

好，繼續。步驟七到十二。

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

步驟十一，完整驗證。這一步最重要，我們要確認所有東西都在。

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

---

# 影片 7-21：從零部署（下）實作示範（~12min）

## 本集重點

- 帶著做步驟 7-12
- 壓測看 HPA 擴容
- 故意砍 Pod 看自我修復
- 故障模擬

學員實作：
- 必做：跟著做完整 12 步
- 挑戰：用 Helm 安裝 WordPress 並加上 Probe + HPA

```bash
# 壓測觀察 HPA
kubectl run load-test -n prod --image=busybox:1.36 --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"

# 另一個終端機觀察
kubectl get hpa -n prod -w
kubectl get pods -n prod -l app=api -w

# 故障模擬：砍 Pod
kubectl delete pod <api-pod名> -n prod
kubectl get pods -n prod -l app=api -w
# Deployment 會立刻補一個新的

# 故障模擬：砍一個 Node（多節點環境才能做）
# kubectl drain <node名> --ignore-daemonsets --delete-emptydir-data
# kubectl get pods -n prod -o wide -w
# Pod 會搬到其他 Node

# 清理（做完實驗後）
kubectl delete namespace prod
```

## 逐字稿

好，步驟七到十在上一支影片已經帶著做完了。這支影片我們來做步驟十二的壓測和故障模擬，然後讓大家自由練習。

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

好，壓測做完了。接下來做一個故障模擬。

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

接下來是大家的自由練習時間。必做題是把 12 個步驟從頭到尾自己做一遍。不看我的指令，自己敲。做不出來就看一下。能不看就不看。

挑戰題是用 Helm 安裝一個 WordPress，然後自己加上 Probe 和 HPA。提示：helm install my-wordpress bitnami/wordpress --set resources.requests.cpu=100m。然後再建一個 HPA 綁到 WordPress 的 Deployment 上面。

做完實驗之後，清理很簡單。

kubectl delete namespace prod

一行搞定。Namespace 底下的所有東西全部一起刪掉。這也是為什麼用 Namespace 做環境隔離的好處之一，清理起來特別方便。

大家動手做。

---

# 影片 7-22：回頭操作 Loop 7（~5min）

## 本集重點

- 確認 12 步做完了
- 常見坑：步驟順序錯、HPA TARGETS 一直 unknown、Ingress 連不上
- Loop 6-7 小結：從零到完整系統

## 逐字稿

好，回頭確認。你的 12 步做到幾步了？

最低標準是步驟一到六做完了。kubectl get all -n prod 能看到 MySQL、API、Frontend 都在跑。

理想狀態是步驟一到十一全部做完。kubectl get all, pvc, ingress, hpa, networkpolicy, secret, configmap -n prod 全部都有東西。

如果你還沒做完也不用急。回去之後有時間可以自己練。YAML 檔案都在 final-project 目錄裡面，按編號做就對了。

常見的坑。第一個，步驟順序搞錯。比如先建 API Deployment 再建 Secret。API 的 YAML 裡面引用了 mysql-secret，如果 Secret 不存在，Pod 會出現 CreateContainerConfigError。解法是按順序來：先 Secret 再 ConfigMap 再 MySQL 再 API。依賴關係決定順序。

第二個，HPA 的 TARGETS 一直是 unknown。跟上午一樣，要嘛是 metrics-server 沒裝，要嘛是 Deployment 沒設 resources.requests。我們的 API Deployment 有設 requests，所以應該不會有這個問題。如果還是 unknown，kubectl top pods -n prod 看看 metrics-server 正不正常。

第三個，Ingress 連不上。這個在 minikube 上需要額外設定。minikube 要跑 minikube tunnel 或者 minikube addons enable ingress。k3s 內建 Traefik Ingress Controller。如果只是確認 Ingress 有建好，kubectl get ingress -n prod 看到就行了。

好，從零部署的兩個 Loop 全部結束。你從一個空的 Namespace 開始，一步一步建了 Namespace、Secret、ConfigMap、StatefulSet、Deployment、Service、Ingress、HPA、NetworkPolicy。12 步走完，一套完整的生產級系統就出來了。

這就是四堂課的威力。每堂課學的東西單獨看都只是一個小零件，但全部組裝起來，就是一個完整的系統。

接下來是今天最後的部分：四堂課的總複習。我們要用一條因果鏈把所有概念串起來。

---

# 影片 7-23：四堂課總複習 — 完整因果鏈（~15min）

## 本集重點

- 從 Docker 扛不住開始，一條因果鏈串完四堂課所有概念
- 每個概念一句話回顧：因為什麼問題所以學了什麼
- 四堂課的能力成長：跑容器 → 對外服務 → 完整網站 → 生產就緒
- 這條因果鏈就是你的 K8s 知識地圖

## 逐字稿

好，來到今天最後的部分了。四堂課的總複習。我不打算一個一個概念複習定義，那太無聊了。我要做的是用一條完整的因果鏈，從頭到尾串一遍。每一個概念都是因為上一步有問題才引出來的。這條鏈走完，你的腦袋裡就有一張完整的 K8s 知識地圖。

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

---

# 影片 7-24：學習路線建議 + Q&A（~10min）

## 本集重點

- 接下來可以學什麼
- CKA 認證介紹
- Service Mesh、GitOps、監控、CI/CD
- 推薦資源
- Q&A 時間

## 逐字稿

好，因果鏈串完了。接下來聊聊你學完這四堂課之後可以往哪個方向走。

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

---

# 影片 7-25：結業（~5min）

## 本集重點

- 回顧四堂課的成長
- 鼓勵學員
- 收束比喻：你手上有了一張完整的地圖

## 逐字稿

好，Q&A 結束了。我們的課程也走到終點了。

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
