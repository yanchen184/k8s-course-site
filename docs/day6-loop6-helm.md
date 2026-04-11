# Day 6 Loop 6 — Helm 套件管理

---

## 6-17 Helm 概念（~15 min）

### ① 課程內容

📄 6-17 第 1 張

**問題：YAML 太多太散**

一個 MySQL 部署，光 YAML 就需要：

- Secret（存密碼）
- ConfigMap（存設定）
- StatefulSet（主要服務）
- Headless Service（內部連線用）
- PVC（儲存空間）

加起來 5-6 個檔案，這還只是 MySQL 一個服務。

再加上 Redis、RabbitMQ、Elasticsearch，YAML 數量很快就幾十個。

三個環境（dev/staging/prod）代表三套 YAML。改一個地方，三個環境都要手動同步。

全世界幾百萬人都在寫一模一樣的 MySQL YAML。有沒有現成的？

📄 6-17 第 2 張

**套件管理器類比**

你在其他地方早就用過套件管理器了：

| 平台 | 指令 |
|:---|:---|
| Ubuntu | `apt install mysql-server` |
| macOS | `brew install mysql` |
| Node.js | `npm install express` |
| Python | `pip install flask` |
| Kubernetes | **Helm** |

邏輯一樣：告訴它你要什麼，它幫你搞定所有細節。

📄 6-17 第 3 張

**Helm 核心概念**

| 概念 | 說明 | 對照 |
|:---|:---|:---|
| Helm | 套件管理工具本身 | apt / yum / brew |
| Chart | 一包 YAML 範本 | .deb / .rpm 安裝包 |
| Release | Chart 安裝到叢集後的實例 | 已安裝好的軟體 |
| Repository | Chart 的倉庫 | apt source list |
| values.yaml | 客製化參數 | 軟體的設定檔 |

重點說三個：

- **Chart**：別人已經寫好的 YAML 集合，打包成一個東西，裡面有 StatefulSet、Service、PVC 全部。
- **Release**：你把一個 Chart 安裝到叢集後，這個安裝實例叫做 Release。同一個 Chart 可以裝多個 Release（例如裝兩個 MySQL：一個 dev 用、一個 prod 用）。
- **values.yaml**：客製化的地方。Chart 提供範本，你用 values.yaml 告訴它：密碼是什麼、要幾個副本、硬碟要多大。

📄 6-17 第 4 張

**Docker Compose 對照**

你可能會想把 Helm 和 Docker Compose 做比較：

| Docker Compose | Helm |
|:---|:---|
| docker-compose.yml | Chart（一包 YAML 範本）|
| `docker compose up` | `helm install` |
| `docker compose down` | `helm uninstall` |
| `.env` 檔案 | values.yaml |

差異在於：Docker Compose 的設定是你自己寫的；Helm 的 Chart 是別人（社群）已經寫好的，你拿來用，只改你需要改的參數。

📄 6-17 第 5 張

**Helm 三個核心功能**

**1. 一鍵安裝**

```bash
helm install my-mysql bitnami/mysql
```

一行指令，StatefulSet、Service、PVC、Secret 全部自動建好。不需要你手寫六個 YAML 再一個一個 apply。

**2. 參數化**

同一個 Chart，不同環境只換 values.yaml：

- dev：`replicas: 1`，硬碟 5Gi
- prod：`replicas: 3`，硬碟 50Gi

不需要維護三套 YAML，只需要三個 values 檔。

**3. 版本管理**

```bash
helm history my-mysql    # 看歷史版本
helm rollback my-mysql 1 # 整個 Release 回滾到 REVISION 1
```

比 `kubectl rollout undo` 更完整：回滾的不只是 Deployment，是這個 Release 所有相關資源（包含 ConfigMap、Service 等）。

📄 6-17 第 6 張

**基本指令流程（概念預覽）**

這節先看流程，6-18 實作時每一步會詳細說明：

```bash
# 加入倉庫
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 搜尋
helm search repo mysql

# 安裝
helm install my-mysql bitnami/mysql

# 查看
helm list

# 刪除
helm uninstall my-mysql
```

---

### ② 所有指令＋講解

本節以概念為主，指令集中於 6-18。

---

### ③ 題目

1. Helm 的 Chart 和 Release 有什麼差異？用一句話解釋。
2. 同一個公司有 dev 和 prod 兩個環境，都要部署 MySQL。用 Helm 怎麼做？需要幾個 Chart？幾個 Release？
3. `helm rollback` 和 `kubectl rollout undo` 最主要的差異是什麼？

---

### ④ 解答

1. Chart 是範本（安裝包），Release 是安裝後的實例。同一個 Chart 可以安裝出多個 Release，就像同一個 .deb 安裝包可以在多台機器上安裝。

2. 一個 Chart（`bitnami/mysql`），兩個 Release（例如 `dev-mysql` 和 `prod-mysql`），各用不同的 values.yaml 控制副本數和硬碟大小。不需要兩套 YAML，只需要兩個 values 檔案。

3. `kubectl rollout undo` 只回滾 Deployment 的 Pod template（映像版本和環境變數）；`helm rollback` 回滾整個 Release，包含這次安裝涉及的所有 K8s 資源（Deployment、ConfigMap、Service、Secret 等），範圍更完整。

---

## 6-18 Helm 實作（~12 min）

### ① 課程內容

📄 6-18 第 1 張

**實作流程**

1. 安裝 Helm 工具
2. 加入 Bitnami 倉庫
3. 一鍵安裝 MySQL
4. 做 upgrade + rollback
5. 安裝 Redis（展示 Helm 不只能裝 MySQL）
6. 自訂 values.yaml
7. 清理

---

### ② 所有指令＋講解

📄 6-18 第 2 張

---

**Step 1：安裝 Helm**

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

- 官方安裝腳本，會自動偵測你的 OS 和 CPU 架構，下載對應版本
- 執行後 `helm` 指令就可以用了

確認安裝成功：

```bash
helm version
```

預期輸出：
```
version.BuildInfo{Version:"v3.17.0", GitCommit:"...", GitTreeState:"clean", GoVersion:"go1.23.4"}
```

欄位說明：
- `Version`：Helm 版本號，確認是 v3.x（v2 已停止維護）

---

📄 6-18 第 3 張

**Step 2：加入 Bitnami 倉庫**

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

- `helm repo add`：把一個 Chart 倉庫加入本地設定
- `bitnami`：倉庫的本地別名，之後用 `bitnami/mysql` 就是指這個倉庫裡的 mysql Chart
- `https://charts.bitnami.com/bitnami`：Bitnami 是目前最大的公開 Chart 倉庫，MySQL、Redis、PostgreSQL、RabbitMQ 等常見服務都有

預期輸出：
```
"bitnami" has been added to your repositories
```

```bash
helm repo update
```

- 更新本地的 Chart 索引，就像 `apt update`
- 每次搜尋或安裝前建議先 update，確保看到最新版本

預期輸出：
```
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "bitnami" chart repository
Update Complete. ⎈Happy Helming!⎈
```

```bash
helm search repo mysql
```

- `helm search repo`：在已加入的倉庫裡搜尋關鍵字
- 搜尋名稱包含 `mysql` 的所有 Chart

預期輸出：
```
NAME                  CHART VERSION   APP VERSION   DESCRIPTION
bitnami/mysql         11.1.19         8.0.36        MySQL is a fast, reliable, scalable...
bitnami/phpmyadmin    17.0.5          5.2.1         phpMyAdmin is a tool to manage MySQL...
```

欄位說明：
- `NAME`：`倉庫別名/Chart名稱`
- `CHART VERSION`：Chart 本身的版本（YAML 範本版本）
- `APP VERSION`：Chart 裡包裝的軟體版本（例如 MySQL 8.0.36）
- `DESCRIPTION`：Chart 說明

---

📄 6-18 第 4 張

**Step 3：一鍵安裝 MySQL**

```bash
helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret
```

- `helm install`：安裝一個 Chart，建立一個新的 Release
- `my-mysql`：這個 Release 的名稱（自訂，後續 upgrade/uninstall 用這個名字操作）
- `bitnami/mysql`：Chart 名稱（倉庫別名/Chart名）
- `--set auth.rootPassword=my-secret`：覆蓋 values.yaml 裡的參數，直接在指令列設定 MySQL root 密碼

預期輸出（節錄）：
```
NAME: my-mysql
LAST DEPLOYED: Sat Apr 12 10:00:00 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
...
```

等 Pod 跑起來後，確認狀態：

```bash
kubectl get all -l app.kubernetes.io/instance=my-mysql
```

- `-l app.kubernetes.io/instance=my-mysql`：用 label selector 篩出這個 Release 建立的所有資源
- Helm 安裝的資源都會帶 `app.kubernetes.io/instance=<Release名稱>` 這個 label

預期輸出：
```
NAME                READY   STATUS    RESTARTS   AGE
pod/my-mysql-0      1/1     Running   0          2m

NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/my-mysql             ClusterIP   10.96.140.200   <none>        3306/TCP   2m
service/my-mysql-headless    ClusterIP   None            <none>        3306/TCP   2m

NAME                        READY   AGE
statefulset.apps/my-mysql   1/1     2m
```

```bash
kubectl get pvc
```

預期輸出：
```
NAME                STATUS   VOLUME                                     CAPACITY   ACCESS MODES   AGE
data-my-mysql-0     Bound    pvc-a1b2c3d4-...                           8Gi        RWO            2m
```

StatefulSet、Pod、Service、PVC 一次全部到位，你一行 YAML 都沒寫。

```bash
helm list
```

- `helm list`：列出目前 namespace 所有 Release

預期輸出：
```
NAME        NAMESPACE   REVISION   UPDATED                   STATUS     CHART          APP VERSION
my-mysql    default     1          2026-04-12 10:00:00 UTC   deployed   mysql-11.1.19  8.0.36
```

欄位說明：
- `NAME`：Release 名稱
- `REVISION`：這個 Release 的版本號，每次 install/upgrade/rollback 都會 +1
- `STATUS`：`deployed` 表示正常；`failed` 表示安裝失敗
- `CHART`：使用的 Chart 和版本
- `APP VERSION`：軟體版本

---

📄 6-18 第 5 張

**Step 4：upgrade + rollback**

```bash
helm upgrade my-mysql bitnami/mysql \
  --set auth.rootPassword=my-secret \
  --set secondary.replicaCount=1
```

- `helm upgrade`：升級已存在的 Release（更新設定或版本）
- `my-mysql`：要升級的 Release 名稱
- `--set auth.rootPassword=my-secret`：**重要：upgrade 要重複帶 rootPassword**，不然密碼會被清掉（Helm upgrade 預設以新設定完全覆蓋，不保留舊設定）
- `--set secondary.replicaCount=1`：新增一個 secondary（replica）節點

預期輸出：
```
Release "my-mysql" has been upgraded. Happy Helming!
NAME: my-mysql
LAST DEPLOYED: Sat Apr 12 10:05:00 2026
STATUS: deployed
REVISION: 2
```

異常狀況：如果 upgrade 沒帶 `--set auth.rootPassword`，密碼會被設成 Helm 自動產生的 random 值，導致原本連線的應用程式全部斷線。解法：用 `--reuse-values` 沿用上次的所有參數值（見 6-19 坑）。

```bash
helm history my-mysql
```

- `helm history`：顯示這個 Release 的所有歷史版本

預期輸出：
```
REVISION   UPDATED                   STATUS      CHART          APP VERSION   DESCRIPTION
1          2026-04-12 10:00:00 UTC   superseded  mysql-11.1.19  8.0.36        Install complete
2          2026-04-12 10:05:00 UTC   deployed    mysql-11.1.19  8.0.36        Upgrade complete
```

欄位說明：
- `REVISION`：版本號
- `STATUS`：`superseded` 表示已被取代（舊版本），`deployed` 表示目前運行中
- `DESCRIPTION`：這次變更的說明

```bash
helm rollback my-mysql 1
```

- `helm rollback`：把 Release 回滾到指定 REVISION
- `my-mysql`：Release 名稱
- `1`：要回滾到的 REVISION 號碼

預期輸出：
```
Rollback was a success! Happy Helming!
```

```bash
helm history my-mysql
```

預期輸出：
```
REVISION   UPDATED                   STATUS      CHART          APP VERSION   DESCRIPTION
1          2026-04-12 10:00:00 UTC   superseded  mysql-11.1.19  8.0.36        Install complete
2          2026-04-12 10:05:00 UTC   superseded  mysql-11.1.19  8.0.36        Upgrade complete
3          2026-04-12 10:10:00 UTC   deployed    mysql-11.1.19  8.0.36        Rollback to 1
```

注意：rollback 會建立新的 REVISION（REVISION 3），不是覆蓋舊的。DESCRIPTION 裡清楚記錄「Rollback to 1」。

---

📄 6-18 第 6 張

**Step 5：安裝 Redis（展示 Helm 不只能裝 MySQL）**

```bash
helm install my-redis bitnami/redis --set auth.password=myredis123
```

- 和安裝 MySQL 一樣的邏輯，換一個 Chart 名稱就好
- `--set auth.password=myredis123`：設定 Redis 密碼

預期輸出：
```
NAME: my-redis
STATUS: deployed
REVISION: 1
```

```bash
kubectl get pods
```

預期輸出：
```
NAME                            READY   STATUS    RESTARTS   AGE
my-mysql-0                      1/1     Running   0          10m
my-redis-master-0               1/1     Running   0          30s
my-redis-replicas-0             1/1     Running   0          30s
my-redis-replicas-1             1/1     Running   0          20s
```

Redis master 和 replica 都自動建好了。你沒寫任何 YAML。

---

📄 6-18 第 7 張

**Step 6：自訂 values.yaml**

先看 Chart 有哪些可以設定的參數：

```bash
helm show values bitnami/redis | head -50
```

- `helm show values`：顯示 Chart 的預設 values.yaml
- `| head -50`：只看前 50 行（完整的很長）

預期輸出（節錄）：
```yaml
## @section Global parameters
global:
  imageRegistry: ""
  storageClass: ""

## @section Redis parameters
auth:
  enabled: true
  password: ""
...
master:
  persistence:
    size: 8Gi
replica:
  replicaCount: 3
  persistence:
    size: 8Gi
```

現在把想要的設定寫到自己的 values 檔：

```yaml
# my-redis-values.yaml
auth:
  password: myredis123
master:
  persistence:
    size: 2Gi
replica:
  replicaCount: 2
  persistence:
    size: 1Gi
```

- `auth.password`：設定密碼
- `master.persistence.size`：master 節點的 PVC 大小改為 2Gi（預設 8Gi）
- `replica.replicaCount`：副本數改為 2
- `replica.persistence.size`：replica 節點的 PVC 大小改為 1Gi

用 `-f` 帶入 values 檔安裝：

```bash
helm install my-redis2 bitnami/redis -f my-redis-values.yaml
```

- `-f my-redis-values.yaml`：用指定的 values 檔覆蓋 Chart 的預設值
- `-f` 和 `--set` 可以混用，`--set` 的優先級高於 `-f`

預期輸出：
```
NAME: my-redis2
STATUS: deployed
REVISION: 1
```

---

📄 6-18 第 8 張

**Step 7：清理**

```bash
helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2
```

- `helm uninstall`：刪除指定 Release，同時刪除這個 Release 建立的所有 K8s 資源
- 一行指令，StatefulSet、Service、PVC 全部清乾淨（注意：部分 Chart 預設**不刪 PVC**，避免誤刪資料，需確認 Chart 文件）

預期輸出（每條）：
```
release "my-mysql" uninstalled
```

確認全部清乾淨：

```bash
helm list
kubectl get pods
kubectl get pvc
```

預期輸出：
```
# helm list
NAME    NAMESPACE   REVISION   UPDATED   STATUS   CHART   APP VERSION
（空）

# kubectl get pods
No resources found in default namespace.
```

比起 `kubectl delete -f` 一個一個刪，`helm uninstall` 一行清掉整包，乾淨很多。

---

**學員實作（帶做）**

帶做（老師示範，學員跟著打）：
1. `helm install my-mysql bitnami/mysql --set auth.rootPassword=pass123`
2. `kubectl get all -l app.kubernetes.io/instance=my-mysql` 確認資源建好了
3. `helm list` 確認 Release STATUS=deployed
4. `helm uninstall my-mysql` 清掉

---

### ③ 題目

**必做（1-2 題）**

1. 驗證理解題：執行 `helm install my-mysql bitnami/mysql --set auth.rootPassword=pass123`，然後執行 `helm upgrade my-mysql bitnami/mysql --set secondary.replicaCount=1`（**不帶** rootPassword）。預測會發生什麼事？該怎麼避免？先說出答案，再實際跑看看驗證。

2. 概念辨析題：`helm list` 和 `kubectl get pods` 都能看到服務狀態，各自看到什麼不同的資訊？分別適合在什麼情況下用？

**挑戰題**

3. 場景任務題：你的團隊要在同一個叢集用 Helm 跑兩套 Redis：dev 環境（1 個副本、不需密碼）、prod 環境（3 個副本、需要密碼）。寫出兩個 values.yaml 和對應的安裝指令，確認兩個 Release 互不干擾（用不同的 Release 名稱）。

---

### ④ 解答

1. 不帶 `--set auth.rootPassword` 的 upgrade 會讓密碼被設成 Helm 自動產生的 random 值（或清空），原有連線的 app 全部斷線。避免方法：
   - 方法一（推薦）：加上 `--reuse-values`，沿用上次 install/upgrade 的所有 values：
     ```bash
     helm upgrade my-mysql bitnami/mysql --reuse-values --set secondary.replicaCount=1
     ```
   - 方法二：每次 upgrade 都明確帶 `--set auth.rootPassword=pass123`

2. `helm list` 看的是 Release 層級：Release 名稱、版本號（REVISION）、整體 STATUS（deployed/failed）、使用的 Chart 版本。適合確認「這個應用程式的整體部署狀態」。`kubectl get pods` 看的是 Pod 層級：個別 Pod 的 STATUS（Running/Pending/CrashLoopBackOff）、重啟次數。適合排查「某個 Pod 跑不起來」。兩個搭配用。

3. 建兩個 values 檔：
   ```yaml
   # dev-redis-values.yaml
   auth:
     password: dev-redis-pass
   replica:
     replicaCount: 1
   ```
   ```yaml
   # prod-redis-values.yaml
   auth:
     password: prod-redis-pass
   replica:
     replicaCount: 3
   ```
   安裝：
   ```bash
   helm install dev-redis bitnami/redis -f dev-redis-values.yaml
   helm install prod-redis bitnami/redis -f prod-redis-values.yaml
   ```
   同一個 Chart，兩個不同 Release，各自獨立。

---

## 6-19 回頭操作 Loop 6（~5 min）

### ① 課程內容

📄 6-19 第 1 張

**確認實作完成**

帶大家用一個指令確認 Helm 的安裝狀態都正常：

```bash
helm list
```

所有 Release 的 STATUS 欄位應該都是 `deployed`。如果有 `failed`，用 `helm history <release名稱>` 看哪個 REVISION 失敗、失敗原因。

📄 6-19 第 2 張

**三個常見坑**

**坑 1：repo 沒 add 就 search，什麼都找不到**

```bash
helm search repo mysql
# 結果：（空）
```

原因：你還沒把 Bitnami 倉庫加入本地設定，Helm 不知道要去哪裡找 Chart。

修法：先 add 再 update：
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

**坑 2：install 忘記設密碼，密碼是 random 的**

```bash
helm install my-mysql bitnami/mysql
# 沒有帶 --set auth.rootPassword
```

Helm 會自動產生一個 random 密碼，存在 Secret 裡。你不知道密碼是什麼，要去查 Secret：
```bash
kubectl get secret my-mysql -o jsonpath='{.data.mysql-root-password}' | base64 --decode
```

預防方式：install 時永遠帶 `--set auth.rootPassword=<你設定的密碼>`。

**坑 3：upgrade 沒帶密碼，密碼被清掉**

這是 Helm 最常踩的坑，前面實作有特別說明。

解法：upgrade 時加上 `--reuse-values`：
```bash
helm upgrade my-mysql bitnami/mysql --reuse-values --set secondary.replicaCount=1
```

`--reuse-values` 的意思：沿用這個 Release 上一次的所有 values，只覆蓋你明確用 `--set` 指定的那幾個。

📄 6-19 第 3 張

**銜接下一個 Loop**

現在叢集裡資源越來越多：Deployment、StatefulSet、Service、PVC 散落各處。

全用 kubectl 管，每次都要打指令查，沒有畫面不直觀。

下一個 Loop 我們裝 Rancher，透過 GUI 介面來管理整個叢集。K8s 物件的狀態、log、事件，用滑鼠點就能看到，不用每次敲指令。

---

### ② 所有指令＋講解

**確認 Release 狀態**

```bash
helm list
```

預期輸出（所有 Release 都正常的情況）：
```
NAME        NAMESPACE   REVISION   UPDATED                   STATUS     CHART          APP VERSION
my-mysql    default     3          2026-04-12 10:10:00 UTC   deployed   mysql-11.1.19  8.0.36
```

異常狀況：STATUS 顯示 `failed`，代表安裝或升級過程有錯誤。排查步驟：

```bash
helm history my-mysql
# 找到 REVISION 和 STATUS=failed 的那一列
# DESCRIPTION 欄會有簡短錯誤說明

kubectl describe pod <pod名稱>
# 看 Events 欄位的詳細錯誤
```

---

### ③ 題目

本節無新題目。

---

### ④ 解答

本節無新解答。
