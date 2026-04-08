# Loop 3 指令速查 — 滾動更新 + 回滾（5-6, 5-7, 5-8）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## 前提：確認 nginx-deploy 還在跑

```bash
kubectl get deployments
# 若沒有，先套用：kubectl apply -f nginx-deployment.yaml
```

---

## 5-7 實作示範指令

```bash
# 1. 確認目前版本
kubectl describe deployment nginx-deploy | grep Image
# 看到：Image: nginx:1.25

# 2. 觸發滾動更新（升到 1.28）
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
# 看到：deployment.apps/nginx-deploy image updated

# 3. 即時觀察更新進度
kubectl rollout status deployment/nginx-deploy
# 看到每一步的進度，最後 successfully rolled out

# 4. 觀察 RS 蹺蹺板（趁更新還沒完成時跑）
kubectl get rs
# 更新進行中：舊 RS DESIRED 在減少，新 RS DESIRED 在增加
# 更新完成：舊 RS DESIRED=0（物件還在），新 RS DESIRED=3

# 5. 查看更新歷史
kubectl rollout history deployment/nginx-deploy
# 看到：REVISION 1 和 2（CHANGE-CAUSE 預設是 <none>）

# 6. 補記更新說明
kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"
# 再查一次 history，CHANGE-CAUSE 欄位出現文字

# 7. 故意更新成壞掉的版本
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
# 看到：image updated（指令本身成功，但 Pod 會拉不到 image）

# 8. 觀察失敗的 Pod
kubectl get pods
# 看到：新 Pod STATUS = ImagePullBackOff，舊 Pod 還是 Running

# 9. 回滾到上一個版本
kubectl rollout undo deployment/nginx-deploy
# 看到：deployment.apps/nginx-deploy rolled back
kubectl get pods                                           # Pod 重新變 Running
kubectl describe deployment nginx-deploy | grep Image     # 確認 image 換回來了

# 10. 查看更新歷史，找到正確 revision 後精確回滾
kubectl rollout history deployment/nginx-deploy
kubectl rollout undo deployment/nginx-deploy --to-revision=1
# 看到：rolled back
kubectl describe deployment nginx-deploy | grep Image     # 驗證
```

---

## 5-8 Lab 2 解答（版本事故）

**準備環境（學生自己跑）：**

```bash
kubectl create deployment night-api --image=httpd:2.4 --replicas=2
kubectl annotate deployment night-api kubernetes.io/change-cause="v1: 正常版本"
kubectl rollout status deployment/night-api
kubectl set image deployment/night-api httpd=httpd:99.99.99
kubectl annotate deployment night-api kubernetes.io/change-cause="v2: 緊急更新（錯誤版本）" --overwrite
```

**解題步驟：**

```bash
# Step 1：確認 Pod 狀態
kubectl get pods
# 看到：新 Pod STATUS = ErrImagePull 或 ImagePullBackOff
kubectl get deploy
# 看到：READY 0/2 或 1/2

# Step 2：查部署歷史
kubectl rollout history deployment/night-api
# 看到：revision 1 = v1:正常版本，revision 2 = v2:錯誤版本

# Step 3：精確回滾到 revision 1（不准用 undo 不帶參數）
kubectl rollout undo deployment/night-api --to-revision=1
# 看到：deployment.apps/night-api rolled back

# Step 4：驗收
kubectl get pods                                          # 全部 Running
kubectl describe deployment night-api | grep Image       # Image: httpd:2.4
kubectl rollout history deployment/night-api             # 出現 revision 3

# 清理
kubectl delete deployment night-api
```
