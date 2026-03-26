# 第四堂 Pod 實作篇 PPT + 逐字稿（舊版存檔）

> 狀態說明：這份檔案保留的是較早期的 12 頁 Pod-only 版本。
> 目前第四天下午的正式授課順序，請以 [src/slides/lesson4-afternoon/index.tsx](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/src/slides/lesson4-afternoon/index.tsx) 與 [docs/k8s-day4-afternoon-v3-part1.md](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/docs/k8s-day4-afternoon-v3-part1.md) 到 [docs/k8s-day4-afternoon-v3-part3.md](/Users/cy76/WorkSpace/sideProject/learn_projects/k8s-course-site/docs/k8s-day4-afternoon-v3-part3.md) 為準。

> 學員已看完概念篇（K8s 全貌：架構、核心資源、Master/Worker 元件），裝好 minikube
> 這個章節是 Pod 動手時間：每個概念講完就實作

---

## 第 1 頁 | Pod 實作：開場（5min）

### PPT 內容

**概念篇回顧**

| 前面學了什麼 | 一句話 |
|:---:|---------|
| K8s 是什麼 | 容器的管理平台，解決「容器太多管不動」的問題 |
| 核心資源 | Pod、Service、Deployment、ConfigMap、Secret、Volume |
| 架構 | Master（API Server + etcd + Scheduler + Controller Manager）+ Worker（kubelet + kube-proxy + Container Runtime） |
| minikube | 已經裝好，單節點叢集跑起來了 |

**接下來的計畫：全部都是 Pod 實作**

| 順序 | 內容 |
|------|------|
| 第一部分 | YAML 格式 + Pod 概念 |
| 第二部分 | 實作：第一個 Pod（完整 CRUD） |
| 第三部分 | Pod 生命週期 + 排錯實作 |
| 第四部分 | 多容器 Pod（Sidecar）+ kubectl 進階 |
| 第五部分 | 自由練習 + 總結 |

---

### 逐字稿

好，我們先快速回顧一下前面章節的內容。前面我們花了一整個章節講完了 Kubernetes 的全貌。我們知道了 K8s 就是一個容器的管理平台，它的核心概念包括 Pod、Service、Deployment 這些資源物件。架構方面，我們知道了 Master 節點上跑著 API Server、etcd、Scheduler、Controller Manager，Worker 節點上跑著 kubelet、kube-proxy 和 Container Runtime。然後我們也把 minikube 裝好了，用 `kubectl get nodes` 確認叢集已經在跑了。

接下來我們要進入最重要的環節 — 動手做。接下來全部都是 Pod 實作，我們會從最基礎的 YAML 格式開始，然後寫出第一個 Pod，學會怎麼排錯，最後還會玩多容器 Pod。節奏是：講一點概念，馬上就動手。所以大家把終端機打開，編輯器準備好，我們要開始寫 YAML 了。

---

## 第 2 頁 | YAML 基本格式（15min）

### PPT 內容

**YAML = YAML Ain't Markup Language（遞迴縮寫）**

- K8s 的配置檔案格式
- 縮排用空格（不能用 Tab！）
- 冒號後面要有空格

**四大必備欄位：**

```yaml
apiVersion: v1            # API 版本
kind: Pod                 # 資源類型
metadata:                 # 中繼資料（名字、標籤）
  name: my-pod
  labels:
    app: my-app
spec:                     # 規格（你想要什麼）
  containers:
    - name: my-container
      image: nginx
```

**對照 docker-compose.yaml：**

| docker-compose.yaml | K8s YAML |
|---------------------|----------|
| `version: '3'` | `apiVersion: v1` |
| `services:` | `kind: Pod` + `spec:` |
| `image: nginx` | `spec.containers[].image: nginx` |
| `ports: - "8080:80"` | `spec.containers[].ports[].containerPort: 80` |
| 整個 compose 檔 | 一個 YAML 檔只描述一個資源 |

**apiVersion 常見值：**

| 資源類型 | apiVersion |
|---------|-----------|
| Pod, Service, ConfigMap, Secret | `v1` |
| Deployment, ReplicaSet, DaemonSet | `apps/v1` |
| CronJob | `batch/v1` |
| Ingress | `networking.k8s.io/v1` |

---

### 逐字稿

好，我們先來認識 YAML 格式。在 K8s 的世界裡，幾乎所有東西都是用 YAML 來描述的。你想要一個 Pod，寫一個 YAML；你想要一個 Service，也是寫一個 YAML；你想要一個 Deployment，還是寫一個 YAML。所以搞懂 YAML 格式是第一步。

YAML 原本叫 Yet Another Markup Language，後來官方改名叫 YAML Ain't Markup Language，一個遞迴縮寫，表示它不是標記語言。不過名字不重要，語法其實很簡單。有三個重點要記住：第一，縮排用空格，不能用 Tab 鍵。這個是初學者最常踩的坑，用了 Tab 就會報錯。建議大家在編輯器裡把 Tab 設成兩個空格或四個空格。第二，冒號後面要有空格，寫 `name: my-pod` 這個冒號和值之間必須有空格。第三，列表用減號加空格開頭，像 `- name: xxx` 這樣。

好，來看 K8s 的 YAML 有四個必備欄位，每一個 K8s 的 YAML 檔案都一定會有這四個東西。

第一個是 `apiVersion`，告訴 K8s 這個配置檔用的是哪個版本的 API。不同的資源類型用不同的 apiVersion。比如 Pod 和 Service 用 `v1`，Deployment 用 `apps/v1`。這個基本上是固定的，不用背，用到的時候查一下就知道了。

第二個是 `kind`，就是你要建什麼東西。是 Pod？是 Service？還是 Deployment？寫在 kind 這裡。

第三個是 `metadata`，中繼資料，最重要的就是 `name`，給你的資源取個名字。還可以加 `labels`，也就是標籤，後面 Service 會用標籤來找到對應的 Pod。

第四個是 `spec`，specification 的縮寫，就是「規格」的意思。你想要什麼樣的容器、用什麼 image、開什麼 port，都寫在 spec 裡面。

大家可以對照一下 Docker Compose 的 YAML。Docker Compose 裡面寫 `version: '3'`，K8s 這邊對應的是 `apiVersion`。Docker Compose 裡面的 `services` 區塊，K8s 這邊拆成了 `kind` 和 `spec`。Docker Compose 的 `image: nginx`，K8s 寫成 `spec.containers[].image: nginx`，稍微深了一點，但本質上是一樣的 — 都是在告訴系統「我要跑什麼容器」。

最大的差別是什麼呢？Docker Compose 一個檔案可以描述一整套服務，包括前端、後端、資料庫。但是 K8s 的 YAML 通常一個檔案就描述一個資源物件。當然你也可以用 `---` 分隔符號把多個資源寫在同一個檔案裡，但我們初學先養成好習慣，一個檔案一個資源。

---

## 第 3 頁 | Pod 是什麼（10min）

### PPT 內容

**Pod = K8s 最小部署單位**

- 不是直接跑 Container，而是跑 Pod
- Pod 裡面包一個（或多個）Container
- Pod 裡的容器共享：
  - 網路（同一個 IP，用 localhost 互連）
  - 儲存（可以掛同一個 Volume）

**對照 Docker：**

| Docker | Kubernetes |
|--------|-----------|
| `docker run nginx` | `kubectl run nginx --image=nginx` |
| `docker ps` | `kubectl get pods` |
| `docker logs <id>` | `kubectl logs <pod-name>` |
| `docker exec -it <id> bash` | `kubectl exec -it <pod-name> -- bash` |
| `docker stop / rm` | `kubectl delete pod <pod-name>` |
| `docker inspect` | `kubectl describe pod <pod-name>` |

**為什麼不直接用 Container？**

- K8s 需要一個「管理單位」→ 那就是 Pod
- Pod 可以包多個緊密耦合的容器（Sidecar 模式）
- Pod 有自己的 IP、hostname、lifecycle
- 最佳實踐：**一個 Pod 放一個容器**

---

### 逐字稿

好，現在我們知道 YAML 怎麼寫了，接下來要搞清楚一個最重要的概念 — Pod。

Pod 是 Kubernetes 裡面最小的部署單位。注意，不是 Container，是 Pod。在 Docker 的世界裡，我們直接 `docker run` 就可以跑一個容器。但是在 K8s 裡面，K8s 不會直接管理 Container，它管理的是 Pod。Pod 是在 Container 外面包了一層，你可以把它想成容器的「外殼」或者「膠囊」。

那 Pod 和 Container 到底是什麼關係呢？一個 Pod 裡面可以放一個或多個 Container。而且 Pod 裡面的容器是共享網路和儲存的。什麼意思呢？就是說同一個 Pod 裡面的兩個容器，它們用的是同一個 IP 位址，彼此之間可以用 `localhost` 互相連。而且它們可以掛載同一個 Volume，共享檔案。

大家來看一下 Docker 和 K8s 的指令對照。在 Docker 裡面 `docker run nginx` 跑一個容器，K8s 對應的是 `kubectl run nginx --image=nginx`。Docker 用 `docker ps` 看容器列表，K8s 用 `kubectl get pods`。Docker 用 `docker logs` 看日誌，K8s 用 `kubectl logs`。Docker 用 `docker exec -it` 進容器，K8s 用 `kubectl exec -it`。幾乎都是一對一的對應，只是把 `docker` 換成了 `kubectl`，把 Container 的概念換成了 Pod。

那你可能會問：為什麼要多包這一層？直接管容器不好嗎？原因是 K8s 需要一個更高級的「管理單位」。有些場景你需要把兩個緊密耦合的容器放在一起，比如一個主程式容器加上一個負責收集日誌的輔助容器，這就是所謂的 Sidecar 模式。這種時候就需要 Pod 這個概念。

但是在大多數情況下，我們的最佳實踐是：一個 Pod 裡面只放一個容器。除非你有明確的理由需要多個容器共享網路和儲存，否則就一個 Pod 一個容器就好。

好，概念講完了，接下來我們馬上來動手建立第一個 Pod。

---

## 第 4 頁 | 實作：第一個 Pod（25min）

### PPT 內容

**Lab 3：第一個 Pod**

**Step 1：建立 YAML 檔案**

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
```

**Step 2：部署到叢集**

```bash
kubectl apply -f pod.yaml
```

**Step 3：查看 Pod**

```bash
kubectl get pods                    # 看 Pod 列表
kubectl get pods -o wide            # 多看 IP 和 Node
kubectl describe pod my-nginx       # 詳細資訊
```

**Step 4：看日誌、進容器**

```bash
kubectl logs my-nginx               # 看日誌
kubectl exec -it my-nginx -- /bin/sh  # 進容器
# 進去之後試試：
curl localhost                      # 看 nginx 歡迎頁
ls /usr/share/nginx/html/           # 看網頁根目錄
exit                                # 離開
```

**Step 5：刪除 Pod**

```bash
kubectl delete pod my-nginx         # 刪除
kubectl get pods                    # 確認刪掉了
```

**對照 Docker 完整流程：**

```bash
# Docker 版本
docker run -d --name my-nginx -p 8080:80 nginx:1.27
docker ps
docker logs my-nginx
docker exec -it my-nginx /bin/sh
docker stop my-nginx && docker rm my-nginx

# K8s 版本
kubectl apply -f pod.yaml
kubectl get pods
kubectl logs my-nginx
kubectl exec -it my-nginx -- /bin/sh
kubectl delete pod my-nginx
```

---

### 逐字稿

好，現在我們來動手了。這是今天最重要的實作 — 建立你的第一個 Pod。請大家跟著我一步一步做。

首先，打開你的終端機。我們先確認一下 minikube 還在跑。輸入 `minikube status`，看一下狀態。應該會顯示 host 是 Running、kubelet 是 Running、apiserver 是 Running。如果沒有在跑的話，輸入 `minikube start` 重新啟動一下。

確認叢集在跑之後，我們來建立 YAML 檔案。先建一個工作目錄，你可以在家目錄下建一個叫 `k8s-course-labs/lesson4` 的資料夾：

```bash
mkdir -p ~/k8s-course-labs/lesson4
cd ~/k8s-course-labs/lesson4
```

好，然後打開你的編輯器。你可以用 vim、nano，或者用 VS Code 都可以。我們來建一個叫 `pod.yaml` 的檔案。輸入以下內容：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-nginx
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
```

我們一行一行來看。`apiVersion: v1`，因為 Pod 的 API 版本是 v1，這是固定的。`kind: Pod`，我們要建的是一個 Pod。`metadata` 裡面 `name: my-nginx`，這是 Pod 的名字，之後用 kubectl 指令都會用這個名字。`labels` 裡面 `app: nginx`，這是一個標籤，後面學 Service 的時候會用到。

`spec` 區塊就是最重要的部分了。`containers` 是一個列表，用減號開頭表示列表項目。`name: nginx` 是容器的名字，一個 Pod 裡面可能有多個容器，所以每個容器要有自己的名字。`image: nginx:1.27` 就是我們要用的 Docker image，這裡用的是 nginx 的 1.27 版本。`ports` 裡面 `containerPort: 80`，這是在宣告這個容器監聽 80 port。注意，這其實更像一個文件記錄，告訴看 YAML 的人「這個容器用 80 port」。即使你不寫 containerPort，nginx 一樣會監聽 80，但寫上去是好習慣。

大家注意一下縮排。`metadata` 和 `spec` 是第一層，前面不縮排。`name`、`labels`、`containers` 是第二層，縮排兩個空格。`app`、`image`、`ports` 是第三層，縮排四個空格。YAML 的縮排非常重要，縮排錯了就會報錯。

存檔之後，我們來部署它。輸入：

```
kubectl apply -f pod.yaml
```

順帶一提，你在網路上可能會看到 `kubectl create -f` 的寫法，也可以用。差別是 `apply` 可以重複執行（有變更就更新），`create` 只能建立一次，已經存在就會報錯。我們統一用 `apply`。

應該會看到 `pod/my-nginx created` 的訊息。這表示 K8s 收到了我們的請求，正在建立這個 Pod。

馬上來看一下狀態。輸入：

```
kubectl get pods
```

你應該會看到一個叫 `my-nginx` 的 Pod。如果 STATUS 是 `ContainerCreating`，表示還在拉取 image，等一下就好了。如果是 `Running`，恭喜你，你的第一個 Pod 成功跑起來了！

我們加一個 `-o wide` 參數看更多資訊：

```
kubectl get pods -o wide
```

你會多看到 IP 位址和 NODE 兩個欄位。IP 是 Pod 在叢集內部的 IP，注意這個 IP 只能在叢集內部使用。NODE 顯示 `minikube`，因為我們只有一個節點。

接下來用 `describe` 看詳細資訊：

```
kubectl describe pod my-nginx
```

這個指令會列出這個 Pod 的所有細節。往下滾可以看到 Events 區塊，這裡會顯示 K8s 做了哪些事情：Scheduled — 調度到哪個 Node、Pulling — 正在拉 image、Pulled — image 拉好了、Created — 容器建好了、Started — 容器啟動了。以後排錯的時候，Events 是你最好的朋友。

再來看日誌：

```
kubectl logs my-nginx
```

因為 nginx 剛啟動沒什麼流量，所以日誌可能很少，只有啟動訊息。這對應的就是 Docker 的 `docker logs`。

最後，我們來進到容器裡面。輸入：

```
kubectl exec -it my-nginx -- /bin/sh
```

注意這裡有一個雙減號 `--`，它的作用是告訴 kubectl：後面的東西是要在容器裡執行的命令，不是 kubectl 的參數。這是 K8s 跟 Docker 的一個小差異，Docker 的 `exec` 不需要這個雙減號。

進去之後，你會看到命令提示符變了。我們可以試試：

```
curl localhost
```

你應該會看到 nginx 的歡迎頁面。再試試看：

```
ls /usr/share/nginx/html/
```

你會看到 `50x.html` 和 `index.html`，這就是 nginx 的預設網頁。

輸入 `exit` 離開容器。

最後我們來清理一下，刪除這個 Pod：

```
kubectl delete pod my-nginx
```

再 `kubectl get pods` 確認一下，Pod 已經被刪掉了。

恭喜大家，你們剛剛完成了 Pod 的完整生命週期操作：建立、查看、看日誌、進容器、刪除。這些操作你以後會每天都用到。

大家對照一下 Docker 的流程：Docker 是 `docker run` → `docker ps` → `docker logs` → `docker exec` → `docker stop && docker rm`。K8s 是 `kubectl apply` → `kubectl get pods` → `kubectl logs` → `kubectl exec` → `kubectl delete pod`。本質上是一樣的，只是語法稍有不同。

---

## 第 5 頁 | Pod 的生命週期（10min）

### PPT 內容

**Pod phase（Kubernetes API 的高層摘要）**

```
Pending → Running → Succeeded / Failed
```

**kubectl 常見 STATUS / Reason：**

| 顯示 | 意思 | 常見原因 |
|------|------|---------|
| `Pending` | Pod 尚未就緒 | 排程中、image 很大正在拉 |
| `ContainerCreating` | `kubectl` 常見 STATUS，代表容器仍在 Waiting | 正在拉 image、掛 Volume、套用 Secret / ConfigMap |
| `Running` | 至少一個主要 container 已啟動 | 正常 ✅ |
| `Succeeded` | 全部容器正常結束 | Job 類的任務正常結束 |
| `Failed` | 至少一個容器以失敗結束且不再重啟 | 容器裡的程式 crash |
| `CrashLoopBackOff` | 容器反覆重啟 | 容器啟動後馬上 crash → K8s 重啟 → 又 crash → 間隔越來越長 |
| `ImagePullBackOff` | 拉不到 image | image 名字拼錯、tag 不存在、私有倉庫沒權限 |
| `ErrImagePull` | 拉 image 失敗 | 同上，第一次失敗 |
| `Terminating` | `kubectl` 常見 STATUS，正在優雅停止 | 正在執行 graceful shutdown |

**CrashLoopBackOff 重啟間隔：**
10s → 20s → 40s → 80s → ... → 最長 5min

**排錯三兄弟：**
```bash
kubectl get pods              # 1. 先看狀態
kubectl describe pod <name>   # 2. 看 Events 找原因
kubectl logs <name>           # 3. 看容器日誌
```

---

### 逐字稿

好，在我們做下一個實作之前，我要先跟大家講一個很重要的概念 — Pod 的生命週期。

不過這裡要先分兩層。Kubernetes API 裡真正的 Pod phase，只有 `Pending`、`Running`、`Succeeded`、`Failed`，另外還有比較少遇到的 `Unknown`。你平常在 `kubectl get pods` 的 STATUS 欄看到的 `ContainerCreating`、`CrashLoopBackOff`、`Terminating`，很多時候是為了讓人比較好理解的顯示值，或是 container 的 waiting reason，不要把它們全部當成同一層的 phase。

一個 Pod 從建立到結束，會經歷幾個高層的 phase。最開始是 `Pending`，就是「排隊中」的意思。K8s 收到了你的請求，正在找一個合適的 Node 來放這個 Pod。在 `Pending` 這個 phase 裡，你常常會在 STATUS 欄看到 `ContainerCreating`，代表 K8s 正在拉取 Docker image、建立容器。image 拉完、容器跑起來之後，就會變成 `Running`，表示一切正常。

如果容器裡的程式是一次性的任務，跑完之後會變成 `Succeeded`。如果程式 crash 了，就會變成 `Failed`。

但是實際工作中，你最常碰到的不是這些正常狀態，而是兩個「異常狀態」。第一個叫 `ImagePullBackOff`，意思是 K8s 拉不到你指定的 Docker image。最常見的原因就是 image 名字拼錯了，比如你把 `nginx` 打成了 `ngin`，Docker Hub 上找不到這個 image，就會報這個錯。

第二個叫 `CrashLoopBackOff`，這是最讓人頭痛的狀態。它的意思是：容器啟動了，但是馬上就 crash 了。K8s 很聰明，它會自動幫你重啟容器。但是如果重啟之後又 crash，K8s 不會無限快速重試，它會用一個「退避」策略：第一次等 10 秒再重啟，第二次等 20 秒，第三次等 40 秒，以此類推，最長等 5 分鐘。所以你看到 `CrashLoopBackOff` 的時候，就知道容器在反覆重啟中。

碰到問題怎麼辦？記住排錯三兄弟。第一步 `kubectl get pods` 看狀態，知道是什麼錯。第二步 `kubectl describe pod` 看 Events，裡面會告訴你詳細原因。第三步 `kubectl logs` 看容器日誌，看看程式是不是報了什麼錯。這三個指令是你排錯的萬能工具，一定要記住。

補充一個：如果容器根本沒跑起來，logs 看不到東西，可以試試 `kubectl get events --sort-by=.metadata.creationTimestamp`，這會列出叢集裡所有最近發生的事件，有時候能找到更底層的原因。

好，講完了概念，我們馬上就來實際體驗一下排錯的過程。

---

## 第 6 頁 | 實作：Pod 排錯（20min）

### PPT 內容

**Lab 4：Pod 排錯實戰**

**故意製造錯誤！**

**Step 1：建立一個「壞的」Pod**

```yaml
# pod-broken.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-pod
  labels:
    app: broken
spec:
  containers:
    - name: broken
      image: ngin        # 故意拼錯！不是 nginx
      ports:
        - containerPort: 80
```

**Step 2：部署並觀察**

```bash
kubectl apply -f pod-broken.yaml
kubectl get pods                        # 看到 ErrImagePull 或 ImagePullBackOff
kubectl get pods --watch                # 持續觀察狀態變化（Ctrl+C 停止）
```

**Step 3：用 describe 找原因**

```bash
kubectl describe pod broken-pod
# 拉到最下面看 Events：
# Failed to pull image "ngin": ... not found
```

**Step 4：修正並重新部署**

```bash
# 方法 1：刪掉重建
kubectl delete pod broken-pod
# 修改 pod-broken.yaml：把 ngin 改成 nginx:1.27
kubectl apply -f pod-broken.yaml

# 方法 2：直接修改（進階）
kubectl edit pod broken-pod
# 在編輯器中把 image 改成 nginx:1.27，存檔退出
```

**Step 5：確認修好了**

```bash
kubectl get pods                        # STATUS: Running ✅
```

---

### 逐字稿

好，接下來我們要做一個很有趣的實作 — 故意把 Pod 搞壞，然後學會怎麼找問題、修問題。

為什麼要故意搞壞呢？因為在實際工作中，你會花大量時間在排錯上面。與其等到出了問題手忙腳亂，不如現在就先練習一遍。

來，大家跟我一起做。建一個新的 YAML 檔案叫 `pod-broken.yaml`，內容跟剛才差不多，但是有一個地方我們故意打錯。大家看 image 那一行，我寫的是 `ngin`，不是 `nginx`。少了一個 `x`。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-pod
  labels:
    app: broken
spec:
  containers:
    - name: broken
      image: ngin
      ports:
        - containerPort: 80
```

存檔之後，部署它：

```
kubectl apply -f pod-broken.yaml
```

好，K8s 會說 `pod/broken-pod created`。看起來好像成功了對不對？但是等一下...我們來看看狀態：

```
kubectl get pods
```

你會發現 broken-pod 的 STATUS 不是 `Running`，而是 `ErrImagePull` 或者 `ImagePullBackOff`。這就是我們剛才講的，K8s 拉不到 `ngin` 這個 image，因為 Docker Hub 上根本沒有這個東西。

我們可以用 `--watch` 參數來持續觀察狀態變化：

```
kubectl get pods --watch
```

你會看到狀態在 `ErrImagePull` 和 `ImagePullBackOff` 之間切換。K8s 會不斷重試拉取 image，每次失敗之後等待的時間會越來越長。按 Ctrl+C 停止觀察。

好，現在我們知道有問題了，接下來要找出具體原因。這就是排錯三兄弟的第二步 — `describe`：

```
kubectl describe pod broken-pod
```

輸出很長，不要慌，直接拉到最下面看 Events 區塊。你會看到類似這樣的訊息：

```
Failed to pull image "ngin": rpc error: ... manifest unknown
```

清清楚楚地告訴你：拉取 `ngin` 這個 image 失敗了，因為找不到。原因找到了 — image 名字拼錯了。

現在來修正它。我們有兩種方法。第一種是刪掉重建，比較乾淨：

```
kubectl delete pod broken-pod
```

然後打開 `pod-broken.yaml`，把 `ngin` 改成 `nginx:1.27`，存檔，再重新 apply：

```
kubectl apply -f pod-broken.yaml
```

第二種方法是用 `kubectl edit`，它會直接打開一個編輯器讓你修改正在跑的資源。但這個方法有幾個限制：第一，Pod 的大部分欄位是不可變的，改了 K8s 會拒絕；第二，改完之後不會反映到你的 YAML 檔案裡。所以我建議大家養成修改檔案再 apply 的好習慣。

修正完之後，再看一下狀態：

```
kubectl get pods
```

應該會看到 STATUS 變成 `Running` 了。恭喜，你成功排除了第一個 K8s 錯誤！

記住，以後碰到 Pod 有問題，永遠是這三步：`get pods` 看狀態、`describe pod` 看 Events、`logs` 看日誌。90% 的問題用這三個指令就能找到原因。

在繼續之前，我們先把這個 Pod 清理掉：

```
kubectl delete pod broken-pod
```

---

## 第 7 頁 | 多容器 Pod 概念（10min）

### PPT 內容

**一個 Pod 可以放多個容器**

**什麼時候用多容器 Pod？**
- 兩個容器「必須」共享網路或儲存
- 典型場景：Sidecar 模式

**Sidecar 模式：**
```
┌─────────────────────────────────┐
│ Pod                             │
│  ┌─────────────┐ ┌───────────┐ │
│  │ 主程式容器   │ │ 輔助容器   │ │
│  │ (nginx)     │ │ (busybox) │ │
│  │             │ │ tail log  │ │
│  └──────┬──────┘ └─────┬─────┘ │
│         │    共享 Volume    │    │
│         └──────────────────┘    │
│  共享網路（同一個 IP）            │
└─────────────────────────────────┘
```

**常見 Sidecar 用途：**

| Sidecar 類型 | 做什麼 | 例子 |
|-------------|--------|------|
| 日誌收集 | 收集主程式日誌 | Fluentd / Filebeat |
| 代理 | 處理進出流量 | Envoy / Istio |
| 監控 | 收集指標 | Prometheus exporter |

**多容器 vs 多個 Pod？**

| | 多容器 Pod | 多個 Pod |
|---|---------|---------|
| 何時用 | 容器緊密耦合 | 容器獨立運作 |
| 網路 | 共享 IP（localhost 互連） | 各自有 IP |
| 擴縮容 | 一起擴縮 | 獨立擴縮 |
| 生死 | 一起生一起死 | 獨立生死 |
| 舉例 | nginx + log collector | nginx + mysql |

---

### 逐字稿

好，剛才我們建的 Pod 都是一個 Pod 裡面只有一個容器。但是我前面提到過，一個 Pod 其實可以放多個容器。什麼時候需要這樣做呢？

答案是：當兩個容器必須緊密配合，需要共享網路或者儲存的時候。最經典的模式叫做 Sidecar，中文翻譯是「邊車」。你可以想像一台摩托車旁邊掛了一個邊車，主程式是摩托車，輔助容器就是那個邊車。邊車的作用是協助主程式完成一些額外的功能，比如日誌收集、流量代理、監控數據收集等等。

舉個實際的例子：你有一個 nginx 容器在服務 Web 請求，它會把日誌寫到一個檔案裡。另外你有一個 busybox 容器，專門用來讀取 nginx 的日誌檔案，然後把日誌發送到集中式的日誌系統。這兩個容器就適合放在同一個 Pod 裡面，因為它們需要共享存放日誌的那個 Volume。

在實際的生產環境中，常見的 Sidecar 包括 Fluentd 或 Filebeat 做日誌收集、Envoy 做流量代理（Istio 的 Service Mesh 就是用這個模式）、Prometheus exporter 做監控指標收集。

那什麼時候應該用多個 Pod 而不是多容器 Pod 呢？很簡單 — 如果兩個容器可以獨立運作、獨立擴縮容，那就應該放在不同的 Pod 裡面。比如 nginx 和 MySQL，這兩個東西完全獨立，nginx 需要擴到 5 個副本的時候，MySQL 不需要跟著擴，所以它們應該是兩個獨立的 Pod。

記住一個判斷標準：如果你把一個容器拿掉，另一個容器就沒辦法正常工作了，那它們就適合放在同一個 Pod。如果各自可以獨立運行，就分開放。

---

## 第 8 頁 | 實作：Sidecar Pod（20min）

### PPT 內容

**Lab 5：多容器 Pod — nginx + busybox Sidecar**

**Step 1：建立 Sidecar Pod YAML**

```yaml
# pod-sidecar.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod
  labels:
    app: sidecar-demo
spec:
  containers:
    # 主容器：nginx
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

    # Sidecar 容器：busybox 讀取 nginx 日誌
    - name: log-reader
      image: busybox:1.36
      command: ["sh", "-c", "while [ ! -f /var/log/nginx/access.log ]; do sleep 1; done; tail -f /var/log/nginx/access.log"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

  volumes:
    - name: shared-logs
      emptyDir: {}
```

**Step 2：部署並驗證**

```bash
kubectl apply -f pod-sidecar.yaml
kubectl get pods                    # 看 READY 欄位：2/2 表示兩個容器都在跑
```

**Step 3：製造一些 nginx 流量**

```bash
# 進 nginx 容器，自己 curl 自己
kubectl exec -it sidecar-pod -c nginx -- /bin/sh
curl localhost
curl localhost
curl localhost
exit
```

**Step 4：從 Sidecar 容器看日誌**

```bash
kubectl logs sidecar-pod -c log-reader      # 看到剛才的三次 access log
kubectl logs sidecar-pod -c nginx           # 對比：nginx 容器的 stdout
```

**Step 5：清理**

```bash
kubectl delete pod sidecar-pod
```

**重點觀察：**
- `READY 2/2` → 一個 Pod 裡有兩個容器
- `-c <container-name>` → 指定要看哪個容器
- 兩個容器共享 `shared-logs` volume

---

### 逐字稿

好，概念講完了，接下來我們來實際建一個多容器 Pod。這個 Pod 裡面會有兩個容器：一個 nginx 負責服務 Web 請求，一個 busybox 負責即時讀取 nginx 的 access log。它們透過一個共享的 Volume 來傳遞日誌檔案。

建一個新的 YAML 檔案叫 `pod-sidecar.yaml`。這個 YAML 比之前複雜一些，但不要怕，我們一段一段看。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod
  labels:
    app: sidecar-demo
spec:
  containers:
    - name: nginx
      image: nginx:1.27
      ports:
        - containerPort: 80
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

    - name: log-reader
      image: busybox:1.36
      command: ["sh", "-c", "while [ ! -f /var/log/nginx/access.log ]; do sleep 1; done; tail -f /var/log/nginx/access.log"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/nginx

  volumes:
    - name: shared-logs
      emptyDir: {}
```

我們來看重點。`spec.containers` 下面有兩個容器，不再是只有一個了。第一個容器叫 `nginx`，跟之前一樣。但是多了一個 `volumeMounts`，它把一個叫 `shared-logs` 的 Volume 掛載到 `/var/log/nginx` 這個路徑。nginx 會把 access log 和 error log 寫到這個目錄下。

第二個容器叫 `log-reader`，用的是 busybox image。busybox 是一個超級小的 Linux 工具箱，很適合拿來做 Sidecar。它的 `command` 設定了容器啟動後要執行的指令。注意這裡有一個小細節：我們先用 `while` 迴圈等待 `access.log` 檔案出現，然後才開始 `tail -f`。為什麼？因為 busybox 可能比 nginx 更早啟動，那時候 access.log 還不存在，直接 `tail -f` 會報錯。這是多容器 Pod 很常見的 race condition 問題，加一個等待就解決了。注意，它也掛載了同一個 `shared-logs` Volume 到同樣的路徑。

最後面的 `volumes` 區塊定義了這個共享的 Volume。`emptyDir: {}` 是最簡單的 Volume 類型，它會在 Pod 建立的時候自動建立一個空的目錄，Pod 刪除的時候目錄也會跟著消失。這個就像 Docker 的匿名 Volume。

對照一下 Docker Compose，你可能會這樣寫：

```yaml
services:
  nginx:
    image: nginx:1.27
    volumes:
      - shared-logs:/var/log/nginx
  log-reader:
    image: busybox:1.36
    command: ["sh", "-c", "tail -f /var/log/nginx/access.log"]
    volumes:
      - shared-logs:/var/log/nginx
volumes:
  shared-logs:
```

概念是一樣的，只是 K8s 把它包在一個 Pod 裡面了。

好，存檔，然後部署：

```
kubectl apply -f pod-sidecar.yaml
```

看一下狀態：

```
kubectl get pods
```

注意看 READY 欄位。之前我們的 Pod 顯示的是 `1/1`，表示一個容器中有一個準備好了。現在應該會看到 `2/2`，表示兩個容器都在跑。如果看到 `1/2`，表示有一個容器還沒準備好，稍等一下。

好，兩個容器都 Running 了。接下來我們來製造一些流量。進到 nginx 容器裡面，自己 curl 自己：

```
kubectl exec -it sidecar-pod -c nginx -- /bin/sh
```

注意這裡多了一個 `-c nginx`，因為這個 Pod 裡面有兩個容器，你需要告訴 kubectl 你要進哪一個。`-c` 就是 `--container` 的縮寫。

進去之後，打幾次 curl：

```
curl localhost
curl localhost
curl localhost
```

每次都會看到 nginx 的歡迎頁面。然後 `exit` 離開。

現在精彩的來了。我們來看 log-reader 容器的日誌：

```
kubectl logs sidecar-pod -c log-reader
```

你應該會看到剛才那三次 curl 的 access log！這些日誌是 nginx 寫到 `/var/log/nginx/access.log` 的，而 log-reader 透過共享的 Volume 讀到了同樣的檔案。

這就是 Sidecar 模式的精髓：主容器負責業務邏輯，Sidecar 容器負責輔助功能，兩者透過共享 Volume 協同工作。

最後清理一下：

```
kubectl delete pod sidecar-pod
```

---

## 第 9 頁 | kubectl 進階技巧（15min）

### PPT 內容

**kubectl 的瑞士刀**

**輸出格式：**

```bash
kubectl get pods                        # 預設表格
kubectl get pods -o wide                # 多顯示 IP、Node
kubectl get pods -o yaml                # 完整 YAML 輸出
kubectl get pods -o json                # JSON 格式
kubectl get pods -o name                # 只顯示名字
```

**即時觀察：**

```bash
kubectl get pods --watch                # 持續監控變化
kubectl get pods -w                     # 縮寫
```

**Port Forward（本機連到 Pod）：**

```bash
kubectl port-forward pod/my-nginx 8080:80
# 然後開瀏覽器 → http://localhost:8080
```

**對照 Docker：**

| Docker | kubectl |
|--------|---------|
| `docker run -p 8080:80` | `kubectl port-forward pod/xxx 8080:80` |
| 永久的 port 映射 | 臨時的（關掉終端就沒了） |

**其他好用指令：**

```bash
kubectl get all                         # 看所有資源
kubectl get pods --all-namespaces       # 看所有 namespace 的 Pod
kubectl get pods -A                     # 同上，縮寫
kubectl api-resources                   # 列出所有資源類型
kubectl explain pod.spec.containers     # 查看欄位說明（內建文件）
```

**快速建 Pod（不寫 YAML）：**

```bash
kubectl run quick-nginx --image=nginx:1.27
# 對照：docker run nginx:1.27

# 產生 YAML 但不真的建（超好用！）
kubectl run quick-nginx --image=nginx:1.27 --dry-run=client -o yaml
```

**效率提升小技巧：**

```bash
# kubectl 自動補全（按 Tab 就能補全指令和資源名稱）
source <(kubectl completion bash)
echo 'source <(kubectl completion bash)' >> ~/.bashrc

# 設定別名（之後打 k 就等於 kubectl）
alias k=kubectl
echo 'alias k=kubectl' >> ~/.bashrc
# 之後就可以 k get pods
```

---

### 逐字稿

好，接下來我要教大家一些 kubectl 的進階技巧。這些技巧在日常工作中會大量使用，學會之後效率會提升很多。

首先是輸出格式。我們已經用過 `kubectl get pods` 和 `kubectl get pods -o wide` 了。但其實還有更多格式可以選。

`-o yaml` 會把 Pod 的完整配置用 YAML 格式輸出來。這個非常有用，因為你可以看到 K8s 實際上是怎麼設定這個 Pod 的，包括很多你沒有寫、由 K8s 自動填充的預設值。比如 `restartPolicy` 預設是 `Always`，`dnsPolicy` 預設是 `ClusterFirst`。這個指令在你想要了解某個資源的完整配置時非常好用。

`-o json` 和 `-o yaml` 差不多，只是格式不同。如果你想要用程式來處理輸出，JSON 格式會更方便。

接下來是 `--watch`，可以縮寫成 `-w`。它會讓 kubectl 持續監控資源的變化。比如你 apply 了一個新的 Pod，然後開另一個終端跑 `kubectl get pods -w`，你就可以即時看到 Pod 從 Pending 變成 ContainerCreating 再變成 Running 的過程。這在排錯和觀察部署過程的時候特別好用。

然後是 `port-forward`，這個是個神器。在 Docker 的時候，我們用 `-p 8080:80` 把容器的 port 映射到本機。但是在 K8s 裡面，Pod 的 IP 是叢集內部的，從外面連不到。`port-forward` 就是解決這個問題的。它會在你的本機和 Pod 之間建一個臨時的通道：

```
kubectl port-forward pod/my-nginx 8080:80
```

這行指令的意思是：把本機的 8080 port 轉發到 Pod 的 80 port。執行之後，你打開瀏覽器輸入 `http://localhost:8080`，就可以看到 nginx 的頁面了。

要注意的是，port-forward 是臨時的。你把終端關掉或者按 Ctrl+C，轉發就斷了。這不是正式對外提供服務的方式，正式的方式是用 Service，我們下堂課會學。但是在開發和除錯的時候，port-forward 非常方便。

另外提醒一下，如果你是用 SSH 連到 VM 的，`localhost` 指的是 VM 本身，不是你的筆電。你可以加 `--address 0.0.0.0` 讓外部也能連進來，然後用 VM 的 IP 存取：`kubectl port-forward pod/my-nginx 8080:80 --address 0.0.0.0`。

最後教大家一個超好用的技巧 — `--dry-run=client -o yaml`。有時候你不確定 YAML 該怎麼寫，可以用 kubectl 幫你產生：

```
kubectl run quick-nginx --image=nginx:1.27 --dry-run=client -o yaml
```

`--dry-run=client` 表示「模擬執行，不要真的建」，`-o yaml` 表示輸出 YAML。這樣它就會幫你產生一個完整的 Pod YAML，你可以把它重新導向到檔案裡再修改。這在實際工作中非常常用，不用每次都從零開始寫 YAML。

---

## 第 10 頁 | 實作：kubectl 探索（20min）

### PPT 內容

**Lab 6：kubectl 進階操作**

**Step 1：先建一個 Pod 回來**

```bash
kubectl apply -f pod.yaml              # 用之前的 pod.yaml
kubectl get pods                       # 確認 Running
```

**Step 2：port-forward 實測**

```bash
kubectl port-forward pod/my-nginx 8080:80
# 開另一個終端或瀏覽器：
curl http://localhost:8080             # 看到 nginx 歡迎頁 ✅
# Ctrl+C 停止 port-forward
```

**Step 3：各種輸出格式**

```bash
kubectl get pods -o wide               # IP + Node
kubectl get pods -o yaml               # 完整 YAML
kubectl get pods -o yaml | head -30    # 看前 30 行
```

**Step 4：用 dry-run 產生 YAML**

```bash
# 產生一個 Pod YAML
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml

# 存成檔案
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
cat test-pod.yaml
```

**Step 5：探索叢集**

```bash
kubectl get all                        # 看所有資源
kubectl get pods -A                    # 所有 namespace
kubectl get pods -n kube-system        # 看 K8s 系統元件
kubectl describe node minikube         # 看 Node 詳細資訊
```

**Step 6：清理**

```bash
kubectl delete pod my-nginx
```

---

### 逐字稿

好，我們來把剛才學的這些技巧實際操作一遍。大家先把之前的 Pod 建回來。用我們最早寫的那個 `pod.yaml`：

```
kubectl apply -f pod.yaml
kubectl get pods
```

等到 STATUS 是 Running 之後，我們先來試 port-forward。輸入：

```
kubectl port-forward pod/my-nginx 8080:80
```

你會看到終端顯示 `Forwarding from 127.0.0.1:8080 -> 80`。這時候打開另一個終端視窗，輸入：

```
curl http://localhost:8080
```

你應該會看到 nginx 的歡迎頁面。或者你也可以打開瀏覽器，輸入 `http://localhost:8080`，會看到那個熟悉的「Welcome to nginx!」頁面。

回到執行 port-forward 的終端，你會看到每一次請求都會有一行日誌。按 Ctrl+C 停止 port-forward。

接下來試試看不同的輸出格式：

```
kubectl get pods -o yaml
```

哇，輸出很長對不對？這就是 K8s 裡面這個 Pod 的完整配置。你可以看到很多我們沒有在 YAML 裡面寫的東西，比如 `status` 區塊裡面有 Pod 的 IP、phase、containerStatuses 等等。這些都是 K8s 自動產生和維護的。

如果只想看前面幾行，可以用 pipe 串 head：

```
kubectl get pods -o yaml | head -30
```

接下來來試 dry-run。這真的是一個超級好用的技巧：

```
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml
```

看，它幫你產生了一個完整的 Pod YAML，但是不會真的建立 Pod。你可以把它存成檔案：

```
kubectl run test-pod --image=nginx:1.27 --dry-run=client -o yaml > test-pod.yaml
```

然後用 `cat test-pod.yaml` 看一下內容。以後你忘記 YAML 格式的時候，就用這招快速產生一個模板出來。

最後我們來探索一下叢集。輸入：

```
kubectl get pods -A
```

`-A` 是 `--all-namespaces` 的縮寫，它會列出所有 namespace 的 Pod。你會看到除了我們 default namespace 的 Pod 之外，還有一堆在 `kube-system` namespace 裡的 Pod。這些就是 K8s 自己的系統元件。

我們可以用 `-n kube-system` 只看系統 namespace：

```
kubectl get pods -n kube-system
```

你會看到 `coredns`、`etcd`、`kube-apiserver`、`kube-controller-manager`、`kube-proxy`、`kube-scheduler` 這些 Pod。是不是很眼熟？這就是我們前面講的那些 Master 和 Worker 元件，它們自己也是以 Pod 的形式在跑。K8s 真的是「自己管理自己」。

好，探索完了，清理一下：

```
kubectl delete pod my-nginx
```

---

## 第 11 頁 | 自由練習時間（40min）

### PPT 內容

**練習題目**

**題目 1：基礎 Pod（5min）**

建立一個 Pod：
- 名字：`my-httpd`
- Image：`httpd:2.4`（Apache HTTP Server）
- Port：`80`

提示：把之前的 pod.yaml 複製一份，改 image 就好

驗證：
```bash
kubectl exec -it my-httpd -- /bin/sh
curl localhost                          # 應該看到 "It works!"
```

**題目 2：排錯練習（10min）**

建立一個 Pod：
- Image 故意寫成 `httpd:99.99`（不存在的 tag）
- 觀察錯誤 → describe 找原因 → 修正成 `httpd:2.4`

**題目 3：Sidecar 實戰（15min）**

建立一個雙容器 Pod：
- 容器 1：`httpd:2.4`（主程式）
- 容器 2：`busybox:1.36`，用 `tail -f` 追蹤 httpd 的 access log
- 共享 Volume 路徑：`/usr/local/apache2/logs`

提示：httpd 的日誌路徑和 nginx 不同

驗證：
```bash
kubectl exec -it <pod-name> -c httpd -- curl localhost
kubectl logs <pod-name> -c log-reader   # 看到 access log
```

**題目 4：port-forward（5min）**

用 port-forward 把題目 1 的 httpd 映射到本機 9090 port，然後用瀏覽器打開看

**做完了可以：**
- 用 `kubectl get pods -o yaml` 研究 K8s 自動產生了哪些設定
- 用 `kubectl explain pod.spec` 探索還有哪些可以設定的欄位
- 試試 `kubectl run` + `--dry-run=client -o yaml` 產生各種 YAML

---

### 逐字稿

好，接下來是自由練習時間，大約有 40 分鐘。我準備了四個題目，難度由淺到深，大家按照自己的速度來做。

第一題是基礎 Pod。請你建一個跑 Apache HTTP Server 的 Pod。httpd 是 Docker Hub 上另一個很常用的 Web Server，跟 nginx 一樣是用來服務網頁的。你只需要把之前的 pod.yaml 複製一份，把 image 從 nginx 改成 `httpd:2.4` 就好了。部署好之後，進到容器裡面 curl localhost，應該會看到 `It works!` 的回應。

第二題是排錯練習。跟我們剛才做的一樣，但是這次換一個情境 — 故意用一個不存在的 tag。`httpd:99.99` 這個版本是不存在的，K8s 會報什麼錯？用 describe 找到原因之後，修正成正確的 tag。

第三題是 Sidecar 實戰。請你建一個雙容器 Pod，主容器是 httpd，Sidecar 是 busybox，用 tail -f 追蹤 httpd 的 access log。注意，httpd 的日誌路徑和 nginx 不一樣，httpd 預設把日誌放在 `/usr/local/apache2/logs` 這個目錄下。

第四題是用 port-forward 把 httpd 映射到本機的 9090 port，然後用瀏覽器打開 `http://localhost:9090` 看看能不能看到 Apache 的頁面。

做完這四題的同學，可以用 `kubectl explain` 指令去探索 Pod 還有哪些可以設定的欄位。比如 `kubectl explain pod.spec.containers` 會列出所有容器可以設定的東西，非常多，可以慢慢研究。

好，大家開始動手吧。有問題隨時在討論區留言。

---

## 第 12 頁 | 第四堂總結 + 預告（15min）

### PPT 內容

**今天學了什麼**

| 概念篇 | 實作篇 |
|------|------|
| K8s 是什麼 + 為什麼需要 | YAML 四大欄位 |
| 核心資源總覽 | 第一個 Pod（完整 CRUD） |
| K8s 架構（Master + Worker） | Pod 生命週期 + 排錯 |
| minikube 安裝 | 多容器 Pod（Sidecar） |
| kubectl 基本操作 | kubectl 進階技巧 |

**今天你會的 Docker → K8s 對照：**

| 你會的 Docker | 今天學的 K8s |
|-------------|------------|
| `docker run` | `kubectl apply -f pod.yaml` |
| `docker ps` | `kubectl get pods` |
| `docker logs` | `kubectl logs` |
| `docker exec` | `kubectl exec` |
| `docker stop/rm` | `kubectl delete pod` |
| `docker inspect` | `kubectl describe pod` |
| `docker-compose.yaml` | K8s YAML（apiVersion/kind/metadata/spec） |
| `docker run -p 8080:80` | `kubectl port-forward` |

**回家作業：**
- 把今天的 Pod 練習再做一遍（不看筆記）
- 試試跑不同的 image：`redis`、`python:3.12`、`busybox:1.36`
- 觀察它們的日誌和行為有什麼不同
- 進階挑戰：試試 `mysql:8.0`，但提示 — MySQL 需要設定環境變數才能啟動，Google 搜尋 "kubernetes mysql environment variable" 找答案

**下堂課預告：Deployment + Service + k3s**

| 預告 | 內容 |
|------|------|
| Deployment | 管理多個 Pod — 擴縮容、滾動更新、自動修復 |
| Service | 讓外面連得到你的 Pod — ClusterIP、NodePort |
| k3s | 多節點叢集 — Pod 分散在不同機器上 |

> 今天學的 Pod 是最基礎的「一個容器」
> 下堂課學 Deployment — 「一群容器」+ 對外服務
> Pod 是一個人在做事，Deployment 是一個團隊在做事

---

### 逐字稿

好，大家辛苦了。我們來做這個章節的總結。

第四堂課我們從概念到實作，完成了 K8s 的入門。概念篇我們了解了 K8s 是什麼、為什麼需要它、它的核心資源有哪些、架構長什麼樣子，然後把 minikube 裝起來了。

實作篇我們先學了 YAML 的四大必備欄位：apiVersion、kind、metadata、spec。然後我們寫出了人生中第一個 Pod，用 nginx 跑起來，學會了 apply、get、describe、logs、exec、delete 這些基本操作。接著我們故意把 Pod 搞壞，體驗了 ImagePullBackOff 這個錯誤狀態，學會了用 describe 看 Events 來排錯。然後我們建了一個多容器 Pod，體驗了 Sidecar 模式 — 兩個容器共享 Volume 來協同工作。最後我們學了 port-forward、dry-run 這些 kubectl 的進階技巧。

大家現在回想一下 Docker。今天學的 K8s 操作，幾乎都可以跟 Docker 一一對照。`docker run` 對應 `kubectl apply`，`docker ps` 對應 `kubectl get pods`，`docker logs` 對應 `kubectl logs`。從 Docker 過來學 K8s，其實門檻沒有那麼高對不對？

但是你有沒有發現一個問題？我們今天一直在手動管理 Pod：手動建立、手動刪除。Pod 掛了怎麼辦？要你自己去 describe、修好、重新 apply。如果生產環境有 100 個 Pod，其中一個掛了，你也要自己去處理嗎？

答案是不需要。這就是我們下堂課要學的 Deployment。Deployment 就是幫你自動管理一群 Pod 的東西。你告訴它「我要 3 個 nginx Pod」，它就幫你維持 3 個。掛了一個？它自動幫你補一個回來。要更新版本？它幫你做滾動更新，一個一個換掉，不中斷服務。要擴容？改一個數字就好。

除了 Deployment，下堂課我們還會學 Service。今天我們用 port-forward 來連 Pod，但那只是臨時的除錯工具。Service 才是正式讓外部連到你的 Pod 的方式。我們會學 ClusterIP、NodePort 這兩種 Service 類型。

然後下堂課我們還會裝 k3s，從單節點升級到多節點叢集。這時候你就會看到 Pod 被分散到不同的機器上，真正體會到 K8s 的分佈式管理能力。

用一個比喻來說的話，今天學的 Pod 是「一個人在做事」，下堂課學的 Deployment 是「一個團隊在做事」。一個人會生病、會請假，但是一個團隊可以互相 cover，有人倒了馬上有人頂上。K8s 的 Deployment 就是這個概念。

好，今天就到這裡。回家之後建議大家把今天的練習再做一遍，不看筆記試試看自己能不能從零寫出一個 Pod YAML。也可以試著跑不同的 image，比如 redis、mysql、python，觀察它們的行為有什麼不同。

下堂課見，大家辛苦了！
