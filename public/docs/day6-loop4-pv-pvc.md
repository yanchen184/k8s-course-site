# Day 6 Loop 4 — PV + PVC 持久化儲存

---

## 6-11 PV + PVC 概念（~15 min）

### ① 課程內容

**問題引入：資料去哪了？**

📄 6-11 第 1 張

先做一個現場實驗。MySQL 之前已經跑起來了，進去建一個資料庫，寫一筆資料進去，然後把 Pod 砍掉，看看發生什麼事。

```bash
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
```

```sql
CREATE DATABASE testdb;
USE testdb;
CREATE TABLE users (id INT, name VARCHAR(50));
INSERT INTO users VALUES (1, 'Alice');
SELECT * FROM users;
-- → Alice 在，沒問題
```

退出。

```bash
kubectl delete pod -l app=mysql
```

Pod 被砍掉，Deployment 自動補一個新的。等它跑起來，再進去看：

```bash
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
```

```sql
USE testdb;
```

```
ERROR 1049 (42000): Unknown database 'testdb'
```

資料全消失了。

---

**為什麼消失？**

📄 6-11 第 2 張

容器有自己的 filesystem，叫做 overlay filesystem。這個 filesystem 跟容器同生同死。容器刪了，裡面寫的所有東西也跟著刪。

你在 Docker 時代也碰過這個問題。`docker run mysql`，容器刪掉，資料就沒了。所以當時的解法是加 `-v`：

```bash
docker run -v mydata:/var/lib/mysql mysql
```

第四堂也用過 `emptyDir`。但 emptyDir 不是持久化，它跟 Pod 同生同死。Pod 刪了，emptyDir 裡的東西也跟著沒。

真正的持久化，要用 PV 和 PVC。

---

**PV 跟 PVC 是什麼？**

📄 6-11 第 3 張

K8s 把儲存這件事拆成兩層：

| Docker | K8s | 角色 |
|:---|:---|:---|
| `docker volume create mydata` | PersistentVolume (PV) | 建立儲存空間（管理員做）|
| `-v mydata:/var/lib/mysql` | PersistentVolumeClaim (PVC) | 使用儲存空間（開發者做）|

PV 是管理員規劃出來的一塊儲存空間。可以是本機硬碟、NFS、雲端硬碟（AWS EBS、GCP PD）。

PVC 是開發者對「我需要一塊儲存空間」的申請書。你說你要多大、要哪種 accessMode，K8s 自動去找一個符合條件的 PV，配對起來，叫做 Binding。

---

**比喻：停車場**

📄 6-11 第 4 張

你可以把 PV 想成停車場的停車位，管理員（叢集管理員）規劃了幾個停車位，決定每個位子多大。

PVC 就是你去申請「我要租一個車位」，管理員幫你分配一個符合條件的位子給你，這就是 Binding。

為什麼要拆兩層？職責分離。管儲存的人（管理員）跟寫程式的人（開發者）分工。開發者不需要知道底層是 NFS 還是雲端硬碟，只要說「我要 1Gi，ReadWriteOnce」就好。

---

**AccessMode：誰可以讀、誰可以寫**

📄 6-11 第 5 張

| AccessMode | 縮寫 | 意思 | 場景 |
|:---|:---|:---|:---|
| ReadWriteOnce | RWO | 同時只有一個 Node 可以讀寫 | 資料庫（最常用）|
| ReadOnlyMany | ROX | 多個 Node 唯讀 | 靜態檔案、設定檔 |
| ReadWriteMany | RWX | 多個 Node 可以讀寫 | 需要 NFS 或雲端共享儲存 |

學習環境用的是 `hostPath`（本機路徑），只支援 RWO。生產環境如果要 RWX，通常是 NFS 或 AWS EFS。

---

**ReclaimPolicy：PVC 刪掉之後，PV 怎麼辦？**

📄 6-11 第 6 張

| 策略 | 行為 | 場景 |
|:---|:---|:---|
| Retain | PVC 刪了，PV 和裡面的資料保留，要手動清理 | 生產環境（怕誤刪）|
| Delete | PVC 刪了，PV 和資料一起刪 | 開發環境、雲端自動 provisioning |

本課用 Retain。你可以把它理解成：我退租了，但停車位還在那裡，不會被拆掉，等管理員重新分配。

---

**靜態佈建流程（Static Provisioning）**

📄 6-11 第 7 張

```
管理員建 PV
    ↓
開發者建 PVC（說明需求）
    ↓
K8s 自動配對（Binding）
    ↓
Pod 掛載 PVC
    ↓
資料跟 PV 走，Pod 重建也不會消失
```

這個流程叫靜態佈建：PV 先手動建好，等 PVC 來配對。下一個 Loop 會講動態佈建（StorageClass），不用手動建 PV。

---

### ② 所有指令＋講解

本節以概念為主，指令集中於 6-12 實作。

---

### ③ 題目

1. Pod 被砍掉之後，emptyDir 裡的資料為什麼會消失？emptyDir 跟 PVC 最根本的差別是什麼？
2. 下面這個情境應該用哪種 AccessMode？說明原因：
   - 一個 MySQL 資料庫，只在一個 Node 上跑
   - 一份靜態網站的 HTML 檔，10 個 Pod 都要唯讀掛載
3. PV 的 ReclaimPolicy 設 Retain 和 Delete 有什麼差別？生產環境建議用哪個？為什麼？

---

### ④ 解答

1. emptyDir 的生命週期跟 Pod 綁在一起，Pod 刪了 emptyDir 也跟著刪。PVC 的生命週期跟 Pod 無關，PVC 綁的是 PV（叢集層級的儲存資源），Pod 刪了重建，一樣掛到同一個 PVC，資料就還在。

2. MySQL 用 `ReadWriteOnce (RWO)`：資料庫需要讀寫，且只允許一個 Node 同時掛載（同時多個 Node 寫同一份資料庫檔案會造成 corruption）。靜態網站用 `ReadOnlyMany (ROX)`：多個 Pod 需要同時讀，唯讀掛載不會有衝突。

3. `Retain`：PVC 刪掉後，PV 和資料保留，需要管理員手動決定如何處理。`Delete`：PVC 刪掉後，PV 和資料一起刪除。生產環境建議用 Retain，避免誤刪 PVC 導致資料永久消失，保留人工確認的機會。

---

## 6-12 PV + PVC 實作（~15 min）

### ① 課程內容

**實作流程**

📄 6-12 第 1 張

1. 建 YAML 檔，包含三個部分：PV、PVC、MySQL Deployment
2. 套用，確認 PV 和 PVC 狀態都是 Bound
3. 進 MySQL 寫資料
4. 砍 Pod，等新 Pod 跑起來
5. 再進 MySQL 驗證資料還在

**完整 YAML：pv-pvc.yaml**

📄 6-12 第 2 張

```yaml
# PV：管理員建的儲存空間
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-pv
spec:
  capacity:
    storage: 2Gi                        # PV 提供 2Gi 空間
  accessModes:
    - ReadWriteOnce                     # 只允許一個 Node 讀寫
  persistentVolumeReclaimPolicy: Retain # PVC 刪了，PV 資料保留
  storageClassName: manual              # 手動配對用，要跟 PVC 一樣
  hostPath:
    path: /tmp/k8s-pv-data              # 學習用：直接用 Node 的本機路徑
---
# PVC：開發者申請使用儲存空間
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: local-pvc
spec:
  accessModes:
    - ReadWriteOnce                     # 要跟 PV 的 accessModes 一致
  resources:
    requests:
      storage: 1Gi                      # 申請 1Gi（PV 有 2Gi，夠用）
  storageClassName: manual              # 要跟 PV 的 storageClassName 一樣
---
# MySQL Deployment：掛載 PVC
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
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "rootpassword123"
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql     # 把 PVC 掛到 MySQL 的資料目錄
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: local-pvc          # 指定要用哪個 PVC
```

注意 `hostPath`：這只是學習用的做法，直接用 Node 的本機路徑當儲存。生產環境不會這樣用，生產環境會用 NFS、雲端硬碟（AWS EBS、GCP PD）或 StorageClass 動態佈建。

---

### ② 所有指令＋講解

---

**套用 YAML**

```bash
kubectl apply -f pv-pvc.yaml
```

- `apply -f`：宣告式套用，f 是 file 的縮寫

打完要看：
```
persistentvolume/local-pv created
persistentvolumeclaim/local-pvc created
deployment.apps/mysql-deploy created
```

三個資源都建起來。

---

**確認 PV 狀態**

📄 6-12 第 3 張

```bash
kubectl get pv
```

打完要看：
```
NAME       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   AGE
local-pv   2Gi        RWO            Retain           Bound    default/local-pvc   manual         10s
```

欄位說明：
- `NAME`：PV 名稱
- `CAPACITY`：這個 PV 提供的儲存容量
- `ACCESS MODES`：支援的存取模式（RWO = ReadWriteOnce）
- `RECLAIM POLICY`：PVC 刪除後的 PV 處理策略
- `STATUS`：`Bound` 代表已配對到 PVC，`Available` 代表還沒有 PVC 使用，`Released` 代表 PVC 已刪但 PV 還在
- `CLAIM`：配對到哪個 PVC（格式：`namespace/pvc-name`）
- `STORAGECLASS`：使用的 StorageClass 名稱

STATUS 是 `Bound` 才對。如果是 `Available` 就是還沒配對到，去查 PVC 狀態。

---

**確認 PVC 狀態**

```bash
kubectl get pvc
```

打完要看：
```
NAME        STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
local-pvc   Bound    local-pv   2Gi        RWO            manual         10s
```

欄位說明：
- `NAME`：PVC 名稱
- `STATUS`：`Bound` 代表已綁定到 PV，`Pending` 代表還在等配對
- `VOLUME`：綁定到哪個 PV
- `CAPACITY`：實際分到的容量（以 PV 的容量為準，不是 PVC 申請的量）
- `ACCESS MODES`：繼承自 PV 的存取模式

兩個都是 Bound，配對成功。

---

**等 MySQL Pod 跑起來**

```bash
kubectl get pods -l app=mysql -w
```

- `-l app=mysql`：只看有 `app=mysql` 標籤的 Pod
- `-w`：watch 模式，持續監看狀態變化，看到 Running 再按 Ctrl+C 離開

打完要看（過程）：
```
NAME                            READY   STATUS              RESTARTS   AGE
mysql-deploy-6f7d9b8c4d-xkp2m   0/1     ContainerCreating   0          5s
mysql-deploy-6f7d9b8c4d-xkp2m   1/1     Running             0          20s
```

MySQL 初始化需要一點時間，等 STATUS 變成 Running 再繼續。

---

**進 MySQL 寫資料**

📄 6-12 第 4 張

```bash
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
```

- `exec -it`：進入容器執行互動式命令，`-i` 保持輸入流，`-t` 分配一個 TTY（偽終端）
- `deployment/mysql-deploy`：目標是 mysql-deploy 這個 Deployment 管的 Pod
- `--`：分隔 kubectl 參數和容器內的指令
- `mysql -u root -prootpassword123`：以 root 連進 MySQL，`-p` 後面直接接密碼（中間不加空格）

進去之後執行：

```sql
CREATE DATABASE testdb;
USE testdb;
CREATE TABLE users (id INT, name VARCHAR(50));
INSERT INTO users VALUES (1, 'Alice');
SELECT * FROM users;
```

打完要看：
```
+----+-------+
| id | name  |
+----+-------+
|  1 | Alice |
+----+-------+
1 row in set (0.00 sec)
```

Alice 在。輸入 `exit` 退出。

---

**砍 Pod，模擬 Pod 重啟**

```bash
kubectl delete pod -l app=mysql
```

- `delete pod -l app=mysql`：刪除所有有 `app=mysql` 標籤的 Pod

打完要看：
```
pod "mysql-deploy-6f7d9b8c4d-xkp2m" deleted
```

Deployment 偵測到 Pod 少了一個，會立刻建新 Pod 補回來。

---

**等新 Pod 跑起來**

```bash
kubectl get pods -l app=mysql -w
```

打完要看（過程）：
```
NAME                            READY   STATUS              RESTARTS   AGE
mysql-deploy-6f7d9b8c4d-abc34   0/1     ContainerCreating   0          3s
mysql-deploy-6f7d9b8c4d-abc34   1/1     Running             0          22s
```

新 Pod 的名字已經不一樣了（abc34 取代了 xkp2m），Pod 確實是重建的。

---

**驗證資料還在**

📄 6-12 第 5 張

```bash
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
```

進去之後：

```sql
USE testdb;
SELECT * FROM users;
```

打完要看：
```
+----+-------+
| id | name  |
+----+-------+
|  1 | Alice |
+----+-------+
1 row in set (0.00 sec)
```

Alice 還在。Pod 換了，資料沒消失，因為資料存在 PV 裡面，PV 的生命週期跟 Pod 無關。

---

**Pending 排錯：為什麼 PVC 一直是 Pending？**

📄 6-12 第 6 張

如果 `kubectl get pvc` 看到 STATUS 是 `Pending`，通常是以下三個原因：

| 問題 | 症狀 | 解法 |
|:---|:---|:---|
| `storageClassName` 不一致 | PVC Pending，PV Available | 確認 PV 和 PVC 的 `storageClassName` 完全一樣 |
| PV 容量不夠 | PVC Pending，PV Available | PVC 申請的量不能超過 PV 提供的量（PVC 要 5Gi 但 PV 只有 2Gi → Pending）|
| `accessModes` 不匹配 | PVC Pending | PVC 要 RWX，但 PV 只有 RWO → 無法配對 |

排查指令：

```bash
kubectl describe pvc local-pvc
```

看 Events 區塊，會告訴你為什麼找不到符合的 PV。

---

**學員實作任務**

📄 6-12 第 7 張

必做：
1. 自己手寫 `pv-pvc.yaml`（不要複製貼上），三個部分都要有：PV、PVC、MySQL Deployment
2. 套用，確認 PV 和 PVC 都是 Bound
3. 進 MySQL 建 `testdb`，寫一筆 `INSERT`
4. `kubectl delete pod -l app=mysql` 砍掉 Pod
5. 等新 Pod 起來，再進去驗證資料還在

挑戰題：
- 再建一個 `local-pvc2`，storageClassName 也是 manual，嘗試申請 1Gi
- 觀察 `kubectl get pvc` → local-pvc2 的 STATUS 是什麼？
- 解釋為什麼

---

### ③ 題目

**必做（1-2 題）**

1. 故障診斷題：以下 YAML 有三個錯誤，找出來並修好，讓 PostgreSQL 可以正常啟動並持久化資料。

```yaml
# 有問題的 broken-pv-pvc.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pg-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteMany        # 錯誤一
  storageClassName: fast   # 錯誤二
  hostPath:
    path: /data/pg
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pg-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: manual # 錯誤三（要跟 PV 一致）
  resources:
    requests:
      storage: 2Gi         # 超過 PV 容量
```

修好之後：
- `kubectl get pv,pvc` 兩個都要是 `Bound`
- 進 PostgreSQL Pod 建一個 database，刪 Pod，確認 database 還在

2. PVC 申請的容量是 1Gi，但 `kubectl get pvc` 顯示 CAPACITY 是 2Gi，為什麼？

**挑戰題**

3. 在 local-pv 已經被 local-pvc 綁定的情況下，再建一個 `local-pvc2`（storageClassName: manual，requests: 1Gi）。觀察 `kubectl get pvc` 的輸出，說明 local-pvc2 的 STATUS 是什麼，為什麼。

---

### ④ 解答

1. 三個錯誤：

   **錯誤一**：`accessModes: ReadWriteMany` → 改成 `ReadWriteOnce`。
   hostPath PV 只支援 RWO（單節點讀寫），填 RWX 會導致 PVC 找不到符合的 PV。

   **錯誤二**：`storageClassName: fast` → 改成 `manual`（要跟 PVC 一致）。
   storageClassName 是 PV 和 PVC 的配對依據，不一致就不會 Bound。

   **錯誤三**：PVC `storage: 2Gi` 超過 PV 的 1Gi → 改成 `1Gi`（或把 PV 的容量改到 >= 2Gi）。
   PVC 申請的容量不能超過 PV 提供的容量。

   修好後驗證：
   ```bash
   kubectl apply -f broken-pv-pvc.yaml
   kubectl get pv,pvc                         # 兩個都是 Bound
   # 部署 PostgreSQL（自行用 Deployment + image: postgres:15）
   kubectl exec -it <pg-pod> -- psql -U postgres -c "CREATE DATABASE myapp;"
   kubectl delete pod <pg-pod>
   kubectl get pods -w                         # 等新 Pod Running
   kubectl exec -it <新pg-pod> -- psql -U postgres -c "\l"
   # → myapp 還在
   ```

2. PVC 申請的量是「最少需要多少」（requests），K8s 配對時找「容量 >= 申請量」的 PV。local-pv 有 2Gi，符合 PVC 要 1Gi 的條件，所以配對成功。CAPACITY 顯示的是 PV 實際提供的容量（2Gi），不是 PVC 申請的量（1Gi）。

3. local-pvc2 的 STATUS 是 `Pending`。原因：一個 PV 同時只能綁定一個 PVC（RWO 語義）。local-pv 已經被 local-pvc 佔走，叢集裡沒有其他符合條件的 PV，所以 local-pvc2 只能一直等，等到有新的 PV 出現為止。`kubectl describe pvc local-pvc2` 的 Events 會顯示 `no persistent volumes available for this claim`。

---

## 6-13 回頭操作 Loop 4（~5 min）

### ① 課程內容

📄 6-13 第 1 張

**帶做確認**

先確認大家的環境狀態都對：

```bash
kubectl get pv,pvc
```

打完要看：
```
NAME                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS
persistentvolume/local-pv   2Gi        RWO            Retain           Bound    default/local-pvc   manual

NAME                              STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS
persistentvolumeclaim/local-pvc   Bound    local-pv   2Gi        RWO            manual
```

兩個都是 Bound，才能繼續。

---

**三個常見坑**

📄 6-13 第 2 張

這三個坑最常讓 PVC 卡在 Pending：

1. **storageClassName 不一致**：PV 寫 `manual`，PVC 寫 `standard`，大小寫或名稱不一樣就配不上
2. **accessModes 不匹配**：PVC 要 RWX，PV 只提供 RWO，不配對
3. **PV 容量不夠**：PVC 要 5Gi，PV 只有 2Gi，K8s 不會幫你切割，直接 Pending

排查指令永遠是 `kubectl describe pvc <name>`，看 Events 的錯誤訊息。

---

**挑戰題說明**

📄 6-13 第 3 張

挑戰題建了 `local-pvc2`，但它一直 Pending。這是故意的。

一個 PV 同時只能綁一個 PVC。local-pv 已經被 local-pvc 拿走了，第二個 PVC 就只能等。你要有第二個 PV，才能讓第二個 PVC 綁定。

這就引出了下一個問題：手動建 PV 太麻煩了。你有 10 個微服務，每個要不同容量，你要手動建 10 個 PV 嗎？不可能嘛。

---

**銜接下一個 Loop：StorageClass**

📄 6-13 第 4 張

下一個 Loop 要講 StorageClass。StorageClass 解決的就是「手動建 PV 太煩」這件事。

有了 StorageClass，你只要建 PVC，K8s 自動幫你建對應的 PV，叫做動態佈建（Dynamic Provisioning）。雲端環境（GKE、EKS、AKS）預設就是這樣運作的。

這個 Loop 先把「PV 和 PVC 怎麼配對、為什麼需要持久化」搞清楚，StorageClass 建立在這個基礎上。

---

### ② 所有指令＋講解

---

**查看 PV 和 PVC 狀態（合併查詢）**

```bash
kubectl get pv,pvc
```

- `get pv,pvc`：一次查多種資源，用逗號分隔，逗號前後不加空格

打完要看：
```
NAME                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS
persistentvolume/local-pv   2Gi        RWO            Retain           Bound    default/local-pvc   manual

NAME                              STATUS   VOLUME     CAPACITY   ACCESS MODES   STORAGECLASS
persistentvolumeclaim/local-pvc   Bound    local-pv   2Gi        RWO            manual
```

兩個 STATUS 都是 Bound，正常。

---

**排查 PVC Pending**

```bash
kubectl describe pvc local-pvc
```

- `describe pvc <name>`：顯示 PVC 的詳細狀態和事件記錄

打完要看（關鍵區塊）：
```
Name:          local-pvc
Status:        Bound
Volume:        local-pv
...
Events:
  Type    Reason                Age   From                         Message
  ----    ------                ----  ----                         -------
  Normal  WaitForFirstConsumer  5s    persistentvolume-controller  waiting for first consumer to be created before binding
```

如果 STATUS 是 Pending，Events 區塊會告訴你原因（找不到符合的 PV、容量不夠、storageClassName 不對等）。

異常狀況：
- `no persistent volumes available for this claim`：沒有符合條件的 PV，查 storageClassName 和 accessModes 是否一致
- `Unbound immediate PersistentVolumes are not allowed`：StorageClass 設定問題（進階場景）

---

### ③ 題目（本節無新題目）

本節重點是確認環境狀態和講解常見問題，無新題目。挑戰題答案在 6-12 解答第 3 題。

---

### ④ 解答（本節無新解答）

本節無新解答。

---
