# Kubernetes 課程大綱（第四堂～第七堂）

> 總時數：27 小時
> 對象：已完成 Docker 三堂課的學員
> 環境：VMware Ubuntu + minikube/kind

---

## 課程總覽

| 堂次 | 日期 | 上午 (3hr) | 下午 (4hr/3hr) | 關鍵字 |
|:---:|------|-----------|---------------|-------|
| 4 | 3/28 | K8s 架構 + 環境安裝 | Pod + Deployment + 練習 | 部署應用 |
| 5 | 4/11 | Service + DNS + Namespace | Ingress + NetworkPolicy + 練習 | 讓外面連得到 |
| 6 | 4/18 | ConfigMap + Secret + 練習 | PV/PVC + StatefulSet + Helm | 設定與資料 |
| 7 | 4/25 | Health Check + Resource + RBAC | 總複習實戰 + Q&A | 生產就緒 |

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

### 第四堂結束時，學生能做什麼

```
✅ 本機有一個能跑的 K8s 叢集
✅ 會用 kubectl 查詢、部署、刪除
✅ 能寫 Pod / Deployment YAML
✅ 能做擴縮容和滾動更新
✅ 能把 Docker 應用搬到 K8s
```

---

## 第五堂（4/11）7hr — 網路與服務暴露

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 15min | **回顧** | 第四堂重點回顧、學生問題解答 | |
| 09:15 | 45min | **Service 基礎** | 為什麼需要 Service（Pod IP 不固定）、三種類型：ClusterIP（叢集內部）、NodePort（開一個 port 給外部）、LoadBalancer（雲端負載均衡）。實作：建立 Service、用 curl 從另一個 Pod 連 | `-p 8080:80` |
| 10:00 | 10min | 休息 | | |
| 10:10 | 50min | **DNS 與服務發現** | CoreDNS 自動建立 DNS 記錄、`<service>.<namespace>.svc.cluster.local`。實作：從 Pod 裡用服務名稱連到另一個服務。跨 Namespace 存取 | `--network` + 容器名稱 DNS |
| 11:00 | 60min | **Namespace** | 用 Namespace 隔離環境（dev/staging/prod）、`kubectl create namespace`、在不同 Namespace 部署相同應用。ResourceQuota（限制 Namespace 的資源用量）、LimitRange（限制單個 Pod 的資源） | 沒有直接對應 |

### 下午 13:00-17:00（4hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 13:00 | 50min | **Ingress 基礎** | 為什麼需要 Ingress（不想每個服務開一個 NodePort）、安裝 Ingress Controller（nginx-ingress）、path-based routing（`/api` → API、`/` → 前端）、host-based routing（`api.example.com` → API） | Nginx 反向代理 |
| 13:50 | 10min | 休息 | | |
| 14:00 | 40min | **Ingress 進階** | TLS/HTTPS 設定（cert-manager 簡介）、annotations（rewrite-target、proxy-body-size）、多服務路由完整範例 | Nginx + Let's Encrypt |
| 14:40 | 10min | 休息 | | |
| 14:50 | 40min | **NetworkPolicy** | Pod 之間的防火牆、預設全開 vs 預設全關、允許/拒絕特定流量、依標籤選擇。實作：前端只能連 API、API 只能連 DB | `--network` 隔離 |
| 15:30 | 10min | 休息 | | |
| 15:40 | 80min | **🔨 實作練習** | 完整鏈路部署：1. 部署前端（Nginx） 2. 部署 API（Node.js/Python） 3. 部署 DB（MySQL） 4. 建立 Service 讓它們互連 5. 建立 Ingress 讓外部用域名連進來 6. 建立 NetworkPolicy 限制流量方向 | `docker compose` 的完整版 |

### 第五堂結束時，學生能做什麼

```
✅ 能讓外部使用者透過域名連到 K8s 裡的服務
✅ 理解 ClusterIP / NodePort / LoadBalancer 的差異
✅ 能用 Namespace 隔離不同環境
✅ 能設定 Pod 之間的防火牆規則
✅ 能部署完整的前端 → API → DB 鏈路
```

---

## 第六堂（4/18）7hr — 配置管理 + 資料持久化

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 15min | **回顧** | 第五堂重點回顧 | |
| 09:15 | 45min | **ConfigMap** | 為什麼不把設定寫死在 Image 裡、從 literal / 檔案 / 目錄建立 ConfigMap、掛載為環境變數、掛載為 Volume 檔案、熱更新（subPath 不會更新的坑） | `-e ENV_VAR` |
| 10:00 | 10min | 休息 | | |
| 10:10 | 45min | **Secret** | 與 ConfigMap 的差異（Base64 編碼、記憶體儲存）、三種類型：Opaque（通用）、TLS（憑證）、docker-registry（拉私有映像）。最佳實踐：不要 commit 到 Git、用 Sealed Secrets 或 External Secrets | `-e MYSQL_PASSWORD` |
| 10:55 | 10min | 休息 | | |
| 11:05 | 55min | **🔨 實作練習** | 1. 用 ConfigMap 管理 Nginx 設定檔（修改 ConfigMap → Pod 自動更新） 2. 用 Secret 管理 MySQL 密碼（不再寫在 YAML 裡） 3. 部署一個 API 同時用 ConfigMap（設定）和 Secret（密碼） | `.env` + `compose.yaml` |

### 下午 13:00-17:00（4hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 13:00 | 50min | **PersistentVolume + PVC** | 為什麼 Pod 裡的資料會消失（跟 Docker 一樣）、PV（管理員建立的儲存空間）、PVC（使用者的儲存請求）、AccessMode（ReadWriteOnce/ReadOnlyMany/ReadWriteMany）、靜態 vs 動態佈建 | `docker volume create` |
| 13:50 | 10min | 休息 | | |
| 14:00 | 50min | **StorageClass + 動態佈建** | StorageClass 自動建立 PV、不同的 Provisioner（local、NFS、cloud）、Reclaim Policy（Retain/Delete）、實作：用 StorageClass 動態佈建 | Volume driver |
| 14:50 | 10min | 休息 | | |
| 15:00 | 50min | **StatefulSet** | 為什麼 Deployment 不適合跑資料庫、StatefulSet 的特性：穩定的網路標識（mysql-0, mysql-1）、有序部署/刪除、每個 Pod 有自己的 PVC。實作：部署一個 MySQL StatefulSet | `docker run --name mysql` |
| 15:50 | 10min | 休息 | | |
| 16:00 | 60min | **Helm 入門** | 為什麼需要套件管理（YAML 太多、重複、難維護）、Helm 概念（Chart = 套件、Release = 安裝實例、Repository = 套件倉庫）。實作：`helm repo add`、`helm install`（裝一個現成的 MySQL/Redis）、`helm upgrade`、`helm rollback`、values.yaml 客製化 | `docker compose` 的進化版 |

### 第六堂結束時，學生能做什麼

```
✅ 能用 ConfigMap 管設定、Secret 管密碼
✅ 能部署有狀態應用（MySQL）且資料不會消失
✅ 理解 PV/PVC/StorageClass 的關係
✅ 能用 Helm 一行指令安裝複雜應用
```

---

## 第七堂（4/25）6hr — 運維實戰 + 總複習

### 上午 09:00-12:00（3hr）

| 時段 | 時長 | 主題 | 內容 | 對照 Docker |
|------|:---:|------|------|-----------|
| 09:00 | 15min | **回顧** | 第六堂重點回顧 | |
| 09:15 | 45min | **Health Check（Probe）** | 三種 Probe：livenessProbe（活著嗎？死了就重啟）、readinessProbe（準備好了嗎？沒好就不轉流量）、startupProbe（啟動慢的應用用這個）。三種檢查方式：HTTP GET、TCP Socket、exec 指令。實作：加 Probe 到 Deployment，故意讓它失敗看 K8s 怎麼處理 | `HEALTHCHECK` |
| 10:00 | 10min | 休息 | | |
| 10:10 | 50min | **Resource 管理 + HPA** | requests（保證給你的）vs limits（最多用這麼多）、QoS 等級（Guaranteed/Burstable/BestEffort）、OOMKilled 是什麼。HPA（Horizontal Pod Autoscaler）：CPU 到 80% 自動加 Pod。實作：設定 HPA、用壓測工具觸發擴縮 | `--memory` `--cpus` |
| 11:00 | 60min | **RBAC + 安全基礎** | 為什麼需要權限控制（不是每個人都能 kubectl delete）、四個概念：Role（能做什麼）、RoleBinding（誰能做）、ClusterRole（叢集級別）、ClusterRoleBinding。ServiceAccount（Pod 的身份）。實作：建立一個只能看不能改的使用者 | 沒有直接對應 |

### 下午 13:00-16:00（3hr）

| 時段 | 時長 | 主題 | 內容 |
|------|:---:|------|------|
| 13:00 | 30min | **日誌與除錯** | `kubectl logs`（看日誌）、`kubectl describe`（看事件）、`kubectl get events`（叢集事件）、`kubectl top`（資源用量）、常見問題排查（ImagePullBackOff、CrashLoopBackOff、Pending）。工具推薦：K9s、Lens |
| 13:30 | 10min | 休息 | |
| 13:40 | 80min | **🔨 總複習實戰：從零部署完整系統** | 從一個空的叢集開始，部署完整的應用：1. 建立 Namespace（dev） 2. 用 Secret 存 DB 密碼 3. 用 ConfigMap 存 API 設定 4. 部署 MySQL（StatefulSet + PVC） 5. 部署 API（Deployment + 3 副本） 6. 部署前端（Deployment） 7. 建立 Service（ClusterIP） 8. 建立 Ingress 9. 加 livenessProbe + readinessProbe 10. 加 Resource limits 11. 設定 HPA 12. 驗證：外部用域名連進來，看到前端頁面 |
| 15:00 | 10min | 休息 | |
| 15:10 | 30min | **課程回顧** | Docker → K8s 完整對照表、四堂課知識地圖、推薦學習資源（官方文件、CKA 認證、社群）、常見面試題 |
| 15:40 | 20min | **Q&A + 結語** | 學生問題、課程意見回饋 |

### 第七堂結束時，學生能做什麼

```
✅ 能設定 Pod 的健康檢查（自動重啟、自動移除）
✅ 能設定資源限制和自動擴縮
✅ 能設定基本的 RBAC 權限控制
✅ 能獨立從零部署一個生產級的完整系統
✅ 知道出問題時怎麼排查
```

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

---

## 練習時間分配

| 堂次 | 講課時間 | 練習時間 | 練習內容 |
|:---:|:---:|:---:|------|
| 第四堂 | 5hr | 1hr (+1hr 裝環境) | Docker → K8s 搬移 |
| 第五堂 | 4.5hr | 1.5hr | 完整前後端 + DB + Ingress |
| 第六堂 | 4hr | 2hr (上午1hr+下午1hr) | ConfigMap/Secret + StatefulSet+Helm |
| 第七堂 | 3.5hr | 1.5hr (+1hr Q&A) | 從零部署完整系統 |

---

## 環境需求

| 項目 | 說明 |
|------|------|
| VMware | Ubuntu 22.04 VM |
| Docker | Docker Engine（VM 裡面裝） |
| minikube | 單機 K8s 叢集 |
| kubectl | K8s CLI |
| Helm | K8s 套件管理 |
| 記憶體 | VM 建議 4GB+（minikube 至少 2GB） |
| 網路 | 需要能上網（拉 Image） |
