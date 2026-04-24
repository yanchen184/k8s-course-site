# Day 7 Loop 2/3/4 指令稽核

> 對照 PPT（slides tsx）與實際執行需求，標出多餘（❌）與缺少（⚠️）的指令。

---

## Loop 2 — RBAC（PPT 可見指令）

```bash
kubectl apply -f rbac-viewer.yaml
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding
kubectl get pods --as=system:serviceaccount:default:viewer-sa
kubectl delete pod <任意pod名> --as=system:serviceaccount:default:viewer-sa
kubectl auth can-i get pods --as=system:serviceaccount:default:viewer-sa
kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa
```

### 問題
- ⚠️ **缺少** `kubectl auth can-i --list --as=system:serviceaccount:default:viewer-sa`（列出所有權限，教學上很有用）
- ⚠️ **缺少** cleanup：`kubectl delete -f rbac-viewer.yaml`

---

## Loop 3 — Probe（PPT 可見指令）

```bash
kubectl apply -f deployment-probe.yaml
kubectl get pods -l app=nginx-probe
kubectl describe pods -l app=nginx-probe | grep -A10 "Liveness\|Readiness"
POD_NAME=$(kubectl get pods -l app=nginx-probe -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
kubectl get pods -l app=nginx-probe -w
```

### 問題
- ⚠️ **缺少** `kubectl describe pod $POD_NAME`（看 Events 確認 Liveness probe failed，這是 Loop 3 最重要的驗收）
- ⚠️ **缺少** cleanup：`kubectl delete -f deployment-probe.yaml`

---

## Loop 4 — 從零建系統（PPT 可見指令）

```bash
# 環境確認
kubectl get nodes
kubectl get nodes -w

# namespace
kubectl apply -f 00-namespace.yaml

# Secret + ConfigMap
kubectl apply -f 01-secret.yaml
kubectl get secret app-secrets -n tasks
kubectl apply -f 02-configmap.yaml

# MySQL（StatefulSet）
# ❌ 缺少 kubectl apply -f 03-mysql.yaml
kubectl wait pod/mysql-0 --for=condition=Ready -n tasks --timeout=120s
kubectl exec -it mysql-0 -n tasks -- mysql -uroot -p"MyMysqlP@ssw0rd" -D taskdb

# Redis
# ❌ 缺少 kubectl apply -f 04-redis.yaml

# 巡堂驗收 1
kubectl get namespace tasks
kubectl get secret app-secrets -n tasks
kubectl get configmap app-config -n tasks
kubectl get statefulset -n tasks
kubectl get pvc -n tasks
kubectl get pods -n tasks

# DB Migration Job
kubectl apply -f 05-db-migrate-job.yaml
kubectl get job -n tasks
kubectl logs job/db-migrate -n tasks

# RBAC
kubectl apply -f 06-rbac.yaml

# Backend
kubectl apply -f 07-backend.yaml
kubectl get pods -n tasks -l app=backend

# Frontend + Task Runner
# ❌ 缺少 kubectl apply -f 08-frontend.yaml
# ❌ 缺少 kubectl apply -f 09-task-runner.yaml

# CronJob
kubectl apply -f 10-cronjob.yaml
kubectl get cronjob -n tasks
kubectl get job -n tasks

# HPA
kubectl apply -f 11-hpa.yaml
kubectl get hpa -n tasks

# Ingress
# ❌ 缺少 kubectl apply -f 12-ingress.yaml

# 巡堂驗收 2（最終）
kubectl get all -n tasks
kubectl exec mysql-0 -n tasks -- mysql -uroot -p"MyMysqlP@ssw0rd" -D taskdb -e "SHOW TABLES;"
kubectl exec deploy/redis -n tasks -- redis-cli -a MyRedisP@ssw0rd ping
kubectl logs job/db-migrate -n tasks
kubectl auth can-i get configmaps --as=system:serviceaccount:tasks:backend-sa -n tasks
kubectl auth can-i delete pods --as=system:serviceaccount:tasks:backend-sa -n tasks
kubectl auth can-i get secrets --as=system:serviceaccount:tasks:backend-sa -n tasks
kubectl logs -l app=task-scheduler -n tasks --tail=5
kubectl logs -l app=task-runner -n tasks --tail=20
curl -H "Host: task.local" http://<Node-IP>/api/tasks
```

### 問題
| 狀態 | 指令 | 說明 |
|------|------|------|
| ⚠️ 缺少 | `kubectl apply -f 03-mysql.yaml` | MySQL StatefulSet 沒有 apply，但後面直接用 mysql-0 |
| ⚠️ 缺少 | `kubectl apply -f 04-redis.yaml` | Redis 完全沒出現在 PPT |
| ⚠️ 缺少 | `kubectl apply -f 08-frontend.yaml` | Frontend Deployment 沒有 apply |
| ⚠️ 缺少 | `kubectl apply -f 09-task-runner.yaml` | Task Runner 沒有 apply |
| ⚠️ 缺少 | `kubectl apply -f 12-ingress.yaml` | Ingress 最後沒有 apply，但有驗收 curl |
| ⚠️ 缺少 | `kubectl port-forward service/backend-service 3000:3000 -n tasks` | backend 驗收需要這行才能 curl |
| ⚠️ 缺少 | `curl localhost:3000/health` | 配合上面 port-forward 驗收 backend |

---

## 總結

### Loop 4 缺少的 apply（最嚴重）
學員看到 PPT 跑指令，但這幾個 yaml 完全沒有出現，服務根本起不來：

```bash
kubectl apply -f 03-mysql.yaml
kubectl apply -f 04-redis.yaml
kubectl apply -f 08-frontend.yaml
kubectl apply -f 09-task-runner.yaml
kubectl apply -f 12-ingress.yaml
```

### 建議修正
把 Loop 4 的 apply 順序在 PPT 上明確標出，每個 yaml 對應一張 slide 或整合進巡堂驗收前的 checklist。
