# Kubernetes 課程大綱（第四堂～第七堂）

> 總時數：27 小時
> 對象：已完成 Docker 三堂課的學員
> 環境：VMware Ubuntu + minikube（第四堂）/ Multipass + k3s（第五堂起）

---

## 課程總覽

| 堂次 | 日期 | 上午 (3hr) | 下午 (4hr/3hr) | 關鍵字 |
|:---:|------|-----------|---------------|-------|
| 4 | 3/28 | K8s 架構 + 環境安裝 | Pod + Deployment + 練習 | 部署應用 |
| 5 | 4/11 | k3s 多節點 + Deployment/ReplicaSet + 滾動更新 | Service + DNS + Namespace + 練習 | 服務與網路 |
| 6 | 4/18 | Ingress + ConfigMap + Secret | PV/PVC + StorageClass + StatefulSet + Helm | 設定與資料 |
| 7 | 4/25 | Probe + Resource/HPA + RBAC | NetworkPolicy + DaemonSet/Job/CronJob + 日誌除錯 + 總複習實戰 | 生產就緒 |

---

## 第四堂（3/28）7hr — K8s 入門：從 Docker 到 Kubernetes

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 40min | **為什麼需要 K8s** | Docker 單機的痛點：手動管理多容器、沒有自動重啟、無法跨機器擴展、滾動更新要自己處理。K8s 解決了什麼：自動排程、自我修復、水平擴展、聲明式管理 | `docker compose` 的極限 |
| 09:40 | 50min | **K8s 架構全貌** | Control Plane：API Server（大門）、etcd（資料庫）、Scheduler（排程員）、Controller Manager（管理員）。Worker Node：kubelet（工頭）、kube-proxy（網路員）、Container Runtime。畫架構圖、講每個元件的角色 | 對照 Docker Daemon |
| 10:30 | 10min | 休息 | | |
| 10:40 | 40min | **環境安裝** | minikube 安裝（或 kind）、啟動叢集、kubectl 安裝與設定、驗證叢集狀態 | `docker version` |
| 11:20 | 40min | **kubectl 入門** | `kubectl get`（查）、`kubectl describe`（詳情）、`kubectl logs`（日誌）、`kubectl exec`（進容器）、`kubectl apply/delete`（部署/刪除）、YAML 基本格式（apiVersion/kind/metadata/spec） | `docker ps/logs/exec` |

### 下午 13:00-17:00（4hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 13:00 | 50min | **Pod 深入** | Pod 是什麼（最小部署單位，一個或多個容器共享網路和儲存）、Pod YAML 撰寫、Pod 生命週期（Pending→Running→Succeeded/Failed）、多容器 Pod（Sidecar 模式）、Init Container | `docker run` |
| 13:50 | 10min | 休息 | | |
| 14:00 | 50min | **ReplicaSet + Deployment** | 為什麼不直接管 Pod（Pod 死了不會自動重建）、ReplicaSet 維持副本數、Deployment 管理 ReplicaSet。實作：`kubectl create deployment`、`kubectl scale`、`kubectl set image`（滾動更新）、`kubectl rollout undo`（回滾） | `docker compose --scale` |
| 14:50 | 10min | 休息 | | |
| 15:00 | 50min | **DaemonSet + Job/CronJob** | DaemonSet：每個 Node 跑一份（日誌收集、監控 agent）。Job：一次性任務（資料遷移、批次處理）。CronJob：排程任務（定時備份、定時清理）。實作：寫一個 CronJob 每分鐘印 Hello | `docker run --restart` |
| 15:50 | 10min | 休息 | | |
| 16:00 | 60min | **🔨 實作練習** | 把第三堂的 Nginx + API 從 Docker 搬到 K8s：1. 寫 API 的 Deployment YAML 2. 寫 Nginx 的 Deployment YAML 3. 用 kubectl apply 部署 4. kubectl get pods 驗證 5. kubectl logs 看日誌 | `docker compose up` → `kubectl apply` |

### 第四堂上午結束時，學生能做什麼

```
✅ 能說出 K8s 的 8 個核心概念，每個都能對照一個 Docker 功能
✅ 能畫出 Master（4 元件）+ Worker（3 元件）架構圖
✅ `minikube status` 顯示 Running，`kubectl get nodes` 看到 Ready
✅ `kubectl get pods -n kube-system` 能認出每個系統 Pod 對應哪個架構元件
```

### 第四堂下午結束時，學生能做什麼

```
✅ 能獨立寫出 Pod YAML，部署 nginx 並用 `port-forward` 在瀏覽器看到頁面
✅ 會用 `get`、`describe`、`logs`、`exec`、`delete` 五個 kubectl 指令
✅ 看到 `ImagePullBackOff` 知道用 `describe` 查原因、改 YAML 修好
✅ 能寫出多容器 Pod（Sidecar），兩個容器透過共享 Volume 傳資料
✅ 會用 `--dry-run=client -o yaml` 快速產生 YAML 範本
```

---

## 第五堂（4/11）7hr — 多節點叢集 + 服務與網路

### 故事線

> 第四堂你學會了在單機 minikube 上部署 Pod 和 Deployment，但真實世界不會只有一台機器。
> 這堂課我們先升級裝備——用 Multipass + k3s 建出「一個 Master + 兩個 Worker」的多節點叢集，
> 然後把應用部署上去，學會怎麼讓 Pod 之間互相溝通、怎麼讓外面的人連得進來。

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 15min | **回顧** | 第四堂重點回顧（Pod、Deployment、kubectl）、學生問題解答 | |
| 09:15 | 50min | **k3s 多節點環境搭建** | 為什麼要多節點（minikube 是單機，看不到排程效果）、Multipass 安裝與使用、用 Multipass 建立 3 台 VM（master/worker1/worker2）、k3s 安裝（master 裝 server、worker 裝 agent 加入叢集）、`kubectl get nodes` 驗證三節點 Ready | `docker swarm init`（概念對照） |
| 10:05 | 10min | 休息 | | |
| 10:15 | 50min | **Deployment + ReplicaSet 深入** | ReplicaSet 如何維持副本數（Pod 死了自動補）、Deployment 管理 ReplicaSet 的關係、`kubectl scale` 擴縮副本、觀察 Pod 分散在不同 Node 上（多節點的意義）。實作：部署 3 副本的 Nginx，看 Pod 分佈在哪些 Node | `docker compose --scale` |
| 11:05 | 10min | 休息 | | |
| 11:15 | 45min | **滾動更新 + 回滾** | 滾動更新策略（maxSurge / maxUnavailable）、`kubectl set image` 觸發更新、`kubectl rollout status` 觀察過程、`kubectl rollout history` 查看版本歷史、`kubectl rollout undo` 回滾到上一版。實作：故意更新到不存在的 Image 版本，觀察失敗狀態，再回滾 | 沒有直接對應（Docker 要手動處理） |

### 下午 13:00-17:00（4hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 13:00 | 50min | **Service 基礎** | 為什麼需要 Service（Pod IP 不固定、Pod 會重建）、三種類型：ClusterIP（叢集內部存取）、NodePort（開一個 port 給外部）、LoadBalancer（雲端負載均衡）。Label + Selector 機制（Service 怎麼知道要轉給哪些 Pod）。實作：建立 ClusterIP Service、用 curl 從另一個 Pod 連 | `-p 8080:80` |
| 13:50 | 10min | 休息 | | |
| 14:00 | 50min | **DNS 與服務發現** | CoreDNS 自動建立 DNS 記錄、`<service>.<namespace>.svc.cluster.local` 完整域名、短名稱存取（同 Namespace 內直接用 Service 名稱）。實作：從 Pod 裡用服務名稱 curl 到另一個服務、`nslookup` 驗證 DNS 解析 | `--network` + 容器名稱 DNS |
| 14:50 | 10min | 休息 | | |
| 15:00 | 40min | **Namespace** | 用 Namespace 隔離環境（dev/staging/prod）、`kubectl create namespace`、在不同 Namespace 部署相同應用、跨 Namespace 存取（`<service>.<namespace>.svc.cluster.local`）、`kubectl config set-context` 切換預設 Namespace | 沒有直接對應 |
| 15:40 | 10min | 休息 | | |
| 15:50 | 70min | **實作練習** | 在 k3s 多節點叢集上部署完整應用：1. 建立 `dev` Namespace 2. 部署 API（Deployment，3 副本）3. 部署 Nginx 前端（Deployment，2 副本）4. 建立 ClusterIP Service 讓前端連到 API 5. 建立 NodePort Service 讓外部連到前端 6. 驗證：用 `<NodeIP>:30080` 在瀏覽器看到頁面 7. 故意刪掉一個 Pod，觀察自動重建 | `docker compose up` → `kubectl apply` |

### 學完你會

**上午（k3s + Deployment + 滾動更新）**
```
✅ `kubectl get nodes` 看到 3 個 Ready（k3s-master, k3s-worker1, k3s-worker2）
✅ `kubectl get pods -o wide` 看到 Pod 分散在不同 Node 上
✅ `kubectl delete pod <pod名稱>` 後 `kubectl get pods` 看到新 Pod 自動出現（Deployment 自動重建）
✅ `kubectl rollout undo` 後 `kubectl get pods` 看到版本回到上一版
```

**下午（Service + DNS + Namespace）**
```
✅ `kubectl get svc` 看到 ClusterIP 和 NodePort Service
✅ 從 Pod 裡 `curl http://nginx-svc` 用名稱連到 Service（DNS 服務發現）
✅ 瀏覽器打 <NodeIP>:30080 看到 nginx 頁面（NodePort 對外存取）
✅ `kubectl get ns` 看到自己建的 dev Namespace
```

### 反思問題

> 你的 API 在跑了、Service 也建好了，但使用者要輸入 `IP:30080` 才能連進來。
> 生產環境怎麼讓使用者用 `myapp.com` 就能用？
> ——下堂課我們來教 Ingress。

---

## 第六堂（4/18）7hr — Ingress + 配置管理 + 資料持久化

### 故事線

> 上堂課你的應用已經跑在多節點叢集上了，但使用者要記 IP 和 Port 才能連進來，很不專業。
> 這堂課上午先解決「讓使用者用域名就能連」的問題（Ingress），順便學會把設定和密碼從程式碼裡抽出來（ConfigMap + Secret）。
> 下午解決「資料不見」的問題——Pod 重啟資料就沒了，怎麼辦？學會 PV/PVC 持久化儲存，再用 Helm 一鍵部署複雜應用。

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 15min | **回顧** | 第五堂重點回顧（k3s 多節點、Deployment、Service、DNS、Namespace） | |
| 09:15 | 50min | **Ingress** | 為什麼需要 Ingress（不想每個服務開一個 NodePort）、安裝 Ingress Controller（Traefik / nginx-ingress）、path-based routing（`/api` → API Service、`/` → 前端 Service）、host-based routing（`api.example.com` → API）。TLS/HTTPS 概念簡介。實作：建立 Ingress 規則，用域名存取上堂課的應用 | Nginx 反向代理 |
| 10:05 | 10min | 休息 | | |
| 10:15 | 45min | **ConfigMap** | 為什麼不把設定寫死在 Image 裡、從 literal / 檔案建立 ConfigMap、掛載為環境變數、掛載為 Volume 檔案、熱更新（subPath 不會更新的坑）。實作：用 ConfigMap 管理 Nginx 設定檔 | `-e ENV_VAR` |
| 11:00 | 10min | 休息 | | |
| 11:10 | 50min | **Secret** | 與 ConfigMap 的差異（Base64 編碼、記憶體儲存）、三種類型：Opaque（通用）、TLS（憑證）、docker-registry（拉私有映像）。最佳實踐：不要 commit 到 Git。實作：用 Secret 管理 MySQL 密碼，部署一個 API 同時用 ConfigMap（設定）和 Secret（密碼） | `-e MYSQL_PASSWORD` |

### 下午 13:00-17:00（4hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 13:00 | 50min | **PersistentVolume + PVC** | 為什麼 Pod 裡的資料會消失（跟 Docker 一樣）、PV（管理員建立的儲存空間）、PVC（使用者的儲存請求）、AccessMode（ReadWriteOnce/ReadOnlyMany/ReadWriteMany）、靜態 vs 動態佈建 | `docker volume create` |
| 13:50 | 10min | 休息 | | |
| 14:00 | 45min | **StorageClass + 動態佈建** | StorageClass 自動建立 PV、不同的 Provisioner（local-path、NFS、cloud）、Reclaim Policy（Retain/Delete）。實作：用 StorageClass 動態佈建 PV | Volume driver |
| 14:45 | 10min | 休息 | | |
| 14:55 | 50min | **StatefulSet** | 為什麼 Deployment 不適合跑資料庫、StatefulSet 的特性：穩定的網路標識（mysql-0, mysql-1）、有序部署/刪除、每個 Pod 有自己的 PVC。Headless Service 搭配 StatefulSet。實作：部署一個 MySQL StatefulSet | `docker run --name mysql` |
| 15:45 | 10min | 休息 | | |
| 15:55 | 65min | **Helm 入門** | 為什麼需要套件管理（YAML 太多、重複、難維護）、Helm 概念（Chart = 套件、Release = 安裝實例、Repository = 套件倉庫）。實作：`helm repo add`、`helm install`（裝一個現成的 MySQL/Redis）、`helm upgrade`、`helm rollback`、values.yaml 客製化 | `docker compose` 的進化版 |

### 學完你會

**上午（Ingress + ConfigMap + Secret）**
```
✅ 瀏覽器打 myapp.local 看到前端頁面（Ingress path routing 生效）
✅ `kubectl exec` 進 Pod 確認環境變數來自 ConfigMap（`echo $APP_ENV` 輸出設定值）
✅ `kubectl get secret -o yaml` 看到 Base64 編碼，`echo <值> | base64 -d` 能解碼出原始密碼
```

**下午（PV/PVC + StatefulSet + Helm）**
```
✅ 刪掉 Pod 重建後，資料庫資料還在（PVC 持久化驗證）
✅ `kubectl get pods` 看到 mysql-0, mysql-1 有序啟動（StatefulSet 有序部署）
✅ `helm install` 一行裝好 Redis，`helm list` 看到 Release 狀態為 deployed
```

### 反思問題

> 你的系統全部跑起來了，但你怎麼知道 API 有沒有卡死？
> 如果某個 Pod 的程式死鎖了，K8s 還是顯示 Running，流量照樣送過去，使用者看到 502。怎麼辦？
> ——下堂課我們來教 Probe（健康檢查）。

---

## 第七堂（4/25）7hr — 運維實戰 + 總複習

### 故事線

> 前兩堂課你已經會部署應用、設定網路、管理資料了。但這離「生產就緒」還差一步。
> 這堂課上午學三個生產必備技能：Probe（讓 K8s 知道你的應用是不是真的活著）、Resource/HPA（不要讓一個 Pod 吃光所有資源）、RBAC（不是每個人都該有 admin 權限）。
> 下午學 NetworkPolicy（Pod 之間的防火牆）、DaemonSet/Job/CronJob（特殊工作負載），再做一次從零到一的完整部署實戰，把四堂課學到的東西全部串起來。

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 15min | **回顧** | 第六堂重點回顧（Ingress、ConfigMap/Secret、PV/PVC、StatefulSet、Helm） | |
| 09:15 | 45min | **Health Check（Probe）** | 三種 Probe：livenessProbe（活著嗎？死了就重啟）、readinessProbe（準備好了嗎？沒好就不轉流量）、startupProbe（啟動慢的應用用這個）。三種檢查方式：HTTP GET、TCP Socket、exec 指令。實作：加 Probe 到 Deployment，故意讓它失敗看 K8s 怎麼處理 | `HEALTHCHECK` |
| 10:00 | 10min | 休息 | | |
| 10:10 | 50min | **Resource 管理 + HPA** | requests（保證給你的）vs limits（最多用這麼多）、QoS 等級（Guaranteed/Burstable/BestEffort）、OOMKilled 是什麼。HPA（Horizontal Pod Autoscaler）：CPU 到 80% 自動加 Pod。實作：設定 HPA、用壓測工具觸發擴縮 | `--memory` `--cpus` |
| 11:00 | 10min | 休息 | | |
| 11:10 | 50min | **RBAC + 安全基礎** | 為什麼需要權限控制（不是每個人都能 kubectl delete）、四個概念：Role（能做什麼）、RoleBinding（誰能做）、ClusterRole（叢集級別）、ClusterRoleBinding。ServiceAccount（Pod 的身份）。實作：建立一個只能看不能改的使用者 | 沒有直接對應 |

### 下午 13:00-17:00（4hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 13:00 | 40min | **NetworkPolicy** | Pod 之間的防火牆、預設全開 vs 預設全關、允許/拒絕特定流量、依標籤選擇。實作：前端只能連 API、API 只能連 DB，其他流量全擋 | `--network` 隔離 |
| 13:40 | 10min | 休息 | | |
| 13:50 | 40min | **DaemonSet + Job/CronJob** | DaemonSet：每個 Node 跑一份（日誌收集、監控 agent）。Job：一次性任務（資料遷移、批次處理）。CronJob：排程任務（定時備份、定時清理）。實作：寫一個 CronJob 每分鐘印 Hello、觀察 DaemonSet 在每個 Node 都有一份 | `docker run --restart` |
| 14:30 | 10min | 休息 | | |
| 14:40 | 30min | **日誌與除錯** | `kubectl logs`（看日誌）、`kubectl describe`（看事件）、`kubectl get events`（叢集事件）、`kubectl top`（資源用量）、常見問題排查流程（ImagePullBackOff、CrashLoopBackOff、Pending、OOMKilled）。工具推薦：K9s、Lens | `docker logs` |
| 15:10 | 10min | 休息 | | |
| 15:20 | 70min | **總複習實戰：從零部署完整系統** | 從一個空的 Namespace 開始，部署完整的應用：1. 建立 Namespace（prod） 2. 用 Secret 存 DB 密碼 3. 用 ConfigMap 存 API 設定 4. 部署 MySQL（StatefulSet + PVC） 5. 部署 API（Deployment + 3 副本 + Probe + Resource limits） 6. 部署前端（Deployment） 7. 建立 Service（ClusterIP） 8. 建立 Ingress 9. 設定 NetworkPolicy 10. 設定 HPA 11. 驗證：外部用域名連進來，看到前端頁面，壓測觸發自動擴縮 | |
| 16:30 | 10min | 休息 | | |
| 16:40 | 20min | **課程回顧** | Docker → K8s 完整對照表、四堂課知識地圖、推薦學習資源（官方文件、CKA 認證、社群）、常見面試題 | |

### 學完你會

**上午（Probe + Resource/HPA + RBAC）**
```
✅ 故意讓 livenessProbe 失敗，`kubectl get pods` 看到 RESTARTS 數字增加（K8s 自動重啟不健康的 Pod）
✅ 壓測後 `kubectl get pods -w` 看到副本數自動從 3 變成 5+（HPA 水平擴縮生效）
✅ 切換到受限使用者後 `kubectl delete pod` 被拒絕，顯示 Forbidden（RBAC 權限控制生效）
```

**下午（NetworkPolicy + 總複習）**
```
✅ frontend Pod `curl db-svc` 被拒絕（timeout），api Pod `curl db-svc` 成功回應（NetworkPolicy 流量管控生效）
✅ 從空的 prod Namespace 獨立完成 12 步部署（Secret → ConfigMap → StatefulSet → Deployment → Service → Ingress → NetworkPolicy → HPA），瀏覽器用域名看到頁面
```

---

## 三堂課故事線總覽

| 堂次 | 故事主軸 | 開場痛點 | 結尾成果 |
|:---:|---------|---------|---------|
| 第五堂 | 從單機到多節點，讓應用跑起來 | minikube 是單機，看不到排程和高可用 | 多節點叢集上跑著多副本應用，NodePort 可存取 |
| 第六堂 | 讓應用專業化：域名存取 + 設定外部化 + 資料持久化 | 使用者要記 IP:Port、設定寫死在 Image、Pod 重啟資料消失 | 域名存取、設定和密碼分離管理、資料庫資料不會因 Pod 重啟而遺失 |
| 第七堂 | 生產就緒：監控、安全、自動化 | 應用跑了但不知道健不健康、誰都能 kubectl delete、流量沒管控 | 完整的生產級部署：健康檢查 + 自動擴縮 + 權限控制 + 網路隔離 |

---

## Docker → K8s 對照表（給學生的）

| Docker | K8s | 說明 |
|--------|-----|------|
| `docker run` | `kubectl run` / Pod | 跑一個容器 |
| `docker compose up` | `kubectl apply -f` | 部署多個服務 |
| `docker compose.yaml` | Deployment + Service YAML | 服務定義檔 |
| `docker ps` | `kubectl get pods` | 查看運行中的容器/Pod |
| `docker logs` | `kubectl logs` | 看日誌 |
| `docker exec -it` | `kubectl exec -it` | 進容器 |
| `docker stop/rm` | `kubectl delete` | 停止/刪除 |
| `-p 8080:80` | Service (NodePort) | 對外開 port |
| `--network` DNS | Service DNS (CoreDNS) | 容器間用名稱互連 |
| Nginx 反向代理 | Ingress | HTTP 路由 |
| `--network` 隔離 | NetworkPolicy | 防火牆 |
| `-e ENV_VAR` | ConfigMap | 環境變數/設定檔 |
| `-e PASSWORD=xxx` | Secret | 敏感資料 |
| `docker volume` | PersistentVolumeClaim | 資料持久化 |
| `--restart always` | Deployment replicas | 自動重啟/維持副本數 |
| `HEALTHCHECK` | livenessProbe / readinessProbe | 健康檢查 |
| `--memory` `--cpus` | resources.requests/limits | 資源限制 |
| `docker compose --scale` | HPA | 自動擴縮 |
| 手動 `docker pull/push` | Helm | 套件管理 |
| docker-compose.yml | Helm Chart | 可重用的部署範本 |
| `docker swarm` | k3s / kubeadm 叢集 | 多節點容器編排 |

---

## 練習時間分配

| 堂次 | 講課時間 | 練習時間 | 練習內容 |
|:---:|:---:|:---:|------|
| 第四堂 | 5hr | 1hr (+1hr 裝環境) | Docker → K8s 搬移 |
| 第五堂 | 4hr | 1hr 10min (+50min 裝 k3s) | 多節點叢集部署 + Service 連通驗證 |
| 第六堂 | 4.5hr | 1.5hr (Ingress 實作 + Helm 實作) | Ingress 域名存取 + ConfigMap/Secret + StatefulSet + Helm |
| 第七堂 | 4hr | 1.5hr (+40min 總複習實戰) | Probe/HPA 實作 + NetworkPolicy + 從零部署完整系統 |

---

## 環境需求

| 項目 | 說明 |
|------|------|
| VMware | Ubuntu 22.04 VM |
| Docker | Docker Engine（VM 裡面裝） |
| minikube | 單機 K8s 叢集（第四堂使用） |
| Multipass | 輕量級 VM 管理工具（第五堂起用於建立多節點環境） |
| k3s | 輕量級 K8s 發行版（第五堂起使用，取代 minikube） |
| kubectl | K8s CLI |
| Helm | K8s 套件管理（第六堂安裝） |
| 記憶體 | VM 建議 8GB+（需跑 Multipass 建立 3 台 k3s 節點，每台 2GB） |
| 網路 | 需要能上網（拉 Image） |
