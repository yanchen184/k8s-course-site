# Day3 完整指令清單（Hour 8-14）

---

## Hour 8：Volume 資料持久化

### 1. -v 掛載語法概覽
```bash
# Bind Mount —— 左邊是主機路徑（斜線開頭）
docker run -v /home/user/html:/data nginx

# Volume —— 左邊是 Volume 名稱（沒有斜線開頭）
docker run -v my-data:/data nginx
```

### 2. Bind Mount 開發用法
```bash
# 先建立本機的 html 目錄和測試檔案（沒有這個目錄指令會失敗）
mkdir -p html
echo "<h1>Hello Docker!</h1>" > html/index.html

# 把本機的 html 目錄直接掛進容器，改本機檔案就能即時看到效果，適合開發階段
docker run -d -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html nginx:alpine

# 驗證：打開瀏覽器 http://localhost:8080 或用 curl
curl http://localhost:8080
```

### 3. 沒有 Volume 的 MySQL（資料會消失）
```bash
# 故意不掛 Volume 啟動 MySQL，等一下要證明容器刪掉後資料會跟著消失
docker run -d \
  --name mysql-no-volume \
  -e MYSQL_ROOT_PASSWORD=test123 \
  -e MYSQL_DATABASE=school \
  mysql:8.0
```

### 4. 進入 MySQL 容器寫入資料
```bash
# 進入 MySQL 互動模式，手動建表並寫入測試資料，為後面的消失實驗做準備
docker exec -it mysql-no-volume mysql -uroot -ptest123
```

### 5. 停止並刪除容器
```bash
# 模擬容器掛掉或被清除的情境——沒有 Volume 的話，容器內的資料會一起消失
docker stop mysql-no-volume
docker rm mysql-no-volume
```

### 6. 重新啟動相同容器，驗證資料消失
```bash
# 用一模一樣的參數重建容器，但它是全新的——之前寫入的資料已經不在了
docker run -d \
  --name mysql-no-volume \
  -e MYSQL_ROOT_PASSWORD=test123 \
  -e MYSQL_DATABASE=school \
  mysql:8.0
```

### 7. 查詢資料（預期失敗：資料已消失）
```bash
# 驗證資料確實消失了——這就是不用 Volume 的代價，容器一刪資料就沒了
docker exec -it mysql-no-volume mysql -uroot -ptest123 -e "SELECT * FROM school.students;"
```

### 8. 清掉無 Volume 容器
```bash
# 清理環境，準備下一個實驗（有 Volume 的版本）
docker stop mysql-no-volume && docker rm mysql-no-volume
```

### 9. 建立 Named Volume
```bash
# 建立一個獨立的 Volume，讓 MySQL 的資料在容器刪除後還能保留
docker volume create mysql-school-data
```

### 10. 有 Volume 的 MySQL（資料持久化）
```bash
# 這次掛上 Volume，資料會存在 Volume 裡而不是容器裡，容器刪了資料還在
docker run -d \
  --name mysql-with-volume \
  -e MYSQL_ROOT_PASSWORD=test123 \
  -e MYSQL_DATABASE=school \
  -v mysql-school-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

### 11. 進入有 Volume 的 MySQL 寫入資料
```bash
# 進入 MySQL 寫入測試資料，這些資料會被存到 Volume 裡
docker exec -it mysql-with-volume mysql -uroot -ptest123
```

### 12. 刪除容器後驗證 Volume 仍在
```bash
# 刪掉容器但不刪 Volume，用 volume ls 確認 Volume 還活著
docker stop mysql-with-volume
docker rm mysql-with-volume
docker volume ls
```

### 13. 用同一個 Volume 重建容器，驗證資料還在
```bash
# 重建容器並掛上同一個 Volume，資料應該還在——這就是 Volume 的核心價值
docker run -d \
  --name mysql-with-volume \
  -e MYSQL_ROOT_PASSWORD=test123 \
  -v mysql-school-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

### 14. 查詢資料（預期成功：資料保留）
```bash
# 驗證資料還在——容器砍了又重建，但 Volume 裡的資料沒有消失
docker exec -it mysql-with-volume mysql -uroot -ptest123 -e "SELECT * FROM school.students;"
```

### 15. 用 inspect 查看容器掛載狀態
```bash
# 查看容器的掛載細節，確認 Volume 的來源路徑和掛載點是否正確
docker inspect mysql-with-volume --format '{{json .Mounts}}' | python3 -m json.tool
```

### 16. 查看 Volume 本身的資訊
```bash
# 查看 Volume 實際存放在主機的哪個路徑、建立時間等 metadata
docker volume inspect mysql-school-data
```

### 17. 升級 MySQL 版本但保留資料
```bash
# 先砍掉舊版容器，再用新版 image 掛同一個 Volume 啟動——資料無痛升級
docker stop mysql-with-volume
docker rm mysql-with-volume

# 用 mysql:8.4 重建容器，掛同一個 Volume，驗證跨版本升級資料不會遺失
docker run -d \
  --name mysql-with-volume \
  -e MYSQL_ROOT_PASSWORD=test123 \
  -v mysql-school-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.4
```

### 18. 驗證升級後資料仍在 + 版本已更新
```bash
# 確認升級後資料沒有遺失，同時確認 MySQL 版本已經從 8.0 升到 8.4
docker exec -it mysql-with-volume mysql -uroot -ptest123 -e "SELECT * FROM school.students;"
docker exec -it mysql-with-volume mysql -uroot -ptest123 -e "SELECT VERSION();"
```

### 19. 常見錯誤：忘記設 MYSQL_ROOT_PASSWORD
```bash
# 故意漏掉密碼環境變數——容器會啟動失敗，體驗常見的踩坑情境
docker run -d --name mysql mysql:8.0
```

### 20. 密碼有特殊字元時用單引號
```bash
# 密碼含 $、& 等特殊字元時，用單引號避免 shell 誤解析
docker run -d -e MYSQL_ROOT_PASSWORD='my$ecr&t!' mysql:8.0
```

### 21. Named Volume 建立與使用
```bash
# 先建立有名字的 Volume，再掛載到容器——有名字方便日後管理和辨識
docker volume create mysql-data
docker run -e MYSQL_ROOT_PASSWORD=secret123 -v mysql-data:/var/lib/mysql mysql:8.0
```

### 22. Anonymous Volume（不建議）
```bash
# 沒給名字的 Volume 會產生亂碼 ID，之後很難找回或管理
docker run -e MYSQL_ROOT_PASSWORD=secret123 -v /var/lib/mysql mysql:8.0
```

### 23. Volume 管理指令
```bash
# 建立 Volume
docker volume create mydata
# 列出所有 Volume
docker volume ls
# 查看 Volume 詳細資訊（存放路徑等）
docker volume inspect mydata
# 刪除指定 Volume
docker volume rm mydata
# 清除所有沒有被任何容器使用的 Volume
docker volume prune
```

### 24. 唯讀掛載與可讀可寫掛載
```bash
# 唯讀掛載
docker run -v my-data:/data:ro nginx:alpine

# 可讀可寫（預設）
docker run -v my-data:/data:rw nginx:alpine
```

### 25. 唯讀掛載實際範例
```bash
# Nginx 設定檔
docker run -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine

# 應用程式設定
docker run -v ./config.yaml:/app/config.yaml:ro myapp

# TLS 憑證
docker run \
  -v /etc/ssl/certs/server.crt:/certs/server.crt:ro \
  -v /etc/ssl/private/server.key:/certs/server.key:ro \
  myapp
```

### 26. --mount 語法（官方推薦）
```bash
# Volume 掛載
docker run --mount type=volume,source=my-data,target=/data nginx:alpine

# Bind Mount 掛載
docker run --mount type=bind,source=/host/path,target=/container/path nginx:alpine

# 唯讀掛載
docker run --mount type=volume,source=my-data,target=/data,readonly nginx:alpine

# tmpfs 掛載
docker run --mount type=tmpfs,target=/tmp,tmpfs-size=100m nginx:alpine
```

### 27. 多容器共用 Volume
```bash
# 建立共用 Volume，讓多個容器可以透過同一個 Volume 交換資料
docker volume create shared-data

# 寫入者容器
docker run -d \
  --name writer \
  -v shared-data:/data \
  busybox \
  sh -c 'while true; do date >> /data/log.txt; sleep 1; done'

# 讀取者容器（唯讀）
docker run -it --rm \
  --name reader \
  -v shared-data:/data:ro \
  busybox \
  tail -f /data/log.txt
```

### 28. 清掉 writer 容器
```bash
# 清理環境，結束多容器共用 Volume 的實驗
docker stop writer && docker rm writer
```

### 29. MySQL 備份與還原
```bash
# 備份
docker exec mysql-with-volume \
  mysqldump -uroot -ptest123 school > school-backup.sql

# 還原
docker exec -i mysql-with-volume \
  mysql -uroot -ptest123 school < school-backup.sql
```

### 30. 通用 Volume 備份（臨時容器 + tar）
```bash
# 備份
docker run --rm \
  -v mysql-school-data:/source:ro \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/mysql-school-data-backup.tar.gz -C /source .

# 還原
docker run --rm \
  -v mysql-school-data:/target \
  -v $(pwd):/backup \
  alpine \
  sh -c "cd /target && tar xzf /backup/mysql-school-data-backup.tar.gz"
```

### 31. Volume 管理指令速查
```bash
docker volume create <name>
docker volume ls
docker volume inspect <name>
docker volume rm <name>
docker volume prune

docker run -v <volume>:<path>
docker run -v <volume>:<path>:ro
docker run -v $(pwd)/dir:<path>
docker inspect <container> --format '{{json .Mounts}}'
```

---

## Hour 9：容器網路 + Port Mapping 進階

### 1. 列出所有 Docker 網路
```bash
# 先看看 Docker 預設建了哪些網路（bridge、host、none）
docker network ls
```

### 2. Host 網路模式
```bash
# 用 host 模式讓容器直接共用主機的網路，不需要 port mapping
docker run -d --name web-host --network host nginx:alpine
# 確認 host 模式下容器沒有自己的 IP（因為直接用主機的）
docker inspect web-host --format '{{.NetworkSettings.IPAddress}}'
# 清理環境
docker rm -f web-host
```

### 3. None 網路模式（完全隔離）
```bash
# 用 none 模式建立完全沒有網路的容器，適合安全性要求高的場景
docker run -d --name isolated --network none alpine sleep 3600
# 驗證容器只有 loopback，沒有任何外部網路介面
docker exec isolated ip addr
# 清理環境
docker rm -f isolated
```

### 4. 建立自訂 Bridge 網路（支援 DNS）
```bash
# 建立自訂網路——跟預設 bridge 最大差異是支援容器名稱 DNS 解析
docker network create my-network
# 確認網路已建立
docker network ls
# 查看網路的子網段、閘道等詳細設定
docker network inspect my-network
```

### 5. 建立指定子網段的網路
```bash
# 手動指定子網段和閘道，避免跟其他網路衝突，適合多環境並存時使用
docker network create \
  --subnet 192.168.100.0/24 \
  --gateway 192.168.100.1 \
  my-custom-network
```

### 6. 自訂網路中容器名稱互連
```bash
# 啟動 MySQL 容器加入自訂網路
docker run -d \
  --name mysql-server \
  --network my-network \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  mysql:8.0

# 用名稱 ping MySQL（成功）
docker run -it --rm \
  --network my-network \
  alpine ping -c 3 mysql-server
```

### 7. 預設 bridge 不支援 DNS（對比）
```bash
# 在預設 bridge 網路上建容器，等一下要證明它不支援用名稱互連
docker run -d --name test-container alpine sleep 3600
# 預期失敗——預設 bridge 沒有 DNS 解析，只能用 IP 互連
docker run -it --rm alpine ping -c 3 test-container
# 清理環境
docker rm -f test-container
```

### 8. 查看 Docker 內建 DNS 設定
```bash
# 看自訂網路容器的 DNS 設定——會指向 Docker 內建的 127.0.0.11 DNS 伺服器
docker run -it --rm --network my-network alpine cat /etc/resolv.conf
```

### 9. 網路別名（--network-alias）
```bash
# 給容器取一個短別名 "db"，其他容器用 "db" 就能連到它，不用記完整名稱
docker run -d \
  --name mysql-prod-v8 \
  --network my-network \
  --network-alias db \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  mysql:8.0

# 兩個名稱都能解析
docker run -it --rm --network my-network alpine ping -c 1 mysql-prod-v8
docker run -it --rm --network my-network alpine ping -c 1 db
```

### 10. 多容器共用同一別名（DNS 輪詢）
```bash
# 三個容器共用同一個別名 "web"，Docker DNS 會輪流回傳不同 IP（類似負載均衡）
docker run -d --name web1 --network my-network --network-alias web nginx:alpine
docker run -d --name web2 --network my-network --network-alias web nginx:alpine
docker run -d --name web3 --network my-network --network-alias web nginx:alpine

# 驗證 DNS 輪詢——nslookup "web" 會回傳三個不同的 IP
docker run -it --rm --network my-network alpine nslookup web

# 清理環境
docker rm -f web1 web2 web3 mysql-prod-v8
```

### 11. 多網路隔離：前端與後端分離
```bash
# 建立兩個網路
docker network create frontend-net
docker network create backend-net

# MySQL 加入 backend-net
docker run -d \
  --name db \
  --network backend-net \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:8.0

# API 加入 backend-net
docker run -d \
  --name api \
  --network backend-net \
  alpine sleep 3600

# API 也加入 frontend-net
docker network connect frontend-net api

# Nginx 加入 frontend-net
docker run -d \
  --name nginx \
  --network frontend-net \
  nginx:alpine
```

### 12. 驗證網路隔離
```bash
# API → MySQL（成功）
docker exec api ping -c 2 db

# Nginx → API（成功）
docker exec nginx ping -c 2 api

# Nginx → MySQL（失敗！隔離生效）
docker exec nginx ping -c 2 db
```

### 13. 清理多網路實驗
```bash
# 清理環境，移除所有實驗用的容器和網路
docker rm -f nginx api db
docker network rm frontend-net backend-net
```

### 14. 網路管理指令速查
```bash
docker network ls
docker network inspect my-network
docker network create my-network
docker network create --subnet 10.0.0.0/24 my-network
docker network rm my-network
docker network prune
docker network connect my-network my-container
docker network disconnect my-network my-container
```

### 15. 臨時除錯容器加入網路
```bash
# 建立一個臨時容器，專門用來排查網路問題
docker run -d --name debug alpine sleep 3600
# 動態加入目標網路，不用重建容器就能連進去偵錯
docker network connect backend-net debug
# 進入容器互動模式，可以用 ping、nslookup 等工具排查
docker exec -it debug sh
# 偵錯完畢，斷開網路連線
docker network disconnect backend-net debug
# 清理臨時除錯容器
docker rm -f debug
```

### 16. 滾動更新模式
```bash
# 先跑舊版
docker run -d --name web-v1 --network my-network nginx:1.24-alpine
# 新版上線，暫時新舊並存
docker run -d --name web-v2 --network my-network nginx:1.25-alpine
# 確認新版正常後，把舊版從網路斷開並移除——零停機更新
docker network disconnect my-network web-v1
docker rm -f web-v1
```

### 17. 練習：connect / disconnect
```bash
# 建立測試網路
docker network create test-net
# box1 一開始就在 test-net 裡
docker run -d --name box1 --network test-net alpine sleep 3600
# box2 先不加入 test-net
docker run -d --name box2 alpine sleep 3600
# 動態把 box2 加入 test-net
docker network connect test-net box2
# 驗證 box1 可以 ping 到 box2（因為現在同一個網路了）
docker exec box1 ping -c 2 box2
# 把 box2 從 test-net 斷開
docker network disconnect test-net box2
# 驗證斷開後 box1 就 ping 不到 box2 了
docker exec box1 ping -c 2 box2
# 清理環境
docker rm -f box1 box2
docker network rm test-net
```

### 18. Port Mapping 基本用法
```bash
# 把主機的 8080 port 轉發到容器的 80 port，這樣外部才能連進來
docker run -d -p 8080:80 --name web nginx:alpine
```

### 19. 綁定 127.0.0.1（只有本機能連）
```bash
# 綁定 127.0.0.1 讓服務只對本機開放，外部主機無法連入，更安全
docker run -d -p 127.0.0.1:8080:80 --name web-local nginx:alpine
```

### 20. 綁定特定 IP（內網限定）
```bash
# 綁定內網 IP，只有同網段的機器才能連入，適合內部服務
docker run -d -p 192.168.1.100:8080:80 --name internal-web nginx:alpine
```

### 21. Port 範圍映射 + 多 Port 映射
```bash
# 一次映射一整段 port 範圍，省去逐個寫的麻煩
docker run -d -p 8080-8085:80-85 --name range-test alpine sleep 3600

# 一個容器映射多個 port（HTTP + HTTPS）
docker run -d \
  -p 8080:80 \
  -p 8443:443 \
  --name multi-port \
  nginx:alpine

# 清理環境
docker rm -f range-test multi-port 2>/dev/null
```

### 22. 指定 UDP 協定
```bash
# DNS 等服務用 UDP 協定，port mapping 預設是 TCP，要手動指定 /udp
docker run -d -p 5353:53/udp --name dns-server alpine sleep 3600
# 同時映射 TCP 和 UDP，確保兩種協定都能通
docker run -d -p 5353:53/tcp -p 5353:53/udp --name dns-server-both alpine sleep 3600
# 清理環境
docker rm -f dns-server dns-server-both 2>/dev/null
```

### 23. docker port 查看映射
```bash
# 建立一個有多 port 映射的容器來做示範
docker run -d -p 8080:80 -p 8443:443 --name web nginx:alpine
# 查看容器所有 port 映射關係
docker port web
# 只查特定容器 port 對應到主機的哪個 port
docker port web 80
# 清理環境
docker rm -f web
```

### 24. Port 衝突排查
```bash
# macOS / Linux
lsof -i :8080

# Linux
ss -ltnp | grep 8080
# 或
netstat -tlnp | grep 8080

# macOS
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

### 25. 防火牆安全做法
```bash
# 不要這樣做
docker run -d -e MYSQL_ROOT_PASSWORD=secret123 -p 3306:3306 mysql:8.0

# 要這樣做
docker run -d -e MYSQL_ROOT_PASSWORD=secret123 -p 127.0.0.1:3306:3306 mysql:8.0
```

### 26. 實作：Web + MySQL 容器通訊
```bash
# 建立自訂網路，讓容器之間可以用名稱互連
docker network create app-network

# MySQL 不對外暴露 port——只有同網路的容器才能連，更安全
docker run -d \
  --name mysql-db \
  --network app-network \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=apppass \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# Adminer 是資料庫管理 Web UI，對外開 8080 讓瀏覽器存取
docker run -d \
  --name adminer \
  --network app-network \
  -p 8080:8080 \
  adminer

# 確認兩個容器都正常運行
docker ps

# 清理所有實驗資源
docker rm -f mysql-db adminer
docker network rm app-network
docker volume rm mysql-data
```

### 27. 練習：進階架構（Redis + MySQL + API + Nginx）
```bash
# 建立前後端兩個隔離網路
docker network create frontend
docker network create backend

# Redis 和 DB 只在 backend 網路，外部無法直接連
docker run -d --name redis --network backend redis:7-alpine
docker run -d --name db --network backend -e MYSQL_ROOT_PASSWORD=secret mysql:8.0
# API 先加入 backend，再用 connect 加入 frontend——它是前後端的橋樑
docker run -d --name api --network backend alpine sleep 3600
docker network connect frontend api
# Nginx 只在 frontend，對外提供服務
docker run -d --name web --network frontend -p 80:80 nginx:alpine

# 驗證 API 能連到後端服務
docker exec api ping -c 2 redis
docker exec api ping -c 2 db
# 驗證 Nginx 能連到 API
docker exec web ping -c 2 api
# 驗證 Nginx 連不到後端（隔離生效）
docker exec web ping -c 2 redis
docker exec web ping -c 2 db

# 清理所有實驗資源
docker rm -f web api db redis
docker network rm frontend backend
```

---

## Hour 10：Dockerfile 基礎

### 1. 查看別人 Image 的建構歷史
```bash
# 查看 image 每一層是怎麼建出來的，學習別人的 Dockerfile 寫法
docker history nginx:latest
# 加 --no-trunc 看完整指令，不會被截斷
docker history --no-trunc nginx:latest
docker history python:3.11-slim
docker history mysql:8.0
```

### 2. 建立第一個 Dockerfile 專案目錄
```bash
# 每個 Dockerfile 專案要有自己的目錄，這個目錄就是 Build Context
mkdir my-first-image
cd my-first-image
```

### 3. 第一個 Dockerfile
```dockerfile
# 我的第一個 Dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl
CMD ["curl", "--version"]
```

### 4. 建構 Image
```bash
# 用當前目錄的 Dockerfile 建構 image，-t 給它一個名字和版本標籤
docker build -t my-curl:v1 .
```

### 5. 查看詳細建構日誌
```bash
# 用 --progress=plain 顯示每一步的完整輸出，方便除錯建構失敗的問題
docker build --progress=plain -t my-app .
```

### 6. 執行自製 Image
```bash
# 驗證自己建的 image 能正常執行
docker run my-curl:v1
```

### 7. 查看 Image 分層結構
```bash
# 查看自己建的 image 有幾層、每層多大，理解分層快取的運作方式
docker history my-curl:v1
```

### 8. 修改 CMD 後重新建構（體驗 Cache）
```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl
CMD ["curl", "-V"]
```

```bash
# 只改了 CMD，前面的層都會用 Cache，建構速度快很多
docker build -t my-curl:v2 .
```

### 9. 練習：Alpine 版 Dockerfile
```dockerfile
FROM alpine:3.18
RUN apk add --no-cache curl wget
CMD ["curl", "--version"]
```

### 10. RUN 指令最佳寫法（合併 + 清理）
```dockerfile
RUN apt-get update && apt-get install -y \
    curl \
    vim \
    git \
    && rm -rf /var/lib/apt/lists/*
```

### 11. COPY 練習：自訂 Nginx 頁面
```dockerfile
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY index.html .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# 建構自訂 Nginx image
docker build -t my-web .
# 啟動並用瀏覽器打開 http://localhost:8080 看自訂首頁
docker run -d -p 8080:80 --name my-web-container my-web
# 清理環境
docker rm -f my-web-container
```

### 12. ENV 與 ARG 練習
```dockerfile
FROM alpine:3.18
ARG BUILD_ENV=production
ENV APP_VERSION=1.0.0
RUN echo "Building for: $BUILD_ENV, Version: $APP_VERSION"
CMD ["sh", "-c", "echo BUILD_ENV=$BUILD_ENV APP_VERSION=$APP_VERSION"]
```

```bash
# 用預設值建構
docker build -t env-test:v1 .
# 用 --build-arg 覆蓋 ARG 的預設值
docker build --build-arg BUILD_ENV=development -t env-test:v2 .
# 查看容器內的環境變數——ENV 會出現，但 ARG 不會（ARG 只在建構時存在）
docker run --rm env-test:v1 env
docker run --rm env-test:v1 sh -c "echo BUILD_ENV=$BUILD_ENV APP_VERSION=$APP_VERSION"
```

### 13. 用 -e 覆蓋 ENV
```bash
# 在執行時用 -e 覆蓋 Dockerfile 裡的 ENV 預設值，不用重新建構 image
docker run -e NODE_ENV=development my-app
```

### 14. 用 --build-arg 傳入 ARG
```bash
# 在建構時傳入 ARG，讓同一份 Dockerfile 能建出不同版本的 image
docker build --build-arg PYTHON_VERSION=3.10 -t my-app .
docker build --build-arg APP_ENV=development -t my-app .
```

### 15. 查看 LABEL 標籤
```bash
# 查看 image 的 metadata（維護者、版本等），方便追蹤 image 來源
docker inspect --format '{{json .Config.Labels}}' my-image
```

### 16. CMD vs ENTRYPOINT 練習
```bash
# 版本 A（CMD）
docker build -t demo-cmd -f- . <<'EOF'
FROM ubuntu:22.04
CMD ["echo", "Hello Docker"]
EOF

# 版本 B（ENTRYPOINT）
docker build -t demo-ep -f- . <<'EOF'
FROM ubuntu:22.04
ENTRYPOINT ["echo", "Hello Docker"]
EOF

# 測試
docker run --rm demo-cmd
docker run --rm demo-ep
docker run --rm demo-cmd "I am a student"
docker run --rm demo-ep "I am a student"
```

### 17. ENTRYPOINT + CMD 搭配的 curl 工具容器
```dockerfile
FROM alpine:3.18
RUN apk add --no-cache curl
ENTRYPOINT ["curl"]
CMD ["https://www.google.com"]
```

```bash
# 先重新 build 成新的 my-curl image
docker build -t my-curl .

# 不帶參數——會用 CMD 的預設 URL
docker run my-curl
# 帶參數——CMD 被覆蓋，但 ENTRYPOINT (curl) 不變
docker run my-curl https://httpbin.org/get
# 傳入 curl 的 flag——ENTRYPOINT 讓容器像一個 curl 工具一樣使用
docker run my-curl -s -o /dev/null -w "%{http_code}" https://www.google.com
```

### 18. USER 指定非 root 執行
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
CMD ["python", "app.py"]
```

### 19. HEALTHCHECK 健康檢查
```dockerfile
FROM nginx:alpine
HEALTHCHECK --interval=30s --timeout=3s --retries=3 --start-period=5s \
  CMD curl -f http://localhost/ || exit 1
```

### 20. 實作：打包 Python Flask 應用
```bash
# 建立專案目錄，準備寫 Dockerfile 和應用程式碼
mkdir flask-docker-demo
cd flask-docker-demo
```

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1
CMD ["python", "app.py"]
```

```bash
# 建構 Flask 應用的 image
docker build -t flask-demo:v1 .
# 確認 image 大小
docker images flask-demo
# 啟動 Flask 容器
docker run -d -p 5000:5000 --name my-flask flask-demo:v1
# 確認容器正常運行
docker ps
# 測試 API 是否能正常回應
curl http://localhost:5000
# 測試健康檢查端點
curl http://localhost:5000/health
```

### 21. 修改程式碼後體驗 Build Cache
```bash
# 只改了程式碼，requirements.txt 沒變——前面安裝依賴的層會用 Cache，秒完成
docker build -t flask-demo:v2 .
```

### 22. 查看分層結構 + 清理
```bash
# 查看每一層的大小，找出哪一層最肥可以優化
docker history flask-demo:v1
# 清理環境
docker stop my-flask
docker rm my-flask
```

### 23. 練習：Node.js Hello World Dockerfile
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Hour 11：Dockerfile 進階（Multi-stage、Best Practices、docker push）

### 1. .dockerignore 檔案範例
```
# .dockerignore
.git
.gitignore
node_modules
__pycache__
*.pyc
.venv
venv
.vscode
.idea
*.swp
*.swo
.env
.env.local
.env.*.local
*.md
docs/
tests/
coverage/
test-reports/
Dockerfile
docker-compose.yml
.dockerignore
.DS_Store
Thumbs.db
dist/
build/
*.log
```

### 2. 查看 Build Context 大小
```bash
# 建構時注意第一行顯示的 Context 大小——太大表示需要加 .dockerignore
docker build -t my-flask-app .
```

### 3. Best Practice：合併 RUN 指令
```dockerfile
# 正確寫法
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

### 4. Best Practice：Build Cache 各語言範例

**Python：**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

**Java Maven：**
```dockerfile
FROM maven:3.9-eclipse-temurin-17
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests
```

**Go：**
```dockerfile
FROM golang:1.22-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main .
```

### 5. Best Practice：非 root 使用者

**Debian 系：**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser
CMD ["python", "app.py"]
```

**Alpine 系：**
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### 6. Multi-stage Build：Node.js 前端（1.2 GB → 40 MB）
```dockerfile
# ========== 階段一：建構 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 安裝依賴（善用快取）
COPY package.json package-lock.json ./
RUN npm ci

# 複製原始碼並建構
COPY . .
RUN npm run build

# ========== 階段二：運行 ==========
FROM nginx:alpine

# 從建構階段只複製 dist/ 目錄到 Nginx 的靜態檔案目錄
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7. Multi-stage Build：Go 應用（800 MB → 8 MB）
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

### 8. Go 應用需要 HTTPS 時帶入 CA 憑證
```dockerfile
FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/main /main
ENTRYPOINT ["/main"]
```

### 9. Go 應用用 Alpine 替代 scratch（方便除錯）
```dockerfile
FROM alpine:3.19
COPY --from=builder /app/main /main
EXPOSE 8080
ENTRYPOINT ["/main"]
```

### 10. Multi-stage Build：Java Spring Boot（800 MB → 250 MB）
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

### 11. Multi-stage 三階段範例
```dockerfile
# 階段一：安裝依賴
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 階段二：建構
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 階段三：運行
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 12. docker login / tag / push
```bash
# 先登入 Docker Hub，才有權限 push image
docker login

# 建構時直接帶上 Docker Hub 的帳號前綴
docker build -t johndoe/my-flask-app:1.0 .
# 或先 build 再 tag
docker build -t my-flask-app .
# 加上帳號前綴和版本標籤，讓 Docker 知道要推到哪裡
docker tag my-flask-app johndoe/my-flask-app:1.0
# 同時打 latest 標籤，方便別人直接 pull 最新版
docker tag my-flask-app johndoe/my-flask-app:latest

# 推上 Docker Hub，讓別人也能用你的 image
docker push johndoe/my-flask-app:1.0
docker push johndoe/my-flask-app:latest
```

### 13. 離線部署：docker save / load
```bash
# 把 image 匯出成 tar 檔，可以用 USB 或 SCP 傳到沒有網路的伺服器
docker save -o my-flask-app.tar johndoe/my-flask-app:1.0
# 在目標伺服器上載入 image，不需要連 Registry
docker load -i my-flask-app.tar
```

### 14. 推送到不同 Registry
```bash
# Docker Hub
docker push johndoe/my-app:1.0

# AWS ECR
docker push 123456789.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:1.0

# GitHub Container Registry
docker push ghcr.io/johndoe/my-app:1.0

# 自建 Harbor
docker push harbor.mycompany.com/project/my-app:1.0
```

### 15. 實戰：Node.js + TypeScript 生產級 Dockerfile

**.dockerignore：**
```
node_modules
npm-debug.log
dist
.git
.gitignore
.env
.env.*
*.md
LICENSE
.vscode
.idea
coverage
.nyc_output
```

**Dockerfile：**
```dockerfile
# ============================================
# Stage 1: Build（建構階段）
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ============================================
# Stage 2: Production（生產階段）
# ============================================
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

```bash
# 建構生產級 TypeScript API image
docker build -t my-ts-api:1.0.0 .
# 確認最終 image 大小（Multi-stage 應該很小）
docker images my-ts-api
# 啟動容器
docker run -d --name ts-api -p 3000:3000 my-ts-api:1.0.0
# 測試 API 回應
curl http://localhost:3000/
# 測試健康檢查端點
curl http://localhost:3000/health
# 驗證容器是以非 root 身份運行（安全最佳實踐）
docker exec ts-api whoami
# 確認 dumb-init 是 PID 1，能正確轉發信號
docker exec ts-api ps aux
# 測量 graceful shutdown 時間——有 dumb-init 應該秒停
time docker stop ts-api
```

### 16. 實戰：Spring Boot Java 生產級 Dockerfile

**.dockerignore：**
```
target
.git
.gitignore
*.md
.idea
.vscode
.settings
.classpath
.project
```

**Dockerfile：**
```dockerfile
# ============================================
# Stage 1: Build（用 Maven 編譯）
# ============================================
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ============================================
# Stage 2: Production（只需要 JRE）
# ============================================
FROM eclipse-temurin:21-jre-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

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

```bash
# 建構 Spring Boot 生產級 image（Multi-stage：Maven 編譯 + JRE 運行）
docker build -t my-spring-app:1.0.0 .

# 限制容器最多用 512MB 記憶體，JVM 會自動根據容器限制調整 Heap
docker run -d --name spring-app \
  -p 8080:8080 \
  -m 512m \
  my-spring-app:1.0.0

# 測試 API 回應
curl http://localhost:8080/
# 驗證 JVM 有正確偵測到容器的記憶體限制（MaxHeapSize 應該是 512MB 的 75%）
docker exec spring-app java -XX:+PrintFlagsFinal -version 2>&1 | grep MaxHeapSize
```

### 17. 常見問題排查指令
```bash
# 看 build context 大小
docker build -t test . 2>&1 | head -3

# 查看每步是否用了 cache
docker build -t test . --progress=plain 2>&1 | grep -E "(CACHED|RUN)"

# 查看每一層的大小
docker history my-image:latest

# 容器退出碼
docker inspect my-container --format='{{.State.ExitCode}}'

# 用互動模式進去除錯
docker run -it --entrypoint sh my-image

# 查看容器日誌
docker logs my-container

# 檢查權限
docker exec my-container ls -la /app/
docker exec my-container whoami
docker exec my-container id
```

---

## Hour 12：Dockerfile 實戰練習

### 1. 練習一：打包 Hello World API

**server.js（Node.js 範本）：**
```javascript
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

**Dockerfile：**
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# 建構簡單版 API image
docker build -t hello-api .
# 啟動並測試
docker run -d -p 3000:3000 --name test hello-api
curl http://localhost:3000/
curl http://localhost:3000/health
# 清理環境，準備改寫成生產級版本
docker rm -f test
```

### 2. 練習二：改寫成生產級 Multi-stage Build

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

```bash
# 建構生產級 Multi-stage image
docker build -t hello-api:prod .
docker run -d -p 3000:3000 --name test hello-api:prod

# 等 35 秒讓 HEALTHCHECK 跑完第一次（interval=30s + start_period=5s）
sleep 35

# 驗證容器是以非 root（node）身份運行
docker exec test whoami
# 確認健康檢查狀態顯示為 healthy
docker ps
# 比較生產版和簡單版的 image 大小差異
docker images hello-api:prod
# 測量 graceful shutdown 時間——有 dumb-init 應該很快
time docker stop test
docker rm test
```

### 3. 練習三：Code Review 題目（找出 8 個問題）

**有問題的 Dockerfile：**
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

**修正後的 Dockerfile：**
```dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

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

## Hour 13：Docker Compose 完整講解

### 1. 用 docker run 管理多容器的痛苦
```bash
# 手動一個一個建——光是四個容器就要打這麼多指令，而且順序不能錯
docker network create my-app-network

docker volume create mysql-data
docker volume create redis-data

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

docker run -d \
  --name redis \
  --network my-app-network \
  -v redis-data:/data \
  redis:7-alpine

docker run -d \
  --name api \
  --network my-app-network \
  -e DATABASE_HOST=mysql \
  -e DATABASE_USER=appuser \
  -e DATABASE_PASSWORD=apppass \
  -e REDIS_HOST=redis \
  -p 3000:3000 \
  my-api:latest

docker run -d \
  --name nginx \
  --network my-app-network \
  -p 80:80 \
  -v ./nginx.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

### 2. Docker Compose 一行搞定
```bash
# 一行指令啟動所有服務——網路、Volume、容器全部自動建好
docker compose up -d
# 一行指令停止並移除所有服務
docker compose down
```

### 3. 確認 Compose 版本
```bash
# 確認已安裝 Compose V2（指令是 docker compose，不是 docker-compose）
docker compose version
```

### 4. 最簡 compose.yaml
```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

### 5. 完整基本結構的 compose.yaml
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

### 6. 網路隔離的 compose.yaml
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
    environment:
      MYSQL_ROOT_PASSWORD: secret
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
```

### 7. depends_on + healthcheck（正確做法）
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

### 8. Build 整合
```yaml
services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
```

### 9. Build 相關指令
```bash
# 只建構 image，不啟動容器
docker compose build
# 啟動所有服務（如果 image 已建好就直接用）
docker compose up -d
# 強制重新建構再啟動——程式碼有改時一定要加 --build
docker compose up -d --build
# 只建構單一服務的 image
docker compose build api
```

### 10. 開發模式：Volume 掛載原始碼
```yaml
services:
  api:
    build:
      context: ./backend
    volumes:
      - ./backend/src:/app/src
```

### 11. 進階 build 選項
```yaml
build:
  context: ./backend
  dockerfile: Dockerfile.dev
  args:
    NODE_VERSION: "20"
  target: development
```

### 12. 資源限制
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

### 13. Profiles — 按需啟動
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
# 預設只啟動沒有 profile 的服務（web），adminer 不會被啟動
docker compose up -d
# 加 --profile debug 才會連 adminer 一起啟動，適合需要除錯時才開
docker compose --profile debug up -d
```

### 14. Logging 日誌管理
```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "3"
```

### 15. docker compose 常用指令
```bash
# 啟動與停止
docker compose up -d
docker compose down
docker compose down -v

# 查看狀態和日誌
docker compose ps
docker compose logs -f
docker compose logs -f db

# 進入容器
docker compose exec web sh
docker compose exec db mysql -uroot -psecret

# 停止 / 啟動 / 重啟
docker compose stop
docker compose start
docker compose restart web

# 驗證設定
docker compose config
docker compose config --quiet
```

### 16. 實戰：WordPress 四服務完整 compose.yaml

**.env：**
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

**nginx/default.conf：**
```nginx
server {
    listen 80;
    client_max_body_size 64M;

    location / {
        proxy_pass http://wordpress:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**compose.yaml：**
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

### 17. 啟動與驗證 WordPress
```bash
# 一鍵啟動四個服務（Nginx + WordPress + MySQL + Redis）
docker compose up -d
# 確認所有服務都正常運行且健康檢查通過
docker compose ps
# 查看最近 20 行日誌，排查啟動是否有報錯
docker compose logs --tail=20
```

### 18. 驗證 Volume 持久化
```bash
# down 再 up——因為有 Volume，WordPress 的設定和文章不會消失
docker compose down
docker compose up -d
```

### 19. 完整清理
```bash
# 只停止並移除容器和網路，Volume 保留
docker compose down
# 加 -v 連 Volume 一起刪除（資料會消失！）
docker compose down -v
# 加 --rmi all 連 image 也一起刪，徹底清乾淨
docker compose down -v --rmi all
```

### 20. 環境分離（override）

**compose.yaml（基礎設定）：**
```yaml
services:
  web:
    image: myapp:latest
    ports:
      - "80:3000"
    environment:
      NODE_ENV: production
```

**compose.override.yaml（開發環境，自動載入）：**
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

**compose.prod.yaml（生產環境）：**
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
# 開發環境——Compose 會自動合併 compose.override.yaml，掛載原始碼方便開發
docker compose up -d

# 生產環境——手動指定用 prod 設定檔，不會自動載入 override
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

### 21. 驗證設定合併
```bash
# 查看最終合併後的完整設定——確認 override 有正確覆蓋
docker compose config
# 查看生產環境合併結果
docker compose -f compose.yaml -f compose.prod.yaml config
# 只驗證語法是否正確，不輸出內容
docker compose config --quiet
```

---

## Hour 14：Docker Compose 實戰練習 + 課程總結

### 1. 練習一：三服務基本 Compose

**compose.yaml：**
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      - api
    restart: unless-stopped

  api:
    image: httpd:alpine
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

```bash
# 啟動三服務架構
docker compose up -d
# 確認所有服務都正常運行
docker compose ps
# 測試 Nginx 是否能正常回應
curl http://localhost:8080
# 驗證 PostgreSQL 能正常執行 SQL
docker compose exec db psql -U postgres -c "SELECT 1;"
# 清理環境
docker compose down
```

### 2. 練習二：進階 — .env + healthcheck + 網路隔離

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

**compose.yaml：**
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      api:
        condition: service_started
    networks:
      - frontend-net
    restart: unless-stopped

  api:
    image: httpd:alpine
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

```bash
docker compose up -d
docker compose ps

# 驗證 Nginx 連不到 db（不同網路，預期失敗）
docker compose exec nginx ping -c 1 db
# 驗證 API 能連到 db（同一個 backend-net，預期成功）
docker compose exec api ping -c 1 db

# 清理環境
docker compose down
```

### 3. 練習三：Code Review 題目（找出 5 個問題）

**有問題的 compose.yaml：**
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
