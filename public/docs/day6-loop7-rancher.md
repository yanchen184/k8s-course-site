# Day 6 Loop 7 — Rancher 叢集管理 GUI

---

## 6-20 RKE + Rancher 概念（~15 min）

### ① 課程內容

管多個叢集用 kubectl 切 context 很痛苦，一不小心就打在 prod 上。Rancher 是 SUSE 出的 K8s 叢集管理平台，Web GUI 同時管多個叢集，不用切 context。今天把 k3s 叢集 import 進 Rancher 來管。

---

### ② 所有指令＋講解

**環境確認**

```bash
kubectl get nodes
```

預期看到：
```
NAME         STATUS   ROLES                  AGE   VERSION
k3s-master   Ready    control-plane,master   3d    v1.28.4+k3s1
k3s-worker1  Ready    <none>                 3d    v1.28.4+k3s1
```

確認叢集正常後，來談 Rancher 是什麼。

---

**為什麼要 Rancher**

kubectl 管單個叢集就夠麻煩了。那如果你有三個叢集——dev、staging、prod——會怎樣？

每次要切 context：
```bash
kubectl config use-context prod-cluster
```

一次巡檢就要打十幾條指令，還要自己在腦中拼湊狀態。更糟的是，你切到 prod 忘了切回來，結果指令打在 prod 上……

這就是 Rancher 要解決的問題。

---

**什麼是 Rancher**

- K8s 叢集管理平台，Web GUI
- 可以同時管多個叢集，不用切 context
- SUSE 公司的產品（同一家公司也做 k3s）
- 完全開源

你在 Rancher 的介面上可以一眼看到所有叢集的狀態，點進去就能操作，不用記哪個叢集的 context 叫什麼名字。

---

**什麼是 RKE**

RKE 全名 Rancher Kubernetes Engine，是 SUSE 官方出的 K8s 安裝工具，專門為生產環境設計。

📄 6-20 第 1 張

| 比較 | k3s | RKE |
|:---|:---|:---|
| 定位 | 輕量、邊緣、學習 | 企業生產環境 |
| 安裝 | curl 一行 | 需要規劃節點和網路 |
| 資源佔用 | 低 | 較高 |
| 功能完整性 | 核心功能齊全 | 功能最完整 |
| Rancher 整合 | 可以管（import 進去） | 完整整合 |

今天的課我們用的還是 k3s，但是把 k3s 叢集 import 進 Rancher 來管。真正的企業環境如果從零建叢集，可能會用 RKE。

---

**Rancher 能做什麼**

1. **叢集總覽**：CPU 使用率、記憶體使用率、Node 數量、Pod 數量，一眼全覽，不用打 kubectl top
2. **工作負載管理**：Deployment、StatefulSet、DaemonSet 列表清楚列出，點 Pod 直接看日誌
3. **Web Terminal**：點按鈕開 Shell 進容器，不用打 kubectl exec
4. **Service Discovery**：所有 Service 和 Ingress，知道哪些服務對外開放
5. **Storage**：所有 PV 和 PVC 狀態一目了然
6. **GUI 操作**：改 replicas 直接改數字、重啟 Pod 按按鈕

---

**kubectl 和 Rancher 的定位**

有人會問：有了 Rancher，還需要 kubectl 嗎？

需要。兩個互補，不是互斥。

| 情境 | 用什麼 |
|:---|:---|
| 日常監控、快速看狀態 | Rancher GUI |
| CI/CD Pipeline、腳本自動化 | kubectl |
| 臨時快速操作 | Rancher GUI |
| 複雜的 patch、dry-run | kubectl |

就像 Vim 和 VS Code，你不會只用一個。

---

### ③ QA

**Q1：k3s 和 RKE 各自適合什麼場景？說出至少兩點差異。**

A：k3s 適合輕量環境、邊緣運算、學習開發——資源佔用低，curl 一行安裝，快速上手。RKE 適合企業生產環境——功能最完整、與 Rancher 深度整合、適合有多個節點和複雜網路需求的環境。

**Q2：為什麼有了 Rancher GUI，還需要保留 kubectl 的操作能力？**

A：kubectl 是自動化的基礎。CI/CD Pipeline 要執行 apply、rollout、scale 這些操作，只能靠指令，不能靠 GUI 點按鈕。腳本、定時任務、GitOps 流程都是靠 kubectl。Rancher 解決的是「人工巡檢和日常操作」，不是「自動化流程」。兩者分工，缺一不可。

---

### ④ 學員實作

本節無操作實作。

---

### ⑤ 學員實作解答

本節無操作實作。

---

## 6-21 Rancher 實作（~12 min）

### ① 課程內容

實作完整的 Rancher 安裝與叢集管理流程：確認 k3s 叢集狀態、安裝 Docker、用 Docker 跑 Rancher、瀏覽器登入設定密碼、把 k3s import 進 Rancher，最後導覽 GUI 功能（看日誌、Web Terminal、scale、Service Discovery、Storage）。

---

### ② 所有指令＋講解

**環境確認**

📄 6-21 第 1 張

```bash
kubectl get nodes
```

預期看到 Ready：
```
NAME         STATUS   ROLES                  AGE   VERSION
k3s-master   Ready    control-plane,master   3d    v1.28.4+k3s1
k3s-worker1  Ready    <none>                 3d    v1.28.4+k3s1
k3s-worker2  Ready    <none>                 3d    v1.28.4+k3s1
```

如果 Node 不是 Ready，先解決叢集問題再繼續。

---

**Step 1：安裝 Docker（如果 master 節點沒有）**

k3s 預設用 containerd，但 Rancher 要用 Docker 來跑（容器跑 Rancher server）。先確認 master 節點有沒有 Docker：

```bash
docker --version
```

打完要看：
```
Docker version 24.0.5, build ced0996
```

沒有的話裝：
```bash
sudo apt install -y docker.io
sudo systemctl enable --now docker
```

- `apt install docker.io`：安裝 Docker CE（Ubuntu 套件名是 docker.io）
- `systemctl enable --now docker`：設定開機自啟 + 立刻啟動

注意：這個 Docker 是用來「跑 Rancher 這個管理容器」，不是用來跑你的應用程式 Pod。k3s 的 Pod 仍然用 containerd 在跑。

---

**Step 2：用 Docker 跑 Rancher**

📄 6-21 第 2 張

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  rancher/rancher:latest
```

參數說明：
- `-d`：背景執行
- `--restart=unless-stopped`：容器崩潰自動重啟，除非你手動 stop
- `-p 80:80 -p 443:443`：把主機的 80 和 443 對應到 Rancher 容器（Rancher Web 介面）
- `--privileged`：Rancher 需要特殊權限才能管理叢集資源

等幾十秒讓 Rancher 初始化。

> **如果 Port 衝突（k3s 的 Traefik 佔了 80 和 443）**：
> ```bash
> docker run -d --restart=unless-stopped \
>   -p 8080:80 -p 8443:443 \
>   --privileged \
>   rancher/rancher:latest
> ```
> 之後瀏覽器就用 `https://<master-IP>:8443` 開。

**確認 Rancher 容器有跑起來**

```bash
docker ps
```

- `docker ps`：列出正在執行的容器

打完要看：
```
CONTAINER ID   IMAGE                    COMMAND           STATUS         PORTS
a1b2c3d4e5f6   rancher/rancher:latest   "entrypoint.sh"   Up 45 seconds  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

STATUS 要是 `Up`，不能是 `Restarting`。

**取得 Bootstrap 初始密碼**

```bash
docker logs <容器ID> 2>&1 | grep "Bootstrap Password:"
```

- `docker logs <容器ID>`：印出容器的 log
- `2>&1`：把 stderr 合併進 stdout，因為 Rancher 的初始密碼輸出在 stderr
- `grep "Bootstrap Password:"`：篩出包含密碼的那行

打完要看：
```
Bootstrap Password: abcd1234efgh5678
```

把這個密碼複製起來。

---

**Step 3：瀏覽器第一次登入**

📄 6-21 第 3 張

1. 打開瀏覽器，輸入 `https://<master-IP>`
2. 看到 HTTPS 憑證警告 → 點「繼續前往」（Rancher 預設用自簽憑證，不影響功能）
3. 輸入剛才的 Bootstrap Password
4. 設定新密碼（自己記住）
5. 確認 Rancher Server URL，通常保留預設（`https://<master-IP>`）

登入後看到 Rancher 的 Home 頁，顯示「Welcome to Rancher」，目前沒有任何叢集。

---

**Step 4：把 k3s 叢集 Import 進 Rancher**

📄 6-21 第 4 張

1. 點左上角「☰」→「Cluster Management」
2. 右上角點「Import Existing」
3. 選「Generic」（通用型，適用於任何 K8s 叢集）
4. Cluster Name 填 `my-k3s-cluster`，點「Create」
5. 複製 Rancher 給你的 `kubectl apply` 指令
6. **回到 k3s master 節點**，執行它：

```bash
kubectl apply -f https://<rancher-IP>/v3/import/xxxxxxxxxxxxxxxx.yaml
```

- `-f https://...`：從 URL 下載 YAML 並套用（這個 YAML 會在 k3s 叢集裡安裝 Rancher agent）

打完要看：
```
namespace/cattle-system created
serviceaccount/cattle created
clusterrolebinding.rbac.authorization.k8s.io/cattle-admin-binding created
...
deployment.apps/cattle-cluster-agent created
```

Rancher 在 k3s 裡裝了一個 agent，agent 會主動連回 Rancher server，讓 Rancher 可以管這個叢集。

等 1-2 分鐘，回 Rancher 介面，叢集狀態從 `Pending` 變 `Active`。

**確認 Rancher agent 有跑起來**

```bash
kubectl get pods -n cattle-system
```

- `-n cattle-system`：指定 namespace，Rancher agent 裝在這個 namespace

打完要看：
```
NAME                                    READY   STATUS    RESTARTS   AGE
cattle-cluster-agent-7d9f5b8c4d-abc12   1/1     Running   0          10m
```

STATUS 要是 `Running`。如果是 `CrashLoopBackOff`，代表 agent 連不回 Rancher server，通常是網路或 URL 問題。

---

**Step 5：GUI 導覽**

📄 6-21 第 5 張

**① Cluster Dashboard**

點進 `my-k3s-cluster`，看 Overview 頁：CPU 使用率、記憶體使用率、Node 列表、Pod 數量。等同於：
```bash
kubectl top nodes
kubectl get nodes
kubectl get pods --all-namespaces
```
但不用打指令，而且更直覺。

**② 看 Pod 日誌**

Workloads → Deployments → 點某個 Pod 右邊「⋮」→「View Logs」：
- 直接在瀏覽器看 Pod 的 stdout log
- 等同於 `kubectl logs <pod-name>`，但不用記 Pod 名稱

**③ Web Terminal（Execute Shell）**

點某個 Pod 右邊「⋮」→「Execute Shell」：
- 瀏覽器直接開出 shell，進入容器
- 等同於 `kubectl exec -it <pod-name> -- /bin/sh`

**④ 用 GUI 做 Scale**

📄 6-21 第 6 張

Deployments → 點 Deployment → Edit Config → 改 Replicas → Save。等同於：
```bash
kubectl scale deployment <name> --replicas=<數字>
```

**⑤ Service Discovery**

左側「Service Discovery」→「Services」：所有 Service 列表（ClusterIP、NodePort、LoadBalancer）
左側「Service Discovery」→「Ingresses」：所有 Ingress 對外的 hostname

**⑥ Storage**

左側「Storage」→「PersistentVolumes」：所有 PV 狀態和 Reclaim Policy
左側「Storage」→「PersistentVolumeClaims」：哪些 PVC 已 Bound、哪些 Pending

---

### ③ QA

**Q：Rancher 的 `Execute Shell` 功能等同於哪個 kubectl 指令？完整寫出指令格式。**

A：`kubectl exec -it <pod-name> -- /bin/sh`（或 `/bin/bash`，看容器裡有什麼 shell）。`-it` 是 interactive + tty，讓終端可以互動輸入。

---

### ④ 學員實作

📄 6-21 第 7 張

**操作題 1：安裝 Rancher 並 import 叢集**

按照步驟完成：
1. 確認 k3s 節點 Ready（`kubectl get nodes`）
2. 確認或安裝 Docker（`docker --version`）
3. 用 Docker 跑 Rancher（`docker run -d --restart=unless-stopped -p 80:80 -p 443:443 --privileged rancher/rancher:latest`）
4. `docker ps` 確認容器 Up
5. 取得初始密碼，瀏覽器登入設定新密碼
6. 把 k3s 叢集 import 進 Rancher，等叢集狀態變 `Active`

**操作題 2：GUI 改 replicas 並用 kubectl 確認**

在 Rancher GUI 上把某個 Deployment 的 replicas 改成 4，然後用 kubectl 確認數量真的改了。

**挑戰題：GUI 建 Deployment**

在 Rancher GUI 上建一個用 `nginx:1.25` 映像、replicas=2、名為 `gui-test` 的 Deployment，建完用 `kubectl get deploy gui-test` 確認存在。

---

### ⑤ 學員實作解答

**操作題 2 解答：**

操作步驟：Workloads → Deployments → 點 Deployment → Edit Config → 改 Replicas 為 4 → Save。

kubectl 確認：
```bash
kubectl get deploy <deployment-name>
# READY 欄位應顯示 4/4
```

**挑戰題解答：**

操作步驟：Workloads → Deployments → 右上角 Create → Name: `gui-test` → Namespace: `default` → Container Image: `nginx:1.25` → Replicas: 2 → Create。

kubectl 確認：
```bash
kubectl get deploy gui-test
```

預期輸出：
```
NAME       READY   UP-TO-DATE   AVAILABLE   AGE
gui-test   2/2     2            2           30s
```

---

## 6-22 回頭操作 Loop 7（~5 min）

### ① 課程內容

📄 6-22 第 1 張

確認 Rancher 叢集 import 正確，處理三個常見坑（Docker 沒裝、Port 衝突、Import 指令在錯誤節點執行），重申 GUI + kubectl 互補定位。

---

### ② 所有指令＋講解

**環境確認指令**

```bash
kubectl get nodes
```

打完要看：
```
NAME         STATUS   ROLES                  AGE   VERSION
k3s-master   Ready    control-plane,master   3d    v1.28.4+k3s1
k3s-worker1  Ready    <none>                 3d    v1.28.4+k3s1
k3s-worker2  Ready    <none>                 3d    v1.28.4+k3s1
```

如果某個節點是 `NotReady`：
```bash
kubectl describe node <node-name>
# 看 Conditions 和 Events 區塊
```

**確認 Rancher agent 在叢集裡有跑**

```bash
kubectl get pods -n cattle-system
```

打完要看：
```
NAME                                    READY   STATUS    RESTARTS   AGE
cattle-cluster-agent-7d9f5b8c4d-abc12   1/1     Running   0          10m
```

STATUS 要是 `Running`。如果是 `CrashLoopBackOff`，代表 agent 連不回 Rancher server，通常是網路或 URL 問題。

---

**三個常見坑**

📄 6-22 第 2 張

**坑 1：Rancher 要 Docker，但 k3s 節點預設用 containerd**

k3s 為了輕量，預設不裝 Docker，用的是 containerd。但跑 Rancher server 這個容器需要 Docker。

在 master 節點上要另外裝：
```bash
sudo apt install -y docker.io && sudo systemctl enable --now docker
```

注意：這個 Docker 是用來「跑 Rancher 這個管理容器」，不是用來跑你的應用程式 Pod。k3s 的 Pod 仍然用 containerd 在跑。

**坑 2：Port 衝突（Traefik 佔了 80 和 443）**

k3s 預設裝了 Traefik 作為 Ingress Controller，Traefik 會佔用 80 和 443。如果直接跑 `-p 80:80 -p 443:443`，Docker 會回報 port 已被佔用。

解決辦法：Rancher 改用其他 port：
```bash
-p 8080:80 -p 8443:443
```

瀏覽器就改用 `https://<master-IP>:8443` 開 Rancher。

**坑 3：Import 指令要在 k3s master 上執行，不是在你的本機打**

```bash
kubectl get nodes    # 確認你在正確的節點上，應該看到 k3s-master 和 worker 節點
```

Rancher 給你的那段 `kubectl apply` 指令要在 k3s master 節點上執行，你的本機可能沒有設定 k3s 的 kubeconfig，打在本機會連錯叢集。

---

**重點強調**

📄 6-22 第 3 張

GUI 很方便，但不能取代 kubectl。

- Rancher GUI：適合日常巡檢、快速查狀態、臨時操作
- kubectl：CI/CD Pipeline、腳本自動化、GitOps、複雜的 patch 操作

兩個都要會。你在公司用 Rancher 管叢集，但遇到緊急狀況、要寫自動化腳本的時候，還是回到 kubectl。

---

**今天學的全部串起來**

📄 6-22 第 4 張

今天 Day 6 從頭到尾做了什麼：

- Loop 1-5（早上）：StatefulSet、Headless Service、PV / PVC、StorageClass——有狀態服務和持久化存儲
- Loop 6（下午前段）：ConfigMap、Secret——應用程式的設定和機敏資料管理
- Loop 7（現在）：Rancher——把這些東西用 GUI 集中管理起來

明天（Day 7）會講 RBAC——誰可以做什麼、權限怎麼分配。有了今天的 Rancher 基礎，明天的 RBAC 設定用 Rancher GUI 做會更直覺。

---

### ③ QA

**Q：為什麼 Rancher GUI 無法完全取代 kubectl，兩者各自的定位是什麼？**

A：Rancher GUI 解決的是「人工巡檢和日常操作」——快速看狀態、臨時改設定、點按鈕看日誌。kubectl 是「自動化流程的基礎」——CI/CD Pipeline、腳本、GitOps、定時任務都靠指令。GUI 不能程式化，也無法放進 Pipeline 自動執行。兩者分工互補，缺一不可。

---

### ④ 學員實作

**確認 Rancher 叢集 Active**

1. 確認叢集節點正常：
```bash
kubectl get nodes
```

2. 確認 Rancher agent 跑起來：
```bash
kubectl get pods -n cattle-system
```

3. 打開 Rancher 介面，確認叢集狀態顯示 `Active`（不是 `Pending`）
4. 點進叢集，看到 Node 列表正確（master + worker 都在）

---

### ⑤ 學員實作解答

**get nodes** 預期輸出：所有節點 STATUS 都是 `Ready`。

**get pods -n cattle-system** 預期輸出：`cattle-cluster-agent-xxx` STATUS 是 `Running`，READY 是 `1/1`。

如果 agent 是 `CrashLoopBackOff`，檢查 Rancher Server URL 是否可從叢集節點連線，通常是防火牆或 URL 填錯造成。
