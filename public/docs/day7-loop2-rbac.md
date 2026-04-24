# Loop 2 — RBAC 權限控制

---

## 7-5 RBAC 概念（5 分鐘純概念）

### 誰都能刪 Pod 的慘案

你們公司十個開發者全部 `cluster-admin`，某天實習生跑清理腳本有個 bug：

```
kubectl delete namespace production
```

production namespace 底下所有東西瞬間消失。這在業界真實發生過。

Docker 更糟：連到 Docker Socket 就等於 root，沒有任何權限控制。K8s 至少有 RBAC。

### RBAC 核心邏輯

**誰（Subject）+ 能做什麼（Role）= 綁定（Binding）**

三個元素：
- **Subject**：User、Group、或 ServiceAccount（給 Pod 用的身份）
- **Role**：定義允許的操作清單
- **Binding**：把 Role 綁到 Subject 身上

### 四個物件

| 物件 | 範圍 |
|------|------|
| Role | 單一 Namespace |
| ClusterRole | 整個叢集 |
| RoleBinding | 單一 Namespace |
| ClusterRoleBinding | 整個叢集 |

**門禁卡比喻**：Role 是門禁卡（可以進 3 樓研發部），ClusterRole 是萬能卡（所有樓層都能進），RoleBinding 是把卡發給某個員工。不會把萬能卡發給實習生。

### ServiceAccount

Pod 也需要跟 K8s API Server 溝通。ServiceAccount 是給 Pod 用的身份。每個 Namespace 預設有一個 `default` SA，生產環境建議每個應用建自己的 SA，給最小權限。

**但 ServiceAccount 不只給 Pod 用**：也可以給**真人工程師**當身份。下一段我們就要把一個 SA 包成 kubeconfig，發給新同事 Alice 用。

### 常見企業設計

- 開發者：自己的 dev namespace 完整權限，prod 只讀
- SRE：所有 Namespace 完整權限
- 實習生：dev 只讀，prod 完全禁止
- CI/CD（ArgoCD）：有部署權限，沒有刪除權限

### Default Deny 原則

**RBAC 預設拒絕 — 沒寫 = 沒權限**。跟防火牆相反：防火牆預設全通，你要一條一條擋；RBAC 預設全擋，你要一條一條開。所以寫 Role 的時候你不用寫「不能碰 Secret」— 你不列它，它就碰不到。

---

## 7-6 RBAC 實戰：產 kubeconfig 給 Alice（約 15 分鐘）

### 情境開場

公司來了新工程師 Alice。她要：
- 有自己的 namespace `dev-alice` 練習部署
- 不能碰到 default / kube-system / production 任何 namespace
- 不能看 cluster 層級資源（node、pv）
- 拿到一份 kubeconfig 檔案，在自己電腦 `export KUBECONFIG` 就能連叢集

我們示範完整七步驟，做完她就能上班。

---

### Part 1：建 namespace + ServiceAccount

```
指令：kubectl create namespace dev-alice
指令：kubectl create serviceaccount dev-alice -n dev-alice
```

**要點**：
- SA 建在 `dev-alice` 這個 ns 裡（不是 default）
- 身份字串會是 `system:serviceaccount:dev-alice:dev-alice` — 格式固定 `system:serviceaccount:<ns>:<sa>`

---

### Part 2：建 Role

```bash
cat > rbac-alice.yaml << 'EOF'
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer-role
  namespace: dev-alice
rules:
  - apiGroups: [""]                          # ★ 空字串 = core API group（Pod、Service、ConfigMap）
    resources: ["pods", "services", "configmaps"]
    verbs: ["get", "list", "watch", "create", "update", "delete"]
  - apiGroups: ["apps"]                      # ★ Deployment 屬於 apps group
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch", "create", "update", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: alice-dev-binding
  namespace: dev-alice
subjects:
  - kind: ServiceAccount
    name: dev-alice
    namespace: dev-alice
roleRef:
  kind: Role
  name: developer-role
  apiGroup: rbac.authorization.k8s.io
EOF
```

**重點**：
- Alice 在自己的 ns 有完整開發權限（CRUD）
- **Secret 沒列** → 她看不到密碼（最小權限原則）
- `apiGroups: [""]` 是 core group（Pod、Service、ConfigMap、Secret）
- `apiGroups: ["apps"]` 是 apps group（Deployment、ReplicaSet）
- `roleRef` 一旦建好不能改，要改只能砍掉重建

```
指令：kubectl apply -f rbac-alice.yaml
指令：kubectl get role,rolebinding -n dev-alice
```

---

### Part 3：`--as` 快速驗 Role 生效

在產 kubeconfig 之前，先用 admin 身份模擬 Alice 確認 Role 設定正確。`--as` 格式固定 `system:serviceaccount:<ns>:<sa>`。

```
指令：kubectl auth can-i get pods --as=system:serviceaccount:dev-alice:dev-alice -n dev-alice
```

回 `yes`，代表 Role 有 get pods 的權限。

```
指令：kubectl auth can-i get secrets --as=system:serviceaccount:dev-alice:dev-alice -n dev-alice
```

回 `no`，代表 Role 沒給 secrets，被擋掉。

```
指令：kubectl auth can-i --list --as=system:serviceaccount:dev-alice:dev-alice -n dev-alice
```

列出 Alice 能做的所有事 — 稽核神器。

輸出的每一行代表一條「允許規則」，分三欄解讀：
- **Resources**（左欄）：資源類型，例如 `pods`、`deployments.apps`
- **Resource Names**（中欄）：空 `[]` 代表所有資源，有值才代表限定某個名稱
- **Verbs**（右欄）：允許的動作，例如 `[get list watch create update delete]`

所以 `pods  []  []  [get list watch create update delete]` 就是說：Alice 可以對 dev-alice namespace 裡所有 Pod 做 get、list、watch、create、update、delete。

最底下一堆 Non-Resource URLs（`/api`、`/healthz`、`/version` 等）是 k8s 給所有 SA 的最低權限，不是 Role 給的，不用管它。

**為什麼用 `auth can-i` 而不是 `kubectl get pods --as=...`？**
- `auth can-i` 只問不做，安全。
- `--as` 會真的執行動作，測 delete 的話會真的刪到東西。

---

### Part 4：抓 cluster 資訊

```
指令：VM_IP=$(hostname -I | awk '{print $1}')
指令：CLUSTER_SERVER="https://${VM_IP}:6443"
指令：CA_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')
```

這三個值是產生 kubeconfig 的原料。`CLUSTER_SERVER` 直接用 VM 對外 IP 組出來，後面塞進 kubeconfig 就不需要再 sed 替換。`CA_DATA` 是 TLS 憑證。

這幾行只是把值存進 shell 變數，**畫面不會有輸出**。用 echo 確認：

```
指令：echo "Server: $CLUSTER_SERVER"
指令：echo "CA 長度: ${#CA_DATA}"
```

預期 `Server: https://192.168.43.133:6443`（VM 的實際 IP）、CA 長度 > 1000。

**k3s 備援**：如果 `CA_DATA` 是空的，直接從檔案讀：

```
指令：if [ -z "$CA_DATA" ]; then CA_DATA=$(sudo cat /var/lib/rancher/k3s/server/tls/server-ca.crt | base64 -w 0); fi
```

---

### Part 5：產 Token

```
指令：TOKEN=$(kubectl create token dev-alice -n dev-alice --duration=8760h)
指令：echo "${TOKEN:0:40}..."
```

**要點**：
- `--duration=8760h` = 1 年（看 API Server 上限，預設最長 8760h）
- K8s 1.24+ 預設不自動產 Token Secret，要用 `kubectl create token` 即席產生

> 不確定版本？用這個查：
> ```
> 指令：kubectl version
> ```
> 看 `Server Version`，例如 `v1.34.6+k3s1`，超過 1.24 就要用 create token。
- 要永久用 → 手動建 `type: kubernetes.io/service-account-token` 的 Secret

---

### Part 6：組 kubeconfig

```
指令：cat > alice-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: dev-alice
  user:
    token: $TOKEN
contexts:
- name: alice@k3s
  context:
    cluster: k3s
    user: dev-alice
    namespace: dev-alice
current-context: alice@k3s
EOF
```

kubeconfig 的三個區塊是「分開定義、再用 context 綁在一起」的設計：
- **clusters**：API Server 在哪（位址 + CA 憑證）
- **users**：誰要連（名稱 + Token）
- **contexts**：把上面兩個配對，`cluster: k3s` + `user: dev-alice` + `namespace: dev-alice` → 一個叫 `alice@k3s` 的組合
- **current-context**：預設用哪個 context，這裡填 `alice@k3s`，所以 kubectl 一執行就自動用 Alice 的身份

名字（`k3s`、`dev-alice`、`alice@k3s`）都是你自己取的，只要 clusters/users/contexts 三個地方對得上就好。

`$CLUSTER_SERVER` 在 Part 4 已經設成 VM 對外 IP，所以這裡直接帶入，不需要事後 sed。

---

### Part 7：切身份驗收

把 alice-kubeconfig.yaml 傳給 Alice。她在自己電腦（或我們現場用同一台機器 export 模擬）：

為什麼不用 `export KUBECONFIG`？master 上 `~/.kube/config` 已有 `default` context，export 會把兩個檔 merge，`default` 蓋掉 `alice@k3s`，結果還是 admin 身份。用 `--kubeconfig` 直接指定檔案，完全不碰 `~/.kube/config`。

```
指令：unset KUBECONFIG
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml auth whoami
```

應該回 `system:serviceaccount:dev-alice:dev-alice`，確認是 Alice 才繼續。

**✓ 自己的 ns 完整權限**：
```
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml get pods
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml run mypod --image=nginx
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml get pods
```

**✗ 其他 ns 全擋**：
```
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml get pods -n kube-system
```

回 `Forbidden`。

**✗ 不能讀 Secret**：
```
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml get secret
```

回 `Forbidden`。

**✗ cluster 層級擋**：
```
指令：kubectl --kubeconfig=/home/user/alice-kubeconfig.yaml get nodes
```

回 `Forbidden`。

**切回 admin（什麼都不用做，直接打）**：
```
指令：kubectl get nodes
指令：kubectl get nodes
```

回到全權。

### 常見坑

- **坑 1**：`--as` 格式錯 → 要寫 `system:serviceaccount:default:viewer-sa`，不能只寫 SA 名稱
- **坑 2**：Role 和 SA 不同 namespace → 三個物件（Role、RoleBinding、SA）的 namespace 要一致
- **坑 3**：`roleRef.name` 打錯 → name 要跟 Role 名字完全一樣，`apiGroup` 固定是 `rbac.authorization.k8s.io`
- **坑 4**：k3s 的 `certificate-authority-data` 抓出來是空的 → 用 Part 4 的 if 備援從檔案讀
- **坑 5**：kubeconfig 沒換 IP → 給 Alice 的 kubeconfig 不能用 `127.0.0.1`，要換成 master 實際 IP

---

## 7-7 學員實作（10 分鐘）

### 題目場景

backend 團隊新人要一個受限帳號叫 `backend-dev`。建 namespace + RBAC，產 kubeconfig，自己切身份驗證。

### 必做題要求

- namespace: `backend-team`
- SA: `backend-dev`
- 權限：
  - ✓ 能 get / list / watch pods + services + configmaps + deployments
  - ✗ 不能碰 secrets
  - ✗ 不能 delete / create / update 任何東西（只讀）
- 產 `backend-kubeconfig.yaml`、`export KUBECONFIG` 切身份驗證

### 驗收條件

- ✓ `kubectl get pods` 有結果（空列表也算）
- ✗ `kubectl get secret` → Forbidden
- ✗ `kubectl delete pod xxx` → Forbidden
- ✗ `kubectl get pods -n default` → Forbidden（跨 ns 被擋）

### 完整指令清單（照著打）

```bash
# ─── Part 1：建 namespace + SA ───
kubectl create namespace backend-team
kubectl create serviceaccount backend-dev -n backend-team

# ─── Part 2：建 Role + RoleBinding ───
cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: backend-dev-role
  namespace: backend-team
rules:
  - apiGroups: [""]
    resources: ["pods", "services", "configmaps"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: backend-dev-binding
  namespace: backend-team
subjects:
  - kind: ServiceAccount
    name: backend-dev
    namespace: backend-team
roleRef:
  kind: Role
  name: backend-dev-role
  apiGroup: rbac.authorization.k8s.io
EOF

# 檢查三個物件
kubectl get sa,role,rolebinding -n backend-team

# ─── Part 3：--as 快速驗權限 ───
kubectl auth can-i get pods --as=system:serviceaccount:backend-team:backend-dev -n backend-team
# → yes

kubectl auth can-i get secrets --as=system:serviceaccount:backend-team:backend-dev -n backend-team
# → no

# ─── Part 4：抓 cluster 資訊 ───
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CA_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')
if [ -z "$CA_DATA" ]; then
  CA_DATA=$(sudo cat /var/lib/rancher/k3s/server/tls/server-ca.crt | base64 -w 0)
fi

# ─── Part 5：產 Token ───
TOKEN=$(kubectl create token backend-dev -n backend-team --duration=8760h)

# ─── Part 6：組 kubeconfig ───
cat > backend-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: backend-dev
  user:
    token: $TOKEN
contexts:
- name: backend-dev@k3s
  context:
    cluster: k3s
    user: backend-dev
    namespace: backend-team
current-context: backend-dev@k3s
EOF

sed -i 's|https://127.0.0.1:6443|https://192.168.43.133:6443|' backend-kubeconfig.yaml

# ─── Part 7：切身份驗收 ───
export KUBECONFIG=$PWD/backend-kubeconfig.yaml

kubectl get pods                    # ✓ 空列表
kubectl get secret                  # ✗ Forbidden
kubectl delete pod any-name         # ✗ Forbidden
kubectl get pods -n default         # ✗ Forbidden（跨 ns）

unset KUBECONFIG                    # 切回 admin

# ─── Part 8：清理 ───
kubectl delete namespace backend-team
rm backend-kubeconfig.yaml
```

### 挑戰題

加一個 `sre-user`，給他整個 cluster 的完整權限（用 `ClusterRole` + `ClusterRoleBinding` 綁 `cluster-admin`），對照組感受 RBAC 兩端的差異。

### Loop 2 因果鏈

誰都能刪，實習生一個指令毀掉 production → RBAC 根據角色分配最小權限，誰能看、誰能改、誰能刪，分明清楚 → ServiceAccount 不只給 Pod，也能包成 kubeconfig 發給真人工程師 → 每個人被鎖在自己的 namespace + 最小權限 sandbox → 炸也只炸自己的。

---

## 清理（Loop 2 結束）

```
指令：kubectl delete namespace dev-alice
指令：kubectl delete namespace backend-team
指令：rm -f alice-kubeconfig.yaml backend-kubeconfig.yaml
```

下一段：Loop 3 Probe 健康檢查。
