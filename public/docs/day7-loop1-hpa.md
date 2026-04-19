# Loop 1 — HPA 自動擴縮

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
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
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

- `scaleTargetRef`：告訴 HPA 要擴縮哪個 Deployment
- `minReplicas` / `maxReplicas`：最少 / 最多幾個 Pod
- `averageUtilization: 50`：平均 CPU 超過 requests 的 50% 就擴容

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
指令：kubectl get deploy nginx-resource-demo
指令：kubectl get svc nginx-resource-svc
```

nginx-resource-demo.yaml 的重點：

```yaml
resources:
  requests:
    cpu: "100m"
    memory: 128Mi
  limits:
    cpu: "500m"
    memory: 256Mi
```

**Step 3：建 HPA**

```
指令：kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=50%
指令：kubectl get hpa
```

剛建好 TARGETS 顯示 `unknown/50%`，等 30 秒到 1 分鐘會變成數字。

**Step 4：壓測**

```
指令：kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"
```

**Step 5：觀察**

```
指令：kubectl get hpa -w
指令：kubectl get pods -w
```

CPU 超過 50% 後 REPLICAS 開始增加。停止壓測後等 5 分鐘，REPLICAS 縮回 2。

```
指令：kubectl describe hpa nginx-resource-demo
```

Events 裡看到 `New size: 3; reason: cpu resource utilization above target` 和 `New size: 2; reason: All metrics below target`。

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
