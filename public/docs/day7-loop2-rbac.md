# Loop 2 — RBAC 權限控制

---

## 7-5 RBAC 概念 — 誰都能刪 Pod？

**問題：cluster-admin 發給所有人**

你們公司十個開發者全部 cluster-admin，某天實習生跑清理腳本有個 bug：

```
kubectl delete namespace production
```

production namespace 底下所有東西瞬間消失。這在業界真實發生過。

Docker 更糟：連到 Docker Socket 就等於 root，沒有任何權限控制。K8s 至少有 RBAC。

**RBAC 核心邏輯**

誰（Subject）+ 能做什麼（Role）= 綁定（Binding）

三個元素：
- **Subject**：User、Group、或 ServiceAccount（給 Pod 用的身份）
- **Role**：定義允許的操作清單
- **Binding**：把 Role 綁到 Subject 身上

**四個物件**

| 物件 | 範圍 |
|------|------|
| Role | 單一 Namespace |
| ClusterRole | 整個叢集 |
| RoleBinding | 單一 Namespace |
| ClusterRoleBinding | 整個叢集 |

**門禁卡比喻**

Role 是門禁卡（可以進 3 樓研發部），ClusterRole 是萬能卡（所有樓層都能進），RoleBinding 是把卡發給某個員工。不會把萬能卡發給實習生。

**ServiceAccount**

Pod 也需要跟 K8s API Server 溝通。ServiceAccount 是給 Pod 用的身份。每個 Namespace 預設有一個 `default` SA，生產環境建議每個應用建自己的 SA，給最小權限。

**常見企業設計**

- 開發者：dev 完整權限，prod 只讀
- SRE：所有 Namespace 完整權限
- 實習生：dev 只讀，prod 完全禁止
- CI/CD（ArgoCD）：有部署權限，沒有刪除權限

---

## 7-6 RBAC 實作 — 只讀使用者 + 驗證

**建三個資源**

rbac-viewer.yaml 完整內容：

```yaml
# 1. ServiceAccount：代表一個「使用者」身份
apiVersion: v1
kind: ServiceAccount
metadata:
  name: viewer-sa
  namespace: default
---
# 2. Role：定義「能做什麼」
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
  - apiGroups: [""]                          # ★ 重點 1：空字串 = core API group（Pod、Service、ConfigMap）
    resources: ["pods", "services", "configmaps"]
    verbs: ["get", "list", "watch"]          # ★ 重點 2：只能看，沒有 create / update / delete
  - apiGroups: ["apps"]                      # ★ 重點 3：Deployment、ReplicaSet 屬於 apps group
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
---
# 3. RoleBinding：把 Role 綁定到 ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: viewer-binding
  namespace: default
subjects:
  - kind: ServiceAccount
    name: viewer-sa          # ★ 重點 4：綁定到哪個 ServiceAccount
    namespace: default
roleRef:
  kind: Role
  name: pod-viewer           # ★ 重點 5：綁定哪個 Role，name 要完全一致
  apiGroup: rbac.authorization.k8s.io
```

**重點介紹**

- **`apiGroups: [""]`**：空字串代表 core API group，包含 Pod、Service、ConfigMap、Secret 等基礎資源。Deployment 屬於 `apps` group，要另外列一條 rule
- **`verbs`**：只有 get / list / watch，沒有 create / update / delete。這就是最小權限原則，只給看的權利
- **`subjects`**：綁定對象是 ServiceAccount，kind 要寫 ServiceAccount，namespace 要和 SA 所在的 namespace 一致。`subjects` 是陣列，可以同時綁多個 SA 到同一個 Role：

  ```yaml
  subjects:
    - kind: ServiceAccount
      name: viewer-sa
      namespace: default
    - kind: ServiceAccount
      name: another-sa
      namespace: default
  ```

  反過來，一個 RoleBinding 只能綁一個 Role（`roleRef` 只能一個）。**多個 SA 要同一個 Role → 一個 RoleBinding 搞定。一個 SA 要多個 Role → 要建多個 RoleBinding。**

- **`roleRef`**：一旦建好就不能改，要改只能刪掉 RoleBinding 重建。name 打錯字就綁不上去。`apiGroup: rbac.authorization.k8s.io` 是固定寫法，告訴 K8s 這個 Role 屬於 RBAC 這個 API 群組，不能省略也不能改

**部署**

```bash
kubectl apply -f rbac-viewer.yaml
```

你會看到三行輸出：`serviceaccount/viewer-sa created`、`role.rbac.authorization.k8s.io/pod-viewer created`、`rolebinding.rbac.authorization.k8s.io/viewer-binding created`。三個資源一次建好。

```bash
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding
```

確認三個資源都存在。

**驗證：--as 旗標模擬身份**

`--as` 可以模擬用其他身份操作，不需要真的切換 kubeconfig。格式固定是 `system:serviceaccount:namespace:名稱`。

```bash
kubectl get pods --as=system:serviceaccount:default:viewer-sa
```

成功，可以看到 Pod 列表。因為 pod-viewer 的 verbs 有 get 和 list，這個操作被允許。

```bash
kubectl delete pod <Pod名稱> --as=system:serviceaccount:default:viewer-sa
```

`<Pod名稱>` 換成你實際的 Pod 名稱（從上面 get pods 的輸出複製）。你會看到 `Error from server (Forbidden)`。被拒了，因為 Role 的 verbs 只有 get、list、watch，沒有 delete。

```bash
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa
```

一樣被拒。`cannot create resource "pods"`。沒有 create 權限。

**快速確認權限**

```bash
kubectl auth can-i get pods --as=system:serviceaccount:default:viewer-sa
kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa
kubectl auth can-i --list --as=system:serviceaccount:default:viewer-sa
```

依序回傳 `yes`、`no`、以及這個身份能做的所有事清單。

**QA**

> Q：--as 格式一直報錯？

要寫完整：`system:serviceaccount:default:viewer-sa`，不能只寫 `viewer-sa`。namespace 要對應 SA 所在的 namespace。

> Q：建了 RoleBinding 但 --as 還是 Forbidden？

最常見是 Role 和 SA 不在同一個 Namespace。三個東西（Role、RoleBinding、SA）的 Namespace 要配對。另一個原因是 roleRef.name 打錯字。

> Q：ClusterRole 可以用 RoleBinding 綁嗎？

可以。RoleBinding 綁 ClusterRole，那個 ClusterRole 的權限只在 RoleBinding 所在的 Namespace 有效。這是常用技巧：用 ClusterRole 定義通用規則，各 Namespace 的 RoleBinding 分別發給不同的人。

---

## 7-7 學員實作 + 常見坑

**必做題**

建 ServiceAccount、Role、RoleBinding。用 --as 模擬，確認 get pods 成功，delete pod 被拒。

**挑戰題**

自己寫新 Role，允許 get、list、create、update、delete deployments，但不能碰 secrets。建新 SA 綁上去，用 --as 測試。

提示：rules 可以寫多條：

```yaml
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "delete"]
```

**常見坑**

- 坑 1：--as 格式 → 要寫 `system:serviceaccount:default:viewer-sa`，不能只寫 SA 名稱
- 坑 2：Role 和 SA 不同 Namespace → 三個物件的 namespace 要一致
- 坑 3：RoleBinding 的 roleRef.name 打錯 → name 要跟 Role 名字完全一樣，apiGroup 固定是 `rbac.authorization.k8s.io`

**Loop 2 因果鏈**

誰都能刪，實習生一個指令毀掉 production → RBAC 根據角色分配最小權限，誰能看、誰能改、誰能刪，分明清楚。

---

## 進階：真的發一份 kubeconfig 給別人

`--as` 是管理員模擬測試用，實際環境要給別人獨立的 kubeconfig，對方用那份登入就只有對應的權限。

**Step 1：產生 token**

```bash
TOKEN=$(kubectl create token viewer-sa --duration=8760h)
```

`--duration=8760h` 是一年，可以依需求調整。

**Step 2：取得 cluster 資訊**

```bash
CLUSTER_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
CA_DATA=$(kubectl config view --minify --raw -o jsonpath='{.clusters[0].cluster.certificate-authority-data}')
```

**Step 3：組成 kubeconfig**

```bash
cat > /tmp/viewer-sa.kubeconfig << EOF
apiVersion: v1
kind: Config
clusters:
- name: k3s
  cluster:
    server: $CLUSTER_SERVER
    certificate-authority-data: $CA_DATA
users:
- name: viewer-sa
  user:
    token: $TOKEN
contexts:
- name: viewer-sa@k3s
  context:
    cluster: k3s
    user: viewer-sa
current-context: viewer-sa@k3s
EOF
```

**Step 4：把 127.0.0.1 換成 master 實際 IP（給外部使用者用）**

```bash
sed -i 's|https://127.0.0.1:6443|https://192.168.43.133:6443|' /tmp/viewer-sa.kubeconfig
```

`127.0.0.1` 只有在 master 本機才能用。要給別人就要換成 master 的實際 IP，對方才能連到。

**Step 5：用這份 kubeconfig 測試**

```bash
# 成功（有 get 權限）
kubectl --kubeconfig=/tmp/viewer-sa.kubeconfig get pods

# 失敗（沒有 delete 權限）
kubectl --kubeconfig=/tmp/viewer-sa.kubeconfig delete pod <任意名稱>
```

第一行成功，第二行回 `Forbidden`，代表這份 kubeconfig 真的只有你給的權限。

把 `/tmp/viewer-sa.kubeconfig` 複製給對方，他們 `export KUBECONFIG=/path/to/viewer-sa.kubeconfig` 後所有 kubectl 操作都受 RBAC 限制。
