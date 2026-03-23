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
    notes: `來做個實驗。進 MySQL Pod，建一張 users 表，插入一筆 Alice。查一下，Alice 在。退出 MySQL。

kubectl delete pod -l app=mysql

Deployment 自動重建新 Pod。等新 Pod 跑起來，再進 MySQL：

USE testdb — ERROR: Unknown database 'testdb'。

不只表不見了，連資料庫都不見了。原因：Pod 的檔案系統就是容器的 overlay filesystem。Pod 刪了，容器刪了，filesystem 跟著刪了，資料全部消失。

Docker 對照：跟 docker run mysql 不掛 Volume 一模一樣。Docker 的解法是 docker run -v mydata:/var/lib/mysql，資料存在 Volume 裡，容器刪了資料還在。

K8s 的解法 — PersistentVolume（PV）和 PersistentVolumeClaim（PVC），提供獨立於 Pod 之外的儲存空間。`,
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
    notes: `PV 和 PVC 的關係：管理員建 PV（建立儲存空間），開發者建 PVC（申請使用儲存空間），K8s 自動配對，這個過程叫 Binding。

Docker 對照：docker volume create mydata 就像建 PV。docker run -v mydata:/var/lib/mysql 就像 PVC 掛載到 Pod。Docker 把這兩步合在一起，K8s 拆成兩步。

為什麼拆？因為在企業裡，管儲存的人（管理員）跟寫程式的人（開發者）不是同一個人。管理員負責 PV — 底層是 NFS、AWS EBS、還是本機 SSD。開發者只要建 PVC 說「我需要 10GB」，不需要知道底層實作。

AccessMode 決定儲存的存取方式：RWO（ReadWriteOnce）最常用，同時只能被一個 Node 讀寫。ROX（ReadOnlyMany）多 Node 唯讀。RWX（ReadWriteMany）多 Node 讀寫，需要 NFS 之類的網路儲存才支援。`,
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
    notes: `部署 PV、PVC 和掛載 PVC 的 Deployment：

kubectl apply -f pv-pvc.yaml

看 PV 和 PVC 的狀態：

kubectl get pv
kubectl get pvc

兩個的 STATUS 都應該是 Bound，表示配對成功。如果看到 Pending，常見原因：storageClassName 不一致，或 PV 容量小於 PVC 的 requests。

看 Pod 日誌：

kubectl logs deployment/app-with-storage

會看到寫入了一行「寫入時間 + Pod 名稱」，然後印出檔案內容。

關鍵實驗 — 刪掉 Pod：

kubectl delete pod -l app=app-with-storage

等新 Pod 起來，再看日誌：

kubectl logs deployment/app-with-storage

檔案裡有兩行：第一行是舊 Pod 寫的，第二行是新 Pod 寫的。新 Pod 掛載同一個 PVC，讀到了舊資料，又追加了一行。

對照前面沒掛 PVC 的 MySQL — 刪 Pod 資料就沒了。掛了 PVC，資料就還在。`,
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
    notes: `ReclaimPolicy — PVC 刪掉後，PV 裡的資料怎麼處理？

Retain：PVC 刪了，PV 和資料都保留。PV 狀態變 Released，需要管理員手動清理 claimRef 才能重新綁定。生產環境用這個。

Delete：PVC 刪了，PV 和資料一起刪。雲端常用，PV 對應的 EBS / Azure Disk 也一起刪，省錢。

Recycle：已棄用。

我們的範例用 Retain。驗證一下：

kubectl delete pvc local-pvc
kubectl get pv    # STATUS 變成 Released，不是 Available`,
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
    notes: `剛才的靜態佈建：管理員先建 PV，使用者建 PVC 配對。問題是 100 個微服務就得事先建 100 個 PV。

動態佈建：使用者只建 PVC，K8s 根據 StorageClass 自動建 PV。StorageClass 定義了「用什麼 provisioner 建 PV」。AWS 上用 EBS CSI driver 自動建 EBS 磁碟，k3s 內建 local-path provisioner 在 Node 本機建目錄。

查看叢集的 StorageClass：

kubectl get storageclass

k3s 有一個 local-path，後面標 (default) — PVC 沒指定 storageClassName 就用它。

動態佈建的 PVC 寫法：storageClassName: local-path，不用事先建 PV。生產環境基本上都用動態佈建。`,
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
    notes: `用 Deployment replicas: 3 跑 MySQL 主從架構，會遇到四個問題：

1. Pod 名稱隨機（mysql-deploy-abc-xyz），重建後名字變了，主庫是哪個？從庫怎麼連？
2. 三個 Pod 同時啟動，但主從架構需要主庫先啟動拿到 binlog position，從庫再連上去。
3. 三個 Pod 共用一個 PVC，三個 MySQL instance 同時寫同一塊磁碟，資料衝突。
4. Service 負載均衡隨機分配，但寫入要送主庫、讀取送從庫，無法區分。

Deployment 設計給無狀態應用（API、Web Server），Pod 之間沒差別。資料庫是有狀態的，每個 Pod 有自己的身份。

K8s 給有狀態應用的資源 — StatefulSet。`,
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
    notes: `StatefulSet 三個保證：

1. 穩定身份：Pod 名稱固定 — mysql-0、mysql-1、mysql-2。刪了重建還是同名。
2. 獨立儲存：每個 Pod 自動建 PVC — mysql-data-mysql-0、mysql-data-mysql-1。Pod 重建後掛回同一個 PVC。
3. 有序生命週期：啟動順序 mysql-0 → mysql-1 → mysql-2（前一個 Ready 才起下一個）。刪除反過來 mysql-2 → mysql-1 → mysql-0。

必須搭配 Headless Service（clusterIP: None）。普通 Service 做負載均衡，Headless Service 不做負載均衡，讓每個 Pod 有獨立的 DNS 記錄：

mysql-0.mysql-headless.default.svc.cluster.local → 直接連到 mysql-0
mysql-1.mysql-headless.default.svc.cluster.local → 直接連到 mysql-1

應用可以指定寫入連 mysql-0（主庫），讀取連 mysql-1（從庫）。

Docker 對照：等同於手動 docker run --name mysql-0 -v mysql0-data:/var/lib/mysql，每個容器固定名字 + 獨立 Volume。K8s 把這些自動化了。`,
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
    notes: `打開 statefulset-mysql.yaml。StatefulSet 的 YAML 跟 Deployment 差別只有兩個欄位：

1. serviceName: mysql-headless — 指定搭配的 Headless Service。Deployment 沒有這個欄位。

2. volumeClaimTemplates — PVC 範本。Deployment 用 volumes 掛已存在的 PVC，StatefulSet 用 volumeClaimTemplates 自動為每個 Pod 建獨立 PVC。

PVC 命名格式：<template-name>-<pod-name>
- mysql-0 → PVC: mysql-data-mysql-0
- mysql-1 → PVC: mysql-data-mysql-1

其他部分（apiVersion、selector、template）跟 Deployment 完全一樣。`,
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
    notes: `部署 StatefulSet：

kubectl apply -f statefulset-mysql.yaml
kubectl get pods -w

觀察有序啟動：mysql-0 先 Pending → ContainerCreating → Running，mysql-0 Ready 之後 mysql-1 才開始建。Deployment 的 Pod 是同時建的。

等兩個都 Running，Ctrl+C。看 Pod 名稱：

kubectl get pods -l app=mysql-sts
# mysql-0、mysql-1 — 固定序號，不是 random hash

kubectl get pvc
# mysql-data-mysql-0、mysql-data-mysql-1 — 每個 Pod 獨立 PVC

驗證資料持久性：

kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "CREATE DATABASE testdb;"
kubectl delete pod mysql-0
kubectl get pods -w    # mysql-0 重建，名字還是 mysql-0
kubectl exec -it mysql-0 -- mysql -u root -prootpass123 -e "SHOW DATABASES;"
# testdb 還在 — 新 mysql-0 掛回 mysql-data-mysql-0

驗證有序縮容：

kubectl scale statefulset mysql --replicas=1
# mysql-1 先被刪，mysql-0 留著 — 從最大編號開始刪`,
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
    notes: `回顧今天的 lesson6 目錄 — 7 個 YAML 檔，加起來 20 幾個 K8s 物件。這還只是學習環境。

生產環境的問題：
1. 十幾個微服務，每個有 Deployment + Service + ConfigMap + Secret + Ingress + PVC，幾十個 YAML。
2. dev / staging / prod 只差 replicas、image tag、DB 連線，但要維護三套 YAML。
3. 裝 MySQL 要自己寫 StatefulSet + Headless Service + PVC + Secret，幾百行，但每個團隊都在重複寫。

Docker 對照：Docker Compose 一個 docker-compose.yml 管理整個系統。K8s 的對應方案 — Helm。`,
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
    notes: `Helm 是 K8s 的套件管理器。helm install my-mysql bitnami/mysql 一行指令就能部署 StatefulSet + Headless Service + PVC + Secret 全套 MySQL。

核心概念：
- Chart：安裝包，裡面是 YAML 範本。最大公開倉庫是 Bitnami。
- Release：Chart 安裝後的實例。同一個 Chart 可以裝多個 Release（一個 Redis 給 cache，另一個給 session）。
- values.yaml：參數檔，客製化安裝內容。

三個核心功能：
1. 一鍵安裝 — helm install，別人寫好的最佳實踐直接裝。
2. 參數化 — 同一個 Chart，dev 設 replicas: 1，prod 設 replicas: 3，改 values.yaml 就好。
3. 版本管理 — helm upgrade 升級，helm rollback 回滾。

Docker Compose 對照：Chart = docker-compose.yml，helm install = docker compose up，helm uninstall = docker compose down，values.yaml = .env。`,
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
    notes: `安裝 Helm：

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version

加入 Bitnami Chart 倉庫：

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo redis    # 看到 bitnami/redis + 版本資訊

一行指令安裝 Redis：

helm install my-redis bitnami/redis --set auth.password=myredis123

看 Helm 自動建了什麼：

kubectl get all -l app.kubernetes.io/instance=my-redis
# StatefulSet、Service、Secret 全部自動建好

helm list              # 查看已安裝的 Release
helm status my-redis   # 顯示連線方式、密碼存在哪個 Secret`,
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
    notes: `加一個 Redis 從庫：

helm upgrade my-redis bitnami/redis --set auth.password=myredis123 --set replica.replicaCount=2

注意：--set auth.password 要重複帶，不然 upgrade 時密碼會被重設為預設值。這是常見的坑。

helm history my-redis
# REVISION 1 = 原始安裝，REVISION 2 = 升級

回滾：

helm rollback my-redis 1
helm history my-redis
# REVISION 3，描述 Rollback to 1

helm rollback vs kubectl rollout undo 的差異：kubectl rollout undo 只能回滾單一 Deployment。helm rollback 回滾整個 Release 的所有資源（Deployment + StatefulSet + ConfigMap + Secret），因為 Helm 記錄的是整個 Release 的快照。

清理：

helm uninstall my-redis    # 所有 Redis 相關資源一次清掉`,
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
    notes: `參數多的時候用 values.yaml 檔案取代 --set。

查看 Chart 可設定的參數：

helm show values bitnami/redis | head -50

建自己的 values 檔，只寫要改的參數（my-redis-values.yaml），用 -f 指定：

helm install my-redis bitnami/redis -f my-redis-values.yaml

多環境部署：同一個 Chart + 不同 values 檔。

helm install redis-dev  bitnami/redis -f values-dev.yaml   # replicas: 1, size: 1Gi
helm install redis-prod bitnami/redis -f values-prod.yaml  # replicas: 3, size: 100Gi

Docker 對照：values.yaml 等同於 .env 檔案，但支援巢狀結構和條件判斷。`,
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

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">這個章節你學會了：</p>
          <div className="text-slate-300 text-sm space-y-1">
            <p>✓ kubectl get pv 看到 PV，STATUS = Bound</p>
            <p>✓ 寫入資料後 kubectl delete pod，新 Pod 起來資料還在</p>
            <p>✓ 建 PVC 不指定 PV → StorageClass 自動建 PV</p>
            <p>✓ kubectl get pods 看到 mysql-0、mysql-1 有序啟動（StatefulSet）</p>
            <p>✓ helm install my-redis bitnami/redis 成功安裝</p>
            <p>✓ helm upgrade 改參數後 helm rollback 成功回到上一版</p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">反思問題</p>
          <p className="text-slate-300 text-sm italic">{`「你的系統全部跑起來了。但 API 的程式死鎖了，K8s 還是顯示 Running，流量照送，使用者看到 502。K8s 怎麼知道 Pod『活著但不健康』？」`}</p>
          <p className="text-cyan-400 font-semibold mt-2">→ 下堂課：Probe（健康檢查）+ Resource + RBAC</p>
        </div>
      </div>
    ),
    notes: `總結今天 8 個東西：
- Ingress：域名 + 路徑路由到不同 Service
- ConfigMap：一般設定外部化，環境不同換 ConfigMap
- Secret：敏感資料管理，Base64 不是加密
- PV：管理員建的儲存空間
- PVC：開發者的使用申請，Pod 掛載 PVC
- StorageClass：動態佈建，自動建 PV
- StatefulSet：固定名稱、有序啟動、獨立 PVC
- Helm：一鍵安裝、參數化部署、版本管理

三個核心觀念：
1. 設定和程式碼分離（ConfigMap + Secret）
2. 資料和 Pod 分離（PV/PVC）
3. 複雜度用工具管理（Helm）

反思問題：API Pod 程式死鎖，不處理請求，但 process 沒退出，K8s 顯示 Running，Service 照送流量，使用者看到 502。K8s 怎麼知道 Pod「活著但不健康」？提示：Docker 的 HEALTHCHECK。

下堂課：Probe（健康檢查）+ Resource 管理 + RBAC 權限控制。`,
    duration: '5',
  },
]
