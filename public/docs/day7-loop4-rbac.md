# Day 7 Loop 4 — RBAC 權限控制

---

## 7-11 RBAC 概念（~5 min）

### ① 課程內容

📄 7-11 第 1 張

場景：你們公司來了一個實習生，第一天上班，好奇心旺盛，在終端機裡打了這行：

```bash
kubectl delete namespace production
```

所有的 Pod、Service、ConfigMap、PVC 全部消失。Production 環境砍掉了。

這不是假設。K8s 預設的情況就是這樣，只要你能連到叢集，你就可以做任何事。

這個問題 Docker 更糟。Docker 根本沒有內建的權限控制。只要你能連到 Docker Socket，你就等於 root。K8s 至少提供了一套完整的機制來解這個問題，叫 RBAC。

---

📄 7-11 第 2 張

RBAC，全名 Role-Based Access Control，中文叫基於角色的存取控制。

核心邏輯只有一句話：**誰 + 能做什麼 = 綁定**。

拆開來說：

| 元素 | 英文 | 代表 |
|------|------|------|
| 誰 | Subject | User、Group、或 ServiceAccount |
| 能做什麼 | Role | 允許的操作清單 |
| 綁定 | Binding | 把 Role 發給 Subject |

RBAC 有四個物件，兩兩一對：

| 物件 | 作用範圍 | 職責 |
|------|---------|------|
| Role | 單一 Namespace | 定義能對什麼資源做什麼動作 |
| ClusterRole | 整個叢集 | 同上，但跨 Namespace |
| RoleBinding | 單一 Namespace | 把 Role 綁到某人身上 |
| ClusterRoleBinding | 整個叢集 | 把 ClusterRole 綁到某人身上 |

用門禁卡來比喻。Role 是張只能進 3 樓研發部的門禁卡。ClusterRole 是萬能卡，所有樓層都能進。RoleBinding 是把這張卡發給某個員工。ClusterRoleBinding 是把萬能卡發給某個員工。

你不會把萬能卡發給每個實習生。但我們現在的叢集就是在做這件事。

---

📄 7-11 第 3 張

再講一個重要概念：**ServiceAccount**。

剛才說的 User 和 Group 是給人用的。但 Pod 也需要跟 K8s API Server 溝通。比如監控工具需要列出所有 Pod 的狀態，自動化工具需要建立或刪除資源。Pod 不是人，它的身份用的是 ServiceAccount。

每個 Namespace 預設都有一個叫 `default` 的 ServiceAccount。建 Pod 時不指定，Pod 就自動用 `default`。

生產環境的最佳實踐：每個應用建自己的 ServiceAccount，用 RBAC 給它需要的最小權限。這叫**最小權限原則**。

---

📄 7-11 第 4 張

來看 RBAC 的 YAML 怎麼寫。三個物件組合在一起。

**Role：定義能做什麼**

`verbs` 是「動作」，定義這個 Role 允許對資源做什麼操作。常見的有：`get`（讀單一資源）、`list`（列出全部）、`watch`（監聽變化）、`create`、`update`、`patch`、`delete`。只讀角色給 get、list、watch 就夠了；讀寫角色再加上其他的。

`apiGroups` 指定資源所屬的 API 群組。空字串 `""` 代表 core group，包含 Pod、Service、ConfigMap、Secret 這些基本資源。`apps` 群組包含 Deployment、StatefulSet；`networking.k8s.io` 群組包含 Ingress。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-viewer
  namespace: default
rules:
- apiGroups: [""]       # 空字串 = core API group（Pod、Service、ConfigMap）
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
  # 沒有 create、update、delete、patch
  # 純粹只讀的 Role
```

**ServiceAccount：Pod 的身份**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: viewer-sa
  namespace: default
```

**RoleBinding：把 Role 發給 ServiceAccount**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: viewer-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: viewer-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-viewer
  apiGroup: rbac.authorization.k8s.io  # 固定寫法
```

三個 YAML 組合完成一件事：`viewer-sa` 這個 ServiceAccount 在 `default` Namespace 只能 get、list、watch Pod，其他什麼都不能做。

---

📄 7-11 第 5 張

企業裡的常見 RBAC 設計方案：

| 角色 | dev Namespace | staging | prod |
|------|-------------|---------|------|
| 開發人員 | 完整權限 | 完整權限 | 只讀 |
| SRE / DevOps | 完整權限 | 完整權限 | 完整權限 |
| 實習生 | 只讀 | 無權限 | 無權限 |
| CI/CD Pipeline | 部署權限 | 部署權限 | 部署權限 |

就算有人手滑，損害也限制在可控範圍內。這就是為什麼要有 RBAC。

---

## 7-12 RBAC 實作（~12 min）

### ② 所有指令＋講解

**Step 1：部署 ServiceAccount + Role + RoleBinding**

```bash
kubectl apply -f rbac-viewer.yaml
```

預期輸出：
```
serviceaccount/viewer-sa created
role.rbac.authorization.k8s.io/pod-viewer created
rolebinding.rbac.authorization.k8s.io/viewer-binding created
```

三行都出現才對。

---

**Step 2：確認三個資源都建好了**

```bash
kubectl get serviceaccount viewer-sa
kubectl get role pod-viewer
kubectl get rolebinding viewer-binding
```

每個都看到 AGE 是幾秒，表示建好了。

---

**Step 3：用 `--as` 模擬身份，測試只讀**

K8s 提供了 `--as` 旗標，可以模擬用其他身份操作。格式：

```
system:serviceaccount:<namespace>:<serviceaccount-name>
```

```bash
kubectl get pods --as=system:serviceaccount:default:viewer-sa
```

- 這行模擬用 `viewer-sa` 的身份查看 Pod
- 應該**成功**，因為 pod-viewer Role 有 `get` 和 `list` 權限

預期輸出：正常顯示 Pod 列表

---

**Step 4：用 `--as` 測試刪除（應該被拒）**

```bash
kubectl delete pod <任意pod名> --as=system:serviceaccount:default:viewer-sa
```

預期輸出：
```
Error from server (Forbidden): pods "xxx" is forbidden:
User "system:serviceaccount:default:viewer-sa" cannot delete resource "pods"
in API group "" in the namespace "default"
```

- `Forbidden` = 沒有這個 verb 的權限
- K8s 告訴你完整的原因：哪個 User、不能做什麼、在哪個資源上

---

**Step 5：用 `--as` 測試建立（應該被拒）**

```bash
kubectl run test --image=nginx --as=system:serviceaccount:default:viewer-sa
```

預期輸出：
```
Error from server (Forbidden): ... cannot create resource "pods" ...
```

一樣被拒。沒有 `create` 權限。

---

**Step 6：確認用預設 admin 身份什麼都能做**

```bash
kubectl get pods          # 正常
kubectl run test-admin --image=nginx  # 成功建立
kubectl delete pod test-admin         # 成功刪除
```

同一個叢集、同一個 Namespace，但不同身份有不同權限。這就是 RBAC 的威力。

---

**排錯**

```bash
kubectl auth can-i get pods --as=system:serviceaccount:default:viewer-sa
# yes = 有權限，no = 沒有

kubectl auth can-i delete pods --as=system:serviceaccount:default:viewer-sa
# no = 正確，沒有 delete 權限

kubectl describe rolebinding viewer-binding
# 確認 subjects 和 roleRef 都寫對
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| `--as` 格式寫錯 | 操作直接用 admin 身份，沒有模擬效果 | 要寫完整 `system:serviceaccount:default:viewer-sa`，不能只寫 `viewer-sa` |
| Role 和 ServiceAccount 不在同一個 Namespace | 模擬身份後什麼都不能做 | Role、RoleBinding、ServiceAccount 的 namespace 要一致 |
| RoleBinding 的 roleRef 寫錯 | apply 成功但權限不生效 | `kind` 要對（Role 或 ClusterRole）、`name` 要跟 Role 名字完全一樣、`apiGroup` 固定是 `rbac.authorization.k8s.io` |

---

### ③ QA

**Q：Role 和 ClusterRole 什麼時候用哪個？**

A：要看你的資源在哪個 Namespace。如果只需要控制某一個 Namespace 的資源，用 Role，搭 RoleBinding。如果需要跨所有 Namespace 的資源，或者是沒有 Namespace 概念的資源（比如 Node、PersistentVolume），才用 ClusterRole。實務上，開發人員的日常操作通常是 Role 加 RoleBinding 就夠了，不需要給 ClusterRole。

**Q：`verbs` 可以填哪些？怎麼知道我需要哪些？**

A：常見的 verbs 有 `get`（查單個）、`list`（列出全部）、`watch`（即時監控）、`create`（新建）、`update`（更新）、`patch`（局部修改）、`delete`（刪除）。還有一個特殊的 `*` 代表全部。可以用 `kubectl api-resources -o wide` 查看各資源支援哪些 verbs。最小權限原則：只給實際需要的，不要圖方便給 `*`。

**Q：`kubectl --as` 是真的模擬那個身份嗎？會有安全問題嗎？**

A：`--as` 是模擬身份（Impersonation），讓你用另一個 ServiceAccount 或 User 的權限執行指令，測試 RBAC 設定是否正確。它是利用 K8s 的 Impersonation 功能，需要你自己有 `impersonate` 這個權限。叢集 admin 預設有這個權限，所以你在本地環境可以用。但在生產環境，你不會把 impersonate 權限給一般使用者，所以不會有安全問題。這個功能主要用來測試和排錯，確認某個 ServiceAccount 的權限是否如預期。

**Q：ServiceAccount 和一般的使用者帳號有什麼不同？**

A：ServiceAccount 是給 Pod（程式）用的，存在 K8s 裡面，有 Token 可以驗證身份。一般使用者帳號（User）是給人用的，K8s 本身不管理 User，通常整合外部的身份驗證系統，比如 OIDC（OpenID Connect，身份驗證協議，可以整合 Google、GitHub 等帳號登入 K8s）、LDAP（Lightweight Directory Access Protocol，企業常用的目錄服務，如 Active Directory）或者用 kubeconfig 裡的 certificate。在我們的課程環境，`kubectl --as` 模擬的是 ServiceAccount，因為 ServiceAccount 最好測試。

---

## 7-13 回頭操作 Loop 4（~5 min）

### ④ 學員實作

> 📢 **講師說話口吻**
>
> 好，換你們自己建一個 ServiceAccount、Role、RoleBinding 的組合，然後用 `--as` 測試看 get 能不能動、delete 有沒有被擋。

**🎯 必做題：建只讀角色並驗證**

你要從零開始，建立以下資源：

使用的 lab 檔案：`~/workspace/k8s-course-labs/lesson7/rbac-viewer.yaml`（參考格式）

1. 建一個 ServiceAccount，名字自訂（例如 `my-viewer`）
2. 建一個 Role，只允許 `get`、`list` pods 這兩個動作
3. 建一個 RoleBinding，把 Role 綁到你的 ServiceAccount
4. 用 `kubectl --as` 驗證：
   - `get pods` → 應該成功
   - `delete pod <任意名稱>` → 應該看到 Forbidden

確認看到 `Forbidden` 錯誤訊息就做對了。

---

**🏆 挑戰題：Deployment 管理者角色（不能碰 Secret）**

建一個新的 Role，條件如下：
- 可以 `get`、`list`、`create`、`update`、`delete` deployments
- 不能 `get`、`list` secrets

建對應的 ServiceAccount 並綁定，用 `--as` 驗證：
- `kubectl get deployments --as=...` → 成功
- `kubectl get secrets --as=...` → Forbidden

提示：同一個 Role 可以有多條 `rules`，每條規則指定不同的 `resources` 和 `verbs`。沒有列在 rules 裡面的，預設全部拒絕。

---

### ⑤ 學員實作解答

**必做解答**

```yaml
# rbac-student.yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-viewer
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-readonly
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: my-viewer-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-viewer
  namespace: default
roleRef:
  kind: Role
  name: pod-readonly
  apiGroup: rbac.authorization.k8s.io
```

```bash
kubectl apply -f rbac-student.yaml

# 驗證 get pods（應該成功）
kubectl get pods --as=system:serviceaccount:default:my-viewer

# 驗證 delete pod（應該 Forbidden）
kubectl delete pod <任意pod名> --as=system:serviceaccount:default:my-viewer

# 快速確認權限
kubectl auth can-i get pods --as=system:serviceaccount:default:my-viewer
# yes
kubectl auth can-i delete pods --as=system:serviceaccount:default:my-viewer
# no
```

---

**挑戰解答**

```yaml
# rbac-deploy-manager.yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deploy-manager
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-manager
  namespace: default
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update", "delete"]
# secrets 沒有出現在任何 rule 裡，預設全部拒絕
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deploy-manager-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: deploy-manager
  namespace: default
roleRef:
  kind: Role
  name: deployment-manager
  apiGroup: rbac.authorization.k8s.io
```

```bash
kubectl apply -f rbac-deploy-manager.yaml

# 驗證可以看 Deployment（成功）
kubectl get deployments --as=system:serviceaccount:default:deploy-manager

# 驗證不能看 Secret（Forbidden）
kubectl get secrets --as=system:serviceaccount:default:deploy-manager
```

---

**三個坑**

1. `--as` 忘了寫前綴 → 直接寫 `--as=my-viewer` 不會模擬 ServiceAccount，要寫完整的 `system:serviceaccount:default:my-viewer`
2. Deployment 的 `apiGroups` 要填 `apps`，不是空字串 → 空字串只對應 core API group（Pod、Service、ConfigMap 等），Deployment 屬於 `apps` group
3. RoleBinding 的 `roleRef` 建立後不能修改 → 如果 `roleRef` 寫錯，要先 `kubectl delete rolebinding` 再重建，不能 `kubectl apply` 更新

**清理**

```bash
kubectl delete -f rbac-student.yaml
kubectl delete -f rbac-deploy-manager.yaml
kubectl get serviceaccount   # 確認 my-viewer、deploy-manager 已刪除
kubectl get role             # 確認 pod-readonly、deployment-manager 已刪除
```
