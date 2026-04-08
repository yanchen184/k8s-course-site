# Loop 7 指令速查 — DaemonSet + CronJob（下午 5-18, 5-19）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## YAML 檔案準備

**建立 `daemonset.yaml`（課前先備好）**

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

**建立 `cronjob.yaml`（課前先備好）**

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

---

## DaemonSet 實作示範

```bash
# 1. 套用 DaemonSet
kubectl apply -f daemonset.yaml
# 看到：daemonset.apps/log-collector created

# 2. 列出所有 DaemonSet
kubectl get daemonsets
# 或縮寫：
kubectl get ds
# 看到：DESIRED = Node 數量（2 個 Node → DESIRED 2）

# 3. 查看 DaemonSet 詳細資訊
kubectl describe daemonset log-collector
# 重點看：Desired/Current/Available Number of Nodes Scheduled

# 4. 查看 Pod 分布在哪些 Node
kubectl get pods -o wide
# 重點：每個 Node 名稱只出現一次！這就是 DaemonSet 的特性
# log-collector-xxx Running k3s-worker1
# log-collector-yyy Running k3s-worker2
```

---

## CronJob 實作示範

```bash
# 1. 套用 CronJob
kubectl apply -f cronjob.yaml
# 看到：cronjob.batch/hello-cron created

# 2. 列出 CronJob
kubectl get cronjobs
# 或縮寫：
kubectl get cj
# 看到：SCHEDULE=*/1 * * * * / SUSPEND=False / ACTIVE=0 / LAST SCHEDULE=<none>

# 3. 等 1 分鐘後查看 Job（CronJob 每分鐘觸發一次）
kubectl get jobs
# 看到：hello-cron-xxxxxxxxxx  COMPLETIONS 1/1  DURATION 5s

# 4. 查看 CronJob 產生的 Pod
kubectl get pods
# 看到：hello-cron-xxx  STATUS=Completed（跑完就結束，這是正常的）

# 5. 查看 CronJob Pod 的輸出
kubectl get pods                                          # 找到 hello-cron-xxx-yyy 名稱
kubectl logs hello-cron-<job-id>-<pod-suffix>
# 看到：日期時間 + Hello from CronJob

# 6. 再等 1 分鐘，再查看 Job（看 ttlSecondsAfterFinished 效果）
kubectl get jobs
# 60 秒後舊的 Job 和 Pod 自動刪除

# 7. 刪除 CronJob
kubectl delete cronjob hello-cron
# 看到：cronjob.batch "hello-cron" deleted
# 注意：正在執行的 Job/Pod 不會自動刪，需手動清
kubectl delete jobs --all                                 # 清殘留 Job
```
