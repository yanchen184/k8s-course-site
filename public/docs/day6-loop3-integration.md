# Day 6 Loop 3 — 整合實作：Ingress + ConfigMap + Secret

---

## 6-8 整合實作引導（~12 min）

### ① 課程內容

📄 6-8 第 1 張

前兩個 Loop 學了三件事：Ingress 路由、ConfigMap 設定、Secret 密碼。這節把它們串在一起，不學新東西，純整合。

目標架構：一個 Namespace 裡，Nginx 前端 + httpd API + MySQL，只有一個 Ingress 入口，所有 Service 都用 ClusterIP。

---

### ② 所有指令＋講解

📄 6-8 第 2 張

**確認目前叢集是乾淨的**

```bash
kubectl get all
kubectl get all -n my-app 2>/dev/null || echo "my-app namespace 不存在，環境乾淨"
```

先確認之前的資源已清理完畢。

**九個步驟的順序邏輯**

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

**為什麼這樣排順序：**

| 步驟 | 為什麼要在這個位置 |
|------|------------------|
| Step 1 先建 Namespace | 其他資源都要指定 `-n my-app`，Namespace 不存在就報錯 |
| Step 2 Secret 在 MySQL 前 | MySQL Deployment 的 `envFrom` 引用 Secret，Secret 不存在 Pod 會起不來 |
| Step 3 ConfigMap 在 MySQL 前 | MySQL 的 MYSQL_DATABASE 從 ConfigMap 讀，要先建 |
| Step 4-6 Deployment 在 Ingress 前 | Ingress backend 指定 Service 名稱，Service 要先存在 |
| Step 7 Ingress 最後建 | 所有後端服務都準備好才建入口 |

📄 6-8 第 3 張

**關鍵設計決策：為什麼 Service 都用 ClusterIP？**

- 有 Ingress 了，外部流量由 Ingress 接管，再轉給 ClusterIP Service
- ClusterIP 叢集外面連不到，更安全
- 一個入口（Ingress）管所有流量，不用記一堆 NodePort

**MySQL 持久化先不做**

這個示範的 MySQL 沒有掛 PV/PVC——Pod 重啟資料就消失。這是故意的，先讓整個架構的網路和設定串通，下午再解決持久化的問題。

---

### ③ QA

**Q：為什麼要建 Namespace？直接用 default 不行嗎？**

A：可以，但不建議。Namespace 是邏輯隔離的邊界，不同專案、不同環境（dev/staging/prod）可以放在不同 Namespace。最大的好處是清理方便：`kubectl delete namespace my-app` 一行指令刪掉 Namespace 裡的所有資源，不需要逐一刪。

**Q：建資源的順序為什麼重要？**

A：K8s 不會自動等你依賴的資源建好再繼續。如果 Deployment 引用的 Secret 或 ConfigMap 不存在，Pod 啟動時會報 `CreateContainerConfigError`。順序：Namespace → Secret → ConfigMap → Deployment/Service → Ingress。

---

### ④ 學員實作

無（本節是架構引導說明）

### ⑤ 學員實作解答

無

---

## 6-9 整合實作示範（~15 min）

### ① 課程內容

📄 6-9 第 1 張

老師照九個步驟帶做，學員觀看。每個步驟說明指令後確認輸出正確再繼續。

---

### ② 所有指令＋講解

**Step 1：建 Namespace**

📄 6-9 第 2 張

```bash
kubectl create namespace my-app
```

- `create namespace`：直接建 Namespace，不需要 YAML
- `my-app`：接下來所有資源都要加 `-n my-app`

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

- `STATUS: Active`：Namespace 正常（`Terminating` 代表正在刪除中）

---

**Step 2：建 Secret**

📄 6-9 第 3 張

```bash
kubectl create secret generic mysql-secret \
  --from-literal=MYSQL_ROOT_PASSWORD=rootpassword123 \
  -n my-app
```

- `create secret generic`：建立通用類型 Secret（generic 存任意 key-value，最常用）
- `mysql-secret`：名稱，後面 MySQL Deployment 的 `envFrom` 會引用這個名稱
- `--from-literal=MYSQL_ROOT_PASSWORD=rootpassword123`：直接從指令列輸入 key=value
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

- `TYPE: Opaque`：通用 Secret 的類型
- `DATA: 1`：這個 Secret 裡有 1 筆 key-value

---

**Step 3：建 ConfigMap**

📄 6-9 第 4 張

MySQL 用的（直接指令建）：

```bash
kubectl create configmap mysql-config \
  --from-literal=MYSQL_DATABASE=myappdb \
  -n my-app
```

- `mysql-config`：名稱
- `MYSQL_DATABASE=myappdb`：MySQL 啟動時讀這個變數，自動建 `myappdb` 資料庫

Nginx 前端用的（value 是整個 HTML，用 YAML 方式）：

```bash
kubectl apply -f configmap-frontend.yaml
```

`configmap-frontend.yaml` 內容：

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

- `data` 底下的 key 是 `index.html`，value 是整個 HTML 內容
- `|`（pipe）：YAML 的多行字串語法，保留換行符號

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

```bash
kubectl apply -f mysql-deploy.yaml -n my-app
```

`mysql-deploy.yaml` 關鍵部分：

```yaml
spec:
  containers:
  - name: mysql
    image: mysql:8.0
    envFrom:
    - secretRef:
        name: mysql-secret       # MYSQL_ROOT_PASSWORD 注入為環境變數
    - configMapRef:
        name: mysql-config       # MYSQL_DATABASE 注入為環境變數
```

- `envFrom`：把整個 Secret 或 ConfigMap 裡的所有 key 都注入為環境變數（比 `env.valueFrom` 一個一個指定更方便）
- `secretRef` 和 `configMapRef` 可以同時列多個，K8s 合併注入

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

預期（等待過程）：
```
NAME                            READY   STATUS              RESTARTS   AGE
mysql-deploy-6b8f9d7c4-xk9p2   0/1     ContainerCreating   0          5s
mysql-deploy-6b8f9d7c4-xk9p2   1/1     Running             0          18s
```

看到 `Running` 才繼續，MySQL 需要幾秒初始化。

---

**Step 5：部署 Nginx 前端**

📄 6-9 第 6 張

```bash
kubectl apply -f frontend-deploy.yaml -n my-app
```

`frontend-deploy.yaml` 關鍵部分：

```yaml
volumeMounts:
- name: frontend-html
  mountPath: /usr/share/nginx/html/index.html  # 掛到這個路徑
  subPath: index.html                           # 只掛 ConfigMap 裡的這個 key
volumes:
- name: frontend-html
  configMap:
    name: frontend-config
```

**`subPath` 的用途**：
- 不加 `subPath`：整個 ConfigMap 的 key 都掛到 `mountPath` 這個「目錄」，Nginx 原本的其他檔案會消失
- 加 `subPath: index.html`：只把 `index.html` 這一個 key 掛到指定「檔案」路徑，不影響目錄裡其他檔案
- 規則：掛整個目錄不用 subPath；掛單一檔案一定要加 subPath

預期輸出：
```
deployment.apps/frontend-deploy created
service/frontend-svc created
```

---

**Step 6：部署 httpd API**

📄 6-9 第 7 張

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

```bash
kubectl apply -f app-ingress.yaml -n my-app
```

`app-ingress.yaml` 內容：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: my-app
spec:
  ingressClassName: traefik
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-svc
            port:
              number: 80
```

- `ingressClassName: traefik`：k3s 內建 Traefik，填 traefik
- `host: myapp.local`：只處理 HTTP Host header 是 `myapp.local` 的請求
- **路由順序**：Ingress 先匹配更長的路徑，`/api` 比 `/` 具體，所以 `/api/...` 走 api-svc，其他都走 frontend-svc

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

確認路由規則：

```bash
kubectl describe ingress app-ingress -n my-app
```

看 Rules 區塊：
```
Rules:
  Host         Path   Backends
  ----         ----   --------
  myapp.local
               /      frontend-svc:80 (10.42.1.5:80)
               /api   api-svc:80 (10.42.2.6:80)
```

括號裡有 Pod IP → Service 正確找到後端 Pod。

---

**Step 8：修改 /etc/hosts**

📄 6-9 第 9 張

先拿 Node IP：

```bash
kubectl get nodes -o wide
```

記下 `INTERNAL-IP`，然後加到 /etc/hosts：

```bash
sudo sh -c 'echo "192.168.1.10 myapp.local" >> /etc/hosts'
```

- 把 `192.168.1.10` 換成你的實際 Node IP
- 用 `sudo sh -c '...'` 是因為直接用 `sudo echo >> /etc/hosts` 的重新導向沒有 sudo 權限

確認加進去了：

```bash
grep myapp.local /etc/hosts
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

看到這個代表：Ingress 路由正確 → frontend-svc 正確 → frontend Pod 正確 → ConfigMap 的 index.html 正確掛載。

驗證 API：

```bash
curl http://myapp.local/api
```

預期輸出：
```html
<html><body><h1>It works!</h1></body></html>
```

驗證 MySQL（從 Pod 內部執行）：

```bash
kubectl exec -it deployment/mysql-deploy -n my-app -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
```

- `exec -it`：進入 Pod 執行互動式指令
- `deployment/mysql-deploy`：指定目標（也可以直接用 Pod 名稱）
- `--`：分隔 kubectl 參數和要執行的指令
- `-e "SHOW DATABASES;"`：執行這行 SQL 後退出（非互動式）

預期輸出：
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| myappdb            |      ← ConfigMap 裡 MYSQL_DATABASE 的值
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

看到 `myappdb` 就代表 ConfigMap 的值正確注入到 MySQL 了。

---

### ③ QA

**Q：`envFrom` 和 `env.valueFrom` 有什麼差？**

A：`envFrom` 把整個 ConfigMap 或 Secret 裡的所有 key 都注入為環境變數，一次搞定。`env.valueFrom` 要一個一個指定 key，適合只需要引用特定幾個 key 的場景。資源少的時候 `valueFrom` 更精確，資源多的時候 `envFrom` 更方便。

**Q：為什麼 `kubectl exec` 的指令要加 `--`？**

A：`--` 是 kubectl 的參數分隔符號，前面是 kubectl 的參數（`-it`、`-n my-app`），後面是要在容器裡執行的指令（`mysql -u root ...`）。沒有 `--` 的話，kubectl 不知道哪裡開始是容器指令，特別是容器指令有 `-` 開頭的 flag 時，kubectl 會誤解析。

---

### ④ 學員實作

📄 6-9 第 11 張

按照九個步驟，在 `my-app` Namespace 裡建出完整架構：

1. 建 Namespace `my-app`
2. 建 Secret `mysql-secret`（`MYSQL_ROOT_PASSWORD` 自己決定，要記住）
3. 建 ConfigMap `mysql-config`（`MYSQL_DATABASE=mydb`，改成自己的資料庫名稱）
4. 建 ConfigMap `frontend-config`（index.html 改成自己的名字，例如 `<h1>Andy's App</h1>`）
5. 部署 MySQL + Service
6. 部署 Nginx 前端 + Service
7. 部署 httpd API + Service
8. 建 Ingress（host 用 `myapp.local`）
9. 修改 /etc/hosts
10. `curl http://myapp.local` 看到自己的名字 ✓
11. `curl http://myapp.local/api` 看到 "It works!" ✓
12. `kubectl exec` 進 MySQL Pod，`SHOW DATABASES;` 確認自己設定的資料庫名稱有出現 ✓

**挑戰：加第三個服務**

在 Ingress 加 `/admin` 路徑，導向新的 Deployment（image 自選，例如 `nginx:1.25`）：

1. 建 `admin-deploy` Deployment 和 `admin-svc` Service（`namespace: my-app`）
2. 在 `app-ingress.yaml` 的 rules 裡加 `/admin` 路徑
3. `kubectl apply -f app-ingress.yaml -n my-app`（apply 會更新，不用重建）
4. `curl http://myapp.local/admin` 看到 admin 服務的回應 ✓

---

### ⑤ 學員實作解答

📄 6-9 第 12 張

**必做解答**

Step 3 的 ConfigMap 差異（改資料庫名稱和前端內容）：

```bash
kubectl create configmap mysql-config \
  --from-literal=MYSQL_DATABASE=mydb \
  -n my-app
```

`configmap-frontend.yaml` 中改 HTML 內容：
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
curl http://myapp.local                                           # 前端有姓名
curl http://myapp.local/api                                       # API 有回應
kubectl exec -it deployment/mysql-deploy -n my-app -- \
  mysql -u root -p<你的密碼> -e "SHOW DATABASES;"                 # MySQL 有自訂資料庫名稱
```

**挑戰解答（加 /admin）**

```yaml
# admin-deploy.yaml
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

在 `app-ingress.yaml` 的 `paths` 裡加：
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
curl http://myapp.local/admin    # → nginx 預設頁面
```

---

## 6-10 回頭操作 Loop 3（~5 min）

### ① 課程內容

📄 6-10 第 1 張

確認整個架構的全局狀態，排查三個常見坑，清理環境，銜接下午的 PV/PVC。

---

### ② 所有指令＋講解

**查看 Namespace 全局狀態**

```bash
kubectl get all -n my-app
```

預期輸出（三個 Pod 都 Running）：
```
NAME                                   READY   STATUS    RESTARTS   AGE
pod/api-deploy-7c4b9d8f3-mn5s2        1/1     Running   0          8m
pod/frontend-deploy-5d9f8c6b4-pq3r1   1/1     Running   0          9m
pod/mysql-deploy-6b8f9d7c4-xk9p2      1/1     Running   0          12m

NAME                   TYPE        CLUSTER-IP      PORT(S)    AGE
service/api-svc        ClusterIP   10.96.45.231    80/TCP     8m
service/frontend-svc   ClusterIP   10.96.102.15    80/TCP     9m
service/mysql-svc      ClusterIP   10.96.200.88    3306/TCP   12m
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

三個常見坑：

**坑 1：忘記加 `-n my-app`**

```bash
kubectl get pods    # 看到空的，以為沒建成功，其實是在 default namespace 看
kubectl get pods -n my-app    # 正確
```

**坑 2：ConfigMap 的 index.html 忘記加 subPath**

```bash
kubectl describe pod -n my-app | grep -A5 "Mounts:"    # 看掛載方式
```

沒加 `subPath` 的現象：curl myapp.local 看到 403 或看不到自訂頁面，因為整個 Nginx html 目錄被 ConfigMap 目錄覆蓋了。

**坑 3：Ingress 的 host 和 /etc/hosts 對不上**

```bash
grep myapp /etc/hosts    # 確認 /etc/hosts 裡的域名和 Ingress YAML 的 host 完全一樣
kubectl get ingress -n my-app    # 確認 HOSTS 欄位
```

兩邊字串必須完全一樣，包括大小寫。

**清理 Namespace**

```bash
kubectl delete namespace my-app
```

預期輸出：
```
namespace "my-app" deleted
```

這一行指令會刪掉 Namespace 裡的所有資源（Pod、Service、Deployment、Ingress、ConfigMap、Secret 全部一次清）。

確認清乾淨：

```bash
kubectl get namespace my-app
```

預期輸出：
```
Error from server (NotFound): namespaces "my-app" not found
```

---

### ③ QA

**Q：`kubectl delete namespace my-app` 和 `kubectl delete -f *.yaml` 差在哪？**

A：`delete namespace` 刪掉整個 Namespace 和裡面所有資源，一行搞定，最乾淨。`delete -f` 刪除 YAML 裡定義的資源，需要你把每個 YAML 都列出來。如果資源都在同一個 Namespace 而且整個 Namespace 都要清掉，用 `delete namespace` 更快。如果只要刪部分資源，用 `delete -f`。

---

### ④ 學員實作

確認自己的環境清乾淨：

```bash
kubectl get namespace my-app
kubectl get all
```

確認 `my-app` Namespace 不存在，`get all` 只剩 `service/kubernetes`。

---

### ⑤ 學員實作解答

若 Namespace 還存在：
```bash
kubectl delete namespace my-app
```

若 my-app 不存在但有殘留資源在 default namespace：
```bash
kubectl delete deployment mysql-deploy frontend-deploy api-deploy
kubectl delete svc mysql-svc frontend-svc api-svc
kubectl delete ingress app-ingress
```
