# Day 3 第十四小時：Docker Compose 實戰練習 + 課程總結

---

## 一、開場（3 分鐘）

好，各位同學，歡迎來到我們整個 Docker 課程的最後一堂課。

經過三天高密度的學習，我知道大家應該都有點累了。但是，這堂課非常重要，因為我們要把上堂課學到的 Docker Compose 所有知識，用三個練習題全部練一遍。

上堂課我們學了什麼？Docker Compose 的完整知識——compose.yaml 語法、環境變數管理、自訂網路隔離、depends_on 搭配 healthcheck、build 整合、WordPress 四服務實戰、環境分離。內容量很大，但光聽不練是不夠的。

今天的安排：

| # | 題目 | 難度 | 時間 |
|---|------|:---:|:---:|
| 1 | Nginx + API + PostgreSQL 基本 Compose | ★ | 15 分鐘 |
| 2 | 加入 .env + healthcheck + 網路隔離 | ★★ | 20 分鐘 |
| 3 | Code Review：找出 5 個問題 | ★★★ | 25 分鐘 |

做完練習之後，我們會做一個完整的課程總結，然後展望一下 Kubernetes 的方向。

準備好了嗎？那我們開始。

---

## 二、練習一：三服務 Compose（15 分鐘）★

### 2.1 題目說明（3 分鐘）

好，第一題。暖身題。

題目很直接：寫一個 `compose.yaml`，包含三個服務：

**第一個，nginx** — 反向代理，對外 port 8080。用 `nginx:alpine`。

**第二個，api** — 這裡我們先不自己寫 API，用 `httpd:alpine` 來模擬。httpd 就是 Apache HTTP Server，它會自動回傳一個預設的歡迎頁面，夠用了。

**第三個，db** — PostgreSQL 資料庫，port 5432。

要求：
1. 設定 ports
2. PostgreSQL 用 named volume 持久化
3. 設定 `POSTGRES_PASSWORD` 環境變數（PostgreSQL 必填的）
4. 設定基本的 `depends_on`

做完之後，驗證：
- `docker compose ps` 三個服務都 Up
- `curl http://localhost:8080` 看到頁面
- `docker compose exec db psql -U postgres -c "SELECT 1;"` 能連上資料庫

就這樣，不需要 healthcheck，不需要 .env，不需要 network 隔離。最基本的 compose.yaml。

好，時間開始。大家有 12 分鐘。

### 2.2 給學生做題（12 分鐘）

（講師巡場，觀察學生進度）

常見問題：
- 「PostgreSQL 起不來」→ 檢查有沒有設 `POSTGRES_PASSWORD`，這是必填的
- 「curl localhost:8080 連不到」→ 檢查 nginx 的 ports 設定，確認是 `"8080:80"`
- 「不知道 PostgreSQL 的 volume 要掛哪裡」→ `/var/lib/postgresql/data`，Docker Hub 文件有寫

### 2.3 講解參考答案（5 分鐘）

好，時間到。我們來看參考答案。

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: httpd:alpine
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret123
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  db-data:
```

我來說幾個重點。

**nginx** — `ports: "8080:80"`，把主機的 8080 對應到 Nginx 的 80。`depends_on: - api` 讓 api 先啟動。

**api** — 用 `httpd:alpine`，不需要設 port，因為在這個範例裡我們沒有直接對外暴露 api 的 port。api 和 nginx 在同一個 default network 裡，nginx 可以用 service name `api` 連到它。

**db** — `POSTGRES_PASSWORD: secret123` 是必填的，不設 PostgreSQL 會拒絕啟動。`db-data:/var/lib/postgresql/data` 是 named volume 持久化。

**最外層的 `volumes: db-data:`** — 宣告 named volume。

注意我每個服務都加了 `restart: unless-stopped`，這是好習慣。

驗證：

```bash
docker compose up -d
docker compose ps                              # 三個都 Up
curl http://localhost:8080                      # 看到 httpd 預設頁面
docker compose exec db psql -U postgres -c "SELECT 1;"   # 成功
docker compose down
```

大家做出來了嗎？做出來的舉手。好，大部分都做出來了。我們進入第二題。

---

## 三、練習二：進階 — .env + healthcheck + 網路隔離（20 分鐘）★★

### 3.1 題目說明（5 分鐘）

好，第二題。把第一題的 compose.yaml 升級。

你需要加四個東西：

**第一，密碼移到 .env。** compose.yaml 裡面不要出現任何明文密碼。用 `${VARIABLE}` 引用。同時提供一個 `.env.example` 範本。

**第二，加 healthcheck。** PostgreSQL 用 `pg_isready` 這個指令。上堂課有給大家一張 healthcheck 對照表，翻一下就知道怎麼寫了。

**第三，depends_on 加 condition。** api 要等 db 的 healthcheck 通過才啟動。

**第四，網路隔離。** 分成 `frontend-net` 和 `backend-net`。nginx 只在 frontend-net，api 在兩個網路，db 只在 backend-net。

做完之後，驗證四件事：
1. `docker compose ps` → db 顯示 (healthy)
2. `docker compose exec nginx ping -c 1 db` → 失敗（網路隔離生效）
3. `docker compose exec api ping -c 1 db` → 成功（同一個 backend-net）
4. compose.yaml 裡面看不到任何密碼

好，時間開始。15 分鐘。

### 3.2 給學生做題（15 分鐘）

（講師巡場，個別指導）

常見問題：
- 「healthcheck 的 test 怎麼寫？」→ `test: ["CMD-SHELL", "pg_isready -U postgres"]`，或者如果用了自訂使用者就 `pg_isready -U ${POSTGRES_USER}`
- 「.env 裡面的變數在 compose.yaml 裡怎麼用？」→ `${POSTGRES_PASSWORD}`，Compose 會自動讀同目錄下的 .env
- 「網路隔離設定好了但 ping 不到」→ 確認 api 有加入兩個 network，不是只有一個

### 3.3 講解參考答案（8 分鐘）

好，時間到。來看答案。

先看 **.env**：

```bash
POSTGRES_USER=appuser
POSTGRES_PASSWORD=mypassword123
POSTGRES_DB=myapp
```

三個變數，分別是使用者名稱、密碼、資料庫名稱。

**.env.example**：

```bash
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
```

這個是範本，可以推到 Git。新成員加入的時候 `cp .env.example .env`，填上自己的值就好。

**compose.yaml**：

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      api:
        condition: service_started
    networks:
      - frontend-net
    restart: unless-stopped

  api:
    image: httpd:alpine
    depends_on:
      db:
        condition: service_healthy
    networks:
      - frontend-net
      - backend-net
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s
    networks:
      - backend-net
    restart: unless-stopped

networks:
  frontend-net:
  backend-net:

volumes:
  db-data:
```

跟第一題比，多了什麼？

**第一，環境變數。** `POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}`，不再寫死。Compose 會自動去讀 .env 檔案裡的值。

**第二，healthcheck。** `pg_isready -U ${POSTGRES_USER}` 是 PostgreSQL 官方提供的就緒檢查工具。`start_period: 10s` 給 PostgreSQL 10 秒的啟動時間，比 MySQL 短一些，因為 PostgreSQL 啟動通常比較快。

**第三，depends_on 加了 condition。** api 的 `condition: service_healthy` 表示要等 db 的 healthcheck 通過才啟動。nginx 的 `condition: service_started` 表示只要 api 容器啟動了就好（httpd 不需要特別等）。

**第四，網路隔離。** nginx 只在 `frontend-net`，db 只在 `backend-net`，api 同時在兩個網路，當橋樑。

驗證：

```bash
docker compose up -d

# 等一下讓 healthcheck 完成
docker compose ps
# db 顯示 (healthy)

# 網路隔離測試
docker compose exec nginx ping -c 1 db
# ping: bad address 'db'  ← 失敗！nginx 和 db 不在同一個網路

docker compose exec api ping -c 1 db
# 64 bytes from ... ← 成功！api 和 db 都在 backend-net

docker compose down
```

看到了嗎？nginx 根本找不到 db 這個 hostname，因為它們不在同一個網路。但 api 可以連到 db，因為它們都在 backend-net。

這就是網路隔離的威力。如果 nginx 被駭了，駭客也碰不到你的資料庫。

好，第二題結束。大家做得怎麼樣？做出來的舉手。不錯，我們進入壓軸的第三題。

---

## 四、練習三：Code Review — 找出 5 個問題（25 分鐘）★★★

### 4.1 題目說明（5 分鐘）

好，第三題。跟 Hour 12 的第三題一樣，這題是 Code Review。

我給你一個 compose.yaml，它看起來沒什麼大問題，功能上也能跑。但是裡面有 **5 個問題**。你要像一個資深工程師一樣，把這 5 個問題全部找出來，說明為什麼是問題，以及怎麼修正。

來，看這個 compose.yaml：

```yaml
services:
  web:
    image: nginx
    container_name: my-web
    ports:
      - "80:80"
    depends_on:
      - api
    networks:
      - frontend

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: localhost
      DB_PASSWORD: my-password
    networks:
      - frontend
      - backend

  db:
    image: mysql
    volumes:
      - ./data:/var/lib/mysql
    networks:
      - backend

networks:
  frontend:
  backend:
```

提示方向：DB_HOST 的值、密碼管理、版本號、Volume 類型、必要環境變數。

好，時間開始。15 分鐘思考。可以在紙上列出你找到的問題。

### 4.2 給學生做題（15 分鐘）

（講師巡場，適時給提示）

如果學生卡住，可以提示：
- 「DB_HOST 設成 localhost，在 Compose 的環境裡，localhost 指的是什麼？」
- 「密碼直接寫在 compose.yaml 裡面，如果這個檔案推到 Git 了呢？」
- 「image: mysql 沒有版本號，明天拉到的可能是不同版本......」
- 「./data:/var/lib/mysql 用的是什麼類型的 Volume？資料庫適合嗎？」
- 「MySQL 啟動需要什麼必填的環境變數？」

### 4.3 互動式講解答案（15 分鐘）

好，時間到。我們一起來看。

**「第一個問題，有沒有人注意到 DB_HOST 的值？」**

（等學生回答）

對！`DB_HOST: localhost`。在 Docker Compose 裡面，每個 service 是獨立的容器。`localhost` 指的是 api 容器自己，不是 db 容器。你要連 db 服務，應該用 service name：`DB_HOST: db`。

這是 Compose 初學者最常踩的坑。上堂課我有特別強調過——在 Compose 的網路裡，service name 就是 hostname。寫 `localhost` 永遠只能連到自己。

**「第二個問題，看 DB_PASSWORD。」**

`DB_PASSWORD: my-password` 直接寫死在 compose.yaml 裡面。這個檔案通常會放進 Git。你的密碼就跟著進了 Git repository，團隊裡每個人都看得到，甚至如果是公開 repo，全世界都看得到。

**修正：** 把密碼移到 `.env` 檔案，compose.yaml 裡面用 `${DB_PASSWORD}` 引用。然後把 `.env` 加到 `.gitignore`。

**「第三個問題，看 db 的 image。」**

`image: mysql`，沒有版本號！這等於 `mysql:latest`。今天拉到的可能是 MySQL 8.0，明天 MySQL 9.0 發布了，你再拉就變成 9.0 了。你的應用可能跟 9.0 不兼容，然後就莫名其妙壞掉了。

**修正：** `image: mysql:8.0`，明確指定版本。順便看一下，nginx 也沒有版本號，也應該改成 `nginx:alpine`。

**「第四個問題，看 volumes。」**

`./data:/var/lib/mysql`，這是一個 bind mount。把資料庫的資料存到本機的 `./data` 目錄。

這樣做有什麼問題？

第一，**效能**。bind mount 在 macOS 和 Windows 上（Docker Desktop 環境）的 I/O 效能比 named volume 差很多，因為要經過一層虛擬化的檔案系統轉換。資料庫是 I/O 密集型的應用，效能差別很明顯。

第二，**權限**。MySQL 容器內部用特定的 UID 來寫檔案，bind mount 到本機目錄可能會有權限問題。

第三，**可攜性**。named volume 由 Docker 管理，不依賴本機的目錄結構。

**修正：** 改成 named volume：`db-data:/var/lib/mysql`，然後在最外層加上 `volumes: db-data:`。

**「第五個問題，db 服務少了什麼？」**

（等學生回答）

對！沒有設 `MYSQL_ROOT_PASSWORD`！MySQL 官方映像檔啟動時必須設定 root 密碼。你不設，MySQL 會直接報錯退出。

```bash
docker compose logs db
# error: database is uninitialized and password option is not specified
```

**修正：** 加上 `MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}`。

### 4.4 其他可改善項目

除了這 5 個核心問題，還有幾個可以改善的地方：

- **缺少 healthcheck** — MySQL 沒有 healthcheck，depends_on 只保證容器啟動，不保證 MySQL ready
- **depends_on 沒有 condition** — 應該搭配 `condition: service_healthy`
- **缺少 restart 策略** — 正式環境應該有 `restart: unless-stopped`
- **nginx 也沒版本號** — `image: nginx` 應改為 `nginx:alpine`

### 4.5 展示修正後的完整 compose.yaml

```yaml
services:
  web:
    image: nginx:alpine
    container_name: my-web
    ports:
      - "80:80"
    depends_on:
      api:
        condition: service_started
    networks:
      - frontend
    restart: unless-stopped

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PASSWORD: ${DB_PASSWORD}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - frontend
      - backend
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
    volumes:
      - db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 30s
    networks:
      - backend
    restart: unless-stopped

networks:
  frontend:
  backend:

volumes:
  db-data:
```

**.env**：

```bash
DB_PASSWORD=app-secret-123
MYSQL_ROOT_PASSWORD=root-secret-456
MYSQL_DATABASE=myapp
```

跟原本的比一下：

| 面向 | 原本 | 修正後 |
|------|------|--------|
| DB_HOST | localhost（連不到） | db（service name） |
| 密碼管理 | 寫死在 YAML | .env + ${VARIABLE} |
| 映像版本 | mysql（無版本號） | mysql:8.0 |
| Volume | bind mount（效能差） | named volume |
| MySQL 設定 | 缺 ROOT_PASSWORD | 完整設定 |
| 健康檢查 | 無 | healthcheck + condition |
| 重啟策略 | 無 | unless-stopped |

大家看到差距了嗎？同樣的三個服務，但可靠性、安全性、可維護性完全不同。

好，三個練習題全部結束。大家辛苦了！

---

## 五、課程總結（10 分鐘）

### 5.1 Day 3 七堂課回顧

好，同學們，到這裡所有的新內容和練習都結束了。我們來花幾分鐘回顧一下 Day 3 這七堂課。

**Hour 8：Volume 資料持久化。** 三種掛載方式——bind mount、named volume、tmpfs。備份和還原。一句話：**容器的資料不怕丟。**

**Hour 9：容器網路 + Port Mapping 進階。** Bridge、Host、None 三種網路模式，自訂網路的 DNS 功能。一句話：**讓容器之間能溝通，讓外面能連進來。**

**Hour 10：Dockerfile 基礎。** 所有指令走過一遍。一句話：**能寫出可以用的 Dockerfile。**

**Hour 11：Dockerfile 進階與最佳化。** Multi-stage、Cache、安全性。一句話：**能寫出又小又安全的 Dockerfile。**

**Hour 12：Dockerfile 實戰練習。** 三個練習題——基礎、生產級、Code Review。一句話：**能實際動手寫並看出問題。**

**Hour 13：Docker Compose 完整講解。** 語法、環境變數、networks、healthcheck、WordPress 實戰、環境分離。一句話：**能用 YAML 管理多容器應用。**

**Hour 14（這堂課）：Compose 實戰練習 + 總結。** 三個練習題加課程回顧。一句話：**能部署完整的應用。**

### 5.2 兩天完整回顧

把 Day 2 和 Day 3 放在一起看：

| 天數 | 小時 | 主題 | 你學會了什麼 |
|------|------|------|-------------|
| Day 2 | Hour 1 | 環境一致性問題 | 為什麼需要 Docker |
| Day 2 | Hour 2 | Docker 架構 | Client-Daemon-Registry |
| Day 2 | Hour 3 | Docker 安裝 | 在各種系統上裝 Docker |
| Day 2 | Hour 4 | 基本指令（上） | pull、images、run、ps |
| Day 2 | Hour 5 | 基本指令（下） | stop、rm、logs、exec |
| Day 2 | Hour 6 | Nginx 實戰 | Port mapping、Volume 初體驗 |
| Day 2 | Hour 7 | 實作練習 | 綜合應用 |
| Day 3 | Hour 8 | Volume 資料持久化 | 三種掛載、備份還原 |
| Day 3 | Hour 9 | 容器網路 | Bridge、Host、自訂網路 |
| Day 3 | Hour 10 | Dockerfile 基礎 | 所有指令、Build Cache |
| Day 3 | Hour 11 | Dockerfile 進階 | Multi-stage、Best Practices |
| Day 3 | Hour 12 | Dockerfile 實戰練習 | 從基礎到 Code Review |
| Day 3 | Hour 13 | Docker Compose 講解 | YAML 語法、Networks、WordPress |
| Day 3 | Hour 14 | Compose 實戰練習 + 總結 | 部署完整應用、後續學習 |

### 5.3 Docker 完整工作流程

三天的內容串起來，就是這張 Docker 完整工作流程圖：

```
┌──────────────┐    docker build    ┌──────────────┐    docker push    ┌──────────────┐
│  Dockerfile  │ ────────────────►  │    Image     │ ────────────────► │   Registry   │
│  (設計圖)     │                    │  (映像檔)     │                   │  (Docker Hub) │
└──────────────┘                    └──────┬───────┘                   └──────┬───────┘
                                          │                                  │
                                          │ docker run                       │ docker pull
                                          ▼                                  ▼
                                   ┌──────────────┐                   ┌──────────────┐
                                   │  Container   │                   │    Image     │
                                   └──────────────┘                   └──────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────┐
│  compose.yaml  ──►  docker compose up  ──►  多個 Container + Network + Volume        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- **Dockerfile** 是設計圖——描述怎麼建構映像檔
- **Image** 是模板——可以推到 Registry 分享，也可以拉回來使用
- **Container** 是實例——Image 跑起來就是 Container
- **compose.yaml** 是編排方案——一次管理多個 Container、Network、Volume

### 5.4 核心概念速查

| 概念 | 一句話說明 |
|------|-----------|
| 容器 vs 虛擬機 | 容器共享核心，輕量快速；虛擬機有完整 OS，隔離更好但更重 |
| 映像檔分層 | 一層一層疊，每層唯讀，多映像可共享底層 |
| Volume | 容器是暫時的，Volume 才是永久的，重要資料一定用 Volume |
| 自訂網路 | 有 DNS 功能，容器用名稱互通，安全隔離 |
| Dockerfile | Multi-stage 減小體積、利用快取加速、不用 root |
| Docker Compose | 多容器標準管理工具，一個 YAML 定義一切 |

### 5.5 最佳實踐速查

| 類別 | 做法 |
|------|------|
| 映像檔 | 指定版本 tag，不用 latest；用 alpine 或 slim |
| Dockerfile | Multi-stage build；先複製依賴清單再複製原始碼；不用 root |
| 容器 | 一個容器一個程序；設資源限制；用 healthcheck |
| 網路 | 用自訂網路；只暴露必要的 port |
| Volume | 重要資料用 named volume；定期備份 |
| Compose | 用 .env 管敏感資訊；depends_on 搭配 healthcheck |
| 安全 | .env 不推 Git；用 non-root user；限制資源 |

---

## 六、銜接 Kubernetes（5 分鐘）

### 6.1 Docker 的限制

好，最後跟大家聊一下接下來的學習方向。

到目前為止，我們所有的操作都在一台機器上。Docker Compose 很強大，但它有幾個根本性的限制：

第一，**單機限制**。所有容器都跑在同一台機器上。那台機器掛了，全部服務一起掛。

第二，**沒有自動擴縮**。流量暴增十倍，你要自己手動加容器。

第三，**沒有跨機故障恢復**。整台機器掛了，沒人幫你把服務搬到另一台機器上。

第四，**沒有滾動更新**。更新版本得先停舊的再啟新的，中間會有停機時間。

當你的應用規模越來越大——幾十個、幾百個容器，分散在多台機器上——Docker 單機就不夠用了。你需要 **Kubernetes**（K8s）。

### 6.2 Docker 到 K8s 的概念對應

好消息是，你在 Docker 學到的所有概念，在 Kubernetes 都有對應：

| Docker 概念 | Kubernetes 對應 | 說明 |
|------------|-----------------|------|
| Container | Pod | Pod 是 K8s 最小調度單位 |
| `docker run` | `kubectl apply` | 用 YAML 描述期望狀態 |
| compose.yaml | K8s manifest YAML | 格式不同，概念相同 |
| 手動擴縮 | HPA（自動擴縮器） | 根據 CPU/記憶體自動擴縮 |
| `restart: always` | Deployment + ReplicaSet | 自動維持指定數量的 Pod |
| docker network | Service + Ingress | 服務發現和外部存取 |
| docker volume | PersistentVolume + PVC | 更完善的儲存管理 |
| .env 檔案 | ConfigMap + Secret | 設定和敏感資訊的標準管理 |

### 6.3 一個比喻

- **Docker** 就像你會開車——從 A 到 B
- **Docker Compose** 就像你會管理一個車隊——同時調度好幾台車
- **Kubernetes** 就像你是交通管理局——管理整個城市的交通，自動路線規劃、故障應變、流量控制

你不會因為當了交通局長就忘記怎麼開車。Kubernetes 是 Docker 的延伸，不是替代。Docker 的容器化思維、Dockerfile 撰寫、映像檔管理，在 Kubernetes 裡全部用得到。

**Docker 是基礎，K8s 是進階。你們已經把基礎打好了。**

---

## 七、結語

同學們，三天的 Docker 課程到這裡就全部結束了。

回想一下 Day 2 第一堂課，你們連 Docker 是什麼都不太清楚。到現在，你們可以自己寫 Dockerfile 把應用程式打包成映像檔，可以用 Docker Compose 一次部署四個服務的完整應用，還懂得網路隔離、資料持久化、環境分離這些進階技巧。

你們在三天內學到的東西，已經足夠你在公司開始使用 Docker 了。不是理論上可以用，是真的可以用——上堂課搭的那個 WordPress 部落格系統，把 WordPress 換成你們自己公司的應用，架構是一模一樣的。

最後我想說的是，Docker 只是一個工具，但它背後代表的是一種**基礎設施即程式碼（Infrastructure as Code）**的思維。你用 Dockerfile 把環境寫成程式碼，用 compose.yaml 把部署方案寫成程式碼。這些程式碼可以版本控制、可以審查、可以自動化。這種思維才是最有價值的東西。

如果接下來要繼續學習，我建議的路線是：先把 Docker 用熟（多練習、多實戰），然後學 Kubernetes（容器編排），再學 CI/CD（持續整合/持續部署）。有了這三塊，你就具備了現代 DevOps 工程師的核心技能。

好，課程到此結束。謝謝大家這三天的認真學習，辛苦了。如果有任何問題，歡迎隨時來問我。祝大家工作順利，在 Docker 的世界裡玩得開心！

---

## 板書 / PPT 建議

1. **三題概覽表**：題目、難度星級、時間分配
2. **練習一的 compose.yaml**：基本三服務
3. **練習二的 compose.yaml**：.env、healthcheck、network 隔離
4. **練習三的錯誤 compose.yaml**：用紅色標出 5 個問題
5. **修正前後對照表**：DB_HOST、密碼、版本、Volume、MySQL 設定
6. **兩天課程總覽表**：Day 2 / Day 3 各小時主題
7. **Docker 完整工作流程圖**：Dockerfile → build → Image → push/pull → Container → compose.yaml
8. **Docker 到 K8s 對應表**：左邊 Docker、右邊 K8s
9. **Docker 指令速查表**：印成 cheat sheet 發給學生帶回去
