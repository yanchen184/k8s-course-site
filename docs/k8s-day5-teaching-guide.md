# 第五堂教學手冊 — 講師用

> 新結構：每個段落 = 概念重點（講幾分鐘）→ 示範操作（邊打邊講）→ 學員實作
> 每行指令都標註要展開講的知識點

---

## 開場：k3s 多節點安裝

### 一開始要講的重點（~5min）

1. 第四堂回顧一句話帶過：Docker 扛不住 → K8s → Pod → Deployment，上次用 Deployment replicas:3 跑了三個 Pod
2. 問題拋出：上次 `kubectl get pods -o wide`，三個 Pod 的 NODE 欄位都一樣 → minikube 只有一個 Node，全擠同一台
3. 為什麼有差？
   - Node 掛了 → 三個 Pod 全死，無處可搬
   - scale 到 10 → 還是同一台的 CPU/記憶體，沒有多出資源
   - 後面要學的 DaemonSet（每 Node 一個）、NodePort（每 Node 開 Port）→ 單節點看不出效果
4. 解法：k3s 多節點叢集
   - k3s = 輕量版 K8s，kubectl 指令和 YAML 全部通用
   - Multipass 開兩台 VM → 一台 master 一台 worker

### 示範操作

```bash
# ✅ 確認 Multipass 已安裝
multipass version
```

```bash
# ✅ 建兩台 VM（2 CPU / 2G RAM / 10G Disk）
multipass launch --name k3s-master --cpus 2 --memory 2G --disk 10G
multipass launch --name k3s-worker1 --cpus 2 --memory 2G --disk 10G
```
> 💡 建 VM 約 1-2 分鐘，要下載 Ubuntu 映像

```bash
# ✅ 確認兩台 VM 跑起來了
multipass list
```

```bash
# ✅ 在 master 上安裝 k3s（一行搞定）
multipass exec k3s-master -- bash -c "curl -sfL https://get.k3s.io | sh -"
```
> 💡 知識點：對比 kubeadm 要裝 kubelet + kubeadm + kubectl + 設定 cgroup driver，k3s 一行 curl 三十秒搞定

```bash
# ✅ 驗證 master 裝好了
multipass exec k3s-master -- sudo kubectl get nodes
```
> 預期看到一個 node，狀態 Ready

```bash
# ✅ 取得 join token 和 master IP
TOKEN=$(multipass exec k3s-master -- sudo cat /var/lib/rancher/k3s/server/node-token)
MASTER_IP=$(multipass info k3s-master | grep IPv4 | awk '{print $2}')
```
> 💡 知識點：token 就像俱樂部邀請碼，worker 要用它才能加入叢集

```bash
# ✅ worker 加入叢集
multipass exec k3s-worker1 -- bash -c "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$TOKEN sh -"
```
> 💡 知識點：跟裝 master 一樣的 curl，多了 K3S_URL（master 在哪）和 K3S_TOKEN（憑證）

```bash
# ✅ 驗證：兩個節點都 Ready
multipass exec k3s-master -- sudo kubectl get nodes
```

```bash
# ✅ 設定本機 kubeconfig（不用每次 multipass exec）
multipass exec k3s-master -- sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/k3s-config
sed -i '' "s/127.0.0.1/$MASTER_IP/g" ~/.kube/k3s-config
export KUBECONFIG=~/.kube/k3s-config
```

```bash
# ✅ 本機直接操作叢集
kubectl get nodes
```
> 預期看到 k3s-master 和 k3s-worker1 都 Ready

```bash
# ✅ 關鍵驗證：部署 Deployment，看 Pod 有沒有分散
kubectl create deployment my-nginx --image=nginx --replicas=3
```

```bash
kubectl get pods -o wide
```
> 💡 重點展開：看 NODE 欄位，Pod 分散在不同 Node 上了！跟 minikube 最大的差別。Scheduler 自動決定 Pod 放哪台。

```bash
# ✅ 清理，為下一個 Loop 準備乾淨環境
kubectl delete deployment my-nginx
```

---

## Loop 1：擴縮容（scale）

### 一開始要講的重點（~3min）

1. 場景：電商平常 3 個 Pod 夠用，週年慶流量暴增 10 倍 → 3 個 Pod 撐爆
2. 解法：`kubectl scale` 一行指令調副本數
3. 背後機制（用第四堂架構知識串）：
   - kubectl scale → API Server → 改 etcd 裡的 replicas
   - Controller Manager 發現差異 → 叫 Scheduler 分配
   - Scheduler 看各 Node 資源 → 決定放哪台
   - kubelet 拉 Image、啟動容器
4. 水平 vs 垂直擴縮：水平 = 加 Pod 數量（今天學）；垂直 = 加 CPU/記憶體（第七堂）
5. 預告：手動 scale 太慢 → 第七堂 HPA 自動擴縮

### 示範操作

```bash
# ✅ 建 Deployment，3 個副本
kubectl create deployment my-nginx --image=nginx --replicas=3
```

```bash
# ✅ 確認 Pod 跑起來 + 分散在不同 Node
kubectl get pods -o wide
```
> 💡 提醒：一定要加 `-o wide` 看 NODE 欄位

```bash
# ✅ 看 Deployment 狀態
kubectl get deploy
```
> 💡 知識點：READY 3/3（期望 3 個、就緒 3 個）、UP-TO-DATE、AVAILABLE

```bash
# ✅ 擴容：3 → 5
kubectl scale deployment my-nginx --replicas=5
```

```bash
kubectl get pods -o wide
```
> 💡 展開講：多了 2 個 Pod，看 NODE 欄位，新 Pod 也被分散到不同 Node

```bash
kubectl get deploy
```
> READY 變成 5/5

```bash
# ✅ 縮容：5 → 2
kubectl scale deployment my-nginx --replicas=2
```

```bash
kubectl get pods
```
> 💡 展開講：3 個 Pod 狀態變 Terminating → 幾秒後只剩 2 個 Running。K8s 自動砍多餘的

```bash
# ✅ 極端操作：scale 到 0
kubectl scale deployment my-nginx --replicas=0
```

```bash
kubectl get deploy
```
> 💡 知識點：READY 0/0，Pod 全砍了但 Deployment 還在。這在維護時很有用，暫停服務不用刪 Deployment

```bash
kubectl get pods
```
> 沒有 Pod 了

```bash
# ✅ 恢復
kubectl scale deployment my-nginx --replicas=3
```

```bash
kubectl get pods -o wide
```
> Pod 又回來了，分散在不同 Node

```bash
# ✅ 查看 Events 記錄（選做展示）
kubectl describe deployment my-nginx | grep -A5 Events
```
> 💡 知識點：每次 scale 都會在 Events 留記錄，排查問題時很有用

> ⚠️ 常見坑提醒：
> - scale 的對象是 **Deployment** 不是 Pod（`kubectl scale pod xxx` 會報錯）
> - 記得用 `-o wide` 看 Node 分散情況

### 學員實作 + 解答

**題目：**
1. 建 httpd Deployment replicas:2 → scale 到 5 → `-o wide` 觀察 → scale 回 1
2. scale 到 0 看效果 → scale 回 3
3. 挑戰（雙終端體驗）：終端 1 `kubectl get pods -w` / 終端 2 快速連打 scale 5→8→10→3

**解答：**

```bash
# 題目 1
kubectl create deployment my-httpd --image=httpd --replicas=2
kubectl get pods -o wide
kubectl scale deployment my-httpd --replicas=5
kubectl get pods -o wide
kubectl scale deployment my-httpd --replicas=1
kubectl get pods -o wide
```

```bash
# 題目 2
kubectl scale deployment my-httpd --replicas=0
kubectl get deploy           # READY 0/0，Deployment 還在
kubectl get pods             # 沒有 Pod
kubectl scale deployment my-httpd --replicas=3
kubectl get pods -o wide     # Pod 回來了
```

```bash
# 題目 3（挑戰）
# 終端 1（開著不關）：
kubectl get pods -w

# 終端 2（每次等 5 秒看終端 1 變化）：
kubectl scale deployment my-httpd --replicas=5
kubectl scale deployment my-httpd --replicas=8
kubectl scale deployment my-httpd --replicas=10
kubectl scale deployment my-httpd --replicas=3
```
> 終端 1 會看到 Pod 快速增減，這就是第七堂 HPA 自動做的事

```bash
# 清理
kubectl delete deployment my-httpd
```

---

## Loop 2：滾動更新 + 回滾（rollout）

### 一開始要講的重點（~3min）

1. 場景：API 跑 nginx:1.26，新版 1.27 要上線
2. 最土的方法：先砍全部再建新的 → 中間有空窗期 → 使用者看到 502
3. K8s 的做法：滾動更新（Rolling Update）= 逐步替換，零停機
   - 建 1 個 v2 → 健康檢查通過 → 砍 1 個 v1 → 重複
   - 任何時刻都有 Pod 在服務
4. 背後機制：新舊 ReplicaSet 的蹺蹺板
   - 新 ReplicaSet 從 0→3，舊 ReplicaSet 從 3→0
   - 舊 ReplicaSet 不刪，保留用來回滾
5. 回滾：`rollout undo` → 舊 ReplicaSet 重新擴回來
6. 對照 Docker：Docker 沒有內建滾動更新，Compose 也沒有

### 示範操作

```bash
# ✅ 建 Deployment，指定版本 nginx:1.26
kubectl create deployment my-nginx --image=nginx:1.26 --replicas=3
```

```bash
# ✅ 確認目前版本
kubectl describe deployment my-nginx | grep Image
```
> 預期：nginx:1.26

```bash
# ✅ 觸發滾動更新：1.26 → 1.27（用 set image 快捷方式示範）
kubectl set image deployment/my-nginx nginx=nginx:1.27
```
> 💡 知識點：生產環境建議改 YAML 再 apply（可放 Git 版控）。這裡用 set image 是為了示範方便

```bash
# ✅ 即時觀察更新過程
kubectl rollout status deployment/my-nginx
```
> 預期輸出：
> ```
> Waiting for deployment rollout to finish: 1 out of 3 new replicas have been updated...
> Waiting for deployment rollout to finish: 2 out of 3 new replicas have been updated...
> deployment "my-nginx" successfully rolled out
> ```

```bash
# ✅ 看 Pod — 名字跟之前不同了（新 ReplicaSet 建的）
kubectl get pods
```

```bash
# ✅ 重點：看 ReplicaSet — 新舊兩個
kubectl get rs
```
> 💡 展開講：
> - 一個 DESIRED/CURRENT/READY 都是 3 → 新版 1.27
> - 一個 DESIRED/CURRENT/READY 都是 0 → 舊版 1.26，沒刪掉，回滾要用

```bash
# ✅ 驗證版本
kubectl describe deployment my-nginx | grep Image
```
> nginx:1.27 ✅

```bash
# ✅ 回滾：假設 1.27 有 bug
kubectl rollout undo deployment/my-nginx
```

```bash
kubectl rollout status deployment/my-nginx
```

```bash
kubectl describe deployment my-nginx | grep Image
```
> 回到 nginx:1.26 ✅

```bash
# ✅ 看 ReplicaSet 角色互換
kubectl get rs
```
> 之前 0 的變 3，之前 3 的變 0

```bash
# ✅ 看部署歷史
kubectl rollout history deployment/my-nginx
```
> 💡 知識點：每次更新/回滾都是一個 revision。K8s 預設保留最近 10 個版本（revisionHistoryLimit）

```bash
# ✅ 故意更新到不存在的版本（展示安全機制）
kubectl set image deployment/my-nginx nginx=nginx:99.99
```

```bash
kubectl get pods
```
> 💡 重點展開：
> - 新 Pod 狀態 ImagePullBackOff / ErrImagePull（拉不到 Image）
> - 但舊 Pod 還活著！K8s 不會把舊的全砍 → 服務沒掛
> - 這就是滾動更新的安全機制

```bash
# ✅ 救回來
kubectl rollout undo deployment/my-nginx
```

```bash
kubectl get pods
```
> 恢復正常

> ⚠️ 常見坑提醒：
> - `rollout undo` 回到的是**上一版**，不是初始版。1.26→1.27→1.28，undo 回到 1.27 不是 1.26
> - 要回到特定版本用 `--to-revision=N`
> - 改 YAML 後一定要 `kubectl apply -f` 才會生效（只存檔不 apply 叢集不會變）

### 學員實作 + 解答

**題目：**
1. 建 nginx:1.26 replicas:3 → set image 更新到 1.27 → rollout status → get rs → rollout undo → 確認回到 1.26
2. 故意更新到 nginx:99.99 → 觀察卡住 → rollout undo 救回來
3. 挑戰：做三次更新（1.26→1.27→1.28）→ rollout history → rollout undo --to-revision 跳回 1.26

**解答：**

```bash
# 題目 1：完整滾動更新 + 回滾
kubectl create deployment nginx-roll --image=nginx:1.26 --replicas=3
kubectl get pods -o wide
kubectl describe deployment nginx-roll | grep Image    # 確認 1.26

kubectl set image deployment/nginx-roll nginx=nginx:1.27
kubectl rollout status deployment/nginx-roll            # 看逐步替換
kubectl get rs                                          # 看新舊兩個 ReplicaSet
kubectl describe deployment nginx-roll | grep Image     # 確認 1.27

kubectl rollout undo deployment/nginx-roll
kubectl describe deployment nginx-roll | grep Image     # 回到 1.26
kubectl get rs                                          # 角色互換
```

```bash
# 題目 2：壞版本救援
kubectl set image deployment/nginx-roll nginx=nginx:99.99
kubectl get pods                  # 新 Pod 卡在 ImagePullBackOff，舊 Pod 還活著
kubectl rollout undo deployment/nginx-roll
kubectl get pods                  # 恢復正常
```

```bash
# 題目 3（挑戰）：三次更新 + 指定版本回滾
kubectl set image deployment/nginx-roll nginx=nginx:1.27
kubectl rollout status deployment/nginx-roll

kubectl set image deployment/nginx-roll nginx=nginx:1.28
kubectl rollout status deployment/nginx-roll

kubectl rollout history deployment/nginx-roll           # 看所有 revision

# 找到 1.26 的 revision 號碼（通常是最早的那個），假設是 1
kubectl rollout undo deployment/nginx-roll --to-revision=1
kubectl describe deployment nginx-roll | grep Image     # 回到 1.26
```

```bash
# 清理
kubectl delete deployment nginx-roll
```

---

> 接下來：Loop 3 Labels/Selector + 自我修復
