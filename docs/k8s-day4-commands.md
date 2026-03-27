# 第四堂課指令清單

> 每支影片會用到的所有指令，錄影時可以快速對照
> 每行指令後面附上「執行後看什麼」的重點提示

---

## 背景工作管理（& 放背景）

```bash
# 任何會佔住終端機的指令，都可以加 & 放到背景跑
kubectl port-forward pod/my-nginx 8080:80 --address='0.0.0.0' &
# → 按 Enter 回到命令列，指令在背景繼續運行

# 列出所有背景工作
jobs
# → [1]  Running   kubectl port-forward ...
# → [2]  Running   minikube dashboard ...
# → 前面的 [1] [2] 就是工作編號

# 殺掉指定的背景工作
kill %1          # 殺掉第 1 個
kill %2          # 殺掉第 2 個
kill %1 %2       # 一次殺多個

# 常見錯誤：port 被佔住
# → "bind: address already in use" 代表之前的 port-forward 還在跑
# → 先 jobs 找到佔 port 的工作，kill 掉再重跑
```

---

## 4-6 K8s 架構

```bash
kubectl create deployment nginx --image=nginx --replicas=3
# → 看 Pod 被建立的過程，驗證 API Server → etcd → Scheduler → kubelet 的完整流程
```

---

## 4-7 環境搭建 + 驗證

```bash
# ── 驗證安裝 ──

minikube version
# → 預期輸出：minikube version: v1.xx.x
# → 確認 minikube 有裝好，沒有 command not found

minikube status
# → 預期輸出：
#    minikube
#    type: Control Plane
#    host: Running
#    kubelet: Running
#    apiserver: Running
#    kubeconfig: Configured
# → 四個都是 Running / Configured = 叢集正常
# → 如果看到 Stopped 或 host: Nonexistent → 需要 minikube start

minikube start
# → 只在 status 不是 Running 時才需要執行
# → 第一次 start 會下載 VM Image + K8s 組件，可能要 3-5 分鐘
# → 成功後會看到 "kubectl is now configured to use minikube cluster"

# ── 驗證叢集 ──

kubectl get nodes
# → 預期輸出：
#    NAME       STATUS   ROLES           AGE   VERSION
#    minikube   Ready    control-plane   xxd   v1.xx.x
# → 重點看：
#    STATUS = Ready（叢集健康）。NotReady = 有問題
#    ROLES = control-plane（Master + Worker 合一，minikube 特有）
#    VERSION = K8s 版本號

kubectl cluster-info
# → 預期輸出：
#    Kubernetes control plane is running at https://127.0.0.1:xxxxx
#    CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/...
# → control plane URL = API Server 的位址，kubectl 就是連這個
# → CoreDNS running = 叢集內部 DNS 正常（Service 名稱解析靠它）
# → 如果出現 "The connection to the server was refused" → minikube 沒在跑

# ── kubeconfig（kubectl 怎麼知道連哪個叢集）──

cat ~/.kube/config
# → 這個檔案是 kubectl 的「通訊錄」，決定連哪個叢集
# → 整個連線流程就像去銀行：驗證銀行是真的（CA）→ 出示身份證（client 憑證）→ 進門辦事
#
# → 實際輸出長這樣（以 minikube 為例）：
#
# → 【clusters — 連去哪裡？（銀行地址 + 驗證銀行身份）】
#    clusters:
#    - cluster:
#        certificate-authority: /home/user/.minikube/ca.crt   ← CA 憑證
#        server: https://192.168.49.2:8443                    ← API Server 位址
#      name: minikube
#    → server = API Server 的 IP + Port，kubectl 所有指令都發到這裡
#    → certificate-authority = CA 憑證，叢集的「身份證」
#      CA 憑證做什麼？驗證你連的真的是你的叢集，不是別人偽裝的
#      類似 HTTPS：瀏覽器打開銀行網站，靠 SSL 憑證確認那真的是銀行
#      kubectl 連 API Server 也一樣，靠 CA 憑證確認那真的是你的叢集
#
# → 【users — 我是誰？（出示你的身份證）】
#    users:
#    - name: minikube
#      user:
#        client-certificate: /home/user/.minikube/profiles/minikube/client.crt  ← 你的「員工證」
#        client-key: /home/user/.minikube/profiles/minikube/client.key          ← 你的「私鑰」
#    → client-certificate = 證明你有權限操作這個叢集
#    → client-key = 配合 certificate 做身份驗證（像印章配身份證）
#    → 有些叢集用 token 代替憑證（像是 AWS EKS 用 IAM token）
#
# → 【contexts — 組合起來（用哪個身份去哪家銀行）】
#    contexts:
#    - context:
#        cluster: minikube    ← 連這個叢集
#        user: minikube       ← 用這個身份
#        namespace: default   ← 預設操作這個 Namespace
#      name: minikube
#    → 如果你有公司叢集 + 測試叢集 + 本機 minikube，就會有三組 context
#    → 切換 context = 切換你在操作哪個叢集
#
# → 【current-context — 目前用哪組】
#    current-context: minikube
#    → kubectl 所有指令都是對這個 context 操作
#
# → minikube start 的時候自動幫你寫好了，不用手動設定

kubectl config current-context
# → 預期輸出：minikube
# → 確認目前連的是哪個叢集
# → 如果你有多個叢集（minikube + 公司叢集），這裡會顯示目前用哪個

kubectl config use-context dev
# → 切換到名叫 "dev" 的 context
# → 如果有這個 context → 輸出 Switched to context "dev"
# → 如果沒有 → 報錯 error: no context exists with the name: "dev"
# → 這裡故意演示切換概念，報錯是正常的

kubectl config use-context minikube
# → 切回 minikube（確保後面的操作連對叢集）
```

---

## 4-8 探索叢集

```bash
# ── 親眼看到架構組件 ──

kubectl get pods -n kube-system
# → -n kube-system 指定 Namespace（叢集裡的「資料夾」）
# → 預期看到這些 Pod（全部 STATUS = Running）：
#    etcd-minikube                       ← etcd，叢集的資料庫
#    kube-apiserver-minikube             ← API Server，叢集的大門
#    kube-scheduler-minikube             ← Scheduler，決定 Pod 放哪台 Node
#    kube-controller-manager-minikube    ← Controller Manager，24 小時監工
#    kube-proxy-xxxxx                    ← kube-proxy，網路轉發（每個 Node 一個）
#    coredns-xxxxx                       ← CoreDNS，叢集內部 DNS
# → 重點：K8s 自己的管理組件也是用 Pod 跑的！自己管自己

kubectl describe node minikube
# → 輸出很長，帶你看重點區塊：
#
# → 【System Info】
#    Container Runtime Version:  containerd://1.x.x  ← 不是 Docker！驗證了架構篇講的
#    Kubelet Version:            v1.xx.x              ← kubelet 版本，通常跟 K8s 版本一致
#    Operating System:           linux
#    Architecture:               amd64
#
# → 【Capacity vs Allocatable】
#    Capacity:     cpu: 2,  memory: 4000Mi   ← Node 的總資源
#    Allocatable:  cpu: 2,  memory: 3800Mi   ← 可分配給 Pod 的量（K8s 保留一些給系統）
#    → Scheduler 就是看 Allocatable 還有多少餘量，決定 Pod 放哪裡
#
# → 【Non-terminated Pods】
#    列出這台 Node 上所有正在跑的 Pod 和它們各用了多少 CPU/記憶體
#    → 就是剛才 get pods -n kube-system 看到的那些

# ── Namespace ──

kubectl get ns
# → 預期輸出：
#    NAME              STATUS   AGE
#    default           Active   xxd   ← 你的 Pod 預設放這裡
#    kube-system       Active   xxd   ← K8s 管理組件（剛才看的）
#    kube-public       Active   xxd   ← 公開可讀資訊（很少用）
#    kube-node-lease   Active   xxd   ← Node 心跳記錄（K8s 用它判斷 Node 還活不活）
# → ns 是 namespace 的簡寫，kubectl 很多資源都有簡寫
# → 最常用的就是 default 和 kube-system

# ── Dashboard（VMware 環境，從宿主機瀏覽器存取）──

minikube dashboard &
# → 背景啟動 dashboard 服務，按 Enter 回到命令列
# → 會自動在 minikube 內部署 kubernetes-dashboard
# → 如果看到 "Verifying dashboard health ..." 然後卡住，等一下就好

kubectl proxy --address='0.0.0.0' --accept-hosts='.*' --port=8001 &
# → 背景啟動 API proxy，綁定所有網路介面（0.0.0.0）讓外部連入
# → 按 Enter 回到命令列，終端機可以繼續操作
# → 預設只綁 127.0.0.1，VMware 宿主機連不到，所以要加 --address='0.0.0.0'

hostname -I
# → 查看 VM 的 IP 位址（例如 192.168.xxx.xxx）
# → 宿主機瀏覽器打開：
# → http://<VM-IP>:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/
# → 在 Dashboard 裡點 Workloads → Pods → 選 kube-system Namespace
# → 就會看到剛才 kubectl 看到的那些管理組件 Pod，用圖形介面呈現

# ── 用完後關閉 ──
jobs
# → 看背景工作列表（[1] minikube dashboard, [2] kubectl proxy）
kill %1 %2
# → 關閉 dashboard 和 proxy

# ── 資源類型速查 ──

kubectl api-resources
# → 列出所有資源類型：NAME、SHORTNAMES、APIVERSION、NAMESPACED、KIND
# → 常用簡寫：
#    po = pods
#    svc = services
#    deploy = deployments
#    ns = namespaces
#    cm = configmaps
#    no = nodes
# → NAMESPACED 欄位：true = 有命名空間隔離，false = 叢集級別（如 Node）
# → 以後打指令用簡寫會快很多：kubectl get po = kubectl get pods
```

---

## 4-10 第一個 Pod 完整 CRUD

```bash
git clone https://github.com/yanchen184/k8s-course-labs.git
cd k8s-course-labs/lesson4
# → 確認目錄下有 pod.yaml 等練習檔案

minikube status
# → 看 host / kubelet / apiserver 三個都是 Running
# → 如果有 Stopped，需要 minikube start

minikube start
# → 只在 minikube status 不是 Running 時才需要執行

kubectl apply -f pod.yaml
# → 看到 pod/my-nginx created，代表 YAML 被 API Server 接受了

kubectl get pods
# → 看 STATUS 欄：ContainerCreating → Running
# → READY 欄：0/1 → 1/1（容器就緒）
# → 如果卡在 ContainerCreating，表示還在拉 Image

kubectl get pods -o wide
# → 多了 IP（Pod 的叢集內部 IP）、NODE（跑在哪個節點）、NOMINATED NODE
# → 重點看 IP 是 10.244.x.x 開頭的叢集內部 IP

kubectl describe pod my-nginx
# → 重點看最下面的 Events 區塊：Scheduled → Pulling → Pulled → Created → Started
# → 這五個事件對應 Pod 從建立到運行的完整過程
# → 如果有錯誤，Events 會顯示原因

kubectl logs my-nginx
# → 看 nginx 的存取日誌，剛建立應該是空的或只有啟動日誌

kubectl exec -it my-nginx -- /bin/sh
# → 進入容器內部的 shell，提示符會變成 # 或 $
# → 現在你在容器「裡面」了

cat /usr/share/nginx/html/index.html
# → 看到 nginx 預設的歡迎頁 HTML 內容

apt-get update && apt-get install -y curl
# → 在容器內安裝 curl（nginx 映像預設沒有）

curl localhost
# → 在容器內部存取 nginx，應該看到 Welcome to nginx! 的 HTML
# → 證明 nginx 在容器內的 80 port 正常運行

exit
# → 離開容器，回到本機 shell

kubectl port-forward pod/my-nginx 8080:80 --address='0.0.0.0'
# → 本機的 8080 port 轉發到 Pod 的 80 port
# → --address='0.0.0.0' 讓所有網路介面都能連入（預設只綁 127.0.0.1，VMware 宿主機連不到）
# → 宿主機瀏覽器打開 http://<VM-IP>:8080 驗證
# → 終端機會被佔住，Ctrl+C 結束轉發
# → 不想被佔住的話，加 & 放背景：
#    kubectl port-forward pod/my-nginx 8080:80 --address='0.0.0.0' &
#    用完後 kill %1 關掉

kubectl delete pod my-nginx
# → 看到 pod "my-nginx" deleted，Pod 被移除

cp pod.yaml pod-httpd.yaml
sed -i 's/name: my-nginx/name: my-httpd/' pod-httpd.yaml
sed -i 's/image: nginx:1.27/image: httpd:2.4/' pod-httpd.yaml
sed -i 's/containerPort: 80/containerPort: 81/' pod-httpd.yaml
# → 練習修改 YAML 的三個關鍵欄位：name、image、containerPort
# → 也可以用 vi pod-httpd.yaml 手動改

kubectl apply -f pod-httpd.yaml
# → 看到 pod/my-httpd created

kubectl exec -it my-httpd -- cat /usr/local/apache2/htdocs/index.html
# → 看到 Apache 的預設頁面 <html><body><h1>It works!</h1></body></html>
# → 注意 Apache 的網頁目錄跟 nginx 不同

kubectl port-forward pod/my-httpd 8080:80 --address='0.0.0.0'
# → 瀏覽器打開 http://<VM-IP>:8080，看到 It works!
# → 或加 & 放背景，用完 kill %1

kubectl delete pod my-httpd
# → 清理 httpd Pod

kubectl apply -f pod.yaml
# → 重新建立 nginx Pod，準備做修改實驗

kubectl exec -it my-nginx -- /bin/sh
echo "Hello Kubernetes" > /usr/share/nginx/html/index.html
exit
# → 在容器內修改了首頁內容

kubectl port-forward pod/my-nginx 8080:80 --address='0.0.0.0'
# → 瀏覽器打開 http://<VM-IP>:8080，看到 Hello Kubernetes
# → 證明容器內的檔案修改是即時生效的
# → 但注意：Pod 刪了重建，這個修改就消失了（引出 Volume 的概念）
# → 或加 & 放背景，用完 kill %1
```

---

## 4-11 回頭操作 + 上午總結

```bash
kubectl apply -f pod.yaml
# → 確認 pod/my-nginx created

kubectl get pods
# → STATUS: Running, READY: 1/1

kubectl get pods -o wide
# → 看 IP 和 NODE

kubectl describe pod my-nginx
# → 看 Events 五步驟：Scheduled → Pulling → Pulled → Created → Started

kubectl logs my-nginx
# → 看 nginx 日誌

kubectl exec -it my-nginx -- /bin/sh
cat /usr/share/nginx/html/index.html
exit
# → 進去看預設首頁，確認是原始內容（之前的修改在 delete 後已消失）

kubectl delete pod my-nginx
# → 清理
```

---

## 4-13 故意把 Pod 搞壞 — 排錯實戰

```bash
kubectl apply -f pod-broken.yaml
# → pod/broken-pod created

kubectl get pods
# → STATUS: ErrImagePull 或 ImagePullBackOff（Image 名字故意打錯）
# → 重點看 STATUS 不是 Running

kubectl get pods --watch
# → 持續觀察狀態變化：ErrImagePull ↔ ImagePullBackOff（退避重試）
# → Ctrl+C 結束 watch

kubectl describe pod broken-pod
# → 拉到最下面看 Events：Failed to pull image "ngin"... not found
# → 這就是找到錯誤原因的關鍵：image 名字拼錯

kubectl delete pod broken-pod
# → 清理壞掉的 Pod

sed -i 's/image: ngin$/image: nginx:1.27/' pod-broken.yaml
# → 把錯誤的 image 名字修正
kubectl apply -f pod-broken.yaml
# → 修正後重新 apply

kubectl get pods
# → STATUS: Running — 修好了！

kubectl delete pod broken-pod
# → 清理

kubectl apply -f pod-crash.yaml
# → 這個 Pod 的程式會故意 crash（exit 1）

kubectl get pods
# → STATUS: CrashLoopBackOff（容器反覆 crash + 重啟）
# → RESTARTS 欄位的數字會持續增加

kubectl describe pod crash-pod
# → Events 看到 Started → Back-off restarting failed container
# → 注意 Back-off 的間隔越來越長

kubectl logs crash-pod
# → 看程式輸出，找到 crash 的原因

kubectl logs crash-pod --previous
# → 看上一次（已 crash）的容器日誌
# → 當容器已經重啟，current 日誌可能是空的，--previous 才能看到 crash 前的輸出

kubectl get pods --watch
# → 觀察 CrashLoopBackOff 的退避間隔越來越長
# → Ctrl+C 結束

kubectl delete pod crash-pod
# → 清理
```

---

## 4-14 回頭操作 Loop 1 — 排錯練習

```bash
kubectl apply -f pod-crash.yaml
kubectl get pods --watch
# → 觀察 CrashLoopBackOff 狀態，RESTARTS 增加

kubectl logs crash-pod
# → 看程式輸出

kubectl logs crash-pod --previous
# → 看 crash 前的日誌

kubectl delete pod crash-pod

cp pod.yaml pod-field-broken.yaml
sed -i 's/kind: Pod/kind: Podd/' pod-field-broken.yaml
kubectl apply -f pod-field-broken.yaml
# → 報錯：error: unable to recognize... no matches for kind "Podd"
# → 重點：YAML 欄位名寫錯，API Server 直接拒絕，Pod 根本不會建立

sed -i 's/kind: Podd/kind: Pod/' pod-field-broken.yaml
sed -i 's/apiVersion: v1/apiVersion: v2/' pod-field-broken.yaml
kubectl apply -f pod-field-broken.yaml
# → 報錯：no matches for kind "Pod" in version "v2"
# → 重點：apiVersion 錯誤也是直接被拒絕

sed -i 's/apiVersion: v2/apiVersion: v1/' pod-field-broken.yaml
kubectl apply -f pod-field-broken.yaml
# → 修正後 apply 成功，kubectl get pods 確認 Running
kubectl delete pod my-nginx
rm pod-field-broken.yaml

cat <<'EOF' > pod-crash-test.yaml
apiVersion: v1
kind: Pod
metadata:
  name: crash-test-pod
spec:
  containers:
  - name: crash
    image: busybox:1.36
    command: ["/bin/sh", "-c", "echo 'about to fail' && exit 1"]
EOF
kubectl apply -f pod-crash-test.yaml
kubectl get pods --watch
# → 觀察 CrashLoopBackOff

kubectl logs crash-test-pod
# → 看到 "about to fail"，然後 exit 1 造成 crash

sed -i 's/exit 1/exit 0/' pod-crash-test.yaml
kubectl delete pod crash-test-pod
kubectl apply -f pod-crash-test.yaml
kubectl get pods --watch
# → STATUS 變成 Completed（exit 0 = 正常結束，不會 CrashLoopBackOff）
# → 重點：exit 0 vs exit 1 的差別

kubectl delete pod crash-test-pod

kubectl run one-shot --image=busybox:1.36 --restart=Never -- /bin/sh -c "echo done && sleep 3"
# → --restart=Never 代表一次性任務，不會重啟
kubectl get pods --watch
# → STATUS: Running → Completed（跑完就結束，不重啟）

kubectl delete pod one-shot
```

---

## 4-16 nginx + busybox Sidecar 實作

```bash
kubectl apply -f pod-sidecar.yaml
# → pod/sidecar-pod created（一個 Pod 裡有兩個容器）

kubectl get pods
# → READY: 2/2（兩個容器都 Running）
# → 重點：READY 欄位的分母代表 Pod 內容器總數

kubectl exec -it sidecar-pod -c nginx -- /bin/sh
# → -c nginx 指定進入 nginx 容器（Pod 有多個容器時必須指定）

apt-get update && apt-get install -y curl
curl localhost
curl localhost
curl localhost
# → 每次 curl 都會產生一筆 nginx access log
exit

kubectl logs sidecar-pod -c log-reader
# → 看到 busybox sidecar 讀取到的 nginx 日誌
# → 證明兩個容器共享了 Volume（emptyDir）
# → 重點：-c 指定容器名稱，多容器 Pod 必須指定

kubectl delete pod sidecar-pod
```

---

## 4-19 dry-run + explain 實作

```bash
cd k8s-course-labs/lesson4
kubectl apply -f pod.yaml
kubectl get pods
# → 確認 Running（port-forward 前面 4-10 已經練過，這裡跳過）

kubectl get pods -o wide
# → 看 IP、NODE 等額外資訊

kubectl get pods -o yaml
# → 看完整的 YAML 輸出（含 K8s 自動填的所有欄位）
# → 重點：status 區塊顯示 Pod 當前的實際狀態

kubectl get pods -A
# → -A = --all-namespaces，看所有命名空間的 Pod
# → 會看到 kube-system 下的系統 Pod（coredns, etcd, kube-apiserver 等）

kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml
# → 不會真的建 Pod，只是產生 YAML 輸出到螢幕
# → 重點：dry-run=client 是「預演」，用來快速產生 YAML 模板

kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml
# → 把產生的 YAML 存成檔案，可以再修改後 apply
# → 比從零手寫 YAML 快很多

kubectl explain pod.spec.containers
# → 看 containers 欄位的文件說明：有哪些子欄位、型別、是否必填
# → 重點：這是內建文件，不用開瀏覽器查

kubectl explain pod.spec.containers.resources
# → 看 resources（CPU/記憶體限制）的詳細說明
# → limits / requests 的用途和格式
```

---

## 4-22 MySQL Pod 實作 — 從做錯到修好

```bash
# ── 故意做錯：缺少環境變數 ──

kubectl apply -f pod-mysql-broken.yaml
# → pod/mysql-pod created（注意：YAML 裡 name 是 mysql-pod）

# ── 排錯三兄弟實戰（4-13 學的，現在真正用一次）──

# 第一步：get pods — 判斷大方向
kubectl get pods --watch
# → STATUS: CrashLoopBackOff（MySQL 啟動失敗）
# → RESTARTS 持續增加，代表容器反覆 crash

# 第二步：describe pod — 看 Events 找啟動失敗原因
kubectl describe pod mysql-pod
# → 拉到最下面看 Events：Started → Back-off restarting failed container
# → 容器有啟動但馬上掛掉，不是 Image 問題（不是 ErrImagePull）
# → 所以問題在程式本身 → 需要看 logs

# 第三步：logs — 看程式輸出找真正原因
kubectl logs mysql-pod
# → 看到錯誤訊息：Database is uninitialized and password option is not specified
# → 真相大白：MySQL 需要設定 MYSQL_ROOT_PASSWORD 環境變數才能啟動
# → 這就是排錯三兄弟的完整流程：get 看狀態 → describe 看事件 → logs 看程式輸出

kubectl delete pod mysql-pod

# ── 手動修正：加上環境變數 ──

cat <<'EOF' > pod-mysql.yaml
apiVersion: v1
kind: Pod
metadata:
  name: mysql-pod
  labels:
    app: mysql
spec:
  containers:
    - name: mysql
      image: mysql:8.0
      ports:
        - containerPort: 3306
      env:
        - name: MYSQL_ROOT_PASSWORD
          value: "my-secret"
EOF
kubectl apply -f pod-mysql.yaml
# → 這次有設 MYSQL_ROOT_PASSWORD，MySQL 可以正常啟動

kubectl get pods --watch
# → STATUS: Running（MySQL 正常啟動了）

kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
# → 進入 MySQL 命令列（注意 -p 和密碼之間沒有空格）

SHOW DATABASES;
# → 看到預設的資料庫：information_schema, mysql, performance_schema, sys

CREATE DATABASE testdb;
SHOW DATABASES;
# → 看到多了 testdb — 驗證 MySQL 可以正常操作

exit
# → 離開 MySQL 命令列

kubectl delete pod mysql-pod
kubectl get pods
# → 確認已清理乾淨
# → 重點提問：剛才建的 testdb 還在嗎？ → 不在了，因為沒有 Volume（引出持久化）
```

---

## 4-23 Loop 4 回頭操作 — 學員自己用 dry-run 建 MySQL Pod

```bash
# ── 學員練習：從零產生 YAML，自己加 env ──

kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml > pod-mysql.yaml
# → 用 dry-run 快速產生 MySQL Pod 的 YAML 模板
# → 打開 pod-mysql.yaml，手動加上 env 區塊：
#    env:
#    - name: MYSQL_ROOT_PASSWORD
#      value: "my-secret"

kubectl apply -f answers/pod-mysql.yaml
kubectl get pods -w
# → -w 是 --watch 的縮寫，觀察 STATUS 變化
# → 如果忘了加 env → CrashLoopBackOff（跟 4-22 一樣的錯）
# → 加了 env → Running

kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
SHOW DATABASES;
exit
# → 驗證 MySQL 正常運行

kubectl delete pod mysql-pod
# → 清理，準備進入 Deployment
```

---

## 4-24 Deployment 初體驗 — 從一個人到一個團隊

```bash
kubectl run lonely-nginx --image=nginx:1.27
# → 直接建一個「裸 Pod」（沒有 Deployment 管理）

kubectl get pods
# → STATUS: Running

kubectl delete pod lonely-nginx
kubectl get pods
# → Pod 消失了，不會自動重建
# → 重點：裸 Pod 刪了就沒了，沒人幫你補

kubectl apply -f deployment.yaml
# → deployment.apps/nginx-deploy created

kubectl get deployments
# → 看 READY（就緒/期望）、UP-TO-DATE、AVAILABLE、AGE
# → READY: 3/3 代表 3 個副本都就緒

kubectl get replicasets
# → 看到 Deployment 自動建立的 ReplicaSet
# → DESIRED / CURRENT / READY 都是 3

kubectl get pods
# → 看到 3 個 Pod，名字格式是 nginx-deploy-xxxxxxx-xxxxx
# → 重點：Pod 名字 = Deployment名-ReplicaSet哈希-Pod哈希

kubectl get deploy,rs,pods
# → 一次看 Deployment + ReplicaSet + Pods 的三層關係

kubectl delete pod <任意一個 pod 名字>
kubectl get pods
# → 重點：Pod 被刪了，馬上自動補一個新的！RESTARTS 0、AGE 很短
# → 跟剛才的裸 Pod 對比：Deployment 管的 Pod 殺不死

kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods
# → 從 3 個變成 5 個，多出的 2 個 AGE 很短（剛建的）

kubectl scale deployment nginx-deploy --replicas=2
kubectl get pods
# → 從 5 個縮回 2 個，多餘的 3 個被 Terminating 然後消失

kubectl delete deployment nginx-deploy
# → 刪 Deployment 會連帶刪除所有它管理的 ReplicaSet 和 Pod
# → kubectl get pods 確認全部消失
```

---
