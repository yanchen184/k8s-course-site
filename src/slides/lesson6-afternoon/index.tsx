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
  // ── Slide 1 痛點：Pod 重啟資料消失 ─────────────────
  {
    title: '痛點：Pod 重啟資料消失',
    subtitle: '資料和 Pod 生命週期綁在一起',
    section: 'PV/PVC',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">實驗：資料消失了！</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>1. 進 MySQL Pod，建表、插入 Alice</p>
            <p>2. SELECT * FROM users → Alice 在！</p>
            <p>3. kubectl delete pod -l app=mysql</p>
            <p>4. 新 Pod 起來 → USE testdb → <span className="text-red-400 font-bold">ERROR: Unknown database</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼？</p>
          <div className="text-sm text-slate-300 font-mono bg-slate-900 p-2 rounded">
            <p>Pod 的檔案系統 = 容器的 overlay filesystem</p>
            <p>Pod 被刪 → 容器被刪 → filesystem 被刪 → 資料不見</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 也一樣</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-2 rounded text-center">
              <p className="text-red-400 text-xs font-semibold">不掛 volume</p>
              <p className="text-slate-400 text-xs">docker rm -f mysql → 資料不見</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-2 rounded text-center">
              <p className="text-green-400 text-xs font-semibold">掛 volume</p>
              <p className="text-slate-400 text-xs">docker rm -f mysql → 資料還在！</p>
            </div>
          </div>
          <p className="text-cyan-400 font-semibold mt-3">K8s 的解法 → PersistentVolume + PersistentVolumeClaim</p>
        </div>
      </div>
    ),
    code: `# 進 MySQL Pod，建立一張表
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> CREATE DATABASE testdb;
> USE testdb;
> CREATE TABLE users (id INT, name VARCHAR(50));
> INSERT INTO users VALUES (1, 'Alice');
> SELECT * FROM users;    # Alice 在！
> exit

# 刪掉 Pod（模擬 Pod 重啟）
kubectl delete pod -l app=mysql

# 等新 Pod 跑起來，再查
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> USE testdb;              # ERROR: Unknown database 'testdb'
# 資料全部不見了！`,
    notes: `好，下午了，吃飽了嗎？我們來面對一個殘酷的現實。

上午我們部署了 MySQL，建了資料庫，存了資料。但如果我告訴你，把 MySQL 的 Pod 刪掉重建，你的資料全部消失，你會怎麼想？

來做個實驗。進 MySQL 建一張表，插入一筆資料 Alice。查一下，Alice 在。好，現在退出 MySQL。

kubectl delete pod -l app=mysql

刪掉 Pod。Deployment 會自動幫你重建一個新的 Pod。等新 Pod 跑起來，再進 MySQL 查一下...

USE testdb — ERROR: Unknown database 'testdb'。

資料全部不見了。不只是表不見了，連資料庫都不見了。

為什麼？因為 Pod 的檔案系統就是容器的 overlay filesystem。Pod 被刪了，容器被刪了，filesystem 也跟著被刪了。裡面的所有資料通通消失。

用 Docker 的經驗來想，這跟你 docker run mysql 不掛 Volume 是一模一樣的。容器刪了，資料就沒了。Docker 的解法是什麼？掛 Volume 啊！docker run -v mydata:/var/lib/mysql，資料就存在 Volume 裡，容器怎麼刪都不怕。

K8s 也是同樣的道理。我們需要一種「獨立於 Pod 之外」的儲存空間，Pod 來來去去，資料穩穩地待著。K8s 提供的方案是 PersistentVolume（PV）和 PersistentVolumeClaim（PVC）。`,
    duration: '5',
  },

  // ── Slide 2 PV + PVC 概念圖 ───────────────────────
  {
    title: 'PV + PVC 概念',
    subtitle: '管理員建 PV，開發者用 PVC',
    section: 'PV/PVC',
    content: (
      <div className="space-y-4">
        {/* PV/PVC 概念圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">PV / PVC 關係圖</p>
          <div className="flex items-start justify-center gap-4 flex-wrap">
            {/* 管理員 → PV */}
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/10 min-w-[160px]">
              <p className="text-amber-400 text-sm font-bold text-center mb-2">管理員</p>
              <div className="bg-amber-900/40 border border-amber-500/30 px-2 py-2 rounded text-center">
                <p className="text-amber-300 text-xs font-semibold">建立 PV</p>
                <p className="text-slate-400 text-[10px]">「我有 10GB 的 SSD」</p>
              </div>
            </div>
            {/* 中間 Binding */}
            <div className="flex flex-col items-center justify-center pt-6">
              <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
                <p className="text-cyan-400 text-xs font-bold">K8s 自動配對</p>
                <p className="text-slate-400 text-[10px]">Binding</p>
              </div>
            </div>
            {/* 使用者 → PVC */}
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/10 min-w-[160px]">
              <p className="text-green-400 text-sm font-bold text-center mb-2">開發者</p>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-2 rounded text-center">
                <p className="text-green-300 text-xs font-semibold">建立 PVC</p>
                <p className="text-slate-400 text-[10px]">「我需要 5GB 的儲存」</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="bg-blue-900/40 border border-blue-500/50 px-4 py-2 rounded-lg">
              <p className="text-blue-400 text-xs font-bold text-center">Pod 使用 PVC</p>
              <p className="text-slate-400 text-[10px] text-center">「把 PVC 掛到 /data」</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-40">Docker</th>
                <th className="text-left py-2 w-36">K8s</th>
                <th className="text-left py-2">角色</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">docker volume create</td>
                <td className="py-2">PersistentVolume (PV)</td>
                <td className="py-2">建立儲存空間</td>
              </tr>
              <tr>
                <td className="py-2 font-mono text-xs">-v mydata:/var/lib/mysql</td>
                <td className="py-2">PersistentVolumeClaim (PVC)</td>
                <td className="py-2">使用儲存空間</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">AccessMode（存取模式）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-36">模式</th>
                <th className="text-left py-2 w-16">縮寫</th>
                <th className="text-left py-2">意思</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">ReadWriteOnce</td>
                <td className="py-2 font-semibold text-cyan-400">RWO</td>
                <td className="py-2">只能被一個 Node 讀寫（最常用）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">ReadOnlyMany</td>
                <td className="py-2 font-semibold text-cyan-400">ROX</td>
                <td className="py-2">可以被多個 Node 唯讀</td>
              </tr>
              <tr>
                <td className="py-2">ReadWriteMany</td>
                <td className="py-2 font-semibold text-cyan-400">RWX</td>
                <td className="py-2">可以被多個 Node 讀寫（需 NFS 等）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `PV 和 PVC，名字聽起來很嚇人，但概念其實很簡單。

用一個生活化的比喻：PV 就像「停車場的車位」，PVC 就像「停車位的租約」。停車場管理員（K8s 管理員）先把車位劃好（建立 PV），然後車主（開發者）提交租約申請（建立 PVC），管理系統自動幫你配對一個適合的車位，這個過程叫 Binding。配對成功後，車主就能用那個車位停車了（Pod 掛載 PVC）。

對照 Docker 來看：docker volume create mydata 就像建立 PV — 創造一塊儲存空間。docker run -v mydata:/var/lib/mysql 就像 PVC — 把那塊儲存空間掛到容器裡。Docker 把這兩步合在一起，K8s 拆成兩步。

為什麼要拆？因為在大公司裡，管儲存的人跟寫程式的人不是同一個人。管理員負責「我們公司有幾台 NAS、幾塊 SSD、每塊多大」，這是 PV。開發者只要說「我的 MySQL 需要 10GB 空間」，這是 PVC。開發者不需要知道底層是 NFS 還是 AWS EBS 還是什麼。

PV 有一個重要的屬性叫 AccessMode，決定這塊儲存可以怎麼被使用。RWO（ReadWriteOnce）是最常用的，表示同時只能被一個 Node 掛載讀寫。ROX 是多 Node 唯讀。RWX 是多 Node 讀寫，但不是所有儲存系統都支援，通常需要 NFS 之類的網路儲存。`,
    duration: '10',
  },

  // ── Slide 3 實作：PV + PVC 靜態佈建 ───────────────
  {
    title: '實作：PV + PVC 靜態佈建',
    subtitle: 'Lab 6：資料持久化驗證',
    section: 'PV/PVC',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">重點實驗</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded text-center">
              <p className="text-red-400 font-semibold mb-1">沒掛 PVC</p>
              <p className="text-slate-400 text-xs">刪 Pod → 資料消失</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded text-center">
              <p className="text-green-400 font-semibold mb-1">有掛 PVC</p>
              <p className="text-slate-400 text-xs">刪 Pod → 資料還在！</p>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：部署
kubectl apply -f pv-pvc.yaml

# Step 2：查看 Binding 狀態
kubectl get pv          # STATUS: Bound
kubectl get pvc         # STATUS: Bound

# Step 3：查看 Pod 寫入的資料
kubectl logs deployment/app-with-storage

# Step 4：重點實驗 — 刪 Pod，資料還在嗎？
kubectl delete pod -l app=app-with-storage
# 等新 Pod 跑起來
kubectl logs deployment/app-with-storage
# 之前的資料還在！加上新的一行！`,
    notes: `來做實驗。部署 PV、PVC 和使用 PVC 的 Deployment：

kubectl apply -f pv-pvc.yaml

先看 PV 和 PVC 的狀態：

kubectl get pv
kubectl get pvc

兩個的 STATUS 都應該是 Bound，表示 K8s 已經把 PVC 和 PV 配對成功了。如果你看到 Pending，表示沒有合適的 PV 可以配對 — 可能是 storageClassName 不一致，或者 PV 的容量不夠大。

看看 Pod 的日誌：

kubectl logs deployment/app-with-storage

你會看到它寫入了一行「寫入時間」和「Pod 名稱」，然後印出目前檔案的內容。

好，現在來做最關鍵的實驗。刪掉 Pod：

kubectl delete pod -l app=app-with-storage

等新 Pod 跑起來，再看日誌：

kubectl logs deployment/app-with-storage

大家注意看 — 檔案裡面不是只有一行，而是兩行！第一行是剛才被刪掉的那個 Pod 寫的，第二行是新 Pod 寫的。這代表什麼？代表第一個 Pod 寫的資料在 Pod 被刪掉後還活著，新 Pod 掛載同一個 PVC，讀到了舊資料，然後又追加了一行。

對照上午的 MySQL — 沒掛 PVC 的 MySQL 刪了 Pod 資料就沒了，掛了 PVC 的話資料就還在。這就是 PV/PVC 存在的意義。`,
    duration: '20',
  },

  // ── Slide 4 PV 回收策略 ──────────────────────────
  {
    title: 'PV 回收策略',
    subtitle: 'PVC 刪掉後，PV 的資料怎麼處理？',
    section: 'PV/PVC',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ReclaimPolicy</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">策略</th>
                <th className="text-left py-2">行為</th>
                <th className="text-left py-2 w-32">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Retain</td>
                <td className="py-2">PVC 刪掉後，PV 和資料都保留</td>
                <td className="py-2">生產環境</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Delete</td>
                <td className="py-2">PVC 刪掉後，PV 和資料都刪除</td>
                <td className="py-2">開發環境</td>
              </tr>
              <tr>
                <td className="py-2 text-red-400 font-semibold">Recycle</td>
                <td className="py-2">清空資料後 PV 可重新使用</td>
                <td className="py-2 text-red-400">已棄用</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# 刪掉 PVC
kubectl delete pvc local-pvc
kubectl get pv    # STATUS: Released（不是 Available）

# Retain 策略下，PV 變成 Released 狀態
# 需要管理員手動清理後才能重新使用`,
    notes: `有一個相關的概念要提一下 — ReclaimPolicy，就是回收策略。

當你把 PVC 刪掉的時候，PV 裡的資料要怎麼處理？三個選項。

Retain — 保留。PVC 刪了，但 PV 和裡面的資料都還在。PV 的狀態會變成 Released，表示它曾經被綁過但現在沒有 PVC 了。要讓這個 PV 能再被新的 PVC 使用，管理員得手動清理。生產環境通常用這個，因為資料不能隨便丟。

Delete — 刪除。PVC 一刪，PV 也跟著刪，資料也消失。雲端環境常用這個，因為 PV 通常對應到一個雲端磁碟（EBS、Azure Disk），PVC 刪了磁碟也一起刪，省錢。

Recycle — 已棄用，不要用。

我們的範例用的是 Retain。`,
    duration: '5',
  },

  // ── Slide 5 StorageClass + 動態佈建流程圖 ─────────
  {
    title: 'StorageClass + 動態佈建',
    subtitle: '自動建 PV，不用管理員手動操作',
    section: 'StorageClass',
    content: (
      <div className="space-y-4">
        {/* StorageClass 動態佈建流程圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">動態佈建流程</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg">
              <p className="text-green-400 text-xs font-bold">PVC 請求</p>
              <p className="text-slate-400 text-[10px]">「我要 1Gi」</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
              <p className="text-cyan-400 text-xs font-bold">StorageClass</p>
              <p className="text-slate-400 text-[10px]">local-path</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="bg-amber-900/40 border border-amber-500/50 px-3 py-2 rounded-lg">
              <p className="text-amber-400 text-xs font-bold">自動建 PV</p>
              <p className="text-slate-400 text-[10px]">不用管理員操作</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">靜態佈建 vs 動態佈建</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-20"></th>
                <th className="text-left py-2">靜態佈建</th>
                <th className="text-left py-2">動態佈建</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">流程</td>
                <td className="py-2">管理員先建 PV → 使用者建 PVC → 配對</td>
                <td className="py-2">使用者建 PVC → <span className="text-cyan-400 font-semibold">自動建 PV</span></td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-semibold">適合</td>
                <td className="py-2">學習、小規模</td>
                <td className="py-2">生產環境</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">問題</td>
                <td className="py-2">要事先建好所有 PV</td>
                <td className="py-2">需要 StorageClass</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# StorageClass YAML
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path              # k3s 內建
provisioner: rancher.io/local-path
reclaimPolicy: Delete

# 動態佈建的 PVC（不用事先建 PV）
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

# k3s 內建 local-path StorageClass
kubectl get storageclass
# NAME                   PROVISIONER
# local-path (default)   rancher.io/local-path`,
    notes: `剛才我們做的是「靜態佈建」— 管理員先建好 PV，使用者再建 PVC 去配對。但你想想看，如果你有 100 個微服務，每個都需要 PVC，管理員要事先建 100 個 PV？太累了。

所以 K8s 有「動態佈建」— 使用者只要建 PVC，K8s 自動幫你建 PV。這就是 StorageClass 的功能。

StorageClass 就像一份說明書，告訴 K8s：「當有人申請 PVC 的時候，用什麼方式自動建立 PV」。比如在 AWS 上，StorageClass 會告訴 K8s「去 AWS 自動建一塊 EBS 磁碟」。在 k3s 上，內建的 local-path StorageClass 會在 Node 的本機目錄建立儲存空間。

查看你的叢集有哪些 StorageClass：

kubectl get storageclass

k3s 會有一個 local-path，而且後面標了 (default)，表示如果 PVC 沒指定 storageClassName，就用這個。

用動態佈建的話，PVC 只要指定 storageClassName: local-path，不用事先建 PV，K8s 就會根據 StorageClass 的設定自動建一個 PV 給你。在生產環境，基本上都是用動態佈建。靜態佈建只有在學習或特殊情況下才會用到。`,
    duration: '15',
  },

  // ── Slide 6 痛點：Deployment 不適合跑資料庫 ────────
  {
    title: '痛點：Deployment 不適合跑資料庫',
    subtitle: '無狀態 vs 有狀態',
    section: 'StatefulSet',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">用 Deployment 跑 MySQL 的問題</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-32">問題</th>
                <th className="text-left py-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">Pod 名稱不固定</td>
                <td className="py-2">mysql-deploy-abc-xyz，每次重建名字不同</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">沒有順序</td>
                <td className="py-2">3 個副本同時啟動，主從架構搞不定</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">共用 PVC</td>
                <td className="py-2">所有 Pod 搶同一塊儲存，資料衝突</td>
              </tr>
              <tr>
                <td className="py-2">沒有穩定網路</td>
                <td className="py-2">別人怎麼連到特定的 Pod？（主庫 vs 從庫）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">資料庫需要什麼？</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. <span className="text-cyan-400 font-semibold">固定名稱</span> — mysql-0 永遠是主庫</p>
            <p>2. <span className="text-cyan-400 font-semibold">有序啟動</span> — 主庫先起來，從庫再連上去</p>
            <p>3. <span className="text-cyan-400 font-semibold">獨立儲存</span> — 每個 Pod 有自己的 PVC</p>
            <p>4. <span className="text-cyan-400 font-semibold">穩定 DNS</span> — 能直接連到 mysql-0 而不是隨機一個</p>
          </div>
          <p className="text-cyan-400 font-semibold mt-3">→ StatefulSet</p>
        </div>
      </div>
    ),
    notes: `好，PV/PVC 解決了資料持久化的問題。但如果我要跑 MySQL 主從架構呢？一個主庫、兩個從庫？

用 Deployment 可以嗎？試試看。replicas: 3，掛一個 PVC。

第一個問題：三個 Pod 的名字是隨機的，mysql-deploy-abc-xyz、mysql-deploy-def-uvw。重建之後名字又變了。你的主庫到底是哪一個？從庫怎麼知道要連哪一個？

第二個問題：三個 Pod 同時啟動。但 MySQL 主從架構需要主庫先啟動、拿到 binlog position，從庫再連上去同步。同時啟動會出問題。

第三個問題：三個 Pod 共用同一個 PVC。三個 MySQL instance 同時寫同一塊磁碟？資料一定亂掉。

第四個問題：Service 是負載均衡的，流量隨機分配。但你寫入操作要送到主庫，讀取操作可以送到從庫。怎麼指定？

Deployment 設計給「無狀態」的應用 — API、Web Server 這種，Pod 之間沒有差別，隨便殺一個再補一個都行。但資料庫是「有狀態」的，每個 Pod 都有自己的身份。

K8s 提供了一個專門給有狀態應用的資源 — StatefulSet。`,
    duration: '5',
  },

  // ── Slide 7 StatefulSet vs Deployment 對比圖 ──────
  {
    title: 'StatefulSet 概念',
    subtitle: '三個保證：穩定身份、獨立儲存、有序生命週期',
    section: 'StatefulSet',
    content: (
      <div className="space-y-4">
        {/* StatefulSet vs Deployment 對比圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Deployment vs StatefulSet</p>
          <div className="grid grid-cols-2 gap-4">
            {/* Deployment */}
            <div className="border-2 border-red-500/50 rounded-lg p-3 bg-red-900/10">
              <p className="text-red-400 text-sm font-bold text-center mb-2">Deployment</p>
              <div className="space-y-1">
                <div className="bg-red-900/30 border border-red-500/30 px-2 py-1 rounded text-center">
                  <p className="text-red-300 text-xs">web-abc-xyz</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 px-2 py-1 rounded text-center">
                  <p className="text-red-300 text-xs">web-def-uvw</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 px-2 py-1 rounded text-center">
                  <p className="text-red-300 text-xs">web-ghi-rst</p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] mt-2 text-center">名稱隨機、同時啟動、共用 PVC</p>
            </div>
            {/* StatefulSet */}
            <div className="border-2 border-green-500/50 rounded-lg p-3 bg-green-900/10">
              <p className="text-green-400 text-sm font-bold text-center mb-2">StatefulSet</p>
              <div className="space-y-1">
                <div className="bg-green-900/30 border border-green-500/30 px-2 py-1 rounded flex justify-between items-center">
                  <p className="text-green-300 text-xs font-semibold">mysql-0</p>
                  <p className="text-slate-400 text-[10px]">PVC-0</p>
                </div>
                <div className="bg-green-900/30 border border-green-500/30 px-2 py-1 rounded flex justify-between items-center">
                  <p className="text-green-300 text-xs font-semibold">mysql-1</p>
                  <p className="text-slate-400 text-[10px]">PVC-1</p>
                </div>
                <div className="bg-green-900/30 border border-green-500/30 px-2 py-1 rounded flex justify-between items-center">
                  <p className="text-green-300 text-xs font-semibold">mysql-2</p>
                  <p className="text-slate-400 text-[10px]">PVC-2</p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] mt-2 text-center">固定序號、依序啟動、獨立 PVC</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">StatefulSet vs Deployment</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">特性</th>
                <th className="text-left py-2">Deployment</th>
                <th className="text-left py-2">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">Pod 名稱</td>
                <td className="py-2">random (abc-xyz)</td>
                <td className="py-2 text-green-400">固定序號 (mysql-0, 1, 2)</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">啟動順序</td>
                <td className="py-2">全部同時</td>
                <td className="py-2 text-green-400">依序（0 → 1 → 2）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">PVC</td>
                <td className="py-2">所有 Pod 共用</td>
                <td className="py-2 text-green-400">每個 Pod 獨立 PVC</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">DNS</td>
                <td className="py-2">只有 Service DNS</td>
                <td className="py-2 text-green-400">每個 Pod 有自己的 DNS</td>
              </tr>
              <tr>
                <td className="py-2">適用</td>
                <td className="py-2">無狀態（API、Web）</td>
                <td className="py-2 text-green-400">有狀態（DB、Cache、MQ）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必須搭配 Headless Service</p>
          <p className="text-sm text-slate-300">clusterIP: None — 不做負載均衡，每個 Pod 有自己的 DNS 記錄</p>
          <p className="text-sm text-slate-400 mt-1 font-mono text-xs">mysql-0.mysql-headless.default.svc.cluster.local</p>
        </div>
      </div>
    ),
    notes: `StatefulSet 給你三個保證。

第一，穩定的身份。Pod 的名稱是固定的 — mysql-0、mysql-1、mysql-2。不管 Pod 被刪幾次重建幾次，mysql-0 永遠是 mysql-0。不像 Deployment 每次重建名字都變。

第二，獨立的儲存。每個 Pod 自動建立自己的 PVC。mysql-0 的 PVC 叫 mysql-data-mysql-0，mysql-1 的叫 mysql-data-mysql-1。即使 Pod 被刪掉重建，新的 mysql-0 還是會掛回 mysql-data-mysql-0 這個 PVC，資料不會搞混。

第三，有序的生命週期。啟動的時候先起 mysql-0，確認它 Ready 之後再起 mysql-1，再起 mysql-2。刪除的時候反過來，先刪 mysql-2，再 mysql-1，最後 mysql-0。

StatefulSet 必須搭配 Headless Service。什麼是 Headless Service？就是 clusterIP: None 的 Service。普通 Service 做負載均衡，你連到 Service 的 IP，它隨機分配給後面的 Pod。但 Headless Service 不做負載均衡，它讓每個 Pod 有自己的 DNS 記錄。

mysql-0.mysql-headless.default.svc.cluster.local — 直接連到 mysql-0。
mysql-1.mysql-headless.default.svc.cluster.local — 直接連到 mysql-1。

這樣你的應用就可以指定「寫入連 mysql-0（主庫），讀取連 mysql-1（從庫）」。

Docker 對照的話，StatefulSet 就像你手動 docker run --name mysql-0 加 -v mysql0-data:/var/lib/mysql，每個容器都有固定的名字和獨立的 Volume。只不過 K8s 把這些自動化了。`,
    duration: '10',
  },

  // ── Slide 8 StatefulSet YAML 拆解 ─────────────────
  {
    title: 'StatefulSet YAML 拆解',
    subtitle: 'serviceName + volumeClaimTemplates',
    section: 'StatefulSet',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">跟 Deployment 的差異（只有兩個欄位不同）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-44">欄位</th>
                <th className="text-left py-2">Deployment</th>
                <th className="text-left py-2">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">serviceName</td>
                <td className="py-2">沒有</td>
                <td className="py-2 text-cyan-400">必須指定 Headless Service</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 font-mono text-xs">volumeClaimTemplates</td>
                <td className="py-2">沒有（用 volumes）</td>
                <td className="py-2 text-cyan-400">自動為每個 Pod 建 PVC</td>
              </tr>
              <tr>
                <td className="py-2">其他</td>
                <td className="py-2">一樣</td>
                <td className="py-2">一樣</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql-headless     # ← 對應 Headless Service
  replicas: 2
  selector:
    matchLabels:
      app: mysql-sts
  template:
    # ... 跟 Deployment 的 template 一樣

  # ← 這是 StatefulSet 獨有的
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi
# mysql-0 → PVC: mysql-data-mysql-0
# mysql-1 → PVC: mysql-data-mysql-1`,
    notes: `來看 YAML 怎麼寫。打開 statefulset-mysql.yaml。

你會發現 StatefulSet 的 YAML 跟 Deployment 非常像。apiVersion 一樣是 apps/v1，selector 和 template 的寫法完全一樣。差別只有兩個地方。

第一個是 serviceName: mysql-headless，這是告訴 StatefulSet 要搭配哪個 Headless Service。這個欄位 Deployment 沒有。

第二個是 volumeClaimTemplates。Deployment 裡面你用 volumes 搭配一個已經存在的 PVC。但 StatefulSet 用 volumeClaimTemplates，它是一個「PVC 範本」— K8s 會根據這個範本，為每個 Pod 自動建立獨立的 PVC。

mysql-0 建立的時候，K8s 自動建一個 PVC 叫 mysql-data-mysql-0（格式是 <template-name>-<pod-name>）。mysql-1 建立的時候，自動建 mysql-data-mysql-1。每個 Pod 有自己的 PVC，資料完全獨立。

其他部分跟 Deployment 一模一樣。如果你已經會寫 Deployment，StatefulSet 只要多學 serviceName 和 volumeClaimTemplates 這兩個欄位就好了。`,
    duration: '10',
  },

  // ── Slide 9 實作：StatefulSet MySQL ───────────────
  {
    title: '實作：StatefulSet MySQL',
    subtitle: 'Lab 7：有序啟動 + 固定名稱 + 獨立 PVC',
    section: 'StatefulSet',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">驗證重點</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-cyan-400 font-semibold">有序啟動：</span>mysql-0 先 Running，mysql-1 才開始</p>
            <p><span className="text-cyan-400 font-semibold">固定名稱：</span>mysql-0、mysql-1（不是 random hash）</p>
            <p><span className="text-cyan-400 font-semibold">獨立 PVC：</span>mysql-data-mysql-0、mysql-data-mysql-1</p>
            <p><span className="text-cyan-400 font-semibold">資料持久：</span>刪 mysql-0，重建後 testdb 還在</p>
            <p><span className="text-cyan-400 font-semibold">有序縮容：</span>scale 到 1 時，mysql-1 先被刪</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：部署
kubectl apply -f statefulset-mysql.yaml

# Step 2：觀察有序啟動
kubectl get pods -w
# mysql-0: Pending → Running (先)
# mysql-1: Pending → Running (後)

# Step 3：驗證固定名稱 + 獨立 PVC
kubectl get pods -l app=mysql-sts     # mysql-0, mysql-1
kubectl get pvc                        # mysql-data-mysql-0, mysql-data-mysql-1

# Step 4：驗證資料獨立
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
kubectl delete pod mysql-0
kubectl get pods -w                    # mysql-0 重建（同名！）
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
# testdb 還在！

# Step 5：有序縮容
kubectl scale statefulset mysql --replicas=1
# mysql-1 先被刪，mysql-0 留著`,
    notes: `動手做。部署 StatefulSet：

kubectl apply -f statefulset-mysql.yaml

馬上用 -w 觀察：

kubectl get pods -w

注意看順序 — mysql-0 先進 Pending，然後 ContainerCreating，然後 Running。mysql-0 變成 Running 之後，mysql-1 才開始建立。這就是有序啟動。如果你之前用 Deployment，三個 Pod 是同時開始建的。

等兩個都 Running 了，按 Ctrl+C。看看 Pod 名稱：

kubectl get pods -l app=mysql-sts

mysql-0、mysql-1。不是 random hash，是固定的序號。

看 PVC：

kubectl get pvc

mysql-data-mysql-0、mysql-data-mysql-1。每個 Pod 有自己的 PVC。

來驗證資料獨立性。進 mysql-0 建一個資料庫：

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"

然後刪掉 mysql-0：

kubectl delete pod mysql-0

觀察 — mysql-0 會被重建，而且名字還是 mysql-0！不像 Deployment 重建的 Pod 會有新的 random 名字。

等它 Running 後，再查：

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"

testdb 還在！因為新的 mysql-0 掛載的還是 mysql-data-mysql-0 這個 PVC，資料沒有丟。

最後試試縮容：

kubectl scale statefulset mysql --replicas=1

注意看，mysql-1 被刪了，mysql-0 留著。是從最大編號開始刪的，不是隨機的。擴回 2 個的時候，mysql-1 會重新建立。`,
    duration: '20',
  },

  // ── Slide 10 痛點：YAML 太多了 ───────────────────
  {
    title: '痛點：YAML 太多了',
    subtitle: '一個真實系統可能有 15+ 個 YAML',
    section: 'Helm',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">回顧今天寫了多少 YAML</p>
          <div className="space-y-1 text-sm text-slate-300 font-mono">
            <p>ingress-basic.yaml — Deployment x2 + Service x2 + Ingress</p>
            <p>ingress-host.yaml — Ingress</p>
            <p>configmap-literal.yaml — ConfigMap + Deployment</p>
            <p>configmap-nginx.yaml — ConfigMap + Deployment + Service</p>
            <p>secret-db.yaml — Secret + Deployment + Service</p>
            <p>pv-pvc.yaml — PV + PVC + Deployment</p>
            <p>statefulset-mysql.yaml — Headless Service + Secret + StatefulSet</p>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">問題</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. YAML 太多，管不動</p>
            <p>2. dev / staging / prod 只差一些參數，但要維護三份</p>
            <p>3. 裝 MySQL 要自己寫 StatefulSet + Headless Service + PVC + Secret...</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-slate-400 text-sm">Docker 時代怎麼解決？→ docker-compose.yml</p>
          <p className="text-cyan-400 font-semibold mt-1">K8s 的解法 → Helm</p>
        </div>
      </div>
    ),
    notes: `好，回顧一下今天做了多少事。打開你的 lesson6 目錄，數一下 YAML 檔案... 7 個。而且每個檔案裡面都不只一個資源。加起來大概有 20 幾個 K8s 物件。

這還只是一個學習用的小系統。真實的生產環境可能有十幾個微服務，每個服務都有 Deployment、Service、ConfigMap、可能還有 Secret、Ingress、PVC。加起來幾十個 YAML 檔案。

然後你要部署到 dev、staging、prod 三個環境。三個環境基本上一樣，只是 replicas 不同、Image tag 不同、資料庫連線不同。你是要維護三套 YAML？改了一個東西要改三個地方？

更慘的是，如果你想在 K8s 上跑一個 MySQL，你得自己寫 StatefulSet、Headless Service、PVC、Secret... 幾百行 YAML。但 MySQL 這種東西不是每個人都在用嗎？為什麼每個人都要自己寫一遍？

用 Docker 的經驗來想，Docker Compose 用一個 docker-compose.yml 就能管理整個系統。K8s 有沒有類似的東西？

有 — Helm。`,
    duration: '5',
  },

  // ── Slide 11 Helm 概念圖 ─────────────────────────
  {
    title: 'Helm 概念',
    subtitle: 'K8s 的套件管理器',
    section: 'Helm',
    content: (
      <div className="space-y-4">
        {/* Helm 概念圖 */}
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Helm 核心概念</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="border-2 border-cyan-500/70 rounded-lg p-3 bg-cyan-900/20 min-w-[120px]">
              <p className="text-cyan-400 text-sm font-bold text-center">Chart</p>
              <p className="text-slate-400 text-[10px] text-center">一包 YAML 範本</p>
              <p className="text-slate-500 text-[10px] text-center">(安裝包)</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">+</span>
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/20 min-w-[120px]">
              <p className="text-amber-400 text-sm font-bold text-center">values.yaml</p>
              <p className="text-slate-400 text-[10px] text-center">客製化參數</p>
              <p className="text-slate-500 text-[10px] text-center">(設定檔)</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">→</span>
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/20 min-w-[120px]">
              <p className="text-green-400 text-sm font-bold text-center">Release</p>
              <p className="text-slate-400 text-[10px] text-center">安裝後的實例</p>
              <p className="text-slate-500 text-[10px] text-center">(已安裝的軟體)</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">三個核心功能</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-cyan-400 font-semibold">1. 一鍵安裝</span> — helm install my-redis bitnami/redis</p>
            <p><span className="text-cyan-400 font-semibold">2. 參數化</span> — values.yaml 管理所有可變參數</p>
            <p><span className="text-cyan-400 font-semibold">3. 版本管理</span> — helm upgrade / helm rollback</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照 Docker Compose</p>
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
      </div>
    ),
    notes: `Helm 就是 K8s 的套件管理器。就像你在 Ubuntu 上用 apt install mysql 一行指令就能裝好 MySQL，Helm 讓你用 helm install my-mysql bitnami/mysql 一行指令就能在 K8s 上部署一整套 MySQL — StatefulSet、Headless Service、PVC、Secret 全部幫你搞定。

Helm 有幾個核心概念。Chart 就是一個安裝包，裡面包了所有需要的 YAML 範本。Release 是 Chart 安裝後的實例，你可以用同一個 Chart 安裝多個 Release（比如一個 Redis 給 cache 用，另一個 Redis 給 session 用）。Repository 是 Chart 的倉庫，最大的公開倉庫是 Bitnami。values.yaml 是參數檔，讓你客製化安裝。

Helm 的三個核心功能。第一，一鍵安裝 — 別人已經把最佳實踐寫成 Chart 了，你直接裝就好。第二，參數化 — 同一個 Chart，dev 環境設 replicas 為 1，prod 設 3，只要改 values.yaml。第三，版本管理 — 升級了新版本發現有 bug？helm rollback 一行指令回到上一版。

對照 Docker Compose 來看：Chart 就像 docker-compose.yml，定義了整個系統的結構。helm install 就像 docker compose up。helm uninstall 就像 docker compose down。values.yaml 就像 .env 檔案。`,
    duration: '10',
  },

  // ── Slide 12 實作：Helm 安裝 Redis ────────────────
  {
    title: '實作：Helm 安裝 Redis',
    subtitle: 'Lab 8：一行指令部署整個系統',
    section: 'Helm',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Helm 幫你建了什麼？</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>StatefulSet / Deployment / Service / Secret / PVC — 全自動！</p>
            <p className="text-slate-400">自己寫 YAML 可能要上百行，Helm 一行指令搞定</p>
          </div>
        </div>
      </div>
    ),
    code: `# Step 1：安裝 Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version

# Step 2：加入 Chart 倉庫
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo redis

# Step 3：一鍵安裝 Redis
helm install my-redis bitnami/redis --set auth.password=myredis123

# Step 4：看看 Helm 幫你建了什麼
kubectl get all -l app.kubernetes.io/instance=my-redis
helm list
helm status my-redis`,
    notes: `來體驗一下 Helm 的威力。先安裝 Helm：

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version

加入 Bitnami 的 Chart 倉庫：

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

搜尋 Redis 的 Chart：

helm search repo redis

你會看到 bitnami/redis 以及版本資訊。

現在一行指令安裝 Redis：

helm install my-redis bitnami/redis --set auth.password=myredis123

等它跑完，看看 Helm 幫你建了什麼：

kubectl get all -l app.kubernetes.io/instance=my-redis

你會看到 StatefulSet、Service、Secret... 全部自動建好了。如果這些你自己寫 YAML，可能要寫個上百行。Helm 一行指令搞定。

查看已安裝的 Release：

helm list

看 Release 的詳細資訊：

helm status my-redis

它會告訴你怎麼連到 Redis、密碼存在哪個 Secret 裡等。`,
    duration: '15',
  },

  // ── Slide 13 Helm upgrade + rollback ──────────────
  {
    title: 'Helm upgrade + rollback',
    subtitle: '升級、回滾、版本管理',
    section: 'Helm',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">對照 K8s 原生操作</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-16">操作</th>
                <th className="text-left py-2">kubectl</th>
                <th className="text-left py-2">Helm</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2">安裝</td>
                <td className="py-2 text-xs">kubectl apply -f *.yaml（自己管）</td>
                <td className="py-2 text-xs text-cyan-400">helm install（一行）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">更新</td>
                <td className="py-2 text-xs">改 YAML + kubectl apply</td>
                <td className="py-2 text-xs text-cyan-400">helm upgrade --set</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">回滾</td>
                <td className="py-2 text-xs">kubectl rollout undo（只能 Deployment）</td>
                <td className="py-2 text-xs text-cyan-400">helm rollback（整個系統）</td>
              </tr>
              <tr>
                <td className="py-2">刪除</td>
                <td className="py-2 text-xs">kubectl delete -f *.yaml（一個一個）</td>
                <td className="py-2 text-xs text-cyan-400">helm uninstall（一行）</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# 升級：改參數
helm upgrade my-redis bitnami/redis \\
  --set auth.password=myredis123 \\
  --set replica.replicaCount=2

# 查看歷史
helm history my-redis
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         deployed    Upgrade complete

# 回滾
helm rollback my-redis 1
helm history my-redis
# REVISION  STATUS      DESCRIPTION
# 1         superseded  Install complete
# 2         superseded  Upgrade complete
# 3         deployed    Rollback to 1

# 清理
helm uninstall my-redis`,
    notes: `安裝好之後，假設你想加一個 Redis 從庫：

helm upgrade my-redis bitnami/redis --set auth.password=myredis123 --set replica.replicaCount=2

注意 --set auth.password 要重複帶，不然 upgrade 的時候密碼會被清掉。這是 Helm 的一個小坑。

看升級歷史：

helm history my-redis

你會看到 REVISION 1 是原始安裝，REVISION 2 是剛才的升級。

如果升級後發現有問題，一行指令回滾：

helm rollback my-redis 1

再看 history，多了一個 REVISION 3，描述是「Rollback to 1」。

對照 K8s 原生操作 — kubectl rollout undo 只能回滾單一個 Deployment。但如果你的系統有 Deployment + StatefulSet + ConfigMap + Secret 一起改了呢？kubectl rollout undo 搞不定。但 helm rollback 可以把整個 Release 的所有資源一起回滾，因為 Helm 記錄的是整個 Release 的快照。

最後清理：

helm uninstall my-redis

一行指令把 Redis 相關的所有資源全部清掉。`,
    duration: '10',
  },

  // ── Slide 14 Helm values.yaml ────────────────────
  {
    title: 'Helm values.yaml',
    subtitle: '用 values 檔管理多環境部署',
    section: 'Helm',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">不同環境用不同的 values 檔</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded">
              <p className="text-blue-400 text-xs font-bold mb-1">values-dev.yaml</p>
              <div className="text-slate-400 text-xs font-mono space-y-0.5">
                <p>replicas: 1</p>
                <p>persistence.size: 1Gi</p>
              </div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
              <p className="text-green-400 text-xs font-bold mb-1">values-prod.yaml</p>
              <div className="text-slate-400 text-xs font-mono space-y-0.5">
                <p>replicas: 3</p>
                <p>persistence.size: 100Gi</p>
              </div>
            </div>
          </div>
          <p className="text-cyan-400 text-sm mt-3 font-semibold">同一個 Chart + 不同 values 檔 = 不同環境的部署</p>
        </div>
      </div>
    ),
    code: `# 查看 Chart 有哪些可設定的參數
helm show values bitnami/redis | head -50

# 建立自己的 values 檔
# my-redis-values.yaml
auth:
  password: "myredis123"
master:
  persistence:
    size: 2Gi
replica:
  replicaCount: 2
  persistence:
    size: 1Gi

# 用 -f 指定 values 檔
helm install my-redis bitnami/redis -f my-redis-values.yaml

# 不同環境用不同的 values 檔
helm install redis-dev  bitnami/redis -f values-dev.yaml
helm install redis-prod bitnami/redis -f values-prod.yaml`,
    notes: `剛才我們用 --set 在命令列傳參數。但如果參數很多，命令列就會超長。更好的方式是用 values.yaml 檔案。

先看看 Chart 有哪些參數可以設定：

helm show values bitnami/redis | head -50

會印出一大堆，每個參數都有註解說明用途。

你可以建一個自己的 values 檔案，只寫你想改的參數。比如我要密碼是 myredis123，master 的 PVC 是 2GB，replica 有 2 個、每個 PVC 是 1GB。把這些寫在 my-redis-values.yaml 裡面。

安裝的時候用 -f 指定：

helm install my-redis bitnami/redis -f my-redis-values.yaml

這個做法最大的好處是什麼？你可以為不同環境建不同的 values 檔。values-dev.yaml 裡面 replicas 設 1、PVC 設 1GB。values-prod.yaml 裡面 replicas 設 3、PVC 設 100GB。同一個 Chart，不同的 values 檔，搞定多環境部署。

是不是跟 Docker Compose 的 .env 檔案很像？概念完全一樣，只是 Helm 的 values 功能更強大，可以做巢狀結構、條件判斷等等。`,
    duration: '10',
  },

  // ── Slide 15 總結 + 反思問題 ─────────────────────
  {
    title: '總結 + 反思問題',
    subtitle: '今天學了 8 個東西',
    section: '總結',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天學了 8 個東西</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-28">主題</th>
                <th className="text-left py-2">一句話</th>
                <th className="text-left py-2 w-36">Docker 對照</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Ingress</td>
                <td className="py-2">域名 + 路徑路由</td>
                <td className="py-2">Nginx 反向代理</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">ConfigMap</td>
                <td className="py-2">一般設定外部化</td>
                <td className="py-2">-e ENV_VAR</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Secret</td>
                <td className="py-2">敏感資料管理</td>
                <td className="py-2">-e PASSWORD=xxx</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">PV</td>
                <td className="py-2">儲存空間（管理員建）</td>
                <td className="py-2">docker volume create</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">PVC</td>
                <td className="py-2">使用儲存空間（開發者用）</td>
                <td className="py-2">-v volume:/path</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">StorageClass</td>
                <td className="py-2">自動建 PV</td>
                <td className="py-2">Volume driver</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">StatefulSet</td>
                <td className="py-2">有狀態應用部署</td>
                <td className="py-2">docker run --name fixed</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400 font-semibold">Helm</td>
                <td className="py-2">K8s 套件管理</td>
                <td className="py-2">Docker Compose 進化版</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">今天的核心觀念</p>
          <div className="space-y-1 text-sm text-slate-300">
            <p>1. 設定和程式碼分離（ConfigMap + Secret）</p>
            <p>2. 資料和 Pod 分離（PV/PVC）</p>
            <p>3. 複雜度用工具管理（Helm）</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">反思問題</p>
          <p className="text-slate-300 text-sm italic">{`「你的系統全部跑起來了。但 API 的程式死鎖了，K8s 還是顯示 Running，流量照送，使用者看到 502。K8s 怎麼知道 Pod『活著但不健康』？」`}</p>
          <p className="text-cyan-400 font-semibold mt-2">→ 下堂課：Probe（健康檢查）+ Resource + RBAC</p>
        </div>
      </div>
    ),
    notes: `好，今天的內容非常多，我們來做個總結。

今天學了 8 個東西。Ingress — 讓使用者用域名和路徑連到不同的服務，不用再記 IP 和 Port。ConfigMap — 把一般設定從 Image 裡抽出來，環境不同只要換 ConfigMap。Secret — 管理密碼和敏感資料，記住 Base64 不是加密。PV 和 PVC — 讓資料在 Pod 重啟後還在，PV 是管理員建的儲存空間，PVC 是開發者的使用申請。StorageClass — 自動建 PV，不用管理員手動建。StatefulSet — 給有狀態應用用的，固定名稱、有序啟動、獨立 PVC。Helm — K8s 的套件管理，一鍵安裝複雜應用。

今天有三個核心觀念。第一，設定和程式碼分離 — ConfigMap 和 Secret 讓你同一個 Image 部署到不同環境。第二，資料和 Pod 分離 — PV/PVC 讓你的資料不會因為 Pod 重啟而消失。第三，複雜度用工具管理 — YAML 太多就用 Helm。

最後留一個反思問題。你的系統全部跑起來了，Ingress 設好了、ConfigMap 分離了、PVC 也掛了。但你的 API Pod 裡面的程式死鎖了，不再處理任何請求。問題是 K8s 還是顯示 Running — 因為 process 沒有退出，K8s 以為它好好的。Service 照樣把流量送過去，使用者看到的是 502 Bad Gateway。

K8s 怎麼知道一個 Pod「活著但不健康」？你要怎麼告訴 K8s 別再送流量給這個 Pod？

提示：想想 Docker 的 HEALTHCHECK 指令。

下堂課我們來教 Probe — 健康檢查、Resource 管理和 RBAC 權限控制。到時候見！`,
    duration: '5',
  },
]
