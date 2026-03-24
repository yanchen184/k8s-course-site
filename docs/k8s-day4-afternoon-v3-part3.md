# 第四堂下午逐字稿 v3 Part 3 — Loop 5：Deployment 入門（4-23 修改版 + 4-24 ~ 4-26）

> 承接 Loop 4 結尾（4-22）：MySQL Pod 實作完成
> 因果鏈：Pod 是一個人做事 → 一個人掛了就停了 → 需要 Deployment → 一個團隊做事
> 4-23 從「第四堂總結」改成「Loop 4 回頭操作」，總結移到 4-26

---

# 影片 4-23（修改版）：Loop 4 回頭操作 — MySQL Pod 補做 + 銜接 Deployment（~8min）

## PPT 上的內容

**沒跟上的同學，快速補做 MySQL Pod**
```bash
kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml > pod-mysql.yaml
# 編輯加 env → apply → exec 驗證 → delete
```

```yaml
# pod-mysql.yaml 關鍵部分
spec:
  containers:
  - name: mysql
    image: mysql:8.0
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "my-secret"
```

```bash
kubectl apply -f pod-mysql.yaml
kubectl get pods -w              # 等 Running
kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
# SHOW DATABASES; → exit
kubectl delete pod mysql-pod
```

**Loop 4 小結**
- MySQL 不給密碼 → CrashLoopBackOff
- 排錯三兄弟找原因 → env 欄位注入環境變數 → 正常啟動
- Docker `-e KEY=VALUE` = K8s `env:` 欄位

**銜接下一個 Loop**
- 今天跑的所有 Pod 都有一個共同的弱點
- 刪掉就沒了，沒人幫你補
- 「一個人做事」→ 下一個 Loop 要變成「一個團隊做事」

## 逐字稿

好，MySQL Pod 的概念和實作都跑完了。如果你前面沒跟上，趁這個時間快速補做一下。

用 dry-run 快速產生骨架。kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml 大於號 pod-mysql.yaml。打開檔案，找到 image 冒號 mysql:8.0 那行。在同一層，加上 env 冒號。底下減號空格 name 冒號 MYSQL_ROOT_PASSWORD，下一行 value 冒號引號 my-secret 引號。存檔。kubectl apply -f pod-mysql.yaml。kubectl get pods -w 等到 Running。然後 kubectl exec -it mysql-pod 兩個減號 mysql -u root -pmy-secret。進去之後 SHOW DATABASES 分號，確認看到四個系統資料庫。exit 離開。最後 kubectl delete pod mysql-pod 清理掉。不到兩分鐘就完成了。

已經做過的同學，幫我回想一下 Loop 4 的因果鏈。我們想跑一個 MySQL，結果沒給密碼，Pod 不斷 crash。排錯三兄弟告訴我們 MySQL 需要 MYSQL_ROOT_PASSWORD 環境變數。在 YAML 的 env 欄位加上去之後，MySQL 順利跑起來了。跟 Docker 的 -e 參數是一模一樣的概念。

好，Loop 4 到這邊結束。

但是在進入下一個 Loop 之前，我要請大家想一件事。

今天下午我們已經跑過很多 Pod 了。nginx、httpd、busybox、mysql。每一個 Pod 跑起來的時候你都很開心，Running，看起來一切正常。但是你有沒有注意到，我們在清理的時候都是 kubectl delete pod，刪掉之後那個 Pod 就真的消失了。kubectl get pods，空空如也。如果你是在生產環境跑一個 API 服務，半夜三點你的 Pod 掛了，沒有人幫你重建，你的使用者就看到錯誤頁面了。

這就是「一個人做事」的問題。一個人生病了、請假了、走了，事情就停了。

今天我們還有最後一個 Loop。在這個 Loop 裡面，我要帶你把「一個人做事」變成「一個團隊做事」。這個讓你從一個人變成一個團隊的東西，叫做 Deployment。

上午的概念篇其實已經提過 Deployment 了，它負責管理多個副本、自動補 Pod、滾動更新。但是光聽概念跟親手操作是完全不一樣的。接下來的影片，我要讓你親眼看到「一個人」有多脆弱，然後親手感受「一個團隊」有多強大。

---

# Loop 5：Deployment 入門

---

# 影片 4-24：Deployment 初體驗 — 從一個人到一個團隊（概念+示範，~15min）

## PPT 上的內容

**先感受一下「一個人做事」有多脆弱**

```bash
kubectl run lonely-nginx --image=nginx:1.27
kubectl get pods                    # Running，看起來很好
kubectl delete pod lonely-nginx
kubectl get pods                    # 空的。沒了。沒人幫你補。
```

**如果這是生產環境...**
```
使用者 → lonely-nginx Pod → Pod 掛了
使用者 → 錯誤頁面（沒人幫你重建）
```

**Deployment = 告訴 K8s「我要幾個 Pod，你幫我維持」**

**Deployment YAML（對照 Pod YAML）**

```yaml
# Pod YAML（你已經很熟了）          # Deployment YAML（多了三樣東西）
apiVersion: v1                      apiVersion: apps/v1          # 不同！
kind: Pod                           kind: Deployment             # 不同！
metadata:                           metadata:
  name: my-nginx                      name: nginx-deploy
spec:                               spec:
  containers:                         replicas: 3                # 新！要幾個副本
  - name: nginx                       selector:                  # 新！怎麼找 Pod
    image: nginx:1.27                   matchLabels:
    ports:                                app: nginx
    - containerPort: 80               template:                  # 新！Pod 的模板
                                        metadata:
                                          labels:
                                            app: nginx
                                        spec:
                                          containers:
                                          - name: nginx
                                            image: nginx:1.27
                                            ports:
                                            - containerPort: 80
```

**Pod YAML vs Deployment YAML 差異表**

| 欄位 | Pod YAML | Deployment YAML |
|:---|:---|:---|
| apiVersion | `v1` | `apps/v1` |
| kind | `Pod` | `Deployment` |
| 容器定義位置 | `spec.containers` | `spec.template.spec.containers` |
| 多了什麼 | 沒有 | `replicas` + `selector` + `template` |

**三個新欄位**
1. `replicas: 3` — 要維持幾個 Pod
2. `selector.matchLabels` — 用什麼標籤找到自己的 Pod
3. `template` — Pod 的模板（長得跟 Pod YAML 幾乎一樣）

**注意：selector 和 template 的 labels 必須一致！**

**三層關係：Deployment → ReplicaSet → Pod**
```
┌─────────────────────────────────────┐
│           Deployment                │  ← 你管這個
│  ┌───────────────────────────────┐  │
│  │         ReplicaSet            │  │  ← 自動建立，你不用管
│  │  ┌───────┐ ┌───────┐ ┌─────┐ │  │
│  │  │ Pod 1 │ │ Pod 2 │ │Pod 3│ │  │  ← 自動維持數量
│  │  └───────┘ └───────┘ └─────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**實作：部署 + 驗證三層 + 刪 Pod 自動補**
```bash
# 部署
kubectl apply -f deployment.yaml

# 驗證三層結構
kubectl get deployments          # Deployment 層
kubectl get replicasets          # ReplicaSet 層（自動建的）
kubectl get pods                 # Pod 層（3 個）

# 一次看三層
kubectl get deploy,rs,pods

# 重點實驗：刪掉一個 Pod
kubectl delete pod <任意一個 pod 名字>
kubectl get pods                 # 還是 3 個！自動補回來了！
```

**對比：Pod 直接建 vs Deployment 建**

| 動作 | 直接建 Pod | 透過 Deployment |
|:---|:---|:---|
| 刪掉一個 Pod | 沒了就沒了 | 自動補一個新的 |
| 想要 3 個 | 手動建 3 次 | `replicas: 3` 一行搞定 |
| 半夜 Pod 掛了 | 你爬起來手動補 | K8s 自動補 |

## 逐字稿

好，進入今天最後一個 Loop，也是今天最精彩的部分。

在開始之前，我要先讓大家親身感受一件事。我們先建一個「孤獨的」nginx Pod。

kubectl run lonely-nginx --image=nginx:1.27。

等幾秒鐘，kubectl get pods。STATUS 是 Running。看起來很好對不對？一切正常，nginx 在跑。

好，現在假設出事了。半夜三點，這個 Pod 因為某些原因掛了。我們用 delete 來模擬這個情況。

kubectl delete pod lonely-nginx。

好，刪掉了。現在 kubectl get pods。

大家看看螢幕。空的。什麼都沒有。No resources found in default namespace。你的 nginx 消失了。如果這是生產環境的 API 服務，你的使用者現在正看著一個錯誤頁面。你要嘛自己爬起來手動再建一個，要嘛等到明天上班才發現。不管哪種，這段時間你的服務就是停了。

這就是我們說的「一個人做事」。一個人倒了，事情就停了。沒有人幫你頂上。

所以我們需要一個東西，能夠告訴 K8s：「我要三個 nginx Pod，你幫我維持。少了一個你就自動補。」這個東西就是 Deployment。

Deployment 怎麼寫？我們來看 YAML。大家把終端機裡的編輯器打開，建一個新檔案叫 deployment.yaml。

我先把整個內容唸一遍，大家跟著打。然後我再逐行解釋。

apiVersion 冒號 apps/v1。注意，不是 v1，是 apps 斜線 v1。上午講 Pod 的時候 apiVersion 是 v1，Deployment 不一樣，因為 Deployment 屬於 apps 這個 API 群組。記不住沒關係，以後用 dry-run 產生模板就自動幫你填好了。

kind 冒號 Deployment。不是 Pod 了，是 Deployment。

metadata 冒號，底下 name 冒號 nginx-deploy。

接下來是 spec，Deployment 的 spec 跟 Pod 的 spec 長得不一樣，因為 Deployment 要管的東西更多。

spec 冒號，底下第一個欄位，replicas 冒號 3。這就是告訴 K8s，我要維持三個 Pod。寫 3 就是三個，寫 5 就是五個，寫 1 就是一個。這是 Deployment 最核心的設定。

第二個欄位，selector 冒號。底下 matchLabels 冒號，再底下 app 冒號 nginx。selector 的作用是告訴 Deployment，你要管理的是哪些 Pod。這裡的意思是：「去找所有 label 裡有 app 等於 nginx 的 Pod，那些就是我管的。」

第三個欄位，template 冒號。這是 Pod 的模板。仔細看 template 底下的內容，是不是跟你之前寫的 Pod YAML 幾乎一模一樣？有 metadata、有 labels、有 spec、有 containers。差別在於不需要寫 apiVersion 和 kind，因為 Deployment 已經知道 template 就是用來建 Pod 的。

template 底下的 metadata 有一個 labels 冒號，app 冒號 nginx。這裡有一個非常重要的細節：template 裡面 labels 的值，必須跟上面 selector 的 matchLabels 一致。因為 Deployment 是靠 selector 來「認領」Pod 的。如果 selector 說找 app 等於 nginx，但 Pod 的 label 是 app 等於 web，Deployment 就找不到自己的 Pod，會以為 Pod 不夠然後一直建新的，永遠建不完。所以請確保這兩個地方的值一模一樣。

template 底下的 spec 就是 Pod 的 spec 了。containers 減號 name 冒號 nginx，image 冒號 nginx:1.27，ports 減號 containerPort 冒號 80。跟你之前寫 Pod YAML 的內容完全一樣。

我幫大家整理一下。跟 Pod YAML 比起來，Deployment YAML 多了三樣東西。第一，replicas，要幾個副本。第二，selector，怎麼找到自己的 Pod。第三，template，Pod 長什麼樣子。其他的部分，apiVersion 從 v1 變成 apps/v1，kind 從 Pod 變成 Deployment，容器定義的位置從 spec.containers 變成 spec.template.spec.containers。就這些差異。如果你 Pod YAML 寫得很熟了，Deployment YAML 只是多包了一層而已。

好，YAML 寫完了，存檔。我們來部署。

kubectl apply -f deployment.yaml。

看到 deployment.apps/nginx-deploy created，成功了。

現在我們來驗證三層結構。Deployment 自動建了 ReplicaSet，ReplicaSet 自動建了 Pod。我們一層一層看。

先看 Deployment。kubectl get deployments。你會看到 nginx-deploy，READY 欄位顯示 3/3。3/3 表示你要求的三個副本全部就緒了。如果顯示 0/3 或 1/3，表示 Pod 還在建立中，等一下就好。

再看 ReplicaSet。kubectl get replicasets。你會看到一個名字像 nginx-deploy 後面接一串亂碼的東西。這個 ReplicaSet 是 Deployment 自動建立的，你不需要手動建，甚至不需要知道它叫什麼。DESIRED 和 CURRENT 都是 3，表示期望三個、實際三個。

最後看 Pod。kubectl get pods。三個 Pod，名字的格式是 nginx-deploy 中間接 ReplicaSet 的 hash 最後接 Pod 自己的隨機字串。三個 Pod 都是 Running。

你也可以用一個指令同時看三層。kubectl get deploy,rs,pods。deploy 是 deployments 的簡寫，rs 是 replicasets 的簡寫。一個指令三個資源類型，所有資訊一目了然。

好，三層結構都確認了。現在來做今天最精彩的實驗。

從三個 Pod 裡面隨便挑一個，把它的名字複製下來，然後刪掉它。kubectl delete pod 後面接那個 Pod 的名字。

刪掉之後馬上 kubectl get pods。

大家看到了嗎？還是三個 Pod。但仔細看，有一個 Pod 的名字跟剛才不一樣了，而且它的 AGE 顯示幾秒鐘。這就是 ReplicaSet 在幕後做的事情。它持續監控 Pod 的數量，發現從三個變成兩個了，不符合你定義的 replicas 冒號 3，所以馬上自動建了一個新的 Pod 補上去。整個過程你什麼都不用做，K8s 幫你搞定了。

對比一下剛才的體驗。lonely-nginx 那個 Pod 是我們直接用 kubectl run 建的，刪掉就真的沒了。但是透過 Deployment 建的 Pod，你刪一個它就補一個。除非你刪的是 Deployment 本身。

這就是從「一個人」變成「一個團隊」。一個人走了就沒人了。但是一個團隊，有人離開了，馬上有新人補上。團隊的人數永遠維持在你設定的數量。半夜三點 Pod 掛了？沒關係，K8s 自動補。你不用爬起來，不用手動建，甚至可能根本不知道發生過這件事。明天早上看一下監控，會發現曾經有一次 Pod 重建的紀錄，但服務從來沒有中斷過。

這就是 Deployment 的威力。今天先讓大家感受到這一點就夠了。Deployment 還有很多強大的功能，像是擴縮容、滾動更新、版本回滾。這些我們下堂課會詳細學。今天你只需要記住一件事：不要直接建 Pod，要透過 Deployment 來管理 Pod。

---

# 影片 4-25：學員實作 + 自由練習（不錄影片，實作題目頁）

## PPT 上的內容

**Loop 5 學員實作**

**必做 1：httpd Deployment（跟著做）**
```yaml
# deployment-httpd.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpd-deploy
spec:
  replicas: 2
  selector:
    matchLabels:
      app: httpd
  template:
    metadata:
      labels:
        app: httpd
    spec:
      containers:
      - name: httpd
        image: httpd:2.4
        ports:
        - containerPort: 80
```
```bash
kubectl apply -f deployment-httpd.yaml
kubectl get deploy,rs,pods           # 確認 2 個 Pod
kubectl delete pod <任意一個>         # 觀察自動補回
kubectl get pods                     # 還是 2 個！
kubectl delete -f deployment-httpd.yaml   # 清理
```

**必做 2：用 kubectl scale 擴縮容**
```bash
# 先確保 nginx-deploy 還在
kubectl get deploy

# 擴容：2 → 5
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods                     # 5 個 Pod

# 縮容：5 → 2
kubectl scale deployment nginx-deploy --replicas=2
kubectl get pods                     # 多的被砍掉，剩 2 個
```

**挑戰：觀察 Pod 分散**
```bash
kubectl get pods -o wide             # 看 NODE 欄位
# minikube 只有一個 Node → 全部在同一台
# 第五堂用 k3s 多節點 → 會看到 Pod 分散在不同 Node
```

**對照 Docker Compose**

| 動作 | Docker Compose | K8s |
|:---|:---|:---|
| 擴到 5 個 | `docker compose up --scale web=5` | `kubectl scale deploy xxx --replicas=5` |
| 縮回 2 個 | `docker compose up --scale web=2` | `kubectl scale deploy xxx --replicas=2` |
| 自動補 Pod | 做不到（除非 Swarm） | Deployment 自動補 |
| 跨機器分散 | 做不到（除非 Swarm） | Scheduler 自動分配 Node |

---

# 影片 4-26：第四堂完整總結 + 回家作業 + 下堂課預告（~10min）

## PPT 上的內容

**回頭操作：Deployment 快速帶做（沒跟上的補做）**
```bash
# 建 Deployment
kubectl apply -f deployment.yaml

# 看三層
kubectl get deploy,rs,pods

# 刪 Pod 自動補
kubectl delete pod <任意一個>
kubectl get pods                # 還是 3 個

# 清理
kubectl delete -f deployment.yaml
```

**比喻總結**
- Pod = 一個人做事 → 生病就停工
- Deployment = 一個團隊做事 → 有人倒了馬上有人頂上

**第四堂完整回顧（因果鏈）**

| 時段 | 因果鏈 |
|:---|:---|
| 上午前半 | Docker 五個瓶頸 → 需要 K8s → 八概念因果鏈 → Master-Worker 架構 |
| 上午後半 | minikube 搭環境 → YAML 四欄位 → 第一個 Pod CRUD |
| 下午 L1 | Pod 壞了怎麼辦 → 排錯三兄弟（get → describe → logs） |
| 下午 L2 | 一個容器不夠 → Sidecar 多容器 Pod + emptyDir |
| 下午 L3 | kubectl 資訊不夠 → -o wide / port-forward / dry-run / explain |
| 下午 L4 | MySQL 跑不起來 → env 環境變數注入 |
| 下午 L5 | Pod 刪了沒人補 → Deployment 自動維持副本數 |

**Pod + Deployment 知識清單（11 項）**

Pod 基礎（9 項）：
1. Pod 概念 + 為什麼不是直接管容器
2. YAML 四大欄位：apiVersion / kind / metadata / spec
3. Pod CRUD：apply / get / describe / logs / exec / delete
4. Pod 生命週期 + 狀態（Pending → Running → CrashLoopBackOff...）
5. 排錯三兄弟：get → describe → logs
6. 多容器 Pod / Sidecar 模式
7. port-forward（臨時通道存取 Pod）
8. dry-run 產生 YAML 模板
9. 環境變數注入（env 欄位）

Deployment 入門（2 項）：
10. Deployment 三層關係（Deployment → ReplicaSet → Pod）
11. 刪 Pod 自動補回（自我修復）

**Docker → K8s 完整對照表（更新版）**

| 你會的 Docker | 今天學的 K8s |
|:---|:---|
| `docker run nginx` | `kubectl apply -f pod.yaml` |
| `docker run -p 8080:80` | `kubectl port-forward pod/xxx 8080:80`（臨時） |
| `docker run -e KEY=VALUE` | YAML 裡的 `env:` 欄位 |
| `docker ps` | `kubectl get pods` |
| `docker logs` | `kubectl logs` |
| `docker exec -it` | `kubectl exec -it -- /bin/sh` |
| `docker stop / rm` | `kubectl delete pod` |
| `docker inspect` | `kubectl describe pod` / `-o yaml` |
| `docker-compose.yaml` | K8s YAML（apiVersion / kind / metadata / spec） |
| `docker compose --scale` | `kubectl scale deployment` |
| `--restart always`（單機） | Deployment `replicas`（跨 Node 自動補） |

**回家作業**
1. 不看筆記，從零寫 nginx Pod YAML → 完整 CRUD 流程
2. 跑不同 image：redis / python:3.12 / busybox:1.36 → 觀察行為差異
3. 寫一個 Deployment YAML（replicas: 3）→ 刪 Pod 觀察自動補回 → scale 到 5 再縮回 3
4. 進階：MySQL Pod + env → exec 建資料庫

**下堂課預告**

| 主題 | 解決什麼問題 |
|:---|:---|
| Deployment 進階 | 擴縮容、滾動更新、版本回滾 |
| Service | port-forward 是臨時的 → 正式的存取入口 |
| k3s 多節點 | minikube 只有一台 → Pod 真正分散到不同 Node |

> 今天你學會了建一個團隊
> 下堂課你要學怎麼讓這個團隊對外服務、怎麼無痛換人、怎麼自動加人

## 逐字稿

好，大家辛苦了，我們來到了第四堂課的最後一支影片。

先做一件事。如果你前面的 Deployment 沒跟上，我快速帶你做一遍。已經做過的同學，趁這個時間做自由練習或整理筆記。

kubectl apply -f deployment.yaml。然後 kubectl get deploy,rs,pods 一次看三層。確認 Deployment 的 READY 是 3/3，ReplicaSet 有一個，Pod 有三個都是 Running。接著做核心實驗，隨便挑一個 Pod 刪掉，kubectl delete pod 接 Pod 名字。然後馬上 kubectl get pods，還是三個 Pod，但有一個是新建的。這就是 Deployment 的自我修復能力。

確認完了之後，kubectl delete -f deployment.yaml 把 Deployment 清掉。注意，你要刪 Deployment 就用 delete -f 指定 YAML 檔案，或者 kubectl delete deployment nginx-deploy。刪掉 Deployment 的時候，底下的 ReplicaSet 和 Pod 會一起被刪掉。這跟刪單一個 Pod 不同，刪 Pod 會被自動補回來，但刪 Deployment 就是真的全部砍掉。

好，回頭操作完畢。我們來做第四堂課的完整回顧。

今天一整天的內容量非常大。從完全不認識 K8s，到你現在能夠獨立操作 Pod 和 Deployment。我們來把今天走過的路串起來。

上午前半段是概念。Docker 用久了你會碰到五個瓶頸：容器太多管不動、跨機器調度、自動修復、滾動更新、服務發現。這五個問題推出了 K8s 的八個核心概念，我們用因果鏈一個接一個串起來。然後看了 Master-Worker 架構，Master 有四個元件負責決策，Worker 有三個元件負責幹活。

上午後半段動手了。用 minikube 搭建了你的第一個 K8s 環境。學了 YAML 的四大欄位。然後寫了你的第一個 Pod YAML，完成了 Pod 的 CRUD。

下午開始就是一連串的因果鏈了。

第一個 Loop，Pod 壞了怎麼辦。Image 拼錯了出現 ImagePullBackOff，程式 crash 出現 CrashLoopBackOff。我們學了排錯三兄弟：get 看狀態、describe 看 Events、logs 看日誌。三個指令配合起來，大多數問題都能定位。

第二個 Loop，一個 Pod 裡面可以放多個容器。nginx 寫日誌、busybox 讀日誌，透過 emptyDir 共享目錄。這就是 Sidecar 模式。

第三個 Loop，kubectl 用得更聰明。-o wide 看更多欄位、port-forward 建臨時通道、dry-run 產生 YAML 模板、explain 查內建文件。還有自動補全和別名讓你打指令更快。

第四個 Loop，MySQL 跑不起來。因為沒給密碼，需要用 env 欄位注入環境變數。跟 Docker 的 -e 參數是同一個概念。

第五個 Loop，也就是剛剛做的。直接建的 Pod 刪了就沒了。Deployment 幫你維持副本數量，刪一個自動補一個。從一個人做事變成一個團隊做事。

五個 Loop，每一步都是因為上一步用出了新的問題。這不是巧合，這就是 K8s 設計的邏輯。每一個功能都是為了解決一個真實的痛點而存在的。

螢幕上有一個知識清單，十一個項目。前九個是 Pod 相關的：Pod 概念、YAML 四欄位、Pod CRUD 六指令、Pod 生命週期、排錯三兄弟、Sidecar 多容器 Pod、port-forward、dry-run、環境變數。後面兩個是今天新加的 Deployment 入門：三層關係和自我修復。如果你能不看筆記把這十一項都解釋出來，今天的內容就完全吸收了。

Docker 對照表也更新了，多了兩行。docker compose --scale 對應 kubectl scale deployment。Docker 的 --restart always 只能管同一台機器，Deployment 的 replicas 可以跨 Node 自動補 Pod。大家截圖存起來當速查卡。

回家作業四個。第一，不看筆記從零寫 nginx Pod YAML，走一遍完整的 CRUD 流程。第二，跑不同的 Image 觀察行為差異，redis 會一直 Running，python 不給 command 會直接退出。第三，今天新加的，寫一個 Deployment YAML，replicas 設 3，刪 Pod 觀察自動補回，然後用 kubectl scale 擴到 5 再縮回 3。第四是進階題，MySQL Pod 加環境變數，進去建資料庫。

最後預告下堂課。

今天你學會了建一個團隊，你的 Pod 不再是孤軍奮戰了。但是你有沒有想過三件事？

第一，團隊要怎麼對外服務？你的使用者怎麼連到你的 Pod？今天用的 port-forward 只是臨時的除錯工具，關掉終端就斷了。下堂課要學的 Service 才是正式讓外部流量連進來的方式。

第二，團隊要怎麼無痛換人？假設 nginx 要從 1.27 更新到 1.28，你不能把三個 Pod 全部停掉再換，那樣使用者會斷線。下堂課要學的滾動更新，新的 Pod 起來了再關舊的，使用者完全感覺不到。

第三，團隊要怎麼自動加人？雙十一流量暴增，你要從 3 個 Pod 擴到 10 個。手動去改 replicas 太慢了。下堂課會教你用 kubectl scale 快速擴縮容。

用一個比喻來結尾。今天你學會了建一個團隊。下堂課你要學怎麼讓這個團隊對外接客、怎麼無痛換血、怎麼因應旺季自動加人。從「有團隊」到「團隊能運作」，這就是第五堂課的價值。

還有一個讓人期待的東西。今天我們用的 minikube 是單節點的，所有 Pod 都擠在同一台機器上。下堂課我們要建一個真正的多節點叢集，用 k3s 開三台虛擬機。你會看到 kubectl get pods -o wide 的時候，不同的 Pod 分散在不同的 Node 上。那個感覺跟今天在 minikube 上操作是完全不一樣的。

好，第四堂課到這裡全部結束。今天從完全不認識 K8s 到能夠操作 Pod 和 Deployment，大家真的辛苦了。回去好好消化，把四個回家作業做一做。下堂課我們會進入更精彩的部分。

下堂課見，大家辛苦了。
