# Day 3 第十五小時：用 Docker 手動模擬 Kubernetes 核心機制

---

## 一、為什麼在 Day 3 最後加這堂（5 分鐘）

今天 Day 3 已經學完：

| 小時 | 你學到的能力 | 在這堂怎麼用 |
|------|-------------|--------------|
| Hour 8 | Volume / 資料持久化 | 先知道狀態型服務不能只看容器生命週期 |
| Hour 9 | 自訂網路 / DNS / Port Mapping | 用 `demo-net` 與 Nginx upstream 模擬 Service |
| Hour 10-12 | Dockerfile / build / version tag | 用 `demo-web:v1`、`demo-web:v2` 模擬版本更新 |
| Hour 13-14 | Compose / 多服務編排 | 用多個 container + proxy 看懂 K8s 在幫你自動化什麼 |

**核心句：**

> Docker 解決「怎麼跑一個服務」
> Kubernetes 解決「怎麼管理很多個服務」

這堂課不是教新的 Docker 指令，而是用你今天已經會的 Docker 能力，手動做一次 K8s 平常在幫你做的事情。

---

## 二、建立最小 Web App（10 分鐘）

### 2.1 用 Day 3 的 Dockerfile 思維建立 image

`app.py`

```python
from fastapi import FastAPI
import socket

app = FastAPI()


@app.get("/")
def read_root():
    return {
        "hostname": socket.gethostname(),
        "version": "v1",
    }
```

`requirements.txt`

```txt
fastapi
uvicorn
```

`Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY . .

RUN pip install fastapi uvicorn

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2.2 build + run

```bash
docker build -t demo-web:v1 .
docker run -d --name demo-preview -p 18080:8000 demo-web:v1
curl http://localhost:18080
docker rm -f demo-preview
```

### 2.3 這段要講的重點

| 概念 | 你現在看到的是什麼 |
|------|------------------|
| Image | 模板 |
| Container | 執行中的實例 |
| Version tag | 之後 rolling update 會用到 |

**這裡呼應 Hour 10-12：** 你已經不是在用別人的 image，而是自己 build 一個可更新的服務。

---

## 三、多副本 = 手動 replicas（10 分鐘）

### 3.1 先建立這堂課共用的內部網路

```bash
docker network create demo-net
```

這裡先建立 `demo-net`，不是因為「多副本一定要先有 network」，而是因為等等的 `web1~web3`、`nginx`、以及後面的 rolling update 都會在同一個 network 上運作。

先把環境準備好，後面的指令才會一路對得起來：

- `replicas` 處理的是「有幾份副本」
- `network` 處理的是「這些副本怎麼互相找到」

做完這一步後，你可以用 `docker network ls` 確認 `demo-net` 已經存在。

### 3.2 啟動三個副本

```bash
docker run -d --name web1 --hostname web1 --network demo-net demo-web:v1
docker run -d --name web2 --hostname web2 --network demo-net demo-web:v1
docker run -d --name web3 --hostname web3 --network demo-net demo-web:v1

docker ps
```

這裡刻意把 `hostname` 設成和 container name 一樣，等等才可以直接從回應內容看出請求被分到哪個副本。

這一步先專注在一件事：同一個 image，可以同時跑出三個實例。

做完這一步後，你應該在 `docker ps` 看到 `web1`、`web2`、`web3` 三個 container，都來自 `demo-web:v1`。

### 3.3 這時候要講

```txt
replicas = 3
```

| 現在手動做的事 | K8s 會怎麼做 |
|---------------|-------------|
| 手動開 3 個 container | 宣告 `replicas: 3` |
| 你自己記得要維持 3 個 | Controller 自動維持 |

### 3.4 先點出限制

- 這三個副本現在只是「存在」
- 還沒有統一入口
- 還沒有負載分流
- 還沒有失敗補機

---

## 四、Nginx 當統一入口（15 分鐘）

### 4.1 先提醒現在的結構

到這一步為止：

- `web1~web3` 都已經在 `demo-net`
- 但外部還沒有單一入口
- 也還沒有誰幫你把流量分給三個副本

**這裡呼應 Hour 9：** `demo-net` 讓容器之間可以直接用名稱互相找到彼此。

### 4.2 Nginx 當入口

`nginx.conf`

```nginx
events {}

http {
    upstream backend {
        server web1:8000;
        server web2:8000;
        server web3:8000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
        }
    }
}
```

```bash
docker run -d \
  --name nginx \
  --network demo-net \
  -p 8080:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx
```

因為 `nginx` 和 `web1~web3` 都在 `demo-net`，所以它可以直接用 `web1:8000`、`web2:8000`、`web3:8000` 找到後端。

做完這一步後，你應該在 `docker ps` 看到 `nginx` 也已經啟動，並且可以從外部透過 `localhost:8080` 打進來。

### 4.3 驗證負載分流

```bash
for i in 1 2 3 4 5 6; do
  curl -s http://localhost:8080
  echo
done
```

多打幾次後，你會看到回應中的 `hostname` 在 `web1 / web2 / web3` 之間切換；順序不一定固定，重點是同一個入口後面確實有多個副本在回應。

如果你只看到同一個 `hostname`，先不要急著下結論；多打幾次才比較容易觀察到分流效果。

### 4.4 對照 K8s

| 現在手動做的事 | K8s 對應 |
|---------------|----------|
| `web1~web3` 三個 container | Pods |
| `demo-net` 內部互通 | Cluster 內部網路 |
| Nginx upstream | Service / Ingress 前的流量入口 |
| `hostname` 會輪流變 | Load balancing |

---

## 五、Rolling Update（10 分鐘）

### 5.1 改成 v2

把 `app.py` 改成：

```python
"version": "v2"
```

```bash
docker build -t demo-web:v2 .
```

### 5.2 手動更新一個副本

```bash
docker stop web1 && docker rm web1
docker run -d --name web1 --hostname web1 --network demo-net demo-web:v2
```

這裡一定要把新的 `web1` 重新接回 `demo-net`，否則 `nginx` 就無法再透過 `web1:8000` 找到它。

重複更新 `web2`、`web3`。

做完這一步後，再打幾次 `curl http://localhost:8080`，你可能會看到有些回應已經是 `v2`，有些還是 `v1`，這代表服務入口沒變，但後端副本正在逐步替換。

### 5.3 這段要講的重點

| Docker 手動做法 | K8s 做法 |
|----------------|---------|
| 自己決定先停誰、先換誰 | Deployment 控制更新節奏 |
| 自己確保服務不要全斷 | `maxUnavailable` / `maxSurge` |
| 自己判斷新版本是否穩定 | readiness / rollout 狀態 |

**這裡呼應 Hour 10-12：** Dockerfile 與版本化 image 不只是 build 出來而已，後面還要支撐升級流程。

---

## 六、Self-healing 的缺口（5 分鐘）

### 6.1 故意打掉一個副本

```bash
docker stop web2
```

問學生：

> 誰會幫你補？

答案：**沒人。**

### 6.2 手動補回去

```bash
docker rm web2
docker run -d --name web2 --hostname web2 --network demo-net demo-web:v2
```

### 6.3 關鍵句

> Docker：你在管系統
> Kubernetes：系統在幫你管

---

## 七、Docker → K8s 對照 + Day 4 銜接（5 分鐘）

### 7.1 今天手動做的事，K8s 會自動做

| Docker 手動 | K8s |
|------------|-----|
| `docker run` 跑一個服務 | Pod |
| 手動開三台 | Deployment / ReplicaSet |
| Nginx upstream | Service / Ingress |
| 手動版本替換 | Rolling update |
| 手動補機 | Self-healing |
| Named volume | PV / PVC |

### 7.2 最重要的收尾句

> Kubernetes 本質不是全新魔法
> 是把你剛剛手動做的事情「自動化 + 宣告化」

### 7.3 接 Day 4

- 明天不再用手動 `docker run` 模擬
- 會正式看到 `Pod / Deployment / Service`
- 會用 `kubectl` 和 YAML 把今天手動做的事交給 K8s

---

## 板書 / PPT 建議

1. Day 3 能力到 Hour 15 的對照表
2. `demo-web:v1` → 三副本 → Nginx → `v2` 的流程圖
3. Docker 手動 vs K8s 自動對照表
4. Rolling update 的舊版/新版切換圖
5. Self-healing 問答圖：誰來補副本？
6. Day 4 預告：Pod / Deployment / Service
