# Day 6 Loop 5 — Helm 套件管理

---

## 6-17 Helm 概念（~15 min）

### ① 課程內容

📄 6-17 第 1 張

**問題引出：YAML 太多了**

好，上一個 Loop 結束之後我問了大家一個問題：YAML 太多了。我們來算一下。

今天一個 MySQL 服務，你要寫什麼？

- `Secret`：管密碼
- `ConfigMap`：管設定
- `StatefulSet`：跑 MySQL
- `Headless Service`：做 DNS
- `PVC`：要儲存空間

五個 K8s 資源。如果再加上 Ingress 讓外面連進來，六個。

你的系統不只有 MySQL 吧？可能還有 Redis 做快取、RabbitMQ 做訊息佇列、Elasticsearch 做搜尋。每個都要寫一堆 YAML。加起來可能有幾十個檔案、幾千行 YAML。

然後你要部署到 dev、staging、prod 三個環境。三個環境的 YAML 基本上一樣，只是 replicas 不同、Image tag 不同、資料庫連線不同。你是要維護三套 YAML？改了一個東西，三個地方都要改？

還有一個問題。你自己手寫 MySQL 的 StatefulSet、Headless Service、PVC。但全世界有幾百萬人在 K8s 上跑 MySQL，每個人都在寫一樣的東西。有沒有人已經寫好了一份最佳實踐，你直接拿來用就好？

📄 6-17 第 2 張

**套件管理器類比**

用你熟悉的經驗來想。

在 Ubuntu 上要裝 MySQL，你會自己下載原始碼然後編譯嗎？不會，你 `apt install mysql-server`，一行指令搞定。在 Node.js 專案要用 Express，你會自己從零寫 HTTP 框架嗎？不會，你 `npm install express`。在 Python 專案要用 Flask，你 `pip install flask`。

每個技術生態都有套件管理器。Ubuntu 有 apt，macOS 有 brew，Node.js 有 npm，Python 有 pip。

**K8s 的套件管理器叫 Helm。**

Helm 讓你用一行指令在 K8s 上安裝一整套 MySQL：

```bash
helm install my-mysql bitnami/mysql
```

StatefulSet、Headless Service、PVC、Secret、ConfigMap，全部幫你建好。你不用寫任何 YAML。

📄 6-17 第 3 張

**四個核心概念**

| 概念 | 說明 | 對照 |
|:---|:---|:---|
| Helm | K8s 的套件管理工具 | apt / yum / brew / npm |
| Chart | 一包 YAML 範本（安裝包） | .deb / .rpm 安裝包 |
| Release | Chart 安裝後的實例 | 安裝好的軟體 |
| Repository | Chart 的倉庫 | apt source list |
| values.yaml | 客製化參數檔 | 軟體的設定檔 / .env |

**Chart**：就像 Ubuntu 的 .deb 檔案，裡面包了所有需要的 YAML 範本。有人已經把 MySQL 的最佳實踐打包成一個 Chart，你直接拿來裝就好。

**Release**：Chart 安裝後的實例。你可以用同一個 Chart 安裝多個 Release，互不干擾。比如一個 Redis 叫 `my-cache` 給快取用，另一個 Redis 叫 `my-session` 給 Session 用，各自獨立。

**Repository**：Chart 的倉庫，就像 Ubuntu 的 apt source list。最大的公開倉庫是 **Bitnami**，裡面有 MySQL、Redis、PostgreSQL、MongoDB、WordPress、Grafana… 常用軟體幾乎都有。

**values.yaml**：參數檔。一個 Chart 有很多可以調整的參數，比如 replicas 幾個、密碼是什麼、PVC 要多大。你把這些參數寫在 values.yaml 裡，Helm 會把它們套進 YAML 範本裡生成最終的 K8s 資源。

📄 6-17 第 4 張

**三個核心功能**

**功能一：一鍵安裝**

別人已經把最佳實踐寫成 Chart 了，你直接 `helm install` 就好。少說幾百行 YAML，幾分鐘搞定。

**功能二：參數化 → 多環境部署**

同一個 Chart，dev 環境設 `replicas 1`、密碼設 `dev123`，prod 環境設 `replicas 3`、密碼設超強密碼。只要換 values.yaml，不用改 Chart 本身。三個環境不再是三套 YAML，是一個 Chart + 三個 values 檔。

**功能三：版本管理 + Rollback**

Helm 會記錄每次安裝和升級的歷史。升級之後發現有問題？`helm rollback` 一行指令回到上一版。而且不只是回滾單一 Deployment，是整個 Release 的所有資源一起回滾。

📄 6-17 第 5 張

**對照 Docker Compose**

如果你用過 Docker Compose，Helm 的概念幾乎一樣，只是換到 K8s 的世界：

| Docker Compose | Helm |
|:---|:---|
| `docker-compose.yml` | Chart（一包 YAML 範本） |
| `docker compose up` | `helm install` |
| `docker compose down` | `helm uninstall` |
| `.env` 檔案 | `values.yaml` |

概念完全一樣，只是 Helm 在 K8s 的世界裡功能更強大，多了版本管理和 rollback。

📄 6-17 第 6 張

**今天的指令預覽**

今天這個 Loop 要做的事：

- [ ] 安裝 Helm（一行指令）
- [ ] 加入 Bitnami 倉庫（`helm repo add`）
- [ ] 搜尋 Chart（`helm search repo mysql`）
- [ ] 一鍵安裝 MySQL（`helm install my-mysql bitnami/mysql`）
- [ ] 看 K8s 幫你建了什麼（`kubectl get all`、`kubectl get pvc`）
- [ ] 升級 Release（`helm upgrade`）
- [ ] 看版本歷史（`helm history`）
- [ ] Rollback（`helm rollback`）
- [ ] 安裝 Redis（`helm install my-redis bitnami/redis`）
- [ ] 用 values.yaml 客製化部署
- [ ] 清理（`helm uninstall`）

基本流程就是：`helm repo add` → `helm search` → `helm install` → `helm list` → `helm uninstall`。

概念講完了，下一支影片我們來實際裝一個試試看。

---

## 6-18 Helm 實作（~12 min）

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

## 6-19 回頭操作 Loop 6（~5 min）

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
