# 第四堂下午逐字稿 Part 3 — 影片 4-12 ~ 4-17

> 承接 4-11（上午總結，預告下午排錯 + Sidecar）
> Loop 1：Pod 生命週期 + 排錯（4-12 ~ 4-14）
> Loop 2：多容器 Pod + Sidecar（4-15 ~ 4-17）

---

# 影片 4-12：Pod 生命週期 + 排錯觀念（概念，~15min）

## 本集重點

- Pod 跑起來了，但狀態不一定是 Running — 各種狀態是什麼意思？
- Pod phase：Pending → Running → Succeeded / Failed
- kubectl STATUS 常見：ContainerCreating、ErrImagePull、ImagePullBackOff、CrashLoopBackOff
- 常見錯誤狀態：ErrImagePull、ImagePullBackOff、CrashLoopBackOff
- CrashLoopBackOff 退避策略：10s → 20s → 40s → 80s → ... → 5min 上限
- 排錯三兄弟：get pods → describe pod → logs
- 補充：kubectl get events
- 問題驅動：每個狀態都有對應的排錯策略

## 對照表

| 狀態 | 意思 | 常見原因 | 第一步排錯 |
|:---|:---|:---|:---|
| `ContainerCreating` | `kubectl` 常見 STATUS，代表容器仍在 Waiting | 正在拉 Image、掛 Volume、套用 Secret / ConfigMap | `describe pod` 看卡在哪 |
| `Pending` | 排隊中 | Node 資源不夠、沒有符合條件的 Node | `describe pod` 看 Events |
| `Running` | 正常運行 | — | — |
| `Succeeded` | 跑完正常結束 | Job 類任務完成 | 正常，不用處理 |
| `Failed` | 失敗退出 | 程式 crash、exit code 非零 | `logs` 看原因 |
| `ErrImagePull` | 第一次拉 Image 失敗 | 名字拼錯、tag 不存在、私有倉庫沒權限 | `describe pod` 看 Events |
| `ImagePullBackOff` | 重複拉 Image 失敗 | 同上，K8s 在退避重試 | `describe pod` 看 Events |
| `CrashLoopBackOff` | 容器反覆 crash + 重啟 | 程式啟動就 crash、設定檔錯誤、缺少環境變數 | `logs` 看程式輸出 |
| `Terminating` | 正在停止 | 執行 graceful shutdown | 正常，等一下就好 |

## 逐字稿

好，歡迎回來。上午我們完成了一件非常重要的事情，就是從零開始寫出第一個 Pod，然後做了完整的 CRUD 操作。建立、查看、進容器、刪除，整個流程跑了一遍。如果你上午的練習都有跟上，恭喜你，你已經會在 K8s 裡面跑容器了。

但是你回想一下，上午的練習有一個前提：我們的 YAML 是對的，Image 名字是對的，一切都很順利。現實工作中呢？我跟你說，現實中大概有一半的時間你都在處理各種問題。Image 名字打錯了、版本號不存在、程式啟動就 crash、設定檔少了一個欄位。而且 K8s 不會像你朋友一樣直接告訴你「嘿，你 Image 名字拼錯了」，它只會給你一個狀態，比如 ImagePullBackOff，然後你得自己去查是怎麼回事。

所以這支影片我們要來搞懂一件事：Pod 的各種狀態到底代表什麼意思，然後碰到問題的時候，你該怎麼一步一步找到原因。

我們先來看 Pod 的生命週期。不過這裡要先分兩層。Kubernetes API 裡真正的 Pod phase，只有 Pending、Running、Succeeded、Failed，另外還有比較少遇到的 Unknown。你平常在 kubectl get pods 的 STATUS 欄看到的 ContainerCreating、CrashLoopBackOff、Terminating，很多時候是為了讓人比較好理解的顯示值，或是 container 的 waiting reason，不要把它們全部當成同一層的 phase。

最開始是 Pending 狀態。你執行了 kubectl apply，K8s 的 API Server 收到了你的請求，把它記錄到 etcd 裡面了。但是 Pod 還沒有被分配到任何一個 Node 上面。這時候 Scheduler 正在忙著看哪個 Node 比較適合跑這個 Pod。如果你的叢集資源很充足，Pending 的時間通常非常短，短到你根本看不到。但如果叢集裡面所有 Node 的 CPU 和記憶體都已經快滿了，Scheduler 找不到合適的 Node，Pod 就會一直卡在 Pending。這就像你到停車場找車位，車位都滿了，你只能在那邊等。

在 Pending 這個 phase 裡面，你常常會在 kubectl 的 STATUS 欄看到 ContainerCreating。這時候那個 Node 上面的 kubelet 收到了指令，開始拉取 Docker Image，然後建立容器。如果 Image 很大，或者網路比較慢，這個階段可能會花一點時間。一般來說幾秒到幾十秒不等。

Image 拉完了、容器建好了、程式跑起來了，Pod 就會變成 Running。這是我們最想看到的狀態，代表一切正常。

如果容器裡面跑的是一次性的任務，比如一個資料庫遷移腳本或者一個定時批次處理的程式，它跑完之後會正常退出。這時候 Pod 的狀態會變成 Succeeded，表示「任務完成了，正常結束」。如果程式跑到一半 crash 了，或者退出碼不是零，Pod 就會變成 Failed。

所以如果你先記高層 phase，可以先抓 Pending、Running、Succeeded、Failed。ContainerCreating 比較像是 Pending 階段裡，kubectl 常會顯示給你的過程提示。很好理解對吧？

但是真正讓你頭痛的，不是這些正常狀態，而是幾個「錯誤狀態」。我們來一個一個看。

第一個叫 ErrImagePull。這個很直白，就是「拉 Image 失敗了」。最常見的原因就是 Image 名字打錯了。比如你想跑 nginx，但不小心打成了 ngin，少了一個 x。Docker Hub 上找不到叫 ngin 的 Image，K8s 拉不到，就會報 ErrImagePull。其他原因還有：Image tag 不存在，比如你寫了 nginx:99.99，但根本沒有 99.99 這個版本；或者 Image 在私有的 Registry 裡面，但你沒有設定認證資訊，K8s 沒有權限去拉。

ErrImagePull 出現之後，K8s 不會就此放棄。它會過一段時間再試一次。如果再失敗，狀態就會變成 ImagePullBackOff。BackOff 的意思是「退避」，就是每次重試的間隔會越來越長。第一次失敗馬上重試，再失敗等幾秒鐘，再失敗等更久。所以你會看到狀態在 ErrImagePull 和 ImagePullBackOff 之間反覆切換，但重試的間隔越來越長。

第二個錯誤狀態叫 CrashLoopBackOff。這個比 ImagePullBackOff 更讓人頭痛。它的意思是：Image 拉到了，容器也建好了，程式也啟動了，但是程式一啟動就 crash 了。K8s 發現容器掛了，就自動幫你重啟。重啟之後程式又 crash 了，K8s 又重啟，又 crash，形成一個無限循環。

但 K8s 很聰明，它不會無限快速重試。它採用一個指數退避的策略：第一次 crash 之後等 10 秒再重啟，第二次等 20 秒，第三次等 40 秒，第四次等 80 秒，以此類推，一直到最長 5 分鐘封頂。所以如果你看到一個 Pod 一直是 CrashLoopBackOff，你會發現 RESTARTS 的數字越來越大，但每次重啟之間的等待時間也越來越長。等了半天什麼都沒發生，那是因為它在退避等待中。

CrashLoopBackOff 常見的原因包括：程式碼有 bug，啟動就報錯退出了；設定檔有問題，程式讀不到必要的設定；依賴的服務連不上，比如資料庫的連線字串寫錯了；或者 command 寫錯了，比如你在 YAML 裡面指定了一個不存在的指令。

好，狀態都認識了，碰到問題該怎麼辦？這裡我要教大家一套排錯的流程，我叫它「排錯三兄弟」，因為你幾乎每次排錯都會用到這三個指令。

第一步，kubectl get pods。先看狀態。你得先知道 Pod 是什麼狀態，才能判斷大方向。看到 ImagePullBackOff，你就知道是 Image 的問題。看到 CrashLoopBackOff，你就知道是程式的問題。看到 Pending，你就知道可能是資源不夠。

第二步，kubectl describe pod 加上 Pod 的名字。describe 會列出這個 Pod 的所有詳細資訊，但你重點看最下面的 Events 區塊。Events 會按照時間順序告訴你 K8s 做了什麼事情、發生了什麼錯誤。如果是 ImagePullBackOff，Events 裡面會清楚寫著 Failed to pull image，還會告訴你具體的錯誤訊息，比如 manifest unknown 代表找不到這個 Image，比如 unauthorized 代表沒有權限。Events 是你排錯的時候最重要的資訊來源，90% 的問題在 Events 裡面就能找到線索。

第三步，kubectl logs 加上 Pod 的名字。如果 Pod 的 Image 拉成功了、容器也建好了，但是程式跑起來就 crash，那問題出在程式本身。這時候你需要看容器的日誌，看程式到底報了什麼錯。logs 就對應 Docker 的 docker logs，把容器裡面程式輸出到 stdout 和 stderr 的內容全部列出來。如果你看到一堆 Java 的 Exception Stack Trace，或者 Python 的 Traceback，那原因就在裡面了。

這三步，先 get pods 看狀態、再 describe pod 看 Events、最後 logs 看日誌，養成習慣，以後碰到任何 Pod 的問題，你都從這三步開始。

最後補充一個進階指令。有時候容器根本沒有跑起來過，logs 就完全是空的，什麼都看不到。這時候你可以試試 kubectl get events，後面加上 --sort-by=.metadata.creationTimestamp，它會列出叢集裡面最近發生的所有事件，按時間排序。有時候問題不是出在 Pod 本身，而是出在更底層，比如 Node 的磁碟滿了、Node 的狀態異常了，這些資訊在 Pod 的 describe 裡面可能看不到，但在叢集的 events 裡面會有。不過大部分情況下，排錯三兄弟就夠用了。

好，概念全部講完了。你現在知道了 Pod 有哪些狀態、每個狀態代表什麼意思、碰到錯誤狀態該怎麼一步一步排查。接下來我們就來實戰，我會帶大家故意製造錯誤，然後用排錯三兄弟一步一步找到原因、修好它。

---

# 影片 4-13：排錯實戰（實作示範，~15min）

## 本集重點

- 故意建一個「壞的」Pod（Image 名字拼錯）
- 觀察 ErrImagePull / ImagePullBackOff 狀態
- 用 describe pod 找到原因
- 用 --watch 持續觀察狀態變化
- 修正方法 1：delete + 改 YAML + apply（推薦）
- 修正方法 2：kubectl edit（講限制，建議養成改檔案的習慣）
- 第二個錯誤：CrashLoopBackOff（command 寫錯）
- 用 logs 看程式輸出
- 完整排錯流程實作

## 逐字稿

好，上一支影片我們學了 Pod 的各種狀態，也認識了排錯三兄弟。你可能會覺得，概念我都懂了，但實際碰到問題的時候真的能用上嗎？這支影片我們就來驗證一下。我要故意把 Pod 搞壞，然後帶你一步一步排查、修復。

請大家打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。如果你的 minikube 不知道什麼時候停了，先 minikube status 確認一下，沒在跑的話 minikube start 重新啟動。

好，我們先來製造第一個錯誤。建一個新的 YAML 檔案，叫 pod-broken.yaml。內容跟之前的 pod.yaml 很像，但是有一個地方我故意打錯。大家看 image 那一行，我寫的是 ngin，不是 nginx，少了一個 x。

這個 YAML 是 apiVersion v1，kind Pod，metadata 底下 name 寫 broken-pod，labels 底下 app 寫 broken。spec 底下 containers 列表，name 寫 broken，image 寫 ngin，ports 底下 containerPort 80。就這樣，其他都跟之前一模一樣，只有 image 名字是錯的。

存檔之後，部署它。輸入 kubectl apply -f pod-broken.yaml。

K8s 會回覆你 pod/broken-pod created。看起來好像成功了對吧？這裡要特別注意，kubectl apply 的 created 只代表 K8s 收到了你的請求並且記錄下來了，不代表 Pod 真的跑起來了。K8s 是非同步的，它先記錄你要什麼，然後在背景慢慢去做。所以 created 不等於 running。

馬上來看狀態。輸入 kubectl get pods。

你應該會看到 broken-pod 的 STATUS 欄位不是 Running，而是 ErrImagePull。如果你等幾秒鐘再看一次，可能會變成 ImagePullBackOff。這就是我們上一支影片講的，K8s 拉不到你指定的 Image，第一次失敗是 ErrImagePull，之後進入退避重試就變成 ImagePullBackOff。

我們用 --watch 來持續觀察。輸入 kubectl get pods --watch。

你會看到畫面不會回到命令列，它會停在那裡，每當 Pod 的狀態有變化就會多印一行。你會看到狀態在 ErrImagePull 和 ImagePullBackOff 之間來回切換。觀察個十幾二十秒，感受一下這個退避的節奏，然後按 Ctrl+C 停止。

好，排錯三兄弟第一步 get pods 做完了，我們知道是 Image 相關的問題。接下來第二步，用 describe 看詳細資訊。輸入 kubectl describe pod broken-pod。

輸出會很長，不要慌。直接拉到最下面，找 Events 區塊。你會看到幾行事件紀錄。先是 Scheduled，表示 K8s 已經把這個 Pod 分配到了 minikube 這個 Node 上。然後就是關鍵的一行：Failed to pull image "ngin"，後面會接一個錯誤訊息，可能是 rpc error 加上 manifest unknown，也可能是 repository does not exist。不管具體措辭怎麼寫，重點就是告訴你：ngin 這個 Image 找不到。

你看，Events 直接告訴你問題在哪裡了。Image 名字打錯了，ngin 不存在，應該是 nginx。

現在來修正它。我推薦的做法是先刪掉有問題的 Pod，改好 YAML 之後重新 apply。

第一步，刪掉。輸入 kubectl delete pod broken-pod。等它顯示 deleted。

第二步，打開 pod-broken.yaml，把 image 那一行的 ngin 改成 nginx:1.27。記得加上版本號，養成好習慣。存檔。

第三步，重新部署。輸入 kubectl apply -f pod-broken.yaml。

第四步，確認。輸入 kubectl get pods。這次 STATUS 應該會變成 Running 了。如果是 ContainerCreating，等幾秒鐘再看。看到 Running，恭喜你，第一個排錯成功了。

你可能會問，有沒有不用刪掉就能修的方法？有的。K8s 有一個指令叫 kubectl edit pod broken-pod，它會打開一個編輯器，讓你直接修改正在跑的 Pod。但是我要特別說明一下它的限制。Pod 的大部分欄位是不可變的，意思是 Pod 建好之後就不能改了。image 這個欄位剛好可以改，但是很多其他欄位改了 K8s 會拒絕。而且更重要的是，你用 edit 改的東西不會反映到你的 YAML 檔案裡面。你的 pod-broken.yaml 裡面還是寫著 ngin，下次你 apply 這個檔案的時候，同樣的錯誤又會出現。所以我強烈建議養成一個好習慣：永遠修改 YAML 檔案，然後重新 apply。不要依賴 kubectl edit。

好，第一個錯誤我們修好了。在繼續之前先清理一下，kubectl delete pod broken-pod。

現在來製造第二個錯誤，這次我們要觸發 CrashLoopBackOff。建一個新檔案叫 pod-crash.yaml。apiVersion v1，kind Pod，metadata 底下 name 寫 crash-pod。spec 底下 containers 列表，name 寫 crash-test，image 寫 nginx:1.27。到這裡都沒問題，但是我要加一個 command 欄位，寫成中括號裡面放三個元素："/bin/sh" 逗號 "-c" 逗號 "exit 1"。

這個 command 的意思是：容器啟動之後，不要執行 nginx 的預設指令，而是啟動一個 shell 然後執行 exit 1。exit 1 代表立刻以錯誤狀態退出。這裡要注意一個細節，exit 是一個 shell 內建指令，它不是一個獨立的可執行檔，你不能直接寫 command 中括號 "exit" 逗號 "1"，那樣 K8s 會去找一個叫 exit 的執行檔，結果找不到就會報錯。所以我們要用 /bin/sh -c 的方式來包一層，讓 shell 去執行 exit 1。Image 是對的、容器可以正常建立，但是程式一啟動就退出了。

存檔，然後 kubectl apply -f pod-crash.yaml。

等幾秒鐘，kubectl get pods。你會看到 crash-pod 的 STATUS 是 CrashLoopBackOff，RESTARTS 欄位可能已經是 1 或 2 了。

我們來走一次排錯流程。第一步 get pods 已經看了，狀態是 CrashLoopBackOff。第二步，kubectl describe pod crash-pod，看 Events。你會看到 Started，然後很快就看到 Back-off restarting failed container。K8s 在告訴你：容器啟動了但又退了，我在做退避重啟。

第三步，kubectl logs crash-pod。因為容器一啟動就 exit 了，日誌可能是空的，什麼都沒有。這是正常的，因為程式根本沒有產生任何輸出就退出了。但是在真實的場景中，如果你的 Java 程式啟動就 crash，logs 裡面通常會有 Exception 的堆疊資訊，那就是你排錯的關鍵線索。

如果 logs 是空的，你可以試試 kubectl logs crash-pod --previous。--previous 的意思是「看上一個已經結束的容器的日誌」。因為 K8s 一直在重啟容器，current 的容器可能剛建好還沒有任何日誌，但上一個 crash 掉的容器可能有留下一些東西。

好，現在如果你持續用 kubectl get pods 觀察，你會看到 RESTARTS 的數字越來越大，但每次重啟之間的間隔也越來越長。第一次等 10 秒，第二次 20 秒，第三次 40 秒。你可以感受一下這個退避的節奏。等到後面可能要等幾分鐘才會重啟一次。

清理一下，kubectl delete pod crash-pod。

好，我們來整理一下今天學到的排錯流程。不管碰到什麼問題，先用 get pods 看狀態。如果是 ImagePullBackOff，用 describe 看 Events，找 Image 相關的錯誤訊息。如果是 CrashLoopBackOff，先 describe 看 Events 確認是程式 crash，然後用 logs 看程式的輸出。describe 解決「為什麼啟動不了」的問題，logs 解決「為什麼啟動了又掛了」的問題。

這個排錯流程你要練到變成反射動作。以後不管是開發環境還是生產環境，碰到 Pod 有問題，第一反應就是跑這三個指令。用得越多，排錯速度就越快。

接下來給大家兩個練習題，讓你自己動手體驗一下排錯的完整過程。

## 學員實作題目

**題目一：修復 YAML 縮排錯誤（基礎）**

- 建一個 Pod YAML 檔案，但故意把 image 那一行的縮排少打兩個空格，讓它跟 name 不對齊（也就是讓 image 跟 containers 同一層）
- 用 `kubectl apply -f` 部署，觀察報什麼錯
- 仔細閱讀錯誤訊息，通常會提到 `error parsing` 或 `could not find expected key`
- 修正縮排，讓 image 跟 name 對齊（都在容器定義底下，空六格）
- 重新 apply，確認 Pod 變成 Running
- 進容器用 `cat /usr/local/apache2/htdocs/index.html` 確認（如果你用 httpd 的話），或者用 port-forward 從瀏覽器驗證
- 做完記得清理

**題目二：觀察 CrashLoopBackOff 退避策略（進階觀察）**

- 建一個 Pod，image 寫 nginx:1.27，但加上 `command: ["/bin/sh", "-c", "exit 1"]`
- 觀察 CrashLoopBackOff 狀態
- 用 `kubectl logs` 看輸出（會是空的，想想為什麼？）
- 用 `kubectl get pods --watch` 持續觀察 RESTARTS 欄位的變化
- 感受退避間隔：10s → 20s → 40s → ...
- 觀察完記得清理

---

# 影片 4-14：回頭操作 Loop 1（回頭操作，~6min）

## 本集重點

- 從零帶做一遍排錯流程（給沒跟上的學員看）
- 常見坑：Image 名字大小寫、private registry 沒權限、tag 不存在
- 確認學員都成功修好了
- 銜接下一個 Loop

## 逐字稿

好，回頭操作時間。這段影片是給前面沒跟上的同學補做用的，已經做完的同學可以試試後面我會提到的探索建議。

大家跟著螢幕上的步驟走。打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。

第一個排錯練習：Image 名字拼錯。建一個 pod-broken.yaml，內容就是一個普通的 Pod，但 image 故意寫成 ngin，少一個 x。存檔之後 kubectl apply -f pod-broken.yaml。然後跑排錯三兄弟：kubectl get pods 看到 ImagePullBackOff，kubectl describe pod broken-pod 拉到 Events 看到 Failed to pull image "ngin"，原因就找到了。刪掉它，把 image 改成 nginx:1.27，重新 apply，確認 Running。

整個排錯流程六步驟：apply、get pods 看狀態、describe 看原因、刪掉、改 YAML、重新 apply。這個流程要練到變成反射動作。

第二個排錯練習：CrashLoopBackOff。建一個 pod-crash.yaml，image 用 nginx:1.27 但加上 command 中括號 "/bin/sh" 逗號 "-c" 逗號 "exit 1"。apply 之後觀察狀態變成 CrashLoopBackOff，RESTARTS 數字一直增加。用 logs 看，可能是空的，因為程式還沒來得及輸出就退出了。這時候可以試試 kubectl logs crash-pod --previous 看上一個已結束容器的日誌。觀察完之後 kubectl delete pod crash-pod 清理。

好，來聊幾個補充提醒。Image 名字永遠用小寫，Docker Hub 上的 Image 名字全部是小寫的。Image tag 要確認存在，可以去 Docker Hub 網站搜尋。記住幾個常用的就好：nginx 用 1.27，httpd 用 2.4，busybox 用 1.36。

做完的同學，給你們一個探索建議。試試看故意把 YAML 的 kind 欄位打錯，比如寫成 Podd，看看 K8s 會報什麼錯誤訊息。再試試看把 apiVersion 從 v1 改成 v2，觀察不同的錯誤訊息長什麼樣。這些練習可以幫助你更熟悉各種錯誤訊息的格式，以後在生產環境碰到的時候就不會慌。

確認環境清乾淨了之後，我們就進入下一個 Loop。上午我們在講 Pod 概念的時候有提到，一個 Pod 裡面可以放多個容器，最經典的模式叫 Sidecar。當時我說下午會帶大家實際做一個。現在就是那個時候了。我們馬上來看多容器 Pod 是怎麼運作的。

---

# 影片 4-15：多容器 Pod + Sidecar 模式（概念，~15min）

## 本集重點

- 問題驅動：「nginx 產生了日誌，但我想把日誌收集到別的地方，怎麼辦？」
- 一個 Pod 可以放多個容器，共享網路和儲存
- Sidecar 模式比喻：摩托車 + 邊車
- 常見 Sidecar 用途：日誌收集、代理、監控
- 多容器 vs 多 Pod 判斷標準：拿掉一個，另一個還能不能活
- 對照 Docker Compose 的 shared volume

## 對照表

| | 多容器 Pod | 多個獨立 Pod |
|:---|:---|:---|
| 何時用 | 容器之間緊密耦合 | 容器獨立運作 |
| 網路 | 共享 IP，用 localhost 互連 | 各自有 IP |
| 擴縮容 | 一起擴一起縮 | 獨立擴縮 |
| 生命週期 | 一起生一起死 | 各自獨立 |
| 舉例 | nginx + log collector | nginx + mysql |
| 判斷標準 | 拿掉一個，另一個就沒意義了 | 拿掉一個，另一個還能活 |

## 逐字稿

好，接下來我們要進入一個新的主題。上午我們講 Pod 概念的時候有提到，一個 Pod 可以放多個容器。當時只是簡單帶過，說下午會深入講。現在就來好好聊聊這件事。

我先問大家一個問題。你跑了一個 nginx 容器，它對外提供 Web 服務。nginx 每收到一個請求，就會在 /var/log/nginx/access.log 這個檔案裡記錄一行日誌。現在老闆說：「我要把這些日誌即時收集起來，送到我們的集中式日誌系統去，方便分析和監控。」你會怎麼做？

用 Docker 的話，你可能會想：那就再跑一個容器嘛，讓它讀 nginx 的日誌檔案，然後轉發出去。兩個容器之間用一個 shared volume 來共享檔案。在 Docker Compose 裡面，你可能會這樣寫：兩個 service，一個 nginx，一個 log-collector，它們掛載同一個 volume。

在 K8s 裡面，這個需求可以用多容器 Pod 來實現。你把 nginx 和 log-collector 放在同一個 Pod 裡面，它們共享一個 volume。nginx 把日誌寫進去，log-collector 讀出來。概念跟 Docker Compose 的做法一模一樣，只是在 K8s 裡面它們被包在同一個 Pod 裡面。

這種模式有一個專門的名字，叫 Sidecar 模式。Sidecar 就是「邊車」的意思。你知道那種二戰時期的摩托車嗎？主駕駛旁邊掛了一個小車廂，可以坐一個副手。Sidecar 模式就是這個概念：主容器是摩托車，負責核心業務；輔助容器是邊車，負責額外的功能。邊車不是主角，但它讓主角的工作更完整。

同一個 Pod 裡面的多個容器有兩個非常重要的共享特性。

第一個是共享網路。同一個 Pod 裡面的所有容器，用的是同一個 IP 位址。它們之間可以用 localhost 互相通訊。也就是說，如果 nginx 監聽 80 port，旁邊的 Sidecar 容器可以直接 curl localhost:80 來連它，不需要知道任何 IP。這就像兩個人住在同一間房子裡，你要找室友不用打電話，直接喊一聲就行。

第二個是共享儲存。同一個 Pod 裡面的容器可以掛載同一個 Volume，讀寫同一批檔案。nginx 把日誌寫到 /var/log/nginx/access.log，Sidecar 容器也可以掛載同一個目錄，去讀同一個檔案。這就是日誌收集 Sidecar 能運作的基礎。

說到共享儲存，這裡我先提一個東西叫 emptyDir。K8s 提供了一種最簡單的 Volume 類型，就叫 emptyDir。它就是一個臨時的空目錄。Pod 建立的時候這個目錄自動出現，Pod 刪除的時候自動消失。你可以把它想成兩個容器之間的共用資料夾。不需要額外設定什麼儲存裝置，K8s 會自動幫你管理。我們等一下實作的時候就會用 emptyDir 來讓 nginx 和 Sidecar 容器共享日誌檔案。

在實際的生產環境中，Sidecar 模式非常常見。最典型的三種用途是：

第一種，日誌收集。主容器寫日誌，Sidecar 用 Fluentd 或 Filebeat 把日誌收集起來，送到 Elasticsearch 或者其他日誌系統。這是最經典的 Sidecar 用法。

第二種，流量代理。像 Istio 的 Service Mesh 就是用這種模式。它會在你的每一個業務 Pod 裡面自動注入一個 Envoy Proxy 的 Sidecar 容器，所有進出主容器的流量都會經過這個 Proxy。Proxy 可以幫你做流量控制、加密、監控，而且主容器完全不用改任何程式碼。

第三種，監控指標收集。有些應用程式不方便直接暴露 Prometheus 格式的監控指標，你就可以在旁邊放一個 Prometheus Exporter 的 Sidecar，它負責從主程式收集資料，然後轉換成 Prometheus 可以抓取的格式。

好，這裡有一個很重要的問題：什麼時候應該用多容器 Pod，什麼時候應該用多個獨立的 Pod？

這個判斷標準其實很簡單。你就問自己一個問題：如果我把其中一個容器拿掉，另一個容器還能不能正常工作？

拿 nginx 和日誌收集器來說。如果你把日誌收集器拿掉，nginx 還是可以正常服務 Web 請求，只是日誌沒人收了。反過來，如果你把 nginx 拿掉，日誌收集器就完全沒事做了，因為沒有日誌可以收。它們是緊密耦合的，日誌收集器的存在完全依附於 nginx。所以適合放在同一個 Pod。

再拿 nginx 和 MySQL 來說。如果你把 MySQL 拿掉，nginx 可能少了資料庫但還可以服務靜態頁面。如果你把 nginx 拿掉，MySQL 還是可以被其他服務存取。它們是相對獨立的。更重要的是，nginx 可能需要擴展到 5 個副本，但 MySQL 不需要跟著擴。如果它們在同一個 Pod 裡，nginx 擴到 5 個，MySQL 也會跟著變成 5 個，這完全不是你想要的。所以 nginx 和 MySQL 應該放在不同的 Pod 裡面。

大家看一下螢幕上的對照表。多容器 Pod 裡面的容器是共享 IP、一起擴縮、一起生死的。多個獨立 Pod 是各自有 IP、獨立擴縮、各自生死的。用哪個取決於你的容器之間是緊密耦合還是鬆散耦合。

在大多數情況下，最佳實踐還是一個 Pod 一個容器。只有當你確實需要共享網路或共享儲存的時候，才考慮多容器 Pod。如果你不確定要不要放在一起，那就先分開放，之後有需要再合併。分開放永遠是比較安全的選擇。

好，概念都講清楚了。接下來我們就動手來做一個 Sidecar Pod。

---

# 影片 4-16：Sidecar Pod 實作（實作示範，~15min）

## 本集重點

- 寫 pod-sidecar.yaml：nginx + busybox
- 逐段解釋 YAML：兩個 containers、volumeMounts、volumes（emptyDir）
- busybox 的 command：while 等待 + tail -f（race condition 處理）
- 對照 Docker Compose 的 shared volume
- apply → get pods → 看 READY 2/2
- kubectl exec -c nginx → 裝 curl → curl localhost 三次
- kubectl logs -c log-reader → 看到三次 access log
- 清理

## 逐字稿

好，上一支影片我們講了多容器 Pod 和 Sidecar 模式的概念。現在來動手做一個。我們要建一個 Pod，裡面放兩個容器：一個 nginx 負責服務 Web 請求並寫入 access log，一個 busybox 負責即時讀取 nginx 的 access log。它們透過一個共享的 Volume 來傳遞日誌檔案。

打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。建一個新檔案叫 pod-sidecar.yaml。這個 YAML 比之前寫過的都要長一些，但不要怕，我帶你一段一段看。

最上面跟之前一樣，apiVersion v1，kind Pod，metadata 底下 name 寫 sidecar-pod，labels 底下 app 寫 sidecar-demo。

重點在 spec 裡面。spec 底下的 containers 列表這次有兩個項目。我把完整的 YAML 內容念一遍，大家跟著打。

第一個容器就是我們的主角 nginx。name 寫 nginx，image 寫 nginx:1.27，ports 底下 containerPort 80，跟之前一樣。但是多了一個新東西叫 volumeMounts。volumeMounts 是一個列表，裡面有一個項目：name 是 shared-logs，mountPath 是 /var/log/nginx。這行的意思是：把一個叫 shared-logs 的 Volume 掛載到容器裡面的 /var/log/nginx 這個路徑。

這裡有一個技術細節值得說明。nginx 官方 Image 預設會把 access.log 做一個 symlink 指向 /dev/stdout，把 error.log 做一個 symlink 指向 /dev/stderr。這樣 nginx 的日誌就會直接輸出到容器的標準輸出，方便你用 kubectl logs 來看。但是當我們掛載 emptyDir 到 /var/log/nginx 之後，這個掛載會覆蓋掉原本目錄裡的所有內容，包括那兩個 symlink。覆蓋之後，nginx 找不到 symlink 了，就會直接在 /var/log/nginx 這個目錄下建立真正的檔案來寫入日誌。這正是我們想要的效果。Sidecar 容器就可以從這個目錄讀到真正的日誌檔案了。

第二個容器就是我們的 Sidecar。name 寫 log-reader，image 寫 busybox:1.36。busybox 是一個超級小的 Linux 工具箱，什麼 ls、cat、tail、grep 都有，只有幾 MB 大小，非常適合拿來做這種輔助容器。

busybox 有一個 command 欄位。這個 command 對應的就是 Docker 裡面的 entrypoint，是容器啟動之後要執行的指令。command 是一個陣列，第一個元素是 /bin/sh，第二個是 -c，第三個是整個 shell 指令。這串 shell 指令的完整內容是：while 中括號空格驚嘆號空格 -f /var/log/nginx/access.log 空格中括號 分號 do sleep 1 分號 done 分號 tail -f /var/log/nginx/access.log。我再念一遍重點部分：while 迴圈檢查 access.log 是不是存在，不存在就 sleep 1 秒，存在了就執行 tail -f 持續追蹤。

你可能會問：為什麼要加那個 while 迴圈等待？為什麼不直接 tail -f 就好？原因是同一個 Pod 裡面的多個容器是同時啟動的，K8s 不保證哪個容器先跑起來。如果 busybox 比 nginx 更早啟動，那時候 access.log 還不存在，tail -f 會直接報錯說找不到檔案，然後容器就 crash 了。加上 while 迴圈等待，就可以確保不管啟動順序如何，busybox 都能正確地等到日誌檔案出現再開始追蹤。這是多容器 Pod 裡面非常常見的一個 race condition 問題，你要記住這個處理技巧。

busybox 也有 volumeMounts，掛載的是同一個 shared-logs Volume，路徑也是 /var/log/nginx。這樣 nginx 寫的檔案，busybox 就能讀到。

最後是 spec 最底下的 volumes 區塊。這裡定義了 shared-logs 這個 Volume。型態是 emptyDir，就是一個空目錄。emptyDir 會在 Pod 建立的時候自動建立，Pod 刪除的時候自動消失。這是最簡單的 Volume 類型，非常適合用在這種臨時共享資料的場景。

對照一下 Docker Compose 的寫法。在 Docker Compose 裡面，你會在 services 底下定義兩個 service，各自掛載同一個 named volume，然後在最下面的 volumes 區塊定義這個 volume。K8s 的 YAML 邏輯是完全一樣的：在 containers 裡面用 volumeMounts 指定掛載點，在 volumes 裡面定義 Volume。只是語法不一樣，概念是一樣的。

好，YAML 寫完了，存檔。部署它，kubectl apply -f pod-sidecar.yaml。

看到 created 之後，馬上 kubectl get pods。

注意看 READY 欄位。之前我們的 Pod 都是顯示 1/1，一個容器裡面有一個準備好了。這次你應該會看到 2/2。2/2 的意思是：這個 Pod 裡面有 2 個容器，2 個都已經準備好了。如果你看到 1/2，表示有一個容器還沒 Ready，可能 Image 還在拉，等幾秒鐘再看。

看到 2/2 Running 就代表兩個容器都在正常跑了。

接下來我們來製造一些流量，讓 nginx 產生 access log。我們要進到 nginx 容器裡面自己 curl 自己。

輸入 kubectl exec -it sidecar-pod -c nginx -- /bin/sh。

注意這裡多了一個 -c nginx。上午我們進單容器 Pod 的時候，不需要指定容器名字，因為只有一個容器，K8s 知道你要進哪個。但現在 Pod 裡面有兩個容器，你必須用 -c 參數告訴 K8s 你要進哪一個。-c 是 --container 的縮寫。如果你忘了 -c，K8s 會跟你說「Pod 裡面有多個容器，請指定要進哪一個」，然後列出所有容器的名字讓你選。

進去之後，我們需要 curl 來產生請求。nginx 官方 Image 沒有預裝 curl，所以先裝一下：輸入 apt-get update 然後 apt-get install -y curl，大概十秒鐘就好了。裝好之後，連打三次 curl localhost。每一次你都會看到 nginx 的歡迎頁面。更重要的是，每一次 curl 都會在 access.log 裡面產生一行日誌。

然後 exit 離開 nginx 容器。

現在是最精彩的部分。我們來看 Sidecar 容器有沒有收到這些日誌。

輸入 kubectl logs sidecar-pod -c log-reader。

你應該會看到三行 access log，每一行就是你剛才 curl 產生的請求紀錄。裡面有請求的時間、HTTP 方法、路徑、狀態碼、回應大小這些資訊。

你看，nginx 把日誌寫到了 /var/log/nginx/access.log，busybox 透過共享的 Volume 讀到了同一個檔案，然後用 tail -f 即時追蹤輸出到自己的 stdout。你用 kubectl logs 看到的就是 busybox 的 stdout。

這就是 Sidecar 模式的精髓。主容器負責業務邏輯，Sidecar 容器負責輔助功能。兩者透過共享的 Volume 協同工作，但各自的職責非常清楚。在真實的生產環境中，Sidecar 容器不會只是 tail -f，它會用 Fluentd 或 Filebeat 把日誌轉發到 Elasticsearch 或者 CloudWatch 之類的集中式日誌系統。但原理是完全一樣的。

你也可以對比看看 nginx 容器自己的日誌。輸入 kubectl logs sidecar-pod -c nginx。你會看到 nginx 的啟動訊息，以及同樣的 access log 資訊。不過要注意，nginx 的 stdout 日誌和它寫到檔案裡的日誌格式可能稍有不同。Sidecar 讀的是檔案裡的日誌，這是兩個不同的輸出管道。

好，實作完成了。清理一下，kubectl delete pod sidecar-pod。

接下來給大家兩個練習題，讓你用不同的 Image 試試看 Sidecar 模式。

## 學員實作題目

**題目一：httpd + busybox 的 Sidecar Pod（基礎）**

- 建一個 Pod，主容器是 httpd:2.4，Sidecar 是 busybox:1.36
- busybox 用 `tail -f` 追蹤 httpd 的 access log
- 注意兩個差異：
  - httpd 的日誌目錄是 `/usr/local/apache2/logs`，Volume 的 mountPath 要改成這個路徑
  - httpd 的 access log 檔名是 `access_log`（用底線不是點），不是 `access.log`
  - 所以 busybox 的 tail -f 路徑要寫 `/usr/local/apache2/logs/access_log`
- 跟 nginx 一樣，掛載 emptyDir 到 httpd 的日誌目錄會覆蓋預設的 symlink，httpd 就會真正寫檔案
- 驗證：用 `kubectl exec -c httpd` 進容器，httpd 也沒有預裝 curl，用 `apt-get update && apt-get install -y curl` 裝好後 `curl localhost` 三次（或者 exit 出來用 `kubectl port-forward` 從瀏覽器存取三次），然後 `kubectl logs -c log-reader` 看到 access log
- 做完清理

**題目二：統計日誌行數的 Sidecar（進階）**

- 修改上面的 Sidecar Pod
- 把 busybox 的 command 改成：`while true; do wc -l /usr/local/apache2/logs/access_log 2>/dev/null; sleep 5; done`
- 這個 Sidecar 每 5 秒統計一次 access log 的行數
- 用 `kubectl exec -c httpd` 進去 curl 幾次，然後 `kubectl logs -c log-reader` 觀察行數變化
- 想一想：這種 Sidecar 在什麼場景下有用？（提示：監控）

---

# 影片 4-17：回頭操作 Loop 2（回頭操作，~6min）

## 本集重點

- 從零帶做一遍 Sidecar Pod
- 常見坑：忘了 -c 參數、Volume 路徑打錯、busybox command 語法錯
- 提醒 httpd 日誌路徑不同
- 確認學員進度
- 銜接下一個 Loop

## 逐字稿

好，回頭操作時間。大家跟著螢幕上的步驟走，我快速帶一遍 Sidecar Pod 的流程。

打開終端機，確認你在 k8s-course-labs/lesson4 目錄。建一個 pod-sidecar.yaml。關鍵的結構是：spec 底下 containers 列表有兩個容器。第一個 nginx 要加 volumeMounts，name 是 shared-logs，mountPath 是 /var/log/nginx。第二個 log-reader 用 busybox:1.36，command 用 /bin/sh -c 後面接 while 迴圈等 access.log 再 tail -f，volumeMounts 也掛 shared-logs 到同一個路徑。最底下 volumes 定義 shared-logs，型態 emptyDir。

存檔之後 kubectl apply -f pod-sidecar.yaml。kubectl get pods 看到 READY 2/2 Running。然後進 nginx 容器裝 curl 再打三次 curl localhost，exit 出來。kubectl logs sidecar-pod -c log-reader 看到三行 access log 就成功了。

這裡提醒兩個最常踩的坑。第一，多容器 Pod 用 exec 或 logs 一定要加 -c 指定容器名字，不加的話 K8s 會提示你選。第二，Volume 路徑一定要跟容器實際寫日誌的路徑對上。nginx 是 /var/log/nginx，但 httpd 是 /usr/local/apache2/logs。而且 httpd 的 access log 檔名是 access_log 用底線，不是 access.log 用點。路徑對不上，Sidecar 就什麼都讀不到。

做完的同學，給你們一個探索建議。試試看把 busybox 的 command 裡面那個 while 迴圈拿掉，直接寫 tail -f /var/log/nginx/access.log，看看會發生什麼事。你會發現如果 busybox 比 nginx 先啟動，tail 會找不到檔案然後 crash。這就是我們講的 race condition 問題。加回 while 迴圈之後再 apply 一次，對比看看差異。

另外一個探索：試試看 kubectl logs sidecar-pod -c nginx，看看 nginx 容器自己的日誌。你會發現掛了 emptyDir 之後，nginx 容器的 stdout 裡面不會有 access log 了，因為 symlink 被覆蓋了，日誌改寫到了真實的檔案裡。這就是為什麼我們需要 Sidecar 來讀取日誌檔案。

好，確認環境清乾淨了就繼續。到目前為止，我們已經學了 Pod 的完整 CRUD、生命週期和排錯、以及多容器 Pod 和 Sidecar 模式。接下來我們會進入 kubectl 的進階用法和環境變數的設定，讓你的 Pod 操作更加靈活。
