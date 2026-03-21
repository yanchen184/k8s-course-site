# Day 3 第十五小時：用 Docker 手動模擬 Kubernetes 核心機制

---

## 一、為什麼在 Day 3 最後加這堂（5 分鐘）

好，各位同學，Compose 實戰做完之後，我想多帶大家做一個非常重要的收尾。

今天 Day 3 從早到晚，你們其實已經把很多 Kubernetes 的前置能力都學完了，只是還沒有用 Kubernetes 這個名字去看它。

Hour 8，我們學了 Volume，知道容器本身是暫時的，重要資料不能只放在容器的讀寫層裡。這件事很重要，因為之後你們學 Kubernetes 的時候，會看到同樣的問題只是名字換成 PV、PVC、StatefulSet。

Hour 9，我們學了容器網路、自訂 network、DNS、Port Mapping。這也是 Kubernetes 的核心前置知識，因為 K8s 裡的 Service、Ingress、Pod-to-Pod 通訊，本質上都在解決「服務怎麼互相找到對方」這件事。

Hour 10 到 Hour 12，你們學了 Dockerfile，學會自己 build image、打版本、最佳化映像檔。這也非常重要，因為 Kubernetes 不會幫你取代 image。K8s 管的是執行和調度，不是幫你寫 Dockerfile。你最終仍然是把 image 丟給 K8s 去跑。

Hour 13 到 Hour 14，我們用 Compose 管理多個服務，開始接近「編排」的感覺。你可以把多個 container、network、volume、environment 集中在一個檔案裡描述。這個思路已經非常接近 Kubernetes 了，只是 Compose 大多在單機上工作，而 K8s 是多機、分散式、可自癒的系統。

所以這最後一小時，我不想急著塞你們 `kubectl` 或 YAML。我想做一件更重要的事：**讓你親眼看懂 Kubernetes 平常到底在幫你做什麼。**

今天這堂課的關鍵句，請大家先記起來：

> Docker 解決「怎麼跑一個服務」
> Kubernetes 解決「怎麼管理很多個服務」

這堂課不會教新的 Docker 指令。相反地，我們會故意用你今天已經會的 Docker 能力，手動做一次 K8s 會自動幫你做的事。做完之後，你明天看到 Pod、Deployment、Service、rolling update、self-healing，就不會覺得它們是陌生黑魔法，而會覺得：「喔，原來 K8s 是把我剛剛那些麻煩事接手去做了。」

先看一下這一小時的結構：

| 時間 | 主題 | 你要看懂什麼 |
|------|------|-------------|
| 0–5 | 為什麼要加這堂 | Day 3 和 Day 4 的橋接關係 |
| 5–15 | 建立最小 Web App | image / container / version tag |
| 15–25 | 多副本 | replicas 的意義 |
| 25–40 | Nginx 分流 | Service / Ingress / load balancing |
| 40–50 | Rolling update | 版本更新怎麼從手動走向自動 |
| 50–55 | Self-healing | 為什麼 Docker 還是得人盯 |
| 55–60 | K8s 對照 | 明天正式進 K8s 前的心智模型 |

今天的定位非常清楚：**讓你看懂 Kubernetes 在做什麼，不是背指令。**

---

## 二、建立最小 Web App（10 分鐘）

### 2.1 用 Day 3 的 Dockerfile 思維建立 image

先來做一個極簡的服務。這裡我們故意不用複雜的應用，因為我們今天的重點不是 FastAPI 本身，而是讓回應裡能看到兩個關鍵資訊：

1. 這個請求是誰回的，也就是 `hostname`
2. 它是什麼版本，也就是 `version`

`app.py`

```python
from fastapi import FastAPI
import socket

app = FastAPI()


@app.get("/")
def read_root():
    return {
        "hostname": socket.gethostname(),
        "version": "v1",
    }
```

這個 API 超級簡單，只有一個 `/` 路由，回傳目前 container 的 hostname 和版本號。等等你們會發現，這兩個欄位會讓很多抽象概念瞬間變具體。

接著是依賴檔：

`requirements.txt`

```txt
fastapi
uvicorn
```

再來 Dockerfile：

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY . .

RUN pip install fastapi uvicorn

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

這裡沒有刻意做最佳化，因為今天重點不是 Dockerfile best practices，而是讓大家用最快速度得到一個可以 build、可以 run、可以換版本的服務。

但是我還是要提醒你們，這裡其實正好呼應今天前半段：

- `FROM python:3.12-slim`：這是你們學過的 base image 選擇
- `WORKDIR /app`、`COPY . .`：這是 build context 的最基本概念
- `CMD [...]`：這是容器啟動時真正執行的程序

也就是說，這不是一個額外的主題，而是把 Hour 10 到 Hour 12 的能力拿來真正接到後面的編排與升級情境。

### 2.2 build + run

先把 image build 出來：

```bash
docker build -t demo-web:v1 .
```

這時候你會得到一個版本叫 `v1` 的 image。請注意這個 version tag，等等 rolling update 就靠它。

接著跑起來：

```bash
docker run -d --name demo-preview -p 18080:8000 demo-web:v1
curl http://localhost:18080
docker rm -f demo-preview
```

預期你會看到類似：

```json
{
  "hostname": "4ab7f0d9d8c1",
  "version": "v1"
}
```

這裡先停一下，講三個重點：

第一，**image 是模板**。`demo-web:v1` 不是服務本身，而是跑服務的模板。

第二，**container 是執行中的實例**。你現在打 `docker run`，是從模板建立了一個活的實例。

第三，**version tag 不是裝飾，是升級策略的基礎**。如果你的 image 永遠都叫 `latest`，等一下根本沒辦法清楚展示更新前後的狀態。實務上你要有清楚版本。

這一段看起來只是暖身，但它其實把明天 K8s 很多概念的地基鋪好了：K8s 不會取代 image，不會幫你建 code，不會幫你省略版本管理。它做的是拿既有 image 去大規模、穩定地執行。

最後把 `demo-preview` 清掉也很重要。因為等等我們要把 `8080` 留給 Nginx，並且改用 `web1`、`web2`、`web3` 這種有名字的副本來繼續後面的示範流程。這樣整堂課會是一條連續的 demo 線，不會互相搶資源。

---

## 三、多副本 = 手動 replicas（10 分鐘）

### 3.1 啟動三個副本

好，現在我們先做一件很多團隊都會做的事：**把同一個服務開成多份副本。**

```bash
docker run -d --name web1 demo-web:v1
docker run -d --name web2 demo-web:v1
docker run -d --name web3 demo-web:v1

docker ps
```

你會看到三個 container，都來自同一個 image `demo-web:v1`。

這裡請大家腦中直接翻譯成：

```txt
replicas = 3
```

### 3.2 這時候要點破的事

這三個副本的存在，本身沒有問題。你用 Docker 完全可以做到。但是它現在只是「三個分散存在的 container」，還不是一個真正被系統管理的服務。

為什麼這麼說？

因為現在有幾個問題還沒解決：

1. 外部要怎麼統一打到它們？
2. 流量要怎麼分給三個副本？
3. 少一個副本時，誰會補？
4. 升級時誰決定先換哪一個？

也就是說，多開副本只是第一步，真正麻煩的是**副本的生命週期管理**。

我們可以直接做個對照：

| 現在手動做的事 | Kubernetes 會怎麼做 |
|---------------|-------------------|
| 你自己決定開三個 container | 你宣告副本數，Controller 自動維持 |
| 你自己記住哪三個名字 | 系統自己追蹤目前存活的 Pod |
| 你自己發現少一個了 | 系統自動比對期望值與實際值 |

這裡就是第一個 K8s 心智模型：

> Docker 讓你「有能力開三個」
> Kubernetes 讓你「不用一直自己盯著三個有沒有還在」

很多同學第一次學 K8s 會被 `replicas: 3` 這種 YAML 看起來很普通的設定迷惑，覺得「不就只是三嗎？」不是。重點從來不在數字，而在於**誰來持續保證這個數字成立。**

好，接下來我們要把這三個副本串成一個有統一入口的服務，這才會開始接近 K8s 的 Service 心智模型。

---

## 四、自訂網路 + Nginx 分流（15 分鐘）

### 4.1 建立內部網路

這一段直接回扣 Hour 9。今天上午你們學過，自訂 network 的重點不是只是「多一條網路」，而是有容器名稱 DNS、可控的隔離、可預期的互連。

先建立網路：

```bash
docker network create demo-net
```

然後把三個副本放進去：

```bash
docker network connect demo-net web1
docker network connect demo-net web2
docker network connect demo-net web3
```

這裡我不重新建立副本，而是把剛剛已經跑起來的 `web1`、`web2`、`web3` 直接接進 `demo-net`。這樣示範流程才是連續的，也不會因為重複建立同名 container 而撞錯。

為什麼一定要放進自訂 network？因為等等我們不想靠手動查 IP 連服務。我們要直接用容器名稱 `web1`、`web2`、`web3`。這就是今天早上你們學過的 DNS 能力。

### 4.2 用 Nginx 做統一入口

現在我們需要一個「外部入口」，讓外面的請求打進來時，不用知道後面是哪個副本。

`nginx.conf`

```nginx
events {}

http {
    upstream backend {
        server web1:8000;
        server web2:8000;
        server web3:8000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
        }
    }
}
```

這個設定大家應該已經不陌生了。Hour 13、Hour 14 在 Compose 的例子裡，你們其實已經一直看到 Nginx 反向代理扮演入口的角色。

現在啟動 Nginx：

```bash
docker run -d \
  --name nginx \
  --network demo-net \
  -p 8080:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx
```

這行指令也很有意思，它把 Day 3 很多內容全串在一起了：

- `--network demo-net`：來自 Hour 9
- `-p 8080:80`：Port Mapping
- `-v ...:ro`：用 bind mount 掛設定檔，來自 Hour 8
- `nginx` 當 proxy：來自 Hour 13-14 多服務架構

所以這堂不是在插一個離題的東西，而是在把 Day 3 的知識收束成一個「為什麼最後會走到 K8s」的證明。

### 4.3 驗證負載分流

現在打幾次：

```bash
curl http://localhost:8080
curl http://localhost:8080
curl http://localhost:8080
```

你很可能會看到：

```json
{"hostname":"web1","version":"v1"}
{"hostname":"web2","version":"v1"}
{"hostname":"web3","version":"v1"}
```

或者順序不同，但重點是 `hostname` 在換。

這一刻一定要停下來講：

> 你現在已經親眼看到「一個入口，後面三個副本，流量被分出去」這件事了。

這就是很多人第一次理解 K8s Service 的關鍵瞬間。Service 不是憑空冒出來的神祕物件，它是在幫你做一件你手動也做得到、但做得很累、很脆弱的事情。

### 4.4 對照 K8s

把現在畫成對照表：

| 現在手動做的事 | K8s 對應 |
|---------------|----------|
| `web1 / web2 / web3` | Pods |
| `demo-net` 內部互通 | Cluster 內部網路 |
| Nginx upstream | Service / Ingress 前的流量入口 |
| 入口後面分流到多副本 | Load balancing |

但這裡也要誠實告訴學生：**這個做法有侷限。**

因為你現在 upstream 裡面寫死了三個名字：

```nginx
server web1:8000;
server web2:8000;
server web3:8000;
```

如果今天副本從 3 變 8，要不要改設定？要。

如果某個副本死掉又換成別的名稱，要不要調整？可能要。

如果這些副本分散到多台機器上，這份靜態設定會不會開始變難維護？一定會。

這就是為什麼在 K8s 裡，你不想自己維護 upstream。你想要的是系統根據當前健康的 Pod 自動更新後端清單。這正是 Service、Endpoints、kube-proxy 在幫你做的事情。

所以這裡的重點不是「Nginx 等於 K8s」，而是：

> Nginx + 手動 upstream 讓你先看懂「流量入口 + 後端副本」這件事
> K8s 則把這件事變成自動維護

---

## 五、Rolling Update（10 分鐘）

### 5.1 把版本改成 v2

接下來我們要模擬另一件 K8s 最常被提到的事：**rolling update。**

先把 `app.py` 的版本字串改掉：

```python
"version": "v2"
```

重新 build：

```bash
docker build -t demo-web:v2 .
```

這裡請你們注意，今天前半段學 Dockerfile，如果只把它當成「能 build 成功」就太可惜了。更重要的是，Dockerfile + image tag 其實是整個發佈流程的起點。沒有清楚版本，你後面的更新、回滾、比對都會一團亂。

### 5.2 手動做一次滾動更新

我們先換一個副本：

```bash
docker stop web1 && docker rm web1
docker run -d --name web1 --network demo-net demo-web:v2
```

這時候如果你再去 `curl`，你可能會看到：

```json
{"hostname":"web1","version":"v2"}
{"hostname":"web2","version":"v1"}
{"hostname":"web3","version":"v1"}
```

也就是說，服務還在，但後端已經進入「新舊版本共存」的狀態。

接著你再依序更新 `web2`、`web3`，最後全部變成 `v2`。

### 5.3 這段一定要講的事

很多人第一次聽 rolling update，會以為它是很高深的新技術。其實不是。它的本質很樸素：

1. 先不要一次把所有舊版停掉
2. 慢慢把新版補上來
3. 確保服務持續可用
4. 最後完成版本切換

這就是 rolling update 的全部精神。

但問題是，用 Docker 手動做這件事，會非常累：

- 你要自己決定先換誰
- 你要自己確認新版本有沒有正常起來
- 你要自己避免所有副本同時被拔掉
- 你要自己記得如果出事要怎麼回退

所以我們直接做對照：

| Docker 手動做法 | K8s 做法 |
|----------------|---------|
| 自己選擇更新順序 | Deployment 控制 rollout |
| 自己避免服務同時中斷 | `maxUnavailable` / `maxSurge` |
| 自己判斷新版本能不能接流量 | readiness / rollout status |
| 出事自己重跑舊版 | rollout undo |

這一段也是明天學 Deployment 時最好的鋪陳。因為明天當你們看到 Deployment 的 update strategy、rollout status、rollout undo，就不會只是在背功能，而是知道它們在取代什麼痛苦。

---

## 六、Self-healing 的缺口（5 分鐘）

### 6.1 故意打掉一個副本

最後我們來做最有戲劇效果的一段。

```bash
docker stop web2
```

然後我會直接問學生：

> 誰會幫你補？

答案非常殘酷：**沒人。**

你可以有 image、可以有副本、可以有 proxy、可以有網路，但只要你今天還是在純 Docker 手動管，那副本少了，就是少了。除非有人發現、有人處理，不然它不會自己回來。

### 6.2 手動補回去

```bash
docker rm web2
docker run -d --name web2 --network demo-net demo-web:v2
```

這裡學生通常會立刻感覺到差異，因為前面你已經做了很多「看起來很像平台」的事，但這一刻會發現，平台感只是表面，真正的自動維持還不存在。

### 6.3 最重要的一句話

這裡我會直接收斂成一句：

> Docker：你在管系統
> Kubernetes：系統在幫你管

這句話非常值得記。

因為很多人學 K8s 卡住，不是卡在語法，而是卡在沒有先感受到「手動管理到底有多麻煩」。如果沒有先痛一次，就不會理解 K8s 的價值。

這就是今天這堂橋接課存在的原因。

---

## 七、Docker → K8s 對照 + Day 4 銜接（5 分鐘）

### 7.1 把今天手動做的事翻成 K8s 語言

我們現在把整堂課翻譯一次：

| 今天手動做的事 | K8s 裡的名字 |
|---------------|-------------|
| `docker run` 跑一個服務 | Pod |
| 手動開三個副本 | Deployment / ReplicaSet |
| Nginx upstream 做統一入口 | Service / Ingress |
| 手動換 `v1 -> v2` | Rolling update |
| 手動補回掛掉的副本 | Self-healing |
| Named volume 存資料 | PV / PVC |

這一張表是今天最重要的結論之一。

因為它告訴你：Kubernetes 並不是從零發明一套全新的世界，而是把你今天已經會的容器能力，提升到「跨服務、跨機器、持續維持期望狀態」的層次。

### 7.2 最重要的收尾句

請大家最後記住這兩句：

> Kubernetes 本質不是全新魔法
> 是把你剛剛手動做的事情「自動化 + 宣告化」

所謂**宣告化**，意思是你不再告訴系統每一步怎麼做，而是告訴它你要的結果。例如：

- 我想要 3 個副本
- 我想要對外有一個穩定入口
- 我想要升級時不中斷
- 我想要壞掉的副本自動補回

K8s 會持續把系統拉回你宣告的狀態。這個思想，才是明天真正要學的東西。

### 7.3 接 Day 4

所以明天進 Kubernetes 時，你們會看到：

- `Pod`：對應你今天手動跑的一個服務實例
- `Deployment`：對應你今天手動維持副本、手動更新版本
- `Service`：對應你今天用 Nginx + network 才拼出來的穩定入口

也就是說，明天不是從零開始，而是把你今天手動做過的事，交給一個真正的編排系統。

最後我再幫大家把 Docker 三天課程收成一句話：

- Day 2：學會把服務放進容器
- Day 3：學會把容器做成可部署、可串接、可維護的系統
- Hour 15：看懂為什麼下一步會走向 Kubernetes

好，今天 Day 3 就到這裡。明天我們不用再自己手動管 `web1`、`web2`、`web3` 了，明天開始交給 K8s。大家休息一下，準備進入正式的 Kubernetes 世界。

---

## 板書 / PPT 建議

1. Day 3 能力到 Hour 15 的對照表
2. `demo-web:v1` → 三副本 → Nginx → `v2` 的完整流程圖
3. 手動 replicas / routing / update / healing 與 K8s 自動化對照圖
4. Rolling update 的新舊版本切換示意圖
5. Self-healing 問答圖：副本少了誰補？
6. Docker → K8s 對照總表
7. Day 4 預告：Pod / Deployment / Service
