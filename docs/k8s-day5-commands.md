# 第五堂課學員練習指令清單

> 每個 Loop 的學員實作，具體要打的指令

---

## Loop 1：擴縮容（5-4 之後）

### 必做 1：scale 擴縮

```bash
kubectl create deployment httpd-deploy --image=httpd:2.4 --replicas=2
kubectl get pods -o wide
kubectl scale deployment httpd-deploy --replicas=5
kubectl get pods -o wide
kubectl scale deployment httpd-deploy --replicas=1
kubectl get pods
```

### 必做 2：scale 到 0 再回來

```bash
kubectl scale deployment httpd-deploy --replicas=0
kubectl get deploy              # READY 0/0，Deployment 還在
kubectl get pods                 # 空了
kubectl scale deployment httpd-deploy --replicas=3
kubectl get pods                 # Pod 又回來了
```

### 必做 3：預告體驗 — 模擬自動擴縮

```bash
# 終端 1（不要關）
kubectl get pods -w

# 終端 2（每次等 5 秒）
kubectl scale deployment httpd-deploy --replicas=5
kubectl scale deployment httpd-deploy --replicas=8
kubectl scale deployment httpd-deploy --replicas=10
kubectl scale deployment httpd-deploy --replicas=3

# 清理
kubectl delete deployment httpd-deploy
```

---

## Loop 2：滾動更新 + 回滾（5-7 之後）

### 必做 1：滾動更新

```bash
# 確認目前版本
kubectl describe deployment my-nginx | grep Image

# 改 YAML 的 image 從 nginx:1.26 → nginx:1.27
vim deployment.yaml

# 終端 1（觀察 Pod 逐步替換）
kubectl get pods -w

# 終端 2（觸發更新）
kubectl apply -f deployment.yaml
kubectl rollout status deployment/my-nginx

# 驗證
kubectl get rs                   # 兩個 ReplicaSet
kubectl describe deployment my-nginx | grep Image   # nginx:1.27
```

### 必做 2：回滾

```bash
kubectl rollout undo deployment/my-nginx
kubectl rollout status deployment/my-nginx
kubectl describe deployment my-nginx | grep Image   # 回到 1.26
```

### 必做 3：不存在的版本（觀察保護機制）

```bash
# 改 YAML image 為 nginx:99.99（不存在）
vim deployment.yaml
kubectl apply -f deployment.yaml
kubectl get pods                 # 舊 Pod 還在！新 Pod 卡 ImagePullBackOff
kubectl rollout undo deployment/my-nginx   # 救回來
kubectl get pods                 # 恢復正常
```

### 挑戰：rollout history + 跳回指定版本

```bash
# 做三次更新
# 改 image → 1.27 → apply
# 改 image → 1.28 → apply
kubectl rollout history deployment/my-nginx
kubectl rollout undo deployment/my-nginx --to-revision=1   # 跳回 1.26
kubectl describe deployment my-nginx | grep Image
```

---

## Loop 3：自我修復 + Labels（5-10 之後）

### 必做 1：自我修復 + 觀察調度

```bash
kubectl get pods -o wide         # 記下每個 Pod 在哪個 Node
kubectl delete pod <其中一個 Pod 名字>
kubectl get pods -o wide         # 新 Pod 跑到哪個 Node 了？
# K8s 不保證補回同一台，Scheduler 重新決定
```

### 必做 2：Labels 篩選

```bash
kubectl get pods -l app=nginx    # 只列出你的 Pod
kubectl get pods -A -l app       # 所有 Namespace 有 app 標籤的
# 思考：十個團隊各自部署，Labels 怎麼幫你找到自己的？
```

### 必做 3：Labels 認親機制證明

```bash
kubectl get pods                 # 3 個
kubectl label pod <其中一個 Pod 名字> app=hacked --overwrite
kubectl get pods                 # 變 4 個！Deployment 補了一個新的
kubectl get pods --show-labels   # 3 個 app=nginx + 1 個 app=hacked

# 改回來
kubectl label pod <那個 Pod 名字> app=nginx --overwrite
kubectl get pods                 # 回到 3 個（Deployment 砍掉多的）
```

---

## Loop 4：ClusterIP Service（5-13 之後）

### 必做：httpd + ClusterIP Service

```bash
kubectl create deployment httpd-deploy --image=httpd:2.4 --replicas=2

# 建 Service（或用 YAML）
kubectl expose deployment httpd-deploy --port=80 --name=httpd-svc
kubectl get svc httpd-svc
kubectl get endpoints httpd-svc

# 用 busybox 驗證
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- httpd-svc
# 看到 It works!
```

### 挑戰：endpoints 跟著 scale 變

```bash
kubectl get endpoints httpd-svc  # 2 個 IP
kubectl scale deployment httpd-deploy --replicas=4
kubectl get endpoints httpd-svc  # 4 個 IP
kubectl scale deployment httpd-deploy --replicas=2

# 清理
kubectl delete deployment httpd-deploy
kubectl delete svc httpd-svc
```

---

## Loop 5：NodePort（5-16 之後）

### 必做：NodePort Service

```bash
# 查 Node IP
kubectl get nodes -o wide

# 建 NodePort Service（或用 YAML）
kubectl expose deployment my-nginx --type=NodePort --port=80 --name=nginx-nodeport
kubectl get svc nginx-nodeport   # 看 NodePort 號碼（3xxxx）

# 從外部連
curl <Node-IP>:<NodePort>        # 看到 Welcome to nginx
```

### 挑戰：ClusterIP + NodePort 兩條路都通

```bash
# ClusterIP 已經有了（nginx-svc）
# NodePort 剛建（nginx-nodeport）

# 叢集內（走 ClusterIP）
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- nginx-svc

# 叢集外（走 NodePort）
curl <Node-IP>:<NodePort>

# 兩條路都看到 Welcome to nginx
```

---

## Loop 6：DNS + Namespace（5-19 之後）

### 必做：跨 Namespace DNS

```bash
kubectl create namespace dev
kubectl create deployment httpd-deploy --image=httpd:2.4 --replicas=2 -n dev
kubectl expose deployment httpd-deploy --port=80 --name=httpd-svc -n dev

# 從 default 跨 Namespace 連
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- httpd-svc.dev.svc.cluster.local
# 看到 It works!

kubectl get all -n dev
```

### 挑戰：dev vs prod 不同版本

```bash
kubectl create namespace prod
kubectl create deployment nginx-deploy --image=nginx:1.26 -n dev
kubectl create deployment nginx-deploy --image=nginx:1.27 -n prod
kubectl expose deployment nginx-deploy --port=80 --name=nginx-svc -n dev
kubectl expose deployment nginx-deploy --port=80 --name=nginx-svc -n prod

# 分別 curl 驗證版本不同
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- nginx-svc.dev.svc.cluster.local
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- nginx-svc.prod.svc.cluster.local

# 清理
kubectl delete namespace dev prod
```

---

## Loop 7：DaemonSet + CronJob（5-22 之後）

### 必做：DaemonSet + CronJob

```bash
# DaemonSet
kubectl apply -f daemonset.yaml
kubectl get pods -o wide         # 每個 Node 都有一個
kubectl logs <任一 Pod 名字>      # 看到 collecting logs

# CronJob
kubectl apply -f cronjob.yaml
kubectl get cronjobs
# 等 1 分鐘...
kubectl get jobs                 # 看到 Job 出現
kubectl get pods                 # 看到 Completed 的 Pod
kubectl logs <Completed Pod 名字> # 看到 Hello from CronJob!

# 清理
kubectl delete daemonset log-collector
kubectl delete cronjob hello-cron
```

### 挑戰：改 schedule

```bash
# 改 cronjob.yaml 的 schedule 為 '*/2 * * * *'
kubectl apply -f cronjob.yaml
# 觀察：Job 每 2 分鐘才出現一個
```

---

## Loop 8：綜合實作（5-25）

### 必做：從零到完整服務 10 步驟

```bash
# 1. 建 Namespace
kubectl create namespace my-app

# 2. 建 Deployment
kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app

# 3. 建 ClusterIP Service
kubectl expose deployment nginx-deploy --port=80 -n my-app

# 4. 驗證叢集內連線
kubectl run test-box --image=busybox:1.36 --rm -it -n my-app -- wget -qO- nginx-deploy

# 5. 建 NodePort Service
kubectl expose deployment nginx-deploy --type=NodePort --port=80 --name=nginx-nodeport -n my-app
kubectl get svc -n my-app

# 6. 從外部連
curl <Node-IP>:<NodePort>

# 7. 擴縮容
kubectl scale deployment nginx-deploy --replicas=5 -n my-app
kubectl get pods -n my-app -o wide
kubectl scale deployment nginx-deploy --replicas=3 -n my-app

# 8. 滾動更新
# 改 YAML image → nginx:1.28 → apply -n my-app
kubectl rollout status deployment/nginx-deploy -n my-app

# 9. 回滾
kubectl rollout undo deployment/nginx-deploy -n my-app
kubectl describe deployment nginx-deploy -n my-app | grep Image

# 10. 清理
kubectl delete namespace my-app
```

### 挑戰 1：同時部署兩個服務

```bash
kubectl create namespace my-app
kubectl create deployment frontend --image=nginx:1.27 -n my-app
kubectl create deployment api --image=httpd:2.4 -n my-app
kubectl expose deployment frontend --type=NodePort --port=80 --name=frontend-svc -n my-app
kubectl expose deployment api --type=NodePort --port=80 --name=api-svc -n my-app
kubectl get svc -n my-app
curl <Node-IP>:<frontend NodePort>
curl <Node-IP>:<api NodePort>
```

### 挑戰 2：跨 Namespace DNS

```bash
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- frontend-svc.my-app.svc.cluster.local
kubectl run test-box --image=busybox:1.36 --rm -it -- wget -qO- api-svc.my-app.svc.cluster.local
```

---

