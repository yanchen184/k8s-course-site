# Day 7 Loop 6 — 從零部署完整系統（上）

---

## 7-17 從零部署引導（上）（~12 min）

### ① 課程內容

📄 7-17 第 1 張

四堂課下來，你學了 Pod、Deployment、Service、Ingress、ConfigMap、Secret、PV、PVC、StatefulSet、Helm、Probe、Resource limits、HPA、RBAC、NetworkPolicy。每個都分開學過，每個都做過實作。

但你有沒有試過把它們全部串在一起？從一個完全空的叢集開始，一步一步建出一個完整的系統？

這就是我們接下來要做的事情。

---

📄 7-17 第 2 張

**目標架構**

```
使用者 → Ingress → / → frontend-svc（nginx，2 個副本）
                  /api → api-svc（API，3 個副本，HPA 最多 10 個）
                            ↓
                        mysql-svc（MySQL StatefulSet + PVC）
```

所有 Pod 都有 Probe 做健康檢查、Resource limits 做資源控制。NetworkPolicy 三層隔離，Secret 存密碼，ConfigMap 存設定。

---

📄 7-17 第 3 張

**12 步全覽**

| 步驟 | 做什麼 | 對應概念 | 對應堂次 |
|:---:|:---|:---|:---:|
| 1 | 建 Namespace（prod） | Namespace | 第五堂 |
| 2 | 建 Secret（DB 密碼） | Secret | 第六堂 |
| 3 | 建 ConfigMap（API 設定） | ConfigMap | 第六堂 |
| 4 | MySQL StatefulSet + PVC + Headless Service | StatefulSet + PVC | 第六堂 |
| 5 | API Deployment + Service + Probe + Resource | Deployment + Probe | 第五、七堂 |
| 6 | Frontend Deployment + Service | Deployment | 第五堂 |
| 7 | Ingress | Ingress | 第六堂 |
| 8 | HPA | HPA | 第七堂 |
| 9 | NetworkPolicy | NetworkPolicy | 第七堂 |
| 10 | RBAC（選做） | RBAC | 第七堂 |
| 11 | 完整驗證 | 全部 | 全部 |
| 12 | 壓測 + 故障模擬（選做） | HPA + 自我修復 | 第五、七堂 |

這個 Loop 專注步驟 1 到 6：先把骨架立起來。

---

📄 7-17 第 4 張

**步驟 1：建 Namespace**

為什麼不用 default？第五堂學的，生產環境要有自己的 Namespace 做隔離。清理的時候一行 `kubectl delete namespace prod` 全部一起刪，乾淨俐落。

**步驟 2：建 Secret**

MySQL 需要 root 密碼。密碼不能明文寫在 YAML 裡，用 Secret 存。

**步驟 3：建 ConfigMap**

API 需要知道資料庫地址和 Port。這些設定用 ConfigMap 存，不寫死在 Image 裡面，改設定不用重 build。

**步驟 4：部署 MySQL**

用 StatefulSet 加 PVC 加 Headless Service。為什麼不用 Deployment？因為資料庫需要穩定的網路標識和獨立的儲存。Headless Service 讓每個 Pod 有自己的 DNS 名稱，像 `mysql-0.mysql-headless.prod.svc.cluster.local`。

**步驟 5：部署 API**

用 Deployment 跑三個副本。YAML 裡同時配三種 Probe、設 Resource requests 和 limits、從 Secret 讀密碼、從 ConfigMap 讀設定。一個 Deployment 用到五六個概念。

**步驟 6：部署 Frontend**

Deployment 跑兩個副本，nginx 加上 ConfigMap 掛載的自訂設定，把 `/api` 開頭的請求反向代理到 api-svc。

---

📄 7-17 第 5 張

**順序不能亂，依賴關係決定順序**

```
Secret（02）
   ↓
ConfigMap（03）
   ↓
MySQL StatefulSet（04）—— 需要 Secret 的密碼
   ↓
API Deployment（05）———— 需要 Secret 的密碼 + ConfigMap 的設定 + MySQL 先跑
   ↓
Frontend Deployment（06）需要 API 先在
```

先建 Secret，MySQL 才能讀到密碼。先建 ConfigMap，API 才能讀到設定。MySQL 要先跑起來，API 才能連。依賴鏈一層一層，不能省。

---

## 7-18 從零部署實作示範（上）（~12 min）

### ② 所有指令＋講解

**Step 1：建 Namespace**

```bash
kubectl apply -f final-project/01-namespace.yaml
kubectl get ns prod
```

`STATUS Active` 代表建好了。接下來所有指令都要加 `-n prod`，因為資源都在這個 Namespace 裡。

> 小技巧：如果覺得每次加 `-n prod` 很煩，可以用 `kubectl config set-context --current --namespace=prod` 切換預設 Namespace。但上課建議還是手動加，養成好習慣。生產環境不小心在 default Namespace 操作是很危險的。

---

**Step 2：建 Secret**

```bash
kubectl apply -f final-project/02-secret.yaml
kubectl get secret -n prod
```

你會看到 `mysql-secret`。Secret 的值在 `kubectl get secret` 不會直接顯示，需要 `kubectl get secret mysql-secret -n prod -o jsonpath='{.data}'` 才能看到 Base64 編碼的值。

---

**Step 3：建 ConfigMap**

```bash
kubectl apply -f final-project/03-configmap.yaml
kubectl get configmap -n prod
```

你會看到 `api-config`。裡面存了資料庫地址 `mysql-0.mysql-headless.prod.svc.cluster.local`、Port `3306`、database 名字。這些設定等一下 API 會用環境變數的方式讀進去。

---

**Step 4：部署 MySQL**

```bash
kubectl apply -f final-project/04-mysql.yaml
kubectl get pods -n prod -w
# 等 mysql-0 變成 1/1 Running
```

這個 YAML 裡有三個資源：Headless Service、StatefulSet、volumeClaimTemplate（含在 StatefulSet 裡）。一次 apply 全部建好。

MySQL 啟動比較慢，可能要 30 到 60 秒。`-w` 是 watch，自動重新整理。等到 READY 變成 `1/1` 再按 Ctrl+C。

```bash
kubectl get pvc -n prod
```

預期輸出：
```
NAME                 STATUS   VOLUME   CAPACITY   ACCESS MODES
mysql-data-mysql-0   Bound    ...      5Gi        RWO
```

`STATUS Bound` 代表 PVC 已經掛到實際的儲存空間了。這個 PVC 名字是 StatefulSet 的 `volumeClaimTemplates` 自動建的，格式是 `<pvc-name>-<pod-name>`。

```bash
kubectl get svc -n prod
```

你會看到 `mysql-headless`，`CLUSTER-IP` 是 `None`，這是 Headless Service 的特徵。

---

**Step 5：部署 API**

```bash
kubectl apply -f final-project/05-api.yaml
kubectl get pods -n prod -l app=api
# 等 3 個 Pod 都 Running
kubectl get svc -n prod
```

`05-api.yaml` 是最複雜的一個。Deployment 裡面設了：
- `replicas: 3`
- `livenessProbe`、`readinessProbe`、`startupProbe` 三種健康檢查
- `resources.requests` 和 `resources.limits`
- `envFrom.secretRef` 從 Secret 讀密碼
- `envFrom.configMapRef` 從 ConfigMap 讀設定
- 同時建了一個 `ClusterIP` Service `api-svc`

如果有 Pod 卡在 `0/1`，可能是 readinessProbe 還沒過，等一下就好了。等兩分鐘還沒過再 `kubectl describe pod <pod-name> -n prod` 看 Events。

---

**Step 6：部署 Frontend**

```bash
kubectl apply -f final-project/06-frontend.yaml
kubectl get pods -n prod -l app=frontend
# 等 2 個 Pod 都 Running
```

前端用 nginx 加上 ConfigMap 掛載的自訂設定檔，裡面設定了 `/api/` 的反向代理規則，把 `/api` 開頭的請求轉給 `api-svc`。

---

**確認步驟 1-6 的整體狀態**

```bash
kubectl get all -n prod
```

預期看到：
- `statefulset.apps/mysql`，READY `1/1`
- `deployment.apps/api`，READY `3/3`
- `deployment.apps/frontend`，READY `2/2`
- Service：`mysql-headless`、`api-svc`、`frontend-svc`

目前功能面上系統已經可以跑了。後面步驟 7-12 再加 Ingress、HPA、NetworkPolicy、驗證。

---

### ③ QA

**Q：為什麼步驟四用 StatefulSet 不用 Deployment 跑 MySQL？**

A：Deployment 的 Pod 名字是隨機的（像 `api-7d9b5c-xxx`），Pod 重建後名字會變、IP 會變、儲存是共用的。MySQL 有三個需求 Deployment 滿足不了：第一，要有穩定的 DNS 名稱，因為 API 的 ConfigMap 裡寫死了 `mysql-0.mysql-headless.prod.svc.cluster.local`；第二，要有固定的啟動順序；第三，每個 Pod 要有自己獨立的 PVC。StatefulSet 這三點都能滿足，所以資料庫一定用 StatefulSet。

**Q：Secret 和 ConfigMap 都可以存設定，我怎麼決定用哪個？**

A：一個原則：敏感資料用 Secret，非敏感設定用 ConfigMap。資料庫密碼、API Key、TLS 憑證這些用 Secret；資料庫地址、Port 號、功能開關這些用 ConfigMap。Secret 的好處是存取可以用 RBAC 控管，而且可以整合外部金鑰管理系統（像 HashiCorp Vault）做自動輪換。ConfigMap 就是普通的 K-V 設定，沒有額外保護。

**Q：`kubectl get pods -n prod -w` 的 `-w` 是什麼意思？**

A：`-w` 是 `--watch`，讓 kubectl 自動監控資源變化，有更新就立刻列印新的狀態，不用一直手動執行。等待 Pod 啟動的時候很好用。按 Ctrl+C 停止。等價的寫法是 `kubectl get pods -n prod --watch`。

**Q：PVC 的 STATUS 有時候是 Pending 不是 Bound，是什麼問題？**

A：Pending 表示 PVC 還沒有找到符合條件的 PV 來綁定。最常見的原因有兩個。第一，叢集裡沒有對應的 StorageClass。k3s 預設有 `local-path`，minikube 有 `standard`，用 `kubectl get storageclass` 確認有沒有可用的。第二，PVC 要求的容量或 AccessMode 和現有 PV 不符。`kubectl describe pvc <name> -n prod` 看 Events 會有詳細原因。

---

## 7-19 回頭操作 Loop 6（~5 min）

### ④ 學員實作

**必做：跟著 12 步的前 6 步建出系統骨架**

1. 建 `prod` Namespace
2. 建 `mysql-secret`（存 MySQL root 密碼）
3. 建 `api-config` ConfigMap（存資料庫地址、Port、DB 名）
4. 部署 MySQL StatefulSet，確認 `mysql-0` 是 `1/1 Running`，PVC 是 `Bound`
5. 部署 API Deployment（3 個副本），確認全部 `1/1 Running`
6. 部署 Frontend Deployment（2 個副本），確認全部 `1/1 Running`

完成後跑：
```bash
kubectl get all -n prod
kubectl get pvc -n prod
```

確認 StatefulSet `1/1`、兩個 Deployment 都 READY、PVC `Bound`。

---

**挑戰：幫 MySQL 加上 HPA**

MySQL 一般不做水平擴縮（主從架構比較複雜），但作為練習，你可以幫 MySQL 的 Headless Service 後面的 StatefulSet 試著設一個 HPA，觀察 K8s 的反應：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: mysql-hpa
  namespace: prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: StatefulSet
    name: mysql
  minReplicas: 1
  maxReplicas: 3
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

Apply 之後觀察 `kubectl get hpa -n prod`，思考一個問題：為什麼生產環境的 MySQL 幾乎不會這樣用 HPA？（提示：StatefulSet 的 Pod 有固定名字和獨立 PVC，水平擴展後每個 Pod 的資料是獨立的，不是同步的。）

---

### ⑤ 學員實作解答

**必做解答**

```yaml
# 01-namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: prod
```

```yaml
# 02-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
  namespace: prod
type: Opaque
data:
  MYSQL_ROOT_PASSWORD: cm9vdHBhc3N3b3Jk   # base64 of "rootpassword"
  MYSQL_PASSWORD: cGFzc3dvcmQ=             # base64 of "password"
```

> Base64 編碼用 `echo -n "rootpassword" | base64` 產生，不是直接填明文。

```yaml
# 03-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: prod
data:
  DB_HOST: mysql-0.mysql-headless.prod.svc.cluster.local
  DB_PORT: "3306"
  DB_NAME: appdb
```

```yaml
# 04-mysql.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
  namespace: prod
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  namespace: prod
spec:
  serviceName: mysql-headless
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
            name: mysql-secret
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          exec:
            command: ["mysqladmin", "ping", "-h", "localhost"]
          initialDelaySeconds: 30
          periodSeconds: 10
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: mysql-data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 5Gi
```

```yaml
# 05-api.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: nginx:alpine   # 課堂用 nginx 模擬 API
        ports:
        - containerPort: 80
        envFrom:
        - secretRef:
            name: mysql-secret
        - configMapRef:
            name: api-config
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        startupProbe:
          httpGet:
            path: /
            port: 80
          failureThreshold: 30
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: api-svc
  namespace: prod
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 80
```

```yaml
# 06-frontend.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: prod
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
      - name: frontend
        image: nginx:alpine
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 50m
            memory: 64Mi
          limits:
            cpu: 200m
            memory: 256Mi
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: prod
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
```

**確認指令**

```bash
kubectl get all -n prod
kubectl get pvc -n prod
kubectl get secret -n prod
kubectl get configmap -n prod
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| 忘了加 `-n prod` | 看不到東西 | 每個指令都要帶 `-n prod` |
| MySQL Pod 卡在 Pending | PVC 無法 Bound | `kubectl describe pod mysql-0 -n prod` 看 Events，確認 StorageClass 存在 |
| API Pod `0/1 Running` | readinessProbe 或 startupProbe 還沒過 | 等一下；超過 2 分鐘就 `kubectl describe pod` 看 Events |

**清理**

```bash
kubectl delete namespace prod
# 一行刪掉所有東西，包含 PVC
kubectl get ns    # 確認 prod 不見了
```
