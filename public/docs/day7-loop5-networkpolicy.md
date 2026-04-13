# Day 7 Loop 5 — NetworkPolicy 網路隔離

---

## 7-14 NetworkPolicy 概念（~15 min）

### ① 課程內容

📄 7-14 第 1 張

上一個 Loop，RBAC 管住了「人」。開發人員只能看不能刪，實習生碰不到生產環境。人的問題解決了。

但是 Pod 之間呢？

K8s 預設的網路策略是**全通**。叢集裡面所有的 Pod，不管在哪個 Namespace，不管掛什麼 label，都可以互相通訊。前端 Pod 可以連 API Pod，API Pod 可以連 MySQL Pod。這很合理。

問題是：前端 Pod 也可以直接連 MySQL Pod。

前端為什麼需要直連資料庫？正常架構下不需要。前端只需要連 API，API 再去連資料庫。但預設情況下，K8s 不會阻止這件事。

---

📄 7-14 第 2 張

**這有什麼問題？**

假設前端 Pod 有一個安全漏洞，被攻擊者入侵了。如果網路全通，攻擊者可以從前端 Pod 直接連到資料庫，讀取或修改資料。

這叫**橫向移動**，是安全攻擊裡最常見的手法之一。入侵一個弱點，在內部網路裡橫著走，一路打到高價值目標。

Docker 有 network 隔離的概念。你建 frontend-net 和 backend-net，把前端放 frontend-net，資料庫放 backend-net，不同 network 不能互連。

K8s 的做法比 Docker 更靈活，叫 **NetworkPolicy**。NetworkPolicy 是 Pod 等級的防火牆，比 Docker 的 network 隔離更精細。Docker 的隔離是以整個 network 為單位，K8s 可以做到以單個 Pod 為單位。

---

📄 7-14 第 3 張

**NetworkPolicy 的 YAML 結構**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
spec:
  podSelector:         # ① 這條規則套用在哪些 Pod 上
    matchLabels:
      role: database
  policyTypes:         # ② 管哪個方向
    - Ingress          # 只管進來的流量
  ingress:             # ③ 允許哪些流量進來
    - from:
        - podSelector:
            matchLabels:
              role: api    # 只允許帶 role=api label 的 Pod
      ports:
        - protocol: TCP
          port: 3306       # 只允許 MySQL port
```

翻譯成白話：資料庫只接受 API 的連線，而且只接受 3306 port。其他任何 Pod 想連資料庫的任何 port，全部擋掉。

---

📄 7-14 第 4 張

**容易混淆的點：NetworkPolicy 的 Ingress ≠ Ingress Controller**

| | NetworkPolicy 的 Ingress | Ingress Controller |
|---|---|---|
| 是什麼 | 「進入 Pod 的網路流量」方向 | HTTP 路由器 |
| 層級 | Layer 3 / Layer 4（IP + Port） | Layer 7（HTTP 路徑、域名） |
| 典型用途 | 控制哪些 Pod 可以互連 | 把外部請求導到不同 Service |

名字碰巧一樣，概念完全不同。不要搞混。

---

📄 7-14 第 5 張

**很重要的觀念：套了 NetworkPolicy 到底鎖了什麼？**

NetworkPolicy 是看你宣告哪個方向：

- 某個 Pod 被帶有 `Ingress` 的 policy 選中 → 它的 **ingress（進來的流量）** 變成白名單模式
- 某個 Pod 被帶有 `Egress` 的 policy 選中 → 它的 **egress（出去的流量）** 變成白名單模式
- 只寫 Ingress，不會順便把 Egress 也鎖住；反過來也一樣

沒有被任何 NetworkPolicy 選中的 Pod，進出流量照舊全通。

---

📄 7-14 第 6 張

**實務注意：NetworkPolicy 要 CNI 配合才會生效**

NetworkPolicy 是 K8s 的 API 規格，但實際執行要靠底層網路外掛（CNI）。

| CNI | 支援 NetworkPolicy |
|-----|--------------------|
| Calico | 支援 |
| Cilium | 支援 |
| Weave | 支援 |
| Flannel（純 Flannel） | 不支援 |
| k3s 預設 | 有 network policy controller，通常支援 |

如果你 `apply` 成功但流量還是全通：
1. 先確認叢集用哪個 CNI
2. 再檢查 selector、policyTypes 和 ports 有沒有寫對

---

## 7-15 NetworkPolicy 實作（~12 min）

### ② 所有指令＋講解

**Step 1：部署三個服務（frontend / api / database）**

```bash
kubectl apply -f networkpolicy-lab.yaml
```

這個 YAML 裡面有三個 Deployment 和三個 Service，都用 nginx 來模擬，差別只是 label：

| Pod | label | Service |
|-----|-------|---------|
| frontend | `role: frontend` | frontend-svc |
| api | `role: api` | api-svc |
| database | `role: database` | db-svc |

確認 Pod 都跑起來：

```bash
kubectl get pods -l "role in (frontend,api,database)"
```

預期：全部 `Running`。

```bash
kubectl get svc
```

預期：frontend-svc、api-svc、db-svc 三個 ClusterIP Service。

---

**Step 2：驗證預設全通（還沒套 NetworkPolicy）**

先取 frontend Pod 和 api Pod 的名字：

```bash
FRONTEND_POD=$(kubectl get pods -l role=frontend -o jsonpath='{.items[0].metadata.name}')
API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')
```

從 frontend 連 database：

```bash
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80
```

預期：看到 nginx 歡迎頁面 → 全通，frontend 可以連 database。這在安全架構下不應該被允許。

從 api 連 database：

```bash
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80
```

預期：也有回應 → api 能連 database，這是合理的。

---

**Step 3：套上 NetworkPolicy**

```bash
kubectl apply -f networkpolicy-db-only-api.yaml
```

NetworkPolicy 的內容：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
spec:
  podSelector:
    matchLabels:
      role: database
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api
      ports:
        - protocol: TCP
          port: 80
```

確認 NetworkPolicy 建好了：

```bash
kubectl get networkpolicy
```

預期輸出：
```
NAME               POD-SELECTOR     AGE
db-allow-api-only  role=database    5s
```

`POD-SELECTOR` 顯示 `role=database`，表示這條規則套在 database Pod 上。

---

**Step 4：驗證隔離效果**

api 連 database（應該通）：

```bash
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80
```

還是有回應。api Pod 帶 `role=api` label，在允許清單裡面。

frontend 連 database（如果 CNI 支援，應該被擋）：

```bash
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80
```

如果 CNI 支援 NetworkPolicy：3 秒後 timeout，因為 frontend Pod 帶 `role=frontend`，不在允許清單。

如果 CNI 不支援：還是有回應也沒關係，概念你已經理解了。

---

**Step 5：確認 frontend 連 api 不受影響**

```bash
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://api-svc:80
```

預期：有回應。因為 NetworkPolicy 只套在 database Pod 上，api Pod 沒有任何 NetworkPolicy，所以 frontend 連 api 不受影響。

這就是效果：database 被保護起來，只有 api 能連。三層架構的網路隔離。

---

**排錯**

```bash
kubectl describe networkpolicy db-allow-api-only
# 確認 PodSelector 和 Ingress 規則正確

kubectl get pods --show-labels
# 確認 Pod 的 label 跟 NetworkPolicy 裡寫的一致

# 如果流量照通，確認 CNI
kubectl get pods -n kube-system | grep -E "calico|cilium|weave|flannel"
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| CNI 不支援 NetworkPolicy | apply 成功但流量全通 | 確認 CNI 版本，或換用 `minikube start --cni=calico` |
| podSelector 的 label 寫錯 | policy 存在但沒有套到任何 Pod | `kubectl get pods --show-labels` 確認 Pod label 和 NetworkPolicy 裡寫的完全一致 |
| 忘了寫 policyTypes | K8s 自動推斷，行為不直觀 | 明確寫 `policyTypes: [Ingress]` 或 `[Egress]` 或兩者都寫 |

---

### ③ QA

**Q：NetworkPolicy 只管某個方向（比如只寫 Ingress），另一個方向會怎樣？**

A：只寫 Ingress 的話，只有進入 database Pod 的流量被管控，出去的流量（Egress）不受影響，照舊全通。反過來也一樣。兩個方向都想管，就要在 `policyTypes` 裡同時寫 `Ingress` 和 `Egress`，並且分別設定 `ingress` 和 `egress` 區塊的規則。

**Q：`podSelector` 和 `namespaceSelector` 有什麼差？什麼時候用哪個？**

A：`podSelector` 是用 Pod 的 label 來篩選，只匹配同一個 Namespace 裡面的 Pod。`namespaceSelector` 是用 Namespace 的 label 來篩選，可以跨 Namespace。如果要允許另一個 Namespace 的 Pod 連進來，要用 `namespaceSelector`，或者用 `namespaceSelector` 加 `podSelector` 的組合。只用 `podSelector` 預設只看同一個 Namespace。

**Q：如果我想要「拒絕所有進入流量」，怎麼寫？**

A：建一個 `podSelector: {}` 搭配 `policyTypes: [Ingress]` 但沒有 `ingress` 區塊的 NetworkPolicy。空的 podSelector 選中 Namespace 裡所有的 Pod，沒有 ingress 規則表示白名單是空的，等於全部拒絕。這是做「預設拒絕全部，再用白名單開放」這個模式的起手式。

**Q：NetworkPolicy 可以用 port name 而不是 port number 嗎？**

A：可以。`port` 欄位可以填數字（例如 `3306`）也可以填 Service 的 port name（例如 `mysql`）。用 port name 的好處是，之後改 port number 只要改一個地方，NetworkPolicy 不用跟著改。但要確認對應的 Pod spec 裡面的 `containerPort` 有設 `name` 欄位，名字一致才能匹配。

---

## 7-16 回頭操作 Loop 5（~5 min）

### ④ 學員實作

**必做：建立三服務網路隔離**

用 NetworkPolicy 保護 database，讓只有 api 能連，frontend 不能連：

1. 先確認沒有 NetworkPolicy 時，frontend 和 api 都能連到 database（全通驗證）
2. 套上 NetworkPolicy：只允許帶 `role=api` label 的 Pod 透過 port 3306 連進 database
3. 驗證：
   - `kubectl exec <api-pod> -- wget ... http://db-svc:3306` → 成功（或連線重設，代表到達了但 port 不是 HTTP）
   - `kubectl exec <frontend-pod> -- wget ... http://db-svc:3306` → timeout，被擋了
   - `kubectl exec <frontend-pod> -- wget ... http://api-svc:80` → 還是通的（api 沒有被 NetworkPolicy 保護）

---

**挑戰：加 egress 規則限制 database 對外**

在 database Pod 上加一條 egress 規則，讓 database Pod 只能對外連到 api Pod（port 80），不能連到外網。

提示：在同一個 NetworkPolicy 或新建一個 NetworkPolicy，`policyTypes` 加入 `Egress`，`egress` 區塊用 `podSelector` 指定目標是 `role=api`。

---

### ⑤ 學員實作解答

**必做解答**

```yaml
# networkpolicy-student.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-allow-api-only
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: database
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: api
      ports:
        - protocol: TCP
          port: 3306
```

```bash
kubectl apply -f networkpolicy-student.yaml

# 取 Pod 名字
FRONTEND_POD=$(kubectl get pods -l role=frontend -o jsonpath='{.items[0].metadata.name}')
API_POD=$(kubectl get pods -l role=api -o jsonpath='{.items[0].metadata.name}')

# api 連 database（成功，或連線被重設表示到達了）
kubectl exec $API_POD -- wget -qO- --timeout=3 http://db-svc:80

# frontend 連 database（timeout = 被擋）
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://db-svc:80

# frontend 連 api（還是通的，api 沒有 NetworkPolicy）
kubectl exec $FRONTEND_POD -- wget -qO- --timeout=3 http://api-svc:80
```

---

**挑戰解答（egress 限制）**

```yaml
# networkpolicy-db-egress.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-egress-restrict
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: database
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              role: api
      ports:
        - protocol: TCP
          port: 80
```

```bash
kubectl apply -f networkpolicy-db-egress.yaml

# 確認 database Pod 不能連外網
DB_POD=$(kubectl get pods -l role=database -o jsonpath='{.items[0].metadata.name}')
kubectl exec $DB_POD -- wget -qO- --timeout=3 http://google.com
# timeout = 對外連線被擋

# 確認 database 可以連 api（egress 規則允許）
kubectl exec $DB_POD -- wget -qO- --timeout=3 http://api-svc:80
# 有回應
```

---

**三個坑**

1. podSelector label 打錯 → NetworkPolicy 存在但完全沒有套到任何 Pod，流量照通。用 `kubectl get pods --show-labels` 確認 Pod 的實際 label，跟 NetworkPolicy 裡寫的對比
2. 忘了 policyTypes 裡加 Egress → 只寫 egress 區塊但沒有在 policyTypes 申告，K8s 不一定會生效（行為視版本而定）。明確在 policyTypes 裡寫 `Egress` 才保險
3. CNI 不支援就算了，先換環境 → 如果叢集 CNI 不支援 NetworkPolicy，apply 看起來成功，但流量根本不受控。先用 `kubectl get pods -n kube-system --show-labels` 確認 CNI 類型，再決定要不要換 `minikube start --cni=calico`

**清理**

```bash
kubectl delete -f networkpolicy-student.yaml
kubectl delete -f networkpolicy-db-egress.yaml
kubectl delete -f networkpolicy-lab.yaml
kubectl get networkpolicy    # 應該空的
kubectl get pods             # 確認相關 Pod 都清掉了
```
