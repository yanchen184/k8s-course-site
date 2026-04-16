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
    subtitle: '這份 YAML 有三個 bug，找出來修好讓 PostgreSQL 正常啟動',
    section: '6-13：回頭操作 Loop 4',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">必做：故障診斷題</p>
          <p className="text-slate-300 text-sm mb-2">以下 YAML 有三個錯誤，找出來並修好，讓 PostgreSQL 可以正常啟動並持久化資料</p>
          <p className="text-slate-400 text-xs mb-2">hint：仔細看 PV 和 PVC 的 accessModes、storageClassName、storage 容量</p>
          <p className="text-slate-400 text-xs">修好後：<code className="text-green-400">kubectl get pv,pvc</code> → 兩個都是 <strong className="text-green-400">Bound</strong></p>
          <p className="text-slate-400 text-xs mt-1">注意：題目只有 PV + PVC，需要自己再加 PostgreSQL Deployment 掛 pg-pvc</p>
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
    code: `# ── 題目 YAML（broken-pv-pvc.yaml）──
# 這份 YAML 有三個錯誤，找出來！

apiVersion: v1
kind: PersistentVolume
metadata:
  name: pg-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  storageClassName: manual
  hostPath:
    path: /tmp/pg-pv-data
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pg-pvc
spec:
  accessModes:
    - ReadWriteMany       # ← bug？
  storageClassName: fast  # ← bug？
  resources:
    requests:
      storage: 2Gi        # ← bug？

# 修好後測試：
kubectl apply -f broken-pv-pvc.yaml
kubectl get pv,pvc
# 目標：兩個都是 Bound`,
    notes: `接下來是大家的實作時間。

這份 YAML 有三個錯誤，你要找出來並修好，讓 PostgreSQL 可以正常啟動並持久化資料。題目 YAML 在 code 區塊，自己看、自己找，不要看解答頁。

hint：仔細對照 PV 和 PVC 的三個欄位——accessModes、storageClassName、storage 容量。PVC 要能跟 PV 配對，這三個都要符合。

修好之後 kubectl apply，然後 kubectl get pv,pvc，兩個都要是 Bound 才算成功。

挑戰題：在 local-pv 已經被 local-pvc 綁定的情況下，再建一個 local-pvc2，requests 1Gi。觀察 kubectl get pvc，local-pvc2 的 STATUS 是什麼，說明為什麼。

大家動手做，有問題舉手。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
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
    duration: '3',
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

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">套用後看到三行輸出</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p><span className="text-green-400">service/mysql-headless</span> created</p>
            <p><span className="text-green-400">secret/mysql-sts-secret</span> created</p>
            <p><span className="text-green-400">statefulset.apps/mysql</span> created</p>
          </div>
        </div>
      </div>
    ),
    code: `# 1. 確認 k3s 的 StorageClass 有在
kubectl get storageclass
# NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE
# local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer

# 2. 套用 YAML（三件套：Headless Service + Secret + StatefulSet）
kubectl apply -f ~/workspace/k8s-course-labs/lesson6/statefulset-mysql.yaml
# service/mysql-headless created
# secret/mysql-sts-secret created
# statefulset.apps/mysql created`,
    notes: `好，概念講完了，現在來動手做。

第一步，先確認 k3s 有預設的 StorageClass。

kubectl get storageclass

你應該看到 local-path (default)，provisioner 是 rancher.io/local-path。有了這個，我們的 PVC 就不用手動建 PV，K8s 會自動搞定。

確認有了之後，套用 YAML。

kubectl apply -f ~/workspace/k8s-course-labs/lesson6/statefulset-mysql.yaml

你應該看到三行輸出：service/mysql-headless created、secret/mysql-sts-secret created、statefulset.apps/mysql created。三件套一次到位。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（2/5）：觀察有序啟動 ──
  {
    title: 'Lab：觀察有序啟動',
    subtitle: 'kubectl get pods -w — mysql-0 先 Ready 再 mysql-1',
    section: '6-15：StatefulSet MySQL 實作',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">StatefulSet 有序啟動</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="bg-green-900/40 border border-green-500/40 px-2 py-0.5 rounded text-green-300 text-xs font-semibold">Step 1</span>
              <p>mysql-0 先出現：Pending → ContainerCreating → Running</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-900/40 border border-amber-500/40 px-2 py-0.5 rounded text-amber-300 text-xs font-semibold">Step 2</span>
              <p>mysql-0 完全 Ready 後，mysql-1 才開始建</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-600/40">
          <p className="text-slate-400 text-xs mb-2">對比 Deployment（同時啟動）vs StatefulSet（依序 0→1）</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-red-900/20 p-2 rounded border border-red-500/20">
              <p className="text-red-400 font-semibold mb-1">Deployment</p>
              <p className="text-slate-400">app-abc 和 app-xyz 同時啟動</p>
            </div>
            <div className="bg-green-900/20 p-2 rounded border border-green-500/20">
              <p className="text-green-400 font-semibold mb-1">StatefulSet</p>
              <p className="text-slate-400">mysql-0 Ready 才建 mysql-1</p>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `# 觀察有序啟動（-w = watch）
kubectl get pods -w
# NAME      READY   STATUS              RESTARTS   AGE
# mysql-0   0/1     ContainerCreating   0          1s
# mysql-0   1/1     Running             0          15s
# mysql-1   0/1     Pending             0          0s
# mysql-1   1/1     Running             0          20s
#
# ↑ mysql-0 完全 Ready 後，mysql-1 才開始建
# Ctrl+C 結束 watch`,
    notes: `套用完了，馬上用 -w 觀察。

kubectl get pods -w

注意看順序。你會看到 mysql-0 先出現，狀態從 ContainerCreating 變成 Running。mysql-0 完全 Ready 之後，mysql-1 才開始 Pending，然後才 ContainerCreating，最後 Running。

這就是有序啟動。Deployment 的兩個 Pod 會同時開始建。StatefulSet 不一樣，它保證 0 號先起來，0 號好了 1 號才動。

等兩個都 Running，按 Ctrl+C。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（3/5）：確認固定名稱 + 獨立 PVC ──
  {
    title: 'Lab：確認固定名稱 + 獨立 PVC',
    subtitle: 'kubectl get pods + kubectl get pvc',
    section: '6-15：StatefulSet MySQL 實作',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">固定名稱</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p><span className="text-green-400">mysql-0</span>   1/1     Running   0          2m</p>
            <p><span className="text-green-400">mysql-1</span>   1/1     Running   0          1m</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">固定序號，不是 random hash（如 abc-xyz）</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">獨立 PVC（自動建立）</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p><span className="text-amber-400">mysql-data-mysql-0</span>   Bound   pvc-a1b2...   1Gi   RWO</p>
            <p><span className="text-amber-400">mysql-data-mysql-1</span>   Bound   pvc-b2c3...   1Gi   RWO</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">volumeClaimTemplates 自動為每個 Pod 建獨立 PVC</p>
        </div>
      </div>
    ),
    code: `# 確認固定 Pod 名稱（序號，不是 random hash）
kubectl get pods -l app=mysql-sts
# NAME      READY   STATUS    RESTARTS   AGE
# mysql-0   1/1     Running   0          2m
# mysql-1   1/1     Running   0          1m

# 確認每個 Pod 有獨立 PVC（自動建立）
kubectl get pvc
# NAME                 STATUS   VOLUME         CAPACITY   ACCESS MODES   STORAGECLASS
# mysql-data-mysql-0   Bound    pvc-a1b2c3d4   1Gi        RWO            local-path
# mysql-data-mysql-1   Bound    pvc-b2c3d4e5   1Gi        RWO            local-path`,
    notes: `看看 Pod 名稱。

kubectl get pods -l app=mysql-sts

mysql-0 和 mysql-1。固定的序號，不是 random hash。這是 StatefulSet 的第一個特性。

看 PVC。

kubectl get pvc

mysql-data-mysql-0 和 mysql-data-mysql-1。每個 Pod 有自己的 PVC，自動建立的，不用手動 apply PVC YAML。這是 volumeClaimTemplates 的功能。

兩個 PVC 都是 Bound 狀態，代表已經綁定到實際的 Volume，可以用了。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（4/5）：驗證資料持久化 3 步驟 ──
  {
    title: 'Lab：砍 mysql-0 → 資料還在！',
    subtitle: 'exec CREATE DATABASE → delete pod → exec SHOW DATABASES',
    section: '6-15：StatefulSet MySQL 實作',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證資料持久化 3 步驟</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li>進 mysql-0 建一個資料庫 <code className="text-green-400">testdb</code></li>
            <li>砍掉 mysql-0（<code className="text-green-400">kubectl delete pod mysql-0</code>）</li>
            <li>新 mysql-0 起來後查 <code className="text-green-400">SHOW DATABASES;</code> → testdb 還在！</li>
          </ol>
        </div>
        <div className="bg-green-900/30 border border-green-500/40 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">為什麼資料還在？</p>
          <p className="text-slate-300 text-sm">新 mysql-0 掛載的還是 <strong className="text-white">mysql-data-mysql-0</strong> 這個 PVC，資料從未丟失</p>
        </div>
      </div>
    ),
    code: `# Step 1：進 mysql-0 建資料庫
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
# mysql: [Warning] Using a password on the command line interface can be insecure.

# Step 2：砍掉 mysql-0
kubectl delete pod mysql-0
# pod "mysql-0" deleted

# 等新 mysql-0 重建 Running
kubectl get pods -w
# mysql-0   0/1     ContainerCreating   0          1s
# mysql-0   1/1     Running             0          15s

# Step 3：查資料庫 → testdb 還在！
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
# +--------------------+
# | Database           |
# +--------------------+
# | information_schema |
# | mysql              |
# | performance_schema |
# | sys                |
# | testdb             |    ← 這個！資料還在
# +--------------------+`,
    notes: `現在來驗證資料持久化，這是最精彩的部分。

第一步，進 mysql-0 建一個資料庫。

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"

你會看到一個 Warning 說密碼放在指令列不安全，這個正常，忽略它。

第二步，砍掉 mysql-0。

kubectl delete pod mysql-0

然後觀察。

kubectl get pods -w

mysql-0 被砍了，StatefulSet 會重建一個新的 mysql-0。注意，名字還是 mysql-0，不是什麼 mysql-abc-xyz。等它 Running 之後，進去查資料。

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"

你看，testdb 還在。因為新的 mysql-0 掛載的還是 mysql-data-mysql-0 這個 PVC，資料沒有丟。這就是 StatefulSet + PVC 的威力。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（5/5）：Headless DNS + Scale ──
  {
    title: 'Lab：Headless DNS + Scale 擴縮容',
    subtitle: 'nslookup mysql-0.mysql-headless + scale 3 → 2',
    section: '6-15：StatefulSet MySQL 實作',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Headless Service DNS</p>
          <p className="text-slate-300 text-sm mb-2">每個 Pod 有自己的 DNS：<code className="text-cyan-300">pod名稱.service名稱.namespace.svc.cluster.local</code></p>
          <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded">
            <p>mysql-0.mysql-headless.default.svc.cluster.local</p>
            <p>mysql-1.mysql-headless.default.svc.cluster.local</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">有序擴縮容</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-900/20 p-2 rounded border border-green-500/20">
              <p className="text-green-400 font-semibold">Scale up 3</p>
              <p className="text-slate-400">mysql-2 最後才建</p>
            </div>
            <div className="bg-amber-900/20 p-2 rounded border border-amber-500/20">
              <p className="text-amber-400 font-semibold">Scale down 2</p>
              <p className="text-slate-400">mysql-2 先被刪（反序）</p>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `# 驗證 Headless Service DNS
kubectl run dns-test --image=busybox:1.28 --restart=Never --rm -it -- \\
  nslookup mysql-0.mysql-headless
# Name:      mysql-0.mysql-headless
# Address 1: 10.42.0.X mysql-0.mysql-headless.default.svc.cluster.local

# Scale 擴容到 3（有序新增 mysql-2）
kubectl scale statefulset mysql --replicas=3
kubectl get pods -w
# mysql-2   0/1     Pending   0          0s
# mysql-2   1/1     Running   0          20s

# Scale 縮容回 2（反序刪除 mysql-2 先）
kubectl scale statefulset mysql --replicas=2
kubectl get pods -w
# mysql-2   1/1     Terminating   0          2m

# 縮容後刪除多餘 PVC（StatefulSet 不自動刪）
kubectl delete pvc mysql-data-mysql-2`,
    notes: `最後來驗證 Headless Service 的 DNS 功能。

每個 Pod 都有自己的 DNS 名稱，格式是 Pod名稱點Service名稱。

kubectl run dns-test --image=busybox:1.28 --restart=Never --rm -it -- nslookup mysql-0.mysql-headless

你會看到它解析到 mysql-0 的 IP，完整域名是 mysql-0.mysql-headless.default.svc.cluster.local。這讓其他服務可以直接連線到指定的 Pod，不像普通 Service 是負載均衡的。

來試試擴縮容。

kubectl scale statefulset mysql --replicas=3

用 -w 觀察，你會看到 mysql-2 最後才建立，等前面的都 Ready 了才輪到它。

縮容回 2。

kubectl scale statefulset mysql --replicas=2

反序刪除，mysql-2 先被刪。

注意一個重點：StatefulSet 縮容後，多出來的 PVC 不會自動刪除，要手動 delete。這是設計如此，為了保護資料。 [▶ 下一頁]`,
  },

  // ── 6-16 學員實作（1/2）：學員任務題 ──
  {
    title: '學員實作：StatefulSet Redis 快取叢集',
    subtitle: '6-16 練習題 — 自己寫 Redis StatefulSet（不給模板）',
    section: '6-16：Redis StatefulSet 學員實作',
    duration: '7',
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
            <li>Scale 到 3，用 <code className="text-yellow-300">-w</code> 看 redis-2 最後才建</li>
            <li>Scale 回 1，確認刪除順序：redis-2 先刪還是 redis-1 先刪？</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 提示：YAML 結構關鍵點
# kind: StatefulSet
# spec:
#   serviceName: redis-headless   ← 對應 Headless Service
#   replicas: 2
#   volumeClaimTemplates:         ← 每個 Pod 獨立 PVC
#     - metadata:
#         name: redis-data
#       spec:
#         accessModes: ["ReadWriteOnce"]
#         resources:
#           requests:
#             storage: 500Mi

# 驗收指令（做完跑這三個）
kubectl get pods          # 看到 redis-0, redis-1
kubectl get pvc           # 看到兩個獨立 PVC
kubectl delete pod redis-0 && kubectl get pods -w  # 重建後名稱還是 redis-0`,
    notes: `接下來是大家的實作時間。必做題：你的團隊要部署 Redis 快取叢集，要求每個 Pod 有固定名稱、有序啟動、各自獨立的 500Mi 儲存。

自己寫一個 StatefulSet YAML，image 用 redis:7，2 個副本，volumeClaimTemplates 每個 500Mi。

注意：這題不給完整模板，要自己寫。但我給了你結構提示，照著補就好。

驗收三點：kubectl get pods 要看到 redis-0 和 redis-1，kubectl get pvc 要看到兩個獨立的 PVC，刪掉 redis-0 之後重建的 Pod 名稱還是 redis-0。

挑戰題：scale 到 3，觀察 redis-2 最後才建；scale 回 1，記錄刪除順序。大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-16 學員實作（2/2）：解答 + 清理 ──
  {
    title: '解答：Redis StatefulSet + 清理',
    subtitle: '完整 YAML 解答 + 驗收指令 + kubectl delete 清理',
    section: '6-16：Redis StatefulSet 學員實作',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗收三點</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get statefulset</code> -- redis READY 2/2</li>
            <li><code className="text-green-400">kubectl get pods</code> -- redis-0、redis-1 Running</li>
            <li><code className="text-green-400">kubectl get pvc</code> -- 兩個 PVC 都是 Bound</li>
          </ol>
        </div>
        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">StatefulSet 常見三個坑</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p><span className="text-red-400 font-bold">1.</span> <strong className="text-white">volumeClaimTemplates 縮排錯</strong> -- 跟 template 平級，不是在 template 裡面</p>
            <p><span className="text-red-400 font-bold">2.</span> <strong className="text-white">忘了建 Headless Service</strong> -- StatefulSet 能起來但 DNS 解析不了</p>
            <p><span className="text-red-400 font-bold">3.</span> <strong className="text-white">serviceName 打錯</strong> -- 要跟 Headless Service 的 metadata name 完全一致</p>
          </div>
        </div>
        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">銜接下一個 Loop</p>
          <p className="text-slate-300 text-xs mt-1">PV、PVC、StorageClass、StatefulSet、Headless Service、Secret... 一個 MySQL 就要這麼多 YAML。如果還有 Redis、RabbitMQ、ES？ → Helm</p>
        </div>
      </div>
    ),
    code: `# ── 完整解答：redis-statefulset.yaml ──
apiVersion: v1
kind: Service
metadata:
  name: redis-headless
spec:
  clusterIP: None
  selector:
    app: redis
  ports:
    - port: 6379
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis-headless
  replicas: 2
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7
          ports:
            - containerPort: 6379
          volumeMounts:
            - name: redis-data
              mountPath: /data
  volumeClaimTemplates:
    - metadata:
        name: redis-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 500Mi

# ── 清理（下個 Loop 前先清乾淨）──
kubectl delete statefulset mysql redis
kubectl delete svc mysql-headless redis-headless
kubectl delete secret mysql-sts-secret
kubectl delete pvc --all
kubectl get all    # 確認清乾淨`,
    notes: `好，來看解答。

完整的 redis-statefulset.yaml 分兩個部分。

第一個是 Headless Service，name 叫 redis-headless，clusterIP: None，selector 設 app: redis，port 6379。

第二個是 StatefulSet，serviceName 設 redis-headless，replicas 2。template 裡面的容器 image 是 redis:7，volumeMounts 掛在 /data。volumeClaimTemplates 設 storage 500Mi，accessModes ReadWriteOnce。

常見的三個坑。第一個，volumeClaimTemplates 縮排。這個欄位在 spec 下面，跟 template 同級，不是在 template 裡面。第二個，忘了建 Headless Service。StatefulSet 的 serviceName 指向的 Service 必須存在。第三個，serviceName 打錯，一個字都不能錯。

驗收通過了之後，做清理，下一個 Loop 要用 Helm，環境要乾淨。

kubectl delete statefulset mysql redis
kubectl delete svc mysql-headless redis-headless
kubectl delete secret mysql-sts-secret
kubectl delete pvc --all

最後 kubectl get all 確認清乾淨。

到這裡，大家回想一下。PV、PVC、StorageClass、StatefulSet、Headless Service、Secret，一個 MySQL 就要這麼多 YAML。下一個 Loop 要介紹 Helm，讓你一行指令就能搞定這些事情。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 6：Helm（6-17, 6-18, 6-19）
  // ============================================================

  // ── 6-17 概念（1/6）：YAML 太多的問題 ──
  {
    title: 'YAML 太多太散了',
    subtitle: '一個 MySQL 就要五六個 YAML，三個環境維護三套？',
    section: '6-17：Helm 概念',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">一個 MySQL 服務要多少 YAML？</p>
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">Secret</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">ConfigMap</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">StatefulSet</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">Headless Service</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">PVC</span>
            <span className="bg-red-900/40 border border-red-500/30 px-2 py-1 rounded text-red-300">Ingress</span>
          </div>
          <p className="text-slate-400 text-xs">再加 Redis、RabbitMQ、ES... 幾十個檔案、幾千行 YAML</p>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">三個環境 = 三套 YAML？</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center mb-2">
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
          <p className="text-slate-400 text-xs">改一個東西三個地方都要改？</p>
        </div>

        <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg text-sm text-slate-300">
          <span className="text-amber-400 font-semibold">痛點：</span>全世界幾百萬人都在 K8s 上跑 MySQL，每個人都在寫一樣的 YAML。有沒有人把最佳實踐打包好，直接拿來用？
        </div>
      </div>
    ),
    code: `# 一個 MySQL 要手寫這麼多 YAML...
kubectl apply -f mysql-secret.yaml
kubectl apply -f mysql-configmap.yaml
kubectl apply -f mysql-headless-svc.yaml
kubectl apply -f mysql-statefulset.yaml
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-ingress.yaml

# 三個環境就是三套... 改密碼要改三個地方
# dev/mysql-secret.yaml
# staging/mysql-secret.yaml
# prod/mysql-secret.yaml`,
    notes: `好，上一個 Loop 結束之後我問了大家一個問題：YAML 太多了。我們來算一下。

今天一個 MySQL 服務，你要寫 Secret 管密碼、ConfigMap 管設定、StatefulSet 跑 MySQL、Headless Service 做 DNS、PVC 要儲存空間。五個 K8s 資源。如果再加上 Ingress，六個。

你的系統不只有 MySQL 吧？可能還有 Redis、RabbitMQ、Elasticsearch。每個都要寫一堆 YAML。加起來幾十個檔案，幾千行。

然後你要部署到 dev、staging、prod 三個環境。三個環境的 YAML 基本上一樣，只是 replicas 不同、Image tag 不同、密碼不同。你是要維護三套 YAML？改了一個東西三個地方都要改？

還有一個問題。全世界有幾百萬人在 K8s 上跑 MySQL，每個人都在寫一樣的東西。有沒有人已經把最佳實踐打包好，你直接拿來用？ [▶ 下一頁]`,
  },

  // ── 6-17 概念（2/6）：套件管理器類比 ──
  {
    title: 'Helm = K8s 的套件管理器',
    subtitle: '就像 apt / brew / npm，一行指令搞定所有東西',
    section: '6-17：Helm 概念',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">你已經用過的套件管理器</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">平台</th>
                <th className="text-left py-2">工具</th>
                <th className="text-left py-2">一行安裝</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">Ubuntu</td>
                <td className="py-2 text-green-400">apt</td>
                <td className="py-2 font-mono text-xs">apt install nginx</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">macOS</td>
                <td className="py-2 text-green-400">brew</td>
                <td className="py-2 font-mono text-xs">brew install nginx</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">Node.js</td>
                <td className="py-2 text-green-400">npm</td>
                <td className="py-2 font-mono text-xs">npm install express</td>
              </tr>
              <tr>
                <td className="py-2">Python</td>
                <td className="py-2 text-green-400">pip</td>
                <td className="py-2 font-mono text-xs">pip install flask</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-cyan-900/30 border border-cyan-500/50 p-4 rounded-lg">
          <p className="text-cyan-300 font-semibold mb-2">K8s 的答案</p>
          <p className="text-slate-300 text-sm">Kubernetes 太複雜，部署一個應用需要 5-6 個 YAML。</p>
          <p className="text-yellow-300 text-sm mt-2 font-semibold">→ Helm 就是 K8s 的 apt / brew / npm</p>
          <p className="text-slate-300 text-sm mt-1 font-mono">helm install my-nginx ingress-nginx/ingress-nginx  ← 一行搞定</p>
        </div>
      </div>
    ),
    code: `# 類比：你早就在用套件管理器了
# Ubuntu：  apt   install  nginx
# macOS：   brew  install  nginx
# Node.js： npm   install  express
# Python：  pip   install  flask

# K8s 的答案就是 Helm
# helm install <release-name> <chart>
helm install my-nginx ingress-nginx/ingress-nginx
# 一行指令，幫你建立所有 K8s 資源`,
    notes: `類比是這節最重要的概念。學員都用過 apt 或 npm，這個類比讓他們立刻理解 Helm 是什麼。

重點：Helm 不是發明了新的東西，只是把 K8s 世界的「最佳實踐 YAML」打包成可重用的套件。 [▶ 下一頁]`,
  },

  // ── 6-17 概念（3/6）：四大核心概念 ──
  {
    title: 'Helm 四大核心概念',
    subtitle: 'Chart / Release / Repository / values.yaml',
    section: '6-17：Helm 概念',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">Helm 術語</th>
                <th className="text-left py-2">說明</th>
                <th className="text-left py-2 w-28">apt 對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Helm</td>
                <td className="py-2">K8s 套件管理工具（CLI）</td>
                <td className="py-2">apt</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-yellow-400 font-semibold">Chart</td>
                <td className="py-2">打包好的 K8s 應用（含所有 YAML 模板）</td>
                <td className="py-2">.deb 套件</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-green-400 font-semibold">Release</td>
                <td className="py-2">Chart 安裝後的執行實例（有名字）</td>
                <td className="py-2">已安裝的程式</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-purple-400 font-semibold">Repository</td>
                <td className="py-2">存放 Chart 的遠端倉庫</td>
                <td className="py-2">apt source</td>
              </tr>
              <tr>
                <td className="py-2 text-orange-400 font-semibold">values.yaml</td>
                <td className="py-2">安裝參數設定檔（客製化用）</td>
                <td className="py-2">config 檔</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
          <p className="text-green-300 text-sm font-semibold">同一個 Chart，可以安裝多個 Release</p>
          <p className="text-slate-300 text-sm mt-1">例如：mysql Chart 安裝兩次 → release: my-mysql-dev 和 my-mysql-prod</p>
        </div>
      </div>
    ),
    code: `# 四大概念的實際對應

# Chart = .deb 套件（打包好的 K8s 應用模板）
# Release = 已安裝的執行實例（有名字、有狀態）
# Repository = 套件來源倉庫
# values.yaml = 安裝參數

# 同一個 Chart，可安裝多個 Release
helm install my-mysql-dev  bitnami/mysql  # Release 1
helm install my-mysql-prod bitnami/mysql  # Release 2

# 每個 Release 獨立管理
helm list
# NAME            NAMESPACE  REVISION  STATUS
# my-mysql-dev    default    1         deployed
# my-mysql-prod   default    1         deployed`,
    notes: `這五個概念要讓學員記住。可以畫在白板上。

最容易混淆的是 Chart vs Release：Chart 是模板（可重用），Release 是安裝後的實例（有狀態有名字）。 [▶ 下一頁]`,
  },

  // ── 6-17 概念（4/6）：三大核心功能 ──
  {
    title: 'Helm 三大核心功能',
    subtitle: '為什麼要用 Helm？',
    section: '6-17：Helm 概念',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-300 font-semibold mb-2">① 一鍵安裝</p>
          <p className="text-slate-300 text-sm">部署 MySQL 原本要寫：Deployment + Service + Secret + ConfigMap + PVC + ServiceAccount = 6 個 YAML</p>
          <p className="text-yellow-300 text-sm mt-2 font-mono">helm install my-mysql bitnami/mysql  → 全搞定</p>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
          <p className="text-blue-300 font-semibold mb-2">② 參數化部署</p>
          <p className="text-slate-300 text-sm">同一個 Chart，用不同 values 部署到 dev / staging / prod</p>
          <p className="text-slate-300 text-sm mt-1 font-mono">helm install ... -f values-dev.yaml</p>
          <p className="text-slate-300 text-sm font-mono">helm install ... -f values-prod.yaml</p>
        </div>
        <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-lg">
          <p className="text-purple-300 font-semibold mb-2">③ 版本管理 + 一鍵回滾</p>
          <p className="text-slate-300 text-sm">每次 install/upgrade/rollback 都記錄 REVISION</p>
          <p className="text-slate-300 text-sm mt-1 font-mono">helm rollback my-mysql 1  ← 回到第 1 版</p>
          <p className="text-slate-400 text-xs mt-1">比 kubectl rollout undo 更強：整個 Release 所有資源一起回滾</p>
        </div>
      </div>
    ),
    code: `# ① 一鍵安裝（自動建立所有 K8s 資源）
helm install my-mysql bitnami/mysql

# ② 參數化部署（同 Chart，不同環境）
helm install my-mysql-dev  bitnami/mysql -f values-dev.yaml
helm install my-mysql-prod bitnami/mysql -f values-prod.yaml

# ③ 版本管理 + 回滾
helm upgrade my-mysql bitnami/mysql --set image.tag=8.0
helm history my-mysql
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         deployed    Upgrade complete

helm rollback my-mysql 1   # 回到 REVISION 1（整個 Release 回滾）`,
    notes: `重點強調第三個：helm rollback 和 kubectl rollout undo 的差異。

kubectl rollout undo 只能回滾一個 Deployment。helm rollback 會把整個 Release（Deployment + Service + ConfigMap + Secret + ...）全部一起回滾到指定版本。這在正式環境非常重要。 [▶ 下一頁]`,
  },

  // ── 6-17 概念（5/6）：和 Docker Compose 比較 ──
  {
    title: 'Helm vs Docker Compose：概念對照',
    subtitle: '你已經懂 Compose，Helm 只是 K8s 版本',
    section: '6-17：Helm 概念',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2">概念</th>
                <th className="text-left py-2 text-blue-400">Docker Compose</th>
                <th className="text-left py-2 text-cyan-400">Helm</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">定義檔</td>
                <td className="py-2 font-mono text-xs text-blue-300">compose.yml</td>
                <td className="py-2 font-mono text-xs text-cyan-300">Chart（目錄）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">啟動</td>
                <td className="py-2 font-mono text-xs text-blue-300">docker compose up</td>
                <td className="py-2 font-mono text-xs text-cyan-300">helm install</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">更新</td>
                <td className="py-2 font-mono text-xs text-blue-300">docker compose up（重跑）</td>
                <td className="py-2 font-mono text-xs text-cyan-300">helm upgrade</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">清除</td>
                <td className="py-2 font-mono text-xs text-blue-300">docker compose down</td>
                <td className="py-2 font-mono text-xs text-cyan-300">helm uninstall</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">參數化</td>
                <td className="py-2 font-mono text-xs text-blue-300">.env 檔</td>
                <td className="py-2 font-mono text-xs text-cyan-300">values.yaml</td>
              </tr>
              <tr>
                <td className="py-2">版本回滾</td>
                <td className="py-2 text-slate-500 text-xs">❌ 沒有</td>
                <td className="py-2 font-mono text-xs text-cyan-300">helm rollback ✅</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-300 text-sm">Helm 比 Compose 多了：版本歷史、回滾、Repository 生態系</p>
        </div>
      </div>
    ),
    code: `# Docker Compose 你已經會了
docker compose up -d      # 啟動
docker compose down       # 清除
# .env 檔控制參數

# Helm 的對照指令
helm install   my-app ingress-nginx/ingress-nginx   # 啟動
helm upgrade   my-app ingress-nginx/ingress-nginx   # 更新
helm uninstall my-app                               # 清除
# values.yaml 控制參數

# Helm 多出來的功能
helm history my-app     # 查看所有版本
helm rollback my-app 1  # 回滾到指定版本

# 這是 Compose 做不到的！`,
    notes: `學員都有 Compose 經驗，這個對照表可以快速建立 mental model。

特別強調 rollback 是 Helm 比 Compose 強的地方。 [▶ 下一頁]`,
  },

  // ── 6-17 概念（6/6）：今天指令預覽 ──
  {
    title: '今天要跑的 Helm 指令一覽',
    subtitle: '先看整體地圖，等一下一個一個跑',
    section: '6-17：Helm 概念',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-2">安裝 Helm</p>
            <p className="text-slate-300 text-xs font-mono">curl | bash → v3.20.2</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm mb-2">新增 Repo</p>
            <p className="text-slate-300 text-xs font-mono">helm repo add / update</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">安裝應用</p>
            <p className="text-slate-300 text-xs font-mono">helm install my-ingress</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold text-sm mb-2">升級 / 回滾</p>
            <p className="text-slate-300 text-xs font-mono">helm upgrade / rollback</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold text-sm mb-2">查看預設值</p>
            <p className="text-slate-300 text-xs font-mono">helm show values</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold text-sm mb-2">多環境部署</p>
            <p className="text-slate-300 text-xs font-mono">-f values-dev.yaml</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm mb-2">Prometheus Stack</p>
            <p className="text-slate-300 text-xs font-mono">kube-prometheus-stack</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm mb-2">自建 Chart</p>
            <p className="text-slate-300 text-xs font-mono">helm create my-app</p>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
          <p className="text-blue-300 text-sm">全部指令跑完大約 40 分鐘。先把概念記清楚，等一下操作會順很多。</p>
        </div>
      </div>
    ),
    code: `# 今天 Helm 實作的完整流程
# ① 安裝 Helm v3.20.2
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# ② 新增 Repo
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# ③ 安裝 / 驗證
helm install my-ingress ingress-nginx/ingress-nginx ...
kubectl get all -l app.kubernetes.io/instance=my-ingress
helm list

# ④ 升級 + 歷史 + 回滾
helm upgrade my-ingress ...
helm history my-ingress
helm rollback my-ingress 1

# ⑤ 查預設值 / 多環境
helm show values ingress-nginx/ingress-nginx | head -50
helm install ... -f values-dev.yaml

# ⑥ Prometheus + Grafana
helm install kube-prometheus prometheus-community/kube-prometheus-stack ...

# ⑦ 自建 Chart
helm create my-app

# ⑧ 清理
helm uninstall my-ingress`,
    notes: `這張是路線圖。學員看完知道今天要做什麼。不需要解釋細節，等一下實作時會一步一步來。 [▶ 下一頁]`,
  },

  // ── 6-18A 實作（1/4）：安裝 Helm ──
  {
    title: '安裝 Helm v3.20.2',
    subtitle: '一行指令安裝，30 秒搞定',
    section: '6-18A：Helm 實作 Part 1',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">安裝方式</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="bg-slate-700/50 p-3 rounded font-mono text-xs">
              curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
            </div>
            <p className="text-slate-400 text-xs">下載官方安裝腳本，自動偵測平台（Linux/macOS），安裝最新穩定版</p>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <p className="text-green-300 font-semibold mb-2">安裝完成確認</p>
          <div className="space-y-1 text-sm font-mono">
            <p className="text-slate-300">helm version</p>
            <p className="text-slate-400 text-xs"># version.BuildInfo&#123;Version:"v3.20.2", ...&#125;</p>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
          <p className="text-blue-300 text-sm font-semibold">現在是 v3，不是 v2</p>
          <p className="text-slate-300 text-xs mt-1">Helm v2 需要在 cluster 裡安裝 Tiller server，v3 移除了，只有 client CLI，更安全簡單</p>
        </div>
      </div>
    ),
    code: `# 安裝 Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
# Downloading https://get.helm.sh/helm-v3.20.2-linux-amd64.tar.gz
# Preparing to install helm into /usr/local/bin
# helm installed into /usr/local/bin/helm

# 確認版本
helm version
# version.BuildInfo{Version:"v3.20.2", GitCommit:"...", GoVersion:"go1.24.3"}

# Helm v3 vs v2 差異
# v2: 需要在 cluster 安裝 Tiller（麻煩且有安全問題）
# v3: 只有 client CLI，不需要 server 端元件`,
    notes: `直接跑安裝指令。安裝很快，30 秒左右。

版本確認是重要步驟，讓學員知道他們裝了什麼版本。今天跑的是 v3.20.2。 [▶ 下一頁]`,
  },

  // ── 6-18A 實作（2/4）：helm repo add ──
  {
    title: 'helm repo add：新增 Chart 來源',
    subtitle: '從哪裡找 Chart URL？為什麼不用 Bitnami？',
    section: '6-18A：Helm 實作 Part 1',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-red-900/40 border border-red-500/60 p-3 rounded-lg">
          <p className="text-red-400 font-bold text-sm mb-1">⚠️ 不能用 Bitnami！</p>
          <p className="text-slate-300 text-xs">Bitnami 於 <span className="text-yellow-300 font-semibold">2025/8/28</span> 起 image registry 改為付費方案</p>
          <p className="text-slate-300 text-xs mt-1">→ 安裝會出現 <span className="text-red-400 font-mono">Init:ImagePullBackOff</span>，Pod 永遠起不來</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">今天用的兩個官方 Repo</p>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-green-400 font-semibold">ingress-nginx（K8s 官方）</p>
              <p className="text-slate-300 font-mono">https://kubernetes.github.io/ingress-nginx</p>
              <p className="text-slate-400 mt-1">來源：github.com/kubernetes/ingress-nginx → README</p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-blue-400 font-semibold">prometheus-community</p>
              <p className="text-slate-300 font-mono">https://prometheus-community.github.io/helm-charts</p>
              <p className="text-slate-400 mt-1">來源：github.com/prometheus-community/helm-charts → README</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-300 text-sm font-semibold">CHART VERSION vs APP VERSION</p>
          <p className="text-slate-300 text-xs mt-1">CHART VERSION = Chart 打包版本（Helm 維護者管的）</p>
          <p className="text-slate-300 text-xs">APP VERSION = 實際軟體版本（Nginx / Prometheus 本身）</p>
          <p className="text-slate-400 text-xs mt-1">例：ingress-nginx Chart 4.15.1 打包的是 Nginx Ingress Controller 1.15.1</p>
        </div>
      </div>
    ),
    code: `# 新增官方 Repo（URL 都在各自 GitHub README 裡）
# ingress-nginx: github.com/kubernetes/ingress-nginx
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# prometheus-community: github.com/prometheus-community/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# 更新索引
helm repo update
# ...Successfully got an update from the "ingress-nginx" chart repository
# ...Successfully got an update from the "prometheus-community" chart repository
# Update Complete. Happy Helming!

# 搜尋可用的 Chart
helm search repo ingress-nginx
# NAME                            CHART VERSION  APP VERSION  DESCRIPTION
# ingress-nginx/ingress-nginx     4.15.1         1.15.1       Ingress controller for K8s...

# ⚠️  Bitnami 從 2025/8/28 起 image 改付費
# helm repo add bitnami https://charts.bitnami.com/bitnami
# → helm install bitnami/mysql 會出現 Init:ImagePullBackOff！`,
    notes: `這頁有三個重點，都要講清楚：

1. URL 從哪來：去 GitHub 搜尋 ingress-nginx，找到官方 repo，README 第一行就有 helm repo add 指令
2. Bitnami 付費警告：2025/8/28 之後 image 改付費，Pull 會失敗，Init:ImagePullBackOff
3. CHART VERSION vs APP VERSION：很多學員會搞混，用 ingress-nginx 4.15.1 裝的是 Nginx 1.15.1 [▶ 下一頁]`,
  },

  // ── 6-18A 實作（3/4）：helm install + 驗證 ──
  {
    title: 'helm install：一鍵安裝 Ingress Controller',
    subtitle: '安裝後用 instance label 驗證所有資源',
    section: '6-18A：Helm 實作 Part 1',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">安裝指令（k3s 用 NodePort）</p>
          <div className="bg-slate-700/50 p-2 rounded font-mono text-xs text-slate-300">
            <p>helm install my-ingress ingress-nginx/ingress-nginx \</p>
            <p className="pl-4">--set controller.replicaCount=1 \</p>
            <p className="pl-4">--set controller.service.type=NodePort</p>
          </div>
          <p className="text-slate-400 text-xs mt-2">k3s 內建 Traefik 已佔用 80/443，用 NodePort 避免衝突</p>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
          <p className="text-green-300 font-semibold text-sm mb-2">用 instance label 查所有資源</p>
          <p className="text-slate-300 text-xs font-mono">kubectl get all -l app.kubernetes.io/instance=my-ingress</p>
          <p className="text-slate-400 text-xs mt-1">Helm 會自動為所有資源加上這個 label</p>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
          <p className="text-blue-300 font-semibold text-sm mb-1">helm list 確認 Release 狀態</p>
          <p className="text-slate-300 text-xs">REVISION: 1（第一次安裝），STATUS: deployed</p>
        </div>
      </div>
    ),
    code: `# 安裝 Nginx Ingress Controller
# k3s 有 Traefik，所以用 NodePort
helm install my-ingress ingress-nginx/ingress-nginx \
  --set controller.replicaCount=1 \
  --set controller.service.type=NodePort
# NAME: my-ingress
# LAST DEPLOYED: ...
# STATUS: deployed
# REVISION: 1

# 驗證：用 instance label 查出所有相關資源
kubectl get all -l app.kubernetes.io/instance=my-ingress
# NAME                                               READY  STATUS   AGE
# pod/my-ingress-ingress-nginx-controller-xxx        1/1    Running  1m
#
# NAME                                               TYPE       CLUSTER-IP    PORT(S)
# service/my-ingress-ingress-nginx-controller        NodePort   10.43.x.x     80:3xxxx/TCP,443:3xxxx/TCP
#
# NAME                                               READY  UP-TO-DATE  AVAILABLE
# deployment.apps/my-ingress-ingress-nginx-controller  1/1  1           1

# 查看所有 Release
helm list
# NAME        NAMESPACE  REVISION  UPDATED    STATUS    CHART                    APP VERSION
# my-ingress  default    1         2026-...   deployed  ingress-nginx-4.15.1     1.15.1`,
    notes: `重點示範兩件事：

1. kubectl get all -l app.kubernetes.io/instance=my-ingress：Helm 自動幫所有資源加上這個 label，一個指令查出全部資源
2. helm list：看到 REVISION=1, STATUS=deployed 就代表安裝成功

k3s 為什麼用 NodePort：因為 k3s 內建 Traefik，已經在 80/443 上了，LoadBalancer 會 pending，NodePort 最簡單 [▶ 下一頁]`,
  },

  // ── 6-18A 實作（4/4）：upgrade + history + rollback ──
  {
    title: 'helm upgrade → history → rollback',
    subtitle: 'REVISION 追蹤每一次變更，隨時可以回滾',
    section: '6-18A：Helm 實作 Part 1',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">REVISION 流程</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-green-900/50 border border-green-500/50 px-3 py-2 rounded text-center">
              <p className="text-green-400 font-bold">REVISION 1</p>
              <p className="text-slate-400 text-xs">install</p>
            </div>
            <span className="text-slate-500">→</span>
            <div className="bg-blue-900/50 border border-blue-500/50 px-3 py-2 rounded text-center">
              <p className="text-blue-400 font-bold">REVISION 2</p>
              <p className="text-slate-400 text-xs">upgrade</p>
            </div>
            <span className="text-slate-500">→</span>
            <div className="bg-yellow-900/50 border border-yellow-500/50 px-3 py-2 rounded text-center">
              <p className="text-yellow-400 font-bold">REVISION 3</p>
              <p className="text-slate-400 text-xs">rollback</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">rollback 本身也會產生新的 REVISION（不是刪除記錄）</p>
        </div>
        <div className="bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg">
          <p className="text-purple-300 font-semibold text-sm">helm rollback vs kubectl rollout undo</p>
          <div className="mt-1 space-y-1 text-xs text-slate-300">
            <p>kubectl rollout undo → 只回滾單一 Deployment</p>
            <p>helm rollback → 整個 Release 所有資源一起回滾 ✅</p>
          </div>
        </div>
      </div>
    ),
    code: `# upgrade（修改 replica 數量）
helm upgrade my-ingress ingress-nginx/ingress-nginx \
  --set controller.replicaCount=2 \
  --set controller.service.type=NodePort
# Release "my-ingress" has been upgraded. Happy Helming!
# REVISION: 2

# 查看版本歷史
helm history my-ingress
# REVISION  UPDATED    STATUS      CHART                    DESCRIPTION
# 1         2026-...   superseded  ingress-nginx-4.15.1     Install complete
# 2         2026-...   deployed    ingress-nginx-4.15.1     Upgrade complete

# rollback 到 REVISION 1
helm rollback my-ingress 1
# Rollback was a success! Happy Helming!

helm history my-ingress
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         superseded  Upgrade complete
# 3         deployed    Rollback to 1    ← rollback 本身是新的 REVISION

# 確認 replica 回到 1
kubectl get deploy -l app.kubernetes.io/instance=my-ingress`,
    notes: `最重要的概念：rollback 不是「刪除 REVISION 2」，而是新增 REVISION 3（內容和 REVISION 1 一樣）。這樣歷史記錄完整保留。

再次強調 helm rollback 和 kubectl rollout undo 的差異。 [▶ 下一頁]`,
  },

  // ── 6-18B 實作（1/5）：helm show values ──
  {
    title: 'helm show values：看 Chart 有哪些參數',
    subtitle: '從輸出讀出參數名稱 → 知道 --set 要打什麼',
    section: '6-18B：Helm 實作 Part 2',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">為什麼要先看 values？</p>
          <p className="text-slate-300 text-xs">參數名稱不能亂猜。拼錯了 helm 不會報錯，只是靜默不生效。先看輸出，再決定要改哪個。</p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">從輸出讀出 --set 怎麼打</p>
          <div className="font-mono text-xs bg-slate-900 p-2 rounded text-slate-300 space-y-0.5">
            <p className="text-slate-500"># helm show values 輸出（節錄）：</p>
            <p>controller:</p>
            <p className="pl-4 text-yellow-300">replicaCount: 1</p>
            <p className="pl-4">service:</p>
            <p className="pl-8 text-yellow-300">type: LoadBalancer</p>
          </div>
          <div className="mt-2 space-y-1 text-xs text-slate-300">
            <p><span className="text-slate-500">↓ 看到 controller.replicaCount: 1，所以：</span></p>
            <p className="font-mono text-green-400">--set controller.replicaCount=2</p>
            <p><span className="text-slate-500">↓ 看到 controller.service.type: LoadBalancer，所以：</span></p>
            <p className="font-mono text-green-400">--set controller.service.type=NodePort</p>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
          <p className="text-blue-300 font-semibold text-xs mb-1">-f 和 --set 都可以覆蓋參數</p>
          <p className="text-slate-400 text-xs">--set：單一參數快速改 &nbsp;|&nbsp; -f values.yaml：多個參數統一管（推薦）</p>
          <p className="text-slate-400 text-xs mt-1">混用時：-f 先套用，--set 後覆蓋（優先級更高）</p>
        </div>
      </div>
    ),
    code: `# 查看 Chart 有哪些可設定的參數（輸出很長，| head -50 只看前半）
helm show values ingress-nginx/ingress-nginx | head -50
# 實際輸出（節錄關鍵部分）：
# controller:
#   name: controller
#   replicaCount: 1          ← 這就是 --set controller.replicaCount=? 的來源
#   image:
#     registry: registry.k8s.io
#     tag: ""
#   service:
#     type: LoadBalancer      ← 這就是 --set controller.service.type=NodePort 的來源
#     ports:
#       http: 80
#       https: 443
#
# 規則：YAML 巢狀結構 → 用「.」連接 → 變成 --set 的參數名稱
# controller.service.type 對應 controller: → service: → type:

# 知道參數名後，--set 覆蓋：
helm install my-ingress ingress-nginx/ingress-nginx \
  --set controller.replicaCount=1 \
  --set controller.service.type=NodePort

# 或用 -f 把多個參數寫在 yaml 檔裡（下一張示範）`,
    notes: `這張的重點不是指令，是「怎麼讀懂輸出」。

helm show values 印出幾百行 YAML。大家看到這個通常傻眼。
教學員：你要找的是「我想改的那個功能叫什麼 key」。

舉例：你想讓 replica 從 1 改成 2，就在輸出裡找 replicaCount，看它在哪個層級下面（controller.replicaCount），然後 --set controller.replicaCount=2。參數名稱就是 YAML 巢狀路徑，用點分隔。

拼錯不會報錯這個要特別強調，因為很多學員以為設了沒效是 bug，其實是打錯參數名。 [▶ 下一頁]`,
  },

  // ── 6-18B 實作（2/5）：多環境 values ──
  {
    title: '多環境部署：values-dev.yaml + values-prod.yaml',
    subtitle: '同一個 Chart，不同環境不同參數',
    section: '6-18B：Helm 實作 Part 2',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">兩個環境的設定差異</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-900/30 border border-blue-500/50 p-2 rounded">
              <p className="text-blue-300 font-semibold mb-1">values-dev.yaml</p>
              <p className="text-slate-300 font-mono">replicaCount: 1</p>
              <p className="text-slate-300 font-mono">resources:</p>
              <p className="text-slate-300 font-mono pl-2">limits:</p>
              <p className="text-slate-300 font-mono pl-4">memory: 256Mi</p>
            </div>
            <div className="bg-green-900/30 border border-green-500/50 p-2 rounded">
              <p className="text-green-300 font-semibold mb-1">values-prod.yaml</p>
              <p className="text-slate-300 font-mono">replicaCount: 3</p>
              <p className="text-slate-300 font-mono">resources:</p>
              <p className="text-slate-300 font-mono pl-2">limits:</p>
              <p className="text-slate-300 font-mono pl-4">memory: 512Mi</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-300 text-sm font-semibold">對比沒有 Helm 的痛點</p>
          <p className="text-slate-300 text-xs mt-1">沒有 Helm：dev-deployment.yaml, staging-deployment.yaml, prod-deployment.yaml → 3 套 YAML 同步維護</p>
          <p className="text-green-300 text-xs mt-1">有 Helm：一個 Chart + 兩個 values 檔 → 解決了</p>
        </div>
      </div>
    ),
    code: `# 建立 dev 環境 values
cat > values-dev.yaml << 'EOF'
controller:
  replicaCount: 1
  service:
    type: NodePort
  resources:
    limits:
      memory: 256Mi
      cpu: 200m
EOF

# 建立 prod 環境 values
cat > values-prod.yaml << 'EOF'
controller:
  replicaCount: 3
  service:
    type: LoadBalancer
  resources:
    limits:
      memory: 512Mi
      cpu: 500m
EOF

# 部署 dev
helm install my-ingress-dev ingress-nginx/ingress-nginx -f values-dev.yaml

# 部署 prod（只示範，不實際裝）
# helm install my-ingress-prod ingress-nginx/ingress-nginx -f values-prod.yaml

# 確認 Release
helm list
# NAME              REVISION  STATUS    CHART
# my-ingress-dev    1         deployed  ingress-nginx-4.15.1

# 清理 dev（練習完）
helm uninstall my-ingress-dev`,
    notes: `這是 Helm 參數化部署的核心用法。

重點強調：「同一個 Chart 安裝多次，每次是獨立的 Release」，這和之前講的概念呼應。 [▶ 下一頁]`,
  },

  // ── 6-18B 實作（3/5）：Prometheus + Grafana ──
  {
    title: 'kube-prometheus-stack：一鍵安裝監控全家桶',
    subtitle: 'Prometheus + Grafana + AlertManager + 預設 Dashboard',
    section: '6-18B：Helm 實作 Part 2',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">kube-prometheus-stack 包含什麼</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Prometheus（指標收集）
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Grafana（視覺化）
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> AlertManager（告警）
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> Node Exporter（節點指標）
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> kube-state-metrics
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-green-400">✓</span> 預設 K8s Dashboard
            </div>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
          <p className="text-blue-300 text-sm font-semibold">如果沒有 Helm</p>
          <p className="text-slate-300 text-xs mt-1">手動安裝：Prometheus operator + CRD + Grafana + AlertManager + Exporter = 幾十個 YAML，幾小時</p>
          <p className="text-green-300 text-xs mt-1">有 Helm：helm install ... → 5 分鐘全搞定</p>
        </div>
      </div>
    ),
    code: `# 安裝 kube-prometheus-stack（Prometheus + Grafana 全家桶）
helm install kube-prometheus prometheus-community/kube-prometheus-stack \
  --set grafana.service.type=NodePort \
  --set prometheus.service.type=NodePort \
  --set alertmanager.service.type=NodePort

# 安裝需要幾分鐘，等 Pod 都 Running
kubectl get pods -l app.kubernetes.io/instance=kube-prometheus
# NAME                                                READY  STATUS
# kube-prometheus-grafana-xxx                         2/2    Running
# kube-prometheus-kube-prometheus-stack-prometheus-0  2/2    Running
# kube-prometheus-kube-state-metrics-xxx              1/1    Running

# 找 Grafana 的 NodePort
kubectl get svc -l app.kubernetes.io/name=grafana
# NAME                      TYPE       PORT(S)
# kube-prometheus-grafana   NodePort   3000:3xxxx/TCP

# 取得 Grafana 預設密碼
kubectl get secret kube-prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d
# 預設帳密：admin / prom-operator

# 瀏覽器開 http://192.168.43.130:<NodePort>
# 進入後點 Dashboards → 已有預設 K8s 監控 Dashboard`,
    notes: `這頁的重點是「Helm 讓複雜的東西變簡單」。

kube-prometheus-stack 手動安裝要幾小時，用 Helm 只要一行。這是說服學員在正式環境用 Helm 最有力的例子。

安裝比較慢（要 pull 很多 image），可以先下指令讓它跑，一邊講下一頁，等等再回來看結果。 [▶ 下一頁]`,
  },

  // ── 6-18B 實作（4/5）：helm create ──
  {
    title: 'helm create my-app：自建 Chart',
    subtitle: '把你自己的應用打包成可重用的 Chart',
    section: '6-18B：Helm 實作 Part 2',
    duration: '5',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">helm create 產生的目錄結構</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p>my-app/</p>
            <p className="pl-4">├── <span className="text-yellow-400">Chart.yaml</span>      <span className="text-slate-500"># Chart 基本資訊（名稱、版本）</span></p>
            <p className="pl-4">├── <span className="text-green-400">values.yaml</span>     <span className="text-slate-500"># 預設參數值</span></p>
            <p className="pl-4">├── templates/</p>
            <p className="pl-8">├── <span className="text-blue-400">deployment.yaml</span> <span className="text-slate-500"># 模板（用&#123;&#123; .Values.xxx &#125;&#125;）</span></p>
            <p className="pl-8">├── <span className="text-blue-400">service.yaml</span></p>
            <p className="pl-8">└── ...</p>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-500/50 p-3 rounded-lg">
          <p className="text-green-300 text-sm font-semibold">模板語法範例</p>
          <p className="text-slate-300 text-xs font-mono mt-1">replicas: &#123;&#123; .Values.replicaCount &#125;&#125;</p>
          <p className="text-slate-300 text-xs font-mono">image: &#123;&#123; .Values.image.repository &#125;&#125;:&#123;&#123; .Values.image.tag &#125;&#125;</p>
          <p className="text-slate-400 text-xs mt-1">values.yaml 裡的值，透過 &#123;&#123; .Values.xxx &#125;&#125; 注入到 YAML 模板</p>
        </div>
      </div>
    ),
    code: `# 建立 Chart 骨架
helm create my-app
# Creating my-app

# 查看結構
ls my-app/
# Chart.yaml  charts/  templates/  values.yaml

cat my-app/Chart.yaml
# apiVersion: v2
# name: my-app
# version: 0.1.0
# appVersion: "1.0"

cat my-app/values.yaml
# replicaCount: 1
# image:
#   repository: nginx
#   tag: ""
# service:
#   type: ClusterIP
#   port: 80

# templates/deployment.yaml 裡面長這樣
# replicas: {{ .Values.replicaCount }}
# image: {{ .Values.image.repository }}:{{ .Values.image.tag }}

# 安裝自建 Chart
helm install my-release ./my-app

# 用自訂參數安裝
helm install my-release ./my-app \
  --set replicaCount=2 \
  --set image.repository=my-registry/my-app \
  --set image.tag=v1.0.0`,
    notes: `helm create 讓學員知道 Chart 的內部結構。

模板語法 {{ .Values.xxx }} 是 Go template，不用深入講，只要讓學員知道「values.yaml 的值可以被注入到 YAML 模板裡」就夠了。 [▶ 下一頁]`,
  },

  // ── 6-18B 實作（5/5）：清理 ──
  {
    title: '清理：helm uninstall',
    subtitle: '一鍵清除所有相關資源（注意 PVC 例外）',
    section: '6-18B：Helm 實作 Part 2',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold text-sm mb-2">helm uninstall 會刪除什麼</p>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex items-center gap-2"><span className="text-red-400">✗</span> Deployment / ReplicaSet / Pod</div>
            <div className="flex items-center gap-2"><span className="text-red-400">✗</span> Service / Ingress</div>
            <div className="flex items-center gap-2"><span className="text-red-400">✗</span> ConfigMap / Secret（Helm 建立的）</div>
            <div className="flex items-center gap-2"><span className="text-red-400">✗</span> ServiceAccount / RBAC</div>
          </div>
        </div>
        <div className="bg-red-900/40 border border-red-500/60 p-3 rounded-lg">
          <p className="text-red-400 font-semibold text-sm">⚠️ PVC 預設不會被刪除！</p>
          <p className="text-slate-300 text-xs mt-1">有狀態應用（MySQL / Redis）的資料卷 PVC 刻意保留，防止誤刪資料</p>
          <p className="text-yellow-300 text-xs mt-1">要手動刪：<span className="font-mono">kubectl delete pvc --all</span> 或指定名稱</p>
        </div>
      </div>
    ),
    code: `# 清理本節所有 Release
helm uninstall my-ingress
# release "my-ingress" uninstalled

helm uninstall kube-prometheus
# release "kube-prometheus" uninstalled

helm uninstall my-release  # 自建的 Chart
# release "my-release" uninstalled

# 確認全部清除
helm list
# NAME  NAMESPACE  REVISION  STATUS
# （應該是空的）

# ⚠️ 確認 PVC 情況
kubectl get pvc
# 如果有 PVC 殘留，手動刪除
# kubectl delete pvc <pvc-name>

# 確認 Pod 全部停止
kubectl get pods`,
    notes: `最後的清理步驟。

重點提醒 PVC 不會自動刪除，這是刻意設計的（保護資料）。在 lab 環境如果 PVC 沒刪，下次安裝可能會用到舊資料，造成困惑。 [▶ 下一頁]`,
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
    section: '6-20：RKE + Rancher 概念',
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
    section: '6-20：RKE + Rancher 概念',
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
    section: '6-21：Rancher 實作',
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
    section: '6-21：Rancher 實作',
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
    section: '6-22：Rancher 學員實作',
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
    section: '6-22：Rancher 學員實作',
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
    section: '6-23：綜合實作引導',
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
    section: '6-24：學員自由練習',
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
    section: '6-24：學員自由練習',
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

  // ── 6-25 第1張：因果鏈回顧 Part 1 ──
  {
    title: '第六堂因果鏈回顧（一）',
    subtitle: 'NodePort → Ingress → ConfigMap → Secret',
    section: '6-25：第六堂總結',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-4 text-center">今天走了一條因果鏈 — 第一段</p>
          <div className="space-y-4 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">NodePort 地址太醜（IP:32xxx）</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">Ingress — 域名路由 + 路徑路由</span>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">設定寫死在 Image 裡，改一個變數就要重 build</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">ConfigMap — 設定外部化</span>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">密碼放 ConfigMap 不安全，明文可見</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">Secret — Base64 + RBAC 保護</span>
              </div>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg text-xs text-slate-300">
              <span className="text-cyan-400 font-semibold">整合：</span> Ingress + ConfigMap + Secret 三者同時上陣，讓外部可用域名存取、設定分離、密碼安全
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，大家辛苦了。今天的內容非常多，我們來做一個完整的因果鏈回顧，把今天學的每一個東西串起來。

今天第一段因果鏈。起點是第五堂結束的狀態，使用者要用 IP 加 NodePort 才能連進來，地址太醜。所以我們學了 Ingress，用域名和路徑做路由，Path-based 和 Host-based 兩種方式都學了。

Ingress 搞定了，但設定寫死在 Image 裡面。改一個環境變數就要重新 build Image，密碼寫在 Dockerfile 裡更是災難。所以我們學了 ConfigMap 管一般設定。

ConfigMap 是明文的，密碼放在裡面不安全。所以我們學了 Secret，用 Base64 編碼加上 RBAC 保護敏感資料。

最後三個一起用，Ingress 做入口，ConfigMap 注入設定，Secret 注入密碼，這就是今天第一段因果鏈。 [▶ 下一頁]`,
  },

  // ── 6-25 第2張：因果鏈回顧 Part 2 ──
  {
    title: '第六堂因果鏈回顧（二）',
    subtitle: 'Pod 重啟資料消失 → PV + PVC → StorageClass',
    section: '6-25：第六堂總結',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-4 text-center">因果鏈 — 第二段</p>
          <div className="space-y-4 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">MySQL Pod 重啟，資料全部消失</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">PV + PVC — PV 是停車位，PVC 是租約</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 ml-0">Pod 掛載 PVC，資料寫在 PV 上，Pod 死了重啟資料還在</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">手動建 PV 太煩，10 個微服務要建 10 個 PV</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">StorageClass — 動態佈建，PVC 下訂單工廠自動生產</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 ml-0">k3s 內建 local-path StorageClass，開箱即用</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-600 p-3 rounded-lg flex items-center gap-3 text-xs">
              <div className="text-center">
                <p className="text-cyan-300 font-semibold">PVC 申請</p>
                <p className="text-slate-400">開發者</p>
              </div>
              <span className="text-slate-500 text-lg">&rarr;</span>
              <div className="text-center">
                <p className="text-amber-300 font-semibold">StorageClass</p>
                <p className="text-slate-400">自動配對</p>
              </div>
              <span className="text-slate-500 text-lg">&rarr;</span>
              <div className="text-center">
                <p className="text-green-300 font-semibold">PV 建立</p>
                <p className="text-slate-400">自動完成</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `第二段因果鏈。設定和密碼分離了，服務跑起來了。但 MySQL Pod 一重啟，資料全部消失。所以我們學了 PV 和 PVC。PV 是管理員建的儲存空間，PVC 是開發者的使用申請，兩者配對之後 Pod 掛載 PVC，資料就不怕 Pod 重啟了。

但手動建 PV 太煩了，十個微服務要建十個 PV。所以我們學了 StorageClass，動態佈建。開發者建 PVC，K8s 自動建 PV。k3s 內建了 local-path StorageClass，不用自己設。 [▶ 下一頁]`,
  },

  // ── 6-25 第3張：因果鏈回顧 Part 3 ──
  {
    title: '第六堂因果鏈回顧（三）',
    subtitle: 'Deployment 不適合 DB → StatefulSet → Helm → Rancher',
    section: '6-25：第六堂總結',
    duration: '2',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-4 text-center">因果鏈 — 第三段（收尾）</p>
          <div className="space-y-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">Deployment 不適合跑 DB（名字不固定、共用 PVC、沒有穩定 DNS）</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">StatefulSet — 固定序號 + 有序啟動 + 獨立 PVC + Headless DNS</span>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">YAML 太多太散，一個 MySQL 就要好幾份 YAML</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">Helm — 一行安裝 + values.yaml 多環境 + helm rollback</span>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-semibold flex-shrink-0">問題：</span>
                <span className="text-slate-300">kubectl 管叢集太痛苦，想看全局要打一堆指令</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-green-400 font-semibold flex-shrink-0">解法：</span>
                <span className="text-green-300 font-semibold">Rancher — Web GUI 一覽全局</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `第三段因果鏈，也是最後一段。

有了持久化方案，資料庫可以正式跑了。但 Deployment 不適合跑資料庫。名字不固定、沒有順序、共用 PVC、沒有穩定 DNS。所以我們學了 StatefulSet。固定序號、有序啟動、獨立 PVC、搭配 Headless Service 讓每個 Pod 有自己的 DNS。

到這裡 YAML 已經多到爆了。一個 MySQL 就要 Secret 加 Headless Service 加 StatefulSet 加 PVC。所以我們學了 Helm，K8s 的套件管理器。一行 helm install 搞定，values.yaml 管參數，helm rollback 做版本管理。

最後，全部用 kubectl 管叢集太痛苦了。想看全局狀態要打一堆指令。所以我們學了 Rancher，用瀏覽器管叢集。一目了然，點點滑鼠就能操作。

這就是今天完整的因果鏈。每一個概念都是因為前一個步驟有解決不了的問題才引出來的。 [▶ 下一頁]`,
  },

  // ── 6-25 第4張：概念整體一覽（統整休息點）──
  {
    title: '今天學的概念全覽',
    subtitle: '第六堂整體回顧',
    section: '6-25：第六堂總結',
    duration: '2',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="bg-green-900/30 border border-green-500/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2 text-center">對外存取</p>
            <p className="text-slate-300 text-center">Ingress</p>
            <p className="text-slate-400 text-center text-[10px]">域名 + 路徑路由</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/40 p-3 rounded-lg">
            <p className="text-blue-400 font-semibold mb-2 text-center">設定管理</p>
            <p className="text-slate-300 text-center">ConfigMap</p>
            <p className="text-slate-400 text-center text-[10px]">設定外部化</p>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/40 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold mb-2 text-center">敏感資料</p>
            <p className="text-slate-300 text-center">Secret</p>
            <p className="text-slate-400 text-center text-[10px]">Base64 + RBAC</p>
          </div>
          <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
            <p className="text-amber-400 font-semibold mb-2 text-center">資料持久化</p>
            <p className="text-slate-300 text-center">PV + PVC</p>
            <p className="text-slate-400 text-center text-[10px]">停車位 + 租約</p>
          </div>
          <div className="bg-orange-900/30 border border-orange-500/40 p-3 rounded-lg">
            <p className="text-orange-400 font-semibold mb-2 text-center">動態佈建</p>
            <p className="text-slate-300 text-center">StorageClass</p>
            <p className="text-slate-400 text-center text-[10px]">PVC 下單自動生產</p>
          </div>
          <div className="bg-red-900/30 border border-red-500/40 p-3 rounded-lg">
            <p className="text-red-400 font-semibold mb-2 text-center">有狀態服務</p>
            <p className="text-slate-300 text-center">StatefulSet</p>
            <p className="text-slate-400 text-center text-[10px]">固定序號 + Headless DNS</p>
          </div>
          <div className="bg-cyan-900/30 border border-cyan-500/40 p-3 rounded-lg">
            <p className="text-cyan-400 font-semibold mb-2 text-center">套件管理</p>
            <p className="text-slate-300 text-center">Helm</p>
            <p className="text-slate-400 text-center text-[10px]">一行安裝 + rollback</p>
          </div>
          <div className="bg-slate-700/50 border border-slate-500/40 p-3 rounded-lg">
            <p className="text-slate-300 font-semibold mb-2 text-center">叢集管理</p>
            <p className="text-slate-300 text-center">Rancher</p>
            <p className="text-slate-400 text-center text-[10px]">Web GUI 一覽全局</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-600/40 p-3 rounded-lg flex items-center justify-center">
            <p className="text-slate-400 text-center text-[10px]">每個概念都是<br/>解決前一個問題的答案</p>
          </div>
        </div>
      </div>
    ),
    notes: `我們快速看一下今天學了哪些概念。

Ingress 解決對外存取問題。ConfigMap 解決設定管理問題。Secret 解決敏感資料問題。PV 加 PVC 解決資料持久化問題。StorageClass 解決手動建 PV 太煩的問題。StatefulSet 解決有狀態服務的問題。Helm 解決 YAML 太多太散的問題。Rancher 解決叢集管理太痛苦的問題。

每一個都是解決前一個問題引出來的。

接下來我們看今天新增的指令清單。 [▶ 下一頁]`,
  },

  // ── 6-25 第5張：今日新增指令（kubectl 部分）──
  {
    title: '今日新增指令完整清單（上）',
    subtitle: 'Ingress / PV / PVC / StorageClass / StatefulSet',
    section: '6-25：第六堂總結',
    duration: '2',
    code: `# --- Ingress ---
kubectl get ingress                             # 列出所有 Ingress
kubectl describe ingress <name>                 # 看 Ingress 的詳細路由規則

# --- PV / PVC / StorageClass ---
kubectl get pv                                  # 列出 PersistentVolume
kubectl get pvc                                 # 列出 PersistentVolumeClaim
kubectl get storageclass                        # 列出 StorageClass

# --- StatefulSet ---
kubectl get statefulset                         # 列出 StatefulSet（縮寫 kubectl get sts）
kubectl scale statefulset <name> --replicas=N   # StatefulSet 擴縮容`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-400">
          <p className="text-cyan-400 font-semibold mb-2">快速記憶法</p>
          <div className="space-y-1">
            <p><span className="text-green-300 font-mono">kubectl get ingress</span> — 看 Ingress 路由</p>
            <p><span className="text-green-300 font-mono">kubectl get pv / pvc / storageclass</span> — 看儲存三件組</p>
            <p><span className="text-green-300 font-mono">kubectl get sts</span> — sts 是 statefulset 縮寫</p>
            <p><span className="text-green-300 font-mono">kubectl scale sts &lt;name&gt; --replicas=N</span> — StatefulSet 擴縮容（有序）</p>
          </div>
        </div>
        <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg text-xs">
          <p className="text-amber-400 font-semibold">注意：StatefulSet scale 是有序的</p>
          <p className="text-slate-300 mt-1">擴容從最大序號 +1 開始，縮容從最大序號開始刪，不是隨機的。</p>
        </div>
      </div>
    ),
    notes: `我們來整理今天新學的指令，分兩張投影片。

第一組，Ingress 相關。kubectl get ingress 列出所有 Ingress。kubectl describe ingress 名稱，看詳細的路由規則，哪個域名對應哪個 Service。

第二組，儲存相關。kubectl get pv 看 PersistentVolume。kubectl get pvc 看 PersistentVolumeClaim。kubectl get storageclass 看 StorageClass。

第三組，StatefulSet 相關。kubectl get statefulset，縮寫是 sts。kubectl scale statefulset 名稱 --replicas=N 做擴縮容。要注意，StatefulSet 的 scale 是有序的，擴容從最大序號加一開始，縮容從最大序號開始刪，不是隨機的。 [▶ 下一頁]`,
  },

  // ── 6-25 第6張：今日新增指令（Helm 部分）──
  {
    title: '今日新增指令完整清單（下）',
    subtitle: 'Helm 全指令',
    section: '6-25：第六堂總結',
    duration: '2',
    code: `# --- Helm ---
helm repo add <name> <url>                  # 加入 Chart 倉庫
helm repo update                            # 更新本地 Chart 索引
helm search repo <keyword>                  # 搜尋 Chart

helm install <release-name> <chart>         # 安裝 Chart
helm list                                   # 看已安裝的 Release
helm upgrade <release-name> <chart>         # 升級 Release
helm history <release-name>                 # 查升級歷史
helm rollback <release-name> <revision>     # 回滾到指定版本
helm uninstall <release-name>               # 解除安裝

helm show values <chart>                    # 看 Chart 的可用參數`,
    content: (
      <div className="space-y-3">
        <div className="bg-slate-800/50 p-3 rounded-lg text-xs">
          <p className="text-cyan-400 font-semibold mb-2">Helm 生命週期對照</p>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <p className="text-slate-400 mb-1">安裝 / 升級</p>
              <p className="font-mono text-green-300">helm install</p>
              <p className="font-mono text-green-300">helm upgrade</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">查詢 / 回滾</p>
              <p className="font-mono text-amber-300">helm list</p>
              <p className="font-mono text-amber-300">helm history</p>
              <p className="font-mono text-amber-300">helm rollback</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-400 mb-1">清除</p>
              <p className="font-mono text-red-300">helm uninstall</p>
            </div>
          </div>
        </div>
        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-xs text-slate-300">
          <span className="text-green-400 font-semibold">helm show values：</span> 在 install 前先看有哪些參數可以設，比 Chart 文件更直接。
        </div>
      </div>
    ),
    notes: `Helm 指令。

helm repo add 加入 Chart 倉庫，helm repo update 更新本地索引，helm search repo 關鍵字搜尋 Chart。

安裝用 helm install，加 Release 名稱和 Chart 名稱。查看已安裝的 Release 用 helm list。

升級用 helm upgrade，看歷史用 helm history，回滾用 helm rollback 加版本號，解除安裝用 helm uninstall。

在 install 前想知道 Chart 有哪些參數可以設，用 helm show values Chart 名稱，比查文件更直接。 [▶ 下一頁]`,
  },

  // ── 6-25 第7張：QA ──
  {
    title: 'QA 問答',
    subtitle: 'Docker Compose vs Helm Chart ／ PV 和 PVC 是什麼角色？',
    section: '6-25：第六堂總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-3">Q1：Docker 的 docker-compose.yml 對應到 K8s 的什麼？</p>
          <div className="bg-slate-900/60 p-3 rounded text-sm text-slate-300 space-y-2">
            <p><span className="text-green-400 font-semibold">A：對應到 Helm Chart。</span></p>
            <p>docker-compose.yml 定義整套服務（DB + backend + frontend）</p>
            <p>Helm Chart 也是定義整套服務，用 templates/ 存放多個 YAML</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="bg-blue-900/30 p-2 rounded">
                <p className="text-blue-300 font-semibold">Docker Compose</p>
                <p className="text-slate-400">docker compose up</p>
                <p className="text-slate-400">docker compose down</p>
                <p className="text-slate-400">.env 參數</p>
              </div>
              <div className="bg-green-900/30 p-2 rounded">
                <p className="text-green-300 font-semibold">Helm</p>
                <p className="text-slate-400">helm install</p>
                <p className="text-slate-400">helm uninstall</p>
                <p className="text-slate-400">values.yaml 參數</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-3">Q2：PV 和 PVC 各代表什麼角色？</p>
          <div className="bg-slate-900/60 p-3 rounded text-sm text-slate-300 space-y-2">
            <p><span className="text-green-400 font-semibold">A：用「停車場」來記。</span></p>
            <div className="grid grid-cols-2 gap-3 text-xs mt-1">
              <div className="bg-amber-900/30 border border-amber-500/30 p-2 rounded">
                <p className="text-amber-300 font-semibold">PV（PersistentVolume）</p>
                <p className="text-slate-400 mt-1">= 停車位（管理員建的真實儲存空間）</p>
                <p className="text-slate-400 mt-1">管理員事先建好，或 StorageClass 自動生成</p>
              </div>
              <div className="bg-cyan-900/30 border border-cyan-500/30 p-2 rounded">
                <p className="text-cyan-300 font-semibold">PVC（PersistentVolumeClaim）</p>
                <p className="text-slate-400 mt-1">= 租約（Pod 提出「我要多少空間」的申請）</p>
                <p className="text-slate-400 mt-1">K8s 自動配對合適的 PV</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `來做個 QA。

第一個問題，Docker 的 docker-compose.yml 對應到 K8s 的什麼？對應到 Helm Chart。docker-compose.yml 定義整套服務，Helm Chart 也是定義整套服務，用 templates 目錄存放多個 YAML。docker compose up 對應 helm install，docker compose down 對應 helm uninstall，.env 檔案對應 values.yaml。

第二個問題，PV 和 PVC 各代表什麼角色？用停車場來記。PV 是停車位，管理員建的真實儲存空間，或者 StorageClass 自動生成。PVC 是租約，Pod 提出「我要多少空間」的申請，K8s 自動找合適的 PV 配對。停車位先有，租約才能簽。PV 先有，PVC 才能 Bound。 [▶ 下一頁]`,
  },

  // ── 6-25 第8張：Docker → K8s 完整對照表 ──
  {
    title: 'Docker → K8s 完整對照表',
    subtitle: '第六堂總結',
    section: '6-25：第六堂總結',
    duration: '3',
    content: (
      <div className="space-y-3">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-1 pr-3">Docker</th>
                <th className="text-left py-1 pr-3">K8s</th>
                <th className="text-left py-1">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">docker volume create</td>
                <td className="py-1 pr-3 text-green-300">PersistentVolume (PV)</td>
                <td className="py-1 text-slate-400">建立儲存空間（停車位）</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">docker run -v</td>
                <td className="py-1 pr-3 text-green-300">PersistentVolumeClaim (PVC)</td>
                <td className="py-1 text-slate-400">申請使用儲存空間（租約）</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">--name 固定容器名</td>
                <td className="py-1 pr-3 text-green-300">StatefulSet 固定序號</td>
                <td className="py-1 text-slate-400">有狀態服務的身份識別</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">docker-compose.yml</td>
                <td className="py-1 pr-3 text-green-300">Helm Chart</td>
                <td className="py-1 text-slate-400">整套服務的定義檔</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">docker compose up</td>
                <td className="py-1 pr-3 text-green-300">helm install</td>
                <td className="py-1 text-slate-400">一鍵啟動整套服務</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">docker compose down</td>
                <td className="py-1 pr-3 text-green-300">helm uninstall</td>
                <td className="py-1 text-slate-400">一鍵清除整套服務</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">.env 檔案</td>
                <td className="py-1 pr-3 text-green-300">values.yaml</td>
                <td className="py-1 text-slate-400">多環境的參數管理</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">nginx.conf 反向代理</td>
                <td className="py-1 pr-3 text-green-300">Ingress YAML</td>
                <td className="py-1 text-slate-400">HTTP 路由規則的定義</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">Nginx 容器（反向代理）</td>
                <td className="py-1 pr-3 text-green-300">Ingress Controller Pod</td>
                <td className="py-1 text-slate-400">實際執行路由規則的程式</td>
              </tr>
              <tr className="border-b border-slate-700/60">
                <td className="py-1 pr-3 font-mono text-blue-300">docker run -e KEY=VALUE</td>
                <td className="py-1 pr-3 text-green-300">ConfigMap envFrom</td>
                <td className="py-1 text-slate-400">把設定以環境變數方式注入 Pod</td>
              </tr>
              <tr>
                <td className="py-1 pr-3 font-mono text-blue-300">.env 裡的密碼</td>
                <td className="py-1 pr-3 text-green-300">Secret</td>
                <td className="py-1 text-slate-400">敏感資料管理（Base64 + RBAC）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-xs text-center">
          <p className="text-green-400 font-semibold">你已經從 Docker 進化到 K8s 了 🎓</p>
          <p className="text-slate-400 mt-1">每一個 Docker 概念在 K8s 都有對應的進化版本</p>
        </div>
      </div>
    ),
    notes: `最後，我們來更新 Docker 對照表，這次是完整版。

docker volume create 對應 PV，建立儲存空間，停車位。docker run -v 對應 PVC，申請使用儲存空間，租約。

--name 固定容器名稱對應 StatefulSet 的固定序號，有狀態服務的身份識別。

docker-compose.yml 對應 Helm Chart，整套服務的定義檔。docker compose up 對應 helm install，docker compose down 對應 helm uninstall。

.env 檔案對應 values.yaml，多環境的參數管理。

nginx.conf 反向代理對應 Ingress YAML，HTTP 路由規則的定義。Nginx 容器做反向代理，對應 Ingress Controller Pod，實際執行路由規則的程式。

docker run -e KEY=VALUE 對應 ConfigMap 的 envFrom，把設定以環境變數方式注入 Pod。.env 裡的密碼對應 Secret，敏感資料管理。

你看，你已經從 Docker 進化到 K8s 了。每一個 Docker 概念在 K8s 都有對應的進化版本。大家辛苦了，我們下堂課見。 [▶ 第六堂結束]`,
  },
]
