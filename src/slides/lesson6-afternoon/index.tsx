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

  // ── 6-11 概念（1/2）：Pod 重啟資料消失 → PV/PVC 解法 ──
  {
    title: 'Pod 重啟 → 資料全消失',
    subtitle: 'MySQL Pod 刪了重建，資料庫不見了',
    section: 'Loop 4：PV + PVC',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">實驗：資料消失了！</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p>進 MySQL Pod，建 testdb、插入 Alice</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p>SELECT * FROM users → Alice 在！</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><code className="text-green-400">kubectl delete pod -l app=mysql</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">4.</span>
              <p>新 Pod → USE testdb → <span className="text-red-400 font-bold">ERROR: Unknown database 'testdb'</span></p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">為什麼？</p>
          <div className="text-sm text-slate-300 font-mono bg-slate-900 p-2 rounded">
            <p>Pod 檔案系統 = 容器 overlay filesystem</p>
            <p>Pod 刪 → 容器刪 → filesystem 刪 → 資料不見</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker 也一樣</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-red-900/20 border border-red-500/30 p-2 rounded text-center">
              <p className="text-red-400 text-xs font-semibold">不掛 -v</p>
              <p className="text-slate-400 text-xs">容器刪 → 資料沒</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 p-2 rounded text-center">
              <p className="text-green-400 text-xs font-semibold">掛 -v</p>
              <p className="text-slate-400 text-xs">容器刪 → 資料還在</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">K8s 解法 → PV + PVC</p>
          <div className="text-sm text-slate-300 space-y-1">
            <p><strong className="text-white">emptyDir</strong> 跟 Pod 綁定，Pod 刪就沒 → 不能用</p>
            <p>需要「跟 Pod 無關」的儲存 → <strong className="text-cyan-400">PersistentVolume + PersistentVolumeClaim</strong></p>
          </div>
        </div>
      </div>
    ),
    code: `# 進 MySQL Pod 建資料
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> CREATE DATABASE testdb;
> USE testdb;
> CREATE TABLE users (id INT, name VARCHAR(50));
> INSERT INTO users VALUES (1, 'Alice');
> SELECT * FROM users;    # Alice 在！
> exit

# 模擬 Pod 重啟
kubectl delete pod -l app=mysql

# 新 Pod 起來後再查
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> USE testdb;              # ERROR: Unknown database 'testdb'
# 資料全部不見了！`,
    notes: `好，歡迎回來。上午我們把 Ingress、ConfigMap、Secret 全部整合在一起了。使用者可以用域名連到你的服務，設定和密碼也不再寫死在 Image 裡面。聽起來一切都很完美，對不對？

但是我要跟大家做一個殘酷的實驗。

上午我們部署了 MySQL，用 Secret 管理密碼。現在進 MySQL 建一張表，插入一筆資料。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123

進去之後打 CREATE DATABASE testdb，然後 USE testdb，CREATE TABLE users (id INT, name VARCHAR(50))，INSERT INTO users VALUES (1, 'Alice')。查一下 SELECT * FROM users，Alice 在，完美。退出 MySQL。

好，現在我模擬一個場景。生產環境很常發生的事情：Pod 因為某些原因被重啟了。可能是 Node 記憶體不夠把 Pod 趕走了，可能是你做了一次 rollout restart，也可能就只是 Pod crash 了。我們用最簡單的方式模擬。

kubectl delete pod -l app=mysql

Pod 被刪了。但別擔心，Deployment 會自動重建一個新的 Pod。等新 Pod 跑起來之後，我們再進 MySQL 看看。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123

進去之後打 USE testdb。

ERROR 1049 (42000): Unknown database 'testdb'。

資料全部不見了。不是只有 Alice 不見了，連資料庫本身都不見了。就好像你從來沒建過這個資料庫一樣。

為什麼會這樣？因為 Pod 的檔案系統就是容器的 overlay filesystem。Pod 被刪了，容器被刪了，filesystem 也跟著被刪了，裡面的所有檔案通通消失。MySQL 的資料存在 /var/lib/mysql 這個目錄裡面，Pod 一刪，這個目錄就沒了。

用 Docker 的經驗來想，這件事一點都不意外。你 docker run mysql 的時候如果不掛 -v，容器刪了資料就沒了。Docker 的解法是什麼？掛 Volume。docker run -v mydata:/var/lib/mysql mysql:8.0，資料存在 Volume 裡面，容器怎麼刪都不怕。

那第四堂課我們不是學過 Volume 嗎？有的同學可能記得，第四堂講了一個叫 emptyDir 的東西。emptyDir 確實是一種 Volume，但它有一個致命的問題：它跟 Pod 的生命週期綁定。Pod 在，emptyDir 在。Pod 刪了，emptyDir 也跟著刪了。emptyDir 的用途是讓同一個 Pod 裡面的多個容器共享資料，比如 Sidecar 模式。它不是拿來做資料持久化的。

所以我們需要一種「跟 Pod 無關」的儲存空間。Pod 來來去去，這塊儲存穩穩地待在那裡，不受 Pod 的生死影響。

K8s 提供的方案是兩個東西：PersistentVolume，簡稱 PV，和 PersistentVolumeClaim，簡稱 PVC。 [▶ 下一頁]`,
  },

  // ── 6-11 概念（2/2）：PV/PVC 比喻 + AccessMode + ReclaimPolicy ──
  {
    title: 'PV + PVC 概念',
    subtitle: '停車位（PV）+ 租約（PVC）+ K8s 自動配對',
    section: 'Loop 4：PV + PVC',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">PV / PVC 關係圖</p>
          <div className="flex items-start justify-center gap-4 flex-wrap">
            <div className="border-2 border-amber-500/70 rounded-lg p-3 bg-amber-900/10 min-w-[160px]">
              <p className="text-amber-400 text-sm font-bold text-center mb-2">管理員</p>
              <div className="bg-amber-900/40 border border-amber-500/30 px-2 py-2 rounded text-center">
                <p className="text-amber-300 text-xs font-semibold">建立 PV</p>
                <p className="text-slate-400 text-[10px]">「10GB SSD 停車位」</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-6">
              <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
                <p className="text-cyan-400 text-xs font-bold">K8s 自動配對</p>
                <p className="text-slate-400 text-[10px]">Binding</p>
              </div>
            </div>
            <div className="border-2 border-green-500/70 rounded-lg p-3 bg-green-900/10 min-w-[160px]">
              <p className="text-green-400 text-sm font-bold text-center mb-2">開發者</p>
              <div className="bg-green-900/40 border border-green-500/30 px-2 py-2 rounded text-center">
                <p className="text-green-300 text-xs font-semibold">建立 PVC</p>
                <p className="text-slate-400 text-[10px]">「我要 5GB 停車位租約」</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="bg-blue-900/40 border border-blue-500/50 px-4 py-2 rounded-lg">
              <p className="text-blue-400 text-xs font-bold text-center">Pod 拿著租約去停車</p>
              <p className="text-slate-400 text-[10px] text-center">volumes: persistentVolumeClaim</p>
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
                <td className="py-2">一個 Node 讀寫（最常用）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2">ReadOnlyMany</td>
                <td className="py-2 font-semibold text-cyan-400">ROX</td>
                <td className="py-2">多個 Node 唯讀</td>
              </tr>
              <tr>
                <td className="py-2">ReadWriteMany</td>
                <td className="py-2 font-semibold text-cyan-400">RWX</td>
                <td className="py-2">多個 Node 讀寫（需 NFS）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ReclaimPolicy（回收策略）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-600">
                <th className="text-left py-2 w-24">策略</th>
                <th className="text-left py-2">行為</th>
                <th className="text-left py-2 w-32">適合</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 text-cyan-400 font-semibold">Retain</td>
                <td className="py-2">PVC 刪了，PV 和資料保留</td>
                <td className="py-2">生產環境</td>
              </tr>
              <tr>
                <td className="py-2 text-cyan-400 font-semibold">Delete</td>
                <td className="py-2">PVC 刪了，PV 和資料一起刪</td>
                <td className="py-2">開發/雲端</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `我用一個生活化的比喻來解釋。PV 就像停車場裡的停車位。停車場管理員，也就是 K8s 管理員，負責規劃停車位：這裡有一個 10GB 的位子，那裡有一個 50GB 的位子，這個是 SSD 的高級車位，那個是 HDD 的普通車位。管理員把這些車位劃好，就是建立 PV。

PVC 就像停車位租約。開發者說：「我的 MySQL 需要一個 5GB 的停車位，要能讀寫。」這就是建立 PVC。開發者不需要知道底層是 NFS 還是 SSD 還是雲端磁碟，他只要說「我要多大、什麼模式」就好。

然後 K8s 自動幫你配對。它看看有沒有合適的 PV 能滿足這個 PVC 的需求，找到了就把它們綁在一起，這個過程叫 Binding。配對成功之後，Pod 就可以透過 PVC 掛載這塊儲存空間了。

對照 Docker 來看。docker volume create mydata 就像建立 PV，創造一塊儲存空間。docker run -v mydata:/var/lib/mysql 就像 PVC，把那塊儲存空間掛到容器裡。Docker 把這兩步合在一起了，K8s 把它拆成兩步。

為什麼要拆？因為職責分離。在大公司裡面，管儲存的人跟寫程式的人不是同一個人。基礎架構團隊負責「我們公司有幾台 NAS、幾塊 SSD、每塊多大」，這是 PV。應用開發團隊只要說「我的 App 需要 10GB 空間」，這是 PVC。開發者不需要知道底層的實作細節。

PV 有兩個重要的屬性要知道。第一個是 AccessMode，存取模式。RWO，ReadWriteOnce，同時只能被一個 Node 掛載讀寫，這是最常用的，資料庫通常用這個。ROX，ReadOnlyMany，可以被多個 Node 唯讀掛載，適合存靜態檔案。RWX，ReadWriteMany，可以被多個 Node 同時讀寫，但不是所有儲存系統都支援，通常需要 NFS 之類的網路儲存。

第二個是 ReclaimPolicy，回收策略。當 PVC 被刪掉的時候，PV 裡的資料怎麼處理？Retain 是保留，PVC 刪了但 PV 和資料都還在，管理員可以手動決定要不要清理。生產環境通常用這個，因為資料不能隨便丟。Delete 是刪除，PVC 一刪 PV 也跟著刪，資料也消失。雲端環境常用這個，PVC 刪了對應的 EBS 磁碟也一起刪掉省錢。

靜態佈建的流程是這樣的：管理員先建 PV，開發者建 PVC，K8s 自動配對，Pod 掛 PVC 使用。概念講完了，下一支影片我們來動手做。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（1/2）：PV + PVC YAML + 部署驗證 ──
  {
    title: 'Lab：PV + PVC 靜態佈建',
    subtitle: 'PV YAML + PVC YAML + MySQL Deployment 掛載',
    section: 'Loop 4：PV + PVC',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">PV YAML 四重點</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold w-40">capacity</td>
                <td className="py-2">storage: 2Gi</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">accessModes</td>
                <td className="py-2">ReadWriteOnce</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">reclaimPolicy</td>
                <td className="py-2">Retain</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-cyan-400 font-semibold">hostPath</td>
                <td className="py-2">/tmp/k8s-pv-data（學習用，生產用 NFS/雲端磁碟）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">PVC YAML 三重點</p>
          <table className="w-full text-sm">
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold w-40">accessModes</td>
                <td className="py-2">ReadWriteOnce（跟 PV 一致）</td>
              </tr>
              <tr className="border-b border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-semibold">requests.storage</td>
                <td className="py-2">1Gi（PV 有 2Gi，夠用就配對）</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-cyan-400 font-semibold">storageClassName</td>
                <td className="py-2">manual（跟 PV 一致才能配對）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">配對關鍵</p>
          <p className="text-slate-300 text-xs mt-1">storageClassName 一致 + accessModes 一致 + PV 容量 &ge; PVC 需求</p>
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
  storageClassName: manual`,
    notes: `好，上一支影片講了 PV 和 PVC 的概念，這支影片直接動手做。大家打開終端機，確認叢集還在跑。

首先我們來看 YAML 怎麼寫。先看 PV。

apiVersion 是 v1，kind 是 PersistentVolume，metadata 裡面 name 叫 local-pv。spec 裡面有四個重點。第一個 capacity，storage 是 2Gi，表示這塊 PV 有 2GB 的空間。第二個 accessModes，設 ReadWriteOnce，只能一個 Node 讀寫。第三個 persistentVolumeReclaimPolicy 設 Retain，PVC 刪了資料保留。第四個 hostPath，path 是 /tmp/k8s-pv-data，表示用 Node 本機的這個目錄當儲存空間。hostPath 是最簡單的 PV 類型，就是用 Node 上的一個目錄，學習的時候用來練手。生產環境不會用 hostPath，會用 NFS、雲端磁碟之類的。最後一個 storageClassName 設成 manual，等一下 PVC 要用同一個名字來配對。

再看 PVC。apiVersion 是 v1，kind 是 PersistentVolumeClaim，metadata 裡面 name 叫 local-pvc。spec 裡面 accessModes 設 ReadWriteOnce，跟 PV 一致。resources 的 requests 裡面 storage 是 1Gi，表示我申請 1GB 的空間。storageClassName 是 manual，跟 PV 的 storageClassName 一致。K8s 會根據 storageClassName 和 accessModes 去找合適的 PV。PV 有 2GB，PVC 要 1GB，空間夠，就配對成功。 [▶ 下一頁]`,
  },

  // ── 6-12 實作（2/2）：MySQL 掛載 PVC + 關鍵實驗 ──
  {
    title: 'Lab：MySQL 掛 PVC → 砍 Pod → 資料還在！',
    subtitle: 'Deployment volumeMounts + PVC 掛載驗證',
    section: 'Loop 4：PV + PVC',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">操作流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f pv-pvc.yaml</code></li>
            <li><code className="text-green-400">kubectl get pv</code> -- STATUS: Bound</li>
            <li><code className="text-green-400">kubectl get pvc</code> -- STATUS: Bound</li>
            <li>進 MySQL 建 testdb、插入 Alice</li>
            <li><code className="text-green-400">kubectl delete pod -l app=mysql</code></li>
            <li>新 Pod 起來 → USE testdb → <span className="text-green-400 font-bold">Alice 還在！</span></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">關鍵對比</p>
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

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Deployment 掛 PVC 的寫法</p>
          <p className="text-slate-300 text-xs">volumes 引用 PVC，volumeMounts 掛到 /var/lib/mysql</p>
        </div>
      </div>
    ),
    code: `# Deployment 掛載 PVC（差異部分）
spec:
  template:
    spec:
      containers:
        - name: mysql
          image: mysql:8.0
          volumeMounts:
            - name: mysql-storage
              mountPath: /var/lib/mysql
      volumes:
        - name: mysql-storage
          persistentVolumeClaim:
            claimName: local-pvc    # 引用 PVC

# 部署 + 驗證
kubectl apply -f pv-pvc.yaml
kubectl get pv,pvc              # 都是 Bound
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> CREATE DATABASE testdb; USE testdb;
> CREATE TABLE users (id INT, name VARCHAR(50));
> INSERT INTO users VALUES (1, 'Alice');
> exit
kubectl delete pod -l app=mysql  # 砍 Pod
kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123
> USE testdb; SELECT * FROM users;  # Alice 還在！`,
    notes: `最後是 Deployment。跟之前的 MySQL Deployment 幾乎一樣，差別在 volumes 和 volumeMounts 的部分。volumes 裡面有一個 name 叫 mysql-storage，persistentVolumeClaim 的 claimName 是 local-pvc，就是剛才建的那個 PVC。containers 裡面的 volumeMounts，name 是 mysql-storage，mountPath 是 /var/lib/mysql，就是 MySQL 存資料的目錄。這樣 MySQL 寫到 /var/lib/mysql 的資料就會存到 PVC 對應的 PV 上面，不再存在容器的 overlay filesystem 裡面了。

好，部署。

kubectl apply -f pv-pvc.yaml

先看 PV 和 PVC 的狀態。

kubectl get pv

你應該看到 local-pv，STATUS 是 Bound，CLAIM 欄位顯示 default/local-pvc。

kubectl get pvc

local-pvc，STATUS 也是 Bound，VOLUME 欄位顯示 local-pv。兩個綁在一起了。

如果你看到 Pending，表示配對失敗了。最常見的原因有兩個：storageClassName 不一致，或者 PV 的容量比 PVC 要求的小。PVC 要 5GB 但 PV 只有 2GB，那就配不上。

等 MySQL Pod 跑起來之後，我們再做一次跟上午一樣的實驗。進 MySQL。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123

建資料庫，建表，插資料。CREATE DATABASE testdb; USE testdb; CREATE TABLE users (id INT, name VARCHAR(50)); INSERT INTO users VALUES (1, 'Alice'); SELECT * FROM users;

Alice 在。退出。

現在來做關鍵的實驗。砍 Pod。

kubectl delete pod -l app=mysql

等新 Pod 跑起來，再進 MySQL。

kubectl exec -it deployment/mysql-deploy -- mysql -u root -prootpassword123

USE testdb;

這次不是 ERROR 了。SELECT * FROM users;

Alice 還在！

大家仔細感受一下這個差別。上午沒掛 PVC 的時候，砍 Pod 資料全消失。現在掛了 PVC，砍 Pod 資料還活著。因為 MySQL 的資料不再存在容器裡面了，而是存在 PV 對應的 hostPath 目錄裡面。Pod 被刪了，新的 Pod 掛載同一個 PVC，讀到同一個目錄，資料自然還在。

這就是 PV/PVC 存在的意義。Docker 的 Volume 做的是一模一樣的事情，只是 K8s 把它拆成 PV 和 PVC 兩層，做了職責分離。 [▶ 下一頁]`,
  },

  // ── 6-12 學員實作 ──
  {
    title: '學員實作：PV + PVC 資料持久化',
    subtitle: 'Loop 4 練習題',
    section: 'Loop 4：PV + PVC',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：PV + PVC + MySQL → 驗證資料持久化</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>手寫 PV YAML（hostPath，2Gi，storageClassName: manual）</li>
            <li>手寫 PVC YAML（1Gi，storageClassName: manual）</li>
            <li>MySQL Deployment 掛載 PVC</li>
            <li>進 MySQL 建 testdb、插入資料</li>
            <li><code className="text-green-400">kubectl delete pod -l app=mysql</code></li>
            <li>新 Pod 起來 → 驗證資料還在</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：觀察 PVC Pending</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>PV 已被第一個 PVC 佔走（一個 PV 只能綁一個 PVC）</li>
            <li>再建第二個 PVC → 觀察一直 Pending</li>
            <li>思考：如果有 100 個微服務，手動建 100 個 PV？</li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：自己手寫 PV + PVC 的 YAML，部署一個 MySQL Pod，進去寫資料，砍 Pod，驗證資料還在。挑戰題：建好 PV 之後，再建第二個 PVC，但 PV 已經被第一個 PVC 佔走了。觀察第二個 PVC 的狀態，你會看到它一直 Pending，因為沒有 PV 可以配對了。大家動手做，有問題舉手。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-13 回頭操作 Loop 4 ──
  {
    title: 'PV/PVC 排錯 + 常見坑',
    subtitle: '回頭操作 Loop 4',
    section: 'Loop 4：PV + PVC',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">確認狀態</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl get pv,pvc</code> -- 兩個都是 Bound</li>
            <li>MySQL Pod 是 Running 狀態</li>
            <li>砍 Pod 後資料還在</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">PVC 一直 Pending？三個坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">storageClassName 不一致</strong> -- PV 寫 manual，PVC 也要寫 manual</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">accessModes 不匹配</strong> -- PVC 要 RWX 但 PV 只有 RWO，配不上</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">容量不夠</strong> -- PVC 要 5Gi 但 PV 只有 2Gi，配不上</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">銜接下一個 Loop</p>
          <p className="text-slate-300 text-xs mt-1">10 個微服務就要手動建 10 個 PV？太煩了 → StorageClass 自動建 PV</p>
        </div>
      </div>
    ),
    notes: `好，時間差不多了，我們來回頭確認一下大家都做到了。

如果你的 PV 和 PVC 已經建好了，kubectl get pv,pvc 看一下，兩個都是 Bound 就對了。然後 MySQL Pod 要是 Running 狀態。

如果你的 PVC 一直 Pending，來看看常見的三個坑。

第一個坑，storageClassName 不一致。PV 寫的是 manual，PVC 寫的也要是 manual。如果 PV 寫 manual 但 PVC 忘了寫，或者寫錯了，K8s 就配不上。

第二個坑，accessModes 不匹配。PV 設 ReadWriteOnce，PVC 也要設 ReadWriteOnce。如果 PVC 設了 ReadWriteMany 但 PV 只支援 ReadWriteOnce，也配不上。

第三個坑，容量不夠。PVC 要 5Gi 但 PV 只有 2Gi，配不上。PV 的容量必須大於等於 PVC 的要求。

這三個是最常見的問題，大家記一下。

有做到挑戰題的同學有沒有？你應該看到第二個 PVC 一直 Pending。因為我們只有一個 PV，已經被第一個 PVC 佔走了。一個 PV 同時只能綁一個 PVC。第二個 PVC 找不到 PV，就只能等。

那我問大家一個問題。如果我有十個微服務，每個都需要 PVC，那我是不是要手動建十個 PV？如果以後又多了五個微服務，再手動建五個？管理員每天的工作就是建 PV？

太煩了。有沒有辦法自動建 PV？

有，這就是下一個 Loop 要學的東西 -- StorageClass。 [▶ 下一頁]`,
  },

  // ============================================================
  // Loop 5：StorageClass + StatefulSet（6-14, 6-15, 6-16）
  // ============================================================

  // ── 6-14 概念（1/2）：StorageClass 動態佈建 ──
  {
    title: 'StorageClass -- 自動建 PV',
    subtitle: '靜態佈建太煩 → 動態佈建',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">動態佈建流程</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-green-900/40 border border-green-500/50 px-3 py-2 rounded-lg">
              <p className="text-green-400 text-xs font-bold">PVC 請求</p>
              <p className="text-slate-400 text-[10px]">「我要 1Gi」</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">&rarr;</span>
            <div className="border-2 border-cyan-500/70 rounded-lg px-3 py-2 bg-cyan-900/20">
              <p className="text-cyan-400 text-xs font-bold">StorageClass</p>
              <p className="text-slate-400 text-[10px]">local-path</p>
            </div>
            <span className="text-slate-400 font-bold text-lg">&rarr;</span>
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
                <td className="py-2">管理員先建 PV → PVC 配對</td>
                <td className="py-2">PVC 建立 → <span className="text-cyan-400 font-semibold">自動建 PV</span></td>
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

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">k3s 內建 local-path StorageClass</p>
          <p className="text-slate-300 text-sm"><code className="text-green-400">kubectl get storageclass</code> → local-path (default)</p>
          <p className="text-slate-400 text-xs mt-1">PVC 沒指定 storageClassName 就自動用 default</p>
        </div>
      </div>
    ),
    code: `# StorageClass YAML（k3s 已內建，不用自己建）
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-path
provisioner: rancher.io/local-path
reclaimPolicy: Delete

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

# 查看 k3s 內建的 StorageClass
kubectl get storageclass
# NAME                   PROVISIONER
# local-path (default)   rancher.io/local-path`,
    notes: `上一個 Loop 我們用 PV 和 PVC 解決了資料持久化的問題。Pod 刪了資料還在，非常棒。但是我剛才留了一個問題：如果你有十個微服務，每個都需要 PVC，管理員要手動建十個 PV。以後又多了五個微服務，再建五個。

在小規模的環境裡這還能接受，但想像一下企業環境。你的公司有三個叢集、五十個微服務、每個都需要儲存空間。管理員每天的工作就是建 PV、改 PV、刪 PV。而且建 PV 的時候你要預估大小，建太大浪費空間，建太小不夠用。

剛才我們做的叫「靜態佈建」，管理員先建好 PV，開發者再建 PVC 去配對。K8s 還支援另一種方式叫「動態佈建」。開發者只要建 PVC，K8s 自動幫你建一個匹配的 PV。不用管理員動手。

自動建 PV 的祕密就是 StorageClass。StorageClass 是一個 K8s 資源，它告訴 K8s：「當有人建 PVC 的時候，用什麼方式自動建立 PV。」它就像一個工廠的模板。你告訴工廠「我要做什麼規格的零件」，以後每次有訂單進來，工廠就自動照著模板生產，不用每次都手動畫圖紙。

StorageClass 的 YAML 很簡單。apiVersion 是 storage.k8s.io/v1，kind 是 StorageClass，metadata 裡面 name 叫 local-path。provisioner 是 rancher.io/local-path，這是告訴 K8s「用 Rancher 的 local-path provisioner 來建 PV」。reclaimPolicy 設 Delete。

好消息是，k3s 已經內建了一個 local-path 的 StorageClass，你不用自己建。打 kubectl get storageclass 看看，你會看到一個叫 local-path 的 StorageClass，後面標了 default。default 的意思是如果 PVC 沒有指定 storageClassName，就自動用這個。

用動態佈建的時候，PVC 的 YAML 只要指定 storageClassName 是 local-path，然後寫你要多少空間。K8s 就會根據 StorageClass 的設定自動建一個 PV，自動跟你的 PVC 綁定。管理員完全不用動手。

在 AWS 上，StorageClass 的 provisioner 會去自動建 EBS 磁碟。在 GCP 上會建 Persistent Disk。在 Azure 上會建 Azure Disk。不同的雲端有不同的 provisioner，但用法是一樣的：開發者建 PVC，StorageClass 自動搞定 PV。

用 Docker 來對照，StorageClass 有點像 Docker 的 Volume Driver。你可以用 docker volume create --driver local 或 --driver nfs，告訴 Docker 用什麼方式建 Volume。StorageClass 做的是同樣的事，只是更自動化。 [▶ 下一頁]`,
  },

  // ── 6-14 概念（2/2）：Deployment 不適合跑 DB → StatefulSet ──
  {
    title: 'Deployment 跑 DB？四個問題 → StatefulSet',
    subtitle: '無狀態 vs 有狀態 + StatefulSet 三保證',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Deployment 跑 MySQL 的四個問題</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">名稱不固定</strong> -- mysql-deploy-abc-xyz，主庫是哪個？</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">沒有順序</strong> -- 3 副本同時起，主從架構搞不定</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">共用 PVC</strong> -- 3 個 MySQL 寫同一塊磁碟，資料衝突</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">4.</span>
              <p><strong className="text-white">沒有穩定網路</strong> -- Service 隨機分配，寫入送誰？</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">StatefulSet 三保證</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-green-400 font-semibold">1. 穩定身份</span> -- mysql-0、mysql-1、mysql-2，刪了重建還是同名</p>
            <p><span className="text-green-400 font-semibold">2. 獨立儲存</span> -- 每個 Pod 自動建獨立 PVC（volumeClaimTemplates）</p>
            <p><span className="text-green-400 font-semibold">3. 有序生命週期</span> -- 啟動 0→1→2，刪除 2→1→0</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3 text-center">Deployment vs StatefulSet</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-red-500/50 rounded-lg p-3 bg-red-900/10">
              <p className="text-red-400 text-sm font-bold text-center mb-2">Deployment</p>
              <div className="space-y-1">
                <div className="bg-red-900/30 border border-red-500/30 px-2 py-1 rounded text-center">
                  <p className="text-red-300 text-xs">web-abc-xyz</p>
                </div>
                <div className="bg-red-900/30 border border-red-500/30 px-2 py-1 rounded text-center">
                  <p className="text-red-300 text-xs">web-def-uvw</p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] mt-2 text-center">隨機名、同時起、共用 PVC</p>
            </div>
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
              </div>
              <p className="text-slate-400 text-[10px] mt-2 text-center">固定序號、依序起、獨立 PVC</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必須搭配 Headless Service</p>
          <p className="text-sm text-slate-300"><code className="text-green-400">clusterIP: None</code> -- 不做負載均衡，每個 Pod 有自己的 DNS</p>
          <p className="text-sm text-slate-400 mt-1 font-mono text-xs">mysql-0.mysql-headless.default.svc.cluster.local</p>
        </div>
      </div>
    ),
    code: `# StatefulSet vs Deployment 差異（只多兩個欄位）
apiVersion: apps/v1
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

  # ← StatefulSet 獨有
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
    notes: `好，現在我們有了持久化的方案，可以正式跑資料庫了。但我要問一個問題：資料庫適合用 Deployment 跑嗎？

回想一下第四堂課講的。用 Deployment 跑 MySQL 有四個問題。

第一，Pod 名稱不固定。Deployment 建出來的 Pod 名字是 random hash，mysql-deploy-abc-xyz。每次重建名字都變。你的主庫到底是哪一個？

第二，沒有啟動順序。三個副本同時啟動。但 MySQL 主從架構需要主庫先起來，拿到 binlog position，從庫再連上去同步。同時啟動會出問題。

第三，共用 PVC。如果三個 Pod 掛同一個 PVC，三個 MySQL 同時寫同一塊磁碟，資料一定亂掉。

第四，沒有穩定的網路身份。Service 做負載均衡，流量隨機分。但寫入操作要送主庫，讀取送從庫，怎麼區分？

Deployment 是設計給無狀態應用的，API、Web Server 這種。資料庫是有狀態的，需要 StatefulSet。

StatefulSet 給你三個保證。

第一，穩定的身份。Pod 名稱是固定的序號：mysql-0、mysql-1、mysql-2。不管 Pod 被刪幾次重建幾次，mysql-0 永遠叫 mysql-0。

第二，獨立的儲存。StatefulSet 用一個叫 volumeClaimTemplates 的機制，自動為每個 Pod 建立獨立的 PVC。mysql-0 的 PVC 叫 mysql-data-mysql-0，mysql-1 的叫 mysql-data-mysql-1。即使 Pod 被刪掉重建，新的 mysql-0 還是會掛回 mysql-data-mysql-0 這個 PVC。

第三，有序的生命週期。啟動的時候先起 mysql-0，確認它 Ready 之後再起 mysql-1，再起 mysql-2。刪除的時候反過來，先刪 mysql-2，再 mysql-1，最後 mysql-0。

StatefulSet 必須搭配 Headless Service。什麼是 Headless Service？就是 clusterIP 設成 None 的 Service。普通 Service 做負載均衡，你連到 Service 的 IP，它隨機分配給後面的 Pod。Headless Service 不做負載均衡，它讓每個 Pod 有自己的 DNS 記錄。mysql-0.mysql-headless.default.svc.cluster.local 直接連到 mysql-0，mysql-1.mysql-headless 直接連到 mysql-1。這樣你的應用就可以指定寫入連 mysql-0，讀取連 mysql-1。

StatefulSet 的 YAML 跟 Deployment 非常像。差別只有兩個地方。第一個是 spec 裡面多了一個 serviceName 欄位，指定要搭配的 Headless Service 名稱。第二個是多了 volumeClaimTemplates，定義每個 Pod 的 PVC 範本。其他的 selector、template 寫法跟 Deployment 一模一樣。

概念講完了，下一支影片我們來實作 StatefulSet 跑 MySQL。 [▶ 下一頁]`,
  },

  // ── 6-15 實作（1/2）：StatefulSet MySQL YAML + 部署 ──
  {
    title: 'Lab：StatefulSet MySQL 部署',
    subtitle: 'Headless Service + Secret + StatefulSet YAML',
    section: 'Loop 5：StorageClass + StatefulSet',
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
  name: mysql-secret
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
                name: mysql-secret
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

  // ── 6-15 學員實作 ──
  {
    title: '學員實作：StatefulSet MySQL',
    subtitle: 'Loop 5 練習題',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：StatefulSet MySQL → 有序部署 + 資料持久化</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>部署 statefulset-mysql.yaml</li>
            <li><code className="text-green-400">kubectl get pods -w</code> 觀察有序啟動</li>
            <li><code className="text-green-400">kubectl get pvc</code> 看到兩個獨立 PVC</li>
            <li>進 mysql-0 建 testdb</li>
            <li>砍 mysql-0 → 驗證資料還在</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：觀察有序縮容</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl scale statefulset mysql --replicas=3</code></li>
            <li>mysql-2 最後建</li>
            <li>scale 回 2 → mysql-2 先被刪</li>
            <li>有序建立，反序刪除</li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：自己部署 StatefulSet MySQL，觀察有序啟動，砍 Pod 驗證資料持久化。挑戰題：用 kubectl scale statefulset mysql --replicas=3 把副本數加到 3。你會看到 mysql-2 最後才建。然後 scale 回 2，mysql-2 會先被刪，mysql-0 和 mysql-1 留著。有序建立，反序刪除。大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-16 回頭操作 Loop 5 ──
  {
    title: 'StatefulSet 排錯 + 常見坑',
    subtitle: '回頭操作 Loop 5',
    section: 'Loop 5：StorageClass + StatefulSet',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">確認狀態</p>
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

  // ── 6-18 學員實作 ──
  {
    title: '學員實作：Helm 安裝 MySQL + Redis',
    subtitle: 'Loop 6 練習題',
    section: 'Loop 6：Helm',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">必做：Helm 安裝 + 驗證 + 清理</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>安裝 Helm + 加入 Bitnami 倉庫</li>
            <li><code className="text-green-400">helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret</code></li>
            <li><code className="text-green-400">helm install my-redis bitnami/redis --set auth.password=myredis123</code></li>
            <li><code className="text-green-400">kubectl get pods</code> -- 確認都在跑</li>
            <li><code className="text-green-400">helm list</code> -- 看到兩個 Release</li>
            <li><code className="text-green-400">helm uninstall my-mysql && helm uninstall my-redis</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：自訂 values.yaml</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>建 my-redis-values.yaml 修改 replicas 和密碼</li>
            <li><code className="text-green-400">helm install my-redis2 bitnami/redis -f my-redis-values.yaml</code></li>
            <li>驗證 replicas 數量跟你設的一致</li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：用 Helm 安裝一個 MySQL 和一個 Redis，驗證它們在跑，然後 helm uninstall 清掉。挑戰題：建一個自訂的 values.yaml，修改 replicas 數量和密碼，用 -f 安裝。大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-19 回頭操作 Loop 6 ──
  {
    title: 'Helm 排錯 + 常見坑',
    subtitle: '回頭操作 Loop 6',
    section: 'Loop 6：Helm',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">確認狀態</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">helm list</code> -- Release 都是 deployed</li>
            <li><code className="text-green-400">kubectl get pods</code> -- Pod 都在 Running</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Helm 常見三個坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">repo 沒 add 就 search</strong> -- 先 helm repo add，再 helm repo update，再 search</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">install 忘記設密碼</strong> -- 自動產生 random 密碼，後面連不上</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">upgrade 沒帶密碼</strong> -- 密碼被清掉，用 --reuse-values 保留上次參數</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-3 rounded-lg">
          <p className="text-amber-400 font-semibold text-sm">銜接下一個 Loop</p>
          <p className="text-slate-300 text-xs mt-1">Helm 解決了套件安裝，但叢集越來越大，全用 kubectl 管很痛苦 → 想要 GUI</p>
        </div>
      </div>
    ),
    notes: `好，回頭確認一下。

helm list 看一下，你安裝的 Release 都有出現嗎？STATUS 是 deployed 就對了。kubectl get pods 確認 Pod 都在跑。

來看幾個常見的坑。

第一個坑，repo 沒 add 就 search。有同學直接打 helm search repo mysql，什麼結果都沒有。因為你還沒加倉庫。要先 helm repo add bitnami https://charts.bitnami.com/bitnami，然後 helm repo update，再 search 才有東西。

第二個坑，install 的時候忘了設密碼。有些 Chart，比如 bitnami/mysql，如果你不設 auth.rootPassword，它會自動幫你產生一個 random 密碼存在 Secret 裡面。這不算錯，但你連自己的密碼是什麼都不知道，後面要連 MySQL 的時候就很麻煩。建議安裝的時候都明確設密碼。

第三個坑，upgrade 的時候沒帶密碼。helm upgrade my-mysql bitnami/mysql --set secondary.replicaCount=2，但忘了帶 --set auth.rootPassword=xxx。結果密碼被清掉了。Helm upgrade 預設不會保留上一次的參數，你要自己重新帶，或者用 --reuse-values 這個 flag。

好，Helm 的部分到這裡。我們已經可以用一行指令安裝複雜的應用了，不用自己手寫一大堆 YAML。

但是我問大家一個問題。到目前為止我們全部用 kubectl 在管叢集。一個叢集還行，你打打指令看看狀態。但如果你是一個 DevOps 工程師，管三個叢集呢？五個呢？每次查東西都要打指令、切 context、記 namespace。想看全局狀態要打好幾個指令然後自己在腦中拼起來。

有沒有一個圖形介面讓你一目了然？下一個 Loop 我們來看看叢集管理員的日常工具。 [▶ 下一頁]`,
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

# 2. 取得初始密碼
docker logs 容器ID 2>&1 | grep "Bootstrap Password:"

# 3. 瀏覽器打開 https://master-IP
#    輸入 Bootstrap Password → 設定新密碼

# 4. 導入 k3s 叢集
# Cluster Management → Import Existing → 取名 → 執行：
kubectl apply -f https://rancher的IP/v3/import/xxxxxxxx.yaml
# 等 1-2 分鐘 → 叢集狀態變 Active`,
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

  // ── 6-21 學員實作 ──
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
            <li>在 Rancher 的 Workloads 頁面，點 Create</li>
            <li>用 GUI 建一個新的 Deployment（完全不用 kubectl）</li>
            <li>設 Image、名稱、replicas</li>
          </ul>
        </div>
      </div>
    ),
    notes: `接下來是大家的實作時間。必做題：安裝 Rancher，導入 k3s 叢集，用 GUI 看今天建的 Deployment，用 GUI 做一次 scale。挑戰題：在 Rancher 的 GUI 上建一個新的 Deployment，完全不用 kubectl。大家動手做。 [▶ 下一頁 -- 學員開始做，你去巡堂]`,
  },

  // ── 6-22 回頭操作 Loop 7 ──
  {
    title: 'Rancher 排錯 + 常見坑',
    subtitle: '回頭操作 Loop 7',
    section: 'Loop 7：RKE + Rancher',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">確認狀態</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Rancher 介面可以登入</li>
            <li>叢集狀態是 Active</li>
            <li>可以在 GUI 上看到 Workloads</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Rancher 常見三個坑</p>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">1.</span>
              <p><strong className="text-white">k3s 節點沒有 Docker</strong> -- k3s 用 containerd，需另裝 Docker：<code className="text-green-400">sudo apt install docker.io</code></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">2.</span>
              <p><strong className="text-white">Port 衝突</strong> -- Traefik 佔了 80/443，Rancher 改用 8443/8080</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold">3.</span>
              <p><strong className="text-white">agent 指令跑錯地方</strong> -- 要在 k3s master 上跑，確認 KUBECONFIG 指向 k3s</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg">
          <p className="text-green-400 font-semibold text-sm">叢集管理員的工作方式</p>
          <p className="text-slate-300 text-xs mt-1">日常用 Rancher GUI 看狀態 + 快速操作，寫自動化腳本和 CI/CD 用 kubectl。兩者搭配。</p>
        </div>
      </div>
    ),
    notes: `好，回頭確認一下。

打開瀏覽器，Rancher 的介面有進去嗎？叢集狀態是 Active 嗎？

來看幾個常見的坑。

第一個坑，Rancher 要用 Docker 跑，但你的 k3s 節點上有 Docker 嗎？k3s 預設用的 container runtime 是 containerd，不是 Docker。你可能需要另外安裝 Docker。如果你是用 Multipass 開的 Ubuntu VM，sudo apt install docker.io 就可以裝好 Docker。

第二個坑，Port 衝突。k3s 的 Traefik Ingress Controller 已經佔了 80 和 443 Port。如果 Rancher 也要用 80 和 443 就會衝突。解法是 Rancher 用不同的 Port，比如 -p 8443:443 -p 8080:80。

第三個坑，導入叢集的 agent 指令要在 k3s master 上跑。有同學在自己的筆電上跑 kubectl apply，但筆電的 kubectl 沒有連到 k3s 叢集。確認你的 KUBECONFIG 是指向 k3s 的。kubectl get nodes 看到你的 k3s 節點就對了。

好，Rancher 到這裡。日常用 Rancher GUI 看叢集狀態和快速操作，寫自動化腳本和 CI/CD 用 kubectl。兩者搭配，這就是叢集管理員的工作方式。 [▶ 下一頁]`,
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
            <li><code className="text-green-400">helm install my-blog bitnami/wordpress</code></li>
            <li>等 Pod 全部 Running</li>
            <li><code className="text-green-400">kubectl get svc my-blog-wordpress</code> → 取得 NodePort 或設 Ingress</li>
            <li>瀏覽器打開 → 看到 WordPress 歡迎頁面</li>
            <li>用 Rancher GUI 觀察所有建出來的資源</li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">挑戰：自訂 values.yaml</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>設定域名：<code className="text-green-400">wordpressUsername</code>、<code className="text-green-400">wordpressPassword</code></li>
            <li>調整 persistence size</li>
            <li>設 Ingress hostname</li>
          </ul>
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
            <p>kubectl get pv</p>
            <p>kubectl get pvc</p>
            <p>kubectl get storageclass</p>
            <p>kubectl get statefulset</p>
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
