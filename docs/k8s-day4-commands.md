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

## 4-7 動手做

```bash
cat ~/.kube/config
# → 看三個區塊：clusters（叢集位址）、users（認證資訊）、contexts（叢集+使用者的組合）
# → 重點看 current-context 是指向哪個叢集

kubectl config current-context
# → 確認目前連的是哪個叢集（minikube / docker-desktop / 其他）

kubectl config use-context dev
# → 切換叢集，確認輸出顯示 Switched to context "dev"
# → 如果沒有 dev context 會報錯，正常，用來演示切換概念

kubectl get nodes
# → 看 NAME、STATUS（Ready/NotReady）、ROLES（control-plane）、AGE、VERSION
# → minikube 應該只有一個 node，STATUS 必須是 Ready

kubectl cluster-info
# → 看 Kubernetes control plane 的 URL（通常是 https://127.0.0.1:xxxxx）
# → 確認 CoreDNS 是否 running
```

---

## 4-8 動手做

```bash
# ── Dashboard 啟動（VMware 環境，從宿主機瀏覽器存取）──

minikube dashboard &
# → 背景啟動 dashboard 服務，按 Enter 回到命令列
# → 會自動在 minikube 內部署 kubernetes-dashboard

kubectl proxy --address='0.0.0.0' --accept-hosts='.*' --port=8001 &
# → 背景啟動 API proxy，綁定所有網路介面（0.0.0.0）讓外部連入
# → 按 Enter 回到命令列，終端機可以繼續操作

hostname -I
# → 查看 VM 的 IP 位址（例如 192.168.xxx.xxx）
# → 宿主機瀏覽器打開：
# → http://<VM-IP>:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/

# ── 用完後關閉 ──
jobs
# → 看背景工作列表（[1] minikube dashboard, [2] kubectl proxy）
kill %1 %2
# → 關閉 dashboard 和 proxy

# ── 其他指令 ──

kubectl api-resources
# → 看所有資源類型的清單：NAME、SHORTNAMES、APIVERSION、NAMESPACED、KIND
# → 重點：po=pods, svc=services, deploy=deployments, ns=namespaces（縮寫可以少打字）
# → NAMESPACED 欄位：true 代表有命名空間隔離，false 代表叢集級別
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
