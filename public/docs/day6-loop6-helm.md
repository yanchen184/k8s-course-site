# Day 6 Loop 6 — Helm 套件管理

---

## 6-17 Helm 概念（~15 min）

### ① 課程內容

一個 MySQL 部署就需要 5-6 個 YAML 檔，三個環境就是三套，數量很快爆炸。Helm 是 Kubernetes 的套件管理器，讓你一行指令裝好整個服務，不用自己寫 YAML。

---

### ② 所有指令＋講解

📄 6-17 第 1 張

**問題：YAML 太多太散**

一個 MySQL 部署，光 YAML 就需要：
- Secret（存密碼）
- ConfigMap（存設定）
- StatefulSet（主要服務）
- Headless Service（內部連線用）
- PVC（儲存空間）

加起來 5-6 個檔案，這還只是 MySQL 一個服務。再加上 Redis、RabbitMQ、Elasticsearch，YAML 數量很快就幾十個。三個環境（dev/staging/prod）代表三套 YAML。全世界幾百萬人都在寫一模一樣的 MySQL YAML。有沒有現成的？

📄 6-17 第 2 張

**套件管理器類比**

| 平台 | 指令 |
|:---|:---|
| Ubuntu | `apt install mysql-server` |
| macOS | `brew install mysql` |
| Node.js | `npm install express` |
| Python | `pip install flask` |
| Kubernetes | **Helm** |

📄 6-17 第 3 張

**Helm 核心概念**

| 概念 | 說明 | 對照 |
|:---|:---|:---|
| Helm | 套件管理工具本身 | apt / yum / brew |
| Chart | 一包 YAML 範本 | .deb / .rpm 安裝包 |
| Release | Chart 安裝到叢集後的實例 | 已安裝好的軟體 |
| Repository | Chart 的倉庫 | apt source list |
| values.yaml | 客製化參數 | 軟體的設定檔 |

重點三個：
- **Chart**：別人已經寫好的 YAML 集合
- **Release**：把 Chart 安裝到叢集後的安裝實例，同一個 Chart 可以裝多個 Release
- **values.yaml**：客製化的地方，密碼、副本數、硬碟大小

📄 6-17 第 4 張

**Docker Compose 對照**

| Docker Compose | Helm |
|:---|:---|
| docker-compose.yml | Chart（一包 YAML 範本）|
| `docker compose up` | `helm install` |
| `docker compose down` | `helm uninstall` |
| `.env` 檔案 | values.yaml |

差異在於：Docker Compose 的設定是你自己寫的；Helm 的 Chart 是別人（社群）已經寫好的，你拿來用，只改你需要改的參數。

📄 6-17 第 5 張

**Helm 三個核心功能**

1. 一鍵安裝：`helm install my-mysql bitnami/mysql` → StatefulSet、Service、PVC、Secret 全部自動建好
2. 參數化：同一個 Chart，不同環境只換 values.yaml，不需要維護三套 YAML
3. 版本管理：`helm rollback my-mysql 1` 整個 Release 回滾（比 `kubectl rollout undo` 更完整）

📄 6-17 第 6 張

**基本指令流程（概念預覽）**

確認環境（安裝 Helm 後可執行）：

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo mysql
helm install my-mysql bitnami/mysql
helm list
helm uninstall my-mysql
```

---

### ③ QA

**Q1：Helm 的 Chart 和 Release 有什麼差異？用一句話解釋。**

A：Chart 是範本（安裝包），Release 是安裝後的實例。同一個 Chart 可以安裝出多個 Release。

**Q2：同一個公司有 dev 和 prod 兩個環境，都要部署 MySQL。用 Helm 怎麼做？需要幾個 Chart？幾個 Release？**

A：一個 Chart（`bitnami/mysql`），兩個 Release（`dev-mysql` 和 `prod-mysql`），各用不同的 values.yaml 控制副本數和硬碟大小。

**Q3：`helm rollback` 和 `kubectl rollout undo` 最主要的差異是什麼？**

A：`kubectl rollout undo` 只回滾 Deployment 的 Pod template；`helm rollback` 回滾整個 Release，包含所有 K8s 資源（Deployment、ConfigMap、Service、Secret 等）。

---

### ④ 學員實作

（本節為概念引入，無操作實作，實作請見 6-18）

---

### ⑤ 學員實作解答

（本節無實作）

---

## 6-18 Helm 實作（~12 min）

### ① 課程內容

安裝 Helm、加 Bitnami 倉庫、一鍵安裝 MySQL，接著練習 upgrade + rollback，再安裝 Redis，最後用自訂 values.yaml 控制參數，並清理所有資源。

---

### ② 所有指令＋講解

📄 6-18 第 2 張

**Step 1：安裝 Helm**

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

確認安裝成功：

```bash
helm version
```

預期輸出：
```
version.BuildInfo{Version:"v3.17.0", ...}
```

確認是 v3.x（v2 已停止維護）。

📄 6-18 第 3 張

**Step 2：加入 Bitnami 倉庫**

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

- `bitnami`：倉庫的本地別名，之後用 `bitnami/mysql` 就是指這個倉庫裡的 mysql Chart
- Bitnami 是目前最大的公開 Chart 倉庫，MySQL、Redis、PostgreSQL、RabbitMQ 等常見服務都有

預期輸出：
```
"bitnami" has been added to your repositories
```

```bash
helm repo update
```

- 更新本地的 Chart 索引，就像 `apt update`，每次安裝前建議先 update

預期輸出：
```
...Successfully got an update from the "bitnami" chart repository
```

```bash
helm search repo mysql
```

預期輸出：
```
NAME                  CHART VERSION   APP VERSION   DESCRIPTION
bitnami/mysql         11.1.19         8.0.36        MySQL is a fast, reliable...
```

欄位說明：
- `CHART VERSION`：Chart 本身的版本（YAML 範本版本）
- `APP VERSION`：Chart 裡包裝的軟體版本（MySQL 8.0.36）

📄 6-18 第 4 張

**Step 3：一鍵安裝 MySQL**

```bash
helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret
```

- `my-mysql`：Release 名稱（自訂，後續 upgrade/uninstall 用這個名字操作）
- `bitnami/mysql`：Chart 名稱
- `--set auth.rootPassword=my-secret`：覆蓋 values.yaml 裡的密碼設定

預期輸出（節錄）：
```
NAME: my-mysql
STATUS: deployed
REVISION: 1
```

等 Pod 跑起來後確認：

```bash
kubectl get all -l app.kubernetes.io/instance=my-mysql
```

- 用 label selector 篩出這個 Release 建立的所有資源
- Helm 安裝的資源都帶 `app.kubernetes.io/instance=<Release名稱>` 這個 label

預期輸出：
```
pod/my-mysql-0   1/1   Running   2m
service/my-mysql             ClusterIP   ...
service/my-mysql-headless    ClusterIP   None
statefulset.apps/my-mysql    1/1
```

```bash
kubectl get pvc
```

預期輸出：
```
NAME             STATUS   VOLUME    CAPACITY   ACCESS MODES   AGE
data-my-mysql-0  Bound    ...       8Gi        RWO            2m
```

StatefulSet、Pod、Service、PVC 一次全部到位，你一行 YAML 都沒寫。

```bash
helm list
```

預期輸出：
```
NAME        NAMESPACE   REVISION   STATUS     CHART          APP VERSION
my-mysql    default     1          deployed   mysql-11.1.19  8.0.36
```

欄位說明：
- `REVISION`：每次 install/upgrade/rollback 都會 +1
- `STATUS`：`deployed` 正常；`failed` 安裝失敗

📄 6-18 第 5 張

**Step 4：upgrade + rollback**

```bash
helm upgrade my-mysql bitnami/mysql \
  --set auth.rootPassword=my-secret \
  --set secondary.replicaCount=1
```

**重要**：upgrade 要重複帶 `rootPassword`，不然密碼會被清掉（upgrade 預設以新設定完全覆蓋）。

預期輸出：
```
Release "my-mysql" has been upgraded.
REVISION: 2
```

```bash
helm history my-mysql
```

預期輸出：
```
REVISION   STATUS      DESCRIPTION
1          superseded  Install complete
2          deployed    Upgrade complete
```

- `superseded`：已被取代的舊版本
- `deployed`：目前運行中

```bash
helm rollback my-mysql 1
```

預期輸出：
```
Rollback was a success! Happy Helming!
```

```bash
helm history my-mysql
```

預期輸出：
```
REVISION   STATUS      DESCRIPTION
1          superseded  Install complete
2          superseded  Upgrade complete
3          deployed    Rollback to 1
```

注意：rollback 會建立新的 REVISION（REVISION 3），不是覆蓋舊的。

📄 6-18 第 6 張

**Step 5：安裝 Redis**

```bash
helm install my-redis bitnami/redis --set auth.password=myredis123
```

預期輸出：
```
NAME: my-redis
STATUS: deployed
```

```bash
kubectl get pods
```

預期輸出：
```
my-mysql-0             1/1   Running   10m
my-redis-master-0      1/1   Running   30s
my-redis-replicas-0    1/1   Running   30s
my-redis-replicas-1    1/1   Running   20s
```

Redis master 和 replica 都自動建好了，你沒寫任何 YAML。

📄 6-18 第 7 張

**Step 6：自訂 values.yaml**

先看 Chart 有哪些可以設定的參數：

```bash
helm show values bitnami/redis | head -50
```

- `helm show values`：顯示 Chart 的預設 values.yaml
- `| head -50`：只看前 50 行（完整的很長）

建立自訂的 values 檔：

```yaml
# my-redis-values.yaml
auth:
  password: myredis123
master:
  persistence:
    size: 2Gi      # 從預設 8Gi 改小
replica:
  replicaCount: 2
  persistence:
    size: 1Gi
```

用 `-f` 帶入 values 檔安裝：

```bash
helm install my-redis2 bitnami/redis -f my-redis-values.yaml
```

- `-f my-redis-values.yaml`：用指定的 values 檔覆蓋 Chart 的預設值
- `-f` 和 `--set` 可以混用，`--set` 的優先級高於 `-f`

📄 6-18 第 8 張

**Step 7：清理**

```bash
helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2
```

預期輸出：
```
release "my-mysql" uninstalled
release "my-redis" uninstalled
release "my-redis2" uninstalled
```

確認全部清乾淨：

```bash
helm list
kubectl get pods
kubectl get pvc
```

`helm list` 應該是空的，`kubectl get pods` 應該是 `No resources found`。

---

### ③ QA

**Q：`helm list` 和 `kubectl get pods` 都能看到服務狀態，各自看到什麼不同的資訊？分別適合在什麼情況下用？**

A：`helm list` 看的是 Release 層級：整體 STATUS（deployed/failed）、版本號（REVISION）、Chart 版本。適合確認「整個應用程式的部署狀態」。`kubectl get pods` 看的是 Pod 層級：個別 Pod 的 STATUS、重啟次數。適合排查「某個 Pod 跑不起來」。兩個搭配用。

---

### ④ 學員實作

**必做（1-2 題）**

1. 執行 `helm install my-mysql bitnami/mysql --set auth.rootPassword=pass123`，然後執行 `helm upgrade my-mysql bitnami/mysql --set secondary.replicaCount=1`（**不帶** rootPassword）。預測會發生什麼事？該怎麼避免？

2. 你的團隊要在同一個叢集用 Helm 跑兩套 Redis：dev 環境（1 個副本）、prod 環境（3 個副本、需要密碼）。寫出兩個 values.yaml 和對應的安裝指令，確認兩個 Release 互不干擾。

---

### ⑤ 學員實作解答

1. 不帶 `--set auth.rootPassword` 的 upgrade 會讓密碼被設成 Helm 自動產生的 random 值，原有連線的 app 全部斷線。避免方法：加上 `--reuse-values`，沿用上次的所有 values：
   ```bash
   helm upgrade my-mysql bitnami/mysql --reuse-values --set secondary.replicaCount=1
   ```

2. 建兩個 values 檔：
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

---

## 6-19 回頭操作 Loop 6（~5 min）

### ① 課程內容

確認所有 Helm Release 狀態都是 `deployed`，排查三個常見坑（repo 沒 add、install 忘設密碼、upgrade 沒帶密碼），準備銜接 Rancher。

---

### ② 所有指令＋講解

📄 6-19 第 1 張

**確認 Release 狀態**

```bash
helm list
```

預期輸出：
```
NAME        NAMESPACE   REVISION   STATUS     CHART          APP VERSION
my-mysql    default     3          deployed   mysql-11.1.19  8.0.36
```

所有 Release 的 STATUS 應該都是 `deployed`。如果有 `failed`，排查步驟：

```bash
helm history my-mysql          # 找到 STATUS=failed 的 REVISION
kubectl describe pod <pod>     # 看 Events 的詳細錯誤
```

**三個常見坑**

坑 1：repo 沒 add 就 search
```bash
# 修法
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

坑 2：install 忘記設密碼，密碼是 random 的
```bash
# 去 Secret 裡查 random 密碼
kubectl get secret my-mysql -o jsonpath='{.data.mysql-root-password}' | base64 --decode
```

坑 3：upgrade 沒帶密碼，密碼被清掉
```bash
# 修法：加上 --reuse-values
helm upgrade my-mysql bitnami/mysql --reuse-values --set secondary.replicaCount=1
```

---

### ③ QA

**Q：做完這個 Loop，你在叢集裡安裝了哪些 Release？如果要完整清掉，指令是什麼？**

A：安裝了 `my-mysql`、`my-redis`、`my-redis2` 三個 Release。清理指令：
```bash
helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2
```
清完後用 `helm list` 確認是空的，`kubectl get pvc` 確認 PVC 也都刪除。

---

### ④ 學員實作

執行 `helm list`，確認所有 Release 的 STATUS 都是 `deployed`。如果有任何 `failed`，用 `helm history <release>` 找出失敗的 REVISION，再用 `kubectl describe pod` 查看 Events 排查原因。

---

### ⑤ 學員實作解答

確認指令：
```bash
helm list
```

若有 `failed`，排查流程：
```bash
helm history my-mysql
kubectl get pods
kubectl describe pod <pod-name>
```

清理全部 Release：
```bash
helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2
helm list          # 應為空
kubectl get pvc    # 應為空
```
