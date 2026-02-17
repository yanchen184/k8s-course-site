import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  // ========== 開場 ==========
  {
    title: '資料儲存',
    subtitle: 'PersistentVolume、PVC 與 StorageClass',
    section: '第六堂下午',
    duration: '3',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            💾
          </div>
          <div>
            <p className="text-2xl font-semibold">下午場：13:00 – 17:00</p>
            <p className="text-slate-400">讓 Pod 資料真正「活下來」</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 text-base">
          {[
            { label: '儲存概念', desc: 'PV / PVC / StorageClass' },
            { label: 'StatefulSet', desc: '有狀態服務深入' },
            { label: '動態供應', desc: '雲端儲存整合' },
            { label: '備份策略', desc: 'etcd 快照 & Velero' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-k8s-blue font-semibold">{item.label}</p>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `歡迎回來！吃飽喝足了嗎？下午的課程進入一個很關鍵的主題——資料儲存。

如果說上午學的 Deployment 和 Service 讓你的應用跑起來，那下午要解決的就是「跑起來之後，資料去哪裡」這個問題。

很多人在學 K8s 的時候會忽略儲存，結果踩到一個很慘的坑：辛辛苦苦部署了一個資料庫，結果 Pod 一重啟，所有資料都消失了。這不是 Bug，而是 Kubernetes 的預設行為。今天我們就要把這個洞補起來。

下午四個小時我們會涵蓋：PV、PVC、StorageClass 這套儲存抽象層；StatefulSet 這個專為有狀態應用設計的控制器；動態供應和雲端儲存的整合方式；最後是備份和還原策略。

內容紮實，但都非常實用。之後大家不管是在公司部署資料庫、還是在面試被問到儲存架構，這些知識都會直接用上。準備好了嗎？我們開始！`,
  },

  // ========== 課程大綱 ==========
  {
    title: '下午課程大綱',
    section: '課程總覽',
    duration: '2',
    content: (
      <div className="grid gap-3">
        {[
          { time: '13:00–13:05', topic: '開場', icon: '👋' },
          { time: '13:05–13:25', topic: '儲存概念：為什麼資料會消失？', icon: '🤔' },
          { time: '13:25–14:00', topic: 'PersistentVolume（PV）', icon: '🗄️' },
          { time: '14:00–14:30', topic: 'PersistentVolumeClaim（PVC）', icon: '📋' },
          { time: '14:30–14:45', topic: '休息', icon: '☕' },
          { time: '14:45–15:10', topic: 'StorageClass 動態供應', icon: '⚡' },
          { time: '15:10–15:45', topic: 'StatefulSet 深入', icon: '🐬' },
          { time: '15:45–16:05', topic: '備份策略', icon: '🔒' },
          { time: '16:05–16:20', topic: '課程總結', icon: '📝' },
          { time: '16:20–16:30', topic: 'Q&A', icon: '❓' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-xs">{item.time}</p>
              <p className="text-base">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我們先看一下下午的時間安排，心裡有個底。

整個下午是一個完整的儲存知識體系，從最基礎的「Pod 資料為什麼會消失」開始，一路往上堆疊到 PV、PVC、StorageClass，再到 StatefulSet 這個有狀態服務的核心控制器，最後以備份策略收尾。

今天的知識點比較多，但每個概念之間都有清楚的脈絡關係，只要跟上節奏，學起來不會覺得零散。遇到聽不懂的地方，當場舉手，不要等，因為後面的內容都是建立在前面的基礎上的。好，我們從最根本的問題開始。`,
  },

  // ========== 儲存概念：Pod 資料消失問題 ==========
  {
    title: '為什麼 Pod 的資料會消失？',
    section: '儲存概念',
    duration: '10',
    content: (
      <div className="space-y-6">
        <div className="bg-red-900/30 border border-red-600 p-5 rounded-lg">
          <p className="text-red-400 font-bold text-xl mb-3">⚠️ 問題場景</p>
          <p className="text-slate-200 text-base leading-relaxed">
            MySQL Pod 寫入 10 萬筆資料 → Pod 崩潰重啟 → 資料全部消失 💀
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-lg font-semibold text-k8s-blue">根本原因</p>
          {[
            { icon: '📦', title: 'Container 是臨時的', desc: '容器的可寫層（writable layer）隨容器生命週期存在，重啟即清除' },
            { icon: '🔄', title: 'Pod 重建不是重啟', desc: '當 Pod 被 Kubernetes 重建時，是全新的 Pod，舊的 Container 資料已消失' },
            { icon: '🚚', title: '排程到不同節點', desc: 'Pod 可能被排到另一台 Node，本地磁碟上的資料當然不在了' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-slate-100">{item.title}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `好，我們從一個真實的災難場景說起。

假設你部署了一個 MySQL Pod，跑得很好，使用者在上面寫了十萬筆訂單資料。某天凌晨，MySQL 因為記憶體不足崩潰了，Kubernetes 自動幫你重啟了這個 Pod。重啟完，你打開資料庫一看：空空如也。十萬筆訂單資料，全部消失。

這不是 Kubernetes 的 Bug，這是設計使然。理解為什麼，是理解儲存架構的第一步。

第一個原因：Container 本身就是臨時的。Docker 容器有一個「可寫層」，你在容器裡寫入的任何東西，都存在這個可寫層裡。容器停止或刪除，可寫層也跟著消失。這個設計讓容器保持了「不可變」（immutable）的特性，方便版本管理和快速部署，但代價是資料不持久。

第二個原因：Pod 重建不等於容器重啟。當 Kubernetes 判斷 Pod 需要重建時，是建立一個全新的 Pod 物件，跑全新的容器，舊的容器和它的可寫層早就不存在了。就算 Pod 名稱一樣，底層已是不同的容器。

第三個原因：Pod 不和 Node 綁定。今天你的 Pod 跑在 Node A，但如果 Node A 掛了，Kubernetes 會把 Pod 排到 Node B。Node A 本地磁碟上的資料，Node B 當然讀不到。

所以結論很清楚：如果你的應用需要持久化資料，絕對不能把資料存在容器本身的檔案系統裡，你需要一個獨立於 Pod 生命週期的儲存機制。這就是 Volume 要解決的問題。`,
  },

  // ========== 儲存抽象層 ==========
  {
    title: 'Kubernetes 儲存抽象層',
    subtitle: 'Volume → PV → PVC → StorageClass',
    section: '儲存概念',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            { name: 'Volume', color: 'bg-slate-700', desc: '最基礎的掛載', emoji: '📁' },
            { name: 'PV', color: 'bg-blue-900/60', desc: '叢集層級儲存資源', emoji: '🗄️' },
            { name: 'PVC', color: 'bg-purple-900/60', desc: '使用者儲存申請', emoji: '📋' },
            { name: 'StorageClass', color: 'bg-green-900/60', desc: '動態自動供應', emoji: '⚡' },
          ].map((item, i) => (
            <div key={i} className={`${item.color} p-4 rounded-lg border border-slate-600`}>
              <p className="text-3xl mb-2">{item.emoji}</p>
              <p className="font-bold text-white">{item.name}</p>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { title: 'Volume', desc: '直接定義在 Pod spec 裡，Pod 消失就消失（emptyDir、hostPath）', tag: '基礎' },
            { title: 'PersistentVolume (PV)', desc: '叢集管理員預先建立的儲存資源，獨立於 Pod 生命週期', tag: '進階' },
            { title: 'PersistentVolumeClaim (PVC)', desc: '開發者用 PVC 申請需要多大的儲存，K8s 自動綁定合適的 PV', tag: '進階' },
            { title: 'StorageClass', desc: '按需動態建立 PV，不需要管理員手動預先建立', tag: '雲端' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg text-sm">
              <span className="bg-k8s-blue/30 text-k8s-blue px-2 py-0.5 rounded text-xs flex-shrink-0 mt-0.5">{item.tag}</span>
              <div>
                <span className="font-semibold text-slate-100">{item.title}：</span>
                <span className="text-slate-400">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `既然 Pod 本身無法持久化資料，Kubernetes 提供了一套儲存抽象層來解決這個問題。從簡單到複雜，分四個層次。

第一層是 Volume，這是最基礎的概念。Volume 直接定義在 Pod 的 spec 裡，可以是 emptyDir（跟 Pod 同生同死，但跨容器共享）、hostPath（掛載 Node 本地磁碟）等類型。Volume 的問題是和 Pod 綁得太緊，Pod 被刪掉重建，emptyDir 就消失了。hostPath 雖然資料不消失，但 Pod 一旦被排到別的 Node 就找不到了。

第二層是 PersistentVolume（PV），這是叢集管理員預先建立的儲存資源。PV 描述的是「這裡有一塊 100GB 的 NFS 儲存，可以給人用」，它的生命週期獨立於任何 Pod，Pod 被刪了 PV 還在。

第三層是 PersistentVolumeClaim（PVC），這是開發者申請儲存的方式。開發者說「我需要 10GB、可讀寫的儲存」，Kubernetes 會自動找一個滿足條件的 PV 綁定給它。這樣開發者不需要知道底層是什麼儲存，只需要描述需求。這就是關注點分離：管理員管 PV，開發者用 PVC。

第四層是 StorageClass，這是動態供應的機制。有了 StorageClass，不需要管理員預先建立 PV；只要 PVC 被建立，StorageClass 就自動呼叫雲端 API 建立一塊新磁碟，然後綁定給這個 PVC。非常適合雲端環境。

這四個層次是整個下午的主軸，之後每個主題都會深入介紹。`,
  },

  // ========== PV 介紹 ==========
  {
    title: 'PersistentVolume（PV）',
    subtitle: '叢集層級的儲存資源',
    section: 'PersistentVolume',
    duration: '12',
    content: (
      <div className="space-y-5">
        <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
          <p className="text-blue-300 font-semibold mb-1">💡 PV 是什麼？</p>
          <p className="text-slate-300 text-sm">叢集管理員建立的儲存資源，就像「預先備好的倉庫」，等待使用者來申請。生命週期獨立於 Pod。</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-k8s-blue font-semibold mb-2">常見 PV 類型</p>
            <div className="space-y-2 text-sm">
              {[
                { type: 'nfs', desc: 'NFS 網路檔案系統' },
                { type: 'hostPath', desc: '節點本地路徑（測試用）' },
                { type: 'awsElasticBlockStore', desc: 'AWS EBS' },
                { type: 'gcePersistentDisk', desc: 'GCE 永久磁碟' },
                { type: 'azureDisk', desc: 'Azure 磁碟' },
                { type: 'csi', desc: '通用 CSI 介面（推薦）' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 bg-slate-800/50 p-2 rounded">
                  <code className="text-green-400 text-xs">{item.type}</code>
                  <span className="text-slate-400 text-xs">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-k8s-blue font-semibold mb-2">PV 的狀態週期</p>
            <div className="space-y-2 text-sm">
              {[
                { state: 'Available', color: 'text-green-400', desc: '可用，等待被綁定' },
                { state: 'Bound', color: 'text-blue-400', desc: '已被 PVC 綁定' },
                { state: 'Released', color: 'text-yellow-400', desc: 'PVC 已刪除，等待回收' },
                { state: 'Failed', color: 'text-red-400', desc: '自動回收失敗' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded">
                  <span className={`${item.color} font-mono text-xs w-20 flex-shrink-0`}>{item.state}</span>
                  <span className="text-slate-400 text-xs">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `PersistentVolume 是 Kubernetes 儲存系統的核心概念之一。你可以把 PV 想成是「叢集管理員預先準備好、等人來用的倉庫」。

PV 是叢集層級的資源，不屬於任何 Namespace，就像 Node 一樣是全叢集共享的。管理員建立 PV 的時候，要說清楚這塊儲存從哪來（是 NFS、EBS、還是本地磁碟）、有多大、支援哪些存取模式。

PV 的來源非常多樣：可以是 NFS 這種傳統的網路檔案共享、hostPath 掛載 Node 本地目錄（通常只用在測試和開發）、各大雲端商的磁碟服務，或是最新、最通用的 CSI 介面。CSI 是 Container Storage Interface 的縮寫，是一個標準化介面，只要儲存廠商實作了 CSI driver，就可以插進 Kubernetes。現在推薦用 CSI，不要用老舊的 in-tree 插件。

PV 的生命週期有四個狀態：
Available 是剛建立、還沒被任何 PVC 綁定的狀態；
Bound 是已經被某個 PVC 綁定、正在使用中；
Released 是 PVC 被刪掉了，但 PV 還沒被回收，這時候 PV 裡可能還有上一個使用者的資料；
Failed 是自動回收失敗，需要管理員手動介入。

了解這四個狀態很重要，特別是 Released 狀態，很多人以為 PVC 刪掉了 PV 就可以再用，但其實要等 PV 回到 Available 才行，而 Recycle 政策已被廢棄，現在最常見的是 Retain（手動清理）和 Delete（自動刪除）。這個等一下講回收政策的時候會詳細說。`,
  },

  // ========== 存取模式與回收政策 ==========
  {
    title: 'PV 存取模式與回收政策',
    section: 'PersistentVolume',
    duration: '13',
    content: (
      <div className="space-y-5">
        <div>
          <p className="text-k8s-blue font-semibold mb-3">存取模式（Access Modes）</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { mode: 'RWO', full: 'ReadWriteOnce', desc: '單一節點可讀寫\n最常見，適合資料庫', color: 'bg-blue-900/50 border-blue-600' },
              { mode: 'ROX', full: 'ReadOnlyMany', desc: '多個節點唯讀\n適合靜態資料共享', color: 'bg-yellow-900/50 border-yellow-600' },
              { mode: 'RWX', full: 'ReadWriteMany', desc: '多個節點可讀寫\n需要 NFS 等支援', color: 'bg-green-900/50 border-green-600' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} border p-3 rounded-lg text-center`}>
                <p className="font-mono font-bold text-lg text-white">{item.mode}</p>
                <p className="text-xs text-slate-400 mb-1">{item.full}</p>
                <p className="text-xs text-slate-300 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-k8s-blue font-semibold mb-3">回收政策（Reclaim Policy）</p>
          <div className="space-y-2">
            {[
              { policy: 'Retain', color: 'text-green-400', desc: '保留 PV 和資料，需管理員手動清理後才能再用。生產環境推薦' },
              { policy: 'Delete', color: 'text-red-400', desc: 'PVC 刪除時自動刪除 PV 和底層儲存。雲端動態供應的預設' },
              { policy: 'Recycle', color: 'text-yellow-400', desc: '已廢棄（Deprecated），不建議使用' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
                <span className={`${item.color} font-mono font-bold w-16 flex-shrink-0`}>{item.policy}</span>
                <p className="text-slate-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `PV 有兩個關鍵屬性需要深入理解：存取模式和回收政策。

先說存取模式。存取模式定義了這個 PV「幾台 Node 可以同時掛載」以及「是否可以寫入」。

RWO 是 ReadWriteOnce，只有一台 Node 可以同時讀寫這個 PV。這是最常見的模式，絕大多數的區塊儲存（Block Storage），比如 AWS EBS、GCP PD，都只支援 RWO。適合資料庫這種需要獨占寫入的場景。

ROX 是 ReadOnlyMany，多台 Node 可以同時掛載，但只能讀取。適合把靜態設定檔、靜態網站內容分發給多個 Pod 讀取的場景。

RWX 是 ReadWriteMany，多台 Node 可以同時讀寫。這個需要底層儲存支援，通常是 NFS 或是雲端的檔案系統服務（EFS、CephFS）。適合多個 Pod 需要共享讀寫同一份資料的場景。

重要提醒：存取模式是 PV 宣告的「能力」，實際上底層儲存是否支援，取決於你用的儲存後端。EBS 就是只支援 RWO，硬掰不行。

再來說回收政策。這決定了 PVC 刪除之後，PV 和它底層的資料怎麼處理。

Retain 是保留。PVC 刪除後，PV 狀態變成 Released，資料完整保留，等管理員手動決定怎麼處理。生產環境的資料庫請用這個，避免誤刪。

Delete 是自動刪除。PVC 一刪，PV 和底層儲存（比如 EBS volume）同步被刪掉。雲端環境動態供應的 PV 通常預設是 Delete。如果你的資料只是 cache 或是無狀態的暫存，Delete 沒問題，但資料庫請不要用。

Recycle 已廢棄，別用了。現代 Kubernetes 版本已經移除支援。`,
  },

  // ========== PV YAML ==========
  {
    title: 'PV YAML 撰寫',
    section: 'PersistentVolume',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm leading-relaxed overflow-auto">
          <pre className="text-slate-300">{`apiVersion: v1
kind: PersistentVolume
metadata:
  name: `}<span className="text-yellow-400">pv-mysql-data</span>{`
spec:
  capacity:
    storage: `}<span className="text-green-400">20Gi</span>{`                  # 容量大小
  volumeMode: `}<span className="text-green-400">Filesystem</span>{`          # Filesystem 或 Block
  accessModes:
    - `}<span className="text-blue-400">ReadWriteOnce</span>{`               # 存取模式
  persistentVolumeReclaimPolicy: `}<span className="text-orange-400">Retain</span>{`  # 回收政策
  storageClassName: `}<span className="text-purple-400">manual</span>{`        # 對應 PVC 的 storageClassName
  nfs:                               # 儲存後端（此例為 NFS）
    path: /data/mysql
    server: nfs-server.example.com`}</pre>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-1">⚠️ 注意</p>
            <p className="text-slate-300">storageClassName 必須和 PVC 對應，否則無法自動綁定</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold mb-1">📌 查看 PV</p>
            <code className="text-green-400 text-xs">kubectl get pv</code><br />
            <code className="text-green-400 text-xs">kubectl describe pv pv-mysql-data</code>
          </div>
        </div>
      </div>
    ),
    notes: `現在讓我們來看 PV 的實際 YAML 長什麼樣子，然後自己試著寫一個。

開頭的 apiVersion 和 kind 不用說了，PV 是 v1 API。

metadata.name 是這個 PV 的名字，因為 PV 是叢集層級資源，沒有 namespace。

spec.capacity.storage 定義這個 PV 的容量，這裡是 20Gi，注意 Gi 是 gibibyte，是二進位的 1024 為底，不是十進位的 1000。

accessModes 是一個陣列，可以列多個，但實際使用時 PVC 只會用其中一種。

persistentVolumeReclaimPolicy 就是剛才說的回收政策，這裡用 Retain。

storageClassName 這個欄位很關鍵！它是 PV 和 PVC 之間的「連接橋樑」之一。PVC 在申請儲存時也會指定 storageClassName，Kubernetes 只會把相同 storageClassName 的 PV 和 PVC 配對。

最後是儲存後端的設定，這裡我用 NFS 為例，指定 NFS server 的 IP 和共享路徑。如果你用 hostPath，格式就是 hostPath: path: /data/mysql；如果用雲端 CSI，格式又不同，但概念一樣。

建立完 PV 後，用 kubectl get pv 可以看到狀態。剛建立的 PV 狀態是 Available，代表可以被 PVC 申請。

現在大家可以試著自己寫一個 PV YAML，用 hostPath 類型（因為我們的練習環境沒有 NFS），容量 5Gi，accessMode RWO，回收政策 Retain。寫完後 kubectl apply 建立，再 kubectl get pv 確認狀態。`,
  },

  // ========== PVC 介紹 ==========
  {
    title: 'PersistentVolumeClaim（PVC）',
    subtitle: '開發者申請儲存的方式',
    section: 'PersistentVolumeClaim',
    duration: '12',
    content: (
      <div className="space-y-5">
        <div className="bg-purple-900/30 border border-purple-600 p-4 rounded-lg">
          <p className="text-purple-300 font-semibold mb-1">💡 PVC 是什麼？</p>
          <p className="text-slate-300 text-sm">開發者向叢集「申請」儲存空間的請求物件。只描述需求（多大、什麼存取模式），不需要知道底層儲存細節。</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm leading-relaxed">
          <pre className="text-slate-300">{`apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: `}<span className="text-yellow-400">mysql-pvc</span>{`
  namespace: `}<span className="text-blue-400">production</span>{`
spec:
  accessModes:
    - `}<span className="text-green-400">ReadWriteOnce</span>{`
  resources:
    requests:
      storage: `}<span className="text-green-400">10Gi</span>{`          # 申請 10Gi 空間
  storageClassName: `}<span className="text-purple-400">manual</span>{`   # 必須與 PV 對應`}</pre>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-2">🔗 PVC 綁定 PV 的規則</p>
          <ul className="space-y-1 text-slate-300">
            <li>• storageClassName 必須相同</li>
            <li>• accessModes 必須相容</li>
            <li>• PV 的容量 ≥ PVC 申請量（多退少不補）</li>
            <li>• PV 狀態必須是 Available</li>
          </ul>
        </div>
      </div>
    ),
    notes: `有了 PV 這個「倉庫」之後，開發者要怎麼用它呢？這就是 PVC 的角色。

PVC 是 PersistentVolumeClaim，可以字面翻譯成「持久化儲存申請書」。開發者用 PVC 說：「我需要一塊至少 10Gi、支援 ReadWriteOnce 的儲存，存到 manual 這個 StorageClass 裡。」然後 Kubernetes 負責去找一個符合條件的 PV 把它們綁在一起。

這種設計的好處是關注點分離。開發者不需要知道底層是 NFS、EBS 還是 GCE PD，只需要描述需求。管理員負責準備好符合需求的 PV，兩邊各司其職。

來看一下 PVC 的 YAML。注意幾個重點：

PVC 是有 Namespace 的！這和 PV 不同，PV 是叢集層級，PVC 屬於特定 Namespace。Pod 只能使用同一個 Namespace 裡的 PVC。

resources.requests.storage 是申請的容量，Kubernetes 會找一個容量大於等於這個值的 PV 來綁定。注意是「大於等於」，如果你申請 10Gi 但只有一個 20Gi 的 PV，也可以綁定，但你用的空間只有 PVC 申請的 10Gi，多的那 10Gi 就被鎖住無法給其他人用，這是靜態供應的一個缺點。

storageClassName 必須和目標 PV 的 storageClassName 一致，這是配對的關鍵。

PVC 建立後，如果找到符合的 PV，狀態會從 Pending 變成 Bound。如果沒有符合的 PV，PVC 會一直停在 Pending，等待有合適的 PV 出現。用 kubectl get pvc 可以看到狀態，kubectl describe pvc 可以看到詳細的綁定資訊。`,
  },

  // ========== Pod 使用 PVC ==========
  {
    title: 'Pod 掛載 PVC',
    subtitle: '讓 Pod 真正使用持久化儲存',
    section: 'PersistentVolumeClaim',
    duration: '18',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm leading-relaxed overflow-auto max-h-72">
          <pre className="text-slate-300">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
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
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: "mypassword"
          volumeMounts:                  # ① 在 container 裡定義掛載點
            - name: `}<span className="text-yellow-400">mysql-storage</span>{`
              mountPath: /var/lib/mysql  # 掛載路徑
      volumes:                           # ② 在 Pod 層級宣告 volume
        - name: `}<span className="text-yellow-400">mysql-storage</span>{`
          persistentVolumeClaim:
            claimName: `}<span className="text-purple-400">mysql-pvc</span>{`      # 對應 PVC 名稱`}</pre>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-purple-900/30 border border-purple-700 p-3 rounded-lg text-center">
            <p className="text-purple-400 font-bold mb-1">PVC</p>
            <p className="text-slate-300">mysql-pvc</p>
            <p className="text-slate-500">申請儲存</p>
          </div>
          <div className="flex items-center justify-center text-2xl text-k8s-blue">→</div>
          <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-center">
            <p className="text-yellow-400 font-bold mb-1">Volume</p>
            <p className="text-slate-300">mysql-storage</p>
            <p className="text-slate-500">Pod 層級掛載</p>
          </div>
        </div>
      </div>
    ),
    notes: `現在來看最重要的部分：怎麼讓 Pod 實際用上 PVC 的儲存。

一個 Pod 要掛載 PVC，需要在兩個地方寫設定：

第一個地方是 spec.volumes，這是在 Pod 層級宣告「我要使用這個 PVC，幫我叫做 mysql-storage」。volumes 是一個陣列，一個 Pod 可以掛多個 volume。每個 volume 要有 name，還有 persistentVolumeClaim.claimName 指向你要用哪個 PVC。

第二個地方是 containers[].volumeMounts，這是在 Container 層級說「把剛才宣告的 mysql-storage 掛到容器的 /var/lib/mysql 這個路徑上」。name 要和 volumes 裡的 name 對應。mountPath 是容器內的路徑，對 MySQL 來說，資料都存在 /var/lib/mysql，所以就掛在這裡。

兩個地方用 name 連結起來，這個設計讓一個 Pod 可以有多個不同的 volume，分別掛到不同路徑，也讓同一個 Pod 裡的多個 container 可以共享同一個 volume。

部署完之後，讓我們驗證一下持久化有沒有成功。方法是：
一、進到 MySQL Pod 裡建立一些測試資料。
二、刪除這個 Pod（kubectl delete pod mysql-xxx）。
三、等 Deployment 重建 Pod 之後，進去確認資料還在。

如果設定正確，資料還在！因為資料存在 PVC 指向的 PV 裡，PVC 沒有刪掉，PV 也還在，新的 Pod 重新掛載同一個 PVC，自然就能看到舊資料。這就是持久化儲存的意義。

大家現在動手試試看：先建立 PVC，再建立掛載這個 PVC 的 Deployment，然後 exec 進 Pod 建立測試檔案，刪掉 Pod 等重建，確認資料還在。`,
  },

  // ========== 休息 ==========
  {
    title: '☕ 休息時間',
    subtitle: '休息 15 分鐘',
    section: '中場休息',
    duration: '1',
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🚶 🧘</p>
        <p className="text-2xl text-slate-300">休息 15 分鐘，等等進入進階儲存主題</p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400 mb-2">下半場預告</p>
          <ul className="text-k8s-blue space-y-1 text-left">
            <li>⚡ StorageClass 動態供應</li>
            <li>🐬 StatefulSet 深入</li>
            <li>🔒 備份策略</li>
          </ul>
        </div>
      </div>
    ),
    notes: `好，上半場結束！我們學了 PV、PVC、以及怎麼讓 Pod 掛載持久化儲存，這是整個儲存體系的靜態供應部分。

現在休息 15 分鐘，上廁所、喝水、活動筋骨。有問題可以趁這段時間來問我或助教。

休息結束後，我們進入動態供應的世界：StorageClass，然後是有狀態服務的核心控制器 StatefulSet，最後是備份策略。下半場的內容同樣精彩，甚至可以說更實用。15 分鐘後見！`,
  },

  // ========== StorageClass ==========
  {
    title: 'StorageClass',
    subtitle: '動態供應，告別手動建立 PV',
    section: 'StorageClass',
    duration: '12',
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">❌ 靜態供應問題</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 管理員要預先建立每個 PV</li>
              <li>• 容量浪費（剩餘空間鎖定）</li>
              <li>• 規模擴展困難</li>
              <li>• 雲端環境不靈活</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✓ 動態供應優點</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• PVC 建立時自動建立 PV</li>
              <li>• 按需分配，無浪費</li>
              <li>• 完美整合雲端 API</li>
              <li>• 開發者無感，自助服務</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
          <pre className="text-slate-300">{`apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: `}<span className="text-yellow-400">fast-ssd</span>{`
  annotations:
    storageclass.kubernetes.io/is-default-class: `}<span className="text-green-400">"true"</span>{`
provisioner: `}<span className="text-blue-400">ebs.csi.aws.com</span>{`     # 使用 AWS EBS CSI driver
parameters:
  type: `}<span className="text-green-400">gp3</span>{`                       # EBS volume 類型
  iops: `}<span className="text-green-400">"3000"</span>{`
reclaimPolicy: `}<span className="text-orange-400">Delete</span>{`            # PVC 刪除時自動刪 PV
volumeBindingMode: `}<span className="text-purple-400">WaitForFirstConsumer</span></pre>
        </div>
      </div>
    ),
    notes: `休息完，精神好一點了嗎？我們進入 StorageClass，這是讓 Kubernetes 儲存管理真正「雲端化」的關鍵機制。

先回顧一下靜態供應的問題。靜態供應就是我們剛才做的：管理員預先手動建立 PV，等開發者用 PVC 申請。在小規模環境還可以，但在大規模雲端環境，問題就來了：可能有幾百個 PVC 申請，難道管理員要一個一個手動建 PV 嗎？而且靜態供應很容易造成容量浪費，因為 Kubernetes 會把容量比申請量大的 PV 綁給 PVC，多出來的空間就被鎖住了。

StorageClass 解決了這些問題。有了 StorageClass，當開發者建立 PVC 時，Kubernetes 會自動呼叫 StorageClass 指定的 provisioner（供應商驅動程式），在雲端或儲存系統上建立一個新的磁碟，大小剛好等於 PVC 申請的量，然後自動建立 PV 把兩者綁定。整個過程對開發者完全透明。

來看 StorageClass 的 YAML。provisioner 是最重要的欄位，它指定了用哪個 CSI driver 來動態建立儲存。這裡是 AWS EBS 的 CSI driver。parameters 裡是傳給 provisioner 的參數，不同的 provisioner 有不同的參數格式。reclaimPolicy 是這個 StorageClass 動態建立的 PV 預設回收政策。

volumeBindingMode: WaitForFirstConsumer 是一個很重要的設定，意思是「等到有 Pod 實際要用這個 PVC 的時候，才去建立 PV」。這避免了在多可用區的雲端環境中，PV 建立在和 Pod 不同的可用區導致無法掛載的問題。推薦用這個模式。

is-default-class: "true" 這個 annotation 讓這個 StorageClass 成為預設值。如果 PVC 沒有指定 storageClassName，就會自動用預設的 StorageClass。這對開發者很友好。`,
  },

  // ========== StorageClass 雲端整合 ==========
  {
    title: 'StorageClass 雲端整合',
    subtitle: '各大雲端平台對應設定',
    section: 'StorageClass',
    duration: '13',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              cloud: 'AWS EKS',
              color: 'bg-orange-900/40 border-orange-600',
              titleColor: 'text-orange-400',
              provisioner: 'ebs.csi.aws.com',
              type: 'gp3',
              note: 'EBS 只支援 RWO',
            },
            {
              cloud: 'GKE',
              color: 'bg-blue-900/40 border-blue-600',
              titleColor: 'text-blue-400',
              provisioner: 'pd.csi.storage.gke.io',
              type: 'pd-ssd',
              note: '支援 RWO/RWX',
            },
            {
              cloud: 'AKS',
              color: 'bg-cyan-900/40 border-cyan-600',
              titleColor: 'text-cyan-400',
              provisioner: 'disk.csi.azure.com',
              type: 'Premium_LRS',
              note: '支援 RWO/RWX',
            },
          ].map((item, i) => (
            <div key={i} className={`${item.color} border p-4 rounded-lg`}>
              <p className={`${item.titleColor} font-bold text-lg mb-2`}>{item.cloud}</p>
              <p className="text-xs text-slate-400 mb-1">provisioner:</p>
              <code className="text-green-400 text-xs break-all">{item.provisioner}</code>
              <p className="text-xs text-slate-400 mt-2 mb-1">type:</p>
              <code className="text-yellow-400 text-xs">{item.type}</code>
              <p className="text-xs text-slate-500 mt-2">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
          <p className="text-slate-400 mb-2"># 查看叢集可用的 StorageClass</p>
          <p className="text-green-400">kubectl get storageclass</p>
          <p className="text-slate-500 mt-2"># NAME              PROVISIONER             AGE</p>
          <p className="text-slate-300"># standard(default) pd.csi.storage.gke.io   30d</p>
          <p className="text-slate-300"># fast-ssd          pd.csi.storage.gke.io   10d</p>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">💡 本地開發環境</p>
          <p className="text-slate-300">使用 rancher.io/local-path 或 docker.io/hostpath，讓 minikube/kind 也能用動態供應</p>
        </div>
      </div>
    ),
    notes: `每個雲端平台都有自己的 StorageClass provisioner，讓我們快速看一下三大平台的設定。

AWS EKS 用的是 ebs.csi.aws.com，建立的是 EBS（Elastic Block Store）磁碟。type 參數常用 gp3，這是最新一代的通用型 SSD，性價比最好。記住 EBS 只支援 RWO，如果你需要 RWX，要改用 EFS 的 CSI driver，provisioner 換成 efs.csi.aws.com，type 是 EFS。

GKE 用的是 pd.csi.storage.gke.io，建立 Google Persistent Disk。type 常用 pd-standard（標準 HDD）或 pd-ssd（高性能 SSD）。GKE 有預設就幫你設好的 StorageClass，新建叢集開箱即用。

AKS 用的是 disk.csi.azure.com，建立 Azure 磁碟。Premium_LRS 是高性能 SSD。

這些 provisioner 的具體 parameters 格式每個平台都不一樣，最好的方法是去看官方文件，或是直接在叢集裡 kubectl get storageclass -o yaml 看現有的設定當範本。

在本地開發環境，比如 minikube 或 kind，通常有內建的 local-path provisioner，把磁碟映射到 Node 的本地路徑。它不像雲端 StorageClass 那樣真的是分散式持久化儲存，但拿來開發測試很夠用。

選擇 StorageClass 的原則是：生產環境的資料庫用高性能 SSD、reclaimPolicy 用 Retain；測試環境或 cache 用標準磁碟、reclaimPolicy 可以用 Delete；需要多 Pod 共享的場景用能支援 RWX 的方案。`,
  },

  // ========== StatefulSet 介紹 ==========
  {
    title: 'StatefulSet 深入',
    subtitle: '有狀態應用的最佳夥伴',
    section: 'StatefulSet',
    duration: '15',
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
            <p className="text-slate-400 font-semibold mb-3">Deployment（無狀態）</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Pod 名稱隨機（nginx-5d7f-x2k）</li>
              <li>• Pod 之間完全等價</li>
              <li>• 可以任意順序擴縮容</li>
              <li>• 共享同一個 PVC（或無 PVC）</li>
            </ul>
          </div>
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-600">
            <p className="text-purple-300 font-semibold mb-3">StatefulSet（有狀態）</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Pod 名稱固定（mysql-0, mysql-1）</li>
              <li>• 每個 Pod 有獨立的儲存</li>
              <li>• 嚴格按順序部署/終止</li>
              <li>• 穩定的 DNS 名稱</li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-k8s-blue font-semibold mb-2">StatefulSet 的三大特性</p>
          <div className="space-y-2">
            {[
              { icon: '📛', title: '穩定的 Pod 名稱', desc: '<StatefulSet名>-<序號>，如 mysql-0、mysql-1，重建後名稱不變' },
              { icon: '💾', title: '穩定的儲存', desc: '每個 Pod 有獨立的 PVC，Pod 重建後仍然掛載同一個 PVC' },
              { icon: '🔢', title: '有序部署與終止', desc: '部署時從 0 到 N-1 依序啟動；縮容時從 N-1 到 0 依序終止' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `好，現在進入今天下午最精彩的主題之一：StatefulSet。

先比較一下 Deployment 和 StatefulSet 的根本差異。Deployment 是設計來跑無狀態應用的：每個 Pod 都一模一樣，可以隨意新增或刪除，Pod 名稱包含隨機 hash，重建後換一個新名字，完全沒差。

但有狀態的應用就不一樣了。以 MySQL 主從複製為例：主節點和從節點的角色是不同的，從節點需要知道主節點的名稱去複製資料，如果 Pod 名稱每次重建都變，這個架構就崩了。而且每個 MySQL 節點要有自己獨立的資料目錄，不能共享。

StatefulSet 專門解決這些問題，它有三個核心保證：

第一，穩定的 Pod 名稱。StatefulSet 管理的 Pod 名稱是「statefulset名稱-序號」，比如 mysql-0、mysql-1、mysql-2。不管 Pod 被刪了幾次，重建後名稱一定還是一樣的。這讓其他服務可以用固定的 DNS 名稱找到這個 Pod。

第二，穩定的儲存。每個 Pod 有自己專屬的 PVC，透過 volumeClaimTemplates 自動建立。mysql-0 用 data-mysql-0，mysql-1 用 data-mysql-1，互不相干。即使 Pod 被刪掉重建，依然會掛回同一個 PVC，所以資料不會丟失。

第三，有序部署和終止。擴容時，必須等 mysql-0 完全就緒之後，才啟動 mysql-1；mysql-1 就緒後才啟動 mysql-2。縮容時反過來，先停 mysql-2，再停 mysql-1。這個有序保證讓 MySQL 主從複製、Redis Cluster 這類需要依序初始化的應用可以正確啟動。

適合用 StatefulSet 的應用：MySQL、PostgreSQL 這類資料庫；Kafka、Zookeeper 這類訊息佇列；Elasticsearch、Cassandra 這類分散式資料系統；Redis Cluster 等。`,
  },

  // ========== StatefulSet YAML + volumeClaimTemplates ==========
  {
    title: 'StatefulSet YAML',
    subtitle: 'volumeClaimTemplates 是關鍵',
    section: 'StatefulSet',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs leading-relaxed overflow-auto max-h-80">
          <pre className="text-slate-300">{`apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: `}<span className="text-yellow-400">"mysql-headless"</span>{`  # 必須指定 Headless Service
  replicas: 3
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
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-secret
                  key: password
          volumeMounts:
            - name: `}<span className="text-purple-400">data</span>{`           # 對應下方 volumeClaimTemplates
              mountPath: /var/lib/mysql
  `}<span className="text-green-400">volumeClaimTemplates:</span>{`            # 每個 Pod 自動建立獨立 PVC
    - metadata:
        name: `}<span className="text-purple-400">data</span>{`
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: `}<span className="text-orange-400">fast-ssd</span>{`
        resources:
          requests:
            storage: 20Gi`}</pre>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-1">自動建立的 PVC 名稱規則</p>
          <p className="text-slate-300 font-mono text-xs">{'<volumeClaimTemplate名>-<StatefulSet名>-<序號>'}</p>
          <p className="text-slate-400 text-xs mt-1">例如：data-mysql-0、data-mysql-1、data-mysql-2</p>
        </div>
      </div>
    ),
    notes: `讓我們看一下 StatefulSet 完整的 YAML 格式，有幾個特別重要的點。

第一個重點：serviceName 必須填，而且必須指向一個 Headless Service（clusterIP: None）。Headless Service 不會分配 ClusterIP，而是直接在 DNS 裡為每個 Pod 建立個別的 DNS 記錄。這讓你可以用 mysql-0.mysql-headless.default.svc.cluster.local 這樣的固定 DNS 名稱直接找到特定的 Pod。主從複製的從節點就是用這個 DNS 名稱連接主節點的。

第二個重點：volumeClaimTemplates。這是 StatefulSet 特有的欄位，它不是 volumes，而是一個 PVC 模板。StatefulSet 會根據這個模板，為每個 Pod 自動建立一個獨立的 PVC。如果 StatefulSet 有 3 個 replica，就會建立 data-mysql-0、data-mysql-1、data-mysql-2 三個 PVC，每個 20Gi。

volumeMounts 裡的 name: data 必須和 volumeClaimTemplates 裡的 name: data 對應，這樣 Kubernetes 才知道這個 volume 是來自 volumeClaimTemplate，而不是普通的 volumes。

一個很重要的行為需要了解：當你縮容 StatefulSet（比如從 3 個 replica 縮到 2 個），mysql-2 這個 Pod 會被刪除，但 data-mysql-2 這個 PVC 不會被自動刪除！Kubernetes 這樣設計是為了避免意外刪除資料。如果你確定不需要了，要手動 kubectl delete pvc data-mysql-2。

密碼的部分注意一下，我用了 secretKeyRef 從 Secret 取得，這才是正確的做法，不要把密碼明文寫在 YAML 裡。先建立 kubectl create secret generic mysql-secret --from-literal=password=yourpassword，再 apply StatefulSet。`,
  },

  // ========== MySQL StatefulSet 實作 ==========
  {
    title: '🔨 實作：MySQL StatefulSet',
    section: 'StatefulSet',
    duration: '10',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">完整部署流程：</p>
        <div className="space-y-3">
          {[
            {
              step: '1',
              title: '建立 Headless Service',
              code: `kubectl apply -f mysql-headless-svc.yaml`,
              desc: 'clusterIP: None，為每個 Pod 提供固定 DNS',
            },
            {
              step: '2',
              title: '建立 Secret（密碼）',
              code: `kubectl create secret generic mysql-secret \\
  --from-literal=password=MyP@ss1234`,
              desc: '避免密碼明文寫在 YAML',
            },
            {
              step: '3',
              title: '部署 StatefulSet',
              code: `kubectl apply -f mysql-statefulset.yaml`,
              desc: '觀察 Pod 按序號逐一啟動',
            },
            {
              step: '4',
              title: '驗證部署',
              code: `kubectl get statefulset mysql
kubectl get pods -l app=mysql
kubectl get pvc | grep mysql`,
              desc: '確認 Pod 和 PVC 都正確建立',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-k8s-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">{item.step}</span>
                <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
              </div>
              <code className="text-green-400 text-xs block bg-slate-900 p-2 rounded whitespace-pre">{item.code}</code>
              <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `現在我們實際動手部署一個 MySQL StatefulSet，把剛才學的所有概念串起來。

第一步，先建立 Headless Service。Headless Service 的 YAML 裡 clusterIP 要設為 None，其他和一般 Service 一樣。這個 Service 不做負載均衡，只提供 DNS 解析。部署後用 kubectl get svc 確認 CLUSTER-IP 那欄顯示 None。

第二步，建立 Secret 存放 MySQL root 密碼。用 kubectl create secret 指令，這樣密碼不會出現在任何 YAML 檔裡，也不會被 git 追蹤到。這是最基本的安全實踐。

第三步，apply StatefulSet YAML。部署後，立刻用 kubectl get pods -w 觀察 Pod 的啟動順序，你會看到先 mysql-0 變成 Running，然後才是 mysql-1，再來是 mysql-2，不會同時起來。

第四步，驗證結果。kubectl get statefulset 看 StatefulSet 狀態；kubectl get pvc 看是否自動建立了三個 PVC（data-mysql-0、data-mysql-1、data-mysql-2）；kubectl get pods 確認三個 Pod 都是 Running。

進一步驗證 DNS：exec 進 mysql-0，在裡面 ping mysql-1.mysql-headless，應該能解析到 mysql-1 的 Pod IP。這就是 StatefulSet 提供的穩定網路身份。

如果有時間，再做一個持久化驗證：exec 進 mysql-0，建立一個測試資料庫；然後 kubectl delete pod mysql-0；等 Pod 重建後，再 exec 進去確認資料庫還在。這個動作能直觀地驗證 volumeClaimTemplates 的威力。`,
  },

  // ========== 備份策略：etcd 快照 ==========
  {
    title: '備份策略（一）',
    subtitle: 'etcd 快照備份',
    section: '備份策略',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="bg-red-900/30 border border-red-600 p-4 rounded-lg text-sm">
          <p className="text-red-400 font-semibold mb-2">🚨 為什麼需要備份？</p>
          <p className="text-slate-300">叢集設定遺失 ≠ 資料遺失。叢集狀態（Deployment、Service、ConfigMap...）全部存在 etcd 裡，etcd 損毀 = 叢集狀態歸零。</p>
        </div>
        <div>
          <p className="text-k8s-blue font-semibold mb-2">etcd 備份指令</p>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs space-y-3">
            <div>
              <p className="text-slate-500"># 對 etcd 做快照</p>
              <p className="text-green-400">{'ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot.db \\'}</p>
              <p className="text-green-400">{'  --endpoints=https://127.0.0.1:2379 \\'}</p>
              <p className="text-green-400">{'  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\'}</p>
              <p className="text-green-400">{'  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \\'}</p>
              <p className="text-green-400">{'  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key'}</p>
            </div>
            <div>
              <p className="text-slate-500"># 確認快照狀態</p>
              <p className="text-green-400">ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db</p>
            </div>
            <div>
              <p className="text-slate-500"># 還原快照（需要先停止 etcd Pod）</p>
              <p className="text-green-400">{'ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \\'}</p>
              <p className="text-green-400">{'  --data-dir=/var/lib/etcd-backup'}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `備份是很多人學 Kubernetes 時容易忽略的主題，但在生產環境這是絕對不能跳過的功課。

我們要備份兩個層面：一是叢集本身的狀態，二是應用的資料。叢集狀態備份靠 etcd 快照，應用資料備份靠 Velero。

先說 etcd。etcd 是 Kubernetes 的「大腦」，所有的 API 物件——Deployment、Service、ConfigMap、Secret、PV、PVC 等等——都存在 etcd 的鍵值資料庫裡。如果 etcd 資料遺失，你的叢集設定就全部消失了，雖然 Pod 可能還在跑，但叢集已經無法管理。

etcdctl 是操作 etcd 的工具，ETCDCTL_API=3 是指定使用第三版 API。snapshot save 指令建立快照，需要帶上 etcd 的憑證（TLS 相互驗證）。這些憑證通常在 /etc/kubernetes/pki/etcd/ 下。備份出來的 db 檔案要存到安全的地方，最好是叢集外的儲存。

etcdctl snapshot status 可以驗證備份檔案是否完整，會顯示快照的 hash、版本、鍵的數量等資訊。

還原步驟相對複雜，需要先停止 kube-apiserver 和 etcd（通常是把它們的 static pod manifest 移開），然後 restore 快照到指定目錄，再修改 etcd 的設定指向新的 data-dir，最後重啟。正因為還原步驟複雜，更要定期演練，而不是等到真的出事才第一次練。

建議設定 cron job，每天凌晨自動執行 etcd 快照並上傳到 S3 或其他物件儲存。保留最近 7 到 30 天的備份，看業務需求決定。`,
  },

  // ========== 備份策略：Velero ==========
  {
    title: '備份策略（二）',
    subtitle: 'Velero — 應用層備份神器',
    section: '備份策略',
    duration: '10',
    content: (
      <div className="space-y-5">
        <div className="bg-green-900/30 border border-green-600 p-4 rounded-lg text-sm">
          <p className="text-green-400 font-semibold mb-1">🔒 Velero 是什麼？</p>
          <p className="text-slate-300">CNCF 孵化的開源工具，可備份整個 Namespace 的 K8s 物件 + PV 資料，支援跨叢集還原和遷移。</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-k8s-blue font-semibold mb-2 text-sm">常用 Velero 指令</p>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs space-y-2">
              <p className="text-slate-500"># 安裝 Velero（以 AWS S3 為例）</p>
              <p className="text-green-400">{'velero install \\'}</p>
              <p className="text-green-400">{'  --provider aws \\'}</p>
              <p className="text-green-400">{'  --bucket my-velero-bucket \\'}</p>
              <p className="text-green-400">{'  --region ap-northeast-1'}</p>
              <br />
              <p className="text-slate-500"># 備份整個 namespace</p>
              <p className="text-green-400">velero backup create ns-backup \</p>
              <p className="text-green-400">  --include-namespaces production</p>
              <br />
              <p className="text-slate-500"># 查看備份清單</p>
              <p className="text-green-400">velero backup get</p>
              <br />
              <p className="text-slate-500"># 還原備份</p>
              <p className="text-green-400">velero restore create \</p>
              <p className="text-green-400">  --from-backup ns-backup</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-k8s-blue font-semibold mb-2 text-sm">Velero vs etcd 快照</p>
            {[
              { item: 'K8s 物件', etcd: '✓ 全叢集', velero: '✓ 可按 NS 選擇' },
              { item: 'PV 資料', etcd: '✗', velero: '✓ Volume Snapshot' },
              { item: '細粒度還原', etcd: '✗', velero: '✓ 單一資源' },
              { item: '跨叢集遷移', etcd: '✗', velero: '✓' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-1 text-xs bg-slate-800/50 p-2 rounded">
                <span className="text-slate-400">{row.item}</span>
                <span className={row.etcd.startsWith('✓') ? 'text-green-400' : 'text-red-400'}>{row.etcd}</span>
                <span className={row.velero.startsWith('✓') ? 'text-green-400' : 'text-red-400'}>{row.velero}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `etcd 快照解決了叢集層面的備份，但應用的資料怎麼辦？如果你的 MySQL Pod 裡有三個月的交易記錄，etcd 快照不會備份這些資料，只備份了「有一個 MySQL StatefulSet 叫做 mysql」這個設定。這時候就需要 Velero。

Velero 是 VMware 開源、現在由 CNCF 孵化的備份工具，它能做到兩件事：備份 Kubernetes 物件（所有的 YAML 設定）、備份 PersistentVolume 裡的資料。

備份 PV 資料的原理是透過 CSI Volume Snapshot，呼叫雲端 API 對磁碟做快照。所以需要你的儲存後端支援 Volume Snapshot（AWS EBS、GCE PD、Azure Disk 都支援）。

Velero 的使用流程很直覺：安裝時指定你的儲存後端（備份檔案存哪裡，通常是 S3）和雲端認證；然後 velero backup create 建立備份，可以備份整個叢集或指定的 Namespace；velero backup get 看備份清單；velero restore create --from-backup 還原。

Velero 的殺手級功能是「排程備份」：velero schedule create hourly-backup --schedule="0 * * * *" --include-namespaces production，這樣每小時自動備份 production 這個 namespace，備份檔存到 S3，不用人工干預。

etcd 快照和 Velero 是互補的，建議兩個都做。etcd 快照是叢集層面的最後防線，Velero 是應用層面的精細備份。在大型生產環境，通常同時跑兩套備份，應對不同的故障場景。`,
  },

  // ========== 課程總結 ==========
  {
    title: '課程總結',
    subtitle: '今天學了什麼？',
    section: '總結',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              title: '儲存抽象層',
              color: 'bg-blue-900/40 border-blue-600',
              titleColor: 'text-blue-300',
              items: ['Volume 基礎概念', 'PV：叢集儲存資源', 'PVC：開發者申請', 'StorageClass：動態供應'],
            },
            {
              title: 'StatefulSet',
              color: 'bg-purple-900/40 border-purple-600',
              titleColor: 'text-purple-300',
              items: ['固定 Pod 名稱與 DNS', '每 Pod 獨立 PVC', '有序部署與終止', 'volumeClaimTemplates'],
            },
            {
              title: 'PV / PVC 實作',
              color: 'bg-green-900/40 border-green-600',
              titleColor: 'text-green-300',
              items: ['存取模式 RWO/ROX/RWX', '回收政策 Retain/Delete', 'Pod 掛載 PVC', 'MySQL 持久化部署'],
            },
            {
              title: '備份策略',
              color: 'bg-orange-900/40 border-orange-600',
              titleColor: 'text-orange-300',
              items: ['etcd 快照與還原', 'Velero 應用層備份', 'Volume Snapshot', '定期排程備份'],
            },
          ].map((block, i) => (
            <div key={i} className={`${block.color} border p-4 rounded-lg`}>
              <p className={`${block.titleColor} font-semibold mb-2 text-sm`}>{block.title}</p>
              <ul className="space-y-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-green-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-1">🎯 核心觀念</p>
          <p className="text-slate-300">資料持久化 = 把儲存「外掛」到 Pod，讓資料的生命週期獨立於容器。PV/PVC 是靜態抽象，StorageClass 是動態自動化，StatefulSet 是有狀態應用的最佳控制器。</p>
        </div>
      </div>
    ),
    notes: `快到尾聲了，讓我們一起回顧今天下午學了什麼。

第一個主題，儲存抽象層。我們從「Pod 的資料為什麼消失」出發，理解了容器的可寫層是臨時的，然後學了 Kubernetes 的四層儲存抽象：Volume 是最基礎的掛載機制，PV 是叢集管理員預建的儲存資源，PVC 是開發者申請儲存的介面，StorageClass 是動態自動供應的機制。這四層從簡單到複雜，對應不同的使用場景。

第二個主題，PV 和 PVC 的實作。我們學了存取模式，記得 RWO 是一個 Node 讀寫、ROX 多個 Node 唯讀、RWX 多個 Node 讀寫；回收政策，Retain 是保留等管理員處理，Delete 是自動刪除；還有怎麼寫 PV YAML、PVC YAML，以及讓 Pod 掛載 PVC 的兩步設定（volumes + volumeMounts）。

第三個主題，StorageClass 動態供應。解決了靜態供應容量浪費和管理困難的問題，了解了各大雲端平台的 provisioner，以及 WaitForFirstConsumer 和預設 StorageClass 的設定。

第四個主題，StatefulSet 深入。這是整個下午最複雜的部分，但也是最重要的。理解 StatefulSet 的三個核心保證：固定名稱、獨立儲存、有序部署；學了 volumeClaimTemplates 這個關鍵欄位；以及 Headless Service 配合 StatefulSet 的完整部署流程。

第五個主題，備份策略。學了 etcd 快照備份叢集狀態，以及 Velero 備份應用資料，兩套方案互補。

這些知識是生產環境 Kubernetes 的核心能力，掌握了這些，你就有能力管理真正的有狀態應用了。`,
  },

  // ========== Q&A ==========
  {
    title: 'Q & A',
    subtitle: '任何問題都歡迎提出',
    section: 'Q&A',
    duration: '5',
    content: (
      <div className="space-y-6">
        <div className="text-center text-6xl">🙋</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">常見問題預告</p>
            <ul className="space-y-2 text-slate-300">
              <li>• PVC 為什麼一直 Pending？</li>
              <li>• RWO 和 RWX 怎麼選？</li>
              <li>• StatefulSet 縮容後 PVC 怎麼處理？</li>
              <li>• 本地開發環境怎麼用動態供應？</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">課後學習資源</p>
            <ul className="space-y-2 text-slate-300">
              <li>• K8s 官方文件：Storage</li>
              <li>• Velero 官方文件</li>
              <li>• CSI Driver 清單</li>
              <li>• CNCF Storage Landscape</li>
            </ul>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-600 p-4 rounded-lg text-center">
          <p className="text-green-400 font-semibold text-lg">🎉 第六堂課完成！</p>
          <p className="text-slate-300 text-sm mt-1">明天繼續：叢集維運、監控、CI/CD 整合</p>
        </div>
      </div>
    ),
    notes: `好，我們正式進入 Q&A 時間。今天的內容很紮實，有任何問題都歡迎提出來，不管是剛才某個地方沒聽懂，還是想更深入理解某個概念，甚至是你在工作上遇到的實際問題，都可以問。

我先預告幾個常見問題的答案，如果你有類似的疑惑可以補充追問。

PVC 一直 Pending 的原因通常有幾個：storageClassName 和 PV 不一致（或 PV 沒有對應的 StorageClass）、沒有符合條件的 PV（容量不夠或存取模式不對）、在靜態供應模式下沒有可用的 PV。用 kubectl describe pvc 看 Events 欄位，通常有很明確的錯誤說明。

RWO vs RWX 怎麼選：如果你的應用只會跑一個 Pod（比如單一的 MySQL 實例），用 RWO 就夠了，而且大多數雲端塊儲存只支援 RWO。只有多個 Pod 需要同時寫入同一個儲存的時候，才需要 RWX，這時候要選 NFS 或 EFS 這類支援 RWX 的方案。

StatefulSet 縮容後 PVC 的處理：記得前面說過，縮容不會自動刪除 PVC。如果你確定不需要那份資料了，手動 kubectl delete pvc 清掉；如果可能還要用（比如只是暫時縮容），就留著，下次擴容時 Pod 會自動重新掛回同一個 PVC，資料還在。

有其他問題嗎？（Q&A 環節）

好，我們下課！今天的資料儲存主題告一段落。明天繼續：叢集維運、Prometheus 監控體系，以及 CI/CD 與 GitOps 的整合。大家今晚回去可以嘗試把課堂的 MySQL StatefulSet 實際跑起來，感受一下資料持久化的效果。明天見！`,
  },
]
