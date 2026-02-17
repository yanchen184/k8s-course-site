# 第二堂下午 — Docker 入門

> **課程時段：** 13:00 – 17:00（240 分鐘）
> **字數密度：** 150 字／分鐘

---

## 📋 投影片總覽

| # | 投影片標題 | 時段 | 分鐘 | 目標字數 |
|---|-----------|------|------|---------|
| 1 | 為什麼需要容器？ | 一、容器的誕生背景 | 15 | 2,250 |
| 2 | 容器 vs 虛擬機 | 一、容器的誕生背景 | 15 | 2,250 |
| 3 | Docker 架構介紹 | 二、Docker 核心概念 | 15 | 2,250 |
| 4 | Docker 安裝與驗證 | 二、Docker 核心概念 | 10 | 1,500 |
| 5 | docker pull 下載 Image | 三、Docker 基本指令 | 10 | 1,500 |
| 6 | docker images 查看與管理 | 三、Docker 基本指令 | 10 | 1,500 |
| 7 | docker run 執行容器 | 三、Docker 基本指令 | 20 | 3,000 |
| 8 | docker ps 查看容器 | 三、Docker 基本指令 | 10 | 1,500 |
| 9 | docker stop/start/rm | 三、Docker 基本指令 | 10 | 1,500 |
| 10 | ☕ 休息時間 | 中場休息 | 15 | 500 |
| 11 | 第一個 nginx 容器 | 四、實際操作練習 | 20 | 3,000 |
| 12 | docker exec 進入容器 | 四、實際操作練習 | 15 | 2,250 |
| 13 | docker logs 查看日誌 | 四、實際操作練習 | 10 | 1,500 |
| 14 | Docker Hub 介紹 | 五、Docker 生態系統 | 10 | 1,500 |
| 15 | -v Volume 掛載基礎 | 五、Docker 生態系統 | 15 | 2,250 |
| 16 | Docker 網路模式 | 五、Docker 生態系統 | 10 | 1,500 |
| 17 | 實作：自訂 nginx 首頁 | 六、綜合實作 | 20 | 3,000 |
| 18 | docker inspect | 六、綜合實作 | 10 | 1,500 |
| 19 | 今日總結與指令表 | 七、總結 | 10 | 1,500 |
| 20 | 下堂課預告 & Q&A | 七、總結 | 10 | 1,500 |
| | **合計** | | **240** | **36,000** |

---

## 🗂 課程章節結構

```
一、容器的誕生背景     (投影片 1–2,  30 分鐘)
二、Docker 核心概念    (投影片 3–4,  25 分鐘)
三、Docker 基本指令    (投影片 5–9,  60 分鐘)
── 中場休息 ──         (投影片 10,   15 分鐘)
四、實際操作練習       (投影片 11–13, 45 分鐘)
五、Docker 生態系統    (投影片 14–16, 35 分鐘)
六、綜合實作           (投影片 17–18, 30 分鐘)
七、總結               (投影片 19–20, 20 分鐘)
```

---

## 🛠 每張投影片包含的欄位

| 欄位 | 說明 |
|------|------|
| `title` | 投影片標題 |
| `subtitle` | 副標題 / 核心訊息 |
| `section` | 所屬章節 |
| `duration` | 預計講授時間 |
| `code` | 真實 Docker 指令範例與輸出 |
| `content` | 表格或補充內容（部分投影片） |
| `notes` | 口語講稿（2,250～3,000 字，自然口語風格） |

---

## 📦 Slide 介面定義

```tsx
export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  notes?: string
  duration?: string
}
```

---

## 🎯 學習目標

完成本堂課後，學員應能夠：

1. 解釋容器解決的核心問題（環境一致性）
2. 比較容器與虛擬機的差異
3. 描述 Docker 的五個核心元件
4. 執行完整的容器生命週期操作（pull → run → ps → logs → stop → rm）
5. 使用 `-d`、`-p`、`--name`、`--restart`、`-e` 等 run 參數
6. 進入容器內部（`docker exec -it`）
7. 使用 Bind Mount 和 Named Volume 持久化資料
8. 理解 Docker Network 並建立多容器互連
9. 使用 `docker inspect` 排查問題
10. 部署完整的靜態網站（nginx + Bind Mount）

---

## 📁 檔案結構

```
lesson2-afternoon/
├── index.tsx      ← 投影片資料（20 張）
└── README.md      ← 本說明文件
```

---

## 🔗 相關資源

- [Docker 官方文件](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker（免費線上沙盒）](https://labs.play-with-docker.com/)
- [Docker Cheat Sheet（官方）](https://docs.docker.com/get-started/docker_cheatsheet.pdf)

---

## 📝 授課注意事項

- **休息時間（投影片 10）**：提醒學員可以在休息時自己練習一次 `docker run nginx`，確認環境正常
- **投影片 7（docker run）**：這是本堂最核心的指令，建議多停留，讓學員跟著打一遍
- **投影片 11（nginx 容器實作）**：請確認所有學員都有看到瀏覽器的 nginx 頁面，再繼續
- **投影片 17（自訂首頁實作）**：Windows 使用者注意路徑格式，Bind Mount 路徑建議用絕對路徑
- **課後作業**：放在投影片 20 的 `code` 欄位，可截圖或列印給學員

---

*Generated: 2026-02-17 | 第二堂下午 Docker 入門 | 240 分鐘 | 20 張投影片*
