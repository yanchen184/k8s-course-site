# Day 6 Loop 2 — ConfigMap + Secret

---

## 6-5 ConfigMap + Secret 概念（~5 min）

### ① 課程內容

📄 6-5 第 1 張

問你一個問題。你有一個 API 服務要連 MySQL，密碼怎麼設定？你可能會在 YAML 裡這樣寫：

```yaml
env:
  - name: DB_PASSWORD
    value: "my-secret-password"
```

這樣寫有三個問題。

第一，**安全問題**。密碼寫死在 YAML，YAML 推到 Git，全世界都看得到。你可能說「我設 private repo」，但 CI log、同事的電腦、staging 環境——洩漏的機會非常多。

第二，**改設定太麻煩**。你換了 DB 密碼，要改 YAML，重新 `kubectl apply`，Pod 重建。如果密碼是寫在 Image 裡面的 config file，那更麻煩——要重新 build Image、push、再 deploy，光這樣就半小時不見了。

第三，**多環境問題**。dev 的 DB_HOST 是 `db.dev.internal`，prod 是 `db.prod.internal`。設定寫死，你就得維護兩份 YAML 或兩個 Image。

K8s 的解法是把設定和程式碼分開。程式碼打進 Image，設定存在獨立的物件——**ConfigMap** 或 **Secret**，部署時再注入進去。Image 不用換，設定改了 apply 一下就好。

---

📄 6-5 第 2 張

**ConfigMap 跟 Secret 有什麼差？**

很多人第一次接觸會搞混。其實他們的用法幾乎一樣，差別只在「存什麼」和「K8s 怎麼保護它」。

| | ConfigMap | Secret |
|:---|:---|:---|
| 適合存什麼 | 一般設定（DB_HOST、LOG_LEVEL、API_URL、PORT）| 敏感資料（密碼、API Key、Token、憑證）|
| 儲存方式 | 明文 | Base64 編碼（不是加密！）|
| 存取控制 | 一般 RBAC | RBAC + 可設定 etcd 加密 + 更嚴格的存取限制 |
| 看得到值嗎 | `kubectl describe` 直接看到 | `kubectl describe` 只顯示大小，不顯示值 |

補充一下表格裡出現的 RBAC。RBAC 全名 Role-Based Access Control，角色權限控制，決定「誰（哪個 ServiceAccount 或使用者）可以對哪種資源做什麼操作」。舉例來說，你可以設定某個 Pod 只能讀 ConfigMap，不能讀 Secret。Day 7 會再深入講。

這裡要特別說一件事：**Base64 不是加密**。你一秒就可以解回明文。Secret 的安全性靠的是 RBAC——K8s 透過存取控制決定誰能 `get secret`，不是靠 Base64 保密。所以 Secret 跟 ConfigMap 的根本差異是「K8s 的存取控制機制不一樣」，而不是「加密了所以安全」。

用法上，兩個都可以用環境變數注入，也都可以掛載成檔案，結構幾乎一樣。

---

📄 6-5 第 3 張

**今天做四件事**

1. ConfigMap 環境變數注入（改了要重啟，不會自動更新）
2. ConfigMap Volume 掛載（改了 30 秒自動更新，但程式要自己 reload）
3. Secret 建立與 Base64 觀察（親眼看到 Base64 有多不安全）
4. Demo App 整合：同時用 ConfigMap 管訊息設定 + Secret 管密碼，curl 驗收

把密碼從 YAML 裡抽出來進 Secret，把設定從 YAML 抽出來進 ConfigMap。這是 K8s 最標準的做法，不管什麼專案都用得上。好，開始做。

---

## 6-6 ConfigMap + Secret 實作（~20 min）

### ② 所有指令＋講解

**Step 1：ConfigMap 環境變數注入**

先看 `configmap-literal.yaml` 的重點結構：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  MESSAGE: "Hello from ConfigMap"
  USERNAME: "admin"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deploy
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
      - name: app
        image: yanchen184/k8s-demo-app:latest
        imagePullPolicy: IfNotPresent
        envFrom:
        - configMapRef:
            name: app-config
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

重點說明：

**`apiVersion: v1`** — ConfigMap 是核心資源，不是 `apps/v1`。

**`envFrom: configMapRef`** — 整個 ConfigMap 一次全部注入，所有 key 都變成環境變數。只要特定 key 用 `env.valueFrom.configMapKeyRef`（逐一指定）。

```bash
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/configmap-literal.yaml
```

預期輸出：
```
configmap/app-config created
deployment.apps/frontend-deploy created
service/frontend-svc created
```

確認 Pod 跑起來：

```bash
kubectl get pods -l app=frontend -w
```

預期輸出：
```
NAME                               READY   STATUS    RESTARTS   AGE
frontend-deploy-xxx   1/1     Running   0          15s
```

看到 `Running` 後按 Ctrl+C。

curl 驗證 ConfigMap 有注入：

```bash
curl http://<NODE-IP>:30080/frontend
```

預期輸出：
```
Server: 10.42.x.x:80 (frontend-deploy-xxx)
Message: Hello from ConfigMap
Username: admin
Password: （未設定）
```

`Username: admin` 就是從 ConfigMap 的 `USERNAME` 注入進來的。

改 ConfigMap，觀察 Pod **不會**自動更新：

```bash
kubectl edit configmap app-config
```

找到 `USERNAME: "admin"`，改成 `USERNAME: "student"`，存檔退出。

```bash
curl http://<NODE-IP>:30080/frontend
```

預期輸出：
```
Username: admin
```

還是 `admin`！環境變數是 **Pod 啟動時抓一次**，已跑的 Pod 不會重新讀。

```bash
kubectl rollout restart deployment/frontend-deploy
kubectl get pods -l app=frontend -w
```

看到新 Pod `Running` 後按 Ctrl+C，curl 驗收：

```bash
curl http://<NODE-IP>:30080/frontend
```

預期輸出：
```
Username: student
```

現在才是 `student`，重啟後新 Pod 拿到最新的 ConfigMap 值。

---

**Step 2：ConfigMap Volume 掛載（自動更新）**

看 `configmap-nginx.yaml` 的 Volume 部分重點：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  default.conf: |
    server {
        listen 80;
        server_name localhost;
        location /healthz {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
    }
---
apiVersion: apps/v1
kind: Deployment
...
    spec:
      containers:
      - name: nginx
        image: nginx:1.27
        volumeMounts:
        - name: nginx-conf-volume
          mountPath: /etc/nginx/conf.d    # 整個目錄掛載
      volumes:
      - name: nginx-conf-volume
        configMap:
          name: nginx-config
```

`volumes` 在 `spec` 下面和 `containers` 同層，宣告 volume 來源。`volumeMounts` 在 `containers` 下面，說明掛到哪個路徑。

這裡是**整個目錄掛載**，所以 K8s 會自動同步更新。ConfigMap 的 key `default.conf` 掛進去就是 `/etc/nginx/conf.d/default.conf`。

```bash
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/configmap-nginx.yaml
```

預期輸出：
```
configmap/nginx-config created
deployment.apps/nginx-custom created
service/nginx-custom-svc created
```

確認 Pod 跑起來：

```bash
kubectl get pods -l app=nginx-custom
```

預期輸出：
```
NAME                              READY   STATUS    RESTARTS   AGE
nginx-custom-6b8d7f9c5f-xk7pq    1/1     Running   0          20s
```

確認設定檔有掛進去：

```bash
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

預期輸出：
```
server {
    listen 80;
    server_name localhost;
    location /healthz {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
```

用 NodePort 測試：

```bash
curl http://<NODE-IP>:30090/healthz
```

預期輸出：`OK`

改 ConfigMap（把 `OK` 改成 `HEALTHY`）：

```bash
kubectl edit configmap nginx-config
```

找到 `return 200 'OK';`，改成 `return 200 'HEALTHY';`，存檔退出。

**馬上** reload，不等：

```bash
kubectl exec deploy/nginx-custom -- nginx -s reload
curl http://<NODE-IP>:30090/healthz
```

預期輸出：`OK`

還是 `OK`！因為 ConfigMap 更新後，**Pod 裡的檔案還沒同步**（kubelet 每 30-60 秒才同步一次）。reload 了也沒用，因為 nginx 重讀的還是舊檔案。

等 30-60 秒，確認檔案已自動更新：

```bash
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

預期輸出（看到 `HEALTHY`）：
```
server {
    listen 80;
    server_name localhost;
    location /healthz {
        return 200 'HEALTHY';
        add_header Content-Type text/plain;
    }
}
```

檔案已更新。但 curl 還是舊的：

```bash
curl http://<NODE-IP>:30090/healthz
```

預期輸出：`OK`

Volume 自動更新的是「**檔案內容**」，Nginx 程式本身不知道設定改了。要讓設定生效，需要 reload：

```bash
kubectl exec deploy/nginx-custom -- nginx -s reload
```

預期輸出：
```
2024/01/01 00:00:00 [notice] 1#1: signal process started
```

```bash
curl http://<NODE-IP>:30090/healthz
```

預期輸出：`HEALTHY`

---

**Step 3：建立 Secret，觀察 Base64**

```bash
kubectl create secret generic db-cred \
  --from-literal=username=admin \
  --from-literal=password=my-secret-pw
```

預期輸出：
```
secret/db-cred created
```

- `create secret generic`：建立 Opaque 類型的 Secret
- `--from-literal`：直接在指令給 key-value，不需要自己做 Base64

確認建立成功：

```bash
kubectl get secret
```

預期輸出：
```
NAME      TYPE     DATA   AGE
db-cred   Opaque   2      5s
```

`describe` 只顯示大小，不顯示值：

```bash
kubectl describe secret db-cred
```

預期輸出：
```
Data
====
password:  12 bytes
username:  5 bytes
```

但 `-o yaml` 就拿到 Base64：

```bash
kubectl get secret db-cred -o yaml
```

預期輸出：
```yaml
data:
  password: bXktc2VjcmV0LXB3
  username: YWRtaW4=
```

解碼：

```bash
echo "bXktc2VjcmV0LXB3" | base64 -d
```

預期輸出：`my-secret-pw`

重點說明：**Base64 不是加密。** 任何人拿到字串都能一秒解回明文。Secret 的安全性靠 **RBAC**——控制誰能 `get secret`。Base64 只是讓 binary 資料可以放進 YAML 欄位而已。

---

**Step 4：Demo App 整合 ConfigMap + Secret（同時示範 env 注入 vs Volume 掛載）**

`secret-db.yaml` 的重點結構：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  MESSAGE: "Hello K8s"
  USERNAME: "admin"
  config.txt: |              # 這個 key 會掛成 Volume 檔案
    APP_MODE=production
    FEATURE_FLAG=false
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
stringData:
  PASSWORD: "mypassword"
---
apiVersion: apps/v1
kind: Deployment
...
    spec:
      containers:
        - name: app
          image: yanchen184/k8s-demo-app:latest
          envFrom:
            - configMapRef:
                name: app-config    # MESSAGE / USERNAME 注入為環境變數
            - secretRef:
                name: app-secret    # PASSWORD 注入為環境變數
          volumeMounts:
            - name: app-cfg
              mountPath: /etc/app   # config.txt 掛到這裡
      volumes:
        - name: app-cfg
          configMap:
            name: app-config
            items:
              - key: config.txt
                path: config.txt
```

同一份 ConfigMap，**兩種用法同時存在**：
- `MESSAGE` / `USERNAME` → `envFrom` 注入為環境變數
- `config.txt` → Volume 掛載為 `/etc/app/config.txt`

驗證用兩個端點：
- `curl /frontend` → 看環境變數（env 注入）
- `curl /config` → 看 `/etc/app/config.txt`（Volume 掛載）

```bash
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/secret-db.yaml
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/ingress-basic.yaml   # /config 路由已加入
kubectl get pods -l app=frontend -w   # 等 Running，Ctrl+C
```

curl 驗收：

```bash
curl http://<NODE-IP>/frontend
```

預期輸出：
```
Server: 10.42.x.x:80
Message: Hello K8s
Username: admin
Password: mypassword
```

```bash
curl http://<NODE-IP>/config
```

預期輸出：
```
APP_MODE=production
FEATURE_FLAG=false
```

---

**實驗：同一個 ConfigMap 改了，兩個端點的行為有什麼差？**

同時改 USERNAME（env 注入）和 config.txt（Volume 掛載）：

```bash
kubectl edit configmap app-config
```

把 `USERNAME: "admin"` 改成 `USERNAME: "newuser"`，把 `config.txt` 的 `APP_MODE=production` 改成 `APP_MODE=debug`，存檔退出。

馬上 curl 兩個端點：

```bash
curl http://<NODE-IP>/frontend   # env 注入
curl http://<NODE-IP>/config     # Volume 掛載
```

預期輸出：
```
# /frontend
Username: admin       ← 還是舊的

# /config
APP_MODE=production   ← 還是舊的（檔案還沒同步）
```

等 30-60 秒，再 curl：

```bash
curl http://<NODE-IP>/frontend
curl http://<NODE-IP>/config
```

預期輸出：
```
# /frontend
Username: admin       ← 還是舊的！env 注入不會自動更新

# /config
APP_MODE=debug        ← 自動更新了！Volume 掛載 kubelet 會同步
```

**對比出來了**：同一個 ConfigMap 改了，Volume 掛載的檔案自動更新，但 env 注入的值完全沒變。

rollout restart，env 才生效：

```bash
kubectl rollout restart deployment/frontend-deploy
kubectl get pods -l app=frontend -w    # 等 Running，Ctrl+C
curl http://<NODE-IP>/frontend
```

預期輸出：
```
Username: newuser     ← 重啟後才拿到新的 ConfigMap 值
```

**結論：**
- env 注入（`envFrom`）→ 改了要 `rollout restart` 才生效
- Volume 掛載 → 改了 30-60s 自動同步，不用重啟

---

### ③ QA

**Q：改了 ConfigMap 之後，環境變數注入和 Volume 掛載的更新行為有什麼不同？**

A：環境變數注入（`envFrom`）是 Pod 啟動時抓一次，改了 ConfigMap 不會自動更新，要 `rollout restart` 才生效。Volume 整個目錄掛載（不加 `subPath`）會在 30-60 秒內自動同步檔案內容，但程式本身不會感知到，需要程式自己 reload（如 Nginx 要 `nginx -s reload`）。

**Q：`subPath` 掛載和整個目錄掛載有什麼差？**

A：整個目錄掛載（不用 `subPath`）：ConfigMap 所有 key 都以「檔案名稱」掛到目錄，會自動同步更新。`subPath` 掛載：把 ConfigMap 的特定 key 掛成單一檔案（如 `/etc/nginx/nginx.conf`），不會自動同步更新，只能 `rollout restart`。

`subPath` 的 YAML 長這樣：

```yaml
# subPath 掛載範例：把 nginx.conf 這個 key 掛成 /etc/nginx/nginx.conf
volumeMounts:
- name: nginx-config-volume
  mountPath: /etc/nginx/nginx.conf
  subPath: nginx.conf          # 只掛這一個 key，不是整個目錄
volumes:
- name: nginx-config-volume
  configMap:
    name: nginx-config
```

**Q：Secret YAML 裡的 `data` 和 `stringData` 差在哪？**

A：`data` 欄位的值必須是 Base64 字串；`stringData` 欄位直接寫明文，K8s apply 時自動做 Base64 轉換。`kubectl get secret -o yaml` 看到的永遠是 Base64（etcd 裡存的）。寫 YAML 時用 `stringData` 比較方便。

---

## 6-7 回頭操作 Loop 2（~5 min）

### ④ 學員實作

你要部署 `yanchen184/k8s-demo-app:latest`，把設定分開管理：
- `MESSAGE: "Hello from Student"`（一般設定，用 ConfigMap）
- `USERNAME: "student"`（一般設定，用 ConfigMap）
- `PASSWORD: "student-pw"`（敏感，用 Secret）

任務：
1. 建立 ConfigMap `student-config`，包含 `MESSAGE` 和 `USERNAME`
2. 建立 Secret `student-secret`，包含 `PASSWORD`
3. 寫一個 Deployment（image: `yanchen184/k8s-demo-app:latest`，containerPort: 3000），用 `envFrom` 同時引用兩者
4. 建立 NodePort Service，nodePort 用 `30090`
5. 驗收：`curl http://<NODE-IP>:30090/frontend`，確認頁面顯示 `Username: student` 和 `Password: student-pw`

---

### ⑤ 學員實作解答

```bash
kubectl create configmap student-config \
  --from-literal=MESSAGE="Hello from Student" \
  --from-literal=USERNAME=student
```

預期輸出：
```
configmap/student-config created
```

```bash
kubectl create secret generic student-secret \
  --from-literal=PASSWORD=student-pw
```

預期輸出：
```
secret/student-secret created
```

Deployment + Service YAML：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: student-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: student
  template:
    metadata:
      labels:
        app: student
    spec:
      containers:
      - name: demo
        image: yanchen184/k8s-demo-app:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: student-config
        - secretRef:
            name: student-secret
---
apiVersion: v1
kind: Service
metadata:
  name: student-svc
spec:
  type: NodePort
  selector:
    app: student
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30090
```

```bash
kubectl apply -f student-deploy.yaml
```

預期輸出：
```
deployment.apps/student-deploy created
service/student-svc created
```

```bash
kubectl get pods -l app=student -w    # 等 Running
```

預期輸出：
```
NAME                              READY   STATUS    RESTARTS   AGE
student-deploy-5d8f7b9c4e-mn3qr   1/1     Running   0          10s
```

取得 Node IP：

```bash
kubectl get nodes -o wide
```

curl 驗收：

```bash
curl http://<NODE-IP>:30090/frontend
```

預期輸出（頁面中看到）：
```
Username: student
Password: student-pw
```

---

**清理**

```bash
# 全部清掉（最乾淨）
kubectl delete all --all
kubectl delete configmap --all
kubectl delete secret --all
```

預期輸出：
```
pod "..." deleted
deployment.apps "..." deleted
...
configmap "..." deleted
secret "..." deleted
```
