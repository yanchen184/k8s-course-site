# Loop 1 — HPA 自動擴縮

---

## 環境準備（上課前先清理叢集）

上課前確認叢集是乾淨的，把前幾堂練習留下的資源全部清掉：

```
指令：helm uninstall monitoring -n default
指令：helm uninstall my-app -n default
指令：helm uninstall my-blog -n default
指令：helm uninstall my-ingress -n default
```

如果還有其他 Deployment 或 StatefulSet 殘留：

```
指令：kubectl delete all --all -n default
指令：kubectl delete pvc --all -n default
```

清理 journal log 釋放磁碟空間：

```
指令：sudo journalctl --vacuum-size=100M
```

確認環境乾淨：

```
指令：kubectl get pods -n default
指令：df -h /
```

pods 列表應該是空的（或只剩本次要用的），磁碟空間至少 3G 以上才夠拉 image。

---

## 7-1 第六堂回顧 + 今天的挑戰

好，歡迎回來。今天是我們 Kubernetes 課程的第七堂，也是最後一堂。在開始新的內容之前，先花幾分鐘把第六堂的因果鏈快速串一遍。

第六堂的起點是使用者要用 IP 加 NodePort 連進來，地址又長又醜。所以學了 Ingress，用域名路由。接著設定寫死在 Image 裡，所以學了 ConfigMap 和 Secret。然後 Pod 重啟資料全消失，所以學了 PV 和 PVC 做持久化。跑資料庫需要穩定身份，所以學了 StatefulSet。YAML 多到爆，學了 Helm。最後 kubectl 管叢集太痛苦，學了 Rancher GUI。

今天我選了兩個最重要的問題。第一個，流量暴增：雙十一零點，平常三個 Pod 夠用，現在流量翻十倍，凌晨三點你在睡覺，這個問題用 HPA 解決。第二個，誰都能刪：實習生跑清理腳本，kubectl delete namespace production，整個生產環境瞬間消失，這個問題用 RBAC 解決。

---

## 7-2 HPA 概念 — 流量暴增，手動 scale 來不及

**問題：手動 scale 的兩個根本缺陷**

手動 scale 有兩個根本問題。第一，反應太慢，你沒辦法即時應對。第二，容易忘記縮回來，浪費資源。

**HPA 工作流程**

HPA，Horizontal Pod Autoscaler，每 15 秒去問 metrics-server：現在每個 Pod 的 CPU 使用率是多少？超過你設的目標值就增加 Pod，低於目標值就減少 Pod。縮容有 5 分鐘冷卻期，防止流量短暫下降就頻繁縮容。

**HPA YAML 三個關鍵**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-resource-demo
spec:
  scaleTargetRef:              # ★ 重點 1：告訴 HPA 要管哪個 Deployment
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo  # ← 對應 Deployment 的 name
  minReplicas: 2               # ★ 重點 2：最少保持 2 個 Pod（基本高可用）
  maxReplicas: 10              # ★ 重點 3：最多擴到 10 個，超過不再擴
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50 # ★ 重點 4：CPU 超過 requests 的 50% 就擴容
```

- **`scaleTargetRef`**：告訴 HPA 要擴縮哪個 Deployment，name 要跟 Deployment 的 metadata.name 完全一致
- **`minReplicas: 2`**：就算沒有流量，也至少保持 2 個 Pod。設 1 的話縮容後只剩 1 個，那個 Pod 掛掉就服務中斷
- **`maxReplicas: 10`**：防止流量暴增時無限擴容把 Node 資源吃光，要根據 Node 總資源設上限
- **`averageUtilization: 50`**：50% 是相對於 requests 的比例。Pod requests 設 100m，50% 就是 50m，現在平均用超過 50m 就擴容

**前提：Pod 必須設 resources.requests**

HPA 算的是百分比，百分比需要分母，分母就是 requests。沒設 requests，HPA 算不出百分比，TARGETS 一直顯示 unknown，不動。

**需要 metrics-server**

k3s 內建，minikube 用 `minikube addons enable metrics-server` 啟用。

---

## 7-3 HPA 實作 — 壓測觸發自動擴縮

**Step 1：確認 metrics-server**

```
指令：kubectl get pods -n kube-system
指令：kubectl top nodes
```

看到 CPU 和 MEMORY 的數字代表 metrics-server 正常。

**Step 2：部署 nginx（有設 requests）**

```
指令：kubectl apply -f nginx-resource-demo.yaml
```

這個 YAML 同時包含 Deployment 和 Service，一次建好。完整內容如下：

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
          resources:          # ★ 重點 1：一定要設，HPA 才能運作
            requests:
              cpu: "100m"     # ★ 重點 2：HPA 的分母，50% = 50m
              memory: "128Mi"
            limits:
              cpu: "200m"
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
  # type 預設 ClusterIP，不用明確寫，叢集內部可連
```

**重點介紹**

- **`resources.requests.cpu: "100m"`**：這是 HPA 的分母。HPA 看的是「現在用了多少 / requests 是多少」，算出百分比。沒設 requests，分母是零，算不出來，TARGETS 永遠顯示 `unknown`。
- **`resources.limits`**：Pod 最多能用多少資源。Limit 比 Request 高，讓 Pod 有彈性空間，但不至於把 Node 吃乾。
- **Service 名稱 `nginx-resource-svc`**：後面壓測指令 `wget -qO- http://nginx-resource-svc` 就是打這個名字，K8s DNS 自動解析。

```
指令：kubectl get deploy nginx-resource-demo
```

確認 Deployment 存在，READY 欄位顯示幾個 Pod 已經 Running（應該是 2/2）。

```
指令：kubectl get svc nginx-resource-svc
```

確認 Service 存在，TYPE 是 ClusterIP，CLUSTER-IP 有分配到 IP 就代表 DNS 可以解析。

**Step 3：建 HPA**

```
指令：kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=50%
```

這一行指令等於手動寫 HPA YAML。`--min=2` 是最少保持 2 個 Pod，`--max=10` 是最多擴到 10 個，`--cpu=50%` 是 CPU 使用率超過 requests 的 50% 就擴容。

```
指令：kubectl get hpa
```

看 TARGETS 欄位。剛建好會顯示 `unknown/50%`，等 30 秒到 1 分鐘讓 metrics-server 收集數據，就會變成實際數字，比如 `1%/50%`。

**Step 4：壓測**

開另一個終端機，跑這個指令：

```
指令：kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"
```

這個指令建了一個 busybox Pod，在裡面跑無限迴圈，一直對 nginx-resource-svc 發請求。`--rm` 是結束後自動刪掉這個 Pod，`-it` 是互動模式讓你可以按 Ctrl+C 停止。每秒幾十到上百次請求，模擬流量暴增。

**Step 5：觀察**

回到原本的終端機：

```
指令：kubectl get hpa -w
```

`-w` 是 watch 模式，有變化就自動更新，不用一直手動輸入。你會看到 TARGETS 的 CPU 使用率慢慢上升，超過 50% 之後 REPLICAS 開始增加，2 變 3、3 變 4。

```
指令：kubectl get pods -w
```

同時看 Pod 的狀態，新的 Pod 一個一個冒出來：Pending → ContainerCreating → Running。這就是 HPA 在自動加 Pod。

壓測跑兩三分鐘感受擴容過程，然後回到壓測終端機按 Ctrl+C 停止。

停止之後 CPU 降到接近 0%，但 REPLICAS 不會馬上縮。等 5 分鐘冷卻期過了，REPLICAS 才開始減少，最終回到 2。

```
指令：kubectl describe hpa nginx-resource-demo
```

找 Events 部分，你會看到 `New size: 3; reason: cpu resource utilization above target`，然後 `New size: 2; reason: All metrics below target`。完整的擴縮記錄都在這裡，生產環境排查 HPA 問題就靠這個。

**QA**

> Q：TARGETS 一直顯示 unknown/50%？

最常見是 Deployment 沒設 resources.requests。加上去重新 apply。另一個原因是 metrics-server 剛啟動，等 30 秒到 1 分鐘。

> Q：壓測停止後 REPLICAS 一直不縮？

沒壞。HPA 縮容有 5 分鐘冷卻期，等滿 5 分鐘會縮。

> Q：minReplicas 設 2，手動 scale 到 1，HPA 會讓它縮回 2 嗎？

會。HPA 是最終控制者，下次控制循環跑完就把它拉回 2。

---

## 7-4 學員實作 + 常見坑

**必做題**

部署 nginx-resource-demo.yaml，建 HPA，busybox 壓測，觀察 REPLICAS 增加，停止壓測等 5 分鐘看縮回 2。

**挑戰題：改 targetCPU 為 30%**

```
指令：kubectl delete hpa nginx-resource-demo
指令：kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=30%
```

同樣流量，30% 比 50% 更低，擴容觸發更早。

**巡堂確認清單**

- `kubectl get hpa` 看到 TARGETS 有數字不是 unknown
- 壓測中 REPLICAS 大於 2
- 停止壓測後 REPLICAS 縮回 2

**常見坑**

- 坑 1：TARGETS unknown → Deployment 沒設 resources.requests，加上去重新 apply
- 坑 2：`kubectl top pods` 報錯 Metrics API not available → metrics-server 沒裝，k3s 內建，minikube 要 `minikube addons enable metrics-server`
- 坑 3：requests 有設但還是 unknown → metrics-server 剛啟動，等 30 秒到 1 分鐘

**Loop 1 因果鏈**

流量暴增，手動 scale 來不及 → HPA 根據 CPU 使用率自動擴縮，全自動，不需要人介入。
