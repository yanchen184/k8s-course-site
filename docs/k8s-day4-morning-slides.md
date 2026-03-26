# 第四堂上午 PPT 內容（提詞版）

> 每一頁都是「看著就能講」的提詞
> 搭配 GeekHour 逐字稿風格的完整講解

---

## 第 1 頁 | 開場

**前三堂我們走過的路**

| 堂次 | 學了什麼 |
|:---:|---------|
| Day 1 | Linux 基礎 — 終端機、檔案、網路 |
| Day 2 | Docker 基礎 — Image、Container、Port、Volume |
| Day 3 | Docker 進階 — Dockerfile、Docker Compose |

**今天開始：Kubernetes**

- 上午前半：概念 + 架構（純聽課）
- 上午後半：環境搭建 + kubectl 探索（動手）
- 下午：Pod 實作（寫 YAML、部署、排錯）

**先裝起來！趁我講課的時候讓它跑：**
```bash
# Ubuntu / Debian
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start
```

---

## 第 2 頁 | 為什麼需要 Kubernetes

**容器越來越多，怎麼管？**

- 數量少 → Docker Compose 就能搞定
- 數量多（成百上千）→ 腳本管不動了
- 跨多台機器 → 誰有空位？掛了誰知道？

**容器多了之後的問題：**

- 怎麼把容器分配到不同機器上？
- 某台機器掛了，上面的容器怎麼辦？
- 流量突然暴增，怎麼快速加容器？
- 更新版本的時候，怎麼不中斷服務？
- 容器之間怎麼互相找到對方？

**Kubernetes 就是為了解決這些問題而生的**
→ Google 開源的容器編排引擎
→ 幫你管理容器化的應用程式和服務

---

## 第 3 頁 | K8s 是什麼

**一句話：容器的管理平台**

- Google 內部 Borg 系統 → 管理數十億個容器
- 2014 年開源 → 捐給 CNCF
- K8s：K 和 s 之間 8 個字母 → Kubernetes
- 目前是容器編排領域的行業標準

**K8s 提供的能力：**

- **容器編排** — 用配置檔定義部署方式，建立和管理變得簡單
- **高可用** — 自動重啟、自動重建、自我修復
- **可擴展** — 根據負載動態擴展或縮減資源
  - 例：雙十一流量暴增 → 自動加容器 → 流量退了 → 自動縮回來
- **災難恢復** — 機器掛了，服務自動搬到其他機器
- 良好的生態系統和社群支持

---

## 第 4 頁 | 核心概念：Node、Pod、Service

**從一個最簡單的例子開始，一步步引入**

**Node 與 Pod：**
- Node = 一台機器（實體機或虛擬機）
- Pod = K8s 最小調度單位
  - 一個或多個容器的組合
  - 容器在 Pod 裡共享網路和儲存
  - 建議：一個 Pod 放一個容器
  - 多容器的情況 → Sidecar 模式（主程式 + 輔助容器）

**為什麼需要 Service：**
- Pod 的 IP 是叢集內部的 → 外面連不到
- Pod 會被銷毀重建 → IP 會變
- Service = 穩定的存取入口
  - Pod 掛了換新的，Service 地址不變
  - 自動轉發到健康的 Pod

**Service 的類型：**
- 內部服務（ClusterIP）→ 叢集內部存取
- 外部服務（NodePort）→ 在 Node 上開 Port 給外部連
  - 對照：`docker run -p 8080:80`

---

## 第 5 頁 | 核心概念：Ingress、ConfigMap、Secret

**Ingress：**
- 開發測試用 IP + Port 沒問題
- 生產環境要用域名
- Ingress = 管理外部存取的入口
  - 配置轉發規則（不同域名 → 不同 Service）
  - 可以配置 SSL 憑證
  - 對照：Docker 裡面用 Nginx 反向代理

**ConfigMap：**
- 資料庫地址、Port 等設定 → 不要寫死在 Image 裡
- ConfigMap = 把設定抽出來
  - 改設定不用重新 build Image
  - 修改 ConfigMap → 重啟 Pod 即可生效
  - 對照：`docker run -e ENV_VAR=value`
- 注意：ConfigMap 是明文儲存的

**Secret：**
- 密碼、金鑰等敏感資料 → 不該放 ConfigMap
- Secret = 跟 ConfigMap 類似，但做了 Base64 編碼
- 注意：Base64 是編碼，不是加密
  - 還需要搭配其他安全機制
  - 對照：Docker 的 `.env` 檔案

---

## 第 6 頁 | 核心概念：Volume、Deployment、StatefulSet

**Volume：**
- 容器被銷毀 → 裡面的資料就消失了
- 資料庫需要持久化 → 不能讓資料跟著容器消失
- Volume = 把資料存在容器外面
  - 可以掛載到本地磁碟或遠端儲存
  - 容器重啟，資料不會遺失
  - 對照：`docker volume`

**Deployment：**
- 問題：只跑一個 Pod → 掛了就停服務了
- 解決：多跑幾個副本
- Deployment = 管理 Pod 副本的控制器
  - 定義副本數量（例：3 個）
  - 掛了一個 → 自動補一個新的
  - 滾動更新 → 逐步替換，不中斷服務
  - 對照：`docker compose up --scale web=3`
- Deployment → ReplicaSet → Pod（三層關係）
  - ReplicaSet 是自動建立的，你只管 Deployment

**StatefulSet：**
- Deployment 適合無狀態應用（API、前端）
- 資料庫有狀態 → 每個副本有自己的資料
- StatefulSet = 給有狀態應用用的
  - 穩定的網路標識（mysql-0, mysql-1）
  - 有序部署和刪除
  - 每個 Pod 有自己的儲存
- 也可以選擇：資料庫不放 K8s 裡，在外面單獨跑

---

## 第 7 頁 | 核心概念小結

**來總結一下：**

| 概念 | 做什麼 | Docker 對照 |
|------|--------|-----------|
| **Pod** | 容器的包裝，最小調度單位 | `docker run` |
| **Service** | 穩定的存取入口 | `-p` + `--network` DNS |
| **Ingress** | HTTP 路由器，設域名 | Nginx 反向代理 |
| **ConfigMap** | 設定檔管理 | `-e ENV_VAR` |
| **Secret** | 敏感資料管理 | `.env` 檔案 |
| **Volume** | 資料持久化 | `docker volume` |
| **Deployment** | 管理無狀態應用的副本 | `docker compose up --scale web=3` |
| **StatefulSet** | 管理有狀態應用 | 手動管理 |

→ 後面四堂課就是一個一個展開來教

---

## 休息 10 分鐘

---

## 第 8 頁 | K8s 架構：Worker Node

**K8s = Master-Worker 架構**
- Master Node → 管理整個叢集（公司管理層）
- Worker Node → 運行應用程式（實際幹活的員工）

**Worker Node 上的三個元件：**

**Container Runtime（容器執行時期）：**
- 負責拉取映像檔、建立容器、啟動和停止容器
- 每個 Worker Node 都必須安裝
- Docker 用的是 Docker Engine
- K8s 主流用 containerd
  - 不需要再裝 Docker

**kubelet：**
- 管理和維護這個 Node 上的 Pod
- 確保 Pod 按照預期運行
- 定期從 API Server 接收新的 Pod 規範
- 監控 Node 的狀況，回報給 API Server

**kube-proxy：**
- 負責網路代理和負載均衡
- 請求進來 → 轉發到正確的 Pod
- 在叢集內實現負載均衡，將流量分配到各個 Pod

---

## 第 9 頁 | K8s 架構：Master Node

**Master Node 上的四個元件：**

**API Server（叢集的大門）：**
- 所有請求都要先經過它
- kubectl → API Server → 其他元件
- 負責認證、授權、存取控制
- 就像公司的接待處

**etcd（叢集的資料庫）：**
- 鍵值儲存系統
- 儲存叢集中所有資源的狀態
- Pod 掛了、新增了 → 都記在 etcd 裡
- 注意：只存叢集狀態，不存應用資料

**Scheduler（調度器）：**
- 新 Pod 要跑在哪個 Node？
- 看哪個 Node 資源最充足 → 分配過去
- 例：Node 1 用了 80%，Node 2 用了 20% → 分到 Node 2

**Controller Manager（控制器管理器）：**
- 持續監控所有資源的狀態
- 發現異常 → 自動修復
- 例：你說要 3 個 Pod，掛了一個只剩 2 → 自動補一個新的

**完整流程：**
```
kubectl create deployment nginx --replicas=3

1. kubectl → API Server（驗證權限）
2. API Server → etcd（記錄：要 3 個 nginx Pod）
3. Scheduler 發現 3 個 Pod 還沒分配 → 選 Node → 分配
4. 對應 Node 的 kubelet 收到通知 → 啟動 Pod
5. Controller Manager 持續監控 → Pod 掛了就重建
```

---

## 第 10 頁 | K8s 架構圖

```
┌──────────── Master Node ────────────┐
│  API Server  │  etcd                │
│  Scheduler   │  Controller Manager  │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
┌─────▼─────┐    ┌──────▼─────┐
│ Worker 1  │    │ Worker 2   │
│           │    │            │
│ kubelet   │    │ kubelet    │
│ kube-proxy│    │ kube-proxy │
│ containerd│    │ containerd │
│           │    │            │
│ [Pod][Pod]│    │ [Pod][Pod] │
└───────────┘    └────────────┘
```

- 你用 kubectl → API Server → 指揮整個叢集
- 等一下實作就會在 kube-system 裡親眼看到這些元件

---

## 第 11 頁 | 環境搭建方案

**三種方案：**

| 方案 | 適合場景 | 節點數 | 安裝難度 | 我們什麼時候教 |
|------|---------|:---:|:---:|:---:|
| minikube | 個人學習 | 單節點 | 一行指令 | 今天 |
| k3s | 輕量生產/多節點 | 多節點 | 一行指令 | 第五堂 |
| RKE | 企業生產叢集 | 多節點 | 較複雜 | 待定 |

**minikube：**
- 在一台電腦上模擬一個 K8s 叢集
- Master + Worker 合在一台
- 適合學習，不適合生產

**kubectl：**
- K8s 的命令列工具
- 不管用 minikube、k3s 還是 RKE → kubectl 指令都一樣

| Docker 指令 | kubectl 指令 | 功能 |
|------------|-------------|------|
| `docker ps` | `kubectl get pods` | 看運行中的 |
| `docker logs` | `kubectl logs` | 看日誌 |
| `docker exec -it` | `kubectl exec -it` | 進容器 |
| `docker stop/rm` | `kubectl delete` | 停止/刪除 |
| `docker compose up` | `kubectl apply -f` | 用檔案部署 |

---

## 第 12 頁 | 實作時間：minikube 安裝 + kubectl 探索

**1. 確認 minikube 安裝成功：**
```bash
minikube version
minikube status
```

**2. 啟動叢集（如果還沒跑的話）：**
```bash
minikube start
```

**3. 驗證叢集：**
```bash
kubectl get nodes              # 看到一個 Ready 節點
kubectl cluster-info           # 叢集資訊
```

**4. 親眼看到架構元件：**
```bash
kubectl get pods -n kube-system    # 看到 apiserver、etcd、scheduler、proxy、coredns
kubectl get ns                     # 看命名空間
```

**5. 看 Node 詳細資訊：**
```bash
kubectl describe node minikube     # kubelet 版本、Container Runtime、CPU/Memory
```

**6. 打開 Dashboard（圖形介面）：**
```bash
minikube dashboard
```

---

## 第 13 頁 | 上午總結 + 下午預告

**上午學了：**
- 為什麼需要 K8s（Docker 單機的極限）
- 8 個核心概念（Pod / Service / Ingress / ConfigMap / Secret / Volume / Deployment / StatefulSet）
- K8s 架構（Master 4 元件 + Worker 3 元件）
- 環境方案（minikube / k3s / RKE）
- minikube 安裝 + kubectl 探索

**下午要做：**
1. Pod phase / STATUS + 排錯
2. 多容器 Pod（Sidecar）
3. kubectl 進階（`-o wide` / `port-forward` / `dry-run` / `explain`）
4. MySQL Pod + env
5. Deployment 入門（自我修復）

**今天結束時你會：**
→ `minikube status` 顯示 Running，`kubectl get nodes` 看到 Ready
→ 會用 `get`、`describe`、`logs`、`exec`、`delete` 五個指令
→ 能獨立寫出 Pod YAML，部署 nginx 並用 `port-forward` 在瀏覽器看到頁面
→ 看到 `ImagePullBackOff` / `CrashLoopBackOff` 知道怎麼查、怎麼修
→ 知道 Deployment 為什麼存在，並看懂基本三層關係
