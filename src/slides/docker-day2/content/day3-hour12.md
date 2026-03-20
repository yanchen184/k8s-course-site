# Day 3 第十二小時：Dockerfile 實戰練習

---

## 開場（5 分鐘）

前兩堂課我們學完了 Dockerfile 所有指令和最佳實踐。
這堂課是**純實作**，三個練習題，難度遞進。

| # | 題目 | 難度 | 時間 |
|---|------|:---:|:---:|
| 1 | 打包一個 API 成 Dockerfile | ★ | 15 分鐘 |
| 2 | 改寫成生產級 Multi-stage Build | ★★ | 20 分鐘 |
| 3 | Code Review：找出 8 個問題 | ★★★ | 25 分鐘 |

---

## 練習一：打包 Hello World API（15 分鐘）★

### 題目

用你熟悉的程式語言（Node.js / Python / Go / Java），寫一個簡單的 HTTP 伺服器，包含 `/` 和 `/health` 兩個端點。然後寫 Dockerfile 打包它。

**要求：**
1. 選一個 Base Image
2. COPY 程式碼進去
3. EXPOSE port
4. CMD 啟動服務
5. 建構並執行，確認能用 curl 測試

### 提示

```bash
# Node.js 的同學可以用這個 server.js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Hello Docker!' }));
  }
});
server.listen(3000, () => console.log('Server on port 3000'));
```

---

### 練習一：參考答案

**Dockerfile：**

```dockerfile
FROM node:20-slim
WORKDIR /app
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

---

## 練習二：改寫成生產級（20 分鐘）★★

### 題目

把練習一的 Dockerfile 升級成生產級，加入以下功能：

1. **Multi-stage Build**（Build 階段 + Production 階段）
2. **非 root 使用者**（USER node 或自建使用者）
3. **HEALTHCHECK**
4. **正確的 cache 策略**（先 package.json，再 COPY 原始碼）
5. **.dockerignore**
6. **LABEL** 加上 maintainer

**驗證清單：**
- `docker exec <container> whoami` → 不是 root
- `docker ps` → 顯示 (healthy)
- Image 大小合理（< 200MB）

---

### 練習二：參考答案

**.dockerignore：**
```
node_modules
.git
*.md
Dockerfile
.dockerignore
```

**Dockerfile：**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine
LABEL maintainer="your-name@company.com"
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY server.js .
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
docker exec test whoami          # → node
docker ps                         # → (healthy)
docker images hello-api:prod     # → < 200MB
docker rm -f test
```

---

## 練習三：Code Review（25 分鐘）★★★

### 題目

以下 Dockerfile 有 **8 個問題**，請全部找出來並修正：

```dockerfile
FROM ubuntu
RUN apt-get update
RUN apt-get install -y python3 python3-pip curl vim wget htop
COPY . .
RUN pip3 install flask
RUN pip3 install requests
RUN pip3 install gunicorn
ENV FLASK_ENV=development
EXPOSE 5000
CMD python3 app.py
```

**提示方向：** Base Image、版本號、Layer 數量、快取順序、多餘工具、root 權限、CMD 格式、環境變數、WORKDIR、.dockerignore

---

### 練習三：參考答案

**8 個問題：**

| # | 問題 | 原因 | 修正 |
|---|------|------|------|
| 1 | `FROM ubuntu` 沒版本號 | 可能拉到不同版本 | `FROM python:3.11-slim` |
| 2 | 用 ubuntu 還要裝 Python | 多此一舉 | 直接用 python base image |
| 3 | `apt-get update` 和 `install` 分開 | cache 可能過期 | 合併成一個 RUN |
| 4 | 安裝 vim, wget, htop | 生產環境不需要 | 移除 |
| 5 | 三個 pip install 分三個 RUN | 多餘的 Layer | 合併，或用 requirements.txt |
| 6 | `COPY . .` 在 pip install 前 | 改任何程式碼都重裝依賴 | 先 COPY requirements.txt，裝完再 COPY . . |
| 7 | `FLASK_ENV=development` | 生產環境不該是 development | 改成 production |
| 8 | `CMD python3 app.py` 用 Shell Form | PID 1 信號處理問題 | `CMD ["python3", "app.py"]` |

**加分題（講師可選）：** 沒有 WORKDIR、沒有 USER（用 root 跑）、沒有 HEALTHCHECK、沒有 .dockerignore

**修正後的 Dockerfile：**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -r appuser
USER appuser
ENV FLASK_ENV=production
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
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
