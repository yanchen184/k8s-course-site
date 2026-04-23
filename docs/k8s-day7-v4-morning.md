# 第七堂上午逐字稿 v4 — 新結構（Loop 1: HPA + Loop 2: RBAC）

> 影片：7-1（回顧）、7-2（HPA 概念）、7-3（HPA 實作）、7-4（HPA 回頭操作）、7-5（RBAC 概念）、7-6（RBAC 實作）、7-7（RBAC 回頭操作）
> 主線：流量暴增 → HPA → 誰都能刪 → RBAC
> 銜接第六堂：服務穿上正式衣服了，但扛不扛得住？

---

# 影片 7-1：第六堂回顧 + 今天的挑戰（~8min）

## 本集重點

- 第六堂因果鏈快速串
- 今天只解決兩個最重要的問題：流量暴增（HPA）、誰都能刪（RBAC）
- 下午從零建完整系統

## 逐字稿

好，歡迎回來。今天是我們 Kubernetes 課程的第七堂，也是最後一堂。在開始新的內容之前，先花幾分鐘把第六堂的因果鏈快速串一遍。

第六堂的起點是使用者要用 IP 加 NodePort 連進來，地址又長又醜。所以學了 Ingress，用域名路由。接著設定寫死在 Image 裡，所以學了 ConfigMap 和 Secret。然後 Pod 重啟資料全消失，所以學了 PV 和 PVC 做持久化。跑資料庫需要穩定身份，所以學了 StatefulSet。YAML 多到爆，學了 Helm。最後 kubectl 管叢集太痛苦，學了 Rancher GUI。

這就是第六堂的因果鏈。每一個概念都是因為上一步沒解決的問題才引出來的。

好，今天我們繼續。服務穿上了正式衣服，看起來很體面。但生產環境會用各種方式考驗你。

今天我選了兩個最重要的問題。

第一個，流量暴增。雙十一零點，平常三個 Pod 夠用，現在流量翻十倍。你手動 kubectl scale 可以，但凌晨三點你在睡覺。等你七點起床看到告警，使用者已經罵了四個小時。這個問題用 HPA 解決，Horizontal Pod Autoscaler，自動根據 CPU 擴縮 Pod。

第二個，誰都能刪。你的叢集上十個開發者都拿到了 admin 權限。某天實習生跑清理腳本，kubectl delete namespace production。整個生產環境，Deployment、Pod、Service、Secret、PVC，全部瞬間消失。這個問題用 RBAC 解決，Role-Based Access Control，根據角色分配最小權限。

上午解決這兩個。下午從零建一套完整的系統，把四堂課學的所有東西全部串在一起。

準備好了嗎？我們從 HPA 開始。

---

# 影片 7-2：HPA 概念 — 流量暴增，手動 scale 來不及（~12min）

## 本集重點

- 問題：流量暴增，手動 scale 反應太慢、容易忘記縮回
- Docker 對照：docker compose up --scale 是手動的
- HPA 工作流程：每 15 秒查 metrics → 計算目標副本數 → 擴或縮
- HPA YAML 三個關鍵：scaleTargetRef、minReplicas/maxReplicas、metrics
- 前提：Pod 必須設 resources.requests（HPA 的分母）
- 需要 metrics-server（k3s 內建，minikube 要啟用）
- 縮容冷卻期 5 分鐘（防抖動）

## 逐字稿

上一堂課你學了 kubectl scale deployment my-app --replicas=10，可以手動調整 Pod 數量。這是很好的工具，但有一個根本問題：它是手動的。

想像這個場景。你的電商網站，平常日子三個 Pod 夠用，CPU 使用率 30%。雙十一零點來了，流量瞬間翻十倍。三個 Pod 的 CPU 全部飆到 100%，請求開始排隊，回應時間從 100 毫秒暴增到 5 秒，然後開始超時。

你當然可以手動 scale，但問題是：你怎麼知道什麼時候要 scale？你不可能 24 小時盯著 Grafana 吧。凌晨三點流量暴增的時候你在睡覺。等你醒來，使用者已經罵了好幾個小時。

然後雙十一結束，流量回到正常。十個 Pod 閒在那裡什麼事都沒做，但資源還是佔著。你忘了把 replicas 調回來，白白浪費。

手動 scale 有兩個根本問題。第一，反應太慢，你沒辦法即時應對。第二，容易忘記縮回來，浪費資源。

Docker Compose 也有 scale 功能，但一樣是手動的。K8s 的 HPA 就是解決這個問題的。

HPA，全名 Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。它做的事情用一句話說就是：監控 Pod 的 CPU 使用率，超過你設的閾值就自動加 Pod，低於閾值就自動減 Pod。全自動，不需要人介入。

HPA 的工作流程是這樣的。它每 15 秒去問 metrics-server：現在每個 Pod 的 CPU 使用率是多少？拿到數據之後做計算。如果平均 CPU 超過你設的目標值，比如 50%，HPA 就增加 Pod 數量。新 Pod 啟動之後，流量分攤到更多 Pod，CPU 使用率降下來。

當流量降下來，CPU 也跟著降。但 HPA 不會馬上縮容，它等 5 分鐘的冷卻期，確認流量真的穩定了才縮。為什麼？怕流量只是暫時降了一下馬上又上來，頻繁擴縮浪費資源。

來看 YAML 怎麼寫。apiVersion 是 autoscaling/v2，kind 是 HorizontalPodAutoscaler。

spec 裡面三個關鍵。第一個是 scaleTargetRef，告訴 HPA 要擴縮哪個 Deployment。第二個是 minReplicas 和 maxReplicas，最少幾個 Pod、最多幾個。minReplicas 設 2 是基本高可用，maxReplicas 要根據 Node 總資源設。第三個是 metrics，設 CPU averageUtilization 50，意思是平均 CPU 超過 50% 就擴容。

這裡的 50% 是相對於 requests 的 50%。如果你的 Pod requests 是 100m CPU，那 50% 就是 50m。

這就是為什麼 Pod 一定要設 resources.requests。HPA 算的是百分比，百分比需要分母，分母就是 requests。沒設 requests，HPA 算不出百分比，就不動。

HPA 還需要 metrics-server 才能拿到 CPU 數據。k3s 內建了，minikube 用 minikube addons enable metrics-server 啟用。

概念講完了。下一支影片我們來壓測，親眼看 HPA 自動擴容。

---

# 影片 7-3：HPA 實作 — 壓測觸發自動擴縮（~15min）

## 本集重點

- Step 1：確認 metrics-server 正常（kubectl top nodes）
- Step 2：部署有設 requests 的 nginx Deployment + Service
- Step 3：建 HPA（kubectl autoscale）
- Step 4：busybox 壓測觸發擴容
- Step 5：觀察 REPLICAS 增加，停止壓測等 5 分鐘看縮容
- 常見坑：TARGETS unknown（忘設 requests）、metrics-server 沒裝

## 逐字稿

好，概念講完了，來動手做。這個實驗非常有感覺，大家一定要跟著做。

第一步，確認 metrics-server 有在跑。

指令：kubectl get pods -n kube-system

找 metrics-server 相關的 Pod，確認是 Running。k3s 內建了，應該已經在跑。

然後打一下：

指令：kubectl top nodes

如果能看到 CPU 和 MEMORY 的數字，表示 metrics-server 正常。如果報錯，等一兩分鐘再試，metrics-server 剛啟動需要一點時間收集數據。

第二步，部署我們要測試的 nginx。

指令：kubectl apply -f nginx-resource-demo.yaml

這個 YAML 裡面同時包含 Deployment 和 Service。重點是 Deployment 有設 resources.requests，cpu 100m，memory 128Mi。這是 HPA 的前提，沒有 requests HPA 不能用。

確認：

指令：kubectl get deploy nginx-resource-demo

指令：kubectl get svc nginx-resource-svc

第三步，建 HPA。

指令：kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=50%

這一行指令等於手動寫 HPA YAML，但更快。minReplicas 2，maxReplicas 10，CPU 超過 50% 就擴容。

確認：

指令：kubectl get hpa

看 TARGETS 欄位。剛建好可能顯示 unknown/50%，等 30 秒到 1 分鐘讓 metrics-server 收集數據，就會變成數字，比如 1%/50%。

第四步，壓測。開另一個終端機。

指令：kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"

這個指令建了一個 busybox Pod，在裡面跑無限迴圈一直打 nginx。每秒幾十次到上百次請求，模擬流量暴增。

第五步，回到原本的終端機觀察。

指令：kubectl get hpa -w

-w 是 watch 模式，有變化就更新。你會看到 TARGETS 的 CPU 使用率慢慢上升。1%、10%、30%、超過 50% 之後，REPLICAS 開始增加，2 變 3、3 變 4。

你也可以同時看：

指令：kubectl get pods -w

新的 Pod 一個一個冒出來，Pending、ContainerCreating、Running。HPA 在自動加 Pod。

壓測跑個兩三分鐘，感受一下自動擴容的過程。然後回到壓測的終端機，按 Ctrl+C 停止。

停止之後回來看 HPA watch。CPU 降到 0%，但 REPLICAS 不會馬上縮。等 5 分鐘，你會看到 REPLICAS 開始減少，最終回到 2。

看完 HPA 的事件記錄：

指令：kubectl describe hpa nginx-resource-demo

找 Events 部分。你會看到 New size: 3; reason: cpu resource utilization above target，然後 New size: 2; reason: All metrics below target。完整記錄都在這裡，生產環境排查 HPA 問題就靠這個。

好，示範到這邊，先回答幾個常見問題。

Q：TARGETS 一直顯示 unknown/50%，怎麼辦？

A：最常見的原因是 Deployment 沒有設 resources.requests。HPA 需要 requests 作為分母，沒有分母算不出百分比。回去 Deployment 的 YAML 加上 resources.requests，重新 apply。另一個原因是 metrics-server 剛啟動還在收集數據，等 30 秒到 1 分鐘再看通常就有了。

Q：壓測停止之後，REPLICAS 一直不縮回去，是 HPA 壞了嗎？

A：沒有壞。HPA 縮容有 5 分鐘的冷卻期，這是設計上的，防止流量只是短暫下降馬上又上來，頻繁擴縮浪費資源。等滿 5 分鐘，CPU 持續低於目標值，REPLICAS 就會開始減少。

Q：minReplicas 設 2，但我 kubectl scale 手動改成 1，HPA 會讓它縮回 2 嗎？

A：會。HPA 是最終控制者，它會定期把 replicas 調整成它認為對的數字。你手動設 1，下次 HPA 的控制循環跑完，就會把它拉回 2。

---

# 影片 7-4：回頭操作 — 學員實作 + 常見坑（~12min）

## 本集重點

- 學員實作：建 HPA、壓測看擴容、停止看縮容
- 挑戰：改 targetCPU 為 30%，觀察擴容更早觸發
- 常見坑 3 個：忘設 requests（TARGETS unknown）、metrics-server 沒裝、metrics-server 剛啟動
- Loop 1 因果鏈小結
- 銜接 Loop 2：HPA 管容量，但人的權限還沒管

## 逐字稿

好，換大家動手了。

必做題：跟著我的步驟做一遍。部署 nginx-resource-demo.yaml，建 HPA，用 busybox 壓測，觀察 REPLICAS 增加。然後停止壓測，等 5 分鐘，看 REPLICAS 縮回 2。

挑戰題：刪掉剛才的 HPA，重建一個，但把 targetCPU 改成 30%。

指令：kubectl delete hpa nginx-resource-demo

然後：

指令：kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=30%

壓測同樣的方式，你會發現 REPLICAS 增加得更快，因為 30% 比 50% 更低，更容易達到。同樣流量，設 30% 的 HPA 比 50% 反應更積極。

大家動手，有問題舉手。巡堂確認清單：kubectl get hpa 看到 TARGETS 有數字不是 unknown、壓測中看到 REPLICAS 大於 2、停止壓測後 REPLICAS 縮回 2。

好，回頭確認幾個常見的坑。

坑 1：TARGETS 一直顯示 unknown/50%。最常見的原因是 Deployment 沒有設 resources.requests。HPA 需要 requests 作為分母，沒有分母算不出百分比。解法：回去 Deployment 的 YAML 加上 resources.requests，然後重新 apply。

坑 2：kubectl top pods 報錯 Metrics API not available。metrics-server 沒裝或沒正常運作。k3s 內建應該沒問題，minikube 需要 minikube addons enable metrics-server。

坑 3：TARGETS 顯示 unknown，但你確認 requests 有設。可能是 metrics-server 剛啟動還在收集數據。等 30 秒到 1 分鐘再看，通常就有數字了。如果等了五分鐘還是 unknown，kubectl logs -n kube-system 看 metrics-server 的 logs 有沒有錯誤。

好，Loop 1 結束。用一句話串因果鏈：流量暴增，手動 scale 來不及 → HPA 根據 CPU 使用率自動擴縮，全自動，不需要人介入。

HPA 解決了「容量」的問題。但我剛才說的第二個問題還沒解決：誰都能刪。你的叢集上所有人都是 admin，隨時可以刪任何東西。這就是下一個 Loop 要解決的問題：RBAC。

---

# 影片 7-5：RBAC 概念 — 誰都能刪 Pod？（~12min）

## 本集重點

- 問題：十個開發者全拿 cluster-admin，實習生 kubectl delete namespace production
- Docker 對照：Docker 連到 Socket 就等於 root，K8s 至少有 RBAC
- RBAC 核心邏輯：誰（Subject）+ 能做什麼（Role）= 綁定（Binding）
- 四個物件：Role、ClusterRole、RoleBinding、ClusterRoleBinding
- ServiceAccount：給 Pod 用的身份
- 常見企業設計：開發者 dev 完整、prod 只讀；CI/CD 有部署權；實習生 dev 只讀
- 比喻：門禁卡（Role）+ 發卡（Binding）

## 逐字稿

好，Loop 2 開始。

我來描述一個你可能覺得很荒唐但在業界真實發生過的場景。

你們公司有十個開發者，大家一起維護同一套系統。為了方便，IT 給每個人都發了一份 kubeconfig，而且全部都是 cluster-admin 權限。cluster-admin 是 K8s 裡面最高等級的權限，等於上帝，什麼都能做。

某天有個開發者要清理測試環境，跑了一個清理腳本。腳本有個 bug，不是清 dev namespace，跑去清 production namespace 了。

kubectl delete namespace production

結果是什麼？production namespace 底下的所有東西，Deployment、Pod、Service、Secret、PVC，全部瞬間消失。整個生產環境掛掉。

這不是我編的。這種事在業界真的發生過。問題的根源是什麼？不該有那麼大權限的人，拿到了那麼大的權限。

Docker 有沒有這個問題？Docker 更糟。Docker 根本沒有內建的權限控制。只要你能連到 Docker Socket，你就等於 root，所有容器你都能停、刪、進去看。K8s 至少提供了一套完整的權限控制機制，叫做 RBAC。

RBAC，Role-Based Access Control，基於角色的存取控制。核心邏輯只有一句話：誰加上能做什麼等於綁定。

三個元素。第一個是 Subject，就是「誰」。可以是 User、Group、或者 ServiceAccount。第二個是 Role，就是「能做什麼」，定義了允許的操作清單。第三個是 Binding，把 Role 綁到 Subject 身上。

RBAC 一共有四個物件。Role 在單一 Namespace 有效，定義能對什麼資源做什麼動作。ClusterRole 是整個叢集有效。RoleBinding 把 Role 綁到某人身上，單一 Namespace 有效。ClusterRoleBinding 是整個叢集有效。

用門禁卡比喻。Role 就是一張門禁卡，上面寫著「可以進出 3 樓研發部」。ClusterRole 是萬能卡，所有樓層都能進。RoleBinding 是把門禁卡發給某個員工。ClusterRoleBinding 是把萬能卡發給某個員工。你不會把萬能卡發給每個新來的實習生，對吧？

然後有一個重要概念叫 ServiceAccount。User 和 Group 是給人用的，但 Pod 也需要跟 K8s API Server 溝通。比如監控工具需要列出所有 Pod 的狀態，自動化工具需要建立或刪除資源。Pod 不是人，它的身份用的就是 ServiceAccount。

每個 Namespace 預設都有一個叫 default 的 ServiceAccount。生產環境建議每個應用建自己的 ServiceAccount，然後用 RBAC 給它需要的最小權限，這叫最小權限原則。

常見的企業設計：開發者在 dev 有完整權限，prod 只讀。SRE 在所有 Namespace 有完整權限。實習生 dev 只讀，prod 碰都不能碰。真正的部署交給 CI/CD Pipeline，比如 ArgoCD，給它部署權限但不給刪除權限。

概念講完了，下一支影片來實際建一個只讀使用者，然後驗證它真的不能刪東西。

---

# 影片 7-6：RBAC 實作 — 只讀使用者 + 驗證（~12min）

## 本集重點

- 建三個資源：ServiceAccount + Role + RoleBinding
- Role YAML：resources pods/services，verbs get/list/watch（沒有 delete）
- kubectl apply -f rbac-viewer.yaml
- 驗證：--as 旗標模擬身份
- get pods 成功、delete pod Forbidden
- kubectl auth can-i 快速確認權限

## 逐字稿

好，來動手做。我們要建三個資源：一個 ServiceAccount、一個 Role、一個 RoleBinding。

先看 YAML。rbac-viewer.yaml 包含三個資源，用三個橫線分開。

第一個是 Role，kind 是 Role，名字叫 pod-viewer，namespace 是 default。rules 是核心，它定義了允許的操作。apiGroups 空字串代表 core API group，就是 Pod、Service 這些基礎資源。resources 設 pods 和 services。verbs 設 get、list、watch。注意，沒有 create、update、delete。這是一個純粹只讀的 Role。

第二個是 ServiceAccount，非常簡單，名字 viewer-sa，namespace default。

第三個是 RoleBinding，subjects 指定綁給 viewer-sa 這個 ServiceAccount，roleRef 指定綁 pod-viewer 這個 Role。apiGroup 固定是 rbac.authorization.k8s.io。

部署：

指令：kubectl apply -f rbac-viewer.yaml

你會看到三行輸出：serviceaccount/viewer-sa created、role.rbac.authorization.k8s.io/pod-viewer created、rolebinding.rbac.authorization.k8s.io/viewer-binding created。三個都建好了。

確認：

指令：kubectl get serviceaccount viewer-sa

指令：kubectl get role pod-viewer

指令：kubectl get rolebinding viewer-binding

好，現在來測試。K8s 提供了一個很好用的旗標叫 --as，可以模擬用其他身份來操作。格式是 system:serviceaccount:namespace:名稱。

先用 viewer-sa 的身份查看 Pod：

指令：kubectl get pods --as=system:serviceaccount:default:viewer-sa

成功了，你可以看到 Pod 列表。因為 pod-viewer 有 get 和 list 的權限。

再試刪除：

指令：kubectl delete pod nginx-resource-demo-隨便一個hash --as=system:serviceaccount:default:viewer-sa

看，Error from server (Forbidden)。完整錯誤訊息：User cannot delete resource "pods" in namespace "default"。被拒了，因為 Role 沒有 delete 這個 verb。

還有一個快速確認的方式：

指令：kubectl auth can-i get pods --as=system:serviceaccount:default:viewer-sa

回傳 yes。

指令：kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa

回傳 no。

這就是 RBAC 的威力。同一個叢集，同一個 Namespace，不同身份有不同的權限。

好，示範到這邊，先回答幾個常見問題。

Q：--as 的格式一直報錯，說找不到這個 user，怎麼辦？

A：格式要寫完整：system:serviceaccount:namespace:serviceaccount名稱。最常見的錯誤是直接寫 --as=viewer-sa，沒有前綴。如果 ServiceAccount 在 default namespace 就寫 system:serviceaccount:default:viewer-sa，在 dev namespace 就換成 system:serviceaccount:dev:viewer-sa。

Q：我建了 RoleBinding，但用 --as 測試還是 Forbidden，哪裡出了問題？

A：最常見的是 Role 和 ServiceAccount 不在同一個 Namespace。Role 建在 default，ServiceAccount 建在 dev，RoleBinding 也在 default，但 RoleBinding 的 subjects 指向的是 default 的 SA，不是 dev 的。三個東西的 Namespace 要配對。還有一個常見的是 RoleBinding 的 roleRef.name 跟 Role 的名字不一樣，打錯字就綁不上去。

Q：我有一個 ClusterRole 想用在某個 Namespace 裡，可以用 RoleBinding 綁 ClusterRole 嗎？

A：可以。RoleBinding 的 roleRef 可以綁 Role 或 ClusterRole。如果你綁的是 ClusterRole，但用的是 RoleBinding，那這個 ClusterRole 定義的權限只在 RoleBinding 所在的 Namespace 裡有效。這是一個很常用的技巧：用 ClusterRole 定義一套通用的權限規則，然後用不同 Namespace 的 RoleBinding 把它發給不同的人，每個人只在自己的 Namespace 有效。

---

# 影片 7-7：回頭操作 — 學員實作 + 常見坑（~10min）

## 本集重點

- 學員實作：建 SA + Role + RoleBinding，--as 測試 get 成功、delete Forbidden
- 挑戰：寫新 Role，允許 CRUD deployments，不能碰 secrets
- 常見坑 3 個：--as 格式、Role 和 SA 不同 Namespace、roleRef 寫錯
- Loop 2 因果鏈小結
- 銜接下午：人管住了，但 Pod 之間網路全通、系統還沒從零建過

## 逐字稿

好，換大家動手了。

必做題：建 ServiceAccount、Role、RoleBinding。然後用 --as 模擬，確認 get pods 成功，delete pod 被拒。

挑戰題：自己寫一個新的 Role，允許 get、list、create、update、delete deployments，但不能碰 secrets。建一個新的 ServiceAccount 綁上去，用 --as 測試。提示：rules 可以寫多條，每條指定不同的 resources 和 verbs。

大家動手，有問題舉手。

好，回頭確認幾個常見的坑。

坑 1，--as 的格式寫錯。最常見的錯誤是直接寫 --as=viewer-sa，沒有 system:serviceaccount: 前綴。要寫完整的 system:serviceaccount:default:viewer-sa。如果 ServiceAccount 在其他 Namespace，把 default 換成對應的名字。

坑 2，Role 和 ServiceAccount 不在同一個 Namespace。Role 建在 default，SA 建在 dev，RoleBinding 也在 default。結果在 dev 裡面 SA 一點權限都沒有。Role、RoleBinding、和 SA 的 Namespace 要配對。

坑 3，RoleBinding 的 roleRef 寫錯。kind 要寫 Role，name 要跟你的 Role 名字完全一樣，apiGroup 固定是 rbac.authorization.k8s.io。

好，上午兩個 Loop 全部結束。

用一句話串因果鏈：HPA 確保容量彈性，流量大自動加 Pod，流量小自動縮回。RBAC 確保人的權限，誰能看、誰能改、誰能刪，分明清楚。

下午我們進入最後的部分：先用任務排程系統看一次比較完整的企業架構，再由大家親手部署一個短網址服務。短網址服務不用寫程式碼，但會把 Namespace、Secret、ConfigMap、PostgreSQL StatefulSet、PVC、Migration Job、API、Frontend、Service、Ingress、Probe、Resource、HPA 全部串起來。最後再看 Helm 怎麼把剛剛手動做的事變成一個指令完成，並且可以調整版本、副本數、資源、HPA、網域和資料庫大小。

吃個午飯，下午繼續。
