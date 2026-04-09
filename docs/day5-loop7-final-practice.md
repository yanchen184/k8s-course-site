# Day 5 5-17 到 5-18：綜合實作 + 今日總結

---

## 5-17 綜合實作（45 分鐘）

### 📄 第 26 張：綜合實作：從零串完整鏈路（7 min）

### ① 課程內容

**目標架構說明**

```
外部瀏覽器
    │
    ▼ HTTP :30080
┌─────────────────────────────────────────────────┐
│  fullstack-demo Namespace                       │
│                                                 │
│  frontend-svc（NodePort :30080）                 │
│      ↓ ClusterIP                                │
│  frontend Deployment（nginx:1.27 × 2 Pod）       │
│      ↓ curl http://api-svc（叢集內部）            │
│  api-svc（ClusterIP）                            │
│      ↓                                          │
│  api Deployment（httpd:2.4 × 2 Pod）             │
│                                                 │
│  log-collector DaemonSet（每個 Node 各 1 個）     │
└─────────────────────────────────────────────────┘
```

**這個架構涵蓋今天所有重點**

| 元素 | 對應知識點 |
|------|-----------|
| frontend NodePort | Loop 5：NodePort 對外暴露 |
| api ClusterIP | Loop 4：ClusterIP 服務內部通訊 |
| frontend curl api-svc | Loop 4+6：Service DNS 短名稱 |
| fullstack-demo Namespace | Loop 6：Namespace 隔離 |
| log-collector DaemonSet | Loop 7：每個 Node 跑一個 agent |

**PPT 左邊顯示 10 步驟（Step 1-5）**

1. `kubectl create namespace my-app`
2. `kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app`
3. `kubectl expose deployment nginx-deploy --port=80 -n my-app`
4. 叢集內驗證：`kubectl run test --image=busybox:1.36 --rm -it --restart=Never -n my-app -- wget -qO- http://nginx-deploy`
5. 建 NodePort Service（YAML，nodePort: 30080）`kubectl apply -f nodeport.yaml`

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

---

### ② 所有指令＋講解

**指令 1：套用整個 fullstack 架構**

```bash
kubectl apply -f full-stack.yaml
```

- `-f` 指定檔案，YAML 內多個資源用 `---` 分隔，一次全套用

打完要看：
```
namespace/fullstack-demo created
deployment.apps/frontend created
service/frontend-svc created
deployment.apps/api created
service/api-svc created
daemonset.apps/log-collector created
```

每一行都是 `created` 才正確。若有 `Error`，根據錯誤訊息修正 YAML。

異常：
- `namespaces "fullstack-demo" already exists`：namespace 已存在（不影響其他資源，可忽略或先刪除）

---

**指令 2：確認 fullstack-demo namespace 所有資源**

```bash
kubectl get all -n fullstack-demo
```

- `get all`：顯示 Pod、Deployment、ReplicaSet、Service、DaemonSet 等所有常見資源
- 注意：DaemonSet 不在 `get all` 的預設列表，要另外查

打完要看：
```
NAME                            READY   STATUS    RESTARTS   AGE
pod/api-xxx-yyy                 1/1     Running   0          30s
pod/api-xxx-zzz                 1/1     Running   0          30s
pod/frontend-xxx-yyy            1/1     Running   0          30s
pod/frontend-xxx-zzz            1/1     Running   0          30s
pod/log-collector-abc           1/1     Running   0          30s
pod/log-collector-def           1/1     Running   0          30s

NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/api-svc        ClusterIP   10.96.100.10    <none>        80/TCP         30s
service/frontend-svc   NodePort    10.96.100.11    <none>        80:30080/TCP   30s

NAME                   DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE
deployment.apps/api        2         2         2        2            2
deployment.apps/frontend   2         2         2        2            2
```

確認所有 Pod 都是 `Running`，兩個 Service 都建立完成。

---

**指令 3：查看 Pod 分布在哪些 Node**

```bash
kubectl get pods -o wide -n fullstack-demo
```

- `-o wide`：顯示 `NODE` 欄位

打完要看：
```
NAME               READY   STATUS    NODE
api-xxx-yyy        1/1     Running   k3s-worker1
api-xxx-zzz        1/1     Running   k3s-worker2
frontend-xxx-yyy   1/1     Running   k3s-worker2
frontend-xxx-zzz   1/1     Running   k3s-worker1
log-collector-abc  1/1     Running   k3s-worker1
log-collector-def  1/1     Running   k3s-worker2
```

觀察重點：
- frontend 和 api 的 Pod 有分散到不同 Node（K8s scheduler 自動平衡）
- log-collector（DaemonSet）每個 Node 各一個

---

**指令 4：從外部 curl 前端（驗證 NodePort）**

```bash
curl http://<node-ip>:30080
```

先取得 Node IP：
```bash
kubectl get nodes -o wide
# 或
multipass info k3s-worker1 | grep IPv4
```

打完要看：nginx 預設首頁 HTML，出現 `Welcome to nginx!`

這代表：外部 → Node:30080 → frontend-svc → frontend Pod 整條路通了。

---

**指令 5：從 frontend Pod 內 curl api-svc（驗證 ClusterIP + DNS）**

```bash
kubectl exec -it <frontend-pod-name> -n fullstack-demo -- curl http://api-svc
```

先取得 frontend pod 名稱：
```bash
kubectl get pods -n fullstack-demo | grep frontend
```

例如：
```bash
kubectl exec -it frontend-7d8f9b4c5-xyzab -n fullstack-demo -- curl http://api-svc
```

- `-it`：互動式
- `-- curl http://api-svc`：在 Pod 內執行 curl

打完要看：Apache httpd 的預設首頁，`It works!`

這代表：frontend Pod 用 Service DNS 短名稱 `api-svc` 成功找到 api Service，整條內部通訊路通了。

異常：
- `Could not resolve host: api-svc`：兩個 Service 在同一個 namespace，短名稱應該能解析。確認 frontend Pod 和 api-svc 都在 `fullstack-demo` namespace。

---

**指令 6：DNS 解析驗證（在 fullstack-demo namespace 跑 nslookup）**

```bash
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc
```

- 在 fullstack-demo namespace 啟動臨時 Pod
- 執行 nslookup 查詢 api-svc 的 DNS

打完要看：
```
Server:    10.96.0.10
Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

Name:      api-svc
Address 1: 10.96.100.10 api-svc.fullstack-demo.svc.cluster.local
```

確認 api-svc 被解析到正確的 ClusterIP。

---

### ③ 題目

1. 部署整個 fullstack-demo，從外部 curl Node:30080 看到 nginx 首頁，再從 frontend Pod exec 進去 curl api-svc 看到 httpd 的 'It works!'。

2. 執行 `kubectl delete namespace fullstack-demo`，用 `kubectl get all -n fullstack-demo` 確認全部資源都清空了。

---

### ④ 解答

**解答 1：**

操作：
```bash
kubectl apply -f full-stack.yaml
kubectl get all -n fullstack-demo    # 等所有 Pod Running
kubectl get nodes -o wide            # 拿 Node IP
curl http://<Node-IP>:30080          # 外部存取 frontend
kubectl get pods -n fullstack-demo   # 找 frontend Pod 名稱
kubectl exec -n fullstack-demo <frontend-pod-name> -- curl http://api-svc
```

驗收標準：
- 外部 curl Node:30080 回傳 'Welcome to nginx!'
- 叢集內 curl api-svc 回傳 'It works!'（httpd 的預設首頁）

**解答 2：**

操作：
```bash
kubectl delete namespace fullstack-demo
# 等待 Terminating 完成（約 30 秒到 2 分鐘）
kubectl get all -n fullstack-demo    # 確認清空
kubectl get ns    # 確認 namespace 已消失
```

驗收標準：`kubectl get all -n fullstack-demo` 顯示 'No resources found'，`kubectl get ns` 不再有 fullstack-demo

---

### 📄 第 27 張：綜合實作：擴縮容 → 更新 → 回滾 → 清理（5 min）

### ① 課程內容

**PPT 左邊顯示 10 步驟（Step 6-10）**

6. 外部驗證：`curl http://<Node-IP>:30080`
7. 擴縮容：`kubectl scale deployment frontend --replicas=5 -n fullstack-demo` → 縮回 2
8. 滾動更新：`kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo`
9. 回滾：`kubectl rollout undo deployment/frontend -n fullstack-demo`
10. 清理：`kubectl delete namespace fullstack-demo` -- 一行搞定

---

### ② 所有指令＋講解

**指令 7：從外部 curl 驗證 NodePort**

```bash
curl http://<Node-IP>:30080
```

先取得 Node IP：`kubectl get nodes -o wide` 或 `multipass info k3s-worker1 | grep IPv4`

打完要看：nginx 預設首頁 HTML（Welcome to nginx!）

異常：Connection refused → nodePort 或 Node IP 填錯

---

**指令 8：從 frontend Pod 內 curl api-svc（驗證 ClusterIP + DNS）**

```bash
kubectl exec -it <frontend-pod-name> -n fullstack-demo -- curl http://api-svc
```

先取得 Pod 名稱：`kubectl get pods -n fullstack-demo | grep frontend`

打完要看：Apache httpd 的預設首頁 "It works!"

異常：Could not resolve host: api-svc → 確認兩個資源都在同一個 namespace

---

**指令 9：DNS 解析驗證**

```bash
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it --restart=Never -- nslookup api-svc
```

打完要看：Name: api-svc / Address 1: 10.96.x.x api-svc.fullstack-demo.svc.cluster.local

---

**指令 10：確認 DaemonSet 狀態**

```bash
kubectl get ds -n fullstack-demo
```

打完要看：
```
NAME            DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
log-collector   2         2         2       2            2           <none>          5m
```

`DESIRED` 等於叢集 Node 數（2 個 Node → DESIRED = 2）。

---

**指令 11：擴縮容 frontend**

```bash
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
kubectl get pods -n fullstack-demo
```

打完要看：frontend Pod 從 2 個增加到 5 個，全部 Running。

---

**指令 12：滾動更新 frontend**

```bash
kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo
kubectl rollout status deployment/frontend -n fullstack-demo
```

打完要看：rollout status 顯示 `successfully rolled out`。

---

**指令 13：回滾 frontend**

```bash
kubectl rollout undo deployment/frontend -n fullstack-demo
```

打完要看：`deployment.apps/frontend rolled back`

---

**指令 14：清理 fullstack-demo Namespace**

```bash
kubectl delete namespace fullstack-demo
```

打完要看：
```
namespace "fullstack-demo" deleted
```

這一個指令會刪除 fullstack-demo 內所有資源（Deployment、Service、DaemonSet、所有 Pod）。

注意：刪除 namespace 需要一點時間（30 秒到 2 分鐘），先顯示 `Terminating` 再變成刪除。高危操作：刪前務必確認 namespace 名稱正確。

---

### ③ 題目

1. 從 frontend Pod exec 進去，分別 curl `http://api-svc` 和 curl `http://api-svc.fullstack-demo.svc.cluster.local`，確認兩種都成功回傳 'It works!'。

2. 把 frontend Deployment 從 2 副本擴展到 5 副本，然後執行 `kubectl get endpoints frontend-svc -n fullstack-demo`，觀察 Endpoints 數量有沒有跟著增加。

3. scale frontend 到 5 副本後，多連幾次 curl Node:30080，用 `kubectl logs` 分別看不同 frontend Pod，確認流量有被分散到不同 Pod。

---

### ④ 解答

**解答 1：**

操作：
```bash
kubectl get pods -n fullstack-demo | grep frontend    # 找 Pod 名稱
kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc
kubectl exec -n fullstack-demo <frontend-pod> -- curl http://api-svc.fullstack-demo.svc.cluster.local
```

驗收標準：兩個指令都回傳 'It works!'，驗證短名稱和 FQDN 等效

**解答 2：**

操作：
```bash
kubectl get ep frontend-svc -n fullstack-demo    # 記下目前 Endpoints 數量
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
kubectl get pods -n fullstack-demo               # 等 Pod 都 Running
kubectl get ep frontend-svc -n fullstack-demo    # 觀察 Endpoints 變化
```

驗收標準：Endpoints 從 2 個 IP 增加到 5 個 IP，從外部 curl Node:30080 仍然成功

**解答 3：**

操作：
```bash
for i in 1 2 3 4 5; do curl -s http://<Node-IP>:30080 -o /dev/null -w '%{http_code}\n'; done
kubectl logs <frontend-pod-1> -n fullstack-demo --tail=5
kubectl logs <frontend-pod-2> -n fullstack-demo --tail=5
```

驗收標準：多個 Pod 的 logs 都有出現 access log，驗證流量有被分散

---

### 📄 第 28 張：學員自由練習（15 min）

> 📋 學生看 PPT 投影片，上面有完整 10 步驟和挑戰題。

**必做：跟著 10 步驟完整做一遍**

1. `kubectl create namespace my-app`
2. `kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app`
3. `kubectl expose deployment nginx-deploy --port=80 -n my-app`
4. 測試 Pod curl 驗證（ClusterIP）
5. 建 NodePort Service（30080）
6. curl Node-IP:30080
7. scale 3 → 5 → 3
8. set image nginx:1.27 → 1.28
9. rollout undo
10. delete namespace my-app

**挑戰 1：同時部署兩個服務**
- nginx（app: frontend）+ httpd（app: api）
- 各自 Deployment + ClusterIP + NodePort
- nginx 用 30080，httpd 用 30081

**挑戰 2：跨 Namespace DNS**
- 從測試 Pod curl `frontend-svc.my-app.svc.cluster.local`
- curl `api-svc.my-app.svc.cluster.local`

### ③ 題目

1. 依照今天學的四種 workload 類型，對以下每個情境動手建出正確的資源，用 `kubectl get` 確認狀態：
   - 建 Deployment（replicas: 2）— 確認 2 個 Pod Running
   - 建 DaemonSet — 確認 Pod 數 = Node 數
   - 建 CronJob（每分鐘）— 等 1 分鐘確認有 Completed 的 Pod

---

### ④ 解答

**解答 1：**

操作：
```bash
kubectl apply -f deployment.yaml
kubectl get pods    # 2 個 Running
kubectl apply -f daemonset.yaml
kubectl get pods -o wide -l app=log-collector    # 每個 Node 各一個
kubectl apply -f cronjob.yaml
# 等 1 分鐘
kubectl get pods    # 看到 Completed 的 Pod
```

驗收標準：三種 workload 的 Pod 狀態符合預期（Running / Running / Completed）

---

## 5-18 今日總結（15 分鐘）

### 📄 第 29 張：第五堂總結：因果鏈回顧（7 min）

### ① 課程內容

**今天的因果鏈**

第四堂 Deployment 只有一個 Node → **k3s 多節點**
→ 流量變了要調整 → **擴縮容**
→ 新版本要上線 → **滾動更新**
→ 新版有 bug → **回滾**
→ Pod 掛了 → **自我修復**
→ K8s 怎麼認 Pod？ → **Labels + Selector**
→ 外面連不到 → **ClusterIP Service**
→ 外面也要連 → **NodePort**
→ 用 IP 太麻煩 → **DNS 服務發現**
→ 環境要隔離 → **Namespace**
→ 每台 Node 都要跑一份 → **DaemonSet**
→ 定時跑任務 → **CronJob**
→ 全部串起來 → **完整服務上線流程**

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

---

### ② 所有指令＋講解

（本節為複習整理，指令詳見各 Loop 的② 區塊）

**今日完整指令一覽（快速複習用）**

```bash
# ===== Loop 4：ClusterIP =====
kubectl apply -f service-clusterip.yaml
kubectl get svc
kubectl describe svc nginx-svc
kubectl get ep nginx-svc
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
# (Pod 內) curl http://nginx-svc

# ===== Loop 5：NodePort =====
kubectl apply -f service-nodeport.yaml
kubectl get svc                                   # 看 PORT(S) 欄位
multipass info k3s-worker1 | grep IPv4            # 取得 Node IP
curl http://<node-ip>:30080
kubectl delete svc nginx-nodeport

# ===== Loop 6：CoreDNS + Namespace =====
kubectl get pods -n kube-system | grep dns
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
# (Pod 內) wget -qO- http://nginx-svc
# (Pod 內) wget -qO- http://nginx-svc.default.svc.cluster.local
# (Pod 內) nslookup nginx-svc
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

# ===== Loop 7：DaemonSet =====
kubectl apply -f daemonset.yaml
kubectl get ds
kubectl describe daemonset log-collector
kubectl get pods -o wide

# ===== Loop 7：CronJob =====
kubectl apply -f cronjob.yaml
kubectl get cj
kubectl get jobs
kubectl get pods                                  # 看 Completed 狀態
kubectl logs <job-pod-name>
kubectl delete cronjob hello-cron

# ===== Loop 8：綜合實作 =====
kubectl apply -f full-stack.yaml
kubectl get all -n fullstack-demo
kubectl get pods -o wide -n fullstack-demo
curl http://<node-ip>:30080
kubectl exec -it <frontend-pod> -n fullstack-demo -- curl http://api-svc
kubectl run dns-final -n fullstack-demo --image=busybox:1.36 --rm -it \
  --restart=Never -- nslookup api-svc
kubectl get ds -n fullstack-demo
kubectl scale deployment frontend --replicas=5 -n fullstack-demo
kubectl set image deployment/frontend nginx=nginx:1.28 -n fullstack-demo
kubectl rollout undo deployment/frontend -n fullstack-demo
kubectl delete namespace fullstack-demo
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
kubectl get all                                   # 確認乾淨
```

---

### ③ 題目

1. 建 dev 和 prod 兩個 Namespace，各部署一個 nginx（不同版本：1.26 vs 1.27），從測試 Pod 用 FQDN 分別 curl 兩個，確認兩個 Namespace 的服務互不影響。

2. 把 CoreDNS scale 到 0 個副本，然後分別試 curl `http://nginx-svc`（名稱，預期失敗）和 curl `http://<ClusterIP>`（IP 直連，預期成功），對比兩種結果，最後記得把 CoreDNS scale 回來。

---

### ④ 解答

**解答 1：**

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

**解答 2：**

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

### 📄 第 30 張：回家作業 + 下堂課預告（5 min）

### ① 課程內容

**Docker → K8s 對照表（更新版）**

| Docker / Compose | K8s 對應 | 哪堂課 |
|-----------------|---------|-------|
| docker run | Pod | 第四堂 |
| compose up --scale web=3 | Deployment replicas: 3 | 第五堂 |
| -p 8080:80 | Service（NodePort / ClusterIP）| 第五堂 |
| Docker network DNS | Service + CoreDNS | 第五堂 |
| 不同 Compose 專案 | Namespace | 第五堂 |
| crontab | CronJob | 第五堂 |
| Nginx 反向代理 | Ingress | 下一堂 |
| docker volume | PV / PVC | 下一堂 |

**回家作業**

1. **從零做一遍完整鏈路**，不看筆記
2. 在兩個 Namespace 各部署一個服務，跨 Namespace curl
3. 建 DaemonSet + CronJob，觀察行為

**下堂課預告**

| 主題 | 解決的問題 |
|------|-----------|
| Ingress | 192.168.64.3:30080 太醜了 → 用域名路由 |
| ConfigMap | 設定寫死在 Image → 抽出來 |
| Secret | 密碼不能明文 → 管敏感資訊 |
| PV / PVC | Pod 掛了資料消失 → 持久化 |

---

### ③ 題目

1. 從零不看筆記完整跑一遍：kubectl create namespace my-app → 建 Deployment → expose → 測試 Pod curl → NodePort → curl Node-IP:30080 → scale 3→5→3 → set image → rollout undo → delete namespace

2. 在 team-a 和 team-b 兩個 Namespace 各部署一個 Service，從 default namespace 的 busybox 分別用 FQDN 連到兩個 Service，確認都成功

3. 建 DaemonSet + CronJob，用 `kubectl get pods -o wide` 確認 DaemonSet 每個 Node 各一個；等 1 分鐘用 `kubectl get jobs` 確認 CronJob 觸發，用 `kubectl logs` 看到輸出

---

### ④ 解答

**解答 1：**

操作：
```bash
kubectl create namespace my-app
kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app
kubectl expose deployment nginx-deploy --port=80 -n my-app
kubectl run test --image=busybox:1.36 --rm -it --restart=Never -n my-app -- wget -qO- http://nginx-deploy
kubectl apply -f nodeport.yaml    # nodePort: 30080, namespace: my-app
curl http://<Node-IP>:30080
kubectl scale deployment nginx-deploy --replicas=5 -n my-app
kubectl scale deployment nginx-deploy --replicas=3 -n my-app
kubectl set image deployment/nginx-deploy nginx=nginx:1.28 -n my-app
kubectl rollout undo deployment/nginx-deploy -n my-app
kubectl delete namespace my-app
```

驗收：`kubectl get namespace` 不再有 my-app

**解答 2：**

操作：
```bash
kubectl create namespace team-a
kubectl create namespace team-b
kubectl create deployment nginx --image=nginx:1.27 -n team-a
kubectl expose deployment nginx --port=80 -n team-a
kubectl create deployment nginx --image=nginx:1.27 -n team-b
kubectl expose deployment nginx --port=80 -n team-b
kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- sh
# 在 Pod 內：
wget -qO- http://nginx.team-a.svc.cluster.local
wget -qO- http://nginx.team-b.svc.cluster.local
```

驗收：兩個 wget 都回傳對應的首頁

**解答 3：**

操作：
```bash
kubectl apply -f daemonset.yaml
kubectl get pods -o wide -l app=log-collector    # 每個 Node 各一個
kubectl apply -f cronjob.yaml
# 等 1 分鐘
kubectl get jobs    # 確認 CronJob 觸發
kubectl logs <job-pod-name>    # 看到輸出
```

驗收：三種 workload 狀態符合預期（DaemonSet Running / CronJob Completed）

---

### 📄 第 31 張：Lab 8：從零建完整 Web 服務架構（20 min）

> 📋 學生看 PPT 投影片（Lab 8：從零建完整 Web 服務架構），上面有完整任務清單和驗收標準。

### ① 課程內容

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

**Lab 參考 YAML**

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

**驗收指令**

```bash
kubectl get all
kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-svc
curl http://<Node-IP>:30088
kubectl get jobs    # 等 1 分鐘後
kubectl logs <health-check-pod-name>
# 清理：kubectl delete deployment nginx-web && kubectl delete svc nginx-svc nginx-nodeport && kubectl delete cronjob health-check
```

---

### ③ 題目

1. 在所有資源跑起來後，執行 `kubectl run dns-check --image=busybox:1.36 --rm -it --restart=Never -- nslookup nginx-svc`，確認 CronJob 的 Pod 能解析到 nginx-svc 的 ClusterIP。

2. 修改 health-check CronJob 的 schedule 為 `*/2 * * * *`（每兩分鐘），apply 更新，觀察新 Job 觸發的間隔確實變長了。

3. 故意把 nginx-svc 的 selector 改錯（selector app: nginx-broken），apply 讓 Endpoints 變成空的，等 1 分鐘看 CronJob 的 log 顯示什麼 error，再修好 selector，確認下一次 CronJob 執行成功。

---

### ④ 解答

**解答 1：**

操作：
```bash
kubectl run dns-check --image=busybox:1.36 --rm -it --restart=Never -- nslookup nginx-svc
# 在輸出中確認 Address 欄位有 ClusterIP
```

驗收標準：nslookup 回傳 nginx-svc 對應的 ClusterIP，驗證 CronJob Pod 能用短名稱找到 Service

**解答 2：**

操作：
```bash
# 把 schedule 改成 '*/2 * * * *'
kubectl apply -f health-check-cronjob.yaml
kubectl get cronjobs    # 確認 SCHEDULE 更新
# 等 2 分鐘
kubectl get jobs        # 觀察新 Job 出現的時間間隔
```

驗收標準：`kubectl get jobs` 顯示新 Job 之間的 LAST SCHEDULE 間隔約 2 分鐘

**解答 3：**

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
