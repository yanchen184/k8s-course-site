# Day 6 Loop 5 — Helm 套件管理

---

## 6-17 Helm 概念（~20 min）

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

Helm 讓你用一行指令在 K8s 上安裝一整套 MySQL。Bitnami 是目前最大的公開 Chart 倉庫，待會我們會用 `helm repo add` 把它加進來：

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

## 6-18 Helm 實作（~60 min）

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

**Step 7：一行裝完整監控 stack — Prometheus + Grafana**

剛才裝 MySQL 和 Redis，是應用服務。現在裝一個更有感的——監控系統。

正常手動搭 Prometheus + Grafana 需要：Prometheus Deployment、Grafana Deployment、AlertManager、各種 ConfigMap、ServiceAccount、RBAC 規則⋯⋯加起來幾十個資源、上百行 YAML。

用 Helm，一行：

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \
  --set grafana.adminPassword=admin123
```

等 Pod 跑起來（約 2-3 分鐘）：

```bash
kubectl get pods | grep monitoring
```

預期看到：
```
monitoring-grafana-xxx                    3/3   Running   2m
monitoring-kube-prometheus-prometheus-0   2/2   Running   2m
monitoring-kube-state-metrics-xxx         1/1   Running   2m
```

打開 Grafana Dashboard：

```bash
kubectl port-forward svc/monitoring-grafana 3000:80
```

瀏覽器開 `http://localhost:3000`，帳號 `admin`，密碼 `admin123`。

點進去 **Dashboards → Kubernetes / Compute Resources / Pod**，你可以看到每個 Pod 的 CPU、Memory 使用率即時圖表。

這套監控系統你沒寫一行 YAML，Helm 幫你裝好了所有東西。

---

📄 6-18 第 9 張

**Step 8：自己寫 Chart — 理解模板原理**

剛才都是用別人的 Chart。現在來自己寫一個，理解 Helm 的模板機制。

```bash
helm create my-app
```

這個指令會產生一個 Chart 的骨架：

```
my-app/
├── Chart.yaml          # Chart 的說明書（名稱、版本）
├── values.yaml         # 預設參數值
└── templates/          # YAML 範本，用 {{ .Values.xxx }} 注入參數
    ├── deployment.yaml
    ├── service.yaml
    └── ingress.yaml
```

打開 `values.yaml`，找到 image 的部分：

```yaml
image:
  repository: nginx
  tag: "latest"
  pullPolicy: IfNotPresent
```

打開 `templates/deployment.yaml`，看到：

```yaml
image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

這就是模板語法。`{{ .Values.xxx }}` 會被 values.yaml 裡的值替換掉。

安裝這個 Chart：

```bash
helm install my-app ./my-app
kubectl get pods   # 看到 my-app-xxx 跑起來
```

升級，換一個 image tag：

```bash
helm upgrade my-app ./my-app --set image.tag=1.25
kubectl describe pod -l app.kubernetes.io/name=my-app | grep Image
# → Image: nginx:1.25
```

這就是為什麼 Helm 可以一份 Chart 部署 dev、staging、prod——三個環境只需要三個不同的 values.yaml，Chart 本身不用動：

```bash
helm install my-app-dev  ./my-app -f values-dev.yaml
helm install my-app-prod ./my-app -f values-prod.yaml
```

---

📄 6-18 第 10 張

**Step 9：清理**

```bash
helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2
helm uninstall monitoring
helm uninstall my-app
```

確認全部清乾淨：

```bash
helm list
kubectl get pods
kubectl get pvc
```

`helm list` 應該是空的，`kubectl get pods` 應該是 `No resources found`。

PVC 要特別確認——`helm uninstall` 預設不會刪 PVC（避免誤刪資料），要手動清：

```bash
kubectl delete pvc --all
```

---

### ③ QA

**Q：`helm list` 和 `kubectl get pods` 都能看到服務狀態，各自看到什麼不同的資訊？分別適合在什麼情況下用？**

A：`helm list` 看的是 Release 層級：整體 STATUS（deployed/failed）、版本號（REVISION）、Chart 版本。適合確認「整個應用程式的部署狀態」。`kubectl get pods` 看的是 Pod 層級：個別 Pod 的 STATUS、重啟次數。適合排查「某個 Pod 跑不起來」。兩個搭配用。

**Q：`helm uninstall` 為什麼不刪 PVC？**

A：Helm 設計上保守處理有狀態資源。PVC 裡可能有資料，uninstall 如果自動刪，一個手殘就資料全沒了。所以 Helm 預設保留 PVC，讓你手動確認後再刪。如果你確定要連 PVC 一起刪，可以加 `--cascade=foreground` 或直接 `kubectl delete pvc`。

**Q：`helm create` 產生的 Chart 可以直接用在生產環境嗎？**

A：可以用，但要調整。預設 Chart 沒有設 resource requests/limits、沒有 Probe、沒有 NetworkPolicy。這些生產必要的設定要自己加進 templates/ 或 values.yaml 裡。`helm create` 是骨架，不是成品。

---

## 6-19 回頭操作 Loop 5（~30 min）

### ④ 學員實作

**必做 1：upgrade 陷阱**

執行：
```bash
helm install my-mysql bitnami/mysql --set auth.rootPassword=pass123
```
然後執行：
```bash
helm upgrade my-mysql bitnami/mysql --set secondary.replicaCount=1
```
（**不帶** rootPassword）

預測會發生什麼事？用 `helm history my-mysql` 確認，再說明該怎麼避免。

---

**必做 2：dev / prod 兩套 Redis**

你的團隊要在同一個叢集跑兩套 Redis：
- dev：1 個副本，密碼 `dev-pass`
- prod：3 個副本，密碼 `prod-pass`

寫出兩個 values.yaml，用 `helm install` 各自裝起來，確認兩個 Release 互不干擾（`helm list` 看到兩個）。

---

**必做 3：自己的 Chart**

用 `helm create my-service` 建一個 Chart，修改 `values.yaml` 把 image 改成 `httpd`，安裝起來，確認 Pod 跑的是 httpd 而不是預設的 nginx：

```bash
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
```

然後用 `helm upgrade` 把 image tag 換成 `httpd:2.4`。

---

**挑戰：Grafana 看到自己的 Pod**

確認 `monitoring` 這個 Prometheus+Grafana Release 還在跑：
```bash
helm list
kubectl port-forward svc/monitoring-grafana 3000:80
```

打開 `http://localhost:3000`，在 Dashboards 找到 **Kubernetes / Compute Resources / Pod**，找到你剛才跑的 `my-service` Pod 的 CPU 和 Memory 圖表。

---

### ⑤ 學員實作解答

**必做 1**

不帶 `--set auth.rootPassword` 的 upgrade 會讓密碼被重設成 Helm 隨機產生的值，原有連線全部斷線。`helm history` 看到 REVISION 2。

避免方法：加 `--reuse-values`，沿用上次所有 values：
```bash
helm upgrade my-mysql bitnami/mysql --reuse-values --set secondary.replicaCount=1
```

**必做 2**

```yaml
# dev-redis-values.yaml
auth:
  password: dev-pass
replica:
  replicaCount: 1
```
```yaml
# prod-redis-values.yaml
auth:
  password: prod-pass
replica:
  replicaCount: 3
```
```bash
helm install dev-redis bitnami/redis -f dev-redis-values.yaml
helm install prod-redis bitnami/redis -f prod-redis-values.yaml
helm list   # 確認兩個 Release 都是 deployed
```

**必做 3**

修改 `my-service/values.yaml`：
```yaml
image:
  repository: httpd
  tag: "latest"
  pullPolicy: IfNotPresent
```
```bash
helm install my-service ./my-service
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# → Image: httpd:latest

helm upgrade my-service ./my-service --set image.tag=2.4
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# → Image: httpd:2.4
```

**清理**
```bash
helm uninstall my-mysql my-redis my-redis2 dev-redis prod-redis my-service monitoring
kubectl delete pvc --all
```
