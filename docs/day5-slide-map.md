# Day 5 投影片地圖

錄影用速查表：每張投影片對應的 section、內容、需要的 YAML 檔案。

YAML 檔案位置：`k8s-course-labs/lesson5/`

---

## 上午（5-1 → 5-11）共 21 張

| # | 投影片 | 內容 | YAML |
|---|--------|------|------|
| 1 | 5-1(1) | 第四堂回顧 | — |
| 2 | 5-1(2) | 為什麼需要多節點（minikube 三大限制） | — |
| 3 | 5-2(3) | k3s 安裝實作：匯入 OVF + 改 hostname | setup-k3s.sh |
| 4 | 5-2(4) | k3s 安裝實作：master 安裝 + worker 加入 | — |
| 5 | 5-2(5) | 學員實作：k3s 環境建置 | — |
| 6 | 5-3(6) | 擴縮容概念（Deployment 三層結構） | — |
| 7 | 5-3(7) | Labels/Selector 概念 + YAML 三處 labels | — |
| 8 | 5-4(8) | 擴縮容實作示範：9 步完整流程 | nginx-deployment.yaml |
| 9 | 5-4(9) | Lab 1：你被叫去救火（兩個 bug） | api-service.yaml |
| 10 | 5-5(10) | 回頭操作 Loop 1：scale 常見坑 | — |
| 11 | 5-6(11) | 滾動更新概念：RS 蹺蹺板 + maxSurge/maxUnavailable | — |
| 12 | 5-6(12) | 回滾原理 + 指令總覽 + Docker 對照 | — |
| 13 | 5-7(13) | 滾動更新實作：10 步指令流程 | — |
| 14 | 5-7(14) | 學員實作：滾動更新 + 回滾練習 | — |
| 15 | 5-8(15) | 回頭操作 Loop 2：帶做五指令 | — |
| 16 | 5-8(16) | Lab 2：版本事故（深夜 11 點） | — |
| 17 | 5-9(17) | 自我修復概念：孤兒 Pod + pod-template-hash | — |
| 18 | 5-9(18) | Labels + Selector：K8s 的認親機制 | — |
| 19 | 5-10(19) | 自我修復 + Labels 實作 | — |
| 20 | 5-10(20) | Lab 3：除錯工程師（孤兒 Pod 隔離） | — |
| 21 | 5-11(21) | 回頭操作 Loop 3 + 上午總結 | — |

**上午用到的 YAML：** nginx-deployment.yaml、api-service.yaml（共 2 個，其餘用 kubectl create/run 即時建）

---

## 下午（5-12 → 5-18）共 33 張

| # | 投影片 | 內容 | YAML |
|---|--------|------|------|
| 1 | 5-12(1) | Pod IP 三大問題 → Service 解法 | — |
| 2 | 5-12(2) | ClusterIP 原理 + Service YAML 三重點 | — |
| 3 | 5-12(3) | 帶做：建立 ClusterIP Service + 驗證 | service-clusterip.yaml |
| 4 | 5-12(4) | 學員實作：httpd + ClusterIP | httpd-deploy.yaml, httpd-svc.yaml |
| 5 | 5-12(5) | ClusterIP 排錯 + 常見坑 | broken-clusterip.yaml |
| 6 | 5-12(6) | Lab 4：API 連線中斷，找 Bug 修復 | lab4-buggy.yaml |
| 7 | 5-13(7) | NodePort 概念：讓外面連進來 | — |
| 8 | 5-13(8) | 三種 Service 類型比較 | — |
| 9 | 5-13(9) | 帶做：建立 NodePort Service | service-nodeport.yaml |
| 10 | 5-13(10) | 學員實作：NodePort Service | — |
| 11 | 5-13(11) | Lab 5：NodePort 排錯（type 錯 + targetPort 錯） | lab5-buggy.yaml, service-loadbalancer.yaml |
| 12 | 5-14(12) | DNS 服務發現概念 + FQDN 格式 | — |
| 13 | 5-14(13) | Namespace 概念：邏輯隔離 | — |
| 14 | 5-14(14) | DNS 深度偵探：resolv.conf + 刺客教學 | — |
| 15 | 5-14(15) | Namespace 實作概念 | — |
| 16 | 5-14(16) | 帶做：DNS 驗證 + Namespace 建立 | — |
| 17 | 5-14(17) | 學員實作：DNS + Namespace | — |
| 18 | 5-14(18) | Lab 6：跨 Namespace 連線 | lab6-namespaces.yaml |
| 19 | 5-15(19) | 5-12~5-14 回頭操作 + 小結 | — |
| 20 | 5-15(20) | DaemonSet 概念 | daemonset.yaml |
| 21 | 5-15(21) | CronJob 概念 | cronjob.yaml |
| 22 | 5-15(22) | 帶做：DaemonSet + CronJob 完整流程 | daemonset.yaml, cronjob.yaml |
| 23 | 5-15(23) | DaemonSet + CronJob 常見坑 | daemonset-with-replicas.yaml |
| 24 | 5-15(24) | Lab 7：日誌收集工具部署情境 | jimmy-deployment.yaml, daemonset-correct.yaml |
| 25 | 5-15(25) | Lab 7 解答 + DaemonSet vs Deployment 比較 | — |
| 26 | 5-17(26) | 綜合實作：情境 + 目標架構 | full-stack.yaml |
| 27 | 5-17(27) | Step 1-3：建環境 | — |
| 28 | 5-17(28) | Step 4-6：驗證連線 | — |
| 29 | 5-17(29) | Step 7-10：生命周期操作 | — |
| 30 | 5-17(30) | 學員練習：情境式任務 | — |
| 31 | 5-17(31) | Lab 8：從零建完整 web 服務 | nginx-web-deployment.yaml, nginx-clusterip.yaml, nginx-nodeport.yaml, health-check-cronjob.yaml |
| 32 | 5-17(32) | 總結：今日學習地圖 | — |
| 33 | 5-17(33) | Docker 對照表 + 下堂課預告 | — |

**下午用到的 YAML：** 共 20 個檔案

---

## YAML 檔案總覽（依 PPT 出場順序）

| YAML 檔名 | 用於 | 用途 |
|-----------|------|------|
| nginx-deployment.yaml | 5-4 | 老師示範用 nginx Deployment（replicas: 3） |
| api-service.yaml | 5-4 Lab 1 | 兩個 bug（selector 不一致 + replicas 不足） |
| service-clusterip.yaml | 5-12 | ClusterIP Service 實作 |
| httpd-deploy.yaml | 5-12 學員實作 | httpd Deployment（replicas: 2） |
| httpd-svc.yaml | 5-12 學員實作 | httpd ClusterIP Service |
| broken-clusterip.yaml | 5-12 排錯 | selector 故意打錯的 Service |
| lab4-buggy.yaml | 5-12 Lab 4 | selector 不一致（Deployment + Service + client Pod） |
| service-nodeport.yaml | 5-13 | NodePort Service 實作（port 30080） |
| service-loadbalancer.yaml | 5-13 | LoadBalancer 觀察（EXTERNAL-IP pending） |
| lab5-buggy.yaml | 5-13 Lab 5 | type 錯 + targetPort 錯 |
| lab6-namespaces.yaml | 5-14 Lab 6 | 跨 Namespace 連線（frontend + backend） |
| namespace-practice.yaml | 5-14 | Namespace 練習（dev + staging） |
| daemonset.yaml | 5-15 | DaemonSet 實作（log-collector） |
| cronjob.yaml | 5-15 | CronJob 實作（每分鐘 hello） |
| daemonset-with-replicas.yaml | 5-15 常見坑 | DaemonSet 加 replicas 陷阱題 |
| jimmy-deployment.yaml | 5-15 Lab 7 | Jimmy 用 Deployment 部署（應改 DaemonSet） |
| daemonset-correct.yaml | 5-15 Lab 7 | 正確的 DaemonSet 版本 |
| full-stack.yaml | 5-17 綜合實作 | fullstack-demo 完整架構（Namespace + 2 Deployment + 2 Service + DaemonSet） |
| nodeport.yaml | 5-17 綜合實作 | fullstack-demo 的 NodePort Service |
| nginx-web-deployment.yaml | 5-17 Lab 8 | nginx-web Deployment（replicas: 3） |
| nginx-clusterip.yaml | 5-17 Lab 8 | ClusterIP Service for nginx-web |
| nginx-nodeport.yaml | 5-17 Lab 8 | NodePort Service for nginx-web（port 30088） |
| health-check-cronjob.yaml | 5-17 Lab 8 | CronJob 每分鐘 health check nginx-svc |
