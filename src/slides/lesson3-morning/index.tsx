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
    title: "容器進階操作",
    subtitle: "Day 3 上午場 · 09:00–12:00",
    section: "開場回顧",
    content: (
      <div className="space-y-6">
        <p className="text-2xl text-center text-slate-300 font-light">今天，我們把容器玩得更深！</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
            <p className="text-k8s-blue font-semibold mb-3">📋 上午課程大綱</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>① 容器生命週期管理</li>
              <li>② 容器間網路通訊</li>
              <li>③ 埠號映射進階技巧</li>
              <li>④ Volume 掛載基礎</li>
              <li>⑤ 環境變數配置</li>
              <li>⑥ 資源限制與監控</li>
              <li>⑦ 多容器協作實作</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
            <p className="text-green-400 font-semibold mb-3">🎯 今日學習目標</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>能管理容器完整生命週期</li>
              <li>能建立容器私有網路</li>
              <li>能正確配置埠號映射</li>
              <li>能使用 Volume 持久化資料</li>
              <li>能透過環境變數設定容器</li>
              <li>能限制並監控容器資源</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-slate-400 text-sm">
          ⏱️ 09:00–12:00（含 15 分鐘休息）
        </div>
      </div>
    ),
    notes: `早安各位！歡迎來到第三天的課程。很高興看到大家今天精神都還不錯，希望昨晚有好好休息，因為今天的課程內容非常豐富，我們要把容器的操作技巧提升到一個全新的層次。

首先讓我問大家一個問題：昨天下課之後，有沒有人回家自己試著跑了一些 Docker 指令？有的話舉個手讓我看看。很好！不管有沒有試，這種自己動手嘗試的精神都非常重要。容器技術這種東西，光聽老師講、光看投影片是沒辦法真正學會的，一定要自己動手做、踩過一些坑，才能把知識真正內化。

好，讓我們簡單複習一下昨天的重點。昨天我們學了 Docker 的基本概念，知道了什麼是 Image，什麼是 Container，以及如何用 docker run、docker ps、docker stop 等基本指令來操作容器。我們也學了如何查看容器的日誌，如何進入容器的內部執行指令。相信大家對這些基本操作已經有了感覺。

今天上午，我們要在昨天的基礎上繼續往前走。首先，我們會深入了解容器的生命週期，也就是一個容器從創建到被刪除，中間到底會經歷哪些狀態，以及我們可以用什麼指令來控制這些狀態的轉換。這個概念非常重要，在實際工作中，當容器出現問題時，你需要知道它處於什麼狀態，才能採取正確的處理方式。

接著我們會學習容器間的網路通訊。這是一個讓很多初學者困惑的主題。想像你在部署一個 Web 應用程式，前端需要跟後端溝通，後端需要存取資料庫，這些服務都部署在不同的容器裡，它們之間要怎麼互相連線？這就是我們今天要解決的問題。

然後是埠號映射的進階技巧，把容器內部的服務暴露到外部網路。這個概念看似簡單，但裡面有很多細節值得好好理解。接下來是 Volume 掛載，解決容器資料不持久化的問題。當容器被刪除之後，容器裡面的資料預設會跟著消失，這對資料庫這類需要持久保存資料的應用程式是個大問題，Volume 就是解決方案。

休息之後，我們會繼續學習環境變數的使用、如何限制容器的資源消耗，以及最後的多容器協作實作，把今天學的所有東西串起來。課程安排很緊湊，但每一個主題都是非常實用的技能。讓我們一起加油，開始今天的課程！`,
    duration: "10"
  },
  {
    title: "昨日回顧：Docker 基本指令",
    subtitle: "快速複習，確認大家在同一起跑線",
    section: "開場回顧",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Image 操作</p>
            <div className="space-y-1 font-mono text-sm text-green-400">
              <p>docker pull nginx:latest</p>
              <p>docker images</p>
              <p>docker rmi nginx:latest</p>
              <p>docker image prune</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">Container 操作</p>
            <div className="space-y-1 font-mono text-sm text-green-400">
              <p>docker run -d --name web nginx</p>
              <p>docker ps -a</p>
              <p>docker stop web</p>
              <p>docker rm web</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">互動與除錯指令</p>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm text-green-400">
            <p>docker exec -it web bash</p>
            <p>docker logs -f web</p>
            <p>docker inspect web</p>
            <p>docker cp file.txt web:/tmp/</p>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm">
          <span className="text-red-400 font-semibold">⚠️ 常見錯誤：</span>
          <span className="text-slate-300"> 停止容器要用 stop，不是直接 rm！rm 用來刪除已停止的容器。</span>
        </div>
      </div>
    ),
    notes: `好，我們來快速複習一下昨天學過的指令。這些指令大家應該都有印象，不過讓我們再過一遍，確保大家對這些基礎操作都很熟悉。

首先是 Image 相關的操作。docker pull 用來從 Docker Hub 下載 Image，就像從網路上下載軟體一樣。docker images 查看本機已有哪些 Image。docker rmi 刪除不需要的 Image，但如果有容器正在使用這個 Image，就無法直接刪除，需要先停止並刪除容器。docker image prune 是一個很方便的指令，可以一次清除所有沒有被任何容器使用的 Image，在清理磁碟空間時非常好用。

Container 操作方面，docker run -d 以背景（daemon）模式啟動容器，--name 給容器取一個好記的名稱，這樣後續操作就不需要記容器 ID。docker ps 查看正在執行的容器，加上 -a 則顯示所有容器，包含已停止的。docker stop 會送 SIGTERM 信號給容器，讓程序有機會優雅地結束，docker rm 則是徹底刪除容器。

有一個常見的錯誤要特別提醒大家：有些同學會想直接 docker rm 一個還在執行中的容器，這樣會報錯。正確的順序是先 docker stop，等容器停止之後再 docker rm。或者你也可以用 docker rm -f 強制刪除，但這樣容器就沒有機會做清理工作了，生產環境要謹慎使用。

docker exec -it 是讓你進入容器內部執行指令，-i 代表互動式，-t 代表分配一個偽終端。docker logs -f 可以即時追蹤容器的輸出，就像 Linux 的 tail -f 一樣。大家對這些有沒有問題？`,
    duration: "5"
  },
  {
    title: "Image vs Container：核心概念",
    subtitle: "食譜 vs 料理——這個比喻要記住！",
    section: "開場回顧",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-900/40 border border-blue-700 p-5 rounded-lg text-center">
            <div className="text-4xl mb-3">📖</div>
            <p className="text-k8s-blue font-bold text-xl mb-2">Image（映像檔）</p>
            <p className="text-slate-400 text-sm mb-3">就像食譜</p>
            <ul className="space-y-1 text-slate-300 text-sm text-left">
              <li>• 唯讀（Read-Only）不可修改</li>
              <li>• 可以分享到 Registry</li>
              <li>• 一份食譜建立多個容器</li>
              <li>• 由多個 Layer 疊加而成</li>
            </ul>
          </div>
          <div className="bg-green-900/40 border border-green-700 p-5 rounded-lg text-center">
            <div className="text-4xl mb-3">🍜</div>
            <p className="text-green-400 font-bold text-xl mb-2">Container（容器）</p>
            <p className="text-slate-400 text-sm mb-3">就像依食譜做出的菜</p>
            <ul className="space-y-1 text-slate-300 text-sm text-left">
              <li>• 可讀寫（Read-Write Layer）</li>
              <li>• 執行中的程序（Process）</li>
              <li>• 刪除後資料預設消失</li>
              <li>• 同一 Image 可多個並存</li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-1">🔑 關鍵觀念</p>
          <p className="text-slate-300 text-sm">容器刪除後，容器層的資料會消失！需要用 Volume 來持久化重要資料。</p>
        </div>
      </div>
    ),
    notes: `好，讓我再強調一次 Image 和 Container 的關係，因為這個概念非常基礎，但很多初學者在使用 Docker 一段時間之後還是會搞混。讓我用一個很直觀的比喻來說明。

Image 就像是一份食譜。食譜告訴你：要用哪些食材、按照什麼步驟、煮出什麼樣的菜。這份食譜本身是固定的，不會改變的，你可以把它分享給朋友，朋友也可以依照同一份食譜做出一模一樣的菜。在 Docker 的世界裡，Image 就是這樣：它是唯讀的，包含了應用程式需要的所有東西——程式碼、執行環境、函式庫、設定檔。

Container 則是你依照食譜實際做出來的那道菜。菜做好了就可以享用，但如果你把這道菜吃完了，那碗裡的東西就沒了。如果你想再吃，就要再按照食譜重新做一道。重要的是，菜吃了不見了，不代表食譜消失了——食譜還在，隨時可以再做。

這裡有一個非常重要的觀念要記住：當你刪除一個容器的時候，你在容器裡面寫入的資料也會跟著消失。就像你端出去的菜被吃掉了一樣，那些資料就永遠消失了。這對於某些應用程式來說是個大問題，比如資料庫——如果你在容器裡的 MySQL 存了資料，容器一刪，所有資料就消失了。這就是為什麼等一下我們要學 Volume 掛載。大家先把這個觀念記在心裡，等一下會很有幫助。

還有一點：從同一個 Image 可以同時運行多個容器，就像同一份食譜可以同時在多個廚房裡烹飪一樣。每個容器都是獨立的，它們互不干擾，各自有自己的讀寫層。`,
    duration: "5"
  },
  {
    title: "容器生命週期狀態",
    subtitle: "一個容器的完整一生",
    section: "容器生命週期",
    content: (
      <div className="space-y-5">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="bg-slate-700 px-4 py-2 rounded-lg text-slate-300 text-sm font-mono">Created</div>
          <span className="text-slate-400">→</span>
          <div className="bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-mono">Running</div>
          <span className="text-slate-400">→</span>
          <div className="bg-yellow-700 px-4 py-2 rounded-lg text-white text-sm font-mono">Paused</div>
          <span className="text-slate-400">↔</span>
          <div className="bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-mono">Running</div>
          <span className="text-slate-400">→</span>
          <div className="bg-orange-700 px-4 py-2 rounded-lg text-white text-sm font-mono">Stopped</div>
          <span className="text-slate-400">→</span>
          <div className="bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-mono">Deleted</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-400 font-semibold text-sm mb-1">Created</p>
            <p className="text-slate-300 text-xs">容器已建立，尚未啟動。資源已分配但程序未執行。</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-1">Running</p>
            <p className="text-slate-300 text-xs">容器正在執行中，程序正常運作，可接受請求。</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-yellow-400 font-semibold text-sm mb-1">Paused</p>
            <p className="text-slate-300 text-xs">容器暫停，程序被凍結但仍在記憶體中（SIGSTOP）。</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-orange-400 font-semibold text-sm mb-1">Stopped (Exited)</p>
            <p className="text-slate-300 text-xs">容器已停止，程序結束，但容器層資料仍保留。</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-red-400 font-semibold text-sm mb-1">Deleted</p>
            <p className="text-slate-300 text-xs">容器已刪除，所有容器層資料永久消失。</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <p className="text-purple-400 font-semibold text-sm mb-1">Restarting</p>
            <p className="text-slate-300 text-xs">容器正在重啟（--restart 策略觸發）。</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們進入第一個正式主題：容器的生命週期。理解容器的生命週期對於容器的管理和除錯非常重要，讓我仔細解釋每一個狀態的含義。

首先是 Created 狀態。當你執行 docker create 指令的時候，容器就進入了 Created 狀態。這個狀態表示容器已經被建立了，Docker 已經為它分配了必要的資源，但是容器內的程序還沒有開始執行。就像你去餐廳訂了位子，位子已經為你保留了，但是菜還沒有開始煮。

接下來是 Running 狀態，這是我們最常見的狀態。當容器內的主要程序正在執行的時候，容器就處於 Running 狀態。這個時候容器可以接受外部的請求，所有的服務都正常運作。

然後是 Paused 狀態，這個狀態比較特殊。當你執行 docker pause 的時候，容器內的所有程序會接收到 SIGSTOP 信號，程序被完全凍結，但是它們還在記憶體裡面。就像你按下暫停鍵，程序停在那一刻，等到你 docker unpause 的時候，程序繼續從中斷的地方執行。這個功能在你需要暫時停止容器又不想讓它完全關閉的時候很有用，比如你想為容器做一個快照。

Stopped（也叫 Exited）狀態表示容器已經停止了，程序已經結束。重要的是，容器停止之後，容器層的資料還保留著，你可以再次啟動這個容器（docker start），容器會從同樣的狀態繼續。這跟 Deleted 不同，Deleted 就是容器被徹底刪除了，所有資料都消失了，無法恢復。

還有一個 Restarting 狀態，這是容器在重啟過程中的瞬間狀態。當你設定了容器的重啟策略（比如 --restart always），如果容器異常退出，Docker 會自動嘗試重新啟動它，在重啟的過程中就會看到這個狀態。這在實際生產環境中非常重要，因為我們通常希望服務在崩潰後能夠自動恢復。大家到目前為止有沒有問題？`,
    duration: "10"
  },
  {
    title: "生命週期指令操作",
    subtitle: "掌握每個狀態的轉換指令",
    section: "容器生命週期",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-k8s-blue font-semibold text-sm">建立容器（不啟動）</p>
              <p className="font-mono text-green-400 text-sm mt-1">docker create --name mybox alpine sh</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-k8s-blue font-semibold text-sm">啟動已建立的容器</p>
              <p className="font-mono text-green-400 text-sm mt-1">docker start mybox</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-yellow-400 font-semibold text-sm">暫停 / 恢復</p>
              <p className="font-mono text-green-400 text-sm mt-1">docker pause mybox</p>
              <p className="font-mono text-green-400 text-sm">docker unpause mybox</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-orange-400 font-semibold text-sm">優雅停止（SIGTERM）</p>
              <p className="font-mono text-green-400 text-sm mt-1">docker stop mybox</p>
              <p className="text-slate-400 text-xs mt-1">等待 10 秒後強制終止</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-red-400 font-semibold text-sm">強制終止（SIGKILL）</p>
              <p className="font-mono text-green-400 text-sm mt-1">docker kill mybox</p>
              <p className="text-slate-400 text-xs mt-1">立即終止，不等待清理</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-red-400 font-semibold text-sm">刪除容器</p>
              <p className="font-mono text-green-400 text-sm mt-1">docker rm mybox</p>
              <p className="font-mono text-green-400 text-sm">docker rm -f mybox</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg text-sm">
          <span className="text-k8s-blue font-semibold">💡 重啟策略：</span>
          <span className="font-mono text-slate-300"> docker run --restart=always / on-failure / unless-stopped</span>
        </div>
      </div>
    ),
    code: `# 完整生命週期示範
docker create --name demo alpine echo "Hello"
docker ps -a                          # 狀態: Created

docker start demo
docker ps                             # 狀態: Running

docker pause demo
docker ps                             # 狀態: Paused

docker unpause demo
docker stop demo                      # 送 SIGTERM
docker ps -a                          # 狀態: Exited

docker start demo                     # 重新啟動
docker kill demo                      # 強制終止

docker rm demo                        # 永久刪除

# 重啟策略
docker run -d --restart=always --name web nginx
docker run -d --restart=on-failure:3 --name app myapp`,
    notes: `好，現在我們來看看如何用指令來控制容器的生命週期狀態轉換。這些指令在日常工作中都非常常用，一定要掌握清楚。

第一個是 docker create。這個指令只建立容器，不啟動它。你可能會問，這有什麼用？其實在某些情況下很有用，比如你想先準備好容器的配置，但還不打算立刻啟動。或者在 CI/CD 流程中，你可能會先 create 容器，做一些設定之後，再 start。

然後是 docker start，把已經建立但停止的容器重新啟動。注意，docker start 和 docker run 是不一樣的：docker run 是建立一個全新的容器，docker start 是重新啟動一個已存在的容器。

docker pause 和 docker unpause 這組指令很有趣。pause 會讓容器的所有程序接收 SIGSTOP 信號，程序被暫停在當前的執行狀態，記憶體不釋放。unpause 則讓程序繼續執行。這個功能最常見的使用場景是在做容器快照或備份的時候，暫時把容器凍結，確保資料一致性，做完之後再繼續。

接下來是 docker stop 和 docker kill，這兩個都是停止容器，但方式不同。docker stop 會先送一個 SIGTERM 信號給容器的主程序，給程序一個機會優雅地結束，比如關閉資料庫連接、寫入緩衝區資料等等。如果在 10 秒內程序沒有結束，Docker 會自動發送 SIGKILL 強制殺掉。docker kill 則是直接發送 SIGKILL，立即強制終止，程序沒有任何機會做清理工作。在生產環境，我們應該儘量用 docker stop，給程序機會優雅地關閉。

最後要說一下重啟策略。在生產環境，我們通常希望容器在崩潰後能夠自動重啟，這就是 --restart 選項的用途。常用的值有：always（永遠重啟，即使是手動停止的也會重啟）、on-failure（只在非正常退出時重啟，可以加冒號指定最大重試次數）、unless-stopped（除非手動停止，否則永遠重啟）。對於生產環境的服務，我通常推薦使用 unless-stopped 或 always。大家來試試看，我們一起實際執行這些指令。`,
    duration: "10"
  },
  {
    title: "Docker 網路基礎",
    subtitle: "容器預設為何無法互相溝通？",
    section: "容器間通訊",
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold mb-2">bridge</p>
            <p className="text-slate-400 text-xs">預設網路，容器在同一 bridge 可互連（需 IP 或自訂 DNS）</p>
            <div className="mt-2 font-mono text-xs text-green-400">172.17.0.0/16</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold mb-2">host</p>
            <p className="text-slate-400 text-xs">容器直接使用主機網路，沒有隔離，效能最好</p>
            <div className="mt-2 font-mono text-xs text-yellow-400">無 NAT，使用主機 IP</div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <p className="text-k8s-blue font-semibold mb-2">none</p>
            <p className="text-slate-400 text-xs">完全隔離，沒有網路介面（除 loopback）</p>
            <div className="mt-2 font-mono text-xs text-red-400">完全離線</div>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">⚠️ 預設 bridge 的限制</p>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>• 預設 bridge 網路的容器只能用 IP 互連，沒有 DNS 解析</li>
            <li>• 自訂 bridge 網路才有自動 DNS（用容器名稱直接解析）</li>
            <li>• 這是新手最常踩的坑之一！</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="font-mono text-sm text-green-400">docker network ls   # 列出所有網路</p>
          <p className="font-mono text-sm text-green-400">docker network inspect bridge   # 查看詳細資訊</p>
        </div>
      </div>
    ),
    notes: `好，現在我們進入容器間通訊這個主題，這是讓很多初學者感到困惑的地方，讓我好好解釋清楚。

首先要理解的是，Docker 在安裝的時候會建立三個預設網路：bridge、host、none。

bridge 是最常用的，也是預設的。當你 docker run 一個容器而沒有指定 --network 選項的時候，容器就會被放在這個預設的 bridge 網路裡面。在 Linux 上，Docker 會建立一個叫做 docker0 的虛擬網路介面，然後每個容器都會透過一個虛擬網路線連接到這個 docker0 上。這個網路的 IP 段預設是 172.17.0.0/16。在這個預設 bridge 網路裡面，容器之間是可以互相溝通的，但是只能用 IP 位址，而且 IP 位址每次啟動可能不同，這樣用起來很不方便。

host 模式是讓容器直接使用主機的網路，完全沒有網路隔離。這樣做的好處是網路效能最好，因為沒有 NAT 轉換的開銷。但缺點是失去了隔離性，容器的埠號直接佔用主機的埠號，如果容器監聽 80 埠，主機的 80 埠就被佔用了。這個模式在 Linux 上效果很好，但在 Mac 和 Windows 上因為 Docker 是跑在 VM 裡面，所以這個模式的行為不太一樣。

none 就是完全沒有網路，容器只有 loopback 介面，完全與外界隔離。這個模式通常用在安全性要求很高的場景，或者你有自訂的網路設定需求。

現在重點來了：預設 bridge 網路有一個很重要的限制——沒有 DNS 解析。這是初學者最常踩的坑。如果你在預設 bridge 網路裡放了兩個容器，它們要互相溝通，你必須知道對方的 IP 位址，而且這個 IP 位址每次重新啟動都可能不同，這樣維護起來非常痛苦。解決方案是使用自訂的 bridge 網路。在自訂 bridge 網路裡，Docker 會自動提供 DNS 解析，容器可以用容器名稱直接互相訪問。這個功能非常方便，是實際工作中非常重要的知識點。等一下我們就來實際操作這個部分。`,
    duration: "10"
  },
  {
    title: "建立自訂 Docker 網路",
    subtitle: "docker network create——自動 DNS 的關鍵",
    section: "容器間通訊",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-k8s-blue font-semibold text-sm mb-2">建立自訂網路</p>
              <div className="font-mono text-sm text-green-400 space-y-1">
                <p>docker network create mynet</p>
                <p className="text-slate-400"># 預設使用 bridge driver</p>
                <p>docker network create \</p>
                <p>  --driver bridge \</p>
                <p>  --subnet 10.10.0.0/24 \</p>
                <p>  mynet</p>
              </div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-k8s-blue font-semibold text-sm mb-2">容器加入網路</p>
              <div className="font-mono text-sm text-green-400 space-y-1">
                <p>docker run -d \</p>
                <p>  --name web \</p>
                <p>  --network mynet \</p>
                <p>  nginx</p>
                <p>docker network connect \</p>
                <p>  mynet existing-container</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-k8s-blue font-semibold text-sm mb-2">管理網路</p>
              <div className="font-mono text-sm text-green-400 space-y-1">
                <p>docker network ls</p>
                <p>docker network inspect mynet</p>
                <p>docker network disconnect \</p>
                <p>  mynet web</p>
                <p>docker network rm mynet</p>
                <p>docker network prune</p>
              </div>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ 自訂網路的優勢</p>
              <ul className="text-slate-300 text-xs space-y-1">
                <li>• 自動 DNS：用容器名稱互訪</li>
                <li>• 更好的隔離性</li>
                <li>• 可動態連接/斷開</li>
                <li>• 可設定自訂子網段</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來學習如何建立自訂的 Docker 網路。這個知識非常重要，是實際工作中組織多個容器的基礎。

建立自訂網路的指令是 docker network create，後面跟著你想要的網路名稱。最簡單的用法就是直接 docker network create mynet，Docker 會用預設的 bridge driver 幫你建立一個網路，並自動分配一個子網段，通常是 172.x.0.0/16 範圍的某個段。

如果你想更精確地控制網路設定，可以加上參數。--driver 指定使用的網路驅動，常用的是 bridge；--subnet 指定子網段，比如 10.10.0.0/24；--gateway 指定閘道位址。在大多數情況下，預設設定已經夠用了，不需要手動指定這些參數。

建立網路之後，你可以在啟動容器的時候用 --network 選項把容器加入這個網路，也可以用 docker network connect 把一個已經在執行中的容器連接到另一個網路。這個功能很有用，比如你有一個容器需要同時在兩個網路裡面，你可以讓它連接到兩個不同的網路。

docker network inspect 是一個很有用的除錯指令。它會顯示這個網路的詳細資訊，包含哪些容器在這個網路裡面、每個容器的 IP 位址是什麼、子網段是多少等等。當容器無法互相溝通的時候，這個指令是你的好朋友，可以幫你確認容器是否都在同一個網路裡面。

最後，docker network rm 可以刪除一個不再需要的網路，但如果有容器還連接在這個網路上，是無法刪除的，需要先把容器停止或者從網路上斷開。docker network prune 則是一次清除所有沒有被任何容器使用的網路，在清理環境的時候很方便。

大家注意，這裡有一個很重要的實踐建議：在你的工作中，每個獨立的應用程式群組都應該放在自己的自訂網路裡面，不要把所有容器都丟在預設的 bridge 網路。這樣做可以提高安全性和可維護性，也可以讓容器用名稱互相訪問而不是用 IP。`,
    duration: "10"
  },
  {
    title: "容器間 DNS 解析實作",
    subtitle: "用名稱互相溝通，不再用 IP！",
    section: "容器間通訊",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">實作步驟：兩容器互 ping</p>
          <div className="font-mono text-sm space-y-1 text-green-400">
            <p className="text-slate-400"># 1. 建立自訂網路</p>
            <p>docker network create lab-net</p>
            <p className="text-slate-400 mt-2"># 2. 啟動兩個容器，加入同一網路</p>
            <p>docker run -d --name server1 --network lab-net alpine sleep 3600</p>
            <p>docker run -d --name server2 --network lab-net alpine sleep 3600</p>
            <p className="text-slate-400 mt-2"># 3. 從 server1 用名稱 ping server2</p>
            <p>docker exec server1 ping -c 3 server2</p>
            <p className="text-slate-400 mt-2"># 4. 用 nslookup 驗證 DNS</p>
            <p>docker exec server1 nslookup server2</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
            <p className="text-green-400 font-semibold text-sm">✅ 自訂網路</p>
            <p className="text-slate-300 text-xs mt-1">server1 可以 ping server2（自動 DNS）</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg">
            <p className="text-red-400 font-semibold text-sm">❌ 預設 bridge</p>
            <p className="text-slate-300 text-xs mt-1">無 DNS，只能用 IP 位址互訪</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們來做個實際操作，驗證自訂網路的 DNS 解析功能。我現在就在終端機上跑這些指令，大家跟著一起做。

首先，docker network create lab-net 建立一個叫做 lab-net 的自訂網路。然後啟動兩個容器，都使用 alpine 映像（alpine 是一個非常輕量的 Linux，只有幾 MB，很適合用來做測試），都加入 lab-net 網路，讓它們各自 sleep 3600 秒保持執行狀態。

接著執行 docker exec server1 ping -c 3 server2，從 server1 容器裡面用名稱 server2 去 ping 第二個容器。如果成功的話，你會看到 ping 通了，而且它是用名稱找到 server2 的 IP 的，這就是 DNS 在起作用。

如果你用 nslookup 查詢，你可以看到 Docker 內建的 DNS 伺服器（通常是 127.0.0.11 這個地址）回應了查詢，解析出 server2 對應的 IP 位址。

這個功能在實際工作中非常重要。想像你有一個後端服務需要連接資料庫，你可以在程式碼或設定檔裡寫資料庫的主機名稱為 db 或 mysql，然後把資料庫容器命名為 db 或 mysql，它們放在同一個自訂網路裡面，後端就可以直接用名稱連接了。這樣比寫死 IP 位址靈活得多，也更容易維護。`,
    duration: "5"
  },
  {
    title: "埠號映射語法詳解",
    subtitle: "-p 的各種用法，你真的懂嗎？",
    section: "埠號映射進階",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">-p 語法完整格式</p>
          <p className="font-mono text-2xl text-center text-yellow-400 my-4">
            [主機IP:]主機PORT:容器PORT[/協定]
          </p>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-start gap-3">
              <span className="text-green-400 w-52">-p 8080:80</span>
              <span className="text-slate-400">所有介面的 8080 → 容器 80</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 w-52">-p 127.0.0.1:8080:80</span>
              <span className="text-slate-400">只綁定 localhost，外部無法訪問</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 w-52">-p 80:80/tcp</span>
              <span className="text-slate-400">明確指定 TCP 協定（預設）</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 w-52">-p 5353:53/udp</span>
              <span className="text-slate-400">UDP 協定映射（DNS 服務）</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 w-52">-p 80:80 -p 443:443</span>
              <span className="text-slate-400">同時映射多個埠號</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">自動分配埠號（-P 大寫）</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p>docker run -d -P nginx         # Docker 自動分配主機埠</p>
            <p>docker port my-nginx            # 查看映射關係</p>
            <p>docker ps                       # PORTS 欄位顯示映射</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，現在我們來深入講解埠號映射。這個概念乍看很簡單，但裡面有很多細節，如果不理解清楚，有時候服務開了卻訪問不到，或者有安全隱患，你都不知道問題出在哪裡。

-p 選項的完整語法是：[主機IP:]主機PORT:容器PORT[/協定]。讓我一個個解釋這些部分。

最簡單的用法是 -p 8080:80，意思是把主機的 8080 埠映射到容器的 80 埠。任何訪問主機 8080 埠的請求，都會被轉發到容器的 80 埠。這裡的「主機」指的是跑 Docker 的那台機器。

加上主機 IP 的版本，比如 -p 127.0.0.1:8080:80，意思是只在 localhost（回環介面）上監聽 8080 埠。這樣的話，只有在同一台機器上才能訪問這個服務，外部網路無法直接訪問。這在安全性上很有用，比如你有一個管理介面，你不希望外部能直接訪問，就可以只綁定在 127.0.0.1 上。如果不指定主機 IP，預設是 0.0.0.0，也就是監聽所有網路介面，外部可以訪問。

關於協定，預設是 TCP。如果你的服務用 UDP，比如 DNS 服務用 53 埠 UDP，你需要明確加上 /udp，像這樣：-p 5353:53/udp。

-P（大寫的 P）是自動分配埠號的功能。Docker 會讀取 Dockerfile 裡面 EXPOSE 宣告的埠號，然後在主機上隨機選一個未被使用的高位埠（通常是 32768 到 60999 的範圍）來映射。這個功能在你不在乎主機埠號是多少的時候很方便，比如在 CI 環境或者測試環境。用 docker port 指令可以查看這個隨機分配的埠號是多少。

有一個常見的問題：我啟動了容器，也設定了 -p 80:80，但是從外部還是訪問不到。這時候要排查幾個地方：首先，主機的防火牆有沒有允許這個埠？在 Linux 上可能是 iptables 或 ufw 的問題。其次，在雲端環境（AWS、GCP、Azure），安全組或防火牆規則有沒有開放這個埠？這些都是常見的坑，大家要注意。`,
    duration: "10"
  },
  {
    title: "埠號映射進階技巧",
    subtitle: "docker port、範圍映射與最佳實踐",
    section: "埠號映射進階",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">查看映射資訊</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker port my-nginx</p>
              <p>docker port my-nginx 80</p>
              <p>docker port my-nginx 80/tcp</p>
              <p className="text-slate-400 mt-2">輸出範例：</p>
              <p className="text-yellow-400">80/tcp -{">"} 0.0.0.0:8080</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">埠號範圍映射</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker run -d \</p>
              <p>  -p 8000-8010:8000-8010 \</p>
              <p>  myapp</p>
              <p className="text-slate-400 mt-2"># 一次映射多個連續埠</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold mb-2">EXPOSE vs -p 的差異</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400 mb-1">EXPOSE（Dockerfile）</p>
              <p className="text-slate-300">只是文件說明，聲明容器打算使用的埠號，不實際開放給主機</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">-p（docker run）</p>
              <p className="text-slate-300">實際建立埠號映射規則，讓主機可以訪問容器服務</p>
            </div>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm">
          <span className="text-red-400 font-semibold">❌ 常見誤解：</span>
          <span className="text-slate-300"> 在 Dockerfile 加了 EXPOSE 並不會讓服務對外開放，還是需要 -p 才行！</span>
        </div>
      </div>
    ),
    notes: `很多人在學了基本的 -p 語法之後，對一些進階細節還是不清楚，今天我要把這些細節都說清楚。

首先是 docker port 指令。這個指令用來查看一個容器的埠號映射情況。你可以 docker port 加上容器名稱，就會列出所有的映射關係。你也可以加上具體的容器埠號，比如 docker port my-nginx 80，這樣就只查看容器 80 埠的映射情況。輸出會是類似 80/tcp -{">"} 0.0.0.0:8080 這樣的格式，意思是容器的 80/tcp 埠被映射到了主機所有介面的 8080 埠。

關於埠號範圍映射，如果你的應用程式需要用到一系列連續的埠號，可以用範圍格式：-p 8000-8010:8000-8010。這樣就會一次建立 11 個映射規則。不過要注意，主機端的範圍和容器端的範圍必須一樣長，不能映射不等長的範圍。

現在說一個很重要的觀念：EXPOSE 和 -p 的區別。很多初學者會以為在 Dockerfile 裡面加了 EXPOSE 80，這個服務就對外開放了，這是個很常見的誤解！

EXPOSE 在 Dockerfile 裡面只是一個文件聲明，它的作用是告訴使用這個 Image 的人，這個容器設計上會用到哪些埠號。它不會實際開放任何埠號，也不會建立任何映射規則。你可以把它想成是一個標記：「嘿，這個應用程式打算用 80 埠，如果你要把它暴露出來，記得映射這個埠號。」

真正讓服務對外開放的是 docker run 的時候加 -p 選項。所以，即使 Dockerfile 裡面沒有 EXPOSE，你用 -p 也可以映射任何埠號。而即使 Dockerfile 裡面有 EXPOSE，不加 -p 的話外部還是訪問不到。EXPOSE 的存在主要是為了讓 -P（自動映射）知道要映射哪些埠，以及作為文件說明。這個細節理解清楚了，以後看別人的 Dockerfile 也會更容易理解設計意圖。`,
    duration: "10"
  },
  {
    title: "為什麼需要 Volume？",
    subtitle: "容器資料不持久化的問題",
    section: "Volume 掛載基礎",
    content: (
      <div className="space-y-5">
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400 font-semibold text-lg mb-2">🚨 問題場景</p>
          <div className="font-mono text-sm text-slate-300 space-y-1">
            <p>docker run -d --name db mysql:8</p>
            <p>{'# 存入大量資料...'}</p>
            <p>docker rm -f db        <span className="text-red-400">← 刪掉容器</span></p>
            <p>docker run -d --name db mysql:8</p>
            <p className="text-red-400">{'# 所有資料都消失了！！！'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-semibold mb-2">容器層（讀寫層）</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 容器刪除時一併消失</li>
              <li>• 每個容器各自獨立</li>
              <li>• 無法在容器間共享</li>
              <li>• 適合暫時性資料</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-semibold mb-2">Volume（持久化）</p>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 容器刪除後資料保留</li>
              <li>• 可多個容器共享</li>
              <li>• 易於備份與遷移</li>
              <li>• 適合重要資料</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
          <p className="text-slate-400 text-sm">需要 Volume 的場景：資料庫、日誌檔案、上傳的檔案、設定檔</p>
        </div>
      </div>
    ),
    notes: `好，現在我們來解決容器世界裡面一個非常重要的問題：資料持久化。讓我先問大家一個問題：如果你在一個容器裡面的 MySQL 資料庫存了很多重要資料，然後這個容器因為某些原因（崩潰、更新、誤操作）被刪除了，這些資料還在嗎？答案是不在了，全部消失了。這就是我們現在要解決的問題。

為什麼容器刪除之後資料就消失了？這要從 Docker 的 Union File System 說起。Docker 的 Image 是由多個唯讀的 Layer 疊加而成的。當你啟動一個容器的時候，Docker 會在這些唯讀的 Layer 上面再加一個讀寫的 Layer，叫做容器層（Container Layer）。你在容器裡面做的所有寫入操作，比如安裝軟體、修改檔案、存入資料，都是寫在這個容器層上的。

當你 docker rm 容器的時候，這個容器層就被完全刪除了。因此，所有的資料都跟著消失。這就是為什麼我說容器是「無狀態」的，因為它的狀態（資料）預設是不持久的。

這個特性在某些場景下是優點——容器可以輕鬆地被刪除和重建，不留任何痕跡。但對於需要保存資料的應用程式（最典型的就是資料庫），這就是個大問題了。

解決方案就是 Volume（卷）。Volume 是一個在 Docker 管理下的持久化儲存機制。它的資料存在主機的某個目錄下（由 Docker 管理），不隨容器的刪除而消失。你可以把同一個 Volume 掛載到多個容器，讓它們共享資料。Volume 也很容易備份和遷移。

需要使用 Volume 的場景主要有：資料庫的資料目錄、應用程式的日誌檔案、使用者上傳的檔案、應用程式的設定檔、以及任何需要在容器重建後保留的資料。等一下我們會來看看 Volume 的三種類型，以及如何在實際工作中使用它們。`,
    duration: "10"
  },
  {
    title: "三種掛載類型比較",
    subtitle: "Bind Mount、Named Volume、tmpfs",
    section: "Volume 掛載基礎",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-sm mb-2">Bind Mount</p>
            <p className="text-slate-400 text-xs mb-2">掛載主機目錄/檔案</p>
            <div className="font-mono text-xs text-green-400 mb-2">
              -v /host/path:/container/path
            </div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ 開發時即時同步</li>
              <li>✅ 直接存取主機檔案</li>
              <li>❌ 路徑依賴主機結構</li>
              <li>❌ 可移植性差</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-bold text-sm mb-2">Named Volume</p>
            <p className="text-slate-400 text-xs mb-2">Docker 管理的 Volume</p>
            <div className="font-mono text-xs text-green-400 mb-2">
              -v myvolume:/container/path
            </div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ 生產環境推薦</li>
              <li>✅ 跨平台可移植</li>
              <li>✅ 易於備份管理</li>
              <li>❌ 不易直接修改</li>
            </ul>
          </div>
          <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
            <p className="text-purple-400 font-bold text-sm mb-2">tmpfs Mount</p>
            <p className="text-slate-400 text-xs mb-2">儲存在記憶體中</p>
            <div className="font-mono text-xs text-green-400 mb-2">
              --tmpfs /container/path
            </div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✅ 速度最快</li>
              <li>✅ 安全（不寫磁碟）</li>
              <li>❌ 容器停止即消失</li>
              <li>❌ 僅 Linux 支援</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-center text-sm">
          <span className="text-yellow-400 font-semibold">使用建議：</span>
          <span className="text-slate-300"> 開發用 Bind Mount，生產用 Named Volume，機密暫存用 tmpfs</span>
        </div>
      </div>
    ),
    notes: `好，Volume 有三種類型，讓我一個個說清楚它們的差別和適用場景。

第一種是 Bind Mount（綁定掛載）。這是最直觀的一種，就是把主機上的一個目錄或者檔案直接掛載到容器裡面。語法是 -v /主機路徑:/容器路徑。比如 -v /home/user/myapp:/app，就是把主機上的 /home/user/myapp 目錄掛載到容器的 /app 目錄。在容器裡面對 /app 目錄的任何讀寫操作，都直接對應到主機的 /home/user/myapp 目錄。

Bind Mount 最大的優點是開發時的即時同步。你在主機上修改程式碼，容器裡面立刻就能看到最新的版本，不需要重建 Image 或重啟容器。這在本地開發的時候非常方便，是開發環境的標準配置。但它的缺點是路徑依賴主機的目錄結構，不同的主機可能有不同的目錄，可移植性比較差。另外，容器對掛載目錄有完整的讀寫權限，有一定的安全風險，需要謹慎使用。

第二種是 Named Volume（命名卷）。這是 Docker 管理的 Volume，由 Docker 決定資料存在主機的哪個目錄（通常是 /var/lib/docker/volumes/）。語法是 -v 卷名:/容器路徑，比如 -v mydata:/var/lib/mysql。Named Volume 的優點是跨平台可移植，不依賴主機的目錄結構；Docker 統一管理，易於備份和遷移；生產環境推薦使用。缺點是你不那麼容易直接存取裡面的檔案（需要透過容器或特殊指令）。

第三種是 tmpfs Mount，把資料存在記憶體裡面，而不是磁碟。這樣做的好處是速度極快，因為記憶體的讀寫速度遠超磁碟；而且資料不會寫到磁碟上，對於需要處理機密資訊的場景很有用。缺點當然是容器停止之後資料就消失了，而且這個功能只在 Linux 上有效。

總結一下使用建議：開發環境用 Bind Mount，可以即時同步程式碼；生產環境用 Named Volume，穩定可靠；需要暫存機密資料（比如 SSL 憑證的私鑰）用 tmpfs。`,
    duration: "10"
  },
  {
    title: "Bind Mount 實作",
    subtitle: "讓容器讀寫主機上的檔案",
    section: "Volume 掛載基礎",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">實作：Nginx 服務主機上的靜態檔案</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p className="text-slate-400"># 1. 在主機建立靜態網頁目錄</p>
            <p>mkdir -p ~/mywebsite</p>
            <p>{'echo "<h1>Hello from Host!</h1>" > ~/mywebsite/index.html'}</p>
            <p className="text-slate-400 mt-2"># 2. 啟動 nginx，掛載主機目錄</p>
            <p>docker run -d \</p>
            <p>  --name web \</p>
            <p>  -p 8080:80 \</p>
            <p>  -v ~/mywebsite:/usr/share/nginx/html:ro \</p>
            <p>  nginx</p>
            <p className="text-slate-400 mt-2"># 3. 修改主機檔案，立即生效</p>
            <p>{'echo "<h1>Updated!</h1>" > ~/mywebsite/index.html'}</p>
            <p>curl localhost:8080    # 立刻看到更新</p>
          </div>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 p-3 rounded-lg text-sm">
          <span className="text-yellow-400 font-semibold">💡 :ro 選項：</span>
          <span className="text-slate-300"> 加上 :ro 代表容器只能讀取，不能寫入，增加安全性</span>
        </div>
      </div>
    ),
    notes: `好，我們來做一個 Bind Mount 的實作練習。這個例子很典型，用 nginx 來服務主機上的靜態網頁，在開發前端頁面的時候非常常用。

首先，在主機上建立一個目錄來存放靜態網頁，然後建立一個簡單的 index.html。接著啟動 nginx 容器，用 -v 把主機的這個目錄掛載到容器的 /usr/share/nginx/html（這是 nginx 服務靜態檔案的預設目錄），同時用 -p 8080:80 把容器的 80 埠映射到主機的 8080。

注意我在掛載路徑後面加了 :ro，這個代表 read-only，容器只能讀取這個掛載的目錄，不能寫入。這樣做更安全，因為我們的靜態檔案只需要被讀取，不需要被容器修改。

現在，如果你在瀏覽器訪問 localhost:8080，應該可以看到 Hello from Host! 這個頁面。然後你修改主機上的 index.html 檔案，再重新整理瀏覽器，立刻就能看到新的內容！不需要重建 Image，不需要重啟容器，因為容器直接讀的是主機上的檔案。

這個效果在前端開發的時候特別有用，你可以用 VSCode 修改 HTML 或 CSS 檔案，立刻在瀏覽器看到結果。大家自己試試看，如果成功了，給我一個讚！`,
    duration: "5"
  },
  {
    title: "☕ 中場休息",
    subtitle: "15 分鐘後繼續——環境變數與資源限制",
    section: "休息",
    content: (
      <div className="space-y-6 text-center">
        <div className="text-6xl">☕</div>
        <p className="text-2xl text-slate-300">休息 15 分鐘</p>
        <div className="bg-slate-800/50 p-5 rounded-lg text-left max-w-md mx-auto">
          <p className="text-k8s-blue font-semibold mb-3">下半場預告</p>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>🔑 環境變數配置（-e / --env-file）</li>
            <li>📊 容器資源限制與監控</li>
            <li>🔧 多容器協作實作</li>
          </ul>
        </div>
        <p className="text-slate-400 text-sm">回來後，我們做一個 nginx + 靜態資源的完整實作！</p>
      </div>
    ),
    notes: "",
    duration: "15"
  },
  {
    title: "環境變數：讓容器更靈活",
    subtitle: "-e 選項與 12-Factor App 原則",
    section: "環境變數",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-1">🏗️ 12-Factor App 第三條：設定（Config）</p>
          <p className="text-slate-300">將設定與程式碼分離，透過環境變數傳入，同一份 Image 在不同環境（dev/staging/prod）行為不同</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">傳入環境變數</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker run -d \</p>
              <p>  -e MYSQL_ROOT_PASSWORD=secret \</p>
              <p>  -e MYSQL_DATABASE=mydb \</p>
              <p>  -e MYSQL_USER=appuser \</p>
              <p>  -e MYSQL_PASSWORD=pass123 \</p>
              <p>  mysql:8</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">查看環境變數</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker exec mydb env</p>
              <p>docker exec mydb \</p>
              <p>  env | grep MYSQL</p>
              <p>docker inspect mydb \</p>
              <p>  --format {'"{{'}.Env{'}}'}"</p>
            </div>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm">
          <span className="text-red-400 font-semibold">⚠️ 安全提醒：</span>
          <span className="text-slate-300"> 不要在 -e 裡面放密碼後提交到版本控制！用 --env-file 或 Docker Secrets</span>
        </div>
      </div>
    ),
    notes: `歡迎回來！希望大家休息得不錯。我們繼續下半場的課程，從環境變數開始。

環境變數是容器設定最重要的機制之一，理解這個概念能讓你的容器更靈活、更易於維護。讓我先介紹一個概念叫做 12-Factor App，這是一套開發雲原生應用程式的最佳實踐，其中第三條原則說：「設定（Config）應該透過環境（Environment）傳入，而不是寫死在程式碼裡面」。這個原則的核心思想是：同一份程式碼（同一個 Image），在不同的環境（開發環境、測試環境、生產環境）應該可以用不同的設定執行，而不需要修改程式碼。

以 MySQL 為例，這個 Image 設計上就要求你透過環境變數來設定管理員密碼、資料庫名稱、使用者名稱和密碼。你用 -e 選項傳入這些環境變數，MySQL 容器啟動的時候就會讀取這些值來進行初始化。如果你不傳 MYSQL_ROOT_PASSWORD 這個環境變數，MySQL 容器會直接拒絕啟動，並給出錯誤訊息。這就是用環境變數來強制要求設定的好例子。

在容器啟動之後，你可以用 docker exec 進入容器執行 env 指令，查看容器裡面有哪些環境變數。或者用 docker inspect 查看容器的詳細資訊，其中的 Env 欄位也會列出所有環境變數。

現在有一個非常重要的安全提醒：不要在 -e 裡面直接寫密碼，然後把這些指令提交到版本控制系統（Git）！如果你的 Git 倉庫是公開的，這樣做就等於把你的密碼公開給全世界看了。解決方案是使用 --env-file 選項，把環境變數寫在一個檔案裡面，然後把這個檔案加到 .gitignore。生產環境的最佳實踐是使用 Docker Secrets 或者 Kubernetes Secrets，等我們學到 Kubernetes 的時候再詳細介紹。`,
    duration: "10"
  },
  {
    title: "env-file 與環境變數管理",
    subtitle: "更安全、更方便的環境變數配置方式",
    section: "環境變數",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">.env 檔案格式</p>
            <div className="font-mono text-sm space-y-1">
              <p className="text-slate-400"># .env 檔案</p>
              <p className="text-green-400">MYSQL_ROOT_PASSWORD=secret</p>
              <p className="text-green-400">MYSQL_DATABASE=production</p>
              <p className="text-green-400">MYSQL_USER=appuser</p>
              <p className="text-green-400">MYSQL_PASSWORD=apppass</p>
              <p className="text-green-400">DEBUG=false</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">使用 --env-file</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker run -d \</p>
              <p>  --name db \</p>
              <p>  --env-file ./.env \</p>
              <p>  mysql:8</p>
              <p className="text-slate-400 mt-2"># .gitignore 裡面加入：</p>
              <p>.env</p>
              <p>.env.local</p>
              <p>.env.*.local</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">不同環境的設定管理</p>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-slate-300">
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-green-400 mb-1">.env.development</p>
              <p>DEBUG=true</p>
              <p>DB_HOST=localhost</p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-yellow-400 mb-1">.env.staging</p>
              <p>DEBUG=false</p>
              <p>DB_HOST=staging-db</p>
            </div>
            <div className="bg-slate-700/50 p-2 rounded">
              <p className="text-red-400 mb-1">.env.production</p>
              <p>DEBUG=false</p>
              <p>DB_HOST=prod-db</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `接著來說 --env-file 這個選項，這是管理環境變數更好的方式。

--env-file 選項讓你把所有的環境變數寫在一個檔案裡面（通常叫做 .env），然後用 --env-file 選項告訴 Docker 去讀這個檔案。.env 檔案的格式很簡單，就是 KEY=VALUE 的形式，一行一個，可以用 # 開頭的行作為注釋。

這樣做的好處很明顯：首先，你不需要在指令列上一個個 -e 傳入，當環境變數很多的時候，這樣做更方便。其次，你可以把這個 .env 檔案加到 .gitignore，這樣就不會不小心把密碼提交到 Git 了。你可以建立一個 .env.example 檔案，裡面放的是環境變數的說明和範例值（不放真實密碼），提交到 Git 供其他開發者參考。

更進階的做法是針對不同環境維護不同的 .env 檔案：.env.development 放開發環境的設定，.env.staging 放測試環境的設定，.env.production 放生產環境的設定。這些都加到 .gitignore，在不同環境使用不同的檔案。

另外，有一個指令要特別提一下：docker exec 容器名稱 env，可以查看容器裡面目前所有的環境變數。這在除錯的時候很有用，可以確認你的環境變數是否正確地傳入了容器。不過要注意，某些設定（比如密碼）會在 env 的輸出裡面明文顯示，在生產環境要謹慎使用這個指令，確保不要把輸出記錄在容易被其他人看到的地方。

最後補充一點：環境變數的命名慣例是全大寫加底線，比如 DATABASE_URL、API_KEY 等。在程式碼裡面讀取環境變數的方式，以 Node.js 為例是 process.env.DATABASE_URL，以 Python 為例是 os.environ.get('DATABASE_URL')。`,
    duration: "10"
  },
  {
    title: "容器資源限制",
    subtitle: "--memory 與 --cpus：保護主機資源",
    section: "容器資源限制",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">記憶體限制</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker run -d \</p>
              <p>  --memory 512m \</p>
              <p>  --memory-swap 1g \</p>
              <p>  --name myapp myapp:latest</p>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              <p>• --memory: 實體記憶體上限</p>
              <p>• --memory-swap: 含 swap 總上限</p>
              <p>• 超出 → OOM Killed（強制終止）</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">CPU 限制</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker run -d \</p>
              <p>  --cpus 1.5 \</p>
              <p>  --cpu-shares 512 \</p>
              <p>  --name myapp myapp:latest</p>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              <p>• --cpus: 可使用的 CPU 核心數</p>
              <p>• --cpu-shares: 相對優先權（預設1024）</p>
              <p>• 超出只是被限速，不會被殺</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-yellow-400 font-semibold text-sm mb-2">完整限制範例</p>
          <div className="font-mono text-sm text-green-400">
            <p>docker run -d \</p>
            <p>  --name production-app \</p>
            <p>  --memory 512m \</p>
            <p>  --memory-swap 512m \</p>
            <p>  --cpus 0.5 \</p>
            <p>  --restart unless-stopped \</p>
            <p>  myapp:1.0</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們來看容器的資源限制。這個功能在生產環境非常重要，如果你不限制容器的資源使用，一個設計不好的容器可能會耗盡主機的所有記憶體或 CPU，導致整台主機上的所有服務都受影響，這就是所謂的「鄰居效應」（noisy neighbor problem）。

先來看記憶體限制。--memory 選項設定容器可以使用的實體記憶體上限。你可以用 b（bytes）、k（KB）、m（MB）、g（GB）作為單位。比如 --memory 512m 就是限制容器最多使用 512MB 的實體記憶體。

--memory-swap 是記憶體和 swap（虛擬記憶體）加起來的總上限。如果你設定 --memory 512m --memory-swap 1g，就表示容器最多可以用 512MB 實體記憶體加上 512MB 的 swap。如果設定 --memory-swap 等於 --memory，就表示不允許使用 swap。如果不設定 --memory-swap，預設是 --memory 的兩倍。

當容器的記憶體使用量超過 --memory 設定的限制時，Linux 核心的 OOM（Out of Memory）Killer 會介入，強制終止容器裡面消耗最多記憶體的程序。如果你設定了 --restart always，容器會被自動重啟。這是一個需要注意的行為，在生產環境要監控 OOM 事件。

CPU 限制的行為跟記憶體不太一樣。當 CPU 使用量超過 --cpus 設定的限制時，容器不會被終止，只是會被降速（throttled），讓出 CPU 時間給其他容器或系統程序。--cpus 1.5 表示容器最多可以使用 1.5 個 CPU 核心的計算量。--cpu-shares 是相對優先權，預設值是 1024，如果你把某個容器設定為 512，就表示它在 CPU 競爭時的優先權是其他容器的一半。

在實際工作中，我建議每個容器都應該設定資源限制，特別是在多租戶環境或者共享伺服器上。合理的資源限制不僅保護了系統穩定性，也幫助你更好地規劃和管理伺服器資源。`,
    duration: "10"
  },
  {
    title: "docker stats：即時資源監控",
    subtitle: "監控容器的 CPU、記憶體、網路、I/O",
    section: "容器資源限制",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm">
          <p className="text-slate-400 mb-2">$ docker stats</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="text-left pb-1">CONTAINER ID</th>
                  <th className="text-left pb-1">NAME</th>
                  <th className="text-left pb-1">CPU %</th>
                  <th className="text-left pb-1">MEM USAGE/LIMIT</th>
                  <th className="text-left pb-1">NET I/O</th>
                </tr>
              </thead>
              <tbody className="text-green-400">
                <tr>
                  <td>a1b2c3d4e5f6</td>
                  <td>web</td>
                  <td>0.07%</td>
                  <td>12.5MB / 512MB</td>
                  <td>648B / 1.25kB</td>
                </tr>
                <tr>
                  <td>f6e5d4c3b2a1</td>
                  <td>db</td>
                  <td>0.42%</td>
                  <td>198MB / 512MB</td>
                  <td>1.2kB / 648B</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">常用選項</p>
            <div className="font-mono text-sm text-green-400 space-y-1">
              <p>docker stats               # 即時更新</p>
              <p>docker stats --no-stream   # 只顯示一次</p>
              <p>docker stats web db        # 指定容器</p>
              <p>docker top web             # 查看程序</p>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold text-sm mb-2">各欄位說明</p>
            <ul className="text-slate-300 text-xs space-y-1">
              <li><span className="text-yellow-400">CPU %：</span>使用率（多核加總）</li>
              <li><span className="text-yellow-400">MEM USAGE：</span>實際使用 / 設定上限</li>
              <li><span className="text-yellow-400">NET I/O：</span>網路送出 / 接收量</li>
              <li><span className="text-yellow-400">BLOCK I/O：</span>磁碟讀寫量</li>
              <li><span className="text-yellow-400">PIDS：</span>容器內程序數量</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `設定了資源限制之後，當然也需要能夠監控容器實際的資源使用情況。docker stats 就是這個用途，它有點像 Linux 上的 top 指令，但是專門用來監控容器。

執行 docker stats 之後，你會看到一個即時更新的表格，每秒更新一次，顯示所有正在執行的容器的資源使用情況。每一列代表一個容器，欄位有 CONTAINER ID、NAME、CPU %、MEM USAGE / LIMIT、MEM %、NET I/O、BLOCK I/O、PIDS。

CPU % 是這個容器當前使用的 CPU 資源佔全部 CPU 資源的百分比。如果你的主機有 4 個核心，理論上最大值是 400%（每個核心各 100%）。但如果你設定了 --cpus 1.5，這個值最大就只會到大約 150%。

MEM USAGE / LIMIT 很直觀，顯示目前使用了多少記憶體，以及上限是多少。如果你沒有設定 --memory，LIMIT 會顯示主機的總記憶體。

NET I/O 顯示容器的網路流量，分別是送出（TX）和接收（RX）的總量（從容器啟動開始累計）。

BLOCK I/O 顯示磁碟讀寫量，也是從啟動開始累計的。

PIDS 顯示容器裡面目前有多少個程序（process）在執行。

docker stats --no-stream 只顯示一次快照就結束，適合在腳本裡面使用，或者只想看某個時間點的狀態。docker top 指令可以查看容器裡面正在執行的程序列表，就像在容器內部執行 ps 一樣，但不需要進入容器。

這些監控工具在除錯效能問題的時候非常有用。比如，如果你的應用程式變慢了，先用 docker stats 看看是不是某個容器的記憶體或 CPU 使用率異常高。這是生產環境監控的基礎，後面學到 Kubernetes 的時候，也有類似的 kubectl top 指令。`,
    duration: "10"
  },
  {
    title: "多容器協作實作",
    subtitle: "nginx + 靜態資源：完整場景演練",
    section: "多容器協作",
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">架構設計</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="bg-slate-700 px-3 py-2 rounded text-slate-300">瀏覽器</div>
            <div className="text-slate-400">→ :8080</div>
            <div className="bg-blue-700 px-3 py-2 rounded text-white">nginx</div>
            <div className="text-slate-400">讀取</div>
            <div className="bg-green-700 px-3 py-2 rounded text-white">Volume</div>
            <div className="text-slate-400">←</div>
            <div className="bg-slate-700 px-3 py-2 rounded text-slate-300">主機檔案</div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold text-sm mb-2">完整實作指令</p>
          <div className="font-mono text-sm text-green-400 space-y-1">
            <p className="text-slate-400"># 1. 建立自訂網路</p>
            <p>docker network create webapp-net</p>
            <p className="text-slate-400 mt-1"># 2. 建立靜態內容</p>
            <p>mkdir -p ~/webapp/html ~/webapp/logs</p>
            <p>{'echo "<h1>My Docker App</h1>" > ~/webapp/html/index.html'}</p>
            <p className="text-slate-400 mt-1"># 3. 啟動 nginx（帶限制）</p>
            <p>docker run -d \</p>
            <p>  --name nginx-web \</p>
            <p>  --network webapp-net \</p>
            <p>  -p 8080:80 \</p>
            <p>  --memory 256m \</p>
            <p>  --cpus 0.5 \</p>
            <p>  -v ~/webapp/html:/usr/share/nginx/html:ro \</p>
            <p>  -v ~/webapp/logs:/var/log/nginx \</p>
            <p>  --restart unless-stopped \</p>
            <p>  nginx:alpine</p>
            <p className="text-slate-400 mt-1"># 4. 驗證</p>
            <p>docker ps && curl localhost:8080</p>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們來做一個綜合實作，把今天上午學的所有技能都用上：自訂網路、埠號映射、Volume 掛載、資源限制，還有重啟策略。

首先建立一個自訂網路 webapp-net。為什麼要建立自訂網路？因為我們設計上希望未來這個應用程式的所有容器都在同一個網路裡面，方便相互溝通。

接著在主機上建立兩個目錄：html 用來存放靜態網頁，logs 用來存放 nginx 的存取日誌和錯誤日誌。把日誌存到主機上的好處是，即使容器重啟或者重建，日誌都還在，方便事後分析問題。

然後啟動 nginx 容器，組合使用多個選項：--network webapp-net 把它加入我們的自訂網路；-p 8080:80 把容器的 80 埠映射到主機的 8080；--memory 256m --cpus 0.5 限制資源；-v 掛載兩個 Volume，html 目錄是唯讀的（:ro），logs 目錄是讀寫的；--restart unless-stopped 確保服務在容器崩潰時自動重啟。

最後用 docker ps 確認容器在執行，用 curl localhost:8080 驗證服務能夠正常回應。

你看，把這些技能組合起來，就能架設一個有完整配置的 Web 服務：有資源限制（不會耗盡主機資源）、有日誌持久化（不怕容器重建）、有自動重啟（提高可用性）、有網路隔離（安全性更好）。這就是一個接近生產環境配置的容器部署方式。大家自己動手試試看！`,
    duration: "10"
  },
  {
    title: "上午課程總結",
    subtitle: "今日所學，下午預告",
    section: "課程總結",
    content: (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ 容器生命週期</p>
              <p className="text-slate-400 text-xs">Created → Running → Paused → Stopped → Deleted，掌握每個狀態的指令</p>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ 容器網路通訊</p>
              <p className="text-slate-400 text-xs">自訂 bridge 網路 + 自動 DNS，讓容器用名稱互相溝通</p>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ 埠號映射</p>
              <p className="text-slate-400 text-xs">-p 語法、IP 綁定、-P 自動分配、docker port 查詢</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ Volume 掛載</p>
              <p className="text-slate-400 text-xs">Bind Mount 開發用、Named Volume 生產用、tmpfs 機密暫存</p>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ 環境變數</p>
              <p className="text-slate-400 text-xs">-e 傳入、--env-file 管理、docker exec env 查看</p>
            </div>
            <div className="bg-green-900/30 border border-green-700 p-3 rounded-lg">
              <p className="text-green-400 font-semibold text-sm mb-1">✅ 資源限制與監控</p>
              <p className="text-slate-400 text-xs">--memory、--cpus 限制，docker stats 即時監控</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-900/40 border border-blue-700 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">🚀 下午課程預告（13:00）</p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="text-slate-300">
              <p className="text-2xl mb-1">📦</p>
              <p>Volume 深入</p>
            </div>
            <div className="text-slate-300">
              <p className="text-2xl mb-1">📄</p>
              <p>Dockerfile 撰寫</p>
            </div>
            <div className="text-slate-300">
              <p className="text-2xl mb-1">🐙</p>
              <p>Docker Compose</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `好，我們來做一個上午課程的總結。今天上午的內容非常豐富，大家學了很多重要的概念和技能，讓我幫大家整理一下。

首先是容器生命週期。我們學了一個容器從 Created 到 Running、Paused、Stopped，最後到 Deleted，每個狀態之間的轉換都有對應的指令。特別要記住 docker stop（優雅關閉）和 docker kill（強制終止）的區別，以及 --restart 策略在生產環境的重要性。

接著是容器網路通訊。最關鍵的知識點是：預設 bridge 網路沒有 DNS，自訂 bridge 網路有自動 DNS。所以在生產環境，我們應該為每個應用程式建立自訂網路，讓容器之間可以用名稱而不是 IP 位址來互相訪問。

埠號映射方面，-p 語法的完整格式是 [主機IP:]主機PORT:容器PORT[/協定]。可以用主機 IP 來控制服務的可見範圍，-P（大寫）可以自動分配埠號。還有一個重要的觀念：EXPOSE 只是文件說明，不等於開放埠號。

Volume 掛載解決了容器資料不持久化的問題。開發環境用 Bind Mount 即時同步，生產環境用 Named Volume 穩定可靠。

環境變數是容器配置的標準方式，遵循 12-Factor App 原則，讓同一個 Image 能在不同環境用不同設定執行。記得用 --env-file 管理敏感的環境變數，不要把密碼寫在指令列。

最後是資源限制和監控，--memory 和 --cpus 保護主機資源，docker stats 提供即時的監控資訊。

下午的課程我們會繼續深入，學習 Named Volume 的管理、如何撰寫 Dockerfile 建立自訂 Image，以及使用 Docker Compose 管理多容器應用程式。下午的內容是整個 Docker 學習中最重要的部分，請大家吃完午餐、休息好，我們 13:00 繼續！有任何問題現在可以提出來。`,
    duration: "10"
  },
]
