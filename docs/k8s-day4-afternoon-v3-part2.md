# 第四堂下午逐字稿 v3 Part 2 — Loop 3 & 4（4-18 ~ 4-23）

> 狀態說明：這份檔案保留的是「4-23 仍是總結頁」的前一版結構。
> 目前第四天下午 4-23 之後的正式內容，請以 [docs/k8s-day4-afternoon-v3-part3.md](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/docs/k8s-day4-afternoon-v3-part3.md) 與 [src/slides/lesson4-afternoon/index.tsx](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/src/slides/lesson4-afternoon/index.tsx) 為準。
> 承接 Loop 2 結尾（4-17）：Pod 的 CRUD、排錯、Sidecar 都會了
> 因果鏈：kubectl 只會基本功 → 進階技巧 → Pod 跑 MySQL 結果 crash → 環境變數 → 總結

---

# Loop 3：kubectl 進階技巧

---

# 影片 4-18：kubectl 用得更聰明（概念，~15min）

## PPT 上的內容

**問題起點：kubectl get pods 資訊不夠**
- 看不到 IP、看不到跑在哪個 Node
- Pod 跑起來了但瀏覽器打不開
- YAML 格式記不住、每次都要翻文件

**輸出格式 -o**
- `-o wide`：多顯示 IP、NODE
- `-o yaml`：完整配置（含 K8s 自動填充的預設值）
- `-o json`：程式處理用
- `-o name`：腳本用
- `--watch` / `-w`：即時監控狀態變化

**port-forward — 建臨時通道**

| Docker | K8s |
|:---|:---|
| `docker run -p 8080:80` | `kubectl port-forward pod/xxx 8080:80` |
| 永久（容器跑著就在） | 臨時（關終端就斷） |

- SSH 環境加 `--address 0.0.0.0`

**dry-run — 自動產生 YAML 模板**
```bash
kubectl run test --image=nginx:1.27 --dry-run=client -o yaml
kubectl run test --image=nginx:1.27 --dry-run=client -o yaml > test.yaml
```

**explain — 內建文件**
```bash
kubectl explain pod.spec.containers
kubectl explain pod.spec.containers.env
```

**效率三件套**
- 自動補全：`source <(kubectl completion bash)` / zsh
- 別名：`alias k=kubectl`
- 資源簡寫：po / svc / deploy / cm / ns

## 逐字稿

好，前面兩個 Loop 走下來，大家已經會 Pod 的 CRUD、排錯三兄弟、還有 Sidecar 多容器 Pod 了。Pod 本身你已經不陌生了。但是我在帶大家操作的過程中，發現了一個問題。

我們每次看 Pod 狀態都是用 kubectl get pods，對不對？每次看到的就是那幾個欄位，NAME、READY、STATUS、RESTARTS、AGE。但有時候我想知道更多。比如說，我的 Pod 的 IP 是什麼？它跑在哪個 Node 上？它完整的設定長什麼樣子？光靠 kubectl get pods 是看不到這些的。

資訊不夠怎麼辦？加參數。kubectl get 這個指令可以加一個 -o 參數，o 是 output 的意思，控制輸出格式。

第一個，-o wide。加了 wide 之後，表格會多顯示好幾個欄位。最重要的是 IP 和 NODE。IP 是這個 Pod 在叢集內部的虛擬 IP，NODE 是告訴你這個 Pod 目前跑在哪個節點上。我們現在只有一個 minikube 節點，所以 NODE 都是 minikube。但等到第五堂課我們用 k3s 建多節點叢集的時候，你會看到不同的 Pod 分散在不同的 Node 上，那時候 -o wide 就非常有用了。

第二個，-o yaml。這個輸出會很長，因為它會把 Pod 的完整配置用 YAML 格式全部吐出來。什麼叫完整配置？不只是你自己在 YAML 裡面寫的那些東西，還包含一大堆 K8s 自動幫你填進去的預設值。比如你沒寫 restartPolicy，K8s 預設幫你填 Always，表示容器掛了就自動重啟。你也沒寫 dnsPolicy，K8s 預設填 ClusterFirst。最底下還有一整塊 status 區塊，裡面有 Pod 的 IP、啟動時間、每個容器的詳細狀態。排錯的時候這些資訊非常有價值。如果你用過 Docker，-o yaml 就像 docker inspect，讓你看到容器的完整內部資訊。

第三個，-o json。跟 -o yaml 輸出的內容完全一樣，只是格式變成 JSON。如果你需要寫腳本去處理這些資料，或者要用 jq 做過濾和提取，JSON 格式會比 YAML 方便。jq 是一個命令列的 JSON 處理工具，可以從 JSON 輸出裡面過濾和提取你要的欄位。如果你沒裝過，Ubuntu 上用 sudo apt install jq 就好。今天不深入 jq，知道有這個工具就好。

第四個，-o name。只吐出資源的名字，像 pod/my-nginx 這種格式。寫自動化腳本的時候用得到。

除了 -o 之外，還有一個很常用的參數叫 --watch，可以縮寫成 -w。之前排錯的時候你已經用過了。它的作用是讓 kubectl 持續監控資源的變化，有任何狀態改變就即時顯示。比如你 apply 了一個新的 Pod 之後，開另一個終端跑 kubectl get pods -w，就可以即時看到 Pod 從 Pending 變成 ContainerCreating，再變成 Running 的完整過程。看完了按 Ctrl+C 停止。

好，資訊不夠的問題解決了。但是接下來又冒出一個問題。

你把 nginx Pod 跑起來了，STATUS 也是 Running，你很開心。但你打開瀏覽器，輸入 Pod 的 IP，結果怎麼都連不上。為什麼？

原因是 Pod 的 IP 是叢集內部的虛擬 IP，只能在叢集裡面的其他 Pod 之間互相存取。你的筆電不在叢集裡面，所以你的瀏覽器根本連不到 Pod 的 IP。就像你知道公司某台伺服器的內網 IP，但你在家裡用自己的電腦是連不上的，因為你不在公司內網裡。

在 Docker 裡面，我們是怎麼解決這個問題的？docker run -p 8080:80，把容器的 80 port 映射到本機的 8080 port，然後瀏覽器打 localhost:8080 就能看到了。K8s 裡面也有類似的東西，叫 port-forward。

指令是這樣的：kubectl port-forward pod/my-nginx 8080:80。意思是在你的本機和 Pod 之間建一條臨時的通道，把本機的 8080 port 轉發到 Pod 的 80 port。執行之後你在瀏覽器打 localhost:8080 就能看到 nginx 的歡迎頁面了。

但這裡有一個非常重要的差異。Docker 的 -p 是永久的，只要容器在跑，port 映射就一直在。port-forward 不一樣，它是臨時的。你把終端關掉、按 Ctrl+C、或者 SSH 斷線了，通道就斷了，瀏覽器馬上連不上。所以 port-forward 不是正式對外提供服務的方式，它只適合開發和除錯的時候臨時用一下看看容器到底有沒有正常跑。正式對外服務要用 Service，那是下堂課的內容。

另外提醒一個坑，如果你是用 SSH 連到一台 VM 上面操作 K8s 的。port-forward 預設綁定的是 127.0.0.1，也就是 VM 本機的 localhost。你在筆電的瀏覽器打 VM 的 IP 加 8080 port，是連不上的。解決方法是加上 --address 0.0.0.0，讓它監聽所有網路介面。完整指令是 kubectl port-forward pod/my-nginx 8080:80 --address 0.0.0.0。這樣你在筆電瀏覽器打 VM 的 IP 加 8080 就能看到了。

好，Pod 看得到了，瀏覽器也能連了。但是又有一個問題困擾著你。

每次要寫 YAML 的時候，那些欄位到底怎麼拼？apiVersion 是什麼？kind 是什麼？spec 底下 containers 的縮排到底是幾層？尤其是剛開始學的時候，每次都要翻文件或者翻之前寫過的檔案。太慢了。有沒有辦法讓 K8s 自己幫你產生一個模板？

有，就是 dry-run。指令是 kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml。dry-run 的意思是乾跑，模擬執行，不會真的建立任何資源。加上 -o yaml 就會把它本來會建立的東西用 YAML 格式印出來。你拿到的就是一個完整的 Pod YAML 骨架，直接改就能用。

你還可以用重新導向把輸出存成檔案。kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml 大於號 test-pod.yaml。打開檔案，改名字、改 image、加你需要的欄位，然後 kubectl apply -f 就直接部署了。在實際工作中，很多資深工程師也是這樣做的，沒有人真的從零開始一個字一個字手寫 YAML。

YAML 可以自動產生了，但如果你想知道某個欄位到底有什麼選項可以填呢？比如 containers 底下到底還能寫什麼？這時候就用 kubectl explain。

kubectl explain pod.spec.containers，它會列出 containers 底下所有可以設定的欄位和說明。你可以一層一層往下鑽。比如 kubectl explain pod.spec.containers.ports 可以看到 containerPort、hostPort、protocol 這些子欄位。kubectl explain pod.spec.containers.env 可以看到環境變數怎麼設。這比去翻官方文件快多了，而且資訊跟你叢集的版本完全吻合。

最後教大家三個讓效率翻倍的小技巧。

第一個，自動補全。你輸入 source 小於號左括號 kubectl completion bash 右括號，就能啟用 Tab 補全功能。啟用之後你打 kubectl get po 然後按 Tab，它自動幫你補成 pods。你打 kubectl logs my 然後按 Tab，它自動補全你的 Pod 名稱。非常節省時間。建議把這行加到你的 shell 設定檔裡面，這樣每次開新終端都會自動生效。用 bash 的同學，加到 ~/.bashrc。用 zsh 的同學，把 completion bash 換成 completion zsh，加到 ~/.zshrc。macOS 預設是 zsh，Linux 預設是 bash。不確定自己用哪個的話，終端機裡面打 echo $SHELL 看一下就知道了。

第二個，別名。kubectl 這個字每天要打幾百次，太長了。設定 alias k=kubectl，之後打 k get pods 就等於 kubectl get pods。一樣加到 ~/.bashrc 或 ~/.zshrc 讓它永久生效。

第三個，資源簡寫。K8s 的資源類型都有簡寫，pods 簡寫成 po，services 簡寫成 svc，deployments 簡寫成 deploy，configmaps 簡寫成 cm，namespaces 簡寫成 ns。搭配別名一起用，k get po 四個字就看到 Pod 列表了。

好，kubectl 的進階技巧就這些。每一個都是你日常工作中天天會用到的。接下來我們全部動手操作一遍。

---

# 影片 4-19：port-forward + dry-run + explain 實作（實作示範，~15min）

## PPT 上的內容

**準備工作**
```bash
cd k8s-course-labs/lesson4
kubectl run my-nginx --image=nginx:1.27    # 如果沒有 Pod
kubectl get pods                            # 確認 Running
```

**port-forward 實作**
```bash
kubectl port-forward pod/my-nginx 8080:80
# 另一個終端：
curl localhost:8080                # 看到 Welcome to nginx
# Ctrl+C 停掉 → 再 curl → Connection refused
```

**輸出格式**
```bash
kubectl get pods -o wide           # 多顯示 IP、NODE
kubectl get pods -o yaml | head -30  # 完整配置（前 30 行）
kubectl get pods -A                # 看所有 namespace
```

**dry-run 產生模板**
```bash
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml
```

**explain 查文件**
```bash
kubectl explain pod.spec.containers
kubectl explain pod.spec.containers.resources
```

**自動補全 + 別名**
```bash
# bash：
source <(kubectl completion bash)
echo 'source <(kubectl completion bash)' >> ~/.bashrc

# zsh（macOS 預設）：
source <(kubectl completion zsh)
echo 'source <(kubectl completion zsh)' >> ~/.zshrc

# 別名（bash 或 zsh 都一樣）：
alias k=kubectl
echo 'alias k=kubectl' >> ~/.bashrc   # 或 ~/.zshrc
```

## 逐字稿

好，上一支影片講了一堆技巧，現在全部來動手操作。大家把終端機打開，跟著我一步一步來。

首先我們需要一個 Pod 來實驗。前面做完 Sidecar 應該清理過了，所以先建一個回來。

指令：cd k8s-course-labs/lesson4
指令：kubectl apply -f pod.yaml
指令：kubectl get pods

等到 my-nginx 的 STATUS 變成 Running 就可以了。

第一個操作，port-forward。

指令：kubectl port-forward pod/my-nginx 8080:80

你會看到終端顯示 Forwarding from 127.0.0.1:8080 然後箭頭 80，表示通道建好了。注意，這個終端現在被 port-forward 佔住了，你不能再打其他指令。所以你需要開另一個終端視窗。

在新的終端裡面，輸入 curl。

指令：curl http://localhost:8080

你應該會看到一大段 HTML 回來，裡面有 Welcome to nginx 的字樣。如果你是圖形化環境，也可以打開瀏覽器輸入 localhost:8080，會看到 nginx 那個經典的歡迎頁面。

回到跑 port-forward 的那個終端，你會看到每收到一個請求它就印出一行 Handling connection for 8080。現在按 Ctrl+C 把它停掉。

停掉之後回到另一個終端再 curl localhost:8080 試試看。連不上了，curl 報 Connection refused。這就是我們講的，port-forward 是臨時的，關掉就斷。

好，port-forward 體驗完了。接下來試各種輸出格式。

指令：kubectl get pods -o wide

你會看到表格比之前寬了，多了好幾個欄位。最重要的是 IP 和 NODE。IP 就是這個 Pod 在叢集內部的虛擬 IP，NODE 顯示 minikube。後面還有 NOMINATED NODE 和 READINESS GATES，現在是空的，不用管。

再來試 -o yaml。

指令：kubectl get pods -o yaml

輸出一下子衝出好幾百行。你可以往上滾一下看看裡面有什麼。metadata 裡面有 creationTimestamp，是 K8s 記錄的建立時間。有 uid，是自動產生的唯一識別碼。往下看 spec 區塊，你會看到一些你沒寫過的東西，像 restartPolicy 冒號 Always、dnsPolicy 冒號 ClusterFirst、terminationGracePeriodSeconds 冒號 30。這些都是 K8s 自動幫你填的預設值。最底下的 status 區塊，有 Pod 的 IP、每個容器的狀態細節。

輸出太長了不好看對不對？加 pipe head -30 只看前 30 行就好。kubectl get pods -o yaml 然後 pipe head -30。這樣清爽多了。

順便看一下全叢集的 Pod。

指令：kubectl get pods -A

-A 是 --all-namespaces 的縮寫。除了你在 default namespace 裡面建的 my-nginx，你還會看到一堆在 kube-system 裡面的 Pod。etcd、kube-apiserver、kube-scheduler、kube-controller-manager、kube-proxy、coredns。這些就是 K8s 的系統組件，上午概念篇講過的那些角色，它們一直安安靜靜地在背後工作。

好，接下來是今天的重頭戲，dry-run。

指令：kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml

看到了嗎？螢幕上印出來一個完整的 Pod YAML。apiVersion v1、kind Pod、metadata 裡面有 name test-pod 和一些 labels。spec 裡面 containers 有 image nginx:1.27。關鍵的是，它沒有真的建立 Pod。你可以 kubectl get pods 確認一下，Pod 列表裡面不會有 test-pod。

現在把它存成檔案。

指令：kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
指令：cat test-pod.yaml

看一下內容，跟剛才螢幕上印的一模一樣。以後要寫 YAML，先用 dry-run 產生骨架再改，這是最快的方式。

再來試 kubectl explain。

指令：kubectl explain pod.spec.containers

你會看到一堆欄位的說明。最上面是類型和描述，然後列出所有子欄位。image 是 string，description 是 Docker image name。env 是一個列表，用來設定環境變數。ports 也是列表。resources 可以設定 CPU 和記憶體限制。

往下鑽一層。

指令：kubectl explain pod.spec.containers.resources

它告訴你 resources 底下有 limits 和 requests。limits 是容器可以用的最大資源量，requests 是啟動時需要保證的最小資源量。這個第七堂課會詳細講，現在先知道怎麼查就好。

最後來設定自動補全和別名。

如果你用的是 bash，輸入 source 小於號左括號 kubectl completion bash 右括號。好，現在試試看。打 kubectl get po 然後按 Tab。有沒有自動補全成 pods？打 kubectl logs m 然後按 Tab，有沒有自動補全出你的 Pod 名字？方便吧。

如果你用的是 zsh，macOS 的同學注意了，macOS 預設就是 zsh。你要把 bash 換成 zsh：source 小於號左括號 kubectl completion zsh 右括號。效果一樣。

然後設定別名。輸入 alias k=kubectl。現在你打 k get pods 就等於 kubectl get pods 了。k get po -o wide，也可以。

記得把這些設定加到你的 shell 設定檔。bash 的同學加到 ~/.bashrc，zsh 的同學加到 ~/.zshrc。這樣每次開新終端都自動生效，不用每次重新打一遍。怎麼加？用 echo 加上重新導向兩個大於號就好，螢幕上有完整的指令。

好，kubectl 的進階用法我們全部操作過一遍了。先不要清理 Pod，等一下回頭操作還會用到。

---

# 影片 4-20：回頭操作 Loop 3 + 學員實作（回頭操作，~6min）

## PPT 上的內容

**帶做 port-forward**
```bash
kubectl port-forward pod/my-nginx 8080:80
# 另一個終端 curl localhost:8080
```

**常見坑**
- 關終端就斷 → port-forward 是臨時除錯用，不是正式入口
- SSH 環境：localhost 指的是 VM，不是你的筆電 → 加 `--address 0.0.0.0`
- port-forward 佔住終端 → 需要開第二個終端視窗

**探索建議**
```bash
kubectl get pod my-nginx -o jsonpath='{.status.podIP}'
kubectl get pod my-nginx -o jsonpath='{.spec.containers[0].image}'
```

**學員實作（~10min）**
1. `dry-run` 產 httpd Pod YAML → 存 my-httpd.yaml → apply → port-forward 9090:80 → curl 看到 "It works!"
2. `-o yaml` 查看 Pod 完整配置 → 找出 K8s 自動填充的欄位（uid / creationTimestamp / restartPolicy）
3. `kubectl explain pod.spec.containers.ports` → 看看 containerPort 旁邊還能設什麼（protocol / name / hostPort）

## 逐字稿

好，回頭操作時間。

如果你前面有跟上，這段就是複習加補充。如果前面沒跟上，現在就跟著螢幕上的步驟做。

首先確認你有一個 Running 的 Pod。沒有的話就 kubectl run my-nginx --image=nginx:1.27 快速建一個。然後 kubectl port-forward pod/my-nginx 8080:80，開第二個終端 curl localhost:8080，看到 nginx 的歡迎頁面就成功了。Ctrl+C 停掉 port-forward。

這裡我要再強調兩個坑，因為這兩個問題初學者幾乎一定會踩到。

第一個坑，你關掉終端或按 Ctrl+C，port-forward 就斷了。很多同學以為跑了 port-forward 就一直在，結果過一陣子回來發現連不上了。port-forward 它就是一個臨時的除錯工具，你想用多久就得一直開著那個終端。正式對外提供服務不能用 port-forward，要用 Service，下堂課就會學到。

第二個坑，如果你是 SSH 連到 VM 上面操作的。你跑 port-forward 之後在 VM 上 curl localhost:8080 可以通，但你在自己的筆電瀏覽器打 localhost:8080 是通不了的。因為 port-forward 預設綁的是 VM 的 127.0.0.1，不是你筆電的 127.0.0.1。解決方法前面講過了，加 --address 0.0.0.0，讓它監聽 VM 的所有網路介面。然後在你筆電瀏覽器打 VM 的 IP 加 port 就行了。

dry-run 也再提一下。你可能現在覺得 Pod 的 YAML 不難寫，就那幾行嘛。但是後面學到 Deployment、Service、Ingress 的時候，YAML 會越來越長越來越複雜。養成用 dry-run 先產生骨架的習慣，比從零手寫快非常多，也不容易出錯。

螢幕上有三個練習題目，大家按自己的進度做。第一題是用 dry-run 產一個 httpd 的 Pod YAML，存成 my-httpd.yaml，apply 之後 port-forward 到 9090，curl 看到那個經典的 It works 頁面。第二題是用 -o yaml 看你的 Pod 完整配置，找出哪些欄位是 K8s 自動幫你加的，重點看 metadata 裡的 uid 和 creationTimestamp，還有 spec 裡面的 restartPolicy。第三題是用 kubectl explain 預習一下 resources 這個欄位，了解 limits 和 requests 是什麼。這個第七堂課會詳細講。

做完的同學，給你一個探索的方向。試試 kubectl get pod my-nginx -o jsonpath 等於引號大括號 .status.podIP 大括號引號。這個指令可以直接提取 Pod 的 IP 位址。jsonpath 是一個很強大的過濾語法，可以從 JSON 輸出裡面精準抽出你要的欄位。寫自動化腳本的時候非常好用。

好，做完的同學我們繼續往下。接下來是今天最後一個 Loop。前面三個 Loop 我們跑的都是 nginx、httpd、busybox 這些不太需要設定就能跑起來的 Image。但真實世界裡很多服務不是這樣的。你能不能在 K8s 裡面跑一個 MySQL？直覺上應該很簡單，寫個 YAML 改一下 image 就好了對不對？但你真的去試的話，你會發現它跑不起來。為什麼？下一支影片我們來故意試試看。

---

# Loop 4：環境變數 + MySQL Pod

---

# 影片 4-21：為什麼 MySQL Pod 會 Crash（概念，~12min）

## PPT 上的內容

**問題：MySQL Pod 直接跑 → CrashLoopBackOff**
- 只寫 `image: mysql:8.0`，什麼都不設
- `kubectl logs` → "database is uninitialized and password option is not specified"
- MySQL 啟動時「必須」知道 root 密碼

**回想 Docker**
```bash
docker run -e MYSQL_ROOT_PASSWORD=my-secret mysql:8.0
```
- `-e` 就是設定環境變數
- Docker Compose 的 `environment:` 也是同一件事

**K8s 的解法：env 欄位**
```yaml
spec:
  containers:
  - name: mysql
    image: mysql:8.0
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "my-secret"
    - name: MYSQL_DATABASE
      value: "myapp"       # 可選：自動建資料庫
```

**env 對照表**

| Docker | K8s YAML |
|:---|:---|
| `docker run -e KEY=VALUE` | `env:` → `name:` + `value:` |
| docker-compose `environment:` | 同上，寫法更結構化 |
| `.env` 檔案管密碼 | Secret（下堂課） |

**安全問題**
- 密碼寫在 YAML → git commit → 全世界看到
- 學習階段先這樣用，生產環境一律用 Secret

## 逐字稿

好，進入今天最後一個 Loop。

前面三個 Loop 我們跑了 nginx、跑了 httpd、跑了 busybox。這些 Image 有一個共同點，它們不需要任何設定就能正常啟動。但是在真實世界裡，很多服務不是這樣的。最典型的例子就是資料庫。

我現在丟一個情境給大家。你想在 K8s 裡面跑一個 MySQL，而且我故意先做一份會失敗的版本。根據前面學的知識，你會怎麼寫 YAML？很自然的，apiVersion v1、kind Pod、metadata name mysql-broken、spec containers 裡面放一個 name mysql、image mysql:8.0。跟寫 nginx 的 YAML 沒什麼兩樣，只是把 image 換了一下。看起來很合理，對不對？

但是如果你真的把這個 YAML 拿去 apply，你會得到一個非常讓人沮喪的結果。kubectl get pods 一看，STATUS 不是 Running，而是 CrashLoopBackOff。你看著 RESTARTS 數字一直在往上跳，1、2、3、4。Pod 啟動了就掛，掛了 K8s 自動重啟，啟動了又掛，反反覆覆。

怎麼辦？排錯三兄弟。get pods 看到了 CrashLoopBackOff，describe pod 看 Events 會顯示 Back-off restarting failed container。但最關鍵的資訊在 logs 裡面。kubectl logs mysql-broken，你會看到一行錯誤訊息：database is uninitialized and password option is not specified。翻成白話就是：資料庫還沒初始化，而且你也沒給我密碼，我不知道怎麼辦，我只好退出。

MySQL 的啟動邏輯是這樣的。第一次跑的時候它需要初始化資料庫，而初始化的其中一步就是設定 root 帳號的密碼。你什麼都不告訴它，它就直接退出了。這不是 bug，是 MySQL 故意這樣設計的。沒有密碼就不啟動，逼你設密碼，避免有人跑了一個沒有密碼保護的資料庫。

那怎麼告訴 MySQL 密碼是什麼？回想一下 Docker。在 Docker 裡面你是怎麼跑 MySQL 的？docker run -e MYSQL_ROOT_PASSWORD=my-secret mysql:8.0。關鍵就在那個 -e 參數。-e 是 environment 的意思，設定環境變數。你透過一個叫 MYSQL_ROOT_PASSWORD 的環境變數，告訴 MySQL 容器 root 的密碼是 my-secret。MySQL 啟動的時候讀到這個環境變數，用這個密碼初始化 root 帳號，然後順利啟動。

Docker Compose 裡面也是一樣的道法，在 services 底下的 environment 區塊寫 MYSQL_ROOT_PASSWORD 冒號 my-secret。概念完全一樣，就是用環境變數把設定傳給容器。

K8s 裡面對應的做法是什麼？在 YAML 的容器定義裡面加一個 env 欄位。env 寫在 spec 底下 containers 裡面，跟 image 同一層。格式是這樣的：env 冒號，底下是一個列表。每一個環境變數是列表裡的一個項目，用減號開頭，然後有兩個欄位，name 和 value。name 是環境變數的名字，value 是值。

以 MySQL 為例，name 寫 MYSQL_ROOT_PASSWORD，value 寫 my-secret。就這樣，在你原本的 YAML 裡面多了三四行。

如果你要設多個環境變數呢？就在 env 底下多加幾個列表項目。比如 MySQL 還有一個環境變數叫 MYSQL_DATABASE，你設了它之後，MySQL 啟動的時候會自動幫你建一個同名的資料庫，省得你自己進去 CREATE DATABASE。

跟 Docker Compose 做個對比。Docker Compose 裡面 environment 底下直接寫 MYSQL_ROOT_PASSWORD 冒號 my-secret，簡潔明了。K8s 的 env 要寫 name 冒號 MYSQL_ROOT_PASSWORD、value 冒號 my-secret，看起來比較囉唆。但 K8s 這樣設計是有原因的，因為 env 的 value 除了直接寫死之外，還可以從 ConfigMap 或 Secret 裡面引用。也就是說，值不一定要寫在這裡，可以指向別的地方去取。這個下堂課學 ConfigMap 和 Secret 的時候就會用到。

環境變數不只資料庫會用。很多應用程式都會從環境變數讀取設定。Node.js 可能從 PORT 環境變數決定要監聽哪個 port，從 DATABASE_URL 讀取資料庫連線字串。Python 的 Flask 可能從 FLASK_ENV 判斷是開發模式還是生產模式。在 Docker 裡面你用 -e，在 K8s 裡面你用 env 欄位。概念一模一樣。

最後要講一個安全問題。你打開剛才那個 YAML 檔案看一眼，密碼 my-secret 就明明白白寫在裡面。YAML 檔案通常會放在 Git 倉庫裡面進行版本控制。你 git commit 了這個檔案，密碼就進了版本歷史。倉庫是公開的話全世界都能看到。就算是私有倉庫，團隊裡每個人都能看到。資料庫密碼、API 金鑰，這些東西寫在 YAML 裡面就等於大聲告訴所有人。

K8s 提供了一個叫 Secret 的資源來解決這件事。密碼存在 Secret 裡，Pod 的 YAML 只寫引用，不寫明文。Secret 是下堂課的內容。今天的原則是：學習的時候先把密碼寫在 YAML 沒問題，但你心裡要記住，生產環境一律用 Secret。

好，概念都講清楚了。注意我這支影片只講概念，沒有做 apply。因為我要帶你從故意做錯開始，體驗完整的排錯和修復流程。接下來的實作影片我們馬上動手。

---

# 影片 4-22：MySQL Pod 實作 — 從做錯到修好（實作示範，~12min）

## PPT 上的內容

**Step 1：故意做錯**
```bash
cd k8s-course-labs/lesson4
```
```yaml
# pod-mysql-broken.yaml
apiVersion: v1
kind: Pod
metadata:
  name: mysql-broken
spec:
  containers:
  - name: mysql
    image: mysql:8.0
    # 故意不寫 env
```
```bash
kubectl apply -f pod-mysql-broken.yaml
kubectl get pods -w         # 觀察 CrashLoopBackOff
kubectl logs mysql-broken   # 看到 "password option is not specified"
kubectl delete pod mysql-broken
```

**Step 2：寫正確版本**
```yaml
# pod-mysql.yaml
apiVersion: v1
kind: Pod
metadata:
  name: mysql-pod
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
kubectl get pods -w         # 等 Running
```

**Step 3：進去操作**
```bash
kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
# 注意：-p 和密碼之間「沒有空格」
```
```sql
SHOW DATABASES;
CREATE DATABASE testdb;
SHOW DATABASES;
exit
```

**Step 4：清理 + 安全提醒**
```bash
kubectl delete pod mysql-pod
```
- 密碼寫 YAML → 不安全 → 下堂課用 Secret

## 逐字稿

好，我們來動手做。大家把終端機打開，進到 k8s-course-labs/lesson4。

這個實作我要從故意做錯開始。為什麼？因為在真實世界裡，你很可能就是先碰到這個錯誤，然後才去查原因。讓你先體驗錯誤，印象會比直接給正確答案深刻得多。

第一步，建一個故意不寫環境變數的 MySQL Pod。用你習慣的編輯器建一個檔案叫 pod-mysql-broken.yaml。內容很簡單：apiVersion v1、kind Pod、metadata name mysql-broken、spec containers 底下 name mysql、image mysql:8.0。就這樣，故意不寫 env。

存檔，apply。

指令：kubectl apply -f pod-mysql-broken.yaml

K8s 說 pod/mysql-broken created。看起來成功了對不對？

但是用 -w 看一下。

指令：kubectl get pods --watch

等個十幾二十秒。你會看到 STATUS 從 ContainerCreating 變成 Running，然後很快就跳到 Error，接著變成 CrashLoopBackOff。RESTARTS 數字一直在增加。1、2、3。Pod 不斷在重啟，但每次起來就馬上掛掉。

按 Ctrl+C 停掉 watch。我們來看看到底怎麼了。

指令：kubectl logs mysql-broken

往上找那行關鍵的錯誤訊息：database is uninitialized and password option is not specified。You need to specify one of the following as an environment variable: MYSQL_ROOT_PASSWORD, MYSQL_ALLOW_EMPTY_PASSWORD, MYSQL_RANDOM_ROOT_PASSWORD。MySQL 告訴你了，你必須設定這三個環境變數中的其中一個。最常用的就是 MYSQL_ROOT_PASSWORD。

原因找到了。上一支影片講的內容完全吻合。MySQL 需要知道 root 密碼才能完成初始化，你什麼都不給它，它就退出了。

你可能會想：能不能不刪 Pod，直接用 kubectl edit 把 env 加上去？答案是不行。Pod 的 spec 大部分欄位是建立之後就不能改的，包括 containers 裡面的 env。你只能刪掉再重建。如果是用 Deployment 管的 Pod，改 Deployment 的 YAML 然後 apply 就好，Deployment 會幫你自動重建 Pod。這就是為什麼生產環境不直接建 Pod，而是用 Deployment。Deployment 是下一個 Loop 的主角。

先把壞掉的 Pod 刪掉。

指令：kubectl delete pod mysql-broken

第二步，寫正確的版本。建一個新檔案叫 pod-mysql.yaml。我唸一遍，大家跟著打。

apiVersion 冒號 v1。kind 冒號 Pod。metadata 冒號，底下 name 冒號 mysql-pod。spec 冒號，底下 containers 冒號，減號空格 name 冒號 mysql。image 冒號 mysql:8.0。接著就是關鍵的部分了。跟 image 同一層，加上 env 冒號。底下列表第一項，減號空格 name 冒號 MYSQL_ROOT_PASSWORD。下一行同一層，value 冒號引號 my-secret 引號。

注意縮排。env 跟 image 跟 name 是同一層的，都是容器的屬性。env 底下的列表項目要多縮排兩個空格。name 和 value 也是這個縮排。如果你不確定縮排對不對，有個小技巧：先用 dry-run 產生一個 Pod YAML 看看結構，kubectl run temp --image=mysql:8.0 --dry-run=client -o yaml，然後在裡面找到 image 那行，在同一層加 env 就好了。

存檔，apply。

指令：kubectl apply -f pod-mysql.yaml

觀察一下。

指令：kubectl get pods --watch

你會看到 mysql-pod 從 Pending 變成 ContainerCreating。如果你之前沒拉過 mysql:8.0 這個 image 的話，ContainerCreating 可能要等一兩分鐘，因為 MySQL 的 image 比較大，大概五百多 MB。耐心等一下。然後你會看到 STATUS 變成 Running，而且不會再跳成 Error 了。穩穩地跑著。

Running 了。Ctrl+C 停掉 watch。我們進去驗證。

指令：kubectl exec -it mysql-pod -- mysql -u root -pmy-secret

這裡有兩個小地方要注意。第一，兩個減號前後都要有空格。兩個減號是 kubectl 和容器指令之間的分隔符號，告訴 kubectl 後面的東西是要在容器裡面執行的指令。第二，-p 和 my-secret 之間沒有空格。這是 MySQL 客戶端的語法，-p 後面直接接密碼表示在命令列帶入密碼。如果 -p 後面有空格，MySQL 會把空格後面的字當成資料庫名稱而不是密碼，然後叫你另外手動輸入密碼。

好，你應該看到了 mysql 大於號的提示符號。這代表你已經成功用 root 身份連上了 MySQL。恭喜。

我們來操作幾下。

指令：SHOW DATABASES;

你會看到列出四個預設的系統資料庫：information_schema、mysql、performance_schema、sys。這些是 MySQL 內建的。

現在我們來建自己的資料庫。

指令：CREATE DATABASE testdb;
指令：SHOW DATABASES;

testdb 出現在列表裡了。

如果你想更進一步的話，可以試試 USE testdb 分號。然後 CREATE TABLE users 括號 id INT 逗號 name VARCHAR 括號 100 括號 括號 分號。然後 SHOW TABLES 分號，會看到 users 這張表。你甚至可以插入一筆資料，INSERT INTO users VALUES 括號 1 逗號 引號 Alice 引號 括號 分號。然後 SELECT 星號 FROM users 分號，就能看到那筆資料。

這跟你在 Docker 裡面 docker exec 進 MySQL 容器操作是完全一樣的體驗。唯一的差別就是你把 docker exec 換成了 kubectl exec，把容器的名字換成了 Pod 的名字。底層跑的是同一個 MySQL，只是管理它的平台從 Docker 變成了 K8s。

輸入 exit 離開 MySQL 客戶端。

指令：exit

好，清理一下。

指令：kubectl delete pod mysql-pod
指令：kubectl get pods

確認一下都刪乾淨了。

回頭看一眼 pod-mysql.yaml 這個檔案。密碼 my-secret 就這樣明文寫在裡面。如果你把這個檔案 git commit 推到 GitHub 上，任何人都能看到你的資料庫密碼。學習階段我們先這樣用沒問題，但你心裡要記住，這個密碼早晚要搬到 Secret 裡面去。下堂課就會教你怎麼做。

好，MySQL Pod 的實作完成了。接下來是今天最後一支影片，我們來做第四堂課的完整總結，然後看看下堂課要學什麼。

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

用 dry-run 快速產生骨架。

指令：kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml > pod-mysql.yaml

打開檔案，找到 image 冒號 mysql:8.0 那行。在同一層，加上 env 冒號。底下減號空格 name 冒號 MYSQL_ROOT_PASSWORD，下一行 value 冒號引號 my-secret 引號。存檔。

指令：kubectl apply -f pod-mysql.yaml
指令：kubectl get pods -w

等到 Running。然後進去驗證。

指令：kubectl exec -it mysql-pod -- mysql -u root -pmy-secret

進去之後確認看到四個系統資料庫。

指令：SHOW DATABASES;
指令：exit

最後清理掉。

指令：kubectl delete pod mysql-pod

不到兩分鐘就完成了。

已經做過的同學，幫我回想一下 Loop 4 的因果鏈。我們想跑一個 MySQL，結果沒給密碼，Pod 不斷 crash。排錯三兄弟告訴我們 MySQL 需要 MYSQL_ROOT_PASSWORD 環境變數。在 YAML 的 env 欄位加上去之後，MySQL 順利跑起來了。跟 Docker 的 -e 參數是一模一樣的概念。

好，Loop 4 到這邊結束。

但是在進入下一個 Loop 之前，我要請大家想一件事。

今天下午我們已經跑過很多 Pod 了。nginx、httpd、busybox、mysql。每一個 Pod 跑起來的時候你都很開心，Running，看起來一切正常。但是你有沒有注意到，我們在清理的時候都是 kubectl delete pod，刪掉之後那個 Pod 就真的消失了。kubectl get pods，空空如也。如果你是在生產環境跑一個 API 服務，半夜三點你的 Pod 掛了，沒有人幫你重建，你的使用者就看到錯誤頁面了。

這就是「一個人做事」的問題。一個人生病了、請假了、走了，事情就停了。

今天我們還有最後一個 Loop。在這個 Loop 裡面，我要帶你把「一個人做事」變成「一個團隊做事」。這個讓你從一個人變成一個團隊的東西，叫做 Deployment。

上午的概念篇其實已經提過 Deployment 了，它負責管理多個副本、自動補 Pod、滾動更新。但是光聽概念跟親手操作是完全不一樣的。接下來的影片，我要讓你親眼看到「一個人」有多脆弱，然後親手感受「一個團隊」有多強大。

