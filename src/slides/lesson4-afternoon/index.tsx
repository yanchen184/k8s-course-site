import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  image?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  // ============================================================
  // Loop 1：Pod 生命週期 + 排錯
  // ============================================================

  // ── 4-12 概念（1/2）：Pod 生命週期狀態流程圖 ──
  {
    title: 'Pod 生命週期狀態流程',
    subtitle: 'Pending → Running → Succeeded / Failed',
    section: 'Loop 1：Pod 生命週期 + 排錯',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">正常生命週期</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-yellow-900/40 text-yellow-300 px-3 py-1 rounded">Pending</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">ContainerCreating</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">Running</span>
            <span className="text-slate-500">→</span>
            <div className="flex flex-col gap-1">
              <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded text-center">Succeeded</span>
              <span className="bg-red-900/40 text-red-300 px-3 py-1 rounded text-center">Failed</span>
            </div>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見錯誤狀態</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">狀態</th>
                <th className="pb-2 pr-4">意思</th>
                <th className="pb-2 pr-4">常見原因</th>
                <th className="pb-2">第一步排錯</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-red-400">ErrImagePull</code></td>
                <td className="py-2 pr-4">拉 Image 失敗</td>
                <td className="py-2 pr-4">名字拼錯、tag 不存在、私有倉庫沒權限</td>
                <td className="py-2"><code>describe pod</code> 看 Events</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-red-400">ImagePullBackOff</code></td>
                <td className="py-2 pr-4">重複拉 Image 失敗（退避重試）</td>
                <td className="py-2 pr-4">同上</td>
                <td className="py-2"><code>describe pod</code> 看 Events</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-red-400">CrashLoopBackOff</code></td>
                <td className="py-2 pr-4">容器反覆 crash + 重啟</td>
                <td className="py-2 pr-4">程式 crash、設定檔錯誤、缺環境變數</td>
                <td className="py-2"><code>logs</code> 看程式輸出</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，歡迎回來。上午我們完成了一件很重要的事情，從零開始寫出了第一個 Pod 的 YAML，然後做了完整的 CRUD 操作。建立、查看、進容器、刪除，整個流程跑了一遍。如果你上午的練習都有跟上，恭喜你，你已經會在 K8s 裡面跑容器了。

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

ErrImagePull 出現之後，K8s 不會就此放棄。它會過一段時間再試一次。如果再失敗，狀態就會變成 ImagePullBackOff。BackOff 這個字很重要，你以後會一直碰到它。BackOff 的意思是「退避」，就是每次重試的間隔會越來越長。第一次失敗馬上重試，再失敗等幾秒鐘，再失敗等更久。所以你會看到狀態在 ErrImagePull 和 ImagePullBackOff 之間來回切換，但重試的間隔越來越長。 [▶ 下一頁]`,
  },

  // ── 4-12 概念（2/2）：排錯三兄弟 + CrashLoopBackOff 退避策略 ──
  {
    title: '排錯三兄弟 + 退避策略',
    subtitle: 'get pods → describe pod → logs',
    section: 'Loop 1：Pod 生命週期 + 排錯',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">排錯三兄弟（養成反射動作）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4 w-12">步驟</th>
                <th className="pb-2 pr-4">指令</th>
                <th className="pb-2 pr-4">看什麼</th>
                <th className="pb-2">解決什麼</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center text-cyan-400 font-bold">1</td>
                <td className="py-2 pr-4"><code className="text-green-400">kubectl get pods</code></td>
                <td className="py-2 pr-4">STATUS 欄位</td>
                <td className="py-2">判斷大方向</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center text-cyan-400 font-bold">2</td>
                <td className="py-2 pr-4"><code className="text-green-400">kubectl describe pod &lt;name&gt;</code></td>
                <td className="py-2 pr-4">Events 區塊</td>
                <td className="py-2">為什麼啟動不了</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center text-cyan-400 font-bold">3</td>
                <td className="py-2 pr-4"><code className="text-green-400">kubectl logs &lt;name&gt;</code></td>
                <td className="py-2 pr-4">程式輸出（stdout/stderr）</td>
                <td className="py-2">為什麼啟動了又掛了</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">CrashLoopBackOff 退避策略（指數退避）</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap mt-2">
            <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded">10s</span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded">20s</span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded">40s</span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded">80s</span>
            <span className="text-slate-500">→</span>
            <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded">160s</span>
            <span className="text-slate-500">→</span>
            <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded font-semibold">5min 上限</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">RESTARTS 數字越來越大，但每次等待間隔也越來越長</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">補充：叢集事件查詢</p>
          <p className="text-slate-300 text-sm">當 logs 完全空白、describe 也看不出問題時：</p>
          <code className="text-green-400 text-sm block mt-1">kubectl get events --sort-by=.metadata.creationTimestamp</code>
        </div>
      </div>
    ),
    notes: `第二個錯誤狀態叫 CrashLoopBackOff。這個比 ImagePullBackOff 更讓人頭痛。它的意思是：Image 拉到了，容器也建好了，程式也啟動了，但是程式一啟動就 crash 了。K8s 發現容器掛了，就自動幫你重啟。重啟之後程式又 crash，K8s 又重啟，又 crash，形成一個無限循環。Loop 就是循環的意思。

但 K8s 很聰明，它不會無限快速重試。它採用一個指數退避的策略。第一次 crash 之後等 10 秒再重啟，第二次等 20 秒，第三次等 40 秒，第四次等 80 秒，以此類推，一直到最長 5 分鐘封頂。所以如果你看到一個 Pod 一直是 CrashLoopBackOff，你會發現 RESTARTS 的數字越來越大，但每次重啟之間的等待時間也越來越長。等了半天什麼都沒發生，不是 K8s 放棄了，而是它在退避等待中。

CrashLoopBackOff 常見的原因包括：程式碼有 bug，啟動就報錯退出了；設定檔有問題，程式讀不到必要的設定；依賴的服務連不上，比如資料庫的連線字串寫錯了；或者 command 寫錯了，比如你在 YAML 裡面指定了一個不存在的指令。

好，狀態都認識了。碰到問題該怎麼辦？這裡我要教大家一套排錯的流程，我叫它「排錯三兄弟」，因為你幾乎每次排錯都會用到這三個指令。

第一步，kubectl get pods。先看狀態。你得先知道 Pod 是什麼狀態，才能判斷大方向。看到 ImagePullBackOff，你就知道是 Image 的問題。看到 CrashLoopBackOff，你就知道是程式的問題。看到 Pending，你就知道可能是資源不夠。

第二步，kubectl describe pod 加上 Pod 的名字。describe 會列出這個 Pod 的所有詳細資訊，但你重點看最下面的 Events 區塊。Events 會按照時間順序告訴你 K8s 做了什麼事情、發生了什麼錯誤。如果是 ImagePullBackOff，Events 裡面會清楚寫著 Failed to pull image，還會告訴你具體的錯誤訊息，比如 manifest unknown 代表找不到這個 Image，比如 unauthorized 代表沒有權限。Events 是你排錯的時候最重要的資訊來源，90% 的問題在 Events 裡面就能找到線索。

第三步，kubectl logs 加上 Pod 的名字。如果 Pod 的 Image 拉成功了、容器也建好了，但是程式跑起來就 crash，那問題出在程式本身。這時候你需要看容器的日誌，看程式到底報了什麼錯。logs 就對應 Docker 的 docker logs，把容器裡面程式輸出到 stdout 和 stderr 的內容全部列出來。如果你看到一堆 Java 的 Exception Stack Trace，或者 Python 的 Traceback，那原因就在裡面了。

這三步，先 get pods 看狀態、再 describe pod 看 Events、最後 logs 看日誌，養成習慣。以後碰到任何 Pod 的問題，你都從這三步開始。

最後補充一個進階指令。有時候容器根本沒有跑起來過，logs 就完全是空的。這時候你可以試試 kubectl get events，後面加上 --sort-by=.metadata.creationTimestamp。它會列出叢集裡面最近發生的所有事件，按時間排序。有時候問題不是出在 Pod 本身，而是出在更底層，比如 Node 的磁碟滿了、Node 的狀態異常了。這些資訊在 Pod 的 describe 裡面可能看不到，但在叢集的 events 裡面會有。不過大部分情況下，排錯三兄弟就夠用了。

好，概念全部講完了。你現在知道了 Pod 有哪些狀態、每個狀態代表什麼意思、碰到錯誤狀態該怎麼一步一步排查。但是光聽不練等於零。接下來我們就來實戰，我要帶大家故意製造錯誤，然後用排錯三兄弟一步一步找到原因、修好它。 [▶ 下一頁]`,
  },

  // ── 4-13 實作（1/2）：ImagePullBackOff 排錯 ──
  {
    title: 'Lab：排錯實戰 -- ImagePullBackOff',
    subtitle: '故意拼錯 Image 名字 → 排錯三兄弟',
    section: 'Loop 1：Pod 生命週期 + 排錯',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">排錯流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f pod-broken.yaml</code> -- 部署壞的 Pod</li>
            <li><code className="text-green-400">kubectl get pods</code> -- 看到 <code className="text-red-400">ErrImagePull</code> / <code className="text-red-400">ImagePullBackOff</code></li>
            <li><code className="text-green-400">kubectl get pods --watch</code> -- 觀察狀態來回切換</li>
            <li><code className="text-green-400">kubectl describe pod broken-pod</code> -- Events 寫著 <code className="text-red-400">Failed to pull image "ngin"</code></li>
            <li><code className="text-green-400">kubectl delete pod broken-pod</code> -- 刪掉壞的</li>
            <li>修改 YAML：<code className="text-green-400">ngin</code> → <code className="text-green-400">nginx:1.27</code></li>
            <li><code className="text-green-400">kubectl apply -f pod-broken.yaml</code> -- 重新部署</li>
            <li><code className="text-green-400">kubectl get pods</code> -- 確認 Running</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">注意</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl apply</code> 回覆 <code>created</code> 只代表 K8s 收到請求，<strong className="text-white">不代表 Pod 在跑</strong></li>
            <li>推薦做法：刪掉 → 改 YAML → 重新 apply（不建議用 <code>kubectl edit</code>）</li>
          </ul>
        </div>
      </div>
    ),
    code: `# pod-broken.yaml -- image 故意拼錯
apiVersion: v1
kind: Pod
metadata:
  name: broken-pod
  labels:
    app: broken
spec:
  containers:
    - name: broken
      image: ngin          # 故意拼錯！少了一個 x
      ports:
        - containerPort: 80`,
    notes: `好，上一支影片我們學了 Pod 的各種狀態，也認識了排錯三兄弟。概念你都懂了，但實際碰到問題的時候真的能用上嗎？這支影片我們就來驗證一下。我要故意把 Pod 搞壞，然後帶你一步一步排查、修復。

請大家打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。如果你的 minikube 不知道什麼時候停了，先 minikube status 確認一下，沒在跑的話 minikube start 重新啟動。

我們先來製造第一個錯誤。建一個新的 YAML 檔案叫 pod-broken.yaml。內容跟之前的 pod.yaml 很像，但是有一個地方我故意打錯了。

這個 YAML 最上面 apiVersion 寫 v1，kind 寫 Pod，metadata 底下 name 寫 broken-pod，labels 底下 app 寫 broken。然後 spec 底下 containers 是一個列表，列表的第一個項目 name 寫 broken，重點來了，image 寫 ngin。不是 nginx，是 ngin，少了一個 x。然後 ports 底下 containerPort 80。其他都跟之前一模一樣，只有 image 名字是錯的。

存檔之後，部署它。輸入 kubectl apply -f pod-broken.yaml。

指令：kubectl apply -f pod-broken.yaml

K8s 會回覆你 pod/broken-pod created。看起來好像成功了對吧？這裡要特別注意一件事。kubectl apply 回覆你 created，只代表 K8s 收到了你的請求並且記錄下來了，不代表 Pod 真的跑起來了。K8s 是非同步的，它先記錄你要什麼，然後在背景慢慢去做。所以 created 不等於 running，這個觀念很重要。

馬上來看狀態。排錯三兄弟第一步，kubectl get pods。

指令：kubectl get pods

你應該會看到 broken-pod 的 STATUS 欄位不是 Running，而是 ErrImagePull。如果你等幾秒鐘再看一次，可能已經變成 ImagePullBackOff 了。這就是我們上一支影片講的，K8s 拉不到你指定的 Image，第一次失敗是 ErrImagePull，之後進入退避重試就變成 ImagePullBackOff。

我們用 --watch 來持續觀察。輸入 kubectl get pods --watch。

指令：kubectl get pods --watch

畫面不會回到命令列，它會停在那裡，每當 Pod 的狀態有變化就多印一行。你會看到狀態在 ErrImagePull 和 ImagePullBackOff 之間來回切換。觀察個十幾二十秒，感受一下這個退避的節奏，然後按 Ctrl+C 停止。

好，第一步 get pods 做完了，我們知道是 Image 相關的問題。第二步，用 describe 看詳細資訊。輸入 kubectl describe pod broken-pod。

指令：kubectl describe pod broken-pod

輸出會很長，不要慌。直接拉到最下面，找 Events 區塊。你會看到幾行事件紀錄。先是 Scheduled，表示 K8s 已經把這個 Pod 分配到了 minikube 這個 Node 上。然後就是關鍵的一行：Failed to pull image "ngin"，後面會接一個錯誤訊息，可能是 rpc error 加上 manifest unknown，也可能是 repository does not exist。不管具體措辭怎麼寫，重點就是告訴你：ngin 這個 Image 找不到。

你看，Events 直接告訴你問題在哪裡了。Image 名字打錯了，ngin 不存在，應該是 nginx。排錯三兄弟到第二步就破案了。

現在來修正它。我推薦的做法是先刪掉有問題的 Pod，改好 YAML 之後重新 apply。

第一步，刪掉。

指令：kubectl delete pod broken-pod

等它顯示 deleted。

第二步，打開 pod-broken.yaml，把 image 那一行的 ngin 改成 nginx:1.27。記得加上版本號，養成好習慣。存檔。

指令：（編輯 pod-broken.yaml，把 image 從 ngin 改成 nginx:1.27）

第三步，重新部署。

指令：kubectl apply -f pod-broken.yaml

第四步，確認。

指令：kubectl get pods

這次 STATUS 應該會變成 Running 了。如果是 ContainerCreating，等幾秒鐘再看。看到 Running，恭喜你，第一個排錯成功了。

你可能會問，有沒有不用刪掉就能修的方法？有的。K8s 有一個指令叫 kubectl edit pod broken-pod，它會打開一個編輯器讓你直接修改正在跑的 Pod。但是我要特別說一下它的限制。Pod 的大部分欄位是不可變的，意思是 Pod 建好之後就不能改了。image 這個欄位剛好可以改，但是很多其他欄位改了 K8s 會拒絕。而且更重要的是，你用 edit 改的東西不會反映到你的 YAML 檔案裡面。你的 pod-broken.yaml 裡面還是寫著 ngin，下次你 apply 這個檔案的時候，同樣的錯誤又會出現。所以我強烈建議養成一個好習慣：永遠修改 YAML 檔案，然後重新 apply。不要依賴 kubectl edit。

好，第一個錯誤修好了。先清理一下。

指令：kubectl delete pod broken-pod [▶ 下一頁]`,
  },

  // ── 4-13 實作（2/2）：CrashLoopBackOff 排錯 ──
  {
    title: 'Lab：排錯實戰 -- CrashLoopBackOff',
    subtitle: 'command 故意讓容器立刻退出',
    section: 'Loop 1：Pod 生命週期 + 排錯',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">排錯流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f pod-crash.yaml</code></li>
            <li><code className="text-green-400">kubectl get pods</code> -- STATUS: <code className="text-red-400">CrashLoopBackOff</code>，RESTARTS 不斷增加</li>
            <li><code className="text-green-400">kubectl describe pod crash-pod</code> -- Events: <code className="text-red-400">Back-off restarting failed container</code></li>
            <li><code className="text-green-400">kubectl logs crash-pod</code> -- 可能是空的（程式沒來得及輸出就退出了）</li>
            <li><code className="text-green-400">kubectl logs crash-pod --previous</code> -- 看上一個已結束容器的日誌</li>
            <li><code className="text-green-400">kubectl delete pod crash-pod</code> -- 清理</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">排錯口訣</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-blue-400">describe</code> 解決「為什麼啟動不了」（ImagePullBackOff）</li>
            <li><code className="text-blue-400">logs</code> 解決「為什麼啟動了又掛了」（CrashLoopBackOff）</li>
          </ul>
        </div>
      </div>
    ),
    code: `# pod-crash.yaml -- 容器啟動就 exit 1
apiVersion: v1
kind: Pod
metadata:
  name: crash-pod
spec:
  containers:
    - name: crash-test
      image: nginx:1.27
      command: ["/bin/sh", "-c", "exit 1"]
      # exit 是 shell 內建指令，必須用 /bin/sh -c 包一層
      # 不能直接寫 command: ["exit", "1"]`,
    notes: `現在來製造第二個錯誤。這次我們要觸發 CrashLoopBackOff。

建一個新檔案叫 pod-crash.yaml。apiVersion v1，kind Pod，metadata 底下 name 寫 crash-pod。spec 底下 containers 列表的第一個項目，name 寫 crash-test，image 寫 nginx:1.27。到這裡都沒問題，Image 名字是對的，一定拉得到。但是我要加一個 command 欄位。command 是一個陣列，裡面放三個字串：第一個是 "/bin/sh"，第二個是 "-c"，第三個是 "exit 1"。

這個 command 的意思是什麼？容器啟動之後，不要執行 nginx 的預設指令，而是啟動一個 shell 然後執行 exit 1。exit 1 代表立刻以錯誤狀態退出。

這裡要注意一個細節。exit 是一個 shell 的內建指令，它不是一個獨立的可執行檔。你不能直接寫 command 陣列裡面放 "exit" 和 "1" 兩個元素，那樣 K8s 會去找一個叫 exit 的執行檔，結果找不到就會報另一種錯。所以我們要用 /bin/sh -c 的方式來包一層，讓 shell 去執行 exit 1。

好，這個 Pod 的情況是什麼呢？Image 是對的，容器可以正常建立，但是程式一啟動就退出了。K8s 會發現容器結束了，然後自動重啟，重啟之後又立刻退出，形成一個無限循環。

存檔，然後部署。

指令：kubectl apply -f pod-crash.yaml

等幾秒鐘，看狀態。

指令：kubectl get pods

你會看到 crash-pod 的 STATUS 是 CrashLoopBackOff，RESTARTS 欄位可能已經是 1 或 2 了。

我們來走一次完整的排錯流程。第一步 get pods 已經看了，狀態是 CrashLoopBackOff，所以問題不在 Image，而是程式本身。第二步，describe 看 Events。

指令：kubectl describe pod crash-pod

你會看到 Started，然後很快就看到 Back-off restarting failed container。K8s 在告訴你：容器啟動了但馬上退出了，我在做退避重啟。

第三步，看日誌。

指令：kubectl logs crash-pod

因為容器一啟動就 exit 了，日誌可能是空的，什麼都沒有。這是正常的，因為程式根本沒有產生任何輸出就退出了。但是在真實的場景中，如果你的 Java 程式啟動就 crash，logs 裡面通常會有 Exception 的堆疊資訊，那就是你排錯的關鍵線索。

如果 logs 是空的，你可以試試加 --previous 參數。

指令：kubectl logs crash-pod --previous

--previous 的意思是看上一個已經結束的容器的日誌。因為 K8s 一直在重啟容器，當前的容器可能剛建好還沒有任何日誌，但上一個 crash 掉的容器可能有留下一些東西。在我們這個例子裡 --previous 也是空的，因為 exit 1 本來就不會產生輸出。但這個參數在真實場景非常有用，一定要記住。

好，現在如果你持續觀察，你會看到 RESTARTS 的數字越來越大，但每次重啟之間的間隔也越來越長。第一次等 10 秒，第二次 20 秒，第三次 40 秒。用 --watch 持續觀察。

指令：kubectl get pods --watch

感受一下這個退避的節奏。等到後面可能要等好幾分鐘才會重啟一次。這就是指數退避策略在起作用。

觀察完之後，清理一下。

指令：kubectl delete pod crash-pod

來整理一下。不管碰到什麼問題，先用 get pods 看狀態。如果是 ImagePullBackOff，用 describe 看 Events，找 Image 相關的錯誤訊息。如果是 CrashLoopBackOff，先 describe 看 Events 確認是程式 crash，然後用 logs 看程式的輸出。describe 解決「為什麼啟動不了」的問題，logs 解決「為什麼啟動了又掛了」的問題。這個排錯流程你要練到變成反射動作。以後不管是開發環境還是生產環境，碰到 Pod 有問題，第一反應就是跑這三個指令。

接下來的回頭操作會給大家兩個練習題，讓你自己動手體驗一下排錯的完整過程。 [▶ 下一頁]`,
  },

  // ── Loop 1 學員實作題目 ──
  {
    title: '學員實作：Pod 排錯練習',
    subtitle: 'Loop 1 練習題',
    section: 'Loop 1：Pod 生命週期 + 排錯',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 1：修復 YAML 縮排錯誤（基礎）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>建一個 Pod YAML，故意把 <code className="text-red-400">image</code> 的縮排少打兩個空格</li>
            <li>用 <code>kubectl apply -f</code> 部署，觀察 <code className="text-red-400">error parsing</code> 錯誤訊息</li>
            <li>修正縮排 → 重新 apply → 確認 Running</li>
            <li>做完記得清理</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 2：觀察 CrashLoopBackOff 退避策略（進階觀察）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>建 Pod：image 用 <code>nginx:1.27</code>，加上 <code className="text-red-400">command: ["/bin/sh", "-c", "exit 1"]</code></li>
            <li>用 <code>kubectl get pods --watch</code> 持續觀察 RESTARTS 欄位</li>
            <li>用 <code>kubectl logs</code> 看輸出（會是空的，想想為什麼？）</li>
            <li>感受退避間隔：10s → 20s → 40s → ...</li>
            <li>觀察完記得清理</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，現在給大家兩個自己練的題目。

第一題，YAML 縮排錯誤排錯。複製 pod.yaml，故意把 image 那一行的縮排少打兩個空格，讓它跟 name 不對齊。

指令：cp pod.yaml pod-indent-broken.yaml
指令：（編輯 pod-indent-broken.yaml，把 image 那行的縮排故意改錯）
指令：kubectl apply -f pod-indent-broken.yaml

觀察 K8s 報什麼錯。仔細閱讀錯誤訊息，通常會提到 error parsing 或者 could not find expected key。修正縮排之後重新 apply，確認 Pod 變成 Running。做完記得清理。

指令：kubectl delete pod my-nginx

第二題，觀察 CrashLoopBackOff 的退避策略。部署 pod-crash.yaml，用 --watch 持續觀察 RESTARTS 欄位的變化。

指令：kubectl apply -f pod-crash.yaml
指令：kubectl get pods --watch

感受退避間隔 10 秒、20 秒、40 秒越來越長。Ctrl+C 停止觀察。觀察完記得清理。

指令：kubectl delete pod crash-pod

做完的同學，給你們一個探索建議。試試看故意把 YAML 的 kind 欄位打錯，比如寫成 Podd，看看 K8s 會報什麼錯誤訊息。再試試看把 apiVersion 從 v1 改成 v2，觀察不同的錯誤訊息長什麼樣。這些練習可以幫助你更熟悉各種錯誤訊息的格式，以後在生產環境碰到的時候就不會慌。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ── 4-14 回頭操作 ──
  {
    title: '排錯六步驟速查 + 常見坑',
    subtitle: '回頭操作 Loop 1',
    section: 'Loop 1：Pod 生命週期 + 排錯',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">排錯六步驟（練到變成反射動作）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f xxx.yaml</code> -- 部署</li>
            <li><code className="text-green-400">kubectl get pods</code> -- 看狀態</li>
            <li><code className="text-green-400">kubectl describe pod &lt;name&gt;</code> -- 看 Events 找原因</li>
            <li><code className="text-green-400">kubectl delete pod &lt;name&gt;</code> -- 刪掉壞的</li>
            <li>修改 YAML</li>
            <li><code className="text-green-400">kubectl apply -f xxx.yaml</code> -- 重新部署</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">常見坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Image 名字永遠<strong className="text-white">小寫</strong>（Docker Hub 全部是小寫）</li>
            <li>Image tag 要確認存在（常用：nginx:1.27、httpd:2.4、busybox:1.36）</li>
            <li>Private registry 需要設定認證（ImagePullSecret）</li>
            <li>YAML 縮排只能用空格，<strong className="text-red-400">不能用 Tab</strong></li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">探索建議（做完的同學試試）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>把 <code>kind</code> 打成 <code>Podd</code> 看看報什麼錯</li>
            <li>把 <code>apiVersion</code> 從 <code>v1</code> 改成 <code>v2</code> 觀察錯誤訊息</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，回頭操作時間。這段影片是給前面沒跟上的同學補做用的，已經做完的同學可以試試後面我會提到的探索建議。

大家跟著螢幕上的步驟走。打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。

第一個排錯練習，Image 名字拼錯。建一個 pod-broken.yaml，內容就是一個普通的 Pod，但 image 故意寫成 ngin，少一個 x。存檔之後 kubectl apply -f pod-broken.yaml。然後跑排錯三兄弟：kubectl get pods 看到 ImagePullBackOff，kubectl describe pod broken-pod 拉到 Events 看到 Failed to pull image "ngin"，原因就找到了。刪掉它，把 image 改成 nginx:1.27，重新 apply，確認 Running。

整個排錯流程六步驟：apply、get pods 看狀態、describe 看原因、刪掉、改 YAML、重新 apply。這個流程要練到變成反射動作。

第二個排錯練習，CrashLoopBackOff。建一個 pod-crash.yaml，image 用 nginx:1.27 但加上 command，陣列裡面三個元素 "/bin/sh"、"-c"、"exit 1"。apply 之後觀察狀態變成 CrashLoopBackOff，RESTARTS 數字一直增加。用 logs 看，可能是空的，因為程式還沒來得及輸出就退出了。試試 kubectl logs crash-pod --previous。觀察完之後 kubectl delete pod crash-pod 清理。

這裡提醒幾個常踩的坑。第一，Image 名字永遠用小寫，Docker Hub 上的 Image 名字全部是小寫的。第二，Image tag 要確認存在，可以去 Docker Hub 網站搜尋。記住幾個常用的就好：nginx 用 1.27，httpd 用 2.4，busybox 用 1.36。第三，command 裡面要用 exit 的話，一定要用 /bin/sh -c 包起來，因為 exit 是 shell 內建指令，不是獨立的執行檔。

好，確認環境清乾淨了之後，我們就進入下一個 Loop。上午講 Pod 概念的時候有提到過，一個 Pod 裡面可以放多個容器，最經典的用法叫 Sidecar 模式。當時只是簡單帶過，說下午會實際做一個。但在那之前，我們先搞清楚一個問題：為什麼需要在一個 Pod 裡放多個容器？什麼情況下你會需要這樣做？ [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 2：多容器 Pod + Sidecar
  // ============================================================

  // ── 4-15 概念（1/2）：Sidecar 模式圖 ──
  {
    title: 'Sidecar 模式：主容器 + 輔助容器',
    subtitle: '一個 Pod 可以放多個容器',
    section: 'Loop 2：多容器 Pod + Sidecar',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Sidecar = 邊車（摩托車 + 副手車廂）</p>
          <div className="flex items-center justify-center gap-4 my-3">
            <div className="bg-blue-900/40 border border-blue-500/40 p-3 rounded-lg text-center">
              <p className="text-blue-400 font-semibold text-sm">主容器</p>
              <p className="text-slate-300 text-xs">nginx</p>
              <p className="text-slate-400 text-xs">核心業務</p>
            </div>
            <div className="text-slate-500 text-xl">+</div>
            <div className="bg-purple-900/40 border border-purple-500/40 p-3 rounded-lg text-center">
              <p className="text-purple-400 font-semibold text-sm">Sidecar 容器</p>
              <p className="text-slate-300 text-xs">busybox / fluentd</p>
              <p className="text-slate-400 text-xs">輔助功能</p>
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded text-center">
            <p className="text-slate-300 text-sm">共享 <span className="text-cyan-400">網路</span>（同一個 IP，localhost 互連）+ 共享 <span className="text-cyan-400">Volume</span>（emptyDir）</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">常見 Sidecar 用途</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">用途</th>
                <th className="pb-2 pr-4">主容器</th>
                <th className="pb-2 pr-4">Sidecar</th>
                <th className="pb-2">協作方式</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">日誌收集</td>
                <td className="py-2 pr-4">業務應用</td>
                <td className="py-2 pr-4">Fluentd / Filebeat</td>
                <td className="py-2">共享 Volume 讀日誌</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">流量代理</td>
                <td className="py-2 pr-4">業務應用</td>
                <td className="py-2 pr-4">Envoy Proxy</td>
                <td className="py-2">共享網路攔截流量</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">監控指標</td>
                <td className="py-2 pr-4">業務應用</td>
                <td className="py-2 pr-4">Prometheus Exporter</td>
                <td className="py-2">收集指標轉 Prometheus 格式</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，排錯的技能解鎖了。你現在碰到 Pod 有問題，知道該怎麼一步一步找到原因了。但是排錯的時候你一定會碰到一個東西，就是日誌。剛才我們用 kubectl logs 看容器的輸出，那是程式寫到 stdout 的日誌。但是很多應用程式的日誌不只是輸出到 stdout，它還會寫到檔案裡面。

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

在實際的生產環境中，Sidecar 模式非常常見。最典型的三種用途：第一種，日誌收集，就是我們剛才講的。主容器寫日誌，Sidecar 用 Fluentd 或 Filebeat 把日誌收集起來送到 Elasticsearch。第二種，流量代理，像 Istio 的 Service Mesh 就是用這種模式，每個 Pod 裡面自動注入一個 Envoy Proxy 的 Sidecar，所有流量都經過它。第三種，監控指標收集，旁邊放一個 Prometheus Exporter 的 Sidecar 收集主程式的指標。 [▶ 下一頁]`,
  },

  // ── 4-15 概念（2/2）：多容器 vs 多 Pod 比較表 ──
  {
    title: '多容器 Pod vs 多個獨立 Pod',
    subtitle: '判斷標準：拿掉一個，另一個還能不能活',
    section: 'Loop 2：多容器 Pod + Sidecar',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照表</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4"></th>
                <th className="pb-2 pr-4">多容器 Pod</th>
                <th className="pb-2">多個獨立 Pod</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">何時用</td>
                <td className="py-2 pr-4">容器之間<strong className="text-cyan-400">緊密耦合</strong></td>
                <td className="py-2">容器<strong className="text-cyan-400">獨立運作</strong></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">網路</td>
                <td className="py-2 pr-4">共享 IP，用 localhost</td>
                <td className="py-2">各自有 IP</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">擴縮容</td>
                <td className="py-2 pr-4">一起擴一起縮</td>
                <td className="py-2">獨立擴縮</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">生命週期</td>
                <td className="py-2 pr-4">一起生一起死</td>
                <td className="py-2">各自獨立</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">舉例</td>
                <td className="py-2 pr-4">nginx + log collector</td>
                <td className="py-2">nginx + mysql</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">判斷口訣</p>
          <p className="text-slate-300 text-sm">拿掉一個容器，另一個<strong className="text-white">還能不能活</strong>？</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside mt-2">
            <li>nginx + log collector → 拿掉 collector，nginx 還能跑；拿掉 nginx，collector 沒事做 → <span className="text-green-400">放一起</span></li>
            <li>nginx + MySQL → 各自獨立、擴縮需求不同 → <span className="text-blue-400">分開放</span></li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">最佳實踐</p>
          <p className="text-slate-300 text-sm">不確定的話就<strong className="text-white">先分開</strong>，之後有需要再合併。一個 Pod 一個容器是最安全的選擇。</p>
        </div>
      </div>
    ),
    notes: `好，這裡有一個很重要的判斷問題：什麼時候應該用多容器 Pod，什麼時候應該用多個獨立的 Pod？

判斷標準很簡單。你就問自己一個問題：如果我把其中一個容器拿掉，另一個容器還能不能正常工作？

拿 nginx 和日誌收集器來說。把日誌收集器拿掉，nginx 還是可以正常服務 Web 請求，只是日誌沒人收了。反過來，把 nginx 拿掉，日誌收集器就完全沒事做了，因為沒有日誌可以收。日誌收集器的存在完全依附於 nginx，它們是緊密耦合的。適合放在同一個 Pod。

再拿 nginx 和 MySQL 來說。把 MySQL 拿掉，nginx 還能服務靜態頁面。把 nginx 拿掉，MySQL 還能被其他服務存取。它們是相對獨立的。更重要的是，nginx 可能需要擴展到 5 個副本，但 MySQL 不需要跟著擴。如果它們在同一個 Pod 裡，nginx 擴到 5 個，MySQL 也會跟著變成 5 個，這完全不是你想要的。所以 nginx 和 MySQL 應該放在不同的 Pod。

大家看一下螢幕上的對照表。多容器 Pod 是共享 IP、一起擴縮、一起生死。多個獨立 Pod 是各自有 IP、獨立擴縮、各自生死。在大多數情況下，最佳實踐還是一個 Pod 一個容器。只有當你確實需要共享網路或共享儲存的時候，才考慮多容器 Pod。

好，概念講清楚了。接下來我們動手來做一個 Sidecar Pod，你就會知道 YAML 該怎麼寫、兩個容器怎麼協同工作。 [▶ 下一頁]`,
  },

  // ── 4-16 實作（1/2）：pod-sidecar.yaml 完整範例 ──
  {
    title: 'Lab：Sidecar Pod 實作',
    subtitle: 'nginx + busybox 共享日誌',
    section: 'Loop 2：多容器 Pod + Sidecar',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">YAML 結構拆解</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-white">容器 1（nginx）</strong>：主容器，寫日誌到 <code>/var/log/nginx</code></li>
            <li><strong className="text-white">容器 2（log-reader）</strong>：Sidecar，用 <code>tail -f</code> 追蹤日誌</li>
            <li><strong className="text-white">Volume（emptyDir）</strong>：兩個容器掛載同一個目錄</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">為什麼 busybox command 要加 while 等待？</p>
          <p className="text-slate-300 text-sm">同一個 Pod 的容器是<strong className="text-white">同時啟動</strong>的，K8s 不保證順序。如果 busybox 比 nginx 先跑起來，access.log 還不存在，直接 <code>tail -f</code> 會 crash。加 while 迴圈等檔案出現再讀，避免 <span className="text-red-400">race condition</span>。</p>
        </div>
      </div>
    ),
    code: `# pod-sidecar.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod
  labels:
    app: sidecar-demo
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

    - name: log-reader
      image: busybox:1.36
      command: ["/bin/sh", "-c",
        "while [ ! -f /var/log/nginx/access.log ]; do sleep 1; done; tail -f /var/log/nginx/access.log"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

  volumes:
    - name: shared-logs
      emptyDir: {}`,
    notes: `好，上一支影片我們講了多容器 Pod 和 Sidecar 模式的概念。現在來動手做一個。我們要建一個 Pod，裡面放兩個容器：一個 nginx 負責服務 Web 請求並寫入 access log，一個 busybox 負責即時讀取 nginx 的 access log。它們透過一個共享的 emptyDir Volume 來傳遞日誌檔案。

打開終端機，確認你在 k8s-course-labs/lesson4 目錄下。建一個新檔案叫 pod-sidecar.yaml。這個 YAML 比之前寫過的都要長一些，但不要怕，我帶你一段一段看。

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

對照一下 Docker Compose 的寫法。在 Docker Compose 裡面，你會在兩個 service 底下各自掛載同一個 named volume，然後在最下面的 volumes 區塊定義這個 volume。K8s 的 YAML 邏輯是完全一樣的：在 containers 裡面用 volumeMounts 指定掛載點，在 volumes 裡面定義 Volume。語法不同，概念相同。 [▶ 下一頁]`,
  },

  // ── 4-16 實作（2/2）：驗證步驟 ──
  {
    title: 'Lab：Sidecar 驗證 -- READY 2/2',
    subtitle: '-c 參數指定容器 + 共享 Volume 驗證',
    section: 'Loop 2：多容器 Pod + Sidecar',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證步驟</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get pods</code> -- 確認 READY 顯示 <strong className="text-white">2/2</strong></li>
            <li><code className="text-green-400">kubectl exec -it sidecar-pod -c nginx -- /bin/sh</code></li>
            <li>進 nginx 容器：<code className="text-green-400">apt-get update && apt-get install -y curl</code></li>
            <li>打三次 <code className="text-green-400">curl localhost</code> 產生 access log</li>
            <li><code className="text-green-400">exit</code> 離開容器</li>
            <li><code className="text-green-400">kubectl logs sidecar-pod -c log-reader</code> -- 看到三行 access log</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">關鍵觀念</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>READY <code>2/2</code> = Pod 裡有 2 個容器、2 個都 Ready</li>
            <li>多容器 Pod 用 <code>exec</code> 或 <code>logs</code> 必須加 <code className="text-cyan-400">-c &lt;容器名&gt;</code></li>
            <li>nginx 寫日誌 → 共享 Volume → busybox 讀日誌 → <code>kubectl logs</code> 看結果</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 部署
kubectl apply -f pod-sidecar.yaml
kubectl get pods                    # READY 2/2

# 進 nginx 容器產生流量
kubectl exec -it sidecar-pod -c nginx -- /bin/sh
apt-get update && apt-get install -y curl
curl localhost    # 打三次
curl localhost
curl localhost
exit

# 看 Sidecar 日誌
kubectl logs sidecar-pod -c log-reader   # 三行 access log

# 清理
kubectl delete pod sidecar-pod`,
    notes: `好，YAML 寫完了，存檔。部署它。

指令：kubectl apply -f pod-sidecar.yaml

看到 created 之後，馬上看狀態。

指令：kubectl get pods

注意看 READY 欄位。之前我們的 Pod 都是顯示 1/1，一個容器裡面有一個準備好了。這次你應該會看到 2/2。2 斜線 2 的意思是：這個 Pod 裡面有 2 個容器，2 個都已經準備好了。如果你看到 1/2，表示有一個容器還沒 Ready，可能 Image 還在拉，等幾秒鐘再看。看到 2/2 Running 就代表兩個容器都在正常跑了。

接下來我們要製造一些流量，讓 nginx 產生 access log。我們要進到 nginx 容器裡面去發請求。

指令：kubectl exec -it sidecar-pod -c nginx -- /bin/sh

注意這裡多了一個 -c nginx。上午我們進單容器 Pod 的時候不需要指定容器名字，因為只有一個容器，K8s 知道你要進哪個。但現在 Pod 裡面有兩個容器，你必須用 -c 參數告訴 K8s 你要進哪一個。-c 是 --container 的縮寫。如果你忘了加 -c，K8s 會跟你說 Pod 裡面有多個容器請指定要進哪一個，然後列出所有容器的名字讓你選。

進去之後，我們需要 curl 來發 HTTP 請求。但是 nginx 的官方 Image 是精簡版的，沒有預裝 curl。所以先裝一下。

指令：apt-get update && apt-get install -y curl

大概十秒鐘就好了。裝好之後，連打三次 curl localhost。

指令：curl localhost
指令：curl localhost
指令：curl localhost

每一次你都會看到 nginx 的歡迎頁面的 HTML 內容印在螢幕上。更重要的是，每一次 curl 都會在 access.log 裡面產生一行日誌。

然後 exit 離開 nginx 容器。

指令：exit

現在是最精彩的部分。我們來看 Sidecar 容器有沒有收到這些日誌。

指令：kubectl logs sidecar-pod -c log-reader

你應該會看到三行 access log，每一行就是你剛才 curl 產生的請求紀錄。裡面有請求的時間、來源 IP、HTTP 方法、路徑、狀態碼 200、回應大小這些資訊。

你看，整個流程是這樣的。nginx 收到請求，把日誌寫到 /var/log/nginx/access.log 這個檔案。busybox 透過共享的 emptyDir Volume 讀到了同一個檔案，用 tail -f 即時追蹤新增的內容，然後輸出到自己的 stdout。你用 kubectl logs -c log-reader 看到的，就是 busybox 的 stdout。

這就是 Sidecar 模式的精髓。主容器負責業務邏輯，Sidecar 容器負責輔助功能，兩者透過共享的 Volume 協同工作，但各自的職責非常清楚。在真實的生產環境中，Sidecar 容器不會只是 tail -f，它會用 Fluentd 或 Filebeat 把日誌轉發到 Elasticsearch 或者 CloudWatch 之類的集中式日誌系統。但原理是完全一樣的。

你也可以試試看 nginx 容器自己的日誌。輸入 kubectl logs sidecar-pod -c nginx。你會看到 nginx 的啟動訊息，但是不會看到 access log。為什麼？因為我們掛了 emptyDir 到 /var/log/nginx，那兩個 symlink 被覆蓋了，access log 改寫到了真實的檔案裡面，不再輸出到 stdout。所以你用 kubectl logs 看 nginx 容器，看不到 access log。這正好說明了為什麼我們需要 Sidecar 來讀取日誌檔案，因為日誌不在 stdout 上了。

好，實作完成。清理一下。

指令：kubectl delete pod sidecar-pod

概念理解了、實作也做了。接下來的回頭操作會給你一個不同的練習，用 httpd 來做同樣的事情。httpd 的日誌路徑跟 nginx 不一樣，這是你要自己去查、去調整的地方。 [▶ 下一頁]`,
  },

  // ── Loop 2 學員實作題目 ──
  {
    title: '學員實作：Sidecar Pod 練習',
    subtitle: 'Loop 2 練習題',
    section: 'Loop 2：多容器 Pod + Sidecar',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 1：httpd + busybox Sidecar（基礎）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>主容器：<code className="text-green-400">httpd:2.4</code>，Sidecar：<code className="text-green-400">busybox:1.36</code></li>
            <li>httpd 日誌目錄：<code className="text-cyan-400">/usr/local/apache2/logs</code>（Volume mountPath 改這裡）</li>
            <li>httpd access log 檔名：<code className="text-cyan-400">access_log</code>（底線，不是點！）</li>
            <li>busybox 的 tail -f 路徑：<code>/usr/local/apache2/logs/access_log</code></li>
            <li>驗證：進 httpd 容器裝 curl → curl localhost → 看 Sidecar 日誌</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 2（進階）：統計日誌行數的 Sidecar</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>把 busybox 的 command 改成：</li>
          </ul>
          <code className="text-green-400 text-xs block mt-1 bg-slate-900/50 p-2 rounded">while true; do wc -l /usr/local/apache2/logs/access_log 2&gt;/dev/null; sleep 5; done</code>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside mt-2">
            <li>每 5 秒統計一次 access log 行數</li>
            <li>curl 幾次後觀察行數變化</li>
            <li>想想：這種 Sidecar 在什麼場景下有用？（提示：監控）</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，現在給大家練習題。用 httpd 取代 nginx 來做同樣的 Sidecar Pod。

httpd 跟 nginx 有兩個關鍵差異。第一，httpd 的日誌目錄不是 /var/log/nginx，而是 /usr/local/apache2/logs。所以你的 volumeMounts 的 mountPath 要改成 /usr/local/apache2/logs。第二，httpd 的 access log 檔名叫 access_log，注意是底線，不是 access.log 的點。所以 busybox 的 tail -f 路徑要寫 /usr/local/apache2/logs/access_log。

其他的結構完全一樣。image 改成 httpd:2.4，containerPort 改成 80，其他不變。跟 nginx 一樣，掛載 emptyDir 到 httpd 的日誌目錄會覆蓋預設的 symlink，httpd 就會真正把日誌寫到檔案裡。驗證的方式也一樣，進 httpd 容器裝 curl，curl localhost 幾次，然後看 log-reader 的日誌有沒有出現。httpd 也沒有預裝 curl，一樣用 apt-get update 和 apt-get install -y curl 來裝。

做完的同學，給你們一個探索建議。試試看把 busybox 的 command 裡面那個 while 迴圈拿掉，直接寫 tail -f /var/log/nginx/access.log，看看會發生什麼事。你會發現如果 busybox 比 nginx 先啟動，tail 會找不到檔案然後容器 crash，Pod 的 READY 會變成 1/2，log-reader 容器進入 CrashLoopBackOff。加回 while 迴圈之後再 apply 一次，對比看看差異。這就是我們講的 race condition 問題的真實體驗。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ── 4-17 回頭操作 ──
  {
    title: 'Sidecar 常見坑 + 探索建議',
    subtitle: '回頭操作 Loop 2',
    section: 'Loop 2：多容器 Pod + Sidecar',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">常見坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>忘了 <code className="text-red-400">-c</code> 參數 -- 多容器 Pod 的 exec/logs 必須指定容器名</li>
            <li>Volume 路徑打錯 -- nginx 是 <code>/var/log/nginx</code>，httpd 是 <code>/usr/local/apache2/logs</code></li>
            <li>httpd 的 access log 檔名是 <code className="text-cyan-400">access_log</code>（底線），不是 <code>access.log</code>（點）</li>
            <li>busybox command 語法錯 -- while 迴圈的方括號前後要有空格</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">探索建議（做完的同學試試）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>把 busybox 的 while 等待迴圈拿掉，直接寫 <code>tail -f</code>，看看 race condition 會怎樣</li>
            <li>試試 <code className="text-green-400">kubectl logs sidecar-pod -c nginx</code> 對比兩個容器的日誌差異</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，回頭操作時間。大家跟著螢幕上的步驟走，我快速帶一遍 Sidecar Pod 的流程。

打開終端機，確認你在 k8s-course-labs/lesson4 目錄。建一個 pod-sidecar.yaml。YAML 的關鍵結構是這樣的。spec 底下 containers 列表有兩個容器。第一個 nginx，image nginx:1.27，加 volumeMounts，name 是 shared-logs，mountPath 是 /var/log/nginx。第二個 log-reader，image busybox:1.36，command 用 /bin/sh、-c，然後接那個 while 迴圈等 access.log 出現再 tail -f 的指令。log-reader 的 volumeMounts 也掛 shared-logs 到同一個路徑。最底下 volumes 區塊定義 shared-logs，型態 emptyDir 空大括號。

存檔之後 kubectl apply -f pod-sidecar.yaml。kubectl get pods 看到 READY 2/2 Running 就對了。然後 kubectl exec -it sidecar-pod -c nginx -- /bin/sh 進 nginx 容器，apt-get update 再 apt-get install -y curl，curl localhost 打三次，exit 出來。kubectl logs sidecar-pod -c log-reader 看到三行 access log 就成功了。做完 kubectl delete pod sidecar-pod 清理。

這裡提醒兩個最常踩的坑。第一，多容器 Pod 用 exec 或 logs 一定要加 -c 指定容器名字。不加的話 K8s 會提示你選，但你也可以養成習慣，只要 Pod 裡有多個容器就加 -c。第二，Volume 的 mountPath 一定要跟容器實際寫日誌的路徑對上。nginx 是 /var/log/nginx，路徑對不上的話 Sidecar 就什麼都讀不到。

另外一個探索。看看 kubectl logs sidecar-pod -c nginx，你會發現掛了 emptyDir 之後 nginx 容器的 stdout 裡面沒有 access log 了。再想想為什麼。答案我們剛才講過：symlink 被覆蓋了，日誌改寫到了真實的檔案裡，不再輸出到 stdout。這就是 Sidecar 存在的意義，把檔案裡的日誌收集出來。

好，確認環境清乾淨了就繼續。到目前為止我們學了 Pod 的完整 CRUD、生命週期和排錯、以及多容器 Pod 和 Sidecar 模式。接下來我們會進入 kubectl 的進階用法和環境變數的設定，讓你的 Pod 操作更加靈活。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 3：kubectl 進階 + port-forward
  // ============================================================

  // ── 4-18 概念（1/2）：輸出格式 + port-forward ──
  {
    title: 'kubectl 進階：輸出格式 + port-forward',
    subtitle: '-o wide / yaml / json + 臨時通道存取 Pod',
    section: 'Loop 3：kubectl 進階 + port-forward',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">輸出格式 -o</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">格式</th>
                <th className="pb-2 pr-4">用途</th>
                <th className="pb-2">Docker 對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-green-400">-o wide</code></td>
                <td className="py-2 pr-4">多顯示 IP、NODE 欄位</td>
                <td className="py-2">--</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-green-400">-o yaml</code></td>
                <td className="py-2 pr-4">完整配置（含 K8s 自動填充的預設值）</td>
                <td className="py-2"><code>docker inspect</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-green-400">-o json</code></td>
                <td className="py-2 pr-4">同 yaml，JSON 格式（方便 jq 處理）</td>
                <td className="py-2"><code>docker inspect</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-green-400">-o name</code></td>
                <td className="py-2 pr-4">只輸出資源名字（寫腳本用）</td>
                <td className="py-2">--</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">port-forward：對照 <code>docker run -p</code></p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Docker</th>
                <th className="pb-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker run -p 8080:80</code></td>
                <td className="py-2"><code>kubectl port-forward pod/xxx 8080:80</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><strong className="text-green-400">永久的</strong> port 映射</td>
                <td className="py-2"><strong className="text-amber-400">臨時的</strong>（關終端就斷）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">SSH 環境注意</p>
          <p className="text-slate-300 text-sm">port-forward 預設綁 127.0.0.1（VM localhost）。要從筆電瀏覽器連入，加 <code className="text-green-400">--address 0.0.0.0</code></p>
        </div>
      </div>
    ),
    notes: `好，前面兩個 Loop 走下來，大家已經會 Pod 的 CRUD、排錯三兄弟、還有 Sidecar 多容器 Pod 了。Pod 本身你已經不陌生了。但是我在帶大家操作的過程中，發現了一個問題。

我們每次看 Pod 狀態都是用 kubectl get pods，對不對？每次看到的就是那幾個欄位，NAME、READY、STATUS、RESTARTS、AGE。但有時候我想知道更多。比如說，我的 Pod 的 IP 是什麼？它跑在哪個 Node 上？它完整的設定長什麼樣子？光靠 kubectl get pods 是看不到這些的。

資訊不夠怎麼辦？加參數。kubectl get 這個指令可以加一個 -o 參數，o 是 output 的意思，控制輸出格式。

第一個，-o wide。加了 wide 之後，表格會多顯示好幾個欄位。最重要的是 IP 和 NODE。IP 是這個 Pod 在叢集內部的虛擬 IP，NODE 是告訴你這個 Pod 目前跑在哪個節點上。我們現在只有一個 minikube 節點，所以 NODE 都是 minikube。但等到第五堂課我們用 k3s 建多節點叢集的時候，你會看到不同的 Pod 分散在不同的 Node 上，那時候 -o wide 就非常有用了。

第二個，-o yaml。這個輸出會很長，因為它會把 Pod 的完整配置用 YAML 格式全部吐出來。什麼叫完整配置？不只是你自己在 YAML 裡面寫的那些東西，還包含一大堆 K8s 自動幫你填進去的預設值。比如你沒寫 restartPolicy，K8s 預設幫你填 Always，表示容器掛了就自動重啟。你也沒寫 dnsPolicy，K8s 預設填 ClusterFirst。最底下還有一整塊 status 區塊，裡面有 Pod 的 IP、啟動時間、每個容器的詳細狀態。排錯的時候這些資訊非常有價值。如果你用過 Docker，-o yaml 就像 docker inspect，讓你看到容器的完整內部資訊。

第三個，-o json。跟 -o yaml 輸出的內容完全一樣，只是格式變成 JSON。如果你需要寫腳本去處理這些資料，或者要用 jq 做過濾和提取，JSON 格式會比 YAML 方便。

第四個，-o name。只吐出資源的名字，像 pod/my-nginx 這種格式。寫自動化腳本的時候用得到。

除了 -o 之外，還有一個很常用的參數叫 --watch，可以縮寫成 -w。之前排錯的時候你已經用過了。它的作用是讓 kubectl 持續監控資源的變化，有任何狀態改變就即時顯示。比如你 apply 了一個新的 Pod 之後，開另一個終端跑 kubectl get pods -w，就可以即時看到 Pod 從 Pending 變成 ContainerCreating，再變成 Running 的完整過程。看完了按 Ctrl+C 停止。

好，資訊不夠的問題解決了。但是接下來又冒出一個問題。

你把 nginx Pod 跑起來了，STATUS 也是 Running，你很開心。但你打開瀏覽器，輸入 Pod 的 IP，結果怎麼都連不上。為什麼？

原因是 Pod 的 IP 是叢集內部的虛擬 IP，只能在叢集裡面的其他 Pod 之間互相存取。你的筆電不在叢集裡面，所以你的瀏覽器根本連不到 Pod 的 IP。就像你知道公司某台伺服器的內網 IP，但你在家裡用自己的電腦是連不上的，因為你不在公司內網裡。

在 Docker 裡面，我們是怎麼解決這個問題的？docker run -p 8080:80，把容器的 80 port 映射到本機的 8080 port，然後瀏覽器打 localhost:8080 就能看到了。K8s 裡面也有類似的東西，叫 port-forward。

指令是這樣的：kubectl port-forward pod/my-nginx 8080:80。意思是在你的本機和 Pod 之間建一條臨時的通道，把本機的 8080 port 轉發到 Pod 的 80 port。執行之後你在瀏覽器打 localhost:8080 就能看到 nginx 的歡迎頁面了。

但這裡有一個非常重要的差異。Docker 的 -p 是永久的，只要容器在跑，port 映射就一直在。port-forward 不一樣，它是臨時的。你把終端關掉、按 Ctrl+C、或者 SSH 斷線了，通道就斷了，瀏覽器馬上連不上。所以 port-forward 不是正式對外提供服務的方式，它只適合開發和除錯的時候臨時用一下看看容器到底有沒有正常跑。正式對外服務要用 Service，那是下堂課的內容。

另外提醒一個坑，如果你是用 SSH 連到一台 VM 上面操作 K8s 的。port-forward 預設綁定的是 127.0.0.1，也就是 VM 本機的 localhost。你在筆電的瀏覽器打 VM 的 IP 加 8080 port，是連不上的。解決方法是加上 --address 0.0.0.0，讓它監聽所有網路介面。完整指令是 kubectl port-forward pod/my-nginx 8080:80 --address 0.0.0.0。這樣你在筆電瀏覽器打 VM 的 IP 加 8080 就能看到了。 [▶ 下一頁]`,
  },

  // ── 4-18 概念（2/2）：dry-run + explain + 效率技巧 ──
  {
    title: 'kubectl 進階：dry-run + explain + 效率技巧',
    subtitle: 'YAML 記不住？讓 K8s 幫你產生模板',
    section: 'Loop 3：kubectl 進階 + port-forward',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">dry-run：快速產生 YAML 模板</p>
          <code className="text-green-400 text-sm block bg-slate-900/50 p-2 rounded">kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml &gt; test-pod.yaml</code>
          <p className="text-slate-400 text-xs mt-1">模擬執行，不會真的建立資源。產生完整 YAML 模板，改一改就能用。資深工程師也是這樣做的。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">kubectl explain：內建文件查詢</p>
          <code className="text-green-400 text-sm block bg-slate-900/50 p-2 rounded">kubectl explain pod.spec.containers</code>
          <p className="text-slate-400 text-xs mt-1">一層一層往下鑽：pod.spec.containers.ports、pod.spec.containers.resources。比翻官方文件快很多。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">效率技巧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">技巧</th>
                <th className="pb-2 pr-4">指令</th>
                <th className="pb-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">自動補全</td>
                <td className="py-2 pr-4"><code className="text-green-400 text-xs">source &lt;(kubectl completion bash)</code></td>
                <td className="py-2 text-xs">Tab 補全指令和資源名</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">別名</td>
                <td className="py-2 pr-4"><code className="text-green-400 text-xs">alias k=kubectl</code></td>
                <td className="py-2 text-xs">k get pods = kubectl get pods</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">資源簡寫</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="bg-slate-700 px-2 py-1 rounded"><code className="text-cyan-400">po</code> = pods</span>
            <span className="bg-slate-700 px-2 py-1 rounded"><code className="text-cyan-400">svc</code> = services</span>
            <span className="bg-slate-700 px-2 py-1 rounded"><code className="text-cyan-400">deploy</code> = deployments</span>
            <span className="bg-slate-700 px-2 py-1 rounded"><code className="text-cyan-400">cm</code> = configmaps</span>
            <span className="bg-slate-700 px-2 py-1 rounded"><code className="text-cyan-400">ns</code> = namespaces</span>
          </div>
        </div>
      </div>
    ),
    notes: `好，Pod 看得到了，瀏覽器也能連了。但是又有一個問題困擾著你。

每次要寫 YAML 的時候，那些欄位到底怎麼拼？apiVersion 是什麼？kind 是什麼？spec 底下 containers 的縮排到底是幾層？尤其是剛開始學的時候，每次都要翻文件或者翻之前寫過的檔案。太慢了。有沒有辦法讓 K8s 自己幫你產生一個模板？

有，就是 dry-run。指令是 kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml。dry-run 的意思是乾跑，模擬執行，不會真的建立任何資源。加上 -o yaml 就會把它本來會建立的東西用 YAML 格式印出來。你拿到的就是一個完整的 Pod YAML 骨架，直接改就能用。

你還可以用重新導向把輸出存成檔案。kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml 大於號 test-pod.yaml。打開檔案，改名字、改 image、加你需要的欄位，然後 kubectl apply -f 就直接部署了。在實際工作中，很多資深工程師也是這樣做的，沒有人真的從零開始一個字一個字手寫 YAML。

YAML 可以自動產生了，但如果你想知道某個欄位到底有什麼選項可以填呢？比如 containers 底下到底還能寫什麼？這時候就用 kubectl explain。

kubectl explain pod.spec.containers，它會列出 containers 底下所有可以設定的欄位和說明。你可以一層一層往下鑽。比如 kubectl explain pod.spec.containers.ports 可以看到 containerPort、hostPort、protocol 這些子欄位。kubectl explain pod.spec.containers.env 可以看到環境變數怎麼設。這比去翻官方文件快多了，而且資訊跟你叢集的版本完全吻合。

最後教大家三個讓效率翻倍的小技巧。

第一個，自動補全。你輸入 source 小於號左括號 kubectl completion bash 右括號，就能啟用 Tab 補全功能。啟用之後你打 kubectl get po 然後按 Tab，它自動幫你補成 pods。你打 kubectl logs my 然後按 Tab，它自動補全你的 Pod 名稱。非常節省時間。建議把這行加到你的 shell 設定檔裡面，這樣每次開新終端都會自動生效。用 bash 的同學，加到 ~/.bashrc。用 zsh 的同學，把 completion bash 換成 completion zsh，加到 ~/.zshrc。macOS 預設是 zsh，Linux 預設是 bash。不確定自己用哪個的話，終端機裡面打 echo $SHELL 看一下就知道了。

第二個，別名。kubectl 這個字每天要打幾百次，太長了。設定 alias k=kubectl，之後打 k get pods 就等於 kubectl get pods。一樣加到 ~/.bashrc 或 ~/.zshrc 讓它永久生效。

第三個，資源簡寫。K8s 的資源類型都有簡寫，pods 簡寫成 po，services 簡寫成 svc，deployments 簡寫成 deploy，configmaps 簡寫成 cm，namespaces 簡寫成 ns。搭配別名一起用，k get po 四個字就看到 Pod 列表了。

好，kubectl 的進階技巧就這些。每一個都是你日常工作中天天會用到的。接下來我們全部動手操作一遍。 [▶ 下一頁]`,
  },

  // ── 4-19 實作（1/2）：port-forward 示範 ──
  {
    title: 'Lab：port-forward 實作',
    subtitle: '從瀏覽器存取 Pod',
    section: 'Loop 3：kubectl 進階 + port-forward',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作步驟</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>確認有一個 Running 的 nginx Pod</li>
            <li>執行 <code className="text-green-400">kubectl port-forward pod/my-nginx 8080:80</code></li>
            <li>終端被佔住 → 開<strong className="text-white">另一個終端</strong></li>
            <li>新終端：<code className="text-green-400">curl localhost:8080</code> → 看到 Welcome to nginx</li>
            <li>回原終端按 <code className="text-cyan-400">Ctrl+C</code> 停止</li>
            <li>再 curl → <code className="text-red-400">Connection refused</code>（通道已斷）</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">SSH 環境完整指令</p>
          <code className="text-green-400 text-sm block bg-slate-900/50 p-2 rounded">kubectl port-forward pod/my-nginx 8080:80 --address 0.0.0.0</code>
          <p className="text-slate-400 text-xs mt-1">然後在筆電瀏覽器打 VM-IP:8080</p>
        </div>
      </div>
    ),
    code: `# 確認 Pod 在跑
kubectl get pods

# port-forward（佔住終端）
kubectl port-forward pod/my-nginx 8080:80

# === 開另一個終端 ===
curl localhost:8080          # Welcome to nginx!

# SSH 環境用這個
kubectl port-forward pod/my-nginx 8080:80 --address 0.0.0.0
# 然後筆電瀏覽器打 VM-IP:8080`,
    notes: `好，上一支影片講了一堆技巧，現在全部來動手操作。大家把終端機打開，跟著我一步一步來。

首先確保你有一個 Pod 可以拿來實驗。進到工作目錄。

指令：cd k8s-course-labs/lesson4

然後看看有沒有 Running 的 Pod。

指令：kubectl get pods

如果沒有的話，快速用我們 repo 裡的 pod.yaml 建一個。

指令：kubectl apply -f pod.yaml

確認 STATUS 是 Running 就好。

第一個操作，port-forward。

指令：kubectl port-forward pod/my-nginx 8080:80

你會看到終端顯示 Forwarding from 127.0.0.1:8080 然後箭頭 80，表示通道建好了。注意，這個終端現在被 port-forward 佔住了，你不能再打其他指令。所以你需要開另一個終端視窗。

在新的終端裡面，輸入 curl。

指令：curl http://localhost:8080

你應該會看到一大段 HTML 回來，裡面有 Welcome to nginx 的字樣。如果你是圖形化環境，也可以打開瀏覽器輸入 localhost:8080，會看到 nginx 那個經典的歡迎頁面。

回到跑 port-forward 的那個終端，你會看到每收到一個請求它就印出一行 Handling connection for 8080。現在按 Ctrl+C 把它停掉。

停掉之後回到另一個終端再 curl localhost:8080 試試看。連不上了，curl 報 Connection refused。這就是我們講的，port-forward 是臨時的，關掉就斷。 [▶ 下一頁]`,
  },

  // ── 4-19 實作（2/2）：dry-run + 輸出格式 ──
  {
    title: 'Lab：dry-run + 輸出格式操作',
    subtitle: '產生 YAML 模板 + 各種 -o 格式',
    section: 'Loop 3：kubectl 進階 + port-forward',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">-o yaml：K8s 自動填充的欄位（對照你寫的 vs K8s 存的）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-slate-400">metadata:</code> uid、creationTimestamp、resourceVersion</li>
            <li><code className="text-slate-400">spec:</code> restartPolicy: Always、dnsPolicy: ClusterFirst、terminationGracePeriodSeconds: 30</li>
            <li><code className="text-slate-400">status:</code> Pod IP、啟動時間、每個容器的詳細狀態</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">kubectl get pods -A：看所有 Namespace</p>
          <p className="text-slate-300 text-sm">kube-system 裡面就是上午講的系統組件：etcd、kube-apiserver、kube-scheduler、kube-controller-manager、kube-proxy、coredns</p>
        </div>
      </div>
    ),
    code: `# dry-run 產生 YAML 模板（不會真的建立）
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml

# 存成檔案
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml

# 各種輸出格式
kubectl get pods -o wide               # 多顯示 IP / NODE
kubectl get pods -o yaml | head -30    # 完整配置（前 30 行）
kubectl get pods -A                     # 所有 Namespace

# 內建文件
kubectl explain pod.spec.containers
kubectl explain pod.spec.containers.resources

# 效率設定
source <(kubectl completion bash)       # 自動補全
alias k=kubectl                         # 別名`,
    notes: `好，port-forward 體驗完了。接下來試各種輸出格式。

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

好，kubectl 的進階用法我們全部操作過一遍了。先不要清理 Pod，等一下回頭操作還會用到。 [▶ 下一頁]`,
  },

  // ── Loop 3 學員實作題目 ──
  {
    title: '學員實作：kubectl 進階練習',
    subtitle: 'Loop 3 練習題',
    section: 'Loop 3：kubectl 進階 + port-forward',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 1：dry-run 產生 httpd Pod → port-forward</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>用 <code className="text-green-400">kubectl run my-httpd --image=httpd:2.4 --dry-run=client -o yaml &gt; my-httpd.yaml</code></li>
            <li><code>kubectl apply -f my-httpd.yaml</code></li>
            <li><code>kubectl port-forward pod/my-httpd 9090:80</code></li>
            <li><code>curl localhost:9090</code> → 看到 "It works!"</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 2：-o yaml 找自動填充欄位</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>用 <code className="text-green-400">kubectl get pod my-httpd -o yaml</code> 查看完整配置</li>
            <li>找出你沒寫但 K8s 自動加的欄位（uid、creationTimestamp、restartPolicy...）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 3：kubectl explain 預習 resources</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>用 <code className="text-green-400">kubectl explain pod.spec.containers.resources</code></li>
            <li>了解 limits 和 requests 是什麼（第七堂課會用到）</li>
          </ul>
        </div>
      </div>
    ),
    notes: `螢幕上有三個練習題目，大家按自己的進度做。第一題是用 dry-run 產一個 httpd 的 Pod YAML，存成 my-httpd.yaml，apply 之後 port-forward 到 9090，curl 看到那個經典的 It works 頁面。第二題是用 -o yaml 看你的 Pod 完整配置，找出哪些欄位是 K8s 自動幫你加的，重點看 metadata 裡的 uid 和 creationTimestamp，還有 spec 裡面的 restartPolicy。第三題是用 kubectl explain 預習一下 resources 這個欄位，了解 limits 和 requests 是什麼。這個第七堂課會詳細講。

做完的同學，給你一個探索的方向。試試 kubectl get pod my-nginx -o jsonpath 等於引號大括號 .status.podIP 大括號引號。這個指令可以直接提取 Pod 的 IP 位址。jsonpath 是一個很強大的過濾語法，可以從 JSON 輸出裡面精準抽出你要的欄位。寫自動化腳本的時候非常好用。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ── 4-20 回頭操作 ──
  {
    title: 'port-forward 常見坑 + 探索建議',
    subtitle: '回頭操作 Loop 3',
    section: 'Loop 3：kubectl 進階 + port-forward',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">port-forward 常見坑</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>關掉終端就斷了 -- 它是<strong className="text-white">臨時的除錯工具</strong>，不是正式服務入口</li>
            <li>正式對外服務要用 <strong className="text-cyan-400">Service</strong>（下堂課）</li>
            <li>SSH 環境：port-forward 預設綁 localhost（VM），筆電連不到 → 加 <code>--address 0.0.0.0</code></li>
            <li>port 衝突：如果 8080 被佔了，換一個 port（如 9090:80）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">探索建議（做完的同學試試）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400 text-xs">{"kubectl get pod my-nginx -o jsonpath='{.status.podIP}'"}</code> — 提取 Pod IP</li>
            <li><code className="text-green-400 text-xs">{"kubectl get pod my-nginx -o jsonpath='{.spec.containers[0].image}'"}</code> — 提取 Image 名稱</li>
            <li>jsonpath 在寫自動化腳本的時候非常好用</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，回頭操作時間。

如果你前面有跟上，這段就是複習加補充。如果前面沒跟上，現在就跟著螢幕上的步驟做。

首先確認你有一個 Running 的 Pod。沒有的話就 kubectl run my-nginx --image=nginx:1.27 快速建一個。然後 kubectl port-forward pod/my-nginx 8080:80，開第二個終端 curl localhost:8080，看到 nginx 的歡迎頁面就成功了。Ctrl+C 停掉 port-forward。

這裡我要再強調兩個坑，因為這兩個問題初學者幾乎一定會踩到。

第一個坑，你關掉終端或按 Ctrl+C，port-forward 就斷了。很多同學以為跑了 port-forward 就一直在，結果過一陣子回來發現連不上了。port-forward 它就是一個臨時的除錯工具，你想用多久就得一直開著那個終端。正式對外提供服務不能用 port-forward，要用 Service，下堂課就會學到。

第二個坑，如果你是 SSH 連到 VM 上面操作的。你跑 port-forward 之後在 VM 上 curl localhost:8080 可以通，但你在自己的筆電瀏覽器打 localhost:8080 是通不了的。因為 port-forward 預設綁的是 VM 的 127.0.0.1，不是你筆電的 127.0.0.1。解決方法前面講過了，加 --address 0.0.0.0，讓它監聽 VM 的所有網路介面。然後在你筆電瀏覽器打 VM 的 IP 加 port 就行了。

dry-run 也再提一下。你可能現在覺得 Pod 的 YAML 不難寫，就那幾行嘛。但是後面學到 Deployment、Service、Ingress 的時候，YAML 會越來越長越來越複雜。養成用 dry-run 先產生骨架的習慣，比從零手寫快非常多，也不容易出錯。

好，做完的同學我們繼續往下。接下來是今天最後一個 Loop。前面三個 Loop 我們跑的都是 nginx、httpd、busybox 這些不太需要設定就能跑起來的 Image。但真實世界裡很多服務不是這樣的。你能不能在 K8s 裡面跑一個 MySQL？直覺上應該很簡單，寫個 YAML 改一下 image 就好了對不對？但你真的去試的話，你會發現它跑不起來。為什麼？下一支影片我們來故意試試看。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 4：環境變數 + MySQL + 總結
  // ============================================================

  // ── 4-21 概念（1/2）：問題驅動 + Docker -e 回顧 ──
  {
    title: '環境變數注入：MySQL 為什麼 CrashLoopBackOff？',
    subtitle: '問題驅動：直接跑 MySQL → crash',
    section: 'Loop 4：環境變數 + MySQL + 總結',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：直接跑 MySQL Pod → CrashLoopBackOff</p>
          <p className="text-slate-300 text-sm">MySQL 需要知道 root 密碼才能初始化資料庫。什麼都沒設定 → 不知道怎麼辦 → 直接退出</p>
          <code className="text-red-400 text-xs block mt-2 bg-slate-900/50 p-2 rounded">logs: database is uninitialized and password option is not specified</code>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">回想 Docker</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Docker 做法</th>
                <th className="pb-2">K8s YAML 對應</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code className="text-green-400">docker run -e MYSQL_ROOT_PASSWORD=secret mysql:8.0</code></td>
                <td className="py-2">YAML 的 <code className="text-cyan-400">env:</code> 欄位</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">docker-compose <code>environment:</code></td>
                <td className="py-2">同上，寫法類似</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>.env</code> 檔案管密碼</td>
                <td className="py-2"><code className="text-cyan-400">Secret</code>（下堂課）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">K8s env 語法</p>
          <p className="text-slate-300 text-sm"><code>env</code> 寫在 <code>spec.containers[]</code> 底下，跟 <code>image</code> 同一層</p>
          <p className="text-slate-400 text-xs mt-1">Docker Compose 用 key: value 簡潔寫法，K8s 用 name: + value: 結構化寫法</p>
        </div>
      </div>
    ),
    notes: `好，進入今天最後一個 Loop。

前面三個 Loop 我們跑了 nginx、跑了 httpd、跑了 busybox。這些 Image 有一個共同點，它們不需要任何設定就能正常啟動。但是在真實世界裡，很多服務不是這樣的。最典型的例子就是資料庫。

我現在丟一個情境給大家。你想在 K8s 裡面跑一個 MySQL。根據前面學的知識，你會怎麼寫 YAML？很自然的，apiVersion v1、kind Pod、metadata name mysql-pod、spec containers 裡面放一個 name mysql、image mysql:8.0。跟寫 nginx 的 YAML 沒什麼兩樣，只是把 image 換了一下。看起來很合理，對不對？

但是如果你真的把這個 YAML 拿去 apply，你會得到一個非常讓人沮喪的結果。kubectl get pods 一看，STATUS 不是 Running，而是 CrashLoopBackOff。你看著 RESTARTS 數字一直在往上跳，1、2、3、4。Pod 啟動了就掛，掛了 K8s 自動重啟，啟動了又掛，反反覆覆。

怎麼辦？排錯三兄弟。get pods 看到了 CrashLoopBackOff，describe pod 看 Events 會顯示 Back-off restarting failed container。但最關鍵的資訊在 logs 裡面。kubectl logs mysql-pod，你會看到一行錯誤訊息：database is uninitialized and password option is not specified。翻成白話就是：資料庫還沒初始化，而且你也沒給我密碼，我不知道怎麼辦，我只好退出。

MySQL 的啟動邏輯是這樣的。第一次跑的時候它需要初始化資料庫，而初始化的其中一步就是設定 root 帳號的密碼。你什麼都不告訴它，它就直接退出了。這不是 bug，是 MySQL 故意這樣設計的。沒有密碼就不啟動，逼你設密碼，避免有人跑了一個沒有密碼保護的資料庫。

那怎麼告訴 MySQL 密碼是什麼？回想一下 Docker。在 Docker 裡面你是怎麼跑 MySQL 的？docker run -e MYSQL_ROOT_PASSWORD=my-secret mysql:8.0。關鍵就在那個 -e 參數。-e 是 environment 的意思，設定環境變數。你透過一個叫 MYSQL_ROOT_PASSWORD 的環境變數，告訴 MySQL 容器 root 的密碼是 my-secret。MySQL 啟動的時候讀到這個環境變數，用這個密碼初始化 root 帳號，然後順利啟動。

Docker Compose 裡面也是一樣的道法，在 services 底下的 environment 區塊寫 MYSQL_ROOT_PASSWORD 冒號 my-secret。概念完全一樣，就是用環境變數把設定傳給容器。 [▶ 下一頁]`,
  },

  // ── 4-21 概念（2/2）：pod-mysql.yaml 範例 + 安全性討論 ──
  {
    title: 'MySQL Pod YAML + 安全性討論',
    subtitle: '密碼不該寫在 YAML → Secret 預告',
    section: 'Loop 4：環境變數 + MySQL + 總結',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">env 欄位格式</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>env</code> 跟 <code>image</code> 同一層</li>
            <li>每個環境變數有 <code className="text-green-400">name</code> 和 <code className="text-green-400">value</code></li>
            <li>多個環境變數就多加幾個列表項目（如 <code>MYSQL_DATABASE</code> 自動建資料庫）</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">安全性問題</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>密碼寫在 YAML → git commit → 全團隊（甚至全世界）看得到</li>
            <li>K8s 的 <strong className="text-cyan-400">Secret</strong> 專門管理機密資訊（Base64 編碼，注意不是加密）</li>
            <li>Pod 透過環境變數或掛載檔案讀取 Secret 內容</li>
          </ul>
          <p className="text-slate-400 text-xs mt-2">原則：學習時寫在 YAML 沒問題，<strong className="text-white">生產環境一律用 Secret</strong>。下堂課會教。</p>
        </div>
      </div>
    ),
    code: `# pod-mysql.yaml
apiVersion: v1
kind: Pod
metadata:
  name: mysql-pod
spec:
  containers:
    - name: mysql
      image: mysql:8.0
      env:                              # env 跟 image 同一層
        - name: MYSQL_ROOT_PASSWORD     # 環境變數名稱
          value: "my-secret"            # 環境變數值
        - name: MYSQL_DATABASE          # 可選：自動建資料庫
          value: "testdb"`,
    notes: `K8s 裡面對應的做法是什麼？在 YAML 的容器定義裡面加一個 env 欄位。env 寫在 spec 底下 containers 裡面，跟 image 同一層。格式是這樣的：env 冒號，底下是一個列表。每一個環境變數是列表裡的一個項目，用減號開頭，然後有兩個欄位，name 和 value。name 是環境變數的名字，value 是值。

以 MySQL 為例，name 寫 MYSQL_ROOT_PASSWORD，value 寫 my-secret。就這樣，在你原本的 YAML 裡面多了三四行。

如果你要設多個環境變數呢？就在 env 底下多加幾個列表項目。比如 MySQL 還有一個環境變數叫 MYSQL_DATABASE，你設了它之後，MySQL 啟動的時候會自動幫你建一個同名的資料庫，省得你自己進去 CREATE DATABASE。

跟 Docker Compose 做個對比。Docker Compose 裡面 environment 底下直接寫 MYSQL_ROOT_PASSWORD 冒號 my-secret，簡潔明了。K8s 的 env 要寫 name 冒號 MYSQL_ROOT_PASSWORD、value 冒號 my-secret，看起來比較囉唆。但 K8s 這樣設計是有原因的，因為 env 的 value 除了直接寫死之外，還可以從 ConfigMap 或 Secret 裡面引用。也就是說，值不一定要寫在這裡，可以指向別的地方去取。這個下堂課學 ConfigMap 和 Secret 的時候就會用到。

環境變數不只資料庫會用。很多應用程式都會從環境變數讀取設定。Node.js 可能從 PORT 環境變數決定要監聽哪個 port，從 DATABASE_URL 讀取資料庫連線字串。Python 的 Flask 可能從 FLASK_ENV 判斷是開發模式還是生產模式。在 Docker 裡面你用 -e，在 K8s 裡面你用 env 欄位。概念一模一樣。

最後要講一個安全問題。你打開剛才那個 YAML 檔案看一眼，密碼 my-secret 就明明白白寫在裡面。YAML 檔案通常會放在 Git 倉庫裡面進行版本控制。你 git commit 了這個檔案，密碼就進了版本歷史。倉庫是公開的話全世界都能看到。就算是私有倉庫，團隊裡每個人都能看到。資料庫密碼、API 金鑰，這些東西寫在 YAML 裡面就等於大聲告訴所有人。

K8s 提供了一個叫 Secret 的資源來解決這件事。密碼存在 Secret 裡，Pod 的 YAML 只寫引用，不寫明文。Secret 是下堂課的內容。今天的原則是：學習的時候先把密碼寫在 YAML 沒問題，但你心裡要記住，生產環境一律用 Secret。

好，概念都講清楚了。注意我這支影片只講概念，沒有做 apply。因為我要帶你從故意做錯開始，體驗完整的排錯和修復流程。接下來的實作影片我們馬上動手。 [▶ 下一頁]`,
  },

  // ── 4-22 實作：MySQL 完整操作 ──
  {
    title: 'Lab：MySQL Pod 實作 -- 先做錯再修正',
    subtitle: '完整排錯 + 修復 + 進容器操作',
    section: 'Loop 4：環境變數 + MySQL + 總結',
    duration: '12',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Step 1：故意做錯（不寫 env）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 pod-mysql-broken.yaml（只有 image: mysql:8.0，不寫 env）</li>
            <li><code className="text-green-400">kubectl apply</code> → 等十幾秒 → <code className="text-red-400">CrashLoopBackOff</code></li>
            <li><code className="text-green-400">kubectl logs mysql-broken</code> → 看到 <code className="text-red-400">password option is not specified</code></li>
            <li><code className="text-green-400">kubectl delete pod mysql-broken</code></li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Step 2：修正（加 env）→ 進容器操作</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>建 pod-mysql.yaml（加 MYSQL_ROOT_PASSWORD env）</li>
            <li><code className="text-green-400">kubectl apply</code> → 等 Running（MySQL image 較大，可能 1-2 分鐘）</li>
            <li><code className="text-green-400">kubectl exec -it mysql-pod -- mysql -u root -pmy-secret</code></li>
            <li><code>SHOW DATABASES;</code> → <code>CREATE DATABASE testdb;</code> → <code>SHOW DATABASES;</code></li>
            <li><code>exit</code> → <code className="text-green-400">kubectl delete pod mysql-pod</code></li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">注意</p>
          <p className="text-slate-300 text-sm"><code>-p</code> 和密碼之間<strong className="text-white">沒有空格</strong>：<code className="text-green-400">-pmy-secret</code> 不是 <code className="text-red-400">-p my-secret</code></p>
        </div>
      </div>
    ),
    code: `# Step 1: 故意做錯
kubectl apply -f pod-mysql-broken.yaml
kubectl get pods                           # CrashLoopBackOff
kubectl logs mysql-broken                  # password not specified
kubectl delete pod mysql-broken

# Step 2: 修正
kubectl apply -f pod-mysql.yaml
kubectl get pods --watch                   # 等 Running

# Step 3: 進容器操作 MySQL
kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
# mysql> SHOW DATABASES;
# mysql> CREATE DATABASE testdb;
# mysql> SHOW DATABASES;
# mysql> exit

# 清理
kubectl delete pod mysql-pod`,
    notes: `好，我們來動手做。大家把終端機打開，進到 k8s-course-labs/lesson4。

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

好，MySQL Pod 的實作完成了。接下來是今天最後一支影片，我們來做第四堂課的完整總結，然後看看下堂課要學什麼。 [▶ 下一頁]`,
  },

  // ── Loop 4 學員自由練習題目 ──
  {
    title: '學員自由練習',
    subtitle: 'Loop 4 練習題',
    section: 'Loop 4：環境變數 + MySQL + 總結',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做題</p>
          <div className="space-y-3">
            <div>
              <p className="text-slate-300 text-sm font-semibold">1. MySQL Pod（設環境變數）</p>
              <p className="text-slate-400 text-xs">自己從頭寫 YAML，加上 MYSQL_ROOT_PASSWORD env。apply → exec 進去建資料庫 → 清理。</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm font-semibold">2. 回顧題（不看筆記）</p>
              <p className="text-slate-400 text-xs">從零手寫 nginx Pod YAML → apply → port-forward → 瀏覽器看到 Welcome to nginx → 刪除。卡住再翻筆記。</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">挑戰題（有時間再做）</p>
          <div className="space-y-3">
            <div>
              <p className="text-slate-300 text-sm font-semibold">3. Redis Pod</p>
              <p className="text-slate-400 text-xs">image: <code>redis:7</code>（不需要環境變數）</p>
              <code className="text-green-400 text-xs block mt-1">kubectl exec -it redis-pod -- redis-cli ping</code>
              <p className="text-slate-400 text-xs">應該回 PONG</p>
            </div>
            <div>
              <p className="text-slate-300 text-sm font-semibold">4. Python HTTP Server</p>
              <p className="text-slate-400 text-xs">image: <code>python:3.12</code>，command: <code>["python", "-m", "http.server", "8000"]</code></p>
              <p className="text-slate-400 text-xs">port-forward 到 8000，瀏覽器看到目錄列表</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，大家辛苦了，我們到了第四堂課最後一支影片。這支影片我做三件事。第一，如果你前面的 MySQL Pod 沒跟上，我快速帶你做一遍。第二，回顧今天學的所有東西。第三，預告下堂課的內容，給你一個期待。

先快速帶做 MySQL Pod。如果你已經做過了，趁這個時間整理一下你的筆記或者做自由練習。

用 dry-run 快速產生骨架。kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml 大於號 pod-mysql.yaml。打開檔案，找到 image 冒號 mysql:8.0 那行。在同一層，加上 env 冒號。底下減號空格 name 冒號 MYSQL_ROOT_PASSWORD，下一行 value 冒號引號 my-secret 引號。存檔。kubectl apply -f pod-mysql.yaml。等 Running 之後 kubectl exec -it mysql-pod 兩個減號 mysql -u root -pmy-secret。進去 SHOW DATABASES 分號確認一下。exit 離開。kubectl delete pod mysql-pod 清理。OK，不到兩分鐘就做完了。

好，螢幕上有自由練習題目，分必做和挑戰兩組。

必做第一題，自己從頭寫一個 MySQL Pod 的 YAML，加上 MYSQL_ROOT_PASSWORD 環境變數，apply 之後 exec 進去建一個資料庫，確認成功再刪掉。必做第二題，不看任何筆記，從零手寫一個 nginx Pod 的 YAML。apply、port-forward、從瀏覽器看到 Welcome to nginx 頁面、然後刪除。如果卡住了再翻筆記，看看是卡在哪裡。

挑戰題給有餘力的同學。第一個是跑一個 Redis Pod，image 用 redis:7，Redis 不需要設環境變數就能啟動。跑起來之後用 kubectl exec -it redis-pod 兩個減號 redis-cli ping，如果回 PONG 就成功了。第二個是跑一個 Python HTTP Server，image 用 python:3.12，但你要在 YAML 裡面加 command 欄位覆蓋掉預設的啟動指令，設成 python -m http.server 8000。然後 port-forward 到 8000，瀏覽器會看到一個目錄列表的頁面。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ── 4-23（修改版）：Loop 4 回頭操作 — MySQL Pod 補做 + 銜接 Deployment ──
  {
    title: 'Loop 4 回頭操作：MySQL Pod',
    subtitle: '沒跟上的快速補做 + 銜接下一個 Loop',
    section: 'Loop 4：環境變數 + MySQL',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">沒跟上的同學，快速補做 MySQL Pod</p>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`kubectl run mysql-pod --image=mysql:8.0 --dry-run=client -o yaml > pod-mysql.yaml
# 編輯加 env → apply → exec 驗證 → delete`}
          </pre>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded mt-2 overflow-x-auto whitespace-pre-wrap">
{`# pod-mysql.yaml 關鍵部分
spec:
  containers:
  - name: mysql
    image: mysql:8.0
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "my-secret"`}
          </pre>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded mt-2 overflow-x-auto whitespace-pre-wrap">
{`kubectl apply -f pod-mysql.yaml
kubectl get pods -w              # 等 Running
kubectl exec -it mysql-pod -- mysql -u root -pmy-secret
# SHOW DATABASES; → exit
kubectl delete pod mysql-pod`}
          </pre>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Loop 4 小結</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>MySQL 不給密碼 → CrashLoopBackOff</li>
            <li>排錯三兄弟找原因 → <code className="text-yellow-300">env</code> 欄位注入環境變數 → 正常啟動</li>
            <li>Docker <code className="text-yellow-300">-e KEY=VALUE</code> = K8s <code className="text-yellow-300">env:</code> 欄位</li>
          </ul>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">銜接下一個 Loop</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>今天跑的所有 Pod 都有一個共同的弱點</li>
            <li><strong className="text-white">刪掉就沒了，沒人幫你補</strong></li>
            <li>「一個人做事」→ 下一個 Loop 要變成「一個團隊做事」</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，MySQL Pod 的概念和實作都跑完了。如果你前面沒跟上，趁這個時間快速補做一下。

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

上午的概念篇其實已經提過 Deployment 了，它負責管理多個副本、自動補 Pod、滾動更新。但是光聽概念跟親手操作是完全不一樣的。接下來的影片，我要讓你親眼看到「一個人」有多脆弱，然後親手感受「一個團隊」有多強大。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 5：Deployment 入門
  // ============================================================

  // ── 4-24 Deployment 初體驗（1/3）：問題 vs 解法 ──
  {
    title: 'Pod 的致命弱點：刪了就沒了',
    subtitle: '從「一個人做事」到「一個團隊做事」',
    section: 'Loop 5：Deployment 入門',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題：一個人做事，倒了就停了</p>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`kubectl run lonely-nginx --image=nginx:1.27
kubectl get pods                    # Running，看起來很好
kubectl delete pod lonely-nginx
kubectl get pods                    # 空的。沒了。沒人幫你補。`}
          </pre>
          <p className="text-slate-400 text-xs mt-2">如果這是生產環境... 使用者 → Pod 掛了 → 錯誤頁面（沒人幫你重建）</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">解法：Deployment = 告訴 K8s「我要幾個 Pod，你幫我維持」</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">動作</th>
                <th className="pb-2 pr-4">直接建 Pod</th>
                <th className="pb-2">透過 Deployment</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">刪掉一個 Pod</td>
                <td className="py-1 pr-4 text-red-400">沒了就沒了</td>
                <td className="py-1 text-green-400">自動補一個新的</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">想要 3 個</td>
                <td className="py-1 pr-4 text-red-400">手動建 3 次</td>
                <td className="py-1 text-green-400">replicas: 3 一行搞定</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">半夜 Pod 掛了</td>
                <td className="py-1 pr-4 text-red-400">你爬起來手動補</td>
                <td className="py-1 text-green-400">K8s 自動補</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，進入今天最後一個 Loop，也是今天最精彩的部分。

在開始之前，我要先讓大家親身感受一件事。我們先建一個「孤獨的」nginx Pod。

指令：kubectl run lonely-nginx --image=nginx:1.27

等幾秒鐘，看狀態。

指令：kubectl get pods

STATUS 是 Running。看起來很好對不對？一切正常，nginx 在跑。

好，現在假設出事了。半夜三點，這個 Pod 因為某些原因掛了。我們用 delete 來模擬這個情況。

指令：kubectl delete pod lonely-nginx

好，刪掉了。現在看看。

指令：kubectl get pods

大家看看螢幕。空的。什麼都沒有。No resources found in default namespace。你的 nginx 消失了。如果這是生產環境的 API 服務，你的使用者現在正看著一個錯誤頁面。你要嘛自己爬起來手動再建一個，要嘛等到明天上班才發現。不管哪種，這段時間你的服務就是停了。

這就是我們說的「一個人做事」。一個人倒了，事情就停了。沒有人幫你頂上。

所以我們需要一個東西，能夠告訴 K8s：「我要三個 nginx Pod，你幫我維持。少了一個你就自動補。」這個東西就是 Deployment。 [▶ 下一頁]`,
  },

  // ── 4-24 Deployment 初體驗（2/3）：deployment.yaml 完整範例 ──
  {
    title: 'Deployment YAML（對照 Pod YAML）',
    subtitle: '多了三樣東西：replicas + selector + template',
    section: 'Loop 5：Deployment 入門',
    duration: '15',
    code: `# deployment.yaml
apiVersion: apps/v1              # 不是 v1，是 apps/v1
kind: Deployment                 # 不是 Pod，是 Deployment
metadata:
  name: nginx-deploy
spec:
  replicas: 3                    # 新！要幾個副本
  selector:                      # 新！怎麼找 Pod
    matchLabels:
      app: nginx
  template:                      # 新！Pod 的模板
    metadata:
      labels:
        app: nginx               # ⚠️ 必須跟 selector 一致！
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80`,
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Pod YAML vs Deployment YAML 差異</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">欄位</th>
                <th className="pb-2 pr-4">Pod YAML</th>
                <th className="pb-2">Deployment YAML</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">apiVersion</td>
                <td className="py-1 pr-4"><code>v1</code></td>
                <td className="py-1"><code className="text-yellow-300">apps/v1</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">kind</td>
                <td className="py-1 pr-4"><code>Pod</code></td>
                <td className="py-1"><code className="text-yellow-300">Deployment</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">容器定義位置</td>
                <td className="py-1 pr-4"><code>spec.containers</code></td>
                <td className="py-1"><code className="text-yellow-300">spec.template.spec.containers</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">多了什麼</td>
                <td className="py-1 pr-4 text-slate-500">沒有</td>
                <td className="py-1"><code className="text-yellow-300">replicas</code> + <code className="text-yellow-300">selector</code> + <code className="text-yellow-300">template</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">三個新欄位</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-yellow-300">replicas: 3</code> -- 要維持幾個 Pod</li>
            <li><code className="text-yellow-300">selector.matchLabels</code> -- 用什麼標籤找到自己的 Pod</li>
            <li><code className="text-yellow-300">template</code> -- Pod 的模板（長得跟 Pod YAML 幾乎一樣）</li>
          </ol>
        </div>
      </div>
    ),
    notes: `Deployment 怎麼寫？我們來看 YAML。大家把終端機裡的編輯器打開，建一個新檔案叫 deployment.yaml。

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

我幫大家整理一下。跟 Pod YAML 比起來，Deployment YAML 多了三樣東西。第一，replicas，要幾個副本。第二，selector，怎麼找到自己的 Pod。第三，template，Pod 長什麼樣子。其他的部分，apiVersion 從 v1 變成 apps/v1，kind 從 Pod 變成 Deployment，容器定義的位置從 spec.containers 變成 spec.template.spec.containers。就這些差異。如果你 Pod YAML 寫得很熟了，Deployment YAML 只是多包了一層而已。 [▶ 下一頁]`,
  },

  // ── 4-24 Deployment 初體驗（3/3）：三層關係 + 刪 Pod 自動補 ──
  {
    title: '三層關係：Deployment → ReplicaSet → Pod',
    subtitle: '刪 Pod 自動補回來的驚喜',
    section: 'Loop 5：Deployment 入門',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">三層結構</p>
          <pre className="text-cyan-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre">
{`┌─────────────────────────────────────┐
│           Deployment                │  ← 你管這個
│  ┌───────────────────────────────┐  │
│  │         ReplicaSet            │  │  ← 自動建立，你不用管
│  │  ┌───────┐ ┌───────┐ ┌─────┐ │  │
│  │  │ Pod 1 │ │ Pod 2 │ │Pod 3│ │  │  ← 自動維持數量
│  │  └───────┘ └───────┘ └─────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘`}
          </pre>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">實作：部署 + 驗證三層 + 刪 Pod 自動補</p>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`# 部署
kubectl apply -f deployment.yaml

# 一次看三層
kubectl get deploy,rs,pods

# 重點實驗：刪掉一個 Pod
kubectl delete pod <任意一個 pod 名字>
kubectl get pods                 # 還是 3 個！自動補回來了！`}
          </pre>
        </div>
      </div>
    ),
    notes: `好，YAML 寫完了，存檔。我們來部署。

指令：kubectl apply -f deployment.yaml

看到 deployment.apps/nginx-deploy created，成功了。

現在我們來驗證三層結構。Deployment 自動建了 ReplicaSet，ReplicaSet 自動建了 Pod。我們一層一層看。

先看 Deployment。

指令：kubectl get deployments

你會看到 nginx-deploy，READY 欄位顯示 3/3。3/3 表示你要求的三個副本全部就緒了。如果顯示 0/3 或 1/3，表示 Pod 還在建立中，等一下就好。

再看 ReplicaSet。

指令：kubectl get replicasets

你會看到一個名字像 nginx-deploy 後面接一串亂碼的東西。這個 ReplicaSet 是 Deployment 自動建立的，你不需要手動建，甚至不需要知道它叫什麼。DESIRED 和 CURRENT 都是 3，表示期望三個、實際三個。

最後看 Pod。

指令：kubectl get pods

三個 Pod，名字的格式是 nginx-deploy 中間接 ReplicaSet 的 hash 最後接 Pod 自己的隨機字串。三個 Pod 都是 Running。

你也可以用一個指令同時看三層。

指令：kubectl get deploy,rs,pods

deploy 是 deployments 的簡寫，rs 是 replicasets 的簡寫。一個指令三個資源類型，所有資訊一目了然。

好，三層結構都確認了。現在來做今天最精彩的實驗。

從三個 Pod 裡面隨便挑一個，把它的名字複製下來，然後刪掉它。

指令：kubectl delete pod <任意一個 pod 名字>

刪掉之後馬上看。

指令：kubectl get pods

大家看到了嗎？還是三個 Pod。但仔細看，有一個 Pod 的名字跟剛才不一樣了，而且它的 AGE 顯示幾秒鐘。這就是 ReplicaSet 在幕後做的事情。它持續監控 Pod 的數量，發現從三個變成兩個了，不符合你定義的 replicas 冒號 3，所以馬上自動建了一個新的 Pod 補上去。整個過程你什麼都不用做，K8s 幫你搞定了。

對比一下剛才的體驗。lonely-nginx 那個 Pod 是我們直接用 kubectl run 建的，刪掉就真的沒了。但是透過 Deployment 建的 Pod，你刪一個它就補一個。除非你刪的是 Deployment 本身。

這就是從「一個人」變成「一個團隊」。一個人走了就沒人了。但是一個團隊，有人離開了，馬上有新人補上。團隊的人數永遠維持在你設定的數量。半夜三點 Pod 掛了？沒關係，K8s 自動補。你不用爬起來，不用手動建，甚至可能根本不知道發生過這件事。明天早上看一下監控，會發現曾經有一次 Pod 重建的紀錄，但服務從來沒有中斷過。

這就是 Deployment 的威力。再讓你感受一個更爽的。假設雙十一流量暴增，你需要從 3 個 Pod 擴到 5 個。

指令：kubectl scale deployment nginx-deploy --replicas=5

馬上看。

指令：kubectl get pods

五個 Pod 了。多出來的兩個正在建立或已經 Running。想縮回來也很簡單。

指令：kubectl scale deployment nginx-deploy --replicas=2

再看。

指令：kubectl get pods

多出來的三個正在被砍掉，最後只剩兩個。一行指令就完成擴縮容。

Deployment 還有更多強大的功能，像是滾動更新、版本回滾。這些我們下堂課會詳細學。今天你只需要記住一件事：不要直接建 Pod，要透過 Deployment 來管理 Pod。

最後清理。

指令：kubectl delete deployment nginx-deploy [▶ 下一頁]`,
  },

  // ── 4-25 學員實作 ──
  {
    title: 'Loop 5 學員實作',
    subtitle: 'Deployment 動手做 + kubectl scale 擴縮容',
    section: 'Loop 5：Deployment 入門',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做 1：httpd Deployment（replicas: 2）</p>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`kubectl apply -f deployment-httpd.yaml
kubectl get deploy,rs,pods           # 確認 2 個 Pod
kubectl delete pod <任意一個>         # 觀察自動補回
kubectl get pods                     # 還是 2 個！
kubectl delete -f deployment-httpd.yaml   # 清理`}
          </pre>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">必做 2：用 kubectl scale 擴縮容</p>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`# 先確保 nginx-deploy 還在
kubectl get deploy

# 擴容：3 → 5
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods                     # 5 個 Pod

# 縮容：5 → 2
kubectl scale deployment nginx-deploy --replicas=2
kubectl get pods                     # 多的被砍掉，剩 2 個`}
          </pre>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">挑戰：觀察 Pod 分散</p>
          <pre className="text-green-300 text-xs bg-slate-900/80 p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`kubectl get pods -o wide             # 看 NODE 欄位
# minikube 只有一個 Node → 全部在同一台
# 第五堂用 k3s 多節點 → 會看到 Pod 分散在不同 Node`}
          </pre>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">對照 Docker Compose</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">動作</th>
                <th className="pb-2 pr-4">Docker Compose</th>
                <th className="pb-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">擴到 5 個</td>
                <td className="py-1 pr-4"><code>docker compose up --scale web=5</code></td>
                <td className="py-1"><code>kubectl scale deploy xxx --replicas=5</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">縮回 2 個</td>
                <td className="py-1 pr-4"><code>docker compose up --scale web=2</code></td>
                <td className="py-1"><code>kubectl scale deploy xxx --replicas=2</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">自動補 Pod</td>
                <td className="py-1 pr-4 text-red-400">做不到（除非 Swarm）</td>
                <td className="py-1 text-green-400">Deployment 自動補</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">跨機器分散</td>
                <td className="py-1 pr-4 text-red-400">做不到（除非 Swarm）</td>
                <td className="py-1 text-green-400">Scheduler 自動分配 Node</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `這是學員實作時間，沒有錄影片。同學們自己動手操作。

必做 1：寫一個 httpd Deployment YAML，replicas 設 2。apply 之後確認兩個 Pod 在跑。然後刪掉其中一個 Pod，觀察自動補回來。最後 delete -f 清理。

必做 2：用 kubectl scale 做擴縮容。先確保 nginx-deploy 還在，然後 kubectl scale deployment nginx-deploy --replicas=5，看到 Pod 從 3 個變成 5 個。再 kubectl scale deployment nginx-deploy --replicas=2，多的 Pod 被砍掉，剩 2 個。

挑戰題：kubectl get pods -o wide 看 NODE 欄位。minikube 只有一個 Node，所以全部 Pod 都在同一台。第五堂課換成 k3s 多節點之後，你會看到 Pod 分散在不同的 Node 上。 [▶ 下一頁]`,
  },

  // ── 4-26 第四堂完整總結（1/2）：知識清單 + Docker 對照表 ──
  {
    title: '第四堂完整總結：今天學了什麼',
    subtitle: 'Pod + Deployment 知識清單（11 項）+ Docker 對照表',
    section: 'Loop 5：Deployment 入門',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">第四堂完整回顧（因果鏈）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">時段</th>
                <th className="pb-2">因果鏈</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">上午前半</td>
                <td className="py-1">Docker 五個瓶頸 → 需要 K8s → 八概念因果鏈 → Master-Worker 架構</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">上午後半</td>
                <td className="py-1">minikube 搭環境 → YAML 四欄位 → 第一個 Pod CRUD</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">下午 L1</td>
                <td className="py-1">Pod 壞了怎麼辦 → 排錯三兄弟（get → describe → logs）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">下午 L2</td>
                <td className="py-1">一個容器不夠 → Sidecar 多容器 Pod + emptyDir</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">下午 L3</td>
                <td className="py-1">kubectl 資訊不夠 → -o wide / port-forward / dry-run / explain</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">下午 L4</td>
                <td className="py-1">MySQL 跑不起來 → env 環境變數注入</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-cyan-400">下午 L5</td>
                <td className="py-1">Pod 刪了沒人補 → Deployment 自動維持副本數</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Pod + Deployment 知識清單（11 項）</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p className="text-cyan-400 text-xs font-semibold mb-1">Pod 基礎（9 項）</p>
              <ol className="text-slate-300 text-xs space-y-0.5 list-decimal list-inside">
                <li>Pod 概念 + 為什麼不是直接管容器</li>
                <li>YAML 四大欄位</li>
                <li>Pod CRUD 六指令</li>
                <li>Pod 生命週期 + 狀態</li>
                <li>排錯三兄弟</li>
                <li>多容器 Pod / Sidecar</li>
                <li>port-forward</li>
                <li>dry-run 產生模板</li>
                <li>環境變數注入（env）</li>
              </ol>
            </div>
            <div>
              <p className="text-cyan-400 text-xs font-semibold mb-1">Deployment 入門（2 項）</p>
              <ol className="text-slate-300 text-xs space-y-0.5 list-decimal list-inside" start={10}>
                <li>三層關係（Deployment → ReplicaSet → Pod）</li>
                <li>刪 Pod 自動補回（自我修復）</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Docker → K8s 完整對照表（更新版）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">你會的 Docker</th>
                <th className="pb-2">今天學的 K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker run nginx</code></td>
                <td className="py-1"><code>kubectl apply -f pod.yaml</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker run -p 8080:80</code></td>
                <td className="py-1"><code>kubectl port-forward pod/xxx 8080:80</code>（臨時）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker run -e KEY=VALUE</code></td>
                <td className="py-1">YAML 裡的 <code>env:</code> 欄位</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker ps</code></td>
                <td className="py-1"><code>kubectl get pods</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker logs</code></td>
                <td className="py-1"><code>kubectl logs</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker exec -it</code></td>
                <td className="py-1"><code>kubectl exec -it -- /bin/sh</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker stop / rm</code></td>
                <td className="py-1"><code>kubectl delete pod</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker inspect</code></td>
                <td className="py-1"><code>kubectl describe pod</code> / <code>-o yaml</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker-compose.yaml</code></td>
                <td className="py-1">K8s YAML（apiVersion / kind / metadata / spec）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker compose --scale</code></td>
                <td className="py-1"><code>kubectl scale deployment</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>--restart always</code>（單機）</td>
                <td className="py-1">Deployment <code>replicas</code>（跨 Node 自動補）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，大家辛苦了，我們來到了第四堂課的最後一支影片。

先做一件事。如果你前面的 Deployment 沒跟上，我快速帶你做一遍。已經做過的同學，趁這個時間做自由練習或整理筆記。

指令：kubectl apply -f deployment.yaml

然後一次看三層。

指令：kubectl get deploy,rs,pods

確認 Deployment 的 READY 是 3/3，ReplicaSet 有一個，Pod 有三個都是 Running。接著做核心實驗，隨便挑一個 Pod 刪掉。

指令：kubectl delete pod <任意一個 pod 名字>

然後馬上看。

指令：kubectl get pods

還是三個 Pod，但有一個是新建的。這就是 Deployment 的自我修復能力。

確認完了之後，清掉 Deployment。

指令：kubectl delete -f deployment.yaml

注意，你要刪 Deployment 就用 delete -f 指定 YAML 檔案，或者 kubectl delete deployment nginx-deploy。刪掉 Deployment 的時候，底下的 ReplicaSet 和 Pod 會一起被刪掉。這跟刪單一個 Pod 不同，刪 Pod 會被自動補回來，但刪 Deployment 就是真的全部砍掉。

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

Docker 對照表也更新了，多了兩行。docker compose --scale 對應 kubectl scale deployment。Docker 的 --restart always 只能管同一台機器，Deployment 的 replicas 可以跨 Node 自動補 Pod。大家截圖存起來當速查卡。 [▶ 下一頁]`,
  },

  // ── 4-26 第四堂完整總結（2/2）：回家作業 + 下堂課預告 ──
  {
    title: '回家作業 + 下堂課預告',
    subtitle: '今天你學會了建一個團隊，下堂課讓團隊對外服務',
    section: 'Loop 5：Deployment 入門',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">回家作業</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li>不看筆記，從零寫 nginx Pod YAML → 完整 CRUD 流程</li>
            <li>跑不同 image：redis / python:3.12 / busybox:1.36 → 觀察行為差異</li>
            <li><strong className="text-white">寫一個 Deployment YAML（replicas: 3）→ 刪 Pod 觀察自動補回 → scale 到 5 再縮回 3</strong></li>
            <li>進階：MySQL Pod + env → exec 建資料庫</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">下堂課預告</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">解決什麼問題</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">Deployment 進階</td>
                <td className="py-2">擴縮容、滾動更新、版本回滾</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">Service</td>
                <td className="py-2">port-forward 是臨時的 → 正式的存取入口</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">k3s 多節點</td>
                <td className="py-2">minikube 只有一台 → Pod 真正分散到不同 Node</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">一個比喻</p>
          <p className="text-slate-300 text-sm">今天你學會了<strong className="text-white">建一個團隊</strong></p>
          <p className="text-slate-300 text-sm">下堂課你要學怎麼讓這個團隊<strong className="text-white">對外服務</strong>、怎麼<strong className="text-white">無痛換人</strong>、怎麼<strong className="text-white">自動加人</strong></p>
        </div>
      </div>
    ),
    notes: `回家作業四個。第一，不看筆記從零寫 nginx Pod YAML，走一遍完整的 CRUD 流程。第二，跑不同的 Image 觀察行為差異，redis 會一直 Running，python 不給 command 會直接退出。第三，今天新加的，寫一個 Deployment YAML，replicas 設 3，刪 Pod 觀察自動補回，然後用 kubectl scale 擴到 5 再縮回 3。第四是進階題，MySQL Pod 加環境變數，進去建資料庫。

最後預告下堂課。

今天你學會了建一個團隊，你的 Pod 不再是孤軍奮戰了。但是你有沒有想過三件事？

第一，團隊要怎麼對外服務？你的使用者怎麼連到你的 Pod？今天用的 port-forward 只是臨時的除錯工具，關掉終端就斷了。下堂課要學的 Service 才是正式讓外部流量連進來的方式。

第二，團隊要怎麼無痛換人？假設 nginx 要從 1.27 更新到 1.28，你不能把三個 Pod 全部停掉再換，那樣使用者會斷線。下堂課要學的滾動更新，新的 Pod 起來了再關舊的，使用者完全感覺不到。

第三，團隊要怎麼自動加人？雙十一流量暴增，你要從 3 個 Pod 擴到 10 個。手動去改 replicas 太慢了。下堂課會教你用 kubectl scale 快速擴縮容。

用一個比喻來結尾。今天你學會了建一個團隊。下堂課你要學怎麼讓這個團隊對外接客、怎麼無痛換血、怎麼因應旺季自動加人。從「有團隊」到「團隊能運作」，這就是第五堂課的價值。

還有一個讓人期待的東西。今天我們用的 minikube 是單節點的，所有 Pod 都擠在同一台機器上。下堂課我們要建一個真正的多節點叢集，用 k3s 開三台虛擬機。你會看到 kubectl get pods -o wide 的時候，不同的 Pod 分散在不同的 Node 上。那個感覺跟今天在 minikube 上操作是完全不一樣的。

好，第四堂課到這裡全部結束。今天從完全不認識 K8s 到能夠操作 Pod 和 Deployment，大家真的辛苦了。回去好好消化，把四個回家作業做一做。下堂課我們會進入更精彩的部分。

下堂課見，大家辛苦了。 [▶ 第四堂結束]`,
  },
]
