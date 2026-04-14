# Day 6 投影片地圖

錄影用速查表：每張投影片對應的 section、內容、需要的 YAML 檔案。

YAML 檔案位置：`k8s-course-labs/lesson6/`

---

## 上午（6-1 → 6-10）共 18 張

| # | 投影片 | 內容 | YAML |
|---|--------|------|------|
| 1 | 6-1(1) | 第六堂開場 + 第五堂因果鏈回顧 | — |
| 2 | 6-1(2) | 今天的因果鏈預覽（NodePort 太醜 → Ingress → ...） | — |
| 3 | 6-2(3) | Ingress 概念：NodePort 五大問題 → 需要 HTTP 路由器 | — |
| 4 | 6-2(4) | Ingress 路由方式（Path-based / Host-based）+ YAML 拆解 | — |
| 5 | 6-3(5) | Ingress 實作：確認 Traefik + Path Routing + curl 驗證 | ingress-basic.yaml |
| 6 | 6-3(6) | Ingress 實作：Host Routing + /etc/hosts + 排錯三步 | ingress-host.yaml |
| 7 | 6-3(7) | 學員實作：Ingress Path + Host Routing | ingress-basic.yaml, ingress-host.yaml |
| 8 | 6-4(8) | 回頭操作 Loop 1：帶做 path + host routing → 常見坑 | — |
| 9 | 6-5(9) | ConfigMap 概念：設定寫死三大問題 + 三種建立方式 + 兩種注入方式 | — |
| 10 | 6-5(10) | Secret 概念：Base64 不是加密 + RBAC 控權限 | — |
| 11 | 6-6(11) | ConfigMap 實作：env 注入 + Volume 掛載（熱更新） | configmap-literal.yaml, configmap-nginx.yaml |
| 12 | 6-6(12) | Secret 實作 + MySQL 整合 | secret-db.yaml |
| 13 | 6-6(13) | 學員實作：ConfigMap + Secret | configmap-literal.yaml, configmap-nginx.yaml, secret-db.yaml |
| 14 | 6-7(14) | 回頭操作 Loop 2：帶做四步驟 → 三個坑 → 銜接整合 | — |
| 15 | 6-8(15) | 整合實作引導：目標架構（Namespace + 三服務 + 九步驟） | — |
| 16 | 6-9(16) | 整合示範：九步走完（Namespace→Secret→ConfigMap→MySQL→frontend-deploy→api-deploy→Ingress→curl） | configmap-frontend.yaml, mysql-deploy.yaml, frontend-deploy.yaml, api-deploy.yaml, app-ingress.yaml |
| 17 | 6-9(17) | 學員實作：完整整合 Ingress + ConfigMap + Secret | — |
| 18 | 6-10(18) | 回頭操作 + 上午總結：三個 Loop 因果鏈 | — |

**上午用到的 YAML：** ingress-basic.yaml、ingress-host.yaml、configmap-literal.yaml、configmap-nginx.yaml、secret-db.yaml、configmap-frontend.yaml、mysql-deploy.yaml、frontend-deploy.yaml、api-deploy.yaml、app-ingress.yaml（共 10 個）

---

## 下午（6-11 → 6-25）共 28 張

| # | 投影片 | 內容 | YAML |
|---|--------|------|------|
| 1 | 6-11(1) | PV/PVC 引入：Pod 重啟資料全消失 | — |
| 2 | 6-11(2) | PV + PVC 概念：停車位（PV）+ 租約（PVC）+ 自動配對 | — |
| 3 | 6-12(3) | Lab：PV + PVC 靜態佈建 YAML 拆解 | pv-pvc.yaml |
| 4 | 6-12(4) | Lab：MySQL 掛 PVC → 砍 Pod → 資料還在 | pv-pvc.yaml |
| 5 | 6-12(5) | 學員實作：PV + PVC 資料持久化 | broken-pv-pvc.yaml |
| 6 | 6-13(6) | PV/PVC 排錯 + 常見坑（回頭操作 Loop 4） | — |
| 7 | 6-14(7) | StorageClass 概念：靜態佈建太煩 → 動態佈建 | — |
| 8 | 6-14(8) | Deployment vs StatefulSet：無狀態 vs 有狀態 + 三保證 | — |
| 9 | 6-15(9) | Lab：StatefulSet MySQL 部署（Headless Service + YAML） | statefulset-mysql.yaml |
| 10 | 6-15(10) | Lab：砍 mysql-0 → 資料還在（有序啟動 + 固定名稱 + 獨立 PVC） | statefulset-mysql.yaml |
| 11 | 6-15(11) | 學員實作：StatefulSet | answers/redis-statefulset.yaml |
| 12 | 6-16(12) | StatefulSet 排錯 + 常見坑（回頭操作 Loop 5） | — |
| 13 | 6-17(13) | Helm 引入：YAML 太多太散了 | — |
| 14 | 6-17(14) | Helm 核心概念：Chart + Release + Repository + values.yaml | — |
| 15 | 6-18(15) | Lab：Helm 一行安裝 MySQL + Redis（install/upgrade/rollback） | — |
| 16 | 6-18(16) | Lab：自訂 values.yaml + 清理（多環境部署 + uninstall） | — |
| 17 | 6-18(17) | 學員實作：Helm 安裝 MySQL + Redis | — |
| 18 | 6-19(18) | Helm 排錯 + 常見坑（回頭操作 Loop 6） | — |
| 19 | 6-20(19) | RKE + Rancher 引入：kubectl 管叢集太痛苦 | — |
| 20 | 6-20(20) | Rancher 架構：RKE 建叢集 + Rancher 管 GUI | — |
| 21 | 6-21(21) | Lab：安裝 Rancher（docker run）+ Import 叢集 | — |
| 22 | 6-21(22) | Lab：Rancher GUI 導覽（Dashboard + Workloads + Pod 日誌 + GUI Scale） | — |
| 23 | 6-21(23) | 學員實作：安裝 Rancher + GUI 操作 | — |
| 24 | 6-22(24) | Rancher 排錯 + 常見坑（回頭操作 Loop 7） | — |
| 25 | 6-23(25) | 綜合實作引導：串起今天所有概念（部落格系統六步驟） | — |
| 26 | 6-24(26) | 學員自由練習：Helm 安裝 WordPress | — |
| 27 | 6-25(27) | 第六堂因果鏈回顧（NodePort → Rancher 完整串）| — |
| 28 | 6-25(28) | 回家作業 + 下堂課預告（第七堂：生產就緒） | — |

**下午用到的 YAML：** pv-pvc.yaml、broken-pv-pvc.yaml、statefulset-mysql.yaml、answers/redis-statefulset.yaml（共 4 個，Helm 操作用指令不用 YAML）

---

## YAML 檔案總覽（依 PPT 出場順序）

| YAML 檔名 | 用於 | 用途 |
|-----------|------|------|
| ingress-basic.yaml | 6-3 | Path-based Ingress（/ → frontend-svc，/api → api-svc） |
| ingress-host.yaml | 6-3 | Host-based Ingress（app.example.com / api.example.com） |
| configmap-literal.yaml | 6-6 | ConfigMap 環境變數注入（APP_ENV、LOG_LEVEL 等） |
| configmap-nginx.yaml | 6-6 | ConfigMap 掛載為 Nginx 設定檔（熱更新示範） |
| secret-db.yaml | 6-6 | Secret + MySQL Deployment（Base64 示範） |
| configmap-frontend.yaml | 6-9 整合 | 前端 HTML ConfigMap（namespace: my-app） |
| mysql-deploy.yaml | 6-9 整合 | MySQL Deployment + ClusterIP（namespace: my-app） |
| frontend-deploy.yaml | 6-9 整合 | k8s-demo-app 前端（MESSAGE=Hello from frontend，namespace: my-app） |
| api-deploy.yaml | 6-9 整合 | k8s-demo-app API Deployment（MESSAGE=Hello from api，namespace: my-app） |
| app-ingress.yaml | 6-9 整合 | Ingress path routing（myapp.local，traefik） |
| pv-pvc.yaml | 6-12 | PV(2Gi) + PVC(1Gi) + busybox Deployment（持久化示範） |
| broken-pv-pvc.yaml | 6-12 題目 | 有 3 個 bug 的 PV/PVC（accessModes錯、storageClassName不一致、容量超過） |
| statefulset-mysql.yaml | 6-15 | Headless Service + mysql-sts-secret + StatefulSet MySQL（2 replicas） |
| answers/broken-pv-pvc-fixed.yaml | 6-12 解答 | broken-pv-pvc.yaml 的修正版（含 PostgreSQL Deployment） |
| answers/redis-statefulset.yaml | 6-15 解答 | Redis StatefulSet（2 replicas，500Mi 獨立 PVC） |
