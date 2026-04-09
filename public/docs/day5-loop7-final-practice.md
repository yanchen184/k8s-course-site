# Day 5 5-17 到 5-18：綜合實作 + 今日總結

---

## 5-17 綜合實作（45 分鐘）

### 📄 第 26 張：綜合實作：情境 + 目標架構（5 min）

### ① 課程內容

**情境**

今天學了一堆零件：ClusterIP、NodePort、DNS、Namespace、DaemonSet、CronJob。
現在要把它們全部串成一個完整的服務架構，模擬真實工作場景的部署流程。

**目標架構**

```
外部瀏覽器 → NodePort(:30080)
    → frontend-svc → frontend Deployment (nginx x2)
    → api-svc (ClusterIP) → api Deployment (httpd x2)
+ log-collector DaemonSet（每個 Node 各 1 個）
全在 fullstack-demo Namespace 內
```

**知識點對照**

| 架構元素 | 對應知識點 |
|---------|-----------|
| frontend NodePort | Loop 5：NodePort 對外 |
| api ClusterIP | Loop 4：ClusterIP 內部通訊 |
| curl api-svc | Loop 6：DNS 短名稱 |
| fullstack-demo ns | Loop 6：Namespace 隔離 |
| log-collector | Loop 7：DaemonSet |

**完整 YAML（full-stack.yaml）**

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

### ② 指令講解

（本張為情境說明，操作在下一張）

### ③④ 題目 + 解答

（無）

---

### 📄 第 27 張：綜合實作 Step 1-3：建環境（7 min）

### ① 課程內容

用一個 full-stack.yaml 一次建好整個架構：Namespace、兩組 Deployment + Service、一個 DaemonSet，共 6 個資源。

**Step 1：一次套用所有資源**

```bash
kubectl apply -f full-stack.yaml
```

YAML 內 6 個資源用 `---` 分隔，一個指令全部建好。

**Step 2：確認所有資源**

```bash
kubectl get all -n fullstack-demo
```

所有 Pod Running、兩個 Service 建立完成。

**Step 3：看 Pod 分布**

```bash
kubectl get pods -o wide -n fullstack-demo
```

frontend/api 分散不同 Node，log-collector 每 Node 各一個。

### ② 指令講解

**kubectl apply -f full-stack.yaml**

- 用途：一次套用所有資源（YAML 內多個資源用 `---` 分隔）
- 打完要看：每一行都是 created，例如：
  ```
  namespace/fullstack-demo created
  deployment.apps/frontend created
  service/frontend-svc created
  deployment.apps/api created
  service/api-svc created
  daemonset.apps/log-collector created
  ```
- 異常：`namespaces "fullstack-demo" already exists` → 可忽略或先刪除 namespace

**kubectl get all -n fullstack-demo**

- 用途：確認 namespace 內所有資源（Pod、Deployment、Service）
- 打完要看：所有 Pod 都是 Running，兩個 Service 都建立完成
- 異常：Pod 持續 Pending → `kubectl describe pod` 看原因

**kubectl get pods -o wide -n fullstack-demo**

- 用途：查看 Pod 分布在哪些 Node
- 打完要看：frontend 和 api 的 Pod 分散在不同 Node；log-collector 每個 Node 各一個

### ③④ 題目 + 解答

（無，本張為操作步驟）

---

### 📄 第 28 張：綜合實作 Step 4-6：驗證連線（7 min）

### ① 課程內容

三步驗證整個架構的連線：外部 NodePort、內部 ClusterIP + DNS、DNS 解析。

**Step 4：外部連 frontend（NodePort）**

```bash
curl http://<Node-IP>:30080
```

驗證 外部 → Node:30080 → frontend-svc → frontend Pod 整條路通。

**Step 5：內部連 api（ClusterIP + DNS）**

```bash
kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc
```

驗證 frontend Pod 用短名稱連 api-svc，ClusterIP + DNS 都通。

**Step 6：DNS 解析驗證**

```bash
kubectl run dns-check -n fullstack-demo --image=busybox:1.36 \
  --rm -it --restart=Never -- nslookup api-svc
```

親眼看到 CoreDNS 把 api-svc 翻成 ClusterIP。

### ② 指令講解

**curl http://[Node-IP]:30080**

- 用途：從外部驗證 NodePort 是否通
- 先取得 Node IP：`kubectl get nodes -o wide` 或 `multipass info k3s-worker1 | grep IPv4`
- 打完要看：nginx 預設首頁 HTML（Welcome to nginx!）
- 異常：Connection refused → nodePort 或 Node IP 填錯

**kubectl exec -n fullstack-demo \<frontend-pod\> -- curl http://api-svc**

- 用途：從 frontend Pod 內驗證能否連到 api-svc（ClusterIP + DNS）
- 先取得 Pod 名稱：`kubectl get pods -n fullstack-demo | grep frontend`
- 打完要看：Apache httpd 的預設首頁 "It works!"
- 異常：Could not resolve host: api-svc → 確認兩個資源都在同一個 namespace

**kubectl run dns-check -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc**

- 用途：DNS 解析驗證，確認 api-svc 能被解析到正確 ClusterIP
- 打完要看：`Name: api-svc / Address 1: 10.96.x.x api-svc.fullstack-demo.svc.cluster.local`

### ③④ 題目 + 解答

（無，本張為操作步驟）

---

### 📄 第 29 張：綜合實作 Step 7-10：生命周期（7 min）

### ① 課程內容

完成完整服務生命周期的後半段：擴容 → 滾動更新 → 回滾 → 清理。

**Step 7：擴容**

```bash
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
kubectl get pods -n fullstack-demo
```

Pod 從 2 變 5，Endpoints 自動更新。

**Step 8：滾動更新**

```bash
kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo
kubectl rollout status deployment/frontend -n fullstack-demo
```

Pod 逐一替換，服務不中斷。

**Step 9：回滾**

```bash
kubectl rollout undo deployment/frontend -n fullstack-demo
```

一個指令回到上一版。

**Step 10：清理**

```bash
kubectl delete namespace fullstack-demo
```

一行刪掉整個 namespace 和所有資源。

### ② 指令講解

**kubectl scale deployment frontend --replicas=5 -n fullstack-demo**

- 用途：將 frontend 從 2 副本擴展到 5 副本
- 打完要看：`kubectl get pods -n fullstack-demo` 看到 5 個 frontend Pod
- 延伸：`kubectl get ep frontend-svc -n fullstack-demo` 確認 Endpoints 從 2 變 5

**kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo**

- 用途：滾動更新 frontend 的 nginx 版本
- 打完要看：`kubectl rollout status` 顯示逐一替換
- 異常：ImagePullBackOff → image tag 打錯

**kubectl rollout undo deployment/frontend -n fullstack-demo**

- 用途：回滾到上一個版本
- 打完要看：Pod 逐一替換回 nginx:1.27

**kubectl delete namespace fullstack-demo**

- 用途：清理所有資源（一行刪掉 namespace 內所有東西）
- 打完要看：`namespace "fullstack-demo" deleted`
- 注意：刪除需要時間（30秒到2分鐘），先顯示 Terminating 再完成
- 高危操作：刪前務必確認 namespace 名稱正確

### ③④ 題目 + 解答

**Q1**：從 frontend Pod exec 進去，分別 curl `http://api-svc` 和 curl `http://api-svc.fullstack-demo.svc.cluster.local`，確認兩種都成功回傳 'It works!'。

操作：
```bash
kubectl get pods -n fullstack-demo | grep frontend    # 找 Pod 名稱
kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc
kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc.fullstack-demo.svc.cluster.local
```
驗收標準：兩個指令都回傳 'It works!'，驗證短名稱和 FQDN 等效

**Q2**：把 frontend Deployment 從 2 副本擴展到 5 副本，然後執行 `kubectl get endpoints frontend-svc -n fullstack-demo`，觀察 Endpoints 數量有沒有跟著增加。

操作：
```bash
kubectl get ep frontend-svc -n fullstack-demo    # 記下目前 Endpoints 數量
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
kubectl get pods -n fullstack-demo               # 等 Pod 都 Running
kubectl get ep frontend-svc -n fullstack-demo    # 觀察 Endpoints 變化
```
驗收標準：Endpoints 從 2 個 IP 增加到 5 個 IP，從外部 curl Node:30080 仍然成功

**Q3**：scale frontend 到 5 副本後，多連幾次 curl Node:30080，用 kubectl logs 分別看不同 frontend Pod，確認流量有被分散到不同 Pod。

操作：
```bash
for i in 1 2 3 4 5; do curl -s http://<Node-IP>:30080 -o /dev/null -w '%{http_code}\n'; done
kubectl logs <frontend-pod-1> -n fullstack-demo --tail=5
kubectl logs <frontend-pod-2> -n fullstack-demo --tail=5
```
驗收標準：多個 Pod 的 logs 都有出現 access log，驗證流量有被分散

---

### 📄 第 30 張：學員練習：你是新來的 K8s 工程師（20 min）

> 📋 學生看 PPT 投影片，上面有完整情境和任務說明。

### ① 課程內容

**情境**：你剛加入一間新創公司，主管交給你以下部署任務。所有資源建在 `my-app` namespace。

**任務 1：部署雙服務架構（必做）**

- **前端**：nginx:1.27，3 副本，外部要能用瀏覽器打開（NodePort 30080）
- **後端 API**：httpd:2.4，2 副本，只有前端能連到就好（ClusterIP）
- 驗收：curl Node-IP:30080 看到 nginx，從前端 Pod curl api-svc 看到 It works!

**任務 2：版本更新 + 回滾（必做）**

- PM 說前端要從 nginx:1.27 更新到 nginx:1.28
- 更新完發現 1.28 有 bug，立刻回滾到 1.27
- 驗收：rollout history 看到版本紀錄

**任務 3：運維需求（挑戰）**

- 運維說每台 Node 都要裝日誌收集器 → DaemonSet
- PM 說每分鐘要 health check 前端服務 → CronJob curl api-svc
- 驗收：DaemonSet Pod 數 = Node 數，CronJob logs 看到成功

清理：`kubectl delete namespace my-app`

### ② 參考指令（答案）

**任務 1：**

```bash
kubectl create namespace my-app
kubectl create deployment frontend --image=nginx:1.27 --replicas=3 -n my-app
kubectl expose deployment frontend --port=80 --type=NodePort --name=frontend-svc -n my-app
kubectl create deployment api --image=httpd:2.4 --replicas=2 -n my-app
kubectl expose deployment api --port=80 --name=api-svc -n my-app
kubectl get nodes -o wide
curl http://<Node-IP>:30080
kubectl exec -n my-app <frontend-pod> -- curl http://api-svc
```

**任務 2：**

```bash
kubectl set image deployment/frontend nginx=nginx:1.28 -n my-app
kubectl rollout status deployment/frontend -n my-app
kubectl rollout undo deployment/frontend -n my-app
kubectl rollout history deployment/frontend -n my-app
```

**任務 3：**

```bash
# DaemonSet（改 namespace: my-app）
kubectl apply -f daemonset.yaml
kubectl get ds -n my-app
kubectl get pods -o wide -n my-app -l app=log-collector

# CronJob（改 namespace: my-app，command 改 curl api-svc）
kubectl apply -f cronjob.yaml
kubectl get jobs -n my-app
kubectl logs <job-pod> -n my-app
```

**清理：**

```bash
kubectl delete namespace my-app
```

---

### 📄 第 31 張：Lab 8：從零建完整 Web 服務架構（20 min）

### ① 課程內容

本節為 Loop 8 的學生情境 Lab。完整整合今日所學：Deployment、ClusterIP、NodePort、CronJob。情境是從零建一個完整的 web 服務架構，包含外部存取和定時健康檢查。

**情境說明**

你需要從零建立一個完整的 web 服務架構，包含對外服務、內部通訊，以及定時健康檢查。

**任務清單**

1. 建立 nginx Deployment（3 副本）
2. 建 ClusterIP Service，讓叢集內部可以連
3. 建 NodePort Service（port 30088），讓外部可以連
4. 建 CronJob 每分鐘 curl nginx 做 health check
5. 驗證：`kubectl get all` 看到所有資源正常

**驗收標準**

- 3 個 nginx Pod 全部 Running
- 從測試 Pod curl nginx-svc 成功（ClusterIP）
- curl Node-IP:30088 看到 nginx 歡迎頁（NodePort）
- CronJob Pod 狀態 Completed，logs 有 Health check OK

**完整 YAML**

```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-web
  template:
    metadata:
      labels:
        app: nginx-web
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
---
# nginx-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP
  selector:
    app: nginx-web
  ports:
    - port: 80
      targetPort: 80
---
# nginx-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx-web
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30088
---
# health-check-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: health-check
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      ttlSecondsAfterFinished: 60
      template:
        spec:
          containers:
            - name: checker
              image: busybox:1.36
              command: ["sh", "-c",
                "wget -qO- http://nginx-svc && echo Health check OK"]
          restartPolicy: OnFailure
```

### ② 指令講解

**kubectl apply -f nginx-deployment.yaml**

- 打完要看：`deployment.apps/nginx-web created`

**kubectl apply -f nginx-clusterip.yaml**

- 打完要看：`service/nginx-svc created`

**kubectl apply -f nginx-nodeport.yaml**

- 打完要看：`service/nginx-nodeport created`

**kubectl apply -f health-check-cronjob.yaml**

- 打完要看：`cronjob.batch/health-check created`

**kubectl get all**

- 用途：一次確認所有資源
- 打完要看：3 個 Pod Running，2 個 Service，1 個 Deployment，CronJob 存在

**kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-svc**

- 用途：叢集內部 ClusterIP 驗證
- 打完要看：nginx 歡迎頁 HTML

**curl http://[Node-IP]:30088**

- 用途：外部 NodePort 驗證
- Node IP 取法：`kubectl get nodes -o wide`
- 打完要看：nginx 歡迎頁 HTML

**kubectl get jobs（等一分鐘後）**

- 打完要看：health-check-xxxxx 的 COMPLETIONS 1/1

**kubectl logs [health-check-pod-name]**

- 打完要看：nginx 歡迎頁 HTML + "Health check OK"

**清理指令**

```bash
kubectl delete deployment nginx-web && kubectl delete svc nginx-svc nginx-nodeport && kubectl delete cronjob health-check
```

### ③④ 題目 + 解答

**Q1**：在所有資源跑起來後，執行 `kubectl run dns-check --image=busybox:1.36 --rm -it --restart=Never -- nslookup nginx-svc`，確認 CronJob 的 Pod 能解析到 nginx-svc 的 ClusterIP。

操作：
```bash
kubectl run dns-check --image=busybox:1.36 --rm -it --restart=Never -- nslookup nginx-svc
# 在輸出中確認 Address 欄位有 ClusterIP
```
驗收標準：nslookup 回傳 nginx-svc 對應的 ClusterIP，驗證 CronJob Pod 能用短名稱找到 Service

**Q2**：修改 health-check CronJob 的 schedule 為 `'*/2 * * * *'`（每兩分鐘），apply 更新，觀察新 Job 觸發的間隔確實變長了。

操作：
```bash
# 把 schedule 改成 '*/2 * * * *'
kubectl apply -f health-check-cronjob.yaml
kubectl get cronjobs    # 確認 SCHEDULE 更新
# 等 2 分鐘
kubectl get jobs        # 觀察新 Job 出現的時間間隔
```
驗收標準：kubectl get jobs 顯示新 Job 之間的 LAST SCHEDULE 間隔約 2 分鐘

**Q3**：故意把 nginx-svc 的 selector 改錯（selector app: nginx-broken），apply 讓 Endpoints 變成空的，等 1 分鐘看 CronJob 的 log 顯示什麼 error，再修好 selector，確認下一次 CronJob 執行成功。

操作：
```bash
# 改錯 selector 後 apply
kubectl apply -f nginx-clusterip.yaml
kubectl get ep nginx-svc    # 確認變成 none
# 等 1 分鐘
kubectl get pods    # 找最新的 health-check Pod
kubectl logs <health-check-pod>    # 看 error 訊息
# 修好 selector 後 apply
kubectl apply -f nginx-clusterip.yaml
kubectl get ep nginx-svc    # 確認 Endpoints 恢復
# 等 1 分鐘
kubectl logs <next-health-check-pod>    # 確認成功
```
驗收標準：錯誤的 log 顯示連線失敗，修好後的 log 顯示 'Health check OK'

---

## 5-18 今日總結（15 分鐘）

### 📄 第 32 張：第五堂總結：因果鏈回顧（7 min）

### ① 課程內容

**今天的因果鏈**

1. 第四堂 Deployment 只有一個 Node → **k3s 多節點**
2. → 流量變了要調整 → **擴縮容**
3. → 新版本要上線 → **滾動更新**
4. → 新版有 bug → **回滾**
5. → Pod 掛了 → **自我修復**
6. → K8s 怎麼認 Pod？ → **Labels + Selector**
7. → 外面連不到 → **ClusterIP Service**
8. → 外面也要連 → **NodePort**
9. → 用 IP 太麻煩 → **DNS 服務發現**
10. → 環境要隔離 → **Namespace**
11. → 每台 Node 都要跑一份 → **DaemonSet**
12. → 定時跑任務 → **CronJob**
13. → 全部串起來 → **完整服務上線流程**

**今天新學的 kubectl 指令**

```
kubectl scale deployment <name> --replicas=N
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status / history / undo
kubectl get svc / endpoints
kubectl run <name> --image=<img> --rm -it --restart=Never -- <cmd>
kubectl expose deployment <name> --port=80
kubectl create namespace <name>
kubectl get <resource> -n <namespace> / -A
kubectl get daemonsets / cronjobs / jobs
```

**完整指令速查**

```bash
kubectl scale deployment <name> --replicas=N
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status deployment/<name>
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>
kubectl get svc / endpoints
kubectl run <name> --image=<img> --rm -it --restart=Never -- sh
kubectl create namespace <ns>
kubectl get pods -n <ns>
kubectl get pods -A
kubectl get daemonsets
kubectl get cronjobs / jobs
```

### ② 指令講解

本節為複習整理，詳細指令說明見各 Loop 的② 區塊。

**kubectl get all -n fullstack-demo**

- 用途：一次看 namespace 內所有常見資源
- 注意：DaemonSet 不在 `get all` 的預設列表，需另外 `kubectl get ds -n fullstack-demo`

### ③④ 題目 + 解答

**Q1**：建 dev 和 prod 兩個 Namespace，各部署一個 nginx（不同版本：1.26 vs 1.27），從測試 Pod 用 FQDN 分別 curl 兩個，確認兩個 Namespace 的服務互不影響。

操作：
```bash
kubectl create namespace dev
kubectl create namespace prod
kubectl create deployment nginx --image=nginx:1.26 -n dev
kubectl expose deployment nginx --port=80 -n dev
kubectl create deployment nginx --image=nginx:1.27 -n prod
kubectl expose deployment nginx --port=80 -n prod
kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- sh
# 在 Pod 內：
wget -qO- http://nginx.dev.svc.cluster.local    # dev 版本
wget -qO- http://nginx.prod.svc.cluster.local   # prod 版本
```
驗收標準：兩個都成功回傳 nginx 首頁，兩個環境共存不衝突

**Q2**：把 CoreDNS scale 到 0 個副本，然後分別試 curl `http://nginx-svc`（名稱，預期失敗）和 curl `http://ClusterIP`（IP 直連，預期成功），對比兩種結果，最後記得把 CoreDNS scale 回來。

操作：
```bash
kubectl get svc nginx-svc    # 先記下 ClusterIP
kubectl scale deployment coredns -n kube-system --replicas=0
kubectl run test --image=curlimages/curl --rm -it --restart=Never -- sh
# 在 Pod 內：
curl http://nginx-svc         # 預期失敗
curl http://<ClusterIP>       # 預期成功
exit
kubectl scale deployment coredns -n kube-system --replicas=2
```
驗收標準：名稱失敗（Name resolution）、IP 直連成功；最後 CoreDNS 恢復 2 個副本

---

### 📄 第 33 張：Docker 對照表 + 下堂課預告（5 min）

### ① 課程內容

**Docker → K8s 對照表（更新版）**

| Docker | K8s | 哪堂課 |
|--------|-----|--------|
| docker run | Pod | 第四堂 |
| compose up --scale web=3 | Deployment replicas: 3 | 第五堂 |
| -p 8080:80 | Service（NodePort / ClusterIP） | 第五堂 |
| Docker network DNS | Service + CoreDNS | 第五堂 |
| 不同 Compose 專案 | Namespace | 第五堂 |
| crontab | CronJob | 第五堂 |
| Nginx 反向代理 | Ingress | 下一堂 |
| docker volume | PV / PVC | 下一堂 |

**下堂課預告**

- 192.168.64.3:30080 太醜了 → **Ingress** 用域名路由
- 設定寫死在 Image → **ConfigMap** 抽出來
- 密碼不能明文 → **Secret** 管敏感資訊
- Pod 掛了資料消失 → **PV / PVC** 持久化

### ② 指令講解

本節為回顧整理，無新指令。

### ③④ 題目 + 解答

（無）
