# Day 7 Loop 2 — Resource Limits

---

## 7-5 Resource limits 概念（~5 min）

### ① 課程內容

📄 7-5 第 1 張

上一個 Loop 用 Probe 解決了健康檢查的問題。Pod 卡死了 K8s 會自動重啟，還沒準備好的 Pod 不會收到流量。

但現在有另一個問題：你的 Pod 健康了，不代表它是個好公民。

想像你住在一棟公寓，有個鄰居每天用水不關水龍頭，把整棟大樓的水塔抽乾了，其他住戶都沒水用。在 K8s 裡面一樣，一個 Pod 可以不受限制地吃 CPU 和記憶體，把整台 Node 的資源吃光，其他 Pod 全部受影響。

---

📄 7-5 第 2 張

**沒有資源限制的後果**

假設你的 Node 有 4GB 記憶體，上面跑了三個 Pod：

- Pod A：你的 API，正常使用 500MB
- Pod B：你的前端，正常使用 200MB
- Pod C：另一個團隊的應用，程式有記憶體洩漏的 bug，越跑吃越多

如果沒設任何限制，Pod C 會不斷吃記憶體：5 分鐘 500MB、10 分鐘 1GB、20 分鐘 3.5GB。整台 Node 的 4GB 快用完了。

這時候 Linux kernel 的 OOM Killer 會出動，它會選一個 process 殺掉來釋放記憶體。問題是 **OOM Killer 不一定殺 Pod C**，它可能殺你的 API，可能殺你的前端。你的服務掛了，不是因為你的程式有 bug，而是因為隔壁的 Pod 把資源吃光了。

---

📄 7-5 第 3 張

**Docker 的做法：直接設上限**

```bash
docker run --memory=128m --cpus=0.5 nginx
```

設一個記憶體上限 128MB，設一個 CPU 上限半核。超過就被限制。

K8s 也可以設上限，但它比 Docker 多了一個概念：**requests 和 limits**，兩個東西分開。

---

📄 7-5 第 4 張

**requests = 保底（給 Scheduler 排程用的）**

requests 是你告訴 K8s：我的 Pod 至少需要這麼多資源。K8s 的 Scheduler 在決定把 Pod 放到哪台 Node 時，會看 requests。

比如 Pod requests 是 500MB 記憶體，Node A 剩餘 1GB，Node B 剩餘 300MB。Scheduler 把 Pod 放到 Node A，因為 Node B 放不下。requests 就像預約座位，K8s 保證留給你。

**limits = 天花板（程式實際能用的最大量）**

超過天花板會怎樣？CPU 和記憶體不一樣：

- **CPU 超過 limits**：K8s 限速（CPU throttling）。CPU throttling 的意思是 K8s 不會殺你的 Pod，而是暫停它的 CPU 執行時間，讓程式變慢。你的 API 回應從 100ms 變 500ms，但服務還在，不會被殺。跟記憶體不同，記憶體超了直接殺，CPU 超了只是限速。
- **記憶體超過 limits**：K8s 直接殺掉容器。為什麼不像 CPU 一樣限速？因為記憶體不能排隊等，你要寫第 129MB 的資料但只給你 128MB，沒辦法「等一下再寫」。這個狀態叫 **OOMKilled**（Out of Memory Killed）。

---

📄 7-5 第 5 張

**自助餐比喻**

- **requests**：你預約了 2 個座位，餐廳保證留給你，就算餐廳客滿了這 2 個座位也是你的。
- **limits**：你最多只能坐 4 個座位，就算餐廳很空你也不能佔更多。

| | requests | limits |
|:---|:---------|:-------|
| 中文 | 保底 | 天花板 |
| 用途 | Scheduler 排程依據 | 硬限制 |
| 超過怎樣 | 不會超過（保證給你的） | CPU 限速、Memory OOMKilled |

---

📄 7-5 第 6 張

**資源單位**

CPU 的單位是 **millicores（毫核）**：
- `1000m` = 1 個 CPU 核心
- `100m` = 0.1 核，十分之一個核心
- `500m` = 0.5 核，半個核心

為什麼用毫核？容器環境裡很多服務不需要一整個核心，毫核可以做更精細的分配。

記憶體的單位用 **Mi 和 Gi**（注意是 1024 進位，不是 1000 進位）：
- `64Mi` = 64 MiB ≈ 67MB
- `128Mi` = 128 MiB ≈ 134MB
- `1Gi` = 1 GiB ≈ 1.07GB

**YAML 怎麼寫：**

```yaml
resources:
  requests:
    cpu: "100m"      # 保底 0.1 核
    memory: "64Mi"   # 保底 64MB
  limits:
    cpu: "200m"      # 天花板 0.2 核
    memory: "128Mi"  # 天花板 128MB
```

---

📄 7-5 第 7 張

**QoS 三個等級**

K8s 會根據你怎麼設 requests 和 limits，給每個 Pod 一個 QoS 等級。QoS 全名是 Quality of Service，服務品質等級。這個等級不是你手動設的，是 K8s 根據你的 requests/limits 設定自動算出來的。**當 Node 資源不夠的時候，QoS 決定誰先被犧牲。**

| QoS | 條件 | 被殺優先順序 |
|:----|:-----|:------------|
| Guaranteed | requests = limits（兩者都設且相等） | 最高優先，最後被殺 |
| Burstable | 有設 requests，但 requests < limits，或只設其中一個 | 中等優先 |
| BestEffort | 完全沒設 requests 和 limits | 最低優先，**最先被殺** |

**生產環境建議**：
- 至少要設 requests，讓 Pod 是 Burstable 而不是 BestEffort
- 最好 requests 和 limits 都設，能預估用量就設成相等的值，這樣 Pod 是 Guaranteed，最不容易被殺

---

📄 7-5 第 8 張

**Docker vs K8s 對照**

| Docker | K8s |
|:-------|:----|
| `--memory=128m` | `limits.memory: 128Mi` |
| `--cpus=0.5` | `limits.cpu: 500m` |
| 沒有對應 | `requests`（排程用） |

Docker 沒有 requests 的概念，因為 Docker 通常跑在一台機器上，不需要做跨機器排程。K8s 有多台 Node，Scheduler 要決定 Pod 放哪裡，所以需要 requests。

概念講完了，下一支影片我們來親手觸發一個 OOMKilled。

---

## 7-6 Resource limits 實作（~12 min）

### ② 所有指令＋講解

**Step 1：建立 oom-demo.yaml — 故意觸發 OOMKilled**

```yaml
# oom-demo.yaml
apiVersion: v1
kind: Pod
metadata:
  name: oom-demo
spec:
  containers:
    - name: stress
      image: polinux/stress
      command: ["stress"]
      args: ["--vm", "1", "--vm-bytes", "256M", "--vm-hang", "1"]
      resources:
        requests:
          cpu: "100m"
          memory: "64Mi"
        limits:
          cpu: "200m"
          memory: "128Mi"
```

重點說明：

- `image: polinux/stress`：stress 是 Linux 上專門做壓力測試的工具，可以故意吃 CPU 和記憶體。
- `command: ["stress"]`：執行 stress 指令。
- `args: ["--vm", "1", "--vm-bytes", "256M", "--vm-hang", "1"]`：
  - `--vm 1`：啟動 1 個記憶體壓測 worker
  - `--vm-bytes 256M`：讓這個 worker 嘗試佔用 256MB 記憶體
  - `--vm-hang 1`：佔到之後 hang 住不釋放，方便觀察
- `limits.memory: 128Mi`：天花板是 128MB，但程式要吃 256MB。**128MB 擋不住 256MB，必定 OOMKilled**。
- 這次用 Pod 而不是 Deployment，方便直接看到 OOMKilled 狀態，不讓 Deployment 自動重建干擾觀察。

---

**Step 2：部署並觀察 OOMKilled**

```bash
kubectl apply -f oom-demo.yaml
```

馬上開始 watch：

```bash
kubectl get pods oom-demo -w
```

- `-w`：watch 模式，即時看狀態變化。

你會看到：

```
NAME       READY   STATUS    RESTARTS   AGE
oom-demo   0/1     Pending   0          0s
oom-demo   1/1     Running   0          3s
oom-demo   0/1     OOMKilled 0          5s
oom-demo   0/1     CrashLoopBackOff  1  10s
```

發生了什麼：

1. stress 工具啟動，嘗試分配 256MB 記憶體
2. 超過 limits 128MB 的瞬間，K8s 殺掉容器
3. STATUS 變成 `OOMKilled`
4. K8s 嘗試重啟（restartPolicy 預設是 Always）
5. 重啟後 stress 又嘗試吃 256MB，又被殺，又重啟
6. 幾次之後變成 `CrashLoopBackOff`

**CrashLoopBackOff** 表示 Pod 陷入了「啟動 → crash → 重啟」的無限循環。BackOff 是退避的意思，K8s 發現這個容器一直 crash，開始用退避策略：第一次等 10 秒，第二次等 20 秒，第三次等 40 秒，越等越久，避免無效重啟浪費資源。

按 `Ctrl+C` 停止 watch。

---

**Step 3：查看詳細原因**

```bash
kubectl describe pod oom-demo
```

找 Containers 下面的 State 和 Last State：

```
Last State:  Terminated
  Reason:    OOMKilled
  Exit Code: 137
  ...
```

- **OOMKilled**：確認是記憶體超限被殺
- **Exit Code 137**：代表被 SIGKILL 信號殺掉，128 + 9 = 137，9 是 SIGKILL。SIGKILL 是 Linux 的第 9 號信號，強制終止程序，程式無法捕捉或忽略，收到就立刻死。相對的，SIGTERM 是第 15 號信號，程式可以捕捉它來做 graceful shutdown（優雅關閉），把手上的事情做完再退出。OOMKilled 用的是 SIGKILL，不給你善後的機會。

再看 Events：

```
Warning  BackOff    ...  Back-off restarting failed container
```

K8s 告訴你容器一直失敗，已進入退避重啟模式。

---

**Step 4：清理 OOMKilled 的 Pod**

```bash
kubectl delete pod oom-demo
```

---

**Step 5：部署設了合理 limits 的 Deployment**

```yaml
# resource-ok.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-resource-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-resource
  template:
    metadata:
      labels:
        app: nginx-resource
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "50m"
              memory: "32Mi"
            limits:
              cpu: "100m"
              memory: "64Mi"
```

重點說明：

- `requests.cpu: 50m`：保底 0.05 核，排程時保留這些資源
- `requests.memory: 32Mi`：保底 32MB
- `limits.cpu: 100m`：最多用 0.1 核，超過 CPU 限速
- `limits.memory: 64Mi`：最多用 64MB，nginx 正常只用幾 MB，64MB 綽綽有餘

```bash
kubectl apply -f resource-ok.yaml
kubectl get pods -l app=nginx-resource
```

預期輸出：兩個 Pod 都是 Running，RESTARTS 是 0，沒有 OOMKilled。

---

**Step 6：查看實際資源使用量**

```bash
kubectl top pods
```

（需要叢集有安裝 metrics-server）

預期輸出：

```
NAME                                READY   CPU(cores)   MEMORY(bytes)
nginx-resource-demo-xxx-aaa         1/1     1m           3Mi
nginx-resource-demo-xxx-bbb         1/1     1m           3Mi
```

nginx Pod 的 CPU 大概 1m，Memory 大概 2～5Mi，遠低於我們設的 limits（100m / 64Mi）。設 limits 的時候可以先部署跑一陣子，用 `kubectl top pods` 看實際用量，再根據用量的 1.5～2 倍來設合理的 limits。

---

**排錯指令**

```bash
# 確認 Pod 的 QoS class
kubectl describe pod <pod-name> | grep "QoS Class"

# 看 OOMKilled 的 exit code
kubectl describe pod <pod-name> | grep -A5 "Last State"

# Pending 的 Pod 排程失敗原因
kubectl describe pod <pod-name> | grep -A5 "Events"
# 看有沒有 "Insufficient memory" 或 "Insufficient cpu"
```

**三個常見坑**

| 坑 | 症狀 | 解法 |
|----|------|------|
| requests 設太大 | Pod 一直 Pending，`kubectl describe` 看到 `Insufficient memory` | 把 requests 調小，或加更多 Node |
| limits 設太小 | Pod 一直 OOMKilled + CrashLoopBackOff | 用 `kubectl top pods` 看實際用量，limits 設用量的 1.5～2 倍 |
| 完全忘了設 requests | Pod 是 BestEffort，資源緊張時第一個被殺；且 HPA 不能用 | 至少設 requests |

---

### ③ QA

**Q：OOMKilled 和 CrashLoopBackOff 有什麼關係？是同一件事嗎？**

A：不是同一件事，是前後關係。OOMKilled 是原因：容器記憶體超過 limits，被 K8s 強制殺掉，exit code 137。CrashLoopBackOff 是結果：K8s 發現這個容器一直被殺、一直重啟，為了避免無效重啟浪費資源，進入退避模式，等待時間越來越長。你看到 CrashLoopBackOff 就要去查 `kubectl describe pod` 裡的 Last State 和 Exit Code，才知道真正的原因是 OOMKilled 還是其他問題（比如程式 bug 導致 exit 1）。

**Q：CPU 限速（throttling）和 OOMKilled 的使用體驗差在哪？**

A：CPU 限速是服務變慢但不中斷：你的 API 回應時間從 100ms 拉長到 500ms，使用者覺得卡，但請求還是有回應。OOMKilled 是服務中斷：容器直接被殺，正在處理中的請求全部中斷，K8s 要重啟容器才能恢復，中間有一段停機時間。所以記憶體的 limits 比 CPU 的 limits 更需要謹慎設定，設太小直接崩服務。

**Q：BestEffort 的 Pod 真的有被生產環境用的必要嗎？什麼情況下會用？**

A：BestEffort 不適合生產服務，因為資源緊張時它第一個被殺，而且 HPA 沒有 requests 沒辦法計算百分比。但有些場景確實有用：比如批次作業、日誌收集、非關鍵的監控 sidecar，這些即使被殺也沒有即時影響，而且你不確定它要用多少資源，就先讓它用有多少算多少。但這是例外情況，不是默認做法。

**Q：requests 和 limits 應該設一樣嗎？**

A：看情況。設一樣（Guaranteed）的好處是 Pod 最不容易被殺，K8s 給你保留的資源量就是你能用的最大量，穩定可預期。但缺點是如果平常只用 requests 的一半，另一半資源就閒置了，浪費。requests 小於 limits（Burstable）的好處是平常節省資源，高峰期可以用更多。建議做法：先部署跑一段時間，用 `kubectl top pods` 看實際用量，把 requests 設為平均用量，limits 設為峰值用量的 1.5 倍左右。

---

## 7-7 回頭操作 Loop 2（~5 min）

### ④ 學員實作

> 📢 **講師說話口吻**
>
> 好，換你們來觸發 OOMKilled。這是很難忘的體驗，建議大家都自己跑一次。

**🎯 必做題：OOMKilled → 改 limits → Running**

寫一個 oom-demo Pod，設 `limits.memory: 128Mi`，讓 stress 工具吃 256MB，觀察 OOMKilled。然後把 limits 改成 `512Mi`，重新部署，觀察 Pod 正常 Running。

要求：
1. 建立 oom-demo.yaml（stress 吃 256M，limits 128Mi）
2. 部署並用 `kubectl get pods -w` 觀察 OOMKilled
3. `kubectl describe pod oom-demo` 確認 Exit Code 是 137
4. 刪掉 Pod，把 limits.memory 改成 512Mi
5. 重新部署，確認 Pod 狀態是 Running

---

**🏆 挑戰題：比較三種 QoS 等級**

建三個不同的 Pod，一個 Guaranteed、一個 Burstable、一個 BestEffort。用 `kubectl describe pod` 看 QoS Class 欄位，確認三者不同。

要求：
- `qos-guaranteed.yaml`：requests.memory = limits.memory = 64Mi（且 cpu 也要相等）
- `qos-burstable.yaml`：requests.memory: 32Mi，limits.memory: 64Mi
- `qos-besteffort.yaml`：完全不設 resources

驗證：

```bash
kubectl describe pod qos-guaranteed | grep "QoS Class"
kubectl describe pod qos-burstable | grep "QoS Class"
kubectl describe pod qos-besteffort | grep "QoS Class"
```

---

### ⑤ 學員實作解答

**必做解答**

```yaml
# oom-demo.yaml（limits 128Mi，觸發 OOMKilled）
apiVersion: v1
kind: Pod
metadata:
  name: oom-demo
spec:
  containers:
    - name: stress
      image: polinux/stress
      command: ["stress"]
      args: ["--vm", "1", "--vm-bytes", "256M", "--vm-hang", "1"]
      resources:
        requests:
          cpu: "100m"
          memory: "64Mi"
        limits:
          cpu: "200m"
          memory: "128Mi"
```

部署並觀察：

```bash
kubectl apply -f oom-demo.yaml

# 即時觀察狀態（等看到 OOMKilled）
kubectl get pods oom-demo -w

# 確認 Exit Code 137
kubectl describe pod oom-demo
# 找 Last State → Reason: OOMKilled, Exit Code: 137
```

修正後的 YAML（limits 改 512Mi）：

```yaml
# oom-demo.yaml（limits 改為 512Mi，正常 Running）
apiVersion: v1
kind: Pod
metadata:
  name: oom-demo
spec:
  containers:
    - name: stress
      image: polinux/stress
      command: ["stress"]
      args: ["--vm", "1", "--vm-bytes", "256M", "--vm-hang", "1"]
      resources:
        requests:
          cpu: "100m"
          memory: "64Mi"
        limits:
          cpu: "200m"
          memory: "512Mi"    # 改這裡：512Mi > stress 要吃的 256M
```

重新部署：

```bash
kubectl delete pod oom-demo
kubectl apply -f oom-demo.yaml
kubectl get pods oom-demo -w
# 這次應該保持 Running
```

---

**三個常見坑**

1. **requests 設太大，Pod 一直 Pending**：你的 Node 只有 2GB 記憶體，但 requests 設了 4Gi，Scheduler 找不到任何 Node 能放這個 Pod。`kubectl describe pod` 的 Events 會看到 `Insufficient memory`。解法：調小 requests，或加更多 Node。

2. **limits 設太小，一直 OOMKilled**：程式正常需要 200MB，但 limits 只給 128Mi，一跑起來就超過，馬上 OOMKilled。解法：先用 `kubectl top pods` 看程式實際用多少記憶體，limits 設實際用量的 1.5～2 倍。

3. **忘了設 requests，HPA 不能用**：Pod 變成 BestEffort，資源緊張時第一個被殺。更嚴重的是後面學 HPA，HPA 是根據 requests 的百分比來算什麼時候要擴縮，沒有 requests 就沒有基準，HPA 根本啟動不了。生產環境一定要設 requests。

---

**清理**

```bash
kubectl delete pod oom-demo
kubectl delete -f resource-ok.yaml

# 確認清乾淨
kubectl get all
# 只剩 service/kubernetes 就對了
```
