# Docker 課程時間規劃

## 重要說明

- **每小時講課內容**：約 50-55 分鐘
- **動手操作/測驗**：額外 5-15 分鐘（不計入講課時間）
- **休息時間**：每 2 小時正式休息 10 分鐘

---

## Day 2 時間表（7 小時講課 + 額外實作）

| 時段 | 內容 | 講課時間 | 實作/測驗 | 備註 |
|------|------|----------|-----------|------|
| Hour 1 | 環境一致性問題與容器技術 | 55 分鐘 | +5 分鐘測驗 | |
| Hour 2 | Docker 架構與工作原理 | 55 分鐘 | +8 分鐘操作 | |
| **休息** | | | 10 分鐘 | |
| Hour 3 | Docker 安裝與環境設置 | 45 分鐘 | +15 分鐘安裝 | 確保全員安裝成功 |
| Hour 4 | Docker 基本指令（上） | 50 分鐘 | +10 分鐘操作 | |
| **午休** | | | 60 分鐘 | 假設有午休 |
| Hour 5 | Docker 基本指令（下） | 50 分鐘 | +10 分鐘操作 | |
| Hour 6 | Nginx 容器實戰 | 40 分鐘 | +20 分鐘操作 | 重點實作課 |
| **休息** | | | 10 分鐘 | |
| Hour 7 | 實作練習與 Day2 總結 | 30 分鐘 | +30 分鐘綜合練習 | 學員獨立操作 |

**Day 2 總計**：
- 講課：約 5.5 小時
- 實作/測驗：約 1.5 小時
- 休息：30 分鐘

---

## Day 3 時間表（7 小時講課 + 額外實作）

| 時段 | 內容 | 講課時間 | 實作/測驗 | 備註 |
|------|------|----------|-----------|------|
| Hour 8 | Volume 資料持久化 | 50 分鐘 | +10 分鐘操作 | Named Volume / Bind Mount / tmpfs |
| Hour 9 | 容器網路與 Port Mapping 進階 | 50 分鐘 | +10 分鐘操作 | bridge/host/none、自訂網路、DNS |
| **休息** | | | 10 分鐘 | |
| Hour 10 | Dockerfile 基礎 | 50 分鐘 | +10 分鐘操作 | 全部指令、CMD vs ENTRYPOINT |
| Hour 11 | Dockerfile 進階與最佳化 | 50 分鐘 | +10 分鐘操作 | Multi-stage、Best Practices、docker push |
| **午休** | | | 60 分鐘 | |
| Hour 12 | Dockerfile 實戰與映像檔發佈 | 50 分鐘 | +15 分鐘操作 | Node.js+TS、Spring Boot、troubleshooting |
| Hour 13 | Docker Compose 基礎與進階 | 50 分鐘 | +10 分鐘操作 | compose.yaml、networks、depends_on |
| **休息** | | | 10 分鐘 | |
| Hour 14 | Docker Compose 實戰與課程總結 | 45 分鐘 | +15 分鐘操作 | WordPress 部落格系統、K8s 銜接 |

**Day 3 總計**：
- 講課：約 5.8 小時
- 實作/測驗：約 1.3 小時
- 休息：30 分鐘

---

## 每小時結構模板

```
┌─────────────────────────────────────────────────────────┐
│  0:00 - 0:50   講課內容                                │
│  0:50 - 0:55   本堂小結                                │
├─────────────────────────────────────────────────────────┤
│  額外時間      動手操作 或 小測驗（5-20 分鐘）          │
│               ↳ 講師可休息、巡視                       │
└─────────────────────────────────────────────────────────┘
```

---

## 實作重點課（講師可多休息）

以下課程的實作時間較長，講師可以趁機休息：

| 課程 | 實作時間 | 實作內容 | 講師休息機會 |
|------|----------|----------|--------------|
| Hour 3 | 15 分鐘 | 安裝 Docker | 巡視協助 |
| Hour 6 | 20 分鐘 | Nginx 完整部署 | 坐下休息 |
| Hour 7 | 30 分鐘 | 綜合練習 | 完全休息 |
| Hour 12 | 15 分鐘 | Dockerfile 實戰與 Code Review | 巡視答疑 |
| Hour 14 | 15 分鐘 | Compose 多服務實戰 + 排錯 | 巡視答疑 |

---

## 動手操作清單

### Day 2

**Hour 1：測驗（5 分鐘）**
- 3 題選擇題
- 1 題討論題

**Hour 2：操作（8 分鐘）**
```bash
docker version
docker info
```

**Hour 3：安裝（15 分鐘）**
```bash
# 安裝 Docker
# 執行 docker run hello-world
```

**Hour 4：操作（10 分鐘）**
```bash
docker pull nginx:alpine
docker run -d --name my-web -p 8080:80 nginx:alpine
# 瀏覽器訪問確認
```

**Hour 5：操作（10 分鐘）**
```bash
docker exec -it <container> sh
# 找出 nginx 版本
docker cp 自己的檔案 container:/path
```

**Hour 6：操作（20 分鐘）**
```bash
# 建立 HTML 檔案
# 啟動 nginx 掛載 volume
# 自訂 nginx.conf
# 瀏覽器確認結果
```

**Hour 7：綜合練習（30 分鐘）**
```bash
# 三容器架構
# nginx + redis + alpine worker
# 自訂網路 + DNS 測試
```

### Day 3

**Hour 8：Volume 操作（10 分鐘）**
```bash
docker volume create my-data
docker run -d -v my-data:/var/lib/mysql mysql:8
# 刪容器 → 新容器掛同 volume → 驗證資料還在
```

**Hour 9：網路操作（10 分鐘）**
```bash
docker network create my-net
docker run -d --name web --network my-net nginx
docker run -d --name db --network my-net mysql:8
# 用容器名稱互 ping
```

**Hour 10：Dockerfile 操作（10 分鐘）**
```bash
# 寫第一個 Dockerfile（Python Flask）
docker build -t my-app .
docker run -p 5000:5000 my-app
```

**Hour 11：Dockerfile 進階操作（10 分鐘）**
```bash
# Multi-stage Build
# 比較單階段 vs 多階段映像檔大小
docker push username/my-app:v1
```

**Hour 12：Dockerfile 實戰（15 分鐘）**
```bash
# Node.js + TypeScript 生產級 Dockerfile
# Spring Boot Dockerfile
# troubleshooting 練習
```

**Hour 13：Docker Compose 操作（10 分鐘）**
```bash
# 三層架構：Nginx + Node.js + MySQL
docker compose up -d
docker compose logs -f
docker compose down
```

**Hour 14：Compose 實戰（15 分鐘）**
```bash
# WordPress + Nginx + MySQL + Redis 部落格系統
docker compose up -d
# 驗證四個服務正常運作
```

---

## 測驗使用方式

### 選項 A：舉手搶答
1. 投影題目
2. 學員舉手
3. 點名回答
4. 講解正確答案

### 選項 B：紙筆測驗
1. 發測驗紙
2. 學員作答（3-5 分鐘）
3. 公布答案自我評分
4. 討論錯誤選項

### 選項 C：線上即時測驗
- 使用 Kahoot
- 使用 Mentimeter
- 使用 Google Forms

---

## 講師休息攻略

| 情況 | 建議 |
|------|------|
| 學員安裝軟體 | 坐下休息，只處理舉手問題 |
| 動手操作進行中 | 喝水、看手機、回覆訊息 |
| 小測驗進行中 | 完全休息，等答題結束 |
| 綜合練習 | 可以離開教室短暫休息 |

**提醒**：
- 設定計時器，到時間就收回
- 操作完成的學員可以協助其他人
- 準備「進階挑戰」給快速完成的學員

---

## 進階挑戰（給快速完成的學員）

### Hour 4 進階
```bash
# 額外挑戰：同時啟動 5 個 nginx，port 8081-8085
```

### Hour 6 進階
```bash
# 額外挑戰：設定 nginx 反向代理到另一個容器
```

### Hour 10 進階
```bash
# 額外挑戰：一個容器連接兩個網路
```

### Hour 13 進階
```bash
# 額外挑戰：加入健康檢查 HEALTHCHECK
```
