# Day 7 Loop 7 — 從零部署完整系統（下）

---

## 7-20 從零部署引導（下）（~12 min）

### ① 課程內容

📄 7-20 第 1 張

上半場做完了步驟 1 到 6。MySQL 在跑、API 在跑、Frontend 在跑，系統骨架立起來了。

但目前有三個缺口：

1. **外面連不進來**：沒有 Ingress，使用者用什麼網址連？
2. **流量暴增沒人管**：沒有 HPA，要靠人手動 scale
3. **Pod 之間全通**：沒有 NetworkPolicy，前端可以直連資料庫

步驟 7 到 12 補上這三個缺口，把系統從「能跑」升級到「生產就緒」。

---

📄 7-20 第 2 張

**步驟 7：Ingress**

```yaml
# 07-ingress.yaml 的路由規則
rules:
  - host: myapp.local
    http:
      paths:
        - path: /
          pathType: Prefix
          backend:
            service:
              name: frontend-svc
              port:
                number: 80
        - path: /api
          pathType: Prefix
          backend:
            service:
              name: api-svc
              port:
                number: 80
```

`/` 路徑到前端，`/api` 路徑到 API。一個 IP、一個域名，兩個服務。

---

📄 7-20 第 3 張

**步驟 8：HPA**

給 API Deployment 加 HPA：CPU 超過 50% 就自動擴，最少 3 個副本、最多 10 個。

HPA 需要 metrics-server 才能讀到 CPU 數據，而且 Deployment 必須設 `resources.requests`。我們的 `05-api.yaml` 已經設好了，所以 HPA 能正常運作。

**步驟 9：NetworkPolicy**

三條 NetworkPolicy 做三層隔離：

| Policy | 保護誰 | 允許誰連進來 |
|--------|--------|------------|
| `db-policy` | MySQL（`app=mysql`） | 只允許 `app=api` |
| `api-policy` | API（`app=api`） | 只允許 `app=frontend` 和 Ingress Controller |
| `frontend-policy` | Frontend（`app=frontend`） | 只允許 Ingress Controller |

三層全部鎖上，攻擊者就算入侵前端 Pod，也連不到 API，更連不到資料庫。

---

📄 7-20 第 4 張

**步驟 10（選做）：RBAC**

建一個 `prod-viewer` Role，在 prod Namespace 只能 get/list/watch，不能 create/update/delete。綁定給一個 `prod-viewer-sa` ServiceAccount。

步驟 10 跟 Loop 4 的 RBAC 一模一樣，只是 Namespace 換成 prod。

**步驟 11：完整驗證**

```bash
kubectl get all -n prod          # Pod、Deployment、StatefulSet、Service
kubectl get pvc -n prod          # mysql-data-mysql-0，Bound
kubectl get ingress -n prod      # myapp-ingress
kubectl get hpa -n prod          # api-hpa
kubectl get networkpolicy -n prod # 三條 policy
kubectl get secret -n prod       # mysql-secret
kubectl get configmap -n prod    # api-config
```

全部都有，這套系統就建完了。

**步驟 12（選做）：壓測 + 故障模擬**

跑 busybox 不斷打 api-svc，觀察 HPA 自動擴容。再故意砍一個 API Pod，觀察 Deployment 自動補回來。

---

📄 7-20 第 5 張

**12 步的完整因果鏈**

```
01 Namespace  →  空間隔離，清理方便
02 Secret     →  密碼不明文
03 ConfigMap  →  設定不寫死
04 MySQL      →  資料庫（StatefulSet + PVC，資料不丟）
05 API        →  業務邏輯（Probe + Resource + 讀 Secret/ConfigMap）
06 Frontend   →  使用者介面（nginx 反向代理）
07 Ingress    →  外部入口，用域名路由
08 HPA        →  自動擴縮，流量暴增不怕
09 NetworkPolicy → 三層隔離，安全加固
10 RBAC       →  人的權限控管（選做）
11 驗證       →  全面確認
12 壓測       →  親眼看 HPA 和自我修復（選做）
```

每一步都是前一步問題的解法。你不需要背順序，你只需要記住依賴關係：密碼先備好，資料庫才能啟動；資料庫啟動了，API 才能連；所有服務跑起來了，Ingress 才有東西路由。

---

## 7-21 從零部署實作示範（下）（~12 min）

### ② 所有指令＋講解

**Step 7：建 Ingress**

```bash
kubectl apply -f final-project/07-ingress.yaml
kubectl get ingress -n prod
```

預期輸出：
```
NAME             CLASS     HOSTS        ADDRESS   PORTS   AGE
myapp-ingress    traefik   myapp.local   ...       80      1m
```

如果想在本機測試，加一行 hosts：
```bash
echo "127.0.0.1 myapp.local" | sudo tee -a /etc/hosts
```

然後在 k3s 用 Node IP 直接 curl，minikube 用 `minikube tunnel` 再 curl：
```bash
curl http://myapp.local/          # → Frontend
curl http://myapp.local/api       # → API
```

---

**Step 8：建 HPA**

```bash
kubectl apply -f final-project/08-hpa.yaml
kubectl get hpa -n prod
```

預期輸出：
```
NAME      REFERENCE         TARGETS   MINPODS   MAXPODS   REPLICAS
api-hpa   Deployment/api    5%/50%    3         10        3
```

`TARGETS` 欄位格式是 `現在使用率/目標使用率`。如果顯示 `unknown/50%`，不用緊張，是 metrics-server 還沒收集到數據，等一兩分鐘就會出現數字。

---

**Step 9：建 NetworkPolicy**

```bash
kubectl apply -f final-project/09-networkpolicy.yaml
kubectl get networkpolicy -n prod
```

預期看到三條：`db-policy`、`api-policy`、`frontend-policy`。

驗證 NetworkPolicy 有沒有生效：

```bash
# 從 frontend Pod 連 mysql，應該被擋（如果 CNI 支援 NetworkPolicy）
FRONTEND_POD=$(kubectl get pods -n prod -l app=frontend -o jsonpath='{.items[0].metadata.name}')
kubectl exec $FRONTEND_POD -n prod -- wget -qO- --timeout=3 http://mysql-headless:3306 || echo "連線被擋，NetworkPolicy 生效"

# 從 api Pod 連 mysql，應該通
API_POD=$(kubectl get pods -n prod -l app=api -o jsonpath='{.items[0].metadata.name}')
kubectl exec $API_POD -n prod -- wget -qO- --timeout=3 http://mysql-headless:80 && echo "連線正常"
```

---

**Step 10（選做）：建 RBAC**

```bash
kubectl apply -f final-project/10-rbac.yaml
kubectl get role,rolebinding -n prod

# 測試：只能看，不能刪
kubectl get pods -n prod --as=system:serviceaccount:prod:prod-viewer-sa
kubectl delete pod mysql-0 -n prod --as=system:serviceaccount:prod:prod-viewer-sa
# 預期：Error from server (Forbidden)
```

---

**Step 11：完整驗證**

```bash
kubectl get all -n prod
```

確認清單：
- `statefulset.apps/mysql`，READY `1/1`
- `deployment.apps/api`，READY `3/3`
- `deployment.apps/frontend`，READY `2/2`
- Service：`mysql-headless`、`api-svc`、`frontend-svc`

```bash
kubectl get pvc -n prod          # mysql-data-mysql-0，STATUS Bound
kubectl get ingress -n prod      # myapp-ingress 存在
kubectl get hpa -n prod          # api-hpa，MINPODS 3，MAXPODS 10
kubectl get networkpolicy -n prod # 三條 policy
kubectl get secret -n prod       # mysql-secret
kubectl get configmap -n prod    # api-config
```

全部都有 → 恭喜，12 步做完了。

---

**Step 12（選做）：壓測 + 故障模擬**

壓測觸發 HPA：

```bash
# 終端機 1：跑壓測 Pod
kubectl run load-test -n prod --image=busybox:1.36 --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://api-svc > /dev/null 2>&1; done"

# 終端機 2：觀察 HPA 變化
kubectl get hpa -n prod -w

# 終端機 3：觀察 Pod 數量變化
kubectl get pods -n prod -l app=api -w
```

CPU 超過 50% 之後，REPLICAS 會從 3 開始往上爬。Ctrl+C 停止壓測，等 5 分鐘，REPLICAS 自動縮回 3。

故障模擬，砍一個 API Pod 觀察自我修復：

```bash
# 找一個 API Pod 的名字
kubectl get pods -n prod -l app=api

# 砍掉它
kubectl delete pod <api-pod名> -n prod

# 看 Deployment 自動補回來
kubectl get pods -n prod -l app=api -w
```

幾秒鐘內 Deployment 就會補一個新的 Pod。你不盯著看，你甚至不會知道有 Pod 被刪過。這就是 Deployment 自我修復的威力。

清理：

```bash
kubectl delete namespace prod
kubectl get ns    # 確認 prod 不見了
```

---

### ③ QA

**Q：NetworkPolicy 的 Ingress 和 Ingress Controller 有什麼關係？**

A：完全不同的東西，只是名字碰巧一樣。NetworkPolicy 裡的 `Ingress` 是指「進入 Pod 的網路流量」，是 Layer 3/4 的概念，控制的是 IP 層的進出流量。Ingress Controller（像 Traefik）是 HTTP 路由器，是 Layer 7 的概念，根據 Host 和 Path 來路由 HTTP 請求。NetworkPolicy 管的是 Pod 之間要不要通，Ingress Controller 管的是 HTTP 請求要導去哪個 Service。

**Q：HPA 的 TARGETS 一直是 `unknown`，怎麼排？**

A：兩個常見原因。第一，metrics-server 沒有裝或沒有正常跑。用 `kubectl top pods -n prod` 確認，如果報錯就是 metrics-server 的問題。k3s 通常內建，minikube 要 `minikube addons enable metrics-server`。第二，Deployment 的 Pod 沒有設 `resources.requests.cpu`。HPA 根據實際用量除以 requests 來算百分比，沒有 requests 就算不出來。`kubectl describe hpa api-hpa -n prod` 看 Events 會有更詳細的錯誤。

**Q：壓測停了，HPA 縮容需要等多久？**

A：HPA 縮容有一個冷卻時間，預設是 5 分鐘（`--horizontal-pod-autoscaler-downscale-stabilization`）。目的是防止流量剛降下來又馬上回來，造成 Pod 數量不斷上下抖動。擴容的反應比較快，大概一分鐘內就會加 Pod；縮容故意慢，確保流量真的穩定下來了才縮。

**Q：`kubectl delete namespace prod` 會把 PVC 裡的資料也一起刪掉嗎？**

A：是的。刪 Namespace 會刪底下的所有資源，包含 PVC。但 PVC 和 PV 的關係有分不同的回收策略（`reclaimPolicy`）。`Delete` 策略下，PVC 刪了 PV 也會刪，資料完全清除。`Retain` 策略下，PVC 刪了 PV 還留著，資料還在，需要手動清理。課堂用 local-path StorageClass 預設是 `Delete`，所以 `kubectl delete namespace prod` 之後資料就消失了。生產環境要謹慎確認 reclaimPolicy 設定。

---

## 7-22 回頭操作 Loop 7（~5 min）

### ④ 學員實作

**必做：完成 12 步的後 6 步，驗收整套系統**

前提：你已經完成了 Loop 6 的步驟 1-6，`kubectl get all -n prod` 看得到 MySQL、API、Frontend 都在跑。

現在繼續：

1. 建 Ingress（`07-ingress.yaml`），確認 `kubectl get ingress -n prod` 有 `myapp-ingress`
2. 建 HPA（`08-hpa.yaml`），確認 `kubectl get hpa -n prod` 有 `api-hpa`
3. 建 NetworkPolicy（`09-networkpolicy.yaml`），確認 `kubectl get networkpolicy -n prod` 看到三條 policy
4. 跑完整驗證：`kubectl get all, pvc, ingress, hpa, networkpolicy, secret, configmap -n prod`
5. （選做）壓測：跑 busybox 不斷打 api-svc，用 `kubectl get hpa -n prod -w` 觀察 REPLICAS 增加
6. 清理：`kubectl delete namespace prod`

---

**挑戰：故障注入**

挑戰 1：手動刪一個 Pod，觀察 Deployment 自動補

```bash
# 刪一個 API Pod
kubectl delete pod <任意 api-pod 名> -n prod
# 立刻觀察
kubectl get pods -n prod -l app=api -w
# 問題：新的 Pod 名字和原本的一樣嗎？
```

挑戰 2：修改 YAML 讓 livenessProbe 故意失敗

把 `05-api.yaml` 的 livenessProbe 的 path 改成一個不存在的路徑，讓健康檢查一直失敗：

```yaml
livenessProbe:
  httpGet:
    path: /healthz-this-does-not-exist    # 故意改成不存在的路徑
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3
```

Apply 之後觀察 Pod 的行為：

```bash
kubectl get pods -n prod -l app=api -w
# 問題：Pod 會一直重啟嗎？kubectl describe pod 看到什麼？
kubectl describe pod <api-pod名> -n prod
```

看完之後記得把 livenessProbe 改回正確的路徑，再 apply 一次。

---

### ⑤ 學員實作解答

**必做解答**

```yaml
# 07-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: prod
spec:
  ingressClassName: traefik    # k3s 用 traefik；minikube 用 nginx
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-svc
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 80
```

> 注意：`/api` 的規則要放在 `/` 前面。Ingress Controller 是從上往下匹配的，如果 `/` 放第一個，所有請求（包含 `/api`）都會被 `/` 先匹配到，導致 `/api` 永遠路由不到 API。

```yaml
# 08-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

```yaml
# 09-networkpolicy.yaml
---
# 保護 MySQL：只讓 api 連
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: mysql
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api
    ports:
    - protocol: TCP
      port: 3306
---
# 保護 API：只讓 frontend 連（加上 Ingress Controller）
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 80
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
    ports:
    - protocol: TCP
      port: 80
---
# 保護 Frontend：只讓 Ingress Controller 連
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-policy
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
    ports:
    - protocol: TCP
      port: 80
```

**完整驗證指令**

```bash
kubectl get all -n prod
kubectl get pvc -n prod
kubectl get ingress -n prod
kubectl get hpa -n prod
kubectl get networkpolicy -n prod
kubectl get secret -n prod
kubectl get configmap -n prod
```

**挑戰 1 解答**

刪 Pod 之後新的 Pod 名字格式不同：舊的叫 `api-7d9b5c-abc`，新的叫 `api-7d9b5c-xyz`（後綴隨機）。名字不一樣，但 Deployment 保證副本數維持在 3 個。StatefulSet 的 Pod 名字是固定的（`mysql-0`），這是兩者的差別之一。

**挑戰 2 解答**

livenessProbe 設成不存在的路徑之後，K8s 每次探測都拿到 404（或連不上），連續失敗 `failureThreshold` 次之後會強制重啟 Pod。`kubectl get pods` 會看到 `RESTARTS` 數字一直增加。`kubectl describe pod <name>` 的 Events 區塊會看到：

```
Liveness probe failed: HTTP probe failed with statuscode: 404
```

以及：
```
Container api failed liveness probe, will be restarted
```

這就是 livenessProbe 的作用：K8s 判定容器死了，強制重啟。修正 YAML 後：

```bash
kubectl apply -f final-project/05-api.yaml
kubectl get pods -n prod -l app=api -w
# 等新 Pod 的 RESTARTS 維持在 0，livenessProbe 正常了
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| Ingress 路由順序錯（`/` 放最前面） | `/api` 請求被導到 Frontend | 把 `/api` 的 path 移到 `/` 前面 |
| HPA `TARGETS unknown` | metrics-server 未啟動或 Pod 無 `resources.requests` | `kubectl top pods -n prod` 確認 metrics-server；確認 Deployment 設了 `resources.requests.cpu` |
| NetworkPolicy 寫了但流量還是全通 | CNI 不支援 NetworkPolicy | 確認叢集 CNI；k3s 預設有 network policy controller |

**清理**

```bash
kubectl delete namespace prod
kubectl get ns    # 確認 prod 消失

# 確認 PVC 也一起清掉了（local-path 的 reclaimPolicy 是 Delete）
kubectl get pv    # 應該沒有 prod 相關的 PV 了
```
