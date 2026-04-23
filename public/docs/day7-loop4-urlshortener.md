# Loop 4 — 短網址服務（學生 2 小時產品實作）

> 目標：學生不用寫程式碼，只把一個已經寫好的產品部署到 Kubernetes，最後理解「手動 YAML」和「Helm 一個指令」其實在做同一件事。

---

## 7-11 我們要做出什麼？

### 產品功能

短網址服務是一個很適合最後總複習的產品：

1. 使用者在網頁輸入長網址。
2. 系統產生短網址，例如 `http://short.local/r/abc123`。
3. 使用者打開短網址。
4. API 查 PostgreSQL，找到原始網址。
5. API 回傳 redirect，瀏覽器跳到原始網址。

這個題目不需要學生寫程式碼，但能讓學生完整走過「產品部署」的流程。

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

---

## 7-12 手動部署：一步一步把產品建起來

> 這段的重點不是背 YAML，而是知道每個檔案負責哪一層。
>
> Lab 檔案會放在 `k8s-course-labs/lesson7/url-shortener/`。學生上課時從該資料夾操作即可。

### 課前 image 檢查

這個 Lab 的 K8s YAML 和 Helm chart 會使用：

```text
yanchen184/url-shortener-api:v1
yanchen184/url-shortener-frontend:v1
```

上課前先確認 image 已經存在：

```bash
docker manifest inspect yanchen184/url-shortener-api:v1 >/dev/null
docker manifest inspect yanchen184/url-shortener-frontend:v1 >/dev/null
```

如果 image 還不存在，先把 course site repo 裡的 `apps/**` 變更推到 `master`，讓 `.github/workflows/build-apps.yml` 透過 Docker Hub token build/push。否則學生 apply YAML 時會卡在 `ImagePullBackOff`。

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

### Step 3：部署 PostgreSQL StatefulSet + PVC

```bash
kubectl apply -f apps/k8s/url-shortener/03-postgres.yaml
kubectl get pods,pvc -n url-shortener
```

為什麼 DB 用 StatefulSet？

- DB 需要穩定名稱。
- DB 需要固定儲存。
- Pod 重建後要掛回同一個 PVC。

驗收：

```bash
kubectl get pod postgres-0 -n url-shortener
kubectl get pvc -n url-shortener
```

### Step 4：執行 Migration Job

```bash
kubectl apply -f apps/k8s/url-shortener/04-migrate-job.yaml
kubectl get jobs -n url-shortener
kubectl logs job/db-migrate -n url-shortener
```

Job 適合一次性任務。這裡只負責建立 `short_links` table。

### Step 5：部署 API

```bash
kubectl apply -f apps/k8s/url-shortener/05-api.yaml
kubectl get deploy,svc -n url-shortener
kubectl get pods -l app=url-api -n url-shortener
```

API 是無狀態服務，所以用 Deployment。API 透過：

- ConfigMap 取得 DB host、port、database、user。
- Secret 取得 DB password。
- readinessProbe 確認 DB 可連線。
- livenessProbe 確認 API process 還活著。
- resources requests/limits 讓 HPA 有計算基準。

### Step 6：部署 Frontend

```bash
kubectl apply -f apps/k8s/url-shortener/06-frontend.yaml
kubectl get deploy,svc -n url-shortener
```

Frontend 是靜態網站，無狀態，所以也是 Deployment。

### Step 7：部署 HPA

```bash
kubectl apply -f apps/k8s/url-shortener/07-hpa.yaml
kubectl get hpa -n url-shortener
```

HPA 掛在 API 上。因為短網址查詢流量主要打 API，Frontend 通常不是瓶頸。

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

---

## 7-13 驗收：產品真的可用

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

---

## 7-14 最後收尾：其實可以一個指令完成

前面一步一步做，是為了讓你知道每個 K8s 元件在產品裡扮演什麼角色。

正式工作不會每天手動 apply 八個 YAML。通常會用 Helm，把剛剛那一整套 YAML 包成一個 chart。

### 一個指令安裝

```bash
helm install url-shortener ./apps/helm/url-shortener \
  -n url-shortener \
  --create-namespace
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

> K8s 的價值不是讓你背一堆 YAML，而是讓你知道一個產品由哪些運行元件組成；Helm 的價值，是把這些元件打包成可以重複部署、可以調參、可以升級回滾的一個產品。

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
