# Loop 5 指令速查 — ClusterIP Service（下午 5-12, 5-13, 5-14）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## 前提：確認 nginx-deploy 還在跑

```bash
kubectl get deployments
# 若沒有，先套用 nginx-deployment.yaml
```

---

## YAML 檔案準備

**建立 `service-clusterip.yaml`（課前先備好）**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

---

## ClusterIP Service 實作示範

```bash
# 1. Demo：Pod IP 會變（概念示範）
kubectl get pods -o wide                                  # 記下某個 Pod IP
kubectl delete pod nginx-deploy-<hash>-<suffix>          # 刪掉它
kubectl get pods -o wide                                  # 新 Pod IP 不一樣了！

# 2. 套用 ClusterIP Service
kubectl apply -f service-clusterip.yaml
# 看到：service/nginx-svc created

# 3. 列出所有 Service
kubectl get svc
# 看到：nginx-svc ClusterIP 10.96.xxx.xxx <none> 80/TCP

# 4. 查看 Service 詳細資訊
kubectl describe svc nginx-svc
# 重點看：Selector: app=nginx / Endpoints: 10.244.x.x:80,10.244.x.x:80

# 5. 查看 Endpoints
kubectl get ep nginx-svc
# 看到：ENDPOINTS = 實際 Pod IP:80
# ⚠️ 若 Endpoints 是 <none>，代表 selector 和 Pod label 對不上！

# 6. 進入測試 Pod 驗證連線（用 curl）
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
# 進入 Pod 後：
curl http://nginx-svc
# 看到：nginx 預設首頁 HTML，包含 Welcome to nginx!
# 輸入 exit 離開

# 7. Endpoints 除錯示範（selector 沒對到的情況）
kubectl get pods --show-labels                            # 確認 Pod 實際 label
kubectl describe svc nginx-svc                           # 確認 Service 的 Selector
# 比對兩者是否完全一致（大小寫、拼字都要對）
```

---

## 學生題目解答

**題目 1：`kubectl get ep` 顯示 `<none>`，怎麼除錯？**

```bash
kubectl get pods --show-labels                            # 確認 Pod 實際有哪些 label
kubectl describe svc nginx-svc                           # 確認 Service 的 Selector
# 比對兩者，找出不一致的地方（最常見：label 值不同或 key 打錯）
```
