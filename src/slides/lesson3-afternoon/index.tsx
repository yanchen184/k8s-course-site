import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  image?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  {
    title: "容器資料管理",
    subtitle: "Day 3 下午場 · 13:00–17:00",
    section: "下午開場",
    content: (
      <div className="space-y-6">
        <p className="text-2xl text-center text-slate-300 font-light">
          從 Volume 到 Dockerfile，掌握容器的精髓！
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
            <p className="text-k8s-blue font-semibold mb-3">📋 下午課程大綱</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>① Volume 深入管理</li>
              <li>② Dockerfile 撰寫</li>
              <li>③ 建構自訂 Image</li>
              <li>④ Image 最佳化技巧</li>
              <li>⑤ Docker Compose 多容器</li>
              <li>⑥ 課程總結與明日預告</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
            <p className="text-green-400 font-semibold mb-3">🎯 下午學習目標</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>能管理 Named Volume 持久化資料</li>
              <li>能撰寫完整的 Dockerfile</li>
              <li>能建構並最佳化自訂 Image</li>
              <li>能使用 Compose 管理多容器</li>
              <li>為明日 Kubernetes 做準備</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-400 text-sm">
          ⏱️ 13:00–17:00（含 15 分鐘休息）
        </div>
      </div>
    ),
    notes: `午安大家！歡迎回到下午的課程。希望大家午飯吃得不錯，精神也恢復了。下午的課程是今天最精彩的部分，我們要學的是 Docker 的核心技能：如何建立自己的容器映像檔，以及如何管理多個容器的協作。

讓我先說一下今天下午的重要性。上午我們學了如何使用別人已經做好的 Image（nginx、mysql 等），這很有用，但在實際工作中，你的應用程式需要打包成自己的 Image，才能部署到任何地方。下午的 Dockerfile 課程就是讓你學會如何做到這件事。

然後是 Docker Compose，這是管理多容器應用程式的利器。想像你有一個 Web 應用程式，需要 nginx、Node.js 後端、MySQL 資料庫三個服務，每次都要手動一個個啟動、設定網路、掛載 Volume，非常麻煩。Compose 讓你用一個 YAML 檔案描述所有的服務，一個指令就能啟動整套環境。

這些技能是從 Docker 進化到 Kubernetes 的關鍵中間步驟。在 Kubernetes 裡面，你部署的每一個服務都需要對應的 Container Image，而建立 Image 的方式就是 Dockerfile。所以今天下午的課程，是明天 Kubernetes 課程的重要基礎。

好，我們先從 Volume 的深入學習開始，然後進入 Dockerfile，最後是 Docker Compose 的實作。讓我們開始吧！`,
    duration: "5"
  },
  {
    title: "Named Volume 深入",
    subtitle: "Docker 管理的持久化儲存——生產環境首選",
    section: "Volume 深入",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">建立與查看 Volume</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker volume create mydata</p>
              <p>docker volume ls</p>
              <p>docker volume inspect mydata</p>
              <p>docker volume prune</p>
              <p>docker volume rm mydata</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">使用 Named Volume</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker run -d \</p>
              <p>  --name db \</p>
              <p>  -v mydata:/var/lib/mysql \</p>
              <p>  -e MYSQL_ROOT_PASSWORD=secret \</p>
              <p>  mysql:8</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">docker volume inspect 輸出</p>
          <div className="font-mono text-xs text-slate-300">
            <p>{"{"}</p>
            <p>  <span className="text-green-400">"Name"</span>: "mydata",</p>
            <p>  <span className="text-green-400">"Driver"</span>: "local",</p>
            <p>  <span className="text-green-400">"Mountpoint"</span>: "/var/lib/docker/volumes/mydata/_data",</p>
            <p>  <span className="text-green-400">"Labels"</span>: {"{}"}</p>
            <p>{"}"}</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們現在深入學習 Named Volume（命名卷）。上午我們簡單介紹了 Volume 的三種類型，下午我們要把 Named Volume 的操作學得更完整，因為這是生產環境最常用的持久化方式。

首先，什麼是 Named Volume？Named Volume 就是由 Docker 統一管理的儲存空間，你給它取一個名字（比如 mydata、mysql-data、app-logs），Docker 會在主機的 /var/lib/docker/volumes/ 目錄下（Linux）建立一個對應的子目錄來存放資料。跟 Bind Mount 的差別是，Named Volume 的實際存放位置由 Docker 決定，你不需要指定主機路徑；而且 Named Volume 的管理是跨平台的，在不同的主機上行為一致。

docker volume create 可以預先建立一個 Volume。不過你也不一定要預先建立，當你在 docker run 時指定 -v 卷名:/容器路徑，如果這個 Volume 不存在，Docker 會自動幫你建立。但有時候預先建立可以確保你的 Volume 是按照你的預期建立的，特別是當你要指定特殊的 driver 或 options 的時候。

docker volume ls 列出所有的 Volume，docker volume inspect 查看某個 Volume 的詳細資訊，包含它實際存放在主機的哪個路徑（Mountpoint）。在 Linux 上，你可以直接訪問這個路徑來查看或修改 Volume 裡面的資料，但要注意這可能需要 root 權限。

docker volume rm 刪除一個 Volume，但如果有容器還在使用這個 Volume（不管容器是在執行還是已停止），是無法刪除的。docker volume prune 清除所有沒有被任何容器使用的 Volume，在清理環境的時候很有用，但一定要確認這些 Volume 裡面沒有你需要的資料！這個指令是不可逆的，Volume 刪除之後資料就永遠消失了。

在使用 Named Volume 的時候，有一個很好的慣例：Volume 的命名要有意義，能一眼看出它是哪個服務的資料。比如 mysql-prod-data、nginx-logs、app-uploads 這樣的命名比 data1、vol2 要好得多，在管理大量 Volume 的時候會感謝自己當初命名有意義。`,
    duration: "10"
  },
  {
    title: "MySQL 資料持久化實作",
    subtitle: "Volume 讓資料庫容器不再「失憶」",
    section: "Volume 深入",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm mb-2">完整持久化配置</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p className="text-slate-400"># 建立專屬 Volume</p>
            <p>docker volume create mysql-prod-data</p>
            <p className="text-slate-400 mt-2"># 啟動 MySQL，掛載 Volume</p>
            <p>docker run -d \</p>
            <p>  --name mysql-prod \</p>
            <p>  --network webapp-net \</p>
            <p>  -v mysql-prod-data:/var/lib/mysql \</p>
            <p>  --env-file ./mysql.env \</p>
            <p>  --memory 1g \</p>
            <p>  --restart unless-stopped \</p>
            <p>  mysql:8</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm mb-2">驗證持久化</p>
            <div className="font-mono text-xs text-green-400 space-y-1">
              <p>docker exec -it mysql-prod \</p>
              <p>  mysql -uroot -p -e \</p>
              <p>  "CREATE DATABASE testdb;"</p>
              <p className="text-slate-400">## 刪除容器</p>
              <p>docker rm -f mysql-prod</p>
              <p className="text-slate-400">## 重新建立</p>
              <p>docker run -d --name mysql-prod \</p>
              <p>  -v mysql-prod-data:/var/lib/mysql ...</p>
              <p className="text-slate-400">## testdb 還在！</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm mb-2">Volume 備份</p>
            <div className="font-mono text-xs text-green-400 space-y-1">
              <p className="text-slate-400"># tar 備份</p>
              <p>docker run --rm \</p>
              <p>  -v mysql-prod-data:/data \</p>
              <p>  -v $(pwd):/backup \</p>
              <p>  alpine \</p>
              <p>  tar czf /backup/mysql-backup.tar.gz \</p>
              <p>  -C /data .</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們來做一個 MySQL 持久化的完整實作。這個場景非常真實：你在一個 MySQL 容器裡面存了很多資料，然後需要更新 MySQL 版本（或者容器因故重建），你希望這些資料能夠被保留下來。

首先建立一個 Named Volume 叫做 mysql-prod-data，然後啟動 MySQL 容器，把這個 Volume 掛載到容器的 /var/lib/mysql（這是 MySQL 存放資料庫資料的目錄）。

現在讓我們驗證持久化是否成功：進入容器執行 MySQL 指令建立一個測試資料庫 testdb。然後強制刪除這個容器（docker rm -f），Volume 裡面的資料還在。接著用同樣的設定重新建立容器（特別是同樣的 -v mysql-prod-data:/var/lib/mysql），進去查看，testdb 還在！這就是 Volume 的威力。

容器可以隨意刪除重建，只要 Volume 不刪除，資料就永遠都在。這讓你可以放心地更新應用程式版本，不用擔心資料丟失。

最後要說一下 Volume 的備份方式。一個常用的技巧是利用一個臨時容器來做備份：啟動一個 alpine 容器，同時掛載你要備份的 Volume（/data）和你想存放備份的主機目錄（/backup），然後用 tar 把 /data 的所有內容打包成一個 tar.gz 檔案存到 /backup。這樣做的好處是不需要停止 MySQL 容器就可以備份，因為是在另一個容器裡面做的。不過對於生產環境的資料庫，建議使用 mysqldump 做一致性備份，而不是直接備份資料目錄，避免備份到處於不一致狀態的資料。還原的時候就是反向操作，把 tar 解壓縮到 Volume 目錄裡面。大家理解了嗎？`,
    duration: "10"
  },
  {
    title: "Volume 備份、還原與最佳實踐",
    subtitle: "資料的生命週期管理",
    section: "Volume 深入",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">mysqldump 備份（推薦）</p>
            <div className="font-mono text-xs text-green-400 space-y-1">
              <p>docker exec mysql-prod \</p>
              <p>  mysqldump \</p>
              <p>  -uroot -psecret \</p>
              <p>  --all-databases \</p>
              <p>  {">"} backup_$(date +%Y%m%d).sql</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">還原資料</p>
            <div className="font-mono text-xs text-green-400 space-y-1">
              <p>docker exec -i mysql-prod \</p>
              <p>  mysql -uroot -psecret \</p>
              <p>  {"<"} backup_20240115.sql</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">Volume 最佳實踐清單</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="space-y-1">
              <p className="text-green-400">✅ 為每個服務建立獨立 Volume</p>
              <p className="text-green-400">✅ Volume 命名要有意義</p>
              <p className="text-green-400">✅ 定期備份重要資料</p>
              <p className="text-green-400">✅ 測試還原流程</p>
            </div>
            <div className="space-y-1">
              <p className="text-red-400">❌ 不要把程式碼放在 Volume</p>
              <p className="text-red-400">❌ 不要刪除有資料的 Volume</p>
              <p className="text-red-400">❌ 不要只依賴容器層存重要資料</p>
              <p className="text-red-400">❌ 不要忽略 volume prune 的風險</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我們繼續談 Volume 的最佳實踐和備份策略，因為在生產環境中，資料的安全性非常重要。

關於備份，我剛才提到了 tar 備份的方式，但對於資料庫，我更推薦使用 mysqldump 這個工具。mysqldump 是 MySQL 官方提供的備份工具，它會生成一個 SQL 腳本，包含建立資料庫結構和插入所有資料的 SQL 指令。這種備份方式的優點是：備份的是邏輯資料而不是物理檔案，因此即使 MySQL 版本不同，也可以還原；備份文件是純文字的 SQL，方便閱讀和驗證；可以選擇備份特定的資料庫或表。

docker exec -i 是在執行互動式指令時常用的技巧。-i 代表 interactive（互動式），允許透過標準輸入向容器發送資料。還原資料時，用 {"<"} 把 SQL 檔案的內容發送給 mysql 指令，就能執行裡面的所有 SQL 語句來還原資料。

現在讓我總結一些 Volume 的最佳實踐：第一，為每個服務建立獨立的 Volume，不要讓多個不相關的服務共用同一個 Volume，這樣在管理和備份的時候會更清晰。第二，Volume 的命名要有意義，讓你或你的同事一眼就知道這個 Volume 是哪個服務用的。第三，定期備份，並且定期測試還原流程——很多人備份了但從來不測試還原，結果在真正需要還原的時候發現備份是壞的。第四，永遠不要把應用程式的程式碼放在 Volume 裡面，程式碼應該打包在 Image 裡面。第五，執行 docker volume prune 之前一定要三思，這個指令會刪除所有「未被使用」的 Volume，如果某個容器停止了但 Volume 還有重要資料，也會被清除。要養成在執行 prune 之前先 docker volume ls 確認的習慣。`,
    duration: "10"
  },
  {
    title: "Dockerfile 是什麼？",
    subtitle: "Infrastructure as Code——把環境變成程式碼",
    section: "Dockerfile 撰寫",
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-blue-900/40 border border-blue-700 p-4 rounded-lg">
              <p className="text-k8s-blue font-bold mb-2">Dockerfile 是什麼？</p>
              <p className="text-slate-300 text-sm">
                一個文字檔案，包含一系列指令，告訴 Docker 如何建構一個 Image。
                就像「自動化的食譜」，從基底開始，一步一步加料。
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-yellow-400 font-semibold mb-2">為什麼需要自訂 Image？</p>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• 把應用程式和環境打包在一起</li>
                <li>• 確保「我的電腦可以跑」= 任何地方都能跑</li>
                <li>• 版本控制你的執行環境</li>
                <li>• CI/CD 自動化部署</li>
              </ul>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">最簡單的 Dockerfile</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-slate-400"># 從 Node.js 官方映像開始</p>
              <p className="text-yellow-400">FROM</p><span className="text-green-400"> node:18-alpine</span>
              <p className="text-slate-400"># 設定工作目錄</p>
              <p className="text-yellow-400">WORKDIR</p><span className="text-green-400"> /app</span>
              <p className="text-slate-400"># 複製並安裝依賴</p>
              <p className="text-yellow-400">COPY</p><span className="text-green-400"> package*.json ./</span>
              <p className="text-yellow-400">RUN</p><span className="text-green-400"> npm install</span>
              <p className="text-slate-400"># 複製應用程式碼</p>
              <p className="text-yellow-400">COPY</p><span className="text-green-400"> . .</span>
              <p className="text-slate-400"># 對外暴露埠號</p>
              <p className="text-yellow-400">EXPOSE</p><span className="text-green-400"> 3000</span>
              <p className="text-slate-400"># 啟動指令</p>
              <p className="text-yellow-400">CMD</p><span className="text-green-400"> ["node", "app.js"]</span>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們進入今天下午最重要的主題：Dockerfile。如果你只能從今天的課程帶走一個技能，那就應該是 Dockerfile。

Dockerfile 是一個純文字檔案，裡面包含了一系列的指令，告訴 Docker 要如何建構一個自訂的 Image。你可以把它想成是一個自動化的食譜：從一個基礎食材（基礎 Image）開始，一步一步加入配料（安裝軟體、複製程式碼、設定環境），最後得到你的成品（自訂 Image）。

為什麼我們需要自訂 Image？因為 Docker Hub 上面的官方 Image（nginx、mysql、node 等）都是通用的，沒有你的應用程式。你需要把你的程式碼、設定、依賴庫都打包進去，建立一個屬於你應用程式的 Image。

這個做法有個很大的好處，就是解決了「在我電腦上可以跑，但在別人電腦或伺服器上跑不了」這個問題。你知道這個問題嗎？大家有沒有遇過？（跟學員互動）對，幾乎每個開發者都遇過。原因通常是環境不一致：你的電腦上裝了 Node.js 18，但伺服器上是 Node.js 14；你裝了某個系統函式庫，但伺服器沒裝。Dockerfile 把你的執行環境也版本化了，確保在任何地方用這個 Image 跑出來的結果都是一致的。

另外，Dockerfile 可以被提交到 Git 進行版本控制。這意味著你可以追蹤環境的演進歷史，就像追蹤程式碼的歷史一樣。這就是所謂的 Infrastructure as Code（基礎設施即程式碼）的概念，這在現代 DevOps 實踐中非常重要。

好，讓我們來看一個最簡單的 Dockerfile 範例，這是一個 Node.js 應用程式的 Dockerfile。每一行都是一個指令，我會在接下來的幾張投影片裡面詳細解釋每個指令的含義和用法。`,
    duration: "10"
  },
  {
    title: "FROM 與 RUN 指令",
    subtitle: "選擇基礎映像，執行建構指令",
    section: "Dockerfile 撰寫",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-2">FROM — 基礎映像</p>
            <div className="font-mono text-sm space-y-2">
              <p className="text-green-400">FROM ubuntu:22.04</p>
              <p className="text-green-400">FROM node:18-alpine</p>
              <p className="text-green-400">FROM python:3.11-slim</p>
              <p className="text-green-400">FROM scratch</p>
            </div>
            <div className="mt-3 text-xs text-slate-400 space-y-1">
              <p>• 每個 Dockerfile 必須從 FROM 開始</p>
              <p>• 選擇最接近需求的基礎映像</p>
              <p>• alpine / slim 版本更輕量</p>
              <p>• scratch 是空的，用於靜態二進制</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold mb-2">RUN — 執行指令</p>
            <div className="font-mono text-sm space-y-1 text-slate-300">
              <p className="text-slate-400"># 每個 RUN 是一個新 Layer</p>
              <p className="text-red-400">RUN apt-get update</p>
              <p className="text-red-400">RUN apt-get install -y curl</p>
              <p className="text-slate-400 mt-2"># ✅ 合併減少 Layer</p>
              <p className="text-green-400">RUN apt-get update \</p>
              <p className="text-green-400">  {"&&"} apt-get install -y \</p>
              <p className="text-green-400">    curl \</p>
              <p className="text-green-400">    wget \</p>
              <p className="text-green-400">    vim \</p>
              <p className="text-green-400">  {"&&"} rm -rf /var/lib/apt/lists/*</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-sm">
          <span className="text-yellow-400 font-semibold">💡 RUN 最佳實踐：</span>
          <span className="text-slate-300"> 合併多個指令到單一 RUN，並在最後清理快取，減少 Image 大小</span>
        </div>
      </div>
    ),
    notes: `好，讓我們逐一了解 Dockerfile 的每個指令。首先是 FROM，這是每一個 Dockerfile 必須有的第一個指令，指定你的 Image 要建立在哪個基礎映像上。

FROM 的選擇非常重要，因為它決定了你的 Image 的基礎環境，也直接影響到最終 Image 的大小。一般來說，有幾個選擇策略：如果你要跑 Node.js 應用程式，就選 node:18-alpine；如果要跑 Python，選 python:3.11-slim；如果要跑 Java，選 openjdk:17-slim 之類的。選擇 alpine 或 slim 版本的基礎映像，可以讓你的 Image 更小，因為它們去掉了很多不必要的套件。

scratch 是一個特殊的基礎映像，它是完全空的，什麼都沒有。通常只有在建構靜態連結的二進制檔案（比如用 Go 語言寫的程式）的時候才用，因為靜態連結的程式不依賴任何動態函式庫，所以不需要任何系統環境。

接下來是 RUN，用來在建構 Image 的過程中執行 shell 指令。你可以用 RUN 來安裝套件、複製設定、編譯程式碼等等。

這裡有一個非常重要的知識點：每一個 RUN 指令都會建立一個新的 Layer。如果你有多個 RUN 指令，就會建立多個 Layer，這會讓 Image 變大。最佳實踐是把相關的指令合併到同一個 RUN 裡面，用 && 連接。而且，在安裝完 apt 套件之後，要記得刪除 apt 的快取（rm -rf /var/lib/apt/lists/*），否則這些快取會留在 Image 裡面，白白佔用空間。對於 npm，可以在 npm install 之後加 npm cache clean --force；對於 pip，可以加 --no-cache-dir 選項。這些細節加起來，可以讓你的 Image 體積減少很多。大家記住這個技巧，以後寫 Dockerfile 的時候很常用到。`,
    duration: "10"
  },
  {
    title: "COPY、ADD 與 WORKDIR 指令",
    subtitle: "複製檔案與設定工作目錄",
    section: "Dockerfile 撰寫",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">WORKDIR — 設定工作目錄</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>WORKDIR /app</p>
              <p className="text-slate-400"># 等同於 mkdir -p /app && cd /app</p>
              <p className="text-slate-400"># 後續指令都在 /app 目錄下執行</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">COPY vs ADD</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-green-400">COPY src/ /app/src/</p>
              <p className="text-green-400">COPY package.json /app/</p>
              <p className="text-slate-400 mt-2"># ADD 額外支援：</p>
              <p className="text-green-400">ADD app.tar.gz /app/     </p>
              <p className="text-slate-400">← 自動解壓縮</p>
              <p className="text-green-400">ADD https://example.com/file /app/</p>
              <p className="text-slate-400">← 從 URL 下載</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">Layer 快取最佳化：先 COPY 依賴，後 COPY 程式碼</p>
          <div className="font-mono text-sm space-y-1">
            <p className="text-green-400">WORKDIR /app</p>
            <p className="text-green-400">COPY package.json package-lock.json ./</p>
            <p className="text-slate-400">← 只複製 package.json，依賴少變動</p>
            <p className="text-green-400">RUN npm ci</p>
            <p className="text-green-400">COPY . .</p>
            <p className="text-slate-400">← 最後再複製程式碼</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm">
          <span className="text-red-400 font-semibold">建議：</span>
          <span className="text-slate-300"> 優先用 COPY（明確），只在需要自動解壓或下載 URL 時用 ADD</span>
        </div>
      </div>
    ),
    notes: `接下來是 WORKDIR、COPY 和 ADD 這三個指令，它們都跟管理 Image 裡面的檔案和目錄有關。

WORKDIR 設定後續指令（RUN、COPY、ADD、CMD、ENTRYPOINT）的工作目錄。如果這個目錄不存在，Docker 會自動建立它。這個指令等同於先 mkdir -p 建立目錄，然後 cd 切換到這個目錄。在 Dockerfile 裡面，你可以多次使用 WORKDIR，每次都會相對於上一個 WORKDIR 的位置。最佳實踐是一開始就設定好工作目錄，通常是 /app，這樣後續所有的操作都在這個目錄下進行，不容易出錯。

COPY 是把主機上的檔案或目錄複製到 Image 裡面。語法是 COPY 來源路徑 目的路徑。來源路徑是相對於你的 Dockerfile 所在目錄（也就是 build context）的路徑。值得注意的是，COPY 只能複製 build context 裡面的檔案，不能訪問 build context 之外的路徑（比如 ../other-project）。

ADD 和 COPY 的基本功能一樣，但 ADD 有兩個額外的特性：第一，如果來源是一個壓縮檔（.tar.gz、.tar.bz2 等），ADD 會自動解壓縮到目的目錄；第二，來源可以是一個 URL，ADD 會從網路下載這個 URL 的內容。雖然 ADD 功能更強，但官方建議只在需要自動解壓縮的時候才用 ADD，其他情況都用 COPY，因為 COPY 語義更清晰，行為更可預期。

現在講一個非常重要的最佳化技巧：Layer 快取的最大化利用。Docker 建構 Image 的時候，如果某一層的輸入沒有變化（指令相同、來源檔案相同），Docker 就會直接使用快取的 Layer，不重新執行。這意味著，你應該把不常變動的步驟放在前面，頻繁變動的步驟放在後面。

對於 Node.js 應用程式，最佳實踐是先只 COPY package.json 和 package-lock.json，執行 npm ci 安裝依賴，然後再 COPY 其他程式碼。這樣的話，只要 package.json 沒變，npm ci 那一層就會被快取，不需要重新安裝所有依賴，建構速度大大加快。但如果你一開始就 COPY . .，每次程式碼改動都會讓 npm ci 重新執行，非常慢。這個技巧很重要，請大家牢記！`,
    duration: "10"
  },
  {
    title: "ENV 與 EXPOSE 指令",
    subtitle: "設定環境變數與宣告埠號",
    section: "Dockerfile 撰寫",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">ENV — 設定環境變數</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-green-400">ENV NODE_ENV=production</p>
              <p className="text-green-400">ENV PORT=3000</p>
              <p className="text-green-400">ENV APP_VERSION=1.0.0</p>
              <p className="text-slate-400 mt-2"># 可在後續指令引用</p>
              <p className="text-green-400">WORKDIR /app/$APP_VERSION</p>
              <p className="text-green-400">EXPOSE $PORT</p>
              <p className="text-slate-400 mt-2"># 啟動時可覆蓋</p>
              <p className="text-green-400">docker run -e NODE_ENV=dev ...</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">EXPOSE — 宣告埠號</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>EXPOSE 3000</p>
              <p>EXPOSE 80/tcp</p>
              <p>EXPOSE 53/udp</p>
              <p>EXPOSE 8080 8443</p>
            </div>
            <div className="mt-3 bg-yellow-900/30 border border-yellow-700 p-3 rounded text-xs">
              <p className="text-yellow-400 font-semibold">再次強調！</p>
              <p className="text-slate-300 mt-1">EXPOSE 只是文件說明，不自動開放埠號。還是需要 docker run -p 才能從外部訪問！</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">ARG vs ENV 的差別</p>
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div>
              <p className="text-slate-400 mb-1">ARG（只在建構時有效）</p>
              <p className="text-green-400">ARG NODE_VERSION=18</p>
              <p className="text-green-400">FROM node:$NODE_VERSION-alpine</p>
              <p className="text-slate-400 mt-1">docker build --build-arg NODE_VERSION=20 .</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">ENV（建構時和執行時都有效）</p>
              <p className="text-green-400">ENV APP_PORT=3000</p>
              <p className="text-green-400">EXPOSE $APP_PORT</p>
              <p className="text-slate-400 mt-1">執行時：docker run -e APP_PORT=8080 ...</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `接下來是 ENV 和 EXPOSE，以及一個常與 ENV 混淆的 ARG 指令。

ENV 用來在 Image 裡面設定環境變數。這些環境變數在容器執行的時候會自動生效，不需要用 -e 傳入。你可以把一些預設值用 ENV 設定在 Dockerfile 裡面，比如 NODE_ENV=production（告訴 Node.js 這是生產環境，某些框架會根據這個值改變行為）、PORT=3000（應用程式的監聽埠）等。

ENV 的一個很有用的特性是：在 Dockerfile 後續的指令裡面可以用 $變數名 來引用這個變數。比如你設定了 ENV APP_HOME=/app，後面就可以用 WORKDIR $APP_HOME 來引用它，這樣如果將來要改路徑，只需要改 ENV 那一行就好了，後面的指令不需要改。

更重要的是，ENV 設定的環境變數在容器啟動的時候可以被 -e 覆蓋。所以 ENV 在 Dockerfile 裡面設定的是預設值，實際執行時可以根據需要覆蓋。這讓你的 Image 更靈活，同一個 Image 可以在不同環境用不同的環境變數執行。

EXPOSE 上午已經說過了，它只是一個文件說明，不實際開放埠號。但我想特別強調一下它的重要性：雖然它不開放埠號，但它是一個非常好的文件習慣，讓使用你的 Image 的人知道這個應用程式打算使用哪些埠，然後在 docker run 的時候用 -p 把對應的埠映射出來。

最後說一下 ARG 和 ENV 的差別。ARG 也是定義變數，但它只在建構 Image 的過程中有效，容器啟動之後就沒有了。ARG 主要用於建構時的參數化，比如你要建構不同版本的 Node.js 的 Image，可以用 ARG NODE_VERSION=18，然後 FROM node:$NODE_VERSION-alpine，在 docker build 的時候用 --build-arg NODE_VERSION=20 傳入不同的版本號。而 ENV 是在 Image 裡面持久存在的環境變數，建構時和執行時都有效。大家記住這個差別，在實際使用的時候很常需要在 ARG 和 ENV 之間做選擇。`,
    duration: "10"
  },
  {
    title: "CMD vs ENTRYPOINT：啟動指令的藝術",
    subtitle: "容器啟動時要執行什麼？",
    section: "Dockerfile 撰寫",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">CMD — 預設指令（可覆蓋）</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-slate-400"># exec 格式（推薦）</p>
              <p className="text-green-400">CMD ["node", "app.js"]</p>
              <p className="text-slate-400 mt-1"># shell 格式</p>
              <p className="text-green-400">CMD node app.js</p>
              <p className="text-slate-400 mt-2"># 可被覆蓋：</p>
              <p className="text-green-400">docker run myapp node other.js</p>
              <p className="text-slate-400">← CMD 被替換</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">ENTRYPOINT — 固定指令（難覆蓋）</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-green-400">ENTRYPOINT ["nginx", "-g", "daemon off;"]</p>
              <p className="text-slate-400 mt-1"># 只能用 --entrypoint 覆蓋</p>
              <p className="text-green-400">docker run --entrypoint sh myapp</p>
              <p className="text-slate-400 mt-2"># ENTRYPOINT + CMD 組合：</p>
              <p className="text-green-400">ENTRYPOINT ["python", "app.py"]</p>
              <p className="text-green-400">CMD ["--debug"]</p>
              <p className="text-slate-400">← CMD 作為預設參數</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">選擇建議</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
            <div>
              <p className="text-green-400 font-semibold">用 CMD 當：</p>
              <p>提供預設指令，但允許使用者自由替換（工具類 Image）</p>
            </div>
            <div>
              <p className="text-k8s-blue font-semibold">用 ENTRYPOINT 當：</p>
              <p>這個容器有明確的用途，不應該被輕易改變（服務類 Image）</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `CMD 和 ENTRYPOINT 是很多人感到困惑的地方，讓我用一個很直觀的方式來說明它們的差別。

首先是 CMD。CMD 設定容器啟動時要執行的預設指令。「預設」這兩個字很關鍵，因為它可以被 docker run 後面的指令完全替換。比如你的 Dockerfile 裡面有 CMD ["node", "app.js"]，那麼 docker run myapp 就會執行 node app.js。但如果你在 docker run 後面加上別的指令，比如 docker run myapp bash，那麼 CMD 就被忽略了，容器會執行 bash 而不是 node app.js。

ENTRYPOINT 也是設定容器啟動時的指令，但它是固定的，不容易被替換。如果你設定了 ENTRYPOINT ["python", "app.py"]，那麼無論你在 docker run 後面加什麼，都只是作為 python app.py 的額外參數，而不會替換掉這個指令本身。要覆蓋 ENTRYPOINT，你需要明確使用 --entrypoint 選項，比如 docker run --entrypoint sh myapp。

CMD 和 ENTRYPOINT 的一個常用組合是：用 ENTRYPOINT 設定固定的執行程式，用 CMD 設定預設的參數。比如 ENTRYPOINT ["python", "app.py"] 加上 CMD ["--debug"]。當用 docker run myapp 啟動的時候，會執行 python app.py --debug。如果你用 docker run myapp --production，CMD 的 --debug 就被替換成 --production，但 ENTRYPOINT 的 python app.py 還是不變。

關於指令格式，有兩種：exec 格式（用 JSON 陣列，比如 CMD ["node", "app.js"]）和 shell 格式（直接寫字串，比如 CMD node app.js）。強烈推薦使用 exec 格式，原因是：exec 格式讓你的程式直接成為容器的 PID 1（主程序），可以正確接收 SIGTERM 信號，優雅地關閉；而 shell 格式會用 /bin/sh -c 來執行，你的程式是 shell 的子程序，信號處理可能有問題，docker stop 可能沒辦法優雅地關閉程序。這個細節在生產環境非常重要，請大家記住使用 exec 格式。`,
    duration: "10"
  },
  {
    title: "☕ 下午休息",
    subtitle: "15 分鐘後繼續——建構自訂 Image！",
    section: "休息",
    content: (
      <div className="space-y-6 text-center">
        <div className="text-6xl">☕</div>
        <p className="text-2xl text-slate-300">休息 15 分鐘</p>
        <div className="bg-slate-800/50 p-5 rounded-lg text-left max-w-lg mx-auto">
          <p className="text-k8s-blue font-semibold mb-3">後半場精彩內容</p>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>🔨 docker build 實際操作</li>
            <li>⚡ Layer 快取加速技巧</li>
            <li>🪶 Alpine + 多階段建構縮小 Image</li>
            <li>🐙 Docker Compose 一鍵啟動多服務</li>
            <li>🚀 明日 Kubernetes 預告</li>
          </ul>
        </div>
        <p className="text-slate-400 text-sm">提示：試著把我們剛才學的 Dockerfile 指令默寫一遍！</p>
      </div>
    ),
    notes: "",
    duration: "15"
  },
  {
    title: "docker build：建構你的第一個 Image",
    subtitle: "把 Dockerfile 變成可執行的 Image",
    section: "建構自訂 Image",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">基本建構指令</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p className="text-slate-400"># 在目前目錄的 Dockerfile 建構</p>
            <p>docker build -t myapp:1.0 .</p>
            <p className="text-slate-400 mt-1"># 指定 Dockerfile 位置</p>
            <p>docker build -f ./docker/Dockerfile -t myapp:1.0 .</p>
            <p className="text-slate-400 mt-1"># 不使用快取（強制重建）</p>
            <p>docker build --no-cache -t myapp:1.0 .</p>
            <p className="text-slate-400 mt-1"># 傳入建構參數</p>
            <p>docker build --build-arg NODE_VERSION=20 -t myapp:1.0 .</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">Build Context</p>
            <p className="text-slate-300 text-xs">. 代表目前目錄，Docker 會把這個目錄的所有內容傳給 Docker daemon 作為建構上下文。</p>
            <p className="text-yellow-400 text-xs mt-2">⚠️ 大目錄會讓建構很慢！用 .dockerignore 排除不需要的檔案。</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">Tag 命名規則</p>
            <div className="font-mono text-xs text-slate-300 space-y-1">
              <p><span className="text-green-400">myapp:latest</span> — 最新版</p>
              <p><span className="text-green-400">myapp:1.0.0</span> — 語意化版本</p>
              <p><span className="text-green-400">registry.com/team/myapp:1.0</span> — 私有 Registry</p>
            </div>
          </div>
        </div>
      </div>
    ),
    code: `# 完整 Node.js 應用程式建構範例
cat Dockerfile
# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .
# EXPOSE 3000
# CMD ["node", "app.js"]

# 建構 Image
docker build -t mynode-app:1.0 .

# 查看建構結果
docker images | grep mynode-app

# 測試執行
docker run -d -p 3000:3000 --name myapp mynode-app:1.0

# 測試服務
curl http://localhost:3000

# 推送到 Registry
docker tag mynode-app:1.0 your-registry/mynode-app:1.0
docker push your-registry/mynode-app:1.0`,
    notes: `好，歡迎回來！現在我們要把剛才學到的 Dockerfile 知識付諸實踐，實際建構一個自訂 Image。

docker build 是建構 Image 的指令。最基本的用法是 docker build -t 名稱:標籤 .，這裡的 . 代表目前目錄，也就是 build context（建構上下文）。

什麼是 build context？當你執行 docker build 的時候，Docker 客戶端會把你指定的目錄（通常是 .，也就是目前目錄）的所有內容打包傳送給 Docker daemon（在伺服器上跑的 Docker 服務）。Docker daemon 才是真正執行建構工作的。COPY 和 ADD 指令從這個上下文裡面複製檔案。

這裡有一個很重要的性能問題：如果你的目錄很大（比如包含了 node_modules 目錄、.git 目錄、大型的媒體檔案），build context 就會很大，傳送需要很長時間，建構就會很慢。解決方案是 .dockerignore 檔案，我們後面會講。

-t 選項是 tag（標籤）的意思，用來給 Image 取名字。格式是 名稱:標籤，標籤通常用版本號。如果不指定標籤，預設是 latest。建議使用語意化版本（Semantic Versioning），比如 1.0.0、1.1.0 這樣，讓版本管理更清晰。

-f 選項指定 Dockerfile 的路徑，預設是目前目錄的 Dockerfile。如果你的 Dockerfile 放在別的地方，或者有多個 Dockerfile（比如 Dockerfile.dev 和 Dockerfile.prod），就需要用 -f 指定。

--no-cache 選項讓 Docker 不使用快取，強制從頭重新建構。這在你更新了依賴但快取沒有正確失效的時候很有用。--build-arg 傳入 ARG 的值。

建構成功之後，用 docker images 就能看到你的新 Image。然後用 docker run 啟動它來測試是否正常運作。如果要分享這個 Image，可以 docker push 推送到 Docker Registry（Docker Hub 或私有 Registry）。`,
    duration: "10"
  },
  {
    title: "Layer 快取機制深入理解",
    subtitle: "讓建構速度快 10 倍的關鍵技巧",
    section: "建構自訂 Image",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">Layer 快取的工作原理</p>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-blue-900/50 p-2 rounded">
              <p className="text-k8s-blue font-semibold">FROM</p>
              <p className="text-slate-400">Layer 1</p>
              <p className="text-green-400 text-xs">✓ 快取</p>
            </div>
            <div className="bg-blue-900/50 p-2 rounded">
              <p className="text-k8s-blue font-semibold">COPY pkg</p>
              <p className="text-slate-400">Layer 2</p>
              <p className="text-green-400 text-xs">✓ 快取</p>
            </div>
            <div className="bg-blue-900/50 p-2 rounded">
              <p className="text-k8s-blue font-semibold">RUN npm</p>
              <p className="text-slate-400">Layer 3</p>
              <p className="text-green-400 text-xs">✓ 快取</p>
            </div>
            <div className="bg-orange-900/50 p-2 rounded border border-orange-600">
              <p className="text-orange-400 font-semibold">COPY src</p>
              <p className="text-slate-400">Layer 4</p>
              <p className="text-orange-400 text-xs">✗ 重建</p>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">
            一旦某一層的快取失效，其後的所有層都必須重新建構
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold mb-2">❌ 快取無效化設計</p>
            <div className="font-mono text-xs text-slate-300">
              <p>FROM node:18-alpine</p>
              <p>WORKDIR /app</p>
              <p className="text-red-400">COPY . .</p>
              <p className="text-red-400 pl-2">↑ 每次程式碼改動都失效！</p>
              <p>RUN npm install</p>
              <p className="text-red-400 pl-2">↑ 每次都要重新安裝！</p>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">✅ 快取最大化設計</p>
            <div className="font-mono text-xs text-slate-300">
              <p>FROM node:18-alpine</p>
              <p>WORKDIR /app</p>
              <p className="text-green-400">COPY package*.json ./</p>
              <p className="text-green-400">RUN npm ci</p>
              <p className="text-green-400 pl-2">↑ 依賴不變就快取</p>
              <p className="text-green-400">COPY . .</p>
              <p className="text-green-400 pl-2">↑ 最後複製程式碼</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `Layer 快取機制是讓 Docker 建構速度飛快的關鍵，但很多人沒有好好利用它。讓我來深入解釋這個機制，以及如何設計 Dockerfile 來最大化快取的利用。

每一個 Dockerfile 指令都會建立一個新的 Layer（層）。Docker 在建構的時候，對每一層都會計算一個指紋（hash），這個指紋基於：這個層的指令本身，以及這個指令用到的所有輸入（比如 COPY 的檔案內容）。

當你再次建構同一個 Image 的時候，Docker 會逐層對比指紋。如果某一層的指紋跟上次一樣，Docker 就直接使用快取的 Layer，不重新執行這個指令。這個過程叫做 Cache Hit（快取命中）。

關鍵規則是：一旦某一層的快取失效（指紋不匹配），這一層之後的所有層都必須重新建構，即使後面的層沒有任何變動。這就是為什麼 Dockerfile 的指令順序非常重要。

舉例說明：如果你把 COPY . .（複製所有程式碼）放在 RUN npm install 之前，那麼每次你修改任何一個程式碼檔案，都會讓 COPY . . 的快取失效，進而讓 RUN npm install 也失效，導致每次建構都要重新安裝所有依賴，這可能需要好幾分鐘。

正確的做法是先 COPY package.json package-lock.json ./，這個操作只有在 package.json 改變（也就是依賴改變）的時候才會讓快取失效，然後 RUN npm ci 安裝依賴，最後才 COPY . . 複製其他程式碼。這樣的話，日常開發中只要沒有新增或刪除 npm 套件，建構的時候 npm install 那步都會被快取，建構速度可以快 10 倍以上。這個技巧不只適用於 Node.js，Python 的 requirements.txt、Java 的 pom.xml、Go 的 go.mod 都可以用同樣的方式處理。`,
    duration: "10"
  },
  {
    title: "BuildKit 與建構加速",
    subtitle: "下一代建構引擎——更快、更安全",
    section: "建構自訂 Image",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">啟用 BuildKit</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p className="text-slate-400"># 方法一：環境變數</p>
              <p>DOCKER_BUILDKIT=1 docker build -t myapp .</p>
              <p className="text-slate-400 mt-1"># 方法二：全域啟用（推薦）</p>
              <p className="text-slate-400"># /etc/docker/daemon.json</p>
              <p>{"{"} "features": {"{"} "buildkit": true {"}"} {"}"}</p>
              <p className="text-slate-400 mt-1"># Docker Desktop 預設已啟用</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">BuildKit 的優勢</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>⚡ 並行建構獨立 Stage</li>
              <li>🎯 只建構需要的 Stage</li>
              <li>📦 改進的快取機制（mount cache）</li>
              <li>🔒 Secret 掛載（不留在 Layer）</li>
              <li>📊 更清晰的進度顯示</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">BuildKit 的 Mount Cache（npm 加速範例）</p>
          <div className="font-mono text-sm text-green-400">
            <p className="text-slate-400"># syntax=docker/dockerfile:1</p>
            <p>FROM node:18-alpine</p>
            <p>WORKDIR /app</p>
            <p>COPY package*.json ./</p>
            <p>RUN --mount=type=cache,target=/root/.npm \</p>
            <p>    npm ci</p>
            <p className="text-slate-400"># npm 快取跨建構保存，不佔 Image 空間</p>
          </div>
        </div>
      </div>
    ),
    notes: `BuildKit 是 Docker 的下一代建構引擎，從 Docker 18.09 開始引入，在 Docker Desktop 上預設已啟用。如果你還沒有用到 BuildKit，強烈建議你開始使用它，因為它帶來了很多改進。

首先是速度方面，BuildKit 支援並行建構。在多階段建構（我們等一下會學）的情況下，如果不同的 Stage 沒有相依關係，BuildKit 可以同時建構它們，而不是依序建構，這可以大幅縮短建構時間。

其次是更智慧的快取機制。BuildKit 支援 --mount=type=cache，讓你可以把某個目錄（比如 npm 的快取目錄、pip 的下載快取）掛載為跨建構持久的快取，這個快取不會被包含在最終的 Image 裡面，但每次建構都可以重用。這樣 npm install 或 pip install 即使沒有 Layer 快取，也可以利用本地的套件快取，大幅加速安裝速度。

BuildKit 還有一個很重要的安全特性：Secret 掛載。在建構 Image 的過程中，有時候需要用到一些機密資訊，比如 npm 私有套件的認證 Token、SSH 私鑰等。傳統的做法是把這些設定成環境變數或 ARG，但這樣會把機密資訊留在 Image 的 Layer 裡面，有安全風險。BuildKit 的 --mount=type=secret 讓你可以在建構時掛載機密資訊，但這些資訊不會被包含在最終的 Image 裡面。

啟用 BuildKit 很簡單，在執行 docker build 的時候加上環境變數 DOCKER_BUILDKIT=1 就好了。或者在 Docker 的設定檔（daemon.json）裡面全域啟用，這樣就不需要每次都加環境變數了。Docker Desktop 版本預設已經啟用了 BuildKit，所以 Mac 和 Windows 的用戶可能已經在享受它的好處了。大家可以測試一下，用同樣的 Dockerfile 分別用 BuildKit 和不用 BuildKit 建構，感受一下速度差異。`,
    duration: "10"
  },
  {
    title: "Alpine 輕量映像與 Image 瘦身",
    subtitle: "從 900MB 縮到 50MB 的實際案例",
    section: "Image 最佳化",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold">ubuntu:22.04</p>
            <p className="text-2xl font-bold text-slate-300 my-1">77 MB</p>
            <p className="text-slate-400 text-xs">完整 Ubuntu 環境</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold">node:18</p>
            <p className="text-2xl font-bold text-slate-300 my-1">951 MB</p>
            <p className="text-slate-400 text-xs">基於 Debian，包含完整工具</p>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold">node:18-alpine</p>
            <p className="text-2xl font-bold text-slate-300 my-1">112 MB</p>
            <p className="text-slate-400 text-xs">Alpine Linux，極度精簡</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm mb-2">Alpine 的特點</p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
            <div>
              <p className="text-green-400 font-semibold">優點：</p>
              <ul className="space-y-1 text-xs mt-1">
                <li>• 基礎映像只有 5MB</li>
                <li>• 較小的安全攻擊面</li>
                <li>• 部署速度快</li>
              </ul>
            </div>
            <div>
              <p className="text-yellow-400 font-semibold">注意事項：</p>
              <ul className="space-y-1 text-xs mt-1">
                <li>• 使用 musl libc（非 glibc）</li>
                <li>• 套件管理用 apk（非 apt）</li>
                <li>• 某些 npm 套件可能相容性問題</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg font-mono text-sm">
          <p className="text-slate-400">Alpine 套件安裝：</p>
          <p className="text-green-400">RUN apk add --no-cache curl git bash</p>
        </div>
      </div>
    ),
    notes: `Image 大小是一個很實際的問題。大的 Image 意味著：部署時需要傳輸更多資料，在沒有快取的環境下啟動容器更慢；佔用更多的磁碟空間；增大了安全攻擊面（更多的軟體 = 更多潛在的漏洞）。所以減小 Image 大小是 Dockerfile 最佳化的重要目標。

Alpine Linux 是一個非常輕量的 Linux 發行版，整個基礎系統只有 5MB 左右，相比 Debian 的 120MB 或 Ubuntu 的 77MB 小得多。Docker Hub 上的官方 Image 很多都有 alpine 版本，比如 node:18-alpine、python:3.11-alpine、nginx:alpine 等。使用 alpine 版本可以讓你的基礎映像從幾百 MB 縮小到幾十 MB。

不過 Alpine 有幾個需要注意的地方。首先是 libc 的問題：Alpine 使用的是 musl libc，而不是大多數 Linux 發行版使用的 glibc。大部分情況下這不是問題，但某些 npm 套件或 C 擴充功能（比如 bcrypt、node-gyp 編譯的套件）可能在 Alpine 上有相容性問題。如果遇到這種情況，可以改用 node:18-slim（基於 Debian 的瘦身版）。

其次是套件管理工具：Alpine 使用 apk 而不是 apt-get。語法類似，但不完全一樣。比如 apk add --no-cache curl，--no-cache 選項讓 apk 不保留本地快取，這樣可以減小 Image 大小。Alpine 的軟體倉庫裡面的套件比 Debian/Ubuntu 少一些，某些比較冷門的套件可能沒有。

除了選擇輕量基礎映像之外，還有一些減小 Image 的技巧：不要在 Image 裡面留下 apt/apk 的快取（在 RUN 指令末尾加清理指令）；不要包含開發工具（測試框架、文件產生工具等）；使用多階段建構（我們等一下會學），把建構工具和最終執行環境分開。`,
    duration: "10"
  },
  {
    title: "多階段建構（Multi-Stage Build）",
    subtitle: "用「建構環境」建構，用「執行環境」執行",
    section: "Image 最佳化",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">多階段建構概念</p>
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-blue-900/50 px-3 py-2 rounded text-center">
              <p className="text-k8s-blue font-semibold">Stage 1: builder</p>
              <p className="text-slate-400 text-xs">node:18（含所有工具）</p>
              <p className="text-slate-400 text-xs">npm install + 編譯</p>
              <p className="text-yellow-400 text-xs font-semibold">這層不在最終 Image</p>
            </div>
            <div className="text-slate-400 text-xl">→</div>
            <div className="bg-green-900/50 px-3 py-2 rounded text-center">
              <p className="text-green-400 font-semibold">Stage 2: runner</p>
              <p className="text-slate-400 text-xs">node:18-alpine（只有執行環境）</p>
              <p className="text-slate-400 text-xs">只複製必要的產出</p>
              <p className="text-green-400 text-xs font-semibold">這才是最終 Image</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm mb-2">Node.js 多階段建構範例</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p className="text-slate-400"># Stage 1: 建構階段</p>
            <p><span className="text-yellow-400">FROM</span> <span className="text-green-400">node:18 AS builder</span></p>
            <p>WORKDIR /build</p>
            <p>COPY package*.json ./</p>
            <p>RUN npm ci</p>
            <p>COPY . .</p>
            <p>RUN npm run build</p>
            <p className="text-slate-400 mt-2"># Stage 2: 執行階段（最終 Image）</p>
            <p><span className="text-yellow-400">FROM</span> <span className="text-green-400">node:18-alpine AS runner</span></p>
            <p>WORKDIR /app</p>
            <p>COPY --from=builder /build/dist ./dist</p>
            <p>COPY --from=builder /build/package.json ./</p>
            <p>RUN npm ci --only=production</p>
            <p>EXPOSE 3000</p>
            <p>CMD ["node", "dist/app.js"]</p>
          </div>
        </div>
      </div>
    ),
    notes: `多階段建構是減小 Image 大小最有效的技巧之一，在實際工作中非常常用。讓我用一個具體的例子來說明。

假設你有一個 TypeScript 的 Node.js 應用程式。要把它變成可執行的，你需要：Node.js 執行環境、TypeScript 編譯器（tsc）、所有的開發依賴（@types/*)、所有的生產依賴。但在最終執行的時候，你只需要：Node.js 執行環境、編譯好的 JavaScript 檔案、生產依賴（不需要 TypeScript 編譯器和開發依賴）。

如果你把所有東西都打包進一個 Image，Image 可能有 500MB 以上，裡面有很多在執行時完全用不到的東西（編譯器、測試框架等）。

多階段建構的思路是：建構和執行分開。第一個 Stage（建構 Stage）用完整的環境來安裝依賴和編譯，第二個 Stage（執行 Stage）從建構 Stage 複製需要的產出，用輕量的基礎映像作為執行環境。

在 Dockerfile 裡面，你可以用 FROM ... AS 給每個 Stage 命名，然後在後面的 Stage 裡面用 COPY --from=Stage名稱 來從前面的 Stage 複製特定檔案。最終的 Image 只包含最後一個 Stage 的內容，前面的 Stage 在建構完成之後就被丟棄了。

這樣做的效果非常顯著。一個 Node.js + TypeScript 應用程式，不用多階段建構可能是 700MB，用了多階段建構可能縮小到 100MB 以下。不只是 Node.js，Go、Java、C++ 等需要編譯的語言也非常適合用多階段建構：用有編譯器的環境建構，用只有執行環境的極簡映像來跑。比如 Go 程式用多階段建構，最終 Image 甚至可以只有幾 MB，因為 Go 可以靜態連結，不需要任何執行環境，可以直接用 scratch 作為基礎映像。`,
    duration: "15"
  },
  {
    title: ".dockerignore — 加速建構與保護機密",
    subtitle: "告訴 Docker 哪些檔案不要包含在 Build Context",
    section: "Image 最佳化",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">.dockerignore 範例</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-slate-400"># 依賴目錄（容器裡面會重新安裝）</p>
              <p className="text-green-400">node_modules/</p>
              <p className="text-green-400">vendor/</p>
              <p className="text-slate-400"># 版本控制</p>
              <p className="text-green-400">.git/</p>
              <p className="text-green-400">.gitignore</p>
              <p className="text-slate-400"># 機密設定</p>
              <p className="text-green-400">.env</p>
              <p className="text-green-400">.env.*</p>
              <p className="text-slate-400"># 建構產出</p>
              <p className="text-green-400">dist/</p>
              <p className="text-green-400">build/</p>
              <p className="text-slate-400"># 測試與文件</p>
              <p className="text-green-400">*.test.ts</p>
              <p className="text-green-400">docs/</p>
              <p className="text-green-400">README.md</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">為什麼重要？</p>
              <ul className="text-slate-300 text-xs space-y-1 mt-1">
                <li>✅ 減少 Build Context 大小（建構更快）</li>
                <li>✅ 避免機密檔案被加入 Image</li>
                <li>✅ 避免不必要的快取失效</li>
              </ul>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg">
              <p className="text-yellow-400 font-semibold text-sm">案例：</p>
              <p className="text-slate-300 text-xs mt-1">node_modules 通常有數萬個檔案，不加 .dockerignore 會讓建構超慢。加上之後，建構可以快 5-10 倍！</p>
            </div>
            <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
              <p className="text-red-400 font-semibold text-sm">⚠️ 安全警告</p>
              <p className="text-slate-300 text-xs mt-1">如果 .env 沒有被 .dockerignore 排除，你的密碼可能會出現在 Image 的 Layer 裡面！</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `.dockerignore 是一個容易被忽略但非常重要的檔案。它的作用類似 .gitignore，告訴 Docker 在建構 Image 時，哪些檔案和目錄不要包含在 Build Context 裡面。

讓我先說為什麼這個很重要。當你執行 docker build . 的時候，Docker 客戶端會把 . 這個目錄的所有內容打包傳給 Docker daemon。如果你的目錄裡面有 node_modules（可能有幾千個檔案、幾百 MB），這個打包和傳輸過程就會非常慢，即使你的 Dockerfile 裡面有 COPY . .，這些 node_modules 也是先被傳到 daemon，然後才被排除（如果你有 .dockerignore）。但這樣就浪費了時間。

正確做法是先用 .dockerignore 排除不需要的東西，讓 Build Context 盡可能小。最應該排除的東西有：node_modules（在容器裡面會重新安裝，不需要從主機複製）；.git 目錄（版本控制資訊，佔用空間，不應該出現在 Image 裡面）；.env 檔案（這個最重要，你的密碼、API Key 都在這裡，絕對不能被打包進 Image）；dist 或 build 目錄（多階段建構裡面這些是在容器內部建構的，不需要從外面複製）；測試檔案和文件。

安全性方面，.env 沒有被 .dockerignore 排除是一個非常危險的錯誤。如果你把含有密碼的 .env 用 COPY . . 複製進了 Image，這個 Image 裡面就有你的密碼了。即使你後來用 RUN rm .env 刪除了它，那個密碼還是存在於 Image 的 Layer 歷史裡面，可以被有心人提取出來。所以永遠記得：在 .dockerignore 裡面加上 .env 和所有包含機密的檔案！\`.dockerignore 的語法跟 .gitignore 很像，支援萬用字元和注釋。把這個檔案加到你的每一個有 Dockerfile 的專案裡，這是一個非常基礎但重要的最佳實踐。`,
    duration: "10"
  },
  {
    title: "為什麼需要 Docker Compose？",
    subtitle: "從「一個指令一個容器」到「一個指令多服務」",
    section: "Docker Compose",
    content: (
      <div className="space-y-5">
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">😫 沒有 Compose 的痛苦</p>
          <div className="font-mono text-xs text-slate-300 space-y-1">
            <p>docker network create myapp-net</p>
            <p>docker volume create mysql-data</p>
            <p>docker run -d --name mysql --network myapp-net -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret mysql:8</p>
            <p>docker run -d --name backend --network myapp-net -e DB_HOST=mysql -p 3001:3001 mybackend:1.0</p>
            <p>docker run -d --name frontend --network myapp-net -p 80:80 myfrontend:1.0</p>
            <p className="text-slate-400"># 停止時：docker stop mysql backend frontend</p>
            <p className="text-slate-400">## 更新時：每個容器都要手動重來...</p>
          </div>
        </div>
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">😊 有了 Compose 的幸福</p>
          <div className="font-mono text-sm text-slate-300 space-y-1">
            <p className="text-green-400">docker compose up -d     </p>
            <p className="text-slate-400">← 啟動所有服務！</p>
            <p className="text-green-400">docker compose down      </p>
            <p className="text-slate-400">← 停止並清理！</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們現在進入今天最後一個大主題：Docker Compose。這是一個讓多容器應用程式的管理變得非常簡單的工具，在實際工作中使用率極高。

讓我先說說為什麼需要 Compose。在沒有 Compose 之前，如果你要部署一個有多個服務的應用程式（比如前端、後端、資料庫），你需要：手動建立網路、手動建立 Volume、然後按照正確的順序一個一個啟動容器，每個都要帶著一堆參數。停止的時候也要一個個 stop，更新的時候要 pull 新的 Image 然後重新建立容器，非常麻煩，而且容易出錯（忘了哪個參數、忘了加入網路等等）。

Docker Compose 讓你用一個 YAML 格式的設定檔（通常叫做 docker-compose.yml 或 compose.yml）來描述你的整個應用程式：有哪些服務、每個服務用什麼 Image 或 Dockerfile、需要哪些網路、要掛載哪些 Volume、各種容器設定。

然後只需要一個指令 docker compose up -d，Compose 就會幫你：建立需要的網路和 Volume（如果不存在的話）、按照依賴關係的順序啟動所有容器、讓所有容器都加入正確的網路。停止整個應用程式也只需要 docker compose down 一個指令。

這不只是方便，更重要的是：這個 docker-compose.yml 檔案可以提交到 Git，讓所有開發者都能用同樣的方式在本地運行整套服務，確保開發環境的一致性。這對於團隊協作非常重要，不會再有「在我的電腦上可以跑，在你的電腦上跑不了」這種問題。大家有沒有感受到 Compose 的威力？讓我們來看看怎麼寫 Compose 檔案。`,
    duration: "10"
  },
  {
    title: "docker-compose.yml 語法",
    subtitle: "YAML 格式的多容器定義",
    section: "Docker Compose",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm mb-2">基本結構</p>
          <div className="font-mono text-sm space-y-1">
            <p className="text-yellow-400">services:</p>
            <p>  <span className="text-k8s-blue">web:</span></p>
            <p>    image: nginx:alpine</p>
            <p>    ports:</p>
            <p>      - "80:80"</p>
            <p>    volumes:</p>
            <p>      - ./html:/usr/share/nginx/html:ro</p>
            <p>    networks:</p>
            <p>      - frontend</p>
            <p>    depends_on:</p>
            <p>      - api</p>
            <p className="mt-1">  <span className="text-k8s-blue">api:</span></p>
            <p>    build:</p>
            <p>      context: ./backend</p>
            <p>      dockerfile: Dockerfile</p>
            <p>    environment:</p>
            <p>      DB_HOST: db</p>
            <p>      NODE_ENV: production</p>
            <p>    networks:</p>
            <p>      - frontend</p>
            <p>      - backend</p>
            <p className="mt-1">  <span className="text-k8s-blue">db:</span></p>
            <p>    image: mysql:8</p>
            <p>    env_file: ./mysql.env</p>
            <p>    volumes:</p>
            <p>      - mysql-data:/var/lib/mysql</p>
            <p>    networks:</p>
            <p>      - backend</p>
            <p className="text-yellow-400 mt-1">networks:</p>
            <p>  frontend:</p>
            <p>  backend:</p>
            <p className="text-yellow-400">volumes:</p>
            <p>  mysql-data:</p>
          </div>
        </div>
      </div>
    ),
    notes: `讓我來詳細解釋 docker-compose.yml 的語法結構。這個檔案用 YAML 格式撰寫，縮排非常重要，建議統一用兩個空格縮排，不要用 Tab。

最頂層的結構有幾個主要區塊：services（服務定義）、networks（網路定義）、volumes（Volume 定義）。

services 是核心，每個子項目代表一個服務（也就是一個容器）。在服務的定義裡面，有這些常用的欄位：image 指定使用的 Docker Image；build 指定要用 Dockerfile 建構，裡面的 context 是 Dockerfile 所在的目錄，dockerfile 指定 Dockerfile 的檔名（預設是 Dockerfile）；ports 定義埠號映射，格式跟 -p 一樣；volumes 掛載 Volume 或 Bind Mount；environment 設定環境變數；env_file 從檔案讀取環境變數；networks 指定這個服務要加入哪些網路；depends_on 指定服務的依賴關係，Compose 會等被依賴的服務啟動之後，再啟動這個服務。

networks 區塊定義自訂網路。如果只是列出名稱而沒有其他設定，Compose 會用預設的 bridge driver 建立這個網路。在範例裡，我定義了 frontend 和 backend 兩個網路，web 和 api 在 frontend 網路（前端服務之間可以互通），api 和 db 在 backend 網路（後端服務之間可以互通），但 web 無法直接存取 db，這提高了安全性。

volumes 區塊定義 Named Volume。在範例裡面定義了 mysql-data，Compose 在第一次 up 的時候會自動建立這個 Volume。

depends_on 要特別說明一下：它讓 Compose 按照順序啟動容器，但它只確保被依賴的容器「啟動了」，不確保服務「可以接受請求了」。比如 depends_on: db，只是確保 db 容器被啟動了，但 MySQL 還需要幾秒鐘才能完成初始化並接受連接。所以你的應用程式應該要有重試機制，不要假設 depends_on 列的服務一定是立刻可用的。`,
    duration: "15"
  },
  {
    title: "Docker Compose 常用指令",
    subtitle: "up / down / logs / ps——日常操作全覆蓋",
    section: "Docker Compose",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">啟動與停止</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker compose up</p>
              <p>docker compose up -d</p>
              <p>docker compose up --build</p>
              <p>docker compose down</p>
              <p>docker compose down -v</p>
              <p className="text-slate-400 text-xs">← 同時刪除 Volumes</p>
              <p>docker compose restart api</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">查看與除錯</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker compose ps</p>
              <p>docker compose logs</p>
              <p>docker compose logs -f api</p>
              <p>docker compose top</p>
              <p>docker compose exec db bash</p>
              <p>docker compose exec api \</p>
              <p>  node -e "console.log('ok')"</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">建構與更新</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p>docker compose build              # 重新建構所有服務</p>
            <p>docker compose build api          # 只重新建構 api</p>
            <p>docker compose pull               # 拉取最新 Image</p>
            <p>docker compose up -d --force-recreate   # 強制重建容器</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，讓我介紹 Docker Compose 的常用操作指令。這些指令在日常開發中使用頻率非常高，一定要熟記。

首先是 docker compose up。這是啟動整個應用程式的指令，它會建立缺少的網路和 Volume，然後啟動所有的服務。不加 -d 的話是前景執行，你會在終端機看到所有容器的日誌輸出，按 Ctrl+C 就可以停止。加上 -d（detach）就是背景執行，不佔用終端機。--build 選項讓 Compose 在啟動前重新建構所有使用 Dockerfile 的服務的 Image，如果你修改了 Dockerfile 或程式碼，記得加這個選項。

docker compose down 停止並刪除所有相關的容器，以及 Compose 建立的網路。注意：預設不會刪除 Volume，資料會被保留。如果你加上 -v，則會同時刪除 Compose 管理的 Volume（Volume 定義在 compose 檔案裡面的那些），這個要謹慎，因為資料會被刪除。

docker compose ps 列出 Compose 管理的所有容器的狀態，比 docker ps 更聚焦，只顯示這個 Compose 專案的容器。

docker compose logs 查看所有服務的日誌，加上 -f 是即時跟蹤，加上服務名稱只查看特定服務的日誌。在除錯的時候非常好用。

docker compose exec 在指定服務的容器裡面執行指令，用法跟 docker exec 一樣，但是你用的是服務名稱（比如 api、db），不是容器 ID 或名稱，更直觀。

docker compose restart 重新啟動指定的服務，在你修改了環境變數或設定之後，用這個指令讓服務讀取新的設定。

docker compose pull 拉取最新版本的 Image，然後配合 docker compose up -d --force-recreate 讓服務使用新的 Image 重啟。這是更新服務版本的標準流程。大家注意，force-recreate 會重新建立容器，如果你的服務有狀態，要確保狀態都已經持久化在 Volume 裡面。`,
    duration: "10"
  },
  {
    title: "實作：nginx + MySQL 的 Compose 架構",
    subtitle: "一個 YAML 搞定整套開發環境",
    section: "Docker Compose",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm mb-2">完整 compose.yml</p>
          <div className="font-mono text-xs text-slate-300 space-y-0.5">
            <p className="text-yellow-400">services:</p>
            <p>  <span className="text-k8s-blue">nginx:</span></p>
            <p>    image: nginx:alpine</p>
            <p>    ports:</p>
            <p>      - "80:80"</p>
            <p>    volumes:</p>
            <p>      - ./html:/usr/share/nginx/html:ro</p>
            <p>      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro</p>
            <p>    networks: [frontend, backend]</p>
            <p>    depends_on: [mysql]</p>
            <p>    restart: unless-stopped</p>
            <p className="mt-1">  <span className="text-k8s-blue">mysql:</span></p>
            <p>    image: mysql:8</p>
            <p>    env_file: ./mysql.env</p>
            <p>    volumes:</p>
            <p>      - mysql-data:/var/lib/mysql</p>
            <p>    networks: [backend]</p>
            <p>    restart: unless-stopped</p>
            <p>    healthcheck:</p>
            <p>      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]</p>
            <p>      interval: 30s</p>
            <p>      timeout: 10s</p>
            <p>      retries: 5</p>
            <p className="text-yellow-400 mt-1">networks:</p>
            <p>  frontend:</p>
            <p>  backend:</p>
            <p className="text-yellow-400">volumes:</p>
            <p>  mysql-data:</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-mono">
          <div className="bg-slate-800/50 p-3 rounded">
            <p className="text-green-400">docker compose up -d</p>
            <p className="text-slate-400 text-xs">啟動整套環境</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded">
            <p className="text-green-400">docker compose logs -f</p>
            <p className="text-slate-400 text-xs">查看所有服務日誌</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來做一個完整的 Docker Compose 實作。這個例子包含 nginx 和 MySQL 兩個服務，是非常常見的 Web 應用程式架構。

我要特別強調這個 compose.yml 裡面一個新的特性：healthcheck（健康檢查）。健康檢查讓 Docker 知道你的服務是否真的在正常工作，而不只是容器在執行中。對於 MySQL 的健康檢查，我用了 mysqladmin ping -h localhost，這個指令如果成功就表示 MySQL 正在運行並接受連接。interval: 30s 代表每 30 秒檢查一次，timeout: 10s 代表每次檢查最長等 10 秒，retries: 5 代表如果連續 5 次失敗就標記為 unhealthy。

健康檢查跟 depends_on 配合使用的時候，你可以用 condition: service_healthy 來指定「等到服務健康了才啟動我」，這比普通的 depends_on 更可靠，因為普通的 depends_on 只確保容器啟動了，不確保服務可以用了。

網路設計上，我把 nginx 放在 frontend 和 backend 兩個網路，MySQL 只在 backend 網路。這樣 nginx 可以存取 MySQL（透過 backend 網路），但外部用戶只能透過 nginx 訪問服務，不能直接訪問 MySQL，提高了安全性。

現在讓我們一起執行 docker compose up -d，然後用 docker compose ps 確認所有服務都啟動了，用 docker compose logs -f 查看日誌，確認沒有錯誤。如果 MySQL 的健康檢查通過了，你應該能看到它的狀態從 starting 變成 healthy。

大家自己試試看，如果有問題，用 docker compose logs 查看哪個服務有錯誤訊息，然後來問我。`,
    duration: "10"
  },
  {
    title: "Compose 覆蓋檔案與環境差異",
    subtitle: "一套程式碼，多個環境",
    section: "Docker Compose",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">compose.yml（基礎設定）</p>
            <div className="font-mono text-xs text-slate-300 space-y-0.5">
              <p className="text-yellow-400">services:</p>
              <p>  api:</p>
              <p>    build: ./api</p>
              <p>    environment:</p>
              <p>      NODE_ENV: production</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">compose.override.yml（開發覆蓋）</p>
            <div className="font-mono text-xs text-slate-300 space-y-0.5">
              <p className="text-yellow-400">services:</p>
              <p>  api:</p>
              <p>    volumes:</p>
              <p>      - ./api:/app</p>
              <p>    environment:</p>
              <p>      NODE_ENV: development</p>
              <p>    command: npm run dev</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">多環境操作</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p className="text-slate-400"># 開發環境（自動合併 override）</p>
            <p>docker compose up -d</p>
            <p className="text-slate-400"># 生產環境（指定設定檔）</p>
            <p>docker compose -f compose.yml -f compose.prod.yml up -d</p>
            <p className="text-slate-400"># 測試環境</p>
            <p>docker compose -f compose.yml -f compose.test.yml up -d</p>
          </div>
        </div>
      </div>
    ),
    notes: `Docker Compose 還有一個很實用的功能：覆蓋檔案（Override File）。這個功能讓你可以為不同的環境維護不同的設定，同時保持設定的可維護性。

基本思路是：有一個基礎的 compose.yml 定義通用的服務結構，然後用額外的 compose.override.yml 或 compose.prod.yml 來覆蓋特定環境的設定。

當你執行 docker compose up 的時候，Compose 預設會自動合併 compose.yml 和 compose.override.yml。這個自動合併的行為讓開發環境的配置非常方便：在 compose.override.yml 裡面設定 Bind Mount（讓程式碼即時同步）、debug 模式的環境變數、開發時的特殊指令等；而這些配置在生產環境完全不存在，因為生產環境不用 override 檔案。

對於生產環境，你可以建立一個 compose.prod.yml，然後用 -f 明確指定要合併的檔案：docker compose -f compose.yml -f compose.prod.yml up -d。生產環境的 compose.prod.yml 可能包含資源限制、restart 策略、生產環境的 Image tag 等設定。

這種模式的好處是：基礎的 compose.yml 可以提交到 Git，不同環境的 override 檔案也可以提交（但不要把含有生產密碼的 env_file 提交，只提交範本）。這樣整個環境的設定都有版本控制，非常容易追蹤和管理。

在大型專案中，這種多檔案的 Compose 策略非常常見。剛才我說的 depends_on 和 healthcheck 配合使用的技巧，也是在多環境中確保服務啟動順序正確的重要方法。大家在實際工作中遇到需要管理多個環境的情況，可以考慮使用這個模式。`,
    duration: "10"
  },
  {
    title: "課程總結：今日所學",
    subtitle: "從 Volume 到 Compose，完整的容器技能樹",
    section: "課程總結",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">✅ Volume 深入管理</p>
              <p className="text-slate-400 text-xs mt-1">Named Volume 生命週期、MySQL 持久化、tar/mysqldump 備份策略</p>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">✅ Dockerfile 完整語法</p>
              <p className="text-slate-400 text-xs mt-1">FROM/RUN/COPY/ADD/WORKDIR/ENV/EXPOSE/CMD/ENTRYPOINT，Layer 快取設計</p>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">✅ Image 建構與最佳化</p>
              <p className="text-slate-400 text-xs mt-1">docker build、BuildKit、Alpine、多階段建構、.dockerignore</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm">✅ Docker Compose</p>
              <p className="text-slate-400 text-xs mt-1">YAML 語法、services/networks/volumes、常用指令、多環境管理</p>
            </div>
            <div className="bg-blue-900/40 border border-blue-700 p-3 rounded-lg">
              <p className="text-k8s-blue font-semibold text-sm">🚀 明日預告：Kubernetes！</p>
              <ul className="text-slate-400 text-xs mt-1 space-y-1">
                <li>• 為什麼需要 Kubernetes？</li>
                <li>• K8s 架構：Node、Pod、Deployment</li>
                <li>• kubectl 基本操作</li>
                <li>• Service 與外部流量</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center text-sm text-slate-400">
          🎉 恭喜完成 Docker 進階！你現在有能力建構、最佳化、部署容器化應用程式
        </div>
      </div>
    ),
    notes: `好，今天下午的課程來到了尾聲，讓我幫大家做一個完整的總結，整理一下今天所學的所有知識點。

今天下午我們涵蓋了四個大主題。首先是 Volume 的深入管理。我們學了 Named Volume 的完整生命週期：建立（docker volume create 或 -v 自動建立）、使用（-v 卷名:/容器路徑）、查看（docker volume ls、docker volume inspect）、刪除（docker volume rm、docker volume prune）。我們也做了 MySQL 持久化的實作，驗證了容器刪除之後資料仍然保留的效果。還有備份和還原的方法：對於資料庫推薦用 mysqldump 做邏輯備份，對於一般 Volume 可以用臨時容器加 tar 備份。

第二個主題是 Dockerfile 撰寫。我們學了所有重要的 Dockerfile 指令：FROM（選基礎映像）、RUN（執行指令，注意合併減少 Layer）、COPY/ADD（複製檔案，推薦用 COPY）、WORKDIR（設定工作目錄）、ENV（設定環境變數）、ARG（建構時的參數）、EXPOSE（宣告埠號文件）、CMD 和 ENTRYPOINT（容器啟動指令，記住 exec 格式）。還學了 Layer 快取的最佳化技巧：把不常變動的步驟放前面，頻繁變動的放後面。

第三個主題是 Image 建構與最佳化。docker build 的各種選項、BuildKit 的優勢和啟用方法、Alpine 輕量基礎映像的特點和使用注意事項、多階段建構的思路和實作（把建構環境和執行環境分開，大幅縮小 Image 大小），以及 .dockerignore 的重要性（速度和安全性）。

最後是 Docker Compose，這個是今天最實用的主題。compose.yml 的結構和語法、services/networks/volumes 的定義、各種常用指令（up、down、logs、ps、exec）、healthcheck 的重要性，以及多環境管理的覆蓋檔案模式。

這些技能加上今天上午學的容器生命週期、網路、埠號映射、環境變數等知識，你們現在具備了在生產環境部署和管理容器化應用程式的完整能力。明天我們要進入 Kubernetes，這是在更大規模下管理容器的系統，是現代雲端基礎設施的核心技術。今天的 Dockerfile 和 Compose 知識是進入 Kubernetes 世界的重要基礎。大家今天辛苦了，給自己一個掌聲！`,
    duration: "15"
  },
  {
    title: "Q&A 與明日預告",
    subtitle: "問題解答 · Kubernetes 的世界等著你",
    section: "Q&A",
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-5 rounded-lg">
          <p className="text-k8s-blue font-semibold text-lg mb-4">明日 Kubernetes 課程預告</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <p className="text-k8s-blue font-semibold">上午場</p>
                <ul className="text-slate-300 text-xs mt-1 space-y-1">
                  <li>• 為什麼 Docker 不夠？</li>
                  <li>• K8s 架構：Control Plane / Worker Node</li>
                  <li>• Pod、Deployment、ReplicaSet</li>
                  <li>• kubectl 基本操作</li>
                </ul>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-green-900/30 p-3 rounded-lg">
                <p className="text-green-400 font-semibold">下午場</p>
                <ul className="text-slate-300 text-xs mt-1 space-y-1">
                  <li>• Service：ClusterIP / NodePort / LoadBalancer</li>
                  <li>• ConfigMap 與 Secret</li>
                  <li>• PersistentVolume / PVC</li>
                  <li>• 實作：部署完整應用程式</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">📝 今晚作業（自願）</p>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>1. 為你的一個現有專案撰寫 Dockerfile</li>
            <li>2. 用 docker compose 建立 nginx + mysql 環境</li>
            <li>3. 試試多階段建構，比較 Image 大小</li>
          </ul>
        </div>
        <div className="text-center text-slate-400 text-sm">
          💬 有任何問題，現在或明早都可以問！
        </div>
      </div>
    ),
    notes: `好，最後是 Q&A 時間。今天學了很多東西，大家一定有很多問題，現在是提問的好時機。不要怕問問題，沒有笨問題，只有沒問出來的問題。

在你們思考問題的同時，讓我給大家說一下今晚可以嘗試的作業（完全自願）。第一，為你自己的一個現有專案（不管是什麼語言）撰寫一個 Dockerfile，試著把它容器化。遇到問題的時候，Google 和 Docker 官方文件都是你的好朋友。第二，建立一個包含 nginx 和 MySQL 的 docker-compose.yml，在本機跑起來。第三，如果你覺得有挑戰性，試試多階段建構，然後用 docker images 查看建構前後的 Image 大小差異。

關於明天的課程，我想先給大家一個心理準備：Kubernetes 是一個學習曲線比較陡峭的系統，概念很多，指令也很多。但是，有了今天的 Docker 基礎，你們會比那些直接學 Kubernetes 的人有更紮實的基礎。在 Kubernetes 裡面，每個服務都是一個容器，容器之間的通訊、Volume 的持久化、環境變數的設定，這些概念跟 Docker 是一樣的，只是在更大的規模下用 Kubernetes 來管理。所以今天學的這些，明天全部都會用到。

明天上午我們會先說明為什麼在真正的生產環境，光有 Docker Compose 是不夠的，以及 Kubernetes 是如何解決這些問題的。然後我們會學習 K8s 的基本架構和 kubectl 的使用。下午則是更多的實作，部署一個完整的應用程式。

有任何問題，現在提出來，或者明早我來之前都可以問我。今天大家學習了很多，非常努力，給自己一個掌聲！明天見！`,
    duration: "10"
  },
]
