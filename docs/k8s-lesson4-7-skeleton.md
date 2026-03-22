# K8s 第四～七堂 PPT 骨架

> 每堂的每一頁投影片標題 + 一句話內容摘要
> 確認後再展開成完整 PPT 和逐字稿

---

## 第四堂（3/28）— 從 Docker 到 Kubernetes

### 上午 09:00-12:00（3hr）

```
第 1 頁 | 開場
  Day3 回顧（Docker Compose）→ 今天進入 K8s

第 2 頁 | Docker 的極限
  單機、手動擴縮、沒有自愈、滾動更新要自己做
  → 「如果有 100 台機器跑 500 個容器，你怎麼管？」

第 3 頁 | K8s 是什麼
  一句話：容器的管理平台
  Google 內部 Borg 系統 → 2014 開源 → CNCF 頂級專案
  Docker Swarm vs Mesos vs K8s → K8s 贏了

第 4 頁 | K8s 能幫你做什麼
  自動排程、自我修復、水平擴展、滾動更新、服務發現、負載均衡
  → 對照 Docker Compose 的手動版

第 5 頁 | K8s 架構圖（最重要的一頁）
  Control Plane：API Server（大門）、etcd（資料庫）、Scheduler（排班）、Controller Manager（管理員）
  Worker Node：kubelet（工頭）、kube-proxy（網路員）、Container Runtime（Docker/containerd）
  → 畫一張圖，講每個元件的比喻

第 6 頁 | K8s 核心資源物件總覽
  Pod、Deployment、Service、ConfigMap、Secret、PV/PVC、Namespace
  → 「今天先學前三個，後面慢慢加」

第 7 頁 | 環境搭建選項總覽
  | 方案 | 適合場景 | 節點數 | 我們什麼時候教 |
  | minikube | 個人學習 | 單節點 | 今天（第四堂） |
  | k3s | 輕量生產/多節點 | 多節點 | 第六堂（多節點實戰） |
  | RKE | 企業生產叢集 | 多節點 | 第七堂（企業級介紹） |
  → 「先用 minikube 學概念，後面再上多節點」

第 8 頁 | minikube 安裝與啟動
  安裝指令（Mac/Linux/Windows）
  minikube start / status / stop / delete
  minikube dashboard（圖形介面）
  kubectl get nodes → 確認叢集可用

第 9 頁 | kubectl 是什麼
  K8s 的 CLI 工具，對照 docker 指令
  | docker ps | kubectl get pods |
  | docker logs | kubectl logs |
  | docker exec | kubectl exec |

第 10 頁 | kubectl 基本指令 Demo
  kubectl get nodes / pods / services / deployments
  kubectl describe pod <name>
  kubectl logs <pod-name>
  kubectl exec -it <pod-name> -- /bin/sh
```

### 下午 13:00-17:00（4hr）

```
第 11 頁 | YAML 基本格式
  apiVersion / kind / metadata / spec
  「K8s 的一切都是 YAML」
  → 對照 docker-compose.yaml

第 12 頁 | Pod 是什麼
  最小部署單位，一個或多個容器共享網路和儲存
  → 對照 docker run
  為什麼不直接管容器？Pod 是 K8s 的基本調度單位

第 13 頁 | 第一個 Pod
  寫 pod.yaml（nginx）
  kubectl apply -f pod.yaml
  kubectl get pods
  kubectl describe pod nginx-pod
  kubectl logs nginx-pod
  kubectl delete pod nginx-pod

第 14 頁 | Pod 的生命週期
  Pending → Running → Succeeded / Failed
  → 常見卡在 Pending 的原因（Image 拉不到、資源不足）
  → CrashLoopBackOff 是什麼

第 15 頁 | 多容器 Pod（Sidecar）
  一個 Pod 裡跑兩個容器（主程序 + 日誌收集器）
  → 什麼時候該用多容器 Pod vs 多個 Pod

第 16 頁 | 為什麼不直接用 Pod？
  Pod 死了不會自動重建
  不能擴縮容
  不能滾動更新
  → 需要 Deployment

第 17 頁 | Deployment 是什麼
  管理 Pod 的副本和更新策略
  Deployment → ReplicaSet → Pod（三層關係）
  → 對照 docker compose --scale

第 18 頁 | 建立 Deployment
  寫 deployment.yaml（nginx, replicas: 3）
  kubectl apply -f deployment.yaml
  kubectl get deployment
  kubectl get pods → 看到 3 個 Pod

第 19 頁 | 擴縮容
  kubectl scale deployment nginx --replicas=5
  kubectl get pods → 看到 5 個
  kubectl scale deployment nginx --replicas=2
  kubectl get pods → 自動砍掉 3 個

第 20 頁 | 滾動更新
  kubectl set image deployment/nginx nginx=nginx:1.25
  kubectl rollout status deployment/nginx → 看進度
  kubectl get pods → 舊的慢慢消失，新的慢慢出現

第 21 頁 | 回滾
  kubectl rollout undo deployment/nginx
  kubectl rollout history deployment/nginx → 看版本歷史
  → 「更新壞了？一行指令回到上一版」

第 22 頁 | DaemonSet
  每個 Node 跑一份（日誌收集、監控 agent）
  → 對照 Deployment（Deployment 是「跑 N 份」，DaemonSet 是「每台都跑」）

第 23 頁 | Job / CronJob
  Job：一次性任務（資料遷移）
  CronJob：排程任務（每天凌晨備份）
  → 寫一個 CronJob YAML demo

第 24 頁 | 🔨 練習時間（30 分鐘）
  1. 把一個 Nginx Deployment 部署到 K8s（replicas: 3）
  2. 擴容到 5，再縮容到 2
  3. 更新 Image 版本，觀察滾動更新，然後回滾

第 25 頁 | 第四堂總結
  今天學了：K8s 架構、kubectl、Pod、Deployment、DaemonSet、Job
  環境：minikube（今天用的）→ 後面會教 k3s 和 RKE
  Docker → K8s 對照表
  下堂課：Service（讓外面連得到你的 Pod）
```

---

## 第五堂（4/11）— 網路與服務暴露

### 上午 09:00-12:00（3hr）

```
第 1 頁 | 開場回顧
  第四堂：K8s 架構 + Pod + Deployment
  問題：Pod 部署好了，但外面連不到 → 需要 Service

第 2 頁 | 為什麼需要 Service
  Pod IP 不固定（Pod 重建 IP 就變了）
  → Service 提供穩定的存取入口
  → 對照 Docker 的 --network DNS

第 3 頁 | ClusterIP（預設）
  叢集內部存取
  → 其他 Pod 可以用 Service 名稱連
  → 外部連不到

第 4 頁 | ClusterIP Demo
  寫 service-clusterip.yaml
  kubectl apply -f
  從另一個 Pod 裡 curl service-name

第 5 頁 | NodePort
  在每個 Node 開一個 Port（30000-32767）
  外部用 <NodeIP>:<NodePort> 連
  → 對照 docker run -p

第 6 頁 | NodePort Demo
  寫 service-nodeport.yaml
  kubectl apply -f
  curl <minikube-ip>:<nodeport>

第 7 頁 | LoadBalancer
  雲端環境自動建立負載均衡器
  → AWS ELB / GCP LB / Azure LB
  本機用 minikube tunnel 模擬

第 8 頁 | 三種 Service 比較表
  | 類型 | 存取範圍 | 適用場景 |
  | ClusterIP | 叢集內部 | 微服務間通訊 |
  | NodePort | 外部（指定 Port）| 開發測試 |
  | LoadBalancer | 外部（自動）| 雲端生產 |

第 9 頁 | DNS 與服務發現
  CoreDNS 自動建立 DNS
  <service>.<namespace>.svc.cluster.local
  → 對照 Docker 的容器名稱 DNS

第 10 頁 | Namespace
  用 Namespace 隔離環境（dev / staging / prod）
  kubectl create namespace dev
  kubectl get pods -n dev
  → 不同 Namespace 的 Service 怎麼互連
```

### 下午 13:00-17:00（4hr）

```
第 11 頁 | Ingress 是什麼
  為什麼不用 NodePort？（每個服務開一個 Port 太亂）
  Ingress = HTTP 層的路由器
  → 對照 Nginx 反向代理

第 12 頁 | 安裝 Ingress Controller
  minikube addons enable ingress
  或 kubectl apply -f nginx-ingress

第 13 頁 | Path-based Routing
  / → 前端
  /api → API 服務
  寫 ingress.yaml demo

第 14 頁 | Host-based Routing
  app.example.com → 應用 A
  api.example.com → 應用 B
  → 修改 /etc/hosts 測試

第 15 頁 | Ingress TLS/HTTPS
  cert-manager 簡介
  用 Secret 存憑證
  → 生產環境必備

第 16 頁 | NetworkPolicy
  Pod 之間的防火牆
  預設全開 → 加 NetworkPolicy 限制
  → 對照 Docker 的 --network 隔離

第 17 頁 | NetworkPolicy Demo
  前端只能連 API
  API 只能連 DB
  DB 不能被前端直連

第 18 頁 | 🔨 練習時間（1 小時）
  1. 部署前端 + API + DB 三個 Deployment
  2. 建立 ClusterIP Service 讓它們互連
  3. 建立 Ingress 讓外部用路徑存取
  4.（加分）加 NetworkPolicy 限制流量

第 19 頁 | 第五堂總結
  Service 三種類型、DNS 服務發現、Namespace、Ingress、NetworkPolicy
  Docker → K8s 網路對照表
  下堂課：ConfigMap + Secret + 資料持久化
```

---

## 第六堂（4/18）— 配置管理 + 資料持久化 + Helm

### 上午 09:00-12:00（3hr）

```
第 1 頁 | 開場回顧
  第五堂：Service + Ingress + NetworkPolicy
  問題：密碼寫死在 YAML 裡？設定檔打包在 Image 裡？
  → 需要 ConfigMap 和 Secret

第 2 頁 | ConfigMap 是什麼
  把設定從 Image 裡抽出來
  → 對照 Docker 的 -e ENV_VAR 和 -v config:/etc

第 3 頁 | 建立 ConfigMap
  kubectl create configmap（從 literal / 檔案 / 目錄）
  YAML 格式的 ConfigMap

第 4 頁 | 使用 ConfigMap
  方式一：掛載為環境變數（envFrom）
  方式二：掛載為檔案（volumeMounts）
  → Demo：Nginx 設定檔用 ConfigMap 管理

第 5 頁 | ConfigMap 熱更新
  改 ConfigMap → Pod 裡的檔案自動更新
  ⚠️ 坑：subPath 掛載不會自動更新
  ⚠️ 環境變數不會自動更新（要重啟 Pod）

第 6 頁 | Secret 是什麼
  跟 ConfigMap 類似，但用於敏感資料
  Base64 編碼（不是加密！）
  → 對照 Docker 的 .env 檔案

第 7 頁 | Secret 三種類型
  Opaque（通用）：帳號密碼
  TLS：HTTPS 憑證
  docker-registry：拉私有 Image

第 8 頁 | Secret Demo
  kubectl create secret generic db-password --from-literal=password=my-secret
  在 Pod 裡用 env / volume 引用

第 9 頁 | 🔨 練習（30 分鐘）
  1. 用 ConfigMap 管理 Nginx 設定檔
  2. 用 Secret 管理 MySQL 密碼
  3. 部署 MySQL + API，API 從 Secret 讀取密碼連 DB
```

### 下午 13:00-17:00（4hr）

```
第 10 頁 | 為什麼需要持久化
  Pod 重啟 → 資料消失（跟 Docker 容器一樣）
  → 對照 Docker Volume

第 11 頁 | PV 和 PVC
  PersistentVolume（PV）：管理員建立的儲存空間
  PersistentVolumeClaim（PVC）：使用者的儲存請求
  → 比喻：PV = 停車位，PVC = 停車證

第 12 頁 | PV / PVC Demo
  建立 PV（hostPath）
  建立 PVC
  Pod 掛載 PVC

第 13 頁 | StorageClass
  動態佈建：不用手動建 PV，申請 PVC 自動建
  → 雲端環境（AWS EBS、GCP PD）都用 StorageClass

第 14 頁 | AccessMode
  ReadWriteOnce（RWO）：單節點讀寫
  ReadOnlyMany（ROX）：多節點唯讀
  ReadWriteMany（RWX）：多節點讀寫（需要 NFS 等）

第 15 頁 | StatefulSet
  為什麼 Deployment 不適合跑資料庫
  StatefulSet：穩定的網路標識（mysql-0, mysql-1）、有序部署
  → 每個 Pod 有自己的 PVC

第 16 頁 | StatefulSet Demo
  部署 MySQL StatefulSet + PVC
  寫入資料 → 砍 Pod → Pod 重建 → 資料還在

第 17 頁 | Helm 是什麼
  K8s 的套件管理工具
  → 對照 apt install / npm install
  Chart = 套件、Release = 安裝實例、Repository = 套件倉庫

第 18 頁 | Helm 常用指令
  helm repo add / helm search
  helm install / helm upgrade / helm rollback
  helm list / helm uninstall
  values.yaml 客製化

第 19 頁 | Helm Demo
  helm install my-mysql bitnami/mysql
  → 一行指令裝好 MySQL（含 PVC + Secret + Service）

第 20 頁 | k3s — 輕量級多節點 K8s
  為什麼現在教 k3s？→ 你已經會 K8s 概念了，來體驗多節點
  k3s vs 完整 K8s 的差異（精簡元件、內建 SQLite 取代 etcd）
  適用場景：邊緣運算、IoT、輕量生產環境

第 21 頁 | k3s 安裝 Demo
  VMware 開兩台 Ubuntu（master + worker）
  Master：curl -sfL https://get.k3s.io | sh -
  取得 Token：cat /var/lib/rancher/k3s/server/node-token
  Worker：curl -sfL https://get.k3s.io | K3S_URL=... K3S_TOKEN=... sh -
  k3s kubectl get nodes → 兩個節點！

第 22 頁 | 在 k3s 上部署應用
  把第四堂的 Deployment 部署到 k3s
  kubectl get pods -o wide → Pod 分散在不同 Node
  → 「從 minikube 單節點到 k3s 多節點，同樣的 YAML 直接用」

第 23 頁 | 🔨 練習（30 分鐘）
  1. 用 StatefulSet 部署 MySQL + PVC
  2. 用 Helm 安裝一個 Redis
  3. 驗證資料持久化（砍 Pod 重建）
  4.（加分）在 k3s 叢集上重複以上操作

第 24 頁 | 第六堂總結
  ConfigMap / Secret / PV / PVC / StorageClass / StatefulSet / Helm / k3s
  從 minikube（單節點學習）→ k3s（多節點實戰）
  Docker → K8s 配置與儲存對照表
  下堂課：Health Check + 資源管理 + RBAC + RKE + 總複習
```

---

## 第七堂（4/25）— 運維實戰 + 總複習

### 上午 09:00-12:00（3hr）

```
第 1 頁 | 開場回顧
  第六堂：ConfigMap + Secret + PV/PVC + Helm
  今天：讓你的叢集「生產就緒」

第 2 頁 | Health Check — 三種 Probe
  livenessProbe：「你還活著嗎？」→ 死了就重啟
  readinessProbe：「你準備好了嗎？」→ 沒好就不轉流量
  startupProbe：「你啟動完了嗎？」→ 給慢啟動的應用多一點時間
  → 對照 Docker 的 HEALTHCHECK

第 3 頁 | Probe 三種檢查方式
  HTTP GET：curl 一個路徑
  TCP Socket：連一個 Port
  exec：跑一個指令

第 4 頁 | Probe Demo
  加 livenessProbe + readinessProbe 到 Deployment
  故意讓 /health 回 500 → 觀察 K8s 自動重啟

第 5 頁 | Resource 管理
  requests：「我至少需要這麼多」
  limits：「我最多用這麼多」
  → 超過 limits 會被 OOMKilled
  → 對照 Docker 的 --memory --cpus

第 6 頁 | QoS 等級
  Guaranteed：requests = limits（最優先）
  Burstable：有設 requests 但 < limits
  BestEffort：沒設任何 requests/limits（最先被殺）

第 7 頁 | HPA 自動擴縮
  Horizontal Pod Autoscaler
  CPU 到 80% → 自動加 Pod
  Demo：用壓測工具觸發擴縮

第 8 頁 | RBAC 是什麼
  誰（User/ServiceAccount）能做什麼（get/create/delete）在哪裡（Namespace）
  Role + RoleBinding = Namespace 級別
  ClusterRole + ClusterRoleBinding = 叢集級別

第 9 頁 | RBAC Demo
  建立一個「只能看 Pod 不能刪」的 Role
  綁定到一個 ServiceAccount
  驗證：kubectl get pods ✅、kubectl delete pod ❌

第 10 頁 | 日誌與除錯
  kubectl logs / describe / get events
  kubectl top pods / top nodes
  常見問題：ImagePullBackOff、CrashLoopBackOff、Pending
  工具推薦：K9s、Lens

第 11 頁 | RKE — 企業級叢集部署
  Rancher Kubernetes Engine（SUSE/Rancher 出品）
  適用場景：公司內部正式環境、需要完整 K8s 功能
  minikube → k3s → RKE 的學習路徑

第 12 頁 | RKE 架構與安裝流程
  需要：多台 Linux 機器 + SSH 存取 + Docker
  cluster.yml 設定檔（定義 role: controlplane / worker / etcd）
  rke up → 自動在所有機器上建立叢集
  → 「課堂演示流程，生產環境再實際操作」

第 13 頁 | RKE vs k3s vs kubeadm
  | 比較 | k3s | RKE | kubeadm |
  | 定位 | 輕量/邊緣 | 企業生產 | 官方標準 |
  | 安裝難度 | 一行指令 | 中等（需 SSH） | 較複雜 |
  | 管理工具 | CLI | Rancher UI | 無 |
  | 適合規模 | 小～中 | 中～大 | 任意 |
  → 「選擇依據：團隊規模和運維能力」
```

### 下午 13:00-16:00（3hr）

```
第 14 頁 | 🔨 總複習實戰（90 分鐘）

  從零部署一個完整系統：

  Step 1：建 Namespace
  kubectl create namespace production

  Step 2：ConfigMap（Nginx 設定）
  Step 3：Secret（DB 密碼）
  Step 4：MySQL StatefulSet + PVC
  Step 5：API Deployment（3 replicas）
  Step 6：前端 Deployment
  Step 7：Service（ClusterIP）
  Step 8：Ingress（路由）
  Step 9：livenessProbe + readinessProbe
  Step 10：Resource limits
  Step 11：HPA
  Step 12：驗證 — 外部用域名連進來

第 15 頁 | 課程完整回顧

  Day 1：Linux 基礎
  Day 2：Docker 基礎 + 進階
  Day 3：Dockerfile + Docker Compose
  Day 4：K8s 架構 + Pod + Deployment（minikube）
  Day 5：Service + Ingress + NetworkPolicy
  Day 6：ConfigMap + Secret + PV/PVC + Helm + k3s
  Day 7：Probe + Resource + RBAC + RKE + 總複習

第 16 頁 | 環境部署方案總結
  | 階段 | 工具 | 用途 |
  | 學習開發 | minikube | 本機單節點，快速驗證 |
  | 輕量生產 | k3s | 多節點，邊緣/IoT/小團隊 |
  | 企業生產 | RKE / kubeadm | 正式叢集，完整功能 |
  → 「根據你的場景選對工具」

第 17 頁 | Docker → K8s 完整對照表
  （之前規劃的那張大表）

第 18 頁 | 接下來的學習路徑
  CKA 認證
  官方文件 kubernetes.io
  推薦工具：K9s、Lens、Helm Hub
  社群資源

第 19 頁 | Q&A + 結語
  問題回答
  課程意見回饋
  「從 Linux 到 Docker 到 K8s，你已經具備容器化的完整技能了」
```

---

## 每堂課的核心產出（學生帶回去的）

| 堂次 | 學生帶走什麼 |
|:---:|------------|
| 第四堂 | 會用 minikube 部署應用到 K8s、會擴縮容和滾動更新 |
| 第五堂 | 會讓外面連到 K8s 裡的服務、會設定路由和防火牆 |
| 第六堂 | 會管理設定和密碼、會部署有狀態應用、會用 Helm、會建 k3s 多節點叢集 |
| 第七堂 | 會做健康檢查和資源管理、了解 RKE 企業部署、能從零部署完整系統 |
