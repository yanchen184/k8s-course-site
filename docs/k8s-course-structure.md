# K8s 課程結構總覽（第四～七堂）

> 每堂 7 小時（上午 3hr + 下午 4hr）
> 結構：上午 = 開場 + N 個 Loop，下午 = N 個 Loop
> 每個 Loop = 影片 A（概念）+ 影片 B（實作示範）+ 學員實作＋巡堂 + 影片 C（回頭操作）
> 因果鏈貫穿：每個概念都是上一步沒解決的問題引出的

---

## 第四堂（3/28）— K8s 全貌 + Pod + Deployment 入門

**一句話：會在 K8s 上跑容器，還會讓 K8s 幫你管一群**

### 因果鏈

```
Docker 單機扛不住 → K8s
→ 要跑容器 → Pod
→ Pod IP 會變 → Service
→ 地址太醜 → Ingress
→ 設定寫死 → ConfigMap
→ 密碼明文 → Secret
→ 資料消失 → Volume
→ 單點故障 → Deployment
→ DB 特殊 → StatefulSet
→ 誰在背後做？→ 架構（Master/Worker）
→ 怎麼告訴 K8s？→ YAML
→ 動手跑 → Pod CRUD
→ Pod 壞了 → 排錯
→ 日誌要收集 → Sidecar
→ kubectl 不夠力 → 進階技巧
→ MySQL 跑不起來 → 環境變數
→ Pod 刪了就沒了 → Deployment 初體驗
```

### 上午 3hr（11 支影片 / 52 張 PPT）

| 影片 | 標題 | 類型 |
|------|------|------|
| 5-1 | Docker 扛不住了 — K8s 登場 | 概念 |
| 5-2 | Pod → Service → Ingress | 概念 |
| 5-3 | ConfigMap → Secret → Volume | 概念 |
| 5-4 | Deployment → StatefulSet → 八概念總結 | 概念 |
| 5-5 | K8s 架構（上）Worker Node | 概念 |
| 5-6 | K8s 架構（下）Master Node + 完整流程 | 概念 |
| 5-7 | 動手做（上）環境搭建 minikube | 實作 |
| 5-8 | 動手做（下）探索叢集 kube-system | 實作 |
| 5-9 | YAML 格式 + Pod 概念 | 概念 |
| 5-10 | 第一個 Pod 完整 CRUD | 實作示範 |
| 5-11 | 回頭操作 + 上午總結 | 回頭操作 |

> 學員實作：httpd Pod + 修改 nginx 歡迎頁 port-forward

### 下午 4hr（5 個 Loop / 15 支影片 / 29 張 PPT）

| Loop | 影片 A（概念） | 影片 B（示範） | 學員實作 | 影片 C（回頭） |
|------|--------------|--------------|---------|--------------|
| 1 | 4-12 Pod 生命週期+排錯 | 4-13 排錯實戰 | YAML 錯誤排錯 + CrashLoopBackOff | 4-14 回頭 |
| 2 | 4-15 Sidecar 概念 | 4-16 Sidecar 實作 | httpd + busybox Sidecar | 4-17 回頭 |
| 3 | 4-18 kubectl 進階 | 4-19 port-forward + dry-run | dry-run + port-forward | 4-20 回頭 |
| 4 | 4-21 環境變數 + MySQL | 4-22 MySQL 實作 | MySQL Pod + 自由練習 | 4-23 回頭 |
| 5 | 4-24 Deployment 初體驗 | （含在 4-24） | Deployment + scale | 4-26 總結 |

**第四堂總計：26 支影片 / 81 張 PPT**

---

## 第五堂（4/11）— Deployment 進階 + Service + k3s 多節點

**一句話：會讓瀏覽器連到 K8s 裡的服務**

### 因果鏈

```
第四堂學了 Deployment 基礎，但只有一個 Node 看不到分散
→ 裝 k3s 多節點 → Pod 真的分散在不同機器
→ 擴縮容：流量變了 → kubectl scale
→ 滾動更新：版本要更新 → 零停機替換
→ 回滾：新版有問題 → 一個指令退回
→ 自我修復：Pod 掛了 → 自動補（多節點更震撼）
→ K8s 怎麼知道哪些 Pod 屬於誰？→ Labels + Selector
→ Pod 跑起來了但外面連不到 → ClusterIP Service
→ 叢集內部用名字找 → DNS
→ 外面也要連 → NodePort
→ 三種 Service 怎麼選？
→ 環境要隔離 → Namespace
→ 每台 Node 都要跑監控 → DaemonSet
→ 定時任務 → CronJob
→ 從零串一遍完整鏈路
```

### 上午 3hr（開場 + 3 個 Loop）

| 項目 | 影片 | 內容 |
|------|------|------|
| **開場** | 5-1 | 第四堂回顧 + k3s 多節點環境搭建（帶著做） |
| | 5-2 | k3s 安裝實作（master + worker join） |
| **Loop 1** | 5-3 | Deployment 擴縮容（概念） |
| | 5-4 | 擴縮容實作（scale 3→5→2） |
| | | *學員實作 + 巡堂* |
| | 5-5 | 回頭操作 |
| **Loop 2** | 5-6 | 滾動更新 + 回滾（概念） |
| | 5-7 | 滾動更新實作（nginx 1.26→1.27 + rollout undo） |
| | | *學員實作 + 巡堂* |
| | 5-8 | 回頭操作 |
| **Loop 3** | 5-9 | 自我修復 + Labels/Selector（概念） |
| | 5-10 | 自我修復實作（delete pod → 自動補 + labels 查看） |
| | | *學員實作 + 巡堂* |
| | 5-11 | 回頭操作 + 上午總結 |

### 下午 4hr（5 個 Loop）

| Loop | 影片 A（概念） | 影片 B（示範） | 學員實作 | 影片 C（回頭） |
|------|--------------|--------------|---------|--------------|
| 4 | 5-12 ClusterIP Service | 5-13 ClusterIP 實作 | busybox curl nginx-svc | 5-14 回頭 |
| 5 | 5-15 NodePort + 三種比較 | 5-16 NodePort 實作 | curl node-ip:nodeport | 5-17 回頭 |
| 6 | 5-18 DNS + Namespace | 5-19 DNS/Namespace 實作 | nslookup + 跨 NS 連線 | 5-20 回頭 |
| 7 | 5-21 DaemonSet + CronJob | 5-22 DaemonSet/CronJob 實作 | DaemonSet + CronJob | 5-23 回頭 |
| 8 | 5-24 綜合實作引導 | 5-25 從零串完整鏈路 | 完整鏈路練習 | 5-26 總結+預告 |

**第五堂總計：26 支影片**

---

## 第六堂（4/18）— Ingress + ConfigMap/Secret + PV/PVC + Helm

**一句話：會部署帶資料庫的完整網站**

### 因果鏈

```
第五堂用 NodePort 連進來了，但地址太醜
→ Ingress 用域名路由（path-based / host-based）
→ TLS/HTTPS
→ 服務跑起來了，但設定寫死在 Image
→ ConfigMap 環境變數注入 + Volume 掛載
→ 密碼不能明文 → Secret + RBAC 控權限
→ 整合：Ingress + ConfigMap + Secret 一起用
→ Pod 重啟資料消失 → PV + PVC
→ 手動建 PV 太煩 → StorageClass 動態佈建
→ Deployment 不適合跑 DB → StatefulSet 實作
→ YAML 太多太散 → Helm 一鍵安裝
```

### 上午 3hr（開場 + 3 個 Loop）

| 項目 | 影片 | 內容 |
|------|------|------|
| **開場** | 6-1 | 第五堂回顧 + 今天因果鏈預覽 |
| **Loop 1** | 6-2 | Ingress 概念（為什麼 NodePort 不夠） |
| | 6-3 | Ingress 實作（安裝 controller + path routing） |
| | | *學員實作 + 巡堂* |
| | 6-4 | 回頭操作 |
| **Loop 2** | 6-5 | Host Routing + TLS 概念 |
| | 6-6 | Host Routing 實作 |
| | | *學員實作 + 巡堂* |
| | 6-7 | 回頭操作 |
| **Loop 3** | 6-8 | ConfigMap 概念（設定寫死的問題） |
| | 6-9 | ConfigMap 實作（env 注入 + Volume 掛載） |
| | | *學員實作 + 巡堂* |
| | 6-10 | 回頭操作 + 上午總結 |

### 下午 4hr（5 個 Loop）

| Loop | 影片 A（概念） | 影片 B（示範） | 學員實作 | 影片 C（回頭） |
|------|--------------|--------------|---------|--------------|
| 4 | 6-11 Secret 概念 | 6-12 Secret + MySQL 實作 | Secret 練習 | 6-13 回頭 |
| 5 | 6-14 整合實作引導 | 6-15 Ingress+ConfigMap+Secret 整合 | 整合練習 | 6-16 回頭 |
| 6 | 6-17 PV + PVC 概念 | 6-18 PV/PVC 實作 | PV/PVC + 驗證持久化 | 6-19 回頭 |
| 7 | 6-20 StorageClass + StatefulSet | 6-21 StatefulSet MySQL 實作 | StatefulSet 練習 | 6-22 回頭 |
| 8 | 6-23 Helm 概念 | 6-24 Helm 實作 | Helm 安裝 Redis/MySQL | 6-25 總結+預告 |

**第六堂總計：25 支影片**

---

## 第七堂（4/25）— 生產就緒 + 總複習

**一句話：會從零獨立建一整套系統**

### 因果鏈

```
前面學會部署了，但生產環境還有問題
→ Pod Running 但服務卡死 → Probe 健康檢查（liveness/readiness/startup）
→ 一個 Pod 吃光資源 → Resource requests/limits + QoS
→ 流量暴增手動 scale 來不及 → HPA 自動擴縮
→ 誰都能刪 Pod → RBAC 權限控制
→ 叢集內全通不安全 → NetworkPolicy 網路隔離
→ 全部串起來 → 從零部署完整系統
```

### 上午 3hr（開場 + 3 個 Loop）

| 項目 | 影片 | 內容 |
|------|------|------|
| **開場** | 7-1 | 第六堂回顧 + 生產環境的挑戰 |
| **Loop 1** | 7-2 | Probe 概念（三種健康檢查） |
| | 7-3 | Probe 實作（故意搞壞觸發 restart） |
| | | *學員實作 + 巡堂* |
| | 7-4 | 回頭操作 |
| **Loop 2** | 7-5 | Resource limits + QoS 概念 |
| | 7-6 | Resource 實作（OOMKilled 示範） |
| | | *學員實作 + 巡堂* |
| | 7-7 | 回頭操作 |
| **Loop 3** | 7-8 | HPA 自動擴縮概念 |
| | 7-9 | HPA 實作（壓測觸發擴容） |
| | | *學員實作 + 巡堂* |
| | 7-10 | 回頭操作 + 上午總結 |

### 下午 4hr（5 個 Loop）

| Loop | 影片 A（概念） | 影片 B（示範） | 學員實作 | 影片 C（回頭） |
|------|--------------|--------------|---------|--------------|
| 4 | 7-11 RBAC 概念 | 7-12 RBAC 實作（只讀使用者） | RBAC 練習 | 7-13 回頭 |
| 5 | 7-14 NetworkPolicy 概念 | 7-15 NetworkPolicy 實作 | NetworkPolicy 練習 | 7-16 回頭 |
| 6 | 7-17 從零部署引導 | 7-18 完整系統 12 步（上） | 跟著做 | 7-19 回頭 |
| 7 | 7-20 完整系統 12 步（下） | 7-21 驗證+壓測+故障模擬 | 自由練習 | 7-22 回頭 |
| 8 | 7-23 四堂課總複習 | 7-24 Q&A + 學習路線建議 | — | 7-25 結業 |

**第七堂總計：25 支影片**

---

## 四堂課總覽

| 堂次 | 主題 | 影片數 | 學員帶走的能力 |
|------|------|:------:|--------------|
| 第四堂 | K8s 全貌 + Pod + Deployment 入門 | 26 | 會在 K8s 上跑容器，會讓 K8s 管一群 |
| 第五堂 | Deployment 進階 + Service + k3s | 26 | 會讓瀏覽器連到 K8s 裡的服務 |
| 第六堂 | Ingress + ConfigMap/Secret + PV/PVC + Helm | 25 | 會部署帶資料庫的完整網站 |
| 第七堂 | 生產就緒 + 總複習 | 25 | 會從零獨立建一整套系統 |
| **合計** | | **102** | |

### 因果鏈總覽（四堂課一條線）

```
Docker 單機扛不住
→ K8s → Pod → Service → Ingress → ConfigMap → Secret → Volume → Deployment → StatefulSet
→ 架構（Master/Worker）→ YAML → Pod CRUD → 排錯 → Sidecar → kubectl 進階 → 環境變數
→ Deployment 初體驗                                              ← 第四堂結束
→ k3s 多節點 → 擴縮容 → 滾動更新 → 回滾 → 自我修復 → Labels/Selector
→ ClusterIP → NodePort → DNS → Namespace → DaemonSet → CronJob  ← 第五堂結束
→ Ingress → Path/Host Routing → TLS
→ ConfigMap 實作 → Secret 實作 → PV/PVC → StorageClass → StatefulSet → Helm  ← 第六堂結束
→ Probe → Resource limits → HPA → RBAC → NetworkPolicy
→ 從零部署完整系統 → 總複習                                       ← 第七堂結束
```
