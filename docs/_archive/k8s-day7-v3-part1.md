# 第七堂上午逐字稿 v3 — 因果鏈敘事（開場 + Loop 1-3）

> 10 支影片：7-1 到 7-10
> 主線：生產環境的挑戰 → Probe 健康檢查 → Resource limits → HPA 自動擴縮
> 因果鏈銜接第六堂：服務穿上正式衣服了，但扛不扛得住？

---

# 影片 7-1：第六堂回顧 + 生產環境的挑戰（~10min）

## 本集重點

- 第六堂因果鏈快速串：Ingress → ConfigMap → Secret → PV/PVC → StorageClass → StatefulSet → Helm → Rancher
- 到目前為止學的都是「怎麼部署」，但部署上線只是開始
- 生產環境的四個要命問題：服務卡死、資源吃光、流量暴增、誰都能刪
- 今天因果鏈：Probe → Resource limits → HPA → RBAC → NetworkPolicy → 從零建完整系統
- 比喻：服務穿上了正式衣服，但還沒通過壓力測試

## 逐字稿

好，歡迎回來。今天是我們 Kubernetes 課程的第七堂，也是最後一堂。在開始新的內容之前，我們先花幾分鐘把第六堂的因果鏈快速串一遍，確認大家的腦袋裡有一條完整的線。

第六堂的起點是什麼？是第五堂結束的時候，使用者要用 IP 加 NodePort 連進來，地址又長又醜，像是 192.168.1.100:30080 這種東西。你總不能叫使用者記這串數字吧。所以我們學了 Ingress，用域名加路徑做路由。blog.example.com 連到前端，blog.example.com/api 連到後端 API。地址漂亮了，還加了 TLS 做 HTTPS。

接著我們發現設定寫死在 Image 裡面。改一個環境變數就要重新 build Image，密碼寫在 Dockerfile 裡更是災難。所以學了 ConfigMap 管一般設定、Secret 管敏感資料。

設定和密碼分離了，服務跑起來了。結果 MySQL Pod 重啟一次，資料全部消失。所以學了 PV 和 PVC 做持久化儲存。手動建 PV 太煩了，又學了 StorageClass 動態佈建。

有了持久化，可以正式跑資料庫了。但 Deployment 不適合跑資料庫，名字不固定、沒有順序、共用 PVC。所以學了 StatefulSet，固定序號、有序啟動、獨立儲存。

到這裡 YAML 已經多到爆了，一個 MySQL 就要五六個資源。所以學了 Helm，一行 helm install 搞定整套安裝。最後全部用 kubectl 管叢集太痛苦了，學了 Rancher 提供 GUI 管理。

這就是第六堂完整的因果鏈。每一個概念都是因為上一步有沒解決的問題才引出來的。

好，我上堂課結尾用了一個比喻：你的服務穿上了正式的衣服。域名是門牌、設定和密碼是名片夾、資料持久化是保險箱、套件管理是購物車、GUI 是監控攝影機。衣服穿好了，看起來很體面。

但我今天要跟大家說一件殘酷的事情。穿得漂亮不代表扛得住。生產環境會用各種方式考驗你的系統。

我舉四個最常見的要命問題。

第一個，服務卡死沒人知。你的 API Pod 裡面的程式死鎖了，或者資料庫連線池滿了。Pod 的 process 還活著，K8s 看到 STATUS 是 Running。Service 照樣把流量往那邊送。使用者呢？看到的是 502 Bad Gateway，或者請求超時。但你在監控儀表板上看到的是一片綠色的 Running。

第二個，一個 Pod 吃光整台機器的資源。有個 Pod 裡面的程式有記憶體洩漏，越吃越多。其他 Pod 被擠到沒資源可用，全部跟著掛。一隻老鼠壞了一鍋粥。

第三個，流量暴增。雙十一來了，平常三個 Pod 夠用，現在三十個都不夠。你手動 kubectl scale 可以，但你不可能 24 小時盯著。凌晨三點流量暴增的時候你在睡覺，等你醒來使用者已經罵翻了。

第四個，誰都能刪。你的叢集上有十個團隊在跑服務，每個人都拿到了 admin 權限。新來的實習生不小心打了 kubectl delete namespace production，整個生產環境消失。

這四個問題，就是今天要解決的。

今天的因果鏈是這樣走的。服務卡死 → Probe 健康檢查。資源被吃光 → Resource limits。流量暴增 → HPA 自動擴縮。這三個是上午的內容。下午我們會處理「誰都能刪」的 RBAC、網路全通的 NetworkPolicy，最後從零建一套完整的系統，把四堂課學的所有東西全部串在一起。

準備好了嗎？我們從第一個問題開始：Pod Running 不代表服務正常。

---

# 影片 7-2：Probe 概念 — Pod Running 不代表服務正常（~15min）

## 本集重點

- 問題：kubectl get pods 顯示 Running，使用者回報 502
- Running 只代表 process 還在，不代表能正常服務
- 三個場景：API 死鎖、DB 連線池滿、Spring Boot 啟動 60 秒
- Docker 對照：HEALTHCHECK 只有一種
- K8s 三種 Probe：livenessProbe、readinessProbe、startupProbe
- 比喻：廚師的心跳 / 出菜準備 / 熱鍋
- 三種檢查方式：httpGet、tcpSocket、exec
- Probe YAML 四個參數：initialDelaySeconds、periodSeconds、failureThreshold、timeoutSeconds
- livenessProbe vs readinessProbe 差異：重啟 vs 不導流量
- 沒有 Probe 的後果：壞掉的 Pod 繼續收請求

| Probe | 問的問題 | 失敗怎麼辦 | 適用場景 |
|:---|:---|:---|:---|
| livenessProbe | 你還活著嗎？ | 重啟容器 | 死鎖、無窮迴圈 |
| readinessProbe | 準備好接流量了嗎？ | 從 Service 移除 | 啟動中、暫時過載 |
| startupProbe | 啟動完了嗎？ | 重啟容器 | Java 慢啟動 |

| 檢查方式 | 寫法 | 適合 |
|:---|:---|:---|
| HTTP GET | httpGet: path: /health | Web API（最常用） |
| TCP Socket | tcpSocket: port: 3306 | 資料庫、Redis |
| exec 指令 | exec: command: [...] | 自訂檢查邏輯 |

| Docker HEALTHCHECK | K8s Probe |
|:---|:---|
| --interval=30s | periodSeconds: 30 |
| --timeout=3s | timeoutSeconds: 3 |
| --retries=3 | failureThreshold: 3 |
| --start-period=5s | initialDelaySeconds: 5 |
| 只有一種 | liveness + readiness + startup 三種 |

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
  timeoutSeconds: 1
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 3
  periodSeconds: 5
  failureThreshold: 2
```

## 逐字稿

好，我們來看今天的第一個問題。

大家回想一下，從第四堂到現在，你怎麼確認一個服務是正常的？打 kubectl get pods，看到 STATUS 是 Running，READY 是 1/1，RESTARTS 是 0。三個綠燈全亮，你覺得沒事了。

但我要跟大家說，Running 這個狀態是 K8s 在騙你。不是故意騙你，而是 K8s 的能力有限。Running 只代表一件事：容器裡面的主行程還在跑。process 還活著，K8s 就認為你是 Running。

可是 process 活著不代表你的服務能正常回應請求。我舉三個最常見的場景。

場景一，API 死鎖。你的 API 程式碼有 bug，兩個執行緒互相等對方釋放鎖，卡住了。process 還在，記憶體還佔著，但不處理任何請求。K8s 看到的是 Running，使用者看到的是請求超時。

場景二，資料庫連線池滿了。你的 API 連 MySQL，但連線池只有 10 個連線，全部被佔住了。process 還在，但每個新請求都拿不到連線，全部回 500 Internal Server Error。K8s 看到的是 Running，使用者看到的是錯誤頁面。

場景三，啟動太慢。你的 API 是 Java Spring Boot 寫的，啟動要 60 秒。Pod 建好了，容器跑起來了，K8s 馬上說 Running。但程式才初始化到一半，前 60 秒的請求全部失敗。K8s 看到的還是 Running。

三個場景都是同一個問題：K8s 不知道你的服務到底正不正常，它只知道 process 有沒有在跑。

用 Docker 的經驗來想，Docker 有一個 HEALTHCHECK 指令可以寫在 Dockerfile 裡面。你可以設定每 30 秒用 curl 打一下 localhost:8080/health，如果回傳不是 0 就標記為 unhealthy。但 Docker 的 HEALTHCHECK 只有一種。而且說實話功能很有限，它只能標記 unhealthy，不會幫你重啟，也不會幫你把流量切掉。

K8s 在這方面強大得多。它有三種 Probe，探針。每一種負責不同的事情。

第一種叫 livenessProbe，存活探測。它問的問題是：你還活著嗎？K8s 會定期去戳你的 Pod，如果連續戳好幾次都沒有回應，K8s 就判定這個容器已經死了，直接重啟它。注意是重啟容器，不是重啟 Pod。容器重啟之後，程式重新初始化，如果死鎖是暫時的 bug，重啟就能修復。livenessProbe 適合偵測那些不會自己恢復的問題，比如死鎖、無窮迴圈。

第二種叫 readinessProbe，就緒探測。它問的問題是：你準備好接受流量了嗎？如果 readiness 檢查失敗，K8s 不會重啟容器，而是把這個 Pod 從 Service 的 Endpoints 裡面移除。白話說就是不再把流量轉給它。等它恢復了，再把它加回來。readinessProbe 適合那些「暫時不能服務但會自己恢復」的情況。比如應用正在啟動中，還沒準備好。或者暫時過載了，需要喘口氣。你不希望重啟它，只是暫時不要送流量過去。

這兩個的差別非常重要。livenessProbe 失敗是重啟，readinessProbe 失敗是不導流量。一個是換人，一個是讓你休息一下。

第三種叫 startupProbe，啟動探測。這個是專門給啟動特別慢的應用用的。回到剛才 Spring Boot 60 秒啟動的場景。如果你只設了 livenessProbe，initialDelaySeconds 設 5 秒、periodSeconds 10 秒、failureThreshold 3 次。Pod 啟動後第 5 秒開始第一次檢查，失敗。第 15 秒第二次，失敗。第 25 秒第三次，失敗。連續失敗 3 次，K8s 就重啟容器。但你的應用要 60 秒才能啟動啊。結果就是永遠啟動不了，一直在重啟迴圈裡面轉。

有了 startupProbe，K8s 會先等 startupProbe 通過之後，才開始跑 liveness 和 readiness。你可以給 startupProbe 一個比較寬鬆的設定，比如每 5 秒檢查一次、最多失敗 30 次，那就是最多等 150 秒。啟動完了之後，liveness 和 readiness 接手，用比較嚴格的設定做快速監控。

我用一個餐廳的比喻串起來。livenessProbe 就像檢查廚師還有沒有心跳，沒心跳就換一個新廚師。readinessProbe 就像問廚師準備好出菜了沒，還沒好就先不送單給他。startupProbe 就像廚師剛上班還在熱鍋子，等他熱好再讓他接單。

三種 Probe 各自可以用三種方式去檢查。第一種是 HTTP GET，指定一個 path 和 port，K8s 去打那個 URL，回傳 200 到 399 就是成功。這是最常用的方式，Web API 幾乎都用這個。第二種是 TCP Socket，K8s 嘗試連某個 port，連上就是成功。適合資料庫、Redis 這種不是 HTTP 的服務。第三種是 exec，在容器裡面執行一個指令，回傳值是 0 就是成功。適合需要自訂檢查邏輯的場景。

來看 YAML 怎麼寫。livenessProbe 寫在 container 底下。httpGet 指定 path 是斜線，port 是 80。然後四個關鍵參數。initialDelaySeconds 設 5，表示容器啟動後先等 5 秒再開始檢查，給程式一點啟動時間。periodSeconds 設 10，每 10 秒檢查一次。failureThreshold 設 3，連續失敗 3 次才判定不健康。不是失敗一次就重啟，可能只是網路抖了一下。timeoutSeconds 設 1，每次檢查等 1 秒沒回應就算超時。

readinessProbe 的寫法一模一樣，只是參數通常不同。readiness 的 initialDelaySeconds 可以設短一點，periodSeconds 也短一點，因為我們希望 Pod 準備好了就趕快讓流量進來。

對照 Docker 的 HEALTHCHECK，概念幾乎一一對應。Docker 的 --interval 對應 periodSeconds，--timeout 對應 timeoutSeconds，--retries 對應 failureThreshold，--start-period 對應 initialDelaySeconds。最大的差別是 Docker 只有一種 HEALTHCHECK，K8s 有三種，各負責不同的事。

最後我想讓大家想一下，如果你完全不設 Probe 會怎樣。答案是壞掉的 Pod 繼續收請求。程式死鎖了，K8s 不知道，Service 繼續轉流量過去。使用者不斷看到錯誤，你不斷收到客訴。直到有人手動去 kubectl describe pod 才發現問題。生產環境不設 Probe，就像開車不裝後照鏡，你不知道身後發生了什麼事情。

概念講完了，下一支影片我們來動手做，故意把服務搞壞，看 K8s 怎麼處理。

---

# 影片 7-3：Probe 實作 — 故意搞壞觸發重啟（~15min）

## 本集重點

- 寫 nginx Deployment + livenessProbe（httpGet /）
- apply → Pod Running → 確認 Probe 在跑
- 故意搞壞：exec 進去刪 index.html → livenessProbe 404 → K8s 重啟
- kubectl describe pod → Events 看到 Liveness probe failed
- readinessProbe 示範：不導流量但不重啟
- startupProbe 示範：failureThreshold 設大

學員實作：
- 必做：nginx + livenessProbe → 刪 index.html 看重啟
- 挑戰：加 readinessProbe + startupProbe，觀察三者差異

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-probe-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-probe
  template:
    metadata:
      labels:
        app: nginx-probe
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3
            timeoutSeconds: 1
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 3
            periodSeconds: 5
            failureThreshold: 2
```

```bash
# 部署
kubectl apply -f deployment-probe.yaml
kubectl get pods -l app=nginx-probe

# 確認 Probe 狀態
kubectl describe pods -l app=nginx-probe | grep -A10 "Liveness\|Readiness"

# 故意搞壞
POD_NAME=$(kubectl get pods -l app=nginx-probe -o jsonpath='{.items[0].metadata.name}')
kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html
kubectl get pods -l app=nginx-probe -w

# 看 Events
kubectl describe pod $POD_NAME | grep -A20 Events
```

## 逐字稿

好，概念講完了，馬上來動手。請大家打開終端機，確認叢集還在跑。

我們先寫一個帶 Probe 的 nginx Deployment。建一個檔案叫 deployment-probe.yaml。

apiVersion 是 apps/v1，kind 是 Deployment，metadata 的 name 叫 nginx-probe-demo。spec 裡面 replicas 設 2，我們跑兩個副本。selector 的 matchLabels 設 app: nginx-probe。

template 裡面的 containers，name 叫 nginx，image 用 nginx:1.27，ports 設 containerPort 80。

接下來是今天的重點。在 container 底下加 livenessProbe。httpGet 的 path 設斜線，port 設 80，就是打 nginx 的根路徑。initialDelaySeconds 設 5，容器啟動後等 5 秒開始檢查。periodSeconds 設 10，每 10 秒檢查一次。failureThreshold 設 3，連續失敗 3 次重啟。timeoutSeconds 設 1。

再加一個 readinessProbe。同樣 httpGet，path 斜線、port 80。initialDelaySeconds 設 3，periodSeconds 設 5，failureThreshold 設 2。你看 readiness 的檢查頻率比 liveness 高，因為我們想要 Pod 一好就趕快接流量。

好，部署。

kubectl apply -f deployment-probe.yaml

看 Pod 狀態。

kubectl get pods -l app=nginx-probe

兩個 Pod 都是 Running，READY 是 1/1，RESTARTS 是 0。到目前為止一切正常。

我們來看看 Probe 的詳細資訊。

kubectl describe pods -l app=nginx-probe

往下滾找 Containers 的區塊，你會看到 Liveness 和 Readiness 的設定。http-get http://:80/ delay=5s timeout=1s period=10s success=1 failure=3。這就是我們設的參數。

好，現在開始做壞事。

nginx 的 livenessProbe 是用 httpGet 打根路徑。如果你去打 nginx 的根路徑，它會回傳 /usr/share/nginx/html/index.html 的內容，回傳碼是 200，Probe 就通過了。那如果我把 index.html 刪掉呢？nginx 找不到這個檔案，就會回 403 Forbidden。403 不在 200 到 399 的範圍裡，Probe 就會失敗。

先抓一個 Pod 的名字。

POD_NAME=$(kubectl get pods -l app=nginx-probe -o jsonpath='{.items[0].metadata.name}')

進去刪掉 index.html。

kubectl exec $POD_NAME -- rm /usr/share/nginx/html/index.html

好，刪掉了。現在開始觀察。

kubectl get pods -l app=nginx-probe -w

大家猜猜看接下來會發生什麼？我們來算一下時間。periodSeconds 是 10 秒，failureThreshold 是 3 次。也就是說最快要 10 加 10 加 10，30 秒後三次連續失敗，K8s 才會判定不健康。但因為上一次成功的檢查到你刪檔案之間可能已經過了幾秒，所以實際等待時間可能短一些。

好，看到了嗎？RESTARTS 欄位從 0 變成 1 了。K8s 重啟了這個容器。

重啟之後發生什麼事？因為容器是重新啟動的，nginx 重新載入預設的 index.html，livenessProbe 又通過了。Pod 恢復正常。

我們來看看 Events 裡面記錄了什麼。

kubectl describe pod $POD_NAME

找到 Events 的部分。你會看到幾行關鍵的記錄。Liveness probe failed: HTTP probe failed with statuscode: 403。然後 Container nginx failed liveness probe, will be restarted。這就是完整的記錄。K8s 偵測到 Probe 失敗，重啟了容器。

這就是 livenessProbe 的威力。它不只能偵測問題，還能自動修復。在生產環境裡，如果你的程式偶爾因為 bug 卡死，livenessProbe 可以自動重啟容器把它救回來。當然最好還是去修 bug，但至少在修 bug 之前你的服務不會一直掛著。

現在我要讓大家看 readinessProbe 的差別。我們剛才設了 readinessProbe 跟 livenessProbe 打同一個路徑。所以當 index.html 被刪的時候，readinessProbe 也會同時失敗。

readinessProbe 失敗會發生什麼？Pod 會被從 Service 的 Endpoints 移除。如果你有建 Service 的話，流量不會再轉到這個 Pod。但它不會被重啟。

那如果我只設 readinessProbe 不設 livenessProbe 呢？Pod 不會被重啟，也不會收到流量。它就一直待在那裡，什麼事都不做。對某些場景來說這是對的，比如你的服務暫時過載了，你不希望重啟它，只是暫時不要送流量。等它恢復了，readinessProbe 通過，流量又開始進來。

再來看 startupProbe。startupProbe 通常跟 livenessProbe 打同一個路徑，但 failureThreshold 設得很大。比如 failureThreshold 設 30，periodSeconds 設 5，那就是最多等 150 秒讓應用啟動。在 startupProbe 通過之前，liveness 和 readiness 都不會跑。啟動完成之後 startupProbe 就不再檢查了，交給 liveness 和 readiness 接手。

我們的 nginx 啟動很快，幾乎是瞬間就好了，所以 startupProbe 在這個場景裡效果不明顯。但如果你用 Java Spring Boot 或 Python 的 ML 模型，啟動可能要一兩分鐘，那 startupProbe 就是必要的。

好，按 Ctrl+C 停止 watch。

接下來是大家的實作時間。必做題：自己寫 nginx Deployment 加 livenessProbe，部署之後 exec 進去刪 index.html，觀察 K8s 自動重啟容器，RESTARTS 欄位加 1。挑戰題：同時加上 readinessProbe 和 startupProbe。你可以建一個 Service 搭配，然後用 kubectl get endpoints 觀察 readinessProbe 失敗時 Pod 的 IP 從 endpoints 裡消失。大家動手做，有問題舉手。

---

# 影片 7-4：回頭操作 Loop 1（~5min）

## 本集重點

- 帶做 Probe
- 常見坑：initialDelaySeconds 太短、path 寫錯、忘了設 port
- 銜接：服務健康檢查有了，但另一個問題...

## 逐字稿

好，時間差不多了，我們來回頭確認一下大家都做到了。

kubectl get pods -l app=nginx-probe 看一下。兩個 Pod 都是 Running，而且至少有一個的 RESTARTS 大於 0。如果你看到 RESTARTS 從 0 變成 1 或 2，那就對了，表示 livenessProbe 確實觸發了重啟。

如果你的 Pod 沒有重啟，來看幾個常見的坑。

第一個坑，initialDelaySeconds 設太短。你設了 0 秒，容器一啟動就開始檢查。但 nginx 雖然啟動很快，有些時候 Pod 的網路初始化還沒完成，第一次檢查就失敗了。雖然 failureThreshold 是 3 不會馬上重啟，但這會造成不必要的失敗記錄。建議至少設個 3 到 5 秒。

第二個坑，path 寫錯。你設了 path 是 /health 但 nginx 沒有 /health 這個路徑，每次檢查都是 404，Pod 會一直被重啟。確認你的 path 是你的應用確實會回 200 的路徑。nginx 的預設根路徑斜線就可以了。

第三個坑，port 寫錯。你的容器 containerPort 是 80，但 Probe 的 port 寫成 8080，那肯定連不上，每次都失敗。port 要跟容器實際監聽的 port 一致。

有做到挑戰題的同學，你建了 Service 然後用 kubectl get endpoints 觀察了嗎？readinessProbe 失敗的時候，那個 Pod 的 IP 會從 endpoints 裡面消失。這就是 K8s 不把流量轉給它的機制。

好，Probe 健康檢查學完了。你的服務現在有了體檢機制，卡死的 Pod 會被自動重啟，還沒準備好的 Pod 不會收到流量。

但是另一個問題來了。你的 Pod 健康了，不代表它是個好公民。想像一下你住在一棟公寓裡，有個鄰居每天用水不關水龍頭，把整棟大樓的水塔抽乾了，其他住戶都沒水用。在 K8s 裡面也一樣，一個 Pod 可以不受限制地吃 CPU 和記憶體，把整台 Node 的資源吃光，其他 Pod 全部受影響。

怎麼限制一個 Pod 能用多少資源？這就是下一個 Loop 的內容。

---

# 影片 7-5：Resource limits 概念 — 一個 Pod 吃光整台機器（~15min）

## 本集重點

- 接 Loop 1：Probe 確保服務健康了，但 Pod 資源不受限
- 場景：一個 Pod 記憶體暴增把整台 Node 吃光，其他 Pod 全掛
- Docker 對照：docker run --memory=128m --cpus=0.5
- K8s 的做法：requests + limits
- requests = 保底（Scheduler 排程依據）
- limits = 天花板（超過 CPU 被限速、超過 Memory 被 OOMKilled）
- 比喻：自助餐預約座位 vs 最多坐幾位
- CPU 單位：1000m = 1 核
- Memory 單位：Mi / Gi
- QoS 三等級：Guaranteed、Burstable、BestEffort
- OOMKilled = Out of Memory Killed

| | requests | limits |
|:---|:---|:---|
| 中文 | 保底 | 天花板 |
| 用途 | Scheduler 排程 | 硬限制 |
| 超過怎樣 | 不會超過（保證給你的） | CPU 限速、Memory OOMKilled |

| QoS | 條件 | 被殺優先順序 |
|:---|:---|:---|
| Guaranteed | requests = limits | 最後被殺 |
| Burstable | requests < limits | 中間 |
| BestEffort | 沒設 | 最先被殺 |

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "64Mi"
  limits:
    cpu: "200m"
    memory: "128Mi"
```

## 逐字稿

好，上一個 Loop 我們用 Probe 解決了健康檢查的問題。Pod 卡死了 K8s 會自動重啟，還沒準備好的 Pod 不會收到流量。但現在有另一個問題。

假設你的 Node 有 4GB 記憶體，上面跑了三個 Pod。Pod A 是你的 API，正常使用 500MB。Pod B 是你的前端，正常使用 200MB。Pod C 是另一個團隊的應用，程式碼有記憶體洩漏的 bug，越跑吃越多。

如果你沒有設任何資源限制，Pod C 會不斷吃記憶體。五分鐘 500MB、十分鐘 1GB、十五分鐘 2GB、二十分鐘 3.5GB。整台 Node 的 4GB 快用完了。這時候 Linux kernel 的 OOM Killer 會出動，它會選一個 process 殺掉來釋放記憶體。

問題是 OOM Killer 不一定殺 Pod C。它可能殺你的 API，可能殺你的前端。你的服務掛了，不是因為你的程式有 bug，而是因為隔壁的 Pod 把資源吃光了。就像公寓裡的鄰居用水不關水龍頭，整棟大樓停水，你也沒水用。

用 Docker 的經驗來想，Docker 的做法很直接。docker run --memory=128m --cpus=0.5 nginx。設一個記憶體上限 128MB，設一個 CPU 上限半核。超過就被限制。

K8s 也可以設上限，但它比 Docker 多了一個概念。K8s 用兩個東西來管資源：requests 和 limits。

requests 是什麼？requests 是保底，你告訴 K8s：我的 Pod 至少需要這麼多資源。K8s 的 Scheduler 在決定把 Pod 放到哪台 Node 的時候，會看 requests。比如你的 Pod requests 是 500MB 記憶體，Node A 剩餘 1GB，Node B 剩餘 300MB。Scheduler 就會把 Pod 放到 Node A，因為 Node B 放不下。requests 就像預約座位，K8s 保證留給你。

limits 是什麼？limits 是天花板，你告訴 K8s：我的 Pod 最多只能用這麼多。超過天花板會怎樣？CPU 和記憶體的處理方式不一樣。

CPU 超過 limits，K8s 會限速。就是把你的 CPU 時間片切小，你的程式會變慢，但不會被殺。這叫 CPU throttling。你的 API 回應時間從 100 毫秒變成 500 毫秒，使用者覺得變慢了，但至少服務還在。

記憶體超過 limits，K8s 會直接殺掉容器。為什麼記憶體不能像 CPU 那樣限速？因為 CPU 時間可以排隊等，記憶體不行。你已經用了 128MB 但你要寫第 129MB 的資料，記憶體就是不夠，沒辦法「等一下再寫」。所以 K8s 只能殺掉你的容器來釋放記憶體。這個狀態叫 OOMKilled，Out of Memory Killed。

用自助餐來比喻。requests 就像你預約了 2 個座位，餐廳保證留給你，就算餐廳客滿了你的 2 個座位也是你的。limits 就像你最多只能坐 4 個座位，就算餐廳很空你也不能佔更多。

來看看資源的單位。CPU 的單位是 millicores，毫核。1 個 CPU 核心等於 1000m。所以 100m 就是 0.1 核，十分之一個核心。500m 就是 0.5 核，半個核心。為什麼用毫核？因為在容器環境裡，很多服務不需要一整個核心，用毫核可以做更精細的分配。

記憶體的單位用 Mi 和 Gi。64Mi 就是 64 MiB，1Gi 就是 1 GiB。注意 K8s 用的是 1024 進位，不是 1000 進位。跟你平常認識的 MB、GB 差不多，但技術上是 MiB、GiB。

YAML 怎麼寫？在 container 底下加 resources。requests 裡面 cpu 設 100m、memory 設 64Mi，表示保底 0.1 核和 64MB 記憶體。limits 裡面 cpu 設 200m、memory 設 128Mi，表示天花板是 0.2 核和 128MB。

對照 Docker，docker run --memory=128m 對應的是 K8s 的 limits.memory。docker run --cpus=0.5 對應的是 limits.cpu 500m。Docker 沒有 requests 的概念。為什麼？因為 Docker 通常就跑在一台機器上，不需要 Scheduler 做跨機器排程。K8s 有多台 Node，Scheduler 要決定 Pod 放哪裡，所以需要 requests 來做排程依據。

好，接下來講一個跟 requests 和 limits 直接相關的機制，叫 QoS，Quality of Service，服務品質等級。

K8s 會根據你怎麼設 requests 和 limits，給每個 Pod 一個 QoS 等級。這個等級決定了當 Node 資源不夠的時候，誰先被犧牲。

三個等級。Guaranteed 是最高級的。條件是容器的 requests 和 limits 都有設，而且值相等。比如 requests cpu 200m、limits cpu 200m，requests memory 128Mi、limits memory 128Mi。你明確告訴 K8s 我就用這麼多，不多不少。K8s 保證給你。資源緊張的時候 Guaranteed 的 Pod 最後才會被犧牲。

Burstable 是中間級的。條件是有設 requests 但 requests 跟 limits 不相等。意思是你平常用這麼多，但高峰期可能用更多。比如 requests cpu 100m、limits cpu 500m。平常用 0.1 核，忙的時候可以用到 0.5 核。

BestEffort 是最低級的。條件是完全沒設 requests 和 limits。K8s 不知道你要用多少資源，對你沒有任何保證。資源緊張的時候你第一個被殺。

生產環境至少要設 requests。讓你的 Pod 是 Burstable 而不是 BestEffort。最好的做法是 requests 和 limits 都設，如果能預估用量就設成一樣的值，這樣你的 Pod 就是 Guaranteed，最不容易被殺。

概念講完了，下一支影片我們來動手觸發一個 OOMKilled。

---

# 影片 7-6：Resource limits 實作 — OOMKilled Demo（~12min）

## 本集重點

- 寫 Pod YAML 設 resources.requests 和 resources.limits
- 用 stress 工具故意吃光記憶體 → 觸發 OOMKilled
- kubectl describe pod → 看到 OOMKilled
- 設合理的 limits → 重新部署 → 正常運行
- kubectl top pods 看資源使用量

學員實作：
- 必做：設 limits → stress 觸發 OOMKilled → 調整 limits
- 挑戰：比較 Guaranteed vs Burstable vs BestEffort 三種 QoS

```yaml
# oom-demo.yaml — 故意觸發 OOMKilled
apiVersion: v1
kind: Pod
metadata:
  name: oom-demo
spec:
  containers:
    - name: stress
      image: polinux/stress
      command: ["stress"]
      args: ["--vm", "1", "--vm-bytes", "256M", "--vm-hang", "1"]
      resources:
        requests:
          cpu: "100m"
          memory: "64Mi"
        limits:
          cpu: "200m"
          memory: "128Mi"
```

```yaml
# resource-ok.yaml — 合理的 limits
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-resource-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-resource
  template:
    metadata:
      labels:
        app: nginx-resource
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: "50m"
              memory: "32Mi"
            limits:
              cpu: "100m"
              memory: "64Mi"
```

```bash
# 觸發 OOMKilled
kubectl apply -f oom-demo.yaml
kubectl get pods oom-demo -w

# 看詳細原因
kubectl describe pod oom-demo

# 清理
kubectl delete pod oom-demo

# 部署正常的 Deployment
kubectl apply -f resource-ok.yaml
kubectl get pods -l app=nginx-resource

# 看資源使用量（需要 metrics-server）
kubectl top pods
```

## 逐字稿

好，概念講完了，我們來親手觸發一個 OOMKilled，感受一下超過記憶體限制會發生什麼事。

建一個檔案叫 oom-demo.yaml。這次我們用一個叫 stress 的工具。stress 是 Linux 上專門用來做壓力測試的工具，可以故意吃 CPU 和記憶體。

apiVersion 是 v1，kind 是 Pod，metadata 的 name 叫 oom-demo。這次我們先用 Pod 不用 Deployment，因為我們想看到原始的 OOMKilled 狀態，不希望 Deployment 自動幫我們重建。

containers 裡面 name 叫 stress，image 用 polinux/stress。command 設 stress，args 設 --vm 1 --vm-bytes 256M --vm-hang 1。翻譯成白話就是：啟動一個 stress worker，吃 256MB 記憶體，然後 hang 住不釋放。

重點來了。resources 裡面 limits 的 memory 只給 128Mi。但我們的程式要吃 256MB。128MB 的限制擋不住 256MB 的需求，一定會被殺掉。requests 的部分設 cpu 100m、memory 64Mi。

好，部署。

kubectl apply -f oom-demo.yaml

馬上用 -w 觀察。

kubectl get pods oom-demo -w

大家仔細看，Pod 啟動之後，stress 工具開始嘗試分配 256MB 記憶體。但 limits 只允許 128MB。超過的瞬間，K8s 馬上殺掉容器。你會看到 STATUS 從 Running 變成 OOMKilled。

然後 K8s 會嘗試重啟。因為這是一個 Pod，restartPolicy 預設是 Always。重啟之後 stress 又嘗試吃 256MB，又被殺，又重啟。幾次之後 STATUS 變成 CrashLoopBackOff。CrashLoopBackOff 的意思是 K8s 發現這個容器一直 crash，開始用退避策略，第一次等 10 秒重啟，第二次等 20 秒，第三次等 40 秒，越等越久，避免無效的反覆重啟浪費資源。

我們來看詳細的記錄。按 Ctrl+C 停止 watch。

kubectl describe pod oom-demo

找到 Containers 下面的 State 和 Last State。你會看到 Last State 顯示 Terminated，Reason 是 OOMKilled，Exit Code 是 137。137 是一個特殊的 exit code，代表被 SIGKILL 信號殺掉的。128 加 9 等於 137，9 就是 SIGKILL。

再看 Events 的部分。你會看到 Back-off restarting failed container 這行。K8s 在告訴你容器一直失敗，已經進入退避重啟模式。

好，在生產環境看到 OOMKilled 代表什麼？兩種可能。第一種，你的 limits 設太小了。你的程式正常需要 256MB，你只給 128MB，當然會被殺。解法是加大 limits。第二種，你的程式有記憶體洩漏。正常應該用 128MB 但因為 bug 越吃越多。解法是修 bug。

先用 kubectl describe pod 確認是 OOMKilled，再用 kubectl top pods 看看正常情況下你的程式實際用多少記憶體，然後決定是加大 limits 還是修 bug。

好，清理掉 OOMKilled 的 Pod。

kubectl delete pod oom-demo

接下來部署一個設了合理 limits 的 Deployment。resource-ok.yaml 裡面是一個 nginx Deployment，requests 設 cpu 50m memory 32Mi，limits 設 cpu 100m memory 64Mi。nginx 正常只用幾 MB 記憶體，64Mi 的 limits 綽綽有餘。

kubectl apply -f resource-ok.yaml

kubectl get pods -l app=nginx-resource

兩個 Pod 都是 Running，RESTARTS 是 0，沒有 OOMKilled。因為 nginx 的實際記憶體使用量遠低於 64Mi 的 limits。

如果你的叢集有 metrics-server，可以用 kubectl top pods 看看每個 Pod 實際的 CPU 和記憶體使用量。

kubectl top pods

你會看到 nginx Pod 的 CPU 大概是 1m 到 2m，Memory 大概是 2Mi 到 5Mi。遠低於我們設的 limits。

接下來是大家的實作時間。必做題：自己寫 oom-demo 的 Pod，設 limits memory 128Mi 但讓 stress 吃 256Mi，觀察 OOMKilled 和 CrashLoopBackOff。然後把 limits 改成 512Mi 重新部署，看到 Pod 正常 Running。挑戰題：建三個不同的 Pod，一個設 requests 等於 limits 是 Guaranteed，一個設 requests 小於 limits 是 Burstable，一個完全不設是 BestEffort。用 kubectl describe pod 看每個 Pod 的 QoS Class 欄位，確認三者不同。大家動手做。

---

# 影片 7-7：回頭操作 Loop 2（~5min）

## 本集重點

- 帶做 Resource limits
- 常見坑：requests 設太大導致 Pending、limits 設太小導致 OOMKilled、忘了設 requests
- 銜接：資源限制有了，但流量暴增怎麼辦？

## 逐字稿

好，回頭確認一下大家的狀態。

先看 oom-demo 的部分。kubectl get pods 看一下，你的 oom-demo Pod 是不是顯示 OOMKilled 或 CrashLoopBackOff？如果是，那就對了。如果你改了 limits 為 512Mi 再部署，Pod 應該是 Running。

再看正常的 Deployment。kubectl get pods -l app=nginx-resource，兩個 Pod 都是 Running，RESTARTS 是 0。

來看幾個常見的坑。

第一個坑，requests 設太大。你的 Node 只有 2GB 記憶體，但你的 Pod requests 設了 4Gi。Scheduler 找不到任何 Node 能放得下這個 Pod，Pod 就會一直 Pending。kubectl describe pod 看 Events 會看到 Insufficient memory 的訊息。解法是把 requests 調小，或者加更多的 Node。

第二個坑，limits 設太小。你的程式正常需要 200MB，但 limits 只給 128Mi。程式一跑起來就超過 limits，馬上被 OOMKilled。這跟我們剛才的 oom-demo 一樣。解法是先看程式實際用多少記憶體，再設合理的 limits。一般建議 limits 設程式實際用量的 1.5 到 2 倍。

第三個坑，完全忘了設 requests 和 limits。Pod 是 BestEffort，資源緊張的時候第一個被殺。而且後面我們要學 HPA，HPA 需要 requests 才能算百分比。忘了設 requests，HPA 就不能用。

做到挑戰題的同學，kubectl describe pod 你的三個 Pod，找 QoS Class 欄位。Guaranteed、Burstable、BestEffort 三個值不同。在 Node 資源緊張的時候，K8s 先殺 BestEffort，再殺 Burstable，最後才殺 Guaranteed。

好，Resource limits 學完了。你的 Pod 現在有了健康檢查不會無聲無息地掛掉，也有了資源限制不會吃光整台機器。

但下一個問題來了。資源限制是靜態的，你給每個 Pod 設了 limits，它不會超過。可是流量暴增的時候，三個 Pod 各自都沒超過 limits，但三個加起來扛不住啊。你需要更多 Pod。

第五堂學過 kubectl scale，可以手動加 Pod。但那是手動的。你得盯著監控圖表，看到 CPU 飆高才去敲指令。凌晨三點流量突然暴增，你在睡覺。等你早上醒來看到一堆告警，使用者已經罵了一整晚了。

有沒有辦法讓 K8s 自動根據 CPU 使用率調整 Pod 的數量？有，這就是下一個 Loop 的 HPA。

---

# 影片 7-8：HPA 概念 — 流量暴增手動 scale 來不及（~15min）

## 本集重點

- 接 Loop 2：Resource limits 設好了，但三個 Pod 扛不住流量暴增
- 第五堂的 kubectl scale 是手動的，來不及
- HPA = Horizontal Pod Autoscaler：根據 CPU/Memory 自動調整副本數
- Docker 對照：docker compose up --scale web=10（手動）
- HPA YAML 拆解：scaleTargetRef、minReplicas、maxReplicas、targetCPUUtilizationPercentage
- HPA 工作流程：每 15 秒檢查 → 超過目標值 → 加 Pod → 降下來 → 縮 Pod
- 前提：Pod 必須設 resources.requests
- 需要 metrics-server（k3s 內建）
- 縮容冷卻期 5 分鐘

| Docker | K8s |
|:---|:---|
| docker compose up --scale web=10 | kubectl scale（手動） |
| 沒有自動 scale | HPA（自動 scale） |

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-resource-demo
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```

## 逐字稿

好，上一個 Loop 我們設好了 Resource limits。每個 Pod 有保底有天花板，不會吃光整台機器的資源。但是我現在要跟大家描述另一個場景。

想像你的電商網站。平常日子裡，兩三個 Pod 就夠用了。CPU 使用率大概在 30% 左右，很悠閒。結果雙十一來了，零點一到，流量瞬間翻了十倍。你的三個 Pod 每個 CPU 都飆到 100%，請求開始排隊，回應時間從 100 毫秒暴增到 5 秒，然後開始超時。使用者不斷重試，流量更大，雪崩效應。

你手邊有武器啊。第五堂學了 kubectl scale deployment my-app --replicas=10，把副本數加到 10 個。但問題是你怎麼知道什麼時候該加？你不可能 24 小時盯著 Grafana 的 CPU 圖表吧。凌晨三點流量暴增，你在睡覺。等你七點起床看到告警，使用者已經罵了四個小時了。

然後雙十一結束了，流量回到正常。十個 Pod 閒在那裡什麼事都沒做，但 CPU 和記憶體還是佔著。你忘了把 replicas 調回來，白白浪費資源。

手動 scale 有兩個根本問題。第一，反應太慢，你不可能即時反應。第二，容易忘記縮回來，浪費資源。

Docker Compose 也有 scale 的功能，docker compose up --scale web=10，但一樣是手動的。

K8s 提供了一個自動化的方案，叫 HPA，Horizontal Pod Autoscaler，水平 Pod 自動擴縮器。

HPA 做的事情用一句話說就是：監控 Pod 的 CPU 使用率，超過你設的閾值就自動加 Pod，低於閾值就自動減 Pod。全自動，不需要人介入。

HPA 的工作流程是這樣的。它每 15 秒去問 metrics-server：目前每個 Pod 的 CPU 使用率是多少？拿到數據之後做計算。如果平均 CPU 使用率超過你設的目標值，比如 50%，HPA 就會增加 Pod 的數量。新的 Pod 啟動之後，流量分攤到更多 Pod 上面，每個 Pod 的 CPU 使用率就降下來了。

當流量降下來之後，CPU 使用率也跟著降。HPA 發現 CPU 低於目標值了，但它不會馬上縮 Pod。它會等一段冷卻期，預設是 5 分鐘。為什麼要等？因為怕流量只是暫時降了一下馬上又上來。如果一降就縮、一升就擴，Pod 會不斷地被建立又被刪除，這叫抖動，對系統穩定性不好。等了 5 分鐘確認流量真的穩定了，HPA 才會開始縮減 Pod 數量。

來看 YAML 怎麼寫。apiVersion 是 autoscaling/v2，kind 是 HorizontalPodAutoscaler，metadata name 叫 nginx-hpa。

spec 裡面第一個重點是 scaleTargetRef。它告訴 HPA 要擴縮哪個 Deployment。apiVersion 是 apps/v1，kind 是 Deployment，name 是 nginx-resource-demo，就是我們上一個 Loop 建的那個 nginx Deployment。

minReplicas 設 2，表示最少保持 2 個 Pod。就算流量再低，也不會縮到 1 個或 0 個。為什麼？因為如果只剩一個 Pod，那個 Pod 掛了就完全沒有服務了。保持最少 2 個是基本的高可用。

maxReplicas 設 10，表示最多擴到 10 個 Pod。為什麼要設上限？因為你的 Node 資源有限。如果不設上限，HPA 可能擴到 100 個 Pod，但你的 Node 只有兩台，放不下 100 個 Pod。maxReplicas 要根據你的 Node 總資源來設。

metrics 裡面設定擴縮的依據。type 是 Resource，resource name 是 cpu，target type 是 Utilization，averageUtilization 設 50。意思是當所有 Pod 的平均 CPU 使用率超過 50% 的時候就擴容。這裡的 50% 是相對於 requests 的 50%。如果你的 Pod requests cpu 是 100m，那 50% 就是 50m。當 Pod 的平均 CPU 使用量超過 50m 的時候，HPA 就會加 Pod。

這就是為什麼上一個 Loop 我一直強調要設 requests。HPA 算的是百分比。百分比需要一個分母。分母就是 requests。如果你沒設 requests，HPA 不知道 100% 是多少，就沒辦法算百分比，HPA 就不會動。

除了寫 YAML 之外，你也可以用一行指令建 HPA。kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu-percent=50。效果一模一樣。

最後一個前提。HPA 需要 metrics-server 才能取得 Pod 的 CPU 使用量。metrics-server 是一個在 kube-system namespace 裡跑的元件，它收集所有 Pod 和 Node 的資源使用數據。如果你用的是 k3s，好消息，k3s 內建了 metrics-server，不用額外安裝。如果你用的是 minikube，需要執行 minikube addons enable metrics-server 來啟用它。

概念講完了，下一支影片我們來壓測，親眼看 HPA 自動擴容。

---

# 影片 7-9：HPA 實作 — 壓測觸發擴容（~15min）

## 本集重點

- 確認 metrics-server 在跑
- 用上一個 Loop 的 nginx Deployment（有設 requests）
- 建 Service（壓測需要 DNS 名稱）
- kubectl autoscale 或 apply HPA YAML
- kubectl get hpa → 看 TARGETS
- 用 busybox 跑 while true wget 壓測
- kubectl get hpa -w + kubectl get pods -w 看擴容過程
- 停止壓測 → 等幾分鐘 → 自動縮回來
- kubectl describe hpa → Events 看 scale up/down

學員實作：
- 必做：建 HPA → 壓測看擴容 → 停止看縮容
- 挑戰：改 targetCPU 為 30% → 看到更早觸發擴容

```bash
# Step 0：確認 metrics-server
kubectl get pods -n kube-system -l k8s-app=metrics-server
kubectl top nodes
kubectl top pods

# Step 1：確認 Deployment + 建 Service
kubectl get deploy nginx-resource-demo
kubectl expose deployment nginx-resource-demo \
  --port=80 --target-port=80 --name=nginx-resource-svc

# Step 2：建 HPA
kubectl autoscale deployment nginx-resource-demo \
  --min=2 --max=10 --cpu-percent=50
kubectl get hpa

# Step 3：壓測（另開終端機）
kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- \
  sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"

# Step 4：觀察（原本終端機）
kubectl get hpa -w
kubectl get pods -l app=nginx-resource -w

# Step 5：停止壓測 → 等 5 分鐘 → 看縮容
# Ctrl+C 停止壓測 Pod
kubectl get hpa -w

# 看 HPA Events
kubectl describe hpa nginx-resource-demo
```

## 逐字稿

好，概念講完了，我們來親眼看 HPA 自動擴容。這個實驗非常有感覺，大家一定要跟著做。

首先確認 metrics-server 有在跑。

kubectl get pods -n kube-system

找 metrics-server 相關的 Pod，確認是 Running。如果你用 k3s，它內建了 metrics-server，應該已經在跑了。如果是 minikube，先執行 minikube addons enable metrics-server，等它跑起來。

確認之後，打一下 kubectl top nodes 和 kubectl top pods。如果能看到 CPU 和 MEMORY 的數字，表示 metrics-server 正常運作。如果看到 error: Metrics API not available，表示 metrics-server 還沒準備好，等一兩分鐘再試。

好，接下來確認上一個 Loop 建的 nginx Deployment 還在。

kubectl get deploy nginx-resource-demo

如果你之前清掉了，重新 apply 一下 resource-ok.yaml。記住那個 Deployment 有設 resources.requests，這是 HPA 的前提。

然後建一個 Service。壓測的時候我們要透過 Service 的 DNS 名稱去打流量，不用記 Pod 的 IP。

kubectl expose deployment nginx-resource-demo --port=80 --target-port=80 --name=nginx-resource-svc

好，現在建 HPA。用一行指令最快。

kubectl autoscale deployment nginx-resource-demo --min=2 --max=10 --cpu-percent=50

翻譯成白話：幫 nginx-resource-demo 這個 Deployment 建一個 HPA，最少保持 2 個 Pod，最多擴到 10 個，CPU 超過 50% 就擴。

看看 HPA 的狀態。

kubectl get hpa

你會看到一行，NAME 是 nginx-resource-demo，REFERENCE 是 Deployment/nginx-resource-demo，TARGETS 可能顯示 1%/50% 或 unknown/50%。斜線前面是目前的 CPU 使用率，後面是目標值。如果是 unknown，表示 metrics-server 還在收集數據，等 30 秒到一分鐘就會有數字了。MINPODS 是 2，MAXPODS 是 10，REPLICAS 是 2。一切正常。

好，重頭戲來了。我們要模擬流量暴增。

開另一個終端機，跑一個壓測 Pod。

kubectl run load-test --image=busybox:1.36 --rm -it --restart=Never -- sh -c "while true; do wget -qO- http://nginx-resource-svc > /dev/null 2>&1; done"

這個指令做了什麼？它建了一個 busybox Pod，在裡面跑一個無限迴圈，不斷用 wget 去打 nginx Service。每秒鐘幾十次甚至上百次請求，模擬流量暴增。--rm 表示結束後自動刪掉這個 Pod。-it 表示互動模式，你可以用 Ctrl+C 停止。

壓測開始了。回到原本的終端機，觀察 HPA。

kubectl get hpa -w

注意看 TARGETS 欄位。CPU 使用率會慢慢上升。從 1% 到 20% 到 40% 到 60%。當它超過 50% 的時候，REPLICAS 欄位就會開始增加。2 變 3、3 變 4。

你也可以同時觀察 Pod 的變化。開第三個終端機。

kubectl get pods -l app=nginx-resource -w

你會看到新的 Pod 一個一個冒出來。Pending、ContainerCreating、Running。HPA 正在自動加 Pod。

流量分攤到更多 Pod 上面之後，每個 Pod 的 CPU 使用率就降下來了。如果降到 50% 以下，HPA 就暫時不再擴容。但壓測還在跑，所以 CPU 可能在 50% 附近波動。

好，壓測跑個兩三分鐘，讓大家好好感受一下自動擴容的過程。現在回到壓測的終端機，按 Ctrl+C 停止壓測。

停止壓測之後，回到 HPA 的 watch。CPU 使用率會慢慢降下來。1%、0%。但 REPLICAS 不會馬上縮回 2。記得我剛才說的嗎？HPA 有 5 分鐘的縮容冷卻期。它要確認流量真的穩定下來了才會縮。

等大概 5 分鐘，你會看到 REPLICAS 開始減少。從 6 變 5、5 變 4、4 變 3、3 變 2。最終回到 minReplicas 設的 2 個。

按 Ctrl+C 停止 watch。我們來看 HPA 的 Events。

kubectl describe hpa nginx-resource-demo

找到 Events 的部分。你會看到幾行關鍵記錄。New size: 3; reason: cpu resource utilization (percentage of request) above target。New size: 4。New size: 5。然後過了幾分鐘，New size: 4; reason: All metrics below target。New size: 3。New size: 2。

完整的擴容和縮容過程都記錄在 Events 裡面。生產環境排查 HPA 問題的時候，kubectl describe hpa 是最重要的指令。

最後整理一下整個流程。你設了 HPA 的目標是 CPU 50%。壓測開始，CPU 飆高，HPA 自動加 Pod。壓測停止，CPU 降低，等冷卻期之後 HPA 自動減 Pod。全程不需要人介入。

接下來是大家的實作時間。必做題：建 HPA，用 busybox 壓測，看到自動擴容，停止壓測看到自動縮容。挑戰題：刪掉 HPA 重新建一個，但 targetCPU 改成 30%。你會發現擴容觸發得更早，因為 30% 的閾值更低，更容易達到。大家動手做。

---

# 影片 7-10：回頭操作 + 上午總結（~5min）

## 本集重點

- 帶做 HPA
- 常見坑：忘了設 requests、metrics-server 沒裝、TARGETS 一直 unknown
- 上午總結：Probe → Resource limits → HPA 三條因果鏈
- 下午預告：RBAC + NetworkPolicy + 從零建完整系統

## 逐字稿

好，最後回頭確認一下大家的 HPA 做到了。

kubectl get hpa 看一下。你的 HPA 有建好嗎？TARGETS 欄位有數字不是 unknown 嗎？壓測的時候有看到 REPLICAS 增加嗎？

來看幾個常見的坑。

第一個坑，忘了設 requests。這是最常見的。你的 Deployment 沒有設 resources.requests，HPA 建是建了，但 TARGETS 一直顯示 unknown，因為 HPA 不知道 100% 是多少，算不出百分比。解法是回去 Deployment 的 YAML 加上 resources.requests。

第二個坑，metrics-server 沒裝或沒正常運作。kubectl top pods 如果顯示 error: Metrics API not available，就是 metrics-server 的問題。k3s 通常內建了，minikube 要用 minikube addons enable metrics-server 啟用。啟用之後等一兩分鐘讓它跑起來。

第三個坑，TARGETS 顯示 unknown/50%，前面一直是 unknown。可能是 metrics-server 剛啟動還在收集數據。等 30 秒到一分鐘通常就會有數字了。如果等了五分鐘還是 unknown，檢查 metrics-server 的 Pod 有沒有在跑，然後看它的 logs 有沒有錯誤。

好，上午的三個 Loop 全部結束了。我們用幾句話串一下今天上午的因果鏈。

起點是第六堂結束的狀態。你的服務穿上了正式的衣服，域名有了、設定分離了、資料持久了。看起來很體面，但生產環境會考驗你。

第一個問題，Pod Running 但服務卡死。K8s 不知道你的服務到底正不正常。所以我們學了 Probe。livenessProbe 偵測死亡然後重啟，readinessProbe 偵測未就緒然後不導流量，startupProbe 給慢啟動的應用一個緩衝期。

第二個問題，一個 Pod 吃光整台機器的資源。所以我們學了 Resource limits。requests 是保底讓 Scheduler 做排程，limits 是天花板防止資源被吃光。超過 CPU 被限速，超過記憶體被 OOMKilled。QoS 三個等級決定誰先被犧牲。

第三個問題，流量暴增手動 scale 來不及。所以我們學了 HPA。根據 CPU 使用率自動擴縮 Pod 數量。流量大就加 Pod，流量小就減 Pod。全自動，不需要人介入。

三個概念一條因果鏈：Probe 確保服務健康 → Resource limits 確保資源公平 → HPA 確保容量彈性。

下午我們繼續這條鏈。

下一個問題：你的叢集上每個人都有 admin 權限。實習生不小心打了 kubectl delete namespace production，整個生產環境消失。怎麼辦？RBAC 權限控制。

再下一個：你的叢集裡面所有 Pod 都能互相連。前端 Pod 可以直接連資料庫。如果前端被入侵了，攻擊者可以直接打資料庫。怎麼辦？NetworkPolicy 網路隔離。

最後，我們會從零開始建一套完整的系統，把四堂課學的所有東西全部串在一起。Deployment、Service、Ingress、ConfigMap、Secret、PVC、Probe、Resource limits、HPA，一次用上。

好，大家先休息一下，吃個午飯。下午一點我們繼續。
