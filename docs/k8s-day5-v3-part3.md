# 第五堂逐字稿 v3 Part 3 — Loop 6-8

> 9 支影片（5-18 到 5-26）
> 接續 Part 2（5-9 到 5-17：自我修復 + Labels → ClusterIP → NodePort → 三種比較）
> 因果鏈：DNS 服務發現 → Namespace → DaemonSet → CronJob → 綜合實作 → 總結

---

# Loop 6：DNS + Namespace

---

# 影片 5-18：DNS 服務發現 + Namespace 概念（~15min）

## 本集重點

- 接 5-17：三種 Service 學完了，NodePort 讓外面連得到了
- 但叢集內部 Pod 之間用 ClusterIP 的 IP 連？10.96.0.100 這種東西你寫死在程式裡？
- 第四堂提過 CoreDNS → 現在正式展開
- Service 建好後 K8s 自動註冊 DNS → curl nginx-svc 直接通
- DNS 完整格式：服務名.namespace.svc.cluster.local
- 同 Namespace 可省略後綴，跨 Namespace 要帶 namespace 名
- 引出 Namespace：叢集裡的「資料夾」，用來隔離環境或團隊
- 預設 Namespace：default、kube-system、kube-public、kube-node-lease
- 為什麼要隔離？dev 和 prod 的 nginx-svc 名字一樣但不能互相干擾

| DNS 寫法 | 什麼時候用 |
|:---|:---|
| nginx-svc | 同一個 Namespace 內（最常用） |
| nginx-svc.dev | 跨 Namespace |
| nginx-svc.dev.svc.cluster.local | 完整 FQDN |

| Namespace | 用途 |
|:---|:---|
| default | 你沒指定就在這裡 |
| kube-system | K8s 系統元件（CoreDNS、kube-proxy...） |
| kube-public | 公開資源（很少用） |
| kube-node-lease | 節點心跳（不用管） |

## 逐字稿

上一個 Loop 我們把三種 Service 類型都學完了。ClusterIP 讓叢集內部的 Pod 互相連，NodePort 讓外面的使用者連進來，LoadBalancer 是雲端生產環境用的。到這裡，你的服務不管是對內還是對外，都有穩定的入口了。

但是我要問大家一個問題。你在叢集內部用 ClusterIP 連其他服務的時候，你是怎麼連的？你是不是要先 kubectl get svc 查到 ClusterIP 的 IP，比如 10.43.0.150，然後在你的程式碼裡面寫 API_HOST 等於 10.43.0.150？

你覺得這樣合理嗎？

想想看，ClusterIP 的 IP 雖然不會像 Pod IP 那樣隨便變，但如果你把 Service 刪了重建，IP 就會變。而且你看看那個 IP，10.43.0.150，你背得起來嗎？你的團隊有十幾個微服務，每個都有一個 ClusterIP，你要記十幾個 IP？這跟用電話號碼一樣，你不會去背每個朋友的手機號碼，你會存到通訊錄裡面用名字找。

那在 K8s 裡面，這個「通訊錄」就是 DNS。

其實我們之前已經偷偷用過了。Loop 4 的 ClusterIP 實作裡面，我們在 busybox Pod 裡面 curl http://nginx-svc，直接用 Service 的名字就能連到。當時我提了一句是 CoreDNS 在幫忙，但沒有展開。今天正式來講清楚。

K8s 叢集裡面內建了一個 DNS 服務叫做 CoreDNS。你在 kube-system 這個 Namespace 裡面可以看到它，kubectl get pods -n kube-system，會有一兩個叫 coredns 的 Pod。

CoreDNS 做的事情非常簡單：你每建一個 Service，CoreDNS 就自動註冊一筆 DNS 記錄。Service 叫什麼名字，DNS 就叫什麼名字。比如你建了一個 Service 叫 nginx-svc，CoreDNS 就會記住「nginx-svc 對應 10.43.0.150」。任何 Pod 在叢集裡面做 DNS 查詢 nginx-svc，CoreDNS 就回答 10.43.0.150。

那 Pod 怎麼知道要找 CoreDNS？K8s 在建每個 Pod 的時候，都會自動設定 Pod 裡面的 /etc/resolv.conf，把 DNS server 指向 CoreDNS 的地址。所以你在 Pod 裡面用任何工具做 DNS 查詢，像 curl、wget、nslookup，都會自動走 CoreDNS。你完全不用做任何設定。

好，DNS 名字有三種寫法。

最短的寫法就是 Service 名字本身，比如 nginx-svc。這個只在同一個 Namespace 裡面才有效。因為不同的 Namespace 裡面可能有同名的 Service。

完整的 DNS 名字格式是：Service 名字，點，Namespace 名字，點，svc，點，cluster.local。比如 nginx-svc.default.svc.cluster.local。拆開來看，nginx-svc 是服務名，default 是 Namespace 名，svc 和 cluster.local 是固定的後綴。

如果你要跨 Namespace 連線，只需要寫到 Namespace 就行了，比如 nginx-svc.dev。K8s 會自動幫你補上後面的 svc.cluster.local。

等一下，我剛剛一直在提 Namespace，什麼是 Namespace？

Namespace 中文叫命名空間，你可以把它想成叢集裡面的「資料夾」。就像你電腦裡面用資料夾來分類檔案一樣，K8s 用 Namespace 來分類和隔離資源。

最常見的用法是用來隔離不同的環境。比如你的團隊有 dev 開發環境和 prod 正式環境。兩個環境都有 nginx-svc 這個 Service，但它們不能互相干擾。dev 的 nginx-svc 跑的可能是測試版本，prod 的跑的是正式版本。如果全部放在同一個 Namespace，名字就衝突了，K8s 不允許同一個 Namespace 有兩個同名的 Service。

有了 Namespace，你可以建一個 dev Namespace 和一個 prod Namespace，各自部署各自的。名字一樣但互不影響。dev 裡面的 nginx-svc 的 DNS 是 nginx-svc.dev，prod 裡面的是 nginx-svc.prod。完全隔開。

K8s 預設有幾個 Namespace。default 就是你什麼都沒指定的時候資源會待的地方。我們之前所有的操作，Pod、Deployment、Service，全部都是在 default 裡面。kube-system 放的是 K8s 自己的系統元件，像 API Server、CoreDNS、kube-proxy 這些。kube-public 和 kube-node-lease 基本上你不用管。

有一個重要的觀念：Namespace 只是邏輯上的分組，不是網路上的隔離。不同 Namespace 的 Pod 預設是可以互相連線的，只要你用完整的 DNS 名字。比如在 default 裡面的 Pod，可以用 curl nginx-svc.dev.svc.cluster.local 連到 dev 裡面的 Service。真正的網路隔離要靠 NetworkPolicy，第七堂課會教。

用 Docker 來對照的話，Docker 沒有 Namespace 這個概念。最接近的是不同目錄下的 Docker Compose 專案，不同的 project name 會建立不同的 network，服務名稱可以一樣。但 Docker Compose 的隔離靠的是不同的 Docker network，跟 K8s 的 Namespace 機制不太一樣。

好，概念講完了。總結一下：DNS 讓你用名字找服務，不用記 IP。Namespace 讓你隔離環境，同名服務不衝突。DNS 加上 Namespace，就構成了 K8s 的服務發現機制。同 Namespace 用短名字，跨 Namespace 帶上 Namespace 名字，就這麼簡單。

接下來我們動手驗證。

---

# 影片 5-19：DNS + Namespace 實作（~12min）

## 本集重點

- DNS 驗證：busybox Pod 裡 nslookup nginx-svc → 看到 ClusterIP
- curl nginx-svc → 連到 nginx
- curl nginx-svc.default.svc.cluster.local → 也行
- 建 Namespace：kubectl create namespace dev
- 在 dev 部署 nginx Deployment + Service
- 從 default 的 Pod 跨 Namespace 連：curl nginx-svc.dev.svc.cluster.local
- kubectl get all -n dev → 看 dev 的資源
- kubectl get pods -A → 所有 Namespace

學員實作：
- 必做：建 dev Namespace → 部署 httpd + Service 到 dev → 從 default 的 busybox curl httpd-svc.dev.svc.cluster.local
- 挑戰：建 prod Namespace，部署不同版本的 nginx（dev 用 1.26，prod 用 1.27）→ 從 busybox 分別 curl 驗證版本不同

## 逐字稿

好，來動手。我們分兩段做，先驗證 DNS，再玩 Namespace。

先確認 Deployment 和 ClusterIP Service 還在跑。kubectl get deployments，看到 nginx-deploy 的 READY 是 3/3。kubectl get svc，看到 nginx-svc 的 TYPE 是 ClusterIP。如果不在了，先 apply 把它們建回來。

第一段，驗證 DNS。建一個臨時的 busybox Pod 進去測試。

kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh

為什麼用 busybox？因為它裡面有 nslookup 和 wget 這些工具，很適合做 DNS 測試。

進去之後，先用 nslookup 看一下 DNS 解析。

nslookup nginx-svc

你會看到兩個重要的資訊。第一個是 Server，顯示一個 IP，那個就是 CoreDNS 的地址。第二個是 Name 和 Address，Name 會顯示完整的 FQDN nginx-svc.default.svc.cluster.local，Address 會顯示 Service 的 ClusterIP。

這就證明了 CoreDNS 在運作。你用 nginx-svc 這個短名字查詢，CoreDNS 幫你補上了完整的 default.svc.cluster.local 後綴，然後回傳了 Service 的 IP。

接下來用 wget 實際連一下。

wget -qO- http://nginx-svc

你會看到 nginx 的歡迎頁面。用名字就能連到，不需要知道任何 IP。

再試試完整的 FQDN 寫法。

wget -qO- http://nginx-svc.default.svc.cluster.local

一樣可以連到。這兩個寫法指向同一個 Service。

輸入 exit 離開。

好，DNS 驗證完了。接下來玩 Namespace。

第一步，建一個 dev Namespace。

kubectl create namespace dev

看一下所有的 Namespace。

kubectl get namespaces

你會看到除了 K8s 預設的那幾個，多了一個 dev。

第二步，在 dev 裡面部署 nginx。

kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev

注意 -n dev，這個參數指定資源要建在 dev Namespace 裡面。如果你忘了加 -n，資源就會建到 default 去，這是新手最常犯的錯。

看看 dev 裡面的 Pod。

kubectl get pods -n dev

你會看到一個 nginx Pod 在 dev 裡面跑著。

第三步，在 dev 裡面建一個 Service。

kubectl expose deployment nginx-deploy --port=80 -n dev

kubectl expose 是一個快速建 Service 的指令，它會自動幫你設定好 selector，不用寫 YAML。

現在我們來做跨 Namespace 存取。從 default 的 Pod 連到 dev 的 Service。

kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-deploy.dev.svc.cluster.local

注意 DNS 名字：nginx-deploy.dev.svc.cluster.local。Service 的名字是 nginx-deploy（因為 expose 預設用 Deployment 的名字），Namespace 是 dev。因為我們的 busybox 是在 default Namespace，所以不能只寫 nginx-deploy，要帶上 Namespace 名字。

你應該會看到 nginx 的歡迎頁面。太好了，跨 Namespace 連線成功。

最後看一下 dev 裡面所有的資源。

kubectl get all -n dev

你會看到 Deployment、ReplicaSet、Pod、Service 全部列出來。

如果你想一次看所有 Namespace 的 Pod，用 -A 參數。

kubectl get pods -A

你會看到 default 的 Pod、dev 的 Pod、kube-system 的 Pod，全部列在一起。

好，學員實作時間。必做的部分：建一個 dev Namespace，在裡面部署 httpd 的 Deployment 加 Service，然後從 default 的 busybox 用 httpd-svc.dev.svc.cluster.local 連過去，你應該看到 It works! 的頁面。挑戰的部分：建一個 prod Namespace，在 dev 部署 nginx 1.26，在 prod 部署 nginx 1.27，然後從 busybox 分別 curl 兩個 Namespace 的 Service，看看回傳的 Server header 版本號是不是不一樣。

---

# 影片 5-20：回頭操作 Loop 6（~5min）

## 本集重點

- 帶做 DNS 驗證 + Namespace 建立
- 常見坑：忘記 -n → 資源建到 default
- 跨 Namespace DNS 格式要記住
- 清理

## 逐字稿

來帶大家走一遍。

先驗證 DNS。建 busybox 臨時 Pod，kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh。進去之後 nslookup nginx-svc，看到 CoreDNS 回傳 Service 的 IP。wget -qO- http://nginx-svc，看到 nginx 歡迎頁。exit 離開。

再來 Namespace。kubectl create namespace dev。kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev。kubectl expose deployment nginx-deploy --port=80 -n dev。然後跨 Namespace 連線，kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-deploy.dev.svc.cluster.local。看到 nginx 歡迎頁就成功了。

講一個非常常見的坑。你在某個 Namespace 工作的時候，跑 kubectl 忘記加 -n 參數。資源就建到 default 去了。你在 dev 裡面一直找不到，其實它在 default 裡面。排錯方式很簡單：kubectl get pods -A 看一下所有 Namespace，找到資源在哪裡。

還有一個坑是跨 Namespace 的 DNS 格式寫錯。記住格式：Service名字.Namespace名字.svc.cluster.local。同 Namespace 用短名字就好，跨 Namespace 至少要帶到 Namespace 名字。

實作完了記得清理。kubectl delete namespace dev。刪除 Namespace 會把裡面所有的資源一起刪掉。如果你有建 prod 也一起刪了，kubectl delete namespace prod。

---

# Loop 7：DaemonSet + CronJob

---

# 影片 5-21：DaemonSet + CronJob 概念（~15min）

## 本集重點

- 到目前學的 Deployment 是「我要 N 個 Pod」→ Scheduler 分配到合適的 Node
- 新場景 1：不是「N 個」而是「每台 Node 都要一個」
- 例子：日誌收集（Fluentd）、監控 agent（Node Exporter）、kube-proxy 本身就是 DaemonSet
- DaemonSet：確保每個 Node 剛好跑一個 Pod
- 新 Node 加入 → 自動建 Pod；Node 移除 → Pod 跟著消失
- DaemonSet YAML 跟 Deployment 很像，但沒有 replicas
- 新場景 2：定時任務（資料庫備份、清理暫存檔）
- Docker 裡用 cron → K8s 用 CronJob
- CronJob YAML：schedule 欄位用 cron 語法
- CronJob 每次執行建一個 Job → Job 建一個 Pod → 跑完 Succeeded
- 對比：Deployment 的 Pod 長期 Running，CronJob 的 Pod 跑完就 Completed

| 比較 | Deployment | DaemonSet | CronJob |
|:---|:---|:---|:---|
| 副本數 | 你指定 replicas | 每個 Node 一個（自動） | 每次觸發一個 |
| Pod 狀態 | 長期 Running | 長期 Running | 跑完 Completed |
| 用途 | 無狀態應用 | 節點級服務 | 定時任務 |
| 有 replicas？ | 有 | 沒有 | 沒有 |

## 逐字稿

上一個 Loop 我們學了 DNS 和 Namespace。DNS 讓你用名字找服務，Namespace 讓你隔離不同的環境。這兩個加上之前的 Deployment 和 Service，你已經可以在 K8s 裡面部署一套完整的微服務架構了。

但 Deployment 有一個前提：你要告訴它「我要幾個副本」。三個、五個、十個，你指定 replicas，K8s 就幫你維持那個數量，然後由 Scheduler 決定 Pod 要放在哪些 Node 上。

今天我們來看兩個不一樣的場景。

第一個場景：每台 Node 都要跑一份。

什麼意思？想像你的叢集有三台機器。你想在每台機器上跑一個日誌收集的 agent，比如 Fluentd 或 Filebeat。它的工作是收集那台機器上所有容器的日誌，然後送到集中式的日誌平台。這種東西不是「我要 N 個」，而是「每台機器都要有一個」。你有三台 Node 就要三個，有十台就要十個。新加了一台 Node 進叢集，日誌收集也要自動在上面跑起來。有一台 Node 被移除了，那個 Pod 就跟著消失。

用 Deployment 能做到嗎？可以，但很彆扭。你要把 replicas 設成跟 Node 數量一樣，但 Scheduler 不保證每台 Node 剛好一個，它可能把兩個 Pod 放在同一台 Node 上。你還得設定一堆親和性規則來確保分散。太麻煩了。

K8s 有一個專門為這個場景設計的東西，叫 DaemonSet。Daemon 就是守護程序的意思，在 Linux 裡面 daemon 是一直在背景跑的服務。DaemonSet 確保每個 Node 上剛好跑一個 Pod，不多不少。

新 Node 加入叢集，DaemonSet 自動在上面建一個 Pod。Node 被移除，Pod 跟著消失。你完全不需要手動管理。

其實你已經見過 DaemonSet 了，只是你可能沒注意到。kube-proxy 就是用 DaemonSet 部署的。你跑 kubectl get daemonsets -n kube-system 看看，會看到 kube-proxy 或者 svclb 之類的 DaemonSet。它們在每個 Node 上都跑了一份，確保每台機器的網路功能正常。

DaemonSet 的 YAML 跟 Deployment 非常像。我來唸一下重點的差別。kind 從 Deployment 改成 DaemonSet。apiVersion 一樣是 apps/v1。spec 裡面沒有 replicas 這個欄位，因為 DaemonSet 的副本數不是你決定的，是由 Node 的數量決定的。其他部分，selector、template、containers，跟 Deployment 一模一樣。

我給大家看一個例子。

apiVersion: apps/v1，kind: DaemonSet，metadata 的 name 寫 log-collector。spec 裡面只有 selector 和 template，沒有 replicas。selector 的 matchLabels 寫 app: log-collector。template 裡面的 labels 也要對上。containers 用 busybox，command 是每 30 秒印一行「collecting logs from」加上 hostname。這樣你就能看到每個 Node 上都有一個 Pod 在跑，而且印出來的 hostname 都不一樣，因為分別在不同的 Node 上。

好，第一個場景講完了。來看第二個場景：定時任務。

你有沒有這種需求：每天凌晨三點備份資料庫，每小時清理一次暫存檔，每五分鐘檢查一下某個 API 有沒有回應。

在 Docker 裡面你怎麼做？可能是在容器裡面裝 cron，或者在宿主機上跑 crontab，然後用 docker exec 去執行指令。這些做法都不太乾淨。

K8s 提供了 CronJob 來處理定時任務。CronJob 的名字很直覺，就是 Cron 加上 Job。Cron 是 Linux 的定時排程機制，Job 是 K8s 裡面「跑一次就結束」的任務。CronJob 就是把兩者結合在一起：按照你設定的時間表，定時建立 Job。

CronJob 的 YAML 有一個關鍵欄位叫 schedule，用 cron 語法。如果你用過 Linux 的 crontab，這個格式你一定認識。五個欄位：分鐘、小時、日期、月份、星期幾。比如 */1 * * * * 表示每分鐘執行一次，0 3 * * * 表示每天凌晨三點執行，*/5 * * * * 表示每五分鐘一次。

我來給大家看一個 CronJob 的 YAML。

apiVersion: batch/v1，注意 CronJob 的 apiVersion 不是 apps/v1，是 batch/v1。kind 是 CronJob。metadata 的 name 寫 hello-cron。spec 裡面有一個 schedule 欄位，值是 "*/1 * * * *"，每分鐘一次。然後 jobTemplate 裡面是 Job 的範本，再裡面是 Pod 的範本。containers 用 busybox，command 是 echo "Hello from CronJob!" 加上 date 顯示時間戳。restartPolicy 必須設成 Never 或 OnFailure，因為 CronJob 的 Pod 跑完就該結束，不能讓它一直重啟。

CronJob 的運作流程是這樣的。到了排程時間，CronJob Controller 建立一個 Job。Job 建立一個 Pod。Pod 跑你指定的 command。command 跑完了，Pod 狀態變成 Completed。下次排程時間到了，又建一個新的 Job 和 Pod。

所以你跑 kubectl get pods 的時候，CronJob 的 Pod 狀態不會是 Running，而是 Completed。很多新手看到 Completed 會以為出了問題，其實這是正常的，表示任務跑完了。

做一個對比。Deployment 的 Pod 是長期運行的，狀態是 Running，你希望它一直活著。CronJob 的 Pod 是短暫的，跑完就結束，狀態是 Completed。DaemonSet 的 Pod 跟 Deployment 一樣是長期 Running 的，只是副本數由 Node 數量決定。

整理一下三者的差異。Deployment 是你指定副本數，Pod 長期跑，用來跑無狀態的應用服務。DaemonSet 是每個 Node 一個，Pod 長期跑，用來跑節點級的服務像日誌收集和監控。CronJob 是定時觸發，Pod 跑完就結束，用來做備份和清理這類定時任務。

好，概念講完了，下一支影片我們來動手建 DaemonSet 和 CronJob。

---

# 影片 5-22：DaemonSet + CronJob 實作（~12min）

## 本集重點

- DaemonSet：寫 daemonset.yaml（busybox 每 30 秒印日誌）
- kubectl apply → kubectl get pods -o wide → 每個 Node 一個
- kubectl get daemonsets → DESIRED / CURRENT / READY
- CronJob：寫 cronjob.yaml（每分鐘印 Hello + 時間戳）
- kubectl apply → 等一分鐘 → kubectl get jobs → 看到 Job
- kubectl get pods → Completed 狀態
- kubectl logs → 看到輸出
- 再等一分鐘 → 又一個 Job

學員實作：
- 必做：建 DaemonSet → 確認每個 Node 都有 → 建 CronJob → 看 Job 和 Pod
- 挑戰：改 CronJob 的 schedule 為 "*/2 * * * *"（每兩分鐘）→ 觀察間隔

```yaml
# daemonset.yaml
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
        - name: collector
          image: busybox:1.36
          command: ["sh", "-c", "while true; do echo \"[$(date)] collecting logs from $(hostname)\"; sleep 30; done"]
```

```yaml
# cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: hello
              image: busybox:1.36
              command: ["sh", "-c", "echo 'Hello from CronJob!' && date"]
          restartPolicy: Never
```

## 逐字稿

好，我們先來建 DaemonSet。

建一個檔案叫 daemonset.yaml。apiVersion 是 apps/v1，kind 是 DaemonSet，metadata 的 name 寫 log-collector。spec 裡面注意，沒有 replicas。selector 的 matchLabels 寫 app: log-collector，template 的 labels 也要寫 app: log-collector，跟 Deployment 一樣的規則，selector 和 template labels 要對上。containers 用 busybox:1.36，command 是一個 while true 的循環，每 30 秒印一行日誌，內容是時間戳加上 collecting logs from 加上 hostname。

寫好了，apply 它。

kubectl apply -f daemonset.yaml

看到 daemonset.apps/log-collector created。

來看看 DaemonSet 的狀態。

kubectl get daemonsets

你會看到 log-collector，DESIRED 欄位顯示一個數字，那就是你的 Node 數量。如果你用 k3s 有兩個 Node，DESIRED 就是 2。CURRENT 和 READY 也應該是同一個數字，表示所有 Pod 都建好了。

接下來重點來了。看看 Pod 分布在哪些 Node 上。

kubectl get pods -o wide -l app=log-collector

這裡我用了 -l 來篩選只看 DaemonSet 的 Pod。你會看到每個 Pod 各自跑在不同的 Node 上。如果你有兩個 Node，就看到兩個 Pod，分別在兩台機器。如果有三個 Node，就三個 Pod，每台一個。

這就是 DaemonSet 的效果：不管你有幾個 Node，每個 Node 剛好一個。你不需要指定 replicas，DaemonSet 自動處理。

看看日誌。挑一個 Pod，kubectl logs 加上 Pod 名字。你會看到每 30 秒一行日誌，印出時間和 hostname。

好，DaemonSet 搞定了。接下來建 CronJob。

建一個檔案叫 cronjob.yaml。apiVersion 是 batch/v1，注意跟 Deployment 和 DaemonSet 不一樣，CronJob 屬於 batch API group。kind 是 CronJob。metadata 的 name 寫 hello-cron。

spec 裡面最重要的是 schedule 欄位，我們寫 "*/1 * * * *"，每分鐘執行一次。然後 jobTemplate 裡面嵌套了 Job 的範本。Job 的 spec 裡面又嵌套了 Pod 的 template。containers 用 busybox:1.36，command 是 echo 'Hello from CronJob!' 加上 date。restartPolicy 寫 Never。

你可能會覺得這個 YAML 嵌套很深：CronJob 裡面有 jobTemplate，jobTemplate 裡面有 template，template 裡面才是 containers。對，確實比 Deployment 深一層，因為 CronJob 管 Job，Job 管 Pod，多了一層。

好，apply 它。

kubectl apply -f cronjob.yaml

看到 cronjob.batch/hello-cron created。

現在 CronJob 建好了，但它不會立刻執行，要等到下一個整分鐘的時候。kubectl get cronjobs 看一下，SCHEDULE 欄位顯示 */1 * * * *，LAST SCHEDULE 可能還是空的。

等一分鐘。

好，一分鐘到了。kubectl get jobs。

你會看到一個 Job 出現了，名字大概是 hello-cron-加上一串數字。COMPLETIONS 欄位顯示 1/1，表示 Job 完成了。

kubectl get pods。

你會看到一個 Pod 的狀態是 Completed。注意不是 Running，是 Completed。因為它的任務是跑一次 echo 就結束了，不是長期運行的。

看看它印了什麼。kubectl logs 加上 Pod 名字。

你會看到 Hello from CronJob! 加上時間戳。

再等一分鐘，kubectl get jobs。又多了一個 Job。kubectl get pods，又多了一個 Completed 的 Pod。CronJob 每分鐘都會建一個新的 Job 和 Pod。

K8s 預設會保留最近三個成功的 Job 和一個失敗的 Job，更早的會自動清理掉。你可以在 CronJob 的 spec 裡面用 successfulJobsHistoryLimit 和 failedJobsHistoryLimit 來調整保留數量。

學員實作時間。必做：照著剛才的步驟建 DaemonSet，確認每個 Node 都有 Pod。建 CronJob，等一兩分鐘看到 Job 和 Completed 的 Pod，看一下 logs。挑戰：把 CronJob 的 schedule 改成 "*/2 * * * *"，每兩分鐘一次，觀察 Job 出現的間隔是不是真的變成兩分鐘。

---

# 影片 5-23：回頭操作 Loop 7（~5min）

## 本集重點

- 帶做 DaemonSet + CronJob
- 常見坑：CronJob 的 Pod 是 Completed 不是 Running
- DaemonSet 不需要指定 replicas
- 清理

## 逐字稿

來帶大家走一遍。

DaemonSet 的部分。kubectl apply -f daemonset.yaml。kubectl get daemonsets，看到 DESIRED 和 READY 的數字等於你的 Node 數。kubectl get pods -o wide -l app=log-collector，每個 Node 上一個 Pod。

CronJob 的部分。kubectl apply -f cronjob.yaml。kubectl get cronjobs，看到 schedule。等一分鐘，kubectl get jobs，看到 Job。kubectl get pods，看到 Completed 的 Pod。kubectl logs 加上 Pod 名字，看到 Hello from CronJob 和時間戳。

兩個常見的坑。

第一，CronJob 的 Pod 狀態是 Completed，不是 Running。很多同學看到 Completed 會以為出問題了，想辦法去修。不需要修，這就是正常的。CronJob 的 Pod 就是跑完就結束。如果你看到的狀態是 Error 或 CrashLoopBackOff，那才是有問題。

第二，DaemonSet 的 YAML 不需要 replicas 欄位。如果你從 Deployment 的 YAML 複製過來改成 DaemonSet，記得把 replicas 那行刪掉。加了 replicas 不會報錯，但 K8s 會忽略它，可能造成混淆。

做完了記得清理。kubectl delete daemonset log-collector。kubectl delete cronjob hello-cron。CronJob 刪掉之後，它建的 Job 和 Pod 也會跟著被清理。

---

# Loop 8：綜合實作 + 總結

---

# 影片 5-24：綜合實作引導 — 從零串完整鏈路（~12min）

## 本集重點

- 把今天學的東西從零串一遍
- 完整步驟：Namespace → Deployment → ClusterIP Service → NodePort Service → 外部存取 → scale → 滾動更新 → 回滾
- 這就是最基本的 K8s 服務上線流程
- 第六堂會加上 Ingress、ConfigMap、Secret、PV/PVC

完整步驟：
```
Step 1：建 Namespace（my-app）
Step 2：建 nginx Deployment（replicas: 3）到 my-app
Step 3：建 ClusterIP Service 到 my-app
Step 4：用 busybox 從叢集內部 curl 驗證
Step 5：建 NodePort Service 到 my-app
Step 6：從外面 curl Node IP:NodePort 驗證
Step 7：scale 擴到 5 → 縮回 3
Step 8：滾動更新 nginx 1.27 → 1.28
Step 9：回滾到 1.27
Step 10：清理
```

## 逐字稿

好，今天學了很多東西。從早上的 k3s 多節點、擴縮容、滾動更新、回滾、自我修復、Labels，到下午的 ClusterIP、NodePort、DNS、Namespace、DaemonSet、CronJob。一整天的內容。

現在我們要做一件事：把這些東西從零到一串起來。不是回顧，是真正的從頭到尾動手做一遍。為什麼？因為之前每個 Loop 都是單獨練一個功能，你可能知道每個功能怎麼用，但不一定知道它們怎麼組合在一起。

這個練習模擬的是一個最基本的 K8s 服務上線流程。在真實的工作場景中，你部署一個新服務大概就是這個順序。

Step 1，建 Namespace。

kubectl create namespace my-app

為什麼第一步是建 Namespace？因為你不會把東西直接丟到 default 裡面。真實的專案都會有自己的 Namespace。這是一個好習慣，跟 Docker Compose 你會建一個專案目錄一樣。

Step 2，建 Deployment。

kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app

在 my-app 裡面建一個 nginx 的 Deployment，三個副本。等幾秒鐘，看一下 Pod 跑起來了沒有。

kubectl get pods -o wide -n my-app

三個 Pod 分散在不同的 Node 上，全部 Running。

Step 3，建 ClusterIP Service。

kubectl expose deployment nginx-deploy --port=80 -n my-app

expose 指令預設建的就是 ClusterIP。

Step 4，從叢集內部驗證。

kubectl run test --image=busybox:1.36 --rm -it --restart=Never -n my-app -- wget -qO- http://nginx-deploy

注意我們的 busybox 也建在 my-app Namespace 裡面，所以可以用短名字 nginx-deploy 直接連。你應該看到 nginx 的歡迎頁面。叢集內部的連線沒問題了。

Step 5，建 NodePort Service，讓外面也能連。

這裡用 YAML 比較好，因為 expose 指令建 NodePort 的時候沒辦法指定 nodePort 的值。你可以建一個 nodeport.yaml：

apiVersion: v1，kind: Service，metadata 的 name 寫 nginx-nodeport，namespace 寫 my-app。spec 裡面 type: NodePort，selector: app: nginx-deploy，ports 裡面 port 80，targetPort 80，nodePort 30080。

kubectl apply -f nodeport.yaml

Step 6，從外面驗證。

找到 Node 的 IP，curl http:// 加上 Node IP 冒號 30080。看到 nginx 歡迎頁面，外部存取也通了。

Step 7，擴縮容。

kubectl scale deployment nginx-deploy --replicas=5 -n my-app

kubectl get pods -n my-app，五個 Pod。

kubectl scale deployment nginx-deploy --replicas=3 -n my-app

回到三個。

Step 8，滾動更新。

kubectl set image deployment/nginx-deploy nginx=nginx:1.28 -n my-app

kubectl rollout status deployment/nginx-deploy -n my-app

看到 successfully rolled out。用 kubectl describe deployment nginx-deploy -n my-app 確認 Image 已經是 1.28。

Step 9，回滾。

假設 1.28 有問題，退回去。

kubectl rollout undo deployment/nginx-deploy -n my-app

kubectl describe deployment nginx-deploy -n my-app，確認 Image 回到 1.27。

Step 10，清理。

kubectl delete namespace my-app

一行搞定，Namespace 裡面所有的東西都刪乾淨了。

這十個步驟就是一個最基本的 K8s 服務生命周期。建環境、部署、對內暴露、對外暴露、擴縮容、更新、回滾、清理。第六堂課我們會在這個基礎上再加上 Ingress 用域名路由、ConfigMap 管設定、Secret 管密碼、PV/PVC 做資料持久化。每加一個功能，你的服務就離正式上線更近一步。

---

# 影片 5-25 — 學員自由練習（不錄影片，只列實作題目）

## 學員實作

**必做：跟著 5-24 的步驟完整做一遍**
1. kubectl create namespace my-app
2. kubectl create deployment nginx-deploy --image=nginx:1.27 --replicas=3 -n my-app
3. kubectl expose deployment nginx-deploy --port=80 -n my-app
4. 從 busybox curl nginx-deploy 驗證
5. 建 NodePort Service（nodePort: 30080）
6. 從外面 curl Node IP:30080
7. scale 3 → 5 → 3
8. set image nginx:1.27 → 1.28
9. rollout undo
10. delete namespace my-app

**挑戰 1：同時部署兩個服務**
- 在 my-app 裡同時部署 nginx（app: frontend）+ httpd（app: api）
- 各自有 Deployment + ClusterIP Service + NodePort Service
- nginx 用 NodePort 30080，httpd 用 NodePort 30081
- 從外面分別 curl 兩個 NodePort 驗證

**挑戰 2：跨 Namespace DNS**
- 用 busybox Pod 從叢集內部 curl 兩個 Service 的 DNS 名字
- curl frontend-svc.my-app.svc.cluster.local
- curl api-svc.my-app.svc.cluster.local

**回顧題：不看筆記列出今天學的所有 kubectl 指令**

---

# 影片 5-26：第五堂總結 + 預告（~12min）

## 本集重點

- 今天學了什麼（因果鏈串法回顧）
- kubectl 指令清單（今天新學的）
- Docker → K8s 對照表更新版
- 回家作業
- 下堂課預告（因果鏈）

**今天的因果鏈：**
```
第四堂結尾 Deployment 只有一個 Node → 看不到分散
→ k3s 多節點 → Pod 真的分散了
→ 流量變了要調整 → 擴縮容
→ 新版本要上線 → 滾動更新
→ 新版有 bug → 回滾
→ Pod 掛了 → 自我修復（多節點更震撼）
→ K8s 怎麼認 Pod？→ Labels + Selector
→ Pod 跑起來了外面連不到 → ClusterIP Service（叢集內部）
→ 外面也要連 → NodePort（Node 上開 Port）
→ 用 IP 連太麻煩 → DNS 服務發現
→ 環境要隔離 → Namespace
→ 每台 Node 都要跑一份 → DaemonSet
→ 定時跑任務 → CronJob
→ 全部串起來 → 完整的服務上線流程
```

**今天新學的 kubectl 指令：**
```bash
kubectl scale deployment <name> --replicas=N
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status / history / undo
kubectl get svc / endpoints
kubectl run <name> --image=<img> --rm -it --restart=Never -- <cmd>
kubectl expose deployment <name> --port=80
kubectl create namespace <name>
kubectl get <resource> -n <namespace>
kubectl get <resource> -A
kubectl get daemonsets / cronjobs / jobs
kubectl config set-context --current --namespace=<ns>
```

**Docker → K8s 對照表（更新版）：**

| Docker | K8s | 哪一堂學的 |
|:---|:---|:---|
| docker run | Pod | 第四堂 |
| docker ps / logs / exec | kubectl get / logs / exec | 第四堂 |
| docker compose up --scale web=3 | Deployment replicas: 3 | 第五堂 |
| --restart always | Deployment 自我修復 | 第五堂 |
| -p 8080:80 | Service（NodePort / ClusterIP） | 第五堂 |
| Docker network + 容器名稱 DNS | Service + CoreDNS | 第五堂 |
| 不同 Compose 專案 | Namespace | 第五堂 |
| crontab | CronJob | 第五堂 |
| Nginx 反向代理 | Ingress | 下一堂 |
| -e ENV_VAR | ConfigMap | 下一堂 |
| .env 密碼 | Secret | 下一堂 |
| docker volume | PV / PVC | 下一堂 |

## 逐字稿

好，最後一支影片，我們來做第五堂的總結。

今天一整天下來，我們走了一條很長的因果鏈。每一個概念都是因為上一步沒解決的問題才引出來的，不是隨便排的。我帶大家用因果鏈的方式快速回顧一遍。

第四堂結尾我們用 Deployment 跑了三個 Pod，但那是在 minikube 單節點上，三個 Pod 全擠在同一台，完全看不出分散的效果。所以今天第一件事就是升級到 k3s 多節點叢集。裝好 k3s 之後，kubectl get pods -o wide 一看，Pod 真的分散在不同的 Node 上了。

Pod 分散了之後，我們開始學 Deployment 的三個核心能力。第一個是擴縮容。流量大了，kubectl scale 把副本從三個拉到五個。流量小了，縮回三個。Pod 自動在多個 Node 之間分散。

第二個是滾動更新。新版本要上線，kubectl set image 一行指令，K8s 自動逐步替換，舊的一個一個砍，新的一個一個建，服務不中斷。

第三個是回滾。新版本上了才發現有 bug，kubectl rollout undo 一行指令退回去。K8s 把舊的 ReplicaSet 重新擴容，幾秒鐘就恢復了。

然後我們問了一個問題：Pod 掛了 K8s 真的會自動補嗎？動手驗證了自我修復。刪掉一個 Pod，馬上就有新的出現。在多節點上更震撼，就算整台 Node 掛了，Pod 也會被調度到其他 Node 上重建。

接著我們搞清楚了 K8s 靠什麼認親。Labels 和 Selector 是 K8s 的認親機制。Deployment 的 selector、Pod 的 labels、Service 的 selector，三者要對上。這是最容易出錯的地方。

上午搞定了 Deployment，下午的問題來了：Pod 跑起來了，但外面的人連不到。ClusterIP Service 解決了叢集內部的連線，給了一個穩定的地址加上自動負載均衡。但 ClusterIP 只能叢集內部用。

外面也要連怎麼辦？NodePort Service 在每個 Node 上開一個 Port，外面的人用 Node IP 加上 Port 就能連進來。三種 Service 類型我們做了一個完整的比較。

用了 Service 之後，叢集內部 Pod 之間用 IP 連太蠢了。DNS 服務發現出場，K8s 的 CoreDNS 自動幫每個 Service 註冊 DNS 名字，Pod 裡面直接用 Service 名字就能連。

DNS 名字有一個 Namespace 的部分，這就帶出了 Namespace。Namespace 是叢集裡的資料夾，用來隔離不同環境。dev 和 prod 各自有自己的 Namespace，同名的 Service 不衝突。同 Namespace 用短名字，跨 Namespace 帶上 Namespace 名字。

然後我們學了兩個特殊的工作負載。DaemonSet 確保每個 Node 上跑一個 Pod，適合日誌收集和監控 agent 這種節點級服務。CronJob 按照排程定時建 Job 執行任務，適合備份和清理。

最後我們把所有東西從零串了一遍。Namespace、Deployment、ClusterIP、NodePort、擴縮容、滾動更新、回滾，十個步驟走完就是一個最基本的服務上線流程。

螢幕上列了今天新學的所有 kubectl 指令，大家截圖存起來。還有更新過的 Docker 到 K8s 對照表，Docker 的 scale 對應 Deployment 的 replicas，Docker 的 -p 對應 Service，Docker network 的 DNS 對應 CoreDNS，不同 Compose 專案對應 Namespace，crontab 對應 CronJob。

回家作業三個。第一，從零做一遍完整鏈路，不看筆記。Namespace、Deployment、Service、scale、滾動更新、回滾，整套走一遍。做到不看筆記也能完成，你就真正搞懂了。第二，在兩個 Namespace 各部署一個服務，從 busybox 跨 Namespace curl。第三，建一個 DaemonSet 和一個 CronJob，觀察它們的行為。

最後預告下堂課。

今天你的服務已經可以對外了，NodePort 讓外面的人連得到。但是 192.168.64.3:30080 這種地址也太醜了吧？你能叫客戶輸入這個嗎？所以下堂課要學 Ingress，讓你用漂亮的域名來路由，myapp.com 到前端，myapp.com/api 到後端。

你的設定現在寫死在 YAML 裡面，改設定就要重新 build Image，太痛苦了。所以下堂課要學 ConfigMap，把設定從 Image 抽出來。

密碼呢？你不會把資料庫密碼寫在 ConfigMap 裡吧？ConfigMap 沒有加密，所有人都看得到。所以要學 Secret，專門管敏感資訊。

還有一個問題。Pod 掛了重建，容器裡面的資料就消失了。如果是資料庫，資料沒了可不是鬧著玩的。所以要學 PV 和 PVC，讓資料持久化。

最後，你現在每個功能都要寫一個 YAML 檔案，一個服務可能有五六個 YAML。管起來很麻煩。所以要學 Helm，K8s 的套件管理工具，用一個 chart 把所有東西打包在一起。

打個比方。今天你的團隊學會了讓服務對外。但這個服務現在穿著睡衣出門，沒有域名、沒有設定管理、沒有密碼保護、資料也沒有持久化。下堂課就是給它穿上正式的衣服，域名、設定、密碼、資料持久化，一件一件穿上去，讓它真正可以上線面對客戶。

好，今天的課程到這裡。大家辛苦了，回去做回家作業，我們下堂課見。
