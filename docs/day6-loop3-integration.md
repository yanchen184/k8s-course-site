# Day 6 Loop 3 — 整合實作：Ingress + ConfigMap + Secret

---

## 6-8 整合實作引導（~12 min）

### ① 課程內容

📄 6-8 第 1 張

**這節在做什麼**

前面兩個 Loop 學了三件事：
- **Ingress**：讓使用者用域名連進來，路徑路由（/、/api）
- **ConfigMap**：把設定從 Image 裡面抽出來，掛到 Pod
- **Secret**：把密碼加密儲存，不寫死在 YAML

這三個概念分開學的。這節要把它們串起來，不學新東西，純整合。

**目標架構**

```
使用者
  │
  ↓
Ingress（myapp.local）
  ├── /      → frontend-svc → Nginx Pod（ConfigMap: 自訂首頁 index.html）
  └── /api   → api-svc      → httpd Pod（ConfigMap: API 設定）
                                   │
                                   ↓
                              mysql-svc → MySQL Pod（Secret: 密碼、ConfigMap: DB 名）
```

- 外面只看到一個入口（Ingress）
- Service 全部用 ClusterIP，因為有 Ingress 幫你做對外路由，不需要每個 Service 都開 NodePort
- 資料流：使用者 → Ingress → Service → Pod → Pod（MySQL）

📄 6-8 第 2 張

**九個步驟（為什麼這樣排順序）**

```
Step 1：kubectl create namespace my-app
Step 2：建 Secret（MySQL root 密碼）
Step 3：建 ConfigMap（MYSQL_DATABASE + 前端 index.html）
Step 4：部署 MySQL Deployment + ClusterIP Service
Step 5：部署 Nginx 前端 Deployment + ClusterIP Service
Step 6：部署 httpd API Deployment + ClusterIP Service
Step 7：建 Ingress（path-based routing）
Step 8：修改 /etc/hosts
Step 9：curl 驗證
```

**順序的原因：**

| 步驟 | 為什麼要在這個位置 |
|------|------------------|
| Step 1 先建 Namespace | 其他資源都要指定 `-n my-app`，Namespace 不存在就報錯 |
| Step 2 Secret 在 MySQL 前 | MySQL Deployment 的 `envFrom` 引用 Secret，Secret 不存在 Pod 會起不來 |
| Step 3 ConfigMap 在 MySQL 前 | 同理，MySQL 的 MYSQL_DATABASE 從 ConfigMap 讀，要先建 |
| Step 4-6 Deployment 在 Ingress 前 | Ingress 的 backend 指定 Service 名稱，Service 要先存在 |
| Step 7 Ingress 最後建 | 所有後端服務都準備好才建入口 |
| Step 8-9 驗證 | 全部建好才能測試 |

**關鍵設計決策：為什麼 Service 都用 ClusterIP？**

- 上一堂學 Service 時，用 NodePort 是因為「直接讓外面連進來」
- 現在有 Ingress 了，外面進來的流量由 Ingress 接管，Ingress 再轉給 ClusterIP Service
- ClusterIP 不開 NodePort，叢集外面連不到，更安全
- 一個入口（Ingress）管所有流量，不用記一堆不同的 Port

📄 6-8 第 3 張

**MySQL 持久化先不做**

這個示範的 MySQL 沒有掛 PV/PVC——Pod 重啟資料就消失。這是故意的，先讓整個架構的網路和設定串通，下午再解決持久化的問題。

---

### ② 所有指令＋講解

（本節以引導說明為主，指令集中在 6-9 示範。）

---

### ③ 題目

（本節無練習題）

---

### ④ 解答

（本節無）

---

## 6-9 整合實作示範（~15 min）

### ① 課程內容

📄 6-9 第 1 張

**示範流程**

老師照九個步驟帶做，學員觀看。每個步驟說明指令後確認輸出正確再繼續。

---

### ② 所有指令＋講解

---

**Step 1：建 Namespace**

📄 6-9 第 2 張

```bash
kubectl create namespace my-app
```

- `create namespace`：建立一個新的 Namespace（不用 YAML，直接指令建就好）
- `my-app`：Namespace 的名稱，接下來所有資源都要加 `-n my-app`

預期輸出：
```
namespace/my-app created
```

確認建立成功：

```bash
kubectl get namespace my-app
```

預期輸出：
```
NAME     STATUS   AGE
my-app   Active   5s
```

欄位說明：
- `STATUS: Active`：Namespace 正常運作中（`Terminating` 代表正在刪除中）

---

**Step 2：建 Secret**

📄 6-9 第 3 張

```bash
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=rootpassword123 \
  -n my-app
```

- `create secret generic`：建立通用類型的 Secret（generic 是最常用的類型，存任意 key-value）
- `mysql-secret`：Secret 的名稱，後面 Deployment 的 `envFrom` 會引用這個名稱
- `--from-literal=MYSQL_ROOT_PASSWORD=rootpassword123`：直接從指令列輸入 key=value（不需要先建檔案）
- `-n my-app`：建在 my-app Namespace 裡

預期輸出：
```
secret/mysql-secret created
```

確認：

```bash
kubectl get secret -n my-app
```

預期輸出：
```
NAME           TYPE     DATA   AGE
mysql-secret   Opaque   1      8s
```

欄位說明：
- `TYPE: Opaque`：通用 Secret 的類型（Kubernetes 內建的 TLS、Service Account 用不同 TYPE）
- `DATA: 1`：這個 Secret 裡有 1 筆 key-value 資料

---

**Step 3：建 ConfigMap**

📄 6-9 第 4 張

MySQL 用的（直接指令建）：

```bash
kubectl create configmap mysql-config \
  --from-literal=MYSQL_DATABASE=myappdb \
  -n my-app
```

- `mysql-config`：ConfigMap 的名稱
- `--from-literal=MYSQL_DATABASE=myappdb`：MySQL 啟動時會讀這個環境變數，自動建 `myappdb` 資料庫

Nginx 前端用的（YAML 方式，因為 value 是整個 HTML 檔案）：

先建立 `configmap-frontend.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: my-app
data:
  index.html: |
    <!DOCTYPE html>
    <html>
    <body>
      <h1>My App Frontend</h1>
      <p>Welcome!</p>
    </body>
    </html>
```

說明：
- `data` 底下的 key 是 `index.html`，value 是整個 HTML 內容
- `|`（pipe）：YAML 的多行字串語法，保留換行符號
- 後面 Deployment 會把這個 ConfigMap 的 `index.html` key 掛到 Nginx 的 `/usr/share/nginx/html/index.html`

套用：

```bash
kubectl apply -f configmap-frontend.yaml
```

預期輸出：
```
configmap/frontend-config created
```

確認兩個 ConfigMap 都建好：

```bash
kubectl get configmap -n my-app
```

預期輸出：
```
NAME               DATA   AGE
kube-root-ca.crt   1      2m
mysql-config       1      45s
frontend-config    1      10s
```

注意：`kube-root-ca.crt` 是 K8s 自動建的，不用管它。

---

**Step 4：部署 MySQL**

📄 6-9 第 5 張

建立 `mysql-deploy.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deploy
  namespace: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        envFrom:
        - secretRef:
            name: mysql-secret       # 引用 Secret，MYSQL_ROOT_PASSWORD 注入為環境變數
        - configMapRef:
            name: mysql-config       # 引用 ConfigMap，MYSQL_DATABASE 注入為環境變數
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-svc
  namespace: my-app
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
  type: ClusterIP              # 只給叢集內部用，不對外開放
```

說明關鍵設計：
- `envFrom`：整個 Secret 或 ConfigMap 裡的所有 key 都注入為環境變數（比 `env.valueFrom` 一個一個指定更方便）
- `secretRef` 和 `configMapRef` 可以同時列多個，K8s 會把它們合併注入
- `type: ClusterIP`：只有叢集內的 Pod 可以透過 `mysql-svc:3306` 連到 MySQL

套用：

```bash
kubectl apply -f mysql-deploy.yaml -n my-app
```

預期輸出：
```
deployment.apps/mysql-deploy created
service/mysql-svc created
```

等 MySQL Pod 啟動：

```bash
kubectl get pods -n my-app -w
```

- `-w`（watch）：持續監看，Pod 狀態有變化就更新輸出；按 `Ctrl+C` 停止

預期輸出（等待過程）：
```
NAME                            READY   STATUS              RESTARTS   AGE
mysql-deploy-6b8f9d7c4-xk9p2   0/1     ContainerCreating   0          5s
mysql-deploy-6b8f9d7c4-xk9p2   1/1     Running             0          18s
```

看到 `Running` 才繼續下一步，MySQL 需要幾秒初始化。

---

**Step 5：部署 Nginx 前端**

📄 6-9 第 6 張

建立 `frontend-deploy.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deploy
  namespace: my-app
spec:
  replicas: 1
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
        image: nginx:1.25
        ports:
        - containerPort: 80
        volumeMounts:
        - name: frontend-html
          mountPath: /usr/share/nginx/html/index.html  # 掛到這個路徑
          subPath: index.html                           # 只掛 ConfigMap 裡的這個 key
      volumes:
      - name: frontend-html
        configMap:
          name: frontend-config                        # 從這個 ConfigMap 讀資料
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: my-app
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

說明 `subPath` 的用途：
- 不加 `subPath`：整個 ConfigMap 的 key 都會以「檔案名稱」掛到 `mountPath` 這個「目錄」，Nginx 原本在 `/usr/share/nginx/html/` 的其他檔案會消失
- 加 `subPath: index.html`：只把 `index.html` 這一個 key 掛到指定路徑的「檔案」，不影響目錄裡其他檔案
- 記住：掛整個目錄就不用 subPath；掛單一檔案一定要加 subPath

套用：

```bash
kubectl apply -f frontend-deploy.yaml -n my-app
```

預期輸出：
```
deployment.apps/frontend-deploy created
service/frontend-svc created
```

---

**Step 6：部署 httpd API**

📄 6-9 第 7 張

建立 `api-deploy.yaml`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deploy
  namespace: my-app
spec:
  replicas: 1
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
apiVersion: v1
kind: Service
metadata:
  name: api-svc
  namespace: my-app
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

套用：

```bash
kubectl apply -f api-deploy.yaml -n my-app
```

預期輸出：
```
deployment.apps/api-deploy created
service/api-svc created
```

確認三個 Pod 全部 Running：

```bash
kubectl get pods -n my-app
```

預期輸出：
```
NAME                               READY   STATUS    RESTARTS   AGE
mysql-deploy-6b8f9d7c4-xk9p2      1/1     Running   0          3m
frontend-deploy-5d9f8c6b4-pq3r1   1/1     Running   0          90s
api-deploy-7c4b9d8f3-mn5s2        1/1     Running   0          15s
```

---

**Step 7：建 Ingress**

📄 6-9 第 8 張

建立 `app-ingress.yaml`：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: my-app
spec:
  ingressClassName: traefik        # k3s 預設的 Ingress Controller 是 Traefik
  rules:
  - host: myapp.local              # 這個 Ingress 處理 host 為 myapp.local 的請求
    http:
      paths:
      - path: /
        pathType: Prefix           # Prefix：/、/abc、/anything 都匹配
        backend:
          service:
            name: frontend-svc    # 轉給前端 Service
            port:
              number: 80
      - path: /api
        pathType: Prefix           # /api、/api/users、/api/v1/... 都匹配
        backend:
          service:
            name: api-svc         # 轉給 API Service
            port:
              number: 80
```

說明：
- `ingressClassName: traefik`：指定用哪個 Ingress Controller 來處理這個 Ingress（k3s 內建 Traefik，所以填 traefik）
- `host: myapp.local`：只處理 HTTP Host header 是 `myapp.local` 的請求，其他 host 不理
- `pathType: Prefix`：路徑前綴匹配，`/api/users` 也會被 `/api` 規則匹配到
- **路由順序**：Ingress 會先匹配更長的路徑，`/api` 比 `/` 更具體，所以 `/api/...` 走 api-svc，其他都走 frontend-svc

套用：

```bash
kubectl apply -f app-ingress.yaml -n my-app
```

預期輸出：
```
ingress.networking.k8s.io/app-ingress created
```

查看 Ingress：

```bash
kubectl get ingress -n my-app
```

預期輸出：
```
NAME          CLASS     HOSTS         ADDRESS        PORTS   AGE
app-ingress   traefik   myapp.local   192.168.1.10   80      20s
```

欄位說明：
- `CLASS`：使用的 Ingress Controller（traefik）
- `HOSTS`：這個 Ingress 處理哪個域名的請求
- `ADDRESS`：Ingress Controller 所在的 Node IP（流量進來的入口）

確認路由規則：

```bash
kubectl describe ingress app-ingress -n my-app
```

預期輸出（關鍵部分）：
```
Rules:
  Host         Path   Backends
  ----         ----   --------
  myapp.local
               /      frontend-svc:80 (10.42.1.5:80)
               /api   api-svc:80 (10.42.2.6:80)
```

`(10.42.x.x:80)` 是實際的 Pod IP，確認 Ingress 已經解析到後端 Pod 了。

---

**Step 8：修改 /etc/hosts**

📄 6-9 第 9 張

先拿 Node IP（Ingress Controller 跑在哪個 Node 就用哪個 IP）：

```bash
kubectl get nodes -o wide
```

預期輸出：
```
NAME         STATUS   ROLES                  AGE   VERSION   INTERNAL-IP    EXTERNAL-IP
k3s-master   Ready    control-plane,master   2d    v1.28.5   192.168.1.10   <none>
k3s-worker1  Ready    <none>                 2d    v1.28.5   192.168.1.11   <none>
k3s-worker2  Ready    <none>                 2d    v1.28.5   192.168.1.12   <none>
```

欄位說明：
- `INTERNAL-IP`：Node 在區域網路的 IP，用這個
- k3s 的 Traefik Ingress Controller 預設在所有 Node 上監聽，用 Master 的 IP 就可以

把 myapp.local 這個假域名對應到 Node IP，加到本機的 /etc/hosts（讓你的電腦知道 myapp.local 要去哪裡）：

```bash
sudo sh -c 'echo "192.168.1.10 myapp.local" >> /etc/hosts'
```

- `sudo sh -c '...'`：因為直接用 `sudo echo >> /etc/hosts` 會沒有寫入權限（重新導向是 shell 做的，不是 sudo 做的），所以用 `sh -c` 讓整個指令在有 sudo 權限的 shell 裡執行
- 把 `192.168.1.10` 換成你的實際 Node IP

確認加進去了：

```bash
cat /etc/hosts | grep myapp
```

預期輸出：
```
192.168.1.10 myapp.local
```

---

**Step 9：curl 驗證**

📄 6-9 第 10 張

驗證前端：

```bash
curl http://myapp.local
```

預期輸出：
```html
<!DOCTYPE html>
<html>
<body>
  <h1>My App Frontend</h1>
  <p>Welcome!</p>
</body>
</html>
```

如果看到這個，代表：Ingress 路由正確 → frontend-svc 正確 → frontend Pod 正確 → ConfigMap 的 index.html 正確掛載。

驗證 API：

```bash
curl http://myapp.local/api
```

預期輸出：
```html
<html><body><h1>It works!</h1></body></html>
```

這是 httpd 的預設首頁，代表 `/api` 路由正確打到 api-svc。

驗證 MySQL 有跑起來（從 MySQL Pod 內部執行 mysql 指令）：

```bash
kubectl exec -it deployment/mysql-deploy -n my-app -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
```

- `exec -it`：進入 Pod 執行互動式指令（`-i` 保持 stdin 開啟，`-t` 分配 TTY）
- `deployment/mysql-deploy`：指定目標（也可以直接用 Pod 名稱）
- `--`：分隔 kubectl 參數和要執行的指令
- `mysql -u root -prootpassword123`：用 root 帳號連 MySQL（`-p` 後面不留空格直接接密碼）
- `-e "SHOW DATABASES;"`：執行這行 SQL 後退出（非互動式）

預期輸出：
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| myappdb            |      ← 這個是 ConfigMap 裡 MYSQL_DATABASE 的值
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

看到 `myappdb` 就代表 ConfigMap 的值正確注入到 MySQL 了。

---

### ③ 題目

📄 6-9 第 11 張

**必做：完整架構實作**

按照九個步驟，在 `my-app` Namespace 裡建出完整架構：

任務清單：
1. 建 Namespace `my-app`
2. 建 Secret `mysql-secret`（MYSQL_ROOT_PASSWORD 自己決定，但要記住）
3. 建 ConfigMap `mysql-config`（MYSQL_DATABASE=`mydb`，改成自己的資料庫名稱）
4. 建 ConfigMap `frontend-config`（index.html 改成自己的姓名，例如 `<h1>Andy's App</h1>`）
5. 部署 MySQL + Service
6. 部署 Nginx 前端 + Service
7. 部署 httpd API + Service
8. 建 Ingress（host 用 `myapp.local`）
9. 修改 /etc/hosts
10. `curl http://myapp.local` 看到自己的姓名 ✓
11. `curl http://myapp.local/api` 看到 "It works!" ✓
12. `kubectl exec` 進 MySQL Pod，執行 `SHOW DATABASES;`，確認自己設定的資料庫名稱有出現 ✓

**挑戰：加第三個服務**

在 Ingress 加 `/admin` 路徑，導向一個新的 Deployment（image 自選，例如 `nginx:1.25`）：
1. 建 `admin-deploy` Deployment 和 `admin-svc` Service
2. 在 `app-ingress` 的 rules 裡加 `/admin` 路徑
3. `kubectl apply -f app-ingress.yaml` 更新 Ingress（不用重建，apply 會更新）
4. `curl http://myapp.local/admin` 看到 admin 服務的回應

---

### ④ 解答

📄 6-9 第 12 張

**必做解答（Step 3 的 ConfigMap 差異舉例）**

ConfigMap `mysql-config`：
```bash
kubectl create configmap mysql-config \
  --from-literal=MYSQL_DATABASE=mydb \
  -n my-app
```

ConfigMap `frontend-config`（改過的首頁）：
```yaml
data:
  index.html: |
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Andy's App</h1>
      <p>Hello from my K8s cluster!</p>
    </body>
    </html>
```

驗收指令：
```bash
# 前端有姓名
curl http://myapp.local

# API 有回應
curl http://myapp.local/api

# MySQL 有自訂資料庫名稱
kubectl exec -it deployment/mysql-deploy -n my-app -- \
  mysql -u root -p<你的密碼> -e "SHOW DATABASES;"
```

---

**挑戰解答（加 /admin 路徑）**

建 `admin-deploy.yaml`：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: admin-deploy
  namespace: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: admin
  template:
    metadata:
      labels:
        app: admin
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: admin-svc
  namespace: my-app
spec:
  selector:
    app: admin
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

更新 `app-ingress.yaml`（在 `paths` 裡加一段）：
```yaml
      - path: /admin
        pathType: Prefix
        backend:
          service:
            name: admin-svc
            port:
              number: 80
```

套用：
```bash
kubectl apply -f admin-deploy.yaml -n my-app
kubectl apply -f app-ingress.yaml -n my-app
```

驗收：
```bash
curl http://myapp.local/admin    # → nginx 預設頁面
```

---

## 6-10 回頭操作 Loop 3（~5 min）

### ① 課程內容

📄 6-10 第 1 張

**帶做：確認整個架構的全局狀態**

用一個指令看 `my-app` Namespace 裡所有資源：

**三個常見踩坑**

1. **忘記加 `-n my-app`**
   - 現象：`kubectl get pods` 看到空的，以為沒建成功，其實是在 default namespace 看
   - 解法：每個指令都加 `-n my-app`，或建完後養成習慣先查 `kubectl get all -n my-app`

2. **ConfigMap 的 index.html 忘記加 `subPath`**
   - 現象：curl myapp.local 看不到自訂首頁，或看到 404
   - 原因：沒有 `subPath` 會把整個 ConfigMap 掛成目錄，覆蓋掉 Nginx 原本的 html 目錄，Nginx 設定裡其他必要的檔案不見了
   - 解法：確認 `volumeMounts` 裡有 `subPath: index.html`

3. **Ingress 的 host 和 /etc/hosts 對不上**
   - 現象：curl myapp.local 連不到，或回應 404
   - 原因：Ingress YAML 裡寫 `host: myapp.local`，但 /etc/hosts 寫的是 `myapp.local.` 或拼錯字，Ingress Controller 比對 Host header 失敗
   - 解法：兩邊字串必須完全一樣，包括大小寫

📄 6-10 第 2 張

**清理**

```bash
kubectl delete namespace my-app
```

- 刪掉 Namespace 會連帶刪除裡面的所有資源（Deployment、Service、Ingress、ConfigMap、Secret、Pod 全部一次清掉）
- 這是 K8s Namespace 最大的好處之一：清理很乾淨，不用逐一刪除

**銜接下午**

> Ingress + ConfigMap + Secret 串起來了，整個架構可以跑。但你有沒有發現一個問題：MySQL 的資料存在哪裡？存在 Pod 裡面。Pod 一重啟，資料全部消失。

> 下午要解決這個問題：PV（PersistentVolume）和 PVC（PersistentVolumeClaim）——讓資料存在叢集裡，Pod 重啟也不怕。

---

### ② 所有指令＋講解

---

**查看 Namespace 全局狀態**

```bash
kubectl get all -n my-app
```

- `get all`：列出這個 Namespace 裡所有主要資源（Pod、Service、Deployment、ReplicaSet）
- `-n my-app`：指定 Namespace

預期輸出：
```
NAME                                   READY   STATUS    RESTARTS   AGE
pod/api-deploy-7c4b9d8f3-mn5s2        1/1     Running   0          8m
pod/frontend-deploy-5d9f8c6b4-pq3r1   1/1     Running   0          9m
pod/mysql-deploy-6b8f9d7c4-xk9p2      1/1     Running   0          12m

NAME                   TYPE        CLUSTER-IP      PORT(S)    AGE
service/api-svc        ClusterIP   10.96.45.231    80/TCP     8m
service/frontend-svc   ClusterIP   10.96.102.15    80/TCP     9m
service/mysql-svc      ClusterIP   10.96.200.88    3306/TCP   12m

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/api-deploy         1/1     1            1           8m
deployment.apps/frontend-deploy    1/1     1            1           9m
deployment.apps/mysql-deploy       1/1     1            1           12m

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/api-deploy-7c4b9d8f3        1         1         1       8m
replicaset.apps/frontend-deploy-5d9f8c6b4   1         1         1       9m
replicaset.apps/mysql-deploy-6b8f9d7c4      1         1         1       12m
```

注意：`get all` 不包含 Ingress、ConfigMap、Secret，要單獨查：

```bash
kubectl get ingress,configmap,secret -n my-app
```

預期輸出：
```
NAME                                    CLASS     HOSTS         ADDRESS        PORTS   AGE
ingress.networking.k8s.io/app-ingress   traefik   myapp.local   192.168.1.10   80      7m

NAME                         DATA   AGE
configmap/frontend-config    1      11m
configmap/kube-root-ca.crt   1      15m
configmap/mysql-config       1      11m

NAME                  TYPE     DATA   AGE
secret/mysql-secret   Opaque   1      13m
```

看到三個 Pod Running、三個 Service ClusterIP、一個 Ingress、兩個自建 ConfigMap、一個 Secret，架構完整。

---

**清理 Namespace**

```bash
kubectl delete namespace my-app
```

預期輸出：
```
namespace "my-app" deleted
```

這一行指令會刪掉 Namespace 裡的所有資源。過幾秒後可以確認：

```bash
kubectl get all -n my-app
```

預期輸出：
```
No resources found in my-app namespace.
```

或直接確認 Namespace 不存在：

```bash
kubectl get namespace my-app
```

預期輸出：
```
Error from server (NotFound): namespaces "my-app" not found
```

---

### ③ 題目

（本節無新題目）

---

### ④ 解答

（本節無新解答）
