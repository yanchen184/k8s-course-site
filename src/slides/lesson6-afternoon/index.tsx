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
    title: "第六天下午：資料儲存",
    subtitle: "PV、PVC、StorageClass 與 StatefulSet 深入",
    section: "課程開場",
    content: (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-3xl font-bold text-k8s-blue">Day 6 - Afternoon</p>
          <p className="text-xl text-slate-400">13:00 - 17:00</p>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">📦 儲存概念</p>
            <p className="text-slate-400 text-xs mt-1">Volume 抽象層</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">💾 PV & PVC</p>
            <p className="text-slate-400 text-xs mt-1">持久化儲存</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">⚡ StorageClass</p>
            <p className="text-slate-400 text-xs mt-1">動態 Provisioning</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">🗄️ StatefulSet</p>
            <p className="text-slate-400 text-xs mt-1">有狀態應用</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-center">今天下午我們解決「有狀態應用如何在 Kubernetes 中可靠運行」這個核心問題</p>
        </div>
      </div>
    ),
    notes: `下午好！歡迎回來。希望大家午餐都吃得好，休息得不錯。

今天下午我們要講的是 Kubernetes 的資料儲存，這是一個非常重要的主題。很多人在學 K8s 的時候，先學了無狀態應用（stateless），感覺 K8s 很好用。但是當他們想要部署資料庫、需要持久化數據的應用的時候，就卡住了。

今天下午我們就要解決這個問題。我們會從儲存的基本概念講起，然後深入 PersistentVolume（PV）和 PersistentVolumeClaim（PVC），再講 StorageClass 的動態 Provisioning，最後深入 StatefulSet 並實作一個 MySQL 資料庫的部署。

最後還會講備份策略，這在生產環境裡是非常關鍵的，資料備份做好才能睡得著覺。

好，讓我們開始吧！
在開始之前，讓我先問大家一個問題：你們有沒有試過在 Docker 或 Kubernetes 裡面跑 MySQL 或 PostgreSQL，結果重啟之後資料全部不見的慘痛經歷？（停頓等學生回應）

有！很多人都有過這個經歷。這就是為什麼今天下午這個主題這麼重要。我們要徹底解決這個問題。

整個下午大概是 4 小時，我們會有一次 15 分鐘的休息，中間會穿插實作練習。大家要記得跟上，有問題隨時舉手，不要等到課程結束才問。
今天下午的學習節奏會比上午緊湊一些，因為儲存這個主題有很多概念要串聯起來。大家不用擔心一次記不住，我們會透過反覆練習來加深印象。重要的是理解核心概念，細節可以查文件。
在正式開始之前，我也想讓大家了解，今天下午的內容是 Kubernetes 認證考試（CKA/CKAD）的重要考點，特別是 PV、PVC 的操作和 StatefulSet 的配置。學好今天的內容，對認證考試會很有幫助。`,
    duration: "5"
  },
  {
    title: "為什麼儲存在 K8s 中是個挑戰？",
    subtitle: "Pod 的無狀態特性與有狀態應用的矛盾",
    section: "儲存概念",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">⚠️ 問題一</p>
            <p className="text-slate-400 text-sm font-semibold">Pod 重啟資料消失</p>
            <p className="text-slate-400 text-xs mt-1">容器的檔案系統是臨時的，Pod 重啟後所有寫入的資料都不見了</p>
          </div>
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">⚠️ 問題二</p>
            <p className="text-slate-400 text-sm font-semibold">多 Pod 資料共享</p>
            <p className="text-slate-400 text-xs mt-1">多個 Pod 副本如何讀寫同一份資料？各自有獨立的本地儲存空間</p>
          </div>
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">⚠️ 問題三</p>
            <p className="text-slate-400 text-sm font-semibold">節點間資料遷移</p>
            <p className="text-slate-400 text-xs mt-1">Pod 被調度到不同節點時，如何帶走資料？本地磁碟無法跟著移動</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">K8s 的解決方案：儲存抽象層</p>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className="bg-slate-700 px-3 py-2 rounded">Volume</div>
            <p className="text-slate-400">→</p>
            <div className="bg-slate-700 px-3 py-2 rounded">PersistentVolume</div>
            <p className="text-slate-400">→</p>
            <div className="bg-slate-700 px-3 py-2 rounded">StorageClass</div>
          </div>
          <p className="text-slate-400 text-sm text-center mt-2">從簡單到複雜，從手動到自動</p>
        </div>
      </div>
    ),
    notes: `好，讓我們從問題出發。為什麼儲存在 Kubernetes 裡是個挑戰？

第一個問題是 Pod 重啟資料消失。這是 K8s 設計上的特性：容器的檔案系統是臨時的（ephemeral）。這意味著當容器重啟或者 Pod 被重新調度，容器裡寫入的所有資料都會消失。

你可能會問：這不就是說 K8s 沒辦法跑資料庫嗎？對，如果只用容器本身的檔案系統，確實沒辦法。但 K8s 提供了 Volume 機制來解決這個問題。

第二個問題是多 Pod 共享資料。想像你有一個圖片上傳服務，有三個副本在運行。用戶上傳圖片後，圖片儲存在哪裡？如果存在 Pod A 的本地儲存，那 Pod B 和 Pod C 就讀不到。你需要一個共享的儲存空間，讓多個 Pod 都可以讀寫。

這個問題在傳統環境中通常用 NFS 或者 Ceph 這類分散式儲存來解決。在 K8s 裡，你可以透過 PVC 掛載到 NFS 或 Ceph 上，讓多個 Pod 共享。

第三個問題是節點間資料遷移。Kubernetes 的一個核心特性是 Pod 可以在節點間遷移，比如節點維護、節點故障的時候。但是資料通常是存在節點的本地磁碟上，Pod 跑到另一個節點，資料就沒了。

解決方法是用網路儲存：把資料放在獨立的儲存系統上，不管 Pod 在哪個節點，都可以透過網路存取這份資料。

K8s 為了解決這些問題，設計了一套儲存抽象層，從簡單的 Volume，到更完整的 PersistentVolume，再到支援動態建立的 StorageClass。我們今天會一層一層往上學。
讓我補充幾個關鍵觀念。

容器的儲存層（Container Layer）是基於 Copy-on-Write（CoW）的機制。當容器寫入資料的時候，它是寫在一個臨時的「容器層」上，這個層在容器刪除後就消失了。這是容器化技術的設計原則：鏡像（Image）是不可變的，寫入的資料是臨時的。

在傳統的虛擬機（VM）環境裡，這些問題比較容易解決：VM 有自己的磁碟，重啟後資料還在，VM 遷移可以把磁碟一起遷移過去。但 Kubernetes 的設計是把這些問題從個別 Pod 的層次提升到叢集的層次來解決，讓儲存成為獨立管理的資源。

理解這個「儲存是獨立資源」的概念非常重要。在 K8s 的世界裡，儲存（Storage）和計算（Compute，也就是 Pod）是分開的。Pod 可以來去，但儲存可以持久存在。這就是持久化儲存（Persistent Storage）的核心概念。

接下來我們會看到 K8s 是怎麼透過 PersistentVolume（PV）、PersistentVolumeClaim（PVC）、StorageClass 這三個層次的抽象，把儲存問題徹底解決的。每個抽象層都有它的用途和設計理念，我們一個一個來看。
讓我再舉一個更生動的例子來說明節點間資料遷移的問題。

假設你在 K8s 裡跑了一個 Redis 快取，Redis 把資料存在節點的本地磁碟（hostPath Volume）。某天晚上，節點 A 因為硬體故障宕機，K8s 自動把 Redis Pod 調度到節點 B。但是節點 B 沒有那份資料，Redis 從空資料開始運行，所有的快取都失效了。這導致你的應用程式突然要承受大量的資料庫查詢壓力，可能引發連鎖反應。

這就是為什麼「資料和計算要分離」這個原則在 K8s 裡特別重要。用 PV 把資料存在獨立的儲存系統上，不管 Pod 跑在哪個節點，都可以掛載同一份資料。
好，問題已經清楚了，讓我們看看 Kubernetes 是怎麼系統性地解決這三個問題的。接下來幾張投影片會逐一說明。`,
    duration: "10"
  },
  {
    title: "K8s 儲存抽象層概覽",
    subtitle: "Volume、PV、PVC、StorageClass 的角色分工",
    section: "儲存概念",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Volume（臨時/簡單儲存）</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 掛載在 Pod 層級</li>
              <li>• Pod 刪除後通常消失</li>
              <li>• 適用：emptyDir、hostPath、configMap、secret</li>
              <li>• 無法跨節點使用</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">PersistentVolume（叢集層儲存）</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 叢集層級的資源（非 Namespace）</li>
              <li>• 獨立於 Pod 生命週期</li>
              <li>• 管理員預先建立或動態 Provisioning</li>
              <li>• 可以跨節點使用（網路儲存）</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">PersistentVolumeClaim（使用者申請）</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 使用者申請儲存資源的方式</li>
              <li>• 指定大小、存取模式</li>
              <li>• K8s 自動綁定合適的 PV</li>
              <li>• Namespace 層級的資源</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">StorageClass（動態 Provisioning）</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 定義儲存類型（SSD/HDD/NFS）</li>
              <li>• PVC 申請時自動建立 PV</li>
              <li>• 整合雲端儲存（EBS/GCE PD）</li>
              <li>• 降低管理員手動工作</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們先把 K8s 儲存的四個核心概念做個整體介紹，等一下我們再逐一深入。

第一個是 Volume。Volume 是最基本的儲存概念，掛載在 Pod 層級。Volume 的生命週期和 Pod 相同（對於 emptyDir 這類）或者比 Pod 長（對於 PV 背後的儲存）。

emptyDir 是最簡單的 Volume 類型，Pod 啟動時建立一個空目錄，Pod 裡的所有容器都可以讀寫，但 Pod 刪除時這個目錄也消失了。適合用於同一個 Pod 裡容器之間共享資料，比如 sidecar 容器和主容器之間傳遞檔案。

hostPath 是掛載節點的本地路徑，Pod 刪除後資料還在節點上，但 Pod 調度到其他節點就讀不到了。除非是 DaemonSet（保證每個節點都跑），一般不建議用 hostPath。

我們之前學的 ConfigMap 和 Secret 掛載也是 Volume 的一種。

第二個是 PersistentVolume（PV）。PV 是叢集層級的資源，代表一塊實際的儲存空間，可以是 NFS、Ceph、AWS EBS、GCP Persistent Disk 等。PV 的生命週期獨立於 Pod，Pod 刪除後 PV 還存在。管理員預先建立好 PV（靜態 Provisioning），或者讓系統自動建立（動態 Provisioning）。

第三個是 PersistentVolumeClaim（PVC）。PVC 是使用者申請儲存的方式，就像你去銀行開戶，你不需要知道銀行的後台怎麼處理，你只需要說「我要開一個帳戶，存 100 萬進去」。同樣的，PVC 讓你說「我需要 10GB 的 RWX 儲存空間」，K8s 去幫你找一個合適的 PV 來綁定。

第四個是 StorageClass，這是進階功能，讓動態 Provisioning 成為可能。我們後面會詳細講。

這四個概念的關係：StorageClass 定義儲存類型，PVC 申請儲存，K8s 根據 StorageClass 動態建立 PV，然後把 PV 和 PVC 綁定，最後 Pod 透過 PVC 使用儲存空間。
讓我用一個更具體的流程來解釋這四個層次是怎麼協作的。

假設你是一個公司的後端開發工程師，公司用的是 AWS EKS（Elastic Kubernetes Service）。

第一步：公司的 DevOps 工程師（叢集管理員）在 AWS 上建立了一個 StorageClass，叫做 gp3-encrypted，代表「AWS EBS gp3 類型、加密的 SSD 磁碟」。

第二步：你需要部署一個 MySQL 資料庫，你在自己的 Namespace 裡建立一個 PVC，說「我需要 20GB 的 gp3-encrypted 儲存」。

第三步：K8s 看到這個 PVC，根據 gp3-encrypted 這個 StorageClass，自動去 AWS 申請建立一個 20GB 的 EBS Volume，然後建立一個 PV 來代表這個 EBS Volume，再把 PV 和你的 PVC 綁定。

第四步：你的 MySQL Pod 引用這個 PVC，K8s 把 EBS Volume 掛載到 MySQL Pod 所在的節點上，MySQL 就可以把資料存到這個 EBS Volume 裡了。

整個過程你（開發者）不需要知道 EBS 是什麼，不需要知道 Volume ID 是什麼，不需要手動掛載磁碟，K8s 幫你全部搞定了。這就是抽象層的價值。
大家記住這個口訣：「PV 是倉庫，PVC 是租約，StorageClass 是建倉服務，Pod 是使用者。」`,
    duration: "10"
  },
  {
    title: "PersistentVolume 是什麼？",
    subtitle: "叢集層級的持久化儲存資源",
    section: "PersistentVolume",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-xl mb-2">🅿️ PV 就像停車場的車位</p>
          <p className="text-slate-400">停車場管理員（叢集管理員）事先規劃好車位（PV），用戶（Pod）透過租車位申請（PVC）來使用</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">PV 的特性</p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• 叢集層級資源（非 Namespace 隔離）</li>
              <li>• 獨立於 Pod 生命週期存在</li>
              <li>• 代表真實的後端儲存</li>
              <li>• 可以是靜態建立或動態 Provisioning</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">PV 支援的後端儲存</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• <span className="text-green-400">NFS</span> - 網路檔案系統（常用於地端）</li>
              <li>• <span className="text-green-400">AWS EBS</span> - Amazon 彈性區塊儲存</li>
              <li>• <span className="text-green-400">GCE PD</span> - Google 持久化磁碟</li>
              <li>• <span className="text-green-400">Azure Disk</span> - 微軟雲端磁碟</li>
              <li>• <span className="text-green-400">Ceph RBD</span> - 分散式儲存</li>
              <li>• <span className="text-green-400">Local</span> - 節點本地磁碟</li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">💡 PV 是叢集管理員管理的，使用者只需要透過 PVC 申請使用，不需要知道後端是什麼類型的儲存</p>
        </div>
      </div>
    ),
    notes: `好，讓我們深入 PersistentVolume，簡稱 PV。

我最喜歡用停車場來比喻：想像一個大型停車場，停車場管理員（叢集管理員）把停車場規劃好，標出每個車位（PV），每個車位有大小、類型等屬性。用戶（開發者）如果想要停車（使用儲存），就去前台申請（PVC），說「我需要一個可以停 SUV 的車位（10GB 的 RWX 存取）」。前台（K8s）就幫你找一個合適的空車位，讓你去停。

這樣的設計有很大的優點：管理員負責管理底層儲存資源，開發者只需要說「我需要什麼樣的儲存」，不需要知道後面是 NFS 還是 AWS EBS 還是 Ceph，完全抽象。

PV 是叢集層級的資源，這個很重要。PV 不屬於任何 Namespace，它是全叢集共享的資源。這和大部分 K8s 資源不同（大部分都是 Namespace 層級的）。所以當你 kubectl get pv，你不需要指定 -n namespace，它就是全叢集可見的。

PV 支援非常多種後端儲存：在地端環境最常用的是 NFS，幾乎所有 NAS 設備都支援。在雲端環境，AWS 用 EBS，GCP 用 Persistent Disk，Azure 用 Azure Disk。對於需要高效能分散式儲存的場景，Ceph 是很好的選擇。

Local Volume 是用節點本地磁碟的 PV，效能最好，但有一個問題：Pod 必須調度到有這塊磁碟的節點上，限制了調度靈活性。通常只用於對效能要求極高，能接受這個限制的場景，比如分散式資料庫的個別節點。

PV 一旦被 PVC 綁定，在 PVC 釋放之前，其他 PVC 不能使用這個 PV（除非存取模式支援 ReadWriteMany）。這就像停車場的車位一樣，一個車位同一時間只能停一輛車（除非是共乘車位）。
讓我們更深入地了解 PV 的一些技術細節。

PV 有幾個重要的狀態（Phase）：Available（可用，尚未被 PVC 綁定）、Bound（已被某個 PVC 綁定）、Released（PVC 已刪除，但 PV 尚未被清理可再使用）、Failed（自動回收失敗）。在管理 PV 的時候，你需要理解這些狀態，才能知道每個 PV 目前的情況。

另外，PV 有一個 capacity 欄位，但要注意：這個容量只是「聲明」，不是強制限制。K8s 本身不會強制限制 Pod 只能用到這個容量，實際的限制是由底層儲存系統執行的（例如 AWS EBS 就是真的只有你購買的容量大小）。

PV 還有一個重要屬性是 volumeMode，可以是 Filesystem（預設，掛載為目錄）或 Block（掛載為原始塊設備，raw block device）。大部分應用程式用 Filesystem 就好，只有少數需要直接操作塊設備的應用（比如某些資料庫）才需要 Block 模式。

實際上，在雲端環境裡，我們幾乎不會手動建立 PV，而是讓 StorageClass 動態建立。但了解 PV 的結構和屬性，對於理解儲存系統的運作是非常重要的基礎。在地端環境，靜態建立 PV 的情況則更為常見，管理員需要了解如何手動管理這些資源。
還有一個重要的概念是 PV 的 claimRef 欄位。當 PV 被 PVC 綁定後，PV 的 claimRef 欄位會記錄綁定的 PVC 資訊（Namespace 和名稱）。如果你用 Retain 政策，PVC 刪除後 PV 進入 Released 狀態，你需要手動清除 PV 的 claimRef（kubectl patch pv <name> -p '{"spec":{"claimRef":null}}'），PV 才能再次被新的 PVC 綁定。這是靜態 PV 管理中很常見的操作。`,
    duration: "10"
  },
  {
    title: "PV 存取模式",
    subtitle: "ReadWriteOnce、ReadOnlyMany、ReadWriteMany",
    section: "PersistentVolume",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">RWO</p>
            <p className="text-yellow-400 text-sm font-mono mb-2">ReadWriteOnce</p>
            <p className="text-slate-400 text-sm">只能被一個節點以讀寫方式掛載。同一節點的多個 Pod 可以使用。</p>
            <p className="text-green-400 text-xs mt-2">適用：AWS EBS、GCE PD</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">ROX</p>
            <p className="text-yellow-400 text-sm font-mono mb-2">ReadOnlyMany</p>
            <p className="text-slate-400 text-sm">可以被多個節點以唯讀方式掛載。適合共享靜態內容。</p>
            <p className="text-green-400 text-xs mt-2">適用：NFS、Ceph</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">RWX</p>
            <p className="text-yellow-400 text-sm font-mono mb-2">ReadWriteMany</p>
            <p className="text-slate-400 text-sm">可以被多個節點以讀寫方式掛載。多 Pod 共享讀寫。</p>
            <p className="text-green-400 text-xs mt-2">適用：NFS、CephFS、Azure File</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">⚠️ 常見誤解</p>
          <p className="text-slate-400 text-sm">RWO 是「節點」維度，不是「Pod」維度。一個 RWO 的 PV 可以同時被同一節點上的多個 Pod 使用，但不能被不同節點的 Pod 同時使用。</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">存取模式不等於安全控制</p>
          <p className="text-slate-400 text-sm">存取模式是告訴 K8s 如何掛載，不是限制 Pod 的讀寫行為。Pod 掛載後，讀寫權限是由 mountOptions 和 Pod 的 securityContext 控制的。</p>
        </div>
      </div>
    ),
    notes: `好，接下來講 PV 的存取模式，這個是面試很常考的題目，大家要記好。

PV 有三種存取模式：

第一種是 ReadWriteOnce，縮寫 RWO。這表示 PV 可以被一個節點以讀寫方式掛載。注意是「一個節點」，不是「一個 Pod」。同一個節點上的多個 Pod 是可以同時使用這個 PV 的，只要它們在同一個節點上。但是不同節點的 Pod 不能同時以讀寫方式掛載。

AWS EBS 和 GCP Persistent Disk 都只支援 RWO，因為它們本質上是塊設備（block device），只能掛載到一台主機上。

第二種是 ReadOnlyMany，縮寫 ROX。這表示 PV 可以被多個節點以唯讀方式掛載。適合用來分發靜態內容，比如多個 web 伺服器共享同一個靜態資源目錄。

第三種是 ReadWriteMany，縮寫 RWX。這表示 PV 可以被多個節點以讀寫方式掛載。這是最靈活的模式，多個 Pod 無論在哪個節點都可以同時讀寫。NFS、CephFS、Azure File 支援 RWX。

在選擇存取模式的時候，要考慮你的使用場景：
如果是給單個 Pod 的持久化（比如資料庫），RWO 就夠了。
如果多個 Pod 需要共享讀寫同一份資料（比如多個 web server 共享上傳的文件），就需要 RWX。
如果是共享靜態配置或內容，ROX 就可以了。

有一個重要的點要特別強調：存取模式不等於安全控制！存取模式只是告訴 K8s 調度器這個 PV 可以怎麼被掛載，但並不限制 Pod 掛載後的讀寫行為。如果你想讓 Pod 只能讀不能寫，需要在 volumeMounts 裡設定 readOnly: true，或者在 Pod 的 securityContext 裡做設定。

在實際選擇後端儲存的時候，要先確認它支援你需要的存取模式。AWS EBS 只支援 RWO，如果你需要 RWX，就不能用 EBS，要改用 EFS（AWS 的 NFS 服務）或者其他支援 RWX 的儲存。
讓我用實際案例來幫大家加深記憶。

案例一：電商網站的商品圖片。你的電商網站有 10 個 web server Pod，每個 Pod 都需要讀取商品圖片，同時管理員可能會上傳新圖片（寫入）。這個場景需要 RWX，因為多個節點的 Pod 都需要讀寫。後端可以用 NFS 或 AWS EFS。

案例二：MySQL 資料庫主節點。主節點只有一個 Pod，只需要讀寫自己的資料，不需要跟其他節點共享。用 RWO 就夠了，AWS EBS 或 GCP PD 都支援。

案例三：共享的設定檔目錄。所有 Pod 都需要讀取同一份設定，但不需要寫入。用 ROX，可以讓多個節點的 Pod 掛載同一個唯讀的 Volume。

選錯存取模式會有什麼後果？比如你用了 RWO 的 EBS Volume，然後試圖在兩個不同節點的 Pod 上同時掛載，K8s 調度器會阻止這個操作，Pod 會一直卡在 Pending 狀態，錯誤訊息大概是「can only be attached to a single node」。這是一個很常見的問題，大家要特別注意。

另外從 Kubernetes 1.22 版開始，還引入了第四種存取模式 ReadWriteOncePod（RWOP），表示只有一個 Pod 可以以讀寫方式掛載，比 RWO 更嚴格（RWO 允許同一節點上多個 Pod）。這個模式適合需要確保全叢集只有一個寫入者的場景。
關於 RWOP（ReadWriteOncePod）：這是 Kubernetes 1.29 進入穩定版的新存取模式，確保整個叢集只有一個 Pod 可以掛載這個 Volume。如果你的應用需要嚴格的單一寫入者保證，可以考慮用 RWOP。`,
    duration: "10"
  },
  {
    title: "PV 回收政策",
    subtitle: "PVC 刪除後，PV 的資料如何處理？",
    section: "PersistentVolume",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">Retain（保留）</p>
            <p className="text-slate-400 text-sm">PVC 刪除後，PV 和資料都保留，PV 狀態變為 Released，需管理員手動處理後才能重新使用。</p>
            <p className="text-green-400 text-xs mt-2">✅ 生產環境推薦</p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">Delete（刪除）</p>
            <p className="text-slate-400 text-sm">PVC 刪除後，PV 和後端儲存都一起刪除。動態 Provisioning 的預設行為。</p>
            <p className="text-yellow-400 text-xs mt-2">⚠️ 資料永久消失，謹慎使用</p>
          </div>
          <div className="bg-red-400/10 border border-red-400/30 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">Recycle（回收）⚠️</p>
            <p className="text-slate-400 text-sm">PVC 刪除後，PV 的資料被清除（rm -rf），PV 變為可用狀態。已棄用，不建議使用。</p>
            <p className="text-red-400 text-xs mt-2">❌ 已棄用（Deprecated）</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">PV 狀態轉換</p>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded">Available</span>
            <span>→ 綁定 PVC →</span>
            <span className="bg-k8s-blue/20 text-k8s-blue px-2 py-1 rounded">Bound</span>
            <span>→ PVC 刪除 →</span>
            <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">Released</span>
            <span>→ 管理員清理 →</span>
            <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded">Available</span>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來講 PV 的回收政策，這個決定了當 PVC 被刪除後，PV 裡的資料怎麼處理。

這個問題非常重要，因為選錯了可能導致資料永久消失，也可能讓儲存空間被浪費。

第一種是 Retain，保留。PVC 被刪除後，PV 還在，資料也還在。PV 的狀態從 Bound 變成 Released，表示它已經不屬於任何 PVC 了，但是還沒有清空。

Released 的 PV 不能直接被新的 PVC 使用，需要管理員手動介入：確認資料可以清理了，然後清理資料，再把 PV 的 claimRef 清空，讓它變回 Available 狀態，才能被新的 PVC 使用。

這種方式最安全，生產環境強烈建議用 Retain，因為就算開發者不小心刪了 PVC，資料還在，管理員可以救回來。

第二種是 Delete，刪除。PVC 被刪除後，PV 和後端儲存都一起刪掉。在雲端環境用動態 Provisioning 的時候，這是預設的行為，意思是你的 EBS Volume 或 GCE Persistent Disk 也會被一起刪掉。

這種方式很方便，自動清理，但風險很高。如果開發者不小心刪了 PVC，資料就永遠消失了，找不回來。

第三種是 Recycle，回收。這個已經被棄用了，不要在新的系統裡用它。它的行為是清空 PV 裡的資料（等同於 rm -rf），然後讓 PV 變回 Available 狀態可以被重新使用。現在應該用動態 Provisioning 搭配 Delete 政策來代替這個功能。

在實際工作中，我的建議是：
生產環境的重要資料：一定用 Retain，搭配手動管理。
開發測試環境：可以用 Delete，方便自動清理，反正資料不重要。
如果用動態 Provisioning，記得在 StorageClass 裡明確設定 reclaimPolicy，不要用預設值，因為預設可能是 Delete，這在生產環境很危險。

PV 的狀態流轉大家也要記一下：建立後是 Available，被 PVC 綁定後是 Bound，PVC 刪除後（Retain 政策）是 Released，管理員清理後回到 Available。
在實際工作中，如何切換 PV 的回收政策？如果你已經有一個 PV 用的是 Delete 政策，可以用 kubectl patch 命令來修改：

kubectl patch pv <pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'

這個修改是即時生效的，不需要重建 PV。

另外需要注意的是：StorageClass 的 reclaimPolicy 只影響動態建立的 PV。靜態建立的 PV 的回收政策是在 PV YAML 裡的 persistentVolumeReclaimPolicy 欄位直接設定的，和 StorageClass 無關。

最後要強調一點：即使你設定了 Retain 政策，也不代表資料就萬無一失。Retain 只是讓 PV 不被自動刪除，但 PV 背後的存儲（比如 AWS EBS Volume）還是可以被人工在 AWS 控制台裡刪除。所以備份策略還是需要的，不能只靠 Retain 政策。`,
    duration: "9"
  },
  {
    title: "PV YAML 撰寫",
    subtitle: "靜態建立 PersistentVolume",
    section: "PersistentVolume",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">NFS PV 範例</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-pv-01
  labels:
    type: nfs
    env: production
spec:
  capacity:
    storage: 50Gi         # PV 的容量
  accessModes:
    - ReadWriteMany       # 支援多節點讀寫
  persistentVolumeReclaimPolicy: Retain  # 回收政策
  storageClassName: nfs-slow            # StorageClass 名稱
  nfs:
    server: 192.168.1.100   # NFS 伺服器 IP
    path: /data/pv01        # NFS 匯出路徑
    readOnly: false`}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-1">AWS EBS PV 範例</p>
            <pre className="text-xs text-slate-400">
{`spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  awsElasticBlockStore:
    volumeID: vol-0123456789
    fsType: ext4`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-1">Local PV 範例</p>
            <pre className="text-xs text-slate-400">
{`spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteOnce
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:  # 必須指定
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values: [node1]`}
            </pre>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們看看怎麼撰寫 PV 的 YAML。靜態建立 PV 是比較傳統的方式，適合在地端環境或者不用動態 Provisioning 的場景。

我們來看 NFS 的 PV 範例，這是最常見的地端持久化儲存方式。

spec.capacity.storage 是這個 PV 的容量，注意這個容量只是一個標示，K8s 並不會真的去限制你只能用這麼多。實際的容量限制是由底層儲存系統決定的。所以你要確保你設定的容量和 NFS 伺服器上實際可用的空間一致。

accessModes 是存取模式，我們剛才講過的，NFS 支援 ReadWriteMany。

persistentVolumeReclaimPolicy 是回收政策，生產環境用 Retain。

storageClassName 是這個 PV 屬於哪個 StorageClass。等一下 PVC 在申請的時候，可以指定 storageClassName，K8s 只會把 PVC 綁定到相同 StorageClass 的 PV。如果不設定，這個 PV 只能被不指定 StorageClass 的 PVC 綁定。

nfs 部分就是 NFS 的連線資訊，server 是 NFS 伺服器的 IP 或 hostname，path 是 NFS 的匯出路徑。

AWS EBS 的 PV 比 NFS 簡單，主要就是指定 volumeID，這個是你在 AWS 管理控制台裡建立 EBS Volume 後的 ID。注意 EBS 只支援 ReadWriteOnce。

Local PV 比較特別，因為 Local PV 是節點本地磁碟，Pod 必須調度到有這塊磁碟的節點才能使用。所以 Local PV 需要設定 nodeAffinity，明確指定這個 PV 在哪個節點上。

在實際工作中，靜態 PV 的管理工作量比較大：管理員需要手動建立每個 PV，手動管理容量，手動回收釋放的 PV。所以現在大部分場景都會用 StorageClass 配合動態 Provisioning，讓 K8s 自動處理 PV 的建立和刪除。我們後面會講到這個。
建立 PV 之後，用以下命令觀察狀態：

kubectl get pv                        # 查看所有 PV
kubectl describe pv nfs-pv-01        # 查看詳細資訊
kubectl get pv -o yaml               # 查看完整 YAML

常見問題：建立 PV 之後狀態一直是 Available，沒有被綁定。可能原因是沒有匹配的 PVC（大小不夠、存取模式不符、StorageClass 不對），或者 PVC 的 selector 條件不符合這個 PV 的標籤。記得用 kubectl describe pvc 查看事件訊息，會有詳細的綁定失敗原因。`,
    duration: "8"
  },
  {
    title: "PersistentVolumeClaim 是什麼？",
    subtitle: "使用者申請持久化儲存的方式",
    section: "PersistentVolumeClaim",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-xl mb-2">📋 PVC = 儲存的申請書</p>
          <div className="grid grid-cols-3 gap-3 text-sm text-center">
            <div>
              <p className="text-slate-400">開發者建立 PVC</p>
              <p className="text-2xl my-2">📝</p>
              <p className="text-xs text-slate-400">「我要 10GB ReadWriteOnce」</p>
            </div>
            <div>
              <p className="text-slate-400">K8s 自動綁定</p>
              <p className="text-2xl my-2">🔗</p>
              <p className="text-xs text-slate-400">找到合適的 PV</p>
            </div>
            <div>
              <p className="text-slate-400">Pod 使用 PVC</p>
              <p className="text-2xl my-2">🚀</p>
              <p className="text-xs text-slate-400">透過 PVC 名稱引用</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">PVC 的綁定條件</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-400">
            <div>
              <p className="text-yellow-400 font-semibold mb-1">必須符合：</p>
              <ul className="space-y-1">
                <li>• 容量 ≥ PVC 請求的容量</li>
                <li>• 存取模式包含 PVC 需要的模式</li>
                <li>• StorageClass 名稱相同</li>
              </ul>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold mb-1">綁定後：</p>
              <ul className="space-y-1">
                <li>• PV 狀態 Available → Bound</li>
                <li>• PVC 狀態 Pending → Bound</li>
                <li>• 一對一：一個 PV 只能給一個 PVC</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們來講 PersistentVolumeClaim，簡稱 PVC。

PVC 就像是一張申請書。你（開發者）說「我需要一塊持久化儲存空間，大小是 10GB，需要 ReadWriteOnce 的存取模式」。然後 K8s 去幫你找一個符合條件的 PV，把它分配給你。

這個設計的好處是什麼？開發者完全不需要知道後端的儲存是什麼類型，是 NFS 還是 EBS 還是 Ceph，都不需要知道。開發者只需要描述自己的需求，K8s 幫你搞定。

PVC 是 Namespace 層級的資源，這和 PV 不同（PV 是叢集層級的）。這意味著不同的 Namespace 可以有同名的 PVC，它們是相互獨立的。

K8s 在綁定 PV 和 PVC 的時候，會找滿足以下條件的 PV：
第一，PV 的容量大於或等於 PVC 請求的容量。注意這裡是大於或等於，所以你可能申請 10GB，但實際上用到 50GB 的 PV。
第二，PV 的存取模式包含 PVC 需要的模式。
第三，StorageClass 名稱相同。如果 PVC 指定了 storageClassName，K8s 只找同一個 StorageClass 的 PV。

如果有多個滿足條件的 PV，K8s 會選擇最接近 PVC 要求容量的那個，避免浪費。比如你申請 10GB，有 20GB 和 100GB 兩個 PV 都符合，K8s 會選 20GB 的那個。

綁定是一對一的關係，一個 PV 只能被一個 PVC 使用（除非存取模式是 RWX）。一旦 PV 被某個 PVC 綁定，狀態就從 Available 變成 Bound，其他 PVC 就無法使用這個 PV 了。

如果找不到符合條件的 PV，PVC 會一直停在 Pending 狀態，等待有符合條件的 PV 出現（比如管理員建立了新的 PV）。
讓我補充幾個關於 PVC 行為的重要細節。

PVC 的 Pending 狀態需要特別關注。如果 PVC 一直是 Pending，要用 kubectl describe pvc <name> 查看 Events 部分，通常會有像這樣的訊息：
"no persistent volumes available for this claim and no storage class is set"
或
"storageclass.storage.k8s.io "my-storage-class" not found"

這些訊息告訴你 Pending 的原因，根據原因來解決問題：沒有合適的 PV 就建立 PV，StorageClass 不存在就建立 StorageClass，等等。

PVC 的容量和 PV 的容量不一定相同。PVC 申請的是「最小需求量」，K8s 找到的 PV 可能比這個大。比如你申請 10GB，K8s 找到一個 20GB 的 PV，就把這個 20GB 的 PV 給你，kubectl get pvc 顯示的容量會是 20GB（PV 的實際容量），而不是 10GB（你申請的量）。

PVC 的保護機制：當 PVC 正在被 Pod 使用時，即使你執行 kubectl delete pvc，PVC 也不會立刻被刪除，它會進入 Terminating 狀態，等到沒有 Pod 在使用它之後才真正刪除。這是 K8s 的保護機制，防止正在使用中的儲存被誤刪。

從 Kubernetes 1.16 開始支援 PVC 容量擴展：如果你的 StorageClass 設定了 allowVolumeExpansion: true，你可以直接修改 PVC 的 resources.requests.storage 來擴大容量，不需要刪除重建 PVC。K8s 會自動擴大底層的 PV 和儲存。`,
    duration: "11"
  },
  {
    title: "PVC YAML 與綁定",
    subtitle: "如何撰寫 PVC 並觀察綁定結果",
    section: "PersistentVolumeClaim",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">PVC YAML 範例</p>
            <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
  namespace: production
spec:
  storageClassName: nfs-slow   # 對應 PV 的 SC
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi            # 申請 20GB`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">查看 PVC 狀態</p>
            <pre className="text-xs text-slate-400">
{`$ kubectl get pvc -n production
NAME        STATUS   VOLUME      CAPACITY
mysql-pvc   Bound    nfs-pv-01   50Gi

# STATUS: Bound = 成功綁定
# VOLUME: 綁定的 PV 名稱
# CAPACITY: 實際 PV 的容量（可能比申請的大）

$ kubectl describe pvc mysql-pvc
Status: Bound
Volume: nfs-pv-01
Access Modes: RWO
StorageClass: nfs-slow`}
            </pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">選擇器（Selector）精確綁定</p>
          <pre className="text-xs text-slate-400">
{`spec:
  selector:
    matchLabels:
      type: nfs
      env: production
  # 只綁定有這些標籤的 PV
  # 用於精確控制綁定關係`}
          </pre>
        </div>
      </div>
    ),
    notes: `好，來看 PVC 的 YAML 怎麼寫，以及怎麼觀察它的狀態。

PVC 的 YAML 很簡單，只有幾個重要欄位：

storageClassName：這是最重要的，指定要使用哪個 StorageClass。K8s 只會把 PVC 和相同 storageClassName 的 PV 綁定。如果不填，行為取決於叢集的設定，有時候會使用預設的 StorageClass，有時候會找沒有 storageClassName 的 PV。建議明確填寫，避免意外行為。

accessModes：需要的存取模式。這裡填的模式必須是 PV 支援的模式的子集。

resources.requests.storage：申請的儲存空間大小。K8s 會找容量大於或等於這個值的 PV。

建立 PVC 之後，用 kubectl get pvc 查看狀態。狀態有幾種：
Pending：找不到合適的 PV，等待中。
Bound：成功綁定到某個 PV。
Lost：之前綁定的 PV 消失了（比如 PV 被手動刪除）。

注意觀察 CAPACITY 欄位，顯示的是實際綁定的 PV 容量，不一定等於你申請的容量。比如你申請 20GB，但綁定到了 50GB 的 PV，CAPACITY 就顯示 50GB。

有時候你想精確控制 PVC 要綁定哪個 PV，可以用 selector。在 PVC 的 spec 裡加上 selector.matchLabels，只有有這些標籤的 PV 才會被考慮綁定。這樣你可以確保 PVC 一定綁定到你預期的那個 PV，而不是隨機選一個。

這在靜態 Provisioning 的場景很有用，比如你有幾個 PV，分別對應不同的用途，你想確保每個 PVC 綁定到對應的 PV，而不是亂配。

另外一個精確綁定的方式是在 PVC 裡直接指定 volumeName，這樣 K8s 就一定會嘗試綁定那個特定的 PV。
讓我再補充幾個 PVC 管理的實用技巧。

如何確認 PVC 綁定到了正確的 PV？用 kubectl describe pvc <name> 看 Volume 欄位，以及 kubectl describe pv <pv-name> 看 Claim 欄位。兩者應該是互相對應的。

靜態綁定的陷阱：有時候管理員建立了很多 PV，但開發者建立的 PVC 卻綁定到了不預期的 PV（因為 K8s 選擇了大小最接近的那個）。要避免這個問題，可以在 PV 上加標籤，在 PVC 上用 selector 來精確綁定特定的 PV。

PVC 的 volumeName 欄位：如果你想強制綁定到某個特定的 PV，可以在 PVC 的 spec 裡直接設定 volumeName，K8s 就會嘗試把這個 PVC 和指定名稱的 PV 綁定。這在靜態 Provisioning 的環境裡很常用。

PVC 的 dataSource 欄位：從 K8s 1.18 開始，PVC 支援 dataSource，可以從現有的 Volume 快照（VolumeSnapshot）或另一個 PVC 建立新的 PVC。這對於備份還原和複製環境非常有用。比如你可以先建立一個 MySQL PVC 的快照，然後用這個快照建立新的 PVC，新的 PVC 裡已經有了原始 PVC 的所有資料。

如何刪除 PVC？直接 kubectl delete pvc <name>。但要確保沒有 Pod 在使用這個 PVC，否則 PVC 會一直在 Terminating 狀態。如果確認要強制刪除（通常是因為 Pod 已經刪不掉了），可以 kubectl patch pvc <name> -p '{"metadata":{"finalizers":null}}' 來移除 finalizer，讓 PVC 強制刪除。不過這樣做要謹慎，可能導致資源洩漏。`,
    duration: "11"
  },
  {
    title: "Pod 使用 PVC",
    subtitle: "在 Pod 的 volumes 和 volumeMounts 中引用 PVC",
    section: "PersistentVolumeClaim",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">Pod 引用 PVC 的方式</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: v1
kind: Pod
metadata:
  name: mysql
spec:
  volumes:
  - name: mysql-data          # Volume 的名字（在這個 Pod 裡用）
    persistentVolumeClaim:
      claimName: mysql-pvc    # PVC 的名稱
  containers:
  - name: mysql
    image: mysql:8.0
    env:
    - name: MYSQL_ROOT_PASSWORD
      valueFrom:
        secretKeyRef:
          name: mysql-secret
          key: password
    volumeMounts:
    - name: mysql-data        # 對應上面 volume 的名字
      mountPath: /var/lib/mysql  # 容器內的掛載路徑
`}
          </pre>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm font-semibold">重要注意事項</p>
          <ul className="text-slate-400 text-sm space-y-1 mt-1">
            <li>• PVC 必須和 Pod 在同一個 Namespace</li>
            <li>• PVC 必須是 Bound 狀態，Pod 才能啟動</li>
            <li>• mountPath 指定的目錄如果存在，原有內容會被覆蓋</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，接下來看 Pod 怎麼使用 PVC。這個其實和我們之前講的 ConfigMap Volume 掛載很類似，只是類型換成了 persistentVolumeClaim。

Pod 使用 PVC 需要在兩個地方設定：

第一個地方是 spec.volumes，定義這個 Pod 要使用的 Volume。這裡的 name 是你在這個 Pod 裡給 Volume 取的名字，可以自己取，稍後在 volumeMounts 裡引用。persistentVolumeClaim.claimName 就是你要使用的 PVC 名稱。

第二個地方是容器的 volumeMounts，指定把哪個 Volume 掛載到容器的哪個路徑。name 要和上面 volumes 裡定義的名字一樣，mountPath 是容器內的掛載路徑。

在這個 MySQL 的例子裡，我們把 PVC 掛載到 /var/lib/mysql，這是 MySQL 儲存資料的目錄。這樣 MySQL 的資料就寫到了 PVC 背後的 PV 裡，Pod 重啟後資料還在。

同時注意到，MySQL 的密碼是從 Secret 讀取的，這是我們上午學的內容，把 PVC 和 Secret 結合起來，就是一個比較完整的有狀態應用部署方式。

幾個重要的注意事項：

第一，PVC 必須和 Pod 在同一個 Namespace。你不能讓 default Namespace 的 Pod 使用 production Namespace 的 PVC。

第二，PVC 必須是 Bound 狀態，Pod 才能成功啟動。如果 PVC 是 Pending 狀態（找不到合適的 PV），Pod 就會一直卡在 Pending，等到 PVC 綁定成功才能啟動。你可以用 kubectl describe pod 查看 Pod 的事件，會看到 Unable to attach or mount volumes 的錯誤，告訴你是哪個 PVC 還沒綁定。

第三，mountPath 指定的目錄如果原本存在且有內容，掛載後原有內容會被 Volume 的內容覆蓋（Volume 的內容掛上來）。這在大部分情況下是你想要的，但偶爾會有問題，要注意。

好，PVC 的部分我們學完了，現在我們來看看休息一下，然後講 StorageClass。

等等，讓我先確認一下大家都理解了。PV、PVC、Pod 三者的關係：管理員建立 PV → 開發者建立 PVC → K8s 綁定 PV 和 PVC → Pod 引用 PVC 使用儲存。大家清楚嗎？

好，讓我們先休息！
讓我補充幾個 Pod 使用 PVC 的進階設定和常見問題。

subPath 的使用：有時候你不想把整個 Volume 掛載到容器的某個目錄，而只想掛載 Volume 裡的一個子目錄。這時候可以用 subPath：

volumeMounts:
- name: mysql-data
  mountPath: /var/lib/mysql
  subPath: mysql   # 只掛載 Volume 裡的 mysql 子目錄

這樣 /var/lib/mysql 對應的是 PV 的 /mysql 子目錄，而不是根目錄。這在同一個 PV 裡存放多個應用的資料時很有用。

readOnly 掛載：如果你想讓 Pod 以唯讀方式掛載 PVC，在 volumeMounts 裡加上 readOnly: true。這樣容器就沒有辦法修改 PV 裡的資料，適合只需要讀取資料的場景。

PVC 狀態會影響 Pod 調度：如果 Pod 引用的 PVC 還在 Pending 狀態，這個 Pod 也會停在 Pending，K8s 不會強行啟動 Pod。可以用 kubectl describe pod <name> 看 Events 部分，會看到 waiting for a volume to be created 或類似的訊息。`,
    duration: "11"
  },
  {
    title: "休息時間",
    subtitle: "15 分鐘",
    section: "休息",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-6xl">☕</p>
        <p className="text-3xl font-bold text-k8s-blue">休息 15 分鐘</p>
        <p className="text-xl text-slate-400">14:55 - 15:10</p>
        <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
          <p className="text-slate-400">休息回來我們繼續：</p>
          <ul className="text-left mt-2 space-y-1 text-slate-300">
            <li>• StorageClass 動態 Provisioning</li>
            <li>• StatefulSet 深入理解</li>
            <li>• MySQL StatefulSet 實作</li>
            <li>• 備份策略</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，我們先休息 15 分鐘！大家去上廁所、喝個飲料，活動一下。

到目前為止我們學了 PV 和 PVC，這是 K8s 儲存的基礎。休息回來我們會講更進階的 StorageClass，以及最重要的 StatefulSet。

StatefulSet 是有狀態應用（資料庫、訊息佇列等）在 K8s 中運行的核心機制，大家要認真聽。

15:10 準時繼續，大家快去休息一下！
大家趁休息時間可以做幾件事情：

第一，回顧一下今天上午學的 ConfigMap 和 Secret，想想它們和今天下午講的 PV/PVC 有什麼關係。其實 ConfigMap 和 Secret 掛載到 Pod 的方式，也是透過 Volume 機制，只是類型不同（configMap 和 secret 類型的 Volume）。理解了 PV/PVC 之後，你會更清楚地看到 K8s Volume 系統的整體設計。

第二，如果你的筆記型電腦上有 minikube 或 kind，可以趁休息時間試著建立一個簡單的 PVC，觀察一下它的狀態。minikube 預設有一個 standard StorageClass，你可以直接建立 PVC，K8s 會自動動態建立 PV 並綁定。

第三，想一想你現在工作或學習中有沒有需要用到持久化儲存的場景。比如：
- 是否有資料庫需要容器化部署？
- 是否有檔案上傳功能需要持久化存放上傳的檔案？
- 是否有日誌需要持久化保存？
這些場景都是 PV/PVC 的典型應用。

休息回來之後，我們會講 StorageClass（讓 PV 自動建立）和 StatefulSet（有狀態應用的正確部署方式）。這兩個主題是今天下午最重要的實用知識，在面試和實際工作中都非常常考。

如果大家有任何疑問，也可以趁休息時間過來問我。有問題趕快問，不要拖到最後！

另外提醒一下，下午的課程結束後大概 17:00，我們會有 30 分鐘的 Q&A 時間，大家可以問任何 Kubernetes 相關的問題，不限於今天的課程內容。

好，大家快去休息吧，15 分鐘後準時回來！
好，休息時間讓我來分享一個真實的生產事故案例，讓大家體會一下今天學的內容有多重要。

這是我之前服務的一家公司發生的事情。有一個工程師想要清理一個已經棄用的 Namespace，執行了 kubectl delete namespace old-app。這個 Namespace 裡有一個 PVC，用的是 Delete 回收政策的 StorageClass。結果 PVC 被刪除的時候，PV 和背後的 AWS EBS Volume 也一起被刪掉了。

問題是，那個 EBS Volume 裡存著半年的訂單資料，雖然 MySQL 每天有做備份，但最近的備份是昨天午夜的，中間這一天的訂單都沒有了。

最終他們花了將近兩個星期，用各種方法嘗試恢復資料（包括請 AWS 技術支援嘗試找回已刪除的 EBS Volume），最終找回了大部分資料，但還是有大約 3 小時的訂單記錄永久丟失了。

這個事故造成的後果：工程師離職、公司補償了受影響的客戶、重新設計了所有 StorageClass 的回收政策（全部改成 Retain）、建立了嚴格的刪除 Namespace 的審核流程。

教訓：生產環境的 StorageClass 永遠用 Retain！刪除任何含有資料的 Namespace 或 PVC 之前，務必確認備份是否完整且可以成功還原！

這個故事有點沉重，但我分享出來就是希望大家不要犯同樣的錯誤。今天下午學的備份策略，不是理論，是血淚教訓的結晶。
趁這個休息時間，我也想分享一些職涯建議。

在職場上，「會用 Kubernetes」和「懂 Kubernetes 儲存」是兩個完全不同的層次。很多工程師只會部署無狀態的應用，一遇到有狀態應用（資料庫、訊息佇列）就不知道怎麼辦。如果你能夠熟練地在 K8s 上部署和維護有狀態應用，處理 PV/PVC 的問題，設計備份策略，那你的市場競爭力會大大提升。

目前市場上確實有很多公司在尋找懂 K8s 儲存和有狀態應用的工程師，這個技能的供需缺口很大。所以今天下午的內容，不只是考試範圍，更是實際就業市場的需求。

另外，如果大家有興趣考 Kubernetes 認證，今天下午的內容是 CKA（Certified Kubernetes Administrator）考試的核心內容之一。CKA 考試是實際操作題，會要求你建立 PV、PVC、StorageClass、StatefulSet，以及做 etcd 備份。理解概念加上多練習操作，通過考試不難。

好，時間差不多了，大家回來吧！我們繼續講 StorageClass 的動態 Provisioning！
還有一件事情想提醒大家：如果你在練習的時候遇到任何問題，不要默默卡住超過 5 分鐘，趕快問！Kubernetes 有很多細節，有時候卡住是因為一個很小的設定錯誤，旁邊的人一眼就能看出來。不要浪費時間在不必要的除錯上，互相幫助才能學得更快。好，真的快去休息了，15 分鐘後見！
最後補充一點：休息的時候可以看一下今天上午和下午的投影片，把整個 Kubernetes 的知識地圖在腦海中整理一遍。學習不只是吸收新知識，也要時常回顧和整合。學了 PVC 之後，想想它和 ConfigMap Volume、Secret Volume 的相似之處，這樣可以加深理解。`,
    duration: "15"
  },
  {
    title: "StorageClass：動態 Provisioning",
    subtitle: "自動建立 PV，不需要管理員手動操作",
    section: "StorageClass",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">靜態 vs 動態 Provisioning 比較</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-400/10 p-3 rounded">
              <p className="text-red-400 font-semibold mb-1">靜態 Provisioning</p>
              <ol className="text-slate-400 space-y-1 list-decimal list-inside">
                <li>管理員手動建立 PV</li>
                <li>開發者建立 PVC</li>
                <li>K8s 匹配綁定</li>
                <li>Pod 使用 PVC</li>
              </ol>
              <p className="text-red-400 text-xs mt-2">缺點：管理員工作量大</p>
            </div>
            <div className="bg-green-400/10 p-3 rounded">
              <p className="text-green-400 font-semibold mb-1">動態 Provisioning</p>
              <ol className="text-slate-400 space-y-1 list-decimal list-inside">
                <li>管理員設定 StorageClass</li>
                <li>開發者建立 PVC（指定 SC）</li>
                <li>K8s 自動建立 PV</li>
                <li>Pod 使用 PVC</li>
              </ol>
              <p className="text-green-400 text-xs mt-2">優點：全自動，省時省力</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">StorageClass YAML 範例（AWS EBS）</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gp3-encrypted
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: ebs.csi.aws.com    # CSI 驅動
parameters:
  type: gp3                     # EBS 類型
  encrypted: "true"             # 加密
  throughput: "250"             # 吞吐量（MB/s）
reclaimPolicy: Retain           # 回收政策
allowVolumeExpansion: true      # 允許擴容
volumeBindingMode: WaitForFirstConsumer  # 延遲綁定`}
          </pre>
        </div>
      </div>
    ),
    notes: `好，我們繼續！接下來講 StorageClass，這是現代 Kubernetes 環境裡最常用的儲存管理方式。

StorageClass 解決的問題是：靜態 Provisioning 需要管理員手動建立 PV，工作量大，而且不靈活。如果開發者需要 20GB 的儲存，管理員就要手動建立一個 20GB 的 PV，很麻煩。

動態 Provisioning 改變了這個流程：管理員只需要設定好 StorageClass（相當於設定了一個儲存的「模板」），之後開發者建立 PVC 的時候，K8s 會根據 StorageClass 的設定，自動建立一個對應的 PV，然後把 PV 和 PVC 綁定。完全自動化，管理員不需要每次都手動操作。

讓我們看 StorageClass 的 YAML。provisioner 指定了使用哪個 CSI（Container Storage Interface）驅動來建立儲存。AWS EBS 的 CSI 驅動是 ebs.csi.aws.com，GCP 是 pd.csi.storage.gke.io，Azure 是 disk.csi.azure.com。

parameters 是傳給 provisioner 的設定，不同的 provisioner 支援不同的參數。對 AWS EBS 來說，type 是磁碟類型（gp2 是 HDD，gp3 是 SSD），encrypted 是否加密。

reclaimPolicy 是回收政策，和 PV 的一樣。建議生產環境用 Retain。

allowVolumeExpansion 設定 true，讓你可以在不重建 PVC 的情況下擴大儲存空間。這很有用，因為資料庫經常需要增加容量。

volumeBindingMode: WaitForFirstConsumer 是一個很重要的設定。預設情況下，PVC 建立後 PV 立刻就會被建立（Immediate 模式）。但是這樣可能有問題：因為 PV 是全叢集的，而 Pod 是有 Namespace 和調度限制的，如果 PV 建立在可用區 A，但 Pod 因為 Node Affinity 必須在可用區 B，就無法掛載。WaitForFirstConsumer 讓 PV 的建立等到 Pod 被調度了才建立，確保在 Pod 所在的可用區建立儲存。

在雲端環境，強烈建議用 WaitForFirstConsumer，避免跨可用區掛載儲存的問題。
讓我補充幾個 StorageClass 的進階概念。

CSI（Container Storage Interface）是 K8s 定義的標準介面，讓第三方儲存廠商可以開發自己的 CSI 驅動，整合到 K8s 中。你只需要安裝對應的 CSI 驅動，然後建立 StorageClass，就可以使用這個儲存廠商的服務。

CSI 驅動安裝後，你可以用 kubectl get csidriver 查看已安裝的 CSI 驅動。比如在 AWS EKS 叢集裡，通常會看到 ebs.csi.aws.com 和 efs.csi.aws.com 這兩個驅動。

Volume Binding Mode 的選擇：WaitForFirstConsumer 是推薦的設定，特別是在多可用區的雲端環境。Immediate 模式下，PVC 建立後 PV 立刻建立，但此時還不知道 Pod 會被調度到哪個可用區，可能導致 PV 建立在 A 可用區，但 Pod 被調度到 B 可用區，掛載就會失敗。WaitForFirstConsumer 模式等到 Pod 被調度後，才在 Pod 所在的可用區建立 PV，避免跨可用區掛載的問題。

最後提一下 StorageClass 的 parameters 欄位，這個欄位完全由 provisioner 定義，不同的 provisioner 支援不同的 parameters。查閱你使用的 CSI 驅動文件，了解支援哪些 parameters，才能充分利用儲存系統的特性。`,
    duration: "11"
  },
  {
    title: "預設 StorageClass",
    subtitle: "讓 PVC 可以不指定 StorageClass",
    section: "StorageClass",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">設定預設 StorageClass</p>
          <pre className="text-xs text-slate-400">
{`# 方法一：在 StorageClass 上加 annotation
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"

# 方法二：用 kubectl 設定
kubectl patch storageclass standard \\
  -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# 查看 StorageClass
$ kubectl get storageclass
NAME                PROVISIONER             DEFAULT
standard (default)  docker.io/hostpath      Yes
gp3-encrypted       ebs.csi.aws.com`}
          </pre>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">有預設 SC 的 PVC</p>
            <pre className="text-xs text-slate-400">
{`# 不需要指定 storageClassName
# 自動使用預設 StorageClass
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">常見 StorageClass 類型</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• <span className="text-green-400">gp2/gp3</span>：AWS EBS（一般用途）</li>
              <li>• <span className="text-green-400">io1/io2</span>：AWS EBS（高 IOPS）</li>
              <li>• <span className="text-green-400">standard</span>：GCP PD（標準）</li>
              <li>• <span className="text-green-400">premium-rwo</span>：GCP PD（SSD）</li>
              <li>• <span className="text-green-400">managed-csi</span>：Azure Disk</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們講預設 StorageClass。

預設 StorageClass 是一個很方便的機制。當你設定了預設 StorageClass 之後，建立 PVC 的時候如果不指定 storageClassName，K8s 會自動使用預設的 StorageClass 來動態建立 PV。

怎麼設定預設 StorageClass？在 StorageClass 的 metadata.annotations 裡加上 storageclass.kubernetes.io/is-default-class: "true"。也可以用 kubectl patch 命令動態設定，不需要重新建立 StorageClass。

注意：一個叢集裡最好只有一個預設 StorageClass。如果有多個，K8s 的行為是不確定的（不同版本可能不同），可能會報錯。

用 kubectl get storageclass 查看，有 (default) 標記的就是預設的 StorageClass。

在各大雲端平台，安裝好 K8s 之後通常會有預設的 StorageClass：AWS EKS 預設有 gp2 StorageClass，GKE 預設有 standard StorageClass，AKS 預設有 managed-premium StorageClass。

你可以根據需求建立不同類型的 StorageClass，比如一個給一般應用（gp3），一個給需要高 IOPS 的資料庫（io1），讓開發者根據應用的需求選擇合適的 StorageClass。

一個常見的最佳實踐是：給不同的儲存類型取有意義的名字，在名字裡體現出性能特性，比如 fast-ssd、standard-hdd、high-iops，讓開發者一眼就知道要選哪個。

好，StorageClass 講到這裡。接下來我們進入今天下午最重要的主題：StatefulSet！
讓我再補充一些預設 StorageClass 的注意事項和最佳實踐。

Kubernetes 1.26 版之後，支援了多個預設 StorageClass 的機制（之前版本只能有一個），但實際上還是建議只設定一個預設，避免混亂。

如果叢集裡沒有預設 StorageClass，而 PVC 又沒有指定 storageClassName，PVC 就會一直停在 Pending 狀態。這在新環境的設定時很常見，大家要注意。

如何移除預設 StorageClass 的標籤？用 kubectl annotate storageclass <name> storageclass.kubernetes.io/is-default-class- 命令（注意最後的減號，表示移除這個 annotation）。

在生產環境裡，建議建立多個 StorageClass 來滿足不同的需求：
- 一個低成本的 StorageClass（HDD，用於不需要高效能的場景）
- 一個高效能的 StorageClass（SSD，用於資料庫等）
- 一個共享的 StorageClass（NFS/EFS，用於 RWX 需求）

把最常用的 StorageClass 設為預設，其他的讓開發者在 PVC 裡明確指定。這樣既方便又靈活。

好，StorageClass 的部分我們就講到這裡。接下來講今天的重頭戲：StatefulSet！`,
    duration: "9"
  },

  {
    title: "PVC 容量擴展（Volume Expansion）",
    subtitle: "不重建 PVC，線上擴大儲存空間",
    section: "StorageClass",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">為什麼需要 Volume Expansion？</p>
          <p className="text-slate-400 text-sm">資料庫的資料量往往難以精確預估，初始申請 20GB 幾個月後可能就不夠用了。Volume Expansion 讓你在不停機、不重建 PVC 的情況下，直接擴大儲存空間。</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">前提條件</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• StorageClass 設定 <span className="text-yellow-400">allowVolumeExpansion: true</span></li>
              <li>• 底層儲存支援線上擴容（AWS EBS、GCP PD 支援）</li>
              <li>• K8s 版本 ≥ 1.11（GA in 1.24）</li>
              <li>• <span className="text-red-400">注意：只能擴大，不能縮小！</span></li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">擴容步驟</p>
            <pre className="text-xs text-slate-400">
{`# 1. 修改 PVC storage 大小
kubectl patch pvc mysql-pvc \\
  -p '{"spec":{"resources":
  {"requests":{"storage":"50Gi"}}}}'

# 2. 觀察擴容狀態
kubectl get pvc mysql-pvc
# 狀態→ FileSystemResizePending
# Pod 重啟後自動完成 FS resize

# 3. 驗證結果
kubectl exec -it mysql-0 -- \\
  df -h /var/lib/mysql`}
            </pre>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-400/10 border border-green-400/30 p-3 rounded-lg">
            <p className="text-green-400 text-sm font-semibold">✅ 支援 Online Resize 的 CSI</p>
            <p className="text-slate-400 text-xs mt-1">AWS EBS CSI、GCP PD CSI、Azure Disk CSI（新版本不需重啟 Pod）</p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
            <p className="text-yellow-400 text-sm font-semibold">⚠️ 需重啟 Pod 的情況</p>
            <p className="text-slate-400 text-xs mt-1">舊版 CSI 驅動需在 Pod 重啟時觸發 Filesystem resize（ext4/xfs 自動完成）</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來講一個在生產環境非常實用的功能：PVC 容量擴展（Volume Expansion）。

我敢說，每一個在生產環境跑過資料庫的人，都一定遇過「磁碟快滿了怎麼辦」這個問題。傳統的解法很痛苦：先備份資料、停服、換更大的磁碟、恢復資料、重啟服務。整個流程可能需要幾個小時的停機時間。

Kubernetes 搭配支援 Volume Expansion 的 StorageClass，可以讓你在幾乎不停服的情況下完成擴容。

前提條件有三個：第一，StorageClass 必須設定 allowVolumeExpansion: true。如果你的 StorageClass 沒有這個設定，你就沒辦法擴容，必須刪除重建 PVC（這需要停服）。所以我強烈建議在建立 StorageClass 的時候，一定要加上這個設定，哪怕現在不需要，未來也可能需要。

第二，底層儲存系統必須支援線上擴容。AWS EBS 支援，GCP Persistent Disk 支援，Azure Disk 支援。NFS 則不行，因為 NFS 的容量是 NFS 伺服器上目錄的容量，不是獨立分配的，Kubernetes 沒辦法透過 API 去擴展 NFS 伺服器的空間。

第三，K8s 版本要夠新。Volume Expansion 在 1.11 版進入 Beta，在 1.24 版成為正式版（GA）。現代的叢集基本上都支援了，但如果你用的是比較舊的叢集，要確認版本。

擴容的操作非常簡單：用 kubectl patch pvc 把 storage 的大小改成你想要的容量。K8s 會去呼叫 CSI 驅動，CSI 驅動再去擴大底層的儲存（比如把 EBS Volume 從 20GB 擴大到 50GB）。

擴大底層儲存之後，還需要擴大檔案系統（Filesystem）。這個步驟通常在 Pod 重啟時自動完成：K8s 掛載 Volume 的時候，如果偵測到檔案系統比 Volume 小，會自動執行 resize2fs（ext4）或 xfs_growfs（XFS）。

有些先進的 CSI 驅動（比如 AWS EBS CSI Driver 的新版本）支援線上的 Filesystem Resize，不需要重啟 Pod。但這不是所有驅動都支援的，要查閱你用的 CSI 驅動文件確認。

擴容有一個非常重要的限制：只能擴大，不能縮小！這不是 Kubernetes 的限制，而是底層儲存系統（EBS、GCP PD 等）的限制，這些塊存儲設備本身就不支援縮容。如果你的 PVC 太大想縮小，只能手動備份資料、刪除 PVC、建立更小的 PVC、恢復資料。這個流程很麻煩，所以初始容量的估算要合理。

在實際工作中，我建議設定監控警報：當 PV 使用率超過 75% 的時候，發出告警，讓 DevOps 人員有時間在磁碟滿之前擴容。Prometheus + Grafana 可以監控 kubelet_volume_stats_used_bytes 和 kubelet_volume_stats_capacity_bytes 兩個指標，算出使用率。早發現早處理，比等到磁碟滿了服務崩潰再處理好太多了。`,
    duration: "9"
  },
  {
    title: "自訂 StorageClass",
    subtitle: "使用 NFS 建立自訂 StorageClass（地端場景）",
    section: "StorageClass",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">NFS StorageClass（需要 NFS Provisioner）</p>
          <pre className="text-xs text-slate-400">
{`# 先安裝 NFS Subdir External Provisioner
helm repo add nfs-subdir-external-provisioner \\
  https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/
helm install nfs-provisioner \\
  nfs-subdir-external-provisioner/nfs-subdir-external-provisioner \\
  --set nfs.server=192.168.1.100 \\
  --set nfs.path=/data/k8s

---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-client
provisioner: cluster.local/nfs-provisioner
parameters:
  archiveOnDelete: "false"   # 刪除時是否歸檔
reclaimPolicy: Delete
allowVolumeExpansion: true`}
          </pre>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">地端叢集常用的 StorageClass 方案</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-slate-400">
            <p>• NFS Subdir Provisioner</p>
            <p>• Rook-Ceph（分散式）</p>
            <p>• Longhorn（輕量分散式）</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們看看地端環境（不用雲端的情況）怎麼使用 StorageClass。

在地端環境，沒有 AWS EBS 或 GCP PD 可以用，需要自己搭建儲存系統。最常見的三種方案：

第一種是 NFS Subdir External Provisioner。這是最簡單的方案，只需要你有一台 NFS 伺服器（大部分 NAS 設備都有 NFS 功能）。這個 Provisioner 安裝到 K8s 之後，每次有 PVC 建立，它就會在 NFS 上建立一個子目錄作為 PV。非常簡單，適合測試和小型地端部署。

缺點是效能和可靠性取決於 NFS 伺服器，NFS 伺服器是單點，掛了所有 PVC 都掛了。

第二種是 Rook-Ceph。Ceph 是一個成熟的分散式儲存系統，支援 Block、File、Object Storage。Rook 是一個 K8s operator，讓你可以在 K8s 裡部署和管理 Ceph 叢集。這個方案效能好、可靠性高，適合生產環境。

缺點是複雜度高，需要額外的節點給 Ceph 用，資源消耗大。

第三種是 Longhorn。Longhorn 是 Rancher 開源的輕量級分散式儲存，比 Ceph 簡單得多，但功能也沒那麼齊全。支援快照、備份、Volume 擴展等功能，適合中小型的地端叢集。

對於學習和測試，用 NFS Subdir Provisioner 就夠了，設定簡單，幾分鐘就能搞定。對於生產環境，根據規模選 Longhorn 或 Rook-Ceph。

好，我們現在開始講 StatefulSet，這是今天下午最重要的部分！
讓我再補充一下這三種地端儲存方案的選擇建議。

NFS Subdir External Provisioner 適合：規模小、預算有限、已有 NFS 伺服器（例如 Synology NAS 或 QNAP NAS）、對效能和高可靠性要求不高的場景。設定最簡單，15-30 分鐘就能搞定。

Longhorn 適合：中小型叢集、需要高可用性（多副本複製）、想要 Web UI 管理介面、不想處理 Ceph 的複雜度。Longhorn 有漂亮的 Web UI，可以看到每個 Volume 的狀態、備份、快照，管理起來直觀很多。缺點是對節點磁碟的要求較高，需要每個節點都有足夠的空間。

Rook-Ceph 適合：大型叢集、需要極高的效能和可靠性、有專業的 DevOps 團隊負責維護、需要 Block/File/Object 多種儲存類型。Ceph 功能最強大，但複雜度也最高，需要額外的節點（至少 3 個節點做 OSD）和較高的運維成本。

在本次課程的實作練習裡，我們使用的是 minikube 或 kind 的內建 StorageClass，或者 NFS Provisioner，大家可以根據自己的環境選擇。`,
    duration: "8"
  },
  {
    title: "StatefulSet 是什麼？",
    subtitle: "有狀態應用的專屬 Workload 資源",
    section: "StatefulSet 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-xl mb-2">Deployment vs StatefulSet</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 font-semibold mb-2">Deployment（無狀態）</p>
              <ul className="text-slate-400 space-y-1">
                <li>• Pod 名稱隨機：app-abc12</li>
                <li>• Pod 可以互換，沒有身份</li>
                <li>• 可以並行擴縮</li>
                <li>• 適用：web 伺服器、API 服務</li>
              </ul>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-2">StatefulSet（有狀態）</p>
              <ul className="text-slate-400 space-y-1">
                <li>• Pod 名稱有序：db-0、db-1、db-2</li>
                <li>• 每個 Pod 有固定身份</li>
                <li>• 有序部署和刪除</li>
                <li>• 適用：資料庫、訊息佇列</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">🏷️ 穩定身份</p>
            <p className="text-slate-400 text-sm mt-1">固定的 Pod 名稱和 DNS 名稱</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">💾 獨立儲存</p>
            <p className="text-slate-400 text-sm mt-1">每個 Pod 有自己的 PVC</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold">📋 有序操作</p>
            <p className="text-slate-400 text-sm mt-1">啟動和刪除都按順序</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們來講 StatefulSet，這是今天下午最重要的主題。

StatefulSet 是 Kubernetes 用來管理有狀態應用的 Workload 資源，是 Deployment 的兄弟，但設計完全不同。

讓我來解釋為什麼需要 StatefulSet。Deployment 的設計哲學是 Pod 是可以互換的（fungible），就像工廠生產線上的工人，張三走了，李四頂上，沒有區別。這種設計很適合無狀態的 web 應用。

但是資料庫不行。想想 MySQL 主從複製（Master-Slave）：主節點只有一個，從節點有多個。主節點和從節點的角色不能互換，從節點需要知道主節點的地址，主節點也需要知道從節點的情況。如果用 Deployment 管理，每個 Pod 的 IP 都是隨機的、名稱也是隨機的，從節點怎麼知道哪個是主節點？

StatefulSet 解決了這個問題，它提供三個核心特性：

第一，穩定的 Pod 身份。StatefulSet 的 Pod 有固定的名稱：StatefulSet 名稱加上序號，比如 mysql-0、mysql-1、mysql-2。就算 Pod 重啟，名稱還是一樣的。而且每個 Pod 有固定的 DNS 名稱，格式是 pod名稱.service名稱.namespace.svc.cluster.local。

第二，穩定的持久化儲存。每個 Pod 有自己獨立的 PVC，不會和其他 Pod 共享。就算 Pod 重新調度到其他節點，也會重新掛載自己的 PVC，資料還在。

第三，有序部署和刪除。StatefulSet 的 Pod 是一個一個按順序啟動的：先啟動 pod-0，確認它 Ready 之後再啟動 pod-1，確認 Ready 再啟動 pod-2。刪除的時候是反過來，先刪 pod-2，確認刪除後再刪 pod-1。這保證了在任何時刻，都有一個已知的、穩定的主節點在運行。

StatefulSet 適用的場景：資料庫（MySQL、PostgreSQL、MongoDB）、分散式資料庫（Cassandra、ScyllaDB）、訊息佇列（Kafka、RabbitMQ）、分散式鍵值存儲（ZooKeeper、etcd）。
讓我補充 StatefulSet 的一些操作特性，這些在實際使用中非常重要。

StatefulSet 的更新策略（updateStrategy）：StatefulSet 預設的更新策略是 RollingUpdate，但和 Deployment 不同，StatefulSet 的滾動更新是從最高序號的 Pod 開始，倒序更新（先更新 pod-2，再更新 pod-1，最後更新 pod-0）。這保證了主節點（通常是 pod-0）是最後被更新的，在資料庫的場景裡，這很重要。

partition 設定：StatefulSet 的 RollingUpdate 支援 partition 設定，讓你可以做分階段的更新。比如設定 partition: 2，那只有序號大於等於 2 的 Pod 會被更新，pod-0 和 pod-1 保持原版本。這讓你可以先更新部分 Pod 做金絲雀（canary）測試，確認沒問題再更新全部。

StatefulSet 刪除策略：刪除 StatefulSet 有兩種方式：
kubectl delete statefulset mysql         # 刪除 StatefulSet，Pod 也一起刪除
kubectl delete statefulset mysql --cascade=orphan  # 刪除 StatefulSet，但 Pod 繼續存在

注意：不管哪種方式刪除 StatefulSet，volumeClaimTemplates 建立的 PVC 都不會自動刪除，需要手動清理。這是保護資料的機制。

StatefulSet 暫停（pause）：可以設定 spec.replicas: 0 來暫停 StatefulSet，這樣所有 Pod 都會被刪除，但 PVC 保留。需要恢復時，把 replicas 改回原來的數字，Pod 重建後會重新掛載原來的 PVC，資料還在。`,
    duration: "12"
  },
  {
    title: "StatefulSet 的穩定 DNS 名稱",
    subtitle: "Headless Service 與 Pod 的固定網路身份",
    section: "StatefulSet 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">Headless Service（無頭服務）</p>
          <pre className="text-xs text-slate-400">
{`# StatefulSet 必須配合 Headless Service
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None       # 關鍵：ClusterIP 設為 None
  selector:
    app: mysql
  ports:
  - port: 3306`}
          </pre>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">Pod 的 DNS 名稱格式</p>
          <pre className="text-xs text-slate-400">
{`# 格式：pod名稱.headless-service名稱.namespace.svc.cluster.local

mysql-0.mysql-headless.default.svc.cluster.local  → mysql-0 的 IP
mysql-1.mysql-headless.default.svc.cluster.local  → mysql-1 的 IP
mysql-2.mysql-headless.default.svc.cluster.local  → mysql-2 的 IP

# 從節點可以固定連接到主節點 mysql-0
# 就算 Pod 重啟，DNS 名稱不變`}
          </pre>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">💡 Headless Service 不會分配虛擬 IP，DNS 查詢直接返回 Pod 的 IP，讓客戶端可以直接連接到特定的 Pod</p>
        </div>
      </div>
    ),
    notes: `好，讓我們深入 StatefulSet 的 DNS 機制，這個是理解 StatefulSet 的關鍵。

StatefulSet 必須配合一個特殊的 Service，叫做 Headless Service（無頭服務）。什麼是 Headless Service？就是 clusterIP 設為 None 的 Service。

普通的 Service 有一個虛擬 IP（ClusterIP），所有對這個 Service 的請求都會被 kube-proxy 負載均衡分發到後端的 Pod。Headless Service 沒有虛擬 IP，DNS 查詢直接返回後端 Pod 的 IP 列表。

為什麼 StatefulSet 需要 Headless Service？因為 StatefulSet 的每個 Pod 需要有穩定的 DNS 名稱，讓其他服務可以直接連到特定的 Pod。

Pod 的 DNS 名稱格式是：pod名稱.headless-service名稱.namespace.svc.cluster.local。

舉個實際的例子：MySQL 主從複製。主節點 mysql-0，從節點 mysql-1 和 mysql-2。從節點需要連接到主節點同步資料，連接地址是 mysql-0.mysql-headless.default.svc.cluster.local。就算 mysql-0 這個 Pod 重啟了，DNS 名稱還是一樣的，從節點不需要更新連接地址。

如果用 Deployment，每次 Pod 重啟 IP 都可能變，名稱也是隨機的（類似 mysql-deployment-abc12），從節點根本不知道要連到哪裡。這就是為什麼資料庫要用 StatefulSet 而不是 Deployment。

Headless Service 在 StatefulSet 的 YAML 裡用 serviceName 欄位引用：
spec.serviceName: mysql-headless

這樣 K8s 就知道用這個 Service 來建立 Pod 的 DNS 記錄。

另外，Headless Service 不僅用於 StatefulSet，也可以用於需要讓客戶端直接選擇後端 Pod 的場景。比如 Kafka 的生產者需要知道所有 broker 的 IP，可以用 Headless Service 的 DNS 查詢返回所有 broker 的 IP 列表。
讓我再深入一點講 Headless Service 的 DNS 機制。

當你建立了 StatefulSet 和 Headless Service 之後，可以用以下方式在叢集內部測試 DNS 解析：

kubectl run test-dns --image=busybox --rm -it --restart=Never -- nslookup mysql-0.mysql-headless.default.svc.cluster.local

這個命令會啟動一個臨時的 busybox Pod，執行 nslookup 查詢 mysql-0 的 IP，然後自動刪除。你應該會看到返回 mysql-0 Pod 的 IP 地址。

另外，對 Headless Service 本身做 DNS 查詢（不指定 Pod 序號），會返回所有後端 Pod 的 IP 列表：

nslookup mysql-headless.default.svc.cluster.local

返回結果會包含 mysql-0、mysql-1、mysql-2 的 IP 地址。這是 Kafka、ZooKeeper 等分散式系統發現叢集成員的方式。

StatefulSet Pod 的 hostname 也很特別：每個 Pod 的 hostname 就是 Pod 的名稱（mysql-0、mysql-1 等），而不是隨機生成的字串。你可以在 Pod 裡執行 hostname 命令來驗證。

這種穩定的 DNS 和 hostname 機制，讓分散式系統的各個節點之間可以互相通訊，即使 Pod 重啟，通訊地址也不變。這是 StatefulSet 最核心的價值之一。`,
    duration: "12"
  },
  {
    title: "volumeClaimTemplates：每個 Pod 獨立 PVC",
    subtitle: "StatefulSet 如何為每個 Pod 自動建立 PVC",
    section: "StatefulSet 深入",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">StatefulSet YAML（重點部分）</p>
            <pre className="text-xs text-slate-400">
{`spec:
  replicas: 3
  serviceName: "mysql-headless"
  selector:
    matchLabels:
      app: mysql
  template:
    # ... Pod spec ...
    spec:
      containers:
      - name: mysql
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:        # ← 關鍵！
  - metadata:
      name: mysql-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: gp3-encrypted
      resources:
        requests:
          storage: 20Gi`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">自動建立的 PVC</p>
            <pre className="text-xs text-slate-400">
{`# 命名規則：
# PVC模板名-StatefulSet名-序號
mysql-data-mysql-0
mysql-data-mysql-1
mysql-data-mysql-2

$ kubectl get pvc
NAME                 STATUS   VOLUME
mysql-data-mysql-0   Bound    pvc-aaa
mysql-data-mysql-1   Bound    pvc-bbb
mysql-data-mysql-2   Bound    pvc-ccc

# Pod 刪除後 PVC 不會刪除
# 重新建立的 Pod 會掛載同一個 PVC`}
            </pre>
          </div>
        </div>
        <div className="bg-green-400/10 border border-green-400/30 p-3 rounded-lg">
          <p className="text-green-400 text-sm">✅ volumeClaimTemplates 讓每個 Pod 都有自己的 PVC，這樣 mysql-0 和 mysql-1 的資料是完全獨立的，不會互相干擾</p>
        </div>
      </div>
    ),
    notes: `好，接下來講 volumeClaimTemplates，這是 StatefulSet 最強大的特性之一。

在 StatefulSet 的 YAML 裡，有一個欄位叫 volumeClaimTemplates，翻譯成中文就是「PVC 模板」。這個欄位讓 StatefulSet 為每個 Pod 自動建立一個 PVC，不需要你手動建立。

volumeClaimTemplates 的格式和 PVC 的 YAML 很像，裡面定義了 accessModes、storageClassName、resources.requests.storage 等。StatefulSet 在建立每個 Pod 的時候，都會根據這個模板建立一個對應的 PVC。

PVC 的命名規則是：PVC 模板名稱 + "-" + StatefulSet 名稱 + "-" + Pod 序號。比如你的 StatefulSet 叫 mysql，volumeClaimTemplates 的 name 是 mysql-data，那建立的 PVC 就是 mysql-data-mysql-0、mysql-data-mysql-1、mysql-data-mysql-2。

這些 PVC 是永久的，就算 Pod 被刪除，PVC 也不會自動刪除。當 StatefulSet 重新建立 pod-0 的時候，它會找到 mysql-data-mysql-0 這個已有的 PVC，重新掛載。這樣就算 Pod 重啟了，資料還在。

這個行為和 Deployment 完全不同。Deployment 的 Pod 沒有固定身份，就算 Pod 重啟，也不知道要掛載哪個 PVC。

volumeClaimTemplates 還有一個好處：每個 Pod 的資料是完全獨立的。mysql-0 的資料存在 mysql-data-mysql-0 這個 PVC 裡，mysql-1 的資料存在 mysql-data-mysql-1 裡，完全不會互相干擾。在資料庫主從複製的場景裡，主節點和從節點各自有自己的資料目錄，這是正確的行為。

注意：如果你刪除了整個 StatefulSet，PVC 不會自動刪除，你需要手動清理。這是設計上的安全保護，避免不小心刪了 StatefulSet 就把所有資料一起刪掉了。
補充一個重要的注意事項：volumeClaimTemplates 建立的 PVC，在 StatefulSet 縮容（reduce replicas）的時候，對應的 PVC 不會被自動刪除。

比如你把 replicas 從 3 改成 2，pod-2 會被刪除，但 mysql-data-mysql-2 這個 PVC 還是存在。如果之後你又把 replicas 改回 3，pod-2 會重新建立，並重新掛載 mysql-data-mysql-2，之前的資料還在。

如果你確定不需要 pod-2 的資料了，記得手動執行 kubectl delete pvc mysql-data-mysql-2 來清理。不然這個 PVC（和背後的 EBS Volume）會一直存在，持續產生費用（在雲端環境）。

這個行為是 K8s 刻意設計的安全保護：寧可多花一些儲存費用，也要保護資料不被意外刪除。`,
    duration: "9"
  },
  {
    title: "MySQL StatefulSet 完整實作",
    subtitle: "部署一個有持久化儲存的 MySQL",
    section: "StatefulSet 深入",
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1 text-sm">完整的 MySQL StatefulSet</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: "mysql-headless"
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: root-password
        - name: MYSQL_DATABASE
          value: "myapp_db"
        resources:
          requests:
            cpu: 500m
            memory: 1Gi
          limits:
            cpu: "2"
            memory: 4Gi
        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql
        livenessProbe:
          exec:
            command: ["mysqladmin", "ping", "-h", "localhost"]
          initialDelaySeconds: 30
          periodSeconds: 10
  volumeClaimTemplates:
  - metadata:
      name: mysql-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: gp3-encrypted
      resources:
        requests:
          storage: 50Gi`}
          </pre>
        </div>
      </div>
    ),
    notes: `好，讓我們看一個完整的 MySQL StatefulSet 部署範例。這個範例整合了我們今天學到的所有知識：Secret、ResourceQuota、健康檢查、StatefulSet、PVC。

讓我逐段解釋這個 YAML：

spec.serviceName 指定 Headless Service 的名稱，這樣 Pod 才能有穩定的 DNS 名稱。

spec.replicas: 1 表示我們只要一個 MySQL 實例，這是單機部署，適合開發環境。生產環境的 MySQL 主從複製需要更複雜的設定。

containers 裡的 MySQL 容器設定：
image 用的是 mysql:8.0，記得在生產環境用固定的版本，不要用 latest。
MYSQL_ROOT_PASSWORD 從 Secret 讀取，而不是硬編碼。這是我們上午講的最佳實踐。
MYSQL_DATABASE 建立一個預設的資料庫。
resources 設定了 requests 和 limits，確保 MySQL 有足夠的資源，也不會無限佔用資源。

livenessProbe 使用 mysqladmin ping 命令來確認 MySQL 是否正常運行。initialDelaySeconds: 30 是因為 MySQL 啟動比較慢，給它 30 秒的啟動時間，在這段時間內不執行探針。

volumeClaimTemplates 定義了每個 Pod 的 PVC 模板，50GB 的 RWO 儲存。

在實際部署之前，還需要建立以下資源：
一、Headless Service（用於 Pod DNS 解析）
二、普通 Service（用於應用程式連接 MySQL）
三、mysql-secret（存放 root 密碼）
四、確認 StorageClass gp3-encrypted 存在

部署完成後，可以用 kubectl exec -it mysql-0 -- mysql -u root -p 連入 MySQL，建立資料，然後重啟 Pod，確認資料還在。這就是資料持久化驗證。

在生產環境，MySQL 的 StatefulSet 設定還會更複雜，包括 MySQL 設定（my.cnf）用 ConfigMap 管理、備份定期任務、監控探針等。但基本結構就是這樣。
讓我再補充幾個在生產環境部署 MySQL 的重要細節。

readinessProbe 的設定：除了 livenessProbe，MySQL 還需要 readinessProbe 來確認 MySQL 真的可以接受連線了（不只是進程在跑）。livenessProbe 判斷容器是否需要重啟，readinessProbe 判斷 Pod 是否準備好接受流量：

readinessProbe:
  exec:
    command: ["mysqladmin", "ping", "-h", "localhost", "-u", "root", "-pYourPassword"]
  initialDelaySeconds: 10
  periodSeconds: 5
  failureThreshold: 3

MySQL 設定（my.cnf）用 ConfigMap 管理：MySQL 的設定通常需要調整，比如調整 innodb_buffer_pool_size、max_connections 等。建議把 my.cnf 放在 ConfigMap 裡，然後掛載到 /etc/mysql/conf.d/ 目錄：

volumes:
- name: mysql-config
  configMap:
    name: mysql-config

volumeMounts:
- name: mysql-config
  mountPath: /etc/mysql/conf.d

MySQL 的 Service 設定：你需要兩個 Service：一個 Headless Service（用於 StatefulSet 的 DNS）、一個普通 Service（用於應用程式連接 MySQL）。應用程式連接 MySQL 的 Service 不應該使用 Headless Service，而是用一個普通 ClusterIP Service，讓 K8s 負責負載均衡和連線。

Service 的 clusterIP 設定：如果你只有一個 MySQL Pod，普通 Service 指向這個 Pod 就好。如果有主從複製，你應該設定兩個 Service：一個指向主節點（mysql-0）用於寫入，一個指向所有從節點用於讀取，做讀寫分離。

在本機實作時，可以用 kubectl port-forward svc/mysql 3306:3306 把 MySQL 的 3306 端口轉發到本機，然後用 MySQL Workbench 或 DBeaver 連接，方便驗證資料是否正確存入。`,
    duration: "14"
  },
  {
    title: "資料持久化驗證",
    subtitle: "確認 Pod 重啟後資料依然存在",
    section: "StatefulSet 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">驗證步驟</p>
          <pre className="text-xs text-slate-400">
{`# 1. 連入 MySQL，寫入測試資料
kubectl exec -it mysql-0 -- \\
  mysql -u root -pYourPassword -e "
  USE myapp_db;
  CREATE TABLE test (id INT, name VARCHAR(50));
  INSERT INTO test VALUES (1, 'hello kubernetes');
"

# 2. 刪除 Pod（StatefulSet 會自動重建）
kubectl delete pod mysql-0

# 3. 等待 Pod 重建完成
kubectl wait --for=condition=ready pod/mysql-0 --timeout=120s

# 4. 重新連入，確認資料還在
kubectl exec -it mysql-0 -- \\
  mysql -u root -pYourPassword -e "
  SELECT * FROM myapp_db.test;
"`}
          </pre>
        </div>
        <div className="bg-green-400/10 border border-green-400/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold">✅ 預期結果</p>
          <pre className="text-xs text-slate-400 mt-1">
{`+----+------------------+
| id | name             |
+----+------------------+
|  1 | hello kubernetes |
+----+------------------+
# Pod 重啟後，資料依然存在！`}
          </pre>
        </div>
      </div>
    ),
    notes: `好，讓我們動手驗證持久化是否真的有效！這個步驟很重要，因為百聞不如一見，親自驗證過才會有信心。

驗證的步驟很簡單：
第一步，連入 MySQL，建立一個表，插入一筆資料。
第二步，刪除 MySQL 的 Pod。注意，我們是刪除 Pod，而不是刪除 StatefulSet。K8s 會自動重建這個 Pod。
第三步，等待 Pod 重建完成。可以用 kubectl wait 命令等待，或者 kubectl get pods -w 觀察狀態。
第四步，再次連入 MySQL，查詢剛才插入的資料，確認還在。

如果資料還在，恭喜！持久化儲存設定成功。這就是 PersistentVolume 的魔法：資料存在 PVC 後面的 PV 裡，Pod 刪除只是刪掉了容器，而不是 PV 裡的資料。新 Pod 啟動後，重新掛載同一個 PVC，資料還在。

大家試著做一下這個練習，這是今天最重要的動手練習之一。

如果你想更深入驗證，可以在刪除 Pod 之前，用 kubectl get pvc 記下 PVC 的名稱，刪除 Pod 後再用 kubectl get pvc 查看，你會看到 PVC 還在，沒有被刪除。

還有一個進階驗證：在雲端環境，你可以到 AWS 控制台或 GCP 控制台，查看對應的 EBS Volume 或 Persistent Disk，你會看到 Volume 還在，大小和你申請的一樣，狀態是 in-use。這就是 K8s 儲存和雲端儲存的整合。
如果驗證過程中遇到問題，以下是常見的排錯步驟：

首先用 kubectl get pvc 確認 PVC 是 Bound 狀態。如果是 Pending，就去查 StorageClass 設定是否正確。再用 kubectl describe pod mysql-0 查看 Events，確認 Volume 掛載成功。最後確認 MySQL 資料目錄 /var/lib/mysql 的權限設定正確。`,
    duration: "5"
  },
  {
    title: "etcd 備份",
    subtitle: "Kubernetes 叢集的最重要備份：備份 etcd",
    section: "備份策略",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">為什麼 etcd 備份最重要？</p>
          <p className="text-slate-400 text-sm">etcd 存著整個 K8s 叢集的所有狀態：所有 Pod、Service、Deployment、ConfigMap、Secret 等的定義。etcd 掛了 = 叢集完全無法運作。</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">建立 etcd 快照</p>
            <pre className="text-xs text-slate-400">
{`# 在 etcd 節點上執行
ETCDCTL_API=3 etcdctl snapshot save \\
  /backup/etcd-$(date +%Y%m%d-%H%M%S).db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \\
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key

# 驗證快照
ETCDCTL_API=3 etcdctl snapshot status \\
  /backup/etcd-20240101-120000.db`}
            </pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">還原 etcd</p>
            <pre className="text-xs text-slate-400">
{`# 停止 kube-apiserver
systemctl stop kube-apiserver

# 還原快照
ETCDCTL_API=3 etcdctl snapshot restore \\
  /backup/etcd-20240101-120000.db \\
  --data-dir=/var/lib/etcd-restore

# 更新 etcd 設定指向新目錄
# 啟動 etcd 和 kube-apiserver`}
            </pre>
          </div>
        </div>
        <div className="bg-yellow-400/10 border border-yellow-400/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm">⚠️ etcd 備份應該是定期自動化的任務，建議每天至少備份一次，備份檔案存到另一個地方（不要和叢集在同一台主機）</p>
        </div>
      </div>
    ),
    notes: `好，接下來講備份策略。這個在生產環境非常重要，但很多人忽視，直到出事了才後悔。

先講 etcd 備份。etcd 是 Kubernetes 的「大腦」，它存著整個叢集的所有狀態資訊：所有 Pod 的定義、所有 Service、所有 Deployment、所有 ConfigMap、所有 Secret。可以說，etcd 裡的資料就是你的整個叢集。

如果 etcd 資料損毀或遺失，整個叢集就廢了。你的 Pod 可能還在跑（因為它們是在節點上運行的），但 K8s 的控制平面就瞎了，沒辦法管理這些 Pod。

etcd 備份的命令用到 etcdctl 這個工具。重要的是要傳入正確的 TLS 憑證，因為 etcd 是用 TLS 保護的。這些憑證通常在 /etc/kubernetes/pki/etcd/ 目錄裡。

建立快照後，用 etcdctl snapshot status 驗證快照的完整性，確認備份成功。

快照檔案是二進位格式，包含了 etcd 在那個時間點的所有資料。快照大小取決於叢集的規模，一個小型叢集可能幾 MB，大型叢集可能幾百 MB。

etcd 還原的步驟比較複雜：需要先停止 kube-apiserver（不然它還在寫資料到 etcd），然後把快照還原到一個新目錄，再更新 etcd 的設定指向這個新目錄，最後重啟 etcd 和 kube-apiserver。

在實際工作中，我強烈建議把 etcd 備份設定成定期任務，比如每 6 小時一次。備份檔案要傳到叢集以外的地方，比如 S3、GCS、Azure Blob Storage，或者另一台伺服器。如果備份和叢集在同一台主機，主機掛了備份也掛了，就沒意義了。

Kubernetes 的 kubeadm 有一些工具可以幫助管理 etcd，但在實際生產環境，建議用 etcd-operator 或者自己寫一個 CronJob 來自動化備份。
讓我補充一些 etcd 備份的實務細節和常見問題。

etcdctl 的安裝：在做 etcd 備份之前，你需要在 etcd 節點上安裝 etcdctl 工具。在使用 kubeadm 安裝的叢集裡，etcdctl 通常不是預設安裝的，需要自行安裝。版本要和 etcd 版本匹配，用 ETCDCTL_API=3 etcdctl version 確認。

備份的自動化：手動備份不可靠，因為人容易忘記。建議設定一個 CronJob（cron 定時任務）來自動備份。在 K8s 叢集外面，用 systemd timer 或傳統的 crontab 設定：

0 */6 * * * /usr/local/bin/etcd-backup.sh >> /var/log/etcd-backup.log 2>&1

備份腳本 etcd-backup.sh 執行 etcdctl snapshot save，然後把快照上傳到 S3 或其他遠端存儲：

ETCDCTL_API=3 etcdctl snapshot save /tmp/etcd-backup-$(date +%Y%m%d-%H%M%S).db   --endpoints=... --cacert=... --cert=... --key=...
aws s3 cp /tmp/etcd-backup-*.db s3://my-backup-bucket/etcd/
rm /tmp/etcd-backup-*.db  # 清理本地臨時文件

快照的大小監控：定期查看快照大小，如果快照突然變很大，可能是叢集裡有異常大量的物件（比如某個應用在瘋狂建立 ConfigMap 或 Event）。可以用 kubectl get events --all-namespaces | wc -l 查看 Event 數量，Event 過多是 etcd 體積膨脹的常見原因。

etcd 還原後的驗證：還原完成後，要確認叢集狀態是否正常。用 kubectl get nodes 確認所有節點都 Ready，kubectl get pods --all-namespaces 確認所有 Pod 狀態，kubectl get pv 確認 PV 資料還在。如果有任何異常，需要進一步排查。`,
    duration: "12"
  },
  {
    title: "Velero：應用資料備份工具",
    subtitle: "K8s 資源和 PV 資料的完整備份解決方案",
    section: "備份策略",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Velero 的能力</p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• 備份 K8s 資源（Deployment、Service 等）</li>
              <li>• 備份 PV 中的應用資料（資料庫）</li>
              <li>• 跨叢集遷移</li>
              <li>• 定期自動備份</li>
              <li>• 支援 AWS S3、GCS、Azure Blob</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Velero 常用命令</p>
            <pre className="text-xs text-slate-400">
{`# 建立備份
velero backup create my-backup \\
  --include-namespaces production

# 查看備份列表
velero backup get

# 還原備份
velero restore create --from-backup my-backup

# 設定定期備份（每天凌晨 2 點）
velero schedule create daily-backup \\
  --schedule="0 2 * * *" \\
  --include-namespaces production \\
  --ttl 720h`}
            </pre>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">etcd 備份 vs Velero 備份</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
            <p>etcd：叢集狀態，災難恢復</p>
            <p>Velero：應用資料，遷移/回滾</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，接下來講 Velero，這是 Kubernetes 上最流行的應用資料備份工具，由 VMware 開源維護。

Velero 解決的問題和 etcd 備份不同。etcd 備份是備份叢集的狀態（所有 K8s 物件的定義），Velero 是備份應用程式的資料，包括 K8s 資源和 PV 中實際的資料。

打個比喻：etcd 備份就像備份你家的房屋藍圖，告訴你這棟房子有幾個房間、每個房間有什麼；Velero 備份就像把你家裡的所有家具、物品也一起備份，可以完全還原到備份時的狀態。

Velero 的工作原理：Velero 會把你指定的 Namespace 裡的所有 K8s 資源（Deployment、Service、ConfigMap 等）打包成 YAML，存到物件儲存（比如 S3）。對於 PV 的資料，Velero 使用 Restic 或雲端快照（Cloud Snapshots）來備份實際的資料。

Velero 的主要使用場景：

第一，定期備份。設定 schedule，讓 Velero 每天自動備份，並設定保留時間（ttl），過期的備份自動刪除。

第二，災難恢復。生產叢集掛了，可以用 Velero 備份快速在新叢集上還原。

第三，跨叢集遷移。把應用程式從一個叢集遷移到另一個叢集，比如從 AWS 遷移到 GCP，或者從舊叢集遷移到新叢集。

第四，版本控制和回滾。在做重大更新之前，先做一個 Velero 備份。如果新版本有問題，可以快速還原到備份。

Velero 的安裝需要先配置一個物件儲存後端（比如 S3 bucket），然後安裝 Velero 的 CLI 工具和在叢集裡安裝 Velero server。詳細的安裝步驟可以參考 Velero 的官方文件。

注意：Velero 備份 PV 資料的時候，如果用的是雲端快照方式，備份和還原都很快，因為是用雲端儲存的快照功能。如果用 Restic，就需要把實際資料傳輸到 S3，速度取決於資料量，可能比較慢。

在實際工作中，etcd 備份和 Velero 備份應該都要有，兩者互補：etcd 備份用於叢集級別的災難恢復，Velero 用於應用級別的備份和遷移。
讓我補充 Velero 安裝和使用的一些實務細節。

Velero 安裝步驟（以 AWS S3 為例）：

第一步：建立一個 IAM user 或 IAM role，賦予 S3 的讀寫權限。
第二步：建立一個 S3 bucket 用於存放備份。
第三步：安裝 Velero CLI：
brew install velero   # macOS
或從 GitHub Releases 下載二進位文件

第四步：在叢集裡安裝 Velero server：
velero install   --provider aws   --plugins velero/velero-plugin-for-aws:v1.8.0   --bucket my-velero-backup-bucket   --secret-file ./credentials-velero   --backup-location-config region=us-east-1   --snapshot-location-config region=us-east-1

安裝完成後，Velero 的 Deployment 會在 velero namespace 裡運行。

Velero 備份的注意事項：Velero 備份 PV 資料有兩種方式：
一、雲端快照（Cloud Snapshots）：速度快，直接建立 AWS EBS 快照，但不跨雲端平台（AWS EBS 快照不能用於 GCP）。
二、Restic 或 Kopia：把資料傳到物件存儲（S3），速度慢（要傳輸實際資料），但跨平台。

在實際使用中，雲端快照方式更常用，因為速度快、成本低（快照的增量計費）。如果需要跨雲遷移，再考慮用 Restic 方式。

Velero 的備份不包括 K8s 集群的節點配置和 etcd，所以 etcd 備份和 Velero 備份是互補的，不能互相替代。`,
    duration: "12"
  },
  {
    title: "備份計劃建議",
    subtitle: "生產環境的備份策略",
    section: "備份策略",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">3-2-1 備份原則</p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-k8s-blue/10 p-3 rounded-lg">
              <p className="text-k8s-blue text-2xl font-bold">3</p>
              <p className="text-slate-400">份備份資料</p>
            </div>
            <div className="bg-k8s-blue/10 p-3 rounded-lg">
              <p className="text-k8s-blue text-2xl font-bold">2</p>
              <p className="text-slate-400">種不同媒介</p>
            </div>
            <div className="bg-k8s-blue/10 p-3 rounded-lg">
              <p className="text-k8s-blue text-2xl font-bold">1</p>
              <p className="text-slate-400">份異地儲存</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">建議備份頻率</p>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• etcd：每 6 小時，保留 7 天</li>
              <li>• 資料庫：每天全備 + 每小時增量</li>
              <li>• K8s 資源（Velero）：每天，保留 30 天</li>
              <li>• 重大部署前：手動備份一次</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">記得定期測試還原！</p>
            <p className="text-slate-400 text-sm">備份沒有測試就不算備份。每季度至少做一次還原演練，確認備份是有效的，還原流程大家都熟悉。</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們講備份計劃。光是有備份工具還不夠，你需要有一個明確的備份計劃，包括備份頻率、保留時間、存放位置、還原流程。

最重要的原則是 3-2-1 備份原則：

三份備份資料：不要只有一份備份，因為備份本身也可能出問題。保留三份備份，包括當前的、昨天的、上週的。

兩種不同媒介：備份存在兩種不同的儲存媒介上，比如一份在本地磁碟，一份在雲端物件儲存。這樣可以防止單一媒介失效導致備份全部損失。

一份異地儲存：至少有一份備份存在和主要設施不同的地點。如果公司機房失火或停電，異地的備份還在。

實際的備份計劃建議：

etcd 備份：每 6 小時一次，保留最近 7 天的備份。備份存到 S3 或其他物件儲存，以及本地一份。

資料庫備份：每天一次全量備份，每小時一次增量備份（binlog）。這樣最多丟失 1 小時的資料（RPO=1小時）。

Velero 備份：每天一次，保留最近 30 天的備份。在重大部署之前，手動觸發一次備份。

最重要的一點：備份必須定期測試！很多公司都有備份，但從來沒有測試過能不能還原。結果真的出事了，才發現備份是壞的，或者還原流程沒有人會操作。

建議每季度至少做一次完整的還原演練：從備份中還原一個測試環境，驗證資料是否完整，確認還原流程是正確的，並且讓所有相關人員都熟悉這個流程。

另外，備份的監控也很重要。你應該監控備份任務是否成功完成，備份檔案的大小是否正常，並設定告警，一旦備份失敗立刻通知。
最後強調一個心態問題：備份是一種投資，不是浪費資源。在沒有備份的情況下發生資料丟失，業務損失往往遠遠超過備份的成本。建立良好的備份習慣，是一個成熟的工程師和運維團隊必備的能力。從現在開始，把備份納入每個新系統的設計裡，而不是事後再想辦法補救。
記住：沒有測試過的備份不是備份。定期演練還原流程是每個 DevOps 團隊的必要工作。`,
    duration: "5"
  },

  {
    title: "資料庫應用層備份",
    subtitle: "mysqldump 與 Binlog：比 PV 快照更細粒度的保護",
    section: "備份策略",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">兩種備份維度對比</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-400/10 p-3 rounded">
              <p className="text-blue-400 font-semibold mb-1">PV 快照（基礎設施層）</p>
              <ul className="text-slate-400 space-y-1">
                <li>• 備份整個 Volume 的磁碟區塊</li>
                <li>• 速度快，一致性依賴雲端實作</li>
                <li>• 無法還原單一資料表或行</li>
                <li>• 適合：災難恢復、環境複製</li>
              </ul>
            </div>
            <div className="bg-green-400/10 p-3 rounded">
              <p className="text-green-400 font-semibold mb-1">mysqldump（應用層）</p>
              <ul className="text-slate-400 space-y-1">
                <li>• 備份 SQL 邏輯資料（可讀格式）</li>
                <li>• 搭配 Binlog 可還原到任意時間點</li>
                <li>• 可還原單一資料庫或資料表</li>
                <li>• 適合：誤刪資料、精細還原</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">K8s CronJob 自動備份 MySQL</p>
          <pre className="text-xs text-slate-400">
{`apiVersion: batch/v1
kind: CronJob
metadata:
  name: mysql-backup
spec:
  schedule: "0 2 * * *"     # 每天凌晨 2 點
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: mysql:8.0
            env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: root-password
            command:
            - /bin/sh
            - -c
            - |
              DATE=$(date +%Y%m%d-%H%M%S)
              mysqldump -h mysql-headless \\
                -u root -p$MYSQL_ROOT_PASSWORD \\
                --all-databases \\
                --single-transaction \\
                | gzip > /backup/full-$DATE.sql.gz
          volumeMounts:
          - name: backup-storage
            mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: mysql-backup-pvc
          restartPolicy: OnFailure`}
          </pre>
        </div>
      </div>
    ),
    notes: `讓我們講一個非常實用的應用層備份方式：mysqldump 配合 Kubernetes CronJob。

前面我們講了 etcd 備份和 Velero 備份，它們都是基礎設施層的備份。但是對於資料庫，我們還需要應用層的備份，兩者互補，不能互相替代。

為什麼需要應用層備份？讓我舉一個非常常見的真實場景：假設你的 MySQL 裡有一個 orders 資料表，今天下午三點，一個工程師在生產環境執行了一個少了 WHERE 條件的 DELETE 語句，把三個月的訂單資料全部刪掉了。這個錯誤在幾秒鐘內就發生了。

如果你的 PV 快照是每天一次，最多還原到昨天的狀態，今天的所有訂單都沒了。但如果你有 Binlog（MySQL 的交易日誌）配合每日全備，你可以這樣做：先把備份還原到昨天的快照，然後重放今天凌晨到三點那個 DELETE 之前的 Binlog，你就只損失了一個誤刪操作之前幾秒鐘的資料。這就是 Point-in-Time Recovery（PITR），是企業級資料庫的標配。

mysqldump 幾個重要選項說明：

--single-transaction 這個選項非常關鍵！它讓 mysqldump 在一個 InnoDB 交易中讀取資料，備份過程中不鎖表，資料庫仍然可以正常讀寫。如果沒有這個選項，mysqldump 預設會鎖表（LOCK TABLES），備份期間業務就停擺了。絕對要加這個選項。

--all-databases 備份所有資料庫。你也可以用 --databases mydb1 mydb2 指定特定資料庫，或者在特定資料庫後面加上資料表名稱只備份特定表。

在 K8s 裡，我們用 CronJob 來排程自動備份。CronJob 的 schedule 語法和 Linux crontab 完全一樣。上面的例子是每天凌晨 2 點執行一次完整備份，把結果 gzip 壓縮後存到一個 backup PVC 裡。

實際生產環境的備份腳本通常還要做更多：執行完備份之後，把備份檔案上傳到 S3 等物件存儲、清理超過保留期限的舊備份、發送 Slack 或 Email 通知（成功或失敗）、驗證備份檔案的完整性（比如嘗試還原到一個測試資料庫）。

關於 Binlog 備份：要讓 MySQL 開啟 Binlog，需要在 my.cnf 裡設定 log_bin = mysql-bin 和 binlog_format = ROW。Binlog 會持續寫入，通常用 mysqlbinlog 工具定期（比如每小時）把新的 Binlog 備份到 S3。有了全備加 Binlog，你就可以還原到任意一個時間點。

最後提一下 MySQL 8.0 引入的 mysqlpump 和 MySQL Shell 的 dump utilities，支援並行備份，對大型資料庫（幾十 GB 以上）效能比傳統 mysqldump 好很多，是更現代的選擇。如果你的資料庫很大，備份時間很長，可以考慮換這些工具。`,
    duration: "8"
  },
  {
    title: "儲存選擇指南",
    subtitle: "不同場景下應該選擇哪種儲存方案",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">依需求選擇</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-green-400">→</span>
                <div>
                  <p className="text-slate-300 font-semibold">需要高效能 IOPS（資料庫）</p>
                  <p className="text-slate-400">AWS EBS io1/io2、GCP SSD PD</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">→</span>
                <div>
                  <p className="text-slate-300 font-semibold">需要多 Pod 共享讀寫</p>
                  <p className="text-slate-400">NFS、CephFS、AWS EFS</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">→</span>
                <div>
                  <p className="text-slate-300 font-semibold">地端叢集通用儲存</p>
                  <p className="text-slate-400">NFS + NFS Provisioner、Longhorn</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-400">→</span>
                <div>
                  <p className="text-slate-300 font-semibold">臨時快取（Pod 生命週期）</p>
                  <p className="text-slate-400">emptyDir</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Deployment vs StatefulSet</p>
            <div className="space-y-2 text-sm">
              <div className="bg-green-400/10 p-2 rounded">
                <p className="text-green-400 font-semibold">用 Deployment：</p>
                <p className="text-slate-400">無狀態服務，Pod 可以互換，資料不需要持久化</p>
              </div>
              <div className="bg-yellow-400/10 p-2 rounded">
                <p className="text-yellow-400 font-semibold">用 StatefulSet：</p>
                <p className="text-slate-400">有狀態應用，需要穩定 DNS 名稱，每個 Pod 需要獨立儲存</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">最佳實踐總結</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
            <p>• 雲端環境：用 StorageClass 動態 Provisioning</p>
            <p>• 生產環境：reclaimPolicy 設 Retain</p>
            <p>• 使用 allowVolumeExpansion: true</p>
            <p>• etcd + Velero 雙重備份策略</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們做個儲存方案的選擇指南總結。

在實際工作中，面對不同的需求，應該選擇不同的儲存方案：

高效能 IOPS 需求（資料庫）：資料庫對磁碟 IOPS 非常敏感，需要用 SSD 類型的儲存。在 AWS 選 EBS io1/io2，在 GCP 選 SSD Persistent Disk，在地端選配有 NVMe SSD 的 Longhorn 或 Local PV。

多 Pod 共享讀寫（NAS 類需求）：如果你有多個 Pod 需要同時讀寫同一份資料，比如多個 web 伺服器共享上傳的文件，就需要 RWX 的儲存。NFS、CephFS 是常見選擇，在 AWS 可以用 EFS。

地端叢集通用儲存：如果是地端叢集，最簡單的選擇是 NFS + NFS Subdir Provisioner。如果需要更高可靠性，用 Longhorn 或 Rook-Ceph。

臨時快取：如果只是需要同一個 Pod 裡的容器之間共享臨時資料，用 emptyDir 就夠了，簡單且效能好（可以設定在記憶體裡）。

Deployment vs StatefulSet 的選擇標準：如果你的應用是無狀態的（任何 Pod 都可以處理任何請求），用 Deployment。如果你的應用需要穩定的身份（DNS 名稱、序號）或者每個實例需要獨立的持久化儲存，用 StatefulSet。

最佳實踐再強調幾點：
在雲端環境，幾乎一定要用 StorageClass 動態 Provisioning，這樣最省力。
生產環境的 StorageClass 的 reclaimPolicy 要設成 Retain，防止誤刪資料。
allowVolumeExpansion: true 讓你可以在不重建 PVC 的情況下擴容，生產環境一定要開。
備份策略：etcd 備份保護叢集狀態，Velero 備份保護應用資料，兩個都要有。
讓我補充一些決策時的額外考量。

成本考量：在雲端環境，不同的儲存類型成本差異很大。AWS EBS gp3 是最常用的通用 SSD，成本適中；io2 是高效能 SSD，成本高出許多；EFS（共享 NFS）的成本是按使用量計費，如果資料量大、訪問頻繁，成本可能比 EBS 高。在設計儲存方案時，要考慮預算和效能的平衡。

資料一致性考量：RWX 的共享儲存（NFS、EFS）在多個 Pod 同時寫入的時候，需要注意資料一致性問題。NFS 的文件鎖（file locking）是 advisory 的，不是所有應用都正確處理了文件鎖。資料庫（MySQL、PostgreSQL）不應該用 NFS，因為 NFS 的延遲和鎖機制對資料庫效能影響很大，有可能造成資料損毀。

Local Volume 的使用場景：雖然之前說 Local Volume 有調度限制，但對於某些對延遲極度敏感的應用（比如 etcd 本身、某些時序資料庫），Local NVMe SSD 提供的延遲比任何網路儲存都低得多。K8s 允許你透過 nodeSelector 或 pod affinity 把 Pod 固定到有 Local Volume 的節點，這樣就可以享受最低延遲的同時，保持在 K8s 的管理框架內。

實作建議：在這次課程的練習中，大家可以先用 minikube 或 kind 的預設 StorageClass 來實作，等熟悉了基本流程之後，再在實際環境中換成對應的後端儲存（AWS EBS、GCP PD 等）。基本的流程是一樣的，只有 StorageClass 的 provisioner 和 parameters 不同。
儲存方案的選擇沒有絕對的對錯，要根據業務需求、預算、團隊技術能力來綜合評估。最重要的是把選擇的理由記錄下來，讓團隊的每個人都理解為什麼做這個決策。`,
    duration: "10"
  },
  {
    title: "今日下午重點回顧",
    subtitle: "儲存概念整理",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">PV / PVC 核心概念</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• PV：叢集層級儲存資源（管理員建立）</li>
              <li>• PVC：Namespace 層級申請（開發者建立）</li>
              <li>• 三種存取模式：RWO / ROX / RWX</li>
              <li>• 三種回收政策：Retain（推薦）/ Delete / Recycle</li>
              <li>• StorageClass：動態 Provisioning 模板</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">StatefulSet 核心特性</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 固定 Pod 名稱：app-0、app-1、app-2</li>
              <li>• Headless Service 提供穩定 DNS</li>
              <li>• volumeClaimTemplates 每 Pod 獨立 PVC</li>
              <li>• 有序部署（0→1→2）和刪除（2→1→0）</li>
              <li>• 適用：資料庫、訊息佇列</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">備份策略</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• etcd 備份：保護叢集狀態</li>
              <li>• Velero：保護應用資料</li>
              <li>• 3-2-1 原則：3 份、2 媒介、1 異地</li>
              <li>• 定期測試還原！</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">明天預告</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Day 7：安全性與進階主題</li>
              <li>• RBAC 深入</li>
              <li>• NetworkPolicy</li>
              <li>• Helm 套件管理</li>
              <li>• CI/CD 整合</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們把今天下午學的東西做個完整的回顧。

今天下午我們從儲存概念開始，理解了為什麼在 K8s 裡儲存是個挑戰，以及 K8s 是怎麼解決這些挑戰的。

PV 和 PVC 的核心概念：PV 是管理員準備的儲存資源（像停車場的車位），PVC 是開發者申請儲存的方式（租車位的申請書），K8s 自動配對（前台幫你找合適的車位）。

三種存取模式：RWO 最常見，適合單個 Pod 的資料庫；RWX 適合多 Pod 共享；ROX 適合只讀共享。

三種回收政策：生產環境一定用 Retain，開發環境可以用 Delete 方便自動清理，Recycle 已棄用不要用。

StorageClass 讓動態 Provisioning 成為可能，不需要管理員手動建立每個 PV，配合 WaitForFirstConsumer 可以避免跨可用區的問題。

StatefulSet 是有狀態應用的救星：固定的 Pod 名稱、Headless Service 提供穩定 DNS、volumeClaimTemplates 為每個 Pod 建立獨立 PVC、有序的部署和刪除操作。

備份策略兩個工具：etcd 備份保護叢集的控制平面狀態，Velero 備份保護應用資料，兩個都需要。記得定期測試還原！

明天我們會講 Kubernetes 的安全性，包括 RBAC 深入、NetworkPolicy、以及 Helm 套件管理，最後會講 CI/CD 整合，把整個課程串起來。大家期待一下！

今天學了很多東西，謝謝大家的認真聽講！有問題的話，現在可以問，或者等等 Q&A 時間再問。
今天學了很多，大家辛苦了！記得把今天的內容整理成自己的筆記，動手實作一遍，才能真正掌握這些知識。有問題歡迎在課程群組裡提問，我會盡快回覆。`,
    duration: "5"
  },
  {
    title: "Q & A",
    subtitle: "問題與解答時間",
    section: "Q&A",
    content: (
      <div className="space-y-6 text-center">
        <p className="text-6xl">🙋</p>
        <p className="text-3xl font-bold text-k8s-blue">問題與解答</p>
        <p className="text-xl text-slate-400">有什麼問題都可以問！</p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-left">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">常見問題方向</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• PV 和 PVC 的綁定規則？</li>
              <li>• StatefulSet 什麼時候該用？</li>
              <li>• 生產環境備份策略如何設計？</li>
              <li>• StorageClass 如何選擇？</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">明天課程預告</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Day 7：安全性與生產化</li>
              <li>• RBAC 深入</li>
              <li>• NetworkPolicy</li>
              <li>• Helm 套件管理</li>
              <li>• CI/CD 整合實作</li>
            </ul>
          </div>
        </div>
        <div className="bg-k8s-blue/10 border border-k8s-blue/30 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">感謝大家今天的參與！明天見 👋</p>
        </div>
      </div>
    ),
    notes: `好，現在是 Q&A 時間。大家今天學了非常多的東西，從儲存概念、PV、PVC、StorageClass，到 StatefulSet 深入和備份策略，這些都是 Kubernetes 在生產環境中非常實際的應用。

有任何問題都可以提出來，不要客氣。有時候你覺得是「笨問題」的問題，其實其他人也想問，只是沒開口。所以大膽問！

讓我先問大家幾個問題，看看今天的吸收狀況：

第一個問題：PV 和 PVC 的差別是什麼？（等待學生回答）

很好，PV 是叢集層級的儲存資源，由管理員建立。PVC 是 Namespace 層級的儲存申請，由開發者建立。K8s 負責把 PVC 和合適的 PV 匹配綁定。

第二個問題：什麼情況下要用 StatefulSet 而不是 Deployment？（等待學生回答）

很好。當你的應用程式需要穩定的 Pod 身份（固定的 DNS 名稱）或者每個 Pod 實例需要獨立的持久化儲存時，就要用 StatefulSet。典型的例子是資料庫（MySQL、PostgreSQL）、訊息佇列（Kafka、RabbitMQ）、分散式協調服務（ZooKeeper）。

第三個問題：如果你的生產環境的 PVC 想要刪除後資料還在，回收政策應該設什麼？（等待學生回答）

Retain！生產環境一定要用 Retain，防止誤刪 PVC 導致資料永久消失。

好，還有什麼其他問題嗎？

（等待學生提問，認真回答每個問題）

好，如果沒有其他問題，今天的課程就到這裡。

來做個今天的總結：今天上午我們學了 ConfigMap 和 Secret 的組態管理，以及 Resource Quota、Taints 和 Tolerations 的資源管理和調度策略。今天下午我們學了 Kubernetes 的持久化儲存完整流程：PV → PVC → StorageClass 動態 Provisioning → StatefulSet 的有狀態應用部署，以及備份策略。

明天是最後一天的課程，我們會講 Kubernetes 的安全性（RBAC、NetworkPolicy）、Helm 套件管理，以及 CI/CD 整合。學完之後大家就有了完整的 Kubernetes 知識體系，可以在公司的生產環境中應用了。

今天辛苦了，大家明天見！如果有任何問題，可以在課程群組裡問，我會盡快回覆。
讓我來統整今天最常被問到的幾個問題，提供給大家參考：

問題一：StatefulSet 和 Deployment 可以共用同一個 PVC 嗎？
答：可以，但不建議。共用同一個 PVC 的話，多個 Pod 同時讀寫可能有資料一致性問題，除非應用程式本身設計了支援並發讀寫的機制（比如 MySQL 本身就處理了這個問題，但掛載層面還是要注意存取模式是否支援 RWX）。

問題二：可以在不停服的情況下擴大 PVC 的容量嗎？
答：可以，但需要 StorageClass 設定了 allowVolumeExpansion: true，而且底層儲存系統支援線上擴容（AWS EBS、GCP PD 都支援）。直接修改 PVC 的 resources.requests.storage 到更大的值，K8s 會自動擴容。但注意，縮小容量是不支援的。

問題三：PV 能不能在不同叢集之間共享？
答：取決於後端儲存類型。NFS 可以，因為 NFS 是網路協議，不同叢集的 Pod 都可以掛載同一個 NFS 路徑。AWS EBS 不行，因為 EBS Volume 只能在同一個 AWS Region 和 Availability Zone 內使用，而且同一時間只能掛載到一個 EC2 實例（對應一個 K8s 節點）。

大家今天學的這些知識，在實際工作中都非常實用。加油！`,
    duration: "10"
  },
]
