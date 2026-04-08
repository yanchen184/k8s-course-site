# Loop 2 指令速查 — Deployment 擴縮容（5-3, 5-4, 5-5）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## YAML 檔案準備

**建立 `nginx-deployment.yaml`（課前先備好）**

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deploy
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
```

---

## 5-4 實作示範指令

```bash
# 1. 套用 Deployment
kubectl apply -f nginx-deployment.yaml
# 看到：deployment.apps/nginx-deploy created

# 2. 查看 Deployment 狀態
kubectl get deployments
# 看到：NAME / READY 3/3 / UP-TO-DATE 3 / AVAILABLE 3

# 3. 查看 ReplicaSet
kubectl get replicasets
# 看到：nginx-deploy-xxxxxxxx  DESIRED 3 CURRENT 3 READY 3

# 4. 查看 Pod 列表
kubectl get pods
# 看到：3 個 nginx-deploy-xxx-xxx  Running

# 5. 看 Pod 在哪個 Node
kubectl get pods -o wide
# 看到：NODE 欄位顯示 Pod 分散到不同 Node

# 6. 查看詳細資訊
kubectl describe deployment nginx-deploy
# 重點看：Replicas / StrategyType / Events

# 7. 刪一個 Pod，測試自我修復
kubectl get pods                                        # 先記下 Pod 名稱
kubectl delete pod nginx-deploy-<hash>-<suffix>        # 刪掉它
kubectl get pods                                        # 立刻看！新 Pod AGE=2s 冒出來

# 8. 擴容到 5
kubectl scale deployment nginx-deploy --replicas=5
# 看到：deployment.apps/nginx-deploy scaled
kubectl get pods                                        # 看到 5 個 Pod

# 9. 縮容回 3
kubectl scale deployment nginx-deploy --replicas=3
kubectl get pods                                        # 看到 2 個 Terminating，最後剩 3 個
```

---

## 5-5 Lab 1 解答（你被叫去救火）

**有問題的 YAML（Bug 1 + Bug 2）：**

```yaml
# api-service.yaml（有問題版本）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 1                  # Bug 2：應該是 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: backend           # Bug 1：應該是 api
    spec:
      containers:
      - name: api
        image: nginx:1.25
```

**修好後的 YAML（部分）：**

```yaml
spec:
  replicas: 3          # 修這裡
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api       # 修這裡，和 selector 一致
```

**修好後操作：**

```bash
# 修改 api-service.yaml 後重新 apply
kubectl apply -f api-service.yaml

# 驗收 replicas
kubectl get deploy          # READY: 3/3

# 擴容 + 確認分散
kubectl scale deployment api-service --replicas=5
kubectl get pods -o wide    # 看 NODE 欄位

# 清理
kubectl delete deployment api-service
```
