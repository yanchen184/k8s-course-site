# Day 5 5-15 到 5-16：DaemonSet + CronJob

---

## 5-15 DaemonSet（25 分鐘）

### ① 課程內容

**DaemonSet 的核心概念**

- DaemonSet 確保**每個 Node 上跑且只跑一個 Pod**
- Node 加入叢集 → DaemonSet 自動在新 Node 上建立 Pod
- Node 被移除 → 該 Node 上的 Pod 自動清除
- 不需要手動管理副本數，Pod 數量永遠等於 Node 數量

**適用場景（這些都是 DaemonSet）**

| 類型 | 工具範例 |
|------|---------|
| 日誌收集 agent | Fluentd、Filebeat、Logstash |
| 監控 agent | Prometheus Node Exporter、Datadog agent |
| 網路插件 | kube-proxy（K8s 內建就是 DaemonSet！）、Calico、Flannel |
| 儲存插件 | Ceph、GlusterFS 節點 agent |

**和 Deployment 的核心差別**

| 比較 | Deployment | DaemonSet |
|------|-----------|-----------|
| 副本控制 | 指定 `replicas` 數量 | 跟著 Node 數量走 |
| 適合場景 | 無狀態應用、API server | 每個 Node 都需要的 agent |
| Pod 分布 | K8s scheduler 決定放哪個 Node | 每個 Node 各一個 |
| 縮容到 0 | 可以設 `replicas: 0` | 不行（除非刪掉 DaemonSet）|

**驗證 DaemonSet 的方式**

- `kubectl get pods -o wide` 觀察每個 Node 上都有一個 Pod
- Pod 數量應等於 `kubectl get nodes` 的數量

**本地環境的限制**

- minikube 預設只有 1 個 Node，DaemonSet 只會看到 1 個 Pod
- k3s multipass 多 Node 環境才能真正看出「每個 Node 各一個」的效果
- 學習重點：理解 DaemonSet 的語意，不是要看到多個 Pod

**YAML 結構重點**

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
        - name: fluentd
          image: fluent/fluentd:v1.16
```

- **沒有 `replicas` 欄位**：這是和 Deployment 最大的 YAML 差異
- `selector.matchLabels` + `template.metadata.labels` 必須一致（和 Deployment 相同規則）
- 其他結構（containers、resources、volumes）和 Deployment 幾乎相同，知識可以直接沿用

**Docker 對照**

- Docker 沒有直接對應的概念
- 最接近的是：在每台機器上都執行 `docker run -d fluentd`（但要手動）
- DaemonSet 是把「每台機器都要跑」這件事自動化

---

### ② 所有指令＋講解

**指令 1：套用 DaemonSet YAML**

```bash
kubectl apply -f daemonset.yaml
```

打完要看：
```
daemonset.apps/log-collector created
```

異常：
- `error: DaemonSets "log-collector" is invalid: spec.template.spec.containers[0].image`: image 名稱錯誤，確認 image tag 格式

---

**指令 2：列出所有 DaemonSet**

```bash
kubectl get daemonsets
# 縮寫
kubectl get ds
```

打完要看：
```
NAME            DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
log-collector   2         2         2       2            2           <none>          30s
```

重點欄位：
- `DESIRED`：應有幾個 Pod（等於 Node 數）
- `CURRENT`：目前已建立幾個
- `READY`：幾個已就緒
- `NODE SELECTOR`：如果有限制只跑在特定 Node 會顯示在這

若 `DESIRED != READY`，代表有 Pod 還在啟動或出問題。

---

**指令 3：查看 DaemonSet 詳細資訊**

```bash
kubectl describe daemonset log-collector
```

打完要看（關鍵欄位）：
```
Selector:       app=log-collector
Node-Selector:  <none>
Desired Number of Nodes Scheduled: 2
Current Number of Nodes Scheduled: 2
Number of Nodes Scheduled with Up-to-date Pods: 2
Number of Nodes Scheduled with Available Pods: 2
```

若有 Pod 失敗，在 `Events` 區塊會顯示錯誤訊息。

---

**指令 4：查看 Pod 分布在哪些 Node**

```bash
kubectl get pods -o wide
```

- `-o wide`：顯示額外欄位，包含 `NODE`（Pod 跑在哪個 Node）

打完要看：
```
NAME                  READY   STATUS    RESTARTS   AGE   IP           NODE
log-collector-abc12   1/1     Running   0          1m    10.244.1.5   k3s-worker1
log-collector-def34   1/1     Running   0          1m    10.244.2.6   k3s-worker2
```

**重點：每個 Node 名稱應該只出現一次**，若同一個 Node 有兩個 DaemonSet Pod，代表有問題。

---

### ③ 題目

1. DaemonSet YAML 不需要寫 `replicas`，那 K8s 怎麼決定要跑幾個 Pod？

2. 你有一個叢集有 5 個 Node，部署了一個 DaemonSet。後來又加入 2 個新 Node，不做任何操作，最後 DaemonSet 應該有幾個 Pod？

3. 你想讓 DaemonSet 只跑在 label 是 `disk=ssd` 的 Node 上，YAML 需要加什麼？（提示：`nodeSelector`）

---

### ④ 解答

**解答 1：**
DaemonSet controller 持續監控叢集中的 Node 數量。K8s 有幾個 Node，DaemonSet 就會在每個 Node 建立一個 Pod。Node 加入時自動建，Node 離開時自動刪，不需要人工介入。

**解答 2：**
最終有 **7 個 Pod**。原本 5 個 Node 各 1 個（5 個 Pod），新加入 2 個 Node 後，DaemonSet controller 自動在新 Node 上建立 Pod，總計 7 個。

**解答 3：**
在 YAML 的 `spec.template.spec` 加入 `nodeSelector`：

```yaml
spec:
  template:
    spec:
      nodeSelector:
        disk: ssd
      containers:
        - name: fluentd
          image: fluent/fluentd:v1.16
```

這樣 DaemonSet 只會在有 `disk=ssd` label 的 Node 上建 Pod。

---

## 5-16 CronJob（25 分鐘）

### ① 課程內容

**CronJob 的核心概念**

- CronJob = 定時排程任務，**跑完就結束**（不像 Deployment 會一直跑）
- 等同於 Linux 的 `crontab`，只是在 K8s 上執行

**適用場景**

- 定時備份資料庫（每天凌晨 2 點）
- 定時清理過期資料或暫存檔
- 定時發送報表 email
- 定時 sync 外部資料

**三層結構（重要！）**

```
CronJob（定時排程規則）
  └── Job（每次執行建立一個 Job）
        └── Pod（Job 建立 Pod 來執行實際工作）
```

- CronJob：管理「什麼時候執行」
- Job：管理「這次執行的實例」（保留執行紀錄）
- Pod：實際跑程式的容器

**Cron 時間格式**

```
分 時 日 月 星期
*  *  *  *  *
```

| 範例 | 意義 |
|------|------|
| `0 * * * *` | 每小時整點（0 分時）|
| `*/5 * * * *` | 每 5 分鐘 |
| `0 2 * * *` | 每天凌晨 2 點 |
| `0 9 * * 1` | 每週一早上 9 點 |
| `0 0 1 * *` | 每月 1 號午夜 |

記憶技巧：「分時日月週」，全 `*` 代表「每個」

**Job 和 Pod 完成後的行為**

- Pod 跑完 → 狀態變 `Completed`，**不會自動刪除**
- 若不清理，Pod 會一直累積（每次 CronJob 執行都留一個）
- 解決方法：設 `ttlSecondsAfterFinished`，Job 完成後 N 秒自動刪除 Pod

**concurrencyPolicy（上次沒跑完，這次怎麼辦）**

| 值 | 行為 |
|----|------|
| `Allow`（預設）| 允許多個 Job 同時跑，舊的繼續跑、新的也啟動 |
| `Forbid` | 上次還沒結束，跳過這次 |
| `Replace` | 殺掉上次的 Job，改跑這次 |

**歷史紀錄保留**

- `successfulJobsHistoryLimit`：保留幾個成功的 Job 記錄（預設 3）
- `failedJobsHistoryLimit`：保留幾個失敗的 Job 記錄（預設 1）
- 設為 0 代表不保留（立即刪除），設太大會累積很多廢棄 Pod

**YAML 結構重點**

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/1 * * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      ttlSecondsAfterFinished: 60
      template:
        spec:
          containers:
            - name: hello
              image: busybox:1.36
              command: ["sh", "-c", "date; echo Hello from CronJob"]
          restartPolicy: OnFailure
```

- `restartPolicy: OnFailure`：Pod 失敗才重啟（Job/CronJob 不能用 `Always`）
- `jobTemplate`：CronJob 特有，內嵌 Job 的 spec

**Docker 對照**

| K8s 概念 | Docker 對照 |
|----------|------------|
| CronJob | Linux crontab 呼叫 `docker run`（但要手動管理）|
| Job | `docker run --rm`（跑完刪除）|
| `restartPolicy: OnFailure` | Docker restart policy `on-failure` |

---

### ② 所有指令＋講解

**指令 1：套用 CronJob YAML**

```bash
kubectl apply -f cronjob.yaml
```

打完要看：
```
cronjob.batch/hello-cron created
```

---

**指令 2：列出 CronJob**

```bash
kubectl get cronjobs
# 縮寫
kubectl get cj
```

打完要看：
```
NAME         SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello-cron   */1 * * * *   False     0        <none>          10s
```

重點欄位：
- `SCHEDULE`：cron 時間規則
- `SUSPEND`：是否暫停（`True` 代表暫停中，不會再跑）
- `ACTIVE`：目前正在執行的 Job 數量
- `LAST SCHEDULE`：上次執行時間（`<none>` 代表還沒執行過）

---

**指令 3：等 1 分鐘後查看 Job 是否建立**

```bash
kubectl get jobs
```

打完要看（約 1 分鐘後）：
```
NAME                    COMPLETIONS   DURATION   AGE
hello-cron-1234567890   1/1           5s         90s
```

重點欄位：
- `COMPLETIONS`：`1/1` 代表 1 個 Job 要跑 1 次，已完成 1 次
- `DURATION`：這次 Job 花了多久

每次 CronJob 觸發都會建立一個新 Job，名稱後面會加 timestamp hash。

---

**指令 4：查看 CronJob 產生的 Pod**

```bash
kubectl get pods
```

打完要看：
```
NAME                          READY   STATUS      RESTARTS   AGE
hello-cron-1234567890-xyz12   0/1     Completed   0          2m
```

- `STATUS: Completed`：Pod 跑完正常結束（不是 Running，這是正常的）
- `READY: 0/1`：已完成的 Pod，container 已停止，是正常的

異常：
- `Error`：Pod 跑失敗，用 `kubectl logs` 看錯誤原因
- `CrashLoopBackOff`：Pod 一直重啟失敗，通常是指令寫錯

---

**指令 5：查看 CronJob Pod 的輸出**

```bash
kubectl logs <job-pod-name>
```

例如：
```bash
kubectl logs hello-cron-1234567890-xyz12
```

打完要看：
```
Sat Apr  5 10:00:00 UTC 2026
Hello from CronJob
```

- 確認 CronJob 的指令有正確執行
- 若要查 Job 名稱：先 `kubectl get jobs`，再從 Job 找對應 Pod

---

**指令 6：刪除 CronJob**

```bash
kubectl delete cronjob hello-cron
```

打完要看：
```
cronjob.batch "hello-cron" deleted
```

注意：
- 刪除 CronJob 後，還在執行中的 Job 和 Pod **不會自動刪除**
- 需要手動刪：`kubectl delete jobs --all`（或指定 Job 名稱）
- 已完成的 Pod 也要手動清：`kubectl delete pods --field-selector=status.phase==Succeeded`

---

### ③ 題目

1. CronJob 的 `schedule: "0 9 * * 1-5"` 代表什麼時候執行？

2. 你的 CronJob 每 5 分鐘跑一次，但每次都要跑 10 分鐘才能完成。預設的 `concurrencyPolicy: Allow` 會造成什麼問題？要改成什麼比較好？

3. 你發現叢集裡累積了大量 `Completed` 狀態的 Pod，怎麼用 YAML 設定讓 Job 跑完後 120 秒自動清理？

---

### ④ 解答

**解答 1：**
每週一到週五（`1-5` 代表 Monday 到 Friday）早上 9 點整（`0 9`）執行。`*` 代表每天每月，`1-5` 限制只在週一到週五。

**解答 2：**
`Allow` 允許多個 Job 同時跑。5 分鐘觸發一次，每次跑 10 分鐘，代表還沒跑完就觸發下一次。隨著時間累積，叢集裡會有越來越多 Job 同時在跑，消耗大量資源。

建議改成：
- `Forbid`：上次沒跑完就跳過這次（適合「跑完才重要，錯過沒關係」的場景）
- `Replace`：殺掉上次，改跑最新的（適合「只要最新一次結果」的場景）

**解答 3：**
在 Job spec 加入 `ttlSecondsAfterFinished`：

```yaml
jobTemplate:
  spec:
    ttlSecondsAfterFinished: 120   # 跑完 120 秒後自動刪 Job 和 Pod
    template:
      ...
```

設定後，Job 完成（不論成功或失敗）120 秒後，K8s 自動刪除 Job 及其 Pod。
