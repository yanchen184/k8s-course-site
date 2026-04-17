# Day 7 Loop 3 — HPA 自動擴縮

---

## 7-8 HPA 概念（~5 min）

### ① 課程內容

📄 7-8 第 1 張

上一個 Loop 做了 Resource limits，讓每個 Pod 不能無限吃資源。但 Resource limits 解決的是「單一 Pod 吃太多」，還有另一個問題沒解：**流量暴增，一個 Pod 不夠用**。

流量暴增往往在凌晨兩點，沒有人盯著。等你發現、登上去手動 `kubectl scale`，使用者早就一堆 timeout 了。這就是 **HPA：Horizontal Pod Autoscaler**，監控 Pod 的 CPU 使用率，超過閾值自動加 Pod，低於閾值自動縮。全自動，不需要人介入。

---

📄 7-8 第 2 張

HPA 有兩個前提：
1. **metrics-server**：HPA 靠它取得 CPU 數據。k3s 內建，標準 K8s 要另外裝。
2. **Pod 一定要設 resources.requests**：`averageUtilization: 50` 的 50% 是相對於 requests。沒有 requests，HPA 算不出百分比，不會動。

縮容有 5 分鐘冷卻期，是為了避免**抖動**（Pod 數量頻繁上下變動），確認流量真的穩了才縮。YAML 怎麼寫進實作再看。

---

## 7-9 HPA 實作（~15 min）

### ② 所有指令＋講解

**HPA 工作流程**

```
每 15 秒問 metrics-server：Pod 的 CPU 是多少？
   ↓
平均 CPU > 目標值（例如 50%）
   ↓
自動加 Pod → 流量分攤 → CPU 降下來
   ↓
停止壓測，CPU 持續低
   ↓
等冷卻期 5 分鐘（穩定視窗，確認流量真的穩了）
   ↓
自動縮 Pod
```

**HPA YAML 拆解**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo    # 要擴縮哪個 Deployment
  minReplicas: 2                 # 最少幾個 Pod
  maxReplicas: 10                # 最多幾個 Pod
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization        # 百分比，相對於 requests，最常用
        averageUtilization: 50   # CPU 超過 50% 就擴容
```

四個關鍵欄位：

| 欄位 | 說明 |
|------|------|
| `scaleTargetRef` | 告訴 HPA 管哪個 Deployment |
| `minReplicas` | 最少保留幾個 Pod，不能設 0（冷啟動太慢） |
| `maxReplicas` | 上限，根據 Node 總資源決定 |
| `averageUtilization` | 相對於 requests 的百分比，requests cpu `100m` × 50% = `50m` 就觸發擴容 |

`type` 除了 `Utilization`（百分比，最常用），還有 `AverageValue`（每 Pod 絕對值）和 `Value`（所有 Pod 總量）。

---

**Step 0：確認 metrics-server 正常**

```bash
kubectl get pods -n kube-system -l k8s-app=metrics-server
```

預期輸出：
```
NAME                              READY   STATUS    RESTARTS   AGE
metrics-server-xxx-yyy            1/1     Running   0          2d
```

`Running` 就可以繼續。接著確認能拿到數據：

```bash
kubectl top nodes
kubectl top pods
```

能看到 CPU 和 MEMORY 的數字就代表 metrics-server 正常運作。如果看到 `error: Metrics API not available`，等一兩分鐘讓 metrics-server 初始化完成再試。

---

**Step 1：確認 Deployment 有設 resources.requests**

```bash
kubectl get deployment nginx-resource-demo -o yaml | grep -A5 resources
```

應該要看到：
```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 200m
    memory: 256Mi
```

如果沒看到 requests，HPA 建了也沒用。先回去 `resource-ok.yaml` 補上，再 apply。

```bash
kubectl apply -f resource-ok.yaml
```

---

**Step 2：建 HPA**

用指令最快，一行搞定：

```bash
kubectl autoscale deployment nginx-resource-demo \
  --min=2 --max=10 --cpu-percent=50
```

翻譯成白話：幫 `nginx-resource-demo` 建一個 HPA，最少 2 個 Pod，最多 10 個，CPU 超過 50% 就擴。

等價的 YAML 做法（效果一樣）：

```yaml
# hpa.yaml
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
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

```bash
kubectl apply -f hpa.yaml
```

---

**Step 3：確認 HPA 狀態**

```bash
kubectl get hpa
```

預期輸出：
```
NAME                   REFERENCE                         TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
nginx-resource-demo    Deployment/nginx-resource-demo    1%/50%    2         10        2          30s
```

- `TARGETS` 斜線前是目前 CPU 使用率，後面是目標值
- 剛建好可能顯示 `unknown/50%`，等 30 秒到 1 分鐘讓 metrics-server 收集數據
- `REPLICAS 2` 表示目前維持 minReplicas

---

**Step 4：開壓測 — 觸發擴容**

開第二個終端機，先建立 Service 讓壓測流量有地方打（如果還沒建）：

```bash
kubectl get svc nginx-resource-svc    # 確認 Service 存在
```

開一個 load-generator Pod 持續發請求：

```bash
kubectl run -it load-generator \
  --image=busybox \
  --restart=Never \
  -- sh -c "while true; do wget -q -O- http://nginx-resource-svc/; done"
```

- `--restart=Never`：只跑一次，跑完就刪
- `while true`：無限迴圈，不停發請求
- `wget -q -O-`：靜默模式，輸出到 stdout，不存檔

---

**Step 5：觀察擴容過程**

切回第一個終端機，持續觀察 HPA：

```bash
kubectl get hpa -w
```

大概 1～2 分鐘後，你會看到 TARGETS 的 CPU 使用率開始攀升，REPLICAS 從 2 增加到更多：

```
NAME                  TARGETS    MINPODS   MAXPODS   REPLICAS
nginx-resource-demo   1%/50%     2         10        2
nginx-resource-demo   78%/50%    2         10        2
nginx-resource-demo   78%/50%    2         10        4
nginx-resource-demo   62%/50%    2         10        6
nginx-resource-demo   45%/50%    2         10        6
```

同時在另一個視窗可以觀察 Pod 被建立：

```bash
kubectl get pods -w
```

---

**Step 6：停壓測 → 觀察縮容**

在 load-generator 的視窗按 `Ctrl+C`，然後刪掉這個 Pod：

```bash
kubectl delete pod load-generator
```

回到 HPA watch，CPU 使用率會慢慢降下來。但注意：**REPLICAS 不會馬上縮回 2**，要等 5 分鐘的縮容冷卻期。這是正常的，不是 bug。

---

**Step 7：查 HPA 事件記錄**

```bash
kubectl describe hpa nginx-resource-demo
```

看 `Events` 區塊：
```
Events:
  Type    Reason             Message
  ----    ------             -------
  Normal  SuccessfulRescale  New size: 4; reason: cpu resource utilization (percentage of request) above target
  Normal  SuccessfulRescale  New size: 2; reason: All metrics below target
```

完整的擴容縮容過程都在這裡。生產環境排查 HPA 問題，`kubectl describe hpa` 是最重要的指令。

---

### ③ QA

**Q：HPA 的 TARGETS 一直顯示 `unknown/50%`，怎麼辦？**

A：兩個可能原因。第一，metrics-server 剛啟動還在收集數據，等 30 秒到 1 分鐘通常就有數字了。第二，也是最常見的，你的 Deployment 沒有設 `resources.requests`，HPA 沒有分母算不出百分比。確認方法：`kubectl get deployment nginx-resource-demo -o yaml | grep -A5 resources`，看有沒有 `requests` 欄位，沒有就補上去。

**Q：為什麼停止壓測後，REPLICAS 沒有馬上縮回去？**

A：HPA 有 5 分鐘的縮容冷卻期（scale-down stabilization window）。設計邏輯是：流量可能只是短暫下降，馬上就會回來。如果一降就縮，等流量回來又要重新擴，Pod 不斷建立刪除叫做「抖動」，對系統穩定性不好。等 5 分鐘確認流量真的穩了，HPA 才會縮。這是正常的設計，不是 bug。

**Q：`minReplicas` 可以設 0 嗎？這樣沒有流量的時候可以節省資源。**

A：技術上 autoscaling/v2 支援設 0，但實務上幾乎不建議。原因是：當流量進來的時候，從 0 個 Pod 擴到有 Pod 跑起來要時間（通常 30 秒到 1 分鐘），這段期間請求全部失敗。除非是很確定長時間沒有流量的批次工作，否則至少設 1 或 2。

**Q：`maxReplicas` 要設多少才合理？**

A：要根據你的 Node 總資源決定。簡單算法：Node 總 CPU 除以每個 Pod 的 requests CPU，得到理論上能放幾個 Pod，maxReplicas 設在那個數字以下。舉例：兩台 Node 各 2 CPU，每個 Pod requests `100m`，理論上最多 `(2 + 2) * 1000 / 100 = 40` 個 Pod，但要保留一些給系統元件，maxReplicas 設 20～30 比較安全。

---

## 7-10 回頭操作 Loop 3（~5 min）

### ④ 學員實作

> 📢 **講師說話口吻**
>
> 好，換你們自己建 HPA 跑一次壓測。這個流量暴增自動擴的過程，你要親眼看一次才有感覺。

**🎯 必做題：建 HPA 壓測觀察**

對 `nginx-resource-demo` 建 HPA，觀察自動擴縮：

使用的 lab 檔案：`~/workspace/k8s-course-labs/lesson7/nginx-resource-demo.yaml`（含 Service）

1. 確認 `nginx-resource-demo` Deployment 有設 `resources.requests`
2. 建 HPA：min=2、max=5、CPU 50%
3. 開 load-generator 壓測
4. 用 `kubectl get hpa -w` 觀察 REPLICAS 從 2 增加
5. 停止壓測，等 5 分鐘觀察 REPLICAS 縮回 2
6. 用 `kubectl describe hpa nginx-resource-demo` 看 Events 記錄

**🏆 挑戰題：改更低的閾值**

1. 刪掉剛才的 HPA
2. 重新建，但 `targetCPUUtilizationPercentage` 改成 **30%**
3. 同樣的壓測方式重跑
4. 觀察：在更低的 CPU 使用率時就開始擴容
5. 對比 50% 和 30% 兩種設定，思考：什麼場景適合低閾值？什麼場景適合高閾值？

---

### ⑤ 學員實作解答

**必做解答**

確認 Deployment 有 requests（如果沒有，用這個 YAML）：

```yaml
# nginx-resource-demo.yaml
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
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 200m
            memory: 256Mi
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

```bash
kubectl apply -f nginx-resource-demo.yaml
```

建 HPA（兩種方式擇一）：

```bash
# 方式一：指令
kubectl autoscale deployment nginx-resource-demo \
  --min=2 --max=5 --cpu-percent=50
```

```yaml
# 方式二：hpa.yaml
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
        averageUtilization: 50
```

```bash
kubectl apply -f hpa.yaml
```

壓測指令：

```bash
kubectl run -it load-generator \
  --image=busybox \
  --restart=Never \
  -- sh -c "while true; do wget -q -O- http://nginx-resource-svc/; done"
```

觀察指令：

```bash
# 終端機 1：觀察 HPA
kubectl get hpa -w

# 終端機 2：觀察 Pod 數量
kubectl get pods -w

# 停壓測後看事件記錄
kubectl describe hpa nginx-resource-demo
```

**挑戰解答（改為 30%）：**

```bash
# 刪掉舊 HPA
kubectl delete hpa nginx-resource-demo

# 建新 HPA，閾值改 30%
kubectl autoscale deployment nginx-resource-demo \
  --min=2 --max=5 --cpu-percent=30
```

低閾值（30%）適合**延遲敏感**的服務，寧可提早擴容，不要等 CPU 到 50% 了才擴。高閾值（70%）適合資源有限的環境，讓 Pod 充分利用後再擴，節省成本。

---

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| Pod 沒設 `resources.requests` | `TARGETS` 一直顯示 `unknown/50%` | 回 Deployment YAML 補上 `resources.requests`，重新 apply |
| metrics-server 沒裝或沒正常跑 | `kubectl top pods` 報 `Metrics API not available` | k3s 內建；minikube 執行 `minikube addons enable metrics-server`，等 1～2 分鐘 |
| `minReplicas` 設 0 | 第一個請求進來要等 30～60 秒才有 Pod 起來 | 設 1 或 2，避免冷啟動造成使用者看到錯誤 |

---

**清理**

```bash
kubectl delete hpa nginx-resource-demo
kubectl delete pod load-generator --ignore-not-found
kubectl delete -f nginx-resource-demo.yaml
kubectl get all    # 確認只剩 kubernetes Service
```
