# 第四堂上午逐字稿 Part 2 — 影片 4-9、4-10、4-11

> 承接 4-8（探索叢集、Dashboard、kubectl 對照 Docker）
> 主線：從「看懂架構」進入「動手寫 YAML、跑第一個 Pod」

---

# 影片 4-9：YAML 格式 + Pod 概念（概念，~15min）

## 本集重點

- K8s 怎麼知道你要什麼？ → 答案是 YAML
- YAML 三大語法規則：空格縮排、冒號後空格、減號列表
- 四大必備欄位：apiVersion / kind / metadata / spec
- 對照 docker-compose.yaml，從已知推未知
- apiVersion 常見值速查表
- Pod 是什麼：K8s 最小部署單位，容器的一層包裝
- Sidecar 模式簡介
- 最佳實踐：一個 Pod 一個容器
- Docker 指令 vs kubectl 指令對照

## 對照表

| Docker 指令 | kubectl 對應 |
|:---|:---|
| `docker run nginx` | `kubectl run nginx --image=nginx` |
| `docker ps` | `kubectl get pods` |
| `docker logs <id>` | `kubectl logs <pod-name>` |
| `docker exec -it <id> bash` | `kubectl exec -it <pod-name> -- bash` |
| `docker stop / rm` | `kubectl delete pod <pod-name>` |
| `docker inspect` | `kubectl describe pod <pod-name>` |

## 逐字稿

好，上一支影片我們在 kube-system 裡面親眼看到了 K8s 的架構組件，etcd、API Server、Scheduler、Controller Manager 全都是以 Pod 的形式在跑。我們也用 Dashboard 看了叢集的圖形化介面，用 describe node 看了 Node 的詳細資訊。到目前為止，我們知道了 K8s 是什麼、為什麼需要它、它的架構長什麼樣子，而且環境也裝好了。

但是有一個問題我們還沒回答：我怎麼告訴 K8s 我要什麼？

你想一下，在 Docker 的世界裡，你要跑一個 nginx 容器，就在終端機裡打 docker run nginx，一行指令搞定。你要開 Port、掛 Volume、設環境變數，就在後面加參數。一切都是用指令來告訴 Docker「你現在幫我做這件事」。

但是在 K8s 裡面，事情不太一樣。K8s 的設計理念是「宣告式管理」，還記得我們在第一支影片講的嗎？你不是一步一步告訴它怎麼做，而是寫一份文件告訴它「我想要的最終狀態是什麼」，然後 K8s 自己想辦法做到。這份文件，就是用 YAML 格式寫的。

所以今天上午剩下的時間，我們要做兩件事。第一，搞懂 YAML 怎麼寫。第二，用 YAML 寫出你的第一個 Pod，跑起來，然後對它做各種操作。

我們先來搞定 YAML。

YAML 全名是 YAML Ain't Markup Language，一個遞迴縮寫，表示它不是標記語言。其實你已經用過 YAML 了。還記得 Docker Compose 嗎？docker-compose.yaml 就是一個 YAML 檔案。所以 YAML 的基本語法你其實不陌生，只是可能沒有仔細去看它的規則。

YAML 的語法有三個重點，我一個一個說。

第一個重點，縮排用空格，絕對不能用 Tab 鍵。這是初學者最常踩到的坑。你在編輯器裡面按 Tab 鍵，看起來好像是空格，但其實它是一個 Tab 字元，YAML 會直接報錯。我強烈建議大家現在就打開你的編輯器，把 Tab 設定成自動轉換為兩個空格。VS Code 的話，右下角可以直接改。vim 的話，在設定檔裡加上 set expandtab、set tabstop=2、set shiftwidth=2。這個設定做一次，以後就不會再踩到了。

第二個重點，冒號後面要有空格。寫 name 冒號空格 my-pod，冒號和值之間一定要有一個空格。如果你寫 name 冒號 my-pod，中間沒空格，YAML 會把整個字串當成一個 key，解析就錯了。

第三個重點，列表用減號加空格開頭。比如你有一個容器列表，每個容器前面加一個減號空格，像「減號空格 name 冒號 nginx」這樣。減號後面也要有空格，不能省略。

三個規則，記住了就不會出錯：空格縮排、冒號後空格、列表用減號。

好，語法知道了，來看 K8s 的 YAML 長什麼樣子。每一個 K8s 的 YAML 檔案，不管你要建什麼資源，都一定有四個必備欄位。

第一個是 apiVersion。這個告訴 K8s 你用的是哪個版本的 API。不同的資源類型有不同的 apiVersion。比如 Pod 用 v1，Deployment 用 apps/v1，Ingress 用 networking.k8s.io/v1。你不需要背這些，實際寫的時候查一下就好。螢幕上有一個常見值的對照表，大家可以截圖存起來。Pod、Service、ConfigMap、Secret 都是 v1。Deployment、ReplicaSet、DaemonSet 是 apps/v1。CronJob 是 batch/v1。Ingress 是 networking.k8s.io/v1。

第二個是 kind。就是你要建什麼類型的資源。Pod、Service、Deployment、ConfigMap，寫在 kind 這裡。

第三個是 metadata。中繼資料，也就是關於這個資源的一些描述資訊。最重要的是 name，給你的資源取個名字。比如 name 冒號 my-nginx。你之後用 kubectl 操作的時候都會用到這個名字。另外還有一個很常用的是 labels，標籤。標籤是一組 key-value 的配對，比如 app 冒號 nginx。標籤的用途非常大，後面學 Service 的時候你就會知道，Service 就是靠標籤來找到它要轉發的 Pod。

第四個是 spec。specification 的縮寫，就是「規格」的意思。你想要什麼樣的容器、用什麼 Image、開什麼 Port、要不要掛 Volume，全部都寫在 spec 裡面。spec 是整個 YAML 裡面最重要、也是變化最多的部分。不同的資源類型，spec 裡面要寫的東西完全不一樣。

這四個欄位：apiVersion、kind、metadata、spec。你可以這樣記：apiVersion 是「你要用什麼語言跟 K8s 溝通」，kind 是「你要建什麼東西」，metadata 是「這個東西叫什麼名字」，spec 是「這個東西長什麼樣子」。四個問題，對應四個欄位。

現在來跟 Docker Compose 的 YAML 做個對照。Docker Compose 裡面寫 version 冒號 3，K8s 這邊對應的是 apiVersion。Docker Compose 裡面的 services 區塊，定義你要跑哪些服務，K8s 這邊拆成了 kind 加 spec。Docker Compose 的 image 冒號 nginx，K8s 寫在 spec 底下的 containers 列表裡面。最大的差別是：Docker Compose 一個檔案可以描述一整套系統，包括前端、後端、資料庫。但 K8s 的 YAML 通常一個檔案描述一個資源。你要一個 Pod 寫一個檔案，要一個 Service 再寫一個檔案。雖然你也可以用三個減號的分隔線把多個資源寫在同一個檔案裡，但我們先養成好習慣，一個檔案一個資源。

好，YAML 格式搞定了。現在來認識今天最重要的主角 — Pod。

Pod 是 K8s 裡面最小的部署單位。請注意，不是 Container，是 Pod。在 Docker 的世界裡，你直接 docker run 就跑一個容器。但在 K8s 裡面，K8s 不直接管容器，它管的是 Pod。Pod 是在容器外面再包一層，你可以把它想成容器的「膠囊」。

那 Pod 和容器到底是什麼關係？一個 Pod 裡面可以放一個或多個容器。而且同一個 Pod 裡的容器是共享網路和儲存的。共享網路是什麼意思？就是同一個 Pod 裡面的兩個容器，它們用的是同一個 IP 位址，彼此之間可以用 localhost 互相通訊。共享儲存是什麼意思？就是它們可以掛載同一個 Volume，讀寫同一批檔案。

為什麼不直接管容器，要多包一層？因為有些場景你需要把兩個緊密耦合的容器放在一起。最經典的例子就是 Sidecar 模式。想像你有一個 API 容器，它把日誌寫到一個檔案裡。旁邊放一個日誌收集的容器，專門負責讀取這個日誌檔案，然後把日誌傳送到集中式的日誌系統。這兩個容器需要共享同一個目錄，所以放在同一個 Pod 裡最方便。Sidecar 就是「邊車」的意思，主容器是摩托車，輔助容器是掛在旁邊的邊車。

不過在絕大多數情況下，最佳實踐是一個 Pod 裡面只放一個容器。你現在就把 Pod 等於一個容器來理解就好，只是多了一層包裝。下午我們會實際做一個多容器的 Pod，到時候你就更有感覺了。

最後我們來看 Docker 和 kubectl 的指令對照。Docker 的 docker run nginx，K8s 對應 kubectl run nginx --image=nginx。Docker 的 docker ps，對應 kubectl get pods。Docker 的 docker logs，對應 kubectl logs。Docker 的 docker exec -it，對應 kubectl exec -it。Docker 的 docker stop 加 docker rm，對應 kubectl delete pod。Docker 的 docker inspect，對應 kubectl describe pod。

你會發現，幾乎是一對一的對應。邏輯完全一樣，只是換了一套指令。如果你 Docker 用得熟，kubectl 上手會非常快。唯一要注意的一個小差異是，kubectl exec 的時候，在 Pod 名字和要執行的指令之間要加兩個減號。這個我們等一下實作的時候會詳細說。

好，概念都講完了。YAML 怎麼寫知道了，Pod 是什麼也知道了，指令對照也看過了。接下來，我們就來動手寫第一個 Pod。

---

# 影片 4-10：第一個 Pod 完整 CRUD（實作示範，~15min）

## 本集重點

- 建工作目錄 ~/k8s-labs
- 寫 pod.yaml（nginx:1.27）→ 逐行解釋每一行
- kubectl apply -f（講 apply vs create）
- kubectl get pods / get pods -o wide
- kubectl describe pod（重點講 Events）
- kubectl logs
- kubectl exec -it -- /bin/sh → 進容器驗證 nginx 運行
- kubectl delete pod
- 完整 CRUD 流程對照 Docker

## 逐字稿

好，這是今天上午最重要的一個實作 — 建立你的第一個 Pod。如果說前面的影片都是在「看」，這支影片我們要開始「做」了。請大家把終端機打開，編輯器準備好，跟著我一步一步來。

第一步，我們先建一個工作目錄。在你的終端機裡面，輸入 mkdir -p ~/k8s-labs，然後 cd ~/k8s-labs。這個目錄我們之後所有的 K8s 練習檔案都放在這裡，集中管理比較好找。

在開始之前，先確認一下 minikube 還在跑。輸入 minikube status，看一下狀態。如果 host、kubelet、apiserver 都顯示 Running，就沒問題。如果沒有在跑，輸入 minikube start 重新啟動一下。

好，環境確認了，我們來寫 YAML。打開你的編輯器，建一個新檔案叫做 pod.yaml。你可以用 VS Code、vim、nano，都可以。輸入以下內容，我一行一行帶你寫。

第一行，apiVersion 冒號空格 v1。因為 Pod 的 API 版本就是 v1，這是固定的，不用想。

第二行，kind 冒號空格 Pod。我們要建的就是一個 Pod。

第三行，metadata 冒號，後面不用寫值，因為 metadata 底下還有子欄位。

第四行，空兩格，name 冒號空格 my-nginx。這是 Pod 的名字，之後所有 kubectl 指令都會用這個名字。名字的規則是只能用小寫英文、數字和減號，不能有底線、不能有大寫。

第五行，空兩格，labels 冒號，後面也不用寫值。

第六行，空四格，app 冒號空格 nginx。這是一個標籤。標籤現在用不到，但後面學 Service 的時候，Service 就是靠這個標籤來找到這個 Pod 的。我們先寫上，養成好習慣。

第七行，spec 冒號。

第八行，空兩格，containers 冒號。

第九行，空四格，減號空格 name 冒號空格 nginx。這是容器的名字。一個 Pod 裡面可能有多個容器，所以每個容器要有自己的名字。

第十行，空六格，image 冒號空格 nginx:1.27。這就是我們要跑的 Docker Image。nginx 冒號 1.27 代表 nginx 的 1.27 版本。你也可以寫 nginx:latest 或者只寫 nginx，但在生產環境裡，我們永遠建議寫明確的版本號。因為 latest 這個 tag 可能隨時變，今天拉到的是 1.27，明天可能就變成 1.28 了。寫明確的版本號才能確保每次部署都是同一個東西。

第十一行，空六格，ports 冒號。

第十二行，空八格，減號空格 containerPort 冒號空格 80。這是在宣告這個容器監聽 80 port。我要特別說一下，containerPort 這個欄位其實更像是一個「文件記錄」。即使你不寫它，nginx 一樣會監聽 80 port，因為 nginx Image 本身就是設計成聽 80 的。但是寫上去是好習慣，讓別人看你的 YAML 就知道這個容器用了什麼 port。

大家注意一下縮排的層級。apiVersion、kind、metadata、spec 是最外層，不縮排。name、labels、containers 在 metadata 或 spec 底下，縮排兩個空格。app 在 labels 底下，縮排四個空格。image、ports 在容器底下，縮排六個空格。containerPort 在 ports 底下，縮排八個空格。每往下一層，多兩個空格。YAML 的縮排就是它的結構，縮排錯了，整個意思就變了，K8s 會報錯或者產生你意想不到的結果。

寫完之後存檔。我再提醒一次，確保你用的是空格不是 Tab。如果不確定，在 VS Code 右下角看一下，應該顯示 Spaces: 2。

現在來部署。在終端機裡面，確認你在 ~/k8s-labs 目錄下，然後輸入 kubectl apply -f pod.yaml。

這裡解釋一下 apply 這個指令。你在網路上可能會看到另一個寫法 kubectl create -f pod.yaml。兩個都可以用，但有一個重要的差別。create 是「建立」，如果資源已經存在，它會報錯說「已經存在了，不能再建」。apply 是「應用」，如果資源不存在就建立，如果已經存在就更新。所以 apply 可以重複執行，改了 YAML 之後再 apply 一次就能更新。我們統一用 apply，因為它更靈活。

執行之後，你應該會看到一行訊息：pod/my-nginx created。這代表 K8s 收到了你的請求，正在建立 Pod。

馬上來看狀態。輸入 kubectl get pods。

你應該會看到一行資訊，包含 NAME、READY、STATUS、RESTARTS、AGE 這幾個欄位。NAME 是 my-nginx，就是我們在 YAML 裡面設定的名字。READY 是 1/1，表示這個 Pod 裡面有一個容器，而且已經準備好了。STATUS 如果是 Running，恭喜你，你的第一個 Pod 跑起來了。如果你看到的是 ContainerCreating，表示 K8s 正在拉 Image，等幾秒鐘再看一次就好。RESTARTS 是 0，表示沒有重啟過。AGE 顯示這個 Pod 跑了多久。

我們加一個參數看更多資訊。輸入 kubectl get pods -o wide。

-o wide 的意思是「寬格式輸出」。你會多看到兩個欄位：IP 和 NODE。IP 是這個 Pod 在叢集內部的 IP 位址。請注意，這個 IP 只能在叢集內部使用，你從外面是連不到的。NODE 顯示 minikube，因為我們只有一個節點。等到第五堂課用 k3s 多節點的時候，這裡就會顯示不同的 Node 名稱。

接下來用 describe 看詳細資訊。輸入 kubectl describe pod my-nginx。

describe 的輸出會比較長，不要被嚇到。往上看，你會看到 Name、Namespace、Node、Labels、IP 這些基本資訊。中間會列出容器的詳細資訊，包括 Image、Port、State。

但我要你特別注意最下面的 Events 區塊。Events 是排錯的時候最重要的資訊來源。你會看到幾行事件紀錄，像是 Scheduled，表示 K8s 已經決定把這個 Pod 放在哪個 Node 上了。Pulling，表示正在拉 Image。Pulled，Image 拉完了。Created，容器建好了。Started，容器啟動了。以後你的 Pod 出問題的時候，第一件事就是來看 Events。如果卡在 Pulling 很久，可能是網路問題或 Image 名稱寫錯了。如果顯示 Failed，Events 會告訴你具體的原因。記住，describe 的 Events 區塊是你排錯的最好朋友。

再來看日誌。輸入 kubectl logs my-nginx。

因為 nginx 剛啟動，而且我們還沒有發任何請求給它，所以日誌可能很少，只有一些啟動訊息。這就像 Docker 的 docker logs 一樣。等一下我們進容器之後，日誌會多起來。

好，最精彩的部分來了。我們要進到容器裡面去。輸入 kubectl exec -it my-nginx -- /bin/sh。

這個指令我要拆開來解釋。kubectl exec 就是在容器裡面執行指令，對應 Docker 的 docker exec。-i 是 interactive，保持標準輸入開啟。-t 是分配一個終端。my-nginx 是 Pod 的名字。然後是兩個減號 --，這個非常重要。這兩個減號的作用是告訴 kubectl：「後面的東西不是 kubectl 的參數，而是要在容器裡面執行的指令。」如果你不加這兩個減號，kubectl 可能會把後面的 /bin/sh 當成自己的參數來處理，結果就會報錯。這是 K8s 跟 Docker 的一個小差異。Docker 的 exec 不需要這個雙減號，直接寫 docker exec -it 容器名 /bin/sh 就好了。K8s 多了這一步，但背後的邏輯其實是更嚴謹的。

執行之後，你會發現命令提示符變了，可能變成一個井字號或者一個根目錄的提示。這表示你已經進到容器裡面了。

我們來試幾個東西。先輸入 curl localhost。如果你看到一大段 HTML，裡面有 Welcome to nginx 的歡迎訊息，那就代表 nginx 在跑。不過有些精簡版的 Image 沒有預裝 curl，你可能會看到 command not found。別緊張，這很正常。nginx 官方 Image 是基於 Debian 的，我們可以先裝 curl。輸入 apt-get update 然後按 Enter，跑完之後再輸入 apt-get install -y curl。整個過程大概十秒鐘。裝好之後再打一次 curl localhost，你就會看到那個歡迎頁面了。學會在容器裡面安裝工具，這本身就是一個很實用的技巧。在除錯的時候你經常會需要在容器裡面裝一些工具來排查問題。

當然，如果你不想裝 curl，也可以直接用 cat /usr/share/nginx/html/index.html 來確認 nginx 的歡迎頁面內容。你會看到那段 HTML 裡面有 Welcome to nginx 的字樣，這也能證明 nginx 正在正常運作。

再試試看 ls /usr/share/nginx/html/。你會看到 50x.html 和 index.html 兩個檔案，這就是 nginx 預設的網頁目錄。

好，看完了，輸入 exit 離開容器。

最後一步，清理。我們把這個 Pod 刪掉。輸入 kubectl delete pod my-nginx。

你會看到 pod "my-nginx" deleted 的訊息。再用 kubectl get pods 確認一下，應該已經沒有任何 Pod 了，或者顯示 No resources found。

恭喜大家，你們剛剛完成了 Pod 的完整 CRUD 操作。C 是 Create，用 kubectl apply 建立。R 是 Read，用 kubectl get 和 describe 查看。U 是 Update，修改 YAML 之後再 apply 就是更新。D 是 Delete，用 kubectl delete 刪除。

我們把整個流程跟 Docker 做個對照。Docker 是 docker run -d --name my-nginx -p 8080:80 nginx:1.27，然後 docker ps，docker logs my-nginx，docker exec -it my-nginx /bin/sh，最後 docker stop my-nginx 加上 docker rm my-nginx。K8s 是 kubectl apply -f pod.yaml，然後 kubectl get pods，kubectl logs my-nginx，kubectl exec -it my-nginx -- /bin/sh，最後 kubectl delete pod my-nginx。流程完全一樣，語法稍有不同。最大的差別是 K8s 用一個 YAML 檔案來定義你要什麼，而不是把所有參數塞在一行指令裡面。

好，這就是你的第一個 Pod。接下來給大家兩個練習題，鞏固一下剛才學的東西。

## 學員實作題目

**題目一：用 httpd Image 建一個 Pod（基礎）**

- 把剛才的 pod.yaml 複製一份，改名叫 httpd-pod.yaml
- 把 name 改成 my-httpd
- 把 image 改成 httpd:2.4
- 把 containerPort 改成 80（httpd 也是用 80 port）
- 用 kubectl apply -f httpd-pod.yaml 部署
- 用 kubectl exec -it my-httpd -- /bin/sh 進容器
- httpd 官方 Image 裡面也沒有預裝 curl，所以用 `cat /usr/local/apache2/htdocs/index.html`，你應該會看到 "It works!" 的 HTML 內容
- 或者 exit 出來後，用 `kubectl port-forward pod/my-httpd 8080:80`，然後在瀏覽器打開 localhost:8080 驗證
- 做完記得 kubectl delete pod my-httpd 清理

**題目二：修改 nginx 歡迎頁面（進階挑戰）**

- 重新用 kubectl apply -f pod.yaml 建立 my-nginx Pod
- 用 kubectl exec -it my-nginx -- /bin/sh 進容器
- 執行 echo "Hello Kubernetes" > /usr/share/nginx/html/index.html
- 離開容器（exit）
- 用 kubectl port-forward my-nginx 8080:80 把 Pod 的 80 port 轉發到本機的 8080
- 打開瀏覽器，輸入 http://localhost:8080，你應該會看到 "Hello Kubernetes"
- 按 Ctrl+C 停止 port-forward
- 想一想：如果把 Pod 刪掉再重建，你改的內容還在嗎？為什麼？

---

# 影片 4-11：回頭操作 + 上午總結（回顧，~8min）

## 本集重點

- 從零快速再做一遍第一個 Pod（給沒跟上的學員看）
- 常見踩坑三兄弟：YAML 縮排、忘記雙減號、Image tag 問題
- 上午 10 支影片回顧：從 Docker 瓶頸一路到第一個 Pod
- 下午預告

## 逐字稿

好，這支影片我要做兩件事。第一，我要從頭到尾快速帶做一遍第一個 Pod，給剛才可能沒有完全跟上的同學看。第二，我要把上午所有的內容做一個完整的回顧，幫大家整理一下腦袋裡的東西。

先來快速帶做一遍。打開終端機，確認你在 ~/k8s-labs 目錄下。如果你的 pod.yaml 已經刪掉了，我們重新寫一個。你也可以直接複製螢幕上的內容。就這十二行：apiVersion v1、kind Pod、metadata 底下 name my-nginx、labels 底下 app nginx、spec 底下 containers 列表裡面 name nginx、image nginx:1.27、ports 底下 containerPort 80。存檔。然後 kubectl apply -f pod.yaml，等它變成 Running，kubectl get pods 確認一下，kubectl describe pod my-nginx 看一下 Events，kubectl logs my-nginx 看日誌，kubectl exec -it my-nginx -- /bin/sh 進容器，用 cat /usr/share/nginx/html/index.html 確認 nginx 在跑，exit 出來，最後 kubectl delete pod my-nginx 刪掉。整個流程就是這樣，建立、查看、進去玩、刪掉。

好，現在來聊幾個初學者最容易踩到的坑。

第一個坑：YAML 縮排錯誤。這是出現頻率最高的問題。你把 containers 少縮了一格，或者 image 多縮了一格，kubectl apply 的時候就會報錯，錯誤訊息通常是 error parsing pod.yaml，或者 could not find expected key。看到這類錯誤，第一反應就是去檢查縮排。每一層縮排兩個空格，嚴格對齊。另外特別提醒，千萬不要混用空格和 Tab。如果你的檔案裡面有些行是空格、有些行是 Tab，YAML 解析器會直接崩潰。在 VS Code 裡面你可以打開「顯示空白字元」的功能，這樣就能清楚看到每一行到底是空格還是 Tab。

第二個坑：kubectl exec 忘記加雙減號。你興沖沖地輸入 kubectl exec -it my-nginx /bin/sh，結果報錯了。因為 kubectl 把 /bin/sh 當成自己的參數了。記住，在 Pod 名字和容器指令之間，一定要加 -- 兩個減號。kubectl exec -it my-nginx 減號減號 /bin/sh。這個雙減號是 kubectl 的分隔符號，告訴它後面的東西是要傳給容器的。

第三個坑：Image tag 的問題。你寫 image 冒號 nginx，沒有指定版本號，K8s 會預設拉 latest。但是 latest 不是一個固定的版本，它會隨著 Image 作者的更新而變。今天你拉到的 latest 可能是 1.27，下個月可能就變成 1.28 了。這在開發環境可能沒什麼，但在生產環境可能會出大問題。所以永遠記得寫明確的版本號。另外，如果你不小心把 Image 名稱拼錯了，比如把 nginx 打成 nginxx，K8s 會一直停在 ImagePullBackOff 狀態，因為 Docker Hub 上找不到這個 Image。這時候用 kubectl describe pod 看 Events，就能看到拉取失敗的原因。

好，三個常見的坑都提醒過了。下午我們排錯實作的時候，還會故意觸發更多的錯誤，讓大家練習怎麼看錯誤訊息、怎麼修復。

最後，讓我快速回顧一下上午的內容。上午我們從 Docker 的五個瓶頸出發，認識了 K8s 的八個核心概念和 Master-Worker 架構，裝好了 minikube 環境，學了 YAML 四大必備欄位，然後寫出了人生中第一個 Pod，完整做了一遍 CRUD。從「為什麼需要 K8s」一路走到「親手跑出第一個 Pod」，這就是上午的完整脈絡。

接下來我要跟大家說一下下午的學習方式。下午跟上午不太一樣。上午是一支影片接一支影片，比較線性。下午我們會用一個叫「Loop」的結構。什麼意思呢？下午分成四個 Loop，每一個 Loop 都包含三到四個步驟。第一步是概念影片，我先講清楚原理和概念。第二步是實作示範，我在螢幕上操作給你看。第三步是你自己動手練習，螢幕上會有練習題目，給你十到十五分鐘的時間。第四步是回頭操作，我會從頭帶做一遍，讓沒跟上的同學可以對照著做。

四個 Loop 分別是：Loop 1 是 Pod 生命週期和排錯，我會帶大家故意寫錯 YAML、故意拼錯 Image 名字，練習怎麼看錯誤訊息。Loop 2 是多容器 Pod 和 Sidecar 模式，親手體驗兩個容器在同一個 Pod 裡面協同工作。Loop 3 是 kubectl 進階技巧，包括 port-forward、dry-run 這些日常工作會天天用到的東西。Loop 4 是環境變數和 MySQL Pod，學會怎麼把設定注入到容器裡。

每個 Loop 結束之後都有練習時間，做完的同學可以先往下看，沒做完的同學就在回頭操作的時候跟著我一起做。不用擔心掉隊。

好，上午的課到這裡。大家休息一下，下午見。
