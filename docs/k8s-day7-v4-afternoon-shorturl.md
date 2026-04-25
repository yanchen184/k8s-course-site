# 第七堂下午逐字稿 v4 — 7-11 ~ 7-14：短網址服務（學生 2 小時產品實作）

> 目標：學生不用寫程式碼，只負責把產品部署到 Kubernetes，最後理解「手動 YAML」和「Helm 一個指令」其實在做同一件事。
> 適用位置：接在 `docs/k8s-day7-v4-afternoon-loop3.md` 的任務排程系統示範後，作為最後 2 小時學生實作收尾。

---

## 整體教學目標

- 讓學生從「認識元件」走到「部署產品」。
- 讓學生知道手動部署時，每一份 YAML 都在回答一個部署問題。
- 讓學生把驗收分成三層：產品驗收、K8s 驗收、故障驗收。
- 最後再把手動部署和 Helm 串起來，理解實務交付方式。

---

## 7-11 短網址產品實作（講師逐字稿）

### 這一段要講清楚什麼？

- 現在不是要學生寫產品，而是部署產品。
- 這個產品為什麼適合當最後一節。
- 入口、邏輯、資料三層分別在哪裡。
- 開始 apply YAML 前，先把 image 準備到每台 k3s node。

### 建議口條

> 好，前面那一套任務排程系統是我示範給你看，讓你看到一個比較完整、比較企業級的架構可以怎麼拆成 Kubernetes 元件。
>
> 接下來最後這一段，換你們自己動手，但不是要你們寫程式碼。今天的目標不是訓練你寫一個短網址服務，而是訓練你把一個已經存在的產品正確部署到 Kubernetes。
>
> 這個產品叫短網址服務。使用者在網頁輸入一個長網址，系統會產生一個短網址，例如 `short.local/r/abc123`。之後有人打這個短網址，API 會去資料庫查原始網址，然後做 redirect。
>
> 我選這個題目有三個原因。第一，它像真的產品，最後可以打開網頁、建立短網址、點短網址跳轉。第二，它比任務排程系統更適合 2 小時內完成，因為沒有 queue、worker、cron 這些額外負擔。第三，它還是能把我們前面學過的大部分核心元件都串起來。
>
> 你先不要急著看 YAML，先看架構，只回答三個問題。
>
> 第一個問題，誰是入口？答案是 Ingress 加 Frontend。  
> 第二個問題，誰處理邏輯？答案是 API。  
> 第三個問題，資料放哪裡？答案是 PostgreSQL 加 PVC。
>
> 所以今天你不是在背一套 manifest，而是在練習怎麼把一個產品拆成入口、邏輯、資料三層，再用對應的 Kubernetes 元件把它組起來。

### Image 準備口條

> 在我們開始 apply YAML 之前，先補一個很實務、也很容易卡住的環節：image 要先準備好。
>
> Kubernetes 的 YAML 會寫要跑哪個 image，但是 YAML 本身不會幫你 build image，也不保證現場一定能從 Docker Hub 拉得到 image。
>
> 前幾堂課你們可能遇過，全班同時從 Docker Hub 拉 image，結果有人卡在 rate limit。這不是 YAML 寫錯，而是外部 registry 限流。
>
> 所以這個短網址 Lab 的預設流程不是現場 pull Docker Hub，而是講師先提供完整的 `url-shortener-k3s-images.tar`。你們要做的是：下載 tar、匯入每台 k3s node、檢查 image 都在，然後才開始 `kubectl apply`。
>
> 下載連結會放在講義裡，目前是 `https://drive.google.com/file/d/1LAvKkpENmTtQjvxxrivgoHDbuJWzcJH-/view?usp=drive_link`。比較穩的上課做法是：先用 Windows 瀏覽器下載 tar，再用 Windows PowerShell 的 `scp` 把檔案傳進 control plane VM。這樣學生不用在 Linux 終端機處理 Google Drive 的登入或下載確認頁。
>
> `scp` 要在哪裡下？答案是：在 tar 檔所在的那台機器。學生用 Windows 下載 tar，所以 `scp` 就在 Windows PowerShell 下。
>
> 建議不要把遠端目標寫成資料夾，直接指定完整遠端檔名，現場最穩：
>
> ```powershell
> ssh user@<control-plane-ip> "mkdir -p ~/Downloads"
> scp "$env:USERPROFILE\Downloads\url-shortener-k3s-images.tar" user@<control-plane-ip>:~/Downloads/url-shortener-k3s-images.tar
> ```
>
> 右邊的 `user`、`<control-plane-ip>`、`~/Downloads/` 要換成自己的 Linux VM 帳號與 IP。第一行是先確保 VM 裡有 Downloads 目錄。第二行 scp 要指定到完整檔名。如果學生看到 `scp: /home/user/Downloads/: Is a directory`，通常就改用這種「完整遠端檔名」寫法，不要只丟到資料夾。不要直接照抄 `control-plane` 這種 hostname，除非你已經在 Windows 或 DNS/hosts 裡設定過它。
>
> 如果 Linux VM 可以連外，也可以用 `gdown` 直接下載：`python3 -m gdown --id 1LAvKkpENmTtQjvxxrivgoHDbuJWzcJH- -O ~/Downloads/url-shortener-k3s-images.tar`。但這條路徑需要 VM 有 Python/pip 和網路，所以建議當備援，不當主要流程。
>
> 以 Windows + VMware 的上課環境來說，你會有一台 control plane 和至少一台 worker node。image tar 要透過 SSH 傳到每台 Linux VM，然後在每台 VM 執行 `sudo k3s ctr images import`。
>
> 等一下你會看到一個環境變數叫 `K3S_NODES`。它不是 Kubernetes 指令，而是我們提供給腳本看的清單，意思是「這些 node 都要匯入 image」。
>
> 例如 `K3S_NODES="user@<control-plane-ip> user@<worker-ip>"`，代表腳本會用 `user` 這個帳號 SSH 到 control plane 和 worker 兩台 VM。`<control-plane-ip>` / `<worker-ip>` 要換成自己 VM 的 IP，帳號也要換成自己真的可以 SSH 進去的 Linux 帳號。
>
> 如果你的帳號是 `ubuntu`，就要寫 `ubuntu@<control-plane-ip>` 或 `ubuntu@<worker-ip>`，不是照抄 `user@...`。如果有兩台 worker，就要把兩台 worker 都放進 `K3S_NODES`。重點不是名字叫什麼，重點是每一台可能跑 Pod 的 node 都要出現在這份清單裡。
>
> 如果學生在 checking 階段看到 `sudo: a password is required`，不要先判斷成密碼輸入錯。這裡的腳本用的是 `sudo -n`，`-n` 代表 non-interactive，所以它不會停下來收密碼。學生要在每台 VM 先確認 `sudo -n k3s ctr images list -q` 能直接執行。
>
> 若不能執行，就在每台 control plane / worker VM 設定 lab 使用者可以免密碼執行 k3s。先跑 `command -v k3s` 確認路徑，通常會是 `/usr/local/bin/k3s`。再用 `sudo visudo -f /etc/sudoers.d/k3s-lab-user` 加入：`user ALL=(ALL) NOPASSWD: /usr/local/bin/k3s`。帳號不是 `user` 就換成學生自己的 Linux 帳號；k3s 路徑不同就換成實際路徑。存檔後跑 `sudo chmod 440 /etc/sudoers.d/k3s-lab-user`，再重測 `sudo -n k3s ctr images list -q`。
>
> 這裡有一個很重要的觀念：k3s 跑 Pod 用的是每台 Linux node 裡的 containerd。不是下載到你的 Windows、你的 WSL，或你的操作機就好，而是要把 tar 匯入每台 node。
>
> 可以直接記這句話：Pod 被排到哪台 node，那台 node 就必須已經有 image。
>
> 這份 tar 裡面會包含四個 image：API、Frontend、PostgreSQL、BusyBox。只準備 API 和 Frontend 不夠，因為 PostgreSQL StatefulSet 需要 `postgres:15`，migration init container 需要 `busybox:1.36`。
>
> 如果沒有匯入，YAML 寫 `imagePullPolicy: Never` 時會看到 `ErrImageNeverPull`；如果改用 public image，則可能看到 `ImagePullBackOff`。兩個錯誤都跟 image 準備有關。
>
> 所以我們今天的順序是：先完成 image 準備和檢查，再開始 apply YAML。Helm 一鍵部署也是一樣，Helm 只部署 Kubernetes resources，不會幫你把 image 放進 node。

### 這一段學生要帶走的話

- 今天不是寫 app，是部署 app。
- 先分清楚入口、邏輯、資料，再談 K8s 元件。
- 先把 image 放進每台 node，Pod 才能在任何 node 上啟動。

---

## 7-12 手動部署流程（講師逐字稿）

### 這一段要講清楚什麼？

- 不要把手動部署講成照表操課。
- 每一份 YAML 都是在回答一個部署問題。
- 每一份 YAML 都要拆出「建了什麼物件、物件做什麼、對應哪個 K8s 觀念」。
- 開始 apply 前，要先確認 7-11 的 image 檢查已經通過。
- 學生要知道為什麼先手動，再談 Helm。

### 講法主軸

你可以先把整段濃縮成一句：

> 這 9 份 YAML，不是 9 個步驟，而是 9 個部署問題。

### 建議口條

> 接下來我們一步一步 apply，但你不要把它看成「照順序跑 9 個指令」。
>
> 你要把它看成：部署一個產品時，有哪些問題一定要先回答。
>
> `00 Namespace` 在回答：這個產品放在哪個隔離空間？  
> `01 Secret` 在回答：敏感資訊放哪裡？  
> `02 ConfigMap` 在回答：非敏感設定放哪裡？  
> `03 PostgreSQL` 在回答：資料要不要保留？如果要，就不能只是普通 Deployment。  
> `04 Migration Job` 在回答：資料表誰來建立？不是講師手動進 DB 建 table，而是交給一次性的 Job。  
> `05 API` 在回答：誰負責建立短網址與 redirect？這是一個無狀態邏輯層，所以用 Deployment。  
> `06 Frontend` 在回答：誰提供操作介面？  
> `07 HPA` 在回答：流量變大怎麼辦？  
> `08 Ingress` 在回答：使用者怎麼進產品？
>
> 你會發現，這些不是短網址服務才有的問題，而是幾乎所有產品部署到 K8s 上都要回答的問題。
>
> 所以手動部署的目的，不是讓你學會背 9 份 YAML。手動部署的目的，是讓你第一次把這些問題完整走過一次。

### 每份 YAML 的講解口條

#### `00-namespace.yaml`

> 第一份是 Namespace。這份 YAML 很短，但它是整套產品的外框。
>
> `kind: Namespace` 代表我們建立一個新的隔離空間，名字叫 `url-shortener`。後面 Secret、ConfigMap、PostgreSQL、API、Frontend、HPA、Ingress 都會放在這個 namespace。
>
> 所以這裡複習的是 Namespace：它不是資料夾，它是資源管理、權限範圍、查詢範圍的邊界。

#### `01-secret.yaml`

> 第二份是 Secret。這裡建立 `url-shortener-secrets`，目前只有一個 key：`postgres-password`。
>
> 等一下 PostgreSQL 啟動時會用它設定 DB 密碼，API 和 migration 連 DB 時也會從這裡拿密碼。
>
> 這裡複習的是 Secret：敏感資訊不要寫在 ConfigMap，也不要硬編碼在程式裡。課堂上用 placeholder 是為了讓 lab 能跑，正式環境要改成安全的注入流程。

#### `02-configmap.yaml`

> 第三份是 ConfigMap。這裡放的是非敏感設定：`POSTGRES_HOST`、`POSTGRES_PORT`、`POSTGRES_DB`、`POSTGRES_USER`。
>
> 注意 `POSTGRES_HOST` 是 `postgres-service`，不是 IP。這裡順便複習 K8s Service DNS：Pod IP 會變，但 Service 名稱穩定，所以程式應該連 Service，不是連 Pod IP。
>
> 這裡的判斷很簡單：洩漏出去會出事的放 Secret；只是環境設定的放 ConfigMap。

#### `03-postgres.yaml`

> 第四份是 PostgreSQL，這份最適合當 StatefulSet 複習。
>
> 它其實建了兩個主要東西。第一個是 `postgres-service`，而且 `clusterIP: None`，這是 headless Service。第二個是 `postgres` StatefulSet。
>
> 為什麼不是 Deployment？因為資料庫需要穩定身份和持久化儲存。Deployment 的 Pod 可以任意替換，適合無狀態服務；StatefulSet 會建立穩定名稱，例如 `postgres-0`，並且透過 `volumeClaimTemplates` 幫它建立 PVC。
>
> 請特別看三個欄位。`serviceName: postgres-service` 讓 StatefulSet 搭配 headless Service。`volumeMounts` 把 PVC 掛到 `/var/lib/postgresql/data`。`readinessProbe` 用 `pg_isready` 確認 DB 是否真的可用。
>
> 這裡上課要用 local 版 `03-postgres.yaml`。原因是 `postgres:15` 也在講師提供的 image tar 裡，local YAML 會設定 `imagePullPolicy: Never`。這代表 PostgreSQL 也不會去 Docker Hub 拉 image，而是使用每台 node 已經匯入的本地 image。
>
> 這裡複習的是：有狀態服務、穩定名稱、PVC、readinessProbe。

#### `04-migrate-job.yaml`

> 第五份是 migration Job。這份 YAML 告訴學生，建資料表也應該被 Kubernetes 管理，而不是講師手動進 DB 做。
>
> `kind: Job` 代表這是一個跑完就結束的任務。`initContainers` 先用 busybox 等 `postgres-service:5432` 可以連線，避免 DB 還沒起來就跑 migration。真正的 container 用 `url-shortener-api` image 執行 `node migrate.js`。
>
> `restartPolicy: OnFailure` 和 `backoffLimit: 3` 代表失敗會重試，但不會無限重跑。
>
> local YAML 會用 `busybox:1.36`、`url-shortener-api:lab` 和 `imagePullPolicy: Never`，意思是不要去 Docker Hub 拉，直接使用 k3s node 裡已經匯入的 image。
>
> 這裡複習的是：Job、init container、啟動順序、失敗重試。

#### `05-api.yaml`

> 第六份是 API，這份最適合複習 Deployment、Service、probe、resources。
>
> 它建了兩個物件：`url-api` Deployment 和 `url-api-service` Service。Deployment 負責跑 API Pod，Service 負責提供穩定入口給 Ingress。
>
> API 是無狀態服務，所以用 Deployment。`replicas: 2` 代表先跑兩份。Pod 掛掉時 Deployment 會補回。
>
> 設定的部分，非敏感資料從 ConfigMap 進來，DB password 從 Secret 進來。這裡可以提醒學生，Secret 不要整包 envFrom，最好只把需要的 key 注入。
>
> `resources.requests.cpu` 很重要，因為 HPA 需要它才能算 CPU 使用率百分比。`livenessProbe` 看 `/health`，`readinessProbe` 看 `/ready`，兩者不是同一件事。
>
> 這份 local YAML 會用 `url-shortener-api:lab`。所以在 apply 之前，學生必須已經把 API image 匯入所有 k3s node。
>
> 這裡複習的是：Deployment、Service、Secret/ConfigMap 注入、resources、livenessProbe、readinessProbe。

#### `06-frontend.yaml`

> 第七份是 Frontend。它也是 Deployment 加 Service，但比 API 單純。
>
> Frontend 是靜態網站，不需要 DB password，也不需要連 PostgreSQL。它只需要跑 nginx 或靜態頁面，然後用 Service 提供穩定入口，讓 Ingress 可以把 `/` 導過來。
>
> 這裡可以讓學生比較：API 和 Frontend 都是無狀態，所以都用 Deployment；但 API 有 DB 依賴、probe、更多 resources，Frontend 則比較單純。
>
> local YAML 會用 `url-shortener-frontend:lab`，同樣需要先匯入 k3s node。

#### `07-hpa.yaml`

> 第八份是 HPA。它不是部署新的 app，而是建立一個擴縮規則。
>
> `scaleTargetRef` 指向 `url-api` Deployment，代表 HPA 擴的是 API，不是 DB，也不是 Frontend。`minReplicas: 2`、`maxReplicas: 6` 是邊界，`averageUtilization: 70` 是 CPU 目標。
>
> 這裡要提醒學生：HPA 不是只 apply 一份 YAML 就會動。它需要 metrics-server，也需要目標 Pod 設定 CPU requests。

#### `08-ingress.yaml`

> 第九份是 Ingress。這是使用者真正進入產品的入口。
>
> `host: short.local` 代表使用者用 domain 進來。`/api`、`/r`、`/health`、`/ready` 都導到 `url-api-service`，`/` 導到 `url-frontend-service`。
>
> 這裡可以讓學生看到真實產品常見的模式：同一個 domain，依 path 分流到不同 Service。使用者不需要知道後面有幾個 Pod、Pod IP 是什麼、API 在哪個 port。
>
> 這裡複習的是：Ingress、host/path routing、Service 作為穩定 backend。

### 各步驟帶學生時可用的短句

- Namespace：先隔離，再部署。
- Secret / ConfigMap：先分敏感與非敏感，再談注入。
- PostgreSQL：資料會留，所以要 StatefulSet + PVC。
- Migration Job：建立 schema 也是一個要被管理的工作。
- API：無狀態邏輯層，用 Deployment。
- Frontend：讓產品可視化，不只是 API 存在而已。
- HPA：先有 requests，才有擴縮。
- Ingress：使用者應該看到 domain，不是 Pod IP。
- Helm：把這些 YAML template 化，不是另一套部署概念。

### 這一段學生要帶走的話

- 每一份 manifest 都是在回答一個部署問題。
- 先手動做一次，後面講 Helm 才有意義。
- 一鍵部署的前提，是你知道那一鍵背後做了哪些事。

---

## 7-13 驗收清單（講師逐字稿）

### 這一段要講清楚什麼？

- 驗收不能只看 Pod Running。
- 要分成產品驗收、K8s 驗收、故障驗收。
- 學生要知道「能用」和「可運行」不是同一件事。

### 建議口條

> 很多人部署完之後，看到 `kubectl get pods` 全部都是 Running，就覺得結束了。
>
> 但那不夠。真正的驗收至少有三層。
>
> 第一層是產品驗收。網站打不打得開？能不能建立短網址？點短網址會不會真的 redirect？  
> 第二層是 K8s 驗收。Deployment、StatefulSet、PVC、Service、Ingress、HPA 這些物件是不是都在，而且狀態正確？  
> 第三層是故障驗收。今天如果我把 API Pod 砍掉，Deployment 會不會自動補回？如果我把 `postgres-0` 砍掉，StatefulSet 會不會重建，而且資料還在？
>
> 所以驗收不是只在驗功能，也是在驗平台能力。
>
> 你可以記兩句話。  
> 如果只能用、不能恢復，不算部署完成。  
> 如果能恢復、但資料會丟，也不算部署完成。

### Windows + VMware 的驗收教學流程

> 這裡要特別停下來講，因為今天學員是在 Windows 上用 VMware 開 Linux VM。
> 如果你要用 Windows 的瀏覽器打開 `http://short.local`，那 `short.local` 的 hosts 設定要加在 Windows，不是只加在 Linux VM。

#### Step 1：先在 Linux VM 找到要指向哪個 IP

> 第一個問題是：`short.local` 要指到哪裡？
>
> Ingress 是跑在 k3s 裡，外面真正連進來的是 node 的 IP。所以我們先看 Ingress：

```bash
kubectl get ingress -n url-shortener
```

> 如果 `ADDRESS` 有出現 IP，就先用那個 IP。
> 如果 `ADDRESS` 還沒出現，或現場環境顯示不穩定，就先用 control plane VM 的 IP。
> 在 Linux VM 裡可以用這個方式看 IP：

```bash
ip addr
hostname -I
```

> 這裡要提醒學生：`<NODE-IP>` 不是 Pod IP，也不是 Service ClusterIP。它是 Windows 能連到的 Linux VM IP。

#### Step 2：在 Windows 加 hosts

> 接著回到 Windows。因為瀏覽器跑在 Windows，所以 hosts 要寫在 Windows。
> 用系統管理員權限開 PowerShell，執行：

```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" `
  -Value "<NODE-IP> short.local"
```

> 例如你的 control plane VM IP 是 `192.168.56.10`，就寫：

```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" `
  -Value "192.168.56.10 short.local"
```

> 然後確認 hosts 裡真的有這一行：

```powershell
Get-Content "C:\Windows\System32\drivers\etc\hosts" |
  Select-String "short.local"
```

#### Step 3：先驗網路，再開瀏覽器

> 不要一開始就開瀏覽器。先在 Windows PowerShell 做兩個確認：

```powershell
ping short.local
Test-NetConnection short.local -Port 80
```

> `ping` 是確認 `short.local` 有沒有解析到 VM IP。
> `Test-NetConnection` 是確認 Windows 能不能連到 VM 的 80 port。
> 如果這兩個都不通，就不是 Kubernetes YAML 的問題，通常是 Windows hosts、VMware 網路模式、防火牆或 VM IP 寫錯。

#### Step 4：再做產品驗收

> 前面都通了，才開 Windows 瀏覽器：

```text
http://short.local
```

> 接著輸入 `https://kubernetes.io/`，建立短網址，再點 `http://short.local/r/<code>`。
> 如果瀏覽器真的跳到 Kubernetes 官方網站，代表 Windows 到 VM、Ingress、Frontend、API、PostgreSQL 這條路都通了。

#### Step 5：如果打不開，照順序排查

> 現場不要一看到打不開就重新 apply。照這個順序查：

1. Windows hosts 是否有 `<NODE-IP> short.local`。
2. `ping short.local` 是否解析到正確 VM IP。
3. `Test-NetConnection short.local -Port 80` 是否成功。
4. Linux VM 裡 `kubectl get ingress -n url-shortener` 是否有 Ingress。
5. `kubectl get pods -n url-shortener` 是否都 Ready。
6. `kubectl logs deploy/url-api -n url-shortener` 是否有 API 錯誤。

> 這樣學生會知道：瀏覽器打不開不一定是 Pod 壞掉，也可能只是 Windows 不知道 `short.local` 要去哪裡。

### 驗收時建議帶學生說出的重點

- `kubectl get all -n url-shortener`：驗證主要工作負載都在。
- `kubectl get pvc -n url-shortener`：驗證資料不是 ephemeral。
- `kubectl get hpa -n url-shortener`：驗證擴縮不是口頭上說說。
- 刪 API Pod：驗證自我修復。
- 刪 DB Pod：驗證狀態型工作負載的儲存持久化。

### 這一段學生要帶走的話

- 驗收有三層：產品、平台、故障。
- Running 不等於完成。

---

## 7-14 Helm 收尾（講師逐字稿）

### 這一段要講清楚什麼？

- 為什麼前面要手動做一次。
- 為什麼實務上又會用 Helm。
- Helm 不是取代 K8s，而是封裝 K8s。
- 示範 Helm 前，要先清掉剛才手動建立的同名資源。

### 建議口條

> 最後收在 Helm。
>
> 你可能會問，既然最後可以 `helm install` 一個指令完成，前面為什麼還要手動 apply？
>
> 因為兩件事目的不同。
>
> 前面手動做，是為了讓你真的知道一個產品拆開來有哪些 K8s 元件，每個元件各自負責什麼。  
> Helm 則是把這些元件打包起來，變成一個可以重複部署、可以調參、可以升級、可以回滾的產品。
>
> 但是在示範 Helm 前，我們要先清理剛剛手動部署出來的資源。原因很實際：剛才手動 `kubectl apply` 已經建立了同名的 Secret、ConfigMap、Service、Deployment、Ingress。如果現在直接 `helm install`，Helm 會撞到既有資源。
>
> 所以這裡不是因為剛剛做錯才清掉，而是要把環境重置，讓 Helm 從零交付同一套產品。
>
> 先執行：
>
> ```bash
> kubectl delete namespace url-shortener
> kubectl wait --for=delete namespace/url-shortener --timeout=180s
> ```
>
> wait 完成後，再執行 Helm。
>
> 這裡也要提醒學生：刪 namespace 會刪掉剛剛 PostgreSQL PVC 裡的測試資料；但不會刪掉已經 import 到每台 k3s node 的 images。所以 `values-local.yaml` 仍然可以用 `url-shortener-api:lab`、`url-shortener-frontend:lab`，不需要重新去 Docker Hub pull。
>
> 所以 Helm 不是取代 Kubernetes，也不是把前面學的東西全部省略掉。相反地，你要先懂前面的東西，才知道 Helm 幫你包了什麼。
>
> 你可以直接把剛剛的手動 YAML 對到 Helm template：Secret 對 `templates/secret.yaml`，ConfigMap 對 `templates/configmap.yaml`，PostgreSQL 對 `templates/postgres.yaml`，migration 對 `templates/migrate-job.yaml`，API 對 `templates/api.yaml`，Frontend 對 `templates/frontend.yaml`，HPA 對 `templates/hpa.yaml`，Ingress 對 `templates/ingress.yaml`。
>
> 換句話說，Helm 不是做了另一件事。它只是把剛剛那些固定 YAML 變成可以調參的 template。
>
> 但 Helm 不會幫你 build image，也不會幫你把 image 匯入 k3s node。一鍵部署前，image 還是要先準備好。`values-local.yaml` 只是告訴 Helm：請使用 `url-shortener-api:lab`、`url-shortener-frontend:lab`，而且 `pullPolicy` 用 `Never`。
>
> 接著你可以帶學生看 values。  
> `image.tag` 控制版本。  
> `replicaCount` 控制副本數。  
> `resources` 控制 requests 和 limits。  
> `hpa.maxReplicas` 控制擴縮上限。  
> `ingress.host` 控制網域。  
> `postgres.storageSize` 控制資料庫磁碟大小。
>
> 最後請學生記這句話：  
> Kubernetes 教你的是系統怎麼組成；Helm 教你的是怎麼把這套系統變成可以重複交付的產品。

### 這一段學生要帶走的話

- 手動部署是理解結構。
- Helm 是交付結構。
- 一鍵部署背後仍然是 Namespace、Secret、ConfigMap、StatefulSet、Job、Deployment、Service、HPA、Ingress。

---

## 講師速查版

### 7-11

- 先講產品，不先講 YAML
- 先回答入口 / 邏輯 / 資料三個問題
- 強調學生不用寫程式碼

### 7-12

- 9 份 YAML = 9 個部署問題
- 每份 YAML 都要講：物件、欄位、責任、對應觀念
- 每一步都要講「為什麼是這個元件」
- 不要把流程講成背指令

### 7-13

- 驗收分三層：產品 / K8s / 故障
- 直接講兩句收尾：
  - 只能用、不能恢復，不算完成
  - 能恢復、但資料會丟，也不算完成

### 7-14

- 先回答「為什麼前面手動，現在又 Helm」
- 先清掉手動部署的 namespace，避免 Helm 撞同名資源
- Helm 是封裝，不是取代
- 手動 YAML 要能對到 Helm templates
- 帶學生看 values 對應到真實部署決定
