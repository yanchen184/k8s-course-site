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

有三個問題：第一，密碼推到 Git，全世界都看到。第二，dev 和 prod 的設定不一樣，你要 build 兩個 Image。第三，改個 log level 就要重 build Image，太浪費。

K8s 的解法是：**把設定和程式碼分開**。程式碼打進 Image，設定存在 ConfigMap 或 Secret，部署時注入進去。

- **ConfigMap**：一般設定（DB host、log level、API URL）
- **Secret**：敏感資訊（密碼、API key）

好，直接開始做。

---

📄 6-5 第 2 張

**這節做四件事**

1. ConfigMap 環境變數注入（改了要重啟）
2. ConfigMap Volume 掛載（改了 30 秒自動更新）
3. Secret 建立與 Base64 觀察
4. MySQL 同時用 Secret + ConfigMap

---

### ② 所有指令＋講解

**確認環境乾淨**

```bash
kubectl get all
```

確認 default namespace 只有 `service/kubernetes`，沒有殘留資源，再開始。

---

### ③ QA

**Q：ConfigMap 和 Secret 有什麼差？什麼情況用哪個？**

A：ConfigMap 存一般設定，值是明文，`kubectl describe` 直接看到內容。Secret 存敏感資訊，值是 Base64 編碼，`kubectl describe` 只顯示大小不顯示值。密碼、API Key、憑證用 Secret；其他設定用 ConfigMap。

**Q：為什麼不把所有東西都放 Secret 就好？**

A：Secret 的 Base64 不是加密，任何有 `get secret` 權限的人都能解回明文。用途分開是職責清晰的問題，不是安全性的問題。

---

### ④ 學員實作

無（概念引入節）

### ⑤ 學員實作解答

無

---

## 6-6 ConfigMap + Secret 實作（~20 min）

### ① 課程內容

📄 6-6 第 1 張

這節按順序做四個步驟：

| 步驟 | YAML | 重點 |
|------|------|------|
| Step 1 | `configmap-literal.yaml` | 環境變數注入，改了要 rollout restart |
| Step 2 | `configmap-nginx.yaml` | Volume 掛載，改了 30 秒自動更新 |
| Step 3 | 指令建 | Secret 建立，觀察 Base64 |
| Step 4 | `secret-db.yaml` | MySQL 同時用 Secret + ConfigMap |

---

📄 6-6 第 2 張

**學員實作說明**

完成四個步驟的示範後，自己完成必做題：建一個 Redis Deployment，同時用 Secret（密碼）和 ConfigMap（一般設定）注入環境變數。

---

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

**Q：Secret YAML 裡的 `data` 和 `stringData` 差在哪？**

A：`data` 欄位的值必須是 Base64 字串；`stringData` 欄位直接寫明文，K8s apply 時自動做 Base64 轉換。`kubectl get secret -o yaml` 看到的永遠是 Base64（etcd 裡存的）。寫 YAML 時用 `stringData` 比較方便。

---

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

## 6-7 回頭操作 Loop 2（~5 min）

### ① 課程內容

📄 6-7 第 1 張

回頭確認學員環境，帶大家整理三個常見坑，清理資源，銜接整合實作。

---

### ② 所有指令＋講解

**確認學員環境狀態**

```bash
kubectl get deployments
kubectl get configmap
kubectl get secret
```

確認四個步驟的資源都有建起來。

**三個常見坑**

坑 1：`envFrom` vs `env.valueFrom` 搞混

```bash
# envFrom：整個 ConfigMap 全部注入
kubectl get deployment app-with-config -o yaml | grep -A5 envFrom

# env.valueFrom：只注入指定的 key
# env:
# - name: MY_ENV
#   valueFrom:
#     configMapKeyRef:
#       name: app-config
#       key: APP_ENV
```

坑 2：`subPath` 掛載不會自動更新

```bash
# 確認你的 volumeMounts 有沒有 subPath
kubectl get deployment nginx-custom -o yaml | grep -A5 volumeMounts
```

有 `subPath` → 不會自動更新，要 `rollout restart`。

坑 3：Secret YAML 的 `data` 欄位必須是 Base64

```bash
# 用 stringData 就不用自己做 Base64
# stringData:
#   password: my-secret-pw   ← 直接明文

# 用 data 就要先做 Base64
echo -n "my-secret-pw" | base64
# bXktc2VjcmV0LXB3
```

**清理**

```bash
kubectl delete deployment app-with-config nginx-custom mysql-deploy
kubectl delete service nginx-custom-svc mysql-svc
kubectl delete configmap app-config nginx-config db-config
kubectl delete secret db-cred db-secret
kubectl get all    # 確認只剩 kubernetes Service
```

**銜接**

設定和密碼的問題解決了。下一個 Loop 把今天學的全部串起來：前端 Nginx + API httpd + MySQL，加 Ingress 統一對外，這就是完整的三層架構。

---

### ③ QA

**Q：`rollout restart` 和直接刪 Pod 有什麼差？**

A：直接 `kubectl delete pod` 是強制刪除，會有短暫中斷。`rollout restart` 是滾動重啟，先建新 Pod、確認新 Pod 就緒後才刪舊 Pod，零中斷。生產環境一定用 `rollout restart`。

---

### ④ 學員實作

確認清理後環境乾淨：

```bash
kubectl get all
kubectl get configmap
kubectl get secret
```

ConfigMap 只剩 `kube-root-ca.crt`（系統自帶），Secret 只剩 `default-token-*`（系統自帶），其他都清掉。

---

### ⑤ 學員實作解答

若有殘留：

```bash
kubectl delete deployment --all
kubectl delete svc $(kubectl get svc --no-headers | grep -v kubernetes | awk '{print $1}')
kubectl delete configmap $(kubectl get configmap --no-headers | grep -v kube-root-ca | awk '{print $1}')
kubectl delete secret $(kubectl get secret --no-headers | grep -v default-token | awk '{print $1}')
```
