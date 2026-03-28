# 第五堂課大綱 + 學員練習

---

## 開場（5-1, 5-2）~20min

**內容：**
- 第四堂因果鏈快速回顧
- 問題：minikube 只有一個 Node，Pod 全擠同一台，看不到分散效果
- 解法：k3s 多節點叢集（master + worker）
- 實作：安裝 k3s → kubectl get nodes 看到兩個節點 → 部署 Deployment → `kubectl get pods -o wide` 看到 Pod 分散了

---

## Loop 1：擴縮容（5-3, 5-4, 5-5）~40min

**因果鏈：** 平常 3 個 Pod 夠用，流量暴增 10 倍怎麼辦？→ kubectl scale

**教學重點：**
- `kubectl scale deployment --replicas=N`
- 擴：3 → 5，看新 Pod 出現 + 分散到不同 Node
- 縮：5 → 2，看多的 Pod 被 Terminating
- 水平擴縮 vs 垂直擴縮（概念帶過，HPA 第七堂教）

**學員練習：**
- 必做：建 httpd Deployment replicas:2 → scale 到 5 → `-o wide` 觀察 → scale 回 1
- 挑戰：scale 到 0（Pod 全砍但 Deployment 還在，scale 回來就恢復）

---

## Loop 2：滾動更新 + 回滾（5-6, 5-7, 5-8）~48min

**因果鏈：** API 有新版本要上線，直接砍掉重建會有空窗期 → 滾動更新零停機

**教學重點：**
- `kubectl set image deployment/名稱 容器名=新image` 觸發滾動更新
- 四步驟：建 v2 → 健康檢查 → 砍 v1 → 重複
- `kubectl rollout status` 看更新進度
- `kubectl get rs` 看新舊兩個 ReplicaSet
- `kubectl rollout undo` 回滾
- `kubectl rollout history` 看歷史版本

**學員練習：**
- 必做：nginx:1.26 → set image 到 1.27 → rollout status → get rs → rollout undo → 確認回到 1.26
- 挑戰：故意更新到 nginx:99.99（不存在）→ 觀察卡住 → rollout undo 救回來

---

## Loop 3：自我修復 + Labels/Selector（5-9, 5-10, 5-11）~45min

**因果鏈：** Pod 掛了 K8s 真的會自動補嗎？→ 來試 → 那 K8s 怎麼知道哪些 Pod 屬於誰？→ Labels + Selector

**教學重點：**
- delete Pod → 自動補回來（多節點上可能補到不同 Node）
- Labels：貼在資源上的標籤（app: nginx）
- Selector：用 Labels 篩選（matchLabels: app: nginx）
- `kubectl get pods --show-labels`
- `kubectl get pods -l app=nginx`
- 三者要對上：Deployment selector / template labels / Service selector

**學員練習：**
- 必做：delete Pod 看自我修復 → `--show-labels` → `-l` 篩選
- 挑戰：把某個 Pod 的 app label 改掉（`kubectl label pod xxx app=other --overwrite`）→ Deployment 補新 Pod + 舊 Pod 變孤兒

---

## Loop 4：ClusterIP Service（5-12, 5-13, 5-14）~46min

**因果鏈：** Pod IP 會變、外面連不到 → Service 穩定入口

**教學重點：**
- Service YAML：selector 對應 Pod labels、port / targetPort
- `kubectl get svc` → 看到 ClusterIP
- `kubectl get endpoints` → 看到 Service 背後的 Pod IP 列表
- DNS：busybox Pod 裡 `curl nginx-svc` → 用名字連
- 完整 DNS：`nginx-svc.default.svc.cluster.local`

**學員練習：**
- 必做：建 httpd Deployment + ClusterIP Service → busybox `curl httpd-svc` 看到 It works!
- 挑戰：`kubectl get endpoints` → scale Deployment → endpoints 跟著變

---

## Loop 5：NodePort + 三種比較（5-15, 5-16, 5-17）~45min

**因果鏈：** ClusterIP 只能叢集內連，外面的使用者怎麼連？→ NodePort

**教學重點：**
- NodePort：每個 Node 開一個 Port（30000-32767）
- 三個 Port 關係：nodePort → port → targetPort
- `curl <node-ip>:<nodeport>` 從外部連
- LoadBalancer：雲端用（概念帶過）
- 三種比較：ClusterIP（內部）/ NodePort（開發測試）/ LoadBalancer（生產雲端）

**學員練習：**
- 必做：建 NodePort Service → curl node-ip:nodeport 看到頁面
- 挑戰：同時建 ClusterIP 和 NodePort 指向同一個 Deployment → 從 busybox 和從外部分別連

---

## Loop 6：DNS + Namespace（5-18, 5-19, 5-20）~44min

**因果鏈：** 用 ClusterIP 的 IP 連太蠢 → DNS 用名字 → dev 和 prod 環境要隔離 → Namespace

**教學重點：**
- DNS 三種寫法：`nginx-svc` / `nginx-svc.dev` / `nginx-svc.dev.svc.cluster.local`
- `nslookup nginx-svc` 驗證 DNS
- `kubectl create namespace dev`
- 在 dev 部署 → 從 default 跨 Namespace 連：`curl nginx-svc.dev.svc.cluster.local`
- `kubectl get pods -A` 看所有 Namespace

**學員練習：**
- 必做：建 dev Namespace → 部署 httpd + Service → 從 default 的 busybox `curl httpd-svc.dev.svc.cluster.local`
- 挑戰：建 prod Namespace，dev 用 nginx:1.26、prod 用 1.27 → 分別 curl 驗證版本不同

---

## Loop 7：DaemonSet + CronJob（5-21, 5-22, 5-23）~44min

**因果鏈：** 每台 Node 都要跑監控 agent → DaemonSet / 定時備份 → CronJob

**教學重點：**
- DaemonSet：每台 Node 剛好一個 Pod，新 Node 自動加、移除自動減
- DaemonSet YAML（沒有 replicas）
- CronJob：schedule 用 cron 語法（"*/1 * * * *" = 每分鐘）
- CronJob 建 Job → Job 建 Pod → 跑完 Completed
- 三者比較：Deployment（N 個隨便放）/ DaemonSet（每台一個）/ CronJob（定時跑完就結束）

**學員練習：**
- 必做：建 DaemonSet → 確認每個 Node 都有 → 建 CronJob → 看 Job 和 Completed Pod
- 挑戰：改 CronJob schedule 為 "*/2 * * * *"（每兩分鐘）→ 觀察間隔

---

## Loop 8：綜合實作 + 總結（5-24, 5-25, 5-26）~38min

**因果鏈：** 全部串起來 → 從零到完整服務

**教學重點（10 步驟從零建一個完整服務）：**
1. 建 Namespace（my-app）
2. 建 nginx Deployment（replicas: 3）
3. 建 ClusterIP Service
4. 建 NodePort Service
5. 從外部 curl 驗證
6. scale 擴縮
7. 滾動更新到新版本
8. 回滾
9. 驗證自我修復（delete Pod）
10. 清理

**學員自由練習：**
- 必做：跟著 10 步驟做一遍（Namespace → Deployment → Service → scale → 滾動更新 → 回滾）
- 挑戰 1：同時部署 nginx + httpd 兩個服務，各自 Deployment + ClusterIP + NodePort
- 挑戰 2：用 busybox 從叢集內 curl 兩個 Service 的 DNS 名字
- 回顧題：不看筆記列出今天學的所有 kubectl 指令

**下堂課預告：**
> NodePort 地址太醜 → Ingress（域名路由）
> 設定寫死在 Image → ConfigMap / Secret
> 容器掛了資料消失 → PV / PVC
> YAML 太多太散 → Helm
> kubectl 管叢集太痛苦 → Rancher
