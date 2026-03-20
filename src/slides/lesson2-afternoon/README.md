# Docker 第二、三天課程來源

第二天與第三天的內容已改為由 `src/slides/docker-day2/content/` 內的 Docker markdown 快照自動產生。

- 上午：Hour 1–3
- 第二天下午：Hour 4–7
- 第三天上午：Hour 8–10
- 第三天下午：Hour 11–14
- 來源：`docker-course-docs` 的 Day 2、Day 3 outline 與 full script 快照
- 產生器：`src/slides/docker-day2/parser.ts` 與 `src/slides/docker-day2/index.tsx`

如果要更新第二天或第三天內容，請優先更新 `docker-day2/content/` 內的 markdown，再由產生器重新載入，不要手改 lesson route 的 re-export 檔案。
