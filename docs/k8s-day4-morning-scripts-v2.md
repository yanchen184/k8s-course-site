# 第四堂上午逐字稿 v2 — 問題驅動式

> 8 支影片，每支 10-15 分鐘
> 主線故事：你是一個工程師，從 Docker 單機一路升級到 K8s

---

# 影片 4-1：從 Docker 到 K8s — 為什麼你需要它

## 本集重點

- 前三堂用 Docker 在一台機器上跑得很好，但現實場景會遇到五個瓶頸
- 五個問題：跨機器、故障恢復、彈性擴展、不停機更新、服務發現
- 這五個問題逼出了 Kubernetes
- K8s 的背景：Google Borg → 開源 → CNCF → 行業標準
- K8s 如何逐一解決這五個問題

## 逐字稿

各位同學大家好，歡迎來到第四堂課。

在開始之前，先提醒大家一件事。等一下我們會需要用到 minikube 這個工具，安裝需要一點時間，所以建議你現在就先把安裝指令跑起來，讓它在背景下載，不影響你聽課。指令在螢幕上，如果你用的是 Ubuntu，就是這三行。跑完之後再執行 minikube start，讓它把叢集先建起來。好，我們邊裝邊上課。

回顧一下我們前三堂走過的路。第一堂課我們學了 Linux 基礎，學會了在終端機裡面操作檔案、管理資料夾、設定網路。第二堂課我們進入了 Docker 的世界，學會了 Image、Container、Port Mapping、Volume 這些核心概念。我們知道了怎麼用 docker run 跑一個容器，怎麼把容器的 Port 開放出來讓外面連進去，怎麼把資料掛載到容器外面保存起來。第三堂課我們更進一步，學了 Dockerfile 自己打包 Image，還學了 Docker Compose 用一個 YAML 檔案同時管理好幾個容器。我們做了一個前端加後端加資料庫的組合，一個 docker compose up 就全部跑起來了。

到第三堂結束的時候，我們已經可以在一台機器上用 Docker Compose 把前端、後端、資料庫全部跑起來，而且跑得很好。在開發環境、在測試環境，這完全夠用了。三五個容器，一台機器，Docker Compose 管得服服貼貼的。

但是，現在我要請你想像一個場景。

假設你在一家電商公司工作，你負責的系統越來越大。一開始可能就是一個 API 加一個資料庫，兩三個容器搞定。但是業務成長了，老闆說要加上訊息佇列處理訂單，要加上 Redis 做快取提升速度，要加上 Elasticsearch 做全文搜索，還要加上 Prometheus 和 Grafana 做監控。容器越來越多，可能有幾十個、甚至上百個。而且你的使用者也越來越多，一台機器的 CPU 和記憶體開始不夠用了。

這時候，問題一個接一個地冒出來了。我們一個一個來看。

第一個問題：一台機器扛不住了，容器要分散到多台機器。你的 CPU 跑滿了、記憶體不夠用了，你需要把容器分散到多台機器上去跑。但是你回頭看看 Docker Compose，它只能管一台機器上的容器。你有三台機器，Docker Compose 沒辦法幫你決定這個容器該跑在哪台機器上。你只能自己手動 SSH 到每台機器上去跑 docker compose up，然後自己記住哪個容器在哪台機器上。三台機器還勉強記得住，如果是三十台呢？五十台呢？你拿一個 Excel 表格在那邊記嗎？這根本管不動。而且你怎麼知道哪台機器還有空位？哪台機器的 CPU 已經快爆了？你不可能每次部署都先 SSH 到每台機器上去看一下資源使用狀況吧？

第二個問題：機器掛了，上面的容器怎麼辦。你好不容易把容器分散到三台機器上了，結果某天凌晨三點，第二台機器的硬碟壞了，整台機器掛了。上面跑的十幾個容器全部停掉。你被電話叫醒，睡眼惺忪地打開電腦，手忙腳亂地查哪些容器原本在那台機器上。然後你要 SSH 到其他還活著的機器上，一個一個把容器重新部署起來。整個過程可能要半小時甚至更久，這段時間你的使用者全部看到錯誤頁面。Docker 本身不會幫你做這件事，它不知道哪台機器掛了，更不會自動把容器搬到別的機器上去。它根本沒有這個能力，因為 Docker 的設計就是單機的。

第三個問題：流量暴增，來不及加容器。雙十一到了，零點一到，流量瞬間暴增十倍。你的 API 容器扛不住了，回應時間從一百毫秒暴增到五秒鐘，使用者瘋狂重新整理頁面讓情況更糟。你需要趕快多開幾個容器來分擔流量。用 Docker 的話，你可以用 docker compose up scale web 等於 10，但這只能在一台機器上加，而且你得自己手動去執行這個指令。等你反應過來、敲完指令、容器跑起來，可能已經過了好幾分鐘，使用者早就看到一堆 502 錯誤然後跑去別的網站了。更麻煩的是，流量退了之後，你又得記得把多出來的容器關掉，不然白白浪費資源和錢。你有辦法每天盯著流量圖表手動調嗎？不可能的。

第四個問題：更新版本的時候要停機。你的 API 有新版本要上線，修了一個重要的 bug。最土的做法就是先把舊的容器停掉，再啟動新的容器。但中間這段空窗期，可能是幾秒鐘到幾十秒鐘，使用者是連不上的。對電商網站來說，幾秒鐘可能就是幾萬塊的損失。你想做到不停機更新，但 Docker Compose 沒有內建這個功能。你當然可以自己寫腳本，先啟動新容器、確認健康了再把舊容器關掉。但這個腳本很難寫得好，你得處理各種邊界情況：新容器啟動失敗了怎麼辦？健康檢查的邏輯怎麼定義？舊容器關掉的時候正在處理的請求怎麼辦？這些問題一個比一個麻煩。

第五個問題：容器之間找不到對方。你的 API 容器要連資料庫，你把資料庫的 IP 寫在環境變數裡。但是資料庫容器重啟了，IP 變了。API 還在用舊的 IP 去連，連不上，服務就掛了。在同一台機器上，Docker Compose 的 Network 可以用服務名稱來找到對方，這個我們學過，非常方便。但跨機器呢？你的 API 在機器一，資料庫在機器二，Docker 的 Network 跨不了機器。你怎麼讓它們找到彼此？自己搭一套服務發現的系統嗎？那又是一個巨大的工程。

好，我們來整理一下。五個問題：第一，容器要跨多台機器分配，Docker Compose 只管一台。第二，機器故障了，容器要自動搬家，Docker 做不到。第三，流量暴增要自動加容器，Docker 做不到。第四，版本更新要不停機，Docker 沒有內建支援。第五，跨機器的容器要互相找到對方，Docker 的網路只管一台機器。

這五個問題，你有沒有發現一個共同的特徵？就是它們全部都跟「多台機器」有關。Docker 本身就是一個單機工具，它的設計目標就是在一台機器上跑好容器。當你的規模超出一台機器的時候，Docker 就無能為力了。你需要一個能管理「一群機器」的工具，而不是管理「一台機器」的工具。

這就是 Kubernetes 要解決的。

Kubernetes，簡稱 K8s，K 和 s 之間有 8 個字母所以叫 K8s。它原本是 Google 內部的一個系統，叫做 Borg。Google 從 2003 年左右就開始用 Borg 來管理自己內部的容器，跑了超過十五年，管理的規模是什麼等級呢？Google 自己說過，他們每週要啟動超過二十億個容器。二十億，不是二十個，是二十億。這個系統經過了十幾年、數十億容器的實戰驗證。2014 年，Google 決定把 Borg 的設計理念拿出來，用 Go 語言重新實作，開源給全世界使用，這就是 Kubernetes。後來 Google 把它捐給了 CNCF，也就是雲端原生運算基金會，讓它成為一個社群驅動的專案。到今天，K8s 已經成為容器編排領域的行業標準，基本上所有的雲端服務商，不管是 AWS、GCP、Azure，還是阿里雲、騰訊雲，都提供了 K8s 的託管服務。

那 K8s 是怎麼解決我們剛才說的五個問題的呢？讓我們一個個對回去。

第一個問題，容器要分配到多台機器。K8s 有一個叫做 Scheduler 的組件，它會自動看每台機器的資源狀況，哪台機器比較空閒就把容器放到哪台。你完全不用自己決定。

第二個問題，機器掛了怎麼辦。K8s 會持續監控每台機器的狀態，如果發現某台機器掛了，它會自動把上面的容器重新調度到其他健康的機器上。整個過程不需要你半夜起床操作。

第三個問題，流量暴增。K8s 有自動擴縮容的功能，你可以設定規則，比如當 CPU 使用率超過百分之七十的時候，自動多加幾個容器。流量退了之後，自動縮回來。

第四個問題，不停機更新。K8s 內建了滾動更新的功能，它會先啟動新版本的容器，確認健康了再關掉舊版本的容器，逐步替換，整個過程使用者完全感覺不到。萬一新版本有問題，一個指令就能回滾到舊版本。

第五個問題，容器之間怎麼找到對方。K8s 內建了服務發現和 DNS 的功能，每個服務都有一個穩定的名字和地址，不管容器怎麼換、IP 怎麼變，其他容器都能用這個名字找到它。

你看，五個問題，五個解決方案，一一對應。這就是 K8s 的核心價值：它幫你處理所有「多機器、多容器」的管理工作，讓你可以專心寫程式，而不是花大量時間在維運上面。

一句話總結：Kubernetes 就是一個容器的管理平台，你只要告訴它你想要什麼樣的狀態，它就幫你做到，而且持續維護這個狀態。這個「你告訴它想要什麼，它自己想辦法做到」的理念，在 K8s 裡面叫做「宣告式管理」，Declarative。相對於 Docker 的「命令式管理」，就是你告訴它每一步怎麼做。宣告式像是你跟餐廳服務生說「我要一份牛排七分熟」，你不用管廚師怎麼煎。命令式就是你自己站在鍋子前面，先開火、放油、放牛排、翻面、計時。K8s 是前者。

這就是我們接下來幾堂課要學的東西。接下來的影片，我會帶你認識 K8s 裡面的核心概念，每個概念都是為了解決一個具體的問題。我們一個一個來看。

---

# 影片 4-2：Pod、Service、Ingress — 讓容器能跑、能連、能被外面看到

## 本集重點

- K8s 不直接管容器，它管的是 Pod — 解釋 Pod 是什麼
- Pod IP 會變、外面連不到 — 引入 Service（ClusterIP / NodePort / LoadBalancer）
- ClusterIP 的 DNS 功能讓 Pod 用名字找到對方
- 使用者要用域名存取 — 引入 Ingress
- 每個概念都對照 Docker

## 逐字稿

上一支影片我們談了五個問題，知道為什麼需要 K8s。現在我們決定要用 K8s 了，那第一步是什麼？很簡單，就是把容器跑起來。

在 Docker 的世界裡，你要跑一個容器，就是 docker run nginx，一行指令搞定。但在 K8s 裡，事情稍微不一樣。K8s 不直接管容器，它管的最小單位叫做 Pod。

Pod 是什麼？你可以把它想成是容器的一層包裝。就像你去便利商店買飯糰，飯糰本身是米飯和餡料，但外面會包一層塑膠膜。Pod 就是那層塑膠膜，它把容器包起來，提供了一些額外的功能。

具體來說，一個 Pod 裡面可以放一個或多個容器，這些容器共享同一個網路和儲存空間。也就是說，同一個 Pod 裡面的容器，可以用 localhost 互相通訊，就像它們跑在同一台機器上一樣。它們也可以共享同一個檔案系統裡的目錄。

那為什麼不直接管容器，要多包一層 Pod 呢？這是一個很好的問題。因為有些場景下，你的主程式需要搭配一個輔助程式一起跑，而且它們之間的關係非常緊密，緊密到必須在同一個網路空間裡、共享同一個檔案目錄。

舉個例子，你有一個 API 容器，它會把日誌寫到一個檔案裡。旁邊放一個日誌收集的容器，專門負責讀取這個日誌檔案，然後把日誌傳送到集中式的日誌系統，比如 Elasticsearch。這兩個容器需要共享同一個檔案目錄，所以放在同一個 Pod 裡最方便。這種模式叫做 Sidecar 模式，邊車模式，就像摩托車旁邊掛一個邊車一樣。主容器是摩托車，輔助容器是邊車。

再舉一個常見的 Sidecar 例子。在微服務架構裡面，有時候會在主程式旁邊放一個代理容器，比如 Envoy 或者 Istio 的 Sidecar Proxy。所有進出主程式的流量都會經過這個代理容器，它可以幫你做流量管理、監控、加密等等。這也是 Sidecar 模式的典型應用。

不過在絕大多數情況下，最佳實踐是一個 Pod 裡面只放一個容器。你可能會想問：既然大部分時候都只放一個容器，那這層包裝有什麼意義？意義在於 K8s 的所有調度、管理、監控都是以 Pod 為單位的。Pod 是 K8s 的原子單位，就像化學裡的原子一樣，是最小的不可再分的調度單位。所以即使你只放一個容器，它也是被包在 Pod 裡面的。你就把 Pod 當成一個容器來理解就好，只是多了一層包裝而已。

順便提一下 Node。Node 就是一台機器，可以是實體機也可以是虛擬機。一個 K8s 叢集裡面有很多個 Node，每個 Node 上面可以跑很多個 Pod。所以你可以這樣理解：Node 是一台機器，Pod 是跑在機器上的容器的包裝。一個叢集有很多 Node，一個 Node 上有很多 Pod。

好，現在我們知道怎麼在 K8s 裡跑容器了，用 Pod。對照 Docker 的話，docker run nginx 對應到 K8s 就是建立一個 nginx 的 Pod。

但是，容器跑起來之後，馬上就遇到了新問題。

第一個問題：Pod 的 IP 是叢集內部的，外面連不到。每個 Pod 在建立的時候，K8s 會自動分配一個 IP 位址給它。但這個 IP 是叢集內部的虛擬 IP，就像你公司內網的 IP 一樣，從外面的網路是連不到的。你的使用者在家裡打開瀏覽器，沒辦法用這個 IP 去存取你的服務。這跟 Docker 容器的情況很像，Docker 容器也有自己的內部 IP，從外面也是連不到的，所以才需要用 -p 做 Port Mapping。

第二個問題：Pod 的 IP 會變。這個問題其實比第一個更麻煩。Pod 不是一個穩定的東西，它隨時可能被銷毀重建。比如機器掛了，K8s 會在另一台機器上重新建一個 Pod，但這個新的 Pod 會拿到一個全新的 IP。又比如你更新了應用的版本，K8s 會砍掉舊的 Pod、建立新的 Pod，IP 也會變。如果你的 API 容器是用 IP 位址去連資料庫的 Pod，那資料庫一重啟，IP 就變了，API 就連不上了。你可以想像一下，如果你朋友每次搬家都換手機號碼，而且不告訴你新號碼，你就永遠聯絡不到他了。

為了解決這兩個問題，K8s 提供了 Service。

Service 是什麼？你可以把它想成是 Pod 前面的一個穩定的代理人。不管後面的 Pod 怎麼換、IP 怎麼變，Service 的位址是不變的。Service 會自動追蹤它後面有哪些健康的 Pod，把請求轉發過去。Pod 掛了換新的，Service 知道，會自動更新轉發目標。你可以把 Service 想像成一個總機號碼。你打電話給公司的總機，不管接線員換了幾個人，總機號碼永遠不變。Service 就是這個總機。

Service 有幾種類型，我們先認識最常用的三種。

第一種是 ClusterIP，這是預設類型。它會給你一個叢集內部的虛擬 IP，只有叢集裡面的其他 Pod 可以存取。適合什麼場景呢？比如你的 API 要連資料庫，資料庫不需要讓外面連，只要叢集內部能連就好，這時候就用 ClusterIP。

ClusterIP 還有一個非常好用的功能，就是 DNS。K8s 叢集裡面內建了一個 DNS 服務，叫做 CoreDNS。當你建立一個 Service 之後，K8s 會自動在 DNS 裡面註冊一筆記錄。這意味著什麼呢？意味著你的 API 容器不需要用 IP 去連資料庫了，直接用 Service 的名字就好。比如你的資料庫 Service 叫做 mysql-service，你的 API 就可以直接用 mysql-service 這個名字去連，K8s 的 DNS 會自動幫你解析成正確的 IP。這跟 Docker Compose 裡面用服務名稱互連是一樣的概念，但 K8s 的版本可以跨 Node 運作。

第二種是 NodePort。它會在每個 Node 上開放一個 Port，通常是 30000 到 32767 之間的一個數字，讓外部的使用者可以通過 Node 的 IP 加上這個 Port 來存取 Service。這就像 Docker 裡面的 docker run -p 8080:80，把容器的 Port 映射出來讓外面連。差別在於 NodePort 是在叢集裡每個 Node 上都開同一個 Port，所以你連任何一個 Node 的 IP 加上這個 Port 都可以。這個在開發和測試環境很常用，因為最簡單直接。但在生產環境裡，你通常不會直接讓使用者連 NodePort，因為那個 Port 數字不好記，而且暴露 Node 的 IP 也不太安全。

第三種是 LoadBalancer。它會向雲端服務商申請一個負載均衡器，自動分配一個外部 IP。這個在 AWS、GCP 這些雲端環境比較常用。使用者直接連這個外部 IP，負載均衡器會自動把流量分到後面的 Node 上。這個我們之後再細講。

好，有了 Service，叢集內部的 Pod 之間可以互相找到對方了，外部也可以通過 NodePort 連進來了。但是你想想，生產環境中，你會讓使用者用 http 冒號雙斜線 192.168.1.100 冒號 30080 這種 IP 加 Port 的方式來存取你的網站嗎？當然不會。這又長又醜又難記。使用者要用的是域名，比如 www.myshop.com。

這就引出了第三個概念：Ingress。

Ingress 是一個 HTTP 層的路由器。它坐在 Service 的前面，負責接收從外部進來的 HTTP 請求，然後根據域名或路徑，把請求轉發到不同的 Service。

比如說，你有一個電商網站，前端、後端 API、管理後台是三個不同的 Service。你可以在 Ingress 裡面設定：www.myshop.com 轉到前端的 Service，www.myshop.com 斜線 api 轉到後端的 Service，admin.myshop.com 轉到管理後台的 Service。一個域名底下，不同的路徑可以導到不同的服務，這在實際的專案裡面非常常見。你還可以在 Ingress 上面設定 SSL 憑證，讓你的網站支援 HTTPS。

如果你用過 Docker，你可能會自己架一個 Nginx 來做反向代理，把不同的域名轉到不同的容器。Ingress 就是 K8s 版本的 Nginx 反向代理，只不過它是用 K8s 的 YAML 檔案來設定的，不用你自己去改 Nginx 的設定檔。改完 YAML 一 apply，規則就生效了。

你可能會想問：那 Ingress 跟 Service 是什麼關係？它們不是重複了嗎？不是的。Service 解決的是「穩定入口」和「負載均衡」的問題，它是在四層（TCP/UDP）工作的。Ingress 解決的是「HTTP 路由」的問題，它是在七層（HTTP）工作的。一般來說，Ingress 在最外面接收 HTTP 請求，然後轉發到 Service，Service 再轉發到 Pod。它們是配合使用的關係。

不過要注意一點，Ingress 本身只是一個規則定義，它只是說「我想要這樣路由」。它需要搭配一個 Ingress Controller 才能運作。Ingress Controller 是真正在背後處理流量的程式，常見的有 Nginx Ingress Controller、Traefik 等等。你可以把 Ingress 想成是一張地圖，Ingress Controller 是看著地圖開車的司機。沒有地圖，司機不知道往哪開；沒有司機，地圖就只是一張紙。這個我們第六堂課會實際操作，現在先知道概念就好。

我們來整理一下這三個概念的關係。Pod 是跑容器的地方，Service 是 Pod 的穩定入口，Ingress 是 Service 的 HTTP 路由器。流量從外面進來的路徑是：使用者發出請求，先到 Ingress，Ingress 根據域名和路徑轉發到對應的 Service，Service 再轉發到後面健康的 Pod。這條鏈路你要記住，後面實作的時候會一直用到。

下一支影片，我們來解決設定、密碼和資料的管理問題。

## 對照表

| 你在 Docker 做的事 | K8s 對應概念 |
|:---|:---|
| `docker run nginx` | 建立一個 nginx Pod |
| `docker run -p 8080:80` | NodePort Service |
| Docker Network + 容器名稱互連 | ClusterIP Service（內建 DNS） |
| 自己架 Nginx 反向代理 | Ingress + Ingress Controller |

---

# 影片 4-3：ConfigMap、Secret、Volume — 設定、密碼、資料怎麼管

## 本集重點

- 設定寫死在 Image 裡，改設定就要重 build — 引入 ConfigMap
- ConfigMap 兩種使用方式：環境變數 vs Volume 掛載
- 密碼不能明文存 — 引入 Secret（Base64 編碼不是加密）
- RBAC 權限控制才是真正的安全機制
- 容器掛了資料就沒了 — 引入 Volume
- Volume 支援多種儲存後端
- 每個都對照 Docker

## 逐字稿

上一支影片我們解決了三個問題：容器怎麼跑、怎麼被找到、怎麼讓外面用域名連進來。我們用了 Pod、Service、Ingress 三個概念。

現在容器能跑能連了，但是新的問題出現了。我們繼續用電商的例子來看。

第一個問題：設定資訊寫死在 Image 裡。你的 API 容器要連資料庫，資料庫的位址和 Port 寫在哪裡？最直覺的做法就是寫在程式碼的設定檔裡，然後打包進 Image。但是你想一下，開發環境的資料庫位址是 dev-db 冒號 3306，測試環境是 test-db 冒號 3306，上線之後變成 prod-db 冒號 3306。三個環境，三個不同的位址。如果設定寫死在 Image 裡面，你每次換環境就要改設定、重新 build Image、重新部署。這也太麻煩了。而且你想想看，上線的 Image 和測試的 Image 不一樣，你怎麼確保上線的那個版本就是你測試過的那個版本？這會帶來很大的風險。

用 Docker 的時候，我們已經學過怎麼解決這個問題了，就是用環境變數 -e，或者用 Docker Compose 的 environment 區塊，把設定從 Image 裡面抽出來。這樣同一個 Image 可以在不同環境跑，只要換環境變數就好。

K8s 裡面提供了一個更完整的解決方案，叫做 ConfigMap。

ConfigMap 就是一個存放設定資訊的物件。你可以把資料庫位址、Port、各種設定參數存在 ConfigMap 裡面，然後讓 Pod 去讀取。這樣設定和 Image 就完全分離了。以後要改設定，只要改 ConfigMap，不用重新 build Image。

ConfigMap 有兩種使用方式，這個值得花一點時間來比較。

第一種是以環境變數的方式注入到 Pod 裡。Pod 啟動的時候，K8s 會把 ConfigMap 裡面的值設定成環境變數，Pod 裡的程式直接讀環境變數就好。這跟 Docker 的 -e 是一樣的概念。這種方式簡單直覺，適合數量不多的設定項，比如資料庫位址、Port 這些。但它有一個限制，就是環境變數是在 Pod 啟動的時候注入的，如果你後來改了 ConfigMap，已經在跑的 Pod 不會自動更新。你需要重啟 Pod 才能拿到新的值。

第二種是以 Volume 掛載的方式。K8s 會把 ConfigMap 的內容變成一個或多個檔案，掛到 Pod 裡面的某個目錄下。你的程式去讀那個檔案就好。這種方式的好處是，ConfigMap 改了之後，掛載的檔案會在一段時間內自動更新，不需要重啟 Pod。不過你的程式要自己偵測檔案變化才行，或者定期重新讀取設定檔。這種方式適合設定內容比較多、比較複雜的情況，比如一整個 nginx.conf 設定檔。

一般來說，簡單的設定用環境變數，複雜的設定檔用 Volume 掛載。實際上很多專案兩種都會用到。比如資料庫的連線位址用環境變數，nginx 的完整設定檔用 Volume 掛載。

你可能會問：那 ConfigMap 可以存多大的資料？K8s 規定 ConfigMap 的大小上限是 1 MB。如果你的設定檔超過這個大小，那你可能需要重新思考一下你的架構了。一般來說，設定檔不應該這麼大。

好，設定的問題解決了。但是有些東西不是普通的設定，而是敏感資訊。

第二個問題：密碼不能明文放在 ConfigMap 裡。你的資料庫密碼、API 金鑰、SSL 憑證，這些東西如果放在 ConfigMap 裡面，任何能存取 ConfigMap 的人都能看到。想像一下，你的叢集裡面有十個開發者都有權限看 ConfigMap，那他們都能看到資料庫的密碼。這不安全。

K8s 提供了另一個東西叫做 Secret。Secret 和 ConfigMap 非常像，用法也幾乎一樣，差別在於 Secret 儲存的內容會做 Base64 編碼。

但是我要特別強調一點，這個是很多初學者會搞錯的地方：Base64 是編碼，不是加密。什麼意思呢？加密是用金鑰把資料鎖起來，沒有金鑰就打不開。但 Base64 只是一種轉換格式，就像把中文翻譯成英文一樣，任何人都能翻譯回來。你拿到一個 Base64 編碼的字串，在終端機裡執行一個 base64 decode 的指令，一秒鐘就解回原文了。所以千萬不要以為放在 Secret 裡就安全了，它只是多了一層薄薄的遮掩。

那 Secret 的意義在哪裡？它的意義在於 K8s 把 Secret 和 ConfigMap 區分成了兩種不同的資源類型。這樣你就可以用 RBAC 權限控制來分別設定誰可以存取什麼。RBAC 是 Role-Based Access Control 的縮寫，角色型存取控制。簡單來說，你可以設定規則：一般的開發者只能看 ConfigMap，不能看 Secret。只有運維人員或者特定的管理員才能存取 Secret。這樣密碼就不會被隨便看到了。真正的安全是靠權限控制、靠加密機制，不是靠 Base64。我們第七堂課會講 RBAC 的實際操作。

這裡有個常見的誤區要提醒一下。有些同學看到 Secret 就覺得「太好了，我把密碼放進去就安全了」。不是的。Secret 只是 K8s 幫你做了一個分類，把敏感資料和普通設定分開放。真正的安全需要你做其他事情：設好 RBAC 權限、啟用 etcd 的靜態加密、限制 API Server 的存取。Secret 只是安全體系的第一步，不是全部。

如果對照 Docker 的話，ConfigMap 就像 docker run -e 的環境變數，Secret 就像 Docker Compose 裡的 .env 檔案。在 Docker 的世界裡，.env 檔案也是明文的，安全性也是靠檔案權限來控制。概念是類似的。

好，設定和密碼都處理好了，還有最後一個問題。

第三個問題：容器掛了，裡面的資料就沒了。我們在學 Docker 的時候就講過這個問題，而且花了不少時間。容器是短暫的，它隨時可能被銷毀重建。容器裡面的檔案系統是臨時的，容器一刪，資料就跟著消失。對一般的 API 容器來說，這沒關係，因為它本身不存資料，它只是處理請求然後回傳結果。但是資料庫呢？你的 MySQL 容器存了幾百萬筆客戶訂單，結果容器重啟一下，資料全部消失。你的老闆明天就會請你離開。這當然不行。

在 Docker 裡面，我們用 docker volume 來解決這個問題，把資料存在容器外面的磁碟上。K8s 裡面也有 Volume，概念完全一樣，就是把資料存在 Pod 外面。Pod 被銷毀重建，資料還在。就像你租房子，個人物品放在租來的儲物間裡，不管你搬幾次家，儲物間裡的東西都在。

K8s 的 Volume 有好幾種類型。最簡單的是 emptyDir，就是一個臨時的空目錄，Pod 裡的多個容器可以共享這個目錄。注意，emptyDir 的資料在 Pod 刪除的時候就會消失，所以它不適合做持久化。它適合的場景是 Sidecar 模式，比如主容器寫日誌檔案，Sidecar 容器讀取日誌並轉發。

真正做持久化的是 hostPath 和各種遠端儲存。hostPath 就是把 Node 上的某個目錄掛載到 Pod 裡，概念跟 Docker 的 -v 完全一樣。但 hostPath 有一個問題：Pod 如果被調度到另一個 Node 上，它就讀不到原來那個 Node 的檔案了。

所以在生產環境裡，更常用的是遠端儲存。K8s 的 Volume 比 Docker 的更強大，因為它支援非常多種儲存後端。Docker 的 volume 基本上就是存在本機的磁碟上。但 K8s 的 Volume 可以掛載到各種地方：本機磁碟當然可以，NFS 網路儲存也可以，雲端硬碟像 AWS 的 EBS、GCP 的 Persistent Disk 也可以，甚至分散式儲存系統像 Ceph 也可以。

這有什麼好處呢？好處是即使 Pod 被調度到不同的 Node 上，它還是可以掛載到同一個遠端儲存空間，資料不會遺失。舉個例子，你的 MySQL Pod 原本在 Node 1 上，資料存在 AWS EBS 上。Node 1 掛了，K8s 把 MySQL Pod 調度到 Node 2 上。因為資料是在 EBS 上，不是在 Node 1 的本地磁碟，所以 Node 2 上的新 Pod 可以重新掛載同一個 EBS，資料完全沒有遺失。這是 Docker 的 volume 做不到的。

在 K8s 裡面，Volume 的管理還有一套更完整的機制，叫做 PV 和 PVC。PV 是 Persistent Volume，代表一塊實際的儲存空間。PVC 是 Persistent Volume Claim，代表 Pod 對儲存空間的申請。就像租房子一樣，PV 是房子，PVC 是租約。Pod 拿著租約去找房子住。這個我們第六堂課會詳細講，現在知道有這個東西就好。

到這裡，我們已經解決了三個問題：設定用 ConfigMap、密碼用 Secret、資料用 Volume。

讓我用一個比喻來串起來。如果 Pod 是一個人，那 ConfigMap 就是他的工作手冊，告訴他公司的規章制度和工作流程。Secret 就是他的密碼本，放在抽屜裡上了鎖。Volume 就是他的檔案櫃，裡面的文件不會因為他離職就消失，下一個人來還可以繼續用。

這三個東西加上前一支影片的 Pod、Service、Ingress，我們已經認識了六個概念了。接下來我們要解決最後兩個大問題：怎麼讓應用不怕掛、不怕更新。

## 對照表

| 你在 Docker 做的事 | K8s 對應概念 |
|:---|:---|
| `docker run -e DB_HOST=xxx` | ConfigMap（環境變數注入） |
| Docker Compose 的 `.env` 檔案 | Secret |
| `docker volume` / `-v /data:/var/lib/mysql` | Volume（支援本地、NFS、雲端硬碟） |

---

# 影片 4-4：Deployment、StatefulSet — 讓應用不怕掛、不怕更新

## 本集重點

- 只有一個 Pod，掛了就停服務 — 引入 Deployment（副本機制）
- Deployment → ReplicaSet → Pod 三層關係
- 滾動更新的詳細過程 + 回滾功能
- 資料庫不能用 Deployment — 引入 StatefulSet
- StatefulSet 三個特點各舉實例
- 八個核心概念總結：回顧我們解決了哪些問題

## 逐字稿

前面三支影片，我們解決了怎麼跑容器、怎麼連、怎麼管設定和資料。到目前為止，我們的電商系統是這樣的：有一個 API 的 Pod、一個資料庫的 Pod，前面有 Service 讓它們互相找到對方，Ingress 讓使用者用域名連進來，設定放在 ConfigMap 裡，密碼放在 Secret 裡，資料庫的資料用 Volume 持久化。

看起來很完美對吧？但是有一個致命的問題。

你的 API 只有一個 Pod。不管是程式 bug 導致記憶體洩漏、還是 Node 的硬體故障、還是 K8s 升級需要重啟 Node，只要這唯一的 Pod 停了，你的使用者就什麼都連不到。Service 後面沒有 Pod 可以轉發了，使用者就會看到錯誤頁面。這就是所謂的「單點故障」，Single Point of Failure。在正式的生產環境裡，這是絕對不允許的。

怎麼解決？很直覺，多跑幾個副本。你的 API 如果有三個 Pod 在跑，分散在不同的 Node 上，掛了一個還有兩個可以繼續服務。Service 會自動偵測到哪些 Pod 是健康的，把流量只導向還活著的 Pod。使用者完全感覺不到有一個 Pod 掛了。

但是問題來了，你要自己手動去建立三個 Pod 嗎？掛了一個你要自己手動再補一個嗎？半夜三點 Pod 掛了你要爬起來補嗎？當然不用，K8s 有一個東西叫做 Deployment。

Deployment 就是一個管理 Pod 副本的控制器。你只要告訴它兩件事：第一，你要跑什麼 Image，比如 nginx。第二，你要跑幾個副本，比如 3 個。然後 Deployment 就會自動幫你建立 3 個 Pod，並且持續監控它們。如果有一個 Pod 掛了，Deployment 會自動偵測到，然後建一個新的 Pod 補上，始終維持你要的 3 個副本。不管是白天還是半夜，不管你有沒有在看，它都會自動維護。而且這 3 個副本會被分散到不同的 Node 上，這樣即使一整台 Node 掛了，其他 Node 上的副本還能繼續服務。

如果對照 Docker 的話，Deployment 有點像是 docker compose up scale web 等於 3，但它比 Docker 強太多了。Docker 的 scale 只能在一台機器上加副本，而且掛了不會自動補。你得自己盯著、自己手動補。Deployment 可以跨多台 Node 分散副本，掛了自動補。你甚至可以用 kubectl scale 指令動態調整副本數量，比如平常跑 3 個，活動期間改成 10 個，活動結束改回 3 個。一行指令就能完成，不需要停機。

除了副本管理之外，Deployment 還有另一個殺手級功能：滾動更新。

還記得我們第一支影片說的問題四嗎？更新版本要停機。Deployment 的滾動更新是這樣做的：假設你有三個 v1 的 Pod 在跑，你現在要更新到 v2。

第一步，Deployment 會先建立一個 v2 的 Pod。這時候叢集裡面有三個 v1 和一個 v2，一共四個 Pod。

第二步，v2 的 Pod 跑起來了，K8s 會做健康檢查，確認它是正常的。確認健康之後，Deployment 會砍掉一個 v1 的 Pod。現在變成兩個 v1 和一個 v2。

第三步，再建立一個 v2 的 Pod。確認健康後，再砍掉一個 v1。現在是一個 v1 和兩個 v2。

第四步，再建立一個 v2，砍掉最後一個 v1。現在三個都是 v2 了。更新完成。

整個過程中，始終有 Pod 在服務。使用者的請求始終有人處理。就像接力賽一樣，下一棒的選手接穩了，上一棒的選手才放手。不會出現沒人跑的空窗期。

萬一 v2 有問題呢？比如新版本有個 bug，部署到一半發現使用者開始回報錯誤。你正在慌張的時候，旁邊的資深同事淡定地說：「回滾就好了。」怎麼回滾？Deployment 內建了回滾功能。你只要執行一個 kubectl rollout undo 的指令，Deployment 就會自動把所有 Pod 退回到 v1。而且這個回滾是非常快的，因為 K8s 保留了之前版本的記錄，不需要重新 build Image，直接用舊的就好。通常幾十秒鐘就能完成回滾，使用者幾乎感覺不到。這在緊急情況下非常救命。

你甚至可以用 kubectl rollout history 來查看部署歷史，看看之前部署過哪些版本。如果不只是要退回上一版，而是要退回更早的版本，也是一個指令的事情。K8s 會幫你記住最近的幾次部署歷史，預設保留十個版本。

這裡我順便解釋一下 Deployment 背後的架構。Deployment 其實不是直接管 Pod 的，它管的是一個叫 ReplicaSet 的東西。ReplicaSet 才是真正管 Pod 副本數量的。所以實際上是三層結構：

Deployment 管 ReplicaSet，ReplicaSet 管 Pod。

你可能會想問，為什麼要多這一層？直接 Deployment 管 Pod 不行嗎？原因就跟滾動更新有關。當你從 v1 更新到 v2 的時候，Deployment 會建立一個新的 ReplicaSet 來管 v2 的 Pod，同時保留舊的 ReplicaSet（管 v1 的 Pod）。新的 ReplicaSet 慢慢擴大副本數，舊的 ReplicaSet 慢慢縮小副本數。這就是滾動更新的實現方式。

而回滾的時候呢？更簡單了。舊的 ReplicaSet 還在，只是副本數被縮到 0 了。回滾就是把舊的 ReplicaSet 副本數加回去，把新的縮到 0。因為 ReplicaSet 還在，不需要重新建立任何東西，所以回滾速度非常快。

不過你平常不需要直接操作 ReplicaSet，它是 Deployment 自動建立和管理的。你只要管 Deployment 就好。這就像你去餐廳點餐，你告訴服務生你要什麼菜，服務生告訴廚師，廚師去做。你不需要自己去跟廚師說話。Deployment 是你的服務生，ReplicaSet 是廚師。

這裡有一個常見的面試題：Deployment、ReplicaSet、Pod 三者的關係是什麼？你現在就可以回答了。Deployment 定義了你想要的應用狀態，包括 Image 版本和副本數。ReplicaSet 是 Deployment 建立的，負責維持指定數量的 Pod 副本。Pod 是實際跑容器的地方。你操作 Deployment，Deployment 管 ReplicaSet，ReplicaSet 管 Pod。三層，每層各有職責。

好，Deployment 解決了無狀態應用的副本管理和更新。但是資料庫怎麼辦？

這個問題很重要。資料庫不能用 Deployment 來管。為什麼？因為資料庫是有狀態的。

三個 API 的 Pod 是一模一樣的，沒有任何差別，請求隨便導到哪一個都可以。使用者不在乎自己的請求被哪個 Pod 處理。但是三個 MySQL 的 Pod 呢？事情完全不一樣。

第一，每個 Pod 的資料可能不同。在 MySQL 主從架構裡，mysql-0 是主節點負責寫入，mysql-1 和 mysql-2 是從節點只負責讀取。你不能隨便把寫入請求導到從節點上。

第二，它們的身份很重要。mysql-0 就是 mysql-0，重啟之後它還必須是 mysql-0，因為其他節點都知道「主節點是 mysql-0」。如果重啟之後名字變了，整個複製架構就亂了。

第三，順序很重要。你必須先把主節點跑起來，從節點才能去連主節點同步資料。如果從節點比主節點先啟動，它根本不知道去哪裡同步。

K8s 提供了 StatefulSet 來解決這個問題。StatefulSet 和 Deployment 很像，也能管理多個副本，但它有三個特別的地方：

第一，穩定的網路標識。Deployment 建立的 Pod 名稱是隨機的，像 nginx-abc123，每次重啟名字都不一樣。但 StatefulSet 建立的 Pod 名稱是有序的而且穩定的：mysql-0、mysql-1、mysql-2。重啟之後名稱不變。mysql-0 永遠是 mysql-0。

第二，有序的部署和刪除。它會按順序一個一個建立 Pod。先建 mysql-0，確保它完全跑起來了，才建 mysql-1。mysql-1 跑起來了，才建 mysql-2。刪除的時候反過來，從最後一個 mysql-2 開始刪，再刪 mysql-1，最後才刪 mysql-0。就像搭積木一樣，要從底層開始搭，拆的時候從頂層開始拆。

第三，每個 Pod 有自己獨立的儲存。不是共享的，是各自有各自的磁碟。mysql-0 有自己的 Volume，mysql-1 也有自己的 Volume。即使 Pod 重啟了，它會重新掛載回自己的 Volume，資料不會搞混。

不過說實話，在實務上，很多團隊會選擇不把資料庫放在 K8s 裡面。為什麼呢？因為 StatefulSet 的管理比 Deployment 複雜很多。資料庫的備份、還原、主從切換，這些操作在 K8s 裡做起來比在裸機上要複雜得多。所以很多團隊的做法是：資料庫直接部署在外部的獨立機器上，或者用雲端的託管資料庫服務，像 AWS 的 RDS、GCP 的 Cloud SQL。讓專業的服務來管資料庫，你只負責連線就好。K8s 裡面就只跑無狀態的應用，像 API、前端這些。這是一個非常常見的最佳實踐，特別是在剛開始導入 K8s 的團隊。你不需要什麼都放到 K8s 裡面，選擇最適合的方案才是對的。

好，到這裡，我們已經認識了 K8s 的八個核心概念。讓我們用「解決了什麼問題」的角度來做一個總結。

我們一開始遇到的問題是，Docker 只能在一台機器上管容器。所以我們需要一個跨機器的管理平台，這就是 K8s。

進到 K8s 之後，第一步要跑容器，我們學了 Pod。Pod 跑起來了但是 IP 不穩定、外面連不到，所以我們學了 Service。Service 解決了連線問題但使用者需要域名，所以我們學了 Ingress。

服務跑起來了，設定寫死在 Image 裡很麻煩，所以我們學了 ConfigMap。密碼不能明文存，所以我們學了 Secret。容器掛了資料會消失，所以我們學了 Volume。

最後，只有一個 Pod 會有單點故障，所以我們學了 Deployment 來管理多副本。資料庫有狀態不能用 Deployment，所以我們學了 StatefulSet。

八個概念，每一個都是為了解決一個具體的問題。這就是 K8s 的核心。後面四堂課我們會一個一個深入，實際寫 YAML、部署、操作。今天上午只需要先建立起全貌的理解就好。

接下來我們要換一個角度，不再看「有什麼概念」，而是看「誰在背後讓這些事情發生」。K8s 的架構是什麼樣的？那些自動偵測故障、自動補 Pod、自動調度的功能，到底是誰在做？

---

# 影片 4-5：K8s 架構（上）— Worker Node 與三大組件

## 本集重點

- K8s 是 Master-Worker 架構（管理層 vs 員工）
- Worker Node 三組件：Container Runtime、kubelet、kube-proxy
- containerd 與 Docker 的關係
- 每個組件用「工作職責」的方式理解

## 逐字稿

前面四支影片，我們認識了 K8s 的八個核心概念。Pod 跑容器、Service 穩定入口、Ingress 域名路由、ConfigMap 管設定、Secret 管密碼、Volume 管資料、Deployment 管副本、StatefulSet 管有狀態應用。

但是有一個問題我們一直沒回答：這些事情到底是「誰」在做的？我們說 Pod 掛了會自動建新的，是誰偵測到 Pod 掛了？是誰建的新 Pod？新的 Pod 要跑在哪台機器上，是誰決定的？Service 怎麼知道後面哪些 Pod 是健康的？

這些問題的答案，就在 K8s 的架構裡面。

K8s 是一個典型的 Master-Worker 架構。你可以把它想像成一家公司。公司裡有管理層和員工。管理層坐在辦公室裡，負責做決策：這個任務交給誰、資源怎麼分配、出了問題怎麼處理。員工在現場實際幹活：搬貨、組裝、出貨。管理層不搬貨，員工不做決策，各司其職。

在 K8s 裡面，Master Node 就是管理層，Worker Node 就是員工。

你的應用程式，也就是 Pod，都是跑在 Worker Node 上的。Master Node 不跑你的應用，它只負責管理和調度。就像公司的 CEO 和 HR 不會自己去產線上組裝產品，他們只負責管理和安排。

一個叢集通常有一個或多個 Master Node，和多個 Worker Node。在生產環境裡，Master Node 通常會有三個，做高可用。Worker Node 可能有幾十個甚至上百個，看你的業務量。我們今天用的 minikube 是單節點的，Master 和 Worker 合在一台機器上，方便學習。

好，我們先來看 Worker Node 上面有什麼。每個 Worker Node 上面有三個核心組件。你可以把它們想成是員工身上帶的三件工具。

第一個組件：Container Runtime，容器執行時期。

這是真正負責跑容器的程式。拉映像檔、建立容器、啟動容器、停止容器，都是它的工作。你可以把它想成是工人手上的工具。沒有工具，工人再厲害也沒辦法幹活。

在學 Docker 的時候，我們用的 Container Runtime 就是 Docker Engine。但是在 K8s 裡面，主流用的是 containerd。

你可能會好奇，containerd 是什麼？跟 Docker 有什麼關係？其實 Docker 可以分成兩層來理解。上面一層是 Docker 的使用者介面，包括 docker 指令、Docker Desktop 這些你看得到的東西。下面一層是真正跑容器的引擎，就是 containerd。以前 K8s 是通過 Docker 來跑容器的，但後來 K8s 社群覺得既然我只需要用到底層的 containerd，為什麼還要經過上面的 Docker 那一層？多了一層就多了複雜度和開銷。所以從 K8s 1.24 版本開始，K8s 直接和 containerd 溝通，不再需要 Docker。這也是為什麼在 K8s 的 Node 上，你不需要安裝 Docker，只要有 containerd 就可以了。

你可能會擔心：我之前用 Docker 打包的 Image 還能用嗎？放心，完全可以。因為不管是 Docker 還是 containerd，它們用的映像檔格式是一樣的，都是 OCI 標準格式。你用 Docker build 出來的 Image，在 containerd 上一樣可以跑。

第二個組件：kubelet。

kubelet 是每個 Worker Node 上面的「管理員」或者說「工頭」。它的工作是從 Master Node 那裡接收指令，比如「你這台機器上要跑一個 nginx 的 Pod」，然後 kubelet 就會去叫 Container Runtime 把這個容器建立起來。它也會持續監控這個 Node 上所有 Pod 的狀態，如果有 Pod 掛了，它會立刻回報給 Master Node。

你可以把 kubelet 想成是工地的工頭。老闆說「今天要蓋三面牆」，工頭收到指令之後，就會安排工人去施工。施工的過程中，工頭會一直巡視，看進度有沒有落後、有沒有人受傷。如果出了問題，工頭會立刻回報給老闆。kubelet 就是做這件事的。

第三個組件：kube-proxy。

kube-proxy 負責網路。還記得我們前面講的 Service 嗎？請求發到 Service 之後，是誰把它轉發到正確的 Pod？就是 kube-proxy。它在每個 Node 上維護一套網路規則，確保流量能夠正確地路由到目標 Pod。如果一個 Service 後面有三個 Pod，kube-proxy 也負責在這三個 Pod 之間做負載均衡，把請求平均分配出去。

你可以把 kube-proxy 想成是工地的交通指揮。材料車來了，交通指揮告訴它往左邊走去 A 區卸貨，下一輛車往右邊走去 B 區卸貨。確保每個地方都有材料，不會全部擠在一起。

好，Worker Node 上就是這三個組件：Container Runtime 是工具、kubelet 是工頭、kube-proxy 是交通指揮。

這三個組件缺一不可。沒有 Container Runtime，容器跑不起來。沒有 kubelet，Master Node 的指令傳不到這台機器上。沒有 kube-proxy，網路流量到不了正確的 Pod。它們三個合作，讓一台機器成為 K8s 叢集裡面一個合格的 Worker。

下一支影片，我們來看 Master Node 上面有哪些組件，以及它們是怎麼協同工作的。

---

# 影片 4-6：K8s 架構（下）— Master Node 與完整流程

## 本集重點

- Master Node 四組件：API Server、etcd、Scheduler、Controller Manager
- 每個組件掛了會怎樣
- 完整流程：從 kubectl create deployment 到 Pod 跑起來，再到故障自動恢復
- 架構圖總覽

## 逐字稿

上一支影片我們看了 Worker Node 上的三個組件：Container Runtime 負責跑容器、kubelet 負責管 Pod、kube-proxy 負責管網路。它們是現場幹活的。

現在來看 Master Node。Master Node 是管理層，它不跑你的應用程式，但它指揮整個叢集的運作。Master Node 上有四個核心組件。

第一個：API Server，叢集的大門。

不管你要對叢集做什麼操作，都要先經過 API Server。你用 kubectl 下指令，kubectl 是發給 API Server 的。你用 Dashboard 看叢集狀態，Dashboard 也是問 API Server 的。其他的內部組件要互相溝通，也是通過 API Server。API Server 收到請求之後，會先做身份認證和權限檢查，確認你有權限做這件事，才會繼續處理。

你可以把它想像成公司的大門警衛加總機。所有人進公司都要先過警衛驗證身份，然後通過總機被轉接到正確的部門。沒有這個警衛和總機，公司就亂了。API Server 如果掛了，整個叢集就沒辦法接收任何指令了，kubectl 打不通，Dashboard 也看不到東西。所以 API Server 是非常關鍵的組件。在生產環境裡，Master Node 通常會有多個，就是為了確保 API Server 的高可用。

第二個：etcd，叢集的資料庫。

etcd 是一個分散式的鍵值儲存系統。如果你學過 Redis，概念有點類似，就是用一個 key 對應一個 value 的方式存資料。etcd 存的是整個叢集的狀態。哪些 Node 是健康的、有多少個 Pod、每個 Pod 跑在哪個 Node 上、Deployment 的副本數設成多少、Service 的設定是什麼。所有的資訊都記在 etcd 裡面。

你可以把 etcd 想成是公司的檔案室。公司的所有記錄都在這裡：員工名冊、專案進度、資源分配表。如果檔案室被火燒了，公司的所有記錄都沒了，什麼事情都做不了。所以 etcd 是整個叢集裡面最重要的東西。在生產環境裡，etcd 一定要做定期備份。很多 K8s 運維工程師會告訴你：Node 掛了可以加新的、Pod 掛了會自動重建、Deployment 設定可以重新 apply。但 etcd 的資料丟了，叢集就真的失去了所有記憶，所有的 Deployment、Service、ConfigMap 全部都沒了。你得從頭來過。所以 etcd 的備份是 K8s 運維的第一要務。一般建議至少每天備份一次，備份檔案存到叢集外面的安全位置。

注意，etcd 只存叢集的管理資料，不存你的應用資料。你的 MySQL 資料不會存在 etcd 裡，它存在 MySQL 自己的 Volume 裡面。

第三個：Scheduler，調度器。

當你要建立一個新的 Pod，Scheduler 負責決定這個 Pod 應該跑在哪個 Node 上。它會看每個 Node 的資源使用狀況，包括 CPU、記憶體、磁碟等等。比如 Node 1 的 CPU 用了 80%，Node 2 只用了 20%，那它就會把 Pod 分配到 Node 2 上。

你可以把 Scheduler 想成是公司的 HR 或者專案經理。新任務來了，HR 看看哪個部門人手比較充裕，就把任務派給那個部門。不會把所有任務都派給同一個已經忙得不可開交的部門。Scheduler 做的就是這種「最佳分配」的決策。

而且 Scheduler 不只看資源，它還可以考慮很多其他因素。比如你可以設定一個規則說「這個 Pod 只能跑在有 SSD 硬碟的 Node 上」，或者「這兩個 Pod 不能跑在同一個 Node 上」。Scheduler 會把這些規則都考慮進去，找到最合適的 Node。

第四個：Controller Manager，控制器管理器。

Controller Manager 是整個叢集的「監工」。它的工作方式很特別：它持續監控所有資源的實際狀態，然後和你期望的狀態做比較。比如你說「我要 3 個 nginx 的 Pod」，Controller Manager 就會一直盯著。如果發現只剩 2 個，因為有一個掛了，它就會觸發建立一個新的 Pod，把數量補回 3 個。如果發現有 4 個，多出來一個，它就會砍掉多出來的那個。

這個「比較期望狀態和實際狀態，然後修正」的機制，在 K8s 裡面叫做控制迴圈，Control Loop。它是 K8s 的核心設計理念。你告訴 K8s 你想要什麼，K8s 自己想辦法做到，而且持續維護。你可以把它想像成恆溫空調。你設定溫度 25 度，空調會持續量測室溫，太熱就吹冷氣，太冷就停下來。你不需要告訴它什麼時候開、什麼時候關，你只要說「我要 25 度」就好。Controller Manager 就是 K8s 裡的恆溫器。

Deployment 的副本控制、滾動更新，Node 故障後 Pod 的重新調度，這些背後都是 Controller Manager 在工作。它就像一個永遠不睡覺的監工，二十四小時盯著整個叢集。

好，四個 Master 組件：API Server 是大門、etcd 是資料庫、Scheduler 決定 Pod 放哪裡、Controller Manager 確保一切符合預期。

你可能會想問：如果某個組件掛了會怎樣？

如果 API Server 掛了，你沒辦法下指令給叢集，但已經在跑的 Pod 不會受影響，它們會繼續跑。只是你不能做任何新的操作。

如果 Scheduler 掛了，新的 Pod 就沒有人來分配了，它們會一直排隊等著。但已經跑起來的 Pod 不受影響。

如果 Controller Manager 掛了，Pod 掛了就沒人補了，副本數可能會慢慢減少。但已經跑起來的 Pod 繼續跑。

如果 etcd 掛了，叢集就失去了記憶，什麼狀態都查不到了。這是最嚴重的。

如果 Worker Node 上的 kubelet 掛了，那台 Node 上的 Pod 就沒人管了。Master Node 會偵測到這台 Node 失去聯繫，過一段時間後會把上面的 Pod 標記為失敗，然後在其他 Node 上重建。

所以你可以看到，K8s 的設計是高度容錯的。即使某個組件掛了，整個系統不會立刻崩潰，只是某些功能會暫時失效。這就是分散式系統的優勢。

現在讓我們把整個流程串起來。假設你在終端機輸入：kubectl create deployment nginx replicas 等於 3。

會發生什麼事？讓我們一步一步來。

第一步，kubectl 把這個請求發給 API Server。API Server 先驗證你的身份：你是誰？你有權限建立 Deployment 嗎？驗證通過了。

第二步，API Server 把「要建立一個 3 副本的 nginx Deployment」這個資訊寫到 etcd 裡面。現在 etcd 裡面記錄著：有一個 Deployment，叫 nginx，期望副本數 3。

第三步，Controller Manager 持續在看 etcd 的資料。它發現有一個新的 Deployment，期望有 3 個 Pod，但現在是 0 個。不行，0 不等於 3。所以 Controller Manager 建立了一個 ReplicaSet，要求 3 個 Pod。

第四步，3 個 Pod 目前處於 Pending 狀態，還沒有被分配到 Node。Scheduler 發現了這三個排隊的 Pod，它看了看每個 Node 的資源情況：Worker 1 的 CPU 用了 30%，還很空。Worker 2 的 CPU 用了 50%，也還行。好，Scheduler 決定 Pod 1 和 Pod 3 去 Worker 1，Pod 2 去 Worker 2。分配資訊寫回 etcd。

第五步，Worker 1 上的 kubelet 從 API Server 那裡收到通知：「你要跑兩個 nginx 的 Pod。」kubelet 就去叫 containerd 拉映像檔、建容器、啟動。Worker 2 的 kubelet 也一樣，收到一個 Pod 的任務，開始執行。

第六步，Pod 都跑起來了。kubelet 持續監控這些 Pod 的狀態，定期回報給 API Server。Controller Manager 也持續在看：期望 3 個，實際 3 個，一切正常。

然後有一天，Worker 1 的硬碟壞了，整台機器掛了。上面的兩個 Pod 就停了。

第七步，Master Node 上的 Controller Manager 偵測到只剩 1 個健康的 Pod，但期望是 3 個。1 不等於 3。Controller Manager 觸發建立 2 個新的 Pod。

第八步，Scheduler 把這 2 個新 Pod 分配到還活著的 Worker 2 上。Worker 2 的 kubelet 建立容器、啟動。一切恢復正常。

整個過程，你一行指令都不需要下。K8s 全部自動處理。

這就是一個完整的流程。你只下了一行指令，後面的事情全部是 K8s 的各個組件協同完成的。你可以感受到，每個組件都有明確的分工：API Server 負責接收和驗證、etcd 負責記錄、Controller Manager 負責監控和修復、Scheduler 負責分配、kubelet 負責執行。它們之間通過 API Server 互相溝通，各司其職，就像一條分工明確的流水線。

最後再看一下架構圖。上面是 Master Node，裡面有 API Server、etcd、Scheduler、Controller Manager。下面是多個 Worker Node，每個 Worker 上有 kubelet、kube-proxy、Container Runtime，以及你的 Pod。你通過 kubectl 和 API Server 溝通，API Server 指揮整個叢集。

等一下的實作環節，我們就會在 kube-system 這個 Namespace 裡面，親眼看到這些組件作為 Pod 在跑。是的，K8s 用 Pod 來跑自己的管理組件，自己管自己。等你看到的時候，會覺得特別有意思。

---

# 影片 4-7：動手做（上）— 環境搭建與叢集驗證

## 本集重點

- 環境方案比較：minikube vs k3s vs RKE
- 安裝 minikube + kubectl
- 驗證叢集：get nodes、cluster-info
- kubectl 的角色與用法

## 逐字稿

前面五支影片我們都在講概念。八個核心概念認識了、架構也搞清楚了。現在終於要動手了。我知道有些同學可能已經等不及了，聽了一個多小時的理論，終於可以打開終端機了。

在開始之前，先聊一下環境方案。K8s 的環境搭建方式有很多種，就像你要學開車，可以用模擬器練、可以在駕訓班的封閉場地練、也可以直接上路。不同的方式適合不同的階段。

我們這堂課會用到的有三種方案。

第一種是 minikube，適合個人學習和本機開發。它在你的電腦上模擬一個 K8s 叢集，把 Master 和 Worker 合在一台機器上。安裝只要一行指令，非常簡單。但它是單節點的，不適合生產環境。我們今天用它。

第二種是 k3s，適合輕量的多節點環境。k3s 是 Rancher Labs 開發的輕量級 K8s 發行版。它把 K8s 精簡了很多，安裝也非常簡單，但它是真正的多節點叢集。我們第五堂課會用它，在 VMware 裡面建兩台 Ubuntu 虛擬機，一台當 Master 一台當 Worker，體驗真正的多節點環境。

第三種是 RKE 或者 kubeadm，適合企業生產叢集。安裝比較複雜，但功能最完整、最接近生產環境的配置。這個我們課程裡不會實際操作，但會介紹它的概念。

為什麼今天用 minikube？因為今天我們只需要學 Pod 和基本操作。單節點完全夠用，而且 minikube 裝起來最簡單，不需要額外的虛擬機。等到第五堂課我們學 Deployment 和 Service 的時候，需要看到 Pod 分散在不同的 Node 上，那時候就會換成 k3s。

好，來動手。如果你在第一支影片的時候有照著指示先跑安裝指令的話，現在應該已經裝好了。讓我們來驗證一下。

首先執行 minikube version。如果你看到類似 minikube version 冒號 v1.32.0 這樣的輸出，就代表安裝成功了。如果顯示指令找不到，那代表安裝沒成功或者路徑沒設對，回去看一下安裝步驟。

接下來看叢集是不是已經在跑。執行 minikube status。如果顯示 host 冒號 Running、kubelet 冒號 Running、apiserver 冒號 Running，那就代表叢集正在運行中，很好。

如果還沒啟動，執行 minikube start。這個指令會下載 K8s 的映像檔，建立一個虛擬機或者容器（取決於你的 driver 設定），然後在裡面啟動 K8s 叢集。第一次跑會比較久，大概三到五分鐘，因為要下載東西。之後就快了，因為映像檔已經在本地了。

跑完之後，minikube 會自動幫你設定好 kubectl，讓 kubectl 指向你的 minikube 叢集。這裡解釋一下，kubectl 是 K8s 的命令列工具，就像你學 Docker 的時候用的 docker 指令一樣。docker ps 看容器、docker logs 看日誌、docker exec 進容器。kubectl 的邏輯是一樣的，只是換了一套指令。而且不管你的叢集是 minikube、k3s、還是 AWS 上的 EKS，kubectl 的指令都是一樣的。學一套，到處用。

好，叢集跑起來了，kubectl 也設定好了。讓我們開始探索。

第一個指令，執行 kubectl get nodes。

你應該會看到一行輸出，顯示一個 Node，名字叫 minikube，狀態是 Ready，角色是 control-plane。Ready 代表這個 Node 是健康的。control-plane 代表它同時充當 Master Node 的角色。因為 minikube 是單節點的，Master 和 Worker 合在一起，所以只有一個 Node。等第五堂課我們用 k3s 的時候，你就會看到兩個 Node 了。

第二個指令，執行 kubectl cluster-info。

這會顯示 API Server 的位址和 CoreDNS 的位址。API Server 就是我們前一支影片講的那個「叢集的大門」，所有請求都要經過它。CoreDNS 就是叢集內部的 DNS 服務，讓 Pod 可以用名字找到其他 Service。你可以看到 API Server 跑在一個 https 的位址上，通常是 https 冒號雙斜線加上一個 IP 和 Port。

好，到這裡你已經成功搭建好 K8s 的學習環境了。minikube 在跑、kubectl 能用、Node 是 Ready 的。下一支影片我們要用 kubectl 深入探索這個叢集，親眼看到前面講的那些架構組件。

---

# 影片 4-8：動手做（下）— 親眼看到架構組件

## 本集重點

- 在 kube-system 裡親眼看到架構組件
- kubectl describe node 的重點欄位
- Namespace 的概念
- Dashboard 圖形介面
- kubectl 指令對照 Docker
- 上午總結 + 下午預告

## 逐字稿

上一支影片我們裝好了 minikube，用 kubectl get nodes 確認叢集在跑了。現在來做最有趣的部分：親眼看到 K8s 的管理組件。

執行 kubectl get pods -n kube-system。

這裡的 -n kube-system 是指定 Namespace。什麼是 Namespace？你可以把它想成是叢集裡面的資料夾。就像你電腦裡面用資料夾來分類檔案一樣，K8s 用 Namespace 來分類資源。kube-system 是 K8s 自動建立的一個 Namespace，專門用來放它自己的管理組件。

你應該會看到一堆 Pod，狀態都是 Running。讓我們一個一個來對照前一支影片講的架構。

第一個，etcd-minikube。這就是 etcd，叢集的資料庫，儲存所有叢集狀態的地方。

第二個，kube-apiserver-minikube。這就是 API Server，叢集的大門。你剛才所有的 kubectl 指令都是通過它執行的。

第三個，kube-scheduler-minikube。這就是 Scheduler，調度器。決定新的 Pod 要跑在哪個 Node 上。不過因為我們只有一個 Node，它現在的工作很輕鬆，所有 Pod 都只能放在這唯一的一個 Node 上。

第四個，kube-controller-manager-minikube。這就是 Controller Manager，那個二十四小時不睡覺的監工。持續監控所有資源的狀態。

第五個，kube-proxy 加上一串隨機字元。這就是 kube-proxy，網路代理。每個 Node 上都有一個。

第六個，coredns 加上一串隨機字元。這是 CoreDNS，提供叢集內部的 DNS 解析服務。它不是我們前面提到的七個架構組件之一，但它是一個非常重要的附加組件。有了它，Pod 才能用 Service 的名字來找到對方。

看到了嗎？我們前面講的每一個架構組件，都是以 Pod 的形式在跑。K8s 用 Pod 來管理自己的組件，這是一個非常優雅的設計。它自己就是自己的使用者。

現在我們來看看 Node 的詳細資訊。執行 kubectl describe node minikube。

這個指令的輸出會比較長，不要被嚇到。讓我帶你看幾個重要的部分。

首先是最上面的基本資訊區塊。你會看到 Name 是 minikube，Roles 是 control-plane。Labels 區塊裡面有一些標籤，這些標籤後面可以用來做調度規則，比如「只把 Pod 放在有某個標籤的 Node 上」。

往下滑，你會看到 System Info 區塊。這裡有幾個重要的資訊。Container Runtime 會顯示 containerd 加上版本號。這就驗證了我們前面說的：K8s 用的是 containerd，不是 Docker。Kubelet Version 會顯示 kubelet 的版本，通常跟 K8s 的版本一樣。Operating System 會顯示 linux，Architecture 會顯示 amd64。

再往下，你會看到 Capacity 和 Allocatable 區塊。Capacity 是這個 Node 的總資源，包括 CPU 核心數和記憶體大小。Allocatable 是可以分配給 Pod 使用的資源量，會比 Capacity 少一點，因為 K8s 會保留一些資源給系統自己用。

最下面有一個 Non-terminated Pods 區塊，會列出這個 Node 上所有正在跑的 Pod。你會看到剛才在 kube-system 裡看到的那些 Pod 都列在這裡。

好，我們再來看看叢集裡面有哪些 Namespace。執行 kubectl get ns。ns 是 namespace 的簡寫。

你會看到四個 Namespace：default、kube-system、kube-public、kube-node-lease。

default 是預設的 Namespace。你之後建立的 Pod 如果不指定 Namespace，就會放在 default 裡面。

kube-system 就是剛才看到的，放管理組件的地方。

kube-public 是一個公開的 Namespace，裡面通常放一些公開可讀的資訊。

kube-node-lease 是用來記錄 Node 心跳的，K8s 用它來判斷 Node 是不是還活著。

最常用的就是 default 和 kube-system，其他兩個知道就好。

接下來看一個好東西。執行 minikube dashboard。

這會在你的瀏覽器裡打開 K8s 的 Dashboard，一個圖形化的管理介面。如果你是第一次看到，可能會覺得還蠻酷的。

Dashboard 的左邊是導覽列，你可以看到 Namespaces、Nodes、Pods、Services、Deployments 等等各種資源。你可以點進去看每一種資源的列表和詳細資訊。

比如你點 Workloads 裡面的 Pods，選擇 kube-system 這個 Namespace，你就會看到剛才用 kubectl 看到的那些 Pod，但是是用圖形化的方式呈現。每個 Pod 的狀態、IP、所在的 Node、啟動時間都一目了然。

你也可以點 Cluster 裡面的 Nodes，看到 minikube 這個 Node 的 CPU 和記憶體使用率的圖表。

Dashboard 對初學者來說非常有幫助，它可以讓你更直觀地理解叢集的狀態。但是在日常工作中，大部分工程師還是用 kubectl，因為打指令比點滑鼠快得多，而且可以寫成腳本自動化。兩種方式各有優點。

好，讓我們把今天常用的 kubectl 指令和 Docker 做一個對照，幫你建立直覺。

docker ps 看運行中的容器，對應 kubectl get pods 看 Pod。docker logs 看容器日誌，對應 kubectl logs 看 Pod 日誌。docker exec -it 進容器，對應 kubectl exec -it 進 Pod 的容器。docker stop 和 rm 停止和刪除容器，對應 kubectl delete pod 刪除 Pod。docker compose up -f 用檔案部署，對應 kubectl apply -f 用 YAML 檔案部署。

你會發現，邏輯完全一樣，只是換了一套指令。如果你 Docker 用得熟，kubectl 上手會非常快。

另外還有一個很有用的指令：kubectl api-resources。這會列出 K8s 支援的所有資源類型。Pod、Service、Deployment、ConfigMap 全部都在裡面。你會發現 K8s 的資源類型非常多，可能有好幾十種。不用擔心，我們常用的就是那幾個：Pod、Service、Deployment、ConfigMap、Secret。其他的用到再學就好。

這個指令還會顯示每種資源的簡寫。比如 pods 可以簡寫成 po，services 簡寫成 svc，deployments 簡寫成 deploy。以後你用熟了，打簡寫會快很多。kubectl get po 就等於 kubectl get pods。

好，最後來做一個完整的總結，把整個上午的內容串起來。

我們從一個問題出發：Docker 在單機上跑得很好，但是到了真實的生產環境，容器多了、機器多了、流量大了，Docker 就管不動了。這逼出了 K8s。

然後我們認識了八個核心概念。Pod 讓容器在 K8s 裡跑起來。Service 解決了 Pod IP 不穩定的問題，提供穩定的入口。Ingress 讓使用者用域名來存取服務。ConfigMap 把設定從 Image 裡抽出來。Secret 管理敏感資訊。Volume 讓資料不會隨著容器消失。Deployment 管理無狀態應用的多副本和滾動更新。StatefulSet 管理有狀態應用像資料庫。

接著我們看了 K8s 的架構。Master Node 上有 API Server 當大門、etcd 當資料庫、Scheduler 做調度、Controller Manager 做監控。Worker Node 上有 Container Runtime 跑容器、kubelet 管 Pod、kube-proxy 管網路。

最後我們裝好了 minikube，用 kubectl 親手探索了叢集，在 kube-system 裡面親眼看到了架構組件在跑，用 describe 看了 Node 的詳細資訊，還打開了 Dashboard 的圖形介面。

這就是上午的全部內容。你現在應該對 K8s 有了一個清晰的全貌。你知道它是什麼、為什麼需要它、它有哪些核心概念、它的架構是什麼樣的。

下午我們就要開始真正的動手實作了。我們會先學 YAML 的基本格式，因為 K8s 的所有資源都是用 YAML 來定義的。然後我們會寫你的第一個 Pod，把 nginx 跑起來，用 kubectl 對它做各種操作。接著我們會故意把 Pod 搞壞，學會用 describe 和 logs 來排錯。最後還會做一個多容器的 Pod，體驗 Sidecar 模式。

準備好了嗎？休息十分鐘，下午見。
