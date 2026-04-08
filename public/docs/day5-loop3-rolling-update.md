# Day 5 Loop 3：滾動更新 + 回滾

---

## 5-6 滾動更新概念（20 分鐘）

### ① 課程內容

**停機更新的問題**
- 傳統做法：先全部砍掉舊 Pod，再全部建新 Pod
- 問題：中間這段時間完全沒有 Pod 在跑，服務中斷
- 實際場景：使用者看到 502 / 503，老闆打電話來罵你

**滾動更新（Rolling Update）流程**
- 核心原則：「建一個新的，砍一個舊的」，不斷循環直到全換完
- 全程至少有一個 Pod 在提供服務，零停機
- Kubernetes 預設的更新策略就是 Rolling Update（不用特別設定）

**底層機制：ReplicaSet 蹺蹺板**
- Deployment 會建出一個新的 ReplicaSet（RS）
- 新 RS 副本數：0 → 1 → 2 → ... → N（逐步增加）
- 舊 RS 副本數：N → N-1 → ... → 1 → 0（逐步縮減）
- 兩個 RS 的副本數總和在整個過程中保持穩定
- 可以用 `kubectl get rs` 觀察這個蹺蹺板現象

**舊 ReplicaSet 為什麼保留？**
- 更新完成後，舊 RS 仍然存在，但副本數為 0（Pod 已全砍，物件還在）
- 這是「回滾備份」：需要回滾時，直接把舊 RS 的副本數調回來就好
- 不需要重新 build image，也不需要重新 push，速度極快

**更新策略參數：maxSurge / maxUnavailable**

| 參數 | 意義 | 預設值 |
|------|------|--------|
| `maxSurge` | 更新過程中，最多可以超出期望副本數多少個 | 25%（無條件進位） |
| `maxUnavailable` | 更新過程中，最多允許幾個 Pod 不可用 | 25%（無條件捨去） |

- 範例：3 個副本時，maxSurge=1（最多 4 個同時存在），maxUnavailable=0（不允許任何一個不可用）
- 可在 `spec.strategy.rollingUpdate` 區塊自訂

---
> 📋 **翻頁** → 下一張：回滾：一行指令退回上一版

**回滾機制**
- 出問題時：`kubectl rollout undo deployment/<name>`
- 底層行為：舊 RS 副本數重新增加，新 RS 副本數縮減回 0
- K8s 預設保留 10 個歷史版本（`spec.revisionHistoryLimit`）

**與 Docker 對照**
- Docker Compose：`docker-compose up` 是直接替換，沒有原生滾動更新
- 要達到滾動更新效果需要自己寫 Shell 腳本，逐一替換
- Kubernetes 把這件事做成一等公民（first-class feature），開箱即用

---

### ② 所有指令＋講解

（本節為概念課，無實際操作指令。指令集中在 5-7 實作。）

---

### ③ 題目

1. 滾動更新過程中，為什麼「舊 ReplicaSet 不會被立刻刪除」？這個設計解決了什麼問題？
2. maxSurge=0, maxUnavailable=1 代表什麼？更新期間流量會有影響嗎？

### ④ 解答

1. 舊 RS 保留是為了支援「快速回滾」。回滾時直接擴容舊 RS、縮減新 RS，不需要重新 build/push image，整個回滾過程可以在秒級完成。如果把舊 RS 刪掉，就只能重新部署，速度慢很多。

2. maxSurge=0 表示更新期間 Pod 總數不能超過期望值（不會多開新 Pod）；maxUnavailable=1 表示最多允許 1 個 Pod 不可用。更新流程變成「先砍 1 個舊的，再建 1 個新的」，期間有 1 個 Pod 短暫不在線，流量會有輕微影響（請求可能失敗），適合可以接受短暫降容的場景。

---

## 5-7 滾動更新實作（30 分鐘）

### ① 課程內容

**實作目標**
- 把 nginx-deploy 從目前版本更新到 nginx:1.28
- 觀察滾動更新的蹺蹺板過程
- 故意更新成錯誤版本，練習回滾
- 使用 --to-revision 指定版本回滾

**操作順序**
1. 先確認目前 image 版本
2. 觸發更新，即時觀察 rollout 狀態
3. 看 RS 的副本數變化（蹺蹺板）
4. 查看歷史版本記錄
5. 故意設定一個不存在的 image 版本
6. 觀察 ImagePullBackOff 錯誤
7. 執行 rollout undo 回滾
8. 確認服務恢復

**注意事項**
- `kubectl set image` 和 `kubectl edit` 都能觸發滾動更新，效果相同
- `rollout status` 會持續輸出直到更新完成（用 Ctrl+C 中斷也沒關係，更新會繼續）
- `rollout history` 預設看不到 CHANGE-CAUSE，需要用 `annotate` 補記錄，或更新時加 `--record`（已 deprecated，建議用 annotate）
- `--to-revision=0` 等於 `undo`（回到上一版），不是回到第一版

---

### ② 所有指令＋講解

---

#### 確認目前版本

```bash
kubectl describe deployment nginx-deploy | grep Image
```

- `describe deployment nginx-deploy`：查看 Deployment 詳細資訊
- `| grep Image`：只過濾出含有「Image」的那行

**打完要看：**
```
    Image:      nginx:1.25
```
確認目前跑的是哪個 nginx 版本，更新前必須先記住這個值。

**異常狀況：**
- 輸出空白 → Deployment 名稱打錯，用 `kubectl get deployment` 確認名稱

---

#### 觸發滾動更新

```bash
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
```

- `set image`：更新指定 Deployment 的 container image
- `deployment/nginx-deploy`：目標是名為 nginx-deploy 的 Deployment
- `nginx=nginx:1.28`：格式是 `容器名稱=新的image`，容器名稱要跟 spec 裡的 `name` 欄位一致

**打完要看：**
```
deployment.apps/nginx-deploy image updated
```
這只是說「已接受更新指令」，不代表更新完成。

**異常狀況：**
- `Error from server (NotFound)`：Deployment 名稱錯誤
- `error: unable to find container named "nginx"`：容器名稱打錯，用 `kubectl describe deployment nginx-deploy` 找到正確的 container name

---

#### 即時觀察更新狀態

```bash
kubectl rollout status deployment/nginx-deploy
```

- `rollout status`：監看滾動更新的進度，持續輸出直到完成

**打完要看：**
```
Waiting for deployment "nginx-deploy" rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deploy" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deploy" successfully rolled out
```
每一行都代表一個進度步驟。最後出現 `successfully rolled out` 才算完成。

**異常狀況：**
- 卡在某一行不動超過 2 分鐘 → 可能 image 拉不下來，開另一個 terminal 跑 `kubectl get pods` 查狀態
- 出現 `error: deployment "nginx-deploy" exceeded its progress deadline` → 超時失敗，需要 undo
- 中途按 `Ctrl+C` 中斷輸出 → **更新仍然在背景繼續進行**，Ctrl+C 只是停止「看」，不是停止更新；若要確認進度，再跑一次 `kubectl rollout status`

---

#### 觀察 ReplicaSet 蹺蹺板

```bash
kubectl get rs
```

- `get rs`：列出所有 ReplicaSet（rs 是縮寫）

**打完要看（更新進行中）：**
```
NAME                       DESIRED   CURRENT   READY   AGE
nginx-deploy-7d9b9b4f8c   2         2         2       5m
nginx-deploy-5c8d9f7b6a   1         1         0       10s
```
- 舊 RS（AGE 較大）的 DESIRED 在減少
- 新 RS（AGE 較小）的 DESIRED 在增加

**打完要看（更新完成後）：**
```
NAME                       DESIRED   CURRENT   READY   AGE
nginx-deploy-7d9b9b4f8c   0         0         0       6m
nginx-deploy-5c8d9f7b6a   3         3         3       1m
```
舊 RS 的 DESIRED=0 但物件還在，這就是回滾備份。

**異常狀況：**
- 看到三個以上的 RS → 之前做過多次更新，全都保留，正常現象

---

#### 查看更新歷史

```bash
kubectl rollout history deployment/nginx-deploy
```

- `rollout history`：列出 Deployment 的歷史版本（revision）

**打完要看：**
```
deployment.apps/nginx-deploy
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```
- REVISION 數字越大越新
- CHANGE-CAUSE 預設是 `<none>`，需要手動補記（見下方 annotate 指令）

**異常狀況：**
- 只有 1 個 revision → 還沒做過更新，或 revisionHistoryLimit 設太小

---

#### 補記更新原因（CHANGE-CAUSE）

```bash
kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"
```

- `annotate`：替 K8s 資源加上 annotation（metadata 的一種）
- `kubernetes.io/change-cause`：這個特定的 key 會顯示在 `rollout history` 的 CHANGE-CAUSE 欄位
- `"update to 1.28"`：自訂說明文字，用雙引號包住

**打完要看：**
```
deployment.apps/nginx-deploy annotated
```
之後再跑 `kubectl rollout history`，CHANGE-CAUSE 欄位就會顯示你寫的說明。

**異常狀況：**
- `error: --overwrite is false but found the following declared annotation(s)` → 這個 key 已存在，要覆蓋需加 `--overwrite` 旗標，完整指令：`kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="..." --overwrite`
- annotation 加在 Deployment 上，不會自動套用到 Pod → `rollout history` 看到的是 Deployment 的 annotation，不是 Pod 的
- 如果想讓每個 revision 都有記錄，要在**每次 set image 之後**立刻跑 annotate，順序不能弄錯

---

#### 故意製造壞掉的更新

```bash
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
```

- 邏輯同前面的 set image，但 `nginx:9.9.9` 這個 tag 不存在
- Docker Hub 上找不到就會 ImagePullBackOff

**打完要看：**
```
deployment.apps/nginx-deploy image updated
```
指令本身成功，但 Pod 會拉不到 image。

**異常狀況：**
- 如果在上一次 set image 還沒完成時就再跑一次 set image → K8s 會以最新的 image 為目標，舊的 rolling update 會被放棄，直接換成最新的。history 裡舊的 revision 仍然保留，可以回滾
- `nginx:9.9.9` 改成其他不存在的 tag 效果一樣，任何拉不到的 image 都會產生 `ErrImagePull` → `ImagePullBackOff`
- 不小心把 image 打對了（真的存在的版本）→ 那就不是「壞掉的更新」，Pod 會正常跑起來；重新跑一次 `set image` 換成真正不存在的 tag

---

#### 觀察失敗的 Pod

```bash
kubectl get pods
```

**打完要看：**
```
NAME                            READY   STATUS             RESTARTS   AGE
nginx-deploy-xxx-aaa            1/1     Running            0          5m
nginx-deploy-xxx-bbb            1/1     Running            0          5m
nginx-deploy-xxx-bbb            1/1     Running            0          5m
nginx-deploy-yyy-ccc            0/1     ImagePullBackOff   0          30s
```
- 舊 Pod 還在跑（這就是滾動更新的好處：壞的新 Pod 不會把舊 Pod 幹掉）
- 新 Pod 卡在 `ImagePullBackOff` 或 `ErrImagePull`

**異常狀況：**
- 所有舊 Pod 都不見了、服務中斷 → maxUnavailable 設太高，或更新策略有問題

---

#### 回滾到上一個版本

```bash
kubectl rollout undo deployment/nginx-deploy
```

- `rollout undo`：回滾到前一個 revision（不加參數就是「上一版」）

**打完要看：**
```
deployment.apps/nginx-deploy rolled back
```
馬上跑 `kubectl get pods` 觀察 Pod 重新變成 Running。

**異常狀況：**
- 如果連做兩次 undo，會在最後兩個版本之間來回跳（不會繼續往更舊的回）

---

#### 回滾到指定版本

```bash
kubectl rollout undo deployment/nginx-deploy --to-revision=1
```

- `--to-revision=1`：指定要回滾到的 revision 號碼，從 `rollout history` 找

**打完要看：**
```
deployment.apps/nginx-deploy rolled back
```
用 `kubectl describe deployment nginx-deploy | grep Image` 確認 image 已換回指定版本。

**異常狀況：**
- `error: unable to find specified revision`：revision 號碼不存在，可能已超過 revisionHistoryLimit（預設 10）
- `--to-revision=0` 效果等同 undo（回到上一版），不是第一版

---
> 📋 **翻頁** → 下一張：學員實作：滾動更新 + 回滾練習

---

### ③ 題目

1. 執行 `kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9` 之後，用什麼指令確認 Pod 出現問題？預期看到什麼狀態？
2. `kubectl rollout undo` 不加任何參數，跑兩次，最後會在哪個版本？為什麼？

### ④ 解答

1. 用 `kubectl get pods` 觀察，會看到新 Pod 的 STATUS 顯示 `ImagePullBackOff` 或 `ErrImagePull`，表示 image 拉取失敗。舊 Pod 仍然是 `Running`（因為滾動更新發現新 Pod 不健康，不會繼續砍舊 Pod）。

2. 假設共有 revision 1、2、3，目前是 revision 3。
   - 第一次 undo → 回到 revision 2
   - 第二次 undo → 回到 revision 3（因為 undo 是「切換到上一版」，而「上一版」現在變成 3）
   結論：連做兩次 undo 會在最後兩個版本之間來回切換，不會繼續往更舊的走。

---

## 5-8 回頭操作 Loop 2 — Lab 2 情境練習（20 分鐘）

### ① 課程內容

**本節目標**
- 先帶做一遍滾動更新三指令（5 分鐘）
- 再給學生做 Lab 2 情境題（15 分鐘）：版本事故，強制用 `--to-revision` 精確回滾

> 📋 學生看 PPT 投影片（5-8 第二張「Lab 2：版本事故」），上面有完整準備環境指令和任務說明。

**帶做順序：**
1. `kubectl set image` 觸發更新
2. `kubectl rollout status` 看進度
3. `kubectl rollout undo` 回滾（帶做）
4. `kubectl rollout history` 查歷史（帶做）
5. `kubectl rollout undo --to-revision=<n>` 指定版本（帶做）

---

### ② 所有指令＋講解

（本節複習已學指令，無新指令，重點在組合應用與 Lab 2 情境。）

---

---
> 📋 **翻頁** → 下一張：Lab 2：版本事故（深夜 11 點）

### ③ 題目（Lab 2：版本事故）

**情境：深夜 11 點，你收到警報。有人把 API 更新到壞掉的版本，服務正在掛掉。**

**準備環境（學生自己跑）：**
```bash
kubectl create deployment night-api --image=httpd:2.4 --replicas=2
kubectl annotate deployment night-api kubernetes.io/change-cause="v1: 正常版本"
kubectl rollout status deployment/night-api
kubectl set image deployment/night-api httpd=httpd:99.99.99
kubectl annotate deployment night-api kubernetes.io/change-cause="v2: 緊急更新（錯誤版本）" --overwrite
```

**任務（不給指令提示，自己想）：**
1. 確認目前 Pod 壞掉的狀態
2. 查部署歷史，找到哪個版本是正常的 `httpd:2.4`
3. 回滾到那個版本（**不准用** `rollout undo` 不帶參數）
4. 驗證 Pod 全部 Running，確認現在跑的是 `httpd:2.4`

**驗收：**
- `kubectl get pods` 全部 Running
- 說出你用哪個指令確認 image 版本

---

### ④ 解答

**Step 1：確認 Pod 狀態**

```bash
kubectl get pods
# 看到 Pod 狀態是 ErrImagePull 或 ImagePullBackOff
kubectl get deploy    # READY: 0/2 或 1/2，說明部分 Pod 壞了
```

**Step 2：查部署歷史**

```bash
kubectl rollout history deployment/night-api
```
```
REVISION  CHANGE-CAUSE
1         v1: 正常版本
2         v2: 緊急更新（錯誤版本）
```
目標版本是 revision 1（httpd:2.4）。

**Step 3：精確回滾到 revision 1**

```bash
kubectl rollout undo deployment/night-api --to-revision=1
```
```
deployment.apps/night-api rolled back
```

**Step 4：驗收**

```bash
# 確認 Pod 全部 Running
kubectl get pods

# 確認 image 版本（方法一：最直接）
kubectl describe deployment night-api | grep Image
# Image: httpd:2.4

# 確認 image 版本（方法二：看 Pod）
kubectl describe pod <pod-name> | grep Image

# 確認 rollout 歷史
kubectl rollout history deployment/night-api
# revision 3 會出現（每次 rollout 都是新的 revision）
```

**清理：**
```bash
kubectl delete deployment night-api
```

**老師補充說明重點：**
- `rollout undo` 不帶參數只回「上一版」——這裡 revision 2 → revision 1，剛好對，但如果有四個 revision 且已 undo 過一次，再 undo 就在最後兩版間來回，永遠跳不到更舊的
- `--to-revision` 才能精確指定任意歷史版本，是生產環境的正確做法
- 每次 rollout（包括 undo）都會產生一個新的 revision，history 越來越長
- 用 `describe deployment | grep Image` 或 `describe pod | grep Image` 都能確認 image，前者看 Deployment spec，後者看 Pod 實際跑的
