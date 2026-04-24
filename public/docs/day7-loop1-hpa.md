# Loop 1 — HPA 自動擴縮（50 分鐘）

---

## 7-1 開場 + 第六堂回顧（5 分鐘）

好，歡迎回來。今天是我們 Kubernetes 課程的第七堂，也是最後一堂。

在開始新內容之前，先把第六堂的因果鏈快速串一遍。為什麼要串？因為今天要講的東西，是建立在前六堂基礎上的最後一哩路。

**第六堂六招因果鏈**

第六堂的起點是——使用者要用 IP 加 NodePort 連進來，地址又長又醜、每次改 port 就爆炸。所以學了 **Ingress**，用域名路由。

接著發現設定寫死在 Image 裡、改設定要重 build image。所以學了 **ConfigMap 和 Secret**，設定跟程式分離。

然後 Pod 重啟資料全消失，資料庫跑在 K8s 裡等於自殺。所以學了 **PV 和 PVC**，做持久化。

跑資料庫不只要持久化，還要穩定的身份跟有序啟動。所以學了 **StatefulSet**，Pod 名字不變、順序上線。

當 YAML 多到爆、每個環境要改一堆值，複製貼上地獄。所以學了 **Helm**，用 values.yaml 一次管理。

最後 kubectl 管一整個叢集太痛苦，開發者要看日誌、除錯、重啟 Pod，全部靠指令效率太低。所以學了 **Rancher GUI**，用圖形化界面降低操作門檻。

**銜接句**

服務看起來很體面了：有域名、有設定管理、有資料庫、有 GUI。但我今天要跟大家說一件殘酷的事情——**穿得漂亮不代表扛得住**。

---

## 7-1 今天兩個戰場（5 分鐘）

今天我選了生產環境裡兩個最要命的問題，上午各用一個 Loop 解決。

**戰場一：流量暴增（雙十一故事）**

想像你的網站平常三個 Pod 夠用，雙十一零點開賣，流量瞬間翻十倍。你在哪？凌晨三點你在睡覺。使用者打不開頁面、下不了單，每分鐘損失幾十萬。等你起床手動 `kubectl scale` 已經半小時過去了。

手動 scale 有兩個根本問題：第一，**反應太慢**，沒辦法即時應對。第二，**容易忘記縮回來**，流量過了還開著十個 Pod，月底帳單傻眼。

這個問題用 **HPA**（Horizontal Pod Autoscaler）解決。設定好 CPU 閾值，全自動擴縮，人不用介入。

**戰場二：誰都能刪（實習生故事）**

你團隊十個人，全部都拿 `cluster-admin` 的 kubeconfig。某天實習生跑清理腳本，指令打錯，`kubectl delete namespace production`。整個生產環境瞬間消失。使用者投訴爆炸、主管臉綠、你連夜還原備份。

這個問題用 **RBAC**（Role-Based Access Control）解決。不同角色給不同權限，實習生只能讀、不能刪。

**今天的路線**

上午兩個 Loop：Loop 1 HPA、Loop 2 RBAC。下午從零建一套完整系統，把前面學的所有東西串起來。

---

## 7-1 環境準備（5 分鐘，上課前先清理）

在進 HPA 實作之前，先動手把環境清乾淨。

**為什麼要清？**

第六堂我們部署了四個 Helm release：monitoring、my-app、my-blog、my-ingress。這些都還在跑、會吃 CPU 跟 Memory。等一下 HPA 要觀察 CPU 指標，如果資源被其他東西吃掉，HPA 算出來的百分比會不準。你看到的擴縮行為就會奇怪。

**清理 Helm release**

```
指令：helm uninstall monitoring -n default
指令：helm uninstall my-app -n default
指令：helm uninstall my-blog -n default
指令：helm uninstall my-ingress -n default
```

**清理殘留 Deployment / PVC**

如果還有其他資源殘留：

```
指令：kubectl delete all --all -n default
指令：kubectl delete pvc --all -n default
```

**釋放磁碟**

journal log 佔久了會吃掉幾個 G：

```
指令：sudo journalctl --vacuum-size=100M
```

**確認環境乾淨**

```
指令：kubectl get pods -n default
指令：df -h /
```

pods 列表應該是空的，磁碟空間至少 3G 以上才夠等一下拉 image。

清乾淨就進 HPA 概念。

---

## 7-2 HPA 概念（5 分鐘）

**手動 scale 的兩個致命缺陷**

第一，反應太慢。流量暴增那一刻你可能在睡覺、在吃飯、在開會。等你發現、登入叢集、下指令，幾十分鐘過去了，損失已經造成。

第二，容易忘記縮回來。就算你當下撐過去了，事後誰記得要縮回來？開著十個 Pod 整個月，帳單三倍不是開玩笑。

所以需要自動化。這就是 HPA 存在的理由。

**HPA 工作流程**

HPA 每 15 秒去問一次 metrics-server：目前這個 Deployment 每個 Pod 的 CPU 使用率是多少？

- 超過你設的目標值（比如 50%）→ 增加 Pod
- 低於目標值 → 減少 Pod
- 但縮容有**穩定窗口**（預設 5 分鐘），防止流量短暫下降就頻繁縮容。等看到 CPU 連續 5 分鐘都低於門檻才開始縮

整個流程**全自動**，人不用看、不用介入。

**兩個前提**

1. **Pod 必須設 resources.requests.cpu**。HPA 算的是百分比，百分比需要分母，分母就是 requests。沒設 requests，TARGETS 永遠顯示 `unknown`，HPA 不會動。

2. **叢集要有 metrics-server**。k3s 內建，如果用 minikube 要 `minikube addons enable metrics-server` 啟用。

---

## 7-2 HPA YAML 完整版（3 分鐘）

這是一份完整的 HPA YAML，四個關鍵欄位：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-resource-demo
spec:
  scaleTargetRef:              # ★ 重點 1：要管哪個 Deployment
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo  # ← 對應 Deployment 的 name
  minReplicas: 2               # ★ 重點 2：最少 2 個（基本高可用）
  maxReplicas: 5               # ★ 重點 3：最多 5 個（VM 資源保護）
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 2  # ★ 重點 4：CPU 超過 requests 2% 就擴（課堂 VM 值）
```

- **`scaleTargetRef.name`**：要跟 Deployment 的 metadata.name 完全一致
- **`minReplicas: 2`**：沒流量也至少 2 個，避免單點故障
- **`maxReplicas: 5`**：單節點 VM 環境，5 個夠用；生產環境可以調到 10、20
- **`averageUtilization: 2`**：課堂 VM 環境設 2%，nginx 靜態頁面吃 CPU 極低，設 50% 壓不上去。**生產環境通常設 50~70%**

**實戰兩種建法**

- **快速版**：`kubectl autoscale` 一行指令，適合實驗、臨時測試
- **完整版**：寫 YAML 檔案 + `kubectl apply -f`，適合生產環境、可版控、能加進階參數

等一下 Demo 1 用一行版本、Demo 4 升級成 YAML 版本加 behavior 參數。

---

## 7-3 Demo 1：部署 + 建 HPA（3 分鐘）

**Step 1：確認 metrics-server**

```
指令：kubectl get pods -n kube-system -l k8s-app=metrics-server
指令：kubectl top nodes
指令：kubectl top pods -A
```

看到 CPU 跟 MEMORY 有數字代表 metrics-server 正常。

**Step 2：部署 nginx（有設 requests）**

`nginx-resource-demo.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-resource-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-resource
  template:
    metadata:
      labels:
        app: nginx-resource
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:          # ★ HPA 才能運作
            requests:
              cpu: "100m"     # ★ HPA 的分母
              memory: "128Mi"
            limits:
              cpu: "150m"     # ★ 單 Pod 最高 150m
              memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-resource-svc
spec:
  selector:
    app: nginx-resource
  ports:
    - port: 80
      targetPort: 80
```

**部署指令**

```
指令：kubectl apply -f nginx-resource-demo.yaml
指令：kubectl get deploy nginx-resource-demo
指令：kubectl get svc nginx-resource-svc
```

READY 應該是 2/2。

**Step 3：建 HPA（一行指令版本）**

```
指令：kubectl autoscale deployment nginx-resource-demo --min=2 --max=5 --cpu=2%
指令：kubectl get hpa
```

剛建好 TARGETS 顯示 `unknown/50%`，等 30 秒到 1 分鐘後變成實際數字，比如 `1%/50%`。

---

## 7-3 Demo 2：輕壓測 sleep 0.1（5 分鐘）

**目的**：證明 HPA 不會亂擴。流量低時即使有 HPA 也不動。

開**另一個終端機**跑壓測：

```
指令：kubectl run load-light --image=busybox:1.36 --rm -it --restart=Never --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.1; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
```

每秒約 10 次請求（模擬日常低流量）。壓測 pod 本身也設了 `limits.cpu: 100m`，避免它自己吃爆 node。

**回原終端機觀察（watch 1 分鐘）**

```
指令：kubectl get hpa -w
```

預期：TARGETS 爬到 10-20% 左右，**低於 50% 門檻，REPLICAS 維持 2**。這是對照組——證明 HPA 不會亂加 Pod。

按 Ctrl+C 離開 watch，回到壓測終端機按 Ctrl+C 停掉輕壓測。

---

## 7-3 Demo 3：中壓測 sleep 0.05（5 分鐘）

**目的**：讓 CPU 爬升到接近門檻，觀察邊緣行為。

```
指令：kubectl run load-medium --image=busybox:1.36 --rm -it --restart=Never --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.05; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
```

每秒約 20 次請求。

**觀察**

```
指令：kubectl get hpa -w
```

預期：TARGETS 爬到 30-40%，接近但還沒超過 50%。REPLICAS **可能**從 2 變 3，也可能維持 2。看你 VM 實際表現。

這個階段的重點是**讓學員看到 HPA 在算數字**——不是壓就一定擴，是看比例。

停掉中壓測。

---

## 7-3 Demo 4：重壓 sleep 0.01 + 升級 YAML 看縮容（7 分鐘）

**目的**：觸發擴容 + 觀察縮容節奏。

**Step 1：升級 HPA 到完整 YAML（加 behavior 縮短穩定窗口）**

為了讓課堂能看到縮容，先把舊 HPA 刪掉、換成加了 behavior 的 YAML 版本。

```
指令：kubectl delete hpa nginx-resource-demo
指令：kubectl scale deployment nginx-resource-demo --replicas=2
```

`hpa-tuned.yaml`：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-resource-demo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 2  # ← 課堂 VM 值，生產通常 50~70
  behavior:                              # ★ 進階參數：控制擴縮節奏
    scaleDown:
      stabilizationWindowSeconds: 60    # ← 縮容穩定窗口縮成 60 秒（預設 300）
```

```
指令：kubectl apply -f hpa-tuned.yaml
指令：kubectl get hpa
```

**這裡的教學點**：一行 `kubectl autoscale` 做不到進階參數，生產環境的 HPA 一定要用 YAML 管理。

**Step 2：重壓測**

```
指令：kubectl run load-heavy --image=busybox:1.36 --rm -it --restart=Never --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.01; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
```

每秒約 100 次請求。

**Step 3：觀察擴容**

```
指令：kubectl get hpa -w
```

預期：TARGETS 飆到 60-80%，REPLICAS 從 2 → 3 → 4 → 5（到 maxReplicas 上限）。

同時看 Pod：

```
指令：kubectl get pods -w
```

新 Pod 一個個冒出來：Pending → ContainerCreating → Running。

**Step 4：停壓 + 觀察縮容（1 分鐘）**

回到壓測終端機按 Ctrl+C 停止重壓測。

回原終端繼續 watch：

```
指令：kubectl get hpa -w
```

CPU 降到接近 0%，等 **60 秒**（我們設的 stabilizationWindowSeconds）後，REPLICAS 從 5 → 4 → 3 → 2，縮回最小值。

如果沒改 behavior 參數，預設要等 5 分鐘。改成 60 秒課堂就看得完。

**Step 5：看完整軌跡**

```
指令：kubectl describe hpa nginx-resource-demo
```

找 Events：
- `New size: 3; reason: cpu resource utilization above target`
- `New size: 5; reason: cpu resource utilization above target`
- `New size: 4; reason: All metrics below target`
- `New size: 2; reason: All metrics below target`

完整擴縮記錄都在這裡，生產環境排查 HPA 問題就靠這個。

**QA（邊等邊講）**

> Q：TARGETS 一直 unknown？

最常見是 Deployment 沒設 resources.requests。另一個是 metrics-server 剛啟動，等 30 秒到 1 分鐘。

> Q：minReplicas=2，我手動 `kubectl scale --replicas=1` 會怎樣？

會被 HPA 拉回 2。HPA 是最終控制者，下次控制迴圈跑完就把它拉回 minReplicas。

> Q：擴容很快但縮容慢，合理嗎？

合理。擴容太慢使用者會受影響，要快；縮容太快流量一回升又要重擴，浪費資源，所以要穩定窗口防抖。

---

## 7-4 學員實作（7 分鐘）

**題目場景**

部署 nginx、建 HPA、用三種壓力測試，親眼看 HPA 怎麼根據 CPU 使用率自動擴縮。

**必做題要求**

1. 部署 `nginx-resource-demo.yaml`（Deployment + Service）
2. 用一行指令建 HPA：min=2、max=5、cpu=2%（課堂 VM 值，生產設 50~70%）
3. 跑三階段壓測：
   - 輕壓 `sleep 0.1` → 觀察不擴
   - 中壓 `sleep 0.05` → 觀察臨界
   - 重壓 `sleep 0.01` → 觀察擴到 5
4. 停壓 → 觀察縮回 2（預設要等 5 分鐘，或升級 YAML 版加 behavior 縮成 60 秒）

**驗收條件**

- ✅ `kubectl get hpa` TARGETS 有數字（不是 unknown）
- ✅ 輕壓時 REPLICAS 維持 2
- ✅ 重壓時 REPLICAS 大於 2
- ✅ 停壓後 REPLICAS 縮回 2
- ✅ `kubectl describe hpa` Events 看得到擴縮記錄

**完整指令清單**

```bash
# ─── Part 1：部署 nginx ───
kubectl apply -f nginx-resource-demo.yaml
kubectl get deploy nginx-resource-demo
kubectl get svc nginx-resource-svc

# ─── Part 2：建 HPA（一行版）───
kubectl autoscale deployment nginx-resource-demo --min=2 --max=5 --cpu=2%
kubectl get hpa

# ─── Part 3：輕壓 0.1（開新終端）───
kubectl run load-light --image=busybox:1.36 --rm -it --restart=Never \
  --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.1; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
# 原終端觀察
kubectl get hpa -w
# 按 Ctrl+C 停

# ─── Part 4：中壓 0.05 ───
kubectl run load-medium --image=busybox:1.36 --rm -it --restart=Never \
  --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.05; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh

# ─── Part 5：升級 HPA 加 behavior ───
kubectl delete hpa nginx-resource-demo
kubectl apply -f hpa-tuned.yaml

# ─── Part 6：重壓 0.01 → 擴 → 停壓 → 縮 ───
kubectl run load-heavy --image=busybox:1.36 --rm -it --restart=Never \
  --overrides='{"spec":{"containers":[{"name":"load","image":"busybox:1.36","command":["sh","-c","while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; sleep 0.01; done"],"resources":{"limits":{"cpu":"100m"}}}]}}' -- sh
# 原終端
kubectl get hpa -w
# 看到 REPLICAS 擴到 5、壓測終端 Ctrl+C、繼續 watch 看縮回 2

# ─── Part 7：看完整軌跡 ───
kubectl describe hpa nginx-resource-demo
```

**挑戰題：修改 hpa-tuned.yaml 改 min/max**

開啟 `hpa-tuned.yaml`，把：
- `minReplicas: 2` → `3`
- `maxReplicas: 5` → `6`

```
指令：kubectl apply -f hpa-tuned.yaml
指令：kubectl get hpa
```

觀察兩件事：最少維持 3 個 Pod（即使沒有任何流量）、重壓時最多能擴到 6。感受 min/max 這兩個參數如何控制 HPA 的上下邊界。

**巡堂確認清單**

- `kubectl get hpa` TARGETS 有數字不是 unknown
- 重壓中 REPLICAS 大於 2
- 停壓後 REPLICAS 縮回 2（或等 60 秒如果用 YAML 版）
- 壓測 pod 有 Ctrl+C 清掉

**常見坑**

- 坑 1：TARGETS unknown → Deployment 沒設 resources.requests，加上去重新 apply
- 坑 2：`kubectl top pods` 報 Metrics API not available → metrics-server 沒裝
- 坑 3：requests 有設還是 unknown → metrics-server 剛啟動，等 30 秒到 1 分鐘
- 坑 4：壓測把 VM 打掛 → 確認壓測 pod 有加 `limits.cpu`、maxReplicas 不要開太大

**Loop 1 因果鏈**

流量暴增手動 scale 來不及 → HPA 根據 CPU 自動擴 → 三階段壓測驗證門檻行為 → 生產環境用 YAML 管理 HPA、加 behavior 控制擴縮節奏 → 全自動、不需要人介入。

---

## 清理（Loop 1 結束）

```
指令：kubectl delete hpa nginx-resource-demo --ignore-not-found
指令：kubectl delete -f nginx-resource-demo.yaml --ignore-not-found
指令：kubectl delete -f hpa-tuned.yaml --ignore-not-found
指令：rm -f nginx-resource-demo.yaml hpa-tuned.yaml
```

下一段：Loop 2 RBAC，解決「誰都能刪」的權限問題。HPA 讓服務能自動擴縮，但如果誰都能 `kubectl delete`，擴再多也沒用。
