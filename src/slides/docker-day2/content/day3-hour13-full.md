# Day 3 第十三小時：Docker Compose 完整講解

---

## 一、為什麼需要 Docker Compose（8 分鐘）

### 1.1 開場：一個真實的 Web 應用

好，各位同學，我們終於來到了一個非常重要的主題——Docker Compose。

在開始之前，我想先帶大家回顧一下。前面的課程我們學了什麼？Day 2 學了所有的 Docker 基礎指令，今天上午學了 Volume、容器網路、Dockerfile、Multi-stage Build、docker push......到目前為止，你們已經具備了操作單一容器的所有技能。

但是我現在要問大家一個問題：在真實的工作環境裡面，你的應用程式只有一個容器嗎？

不可能嘛，對吧？

讓我舉一個最典型的例子。假設你今天要部署一個電商網站，這個網站至少會包含這些東西：

```
┌─────────────────────────────────────────────────────┐
│              一個典型的電商系統                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Nginx（前端 / 反向代理）                            │
│        │                                             │
│        ▼                                             │
│   Node.js API（後端商業邏輯）                         │
│        │              │                              │
│        ▼              ▼                              │
│   MySQL（資料庫）   Redis（快取 / Session）            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

四個服務。如果再加上訊息佇列 RabbitMQ、搜尋引擎 Elasticsearch、監控 Prometheus......輕輕鬆鬆就超過六、七個。

每一個服務，在 Docker 的世界裡，就是一個容器。

### 1.2 如果用 docker run 會怎樣

好，那我們用之前學的方式，把這四個服務跑起來。大家跟我一起看看要打多少指令。

**第一步，建立網路：**

```bash
docker network create my-app-network
```

**第二步，建立 Volume：**

```bash
docker volume create mysql-data
docker volume create redis-data
```

**第三步，啟動 MySQL：**

```bash
docker run -d \
  --name mysql \
  --network my-app-network \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=apppass \
  -v mysql-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8
```

**第四步，啟動 Redis：**

```bash
docker run -d \
  --name redis \
  --network my-app-network \
  -v redis-data:/data \
  redis:7-alpine
```

**第五步，啟動 Node.js API：**

```bash
docker run -d \
  --name api \
  --network my-app-network \
  -e DATABASE_HOST=mysql \
  -e DATABASE_USER=appuser \
  -e DATABASE_PASSWORD=apppass \
  -e REDIS_HOST=redis \
  -p 3000:3000 \
  my-api:latest
```

**第六步，啟動 Nginx：**

```bash
docker run -d \
  --name nginx \
  --network my-app-network \
  -p 80:80 \
  -v ./nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

大家看到了嗎？光是四個服務，我就打了六個指令，每個指令還都一大串參數。

我問大家，這樣做有什麼問題？

**第一，你煩不煩？** 每次要啟動整個應用，就要打這六個指令。每個指令的參數都要記住，少打一個 `-e`，少打一個 `-v`，整個就壞掉了。

**第二，順序要記住。** MySQL 要先啟動，因為 API 依賴它。你如果先啟動 API，API 去連 MySQL，連不到，直接報錯退出。

**第三，團隊新人加入怎麼辦？** 小明是新來的工程師，他第一天上班，要把開發環境跑起來。你跟他說：「你去看 Wiki 上的步驟。」他打開 Wiki，看到六個指令，複製貼上，結果第三個指令的密碼已經改了但 Wiki 沒更新......

**第四，要停掉的時候更痛苦。** 你要一個一個 `docker stop`，然後一個一個 `docker rm`，然後 `docker network rm`......你確定你沒有忘記刪某個容器嗎？

所以我說，用 `docker run` 來管理多個容器，在真實的專案裡面是不切實際的。

### 1.3 Docker Compose 來救場

Docker Compose 的核心思想非常簡單：**把所有服務的設定寫在一個 YAML 檔案裡面，然後用一個指令就能啟動全部、停止全部、管理全部。**

剛才那六個指令，用 Docker Compose 來寫，就是一個檔案加一個指令：

```bash
docker compose up -d
```

搞定。全部跑起來。

要停呢？

```bash
docker compose down
```

全部停掉、清理乾淨。

就這樣。是不是簡單到不可思議？

而且這個 YAML 檔案可以放進 Git 跟程式碼一起版本控制。新同事加入？`git clone` 下來，`docker compose up -d`，整個開發環境就跑起來了。不用看 Wiki，不用問人，不用猜參數。

### 1.4 版本：v1 vs v2

在正式開始之前，我要特別提一個很容易搞混的東西——版本問題。

你在網路上查 Docker Compose 的資料，會看到兩種寫法：

```bash
# 舊版 v1（有 dash）
docker-compose up -d

# 新版 v2（空格）
docker compose up -d
```

| 比較項目 | Compose v1（舊版） | Compose v2（新版） |
|---------|-------------------|-------------------|
| 指令寫法 | `docker-compose`（有 dash） | `docker compose`（空格） |
| 安裝方式 | 獨立安裝的 Python 程式 | Docker CLI 的外掛 |
| 效能 | 較慢（Python 寫的） | 較快（Go 語言重寫） |
| 維護狀態 | 已停止維護 | 官方推薦，持續更新 |

v1 已經停止維護了，不要再用了。**本課程統一使用 v2**，也就是 `docker compose`（空格）的寫法。

```bash
docker compose version
# Docker Compose version v2.24.5
```

只要看到 `v2.x.x`，就沒問題。好，環境確認完了，我們開始正式學 Docker Compose。

---

## 二、compose.yaml 基本結構（10 分鐘）

### 2.1 檔案命名

首先聊一下檔案怎麼命名。Docker Compose 會自動尋找以下名稱的檔案，按優先順序：

1. `compose.yaml`（官方推薦）
2. `compose.yml`
3. `docker-compose.yaml`
4. `docker-compose.yml`

本課程統一使用 `compose.yaml`。你在網路上看到 `docker-compose.yml` 的話，知道是舊的命名慣例就好，功能是一樣的。

### 2.2 最簡範例

我們先來看一個最簡單的 `compose.yaml`：

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

就這四行。這個檔案在說什麼呢？「我有一個服務叫 `web`，用 `nginx:alpine` 映像檔，把主機的 8080 port 對應到容器的 80 port。」

這等同於：

```bash
docker run -d --name web -p 8080:80 nginx:alpine
```

是不是很直覺？compose.yaml 就是把 `docker run` 的參數用 YAML 格式寫下來。

### 2.3 完整的基本結構

好，現在來看一個更完整的例子。我一行一行帶大家看：

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: myapp
    volumes:
      - db-data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  db-data:
```

來，我們逐行拆解。

**`services:`** —— 最上層的關鍵字。所有的服務都定義在這底下。一個服務 = 一個容器。

**`web:` / `db:`** —— 服務的名稱，你可以自己取。這個名字同時也是容器在 Docker 網路裡面的 hostname。

**`image:`** —— 指定映像檔。跟 `docker run` 後面接的映像檔名一模一樣。

**`ports:`** —— Port mapping。格式是 `"主機 port:容器 port"`。**一定要加引號**，因為 YAML 有六十進位的解析規則。

**`volumes:`**（在服務裡面）—— 掛載資料卷。`./html:/usr/share/nginx/html:ro` 是 bind mount，`db-data:/var/lib/mysql` 是 named volume。

**`environment:`** —— 設定環境變數，對應 `docker run -e`。

**`restart:`** —— 重啟策略。`unless-stopped` 是除非手動停止，否則自動重啟。

**`volumes:`**（在最外層）—— 宣告具名 Volume。

### 2.4 三大區塊

```yaml
services:    # 定義服務（容器）
  ...
volumes:     # 定義具名 Volume
  ...
networks:    # 定義自訂網路（可選）
  ...
```

`services` 是必須的，`volumes` 和 `networks` 看你需不需要。

### 2.5 compose.yaml vs docker run 對照表

這張表非常重要，我建議大家把它記下來：

| compose.yaml 設定 | docker run 參數 | 說明 |
|-------------------|----------------|------|
| `image: nginx` | `docker run nginx` | 使用的映像檔 |
| `ports: ["8080:80"]` | `-p 8080:80` | Port mapping |
| `volumes: [./html:/app]` | `-v ./html:/app` | 掛載資料卷 |
| `environment: {KEY: val}` | `-e KEY=val` | 環境變數 |
| `container_name: my-web` | `--name my-web` | 容器名稱 |
| `restart: always` | `--restart always` | 重啟策略 |
| `networks: [my-net]` | `--network my-net` | 加入網路 |
| `command: ["node", "app.js"]` | 映像檔後面的指令 | 覆蓋預設 CMD |

### 2.6 YAML 語法常見陷阱

**第一，縮排很重要，而且只能用空格，不能用 Tab。** 建議統一用 2 個空格。

**第二，冒號後面要有空格。** `image:nginx` 是錯的，應為 `image: nginx`。

**第三，port 一定要加引號。** `8080:80` 不加引號可能被 YAML 誤解。

養成加引號的習慣就好。

---

## 三、環境變數管理（8 分鐘）

### 3.1 怎麼知道要設哪些環境變數

好，接下來講環境變數管理。

先回答一個大家一定會有的疑問：**「這些環境變數我怎麼知道要設哪些？」**

答案是：**不是發明的，是 Image 的官方文件告訴你的。** 我帶大家實際操作一次。

**Step 1：打開瀏覽器，進入 Docker Hub**

網址：`https://hub.docker.com`

**Step 2：搜尋你要用的 Image**

在上面的搜尋欄打 `mysql`，點進第一個結果（有 `Docker Official Image` 標誌的那個）。

**Step 3：往下滑，找到「Environment Variables」段落**

頁面很長，你直接 `Ctrl+F` 搜尋 `Environment`，就會跳到那個段落。

文件把環境變數分成兩個區塊：

**Required variables（必填）：**

| Variable | Description |
|----------|-------------|
| `MYSQL_ROOT_PASSWORD` | Sets the password for the MySQL root superuser account. |

**Optional variables（可選但常用）：**

| Variable | Description |
|----------|-------------|
| `MYSQL_DATABASE` | 容器啟動時自動建立這個資料庫 |
| `MYSQL_USER` | 自動建立一個使用者 |
| `MYSQL_PASSWORD` | 那個使用者的密碼 |

雖然寫「Optional」，但實際上 `MYSQL_DATABASE`、`MYSQL_USER`、`MYSQL_PASSWORD` 這三個你幾乎每次都會用到。因為你不會想用 root 帳號去跑應用程式吧？

**怎麼判斷哪些要設？** 很簡單，問自己三個問題：
1. 我的應用程式需要連資料庫嗎？→ 設 `MYSQL_DATABASE`
2. 我要用 root 帳號還是專用帳號？→ 專用帳號 → 設 `MYSQL_USER` + `MYSQL_PASSWORD`
3. root 密碼要設嗎？→ 必填 → 設 `MYSQL_ROOT_PASSWORD`

**同樣方式查其他 Image**：PostgreSQL 搜 `postgres`，有 `POSTGRES_PASSWORD`、`POSTGRES_USER`、`POSTGRES_DB`。WordPress 搜 `wordpress`，有 `WORDPRESS_DB_HOST`、`WORDPRESS_DB_USER` 等。

**養成這個習慣：用一個新的 Image 之前，先花 5 分鐘看它的 Docker Hub 頁面。** 看三個東西：Environment Variables、Volumes、Exposed Ports。

### 3.2 為什麼要用 .env

前面我們設定 MySQL 的時候，直接把密碼寫在 compose.yaml 裡面。這樣做有什麼問題？

**第一，安全性。** compose.yaml 通常會放到 Git。密碼就跟著進了 Git。

**第二，環境差異。** 開發環境的密碼是 `dev123`，正式環境是超長隨機密碼。你不可能為每個環境各維護一份 compose.yaml。

### 3.3 三種設定方式

**方式一：直接在 compose.yaml 裡寫。** 適合非敏感的設定值：

```yaml
environment:
  MYSQL_ROOT_PASSWORD: my-secret-pw
```

**方式二：使用 env_file 指向外部檔案。**

```yaml
env_file:
  - .env
```

**方式三：用 `${}` 變數替換。** Compose 會自動讀取同目錄下的 `.env` 檔案：

```yaml
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
ports:
  - "${DB_PORT:-3306}:3306"
```

`${DB_PORT:-3306}` 的意思是：如果 `DB_PORT` 有值就用它，沒有就用 `3306` 當預設值。

### 3.4 變數優先順序

| 優先順序 | 來源 |
|---------|------|
| 1（最高）| Shell 環境變數 |
| 2 | .env 檔案 |
| 3（最低）| compose.yaml 預設值 |

### 3.5 安全最佳實踐

**把 .env 加到 .gitignore。** 然後提供 `.env.example` 範本檔：

```bash
cp .env.example .env
vim .env   # 填入實際的值
```

這是業界的標準做法。我看過太多次 GitHub 上有人不小心把 `.env` 推上去，裡面有 AWS 的 Access Key，帳單直接炸掉的案例。千萬不要犯這個錯。

---

## 四、Networks：自訂網路隔離（5 分鐘）

### 4.1 Compose 預設的網路行為

當你執行 `docker compose up` 的時候，Compose 會自動建立一個 bridge network。所有服務之間都可以互相連線，而且可以直接用 **service name 當 hostname**。

```bash
docker compose exec web ping db
# PING db (172.18.0.3): 56 data bytes
```

### 4.2 為什麼要自訂 Network？

預設所有服務都在同一個 network，開發環境沒問題。但在正式環境，你希望做**網路隔離**。

想像一個三層架構：Nginx、API、MySQL。你會希望 Nginx 可以連到 API，API 可以連到 MySQL，但 **Nginx 不能直接連到 MySQL**。這是**縱深防禦**。

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    networks:
      - frontend-net

  api:
    image: node:20-slim
    networks:
      - frontend-net
      - backend-net

  db:
    image: mysql:8.0
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

`api` 同時加入了兩個 network，所以它可以跟兩邊都通訊。但 `nginx` 只在 `frontend-net`，`db` 只在 `backend-net`，它們之間是完全隔離的。

### 4.3 Service Name 就是 Hostname

非常重要的觀念：**在 Compose 的 network 裡面，service name 就是 hostname。**

```javascript
const connection = mysql.createConnection({
  host: 'db',        // 寫 service name，不是 localhost！
  user: 'root',
  password: 'secret',
  database: 'myapp'
});
```

很多同學第一次用 Compose 都會踩到這個坑——程式碼裡面寫 `localhost`，結果連不到資料庫。記住，`localhost` 指的是容器自己，不是別的服務。

---

## 五、depends_on + healthcheck（5 分鐘）

### 5.1 啟動順序的問題

場景：你的 API 需要連 MySQL。如果 MySQL 還沒準備好，API 就先跑起來了，API 去連 MySQL 會怎樣？連線失敗，程式報錯，直接掛掉。

### 5.2 depends_on 的坑

```yaml
services:
  api:
    depends_on:
      - db
  db:
    image: mysql:8.0
```

加了 `depends_on` 之後，`docker compose up` 會先啟動 `db`，再啟動 `api`。

看起來很完美對吧？但是——**`depends_on` 只保證「容器啟動」的順序，不保證「服務準備好」的順序。**

MySQL 的容器啟動了，不代表 MySQL 已經準備好接受連線。初始化可能需要十幾二十秒。

```
0s  → db 容器啟動了
1s  → api 容器也啟動了
2s  → api 嘗試連線 db → 失敗！（MySQL 還在初始化）
15s → MySQL 就緒，但 api 已經掛了
```

### 5.3 正確的解法：healthcheck + condition

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy    # 等 healthcheck 通過才啟動

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-psecret"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s
```

參數說明：
- **test**：健康檢查指令
- **interval**：每隔多久檢查一次
- **timeout**：每次檢查最多等多久
- **retries**：連續失敗幾次才判定 unhealthy
- **start_period**：容器啟動後的寬限期

### 5.4 常見服務的 Healthcheck 寫法

| 服務 | Healthcheck 指令 |
|------|-----------------|
| MySQL | `mysqladmin ping -h localhost` |
| PostgreSQL | `pg_isready -U postgres` |
| Redis | `redis-cli ping` |
| MongoDB | `mongosh --eval "db.runCommand('ping')"` |
| Elasticsearch | `curl -f http://localhost:9200/_cluster/health` |

建議大家把這張表存起來，以後寫 compose.yaml 的時候直接查。

---

## 六、Build 整合（5 分鐘）

### 6.1 在 Compose 裡面 Build 映像檔

前面用的映像檔都是從 Docker Hub 拉的。但實際開發中，你一定有自己的 Dockerfile。Compose 可以直接幫你 build！

```yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

### 6.2 Build 相關指令

```bash
docker compose build              # 只 build，不啟動
docker compose up -d              # build 並啟動（已有映像檔時不重 build）
docker compose up -d --build      # 強制重新 build（改程式碼必用）
docker compose build api          # 只 build 特定服務
```

**特別注意 `--build`。** 改了程式碼但沒加 `--build`，Compose 會用舊映像檔，你的改動不會生效。養成習慣——**改了程式碼就用 `docker compose up -d --build`**。

### 6.3 開發模式：Volume 掛載原始碼

```yaml
services:
  api:
    build:
      context: ./backend
    volumes:
      - ./backend/src:/app/src    # 本機改動即時同步到容器
```

如果你的框架支援 hot reload（nodemon、vite），改完直接就重新載入了，連 build 都不用。

### 6.4 進階 build 選項

```yaml
build:
  context: ./backend
  dockerfile: Dockerfile.dev
  args:
    NODE_VERSION: "20"
  target: development            # Multi-stage build 時指定 target stage
```

`target` 在 Multi-stage build 的時候非常好用。開發環境 build development stage，正式環境 build production stage，一個 Dockerfile 搞定兩種場景。

---

## 七、其他實用設定（5 分鐘）

### 7.1 restart 重啟策略

| 值 | 行為 |
|----|------|
| `no` | 不自動重啟（預設值） |
| `always` | 永遠自動重啟 |
| `on-failure` | 只有非正常退出才重啟 |
| `unless-stopped` | 除非手動停止，否則自動重啟 |

實務上最常用 `unless-stopped`。正式環境一定要加。

### 7.2 資源限制

```yaml
deploy:
  resources:
    limits:
      cpus: '0.50'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

多個服務跑在同一台機器的時候，資源限制可以防止某個服務把所有資源吃光。我見過有個 Java 應用吃掉 8GB 記憶體，把同機器的 MySQL 擠到 OOM 直接掛掉。

### 7.3 Profiles — 按需啟動

有些服務你不是每次都需要啟動。比如 debug 工具、資料庫管理介面：

```yaml
services:
  web:
    image: nginx:alpine

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    profiles:
      - debug
```

```bash
docker compose up -d                    # 只啟動 web
docker compose --profile debug up -d    # 也啟動 adminer
```

### 7.4 Logging — 日誌管理

Docker 預設用 `json-file` 日誌驅動，**預設沒有大小限制**。如果應用瘋狂寫 log，日誌檔案會無限長大，撐爆磁碟。我見過生產環境有個容器的日誌佔了 80 GB。

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"    # 每個日誌檔案最大 10 MB
    max-file: "3"      # 最多保留 3 個檔案（輪替）
```

**建議：** 生產環境的每一個容器都要設定 logging limits。這不是可選的，是必須的。

### 7.5 command 覆蓋 CMD

```yaml
services:
  db:
    image: mysql:8.0
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
```

`command` 會覆蓋映像檔的 CMD。

---

## 八、docker compose 常用指令（5 分鐘）

### 8.1 啟動與停止

```bash
# 背景啟動所有服務（最常用）
docker compose up -d

# 停止並刪除容器和網路（Volume 保留）
docker compose down

# 連 Volume 一起刪（⚠️ 資料不可恢復！）
docker compose down -v
```

> **警告：`docker compose down -v` 會刪除所有 Volume！** 資料庫資料、上傳的檔案，全部歸零。不可逆。打 `docker compose down` 的時候，手指離 `-v` 遠一點。

### 8.2 查看狀態和日誌

```bash
docker compose ps                # 查看服務狀態
docker compose logs -f           # 追蹤所有服務日誌
docker compose logs -f db        # 追蹤特定服務日誌
```

### 8.3 進入容器

```bash
docker compose exec web bash     # 用 service name，不用記容器名
docker compose exec db mysql -uroot -psecret
```

### 8.4 停止 / 啟動 / 重啟

```bash
docker compose stop              # 停止（不刪除容器）
docker compose start             # 啟動已停止的容器
docker compose restart web       # 只重啟某個服務
```

`stop` 和 `down` 的差別：
- `stop` 只是暫停，容器還在，下次 `start` 就能恢復
- `down` 是停止 + 刪除容器和網路

### 8.5 驗證設定

```bash
docker compose config            # 驗證並顯示合併後的完整設定
docker compose config --quiet    # 只驗證語法
```

### 8.6 命名規則

Compose 用**資料夾名稱**當前綴。你的 compose.yaml 放在 `myproject/` 裡面：
- 容器：`myproject-web-1`
- 網路：`myproject_default`

最常用的五個指令：`up -d`、`down`、`ps`、`logs -f`、`exec`。用幾次就記住了。

---

## 九、實戰：WordPress 四服務（10 分鐘）

### 9.1 為什麼選 WordPress？

WordPress 的架構特別經典——反向代理 + 應用程式 + 資料庫 + 快取。不管你的應用是什麼語言寫的，Java、Python、Node.js，很多時候都是這個結構。學會了這個架構，把 WordPress 換成你自己的應用，道理都一樣。

### 9.2 系統架構

```
                    使用者（瀏覽器）
                         │
                ┌────────▼────────┐
                │      Nginx      │  ← 反向代理，對外 Port 80
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │    WordPress    │  ← PHP 應用程式
                └────┬───────┬────┘
                     │       │
             ┌───────▼──┐ ┌──▼───────┐
             │  MySQL   │ │  Redis   │
             │ (資料庫)  │ │  (快取)  │
             └──────────┘ └──────────┘
```

四個服務：

**Nginx** — 接收請求，轉發給 WordPress。擅長靜態檔案、負載均衡、SSL。

**WordPress** — PHP 應用，處理業務邏輯。

**MySQL** — 文章、帳號、設定全存這裡。

**Redis** — 快取。查一次 MySQL 把結果放 Redis，後面直接從 Redis 拿，速度快很多倍。

### 9.3 網路設計

```
┌──────────────────────────────────────────┐
│  frontend 網路                            │
│  Nginx  ──►  WordPress                   │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────┼───────────────────────┐
│  backend 網路    │                       │
│            WordPress                     │
│            ┌──┴──┐                       │
│          MySQL  Redis                    │
└──────────────────────────────────────────┘
```

**最小權限原則**：Nginx 不需連資料庫，只加入 frontend。MySQL/Redis 只在 backend。WordPress 同時加入兩個網路作為橋樑。

### 9.4 .env 環境變數

```bash
MYSQL_ROOT_PASSWORD=my-secret-root-pw
MYSQL_DATABASE=wordpress
MYSQL_USER=wp_user
MYSQL_PASSWORD=wp_password_123
WORDPRESS_DB_HOST=mysql:3306
WORDPRESS_DB_USER=wp_user
WORDPRESS_DB_PASSWORD=wp_password_123
WORDPRESS_DB_NAME=wordpress
```

這些環境變數怎麼來的？去 Docker Hub 查的。MySQL 的文件告訴你 `MYSQL_ROOT_PASSWORD` 是必填的，WordPress 的文件告訴你 `WORDPRESS_DB_HOST` 要設。**兩邊的帳號密碼要對得起來。**

`WORDPRESS_DB_HOST=mysql:3306` 裡面的 `mysql` 是 service name，在 Compose 的網路裡自動變成 DNS 名稱。

### 9.5 Nginx 設定

```nginx
server {
    listen 80;
    client_max_body_size 64M;    # WordPress 圖片上傳

    location / {
        proxy_pass http://wordpress:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**「這個設定檔哪裡來的？」** 不用背。Google 搜尋 `nginx reverse proxy config` 就有範本。改 `proxy_pass` 目標位址就好。

`proxy_pass http://wordpress:80` — 用 service name `wordpress` 當 hostname。

`client_max_body_size 64M` — WordPress 使用者會上傳圖片，預設 1MB 太小。

### 9.6 完整 compose.yaml

```yaml
services:
  nginx:
    image: nginx:alpine
    container_name: blog-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - frontend
    depends_on:
      wordpress:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 128M

  wordpress:
    image: wordpress:6-php8.2-apache
    container_name: blog-wordpress
    environment:
      WORDPRESS_DB_HOST: ${WORDPRESS_DB_HOST}
      WORDPRESS_DB_USER: ${WORDPRESS_DB_USER}
      WORDPRESS_DB_PASSWORD: ${WORDPRESS_DB_PASSWORD}
      WORDPRESS_DB_NAME: ${WORDPRESS_DB_NAME}
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_REDIS_HOST', 'redis');
        define('WP_REDIS_PORT', 6379);
    volumes:
      - wordpress-data:/var/www/html
    networks:
      - frontend
      - backend
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M

  mysql:
    image: mysql:8.0
    container_name: blog-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - backend
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M

  redis:
    image: redis:7-alpine
    container_name: blog-redis
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 128M

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

volumes:
  mysql-data:
  wordpress-data:
  redis-data:
```

這個檔案看起來很長，但拆開來看就是四個服務的重複結構。每一個服務都有 `restart: unless-stopped` 和 `deploy.resources.limits`——restart 確保服務掛了自動重啟，resources limits 確保某個服務不會吃掉所有資源。

### 9.7 啟動與驗證

```bash
docker compose up -d

docker compose ps
# 全部 Up，有 healthcheck 的都顯示 healthy

docker compose logs --tail=20
# 觀察啟動順序：Redis + MySQL 先起來，然後 WordPress，最後 Nginx

# 打開瀏覽器 http://localhost → WordPress 安裝畫面
```

### 9.8 驗證 Volume 持久化

先在 WordPress 寫一篇文章，然後：

```bash
docker compose down    # 停止（Volume 保留）
docker compose up -d   # 重啟
# → 文章還在！
```

因為 MySQL 的資料存在 named volume `mysql-data` 裡面。容器刪了再建，Volume 還在，資料就還在。

### 9.9 完整清理

```bash
docker compose down              # 只停容器，保留資料
docker compose down -v           # ⚠️ 連資料一起刪
docker compose down -v --rmi all # 連映像檔也刪
```

---

## 十、環境分離（override）（3 分鐘）

### 10.1 開發 vs 生產

開發的時候你希望：掛載原始碼、開 debug 模式、看詳細錯誤。

上線的時候你希望：程式碼打包在映像檔裡、關 debug、設資源限制。

Docker Compose 用多檔案機制來處理：

**compose.yaml — 基礎設定，所有環境共用：**

```yaml
services:
  web:
    image: myapp:latest
    ports:
      - "80:3000"
    environment:
      NODE_ENV: production
```

**compose.override.yaml — 開發環境專用，自動載入：**

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DEBUG: "true"
    volumes:
      - .:/app
      - /app/node_modules
```

當目錄下同時有 `compose.yaml` 和 `compose.override.yaml`，執行 `docker compose up` 會**自動**合併。

**compose.prod.yaml — 生產環境專用：**

```yaml
services:
  web:
    restart: always
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 1G
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

```bash
# 開發環境（自動套用 override）
docker compose up -d

# 生產環境（跳過 override，用 prod）
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

### 10.2 驗證設定

```bash
docker compose config                                          # 展開所有變數
docker compose -f compose.yaml -f compose.prod.yaml config     # 驗證指定組合
docker compose config --quiet                                  # 只驗證語法
```

每次改完 compose 檔案，先跑一下 `config` 確認沒問題再啟動。

---

## 十一、本堂課小結（3 分鐘）

好，我們來做一個快速回顧。今天這堂課內容量很大，我幫大家整理一下重點。

### 核心知識點

| 主題 | 重點 |
|------|------|
| 為什麼需要 Compose | docker run 管理多容器太痛苦，一個 YAML 搞定 |
| compose.yaml 結構 | services / volumes / networks 三大區塊 |
| 環境變數 | Docker Hub 查環境變數；.env 管理敏感資訊 |
| Networks | 自訂 network 隔離服務；service name = hostname |
| depends_on | 搭配 healthcheck + condition: service_healthy |
| Build 整合 | 直接在 compose 裡 build；改程式碼要加 `--build` |
| 其他設定 | restart 策略、資源限制、profiles、logging |
| WordPress 實戰 | 四服務完整架構，兩個隔離網路 |
| 環境分離 | override 自動合併、prod 手動指定 |
| 核心指令 | up -d / down / ps / logs -f / exec |

### 三個最重要的觀念

今天如果你只能記住三件事，就記住這三個：

1. **Network 隔離是好習慣。** 不是所有服務都該在同一個 network。用 network 來控制誰能連誰。

2. **不要把密碼寫在 compose.yaml 裡面。** 用 `.env` + `.gitignore`。這不是建議，是基本的安全要求。

3. **depends_on 不等於 service ready。** 搭配 healthcheck + `condition: service_healthy` 才是正確的做法。

下一堂課是 Docker Compose 的練習時間，三個練習題，從基礎到 Code Review，把今天學的全部練一遍。

---

## 板書 / PPT 建議

1. **痛點對比圖**：6 個 docker run 指令 vs 1 個 compose.yaml + 1 個 docker compose up
2. **compose.yaml 結構圖**：services / volumes / networks 三大區塊的層級關係
3. **對照表**：compose.yaml 設定 vs docker run 參數的一一對應
4. **指令速查表**：docker compose 常用指令（up / down / ps / logs / exec）
5. **Network 隔離圖**：frontend-net 和 backend-net 的關係
6. **環境變數優先順序**：Shell > .env > compose.yaml default
7. **depends_on 的坑**：時序圖展示「容器啟動 ≠ 服務 ready」
8. **Healthcheck 參數說明**：interval、timeout、retries、start_period
9. **常見服務 healthcheck 對照表**：MySQL、PostgreSQL、Redis
10. **WordPress 四層架構圖**：Nginx → WordPress → MySQL + Redis，標示 network、volume
11. **環境分離流程圖**：compose.yaml + override / prod 合併過程
12. **開發流程圖**：改程式碼 → docker compose up --build → 測試 → 循環
13. **警告標誌**：`docker compose down -v` 的危險性（紅色醒目標示）
