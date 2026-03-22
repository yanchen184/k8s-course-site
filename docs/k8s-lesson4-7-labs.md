# K8s 第四～七堂 實作內容安排

> 原則：每個主題講完就動手，不要連續講超過 50 分鐘
> 第四堂上午例外（概念 + 裝環境較多，前半段講多一點）

---

## 第四堂（3/28）7hr — 從 Docker 到 Kubernetes

### 上午 09:00-12:00（3hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00 | 講課 | 開場回顧 + Docker 的極限 + K8s 是什麼 + 架構圖 | 50min |
| 09:50 | 講課 | K8s 核心資源總覽 + 環境方案介紹 | 10min |
| 10:00 | 休息 | | 10min |
| 10:10 | **實作** | **minikube 安裝與啟動**：安裝 minikube、`minikube start`、`minikube status`、`minikube dashboard`、`kubectl get nodes` | 30min |
| 10:40 | 講課 | kubectl 是什麼 + 對照 docker 指令 | 10min |
| 10:50 | **實作** | **kubectl 初體驗**：`kubectl get nodes`、`kubectl get ns`、`kubectl get pods -A`、`kubectl describe node`、`kubectl cluster-info` | 15min |
| 11:05 | 講課 | YAML 基本格式（apiVersion / kind / metadata / spec） | 15min |
| 11:20 | **實作** | **第一個 Pod**：寫 `pod.yaml`（nginx）→ `kubectl apply -f pod.yaml` → `kubectl get pods` → `kubectl describe pod` → `kubectl logs` → `kubectl exec -it -- /bin/sh` → `kubectl delete pod` | 25min |
| 11:45 | 講課 | Pod 生命週期 + 常見狀態（CrashLoopBackOff、ImagePullBackOff） | 15min |

> 上午實作合計：**70 分鐘**（minikube 30 + kubectl 15 + Pod 25）

### 下午 13:00-17:00（4hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 13:00 | 講課 | 多容器 Pod（Sidecar）+ 為什麼不直接用 Pod | 20min |
| 13:20 | **實作** | **Sidecar Pod**：寫一個雙容器 Pod（nginx + busybox 看 log） | 15min |
| 13:35 | 講課 | Deployment 是什麼 + 三層關係 | 15min |
| 13:50 | **實作** | **建立 Deployment**：寫 `deployment.yaml`（nginx, replicas: 3）→ `kubectl apply` → `kubectl get deploy` → `kubectl get pods` → 看到 3 個 Pod | 15min |
| 14:05 | 休息 | | 10min |
| 14:15 | 講課 | 擴縮容概念 | 5min |
| 14:20 | **實作** | **擴縮容**：`kubectl scale --replicas=5` → 觀察 → `kubectl scale --replicas=2` → 觀察 Pod 被砍 | 10min |
| 14:30 | 講課 | 滾動更新 + 回滾概念 | 10min |
| 14:40 | **實作** | **滾動更新 + 回滾**：`kubectl set image` → `kubectl rollout status` → 觀察新舊 Pod 交替 → `kubectl rollout undo` → `kubectl rollout history` | 15min |
| 14:55 | 休息 | | 10min |
| 15:05 | 講課 | DaemonSet 概念 | 10min |
| 15:15 | **實作** | **DaemonSet**：寫 DaemonSet YAML → apply → `kubectl get pods -o wide` 看每個 Node 都有 | 10min |
| 15:25 | 講課 | Job / CronJob 概念 | 10min |
| 15:35 | **實作** | **CronJob**：寫 CronJob YAML（每分鐘印 Hello）→ apply → `kubectl get jobs` → `kubectl logs` 看結果 | 10min |
| 15:45 | 休息 | | 10min |
| 15:55 | **實作** | **🔨 綜合練習**：手動刪掉一個 Pod → Deployment 自動補回來 → 砍掉 Deployment 再重建 → 全流程走一遍 | 30min |
| 16:25 | 講課 | 第四堂總結 + Docker → K8s 對照表 | 15min |
| 16:40 | **實作** | **（自由練習）** 把第三堂的 Nginx 從 Docker 搬到 K8s Deployment | 20min |

> 下午實作合計：**125 分鐘**（Sidecar 15 + Deploy 15 + 擴縮 10 + 滾動 15 + DaemonSet 10 + CronJob 10 + 綜合 30 + 自由 20）
> **第四堂總實作：約 195 分鐘（3.25hr）**

---

## 第五堂（4/11）7hr — 網路與服務暴露

### 上午 09:00-12:00（3hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00 | 講課 | 開場回顧 + 為什麼需要 Service（Pod IP 不固定） | 15min |
| 09:15 | 講課 | ClusterIP 概念 | 10min |
| 09:25 | **實作** | **ClusterIP**：先部署 nginx Deployment → 寫 `service-clusterip.yaml` → apply → 跑一個 busybox Pod → `curl nginx-svc` 驗證 | 15min |
| 09:40 | 講課 | NodePort 概念（對照 `docker run -p`） | 10min |
| 09:50 | **實作** | **NodePort**：寫 `service-nodeport.yaml` → apply → `minikube ip` → `curl <ip>:<nodeport>` 從外部連 | 15min |
| 10:05 | 休息 | | 10min |
| 10:15 | 講課 | LoadBalancer + 三種 Service 比較 | 15min |
| 10:30 | **實作** | **LoadBalancer**：`minikube tunnel` → 建 LoadBalancer Service → `kubectl get svc` 看到 EXTERNAL-IP | 10min |
| 10:40 | 講課 | DNS 與服務發現（CoreDNS） | 15min |
| 10:55 | **實作** | **DNS 測試**：從 busybox Pod 裡 `nslookup nginx-svc` → `curl nginx-svc.default.svc.cluster.local` | 10min |
| 11:05 | 講課 | Namespace 概念 | 15min |
| 11:20 | **實作** | **Namespace**：`kubectl create ns dev` → 在 dev 裡部署同一個 nginx → 從 default ns 的 Pod 用完整 DNS 連 dev ns 的 Service | 20min |
| 11:40 | 講課 | 上午小結 | 5min |
| 11:45 | **實作** | **（自由練習）** 在兩個 Namespace 各部署一個服務，互相 curl | 15min |

> 上午實作合計：**85 分鐘**

### 下午 13:00-17:00（4hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 13:00 | 講課 | Ingress 是什麼 + 為什麼不用 NodePort | 15min |
| 13:15 | **實作** | **安裝 Ingress Controller**：`minikube addons enable ingress` → `kubectl get pods -n ingress-nginx` 確認 | 10min |
| 13:25 | 講課 | Path-based Routing 概念 | 10min |
| 13:35 | **實作** | **Path Routing**：部署兩個 Service（frontend + api）→ 寫 ingress.yaml（`/` → frontend、`/api` → api）→ 修改 `/etc/hosts` → `curl` 驗證 | 20min |
| 13:55 | 休息 | | 10min |
| 14:05 | 講課 | Host-based Routing 概念 | 10min |
| 14:15 | **實作** | **Host Routing**：修改 ingress.yaml 加第二個 host → `/etc/hosts` 加一條 → `curl app.local` 和 `curl api.local` | 15min |
| 14:30 | 講課 | Ingress TLS/HTTPS（cert-manager 簡介） | 15min |
| 14:45 | 休息 | | 10min |
| 14:55 | 講課 | NetworkPolicy 概念 | 15min |
| 15:10 | **實作** | **NetworkPolicy**：部署 frontend + api + db → 先驗證全通 → 寫 NetworkPolicy 禁止 frontend 直連 db → 驗證被擋 → api 連 db 仍然通 | 20min |
| 15:30 | 休息 | | 10min |
| 15:40 | **實作** | **🔨 綜合練習**：從零建完整鏈路 — Namespace + 3 個 Deployment + 3 個 Service + Ingress + NetworkPolicy | 60min |
| 16:40 | 講課 | 第五堂總結 + Docker → K8s 網路對照表 | 20min |

> 下午實作合計：**125 分鐘**
> **第五堂總實作：約 210 分鐘（3.5hr）**

---

## 第六堂（4/18）7hr — 配置管理 + 資料持久化 + Helm + k3s

### 上午 09:00-12:00（3hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00 | 講課 | 開場回顧 + ConfigMap 是什麼 | 15min |
| 09:15 | **實作** | **建立 ConfigMap**：`kubectl create configmap` 三種方式（--from-literal / --from-file / YAML）→ `kubectl get cm -o yaml` 看內容 | 15min |
| 09:30 | 講課 | 使用 ConfigMap（envFrom vs volumeMounts） | 10min |
| 09:40 | **實作** | **ConfigMap 掛載**：寫一個 Pod 用 envFrom 讀 ConfigMap → 進 Pod 看環境變數 → 改成 volume 掛載 Nginx 設定檔 → 修改 ConfigMap → 等 Pod 自動更新 | 20min |
| 10:00 | 休息 | | 10min |
| 10:10 | 講課 | Secret 是什麼 + 三種類型 | 15min |
| 10:25 | **實作** | **Secret**：`kubectl create secret generic db-cred --from-literal=password=my-secret` → 在 Pod 裡用 env 引用 → 進 Pod 看 `echo $PASSWORD` → 也試 volume 掛載方式 | 15min |
| 10:40 | 講課 | ConfigMap 熱更新的坑（subPath 不更新、env 不更新） | 10min |
| 10:50 | **實作** | **🔨 練習**：部署 MySQL（密碼用 Secret）+ Nginx（設定用 ConfigMap）→ 改 ConfigMap → 驗證 Nginx 設定有更新 | 30min |
| 11:20 | 休息 | | 10min |
| 11:30 | 講課 | 小結：ConfigMap vs Secret 怎麼選 | 10min |
| 11:40 | **實作** | **（自由練習）** 部署一個 API，同時用 ConfigMap（設定檔）和 Secret（DB 密碼） | 20min |

> 上午實作合計：**100 分鐘**

### 下午 13:00-17:00（4hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 13:00 | 講課 | 為什麼需要持久化 + PV / PVC 概念 | 20min |
| 13:20 | **實作** | **PV + PVC**：寫 PV YAML（hostPath）→ 寫 PVC → Pod 掛載 PVC → 寫入檔案 → 砍 Pod → 重建 → 檔案還在 | 20min |
| 13:40 | 講課 | StorageClass + AccessMode | 15min |
| 13:55 | 休息 | | 10min |
| 14:05 | 講課 | StatefulSet 概念（為什麼 Deployment 不適合跑 DB） | 15min |
| 14:20 | **實作** | **StatefulSet**：部署 MySQL StatefulSet + PVC → 進 MySQL 寫資料 → 砍 Pod → Pod 自動重建（mysql-0）→ 資料還在 | 20min |
| 14:40 | 休息 | | 10min |
| 14:50 | 講課 | Helm 是什麼 + 基本概念 | 15min |
| 15:05 | **實作** | **Helm**：`helm repo add bitnami` → `helm search repo mysql` → `helm install my-mysql bitnami/mysql` → `kubectl get pods` 看到一整套跑起來 → `helm list` → `helm uninstall` | 20min |
| 15:25 | 休息 | | 10min |
| 15:35 | 講課 | k3s 概念 + 為什麼現在教 | 10min |
| 15:45 | **實作** | **k3s 安裝**：VMware 開兩台 Ubuntu → Master 裝 k3s → 取 token → Worker 加入 → `kubectl get nodes` 看到兩個節點 | 25min |
| 16:10 | **實作** | **k3s 部署**：把之前的 Deployment apply 到 k3s → `kubectl get pods -o wide` → Pod 分散在不同 Node | 15min |
| 16:25 | **實作** | **🔨 綜合練習**：在 k3s 上部署 MySQL StatefulSet + PVC + 用 Helm 裝 Redis → 驗證資料持久化 | 20min |
| 16:45 | 講課 | 第六堂總結 | 15min |

> 下午實作合計：**120 分鐘**
> **第六堂總實作：約 220 分鐘（3.67hr）**

---

## 第七堂（4/25）6hr — 運維實戰 + 總複習

### 上午 09:00-12:00（3hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00 | 講課 | 開場回顧 + Probe 三種類型 + 三種檢查方式 | 20min |
| 09:20 | **實作** | **Probe**：在 Deployment 加 livenessProbe（HTTP /health）+ readinessProbe → apply → `kubectl describe` 看 Probe 狀態 → 故意讓 /health 回 500 → 觀察 K8s 自動重啟 Pod | 20min |
| 09:40 | 講課 | Resource requests / limits + QoS | 15min |
| 09:55 | **實作** | **Resource**：給 Pod 設 `resources.requests` 和 `limits` → 跑一個吃 CPU 的 Pod → 看它被 OOMKilled | 10min |
| 10:05 | 休息 | | 10min |
| 10:15 | 講課 | HPA 概念 | 10min |
| 10:25 | **實作** | **HPA**：`kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=50` → 用 busybox 跑 `while true; do wget -q -O- http://nginx; done` 壓測 → `kubectl get hpa` 看 Pod 數量變化 | 20min |
| 10:45 | 講課 | RBAC 概念（Role / RoleBinding / ClusterRole） | 15min |
| 11:00 | **實作** | **RBAC**：建 ServiceAccount → 建 Role（只能 get pods）→ 建 RoleBinding → 用該 SA 測試 `kubectl get pods`（成功）→ `kubectl delete pod`（被拒） | 20min |
| 11:20 | 講課 | 日誌與除錯技巧 | 15min |
| 11:35 | **實作** | **除錯練習**：故意部署一個壞的 Pod（image 拼錯）→ 用 `kubectl describe`、`kubectl logs`、`kubectl get events` 找出問題 → 修好它 | 15min |
| 11:50 | 講課 | RKE 介紹 + RKE vs k3s vs kubeadm 比較 | 10min |

> 上午實作合計：**85 分鐘**

### 下午 13:00-16:00（3hr）

| 時間 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 13:00 | **實作** | **🔨 總複習實戰：從零部署完整系統**（90 分鐘） | |
| | | Step 1：`kubectl create namespace production` | |
| | | Step 2：建 Secret（DB 密碼） | |
| | | Step 3：建 ConfigMap（Nginx 設定 + API 設定） | |
| | | Step 4：部署 MySQL StatefulSet + PVC | |
| | | Step 5：部署 API Deployment（3 replicas） | |
| | | Step 6：部署前端 Nginx Deployment | |
| | | Step 7：建 ClusterIP Service（三個） | |
| | | Step 8：建 Ingress（`/` → 前端、`/api` → API） | |
| | | Step 9：加 livenessProbe + readinessProbe | |
| | | Step 10：加 Resource limits | |
| | | Step 11：設 HPA | |
| | | Step 12：驗證 — 瀏覽器打開域名看到頁面 | 90min |
| 14:30 | 休息 | | 10min |
| 14:40 | 講課 | 課程完整回顧（Day 1 ~ Day 7）+ Docker → K8s 對照表 + 環境方案總結 | 20min |
| 15:00 | 講課 | 接下來的學習路徑（CKA、K9s、Lens） | 10min |
| 15:10 | **實作** | **（自由時間）** 安裝 K9s → 用 K9s 瀏覽剛才部署的系統 → 體驗 GUI 管理 | 20min |
| 15:30 | 講課 | Q&A + 結語 | 30min |

> 下午實作合計：**110 分鐘**
> **第七堂總實作：約 195 分鐘（3.25hr）**

---

## 實作時間統計

| 堂次 | 總時數 | 講課時間 | 實作時間 | 實作佔比 |
|:---:|:---:|:---:|:---:|:---:|
| 第四堂 | 7hr | 3.75hr | **3.25hr** | 46% |
| 第五堂 | 7hr | 3.5hr | **3.5hr** | 50% |
| 第六堂 | 7hr | 3.33hr | **3.67hr** | 52% |
| 第七堂 | 6hr | 2.75hr | **3.25hr** | 54% |
| **合計** | **27hr** | **13.33hr** | **13.67hr** | **51%** |

> 越到後面實作比例越高，符合「先打基礎、後面多動手」的節奏

---

## 實作清單一覽

### 第四堂（12 個實作）
1. minikube 安裝與啟動
2. kubectl 初體驗（get / describe / cluster-info）
3. 第一個 Pod（nginx，完整 CRUD）
4. Sidecar Pod（雙容器）
5. 建立 Deployment（replicas: 3）
6. 擴縮容（5 → 2）
7. 滾動更新 + 回滾
8. DaemonSet
9. CronJob（每分鐘印 Hello）
10. 綜合練習（刪 Pod 看自動恢復）
11. 自由練習（Docker → K8s 搬移）

### 第五堂（10 個實作）
1. ClusterIP Service（busybox curl 測試）
2. NodePort Service（外部 curl）
3. LoadBalancer（minikube tunnel）
4. DNS 測試（nslookup + 完整 DNS）
5. Namespace（跨 NS 互連）
6. 安裝 Ingress Controller
7. Path-based Routing
8. Host-based Routing
9. NetworkPolicy（前端不能直連 DB）
10. 綜合練習（完整鏈路）

### 第六堂（10 個實作）
1. 建立 ConfigMap（三種方式）
2. ConfigMap 掛載（env + volume + 熱更新）
3. Secret（建立 + 引用）
4. ConfigMap + Secret 練習（MySQL + Nginx）
5. PV + PVC（寫入 → 砍 Pod → 資料還在）
6. StatefulSet（MySQL + 資料持久化驗證）
7. Helm（安裝 + 查詢 + 移除）
8. k3s 安裝（雙節點）
9. k3s 部署（Pod 分散驗證）
10. 綜合練習（k3s 上跑 StatefulSet + Helm）

### 第七堂（6 個實作）
1. Probe（liveness + readiness + 故意失敗）
2. Resource limits（OOMKilled 體驗）
3. HPA（壓測觸發自動擴縮）
4. RBAC（只讀 ServiceAccount）
5. 除錯練習（故意壞的 Pod）
6. 🔨 總複習（從零部署完整系統 12 步）
7. K9s 體驗
