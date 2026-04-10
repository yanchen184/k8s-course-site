# Day 5 下午：5-12 到 5-14

---

## 5-12 ClusterIP Service（20 分鐘）

### 📄 5-12 第 1 張：Pod IP 三大問題 → Service 解法（8 min）

### ① 課程內容

**Pod IP 三大問題**

- **IP 會變**：Pod 重啟後 IP 會改變，無法寫死 IP 在程式裡
- **流量沒分散**：Deployment 跑多個 Pod 副本，呼叫方不知道要連哪一個
- **外面連不到**：Pod IP 是叢集內部虛擬 IP，瀏覽器打不開

**Service 的定位**

- Service 是穩定的「虛擬入口」：提供固定的 ClusterIP + DNS 名稱
- 同時扮演負載均衡器：把流量分散到後端多個 Pod
- Service 本身不跑 Pod，是一層抽象規則，由 kube-proxy 在每個 Node 上實作

**三種 Service 類型**

---

### 📄 5-12 第 2 張：ClusterIP Service 原理（8 min）

**Label Selector 與 Endpoints**

- Service 透過 `selector` 比對 Pod 的 label，找到所有符合的 Pod
- K8s 自動維護一個 Endpoints 物件，記錄目前所有健康 Pod 的 IP:Port
- Pod 上線 → 自動加入 Endpoints；Pod 下線 → 自動移除，無需手動更新

**ClusterIP 的特性**

- 是一個叢集內部的虛擬 IP（Virtual IP），不綁定任何 Node 或網卡
- **只有叢集內部的 Pod 能連**，外部瀏覽器或本機直接連不到
- 適合服務間互相呼叫（後端 → 資料庫、前端 → API）

**port vs targetPort**

| 欄位 | 說明 |
|------|------|
| `port` | Service 監聽的 port（呼叫方連這個）|
| `targetPort` | 流量轉發到 Pod 的哪個 port（Pod 內的應用程式監聽的）|
| `nodePort` | NodePort 才有，Node 對外開的 port |

- 兩者可以不同，例如 `port: 80` 轉發到 `targetPort: 8080`
- 好處：呼叫方永遠連 port 80，不需知道 Pod 內部細節

**Service YAML 三重點**

| 欄位 | 說明 |
|------|------|
| `type` | ClusterIP（預設值，可省略）|
| `selector` | `app: nginx` — 跟 Pod labels 一致 |
| `ports` | `port: 80`（Service 監聽）/ `targetPort: 80`（轉發到 Pod）|

```yaml
# service-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  type: ClusterIP        # 預設值，可省略
  selector:
    app: nginx           # 跟 Pod labels 一致
  ports:
    - port: 80           # Service 監聽的 Port
      targetPort: 80     # 轉發到 Pod 的 Port
```

**黃金法則**

Deployment selector = Pod template labels = Service selector — 三者要對上！

**Docker 對照**

| K8s 概念 | Docker 對照 |
|----------|------------|
| ClusterIP Service | `docker run -p`（但只限 container 內部網路）|
| Service Label Selector | Compose 裡的 service name 作 DNS（`depends_on`）|
| Endpoints | Compose 自動 DNS 解析到所有同名 container |

---

### 📄 5-12 第 3 張：Lab：建立 ClusterIP Service（8 min）

### ② 所有指令＋講解

**指令 0：確認 Deployment 在跑**

```bash
kubectl get deployments
```

打完要看：`READY 3/3`，確認 nginx Deployment 正常運作後再建 Service。

---

**指令 1：套用 ClusterIP Service YAML**

```bash
kubectl apply -f service-clusterip.yaml
```

- `apply`：宣告式套用，YAML 沒變則不做事，有變則更新
- `-f`：指定 YAML 檔路徑

打完要看：
```
service/nginx-svc created
```
若出現 `configured` 表示更新；若出現 `unchanged` 表示無異動。

異常狀況：
- `error: unable to recognize`: YAML 格式錯誤，檢查縮排（用空格不要用 Tab）

---

**指令 2：列出所有 Service**

```bash
kubectl get svc
```

- `svc` 是 `services` 的縮寫
- 預設顯示 default namespace

打完要看：
```
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP   3d
nginx-svc    ClusterIP   10.96.123.45    <none>        80/TCP    5s
```

重點欄位：
- `CLUSTER-IP`：K8s 分配的虛擬 IP
- `EXTERNAL-IP`：ClusterIP 類型永遠是 `<none>`
- `PORT(S)`：Service 監聽的 port

---

**指令 3：查看 Service 詳細資訊**

```bash
kubectl describe svc nginx-svc
```

- `describe`：人類可讀的詳細描述，比 `-o yaml` 易讀

打完要看（關鍵欄位）：
```
Selector:          app=nginx
Type:              ClusterIP
IP:                10.96.123.45
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.244.0.5:80,10.244.0.6:80
```

重點：`Endpoints` 欄位列出實際 Pod IP。若 Endpoints 是 `<none>`，代表 selector 沒有對到任何 Pod（label 打錯）。

---

**指令 4：查看 Endpoints**

```bash
kubectl get endpoints nginx-svc
# 縮寫
kubectl get ep nginx-svc
```

打完要看：
```
NAME        ENDPOINTS                       AGE
nginx-svc   10.244.0.5:80,10.244.0.6:80   2m
```

異常：若顯示 `<none>`，立刻用 `kubectl get pods --show-labels` 確認 Pod label 是否和 Service selector 一致。

---

**指令 5：進入測試 Pod 驗證連線**

```bash
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh
```

- `--image=curlimages/curl`：輕量 curl 映像
- `--rm`：Pod 結束後自動刪除
- `-it`：互動式 terminal
- `--restart=Never`：跑完就結束，不重啟
- `-- sh`：進入 shell

打完要看：`/ $` 提示符代表進入 Pod 內部。

---

**指令 6：（在測試 Pod 內）用 Service 名稱連 nginx**

```bash
curl http://nginx-svc
```

打完要看：nginx 預設首頁 HTML，包含 `Welcome to nginx!`

異常：
- `Could not resolve host`：DNS 有問題，確認 CoreDNS 在 kube-system 正常運作
- `Connection refused`：targetPort 設錯，Pod 沒有在該 port 監聽

---

**指令 7：（在測試 Pod 內）用完整 FQDN 連 nginx**

```bash
curl http://nginx-svc.default.svc.cluster.local
```

打完要看：和短名稱一樣的 nginx 首頁 HTML。驗證兩種寫法等效。

**FQDN 每一段的意思：**

```
nginx-svc  .  default  .  svc  .  cluster.local
    ↑            ↑         ↑          ↑
Service 名稱  Namespace  固定值    叢集域名（預設）
```

完整格式：`<service-name>.<namespace>.svc.cluster.local`

**為什麼短名稱 `nginx-svc` 也能通？**
- Pod 啟動時，K8s 自動在 `/etc/resolv.conf` 寫入 search domain：
  ```
  search default.svc.cluster.local svc.cluster.local cluster.local
  ```
- DNS 查詢 `nginx-svc` 時，系統自動補成 `nginx-svc.default.svc.cluster.local`
- 驗證：在測試 Pod 內執行 `cat /etc/resolv.conf` 就能看到

**什麼時候必須用 FQDN？**
- 同一個 Namespace 內 → 短名稱就夠（`nginx-svc`）
- 跨 Namespace → 短名稱找不到，必須至少寫到 namespace（`nginx-svc.dev`）
- 最保險 → 完整 FQDN（`nginx-svc.dev.svc.cluster.local`），5-14 Namespace 會詳細教

---

**指令 8-10：驗證 Endpoints 自動更新**

```bash
# 8. 記下目前的 Endpoints
kubectl get endpoints nginx-svc

# 9. 刪掉一個 Pod
kubectl delete pod <pod-name>

# 10. 再看 Endpoints — IP 列表自動更新了
kubectl get endpoints nginx-svc
```

打完要看：刪 Pod 前後 Endpoints 的 IP 不同，但數量仍是 3 個。證明 K8s 自動維護 Endpoints，Pod 換了 IP 也不影響 Service 連線。

---

### 📄 5-12 第 4 張：學員實作：ClusterIP Service（10 min）

> 📋 學生看 PPT 投影片，上面有完整說明。

---

### 📄 5-12 第 5 張：ClusterIP 排錯 + 常見坑（5 min）

### ③ 題目

1. 我幫你準備了一個 Service YAML，selector 故意打錯成 `app: my-nginx`（但 Pod label 是 `app: nginx`）。
   操作：
   - `kubectl apply -f broken-clusterip.yaml`
   - `kubectl get ep nginx-svc`（確認 Endpoints 是 `<none>`）
   - `kubectl get pods --show-labels`（找出 Pod 實際 label）
   - `kubectl describe svc nginx-svc`（找出 selector 哪裡錯了）
   - 修正 selector 後重新 apply
   - `kubectl get ep nginx-svc`（驗收：Endpoints 出現 Pod IP）
   驗收標準：Endpoints 欄位從 `<none>` 變成有 Pod IP:80

2. 把 Service YAML 的 targetPort 故意改成 81（nginx 只監聽 80），apply 後進測試 Pod `curl http://nginx-svc`，觀察 error 訊息跟 selector 打錯的 error 有什麼不同。
   操作：
   - 修改 service-clusterip.yaml 的 `targetPort: 81`
   - `kubectl apply -f service-clusterip.yaml`
   - `kubectl get ep nginx-svc`（Endpoints 有 IP，selector 對了）
   - `kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh`
   - `curl http://nginx-svc`（觀察 error）
   驗收標準：看到 `Connection refused`（不是 Could not resolve host），因為 selector 對了但 Pod 沒在 81 監聽。改回 `targetPort: 80` 後 curl 成功。

3. 進入測試 Pod 執行 `curl http://nginx-svc`，截圖確認看到 `Welcome to nginx!` 字樣。
   操作：
   - `kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh`
   - 在 Pod 內：`curl http://nginx-svc`
   - `exit`
   驗收標準：輸出包含 `Welcome to nginx!`

---

### ④ 解答

**解答 1：**
最可能原因是 Service 的 `selector` 和 Pod 的 `labels` 不一致（`app: my-nginx` vs `app: nginx`）。
除錯步驟：
```bash
kubectl get pods --show-labels            # 確認 Pod 實際有哪些 label
kubectl describe svc nginx-svc            # 確認 Service 的 Selector 是什麼
```
比對兩者是否完全一致，修正 selector 後重新 apply，Endpoints 就會出現 Pod IP。

**解答 2：**
- Endpoints 有 IP（selector 對了），但 curl 會出現 `Connection refused`
- 因為 nginx 實際監聽 port 80，targetPort 設成 81 沒人接
- 跟 selector 打錯的 error 不同：selector 錯 → Endpoints 空 → `Connection refused`（或 timeout）；targetPort 錯 → Endpoints 有 IP 但連不上 → `Connection refused`

**解答 3：**
進入測試 Pod 後執行 `curl http://nginx-svc`，看到包含 `Welcome to nginx!` 的 HTML 即為成功。

---

### 📄 5-12 第 6 張：Lab 4：API 連線中斷，找出 Bug 並修復（15 min）

> 📋 學生看 PPT 投影片，上面有完整說明。

---

## 5-13 NodePort + 三種 Service 比較（25 分鐘）

### 📄 5-13 第 1 張：NodePort -- 讓外面的人連進來（8 min）

### ① 課程內容

**為什麼需要 NodePort**

- ClusterIP 只有叢集內部 Pod 能連
- 開發測試階段需要從外部瀏覽器、postman 直接打 K8s 服務
- NodePort 讓外部流量能進來

**NodePort 的運作原理**

- K8s 在**每個 Node** 上開放同一個 port（nodePort）
- 外部只要能連到任意一個 Node 的 IP，打 nodePort 就能進入叢集
- 即使某個 Node 上沒有對應的 Pod，流量也會被轉發到有 Pod 的 Node

**三個 Port 的完整路徑**

```
外部請求
  → Node IP : nodePort（30000-32767，每個 Node 都開）
  → Service : port（叢集內虛擬 IP 的 port）
  → Pod : targetPort（應用程式監聽的 port）
```

- `nodePort`：可自定義（30000-32767），或讓 K8s 隨機分配
- 不指定 nodePort 時，K8s 自動選一個未被使用的 port

**Port-forward vs NodePort 對照**

| 方式 | 用途 | 持久性 | 指令 |
|------|------|--------|------|
| `kubectl port-forward` | 開發除錯，臨時使用 | 終端關掉就消失 | `kubectl port-forward pod/xxx 8080:80` |
| NodePort | 長期對外，測試環境 | 持續存在直到刪除 | 寫在 YAML `type: NodePort` |

---

### 📄 5-13 第 2 張：三種 Service 類型比較（7 min）

**三種 Service 的遞增包含關係**

```
ClusterIP（最基礎，內部用）
    ⊂ NodePort（在 ClusterIP 基礎上加上每個 Node 開 port）
        ⊂ LoadBalancer（在 NodePort 基礎上再加一個外部 LB IP）
```

- NodePort 建立後，ClusterIP 功能還是在的（叢集內部依然能用 Service 名稱存取）
- LoadBalancer 需要雲端提供商（AWS ELB、GCP LB、Azure LB）支援

**LoadBalancer 在本地環境的限制**

- minikube：`minikube tunnel` 才能模擬 LoadBalancer IP
- k3s/multipass：需要 MetalLB 或 bare-metal LB 才能取得 EXTERNAL-IP
- 直接 `kubectl apply` LoadBalancer type → `EXTERNAL-IP` 永遠是 `<pending>`

**注意事項**

- NodePort 範圍 30000-32767 是 K8s 預設，可在 kube-apiserver 修改但通常不建議
- 生產環境不建議直接用 NodePort 對外，應使用 Ingress + LoadBalancer

---

### 📄 5-13 第 3 張：Lab：建立 NodePort Service（8 min）

### ② 所有指令＋講解

**指令 1：套用 NodePort Service YAML**

```bash
kubectl apply -f service-nodeport.yaml
```

YAML 範例（`service-nodeport.yaml`）：
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

打完要看：
```
service/nginx-nodeport created
```

---

**指令 2：查看 Service，確認 NodePort 分配**

```bash
kubectl get svc
```

打完要看（重點看 PORT(S) 欄位）：
```
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx-nodeport   NodePort    10.96.200.10    <none>        80:30080/TCP   10s
```

格式解讀：`80:30080/TCP`
- 左邊 `80`：Service 的 port（叢集內部用）
- 右邊 `30080`：nodePort（外部連 Node 這個 port）

---

**指令 3：查詢 Node 的 IP（multipass 環境）**

```bash
multipass info k3s-worker1 | grep IPv4
```

- `multipass info`：查詢虛擬機資訊
- `grep IPv4`：篩選出 IP 那行

打完要看：
```
IPv4:           192.168.64.5
```

也可用：
```bash
kubectl get nodes -o wide
```
看 `INTERNAL-IP` 欄位。

---

**指令 4：從外部 curl NodePort**

```bash
curl http://<node-ip>:30080
```

例如：
```bash
curl http://192.168.64.5:30080
```

打完要看：nginx 首頁 HTML，`Welcome to nginx!`

異常：
- `Connection refused`：nodePort 設錯，或防火牆阻擋
- `Connection timed out`：Node IP 不對，或 Node 未就緒

---

**指令 5：（minikube 用戶）一鍵開啟 Service**

```bash
minikube service nginx-nodeport
```

- minikube 自動找出 Node IP 並在瀏覽器開啟正確的 URL
- 適合 minikube 環境，非 minikube 不需要這個指令

打完要看：自動開啟瀏覽器，或顯示可存取的 URL。

---

**指令 6：刪除 Service**

```bash
kubectl delete svc nginx-nodeport
```

打完要看：
```
service "nginx-nodeport" deleted
```

注意：刪除 Service 不會刪除 Deployment 或 Pod，只是移除這個入口。

---

### 📄 5-13 第 4 張：學員實作：NodePort Service（10 min）

> 📋 學生看 PPT 投影片，上面有完整說明。

---

### 📄 5-13 第 5 張：NodePort 排錯 + Loop 4-5 小結（5 min）

### ③ 題目

1. 一個 NodePort Service 的 YAML 寫了 `nodePort: 29999`，套用後會發生什麼事？

2. 你有 3 個 Node（IP 分別是 192.168.1.1、192.168.1.2、192.168.1.3），其中只有 Node 1 上有 nginx Pod，nodePort 是 30080。請問 `curl http://192.168.1.2:30080` 能成功嗎？

3. 為什麼 LoadBalancer Service 在 multipass 環境 EXTERNAL-IP 會一直是 `<pending>`？

---

### ④ 解答

**解答 1：**
套用失敗，K8s 會拒絕。NodePort 的合法範圍是 30000-32767，29999 超出範圍，會出現 validation error。

**解答 2：**
能成功。NodePort 會在**每個 Node** 上開 30080，即使該 Node 沒有 Pod，kube-proxy 也會把流量轉發到有 Pod 的 Node 上。

**解答 3：**
LoadBalancer 需要雲端或 bare-metal LB controller（如 MetalLB）來分配外部 IP。multipass 是本機 VM 環境，沒有這個 controller，所以 K8s 一直在等外部 IP 分配，永遠顯示 `<pending>`。

---

### 📄 5-13 第 6 張：Lab 5：老闆說從外面連不到，找出兩個 Bug（15 min）

> 📋 學生看 PPT 投影片，上面有完整說明。

---

## 5-14 CoreDNS + Namespace（30 分鐘）

### 📄 5-14 第 1 張：DNS 服務發現 -- 用名字找服務（8 min）

### ① 課程內容

**CoreDNS 是什麼**

- K8s 內建的 DNS 服務，以 Pod 形式跑在 `kube-system` namespace
- 你建立一個 Service，CoreDNS 自動新增一筆 DNS 記錄
- Pod 啟動時，`/etc/resolv.conf` 自動指向 CoreDNS 的 ClusterIP

**FQDN 格式（完整網域名稱）**

```
<service-name>.<namespace>.svc.cluster.local
```

例如：`nginx-svc.default.svc.cluster.local`

**三種寫法與使用時機**

| 寫法 | 範例 | 使用時機 |
|------|------|---------|
| 短名稱 | `nginx-svc` | 同一個 namespace 內，最常用 |
| 含 namespace | `nginx-svc.default` | 跨 namespace，但同叢集 |
| 完整 FQDN | `nginx-svc.default.svc.cluster.local` | 明確指定，或 DNS 短名稱有衝突時 |

**短名稱為何能用**

- Pod 的 `/etc/resolv.conf` 有 `search` 欄位，例如：
  ```
  search default.svc.cluster.local svc.cluster.local cluster.local
  ```
- DNS 查詢 `nginx-svc` 時，系統自動嘗試補上 search domain
- 所以 `nginx-svc` 會被解析成 `nginx-svc.default.svc.cluster.local`

---

### 📄 5-14 第 2 張：Namespace -- 叢集裡的資料夾（7 min）

**Namespace 的核心概念**

- Namespace 是 K8s 的**邏輯隔離**單位（非網路隔離！）
- 同一個 Namespace 的資源共用名稱空間，不同 Namespace 的同名資源不衝突
- **重要：Namespace 不是網路隔離**，不同 Namespace 的 Pod 預設可以互相連線（除非設了 NetworkPolicy）
- 適合用於：不同環境（dev/staging/prod）、不同團隊、不同應用

**預設四個 Namespace**

| Namespace | 用途 |
|-----------|------|
| `default` | 沒有指定 namespace 時，資源預設放這裡 |
| `kube-system` | K8s 系統元件：CoreDNS、kube-proxy、kube-apiserver 等 |
| `kube-public` | 公開資訊，ClusterInfo 等 |
| `kube-node-lease` | Node 心跳租約，K8s 內部用 |

**跨 Namespace 存取**

- 同 Namespace：直接用短名稱 `nginx-svc`
- 跨 Namespace：必須用 FQDN 或至少含 namespace 的名稱

```
# 從 staging namespace 連 default namespace 的 nginx-svc
wget http://nginx-svc.default.svc.cluster.local
```

**危險操作警告**

- `kubectl delete namespace dev` 會**刪除該 namespace 內所有資源**（Deployment、Pod、Service、ConfigMap 全部）
- 刪前務必確認或備份！

**切換預設 Namespace**

- 每次 kubectl 指令加 `-n dev` 會很煩
- 可以切換預設 namespace，讓 kubectl 預設操作指定 namespace

---

### 📄 5-14 第 3 張：DNS 深度偵探：撥開黑盒子（10 min）

**DNS 深度偵探：撥開黑盒子**

- 進入測試 Pod 執行 `cat /etc/resolv.conf`，親眼看到 `nameserver 10.96.0.10`（CoreDNS）和 `search default.svc.cluster.local ...`
- 執行 `nslookup nginx-svc`，看 CoreDNS 把 Service 名稱翻成 ClusterIP

**刺客教學：關掉 CoreDNS**

1. `kubectl scale deployment coredns -n kube-system --replicas=0`（關掉 CoreDNS）
2. `curl http://nginx-svc` → 失敗（Temporary failure in name resolution）
3. `curl http://<ClusterIP>` → 成功！IP 直連不需要 DNS
4. `kubectl scale deployment coredns -n kube-system --replicas=2`（恢復）

結論：DNS 解析（名字→IP）和網路轉發（IP→Pod）是兩套完全獨立的機制。CoreDNS 負責前者，kube-proxy 負責後者。

口訣：「DNS 給你地圖（名字變 IP），kube-proxy 帶你走路（IP 變 Pod）。」

---

### 📄 5-14 第 4 張：Lab：DNS 驗證 + Namespace 實作（8 min）

### ② 所有指令＋講解

**指令 1：確認 CoreDNS 在 kube-system 正常運作**

```bash
kubectl get pods -n kube-system | grep dns
```

- `-n kube-system`：指定查看 kube-system namespace
- `| grep dns`：篩選只看 DNS 相關 Pod

打完要看：
```
coredns-5d78c9869d-abc12   1/1     Running   0          3d
coredns-5d78c9869d-def34   1/1     Running   0          3d
```

兩個 CoreDNS Pod 都是 `Running` 才正常（K8s 預設跑兩個做 HA）。

---

**指令 2：進入測試 Pod（busybox）做 DNS 測試**

```bash
kubectl run dns-test --image=busybox:1.36 --rm -it --restart=Never -- sh
```

- `busybox:1.36`：包含 wget、nslookup、cat 等工具的輕量映像
- 固定用 `1.36`（避免 `latest` 的 busybox 有 DNS 問題）

打完要看：`/ #` 提示符（busybox 的 shell）

---

**指令 3：（在測試 Pod 內）短名稱存取 Service**

```bash
wget -qO- http://nginx-svc
```

- `-q`：安靜模式，不顯示進度
- `-O-`：輸出到 stdout

打完要看：nginx 首頁 HTML

---

**指令 4：（在測試 Pod 內）完整 FQDN 存取**

```bash
wget -qO- http://nginx-svc.default.svc.cluster.local
```

打完要看：和短名稱一樣，nginx 首頁 HTML。驗證兩種寫法結果相同。

---

**指令 5：（在測試 Pod 內）用 nslookup 查 DNS 解析**

```bash
nslookup nginx-svc
```

打完要看：
```
Server:    10.96.0.10
Address 1: 10.96.0.10 kube-dns.kube-system.svc.cluster.local

Name:      nginx-svc
Address 1: 10.96.123.45 nginx-svc.default.svc.cluster.local
```

- `Server`：CoreDNS 的 IP
- `Address 1`：nginx-svc 被解析到的 ClusterIP

---

**指令 5.5：（在測試 Pod 內）觀察 DNS 設定**

```bash
cat /etc/resolv.conf
```

打完要看：
```
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
```

- `nameserver`：CoreDNS 的 ClusterIP，Pod 預設都向它查詢
- `search`：自動補全清單，所以打 `nginx-svc` 等同打 `nginx-svc.default.svc.cluster.local`

---

**指令 5.6：刺客教學 — 關掉 CoreDNS 驗證兩套獨立機制**

```bash
# 關掉 CoreDNS
kubectl scale deployment coredns -n kube-system --replicas=0

# 進測試 Pod
kubectl run test-curl --image=curlimages/curl --rm -it --restart=Never -- sh

# 在 Pod 內：
curl http://nginx-svc          # 失敗：Temporary failure in name resolution
curl http://<ClusterIP>        # 成功！IP 直連不需要 DNS

# 恢復 CoreDNS
kubectl scale deployment coredns -n kube-system --replicas=2
```

打完要看：
- `curl http://nginx-svc` → 失敗（Name resolution failed）
- `curl http://<ClusterIP>` → 成功（Welcome to nginx!）

結論：DNS 解析和網路轉發是兩套獨立機制。CoreDNS 負責前者（名字→IP），kube-proxy 負責後者（IP→Pod）。

---

**指令 6：套用含 Namespace 的 YAML**

```bash
kubectl apply -f namespace-practice.yaml
```

YAML 範例：
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

打完要看：
```
namespace/dev created
namespace/staging created
```

---

**指令 7：列出所有 Namespace**

```bash
kubectl get namespaces
# 縮寫
kubectl get ns
```

打完要看：
```
NAME              STATUS   AGE
default           Active   3d
dev               Active   5s
kube-node-lease   Active   3d
kube-public       Active   3d
kube-system       Active   3d
staging           Active   5s
```

---

**指令 8：在指定 Namespace 建立 Deployment**

```bash
kubectl create deployment nginx-deploy --image=nginx:1.27 -n dev
```

- `-n dev`：在 dev namespace 建立
- 沒加 `-n` 就會建在 default

打完要看：
```
deployment.apps/nginx-deploy created
```

---

**指令 9：查看指定 Namespace 的 Pod**

```bash
kubectl get pods -n dev
```

打完要看：
```
NAME                         READY   STATUS    RESTARTS   AGE
nginx-deploy-7d8f9b4c5-xyzab   1/1     Running   0          30s
```

---

**指令 10：列出所有 Namespace 的 Deployment**

```bash
kubectl get deployments -A
```

- `-A` 或 `--all-namespaces`：列出所有 namespace 的資源

打完要看：包含 default、dev 等所有 namespace 的 deployment。

---

**指令 11：在指定 Namespace expose Service**

```bash
kubectl expose deployment nginx-deploy --port=80 -n dev
```

打完要看：
```
service/nginx-deploy exposed
```

---

**指令 12：跨 Namespace 存取（用 FQDN）**

```bash
kubectl run cross-test --image=busybox:1.36 --rm -it --restart=Never -- wget -qO- http://nginx-deploy.dev.svc.cluster.local
```

- 這個指令會在 default namespace 啟動 Pod
- 然後連 dev namespace 的 nginx-deploy Service
- 必須用 FQDN（`nginx-deploy.dev.svc.cluster.local`）

打完要看：nginx 首頁 HTML（代表跨 namespace 連線成功）

---

### 📄 5-14 第 5 張：學員實作：DNS + Namespace（10 min）

> 📋 學生看 PPT 投影片，上面有完整說明。

---

### 📄 5-14 第 6 張：DNS + Namespace 常見坑（5 min）

**指令 13：刪除 Namespace（危險！）**

```bash
kubectl delete namespace dev staging
```

- 一次刪多個：空格分隔
- **警告：dev 和 staging 裡的所有資源全部刪除**

打完要看：
```
namespace "dev" deleted
namespace "staging" deleted
```

注意：刪除 namespace 可能需要 1-2 分鐘，因為需要等所有資源清除。

---

**指令 14：切換預設 Namespace**

```bash
kubectl config set-context --current --namespace=dev
```

- `--current`：修改目前使用的 context
- `--namespace=dev`：把預設 namespace 設為 dev
- 設完後 `kubectl get pods` 就等於 `kubectl get pods -n dev`

打完要看：
```
Context "k3s" modified.
```

---

**指令 15：確認目前預設 Namespace**

```bash
kubectl config view --minify | grep namespace
```

- `--minify`：只顯示目前 context 的設定
- `grep namespace`：篩選出 namespace 那行

打完要看：
```
    namespace: dev
```

若切回 default：
```bash
kubectl config set-context --current --namespace=default
```

---

### ③ 題目

1. 進入 busybox Pod，分別用短名稱和 FQDN 執行 wget，確認兩種都能得到 nginx 首頁。
   操作：
   - `kubectl run test-dns --image=busybox:1.36 --rm -it --restart=Never -- sh`
   - 在 Pod 內：`wget -qO- http://nginx-svc`（短名稱，同 namespace）
   - 在 Pod 內：`wget -qO- http://nginx-svc.default.svc.cluster.local`（完整 FQDN）
   - `exit`
   驗收標準：兩個指令都回傳 nginx 首頁 HTML

2. 建一個 dev namespace，在裡面建 nginx Deployment + Service，然後從 default namespace 的 busybox 用短名稱連它（會失敗），再用 FQDN 連（成功）——親眼看到兩種不同結果。
   操作：
   - `kubectl create namespace dev`
   - `kubectl create deployment nginx --image=nginx:1.27 -n dev`
   - `kubectl expose deployment nginx --port=80 -n dev`
   - `kubectl run test-cross --image=busybox:1.36 --rm -it --restart=Never -- sh`
   - 在 Pod 內：`wget -qO- http://nginx.dev`（先試短名稱 → 失敗）
   - 在 Pod 內：`wget -qO- http://nginx.dev.svc.cluster.local`（再試 FQDN → 成功）
   驗收標準：短名稱失敗（could not resolve host），FQDN 成功（回傳 nginx 首頁）

3. 在 staging namespace 建一個 Service，然後真的執行 `kubectl delete namespace staging`，觀察裡面的 Deployment 和 Pod 也一起消失了。
   操作：
   - `kubectl create namespace staging`
   - `kubectl create deployment web --image=nginx:1.27 --replicas=2 -n staging`
   - `kubectl get all -n staging`（記下有哪些資源）
   - `kubectl delete namespace staging`
   - `kubectl get all -n staging`（應該看不到任何東西，或 namespace not found）
   驗收標準：delete namespace 之後，`kubectl get all -n staging` 顯示 `No resources found` 或報錯 namespace 不存在

4. 如果把 CoreDNS Pod 刪掉（replicas 設為 0），`curl <ClusterIP>` 會通嗎？`curl <Service名稱>` 會通嗎？為什麼？
   操作：
   - `kubectl get svc nginx-svc`（先記下 ClusterIP）
   - `kubectl scale deployment coredns -n kube-system --replicas=0`
   - `kubectl run test --image=curlimages/curl --rm -it --restart=Never -- sh`
   - `curl http://nginx-svc`（預期失敗）
   - `curl http://<ClusterIP>`（預期成功）
   - `exit`
   - `kubectl scale deployment coredns -n kube-system --replicas=2`（恢復！）

---

### ④ 解答

**解答 1：**
兩個指令都回傳 nginx 首頁 HTML，驗證短名稱和 FQDN 在同一個 namespace 內都能正常工作。短名稱能用是因為 Pod 的 `/etc/resolv.conf` 有 `search default.svc.cluster.local ...` 自動補全。

**解答 2：**
- 短名稱 `wget -qO- http://nginx.dev` 失敗：`could not resolve host`
- FQDN `wget -qO- http://nginx.dev.svc.cluster.local` 成功：回傳 nginx 首頁
- 原因：default namespace 的 Pod search domain 是 `default.svc.cluster.local`，不會自動補上 `dev` namespace，所以短名稱找不到。跨 namespace 必須用 FQDN。

**解答 3：**
`kubectl delete namespace staging` 會刪除該 namespace 內所有資源：Deployment、ReplicaSet、Pod、Service 全部一起消失。驗證方式是 `kubectl get all -n staging` 顯示 `No resources found` 或報錯 namespace 不存在。

**解答 4：**
- `curl <ClusterIP>` 會通。流量轉發由 Node 上的 kube-proxy（iptables/IPVS）處理，不需要 DNS。
- `curl <Service名稱>` 會失敗。沒有 CoreDNS 把名稱翻成 IP，程式報 `Name resolution failed`。
- DNS 解析和網路轉發是兩套獨立機制。

---

### 📄 5-14 第 7 張：Lab 6：跨團隊連線失敗，改用 FQDN 完成連線（15 min）

> 📋 學生看 PPT 投影片，上面有完整說明。
