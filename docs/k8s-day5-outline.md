# 第五堂講稿大綱 — 從單機到叢集：Deployment 與 Service
> 格式：① 課程內容（條列）② 所有指令＋講解 ③ 題目 ④ 解答
> 總時長約 7hr

---

## 一、開場 + 環境升級（25min）

### ① 課程內容

**第四堂回顧**
- K8s 架構：Master（API Server / etcd / Scheduler / Controller Manager）+ Worker（kubelet / kube-proxy / Container Runtime）
- YAML 四欄位：apiVersion / kind / metadata / spec
- Pod：K8s 最小部署單位
- kubectl 五指令：get / describe / logs / exec / delete
- 排錯三板斧：get 看狀態 → describe 看 Events → logs 看日誌
- 拋出問題：「Pod 掛了沒人重建，怎麼讓 K8s 自動維持 3 個 Pod 在跑？」→ 今天的答案是 Deployment

**為什麼要從 minikube 換到 k3s**
- minikube 是單節點的限制：
  - 所有 Pod 擠在同一個 Node，看不出分散部署的效果
  - NodePort 只有一個 Node IP，體會不到「任何 Node 都能進」
  - DaemonSet（每個 Node 跑一份）只有一個 Node，跟普通 Pod 沒差別
- k3s：Rancher Labs 開源的輕量版 Kubernetes，完全相容 K8s API，一行指令安裝完成
- Multipass：Canonical（Ubuntu 母公司）出品，一行指令建 Ubuntu VM

### ② 所有指令＋講解

**安裝 Multipass**
```bash
brew install multipass      # macOS
choco install multipass     # Windows
sudo snap install multipass # Linux
```

---

**建立 3 台 VM**
```bash
multipass launch --name k3s-master --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker1 --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker2 --cpus 2 --memory 2G --disk 10G
```
- `--name`：VM 名稱
- `--cpus`：分配 CPU 核心數
- `--memory`：分配記憶體（建議至少 2G，k3s 最低需求 512M）
- `--disk`：分配硬碟空間

打完要看：
```
Launched: k3s-master
Launched: k3s-worker1
Launched: k3s-worker2
```
- 若出現 `launch failed`：確認 Multipass 有安裝成功，或電腦記憶體不足要調小

---

**在 master 安裝 k3s server**
```bash
multipass exec k3s-master -- bash -c "curl -sfL https://get.k3s.io | sh -"
```
- `multipass exec <vm名> -- <指令>`：在指定 VM 內執行指令
- `curl -sfL`：`-s` 靜音、`-f` 失敗不輸出錯誤、`-L` 跟隨重導向
- `| sh -`：把下載的安裝腳本直接用 sh 執行

打完要看：
```
[INFO]  Finding release for channel stable
[INFO]  Using v1.xx.x+k3s1 as release
[INFO]  Downloading hash ...
[INFO]  Downloading binary k3s ...
[INFO]  Verifying binary download
[INFO]  Installing k3s to /usr/local/bin/k3s
...
[INFO]  systemd: Starting k3s
```
- 最後看到 `Starting k3s` 代表安裝完成並已啟動

---

**取得 join token 和 master IP**
```bash
TOKEN=$(multipass exec k3s-master -- sudo cat /var/lib/rancher/k3s/server/node-token)
MASTER_IP=$(multipass info k3s-master | grep IPv4 | awk '{print $2}')
```
- `node-token`：worker 用來認證「有權加入這個叢集」的憑證（類似 Docker Swarm 的 join token）
- `multipass info k3s-master`：顯示 VM 資訊
- `grep IPv4 | awk '{print $2}'`：從輸出中取出 IP 那一行的第二欄

確認有值：
```bash
echo $TOKEN    # 應該看到一長串 token
echo $MASTER_IP # 應該看到 IP 地址，如 192.168.64.5
```

---

**worker 加入叢集**
```bash
for i in 1 2; do
  multipass exec k3s-worker$i -- bash -c \
    "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$TOKEN sh -"
done
```
- `K3S_URL`：master 的 API Server 地址，port 6443 是 K8s API Server 預設 port
- `K3S_TOKEN`：認證憑證

打完要看（每台 worker 都會有類似輸出）：
```
[INFO]  Using v1.xx.x+k3s1 as release
...
[INFO]  systemd: Starting k3s-agent
```
- `k3s-agent` 代表這台是 worker，`k3s` 代表是 master/server

---

**驗證三節點**
```bash
multipass exec k3s-master -- sudo kubectl get nodes
```

打完要看：
```
NAME          STATUS   ROLES                  AGE   VERSION
k3s-master    Ready    control-plane,master   2m    v1.xx.x+k3s1
k3s-worker1   Ready    <none>                 1m    v1.xx.x+k3s1
k3s-worker2   Ready    <none>                 1m    v1.xx.x+k3s1
```
- `STATUS`：Ready = 正常，NotReady = kubelet 還在啟動，等 30 秒再看
- `ROLES`：master 顯示 control-plane，worker 顯示 none
- 全部 Ready 才能繼續

---

**把 kubeconfig 複製到本機**
```bash
multipass exec k3s-master -- sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/k3s-config
sed -i "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config
export KUBECONFIG=~/.kube/k3s-config
```
- `k3s.yaml`：kubeconfig 檔，包含叢集連線資訊和認證憑證
- 預設 IP 是 127.0.0.1（本機迴圈），要換成 master 的實際 IP
- `KUBECONFIG`：告訴 kubectl 要用哪個設定檔

**驗證本機可以連線**
```bash
kubectl get nodes
```

打完要看：同上，看到 3 個 Ready 的 Node，代表本機 kubectl 可以直接操作叢集了

### ③ 題目
> 你現在有 3 個 Node。說出這三個 Node 各自的角色，以及每個角色負責什麼事。

### ④ 解答
- `k3s-master`：control-plane（Master Node），負責管理叢集狀態，跑 API Server / etcd / Scheduler / Controller Manager
- `k3s-worker1` / `k3s-worker2`：worker，實際跑應用程式容器的地方，跑 kubelet / kube-proxy / Container Runtime

---

## 二、Deployment（45min）

### ① 課程內容

**痛點：Pod 的脆弱**
- 直接建的 Pod 被 delete → 消失，沒人補回來
- 生產環境意義：Pod 是你的 API，掛了 = 使用者 503
- 需要解決三件事：① 自動重建 ② 多副本分散風險 ③ 換版本不停機

**Deployment 三層結構**
- Deployment → ReplicaSet → Pod
- 你只需要管 Deployment，ReplicaSet 由 Deployment 自動建立
- ReplicaSet 的職責：確保「Pod 數量 = 期望數量」，少了就補，多了就刪
- 為什麼要有 ReplicaSet 這一層（重點）：
  - 更新版本時，新舊 ReplicaSet 同時存在（新的在擴容、舊的在縮減）
  - 回滾時，舊 ReplicaSet 直接重新擴容，不需要重新 build image
  - 若 Deployment 直接管 Pod，更新時必然停機

**Deployment YAML 三個新欄位**
- `replicas`：要維持幾個 Pod 副本
- `selector.matchLabels`：Deployment 用什麼 label 找到自己的 Pod
- `template`：Pod 的範本，裡面的結構就是 Pod YAML 的 metadata + spec
- ⚠️ `selector.matchLabels` 和 `template.metadata.labels` 必須完全一致，否則 Deployment 找不到自己的 Pod，會一直新建

**apiVersion 的差異**
- Pod / Service / Namespace → `v1`
- Deployment / ReplicaSet → `apps/v1`

**容器名稱（containers[].name）的用途**
- 之後 `kubectl set image` 指令要用到這個名稱
- 多容器 Pod 時用來區分不同容器

**自我修復（Self-Healing）**
- ReplicaSet 的 Controller Loop：持續監控實際 Pod 數 vs 期望 Pod 數
- 偵測到少了 → 馬上建新 Pod（不等、不問你）
- 新 Pod 名字不同（random hash 會變）

**擴縮容**
- `kubectl scale` 指令即時修改副本數
- 擴容：K8s 選擇資源最充裕的 Node 放新 Pod（k3s 多節點才看得到分散效果）
- 縮容：多的 Pod 進入 Terminating 狀態後消失

**滾動更新（Rolling Update）**
- 預設策略：建一個新 Pod → 砍一個舊 Pod → 重複，直到全換完
- 全程有 Pod 在服務，使用者感覺不到
- 底層：新 ReplicaSet 副本 0→N，舊 ReplicaSet 副本 N→0（同時進行）
- 舊 ReplicaSet 不刪除（Pod 數變 0 但物件保留），為回滾保留

**回滾**
- `rollout undo` 把舊 ReplicaSet 重新擴容，新 ReplicaSet 縮減
- 可指定 `--to-revision` 回到任意歷史版本
- 版本歷史用 `rollout history` 查看，預設保留 10 個版本

### ② 所有指令＋講解

**部署 Deployment**
```bash
kubectl apply -f deployment.yaml
```

打完要看：
```
deployment.apps/nginx-deploy created
```
- `created`：第一次建立
- `configured`：已存在，套用了變更
- `unchanged`：沒有變更，不做任何事

---

**查看 Deployment**
```bash
kubectl get deployments
kubectl get deploy   # 縮寫
```

打完要看：
```
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deploy   3/3     3            3           30s
```
- `READY`：`就緒數/期望數`，3/3 = 全部就緒，0/3 = Pod 還在建立或有問題
- `UP-TO-DATE`：已更新到最新版本的 Pod 數（更新進行中時會小於 READY）
- `AVAILABLE`：目前可接受流量的 Pod 數（Ready 但不一定 Available）
- 若 READY 一直是 0/3：先用 `kubectl describe deployment` 看 Events

---

**查看 ReplicaSet**
```bash
kubectl get replicasets
kubectl get rs   # 縮寫
```

打完要看：
```
NAME                     DESIRED   CURRENT   READY   AGE
nginx-deploy-7d9d8c9b4   3         3         3       30s
```
- 名字格式：`<deployment名>-<pod-template-hash>`（hash 是 template 的 hash，template 變了 hash 就變）
- `DESIRED`：期望的 Pod 數
- `CURRENT`：目前存在的 Pod 數（含正在建立的）
- `READY`：已就緒可服務的 Pod 數

---

**查看 Pod**
```bash
kubectl get pods
```

打完要看：
```
NAME                           READY   STATUS    RESTARTS   AGE
nginx-deploy-7d9d8c9b4-abcde   1/1     Running   0          30s
nginx-deploy-7d9d8c9b4-fghij   1/1     Running   0          30s
nginx-deploy-7d9d8c9b4-klmno   1/1     Running   0          30s
```
- 名字格式：`<deployment名>-<rs-hash>-<random>`（三段）
- `READY`：`就緒容器數/總容器數`，1/1 = 正常
- `STATUS`：Running = 正常；ContainerCreating = 建立中；ImagePullBackOff = 拉 image 失敗；CrashLoopBackOff = 容器一直啟動失敗

---

**查看 Pod 分散在哪個 Node（k3s 多節點才有意義）**
```bash
kubectl get pods -o wide
```

打完要看：
```
NAME                          READY  STATUS   ... IP           NODE
nginx-deploy-7d9d8c9-abcde    1/1    Running  ... 10.42.1.5    k3s-worker1
nginx-deploy-7d9d8c9-fghij    1/1    Running  ... 10.42.2.3    k3s-worker2
nginx-deploy-7d9d8c9-klmno    1/1    Running  ... 10.42.1.6    k3s-worker1
```
- `-o wide`：輸出額外欄位（IP / NODE / NOMINATED NODE / READINESS GATES）
- `NODE` 欄位：可以看到 Pod 分散在不同 Node，這是 minikube 看不到的效果

---

**查看 Deployment 詳細資訊**
```bash
kubectl describe deployment nginx-deploy
```

打完要看（重點欄位）：
```
Replicas:   3 desired | 3 updated | 3 total | 3 available | 0 unavailable
Selector:   app=nginx
Pod Template:
  Labels:   app=nginx
  Containers:
    nginx:
      Image:  nginx:1.27
Events:
  ScalingReplicaSet "Scaled up replica set nginx-deploy-xxx to 3"
```
- `Events` 區塊：顯示最近發生的事件，排錯的起點
- `Selector` 和 `Pod Template Labels` 必須一致（這裡可以驗證）

---

**刪掉一個 Pod 測試自我修復**
```bash
# 先記下一個 Pod 名字
kubectl get pods

# 刪掉它
kubectl delete pod nginx-deploy-7d9d8c9b4-abcde

# 馬上看（要快）
kubectl get pods
```

打完要看：
```
NAME                           READY   STATUS              RESTARTS   AGE
nginx-deploy-7d9d8c9b4-fghij   1/1     Running             0          2m
nginx-deploy-7d9d8c9b4-klmno   1/1     Running             0          2m
nginx-deploy-7d9d8c9b4-pqrst   0/1     ContainerCreating   0          2s   ← 新的！
```
- 新 Pod 的名字最後一段不同（random hash 重新生成）
- AGE 只有幾秒（剛被 ReplicaSet 建立）
- 幾秒後再看，STATUS 變成 Running

---

**擴容**
```bash
kubectl scale deployment nginx-deploy --replicas=5
```
- `deployment`：資源類型
- `nginx-deploy`：資源名稱
- `--replicas=5`：目標副本數

打完要看：
```
deployment.apps/nginx-deploy scaled
```

然後看 Pod：
```bash
kubectl get pods
```
```
NAME                           READY   STATUS              RESTARTS   AGE
nginx-deploy-xxx-abcde         1/1     Running             0          5m
nginx-deploy-xxx-fghij         1/1     Running             0          5m
nginx-deploy-xxx-klmno         1/1     Running             0          5m
nginx-deploy-xxx-uvwxy         0/1     ContainerCreating   0          2s   ← 新增的
nginx-deploy-xxx-zzzzz         0/1     ContainerCreating   0          2s   ← 新增的
```
- 多出來的 2 個先是 ContainerCreating，幾秒後變 Running
- `kubectl get pods -o wide` 可以看到新 Pod 被分配到哪個 Node

---

**縮容**
```bash
kubectl scale deployment nginx-deploy --replicas=3
```

打完要看（get pods）：
```
NAME                           READY   STATUS        RESTARTS   AGE
nginx-deploy-xxx-abcde         1/1     Running       0          5m
nginx-deploy-xxx-fghij         1/1     Running       0          5m
nginx-deploy-xxx-klmno         1/1     Running       0          5m
nginx-deploy-xxx-uvwxy         1/1     Terminating   0          1m   ← 被刪除中
nginx-deploy-xxx-zzzzz         1/1     Terminating   0          1m   ← 被刪除中
```
- `Terminating`：Pod 正在優雅關閉（等容器把進行中的請求處理完再關）
- 幾秒後這兩個消失，只剩 3 個

---

**確認目前的 image 版本**
```bash
kubectl describe deployment nginx-deploy | grep Image
```

打完要看：
```
    Image:  nginx:1.27
```

---

**滾動更新**
```bash
kubectl set image deployment/nginx-deploy nginx=nginx:1.28
```
- 格式：`kubectl set image deployment/<deployment名> <容器名>=<新image>`
- `nginx`（等號左邊）：YAML 裡 `containers[].name` 定義的容器名稱
- `nginx:1.28`（等號右邊）：新的 image

打完要看：
```
deployment.apps/nginx-deploy image updated
```

---

**即時觀察滾動更新進度**
```bash
kubectl rollout status deployment/nginx-deploy
```

打完要看：
```
Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for rollout to finish: 2 old replicas are pending termination...
deployment "nginx-deploy" successfully rolled out
```
- 每一行代表一個步驟，更新速度取決於 Pod 啟動時間
- `Ctrl+C` 可以中斷觀察，但不會中斷更新本身
- 若一直沒有 `successfully rolled out`：可能是新 image 有問題，用 `kubectl get pods` 查看

---

**查看版本歷史**
```bash
kubectl rollout history deployment/nginx-deploy
```

打完要看：
```
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```
- `REVISION`：版本號，數字越大越新
- `CHANGE-CAUSE`：預設是 none，可以用 `kubectl annotate` 加說明
- 若要記錄原因：`kubectl annotate deployment nginx-deploy kubernetes.io/change-cause="update to 1.28"`

---

**故意更新到不存在的 image**
```bash
kubectl set image deployment/nginx-deploy nginx=nginx:9.9.9
```

然後看：
```bash
kubectl get pods
```

打完要看：
```
NAME                           READY   STATUS             RESTARTS   AGE
nginx-deploy-old-hash-abcde    1/1     Running            0          5m  ← 舊的還活著
nginx-deploy-old-hash-fghij    1/1     Running            0          5m  ← 舊的還活著
nginx-deploy-new-hash-zzzzz    0/1     ImagePullBackOff   0          30s ← 新的壞了
```
- 舊版本的 Pod 還在跑！滾動更新不會先砍舊的
- 服務還在，只是更新卡住了
- `ImagePullBackOff`：K8s 嘗試拉 image 失敗，進入退避重試狀態

```bash
kubectl rollout status deployment/nginx-deploy
# 會卡住，Ctrl+C 中斷
```

---

**回滾**
```bash
kubectl rollout undo deployment/nginx-deploy
```
- 不加參數：回到上一個版本（revision N-1）

打完要看：
```
deployment.apps/nginx-deploy rolled back
```

然後看 Pod：
```bash
kubectl get pods
```
```
NAME                           READY   STATUS    RESTARTS   AGE
nginx-deploy-old-hash-abcde    1/1     Running   0          10m
nginx-deploy-old-hash-fghij    1/1     Running   0          10m
nginx-deploy-old-hash-klmno    1/1     Running   0          10s  ← 新補的（舊版本）
```
- 壞掉的新 Pod 被砍掉，舊 ReplicaSet 重新擴容

---

**回滾到指定版本**
```bash
kubectl rollout undo deployment/nginx-deploy --to-revision=1
```
- `--to-revision`：指定要回到的 revision 號碼（從 `rollout history` 查）

---

**查看 ReplicaSet 的版本狀況**
```bash
kubectl get rs
```

打完要看（更新後）：
```
NAME                     DESIRED   CURRENT   READY   AGE
nginx-deploy-new-hash    3         3         3       2m   ← 新版本，副本數 3
nginx-deploy-old-hash    0         0         0       10m  ← 舊版本，副本數 0（保留備回滾）
```
- 舊 ReplicaSet 的 DESIRED=0 但物件還在
- 回滾後舊 RS 的 DESIRED 會重新變 3，新 RS 變 0

### ③ 題目
1. 你建了一個 Deployment 但發現 `READY` 一直是 `0/3`，有哪些可能的原因？你會用什麼指令排查？
2. 你剛把版本從 nginx:1.27 更新到 nginx:1.28，但發現 1.28 有 bug。最快回到 1.27 的指令是什麼？
3. `kubectl scale deployment nginx-deploy --replicas=5` 打完後，用哪個指令確認 Pod 是否有分散到不同 Node？

### ④ 解答
1. 可能原因：image 名稱打錯（ImagePullBackOff）/ image 不存在（ErrImagePull）/ selector 跟 Pod label 不一致（Pod 一直被建但不被認領）/ 資源不足（Pending）。排查：先 `kubectl get pods` 看 STATUS → 再 `kubectl describe pod <name>` 看 Events → 再 `kubectl describe deployment` 看 Events
2. `kubectl rollout undo deployment/nginx-deploy`（回到上一版）
3. `kubectl get pods -o wide`，看 NODE 欄位

---

## 三、Service（40min）

### ① 課程內容

**Pod IP 的兩個問題**
- 問題一：IP 會變，Pod 被重建後 IP 不同，寫死 IP 的前端會斷線
- 問題二：有多個 Pod 不知道連哪個；只連一個 = 其他閒置 + 那個掛了就斷

**Service 解決的事**
- 提供一個永遠不變的 ClusterIP 和 DNS 名稱
- 自動把流量分配到後面所有健康的 Pod（負載均衡）
- 透過 Label Selector 找 Pod，Pod 增減時 Endpoints 自動更新

**Label Selector 運作方式**
- Service 的 `spec.selector` = 找符合這些 label 的 Pod
- 和 Deployment 的 selector 機制相同
- `kubectl get endpoints` 可以看到 Service 目前指向哪些 Pod IP

**ClusterIP 類型**
- Service 的預設類型
- 分配一個叢集內部虛擬 IP，只有叢集內的 Pod 能連到
- 適合：微服務間互連（前端連 API、API 連 DB）

**`port` vs `targetPort`**
- `port`：Service 自己監聽的 port，叢集內其他 Pod 連 Service 時用這個
- `targetPort`：Service 把流量轉發到 Pod 的哪個 port
- 兩者可以不同（如 Service:8080 → Pod:80）
- Docker 對照：`docker run -p <port>:<targetPort>`

**NodePort 類型**
- 在每個 Node 上開同一個 port（範圍 30000-32767）
- 外部流量可以從任何 Node 的這個 port 進來
- 三層路徑：外部 → Node:nodePort → Service:port → Pod:targetPort
- 可以自己指定 nodePort，也可以不寫讓 K8s 隨機分配

**三種 Service 類型**
- ClusterIP：叢集內部，微服務互連用
- NodePort：包含 ClusterIP，額外開 Node 上的 port，測試用
- LoadBalancer：包含 NodePort，額外申請雲端負載均衡器，生產用
- 遞增包含關係：ClusterIP ⊂ NodePort ⊂ LoadBalancer

### ② 所有指令＋講解

**建立 ClusterIP Service**
```bash
kubectl apply -f service-clusterip.yaml
```

打完要看：
```
service/nginx-svc created
```

---

**查看所有 Service**
```bash
kubectl get services
kubectl get svc   # 縮寫
```

打完要看：
```
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1     <none>        443/TCP   1h   ← 系統自帶，不用管
nginx-svc    ClusterIP   10.96.45.23   <none>        80/TCP    10s
```
- `TYPE`：Service 類型
- `CLUSTER-IP`：分配到的叢集內部虛擬 IP（ClusterIP 才有，NodePort/LB 也有）
- `EXTERNAL-IP`：外部 IP（NodePort 是 none，LoadBalancer 才有）
- `PORT(S)`：`80/TCP` = Service 監聽 80；`80:30080/TCP` = Service:80 對應 Node:30080

---

**查看 Service 詳細資訊**
```bash
kubectl describe service nginx-svc
kubectl describe svc nginx-svc   # 縮寫
```

打完要看：
```
Name:              nginx-svc
Selector:          app=nginx
Type:              ClusterIP
IP:                10.96.45.23
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.42.1.5:80, 10.42.2.3:80, 10.42.1.6:80
```
- `Selector`：Service 用什麼 label 找 Pod
- `Endpoints`：目前 Service 背後的 Pod IP 列表
- ⚠️ 若 `Endpoints: <none>`：selector 跟 Pod label 不一致，要檢查

---

**查看 Endpoints**
```bash
kubectl get endpoints nginx-svc
kubectl get ep nginx-svc   # 縮寫
```

打完要看：
```
NAME        ENDPOINTS                                   AGE
nginx-svc   10.42.1.5:80, 10.42.2.3:80, 10.42.1.6:80  5m
```
- Endpoints 的 IP 會隨著 Pod 重建自動更新
- Pod 多了：新 IP 加進來；Pod 少了：舊 IP 移除

---

**建立臨時 Pod 從叢集內部驗證 ClusterIP**
```bash
kubectl run test-curl \
  --image=curlimages/curl \
  --rm \
  -it \
  --restart=Never \
  -- sh
```
- `--image=curlimages/curl`：包含 curl 工具的輕量 image
- `--rm`：離開 shell 後自動刪除這個 Pod
- `-it`：`-i` 保持 stdin 開啟，`-t` 分配 TTY（互動終端）
- `--restart=Never`：不自動重啟（這是一次性 Pod，不是 Deployment 管的）
- `-- sh`：進入 shell（`--` 之後的內容是容器的指令）

進去後打：
```bash
curl http://nginx-svc       # 用 Service 名稱連線
curl http://nginx-svc       # 再試一次
curl http://nginx-svc       # 再試一次
exit
```

打完要看：
```html
<!DOCTYPE html>
<html>
<head><title>Welcome to nginx!</title></head>
...
```
- 每次 curl 都成功 = Service 的負載均衡正常
- 用的是名稱 `nginx-svc` 而不是 IP（DNS 解析）
- 輸入 `exit` 後，Pod 自動刪除（因為 `--rm`）

---

**建立 NodePort Service**
```bash
kubectl apply -f service-nodeport.yaml
```

打完要看：
```
service/nginx-nodeport created
```

---

**查看 NodePort（觀察 PORT(S) 欄位）**
```bash
kubectl get svc
```

打完要看：
```
NAME             TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)
nginx-nodeport   NodePort   10.96.x.x     <none>        80:30080/TCP
```
- `80:30080/TCP`：Service port 80 對應到 Node port 30080
- 左邊（80）= `port`，右邊（30080）= `nodePort`

---

**從外部連線（k3s）**
```bash
# 取得任意 Worker Node 的 IP
multipass info k3s-worker1 | grep IPv4

# 用 Node IP + nodePort 連線
curl http://<worker1-ip>:30080

# 換 worker2 也能連到同一個服務！
multipass info k3s-worker2 | grep IPv4
curl http://<worker2-ip>:30080
```

打完要看：
```html
<!DOCTYPE html>
<html>
<head><title>Welcome to nginx!</title></head>
...
```
- 兩個 Node 都能連到服務，這就是 NodePort 「任何 Node 都能進」的意義
- 背後靠 kube-proxy 在每個 Node 上設定 iptables 規則

---

**從外部連線（minikube）**
```bash
minikube ip
curl http://<ip>:30080

# 或讓 minikube 自動開瀏覽器
minikube service nginx-nodeport
```

---

**刪掉 NodePort Service（後面 Lab 用 ClusterIP 就夠）**
```bash
kubectl delete svc nginx-nodeport
```

打完要看：
```
service "nginx-nodeport" deleted
```

### ③ 題目
1. `kubectl describe svc nginx-svc` 看到 `Endpoints: <none>`，可能的原因是什麼？怎麼修？
2. NodePort 的三個 port（`port` / `targetPort` / `nodePort`）各自的作用是什麼？用一句話說明。
3. ClusterIP 和 NodePort 的差別是什麼？什麼情況下用哪個？

### ④ 解答
1. 原因：Service 的 `spec.selector` 跟 Pod 的 `metadata.labels` 不一致。排查：`kubectl describe svc` 看 Selector，`kubectl get pods --show-labels` 看 Pod 的 label，對比是否一致。修法：修改 Service 的 selector 或 Pod 的 label，讓兩者一致。
2. `port`：叢集內部連 Service 時用的 port；`targetPort`：Service 轉發給 Pod 的 port；`nodePort`：從叢集外部、連 Node 的 IP 時用的 port（30000-32767）
3. ClusterIP 只能叢集內部連（適合微服務互連）；NodePort 在每個 Node 上開 port，外部可以用 Node IP + port 連（適合測試環境）

---

## 四、DNS 與服務發現（20min）

### ① 課程內容

**剛才發生了什麼**
- 在 Pod 裡用 `curl http://nginx-svc`，沒用 IP 就連到了 Service
- 這是因為 K8s 內建的 DNS 服務：CoreDNS

**CoreDNS 的運作**
- CoreDNS 跑在 `kube-system` Namespace，是一個 Pod
- 每建立一個 Service，CoreDNS 自動新增一筆 DNS A Record
- Pod 啟動時，K8s 自動設定 `/etc/resolv.conf` 指向 CoreDNS
- 所以 Pod 裡做 DNS 查詢，CoreDNS 解析，回傳 Service 的 ClusterIP

**DNS 完整格式（FQDN）**
```
<service名>.<namespace名>.svc.cluster.local
```
例：`nginx-svc.default.svc.cluster.local`

**短名稱為什麼也能運作**
- Pod 的 `/etc/resolv.conf` 有 `search default.svc.cluster.local svc.cluster.local cluster.local`
- 短名稱 `nginx-svc` 查詢失敗時，自動補上 search domain 再查
- 所以 `nginx-svc` 實際上等同於 `nginx-svc.default.svc.cluster.local`

**三種寫法的使用時機**
- 短名稱 `nginx-svc`：同一個 Namespace 內（最常用）
- 加 Namespace `nginx-svc.default`：跨 Namespace 存取
- 完整 FQDN `nginx-svc.default.svc.cluster.local`：需要絕對明確時

### ② 所有指令＋講解

**確認 CoreDNS 在跑**
```bash
kubectl get pods -n kube-system | grep dns
```

打完要看：
```
coredns-xxx-yyy   1/1   Running   0   1h
```
- CoreDNS 是 K8s 叢集必要元件，正常情況下一直在跑
- `-n kube-system`：指定看 kube-system Namespace

---

**建立 busybox 臨時 Pod（有 wget + nslookup）**
```bash
kubectl run dns-test \
  --image=busybox:1.36 \
  --rm \
  -it \
  --restart=Never \
  -- sh
```
- `busybox:1.36`：包含 wget / nslookup / ping / cat 等基本工具的輕量 image
- 選 busybox 而不是 curl image，是因為 busybox 有 nslookup

---

**用短名稱連 Service**
```bash
wget -qO- http://nginx-svc
```
- `-q`：安靜模式（不顯示 wget 的進度條）
- `-O-`：把下載內容輸出到 stdout（`-O` 是指定輸出檔，`-` 代表 stdout）

打完要看：nginx 的 HTML 歡迎頁面

---

**用完整 FQDN 連 Service**
```bash
wget -qO- http://nginx-svc.default.svc.cluster.local
```

打完要看：同上，完整 FQDN 跟短名稱指向同一個 Service

---

**用 nslookup 看 DNS 解析過程**
```bash
nslookup nginx-svc
```

打完要看：
```
Server:    10.96.0.10
Address:   10.96.0.10:53

Name:      nginx-svc.default.svc.cluster.local
Address:   10.96.45.23
```
- `Server`：CoreDNS 的 ClusterIP（K8s 自動設定的 DNS 伺服器）
- `Address: 10.96.0.10:53`：DNS 服務監聽在 port 53（DNS 標準 port）
- `Name`：解析到的完整 FQDN
- `Address`（第二個）：nginx-svc 的 ClusterIP

---

**離開**
```bash
exit
# Pod 自動刪除（因為 --rm）
```

### ③ 題目
1. 為什麼在 Pod 裡面可以用 Service 名稱而不用 IP？底層是什麼機制？
2. 如果你在 `dev` Namespace 的 Pod 裡，要連到 `staging` Namespace 的 `api-svc`，DNS 名稱要怎麼寫？
3. `nslookup nginx-svc` 輸出的第一個 Address 是什麼？第二個又是什麼？

### ④ 解答
1. 底層是 CoreDNS。每建立一個 Service，CoreDNS 自動新增 DNS 記錄。Pod 啟動時 `/etc/resolv.conf` 被設定指向 CoreDNS，所以 Pod 內的 DNS 查詢會被 CoreDNS 解析成 Service 的 ClusterIP。
2. `api-svc.staging.svc.cluster.local`（跨 Namespace 必須加 Namespace 名稱）
3. 第一個是 CoreDNS 的 IP（DNS 伺服器）；第二個是 `nginx-svc` 這個 Service 的 ClusterIP

---

## 五、Namespace（30min）

### ① 課程內容

**痛點：資源名稱衝突**
- dev 和 staging 兩套環境都有 api-deploy / frontend-deploy / api-svc
- 全部放在 default Namespace → 名字衝突，K8s 不允許同 Namespace 同名資源

**Namespace 的本質**
- 邏輯分組，讓同名資源可以在不同 Namespace 共存
- ⚠️ 不是網路隔離！不同 Namespace 的 Pod 預設可以互連
- 要網路隔離：用 NetworkPolicy（第七堂）
- 要存取隔離：用 RBAC（第七堂）

**K8s 預設 Namespace**
- `default`：沒指定 Namespace 的資源預設在這裡
- `kube-system`：K8s 系統元件（API Server / CoreDNS / kube-proxy 的 Pod 都在這）
- `kube-public`：公開可讀資源，很少用
- `kube-node-lease`：Node 心跳機制，完全不需要管

**跨 Namespace 的 DNS 規則**
- 同一 Namespace：用短名稱 `<service>`
- 跨 Namespace：必須用 `<service>.<namespace>` 或完整 FQDN
- 只寫短名稱跨 Namespace 會找不到（解析到自己 Namespace 的 Service）

**刪除 Namespace 的注意事項**
- `kubectl delete namespace dev`：會把 dev Namespace 裡的所有資源一起刪掉
- 生產環境要非常小心

**切換預設 Namespace**
- 每次都打 `-n dev` 很煩，可以設定預設 Namespace
- 修改後 `kubectl get pods` 預設就是看 dev 的 Pod

### ② 所有指令＋講解

**建立 Namespace**
```bash
kubectl apply -f namespace-practice.yaml
```

打完要看：
```
namespace/dev created
namespace/staging created
```

---

**查看所有 Namespace**
```bash
kubectl get namespaces
kubectl get ns   # 縮寫
```

打完要看：
```
NAME              STATUS   AGE
default           Active   1h
dev               Active   5s
kube-node-lease   Active   1h
kube-public       Active   1h
kube-system       Active   1h
staging           Active   5s
```
- `STATUS: Active`：正常可用
- `STATUS: Terminating`：正在刪除中

---

**在指定 Namespace 建立 Deployment**
```bash
kubectl create deployment nginx-dev --image=nginx:1.27 -n dev
```
- `-n dev`：指定 Namespace 為 dev（每個操作指令都可以加 `-n`）

打完要看：
```
deployment.apps/nginx-dev created
```

---

**查看指定 Namespace 的 Pod**
```bash
kubectl get pods -n dev
```

打完要看：
```
NAME                        READY   STATUS    RESTARTS   AGE
nginx-dev-xxx-yyy           1/1     Running   0          10s
```

---

**在 staging 建同名 Deployment（驗證不衝突）**
```bash
kubectl create deployment nginx-dev --image=nginx:1.27 -n staging
kubectl get pods -n staging
```

打完要看：staging 也有自己的 nginx-dev Pod，跟 dev 的完全獨立

---

**查看所有 Namespace 的 Deployment**
```bash
kubectl get deployments --all-namespaces
kubectl get deployments -A   # 縮寫
```

打完要看：
```
NAMESPACE   NAME        READY   UP-TO-DATE   AVAILABLE   AGE
default     nginx-deploy 3/3    3            3           30m
dev         nginx-dev   1/1     1            1           1m
staging     nginx-dev   1/1     1            1           1m
```
- `NAMESPACE` 欄位：顯示資源在哪個 Namespace
- dev 和 staging 都有 nginx-dev，同名但不衝突

---

**在 Namespace 內建立 Service**
```bash
kubectl expose deployment nginx-dev --port=80 --type=ClusterIP -n dev
```
- `expose`：從現有 Deployment 快速建立 Service（不用寫 YAML）
- `--port=80`：Service 的 port
- `--type=ClusterIP`：Service 類型
- `-n dev`：建在 dev Namespace

打完要看：
```
service/nginx-dev exposed
```

---

**跨 Namespace 連線（FQDN）**
```bash
kubectl run cross-test \
  --image=busybox:1.36 \
  --rm -it --restart=Never \
  -- wget -qO- http://nginx-dev.dev.svc.cluster.local
```
- `nginx-dev.dev.svc.cluster.local`：跨 Namespace 必須用 FQDN
- `nginx-dev` = Service 名稱，`dev` = Namespace

打完要看：nginx 的 HTML 歡迎頁面（成功跨 Namespace 連到 dev 的 Service）

---

**查看 Pod 時加 `-A` 看全部 Namespace**
```bash
kubectl get pods -A
```

打完要看：
```
NAMESPACE     NAME                        READY   STATUS    ...
default       nginx-deploy-xxx-yyy        1/1     Running   ...
dev           nginx-dev-xxx-yyy           1/1     Running   ...
kube-system   coredns-xxx-yyy             1/1     Running   ...
staging       nginx-dev-xxx-yyy           1/1     Running   ...
```

---

**刪除 Namespace（及裡面所有資源）**
```bash
kubectl delete namespace dev staging
```

打完要看：
```
namespace "dev" deleted
namespace "staging" deleted
```
- ⚠️ 這會刪掉 dev 和 staging 裡的所有 Deployment / Pod / Service 等資源

---

**切換預設 Namespace**
```bash
# 切換到 dev
kubectl config set-context --current --namespace=dev

# 切回 default
kubectl config set-context --current --namespace=default
```
- `--current`：修改目前正在使用的 context
- 設定後 kubectl 所有指令預設在 dev Namespace 執行

---

**確認目前在哪個 Namespace**
```bash
kubectl config view --minify | grep namespace
```

打完要看：
```
    namespace: default
```
- `--minify`：只顯示目前使用的 context 相關設定

### ③ 題目
1. `kubectl get pods` 看不到某個 Pod，但你確定它有在跑。可能的原因是什麼？要怎麼找到它？
2. 在 `staging` Namespace 的 Pod 裡，要連到 `dev` Namespace 的 `nginx-dev` Service，DNS 名稱要怎麼寫？短名稱 `nginx-dev` 可以用嗎？為什麼？

### ④ 解答
1. 可能原因：Pod 在其他 Namespace（不是 default）。找法：`kubectl get pods -A` 看所有 Namespace，或 `kubectl get pods -n <namespace>` 指定 Namespace 查看
2. 要用 `nginx-dev.dev.svc.cluster.local` 或 `nginx-dev.dev`。短名稱不行，因為在 staging Namespace 裡，短名稱 `nginx-dev` 會被解析成 `nginx-dev.staging.svc.cluster.local`，staging 裡的 Service，不是 dev 的 Service。

---

## 六、完整練習 + 總結（30min）

### ① 課程內容

**本節目標**
- 把今天學的 Namespace + Deployment + Service + DNS 全部串起來
- 用一個 YAML 檔部署完整的前後端架構

**架構說明**
```
外部瀏覽器 → NodePort:30080
               │
         frontend-svc（NodePort）
               │
         frontend Deployment（nginx:1.27 × 2 副本）
               │ curl http://api-svc（用 ClusterIP DNS 名稱）
         api-svc（ClusterIP）
               │
         api Deployment（httpd:2.4 × 2 副本）

所有資源都在 fullstack-demo Namespace
```

**多個資源放在同一個 YAML 的寫法**
- 用 `---` 分隔每個資源（YAML 的 document separator）
- 一個 `kubectl apply -f` 就可以建立全部

**清理的重要性**
- 本地叢集資源有限
- 下堂課從乾淨環境開始

### ② 所有指令＋講解

**一次部署所有資源**
```bash
kubectl apply -f full-stack.yaml
```

打完要看：
```
namespace/fullstack-demo created
deployment.apps/frontend created
deployment.apps/api created
service/frontend-svc created
service/api-svc created
```
- 每一行對應 YAML 裡的一個資源
- 全部 created 才算成功

---

**查看 Namespace 內所有資源**
```bash
kubectl get all -n fullstack-demo
```

打完要看：
```
NAME                            READY   STATUS    RESTARTS   AGE
pod/api-xxx-yyy                 1/1     Running   0          30s
pod/api-xxx-zzz                 1/1     Running   0          30s
pod/frontend-xxx-aaa            1/1     Running   0          30s
pod/frontend-xxx-bbb            1/1     Running   0          30s

NAME                   TYPE        CLUSTER-IP     PORT(S)
service/api-svc        ClusterIP   10.96.x.x      80/TCP
service/frontend-svc   NodePort    10.96.x.x      80:30080/TCP

NAME                       READY   UP-TO-DATE   AVAILABLE
deployment.apps/api        2/2     2            2
deployment.apps/frontend   2/2     2            2

NAME                              DESIRED   CURRENT   READY
replicaset.apps/api-xxx           2         2         2
replicaset.apps/frontend-xxx      2         2         2
```
- `kubectl get all`：同時顯示 Pod / Service / Deployment / ReplicaSet
- 確認 4 個 Pod 全部 Running，2 個 Service，2 個 Deployment

---

**驗證外部存取前端**
```bash
# k3s 用戶
multipass info k3s-worker1 | grep IPv4
curl http://<worker-ip>:30080

# minikube 用戶
minikube service frontend-svc -n fullstack-demo
```

打完要看：nginx 的 HTML 歡迎頁面（代表前端 NodePort 正常）

---

**取得前端 Pod 名稱**
```bash
kubectl get pods -n fullstack-demo | grep frontend
```

打完要看：
```
frontend-xxx-aaa   1/1   Running   0   1m
frontend-xxx-bbb   1/1   Running   0   1m
```
- 記下任一個前端 Pod 的名字，下一步用

---

**驗證前端 Pod 可以連到 API（叢集內 DNS）**
```bash
kubectl exec -it <frontend-pod名> -n fullstack-demo -- curl http://api-svc
```
- `-it`：互動模式
- `-n fullstack-demo`：指定 Namespace
- `-- curl http://api-svc`：在容器內執行 curl，用 Service 名稱連 api-svc

打完要看：
```html
<html><body><h1>It works!</h1></body></html>
```
- `It works!` 是 Apache httpd 的預設頁面
- 代表前端 Pod 透過 ClusterIP DNS 名稱成功連到 api-svc

---

**驗證 DNS 解析**
```bash
kubectl run dns-final \
  --image=busybox:1.36 \
  -n fullstack-demo \
  --rm -it --restart=Never \
  -- nslookup api-svc
```
- `-n fullstack-demo`：在 fullstack-demo Namespace 裡建臨時 Pod
- 注意：這次不進 sh，直接在指令裡跑 nslookup

打完要看：
```
Server:    10.96.0.10
Address:   10.96.0.10:53

Name:      api-svc.fullstack-demo.svc.cluster.local
Address:   10.96.x.x    ← api-svc 的 ClusterIP
```
- FQDN 是 `api-svc.fullstack-demo.svc.cluster.local`（Namespace 是 fullstack-demo）

---

**清理 fullstack-demo**
```bash
kubectl delete namespace fullstack-demo
```

打完要看：
```
namespace "fullstack-demo" deleted
```
- 刪 Namespace 會把裡面所有資源一起清掉

---

**清理 default namespace 的資源**
```bash
kubectl delete deployment nginx-deploy
kubectl delete svc nginx-svc
```

打完要看：
```
deployment.apps "nginx-deploy" deleted
service "nginx-svc" deleted
```

---

**確認清理乾淨**
```bash
kubectl get all
```

打完要看：
```
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   1h
```
- 只剩 `kubernetes` 這個系統 Service，代表 default namespace 清乾淨了

### ③ 題目
（Lab 7 是學生自行完成的，老師的部分是 demo 驗證清單後讓學生照著驗）

學生問題：
1. `kubectl get all -n fullstack-demo` 結果裡，你看到幾個 Pod？幾個 Service？分別是哪些？
2. 為什麼 `kubectl exec` 進前端 Pod 後可以用 `curl http://api-svc` 連到 API，而不需要知道 API 的 IP？
3. 如果前端有 5 個副本、API 有 3 個副本，流量是怎麼分配的？（Service 的角色是什麼）

### ④ 解答
1. 4 個 Pod（frontend × 2 + api × 2）；2 個 Service（frontend-svc NodePort + api-svc ClusterIP）
2. 因為 K8s 的 CoreDNS 把 `api-svc` 解析成 api-svc 這個 ClusterIP Service 的 IP；Service 再把流量轉發到後面的 api Pod。整個過程不需要知道 Pod 的實際 IP。
3. frontend-svc 收到外部流量，自動負載均衡到 5 個前端 Pod；api-svc 收到來自前端 Pod 的流量，自動負載均衡到 3 個 api Pod。Service 就是在做這件事：穩定入口 + 負載均衡。

---

## 七、今日總結（10min）

### ① 課程內容

**四個核心概念複習**
| 概念 | 做什麼 | Docker 對照 |
|------|--------|-----------|
| Deployment | 管理 Pod 副本 + 滾動更新 + 回滾 | `docker compose up --scale` |
| Service | 穩定存取入口 + 負載均衡 | `-p` + Compose network DNS |
| CoreDNS | Service 名稱自動 DNS 解析 | Compose 容器名稱 DNS |
| Namespace | 邏輯隔離，同名資源不衝突 | 不同 Compose 專案 |

**三個永遠不要忘的原則**
1. 永遠用 Deployment 管 Pod，不直接建 Pod
2. 永遠用 Service 名稱連服務，不用 Pod IP
3. 用 Namespace 隔離環境，跨 Namespace 記得用 FQDN

**Docker → K8s 對照表（今天更新的部分）**
| Docker | K8s |
|--------|-----|
| `docker compose up --scale web=3` | Deployment `replicas: 3` |
| `--restart always` | Deployment 自動重建 |
| `docker run -p 8080:80` | Service NodePort |
| Compose 容器名稱 DNS | Service + CoreDNS |
| 不同 Compose 專案 | Namespace |

### ② 所有指令＋講解

**今天新增的 kubectl 指令完整清單**
```bash
# Deployment 相關
kubectl scale deployment <name> --replicas=N
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status deployment/<name>
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>
kubectl rollout undo deployment/<name> --to-revision=N

# Service 相關
kubectl get svc
kubectl describe svc <name>
kubectl get endpoints <name>
kubectl get ep <name>
kubectl expose deployment <name> --port=80 --type=ClusterIP -n <ns>

# Namespace 相關
kubectl get ns
kubectl get pods -n <namespace>
kubectl get all -n <namespace>
kubectl get pods -A
kubectl delete namespace <name>
kubectl config set-context --current --namespace=<ns>
kubectl config view --minify | grep namespace
```

### ③ 反思問題（留到下堂課回答）

> **問題 1：**
> 你的 API 服務跑起來了，用 NodePort 可以從瀏覽器連到。
> 但你不可能叫使用者輸入 `http://192.168.64.5:30080`。
> **怎麼讓使用者用 `https://myapp.com` 就能連到你的服務？**

> **問題 2：**
> 你的 Deployment YAML 裡有一行 `value: my-secret-password`，推到 GitHub 後全世界都看到了。
> **K8s 有什麼機制可以安全管理這些敏感資訊？**

### ④ 第六堂預告

| 主題 | 解決什麼 |
|------|---------|
| Ingress | 用域名 + HTTPS 存取，一個 LB 管多個服務 |
| ConfigMap | 設定從 Image 抽出來，不用重 build 就能改設定 |
| Secret | 安全管理密碼 / API Key / 憑證 |
| PV / PVC | 持久化資料，Pod 死了資料不消失 |
| Helm | K8s 的套件管理，一行安裝複雜應用 |
