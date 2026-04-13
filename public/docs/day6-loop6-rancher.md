# Day 6 Loop 6 — Rancher 叢集管理 GUI

---

## 6-20 RKE + Rancher 概念（~15 min）

### ① 課程內容

📄 6-20 第 1 張

先想一個情境。你現在管一個叢集，用 kubectl 就夠了：

```bash
kubectl get nodes
kubectl get pods
```

感覺還好，對不對？但如果你今天管三個叢集——dev、staging、prod——每次操作之前要先切 context：

```bash
kubectl config use-context prod
```

問題是，你切完之後有沒有視覺上的提醒告訴你「你現在在 prod」？沒有。終端機就是一個黑色視窗，context 是文字，你不一定每次都記得看。

然後你打了一個刪除指令，才發現，刪的是 prod 的 Pod。這種事情真的會發生。

kubectl 是 CLI，它天生就沒有「你現在在哪個叢集」這個視覺保護。這就是為什麼管多個叢集，我們需要 GUI 的叢集管理工具。

---

📄 6-20 第 2 張

Rancher 是 SUSE 出的 K8s 叢集管理平台，Web GUI，免費開源。

它有幾個核心功能：

第一，**多叢集管理**。把多個叢集 import 進來，在同一個介面統一管，你永遠看得到你現在操作的是哪個叢集，不會切錯。

第二，**Pod / Deployment 的 GUI 操作**。看 Pod 狀態、改 replicas、查 logs，全部用滑鼠，不用打指令。特別適合有人問你「這個 Pod 怎麼了」的時候，直接點開給他看。

第三，**Kubectl Shell**。在瀏覽器裡開一個 terminal，直接打 kubectl，不用裝本機環境。這對臨時要處理問題的人很方便。

部署方式要注意：Rancher 本身是跑在 Docker 容器裡，不是安裝在 K8s 裡面。它是一個獨立的管理平台，用 Docker 啟動一個容器就好。

---

📄 6-20 第 3 張

今天我們做四件事。

第一，用一行 Docker 指令把 Rancher 跑起來。第二，瀏覽器打開 Rancher GUI，完成初始設定。第三，把我們的 k3s 叢集 import 進 Rancher。第四，用 GUI 觀察 Pod、看 logs、試試 kubectl shell。

整個流程做完，你就知道什麼情況下要用 CLI、什麼情況下用 GUI 比較快。這兩個不是互斥的，是互補的。

我們開始吧。

---

## 6-21 Rancher 實作（~12 min）

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

## 6-22 回頭操作 Loop 7（~5 min）

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
