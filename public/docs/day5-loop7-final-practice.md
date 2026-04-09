# Day 5 5-17 到 5-18：綜合實作 + 今日總結

---

## 5-17 綜合實作（45 分鐘）

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

**指令 7：確認 DaemonSet 狀態**

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

**指令 8：清理 fullstack-demo Namespace**

```bash
kubectl delete namespace fullstack-demo
```

打完要看：
```
namespace "fullstack-demo" deleted
```

這一個指令會刪除 fullstack-demo 內所有資源（Deployment、Service、DaemonSet、所有 Pod）。

注意：刪除 namespace 需要一點時間（30 秒到 2 分鐘），先顯示 `Terminating` 再變成刪除。

---

**指令 9：清理 default namespace 殘留資源**

```bash
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
```

分別刪除今天練習留下的 Deployment 和 Service。

---

**指令 10：確認叢集清理乾淨**

```bash
kubectl get all
```

打完要看（乾淨的狀態）：
```
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   5d
```

只剩 `kubernetes` 這個內建 Service，沒有其他資源。若還有殘留，逐一用 `kubectl delete` 清理。

---

### ③ 題目

1. 你執行 `kubectl exec -it frontend-pod -n fullstack-demo -- curl http://api-svc`，能成功嗎？如果把 api-svc 改名為 `backend-svc`，程式碼裡寫的 `http://api-svc` 還能用嗎？要怎麼修？

2. 在 fullstack-demo namespace 的 Pod 裡，用 `curl http://api-svc.fullstack-demo.svc.cluster.local` 和 `curl http://api-svc` 結果一樣嗎？哪種比較好？

3. 如果 frontend Deployment 從 2 個副本擴展到 5 個，NodePort 的行為會改變嗎？

---

### ④ 解答

**解答 1：**
能成功。frontend Pod 和 api-svc 在同一個 namespace（fullstack-demo），短名稱 `api-svc` 能被 CoreDNS 解析。

如果把 api-svc 改名為 `backend-svc`：
- 程式碼裡寫的 `http://api-svc` 就會解析失敗（`Could not resolve host`）
- 必須更新程式碼（或 ConfigMap）改成 `http://backend-svc`
- 這也是為什麼 Service 名稱要謹慎命名，改名代價很高

**解答 2：**
結果一樣，FQDN 和短名稱最終解析到相同的 ClusterIP。

短名稱（`http://api-svc`）比較好，理由：
- 更簡潔，程式碼可讀性高
- 如果未來搬移到不同叢集（`cluster.local` 不同），短名稱不受影響
- 只有**跨 namespace** 才需要用長名稱

**解答 3：**
NodePort 行為不變，但流量分配的 Pod 變多了：
- nodePort 30080 依然在每個 Node 上開放
- Service 的 Endpoints 會更新，從 2 個 Pod IP 增加到 5 個 Pod IP
- 每個請求仍然被負載均衡到其中一個 Pod，只是現在有 5 個 Pod 可以分流

---

## 5-18 今日總結（15 分鐘）

### ① 課程內容

**四個今日核心概念總覽**

| K8s 概念 | 解決什麼問題 | Docker 對照 |
|----------|------------|------------|
| Service（ClusterIP）| Pod IP 會變 + 負載均衡 | Docker Compose service name |
| Service（NodePort）| 從外部連進叢集 | `docker run -p 30080:80` |
| CoreDNS | Service 自動有 DNS 名稱 | Docker Compose 內建 DNS |
| Namespace | 邏輯隔離多環境/多團隊 | Docker Compose project name |

**三個永遠不要忘的原則**

1. **Service selector 必須和 Pod label 完全一致**
   - Endpoints 顯示 `<none>` → 99% 是 label 對不上
   - 大小寫、空格、拼字都要完全一樣

2. **Namespace 是邏輯隔離，不是網路隔離**
   - 不同 Namespace 的 Pod 預設可以互連
   - 要真正隔離網路需要 NetworkPolicy

3. **刪 Namespace 等於刪掉裡面所有東西**
   - `kubectl delete namespace production` 是高危操作
   - 刪前一定要確認，無法還原

**完整 Docker → K8s 對照表（今日更新）**

| Docker / Compose | K8s 對應 | 說明 |
|-----------------|---------|------|
| `docker run -p 8080:80` | Service NodePort | 對外暴露 port |
| Compose service name（DNS）| Service ClusterIP + CoreDNS | 服務內部 DNS |
| Compose `networks:` | Namespace + NetworkPolicy | 網路隔離 |
| `docker run --restart=always` | Deployment | 持續跑的服務 |
| `docker run --rm` | Job | 跑完刪除 |
| `crontab` | CronJob | 定時排程 |
| 在所有機器上 `docker run` | DaemonSet | 每台機器跑一個 |
| `docker ps` | `kubectl get pods` | 查看執行中容器/Pod |
| `docker logs` | `kubectl logs` | 查看日誌 |
| `docker exec -it` | `kubectl exec -it` | 進入容器 |

**今日新學的 kubectl 指令速查清單**

```bash
# Service
kubectl get svc
kubectl describe svc <name>
kubectl get ep / kubectl get endpoints <name>

# DNS 測試
kubectl run test --image=busybox:1.36 --rm -it --restart=Never -- sh
nslookup <service-name>     # 在 Pod 內

# Namespace
kubectl get ns
kubectl create namespace <name>
kubectl get pods -n <namespace>
kubectl get all -A                            # 所有 namespace
kubectl delete namespace <name>               # 危險！
kubectl config set-context --current --namespace=<name>
kubectl config view --minify | grep namespace

# DaemonSet
kubectl get ds
kubectl describe ds <name>
kubectl get pods -o wide                      # 看 Pod 在哪個 Node

# CronJob
kubectl get cj
kubectl get jobs
kubectl logs <pod-name>
kubectl delete cronjob <name>
```

---

**反思問題（下堂課回答）**

今天用 NodePort 讓外部連進服務，但有兩個問題還沒解決：

> **問題 1：怎麼讓使用者用 `https://myapp.com` 連服務，而不是 `http://192.168.1.1:30080`？**

線索：NodePort 只能用 IP + port，沒辦法用網域名稱和 HTTPS。下堂課會介紹 **Ingress** 和 **IngressController**。

> **問題 2：資料庫密碼、API Token 直接寫在 YAML 裡推到 Git，怎麼辦？**

線索：現在的 YAML 如果有 `password: mypassword` 推到 GitHub，就等於公開密碼。下堂課會介紹 **ConfigMap**（非敏感設定）和 **Secret**（敏感資料加密）。

---

**第六堂課預告**

| 主題 | 解決的問題 | 對應 Docker 概念 |
|------|-----------|----------------|
| ConfigMap | 設定檔從程式碼分離（env、config file）| `docker run -e` / `--env-file` |
| Secret | 敏感資料加密儲存（密碼、token、cert）| Docker secrets |
| Ingress | 網域名稱路由 + HTTPS | Nginx reverse proxy / Traefik |
| IngressController | 實作 Ingress 規則的元件 | Nginx container |
| Persistent Volume | 讓 Pod 重啟後資料不消失 | `docker run -v` |
| PersistentVolumeClaim | Pod 申請儲存空間的方式 | Volume mount |

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
kubectl delete namespace fullstack-demo
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
kubectl get all                                   # 確認乾淨
```

---

### ③ 題目

1. 今天學了四種 workload（Deployment、DaemonSet、CronJob、Job）。請說明各自適合什麼場景？

2. 你要幫公司部署三個環境（dev、staging、prod）在同一個 K8s 叢集。你會怎麼用 Namespace 規劃？有什麼要注意的？

3. CoreDNS 掛掉了（`kubectl get pods -n kube-system` 看到 CoreDNS 是 `Error`），叢集裡的 Service 連線會有什麼影響？

---

### ④ 解答

**解答 1：**

| Workload | 適合場景 |
|----------|---------|
| Deployment | 長期執行的無狀態服務（API server、Web server、Frontend）|
| DaemonSet | 每個 Node 都需要的 agent（日誌、監控、網路插件）|
| CronJob | 定時排程任務（備份、清理、報表）|
| Job | 一次性任務，跑完即結束（資料遷移、批次處理）|

**解答 2：**
規劃方式：
```bash
kubectl create namespace dev
kubectl create namespace staging
kubectl create namespace prod
```

注意事項：
1. **資源隔離**：不同 namespace 的資源不共用名稱，但 ClusterRole 和 PersistentVolume 是全域的
2. **網路不隔離**：要阻止 dev 的 Pod 連到 prod，需要設 NetworkPolicy
3. **危險操作**：`kubectl delete namespace prod` 會刪掉 prod 所有資源，操作前務必確認
4. **RBAC**：可以針對不同 namespace 設定不同人員的權限（下堂課後進階主題）
5. **資源限制**：可以用 ResourceQuota 限制各 namespace 的 CPU/Memory 使用量

**解答 3：**
CoreDNS 掛掉後：
- **已建立連線不影響**：已經建立的 TCP 連線繼續正常（DNS 只在建立連線時查詢一次）
- **新的 Service 名稱解析失敗**：任何用 Service 名稱建立新連線的請求都會失敗（`Could not resolve host`）
- **IP 直連還能用**：如果知道 ClusterIP，直接用 IP 連線仍然可以
- **新 Pod 啟動可能受影響**：Pod 啟動時若需要解析 DNS（例如 init container），也會失敗

這就是為什麼 K8s 預設跑**兩個** CoreDNS Pod（高可用），確保其中一個掛掉時服務不中斷。
