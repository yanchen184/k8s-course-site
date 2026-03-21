# Day 3 第十二小時：Dockerfile 實戰練習

---

## 一、開場（5 分鐘）

好，各位同學，歡迎來到 Dockerfile 三部曲的最後一堂課。

前兩堂課我們把 Dockerfile 的所有理論和技巧都學完了。第十小時，我們把所有指令走了一遍——FROM、RUN、COPY、CMD、ENTRYPOINT、USER、HEALTHCHECK，然後動手打包了一個 Python Flask 應用。第十一小時，我們學了 .dockerignore、Best Practices、Multi-stage Build，還把映像檔推上了 Docker Hub。

那今天呢？今天不再講新的理論了。今天是**純實作**，三個練習題，難度遞進。

我先把今天的安排給大家看一下：

| # | 題目 | 難度 | 時間 |
|---|------|:---:|:---:|
| 1 | 打包一個 API 成 Dockerfile | ★ | 15 分鐘 |
| 2 | 改寫成生產級 Multi-stage Build | ★★ | 20 分鐘 |
| 3 | Code Review：找出 8 個問題 | ★★★ | 25 分鐘 |

第一題是暖身，讓你確認基本功沒問題。第二題是進階，要你把第一題的結果升級成生產級。第三題是 Code Review，我給你一個有問題的 Dockerfile，你要像一個資深工程師一樣，把裡面的問題全部挑出來。

每一題的流程都是一樣的：我先說明題目，然後給你們時間做，時間到了我再帶大家看參考答案。

準備好了嗎？那我們開始。

---

## 二、練習一：打包 Hello World API（15 分鐘）★

### 2.1 題目說明（3 分鐘）

好，第一題。

題目很簡單：用你熟悉的程式語言，寫一個最基本的 HTTP 伺服器，然後用 Dockerfile 打包它。

你的 HTTP 伺服器需要有兩個端點：
- `/` — 回傳一個歡迎訊息，什麼內容都可以
- `/health` — 回傳一個健康狀態

然後寫一個 Dockerfile，包含以下幾個步驟：
1. 選一個合適的 Base Image
2. 把程式碼 COPY 進去
3. EXPOSE port
4. CMD 啟動服務
5. Build 出來，跑一個容器，用 curl 測試兩個端點

就這樣，五個步驟。不需要 Multi-stage，不需要 HEALTHCHECK，不需要 USER，就是最基本的 Dockerfile。

如果你對程式語言沒有特別偏好，或者不想花時間寫 API，我這邊有提供一個 Node.js 的範本，你可以直接用：

```javascript
// server.js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello Docker!' }));
  }
});
server.listen(3000, () => console.log('Server on port 3000'));
```

這個 server.js 用的是 Node.js 內建的 `http` 模組，不需要裝任何套件，所以連 `package.json` 都不用。把這個檔案 COPY 進容器，`node server.js` 就能跑了。

用 Python 的同學，你可以用 Flask 或者內建的 `http.server`。用 Go 的同學，標準庫的 `net/http` 就夠了。

好，時間開始。大家有 12 分鐘，做完可以先休息一下。有問題隨時舉手。

### 2.2 給學生做題（12 分鐘）

（講師巡場，觀察學生進度，個別指導）

常見的問題提示：
- 「老師，我 build 成功了但 curl 連不上」→ 檢查有沒有用 `-p` 做 port mapping
- 「老師，容器跑起來就退出了」→ `docker logs` 看錯誤訊息
- 「老師，我不知道要用哪個 Base Image」→ Node.js 用 `node:20-slim`，Python 用 `python:3.11-slim`

### 2.3 講解參考答案（5 分鐘）

好，時間到。我們來看參考答案。

先看 Dockerfile：

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

就五行。我一行一行說。

`FROM node:20-slim` — 我們選 `node:20-slim` 作為 Base Image。為什麼不用 `node:20`？因為完整版有 350MB，slim 版只有 200MB 左右。為什麼不用 `node:20-alpine`？Alpine 當然更小，但第一題是暖身，我們先用 slim，不要給自己製造 Alpine 兼容性的麻煩。

`WORKDIR /app` — 設定工作目錄。這個是好習慣，不要把東西丟在根目錄或者 `/root` 裡面。

`COPY server.js .` — 把我們的程式碼複製進容器。因為我們前面已經 `WORKDIR /app` 了，所以 `.` 就是 `/app`。

`EXPOSE 3000` — 宣告我們的應用用 3000 port。記住，EXPOSE 只是文件性質的宣告，不會真的開 port。

`CMD ["node", "server.js"]` — 用 Exec Form 啟動我們的應用。注意是 Exec Form，不是 Shell Form。為什麼要用 Exec Form？PID 1 信號處理的問題，上堂課有講過。

驗證：

```bash
docker build -t hello-api .
docker run -d -p 3000:3000 --name test hello-api
curl http://localhost:3000/
# {"message":"Hello Docker!"}
curl http://localhost:3000/health
# {"status":"ok"}
docker rm -f test
```

兩個端點都正常回應，完美。

有沒有同學做完的？做完的舉手讓我看看。好，大部分同學都做出來了。沒做完的也不用擔心，這題的重點就是確認你會寫最基本的 Dockerfile。

有問題嗎？沒有的話我們進入第二題。

---

## 三、練習二：改寫成生產級（20 分鐘）★★

### 3.1 題目說明（5 分鐘）

好，第二題。這題要把第一題的 Dockerfile 升級成生產級。

什麼叫生產級？就是你真的可以拿去上線的那種。不只是能跑就好，還要考慮安全性、效能、可觀測性。

具體來說，你需要加入以下六個功能：

**第一，Multi-stage Build。** 把 Build 階段和 Production 階段分開。雖然我們的 server.js 是純 JavaScript 不需要編譯，但如果你用的是 TypeScript 或者有 `package.json` 需要 `npm ci`，你就需要 Multi-stage 了。

為了練習 Multi-stage，我希望你們假設有一個 `package.json`（即使只有 server.js 不需要），在 Build 階段裝依賴，Production 階段只複製需要的東西。

**第二，非 root 使用者。** 加上 `USER node` 或者自建一個使用者。不要用 root 跑應用。

**第三，HEALTHCHECK。** 讓 Docker 能定期檢查你的應用是不是活著。

**第四，正確的 cache 策略。** 先 COPY `package.json`，跑 `npm ci`，然後再 COPY 原始碼。不要一口氣 `COPY . .`。

**第五，.dockerignore。** 排除不需要的檔案。

**第六，LABEL。** 加上 maintainer 資訊。

做完之後，你需要驗證三件事：
- `docker exec <container> whoami` → 回傳的不是 root
- `docker ps` → 顯示 (healthy)
- `docker images` → Image 大小合理，200MB 以內

如果你想要更完整一點，可以加上 dumb-init 處理 PID 1 信號問題，然後用 `time docker stop` 驗證優雅關閉。

好，時間開始。15 分鐘。

### 3.2 給學生做題（15 分鐘）

（講師巡場，個別指導）

常見問題：
- 「Multi-stage 的 COPY --from 怎麼寫？」→ 先給 Build stage 取名 `AS builder`，然後在 Production stage 用 `COPY --from=builder`
- 「HEALTHCHECK 怎麼寫？」→ `HEALTHCHECK CMD wget -qO- http://localhost:3000/health || exit 1`
- 「USER node 之後 COPY 的檔案權限不對」→ 要在 USER 之前先 `chown`，或者用 `COPY --chown=node:node`

### 3.3 講解參考答案（8 分鐘）

好，時間到。我們來看參考答案。

先看 **.dockerignore**：

```
node_modules
.git
*.md
Dockerfile
.dockerignore
```

這個很基本，排除 node_modules（容器內會重裝）、.git（版本控制跟映像無關）、Markdown 文件、還有 Dockerfile 本身。

再看 **Dockerfile**：

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

我來逐段解釋。

**Build stage**：用 `node:20-alpine` 安裝依賴。`COPY package*.json ./` 然後 `RUN npm ci --only=production`。這裡的 cache 策略是：只要 package.json 沒變，npm ci 就用快取，不用重新安裝。

**Production stage**：也是 `node:20-alpine`，從乾淨的 base image 開始。

`LABEL maintainer` — 標記維護者資訊。這是好習慣，別人看到這個映像知道找誰。

`RUN apk add --no-cache dumb-init` — 安裝 dumb-init 處理 PID 1 信號問題。上堂課講過，Node.js 不適合當 PID 1，dumb-init 會幫你正確轉發 SIGTERM 信號，讓 `docker stop` 能優雅關閉。

`COPY --from=builder /app/node_modules ./node_modules` — 從 Build stage 只複製 node_modules。Build stage 的其他東西（npm cache 等）都不帶過來。

`USER node` — 切換到 node 使用者。node:alpine 這個 base image 已經內建了 node 使用者。注意 USER 要放在 COPY 之後，因為 COPY 預設用 root 權限。

`HEALTHCHECK` — 每 30 秒用 wget 打一次 `/health` 端點。Alpine 有 wget 但沒有 curl，所以用 wget。`--start-period=5s` 表示容器啟動後先等 5 秒再開始檢查，給 Node.js 一點啟動時間。

`ENTRYPOINT ["dumb-init", "--"]` + `CMD ["node", "server.js"]` — dumb-init 當 PID 1，Node.js 是子程序。分開寫的好處是 CMD 可以被 docker run 覆蓋，方便 debug。

驗證：

```bash
docker build -t hello-api:prod .
docker run -d -p 3000:3000 --name test hello-api:prod

# 等 30 秒讓 HEALTHCHECK 執行
sleep 35

docker exec test whoami
# node ← 不是 root

docker ps
# STATUS: Up 35s (healthy) ← 健康檢查通過

docker images hello-api:prod
# SIZE: ~130MB ← 合理大小

time docker stop test
# real    0m1.xxx ← 1-2 秒優雅關閉，不是 10 秒

docker rm test
```

大家看到了嗎？從一個五行的玩具 Dockerfile，到一個考慮了 Multi-stage、安全性、信號處理、健康檢查的生產級 Dockerfile。差距不只是行數，是思維方式。

有同學做出來的嗎？做出來的同學給自己鼓個掌。

有問題嗎？好，那我們進入今天的壓軸——第三題。

---

## 四、練習三：Code Review（25 分鐘）★★★

### 4.1 題目說明（5 分鐘）

好，第三題。這題換一個角度——我不要你寫 Dockerfile，我要你像一個資深工程師一樣，做 **Code Review**。

我給你一個 Dockerfile，它能 build、能 run、功能上沒問題。但是它有 **8 個問題**。你的任務是把這 8 個問題全部找出來，說明為什麼是問題，以及怎麼修正。

來，先看這個 Dockerfile：

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

我給大家一些提示方向：Base Image、版本號、Layer 數量、快取順序、多餘工具、root 權限、CMD 格式、環境變數。

不只是 8 個，你能找出更多的話更好。8 個是最低要求。

這題有挑戰性。因為看一個 Dockerfile 能不能跑，跟看一個 Dockerfile 寫得好不好，是完全不同的技能。第二個技能需要經驗和知識的積累。

好，時間開始。大家有 15 分鐘思考和寫答案。可以先在紙上或筆記上列出你找到的問題。

### 4.2 給學生做題（15 分鐘）

（講師巡場，適時給提示）

如果學生卡住，可以提示：
- 「你看 FROM 那行，有什麼你覺得不太對的地方嗎？」
- 「用 ubuntu 然後再裝 Python......有沒有更好的做法？」
- 「COPY . . 放在那個位置，對 cache 有什麼影響？」
- 「CMD 那行的寫法，上堂課我們說過有什麼問題？」
- 「如果這是生產環境，你覺得安全性上有什麼問題？」

### 4.3 互動式講解答案（15 分鐘）

好，時間到。我們一起來看。我用互動的方式講，一個問題一個問題來。

**「好，先看第一行。FROM ubuntu。有沒有人看出問題了？」**

（等學生回答）

對！沒有版本號。`FROM ubuntu` 等於 `FROM ubuntu:latest`。今天拉到的可能是 Ubuntu 22.04，明天可能就變成 24.04 了。你的 Dockerfile 不具備可重現性，在不同時間 build 可能得到不同結果。

**修正：** 指定版本號。但更好的做法是——根本不要用 ubuntu 做 base image。你看下一行就知道了。

**「第二個問題——這個 Dockerfile 要跑的是 Python 應用，對吧？那用 ubuntu 再裝 Python，是不是有點多此一舉？」**

對！Docker Hub 上有官方的 Python 映像檔，已經幫你裝好 Python 了。你用 `python:3.11-slim`，不但省掉了安裝 Python 的步驟，映像檔還更小、更乾淨。這就像你要開車，不需要先買一塊地再自己蓋一個車庫，直接去停車場就好了。

**修正：** `FROM python:3.11-slim`

**「第三個問題——看這兩行：`RUN apt-get update` 然後 `RUN apt-get install`。分成兩行有什麼問題？」**

（等學生回答）

對！如果 Docker build cache 把 `apt-get update` 那層 cache 住了，下次 build 的時候 `apt-get install` 可能會用到過期的套件列表，導致安裝失敗或者裝到舊版本。而且分成兩層，底層的 apt cache 沒被清理，佔空間。

**修正：** 合併成一個 RUN：`RUN apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*`

但等一下，如果我們用了 `python:3.11-slim`，這行可能根本就不需要了。

**「第四個問題——`curl vim wget htop`。大家覺得生產環境需要這些工具嗎？」**

不需要！vim、htop 是給人用的 debug 工具。生產環境的映像檔應該越乾淨越好。每多裝一個套件，就多一個潛在的安全漏洞。curl 或 wget 可能 HEALTHCHECK 需要保留一個，但 vim 和 htop 絕對不需要。

**修正：** 移除不必要的工具。

**「第五個問題——三個 pip install 分三個 RUN。這樣有什麼問題？」**

（等學生回答）

多餘的 Layer！每一個 RUN 都是一個 layer。三個 pip install 完全可以合在一起。更好的做法是用 `requirements.txt`：

```
flask
requests
gunicorn
```

然後一行搞定：`RUN pip install --no-cache-dir -r requirements.txt`

`--no-cache-dir` 是告訴 pip 不要保留下載快取，省空間。

**「第六個問題——看 COPY 和 pip install 的順序。COPY . . 放在 pip install 前面，有什麼問題？」**

這是 cache 策略的問題！`COPY . .` 會複製所有原始碼進去。只要你改了任何一個 .py 檔案，這一層的 cache 就失效了，後面的 pip install 也跟著重新執行。

但 requirements.txt 可能根本沒變啊！你不需要每次改程式碼都重新安裝依賴。

**修正：** 先 COPY requirements.txt，裝完依賴，再 COPY . .

```dockerfile
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
```

**「第七個問題——`ENV FLASK_ENV=development`。這個設定在生產環境好不好？」**

當然不好！`FLASK_ENV=development` 會啟用 Flask 的 debug 模式，顯示詳細的錯誤訊息、啟用自動重載。在生產環境，詳細的錯誤訊息可能洩漏你的程式碼結構、資料庫連線字串等敏感資訊。

**修正：** `ENV FLASK_ENV=production`

**「最後，第八個問題——`CMD python3 app.py`。這個寫法叫什麼？」**

Shell Form！它會透過 `/bin/sh -c` 來執行。PID 1 是 shell，不是你的 Python 程序。信號不會被正確轉發，docker stop 可能要等 10 秒才能停下來。

**修正：** `CMD ["python3", "app.py"]` 或者更好，用 gunicorn：`CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]`

既然你都裝了 gunicorn 了，為什麼不用呢？gunicorn 是 Python 的生產級 WSGI 伺服器，比直接用 Flask 內建的開發伺服器好得多。

**加分題：**

除了這 8 個問題之外，還有幾個可以改善的地方：

- **沒有 WORKDIR** — 所有東西都在根目錄，不整潔。
- **沒有 USER** — 用 root 跑應用，安全風險。
- **沒有 HEALTHCHECK** — Docker 無法監控應用是否健康。
- **沒有 .dockerignore** — build context 可能包含不需要的檔案。
- **沒有 Multi-stage Build** — 但 Python 不需要編譯，所以這個是可選的。

### 4.4 展示修正後的完整 Dockerfile

好，如果把所有問題都修正，最終的 Dockerfile 長這樣：

```dockerfile
FROM python:3.11-slim
WORKDIR /app

# 先複製依賴清單，利用 cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 再複製原始碼
COPY . .

# 建立非 root 使用者
RUN useradd -r appuser
USER appuser

ENV FLASK_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

跟原本的比較一下：

| 面向 | 原本 | 修正後 |
|------|------|--------|
| Base Image | ubuntu（沒版本號） | python:3.11-slim |
| 映像大小 | 可能 > 500MB | ~150MB |
| 安全性 | root 執行、裝了一堆工具 | 非 root、最小化安裝 |
| Cache 效率 | 每次改程式碼都重裝依賴 | 只改程式碼不重裝依賴 |
| 信號處理 | Shell Form，10 秒強制 kill | Exec Form，優雅關閉 |
| 可觀測性 | 無 HEALTHCHECK | 有 HEALTHCHECK |

大家看到差距了嗎？同樣的功能，但品質完全不同。這就是一個初級工程師和資深工程師寫 Dockerfile 的差別。

好，第三題到這裡結束。大家做得怎麼樣？能找到 5 個以上的舉個手？找到 8 個的呢？找到 8 個以上的同學，你已經具備 Code Review 的能力了。

---

## 五、結尾（5 分鐘）

### 5.1 回顧三堂 Dockerfile 課

好，我們快速回顧一下 Dockerfile 三堂課的學習路徑：

| 堂次 | 學了什麼 | 你達到的能力 |
|------|---------|-------------|
| Hour 10 | 所有指令 + 第一個 Dockerfile | **能寫出可以跑的 Dockerfile** |
| Hour 11 | Multi-stage、Best Practices、docker push | **能寫出優化過的 Dockerfile** |
| Hour 12 | 實戰練習：從基礎到生產級到 Code Review | **能實際動手寫、能看出別人的問題** |

```
Hour 10：能寫 → Hour 11：寫得好 → Hour 12：實際能用
```

今天的三個練習題，就是把前兩堂課的知識全部串起來。第一題確認基本功，第二題確認你會 Multi-stage 和安全性，第三題確認你有 Code Review 的眼光。

如果你三題都做出來了，恭喜你，Dockerfile 這個技能你已經掌握了。回去公司就可以開始用了。

### 5.2 下堂課預告

好，Dockerfile 三部曲到此結束。

但真實的系統不只有一個容器。前端 + 後端 API + 資料庫 + 快取 = 至少四個容器。一個一個 `docker run` 管理？那會非常痛苦。

下一堂課：**Docker Compose** — 用一個 YAML 檔案定義所有服務，一個指令啟動整個系統。

---

## 板書 / PPT 建議

1. **三題概覽表**：題目、難度星級、時間分配
2. **練習一的 Dockerfile**：五行最簡版本
3. **練習二的 Dockerfile**：生產級版本，標注 Multi-stage、USER、HEALTHCHECK
4. **練習三的錯誤 Dockerfile**：用紅色標出 8 個問題
5. **練習三的修正 Dockerfile**：用綠色標出修正後的寫法
6. **修正前後對照表**：Base Image、映像大小、安全性、Cache 效率、信號處理
7. **三堂課學習路徑**：Hour 10 能寫 → Hour 11 寫得好 → Hour 12 實際能用
