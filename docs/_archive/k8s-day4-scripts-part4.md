# 第四堂下午逐字稿 Part 4 — 影片 4-18 ~ 4-23

> 狀態說明：這份檔案保留的是「4-23 仍是總結頁」的舊版編排。
> 目前第四天下午 4-23 之後的正式內容，請以 [docs/k8s-day4-afternoon-v3-part3.md](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/docs/k8s-day4-afternoon-v3-part3.md) 與 [src/slides/lesson4-afternoon/index.tsx](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/src/slides/lesson4-afternoon/index.tsx) 為準。
> 承接 Loop 2（多容器 Pod / Sidecar 實作與回頭操作）
> 主線：kubectl 進階技巧 → port-forward → dry-run → 環境變數 → MySQL Pod → 第四堂總結

---

# 影片 4-18：kubectl 進階技巧（概念，~15min）

## 本集重點

- 輸出格式：-o wide / -o yaml / -o json / -o name
- --watch 持續監控
- port-forward：Pod 跑起來了但瀏覽器打不開 → 建臨時通道
- port-forward 對照 docker run -p（永久 vs 臨時）
- SSH 環境要加 --address 0.0.0.0
- dry-run：YAML 記不住 → dry-run=client -o yaml 產生模板
- kubectl explain：內建文件查詢
- 效率技巧：自動補全、別名
- 資源簡寫：po / svc / deploy / cm

## 對照表

| Docker 做法 | kubectl 對應 |
|:---|:---|
| `docker run -p 8080:80` | `kubectl port-forward pod/xxx 8080:80` |
| 永久的 port 映射 | 臨時的（關掉終端就斷了） |
| `docker inspect` 看完整設定 | `kubectl get pods -o yaml` |
| 查 Dockerfile 看用法 | `kubectl explain pod.spec.containers` |

## 逐字稿

好，前面兩個 Loop 我們學了 Pod 的 CRUD、排錯三兄弟、還有 Sidecar 多容器 Pod。大家現在對 Pod 應該已經不陌生了。但是我發現一個問題：我們一直在用 kubectl get pods 看 Pod 的狀態，每次看到的就是那幾個欄位 — NAME、READY、STATUS、RESTARTS、AGE。資訊太少了。比如說我想知道 Pod 的 IP 是什麼？Pod 跑在哪個 Node 上？Pod 的完整配置長什麼樣子？這些光靠 kubectl get pods 是看不到的。

所以這支影片我要教大家 kubectl 的進階用法。這些技巧你在日常工作中會天天用到，學會之後效率會提升非常多。

首先是輸出格式。kubectl get 這個指令可以加一個 -o 參數，o 是 output 的意思，指定輸出格式。預設不加的話就是表格格式，也就是你一直看到的那個樣子。

第一個是 -o wide。加了 wide 之後，表格會多顯示幾個欄位，最重要的是 IP 和 NODE。IP 是這個 Pod 在叢集內部的 IP 位址，NODE 是這個 Pod 跑在哪個節點上。我們現在只有一個 minikube 節點，所以 NODE 都會顯示 minikube。但是等到第五堂課我們用 k3s 多節點叢集的時候，你就會看到不同的 Pod 跑在不同的 Node 上，那時候 -o wide 就非常有用了。

第二個是 -o yaml。這個會把 Pod 的完整配置用 YAML 格式輸出來。什麼叫完整配置？就是 K8s 實際儲存的那份 YAML，不只包含你自己寫的那些欄位，還包含一大堆 K8s 自動幫你填充的預設值。比如你的 YAML 裡面沒有寫 restartPolicy，但 K8s 預設會填 Always，表示容器掛了就自動重啟。你也沒有寫 dnsPolicy，K8s 預設會填 ClusterFirst。還有 status 區塊，裡面有 Pod 的 IP、啟動時間、每個容器的詳細狀態。這些資訊在排錯的時候非常有價值。對照 Docker 的話，-o yaml 有點像 docker inspect，讓你看到完整的內部資訊。

第三個是 -o json，跟 -o yaml 輸出的內容完全一樣，只是格式不同。如果你要用程式去處理這些輸出，或者要用 jq 做一些過濾和提取，JSON 格式會比 YAML 更方便。

第四個是 -o name，只輸出資源的名字。比如 kubectl get pods -o name，輸出的就是 pod/my-nginx 這種格式。這在寫腳本的時候很好用，可以搭配其他指令做批次操作。

好，輸出格式講完了。接下來講 --watch。

你在之前的排錯實作裡已經用過 kubectl get pods --watch 了，可以縮寫成 -w。它的作用是讓 kubectl 持續監控資源的變化，有任何狀態改變就即時顯示出來。比如你 apply 了一個新的 Pod 之後，開另一個終端跑 kubectl get pods -w，你就可以即時看到 Pod 從 Pending 變成 ContainerCreating，再變成 Running 的完整過程。在排錯和觀察部署過程的時候特別好用。用完了按 Ctrl+C 停止就好。

好，接下來要講一個非常重要的東西 — port-forward。

你有沒有遇到一個情況：Pod 跑起來了，STATUS 也是 Running，但是你在瀏覽器裡打 Pod 的 IP，怎麼都連不上？這是為什麼？

原因是 Pod 的 IP 是叢集內部的 IP，只能在叢集裡面的其他 Pod 之間互相存取。你的筆電不在叢集裡面，所以你的瀏覽器連不到 Pod 的 IP。就像你知道公司內部某台伺服器的內網 IP，但你在家裡用自己的電腦是連不到的，因為你不在公司的內網裡。

在 Docker 的時候，我們用 docker run -p 8080:80 來做 port 映射，把容器的 80 port 映射到本機的 8080 port。然後在瀏覽器裡打 localhost:8080 就能看到了。K8s 裡面也有類似的東西，但方式不太一樣。

K8s 的 port-forward 是這樣用的：kubectl port-forward pod/my-nginx 8080:80。這行指令的意思是：在你的本機和 Pod 之間建一條臨時的通道，把本機的 8080 port 轉發到 Pod 的 80 port。執行之後，你在瀏覽器裡打 localhost:8080 就能看到 nginx 的頁面了。

但這裡有一個非常重要的差異，跟 Docker 比的話。Docker 的 -p 是永久的，只要容器在跑，port 映射就在。但 port-forward 是臨時的。你把終端關掉、按 Ctrl+C、或者 SSH 斷線了，通道就斷了。所以 port-forward 不是正式對外提供服務的方式，它只適合開發和除錯的時候臨時用一下。正式對外服務要用 Service，那是下堂課的內容。

另外提醒一個在 SSH 環境會遇到的坑。如果你是用 SSH 連到一台 VM 上面操作 K8s 的，port-forward 預設綁定的是 127.0.0.1，也就是 VM 的 localhost。這意味著你只能在 VM 本機上用 curl localhost:8080 存取，你的筆電瀏覽器是連不到的。解決方法是加上 --address 0.0.0.0，讓它監聽所有網路介面。完整指令是 kubectl port-forward pod/my-nginx 8080:80 --address 0.0.0.0。然後在你的筆電瀏覽器裡打 VM 的 IP 加上 8080 port 就能看到了。

好，port-forward 講完了。接下來講另一個超級實用的技巧 — dry-run。

你有沒有覺得，每次要寫 YAML 的時候，那些欄位記不住？apiVersion 是什麼、kind 是什麼、spec 底下的 containers 要怎麼縮排？尤其是剛開始學的時候，每次都要翻文件或者去找之前寫過的範例。有沒有什麼辦法可以快速產生一個 YAML 模板？

有的，就是用 dry-run。指令是 kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml。dry-run 的意思是「乾跑」，也就是模擬執行，不會真的建立任何資源。加上 -o yaml 就會把它「本來會建立的東西」用 YAML 格式印出來。所以你得到的就是一個完整的 Pod YAML 模板，拿去修改就能直接用了。

你還可以把輸出重新導向到檔案裡：kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml 大於號 test-pod.yaml。這樣就直接存成檔案了，打開來改一改就是你要的 YAML。在實際工作中，很多資深工程師也是這樣做的，沒有人真的從零開始手寫 YAML。

再來是 kubectl explain，這是 K8s 的內建文件查詢工具。比如你想知道 Pod 的 spec 底下的 containers 有哪些欄位可以設定，你就打 kubectl explain pod.spec.containers。它會列出所有可以設定的欄位和說明。你可以一層一層往下鑽，比如 kubectl explain pod.spec.containers.ports 可以看到 containerPort、hostPort、protocol 這些欄位的說明。這比去翻官方文件快多了。

最後教大家兩個效率小技巧。第一個是自動補全。你輸入 source 小於號括號 kubectl completion bash 括號，就可以啟用 kubectl 的 Tab 補全功能。啟用之後，你打 kubectl get po 然後按 Tab 鍵，它會自動補全成 pods。你打 kubectl logs my 然後按 Tab，它會自動補全成你的 Pod 名字。這個非常節省時間。建議你把這行加到 ~/.bashrc 裡面，這樣每次開新終端都會自動啟用。如果你用的是 zsh，就把 bash 換成 zsh，加到 ~/.zshrc 裡面。macOS 預設是 zsh，Linux 預設是 bash。不確定的話，在終端機裡面輸入 echo $SHELL 看一下就知道了。

第二個是設定別名。kubectl 這個單字很長，每天打幾百次很累。你可以設定 alias k=kubectl，之後打 k get pods 就等於 kubectl get pods。一樣建議加到 ~/.bashrc 或 ~/.zshrc 裡面。

最後再補充一個，K8s 的資源類型都有簡寫。pods 可以簡寫成 po，services 簡寫成 svc，deployments 簡寫成 deploy，configmaps 簡寫成 cm，namespaces 簡寫成 ns。所以你可以打 k get po 來看 Pod 列表、k get svc 看 Service 列表。搭配別名和自動補全一起用，效率直接翻倍。

好，這些就是 kubectl 最常用的進階技巧。接下來我們馬上動手操作一遍。

---

# 影片 4-19：port-forward + dry-run 實作（實作示範，~15min）

## 本集重點

- 建一個 nginx Pod 回來
- port-forward pod/my-nginx 8080:80 → curl localhost:8080
- 各種輸出格式：-o wide / -o yaml（head -30）/ -o json
- dry-run 產生 YAML → 存檔 → cat 看內容
- kubectl explain pod.spec.containers
- kubectl get pods -A → 看所有 namespace
- 設定自動補全和別名
- 清理

## 逐字稿

好，上一支影片我們講了 kubectl 的各種進階用法，現在我們全部來操作一遍。大家把終端機打開，跟著我一步一步來。

首先，我們需要一個 Pod 來實驗。大家先進到工作目錄，cd k8s-course-labs/lesson4，然後用之前寫的 pod.yaml 建一個 nginx Pod 回來。輸入 kubectl apply -f pod.yaml，然後 kubectl get pods 確認一下 STATUS 是 Running。如果你之前把 pod.yaml 刪掉了也沒關係，我們等一下會用 dry-run 再產生一個。先用 kubectl run my-nginx --image=nginx:1.27 快速建一個也行。

好，確認 Pod 在跑了。

第一個操作，我們來試 port-forward。輸入 kubectl port-forward pod/my-nginx 8080:80。

你會看到終端顯示 Forwarding from 127.0.0.1:8080 然後箭頭 80，表示轉發通道已經建立了。注意，這個終端現在被 port-forward 佔住了，你不能再打其他指令。所以你需要開另一個終端視窗。

在新的終端視窗裡面，輸入 curl localhost:8080。你應該會看到一大段 HTML，就是 nginx 的歡迎頁面，裡面有 Welcome to nginx 的字樣。如果你用的是圖形化環境，也可以打開瀏覽器，在網址列輸入 localhost:8080，會看到那個經典的 Welcome to nginx 頁面。

回到跑 port-forward 的那個終端，你會發現每收到一個請求，它就會印出一行日誌，類似 Handling connection for 8080。按 Ctrl+C 把它停掉。

停掉之後再試一次 curl localhost:8080，你會發現連不上了，curl 會報 Connection refused。這就是我們剛才講的，port-forward 是臨時的，你一關掉它，通道就斷了。

好，port-forward 體驗完了。接下來我們來試各種輸出格式。

先看 -o wide。輸入 kubectl get pods -o wide。你會看到表格多了幾個欄位：IP 是 Pod 的叢集內部 IP，NODE 是 minikube，NOMINATED NODE 和 READINESS GATES 通常是空的，現在不用管它們。

再來看 -o yaml。輸入 kubectl get pods -o yaml。哇，這次輸出很長對不對。你可以看到一大堆你沒有寫過的東西。往上滾一下，你會看到 metadata 裡面有 creationTimestamp，是 K8s 記錄的建立時間。有 uid，是 K8s 自動產生的唯一識別碼。有 resourceVersion，是這個資源被修改的版本號。往下看 spec 區塊，你會看到有些你沒寫的預設值，像 restartPolicy 冒號 Always、dnsPolicy 冒號 ClusterFirst、terminationGracePeriodSeconds 冒號 30。再往下是 status 區塊，裡面有 Pod 的 IP、啟動時間、每個容器的詳細狀態。

輸出太長了對不對？如果你只想看前面幾行，可以用 pipe 串 head。輸入 kubectl get pods -o yaml 然後 pipe head -30。這樣就只顯示前 30 行了，比較好閱讀。

-o json 就不特別示範了，內容跟 -o yaml 一樣，只是格式變成 JSON。你有需要的時候再用就好。

好，接下來來試今天的重頭戲 — dry-run。

輸入 kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml。

看到了嗎？它幫你產生了一個完整的 Pod YAML。上面有 apiVersion: v1、kind: Pod、metadata 裡面有 name: test-pod 和一些 labels。spec 裡面有 containers，image 是 nginx:1.27。而且最關鍵的是，它沒有真的建立 Pod。你可以用 kubectl get pods 確認一下，你的 Pod 列表裡面不會有 test-pod 這個東西。

現在我們把它存成檔案。輸入 kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml 大於號 test-pod.yaml。然後 cat test-pod.yaml 看一下內容。你會發現跟剛才螢幕上印的一模一樣，只是現在存成檔案了。

你可以打開這個檔案，把 name 改成你要的名字，把 image 改成你要的 image，把不需要的欄位刪掉，然後 kubectl apply -f 就可以直接用了。以後寫 YAML 不用從零開始，用 dry-run 產生模板再改就好。

接下來試試 kubectl explain。輸入 kubectl explain pod.spec.containers。

你會看到一堆欄位的說明。最上面會顯示這個欄位的類型和描述。然後列出所有子欄位，每個欄位後面都有簡短的說明。比如 image 是 string 類型，說明是「Docker image name」。env 是一個列表，說明是「List of environment variables to set in the container」。ports 也是一個列表，resources 可以設定 CPU 和記憶體的限制。

如果你想更深入地看某個欄位，比如 resources，就輸入 kubectl explain pod.spec.containers.resources。它會告訴你 resources 底下有 limits 和 requests 兩個子欄位，limits 是設定容器可以使用的最大資源量，requests 是設定容器啟動時需要保證的最小資源量。這些我們第七堂課會詳細講，現在先知道怎麼查就好。

再來看一下全叢集的 Pod。輸入 kubectl get pods -A。-A 是 --all-namespaces 的縮寫。你會看到除了你的 default namespace 裡面的 my-nginx 之外，還有一堆在 kube-system 裡面的 Pod。那些就是 K8s 的系統組件：etcd、kube-apiserver、kube-scheduler、kube-controller-manager、kube-proxy、coredns。我們上午概念篇看過它們了，它們一直安靜地在背後工作。

最後來設定自動補全和別名。輸入 source 小於號括號 kubectl completion bash 括號。好，現在你試試看，打 kubectl get po 然後按 Tab 鍵。有沒有自動補全成 pods？再打 kubectl logs m 然後按 Tab，有沒有自動補全成 my-nginx？很方便對不對。

然後輸入 alias k=kubectl。現在你可以用 k get pods 了，跟 kubectl get pods 完全一樣。

如果你想讓這些設定永久生效，就把這兩行加到你的 shell 設定檔裡面。如果你用 bash，就加到 ~/.bashrc。如果你用 zsh，就把 completion bash 換成 completion zsh，然後加到 ~/.zshrc。macOS 的同學注意，macOS 預設是 zsh，所以你要用 kubectl completion zsh，加到 ~/.zshrc 裡面。Linux 的同學大多數是 bash，就用 kubectl completion bash 加到 ~/.bashrc。這樣每次開新終端就會自動載入了。

好，最後清理一下。如果你有用 dry-run 產生的 test-pod.yaml，那個檔案留著沒關係，它沒有部署到叢集裡。如果你有跑起來的 Pod，我們先不刪，因為等一下的回頭操作還會用到。

好，kubectl 的進階用法我們都實際操作過了。接下來的回頭操作時間，我會帶大家再做一遍 port-forward，然後講幾個常見的坑。

---

# 影片 4-20：回頭操作 Loop 3（回頭操作，~6min）

## 本集重點

- 帶做 port-forward（如果前面沒跟上就在這補做）
- 常見坑：關掉終端就斷、SSH 環境 localhost 指的是 VM
- 強調 dry-run 的實用性
- 銜接最後一個 Loop

## 學員實作題目 Loop 3

1. 用 dry-run 產生一個 httpd Pod 的 YAML → 存成 my-httpd.yaml → apply → port-forward 到 9090 → curl localhost:9090 看到 "It works!"
2. 用 -o yaml 查看你的 Pod 完整配置，找出 K8s 自動幫你加了哪些你沒寫的欄位（提示：看 status 區塊、metadata 裡的 uid 和 creationTimestamp）
3. 用 kubectl explain pod.spec.containers.resources 查看 resources 欄位的說明，了解一下 limits 和 requests 是什麼（預習下堂課）

## 逐字稿

好，回頭操作時間。大家跟著螢幕上的步驟走。

首先確認你有一個 Running 的 Pod。沒有的話用 kubectl run my-nginx --image=nginx:1.27 快速建一個。然後 kubectl port-forward pod/my-nginx 8080:80，開另一個終端 curl localhost:8080，看到 nginx 頁面就成功了。按 Ctrl+C 停止。

提醒兩個坑。第一，port-forward 關掉終端就斷了，它是臨時的除錯工具，不是正式的服務入口，正式的做法要用 Service。第二，SSH 環境要加 --address 0.0.0.0 讓外部連入，不然只能在 VM 本機存取。

再來強調 dry-run。你現在可能覺得 YAML 還不難寫，但等你後面學到 Deployment、Service、Ingress 的時候，YAML 會越來越長。用 dry-run 先產生骨架再改，比從零手寫快很多。你也可以拿 dry-run 產生的模板跟你自己手寫的做對比，看看結構有沒有差異。

螢幕上有三個練習題目，大家按自己的進度做。做完的同學，給你們一個探索建議。試試用 kubectl get pod my-nginx -o jsonpath='{.status.podIP}' 這個指令，它可以直接提取 Pod 的 IP 位址。jsonpath 是一個很強大的過濾語法，可以從 -o json 的輸出裡面精準提取你要的欄位。你也可以試試 kubectl get pod my-nginx -o jsonpath='{.spec.containers[0].image}'，提取 Image 名稱。這在寫自動化腳本的時候非常好用。

做完的同學我們就繼續往下。接下來是今天最後一個 Loop，我們要解決一個你在 Docker 學過但還沒在 K8s 用過的問題 — 環境變數。

---

# 影片 4-21：環境變數注入 + MySQL Pod（概念+實作，~15min）

## 本集重點

- 問題驅動：直接跑 MySQL Pod → CrashLoopBackOff → 為什麼？
- 回想 Docker：docker run -e MYSQL_ROOT_PASSWORD=my-secret mysql:8.0
- K8s 的 env 欄位：spec.containers[].env
- YAML 寫法示範
- apply → Running → exec 進去驗證
- 密碼寫在 YAML 裡安全嗎？→ 鋪路 Secret
- 對照 Docker -e 和 docker-compose environment

## 對照表

| Docker 做法 | K8s YAML 對應 |
|:---|:---|
| `docker run -e MYSQL_ROOT_PASSWORD=secret mysql:8.0` | `env:` 欄位在 `spec.containers[]` 底下 |
| docker-compose.yaml 的 `environment:` | 同上，寫法類似 |
| `.env` 檔案管密碼 | Secret（下堂課） |

## 逐字稿

好，進入今天最後一個 Loop。前面我們跑了 nginx、跑了 httpd、跑了 busybox，這些都是不需要特別設定就能跑起來的 Image。但是在真實世界裡，很多服務啟動的時候需要一些設定才能正常運作。最典型的例子就是資料庫。

我先丟一個問題給大家想。假設你想在 K8s 裡面跑一個 MySQL 的 Pod，而且我故意先做一份會失敗的版本。你會怎麼寫 YAML？根據前面學的知識，你可能會寫 apiVersion v1、kind Pod、metadata name mysql-broken、spec containers 裡面放一個 image 是 mysql:8.0 的容器。看起來很合理對不對？但是如果你真的 apply 它，你會得到一個 CrashLoopBackOff。為什麼？因為 MySQL 需要知道 root 密碼才能初始化資料庫。你什麼都沒告訴它，它不知道怎麼辦，就直接退出了。

那怎麼解決？回想一下 Docker。在 Docker 的時候，你要跑 MySQL 是怎麼做的？docker run -e MYSQL_ROOT_PASSWORD=my-secret mysql:8.0。關鍵就是 -e 參數，-e 就是設定環境變數。你透過環境變數 MYSQL_ROOT_PASSWORD 告訴 MySQL 容器「root 的密碼是 my-secret」，這樣 MySQL 啟動的時候就知道要用這個密碼來初始化。

K8s 裡面也有對應的做法，就是在 YAML 裡面加 env 欄位。env 寫在 spec 底下的 containers 裡面，跟 image 同一層。格式是這樣的：env 冒號，底下是一個列表，每個環境變數有 name 和 value 兩個欄位。name 是環境變數的名字，value 是值。

讓我把 env 的 YAML 語法寫給大家看。在容器定義裡面，image 冒號 mysql:8.0 底下，同一層，加上 env 冒號。env 底下是一個列表項目，減號空格 name 冒號空格 MYSQL_ROOT_PASSWORD，下一行同一層，value 冒號空格 my-secret。就這樣，多了三到四行。

如果你要設定多個環境變數，就在 env 底下多加幾個列表項目就好。比如 MySQL 還支援一個叫 MYSQL_DATABASE 的環境變數，你設定了它之後 MySQL 啟動的時候就會自動幫你建一個同名的資料庫。不需要自己進去 CREATE DATABASE。

跟 Docker Compose 做個對照。Docker Compose 裡面寫 environment 冒號，底下列出 MYSQL_ROOT_PASSWORD 冒號 my-secret。K8s 的 env 欄位概念完全一樣，只是語法稍有不同。Docker Compose 用 key 冒號 value 的簡潔寫法，K8s 用 name 冒號 key、value 冒號 value 的結構化寫法。K8s 的寫法看起來比較囉唆，但好處是格式更統一，而且 K8s 的 env 還支援從 ConfigMap 或 Secret 裡面引用值，不需要直接寫死。這個我們下堂課會講到。

環境變數不只是資料庫才會用到。很多應用程式都會從環境變數讀取設定。Node.js 可能從 PORT 環境變數讀取要監聽的 port，從 DATABASE_URL 讀取資料庫連線字串。在 Docker 裡面你用 -e 來設定，在 K8s 裡面就是用 env 欄位。概念完全一樣。

最後要提一個安全問題。密碼寫在 YAML 裡面安全嗎？答案是不安全。YAML 檔案通常會放在 Git 倉庫裡面。你 git commit 了這個檔案，密碼就進了版本歷史。Git 倉庫如果是公開的，全世界都能看到。即使是私有倉庫，團隊裡每個人都能看到。

K8s 提供了一個叫 Secret 的資源，專門用來管理機密資訊。Secret 會把你的密碼做 Base64 編碼，注意 Base64 不是加密只是編碼。然後你在 Pod 裡面可以透過環境變數或掛載檔案的方式讀取 Secret 的內容。這樣密碼就不需要寫在 Pod 的 YAML 裡面了。Secret 是下堂課的內容。今天的原則是：學習的時候把密碼寫在 YAML 裡面沒問題，但生產環境一律用 Secret。

好，概念都講清楚了。接下來我們馬上動手操作。我會帶大家從「故意做錯」開始，體驗完整的排錯和修復過程。

---

# 影片 4-22：MySQL Pod 實作示範（實作示範，~12min）

## 本集重點

- 示範錯誤情況：沒有 env 的 MySQL Pod → CrashLoopBackOff → logs 看原因
- 寫正確的 MySQL Pod YAML → apply → Running
- exec 進去：mysql -u root -p → CREATE DATABASE → SHOW DATABASES
- 清理
- 帶出問題：密碼在 YAML 裡 → git commit 就全世界看到了

## 學員自由練習題目 Loop 4

**必做題：**

1. MySQL Pod（設環境變數）：自己從頭寫一個 MySQL Pod YAML，加上 MYSQL_ROOT_PASSWORD 環境變數。apply 之後 exec 進去用 mysql 指令建一個資料庫，確認成功。做完清理。
2. 回顧題（不看筆記）：不看任何筆記和之前的 YAML 檔案，從零手寫一個 nginx Pod YAML。部署、用 port-forward 從瀏覽器看到 Welcome to nginx 頁面、刪除。如果卡住了再翻筆記。

**挑戰題（有時間再做）：**

3. Redis Pod：跑一個 Redis Pod（image: redis:7，不需要環境變數），用 `kubectl exec -it redis-pod -- redis-cli ping` 驗證（應該回 PONG）
4. Python HTTP Server：跑一個 Python Pod（image: python:3.12），command 設成 `["python", "-m", "http.server", "8000"]`，port-forward 到 8000，瀏覽器看到目錄列表

## 逐字稿

好，我們來動手做。這個實作我會從「故意做錯」開始，因為在真實世界裡你很可能會先碰到這個錯誤，然後才去找原因。

大家先進到工作目錄 cd k8s-course-labs/lesson4。

先建一個故意不寫環境變數的 MySQL Pod。打開你的編輯器，建一個叫 pod-mysql-broken.yaml 的檔案。內容很簡單：apiVersion v1、kind Pod、metadata 裡面 name 是 mysql-broken。spec 底下 containers，name 是 mysql，image 是 mysql:8.0。就這樣，故意不寫 env。

存檔之後 apply 它。kubectl apply -f pod-mysql-broken.yaml。K8s 說 created，看起來好像成功了。

但是 kubectl get pods 一看，等個十幾秒，STATUS 變成 CrashLoopBackOff，RESTARTS 一直在增加。這就是上一支影片講的，MySQL 需要密碼才能啟動。

用排錯三兄弟來查。kubectl describe pod mysql-broken 看 Events，看到 Back-off restarting failed container。然後 kubectl logs mysql-broken，看到那行關鍵的錯誤訊息：database is uninitialized and password option is not specified。訊息告訴你需要設定 MYSQL_ROOT_PASSWORD。

好，原因找到了。先刪掉壞的 Pod。kubectl delete pod mysql-broken。

現在來寫正確的版本。建一個新檔案叫 pod-mysql.yaml。內容我唸一遍：

apiVersion 冒號 v1。kind 冒號 Pod。metadata 冒號，底下 name 冒號 mysql-pod。spec 冒號，底下 containers 冒號，列表第一項，name 冒號 mysql，image 冒號 mysql:8.0，然後是關鍵的 env 區塊。env 冒號，列表第一項，name 冒號 MYSQL_ROOT_PASSWORD，value 冒號 my-secret。

大家注意縮排。env 跟 image 是同一層，都在容器的屬性裡面，縮排六個空格。env 底下的列表項目縮排八個空格。name 和 value 也是八個空格。如果你不確定縮排對不對，可以先用 dry-run 產生一個 Pod YAML 看看結構，然後在裡面加 env 就好。

存檔之後，apply。kubectl apply -f pod-mysql.yaml。

等一下，kubectl get pods。這次你可以用 --watch 來即時觀察。你會看到 mysql-pod 從 Pending 變成 ContainerCreating，然後變成 Running。如果 mysql:8.0 這個 image 你之前沒有拉過，ContainerCreating 可能要等一兩分鐘，因為 MySQL 的 image 比較大。耐心等一下就好。

Running 了。我們進去驗證。

輸入 kubectl exec -it mysql-pod 兩個減號 mysql -u root -pmy-secret。

注意兩個地方。第一，兩個減號前後都要有空格。第二，-p 和 my-secret 之間沒有空格。這是 MySQL 客戶端的語法，-p 後面直接接密碼表示在命令列帶入密碼。如果 -p 後面有空格，MySQL 客戶端會把空格後面的字當成資料庫名稱，而不是密碼，然後就會叫你手動輸入密碼。

好，你應該看到了 mysql 大於號的提示符。這代表你已經成功用 root 身份連上 MySQL 了。

我們來操作一下。輸入 SHOW DATABASES 分號。你會看到四個預設的資料庫：information_schema、mysql、performance_schema、sys。這些都是 MySQL 內建的系統資料庫。

現在我們來建一個自己的資料庫。輸入 CREATE DATABASE testdb 分號。然後再 SHOW DATABASES 分號。你會看到 testdb 出現在列表裡了。

如果你想更進一步，可以試試 USE testdb 分號，然後 CREATE TABLE users 括號 id INT 逗號 name VARCHAR(100) 括號 分號。然後 SHOW TABLES 分號，就能看到 users 這張表了。你甚至可以插入一筆資料：INSERT INTO users VALUES 括號 1 逗號 引號 Alice 引號 括號 分號。然後 SELECT 星號 FROM users 分號，就會看到那筆資料。

這跟你在 Docker 裡面 docker exec 進 MySQL 容器操作是完全一樣的體驗。差別只是你把 docker exec 換成了 kubectl exec，把容器的 ID 或名字換成了 Pod 的名字。底層跑的都是同一個 MySQL，只是管理它的平台從 Docker 變成了 K8s。

輸入 exit 離開 MySQL 客戶端。

好，MySQL Pod 完全正常運作了。你現在打開 pod-mysql.yaml 看一眼，密碼 my-secret 就明明白白地寫在裡面。上一支影片我們已經討論過了，這在生產環境是不安全的。下堂課學 Secret 就能解決這個問題。

最後清理一下。kubectl delete pod mysql-pod。kubectl get pods 確認一下，所有 Pod 都刪乾淨了。

螢幕上的練習題目分成必做和挑戰兩組。必做的兩題大家一定要做完：第一題是自己從頭寫 MySQL Pod YAML 加 env，進去建資料庫。第二題是不看筆記從零寫一個 nginx Pod，用 port-forward 從瀏覽器看到頁面。挑戰題有時間再做：Redis Pod 和 Python HTTP Server Pod。大家按照自己的進度來。

好，做完練習之後我們就進入今天的最後一支影片 — 第四堂的完整總結。

---

# 影片 4-23：第四堂總結 + 自由練習 + 下堂課預告（回頭操作+總結，~12min）

## 本集重點

- 快速帶做 MySQL Pod（如果前面沒跟上）
- 今天學了什麼（完整回顧）
- Pod 知識清單
- Docker → K8s 完整對照表
- 回家作業
- 下堂課預告：Deployment + Service + k3s

## 今天學了什麼

| 上午概念篇 | 下午實作篇 |
|:---|:---|
| K8s 全貌（5 個問題 → K8s） | Pod 生命週期 + 排錯三兄弟 |
| 8 個核心概念 | Sidecar 多容器 Pod |
| Master-Worker 架構 | kubectl 進階（port-forward / dry-run） |
| minikube 安裝 + 叢集驗證 | 環境變數注入 + MySQL Pod |
| YAML 四大欄位 + 第一個 Pod CRUD | |

## Pod 知識清單

- Pod 概念 + 為什麼不是直接管容器
- YAML 四大欄位：apiVersion / kind / metadata / spec
- Pod CRUD：apply / get / describe / logs / exec / delete
- Pod phase + kubectl 常見 STATUS
- 排錯三兄弟：get → describe → logs
- 多容器 Pod / Sidecar 模式
- port-forward（臨時通道存取 Pod）
- dry-run 產生 YAML 模板
- 環境變數注入（env 欄位）

## Docker → K8s 完整對照表

| 你會的 Docker | 今天學的 K8s |
|:---|:---|
| `docker run nginx` | `kubectl apply -f pod.yaml` |
| `docker run -p 8080:80` | `kubectl port-forward pod/xxx 8080:80` |
| `docker run -e KEY=VALUE` | YAML 裡的 `env:` 欄位 |
| `docker ps` | `kubectl get pods` |
| `docker logs` | `kubectl logs` |
| `docker exec -it` | `kubectl exec -it -- /bin/sh` |
| `docker stop / rm` | `kubectl delete pod` |
| `docker inspect` | `kubectl describe pod` / `kubectl get pod -o yaml` |
| `docker-compose.yaml` | K8s YAML（apiVersion / kind / metadata / spec） |
| Docker Compose `environment:` | K8s YAML `env:` |

## 回家作業

1. 把今天的 Pod 練習再做一遍（不看筆記）
2. 試試跑不同的 image：redis、python:3.12、busybox:1.36
3. 進階：MySQL Pod 加環境變數，進去建資料庫

## 下堂課預告

| 主題 | 內容 |
|:---|:---|
| Deployment | 管理多個 Pod — 擴縮容、滾動更新、自動修復 |
| Service | 讓外面連得到 Pod — ClusterIP、NodePort |
| k3s | 多節點叢集 — Pod 分散在不同機器上 |

> 今天的 Pod 是「一個人做事」
> 下堂課的 Deployment 是「一個團隊做事」

## 逐字稿

好，大家辛苦了。我們到了今天最後一支影片。這支影片我做三件事：第一，如果前面的 MySQL Pod 你沒跟上，我快速帶一遍。第二，回顧今天學的東西。第三，預告下堂課的內容。

先快速帶做 MySQL Pod。如果你已經做過了，趁這個時間整理一下筆記。

用 dry-run 快速產生骨架：kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml 大於號 pod-mysql.yaml。打開檔案，在 image 那行之後加 env 區塊：name 冒號 MYSQL_ROOT_PASSWORD，value 冒號 my-secret。注意 env 跟 image 同一層。存檔，kubectl apply -f pod-mysql.yaml。等 Running 之後 kubectl exec -it mysql-pod 兩個減號 mysql -u root -pmy-secret，進去 SHOW DATABASES 確認一下，exit 離開，kubectl delete pod mysql-pod 清理。

好，來回顧今天的內容。上午的部分我們在 4-11 已經回顧過了，這裡就不重複了。簡單一句話：上午我們從 Docker 的五個瓶頸出發，一路走到了第一個 Pod 的 CRUD。

重點回顧下午的四個 Loop。

第一個 Loop 是排錯。我們學了 Pod 的高層 phase，也學會區分 kubectl STATUS 裡常看到的 ContainerCreating、ImagePullBackOff、CrashLoopBackOff。最重要的是學會了排錯三兄弟 — get pods 看狀態、describe pod 看 Events、logs 看日誌。我們還故意把 Pod 搞壞，親手排除了 Image 名字拼錯和程式 crash 兩種錯誤。

第二個 Loop 是 Sidecar。一個 Pod 裡面放兩個容器，nginx 寫日誌，busybox 用 tail -f 追蹤日誌。兩個容器透過 emptyDir Volume 共享檔案，協同工作。我們也學了判斷標準：拿掉一個容器，另一個還能不能活。能活就分開放，不能活就放一起。

第三個 Loop 是 kubectl 進階技巧。-o wide 和 -o yaml 看更多資訊。port-forward 讓你從瀏覽器存取 Pod，但它是臨時的除錯工具。dry-run 幫你快速產生 YAML 模板。kubectl explain 查內建文件。自動補全和別名讓你打指令更快。

第四個 Loop 是環境變數。透過 YAML 的 env 欄位把環境變數注入到容器裡，成功跑起了 MySQL Pod。我們也討論了密碼不該直接寫在 YAML 裡面，鋪了路給下堂課的 Secret。

螢幕上有一個 Pod 知識清單和 Docker 對照表。大家截圖存起來，當速查卡。

回想一下今天早上，K8s 對你來說還是一個陌生的名詞。現在你已經可以寫 YAML、部署 Pod、看日誌、進容器、排錯、做 Sidecar、用 port-forward、用環境變數設定資料庫。這些都是 K8s 最基礎、也是最重要的操作。

但是你有沒有發現一個問題？我們今天一直在手動管理 Pod。手動建、手動刪、Pod 壞了手動修。如果生產環境有幾十個 Pod，你也要一個一個手動管嗎？半夜 Pod 掛了你要爬起來手動補嗎？更新版本的時候你要一個一個刪舊的、建新的嗎？

這些問題的答案都是「不需要」。下堂課我們要學的 Deployment 就是解決這些問題的。

Deployment 是 Pod 的管理者。你告訴它「我要三個 nginx Pod」，它就幫你維持三個。掛了一個？Deployment 自動補一個。要更新到新版本？Deployment 幫你做滾動更新，一個一個換，不中斷服務。要擴容？改一個數字，從三個變成十個。要縮容？改回三個。全部自動化，不需要你半夜爬起來。

用一個比喻來說，今天學的 Pod 是「一個人做事」。一個人會生病、會請假、會累。下堂課學的 Deployment 是「一個團隊做事」。團隊裡有人倒了，馬上有人頂上。需要更多人手？團隊可以擴編。忙完了？團隊可以縮編。這就是 Deployment 的價值。

除了 Deployment，下堂課還會學 Service。今天我們用 port-forward 來存取 Pod，但那只是臨時的除錯工具。Service 才是正式讓外部流量連到你的 Pod 的方式。我們會學兩種 Service 類型：ClusterIP 讓叢集內部的其他 Pod 找到你，NodePort 讓叢集外面的使用者連到你。

還有一個讓人期待的東西 — k3s。今天我們用的 minikube 是單節點的，所有 Pod 都跑在同一台機器上。下堂課我們會裝 k3s，建一個真正的多節點叢集，一台 Master 一台 Worker。你會看到 Pod 被分散到不同的機器上，真正體會到 K8s 的分散式管理能力。

好，回家作業有三個。第一，把今天的 Pod 練習再做一遍，但是不看筆記。看你能不能憑記憶寫出一個 nginx Pod 的 YAML，然後 apply、get、describe、logs、exec、delete 整個流程走一遍。如果可以，代表你今天的內容都吸收了。如果有些地方卡住了，就翻回去看一下再試。

第二，試試跑不同的 image。redis、python:3.12、busybox:1.36，每個 image 的行為都不太一樣。redis 會跑起來一直在 Running。python:3.12 如果你不給它 command，它啟動之後會直接退出，變成 Completed。busybox 也是，啟動了就退出。觀察這些不同的行為，想想為什麼。

第三，進階作業。跑一個 MySQL Pod，自己寫 YAML 加上環境變數，進去建一個資料庫和一張表。如果忘了 env 的寫法，用 kubectl explain pod.spec.containers.env 查一下。

好，第四堂課就到這裡。今天的內容量非常大，從完全不認識 K8s 到能夠獨立操作 Pod，大家真的辛苦了。回去好好消化，把練習做一做。下堂課我們會進入更精彩的部分 — Deployment、Service、多節點叢集。你會看到 K8s 真正強大的地方。

下堂課見，大家辛苦了！
