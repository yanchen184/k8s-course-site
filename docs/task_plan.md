# Task Plan — 任務排程系統真實程式碼

## 目標

建立四個真實可跑的應用程式，推到 ghcr.io/yanchen184/，讓 K8s 課程 Loop 3 示範可以真正執行。

## 系統架構

Frontend → Backend API (task-api) → Redis Queue → Task Runner → PostgreSQL
CronJob (task-scheduler) → Redis Queue

## 四個服務

| 服務 | 目錄 | Image | 功能 |
|------|------|-------|------|
| task-api | apps/task-api/ | ghcr.io/yanchen184/task-api:v1 | Express API，接收任務 POST → Redis Queue；包含 migrate.js |
| task-runner | apps/task-runner/ | ghcr.io/yanchen184/task-runner:v1 | BLPOP Redis，執行任務，結果存 PostgreSQL |
| task-scheduler | apps/task-scheduler/ | ghcr.io/yanchen184/task-scheduler:v1 | 掃 PostgreSQL 到期任務 → 丟 Redis Queue（CronJob） |
| task-frontend | apps/task-frontend/ | ghcr.io/yanchen184/task-frontend:v1 | 純 HTML + Nginx，UI 建任務、查任務 |

## 技術決定

- Node.js 20 Alpine（輕量）
- PostgreSQL client: `pg`
- Redis client: `ioredis`
- Express 4
- Frontend: 純 HTML/CSS（不用 React，避免 build 步驟複雜化）
- GitHub Actions 自動 build + push GHCR
- 多架構 build：linux/amd64,linux/arm64（支援 Apple Silicon 和 x86 主機）

## 環境變數（每個服務共用）

```
POSTGRES_HOST=postgres-service
POSTGRES_PORT=5432
POSTGRES_DB=taskdb
POSTGRES_PASSWORD=（from Secret）
REDIS_HOST=redis-service
REDIS_PORT=6379
REDIS_PASSWORD=（from Secret）
```

## DB Schema

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMP,
  executed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Phases

| Phase | 內容 | 狀態 |
|-------|------|------|
| 1 | apps/task-api/ — server.js + migrate.js + Dockerfile | pending |
| 2 | apps/task-runner/ — runner.js + Dockerfile | pending |
| 3 | apps/task-scheduler/ — scheduler.js + Dockerfile | pending |
| 4 | apps/task-frontend/ — index.html + nginx.conf + Dockerfile | pending |
| 5 | .github/workflows/build-push.yml — 四個 image 一起 build push | pending |
| 6 | 更新 public/docs/day7-loop3-deploy.md — 換掉所有 your-registry | pending |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| — | — | — |
