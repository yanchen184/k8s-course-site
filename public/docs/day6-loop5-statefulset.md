# Day 6 Loop 5 — StorageClass + StatefulSet

---

## 6-14 StorageClass + StatefulSet 概念（~15 min）

### ① 課程內容

📄 6-14 第 1 張

這節介紹為什麼靜態佈建不夠用、StorageClass 如何實現動態佈建，以及 Deployment 跑資料庫的根本限制，引入 StatefulSet 三個保證與 Headless Service 的概念。

---

### ② 所有指令＋講解

**確認 StorageClass**

```bash
kubectl get storageclass
```

打完要看：
```
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  10d
```

有看到 `local-path (default)` 就可以繼續。如果空的（`No resources found`），代表叢集沒有 StorageClass，PVC 會一直 Pending。

---

📄 6-14 第 1 張

**靜態佈建的問題**

之前學 PV 和 PVC 的時候，流程是這樣：管理員先手動建 PV，開發者再建 PVC 去配對。

這種做法叫「靜態佈建」（Static Provisioning）。小規模還好，但想像一下：你有 10 個微服務，每個都要自己的 Storage，你就要手動建 10 個 PV。新服務上線？再手動建。這個 PV 的大小猜錯了？砍掉重建。

這很煩，而且生產環境根本不能這樣搞。

---

📄 6-14 第 2 張

**動態佈建（Dynamic Provisioning）**

解法是動態佈建：開發者建 PVC，StorageClass 自動幫你建對應的 PV，管理員完全不需要動手。

流程變成：
```
開發者建 PVC → K8s 看到這個 PVC 要用哪個 StorageClass → StorageClass 呼叫對應的 provisioner → provisioner 自動建 PV → PVC 和 PV 自動綁定
```

**StorageClass 是什麼**

StorageClass 就是工廠的模板。有人下訂單（建 PVC），工廠（provisioner）照著這個模板生產貨物（PV）。不同的 StorageClass 可以對應不同的儲存後端：

| 雲端平台 | StorageClass provisioner |
|:---|:---|
| k3s 本地 | rancher.io/local-path |
| AWS | ebs.csi.aws.com |
| GCP | pd.csi.storage.gke.io |
| Azure | disk.csi.azure.com |

Docker 對照：Volume Driver（`--driver local` 或 `--driver nfs`），概念相同，只是 K8s 的版本更完整、更可設定。

**靜態 vs 動態佈建比較**

| | 靜態佈建 | 動態佈建 |
|:---|:---|:---|
| 流程 | 管理員先建 PV → PVC 配對 | PVC 建立 → PV 自動建 |
| 適合 | 學習、小規模、特殊硬體 | 生產環境 |
| 問題 | 要事先建好所有 PV | 需要 StorageClass |

---

📄 6-14 第 3 張

**Deployment 跑 DB 的四個問題**

上一個 Loop 我們學了 PV、PVC，讓 DB 的資料可以持久化。但如果你直接用 Deployment 跑 MySQL，還是有四個根本問題沒解決。

1. **Pod 名稱不固定**：Deployment 建出的 Pod 名稱帶 random hash（`mysql-7d9f5b8c4d-abc12`）。MySQL 主從架構要知道「主庫是誰」，random hash 讓你根本分不清楚。

2. **沒有啟動順序**：Deployment 的 Pod 同時啟動。主從架構需要主庫（mysql-0）先起來，從庫（mysql-1、mysql-2）才能連進來同步資料。Deployment 做不到這件事。

3. **共用 PVC**：Deployment 的所有 Pod 共用同一個 PVC。三個 MySQL 同時寫同一塊磁碟，資料直接亂掉。

4. **沒有穩定的網路身份**：普通 Service 做負載均衡，你連進去不知道會打到哪個 Pod。主庫、從庫要分開連，但你分不清楚。

這四個問題，StatefulSet 全部解決。

---

📄 6-14 第 4 張

**StatefulSet 三個保證**

StatefulSet（有狀態集合）是專門為有狀態應用（資料庫、訊息佇列）設計的控制器。它給你三個保證：

**① 穩定身份**
Pod 名稱 = 固定序號，不是 random hash。
```
mysql-0
mysql-1
mysql-2
```
Pod 被砍掉重建，名字還是一樣。你永遠知道 mysql-0 是主庫。

**② 獨立儲存**
StatefulSet 用 `volumeClaimTemplates` 自動為每個 Pod 建獨立的 PVC：
```
mysql-data-mysql-0   ← mysql-0 專用
mysql-data-mysql-1   ← mysql-1 專用
mysql-data-mysql-2   ← mysql-2 專用
```
三個 Pod 各自寫自己的磁碟，互不干擾。

**③ 有序生命週期**
- 啟動：0 → 1 → 2（前一個 Ready 才建下一個）
- 刪除：2 → 1 → 0（反序）
- 更新：也是有序進行

---

📄 6-14 第 5 張

**Headless Service**

普通 Service 做負載均衡，流量隨機打到某個 Pod，你不知道是誰。

StatefulSet 需要的是「能直接指定連哪個 Pod」的能力。這就需要 Headless Service（無頭 Service）。

建法很簡單：`clusterIP: None`。

```yaml
spec:
  clusterIP: None   # ← 這樣就是 Headless Service
```

Headless Service 不做負載均衡，改成讓每個 Pod 有自己的 DNS：

```
mysql-0.mysql-headless.default.svc.cluster.local
mysql-1.mysql-headless.default.svc.cluster.local
mysql-2.mysql-headless.default.svc.cluster.local
```

DNS 格式：`<pod名稱>.<service名稱>.<namespace>.svc.cluster.local`

---

📄 6-14 第 6 張

**StatefulSet vs Deployment 完整比較**

| 特性 | Deployment | StatefulSet |
|:---|:---|:---|
| 適合場景 | 無狀態應用（API、Frontend） | 有狀態應用（DB、訊息佇列） |
| Pod 名稱 | random hash | 固定序號（mysql-0、mysql-1）|
| 啟動順序 | 同時建立 | 有序（0 → 1 → 2）|
| 刪除順序 | 隨機 | 反序（2 → 1 → 0）|
| PVC | 所有 Pod 共用 | 每個 Pod 獨立 PVC |
| DNS | 只有 Service DNS | 每個 Pod 有自己的 DNS |
| 搭配的 Service | 普通 Service | Headless Service |

**StatefulSet YAML 和 Deployment YAML 的兩個差異**

```yaml
spec:
  serviceName: mysql-headless   # ← 差異①：指定 Headless Service
  replicas: 2
  ...
  volumeClaimTemplates:         # ← 差異②：在 spec 下面，和 template 同級
  - metadata:
      name: mysql-data
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
```

---

### ③ QA

老師念題，念完念答案。

**Q1：靜態佈建和動態佈建的流程分別是什麼？各自適合什麼情境？**

A：靜態佈建：管理員先手動建 PV，開發者再建 PVC 去配對，適合學習、小規模或使用特殊硬體的情境。動態佈建：開發者只需建 PVC，StorageClass 的 provisioner 自動建 PV 並完成綁定，適合生產環境，省去管理員逐一手動建 PV 的工作。

**Q2：StatefulSet 給了哪三個保證？針對 Deployment 跑 DB 的哪三個問題？**

A：三個保證對應三個問題：穩定身份（固定序號）→ 解決「Pod 名稱不固定」；獨立儲存（每個 Pod 獨立 PVC）→ 解決「共用 PVC 資料亂掉」；有序生命週期（0→1→2）→ 解決「沒有啟動順序」。

**Q3：Headless Service 和普通 Service 的差異是什麼？StatefulSet 為什麼需要 Headless Service？**

A：普通 Service 做負載均衡，Client 端無法指定連哪一個 Pod。Headless Service（`clusterIP: None`）讓每個 Pod 有自己的 DNS，應用程式才能直接指定「連 mysql-0 寫、連 mysql-1 讀」，實現主從架構的路由。

---

### ④ 學員實作

本節以概念為主，無操作實作。

---

### ⑤ 學員實作解答

本節以概念為主，無操作實作。

---

## 6-15 StatefulSet MySQL 實作（~15 min）

### ① 課程內容

📄 6-15 第 1 張

這節用 MySQL 示範 StatefulSet 三個保證：有序啟動、獨立 PVC、資料持久化。YAML 包含 Headless Service + Secret + StatefulSet 三個部分。

---

### ② 所有指令＋講解

**確認 StorageClass（先確認環境沒問題）**

```bash
kubectl get storageclass
```

打完要看：
```
NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  10d
```

有看到 `local-path (default)` 就可以繼續。

---

**套用 YAML**

```bash
kubectl apply -f statefulset-mysql.yaml
```

`statefulset-mysql.yaml` 包含三個部分：

```yaml
# 1. Headless Service
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None       # ← Headless 的標誌，缺這行就變普通 Service
  selector:
    app: mysql-sts
  ports:
  - port: 3306
---
# 2. Secret（MySQL 密碼）
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: rootpass123
---
# 3. StatefulSet
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless   # ← 對應 Headless Service 的名稱，必須完全一致
  replicas: 2
  selector:
    matchLabels:
      app: mysql-sts
  template:
    metadata:
      labels:
        app: mysql-sts
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        envFrom:
        - secretRef:
            name: mysql-secret
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:         # ← 在 spec 下面，和 template 同級
  - metadata:
      name: mysql-data
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
```

打完要看：
```
service/mysql-headless created
secret/mysql-secret created
statefulset.apps/mysql created
```

三行都出現才對，少任何一行要去查錯誤訊息。

---

**觀察有序啟動（關鍵！要慢慢看）**

```bash
kubectl get pods -w
```

打完要看（順序很重要）：
```
NAME      READY   STATUS              RESTARTS   AGE
mysql-0   0/1     ContainerCreating   0          1s
mysql-0   1/1     Running             0          15s
mysql-1   0/1     Pending             0          0s     ← mysql-0 Ready 之後，mysql-1 才開始建
mysql-1   0/1     ContainerCreating   0          1s
mysql-1   1/1     Running             0          20s
```

重點觀察：mysql-0 變成 `1/1 Running` 之後，mysql-1 才出現。如果 mysql-0 一直停在 `0/1`，mysql-1 完全不會建。Ctrl+C 結束 watch。

---

**確認 Pod 名稱是固定序號**

```bash
kubectl get pods -l app=mysql-sts
```

打完要看：
```
NAME      READY   STATUS    RESTARTS   AGE
mysql-0   1/1     Running   0          2m
mysql-1   1/1     Running   0          1m
```

注意：名稱是 `mysql-0`、`mysql-1`，不是 random hash。

---

**確認每個 Pod 有獨立 PVC（自動建的）**

```bash
kubectl get pvc
```

打完要看：
```
NAME                 STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mysql-data-mysql-0   Bound    pvc-a1b2c3d4-...                           1Gi        RWO            local-path     2m
mysql-data-mysql-1   Bound    pvc-b2c3d4e5-...                           1Gi        RWO            local-path     1m
```

PVC 名稱格式：`<volumeClaimTemplates.name>-<Pod名稱>`，每個 Pod 一個獨立 PVC，你沒有手動建任何 PVC。

---

**驗證資料持久化 — Step 1：在 mysql-0 建資料庫**

```bash
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
```

- `exec -it mysql-0`：直接指定 Pod 名稱（StatefulSet 的好處，不用記 random hash）
- `-e "CREATE DATABASE testdb;"`：非互動模式執行 SQL 後立刻退出

有這個 Warning 是正常的：
```
mysql: [Warning] Using a password on the command line interface can be insecure.
```

---

**驗證資料持久化 — Step 2：刪掉 mysql-0**

```bash
kubectl delete pod mysql-0
```

打完要看：
```
pod "mysql-0" deleted
```

StatefulSet 偵測到 mysql-0 不見，會立刻重建一個名字一樣的 mysql-0，並且掛載同一個 PVC（`mysql-data-mysql-0`）。

---

**驗證資料持久化 — Step 3：等重建並確認資料還在**

```bash
kubectl get pods -w
```

打完要看：
```
NAME      READY   STATUS              RESTARTS   AGE
mysql-0   0/1     ContainerCreating   0          1s
mysql-0   1/1     Running             0          15s    ← 重建完成，名字還是 mysql-0
```

Ctrl+C，然後確認資料：

```bash
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
```

打完要看：
```
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| testdb             |    ← 這個！資料還在
+--------------------+
```

`testdb` 還在，證明 Pod 重建後資料沒有消失。

---

**Scale StatefulSet 到 3 個（觀察有序擴容）**

```bash
kubectl scale statefulset mysql --replicas=3
```

打完要看：
```
statefulset.apps/mysql scaled
```

立刻 watch：
```bash
kubectl get pods -w
```

```
NAME      READY   STATUS              RESTARTS   AGE
mysql-0   1/1     Running             0          10m
mysql-1   1/1     Running             0          9m
mysql-2   0/1     Pending             0          0s     ← mysql-2 最後建
mysql-2   1/1     Running             0          20s
```

---

**Scale StatefulSet 回 2 個（觀察反序縮容）**

```bash
kubectl scale statefulset mysql --replicas=2
```

立刻 watch：
```bash
kubectl get pods -w
```

```
mysql-2   1/1     Terminating   0          2m     ← mysql-2 先被刪（反序）
(mysql-2 消失)
```

縮容後 PVC `mysql-data-mysql-2` **不會自動刪除**，需要手動清：
```bash
kubectl delete pvc mysql-data-mysql-2
```

---

### ③ QA

老師念題，念完念答案。

**Q1：StatefulSet 的 volumeClaimTemplates 建出的 PVC 名稱格式是什麼？是怎麼來的？**

A：格式是 `<volumeClaimTemplates.name>-<Pod名稱>`。PVC 名稱前綴來自 YAML 的 `volumeClaimTemplates[0].metadata.name`，後綴是 StatefulSet 名稱加序號。例如 `volumeClaimTemplates.name` 是 `mysql-data`、Pod 是 `mysql-0`，PVC 就叫 `mysql-data-mysql-0`。

**Q2：StatefulSet 刪除後，PVC 為什麼不會自動刪？**

A：K8s 保護資料不被誤刪。如果 StatefulSet 被誤刪，PVC 裡的資料還在，重建 StatefulSet 後可以重新掛載。生產環境的資料庫資料永遠比 StatefulSet YAML 珍貴，K8s 選擇保守策略，讓管理員手動決定要不要刪 PVC。

---

### ④ 學員實作

**必做：場景任務題**

你的團隊要部署 Redis 快取叢集，要求每個 Pod 有固定名稱、有序啟動、各自獨立的 500Mi 儲存。

寫一個 StatefulSet（image: `redis:7`，2 個副本，serviceName 自訂），並完成以下驗證：
1. `kubectl get pods` 看到 `redis-0` 和 `redis-1`（有序啟動）
2. `kubectl get pvc` 看到兩個獨立的 PVC
3. 刪 `redis-0`，確認它重建後 Pod 名稱不變（還是 `redis-0`）

**挑戰題**

Scale 到 3，用 `-w` 看 mysql-2 最後建；再 Scale 回 1，確認刪除順序是 mysql-2 先刪還是 mysql-1 先刪（反序驗證）。

---

### ⑤ 學員實作解答

**必做：Redis StatefulSet**

```yaml
# redis-statefulset.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-headless
spec:
  clusterIP: None
  selector:
    app: redis
  ports:
    - port: 6379
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis-headless
  replicas: 2
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
          image: redis:7
          ports:
            - containerPort: 6379
          volumeMounts:
            - name: redis-data
              mountPath: /data
  volumeClaimTemplates:
    - metadata:
        name: redis-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 500Mi
```

```bash
kubectl apply -f redis-statefulset.yaml
kubectl get pods -w           # 觀察有序啟動
kubectl get pvc               # 確認兩個獨立 PVC
kubectl delete pod redis-0    # 砍掉 redis-0
kubectl get pods -w           # 等重建，確認名稱還是 redis-0
```

**挑戰題**

```bash
kubectl scale statefulset mysql --replicas=3
kubectl get pods -w    # mysql-2 最後建
kubectl scale statefulset mysql --replicas=1
kubectl get pods -w    # mysql-2 先 Terminating，然後 mysql-1，mysql-0 不受影響
```

縮容到 1 後手動清多餘的 PVC：
```bash
kubectl delete pvc mysql-data-mysql-1 mysql-data-mysql-2
```

---

## 6-16 回頭操作 Loop 5（~5 min）

### ① 課程內容

📄 6-16 第 1 張

帶做確認 StatefulSet 狀態、三個常見坑（volumeClaimTemplates 縮排、忘建 Headless Service、serviceName 打錯），銜接 Helm。

---

### ② 所有指令＋講解

**確認 StatefulSet 狀態**

```bash
kubectl get statefulset
```

縮寫：`kubectl get sts`

打完要看：
```
NAME    READY   AGE
mysql   2/2     15m
```

- `READY 2/2`：兩個副本都正常跑著
- 如果是 `0/2` 或 `1/2`：`kubectl describe statefulset mysql` 看 Events，最常見是 PVC Pending（StorageClass 問題）

---

**確認 PVC 都是 Bound**

```bash
kubectl get pvc
```

打完要看：
```
NAME                 STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
mysql-data-mysql-0   Bound    ...      1Gi        RWO            local-path     15m
mysql-data-mysql-1   Bound    ...      1Gi        RWO            local-path     14m
```

兩個 PVC 的 STATUS 都要是 `Bound`。如果是 `Pending`：`kubectl describe pvc <name>` 看 Events。

---

**確認 Headless Service**

```bash
kubectl get service mysql-headless
```

打完要看：
```
NAME             TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
mysql-headless   ClusterIP   None         <none>        3306/TCP   15m
```

- `CLUSTER-IP` 是 `None` → Headless Service，正確
- 如果有 IP → 不是 Headless，去檢查 YAML 有沒有 `clusterIP: None`

---

**三個常見坑**

**坑 1：`volumeClaimTemplates` 縮排錯**

```yaml
# 錯誤：volumeClaimTemplates 在 template 裡面
spec:
  template:
    spec:
      containers: ...
      volumeClaimTemplates:   ← 錯
---
# 正確：volumeClaimTemplates 在 spec 下面，和 template 同級
spec:
  template:
    spec:
      containers: ...
  volumeClaimTemplates:       ← 對
```

縮排錯的後果：Pod 找不到 volume，一直 Pending。

**坑 2：忘建 Headless Service**

StatefulSet 的 `serviceName` 指定的 Service 必須先存在。忘記建的話，Pod 的 DNS 會有問題。
```bash
kubectl get service mysql-headless    # 確認有建
```

**坑 3：`serviceName` 打錯**

`serviceName` 的值必須和 Headless Service 的 `metadata.name` 完全一致，包含大小寫。打錯的話 Pod DNS 解析失敗。

---

**清理**

```bash
kubectl delete statefulset mysql
kubectl delete service mysql-headless
kubectl delete secret mysql-secret
kubectl delete pvc mysql-data-mysql-0 mysql-data-mysql-1
```

注意：StatefulSet 刪除後，PVC 不會自動刪，需要手動清理。這是 K8s 的保護機制，防止誤刪資料。

---

### ③ QA

老師念題，念完念答案。

**Q：StatefulSet 刪除後，PVC 為什麼不會自動刪？這個設計有什麼考量？**

A：K8s 保護資料不被誤刪。如果 StatefulSet 被誤刪（或滾動更新時），PVC 裡的資料還在，重建 StatefulSet 後可以重新掛載。生產環境的資料庫資料永遠比 StatefulSet YAML 珍貴，所以 K8s 選擇保守策略：讓管理員手動決定要不要刪 PVC。

**Q：為什麼要用 Headless Service？普通 ClusterIP Service 不行嗎？**

A：普通 Service 做負載均衡，DNS 解析到 Service 的 ClusterIP，再由 Service 隨機轉到一個 Pod。你連不到特定的 mysql-0 或 mysql-1。Headless Service 讓每個 Pod 有自己的 DNS（`mysql-0.mysql-headless.default.svc.cluster.local`），主從架構的 app 才能指定「寫 mysql-0，讀 mysql-1」。

---

### ④ 學員實作

確認自己的環境狀態：

```bash
kubectl get sts           # StatefulSet READY 要顯示正確數量
kubectl get pvc           # 所有 PVC STATUS 要是 Bound
kubectl get service mysql-headless    # CLUSTER-IP 要是 None
```

---

### ⑤ 學員實作解答

若有問題：

```bash
kubectl describe statefulset mysql    # 看 Events，找錯誤原因
kubectl describe pvc <name>          # 看 PVC 為什麼 Pending
```

清理：
```bash
kubectl delete statefulset mysql
kubectl delete service mysql-headless
kubectl delete secret mysql-secret
kubectl delete pvc mysql-data-mysql-0 mysql-data-mysql-1
```
