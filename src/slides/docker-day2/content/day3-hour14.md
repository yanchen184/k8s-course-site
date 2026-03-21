# Day 3 第十四小時：Docker Compose 實戰練習

---

## 開場（3 分鐘）

上堂課學完了 Docker Compose 所有知識。
這堂課是**純實作**，三個練習題，難度遞進。做完之後，下一堂加開橋接模組會用 Docker 手動模擬 Kubernetes 在幫你做的事。

| # | 題目 | 難度 | 時間 |
|---|------|:---:|:---:|
| 1 | Nginx Reverse Proxy + API Mock + PostgreSQL | ★ | 15 分鐘 |
| 2 | 加入 .env + healthcheck + 網路隔離 | ★★ | 20 分鐘 |
| 3 | Code Review：找出 5 個問題 | ★★★ | 25 分鐘 |

---

## 練習一：三服務 Compose（15 分鐘）★

### 題目

寫一個 `compose.yaml`，包含三個服務：

1. **nginx** — 反向代理，對外 port 8080
2. **api** — 用 `hashicorp/http-echo` 模擬 API，回應固定字串
3. **db** — PostgreSQL，port 5432

**要求：**
- 設定 ports
- `nginx` 要真的反向代理到 `api`
- PostgreSQL 用 named volume 持久化
- 設定 `POSTGRES_PASSWORD` 環境變數
- 設定基本的 `depends_on`

**`./nginx/default.conf`：**
```nginx
server {
    listen 80;

    location / {
        proxy_pass http://api:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**驗證：**
```bash
docker compose up -d
docker compose ps               # 三個服務都 Up
curl http://localhost:8080      # → hello from api
docker compose exec db psql -U postgres -c "SELECT 1;"
docker compose down
```

---

### 練習一：參考答案

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: hashicorp/http-echo:1.0.0
    command: ["-text=hello from api", "-listen=:5678"]
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

**驗證：**
```bash
docker compose up -d
docker compose ps
curl http://localhost:8080      # → hello from api
docker compose exec db psql -U postgres -c "SELECT 1;"
docker compose down
```

---

## 練習二：進階 — .env + healthcheck + 網路隔離（20 分鐘）★★

### 題目

把練習一的 compose.yaml 升級：

1. **密碼移到 .env** — compose.yaml 用 `${VARIABLE}` 引用
2. **加 healthcheck** — PostgreSQL 用 `pg_isready`
3. **depends_on 加 condition** — api 等 db healthy 才啟動
4. **網路隔離** — 分成 frontend-net 和 backend-net
   - nginx 只在 frontend-net
   - api 在兩個網路
   - db 只在 backend-net

**驗證清單：**
- 等幾秒讓 healthcheck 完成後，`docker compose ps` → db 顯示 `(healthy)`
- `curl http://localhost:8080` → 仍然回 `hello from api`
- `docker network inspect $(basename "$PWD")_frontend-net` → 只有 nginx + api
- `docker network inspect $(basename "$PWD")_backend-net` → 只有 api + db
- 密碼不在 compose.yaml 裡出現

---

### 練習二：參考答案

**.env：**
```bash
POSTGRES_USER=appuser
POSTGRES_PASSWORD=mypassword123
POSTGRES_DB=myapp
```

**.env.example：**
```bash
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
```

**`./nginx/default.conf`：**
```nginx
server {
    listen 80;

    location / {
        proxy_pass http://api:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**compose.yaml：**
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      api:
        condition: service_started
    networks:
      - frontend-net
    restart: unless-stopped

  api:
    image: hashicorp/http-echo:1.0.0
    command: ["-text=hello from api", "-listen=:5678"]
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

**驗證：**
```bash
docker compose up -d
sleep 12
docker compose ps                                   # db 顯示 (healthy)
curl http://localhost:8080                          # → hello from api
docker network inspect $(basename "$PWD")_frontend-net
docker network inspect $(basename "$PWD")_backend-net
docker compose down
```

---

## 練習三：Code Review — 找出 5 個問題（25 分鐘）★★★

### 題目

以下 compose.yaml 有 **5 個問題**，請全部找出來並修正：

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

**提示方向：** DB_HOST 值、密碼管理、版本號、Volume 類型、必要環境變數

---

### 練習三：參考答案

**5 個問題：**

| # | 問題 | 原因 | 修正 |
|---|------|------|------|
| 1 | `DB_HOST: localhost` | 在 Compose 中 localhost 指的是容器自己，不是 db 服務 | `DB_HOST: db`（使用 service name） |
| 2 | `DB_PASSWORD: my-password` 寫死 | 密碼不該寫在 compose.yaml，會進 Git | 用 `.env` + `${DB_PASSWORD}` |
| 3 | `image: mysql` 沒版本號 | latest 陷阱，不同時間可能拉到不同版本 | `image: mysql:8.0` |
| 4 | `./data:/var/lib/mysql` 用 Bind Mount | 資料庫資料應用 named volume，效能更好且更安全 | `db-data:/var/lib/mysql` |
| 5 | db 沒設 `MYSQL_ROOT_PASSWORD` | MySQL 啟動時必須設定 root 密碼，否則直接報錯退出 | 加上 `MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}` |

**其他可改善項目：** 缺少 healthcheck、depends_on 沒有 condition、缺少 restart 策略、nginx 沒指定版本

**修正後的 compose.yaml：**

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

**.env：**
```bash
DB_PASSWORD=app-secret-123
MYSQL_ROOT_PASSWORD=root-secret-456
MYSQL_DATABASE=myapp
```

---

## Hour 15 預告（3 分鐘）

### 下一堂要做什麼

下一堂不是直接教 `kubectl`，而是先用今天 Day 3 已經學過的能力，手動模擬一次 Kubernetes 平常在幫你做的事情：

1. 自己 build 一個可版本化的服務
2. 自己手動開三個副本
3. 自己手動做流量分流
4. 自己手動做版本更新
5. 自己手動補回壞掉的副本

### 為什麼要先這樣做

如果你沒有先親手看到這些麻煩事，明天看到 Pod、Deployment、Service、rolling update、self-healing 時，很容易只是在背名詞。

### 帶著這三個問題進下一堂

1. 為什麼 `replicas: 3` 背後真正重要的是「誰在維持 3」？
2. 為什麼流量入口不該靠人手動維護 upstream 清單？
3. 為什麼版本更新與故障補機最後都會走向宣告式系統？

---

## 附錄：Docker 常用指令速查表

| 分類 | 常用指令 |
|------|---------|
| 映像檔管理 | `pull` / `images` / `rmi` / `build` / `tag` / `push` / `history` / `image prune` |
| 容器管理 | `run -d` / `run -it` / `ps` / `ps -a` / `stop` / `rm` / `logs -f` / `exec -it` / `inspect` / `stats` |
| 網路管理 | `network create` / `ls` / `inspect` / `rm` / `connect` / `prune` |
| Volume 管理 | `volume create` / `ls` / `inspect` / `rm` / `prune` |
| Docker Compose | `up -d` / `down` / `down -v` / `ps` / `logs` / `exec` / `build` / `config` / `--profile` |
| 系統清理 | `system df` / `system prune` / `system prune -a --volumes` |

---

## 板書 / PPT 建議

1. **三題概覽表**：題目、難度星級、時間分配
2. **練習一的 compose.yaml**：基本三服務
3. **練習二的 compose.yaml**：加了 .env、healthcheck、network 隔離
4. **練習三的錯誤 compose.yaml**：用紅色標出 5 個問題
5. **修正後的 compose.yaml**：用綠色標出修正
6. **Hour 15 預告圖**：build → replicas → proxy → update → healing
7. **三個帶著走的問題**：為什麼需要 Deployment / Service / 自癒
8. **Docker 指令速查表**：印成 cheat sheet 發給學生
