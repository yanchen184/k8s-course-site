# Loop 6 指令速查 — NodePort + CoreDNS + Namespace（下午 5-15, 5-16, 5-17）

> 這是老師上課要打的所有指令，含學生題目解答。

---

## YAML 檔案準備

**建立 `service-nodeport.yaml`（課前先備好）**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
```

**建立 `namespace-practice.yaml`（課前先備好）**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
```

---

## NodePort 實作示範

```bash
# 1. 套用 NodePort Service
kubectl apply -f service-nodeport.yaml
# 看到：service/nginx-nodeport created

# 2. 查看 Service，確認 nodePort 分配
kubectl get svc
# 看到：nginx-nodeport NodePort 10.96.xxx.xxx <none> 80:30080/TCP
# 格式：80（Service port）:30080（nodePort）

# 3. 取得 Node IP（k3s multipass 環境）
multipass info k3s-worker1 | grep IPv4
# 看到：IPv4: 192.168.64.x
# 或用：
kubectl get nodes -o wide
# 看 INTERNAL-IP 欄位

# 4. 從外部 curl NodePort（替換為實際 IP）
curl http://192.168.64.5:30080
# 看到：nginx 首頁 HTML，Welcome to nginx!

# 5. 清理 NodePort Service
kubectl delete svc nginx-nodeport
```

---

## CoreDNS + Namespace 實作示範

```bash
# 1. 確認 CoreDNS 正常運作
kubectl get pods -n kube-system | grep dns
# 看到：2 個 coredns Pod，都是 Running

# 2. 進入 busybox 測試 Pod 做 DNS 測試
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
# 進入 Pod 後（/ # 提示符）：

  wget -qO- http://nginx-svc                                # 短名稱
  wget -qO- http://nginx-svc.default.svc.cluster.local     # 完整 FQDN
  nslookup nginx-svc
  # nslookup 看到：Server = CoreDNS IP，nginx-svc 被解析到 ClusterIP
  exit

# 3. 建立 Namespace
kubectl apply -f namespace-practice.yaml
# 看到：namespace/dev created / namespace/staging created

# 4. 列出所有 Namespace
kubectl get ns
# 看到：default / dev / kube-node-lease / kube-public / kube-system / staging

# 5. 在 dev namespace 建立 Deployment
kubectl create deployment nginx-dev --image=nginx:1.27 -n dev
# 看到：deployment.apps/nginx-dev created

# 6. 查看 dev namespace 的 Pod
kubectl get pods -n dev
# 看到：nginx-dev Pod Running

# 7. 列出所有 Namespace 的 Deployment
kubectl get deployments -A
# 看到 default 和 dev 兩個 namespace 的 deployment

# 8. 在 dev namespace expose Service
kubectl expose deployment nginx-dev --port=80 --type=ClusterIP -n dev
# 看到：service/nginx-dev exposed

# 9. 跨 Namespace 存取（從 default 連 dev 的 Service）
kubectl run cross-test --image=busybox --rm -it --restart=Never \
  -- wget -qO- http://nginx-dev.dev.svc.cluster.local
# 看到：nginx 首頁 HTML（跨 namespace 連線成功！）

# 10. 切換預設 Namespace（示範用）
kubectl config set-context --current --namespace=dev
kubectl get pods                                           # 等於 get pods -n dev
kubectl config view --minify | grep namespace             # 確認目前是 dev

# 切回 default
kubectl config set-context --current --namespace=default

# 11. 刪除 Namespace（危險操作！dev 和 staging 裡的所有資源全刪）
kubectl delete namespace dev staging
# 看到：namespace "dev" deleted / namespace "staging" deleted
# 注意：需要 1-2 分鐘才完成
```

---

## 學生題目解答

**題目 1：從 staging namespace 連 dev namespace 的 api-svc**

```bash
# URL 要寫：
http://api-svc.dev.svc.cluster.local
# 或：
http://api-svc.dev
```

**跨 Namespace 驗證指令：**

```bash
kubectl run cross-verify --image=busybox --rm -it --restart=Never -n staging \
  -- wget -qO- http://api-svc.dev.svc.cluster.local
```
