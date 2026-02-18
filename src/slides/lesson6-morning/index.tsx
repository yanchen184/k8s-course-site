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
  {
    title: "第六天上午：組態管理",
    subtitle: "ConfigMap、Secret、Resource Quota 與調度策略",
    section: "課程開場",
    content: (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold text-k8s-blue">Day 6 - Morning</p>
          <p className="text-xl text-slate-400">09:00 - 12:00</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold text-lg">⚙️ 組態管理</p>
            <p className="text-slate-400 text-sm mt-2">ConfigMap & Secret</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold text-lg">📊 資源配額</p>
            <p className="text-slate-400 text-sm mt-2">Resource Quota & LimitRange</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold text-lg">🎯 調度策略</p>
            <p className="text-slate-400 text-sm mt-2">Taints, Tolerations & Affinity</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
          <p className="text-slate-400 text-center">今天我們要學習 Kubernetes 最重要的組態管理機制，以及如何精細控制 Pod 的調度行為</p>
        </div>
      </div>
    ),
    notes: `好，大家早安！歡迎來到第六天的課程。今天上午我們會學習三個非常重要的主題：組態管理、資源配額、還有調度策略。

先讓大家看一下今天上午的議程安排：首先我們會花十分鐘快速回顧昨天學到的東西，確保大家都還記得。接下來是今天的重頭戲——ConfigMap 和 Secret，這兩個是 Kubernetes 組態管理的核心，我們會花大概 70 分鐘把它們講清楚。

然後會有 15 分鐘的休息時間，讓大家去上廁所、喝咖啡。下午我們會繼續講 Resource Quota 和 Taints、Tolerations，最後用 20 分鐘做總結。

今天學完之後，大家就能理解為什麼 Kubernetes 要把組態和程式碼分開管理，這個概念其實來自於 12 Factor App 的設計原則，是現代雲端應用非常重要的一個概念，我們今天也會提到。`,
    duration: "5"
  },
  {
    title: "第五天回顧",
    subtitle: "Deployment 深入、健康檢查、HPA、Service、Ingress",
    section: "課程開場",
    content: (
      <div className="space-y-4">
        <p className="text-xl text-slate-400 mb-4">昨天我們學了哪些重要概念？</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">🚀 Deployment 深入</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• RollingUpdate 策略</li>
              <li>• maxSurge / maxUnavailable</li>
              <li>• 回滾（rollout undo）</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">💗 健康檢查</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• livenessProbe（存活探針）</li>
              <li>• readinessProbe（就緒探針）</li>
              <li>• startupProbe（啟動探針）</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">📈 HPA 自動擴縮</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• CPU/Memory 指標</li>
              <li>• minReplicas / maxReplicas</li>
              <li>• Metrics Server 依賴</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">🌐 網路服務</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Service（ClusterIP/NodePort/LB）</li>
              <li>• Ingress 路由規則</li>
              <li>• TLS 終止</li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">💡 有任何昨天的問題想先釐清嗎？</p>
        </div>
      </div>
    ),
    notes: `好，讓我們先來回顧一下昨天學的東西。昨天是第五天，我們講了很多重要的內容。

第一個是 Deployment 的深入理解。我們學了 RollingUpdate 策略，這是 Kubernetes 預設的更新方式。當你要更新一個 Deployment 的時候，K8s 不會一下子把所有舊的 Pod 都刪掉再建新的，而是逐步替換。maxSurge 是指在更新過程中可以多啟動幾個 Pod，maxUnavailable 是指最多可以有幾個 Pod 不可用。這樣設計的目的是確保服務不中斷。

還有回滾的操作，kubectl rollout undo deployment/myapp 可以把 Deployment 回滾到上一個版本，這在生產環境出問題的時候非常重要。你也可以指定回滾到特定的修訂版本：kubectl rollout undo deployment/myapp --to-revision=2。

第二個是健康檢查，這個非常重要。livenessProbe 是存活探針，用來判斷容器是不是還活著。如果 liveness 探針失敗，K8s 會重啟容器。readinessProbe 是就緒探針，用來判斷容器是不是準備好接受流量了。如果 readiness 探針失敗，K8s 會把這個 Pod 從 Service 的端點列表中移除，但不會重啟容器。startupProbe 是啟動探針，給慢啟動的應用用的，在 startupProbe 成功之前，liveness 和 readiness 探針都不會執行。

第三個是 HPA，水平 Pod 自動擴縮。根據 CPU 或記憶體使用率自動增加或減少 Pod 數量。這需要先安裝 Metrics Server 才能運作。

第四個是網路服務，Service 和 Ingress。Service 提供穩定的虛擬 IP，Ingress 提供 HTTP/HTTPS 的路由功能。

好，有沒有昨天的內容想補充問的？如果有的話現在可以問，等一下我們就要進入今天的新主題了。通常我建議大家，如果有疑問盡量在當天問，因為這些概念環環相扣，前面沒搞清楚，後面會越來越難懂。

（等待 1-2 分鐘讓學生提問，如果沒有問題就繼續往下）

好，那我們就開始今天的課程，從 ConfigMap 開始。`,
    duration: "10"
  },
  {
    title: "ConfigMap 是什麼？",
    subtitle: "把組態從程式碼中分離出來",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-xl mb-2">12 Factor App 原則</p>
          <p className="text-slate-400">「把設定存在環境，不要寫死在程式碼裡」</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">❌ 不好的做法</p>
            <pre className="text-sm text-slate-400">
{`// app.js
const DB_HOST = "192.168.1.100"
const DB_PORT = "5432"
const DB_NAME = "mydb"`}
            </pre>
          </div>
          <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 好的做法</p>
            <pre className="text-sm text-slate-400">
{`// app.js
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME`}
            </pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">ConfigMap 的用途</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-slate-400">
            <p>• 應用程式設定</p>
            <p>• 環境差異化設定</p>
            <p>• 設定檔案掛載</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們開始講 ConfigMap。

ConfigMap 的中文可以叫做「組態映射」，但大家直接叫 ConfigMap 就好，這是 Kubernetes 提供的一種 API 物件，用來儲存非機密性的設定資料。

為什麼要有 ConfigMap？這要從一個很重要的軟體設計原則說起，叫做 12 Factor App。這是 Heroku 在 2012 年提出的，描述了現代雲端應用應該怎麼設計。其中第三個原則就是：「把設定存在環境，不要寫死在程式碼裡。」

想想看，如果你今天把資料庫的 IP 寫死在程式碼裡，那開發環境、測試環境、生產環境就需要三個不同的程式碼版本。這很麻煩，而且很容易出錯。更嚴重的是，如果你不小心把生產環境的資料庫密碼提交到 git，那就糟了。

所以正確的做法是：程式碼從環境變數讀取設定。但是，在 Kubernetes 中，我們怎麼管理這些環境變數呢？如果每個 Pod 的 YAML 都要手動設定環境變數，那管理起來也很麻煩。這就是 ConfigMap 的用武之地。

ConfigMap 就像一個設定檔的容器，你把所有的設定放進去，然後告訴 Pod 從哪個 ConfigMap 讀取設定。這樣你就可以在不同的 Namespace 使用不同的 ConfigMap，實現環境隔離。

舉個實際的例子：你有一個 Node.js 應用，在開發環境連的是本機資料庫，在生產環境連的是雲端資料庫。你只需要在開發環境和生產環境分別建立內容不同的 ConfigMap，但 Pod 的 YAML 設定可以完全一樣，都是從同一個 ConfigMap 名稱讀取設定。

這樣的設計有很多好處：一、程式碼和設定分離，程式碼更乾淨；二、不同環境只需要改 ConfigMap，不需要改程式碼；三、設定的變更可以獨立追蹤；四、團隊合作更方便，開發者不需要知道生產環境的設定。`,
    duration: "5"
  },
  {
    title: "ConfigMap 建立方式",
    subtitle: "四種方式：字面值、YAML、從檔案、從目錄",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">方式一：字面值</p>
            <pre className="text-xs text-slate-400">
{`kubectl create configmap app-config \\
  --from-literal=DB_HOST=mydb.example.com \\
  --from-literal=DB_PORT=5432 \\
  --from-literal=APP_ENV=production`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">方式二：YAML 宣告式</p>
            <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "mydb.example.com"
  DB_PORT: "5432"
  APP_ENV: "production"`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">方式三：從檔案建立</p>
            <pre className="text-xs text-slate-400">
{`# 假設 app.properties 存在
kubectl create configmap app-config \\
  --from-file=app.properties

# 自訂 key 名稱
kubectl create configmap app-config \\
  --from-file=config=app.properties`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">方式四：從目錄建立</p>
            <pre className="text-xs text-slate-400">
{`# 目錄結構：
# config/
#   app.properties
#   logging.properties
kubectl create configmap app-config \\
  --from-file=config/`}
            </pre>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來我們來學 ConfigMap 的四種建立方式。

第一種是字面值，也就是直接在命令列上指定 key-value。用的是 --from-literal 這個選項，每個 key-value 對都要加一個 --from-literal。這種方式很直觀，適合設定比較少的情況。但是如果有很多設定，命令就會很長，不好維護。

來實際練習一下，大家在終端機輸入：
kubectl create configmap app-config --from-literal=DB_HOST=mydb.example.com --from-literal=DB_PORT=5432

然後用 kubectl describe configmap app-config 查看建立的結果，你會看到 Data 區段裡有 DB_HOST 和 DB_PORT 兩個 key。

第二種是 YAML 宣告式，這是最推薦的方式，因為可以版本控制、可以 review、可以 apply。你看這個 YAML，很簡單，apiVersion 是 v1，kind 是 ConfigMap，然後在 data 區段放你的 key-value 對。注意這裡的 value 都要是字串，所以數字要加引號。

第三種是從檔案建立。假設你有一個 app.properties 檔案，裡面有很多設定，你可以直接把整個檔案塞進 ConfigMap。這時候預設的 key 就是檔案名稱，value 就是整個檔案的內容。如果你想自訂 key 的名稱，可以用 --from-file=config=app.properties，這樣 key 就是 "config"。

這種方式特別適合當你的應用程式需要讀取設定檔（而不是環境變數）的時候，後面我們講 Volume 掛載的時候會很有用。

第四種是從目錄建立。如果你有一個目錄，裡面有好幾個設定檔，你可以一次把整個目錄轉成 ConfigMap。K8s 會把目錄裡每個檔案都變成一個 key，key 是檔案名稱，value 是檔案內容。

在實際工作中，我最常用的是 YAML 宣告式，因為可以和程式碼一起放進 git，方便追蹤變更。字面值方式適合快速測試。`,
    duration: "10"
  },
  {
    title: "ConfigMap 使用方式一：環境變數注入",
    subtitle: "envFrom 全部注入 vs env valueFrom 單一注入",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">envFrom：全部注入</p>
            <pre className="text-xs text-slate-400">
{`spec:
  containers:
  - name: app
    image: myapp:1.0
    envFrom:
    - configMapRef:
        name: app-config
    # ConfigMap 裡所有 key
    # 都變成環境變數`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">env valueFrom：單一注入</p>
            <pre className="text-xs text-slate-400">
{`spec:
  containers:
  - name: app
    image: myapp:1.0
    env:
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_HOST
    - name: DATABASE_PORT
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_PORT`}
            </pre>
          </div>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">⚠️ 注意：環境變數注入後，ConfigMap 更新不會即時生效，需要重啟 Pod</p>
        </div>
      </div>
    ),
    notes: `好，現在我們學習怎麼在 Pod 裡使用 ConfigMap。第一種方式是注入成環境變數，這也是最常用的方式。

envFrom 是「全部注入」的方式。你在 container 的 spec 裡加上 envFrom，然後指定 configMapRef 的 name。這樣 ConfigMap 裡所有的 key-value 對都會變成容器的環境變數。非常方便，一行就搞定。

但這樣有個小問題：如果 ConfigMap 裡有很多 key，你的容器就會有很多環境變數，有些可能不是這個容器需要的。另外，如果 ConfigMap 裡的 key 跟容器裡現有的環境變數名稱衝突，可能會有問題。

所以有時候我們用 env valueFrom 的方式，只注入特定的 key。你可以看到，這個方式可以重新命名環境變數，比如把 ConfigMap 裡的 DB_HOST 改名成 DATABASE_HOST 注入到容器裡。這樣更靈活，但是設定起來也更繁瑣。

在實際工作中，我的建議是：如果 ConfigMap 是專門為這個應用程式設計的，就用 envFrom，簡單乾淨。如果 ConfigMap 是共用的，或者你需要重新命名 key，就用 env valueFrom。

有一個非常重要的注意事項，大家一定要記住：透過環境變數注入的 ConfigMap，如果你之後更新了 ConfigMap 的內容，容器裡的環境變數不會自動更新。環境變數是在容器啟動的時候就設定好的，之後就不變了。

所以如果你改了 ConfigMap，需要重啟 Pod 才會讓新的設定生效。在 Kubernetes 裡，重啟 Pod 最簡單的方式是 kubectl rollout restart deployment/myapp。

這一點很多初學者會搞錯，覺得改了 ConfigMap 就生效了，結果應用程式還是用舊的設定，然後很困惑。所以一定要記住：環境變數注入 = 需要重啟才生效。

等一下我們講 Volume 掛載的方式，那個是可以自動更新的，我們比較一下就知道差別在哪裡。`,
    duration: "8"
  },
  {
    title: "ConfigMap 使用方式二：Volume 掛載為檔案",
    subtitle: "把 ConfigMap 的內容掛載成容器內的檔案",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">Volume 掛載範例</p>
          <pre className="text-xs text-slate-400">
{`spec:
  volumes:
  - name: config-volume
    configMap:
      name: app-config          # ConfigMap 名稱
  containers:
  - name: app
    image: myapp:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config    # 掛載到容器內的路徑
      # 每個 key 都變成一個檔案
      # /etc/config/DB_HOST
      # /etc/config/DB_PORT`}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-400/10 border border-green-400/30 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-1">✅ Volume 掛載優點</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• ConfigMap 更新後約 1 分鐘自動同步</li>
              <li>• 適合設定檔（nginx.conf、app.yaml）</li>
              <li>• 可以只掛載特定的 key</li>
            </ul>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-1">⚠️ 注意事項</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 應用程式需支援熱重載（hot reload）</li>
              <li>• 檔案更新有最多 2 分鐘延遲</li>
              <li>• 掛載到現有目錄會覆蓋原有內容</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們講 ConfigMap 的第二種使用方式：Volume 掛載。這個方式是把 ConfigMap 的內容掛載成容器內的檔案。

概念很簡單：ConfigMap 的每一個 key 都會變成一個檔案，key 是檔案名稱，value 是檔案內容。掛載到你指定的路徑下。

比如說，你的 ConfigMap 有 DB_HOST 和 DB_PORT 兩個 key，掛載到 /etc/config 之後，容器裡就會有 /etc/config/DB_HOST 和 /etc/config/DB_PORT 這兩個檔案。

YAML 的寫法是：先在 volumes 區段定義一個 volume，type 是 configMap，指定 ConfigMap 的名稱。然後在 volumeMounts 區段把這個 volume 掛載到指定路徑。

Volume 掛載和環境變數注入最大的差別在於：Volume 掛載的內容可以自動更新！當你更新 ConfigMap 之後，大概一到兩分鐘之內，容器裡的檔案內容也會更新。

但是這裡有個重要的前提：你的應用程式要能夠在不重啟的情況下，重新讀取設定檔。這叫做熱重載（hot reload）。有些應用程式支援，有些不支援。

比如 Nginx 支援熱重載，你可以發送 SIGHUP 信號給 Nginx，它就會重新讀取設定檔而不需要重啟。但是很多應用程式只在啟動時讀取設定，之後就不管了，這種情況下就算檔案更新了，應用程式也感知不到。

所以要享受 Volume 掛載的自動更新優點，你需要確認你的應用程式支援熱重載，或者自己實作一個 sidecar 容器監控設定檔的變化並重啟主容器。

Volume 掛載特別適合 Nginx、Apache 這類需要設定檔的應用程式，或者是需要讀取 JSON/YAML 格式設定的應用程式。

還有一個小技巧：如果你不想把整個目錄掛載，只想掛載特定的 key，可以在 volumes 裡的 configMap 下面加 items 區段，指定要掛載哪些 key 以及對應的檔案名稱。這樣你可以精確控制掛載的內容。`,
    duration: "7"
  },
  {
    title: "ConfigMap 更新行為比較",
    subtitle: "什麼時候會自動更新？什麼時候需要重啟？",
    section: "ConfigMap 深入",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">❌ 需要重啟 Pod</p>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>• envFrom（全部注入）</li>
              <li>• env valueFrom（單一注入）</li>
              <li>• 原因：環境變數在啟動時設定，不可變更</li>
            </ul>
            <div className="mt-3 bg-slate-900/50 p-2 rounded text-xs text-slate-400">
              <code>kubectl rollout restart deployment/myapp</code>
            </div>
          </div>
          <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 自動更新（約 1-2 分鐘）</p>
            <ul className="text-slate-400 text-sm space-y-2">
              <li>• Volume 掛載為檔案</li>
              <li>• 需應用程式支援 hot reload</li>
              <li>• kubelet 同步週期控制延遲</li>
            </ul>
            <div className="mt-3 bg-slate-900/50 p-2 rounded text-xs text-slate-400">
              <code>kubectl apply -f configmap.yaml</code>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">最佳實踐：不可變 ConfigMap</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-v2  # 用版本號命名
immutable: true        # 設為不可變，提升效能
data:
  APP_VERSION: "2.0"`}
          </pre>
        </div>
      </div>
    ),
    notes: `好，讓我們把 ConfigMap 的更新行為做個整理比較，這個很重要，考試和面試都很常考。

環境變數注入（不管是 envFrom 還是 env valueFrom）：更新 ConfigMap 之後，容器裡的環境變數不會改變，需要重啟 Pod。因為環境變數是進程啟動時從作業系統繼承的，一旦進程啟動就不能更改了。

Volume 掛載：更新 ConfigMap 之後，大概一到兩分鐘之內，掛載的檔案內容會自動更新。這是因為 kubelet 有一個同步週期（預設是 60 秒），會定期把 ConfigMap 的最新內容同步到 Volume。

但是要強調一點，就算 Volume 裡的檔案更新了，你的應用程式也不一定能感知到。這取決於應用程式是否有監控設定檔變化的機制。

在實際工作中，我有一個建議：不要依賴 ConfigMap 的自動更新來管理重要設定，因為這個機制有延遲，而且行為依賴應用程式的實作。更好的做法是把 ConfigMap 的名稱包含版本號，每次要更新設定的時候，建立一個新的 ConfigMap，然後更新 Pod 的設定，讓 Pod 滾動更新到使用新的 ConfigMap。

這就是 immutable ConfigMap 的概念。你可以在 ConfigMap 裡加上 immutable: true，把 ConfigMap 設為不可變的。這樣有幾個好處：一、防止意外修改；二、提升 K8s 效能，因為 K8s 不需要監控這個 ConfigMap 的變化；三、強迫你採用版本化管理的方式。

命名方式可以是 app-config-v1、app-config-v2，或者帶上 commit hash，比如 app-config-abc1234。每次變更設定就建立新版本，老版本暫時保留，等確認新版沒問題後再刪除舊版。

好，ConfigMap 的部分我們差不多講完了，大家有問題嗎？

（等待問題，然後繼續）

接下來我們進入今天最重要的主題：Secret！`,
    duration: "10"
  },
  {
    title: "Secret 是什麼？",
    subtitle: "儲存敏感資料的特殊 ConfigMap",
    section: "Secret",
    content: (
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-xl mb-2">🔐 Secret 就像保險箱</p>
          <p className="text-slate-400">ConfigMap 是公開的設定，Secret 是機密的資料。雖然本質類似，但有額外的安全保護。</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-yellow-400 font-semibold">Opaque</p>
            <p className="text-slate-400 text-sm mt-1">自訂鍵值對<br/>最常用的類型</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-yellow-400 font-semibold">kubernetes.io/tls</p>
            <p className="text-slate-400 text-sm mt-1">TLS 憑證<br/>Ingress 用</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-yellow-400 font-semibold">kubernetes.io/dockerconfigjson</p>
            <p className="text-slate-400 text-sm mt-1">Docker Registry<br/>私有映像檔認證</p>
          </div>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-1">⚠️ 重要：Secret 的資料是 base64 編碼，不是加密！</p>
          <p className="text-slate-400 text-sm">base64 只是編碼，不是加密。任何人都可以解碼。真正的加密需要額外配置。</p>
        </div>
      </div>
    ),
    notes: `好，接下來是今天最重要的主題：Secret。

Secret 是 Kubernetes 用來儲存敏感資料的物件，比如密碼、API 金鑰、TLS 憑證等等。

我喜歡用一個比喻：ConfigMap 就像辦公室的公告欄，大家都可以看；Secret 就像保險箱，需要授權才能打開。

Secret 和 ConfigMap 在使用方式上非常類似，也可以注入成環境變數或者 Volume 掛載。但是 Secret 有一些額外的安全保護機制：

一、Secret 只存在於有 Pod 使用它的節點的記憶體中，不會寫入磁碟（tmpfs）。這樣就算入侵者拿到了節點的磁碟，也不能從磁碟裡讀取 Secret。

二、K8s 可以設定 etcd 的靜態加密，讓 Secret 在 etcd 裡是加密儲存的。這個需要另外配置。

三、RBAC（角色基礎存取控制）可以限制誰可以讀取哪些 Secret。

現在我要說一個非常重要的事情，請大家認真聽：Secret 的資料是 base64 編碼，不是加密！

base64 只是一種編碼方式，不是加密。任何人都可以輕易解碼。比如 echo "bXlwYXNzd29yZA==" | base64 -d 就可以解碼。

所以 Secret 的安全性並不是靠 base64 提供的，而是靠 K8s 的存取控制機制提供的。如果沒有配置好 RBAC，任何能存取叢集的人都可以讀取 Secret。

這是一個非常常見的誤解，大家一定要記住。

Secret 有幾種類型：
最常用的是 Opaque，這是自訂類型，可以放任何 key-value 對。
kubernetes.io/tls 是 TLS 憑證類型，用於 Ingress 的 HTTPS 設定。
kubernetes.io/dockerconfigjson 是 Docker Registry 認證，讓 K8s 可以從私有 Registry 拉取映像檔。

接下來我們看看怎麼建立 Secret。`,
    duration: "8"
  },
  {
    title: "建立 Secret",
    subtitle: "kubectl create secret 與 YAML 的 base64 編碼",
    section: "Secret",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">kubectl 建立（自動 base64）</p>
            <pre className="text-xs text-slate-400">
{`# Opaque Secret
kubectl create secret generic db-secret \\
  --from-literal=username=admin \\
  --from-literal=password=MyP@ssw0rd

# TLS Secret
kubectl create secret tls my-tls \\
  --cert=tls.crt \\
  --key=tls.key

# Docker Registry Secret
kubectl create secret docker-registry \\
  my-registry \\
  --docker-server=registry.example.com \\
  --docker-username=user \\
  --docker-password=pass`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">YAML 建立（需手動 base64）</p>
            <pre className="text-xs text-slate-400">
{`# 先取得 base64 值
$ echo -n "admin" | base64
YWRtaW4=
$ echo -n "MyP@ssw0rd" | base64
TXlQQHNzdzByZA==

apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=      # base64(admin)
  password: TXlQQHNzdzByZA==

# 或使用 stringData（不需 base64）
stringData:
  username: admin
  password: MyP@ssw0rd`}
            </pre>
          </div>
        </div>
        <div className="bg-red-400/10 border border-red-400/30 p-3 rounded-lg">
          <p className="text-red-400 text-sm">🚨 注意：不要把包含 Secret 明文的 YAML 提交到 git！使用 stringData 後記得加入 .gitignore</p>
        </div>
      </div>
    ),
    notes: `好，讓我們看看怎麼建立 Secret。

第一種方式是用 kubectl create secret 命令，這跟 ConfigMap 類似，但命令是 kubectl create secret，而且要指定 Secret 的類型。

最常用的是 generic 類型，對應到 Opaque。用 --from-literal 指定 key-value 對。當你用這個方式建立 Secret 的時候，kubectl 會自動把 value 進行 base64 編碼，你不需要自己做。

TLS Secret 的建立方式稍有不同，你需要提供憑證檔案（.crt）和私鑰檔案（.key）。

Docker Registry Secret 讓你可以從私有 Registry 拉取映像檔。建立之後，你需要在 Pod 或 ServiceAccount 的 imagePullSecrets 裡引用它。

第二種方式是 YAML。這裡要注意，如果你用 data 區段，你需要自己對 value 進行 base64 編碼。可以用 echo -n "admin" | base64 取得。注意要加 -n 參數，不然 echo 會在最後加上換行符，base64 之後的值就不對了。

還有一個更方便的方式：用 stringData 區段。stringData 裡的值是明文，K8s 會自動幫你做 base64 編碼。這樣 YAML 比較好讀，但是有一個非常嚴重的安全問題：如果你把這個 YAML 提交到 git，密碼就洩漏了。

所以我的建議是：
一、包含密碼明文的 YAML 絕對不要提交到 git。
二、可以用 .gitignore 把這些檔案排除。
三、更好的做法是用 CI/CD 系統，在部署的時候動態建立 Secret，密碼存在 CI/CD 系統的 vault 裡。
四、或者使用外部 Secret 管理工具，比如 HashiCorp Vault、AWS Secrets Manager 等，透過 ESO（External Secrets Operator）把外部的 secret 同步到 K8s Secret。

大家記住一個原則：密碼就像牙刷，不要和別人分享，也不要放在公共場所。git repo 就是公共場所。

讓我們來練習一下，大家打開終端機，建立一個 Secret：kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=secret123

然後用 kubectl get secret db-secret -o yaml 查看，你會看到 data 區段裡的值是 base64 編碼的。`,
    duration: "10"
  },
  {
    title: "Secret 使用方式",
    subtitle: "Volume 掛載（推薦）vs 環境變數（謹慎使用）",
    section: "Secret",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 推薦：Volume 掛載</p>
            <pre className="text-xs text-slate-400">
{`spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret
  containers:
  - name: app
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  # 容器內：
  # /etc/secrets/username
  # /etc/secrets/password`}
            </pre>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">⚠️ 謹慎使用：環境變數</p>
            <pre className="text-xs text-slate-400">
{`spec:
  containers:
  - name: app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
  # 問題：
  # 子進程會繼承環境變數
  # ps aux 可以看到環境變數
  # 日誌可能意外記錄環境變數`}
            </pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">為什麼 Volume 掛載比較安全？</p>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• 儲存在 tmpfs（記憶體），不寫入磁碟</li>
            <li>• 不會出現在 /proc/&lt;pid&gt;/environ</li>
            <li>• 可以設定 readOnly: true</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，接下來是 Secret 的使用方式。這部分我要特別強調安全性，因為 Secret 的錯誤使用方式在生產環境中非常常見，而且可能導致嚴重的安全問題。

Secret 的使用方式和 ConfigMap 完全一樣，也是兩種：環境變數注入和 Volume 掛載。但是對於 Secret，我強烈建議使用 Volume 掛載而不是環境變數注入。

為什麼環境變數不安全呢？

第一個原因：環境變數對所有子進程可見。在 Linux 裡，當你啟動一個子進程，它會繼承父進程的所有環境變數。這意味著如果你的應用程式啟動了任何子進程（比如執行 shell 命令），這些子進程都能存取你的密碼。

第二個原因：環境變數會出現在 /proc/pid/environ 裡。在 Linux 系統上，進程的環境變數是以明文儲存在 /proc 目錄下的。任何有權限讀取這個檔案的進程都能看到密碼。

第三個原因：環境變數可能被意外記錄到日誌裡。應用程式有時候會在啟動時記錄所有環境變數，或者在 crash 的時候 dump 所有環境變數。這樣密碼就出現在日誌裡了，而日誌通常會被收集到集中的日誌系統，存取控制可能沒那麼嚴格。

Volume 掛載比較安全，原因如下：

一、Secret 的 Volume 是用 tmpfs 掛載的，tmpfs 是記憶體檔案系統，不會寫入磁碟。就算節點磁碟被存取，也讀不到 Secret 的內容。

二、Secret 的值是以檔案的形式存在的，不會出現在 /proc/pid/environ 裡。

三、你可以設定 readOnly: true，讓容器只能讀取這些檔案，不能修改。

四、掛載的 Secret 對子進程不可見（除非子進程有權限讀取掛載的目錄）。

所以正確的做法是：密碼、API 金鑰等敏感資訊，永遠用 Volume 掛載，不要用環境變數。設定性的資訊（比如服務 URL、功能開關）可以用環境變數，因為這些不是機密資訊。

當然，如果你的應用程式只能從環境變數讀取設定，那也沒辦法，但要知道這樣做的風險。`,
    duration: "10"
  },
  {
    title: "Secret 安全性深入",
    subtitle: "etcd 加密、RBAC 限制、外部 Secret 工具",
    section: "Secret",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">1️⃣ etcd 靜態加密</p>
            <p className="text-slate-400 text-sm">預設 Secret 在 etcd 是明文儲存的。需要另外配置 EncryptionConfiguration 才會加密。</p>
            <pre className="text-xs text-slate-400 mt-2">
{`# 驗證是否加密
etcdctl get /registry/secrets/default/db-secret`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">2️⃣ RBAC 最小權限</p>
            <pre className="text-xs text-slate-400">
{`kind: Role
apiVersion: rbac.authorization.k8s.io/v1
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
  resourceNames: ["db-secret"]
  # 只允許讀取特定 Secret`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">3️⃣ 外部 Secret 工具</p>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• HashiCorp Vault</li>
              <li>• AWS Secrets Manager</li>
              <li>• GCP Secret Manager</li>
              <li>• External Secrets Operator</li>
              <li>• Sealed Secrets</li>
            </ul>
          </div>
        </div>
        <div className="bg-red-400/10 border border-red-400/30 p-3 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">🚨 安全原則：最小權限原則</p>
          <p className="text-slate-400 text-sm">每個服務帳戶只應該能存取它需要的 Secret，不能存取不相關的 Secret</p>
        </div>
      </div>
    ),
    notes: `好，讓我們深入討論 Secret 的安全性。這個部分在生產環境中非常重要，很多公司因為忽視這些細節而發生了資安事件。

第一個問題：etcd 的靜態加密。

很多人以為把資料存進 K8s Secret 就安全了，但其實預設情況下，Secret 的資料在 etcd 裡是以 base64 編碼的方式儲存的，而 base64 不是加密，任何能存取 etcd 的人都可以讀取。

如果你的 etcd 被攻擊者存取，他們可以把所有 Secret 都偷走。所以在生產環境，強烈建議開啟 etcd 的靜態加密功能（Encryption at Rest）。這需要在 kube-apiserver 的啟動參數裡加上 --encryption-provider-config，並配置加密提供者。

你可以用 etcdctl 直接查詢 etcd 來驗證是否有加密：如果看到的是亂碼就是加密了，如果看到可讀的 JSON 就沒有加密。

第二個問題：RBAC 最小權限原則。

K8s 的 RBAC 讓你可以精細控制誰可以存取哪些 Secret。最佳實踐是：每個服務帳戶（ServiceAccount）只應該能存取它需要的 Secret，不能存取不相關的 Secret。

你可以建立一個 Role，只允許讀取特定名稱的 Secret，然後把這個 Role 綁定到你的服務帳戶。這樣就算攻擊者拿到了你的服務帳戶憑證，他也只能讀取這個特定的 Secret，不能讀取其他的。

第三個問題：外部 Secret 管理工具。

對於嚴格的安全需求，K8s 內建的 Secret 可能不夠用。這時候可以考慮使用外部的 Secret 管理工具，比如 HashiCorp Vault、AWS Secrets Manager、GCP Secret Manager 等。

External Secrets Operator（ESO）是一個 Kubernetes operator，它可以把外部 Secret 管理工具的 Secret 同步到 K8s Secret。這樣你可以繼續在 K8s 裡用 Secret，但實際的密碼是存在更安全的外部系統裡的。

Sealed Secrets 是另一個工具，它讓你可以把加密過的 Secret 存到 git。加密是用公鑰完成的，只有叢集裡的 controller 有私鑰可以解密。這樣你就可以用 GitOps 的方式管理 Secret，而且不用擔心密碼洩漏到 git。

在實際的生產環境，我推薦的做法是：
一、開啟 etcd 靜態加密。
二、嚴格設定 RBAC。
三、使用外部 Secret 工具（至少是 Sealed Secrets）。
四、定期輪換 Secret。
五、監控 Secret 的存取記錄。

好，Secret 的部分我們講得差不多了。大家有問題嗎？`,
    duration: "7"
  },
  {
    title: "休息時間",
    subtitle: "15 分鐘",
    section: "休息",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-6xl">☕</p>
        <p className="text-3xl font-bold text-k8s-blue">休息 15 分鐘</p>
        <p className="text-xl text-slate-400">10:10 - 10:25</p>
        <div className="bg-slate-800/50 p-4 rounded-lg mt-6">
          <p className="text-slate-400">休息回來我們會繼續講：</p>
          <ul className="text-left mt-2 space-y-1 text-slate-300">
            <li>• Resource Quota - 資源配額</li>
            <li>• LimitRange - 預設資源限制</li>
            <li>• Taints & Tolerations - 污點與容忍</li>
            <li>• Node Affinity - 節點親和性</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，我們先休息 15 分鐘！大家去上廁所、喝咖啡、活動一下。

休息的時候可以消化一下剛才學的 ConfigMap 和 Secret，有什麼問題等一下回來可以問我。

10:25 我們準時繼續，接下來會講 Resource Quota 和調度策略，這些對管理多租戶 Kubernetes 叢集非常重要。`,
    duration: "15"
  },
  {
    title: "Resource Quota：Namespace 資源配額",
    subtitle: "限制 Namespace 內可用的 CPU、記憶體和物件數量",
    section: "Resource Quota",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">為什麼需要 Resource Quota？</p>
          <p className="text-slate-400 text-sm">在多租戶叢集中，防止某個團隊用盡所有資源，確保公平分配</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">ResourceQuota YAML 範例</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: team-a       # 作用在特定 Namespace
spec:
  hard:
    # CPU 和記憶體
    requests.cpu: "4"         # 總 CPU requests 上限
    requests.memory: 8Gi      # 總 Memory requests 上限
    limits.cpu: "8"           # 總 CPU limits 上限
    limits.memory: 16Gi       # 總 Memory limits 上限
    # 物件數量
    pods: "20"                # 最多 20 個 Pod
    services: "10"
    persistentvolumeclaims: "5"
    secrets: "20"
    configmaps: "20"`}
          </pre>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-2 rounded-lg">
          <p className="text-yellow-400 text-sm">設定了 ResourceQuota 後，Pod 的 requests/limits 就變成必填項目</p>
        </div>
      </div>
    ),
    notes: `好，我們回來了。接下來講 Resource Quota，這是 Kubernetes 的資源配額功能。

想像一下，你的公司有一個共用的 Kubernetes 叢集，裡面有三個團隊：前端團隊、後端團隊、數據分析團隊。如果沒有限制，哪個團隊都可以無限制地使用叢集資源。萬一某個團隊的應用程式有 bug，大量消耗 CPU 和記憶體，就可能影響到其他團隊的服務。

Resource Quota 就是用來解決這個問題的。你可以給每個 Namespace 設定資源配額，限制這個 Namespace 裡所有 Pod 加起來最多可以用多少 CPU、多少記憶體，以及最多可以建立多少個 Pod、Service、PVC 等物件。

讓我們看 YAML 的範例：

ResourceQuota 作用在特定的 Namespace，你要在 metadata.namespace 裡指定。在 spec.hard 裡定義各種限制：

requests.cpu 和 limits.cpu 是 CPU 的限制，分別對應 Pod 的 resources.requests.cpu 和 resources.limits.cpu。
requests.memory 和 limits.memory 是記憶體的限制。
pods 是 Pod 數量的限制。
services、persistentvolumeclaims、secrets、configmaps 等是各種 K8s 物件數量的限制。

有一個很重要的副作用：當你在 Namespace 裡設定了 ResourceQuota 之後，在這個 Namespace 裡建立的每個 Pod 都必須明確設定 requests 和 limits，不然就會被拒絕建立。

這其實是一個好習慣，因為設定 requests 和 limits 可以幫助 Kubernetes 更好地調度 Pod，避免資源爭搶。

你可以用 kubectl describe resourcequota team-quota -n team-a 查看目前的資源使用情況和剩餘配額。

在實際工作中，給不同的團隊或不同的環境（dev/staging/prod）設定不同的 ResourceQuota 是很常見的做法。生產環境通常會給最多資源，開發環境給少一些，以降低成本。`,
    duration: "12"
  },
  {
    title: "LimitRange：預設資源限制",
    subtitle: "為 Namespace 內的 Pod 設定預設 requests/limits",
    section: "Resource Quota",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">問題：開發者沒有設定 resources 怎麼辦？</p>
          <p className="text-slate-400 text-sm">LimitRange 為沒有設定 resources 的 Pod/Container 自動補上預設值</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: team-a
spec:
  limits:
  - type: Container
    default:          # 預設 limits（若未設定）
      cpu: 500m
      memory: 512Mi
    defaultRequest:   # 預設 requests（若未設定）
      cpu: 100m
      memory: 128Mi
    max:              # 單一容器最大值
      cpu: "2"
      memory: 2Gi
    min:              # 單一容器最小值
      cpu: 50m
      memory: 64Mi`}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-400/10 border border-green-400/30 p-3 rounded-lg">
            <p className="text-green-400 text-sm font-semibold">ResourceQuota vs LimitRange</p>
            <p className="text-slate-400 text-sm">Quota：Namespace 總量上限<br/>LimitRange：單個 Container 的規範</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue text-sm font-semibold">兩者通常一起使用</p>
            <p className="text-slate-400 text-sm">LimitRange 確保每個 Pod 都有合理的資源設定，ResourceQuota 確保總量不超標</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來講 LimitRange，這個跟 ResourceQuota 是配合使用的。

我們說了，設定 ResourceQuota 之後，所有 Pod 都必須設定 requests 和 limits。但問題是，如果開發者忘了設定，Pod 就建立不了，會報錯。而且開發者不一定知道要設定多少才合理。

LimitRange 解決了這個問題。LimitRange 可以為 Namespace 裡的 Pod 和 Container 設定預設值：如果開發者沒有設定 requests 和 limits，K8s 會自動用 LimitRange 裡定義的預設值來補上。

LimitRange 的設定有幾個部分：
default 是預設的 limits，當 Container 沒有設定 limits 時使用。
defaultRequest 是預設的 requests，當 Container 沒有設定 requests 時使用。
max 是單個 Container 的最大值，就算開發者設定了更大的值，也會被截斷到 max。
min 是單個 Container 的最小值，如果設定的值比 min 還小，就會被拒絕。

所以 LimitRange 有雙重作用：一是提供預設值，讓開發者不必每次都設定；二是設定合理範圍，防止 Container 設定過大或過小。

ResourceQuota 和 LimitRange 的關係：
ResourceQuota 控制的是 Namespace 裡所有 Pod 加起來的總量，確保整個 Namespace 的資源使用不超出配額。
LimitRange 控制的是單個 Container 或 Pod 的資源設定，確保每個 Pod 都有合理的設定。

這兩個通常一起使用：LimitRange 確保每個 Container 都有合適的資源設定，ResourceQuota 確保整個 Namespace 的總用量在預算內。

實際應用：在一個多租戶叢集裡，你可以為每個團隊的 Namespace 設定：
一、LimitRange：設定合理的預設值和上限，保護節點不被單個容器佔用太多資源。
二、ResourceQuota：設定這個團隊可以使用的總資源量。

這樣團隊成員可以自由在自己的 Namespace 裡工作，不需要每次都設定資源，但又不會影響到其他團隊。`,
    duration: "13"
  },
  {
    title: "Taints & Tolerations：污點與容忍",
    subtitle: "控制哪些 Pod 可以調度到哪些節點",
    section: "Taints & Tolerations",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">概念說明</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-yellow-400 font-semibold">Taint（污點）</p>
              <p className="text-slate-400">設在 Node 上，標記「這個節點不歡迎普通 Pod」</p>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold">Toleration（容忍）</p>
              <p className="text-slate-400">設在 Pod 上，表示「我可以容忍這個污點」</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">kubectl taint 操作</p>
            <pre className="text-xs text-slate-400">
{`# 新增 Taint
kubectl taint nodes node1 \\
  env=production:NoSchedule

# 三種效果：
# NoSchedule    - 不調度
# PreferNoSchedule - 盡量不調度
# NoExecute     - 不調度且驅逐

# 移除 Taint（末尾加 -）
kubectl taint nodes node1 \\
  env=production:NoSchedule-`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Pod Toleration 設定</p>
            <pre className="text-xs text-slate-400">
{`spec:
  tolerations:
  - key: "env"
    operator: "Equal"
    value: "production"
    effect: "NoSchedule"
  # 或者容忍所有污點
  - operator: "Exists"
    effect: "NoSchedule"`}
            </pre>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來我們講 Taints 和 Tolerations，這是 Kubernetes 調度策略的重要機制。

我先用一個生活比喻來解釋：想像 Taint 就是節點貼的一個「謝絕訪客」的標籤。大部分 Pod 看到這個標籤就不會去那個節點。但是如果 Pod 有 Toleration（容忍），就像是有一個特殊的通行證，可以忽略這個標籤，照常去那個節點。

這個機制用於什麼場景呢？

場景一：你有幾台配備 GPU 的節點，你只想讓需要 GPU 的深度學習任務去這些節點，不想讓普通的 web 應用也跑到這些昂貴的 GPU 節點上佔用資源。

場景二：你有一台生產環境的節點，只想讓有「production ready」標籤的 Pod 去跑，不想讓開發環境的測試 Pod 跑到生產節點上。

場景三：某台節點需要維護，你想把它上面的 Pod 都驅逐走，這時候就加一個 NoExecute 的 Taint。

Taint 有三種效果：
NoSchedule：不調度。加了這個 Taint 之後，沒有對應 Toleration 的 Pod 不會被調度到這個節點。但是已經在這個節點上的 Pod 不受影響。
PreferNoSchedule：盡量不調度。K8s 會盡量避免把 Pod 調度到這個節點，但如果沒有其他選擇，還是可以調度過去。
NoExecute：不調度，且驅逐。不僅新 Pod 不會調度過來，現有的 Pod 也會被驅逐。這個效果最強。

建立 Taint 的命令格式是：kubectl taint nodes 節點名 key=value:效果。移除 Taint 是在末尾加上減號。

Pod 要容忍這個 Taint，需要在 spec.tolerations 裡設定對應的 Toleration。key、operator、value、effect 要對應上。

有一個特殊情況：你可以用 operator: "Exists" 來容忍所有有這個 key 的 Taint，不管 value 是什麼。或者完全省略 key 和 value，用 operator: "Exists"，就可以容忍所有 Taint。系統元件（如 kube-proxy）通常是這樣設定的，確保它們可以在任何節點上運行。

注意：Taints 和 Tolerations 只是說哪些節點可以運行哪些 Pod，但不是說一定要去哪個節點。比如你的 Pod 有容忍某個 Taint 的 Toleration，但這個 Pod 也可以去其他沒有 Taint 的節點。如果你想強制 Pod 必須去特定節點，需要配合 Node Affinity 使用。`,
    duration: "10"
  },
  {
    title: "Node Affinity：節點親和性",
    subtitle: "更靈活地控制 Pod 偏好或必須去哪些節點",
    section: "Taints & Tolerations",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">requiredDuringScheduling（硬性要求）</p>
            <pre className="text-xs text-slate-400">
{`spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b
  # 必須去這些可用區
  # 如果沒有，Pod 就 Pending`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">preferredDuringScheduling（軟性偏好）</p>
            <pre className="text-xs text-slate-400">
{`spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: gpu
            operator: Exists
  # 優先去有 GPU 的節點
  # 但如果沒有，也可以去其他節點`}
            </pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">Node Affinity vs nodeSelector</p>
          <p className="text-slate-400 text-sm">nodeSelector 是舊方式，只能精確匹配標籤。Node Affinity 支援 In/NotIn/Exists/DoesNotExist/Gt/Lt 等運算子，更靈活。</p>
        </div>
      </div>
    ),
    notes: `好，接下來講 Node Affinity。Node Affinity 是 nodeSelector 的增強版，提供更靈活的 Pod 調度控制。

nodeSelector 的問題是太死板，只能做精確匹配，比如 zone: us-east-1a，就是必須有這個完全相同的標籤。Node Affinity 支援更複雜的表達式。

Node Affinity 有兩種模式：

第一種是 requiredDuringSchedulingIgnoredDuringExecution，這是硬性要求。名字很長，但記住前面的 "required" 就夠了。這表示 Pod 必須調度到滿足條件的節點上。如果沒有滿足條件的節點，Pod 就會一直 Pending，不會調度到不符合條件的節點。

第二種是 preferredDuringSchedulingIgnoredDuringExecution，這是軟性偏好。名字同樣很長，記住 "preferred" 就好。這表示 K8s 會優先把 Pod 調度到滿足條件的節點，但如果沒有，也可以去其他節點。你可以設定 weight（1-100），多個偏好條件可以設定不同的 weight，weight 越高優先級越高。

名字裡的 "IgnoredDuringExecution" 是什麼意思？就是說，就算 Pod 已經在運行了，如果節點的標籤發生變化，不再滿足 Affinity 條件，Pod 也不會被驅逐。這個設計是為了穩定性。

Node Affinity 支援的運算子有：
In：標籤的值在指定的 values 列表中
NotIn：標籤的值不在指定的 values 列表中
Exists：節點有這個標籤（不管 value 是什麼）
DoesNotExist：節點沒有這個標籤
Gt：標籤的值大於指定的值（用於數字比較）
Lt：標籤的值小於指定的值

這些運算子讓你可以寫出很複雜的調度規則。比如，把 Pod 調度到 zone 是 us-east 或 us-west 的節點，但不去 zone 是 us-north 的節點。

實際使用場景：在雲端環境中，你可能有不同的節點類型，比如標準型（general purpose）、記憶體優化型、GPU 型。你可以給節點打標籤，然後用 Node Affinity 把不同類型的工作負載調度到對應的節點上。

另外，在多可用區（Multi-AZ）部署的時候，Node Affinity 也很常用。比如你要讓資料庫 Pod 只在特定可用區的節點上運行，以滿足數據主權要求。`,
    duration: "8"
  },
  {
    title: "Pod Affinity & Anti-Affinity",
    subtitle: "控制 Pod 相對於其他 Pod 的調度偏好",
    section: "Taints & Tolerations",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">Pod Affinity（親和）</p>
            <p className="text-slate-400 text-sm mb-2">把這個 Pod 調度到和「目標 Pod」同一個位置</p>
            <pre className="text-xs text-slate-400">
{`# 把 cache Pod 調度到
# 和 app Pod 同一個節點上
affinity:
  podAffinity:
    requiredDuringScheduling...:
      - labelSelector:
          matchLabels:
            app: myapp
        topologyKey: kubernetes.io/hostname`}
            </pre>
          </div>
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">Pod Anti-Affinity（反親和）</p>
            <p className="text-slate-400 text-sm mb-2">把這個 Pod 調度到和「目標 Pod」不同的位置</p>
            <pre className="text-xs text-slate-400">
{`# 確保同一個 app 的副本
# 分散到不同節點（高可用）
affinity:
  podAntiAffinity:
    preferredDuringScheduling...:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app: myapp
          topologyKey: kubernetes.io/hostname`}
            </pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">topologyKey 說明</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
            <p>kubernetes.io/hostname → 節點</p>
            <p>topology.kubernetes.io/zone → 可用區</p>
            <p>topology.kubernetes.io/region → 地區</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來講 Pod Affinity 和 Pod Anti-Affinity。這個比 Node Affinity 稍微複雜一點，但概念不難。

Node Affinity 是說「我要去哪種節點」，Pod Affinity 是說「我要和哪些 Pod 在一起」。

Pod Affinity 的用途：把相關的服務部署在同一個節點上，減少網路延遲。比如你有一個 web 應用和對應的快取（Redis/Memcached），如果它們在同一個節點上，網路通訊走的是本機網路，延遲非常低。這就是 Pod Affinity 的典型用途。

Pod Anti-Affinity 的用途：把同一個服務的多個副本分散到不同節點上，提高可用性。比如你的應用有 3 個副本，如果都在同一個節點上，那個節點掛了就全部都掛了。用 Pod Anti-Affinity 可以確保副本分散在不同節點，就算一個節點故障，其他節點的副本還在，服務不中斷。

topologyKey 是一個很關鍵的概念。它定義了「在哪個粒度上」來判斷是否在同一個位置。
kubernetes.io/hostname 是節點粒度，意思是「同一個節點」。
topology.kubernetes.io/zone 是可用區粒度，意思是「同一個可用區」。
topology.kubernetes.io/region 是地區粒度，意思是「同一個地區」。

舉個例子：如果你設定 Pod Anti-Affinity，topologyKey 是 zone，表示同一個 app 的 Pod 要分散在不同的可用區。這樣就算整個可用區故障，服務還能在其他可用區繼續運行。

注意：Pod Affinity 和 Anti-Affinity 的 required 模式要謹慎使用，因為它可能導致 Pod 一直 Pending。比如你要求 Pod 必須和某個特定標籤的 Pod 在同一個節點，但如果那個 Pod 不存在，或者那個節點沒有足夠資源，你的 Pod 就無法調度。

在實際工作中，我建議用 preferred 模式（軟性偏好）而不是 required 模式，這樣調度器有更多彈性，降低 Pod Pending 的風險。

好，Taints & Tolerations、Node Affinity、Pod Affinity 這幾個概念我們都講完了。這些是比較進階的調度策略，大家可以課後多練習。`,
    duration: "12"
  },
  {
    title: "組態管理最佳實踐",
    subtitle: "在生產環境中如何正確使用 ConfigMap 與 Secret",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">✅ ConfigMap 最佳實踐</p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>1. 用 YAML 宣告式管理，放入 git</li>
              <li>2. 使用版本化命名（app-config-v2）</li>
              <li>3. 考慮使用 immutable: true</li>
              <li>4. 不要放敏感資料（用 Secret 代替）</li>
              <li>5. 按功能分開多個 ConfigMap</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">🔐 Secret 安全原則</p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>1. 永遠不要把 Secret 明文提交到 git</li>
              <li>2. 優先使用 Volume 掛載而非環境變數</li>
              <li>3. 開啟 etcd 靜態加密</li>
              <li>4. RBAC 最小權限原則</li>
              <li>5. 定期輪換 Secret（rotation）</li>
              <li>6. 考慮外部 Secret 管理工具</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">📊 資源管理最佳實踐</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
            <p>• 每個 Namespace 都設 ResourceQuota</p>
            <p>• 搭配 LimitRange 設定預設值</p>
            <p>• 所有 Pod 都設定 requests/limits</p>
            <p>• requests 是調度依據，limits 是上限</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們把今天上午學的東西做個總結，並且整理一下最佳實踐。

先講 ConfigMap 的最佳實踐：

第一，用 YAML 宣告式管理，把 ConfigMap 的 YAML 放進 git 做版本控制。這樣每次設定變更都有記錄，可以追蹤、可以 review、可以回滾。

第二，使用版本化命名。把版本號或 commit hash 包含在 ConfigMap 名稱裡，比如 app-config-v2 或 app-config-abc1234。每次要更新設定就建立新版本，不要直接修改現有的 ConfigMap。

第三，考慮使用 immutable: true。設成不可變可以防止意外修改，而且可以提升 K8s 的效能。

第四，不要把敏感資料放在 ConfigMap 裡，應該用 Secret。

第五，按功能分開多個 ConfigMap，不要把所有設定都塞進一個。比如資料庫設定一個、快取設定一個、功能開關一個。這樣更容易管理和重用。

再講 Secret 的安全原則，這個非常重要：

永遠不要把 Secret 明文提交到 git！這是最重要的一條。就算你加了 .gitignore，也要小心有沒有不小心被提交。

優先使用 Volume 掛載而非環境變數。Volume 掛載更安全，不會在進程環境中暴露密碼。

開啟 etcd 靜態加密，讓 Secret 在 etcd 裡是加密儲存的，而不是 base64 明文。

RBAC 最小權限原則：每個服務帳戶只能存取它需要的 Secret。

定期輪換 Secret。就像定期換密碼一樣，定期更換 API 金鑰、資料庫密碼等。大部分外部 Secret 管理工具都有自動輪換的功能。

資源管理：每個 Namespace 都要設 ResourceQuota 和 LimitRange，所有 Pod 都要設 requests 和 limits。requests 影響調度，limits 影響資源使用上限。requests 設太低，Pod 可能被調度到資源不足的節點；limits 設太低，Pod 可能因為超出限制而被 OOM Kill。

調度策略：根據需求選擇合適的調度機制。Taints 和 Tolerations 用於節點隔離，Node Affinity 用於節點偏好，Pod Anti-Affinity 用於高可用分散部署。`,
    duration: "10"
  },
  {
    title: "今日重點回顧",
    subtitle: "ConfigMap、Secret、ResourceQuota、Taints 關鍵概念",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">ConfigMap 重點</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 儲存非機密設定，程式碼設定分離</li>
              <li>• 四種建立方式（字面值/檔案/目錄/YAML）</li>
              <li>• 三種使用方式（envFrom/valueFrom/Volume）</li>
              <li>• 環境變數注入 → 需重啟才生效</li>
              <li>• Volume 掛載 → 約 1-2 分鐘自動更新</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Secret 重點</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• base64 是編碼，不是加密！</li>
              <li>• 三種類型（Opaque/TLS/dockerconfigjson）</li>
              <li>• 優先 Volume 掛載，謹慎使用環境變數</li>
              <li>• 需搭配 etcd 加密 + RBAC 才真的安全</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Resource Quota 重點</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• ResourceQuota：Namespace 總量限制</li>
              <li>• LimitRange：Container 預設值與範圍</li>
              <li>• 設了 Quota → Pod 的 requests/limits 必填</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">調度策略重點</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Taint：節點貼「謝絕訪客」標籤</li>
              <li>• Toleration：Pod 持有「特別通行證」</li>
              <li>• Node Affinity：Pod 偏好的節點類型</li>
              <li>• Pod Anti-Affinity：高可用分散部署</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我再把今天上午最重要的重點幫大家整理一次。

ConfigMap 的核心概念：把設定從程式碼分離出來，實現 12 Factor App 的原則。建立方式有四種，記住 YAML 宣告式是最推薦的。使用方式有三種，記住環境變數注入和 Volume 掛載的差別：環境變數注入需要重啟才生效，Volume 掛載約 1-2 分鐘自動更新（但需要應用程式支援熱重載）。

Secret 的核心概念：base64 不是加密這件事非常重要，大家一定要記住，很多人在這個地方有誤解。Secret 的安全性要靠 etcd 加密、RBAC、外部 Secret 工具共同保護。使用時優先 Volume 掛載而非環境變數。

Resource Quota 和 LimitRange 是配合使用的：ResourceQuota 控制 Namespace 的總量，LimitRange 控制單個 Container 的設定範圍和預設值。

調度策略：Taint/Toleration 是節點隔離機制，Node Affinity 是節點偏好機制，Pod Anti-Affinity 是副本分散的高可用機制。

下午我們會進入資料儲存的主題，講 PersistentVolume、PersistentVolumeClaim、StorageClass 和 StatefulSet。這些是有狀態應用（比如資料庫）在 Kubernetes 中運行的基礎，非常重要。

大家午休 1 個小時，下午 1 點準時繼續。有任何問題現在可以問，或者午休期間傳訊息給我也可以。`,
    duration: "10"
  },
  {
    title: "下午預告：資料儲存",
    subtitle: "PV、PVC、StorageClass、StatefulSet",
    section: "課程總結",
    content: (
      <div className="space-y-6">
        <p className="text-xl text-slate-400 text-center">下午 13:00-17:00 的課程預告</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">📦 儲存抽象層</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Volume（臨時儲存）</li>
              <li>• PersistentVolume（持久儲存）</li>
              <li>• PersistentVolumeClaim（申請儲存）</li>
              <li>• StorageClass（動態 Provisioning）</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">🗄️ 有狀態應用</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• StatefulSet 深入理解</li>
              <li>• MySQL 有狀態部署實作</li>
              <li>• 資料持久化驗證</li>
              <li>• 備份策略（etcd + Velero）</li>
            </ul>
          </div>
        </div>
        <div className="bg-k8s-blue/10 border border-k8s-blue/30 p-4 rounded-lg text-center">
          <p className="text-k8s-blue font-semibold text-lg">午休愉快！13:00 見 🍱</p>
          <p className="text-slate-400 text-sm mt-1">有任何問題可以在休息時間問我</p>
        </div>
      </div>
    ),
    notes: `下午的課程是資料儲存，這是有狀態應用在 Kubernetes 裡運行的基礎。

很多人一開始學 Kubernetes 的時候，會認為 K8s 不適合跑資料庫，因為 K8s 的設計哲學是無狀態（stateless）的。但其實，Kubernetes 有一套完整的持久化儲存機制，可以很好地支援有狀態應用。

下午我們會學 PersistentVolume（PV），這就像停車場的車位，是管理員預先準備好的儲存空間。然後是 PersistentVolumeClaim（PVC），這就像你去停車場租一個車位，你申請了一個符合你需求大小的車位。StorageClass 讓 K8s 可以自動幫你建立車位，不需要管理員手動預備。

最後是 StatefulSet，這是 Kubernetes 用來管理有狀態應用的 workload 資源。和 Deployment 不同，StatefulSet 的每個 Pod 都有穩定的身份和獨立的儲存。

我們還會做一個實作：部署一個 MySQL StatefulSet，驗證資料在 Pod 重啟後還在。

好，午休愉快！下午 1 點準時開始。`,
    duration: "5"
  },
]
