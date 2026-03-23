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
    notes: `好，歡迎回來。上午我們從零寫出第一個 Pod YAML，做了完整的 CRUD。但上午有個前提：YAML 是對的、Image 名字是對的，一切很順利。現實工作中呢？大概一半的時間你都在處理各種問題。Image 打錯、版本不存在、程式啟動就 crash。你 get pods 一看，STATUS 不是 Running，而是一串沒見過的英文。

所以這張投影片要搞懂 Pod 的生命週期。Pending 是排隊中，Scheduler 在找 Node。ContainerCreating 是 kubelet 在拉 Image、建容器。Running 是正常運行。但真正讓你頭痛的是錯誤狀態：ErrImagePull 拉 Image 失敗，ImagePullBackOff 重複拉失敗在退避重試，CrashLoopBackOff 是程式一啟動就 crash，K8s 反覆重啟。 [▶ 下一頁]`,
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
    notes: `狀態認識了，碰到問題該怎麼辦？排錯三兄弟，練到變成反射動作。第一步 get pods 看狀態，判斷大方向——看到 ImagePullBackOff 就知道是 Image 問題，看到 CrashLoopBackOff 就知道是程式問題。第二步 describe pod 看 Events，90% 的問題在 Events 就能找到線索。第三步 logs 看程式輸出，解決「啟動了又掛了」的問題。

CrashLoopBackOff 的退避策略是指數退避：10s、20s、40s、80s，最長 5 分鐘封頂。你看到 Pod 長時間沒反應，不是 K8s 放棄了，是在退避等待中。好，概念講完了，接下來我們故意把 Pod 搞壞，用排錯三兄弟一步一步找到原因。 [▶ 下一頁]`,
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
    notes: `我們來實戰第一個錯誤。image 故意寫成 ngin，少一個 x。apply 之後 K8s 說 created，但 created 只代表收到請求，不代表 Pod 在跑。get pods 一看，STATUS 是 ErrImagePull，等幾秒變成 ImagePullBackOff。用 --watch 持續觀察，狀態在兩者之間來回切換。

describe pod 拉到最下面看 Events，會清楚寫著 Failed to pull image "ngin"。破案了，Image 名字打錯。修正方法：delete → 改 YAML 把 ngin 改成 nginx:1.27 → 重新 apply。不建議用 kubectl edit，因為改的內容不會反映到 YAML 檔案，下次 apply 同樣的錯又會出現。 [▶ 下一頁]`,
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
    notes: `第二個錯誤，CrashLoopBackOff。這次 Image 是對的 nginx:1.27，但加了 command: exit 1，容器一啟動就以錯誤狀態退出。K8s 自動重啟，又退出，形成無限循環。注意 exit 是 shell 內建指令，必須用 /bin/sh -c 包一層。

get pods 看到 CrashLoopBackOff，RESTARTS 一直增加。describe 看 Events 寫 Back-off restarting failed container。logs 可能是空的，因為程式還沒輸出就退出了。試試 logs --previous 看上一個已結束容器的日誌。真實場景中 Java Exception 或 Python Traceback 會出現在 logs 裡。

口訣：describe 解決「為什麼啟動不了」，logs 解決「為什麼啟動了又掛了」。 [▶ 下一頁]`,
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
    notes: `好，排錯流程你們都看過一遍了，現在換你們自己來。給大家 10 分鐘，兩個練習題。題目一是 YAML 縮排故意打錯，apply 會直接報錯，這個不需要排錯三兄弟，K8s 會告訴你 error parsing。題目二是觀察 CrashLoopBackOff 的退避行為，用 --watch 感受間隔 10 秒、20 秒、40 秒越來越長。做完的同學可以試試探索建議。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
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
    notes: `回頭操作時間。這段是給前面沒跟上的同學補做用的。帶做重點：

排錯六步驟要練到變成反射動作——apply、get pods 看狀態、describe 看 Events 找原因、delete 刪掉壞的、改 YAML、重新 apply。兩個練習都走一遍。

常見坑提醒：Image 名字永遠小寫、tag 確認存在（nginx:1.27、httpd:2.4、busybox:1.36）、command 裡用 exit 要用 /bin/sh -c 包。做完的同學試試把 kind 打成 Podd、apiVersion 改成 v2，觀察不同錯誤訊息。確認環境清乾淨，我們進入下一個 Loop。 [▶ 下一頁]`,
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
    notes: `排錯技能解鎖了，接下來碰到一個新問題。排錯的時候你用 kubectl logs 看日誌，但很多應用程式的日誌不只輸出到 stdout，還會寫到檔案。比如 nginx 的 access.log。老闆說要把日誌即時收集到集中式日誌系統，你會怎麼做？

在 nginx 容器裡面裝日誌收集工具？違反「一個容器只做一件事」。跑另一個獨立 Pod？跨 Pod 讀檔案太麻煩。K8s 的方案：同一個 Pod 放兩個容器，透過共享 Volume 傳遞日誌。這就是 Sidecar 模式——主容器是摩托車，Sidecar 是邊車。共享網路（同一個 IP，localhost 互連）和共享儲存（emptyDir）。emptyDir 是臨時空目錄，Pod 建立時出現、刪除時消失。 [▶ 下一頁]`,
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
    notes: `什麼時候用多容器 Pod、什麼時候用多個獨立 Pod？判斷標準很簡單：拿掉一個容器，另一個還能不能正常工作？

nginx + 日誌收集器：拿掉收集器，nginx 還能跑；拿掉 nginx，收集器沒事做。緊密耦合，放一起。nginx + MySQL：各自獨立，而且擴縮需求不同——nginx 可能要 5 個副本，MySQL 不需要跟著擴到 5 個。放在同一個 Pod 的話 nginx 擴 5 個 MySQL 也跟著 5 個，完全不是你想要的。所以要分開。

不確定的話就先分開，一個 Pod 一個容器是最安全的選擇。好，概念講清楚了，接下來動手做一個 Sidecar Pod。 [▶ 下一頁]`,
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
    notes: `YAML 比之前長，但結構很清楚。兩個 containers 掛載同一個 shared-logs Volume（emptyDir 類型）。nginx 寫日誌到 /var/log/nginx，busybox 用 tail -f 讀同一個目錄。

技術細節：nginx 官方 Image 預設把 access.log symlink 到 /dev/stdout。掛了 emptyDir 到 /var/log/nginx 會覆蓋 symlink，nginx 就改寫真正的檔案，Sidecar 才讀得到。

busybox 的 command 為什麼要加 while 等待？因為同一個 Pod 裡的容器是同時啟動的，K8s 不保證順序。busybox 比 nginx 先跑起來的話，access.log 還不存在，直接 tail -f 會 crash。這就是 race condition，加 while 迴圈等檔案出現再讀。 [▶ 下一頁]`,
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
    notes: `部署之後 get pods，注意 READY 欄位。之前都是 1/1，這次是 2/2，代表兩個容器都準備好了。多容器 Pod 用 exec 或 logs 必須加 -c 指定容器名字，不加的話 K8s 會提示你選。

驗證流程：kubectl exec -it sidecar-pod -c nginx -- /bin/sh 進 nginx 容器，裝 curl（apt-get update && apt-get install -y curl），curl localhost 打三次產生 access log，exit 出來。然後 kubectl logs sidecar-pod -c log-reader，看到三行 access log 就成功了。

nginx 寫日誌到共享 Volume，busybox 讀出來輸出到 stdout，你用 kubectl logs 看到的就是 busybox 的 stdout。這就是 Sidecar 的精髓。 [▶ 下一頁]`,
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
    notes: `好，Sidecar 你們也看過一遍了，現在換你們自己做。10 分鐘，兩個題目。題目一是用 httpd 取代 nginx 做同樣的 Sidecar Pod。關鍵差異：httpd 日誌目錄是 /usr/local/apache2/logs，access log 檔名是 access_log（底線不是點）。Volume mountPath 要改。

進階題是把 busybox 的 command 改成 while true; do wc -l; sleep 5; done，每 5 秒統計日誌行數，模擬監控 Sidecar。做完的同學試試拿掉 while 等待迴圈看 race condition 效果。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
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
    notes: `回頭操作時間，帶做一遍 Sidecar Pod 完整流程。帶做重點：

建 pod-sidecar.yaml，兩個容器 nginx + log-reader 掛同一個 shared-logs Volume。apply 之後 get pods 看到 2/2 Running。exec -c nginx 進去裝 curl、curl localhost 三次、exit。logs -c log-reader 看到三行 access log 就成功了。

兩個最常踩的坑：第一，多容器 Pod 用 exec 或 logs 一定要加 -c 指定容器名字。第二，Volume 的 mountPath 一定要跟容器實際寫日誌的路徑對上。nginx 是 /var/log/nginx，httpd 是 /usr/local/apache2/logs，而且 httpd 的檔名是 access_log 底線。確認環境清乾淨，我們進入 kubectl 進階技巧。 [▶ 下一頁]`,
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
    notes: `前面兩個 Loop 走下來，Pod 的 CRUD、排錯、Sidecar 都會了。但我在帶大家操作的過程中發現一個問題：每次 get pods 看到的就那幾個欄位，不夠用。Pod 的 IP 是什麼？跑在哪個 Node 上？看不到。

-o wide 多顯示 IP 和 NODE。-o yaml 看完整配置，包含 K8s 自動填充的預設值。--watch 持續監控狀態變化。

Pod 跑起來了，瀏覽器打不開？因為 Pod IP 是叢集內部虛擬 IP，你的筆電不在叢集裡。port-forward 在本機和 Pod 之間建臨時通道，跟 Docker -p 類似但是臨時的，關終端就斷。SSH 環境要加 --address 0.0.0.0，否則筆電瀏覽器連不到。正式服務要用 Service，下堂課教。 [▶ 下一頁]`,
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
    notes: `資訊夠了、瀏覽器也能連了，但又有一個困擾：每次寫 YAML 都要翻文件，太慢了。dry-run 是救星——kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml，模擬執行不建立資源，直接印出完整 YAML 骨架，改一改就能用。沒有人真的從零手寫 YAML，資深工程師也是先 dry-run 再改。

想知道某個欄位有什麼選項？kubectl explain pod.spec.containers，一層一層往下鑽，比翻官方文件快很多。

效率三件套：自動補全加到 ~/.bashrc 或 ~/.zshrc，Tab 補全指令和資源名。別名 alias k=kubectl，省打字。資源簡寫 po/svc/deploy/cm/ns。好，全部來動手操作一遍。 [▶ 下一頁]`,
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
    notes: `先確認有一個 Running 的 nginx Pod。port-forward pod/my-nginx 8080:80，終端會被佔住，需要開另一個終端 curl localhost:8080，看到 Welcome to nginx 就成功了。

回到原終端按 Ctrl+C 停掉，再 curl 就 Connection refused，通道斷了。這就是 port-forward 是臨時的。SSH 環境要加 --address 0.0.0.0，否則只能在 VM 本機連，筆電瀏覽器連不到。 [▶ 下一頁]`,
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
    notes: `dry-run 操作：kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml，螢幕上印出完整 Pod YAML，但沒有真的建立。存成檔案加個大於號就行。以後寫 YAML 先 dry-run 產骨架再改，這是最快的方式。

-o yaml 看完整配置，會發現 K8s 自動填充了 restartPolicy: Always、dnsPolicy: ClusterFirst 等預設值。kubectl get pods -A 看所有 Namespace，kube-system 裡面就是上午講的系統組件。kubectl explain 一層一層往下鑽查欄位。

自動補全和別名設好加到 shell 設定檔，每次開新終端自動生效。 [▶ 下一頁]`,
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
    notes: `好，kubectl 進階技巧都操作過了，換你們自己練。10 分鐘，三個題目。第一題用 dry-run 產一個 httpd Pod YAML，apply 之後 port-forward 到 9090，curl 看到 It works。第二題用 -o yaml 查完整配置，找出 K8s 自動填充的欄位。第三題用 kubectl explain 預習 resources。

做完的同學可以試 jsonpath 提取特定欄位，寫自動化腳本很好用。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
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
    notes: `回頭操作時間。帶做重點：

確認有 Running 的 Pod，port-forward pod/my-nginx 8080:80，開另一個終端 curl localhost:8080 看到 nginx 歡迎頁面。Ctrl+C 停掉，再 curl 就 Connection refused。

兩個坑再強調一次：第一，關終端就斷，port-forward 是臨時除錯工具，正式服務要用 Service，下堂課教。第二，SSH 環境加 --address 0.0.0.0。dry-run 也提醒一下：後面學到 Deployment、Service 的 YAML 越來越長，養成用 dry-run 產骨架的習慣。做完了我們進入今天最後一個 Loop——環境變數。 [▶ 下一頁]`,
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
    notes: `前面三個 Loop 跑的都是 nginx、httpd、busybox，不需要設定就能啟動。但真實世界很多服務不是這樣。你想在 K8s 跑 MySQL，很自然地寫個 YAML 只改 image 成 mysql:8.0。apply 之後呢？CrashLoopBackOff。

排錯三兄弟：logs 看到 database is uninitialized and password option is not specified。MySQL 需要知道 root 密碼才能初始化，你什麼都不給它，它就退出了。

回想 Docker：docker run -e MYSQL_ROOT_PASSWORD=secret mysql:8.0，用 -e 設環境變數。K8s 對應的就是 YAML 裡的 env 欄位，寫在 spec.containers 底下跟 image 同一層。Docker -e 對應 K8s env，概念一模一樣。 [▶ 下一頁]`,
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
    notes: `env 的格式：每個環境變數是列表項目，有 name 和 value。Docker Compose 用 key: value 簡潔寫法，K8s 用 name: + value: 結構化寫法。看起來囉唆，但好處是 env 的 value 還可以從 ConfigMap 或 Secret 引用，不一定要寫死在這裡。

安全性問題很重要。密碼 my-secret 明文寫在 YAML，git commit 之後全團隊甚至全世界都看得到。K8s 的 Secret 專門管密碼，Pod 透過環境變數或掛載檔案讀取。學習時先寫在 YAML 沒問題，但心裡要記住：生產環境一律用 Secret，下堂課教。好，概念講完了，接下來從故意做錯開始體驗完整流程。 [▶ 下一頁]`,
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
    notes: `帶做重點，從故意做錯開始。先 apply 不帶 env 的 pod-mysql-broken.yaml，get pods -w 看到 CrashLoopBackOff，logs 看到 password not specified，破案。刪掉，寫正確版本加上 env MYSQL_ROOT_PASSWORD，重新 apply。

MySQL image 比較大（五百多 MB），ContainerCreating 可能等 1-2 分鐘。Running 之後 exec -it mysql-pod -- mysql -u root -pmy-secret 進去操作。注意 -p 和密碼之間沒有空格，有空格的話 MySQL 會把後面的字當成資料庫名稱。SHOW DATABASES、CREATE DATABASE testdb 驗證一下，exit 離開，delete 清理。跟 docker exec 完全一樣的體驗。 [▶ 下一頁]`,
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
    notes: `自由練習時間。必做題一定要做完。第一題自己從頭寫 MySQL Pod YAML 加 env，apply、exec 進去建資料庫、清理。第二題不看筆記從零手寫 nginx Pod，apply、port-forward、瀏覽器看到 Welcome to nginx、刪除。能做到第二題就代表今天的內容吸收了，卡住再翻筆記。

挑戰題給有時間的同學。Redis Pod 用 redis:7 不需要 env，exec -- redis-cli ping 回 PONG。Python HTTP Server 用 python:3.12 加 command 跑 http.server 8000，port-forward 看到目錄列表。 [▶ 下一頁 — 學員開始做，你去巡堂]`,
  },

  // ── 4-23 總結（1/2）：今日知識清單 + Docker 對照表 ──
  {
    title: '第四堂總結：今天學了什麼',
    subtitle: 'Pod 知識清單 + Docker → K8s 對照表',
    section: 'Loop 4：環境變數 + MySQL + 總結',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Pod 知識清單（9 項）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Pod 概念 + 為什麼不是直接管容器</li>
            <li>YAML 四大欄位：apiVersion / kind / metadata / spec</li>
            <li>Pod CRUD：apply / get / describe / logs / exec / delete</li>
            <li>Pod 生命週期 + 狀態（Pending → Running → CrashLoopBackOff...）</li>
            <li>排錯三兄弟：get → describe → logs</li>
            <li>多容器 Pod / Sidecar 模式</li>
            <li>port-forward（臨時通道存取 Pod）</li>
            <li>dry-run 產生 YAML 模板</li>
            <li>環境變數注入（env 欄位）</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Docker → K8s 完整對照表</p>
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
                <td className="py-1"><code>kubectl port-forward pod/xxx 8080:80</code></td>
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
                <td className="py-1 pr-4"><code>docker-compose environment:</code></td>
                <td className="py-1">K8s YAML <code>env:</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，來回顧今天下午的四個 Loop，一條因果鏈。Pod 壞了看不出原因，所以學了排錯三兄弟。排錯的時候碰到日誌收集問題，所以學了 Sidecar。操作過程中發現 kubectl 資訊不夠、連不上、YAML 記不住，所以學了進階技巧。最後想跑 MySQL 結果 crash，所以學了環境變數。每一步都是因為上一步用出了新問題。

螢幕上有 Pod 知識清單 9 項和 Docker 對照表。如果你能不看筆記每一項都解釋出來，今天的課就完全吸收了。Docker 對照表截圖存起來當速查卡。 [▶ 下一頁]`,
  },

  // ── 4-23 總結（2/2）：回家作業 + 下堂課預告 ──
  {
    title: '回家作業 + 下堂課預告',
    subtitle: '今天 Pod = 一個人做事，下堂課 Deployment = 一個團隊做事',
    section: 'Loop 4：環境變數 + MySQL + 總結',
    duration: '6',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">回家作業</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li>把今天的 Pod 練習<strong className="text-white">不看筆記</strong>再做一遍</li>
            <li>試跑不同 image：redis、python:3.12、busybox:1.36（觀察不同行為）</li>
            <li>進階：MySQL Pod 加環境變數，進去建資料庫</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">下堂課預告</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">內容</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">Deployment</td>
                <td className="py-2">管理多個 Pod -- 擴縮容、滾動更新、自動修復</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">Service</td>
                <td className="py-2">讓外面連得到 Pod -- ClusterIP、NodePort</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">k3s</td>
                <td className="py-2">多節點叢集 -- Pod 分散在不同機器上</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">一個比喻</p>
          <p className="text-slate-300 text-sm">今天的 <strong className="text-white">Pod</strong> 是「一個人做事」-- 一個人會生病、會請假、會累</p>
          <p className="text-slate-300 text-sm">下堂課的 <strong className="text-white">Deployment</strong> 是「一個團隊做事」-- 有人倒了馬上有人頂上、需要更多人手可以擴編</p>
        </div>
      </div>
    ),
    notes: `回家作業三個。第一，不看筆記把今天的 Pod 練習從頭做一遍，能憑記憶完成整個流程就完全內化了。第二，跑不同 image 觀察行為差異：redis 會一直 Running，python:3.12 不給 command 會直接退出，想想為什麼。第三，MySQL Pod 加環境變數，進去建資料庫。

下堂課預告：Deployment 管理多個 Pod，掛了自動補、版本滾動更新、一個數字控制擴縮容。Service 讓外面正式連得到 Pod。k3s 多節點叢集，Pod 分散在不同機器上。

比喻：今天的 Pod 是一個人做事，一個人會生病、會累。下堂課的 Deployment 是一個團隊做事，有人倒了馬上有人頂上。大家辛苦了，下堂課見！`,
  },
]
