# Day 6 Loop 5 — Helm 套件管理

---

## 6-17 Helm 概念（~20 min）

### ① 課程內容

📄 6-17 第 1 張

**問題引出：YAML 太多了**

上一個 Loop，你花了 15 分鐘，手寫了 Secret、Headless Service、StatefulSet，還要處理 volumeClaimTemplates、有序啟動、Pod 重建後 PVC 還掛在同一個 Pod 上——這些東西你剛才一行一行打出來了。

現在問你一個問題：這是你第一次搞 MySQL，你是從頭想出這個架構的嗎？還是你去查文件、抄範例、反覆 debug 才弄好的？

全世界有幾百萬人在 K8s 上跑 MySQL，每個人都在踩一樣的坑、寫一樣的 YAML。有沒有人把這個最佳實踐打包好，讓你直接一行安裝？

有。

你剛才就是幹了這些事：

- `Secret`：管密碼
- `ConfigMap`：管設定
- `StatefulSet`：跑 MySQL
- `Headless Service`：做 DNS
- `PVC`：要儲存空間

五個 K8s 資源。如果再加上 Ingress 讓外面連進來，六個。

你的系統不只有 MySQL 吧？可能還有 Redis 做快取、RabbitMQ 做訊息佇列、Elasticsearch 做搜尋。每個都要寫一堆 YAML。加起來可能有幾十個檔案、幾千行 YAML。

然後你要部署到 dev、staging、prod 三個環境。三個環境的 YAML 基本上一樣，只是 replicas 不同、Image tag 不同、資料庫連線不同。你是要維護三套 YAML？改了一個東西，三個地方都要改？

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
- [ ] 加入倉庫（ingress-nginx、prometheus-community）
- [ ] 搜尋 Chart（`helm search repo ingress-nginx`）
- [ ] 一鍵安裝 Nginx Ingress Controller（`helm install my-ingress ingress-nginx/ingress-nginx`）
- [ ] 看 K8s 幫你建了什麼（`kubectl get all`）
- [ ] 升級 Release（`helm upgrade`）
- [ ] 看版本歷史（`helm history`）
- [ ] Rollback（`helm rollback`）
- [ ] 用 values.yaml 多環境部署
- [ ] 一鍵裝 Prometheus+Grafana（`helm install monitoring prometheus-community/kube-prometheus-stack`）
- [ ] 自己寫 Chart（`helm create`）
- [ ] 清理（`helm uninstall`）

基本流程就是：`helm repo add` → `helm search` → `helm install` → `helm list` → `helm uninstall`。

概念講完了，下一支影片我們來實際裝一個試試看。

---

## 6-18A Helm 實作 Part 1 — 安裝、倉庫、install、upgrade/rollback（~25 min）

### ② 所有指令＋講解

📄 6-18 第 2 張

**Step 1：安裝 Helm**

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

預期輸出：
```
Downloading https://get.helm.sh/helm-v3.20.2-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
helm installed into /usr/local/bin/helm
```

確認安裝成功：

```bash
helm version
```

預期輸出：
```
version.BuildInfo{Version:"v3.20.2", ...}
```

確認是 v3.x（v2 已停止維護）。

📄 6-18 第 3 張

**Step 2：加入倉庫**

課程用兩個倉庫示範：

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

預期輸出：
```
"ingress-nginx" has been added to your repositories
"prometheus-community" has been added to your repositories
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "ingress-nginx" chart repository
...Successfully got an update from the "prometheus-community" chart repository
Update Complete. ⎈Happy Helming!⎈
```

> **關於 Bitnami**：Bitnami 是歷史上最大的公開 Chart 倉庫，MySQL、Redis、PostgreSQL 都有。2025/8/28 起，Bitnami 的 image 開始需要付費訂閱才能拉取，`helm install bitnami/mysql` 會出現 `Init:ImagePullBackOff`。本課改用完全免費的 CNCF 官方 Chart 作為示範。

```bash
helm search repo ingress-nginx
```

預期輸出：
```
NAME                            CHART VERSION   APP VERSION   DESCRIPTION
ingress-nginx/ingress-nginx     4.15.1          1.15.1        Ingress controller for Kubernetes using NGINX
```

欄位說明：
- `CHART VERSION`：Chart 本身的版本（YAML 範本版本）
- `APP VERSION`：Chart 裡包裝的軟體版本（Nginx Ingress 1.15.1）

📄 6-18 第 4 張

**Step 3：一鍵安裝 Nginx Ingress Controller**

> **k3s 環境注意**：k3s 內建 Traefik 已經佔住 Node 的 80/443 port（透過 Klipper LB）。如果直接裝 ingress-nginx 預設的 LoadBalancer Service，Klipper 會試著幫它也綁 80/443，但 port 已被佔，導致 EXTERNAL-IP 一直 `<pending>`。
>
> 解法：加 `--set controller.service.type=NodePort`，讓 nginx 用 NodePort 跑，不跟 Traefik 搶 port。示範 install/upgrade/rollback 的流程完全不受影響。

```bash
helm install my-ingress ingress-nginx/ingress-nginx \
  --set controller.replicaCount=1 \
  --set controller.service.type=NodePort
```

- `my-ingress`：Release 名稱（自訂，後續 upgrade/uninstall 用這個名字操作）
- `ingress-nginx/ingress-nginx`：Chart 名稱
- `--set controller.replicaCount=1`：覆蓋 values.yaml 裡的副本數
- `--set controller.service.type=NodePort`：k3s 環境必加，避免跟 Traefik 搶 80/443

預期輸出（節錄）：
```
NAME: my-ingress
STATUS: deployed
REVISION: 1
```

等 Pod 跑起來後確認：

```bash
kubectl get all -l app.kubernetes.io/instance=my-ingress
```

- 用 label selector 篩出這個 Release 建立的所有資源
- Helm 安裝的資源都帶 `app.kubernetes.io/instance=<Release名稱>` 這個 label

預期輸出：
```
pod/my-ingress-ingress-nginx-controller-xxx     1/1   Running   1m
service/my-ingress-ingress-nginx-controller     NodePort   10.43.x.x   <none>   80:3xxxx/TCP
deployment.apps/my-ingress-ingress-nginx-controller   1/1
```

Deployment、Pod、Service 一次全部到位，你一行 YAML 都沒寫。

```bash
helm list
```

預期輸出：
```
NAME        NAMESPACE   REVISION   STATUS     CHART                    APP VERSION
my-ingress  default     1          deployed   ingress-nginx-4.15.1     1.15.1
```

欄位說明：
- `REVISION`：每次 install/upgrade/rollback 都會 +1
- `STATUS`：`deployed` 正常；`failed` 安裝失敗

📄 6-18 第 5 張

**Step 4：upgrade + rollback**

```bash
helm upgrade my-ingress ingress-nginx/ingress-nginx \
  --set controller.replicaCount=2 \
  --set controller.service.type=NodePort
```

預期輸出：
```
Release "my-ingress" has been upgraded. Happy Helming!
REVISION: 2
```

```bash
helm history my-ingress
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
helm rollback my-ingress 1
```

預期輸出：
```
Rollback was a success! Happy Helming!
```

```bash
helm history my-ingress
```

預期輸出：
```
REVISION   STATUS      DESCRIPTION
1          superseded  Install complete
2          superseded  Upgrade complete
3          deployed    Rollback to 1
```

注意：rollback 會建立新的 REVISION（REVISION 3），不是覆蓋舊的。

---

## 6-18B Helm 實作 Part 2 — values、多環境、Prometheus+Grafana、自己的 Chart（~35 min）

### ② 所有指令＋講解（續）

📄 6-18 第 6 張

**Step 5：用 helm show values 看 Chart 的所有參數**

```bash
helm show values ingress-nginx/ingress-nginx | head -50
```

預期輸出（節錄）：
```
## nginx configuration
##

global:
  image:
    registry: registry.k8s.io

controller:
  name: controller
  image:
    image: ingress-nginx/controller
    tag: "v1.15.1"
    pullPolicy: IfNotPresent
  service:
    type: LoadBalancer
    ports:
      http: 80
      https: 443
```

- `helm show values`：顯示 Chart 的預設 values.yaml，所有可以客製化的參數都在這裡
- `| head -50`：只看前 50 行（完整的很長）

這樣你知道有哪些參數可以改，然後在自己的 values 檔裡覆蓋。

📄 6-18 第 7 張

**Step 6：自訂 values.yaml — 多環境部署**

> ⚠ **前置：先 uninstall my-ingress**
> ingress-nginx 的 IngressClass 名稱預設都是 `nginx`，同時間只能有一個 Release 佔用。
> 先清掉 my-ingress，再裝 dev-ingress，否則會報 `IngressClass "nginx" exists` 衝突錯誤。
>
> ```bash
> helm uninstall my-ingress
> ```

建立兩個環境的 values 檔：

```yaml
# values-dev.yaml
controller:
  replicaCount: 1
  resources:
    requests:
      cpu: 100m
      memory: 90Mi
```

```yaml
# values-prod.yaml
controller:
  replicaCount: 2
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
```

用 `-f` 帶入 values 檔安裝：

```bash
helm install dev-ingress ingress-nginx/ingress-nginx \
  -f values-dev.yaml \
  --set controller.service.type=NodePort
```

預期輸出：
```
NAME: dev-ingress
LAST DEPLOYED: Sun Apr 13 10:00:00 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
```

- `-f values-dev.yaml`：用指定的 values 檔覆蓋 Chart 的預設值
- `-f` 和 `--set` 可以混用，`--set` 的優先級高於 `-f`

這樣同一個 Chart，dev 裝 1 個副本，prod 裝 2 個，配置分開管理。

📄 6-18 第 8 張

**Step 7：一行裝完整監控 stack — Prometheus + Grafana**

剛才裝 Nginx Ingress，是基礎設施。現在裝一個更有感的——監控系統。

正常手動搭 Prometheus + Grafana 需要：Prometheus Deployment、Grafana Deployment、AlertManager、各種 ConfigMap、ServiceAccount、RBAC 規則⋯⋯加起來幾十個資源、上百行 YAML。

用 Helm，一行（Step 2 已加入 prometheus-community repo）：

```bash
helm install monitoring prometheus-community/kube-prometheus-stack \
  --set grafana.adminPassword=admin123
```

預期輸出：
```
NAME: monitoring
LAST DEPLOYED: Sun Apr 13 10:05:00 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
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

預期輸出：
```
Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000
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

預期輸出：
```
Creating my-app
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

打開 `values.yaml`，找到 image 的部分並修改，同時加上必要的欄位（新版 Helm 骨架預設包含 serviceAccount 和 httpRoute）：

```yaml
# values.yaml（關鍵設定）
image:
  repository: nginx
  tag: "alpine"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false

serviceAccount:
  create: false    # 關掉，避免需要額外權限
  name: ""

httpRoute:
  enabled: false   # 關掉，避免需要 Gateway API CRD
```

打開 `templates/deployment.yaml`，看到：

```yaml
image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

這就是模板語法。`{{ .Values.xxx }}` 會被 values.yaml 裡的值替換掉。

安裝這個 Chart：

```bash
helm install my-app ./my-app
```

預期輸出：
```
NAME: my-app
LAST DEPLOYED: Sun Apr 13 10:15:00 2025
NAMESPACE: default
STATUS: deployed
REVISION: 1
```

```bash
kubectl get pods   # 看到 my-app-xxx 跑起來
```

預期輸出：
```
NAME                       READY   STATUS    RESTARTS   AGE
my-app-6d8f9b7c4d-xk9pj   1/1     Running   0          30s
```

升級，換一個 image tag：

```bash
helm upgrade my-app ./my-app --set image.tag=1.25
```

預期輸出：
```
Release "my-app" has been upgraded. Happy Helming!
NAME: my-app
LAST DEPLOYED: Sun Apr 13 10:20:00 2025
NAMESPACE: default
STATUS: deployed
REVISION: 2
```

```bash
kubectl describe pod -l app.kubernetes.io/name=my-app | grep Image
# → Image: nginx:1.25
```

預期輸出：
```
    Image:          nginx:1.25
```

這就是為什麼 Helm 可以一份 Chart 部署 dev、staging、prod——三個環境只需要三個不同的 values.yaml，Chart 本身不用動：

```bash
helm install my-app-dev  ./my-app -f values-dev.yaml
helm install my-app-prod ./my-app -f values-prod.yaml
```

預期輸出（各自出現）：
```
NAME: my-app-dev
STATUS: deployed
REVISION: 1
```
```
NAME: my-app-prod
STATUS: deployed
REVISION: 1
```

---

📄 6-18 第 10 張

**Step 9：清理**

```bash
helm uninstall my-ingress
helm uninstall dev-ingress
helm uninstall monitoring
helm uninstall my-app
```

預期輸出：
```
release "my-ingress" uninstalled
release "dev-ingress" uninstalled
release "monitoring" uninstalled
release "my-app" uninstalled
```

確認全部清乾淨：

```bash
helm list
```

預期輸出：
```
NAME    NAMESPACE   REVISION    UPDATED STATUS  CHART   APP VERSION
```
（空的，沒有任何 Release）

```bash
kubectl get pods
```

預期輸出：
```
No resources found in default namespace.
```

```bash
kubectl get pvc
```

預期輸出：
```
No resources found in default namespace.
```

`helm list` 應該是空的，`kubectl get pods` 應該是 `No resources found`。

PVC 要特別確認——`helm uninstall` 預設不會刪 PVC（避免誤刪資料），要手動清：

```bash
kubectl delete pvc --all
```

預期輸出：
```
No resources found
```
（若有 PVC 殘留則顯示 `persistentvolumeclaim "data-xxx" deleted`）

---

### ③ QA

**Q：`helm list` 和 `kubectl get pods` 都能看到服務狀態，各自看到什麼不同的資訊？分別適合在什麼情況下用？**

A：`helm list` 看的是 Release 層級：整體 STATUS（deployed/failed）、版本號（REVISION）、Chart 版本。適合確認「整個應用程式的部署狀態」。`kubectl get pods` 看的是 Pod 層級：個別 Pod 的 STATUS、重啟次數。適合排查「某個 Pod 跑不起來」。兩個搭配用。

**Q：`helm uninstall` 為什麼不刪 PVC？**

A：Helm 設計上保守處理有狀態資源。PVC 裡可能有資料，uninstall 如果自動刪，一個手殘就資料全沒了。所以 Helm 預設保留 PVC，讓你手動確認後再刪。如果你確定要連 PVC 一起刪，可以加 `--cascade=foreground` 或直接 `kubectl delete pvc`。

**Q：`helm create` 產生的 Chart 可以直接用在生產環境嗎？**

A：可以用，但要調整。預設 Chart 沒有設 resource requests/limits、沒有 Probe、沒有 NetworkPolicy。這些生產必要的設定要自己加進 templates/ 或 values.yaml 裡。`helm create` 是骨架，不是成品。

---

## 6-19A 回頭操作 Loop 5 Part 1（~10 min）

### ④ 學員實作

> 開始前先確認：`helm list` 應該是空的（18A 的 my-ingress 已經 uninstall 了）。

18A 剛教了 install → upgrade → rollback。現在你自己跑一遍，**換一個 Release 名稱**（用 `my-nginx`），從頭到尾操作一次：

**任務：**
1. `helm install my-nginx`（replicaCount=1，NodePort）
2. `helm upgrade my-nginx`（replicaCount 改成 2）
3. `helm history my-nginx` 確認 REVISION 變成 2
4. `helm rollback my-nginx 1` 回到 REVISION 1
5. `helm history my-nginx` 確認 REVISION 3 出現（rollback 是新建的）
6. `helm uninstall my-nginx` 清理

---

### ⑤ 學員實作解答

```bash
# 1. install
helm install my-nginx ingress-nginx/ingress-nginx \
  --set controller.replicaCount=1 \
  --set controller.service.type=NodePort
```

預期輸出：
```
NAME: my-nginx
STATUS: deployed
REVISION: 1
```

```bash
# 2. upgrade
helm upgrade my-nginx ingress-nginx/ingress-nginx \
  --set controller.replicaCount=2 \
  --set controller.service.type=NodePort
```

預期輸出：
```
Release "my-nginx" has been upgraded.
REVISION: 2
```

```bash
# 3. history
helm history my-nginx
```

預期輸出：
```
REVISION   STATUS      DESCRIPTION
1          superseded  Install complete
2          deployed    Upgrade complete
```

```bash
# 4. rollback
helm rollback my-nginx 1
```

預期輸出：
```
Rollback was a success! Happy Helming!
```

```bash
# 5. history 再看
helm history my-nginx
```

預期輸出：
```
REVISION   STATUS      DESCRIPTION
1          superseded  Install complete
2          superseded  Upgrade complete
3          deployed    Rollback to 1
```

重點：rollback 建了新的 REVISION 3，不是覆蓋。

```bash
# 6. 清理
helm uninstall my-nginx
helm list   # 確認空的
```

---

## 6-19B 回頭操作 Loop 5 Part 2（~15 min）

### ④ 學員實作

> 開始前先確認：`helm list` 不能有任何 ingress-nginx 的 Release（18B 的 `dev-ingress` 要先 uninstall），否則安裝 my-ingress 時會因為 IngressClass 衝突失敗。
> ```bash
> helm uninstall dev-ingress 2>/dev/null || true
> helm list   # 確認空的
> ```

**必做 1：upgrade 陷阱**

執行：
```bash
helm install my-ingress ingress-nginx/ingress-nginx \
  --set controller.replicaCount=1 \
  --set controller.service.type=NodePort
```
然後執行：
```bash
helm upgrade my-ingress ingress-nginx/ingress-nginx --set controller.service.type=NodePort
```
（**不帶** replicaCount，觀察 replicaCount 是否被重設回預設值）

用 `kubectl get deployment` 確認副本數，再試試加 `--reuse-values` 有什麼差別。

---

**必做 2：自己的 Chart**

用 `helm create my-service` 建一個 Chart，修改 `values.yaml` 把 image 改成 `httpd`，安裝起來：

```bash
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# → Image: httpd:latest
```

然後用 `helm upgrade` 把 image tag 換成 `httpd:2.4`。

---

**挑戰：Grafana 看到自己的 Pod**

先確認 `monitoring` Release 是否還在：
```bash
helm list
```

如果已被清理（18B Step 9 的 uninstall 把它刪了），需先重裝：
```bash
helm install monitoring prometheus-community/kube-prometheus-stack \
  --set grafana.adminPassword=admin123
kubectl get pods | grep monitoring   # 等 2-3 分鐘，看到 Running 再繼續
```

Port-forward 打開 Grafana：
```bash
kubectl port-forward svc/monitoring-grafana 3000:80
```

打開 `http://localhost:3000`，在 Dashboards 找到 **Kubernetes / Compute Resources / Pod**，找到你剛才跑的 `my-service` Pod 的 CPU 和 Memory 圖表。

---

### ⑤ 學員實作解答

**必做 1：upgrade 陷阱**

不帶 `--set controller.replicaCount` 的 upgrade 會把 replicaCount 重設回 Chart 預設值（1）。加 `--reuse-values` 可以沿用上次所有 values：

```bash
helm upgrade my-ingress ingress-nginx/ingress-nginx \
  --reuse-values \
  --set controller.replicaCount=2
```

**必做 2：自己的 Chart**

修改 `my-service/values.yaml`：
```yaml
image:
  repository: httpd
  tag: "latest"
  pullPolicy: IfNotPresent

serviceAccount:
  create: false
  name: ""

httpRoute:
  enabled: false
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
helm uninstall my-ingress my-service monitoring 2>/dev/null || true
kubectl delete pvc --all
```
