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
  // ========== 第 1 頁：下午開場 ==========
  {
    title: '下午開場：上午回顧 + 下午計畫',
    subtitle: '第四堂下午 -- 13:00-17:00',
    section: '下午開場',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">上午回顧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2 pr-4">上午學了什麼</th>
                <th className="pb-2">一句話</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center">K8s 是什麼</td>
                <td className="py-2">容器的管理平台，解決「容器太多管不動」的問題</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center">核心資源</td>
                <td className="py-2">Pod、Service、Deployment、ConfigMap、Secret、Volume</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center">架構</td>
                <td className="py-2">Master（API Server + etcd + Scheduler + Controller Manager）+ Worker（kubelet + kube-proxy + Container Runtime）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-center">minikube</td>
                <td className="py-2">已經裝好，單節點叢集跑起來了</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">下午計畫：全部都是 Pod 實作</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2 pr-4">時段</th>
                <th className="pb-2">內容</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">13:00-13:30</td>
                <td className="py-2">YAML 格式 + Pod 概念</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">13:30-14:15</td>
                <td className="py-2">實作：第一個 Pod（完整 CRUD）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">14:25-15:05</td>
                <td className="py-2">Pod 生命週期 + 排錯實作</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">15:15-16:00</td>
                <td className="py-2">多容器 Pod（Sidecar）+ kubectl 進階</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">16:10-17:00</td>
                <td className="py-2">自由練習 + 總結</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，歡迎大家回來。

快速回顧上午：K8s 是容器管理平台，核心資源有 Pod、Service、Deployment。架構上，Master 節點跑 API Server、etcd、Scheduler、Controller Manager，Worker 節點跑 kubelet、kube-proxy、Container Runtime。minikube 已經裝好，\`kubectl get nodes\` 確認叢集在跑。

下午全部都是 Pod 實作：先學 YAML 格式，然後寫第一個 Pod，學排錯，最後玩多容器 Pod。大家把終端機打開，編輯器準備好，我們開始寫 YAML。`,
  },

  // ========== 第 2 頁：YAML 基本格式 ==========
  {
    title: 'YAML 基本格式',
    subtitle: 'Yet Another Markup Language',
    section: 'YAML',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">YAML = K8s 的配置檔案格式</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>縮排用空格（不能用 Tab！）</li>
            <li>冒號後面要有空格</li>
            <li>列表用減號加空格開頭</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">四大必備欄位</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">apiVersion</code> -- API 版本（Pod 用 v1）</li>
            <li><code className="text-green-400">kind</code> -- 資源類型（Pod / Service / Deployment）</li>
            <li><code className="text-green-400">metadata</code> -- 中繼資料（名字、標籤）</li>
            <li><code className="text-green-400">spec</code> -- 規格（你想要什麼）</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">對照 docker-compose.yaml</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="pb-1">docker-compose</th>
                  <th className="pb-1">K8s YAML</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="py-1"><code>version: '3'</code></td>
                  <td className="py-1"><code>apiVersion: v1</code></td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1"><code>services:</code></td>
                  <td className="py-1"><code>kind: Pod</code> + <code>spec:</code></td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1"><code>image: nginx</code></td>
                  <td className="py-1"><code>spec.containers[].image</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">apiVersion 常見值</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="pb-1">資源類型</th>
                  <th className="pb-1">apiVersion</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-t border-slate-700">
                  <td className="py-1">Pod, Service, ConfigMap</td>
                  <td className="py-1"><code>v1</code></td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1">Deployment, DaemonSet</td>
                  <td className="py-1"><code>apps/v1</code></td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1">CronJob</td>
                  <td className="py-1"><code>batch/v1</code></td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-1">Ingress</td>
                  <td className="py-1"><code>networking.k8s.io/v1</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    code: `# K8s YAML 四大必備欄位
apiVersion: v1            # API 版本
kind: Pod                 # 資源類型
metadata:                 # 中繼資料（名字、標籤）
  name: my-pod
  labels:
    app: my-app
spec:                     # 規格（你想要什麼）
  containers:
    - name: my-container
      image: nginx`,
    notes: `K8s 裡幾乎所有東西都用 YAML 描述 -- Pod 寫一個 YAML、Service 寫一個 YAML、Deployment 也是。搞懂 YAML 格式是第一步。

YAML 語法三個重點：第一，縮排用空格，不能用 Tab。用了 Tab 就會報錯，建議在編輯器裡把 Tab 設成兩個或四個空格。第二，冒號後面要有空格，\`name: my-pod\` 冒號和值之間必須有空格。第三，列表用減號加空格開頭，像 \`- name: xxx\`。

K8s 的 YAML 有四個必備欄位：

\`apiVersion\`：告訴 K8s 用哪個版本的 API。Pod 和 Service 用 \`v1\`，Deployment 用 \`apps/v1\`。固定值，不用背，查一下就知道。

\`kind\`：你要建什麼資源。Pod、Service、Deployment 寫在這裡。

\`metadata\`：中繼資料，最重要的是 \`name\` 給資源取名字，還可以加 \`labels\` 標籤，後面 Service 會用標籤找到對應的 Pod。

\`spec\`：specification 的縮寫，規格。容器用什麼 image、開什麼 port，都寫在 spec 裡。

對照 Docker Compose：\`version: '3'\` 對應 \`apiVersion\`，\`services\` 區塊對應 \`kind\` + \`spec\`，\`image: nginx\` 對應 \`spec.containers[].image: nginx\`。本質上都是告訴系統「我要跑什麼容器」。

最大差別：Docker Compose 一個檔案描述一整套服務（前端、後端、資料庫）。K8s 的 YAML 通常一個檔案描述一個資源。你也可以用 \`---\` 分隔符把多個資源寫在同一個檔案裡，但初學建議一個檔案一個資源。`,
  },

  // ========== 第 3 頁：Pod 是什麼 ==========
  {
    title: 'Pod 是什麼',
    subtitle: 'K8s 最小部署單位',
    section: 'Pod 實作',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">Pod = K8s 最小部署單位</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>不是直接跑 Container，而是跑 Pod</li>
            <li>Pod 裡面包一個（或多個）Container</li>
            <li>Pod 裡的容器共享：網路（同一個 IP，用 localhost 互連）、儲存（可以掛同一個 Volume）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照 Docker</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2 pr-4">Docker</th>
                <th className="pb-2">Kubernetes</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker run nginx</code></td>
                <td className="py-1"><code>kubectl run nginx --image=nginx</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker ps</code></td>
                <td className="py-1"><code>kubectl get pods</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker logs &lt;id&gt;</code></td>
                <td className="py-1"><code>kubectl logs &lt;pod-name&gt;</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker exec -it &lt;id&gt; bash</code></td>
                <td className="py-1"><code>kubectl exec -it &lt;pod-name&gt; -- bash</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker stop / rm</code></td>
                <td className="py-1"><code>kubectl delete pod &lt;pod-name&gt;</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4"><code>docker inspect</code></td>
                <td className="py-1"><code>kubectl describe pod &lt;pod-name&gt;</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">為什麼不直接用 Container？</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>K8s 需要一個「管理單位」-- 那就是 Pod</li>
            <li>Pod 可以包多個緊密耦合的容器（Sidecar 模式）</li>
            <li>Pod 有自己的 IP、hostname、lifecycle</li>
            <li>最佳實踐：<strong className="text-white">一個 Pod 放一個容器</strong></li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來講 Pod。Pod 是 K8s 最小的部署單位，不是 Container。Docker 直接 \`docker run\` 跑容器，但 K8s 不直接管 Container，它管的是 Pod。Pod 在 Container 外面包了一層。

Pod 和 Container 的關係：一個 Pod 裡面放一個或多個 Container。Pod 裡的容器共享網路和儲存 -- 同一個 Pod 的兩個容器用同一個 IP，可以用 \`localhost\` 互連，也可以掛同一個 Volume 共享檔案。

Docker vs K8s 指令對照：\`docker run nginx\` 對應 \`kubectl run nginx --image=nginx\`、\`docker ps\` 對應 \`kubectl get pods\`、\`docker logs\` 對應 \`kubectl logs\`、\`docker exec -it\` 對應 \`kubectl exec -it\`。基本上把 \`docker\` 換成 \`kubectl\`，Container 換成 Pod。

為什麼要多包一層 Pod？因為有些場景需要把兩個緊密耦合的容器放一起，比如主程式 + 日誌收集的輔助容器（Sidecar 模式），這時候它們需要共享網路和 Volume。

最佳實踐：一個 Pod 放一個容器。除非有明確理由需要多容器共享網路和儲存。

接下來動手建第一個 Pod。`,
  },

  // ========== 第 4 頁：實作 - 第一個 Pod ==========
  {
    title: 'Lab 3：第一個 Pod',
    subtitle: '完整 CRUD 操作',
    section: 'Pod 實作',
    duration: '25',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 1：建立 YAML 檔案</p>
            <p className="text-slate-300 text-sm">建立 <code>pod.yaml</code>，描述一個 nginx Pod</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 2：部署到叢集</p>
            <p className="text-slate-300 text-sm"><code>kubectl apply -f pod.yaml</code></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3-5：查看、操作、刪除</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl get pods</code> / <code>kubectl get pods -o wide</code> -- 看 Pod 列表</li>
            <li><code>kubectl describe pod my-nginx</code> -- 詳細資訊 + Events</li>
            <li><code>kubectl logs my-nginx</code> -- 看日誌</li>
            <li><code>kubectl exec -it my-nginx -- /bin/sh</code> -- 進容器</li>
            <li><code>kubectl delete pod my-nginx</code> -- 刪除 Pod</li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">對照 Docker 完整流程</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-1">Docker</th>
                <th className="pb-1">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker run -d --name my-nginx nginx:1.27</code></td>
                <td className="py-1"><code>kubectl apply -f pod.yaml</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker ps</code></td>
                <td className="py-1"><code>kubectl get pods</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker logs my-nginx</code></td>
                <td className="py-1"><code>kubectl logs my-nginx</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker exec -it my-nginx /bin/sh</code></td>
                <td className="py-1"><code>kubectl exec -it my-nginx -- /bin/sh</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker stop/rm my-nginx</code></td>
                <td className="py-1"><code>kubectl delete pod my-nginx</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80

# --- 部署與操作指令 ---
# kubectl apply -f pod.yaml
# kubectl get pods
# kubectl get pods -o wide
# kubectl describe pod my-nginx
# kubectl logs my-nginx
# kubectl exec -it my-nginx -- /bin/sh
# curl localhost
# ls /usr/share/nginx/html/
# exit
# kubectl delete pod my-nginx`,
    notes: `現在來動手建第一個 Pod。

先確認 minikube 還在跑：\`minikube status\`，應該顯示 host、kubelet、apiserver 都是 Running。沒在跑就 \`minikube start\` 重啟。

建工作目錄：

\`\`\`
mkdir -p ~/k8s-labs
cd ~/k8s-labs
\`\`\`

建 \`pod.yaml\`：

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
\`\`\`

逐行說明：\`apiVersion: v1\` 是 Pod 固定的 API 版本。\`kind: Pod\` 表示要建 Pod。\`metadata.name: my-nginx\` 是 Pod 名字，之後 kubectl 指令都用這個名字。\`labels.app: nginx\` 是標籤，後面學 Service 會用到。

\`spec.containers\` 是容器列表，用減號開頭。\`name: nginx\` 是容器名字（多容器 Pod 時用來區分）。\`image: nginx:1.27\` 是 Docker image。\`containerPort: 80\` 表示容器開放 80 port。

縮排結構：\`metadata\` 和 \`spec\` 是第一層不縮排，\`name\`、\`labels\`、\`containers\` 第二層縮排兩格，\`app\`、\`image\`、\`ports\` 第三層縮排四格。縮排錯了就報錯。

部署：

\`\`\`
kubectl apply -f pod.yaml
\`\`\`

會看到 \`pod/my-nginx created\`。看狀態：

\`\`\`
kubectl get pods
\`\`\`

STATUS 是 \`ContainerCreating\` 表示在拉 image，等一下變 \`Running\` 就好了。

加 \`-o wide\` 看更多資訊：

\`\`\`
kubectl get pods -o wide
\`\`\`

多出 IP 和 NODE 欄位。IP 是 Pod 的叢集內部 IP，只能在叢集內使用。NODE 顯示 \`minikube\`。

用 \`describe\` 看詳細資訊：

\`\`\`
kubectl describe pod my-nginx
\`\`\`

往下滾看 Events 區塊：Scheduled（調度到哪個 Node）、Pulling（拉 image）、Pulled（image 拉好）、Created（容器建好）、Started（容器啟動）。排錯時 Events 是最重要的資訊來源。

看日誌：

\`\`\`
kubectl logs my-nginx
\`\`\`

nginx 剛啟動沒流量，日誌只有啟動訊息。對應 Docker 的 \`docker logs\`。

進容器：

\`\`\`
kubectl exec -it my-nginx -- /bin/sh
\`\`\`

注意雙減號 \`--\`，告訴 kubectl 後面是容器內要執行的指令，不是 kubectl 的參數。Docker 的 \`exec\` 不需要這個雙減號。

進去後試試：

\`\`\`
curl localhost
ls /usr/share/nginx/html/
\`\`\`

會看到 nginx 歡迎頁面，以及 \`50x.html\` 和 \`index.html\` 兩個預設網頁檔。\`exit\` 離開。

刪除 Pod：

\`\`\`
kubectl delete pod my-nginx
kubectl get pods
\`\`\`

確認 Pod 已刪除。這就是 Pod 完整生命週期操作：apply 建立、get 查看、logs 看日誌、exec 進容器、delete 刪除。

Docker 對照：\`docker run\` -> \`kubectl apply\`、\`docker ps\` -> \`kubectl get pods\`、\`docker logs\` -> \`kubectl logs\`、\`docker exec\` -> \`kubectl exec\`、\`docker stop && docker rm\` -> \`kubectl delete pod\`。`,
  },

  // ========== 第 5 頁：Pod 的生命週期 ==========
  {
    title: 'Pod 的生命週期',
    subtitle: '狀態流程與排錯三兄弟',
    section: '排錯',
    duration: '10',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Pod 的狀態流程</p>
          <p className="text-slate-300 text-sm font-mono">
            Pending -&gt; ContainerCreating -&gt; Running -&gt; Succeeded / Failed
          </p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見狀態一覽</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2 pr-3">狀態</th>
                <th className="pb-2 pr-3">意思</th>
                <th className="pb-2">常見原因</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3"><code>Pending</code></td>
                <td className="py-1 pr-3">排隊中</td>
                <td className="py-1">Node 資源不夠、image 很大正在拉</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3"><code>Running</code></td>
                <td className="py-1 pr-3">跑起來了</td>
                <td className="py-1">正常</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3"><code className="text-red-400">CrashLoopBackOff</code></td>
                <td className="py-1 pr-3">反覆重啟</td>
                <td className="py-1">容器啟動後馬上 crash，重啟間隔越來越長</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3"><code className="text-red-400">ImagePullBackOff</code></td>
                <td className="py-1 pr-3">拉不到 image</td>
                <td className="py-1">image 名字拼錯、tag 不存在、私有倉庫沒權限</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
            <p className="text-red-400 font-semibold mb-1">CrashLoopBackOff 重啟間隔</p>
            <p className="text-slate-300 text-sm">10s -&gt; 20s -&gt; 40s -&gt; 80s -&gt; ... -&gt; 最長 5min</p>
          </div>

          <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
            <p className="text-amber-400 font-semibold mb-1">排錯三兄弟</p>
            <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
              <li><code>kubectl get pods</code> -- 先看狀態</li>
              <li><code>kubectl describe pod</code> -- 看 Events</li>
              <li><code>kubectl logs</code> -- 看容器日誌</li>
            </ol>
          </div>
        </div>
      </div>
    ),
    code: `# 排錯三兄弟
kubectl get pods              # 1. 先看狀態
kubectl describe pod <name>   # 2. 看 Events 找原因
kubectl logs <name>           # 3. 看容器日誌`,
    notes: `接下來講 Pod 的生命週期。

Pod 狀態流程：\`Pending\`（排隊中，K8s 在找 Node 放這個 Pod）-> \`ContainerCreating\`（拉 image、建容器）-> \`Running\`（正常運行）。一次性任務跑完變 \`Succeeded\`，crash 了變 \`Failed\`。

實際工作中最常碰到的是兩個異常狀態：

\`ImagePullBackOff\`：拉不到 Docker image。最常見原因是 image 名字拼錯，比如 \`nginx\` 打成 \`ngin\`，Docker Hub 找不到就報這個錯。

\`CrashLoopBackOff\`：容器啟動後馬上 crash。K8s 會自動重啟，但用退避策略：10s -> 20s -> 40s -> 80s -> ... 最長 5 分鐘。看到這個狀態就知道容器在反覆重啟。

排錯三兄弟：
1. \`kubectl get pods\` -- 看狀態，知道是什麼錯
2. \`kubectl describe pod <name>\` -- 看 Events，找詳細原因
3. \`kubectl logs <name>\` -- 看容器日誌，看程式報什麼錯

接下來實際體驗排錯。

（休息 10 分鐘）`,
  },

  // ========== 第 6 頁：實作 - Pod 排錯 ==========
  {
    title: 'Lab 4：Pod 排錯實戰',
    subtitle: '故意製造錯誤！',
    section: '排錯',
    duration: '20',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Step 1：建立一個「壞的」Pod</p>
          <p className="text-slate-300 text-sm">image 故意拼錯：<code className="text-red-400">ngin</code>（少了一個 x）</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 2：部署並觀察</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl apply -f pod-broken.yaml</code></li>
            <li><code>kubectl get pods</code> -- 看到 ErrImagePull 或 ImagePullBackOff</li>
            <li><code>kubectl get pods --watch</code> -- 持續觀察狀態變化（Ctrl+C 停止）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3：用 describe 找原因</p>
          <p className="text-slate-300 text-sm">
            <code>kubectl describe pod broken-pod</code><br />
            拉到最下面看 Events：<code className="text-red-400">Failed to pull image "ngin": ... not found</code>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">Step 4a：刪掉重建（推薦）</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl delete pod broken-pod</code></li>
              <li>修改 YAML：<code>ngin</code> -&gt; <code>nginx:1.27</code></li>
              <li><code>kubectl apply -f pod-broken.yaml</code></li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">Step 4b：直接修改（進階）</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl edit pod broken-pod</code></li>
              <li>在編輯器中修改 image，存檔退出</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold">Step 5：確認修好了 -- <code>kubectl get pods</code> STATUS: Running</p>
        </div>
      </div>
    ),
    code: `# pod-broken.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-pod
  labels:
    app: broken
spec:
  containers:
    - name: broken
      image: ngin        # 故意拼錯！不是 nginx
      ports:
        - containerPort: 80

# --- 排錯流程 ---
# kubectl apply -f pod-broken.yaml
# kubectl get pods                        # ErrImagePull / ImagePullBackOff
# kubectl get pods --watch                # 持續觀察（Ctrl+C 停止）
# kubectl describe pod broken-pod         # 看 Events 找原因

# --- 修正：刪掉重建 ---
# kubectl delete pod broken-pod
# # 修改 pod-broken.yaml：ngin -> nginx:1.27
# kubectl apply -f pod-broken.yaml
# kubectl get pods                        # STATUS: Running`,
    notes: `休息回來。接下來故意把 Pod 搞壞，練習排錯流程。

建 \`pod-broken.yaml\`，image 故意寫 \`ngin\`（少一個 x）。

部署：

\`\`\`
kubectl apply -f pod-broken.yaml
\`\`\`

K8s 回 \`pod/broken-pod created\`，看起來成功了。看狀態：

\`\`\`
kubectl get pods
\`\`\`

STATUS 不是 \`Running\`，而是 \`ErrImagePull\` 或 \`ImagePullBackOff\`。K8s 拉不到 \`ngin\` 這個 image，Docker Hub 上沒有。

用 \`--watch\` 持續觀察：

\`\`\`
kubectl get pods --watch
\`\`\`

狀態在 \`ErrImagePull\` 和 \`ImagePullBackOff\` 之間切換，K8s 不斷重試但等待時間越來越長。Ctrl+C 停止。

用 \`describe\` 找原因：

\`\`\`
kubectl describe pod broken-pod
\`\`\`

拉到最下面看 Events，會看到：

\`\`\`
Failed to pull image "ngin": rpc error: ... manifest unknown
\`\`\`

明確告訴你 \`ngin\` 這個 image 找不到。

修正方法一（推薦）-- 刪掉重建：

\`\`\`
kubectl delete pod broken-pod
# 修改 pod-broken.yaml：ngin -> nginx:1.27
kubectl apply -f pod-broken.yaml
\`\`\`

修正方法二 -- \`kubectl edit pod broken-pod\` 直接在編輯器裡改。但改完不會反映到本地 YAML 檔案，建議用方法一，養成「改檔案再 apply」的習慣。

確認修好：

\`\`\`
kubectl get pods
\`\`\`

STATUS 變成 \`Running\`。排錯流程就是這三步：\`get pods\` 看狀態、\`describe pod\` 看 Events、\`logs\` 看日誌。

清理：

\`\`\`
kubectl delete pod broken-pod
\`\`\``,
  },

  // ========== 第 7 頁：多容器 Pod 概念 ==========
  {
    title: '多容器 Pod 概念',
    subtitle: 'Sidecar 模式',
    section: 'Sidecar',
    duration: '10',
    content: (
      <div className="space-y-3">
        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">一個 Pod 可以放多個容器</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>兩個容器「必須」共享網路或儲存時使用</li>
            <li>典型場景：Sidecar 模式（邊車）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Sidecar 模式架構</p>
          <div className="text-slate-300 text-sm font-mono whitespace-pre leading-relaxed">
{`  Pod
  +---------------------------+
  | nginx        busybox      |
  | (主程式)      (輔助容器)    |
  |     \\    共享 Volume   /   |
  |      +----------------+   |
  | 共享網路（同一個 IP）        |
  +---------------------------+`}
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">常見 Sidecar 用途</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-1 pr-3">類型</th>
                <th className="pb-1 pr-3">做什麼</th>
                <th className="pb-1">例子</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3">日誌收集</td>
                <td className="py-1 pr-3">收集主程式日誌</td>
                <td className="py-1">Fluentd / Filebeat</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3">代理</td>
                <td className="py-1 pr-3">處理進出流量</td>
                <td className="py-1">Envoy / Istio</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3">監控</td>
                <td className="py-1 pr-3">收集指標</td>
                <td className="py-1">Prometheus exporter</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">多容器 Pod vs 多個 Pod</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-1 pr-3"></th>
                <th className="pb-1 pr-3">多容器 Pod</th>
                <th className="pb-1">多個 Pod</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">何時用</td>
                <td className="py-1 pr-3">容器緊密耦合</td>
                <td className="py-1">容器獨立運作</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">網路</td>
                <td className="py-1 pr-3">共享 IP（localhost）</td>
                <td className="py-1">各自有 IP</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">擴縮容</td>
                <td className="py-1 pr-3">一起擴縮</td>
                <td className="py-1">獨立擴縮</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">生死</td>
                <td className="py-1 pr-3">一起生一起死</td>
                <td className="py-1">獨立生死</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-3 text-slate-400">舉例</td>
                <td className="py-1 pr-3">nginx + log collector</td>
                <td className="py-1">nginx + mysql</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `前面建的 Pod 都是一個容器。現在來看多容器 Pod -- 什麼時候需要在一個 Pod 放多個容器？

答案是：兩個容器必須共享網路或儲存的時候。最經典的模式叫 Sidecar（邊車）-- 主程式是摩托車，輔助容器是旁邊的邊車，負責日誌收集、流量代理、監控收集等額外功能。

實際例子：nginx 容器服務 Web 請求，把日誌寫到檔案。busybox 容器讀取 nginx 的日誌檔，發送到集中式日誌系統。兩者需要共享存放日誌的 Volume，所以放同一個 Pod。

生產環境常見 Sidecar：Fluentd / Filebeat 做日誌收集、Envoy 做流量代理（Istio Service Mesh 用這個模式）、Prometheus exporter 做監控指標收集。

什麼時候用多個 Pod 而不是多容器 Pod？如果兩個容器可以獨立運作、獨立擴縮容，就分開放。比如 nginx 和 MySQL，nginx 擴到 5 個副本時 MySQL 不需要跟著擴，所以是兩個獨立的 Pod。

判斷標準：拿掉一個容器，另一個就不能正常工作 -> 放同一個 Pod。各自能獨立運行 -> 分開放。`,
  },

  // ========== 第 8 頁：實作 - Sidecar Pod ==========
  {
    title: 'Lab 5：多容器 Pod -- nginx + busybox Sidecar',
    subtitle: '共享 Volume 協同工作',
    section: 'Sidecar',
    duration: '20',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 1：建立 Sidecar Pod YAML</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>主容器：<code>nginx:1.27</code> -- 服務 Web 請求</li>
            <li>Sidecar：<code>busybox:1.36</code> -- <code>tail -f</code> 讀取 nginx access log</li>
            <li>共享 Volume：<code>emptyDir</code> 掛載到 <code>/var/log/nginx</code></li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 2：部署並驗證</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl apply -f pod-sidecar.yaml</code></li>
              <li><code>kubectl get pods</code></li>
              <li>看 READY 欄位：<code className="text-green-400">2/2</code> 表示兩個容器都在跑</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 3：製造 nginx 流量</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl exec -it sidecar-pod -c nginx -- /bin/sh</code></li>
              <li>執行 <code>curl localhost</code> 三次</li>
              <li><code>exit</code></li>
            </ul>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Step 4：從 Sidecar 看日誌</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl logs sidecar-pod -c log-reader</code> -- 看到三次 access log</li>
            <li><code>kubectl logs sidecar-pod -c nginx</code> -- 對比 nginx 的 stdout</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">重點觀察</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>READY 2/2</code> -- 一個 Pod 裡有兩個容器</li>
            <li><code>-c &lt;container-name&gt;</code> -- 指定要看哪個容器</li>
            <li>兩個容器共享 <code>shared-logs</code> volume</li>
          </ul>
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
    # 主容器：nginx
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

    # Sidecar 容器：busybox 讀取 nginx 日誌
    - name: log-reader
      image: busybox:1.36
      command: ["sh", "-c", "tail -f /var/log/nginx/access.log"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

  volumes:
    - name: shared-logs
      emptyDir: {}

# --- 操作指令 ---
# kubectl apply -f pod-sidecar.yaml
# kubectl get pods                            # READY 2/2
# kubectl exec -it sidecar-pod -c nginx -- /bin/sh
# curl localhost && curl localhost && curl localhost
# exit
# kubectl logs sidecar-pod -c log-reader      # 看到 access log
# kubectl delete pod sidecar-pod`,
    notes: `接下來建一個多容器 Pod：nginx 負責 Web 請求，busybox 即時讀取 nginx 的 access log，透過共享 Volume 傳遞日誌。

（休息 10 分鐘）

休息回來，建 \`pod-sidecar.yaml\`。

YAML 重點：\`spec.containers\` 下面有兩個容器。第一個 \`nginx\`，多了 \`volumeMounts\`，把 \`shared-logs\` Volume 掛到 \`/var/log/nginx\`，nginx 的 access log 和 error log 寫在這裡。

第二個 \`log-reader\`，用 busybox image（超小的 Linux 工具箱，適合做 Sidecar）。\`command\` 設定 \`tail -f /var/log/nginx/access.log\`，即時追蹤 nginx access log。它也掛載同一個 \`shared-logs\` Volume 到同樣路徑。

\`volumes\` 區塊定義共享 Volume。\`emptyDir: {}\` 是最簡單的 Volume 類型，Pod 建立時自動建空目錄，Pod 刪除時跟著消失。對應 Docker 的匿名 Volume。

Docker Compose 對照寫法：

\`\`\`yaml
services:
  nginx:
    image: nginx:1.27
    volumes:
      - shared-logs:/var/log/nginx
  log-reader:
    image: busybox:1.36
    command: ["sh", "-c", "tail -f /var/log/nginx/access.log"]
    volumes:
      - shared-logs:/var/log/nginx
volumes:
  shared-logs:
\`\`\`

K8s 把它包在一個 Pod 裡面。

部署：

\`\`\`
kubectl apply -f pod-sidecar.yaml
kubectl get pods
\`\`\`

READY 欄位：之前 \`1/1\`（一個容器），現在 \`2/2\`（兩個容器都在跑）。\`1/2\` 表示有一個還沒好。

進 nginx 容器製造流量：

\`\`\`
kubectl exec -it sidecar-pod -c nginx -- /bin/sh
\`\`\`

\`-c nginx\` 指定要進哪個容器（\`-c\` 是 \`--container\` 縮寫），多容器 Pod 必須指定。

打幾次 curl：

\`\`\`
curl localhost
curl localhost
curl localhost
\`\`\`

\`exit\` 離開。

看 log-reader 容器的日誌：

\`\`\`
kubectl logs sidecar-pod -c log-reader
\`\`\`

會看到剛才三次 curl 的 access log。nginx 寫到 \`/var/log/nginx/access.log\`，log-reader 透過共享 Volume 讀到同一個檔案。

Sidecar 模式：主容器負責業務邏輯，Sidecar 負責輔助功能（日誌收集、監控等），透過共享 Volume 協同工作。

清理：

\`\`\`
kubectl delete pod sidecar-pod
\`\`\``,
  },

  // ========== 第 9 頁：kubectl 進階技巧 ==========
  {
    title: 'kubectl 進階技巧',
    subtitle: 'kubectl 的瑞士刀',
    section: '進階',
    duration: '15',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">輸出格式</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl get pods</code> -- 預設表格</li>
              <li><code>-o wide</code> -- 多顯示 IP、Node</li>
              <li><code>-o yaml</code> -- 完整 YAML 輸出</li>
              <li><code>-o json</code> -- JSON 格式</li>
              <li><code>-o name</code> -- 只顯示名字</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">即時觀察</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl get pods --watch</code></li>
              <li><code>kubectl get pods -w</code> -- 縮寫</li>
              <li>持續監控資源變化</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">Port Forward（本機連到 Pod）</p>
          <p className="text-slate-300 text-sm mb-2">
            <code>kubectl port-forward pod/my-nginx 8080:80</code><br />
            然後開瀏覽器 http://localhost:8080
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-1">Docker</th>
                <th className="pb-1">kubectl</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker run -p 8080:80</code></td>
                <td className="py-1"><code>kubectl port-forward pod/xxx 8080:80</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1">永久的 port 映射</td>
                <td className="py-1">臨時的（關掉終端就沒了）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2">其他好用指令</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl get all</code> -- 看所有資源</li>
              <li><code>kubectl get pods -A</code> -- 所有 namespace</li>
              <li><code>kubectl api-resources</code> -- 列出資源類型</li>
              <li><code>kubectl explain pod.spec</code> -- 內建文件</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">快速建 Pod（不寫 YAML）</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl run quick-nginx --image=nginx:1.27</code></li>
              <li>產生 YAML 但不真的建（超好用！）：</li>
              <li><code>--dry-run=client -o yaml</code></li>
            </ul>
          </div>
        </div>
      </div>
    ),
    code: `# 輸出格式
kubectl get pods                        # 預設表格
kubectl get pods -o wide                # 多顯示 IP、Node
kubectl get pods -o yaml                # 完整 YAML 輸出
kubectl get pods -o json                # JSON 格式
kubectl get pods -o name                # 只顯示名字

# 即時觀察
kubectl get pods --watch                # 持續監控變化
kubectl get pods -w                     # 縮寫

# Port Forward（本機連到 Pod）
kubectl port-forward pod/my-nginx 8080:80
# 然後開瀏覽器 -> http://localhost:8080

# 其他好用指令
kubectl get all                         # 看所有資源
kubectl get pods --all-namespaces       # 看所有 namespace 的 Pod
kubectl get pods -A                     # 同上，縮寫
kubectl api-resources                   # 列出所有資源類型
kubectl explain pod.spec.containers     # 查看欄位說明（內建文件）

# 快速建 Pod（不寫 YAML）
kubectl run quick-nginx --image=nginx:1.27

# 產生 YAML 但不真的建（超好用！）
kubectl run quick-nginx --image=nginx:1.27 --dry-run=client -o yaml`,
    notes: `接下來講 kubectl 進階技巧。

輸出格式：除了 \`kubectl get pods\` 和 \`-o wide\`，還有 \`-o yaml\` 輸出 Pod 完整配置，可以看到 K8s 自動填充的預設值（如 \`restartPolicy: Always\`、\`dnsPolicy: ClusterFirst\`）。\`-o json\` 同理，用程式處理輸出時 JSON 更方便。

\`--watch\`（縮寫 \`-w\`）：持續監控資源變化。apply 一個 Pod 後開另一個終端跑 \`kubectl get pods -w\`，即時看到 Pending -> ContainerCreating -> Running 的過程。排錯和觀察部署時很好用。

\`port-forward\`：Docker 用 \`-p 8080:80\` 映射 port，但 K8s 的 Pod IP 是叢集內部的，外面連不到。\`port-forward\` 在本機和 Pod 之間建臨時通道：

\`\`\`
kubectl port-forward pod/my-nginx 8080:80
\`\`\`

本機 8080 轉發到 Pod 的 80，瀏覽器打開 \`http://localhost:8080\` 就能看到 nginx。關掉終端或 Ctrl+C 轉發就斷了。這是臨時除錯工具，正式對外用 Service（下堂課學）。

\`--dry-run=client -o yaml\`：不確定 YAML 怎麼寫時，用 kubectl 產生模板：

\`\`\`
kubectl run quick-nginx --image=nginx:1.27 --dry-run=client -o yaml
\`\`\`

\`--dry-run=client\` 模擬執行不真的建，\`-o yaml\` 輸出 YAML。可以重新導向到檔案再修改，不用每次從零寫 YAML。`,
  },

  // ========== 第 10 頁：實作 - kubectl 探索 ==========
  {
    title: 'Lab 6：kubectl 進階操作',
    subtitle: 'port-forward、輸出格式、dry-run、探索叢集',
    section: '進階',
    duration: '20',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 1：建一個 Pod 回來</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl apply -f pod.yaml</code></li>
              <li><code>kubectl get pods</code> -- 確認 Running</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 2：port-forward 實測</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl port-forward pod/my-nginx 8080:80</code></li>
              <li>開另一個終端：<code>curl http://localhost:8080</code></li>
              <li>Ctrl+C 停止</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Step 3：各種輸出格式</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl get pods -o wide</code> -- IP + Node</li>
            <li><code>kubectl get pods -o yaml</code> -- 完整 YAML</li>
            <li><code>kubectl get pods -o yaml | head -30</code> -- 看前 30 行</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">Step 4：用 dry-run 產生 YAML</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml</code></li>
              <li>存成檔案：<code>&gt; test-pod.yaml</code></li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">Step 5：探索叢集</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl get all</code></li>
              <li><code>kubectl get pods -A</code></li>
              <li><code>kubectl get pods -n kube-system</code></li>
              <li><code>kubectl describe node minikube</code></li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold">Step 6：清理 -- <code>kubectl delete pod my-nginx</code></p>
        </div>
      </div>
    ),
    code: `# Step 1：建一個 Pod 回來
kubectl apply -f pod.yaml
kubectl get pods

# Step 2：port-forward 實測
kubectl port-forward pod/my-nginx 8080:80
# 開另一個終端：
curl http://localhost:8080
# Ctrl+C 停止 port-forward

# Step 3：各種輸出格式
kubectl get pods -o wide
kubectl get pods -o yaml
kubectl get pods -o yaml | head -30

# Step 4：用 dry-run 產生 YAML
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml

# Step 5：探索叢集
kubectl get all
kubectl get pods -A
kubectl get pods -n kube-system
kubectl describe node minikube

# Step 6：清理
kubectl delete pod my-nginx`,
    notes: `實際操作剛才學的技巧。

（休息 10 分鐘）

休息回來，先建 Pod 回來：

\`\`\`
kubectl apply -f pod.yaml
kubectl get pods
\`\`\`

STATUS Running 後，試 port-forward：

\`\`\`
kubectl port-forward pod/my-nginx 8080:80
\`\`\`

終端顯示 \`Forwarding from 127.0.0.1:8080 -> 80\`。開另一個終端：

\`\`\`
curl http://localhost:8080
\`\`\`

看到 nginx 歡迎頁面。也可以用瀏覽器開 \`http://localhost:8080\`。port-forward 終端會顯示每次請求的日誌。Ctrl+C 停止。

試輸出格式：

\`\`\`
kubectl get pods -o yaml
\`\`\`

輸出很長，這是 Pod 的完整配置，包括我們沒寫但 K8s 自動產生的東西：\`status\` 區塊有 Pod IP、phase、containerStatuses 等。只看前 30 行：

\`\`\`
kubectl get pods -o yaml | head -30
\`\`\`

試 dry-run：

\`\`\`
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml
\`\`\`

產生完整 Pod YAML 但不真的建。存成檔案：

\`\`\`
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml
\`\`\`

忘記 YAML 格式時用這招產生模板。

探索叢集：

\`\`\`
kubectl get pods -A
\`\`\`

\`-A\` 是 \`--all-namespaces\` 縮寫，列出所有 namespace 的 Pod。除了 default namespace，還有 \`kube-system\` namespace 裡 K8s 自己的系統元件。

\`\`\`
kubectl get pods -n kube-system
\`\`\`

會看到 \`coredns\`、\`etcd\`、\`kube-apiserver\`、\`kube-controller-manager\`、\`kube-proxy\`、\`kube-scheduler\`，就是上午講的 Master 和 Worker 元件，它們也是 Pod。

清理：

\`\`\`
kubectl delete pod my-nginx
\`\`\``,
  },

  // ========== 第 11 頁：自由練習時間 ==========
  {
    title: '自由練習時間',
    subtitle: '四道練習題',
    section: '練習',
    duration: '40',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">題目 1：基礎 Pod（5min）</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li>名字：<code>my-httpd</code></li>
              <li>Image：<code>httpd:2.4</code>（Apache HTTP Server）</li>
              <li>Port：<code>80</code></li>
              <li>驗證：進容器 <code>curl localhost</code> 看到 "It works!"</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">題目 2：排錯練習（10min）</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li>Image 故意寫成 <code>httpd:99.99</code>（不存在的 tag）</li>
              <li>觀察錯誤</li>
              <li>用 describe 找原因</li>
              <li>修正成 <code>httpd:2.4</code></li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">題目 3：Sidecar 實戰（15min）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>容器 1：<code>httpd:2.4</code>（主程式）</li>
            <li>容器 2：<code>busybox:1.36</code>，用 <code>tail -f</code> 追蹤 httpd 的 access log</li>
            <li>共享 Volume 路徑：<code>/usr/local/apache2/logs</code></li>
            <li>提示：httpd 的日誌路徑和 nginx 不同</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2">題目 4：port-forward（5min）</p>
            <p className="text-slate-300 text-sm">
              用 port-forward 把題目 1 的 httpd 映射到本機 9090 port，然後用瀏覽器打開看
            </p>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">做完了可以：</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><code>kubectl get pods -o yaml</code> 研究自動產生的設定</li>
              <li><code>kubectl explain pod.spec</code> 探索可設定欄位</li>
              <li><code>kubectl run</code> + <code>--dry-run=client -o yaml</code></li>
            </ul>
          </div>
        </div>
      </div>
    ),
    code: `# 題目 1 驗證
kubectl exec -it my-httpd -- /bin/sh
curl localhost                          # 應該看到 "It works!"

# 題目 3 驗證
kubectl exec -it <pod-name> -c httpd -- curl localhost
kubectl logs <pod-name> -c log-reader   # 看到 access log

# 題目 4
kubectl port-forward pod/my-httpd 9090:80
# 開瀏覽器 -> http://localhost:9090`,
    notes: `自由練習時間，40 分鐘，四個題目由淺到深。

題目一（基礎 Pod）：建一個跑 \`httpd:2.4\`（Apache HTTP Server）的 Pod，名字 \`my-httpd\`，port 80。複製 pod.yaml 把 image 改成 \`httpd:2.4\`。驗證：\`kubectl exec -it my-httpd -- curl localhost\`，看到 \`It works!\`。

題目二（排錯）：image 故意寫 \`httpd:99.99\`（不存在的 tag），觀察 \`kubectl get pods\` 的錯誤狀態，用 \`kubectl describe pod\` 找原因，修正成 \`httpd:2.4\`。

題目三（Sidecar）：雙容器 Pod，主容器 \`httpd:2.4\`，Sidecar \`busybox:1.36\` 用 \`tail -f\` 追蹤 httpd access log。注意 httpd 日誌路徑是 \`/usr/local/apache2/logs\`（跟 nginx 不同）。

題目四（port-forward）：\`kubectl port-forward pod/my-httpd 9090:80\`，瀏覽器打開 \`http://localhost:9090\`。

做完的可以用 \`kubectl explain pod.spec.containers\` 探索 Pod 可設定的欄位。`,
  },

  // ========== 第 12 頁：第四堂總結 + 預告 ==========
  {
    title: '第四堂總結 + 預告',
    subtitle: '今天學了什麼 & 下堂課預告',
    section: '總結',
    duration: '15',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天學了什麼</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-2 pr-4">上午</th>
                <th className="pb-2">下午</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">K8s 是什麼 + 為什麼需要</td>
                <td className="py-1">YAML 四大欄位</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">核心資源總覽</td>
                <td className="py-1">第一個 Pod（完整 CRUD）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">K8s 架構（Master + Worker）</td>
                <td className="py-1">Pod 生命週期 + 排錯</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">minikube 安裝</td>
                <td className="py-1">多容器 Pod（Sidecar）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4">kubectl 基本操作</td>
                <td className="py-1">kubectl 進階技巧</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker -&gt; K8s 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-1">你會的 Docker</th>
                <th className="pb-1">今天學的 K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker run</code></td>
                <td className="py-1"><code>kubectl apply -f pod.yaml</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker ps</code></td>
                <td className="py-1"><code>kubectl get pods</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker logs</code></td>
                <td className="py-1"><code>kubectl logs</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker exec</code></td>
                <td className="py-1"><code>kubectl exec</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker stop/rm</code></td>
                <td className="py-1"><code>kubectl delete pod</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1"><code>docker run -p 8080:80</code></td>
                <td className="py-1"><code>kubectl port-forward</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
            <p className="text-amber-400 font-semibold mb-2">回家作業</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li>把今天的 Pod 練習再做一遍（不看筆記）</li>
              <li>試試跑不同的 image：<code>redis</code>、<code>mysql:8.0</code>、<code>python:3.12</code></li>
              <li>觀察它們的日誌和行為有什麼不同</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">下堂課預告</p>
            <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
              <li><strong className="text-white">Deployment</strong> -- 管理多個 Pod，擴縮容、滾動更新</li>
              <li><strong className="text-white">Service</strong> -- 讓外面連得到你的 Pod</li>
              <li><strong className="text-white">k3s</strong> -- 多節點叢集</li>
            </ul>
            <p className="text-slate-400 text-sm mt-2">Pod 是一個人在做事，Deployment 是一個團隊在做事</p>
          </div>
        </div>
      </div>
    ),
    notes: `今天總結。

上午：K8s 是什麼、為什麼需要、核心資源（Pod/Service/Deployment）、架構（Master + Worker）、minikube 安裝。

下午：YAML 四大欄位（apiVersion、kind、metadata、spec）、第一個 Pod（\`kubectl apply\`、\`get\`、\`describe\`、\`logs\`、\`exec\`、\`delete\`）、Pod 排錯（ImagePullBackOff + describe 看 Events）、多容器 Pod（Sidecar 模式共享 Volume）、kubectl 進階（\`port-forward\`、\`--dry-run=client -o yaml\`、\`-o wide/yaml/json\`、\`--watch\`）。

Docker 對照：\`docker run\` -> \`kubectl apply\`、\`docker ps\` -> \`kubectl get pods\`、\`docker logs\` -> \`kubectl logs\`、\`docker exec\` -> \`kubectl exec\`、\`docker stop/rm\` -> \`kubectl delete pod\`、\`docker run -p\` -> \`kubectl port-forward\`。

今天我們一直在手動管理 Pod -- 手動建、手動刪、Pod 掛了手動修。生產環境 100 個 Pod，一個掛了也要手動處理嗎？

下堂課學 Deployment：告訴它「我要 3 個 nginx Pod」，掛了一個自動補回來，要更新版本做滾動更新不中斷服務，要擴容改一個數字。Pod 是一個人做事，Deployment 是一個團隊做事。

還會學 Service -- port-forward 只是臨時除錯工具，Service 才是正式讓外部連到 Pod 的方式（ClusterIP、NodePort）。

也會裝 k3s，從 minikube 單節點升級到多節點叢集，Pod 分散到不同機器上。

回家作業：不看筆記從零寫一個 Pod YAML，試跑不同 image（\`redis\`、\`mysql:8.0\`、\`python:3.12\`），觀察日誌和行為差異。`,
  },
]
