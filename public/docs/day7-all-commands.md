# Day 7 Loop 1–4 完整指令清單

---

## Loop 1 — HPA 自動擴縮

```bash
# 環境準備：清掉第六堂的 release
helm uninstall monitoring -n default
helm uninstall my-app -n default
helm uninstall my-blog -n default
helm uninstall my-ingress -n default
kubectl delete all --all -n default
kubectl delete pvc --all -n default
kubectl get pods -n default

# Step 0：確認 metrics-server
kubectl get pods -n kube-system -l k8s-app=metrics-server
kubectl top nodes
kubectl top pods

# Step 1：部署 Deployment + Service
kubectl apply -f ~/workspace/k8s-course-labs/lesson7/nginx-resource-demo.yaml
kubectl get deploy nginx-resource-demo
kubectl get svc nginx-resource-svc

# Step 2：建 HPA
kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu=50%
kubectl get hpa

# Step 3：壓測（另開終端機）
kubectl run load-test --image=busybox:1.36 --rm -it \
  --restart=Never -- \
  sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"

# Step 4：觀察擴容（原本終端機）
kubectl get hpa -w
kubectl get pods -l app=nginx-resource -w

# Step 5：停止壓測（Ctrl+C），等 5 分鐘，觀察縮容
kubectl get hpa -w

# 看 Events 確認擴縮紀錄
kubectl describe hpa nginx-resource-demo
```

---

## Loop 2 — RBAC 權限控制

```bash
# Step 1：部署 RBAC 設定
kubectl apply -f ~/workspace/k8s-course-labs/lesson7/rbac-viewer.yaml

# Step 2：確認三個資源都建好
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding

# Step 3：模擬 viewer-sa 查看 Pod（應該成功）
kubectl get pods --as=system:serviceaccount:default:viewer-sa

# Step 4：模擬 viewer-sa 刪除 Pod（應該 Forbidden）
kubectl delete pod <任意pod名> --as=system:serviceaccount:default:viewer-sa

# Step 5：快速確認權限
kubectl auth can-i get pods --as=system:serviceaccount:default:viewer-sa
kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa

# Step 6：列出這個身份能做的所有事（權限稽核）
kubectl auth can-i --list --as=system:serviceaccount:default:viewer-sa
```

---

## Loop 3 — Probe 健康檢查

```bash
# Step 1：部署
kubectl apply -f ~/workspace/k8s-course-labs/lesson7/deployment-probe.yaml

# Step 2：確認 Pod 狀態
kubectl get pods -l app=nginx-probe

# Step 3：確認 Probe 設定
kubectl describe pods -l app=nginx-probe | grep -A10 "Liveness\|Readiness"

# Step 4：取得 Pod 名稱
POD_NAME=$(kubectl get pods -l app=nginx-probe -o jsonpath='{.items[0].metadata.name}')
echo $POD_NAME

# Step 5：刪掉 index.html，觸發 Liveness 失敗
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html

# Step 6：觀察重啟（等 30 秒內 RESTARTS +1）
kubectl get pods -l app=nginx-probe -w

# Step 7：看 Events 確認原因
kubectl describe pod $POD_NAME
```

---

## Loop 4 — 從零建完整系統

```bash
# ── 環境確認 ──
kubectl get nodes
kubectl get nodes -w

# ── 基礎層 ──
cd ~/workspace/k8s-course-labs/lesson7

kubectl apply -f 00-namespace.yaml

kubectl apply -f 01-secret.yaml
kubectl get secret app-secrets -n tasks

kubectl apply -f 02-configmap.yaml

kubectl apply -f 03-mysql.yaml
kubectl wait pod/mysql-0 -n tasks --for=condition=Ready --timeout=120s
kubectl exec -it mysql-0 -n tasks -- mysql -uroot -p"MyMysqlP@ssw0rd" -D taskdb

kubectl apply -f 04-redis.yaml
kubectl get pods -n tasks -l app=redis
kubectl exec deploy/redis -n tasks -- redis-cli -a MyRedisP@ssw0rd ping

# 巡堂驗收 1（六項都要綠）
kubectl get namespace tasks
kubectl get secret app-secrets -n tasks
kubectl get configmap app-config -n tasks
kubectl get statefulset -n tasks
kubectl get pvc -n tasks
kubectl get pods -n tasks

# ── 資料層 ──
kubectl apply -f 05-db-migrate-job.yaml
kubectl get job -n tasks
kubectl logs job/db-migrate -n tasks

kubectl apply -f 06-rbac.yaml

# ── 應用層 ──
kubectl apply -f 07-backend.yaml
kubectl get pods -n tasks -l app=backend
kubectl port-forward service/backend-service 3000:3000 -n tasks
# 另開終端機：curl localhost:3000/health

kubectl apply -f 08-frontend.yaml
kubectl get pods -n tasks -l app=frontend

kubectl apply -f 09-task-runner.yaml
kubectl get pods -n tasks -l app=task-runner

kubectl apply -f 10-cronjob.yaml
kubectl get cronjob -n tasks
kubectl get job -n tasks

kubectl apply -f 11-hpa.yaml
kubectl get hpa -n tasks

kubectl apply -f 12-ingress.yaml
kubectl get ingress -n tasks

# ── 最終驗收 ──
kubectl get all -n tasks

# ① MySQL tasks table 存在
kubectl exec mysql-0 -n tasks -- mysql -uroot -p"MyMysqlP@ssw0rd" -D taskdb -e "SHOW TABLES;"

# ② Redis 有密碼保護
kubectl exec deploy/redis -n tasks -- redis-cli -a MyRedisP@ssw0rd ping

# ③ Migration log
kubectl logs job/db-migrate -n tasks

# ④ RBAC 最小權限驗證
kubectl auth can-i get configmaps --as=system:serviceaccount:tasks:backend-sa -n tasks
kubectl auth can-i delete pods --as=system:serviceaccount:tasks:backend-sa -n tasks
kubectl auth can-i get secrets --as=system:serviceaccount:tasks:backend-sa -n tasks

# ⑤ CronJob 觸發紀錄
kubectl logs -l app=task-scheduler -n tasks --tail=5

# ⑥ Task Runner 消費 Queue
kubectl logs -l app=task-runner -n tasks --tail=20
```
