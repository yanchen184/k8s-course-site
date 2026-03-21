# Day 3 第十三小時：Docker Compose 完整講解

---

## 一、為什麼需要 Docker Compose（8 分鐘）

**痛點：用 docker run 管理多容器**

一個典型電商系統的容器組成：

```
Nginx（前端 / 反向代理）
  └─▶ Node.js API（後端）
        ├─▶ MySQL（資料庫）
        └─▶ Redis（快取）
```

四個服務就需要打六道指令（建網路、建 Volume、依序啟動每個容器），且：
- 容易打錯參數
- 啟動順序要手動記住
- 新人加入難以重現環境
- 停止時需逐一清理

**Docker Compose 解法**

```bash
docker compose up -d    # 全部啟動
docker compose down     # 全部停止並清理
```

- 所有設定寫進一個 `compose.yaml`，放進 Git 版本控制
- 新同事 `git clone` → `docker compose up -d`，開發環境立即就緒

**v1 vs v2 比較**

| 比較項目 | Compose v1（舊版） | Compose v2（新版） |
|---------|-------------------|-------------------|
| 指令寫法 | `docker-compose`（有 dash） | `docker compose`（空格） |
| 安裝方式 | 獨立 Python 程式 | Docker CLI 外掛 |
| 效能 | 較慢 | 較快（Go 重寫） |
| 維護狀態 | 已停止維護 | 官方推薦 |

**本課程統一使用 v2**：`docker compose`（空格）。

---

## 二、compose.yaml 基本結構（10 分鐘）

**檔案命名優先順序**

1. `compose.yaml`（官方推薦）
2. `compose.yml`
3. `docker-compose.yaml`
4. `docker-compose.yml`

**最簡範例**

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

等同於：`docker run -d --name web -p 8080:80 nginx:alpine`

**完整範例（帶說明）**

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

**三大頂層區塊**

```yaml
services:    # 定義服務（容器），必填
  ...
volumes:     # 定義具名 Volume
  ...
networks:    # 定義自訂網路（可選）
  ...
```

**compose.yaml vs docker run 對照表**

| compose.yaml 設定 | docker run 參數 | 說明 |
|-------------------|----------------|------|
| `image: nginx` | `docker run nginx` | 映像檔 |
| `ports: ["8080:80"]` | `-p 8080:80` | Port mapping |
| `volumes: [./html:/app]` | `-v ./html:/app` | 掛載資料卷 |
| `environment: {KEY: val}` | `-e KEY=val` | 環境變數 |
| `container_name: my-web` | `--name my-web` | 容器名稱 |
| `restart: always` | `--restart always` | 重啟策略 |
| `networks: [my-net]` | `--network my-net` | 加入網路 |
| `command: ["node", "app.js"]` | 映像檔後接的指令 | 覆蓋 CMD |

**YAML 常見陷阱**

| 陷阱 | 說明 |
|------|------|
| 縮排只能用空格 | Tab 會導致解析錯誤，肉眼難以分辨 |
| 冒號後要有空格 | `image:nginx` 是錯的，應為 `image: nginx` |
| port 要加引號 | YAML 會把 `8080:80` 誤解為六十進位數值 |

---

## 三、環境變數管理（8 分鐘）

### Docker Hub 查詢教學

用一個新的 Image 之前，先去 Docker Hub 查三個東西：
1. **Environment Variables** — 要設哪些環境變數
2. **Volumes** — 資料存在哪個路徑
3. **Exposed Ports** — 預設用哪個 port

以 MySQL 為例，Docker Hub 文件告訴你：
- `MYSQL_ROOT_PASSWORD`（必填）
- `MYSQL_DATABASE`、`MYSQL_USER`、`MYSQL_PASSWORD`（可選但常用）

### 三種設定方式

```yaml
# 方式一：直接寫（適合非敏感設定）
environment:
  MYSQL_ROOT_PASSWORD: my-secret-pw

# 方式二：引用外部 .env 檔案
env_file:
  - .env

# 方式三：${} 變數替換（含預設值語法）
environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
ports:
  - "${DB_PORT:-3306}:3306"   # 未設定時預設 3306
```

### 環境變數優先順序

| 優先順序 | 來源 | 說明 |
|---------|------|------|
| 1（最高）| Shell 環境變數 | `export KEY=val` |
| 2 | .env 檔案 | compose.yaml 同目錄下 |
| 3（最低）| compose.yaml 預設值 | `${VAR:-default}` |

### 安全最佳實踐

```bash
# .gitignore
.env

# 提供範本供團隊參考（可 commit）
cp .env.example .env
```

---

## 四、Networks：自訂網路隔離（5 分鐘）

### 預設行為

所有服務都在同一個 `資料夾_default` bridge network，service name 就是 hostname。

### 網路隔離（縱深防禦）

```yaml
services:
  nginx:
    image: nginx:alpine
    networks:
      - frontend-net

  api:
    image: node:20-slim
    networks:
      - frontend-net   # 能連 nginx
      - backend-net    # 能連 db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
    networks:
      - backend-net    # nginx 連不到！

networks:
  frontend-net:
  backend-net:
```

**關鍵觀念**：Service name = hostname。程式碼裡連資料庫要寫 service name（`host: 'db'`），不是 `localhost`。

---

## 五、depends_on + healthcheck（5 分鐘）

### 問題：容器啟動 ≠ 服務就緒

```
0s  → db 容器啟動
1s  → api 容器啟動（depends_on 條件滿足）
2s  → api 嘗試連線 db → 失敗！MySQL 還在初始化
```

### 正確解法

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy

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

### 常見服務的 healthcheck 指令

| 服務 | Healthcheck 指令 |
|------|-----------------|
| MySQL | `mysqladmin ping -h localhost` |
| PostgreSQL | `pg_isready -U postgres` |
| Redis | `redis-cli ping` |
| MongoDB | `mongosh --eval "db.runCommand('ping')"` |
| Nginx | `curl -f http://localhost/` |

---

## 六、Build 整合（5 分鐘）

### 在 Compose 裡 build 自己的 Dockerfile

```yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

### Build 相關指令

```bash
docker compose build              # 只 build，不啟動
docker compose up -d              # build 並啟動（已有映像檔時不重 build）
docker compose up -d --build      # 強制重新 build（改程式碼必用）
docker compose build api          # 只 build 特定服務
```

### 開發模式（Volume 掛載 + hot reload）

```yaml
services:
  api:
    build:
      context: ./backend
    volumes:
      - ./backend/src:/app/src   # 本機改動即時同步到容器
```

### 進階 build 選項

```yaml
build:
  context: ./backend
  dockerfile: Dockerfile.dev
  args:
    NODE_VERSION: "20"
  target: development            # 指定 multi-stage 的 target stage
```

---

## 七、其他實用設定（5 分鐘）

**restart 重啟策略**

| 值 | 行為 |
|----|------|
| `no` | 不自動重啟（預設） |
| `always` | 永遠重啟 |
| `on-failure` | 非正常退出才重啟 |
| `unless-stopped` | 除非手動停止，否則重啟（正式環境推薦） |

**資源限制**

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

**Profiles — 按需啟動**

```yaml
services:
  web:
    image: nginx:alpine
  adminer:
    image: adminer
    profiles:
      - debug
```

```bash
docker compose up -d web                # 只啟動 web
docker compose --profile debug up -d    # 也啟動 adminer
```

**Logging — 日誌管理**

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"    # 每個日誌檔案最大 10 MB
    max-file: "3"      # 最多保留 3 個檔案
```

**生產環境必須設定，否則日誌可能撐爆磁碟。**

---

## 八、docker compose 常用指令（5 分鐘）

**指令速查表**

```bash
docker compose up -d              # 背景啟動所有服務（最常用）
docker compose down               # 停止並刪除容器和網路（Volume 保留）
docker compose down -v            # 連 Volume 一起刪（⚠️ 資料不可恢復！）
docker compose ps                 # 查看服務狀態
docker compose logs -f            # 追蹤所有服務日誌
docker compose logs -f db         # 追蹤特定服務日誌
docker compose exec web sh        # 進入容器執行指令
docker compose stop               # 停止（不刪除容器）
docker compose start              # 啟動已停止的容器
docker compose restart web        # 重啟（可指定單一服務）
docker compose config             # 驗證並顯示合併後的完整設定
```

**stop vs down 的差異**

| 指令 | 容器狀態 | Volume | 網路 | 適用時機 |
|------|---------|--------|------|---------|
| `stop` | 保留 | 保留 | 保留 | 暫停省資源，稍後還要用 |
| `down` | 刪除 | 保留 | 刪除 | 清理環境、重新來過 |

**自動命名規則**

Compose 用**資料夾名稱**當前綴，例如 `myproject/` 中的服務：
- 容器：`myproject-web-1`
- 網路：`myproject_default`

---

## 九、Hour 14 實戰預告（3 分鐘）

下一堂會把今天的觀念全部串起來，做一個完整的多服務 Compose 練習，不再只是講 YAML，而是真的部署與排錯。會用到四個重點：

- `.env` 抽出密碼與環境差異
- `depends_on + healthcheck` 控制服務就緒順序
- 前後端分離 network 驗證最小權限
- `docker compose ps / logs / config` 當作第一線排查工具

Hour 13 先把語法、觀念與指令講清楚，Hour 14 再完整動手做。

---

## 十、環境分離（override）（3 分鐘）

### 多檔案合併機制

```
compose.yaml           → 所有環境共用的基礎設定
compose.override.yaml  → 開發環境專用（自動載入）
compose.prod.yaml      → 生產環境專用（手動指定）
```

**compose.yaml（基礎）**
```yaml
services:
  web:
    image: myapp:latest
    ports:
      - "80:3000"
    environment:
      NODE_ENV: production
```

**compose.override.yaml（開發，自動合併）**
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

**compose.prod.yaml（生產）**
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

| 環境 | 指令 |
|------|------|
| 開發（自動套用 override） | `docker compose up` |
| 生產 | `docker compose -f compose.yaml -f compose.prod.yaml up -d` |

### 驗證設定

```bash
docker compose config                                          # 展開所有變數
docker compose -f compose.yaml -f compose.prod.yaml config     # 驗證指定組合
```

---

## 十一、本堂課小結（3 分鐘）

### 核心知識點

| 主題 | 重點 |
|------|------|
| 為什麼需要 Compose | docker run 管理多容器痛苦，一個 YAML 搞定 |
| compose.yaml 結構 | services / volumes / networks 三大區塊 |
| 環境變數 | .env 管理敏感資訊；Docker Hub 查環境變數 |
| Networks | 自訂 network 隔離服務；service name = hostname |
| depends_on | 搭配 healthcheck + condition: service_healthy |
| Build 整合 | 改程式碼要加 `--build` |
| 其他設定 | restart、資源限制、profiles、logging |
| 環境分離 | override 自動合併、prod 手動指定 |
| 核心指令 | `up -d` / `down` / `ps` / `logs -f` / `exec` |

### 最重要的三個觀念

1. **Network 隔離是好習慣** — 用 network 控制誰能連誰
2. **密碼不寫在 compose.yaml** — 用 `.env` + `.gitignore`
3. **depends_on 不等於 service ready** — 搭配 healthcheck 才正確

### 下堂課預告

Docker Compose 練習時間 — 三個練習題，從基礎到進階到 Code Review。

---

## 板書 / PPT 建議

1. **痛點對比圖**：6 道 docker run 指令 vs 1 個 compose.yaml + 1 道指令
2. **compose.yaml 結構圖**：services / volumes / networks 三大區塊
3. **docker run ↔ compose.yaml 對照表**
4. **常用指令速查表**：up / down / ps / logs / exec
5. **Network 隔離架構圖**：frontend-net 和 backend-net
6. **環境變數優先順序**：Shell > .env > compose.yaml default
7. **depends_on 的坑（時序圖）**：容器啟動 ≠ 服務 ready
8. **常見服務 healthcheck 對照表**
9. **WordPress 四層架構圖**：Nginx → WordPress → MySQL + Redis
10. **環境分離流程圖**：compose.yaml + override / prod
11. **⚠️ 警告標示**：`docker compose down -v` 會刪除所有資料
