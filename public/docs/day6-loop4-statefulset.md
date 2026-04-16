# Day 6 Loop 4 — StorageClass + StatefulSet

---

## 6-14 StorageClass + StatefulSet 概念（~5 min）

### ① 課程內容

這節純概念，不跑實作指令。先解釋靜態佈建的缺點、動態佈建怎麼解決，再說明 Deployment 跑 DB 的四個根本問題，以及 StatefulSet 的三個保證。

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
StatefulSet 用 `volumeClaimTemplates` 自動為每個 Pod 建獨立的 PVC。跟 Deployment 不同——Deployment 的所有 Pod 共用同一個 PVC，但 StatefulSet 用 `volumeClaimTemplates` 讓每個 Pod 自動建立自己的 PVC：
```
mysql-data-mysql-0   ← mysql-0 專用
mysql-data-mysql-1   ← mysql-1 專用
mysql-data-mysql-2   ← mysql-2 專用
```
三個 Pod 各自寫自己的磁碟，互不干擾。Pod 重建後會掛回原本的 PVC，資料不會跑到別的 Pod。

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
mysql-0.mysql-headless
mysql-1.mysql-headless
```

（完整格式是 `<pod>.<svc>.<namespace>.svc.cluster.local`，6-15 實作時我們會實際 nslookup 驗證。）

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

## 6-15 StatefulSet MySQL 實作（~15 min）

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

動態佈建的好處：開發者只建 PVC，StorageClass 的 provisioner（這裡是 `rancher.io/local-path`）自動幫你建 PV 並配對。靜態佈建要手動建 PV，動態佈建全自動。

---

**套用 YAML**

```bash
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/statefulset-mysql.yaml
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
  name: mysql-sts-secret
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
            name: mysql-sts-secret
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
secret/mysql-sts-secret created
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

預期輸出：
```
mysql: [Warning] Using a password on the command line interface can be insecure.
```

Warning 後面沒有其他輸出代表成功（SQL 執行完就退出）。

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

**驗證 Headless Service DNS**

```bash
kubectl run dns-test --image=busybox:1.28 --restart=Never --rm -it -- nslookup mysql-0.mysql-headless
```

打完要看：
```
Server:    10.43.0.10
Address 1: 10.43.0.10 kube-dns.kube-system.svc.cluster.local

Name:      mysql-0.mysql-headless
Address 1: 10.42.0.X mysql-0.mysql-headless.default.svc.cluster.local
```

`mysql-0.mysql-headless` 解析到 mysql-0 的 Pod IP，不是隨機的。這就是 Headless Service 的效果——每個 Pod 有自己固定的 DNS，可以直接定址。普通 Service 你只能拿到 ClusterIP，連進去不知道打到誰。

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

預期輸出：
```
statefulset.apps/mysql scaled
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

預期輸出：
```
persistentvolumeclaim "mysql-data-mysql-2" deleted
```

---

### ③ QA

老師念題，念完念答案。

**Q1：StatefulSet 的 volumeClaimTemplates 建出的 PVC 名稱格式是什麼？是怎麼來的？**

A：格式是 `<volumeClaimTemplates.name>-<Pod名稱>`。PVC 名稱前綴來自 YAML 的 `volumeClaimTemplates[0].metadata.name`，後綴是 StatefulSet 名稱加序號。例如 `volumeClaimTemplates.name` 是 `mysql-data`、Pod 是 `mysql-0`，PVC 就叫 `mysql-data-mysql-0`。

**Q2：StatefulSet 刪除後，PVC 為什麼不會自動刪？**

A：K8s 保護資料不被誤刪。如果 StatefulSet 被誤刪，PVC 裡的資料還在，重建 StatefulSet 後可以重新掛載。生產環境的資料庫資料永遠比 StatefulSet YAML 珍貴，K8s 選擇保守策略，讓管理員手動決定要不要刪 PVC。

---

## 6-16 回頭操作 Loop 5（~5 min）

### ④ 學員實作

**🎯 必做題：Redis StatefulSet 部署**

> 剛才我們用 MySQL 示範了 StatefulSet 的三大特性：固定名稱、有序啟動、各自獨立的 PVC。
> 現在換你自己來，用 Redis 把這三件事親手驗證一遍。
>
> 任務：你的團隊要部署 Redis 快取叢集，要求每個 Pod 有固定名稱、有序啟動、各自獨立的 500Mi 儲存。請自己寫一份 StatefulSet YAML（image: `redis:7`，2 個副本，記得要搭配 Headless Service），套用後用以下指令驗收。

驗收指令：

```bash
kubectl get pods          # 應看到 redis-0 和 redis-1（有序啟動）
kubectl get pvc           # 應看到兩個獨立的 PVC
kubectl delete pod redis-0
kubectl get pods -w       # 等重建，確認名稱還是 redis-0
```

<details>
<summary>📋 講師參考答案（巡堂用，學員做完才看）</summary>

**完整 YAML**

```yaml
# redis-statefulset.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis-headless
spec:
  clusterIP: None          # Headless Service：StatefulSet 必備，讓每個 Pod 有獨立 DNS
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
  serviceName: redis-headless   # 必須對應上面 Service 的 name
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
        name: redis-data        # PVC 名稱前綴；最終 PVC = redis-data-redis-0 / redis-data-redis-1
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 500Mi
```

**套用與驗收**

```bash
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/redis-statefulset.yaml
```

預期輸出：
```
service/redis-headless created
statefulset.apps/redis created
```

```bash
kubectl get pods -w           # 觀察有序啟動：redis-0 Running 後才出現 redis-1
```

預期輸出：
```
NAME      READY   STATUS              RESTARTS   AGE
redis-0   0/1     ContainerCreating   0          1s
redis-0   1/1     Running             0          10s
redis-1   0/1     Pending             0          0s
redis-1   0/1     ContainerCreating   0          1s
redis-1   1/1     Running             0          12s
```

```bash
kubectl get pvc               # 確認兩個獨立 PVC，名稱格式 = <volumeClaimTemplates.name>-<Pod名稱>
```

預期輸出：
```
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
redis-data-redis-0  Bound    pvc-c3d4e5f6-...                           500Mi      RWO            local-path     1m
redis-data-redis-1  Bound    pvc-d4e5f6a7-...                           500Mi      RWO            local-path     30s
```

```bash
kubectl delete pod redis-0    # 砍掉 redis-0，驗證 StatefulSet 會用同名重建
```

```bash
kubectl get pods -w           # 確認重建後名稱仍是 redis-0（不是 redis-2 之類的隨機名）
```

預期輸出：
```
NAME      READY   STATUS              RESTARTS   AGE
redis-0   0/1     ContainerCreating   0          1s
redis-0   1/1     Running             0          10s
```

**重點說明**

- `clusterIP: None`：Headless Service 必填，StatefulSet 靠它給每個 Pod 分配穩定 DNS（`redis-0.redis-headless`）
- `serviceName` 必須對應 Service 的 `name`，否則 Pod DNS 無法正常解析
- `volumeClaimTemplates` 讓每個 Pod 自動取得獨立 PVC，共用 PV 對資料庫是危險的
- Pod 被刪重建後，名稱不變、PVC 不變，資料因此得以保留

</details>

---

**🎯 挑戰題：Scale 反序刪除驗證**

> 剛才驗證了固定名稱，現在來驗證「有序刪除」。把 MySQL StatefulSet Scale 到 3，再 Scale 回 1，用 `-w` 親眼看 K8s 用什麼順序刪 Pod。

驗收指令：

```bash
kubectl scale statefulset mysql --replicas=3
kubectl get pods -w    # 觀察 mysql-2 最後建立
kubectl scale statefulset mysql --replicas=1
kubectl get pods -w    # 觀察刪除順序：mysql-2 先刪，還是 mysql-1 先刪？
```

<details>
<summary>📋 講師參考答案（巡堂用，學員做完才看）</summary>

```bash
kubectl scale statefulset mysql --replicas=3
```

預期輸出：
```
statefulset.apps/mysql scaled
```

```bash
kubectl get pods -w    # mysql-2 最後建
```

預期輸出：
```
NAME      READY   STATUS              RESTARTS   AGE
mysql-0   1/1     Running             0          15m
mysql-1   1/1     Running             0          14m
mysql-2   0/1     Pending             0          0s
mysql-2   0/1     ContainerCreating   0          1s
mysql-2   1/1     Running             0          20s
```

```bash
kubectl scale statefulset mysql --replicas=1
kubectl get pods -w    # mysql-2 先 Terminating，然後 mysql-1，mysql-0 不受影響
```

**重點說明**

- Scale up：從小到大依序建立（0 → 1 → 2），確保前一個 Ready 才建下一個
- Scale down：從大到小反序刪除（2 → 1），保護低序號 Pod（通常是主節點）不被誤刪
- 這個順序是 StatefulSet 的核心設計，讓主從式資料庫可以安全縮容

</details>

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
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/redis-statefulset.yaml
```

預期輸出：
```
service/redis-headless created
statefulset.apps/redis created
```

```bash
kubectl get pods -w           # 觀察有序啟動
```

預期輸出：
```
NAME      READY   STATUS              RESTARTS   AGE
redis-0   0/1     ContainerCreating   0          1s
redis-0   1/1     Running             0          10s
redis-1   0/1     Pending             0          0s
redis-1   0/1     ContainerCreating   0          1s
redis-1   1/1     Running             0          12s
```

```bash
kubectl get pvc               # 確認兩個獨立 PVC
```

預期輸出：
```
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
redis-data-redis-0  Bound    pvc-c3d4e5f6-...                           500Mi      RWO            local-path     1m
redis-data-redis-1  Bound    pvc-d4e5f6a7-...                           500Mi      RWO            local-path     30s
```

```bash
kubectl delete pod redis-0    # 砍掉 redis-0
```

預期輸出：
```
pod "redis-0" deleted
```

```bash
kubectl get pods -w           # 等重建，確認名稱還是 redis-0
```

預期輸出：
```
NAME      READY   STATUS              RESTARTS   AGE
redis-0   0/1     ContainerCreating   0          1s
redis-0   1/1     Running             0          10s
```

**挑戰題**

```bash
kubectl scale statefulset mysql --replicas=3
```

預期輸出：
```
statefulset.apps/mysql scaled
```

```bash
kubectl get pods -w    # mysql-2 最後建
```

預期輸出：
```
NAME      READY   STATUS              RESTARTS   AGE
mysql-0   1/1     Running             0          15m
mysql-1   1/1     Running             0          14m
mysql-2   0/1     Pending             0          0s
mysql-2   0/1     ContainerCreating   0          1s
mysql-2   1/1     Running             0          20s
```

```bash
kubectl scale statefulset mysql --replicas=1
```

預期輸出：
```
statefulset.apps/mysql scaled
```

```bash
kubectl get pods -w    # mysql-2 先 Terminating，然後 mysql-1，mysql-0 不受影響
```

預期輸出：
```
NAME      READY   STATUS        RESTARTS   AGE
mysql-2   1/1     Terminating   0          3m
mysql-1   1/1     Terminating   0          14m
mysql-0   1/1     Running       0          15m
```

縮容到 1 後手動清多餘的 PVC（mysql-2 的 PVC 若已在縮到 2 時刪過，這裡只刪 mysql-1 即可）：
```bash
kubectl delete pvc mysql-data-mysql-1
```

預期輸出：
```
persistentvolumeclaim "mysql-data-mysql-1" deleted
```

---

**清理（Loop 4 結束）**

```bash
kubectl delete statefulset mysql redis
```

預期輸出：
```
statefulset.apps "mysql" deleted
statefulset.apps "redis" deleted
```

```bash
kubectl delete svc mysql-headless redis-headless
```

預期輸出：
```
service "mysql-headless" deleted
service "redis-headless" deleted
```

```bash
kubectl delete secret mysql-sts-secret
```

預期輸出：
```
secret "mysql-sts-secret" deleted
```

```bash
kubectl delete pvc --all
```

預期輸出：
```
persistentvolumeclaim "mysql-data-mysql-0" deleted
persistentvolumeclaim "mysql-data-mysql-1" deleted
persistentvolumeclaim "redis-data-redis-0" deleted
persistentvolumeclaim "redis-data-redis-1" deleted
```

（實際會根據你的操作刪掉所有殘留的 PVC，包含 mysql 和 redis 的）

```bash
kubectl get all    # 確認清乾淨
```

預期輸出：
```
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.43.0.1    <none>        443/TCP   10d
```

---

**停一下，算一下你剛才手寫了什麼**

為了讓一個 MySQL 正常跑起來，你寫了：

1. `Secret`：管密碼（`mysql-sts-secret`）
2. `Headless Service`：讓每個 Pod 有自己的 DNS（`mysql-headless`）
3. `StatefulSet`：本體，含 `volumeClaimTemplates`
4. K8s 自動幫你建了 `mysql-data-mysql-0`、`mysql-data-mysql-1` 兩個 PVC

這是最精簡的版本。真實的生產環境 MySQL，還需要加 ConfigMap（資料庫名稱）、NetworkPolicy（只允許特定 Pod 連進來）、Resource Limits（防止 OOM）。

下一個 Loop，我讓你看這些東西，有人幫你打包好了。
