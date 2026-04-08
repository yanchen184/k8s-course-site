# Day 5 Loop 4：自我修復 + Labels 進階操作

---

## 5-9 自我修復 + Labels 進階操作概念（20 分鐘）

### ① 課程內容

**自我修復（Self-Healing）是什麼**
- 當 Pod 掛掉（崩潰、被手動刪除、節點故障），Kubernetes 會自動補回來
- 不是魔法，是 ReplicaSet 的 Controller Loop 在背後持續運作
- 核心機制：「實際狀態 vs 期望狀態」的差異偵測與修正

**Controller Manager 的角色**
- `kube-controller-manager` 是 K8s 控制平面的一個元件
- 裡面跑著各種 Controller（ReplicaSet Controller、Deployment Controller…）
- 每個 Controller 都在跑一個 **reconciliation loop（調和循環）**
  - 持續問：「現在實際有幾個 Pod？」
  - 對比：「Deployment 期望幾個？」
  - 差多少就補多少、多幾個就刪幾個
- 這就是為什麼你手動刪一個 Pod，它會自己長回來

> **複習**：Labels 三處位置（Deployment 本身 / selector / Pod template）已在 5-3 介紹過。
> 本節重點是「進階操作」：用指令實際操控 label、觀察 K8s 如何反應。

---
> 📋 **翻頁** → 下一張：Labels + Selector：K8s 的認親機制

**Labels 進階操作場景**
- 用 `--show-labels` 看 Pod 上所有的 label
- 用 `-l` 過濾，只操作特定 label 的資源
- 手動對 Pod 加 label → 觀察只影響那一個 Pod
- 批次用 label 刪 Pod → 觸發大規模自我修復
- 「孤兒 Pod」實驗：手動改掉 Pod 的 label，讓它脫離 Deployment 管理

**孤兒 Pod（Orphan Pod）是什麼**
- 本來受 Deployment 管轄的 Pod，把它的 label 改掉（不符合 selector）
- Deployment 看不到它，以為少了一個副本，立刻補一個新 Pod
- 舊 Pod 變成「沒人管的孤兒」，繼續跑，直到手動刪除
- 最終結果：原本 3 個 Pod → 變成 4 個（3 個被管的 + 1 個孤兒）
- **用途**：除錯時可以先把問題 Pod 從 Deployment 隔離，不影響其他 Pod，慢慢調查

**pod-template-hash 是什麼**
- K8s 自動加在每個 Pod 上的 label，值是 Pod template 內容的 hash
- 由 ReplicaSet controller 設定，不是 Deployment 直接設
- 作用：滾動更新時區分新舊版本的 Pod（新舊 RS 各自的 hash 不同）
- **不要手動刪它**：刪掉後 Pod 脫離 ReplicaSet 管理，變成孤兒 Pod

**Label 和 Annotation 的差別（常考！）**

| 比較 | Label | Annotation |
|------|-------|-----------|
| 能被 selector 選取 | ✅ | ❌ |
| 適合放什麼 | 短的識別標籤（`app=nginx`） | 長文字、JSON、說明、工具寫入的資訊 |
| 典型用途 | Deployment 認領 Pod、Service 找 Pod | `change-cause`、CI/CD 寫入 build 資訊 |
| 值的長度 | 短（建議 ≤63 字元） | 可以很長 |

---

### ② 所有指令＋講解

（本節為概念課，指令集中在 5-10 實作。）

---

### ③ 題目

1. 「孤兒 Pod」是怎麼產生的？在什麼除錯場景下會刻意製造孤兒 Pod？
2. Label 和 Annotation 有什麼差別？各自適合用在什麼場合？（提示：回想 5-7 的 `annotate` 指令）

### ④ 解答

1. 孤兒 Pod 的產生：對一個受 Deployment 管轄的 Pod 手動執行 `kubectl label pod <name> app=other --overwrite`，把 label 改成不符合 selector 的值，Deployment 就看不到這個 Pod，立刻補一個新的。舊 Pod 繼續跑，但沒有任何 controller 管理它，就是孤兒。**除錯用途**：當某個 Pod 出現異常行為，可以先把它從 Deployment 「摘出來」（改 label），讓 Deployment 自動補一個正常 Pod 繼續服務，然後慢慢對孤兒 Pod 執行 `kubectl exec` 或 `kubectl describe` 調查，不影響正常 Pod 的服務。

2. **Label**：設計用來被 selector 選取，適合用於資源關聯（Service 選 Pod、Deployment 認領 Pod）和過濾查詢（`kubectl get pods -l app=nginx`）。值要簡短，不建議放長文字。**Annotation**：設計用來存放「給人看的 metadata」，不能被 selector 選取，適合放部署說明、變更原因、工具自動寫入的資訊（如 `change-cause`）。值可以很長，也可以是 JSON。

---

## 5-10 自我修復 + Labels 實作（30 分鐘）

### ① 課程內容

**實作目標**
- 親眼看到 Pod 被刪掉後自動補回來
- 觀察 Pod 上的 label
- 手動給 Pod 加 label
- 用 `-l` 過濾 Pod
- 用 label 做批次刪除
- 看 Deployment 的 selector 設定

**自我修復觀察重點**
- 刪掉 Pod 後，注意看新 Pod 的 AGE 欄位，會看到一個很年輕的新 Pod 出現
- Pod 的 NAME 會不一樣（有隨機 suffix），但功能完全相同
- 這代表 K8s 的 reconciliation loop 偵測到 Pod 數量不足，自動補上了

**注意事項**
- `kubectl label pod` 加上的 label 只在這個 Pod 生命週期內有效，Pod 重啟後消失（Pod 是 immutable，重啟等於重建）
- 如果想讓所有 Pod 都有某個 label，要改 Deployment 的 `template.metadata.labels`
- `kubectl delete pod -l <selector>` 很強大，操作前一定要先用 `kubectl get pods -l` 確認選到的是哪些 Pod，再執行刪除

---

### ② 所有指令＋講解

---

#### 查看 Pod 的所有 Labels

```bash
kubectl get pods --show-labels
```

- `get pods`：列出所有 Pod
- `--show-labels`：在輸出最後加一欄 LABELS，顯示每個 Pod 的所有 label

**打完要看：**
```
NAME                            READY   STATUS    RESTARTS   AGE   LABELS
nginx-deploy-5c8d9f7b6a-abcd   1/1     Running   0          5m    app=nginx,pod-template-hash=5c8d9f7b6a
nginx-deploy-5c8d9f7b6a-efgh   1/1     Running   0          5m    app=nginx,pod-template-hash=5c8d9f7b6a
nginx-deploy-5c8d9f7b6a-ijkl   1/1     Running   0          5m    app=nginx,pod-template-hash=5c8d9f7b6a
```
- `app=nginx`：這是 Deployment template 設定的 label
- `pod-template-hash`：K8s 自動加的，代表這個 Pod 屬於哪個版本的 ReplicaSet（不要手動改這個）

**異常狀況：**
- LABELS 欄位只有 `pod-template-hash` 沒有 `app`→ Deployment 的 template labels 設定有問題，檢查 YAML

---

#### 手動給 Pod 加 Label

```bash
kubectl label pod <pod-name> env=test
```

- `label pod <pod-name>`：對指定的 Pod 操作 label
- `env=test`：新增一個 `key=value` 格式的 label

**打完要看：**
```
pod/nginx-deploy-5c8d9f7b6a-abcd labeled
```
再跑一次 `kubectl get pods --show-labels` 確認該 Pod 的 LABELS 欄位多了 `env=test`。

**異常狀況：**
- `error: 'env' already has a value (staging), and --overwrite is false` → 這個 key 已存在，要覆蓋需加 `--overwrite`
- Pod 名稱打錯 → `Error from server (NotFound)`，用 `kubectl get pods` 複製正確名稱

---

#### 用 Label 過濾 Pod（方法一：精確比對）

```bash
kubectl get pods -l app=nginx
```

- `-l app=nginx`：只列出有 `app=nginx` 這個 label 的 Pod
- `-l` 是 `--selector` 的縮寫

**打完要看：**
```
NAME                            READY   STATUS    RESTARTS   AGE
nginx-deploy-5c8d9f7b6a-abcd   1/1     Running   0          5m
nginx-deploy-5c8d9f7b6a-efgh   1/1     Running   0          5m
nginx-deploy-5c8d9f7b6a-ijkl   1/1     Running   0          5m
```
只顯示符合條件的 Pod，其他 Pod 不會出現。

**異常狀況：**
- 輸出 `No resources found in default namespace.` → 沒有任何 Pod 有這個 label，確認 label key/value 是否打對

---

#### 用 Label 過濾 Pod（方法二：查看剛才手動加的 label）

```bash
kubectl get pods -l env=test
```

**打完要看：**
```
NAME                            READY   STATUS    RESTARTS   AGE
nginx-deploy-5c8d9f7b6a-abcd   1/1     Running   0          6m
```
只有剛才手動加了 `env=test` 的那一個 Pod 出現。

---

#### 觀察自我修復（刪 Pod）

```bash
kubectl delete pod <pod-name>
```

- `delete pod <pod-name>`：刪除指定名稱的 Pod

**打完要看（刪除後立刻跑 get pods）：**
```bash
kubectl get pods
```
```
NAME                            READY   STATUS              RESTARTS   AGE
nginx-deploy-5c8d9f7b6a-efgh   1/1     Running             0          6m
nginx-deploy-5c8d9f7b6a-ijkl   1/1     Running             0          6m
nginx-deploy-5c8d9f7b6a-mnop   0/1     ContainerCreating   0          2s   ← 新的！
```
注意新 Pod 的 AGE 只有 2 秒，這就是自我修復的證明。

**異常狀況：**
- Pod 刪掉後沒有新 Pod 補回來 → Deployment 的 `spec.replicas` 可能是 0，或 namespace 裡有 ResourceQuota 限制

---

#### 用 Label 批次刪除 Pod

```bash
kubectl delete pod -l app=nginx
```

- `delete pod -l app=nginx`：刪除所有符合 `app=nginx` label 條件的 Pod
- 注意：刪了之後 Deployment 會自動補回來（自我修復），所以這個操作通常用來「強制重啟所有 Pod」

**打完要看：**
```
pod "nginx-deploy-5c8d9f7b6a-efgh" deleted
pod "nginx-deploy-5c8d9f7b6a-ijkl" deleted
pod "nginx-deploy-5c8d9f7b6a-mnop" deleted
```
馬上跑 `kubectl get pods` 可以看到 Deployment 正在補新的 Pod（ContainerCreating 狀態）。

**異常狀況：**
- `No resources found` → label 打錯，先用 `kubectl get pods -l app=nginx` 確認有多少 Pod 符合再刪

---

#### 查看 Deployment 的 Selector 設定

```bash
kubectl describe deployment nginx-deploy
```

- `describe deployment`：顯示 Deployment 的完整詳細資訊，包含 selector、strategy、events 等

**打完要看（重點區塊）：**
```
Name:                   nginx-deploy
Selector:               app=nginx
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:      nginx:1.28
```
- `Selector: app=nginx`：這是 Deployment 用來找 Pod 的條件
- `Pod Template > Labels: app=nginx`：Pod 建出來後的 label，必須跟 Selector 一致

**異常狀況：**
- Selector 和 Pod Template Labels 不一致 → 這是 bug，需要修復（通常只能刪掉重建 Deployment）

---

---
> 📋 **翻頁** → 下一張：Lab 3：除錯工程師

### ③ 題目（Lab 3：除錯工程師）

**情境：正式環境跑著 3 個 Pod 的 nginx 服務。其中一個 Pod 行為異常（回應很慢，但還沒死）。你需要把它「隔離」出來調查，同時不能中斷服務。**

**任務：**
1. 確認目前有 3 個 Pod（用 `--show-labels` 看）
2. 選一個 Pod，把它的 `app` label 改成 `app=isolated`
3. 觀察：Pod 總數變幾個？Deployment 的 READY 是什麼？
4. 對孤兒 Pod 執行 `kubectl describe`，找出它的 Node、Events、狀態
5. 調查完畢，手動刪除孤兒 Pod，確認恢復 3 個 Pod

**驗收：**
- 能說出孤兒 Pod 在哪個 Node
- 能說明 Deployment 為什麼自動補 Pod
- 最後 `kubectl get pods` 回到 3 個 Running

> 📋 學生看 PPT 5-10 第二張（Lab 3：除錯工程師），上面有完整說明和對照表。

### ④ 解答

**為什麼用孤兒 Pod 而不是其他方法：**

| 方法 | 問題 |
|------|------|
| 直接刪 Pod | Pod 消失，無法調查根本原因 |
| scale 到 1 留問題 Pod | 其他正常 Pod 被砍，服務降容影響用戶 |
| ✅ 改 label 孤兒化 | Deployment 補新 Pod 繼續服務，舊 Pod 穩定存活等你查 |

**完整操作：**

```bash
# Step 1：確認 Pod + 看 labels
kubectl get pods --show-labels
# 記下一個 Pod 的名字，例如 nginx-deploy-xxx-aaa

# Step 2：改 label，孤兒化
kubectl label pod nginx-deploy-xxx-aaa app=isolated --overwrite
# 輸出：pod/nginx-deploy-xxx-aaa labeled

# Step 3：觀察
kubectl get pods --show-labels
# 看到 4 個 Pod：3 個 app=nginx + 1 個 app=isolated
kubectl get deploy
# READY 仍然是 3/3（Deployment 已自動補一個新 Pod）

# Step 4：調查孤兒 Pod
kubectl describe pod nginx-deploy-xxx-aaa
# 重點看：Node、Labels（確認 app=isolated）、Events

# Step 5：清理
kubectl delete pod nginx-deploy-xxx-aaa
kubectl get pods   # 回到 3 個
```

**老師補充說明重點：**
- 孤兒化的核心：改掉 label → 脫離 Deployment 的 selector → Deployment 以為副本不足 → 補新 Pod
- 孤兒 Pod 不受任何控制器管，不會被自動重啟也不會被自動刪除，是穩定的調查對象
- 這是生產環境工程師實際使用的技巧，不是玩具實驗
- 調查完一定要手動刪，否則會有殘留的孤兒 Pod 佔用資源

---

## 5-11 回頭操作 + 上午總結（15 分鐘）

### ① 課程內容

**上午回顧重點**
- Deployment 的完整生命週期：建立 → 更新（滾動）→ 失敗 → 回滾
- ReplicaSet 的角色：滾動更新的蹺蹺板、自我修復的執行者
- Labels 三處位置：Deployment 本身 / selector / Pod template，三者關係
- Selector 是 K8s 資源關聯的核心機制

**本節操作**
- 做上午的小測驗
- 對照解答確認理解
- 提問與補充說明

---

### ② 所有指令＋講解

（本節為複習段，以問答為主，無新指令。）

---

### ③ 題目（上午小測驗，共 5 題）

**第 1 題**
現有一個 Deployment，目前 image 是 `nginx:1.25`，想更新到 `nginx:1.28`。請寫出完整操作流程：觸發更新、確認進度、驗證結果（至少 3 個指令，依序排列）。

---

**第 2 題**
執行 `kubectl rollout undo deployment/nginx-deploy` 之後，立刻又跑了一次相同指令。現在 image 是哪個版本？為什麼？

---

**第 3 題**
下面的 YAML 有 bug，找出來並說明會造成什麼問題：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deploy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: website    # ← 注意這裡
    spec:
      containers:
      - name: web
        image: nginx:1.28
```

---

**第 4 題**
你有 10 個 Pod 帶有 `app=api` 的 label，現在想一次刪掉全部，然後驗證 Deployment 已把它們補回來。請寫出對應的指令（含驗證步驟）。

---

**第 5 題**
說明 `kubectl get pods --show-labels` 輸出中，`pod-template-hash` 這個 label 是什麼？是誰加上去的？可以手動刪除它嗎？

---

### ④ 解答

**第 1 題解答**

```bash
# Step 1：觸發滾動更新
kubectl set image deployment/nginx-deploy nginx=nginx:1.28

# Step 2：即時確認更新進度
kubectl rollout status deployment/nginx-deploy

# Step 3：驗證結果（確認 image 已換）
kubectl describe deployment nginx-deploy | grep Image
```

補充確認指令（加分）：
```bash
# 看 RS 蹺蹺板（確認舊 RS 副本數已歸零）
kubectl get rs

# 看版本歷史
kubectl rollout history deployment/nginx-deploy
```

---

**第 2 題解答**

結果：回到 `nginx:1.28`（或更新前的那個版本），也就是「undo 之前的版本」。

原因：第一次 `undo` 把 Deployment 從版本 N 切到版本 N-1，K8s 同時把這次操作記錄為一個新的 revision N+1。第二次 `undo` 會從 N+1 切回 N，也就是 nginx:1.28 那版。兩次 undo 等於在兩個版本之間來回切換，不會繼續往更舊的走。

---

**第 3 題解答**

Bug：`selector.matchLabels.app = web`，但 `template.metadata.labels.app = website`，兩者不一致。

問題：
1. 建立 Deployment 時 K8s 會直接報錯（`The Deployment "web-deploy" is invalid`），因為 selector 和 pod template labels 不符。
2. 即使繞過 validation，Deployment 的 controller loop 永遠找不到符合 selector（`app=web`）的 Pod，會不斷創建新 Pod，Pod 數量失控增長。

修正：把 `template.metadata.labels.app` 改為 `web`，跟 selector 一致。

---

**第 4 題解答**

```bash
# Step 1：先確認要刪的 Pod（安全習慣，操作前先確認）
kubectl get pods -l app=api

# Step 2：批次刪除
kubectl delete pod -l app=api

# Step 3：驗證 Deployment 正在補 Pod（立刻執行）
kubectl get pods

# Step 4：等幾秒後再確認全部 Running
kubectl get pods -l app=api
```

預期看到：
- Step 2 輸出 10 行 `pod "xxx" deleted`
- Step 3 看到新 Pod 處於 `ContainerCreating` 狀態
- Step 4 看到 10 個 Pod 全部 `Running`，AGE 很短（幾秒到幾十秒）

---

**第 5 題解答**

`pod-template-hash` 是 K8s **自動加上去** 的 label，由 ReplicaSet controller 設定。它的值是 Pod template 內容的 hash，用來「區分同一個 Deployment 在不同版本（revision）下建出的 Pod」。

作用：滾動更新時，新舊兩個 ReplicaSet 各自對應不同的 `pod-template-hash`，Deployment 的 selector 加上這個 hash 就能精確認領「屬於自己這個版本的 Pod」，不會和其他 RS 的 Pod 混在一起。

**不建議手動刪除**：可以用 `kubectl label pod <name> pod-template-hash-`（加 `-` 後綴代表刪除 label）強制刪除，但刪掉後這個 Pod 就脫離了 ReplicaSet 的管理，變成「孤兒 Pod」，Deployment 會補一個新的，且孤兒 Pod 不會被自動清理。實際操作上沒有理由手動刪這個 label。
