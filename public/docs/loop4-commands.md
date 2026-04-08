# Loop 4 指令速查 — 自我修復 + Labels 進階（5-9, 5-10, 5-11）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## 前提：確認 nginx-deploy 還在跑（replicas=3）

```bash
kubectl get deployments
# 若沒有，先套用 nginx-deployment.yaml
```

---

## 5-10 實作示範指令

```bash
# 1. 查看 Pod 的所有 Labels
kubectl get pods --show-labels
# 看到：LABELS 欄位包含 app=nginx 和 pod-template-hash=xxxxx

# 2. 手動給某個 Pod 加 Label
kubectl get pods                                          # 先記下 Pod 名稱
kubectl label pod nginx-deploy-<hash>-<suffix> env=test
# 看到：pod/nginx-deploy-xxx labeled

# 3. 再看 labels，確認多了 env=test
kubectl get pods --show-labels
# 那個 Pod 的 LABELS 多了 env=test

# 4. 用 Label 過濾 Pod（篩 app=nginx）
kubectl get pods -l app=nginx
# 看到：3 個 nginx-deploy Pod

# 5. 用 Label 過濾 Pod（篩剛才手動加的 env=test）
kubectl get pods -l env=test
# 看到：只有那一個 Pod

# 6. 觀察自我修復（刪 Pod）
kubectl delete pod nginx-deploy-<hash>-<suffix>
kubectl get pods
# 立刻看！新 Pod AGE=2s 冒出來，NAME 末尾不同

# 7. 查看 Deployment 的 Selector 設定
kubectl describe deployment nginx-deploy
# 重點看：Selector: app=nginx / Pod Template Labels: app=nginx

# 8. 用 Label 批次刪除所有 Pod（強制全部重啟）
kubectl get pods -l app=nginx                             # 先確認要刪的
kubectl delete pod -l app=nginx
# 看到：3 行 deleted
kubectl get pods                                          # 新 Pod 正在 ContainerCreating
```

---

## 5-10 Lab 3 解答（除錯工程師——孤兒 Pod）

**任務：把問題 Pod 孤兒化，不中斷服務，同時調查**

```bash
# Step 1：確認 Pod + 看 labels
kubectl get pods --show-labels
# 記下一個 Pod 名稱，例如 nginx-deploy-xxx-aaa

# Step 2：改 label，孤兒化
kubectl label pod nginx-deploy-xxx-aaa app=isolated --overwrite
# 看到：pod/nginx-deploy-xxx-aaa labeled

# Step 3：觀察
kubectl get pods --show-labels
# 看到 4 個 Pod：3 個 app=nginx（含新補的）+ 1 個 app=isolated
kubectl get deploy
# READY 仍然 3/3（Deployment 已自動補一個新 Pod）

# Step 4：調查孤兒 Pod
kubectl describe pod nginx-deploy-xxx-aaa
# 重點看：Node（在哪個 Node）/ Labels（確認 app=isolated）/ Events

# Step 5：清理孤兒 Pod
kubectl delete pod nginx-deploy-xxx-aaa
kubectl get pods                                          # 回到 3 個
```

---

## 5-11 上午小測驗解答

**第 1 題：完整更新流程**

```bash
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
kubectl rollout status deployment/nginx-deploy
kubectl describe deployment nginx-deploy | grep Image
# 加分：
kubectl get rs
kubectl rollout history deployment/nginx-deploy
```

**第 4 題：批次刪除 + 驗證自我修復**

```bash
kubectl get pods -l app=api
kubectl delete pod -l app=api
kubectl get pods
kubectl get pods -l app=api
```
