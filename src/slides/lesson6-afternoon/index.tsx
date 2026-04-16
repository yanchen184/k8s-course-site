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
  // ============================================================
  // Loop 4：PV + PVC（6-11, 6-12, 6-13）
  // ============================================================

  // ── 6-11 概念（1/6）：為什麼資料會消失？ ──
  {
    title: '為什麼資料會消失？',
    subtitle: 'overlay filesystem、emptyDir、真正的持久化',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Pod 的檔案系統是 overlay filesystem</p>
          <div className="font-mono text-xs text-slate-400 bg-slate-900 p-3 rounded space-y-1">
            <p>Pod 刪 → 容器刪 → overlay filesystem 刪 → 資料全不見</p>
            <p className="text-slate-500 mt-1">/var/lib/mysql 就這樣消失了</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Docker 也一樣</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded text-center">
              <p className="text-red-400 font-semibold text-xs mb-1">不掛 -v</p>
              <p className="font-mono text-xs text-slate-400">docker run mysql:8.0</p>
              <p className="text-slate-400 text-xs mt-1">容器刪 → 資料沒</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded text-center">
              <p className="text-green-400 font-semibold text-xs mb-1">掛 -v</p>
              <p className="font-mono text-xs text-slate-400">docker run -v mydata:/var/lib/mysql</p>
              <p className="text-slate-400 text-xs mt-1">容器刪 → 資料還在</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">emptyDir 不是持久化</p>
          <p className="text-slate-300 text-sm">emptyDir 跟 Pod 生命週期綁定，Pod 刪了 emptyDir 也消失。它是讓同一個 Pod 裡多個容器共享暫存資料用的，不能拿來存資料庫。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">真正持久化 → PV + PVC</p>
          <p className="text-slate-300 text-sm">需要「跟 Pod 無關」的儲存空間，Pod 來來去去，資料穩穩待著。K8s 的答案是 <strong className="text-cyan-400">PersistentVolume + PersistentVolumeClaim</strong>。</p>
        </div>
      </div>
    ),
    notes: `好，歡迎回來。下午第一個主題是儲存。

問大家一個問題：如果你的 MySQL Pod 今天被重啟了，資料還在嗎？

答案是：不在。資料全部消失。

為什麼？因為 Pod 的檔案系統本質上就是容器的 overlay filesystem。容器啟動的時候，K8s 幫你疊了一層可寫的層。MySQL 把資料寫到 /var/lib/mysql 這個目錄。看起來很正常，但這個目錄其實是活在那個可寫層裡面的。Pod 一被刪，容器被刪，那個可寫層也跟著消失，/var/lib/mysql 就不見了，裡面的所有資料通通沒有。

用 Docker 來對照，大家比較好理解。docker run mysql:8.0 不掛任何 Volume，容器一刪，資料就沒了，這是一樣的道理。Docker 的解法是掛 -v，-v mydata:/var/lib/mysql，這樣資料存在 Host 的 Volume 裡面，容器怎麼刪都不怕。

那有同學可能記得，第四堂課我們講過 emptyDir。emptyDir 是 K8s 的一種 Volume，但是它跟 Pod 的生命週期綁定，Pod 在它才在，Pod 一刪它也消失。emptyDir 的用途是讓同一個 Pod 裡的多個容器可以共享暫存資料，比如說 Sidecar 架構。它不是拿來做資料持久化的。

所以我們需要的是一種「跟 Pod 完全無關」的儲存空間。Pod 死了又活、活了又死，這塊儲存空間穩穩地待在那裡，不受任何影響。K8s 提供的解法就是 PersistentVolume 跟 PersistentVolumeClaim，簡稱 PV 和 PVC。 [▶ 下一頁]`,
  },

  // ── 6-11 概念（2/6）：PV 跟 PVC 是什麼？ ──
  {
    title: 'PV 跟 PVC 是什麼？',
    subtitle: '兩層設計：管理員 vs 開發者，停車位比喻',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">兩層設計</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/10 min-w-[150px] text-center">
              <p className="text-amber-400 text-sm font-bold mb-1">管理員</p>
              <p className="text-amber-300 text-xs font-semibold">建立 PV</p>
              <p className="text-slate-400 text-xs mt-1">「這裡有 10GB SSD 停車位」</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-cyan-400 text-lg">→</span>
              <p className="text-cyan-400 text-xs font-bold">Binding</p>
              <p className="text-slate-400 text-[10px]">K8s 自動配對</p>
            </div>
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/10 min-w-[150px] text-center">
              <p className="text-green-400 text-sm font-bold mb-1">開發者</p>
              <p className="text-green-300 text-xs font-semibold">建立 PVC</p>
              <p className="text-slate-400 text-xs mt-1">「我要租 5GB 的停車位」</p>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="bg-blue-900/40 border border-blue-500/50 px-4 py-2 rounded-lg text-center">
              <p className="text-blue-400 text-xs font-bold">Pod 拿著租約去停車</p>
              <p className="text-slate-400 text-[10px]">volumes: persistentVolumeClaim</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-40">Docker</th>
                <th className="text-left py-2">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">docker volume create</td>
                <td className="py-2">PersistentVolume (PV)　建立儲存空間</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs">-v mydata:/var/lib/mysql</td>
                <td className="py-2">PersistentVolumeClaim (PVC)　使用儲存空間</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">為什麼要拆成兩層？</p>
          <p className="text-slate-300 text-sm">職責分離。管理員管「公司有幾塊磁碟、在哪裡」，開發者只說「我需要多大空間」，彼此不需要知道對方的細節。</p>
        </div>
      </div>
    ),
    notes: `我用一個生活化的比喻來解釋 PV 和 PVC。

PV 就像停車場裡的停車位。停車場管理員，也就是 K8s 的管理員，負責規劃停車位：這裡有一個 10GB 的位子，那裡有一個 50GB 的位子，這個是 SSD 的高級車位，那個是 HDD 的普通車位。管理員把這些車位劃好，就是建立 PV。

PVC 就像停車位租約。開發者說：「我的 MySQL 需要一個 5GB 的停車位，要能讀寫。」這就是建立 PVC。開發者完全不需要知道底層是 NFS 還是 SSD 還是雲端磁碟，他只要說「我要多大、什麼存取方式」就好。

然後 K8s 自動幫你配對。找到合適的 PV 滿足 PVC 的需求，把它們綁在一起，這個過程叫 Binding。配對成功之後，Pod 就可以透過 PVC 掛載這塊儲存空間了。

對照 Docker 來看就很清楚。docker volume create 就像建立 PV。docker run -v mydata:/var/lib/mysql 就像建立 PVC 並掛載。Docker 把這兩步合在一起了，K8s 把它拆成兩層。

拆成兩層的原因是職責分離。在大公司裡面，管儲存的人跟寫程式的人不是同一個人。基礎架構團隊管 PV，應用開發團隊管 PVC，雙方互不干擾。 [▶ 下一頁]`,
  },

  // ── 6-11 概念（3/6）：AccessMode ──
  {
    title: 'AccessMode 存取模式',
    subtitle: 'RWO / ROX / RWX — 誰能掛、能讀還是能寫',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">三種 AccessMode</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-16">縮寫</th>
                <th className="text-left py-2 w-40">全名</th>
                <th className="text-left py-2">意思</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold text-cyan-400">RWO</td>
                <td className="py-2">ReadWriteOnce</td>
                <td className="py-2">單一 Node 可讀寫（最常用，資料庫用這個）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold text-cyan-400">ROX</td>
                <td className="py-2">ReadOnlyMany</td>
                <td className="py-2">多個 Node 唯讀（靜態檔案共享）</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold text-cyan-400">RWX</td>
                <td className="py-2">ReadWriteMany</td>
                <td className="py-2">多個 Node 讀寫（需要 NFS / AWS EFS）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">hostPath 只支援 RWO</p>
          <p className="text-slate-300 text-sm">今天 Lab 用的 hostPath 是 Node 本機的目錄，只能讓同一個 Node 上的 Pod 掛載，所以只支援 RWO。生產環境如果要 RWX，需要用 NFS 或雲端的共享儲存（如 AWS EFS、Azure Files）。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs font-semibold mb-2">重點提醒</p>
          <p className="text-slate-300 text-sm">PVC 的 accessModes 必須是 PV 支援的模式的子集，才能配對成功。</p>
        </div>
      </div>
    ),
    notes: `PV 有一個很重要的屬性叫 AccessMode，存取模式，決定這塊儲存可以怎麼被掛載。

第一個是 RWO，ReadWriteOnce。同時只能被一個 Node 讀寫。注意是 Node 不是 Pod，同一個 Node 上的多個 Pod 可以同時掛載同一個 RWO 的 PV。資料庫通常用 RWO，MySQL、PostgreSQL 都是，因為資料庫本身負責並發控制，不需要讓多個 Node 同時寫。

第二個是 ROX，ReadOnlyMany。可以被多個 Node 唯讀掛載。適合存放靜態內容，比如說前端的靜態檔案，多個 Node 上的 Pod 都可以讀，但沒有人可以寫。

第三個是 RWX，ReadWriteMany。可以被多個 Node 同時讀寫。但不是所有儲存系統都支援這個模式。今天 Lab 用的 hostPath，就是 Node 本機的目錄，只支援 RWO。如果你需要 RWX，要用 NFS 這類網路共享儲存，或者雲端上的 AWS EFS、Azure Files。

記住一個原則：PVC 設定的 accessModes 必須是 PV 支援的模式才能配對。你的 PV 只有 RWO，但 PVC 要求 RWX，那就配不上，PVC 會一直 Pending。 [▶ 下一頁]`,
  },

  // ── 6-11 概念（4/6）：ReclaimPolicy ──
  {
    title: 'ReclaimPolicy 回收策略',
    subtitle: 'Retain vs Delete — PVC 刪了，資料怎麼處理？',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">兩種 ReclaimPolicy</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">策略</th>
                <th className="text-left py-2">PVC 刪了之後的行為</th>
                <th className="text-left py-2 w-32">適合場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Retain</td>
                <td className="py-2">PV 和資料保留，狀態變 Released，等管理員手動處理</td>
                <td className="py-2">生產環境</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400 font-semibold">Delete</td>
                <td className="py-2">PVC 刪了，PV 和底層磁碟資料一起自動刪除</td>
                <td className="py-2">雲端 / 開發環境</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm mb-1">本課用 Retain</p>
          <p className="text-slate-300 text-sm">學習階段用 Retain，資料不會因為誤刪 PVC 而消失，管理員還有機會找回來。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">退租車位比喻</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold w-16 shrink-0">Retain</span>
              <span>租約（PVC）退了，車位（PV）還在，鑰匙還留著，管理員可以決定要不要重新出租</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold w-16 shrink-0">Delete</span>
              <span>租約退了，車位直接拆掉，重新鋪草皮，什麼都沒了</span>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `ReclaimPolicy 是回收策略，決定 PVC 被刪掉的時候，PV 裡面的資料要怎麼處理。

第一個是 Retain，保留。PVC 刪了，PV 的狀態會從 Bound 變成 Released，但是資料還在。這個時候 PV 不能被其他 PVC 直接使用，需要管理員手動去確認資料沒問題之後，才能清理或重新綁定。生產環境通常用 Retain，因為資料是公司最重要的資產，不能因為某個人不小心刪了 PVC 就把資料庫資料一起刪掉。

第二個是 Delete，刪除。PVC 刪了，PV 跟著刪，底層的磁碟資料也一起清掉。雲端環境常用這個，比如 AWS 的 EBS 磁碟，PVC 刪了對應的 EBS Volume 也自動刪掉，不用付額外的磁碟費用。開發環境也會用，因為開發環境的資料本來就可以重建。

用退租車位來想：Retain 就是你退租了，車位還在，管理員可以決定接下來要怎麼用。Delete 就是你退租了，車位直接拆掉，寸草不留。

今天 Lab 我們用 Retain。因為我們是學習環境，Retain 更安全，就算你不小心刪了 PVC，資料還在，我們還有機會處理。 [▶ 下一頁]`,
  },

  // ── 6-11 概念（5/6）：靜態佈建流程 ──
  {
    title: '靜態佈建流程',
    subtitle: '管理員建 PV → 開發者建 PVC → 自動 Binding → Pod 掛載',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-4 text-center">靜態佈建流程</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
              <div className="bg-amber-900/20 border border-amber-500/30 px-3 py-2 rounded flex-1">
                <p className="text-amber-300 text-sm font-semibold">管理員建立 PV</p>
                <p className="text-slate-400 text-xs font-mono">kind: PersistentVolume　2Gi，RWO，hostPath</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <span className="text-slate-500 text-lg">↓</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
              <div className="bg-green-900/20 border border-green-500/30 px-3 py-2 rounded flex-1">
                <p className="text-green-300 text-sm font-semibold">開發者建立 PVC</p>
                <p className="text-slate-400 text-xs font-mono">kind: PersistentVolumeClaim　1Gi，RWO，storageClassName: manual</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <span className="text-slate-500 text-lg">↓</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
              <div className="bg-cyan-900/20 border border-cyan-500/30 px-3 py-2 rounded flex-1">
                <p className="text-cyan-300 text-sm font-semibold">K8s 自動 Binding</p>
                <p className="text-slate-400 text-xs">storageClassName 一致 + accessModes 符合 + 容量夠 → STATUS: Bound</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <span className="text-slate-500 text-lg">↓</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">4</div>
              <div className="bg-blue-900/20 border border-blue-500/30 px-3 py-2 rounded flex-1">
                <p className="text-blue-300 text-sm font-semibold">Pod 掛載 PVC</p>
                <p className="text-slate-400 text-xs font-mono">volumes: persistentVolumeClaim: claimName: local-pvc</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <span className="text-slate-500 text-lg">↓</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">5</div>
              <div className="bg-purple-900/20 border border-purple-500/30 px-3 py-2 rounded flex-1">
                <p className="text-purple-300 text-sm font-semibold">資料跟著 PV 走</p>
                <p className="text-slate-400 text-xs">Pod 刪了重建，掛同一個 PVC → 資料還在</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `靜態佈建的流程我再整理一遍，讓大家在動手之前先在腦袋裡跑過一遍。

第一步，管理員建立 PV。我們今天的 PV 叫 local-pv，2GB 的空間，ReadWriteOnce，用 hostPath 指到 Node 本機的 /tmp/k8s-pv-data 這個目錄，storageClassName 是 manual。

第二步，開發者建立 PVC。我們的 PVC 叫 local-pvc，申請 1GB，ReadWriteOnce，storageClassName 也是 manual。

第三步，K8s 自動 Binding。K8s 看到 PVC 建立了，去找有沒有合適的 PV：storageClassName 一樣嗎？accessModes 符合嗎？PV 的容量夠嗎？三個條件都滿足，就把 local-pv 和 local-pvc 綁在一起，兩個的狀態都變成 Bound。

第四步，Pod 掛載 PVC。Deployment 的 YAML 裡面，volumes 那裡引用 local-pvc，volumeMounts 把它掛到 /var/lib/mysql。這樣 MySQL 寫到 /var/lib/mysql 的資料就存到 PV 裡面了。

第五步，資料跟著 PV 走。Pod 刪了，新的 Pod 起來，掛同一個 PVC，讀到同一個 PV，資料還在。Pod 的生死跟資料再也沒有關係了。

好，概念講完了，下一節我們直接來做。 [▶ 下一頁]`,
  },

  // ── 6-11 概念（6/6）：今天要做的事 ──
  {
    title: '今天要做的事',
    subtitle: '一個 YAML 建 PV + PVC + MySQL，驗證資料在 Pod 重建後還在',
    section: '6-11：PV + PVC 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Lab 目標</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">①</span>
              <p>用一個 YAML 同時建立 PV、PVC、MySQL Deployment（含 PVC 掛載）</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">②</span>
              <p>確認 PV 和 PVC 都是 <strong className="text-green-400">Bound</strong> 狀態</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">③</span>
              <p>進 MySQL 建 testdb，插入 Alice</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">④</span>
              <p>砍 Pod，等新 Pod 起來</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold shrink-0">⑤</span>
              <p>再進 MySQL，SELECT → <strong className="text-green-400">Alice 還在！</strong></p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">關鍵 YAML 結構</p>
          <div className="font-mono text-xs text-slate-400 space-y-1">
            <p><span className="text-yellow-400">pv-pvc.yaml</span>  包含三個 K8s 物件</p>
            <p className="ml-4">── PersistentVolume <span className="text-slate-500">（local-pv，2Gi，hostPath）</span></p>
            <p className="ml-4">── PersistentVolumeClaim <span className="text-slate-500">（local-pvc，1Gi）</span></p>
            <p className="ml-4">── Deployment <span className="text-slate-500">（mysql，掛 local-pvc 到 /var/lib/mysql）</span></p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">驗收標準</p>
          <p className="text-slate-300 text-sm mt-1">砍 Pod 之後重新查詢，Alice 還在 → PV/PVC 設定正確。</p>
        </div>
      </div>
    ),
    notes: `好，今天 6-11 和 6-12 要做的事情我先講清楚。

我們會用一個叫 pv-pvc.yaml 的檔案，裡面一次定義三個 K8s 物件：PV、PVC、還有 MySQL Deployment。一個 YAML 搞定全部。

部署之後，先用 kubectl get pv 和 kubectl get pvc 確認兩個都是 Bound 狀態。Bound 表示配對成功，資料存到 PV 了。

然後進 MySQL，建 testdb 資料庫，建一張 users 表，插入 Alice 這筆資料，查一下確認 Alice 在。

接著砍 Pod，kubectl delete pod -l app=mysql。Deployment 會自動重建一個新的 Pod。

等新 Pod 跑起來，再進 MySQL，USE testdb，SELECT * FROM users。

如果你看到 Alice，恭喜，PV/PVC 設定成功。資料不再活在容器裡了，而是活在 PV 裡面，Pod 怎麼死都不怕。

這個驗收標準很直觀：砍 Pod 之後 Alice 還在，就是成功。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（1/7）：靜態佈建流程圖（實作開場）──
  {
    title: '靜態佈建流程（複習）',
    subtitle: '動手前再看一眼流程',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-4 text-center">靜態佈建流程</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
              <div className="bg-amber-900/20 border border-amber-500/30 px-3 py-2 rounded flex-1">
                <p className="text-amber-300 text-sm font-semibold">管理員建立 PV</p>
              </div>
            </div>
            <div className="pl-6"><span className="text-slate-500">↓</span></div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
              <div className="bg-green-900/20 border border-green-500/30 px-3 py-2 rounded flex-1">
                <p className="text-green-300 text-sm font-semibold">開發者建立 PVC</p>
              </div>
            </div>
            <div className="pl-6"><span className="text-slate-500">↓</span></div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">3</div>
              <div className="bg-cyan-900/20 border border-cyan-500/30 px-3 py-2 rounded flex-1">
                <p className="text-cyan-300 text-sm font-semibold">K8s 自動 Binding → STATUS: Bound</p>
              </div>
            </div>
            <div className="pl-6"><span className="text-slate-500">↓</span></div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">4</div>
              <div className="bg-blue-900/20 border border-blue-500/30 px-3 py-2 rounded flex-1">
                <p className="text-blue-300 text-sm font-semibold">Pod 掛載 PVC</p>
              </div>
            </div>
            <div className="pl-6"><span className="text-slate-500">↓</span></div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0">5</div>
              <div className="bg-purple-900/20 border border-purple-500/30 px-3 py-2 rounded flex-1">
                <p className="text-purple-300 text-sm font-semibold">資料跟著 PV 走，Pod 怎麼死都不怕</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold text-sm">現在開始動手</p>
          <p className="text-slate-300 text-sm mt-1">接下來逐步執行這個流程，最後砍 Pod 確認資料還在。</p>
        </div>
      </div>
    ),
    notes: `好，概念都看過了，現在來動手。

大家先確認叢集還在跑：kubectl get nodes，兩個 Node 都是 Ready 就可以了。

我們這次用一個叫 pv-pvc.yaml 的檔案，裡面包含 PV、PVC 和 MySQL Deployment 三個物件，一次 apply 搞定。

流程就是我們在 6-11 講的那五步：PV → PVC → Binding → Pod 掛載 → 資料跟著走。

下一張開始看 YAML 長什麼樣子。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（2/7）：實作步驟清單 ──
  {
    title: '實作步驟',
    subtitle: '5 個步驟跑完，Alice 還在就成功',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">5 個步驟</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">1</div>
              <div>
                <p className="text-slate-200 text-sm font-semibold">套用 YAML</p>
                <p className="font-mono text-xs text-green-400">kubectl apply -f pv-pvc.yaml</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">2</div>
              <div>
                <p className="text-slate-200 text-sm font-semibold">確認 Bound 狀態</p>
                <p className="font-mono text-xs text-green-400">kubectl get pv && kubectl get pvc</p>
                <p className="text-slate-400 text-xs mt-0.5">PV 和 PVC 的 STATUS 都要是 Bound</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">3</div>
              <div>
                <p className="text-slate-200 text-sm font-semibold">進 MySQL 寫資料</p>
                <p className="text-slate-400 text-xs">CREATE DATABASE testdb → INSERT Alice → SELECT 確認</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">4</div>
              <div>
                <p className="text-slate-200 text-sm font-semibold">砍 Pod</p>
                <p className="font-mono text-xs text-green-400">kubectl delete pod -l app=mysql</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">5</div>
              <div>
                <p className="text-slate-200 text-sm font-semibold">驗資料還在</p>
                <p className="text-slate-400 text-xs">等新 Pod 起來 → 進 MySQL → SELECT → Alice 還在！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `這是今天實作的五個步驟，大家照這個順序跑。

第一步，kubectl apply -f pv-pvc.yaml，一次建立 PV、PVC 和 MySQL Deployment。

第二步，kubectl get pv 和 kubectl get pvc，確認兩個都是 Bound。如果有任何一個是 Pending，先不要繼續，排查配對問題。

第三步，進 MySQL 寫資料。建 testdb，建 users 表，插入 Alice，SELECT 確認。

第四步，kubectl delete pod -l app=mysql，砍 Pod。Deployment 會自動重建。

第五步，等新 Pod 起來，再進 MySQL，SELECT，Alice 還在就是成功。

每一步我都會帶著大家做，下面先看 YAML。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（3/7）：完整 pv-pvc.yaml YAML 說明 ──
  {
    title: 'pv-pvc.yaml 完整說明',
    subtitle: 'PV 2Gi + PVC 1Gi + MySQL Deployment',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">PV 關鍵設定</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold w-44">capacity.storage</td>
                <td className="py-2">2Gi（PV 的實際大小）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">storageClassName</td>
                <td className="py-2 font-mono text-xs">manual（PVC 也要一樣才能配對）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">hostPath.path</td>
                <td className="py-2 font-mono text-xs">/tmp/k8s-pv-data（Node 本機目錄）</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-cyan-400 font-semibold">reclaimPolicy</td>
                <td className="py-2">Retain（PVC 刪了資料保留）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">PVC 關鍵設定</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold w-44">requests.storage</td>
                <td className="py-2">1Gi（申請量，PV 有 2Gi，夠用就配對）</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-cyan-400 font-semibold">storageClassName</td>
                <td className="py-2 font-mono text-xs">manual（跟 PV 完全一致）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">MySQL Deployment 掛載 PVC</p>
          <div className="font-mono text-xs text-slate-400 space-y-1">
            <p><span className="text-yellow-400">volumes:</span></p>
            <p className="ml-4">- name: mysql-storage</p>
            <p className="ml-6">persistentVolumeClaim:</p>
            <p className="ml-8 text-green-400">claimName: local-pvc</p>
            <p className="mt-2"><span className="text-yellow-400">volumeMounts:</span></p>
            <p className="ml-4">- name: mysql-storage</p>
            <p className="ml-6 text-green-400">mountPath: /var/lib/mysql</p>
          </div>
        </div>
      </div>
    ),
    code: `# pv-pvc.yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-pv
spec:
  capacity:
    storage: 2Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /tmp/k8s-pv-data
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: local-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: manual
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deploy
spec:
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
          envFrom:
            - secretRef:
                name: mysql-sts-secret
          volumeMounts:
            - name: mysql-storage
              mountPath: /var/lib/mysql
      volumes:
        - name: mysql-storage
          persistentVolumeClaim:
            claimName: local-pvc`,
    notes: `現在來看 YAML。

PV 的部分。kind 是 PersistentVolume，name 叫 local-pv。spec 裡面幾個重點。capacity.storage 是 2Gi，這是這塊 PV 實際的大小。storageClassName 是 manual，等一下 PVC 要填一樣的名字。hostPath.path 是 /tmp/k8s-pv-data，就是用 Node 本機的這個目錄當儲存空間，學習環境用，生產不會這樣做。persistentVolumeReclaimPolicy 是 Retain，PVC 刪了資料還在。

PVC 的部分。kind 是 PersistentVolumeClaim，name 叫 local-pvc。requests.storage 是 1Gi，表示我申請 1GB 的空間。storageClassName 是 manual，跟 PV 完全一樣，這樣 K8s 才能配對。

Deployment 的部分。跟之前的 MySQL Deployment 幾乎一樣，多了 volumes 和 volumeMounts。volumes 裡面有一個 name 叫 mysql-storage，persistentVolumeClaim 的 claimName 是 local-pvc。volumeMounts 把 mysql-storage 掛到 /var/lib/mysql。這樣 MySQL 寫到 /var/lib/mysql 的所有資料就存到 PV 裡面了，不再存在容器的 overlay filesystem。

三個物件用 --- 分隔，一個 apply 全搞定。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（4/7）：確認指令 ──
  {
    title: '確認 PV / PVC 狀態',
    subtitle: 'kubectl get pv / pvc 預期輸出',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">確認指令</p>
          <div className="space-y-2">
            <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl apply -f pv-pvc.yaml</div>
            <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl get pv</div>
            <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl get pvc</div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-600/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs font-semibold mb-2">預期輸出：kubectl get pv</p>
          <pre className="text-green-400 text-xs font-mono leading-relaxed">{`NAME       CAPACITY  ACCESS MODES  RECLAIM POLICY  STATUS  CLAIM
local-pv   2Gi       RWO           Retain          Bound   default/local-pvc`}</pre>
        </div>

        <div className="bg-slate-800/30 border border-slate-600/50 p-3 rounded-lg">
          <p className="text-slate-400 text-xs font-semibold mb-2">預期輸出：kubectl get pvc</p>
          <pre className="text-green-400 text-xs font-mono leading-relaxed">{`NAME        STATUS  VOLUME    CAPACITY  ACCESS MODES
local-pvc   Bound   local-pv  2Gi       RWO`}</pre>
          <p className="text-slate-500 text-xs mt-1">PVC 顯示的 CAPACITY 是 PV 的大小（2Gi），不是你申請的 1Gi</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 text-xs font-semibold mb-1">等 MySQL Pod 就緒</p>
          <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl get pods -w</div>
          <p className="text-slate-400 text-xs mt-1">等 STATUS 變成 Running 再繼續</p>
        </div>
      </div>
    ),
    notes: `好，apply 之後馬上來確認。

kubectl apply -f pv-pvc.yaml

然後 kubectl get pv。你應該看到 local-pv，STATUS 是 Bound，CLAIM 欄位顯示 default/local-pvc，表示 PV 已經被 local-pvc 這個 PVC 佔用了。

kubectl get pvc。local-pvc，STATUS 也是 Bound，VOLUME 欄位顯示 local-pv。

注意一個細節，PVC 那一行的 CAPACITY 顯示的是 2Gi，不是你申請的 1Gi。這是 K8s 的設計，PVC 拿到整個 PV，顯示的是 PV 的容量。

如果 STATUS 是 Pending，表示配對失敗了。最常見的原因是 storageClassName 不一致，或者 PV 的容量比 PVC 要求的少。

等 PV 和 PVC 都是 Bound 之後，再等 MySQL Pod 跑起來。

kubectl get pods -w

看到 mysql-deploy 的 Pod STATUS 是 Running，就可以繼續。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（5/7）：進 MySQL 寫資料 + 砍 Pod ──
  {
    title: '進 MySQL 寫資料，砍 Pod',
    subtitle: 'INSERT Alice → DELETE Pod',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">進 MySQL 寫資料</p>
          <div className="font-mono text-xs text-slate-400 bg-slate-900 p-3 rounded space-y-0.5">
            <p className="text-green-400">kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123</p>
            <p className="mt-1">mysql&gt; CREATE DATABASE testdb;</p>
            <p>mysql&gt; USE testdb;</p>
            <p>mysql&gt; CREATE TABLE users (id INT, name VARCHAR(50));</p>
            <p>mysql&gt; INSERT INTO users VALUES (1, 'Alice');</p>
            <p>mysql&gt; SELECT * FROM users;</p>
            <p className="text-green-400 mt-1">-- 看到 Alice → 寫入成功</p>
            <p>mysql&gt; exit</p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">砍 Pod</p>
          <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl delete pod -l app=mysql</div>
          <p className="text-slate-300 text-xs mt-2">Deployment 會自動重建一個新的 Pod，等它跑起來。</p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 text-xs font-semibold mb-1">等新 Pod 就緒</p>
          <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl get pods -w</div>
          <p className="text-slate-400 text-xs mt-1">STATUS 變成 Running 後進行下一步驗證</p>
        </div>
      </div>
    ),
    notes: `MySQL Pod 跑起來之後，進 MySQL。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123

進去之後，CREATE DATABASE testdb; USE testdb; CREATE TABLE users (id INT, name VARCHAR(50)); INSERT INTO users VALUES (1, 'Alice');

SELECT * FROM users，看到 Alice。好，資料寫進去了。exit 退出。

現在來做最關鍵的一步，砍 Pod。

kubectl delete pod -l app=mysql

Pod 被刪了。Deployment 看到 Pod 不見了，馬上重建一個新的。這個新的 Pod 跟剛才那個 Pod 不是同一個，完全是一個全新的容器。

等新 Pod 跑起來。kubectl get pods -w，看到 STATUS 是 Running 就可以了。

好，現在進新的 Pod，看看 Alice 還在不在。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（6/7）：驗證資料還在 ──
  {
    title: '驗證資料還在',
    subtitle: '新 Pod 起來，Alice 還在！',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">再進 MySQL 確認</p>
          <div className="font-mono text-xs text-slate-400 bg-slate-900 p-3 rounded space-y-0.5">
            <p className="text-green-400">kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123</p>
            <p className="mt-1">mysql&gt; USE testdb;</p>
            <p>mysql&gt; SELECT * FROM users;</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">預期輸出</p>
          <pre className="text-green-400 text-xs font-mono">{`+----+-------+
| id | name  |
+----+-------+
|  1 | Alice |
+----+-------+
1 row in set`}</pre>
          <p className="text-green-300 font-semibold mt-2">Alice 還在！PV/PVC 設定成功！</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼資料還在？</p>
          <p className="text-slate-300 text-sm">MySQL 的資料存在 <span className="font-mono text-yellow-400">/var/lib/mysql</span>，這個目錄掛到 PVC，PVC 對應 PV，PV 對應 Node 上的 <span className="font-mono text-yellow-400">/tmp/k8s-pv-data</span>。Pod 刪了，目錄還在。新 Pod 掛同一個 PVC，讀到同一個目錄，資料自然還在。</p>
        </div>
      </div>
    ),
    notes: `進新的 Pod。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123

USE testdb;

這次不是 ERROR 了。SELECT * FROM users;

Alice 還在！

大家仔細感受一下這個差別。沒掛 PVC 的時候，砍 Pod 資料全消失，USE testdb 直接 ERROR。現在掛了 PVC，砍 Pod，Alice 還活著。

為什麼？因為 MySQL 的資料不再存在容器的 overlay filesystem 裡面了。/var/lib/mysql 這個目錄掛到 PVC，PVC 綁到 PV，PV 對應 Node 上的 /tmp/k8s-pv-data 這個實體目錄。Pod 被刪了，但 /tmp/k8s-pv-data 這個目錄還在 Node 上。新的 Pod 起來，掛同一個 PVC，讀到同一個實體目錄，資料自然還在。

這就是 PV/PVC 存在的意義。Docker 的 -v 做的是完全一樣的事，只是 K8s 把它拆成 PV 和 PVC 兩層。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（7/7）：排錯 ──
  {
    title: 'PVC Pending 排錯',
    subtitle: 'kubectl describe pvc local-pvc — 三個常見原因',
    section: '6-12：PV + PVC 實作',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">排錯指令</p>
          <div className="font-mono text-xs text-green-400 bg-slate-900 p-2 rounded">kubectl describe pvc local-pvc</div>
          <p className="text-slate-400 text-xs mt-2">看 Events 欄位，會告訴你為什麼配對失敗。</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">三個常見 Pending 原因</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-3 text-red-400 font-semibold w-40">storageClassName 不一致</td>
                <td className="py-2">PV 和 PVC 的 storageClassName 要完全相同，包括大小寫</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-3 text-red-400 font-semibold">容量超過</td>
                <td className="py-2">PVC 申請 5Gi 但 PV 只有 2Gi，找不到合適的 PV</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-red-400 font-semibold">accessModes 不匹配</td>
                <td className="py-2">PVC 要 RWX 但 PV 只支援 RWO，無法配對</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">配對成功的三個條件</p>
          <p className="text-slate-300 text-sm mt-1">storageClassName 一致 + accessModes 符合 + PV 容量 &ge; PVC 申請量</p>
        </div>
      </div>
    ),
    notes: `最後講一個排錯技巧。如果你的 PVC 一直是 Pending，表示 K8s 找不到合適的 PV 來配對。

診斷指令是 kubectl describe pvc local-pvc。看 Events 欄位，K8s 會告訴你找不到匹配 PV 的原因。

三個最常見的 Pending 原因：

第一，storageClassName 不一致。PV 寫了 storageClassName: manual，但 PVC 寫了 storageClassName: Manual，M 大寫，就配不上了。要完全相同，包括大小寫。

第二，容量超過。PVC 申請 5Gi，但你的 PV 只有 2Gi，K8s 找不到夠大的 PV，所以 PVC 一直 Pending。

第三，accessModes 不匹配。PVC 要求 RWX，但 PV 只支援 RWO，不符合，配對失敗。

記住配對成功的三個條件：storageClassName 完全一致、accessModes 符合、PV 的容量大於等於 PVC 的申請量。三個條件都滿足，Binding 就會成功。

好，PV/PVC 的概念和實作到這裡結束。下一節是學員實作時間。 [▶ 下一頁]`,
  },


  // ── 6-13 學員實作 ──
  {
    title: '學員實作：PV + PVC 故障診斷',
    subtitle: 'Loop 4 練習題 — 找出 broken-pv-pvc.yaml 的三個 bug',
    section: '6-13：回頭操作 Loop 4',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">必做：故障診斷題</p>
          <p className="text-slate-300 text-sm mb-2">以下 YAML 有三個錯誤，找出來並修好，讓 PostgreSQL 正常啟動並持久化資料</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-0.5">
            <p><span className="text-slate-500">accessModes:</span></p>
            <p className="text-red-400">{'  - ReadWriteMany        # 錯誤一'}</p>
            <p><span className="text-slate-500">storageClassName:</span> <span className="text-red-400">fast   # 錯誤二</span></p>
            <p><span className="text-slate-500">storage:</span> <span className="text-red-400">2Gi    # 錯誤三（超過 PV 容量）</span></p>
          </div>
          <p className="text-slate-400 text-xs mt-2">題目 YAML 只有 PV + PVC，需要自己再加 PostgreSQL Deployment 掛 pg-pvc</p>
          <p className="text-slate-400 text-xs">修好後：kubectl get pv,pvc → 兩個都是 Bound</p>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">挑戰題</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>local-pv 已被 local-pvc 綁定的情況下，再建 local-pvc2（1Gi）</li>
            <li><code className="text-yellow-300">kubectl get pvc</code> 看 local-pvc2 的 STATUS</li>
            <li>說明：為什麼是這個狀態？</li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：打開 broken-pv-pvc.yaml，這個 YAML 有三個錯誤，你要找出來並修好，讓 PostgreSQL 可以正常啟動並持久化資料。線索在 YAML 裡，仔細看 accessModes、storageClassName、還有容量。修好之後 kubectl apply，然後 kubectl get pv,pvc，兩個都要是 Bound 才算成功。挑戰題：在 local-pv 已經被 local-pvc 綁定的情況下，再建一個 local-pvc2，requests 1Gi。觀察 kubectl get pvc，local-pvc2 的 STATUS 是什麼，說明為什麼。大家動手做，有問題舉手。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-13 學員實作解答 ──
  {
    title: '解答：PV/PVC 故障診斷 + 常見坑',
    subtitle: '回頭操作 Loop 4',
    section: '6-13：回頭操作 Loop 4',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">故障診斷題解答（broken-pv-pvc.yaml 的三個 bug）</p>
          <div className="font-mono text-xs bg-slate-900 p-3 rounded space-y-1 text-slate-300">
            <p className="text-slate-500"># 錯誤一：accessModes 不匹配</p>
            <p><span className="text-red-400">accessModes: [ReadWriteMany]</span>  <span className="text-slate-500">→</span>  <span className="text-green-400">ReadWriteOnce</span></p>
            <p className="text-slate-500 mt-1"># 錯誤二：storageClassName 不一致</p>
            <p><span className="text-red-400">storageClassName: fast</span>  <span className="text-slate-500">→</span>  <span className="text-green-400">manual</span></p>
            <p className="text-slate-500 mt-1"># 錯誤三：容量超過 PV</p>
            <p><span className="text-red-400">storage: 2Gi（PV 只有 1Gi）</span>  <span className="text-slate-500">→</span>  <span className="text-green-400">1Gi</span></p>
          </div>
          <p className="text-slate-400 text-xs mt-2">修好後 kubectl apply -f answers/broken-pv-pvc-fixed.yaml → kubectl get pv,pvc 兩個都 Bound</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">重要：storageClassName 是 immutable（不可修改）</p>
          <p className="text-slate-300 text-sm">建立後無法用 kubectl apply 修改 storageClassName，K8s 會拒絕。</p>
          <p className="text-slate-300 text-sm mt-1">必須先刪除再重建：</p>
          <div className="font-mono text-xs bg-slate-900 p-2 rounded mt-2 space-y-0.5 text-slate-300">
            <p><span className="text-yellow-400">kubectl delete pvc local-pvc</span></p>
            <p><span className="text-yellow-400">kubectl delete pv local-pv</span></p>
            <p><span className="text-slate-500"># 然後 apply 修好的 YAML</span></p>
          </div>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">挑戰題解答：local-pvc2 為何 Pending？</p>
          <p className="text-slate-300 text-sm">一個 PV 同時只能綁一個 PVC。local-pv 已被 local-pvc 佔用，local-pvc2 找不到可用 PV，只能等待。</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">清理指令（做完再清）</p>
          <div className="font-mono text-xs bg-slate-900 p-2 rounded space-y-0.5 text-slate-300">
            <p><span className="text-red-400">kubectl delete deployment mysql-deploy</span></p>
            <p><span className="text-red-400">kubectl delete pvc local-pvc</span></p>
            <p><span className="text-red-400">kubectl delete pv local-pv</span></p>
            <p className="text-slate-500 mt-1"># 確認全清除</p>
            <p>kubectl get pv,pvc</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">銜接下一個 Loop</p>
          <p className="text-slate-300 text-xs mt-1">10 個微服務就要手動建 10 個 PV？太煩了 → StorageClass 自動建 PV</p>
        </div>
      </div>
    ),
    notes: `好，時間差不多了，我們來回頭確認一下大家都做到了。

如果你的 PV 和 PVC 已經建好了，kubectl get pv,pvc 看一下，兩個都是 Bound 就對了。

三個 bug 的解答。第一，accessModes 要從 ReadWriteMany 改成 ReadWriteOnce，跟 PV 一致。第二，storageClassName 要從 fast 改成 manual。第三，storage 從 2Gi 改成 1Gi，不能超過 PV 容量。

這裡有個重要觀念要記：storageClassName 是 immutable，建立後不能改。如果你 kubectl apply 想修改它，K8s 直接拒絕。正確做法是先 kubectl delete pvc local-pvc，再 kubectl delete pv local-pv，然後重新 apply 修好的 YAML。

挑戰題：local-pvc2 應該是 Pending 狀態。原因是一個 PV 同時只能綁一個 PVC。local-pv 已經被 local-pvc 佔走了，local-pvc2 找不到可用的 PV，只能等待。

做完之後大家把環境清一下。kubectl delete deployment mysql-deploy，kubectl delete pvc local-pvc，kubectl delete pv local-pv。然後 kubectl get pv,pvc 確認全部清掉。

好，如果我有十個微服務，每個都要 PVC，管理員要手動建十個 PV？太煩了。下一個 Loop 我們學 StorageClass，讓它自動建 PV。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 5：StorageClass + StatefulSet（6-14, 6-15, 6-16）
  // ============================================================

  // ── 6-14 概念（1/6）：靜態佈建的問題 ──
  {
    title: '靜態佈建的問題',
    subtitle: '手動建 PV 的痛點',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">靜態佈建的三個痛點</p>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">1.</span>
              <div>
                <p className="font-semibold text-white">手動管理，量大就累</p>
                <p className="text-slate-400 text-xs mt-0.5">10 個微服務就要手動建 10 個 PV，50 個微服務呢？管理員每天的工作就是建 PV</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">2.</span>
              <div>
                <p className="font-semibold text-white">大小猜錯要重建</p>
                <p className="text-slate-400 text-xs mt-0.5">PV 建 5Gi，結果用了 8Gi；建 20Gi，結果只用 2Gi。大小錯了就要刪掉重建</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">3.</span>
              <div>
                <p className="font-semibold text-white">要先建好才能用</p>
                <p className="text-slate-400 text-xs mt-0.5">開發者建 PVC 前，管理員必須先建好對應的 PV，有時序依賴問題</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">靜態佈建流程回顧</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-center">
              <p className="text-slate-300 text-xs font-semibold">管理員</p>
              <p className="text-slate-400 text-[10px]">手動建 PV</p>
            </div>
            <span className="text-slate-400 font-bold">→</span>
            <div className="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-center">
              <p className="text-slate-300 text-xs font-semibold">開發者</p>
              <p className="text-slate-400 text-[10px]">建 PVC</p>
            </div>
            <span className="text-slate-400 font-bold">→</span>
            <div className="bg-slate-700/60 border border-slate-600 px-3 py-2 rounded-lg text-center">
              <p className="text-slate-300 text-xs font-semibold">K8s</p>
              <p className="text-slate-400 text-[10px]">配對 PV+PVC</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-3">問題：PV 要事先存在，大小和 storageClassName 都要完全匹配</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">有沒有辦法讓 K8s 自動建 PV？</p>
          <p className="text-slate-300 text-xs mt-1">有 → 動態佈建（Dynamic Provisioning）+ StorageClass</p>
        </div>
      </div>
    ),
    notes: `上一個 Loop 我們用靜態佈建解決了持久化的問題。管理員先建 PV，開發者建 PVC，K8s 把兩個配對起來。但這個方式有三個痛點。

第一，手動管理量大就累。你的環境只有一個 MySQL，建一個 PV 還好。但如果你有十個微服務，每個都需要獨立的 PV，管理員就要手動建十個。公司規模再大，五十個微服務，一百個 PV，全部手動建，很不現實。

第二，大小猜錯要重建。建 PV 的時候你要預估容量。建 5Gi，結果應用長大需要 8Gi；建 20Gi，結果只用 2Gi 浪費空間。預估錯了就要刪掉 PVC 和 PV 重建，很麻煩。

第三，要先建好才能用。開發者想建 PVC，前提是管理員已經建好對應的 PV。這有時序依賴問題，開發者不能自主部署。

所以有沒有辦法讓 K8s 自動幫我們建 PV？有，這就是動態佈建，靠 StorageClass 來做。 [▶ 下一頁]`,
  },

  // ── 6-14 概念（2/6）：動態佈建（Dynamic Provisioning） ──
  {
    title: '動態佈建（Dynamic Provisioning）',
    subtitle: 'PVC → StorageClass → provisioner → 自動建 PV',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">動態佈建流程</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-green-400 text-xs font-bold">① PVC 請求</p>
              <p className="text-slate-400 text-[10px]">「我要 1Gi」</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20 text-center">
              <p className="text-cyan-400 text-xs font-bold">② StorageClass</p>
              <p className="text-slate-400 text-[10px]">選 provisioner</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="bg-purple-900/40 border border-purple-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-purple-400 text-xs font-bold">③ provisioner</p>
              <p className="text-slate-400 text-[10px]">呼叫 API 建磁碟</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg text-center">
              <p className="text-amber-400 text-xs font-bold">④ 自動建 PV</p>
              <p className="text-slate-400 text-[10px]">自動綁定</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center mt-3">管理員不用動手，PVC 一建立就自動搞定</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">各雲端 provisioner 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1.5 font-semibold">環境</th>
                <th className="text-left py-1.5 font-semibold">provisioner</th>
                <th className="text-left py-1.5 font-semibold">建立的磁碟</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 text-xs">
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-green-400">k3s（本課程）</td>
                <td className="py-1.5 font-mono">rancher.io/local-path</td>
                <td className="py-1.5">本機路徑</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-orange-400">AWS</td>
                <td className="py-1.5 font-mono">ebs.csi.aws.com</td>
                <td className="py-1.5">EBS 磁碟</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-blue-400">GCP</td>
                <td className="py-1.5 font-mono">pd.csi.storage.gke.io</td>
                <td className="py-1.5">Persistent Disk</td>
              </tr>
              <tr>
                <td className="py-1.5 font-semibold text-cyan-400">Azure</td>
                <td className="py-1.5 font-mono">disk.csi.azure.com</td>
                <td className="py-1.5">Azure Disk</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm mb-1">k3s 已內建 local-path StorageClass（default）</p>
          <p className="text-slate-300 text-xs">不同雲端換個 provisioner，用法完全一樣：開發者建 PVC，StorageClass 自動搞定 PV</p>
        </div>
      </div>
    ),
    code: `# 查看 k3s 內建的 StorageClass
kubectl get storageclass
# NAME                   PROVISIONER                RECLAIMPOLICY
# local-path (default)   rancher.io/local-path      Delete

# 動態佈建的 PVC（不用事先建 PV！）
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: local-path   # 指定 StorageClass

# apply 之後 K8s 自動建 PV 並綁定
kubectl get pv,pvc
# PV 自動出現，STATUS 都是 Bound`,
    notes: `動態佈建的流程是這樣的。第一步，開發者建 PVC，在 storageClassName 指定要用哪個 StorageClass。第二步，K8s 根據 StorageClass 找到對應的 provisioner。第三步，provisioner 呼叫底層 API 建立實體磁碟。第四步，K8s 自動建立 PV，並把 PV 和 PVC 綁定。整個過程管理員完全不用動手。

不同的環境有不同的 provisioner。我們課程用的 k3s，內建一個叫 local-path 的 StorageClass，provisioner 是 rancher.io/local-path，它在本機路徑上建立 PV。AWS 上面的 provisioner 是 ebs.csi.aws.com，它會自動去建 EBS 磁碟。GCP 是 pd.csi.storage.gke.io，建 Persistent Disk。Azure 是 disk.csi.azure.com，建 Azure Disk。

不管是哪個雲端，你身為開發者的用法都一樣：建 PVC，指定 storageClassName，剩下的交給 StorageClass。換環境只要換 storageClassName 的值，YAML 其他部分不用改。

你可以用 kubectl get storageclass 看一下 k3s 有沒有 local-path，後面標了 default 的就是預設 StorageClass。 [▶ 下一頁]`,
  },

  // ── 6-14 概念（3/6）：Deployment 跑 DB 的四個問題 ──
  {
    title: 'Deployment 跑 DB 的四個問題',
    subtitle: '無狀態 vs 有狀態',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">Deployment 跑 MySQL 的四個問題</p>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">1.</span>
              <div>
                <p className="font-semibold text-white">Pod 名稱不固定（random hash）</p>
                <p className="text-slate-400 text-xs mt-0.5">mysql-deploy-<span className="text-red-400">abc-xyz</span>，重建後名字又變。主庫是哪個？</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">2.</span>
              <div>
                <p className="font-semibold text-white">沒有啟動順序</p>
                <p className="text-slate-400 text-xs mt-0.5">3 副本同時起。MySQL 主從架構需要主庫先起來，從庫才能同步</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">3.</span>
              <div>
                <p className="font-semibold text-white">共用 PVC</p>
                <p className="text-slate-400 text-xs mt-0.5">3 個 MySQL 寫同一塊磁碟，資料衝突，資料庫損毀</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-red-400 font-bold text-lg leading-none mt-0.5">4.</span>
              <div>
                <p className="font-semibold text-white">沒有穩定網路身份</p>
                <p className="text-slate-400 text-xs mt-0.5">Service 隨機分配流量。寫入要送主庫，讀取送從庫，怎麼區分？</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">根本原因</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700/50 p-3 rounded">
              <p className="text-white font-semibold mb-1">Deployment</p>
              <p className="text-slate-400 text-xs">設計給「無狀態」應用</p>
              <p className="text-slate-400 text-xs mt-1">API、Web Server：任何一個副本都能回應，沒差</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
              <p className="text-green-400 font-semibold mb-1">StatefulSet</p>
              <p className="text-slate-400 text-xs">設計給「有狀態」應用</p>
              <p className="text-slate-400 text-xs mt-1">MySQL、Redis：每個副本的資料不同，身份很重要</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">StatefulSet 是 K8s 專門為有狀態應用設計的控制器</p>
          <p className="text-slate-300 text-xs mt-1">解決以上四個問題 → 三個保證</p>
        </div>
      </div>
    ),
    notes: `好，現在有了動態佈建，可以輕鬆搞定儲存了。接下來的問題是：資料庫適合用 Deployment 跑嗎？

回想一下第四堂課講的。用 Deployment 跑 MySQL 有四個問題。

第一，Pod 名稱不固定。Deployment 建出來的 Pod 名字帶 random hash，mysql-deploy-abc-xyz。每次重建名字都變。如果你有主從架構，主庫到底是哪個 Pod？

第二，沒有啟動順序。三個副本同時啟動。但 MySQL 主從架構需要主庫先起來、拿到 binlog position，從庫才能連上去同步。同時啟動，從庫找不到主庫，連線失敗。

第三，共用 PVC。如果三個 Pod 掛同一個 PVC，三個 MySQL 程序同時寫同一塊磁碟，資料格式衝突，資料庫直接損毀。

第四，沒有穩定的網路身份。Service 做負載均衡，流量隨機分給後面的 Pod。但你的寫入操作要送主庫，讀取送從庫，根本沒辦法指定。

根本原因是：Deployment 設計給無狀態應用，比如 API、Web Server。這類應用每個副本都一樣，隨機哪個回應都行。但資料庫是有狀態的，每個副本的資料不同，身份非常重要。

K8s 為有狀態應用設計了另一個控制器：StatefulSet。它給你三個保證，剛好解決這四個問題。 [▶ 下一頁]`,
  },

  // ── 6-14 概念（4/6）：StatefulSet 三個保證 ──
  {
    title: 'StatefulSet 三個保證',
    subtitle: '①穩定身份 ②獨立儲存 ③有序生命週期',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">StatefulSet 三個保證</p>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="bg-slate-800/60 p-3 rounded-lg">
              <p className="text-green-400 font-semibold">① 穩定身份（固定序號）</p>
              <p className="text-slate-300 text-xs mt-1">Pod 名稱固定：<span className="text-green-400 font-mono">mysql-0</span> / <span className="text-green-400 font-mono">mysql-1</span> / <span className="text-green-400 font-mono">mysql-2</span></p>
              <p className="text-slate-400 text-xs mt-0.5">刪了重建還是同名，不會出現 random hash</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg">
              <p className="text-green-400 font-semibold">② 獨立儲存（volumeClaimTemplates）</p>
              <p className="text-slate-300 text-xs mt-1">每個 Pod 自動建獨立 PVC：</p>
              <div className="font-mono text-xs mt-1 space-y-0.5">
                <p className="text-green-300">mysql-0  →  mysql-data-mysql-0</p>
                <p className="text-green-300">mysql-1  →  mysql-data-mysql-1</p>
              </div>
              <p className="text-slate-400 text-xs mt-1">Pod 刪掉重建，新的 mysql-0 還是掛回同一個 PVC</p>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-lg">
              <p className="text-green-400 font-semibold">③ 有序生命週期</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="text-xs">
                  <p className="text-slate-400 mb-1">啟動順序：</p>
                  <div className="flex items-center gap-1">
                    <span className="bg-green-900/50 border border-green-500/40 px-2 py-0.5 rounded text-green-300 font-mono text-xs">0</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-green-900/50 border border-green-500/40 px-2 py-0.5 rounded text-green-300 font-mono text-xs">1</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-green-900/50 border border-green-500/40 px-2 py-0.5 rounded text-green-300 font-mono text-xs">2</span>
                  </div>
                </div>
                <div className="text-xs">
                  <p className="text-slate-400 mb-1">刪除順序：</p>
                  <div className="flex items-center gap-1">
                    <span className="bg-red-900/50 border border-red-500/40 px-2 py-0.5 rounded text-red-300 font-mono text-xs">2</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-red-900/50 border border-red-500/40 px-2 py-0.5 rounded text-red-300 font-mono text-xs">1</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-red-900/50 border border-red-500/40 px-2 py-0.5 rounded text-red-300 font-mono text-xs">0</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-2">每個 Pod 要 Ready 才起下一個，確保主從順序</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `StatefulSet 給你三個保證，剛好解決 Deployment 的四個問題。

第一，穩定身份。Pod 名稱是固定的序號：mysql-0、mysql-1、mysql-2。不管 Pod 被刪幾次重建幾次，mysql-0 永遠叫 mysql-0。不會出現 random hash。這樣你的主從架構就知道 mysql-0 是主庫。

第二，獨立儲存。StatefulSet 用 volumeClaimTemplates 機制，自動為每個 Pod 建立獨立的 PVC。mysql-0 的 PVC 叫 mysql-data-mysql-0，mysql-1 的叫 mysql-data-mysql-1。三個 Pod 各自寫自己的磁碟，不會互相衝突。而且 Pod 被刪掉重建之後，新的 mysql-0 還是會掛回 mysql-data-mysql-0 這個 PVC，資料還在。

第三，有序的生命週期。啟動的時候先起 mysql-0，等它 Ready 之後再起 mysql-1，再起 mysql-2。刪除的時候反過來，先刪 mysql-2，再 mysql-1，最後 mysql-0。這樣就能保證主庫先起、從庫後起的順序。

這三個保證直接解決了我們說的四個問題：固定名稱解決問題一、有序啟動解決問題二、獨立 PVC 解決問題三。問題四（穩定網路身份）靠的是 Headless Service，下一張來看。 [▶ 下一頁]`,
  },

  // ── 6-14 概念（5/6）：Headless Service ──
  {
    title: 'Headless Service',
    subtitle: 'clusterIP: None — 每個 Pod 有自己的 DNS',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">普通 Service vs Headless Service</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-red-900/10 border border-red-500/30 p-3 rounded">
              <p className="text-red-400 font-semibold mb-2 text-center">普通 Service</p>
              <p className="text-slate-400 text-xs">clusterIP: 10.96.x.x</p>
              <p className="text-slate-300 text-xs mt-1">流量 → Service IP → <span className="text-yellow-400">隨機</span>分給 Pod</p>
              <p className="text-slate-400 text-xs mt-2">無法指定連到哪個 Pod</p>
            </div>
            <div className="bg-green-900/10 border border-green-500/30 p-3 rounded">
              <p className="text-green-400 font-semibold mb-2 text-center">Headless Service</p>
              <p className="text-slate-400 text-xs">clusterIP: <span className="text-green-400">None</span></p>
              <p className="text-slate-300 text-xs mt-1">每個 Pod 有<span className="text-green-400">獨立 DNS</span></p>
              <p className="text-slate-400 text-xs mt-2">可以直接連到指定的 Pod</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">每個 Pod 的 DNS 格式</p>
          <div className="font-mono text-xs bg-slate-900 p-3 rounded space-y-1.5 text-slate-300">
            <p><span className="text-green-400">mysql-0</span>.mysql-headless.default.svc.cluster.local</p>
            <p><span className="text-green-400">mysql-1</span>.mysql-headless.default.svc.cluster.local</p>
            <p><span className="text-green-400">mysql-2</span>.mysql-headless.default.svc.cluster.local</p>
          </div>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <p><span className="text-slate-300">格式：</span><span className="font-mono">{'<pod名>.<service名>.<namespace>.svc.cluster.local'}</span></p>
            <p>同 namespace 內可簡寫：<span className="font-mono text-green-400">mysql-0.mysql-headless</span></p>
          </div>
        </div>

        <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-1">實際應用場景</p>
          <div className="text-xs text-slate-300 space-y-1">
            <p>寫入 → 直連 <span className="font-mono text-green-400">mysql-0.mysql-headless</span>（主庫）</p>
            <p>讀取 → 直連 <span className="font-mono text-green-400">mysql-1.mysql-headless</span>（從庫）</p>
          </div>
        </div>
      </div>
    ),
    code: `# Headless Service YAML
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None          # ← 這就是 Headless 的關鍵
  selector:
    app: mysql-sts
  ports:
    - port: 3306
      targetPort: 3306

# 效果：
# mysql-0.mysql-headless → 直接連到 mysql-0 Pod
# mysql-1.mysql-headless → 直接連到 mysql-1 Pod
# StatefulSet spec 裡要指定 serviceName: mysql-headless`,
    notes: `第四個問題，沒有穩定網路身份，靠 Headless Service 解決。

普通的 Service 有一個 ClusterIP，所有流量先到這個 IP，再隨機分給後面的 Pod。你沒辦法指定連到哪個 Pod。對無狀態應用沒問題，但資料庫需要明確指定主庫。

Headless Service 就是把 clusterIP 設成 None。沒有 ClusterIP，不做負載均衡。它的效果是讓每個 Pod 有自己的 DNS 記錄。

DNS 格式是 Pod名稱.Service名稱.namespace.svc.cluster.local。所以 mysql-0 的 DNS 就是 mysql-0.mysql-headless.default.svc.cluster.local。在同一個 namespace 裡可以簡寫成 mysql-0.mysql-headless。

這樣你的應用程式就可以明確指定：寫入送到 mysql-0.mysql-headless，讀取從 mysql-1.mysql-headless。完全不會搞混。

StatefulSet 的 YAML 裡要在 spec.serviceName 指定要對應的 Headless Service 名稱，這樣 K8s 才知道幫每個 Pod 建立 DNS 記錄。 [▶ 下一頁]`,
  },

  // ── 6-14 概念（6/6）：StatefulSet vs Deployment 完整比較 ──
  {
    title: 'StatefulSet vs Deployment 完整比較',
    subtitle: '完整對照 + YAML 兩個差異',
    section: '6-14：StorageClass + StatefulSet 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">完整比較表</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1.5 font-semibold">項目</th>
                <th className="text-left py-1.5 font-semibold text-red-400">Deployment</th>
                <th className="text-left py-1.5 font-semibold text-green-400">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-slate-400">適合場景</td>
                <td className="py-1.5">無狀態（API、Web）</td>
                <td className="py-1.5">有狀態（DB、Cache）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-slate-400">Pod 名稱</td>
                <td className="py-1.5 text-red-300">隨機 hash</td>
                <td className="py-1.5 text-green-300">固定序號（mysql-0/1/2）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-slate-400">啟動順序</td>
                <td className="py-1.5 text-red-300">同時啟動</td>
                <td className="py-1.5 text-green-300">0→1→2（依序）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-slate-400">刪除順序</td>
                <td className="py-1.5 text-red-300">隨機</td>
                <td className="py-1.5 text-green-300">2→1→0（反序）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-slate-400">PVC</td>
                <td className="py-1.5 text-red-300">共用</td>
                <td className="py-1.5 text-green-300">每 Pod 獨立</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1.5 font-semibold text-slate-400">DNS</td>
                <td className="py-1.5 text-red-300">無獨立 DNS</td>
                <td className="py-1.5 text-green-300">pod名.svc名</td>
              </tr>
              <tr>
                <td className="py-1.5 font-semibold text-slate-400">Service 類型</td>
                <td className="py-1.5">普通 Service</td>
                <td className="py-1.5 text-green-300">Headless Service</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">YAML 兩個差異（其餘與 Deployment 相同）</p>
          <div className="font-mono text-xs bg-slate-900 p-3 rounded space-y-1 text-slate-300">
            <p className="text-slate-500">spec:</p>
            <p className="text-green-400">{'  serviceName: mysql-headless    # ① 對應 Headless Service'}</p>
            <p className="text-slate-500">{'  replicas: 2'}</p>
            <p className="text-slate-500">{'  # ... template 跟 Deployment 一樣 ...'}</p>
            <p className="text-green-400 mt-1">{'  volumeClaimTemplates:          # ② 每 Pod 獨立 PVC'}</p>
            <p className="text-slate-400">{'    - metadata:'}</p>
            <p className="text-slate-400">{'        name: mysql-data'}</p>
            <p className="text-slate-400">{'      spec:'}</p>
            <p className="text-slate-400">{'        accessModes: ["ReadWriteOnce"]'}</p>
            <p className="text-slate-400">{'        resources:'}</p>
            <p className="text-slate-400">{'          requests:'}</p>
            <p className="text-slate-400">{'            storage: 1Gi'}</p>
          </div>
        </div>
      </div>
    ),
    notes: `來做個完整總結。Deployment 和 StatefulSet 的差別在七個地方。

適合場景：Deployment 給無狀態應用，StatefulSet 給有狀態應用。Pod 名稱：Deployment 是隨機 hash，StatefulSet 是固定序號 0、1、2。啟動順序：Deployment 同時啟動，StatefulSet 依序 0→1→2。刪除順序：Deployment 隨機，StatefulSet 反序 2→1→0。PVC：Deployment 共用，StatefulSet 每個 Pod 獨立。DNS：Deployment 沒有獨立 DNS，StatefulSet 每個 Pod 有自己的 DNS。Service 類型：Deployment 搭配普通 Service，StatefulSet 搭配 Headless Service。

YAML 上的差異只有兩個地方。第一個是 spec 裡多了 serviceName，指定要搭配的 Headless Service。第二個是多了 volumeClaimTemplates，定義每個 Pod 的 PVC 範本。其他的 selector、template、容器設定，寫法跟 Deployment 完全一樣。

概念講完了，下一節我們來實際建 StatefulSet 跑 MySQL。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（1/5）：確認 StorageClass + 套用 YAML ──
  {
    title: 'Lab：確認 StorageClass + 套用 YAML',
    subtitle: 'kubectl get storageclass + kubectl apply statefulset-mysql.yaml',
    section: '6-15：StatefulSet MySQL 實作',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">YAML 三件套</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-0.5 rounded text-cyan-300 text-xs font-semibold">1</span>
              <p><strong className="text-white">Headless Service</strong> -- clusterIP: None，讓每個 Pod 有獨立 DNS</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-0.5 rounded text-cyan-300 text-xs font-semibold">2</span>
              <p><strong className="text-white">Secret</strong> -- MySQL root 密碼，不寫死在 YAML</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-0.5 rounded text-cyan-300 text-xs font-semibold">3</span>
              <p><strong className="text-white">StatefulSet</strong> -- serviceName + volumeClaimTemplates</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get storageclass</code> -- 確認 local-path (default)</li>
            <li><code className="text-green-400">kubectl apply -f statefulset-mysql.yaml</code></li>
            <li><code className="text-green-400">kubectl get pods -w</code> -- 觀察有序啟動</li>
            <li>mysql-0 先 Running → mysql-1 才開始建</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">驗證重點</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p><span className="text-cyan-400 font-semibold">固定名稱：</span>mysql-0、mysql-1（不是 random hash）</p>
            <p><span className="text-cyan-400 font-semibold">獨立 PVC：</span>mysql-data-mysql-0、mysql-data-mysql-1</p>
          </div>
        </div>
      </div>
    ),
    code: `# statefulset-mysql.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None              # ← Headless Service
  selector:
    app: mysql-sts
  ports:
    - port: 3306
---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-sts-secret
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: rootpass123
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless  # ← 對應 Headless Service
  replicas: 2
  selector:
    matchLabels:
      app: mysql-sts
  template:
    metadata:
      labels:
        app: mysql-sts
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          envFrom:
            - secretRef:
                name: mysql-sts-secret
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:        # ← StatefulSet 獨有
    - metadata:
        name: mysql-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi`,
    notes: `好，上一支影片講了 StorageClass 和 StatefulSet 的概念，這支影片直接動手做。

首先確認一下 k3s 的 StorageClass 有在。

kubectl get storageclass

你應該看到 local-path (default)，provisioner 是 rancher.io/local-path。有了這個，我們的 PVC 就不用手動建 PV 了，K8s 會自動搞定。

現在來看 statefulset-mysql.yaml。這個檔案裡面有三個東西。

第一個是 Headless Service。apiVersion v1，kind Service，metadata name 叫 mysql-headless。spec 裡面最關鍵的一行：clusterIP: None。這就是 Headless Service 的標誌。selector 設 app: mysql-sts。ports 的 port 是 3306。

第二個是 Secret，存 MySQL 的 root 密碼。跟上午的做法一樣，用 Secret 管密碼，不寫死在 YAML 裡面。

第三個是 StatefulSet 本身。apiVersion apps/v1，kind StatefulSet，metadata name 叫 mysql。spec 裡面 serviceName 設 mysql-headless，對應剛才的 Headless Service。replicas 設 2，我們先跑兩個副本。selector 的 matchLabels 設 app: mysql-sts。

template 的部分跟 Deployment 一模一樣。containers 裡面 name 叫 mysql，image 是 mysql:8.0。envFrom 引用 Secret 注入密碼。volumeMounts 的 name 是 mysql-data，mountPath 是 /var/lib/mysql。

最後是重頭戲 -- volumeClaimTemplates。這是 StatefulSet 獨有的。它是一個 PVC 範本，metadata name 叫 mysql-data。spec 裡面 accessModes 設 ReadWriteOnce，resources requests storage 是 1Gi。注意這裡不用指定 storageClassName，因為 k3s 的 local-path 是 default StorageClass，沒指定就用它。

K8s 會根據這個範本，自動為每個 Pod 建一個 PVC。mysql-0 的 PVC 叫 mysql-data-mysql-0，mysql-1 的叫 mysql-data-mysql-1。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（2/2）：驗證有序啟動 + 資料持久化 ──
  {
    title: 'Lab：砍 mysql-0 → 資料還在！',
    subtitle: '有序啟動 + 固定名稱 + 獨立 PVC 驗證',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證操作</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get pods -l app=mysql-sts</code> -- mysql-0、mysql-1</li>
            <li><code className="text-green-400">kubectl get pvc</code> -- mysql-data-mysql-0、mysql-data-mysql-1</li>
            <li>進 mysql-0 建 testdb：<code className="text-green-400">kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"</code></li>
            <li><code className="text-green-400">kubectl delete pod mysql-0</code></li>
            <li>新 mysql-0 起來 → <code className="text-green-400">SHOW DATABASES;</code> → <span className="text-green-400 font-bold">testdb 還在！</span></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對比 Deployment</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">特性</th>
                <th className="text-left py-2">Deployment</th>
                <th className="text-left py-2">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">Pod 名稱</td>
                <td className="py-2">random (abc-xyz)</td>
                <td className="py-2 text-green-400">固定序號 (mysql-0)</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">啟動順序</td>
                <td className="py-2">全部同時</td>
                <td className="py-2 text-green-400">0 → 1 → 2</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">PVC</td>
                <td className="py-2">共用一個</td>
                <td className="py-2 text-green-400">每個 Pod 獨立</td>
              </tr>
              <tr>
                <td className="py-2">DNS</td>
                <td className="py-2">只有 Service</td>
                <td className="py-2 text-green-400">每個 Pod 有 DNS</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# 部署後觀察有序啟動
kubectl apply -f statefulset-mysql.yaml
kubectl get pods -w
# mysql-0: Pending → Running (先)
# mysql-1: Pending → Running (後)

# 驗證固定名稱 + 獨立 PVC
kubectl get pods -l app=mysql-sts
# mysql-0   1/1   Running
# mysql-1   1/1   Running
kubectl get pvc
# mysql-data-mysql-0   Bound
# mysql-data-mysql-1   Bound

# 驗證資料持久化
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 \\
  -e "CREATE DATABASE testdb;"
kubectl delete pod mysql-0
kubectl get pods -w           # 新 mysql-0 自動重建
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 \\
  -e "SHOW DATABASES;"        # testdb 還在！`,
    notes: `好，部署。

kubectl apply -f statefulset-mysql.yaml

部署之後馬上用 -w 觀察。

kubectl get pods -w

注意看順序。你會看到 mysql-0 先出現，狀態從 Pending 變成 ContainerCreating，再變成 Running。mysql-0 完全 Ready 之後，mysql-1 才開始建立。mysql-1 也經歷 Pending、ContainerCreating、Running。

這就是有序啟動。如果你之前用 Deployment 跑 replicas 2，兩個 Pod 是同時開始建的。StatefulSet 不一樣，它保證 0 號先起來，0 號好了 1 號才動。

等兩個都 Running 了，按 Ctrl+C。看看 Pod 名稱。

kubectl get pods -l app=mysql-sts

mysql-0 和 mysql-1。固定的序號，不是 random hash。

看 PVC。

kubectl get pvc

mysql-data-mysql-0 和 mysql-data-mysql-1。每個 Pod 有自己的 PVC，自動建立的，不用手動。

現在來驗證資料持久化。進 mysql-0 建一個資料庫。

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"

然後砍掉 mysql-0。

kubectl delete pod mysql-0

觀察。

kubectl get pods -w

mysql-0 被砍了，StatefulSet 會重建一個新的 mysql-0。注意，名字還是 mysql-0，不是什麼 mysql-abc-xyz。等它 Running 之後，查資料。

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"

testdb 還在。因為新的 mysql-0 掛載的還是 mysql-data-mysql-0 這個 PVC，資料沒有丟。

我再跟大家對比一下 Deployment。如果你用 Deployment 跑 MySQL 然後砍 Pod，新 Pod 的名字會變，而且掛載的是同一個 PVC。如果你有多個副本，所有 Pod 都搶同一塊儲存。StatefulSet 每個 Pod 有自己的 PVC，資料完全隔離。 [▶ 下一頁]`,
  },

  // ── 6-16 學員實作 ──
  {
    title: '學員實作：StatefulSet Redis 快取叢集',
    subtitle: 'Loop 5 練習題 — 自己寫 Redis StatefulSet（不給模板）',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：場景任務題</p>
          <p className="text-slate-400 text-xs mb-2">部署 Redis 快取叢集，每個 Pod 要有固定名稱、有序啟動、各自獨立的 500Mi 儲存</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>自己寫 StatefulSet YAML（image: redis:7，2 個副本，serviceName 自訂）</li>
            <li><code className="text-green-400">kubectl get pods</code> 看到 <code className="text-green-400">redis-0</code> 和 <code className="text-green-400">redis-1</code></li>
            <li><code className="text-green-400">kubectl get pvc</code> 看到兩個獨立 PVC</li>
            <li>刪 <code className="text-green-400">redis-0</code>，確認重建後名稱還是 <code className="text-green-400">redis-0</code></li>
          </ol>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">挑戰：有序擴縮容驗證</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Scale 到 3，用 <code className="text-yellow-300">-w</code> 看 mysql-2 最後才建</li>
            <li>Scale 回 1，確認刪除順序：mysql-2 先刪還是 mysql-1 先刪？</li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：你的團隊要部署 Redis 快取叢集，要求每個 Pod 有固定名稱、有序啟動、各自獨立的 500Mi 儲存。自己寫一個 StatefulSet YAML，image 用 redis:7，2 個副本，volumeClaimTemplates 每個 500Mi。驗收三點：kubectl get pods 要看到 redis-0 和 redis-1，kubectl get pvc 要看到兩個獨立的 PVC，刪掉 redis-0 之後重建的 Pod 名稱還是 redis-0。注意：這題不給模板，要自己寫。挑戰題：scale 到 3，觀察 mysql-2 最後才建；scale 回 1，記錄刪除順序。大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-16 學員實作解答 ──
  {
    title: '解答：Redis StatefulSet + 常見坑',
    subtitle: '回頭操作 Loop 5',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做題解答（Redis StatefulSet）</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded space-y-0.5">
            <p className="text-slate-500"># 重點結構</p>
            <p>kind: StatefulSet</p>
            <p>spec:</p>
            <p>{'  '}serviceName: redis-headless</p>
            <p>{'  '}replicas: 2</p>
            <p>{'  '}template.spec.containers:</p>
            <p>{'    '}- name: redis, image: redis:7</p>
            <p>{'  '}volumeClaimTemplates:</p>
            <p>{'    '}- storage: 500Mi, accessModes: [ReadWriteOnce]</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">完整解答見 answers/redis-statefulset.yaml</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗收</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get statefulset</code> -- READY 2/2</li>
            <li><code className="text-green-400">kubectl get pods -l app=mysql-sts</code> -- mysql-0、mysql-1 Running</li>
            <li><code className="text-green-400">kubectl get pvc</code> -- 兩個 PVC 都是 Bound</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">StatefulSet 常見三個坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">volumeClaimTemplates 縮排錯</strong> -- 跟 selector、replicas、template 平級，不是在 template 裡面</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">忘了建 Headless Service</strong> -- StatefulSet 可以起來但 DNS 解析不了</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">serviceName 打錯</strong> -- 要跟 Headless Service 的 metadata name 完全一致</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">銜接下一個 Loop</p>
          <p className="text-slate-300 text-xs mt-1">PV、PVC、StorageClass、StatefulSet、Headless Service、Secret... 一個 MySQL 就要這麼多 YAML。如果還有 Redis、RabbitMQ、ES？ → Helm</p>
        </div>
      </div>
    ),
    notes: `好，回頭確認一下大家的狀態。

kubectl get statefulset 看一下，mysql 的 READY 應該是 2/2。kubectl get pods -l app=mysql-sts 看到 mysql-0 和 mysql-1 都是 Running。kubectl get pvc 看到兩個 PVC 都是 Bound。

如果有問題的同學，來看看常見的三個坑。

第一個坑，volumeClaimTemplates 的縮排。這個欄位是在 spec 下面，跟 template 同級，不是在 template 裡面。很多同學把它放到 template 裡面，那就錯了。記住，volumeClaimTemplates 跟 selector、replicas、template 是平級的。

第二個坑，忘了建 Headless Service。StatefulSet 的 serviceName 指定了一個 Service 名稱，但如果那個 Service 不存在，StatefulSet 可以建起來但 DNS 解析會有問題。Pod 之間沒辦法用 mysql-0.mysql-headless 互相連。

第三個坑，serviceName 打錯。StatefulSet 裡面的 serviceName 要跟 Headless Service 的 metadata name 完全一致。打錯一個字就對不上。

好，做到挑戰題的同學，你應該看到 scale 到 3 的時候 mysql-2 最後建，scale 回 2 的時候 mysql-2 先被刪。這就是 StatefulSet 的有序生命週期管理。

到這裡，大家回想一下今天下午做了多少事情。PV、PVC、StorageClass、StatefulSet、Headless Service、Secret。一個 MySQL 服務就要寫這麼多 YAML。再加上午的 Ingress、ConfigMap，你的目錄裡面已經有七八個 YAML 檔案了。

如果你的系統不只一個 MySQL，還有 Redis、RabbitMQ、Elasticsearch，每個都要手寫一堆 YAML？太痛苦了。下一個 Loop 要介紹一個工具，讓你一行指令就能搞定這些事情。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 6：Helm（6-17, 6-18, 6-19）
  // ============================================================

  // ── 6-17 概念（1/2）：YAML 太多 → Helm = 套件管理器 ──
  {
    title: 'YAML 太多太散了',
    subtitle: '一個 MySQL 就要五六個 YAML，還有 Redis、RabbitMQ...',
    section: 'Loop 6：Helm',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">一個 MySQL 服務要多少 YAML？</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">Secret</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">ConfigMap</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">StatefulSet</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">Headless Service</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">PVC</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">Ingress</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">再加 Redis、RabbitMQ、ES... 幾十個檔案、幾千行 YAML</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">三個環境 = 三套 YAML？</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-slate-800 border border-slate-600 p-2 rounded">
              <p className="text-cyan-400 font-semibold">dev</p>
              <p className="text-slate-400">replicas: 1</p>
            </div>
            <div className="bg-slate-800 border border-slate-600 p-2 rounded">
              <p className="text-amber-400 font-semibold">staging</p>
              <p className="text-slate-400">replicas: 2</p>
            </div>
            <div className="bg-slate-800 border border-slate-600 p-2 rounded">
              <p className="text-green-400 font-semibold">prod</p>
              <p className="text-slate-400">replicas: 3</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">改一個東西三個地方都要改？</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">每個技術生態都有套件管理器</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <p>Ubuntu → <span className="text-cyan-400 font-semibold">apt</span></p>
            <p>macOS → <span className="text-cyan-400 font-semibold">brew</span></p>
            <p>Node.js → <span className="text-cyan-400 font-semibold">npm</span></p>
            <p>Python → <span className="text-cyan-400 font-semibold">pip</span></p>
          </div>
          <p className="text-green-400 font-semibold mt-3">K8s → Helm</p>
        </div>
      </div>
    ),
    notes: `好，上一個 Loop 結束之後我問了大家一個問題：YAML 太多了。我們來算一下。

今天一個 MySQL 服務，你要寫 Secret 管密碼、ConfigMap 管設定、StatefulSet 跑 MySQL、Headless Service 做 DNS、PVC 要儲存空間。五個 K8s 資源。如果再加上 Ingress 讓外面連進來，六個。

你的系統不只有 MySQL 吧？可能還有 Redis 做快取、RabbitMQ 做訊息佇列、Elasticsearch 做搜尋。每個都要寫一堆 YAML。加起來可能有幾十個檔案，幾千行 YAML。

然後你要部署到 dev、staging、prod 三個環境。三個環境的 YAML 基本上一樣，只是 replicas 不同、Image tag 不同、資料庫連線不同。你是要維護三套 YAML？改了一個東西三個地方都要改？

還有一個問題。你自己手寫 MySQL 的 StatefulSet、Headless Service、PVC。但全世界有幾百萬人在 K8s 上跑 MySQL，每個人都在寫一樣的東西。有沒有人已經寫好了一份最佳實踐，你直接拿來用就好？

用你熟悉的經驗來想。在 Ubuntu 上要裝 MySQL，你會自己下載原始碼然後編譯嗎？不會，你 apt install mysql-server，一行指令搞定。在 Node.js 專案要用 Express，你會自己從零寫 HTTP 框架嗎？不會，你 npm install express。在 Python 專案要用 Flask，你 pip install flask。

每個技術生態都有套件管理器。Ubuntu 有 apt，macOS 有 brew，Node.js 有 npm，Python 有 pip。

K8s 的套件管理器叫 Helm。 [▶ 下一頁]`,
  },

  // ── 6-17 概念（2/2）：Chart / Repo / Release / values.yaml ──
  {
    title: 'Helm 核心概念',
    subtitle: 'Chart + Release + Repository + values.yaml',
    section: 'Loop 6：Helm',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Helm 四大概念</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">概念</th>
                <th className="text-left py-2">說明</th>
                <th className="text-left py-2 w-32">對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Helm</td>
                <td className="py-2">套件管理工具</td>
                <td className="py-2">apt / yum / brew</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Chart</td>
                <td className="py-2">一包 YAML 範本</td>
                <td className="py-2">.deb / .rpm 安裝包</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Release</td>
                <td className="py-2">Chart 安裝後的實例</td>
                <td className="py-2">安裝好的軟體</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Repository</td>
                <td className="py-2">Chart 倉庫</td>
                <td className="py-2">apt source list</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400 font-semibold">values.yaml</td>
                <td className="py-2">客製化參數</td>
                <td className="py-2">軟體的設定檔</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker Compose 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">Docker Compose</th>
                <th className="text-left py-2">Helm</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">docker-compose.yml</td>
                <td className="py-2">Chart（一包 YAML 範本）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">docker compose up</td>
                <td className="py-2">helm install</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">docker compose down</td>
                <td className="py-2">helm uninstall</td>
              </tr>
              <tr>
                <td className="py-2">.env 檔案</td>
                <td className="py-2">values.yaml</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">三大核心功能</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p><span className="text-green-400 font-semibold">1. 一鍵安裝</span> -- 別人寫好最佳實踐，你直接用</p>
            <p><span className="text-green-400 font-semibold">2. 參數化</span> -- 同一個 Chart，不同 values.yaml 部署不同環境</p>
            <p><span className="text-green-400 font-semibold">3. 版本管理</span> -- helm rollback 整個 Release 一起回滾</p>
          </div>
        </div>
      </div>
    ),
    code: `# Helm 基本指令流程
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo mysql
helm install my-mysql bitnami/mysql
helm list
helm uninstall my-mysql

# 一行指令安裝整套 MySQL
helm install my-mysql bitnami/mysql \\
  --set auth.rootPassword=my-secret
# → StatefulSet + Headless Service + PVC + Secret 全部建好`,
    notes: `Helm 讓你用一行指令在 K8s 上安裝一整套 MySQL：helm install my-mysql bitnami/mysql。StatefulSet、Headless Service、PVC、Secret、ConfigMap，全部幫你建好。你不用寫任何 YAML。

Helm 有幾個核心概念。Chart 就是一個安裝包，裡面包了所有需要的 YAML 範本。就像 Ubuntu 的 .deb 檔案。Release 是 Chart 安裝後的實例。你可以用同一個 Chart 安裝多個 Release，比如一個 Redis 叫 my-cache 給快取用，另一個 Redis 叫 my-session 給 session 用，互不干擾。Repository 是 Chart 的倉庫，就像 Ubuntu 的 apt source list。最大的公開倉庫是 Bitnami，裡面有 MySQL、Redis、PostgreSQL、MongoDB、WordPress、Grafana... 常用的軟體幾乎都有。

values.yaml 是參數檔。一個 Chart 有很多可以調整的參數，比如 replicas 幾個、密碼是什麼、PVC 要多大。你把這些參數寫在 values.yaml 裡面，Helm 會把它們套進 YAML 範本裡生成最終的 K8s 資源。

Helm 的三個核心功能。第一，一鍵安裝。別人已經把最佳實踐寫成 Chart 了，你直接 helm install 就好。第二，參數化。同一個 Chart，dev 環境設 replicas 1、密碼設 dev123，prod 環境設 replicas 3、密碼設超強密碼。只要換 values.yaml，不用改 Chart。第三，版本管理。Helm 會記錄每次安裝和升級的歷史。升級之後發現有問題？helm rollback 一行指令回到上一版。而且不只是回滾一個 Deployment，是整個 Release 的所有資源一起回滾。

對照 Docker Compose 來看。Chart 就像 docker-compose.yml，定義了整個系統的結構。helm install 就像 docker compose up。helm uninstall 就像 docker compose down。values.yaml 就像 .env 檔案。概念完全一樣，只是 Helm 在 K8s 的世界裡功能更強大。

基本的指令流程是這樣的。helm repo add bitnami https://charts.bitnami.com/bitnami 加入倉庫。helm search repo mysql 搜尋有哪些 Chart。helm install my-mysql bitnami/mysql 安裝。helm list 看已安裝的 Release。helm uninstall my-mysql 解除安裝。

概念講完了，下一支影片我們來實際裝一個試試看。 [▶ 下一頁]`,
  },

  // ── 6-18 實作（1/2）：Helm 安裝 + MySQL + Redis ──
  {
    title: 'Lab：Helm 一行指令裝 MySQL + Redis',
    subtitle: 'helm install / upgrade / rollback / uninstall',
    section: 'Loop 6：Helm',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>安裝 Helm：<code className="text-green-400">curl ... | bash</code></li>
            <li><code className="text-green-400">helm repo add bitnami ...</code></li>
            <li><code className="text-green-400">helm search repo mysql</code></li>
            <li><code className="text-green-400">helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret</code></li>
            <li><code className="text-green-400">kubectl get all -l app.kubernetes.io/instance=my-mysql</code></li>
            <li><code className="text-green-400">helm list</code> -- REVISION 1, deployed</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">升級 + 回滾</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p><code className="text-green-400">helm upgrade</code> -- 加 read replica</p>
            <p><code className="text-green-400">helm history</code> -- 看 REVISION 1, 2</p>
            <p><code className="text-green-400">helm rollback my-mysql 1</code> -- 整個 Release 回滾</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">自訂 values.yaml</p>
          <p className="text-slate-300 text-xs">dev 和 prod 用不同的 values 檔 → 同一個 Chart 部署不同環境</p>
          <p className="text-slate-400 text-xs mt-1"><code className="text-green-400">helm install my-redis bitnami/redis -f my-redis-values.yaml</code></p>
        </div>
      </div>
    ),
    code: `# 1. 安裝 Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version

# 2. 加入 Bitnami 倉庫
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo mysql

# 3. 一鍵安裝 MySQL
helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret
kubectl get all -l app.kubernetes.io/instance=my-mysql
kubectl get pvc
helm list

# 4. 升級 + 回滾
helm upgrade my-mysql bitnami/mysql \\
  --set auth.rootPassword=my-secret \\
  --set secondary.replicaCount=1
helm history my-mysql
helm rollback my-mysql 1

# 5. 再裝一個 Redis
helm install my-redis bitnami/redis --set auth.password=myredis123

# 6. 自訂 values.yaml
# my-redis-values.yaml:
#   auth:
#     password: myredis123
#   master:
#     persistence:
#       size: 2Gi
#   replica:
#     replicaCount: 2
helm install my-redis2 bitnami/redis -f my-redis-values.yaml

# 7. 清理
helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2`,
    notes: `好，上一支影片講了 Helm 的概念，這支影片來實際體驗一下。

第一步，安裝 Helm。一行指令。

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

跑完之後驗證一下。

helm version

看到版本號就表示裝好了。

第二步，加入 Bitnami 的 Chart 倉庫。

helm repo add bitnami https://charts.bitnami.com/bitnami

然後更新一下本地的索引。

helm repo update

搜尋 MySQL 的 Chart。

helm search repo mysql

你會看到 bitnami/mysql，以及版本號和描述。

第三步，一鍵安裝 MySQL。

helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret

就這一行。等它跑個一兩分鐘。

跑完之後，Helm 會印出一大段說明，告訴你怎麼連到 MySQL、密碼存在哪個 Secret 裡面。這些資訊很有用，建議看一下。

現在看看 Helm 幫你建了什麼。

kubectl get all -l app.kubernetes.io/instance=my-mysql

你會看到 StatefulSet、Pod、Service，全部自動建好了。再看 PVC。

kubectl get pvc

也有了。如果你自己手寫這些 YAML，少說一百行起跳。Helm 一行指令搞定。

看已安裝的 Release。

helm list

你會看到 my-mysql，REVISION 是 1，STATUS 是 deployed。

假設現在你想加一個 read replica。用 helm upgrade。

helm upgrade my-mysql bitnami/mysql --set auth.rootPassword=my-secret --set secondary.replicaCount=1

注意 auth.rootPassword 要重複帶，不然 upgrade 的時候密碼會被清掉。這是 Helm 的一個小坑，記一下。

看升級歷史。

helm history my-mysql

REVISION 1 是原始安裝，REVISION 2 是剛才的升級。

如果升級後發現有問題，一行指令回滾。

helm rollback my-mysql 1

再看 history，多了一個 REVISION 3，描述是 Rollback to 1。對照 K8s 原生的 kubectl rollout undo，那只能回滾單一個 Deployment。但 helm rollback 是把整個 Release 的所有資源一起回滾。 [▶ 下一頁]`,
  },

  // ── 6-18 實作（2/2）：Redis + values.yaml + 清理 ──
  {
    title: 'Lab：自訂 values.yaml + 清理',
    subtitle: '多環境部署 + helm uninstall',
    section: 'Loop 6：Helm',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">WordPress Chart 重點 values（6-24 用到）</p>
          <p className="text-slate-400 text-xs mb-2"><code className="text-green-400">helm show values bitnami/wordpress</code> 會印出幾百行，只需要關心這幾個：</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1 font-mono">key</th>
                <th className="text-left py-1">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 font-mono">
              <tr className="border-b border-slate-700">
                <td className="py-1 text-green-400">wordpressUsername</td>
                <td className="py-1 font-sans">管理員帳號</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1 text-green-400">wordpressPassword</td>
                <td className="py-1 font-sans">管理員密碼（必填）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1 text-green-400">mariadb.auth.rootPassword</td>
                <td className="py-1 font-sans">DB root 密碼（必填）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1 text-green-400">ingress.enabled</td>
                <td className="py-1 font-sans">true = 開 Ingress</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1 text-green-400">ingress.hostname</td>
                <td className="py-1 font-sans">wordpress.local</td>
              </tr>
              <tr>
                <td className="py-1 text-green-400">persistence.size</td>
                <td className="py-1 font-sans">PVC 大小（預設 10Gi）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">values.yaml 多環境部署</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded">
              <p className="text-cyan-400 font-semibold mb-1">values-dev.yaml</p>
              <div className="font-mono text-slate-300">
                <p>replicas: 1</p>
                <p>password: dev123</p>
              </div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
              <p className="text-green-400 font-semibold mb-1">values-prod.yaml</p>
              <div className="font-mono text-slate-300">
                <p>replicas: 3</p>
                <p>password: super-secret</p>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">同一個 Chart，不同的 values 檔 → 搞定多環境</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">helm uninstall 一鍵清理</p>
          <p className="text-slate-300 text-sm">一行指令清掉所有相關資源</p>
          <p className="text-slate-400 text-xs mt-1">對比 kubectl delete -f 要一個一個檔案刪</p>
        </div>
      </div>
    ),
    notes: `好，MySQL 體驗完了。我們再裝一個 Redis 試試，證明 Helm 不只能裝 MySQL。

helm install my-redis bitnami/redis --set auth.password=myredis123

等它跑起來，kubectl get pods 看一下。Redis 的 master 和 replica 都跑起來了。

現在再教你一個更好的做法。剛才我們用 --set 在命令列傳參數，參數多的時候命令列會超長。更好的方式是用 values.yaml 檔案。

先看看 Chart 有哪些參數可以設定。

helm show values bitnami/redis | head -50

會印出一大堆，每個參數都有註解說明。

建一個自己的 values 檔案。比如 my-redis-values.yaml，裡面寫 auth 的 password 是 myredis123，master 的 persistence size 是 2Gi，replica 的 replicaCount 是 2、persistence size 是 1Gi。

安裝的時候用 -f 指定。

helm install my-redis2 bitnami/redis -f my-redis-values.yaml

這個做法最大的好處是什麼？你可以為不同環境建不同的 values 檔。values-dev.yaml 裡面 replicas 設 1、密碼設 dev123。values-prod.yaml 裡面 replicas 設 3、密碼設超強密碼。同一個 Chart，不同的 values 檔，搞定多環境部署。

最後清理。

helm uninstall my-mysql
helm uninstall my-redis
helm uninstall my-redis2

一行指令把所有相關資源清乾淨。對比 kubectl delete -f 要一個一個檔案刪，Helm 方便太多了。 [▶ 下一頁]`,
  },

  // ── 6-19A 學員實作 Part 1 ──
  {
    title: '學員實作：install → upgrade → rollback 完整流程',
    subtitle: '回頭操作 Loop 5 Part 1 — 練習題',
    section: '6-19A：Helm 學員實作 Part 1',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
          <p className="text-blue-300 font-semibold mb-2">前置確認</p>
          <p className="text-slate-300 text-sm">先執行 <code className="text-green-400">helm list</code>，確認目前沒有任何 Release（my-ingress 應已在 18A 清理）</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Task：用 my-nginx 跑一遍完整流程</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold w-5">1.</span>
              <p>install <code className="text-green-400">my-nginx</code>（replicaCount=1, NodePort）</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold w-5">2.</span>
              <p>upgrade（replicaCount=2）→ 確認 REVISION 2</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold w-5">3.</span>
              <p><code className="text-green-400">helm history my-nginx</code> 看歷史</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold w-5">4.</span>
              <p>rollback to REVISION 1 → 確認 REVISION 3 出現</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold w-5">5.</span>
              <p>uninstall → <code className="text-green-400">helm list</code> 確認空的</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-3 rounded-lg">
          <p className="text-yellow-400 text-sm font-semibold">重點觀察：rollback 不是回去舊版，而是新增一個 REVISION！</p>
        </div>
      </div>
    ),
    code: `# 前置確認：確認 helm list 為空
helm list
# NAME   NAMESPACE   REVISION   STATUS   CHART   APP VERSION

# Step 1: install my-nginx (replicaCount=1, NodePort)
helm install my-nginx ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=1 \\
  --set controller.service.type=NodePort
# NAME: my-nginx
# STATUS: deployed
# REVISION: 1

# Step 2: upgrade (replicaCount=2)
helm upgrade my-nginx ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=2 \\
  --set controller.service.type=NodePort
# Release "my-nginx" has been upgraded. Happy Helming!
# STATUS: deployed
# REVISION: 2

# Step 3: 看歷史
helm history my-nginx
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         deployed    Upgrade complete

# Step 4: rollback to REVISION 1
helm rollback my-nginx 1
# Rollback was a success! Happy Helming!

# rollback 後看歷史 → REVISION 3 出現了！
helm history my-nginx
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         superseded  Upgrade complete
# 3         deployed    Rollback to 1   ← rollback 是新增一筆！

# Step 5: 清理
helm uninstall my-nginx
helm list
# NAME   NAMESPACE   REVISION   STATUS   CHART   APP VERSION
# (空的)`,
    notes: `好，現在換大家上。18A 我剛教了 install、upgrade、rollback，現在你自己用 Release 名稱 my-nginx 從頭到尾跑一遍。

第一步先 helm list，確認目前是空的，my-ingress 應該在 18A 結尾就清掉了。如果沒有清掉，先 helm uninstall 掉。

然後 install my-nginx，記得帶 replicaCount=1 跟 NodePort。裝好之後 upgrade 改成 replicaCount=2。然後 helm history 看一下。接著 rollback 回 REVISION 1。rollback 完之後再 history 看一次。你會看到 REVISION 3 出現了，這是重點——rollback 不是真的「回去」，是「新增一筆 rollback 記錄」。

最後 uninstall，helm list 確認空的。大家動手做，我去巡堂。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-19A 學員實作 Part 1 解答 ──
  {
    title: '解答：install → upgrade → rollback',
    subtitle: '回頭操作 Loop 5 Part 1 — 解答',
    section: '6-19A：Helm 學員實作 Part 1',
    duration: '0',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">完整指令流程</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold w-6">①</span>
              <p className="text-slate-300"><code className="text-yellow-300">helm install my-nginx</code> → STATUS: deployed, REVISION: 1</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold w-6">②</span>
              <p className="text-slate-300"><code className="text-yellow-300">helm upgrade my-nginx</code> → REVISION: 2</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold w-6">③</span>
              <p className="text-slate-300"><code className="text-yellow-300">helm history</code> → 看到 1(superseded) + 2(deployed)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold w-6">④</span>
              <p className="text-slate-300"><code className="text-yellow-300">helm rollback my-nginx 1</code> → Rollback was a success!</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold w-6">⑤</span>
              <p className="text-slate-300">history 再看 → <strong className="text-red-300">REVISION 3 出現！</strong>rollback = 新增一筆記錄</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">核心概念：rollback 的本質</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>Helm 永遠<strong className="text-white">只往前</strong>——rollback 是「把舊版設定再跑一次 upgrade」</p>
            <p>REVISION 號碼只增不減，這讓你隨時可以再 rollback 到任何版本</p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 text-sm font-semibold">清理完成 → helm list 應該是空的，準備進 19B</p>
        </div>
      </div>
    ),
    code: `# 完整解答（複習用）

helm list
# (空的)

helm install my-nginx ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=1 \\
  --set controller.service.type=NodePort
# REVISION: 1

helm upgrade my-nginx ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=2 \\
  --set controller.service.type=NodePort
# REVISION: 2

helm history my-nginx
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         deployed    Upgrade complete

helm rollback my-nginx 1
# Rollback was a success!

helm history my-nginx
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         superseded  Upgrade complete
# 3         deployed    Rollback to 1   ← 新增一筆，不是回去！

helm uninstall my-nginx
helm list
# (空的) → 準備進 19B`,
    notes: `來對答案。

安裝 my-nginx REVISION 1，upgrade REVISION 2，history 看到 1 superseded 2 deployed。rollback to 1，Rollback was a success。再看 history，REVISION 3 出現了。這就是重點：rollback 不是把 REVISION 砍掉，而是「以舊版設定為基礎，新增一筆部署記錄」。Helm 的 REVISION 只增不減，這讓你隨時可以 rollback 到任何一個歷史版本。

uninstall 清乾淨，helm list 空的。

好，Part 1 到這裡。下一張進 Part 2，有兩個必做加一個挑戰。 [▶ 下一頁]`,
  },

  // ── 6-19B 學員實作 Part 2 ──
  {
    title: '學員實作：upgrade 陷阱 + 自己的 Chart',
    subtitle: '回頭操作 Loop 5 Part 2 — 練習題',
    section: '6-19B：Helm 學員實作 Part 2',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
          <p className="text-blue-300 font-semibold text-sm mb-1">前置確認（避免 IngressClass 衝突）</p>
          <p className="text-slate-300 text-xs font-mono">helm uninstall dev-ingress 2&gt;/dev/null || true</p>
          <p className="text-slate-300 text-xs font-mono">helm list  # 確認空的，沒有 ingress-nginx Release</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">必做 1：upgrade 陷阱</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>① install my-ingress（replicaCount=1）</p>
            <p>② upgrade <strong className="text-red-300">沒帶</strong> replicaCount → replicaCount 會被重置嗎？</p>
            <p>③ <code className="text-green-400">kubectl get deployment</code> 確認副本數</p>
            <p>④ 用 <code className="text-yellow-300">--reuse-values</code> 修正</p>
          </div>
        </div>

        <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-lg">
          <p className="text-purple-300 font-semibold mb-2">必做 2：自己的 Chart</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>① <code className="text-green-400">helm create my-service</code></p>
            <p>② 修改 values.yaml → image: httpd, tag: latest</p>
            <p>③ install → <code className="text-green-400">kubectl describe pod ... | grep Image</code> 確認 httpd:latest</p>
            <p>④ <code className="text-green-400">helm upgrade my-service ./my-service --set image.tag=2.4</code></p>
            <p>⑤ 確認 Image 變成 httpd:2.4</p>
          </div>
        </div>
      </div>
    ),
    code: `# ── 前置確認 ──
helm uninstall dev-ingress 2>/dev/null || true
helm list   # 確認空的，避免 IngressClass 衝突

# ── 必做 1：upgrade 陷阱 ──
helm install my-ingress ingress-nginx/ingress-nginx \\
  --set controller.replicaCount=1 \\
  --set controller.service.type=NodePort

# upgrade 沒帶 replicaCount，會重置嗎？
helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --set controller.service.type=NodePort

kubectl get deployment   # 看 READY 欄位，replicaCount 是否變回預設值？

# 正確做法：--reuse-values 保留上次參數
helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --reuse-values \\
  --set controller.replicaCount=2

# ── 必做 2：自己的 Chart ──
helm create my-service

# 修改 my-service/values.yaml：
# image:
#   repository: httpd
#   tag: "latest"
#   pullPolicy: IfNotPresent
# serviceAccount:
#   create: false
#   name: ""
# httpRoute:
#   enabled: false

helm install my-service ./my-service
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# Image:  httpd:latest

helm upgrade my-service ./my-service --set image.tag=2.4
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# Image:  httpd:2.4`,
    notes: `19B 有兩個必做加一個挑戰。

先做前置確認，helm uninstall dev-ingress 2>/dev/null || true，這行是預防之前 dev-ingress 沒清乾淨造成 IngressClass 衝突。然後 helm list 確認空的。

必做第一題：upgrade 陷阱。install my-ingress 設 replicaCount=1。然後 upgrade，但這次故意不帶 replicaCount，只帶 service.type=NodePort。upgrade 完之後 kubectl get deployment，看 READY 欄位。你會發現 replicaCount 被重置了。這就是 upgrade 陷阱——Helm upgrade 預設不繼承上次的參數。解法是加 --reuse-values，它會把上次 install 的所有值帶進來，你只需要指定你要改的那個。

必做第二題：自己的 Chart。helm create my-service 產生骨架。打開 my-service/values.yaml，把 image.repository 改成 httpd，tag 改成 latest，serviceAccount.create 改 false，httpRoute.enabled 改 false。install 完之後 kubectl describe pod 搭配 grep Image 確認是 httpd:latest。然後 helm upgrade 把 tag 換成 2.4，再 describe 確認變 httpd:2.4。

大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-19B 學員實作解答 ──
  {
    title: '解答：upgrade 陷阱 + 自己的 Chart',
    subtitle: '回頭操作 Loop 5 Part 2 — 解答',
    section: '6-19B：Helm 學員實作 Part 2',
    duration: '0',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做 1 解答：--reuse-values 保留上次參數</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <p>upgrade 沒帶 replicaCount → 重置成預設值（通常是 1）</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <p><code className="text-yellow-300">--reuse-values</code> = 繼承上次所有參數，只覆蓋你帶的那個</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做 2 解答：values.yaml 關鍵修改</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded space-y-1">
            <p className="text-slate-500"># my-service/values.yaml 修改處</p>
            <p>image:</p>
            <p>{'  '}repository: httpd</p>
            <p>{'  '}tag: <span className="text-yellow-300">"latest"</span></p>
            <p>{'  '}pullPolicy: IfNotPresent</p>
            <p>serviceAccount:</p>
            <p>{'  '}create: <span className="text-red-300">false</span></p>
            <p>{'  '}name: <span className="text-slate-500">""</span></p>
            <p>httpRoute:</p>
            <p>{'  '}enabled: <span className="text-red-300">false</span></p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 text-sm font-semibold mb-1">驗證結果</p>
          <p className="text-slate-300 text-xs font-mono">install → Image: httpd:latest</p>
          <p className="text-slate-300 text-xs font-mono">upgrade --set image.tag=2.4 → Image: httpd:2.4</p>
        </div>
      </div>
    ),
    code: `# ── 必做 1 解答 ──
# upgrade 沒帶 replicaCount → 重置！
helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --set controller.service.type=NodePort
kubectl get deployment
# READY 可能變回 1/1（被重置）

# 正確：--reuse-values 保留上次所有參數
helm upgrade my-ingress ingress-nginx/ingress-nginx \\
  --reuse-values \\
  --set controller.replicaCount=2
kubectl get deployment
# READY 2/2  ← 保留了

# ── 必做 2 解答 ──
# values.yaml 修改後 install
helm install my-service ./my-service
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# Image:  httpd:latest  ← 確認是 httpd

# upgrade 換 tag
helm upgrade my-service ./my-service --set image.tag=2.4
kubectl describe pod -l app.kubernetes.io/name=my-service | grep Image
# Image:  httpd:2.4  ← tag 換掉了`,
    notes: `來對答案。

必做第一題：upgrade 沒帶 replicaCount，Helm 預設不繼承上次的參數，所以 replicaCount 被重置成 Chart 預設值。加上 --reuse-values 之後，Helm 會把上次 install 的全部值帶進來，你只需要帶你要改的那個，其他的都保留。

必做第二題：values.yaml 改 image.repository 為 httpd、tag 為 latest、serviceAccount.create 為 false、httpRoute.enabled 為 false。install 之後 describe pod grep Image，確認 httpd:latest。upgrade --set image.tag=2.4，再 grep Image，確認 httpd:2.4。這就是 Helm 自定義 Chart 的基本流程。

好，接下來是挑戰題，Grafana 監控。 [▶ 下一頁]`,
  },

  // ── 6-19B 挑戰：Grafana ──
  {
    title: '挑戰：用 Grafana 看 my-service Pod 資源',
    subtitle: '回頭操作 Loop 5 Part 2 — 挑戰題',
    section: '6-19B：Helm 學員實作 Part 2',
    duration: '0',
    content: (
      <div className="space-y-4">
        <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-lg">
          <p className="text-purple-300 font-semibold mb-2">挑戰目標</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>① 確認 <code className="text-green-400">monitoring</code> Release 是否存在</p>
            <p>② 若不存在 → 重新安裝 kube-prometheus-stack</p>
            <p>③ port-forward Grafana → 開 localhost:3000</p>
            <p>④ 在 Dashboards 找到 my-service Pod 的資源圖</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Grafana 導航路徑</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>Dashboards → <strong className="text-white">Kubernetes / Compute Resources / Pod</strong></p>
            <p>Namespace: <code className="text-yellow-300">default</code> → Pod: <code className="text-yellow-300">my-service-xxx</code></p>
            <p>查看 CPU / Memory 用量圖表</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">最終清理（全部清乾淨）</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p>helm uninstall my-ingress my-service monitoring 2&gt;/dev/null || true</p>
            <p>kubectl delete pvc --all</p>
          </div>
        </div>
      </div>
    ),
    code: `# ── 挑戰：Grafana 監控 ──

# Step 1: 確認 monitoring Release 是否存在
helm list
# NAME        NAMESPACE   STATUS
# my-ingress  default     deployed
# my-service  default     deployed
# monitoring  default     deployed   ← 有就直接用，沒有就裝

# Step 2: 若 monitoring 不存在 → 重新安裝
helm install monitoring prometheus-community/kube-prometheus-stack \\
  --set grafana.adminPassword=admin123

# 等 Pod 就緒（約 2-3 分鐘）
kubectl get pods | grep monitoring

# Step 3: port-forward Grafana
kubectl port-forward svc/monitoring-grafana 3000:80
# Forwarding from 127.0.0.1:3000 -> 3000

# 開瀏覽器：http://localhost:3000
# 帳號: admin  密碼: admin123
# Dashboards → Kubernetes / Compute Resources / Pod
# Namespace: default → Pod: my-service-xxx

# ── 最終清理（全部清乾淨）──
helm uninstall my-ingress my-service monitoring 2>/dev/null || true
kubectl delete pvc --all`,
    notes: `挑戰題：用 Grafana 看 my-service 的 Pod 資源。

先 helm list，確認 monitoring Release 有沒有。如果之前做過 19A 的 Grafana 練習，monitoring 可能還在。如果不在，就 helm install monitoring prometheus-community/kube-prometheus-stack --set grafana.adminPassword=admin123，等個兩三分鐘讓 Pod 起來。

然後 kubectl port-forward svc/monitoring-grafana 3000:80，開瀏覽器 localhost:3000，帳號 admin 密碼 admin123。進去之後找 Dashboards，選 Kubernetes / Compute Resources / Pod，Namespace 選 default，Pod 選 my-service 那個，就可以看到 CPU 跟 Memory 的圖表。

最後清理，helm uninstall my-ingress my-service monitoring 加 2>/dev/null || true，一行清掉三個 Release。再 kubectl delete pvc --all，把 PVC 也清掉。

好，Helm 完整收尾。下一個 Loop 我們看叢集管理工具 Rancher。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 7：RKE + Rancher（6-20, 6-21, 6-22）
  // ============================================================

  // ── 6-20 概念（1/2）：kubectl 太痛苦 → Rancher GUI ──
  {
    title: 'kubectl 管叢集？太痛苦了',
    subtitle: '管三個叢集 = 每天打幾十條指令看狀態',
    section: 'Loop 7：RKE + Rancher',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">叢集管理員的日常痛苦</p>
          <div className="space-y-1 text-sm text-slate-300 font-mono bg-slate-900 p-3 rounded">
            <p className="text-slate-500"># 切到 prod</p>
            <p>kubectl config use-context prod-cluster</p>
            <p>kubectl get deploy --all-namespaces</p>
            <p>kubectl describe deploy xxx -n yyy</p>
            <p>kubectl logs pod-abc -n yyy</p>
            <p>kubectl top nodes</p>
            <p className="text-slate-500"># 再切 staging... 再切 dev...</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">一個巡檢打十幾條指令，三個叢集 x 3</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">Rancher = K8s 叢集管理平台（Web GUI）</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>打開瀏覽器 → 看到所有叢集狀態</p>
            <p>點一下 → Pod 列表、日誌、Web Terminal</p>
            <p>拖滑桿 → 改 replicas</p>
            <p>同時管理 k3s / RKE / EKS / GKE / AKS</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Rancher 能做的事</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <p>1. 叢集總覽（CPU / RAM / Pod 數）</p>
            <p>2. 工作負載管理</p>
            <p>3. Service / Ingress 管理</p>
            <p>4. Storage（PV / PVC）管理</p>
            <p>5. GUI 直接操作（scale / restart）</p>
            <p>6. RBAC 使用者權限管理</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，到目前為止我們跟 K8s 的所有互動都是透過 kubectl 打指令。kubectl get pods、kubectl describe deployment、kubectl logs、kubectl apply -f。每個操作都是一行指令。

一個叢集的時候這樣還行。你記得住大部分常用指令，偶爾查一下文件就好。但想像一下這個場景：你是公司的 DevOps 工程師，管理三個叢集。一個是 dev 叢集，開發用。一個是 staging 叢集，測試用。一個是 prod 叢集，生產環境。

你要看 prod 叢集上所有 Deployment 的狀態，要先切 context。kubectl config use-context prod-cluster。然後 kubectl get deploy --all-namespaces。看到某個 Deployment 有問題，kubectl describe deploy xxx -n yyy。想看 Pod 的日誌，kubectl logs pod-abc -n yyy。想看 Node 的資源使用率，kubectl top nodes。想看誰有什麼權限，kubectl get clusterrolebindings。

一個簡單的巡檢就要打十幾條指令。然後切到 staging 叢集再來一遍。再切到 dev 叢集再來一遍。每天花半個小時在打指令看狀態。

有沒有一個圖形介面，打開瀏覽器就能看到所有叢集的狀態？點一下就能看到 Pod 列表、點一下就能看日誌、拖一個滑桿就能改 replicas？

有，這就是 Rancher。

Rancher 是一個 K8s 叢集管理平台。它提供了一個 Web 介面，讓你用瀏覽器管理 K8s 叢集。你可以同時管理多個叢集，不用切 context。所有叢集的狀態一目了然。 [▶ 下一頁]`,
  },

  // ── 6-20 概念（2/2）：RKE vs k3s + Rancher 定位 ──
  {
    title: 'RKE vs k3s + Rancher 定位',
    subtitle: 'k3s = 輕量學習，RKE = 企業生產，Rancher = 管理平台',
    section: 'Loop 7：RKE + Rancher',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">RKE vs k3s</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">比較</th>
                <th className="text-left py-2">k3s</th>
                <th className="text-left py-2">RKE</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">定位</td>
                <td className="py-2">輕量、邊緣、學習</td>
                <td className="py-2">企業生產環境</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">安裝</td>
                <td className="py-2">curl 一行</td>
                <td className="py-2">需要規劃</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">資源佔用</td>
                <td className="py-2">低</td>
                <td className="py-2">較高</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Rancher</td>
                <td className="py-2">可以管</td>
                <td className="py-2">完整整合</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">kubectl vs Rancher GUI</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-900/60 border border-slate-600 p-3 rounded">
              <p className="text-cyan-400 font-semibold mb-1 text-xs">kubectl</p>
              <p className="text-slate-400 text-xs">自動化、CI/CD、腳本</p>
              <p className="text-slate-500 text-[10px] mt-1">像 Vim：伺服器上快速改檔案</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-600 p-3 rounded">
              <p className="text-green-400 font-semibold mb-1 text-xs">Rancher GUI</p>
              <p className="text-slate-400 text-xs">日常監控、快速操作</p>
              <p className="text-slate-500 text-[10px] mt-1">像 VS Code：坐下來好好開發</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-center">兩者搭配使用 = 叢集管理員的正確姿勢</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">課程標題：K8s 入門到叢集管理員</p>
          <p className="text-slate-300 text-xs mt-1">Rancher = 叢集管理員的日常工具。學會 Rancher = 理解管理員每天在看什麼、在想什麼</p>
        </div>
      </div>
    ),
    notes: `Rancher 是 SUSE 公司的產品。記得 k3s 嗎？k3s 也是 Rancher Labs 開發的。它們是同一家公司的產品線。k3s 是輕量版 K8s，適合學習和邊緣場景。RKE，Rancher Kubernetes Engine，是另一個產品，用來建生產等級的 K8s 叢集。而 Rancher 本身是管理平台，可以同時管理 k3s 叢集、RKE 叢集、雲端的 EKS、GKE、AKS，什麼都能管。

RKE 跟 k3s 的差別在哪？k3s 是輕量快速，一行指令裝好，資源佔用少，適合學習、邊緣、IoT。RKE 功能更完整，安裝需要更多規劃，資源佔用更高，適合企業生產環境。但對我們的課程來說，重點是 Rancher 這個管理介面，不是 RKE。我們的 k3s 叢集可以直接被 Rancher 管理。

Rancher 能做什麼？很多事情。

第一，叢集總覽。打開就看到 CPU 使用率、記憶體使用率、Node 數量、Pod 數量。一眼就知道叢集健不健康。

第二，工作負載管理。看到所有 Deployment、StatefulSet、DaemonSet。點進一個 Deployment，看到它下面的 Pod 列表、每個 Pod 的狀態、重啟次數。點一個 Pod，直接看日誌，不用打 kubectl logs。

第三，Service Discovery。看到所有 Service 和 Ingress。知道哪些服務對外開放、用什麼域名。

第四，Storage。看到所有 PV 和 PVC，知道哪些在用、哪些空閒。

第五，用 GUI 直接操作。想改 Deployment 的 replicas？直接在介面上改。想重啟 Pod？按一個按鈕。想執行 kubectl exec 進容器？點一下就開一個 Web Terminal。

第六，RBAC 管理。管理使用者和權限。這個第七堂會詳細講。

對照 kubectl 來看，kubectl 是命令列工具，適合自動化和腳本。Rancher 是 GUI 工具，適合日常監控和快速操作。兩者不是互相取代，是互相搭配。就像你寫程式可以用 Vim，也可以用 VS Code。Vim 適合伺服器上快速改檔案，VS Code 適合坐下來好好開發。kubectl 和 Rancher 也是一樣，日常巡檢用 Rancher 一目了然，寫自動化腳本用 kubectl。

記得我們這門課的完整標題嗎？Kubernetes 入門到叢集管理員。Rancher 就是叢集管理員的日常工具。學會 Rancher 不只是學會一個 GUI，更是理解叢集管理員每天在看什麼、在想什麼。

好，概念講完了，下一支影片我們來實際安裝 Rancher，親手體驗一下。 [▶ 下一頁]`,
  },

  // ── 6-21 實作（1/2）：安裝 Rancher + 導入 k3s ──
  {
    title: 'Lab：安裝 Rancher + 導入 k3s 叢集',
    subtitle: 'docker run Rancher + Import Existing Cluster',
    section: 'Loop 7：RKE + Rancher',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Docker 啟動 Rancher</li>
            <li>取得 Bootstrap Password</li>
            <li>瀏覽器打開 https://master-IP</li>
            <li>設定 admin 密碼</li>
            <li>Cluster Management → Import Existing</li>
            <li>在 k3s master 上執行 agent 指令</li>
            <li>等叢集狀態變 Active</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">Port 衝突注意</p>
          <p className="text-slate-300 text-xs mt-1">k3s Traefik 佔了 80/443 → Rancher 改用 <code className="text-green-400">-p 8443:443 -p 8080:80</code></p>
        </div>
      </div>
    ),
    code: `# 1. Docker 啟動 Rancher
docker run -d --restart=unless-stopped \\
  -p 80:80 -p 443:443 --privileged \\
  rancher/rancher:latest
# Port 衝突時改用：-p 8443:443 -p 8080:80

# 確認容器跑起來（STATUS 要是 Up，不是 Restarting）
docker ps
# CONTAINER ID   IMAGE                    STATUS         PORTS
# a1b2c3d4e5f6   rancher/rancher:latest   Up 45 seconds  0.0.0.0:80->80/tcp

# 2. 取得初始密碼（要等 Rancher 初始化約 30~60 秒才會出現）
docker logs <容器ID> 2>&1 | grep "Bootstrap Password:"
# Bootstrap Password: abcd1234efgh5678   ← 把這組密碼複製起來

# 3. 瀏覽器打開 https://master-IP
#    看到憑證警告 → 點「繼續前往」（自簽憑證，正常）
#    輸入 Bootstrap Password → 設定新密碼

# 4. 導入 k3s 叢集（指令由 Rancher GUI 產生，以下為範例格式）
# Cluster Management → Import Existing → Generic → 取名 → 執行：
kubectl apply -f https://rancher的IP/v3/import/xxxxxxxx.yaml
# namespace/cattle-system created
# deployment.apps/cattle-cluster-agent created
# ...

# 確認 agent 有跑起來
kubectl get pods -n cattle-system
# NAME                                  READY   STATUS    RESTARTS   AGE
# cattle-cluster-agent-xxx              1/1     Running   0          2m
# 等 1-2 分鐘 → Rancher 介面叢集狀態變 Active`,
    notes: `好，這支影片我們來安裝 Rancher，然後用 GUI 管我們的 k3s 叢集。

Rancher 有很多安裝方式，但我們用最簡單的：直接用 Docker 跑。對，就是用 Docker。Rancher 自己也是一個容器化的應用。

在你的 k3s master 節點上執行。

docker run -d --restart=unless-stopped -p 80:80 -p 443:443 --privileged rancher/rancher:latest

就這一行。Rancher 會跑在 80 和 443 Port 上面。--privileged 是因為 Rancher 需要一些特殊權限來管理叢集。

等它下載 Image 跑起來，大概一兩分鐘。你可以用 docker logs 加容器 ID 看進度。看到 Rancher is listening on 之類的訊息就表示準備好了。

如果你的 k3s master 已經佔了 80 Port（因為 Traefik Ingress Controller），那 Rancher 的 Port 要改一下。改成 -p 8443:443 -p 8080:80，然後用 8443 連。

打開瀏覽器，輸入 https:// 加上 master 的 IP。會看到 HTTPS 憑證警告，因為是自簽憑證，點「繼續前往」就好。

第一次進去會要你設定 admin 密碼。如果它要求你提供 bootstrap password，打這行指令取得。

docker logs 容器ID 2>&1 | grep "Bootstrap Password:"

把那組密碼貼進去，然後設定你自己的新密碼。

好，進到 Rancher 的首頁了。現在要把我們的 k3s 叢集導入進來。

點左上角的選單，選「Cluster Management」。然後點「Import Existing」。為什麼是 Import Existing？因為我們的 k3s 叢集已經建好了，我們只是把它交給 Rancher 管理。如果你要用 Rancher 從零建一個新叢集，就選「Create」。

取個名字，比如 my-k3s-cluster。然後 Rancher 會給你一段 kubectl apply 的指令。把這段指令複製下來，在你的 k3s master 上面執行。

kubectl apply -f https://rancher的IP/v3/import/xxxxxxxx.yaml

這行指令會在你的 k3s 叢集裡面部署 Rancher 的 agent。agent 會跟 Rancher server 溝通，讓 Rancher 可以管理這個叢集。

等個一兩分鐘，回到 Rancher 的介面，你應該看到叢集狀態變成 Active。 [▶ 下一頁]`,
  },

  // ── 6-21 實作（2/2）：GUI 導覽 + scale ──
  {
    title: 'Lab：Rancher GUI 導覽',
    subtitle: 'Dashboard + Workloads + Pod 日誌 + GUI Scale',
    section: 'Loop 7：RKE + Rancher',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">GUI 導覽重點</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-cyan-400 font-semibold">Dashboard</span> -- CPU / RAM / Pod 數 / Node 數，一目了然</p>
            <p><span className="text-cyan-400 font-semibold">Workloads</span> -- 所有 Deployment / StatefulSet，點進去看 Pod 列表</p>
            <p><span className="text-cyan-400 font-semibold">Pod 操作</span> -- View Logs（不用 kubectl logs）/ Execute Shell（不用 kubectl exec）</p>
            <p><span className="text-cyan-400 font-semibold">GUI Scale</span> -- Edit Config → 改 replicas → Save</p>
            <p><span className="text-cyan-400 font-semibold">Service Discovery</span> -- Service + Ingress 一覽</p>
            <p><span className="text-cyan-400 font-semibold">Storage</span> -- PV / PVC 狀態</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">GUI 不能取代 kubectl</p>
          <p className="text-slate-300 text-xs mt-1">CI/CD pipeline 不能去點 Rancher 的按鈕。GUI 適合監控 + 快速操作，kubectl 適合自動化。</p>
        </div>
      </div>
    ),
    notes: `好，開始導覽。

第一個畫面是 Cluster Dashboard。你一眼就能看到 CPU 使用率、記憶體使用率、Pod 數量、Node 數量。一目了然，不用打 kubectl top nodes 然後 kubectl get pods --all-namespaces 然後自己數。

點左邊的 Workloads。你會看到所有的 Deployment、StatefulSet、DaemonSet。看到我們今天建的 MySQL StatefulSet 了嗎？點進去。

你可以看到它下面的 Pod 列表。每個 Pod 的名稱、狀態、IP、所在 Node、重啟次數。點一個 Pod，右邊有幾個按鈕。點 View Logs，直接看到 Pod 的日誌，不用打 kubectl logs。點 Execute Shell，直接開一個 Web Terminal 進到容器裡面，不用打 kubectl exec。

回到 Workloads 頁面。找到一個 Deployment，點右邊的三個點選單，選 Edit Config。你可以在介面上直接改 replicas。改成 3，點 Save。回到 Pod 列表，你會看到新的 Pod 馬上開始建立。

這就是 GUI 的好處。看狀態不用打指令，改設定點點滑鼠。特別是在排查問題的時候，你可以很快地在不同 Pod 之間切換看日誌，不用每次都打一行 kubectl logs。

再看看 Service Discovery。所有的 Service 和 Ingress 都列在這裡。知道哪些服務開了什麼 Port、Ingress 設了什麼域名。

Storage 頁面。看到所有 PV 和 PVC。哪些是 Bound、哪些是 Available、每個多大。

但我要強調一件事。GUI 很方便，但它不能取代 kubectl。自動化部署、CI/CD pipeline、批次操作，這些都需要 kubectl 和 YAML。你不可能讓 CI/CD 工具去點 Rancher 的按鈕。GUI 適合日常監控和快速操作，kubectl 適合自動化和可重現的操作。兩者搭配使用才是正確的姿勢。 [▶ 下一頁]`,
  },

  // ── 6-22 學員實作 ──
  {
    title: '學員實作：安裝 Rancher + GUI 操作',
    subtitle: 'Loop 7 練習題',
    section: 'Loop 7：RKE + Rancher',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：Rancher 安裝 + 導入叢集 + GUI Scale</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Docker 啟動 Rancher</li>
            <li>瀏覽器登入，設定密碼</li>
            <li>Import Existing → 導入 k3s 叢集</li>
            <li>用 GUI 看今天建的 Deployment</li>
            <li>用 GUI 做一次 Scale（改 replicas）</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：用 Rancher GUI 建 Deployment</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Workloads → Deployments → 右上角 Create</li>
            <li>Name: <code className="text-green-400">gui-test</code>，Image: <code className="text-green-400">nginx:1.25</code>，Replicas: 2</li>
            <li>建完用 kubectl 確認：<code className="text-green-400">kubectl get deploy gui-test</code></li>
          </ul>
          <div className="bg-slate-900 p-2 rounded mt-2 font-mono text-xs text-slate-300">
            <p className="text-slate-500"># 預期輸出</p>
            <p>NAME       READY   UP-TO-DATE   AVAILABLE   AGE</p>
            <p>gui-test   2/2     2            2           30s</p>
          </div>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：安裝 Rancher，導入 k3s 叢集，用 GUI 看今天建的 Deployment，用 GUI 做一次 scale。挑戰題：在 Rancher 的 GUI 上建一個新的 Deployment，完全不用 kubectl。大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-22 學員實作解答 ──
  {
    title: '解答：Rancher 安裝 + GUI 操作',
    subtitle: '回頭操作 Loop 7',
    section: 'Loop 7：RKE + Rancher',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做題解答：安裝 Rancher + 導入叢集</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded space-y-1">
            <p className="text-slate-500"># Step 1：Docker 啟動 Rancher</p>
            <p>sudo docker run -d --restart=unless-stopped \</p>
            <p>{'  '}-p 8080:80 -p 8443:443 \</p>
            <p>{'  '}--privileged \</p>
            <p>{'  '}rancher/rancher:latest</p>
            <p className="text-slate-500 mt-1"># Step 2：取得 Bootstrap Password</p>
            <p>sudo docker logs {'<container-id>'} 2&gt;&amp;1 | grep "Bootstrap Password:"</p>
            <p className="text-slate-500 mt-1"># Step 3：瀏覽器 https://{'<VM-IP>'}:8443 → 登入 → Import Existing Cluster</p>
            <p className="text-slate-500"># Step 4：複製 kubectl apply 指令 → 在 k3s master 跑</p>
            <p className="text-slate-500 mt-1"># 驗收：確認 cattle-cluster-agent 是 Running</p>
            <p>kubectl get pods -n cattle-system</p>
            <p className="text-slate-500"># cattle-cluster-agent-xxx   1/1   Running   0   2m</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰題解答：GUI 建 Deployment</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>Workloads → Deployments → Create → 填入：</p>
            <div className="font-mono text-xs bg-slate-900 p-2 rounded mt-1 space-y-1">
              <p>Name: gui-test</p>
              <p>Image: nginx:1.25</p>
              <p>Replicas: 2</p>
            </div>
          </div>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mt-2 space-y-1">
            <p className="text-slate-500"># CLI 驗收</p>
            <p>kubectl get deploy gui-test</p>
            <p className="text-slate-500"># NAME       READY   UP-TO-DATE   AVAILABLE</p>
            <p className="text-slate-500"># gui-test   2/2     2            2</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Rancher 常見三個坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">k3s 節點沒有 Docker</strong> -- k3s 用 containerd，需另裝：<code className="text-green-400">sudo apt install docker.io</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">Port 衝突</strong> -- Traefik 佔了 80/443，Rancher 改用 8443/8080</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">agent 跑錯地方</strong> -- 要在 k3s master 跑，確認 KUBECONFIG 指向 k3s</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，回頭看一下答案。

必做題：Docker 啟動 Rancher，注意 Port 用 8080:80 和 8443:443，因為 Traefik 已經佔了標準 Port。取得 Bootstrap Password 的方式是 docker logs 加上 grep "Bootstrap Password:"。瀏覽器進去之後設好密碼，然後 Add Cluster 選 Import Existing，複製那行 kubectl apply 指令到 k3s master 上跑。

確認成功的方法：kubectl get pods -n cattle-system，看到 cattle-cluster-agent 是 Running 就對了。Rancher 介面的叢集狀態也會從 Pending 變成 Active。

挑戰題：Workloads → Deployments → Create，Name 填 gui-test，Image 填 nginx:1.25，Replicas 設 2。存好之後用 kubectl get deploy gui-test 確認，READY 欄位是 2/2 就成功了。GUI 建的 Deployment 跟 kubectl apply 建的沒有差別，底層都是同一個 API。

來看三個坑。第一，k3s 預設用 containerd 不是 Docker，要另裝 Docker 才能跑 Rancher。第二，Port 衝突，Rancher 要避開 80 和 443。第三，Import 的 agent 指令要在 k3s master 上跑，不是你的本機。

好，Rancher 到這裡。日常用 GUI 看狀態和快速操作，CI/CD 和自動化用 kubectl，兩者搭配。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 8：總結（6-23, 6-24, 6-25）
  // ============================================================

  // ── 6-23 綜合實作引導 ──
  {
    title: '綜合實作：串起今天所有概念',
    subtitle: 'Ingress + ConfigMap + Secret + PV/PVC + StatefulSet + Helm + Rancher',
    section: 'Loop 8：總結',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">完整系統：部落格（前端 + API + MySQL）</p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <div className="bg-green-900/40 border border-green-500/50 px-2 py-1 rounded">
              <p className="text-green-400 font-semibold">Ingress</p>
              <p className="text-slate-400 text-[10px]">域名路由</p>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="bg-blue-900/40 border border-blue-500/50 px-2 py-1 rounded">
              <p className="text-blue-400 font-semibold">前端 Nginx</p>
              <p className="text-slate-400 text-[10px]">Deployment</p>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="bg-amber-900/40 border border-amber-500/50 px-2 py-1 rounded">
              <p className="text-amber-400 font-semibold">後端 API</p>
              <p className="text-slate-400 text-[10px]">ConfigMap+Secret</p>
            </div>
            <span className="text-slate-500">&rarr;</span>
            <div className="bg-purple-900/40 border border-purple-500/50 px-2 py-1 rounded">
              <p className="text-purple-400 font-semibold">MySQL</p>
              <p className="text-slate-400 text-[10px]">StatefulSet+PVC</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">六步搭建完整系統</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><strong className="text-white">MySQL</strong> -- StatefulSet + Headless Service + PVC + Secret</li>
            <li><strong className="text-white">後端 API</strong> -- Deployment + ConfigMap + Secret + ClusterIP Service</li>
            <li><strong className="text-white">前端 Nginx</strong> -- Deployment + ConfigMap + ClusterIP Service</li>
            <li><strong className="text-white">Ingress</strong> -- 域名路由（blog.example.com）</li>
            <li><strong className="text-white">驗證</strong> -- curl 域名、砍 Pod 資料還在、改 ConfigMap</li>
            <li><strong className="text-white">Rancher</strong> -- GUI 看全局狀態</li>
          </ol>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">每個概念都不是孤立的</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p>Ingress → 對外存取 | ConfigMap + Secret → 設定管理</p>
            <p>PV/PVC → 資料持久化 | StatefulSet → 有狀態應用</p>
            <p>Helm → YAML 太多 | Rancher → 叢集管理</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">或者用 Helm 一行搞定</p>
          <p className="text-slate-300 text-sm font-mono"><code className="text-green-400">helm install my-blog bitnami/wordpress</code></p>
          <p className="text-slate-400 text-xs mt-1">WordPress 前端 + MySQL 後端 + PVC + Ingress，全部包好</p>
        </div>
      </div>
    ),
    notes: `好，我們來把今天學的所有東西串成一條線，看看一個完整的系統是怎麼搭起來的。

大家跟我一起想像這個場景。你要在 K8s 上部署一個部落格系統，有前端、有後端 API、有 MySQL 資料庫。使用者用域名連進來，資料不能丟。

第一步，MySQL 資料庫。資料庫是有狀態的，用 StatefulSet 跑。搭配 Headless Service 讓 API 可以用固定的 DNS 名稱連到資料庫。StorageClass 自動佈建 PV，volumeClaimTemplates 給每個 Pod 建獨立的 PVC。密碼用 Secret 管。

第二步，後端 API。API 是無狀態的，用 Deployment 跑。API 的設定，比如資料庫的連線字串、日誌等級、API Port，用 ConfigMap 管理。資料庫密碼用 Secret 注入。Service 類型用 ClusterIP，因為 API 不直接對外，是透過 Ingress 進來的。

第三步，前端 Nginx。也是 Deployment。Nginx 的設定檔用 ConfigMap 掛載。Service 類型也是 ClusterIP。

第四步，Ingress。設定域名路由。blog.example.com 導到前端 Nginx，blog.example.com/api 導到後端 API。

第五步，驗證。用 curl 或瀏覽器打開 blog.example.com，看到前端頁面。打 blog.example.com/api，看到 API 回應。砍掉 MySQL Pod，資料還在。改 ConfigMap 裡的日誌等級，rollout restart API，新設定生效。

第六步，用 Rancher 看。打開 Rancher，在 GUI 上看到所有 Deployment、StatefulSet、Service、Ingress、PVC。一目了然。

你看，今天學的每一個東西都不是孤立的。Ingress 解決了對外存取的問題。ConfigMap 和 Secret 解決了設定管理的問題。PV/PVC 解決了資料持久化的問題。StatefulSet 解決了有狀態應用的問題。Helm 解決了 YAML 太多太散的問題。Rancher 解決了叢集管理的問題。每一個概念都是因為上一步有沒解決的痛點才引出來的。

如果你不想自己手寫所有 YAML，其實用 Helm 一行指令就能搞定。比如 Bitnami 有 WordPress 的 Chart，它裡面已經包了 WordPress 前端加 MySQL 後端加 PVC 加 Ingress。helm install my-blog bitnami/wordpress，就全部跑起來了。這就是下一環節學員自由練習的內容。 [▶ 下一頁]`,
  },

  // ── 6-24 學員自由練習 ──
  {
    title: '學員自由練習：Helm 安裝 WordPress',
    subtitle: 'Loop 8 綜合練習',
    section: 'Loop 8：總結',
    duration: '15',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：Helm 安裝 WordPress</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>加入 Bitnami repo：<code className="text-green-400">helm repo add bitnami https://charts.bitnami.com/bitnami && helm repo update</code></li>
            <li>安裝：<code className="text-green-400">helm install my-blog bitnami/wordpress --set wordpressUsername=admin --set wordpressPassword=mypass123 --set mariadb.auth.rootPassword=rootpass123</code></li>
            <li>等 Pod Running：<code className="text-green-400">kubectl get pods -w</code>（看到兩個 Running 再 Ctrl+C）</li>
            <li>取得連接埠：<code className="text-green-400">kubectl get svc my-blog-wordpress</code> → 找 NodePort 號</li>
            <li>瀏覽器開 <code className="text-green-400">http://&lt;Node-IP&gt;:&lt;NodePort&gt;</code> → 看到 WordPress 歡迎頁面</li>
            <li>用 Rancher GUI 觀察所有建出來的資源</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：自訂 values.yaml</p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded mb-2">
            <p className="text-slate-500"># wp-values.yaml</p>
            <p>wordpressUsername: admin</p>
            <p>wordpressPassword: my-secure-pass</p>
            <p>mariadb:</p>
            <p>{'  '}auth:</p>
            <p>{'    '}rootPassword: db-root-pass</p>
            <p>ingress:</p>
            <p>{'  '}enabled: true</p>
            <p>{'  '}hostname: wordpress.local</p>
          </div>
          <p className="text-slate-300 text-sm"><code className="text-green-400">helm install my-blog bitnami/wordpress -f wp-values.yaml</code></p>
          <p className="text-slate-400 text-xs mt-1">記得在 /etc/hosts 加上：<code className="text-green-300">&lt;Node-IP&gt; wordpress.local</code></p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這一包 Helm Chart 幫你建了什麼？</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-300">WordPress Deployment</span>
            <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-300">MySQL StatefulSet</span>
            <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-300">PVC x 2</span>
            <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-300">Service x 2</span>
            <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-300">Secret</span>
            <span className="bg-green-900/40 border border-green-500/30 px-2 py-1 rounded text-green-300">ConfigMap</span>
          </div>
          <p className="text-slate-400 text-xs mt-2">全部自己手寫？幾百行 YAML。Helm 一行指令搞定。</p>
        </div>
      </div>
    ),
    notes: `接下來是大家的自由練習時間。必做題：用 Helm 安裝一套 WordPress，bitnami/wordpress。它裡面含 MySQL 加 PVC 加 Ingress，全部包好。安裝完之後瀏覽器打開看到 WordPress 的歡迎頁面。挑戰題：自訂 values.yaml 設域名和密碼。大家動手做，有問題舉手。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-24 QA ──
  {
    title: 'QA',
    subtitle: 'helm install vs kubectl apply',
    section: 'Loop 8：總結',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-3">Q：<code className="text-cyan-300">helm install</code> 和 <code className="text-cyan-300">kubectl apply -f</code> 有什麼差別？</p>
          <div className="space-y-3 text-slate-300 text-sm">
            <div className="bg-slate-900/50 p-3 rounded">
              <p className="text-cyan-400 font-mono mb-1">kubectl apply -f</p>
              <p>套用單一 YAML 檔，你要自己管每個資源的生命週期</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded">
              <p className="text-green-400 font-mono mb-1">helm install</p>
              <p>安裝整個 Chart（一包含多個 YAML 的套件）</p>
              <p className="text-slate-400 text-xs mt-1">Helm 幫你管所有資源：安裝、升級、rollback、uninstall 都有對應指令，還有 Release 歷史記錄</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-3">Chart 就像 K8s 的 apt 套件，<code className="text-green-400">helm install</code> 就是裝套件。</p>
        </div>
      </div>
    ),
    notes: `helm install 和 kubectl apply -f 差在哪？kubectl apply -f 是套用單一 YAML 檔，你要自己管每個資源。helm install 是安裝整個 Chart，一包含有多個 YAML 的套件。Helm 幫你管所有資源的生命週期——安裝、升級、rollback、uninstall 都有對應指令，還有 Release 歷史記錄。Chart 就像是 K8s 的 apt 套件，install 就是裝套件。好，學員繼續做，做完的來問我有沒有什麼問題。 [▶ 下一頁]`,
  },

  // ── 6-25 第六堂總結（1/2）：因果鏈回顧 + 指令整理 ──
  {
    title: '第六堂因果鏈回顧',
    subtitle: 'NodePort → Ingress → ConfigMap → Secret → PV/PVC → StorageClass → StatefulSet → Helm → Rancher',
    section: 'Loop 8：總結',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">今天的因果鏈</p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400">IP:NodePort 太醜</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">Ingress</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">設定寫死在 Image</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">ConfigMap + Secret</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">Pod 重啟資料消失</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">PV + PVC</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">手動建 PV 太煩</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">StorageClass</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">Deployment 不適合 DB</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">StatefulSet</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">YAML 太多太散</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">Helm</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">kubectl 管叢集太痛苦</span>
              <span className="text-slate-500">&rarr;</span>
              <span className="text-green-400 font-semibold">Rancher</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天新學的指令</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300 font-mono">
            <p>kubectl get ingress</p>
            <p>kubectl describe ingress</p>
            <p>kubectl get pv</p>
            <p>kubectl get pvc</p>
            <p>kubectl get storageclass</p>
            <p>kubectl get statefulset (sts)</p>
            <p>kubectl scale sts ... --replicas=N</p>
            <p>helm repo add / update</p>
            <p>helm search repo</p>
            <p>helm install / upgrade</p>
            <p>helm list / history</p>
            <p>helm rollback / uninstall</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 對照表更新</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1">Docker</th>
                <th className="text-left py-1">K8s</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-1">docker volume create</td>
                <td className="py-1">PV</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">docker run -v</td>
                <td className="py-1">PVC</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">docker-compose.yml</td>
                <td className="py-1">Helm Chart</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-1">docker compose up/down</td>
                <td className="py-1">helm install/uninstall</td>
              </tr>
              <tr>
                <td className="py-1">.env</td>
                <td className="py-1">values.yaml</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `好，大家辛苦了。今天的內容非常多，我們來做一個完整的回顧。

今天一整天走了一條很長的因果鏈。我帶大家從頭串一遍。

起點是第五堂結束的狀態。使用者要用 IP 加 NodePort 才能連進來，地址太醜。所以我們學了 Ingress，用域名和路徑做路由，Path-based 和 Host-based 兩種方式都學了。有了域名也學了 TLS 做 HTTPS。

Ingress 搞定了，但設定寫死在 Image 裡面。改一個環境變數就要重新 build Image，密碼寫在 Dockerfile 裡更是災難。所以我們學了 ConfigMap 管一般設定、Secret 管敏感資料。ConfigMap 可以環境變數注入也可以 Volume 掛載。Secret 用 Base64 編碼但不是加密，安全性靠 RBAC。

設定和密碼分離了，服務跑起來了。但 MySQL Pod 一重啟，資料全部消失。所以我們學了 PV 和 PVC。PV 是管理員建的儲存空間，PVC 是開發者的使用申請。兩者配對之後 Pod 掛載 PVC，資料就不怕 Pod 重啟了。

但手動建 PV 太煩了，十個微服務要建十個 PV。所以我們學了 StorageClass，動態佈建。開發者建 PVC，K8s 自動建 PV。k3s 內建了 local-path StorageClass，不用自己設。

有了持久化方案，資料庫可以正式跑了。但 Deployment 不適合跑資料庫。名字不固定、沒有順序、共用 PVC、沒有穩定 DNS。所以我們學了 StatefulSet。固定序號、有序啟動、獨立 PVC、搭配 Headless Service 讓每個 Pod 有自己的 DNS。

到這裡 YAML 已經多到爆了。一個 MySQL 就要 Secret 加 Headless Service 加 StatefulSet 加 PVC。所以我們學了 Helm，K8s 的套件管理器。一行 helm install 搞定，values.yaml 管參數，helm rollback 做版本管理。

最後，全部用 kubectl 管叢集太痛苦了。想看全局狀態要打一堆指令。所以我們學了 Rancher，用瀏覽器管叢集。一目了然，點點滑鼠就能操作。

來整理一下今天新學的指令。

kubectl get pv 看 PersistentVolume。kubectl get pvc 看 PersistentVolumeClaim。kubectl get storageclass 看 StorageClass。kubectl get statefulset 看 StatefulSet。kubectl scale statefulset 名稱 --replicas=N 做 StatefulSet 的擴縮容。helm repo add 加倉庫。helm search repo 搜尋 Chart。helm install 安裝。helm list 看已安裝的 Release。helm upgrade 升級。helm rollback 回滾。helm uninstall 解除安裝。helm show values 看 Chart 的參數。

再來更新我們的 Docker 對照表。docker volume create 對應 PV。docker run -v 對應 PVC。docker run --name 固定名稱對應 StatefulSet 的穩定身份。Docker Compose 的 docker-compose.yml 對應 Helm 的 Chart。docker compose up 對應 helm install。docker compose down 對應 helm uninstall。.env 檔案對應 values.yaml。 [▶ 下一頁]`,
  },

  // ── 6-25 第六堂總結（2/2）：回家作業 + 預告 ──
  {
    title: '回家作業 + 下堂課預告',
    subtitle: '第六堂結束',
    section: 'Loop 8：總結',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">回家作業</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-0.5 rounded text-cyan-300 text-xs font-semibold">1</span>
              <p>用 Helm 安裝一套 WordPress，瀏覽器看到歡迎頁面</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-cyan-900/40 border border-cyan-500/40 px-2 py-0.5 rounded text-cyan-300 text-xs font-semibold">2</span>
              <p>用你自己的話寫一段「NodePort → Rancher」的因果鏈推導（幾句話串起來就好）</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">下堂課預告：生產就緒</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-red-400">Pod 活著但不處理請求？</span> → <strong className="text-white">Probe 健康檢查</strong></p>
            <p><span className="text-red-400">記憶體洩漏吃光 Node？</span> → <strong className="text-white">Resource limits</strong></p>
            <p><span className="text-red-400">流量暴增沒人 scale？</span> → <strong className="text-white">HPA 自動擴縮</strong></p>
            <p><span className="text-red-400">新人 delete namespace？</span> → <strong className="text-white">RBAC 權限控制</strong></p>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">今天的比喻收尾</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <p>域名 = 門牌</p>
            <p>ConfigMap + Secret = 名片夾</p>
            <p>PV/PVC = 保險箱</p>
            <p>Helm = 購物車</p>
            <p>Rancher = 監控攝影機</p>
            <p className="text-amber-400 font-semibold col-span-2 mt-1">下堂課：穿得漂亮不夠，還要扛得住！</p>
          </div>
        </div>
      </div>
    ),
    notes: `回家作業。第一題，用 Helm 安裝一套 WordPress，打開瀏覽器看到 WordPress 的歡迎頁面。第二題，回顧今天所有的因果鏈，用你自己的話寫一段 NodePort 到 Rancher 的推導過程。不用寫長篇大論，幾句話串起來就好。重點是理解每個概念是為了解決什麼問題而存在的。

下堂課預告。今天你的系統跑起來了，域名有了、設定分離了、密碼安全了、資料持久了、套件管理有了、GUI 監控有了。但是，系統真的準備好面對生產環境了嗎？

想想看。你的 API Pod 裡面的程式死鎖了，process 還活著但不處理任何請求。K8s 看 Pod 的狀態是 Running，因為 process 沒有退出。Service 照樣把流量送過去，使用者看到的是 502 Bad Gateway。K8s 怎麼知道 Pod 活著但不健康？這就是 Probe，健康檢查。

再想一個。一個 Pod 裡面的程式有記憶體洩漏，越吃越多，把整台 Node 的記憶體吃光了。Node 上的其他 Pod 全部跟著掛。怎麼限制一個 Pod 最多能用多少 CPU 和記憶體？這就是 Resource limits。

還有。流量突然暴增，你的三個 Pod 扛不住了。但你在睡覺，沒人打 kubectl scale。等你醒來的時候使用者已經罵翻了。有沒有辦法讓 K8s 自動根據 CPU 使用率擴容？這就是 HPA，水平自動擴縮。

最後。你的叢集上有十個團隊在跑服務。有個新人不小心打了 kubectl delete namespace production。所有生產環境的服務全部消失。怎麼控制誰能做什麼？這就是 RBAC，角色存取控制。

下堂課的主題是「生產就緒」。Probe 健康檢查、Resource 資源限制、HPA 自動擴縮、RBAC 權限控制、NetworkPolicy 網路隔離。最後我們會從零建一套完整的系統，把四堂課學的所有東西全部用上。

用一個比喻來收尾。今天你給你的服務穿上了正式的衣服：域名是門牌、設定和密碼是名片夾、資料持久化是保險箱、套件管理是購物車、GUI 管理是監控攝影機。下堂課，我們要讓這個服務通過生產環境的壓力測試。穿得漂亮不夠，還要扛得住。

大家辛苦了，我們下堂課見。 [▶ 第六堂結束]`,
  },
]
