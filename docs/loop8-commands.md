# Loop 8 指令速查 — 綜合實作 + 今日總結（下午 5-20, 5-21）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## YAML 檔案準備

**建立 `full-stack.yaml`（課前先備好）**

```yaml
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: fullstack-demo
---
# Frontend Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: fullstack-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
---
# Frontend Service（NodePort）
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: fullstack-demo
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
---
# API Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: fullstack-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: httpd
          image: httpd:2.4
          ports:
            - containerPort: 80
---
# API Service（ClusterIP）
apiVersion: v1
kind: Service
metadata:
  name: api-svc
  namespace: fullstack-demo
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 80
---
# DaemonSet（log-collector）
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
  namespace: fullstack-demo
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: log-agent
          image: busybox:1.36
          command: ["sh", "-c", "while true; do echo 'collecting logs...'; sleep 60; done"]
```

---

## 綜合實作示範指令

```bash
# 1. 套用整個 fullstack 架構
kubectl apply -f full-stack.yaml
# 看到：6 行 created（namespace / 2 deployment / 2 service / 1 daemonset）

# 2. 確認 fullstack-demo namespace 所有資源
kubectl get all -n fullstack-demo
# 看到：4 個 Pod Running / 2 個 Service / 2 個 Deployment

# 3. 查看 Pod 分布在哪些 Node
kubectl get pods -o wide -n fullstack-demo
# 觀察：frontend 和 api Pod 分散到不同 Node / log-collector 每個 Node 各一個

# 4. 取得 Node IP
kubectl get nodes -o wide
# 或：
multipass info k3s-worker1 | grep IPv4

# 5. 從外部 curl 前端（驗證 NodePort）
curl http://<node-ip>:30080
# 看到：Welcome to nginx!（外部 → Node:30080 → frontend-svc → frontend Pod 通了）

# 6. 取得 frontend Pod 名稱
kubectl get pods -n fullstack-demo | grep frontend

# 7. 從 frontend Pod 內 curl api-svc（驗證 ClusterIP + DNS 短名稱）
kubectl exec -it frontend-<hash>-<suffix> -n fullstack-demo -- curl http://api-svc
# 看到：It works!（Apache httpd 預設首頁）
# ✅ 代表：frontend Pod 用短名稱 api-svc 成功找到 api Service！

# 8. DNS 解析驗證（在 fullstack-demo namespace 跑 nslookup）
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc
# 看到：Server = CoreDNS IP / api-svc 被解析到 api-svc.fullstack-demo.svc.cluster.local

# 9. 確認 DaemonSet 狀態
kubectl get ds -n fullstack-demo
# 看到：DESIRED = Node 數量

# 10. 清理 fullstack-demo Namespace（一鍵刪除所有東西）
kubectl delete namespace fullstack-demo
# 看到：namespace "fullstack-demo" deleted
# 注意：需要 30 秒到 2 分鐘才完成

# 11. 清理 default namespace 殘留資源
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc

# 12. 確認叢集清理乾淨
kubectl get all
# 看到：只剩 service/kubernetes 這個內建 Service
```

---

## 今日完整指令快速複習

```bash
# ===== ClusterIP =====
kubectl apply -f service-clusterip.yaml
kubectl get svc
kubectl describe svc nginx-svc
kubectl get ep nginx-svc
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
# (Pod 內) curl http://nginx-svc

# ===== NodePort =====
kubectl apply -f service-nodeport.yaml
kubectl get svc                                           # 看 PORT(S) 欄位
kubectl get nodes -o wide                                 # 取得 Node IP
curl http://<node-ip>:30080
kubectl delete svc nginx-nodeport

# ===== CoreDNS + Namespace =====
kubectl get pods -n kube-system | grep dns
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
kubectl apply -f namespace-practice.yaml
kubectl get ns
kubectl create deployment nginx-dev --image=nginx:1.27 -n dev
kubectl get pods -n dev
kubectl get deployments -A
kubectl expose deployment nginx-dev --port=80 --type=ClusterIP -n dev
kubectl run cross-test --image=busybox --rm -it --restart=Never \
  -- wget -qO- http://nginx-dev.dev.svc.cluster.local
kubectl delete namespace dev staging
kubectl config set-context --current --namespace=dev
kubectl config view --minify | grep namespace

# ===== DaemonSet =====
kubectl apply -f daemonset.yaml
kubectl get ds
kubectl describe daemonset log-collector
kubectl get pods -o wide

# ===== CronJob =====
kubectl apply -f cronjob.yaml
kubectl get cj
kubectl get jobs
kubectl get pods                                          # 看 Completed 狀態
kubectl logs <job-pod-name>
kubectl delete cronjob hello-cron

# ===== 綜合實作 =====
kubectl apply -f full-stack.yaml
kubectl get all -n fullstack-demo
kubectl get pods -o wide -n fullstack-demo
curl http://<node-ip>:30080
kubectl exec -it <frontend-pod> -n fullstack-demo -- curl http://api-svc
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it \
  --restart=Never -- nslookup api-svc
kubectl get ds -n fullstack-demo
kubectl delete namespace fullstack-demo
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
kubectl get all                                           # 確認乾淨
```
