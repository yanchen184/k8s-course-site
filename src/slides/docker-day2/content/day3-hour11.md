# Day 3 第十一小時：Dockerfile 進階與最佳化

---

## 一、開場與前情提要（3 分鐘）

上堂課：Dockerfile 基本指令（FROM、RUN、COPY、ADD、WORKDIR、ENV、ARG、EXPOSE、CMD、ENTRYPOINT、USER、VOLUME、HEALTHCHECK）+ Python Flask Docker 化實作。

本堂課（Dockerfile 三部曲第二堂）：
- .dockerignore
- Dockerfile Best Practices（六條黃金法則）
- Multi-stage Build（重頭戲）
- docker push 發佈到 Docker Hub
- Image 大小優化總結

---

## 二、.dockerignore（5 分鐘）

### Build Context 的陷阱

```bash
docker build -t my-app .
# 這個「.」代表 Build Context——Docker 會把整個目錄打包送給 Docker Daemon
```

典型 Node.js 專案的問題：

```
my-project/
├── src/              （2 MB）
├── node_modules/     （300 MB）
├── .git/             （150 MB）
├── .env              （含資料庫密碼！）
└── ...
```

- **速度問題**：每次 build 傳幾百 MB，白白浪費時間
- **安全問題**：`COPY . .` 會把 .env 的機密資訊複製進 Image

### .dockerignore 語法

放在專案根目錄（與 Dockerfile 同層），語法與 .gitignore 相同：

```bash
# .dockerignore
.git
.gitignore
node_modules
__pycache__
*.pyc
.venv
.env
.env.local
.env.*.local
.vscode
.idea
*.md
tests/
coverage/
Dockerfile
docker-compose.yml
.dockerignore
.DS_Store
dist/
build/
*.log
```

效果：Build Context 從 512 MB 降至 4 MB（百倍以上差距）。

**原則**：每個有 Dockerfile 的專案都要配一個 .dockerignore，如同 .gitignore 是基本配備。

---

## 三、Dockerfile Best Practices（15 分鐘）

### 法則一：合併 RUN 指令，減少 Layer

```dockerfile
# ❌ 菜鳥寫法：6 個 RUN = 6 個 Layer，且有隱藏 Bug
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y curl
RUN apt-get clean

# ✅ 正確寫法：一個 RUN，一個 Layer
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

> 隱藏 Bug：分開寫時，`apt-get update` 會被快取住，一週後套件清單過期，`apt-get install` 可能裝到舊版本。

### 法則二：善用 Build Cache——依賴先裝，程式碼後放

| 語言 | 先 COPY 的檔案 | 先執行的指令 |
|------|--------------|------------|
| Python | requirements.txt | pip install |
| Node.js | package.json, package-lock.json | npm ci |
| Java Maven | pom.xml | mvn dependency:go-offline |
| Go | go.mod, go.sum | go mod download |

```dockerfile
# ✅ Python 範例
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .           # 程式碼放最後
```

### 法則三：不要用 root 執行——安全性

```dockerfile
# 先用 root 安裝套件，最後切換使用者
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser        # USER 放在所有需要 root 的操作之後
CMD ["python", "app.py"]
```

Alpine 版本語法：`addgroup -S / adduser -S`

### 法則四：清理暫存檔案——在同一個 RUN 裡

```dockerfile
# ❌ 沒有用！前面 Layer 已凝固，刪除只是標記
RUN apt-get install -y python3
RUN rm -rf /var/lib/apt/lists/*

# ✅ 安裝與清理在同一個 RUN
RUN apt-get update && apt-get install -y python3 \
    && rm -rf /var/lib/apt/lists/*

# pip 加 --no-cache-dir
RUN pip install --no-cache-dir -r requirements.txt
```

> 比喻：Layer 像紙張，後面的 Layer 刪掉前面 Layer 的檔案，如同在第二頁塗修正液——第一頁的字還在。

### 法則五：使用具體版本號

永遠指定版本，如 `python:3.11-slim`，不要用 `latest`，確保可重現性。

### 法則六：每個容器只跑一個程序

- 彈性擴展：只擴展需要的服務
- 獨立維護：升級不互相影響
- 日誌清晰：每個容器只有一個服務的輸出

---

## 四、Multi-stage Build（20 分鐘）——本堂重點

### 核心問題：建構時需要的 ≠ 運行時需要的

| 建構時需要（施工工具） | 運行時需要（住的房子） |
|---------------------|-------------------|
| 編譯器（gcc、javac、Go compiler） | 編譯好的執行檔或靜態檔案 |
| 套件管理器（npm、pip、maven） | 運行時依賴（JRE）|
| 建構工具（webpack、vite、babel） | 設定檔 |
| 原始碼 | — |

> 比喻：蓋完房子不會把鷹架和起重機留在客廳。

### Multi-stage 語法

```dockerfile
# 階段一：建構（施工）
FROM <build-image> AS builder
# ... 安裝依賴、編譯、打包 ...

# 階段二：運行（入住）
FROM <runtime-image>
COPY --from=builder /path/to/artifact /destination
```

**關鍵**：最終 Image 只包含最後一個 `FROM` 階段的內容，前面的階段建完即丟。

---

### 範例一：Node.js 前端應用

```dockerfile
# ========== 階段一：建構 ==========
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ========== 階段二：運行 ==========
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

| 項目 | 傳統寫法 | Multi-stage |
|------|---------|-------------|
| 最終 Image 大小 | ~1.2 GB | ~40 MB |
| 包含 Node.js | 是 | 否 |
| 包含 node_modules | 是 | 否 |
| 包含原始碼 | 是 | 否 |
| Web Server | serve（Node.js） | Nginx（高效能） |

**縮小 97%！**

---

### 範例二：Go 應用

```dockerfile
# ========== 階段一：編譯 ==========
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# ========== 階段二：運行 ==========
FROM scratch
COPY --from=builder /app/main /main
EXPOSE 8080
ENTRYPOINT ["/main"]
```

`scratch` = 完全空的 Image，0 bytes，連 shell 都沒有。

`CGO_ENABLED=0` 產生靜態連結的執行檔，不依賴任何外部函式庫。

| 項目 | 傳統寫法 | Multi-stage |
|------|---------|-------------|
| 最終 Image 大小 | ~800 MB | ~8 MB |
| Base Image | golang:1.22（800 MB） | scratch（0 MB） |

**縮小 99%！**

> 需要除錯能力時改用 `FROM alpine:3.19`（約 15 MB）。
> 需要 HTTPS 時，需另行複製 CA 憑證：`COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/`

---

### 範例三：Java Spring Boot 應用

```dockerfile
# ========== 階段一：建構 ==========
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# ========== 階段二：運行 ==========
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

| 項目 | 傳統寫法 | Multi-stage |
|------|---------|-------------|
| 最終 Image 大小 | ~800 MB | ~250 MB |
| 包含 Maven | 是 | 否 |
| 包含 JDK | 是（完整版） | 否（只有 JRE） |

> `-XX:+UseContainerSupport`：讓 JVM 正確感知容器資源限制，避免讀宿主機記憶體而 OOM Kill。

---

### 三種語言大小比較

| 語言 | 傳統 Image | Multi-stage Image | 縮減比例 |
|------|-----------|------------------|---------|
| Node.js 前端 | ~1.2 GB | ~40 MB | 97% |
| Go | ~800 MB | ~8 MB | 99% |
| Java Spring Boot | ~800 MB | ~250 MB | 69% |

### 進階用法

```dockerfile
# 超過兩個階段
FROM node:20-alpine AS deps       # 階段一：安裝依賴
FROM node:20-alpine AS builder    # 階段二：建構
COPY --from=deps /app/node_modules ./node_modules
FROM nginx:alpine                 # 階段三：運行
COPY --from=builder /app/dist /usr/share/nginx/html

# 從外部 Image 複製
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/nginx.conf
```

---

## 五、docker push 發佈到 Docker Hub（10 分鐘）

### 完整流程

```bash
# 1. 登入
docker login

# 2. 命名（命名規範：username/image-name:tag）
docker build -t johndoe/my-flask-app:1.0 .
# 或先 build 再 tag
docker tag my-flask-app johndoe/my-flask-app:1.0
docker tag my-flask-app johndoe/my-flask-app:latest

# 3. 推送
docker push johndoe/my-flask-app:1.0
docker push johndoe/my-flask-app:latest

# 4. 任何機器都可拉取使用
docker pull johndoe/my-flask-app:1.0
docker run -d -p 5000:5000 johndoe/my-flask-app:1.0
```

### 離線部署（docker save / docker load）

```bash
# 匯出成 tar 檔案（用 USB 搬到離線環境）
docker save -o my-flask-app.tar johndoe/my-flask-app:1.0

# 離線環境載入
docker load -i my-flask-app.tar
```

### Private Registry 選項

| Registry | 說明 | 適用場景 |
|----------|------|---------|
| Docker Hub | 付費方案支援 Private Repo | 小團隊、個人 |
| Harbor | VMware 開源，可自己架設 | 企業自建 |
| AWS ECR | Amazon 容器 Registry | 用 AWS 的團隊 |
| Google GCR / Artifact Registry | GCP 容器 Registry | 用 GCP 的團隊 |
| GitHub GHCR | GitHub Container Registry | 程式碼在 GitHub 的團隊 |
| Azure ACR | Azure 容器 Registry | 用 Azure 的團隊 |

---

## 六、Image 大小優化總結（5 分鐘）

### 四大優化策略（效果由大到小）

| 策略 | 效果 | 說明 |
|------|------|------|
| Multi-stage Build | 最大，97~99% | 建構環境與運行環境分離 |
| 選擇小的 Base Image | 大 | alpine < slim < 完整版 |
| 合併 RUN + 清理暫存 | 中 | 減少 Layer，同 RUN 內清理 |
| .dockerignore | 小（加速 build） | 減少 Build Context 大小 |

### Base Image 大小參考

| Base Image | 大小 | 建議 |
|-----------|------|------|
| ubuntu:22.04 | ~77 MB | 功能齊全 |
| python:3.11 | ~920 MB | 避免直接用 |
| python:3.11-slim | ~130 MB | 一般首選 |
| python:3.11-alpine | ~50 MB | 追求極小 |
| node:20-alpine | ~130 MB | 前端建構 |
| alpine:3.19 | ~7 MB | 超輕量基底 |
| scratch | 0 MB | Go 靜態執行檔 |

### Node.js 前端優化累積效果

| 優化步驟 | Image 大小 | 備註 |
|---------|-----------|------|
| 未優化（FROM node:20） | ~1.2 GB | 完整版，含所有檔案 |
| 換 Base Image（node:20-alpine） | ~400 MB | Alpine 版本 |
| 加 .dockerignore | ~350 MB | 排除 node_modules、.git |
| 善用 Build Cache | ~350 MB | 大小不變，build 速度大幅提升 |
| Multi-stage Build（Nginx） | ~40 MB | 只留 dist/ + Nginx |

**縮小 97%（1.2 GB → 40 MB）**

Image 小的四大好處：
1. **拉取速度快**——CI/CD 部署更快
2. **啟動更快**——彈性擴展更敏捷
3. **省儲存空間**——Registry 費用降低
4. **攻擊面小**——安全性提升

---

## 七、學生練習題

| 題號 | 練習主題 | 重點 |
|------|---------|------|
| 練習 1 | 撰寫 .dockerignore | 辨別應排除與不能排除的檔案（node_modules、.env、.git vs src/、package.json） |
| 練習 2 | 修正快取問題的 Dockerfile | 套用「依賴先裝，程式碼後放」原則，修正 Python 範例 |
| 練習 3 | React 前端改寫 Multi-stage | Builder 用 node:20 編譯；運行用 nginx:alpine 只留 dist/ |
| 練習 4 | Go 應用 Multi-stage Build | 編譯用 golang:1.22-alpine；運行用 scratch 或 alpine；大小控制在 15 MB 以內 |
| 練習 5 | docker push 實戰 | build → tag → push 到 Docker Hub → rmi → pull → 驗證可 run |
| 練習 6 | 綜合最佳化（找 7 個問題） | ubuntu 無版本、多個 RUN 未合併、快取順序錯、root 執行、暫存未清、CMD 字串格式、無 WORKDIR 等 |

---

## 八、本堂課小結

| 主題 | 重點 |
|------|------|
| .dockerignore | 排除 .env、node_modules、.git；語法同 .gitignore |
| Best Practices | 合併 RUN、善用快取、非 root 執行、同 RUN 內清理、具體版本、單一程序 |
| Multi-stage Build | 多個 FROM + AS + COPY --from=；最終 Image 只含最後階段 |
| docker push | login → tag → push；命名規範 username/name:tag |
| 離線部署 | docker save / docker load |
| 四大優化策略 | Multi-stage > 小 Base Image > 合併 RUN > .dockerignore |

---

## 九、實戰一：Node.js + TypeScript 生產級專案（20 分鐘）

### 為什麼選 TypeScript 做第一個實戰

TypeScript 需要先編譯成 JavaScript 才能跑，這是 Multi-stage Build 最完美的使用場景：
- Build 階段：TypeScript 編譯器、型別定義、devDependencies
- Production 階段：只有編譯好的 JavaScript + 生產依賴

### 專案結構

```
my-ts-api/
├── src/index.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .dockerignore
└── Dockerfile
```

**package.json 關鍵點：**

```json
{
  "scripts": { "build": "tsc", "start": "node dist/index.js" },
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/express": "^4.17.21",
    "ts-node": "^10.9.1"
  }
}
```

| 分類 | 套件 | 生產需要？ |
|------|------|-----------|
| dependencies | express | 是 |
| devDependencies | typescript, @types/*, ts-node | 否（編譯完就不需要）|

**tsconfig.json 關鍵設定：**

```json
{ "compilerOptions": { "outDir": "./dist", "rootDir": "./src" } }
```

流程：`src/index.ts` → tsc 編譯 → `dist/index.js`

**src/index.ts（含 /health 端點）：**

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});
```

`/health` 端點是給 Docker HEALTHCHECK 用的，生產環境 Kubernetes 或負載均衡器也會用它判斷服務狀態。

### .dockerignore

```
node_modules        # 容器內重新安裝，本機的可能有幾百 MB
dist                # 容器內重新編譯，避免用到過期版本
.git
.env
.env.*              # 機密資訊絕不打包進映像
coverage
.vscode
```

### 完整 Dockerfile（Multi-stage）

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./   # 先複製，利用 cache
RUN npm ci                               # 安裝所有依賴（含 devDependencies）
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build                        # 編譯 TypeScript → dist/

# Stage 2: Production
FROM node:20-alpine AS production
RUN apk add --no-cache dumb-init         # 處理 PID 1 信號問題
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force   # 只裝生產依賴 + 清快取
COPY --from=builder /app/dist ./dist     # 只取編譯產物
RUN chown -R node:node /app
USER node                                # 非 root 執行
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### Build Stage 設計決策

**Cache 策略（重要！）**

```dockerfile
# 壞的寫法：每次改原始碼，npm ci 就重跑
COPY . .
RUN npm ci

# 好的寫法：package.json 不變就用快取，npm ci 幾乎秒完成
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
```

**npm ci vs npm install：**

| 比較 | npm ci | npm install |
|------|--------|-------------|
| 依據 | 嚴格按 package-lock.json | 可能更新版本 |
| 衝突時 | 直接報錯 | 默默修改 |
| 適用場景 | Dockerfile、CI/CD | 本地開發 |

### Production Stage 設計決策

**dumb-init — PID 1 信號問題：**

```
有 dumb-init：
docker stop → SIGTERM → dumb-init(PID 1) → 轉發 → Node.js → 優雅關閉（1-2 秒）

沒有 dumb-init：
docker stop → SIGTERM → Node.js(PID 1) → 沒反應 → 10 秒後 SIGKILL → 強制殺掉
```

Node.js 不是設計來當 PID 1 的。dumb-init 當 PID 1，負責信號轉發和孤兒程序回收。

**`--omit=dev` 與 cache 清理：**

```dockerfile
RUN npm ci --omit=dev && npm cache clean --force
```

`&&` 合在同一個 RUN：若拆成兩行，第一層的快取空間不會真正釋放。

**`chown` 要在 `USER` 之前：**

```dockerfile
RUN chown -R node:node /app    # root 才能執行 chown
USER node                       # 切換後就沒有 chown 權限了
```

**ENTRYPOINT + CMD 分開寫的好處：**

```bash
# CMD 可以被覆蓋，方便 debug 進入容器
docker run -it my-ts-api:1.0.0 sh
# 執行的是：dumb-init -- sh（ENTRYPOINT 還在，信號正確）
```

### 建構與驗證

```bash
docker build -t my-ts-api:1.0.0 .
docker images my-ts-api
# SIZE: 約 125MB（單 stage 不優化可能 500MB+）

docker run -d --name ts-api -p 3000:3000 my-ts-api:1.0.0
curl http://localhost:3000/          # {"message":"Hello from TypeScript API!"}
curl http://localhost:3000/health    # {"status":"healthy","uptime":5.123}

docker exec ts-api whoami           # node（非 root）
docker exec ts-api ps aux
# PID 1: dumb-init -- node dist/index.js
# PID 7: node dist/index.js

time docker stop ts-api             # 應在 1-2 秒完成，非 10 秒
```

---

## 十、實戰二：Spring Boot Java 應用（15 分鐘）

### 為什麼要學 Java 的 Dockerfile

- Java 在企業中佔有率極高
- JVM 在容器裡有獨特的**記憶體管理坑**，不知道一定會踩到

### 專案結構

```
my-spring-app/
├── src/main/java/com/example/demo/DemoApplication.java
├── src/main/resources/application.yml
├── pom.xml
├── .dockerignore
└── Dockerfile
```

**.dockerignore：**

```
target    # 相當於 Node.js 的 node_modules，編譯產物
.git
.idea
.vscode
```

### 完整 Dockerfile（Multi-stage）

```dockerfile
# Stage 1: Build（用 Maven 編譯）
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B          # 先下載依賴，利用 cache
COPY src ./src
RUN mvn package -DskipTests -B            # 打包（跳過測試）

# Stage 2: Production（只需要 JRE）
FROM eclipse-temurin:21-jre-alpine AS production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup   # 建立非 root 使用者
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
ENV JAVA_OPTS="-XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0 \
  -XX:InitialRAMPercentage=50.0 \
  -Djava.security.egd=file:/dev/./urandom"
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
```

### Build Stage 設計決策

```dockerfile
COPY pom.xml .
RUN mvn dependency:go-offline -B    # 先下載依賴（快取，否則改一行就重下載幾百 MB）
COPY src ./src
RUN mvn package -DskipTests -B      # 再打包，-DskipTests 避免重複跑測試
```

Maven 下載比 npm 慢，cache 效益更大。`-B` batch mode 讓 log 更乾淨。

**JDK vs JRE：**

| | JDK | JRE |
|--|-----|-----|
| 含編譯器 javac | 是 | 否 |
| 映像大小 | ~430MB | ~100MB（Alpine）|
| 生產環境需要 | 否 | 是 |

### JVM 在容器中的特殊設定（重要！）

**`-XX:+UseContainerSupport` — 歷史坑：**

舊版 Java 8 JVM 讀 `/proc/meminfo`（宿主機總記憶體）而非容器限制：

```
宿主機 32GB → 容器限制 512MB
JVM 以為有 32GB → 分配 8GB 堆記憶體 → 超出容器限制 → OOM Kill → 容器閃退
```

Java 10+ 加入容器感知，讀 cgroup 限制。`-XX:+UseContainerSupport` 啟用它（Java 11+ 預設開啟，但建議明確寫出）。

**`-XX:MaxRAMPercentage=75.0` vs `-Xmx`：**

| | MaxRAMPercentage=75.0 | -Xmx384m |
|--|----------------------|----------|
| 方式 | 按比例 | 絕對值 |
| 容器記憶體改變時 | 自動調整 | 需改 Dockerfile 重 build |
| 推薦 | 是 | 否 |

為什麼留 25%？JVM 除了 Heap 還需要：Metaspace、Code Cache、Thread Stack、Direct Buffers、GC Overhead。

**`-Djava.security.egd=file:/dev/./urandom` — 加速啟動：**

容器環境熵池補充慢，`/dev/random` 可能造成 Spring Boot 啟動卡住數十秒。改用 `/dev/urandom` 不阻塞。

**HEALTHCHECK start-period：**

```
Node.js：start-period=5s     （啟動很快）
Spring Boot：start-period=30s  （JVM 初始化 + Spring Context 掃描需要 10-30 秒）
```

### 建構與驗證

```bash
docker build -t my-spring-app:1.0.0 .
docker run -d --name spring-app -p 8080:8080 -m 512m my-spring-app:1.0.0

curl http://localhost:8080/       # {"message":"Hello from Spring Boot!"}

# 驗證 JVM 有正確讀取容器記憶體限制
docker exec spring-app java -XX:+PrintFlagsFinal -version 2>&1 | grep MaxHeapSize
# MaxHeapSize = 402653184（約 384MB = 512MB × 75%）
```

---

## 十一、常見 Dockerfile 問題排查（15 分鐘）

每個問題格式：**症狀 → 原因 → 解法 → 診斷指令**

### 問題一：建構速度非常慢

**原因一：Build Context 太大**

```bash
docker build -t test . 2>&1 | head -3
# Sending build context to Docker daemon  850MB  ← 太大！正常應在幾 MB
```

解法：補 .dockerignore，排除 node_modules、.git、target 等。

**原因二：Cache 沒用好**

```dockerfile
# 壞：每次改原始碼就重跑 npm install
COPY . .
RUN npm install

# 好：package.json 不變就用快取
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

```bash
# 診斷：看每步是 CACHED 還是重新執行
docker build -t test . --progress=plain 2>&1 | grep -E "(CACHED|RUN)"
```

### 問題二：映像檔太大

**原因一：Base image 太肥**

| Base Image | 大小 |
|-----------|------|
| node:20 | ~350MB |
| node:20-slim | ~200MB |
| node:20-alpine | ~50MB |
| eclipse-temurin:21-jdk | ~430MB |
| eclipse-temurin:21-jre-alpine | ~100MB |
| python:3.12 | ~350MB |
| python:3.12-alpine | ~50MB |

**原因二：快取沒清理（注意 layer 陷阱）**

```dockerfile
# 壞：快取留在 layer，刪除無效
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean           # 這層只是新增「刪除」，底層快取還在

# 好：同一 RUN 裡清理
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*
```

```bash
# 診斷：看哪一層特別大
docker history my-image:latest
```

### 問題三：容器啟動就退出

**第一步：永遠先看日誌**

```bash
docker logs my-container    # 90% 的答案在這裡
```

**常見原因一：Alpine 沒有 bash**

```dockerfile
# 錯誤：Alpine 只有 sh
CMD ["bash", "-c", "node app.js"]

# 正確
CMD ["node", "app.js"]
```

**常見原因二：程式找不到**

```bash
docker logs my-container
# Error: Cannot find module '/app/dist/index.js'

# 診斷：進去看檔案結構
docker run -it --entrypoint sh my-image
ls -la /app/dist/
```

**常見原因三：缺少環境變數**

```bash
docker logs my-container
# Error: connect ECONNREFUSED 127.0.0.1:3306

docker run -d -e DATABASE_URL=mysql://user:pass@host:3306/db my-app
```

**診斷工具箱：**

```bash
docker inspect my-container --format='{{.State.ExitCode}}'
# 137 = OOM Kill（記憶體不足）
# 143 = 正常 stop
# 1   = 應用程式錯誤

docker run -it --entrypoint sh my-image    # 覆蓋 entrypoint 進去除錯
```

### 問題四：COPY 失敗

```
COPY failed: file not found in build context or excluded by .dockerignore
```

**原因一：路徑相對於 Build Context，不是 Dockerfile 位置**

```bash
# 在 project/ 執行 docker build -f docker/Dockerfile .
# Build context = project/
COPY config/app.conf /app/   # 正確（相對於 project/）
COPY ../config/app.conf /app/ # 錯誤（不能跳出 build context）
```

**原因二：.dockerignore 排除了需要的檔案**

```bash
mv .dockerignore .dockerignore.bak
docker build -t test .
# 如果成功 → 問題在 .dockerignore
mv .dockerignore.bak .dockerignore
```

**原因三：Linux 大小寫敏感**

Mac 開發（不分大小寫）推到 CI/CD（Linux）失敗的經典坑。`README.md` 和 `Readme.md` 在 Linux 是不同檔案。

### 問題五：權限問題

```
Error: EACCES: permission denied, open '/app/data/logs.txt'
```

切換到非 root 使用者後，COPY、RUN 建立的檔案預設是 root 擁有，非 root 讀寫不了。

```dockerfile
# 解法一：COPY 時指定擁有者
COPY --chown=node:node dist/ /app/dist/

# 解法二：切換 USER 之前 chown（chown 需要 root 權限）
RUN mkdir -p /app/data && chown -R node:node /app
USER node
```

```bash
# 診斷
docker exec my-container ls -la /app/
docker exec my-container whoami
docker exec my-container id
```

### 排查流程決策樹

```
問題發生
├── 建構失敗？
│   ├── COPY 失敗 → 路徑、.dockerignore、大小寫
│   ├── RUN 失敗 → 看錯誤訊息（套件安裝、編譯問題）
│   └── 建構很慢 → build context 大小、cache 使用
├── 容器啟動失敗？
│   ├── docker logs → 看錯誤訊息
│   ├── 退出碼 137 → OOM Kill，增加記憶體
│   ├── 退出碼 1   → 應用程式錯誤，覆蓋 entrypoint 進去 debug
│   └── exec format error → CMD/ENTRYPOINT 格式問題
├── 容器跑起來但功能異常？
│   ├── 連不上 → 檢查 -p 和 EXPOSE
│   ├── 權限問題 → 檢查 USER 和檔案擁有者
│   └── 環境變數缺失 → docker exec env
└── 映像檔太大？
    ├── docker history → 看每層大小
    ├── Multi-stage 去除建構工具
    └── 換更小的 base image
```

---

## 板書 / PPT 建議

1. Build Context 概念圖（docker build 時整個目錄打包送給 Docker Daemon 的流程）
2. Build Cache 快取失效的骨牌效應示意圖（一層失效，後面全部重建）
3. 「依賴先裝，程式碼後放」對比圖（錯誤 vs 正確寫法的快取命中情況）
4. Layer 清理比喻圖（修正液的比喻：在第二頁塗不影響第一頁）
5. Multi-stage Build 兩階段流程圖（Builder Stage → Final Stage，COPY --from 箭頭）
6. 蓋房子比喻圖（施工：鷹架工具 → 入住：乾淨房子）
7. Node.js Multi-stage 前後對比（1.2 GB vs 40 MB，內容物比較）
8. Go Multi-stage 前後對比（特別標注 scratch = 0 MB）
9. Java Multi-stage 前後對比（JDK vs JRE）
10. 三種語言 Image 大小比較總表
11. Base Image 大小階梯圖（ubuntu → slim → alpine → distroless → scratch）
12. docker push 完整流程圖（build → tag → login → push → Hub → pull）
13. 優化步驟累積效果表（1.2 GB → 40 MB 逐步過程）
14. Node.js Multi-stage 結構圖：左 Builder（npm ci 全部依賴 + tsc 編譯），右 Production（npm ci --omit=dev + COPY --from=builder dist/），箭頭標示 COPY --from
15. PID 1 信號流程對比：有 dumb-init（1-2 秒優雅關閉）vs 無 dumb-init（10 秒強制 kill）
16. JVM 容器記憶體示意圖：容器限制 512MB → Heap 384MB (75%) + Off-heap 128MB (25%)
17. JVM 記憶體誤判示意圖：宿主機 32GB → 容器 512MB → 沒有 UseContainerSupport → JVM 分配 8GB → OOM Kill
18. 常見問題排查決策樹：建構失敗 / 啟動失敗 / 功能異常 / 映像太大 四條分支
19. Base Image 大小對照表：各語言 full / slim / alpine 版本大小比較
