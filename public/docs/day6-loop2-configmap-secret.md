# Day 6 Loop 2 — ConfigMap + Secret

---

## 6-5 ConfigMap + Secret 概念（~15 min）

### ① 課程內容

📄 6-5 第 1 張

**設定寫死的三個問題**

好，先問你一個問題。

你有一個 Node.js 或 Java 的應用程式，裡面要連資料庫。你的 Dockerfile 裡面或程式碼裡面，直接把 `DB_HOST=localhost`、`DB_PASSWORD=mypassword` 寫死在裡面——這樣做，會有什麼問題？

你可能會想「先能動就好」，但這樣做有三個麻煩：

第一個問題：**環境不同**。你的 dev 環境連的是 `db-dev.internal`，prod 環境連的是 `db-prod.internal`。設定寫死的話，要 build 兩個不同的 Image，dev 一個、prod 一個。Image 一多，版本就亂了，到底哪個是哪個？

第二個問題：**密碼外洩**。密碼寫在 Dockerfile 裡，然後 push 到 Docker Hub 或公司的 Registry——全世界都能看到你的密碼。就算是私有 Registry，工程師離職了、Registry 設定被改了，密碼就外洩了。

第三個問題：**改設定要重建 Image**。只是把 log level 從 `info` 改成 `debug`，就要重新 build Image、重新 push、重新部署。這不合理。

所以 K8s 的解法是：**把設定和程式碼分開放**。程式碼打進 Image，設定存在 ConfigMap 或 Secret，部署時再注入進去。

---

📄 6-5 第 2 張

**ConfigMap 是什麼**

ConfigMap 就是 K8s 用來存放「一般設定」的資源。你可以把它想像成一個裝 key-value 的盒子，建好之後，Pod 可以用環境變數或 Volume 的方式把設定拿進來用。

ConfigMap 有三種建立方式：

**方式 1：`--from-literal`，直接在指令裡給值**

```bash
kubectl create configmap app-config \
  --from-literal=APP_ENV=production \
  --from-literal=LOG_LEVEL=info
```

適合設定少、快速測試的時候用。

**方式 2：`--from-file`，從檔案讀**

```bash
kubectl create configmap nginx-conf \
  --from-file=nginx.conf
```

ConfigMap 的 key 是檔案名稱，value 是整個檔案內容。適合把整份設定檔（像 nginx.conf）塞進 ConfigMap。

**方式 3：YAML**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
```

注意 `apiVersion: v1`，ConfigMap 是核心資源，不需要 `apps/v1`。

---

📄 6-5 第 3 張

**兩種注入方式：環境變數 vs Volume 掛載**

ConfigMap 建好之後，怎麼讓 Pod 拿到這些設定？有兩種方法，各有適用的情境：

| 方式 | 用法 | 更新行為 | 適合 |
|------|------|---------|------|
| 環境變數 | `envFrom` / `env.valueFrom` | 改了要重啟 Pod | 簡單 key-value |
| Volume 掛載 | `volumes` + `volumeMounts` | 自動更新 30-60 秒 | 設定檔（nginx.conf）|

環境變數注入：Pod 啟動時把 ConfigMap 的值讀進來，變成環境變數。但環境變數是「啟動時抓一次」，改了 ConfigMap 之後，已跑的 Pod 看到的還是舊值，要 `rollout restart` 才會拿到新的。

Volume 掛載：把 ConfigMap 的 value 掛成一個檔案，Pod 可以像讀檔案一樣讀設定。這種方式 K8s 會自動同步更新，大概 30 到 60 秒後 Pod 看到的檔案內容就會是新的。

有個重要的坑要記一下：**`subPath` 掛載不會自動更新**。如果你的 volumeMounts 用了 `subPath`，改 ConfigMap 之後 Pod 裡的檔案不會跟著更新，跟環境變數一樣，要重啟 Pod 才有效。整個目錄掛載才會自動更新。

---

📄 6-5 第 4 張

**ConfigMap vs Secret**

那密碼呢？密碼不能用 ConfigMap，要用 Secret。

| | ConfigMap | Secret |
|--|-----------|--------|
| 用途 | 一般設定（log level、DB host）| 密碼、API Key、憑證 |
| 儲存 | 明文 | Base64 編碼（不是加密！）|
| `kubectl describe` | 直接看到值 | 只顯示大小，不顯示值 |
| Docker 對照 | `-e KEY=value` | `.env` 的密碼 |

**Base64 不是加密，這個很重要。**

```bash
echo -n "my-secret-pw" | base64
# → bXktc2VjcmV0LXB3
```

看起來是亂碼，但這不是加密。任何人只要執行：

```bash
echo "bXktc2VjcmV0LXB3" | base64 -d
# → my-secret-pw
```

馬上就解回明文了。所以 Secret 的安全性不是靠 Base64 編碼，靠的是 **RBAC**——控制誰能讀這個 Secret。Base64 只是讓 binary 資料（例如憑證）可以放進 YAML 欄位而已。

---

📄 6-5 第 5 張

**Secret 三種類型**

| 類型 | 用途 |
|------|------|
| `Opaque` | 通用（最常用）— 密碼、API Key |
| `kubernetes.io/tls` | TLS 憑證（Ingress HTTPS）|
| `kubernetes.io/dockerconfigjson` | Docker Registry 認證（拉私有 Image）|

日常用的幾乎都是 `Opaque`，就是「不透明」的意思——K8s 不知道裡面裝什麼，完全由你自己定義。

**Sealed Secret 簡單提一下**

生產環境常見的做法是用 Sealed Secret：用 RSA 加密把 Secret 加密成 SealedSecret，這個加密過的結果才能安全地放進 Git。這個進階主題我們這堂不深入，你知道有這個方案就好。

---

📄 6-5 第 6 張

**Docker 對照**

你已經會 Docker 了，所以快速對照一下：

- `docker run -e APP_ENV=production` → ConfigMap 環境變數注入
- `.env` 檔案裡的密碼 → Secret
- `-v ./nginx.conf:/etc/nginx/nginx.conf` → ConfigMap Volume 掛載

概念是一樣的，K8s 只是把「在哪個機器跑」這件事從 Docker 的責任移走，讓 Scheduler 決定。

---

### ② 所有指令＋講解

本節以概念為主，指令集中於 6-6 實作。

---

### ③ 題目

1. 以下三種情境，各適合用 ConfigMap 環境變數注入還是 Volume 掛載？說明理由。
   - (A) 應用程式需要讀取 `APP_ENV=production` 和 `LOG_LEVEL=debug`
   - (B) Nginx 需要讀取完整的 `nginx.conf` 設定檔
   - (C) 你想改設定後讓 Pod 自動拿到新值，不需要重啟

2. 說明 Base64 為什麼不是加密？Secret 的安全性實際上靠什麼保護？

3. 有工程師說「Secret 比 ConfigMap 安全多了，密碼就算被人拿到也看不懂」，這句話哪裡有問題？

---

### ④ 解答

1. 三種情境：
   - (A) ConfigMap 環境變數注入（`envFrom` 或 `env.valueFrom`）。簡單的 key-value，環境變數注入最直覺。
   - (B) ConfigMap Volume 掛載（`volumes` + `volumeMounts`）。整份設定檔要掛成 `/etc/nginx/nginx.conf`，環境變數做不到。
   - (C) Volume 掛載，且不能用 `subPath`。只有整目錄 Volume 掛載才會在 ConfigMap 更新後 30-60 秒自動同步。環境變數注入和 `subPath` 掛載都需要重啟 Pod。

2. Base64 只是一種編碼方式，把 binary 資料轉成可印字元，任何人都能直接解碼（`base64 -d`）。沒有金鑰，沒有演算法保護，本質上是明文。Secret 的安全性靠 RBAC——只有有 `get secret` 權限的 ServiceAccount 或使用者才能讀取 Secret 的內容。

3. 這句話有問題。`echo "bXktc2VjcmV0LXB3" | base64 -d` 一秒解回明文。「看不懂」是錯的。Secret 的保護來自 RBAC 存取控制，不是 Base64 編碼。如果 RBAC 沒設好，Secret 的 yaml 被 `kubectl get secret -o yaml` 拿到，馬上就能解出密碼。

---

## 6-6 ConfigMap + Secret 實作（~15 min）

### ① 課程內容

📄 6-6 第 1 張

**本節實作流程**

好，概念說完了，來動手。這節有四個步驟：

1. ConfigMap 環境變數注入——改了設定，觀察 Pod 不自動更新
2. ConfigMap Volume 掛載——改了設定，觀察 30-60 秒自動更新
3. 建立 Secret 並觀察 Base64 行為
4. 整合——MySQL 同時用 Secret + ConfigMap

這四個步驟對應 lab repo 裡的四個 YAML 檔：`configmap-literal.yaml`、`configmap-nginx.yaml`、（Secret 直接用指令建）、`secret-db.yaml`。

---

📄 6-6 第 2 張

**Step 1：ConfigMap 環境變數注入**

`configmap-literal.yaml` 長這樣：

```yaml
# 6-6 Step 1：ConfigMap 環境變數注入
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  API_URL: "https://api.example.com"
  MAX_CONNECTIONS: "100"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-with-config
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app-with-config
  template:
    metadata:
      labels:
        app: app-with-config
    spec:
      containers:
      - name: app
        image: busybox:1.36
        command: ["sh", "-c", "env && sleep 3600"]
        envFrom:
        - configMapRef:
            name: app-config
```

注意 `envFrom` 和 `configMapRef`——這是「整個 ConfigMap 一次全部注入」的寫法。Pod 啟動時，ConfigMap 裡的所有 key 都會變成環境變數。

`command: ["sh", "-c", "env && sleep 3600"]`：容器啟動後先印出所有環境變數，再 sleep 3600 秒（讓我們有時間進去看）。

---

📄 6-6 第 3 張

**Step 2：ConfigMap Volume 掛載**

`configmap-nginx.yaml` 長這樣：

```yaml
# 6-6 Step 2：ConfigMap Volume 掛載（自動更新）
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  default.conf: |
    server {
      listen 80;
      location / {
        return 200 'Hello from ConfigMap\n';
      }
      location /healthz {
        return 200 'OK\n';
      }
    }
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-custom
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-custom
  template:
    metadata:
      labels:
        app: nginx-custom
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
        volumeMounts:
        - name: nginx-conf
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: nginx-conf
        configMap:
          name: nginx-config
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-custom-svc
spec:
  selector:
    app: nginx-custom
  ports:
  - port: 80
    targetPort: 80
```

注意 `volumes` 和 `volumeMounts` 的結構：
- `volumes` 在 `spec` 底下，跟 `containers` 同層，宣告「有一個叫 `nginx-conf` 的 volume，來源是 ConfigMap `nginx-config`」
- `volumeMounts` 在 `containers` 底下，說「把 `nginx-conf` 掛到 `/etc/nginx/conf.d`」

ConfigMap 的 `default.conf` key 對應到掛載後的檔案名稱，所以掛進去後就是 `/etc/nginx/conf.d/default.conf`。

---

📄 6-6 第 4 張

**Step 4：整合 YAML（MySQL 用 Secret + ConfigMap）**

`secret-db.yaml` 長這樣：

```yaml
# 6-6 Step 4：整合 — MySQL 同時用 Secret + ConfigMap
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: "rootpassword123"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-config
data:
  MYSQL_DATABASE: "myappdb"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deploy
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
        envFrom:
        - secretRef:
            name: db-secret
        - configMapRef:
            name: db-config
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-svc
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
```

這裡用 `stringData` 而不是 `data`——`stringData` 讓你直接寫明文，K8s 會自動幫你做 Base64；`data` 欄位的值必須是 Base64。寫 YAML 時用 `stringData` 比較方便，不用自己先跑 `base64`。

`envFrom` 可以同時列多個來源（一個 secretRef + 一個 configMapRef），K8s 會把兩邊的 key 全部合併注入。

---

### ② 所有指令＋講解

---

**Step 1：套用 ConfigMap 環境變數注入**

```bash
kubectl apply -f configmap-literal.yaml
```

- `apply -f`：宣告式套用，`-f` 是 file 的縮寫

打完要看：
```
configmap/app-config created
deployment.apps/app-with-config created
```

---

**確認環境變數有注入**

```bash
kubectl logs deployment/app-with-config | head -20
```

- `logs deployment/<name>`：直接看 Deployment 底下 Pod 的 log，不用先查 Pod 名稱
- `head -20`：只顯示前 20 行

打完要看：
```
APP_ENV=production
LOG_LEVEL=info
API_URL=https://api.example.com
MAX_CONNECTIONS=100
KUBERNETES_SERVICE_HOST=10.96.0.1
...
```

`APP_ENV`、`LOG_LEVEL` 這些都是從 ConfigMap 注入進來的。

---

**改 ConfigMap，觀察 Pod 不自動更新**

```bash
kubectl edit configmap app-config
```

- `edit configmap <name>`：直接用預設編輯器（通常是 vi）開啟資源，存檔後立刻生效

進去把 `LOG_LEVEL: "info"` 改成 `LOG_LEVEL: "debug"`，存檔退出。

打完要看：
```
configmap/app-config edited
```

馬上查：
```bash
kubectl logs deployment/app-with-config | grep LOG_LEVEL
```

打完要看：
```
LOG_LEVEL=info
```

還是 `info`！因為 Pod 是啟動時才抓環境變數，已跑的 Pod 不會重新讀 ConfigMap。

---

**重啟 Deployment，讓 Pod 拿到新設定**

```bash
kubectl rollout restart deployment/app-with-config
```

- `rollout restart`：觸發滾動重啟，建新 Pod、刪舊 Pod，新 Pod 啟動時才會讀到更新後的 ConfigMap

等 Pod 重啟完：
```bash
kubectl logs deployment/app-with-config | grep LOG_LEVEL
```

打完要看：
```
LOG_LEVEL=debug
```

現在才是 `debug`。

---

**Step 2：套用 ConfigMap Volume 掛載**

```bash
kubectl apply -f configmap-nginx.yaml
```

打完要看：
```
configmap/nginx-config created
deployment.apps/nginx-custom created
service/nginx-custom-svc created
```

---

**確認設定檔有掛進去**

```bash
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

- `exec deploy/<name>`：直接對 Deployment 底下的 Pod 執行指令
- `--`：分隔 kubectl 指令和容器內要跑的指令（固定語法，代表「後面是給容器的指令」）
- `cat /etc/nginx/conf.d/default.conf`：讀取掛進去的設定檔

打完要看：
```
server {
  listen 80;
  location / {
    return 200 'Hello from ConfigMap\n';
  }
  location /healthz {
    return 200 'OK\n';
  }
}
```

---

**用 port-forward 測試 Nginx**

```bash
kubectl port-forward svc/nginx-custom-svc 8080:80 &
```

- `port-forward svc/<name>`：把叢集內的 Service 暫時通到本機，`&` 讓它在背景跑
- `8080:80`：本機 8080 → Service 80

打完要看：
```
Forwarding from 127.0.0.1:8080 -> 80
```

```bash
curl http://localhost:8080/healthz
```

打完要看：
```
OK
```

---

**改 ConfigMap，觀察自動更新**

```bash
kubectl edit configmap nginx-config
```

把 `return 200 'OK\n';` 改成 `return 200 'HEALTHY\n';`，存檔退出。

等 30 到 60 秒，然後：

```bash
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

打完要看（檔案已更新）：
```
server {
  listen 80;
  location / {
    return 200 'Hello from ConfigMap\n';
  }
  location /healthz {
    return 200 'HEALTHY\n';
  }
}
```

檔案更新了！但 Nginx 本身還沒 reload，所以：

```bash
curl http://localhost:8080/healthz
```

打完要看：
```
OK
```

還是舊的。Volume 自動更新的是「檔案內容」，不是讓 Nginx 重新讀設定。要讓 Nginx 生效，要手動 reload：

```bash
kubectl exec deploy/nginx-custom -- nginx -s reload
curl http://localhost:8080/healthz
```

打完要看：
```
HEALTHY
```

現在才對。

```bash
kill %1
```

- `kill %1`：停掉背景的第 1 個 job（port-forward）

---

**Step 3：建立 Secret + 觀察 Base64**

```bash
kubectl create secret generic db-cred \
  --from-literal=username=admin \
  --from-literal=password=my-secret-pw
```

- `create secret generic`：建立 Opaque 類型的 Secret（`generic` 就是 Opaque 的別名）
- `--from-literal=username=admin`：直接在指令裡給 key-value，不需要先做 Base64

打完要看：
```
secret/db-cred created
```

---

**describe Secret，確認只顯示大小**

```bash
kubectl describe secret db-cred
```

打完要看：
```
Name:         db-cred
Namespace:    default
Type:  Opaque

Data
====
password:  12 bytes
username:  5 bytes
```

`describe` 保護 Secret，只顯示幾個 bytes，不顯示值。

---

**get Secret -o yaml，看到 Base64**

```bash
kubectl get secret db-cred -o yaml
```

- `-o yaml`：以 YAML 格式輸出，會顯示完整的 data 欄位

打完要看：
```yaml
apiVersion: v1
data:
  password: bXktc2VjcmV0LXB3
  username: YWRtaW4=
kind: Secret
...
```

---

**解碼 Base64**

```bash
echo "bXktc2VjcmV0LXB3" | base64 -d
```

打完要看：
```
my-secret-pw
```

所以 `kubectl get secret -o yaml` 能拿到 Base64，`base64 -d` 能解回明文。Secret 的保護靠 RBAC，不是靠 Base64。

---

**Step 4：整合 MySQL 用 Secret + ConfigMap**

```bash
kubectl apply -f secret-db.yaml
```

打完要看：
```
secret/db-secret created
configmap/db-config created
deployment.apps/mysql-deploy created
service/mysql-svc created
```

---

**等 MySQL 起來**

```bash
kubectl get pods -l app=mysql -w
```

- `-l app=mysql`：只顯示 label `app=mysql` 的 Pod（`-l` 是 label selector 的縮寫，`l` 是 label）
- `-w`：watch 模式，有變化會自動更新

打完要看（等幾十秒）：
```
NAME                            READY   STATUS              RESTARTS   AGE
mysql-deploy-5d7f9b8c4d-abc12   0/1     ContainerCreating   0          5s
mysql-deploy-5d7f9b8c4d-abc12   1/1     Running             0          30s
```

看到 `1/1 Running` 後按 `Ctrl+C` 停 watch。

---

**進 MySQL 確認 database 建立**

```bash
kubectl exec -it deployment/mysql-deploy -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
```

- `-it`：`-i` 保持 stdin 開啟（互動），`-t` 分配 tty（終端機），這裡因為用 `-e` 直接跑指令，`-it` 不是絕對必要，但加了比較保險
- `mysql -u root -prootpassword123`：用 root 帳號、密碼 rootpassword123 登入（`-p` 後面直接接密碼，不能有空格）
- `-e "SHOW DATABASES;"`：執行完這段 SQL 就退出

打完要看：
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| myappdb            |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

`myappdb` 在這裡，是從 ConfigMap 的 `MYSQL_DATABASE=myappdb` 來的。

---

**學員實作題說明**

好，看完示範，換你自己做。

**必做**：建一個 ConfigMap（`MYSQL_DATABASE=testdb`）和一個 Secret（`MYSQL_ROOT_PASSWORD` 自己設）→ MySQL Pod 用 `envFrom` 同時引用兩者 → 進 MySQL 確認 `testdb` 存在。

**挑戰**：用 Volume 掛載方式把自訂 `nginx.conf` 掛進 Nginx → 改 ConfigMap → 等待自動更新 → 觀察 Pod 裡的檔案變了，但 Nginx 回應還是舊的 → 手動 `nginx -s reload` 讓它生效。

---

### ③ 題目

**必做題 1**

你要部署一個 Redis，它需要以下設定：
- `REDIS_PASSWORD=my-redis-pw`（敏感，要用 Secret）
- `REDIS_MAXMEMORY=256mb`（一般設定，用 ConfigMap）

請建立對應的 Secret 和 ConfigMap，再寫一個 Deployment 用 `envFrom` 同時引用兩者。

驗收：`kubectl exec` 進 Pod，用 `env | grep REDIS` 確認兩個環境變數都存在。

---

**必做題 2**

以下 YAML 有兩個錯誤，找出來並說明後果：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-conf
data:
  APP_ENV: production
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: busybox:1.36
        command: ["sh", "-c", "env && sleep 3600"]
        envFrom:
        - configMapRef:
            name: app-config   # ← 注意這裡
        volumeMounts:
        - name: conf-vol
          mountPath: /etc/conf
      volumes:
      - name: conf-vol
        configMap:
          name: another-config  # ← 還有這裡
```

---

**挑戰題**

你的 Nginx 用 ConfigMap Volume 掛載了 `nginx.conf`。有工程師說：「我把 `nginx.conf` 的某個 `location` 改成回傳 403，apply 完 30 秒後 `curl` 還是回 200，一定是 Volume 沒更新」。

請解釋：Volume 更新和 Nginx 生效是兩件事，說明完整的更新流程。

---

### ④ 解答

**必做題 1**

```bash
# 建 Secret
kubectl create secret generic redis-secret \
  --from-literal=REDIS_PASSWORD=my-redis-pw

# 建 ConfigMap
kubectl create configmap redis-config \
  --from-literal=REDIS_MAXMEMORY=256mb
```

Deployment YAML：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: busybox:1.36
        command: ["sh", "-c", "env && sleep 3600"]
        envFrom:
        - secretRef:
            name: redis-secret
        - configMapRef:
            name: redis-config
```

驗收：
```bash
kubectl exec deployment/redis-deploy -- env | grep REDIS
```

預期輸出：
```
REDIS_PASSWORD=my-redis-pw
REDIS_MAXMEMORY=256mb
```

---

**必做題 2**

錯誤 1：`configMapRef.name: app-config`，但 ConfigMap 的名稱是 `app-conf`（少了 `iguration` 的縮寫差異，實際是 `app-config` vs `app-conf`）。後果：Pod 啟動時找不到 ConfigMap，Pod 狀態會是 `CreateContainerConfigError`，`kubectl describe pod` 的 Events 會顯示 `configmap "app-config" not found`。

錯誤 2：`volumes` 裡 `configMap.name: another-config`，但叢集裡沒有這個 ConfigMap。後果：同上，Pod 無法建立，卡在 `Pending` 或 `CreateContainerConfigError`。

---

**挑戰題**

完整流程分成兩步：

**第一步：Volume 檔案更新（K8s 自動，30-60 秒）**

`kubectl edit configmap nginx-config` 存檔後，K8s 的 kubelet 會在 30-60 秒內把新內容同步到掛載的 Volume 檔案。可以用 `kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/nginx.conf` 確認檔案已更新。

**第二步：Nginx reload（手動）**

Nginx 程式本身不知道設定檔被改了，它還是在用記憶體裡的舊設定。要讓 Nginx 讀新設定，需要手動：

```bash
kubectl exec deploy/nginx-custom -- nginx -s reload
```

`-s reload` 傳 reload signal 給 Nginx master process，它會 graceful reload（不中斷連線）。

`curl` 看到 200 不代表 Volume 沒更新，只代表 Nginx 還沒 reload。先 `cat` 確認檔案，再 reload，再 `curl` 確認。

---

## 6-7 回頭操作 Loop 2（~5 min）

### ① 課程內容

📄 6-7 第 1 張

**快速回顧：四個步驟做了什麼**

好，剛才做了四個步驟，來整理一下：

1. **ConfigMap 環境變數注入**：`envFrom: configMapRef`，整個 ConfigMap 一次全部注入。改了 ConfigMap 要 `rollout restart` 才生效。
2. **ConfigMap Volume 掛載**：`volumes: configMap + volumeMounts`。改了 ConfigMap 30-60 秒自動更新，但程式本身要 reload 才能讀到新設定。
3. **Secret 建立與觀察**：`kubectl create secret generic`，`describe` 只顯示大小，`get -o yaml` 看到 Base64，`base64 -d` 解回明文。
4. **整合**：`envFrom` 同時列多個 `secretRef` + `configMapRef`，K8s 把兩邊 key 合併注入。

---

📄 6-7 第 2 張

**三個常見坑**

第一個坑：`envFrom` vs `env.valueFrom` 搞混。

`envFrom` 是整個 ConfigMap 一次注入，所有 key 全部變成環境變數。

`env.valueFrom` 是逐一指定，只注入你要的那幾個 key：

```yaml
env:
- name: MY_ENV
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: APP_ENV
```

兩種都是合法的，但 `envFrom` 簡單、`env.valueFrom` 細緻。用錯了不會報錯，但可能拿不到你要的值。

---

第二個坑：`subPath` 掛載不會自動更新。

如果你的 volumeMounts 長這樣：

```yaml
volumeMounts:
- name: nginx-conf
  mountPath: /etc/nginx/nginx.conf
  subPath: nginx.conf          # ← 用了 subPath
```

`subPath` 是把 ConfigMap 裡的特定 key 掛成一個「單獨檔案」，不是整個目錄。這種方式 K8s 不會自動同步更新，改了 ConfigMap 之後，Pod 裡的檔案不會跟著改。要更新，只能 `rollout restart`。

整個目錄掛載（不用 subPath）才會自動更新。

---

第三個坑：Secret YAML 的 `data` 欄位必須是 Base64。

如果你直接在 YAML 裡寫 Secret，用 `data` 欄位的話，值必須是 Base64：

```yaml
# 這樣會錯——data 欄位必須是 Base64
data:
  password: my-secret-pw   # 錯！這是明文

# 正確寫法一：data + Base64
data:
  password: bXktc2VjcmV0LXB3   # echo -n "my-secret-pw" | base64

# 正確寫法二：stringData + 明文（K8s 自動做 Base64）
stringData:
  password: my-secret-pw        # 直接寫明文
```

`stringData` 是比較方便的寫法，K8s 存進去的時候會自動做 Base64 轉換。實際查 `kubectl get secret -o yaml` 還是會看到 Base64，因為 etcd 裡存的永遠是 Base64。

---

📄 6-7 第 3 張

**銜接下一個 Loop**

好，現在設定和密碼的部分都搞定了：一般設定用 ConfigMap，敏感資訊用 Secret，Pod 透過 `envFrom` 或 Volume 掛載拿到設定。

下一個 Loop 我們要把這堂所有東西串起來，做一個完整的整合：前端、後端、資料庫，全部用 Deployment 管理，設定用 ConfigMap + Secret 注入，再加 Service 讓它們互相連通。

OK，先做學員實作，做完我們繼續。

---

### ② 所有指令＋講解

**清理本節資源（操作前確認環境）**

```bash
kubectl get all
```

打完要看：確認目前叢集有哪些資源還在跑。

如果要清理本節建的東西：

```bash
kubectl delete deployment app-with-config nginx-custom mysql-deploy
kubectl delete service nginx-custom-svc mysql-svc
kubectl delete configmap app-config nginx-config db-config
kubectl delete secret db-cred db-secret
```

---

**確認環境乾淨**

```bash
kubectl get pods
```

打完要看：
```
No resources found in default namespace.
```

---

### ③ 題目

（本節無新題目）

---

### ④ 解答

（本節無新解答）
