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
4. MySQL 整合：同時用 Secret 管密碼 + ConfigMap 管設定

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

重點說明：

**`apiVersion: v1`** — ConfigMap 是核心資源，不是 `apps/v1`。

**`envFrom: configMapRef`** — 整個 ConfigMap 一次全部注入，所有 key 都變成環境變數。只要特定 key 用 `env.valueFrom.configMapKeyRef`（逐一指定）。

**`command: ["sh", "-c", "env && sleep 3600"]`** — 啟動後先印出所有環境變數，再 sleep，讓我們有時間進去確認。

```bash
kubectl apply -f configmap-literal.yaml
```

預期輸出：
```
configmap/app-config created
deployment.apps/app-with-config created
```

確認 Pod 跑起來：

```bash
kubectl get pods
```

預期輸出：
```
NAME                              READY   STATUS    RESTARTS   AGE
app-with-config-7d9f5b8c4d-abc12  1/1     Running   0          15s
```

確認環境變數有注入：

```bash
kubectl logs deployment/app-with-config | head -20
```

- `logs deployment/<name>`：直接看 Deployment 底下 Pod 的 log，不用先查 Pod 名稱
- `head -20`：只看前 20 行

預期輸出：
```
APP_ENV=production
LOG_LEVEL=info
API_URL=https://api.example.com
MAX_CONNECTIONS=100
...
```

改 ConfigMap，觀察 Pod **不會**自動更新：

```bash
kubectl edit configmap app-config
```

把 `LOG_LEVEL: "info"` 改成 `LOG_LEVEL: "debug"`，存檔退出。

```bash
kubectl logs deployment/app-with-config | grep LOG_LEVEL
```

預期輸出：
```
LOG_LEVEL=info
```

還是 `info`！環境變數是 **Pod 啟動時抓一次**，已跑的 Pod 不會重新讀。

```bash
kubectl rollout restart deployment/app-with-config
```

- `rollout restart`：觸發滾動重啟，新 Pod 啟動時才讀到更新後的 ConfigMap

等新 Pod 跑起來：

```bash
kubectl get pods -w
```

看到新 Pod `Running` 後按 Ctrl+C，再查：

```bash
kubectl logs deployment/app-with-config | grep LOG_LEVEL
```

預期輸出：
```
LOG_LEVEL=debug
```

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
...
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        volumeMounts:
        - name: nginx-conf
          mountPath: /etc/nginx/conf.d    # 整個目錄掛載
      volumes:
      - name: nginx-conf
        configMap:
          name: nginx-config
```

`volumes` 在 `spec` 下面和 `containers` 同層，宣告 volume 來源。`volumeMounts` 在 `containers` 下面，說明掛到哪個路徑。

這裡是**整個目錄掛載**，所以 K8s 會自動同步更新。ConfigMap 的 key `default.conf` 掛進去就是 `/etc/nginx/conf.d/default.conf`。

```bash
kubectl apply -f configmap-nginx.yaml
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

確認設定檔有掛進去：

```bash
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

預期輸出：看到 `Hello from ConfigMap` 和 `OK`。

用 port-forward 測試：

```bash
kubectl port-forward svc/nginx-custom-svc 8080:80 &
curl http://localhost:8080/healthz
```

預期輸出：`OK`

改 ConfigMap，觀察自動更新：

```bash
kubectl edit configmap nginx-config
```

把 `return 200 'OK\n';` 改成 `return 200 'HEALTHY\n';`，存檔退出。

等 30-60 秒，確認檔案已自動更新：

```bash
kubectl exec deploy/nginx-custom -- cat /etc/nginx/conf.d/default.conf
```

檔案已更新（看到 `HEALTHY`）。但 curl 還是舊的：

```bash
curl http://localhost:8080/healthz
```

還是 `OK`！Volume 自動更新的是「**檔案內容**」，Nginx 程式本身不知道設定改了。要讓設定生效：

```bash
kubectl exec deploy/nginx-custom -- nginx -s reload
curl http://localhost:8080/healthz
```

預期輸出：`HEALTHY`

停掉 port-forward：

```bash
kill %1
```

---

**Step 3：建立 Secret，觀察 Base64**

```bash
kubectl create secret generic db-cred \
  --from-literal=username=admin \
  --from-literal=password=my-secret-pw
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

**Step 4：MySQL 整合 Secret + ConfigMap**

看 `secret-db.yaml` 的重點：

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: "rootpassword123"    # stringData 直接寫明文，K8s 自動做 Base64
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
...
        envFrom:
        - secretRef:
            name: db-secret       # 注入 Secret 的所有 key
        - configMapRef:
            name: db-config       # 注入 ConfigMap 的所有 key，兩者合併
```

**`stringData` vs `data`**：寫 YAML 用 `stringData` 比較方便，直接寫明文；用 `data` 的話值必須先做 Base64。

**`envFrom` 列多個**：K8s 把 Secret 和 ConfigMap 的所有 key 合併注入，Pod 裡同時有 `MYSQL_ROOT_PASSWORD` 和 `MYSQL_DATABASE`。

```bash
kubectl apply -f secret-db.yaml
```

預期輸出：
```
secret/db-secret created
configmap/db-config created
deployment.apps/mysql-deploy created
service/mysql-svc created
```

等 MySQL 跑起來：

```bash
kubectl get pods -l app=mysql -w
```

看到 `1/1 Running` 後按 Ctrl+C。

進 MySQL 確認 database 建立：

```bash
kubectl exec -it deployment/mysql-deploy -- \
  mysql -u root -prootpassword123 -e "SHOW DATABASES;"
```

- `-prootpassword123`：`-p` 後面直接接密碼，**不能有空格**
- `-e "SHOW DATABASES;"`：執行完這段 SQL 就退出

預期輸出：
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| myappdb            |      ← 從 ConfigMap 的 MYSQL_DATABASE 來的
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

`myappdb` 在，ConfigMap + Secret 整合成功。

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

你要部署一個 Redis 服務，需要以下設定：
- `REDIS_PASSWORD=my-redis-pw`（敏感，用 Secret）
- `REDIS_MAXMEMORY=256mb`（一般設定，用 ConfigMap）

任務：
1. 用 `kubectl create secret generic` 建 `redis-secret`
2. 用 `kubectl create configmap` 建 `redis-config`
3. 寫一個 Deployment（image: `busybox:1.36`，command: `["sh", "-c", "env && sleep 3600"]`），用 `envFrom` 同時引用兩者
4. 驗收：`kubectl exec` 進 Pod，`env | grep REDIS` 確認兩個環境變數都在

---

### ⑤ 學員實作解答

```bash
kubectl create secret generic redis-secret \
  --from-literal=REDIS_PASSWORD=my-redis-pw

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

```bash
kubectl apply -f redis-deploy.yaml
kubectl get pods -l app=redis -w    # 等 Running
kubectl exec deployment/redis-deploy -- env | grep REDIS
```

預期輸出：
```
REDIS_PASSWORD=my-redis-pw
REDIS_MAXMEMORY=256mb
```

---

**清理**

```bash
# nginx 相關：清掉
kubectl delete deployment nginx-custom
kubectl delete svc nginx-custom-svc
kubectl delete configmap nginx-config

# busybox 相關：清掉
kubectl delete deployment app-with-config
kubectl delete configmap app-config

# MySQL：先不清！6-11 PV/PVC 那個 Loop 直接用這個 mysql-deploy 做實驗
# 等一下的目標就是讓你親眼看到「沒有 PVC 的 MySQL，Pod 重建後資料消失」
kubectl get pods    # 確認 mysql-deploy 還在跑
```

這個 `mysql-deploy` 故意留著。它沒有掛 PVC，資料寫在容器自己的 filesystem 裡。6-11 概念節會直接用它做「資料消失實驗」——先進去寫資料，砍 Pod，進來看資料不見了，這就是為什麼需要 PV/PVC。
