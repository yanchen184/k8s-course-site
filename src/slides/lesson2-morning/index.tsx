import type { ReactNode } from 'react'

export interface Slide {
  title: string
  subtitle?: string
  section?: string
  content?: ReactNode
  code?: string
  notes?: string
  duration?: string
}

export const slides: Slide[] = [
  // ========== 開場 ==========
  {
    title: '程式與服務管理',
    subtitle: '第二堂早上 — 讓 Linux 替你做事',
    section: '第二堂課',
    content: (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-k8s-blue rounded-full flex items-center justify-center text-4xl">
            ⚙️
          </div>
          <div>
            <p className="text-2xl font-semibold">程式與服務管理</p>
            <p className="text-slate-400">程序管理、背景執行、systemd、apt、環境變數</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 text-base">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">時間</p>
            <p>09:00 – 12:00（180 分鐘）</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold">重點</p>
            <p>讓程式在背景跑、管理系統服務</p>
          </div>
        </div>
      </div>
    ),
    notes: `早安！歡迎大家回來繼續學習。我是智宇老師，希望大家昨晚休息得不錯，有餘力的同學昨晚應該有回家試著 SSH 連線，把昨天的三個指令再操作了一遍。

今天的主題叫做「程式與服務管理」，聽起來很硬，但其實是非常實用的技能。今天學完之後，你就能夠：知道系統上有哪些程式在跑、把程式放到背景去執行不佔用終端機、安裝和移除軟體套件、控制系統服務的啟動和停止、設定環境變數讓系統知道指令放在哪裡。

這些技能在 Kubernetes 的日常操作裡會非常頻繁用到，特別是除錯的時候——你需要快速知道哪些 process 在跑、服務有沒有正確啟動、環境變數有沒有設好。今天打好基礎，後面學 K8s 會順很多。

先讓我快速確認一下：大家的電腦連線都沒問題嗎？有沒有人昨晚回家試 SSH 連線有遇到問題？有的話現在就可以舉手，助教過去幫忙確認，我們稍後馬上就要用到。`,
    duration: '3',
  },

  // ========== 課程大綱 ==========
  {
    title: '今日課程大綱',
    section: '課程總覽',
    content: (
      <div className="grid gap-3">
        {[
          { time: '09:00–09:15', topic: '開場與前日複習', icon: '🔄' },
          { time: '09:15–09:45', topic: '程序管理：ps, top, htop, kill, killall', icon: '🔍' },
          { time: '09:45–10:05', topic: '背景與前景：&, nohup, jobs, fg, bg', icon: '🌙' },
          { time: '10:05–10:20', topic: '休息時間', icon: '☕' },
          { time: '10:20–10:50', topic: 'systemd 與服務管理：systemctl', icon: '🛠️' },
          { time: '10:50–11:15', topic: '軟體安裝：apt update / install / remove', icon: '📦' },
          { time: '11:15–11:35', topic: '環境變數：$PATH, export, .bashrc', icon: '🌿' },
          { time: '11:35–11:40', topic: '課程總結', icon: '🎯' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-k8s-blue text-xs">{item.time}</p>
              <p className="text-base">{item.topic}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    notes: `讓我們看一下今天上午的課程安排，這樣大家心裡有個底。

九點到九點十五分是開場和前日複習，確認大家都還記得昨天的內容，SSH 連線都沒問題。

九點十五到九點四十五分進入程序管理，學習怎麼看系統上有哪些程式在跑，以及怎麼終止它們。

九點四十五到十點五分是背景執行，很重要的概念，學了以後你就不用一直盯著終端機等程式跑完，讓它在背景跑就好。

十點五分到十點二十分是十五分鐘休息。

十點二十到十點五十分學 systemd 服務管理，這是 Linux 現代系統的核心，控制服務的啟停。

十點五十到十一點十五分學 apt 套件管理，教你怎麼安裝和移除軟體。

十一點十五到十一點三十五分學環境變數，讓 Linux 知道你的工具放在哪裡。

最後五分鐘課程總結。整個安排非常緊湊，但每個主題都會有實作，大家務必跟上。`,
    duration: '2',
  },

  // ========== 前日複習 ==========
  {
    title: '前日複習',
    subtitle: '溫故而知新，確認基礎打穩了',
    section: '開場複習',
    content: (
      <div className="space-y-5">
        <p className="text-lg text-slate-300">昨天我們學了哪些東西？</p>
        <div className="grid gap-3">
          {[
            {
              topic: 'Linux 基礎概念',
              detail: '一切皆是檔案、檔案系統樹狀結構、使用者與權限',
              icon: '🐧',
            },
            {
              topic: 'SSH 遠端連線',
              detail: 'ssh user@ip、第一次連線確認指紋、登出用 exit',
              icon: '🔐',
            },
            {
              topic: '基礎指令',
              detail: 'ls、cd、pwd、mkdir、cp、mv、rm、cat、nano',
              icon: '💻',
            },
            {
              topic: '檔案與目錄操作',
              detail: '相對路徑 vs 絕對路徑、~ 代表家目錄',
              icon: '📁',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-k8s-blue">{item.topic}</p>
                <p className="text-slate-400 text-sm">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold">❓ 現場快問快答</p>
          <p className="text-slate-300">怎麼列出目前目錄的所有檔案（含隱藏）？</p>
        </div>
      </div>
    ),
    notes: `好，開始之前先來一個快速的複習。我問幾個問題，大家舉手回答，不用擔心答錯，這是為了幫助大家把昨天的記憶喚醒。

第一個問題：想查看目前在哪個目錄，用什麼指令？對，就是 pwd，Print Working Directory。

第二個問題：要切換到上一層目錄，怎麼打？cd 兩個點，cd .. ，對！兩個點代表上一層目錄，一個點代表目前目錄。

第三個問題：要列出目前目錄所有檔案，包括隱藏檔案，要用什麼指令？ls -a，對！-a 是 all 的意思，Linux 的隱藏檔案是用點開頭命名的，比如 .bashrc、.ssh。

第四個問題：要刪除一個目錄和裡面所有的東西，怎麼下指令？rm -rf 目錄名稱。記得 -r 是遞迴刪除子目錄，-f 是強制不詢問。這個指令要小心用，刪了就沒了。

昨天有做回家作業的同學舉個手看看？太好了！有做作業的同學今天的吸收會快很多，因為肌肉記憶已經建立起來了。沒做的同學也沒關係，今天下課後把昨天的作業補上，然後今天的實作認真跟著操作，一樣能學會。

我們今天從程序管理開始，這是一個非常實用的技能，在工作中你會非常頻繁用到它。`,
    duration: '10',
  },

  // ========== 程序管理：概念 ==========
  {
    title: '程序管理',
    subtitle: '誰在我的 Linux 裡面跑？',
    section: '程序管理',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-k8s-blue mb-2">什麼是「程序」（Process）？</p>
          <p className="text-slate-300">
            程式（program）是硬碟上的執行檔；程序（process）是程式被載入記憶體並實際執行時的狀態。
            每個程序都有一個唯一的 <span className="text-green-400 font-mono font-bold">PID</span>（Process ID）。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">常用工具</p>
            <ul className="space-y-2 text-slate-300 font-mono">
              <li><span className="text-green-400">ps</span> — 快照目前程序</li>
              <li><span className="text-green-400">top</span> — 即時動態監控</li>
              <li><span className="text-green-400">htop</span> — top 的進化版</li>
              <li><span className="text-green-400">kill</span> — 終止程序</li>
              <li><span className="text-green-400">killall</span> — 依名稱終止</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-semibold mb-2">為什麼重要？</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• 找出吃掉資源的程式</li>
              <li>• 終止當掉的應用程式</li>
              <li>• 確認服務有沒有在跑</li>
              <li>• K8s 容器除錯必備</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: `什麼是程序？先搞清楚這個概念很重要，因為後面的指令都圍繞著它轉。

用一個比喻：程式（program）就像食譜，是靜靜躺在書架上的一本書，不佔空間不消耗能量。當你打開食譜開始做菜，這個「做菜的過程」就是程序（process）——它需要用到廚具、爐火、食材，也就是 CPU、記憶體、磁碟等資源。同一本食譜可以同時被多個人拿來做菜，這就是同一個程式可以同時跑多個程序的概念。

每一個程序都有一個獨一無二的 PID（Process ID），就像每個人有自己的身份證號碼。你可以用 PID 來指定操作某個特定的程序，比如終止它或查看它的詳細資訊。

在 Linux 系統上，從你登入的那一刻起，就已經有幾百個甚至上千個程序在跑了：有負責系統初始化的 systemd、有 SSH 連線的 sshd、有你的 shell（bash 或 zsh）、有各種背景服務。這些程序共同維持著系統的運作。

管理這些程序是 Linux 管理員的日常工作之一，也是在 Kubernetes 裡面除錯的基礎技能——當你 exec 進一個容器，需要知道裡面什麼程序在跑、哪個程序可能出了問題，這些都是今天要學的技能。`,
    duration: '5',
  },

  // ========== ps 指令 ==========
  {
    title: 'ps — 程序快照',
    subtitle: '查看目前有哪些程序在執行',
    section: '程序管理',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            {
              cmd: 'ps',
              desc: '只顯示目前 shell 相關的程序',
              output: 'PID  TTY   TIME     CMD\n1234 pts/0 00:00:00 bash\n1567 pts/0 00:00:00 ps',
            },
            {
              cmd: 'ps aux',
              desc: '顯示所有使用者的所有程序（最常用）',
              output: 'USER  PID  %CPU %MEM  COMMAND\nroot   1   0.0  0.1  systemd\n...',
            },
            {
              cmd: 'ps aux | grep nginx',
              desc: '用 grep 過濾，只看 nginx 相關程序',
              output: 'www-data 1234 0.0 0.1 nginx: worker process',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg overflow-hidden">
              <div className="bg-slate-700/50 px-4 py-2 flex items-center justify-between">
                <code className="text-green-400 font-mono font-bold">{item.cmd}</code>
                <span className="text-slate-400 text-sm">{item.desc}</span>
              </div>
              <pre className="px-4 py-2 text-xs text-slate-400 font-mono">{item.output}</pre>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">💡 aux 是什麼意思？</p>
          <p className="text-yellow-200">a = 所有使用者的程序 ｜ u = 顯示使用者名稱 ｜ x = 包含沒有終端機的程序</p>
        </div>
      </div>
    ),
    notes: `來學第一個程序管理工具：ps。ps 是 Process Status 的縮寫，顯示目前系統上執行中的程序。

最基本的 ps 只顯示跟你目前 shell 相關的程序，通常只有兩三行——bash 和 ps 本身。這個版本用途有限。

實際工作中最常用的是 ps aux，這個組合會列出系統上所有使用者的所有程序，輸出的欄位包括：USER（哪個使用者啟動的）、PID（程序 ID）、%CPU（CPU 使用率）、%MEM（記憶體使用率）、COMMAND（指令名稱）。

ps aux 的輸出通常很長，可能有幾百行，所以我們經常把它跟 grep 指令搭配使用，用管道符號 | 把輸出傳給 grep 過濾。比如 ps aux | grep nginx，就只看跟 nginx 相關的行。

管道符號是 Linux 的精髓之一，它讓你可以把多個指令串在一起，前一個指令的輸出直接變成下一個指令的輸入。這個概念在今天後面的課程中還會再出現。

現在大家跟著操作：先輸入 ps，看看輸出有幾行；然後輸入 ps aux，看看有多少行（可能要滾動才能看完）；最後試試 ps aux | grep bash，過濾出 bash 相關的程序。大家操作看看，有問題舉手。`,
    duration: '10',
  },

  // ========== top / htop ==========
  {
    title: 'top 與 htop — 即時監控',
    subtitle: '動態觀察系統資源使用狀況',
    section: '程序管理',
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-k8s-blue font-bold text-xl mb-2 font-mono">top</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>✅ 系統內建，一定有</li>
              <li>✅ 即時更新 CPU、MEM</li>
              <li>⚠️ 介面比較陽春</li>
              <li className="text-slate-400 font-mono">按 q 離開 | 按 M 依記憶體排序</li>
            </ul>
          </div>
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-bold text-xl mb-2 font-mono">htop</p>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>✅ 彩色介面、更易讀</li>
              <li>✅ 可以用滑鼠操作</li>
              <li>✅ 直接在介面 kill 程序</li>
              <li className="text-slate-400 font-mono">需要 apt install htop</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">top 常用快捷鍵</p>
          <div className="grid grid-cols-3 gap-2 font-mono text-sm">
            {[
              { key: 'q', desc: '離開' },
              { key: 'M', desc: '依記憶體排序' },
              { key: 'P', desc: '依 CPU 排序' },
              { key: 'k', desc: '輸入 PID 終止程序' },
              { key: '1', desc: '顯示每顆 CPU' },
              { key: 'h', desc: '說明' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <kbd className="bg-slate-600 px-2 py-1 rounded text-white">{item.key}</kbd>
                <span className="text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: `ps 是快照，執行一次就看到那個時刻的程序狀態；top 是影片，可以持續追蹤程序的動態變化。

輸入 top 按 Enter，畫面會自動更新，大約每三秒刷一次。上半部是系統概覽：CPU 使用率、記憶體使用量、目前執行中的程序數量；下半部是程序列表，預設依 CPU 使用率排序，最耗 CPU 的程序排在最上面。

這對找出「哪個程式在吃 CPU」非常有用。如果你的系統突然變慢，打開 top，馬上就知道哪個程序是罪魁禍首。按 M 可以改成依記憶體排序，P 回到 CPU 排序。按 q 離開 top。

htop 是 top 的加強版，有漂亮的彩色介面，彩色長條圖顯示 CPU 和記憶體使用率，看起來更直覺。它可以用鍵盤方向鍵選擇程序，直接按 F9 選擇 signal 來終止程序，或按 F10 離開。htop 預設沒有安裝，但等一下學了 apt 之後馬上就可以裝。

現在大家跟著輸入 top，先感受一下這個動態的畫面。觀察一下你的系統上哪些程序在跑、CPU 和記憶體的使用率各是多少。試著按 M 和 P 切換排序方式，然後按 q 離開。`,
    duration: '8',
  },

  // ========== kill / killall ==========
  {
    title: 'kill 與 killall — 終止程序',
    subtitle: '優雅地，或強制地，結束程序',
    section: '程序管理',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-3">常用 Signal</p>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { sig: 'SIGTERM (15)', cmd: 'kill PID', color: 'text-green-400', desc: '請你自己關掉（優雅終止）' },
              { sig: 'SIGKILL (9)', cmd: 'kill -9 PID', color: 'text-red-400', desc: '強制終止，不給收尾機會' },
              { sig: 'SIGHUP (1)', cmd: 'kill -1 PID', color: 'text-yellow-400', desc: '讓程序重新讀取設定' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-700/50 p-3 rounded-lg">
                <p className={`font-mono font-bold ${item.color}`}>{item.sig}</p>
                <p className="font-mono text-xs text-slate-300 mt-1">{item.cmd}</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-700/50 px-4 py-2 text-k8s-blue font-semibold text-sm">kill（依 PID）</div>
            <pre className="px-4 py-3 text-sm text-green-400 font-mono">{`# 先找到 PID
ps aux | grep sleep
# 然後終止它
kill 1234
kill -9 1234`}</pre>
          </div>
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-700/50 px-4 py-2 text-k8s-blue font-semibold text-sm">killall（依程序名稱）</div>
            <pre className="px-4 py-3 text-sm text-green-400 font-mono">{`# 終止所有叫 nginx 的程序
killall nginx
# 強制終止
killall -9 firefox`}</pre>
          </div>
        </div>
        <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg text-sm">
          <p className="text-red-400 font-semibold">⚠️ kill -9 的代價</p>
          <p className="text-slate-300">強制終止不給程序收尾，可能導致資料損毀或 port 沒釋放，非不得已不要用</p>
        </div>
      </div>
    ),
    notes: `知道程序在跑之後，有時候需要終止它。也許它卡住了、也許它在吃太多資源，這時候就需要 kill 指令。

kill 指令的名字雖然叫「殺」，但它其實是在傳送「信號」（signal）給程序。Linux 有很多種信號，最常用的是：

SIGTERM，信號 15，這是預設信號。你發送這個信號，等於禮貌地跟程序說：「請你自己關掉。」程序收到後可以選擇先做清理工作，比如把還沒寫入的資料存盤、釋放鎖定的資源，然後乾淨地退出。這是最正確的終止方式。

SIGKILL，信號 9，這是強制終止。你發送這個，作業系統直接把這個程序的記憶體釋放掉，不給它任何收尾機會。這個信號程序無法忽略也無法攔截，一定會死。但代價是可能有資料損毀、資源沒有乾淨釋放。

SIGHUP，信號 1，讓程序重新讀取設定檔。很多服務（比如 nginx、sshd）收到這個信號會重新載入設定，不用真的重啟服務。

使用方式：先用 ps aux | grep 程序名 找到 PID，然後 kill PID。如果程序不理你，再用 kill -9 PID 強制終止。

killall 更方便，直接用程序名稱，不用找 PID。killall nginx 會把所有叫 nginx 的程序都終止掉。

現在大家來做一個小實作：在終端機輸入 sleep 300 & （等一下解釋 & 的意思），然後用 ps aux | grep sleep 找到它的 PID，再用 kill 把它終止，最後確認它不見了。`,
    duration: '7',
  },

  // ========== 背景與前景 ==========
  {
    title: '背景執行：& 與 nohup',
    subtitle: '讓程式在背景跑，終端機還給你',
    section: '背景與前景',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-green-400 font-mono font-bold text-xl mb-2">&amp;</p>
            <p className="text-slate-300 text-sm mb-3">在指令結尾加 &amp;，程序會在背景執行，終端機立刻回來</p>
            <pre className="text-xs text-green-400 font-mono">{`# 前景執行（會卡住）
sleep 60

# 背景執行
sleep 60 &
# → [1] 1234 (工作編號 和 PID)`}</pre>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-yellow-400 font-mono font-bold text-xl mb-2">nohup</p>
            <p className="text-slate-300 text-sm mb-3">離開 SSH 後程序繼續跑（忽略 SIGHUP 信號）</p>
            <pre className="text-xs text-green-400 font-mono">{`# 離開 SSH 後繼續執行
nohup python3 server.py &

# 輸出會存到 nohup.out
tail -f nohup.out`}</pre>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">比較：有沒有 nohup 的差異</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">單純 &amp;</p>
              <p className="text-slate-300">SSH 一斷線，程序就死掉（收到 SIGHUP）</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">nohup &amp;</p>
              <p className="text-slate-300">SSH 斷線後，程序繼續存活 ✅</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `現在來講一個很實用的概念：背景執行。

假設你要跑一個需要跑很久的程式，比如說備份資料要跑一個小時。如果你直接執行，終端機就會卡在那裡，你什麼都不能做，只能等。如果你不小心關掉了終端機，程式就死了，前功盡棄。

解決方法是把程式放到「背景」執行。最簡單的方式就是在指令後面加一個 & 符號（ampersand）。比如 sleep 60 & ，執行後終端機會立刻回來給你，同時程序在背景繼續跑。系統會顯示工作編號和 PID，比如 [1] 1234，方括號裡的是工作編號，後面是 PID。

但是，& 有一個問題：如果你的 SSH 連線斷掉了，Shell 會傳送 SIGHUP 信號給所有的子程序，你的背景程序也會跟著死掉。這在伺服器管理上是個大問題，因為網路有時候不穩，SSH 會斷線。

解決方案是 nohup，名字就是「No Hang Up（不要因掛斷而停止）」的意思。在指令前面加上 nohup，程式就會忽略 SIGHUP 信號，即使 SSH 斷線，程序依然繼續在伺服器上跑。nohup 的輸出預設會被寫入 nohup.out 這個檔案，你可以用 tail -f nohup.out 追蹤它的輸出。

所以最完整的背景執行寫法是：nohup 你的指令 & ——既能讓終端機立刻回來，又能確保斷線後程序繼續跑。在正式的生產環境，如果不用 systemd 管理服務，nohup & 就是最基本的守護方式。`,
    duration: '10',
  },

  // ========== jobs / fg / bg ==========
  {
    title: 'jobs, fg, bg — 工作管理',
    subtitle: '在前景與背景之間切換',
    section: '背景與前景',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            {
              cmd: 'jobs',
              desc: '列出目前 Shell 的所有背景工作',
              example: '[1]+  Running   sleep 300 &\n[2]-  Stopped  nano file.txt',
            },
            {
              cmd: 'fg %1',
              desc: '把工作 1 拉回前景',
              example: '工作 1 回到前景，終端機被它佔用',
            },
            {
              cmd: 'bg %1',
              desc: '把暫停的工作 1 繼續在背景執行',
              example: '[1]+ sleep 300 &',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-slate-700/50 px-4 py-2">
                <code className="text-green-400 font-mono font-bold">{item.cmd}</code>
                <span className="text-slate-400 text-sm">{item.desc}</span>
              </div>
              <pre className="px-4 py-2 text-xs text-slate-400 font-mono">{item.example}</pre>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-1">💡 Ctrl+Z 快速暫停</p>
          <p className="text-slate-300 text-sm">
            執行中的前景程序按 Ctrl+Z 可以暫停（Stopped），再用 bg 讓它在背景繼續執行
          </p>
        </div>
        <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
          <p className="text-slate-400">完整操作流程範例：</p>
          <pre className="text-green-400 font-mono text-xs mt-2">{`nano file.txt      # 開始編輯
Ctrl+Z             # 暫停，回到 shell
ls -l              # 做別的事
fg %1              # 回去繼續編輯`}</pre>
        </div>
      </div>
    ),
    notes: `學了 & 和 nohup 之後，我們來學怎麼在前景和背景之間切換，這個技能在日常 Linux 操作裡非常實用。

jobs 指令會列出目前這個 shell 的所有工作（jobs）。所謂「工作」就是你在這個 shell 裡啟動的程序。輸出的格式是：工作編號、狀態（Running 執行中 / Stopped 暫停中）、指令名稱。

fg 是 foreground（前景）的縮寫，fg %1 把工作編號 1 拉回前景，終端機會被這個程序佔用，直到程序結束或你再次暫停它。

bg 是 background（背景）的縮寫，bg %1 讓工作編號 1 在背景繼續執行。這通常配合 Ctrl+Z 一起用：假設你正在前景跑一個程序，突然想做別的事，可以按 Ctrl+Z 把它暫停，做完別的事之後，如果想讓它繼續在背景跑，就輸入 bg %1。

讓我給大家一個很實用的場景：假設你正在用 nano 編輯一個設定檔，突然需要查看另一個目錄的內容。你可以：按 Ctrl+Z 暫停 nano → 執行 ls 或其他指令 → 回頭用 fg %1 繼續編輯 nano。完全不用開第二個終端機。

這些工作管理的技能，在早期 Linux 管理員只有一個終端機的年代非常重要。現在雖然我們可以開多個終端機視窗，但在 SSH 連線的環境裡，有時候開新 session 比較麻煩，這些快捷鍵就能省很多時間。

大家現在跟著操作：輸入 sleep 200 & 讓一個程序在背景跑，再輸入 sleep 300 & 再跑一個，然後用 jobs 看看工作列表，試試 fg %1 把第一個拉回來，再按 Ctrl+Z 暫停，用 bg %1 讓它回到背景。`,
    duration: '10',
  },

  // ========== 休息 ==========
  {
    title: '☕ 休息時間',
    subtitle: '休息 15 分鐘',
    content: (
      <div className="text-center space-y-8">
        <p className="text-6xl">☕ 🧘 🚶</p>
        <p className="text-2xl text-slate-300">
          休息一下，等等進入服務管理的世界！
        </p>
        <div className="bg-slate-800/50 p-6 rounded-lg inline-block">
          <p className="text-slate-400">下半場預告</p>
          <p className="text-xl text-k8s-blue">systemd、apt 套件管理、環境變數</p>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg max-w-lg mx-auto text-left">
          <p className="text-k8s-blue font-semibold">📌 思考題（休息回來討論）</p>
          <p className="text-slate-300 text-sm">你知道 nginx 是怎麼在伺服器上「自動啟動」的嗎？</p>
        </div>
      </div>
    ),
    notes: `好，我們已經學完程序管理和背景執行，讓大家休息 15 分鐘。上廁所、喝水、活動一下筋骨。

剛才的內容滿紮實的，如果有沒跟上的地方，可以趁休息時間來問我或助教。等等下半場的內容一樣很實用：systemd 服務管理是 Linux 現代系統的核心，apt 套件管理是你安裝軟體的主要方式，環境變數則是讓各種工具能夠正常執行的關鍵設定。

休息前我留了一個思考題：你知道 nginx 是怎麼在伺服器開機的時候自動啟動的嗎？等等學完 systemd，你就知道答案了。

十五分鐘後準時回來！`,
    duration: '1',
  },

  // ========== systemd 概念 ==========
  {
    title: 'systemd — 系統初始化與服務管理',
    subtitle: 'Linux 現代服務管理的核心',
    section: 'systemd 與服務管理',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-lg text-slate-300">
            <span className="text-k8s-blue font-bold">systemd</span> 是現代 Linux 的{' '}
            <span className="text-green-400 font-bold">第一個程序（PID 1）</span>，負責：
          </p>
          <ul className="mt-3 space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <span className="text-green-400">▶</span> 系統開機時啟動所有服務
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">▶</span> 管理服務的生命週期（啟動、停止、重啟）
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">▶</span> 收集和儲存系統日誌
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">▶</span> 服務崩潰時自動重啟
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          {[
            { name: 'nginx', desc: 'Web 伺服器', icon: '🌐' },
            { name: 'sshd', desc: 'SSH 服務', icon: '🔐' },
            { name: 'cron', desc: '排程工作', icon: '⏰' },
            { name: 'docker', desc: 'Docker 守護程序', icon: '🐳' },
            { name: 'kubelet', desc: 'K8s 節點代理', icon: '☸️' },
            { name: 'mysql', desc: '資料庫服務', icon: '🗄️' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 p-3 rounded-lg">
              <p className="text-2xl">{item.icon}</p>
              <p className="text-green-400 font-mono text-xs">{item.name}</p>
              <p className="text-slate-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `休息結束，精神好了嗎？現在來講一個非常重要的概念：systemd。

當 Linux 開機的時候，核心（kernel）啟動完成之後，第一件事就是啟動一個叫做 systemd 的程序，它的 PID 是 1，也就是系統上的第一個使用者空間程序。你可以用 ps aux | grep systemd 確認看看，或是直接看 ps aux 最上面的那幾行。

systemd 的職責是：在開機的時候，按照依賴順序逐一啟動所有需要的服務；在系統運作期間，監控各個服務的狀態，如果某個服務崩潰了，根據設定決定要不要自動重啟；在關機的時候，按正確順序依序停止所有服務。

你在伺服器上跑的幾乎所有服務，包括 nginx、MySQL、SSH、Docker、甚至 Kubernetes 的 kubelet，都是由 systemd 管理的。

你剛才思考的問題有答案了：nginx 為什麼開機自動啟動？因為有人在安裝 nginx 之後執行了 systemctl enable nginx，告訴 systemd「開機的時候請自動啟動 nginx」。systemd 就會在適當的開機階段把 nginx 啟動起來。

理解 systemd 的概念，對 Kubernetes 管理員非常重要。Kubernetes 的每個節點上都有 kubelet，它就是用 systemd 管理的。如果 kubelet 出問題，你需要知道怎麼用 systemctl 查看狀態和重啟它。`,
    duration: '7',
  },

  // ========== systemctl 基本指令 ==========
  {
    title: 'systemctl — 控制服務',
    subtitle: '啟動、停止、重啟、查看服務狀態',
    section: 'systemd 與服務管理',
    content: (
      <div className="space-y-4">
        <div className="grid gap-2">
          {[
            { cmd: 'systemctl start nginx', icon: '▶️', desc: '啟動 nginx 服務' },
            { cmd: 'systemctl stop nginx', icon: '⏹️', desc: '停止 nginx 服務' },
            { cmd: 'systemctl restart nginx', icon: '🔄', desc: '停止後再啟動（設定有改動用這個）' },
            { cmd: 'systemctl reload nginx', icon: '🔃', desc: '重新載入設定（不中斷連線）' },
            { cmd: 'systemctl status nginx', icon: '🔍', desc: '查看服務目前狀態' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="text-xl w-8 text-center">{item.icon}</span>
              <code className="text-green-400 font-mono flex-1">{item.cmd}</code>
              <span className="text-slate-400 text-sm">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="bg-slate-700/50 px-4 py-2 text-slate-400 text-sm">systemctl status nginx 輸出範例</div>
          <pre className="px-4 py-3 text-xs text-slate-300 font-mono">{`● nginx.service - A high performance web server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
   Active: active (running) since Mon 2026-02-17 09:00:01 UTC
  Process: 1234 ExecStart=/usr/sbin/nginx (code=exited)
 Main PID: 1235 (nginx)
   CGroup: /system.slice/nginx.service
           ├─1235 nginx: master process
           └─1236 nginx: worker process`}</pre>
        </div>
      </div>
    ),
    notes: `systemctl 是跟 systemd 溝通的主要工具，指令格式很規律：systemctl 動作 服務名稱。

最常用的幾個動作：

start 啟動服務，讓它開始跑。前提是服務已經安裝好了。

stop 停止服務，讓它停下來。注意：stop 只是現在停下來，下次開機還是會啟動（如果有 enable 的話）。

restart 重啟，就是先 stop 再 start。當你修改了服務的設定檔，需要讓設定生效，通常用這個。但注意 restart 會有短暫的服務中斷，如果服務支援 reload，建議用 reload 而不是 restart。

reload 重新載入設定。有些服務（像 nginx）支援在不中斷現有連線的情況下重新讀取設定，這就是 reload。對於需要高可用性的服務，盡量用 reload 不要用 restart。

status 是最常用的！它會顯示服務的詳細狀態，包括：是否已啟用（enabled/disabled）、目前是否在跑（active/inactive）、啟動時間、Main PID、最近幾行 log。

看 status 的輸出學會兩個關鍵字：Active 那行的 running 代表服務正在跑，failed 代表服務異常退出，inactive 代表服務沒有在跑。Loaded 那行的 enabled 代表開機會自動啟動，disabled 代表不會。

這幾個指令在 Kubernetes 管理裡非常常用。kubelet 出問題時：systemctl status kubelet 先看狀態，然後 systemctl restart kubelet 嘗試重啟，看有沒有恢復正常。`,
    duration: '10',
  },

  // ========== systemctl enable/disable + 實作 ==========
  {
    title: 'systemctl enable / disable',
    subtitle: '設定服務是否開機自動啟動',
    section: 'systemd 與服務管理',
    content: (
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 font-mono font-bold text-lg mb-2">systemctl enable nginx</p>
            <p className="text-slate-300 text-sm">設定 nginx 在開機時自動啟動</p>
            <p className="text-slate-400 text-xs mt-2">（建立 symlink 到 /etc/systemd/system/）</p>
          </div>
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-red-400 font-mono font-bold text-lg mb-2">systemctl disable nginx</p>
            <p className="text-slate-300 text-sm">取消 nginx 開機自動啟動</p>
            <p className="text-slate-400 text-xs mt-2">（移除 symlink，不影響目前狀態）</p>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-2">💡 enable vs start 的差別</p>
          <div className="grid grid-cols-2 gap-4 text-slate-300">
            <div>
              <p className="font-semibold">start</p>
              <p>現在馬上啟動，但重開機後不會自動啟動</p>
            </div>
            <div>
              <p className="font-semibold">enable</p>
              <p>設定開機自動啟動，但現在不馬上啟動</p>
            </div>
          </div>
          <p className="text-yellow-300 mt-3 font-mono">systemctl enable --now nginx  ← 兩件事一次完成</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-k8s-blue font-semibold mb-2">🔨 實作：安裝並啟動 nginx</p>
          <pre className="text-green-400 font-mono text-sm">{`sudo apt install nginx -y
sudo systemctl enable --now nginx
systemctl status nginx
curl http://localhost`}</pre>
        </div>
      </div>
    ),
    notes: `enable 和 disable 是控制服務「開機是否自動啟動」的指令，這跟 start 和 stop 是完全不同的維度。

start 和 stop 是「現在」的狀態：start 讓服務現在開始跑，stop 讓服務現在停下來。但這個狀態在重開機後不會保留——重開機後，服務是否啟動完全看 enable/disable 的設定。

enable 是設定「開機時」的行為：systemctl enable nginx 設定 nginx 在系統開機時自動啟動。它的底層實作是在 /etc/systemd/system/ 目錄下建立一個符號連結（symlink），systemd 在開機時會看這個目錄決定要啟動哪些服務。

disable 相反，移除那個 symlink，下次開機就不會自動啟動了。注意 disable 不會停止目前正在跑的服務。

實際工作中最方便的是 enable --now，一個指令同時完成「現在啟動」和「設定開機自動啟動」兩件事。

現在來做一個實作，把剛才的概念都串起來。我們來安裝 nginx，然後啟動它：第一步，用 sudo apt install nginx -y 安裝 nginx（sudo 是以 root 權限執行，-y 是自動回答 yes，不用一直按確認）；第二步，systemctl enable --now nginx 設定並立刻啟動；第三步，systemctl status nginx 確認服務正在跑；第四步，curl http://localhost 看看 nginx 有沒有回應。如果看到一堆 HTML，代表 nginx 在正常運作了！大家跟著做，遇到問題舉手。`,
    duration: '8',
  },

  // ========== 服務管理實作 ==========
  {
    title: '🔨 服務管理實作',
    subtitle: '操控 nginx — 停止、重啟、看日誌',
    section: 'systemd 與服務管理',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            { step: '1', cmd: 'systemctl stop nginx', desc: '停止 nginx，確認 curl 失敗' },
            { step: '2', cmd: 'systemctl start nginx', desc: '重新啟動 nginx，確認 curl 成功' },
            { step: '3', cmd: 'journalctl -u nginx -n 20', desc: '查看 nginx 的最近 20 行日誌' },
            { step: '4', cmd: 'journalctl -u nginx -f', desc: '即時追蹤 nginx 日誌（Ctrl+C 離開）' },
            { step: '5', cmd: 'systemctl list-units --type=service', desc: '列出所有服務狀態' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg">
              <span className="bg-k8s-blue text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold">
                {item.step}
              </span>
              <code className="text-green-400 font-mono flex-1 text-sm">{item.cmd}</code>
              <span className="text-slate-400 text-xs max-w-[200px]">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">💡 journalctl</p>
          <p className="text-yellow-200">journalctl 是 systemd 的日誌工具，查看任何服務的 log 都用它</p>
        </div>
      </div>
    ),
    notes: `這個實作投影片讓大家把 systemctl 的操作都練習一遍，同時介紹另一個重要工具：journalctl。

Step 1：systemctl stop nginx，停掉 nginx。然後 curl http://localhost，你會看到連線失敗的錯誤，因為服務停了。這是驗證「stop 確實有效」。

Step 2：systemctl start nginx，重新啟動。再用 curl http://localhost，又能看到 HTML 了。

Step 3：journalctl -u nginx -n 20，查看 nginx 服務最近 20 行日誌。-u 是指定 unit（也就是哪個服務），-n 是行數。日誌記錄著 nginx 何時啟動、何時停止、有沒有發生錯誤，是除錯的重要依據。

Step 4：journalctl -u nginx -f，-f 是 follow，即時追蹤日誌，新的日誌行會自動顯示出來。這很像 tail -f，但是是針對 systemd 服務的。當你需要觀察某個服務在做什麼、發生了什麼錯誤，用這個非常方便。按 Ctrl+C 退出追蹤模式。

Step 5：systemctl list-units --type=service，列出目前系統上所有 service 類型的 unit，可以看到哪些服務在跑（active）、哪些停了（inactive）、哪些有問題（failed）。failed 狀態的服務用紅色顯示，很容易看到。

在 Kubernetes 的日常管理裡，journalctl -u kubelet -f 是出問題時的第一個反應——追蹤 kubelet 的日誌看看發生了什麼事。`,
    duration: '5',
  },

  // ========== apt 套件管理 ==========
  {
    title: 'apt — 套件管理系統',
    subtitle: '安裝軟體不再手忙腳亂',
    section: '軟體安裝',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-lg text-slate-300">
            <span className="text-k8s-blue font-bold">apt</span>（Advanced Package Tool）是 Ubuntu/Debian 的套件管理員，
            幫你搞定<span className="text-green-400 font-bold">安裝、更新、移除</span>，以及所有<span className="text-yellow-400 font-bold">相依性</span>。
          </p>
        </div>
        <div className="grid gap-3">
          {[
            { cmd: 'sudo apt update', icon: '🔄', desc: '更新套件資料庫（先做這個！）' },
            { cmd: 'sudo apt upgrade', icon: '⬆️', desc: '升級所有已安裝套件' },
            { cmd: 'apt search nginx', icon: '🔍', desc: '搜尋套件名稱' },
            { cmd: 'apt show nginx', icon: '📋', desc: '查看套件詳細資訊' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="text-xl">{item.icon}</span>
              <code className="text-green-400 font-mono flex-1">{item.cmd}</code>
              <span className="text-slate-400 text-sm">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">⚠️ 為什麼要先 apt update？</p>
          <p className="text-yellow-200">
            update 不是更新軟體，而是更新「可用套件清單」，確保你安裝的是最新版本。
            apt install 前一定要先跑 apt update！
          </p>
        </div>
      </div>
    ),
    notes: `好，來學今天另一個重要技能：apt 套件管理。

在 Windows，你想安裝一個軟體，需要打開瀏覽器、找到官方網站、下載安裝檔、雙擊執行、一路下一步。有時候安裝一個軟體還需要先安裝另外三個相依函式庫，非常麻煩。

Linux 的套件管理系統解決了這個問題。你只需要一行指令，套件管理員就幫你：在官方軟體倉庫裡找到軟體，自動解決所有相依性（A 需要 B，B 需要 C，全部一起裝），下載並安裝，設定好初始配置。整個過程一鍵完成，不用動手點選任何東西。

Ubuntu 和 Debian 系列用的是 apt，Red Hat 系列用 yum 或 dnf，但概念一樣。

在安裝任何東西之前，一定要先執行 sudo apt update。這個指令不是更新軟體，而是更新「哪些套件可以安裝、最新版本是多少」的清單。就像你要去超市買東西之前，先看一下最新的商品目錄。如果不先 update，你可能安裝到舊版本，或是找不到最新的套件。

apt search 可以搜尋套件名稱，如果你不確定一個軟體的正確套件名，用這個找。apt show 可以查看一個套件的詳細資訊，包括版本、大小、相依套件、說明文字等。`,
    duration: '8',
  },

  // ========== apt install / remove ==========
  {
    title: 'apt install / remove',
    subtitle: '安裝與移除軟體套件',
    section: '軟體安裝',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            {
              cmd: 'sudo apt install htop',
              icon: '📦',
              desc: '安裝 htop',
              color: 'text-green-400',
            },
            {
              cmd: 'sudo apt install htop curl wget -y',
              icon: '📦',
              desc: '一次安裝多個套件，-y 自動確認',
              color: 'text-green-400',
            },
            {
              cmd: 'sudo apt remove htop',
              icon: '🗑️',
              desc: '移除 htop（保留設定檔）',
              color: 'text-red-400',
            },
            {
              cmd: 'sudo apt purge htop',
              icon: '💥',
              desc: '完全移除（連設定檔一起刪）',
              color: 'text-red-400',
            },
            {
              cmd: 'sudo apt autoremove',
              icon: '🧹',
              desc: '移除不再需要的相依套件（清理用）',
              color: 'text-yellow-400',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="text-xl">{item.icon}</span>
              <code className={`font-mono flex-1 text-sm ${item.color}`}>{item.cmd}</code>
              <span className="text-slate-400 text-xs max-w-[200px]">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="bg-slate-700/50 px-4 py-2 text-k8s-blue text-sm font-semibold">🔨 實作：安裝 htop 並使用</div>
          <pre className="px-4 py-3 text-sm text-green-400 font-mono">{`sudo apt update
sudo apt install htop -y
htop`}</pre>
        </div>
      </div>
    ),
    notes: `學了 apt update，現在來學怎麼實際安裝和移除套件。

安裝套件的語法是 sudo apt install 套件名稱。需要 sudo 是因為安裝軟體需要 root 權限，要把檔案寫入系統目錄。如果安裝過程中 apt 會詢問你「要安裝這些套件嗎？佔用多少空間，確認嗎？」，加上 -y 參數就能自動回答 yes，方便用在腳本裡。

可以一次安裝多個套件，在 apt install 後面列出套件名稱，用空格分開。

移除套件有兩個選項：apt remove 移除軟體本身，但保留設定檔；apt purge 是完全清除，包括設定檔也一起刪掉。一般來說移除後還想重裝的用 remove，不打算再裝了就用 purge。

apt autoremove 是清理指令，移除那些當初被自動安裝的相依套件，但現在主套件已經移除，它們也沒有用了。定期執行可以節省磁碟空間。

現在大家來做實作：執行 sudo apt update，然後 sudo apt install htop -y，安裝完成後直接輸入 htop 打開它。htop 的介面比 top 漂亮很多，有彩色的 CPU 和記憶體長條圖。用方向鍵可以選擇程序，按 F10 或 q 離開。等一下學完環境變數，你就完全掌握了今天的核心工具。`,
    duration: '10',
  },

  // ========== apt 實作 ==========
  {
    title: '🔨 apt 綜合實作',
    subtitle: '安裝、確認、清理',
    section: '軟體安裝',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            { step: '1', cmd: 'sudo apt update && sudo apt upgrade -y', desc: '更新系統到最新狀態' },
            { step: '2', cmd: 'sudo apt install tree ncdu -y', desc: '安裝 tree（目錄視覺化）和 ncdu（磁碟分析）' },
            { step: '3', cmd: 'tree /home', desc: '用 tree 看 /home 的目錄結構' },
            { step: '4', cmd: 'ncdu /var', desc: '用 ncdu 分析 /var 的磁碟使用（q 離開）' },
            { step: '5', cmd: 'sudo apt remove tree ncdu', desc: '移除剛才安裝的套件' },
            { step: '6', cmd: 'sudo apt autoremove -y', desc: '清理不需要的相依套件' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="bg-k8s-blue text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold">
                {item.step}
              </span>
              <code className="text-green-400 font-mono flex-1 text-xs">{item.cmd}</code>
              <span className="text-slate-400 text-xs max-w-[180px]">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-3 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">💡 && 的意思</p>
          <p className="text-slate-300">cmd1 &amp;&amp; cmd2 表示：先執行 cmd1，成功了才執行 cmd2</p>
        </div>
      </div>
    ),
    notes: `這個實作讓大家把 apt 的完整流程都跑一遍，同時順便學兩個好用的工具：tree 和 ncdu。

Step 1：sudo apt update && sudo apt upgrade -y，先更新套件清單，然後自動升級所有套件。兩個 & 串在一起（&&）是邏輯「且」的意思：前面的指令成功執行，才會繼續執行後面的。這個組合在 shell 腳本裡非常常用，確保執行到後面的指令時，前置條件都已滿足。

Step 2：安裝 tree 和 ncdu，這兩個小工具很實用。tree 用來把目錄結構以樹狀圖顯示，非常直覺；ncdu 是 Ncurses Disk Usage，以互動式介面顯示哪些目錄最佔磁碟空間，找出「誰把硬碟吃光了」的神器。

Step 3 和 4：實際使用這兩個工具，感受一下。tree /home 把 /home 目錄的結構視覺化。ncdu /var 分析 /var 的磁碟使用情況，可以用方向鍵導覽，看哪個目錄佔最多空間，按 d 可以刪除，按 q 離開。

Step 5 和 6：移除剛才安裝的套件，然後用 autoremove 清理。這個完整的安裝到清理流程，你在實際工作中會反覆用到。請大家跟著做，確認每個步驟都能成功。`,
    duration: '7',
  },

  // ========== 環境變數概念 ==========
  {
    title: '環境變數',
    subtitle: 'Linux 的「全域設定」',
    section: '環境變數',
    content: (
      <div className="space-y-5">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-lg text-slate-300">
            環境變數是儲存在 Shell 環境中的<span className="text-k8s-blue font-bold">鍵值對</span>，
            讓程式知道系統的各種設定和路徑。
          </p>
        </div>
        <div className="grid gap-3">
          {[
            {
              cmd: 'echo $PATH',
              desc: '顯示指令搜尋路徑',
              output: '/usr/local/bin:/usr/bin:/bin:/usr/local/sbin',
            },
            {
              cmd: 'echo $HOME',
              desc: '顯示家目錄路徑',
              output: '/home/student',
            },
            {
              cmd: 'echo $USER',
              desc: '顯示目前使用者名稱',
              output: 'student',
            },
            {
              cmd: 'env | head -20',
              desc: '顯示所有環境變數（前 20 行）',
              output: 'TERM=xterm-256color\nSHELL=/bin/bash\n...',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/50 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-slate-700/50 px-4 py-2">
                <code className="text-green-400 font-mono">{item.cmd}</code>
                <span className="text-slate-400 text-sm">{item.desc}</span>
              </div>
              <pre className="px-4 py-2 text-xs text-slate-400 font-mono">{item.output}</pre>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: `最後一個主題：環境變數。這個概念在 Kubernetes 裡非常非常重要，容器的設定有很大一部分就是透過環境變數來傳遞的。

環境變數是一種特殊的變數，儲存在你的 Shell 環境中，可以被你執行的任何程式讀取。你可以把它想成是整個 Shell 環境的「全域設定」，任何在這個 Shell 裡啟動的程式都能看到這些設定值。

最重要的環境變數是 PATH。PATH 告訴 Shell：「當你輸入一個指令名稱，要去哪些目錄裡找這個指令的執行檔」。比如你輸入 ls，Shell 會依序搜尋 PATH 裡列出的每個目錄，找到 /bin/ls 這個執行檔，然後執行它。如果 PATH 設定不對，你輸入指令就會看到「command not found」錯誤。

環境變數的命名慣例是全大寫，用 $ 符號來取得它的值。echo 把文字輸出到終端機，所以 echo $PATH 就是輸出 PATH 這個環境變數的值。

env 指令不加任何參數，會把目前 Shell 的所有環境變數都列出來，通常有幾十個。配合 | head -20 可以只看前 20 行，不然刷屏太快看不完。

常見的環境變數還有 HOME（家目錄路徑）、USER（使用者名稱）、SHELL（預設 Shell 的路徑）、LANG（語言設定）等。`,
    duration: '8',
  },

  // ========== export / .bashrc ==========
  {
    title: 'export 與 .bashrc — 設定環境',
    subtitle: '新增自訂環境變數，並讓它永久生效',
    section: '環境變數',
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-700/50 px-4 py-2 text-k8s-blue font-semibold text-sm">
              export — 設定環境變數
            </div>
            <pre className="px-4 py-3 text-sm text-green-400 font-mono">{`# 設定變數（只在此 session 有效）
export MY_NAME="Student"
echo $MY_NAME  # → Student

# 加到 PATH（讓 ~/bin 裡的指令可用）
export PATH="$HOME/bin:$PATH"`}</pre>
          </div>
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-700/50 px-4 py-2 text-k8s-blue font-semibold text-sm">
              .bashrc — 永久生效
            </div>
            <pre className="px-4 py-3 text-sm text-green-400 font-mono">{`# 編輯 .bashrc
nano ~/.bashrc

# 在最後加入：
export MY_NAME="Student"
export PATH="$HOME/bin:$PATH"

# 讓設定立刻生效
source ~/.bashrc`}</pre>
          </div>
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold mb-2">💡 .bashrc vs .bash_profile</p>
          <div className="grid grid-cols-2 gap-4 text-slate-300">
            <div>
              <p className="font-semibold text-slate-200">.bashrc</p>
              <p>每次開新的互動式 Shell 時載入（最常用）</p>
            </div>
            <div>
              <p className="font-semibold text-slate-200">.bash_profile</p>
              <p>只在登入時載入一次（SSH 連線進來）</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: `學會查看環境變數之後，來學怎麼新增和讓設定永久生效。

export 指令用來設定或修改環境變數。export MY_NAME="Student" 設定一個叫 MY_NAME 的變數，值是 Student。設定完馬上就能用 echo $MY_NAME 看到。

但是有一個重要限制：用 export 設定的環境變數，只在目前這個 Shell session 有效。你一旦登出，或是開一個新的終端機視窗，這個設定就消失了。

要讓設定永久生效，需要把 export 指令寫入設定檔。最常用的是 ~/.bashrc，這個檔案是 Bash Shell 的設定檔，每次你開啟一個新的互動式 Shell 時，Bash 都會自動讀取並執行這個檔案裡的所有指令。

所以流程是：nano ~/.bashrc 打開設定檔，在最後面加入你的 export 指令，存檔退出；然後執行 source ~/.bashrc 讓目前的 Shell 立刻重新載入設定，不用登出再登入。

修改 PATH 是最常見的需求。比如你把自己寫的腳本放在 ~/bin/ 目錄，想要直接用名稱執行它，就需要把 ~/bin 加到 PATH 裡：export PATH="$HOME/bin:$PATH"。注意要在原有的 PATH 前面加，讓你的目錄有最高優先順序，這樣同名指令會優先用你的版本。

在 Kubernetes 的實際使用上，你安裝完 kubectl、helm 等工具後，通常需要把安裝目錄加到 PATH，才能在任何地方用這些指令。這就是為什麼你需要懂 .bashrc 和 PATH 的設定。`,
    duration: '7',
  },

  // ========== 環境變數實作 ==========
  {
    title: '🔨 環境變數實作',
    subtitle: '設定 alias 和 PATH，讓工作更順手',
    section: '環境變數',
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          {[
            { step: '1', cmd: 'echo $PATH', desc: '查看目前的 PATH' },
            {
              step: '2',
              cmd: 'nano ~/.bashrc',
              desc: '打開 .bashrc 準備編輯',
            },
            {
              step: '3',
              cmd: '# 加入以下內容：\nexport EDITOR=nano\nalias ll="ls -la"\nalias gs="git status"',
              desc: '新增實用 alias 和變數',
            },
            { step: '4', cmd: 'source ~/.bashrc', desc: '讓設定立刻生效' },
            { step: '5', cmd: 'll', desc: '測試 alias 是否生效' },
            { step: '6', cmd: 'echo $EDITOR', desc: '確認環境變數已設定' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
              <span className="bg-k8s-blue text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold">
                {item.step}
              </span>
              <div className="flex-1 min-w-0">
                <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">{item.cmd}</pre>
              </div>
              <span className="text-slate-400 text-xs max-w-[160px]">{item.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 p-3 rounded-lg text-sm">
          <p className="text-yellow-400 font-semibold">💡 alias 是什麼？</p>
          <p className="text-yellow-200">alias 是指令的「別名」，讓你用短指令代替長指令，大幅提升效率</p>
        </div>
      </div>
    ),
    notes: `最後這個實作，我順便教大家一個超實用的技巧：alias（別名）。

alias 讓你自定義指令的別名，把常用的長指令縮短成容易記的短名字。比如 alias ll="ls -la" 之後，你只要輸入 ll，就等於輸入了 ls -la，顯示詳細資訊和隱藏檔案的目錄列表。這個 alias 非常流行，很多 Linux 系統預設就有設定 ll。

Step 1：先查看目前的 PATH，記下來，等一下可以確認有沒有變化。

Step 2：用 nano ~/.bashrc 打開設定檔。注意 .bashrc 前面有一個點，這是隱藏檔案，一般的 ls 看不到，要用 ls -a 才能看到。

Step 3：用方向鍵移到最後一行，加入三行設定：EDITOR=nano 設定預設文字編輯器（很多程式會用這個變數），ll 別名讓你快速列出詳細目錄，gs 是 git status 的縮寫（之後學 git 的時候很有用）。儲存（Ctrl+O Enter）並退出（Ctrl+X）。

Step 4：source ~/.bashrc 讓設定立刻生效，不用重新登入。

Step 5 和 6：測試確認。輸入 ll，應該看到跟 ls -la 一樣的輸出；echo $EDITOR 應該輸出 nano。

這個小小的 .bashrc 設定，能大幅提升你的日常工作效率。隨著你越來越熟悉 Linux，你會不斷新增自己的 alias 和環境變數設定，打造出一個「最順手的工作環境」。`,
    duration: '5',
  },

  // ========== 課程總結 ==========
  {
    title: '課程總結',
    subtitle: '今天學了什麼？',
    section: '課程總結',
    content: (
      <div className="space-y-5">
        <div className="grid gap-3">
          {[
            {
              topic: '程序管理',
              items: 'ps aux, top, htop, kill -9, killall',
              icon: '🔍',
            },
            {
              topic: '背景與前景',
              items: '& 背景執行、nohup 斷線存活、jobs/fg/bg 切換',
              icon: '🌙',
            },
            {
              topic: 'systemd 與服務管理',
              items: 'systemctl start/stop/restart/enable/disable/status',
              icon: '🛠️',
            },
            {
              topic: '套件管理',
              items: 'apt update / install / remove / purge / autoremove',
              icon: '📦',
            },
            {
              topic: '環境變數',
              items: '$PATH, export, alias, ~/.bashrc, source',
              icon: '🌿',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-slate-800/50 p-4 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-k8s-blue">{item.topic}</p>
                <p className="text-slate-400 text-sm font-mono">{item.items}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-k8s-blue/20 border border-k8s-blue/50 p-4 rounded-lg text-sm">
          <p className="text-k8s-blue font-semibold">📝 下堂課預告</p>
          <p className="text-slate-300">下午：網路工具（ip、ping、curl、ss）與 shell 腳本入門</p>
        </div>
      </div>
    ),
    notes: `今天上午我們學了非常多東西，讓我來快速總結一下：

程序管理這塊，你現在知道怎麼用 ps aux 看所有程序，用 top 和 htop 即時監控，用 kill 和 killall 終止程序。PID 和 signal 的概念也清楚了。

背景執行這塊，你學會了 & 把程序放到背景、nohup 讓程序不因 SSH 斷線而死、jobs 查看工作列表、fg 和 bg 切換前後景、Ctrl+Z 暫停。

systemd 服務管理，你現在知道 systemd 是 PID 1、是管理所有服務的守護神，用 systemctl 可以啟動停止重啟服務，enable 設定開機自動啟動，journalctl 查看服務日誌。

apt 套件管理，一定要先 apt update，然後 apt install 安裝、apt remove 移除、apt purge 完全清除、autoremove 清理。

環境變數，$PATH 決定指令在哪裡找，export 設定變數，~/.bashrc 讓設定永久生效，alias 設定快捷方式，source 讓設定立刻生效。

這五個主題都是 Linux 日常管理的核心技能，也是之後學 Docker 和 Kubernetes 的基礎。下午我們繼續，會學網路工具和 Shell 腳本入門，大家午餐吃飽，準備下午的挑戰！有問題現在可以舉手提問。`,
    duration: '5',
  },
]
