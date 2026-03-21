# Day 3 第十四小時：Docker Compose 實戰練習

---

## 一、開場（3 分鐘）

好，各位同學，歡迎來到 Day 3 下午的最後一堂正課。

經過三天高密度的學習，我知道大家應該都有點累了。但是，這堂課非常重要，因為我們要把上堂課學到的 Docker Compose 所有知識，用三個練習題全部練一遍。

上堂課我們學了什麼？Docker Compose 的完整知識——compose.yaml 語法、環境變數管理、自訂網路隔離、depends_on 搭配 healthcheck、build 整合、WordPress 四服務實戰、環境分離。內容量很大，但光聽不練是不夠的。

今天的安排：

| # | 題目 | 難度 | 時間 |
|---|------|:---:|:---:|
| 1 | Nginx + API + PostgreSQL 基本 Compose | ★ | 15 分鐘 |
| 2 | 加入 .env + healthcheck + 網路隔離 | ★★ | 20 分鐘 |
| 3 | Code Review：找出 5 個問題 | ★★★ | 25 分鐘 |

做完練習之後，我們不會立刻切進 `kubectl`，而是會加開一堂橋接模組，用 Docker 手動模擬一次 Kubernetes 在幫你做的事。這樣你明天進 K8s 時，不會只是背名詞，而是真的理解它解決了什麼問題。

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

## 五、Hour 15 預告（3 分鐘）

### 5.1 下一堂為什麼不直接上 kubectl

好，同學們，到這裡 Compose 的實戰練習就告一段落了。

正常很多課程在這裡就會直接切進 Kubernetes，開始教 `kubectl`、Deployment YAML、Service。這樣不是不行，但有一個問題：如果你還沒有真的感受到「手動管理多個 container 到底麻煩在哪裡」，那你明天學 K8s 很容易變成純記名詞。

所以我們今天不急著結束。我特別加了一堂橋接模組，先用你們今天已經會的 Docker 能力，手動模擬一次 Kubernetes 平常在幫你做的事情。

### 5.2 下一堂會做什麼

下一堂你會看到五件事串起來：

1. 自己 build 一個可版本化的 Web 服務
2. 自己手動開三個副本
3. 自己手動做流量分流
4. 自己手動做版本更新
5. 自己手動補回壞掉的副本

也就是說，下一堂不是在學新 Docker 指令，而是在理解 Kubernetes 的價值來源。

### 5.3 請帶著這三個問題進下一堂

第一，為什麼 `replicas: 3` 背後真正重要的不是數字，而是「誰來持續維持 3」？

第二，為什麼穩定入口不該靠人手動維護 upstream 清單？

第三，為什麼版本更新和故障補機，最後都會走向宣告式系統？

如果你帶著這三個問題進下一堂，明天看到 Pod、Deployment、Service、rolling update、self-healing，就會非常有感。

---

## 板書 / PPT 建議

1. **三題概覽表**：題目、難度星級、時間分配
2. **練習一的 compose.yaml**：基本三服務
3. **練習二的 compose.yaml**：.env、healthcheck、network 隔離
4. **練習三的錯誤 compose.yaml**：用紅色標出 5 個問題
5. **修正前後對照表**：DB_HOST、密碼、版本、Volume、MySQL 設定
6. **Hour 15 預告流程圖**：build → replicas → proxy → update → healing
7. **三個關鍵問題**：誰維持副本、誰維護入口、誰負責自癒
8. **Docker 指令速查表**：印成 cheat sheet 發給學生帶回去
