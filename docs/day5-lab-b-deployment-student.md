# Day 5 Lab B — Deployment 實戰（學生版）

> **適用時機**：Loop 2 結束後（已學 Deployment、擴縮容、Labels/Selector 概念）
> **時間**：25–30 分鐘
> **獨立完成，老師不提示步驟**

---

## Lab 1：接手壞掉的 Deployment（15 分鐘）

### 情境

你收到一封信：

> 「同事剛離職，留下一個 Deployment YAML。我把它部署到叢集了，但 Pod 一直起不來，你幫我看看。」

以下是那個 YAML，請把它 apply 到你的叢集後，找出問題並修復。

**broken-deploy.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-broken
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: website
    spec:
      containers:
      - name: web
        image: nginx:1.25
```

### 任務

1. 把上面的 YAML 存成 `broken-deploy.yaml`，然後 apply 到叢集
2. 觀察發生了什麼事（Deployment 狀態、Pod 數量）
3. 找出 bug 是什麼，說明它會造成什麼問題
4. 修復 YAML，重新 apply，確認 Pod 正常 Running

### 驗收條件

- `kubectl get pods` 看到 1 個 Pod，STATUS = `Running`
- `kubectl describe deployment web-broken` 的 Selector 和 Pod Template Labels 一致
- 能口頭解釋 bug 原因

---

## Lab 2：深夜版本事故（15 分鐘）

### 情境

凌晨兩點，你被叫醒：

> 「網站掛了！同事剛把 image 推錯版本，現在 Pod 全部 CrashLoopBackOff，快修！」

你打開電腦，叢集目前狀態如下（請先執行下方指令重現這個狀態）：

**重現事故（請依序執行）：**

```bash
# Step 1：建立正常版本的 Deployment（v1）
kubectl create deployment night-deploy --image=nginx:1.25 --replicas=2

# Step 2：記錄這次部署（設定 change-cause）
kubectl annotate deployment night-deploy kubernetes.io/change-cause="v1: 正常版本"

# Step 3：更新到 v2（正常）
kubectl set image deployment/night-deploy nginx=nginx:1.26
kubectl annotate deployment night-deploy kubernetes.io/change-cause="v2: 更新小版本" --overwrite

# 等 rollout 完成
kubectl rollout status deployment/night-deploy

# Step 4：模擬同事推錯版本（image 不存在，會 CrashLoopBackOff）
kubectl set image deployment/night-deploy nginx=nginx:99.99.99
kubectl annotate deployment night-deploy kubernetes.io/change-cause="v3: 緊急熱修復（錯誤版本）" --overwrite
```

### 任務

事故發生了，你需要：

1. 確認目前 Pod 狀態（壞了幾個？）
2. 查看部署歷史，找出哪個 revision 是正常的 `nginx:1.26`
3. **直接回滾到指定的正常版本**（不能用 `kubectl rollout undo` 不帶參數）
4. 驗證 Pod 全部恢復 Running，服務恢復正常

### 提示（看完情境先自己想，卡住再看）

<details>
<summary>展開提示</summary>

- 要查部署歷史用哪個指令？
- `rollout undo` 有一個旗標可以指定回到哪個版本號，不只是「上一個」
- 怎麼確認現在 Pod 跑的是哪個 image？

</details>

### 驗收條件

- `kubectl get pods` 看到所有 Pod STATUS = `Running`
- `kubectl rollout history deployment/night-deploy` 顯示的版本歷史合理
- 能說明「為什麼不能直接用 `rollout undo` 不帶參數」

---

## 清理（做完記得清）

```bash
kubectl delete deployment web-broken
kubectl delete deployment night-deploy
```

---

## 老師解答（請勿提前翻）

<details>
<summary>Lab 1 解答</summary>

**Bug 位置**：`selector.matchLabels.app = web`，但 `template.metadata.labels.app = website`，兩者不一致。

**問題**：Deployment 的 selector 是它用來「認領 Pod」的條件。apply 時 K8s 實際上會報錯（Invalid: selector does not match template labels）。即使繞過，Deployment controller 也永遠找不到 Pod，會不斷補，Pod 愈來愈多但全部不受管控。

**修復**：把 `template.metadata.labels.app` 從 `website` 改成 `web`，跟 selector 一致。

```bash
# 直接修改 YAML 後 apply
kubectl apply -f broken-deploy.yaml

# 驗收
kubectl get pods
kubectl describe deployment web-broken | grep -A3 "Selector\|Labels"
```

</details>

<details>
<summary>Lab 2 解答</summary>

```bash
# Step 1：確認 Pod 狀態
kubectl get pods
# 看到 Pod 處於 ErrImagePull 或 ImagePullBackOff 狀態

# Step 2：查歷史
kubectl rollout history deployment/night-deploy
# 輸出類似：
# REVISION  CHANGE-CAUSE
# 1         v1: 正常版本
# 2         v2: 更新小版本
# 3         v3: 緊急熱修復（錯誤版本）

# Step 3：回滾到 revision 2（nginx:1.26）
kubectl rollout undo deployment/night-deploy --to-revision=2

# Step 4：驗收
kubectl rollout status deployment/night-deploy
kubectl get pods
kubectl describe deployment night-deploy | grep Image
```

**為什麼不能用 `rollout undo` 不帶參數？**
不帶參數的 `rollout undo` 只會回到「上一個 revision」，也就是從 v3 退到 v2。這裡剛好是對的，但在更複雜的場景中（例如你已經 undo 過一次），不帶參數可能退到錯的版本。帶 `--to-revision` 才能精確指定要回到哪一個版本，不靠運氣。

</details>
