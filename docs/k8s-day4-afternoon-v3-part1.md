# 第四堂下午逐字稿 v3 — 因果鏈敘事（Loop 1-2）

> 承接 4-11（上午總結，預告下午排錯 + Sidecar）
> Loop 1：Pod 生命週期 + 排錯（4-12 ~ 4-14）
> Loop 2：多容器 Pod + Sidecar（4-15 ~ 4-17）

---

# 影片 4-12：Pod 跑起來了，但狀態不是 Running？（概念，~15min）

## 本集重點

- Pod 跑起來了，但狀態不一定是 Running — 各種狀態是什麼意思？
- 生命週期：Pending → ContainerCreating → Running → Succeeded / Failed
- 常見錯誤狀態：ErrImagePull、ImagePullBackOff、CrashLoopBackOff
- CrashLoopBackOff 退避策略：10s → 20s → 40s → 80s → ... → 5min 上限
- 排錯三兄弟：get pods → describe pod → logs
- 補充：kubectl get events

| 狀態 | 意思 | 常見原因 | 第一步排錯 |
|:---|:---|:---|:---|
| `Pending` | 排隊中 | Node 資源不夠 | `describe pod` 看 Events |
| `ContainerCreating` | 容器建立中 | 拉 Image、掛 Volume | 等一下，或 `describe` |
| `Running` | 正常運行 | — | — |
| `Succeeded` | 跑完正常結束 | Job 類任務完成 | 正常 |
| `Failed` | 失敗退出 | exit code 非零 | `logs` 看原因 |
| `ErrImagePull` | 拉 Image 失敗 | 名字拼錯、tag 不存在 | `describe pod` |
| `ImagePullBackOff` | 重複拉失敗，退避中 | 同上 | `describe pod` |
| `CrashLoopBackOff` | 反覆 crash + 重啟 | 程式啟動就掛 | `logs` 看輸出 |

## 逐字稿

好，歡迎回來。上午我們完成了一件很重要的事情，從零開始寫出了第一個 Pod 的 YAML，然後做了完整的 CRUD 操作。建立、查看、進容器、刪除，整個流程跑了一遍。如果你上午的練習都有跟上，恭喜你，你已經會在 K8s 裡面跑容器了。

但是你回想一下，上午的練習有一個前提，就是我們的 YAML 是對的，Image 名字是對的，一切都很順利。Pod 一 apply 就 Running，好像理所當然。

現實工作中呢？我跟你說，現實中大概有一半的時間你都在處理各種問題。Image 名字打錯了、版本號不存在、程式啟動就 crash、設定檔少了一個欄位。你 kubectl get pods 一看，STATUS 那一欄不是 Running，而是一串你沒見過的英文，ImagePullBackOff 或者 CrashLoopBackOff。K8s 不會像你朋友一樣直接告訴你「嘿，你 Image 名字拼錯了」。它只會給你一個狀態碼，然後你得自己去查是怎麼回事。

所以這支影片我們要搞懂兩件事。第一，Pod 的各種狀態到底代表什麼意思。第二，碰到問題的時候，你該怎麼一步一步找到原因。

我們先來看 Pod 的生命週期。一個 Pod 從你 kubectl apply 開始，到最後結束，會經過好幾個狀態。你可以把它想成一個人的一天。起床、出門、上班、下班回家。Pod 也有它的「一天」。

最開始是 Pending 狀態。你執行了 kubectl apply，K8s 的 API Server 收到了你的請求，把它記錄到 etcd 裡面了，但是 Pod 還沒有被分配到任何一個 Node 上面。這時候 Scheduler 正在忙著看哪個 Node 比較適合跑這個 Pod。如果你的叢集資源很充足，Pending 的時間通常非常短，短到你根本看不到。但如果叢集裡面所有 Node 的 CPU 和記憶體都快滿了，Scheduler 找不到合適的 Node，Pod 就會一直卡在 Pending。就像你到停車場找車位，車位都滿了，你只能在那邊等。

Scheduler 找到合適的 Node 之後，Pod 進入 ContainerCreating 狀態。這時候那個 Node 上面的 kubelet 收到了指令，開始拉取 Image，然後建立容器。如果 Image 很大，或者網路比較慢，這個階段可能會花一點時間。一般來說幾秒到幾十秒不等。

Image 拉完了、容器建好了、程式跑起來了，Pod 就會變成 Running。這是我們最想看到的狀態，代表一切正常。

如果容器裡面跑的是一次性的任務，比如一個資料庫遷移腳本，或者一個定時批次處理的程式，它跑完之後會正常退出。這時候 Pod 的狀態會變成 Succeeded，表示任務完成了，正常結束。如果程式跑到一半 crash 了，或者退出碼不是零，Pod 就會變成 Failed。

這是正常的生命週期流程：Pending、ContainerCreating、Running，然後 Succeeded 或 Failed。很好理解對吧？

但是真正讓你頭痛的，不是這些正常狀態，而是幾個「錯誤狀態」。我們來一個一個看。

第一個叫 ErrImagePull。這個很直白，就是拉 Image 失敗了。最常見的原因就是 Image 名字打錯了。比如你想跑 nginx，但不小心打成了 ngin，少了一個 x。Docker Hub 上找不到叫 ngin 的 Image，K8s 拉不到，就會報 ErrImagePull。其他原因還有：Image tag 不存在，比如你寫了 nginx:99.99，但根本沒有這個版本；或者 Image 在私有的 Registry 裡面，但你沒有設定認證資訊，K8s 沒有權限去拉。

ErrImagePull 出現之後，K8s 不會就此放棄。它會過一段時間再試一次。如果再失敗，狀態就會變成 ImagePullBackOff。BackOff 這個字很重要，你以後會一直碰到它。BackOff 的意思是「退避」，就是每次重試的間隔會越來越長。第一次失敗馬上重試，再失敗等幾秒鐘，再失敗等更久。所以你會看到狀態在 ErrImagePull 和 ImagePullBackOff 之間來回切換，但重試的間隔越來越長。

第二個錯誤狀態叫 CrashLoopBackOff。這個比 ImagePullBackOff 更讓人頭痛。它的意思是：Image 拉到了，容器也建好了，程式也啟動了，但是程式一啟動就 crash 了。K8s 發現容器掛了，就自動幫你重啟。重啟之後程式又 crash，K8s 又重啟，又 crash，形成一個無限循環。Loop 就是循環的意思。

但 K8s 很聰明，它不會無限快速重試。它採用一個指數退避的策略。第一次 crash 之後等 10 秒再重啟，第二次等 20 秒，第三次等 40 秒，第四次等 80 秒，以此類推，一直到最長 5 分鐘封頂。所以如果你看到一個 Pod 一直是 CrashLoopBackOff，你會發現 RESTARTS 的數字越來越大，但每次重啟之間的等待時間也越來越長。等了半天什麼都沒發生，不是 K8s 放棄了，而是它在退避等待中。

CrashLoopBackOff 常見的原因包括：程式碼有 bug，啟動就報錯退出了；設定檔有問題，程式讀不到必要的設定；依賴的服務連不上，比如資料庫的連線字串寫錯了；或者 command 寫錯了，比如你在 YAML 裡面指定了一個不存在的指令。

好，狀態都認識了。碰到問題該怎麼辦？這裡我要教大家一套排錯的流程，我叫它「排錯三兄弟」，因為你幾乎每次排錯都會用到這三個指令。

第一步，kubectl get pods。先看狀態。你得先知道 Pod 是什麼狀態，才能判斷大方向。看到 ImagePullBackOff，你就知道是 Image 的問題。看到 CrashLoopBackOff，你就知道是程式的問題。看到 Pending，你就知道可能是資源不夠。

第二步，kubectl describe pod 加上 Pod 的名字。describe 會列出這個 Pod 的所有詳細資訊，但你重點看最下面的 Events 區塊。Events 會按照時間順序告訴你 K8s 做了什麼事情、發生了什麼錯誤。如果是 ImagePullBackOff，Events 裡面會清楚寫著 Failed to pull image，還會告訴你具體的錯誤訊息，比如 manifest unknown 代表找不到這個 Image，比如 unauthorized 代表沒有權限。Events 是你排錯的時候最重要的資訊來源，90% 的問題在 Events 裡面就能找到線索。

第三步，kubectl logs 加上 Pod 的名字。如果 Pod 的 Image 拉成功了、容器也建好了，但是程式跑起來就 crash，那問題出在程式本身。這時候你需要看容器的日誌，看程式到底報了什麼錯。logs 就對應 Docker 的 docker logs，把容器裡面程式輸出到 stdout 和 stderr 的內容全部列出來。如果你看到一堆 Java 的 Exception Stack Trace，或者 Python 的 Traceback，那原因就在裡面了。

這三步，先 get pods 看狀態、再 describe pod 看 Events、最後 logs 看日誌，養成習慣。以後碰到任何 Pod 的問題，你都從這三步開始。

最後補充一個進階指令。有時候容器根本沒有跑起來過，logs 就完全是空的。這時候你可以試試 kubectl get events，後面加上 --sort-by=.metadata.creationTimestamp。它會列出叢集裡面最近發生的所有事件，按時間排序。有時候問題不是出在 Pod 本身，而是出在更底層，比如 Node 的磁碟滿了、Node 的狀態異常了。這些資訊在 Pod 的 describe 裡面可能看不到，但在叢集的 events 裡面會有。不過大部分情況下，排錯三兄弟就夠用了。

好，概念全部講完了。你現在知道了 Pod 有哪些狀態、每個狀態代表什麼意思、碰到錯誤狀態該怎麼一步一步排查。但是光聽不練等於零。接下來我們就來實戰，我要帶大家故意製造錯誤，然後用排錯三兄弟一步一步找到原因、修好它。

---

# 影片 4-13：故意把 Pod 搞壞 — 排錯實戰（實作示範，~15min）

## 本集重點

- 故意拼錯 image → 觀察 ErrImagePull / ImagePullBackOff
- describe pod 找 Events → 看到 Failed to pull image
- --watch 持續觀察狀態變化
- 修正：delete → 改 YAML → apply（推薦）vs kubectl edit（講限制）
- 第二個錯誤：command exit 1 → CrashLoopBackOff
- logs + logs --previous
- 退避間隔觀察

## 逐字稿

好，上一支影片我們學了 Pod 的各種狀態，也認識了排錯三兄弟。概念你都懂了，但實際碰到問題的時候真的能用上嗎？這支影片我們就來驗證一下。我要故意把 Pod 搞壞，然後帶你一步一步排查、修復。

請大家打開終端機，確認你在 ~/k8s-labs 目錄下。如果你的 minikube 不知道什麼時候停了，先 minikube status 確認一下，沒在跑的話 minikube start 重新啟動。

我們先來製造第一個錯誤。建一個新的 YAML 檔案叫 pod-broken.yaml。內容跟之前的 pod.yaml 很像，但是有一個地方我故意打錯了。

這個 YAML 最上面 apiVersion 寫 v1，kind 寫 Pod，metadata 底下 name 寫 broken-pod，labels 底下 app 寫 broken。然後 spec 底下 containers 是一個列表，列表的第一個項目 name 寫 broken，重點來了，image 寫 ngin。不是 nginx，是 ngin，少了一個 x。然後 ports 底下 containerPort 80。其他都跟之前一模一樣，只有 image 名字是錯的。

存檔之後，部署它。輸入 kubectl apply -f pod-broken.yaml。

K8s 會回覆你 pod/broken-pod created。看起來好像成功了對吧？這裡要特別注意一件事。kubectl apply 回覆你 created，只代表 K8s 收到了你的請求並且記錄下來了，不代表 Pod 真的跑起來了。K8s 是非同步的，它先記錄你要什麼，然後在背景慢慢去做。所以 created 不等於 running，這個觀念很重要。

馬上來看狀態。排錯三兄弟第一步，kubectl get pods。

你應該會看到 broken-pod 的 STATUS 欄位不是 Running，而是 ErrImagePull。如果你等幾秒鐘再看一次，可能已經變成 ImagePullBackOff 了。這就是我們上一支影片講的，K8s 拉不到你指定的 Image，第一次失敗是 ErrImagePull，之後進入退避重試就變成 ImagePullBackOff。

我們用 --watch 來持續觀察。輸入 kubectl get pods --watch。

畫面不會回到命令列，它會停在那裡，每當 Pod 的狀態有變化就多印一行。你會看到狀態在 ErrImagePull 和 ImagePullBackOff 之間來回切換。觀察個十幾二十秒，感受一下這個退避的節奏，然後按 Ctrl+C 停止。

好，第一步 get pods 做完了，我們知道是 Image 相關的問題。第二步，用 describe 看詳細資訊。輸入 kubectl describe pod broken-pod。

輸出會很長，不要慌。直接拉到最下面，找 Events 區塊。你會看到幾行事件紀錄。先是 Scheduled，表示 K8s 已經把這個 Pod 分配到了 minikube 這個 Node 上。然後就是關鍵的一行：Failed to pull image "ngin"，後面會接一個錯誤訊息，可能是 rpc error 加上 manifest unknown，也可能是 repository does not exist。不管具體措辭怎麼寫，重點就是告訴你：ngin 這個 Image 找不到。

你看，Events 直接告訴你問題在哪裡了。Image 名字打錯了，ngin 不存在，應該是 nginx。排錯三兄弟到第二步就破案了。

現在來修正它。我推薦的做法是先刪掉有問題的 Pod，改好 YAML 之後重新 apply。

第一步，刪掉。kubectl delete pod broken-pod。等它顯示 deleted。

第二步，打開 pod-broken.yaml，把 image 那一行的 ngin 改成 nginx:1.27。記得加上版本號，養成好習慣。存檔。

第三步，重新部署。kubectl apply -f pod-broken.yaml。

第四步，確認。kubectl get pods。這次 STATUS 應該會變成 Running 了。如果是 ContainerCreating，等幾秒鐘再看。看到 Running，恭喜你，第一個排錯成功了。

你可能會問，有沒有不用刪掉就能修的方法？有的。K8s 有一個指令叫 kubectl edit pod broken-pod，它會打開一個編輯器讓你直接修改正在跑的 Pod。但是我要特別說一下它的限制。Pod 的大部分欄位是不可變的，意思是 Pod 建好之後就不能改了。image 這個欄位剛好可以改，但是很多其他欄位改了 K8s 會拒絕。而且更重要的是，你用 edit 改的東西不會反映到你的 YAML 檔案裡面。你的 pod-broken.yaml 裡面還是寫著 ngin，下次你 apply 這個檔案的時候，同樣的錯誤又會出現。所以我強烈建議養成一個好習慣：永遠修改 YAML 檔案，然後重新 apply。不要依賴 kubectl edit。

好，第一個錯誤修好了。先清理一下，kubectl delete pod broken-pod。

現在來製造第二個錯誤。這次我們要觸發 CrashLoopBackOff。

建一個新檔案叫 pod-crash.yaml。apiVersion v1，kind Pod，metadata 底下 name 寫 crash-pod。spec 底下 containers 列表的第一個項目，name 寫 crash-test，image 寫 nginx:1.27。到這裡都沒問題，Image 名字是對的，一定拉得到。但是我要加一個 command 欄位。command 是一個陣列，裡面放三個字串：第一個是 "/bin/sh"，第二個是 "-c"，第三個是 "exit 1"。

這個 command 的意思是什麼？容器啟動之後，不要執行 nginx 的預設指令，而是啟動一個 shell 然後執行 exit 1。exit 1 代表立刻以錯誤狀態退出。

這裡要注意一個細節。exit 是一個 shell 的內建指令，它不是一個獨立的可執行檔。你不能直接寫 command 陣列裡面放 "exit" 和 "1" 兩個元素，那樣 K8s 會去找一個叫 exit 的執行檔，結果找不到就會報另一種錯。所以我們要用 /bin/sh -c 的方式來包一層，讓 shell 去執行 exit 1。

好，這個 Pod 的情況是什麼呢？Image 是對的，容器可以正常建立，但是程式一啟動就退出了。K8s 會發現容器結束了，然後自動重啟，重啟之後又立刻退出，形成一個無限循環。

存檔，然後 kubectl apply -f pod-crash.yaml。

等幾秒鐘，kubectl get pods。你會看到 crash-pod 的 STATUS 是 CrashLoopBackOff，RESTARTS 欄位可能已經是 1 或 2 了。

我們來走一次完整的排錯流程。第一步 get pods 已經看了，狀態是 CrashLoopBackOff，所以問題不在 Image，而是程式本身。第二步，kubectl describe pod crash-pod，看 Events。你會看到 Started，然後很快就看到 Back-off restarting failed container。K8s 在告訴你：容器啟動了但馬上退出了，我在做退避重啟。

第三步，kubectl logs crash-pod。因為容器一啟動就 exit 了，日誌可能是空的，什麼都沒有。這是正常的，因為程式根本沒有產生任何輸出就退出了。但是在真實的場景中，如果你的 Java 程式啟動就 crash，logs 裡面通常會有 Exception 的堆疊資訊，那就是你排錯的關鍵線索。

如果 logs 是空的，你可以試試 kubectl logs crash-pod --previous。--previous 的意思是看上一個已經結束的容器的日誌。因為 K8s 一直在重啟容器，當前的容器可能剛建好還沒有任何日誌，但上一個 crash 掉的容器可能有留下一些東西。在我們這個例子裡 --previous 也是空的，因為 exit 1 本來就不會產生輸出。但這個參數在真實場景非常有用，一定要記住。

好，現在如果你持續用 kubectl get pods 觀察，你會看到 RESTARTS 的數字越來越大，但每次重啟之間的間隔也越來越長。第一次等 10 秒，第二次 20 秒，第三次 40 秒。你可以用 kubectl get pods --watch 持續觀察，感受一下這個退避的節奏。等到後面可能要等好幾分鐘才會重啟一次。這就是指數退避策略在起作用。

觀察完之後，清理一下。kubectl delete pod crash-pod。

來整理一下。不管碰到什麼問題，先用 get pods 看狀態。如果是 ImagePullBackOff，用 describe 看 Events，找 Image 相關的錯誤訊息。如果是 CrashLoopBackOff，先 describe 看 Events 確認是程式 crash，然後用 logs 看程式的輸出。describe 解決「為什麼啟動不了」的問題，logs 解決「為什麼啟動了又掛了」的問題。這個排錯流程你要練到變成反射動作。以後不管是開發環境還是生產環境，碰到 Pod 有問題，第一反應就是跑這三個指令。

接下來的回頭操作會給大家兩個練習題，讓你自己動手體驗一下排錯的完整過程。

---

# 影片 4-14：回頭操作 Loop 1 — 排錯練習（回頭操作，~6min）

## 本集重點

- 從零帶做排錯流程（給沒跟上的學員看）
- 常見坑提醒
- 學員實作題目
- 探索建議
- 銜接下一個 Loop

## 逐字稿

好，回頭操作時間。這段影片是給前面沒跟上的同學補做用的，已經做完的同學可以試試後面我會提到的探索建議。

大家跟著螢幕上的步驟走。打開終端機，確認你在 ~/k8s-labs 目錄下。

第一個排錯練習，Image 名字拼錯。建一個 pod-broken.yaml，內容就是一個普通的 Pod，但 image 故意寫成 ngin，少一個 x。存檔之後 kubectl apply -f pod-broken.yaml。然後跑排錯三兄弟：kubectl get pods 看到 ImagePullBackOff，kubectl describe pod broken-pod 拉到 Events 看到 Failed to pull image "ngin"，原因就找到了。刪掉它，把 image 改成 nginx:1.27，重新 apply，確認 Running。

整個排錯流程六步驟：apply、get pods 看狀態、describe 看原因、刪掉、改 YAML、重新 apply。這個流程要練到變成反射動作。

第二個排錯練習，CrashLoopBackOff。建一個 pod-crash.yaml，image 用 nginx:1.27 但加上 command，陣列裡面三個元素 "/bin/sh"、"-c"、"exit 1"。apply 之後觀察狀態變成 CrashLoopBackOff，RESTARTS 數字一直增加。用 logs 看，可能是空的，因為程式還沒來得及輸出就退出了。試試 kubectl logs crash-pod --previous。觀察完之後 kubectl delete pod crash-pod 清理。

這裡提醒幾個常踩的坑。第一，Image 名字永遠用小寫，Docker Hub 上的 Image 名字全部是小寫的。第二，Image tag 要確認存在，可以去 Docker Hub 網站搜尋。記住幾個常用的就好：nginx 用 1.27，httpd 用 2.4，busybox 用 1.36。第三，command 裡面要用 exit 的話，一定要用 /bin/sh -c 包起來，因為 exit 是 shell 內建指令，不是獨立的執行檔。

好，現在給大家兩個自己練的題目。

第一題，YAML 縮排錯誤排錯。建一個 Pod 的 YAML 檔案，但故意把 image 那一行的縮排少打兩個空格，讓它跟 name 不對齊。用 kubectl apply 部署，觀察 K8s 報什麼錯。仔細閱讀錯誤訊息，通常會提到 error parsing 或者 could not find expected key。修正縮排之後重新 apply，確認 Pod 變成 Running。做完記得清理。

第二題，觀察 CrashLoopBackOff 的退避策略。建一個 Pod，image 寫 nginx:1.27，加上 command 陣列 "/bin/sh"、"-c"、"exit 1"。用 kubectl get pods --watch 持續觀察 RESTARTS 欄位的變化，感受退避間隔 10 秒、20 秒、40 秒越來越長。觀察完記得清理。

做完的同學，給你們一個探索建議。試試看故意把 YAML 的 kind 欄位打錯，比如寫成 Podd，看看 K8s 會報什麼錯誤訊息。再試試看把 apiVersion 從 v1 改成 v2，觀察不同的錯誤訊息長什麼樣。這些練習可以幫助你更熟悉各種錯誤訊息的格式，以後在生產環境碰到的時候就不會慌。

好，確認環境清乾淨了之後，我們就進入下一個 Loop。上午講 Pod 概念的時候有提到過，一個 Pod 裡面可以放多個容器，最經典的用法叫 Sidecar 模式。當時只是簡單帶過，說下午會實際做一個。但在那之前，我們先搞清楚一個問題：為什麼需要在一個 Pod 裡放多個容器？什麼情況下你會需要這樣做？

---

# 影片 4-15：一個 Pod 裡面塞兩個容器？— Sidecar 模式（概念，~12min）

## 本集重點

- 問題驅動：nginx 產生日誌 → 要收集到別處 → 怎麼辦？
- 多容器 Pod：共享網路 + 共享儲存
- emptyDir：Pod 內的臨時共用資料夾
- Sidecar 模式 = 摩托車 + 邊車
- 常見用途：日誌收集、流量代理、監控
- 多容器 vs 多 Pod 判斷：拿掉一個，另一個還能不能活

| | 多容器 Pod | 多個獨立 Pod |
|:---|:---|:---|
| 何時用 | 容器之間緊密耦合 | 容器獨立運作 |
| 網路 | 共享 IP，用 localhost | 各自有 IP |
| 擴縮容 | 一起擴一起縮 | 獨立擴縮 |
| 生命週期 | 一起生一起死 | 各自獨立 |
| 舉例 | nginx + log collector | nginx + mysql |
| 判斷標準 | 拿掉一個，另一個沒意義 | 拿掉一個，另一個還能活 |

## 逐字稿

好，排錯的技能解鎖了。你現在碰到 Pod 有問題，知道該怎麼一步一步找到原因了。但是排錯的時候你一定會碰到一個東西，就是日誌。剛才我們用 kubectl logs 看容器的輸出，那是程式寫到 stdout 的日誌。但是很多應用程式的日誌不只是輸出到 stdout，它還會寫到檔案裡面。

比如 nginx。nginx 每收到一個 HTTP 請求，就會在 /var/log/nginx/access.log 這個檔案裡記錄一行日誌。你的 nginx Pod 跑在 K8s 裡面，每天產生幾十萬行日誌。現在老闆說：「我要把這些日誌即時收集起來，送到我們的集中式日誌系統去，方便分析和監控。」你會怎麼做？

最直覺的想法可能是：那就在 nginx 容器裡面再裝一個日誌收集的工具嘛。但你回想一下 Docker 的最佳實踐：一個容器只做一件事。你不會在 nginx 容器裡面同時跑 nginx 和 Fluentd，因為這樣容器變大了、職責不清楚了、出問題不好排查。

那另一個做法呢？再跑一個獨立的 Pod，讓它去讀 nginx 的日誌檔案。但是問題來了，獨立的 Pod 跟 nginx Pod 各有各的檔案系統，它怎麼讀到 nginx 的日誌檔案？你得想辦法把日誌搬出來，搞一個共享的儲存，然後兩個 Pod 都去掛載它。可以做到，但是有點大費周章。

K8s 提供了一個更優雅的方案。你可以在同一個 Pod 裡面放兩個容器。第一個容器跑 nginx，負責服務 Web 請求並寫入 access log。第二個容器跑一個日誌收集的程式，負責讀取 access log 然後轉發出去。因為它們在同一個 Pod 裡面，可以共享同一個 Volume，nginx 把日誌寫進去，收集器直接讀出來。簡單、直接、不需要額外的跨 Pod 儲存設定。

用 Docker 來對比的話，這就像 Docker Compose 裡面兩個 service 掛載同一個 volume。概念完全一樣，只是在 K8s 裡面它們被包在同一個 Pod 裡面。

這種模式有一個專門的名字，叫 Sidecar 模式。Sidecar 就是「邊車」的意思。你看過二戰電影裡那種摩托車嗎？主駕駛旁邊掛了一個小車廂，可以坐一個副手。Sidecar 模式就是這個概念：主容器是摩托車，負責核心業務；輔助容器是邊車，負責額外的功能。邊車不是主角，但它讓主角的工作更完整。

同一個 Pod 裡面的多個容器有兩個非常重要的共享特性。

第一個是共享網路。同一個 Pod 裡面的所有容器用的是同一個 IP 位址。它們之間可以用 localhost 互相通訊。如果 nginx 監聽 80 port，旁邊的 Sidecar 容器可以直接用 localhost:80 來連它。就像兩個人住在同一間房子裡，你要找室友不用打電話，直接喊一聲就行。

第二個是共享儲存。同一個 Pod 裡面的容器可以掛載同一個 Volume，讀寫同一批檔案。nginx 把日誌寫到共享 Volume 的某個目錄，Sidecar 容器掛載同一個 Volume，就能讀到同一個檔案。這就是日誌收集 Sidecar 能運作的基礎。

說到共享儲存，就要介紹一個東西叫 emptyDir。上午我們講 Volume 概念的時候提過它一句，現在要更深入一點。emptyDir 是 K8s 最簡單的 Volume 類型。它就是一個臨時的空目錄，Pod 建立的時候自動出現，Pod 刪除的時候自動消失。你可以把它想成兩個容器之間的共用資料夾。不需要額外設定什麼儲存裝置，不需要建立 PV 或 PVC，K8s 自動幫你管理。emptyDir 不適合存重要資料，因為 Pod 一刪就沒了。但它非常適合用在這種臨時共享的場景，比如主容器寫日誌，Sidecar 容器讀取日誌。等一下實作的時候就會用 emptyDir 來讓 nginx 和 Sidecar 容器共享日誌檔案。

在實際的生產環境中，Sidecar 模式非常常見。最典型的三種用途：第一種，日誌收集，就是我們剛才講的。主容器寫日誌，Sidecar 用 Fluentd 或 Filebeat 把日誌收集起來送到 Elasticsearch。第二種，流量代理，像 Istio 的 Service Mesh 就是用這種模式，每個 Pod 裡面自動注入一個 Envoy Proxy 的 Sidecar，所有流量都經過它。第三種，監控指標收集，旁邊放一個 Prometheus Exporter 的 Sidecar 收集主程式的指標。

好，這裡有一個很重要的判斷問題：什麼時候應該用多容器 Pod，什麼時候應該用多個獨立的 Pod？

判斷標準很簡單。你就問自己一個問題：如果我把其中一個容器拿掉，另一個容器還能不能正常工作？

拿 nginx 和日誌收集器來說。把日誌收集器拿掉，nginx 還是可以正常服務 Web 請求，只是日誌沒人收了。反過來，把 nginx 拿掉，日誌收集器就完全沒事做了，因為沒有日誌可以收。日誌收集器的存在完全依附於 nginx，它們是緊密耦合的。適合放在同一個 Pod。

再拿 nginx 和 MySQL 來說。把 MySQL 拿掉，nginx 還能服務靜態頁面。把 nginx 拿掉，MySQL 還能被其他服務存取。它們是相對獨立的。更重要的是，nginx 可能需要擴展到 5 個副本，但 MySQL 不需要跟著擴。如果它們在同一個 Pod 裡，nginx 擴到 5 個，MySQL 也會跟著變成 5 個，這完全不是你想要的。所以 nginx 和 MySQL 應該放在不同的 Pod。

大家看一下螢幕上的對照表。多容器 Pod 是共享 IP、一起擴縮、一起生死。多個獨立 Pod 是各自有 IP、獨立擴縮、各自生死。在大多數情況下，最佳實踐還是一個 Pod 一個容器。只有當你確實需要共享網路或共享儲存的時候，才考慮多容器 Pod。

好，概念講清楚了。接下來我們動手來做一個 Sidecar Pod，你就會知道 YAML 該怎麼寫、兩個容器怎麼協同工作。

---

# 影片 4-16：nginx + busybox Sidecar 實作（實作示範，~15min）

## 本集重點

- 完整 YAML：nginx + busybox + emptyDir
- volumeMounts / volumes 的對應關係
- busybox command：while 等待 + tail -f（race condition）
- nginx symlink 行為：emptyDir 覆蓋 → 變成真實檔案
- READY 2/2 的意思
- -c 參數指定容器
- nginx 沒預裝 curl → apt-get install

## 逐字稿

好，上一支影片我們講了多容器 Pod 和 Sidecar 模式的概念。現在來動手做一個。我們要建一個 Pod，裡面放兩個容器：一個 nginx 負責服務 Web 請求並寫入 access log，一個 busybox 負責即時讀取 nginx 的 access log。它們透過一個共享的 emptyDir Volume 來傳遞日誌檔案。

打開終端機，確認你在 ~/k8s-labs 目錄下。建一個新檔案叫 pod-sidecar.yaml。這個 YAML 比之前寫過的都要長一些，但不要怕，我帶你一段一段看。

最上面跟之前一樣，apiVersion v1，kind Pod，metadata 底下 name 寫 sidecar-pod，labels 底下 app 寫 sidecar-demo。

重點在 spec 裡面。spec 底下有兩個大區塊：containers 和 volumes。我們先看 containers。

containers 是一個列表，這次有兩個項目。第一個容器是我們的主角 nginx。name 寫 nginx，image 寫 nginx:1.27，ports 底下 containerPort 80，跟之前一樣。但是多了一個新東西叫 volumeMounts。volumeMounts 也是一個列表，裡面有一個項目：name 寫 shared-logs，mountPath 寫 /var/log/nginx。這行的意思是把一個叫 shared-logs 的 Volume 掛載到這個容器裡面的 /var/log/nginx 這個路徑。

這裡有一個技術細節值得說明。nginx 的官方 Image 預設會把 access.log 做一個 symlink 指向 /dev/stdout，把 error.log 做一個 symlink 指向 /dev/stderr。這樣 nginx 的日誌就會直接輸出到容器的標準輸出，方便你用 kubectl logs 來看。但是當我們把 emptyDir 掛載到 /var/log/nginx 之後，這個掛載會覆蓋掉原本目錄裡的所有內容，包括那兩個 symlink。覆蓋之後，nginx 找不到 symlink 了，就會直接在 /var/log/nginx 這個目錄下建立真正的檔案來寫入日誌。這正是我們想要的效果，因為 Sidecar 容器需要讀一個真實的檔案，不是 /dev/stdout。

第二個容器是我們的 Sidecar。name 寫 log-reader，image 寫 busybox:1.36。busybox 是一個超級小的 Linux 工具箱，ls、cat、tail、grep 什麼都有，只有幾 MB 大小，非常適合拿來做這種輔助容器。

busybox 有一個 command 欄位。command 對應的就是 Docker 裡面的 entrypoint，是容器啟動之後要執行的指令。command 是一個陣列，第一個元素是 /bin/sh，第二個是 -c，第三個是整個 shell 指令字串。這串 shell 指令的內容是：while 中括號 空格 驚嘆號 空格 -f /var/log/nginx/access.log 空格 中括號 分號 do sleep 1 分號 done 分號 tail -f /var/log/nginx/access.log。

我用白話翻譯一下。這個指令做了兩件事。第一件事，while 迴圈：一直檢查 access.log 這個檔案存不存在，如果不存在就等 1 秒再看。第二件事，檔案出現之後，跳出迴圈，執行 tail -f 持續追蹤這個檔案的新增內容。

你可能會問：為什麼要加那個 while 迴圈等待？為什麼不直接 tail -f 就好？原因是同一個 Pod 裡面的多個容器是同時啟動的。K8s 不保證哪個容器先跑起來。如果 busybox 比 nginx 更早啟動，那時候 access.log 還不存在，因為 nginx 還沒開始跑、還沒建立這個檔案。tail -f 一個不存在的檔案會直接報錯，說找不到檔案，然後容器就 crash 了。加上 while 迴圈等待，就可以確保不管啟動順序如何，busybox 都能安全地等到日誌檔案出現再開始追蹤。這是多容器 Pod 裡面非常常見的一個 race condition 問題。race condition 就是競爭條件，兩個東西同時跑，結果取決於誰先到，這種不確定性就叫 race condition。你要記住這個處理技巧。

busybox 也有 volumeMounts，掛載的是同一個 shared-logs Volume，mountPath 也是 /var/log/nginx。這樣 nginx 寫的檔案，busybox 就能讀到了。兩個容器掛同一個 Volume 到同一個路徑，看到的就是同一批檔案。

最後是 spec 最底下的 volumes 區塊。這裡定義了 shared-logs 這個 Volume，類型是 emptyDir 後面接一對大括號。大括號是空的，代表用預設設定，不需要額外的參數。emptyDir 就是一個空目錄，Pod 建立的時候自動建立，Pod 刪除的時候自動消失。

對照一下 Docker Compose 的寫法。在 Docker Compose 裡面，你會在兩個 service 底下各自掛載同一個 named volume，然後在最下面的 volumes 區塊定義這個 volume。K8s 的 YAML 邏輯是完全一樣的：在 containers 裡面用 volumeMounts 指定掛載點，在 volumes 裡面定義 Volume。語法不同，概念相同。

好，YAML 寫完了，存檔。部署它，kubectl apply -f pod-sidecar.yaml。

看到 created 之後，馬上 kubectl get pods。

注意看 READY 欄位。之前我們的 Pod 都是顯示 1/1，一個容器裡面有一個準備好了。這次你應該會看到 2/2。2 斜線 2 的意思是：這個 Pod 裡面有 2 個容器，2 個都已經準備好了。如果你看到 1/2，表示有一個容器還沒 Ready，可能 Image 還在拉，等幾秒鐘再看。看到 2/2 Running 就代表兩個容器都在正常跑了。

接下來我們要製造一些流量，讓 nginx 產生 access log。我們要進到 nginx 容器裡面去發請求。

輸入 kubectl exec -it sidecar-pod -c nginx -- /bin/sh。

注意這裡多了一個 -c nginx。上午我們進單容器 Pod 的時候不需要指定容器名字，因為只有一個容器，K8s 知道你要進哪個。但現在 Pod 裡面有兩個容器，你必須用 -c 參數告訴 K8s 你要進哪一個。-c 是 --container 的縮寫。如果你忘了加 -c，K8s 會跟你說 Pod 裡面有多個容器請指定要進哪一個，然後列出所有容器的名字讓你選。

進去之後，我們需要 curl 來發 HTTP 請求。但是 nginx 的官方 Image 是精簡版的，沒有預裝 curl。所以先裝一下。輸入 apt-get update，等它跑完，再輸入 apt-get install -y curl。大概十秒鐘就好了。

裝好之後，連打三次 curl localhost。每一次你都會看到 nginx 的歡迎頁面的 HTML 內容印在螢幕上。更重要的是，每一次 curl 都會在 access.log 裡面產生一行日誌。

然後 exit 離開 nginx 容器。

現在是最精彩的部分。我們來看 Sidecar 容器有沒有收到這些日誌。

輸入 kubectl logs sidecar-pod -c log-reader。

你應該會看到三行 access log，每一行就是你剛才 curl 產生的請求紀錄。裡面有請求的時間、來源 IP、HTTP 方法、路徑、狀態碼 200、回應大小這些資訊。

你看，整個流程是這樣的。nginx 收到請求，把日誌寫到 /var/log/nginx/access.log 這個檔案。busybox 透過共享的 emptyDir Volume 讀到了同一個檔案，用 tail -f 即時追蹤新增的內容，然後輸出到自己的 stdout。你用 kubectl logs -c log-reader 看到的，就是 busybox 的 stdout。

這就是 Sidecar 模式的精髓。主容器負責業務邏輯，Sidecar 容器負責輔助功能，兩者透過共享的 Volume 協同工作，但各自的職責非常清楚。在真實的生產環境中，Sidecar 容器不會只是 tail -f，它會用 Fluentd 或 Filebeat 把日誌轉發到 Elasticsearch 或者 CloudWatch 之類的集中式日誌系統。但原理是完全一樣的。

你也可以試試看 nginx 容器自己的日誌。輸入 kubectl logs sidecar-pod -c nginx。你會看到 nginx 的啟動訊息，但是不會看到 access log。為什麼？因為我們掛了 emptyDir 到 /var/log/nginx，那兩個 symlink 被覆蓋了，access log 改寫到了真實的檔案裡面，不再輸出到 stdout。所以你用 kubectl logs 看 nginx 容器，看不到 access log。這正好說明了為什麼我們需要 Sidecar 來讀取日誌檔案，因為日誌不在 stdout 上了。

好，實作完成。清理一下，kubectl delete pod sidecar-pod。

概念理解了、實作也做了。接下來的回頭操作會給你一個不同的練習，用 httpd 來做同樣的事情。httpd 的日誌路徑跟 nginx 不一樣，這是你要自己去查、去調整的地方。

---

# 影片 4-17：回頭操作 Loop 2 — Sidecar 練習（回頭操作，~6min）

## 本集重點

- 從零帶做 Sidecar Pod 流程
- 常見坑：忘了 -c、Volume 路徑打錯、busybox command 語法
- httpd 日誌路徑差異
- 探索建議
- 銜接下一個 Loop

## 逐字稿

好，回頭操作時間。大家跟著螢幕上的步驟走，我快速帶一遍 Sidecar Pod 的流程。

打開終端機，確認你在 ~/k8s-labs 目錄。建一個 pod-sidecar.yaml。YAML 的關鍵結構是這樣的。spec 底下 containers 列表有兩個容器。第一個 nginx，image nginx:1.27，加 volumeMounts，name 是 shared-logs，mountPath 是 /var/log/nginx。第二個 log-reader，image busybox:1.36，command 用 /bin/sh、-c，然後接那個 while 迴圈等 access.log 出現再 tail -f 的指令。log-reader 的 volumeMounts 也掛 shared-logs 到同一個路徑。最底下 volumes 區塊定義 shared-logs，型態 emptyDir 空大括號。

存檔之後 kubectl apply -f pod-sidecar.yaml。kubectl get pods 看到 READY 2/2 Running 就對了。然後 kubectl exec -it sidecar-pod -c nginx -- /bin/sh 進 nginx 容器，apt-get update 再 apt-get install -y curl，curl localhost 打三次，exit 出來。kubectl logs sidecar-pod -c log-reader 看到三行 access log 就成功了。做完 kubectl delete pod sidecar-pod 清理。

這裡提醒兩個最常踩的坑。第一，多容器 Pod 用 exec 或 logs 一定要加 -c 指定容器名字。不加的話 K8s 會提示你選，但你也可以養成習慣，只要 Pod 裡有多個容器就加 -c。第二，Volume 的 mountPath 一定要跟容器實際寫日誌的路徑對上。nginx 是 /var/log/nginx，路徑對不上的話 Sidecar 就什麼都讀不到。

好，現在給大家練習題。用 httpd 取代 nginx 來做同樣的 Sidecar Pod。

httpd 跟 nginx 有兩個關鍵差異。第一，httpd 的日誌目錄不是 /var/log/nginx，而是 /usr/local/apache2/logs。所以你的 volumeMounts 的 mountPath 要改成 /usr/local/apache2/logs。第二，httpd 的 access log 檔名叫 access_log，注意是底線，不是 access.log 的點。所以 busybox 的 tail -f 路徑要寫 /usr/local/apache2/logs/access_log。

其他的結構完全一樣。image 改成 httpd:2.4，containerPort 改成 80，其他不變。跟 nginx 一樣，掛載 emptyDir 到 httpd 的日誌目錄會覆蓋預設的 symlink，httpd 就會真正把日誌寫到檔案裡。驗證的方式也一樣，進 httpd 容器裝 curl，curl localhost 幾次，然後看 log-reader 的日誌有沒有出現。httpd 也沒有預裝 curl，一樣用 apt-get update 和 apt-get install -y curl 來裝。

做完的同學，給你們一個探索建議。試試看把 busybox 的 command 裡面那個 while 迴圈拿掉，直接寫 tail -f /var/log/nginx/access.log，看看會發生什麼事。你會發現如果 busybox 比 nginx 先啟動，tail 會找不到檔案然後容器 crash，Pod 的 READY 會變成 1/2，log-reader 容器進入 CrashLoopBackOff。加回 while 迴圈之後再 apply 一次，對比看看差異。這就是我們講的 race condition 問題的真實體驗。

另外一個探索。看看 kubectl logs sidecar-pod -c nginx，你會發現掛了 emptyDir 之後 nginx 容器的 stdout 裡面沒有 access log 了。再想想為什麼。答案我們剛才講過：symlink 被覆蓋了，日誌改寫到了真實的檔案裡，不再輸出到 stdout。這就是 Sidecar 存在的意義，把檔案裡的日誌收集出來。

好，確認環境清乾淨了就繼續。到目前為止我們學了 Pod 的完整 CRUD、生命週期和排錯、以及多容器 Pod 和 Sidecar 模式。接下來我們會進入 kubectl 的進階用法和環境變數的設定，讓你的 Pod 操作更加靈活。
