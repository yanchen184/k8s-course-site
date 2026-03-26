# 第四堂上午逐字稿 v3 (Part 3) — 因果鏈敘事

> 接續 Part 2 的 4-5 ~ 4-8
> 3 支影片，涵蓋 YAML + Pod 概念 → Pod CRUD 實作 → 回顧與下午預告

---

# 影片 4-9：YAML 格式 + Pod 概念（概念，~15min）

## 本集重點

- 4-8 在 kube-system 看到 K8s 自己的 Pod → 我要跑自己的 → 怎麼告訴 K8s？→ YAML
- YAML 三大語法規則：空格縮排、冒號後空格、減號列表
- 四大必備欄位：apiVersion / kind / metadata / spec
- 對照 docker-compose.yaml，從已知推未知
- apiVersion 常見值速查表：

| 資源類型 | apiVersion |
|:---|:---|
| Pod / Service / ConfigMap / Secret | `v1` |
| Deployment / ReplicaSet / DaemonSet | `apps/v1` |
| CronJob | `batch/v1` |
| Ingress | `networking.k8s.io/v1` |

- Pod = K8s 最小部署單位 = 容器的膠囊
  - 同 Pod 容器共享 Network + Storage → Sidecar 模式
  - 最佳實踐：一個 Pod 一個容器
- Docker 指令 vs kubectl 指令對照：

| Docker 指令 | kubectl 對應 |
|:---|:---|
| `docker run nginx` | `kubectl run nginx --image=nginx` |
| `docker ps` | `kubectl get pods` |
| `docker logs <id>` | `kubectl logs <pod-name>` |
| `docker exec -it <id> bash` | `kubectl exec -it <pod-name> -- bash` |
| `docker stop / rm` | `kubectl delete pod <pod-name>` |
| `docker inspect` | `kubectl describe pod <pod-name>` |

## 逐字稿

好，前面我們在 kube-system 裡看到 K8s 自己的管理組件全都以 Pod 的身份在跑。叢集是活的，裡面已經有東西在跑了。

但是那些都是 K8s 自己的東西。我的 nginx 呢？我的應用程式呢？我怎麼把我自己的容器放進去？

你回想一下 Docker。在 Docker 的世界裡，你要跑一個 nginx，就打 docker run nginx，一行指令搞定。要開 Port 加 -p，要掛 Volume 加 -v，要設環境變數加 -e，所有東西都塞在一行指令後面的參數裡。這是「命令式」的做法，你一步一步告訴 Docker 怎麼做。

但我們在第一支影片就講過，K8s 的設計理念是「宣告式管理」。你不是告訴它「先拉 Image、再建容器、再開 Port」，你是寫一份文件，告訴它「我想要的最終狀態是什麼」。然後 K8s 自己想辦法把現實調整到你描述的狀態。還記得那個恆溫空調的比喻嗎？你只要設定 25 度，空調自己處理。

那這份描述「最終狀態」的文件，用什麼格式寫？答案是 YAML。

YAML 全名是 YAML Ain't Markup Language，一個遞迴縮寫，表示它不是標記語言。其實你已經用過 YAML 了。第三堂課寫 Docker Compose 的時候，docker-compose.yaml 就是一個 YAML 檔案。所以 YAML 的基本感覺你不陌生，你只是可能沒有仔細看它的規則。

今天我們要從「感覺認識」升級到「規則清楚」。因為在 K8s 裡面，所有的資源，Pod、Service、Deployment、ConfigMap，全部都是用 YAML 定義的。YAML 寫錯一個字元，K8s 就會報錯。所以我們要把規則搞清楚。

YAML 的語法有三個重點。

第一個，縮排用空格，絕對不能用 Tab。這是初學者最常踩的坑，待會實作的時候你就會知道有多痛。你在編輯器裡面按 Tab 鍵，看起來好像是空格，但其實它是一個 Tab 字元，YAML 解析器會直接報錯。我強烈建議大家現在就打開你的編輯器，把 Tab 設定成自動轉換為兩個空格。VS Code 的話在右下角可以直接改。vim 的話在設定檔裡加上 set expandtab、set tabstop=2、set shiftwidth=2。這個設定做一次，後面就不會再踩到了。

第二個，冒號後面要有空格。寫 name 冒號空格 my-pod，冒號跟值之間一定要有一個空格。如果你寫 name 冒號 my-pod，中間沒有空格，YAML 會把整段當成一個 key，解析就錯了。

第三個，列表用減號加空格開頭。比如你有一個容器列表，每個容器前面加一個「減號空格」，像「減號空格 name 冒號空格 nginx」這樣。減號後面也要有空格，不能省略。

三個規則，記住了就不會出錯：空格縮排、冒號後空格、列表用減號。

好，語法知道了。那 K8s 的 YAML 到底長什麼樣子？不管你要建什麼資源，每一個 K8s 的 YAML 檔案都有四個必備欄位。

第一個是 apiVersion。你可以把它理解成「你要用哪一版的語言跟 K8s 說話」。不同的資源類型有不同的 apiVersion。Pod 用 v1，Deployment 用 apps/v1，Ingress 用 networking.k8s.io/v1。你不需要背這些，寫的時候查一下就好。螢幕上有一個對照表，大家可以截圖存起來。

第二個是 kind，就是你要建什麼東西。Pod、Service、Deployment、ConfigMap，你要建什麼就寫什麼。

第三個是 metadata，中繼資料，描述這個資源的基本資訊。最重要的是 name，給你的資源取個名字，之後所有指令都靠這個名字操作。還有一個很常用的是 labels，標籤，一組 key-value 配對，比如 app 冒號 nginx。標籤現在先知道就好，等第五堂課學 Service 的時候你就會發現標籤有多重要，Service 就是靠標籤來找到它要轉發的 Pod。

第四個是 spec，specification 的縮寫，規格的意思。你想要什麼容器、用什麼 Image、開什麼 Port、掛什麼 Volume，全部寫在 spec 裡面。spec 是整個 YAML 裡面最重要、也是變化最多的部分。不同資源的 spec 內容完全不一樣。

四個欄位，你可以用四個問題來記。apiVersion 是「你要說哪種語言」，kind 是「你要建什麼」，metadata 是「它叫什麼名字」，spec 是「它長什麼樣子」。

現在來跟你已經會的 Docker Compose 做個對照。Docker Compose 裡面寫 version 冒號 3，K8s 對應的是 apiVersion。Docker Compose 的 services 區塊定義你要跑哪些服務，K8s 這邊拆成了 kind 加 spec。Docker Compose 的 image 冒號 nginx，K8s 寫在 spec 底下的 containers 列表裡面。最大的差別是什麼？Docker Compose 一個檔案可以描述一整套系統，前端、後端、資料庫都塞在裡面。K8s 的 YAML 通常一個檔案描述一個資源。你要一個 Pod 寫一個檔案，要一個 Service 再寫一個檔案。雖然可以用三個減號的分隔線把多個資源塞在同一個檔案裡，但我們先養成好習慣，一個檔案一個資源。

好，YAML 搞定了。現在來認識今天的主角，Pod。

Pod 的概念我們在第四支影片已經講過一次了。當時是從「Docker 只管單一容器」這個問題出發，引出「K8s 用 Pod 包一層」。那時候是概念的角度。現在我們已經要動手寫 YAML 了，所以從實作的角度再看一次 Pod。

Pod 是 K8s 最小的部署單位。注意，不是容器，是 Pod。在 Docker 裡面你 docker run 直接跑容器。在 K8s 裡面，K8s 不直接管容器，它管的是 Pod。你可以把 Pod 想成容器的膠囊，外面多包了一層。

一個 Pod 裡面可以放一個或多個容器。同一個 Pod 裡的容器共享兩樣東西。第一，共享網路。同一個 Pod 裡的兩個容器用同一個 IP 位址，彼此之間用 localhost 就能互相通訊。第二，共享儲存。它們可以掛載同一個 Volume，讀寫同一批檔案。

為什麼要多包一層？因為有些場景你需要把兩個緊密耦合的容器放在一起。經典的例子是 Sidecar 模式。你有一個 API 容器把日誌寫到檔案裡，旁邊放一個日誌收集容器負責把日誌傳送到集中式系統。這兩個容器需要共享目錄，放在同一個 Pod 裡最合適。Sidecar 就是「邊車」的意思，主容器是摩托車，輔助容器是掛在旁邊的邊車。

不過絕大多數情況下，最佳實踐是一個 Pod 只放一個容器。你現在就把 Pod 等於一個容器來理解就好。下午我們會實際做一個多容器 Pod，到時候你就更有感覺了。

最後看一下 Docker 和 kubectl 的指令對照。docker run nginx 對應 kubectl run nginx --image=nginx。docker ps 對應 kubectl get pods。docker logs 對應 kubectl logs。docker exec -it 對應 kubectl exec -it，但注意 kubectl 的版本要在 Pod 名字後面加兩個減號再接指令。docker stop 加 docker rm 對應 kubectl delete pod。docker inspect 對應 kubectl describe pod。

幾乎是一對一的對應，邏輯完全一樣，只是換了一套指令。如果你 Docker 用得熟，kubectl 上手會非常快。

好，概念都到位了。YAML 怎麼寫知道了，Pod 是什麼也知道了，指令對照也看過了。接下來就是今天最關鍵的一步：動手寫你的第一個 Pod YAML，把它跑起來。

---

# 影片 4-10：第一個 Pod 完整 CRUD（實作示範，~15min）

## 本集重點

- git clone + cd k8s-course-labs/lesson4
- 寫 pod.yaml（nginx:1.27）→ 逐行解釋
- kubectl apply -f（講 apply vs create 差別）
- CRUD 完整流程：
  ```
  kubectl apply -f pod.yaml          # Create
  kubectl get pods                   # Read（簡）
  kubectl get pods -o wide           # Read（寬）
  kubectl describe pod my-nginx      # Read（詳，重點看 Events）
  kubectl logs my-nginx              # Read（日誌）
  kubectl exec -it my-nginx -- /bin/sh   # 進容器（雙減號！）
  kubectl delete pod my-nginx        # Delete
  ```
- 進容器驗證 nginx：
  - nginx 官方 Image 沒有預裝 curl
  - 方法 A：`cat /usr/share/nginx/html/index.html`
  - 方法 B：`apt-get update && apt-get install -y curl` → `curl localhost`
- 完整 CRUD 對照 Docker
- 學員實作題目：httpd Pod + 修改歡迎頁 + port-forward

## 逐字稿

好，這是今天上午最重要的一個實作。前面所有影片都在「看」和「理解」，這支影片我們開始「做」。你學了 YAML 的格式，學了 Pod 的概念，現在把這兩樣東西合起來，寫出你人生中第一個 K8s YAML 檔案，然後讓它跑起來。

請大家把終端機打開，編輯器準備好，跟著我一步一步來。

第一步，把練習用的檔案拉下來。我已經把所有的 Lab 檔案放在 GitHub 上了，大家在終端機輸入 git clone。

指令：git clone https://github.com/yanchen184/k8s-course-labs.git

然後 cd 進去。

指令：cd k8s-course-labs/lesson4

裡面有今天所有會用到的 YAML 檔案，包括 pod.yaml、pod-broken.yaml、pod-sidecar.yaml 這些。你不用自己從零開始寫，先用我準備好的檔案跟著做，等熟了之後再自己寫。

在開始之前，先確認一下 minikube 還在跑。

指令：minikube status

看一下狀態。host、kubelet、apiserver 都是 Running 就沒問題。如果不是，輸入 minikube start 重新啟動。

指令：minikube start

好，環境確認了。打開你的編輯器，建一個新檔案叫 pod.yaml。VS Code、vim、nano 都可以。我一行一行帶你寫。

第一行，apiVersion 冒號空格 v1。Pod 的 API 版本就是 v1，固定的，不用想。

第二行，kind 冒號空格 Pod。我們要建的資源類型就是 Pod。

第三行，metadata 冒號，後面不用寫值，因為底下還有子欄位。

第四行，空兩格，name 冒號空格 my-nginx。這是 Pod 的名字，之後 kubectl 的所有操作都用這個名字。命名規則是只能用小寫英文、數字跟減號，不能有底線、不能有大寫。

第五行，空兩格，labels 冒號，後面也不寫值。

第六行，空四格，app 冒號空格 nginx。這是一個標籤。標籤現在不會用到，但第五堂課學 Service 的時候，Service 就是靠這個標籤找到這個 Pod 的。先寫上，養成好習慣。

第七行，spec 冒號。

第八行，空兩格，containers 冒號。

第九行，空四格，減號空格 name 冒號空格 nginx。這是容器的名字。一個 Pod 裡面可能有多個容器，每個容器要有自己的名字。

第十行，空六格，image 冒號空格 nginx:1.27。這就是我們要跑的 Docker Image。nginx 冒號 1.27 是指定 1.27 版。你也可以寫 nginx:latest 或者只寫 nginx，但在正式環境裡我們永遠建議寫明確的版本號。因為 latest 這個 tag 會隨著 Image 作者的更新而變，今天是 1.27，明天可能就 1.28 了。寫死版本號才能確保每次部署都是同一個東西。

第十一行，空六格，ports 冒號。

第十二行，空八格，減號空格 containerPort 冒號空格 80。這是宣告容器監聽 80 port。我要特別說一下，containerPort 這個欄位其實更像是一個文件記錄。即使不寫它，nginx 一樣會聽 80，因為 nginx Image 本身就設計成監聽 80 的。但寫上去是好習慣，讓看你 YAML 的人一眼就知道這個容器用了什麼 port。

大家注意縮排的層級。apiVersion、kind、metadata、spec 是最外層，不縮排。name、labels、containers 在 metadata 或 spec 底下，縮兩格。app 在 labels 底下，縮四格。image、ports 在容器底下，縮六格。containerPort 在 ports 底下，縮八格。每往下一層多兩格。YAML 的縮排就是結構，縮排錯了整個意思就變了。

寫完存檔。再提醒一次，確認你用的是空格不是 Tab。VS Code 右下角看一下，應該顯示 Spaces: 2。

好，來部署。確認你在 k8s-course-labs/lesson4 目錄下，輸入 kubectl apply -f pod.yaml。

指令：kubectl apply -f pod.yaml

這裡解釋一下 apply。你在網路上可能會看到另一個寫法 kubectl create -f pod.yaml。兩個都能用，但有一個重要差別。create 是「建立」，如果資源已經存在就報錯。apply 是「應用」，資源不存在就建立，已經存在就更新。所以 apply 可以重複執行，改了 YAML 之後再 apply 一次就能更新。我們統一用 apply，因為它更靈活。這也更符合宣告式的精神，你是在宣告「我要這個狀態」，而不是在說「幫我建一個東西」。

執行之後你會看到一行訊息：pod/my-nginx created。代表 K8s 收到了你的請求，正在建立 Pod。

馬上看狀態。輸入 kubectl get pods。

指令：kubectl get pods

你會看到一行資訊，有 NAME、READY、STATUS、RESTARTS、AGE 這幾個欄位。NAME 是 my-nginx，就是 YAML 裡設定的名字。READY 是 1/1，表示這個 Pod 裡面有一個容器而且已經準備好了。STATUS 如果是 Running，恭喜你，你的第一個 Pod 跑起來了。如果你看到 ContainerCreating，表示正在拉 Image，等幾秒再看一次就好。RESTARTS 是 0，表示沒有重啟過。AGE 是這個 Pod 跑了多久。

加一個參數看更多。輸入 kubectl get pods -o wide。

指令：kubectl get pods -o wide

-o wide 是寬格式輸出。你會多看到 IP 和 NODE 兩個欄位。IP 是這個 Pod 在叢集內部的位址。注意，這個 IP 只能在叢集內部使用，從外面連不到。NODE 顯示 minikube，因為我們只有一個節點。等第五堂課用 k3s 多節點的時候，這裡就會顯示不同的 Node 名稱。

接下來用 describe 看更詳細的資訊。輸入 kubectl describe pod my-nginx。

指令：kubectl describe pod my-nginx

describe 的輸出比較長，不要被嚇到。往上看你會看到 Name、Namespace、Node、Labels、IP 這些基本資訊。中間是容器的詳細資訊，包括 Image、Port、State。

但我要你特別注意最下面的 Events 區塊。Events 是排錯的時候最重要的資訊來源。你會看到幾行事件紀錄。Scheduled 表示 K8s 決定把這個 Pod 放在哪個 Node 了。Pulling 表示正在拉 Image。Pulled 表示 Image 拉完了。Created 表示容器建好了。Started 表示容器啟動了。你有沒有覺得這個流程很眼熟？這就是我們在架構那兩支影片講的完整流程。Scheduler 分配 Node、kubelet 叫 containerd 拉 Image 建容器啟動，全部被記在 Events 裡了。以後你的 Pod 出問題，第一件事就是來看 Events。如果卡在 Pulling 很久，可能是網路有問題或 Image 名稱寫錯了。如果顯示 Failed，Events 會告訴你具體原因。記住，describe 的 Events 區塊是你排錯的最好朋友。

再來看日誌。輸入 kubectl logs my-nginx。

指令：kubectl logs my-nginx

因為 nginx 剛啟動而且我們還沒發任何請求給它，所以日誌可能很少，只有啟動訊息。這跟 Docker 的 docker logs 完全一樣。

好，現在最精彩的部分。我們要進到容器裡面去。輸入 kubectl exec -it my-nginx -- /bin/sh。

指令：kubectl exec -it my-nginx -- /bin/sh

這個指令我拆開來說。kubectl exec 就是在容器裡面執行指令，對應 Docker 的 docker exec。-i 是 interactive，保持標準輸入開啟。-t 是分配一個終端。my-nginx 是 Pod 名字。然後是兩個減號 --。這兩個減號非常重要，我要特別講一下。

為什麼需要兩個減號？因為 kubectl 需要一個分隔符號來區分「給 kubectl 的參數」和「要在容器裡執行的指令」。沒有這個分隔符號的話，kubectl 可能會把 /bin/sh 當成自己的參數來處理。Docker 的 exec 不需要這個雙減號，是因為 Docker 的參數解析方式不同。K8s 多了這一步，但背後的設計其實更嚴謹。這是初學者很容易忘記的一個點，待會常見踩坑我還會再提醒一次。

執行之後你會發現命令提示符變了，可能變成井字號或者一個根目錄的提示。這表示你已經進到容器裡面了。

我們來驗證 nginx 是不是真的在跑。直覺上你可能會想打 curl localhost 來看看。但這裡有一個要注意的地方：nginx 官方的 Docker Image 是基於 Debian 精簡版的，它沒有預裝 curl。你打 curl 會看到 command not found。

不用緊張，有兩個辦法。

第一個辦法比較快，直接用 cat。輸入 cat /usr/share/nginx/html/index.html。

指令：cat /usr/share/nginx/html/index.html

/usr/share/nginx/html 是 nginx 預設的網頁根目錄。你會看到一段 HTML，裡面有 Welcome to nginx 的字樣。看到這個就代表 nginx 的檔案確實在那裡，而且 nginx 服務是正常的。

第二個辦法是裝 curl。輸入 apt-get update，跑完之後再輸入 apt-get install -y curl。

指令：apt-get update && apt-get install -y curl

大概十秒鐘就裝好了。然後打 curl localhost。

指令：curl localhost

你就會看到那段完整的歡迎頁面 HTML。在容器裡面安裝額外工具，這本身就是一個很實用的技巧。日常排錯的時候你經常需要在容器裡面裝一些工具來排查問題。不過要記住，這些修改只存在於當前這個容器裡面。Pod 刪掉重建之後，安裝的工具就不見了，因為容器是無狀態的。

好，驗證完了。輸入 exit 離開容器。

指令：exit

進容器看檔案是一種驗證方式，但其實還有一個更直觀的方法。我們可以用 port-forward 建一條臨時通道，讓你的瀏覽器直接連到 Pod。輸入 kubectl port-forward pod/my-nginx 8080:80。

指令：kubectl port-forward pod/my-nginx 8080:80

然後打開你的瀏覽器，輸入 localhost:8080，你就會看到 nginx 的歡迎頁面了。port-forward 的細節我們下午會專門用一支影片來講。現在先感受一下就好。看完了按 Ctrl+C 停掉 port-forward。

最後一步，清理。輸入 kubectl delete pod my-nginx。

指令：kubectl delete pod my-nginx

你會看到 pod "my-nginx" deleted 的訊息。再用 kubectl get pods 確認，應該已經沒有 Pod 了，或者顯示 No resources found。

恭喜大家，你們剛剛完成了 Pod 的完整 CRUD。C 是 Create，用 kubectl apply 建立。R 是 Read，用 get、describe、logs 查看。U 是 Update，改了 YAML 之後再 apply 就是更新。D 是 Delete，用 kubectl delete 刪除。

把整個流程跟 Docker 對照一下。Docker 是 docker run -d --name my-nginx -p 8080:80 nginx:1.27，然後 docker ps、docker logs、docker exec -it my-nginx /bin/sh，最後 docker stop 加 docker rm。K8s 是 kubectl apply -f pod.yaml，然後 kubectl get pods、kubectl logs、kubectl exec -it my-nginx -- /bin/sh，最後 kubectl delete pod。流程一模一樣，語法稍有不同。最大的差別是 K8s 用一個 YAML 檔案來描述你要什麼，而不是把所有參數塞在一行指令裡面。

好，第一個 Pod 跑完了。現在給大家兩個練習題，鞏固一下剛才學到的東西。

## 學員實作題目

**題目一：用 httpd Image 建一個 Pod（基礎）**

複製 pod.yaml，改名為 pod-httpd.yaml。name 改成 my-httpd，image 改成 httpd:2.4。

指令：cp pod.yaml pod-httpd.yaml
指令：（編輯 pod-httpd.yaml，把 name 改成 my-httpd，image 改成 httpd:2.4）

部署它。

指令：kubectl apply -f pod-httpd.yaml

進容器驗證。httpd 官方 Image 也沒有 curl，用 cat 看預設頁面。

指令：kubectl exec -it my-httpd -- cat /usr/local/apache2/htdocs/index.html

你應該會看到 "It works!"。也可以用 port-forward 在瀏覽器看。

指令：kubectl port-forward pod/my-httpd 8080:80

瀏覽器開 http://localhost:8080，看到 "It works!"。Ctrl+C 停掉。做完記得清理。

指令：kubectl delete pod my-httpd

**題目二：修改 nginx 歡迎頁面（進階挑戰）**

重新部署 nginx Pod。

指令：kubectl apply -f pod.yaml

進容器，把歡迎頁面改成自己的文字。

指令：kubectl exec -it my-nginx -- /bin/sh
指令：echo "Hello Kubernetes" > /usr/share/nginx/html/index.html
指令：exit

用 port-forward 在瀏覽器確認。

指令：kubectl port-forward pod/my-nginx 8080:80

瀏覽器開 http://localhost:8080，看到 "Hello Kubernetes"。
Ctrl+C 停止 port-forward。
- 思考：刪掉 Pod 再重建，你改的內容還在嗎？為什麼？

---

# 影片 4-11：回頭操作 + 上午總結（回顧，~8min）

## 本集重點

- 從零快速再做一遍 Pod CRUD（給沒跟上的學員看）
- 常見踩坑三兄弟：
  1. YAML 縮排（混用空格 Tab / 層級錯誤 → 開啟「顯示空白字元」）
  2. kubectl exec 忘記雙減號（-- 分隔 kubectl 參數和容器指令）
  3. Image tag（不寫版本 = latest 會漂移 / 拼錯名字 → ImagePullBackOff）
- 上午因果鏈回顧（Docker 瓶頸 → 八概念 → 架構 → 裝環境 → 探索 → YAML → Pod CRUD）
- 下午五個 Loop 結構說明 + 預告

## 逐字稿

好，這支影片做兩件事。第一，我從頭到尾快速帶做一遍第一個 Pod，給剛才沒完全跟上的同學一個對照的機會。第二，把上午所有內容做一個完整回顧，然後告訴大家下午的學習方式。

先來快速帶做。打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。如果 pod.yaml 被改壞了，可以用 git checkout pod.yaml 還原。你也可以直接對照螢幕上的內容。就這十二行，我念一遍。apiVersion v1、kind Pod、metadata 底下 name my-nginx、labels 底下 app nginx、spec 底下 containers 列表裡面 name nginx、image nginx:1.27、ports 底下 containerPort 80。注意每一層縮排兩個空格，嚴格對齊。存檔。

然後一路跑下去。

指令：kubectl apply -f pod.yaml

建立。等它變 Running。

指令：kubectl get pods
指令：kubectl get pods -o wide

看 IP 和 Node。

指令：kubectl describe pod my-nginx

往下看 Events 區塊，確認有 Scheduled、Pulling、Pulled、Created、Started 五個事件。

指令：kubectl logs my-nginx

看日誌。然後進容器，記住 Pod 名字後面要加兩個減號。

指令：kubectl exec -it my-nginx -- /bin/sh

進去之後確認 nginx 的歡迎頁面。

指令：cat /usr/share/nginx/html/index.html

exit 出來。

指令：exit

最後刪掉。

指令：kubectl delete pod my-nginx

整個流程就是這樣：建立、查看、進去玩、刪掉。

好，再來聊三個初學者最容易踩到的坑。這三個坑我合稱「踩坑三兄弟」，幾乎每個剛學 K8s 的人都會遇到。

第一個，YAML 縮排錯誤。出現頻率最高。你把 containers 少縮了一格，或者 image 多縮了一格，kubectl apply 就會報錯。錯誤訊息通常是 error parsing pod.yaml 或者 could not find expected key。看到這種錯誤，第一反應就是去檢查縮排。每一層兩個空格，嚴格對齊。特別提醒不要混用空格和 Tab，混了之後 YAML 解析器會直接崩潰。VS Code 裡面可以打開「顯示空白字元」的功能，這樣每一行是空格還是 Tab 一眼就看得出來。

第二個，kubectl exec 忘記加雙減號。你輸入 kubectl exec -it my-nginx /bin/sh，結果報錯。因為沒有那兩個減號，kubectl 把 /bin/sh 當成自己的參數了。記住，Pod 名字和容器指令之間一定要加 -- 兩個減號。這是 kubectl 的分隔符號，告訴它「後面的東西不是給你的，是要傳進容器裡的」。

第三個，Image tag 的問題。你寫 image 冒號 nginx 沒有指定版本，K8s 會拉 latest。但 latest 不是一個固定的版本，它會隨著 Image 作者的更新而變。所以永遠寫明確的版本號。另外如果你把 Image 名字拼錯了，比如 nginx 打成 nginxx，K8s 會一直停在 ImagePullBackOff 的狀態，因為 Docker Hub 上找不到這個 Image。這時候用 describe pod 看 Events 就能看到拉取失敗的原因。下午的排錯實作我們會故意觸發這個錯誤，讓大家練習怎麼看、怎麼修。

好，三個坑都提醒了。現在來做上午的完整回顧。

上午我們走了一條完整的因果鏈。Docker 一台機器跑得好好的，但機器多了容器多了就撞上五個瓶頸，逼出了 K8s。K8s 要管容器就有了 Pod，Pod 的 IP 會變就有了 Service，一路推出八個核心概念。八個概念知道了但誰在背後運作，就去看了架構，Worker Node 三組件幹活、Master Node 四組件指揮。架構理解了就裝 minikube 環境，裝好了就用 kubectl 探索叢集、在 kube-system 親眼看到每個組件都以 Pod 的形式在跑。看完了就問「我怎麼跑自己的東西」，學了 YAML 格式和 Pod 概念，然後寫出第一個 YAML、跑出第一個 Pod、做完了完整的 CRUD。每一步都是因為上一步沒解決的問題而來的。

現在來講下午的安排。下午跟上午不太一樣。上午是一支影片接一支影片，比較線性地從概念走到實作。下午我們用一個叫 Loop 的結構。每一個 Loop 包含三到四個步驟。第一步是概念影片，我先講清楚原理。第二步是實作示範，我在螢幕上操作給你看。第三步是你自己動手，螢幕上會有練習題目，給你十到十五分鐘的時間做。第四步是回頭操作，我從頭帶做一遍，讓沒跟上的同學可以對照。

下午五個 Loop 分別是。Loop 1 是 Pod 生命週期和排錯，我會帶大家故意寫錯 YAML、故意拼錯 Image 名字，練習看錯誤訊息怎麼查、怎麼修。Loop 2 是多容器 Pod 和 Sidecar 模式，親手體驗兩個容器在同一個 Pod 裡面共享網路、共享 Volume。Loop 3 是 kubectl 進階技巧，包括 port-forward、dry-run 這些日常工作天天用到的東西。Loop 4 是環境變數和 MySQL Pod，學會怎麼把設定注入到容器裡面，為第六堂課的 ConfigMap 和 Secret 做鋪墊。Loop 5 會把今天一路累積的問題收束到 Deployment，讓你先看到三層關係和刪 Pod 自動補回的自我修復。

好，上午到這裡。
