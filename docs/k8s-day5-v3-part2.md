# 第五堂逐字稿 v3 Part 2 — Loop 3 + 下午 Loop 4-5

> 9 支影片（5-9 到 5-17）
> 接續 Part 1（5-1 到 5-8：開場 + Loop 1 擴縮容 + Loop 2 滾動更新/回滾）
> 因果鏈：自我修復 → Labels/Selector → ClusterIP Service → DNS → NodePort → 三種比較

---

# Loop 3：自我修復 + Labels/Selector

---

# 影片 5-9：自我修復 + Labels/Selector 概念（~15min）

## 本集重點

- 接上午：擴縮容和滾動更新都會了，但 Pod 掛了真的會自動補嗎？
- 自我修復原理：Controller Manager 持續監控，期望 3 個但只剩 2 個就補一個
- 多節點更震撼：Node 掛了，上面的 Pod 被調度到其他 Node
- Labels 是什麼：貼在資源上的標籤，key: value 格式
- Selector 是什麼：用 Labels 篩選資源
- 三者要對上：Deployment 的 selector、template 的 labels、Service 的 selector

## 逐字稿

上午我們花了兩個 Loop 學了擴縮容和滾動更新。擴縮容讓你可以根據流量動態調整副本數，滾動更新讓你換版本的時候不用停機。這兩個功能加在一起，Deployment 已經非常強大了。

但是我要問大家一個問題：Pod 掛了，真的會自動補回來嗎？

我們之前在擴縮容的時候有做過一個小實驗，刪掉一個 Pod，馬上就看到一個新的出現。但那只是在單節點上做的，而且只刪了一個。今天我們有多節點的 k3s 叢集，我想帶大家做一個更震撼的實驗，讓你真正感受到 K8s 的自我修復能力。

不過在做實驗之前，先來理解自我修復的原理。

還記得第四堂講的 K8s 架構嗎？Master Node 上有一個 Controller Manager。這個 Controller Manager 裡面跑著很多 Controller，其中有一個叫 Deployment Controller。它的工作非常單純：每隔一小段時間就去檢查一下，現在實際跑著的 Pod 數量，跟你在 Deployment 裡面設定的 replicas 數量，是不是一樣的。

假設你設定 replicas 是 3，現在有 3 個 Pod 在跑，一切正常。突然有一個 Pod 掛了，可能是程式 bug 導致記憶體洩漏，可能是容器裡面的主程序意外退出了。Controller Manager 偵測到現在只剩 2 個 Pod 在跑，不符合期望的 3 個，它就會告訴 Scheduler 說「我需要一個新的 Pod」。Scheduler 找一個有空位的 Node，在上面啟動新的 Pod。整個過程你完全不需要介入，通常幾秒鐘就完成了。

這就是我們一直在說的宣告式管理。你告訴 K8s「我要 3 個 Pod」，K8s 就想辦法維持 3 個。不管 Pod 是被你手動刪的、還是自己掛的、還是所在的 Node 整台死機了，K8s 都會幫你補回來。

在多節點的環境裡面，自我修復更震撼。假設你有三個 Node，三個 Pod 分別跑在不同的 Node 上。Node 2 突然掛了，可能是硬碟壞了、可能是 kernel panic、可能是電源線被清潔阿姨踢掉了。Node 2 上面的 Pod 也跟著掛了。K8s 怎麼處理？首先，kubelet 會停止回報心跳，Controller Manager 大約 40 秒之後判定 Node 2 已經 NotReady。然後它會把 Node 2 上面的 Pod 標記為要驅逐，接著 Scheduler 把這些 Pod 調度到還活著的 Node 1 或 Node 3 上重建。整台機器掛了，服務不受影響。這就是為什麼我一直說多節點才能看到 K8s 真正的威力。

好，自我修復的原理搞懂了。但這裡有一個很重要的問題：K8s 怎麼知道哪些 Pod 屬於哪個 Deployment？

你想想看，一個叢集裡面可能有幾十個 Deployment，跑著上百個 Pod。Deployment A 管 nginx 的 Pod，Deployment B 管 API 的 Pod，Deployment C 管前端的 Pod。當一個 nginx 的 Pod 掛了，K8s 怎麼知道要通知哪個 Deployment 去補？是靠名字嗎？不是。Pod 的名字是隨機的，nginx-deploy-abc123-xyz，這個名字每次都不一樣。

答案是 Labels。

Labels 是貼在 K8s 資源上的標籤。每個標籤是一組 key-value，比如 app: nginx、env: production、team: backend。你可以在任何資源上貼任意數量的標籤。它就像超市裡商品上的分類標籤，一瓶牛奶上面可能貼了「乳製品」、「冷藏」、「特價」三個標籤。

Labels 本身沒有什麼神奇的，它就是一組 metadata。真正有用的是 Selector。Selector 是用 Labels 來篩選資源的機制。你說「給我所有 app 等於 nginx 的 Pod」，K8s 就去找所有有 app: nginx 標籤的 Pod 還給你。

回到 Deployment 的 YAML，你還記得裡面有三個地方跟 Labels 有關嗎？

第一個，metadata.labels，這是 Deployment 自己的標籤。就像你的身分證上的名字，用來描述 Deployment 本身。

第二個，spec.selector.matchLabels，這是 Deployment 的選擇器。它告訴 Deployment：「你要管理的 Pod，必須有這些標籤。」比如 matchLabels 寫 app: nginx，Deployment 就只管有 app: nginx 標籤的 Pod。

第三個，spec.template.metadata.labels，這是 Pod 範本的標籤。Deployment 建出來的 Pod 會帶上這些標籤。

這三個地方有一個黃金法則：第二個和第三個的值必須一致。如果 selector 說找 app: nginx，但 template 裡 Pod 的標籤是 app: web，那 Deployment 建出來的 Pod 自己都認不回來，它會以為 Pod 不夠然後一直建新的，陷入死循環。

而且等一下我們要學的 Service 也會用到 Selector。Service 的 selector 也要設成 app: nginx，這樣 Service 才知道要把流量轉給哪些 Pod。所以你要記住：Deployment 的 selector、Pod template 的 labels、Service 的 selector，三者要對上。這是 K8s 裡面最常見的配對錯誤之一。

Labels 和 Selector 在 kubectl 裡面也很好用。kubectl get pods --show-labels 可以看到每個 Pod 的所有標籤。kubectl get pods -l app=nginx 可以用 label 篩選 Pod，只列出有 app=nginx 標籤的。這在 Pod 很多的時候非常方便，你不用一個一個看名字，直接用標籤篩。

好，概念講完了。這個 Label 和 Selector 的機制其實就是 K8s 的「認親機制」。Deployment 靠它認 Pod，Service 靠它認 Pod，後面的 NetworkPolicy、HPA 也靠它。可以說 Labels 和 Selector 是 K8s 裡面最基礎的關聯方式，搞懂了後面很多東西就通了。

接下來我們馬上動手，先做自我修復的實驗，再來玩 Labels。

---

# 影片 5-10：自我修復 + Labels 實作（~12min）

## 本集重點

- 自我修復實測：delete Pod 看自動補回來
- 多節點觀察：Pod 被調度到哪些 Node
- --show-labels 看標籤
- -l 用 label 篩選 Pod
- 手動加標籤、改標籤
- 挑戰：改掉 app label → Pod 變孤兒 + Deployment 補新的

## 逐字稿

好，概念講完了，我們來動手。先確認一下 Deployment 還在跑。

執行 kubectl get deployments，你應該看到 nginx-deploy 的 READY 是 3/3。如果不是，先跑 kubectl apply -f deployment.yaml 把它建起來。

再跑 kubectl get pods -o wide，看到三個 Pod，注意看 NODE 那一欄，三個 Pod 分別跑在哪些 Node 上面。如果你用的是 k3s 多節點叢集，你應該會看到 Pod 分散在不同的 Node 上。這就是 Scheduler 在做的事，它會盡量把 Pod 分開來，避免全部擠在同一台。

好，開始第一個實驗。自我修復。

隨便挑一個 Pod，複製它的名字，然後刪掉它。

kubectl delete pod 加上你複製的 Pod 名字。

刪掉之後馬上跑 kubectl get pods。你會看到還是三個 Pod，但有一個的 AGE 是幾秒鐘，名字也不一樣了。這就是 ReplicaSet 偵測到 Pod 數量從 3 變成 2，立刻補了一個新的。

我們再大膽一點，一次刪兩個。用 kubectl delete pod 把兩個 Pod 的名字都列上去。

馬上 kubectl get pods，你會看到有兩個新的 Pod 正在建立。幾秒鐘之後跑一次 kubectl get pods，三個 Pod 全部 Running，又恢復正常了。

你可以試試用 kubectl get pods -o wide 看一下新 Pod 跑在哪個 Node 上。Scheduler 不一定會放回原來的 Node，它會看哪個 Node 比較空閒就放哪個。

好，自我修復實測完了。接下來玩 Labels。

跑 kubectl get pods --show-labels。

你會在最右邊看到一個 LABELS 欄位，每個 Pod 都有一個 app=nginx 的標籤，還有一個 pod-template-hash 的標籤。app=nginx 是你在 Deployment 的 template 裡定義的，pod-template-hash 是 K8s 自動加的，用來區分不同版本的 ReplicaSet。

現在用 label 來篩選。跑 kubectl get pods -l app=nginx。

你會看到跟 kubectl get pods 一樣的結果，因為目前所有 Pod 都有 app=nginx。但如果你的叢集裡同時跑著其他 Deployment 的 Pod，-l 就很有用了，它只會列出你要的那些。

接下來我們手動幫某個 Pod 加一個標籤。先記下任意一個 Pod 的名字，然後執行 kubectl label pod 加上 Pod 名字 env=test。

再跑 kubectl get pods --show-labels。你會看到那個 Pod 多了一個 env=test 的標籤。其他兩個 Pod 沒有。

用 label 篩選試試看。kubectl get pods -l env=test，只會列出那一個 Pod。kubectl get pods -l app=nginx，還是三個，因為 env=test 是額外加的，不影響原本的 app=nginx。

好，現在來做一個很有趣的思考題。如果你把某個 Pod 的 app=nginx 標籤改掉，會發生什麼事？

想一下。Deployment 的 selector 是 matchLabels app=nginx。它靠這個標籤來認 Pod。如果某個 Pod 的 app 標籤被你改成 app=other，Deployment 就認不出這個 Pod 了，它會覺得自己少了一個 Pod，然後補一個新的。

來試試看。先記下一個 Pod 的名字，執行 kubectl label pod 加上 Pod 名字 app=other --overwrite。注意要加 --overwrite，因為 app 這個 key 已經存在了，你要覆蓋它。

執行完之後馬上 kubectl get pods。

你會看到四個 Pod！三個是 Running 狀態，一個是剛建的。等幾秒鐘再看，會穩定在四個 Pod。

為什麼是四個？因為你改了標籤的那個 Pod 還活著，只是它不再屬於 Deployment 了，變成了一個「孤兒」Pod。Deployment 看到自己只剩兩個 Pod（只有兩個有 app=nginx 標籤），不符合 replicas=3，所以補了一個新的。

跑 kubectl get pods --show-labels 確認一下。你會看到三個有 app=nginx，一個有 app=other。

這個孤兒 Pod 不會被 Deployment 管，不會被自動修復，也不會被自動刪除。你要手動把它刪掉：kubectl delete pod 加上那個孤兒 Pod 的名字。

這個實驗告訴我們一件非常重要的事：Labels 不只是裝飾，它是 K8s 的認親機制。Deployment 靠 Labels 認 Pod，Service 也靠 Labels 認 Pod。標籤對了就是自己人，標籤不對就不認識。

好，學員實作時間。必做的部分：delete Pod 看自我修復，用 --show-labels 看標籤，用 -l 篩選 Pod。挑戰的部分：把某個 Pod 的 app label 改掉，觀察 Deployment 補新 Pod 和舊 Pod 變孤兒的現象。做完之後把孤兒 Pod 清理掉。

---

# 影片 5-11：回頭操作 + 上午總結（~5min）

## 本集重點

- 帶做自我修復 + Labels 查看
- Labels/Selector 重點：三者要對上
- 上午三個 Loop 總結
- 下午預告

## 逐字稿

好，我們來帶大家把剛才的操作走一遍。

先確認 Deployment 在跑，kubectl get deployments，看到 3/3。

接著 delete 一個 Pod，kubectl delete pod 加上 Pod 名字。馬上 kubectl get pods，看到新的 Pod 出現了。

然後看 Labels，kubectl get pods --show-labels。每個 Pod 都有 app=nginx。

用 label 篩選，kubectl get pods -l app=nginx，列出所有 nginx 的 Pod。

如果你剛才有做挑戰題——把 app label 改掉觀察孤兒 Pod——記得把孤兒清掉，kubectl delete pod 加上孤兒的名字。

Labels 和 Selector 最重要的一件事我再強調一次：Deployment 的 selector、Pod template 的 labels、還有待會要學的 Service 的 selector，三者要對上。只要有一個沒對上，不是 Deployment 認不到 Pod，就是 Service 導不到流量。這是新手最容易踩的坑。

好，來做上午的總結。今天上午我們用了三個 Loop，學了 Deployment 的三個核心能力。

Loop 1，擴縮容。kubectl scale 一行指令就能把副本數從 3 改成 5 再改回 2，Pod 自動在多個 Node 之間分散。

Loop 2，滾動更新和回滾。kubectl set image 更新版本，K8s 自動逐步替換，服務不中斷。萬一新版本有問題，kubectl rollout undo 一行指令退回去。

Loop 3，自我修復加 Labels。Pod 掛了 K8s 自動補回來，甚至整台 Node 掛了也能把 Pod 搬到其他 Node 上重建。而 K8s 靠的就是 Labels 和 Selector 這套認親機制，來知道哪些 Pod 屬於哪個 Deployment。

這三個能力合在一起，Deployment 就是你在 K8s 裡面管理無狀態應用的瑞士刀。擴縮容、更新、修復，全部自動化。

但是問題來了。Pod 跑起來了，Deployment 管得很好，可是外面的使用者怎麼連進來？你的 Pod 有 IP 沒錯，但那是叢集內部的 IP，外面的人根本看不到。而且 Pod 的 IP 會變，寫死 IP 連線早晚會斷。

怎麼辦？下午我們就來解決這個問題。下午的主角是 Service。

---

# Loop 4：ClusterIP Service

---

# 影片 5-12：ClusterIP Service 概念（~15min）

## 本集重點

- 接上午：Deployment 管副本很厲害，但外面的人怎麼連？
- Pod IP 的兩大問題：會變、叢集外面連不到
- Service = 穩定入口 + 負載均衡
- ClusterIP（預設類型）：叢集內部的穩定 IP
- Service YAML 拆解：selector 對應 Pod 的 labels、port / targetPort
- Endpoints：Service 背後的 Pod IP 列表
- DNS：Service 名稱自動註冊，其他 Pod 用名字就能連
- 對照 Docker Compose 的服務名稱互連

## 逐字稿

歡迎回來，下午的第一個主題是 Service。

上午我們學完了 Deployment 的三大能力：擴縮容、滾動更新、自我修復。Deployment 把 Pod 管得服服貼貼的，你說要三個就三個，掛了自動補，更新不停機。

但是現在有一個問題。這些 Pod 跑起來了，各自有各自的 IP。你用 kubectl get pods -o wide 可以看到每個 Pod 的 IP，像 10.42.0.15、10.42.1.8、10.42.2.12 之類的。

問題一：這些 IP 會變。上午我們做了自我修復的實驗，刪掉一個 Pod，新的 Pod 會拿到一個全新的 IP。如果你的前端 Pod 把後端 Pod 的 IP 寫死在設定裡，比如寫 API_HOST 等於 10.42.0.15，結果那個 Pod 掛了重建，IP 變成 10.42.0.20 了。前端還在連 10.42.0.15，連不上，服務斷了。

問題二：你有三個 Pod，使用者到底該連哪一個？如果三個使用者全部連同一個 Pod，另外兩個 Pod 閒在那邊，那你擴容的意義在哪裡？你需要一個東西幫你把流量分散到三個 Pod 上。

問題三：Pod 的 IP 是叢集內部的虛擬 IP。你在自己的電腦上打開瀏覽器，輸入 10.42.0.15，是連不上的。這個 IP 只有在叢集裡面的 Pod 才能存取。

三個問題：IP 會變、流量沒分散、外面連不到。K8s 的解決方案就是 Service。

第四堂課我們在全貌介紹的時候已經提過 Service 的概念了。當時說 Service 是 Pod 前面的穩定代理人，不管後面的 Pod 怎麼換，Service 的地址不變。今天我們來實際建一個。

Service 有三種類型：ClusterIP、NodePort、LoadBalancer。我們先從 ClusterIP 開始，它是預設類型，也是最常用的。

ClusterIP 會給你一個叢集內部的虛擬 IP。這個 IP 不會變，只要 Service 存在，IP 就不變。叢集裡面的任何 Pod 都可以用這個 IP 來存取你的服務。Service 會自動把流量負載均衡到後面的 Pod 上，你不用操心該連哪一個。

那 Service 怎麼知道要把流量轉給哪些 Pod？答案就是上午學的 Labels 和 Selector。

你在 Service 的 YAML 裡面設定 selector，比如 app: nginx。Service 就會去找所有有 app: nginx 標籤的 Pod，把它們加進轉發清單。這就是為什麼上午要先教 Labels 和 Selector，因為 Service 也靠這個機制來找 Pod。

我們來看 Service 的 YAML 怎麼寫。

apiVersion 是 v1，跟 Pod 一樣。kind 是 Service。metadata 裡面的 name 很重要，等一下 DNS 會用到這個名字。

spec 裡面有三個重點。

第一個是 type: ClusterIP。這是預設值，你不寫也行，K8s 會自動幫你設成 ClusterIP。

第二個是 selector。這裡寫 app: nginx，意思是「我這個 Service 要服務所有 label 有 app=nginx 的 Pod」。這個值必須跟 Deployment template 裡 Pod 的 labels 一致。上午的黃金法則又出現了：Deployment 的 selector、Pod 的 labels、Service 的 selector，三者要對上。

第三個是 ports。ports 裡面有兩個欄位：port 和 targetPort。port 是 Service 自己監聽的 Port，也就是別人連 Service 的時候用的 Port。targetPort 是 Service 要轉發到 Pod 的哪個 Port。通常這兩個一樣，都寫 80。但如果你想讓別人用 8080 連 Service、Service 再轉到 Pod 的 80，也可以。用 Docker 來對照，docker run -p 8080:80，左邊的 8080 就像 port，右邊的 80 就像 targetPort。

Service 建好之後，K8s 會在背後維護一個東西叫 Endpoints。Endpoints 就是 Service 對應的 Pod IP 列表。你用 kubectl get endpoints 加上 Service 名字就能看到。比如你的 nginx Service 後面有三個 Pod，Endpoints 就會列出三個 IP 加上 Port。Pod 被刪了重建，Endpoints 會自動更新。Pod 數量 scale 上去了，Endpoints 也會自動增加。你完全不需要手動操作。

還有一個非常好用的功能：DNS。K8s 內建了 CoreDNS 服務，你建一個 Service 之後，K8s 會自動在 DNS 裡面註冊一筆記錄。Service 的名字就是 DNS 名字。比如你的 Service 叫 nginx-svc，其他 Pod 就可以直接用 http://nginx-svc 來連，不需要知道 Service 的 IP 是多少。

如果要完整的 DNS 名字，格式是：Service名字.Namespace.svc.cluster.local。比如 nginx-svc.default.svc.cluster.local。但在同一個 Namespace 裡面，直接用 Service 名字就夠了，不需要打那麼長。Namespace 是什麼？簡單來說就是叢集裡面的隔離空間，我們之後會講。目前我們所有的東西都在 default 這個 Namespace。

用 Docker Compose 來對照：Docker Compose 裡面你可以用容器名稱互連，比如 http://api:8080。K8s 的 Service 就是同樣的概念，只是它可以跨 Node、有負載均衡、有自動健康檢查。Docker Compose 的 DNS 只是簡單的名稱解析，K8s 的 Service 背後有 kube-proxy 在做真正的負載均衡，而且會自動踢掉不健康的 Pod。

整理一下。ClusterIP Service 解決了三個問題：IP 會變的問題，Service 的 IP 不會變。流量不知道分給誰的問題，Service 自動負載均衡。用 IP 太麻煩的問題，Service 有 DNS 名字。

但是 ClusterIP 有一個限制：它是叢集內部的 IP，只有叢集裡面的 Pod 能連。你在外面的瀏覽器打開 Service 的 IP，還是連不上。那外面的人怎麼辦？這個問題留到 Loop 5 用 NodePort 來解決。我們先把 ClusterIP 搞熟。

---

# 影片 5-13：ClusterIP 實作（~12min）

## 本集重點

- 確認 nginx Deployment 在跑
- 寫 service-clusterip.yaml，逐行解釋
- kubectl apply → kubectl get svc → kubectl get endpoints
- 用 busybox/curl Pod 驗證：curl nginx-svc
- DNS 名字：nginx-svc.default.svc.cluster.local
- 刪 Pod → endpoints 自動更新
- Service 自動指向新 Pod

## 逐字稿

好，來建我們的第一個 Service。

先確認 Deployment 還在跑。kubectl get deployments，看到 nginx-deploy 的 READY 是 3/3。kubectl get pods -o wide，三個 Pod 分散在不同 Node 上，記下它們的 IP。

現在我們來寫 Service 的 YAML 檔案。建一個檔案叫 service-clusterip.yaml，內容是這樣的。

apiVersion: v1，Service 用 v1。kind: Service。metadata 的 name 寫 nginx-svc。spec 裡面，type 寫 ClusterIP，這行其實可以省略因為 ClusterIP 是預設值，但我建議寫出來讓 YAML 更清楚。selector 寫 app: nginx，跟 Deployment template 裡 Pod 的 labels 一致。ports 裡面 port 寫 80，targetPort 也寫 80。

檔案寫好了，apply 它。

kubectl apply -f service-clusterip.yaml。

看到 service/nginx-svc created，成功了。

來看看 Service 的狀態。kubectl get svc，svc 是 service 的縮寫。

你會看到兩個 Service。第一個是 kubernetes，這是 K8s 系統自帶的，不用管。第二個就是我們剛建的 nginx-svc，TYPE 是 ClusterIP，CLUSTER-IP 欄位有一個 IP 地址，比如 10.43.0.150 之類的。PORT(S) 是 80/TCP。

這個 10.43.0.150 就是 Service 的 ClusterIP，它不會變。只要 Service 存在，這個 IP 就一直是這個。

接下來看 Endpoints。kubectl get endpoints nginx-svc。

你會看到 ENDPOINTS 欄位列出了三個 IP 加上 Port，比如 10.42.0.15:80, 10.42.1.8:80, 10.42.2.12:80。這三個就是 Service 後面的三個 Pod 的 IP。你可以對照一下 kubectl get pods -o wide，會發現 IP 是對得上的。

好，ClusterIP 只能在叢集內部連。我們要怎麼驗證呢？建一個臨時的 Pod 進去測試。

執行 kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh。

這行指令做了幾件事：用 curlimages/curl 這個輕量的 image 建一個臨時 Pod，--rm 表示離開後自動刪除，-it 進入互動模式，--restart=Never 表示不要自動重啟，最後的 sh 是進入 shell。

進去之後，用 Service 名字連線：curl http://nginx-svc。

你應該會看到 nginx 的歡迎頁面，那段很熟悉的 Welcome to nginx 的 HTML。

再多 curl 幾次，每次都能成功。你會注意到不管你 curl 多少次，連的都是 nginx-svc 這個名字，不需要知道任何 Pod 的 IP。Service 在背後幫你做了負載均衡，把請求分散到三個 Pod 上。

試試看完整的 DNS 名字：curl http://nginx-svc.default.svc.cluster.local。一樣可以連到。這個格式是 Service名字.Namespace.svc.cluster.local。因為我們在 default Namespace 裡，所以中間是 default。在同一個 Namespace 裡面，你直接用 nginx-svc 就夠了，不需要打那麼長。

輸入 exit 離開，臨時 Pod 會自動刪除。

最後做一個重要的驗證。我們刪掉一個 Pod，看 Endpoints 會不會自動更新。

先看一下目前的 endpoints。kubectl get endpoints nginx-svc，記下三個 IP。

然後刪掉一個 Pod。kubectl delete pod 加上任一 Pod 的名字。

等幾秒鐘，再看 endpoints。kubectl get endpoints nginx-svc。

你會發現 Endpoints 裡的 IP 列表變了。被刪掉的那個 Pod 的 IP 不見了，取而代之的是新建的 Pod 的 IP。Service 自動偵測到 Pod 的變化，更新了 Endpoints。整個過程你不需要做任何事。

這就是 Service 的威力。Pod 可以隨便掛、隨便重建，IP 怎麼變都無所謂，Service 的地址永遠不變，Endpoints 自動更新，流量永遠能到達健康的 Pod。

學員實作時間。必做：自己建一個 httpd 的 Deployment 加 ClusterIP Service。Deployment 用 httpd 這個 image，replicas 設 2。Service 的 selector 要跟 Deployment 的 Pod labels 一致。然後用 busybox curl 進去連 httpd-svc，你應該會看到 It works! 這個 httpd 的預設頁面。挑戰題：kubectl get endpoints 觀察，然後 scale Deployment 從 2 改成 4，再看 endpoints 是不是跟著變多了。

---

# 影片 5-14：回頭操作 Loop 4（~5min）

## 本集重點

- 帶做 ClusterIP + busybox curl
- 常見坑：selector 沒對上 → endpoints 是空的
- 排錯方式：kubectl get endpoints → 空的就檢查 selector

## 逐字稿

來帶大家走一遍 ClusterIP Service 的操作。

首先確認 Deployment 在跑，kubectl get deployments，READY 3/3。

建立 Service，kubectl apply -f service-clusterip.yaml。

查看 Service，kubectl get svc，看到 nginx-svc 的 TYPE 是 ClusterIP。

查看 Endpoints，kubectl get endpoints nginx-svc，看到三個 Pod 的 IP。

驗證連線，kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh，進去之後 curl http://nginx-svc，看到 nginx 歡迎頁。exit 離開。

這就是 ClusterIP Service 的完整流程。

現在講一個非常常見的坑。你建了 Service，但 curl 連不到，一直 timeout 或者 connection refused。怎麼排錯？

第一步，kubectl get endpoints 加上 Service 名字。如果你看到 ENDPOINTS 那一欄是空的，沒有列出任何 IP，那問題八成是 selector 沒對上。

什麼意思？就是你 Service 的 selector 寫的標籤，跟 Pod 實際的標籤不一致。比如 Service 的 selector 寫 app: nginx，但你的 Pod 的 label 是 app: my-nginx，差一個字母，Service 就找不到 Pod，Endpoints 就是空的。

排錯方式很簡單。kubectl describe svc 加上 Service 名字，看 Selector 那一行，確認它的值。然後 kubectl get pods --show-labels，確認 Pod 的 labels。兩邊對一下，看哪裡不一樣。

還有一個常見的錯誤是 targetPort 寫錯了。Service 可以連上 Pod，但 Pod 裡面的容器不是監聽那個 Port。比如你的容器監聽 8080，但 targetPort 寫了 80。curl 會拿到 connection refused。

記住這個排錯流程：連不上 → 先看 endpoints 有沒有 IP → 沒有就檢查 selector → 有的話就檢查 targetPort。這個流程可以解決百分之九十的 Service 問題。

---

# Loop 5：NodePort + 三種比較

---

# 影片 5-15：NodePort + LoadBalancer + 三種比較（~15min）

## 本集重點

- 接 Loop 4：ClusterIP 解決了叢集內部的連線，但外面連不到
- NodePort：在每個 Node 上開一個 Port（30000-32767）
- NodePort YAML：type 改成 NodePort，多一個 nodePort 欄位
- 三個 Port 的關係：nodePort → port → targetPort
- LoadBalancer：雲端環境申請外部 IP + 負載均衡器
- 三種比較表：ClusterIP / NodePort / LoadBalancer
- 怎麼選？

## 逐字稿

上一個 Loop 我們學了 ClusterIP Service。ClusterIP 給了我們一個叢集內部的穩定地址，叢集裡面的 Pod 可以用 Service 名字互相找到對方，流量自動負載均衡到後面的 Pod。問題解決了？解決了一半。

叢集裡面的 Pod 互相連通了，但你的使用者不在叢集裡面。使用者在外面，他們打開瀏覽器，輸入你的服務地址，想看到你的網站。ClusterIP 的 IP 是叢集內部的虛擬 IP，只有叢集裡面的 Pod 能連到，外面的電腦完全連不上。

那我們需要一種方式，讓叢集外面的人也能連到 Service。

第一個方案是 NodePort。

NodePort 的原理非常簡單。它在叢集裡每一個 Node 上都開一個 Port。這個 Port 的範圍是 30000 到 32767。外面的人用 Node 的 IP 加上這個 Port 就能連進來。

舉個例子。你有三個 Node，IP 分別是 192.168.64.2、192.168.64.3、192.168.64.4。你建了一個 NodePort Service，分配到的 Port 是 30080。那外面的人用 192.168.64.2:30080 可以連到你的服務，用 192.168.64.3:30080 也可以，用 192.168.64.4:30080 也可以。三個 Node 都行，因為 NodePort 在每個 Node 上都開了同一個 Port。

流量的路線是這樣的：外部請求到達 Node 的 30080 Port，Node 上的 kube-proxy 接收到之後，轉發給 Service，Service 再負載均衡到後面的 Pod。Pod 不一定跑在你連的那個 Node 上，但沒關係，kube-proxy 會幫你轉到正確的 Pod 上，不管 Pod 在哪個 Node。

來看 NodePort Service 的 YAML。跟 ClusterIP 的差別不大，主要改兩個地方。

第一，type 從 ClusterIP 改成 NodePort。

第二，ports 裡面多了一個 nodePort 欄位，值是 30080。你可以自己指定一個 30000 到 32767 之間的數字，也可以不寫讓 K8s 隨機分配一個。

現在有三個 Port，容易搞混，我幫大家理清一下。

最外面是 nodePort，就是 Node 上開的那個 Port，30080。這是外面的人用的，他們用 Node IP 加 nodePort 連進來。

中間是 port，就是 Service 自己監聽的 Port，80。這是叢集內部用的，其他 Pod 用 Service 名字加 port 連。

最裡面是 targetPort，就是 Pod 上容器監聽的 Port，80。這是最終接收請求的地方。

流量路線：外部到 nodePort 30080，轉到 Service 的 port 80，再轉到 Pod 的 targetPort 80。

用 Docker 來對照。docker run -p 30080:80 nginx，左邊的 30080 就像 nodePort，右邊的 80 就像 targetPort。差別在於 Docker 只在一台機器上開 Port，K8s 的 NodePort 在每個 Node 上都開。所以你連任何一個 Node 都能存取到服務，這比 Docker 靈活很多。

NodePort 適合什麼場景？開發測試環境很好用。你想快速讓別人連到你的服務，不想搞什麼負載均衡器或域名設定，直接 NodePort 一開，給對方一個 IP 加 Port 就能連了。簡單粗暴但有效。

但 NodePort 也有限制。第一，Port 範圍只有 30000 到 32767，一千多個。服務多了可能不夠用。第二，讓使用者記住 IP 加 Port 這種地址太不專業了。你能想像告訴你的客戶「請打開 192.168.64.2:30080」嗎？他們可能以為你在開玩笑。

生產環境一般不用 NodePort，而是用 LoadBalancer 或 Ingress。

LoadBalancer 是第三種 Service 類型。它會向雲端服務商申請一個外部的負載均衡器。比如你在 AWS 上跑 K8s，建一個 LoadBalancer Service，AWS 會自動幫你建一個 ELB，分配一個公開的 IP 或域名。使用者直接用這個地址連，LoadBalancer 把流量分到你的 Node，再到 Service，再到 Pod。

LoadBalancer 的 YAML 更簡單，type 改成 LoadBalancer 就好了。但它只在雲端環境才有意義。在本地的 k3s 或 minikube 上，沒有真正的雲端負載均衡器，LoadBalancer Service 會一直卡在 Pending 狀態。k3s 有一個內建的 ServiceLB 可以模擬，但功能有限。

好，三種 Service 類型都講完了，我們用一個表來比較。

ClusterIP，存取範圍是叢集內部，適合微服務之間的溝通，比如 API 連資料庫。對照 Docker 的話就像 Docker Compose 的服務名稱 DNS。

NodePort，存取範圍是外部通過 Node IP 加 Port，適合開發測試或簡單的外部存取。對照 Docker 就像 docker run -p。

LoadBalancer，存取範圍是外部通過雲端負載均衡器，適合生產環境。對照 Docker 的話就是雲端的 ALB 或 ELB。

有一個重點：這三種是遞增關係。NodePort 包含了 ClusterIP 的所有功能。你建了一個 NodePort Service，它同時也有 ClusterIP。叢集內部可以用 ClusterIP 連，外部可以用 NodePort 連。LoadBalancer 包含了 NodePort 的所有功能。你建了一個 LoadBalancer Service，它同時有 ClusterIP 和 NodePort。

怎麼選？很簡單。叢集內部的服務用 ClusterIP，這是預設的，不用多想。測試環境想從外面連就用 NodePort。生產環境用 LoadBalancer，或者更常見的做法是用 Ingress。Ingress 不是 Service 類型，它是另外一個東西，坐在 Service 前面做 HTTP 路由。第六堂課會講。

好，概念講完了，接下來動手建 NodePort Service。

---

# 影片 5-16：NodePort 實作（~12min）

## 本集重點

- 寫 service-nodeport.yaml
- kubectl apply → kubectl get svc → 看到 NodePort
- 用 curl 從外部連 Node IP:NodePort
- 兩個 Node 都可以連
- 瀏覽器打開
- 對比 ClusterIP：ClusterIP 只能叢集內連，NodePort 外面也能連
- 限制：Port 範圍、地址不好記

## 逐字稿

好，來動手建 NodePort Service。

先確認 nginx Deployment 還在跑，kubectl get deployments，READY 3/3。ClusterIP Service 也應該還在，kubectl get svc，看到 nginx-svc。

現在我們再建一個 NodePort Service。建一個檔案叫 service-nodeport.yaml。

apiVersion: v1，kind: Service，metadata 的 name 寫 nginx-nodeport。spec 裡面，type 寫 NodePort。selector 一樣是 app: nginx，跟前面的 ClusterIP Service 指向同一組 Pod。ports 裡面，port 寫 80，targetPort 寫 80，nodePort 寫 30080。

注意這裡我們同時有兩個 Service 指向同一個 Deployment 的 Pod，這完全沒問題。一個 Service 走叢集內部，一個 Service 走外部，各走各的路，互不影響。

好，apply 它。

kubectl apply -f service-nodeport.yaml。

看到 service/nginx-nodeport created。

查看 Service 列表。kubectl get svc。

你會看到三個 Service。kubernetes 是系統的，nginx-svc 是我們的 ClusterIP，nginx-nodeport 是我們剛建的 NodePort。注意看 nginx-nodeport 的 TYPE 是 NodePort，PORT(S) 欄位顯示 80:30080/TCP，意思是 Service 的 80 Port 映射到 Node 的 30080 Port。

接下來，我們從叢集外面來連。

首先要拿到 Node 的 IP。如果你用 k3s 加 multipass，執行 multipass list，會看到每個虛擬機的 IP。或者用 kubectl get nodes -o wide，看 INTERNAL-IP 那一欄。

假設你的某個 Node IP 是 192.168.64.3。在你自己的電腦上（不是在叢集裡面），執行 curl http://192.168.64.3:30080。

你應該會看到 nginx 的歡迎頁面。Welcome to nginx。太好了，我們成功從叢集外面連到了叢集裡面的 Pod。

NodePort 的一個特點是每個 Node 都開了同一個 Port。所以試試另一個 Node 的 IP，比如 192.168.64.4，curl http://192.168.64.4:30080。一樣可以連到。甚至你連 master Node 的 IP 也可以，雖然 Pod 不一定跑在 master 上，但 kube-proxy 會幫你把流量轉到正確的 Pod。

你也可以在瀏覽器裡打開 http://192.168.64.3:30080，會看到 nginx 的歡迎頁面。這跟第四堂課用 port-forward 不同，port-forward 是臨時的，你關掉終端機就斷了。NodePort 是永久的，只要 Service 存在就一直有效。

如果你用的是 minikube，可以執行 minikube service nginx-nodeport，它會自動幫你打開瀏覽器並連到正確的地址。

現在做一個對比。我們的 ClusterIP Service nginx-svc，只能在叢集裡面連。你在自己的電腦上 curl http://10.43.0.150（ClusterIP 的 IP），是連不上的。但 NodePort Service 可以，因為它在 Node 上開了一個真實的 Port，外面的電腦可以直接存取 Node 的 IP。

不過 NodePort 也有限制。第一，Port 範圍是 30000 到 32767，地址很長不好記。你不會讓正式使用者用 192.168.64.3:30080 這種地址。第二，如果你有多個服務，每個都要佔一個 NodePort，Port 很快就不夠用了。

這些限制怎麼解決？第六堂課會教 Ingress。Ingress 坐在 Service 前面，讓你用域名和路徑來路由，比如 www.mysite.com 轉到前端 Service，www.mysite.com/api 轉到後端 Service。一個域名搞定所有服務，不用記一堆 Port。今天先知道有這個東西就好。

學員實作時間。必做：自己建一個 NodePort Service 指向 nginx Deployment，從你的電腦 curl Node IP 加 NodePort 看到 nginx 歡迎頁。記得要先查 Node 的 IP。挑戰題：同時保留 ClusterIP 和 NodePort 兩個 Service 指向同一個 Deployment，從 busybox Pod 裡面用 nginx-svc 連（走 ClusterIP），同時從外面用 Node IP 加 NodePort 連，驗證兩條路都通。

---

# 影片 5-17：回頭操作 Loop 5 + 下午小結（~5min）

## 本集重點

- 帶做 NodePort：建立、curl、瀏覽器
- 常見坑：防火牆擋 NodePort、用錯 IP
- 三種 Service 一句話回顧
- 下午 Loop 4-5 小結

## 逐字稿

來帶大家走一遍 NodePort 的操作。

確認 Deployment 在跑，kubectl get deployments，READY 3/3。

建立 NodePort Service，kubectl apply -f service-nodeport.yaml。

查看 Service，kubectl get svc，看到 nginx-nodeport 的 TYPE 是 NodePort，PORT(S) 是 80:30080/TCP。

拿到 Node IP，kubectl get nodes -o wide，看 INTERNAL-IP。

從外面 curl，curl http:// 加上 Node IP 冒號 30080。看到 nginx 歡迎頁就成功了。

如果你 curl 之後一直沒回應或者 connection refused，檢查兩件事。

第一，確認你用的是 Node 的 IP，不是 Pod 的 IP，也不是 Service 的 ClusterIP。Pod IP 和 ClusterIP 都是叢集內部的，外面連不到。你要用 kubectl get nodes -o wide 看到的那個 INTERNAL-IP。

第二，如果你的環境有防火牆（比如雲端的安全群組或本機的 iptables），確認 30080 Port 有開放。防火牆擋住的話，curl 會一直卡住沒回應。k3s 用 multipass 的話通常不會有這個問題，但如果你用的是雲端虛擬機，記得開放安全群組。

好，三種 Service 做個一句話回顧。

ClusterIP：叢集內部的穩定入口，微服務之間互相連用這個。

NodePort：在每個 Node 上開 Port，讓外面的人連得到，開發測試用這個。

LoadBalancer：向雲端要一個負載均衡器，生產環境用這個，或者用 Ingress。

下午我們用了兩個 Loop 學了 Service。Loop 4 學了 ClusterIP，解決了叢集內部 Pod 之間互連的問題。Pod IP 會變沒關係，Service 的地址不變。用 Service 名字就能連，DNS 自動解析。Loop 5 學了 NodePort，解決了叢集外部存取的問題。在 Node 上開一個 Port，外面的使用者終於能看到你的服務了。

加上上午的三個 Loop，今天一共學了五個 Loop。從擴縮容、滾動更新、自我修復，到 ClusterIP、NodePort。一條因果鏈下來：Deployment 管好了 Pod，但外面連不到，所以需要 Service。Service 的 ClusterIP 解決了叢集內部，NodePort 解決了外部。每一步都是上一步沒解決的問題引出來的。

下一個 Loop 我們會學 DNS 和 Namespace。DNS 讓你用名字找服務，Namespace 讓你隔離不同的環境。繼續沿著這條因果鏈往下走。
