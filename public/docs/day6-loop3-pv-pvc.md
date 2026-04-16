# Day 6 Loop 3 — PV + PVC 持久化儲存

---

## 6-11 PV + PVC 概念（~5 min）

### ① 課程內容

這節解釋為什麼 Pod 重建之後資料會消失，以及 K8s 用 PV 和 PVC 兩層設計來解決持久化問題。（純概念，不跑指令，6-12 實作時會直接看到驗證效果。）

---

📄 6-11 第 1 張

**為什麼資料會消失？**

容器有自己的 filesystem，叫做 overlay filesystem。它的原理是把多層 image 疊在一起，形成一個虛擬的檔案系統，你寫入的資料會放在最上面那一層（writable layer）。容器刪了，那層就不見了，底下的 image 層不受影響，但你寫的東西也跟著沒了。所以這個 filesystem 跟容器同生同死。

你在 Docker 時代也碰過這個問題。`docker run mysql`，容器刪掉，資料就沒了。所以當時的解法是加 `-v`：

```bash
docker run -v mydata:/var/lib/mysql mysql
```

第四堂也用過 `emptyDir`。但 emptyDir 不是持久化，它跟 Pod 同生同死。Pod 刪了，emptyDir 裡的東西也跟著沒。

真正的持久化，要用 PV 和 PVC。

---

📄 6-11 第 2 張

**PV 跟 PVC 是什麼？**

K8s 把儲存這件事拆成兩層：

| Docker | K8s | 角色 |
|:---|:---|:---|
| `docker volume create mydata` | PersistentVolume (PV) | 建立儲存空間（管理員做）|
| `-v mydata:/var/lib/mysql` | PersistentVolumeClaim (PVC) | 使用儲存空間（開發者做）|

PV 是管理員規劃出來的一塊儲存空間，可以是本機硬碟、NFS、雲端硬碟。把它想成停車場的車位——管理員劃好位子，PVC 就是你去申請「我要租一個車位」，K8s 自動幫你配對，這叫 Binding。職責分離：管儲存的人（管理員）跟寫程式的人（開發者）分工，開發者不需要知道底層細節。

---

📄 6-11 第 3 張

**AccessMode：誰可以讀、誰可以寫**

| AccessMode | 縮寫 | 意思 | 場景 |
|:---|:---|:---|:---|
| ReadWriteOnce | RWO | 同時只有一個 Node 可以讀寫 | 資料庫（最常用）|
| ReadOnlyMany | ROX | 多個 Node 唯讀 | 靜態檔案、設定檔 |
| ReadWriteMany | RWX | 多個 Node 可以讀寫 | 需要 NFS 或雲端共享儲存 |

學習環境用的是 `hostPath`（本機路徑），只支援 RWO。生產環境如果要 RWX，通常是 NFS 或 AWS EFS。

---

📄 6-11 第 4 張

**ReclaimPolicy：PVC 刪掉之後，PV 怎麼辦？**

| 策略 | 行為 | 場景 |
|:---|:---|:---|
| Retain | PVC 刪了，PV 和裡面的資料保留，要手動清理 | 生產環境（怕誤刪）|
| Delete | PVC 刪了，PV 和資料一起刪 | 開發環境、雲端自動 provisioning |

本課用 Retain。你可以把它理解成：我退租了，但停車位還在那裡，不會被拆掉，等管理員重新分配。

---

📄 6-11 第 5 張

**靜態佈建流程（Static Provisioning）**

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

📄 6-11 第 6 張

**今天要做的事**

用一個 YAML 建 PV、PVC、MySQL Deployment，把 MySQL 的資料目錄掛到 PVC，然後砍 Pod 再重建，進去確認資料還在。

好，開始。

---

## 6-12 PV + PVC 實作（~15 min）

### ② 所有指令＋講解

📄 6-12 第 1 張

**靜態佈建流程（Static Provisioning）**

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

📄 6-12 第 2 張

**實作步驟**

1. 套用 YAML（含 PV、PVC、MySQL Deployment）
2. 確認 PV 和 PVC 狀態都是 Bound
3. 進 MySQL 寫資料
4. 砍 Pod，等新 Pod 跑起來
5. 再進 MySQL 驗證資料還在

---

📄 6-12 第 3 張

**完整 YAML：pv-pvc.yaml**

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
    # hostPath 就是把 Node 本機的某個目錄掛進 Pod
    # 學習環境用，因為我們只有一台 Node
    # 正式環境不用 hostPath，改用 NFS、雲端硬碟（AWS EBS、GCP PD）等
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

**套用 YAML**

```bash
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/pv-pvc.yaml
```

打完要看：
```
persistentvolume/local-pv created
persistentvolumeclaim/local-pvc created
deployment.apps/mysql-deploy created
```

---

📄 6-12 第 4 張

**確認 PV 狀態**

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
- `STATUS`：`Bound` 代表已綁定到 PV，`Pending` 代表還在等配對
- `VOLUME`：綁定到哪個 PV
- `CAPACITY`：實際分到的容量（以 PV 的容量為準，不是 PVC 申請的量）

兩個都是 Bound，配對成功。

---

**等 MySQL Pod 跑起來**

```bash
kubectl get pods -l app=mysql -w
```

打完要看（過程）：
```
NAME                            READY   STATUS              RESTARTS   AGE
mysql-deploy-6f7d9b8c4d-xkp2m   0/1     ContainerCreating   0          5s
mysql-deploy-6f7d9b8c4d-xkp2m   1/1     Running             0          20s
```

MySQL 初始化需要一點時間，等 STATUS 變成 Running 再繼續。

---

📄 6-12 第 5 張

**進 MySQL 寫資料**

```bash
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
```

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
```

Alice 在。輸入 `exit` 退出。

---

**砍 Pod，模擬 Pod 重啟**

```bash
kubectl delete pod -l app=mysql
```

打完要看：
```
pod "mysql-deploy-6f7d9b8c4d-xkp2m" deleted
```

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

新 Pod 的名字不一樣了（abc34 取代了 xkp2m），Pod 確實是重建的。

---

📄 6-12 第 6 張

**驗證資料還在**

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
```

Alice 還在。Pod 換了，資料沒消失，因為資料存在 PV 裡面，PV 的生命週期跟 Pod 無關。

---

📄 6-12 第 7 張

**Pending 排錯**

如果 `kubectl get pvc` 看到 STATUS 是 `Pending`，通常是以下三個原因：

| 問題 | 解法 |
|:---|:---|
| `storageClassName` 不一致 | 確認 PV 和 PVC 的 `storageClassName` 完全一樣 |
| PV 容量不夠 | PVC 申請的量不能超過 PV 提供的量 |
| `accessModes` 不匹配 | PVC 要 RWX，但 PV 只有 RWO |

排查指令：

```bash
kubectl describe pvc local-pvc
```

預期輸出（Pending 狀態時）：
```
Name:          local-pvc
Namespace:     default
StorageClass:  manual
Status:        Pending
Volume:
Labels:        <none>
Annotations:   <none>
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:
Access Modes:
VolumeMode:    Filesystem
Events:
  Type     Reason              Age   From                         Message
  ----     ------              ----  ----                         -------
  Warning  ProvisioningFailed  10s   persistentvolume-controller  no persistent volumes available for this claim and no storage class is set
```

看 Events 區塊，會告訴你為什麼找不到符合的 PV。

---

### ③ QA

老師念題，念完再念答案。

**Q1：`kubectl get pvc` 顯示 CAPACITY 是 2Gi，但我在 PVC 的 YAML 裡只申請了 1Gi，為什麼顯示 2Gi？**

A：PVC 申請的是「至少多少」，K8s 配對到 PV 後，實際分到的容量以 PV 的容量為準。這裡 PV 是 2Gi，所以 PVC 顯示 2Gi，不是 1Gi。PVC 的 requests 只是篩選條件，不是精確分配。

**Q2：一個 PV 可以同時被多個 PVC 綁定嗎？**

A：不行。一個 PV 同時只能綁定一個 PVC（1:1 關係）。如果叢集裡只有一個 PV，第二個 PVC 會一直是 Pending，等到有新的 PV 釋出才能配對。

---

## 6-13 回頭操作 Loop 4（~5 min）

### ④ 學員實作

**🎯 必做題：PV + PVC 故障診斷**

> 講師說：這份 YAML 有三個設定錯誤，導致 PVC 無法和 PV 綁定。找出三個 bug，修好後 apply，目標：`kubectl get pv,pvc` 兩個都是 `Bound`。

題目 YAML（`broken-pv-pvc.yaml`）——找出三個 bug：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pg-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteMany
  storageClassName: fast
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
  storageClassName: manual
  resources:
    requests:
      storage: 2Gi
```

驗收：
```bash
kubectl apply -f broken-pv-pvc.yaml
kubectl get pv,pvc
# 目標：兩個都是 Bound
```

<details>
<summary>📋 講師參考答案（三個 bug 說明）</summary>

**錯誤一：`accessModes: ReadWriteMany`**

PV 的 `accessModes` 填了 `ReadWriteMany`，但 PVC 要求 `ReadWriteOnce`。K8s 配對時 accessModes 必須一致，兩邊不同所以無法 Bound。
→ 改成 `ReadWriteOnce`。

**錯誤二：`storageClassName: fast`（PV）**

PV 的 `storageClassName` 是 `fast`，PVC 的是 `manual`。storageClassName 是配對的 key，不一致就找不到彼此。
→ 改成 `manual`（跟 PVC 一致）。

**錯誤三：PVC `storage: 2Gi` 超過 PV 的 `1Gi`**

PVC 申請的容量不能超過 PV 提供的容量，K8s 不會把 1Gi 的 PV 分給申請 2Gi 的 PVC。
→ 改成 `1Gi`（或把 PV 的容量改到 >= 2Gi）。

修好後注意：`storageClassName` 是 immutable 欄位，直接 apply 改不了，需要刪掉重建：

```bash
kubectl delete pvc pg-pvc
kubectl delete pv pg-pv
kubectl apply -f broken-pv-pvc.yaml
kubectl get pv,pvc   # 兩個都要是 Bound
```

</details>

---

**🎯 挑戰題**

> 講師說：local-pv 已經被 local-pvc 綁定了。現在再建一個 `local-pvc2`（storageClassName: manual，requests: 1Gi），觀察 STATUS，說說看為什麼是那個狀態？

<details>
<summary>📋 講師參考答案</summary>

local-pvc2 的 STATUS 是 `Pending`。

原因：一個 PV 同時只能綁定一個 PVC（RWO 語義下 1:1）。local-pv 已經被 local-pvc 佔走，叢集裡沒有其他符合條件的 PV，所以 local-pvc2 只能一直等。

`kubectl describe pvc local-pvc2` 的 Events 會顯示：
```
no persistent volumes available for this claim and no storage class is set
```

</details>

---

### ⑤ 學員實作解答

**必做解答：三個錯誤**

錯誤一：`accessModes: ReadWriteMany` → 改成 `ReadWriteOnce`。hostPath PV 只支援 RWO，填 RWX 會導致 PVC 找不到符合的 PV。

錯誤二：`storageClassName: fast` → 改成 `manual`（要跟 PVC 一致）。storageClassName 是 PV 和 PVC 的配對依據，不一致就不會 Bound。

錯誤三：PVC `storage: 2Gi` 超過 PV 的 1Gi → 改成 `1Gi`（或把 PV 的容量改到 >= 2Gi）。PVC 申請的容量不能超過 PV 提供的容量。

修好後驗證：

注意：`storageClassName` 是建立後不可修改的欄位（immutable）。直接 `kubectl apply` 更新不了它，K8s 會拒絕。正確做法是**刪掉舊的再重建**：

```bash
kubectl delete pvc pg-pvc
kubectl delete pv pg-pv
kubectl apply -f broken-pv-pvc.yaml   # 用修好的版本重新建
```

預期輸出：
```
persistentvolumeclaim "pg-pvc" deleted
persistentvolume "pg-pv" deleted
persistentvolume/pg-pv created
persistentvolumeclaim/pg-pvc created
```

```bash
kubectl get pv,pvc    # 兩個都是 Bound
```

預期輸出：
```
NAME                     CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM            STORAGECLASS   AGE
persistentvolume/pg-pv   1Gi        RWO            Retain           Bound    default/pg-pvc   manual         5s

NAME                           STATUS   VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/pg-pvc   Bound    pg-pv    1Gi        RWO            manual         5s
```

**挑戰題解答**

local-pvc2 的 STATUS 是 `Pending`。原因：一個 PV 同時只能綁定一個 PVC（RWO 語義）。local-pv 已經被 local-pvc 佔走，叢集裡沒有其他符合條件的 PV，所以 local-pvc2 只能一直等。`kubectl describe pvc local-pvc2` 的 Events 會顯示 `no persistent volumes available for this claim`。

---

**清理（Loop 3 結束）**

```bash
# 刪掉 mysql-deploy（Deployment 版本，等一下 Loop 4 改用 StatefulSet 跑同一個 MySQL）
kubectl delete deployment mysql-deploy
```

預期輸出：
```
deployment.apps "mysql-deploy" deleted
```

```bash
# PV 和 PVC 保留還是刪掉？— 刪掉，Loop 4 改用 StorageClass 動態佈建，不再手動建 PV
kubectl delete pvc local-pvc
```

預期輸出：
```
persistentvolumeclaim "local-pvc" deleted
```

```bash
kubectl delete pv local-pv
```

預期輸出：
```
persistentvolume "local-pv" deleted
```

```bash
kubectl get all    # 確認清乾淨，只剩 kubernetes Service
```

預期輸出：
```
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.43.0.1    <none>        443/TCP   2d
```

下一個 Loop（StatefulSet）會用同一個 MySQL 的概念，但改用 StatefulSet 來跑。你會看到為什麼 Deployment 跑資料庫根本上有哪四個問題，以及 StatefulSet 怎麼解決這些問題。
