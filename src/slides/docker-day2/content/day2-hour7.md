# Day 2 第七小時：實作練習與 Day 2 總結

---

## 一、前情提要（2 分鐘）

Day 2 學完：
- 容器概念與架構
- Docker 安裝
- 基本指令
- Nginx 實戰

本堂課：綜合練習 + 常見問題 + 總複習

---

## 二、綜合練習題（30 分鐘）

### 練習一：基礎操作

```bash
docker pull httpd:alpine
docker run -d --name apache -p 9090:80 httpd:alpine
curl http://localhost:9090
docker logs apache
docker stop apache && docker rm apache
```

### 練習二：進入容器操作

```bash
docker run -it --name my-ubuntu ubuntu bash
# 在容器內
apt update && apt install -y curl
curl -I https://www.google.com
exit
docker rm my-ubuntu
```

### 練習三：Volume 掛載

```bash
mkdir -p ~/practice-site
echo '<h1>Home</h1>' > ~/practice-site/index.html

docker run -d --name practice-web \
  -p 8888:80 \
  -v ~/practice-site:/usr/share/nginx/html:ro \
  nginx:alpine
```

### 練習四：多容器管理

```bash
docker run -d --name web-nginx -p 8001:80 nginx:alpine
docker run -d --name web-apache -p 8002:80 httpd:alpine
docker ps
docker stop web-nginx web-apache
docker rm web-nginx web-apache
```

---

## 三、常見問題排除（10 分鐘）

### 容器無法啟動

```bash
docker ps -a              # 查看退出狀態
docker logs <container>   # 查看日誌
```

| Exit Code | 意義 |
|-----------|------|
| 0 | 正常結束 |
| 1 | 一般錯誤 |
| 137 | OOM 或被 kill |

### Port 被佔用

```bash
lsof -i :8080
# 或換 port
docker run -d -p 8081:80 nginx
```

### 映像檔拉取失敗

```bash
docker search nginx   # 確認名稱
docker login          # 登入
```

### 磁碟空間不足

```bash
docker system df
docker system prune -a
```

### Volume 權限問題

```bash
chmod -R 777 ~/my-data
# 或
docker run -u $(id -u):$(id -g) ...
```

---

## 四、Day 2 總複習（12 分鐘）

### 核心概念

| 概念 | 說明 |
|-----|------|
| 容器 | 輕量虛擬化，共用主機核心 |
| Image | 唯讀模板 |
| Container | Image 的執行實例 |
| Registry | 存放 Image 的倉庫 |

### 架構

```
Docker Client → Docker Daemon → containerd → runc → Container
```

### 指令速查

**映像檔**

| 指令 | 功能 |
|-----|------|
| docker pull | 拉取 |
| docker images | 列出 |
| docker rmi | 刪除 |

**容器**

| 指令 | 功能 |
|-----|------|
| docker run | 執行 |
| docker ps | 列出 |
| docker stop/start | 啟停 |
| docker rm | 刪除 |
| docker logs | 日誌 |
| docker exec | 進入 |

### docker run 參數

| 參數 | 功能 |
|-----|------|
| -d | 背景執行 |
| -it | 互動模式 |
| --name | 指定名稱 |
| -p | Port Mapping |
| -v | Volume 掛載 |
| -e | 環境變數 |
| --rm | 自動刪除 |

---

## 五、Docker 網路先導（5 分鐘）

- `--link` 是舊做法，現在不建議在新專案使用
- 自定義網路可以提供容器名稱解析，讓服務彼此更容易互通
- 需要跨網路互連時，可以用 `docker network connect` 把容器接進第二個網路

### 容器互聯：--link（已不建議）

- 早期可用 `--link` 讓容器透過名稱找到另一個容器
- 本質是在 `/etc/hosts` 寫入對應 IP，維護成本高且不夠彈性

```bash
docker run -d -P --name tomcat03 --link tomcat02 tomcat
docker exec -it tomcat03 ping tomcat02
```

### 自定義網路（推薦）

- 建立自定義 bridge 網路後，容器之間可直接用名稱互相存取
- 這是多容器應用與服務分群的基礎做法

### 跨網路連通：docker network connect

- 容器可以同時連到多個網路，負責不同服務群組之間的連線
- 實務上常用來處理跨網段或分層部署場景

---

## 六、預告 Day 3（3 分鐘）

- 映像檔分層結構
- 容器網路
- **Dockerfile**：自己建立映像檔
- Docker Compose

---

## 七、本堂課小結（3 分鐘）

- 今天已經完成 Docker 安裝、基本指令與 Nginx 容器實作
- 綜合練習與錯誤排除，已把常見操作流程串成完整心智模型
- 下一步會把重點接到映像分層、容器網路與 Dockerfile

---

## 八、課後作業（自選）

```bash
# MySQL 容器練習
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -p 3306:3306 \
  mysql:8.0
```

---

## 板書 / PPT 建議

1. 指令速查表
2. 常見錯誤對照表
3. Docker 工作流程圖
4. Day 2 知識點心智圖
