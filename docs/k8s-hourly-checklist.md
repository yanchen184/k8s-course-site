# Kubernetes 課程 — 每小時學習檢核表

> 每個小時結束時，學生和講師都能用這張表確認「這小時學到了什麼」
> 每個檢核項目都是具體可驗證的（能跑指令、能看到結果）

---

## 第四堂（3/28）— K8s 入門：從 Docker 到 Kubernetes

### Hour 1｜為什麼需要 K8s + 核心概念（上）

**這小時你會知道：**
- K8s 解決的五大問題（調度、故障恢復、彈性擴縮、滾動更新、服務發現）
- Pod、Service、Ingress 三個核心概念

**檢核：**
- [ ] 能說出 Docker Compose 做不到的三件事
- [ ] 能用一句話解釋 Pod 是什麼（「容器的包裝，K8s 最小調度單位」）
- [ ] 能解釋為什麼需要 Service（「Pod IP 會變，Service 地址不變」）
- [ ] 能說出 ClusterIP 和 NodePort 的差異

**反思：** 如果設定檔寫死在 Docker Image 裡，換環境要重新 build。K8s 怎麼解決？

---

### Hour 2｜核心概念（下）+ K8s 架構

**這小時你會知道：**
- ConfigMap、Secret、Volume、Deployment、StatefulSet 五個概念
- Master Node 的 4 個元件 + Worker Node 的 3 個元件

**檢核：**
- [ ] 能說出 8 個核心概念，每個都能對照一個 Docker 功能
- [ ] 能畫出 K8s 架構圖（Master 4 元件 + Worker 3 元件）
- [ ] 能說出一個 `kubectl create deployment` 指令從下達到 Pod 跑起來的完整流程（kubectl → API Server → etcd → Scheduler → kubelet）
- [ ] 能解釋 Deployment 和 StatefulSet 的差異（無狀態 vs 有狀態）

**反思：** 你知道架構了，但這些元件真的在跑嗎？怎麼親眼看到它們？

---

### Hour 3｜環境搭建 + kubectl 探索

**這小時你會做：**
- minikube 安裝 + 啟動叢集
- kubectl 基本操作
- 在 kube-system 裡親眼看到架構元件

**檢核：**
- [ ] `minikube status` 顯示 Running
- [ ] `kubectl get nodes` 看到一個 Ready 的節點
- [ ] `kubectl get pods -n kube-system` 能認出 etcd、apiserver、scheduler、controller-manager、proxy、coredns
- [ ] `kubectl describe node minikube` 能看到 CPU、Memory、Container Runtime 資訊

**反思：** 環境好了，但怎麼把你的應用部署上去？Docker 用 `docker run`，K8s 用什麼？

---

### Hour 4｜YAML 格式 + 第一個 Pod

**這小時你會做：**
- 學會 K8s YAML 的四大欄位（apiVersion、kind、metadata、spec）
- 寫出第一個 Pod YAML，部署 nginx
- 完整 CRUD：建立 → 查看 → 看日誌 → 進容器 → 刪除

**檢核：**
- [ ] 能獨立寫出一個 Pod YAML（不看範本）
- [ ] `kubectl apply -f pod.yaml` 成功部署
- [ ] `kubectl get pods` 看到 STATUS = Running
- [ ] `kubectl exec -it my-nginx -- /bin/sh` 進到容器，`curl localhost` 看到 nginx 歡迎頁
- [ ] `kubectl port-forward pod/my-nginx 8080:80` 後瀏覽器看到頁面

**反思：** Pod 跑起來了，但如果 image 名字拼錯會怎樣？你要怎麼找到問題？

---

### Hour 5｜Pod 生命週期 + 排錯實作

**這小時你會做：**
- 認識 Pod 的所有狀態（Pending → Running → Succeeded/Failed）
- 認識 ImagePullBackOff 和 CrashLoopBackOff
- 排錯三兄弟：get → describe → logs
- 故意搞壞 Pod，找出問題並修好

**檢核：**
- [ ] 看到 `ImagePullBackOff` 知道是 image 名字拼錯
- [ ] `kubectl describe pod broken-pod` 能在 Events 裡找到錯誤訊息
- [ ] 能修正 YAML 後重新 `kubectl apply` 讓 Pod 變成 Running
- [ ] 看到 `CrashLoopBackOff` 知道是容器啟動後 crash，重啟間隔會越來越長

**反思：** 排錯你會了，但如果兩個容器要共享檔案怎麼辦？一個寫日誌、一個讀日誌。

---

### Hour 6｜多容器 Pod（Sidecar）+ kubectl 進階

**這小時你會做：**
- 寫 Sidecar Pod（nginx + busybox 共享 Volume）
- kubectl 進階技巧：dry-run 產生 YAML、port-forward、explain

**檢核：**
- [ ] `kubectl get pods` 看到 READY = `2/2`（兩個容器都在跑）
- [ ] `kubectl logs sidecar-pod -c log-reader` 看到 nginx 的 access log
- [ ] 會用 `-c` 指定容器名稱
- [ ] `kubectl run quick-nginx --image=nginx:1.27 --dry-run=client -o yaml` 能產生 YAML 範本

**第四堂結尾反思：** 你用 `kubectl delete pod` 把 Pod 刪了，它就真的消失了。如果這是生產環境，使用者就斷線了。**怎麼讓 K8s 自動維持「隨時有 3 個 nginx 在跑」？**

---

## 第五堂（4/11）— 多節點叢集 + 服務與網路

### Hour 1｜回顧 + k3s 多節點環境搭建

**這小時你會做：**
- 回答第四堂的反思問題（答案：Deployment）
- 用 Multipass + k3s 搭建 1 master + 2 worker 的多節點叢集

**檢核：**
- [ ] `multipass list` 看到 3 台 VM（k3s-master、k3s-worker1、k3s-worker2）
- [ ] `kubectl get nodes` 看到 3 個 Ready 的節點
- [ ] 能在本機用 kubectl 操作 k3s 叢集（kubeconfig 已設定好）

**反思：** 3 個 Node 準備好了，但怎麼讓 Pod 自動跑在不同 Node 上？

---

### Hour 2｜Deployment + ReplicaSet

**這小時你會做：**
- 認識 Deployment → ReplicaSet → Pod 三層關係
- 建立 3 副本的 Deployment
- 手動刪一個 Pod，看它自動重建

**檢核：**
- [ ] `kubectl get deployment` 看到 READY = `3/3`
- [ ] `kubectl get pods -o wide` 看到 Pod 分散在不同 Node 上
- [ ] `kubectl delete pod <pod名>` 後 `kubectl get pods` 看到新 Pod 自動出現
- [ ] `kubectl get rs` 看到 ReplicaSet 的 DESIRED / CURRENT / READY 都是 3

**反思：** 副本有了，但怎麼更新版本？直接刪掉全部重建嗎？那使用者會斷線。

---

### Hour 3｜滾動更新 + 回滾

**這小時你會做：**
- 用 `kubectl set image` 觸發滾動更新
- 觀察 Pod 一個一個被替換的過程
- 故意更新到不存在的 image → 回滾

**檢核：**
- [ ] `kubectl rollout status` 看到更新過程（逐步替換）
- [ ] `kubectl rollout history` 看到版本記錄
- [ ] 故意更新到錯誤 image 後，`kubectl rollout undo` 成功回滾
- [ ] `kubectl scale deployment nginx --replicas=5` 成功擴容

**反思：** 5 個 Pod 在跑了，但別人要怎麼連到你的服務？每個 Pod 有自己的 IP，而且 IP 會變。

---

### Hour 4｜Service 基礎（ClusterIP）

**這小時你會做：**
- 認識 Service 的 Label Selector 機制
- 建立 ClusterIP Service
- 從另一個 Pod 用 Service 連到 nginx

**檢核：**
- [ ] `kubectl get svc` 看到 ClusterIP Service
- [ ] `kubectl get endpoints` 看到 Service 對應的 Pod IP 列表
- [ ] 從臨時 Pod `curl http://<ClusterIP>:<port>` 成功連到 nginx
- [ ] 刪掉一個 Pod 後，`kubectl get endpoints` 自動更新

**反思：** ClusterIP 只有叢集內部能連，你的使用者在外面。怎麼讓外部連進來？

---

### Hour 5｜Service 進階（NodePort）+ DNS 服務發現

**這小時你會做：**
- 把 Service 改成 NodePort，外部瀏覽器能連
- 認識 CoreDNS，用名稱而不是 IP 連 Service

**檢核：**
- [ ] 瀏覽器打 `<worker1-IP>:30080` 看到 nginx 頁面
- [ ] 打 `<worker2-IP>:30080` 也能看到（任何 Node 都能進）
- [ ] 從 Pod 裡 `curl http://nginx-svc` 用名稱連到 Service
- [ ] `nslookup nginx-svc` 能解析出 ClusterIP

**反思：** DNS 很方便，但 dev 和 staging 環境都有叫 nginx-svc 的 Service，名字衝突了怎麼辦？

---

### Hour 6｜Namespace + 完整練習

**這小時你會做：**
- 用 Namespace 隔離環境
- 綜合練習：Namespace + API Deployment + 前端 Deployment + Service

**檢核：**
- [ ] `kubectl get ns` 看到自己建的 Namespace
- [ ] 在不同 Namespace 部署同名 Service 不會衝突
- [ ] 跨 Namespace 用 `curl http://nginx-svc.dev.svc.cluster.local` 成功連到
- [ ] 完整鏈路：瀏覽器 → NodePort → 前端 → API（用 Service DNS 連）

**第五堂結尾反思：** 你的 API 在跑了、NodePort 也建好了，但使用者要輸入 `IP:30080`。生產環境怎麼讓使用者用 `myapp.com`？

---

## 第六堂（4/18）— Ingress + 配置管理 + 資料持久化

### Hour 1｜回顧 + Ingress 基礎

**這小時你會做：**
- 回答第五堂的反思問題（答案：Ingress）
- 安裝 Ingress Controller
- 建立 path-based routing 的 Ingress

**檢核：**
- [ ] `kubectl get pods -n ingress-nginx` 看到 Ingress Controller 在跑
- [ ] 瀏覽器打 `myapp.local` 看到前端頁面
- [ ] 瀏覽器打 `myapp.local/api` 被導到 API Service
- [ ] `kubectl get ingress` 看到 Ingress 規則

**反思：** 路由搞定了，但你的 API 連資料庫的密碼寫死在 Docker Image 裡，怎麼辦？

---

### Hour 2｜Ingress 進階 + ConfigMap

**這小時你會做：**
- host-based routing（`api.myapp.local` → API）
- TLS 概念簡介
- ConfigMap 建立 + 環境變數注入 + Volume 掛載

**檢核：**
- [ ] `api.myapp.local` 和 `app.myapp.local` 分別導到不同 Service
- [ ] `kubectl get configmap` 看到自己建的 ConfigMap
- [ ] `kubectl exec` 進 Pod，`echo $DB_HOST` 輸出 ConfigMap 裡的值
- [ ] 修改 ConfigMap 後，Volume 掛載的檔案自動更新（不用重建 Pod）

**反思：** 設定用 ConfigMap 管了，但資料庫密碼也用 ConfigMap？`kubectl get cm -o yaml` 明碼顯示太危險了。

---

### Hour 3｜Secret + 整合實作

**這小時你會做：**
- Secret 建立 + Base64 編碼（不是加密！）
- 整合實作：Ingress + ConfigMap + Secret 一起用

**檢核：**
- [ ] `kubectl get secret db-secret -o yaml` 看到 Base64 編碼的值
- [ ] `echo <值> | base64 -d` 能解碼出原始密碼
- [ ] Pod 裡的 `$DB_PASSWORD` 環境變數是原始密碼（K8s 自動解碼）
- [ ] 完整架構跑起來：Ingress → Service → Deployment → Pod（掛 ConfigMap + Secret）

**反思：** 設定和密碼都管好了，但 MySQL Pod 重啟後資料全沒了。跟 Docker 一樣的問題 — 怎麼讓資料不跟著 Pod 消失？

---

### Hour 4｜PersistentVolume + PVC

**這小時你會做：**
- 認識 PV（管理員建）和 PVC（使用者申請）
- 靜態佈建：手動建 PV → 建 PVC → Pod 掛載
- 驗證資料持久化：寫入資料 → 刪 Pod → 重建 → 資料還在

**檢核：**
- [ ] `kubectl get pv` 看到手動建的 PV，STATUS = Bound
- [ ] `kubectl get pvc` 看到 PVC 綁定到 PV
- [ ] 寫入資料後 `kubectl delete pod`，新 Pod 起來資料還在
- [ ] 能解釋 AccessMode 三種模式的差異（RWO / ROX / RWX）

**反思：** 每次都要手動建 PV？如果有 100 個服務怎麼辦？

---

### Hour 5｜StorageClass + StatefulSet

**這小時你會做：**
- StorageClass 動態佈建（PVC 自動建 PV）
- StatefulSet 部署 MySQL（mysql-0, mysql-1 有序啟動）
- Headless Service 讓每個 Pod 有獨立 DNS

**檢核：**
- [ ] 建 PVC 不指定 PV → StorageClass 自動建 PV
- [ ] `kubectl get pods` 看到 `mysql-0`、`mysql-1` 有序啟動
- [ ] `kubectl get pvc` 看到每個 Pod 有自己的 PVC
- [ ] 能從另一個 Pod `nslookup mysql-0.mysql-headless` 解析到特定 Pod 的 IP

**反思：** Deployment、Service、Ingress、ConfigMap、Secret、PV、PVC、StatefulSet... YAML 太多了，有沒有辦法一行指令全部搞定？

---

### Hour 6｜Helm 入門

**這小時你會做：**
- Helm 的三個核心概念（Chart / Release / Repository）
- `helm install` 一鍵安裝 Redis
- `helm upgrade` 改設定 + `helm rollback` 回滾

**檢核：**
- [ ] `helm repo list` 看到 bitnami repo
- [ ] `helm install my-redis bitnami/redis` 成功安裝
- [ ] `helm list` 看到 Release 狀態為 deployed
- [ ] `helm upgrade` 改參數後 `helm rollback` 成功回到上一版
- [ ] `helm uninstall` 乾淨移除所有資源

**第六堂結尾反思：** 你的系統全部跑起來了，K8s 顯示 Running。但如果 API 的程式死鎖了呢？K8s 不知道它卡住了，繼續送流量，使用者看到 502。**怎麼讓 K8s 知道你的應用是不是真的健康？**

---

## 第七堂（4/25）— 運維實戰 + 總複習

### Hour 1｜回顧 + Health Check（Probe）

**這小時你會做：**
- 回答第六堂的反思問題（答案：Probe）
- 三種 Probe：liveness（死了重啟）、readiness（沒好不轉流量）、startup（啟動慢的用）
- 故意讓 Probe 失敗，看 K8s 自動重啟

**檢核：**
- [ ] `kubectl get pods` 看到 RESTARTS 數字增加（livenessProbe 觸發重啟）
- [ ] readiness 失敗時 `kubectl get endpoints` 看到該 Pod 被移除（不再收流量）
- [ ] 能解釋 liveness 和 readiness 的差異（重啟 vs 不轉流量）
- [ ] 能寫出 HTTP GET 類型的 Probe YAML

**反思：** Probe 管健康，但如果某個 Pod 吃光了整個 Node 的記憶體呢？其他 Pod 一起被殺。

---

### Hour 2｜Resource 管理 + HPA 自動擴縮

**這小時你會做：**
- requests（保證給你的）vs limits（最多用這麼多）
- QoS 等級：Guaranteed > Burstable > BestEffort
- HPA：CPU 超過閾值自動加 Pod，流量退了自動縮

**檢核：**
- [ ] `kubectl describe node` 看到 Allocated resources（requests 和 limits 的加總）
- [ ] 故意設太小的 memory limit → 看到 OOMKilled
- [ ] `kubectl get hpa` 看到 TARGETS 欄位顯示 CPU 使用率
- [ ] 壓測後 `kubectl get pods -w` 看到副本從 3 自動增加到 5+
- [ ] 停止壓測後副本自動縮回來

**反思：** 資源管好了，但你的叢集上實習生也有 admin 權限，他 `kubectl delete namespace prod` 就全沒了。

---

### Hour 3｜RBAC 權限控制

**這小時你會做：**
- 四個核心物件：Role、RoleBinding、ClusterRole、ClusterRoleBinding
- ServiceAccount = Pod 的身份
- 建立一個只能 get 不能 delete 的使用者

**檢核：**
- [ ] 切換到受限使用者後 `kubectl get pods` 成功
- [ ] `kubectl delete pod` 被拒絕，顯示 Forbidden
- [ ] 能解釋 Role（Namespace 級別）和 ClusterRole（叢集級別）的差異
- [ ] `kubectl auth can-i delete pods --as=system:serviceaccount:dev:dev-viewer` 回傳 `no`

**反思：** 權限管好了，但你的叢集裡所有 Pod 之間是全通的。前端能直接連資料庫，這不合理。

---

### Hour 4｜NetworkPolicy + DaemonSet/Job/CronJob

**這小時你會做：**
- NetworkPolicy = Pod 級別的防火牆
- DaemonSet（每個 Node 跑一份）、Job（一次性）、CronJob（排程）

**檢核：**
- [ ] 建立 NetworkPolicy 後，`kubectl exec frontend -- curl db-svc` timeout（被擋了）
- [ ] `kubectl exec api -- curl db-svc` 成功（API → DB 允許）
- [ ] `kubectl get pods -o wide` 看到 DaemonSet 在每個 Node 都有一個 Pod
- [ ] `kubectl get cronjob` 看到排程任務，`kubectl get pods` 看到定時產生的 Pod

**反思：** 所有工具都學了，你能從零把一個完整系統部署起來嗎？

---

### Hour 5｜日誌除錯 + 總複習實戰（上）

**這小時你會做：**
- 常見問題排查清單（ImagePullBackOff、CrashLoopBackOff、Pending、OOMKilled）
- 開始總複習：從空的 Namespace 部署完整系統（Step 1-6）

**檢核：**
- [ ] 能說出 Pending 的三個常見原因（資源不夠、Node Selector 不符、PVC 未綁定）
- [ ] Step 1-6 完成：Namespace + Secret + ConfigMap + MySQL StatefulSet + API Deployment + 前端 Deployment

**反思：** 應用部署好了，但外面的人還連不到，也沒有健康檢查、沒有自動擴縮。

---

### Hour 6｜總複習實戰（下）+ 課程回顧

**這小時你會做：**
- 完成 Step 7-12：Service + Ingress + NetworkPolicy + Probe + Resource + HPA
- 驗證完整系統
- 課程回顧 + Docker → K8s 完整對照表

**檢核：**
- [ ] 瀏覽器打域名看到前端頁面
- [ ] 前端能呼叫 API → API 能讀寫 MySQL
- [ ] 刪掉一個 API Pod → 自動重建 → 服務不中斷
- [ ] 前端 Pod 連不到 DB（NetworkPolicy 生效）
- [ ] 壓測後 API 自動擴容（HPA 生效）

**第七堂結語：** 你從 `docker run` 一路走到 K8s 的 Deployment + Service + Ingress + ConfigMap + Secret + PV/PVC + StatefulSet + Helm + Probe + HPA + RBAC + NetworkPolicy。你已經具備了在生產環境中部署和管理容器化應用的能力。

---

## 四堂課一張圖

```
第四堂                    第五堂                      第六堂                         第七堂
Pod（一個容器）     →  Deployment（多個副本）    →  Ingress（域名存取）        →  Probe（健康檢查）
kubectl 五指令      →  Service（讓別人連得到）   →  ConfigMap/Secret（設定分離）→  Resource/HPA（自動擴縮）
排錯三兄弟          →  DNS（用名稱連）           →  PV/PVC（資料不丟）         →  RBAC（權限控制）
                    →  Namespace（隔離環境）     →  StatefulSet（有狀態應用）   →  NetworkPolicy（網路安全）
                    →  k3s（多節點叢集）         →  Helm（套件管理）           →  總複習（從零部署）
```

---

## 反思問題串接鏈

| 堂次 | 結尾反思問題 | 下堂開頭回答 |
|:---:|------------|------------|
| 第四堂 Hour 1 | 設定寫死在 Image 怎麼辦？ | → ConfigMap（第六堂教） |
| 第四堂 Hour 2 | 架構元件真的在跑嗎？ | → kubectl get pods -n kube-system |
| 第四堂 Hour 3 | 怎麼部署你的應用？ | → Pod YAML |
| 第四堂 Hour 4 | image 拼錯怎麼找問題？ | → 排錯三兄弟 |
| 第四堂 Hour 5 | 兩個容器要共享檔案？ | → Sidecar Pod |
| **第四堂結尾** | **Pod 刪了怎麼維持 3 副本？** | **→ 第五堂 Deployment** |
| 第五堂 Hour 1 | 怎麼讓 Pod 跑在不同 Node？ | → Deployment + 多節點 |
| 第五堂 Hour 2 | 更新版本不能停機？ | → 滾動更新 |
| 第五堂 Hour 3 | Pod IP 會變怎麼連？ | → Service |
| 第五堂 Hour 4 | 外部怎麼連進來？ | → NodePort |
| 第五堂 Hour 5 | 名字衝突怎麼辦？ | → Namespace |
| **第五堂結尾** | **使用者要用域名連** | **→ 第六堂 Ingress** |
| 第六堂 Hour 1 | 密碼寫在 Image 裡？ | → ConfigMap |
| 第六堂 Hour 2 | 密碼用明碼太危險？ | → Secret |
| 第六堂 Hour 3 | Pod 重啟資料消失？ | → PV/PVC |
| 第六堂 Hour 4 | 每次手動建 PV？ | → StorageClass |
| 第六堂 Hour 5 | YAML 太多了？ | → Helm |
| **第六堂結尾** | **API 卡死但顯示 Running** | **→ 第七堂 Probe** |
| 第七堂 Hour 1 | Pod 吃光記憶體？ | → Resource limits |
| 第七堂 Hour 2 | 實習生有 admin 權限？ | → RBAC |
| 第七堂 Hour 3 | Pod 之間全通不安全？ | → NetworkPolicy |
| 第七堂 Hour 4 | 能從零部署嗎？ | → 總複習實戰 |
