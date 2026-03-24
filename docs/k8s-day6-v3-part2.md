# 第六堂下午逐字稿 v3 — 因果鏈敘事（Loop 4-8）

> 15 支影片：6-11 到 6-25
> 主線：資料消失 → PV/PVC → StorageClass → StatefulSet → Helm → RKE/Rancher → 總結
> 因果鏈銜接上午：Ingress + ConfigMap + Secret 整合完了，服務跑起來了

---

# 影片 6-11：PV + PVC 概念 — Pod 重啟資料全消失（~15min）

## 本集重點

- 因果鏈銜接：上午 Ingress + ConfigMap + Secret 整合完了，服務跑起來了
- 問題：MySQL Pod 重啟 → 資料全部消失（現場做實驗示範）
- 第四堂的 emptyDir 是臨時的 → Pod 刪就沒
- Docker 對照：docker run 不掛 -v → 容器刪資料沒
- PV（Persistent Volume）= 一塊實際的儲存空間（管理員建）
- PVC（Persistent Volume Claim）= Pod 對儲存的申請單（開發者寫）
- 比喻：PV 是停車位，PVC 是停車位租約，Pod 拿著租約去停車
- AccessMode：RWO / ROX / RWX
- ReclaimPolicy：Retain / Delete
- 靜態佈建流程：管理員建 PV → 開發者建 PVC → K8s 配對 → Pod 掛 PVC

| Docker | K8s | 角色 |
|:---|:---|:---|
| docker volume create mydata | PersistentVolume (PV) | 建立儲存空間 |
| -v mydata:/var/lib/mysql | PersistentVolumeClaim (PVC) | 使用儲存空間 |

| AccessMode | 縮寫 | 意思 |
|:---|:---|:---|
| ReadWriteOnce | RWO | 只能被一個 Node 讀寫（最常用） |
| ReadOnlyMany | ROX | 可以被多個 Node 唯讀 |
| ReadWriteMany | RWX | 可以被多個 Node 讀寫（需 NFS） |

| ReclaimPolicy | 行為 | 適合場景 |
|:---|:---|:---|
| Retain | PVC 刪了，PV 和資料保留 | 生產環境 |
| Delete | PVC 刪了，PV 和資料一起刪 | 開發環境 / 雲端 |

## 逐字稿

好，歡迎回來。上午我們把 Ingress、ConfigMap、Secret 全部整合在一起了。使用者可以用域名連到你的服務，設定和密碼也不再寫死在 Image 裡面。聽起來一切都很完美，對不對？

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

K8s 提供的方案是兩個東西：PersistentVolume，簡稱 PV，和 PersistentVolumeClaim，簡稱 PVC。

我用一個生活化的比喻來解釋。PV 就像停車場裡的停車位。停車場管理員，也就是 K8s 管理員，負責規劃停車位：這裡有一個 10GB 的位子，那裡有一個 50GB 的位子，這個是 SSD 的高級車位，那個是 HDD 的普通車位。管理員把這些車位劃好，就是建立 PV。

PVC 就像停車位租約。開發者說：「我的 MySQL 需要一個 5GB 的停車位，要能讀寫。」這就是建立 PVC。開發者不需要知道底層是 NFS 還是 SSD 還是雲端磁碟，他只要說「我要多大、什麼模式」就好。

然後 K8s 自動幫你配對。它看看有沒有合適的 PV 能滿足這個 PVC 的需求，找到了就把它們綁在一起，這個過程叫 Binding。配對成功之後，Pod 就可以透過 PVC 掛載這塊儲存空間了。

對照 Docker 來看。docker volume create mydata 就像建立 PV，創造一塊儲存空間。docker run -v mydata:/var/lib/mysql 就像 PVC，把那塊儲存空間掛到容器裡。Docker 把這兩步合在一起了，K8s 把它拆成兩步。

為什麼要拆？因為職責分離。在大公司裡面，管儲存的人跟寫程式的人不是同一個人。基礎架構團隊負責「我們公司有幾台 NAS、幾塊 SSD、每塊多大」，這是 PV。應用開發團隊只要說「我的 App 需要 10GB 空間」，這是 PVC。開發者不需要知道底層的實作細節。

PV 有兩個重要的屬性要知道。第一個是 AccessMode，存取模式。RWO，ReadWriteOnce，同時只能被一個 Node 掛載讀寫，這是最常用的，資料庫通常用這個。ROX，ReadOnlyMany，可以被多個 Node 唯讀掛載，適合存靜態檔案。RWX，ReadWriteMany，可以被多個 Node 同時讀寫，但不是所有儲存系統都支援，通常需要 NFS 之類的網路儲存。

第二個是 ReclaimPolicy，回收策略。當 PVC 被刪掉的時候，PV 裡的資料怎麼處理？Retain 是保留，PVC 刪了但 PV 和資料都還在，管理員可以手動決定要不要清理。生產環境通常用這個，因為資料不能隨便丟。Delete 是刪除，PVC 一刪 PV 也跟著刪，資料也消失。雲端環境常用這個，PVC 刪了對應的 EBS 磁碟也一起刪掉省錢。

靜態佈建的流程是這樣的：管理員先建 PV，開發者建 PVC，K8s 自動配對，Pod 掛 PVC 使用。概念講完了，下一支影片我們來動手做。

---

# 影片 6-12：PV + PVC 實作 — 驗證資料持久化（~15min）

## 本集重點

- 建 PV YAML（hostPath 類型，本地目錄）
- 建 PVC YAML（申請 1Gi）
- 寫 MySQL Pod 掛載 PVC
- apply → Pod Running → 進 MySQL 寫資料
- kubectl delete pod → Pod 重建 → 資料還在！
- kubectl get pv,pvc → Bound 狀態
- 對比上午沒掛 PVC 的 MySQL：資料消失 vs 資料還在

學員實作：
- 必做：建 PV + PVC → MySQL Pod → 寫資料 → 砍 Pod → 資料還在
- 挑戰：建第二個 PVC 但 PV 空間不夠 → 觀察 Pending

## 逐字稿

好，上一支影片講了 PV 和 PVC 的概念，這支影片直接動手做。大家打開終端機，確認叢集還在跑。

首先我們來看 YAML 怎麼寫。先看 PV。

apiVersion 是 v1，kind 是 PersistentVolume，metadata 裡面 name 叫 local-pv。spec 裡面有四個重點。第一個 capacity，storage 是 2Gi，表示這塊 PV 有 2GB 的空間。第二個 accessModes，設 ReadWriteOnce，只能一個 Node 讀寫。第三個 persistentVolumeReclaimPolicy 設 Retain，PVC 刪了資料保留。第四個 hostPath，path 是 /tmp/k8s-pv-data，表示用 Node 本機的這個目錄當儲存空間。hostPath 是最簡單的 PV 類型，就是用 Node 上的一個目錄，學習的時候用來練手。生產環境不會用 hostPath，會用 NFS、雲端磁碟之類的。最後一個 storageClassName 設成 manual，等一下 PVC 要用同一個名字來配對。

再看 PVC。apiVersion 是 v1，kind 是 PersistentVolumeClaim，metadata 裡面 name 叫 local-pvc。spec 裡面 accessModes 設 ReadWriteOnce，跟 PV 一致。resources 的 requests 裡面 storage 是 1Gi，表示我申請 1GB 的空間。storageClassName 是 manual，跟 PV 的 storageClassName 一致。K8s 會根據 storageClassName 和 accessModes 去找合適的 PV。PV 有 2GB，PVC 要 1GB，空間夠，就配對成功。

最後是 Deployment。跟之前的 MySQL Deployment 幾乎一樣，差別在 volumes 和 volumeMounts 的部分。volumes 裡面有一個 name 叫 mysql-storage，persistentVolumeClaim 的 claimName 是 local-pvc，就是剛才建的那個 PVC。containers 裡面的 volumeMounts，name 是 mysql-storage，mountPath 是 /var/lib/mysql，就是 MySQL 存資料的目錄。這樣 MySQL 寫到 /var/lib/mysql 的資料就會存到 PVC 對應的 PV 上面，不再存在容器的 overlay filesystem 裡面了。

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

這就是 PV/PVC 存在的意義。Docker 的 Volume 做的是一模一樣的事情，只是 K8s 把它拆成 PV 和 PVC 兩層，做了職責分離。

接下來是大家的實作時間。必做題：自己手寫 PV + PVC 的 YAML，部署一個 MySQL Pod，進去寫資料，砍 Pod，驗證資料還在。挑戰題：建好 PV 之後，再建第二個 PVC，但 PV 已經被第一個 PVC 佔走了。觀察第二個 PVC 的狀態，你會看到它一直 Pending，因為沒有 PV 可以配對了。大家動手做，有問題舉手。

---

# 影片 6-13：回頭操作 Loop 4（~5min）

## 本集重點

- 帶做 PV/PVC
- 常見坑：storageClassName 不一致、accessModes 不匹配、PV 容量不夠
- 銜接：手動建 PV 太煩 → StorageClass

## 逐字稿

好，時間差不多了，我們來回頭確認一下大家都做到了。

如果你的 PV 和 PVC 已經建好了，kubectl get pv,pvc 看一下，兩個都是 Bound 就對了。然後 MySQL Pod 要是 Running 狀態。

如果你的 PVC 一直 Pending，來看看常見的三個坑。

第一個坑，storageClassName 不一致。PV 寫的是 manual，PVC 寫的也要是 manual。如果 PV 寫 manual 但 PVC 忘了寫，或者寫錯了，K8s 就配不上。

第二個坑，accessModes 不匹配。PV 設 ReadWriteOnce，PVC 也要設 ReadWriteOnce。如果 PVC 設了 ReadWriteMany 但 PV 只支援 ReadWriteOnce，也配不上。

第三個坑，容量不夠。PVC 要 5Gi 但 PV 只有 2Gi，配不上。PV 的容量必須大於等於 PVC 的要求。

這三個是最常見的問題，大家記一下。

有做到挑戰題的同學有沒有？你應該看到第二個 PVC 一直 Pending。因為我們只有一個 PV，已經被第一個 PVC 佔走了。一個 PV 同時只能綁一個 PVC。第二個 PVC 找不到 PV，就只能等。

那我問大家一個問題。如果我有十個微服務，每個都需要 PVC，那我是不是要手動建十個 PV？如果以後又多了五個微服務，再手動建五個？管理員每天的工作就是建 PV？

太煩了。有沒有辦法自動建 PV？

有，這就是下一個 Loop 要學的東西 — StorageClass。

---

# 影片 6-14：StorageClass + StatefulSet 概念 — 手動建 PV 太煩了（~15min）

## 本集重點

- 因果鏈：手動建 PV 太煩 → StorageClass 動態佈建
- 靜態佈建 vs 動態佈建比較
- StorageClass = 告訴 K8s「怎麼自動建 PV」
- k3s 內建 local-path StorageClass
- 有了持久化 → 可以正式跑資料庫 → 但 Deployment 不適合
- Deployment 跑 DB 的四個問題回顧
- StatefulSet 三個保證：穩定名稱、有序部署、獨立儲存
- Headless Service 概念
- StatefulSet YAML 拆解：serviceName + volumeClaimTemplates

| | 靜態佈建 | 動態佈建 |
|:---|:---|:---|
| 流程 | 管理員先建 PV → PVC 配對 | PVC 建立 → PV 自動建 |
| 適合 | 學習、小規模 | 生產環境 |
| 問題 | 要事先建好所有 PV | 需要 StorageClass |

| 特性 | Deployment | StatefulSet |
|:---|:---|:---|
| Pod 名稱 | random hash | 固定序號（mysql-0, mysql-1） |
| 啟動順序 | 同時 | 有序（0 → 1 → 2） |
| 刪除順序 | 隨機 | 反序（2 → 1 → 0） |
| PVC | 所有 Pod 共用 | 每個 Pod 獨立 PVC |
| DNS | 只有 Service DNS | 每個 Pod 有自己的 DNS |

## 逐字稿

上一個 Loop 我們用 PV 和 PVC 解決了資料持久化的問題。Pod 刪了資料還在，非常棒。但是我剛才留了一個問題：如果你有十個微服務，每個都需要 PVC，管理員要手動建十個 PV。以後又多了五個微服務，再建五個。

在小規模的環境裡這還能接受，但想像一下企業環境。你的公司有三個叢集、五十個微服務、每個都需要儲存空間。管理員每天的工作就是建 PV、改 PV、刪 PV。而且建 PV 的時候你要預估大小，建太大浪費空間，建太小不夠用。

剛才我們做的叫「靜態佈建」，管理員先建好 PV，開發者再建 PVC 去配對。K8s 還支援另一種方式叫「動態佈建」。開發者只要建 PVC，K8s 自動幫你建一個匹配的 PV。不用管理員動手。

自動建 PV 的祕密就是 StorageClass。StorageClass 是一個 K8s 資源，它告訴 K8s：「當有人建 PVC 的時候，用什麼方式自動建立 PV。」它就像一個工廠的模板。你告訴工廠「我要做什麼規格的零件」，以後每次有訂單進來，工廠就自動照著模板生產，不用每次都手動畫圖紙。

StorageClass 的 YAML 很簡單。apiVersion 是 storage.k8s.io/v1，kind 是 StorageClass，metadata 裡面 name 叫 local-path。provisioner 是 rancher.io/local-path，這是告訴 K8s「用 Rancher 的 local-path provisioner 來建 PV」。reclaimPolicy 設 Delete。

好消息是，k3s 已經內建了一個 local-path 的 StorageClass，你不用自己建。打 kubectl get storageclass 看看，你會看到一個叫 local-path 的 StorageClass，後面標了 default。default 的意思是如果 PVC 沒有指定 storageClassName，就自動用這個。

用動態佈建的時候，PVC 的 YAML 只要指定 storageClassName 是 local-path，然後寫你要多少空間。K8s 就會根據 StorageClass 的設定自動建一個 PV，自動跟你的 PVC 綁定。管理員完全不用動手。

在 AWS 上，StorageClass 的 provisioner 會去自動建 EBS 磁碟。在 GCP 上會建 Persistent Disk。在 Azure 上會建 Azure Disk。不同的雲端有不同的 provisioner，但用法是一樣的：開發者建 PVC，StorageClass 自動搞定 PV。

用 Docker 來對照，StorageClass 有點像 Docker 的 Volume Driver。你可以用 docker volume create --driver local 或 --driver nfs，告訴 Docker 用什麼方式建 Volume。StorageClass 做的是同樣的事，只是更自動化。

好，現在我們有了持久化的方案，可以正式跑資料庫了。但我要問一個問題：資料庫適合用 Deployment 跑嗎？

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

概念講完了，下一支影片我們來實作 StatefulSet 跑 MySQL。

---

# 影片 6-15：StatefulSet MySQL 實作（~15min）

## 本集重點

- 確認 k3s 的 local-path StorageClass 存在
- 寫 StatefulSet YAML（MySQL，replicas: 2）+ volumeClaimTemplates
- 寫 Headless Service YAML
- apply → 觀察有序啟動（mysql-0 先，mysql-1 後）
- kubectl get pvc → 每個 Pod 有自己的 PVC
- 進 mysql-0 建資料 → 砍 mysql-0 → 自動重建 → 資料還在
- 對比 Deployment：名稱穩定、有序、獨立儲存

學員實作：
- 必做：StatefulSet MySQL → 驗證有序部署 + 資料持久化
- 挑戰：scale StatefulSet 到 3 → 看到 mysql-2 最後建

## 逐字稿

好，上一支影片講了 StorageClass 和 StatefulSet 的概念，這支影片直接動手做。

首先確認一下 k3s 的 StorageClass 有在。

kubectl get storageclass

你應該看到 local-path (default)，provisioner 是 rancher.io/local-path。有了這個，我們的 PVC 就不用手動建 PV 了，K8s 會自動搞定。

現在來看 statefulset-mysql.yaml。這個檔案裡面有三個東西。

第一個是 Headless Service。apiVersion v1，kind Service，metadata name 叫 mysql-headless。spec 裡面最關鍵的一行：clusterIP: None。這就是 Headless Service 的標誌。selector 設 app: mysql-sts。ports 的 port 是 3306。

第二個是 Secret，存 MySQL 的 root 密碼。跟上午的做法一樣，用 Secret 管密碼，不寫死在 YAML 裡面。

第三個是 StatefulSet 本身。apiVersion apps/v1，kind StatefulSet，metadata name 叫 mysql。spec 裡面 serviceName 設 mysql-headless，對應剛才的 Headless Service。replicas 設 2，我們先跑兩個副本。selector 的 matchLabels 設 app: mysql-sts。

template 的部分跟 Deployment 一模一樣。containers 裡面 name 叫 mysql，image 是 mysql:8.0。envFrom 引用 Secret 注入密碼。volumeMounts 的 name 是 mysql-data，mountPath 是 /var/lib/mysql。

最後是重頭戲 — volumeClaimTemplates。這是 StatefulSet 獨有的。它是一個 PVC 範本，metadata name 叫 mysql-data。spec 裡面 accessModes 設 ReadWriteOnce，resources requests storage 是 1Gi。注意這裡不用指定 storageClassName，因為 k3s 的 local-path 是 default StorageClass，沒指定就用它。

K8s 會根據這個範本，自動為每個 Pod 建一個 PVC。mysql-0 的 PVC 叫 mysql-data-mysql-0，mysql-1 的叫 mysql-data-mysql-1。

好，部署。

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

我再跟大家對比一下 Deployment。如果你用 Deployment 跑 MySQL 然後砍 Pod，新 Pod 的名字會變，而且掛載的是同一個 PVC。如果你有多個副本，所有 Pod 都搶同一塊儲存。StatefulSet 每個 Pod 有自己的 PVC，資料完全隔離。

接下來是大家的實作時間。必做題：自己部署 StatefulSet MySQL，觀察有序啟動，砍 Pod 驗證資料持久化。挑戰題：用 kubectl scale statefulset mysql --replicas=3 把副本數加到 3。你會看到 mysql-2 最後才建。然後 scale 回 2，mysql-2 會先被刪，mysql-0 和 mysql-1 留著。有序建立，反序刪除。大家動手做。

---

# 影片 6-16：回頭操作 Loop 5（~5min）

## 本集重點

- 帶做 StatefulSet
- 常見坑：volumeClaimTemplates 縮排錯、忘了 Headless Service、serviceName 打錯
- 銜接：YAML 越來越多了

## 逐字稿

好，回頭確認一下大家的狀態。

kubectl get statefulset 看一下，mysql 的 READY 應該是 2/2。kubectl get pods -l app=mysql-sts 看到 mysql-0 和 mysql-1 都是 Running。kubectl get pvc 看到兩個 PVC 都是 Bound。

如果有問題的同學，來看看常見的三個坑。

第一個坑，volumeClaimTemplates 的縮排。這個欄位是在 spec 下面，跟 template 同級，不是在 template 裡面。很多同學把它放到 template 裡面，那就錯了。記住，volumeClaimTemplates 跟 selector、replicas、template 是平級的。

第二個坑，忘了建 Headless Service。StatefulSet 的 serviceName 指定了一個 Service 名稱，但如果那個 Service 不存在，StatefulSet 可以建起來但 DNS 解析會有問題。Pod 之間沒辦法用 mysql-0.mysql-headless 互相連。

第三個坑，serviceName 打錯。StatefulSet 裡面的 serviceName 要跟 Headless Service 的 metadata name 完全一致。打錯一個字就對不上。

好，做到挑戰題的同學，你應該看到 scale 到 3 的時候 mysql-2 最後建，scale 回 2 的時候 mysql-2 先被刪。這就是 StatefulSet 的有序生命週期管理。

到這裡，大家回想一下今天下午做了多少事情。PV、PVC、StorageClass、StatefulSet、Headless Service、Secret。一個 MySQL 服務就要寫這麼多 YAML。再加上午的 Ingress、ConfigMap，你的目錄裡面已經有七八個 YAML 檔案了。

如果你的系統不只一個 MySQL，還有 Redis、RabbitMQ、Elasticsearch，每個都要手寫一堆 YAML？太痛苦了。下一個 Loop 要介紹一個工具，讓你一行指令就能搞定這些事情。

---

# 影片 6-17：Helm 概念 — YAML 太多太散了（~15min）

## 本集重點

- 因果鏈：YAML 太多 → 每個環境還不同 → 別人也在寫一樣的東西 → Helm
- Helm = K8s 的套件管理器
- Chart = 套件，Release = 安裝實例，Repository = 套件庫，values.yaml = 參數檔
- helm repo add → helm search → helm install → helm list → helm uninstall
- 對照：apt install mysql vs helm install bitnami/mysql
- 對照：Docker Compose vs Helm
- 三個核心功能：一鍵安裝、參數化、版本管理

| 概念 | 說明 | 對照 |
|:---|:---|:---|
| Helm | 套件管理工具 | apt / yum / brew |
| Chart | 一包 YAML 範本 | .deb / .rpm 安裝包 |
| Release | Chart 安裝後的實例 | 安裝好的軟體 |
| Repository | Chart 倉庫 | apt source list |
| values.yaml | 客製化參數 | 軟體的設定檔 |

| Docker Compose | Helm |
|:---|:---|
| docker-compose.yml | Chart（一包 YAML 範本） |
| docker compose up | helm install |
| docker compose down | helm uninstall |
| .env 檔案 | values.yaml |

## 逐字稿

好，上一個 Loop 結束之後我問了大家一個問題：YAML 太多了。我們來算一下。

今天一個 MySQL 服務，你要寫 Secret 管密碼、ConfigMap 管設定、StatefulSet 跑 MySQL、Headless Service 做 DNS、PVC 要儲存空間。五個 K8s 資源。如果再加上 Ingress 讓外面連進來，六個。

你的系統不只有 MySQL 吧？可能還有 Redis 做快取、RabbitMQ 做訊息佇列、Elasticsearch 做搜尋。每個都要寫一堆 YAML。加起來可能有幾十個檔案，幾千行 YAML。

然後你要部署到 dev、staging、prod 三個環境。三個環境的 YAML 基本上一樣，只是 replicas 不同、Image tag 不同、資料庫連線不同。你是要維護三套 YAML？改了一個東西三個地方都要改？

還有一個問題。你自己手寫 MySQL 的 StatefulSet、Headless Service、PVC。但全世界有幾百萬人在 K8s 上跑 MySQL，每個人都在寫一樣的東西。有沒有人已經寫好了一份最佳實踐，你直接拿來用就好？

用你熟悉的經驗來想。在 Ubuntu 上要裝 MySQL，你會自己下載原始碼然後編譯嗎？不會，你 apt install mysql-server，一行指令搞定。在 Node.js 專案要用 Express，你會自己從零寫 HTTP 框架嗎？不會，你 npm install express。在 Python 專案要用 Flask，你 pip install flask。

每個技術生態都有套件管理器。Ubuntu 有 apt，macOS 有 brew，Node.js 有 npm，Python 有 pip。

K8s 的套件管理器叫 Helm。

Helm 讓你用一行指令在 K8s 上安裝一整套 MySQL：helm install my-mysql bitnami/mysql。StatefulSet、Headless Service、PVC、Secret、ConfigMap，全部幫你建好。你不用寫任何 YAML。

Helm 有幾個核心概念。Chart 就是一個安裝包，裡面包了所有需要的 YAML 範本。就像 Ubuntu 的 .deb 檔案。Release 是 Chart 安裝後的實例。你可以用同一個 Chart 安裝多個 Release，比如一個 Redis 叫 my-cache 給快取用，另一個 Redis 叫 my-session 給 session 用，互不干擾。Repository 是 Chart 的倉庫，就像 Ubuntu 的 apt source list。最大的公開倉庫是 Bitnami，裡面有 MySQL、Redis、PostgreSQL、MongoDB、WordPress、Grafana... 常用的軟體幾乎都有。

values.yaml 是參數檔。一個 Chart 有很多可以調整的參數，比如 replicas 幾個、密碼是什麼、PVC 要多大。你把這些參數寫在 values.yaml 裡面，Helm 會把它們套進 YAML 範本裡生成最終的 K8s 資源。

Helm 的三個核心功能。第一，一鍵安裝。別人已經把最佳實踐寫成 Chart 了，你直接 helm install 就好。第二，參數化。同一個 Chart，dev 環境設 replicas 1、密碼設 dev123，prod 環境設 replicas 3、密碼設超強密碼。只要換 values.yaml，不用改 Chart。第三，版本管理。Helm 會記錄每次安裝和升級的歷史。升級之後發現有問題？helm rollback 一行指令回到上一版。而且不只是回滾一個 Deployment，是整個 Release 的所有資源一起回滾。

對照 Docker Compose 來看。Chart 就像 docker-compose.yml，定義了整個系統的結構。helm install 就像 docker compose up。helm uninstall 就像 docker compose down。values.yaml 就像 .env 檔案。概念完全一樣，只是 Helm 在 K8s 的世界裡功能更強大。

基本的指令流程是這樣的。helm repo add bitnami https://charts.bitnami.com/bitnami 加入倉庫。helm search repo mysql 搜尋有哪些 Chart。helm install my-mysql bitnami/mysql 安裝。helm list 看已安裝的 Release。helm uninstall my-mysql 解除安裝。

概念講完了，下一支影片我們來實際裝一個試試看。

---

# 影片 6-18：Helm 實作（~12min）

## 本集重點

- 安裝 Helm（一行指令）
- helm repo add bitnami
- helm search repo mysql → 看到 bitnami/mysql
- helm install my-mysql bitnami/mysql --set auth.rootPassword=my-secret
- kubectl get pods → 一整套 MySQL 跑起來（StatefulSet + PVC + Service）
- helm list → 看 Release
- helm upgrade → helm history → helm rollback
- helm uninstall → 全部清掉
- 也裝一個 Redis 試試
- 自訂 values.yaml

學員實作：
- 必做：helm install MySQL + Redis → 驗證在跑 → helm uninstall
- 挑戰：寫自訂 values.yaml 修改 replicas 和密碼

## 逐字稿

好，上一支影片講了 Helm 的概念，這支影片來實際體驗一下。

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

再看 history，多了一個 REVISION 3，描述是 Rollback to 1。對照 K8s 原生的 kubectl rollout undo，那只能回滾單一個 Deployment。但 helm rollback 是把整個 Release 的所有資源一起回滾。

好，MySQL 體驗完了。我們再裝一個 Redis 試試，證明 Helm 不只能裝 MySQL。

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

一行指令把所有相關資源清乾淨。對比 kubectl delete -f 要一個一個檔案刪，Helm 方便太多了。

接下來是大家的實作時間。必做題：用 Helm 安裝一個 MySQL 和一個 Redis，驗證它們在跑，然後 helm uninstall 清掉。挑戰題：建一個自訂的 values.yaml，修改 replicas 數量和密碼，用 -f 安裝。大家動手做。

---

# 影片 6-19：回頭操作 Loop 6（~5min）

## 本集重點

- 帶做 Helm
- 常見坑：repo 沒 add 就 search、install 忘記設密碼、upgrade 沒帶密碼
- 銜接：Helm 解決了套件安裝，但叢集越來越大，全用 kubectl 管很痛苦

## 逐字稿

好，回頭確認一下。

helm list 看一下，你安裝的 Release 都有出現嗎？STATUS 是 deployed 就對了。kubectl get pods 確認 Pod 都在跑。

來看幾個常見的坑。

第一個坑，repo 沒 add 就 search。有同學直接打 helm search repo mysql，什麼結果都沒有。因為你還沒加倉庫。要先 helm repo add bitnami https://charts.bitnami.com/bitnami，然後 helm repo update，再 search 才有東西。

第二個坑，install 的時候忘了設密碼。有些 Chart，比如 bitnami/mysql，如果你不設 auth.rootPassword，它會自動幫你產生一個 random 密碼存在 Secret 裡面。這不算錯，但你連自己的密碼是什麼都不知道，後面要連 MySQL 的時候就很麻煩。建議安裝的時候都明確設密碼。

第三個坑，upgrade 的時候沒帶密碼。helm upgrade my-mysql bitnami/mysql --set secondary.replicaCount=2，但忘了帶 --set auth.rootPassword=xxx。結果密碼被清掉了。Helm upgrade 預設不會保留上一次的參數，你要自己重新帶，或者用 --reuse-values 這個 flag。

好，Helm 的部分到這裡。我們已經可以用一行指令安裝複雜的應用了，不用自己手寫一大堆 YAML。

但是我問大家一個問題。到目前為止我們全部用 kubectl 在管叢集。一個叢集還行，你打打指令看看狀態。但如果你是一個 DevOps 工程師，管三個叢集呢？五個呢？每次查東西都要打指令、切 context、記 namespace。想看全局狀態要打好幾個指令然後自己在腦中拼起來。

有沒有一個圖形介面讓你一目了然？下一個 Loop 我們來看看叢集管理員的日常工具。

---

# 影片 6-20：RKE + Rancher 概念 — 叢集管理員的 GUI（~15min）

## 本集重點

- 因果鏈：kubectl 管叢集可以但很痛苦 → 管多叢集更痛苦 → 想要 GUI
- Rancher 是什麼：K8s 叢集的管理平台（Web GUI）
- RKE 是什麼：Rancher Kubernetes Engine，建生產等級 K8s 叢集
- RKE vs k3s 比較
- Rancher 能做什麼：看狀態、管 Deployment、看日誌、管 RBAC、監控圖表
- 課程標題「入門到叢集管理員」→ 這就是管理員用的工具

| 比較 | k3s | RKE |
|:---|:---|:---|
| 定位 | 輕量、邊緣、學習 | 企業生產環境 |
| 安裝 | curl 一行 | 需要規劃 |
| 資源佔用 | 低 | 較高 |
| 功能 | 核心功能齊全 | 功能最完整 |
| Rancher | 可以管 | 完整整合 |

## 逐字稿

好，到目前為止我們跟 K8s 的所有互動都是透過 kubectl 打指令。kubectl get pods、kubectl describe deployment、kubectl logs、kubectl apply -f。每個操作都是一行指令。

一個叢集的時候這樣還行。你記得住大部分常用指令，偶爾查一下文件就好。但想像一下這個場景：你是公司的 DevOps 工程師，管理三個叢集。一個是 dev 叢集，開發用。一個是 staging 叢集，測試用。一個是 prod 叢集，生產環境。

你要看 prod 叢集上所有 Deployment 的狀態，要先切 context。kubectl config use-context prod-cluster。然後 kubectl get deploy --all-namespaces。看到某個 Deployment 有問題，kubectl describe deploy xxx -n yyy。想看 Pod 的日誌，kubectl logs pod-abc -n yyy。想看 Node 的資源使用率，kubectl top nodes。想看誰有什麼權限，kubectl get clusterrolebindings。

一個簡單的巡檢就要打十幾條指令。然後切到 staging 叢集再來一遍。再切到 dev 叢集再來一遍。每天花半個小時在打指令看狀態。

有沒有一個圖形介面，打開瀏覽器就能看到所有叢集的狀態？點一下就能看到 Pod 列表、點一下就能看日誌、拖一個滑桿就能改 replicas？

有，這就是 Rancher。

Rancher 是一個 K8s 叢集管理平台。它提供了一個 Web 介面，讓你用瀏覽器管理 K8s 叢集。你可以同時管理多個叢集，不用切 context。所有叢集的狀態一目了然。

Rancher 是 SUSE 公司的產品。記得 k3s 嗎？k3s 也是 Rancher Labs 開發的。它們是同一家公司的產品線。k3s 是輕量版 K8s，適合學習和邊緣場景。RKE，Rancher Kubernetes Engine，是另一個產品，用來建生產等級的 K8s 叢集。而 Rancher 本身是管理平台，可以同時管理 k3s 叢集、RKE 叢集、雲端的 EKS、GKE、AKS，什麼都能管。

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

好，概念講完了，下一支影片我們來實際安裝 Rancher，親手體驗一下。

---

# 影片 6-21：Rancher 實作 — Demo 導向（~12min）

## 本集重點

- 安裝 Rancher（docker run 最簡單）
- 打開瀏覽器 → 登入
- 導入 k3s 叢集
- GUI 導覽：Dashboard、Workloads、Pod 日誌、Service、Storage
- 用 GUI 做 scale
- 對比 kubectl：GUI 直觀但 kubectl 可以自動化

學員實作：
- 必做：安裝 Rancher → 導入 k3s 叢集 → 用 GUI 看 Deployment → scale
- 挑戰：用 Rancher 建一個新的 Deployment（不用 kubectl）

## 逐字稿

好，這支影片我們來安裝 Rancher，然後用 GUI 管我們的 k3s 叢集。

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

等個一兩分鐘，回到 Rancher 的介面，你應該看到叢集狀態變成 Active。

好，開始導覽。

第一個畫面是 Cluster Dashboard。你一眼就能看到 CPU 使用率、記憶體使用率、Pod 數量、Node 數量。一目了然，不用打 kubectl top nodes 然後 kubectl get pods --all-namespaces 然後自己數。

點左邊的 Workloads。你會看到所有的 Deployment、StatefulSet、DaemonSet。看到我們今天建的 MySQL StatefulSet 了嗎？點進去。

你可以看到它下面的 Pod 列表。每個 Pod 的名稱、狀態、IP、所在 Node、重啟次數。點一個 Pod，右邊有幾個按鈕。點 View Logs，直接看到 Pod 的日誌，不用打 kubectl logs。點 Execute Shell，直接開一個 Web Terminal 進到容器裡面，不用打 kubectl exec。

回到 Workloads 頁面。找到一個 Deployment，點右邊的三個點選單，選 Edit Config。你可以在介面上直接改 replicas。改成 3，點 Save。回到 Pod 列表，你會看到新的 Pod 馬上開始建立。

這就是 GUI 的好處。看狀態不用打指令，改設定點點滑鼠。特別是在排查問題的時候，你可以很快地在不同 Pod 之間切換看日誌，不用每次都打一行 kubectl logs。

再看看 Service Discovery。所有的 Service 和 Ingress 都列在這裡。知道哪些服務開了什麼 Port、Ingress 設了什麼域名。

Storage 頁面。看到所有 PV 和 PVC。哪些是 Bound、哪些是 Available、每個多大。

但我要強調一件事。GUI 很方便，但它不能取代 kubectl。自動化部署、CI/CD pipeline、批次操作，這些都需要 kubectl 和 YAML。你不可能讓 CI/CD 工具去點 Rancher 的按鈕。GUI 適合日常監控和快速操作，kubectl 適合自動化和可重現的操作。兩者搭配使用才是正確的姿勢。

接下來是大家的實作時間。必做題：安裝 Rancher，導入 k3s 叢集，用 GUI 看今天建的 Deployment，用 GUI 做一次 scale。挑戰題：在 Rancher 的 GUI 上建一個新的 Deployment，完全不用 kubectl。大家動手做。

---

# 影片 6-22：回頭操作 Loop 7（~5min）

## 本集重點

- 帶做 Rancher 導入叢集
- 常見坑：Rancher 要 Docker、Port 衝突、agent 指令要在 master 跑
- kubectl vs GUI：日常用 GUI 看，自動化用 kubectl

## 逐字稿

好，回頭確認一下。

打開瀏覽器，Rancher 的介面有進去嗎？叢集狀態是 Active 嗎？

來看幾個常見的坑。

第一個坑，Rancher 要用 Docker 跑，但你的 k3s 節點上有 Docker 嗎？k3s 預設用的 container runtime 是 containerd，不是 Docker。你可能需要另外安裝 Docker。如果你是用 Multipass 開的 Ubuntu VM，sudo apt install docker.io 就可以裝好 Docker。

第二個坑，Port 衝突。k3s 的 Traefik Ingress Controller 已經佔了 80 和 443 Port。如果 Rancher 也要用 80 和 443 就會衝突。解法是 Rancher 用不同的 Port，比如 -p 8443:443 -p 8080:80。

第三個坑，導入叢集的 agent 指令要在 k3s master 上跑。有同學在自己的筆電上跑 kubectl apply，但筆電的 kubectl 沒有連到 k3s 叢集。確認你的 KUBECONFIG 是指向 k3s 的。kubectl get nodes 看到你的 k3s 節點就對了。

好，Rancher 到這裡。日常用 Rancher GUI 看叢集狀態和快速操作，寫自動化腳本和 CI/CD 用 kubectl。兩者搭配，這就是叢集管理員的工作方式。

---

# 影片 6-23：綜合實作引導 — 串起今天所有概念（~10min）

## 本集重點

- 把今天學的全部串起來：Ingress + ConfigMap + Secret + PV/PVC + StatefulSet + Helm + Rancher
- 引導步驟（概念引導，不用全部動手做）
- 完整系統架構圖回顧

## 逐字稿

好，我們來把今天學的所有東西串成一條線，看看一個完整的系統是怎麼搭起來的。

大家跟我一起想像這個場景。你要在 K8s 上部署一個部落格系統，有前端、有後端 API、有 MySQL 資料庫。使用者用域名連進來，資料不能丟。

第一步，MySQL 資料庫。資料庫是有狀態的，用 StatefulSet 跑。搭配 Headless Service 讓 API 可以用固定的 DNS 名稱連到資料庫。StorageClass 自動佈建 PV，volumeClaimTemplates 給每個 Pod 建獨立的 PVC。密碼用 Secret 管。

第二步，後端 API。API 是無狀態的，用 Deployment 跑。API 的設定，比如資料庫的連線字串、日誌等級、API Port，用 ConfigMap 管理。資料庫密碼用 Secret 注入。Service 類型用 ClusterIP，因為 API 不直接對外，是透過 Ingress 進來的。

第三步，前端 Nginx。也是 Deployment。Nginx 的設定檔用 ConfigMap 掛載。Service 類型也是 ClusterIP。

第四步，Ingress。設定域名路由。blog.example.com 導到前端 Nginx，blog.example.com/api 導到後端 API。

第五步，驗證。用 curl 或瀏覽器打開 blog.example.com，看到前端頁面。打 blog.example.com/api，看到 API 回應。砍掉 MySQL Pod，資料還在。改 ConfigMap 裡的日誌等級，rollout restart API，新設定生效。

第六步，用 Rancher 看。打開 Rancher，在 GUI 上看到所有 Deployment、StatefulSet、Service、Ingress、PVC。一目了然。

你看，今天學的每一個東西都不是孤立的。Ingress 解決了對外存取的問題。ConfigMap 和 Secret 解決了設定管理的問題。PV/PVC 解決了資料持久化的問題。StatefulSet 解決了有狀態應用的問題。Helm 解決了 YAML 太多太散的問題。Rancher 解決了叢集管理的問題。每一個概念都是因為上一步有沒解決的痛點才引出來的。

如果你不想自己手寫所有 YAML，其實用 Helm 一行指令就能搞定。比如 Bitnami 有 WordPress 的 Chart，它裡面已經包了 WordPress 前端加 MySQL 後端加 PVC 加 Ingress。helm install my-blog bitnami/wordpress，就全部跑起來了。這就是下一環節學員自由練習的內容。

---

# 影片 6-24：學員自由練習（不錄影片）

學員實作：
- 必做：用 Helm 安裝一套 WordPress（bitnami/wordpress，含 MySQL + PVC + Ingress）→ 瀏覽器打開看到 WordPress
- 挑戰：自訂 values.yaml 設域名和密碼

---

# 影片 6-25：第六堂總結 + 預告（~12min）

## 本集重點

- 因果鏈回顧：從 NodePort 到 Rancher
- 今天新學的 kubectl 指令整理
- Docker → K8s 對照表更新
- 回家作業
- 下堂課預告：生產就緒
- 比喻收尾

## 逐字稿

好，大家辛苦了。今天的內容非常多，我們來做一個完整的回顧。

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

再來更新我們的 Docker 對照表。docker volume create 對應 PV。docker run -v 對應 PVC。docker run --name 固定名稱對應 StatefulSet 的穩定身份。Docker Compose 的 docker-compose.yml 對應 Helm 的 Chart。docker compose up 對應 helm install。docker compose down 對應 helm uninstall。.env 檔案對應 values.yaml。

回家作業。第一題，用 Helm 安裝一套 WordPress，打開瀏覽器看到 WordPress 的歡迎頁面。第二題，回顧今天所有的因果鏈，用你自己的話寫一段 NodePort 到 Rancher 的推導過程。不用寫長篇大論，幾句話串起來就好。重點是理解每個概念是為了解決什麼問題而存在的。

下堂課預告。今天你的系統跑起來了，域名有了、設定分離了、密碼安全了、資料持久了、套件管理有了、GUI 監控有了。但是，系統真的準備好面對生產環境了嗎？

想想看。你的 API Pod 裡面的程式死鎖了，process 還活著但不處理任何請求。K8s 看 Pod 的狀態是 Running，因為 process 沒有退出。Service 照樣把流量送過去，使用者看到的是 502 Bad Gateway。K8s 怎麼知道 Pod 活著但不健康？這就是 Probe，健康檢查。

再想一個。一個 Pod 裡面的程式有記憶體洩漏，越吃越多，把整台 Node 的記憶體吃光了。Node 上的其他 Pod 全部跟著掛。怎麼限制一個 Pod 最多能用多少 CPU 和記憶體？這就是 Resource limits。

還有。流量突然暴增，你的三個 Pod 扛不住了。但你在睡覺，沒人打 kubectl scale。等你醒來的時候使用者已經罵翻了。有沒有辦法讓 K8s 自動根據 CPU 使用率擴容？這就是 HPA，水平自動擴縮。

最後。你的叢集上有十個團隊在跑服務。有個新人不小心打了 kubectl delete namespace production。所有生產環境的服務全部消失。怎麼控制誰能做什麼？這就是 RBAC，角色存取控制。

下堂課的主題是「生產就緒」。Probe 健康檢查、Resource 資源限制、HPA 自動擴縮、RBAC 權限控制、NetworkPolicy 網路隔離。最後我們會從零建一套完整的系統，把四堂課學的所有東西全部用上。

用一個比喻來收尾。今天你給你的服務穿上了正式的衣服：域名是門牌、設定和密碼是名片夾、資料持久化是保險箱、套件管理是購物車、GUI 管理是監控攝影機。下堂課，我們要讓這個服務通過生產環境的壓力測試。穿得漂亮不夠，還要扛得住。

大家辛苦了，我們下堂課見。
