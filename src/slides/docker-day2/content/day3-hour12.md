# Day 3 第十二小時：Dockerfile 實戰練習

---

## 開場（5 分鐘）

前兩堂課我們學完了 Dockerfile 基礎、最佳實踐與 Multi-stage Build。
這堂課統一用一個 **Node.js API** 當練習主線，從「能跑」一路做到「production-ready」，最後再做一次 Code Review。

| # | 題目 | 難度 | 時間 |
|---|------|:---:|:---:|
| 1 | 打包 Node.js Hello API | ★ | 15 分鐘 |
| 2 | 改寫成生產級 Multi-stage Build | ★★ | 20 分鐘 |
| 3 | Code Review：找出 8 個問題 | ★★★ | 25 分鐘 |

---

## 練習一：打包 Node.js Hello API（15 分鐘）★

### 題目

請用 **Node.js + Express** 做一個最小可跑的 HTTP API，包含 `/` 和 `/health` 兩個端點，然後寫 Dockerfile 打包它。

**要求：**
1. 建立 `package.json`、`server.js`
2. 在本機先跑一次 `npm install`，產生 `package-lock.json`
3. Dockerfile 要安裝依賴、複製程式碼、EXPOSE port、CMD 啟動
4. 建構並執行，確認能用 curl 測試
5. 回答「為什麼這一題就要先把 lockfile 準備好」

### 提示

**package.json：**

```json
{
  "name": "hello-api",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

**server.js：**

```js
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (_req, res) => {
  res.json({ message: 'Hello Docker!' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
```

---

### 練習一：參考答案

**Dockerfile：**

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

**驗證：**

```bash
docker build -t hello-api .
docker run -d -p 3000:3000 --name test hello-api
curl http://localhost:3000/
curl http://localhost:3000/health
docker rm -f test
```

**為什麼先準備 lockfile：**
- `npm ci` 需要 `package-lock.json`
- Docker build 要可重現，不能每次安裝都臨場解版本
- 後面做 cache 最佳化時，`package.json` / `package-lock.json` 會是最重要的快取邊界

---

## 練習二：改寫成生產級（20 分鐘）★★

### 題目

把練習一的 Dockerfile 升級成生產級，加入以下功能：

1. **Multi-stage Build**（Dependency 階段 + Runtime 階段）
2. **非 root 使用者**（`USER node` 或自建使用者）
3. **HEALTHCHECK**
4. **正確的 cache 策略**（先 `package.json`，再 COPY 原始碼）
5. **.dockerignore**
6. **LABEL** 加上基本 OCI metadata

**驗證清單：**
- `docker exec <container> whoami` → 不是 root
- 等 healthcheck 跑完後，用 `docker inspect --format '{{.State.Health.Status}}' <container>` → 應顯示 `healthy`
- Image 大小合理（< 200MB）

---

### 練習二：參考答案

**.dockerignore：**

```
node_modules
.git
.env
*.md
Dockerfile
.dockerignore
```

**Dockerfile：**

```dockerfile
# Dependency stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Runtime stage
FROM node:20-alpine
LABEL org.opencontainers.image.title="hello-api"
RUN apk add --no-cache dumb-init wget
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY server.js .
RUN chown -R node:node /app
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

**驗證：**

```bash
docker build -t hello-api:prod .
docker run -d -p 3000:3000 --name test hello-api:prod
sleep 45                         # 保守一點，等 healthcheck 穩定完成
docker exec test whoami          # → node
docker inspect --format '{{.State.Health.Status}}' test   # → healthy
docker images hello-api:prod     # SIZE 欄位應明顯小於單階段版本
docker rm -f test
```

---

## 練習三：Code Review（25 分鐘）★★★

### 題目

以下 Node.js Dockerfile 有 **8 個問題**，請全部找出來並修正：

```dockerfile
FROM node
COPY . .
RUN npm install
ENV NODE_ENV=development
EXPOSE 3000
CMD node server.js
```

**提示方向：** Base Image、版本號、快取順序、`npm install` vs `npm ci`、root 權限、CMD 格式、環境變數、WORKDIR、`.dockerignore`、healthcheck

---

### 練習三：參考答案

**8 個問題：**

| # | 問題 | 原因 | 修正 |
|---|------|------|------|
| 1 | `FROM node` 沒版本號 | 可能拉到不同版本 | `FROM node:20-alpine` |
| 2 | 用預設 full image | Image 太肥 | 改用 `node:20-alpine` 或 `node:20-slim` |
| 3 | `COPY . .` 太早 | 任何檔案改動都會讓 `npm install` 重跑 | 先 COPY `package*.json` |
| 4 | `npm install` | 不夠可重現 | 改 `npm ci --omit=dev` |
| 5 | 沒有 `WORKDIR` | 檔案散落在根目錄 | 加 `WORKDIR /app` |
| 6 | `NODE_ENV=development` | 生產環境不該是 development | 改成 production |
| 7 | `CMD node server.js` 用 Shell Form | PID 1 信號處理不理想 | `CMD ["node", "server.js"]` |
| 8 | 沒有 `USER` / `HEALTHCHECK` / `.dockerignore` | 權限、安全、可維護性都不夠 | 補齊 production 必要設定 |

**修正後的 Dockerfile：**

```dockerfile
FROM node:20-alpine
RUN apk add --no-cache dumb-init wget
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js .
RUN chown -R node:node /app
USER node
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

**搭配 `.dockerignore`：**

```
node_modules
.git
.env
*.md
```

---

## 結尾（5 分鐘）

### 回顧三堂 Dockerfile 課

| 堂次 | 學到什麼 |
|------|---------|
| Hour 10 | 所有指令 + 第一個 Dockerfile |
| Hour 11 | Multi-stage、Best Practices、docker push |
| Hour 12 | 實戰練習：從基礎到生產級到 Code Review |

### 下堂課預告

Docker Compose — 用一個 YAML 檔案管理多個容器，不用再一個一個 docker run。
