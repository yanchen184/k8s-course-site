# K8s 第四～七堂 課程規劃

---

## 環境安排

| 堂次 | 環境 | 為什麼 |
|:---:|------|------|
| 第四堂 | minikube | 建立 K8s 全貌、學 Pod、kubectl 進階、MySQL env 與 Deployment 入門，單節點就夠 |
| 第五堂開頭 | 裝 k3s | Deployment 進階、Service 與跨 Node 驗證需要看到多節點 |
| 第五～七堂 | k3s 為主 | 多節點操作 |
| RKE | 待定 | 之後再討論 |

---

## 每堂課學生帶回家的能力

| 堂次 | 一句話 | 具體能力 |
|:---:|------|---------|
| 第四堂 | **會在 K8s 上操作 Pod，並理解 Deployment 為什麼存在** | 理解 K8s 全貌與架構、裝好 minikube、kubectl 基本/進階操作、寫 Pod YAML 做 CRUD、看懂 kube-system 裡的元件、會排 Pod 基本錯誤、理解 Sidecar / env，以及 Deployment 的三層關係與自我修復 |
| 第五堂 | **會在多節點 K8s 上管理 Deployment，並讓瀏覽器連到 K8s 裡的服務** | 裝 k3s 多節點、Deployment 擴縮容/滾動更新/回滾/自我修復、Service 三種類型、DNS 服務發現、Namespace 隔離、DaemonSet、CronJob |
| 第六堂 | **會部署帶資料庫的完整網站** | ConfigMap 管設定、Secret 管密碼、Ingress 路由（Path + Host）、PV/PVC 持久化、StatefulSet 部署 MySQL、Helm 一鍵安裝 |
| 第七堂 | **會從零獨立建一整套系統** | Probe 健康檢查、Resource limits、HPA 自動擴縮、RBAC 權限控制、故障排除、從零部署完整系統 12 步 |

---

## 第四堂（3/28）7hr — K8s 全貌 + Pod + Deployment 入門

### 時間表

| 時段 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00-10:00 | 講課 | **K8s 全貌（上）**：為什麼需要 K8s → 核心概念（Pod / Service / Ingress / ConfigMap / Secret / Volume / Deployment / StatefulSet） | 60min |
| 10:00-10:10 | 休息 | | 10min |
| 10:10-11:10 | 講課 + 實作 | **K8s 全貌（下）**：K8s 架構（Master：API Server / etcd / Scheduler / Controller Manager、Worker：kubelet / kube-proxy / Container Runtime）、完整流程（kubectl → Pod 跑起來）、環境方案比較（minikube / k3s / RKE） + **實作 1+2**：minikube 安裝 + kubectl 探索 + 驗證架構元件 | 60min |
| 11:10-12:00 | 講課 + 實作 | **實作 3**：YAML 基本格式 + 第一個 Pod — 寫 pod.yaml → apply → get → describe → logs → exec → delete | 50min |
| 12:00-13:00 | 午休 | | |
| 13:00-13:40 | 實作 | **實作 4**：Loop 1 — Pod phase / STATUS + 排錯（ImagePullBackOff、CrashLoopBackOff） | 40min |
| 13:40-14:20 | 實作 | **實作 5**：Loop 2 — 多容器 Pod（Sidecar）— nginx + busybox 共享 volume | 40min |
| 14:20-14:30 | 休息 | | 10min |
| 14:30-15:10 | 實作 | **實作 6**：Loop 3 — kubectl 進階（-o wide / port-forward / dry-run / explain） | 40min |
| 15:10-15:20 | 休息 | | 10min |
| 15:20-16:05 | 實作 | **實作 7**：Loop 4 — MySQL Pod + env（故意做錯再修好） | 45min |
| 16:05-16:45 | 實作 | **實作 8**：Loop 5 — Deployment 入門（三層關係 + 自我修復） | 40min |
| 16:45-17:00 | 講課 | 第四堂總結 + 回家作業 + 預告第五堂（Deployment 進階 + Service） | 15min |

### 實作清單

| # | 實作名稱 | 學生動手做什麼 | 預期看到什麼 |
|:---:|---------|------------|------------|
| 1 | minikube 安裝啟動 | `minikube start`、`minikube status`、`minikube dashboard` | 叢集啟動成功、Dashboard 打開 |
| 2 | 驗證架構元件 + kubectl 探索 | `kubectl get nodes -o wide`、`kubectl get pods -n kube-system`、`kubectl describe node`、`kubectl cluster-info`、`kubectl get ns` | 親眼看到 apiserver、etcd、scheduler、proxy、coredns 都在跑 |
| 3 | 第一個 Pod | 寫 `pod.yaml`（nginx）→ `kubectl apply -f` → `get pods` → `describe pod` → `logs` → `exec -it -- /bin/sh` → `delete pod` | 完整 Pod 生命週期操作 |
| 4 | Pod 排錯 | 故意寫錯 image（`ngin` 而不是 `nginx`）→ `get pods` 看 ImagePullBackOff → `describe pod` 找原因 → 修正 YAML → 重新 apply | 學會用 describe 排錯 |
| 5 | 多容器 Pod（Sidecar） | 寫一個雙容器 Pod（nginx + busybox tail log）→ `kubectl logs <pod> -c busybox` | 兩個容器共享 volume，busybox 能看到 nginx 的 log |
| 6 | kubectl 進階技巧 | 練習 `-o wide`、`-o yaml`、`port-forward`、`run --dry-run=client -o yaml`、`kubectl explain` | 會更快觀察狀態、臨時連 Pod、快速生 YAML 骨架 |
| 7 | MySQL Pod + env | 故意建 `mysql-broken` → `logs` 看錯誤 → 補 `MYSQL_ROOT_PASSWORD` → `exec` 進 MySQL | 理解 env 注入與 CrashLoopBackOff 排錯 |
| 8 | Deployment 入門 | 寫 `deployment.yaml`（nginx, replicas: 3）→ `get deploy,rs,pods` → 手動 `delete pod` → 觀察自動補回 | 看懂三層關係與自我修復 |

---

## 第五堂（4/11）7hr — Deployment 進階 + Service

### 時間表

| 時段 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00-09:15 | 講課 | 開場回顧 | 15min |
| 09:15-10:00 | 實作 | **實作 1：裝 k3s**（VMware 兩台 Ubuntu → master 裝 k3s → worker 加入 → `kubectl get nodes` 看到兩個節點） | 45min |
| 10:00-10:10 | 休息 | | 10min |
| 10:10-10:25 | 講課 | Deployment 複習（三層關係 + 聲明式管理） | 15min |
| 10:25-11:00 | 實作 | **實作 2：把 Deployment 放到 k3s** → `get deploy,rs,pods -o wide` → 看到三層 + Pod 分散在不同 Node | 35min |
| 11:00-11:15 | 講課 | 擴縮容 + 滾動更新 + 回滾概念 | 15min |
| 11:15-12:00 | 實作 | **實作 3+4+5：擴縮容 → 滾動更新 → 回滾 → 自我修復**（手動 delete pod 看自動補回） | 45min |
| 12:00-13:00 | 午休 | | |
| 13:00-13:15 | 講課 | 為什麼需要 Service（Pod IP 不固定） | 15min |
| 13:15-13:45 | 實作 | **實作 6：ClusterIP Service** → busybox 裡 `curl nginx-svc` | 30min |
| 13:45-14:15 | 實作 | **實作 7：NodePort Service** → `curl <node-ip>:<nodeport>` 從外部連 | 30min |
| 14:15-14:25 | 休息 | | 10min |
| 14:25-14:40 | 講課 | LoadBalancer + 三種比較 + DNS 服務發現 | 15min |
| 14:40-15:10 | 實作 | **實作 8：DNS 測試** → `nslookup nginx-svc` + 完整 FQDN | 30min |
| 15:10-15:20 | 休息 | | 10min |
| 15:20-15:35 | 講課 | Namespace 概念 | 15min |
| 15:35-16:05 | 實作 | **實作 9：Namespace** → 跨 NS 互連 | 30min |
| 16:05-16:25 | 講課 | DaemonSet + CronJob 概念 | 20min |
| 16:25-16:50 | 實作 | **實作 10+11：DaemonSet + CronJob** | 25min |
| 16:50-17:00 | 講課 | 第五堂總結 | 10min |

### 實作清單

| # | 實作名稱 | 學生動手做什麼 | 預期看到什麼 |
|:---:|---------|------------|------------|
| 1 | k3s 安裝 | VMware 兩台 Ubuntu → master 裝 k3s → 取 token → worker 加入 | `kubectl get nodes` 看到 master + worker |
| 2 | 把 Deployment 放到多節點叢集 | 寫 `deployment.yaml`（nginx, replicas:3）→ `apply` → `get deploy,rs,pods -o wide` | 三層關係 + Pod 分散在不同 Node |
| 3 | 擴縮容 | `kubectl scale --replicas=5` → 觀察 → `--replicas=2` → 觀察 Pod 被砍 | 數量自動調整 |
| 4 | 滾動更新 + 回滾 | `set image` → `rollout status` → 觀察新舊交替 → `rollout undo` → `rollout history` | 零停機更新 + 一行回滾 |
| 5 | 自我修復 | 手動 `kubectl delete pod` → 觀察 Deployment 自動補回 | 聲明式管理 |
| 6 | ClusterIP Service | 部署 nginx + 建 ClusterIP Service → busybox Pod 裡 `curl nginx-svc` | 叢集內互連 |
| 7 | NodePort Service | 建 NodePort Service → `curl <node-ip>:<nodeport>` | 外部瀏覽器打開看到 nginx |
| 8 | DNS 測試 | busybox 裡 `nslookup nginx-svc` + `curl nginx-svc.default.svc.cluster.local` | CoreDNS 運作 |
| 9 | Namespace | `create ns dev` → 部署到 dev → 從 default 用完整 DNS 連 dev 的 Service | 環境隔離 + 跨 NS 通訊 |
| 10 | DaemonSet | 寫 DaemonSet YAML → `get pods -o wide` | 每個 Node 都跑一份 |
| 11 | CronJob | 每分鐘印 Hello → `get jobs` → `logs` | 排程任務 |

---

## 第六堂（4/18）7hr — 配置 + 儲存 + Ingress + Helm

### 時間表

| 時段 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00-09:15 | 講課 | 開場回顧 | 15min |
| 09:15-09:30 | 講課 | ConfigMap 概念 | 15min |
| 09:30-10:00 | 實作 | **實作 1+2：ConfigMap 建立 + 掛載** | 30min |
| 10:00-10:10 | 休息 | | 10min |
| 10:10-10:20 | 講課 | Secret 概念 | 10min |
| 10:20-10:45 | 實作 | **實作 3：Secret** | 25min |
| 10:45-11:30 | 實作 | **實作 4：ConfigMap + Secret 整合**（MySQL + Nginx） | 45min |
| 11:30-12:00 | 講課 | Ingress 概念（為什麼不用 NodePort） | 30min |
| 12:00-13:00 | 午休 | | |
| 13:00-13:10 | 實作 | **實作 5：安裝 Ingress Controller** | 10min |
| 13:10-13:45 | 實作 | **實作 6+7：Path Routing + Host Routing** | 35min |
| 13:45-13:55 | 休息 | | 10min |
| 13:55-14:10 | 講課 | PV / PVC 概念 | 15min |
| 14:10-14:40 | 實作 | **實作 8：PV + PVC** | 30min |
| 14:40-14:50 | 休息 | | 10min |
| 14:50-15:05 | 講課 | StatefulSet 概念 | 15min |
| 15:05-15:40 | 實作 | **實作 9：StatefulSet MySQL** | 35min |
| 15:40-15:50 | 休息 | | 10min |
| 15:50-16:05 | 講課 | Helm 概念 | 15min |
| 16:05-16:35 | 實作 | **實作 10：Helm** | 30min |
| 16:35-17:00 | 講課 | 第六堂總結 | 25min |

### 實作清單

| # | 實作名稱 | 學生動手做什麼 | 預期看到什麼 |
|:---:|---------|------------|------------|
| 1 | ConfigMap 建立 | 三種方式（--from-literal / --from-file / YAML）→ `get cm -o yaml` | 會建 ConfigMap |
| 2 | ConfigMap 掛載 | envFrom + volumeMount → 改 CM → 觀察熱更新 | 設定和 Image 解耦 |
| 3 | Secret | `create secret` → Pod env 引用 → 進 Pod `echo $PASSWORD` | 敏感資料不寫在 YAML |
| 4 | ConfigMap + Secret 整合 | MySQL（密碼用 Secret）+ Nginx（設定用 ConfigMap） | 實際應用場景 |
| 5 | Ingress Controller | `minikube addons enable ingress` 或 k3s 內建 traefik | Ingress Controller 跑起來 |
| 6 | Path Routing | 兩個 Service + ingress.yaml（`/` + `/api`）→ curl 驗證 | HTTP 路由 |
| 7 | Host Routing | 多 host → 改 `/etc/hosts` → curl 驗證 | 域名路由 |
| 8 | PV + PVC | 寫 PV → PVC → Pod 掛載 → 寫檔 → 砍 Pod → 重建 → 檔案還在 | 資料不隨 Pod 消失 |
| 9 | StatefulSet | MySQL StatefulSet + PVC → 寫資料 → 砍 Pod → Pod 重建（mysql-0）→ 資料還在 | 有狀態應用持久化 |
| 10 | Helm | `helm repo add bitnami` → `helm install mysql` → `helm list` → `helm uninstall` | 一行指令裝好整套 |

---

## 第七堂（4/25）6hr — 運維 + 總複習

### 時間表

| 時段 | 類型 | 內容 | 時長 |
|------|:---:|------|:---:|
| 09:00-09:15 | 講課 | 開場回顧 | 15min |
| 09:15-09:30 | 講課 | Probe 概念（三種 Probe + 三種檢查方式） | 15min |
| 09:30-10:00 | 實作 | **實作 1：Probe** | 30min |
| 10:00-10:10 | 休息 | | 10min |
| 10:10-10:25 | 講課 | Resource requests/limits + QoS | 15min |
| 10:25-10:45 | 實作 | **實作 2：Resource limits** | 20min |
| 10:45-11:00 | 講課 | HPA 概念 | 15min |
| 11:00-11:25 | 實作 | **實作 3：HPA 壓測** | 25min |
| 11:25-11:40 | 講課 | RBAC 概念 | 15min |
| 11:40-12:00 | 實作 | **實作 4：RBAC** | 20min |
| 12:00-13:00 | 午休 | | |
| 13:00-13:25 | 講師示範 | 任務排程系統架構回顧：複雜產品如何對應 Deployment / StatefulSet / Job / CronJob / HPA | 25min |
| 13:25-13:35 | 休息 | | 10min |
| 13:35-15:35 | 實作 | **實作 5：短網址服務產品實作** — 學生不寫程式碼，手動部署一套完整產品 | 120min |
| 15:35-15:50 | 講課 + 示範 | Helm 收尾：剛剛手動做的事，其實可以一個指令完成，並用 values 調整副本、資源、HPA、Ingress、版本 | 15min |
| 15:50-16:00 | 講課 | 課程總結 + Q&A | 10min |

### 實作清單

| # | 實作名稱 | 學生動手做什麼 | 預期看到什麼 |
|:---:|---------|------------|------------|
| 1 | Probe | Deployment 加 liveness + readiness → 故意讓 /health 回 500 → 觀察自動重啟 | K8s 自動幫你重啟壞掉的 Pod |
| 2 | Resource limits | 設 requests/limits → 跑吃記憶體的 Pod → 觀察 OOMKilled | 超過限制會被殺 |
| 3 | HPA | `kubectl autoscale` → busybox 壓測 → `get hpa` 看 Pod 自動增加 | 流量大自動加 Pod |
| 4 | RBAC | ServiceAccount + Role（只能 get pods）→ 測 get ✅ delete ❌ | 權限控制生效 |
| 5 | 短網址服務產品實作 | Namespace → Secret → ConfigMap → PostgreSQL StatefulSet + PVC → Migration Job → API Deployment → Frontend Deployment → Service → Ingress → Probe → Resource limits → HPA → 瀏覽器驗證 | 從零部署一個可用產品 |
| 6 | Helm 一鍵部署與調參 | `helm install` 一個指令裝完整產品 → `helm upgrade --set` 調整副本數、HPA、網域、資源、版本 → `helm rollback` 回滾 | 理解 Helm 是把 YAML 打包成可重複部署、可調參、可升級回滾的產品 |

---

## 實作統計

| 堂次 | 實作數 | 講課時間 | 實作時間 |
|:---:|:---:|:---:|:---:|
| 第四堂 | 8 個 | ~2.5hr | ~4.5hr |
| 第五堂 | 11 個 | ~2hr | ~5hr |
| 第六堂 | 10 個 | ~2.5hr | ~4.5hr |
| 第七堂 | 6 個 | ~1.5hr | ~4.5hr |
| **合計** | **35 個** | **~9hr** | **~18hr** |
