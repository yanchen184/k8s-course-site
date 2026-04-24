# Loop 4 — 短網址服務（學生 2 小時產品實作）

> 目標：學生不用寫程式碼，只把一個已經寫好的產品部署到 Kubernetes，最後理解「手動 YAML」和「Helm 一個指令」其實在做同一件事。

---

## 7-11 我們要做出什麼？

### 這一段要回答的問題

這一段不是在教新的 YAML 語法，而是在回答：

> 一個已經寫好的產品，放到 Kubernetes 上之後，最少要有哪些運行元件？

### 產品功能

短網址服務是一個很適合最後總複習的產品：

1. 使用者在網頁輸入長網址。
2. 系統產生短網址，例如 `http://short.local/r/abc123`。
3. 使用者打開短網址。
4. API 查 PostgreSQL，找到原始網址。
5. API 回傳 redirect，瀏覽器跳到原始網址。

這個題目不需要學生寫程式碼，但能讓學生完整走過「產品部署」的流程。

### 這一段學生要帶走什麼？

- 今天的任務不是寫 app，而是部署 app。
- 學生要能分清楚入口、邏輯、資料各自在哪一層。
- 最後驗收不只看網站能不能開，還要看資料會不會丟、Pod 壞了會不會恢復。

### 架構

```text
Browser
  ↓
Ingress short.local
  ├─ /          → Frontend Deployment → url-frontend-service
  ├─ /api       → API Deployment      → url-api-service
  └─ /r/<code>  → API Deployment      → url-api-service
                                  ↓
                         PostgreSQL StatefulSet
                                  ↓
                                  PVC
```

### 為什麼選短網址服務？

| 判斷 | 短網址服務的好處 |
|---|---|
| 產品感 | 學生可以真的打開網頁、建立短網址、點短網址跳轉 |
| 難度 | 不需要 queue、worker、cron semantics，兩小時內比較穩 |
| K8s 覆蓋 | Deployment、StatefulSet、PVC、ConfigMap、Secret、Service、Ingress、Probe、Resource、HPA 都用得到 |
| 驗收清楚 | 能不能建立短網址、redirect、刪 Pod 後恢復、DB 資料是否保留 |

### 講師提醒

這一段先不要急著講 YAML。先讓學生回答三個問題就好：

1. 誰是入口？`Ingress + Frontend`
2. 誰處理邏輯？`API`
3. 資料放哪裡？`PostgreSQL + PVC`

### 先準備 image：下載 tar 並匯入每台 node

在開始 `kubectl apply` 之前，先確認 Pod 啟動會用到的 image 已經放進每台 k3s node。

前幾堂課如果全班同時從 Docker Hub 拉 image，很容易遇到 rate limit。短網址 Lab 預設改成「講師提供 image tar」的 workflow：

```text
cloud download
  -> k3s ctr images import
  -> check images on every node
  -> kubectl apply / helm install
```

學生不需要在課堂現場從 Docker Hub pull `postgres:15`、`busybox:1.36`，也不需要重新 build API / Frontend。講師課前把完整的 `url-shortener-k3s-images.tar` 放到雲端空間，學生下載後直接匯入每台 k3s node。

重點是：k3s 使用的是 control plane / worker node 裡的 containerd，所以 image tar 要匯入每個 k3s node。

一句話記住：**Pod 被排到哪台 node，那台 node 就必須已經有 image。** 如果 YAML 使用 `imagePullPolicy: Never`，k3s 不會退回去 Docker Hub 幫你拉。

在 `k8s-course-labs/lesson7/url-shortener/` 執行：

```bash
sha256sum ~/Downloads/url-shortener-k3s-images.tar
IMAGE_TAR=~/Downloads/url-shortener-k3s-images.tar \
K3S_NODES="user@192.168.56.10 user@192.168.56.11" \
  ./scripts/load-images-to-k3s-ssh.sh
K3S_NODES="user@192.168.56.10 user@192.168.56.11" ./scripts/check-k3s-images-ssh.sh
```

這段指令的意思是：

| 片段 | 意思 |
|---|---|
| `IMAGE_TAR=~/Downloads/url-shortener-k3s-images.tar` | 告訴腳本 image tar 放在哪裡。 |
| `K3S_NODES="..."` | 告訴腳本要處理哪些 k3s node。 |
| `user@192.168.56.10` | 用 `user` 這個 Linux 帳號 SSH 進 `192.168.56.10` 這台 VM，通常是 control plane。 |
| `user@192.168.56.11` | 用 `user` 這個 Linux 帳號 SSH 進 `192.168.56.11` 這台 VM，通常是 worker。 |
| `./scripts/load-images-to-k3s-ssh.sh` | 把 tar 傳到每台 node，並在每台 node 執行 `sudo k3s ctr images import`。 |
| `./scripts/check-k3s-images-ssh.sh` | 逐台檢查 containerd 裡是否已經有短網址會用到的四個 image。 |

學生要把範例 IP 換成自己的 VM IP。如果你的 VM 是：

| 角色 | IP | SSH 帳號 |
|---|---|---|
| control plane | `192.168.56.10` | `user` |
| worker | `192.168.56.11` | `user` |

那 `K3S_NODES` 就寫：

```bash
K3S_NODES="user@192.168.56.10 user@192.168.56.11"
```

如果你的帳號叫 `ubuntu`，就要改成：

```bash
K3S_NODES="ubuntu@192.168.56.10 ubuntu@192.168.56.11"
```

如果目前只有一台 control plane，可以先只填一台：

```bash
K3S_NODES="user@192.168.56.10"
```

但只要有 worker node，就一定要把 worker 也放進 `K3S_NODES`。因為 Pod 可能被排到 worker 上，worker 沒有 image 的話，Pod 還是會啟動失敗。

SHA256 應該是：

```text
bae34023b8fd055f13235ce239976c95d5f97156bde6bd0452c8de7a76f7fc44
```

`K3S_NODES` 要填每台 Linux VM 的 SSH 目標，通常會包含 control plane 和 worker node。Windows + VMware 環境下，只要學生可以從執行腳本的地方 `ssh user@<node-ip>` 進 VM，且該使用者可以免互動執行 `sudo -n k3s ctr images list -q`，就可以用這條路徑。

如果講師或助教使用的是 Multipass 環境，才改用 `load-images-to-k3s-multipass.sh` 和 `check-k3s-images.sh`。

這會準備四個 image：

| Image | 用在哪裡 |
|---|---|
| `url-shortener-api:lab` | API Deployment 和 migration Job |
| `url-shortener-frontend:lab` | Frontend Deployment |
| `postgres:15` | PostgreSQL StatefulSet |
| `busybox:1.36` | migration Job 的 init container |

如果講師要課前重產 tar，才需要跑 `build-local-images.sh`、`docker pull postgres:15`、`docker pull busybox:1.36` 和 `save-k3s-images.sh`。

---

## 7-12 手動部署：一步一步把產品建起來

> 這段的重點不是背 YAML，而是知道每個檔案負責哪一層。
>
> Lab 檔案會放在 `k8s-course-labs/lesson7/url-shortener/`。學生上課時從該資料夾操作即可。
>
> 先完成 7-11 的 image 準備與檢查，再開始 apply YAML。

### 這一段要回答的問題

這一段真正要回答的是：

> 把產品放上 K8s 時，到底在做哪些部署決定？

所以不要把它看成 9 個檔案，而要看成 9 個部署問題。

| 檔案 | 建立的 K8s 物件 | 真正在回答的問題 |
|---|---|---|
| `00-namespace.yaml` | `Namespace` | 這個產品放在哪個隔離空間？ |
| `01-secret.yaml` | `Secret` | 敏感資訊放哪裡？ |
| `02-configmap.yaml` | `ConfigMap` | 非敏感設定放哪裡？ |
| `03-postgres.yaml` | Headless `Service` + `StatefulSet` + PVC template | 資料要不要保留？ |
| `04-migrate-job.yaml` | `Job` + init container | 資料表誰來建立？ |
| `05-api.yaml` | `Deployment` + `Service` | 誰負責建立短網址與 redirect？ |
| `06-frontend.yaml` | `Deployment` + `Service` | 誰提供操作介面？ |
| `07-hpa.yaml` | `HorizontalPodAutoscaler` | 流量變大怎麼辦？ |
| `08-ingress.yaml` | `Ingress` | 使用者怎麼進產品？ |

### YAML 大複習：每份檔案到底做了什麼？

這一段可以當成整門課的總複習。學生每 apply 一份 YAML，都要能說出三件事：

1. 這份 YAML 建了哪些 K8s 物件。
2. 這些物件在產品裡負責什麼。
3. 這份 YAML 和前面學過的哪個觀念對應。

| 檔案 | 它做了什麼 | 大複習重點 |
|---|---|---|
| `00-namespace.yaml` | 建立 `url-shortener` namespace。後續 Secret、ConfigMap、DB、API、Frontend、HPA、Ingress 都放在同一個 namespace。 | Namespace 是產品邊界，不是單純分類資料夾。 |
| `01-secret.yaml` | 建立 `url-shortener-secrets`，目前放 `postgres-password`。API、migration、PostgreSQL 都從這裡拿 DB 密碼。 | Secret 放敏感值；正式環境不要把真密碼提交到 Git。 |
| `02-configmap.yaml` | 建立 `url-shortener-config`，放 `POSTGRES_HOST`、`POSTGRES_PORT`、`POSTGRES_DB`、`POSTGRES_USER`。 | ConfigMap 放非敏感設定；程式不應硬編碼環境差異。 |
| `03-postgres.yaml` | 建立 `postgres-service` headless Service 和 `postgres` StatefulSet；透過 `volumeClaimTemplates` 建 PVC。 | DB 需要穩定身份與持久化儲存，所以用 StatefulSet + PVC。 |
| `04-migrate-job.yaml` | 建立一次性的 `db-migrate` Job；init container 先等 PostgreSQL 開好，再執行 `node migrate.js` 建表。 | Job 適合一次性任務；migration 不應靠手動進 DB 操作。 |
| `05-api.yaml` | 建立 `url-api` Deployment 和 `url-api-service`；API 從 ConfigMap/Secret 拿 DB 連線設定，並設定 probes、resources。 | 無狀態服務用 Deployment；readiness/liveness/resources 是 production readiness。 |
| `06-frontend.yaml` | 建立 `url-frontend` Deployment 和 `url-frontend-service`；跑靜態網站。 | Frontend 也是無狀態服務，Service 提供穩定入口給 Ingress。 |
| `07-hpa.yaml` | 建立 `url-api-hpa`，目標是 `url-api` Deployment，CPU 平均使用率 70% 時擴縮。 | HPA 不是獨立魔法；它需要 target Deployment 也需要 CPU requests。 |
| `08-ingress.yaml` | 建立 `url-shortener-ingress`，把 `short.local` 的 `/` 導到 frontend，把 `/api`、`/r`、`/health`、`/ready` 導到 API。 | Ingress 是產品對外入口；同一個 domain 可以依 path 導到不同 Service。 |

最後要把學生拉回一個觀念：

> 你剛剛不是在部署 9 份 YAML，你是在把一個產品拆成 9 個可管理、可驗收、可重複交付的 K8s 物件群。

### 備援 image 策略：使用 Docker Hub public image

這個 Lab 的 K8s YAML 和 Helm chart 會使用：

```text
yanchen184/url-shortener-api:v1
yanchen184/url-shortener-frontend:v1
```

如果 local image workflow 當天失敗，才改用 public image。上課前先確認 image 已經存在：

```bash
docker manifest inspect yanchen184/url-shortener-api:v1 >/dev/null
docker manifest inspect yanchen184/url-shortener-frontend:v1 >/dev/null
```

如果 image 還不存在，先把 course site repo 裡的 `apps/**` 變更推到 `master`，讓 `.github/workflows/build-apps.yml` 透過 Docker Hub token build/push。否則學生 apply public YAML 時會卡在 `ImagePullBackOff`。

### Step 0：確認 Node 和 Ingress

```bash
kubectl get nodes
kubectl get pods -n kube-system
```

k3s 預設有 Traefik Ingress Controller。等等 Ingress 會用 `ingressClassName: traefik`。

### Step 1：建立 Namespace

```bash
kubectl apply -f apps/k8s/url-shortener/00-namespace.yaml
kubectl get ns url-shortener
```

Namespace 是產品的邏輯邊界。今天所有資源都放在 `url-shortener`。

學生要知道：不是因為範例喜歡多建一層，而是因為之後所有資源管理、`kubectl get all -n url-shortener`、權限範圍都會靠這個邊界。

這份 YAML 很短，但很重要：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: url-shortener
```

講解重點：

- `kind: Namespace`：建立產品的隔離空間。
- `metadata.name`：後面所有 manifest 都會用 `namespace: url-shortener` 放進同一個空間。
- 這是整套產品的外框，後面才開始把元件放進去。

### Step 2：建立 Secret 和 ConfigMap

```bash
kubectl apply -f apps/k8s/url-shortener/01-secret.yaml
kubectl apply -f apps/k8s/url-shortener/02-configmap.yaml
```

分界線：

| 物件 | 放什麼 |
|---|---|
| Secret | PostgreSQL password |
| ConfigMap | PostgreSQL host、port、database、user |

正式環境不要把真實密碼提交到 Git。課堂範例使用 lab placeholder，目的是讓流程能跑通。

學生要知道：`Secret` 和 `ConfigMap` 不是兩個隨便選的名字，而是在回答「這個值洩漏出去會不會有問題」。

`01-secret.yaml` 的重點：

- `kind: Secret`：建立敏感設定容器。
- `type: Opaque`：一般用途的 key/value secret。
- `stringData.postgres-password`：課堂 placeholder。正式環境應改由安全流程注入。

`02-configmap.yaml` 的重點：

- `kind: ConfigMap`：建立非敏感設定容器。
- `POSTGRES_HOST: postgres-service`：不是 IP，而是 K8s Service DNS 名稱。
- API、migration、PostgreSQL 都靠這兩份設定把資料庫連起來。

### Step 3：部署 PostgreSQL StatefulSet + PVC

```bash
kubectl apply -f apps/k8s/url-shortener-local/03-postgres.yaml
kubectl get pods,pvc -n url-shortener
```

這裡使用 local 版 PostgreSQL YAML，因為 `postgres:15` 也是從 image tar 匯入到每台 node 的 image。local 版會設定 `imagePullPolicy: Never`，避免 k3s 在 node 找不到 image 時又跑去 Docker Hub pull。

為什麼 DB 用 StatefulSet？

- DB 需要穩定名稱。
- DB 需要固定儲存。
- Pod 重建後要掛回同一個 PVC。

學生要知道：這裡不是因為 PostgreSQL 比較特別才用 `StatefulSet`，而是因為它需要穩定名稱和穩定儲存。

這份 YAML 建了兩類物件：

| 物件 | 作用 |
|---|---|
| Headless `Service` | 給 StatefulSet 穩定 DNS，`clusterIP: None`。 |
| `StatefulSet` | 建立 `postgres-0`，讓 DB 有穩定 Pod 名稱。 |
| `volumeClaimTemplates` | 自動建立 PVC，讓資料寫到持久化磁碟。 |

幾個應該講清楚的欄位：

- `serviceName: postgres-service`：StatefulSet 會用這個 Service 建立穩定網路身份。
- `selector.matchLabels` 和 Pod `labels` 要對上，Service 才找得到 Pod。
- `volumeMounts.mountPath: /var/lib/postgresql/data`：PostgreSQL 資料寫入的位置。
- `readinessProbe`：DB 還沒 ready 前，不要把它當成可用。

驗收：

```bash
kubectl get pod postgres-0 -n url-shortener
kubectl get pvc -n url-shortener
```

### Step 4：執行 Migration Job

```bash
kubectl apply -f apps/k8s/url-shortener-local/04-migrate-job.yaml
kubectl get jobs -n url-shortener
kubectl logs job/db-migrate -n url-shortener
```

Job 適合一次性任務。這裡只負責建立 `short_links` table。

學生要知道：建立資料表不是讓講師手動進 DB 做，而是把它變成可重複執行、可追蹤 log 的 K8s 物件。

這份 YAML 的重點：

- `kind: Job`：跑完就結束，不需要一直常駐。
- `restartPolicy: OnFailure`：失敗時重跑 Pod。
- `initContainers.wait-for-postgres`：先等 `postgres-service:5432` 可以連，再跑 migration。
- `image: url-shortener-api:lab`：使用學生自己 build 並匯入 k3s 的 local image。
- `imagePullPolicy: Never`：要求 k3s 不要對外拉 image，直接使用 node 上已有的 image。
- `command: ["node", "migrate.js"]`：用 API image 裡的 migration 程式建表。
- `backoffLimit: 3`：最多重試 3 次，避免無限重跑。

### Step 5：部署 API

```bash
kubectl apply -f apps/k8s/url-shortener-local/05-api.yaml
kubectl get deploy,svc -n url-shortener
kubectl get pods -l app=url-api -n url-shortener
```

API 是無狀態服務，所以用 Deployment。API 透過：

- ConfigMap 取得 DB host、port、database、user。
- Secret 取得 DB password。
- readinessProbe 確認 DB 可連線。
- livenessProbe 確認 API process 還活著。
- resources requests/limits 讓 HPA 有計算基準。

學生要知道：`Deployment` 不是「預設都用它」，而是因為 API 無狀態，可以隨時被補回。

這份 YAML 建了兩個物件：

| 物件 | 作用 |
|---|---|
| `Deployment` | 跑 2 個 API Pod，Pod 掛掉會自動補回。 |
| `Service` | 提供 `url-api-service` 這個穩定入口，給 Ingress 使用。 |

幾個應該講清楚的欄位：

- `image: url-shortener-api:lab`：使用本地 build/import 的 image，不走 Docker Hub。
- `imagePullPolicy: Never`：避免現場因外部 registry 限流而失敗。
- `replicas: 2`：API 先跑兩份，避免單 Pod 掛掉就中斷。
- `envFrom.configMapRef`：把 DB host、port、database、user 注入 API。
- `secretKeyRef`：只把 API 需要的 DB password 注入，不整包暴露。
- `resources.requests.cpu`：HPA 需要這個值才能計算 CPU 使用率百分比。
- `livenessProbe: /health`：確認 process 是否還活著。
- `readinessProbe: /ready`：確認 API 是否真的可以接流量，包含 DB 連線狀態。

### Step 6：部署 Frontend

```bash
kubectl apply -f apps/k8s/url-shortener-local/06-frontend.yaml
kubectl get deploy,svc -n url-shortener
```

Frontend 是靜態網站，無狀態，所以也是 Deployment。

學生要知道：這裡的 Frontend 很單純，但它很重要，因為最後能不能打開網頁是產品感的來源。

這份 YAML 建了兩個物件：

| 物件 | 作用 |
|---|---|
| `Deployment` | 跑 2 個 frontend Pod，提供靜態網頁。 |
| `Service` | 提供 `url-frontend-service`，讓 Ingress 可以把 `/` 導過來。 |

local YAML 使用 `url-shortener-frontend:lab` 和 `imagePullPolicy: Never`，原因和 API 相同：上課時不依賴 Docker Hub。

Frontend 沒有 DB 連線設定，也不需要 Secret，這正好可以讓學生比較：

- API 是有後端依賴的無狀態服務。
- Frontend 是更單純的無狀態服務。
- 兩者都適合 Deployment，但 env / probe / resources 的需求不同。

### Step 7：部署 HPA

```bash
kubectl apply -f apps/k8s/url-shortener/07-hpa.yaml
kubectl get hpa -n url-shortener
```

HPA 掛在 API 上。因為短網址查詢流量主要打 API，Frontend 通常不是瓶頸。

學生要知道：不是每個服務都一定要 HPA，而是先判斷誰最可能成為瓶頸。

這份 YAML 的重點：

- `kind: HorizontalPodAutoscaler`：建立自動擴縮規則。
- `scaleTargetRef.name: url-api`：HPA 擴的是 API Deployment，不是 DB，也不是 Frontend。
- `minReplicas: 2` / `maxReplicas: 6`：設定擴縮上下限，避免縮到太少或放大無上限。
- `averageUtilization: 70`：CPU 平均使用率超過目標時開始擴。

如果 `TARGETS` 顯示 `unknown`，先確認：

```bash
kubectl top pods -n url-shortener
kubectl describe hpa url-api-hpa -n url-shortener
```

### Step 8：部署 Ingress

```bash
kubectl apply -f apps/k8s/url-shortener/08-ingress.yaml
kubectl get ingress -n url-shortener
```

這份 YAML 的重點：

- `kind: Ingress`：建立 HTTP 入口。
- `ingressClassName: traefik`：指定用 k3s 預設的 Traefik 處理。
- `host: short.local`：使用者看到的是 domain，不是 Pod IP。
- `/api`、`/r`、`/health`、`/ready` 導到 `url-api-service`。
- `/` 導到 `url-frontend-service`。

這裡是整個產品最像真實服務的地方：同一個 domain，用不同 path 分流到不同 Service。

在自己的電腦加 hosts：

```bash
sudo sh -c 'echo "<NODE-IP> short.local" >> /etc/hosts'
```

驗收：

```bash
curl -H "Host: short.local" http://<NODE-IP>/health
```

或直接打開瀏覽器：

```text
http://short.local
```

### 這一段學生要帶走什麼？

- 9 份 YAML 不是 9 份作業，而是 9 個部署決定。
- 每一份 manifest 都是在回答一個問題。
- 先手動做一次，後面講 Helm 才有意義。
- Helm 一鍵部署不是魔法，它只是把這 9 份 YAML template 化。
- 一鍵部署前，image 也要先交付到 k3s node；Helm 不會幫你 build image。

---

## 7-13 驗收：產品真的可用

### 這一段要回答的問題

> 怎樣才算真的部署完成？

答案不是 `Pod Running`，而是要同時通過：

1. 產品驗收
2. K8s 驗收
3. 故障驗收

### 功能驗收

1. 打開 `http://short.local`。
2. 輸入 `https://kubernetes.io/`。
3. 按下 `Create link`。
4. 看到 `http://short.local/r/<code>`。
5. 點短網址，瀏覽器跳到 Kubernetes 官方網站。

也可以用 API 驗收：

```bash
curl -s -X POST http://short.local/api/links \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://kubernetes.io/"}'
```

這一層在回答：**產品到底能不能用？**

### K8s 驗收

```bash
kubectl get all -n url-shortener
kubectl get pvc -n url-shortener
kubectl get hpa -n url-shortener
```

學生要能說出每個物件的用途：

| 物件 | 用途 |
|---|---|
| Namespace | 隔離整個產品 |
| Secret | 儲存 DB 密碼 |
| ConfigMap | 儲存非機密設定 |
| StatefulSet | 跑 PostgreSQL |
| PVC | 保存短網址資料 |
| Job | 建資料表 |
| Deployment | 跑 API / Frontend |
| Service | 讓 Pod 有穩定 DNS 和入口 |
| Ingress | 讓瀏覽器能用 domain 進來 |
| HPA | API 流量高時自動擴縮 |

這一層在回答：**Kubernetes 有沒有真的提供你要的運行能力？**

### 故障驗收

刪掉 API Pod：

```bash
kubectl delete pod -l app=url-api -n url-shortener
kubectl get pods -n url-shortener -w
```

預期：Deployment 自動補回，網站恢復。

刪掉 DB Pod：

```bash
kubectl delete pod postgres-0 -n url-shortener
kubectl get pod postgres-0 -n url-shortener -w
```

預期：StatefulSet 重新建立 `postgres-0`，同一個 PVC 仍然掛回來，短網址資料還在。

這一層在回答：**系統壞掉時，平台能不能幫你恢復？**

### 講師提醒

這一段很適合直接講一句總結：

> 如果只能用、不能恢復，不算部署完成。
> 如果能恢復、但資料會丟，也不算部署完成。

---

## 7-14 最後收尾：其實可以一個指令完成

前面一步一步做，是為了讓你知道每個 K8s 元件在產品裡扮演什麼角色。

正式工作不會每天手動 apply 八個 YAML。通常會用 Helm，把剛剛那一整套 YAML 包成一個 chart。

### 這一段要回答的問題

> 為什麼剛剛要手動做一次，最後又說其實可以一個指令完成？

因為兩件事目的不同：

| 做法 | 目的 |
|---|---|
| 手動 `kubectl apply` | 理解一個產品拆開來有哪些 K8s 元件 |
| `helm install` | 把這些元件包成可重複交付的產品 |

### 一個指令安裝

```bash
helm install url-shortener ./apps/helm/url-shortener \
  -n url-shortener \
  --create-namespace \
  -f ./apps/helm/url-shortener/values-local.yaml
```

這一個指令會建立：

- Secret
- ConfigMap
- PostgreSQL StatefulSet
- PVC
- Migration Job
- API Deployment + Service
- Frontend Deployment + Service
- HPA
- Ingress

也就是說，Helm 做的不是另一套東西。它做的是把剛剛手動 apply 的那些 manifest 變成 template：

| 手動 YAML | Helm template |
|---|---|
| `01-secret.yaml` | `templates/secret.yaml` |
| `02-configmap.yaml` | `templates/configmap.yaml` |
| `03-postgres.yaml` | `templates/postgres.yaml` |
| `04-migrate-job.yaml` | `templates/migrate-job.yaml` |
| `05-api.yaml` | `templates/api.yaml` |
| `06-frontend.yaml` | `templates/frontend.yaml` |
| `07-hpa.yaml` | `templates/hpa.yaml` |
| `08-ingress.yaml` | `templates/ingress.yaml` |

`values-local.yaml` 會把 API / Frontend image 設成：

```yaml
image:
  registry: ""
  apiRepository: url-shortener-api
  frontendRepository: url-shortener-frontend
  tag: lab
  pullPolicy: Never
```

所以 Helm render 後會使用 `url-shortener-api:lab` 和 `url-shortener-frontend:lab`，而不是 `/url-shortener-api:lab` 或 Docker Hub 上的 `yanchen184/...`。

### 一個指令升級

```bash
helm upgrade url-shortener ./apps/helm/url-shortener -n url-shortener
```

### 一個指令回滾

```bash
helm rollback url-shortener 1 -n url-shortener
```

### 可以調整什麼？

```bash
helm upgrade url-shortener ./apps/helm/url-shortener \
  -n url-shortener \
  --set replicaCount.api=3 \
  --set hpa.maxReplicas=10 \
  --set ingress.host=short.demo.local \
  --set resources.api.requests.cpu=150m
```

| Values | 代表意義 |
|---|---|
| `image.tag` | 部署哪個版本 |
| `replicaCount.api` | API 預設跑幾個 Pod |
| `replicaCount.frontend` | Frontend 預設跑幾個 Pod |
| `resources.api.requests.cpu` | API 保留多少 CPU，HPA 也靠它計算 |
| `resources.api.limits.memory` | API 最多可用多少記憶體 |
| `hpa.enabled` | 是否啟用自動擴縮 |
| `hpa.minReplicas` / `hpa.maxReplicas` | 自動擴縮上下限 |
| `ingress.host` | 對外使用的 domain |
| `postgres.storageSize` | PostgreSQL PVC 大小 |
| `secret.postgresPassword` | DB 密碼，正式環境應改由 secret manager 或安全流程注入 |

最後要讓學生帶走這句話：

> K8s 教你的是系統怎麼組成；Helm 教你的是怎麼把這套系統變成可以重複交付的產品。

---

## 講師課前驗證：本機 smoke test

如果當天上課前 Kubernetes 叢集還沒準備好，講師仍然可以先用 Docker 驗證產品本身沒有壞。

在 `k8s-course-labs/lesson7/url-shortener/` 執行：

```bash
./local-smoke-test.sh
```

這個腳本會做以下事情：

1. Build API image。
2. Build Frontend image。
3. 建立 Docker network。
4. 啟動 PostgreSQL。
5. 執行 migration 建立 `short_links` table。
6. 啟動 API。
7. 啟動 Frontend。
8. 啟動一個 nginx gateway，模擬 Ingress 的 `/`、`/api`、`/r`、`/health`、`/ready` routing。
9. 驗證 `/health`。
10. 驗證 `/ready`。
11. 驗證首頁 HTML。
12. 建立短網址 `k8stest`。
13. 查詢 `/api/links`。
14. 驗證 `/r/k8stest` 會 `302` redirect 到 `https://kubernetes.io/`。
15. 刪掉並重建 API container。
16. 再查一次 `/api/links`，確認資料仍在 PostgreSQL。
17. 自動刪掉測試 containers、Docker network、local test images。

這段不是學生主要 Lab。它是講師課前檢查，用來確認程式碼、Dockerfile、migration、API、Frontend、Ingress-like routing 和資料持久化流程都正常。
