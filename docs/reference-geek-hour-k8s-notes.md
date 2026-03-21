# GeekHour K8s 課程筆記參考

> 來源：https://geekhour.net/2023/12/23/kubernetes/
> 用途：備課參考，對照我們第四堂課的內容結構

## 課程大綱對照

| GeekHour 章節 | 我們的課綱對應 | 堂次 |
|--------------|-------------|:---:|
| 什麼是 K8s | K8s 簡介 + 為什麼需要它 | 第四堂上午 |
| 為什麼要用 K8s | Docker 單機限制 → K8s 解決方案 | 第四堂上午 |
| K8s 架構與組件 | Control Plane + Worker Node | 第四堂上午 |
| Minikube 搭建 | 環境安裝 | 第四堂上午 |
| Multipass + K3s | 可選的替代方案 | 第四堂上午 |
| kubectl 常用命令 | kubectl 入門 | 第四堂上午 |
| Pod / Deployment | Pod + Deployment | 第四堂下午 |
| Service | Service 暴露 | 第五堂上午 |
| Namespace | Namespace 隔離 | 第五堂上午 |
| YAML 配置檔 | 穿插在各段落 | 第四~五堂 |
| Portainer | 工具推薦 | 第七堂 |
| Helm | Helm 入門 | 第六堂下午 |

## kubectl 指令速查（從 GeekHour 整理）

### 叢集資訊
```bash
kubectl cluster-info          # 叢集資訊
kubectl get nodes             # 節點列表
kubectl api-versions          # API 版本
```

### 建立與部署
```bash
kubectl run nginx --image=nginx                  # 快速建立 Pod
kubectl create deployment nginx --image=nginx    # 建立 Deployment
kubectl apply -f deployment.yaml                 # 用 YAML 部署
```

### 查詢
```bash
kubectl get pods                    # Pod 列表
kubectl get pods -o wide            # 含 IP 和 Node
kubectl get svc                     # Service 列表
kubectl get deploy                  # Deployment 列表
kubectl get ns                      # Namespace 列表
kubectl describe pod <name>         # Pod 詳情
```

### 操作
```bash
kubectl scale deployment nginx --replicas=3      # 擴縮容
kubectl set image deployment/nginx nginx=nginx:1.19  # 更新 Image
kubectl rollout undo deployment/nginx            # 回滾
kubectl delete pod <name>                        # 刪除 Pod
kubectl delete -f deployment.yaml                # 用 YAML 刪除
```

### 除錯
```bash
kubectl logs <pod-name>                          # 看日誌
kubectl logs <pod-name> -f                       # 即時日誌
kubectl exec -it <pod-name> -- /bin/sh           # 進容器
kubectl port-forward <pod-name> 8080:80          # Port 轉發
```

## 環境搭建方案比較

| 方案 | 適合場景 | 資源需求 | 安裝難度 |
|------|---------|---------|:---:|
| Minikube | 本機開發學習 | 2GB+ RAM | 低 |
| K3s + Multipass | 多節點模擬 | 4GB+ RAM | 中 |
| kind | CI/CD 測試 | 2GB+ RAM | 低 |
| Killercoda | 線上練習（免安裝） | 無 | 無 |

## 我們可以參考的教學方式

1. **從 Docker 痛點切入** — GeekHour 也是先講 Docker 單機的問題再引入 K8s
2. **環境搭建放前面** — 學生越早能動手越好
3. **kubectl 指令分類教** — 不要一次全教，按「查 → 建 → 改 → 刪 → 除錯」順序
4. **YAML 不單獨教** — 穿插在 Pod / Deployment / Service 的實作中
5. **Portainer 可以最後介紹** — 給學生一個 GUI 工具輔助
