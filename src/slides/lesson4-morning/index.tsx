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
  // ============================================================
  // 4-1：從 Docker 到 K8s（3 張）
  // ============================================================

  // ── 4-1（1/3）：開場 + 前三堂回顧 + minikube 安裝 ──
  {
    title: '歡迎來到第四堂：Kubernetes 入門',
    subtitle: '從 Docker 單機到 K8s 叢集管理',
    section: '4-1：從 Docker 到 K8s',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">前三堂回顧</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">堂次</th>
                <th className="pb-2 pr-4">主題</th>
                <th className="pb-2">學會的技能</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Day 1</td>
                <td className="py-2 pr-4">Linux 基礎</td>
                <td className="py-2">終端機操作、檔案管理、網路設定</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Day 2</td>
                <td className="py-2 pr-4">Docker 入門</td>
                <td className="py-2">Image、Container、Port Mapping、Volume</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400">Day 3</td>
                <td className="py-2 pr-4">Docker 進階</td>
                <td className="py-2">Dockerfile、Docker Compose、多容器編排</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">今天的計畫</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>上午：K8s 核心概念 + 架構 + 第一個 Pod</li>
            <li>下午：4 個 Loop 實作（排錯、Sidecar、kubectl 進階、環境變數）</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">先跑安裝（背景下載不影響聽課）</p>
          <p className="text-slate-300 text-sm">安裝完成後執行 <code className="text-green-400">minikube start</code> 建立叢集</p>
        </div>
      </div>
    ),
    code: `# Ubuntu 安裝 minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start`,
    notes: `開場先讓學員跑 minikube 安裝，邊裝邊上課。回顧前三堂：Day1 Linux / Day2 Docker / Day3 Docker Compose。今天目標是從 Docker 升級到 K8s。`,
  },

  // ── 4-1（2/3）：五大問題 ──
  {
    title: 'Docker 的五個瓶頸',
    subtitle: 'Docker Compose 做不到的事',
    section: '4-1：從 Docker 到 K8s',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-3">Docker Compose 只管一台機器，以下全做不到</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4 w-8">#</th>
                <th className="pb-2 pr-4">問題</th>
                <th className="pb-2">場景</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1</td>
                <td className="py-2 pr-4 font-semibold text-white">跨機器調度</td>
                <td className="py-2">一台機器扛不住，容器要分散到多台</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2</td>
                <td className="py-2 pr-4 font-semibold text-white">故障恢復</td>
                <td className="py-2">凌晨三點機器掛了，容器要自動搬家</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">3</td>
                <td className="py-2 pr-4 font-semibold text-white">彈性擴縮</td>
                <td className="py-2">雙十一流量暴增十倍，來不及手動加容器</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">4</td>
                <td className="py-2 pr-4 font-semibold text-white">滾動更新</td>
                <td className="py-2">更新版本要停機，幾秒空窗 = 幾萬損失</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">5</td>
                <td className="py-2 pr-4 font-semibold text-white">服務發現</td>
                <td className="py-2">Pod IP 會變、跨機器容器找不到對方</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">共同特徵</p>
          <p className="text-slate-300 text-sm">全部都跟<strong className="text-white">「多台機器」</strong>有關。Docker 是單機工具，規模超出一台機器就無能為力。</p>
        </div>
      </div>
    ),
    notes: `五個問題用電商場景帶入：一台扛不住、機器掛了、雙十一暴增、版本更新要停機、跨機器容器找不到對方。共同點是全部跟多機器有關，Docker Compose 只管一台。`,
  },

  // ── 4-1（3/3）：K8s 是什麼 + 解決對照 ──
  {
    title: 'Kubernetes 是什麼',
    subtitle: 'Google Borg 背景 + 宣告式管理',
    section: '4-1：從 Docker 到 K8s',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">背景</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Google 內部 <strong className="text-white">Borg</strong> 系統（2003+），每週啟動 20 億容器</li>
            <li>2014 年用 Go 語言重寫開源 → <strong className="text-white">Kubernetes（K8s）</strong></li>
            <li>捐給 CNCF，成為容器編排<strong className="text-white">行業標準</strong></li>
          </ul>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">K8s 如何解決五個問題</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">問題</th>
                <th className="pb-2">K8s 解法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">跨機器調度</td>
                <td className="py-2"><strong className="text-blue-400">Scheduler</strong> 自動分配到空閒 Node</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">故障恢復</td>
                <td className="py-2"><strong className="text-blue-400">Controller Manager</strong> 偵測故障、自動重建</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">彈性擴縮</td>
                <td className="py-2"><strong className="text-blue-400">HPA</strong> 按 CPU 自動加減容器</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">滾動更新</td>
                <td className="py-2"><strong className="text-blue-400">Deployment</strong> 逐步替換 + 一鍵回滾</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">服務發現</td>
                <td className="py-2"><strong className="text-blue-400">Service + CoreDNS</strong> 穩定名稱 + 跨 Node</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1">核心理念：宣告式管理</p>
          <p className="text-slate-300 text-sm">你告訴 K8s「我要什麼狀態」，K8s 自己想辦法做到並<strong className="text-white">持續維護</strong>。像跟服務生說「牛排七分熟」，不用管廚師怎麼煎。</p>
        </div>
      </div>
    ),
    notes: `K8s 源自 Google Borg，2014 開源，現為行業標準。五個問題一一對應五個解法。核心理念是宣告式管理：你說你要什麼，K8s 負責做到。`,
  },

  // ============================================================
  // 4-2：Pod、Service、Ingress（3 張）
  // ============================================================

  // ── 4-2（1/3）：Node + Pod ──
  {
    title: 'Node 與 Pod',
    subtitle: 'K8s 最小調度單位',
    section: '4-2：Pod、Service、Ingress',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">基本概念</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">概念</th>
                <th className="pb-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Node</td>
                <td className="py-2">一台機器（實體 / 虛擬），叢集裡有多個 Node</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Pod</td>
                <td className="py-2">容器的包裝，K8s 最小調度單位（不是 Container）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Pod 裡的容器共享什麼？</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-white">共享網路</strong>：同一個 IP，用 localhost 互連</li>
            <li><strong className="text-white">共享儲存</strong>：掛同一個 Volume，讀寫同一批檔案</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">Sidecar 模式</p>
          <div className="flex items-center justify-center gap-4 my-2">
            <div className="bg-blue-900/40 border border-blue-500/40 p-2 rounded-lg text-center">
              <p className="text-blue-400 font-semibold text-sm">主容器</p>
              <p className="text-slate-400 text-xs">API / nginx</p>
            </div>
            <div className="text-slate-500 text-xl">+</div>
            <div className="bg-purple-900/40 border border-purple-500/40 p-2 rounded-lg text-center">
              <p className="text-purple-400 font-semibold text-sm">邊車容器</p>
              <p className="text-slate-400 text-xs">日誌收集 / Proxy</p>
            </div>
          </div>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">最佳實踐</p>
          <p className="text-slate-300 text-sm">絕大多數情況：<strong className="text-white">一個 Pod 一個容器</strong>。先當成 Pod = Container 來理解。</p>
        </div>
      </div>
    ),
    notes: `Node = 機器，Pod = 容器的包裝。同一 Pod 裡的容器共享網路（localhost）和儲存（Volume）。Sidecar 模式：主容器 + 輔助容器。最佳實踐是一 Pod 一容器。`,
  },

  // ── 4-2（2/3）：Service ──
  {
    title: 'Service：Pod 的穩定入口',
    subtitle: 'Pod IP 會變 + 外面連不到 → Service 解決',
    section: '4-2：Pod、Service、Ingress',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Pod 的兩個問題</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Pod IP 是<strong className="text-white">叢集內部</strong>虛擬 IP，外面連不到</li>
            <li>Pod 重建後 IP 會變，用 IP 連 = 搬家換手機號不通知</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Service = 穩定的代理人（總機號碼）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">類型</th>
                <th className="pb-2 pr-4">作用</th>
                <th className="pb-2">對照 Docker</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">ClusterIP</td>
                <td className="py-2 pr-4">叢集內部虛擬 IP + DNS（預設）</td>
                <td className="py-2">Docker Network 容器名互連</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">NodePort</td>
                <td className="py-2 pr-4">每個 Node 開 30000-32767 Port</td>
                <td className="py-2"><code>docker run -p 8080:80</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">LoadBalancer</td>
                <td className="py-2 pr-4">雲端自動分配外部 IP + 負載均衡</td>
                <td className="py-2">雲端 LB（Docker 沒有）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">ClusterIP + DNS</p>
          <p className="text-slate-300 text-sm">API 容器直接用 <code className="text-green-400">mysql-service</code> 名稱連資料庫，CoreDNS 自動解析。跟 Docker Compose 服務名互連一樣，但<strong className="text-white">可跨 Node</strong>。</p>
        </div>
      </div>
    ),
    notes: `Pod IP 會變且外面連不到 → Service 提供穩定入口。三種類型：ClusterIP（內部 + DNS）、NodePort（開 Port）、LoadBalancer（雲端 LB）。ClusterIP 的 DNS 功能讓 Pod 用名字找到對方。`,
  },

  // ── 4-2（3/3）：Ingress ──
  {
    title: 'Ingress：HTTP 路由器',
    subtitle: '域名 / 路徑 → 不同 Service',
    section: '4-2：Pod、Service、Ingress',
    duration: '4',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Ingress = K8s 版的 Nginx 反向代理</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>根據<strong className="text-white">域名 / 路徑</strong>將 HTTP 請求轉發到不同 Service</li>
            <li>可設定 SSL 憑證（HTTPS）</li>
            <li>需要搭配 <strong className="text-white">Ingress Controller</strong>（如 Nginx Ingress、Traefik）</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-3">流量路徑</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">使用者</span>
            <span className="text-slate-500">→</span>
            <span className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded">Ingress</span>
            <span className="text-slate-500">→</span>
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">Service</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">Pod</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">路由範例</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">域名 / 路徑</th>
                <th className="pb-2">轉發目標</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>www.myshop.com</code></td>
                <td className="py-2">前端 Service</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>www.myshop.com/api</code></td>
                <td className="py-2">後端 API Service</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>admin.myshop.com</code></td>
                <td className="py-2">管理後台 Service</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">Ingress vs Service</p>
          <p className="text-slate-300 text-sm">Service 在四層（TCP）做穩定入口 + 負載均衡。Ingress 在七層（HTTP）做域名路由。<strong className="text-white">配合使用</strong>，不是取代。</p>
        </div>
      </div>
    ),
    notes: `Ingress 是 HTTP 路由器，根據域名/路徑轉發到不同 Service。需搭配 Ingress Controller。流量路徑：使用者 → Ingress → Service → Pod。第六堂課實際操作。`,
  },

  // ============================================================
  // 4-3：ConfigMap、Secret、Volume（2 張）
  // ============================================================

  // ── 4-3（1/2）：ConfigMap + Secret ──
  {
    title: 'ConfigMap 與 Secret',
    subtitle: '設定不寫死 Image + 密碼分開管',
    section: '4-3：ConfigMap、Secret、Volume',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">ConfigMap：設定與 Image 分離</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>DB 位址、Port 等設定存在 ConfigMap，不用重新 build Image</li>
            <li><strong className="text-white">環境變數注入</strong>：簡單設定（Pod 啟動時注入，改了要重啟）</li>
            <li><strong className="text-white">Volume 掛載</strong>：複雜設定檔（改了自動更新，不用重啟）</li>
          </ul>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Secret：敏感資訊（密碼、API Key、SSL 憑證）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>用法跟 ConfigMap 幾乎一樣</li>
            <li><strong className="text-red-400">Base64 是編碼，不是加密！</strong>一個指令就能解回原文</li>
            <li>真正安全靠 <strong className="text-white">RBAC 權限控制</strong>：一般開發者只能看 ConfigMap，不能看 Secret</li>
            <li>加上 etcd 靜態加密 + API Server 存取限制才完整</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">兩種使用方式</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">方式</th>
                <th className="pb-2 pr-4">適用場景</th>
                <th className="pb-2">熱更新？</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">環境變數（env）</td>
                <td className="py-2 pr-4">少量設定（DB_HOST、PORT）</td>
                <td className="py-2 text-red-400">需重啟 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Volume 掛載</td>
                <td className="py-2 pr-4">完整設定檔（nginx.conf）</td>
                <td className="py-2 text-green-400">自動更新</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    notes: `ConfigMap 讓設定和 Image 分離，兩種用法：env（簡單但要重啟）和 Volume（複雜但能熱更新）。Secret 用法一樣但多 Base64 編碼，記住 Base64 不是加密，安全靠 RBAC。`,
  },

  // ── 4-3（2/2）：Volume + Docker 對照 ──
  {
    title: 'Volume：容器掛了資料不消失',
    subtitle: '支援本地 / NFS / 雲端硬碟',
    section: '4-3：ConfigMap、Secret、Volume',
    duration: '4',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">K8s Volume 比 Docker Volume 更強</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-white">emptyDir</strong>：臨時空目錄，Pod 刪除就消失（Sidecar 共享用）</li>
            <li><strong className="text-white">hostPath</strong>：掛 Node 本地目錄（Pod 換 Node 就讀不到）</li>
            <li><strong className="text-white">遠端儲存</strong>：AWS EBS / GCP PD / NFS / Ceph（Pod 換 Node 照樣掛載）</li>
          </ul>
          <p className="text-slate-400 text-xs mt-2">PV / PVC 機制第六堂課詳講</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">Docker → K8s 對照表</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Docker 做法</th>
                <th className="pb-2">K8s 對應</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker run -e DB_HOST=xxx</code></td>
                <td className="py-2">ConfigMap（環境變數注入）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Docker Compose <code>.env</code> 檔</td>
                <td className="py-2">Secret</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker volume</code> / <code>-v /data:/var/lib/mysql</code></td>
                <td className="py-2">Volume（本地 + NFS + 雲端）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1">比喻</p>
          <p className="text-slate-300 text-sm">Pod = 人，ConfigMap = 工作手冊，Secret = 上鎖的密碼本，Volume = 檔案櫃（人走了檔案還在）</p>
        </div>
      </div>
    ),
    notes: `Volume 讓資料存在 Pod 外面。emptyDir 臨時（Sidecar 用）、hostPath 本地（換 Node 讀不到）、遠端儲存跨 Node 都能掛。Docker 對照：-e → ConfigMap, .env → Secret, -v → Volume。`,
  },

  // ============================================================
  // 4-4：Deployment、StatefulSet（3 張）
  // ============================================================

  // ── 4-4（1/3）：Deployment 副本 + 三層關係 ──
  {
    title: 'Deployment：多副本 + 自動修復',
    subtitle: '單 Pod 會掛 → 多副本分散風險',
    section: '4-4：Deployment、StatefulSet',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-1">問題：單點故障（Single Point of Failure）</p>
          <p className="text-slate-300 text-sm">API 只有一個 Pod，掛了使用者就看到錯誤頁面</p>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Deployment 做的事</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>告訴它 Image + 副本數 → 自動建立 + 持續監控</li>
            <li>Pod 掛了 → <strong className="text-white">自動補一個</strong>（不管白天半夜）</li>
            <li>副本分散到不同 Node → 一整台 Node 掛了也沒事</li>
            <li>動態調整副本數：<code className="text-green-400">kubectl scale</code> 一行搞定</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-blue-400 font-semibold mb-2">三層關係</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">Deployment</span>
            <span className="text-slate-500">→ 管 →</span>
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">ReplicaSet</span>
            <span className="text-slate-500">→ 管 →</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">Pod x3</span>
          </div>
          <p className="text-slate-400 text-xs mt-2 text-center">你只管 Deployment，ReplicaSet 自動建立（服務生 → 廚師 → 菜）</p>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">對照 Docker</p>
          <p className="text-slate-300 text-sm"><code>docker compose up --scale web=3</code> 只能在一台機器、掛了不補。Deployment 跨 Node、掛了自動補。</p>
        </div>
      </div>
    ),
    notes: `單 Pod = 單點故障。Deployment 管副本：自動建、自動補、跨 Node 分散。三層：Deployment → ReplicaSet → Pod。面試題常問三者關係。`,
  },

  // ── 4-4（2/3）：滾動更新 ──
  {
    title: '滾動更新 + 回滾',
    subtitle: '零停機部署，萬一出錯一鍵退回',
    section: '4-4：Deployment、StatefulSet',
    duration: '4',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">滾動更新四步驟（v1 → v2）</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">1.</span>
              <span className="text-slate-300">建立一個 v2 Pod</span>
              <span className="text-slate-500 ml-auto">3 x v1 + 1 x v2</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">2.</span>
              <span className="text-slate-300">v2 健康 → 砍一個 v1</span>
              <span className="text-slate-500 ml-auto">2 x v1 + 1 x v2</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">3.</span>
              <span className="text-slate-300">再建 v2、砍 v1</span>
              <span className="text-slate-500 ml-auto">1 x v1 + 2 x v2</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cyan-400 font-bold w-6">4.</span>
              <span className="text-slate-300">最後一輪替換</span>
              <span className="text-slate-500 ml-auto">0 x v1 + 3 x v2</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2">全程始終有 Pod 在服務，使用者無感</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">回滾（Rollback）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code className="text-green-400">kubectl rollout undo</code> → 幾十秒退回上一版</li>
            <li><code className="text-green-400">kubectl rollout history</code> → 查看部署歷史</li>
            <li>原理：舊 ReplicaSet 還在（副本數縮到 0），回滾只是把數字加回來</li>
            <li>預設保留 10 個版本記錄</li>
          </ul>
        </div>
      </div>
    ),
    notes: `滾動更新：先建 v2、確認健康再砍 v1，逐步替換。全程有 Pod 服務。回滾靠舊 ReplicaSet（副本數 0），加回來就好，所以極快。`,
  },

  // ── 4-4（3/3）：StatefulSet + 八概念總結 ──
  {
    title: 'StatefulSet + 八大概念總結',
    subtitle: '資料庫不能用 Deployment',
    section: '4-4：Deployment、StatefulSet',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">StatefulSet 三個特點（vs Deployment）</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">特點</th>
                <th className="pb-2 pr-4">Deployment</th>
                <th className="pb-2">StatefulSet</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">Pod 名稱</td>
                <td className="py-2 pr-4">隨機（nginx-abc123）</td>
                <td className="py-2 text-cyan-400 font-semibold">有序穩定（mysql-0, mysql-1）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">部署順序</td>
                <td className="py-2 pr-4">同時建立</td>
                <td className="py-2 text-cyan-400 font-semibold">依序建立（0 → 1 → 2）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">儲存</td>
                <td className="py-2 pr-4">共享或無</td>
                <td className="py-2 text-cyan-400 font-semibold">每個 Pod 獨立 Volume</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-3">八個核心概念總結</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">Pod</span> <span className="text-slate-400">→ 跑容器</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">Service</span> <span className="text-slate-400">→ 穩定入口</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">Ingress</span> <span className="text-slate-400">→ 域名路由</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">ConfigMap</span> <span className="text-slate-400">→ 管設定</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">Secret</span> <span className="text-slate-400">→ 管密碼</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">Volume</span> <span className="text-slate-400">→ 管資料</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">Deployment</span> <span className="text-slate-400">→ 管副本</span></div>
            <div className="bg-slate-800/50 p-2 rounded"><span className="text-blue-400">StatefulSet</span> <span className="text-slate-400">→ 管有狀態</span></div>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">實務建議</p>
          <p className="text-slate-300 text-sm">很多團隊選擇<strong className="text-white">不把 DB 放 K8s</strong>，用雲端 RDS / Cloud SQL。K8s 裡只跑無狀態應用。</p>
        </div>
      </div>
    ),
    notes: `StatefulSet 三特點：穩定名稱、有序部署、獨立儲存。適合 DB（mysql-0 永遠是 mysql-0）。八概念每個解決一個問題。實務上很多團隊 DB 放 K8s 外面。`,
  },

  // ============================================================
  // 4-5：K8s 架構（上）Worker Node（2 張）
  // ============================================================

  // ── 4-5（1/2）：Master-Worker 概覽 ──
  {
    title: 'K8s 架構：Master-Worker',
    subtitle: '管理層 vs 員工，各司其職',
    section: '4-5：K8s 架構（上）Worker Node',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">公司比喻</p>
          <div className="flex items-center justify-center gap-6 my-2">
            <div className="bg-purple-900/40 border border-purple-500/40 p-3 rounded-lg text-center">
              <p className="text-purple-400 font-semibold text-sm">Master Node</p>
              <p className="text-slate-400 text-xs">管理層（做決策）</p>
              <p className="text-slate-500 text-xs">不跑你的應用</p>
            </div>
            <div className="text-slate-500 text-xl">+</div>
            <div className="bg-green-900/40 border border-green-500/40 p-3 rounded-lg text-center">
              <p className="text-green-400 font-semibold text-sm">Worker Node</p>
              <p className="text-slate-400 text-xs">員工（實際幹活）</p>
              <p className="text-slate-500 text-xs">跑你的 Pod</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4"></th>
                <th className="pb-2 pr-4">Master Node</th>
                <th className="pb-2">Worker Node</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">職責</td>
                <td className="py-2 pr-4">決策、調度、監控</td>
                <td className="py-2">跑容器、執行指令</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">生產數量</td>
                <td className="py-2 pr-4">通常 3 個（高可用）</td>
                <td className="py-2">幾十到上百個</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">組件數</td>
                <td className="py-2 pr-4">4 個核心組件</td>
                <td className="py-2">3 個核心組件</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">minikube</p>
          <p className="text-slate-300 text-sm">Master + Worker 合在一台，方便學習。第五堂課用 k3s 才會看到多節點。</p>
        </div>
      </div>
    ),
    notes: `K8s 是 Master-Worker 架構。Master 不跑應用，只做管理。Worker 跑 Pod。生產環境 Master 3 台高可用，Worker 幾十到上百。minikube 是單節點，Master + Worker 合一。`,
  },

  // ── 4-5（2/2）：Worker 三組件 ──
  {
    title: 'Worker Node 三大組件',
    subtitle: 'Container Runtime + kubelet + kube-proxy',
    section: '4-5：K8s 架構（上）Worker Node',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">組件</th>
                <th className="pb-2 pr-4">比喻</th>
                <th className="pb-2">職責</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Container Runtime</td>
                <td className="py-2 pr-4">工具</td>
                <td className="py-2">拉 Image、建容器、跑容器</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kubelet</td>
                <td className="py-2 pr-4">工頭</td>
                <td className="py-2">接收 Master 指令、管 Pod、回報狀態</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kube-proxy</td>
                <td className="py-2 pr-4">交通指揮</td>
                <td className="py-2">網路規則、Service 轉發、負載均衡</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">containerd vs Docker</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Docker 分兩層：上層（CLI / Desktop）+ 下層（<strong className="text-white">containerd</strong>）</li>
            <li>K8s 1.24+ 直接用 containerd，不再需要 Docker</li>
            <li>Docker build 出來的 Image 在 containerd 上<strong className="text-green-400">照樣能跑</strong>（OCI 標準）</li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">缺一不可</p>
          <p className="text-slate-300 text-sm">沒 Runtime → 容器跑不了。沒 kubelet → 指令傳不到。沒 kube-proxy → 流量到不了正確的 Pod。</p>
        </div>
      </div>
    ),
    notes: `Worker 三組件：Container Runtime（containerd，跑容器）、kubelet（工頭，接指令管 Pod）、kube-proxy（網路代理，Service 轉發）。K8s 1.24 開始直接用 containerd，不需要 Docker。`,
  },

  // ============================================================
  // 4-6：K8s 架構（下）Master Node + 完整流程（3 張）
  // ============================================================

  // ── 4-6（1/3）：Master 四組件 ──
  {
    title: 'Master Node 四大組件',
    subtitle: 'API Server + etcd + Scheduler + Controller Manager',
    section: '4-6：K8s 架構（下）Master Node',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">組件</th>
                <th className="pb-2 pr-4">比喻</th>
                <th className="pb-2">職責</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">API Server</td>
                <td className="py-2 pr-4">大門警衛 + 總機</td>
                <td className="py-2">所有操作的入口，驗證身份 + 權限</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">etcd</td>
                <td className="py-2 pr-4">檔案室</td>
                <td className="py-2">分散式 KV 儲存，記錄所有叢集狀態</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Scheduler</td>
                <td className="py-2 pr-4">HR / 專案經理</td>
                <td className="py-2">根據資源決定 Pod 跑在哪個 Node</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">Controller Manager</td>
                <td className="py-2 pr-4">24h 監工 / 恆溫器</td>
                <td className="py-2">比較期望狀態 vs 實際狀態，持續修正</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">組件掛了會怎樣？</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><strong className="text-white">API Server 掛</strong>：不能下指令，已跑的 Pod 不受影響</li>
            <li><strong className="text-white">Scheduler 掛</strong>：新 Pod 排隊等分配，現有 Pod 不影響</li>
            <li><strong className="text-white">Controller Manager 掛</strong>：Pod 掛了沒人補，副本慢慢減少</li>
            <li><strong className="text-red-400">etcd 掛</strong>：叢集失去記憶，<strong>最嚴重</strong>。一定要定期備份！</li>
          </ul>
        </div>
      </div>
    ),
    notes: `Master 四組件：API Server（大門）、etcd（資料庫，最重要）、Scheduler（調度）、Controller Manager（控制迴圈，比較期望 vs 實際）。etcd 掛了最嚴重，必須備份。`,
  },

  // ── 4-6（2/3）：完整流程 ──
  {
    title: '完整流程：kubectl → Pod 跑起來',
    subtitle: 'kubectl create deployment nginx --replicas=3',
    section: '4-6：K8s 架構（下）Master Node',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">從一行指令到 Pod Running</p>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li><strong className="text-white">kubectl → API Server</strong>：驗證身份和權限</li>
            <li><strong className="text-white">API Server → etcd</strong>：記錄「Deployment nginx, replicas=3」</li>
            <li><strong className="text-white">Controller Manager</strong>：發現期望 3 個 Pod、實際 0 個 → 建 ReplicaSet</li>
            <li><strong className="text-white">Scheduler</strong>：看 Node 資源，分配 Pod（例 Pod1,3 → Worker1, Pod2 → Worker2）</li>
            <li><strong className="text-white">kubelet</strong>：收到通知 → 叫 containerd 拉 Image、建容器、啟動</li>
            <li><strong className="text-white">kubelet</strong>：持續回報狀態 → Controller Manager 確認 3/3 正常</li>
          </ol>
        </div>

        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">故障自動恢復</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Worker1 硬碟壞了 → 上面 2 個 Pod 停了</li>
            <li>Controller Manager：期望 3、實際 1 → 觸發建 2 個新 Pod</li>
            <li>Scheduler：分配到 Worker2 → kubelet 建容器 → 恢復正常</li>
          </ol>
          <p className="text-slate-400 text-xs mt-2">全程你一行指令都不用下，K8s 全自動處理</p>
        </div>
      </div>
    ),
    notes: `完整流程：kubectl → API Server 驗證 → etcd 記錄 → Controller Manager 建 ReplicaSet → Scheduler 分配 Node → kubelet 建容器。故障恢復也全自動：Controller Manager 發現少了就補。`,
  },

  // ── 4-6（3/3）：架構圖 ──
  {
    title: 'K8s 架構總覽',
    subtitle: 'Master（4 組件）+ Worker（3 組件 + Pod）',
    section: '4-6：K8s 架構（下）Master Node',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-purple-900/30 border border-purple-500/40 p-4 rounded-lg">
          <p className="text-purple-400 font-semibold mb-3 text-center">Master Node</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">API Server</p>
              <p className="text-slate-400 text-xs">叢集大門</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">etcd</p>
              <p className="text-slate-400 text-xs">叢集資料庫</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Scheduler</p>
              <p className="text-slate-400 text-xs">Pod 放哪裡</p>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-center">
              <p className="text-blue-400 font-semibold">Controller Manager</p>
              <p className="text-slate-400 text-xs">持續監控修正</p>
            </div>
          </div>
        </div>

        <div className="text-center text-slate-500 text-sm">kubectl → API Server ↕ 互相溝通</div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-900/30 border border-green-500/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2 text-center text-sm">Worker Node 1</p>
            <div className="space-y-1 text-xs">
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kubelet</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kube-proxy</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">containerd</div>
              <div className="bg-blue-900/40 p-1 rounded text-center text-blue-300 mt-2">Pod Pod</div>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-500/40 p-3 rounded-lg">
            <p className="text-green-400 font-semibold mb-2 text-center text-sm">Worker Node 2</p>
            <div className="space-y-1 text-xs">
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kubelet</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">kube-proxy</div>
              <div className="bg-slate-800/50 p-1 rounded text-center text-slate-300">containerd</div>
              <div className="bg-blue-900/40 p-1 rounded text-center text-blue-300 mt-2">Pod</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-blue-400 font-semibold mb-1 text-sm">K8s 用 Pod 跑自己的管理組件</p>
          <p className="text-slate-300 text-xs">等一下在 kube-system Namespace 裡會親眼看到 etcd、API Server、Scheduler、Controller Manager 都是 Pod</p>
        </div>
      </div>
    ),
    notes: `架構圖：Master 有 4 組件（API Server、etcd、Scheduler、Controller Manager），Worker 有 3 組件（kubelet、kube-proxy、containerd）+ Pod。K8s 的管理組件自己也是以 Pod 形式跑。`,
  },

  // ============================================================
  // 4-7：動手做（上）環境搭建（1 張）
  // ============================================================

  {
    title: '環境方案比較 + kubectl',
    subtitle: 'minikube vs k3s vs RKE',
    section: '4-7：環境搭建',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">三種方案</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">方案</th>
                <th className="pb-2 pr-4">特色</th>
                <th className="pb-2">何時用</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">minikube</td>
                <td className="py-2 pr-4">單節點、一行安裝</td>
                <td className="py-2">今天（學 Pod + 基本操作）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">k3s</td>
                <td className="py-2 pr-4">輕量多節點、Rancher Labs</td>
                <td className="py-2">第五堂（真正多 Node 體驗）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">RKE / kubeadm</td>
                <td className="py-2 pr-4">完整企業級、安裝較複雜</td>
                <td className="py-2">生產環境</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">kubectl = 學一次到處用</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>不管 minikube / k3s / AWS EKS / GCP GKE，指令<strong className="text-white">完全一樣</strong></li>
            <li>跟 Docker CLI 角色一樣：你跟叢集溝通的唯一工具</li>
          </ul>
        </div>
      </div>
    ),
    code: `# 驗證安裝
minikube version
minikube status

# 如果還沒啟動
minikube start

# 驗證叢集
kubectl get nodes          # 看到 minikube  Ready
kubectl cluster-info       # 看到 API Server 位址`,
    notes: `三種方案：minikube（今天，單節點）、k3s（第五堂，多節點）、RKE（生產環境）。kubectl 學一次到處用，跟 Docker CLI 一樣角色。`,
  },

  // ============================================================
  // 4-8：動手做（下）探索叢集（2 張）
  // ============================================================

  // ── 4-8（1/2）：kube-system 組件 ──
  {
    title: '親眼看到架構組件',
    subtitle: 'kubectl get pods -n kube-system',
    section: '4-8：探索叢集',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">kube-system 裡的管理組件</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Pod 名稱</th>
                <th className="pb-2">對應組件</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>etcd-minikube</code></td>
                <td className="py-2">etcd（叢集資料庫）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-apiserver-minikube</code></td>
                <td className="py-2">API Server（叢集大門）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-scheduler-minikube</code></td>
                <td className="py-2">Scheduler（調度器）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-controller-manager-minikube</code></td>
                <td className="py-2">Controller Manager（監工）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>kube-proxy-xxxxx</code></td>
                <td className="py-2">kube-proxy（網路代理）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>coredns-xxxxx</code></td>
                <td className="py-2">CoreDNS（叢集 DNS）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">K8s 用 Pod 管理自己的組件</p>
          <p className="text-slate-300 text-sm">非常優雅的設計 -- 自己就是自己的使用者。</p>
        </div>
      </div>
    ),
    code: `# 看 kube-system 裡的管理組件
kubectl get pods -n kube-system

# 看 Node 詳細資訊
kubectl describe node minikube
# 重點看：Container Runtime（containerd）、Capacity、Allocatable`,
    notes: `在 kube-system 裡親眼看到 etcd、API Server、Scheduler、Controller Manager、kube-proxy、CoreDNS 都是以 Pod 形式在跑。describe node 看 Container Runtime 是 containerd。`,
  },

  // ── 4-8（2/2）：Namespace + Dashboard + Docker 對照 ──
  {
    title: 'Namespace + Dashboard + 指令對照',
    subtitle: '叢集裡的「資料夾」',
    section: '4-8：探索叢集',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Namespace = 叢集裡的資料夾</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Namespace</th>
                <th className="pb-2">用途</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">default</td>
                <td className="py-2">你的 Pod 預設放這裡</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kube-system</td>
                <td className="py-2">K8s 管理組件</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">kube-public</td>
                <td className="py-2">公開可讀資訊</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-slate-400">kube-node-lease</td>
                <td className="py-2">Node 心跳記錄</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Docker vs kubectl 對照</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Docker</th>
                <th className="pb-2">kubectl</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker run nginx</code></td>
                <td className="py-2"><code className="text-green-400">kubectl run nginx --image=nginx</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker ps</code></td>
                <td className="py-2"><code className="text-green-400">kubectl get pods</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker logs</code></td>
                <td className="py-2"><code className="text-green-400">kubectl logs &lt;pod&gt;</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker exec -it</code></td>
                <td className="py-2"><code className="text-green-400">kubectl exec -it &lt;pod&gt; -- bash</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker stop / rm</code></td>
                <td className="py-2"><code className="text-green-400">kubectl delete pod &lt;pod&gt;</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4"><code>docker inspect</code></td>
                <td className="py-2"><code className="text-green-400">kubectl describe pod &lt;pod&gt;</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Namespace
kubectl get ns

# Dashboard（瀏覽器打開）
minikube dashboard`,
    notes: `Namespace 像資料夾，最常用 default 和 kube-system。Dashboard 是圖形介面。Docker vs kubectl 對照表幾乎一對一，唯一差異是 exec 要加 -- 雙減號。`,
  },

  // ============================================================
  // 4-9：YAML 格式 + Pod 概念（2 張）
  // ============================================================

  // ── 4-9（1/2）：YAML 三規則 + 四大欄位 ──
  {
    title: 'YAML 格式：三規則 + 四大欄位',
    subtitle: '告訴 K8s「我要什麼」的語言',
    section: '4-9：YAML 格式 + Pod 概念',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">YAML 三大規則（踩坑率最高）</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>縮排用<strong className="text-white">空格</strong>，<strong className="text-red-400">絕對不能用 Tab</strong>（VS Code 右下角設 Spaces: 2）</li>
            <li>冒號後面<strong className="text-white">一定要空格</strong>：<code>name: my-pod</code> 不是 <code>name:my-pod</code></li>
            <li>列表用<strong className="text-white">減號 + 空格</strong>：<code>- name: nginx</code></li>
          </ol>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">K8s YAML 四大必備欄位</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">欄位</th>
                <th className="pb-2 pr-4">意義</th>
                <th className="pb-2">記法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">apiVersion</td>
                <td className="py-2 pr-4">用哪個 API 版本</td>
                <td className="py-2">用什麼語言溝通</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">kind</td>
                <td className="py-2 pr-4">建什麼類型資源</td>
                <td className="py-2">建什麼東西</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">metadata</td>
                <td className="py-2 pr-4">名稱 + 標籤</td>
                <td className="py-2">叫什麼名字</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-blue-400 font-semibold">spec</td>
                <td className="py-2 pr-4">規格（Image、Port、Volume...）</td>
                <td className="py-2">長什麼樣子</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    code: `# Pod YAML 基本結構
apiVersion: v1            # API 版本
kind: Pod                 # 資源類型
metadata:                 # 中繼資料
  name: my-nginx          #   Pod 名稱
  labels:                 #   標籤（Service 靠它找 Pod）
    app: nginx
spec:                     # 規格
  containers:             #   容器列表
    - name: nginx         #     容器名稱
      image: nginx:1.27   #     Docker Image
      ports:
        - containerPort: 80`,
    notes: `YAML 三規則：空格不能 Tab、冒號後空格、減號列表。四大欄位：apiVersion（API 版本）、kind（資源類型）、metadata（名字標籤）、spec（規格）。對照 Docker Compose 的 YAML 來理解。`,
  },

  // ── 4-9（2/2）：apiVersion 速查 + Pod 概念 + Docker 對照 ──
  {
    title: 'apiVersion 速查 + Pod 概念',
    subtitle: '不用背，查一下就好',
    section: '4-9：YAML 格式 + Pod 概念',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">apiVersion 常見值</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">資源類型</th>
                <th className="pb-2">apiVersion</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Pod / Service / ConfigMap / Secret</td>
                <td className="py-2 text-green-400 font-semibold">v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Deployment / ReplicaSet / DaemonSet</td>
                <td className="py-2 text-green-400 font-semibold">apps/v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">CronJob</td>
                <td className="py-2 text-green-400 font-semibold">batch/v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4">Ingress</td>
                <td className="py-2 text-green-400 font-semibold">networking.k8s.io/v1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">Pod 重點複習</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>K8s <strong className="text-white">最小部署單位</strong>（不是 Container）</li>
            <li>同 Pod 容器共享網路（localhost）+ 儲存（Volume）</li>
            <li>Sidecar 模式：主容器 + 輔助容器（日誌收集 / Proxy）</li>
            <li>最佳實踐：<strong className="text-white">一個 Pod 一個容器</strong></li>
          </ul>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-1">Docker Compose vs K8s YAML</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>Compose 的 <code>version: "3"</code> → K8s 的 <code>apiVersion</code></li>
            <li>Compose 一個檔案描述整套系統 → K8s <strong className="text-white">一個檔案一個資源</strong></li>
          </ul>
        </div>
      </div>
    ),
    notes: `apiVersion 速查表：Pod/Service/ConfigMap = v1, Deployment = apps/v1, Ingress = networking.k8s.io/v1。Docker Compose 一檔多服務，K8s 一檔一資源。`,
  },

  // ============================================================
  // 4-10：第一個 Pod 完整 CRUD（2 張 + 1 張學員實作）
  // ============================================================

  // ── 4-10（1/2）：pod.yaml 完整範例 ──
  {
    title: '第一個 Pod：pod.yaml',
    subtitle: '逐行解釋每一行',
    section: '4-10：第一個 Pod CRUD',
    duration: '7',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">逐行說明</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">行</th>
                <th className="pb-2 pr-4">內容</th>
                <th className="pb-2">說明</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">1</td>
                <td className="py-1 pr-4"><code>apiVersion: v1</code></td>
                <td className="py-1">Pod 固定用 v1</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">2</td>
                <td className="py-1 pr-4"><code>kind: Pod</code></td>
                <td className="py-1">建 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">4</td>
                <td className="py-1 pr-4"><code>name: my-nginx</code></td>
                <td className="py-1">只能小寫 + 數字 + 減號</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">6</td>
                <td className="py-1 pr-4"><code>app: nginx</code></td>
                <td className="py-1">標籤，Service 靠它找 Pod</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">10</td>
                <td className="py-1 pr-4"><code>image: nginx:1.27</code></td>
                <td className="py-1">永遠寫明確版本號</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-1 pr-4 text-slate-500">12</td>
                <td className="py-1 pr-4"><code>containerPort: 80</code></td>
                <td className="py-1">文件記錄（不寫也能跑）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">apply vs create</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl create</code>：只能建立，已存在會報錯</li>
            <li><code className="text-green-400">kubectl apply</code>：不存在就建、存在就更新。<strong className="text-white">統一用 apply</strong></li>
          </ul>
        </div>
      </div>
    ),
    code: `# pod.yaml
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
        - containerPort: 80`,
    notes: `逐行解釋 pod.yaml。name 只能小寫 + 數字 + 減號。image 寫明確版本號（不用 latest）。containerPort 是文件記錄，不寫也能跑。統一用 apply 不用 create。`,
  },

  // ── 4-10（2/2）：CRUD 流程 ──
  {
    title: 'Pod 完整 CRUD + Docker 對照',
    subtitle: 'apply → get → describe → logs → exec → delete',
    section: '4-10：第一個 Pod CRUD',
    duration: '8',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">CRUD 流程</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li><code className="text-green-400">kubectl apply -f pod.yaml</code> -- 建立（C）</li>
            <li><code className="text-green-400">kubectl get pods</code> -- 看狀態（R）</li>
            <li><code className="text-green-400">kubectl get pods -o wide</code> -- 看 IP + Node</li>
            <li><code className="text-green-400">kubectl describe pod my-nginx</code> -- <strong className="text-white">重點看 Events</strong></li>
            <li><code className="text-green-400">kubectl logs my-nginx</code> -- 看日誌</li>
            <li><code className="text-green-400">kubectl exec -it my-nginx -- /bin/sh</code> -- 進容器</li>
            <li>改 YAML → <code className="text-green-400">kubectl apply -f pod.yaml</code> -- 更新（U）</li>
            <li><code className="text-green-400">kubectl delete pod my-nginx</code> -- 刪除（D）</li>
          </ol>
        </div>

        <div className="bg-amber-900/30 border border-amber-500/40 p-4 rounded-lg">
          <p className="text-amber-400 font-semibold mb-2">注意：exec 的雙減號 --</p>
          <p className="text-slate-300 text-sm">kubectl exec -it my-nginx <strong className="text-white">--</strong> /bin/sh</p>
          <p className="text-slate-400 text-xs mt-1">雙減號告訴 kubectl：後面是容器指令，不是 kubectl 的參數。Docker 不用加這個。</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">describe Events = 排錯最好朋友</p>
          <p className="text-slate-300 text-sm">Scheduled → Pulling → Pulled → Created → Started。卡在 Pulling = 網路或 Image 名錯。</p>
        </div>
      </div>
    ),
    code: `# 建工作目錄
mkdir -p ~/k8s-labs && cd ~/k8s-labs

# 部署
kubectl apply -f pod.yaml       # pod/my-nginx created
kubectl get pods                # STATUS: Running, READY: 1/1
kubectl get pods -o wide        # 看 IP + NODE

# 查看 + 進容器
kubectl describe pod my-nginx   # 重點看最下面 Events
kubectl logs my-nginx
kubectl exec -it my-nginx -- /bin/sh
  # 進去後：curl localhost 或 cat /usr/share/nginx/html/index.html
  # exit 離開

# 清理
kubectl delete pod my-nginx`,
    notes: `完整 CRUD：apply 建、get 看、describe 查詳情（Events 最重要）、logs 看日誌、exec 進容器、delete 刪除。exec 記得加 -- 雙減號。describe Events 是排錯第一步。`,
  },

  // ── 4-10 學員實作題目 ──
  {
    title: '學員實作：Pod 練習',
    subtitle: '兩道題鞏固 CRUD',
    section: '4-10：第一個 Pod CRUD',
    duration: '10',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 1：httpd:2.4 Pod（基礎）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li>複製 pod.yaml → <code>httpd-pod.yaml</code></li>
            <li>name 改 <code>my-httpd</code>、image 改 <code className="text-green-400">httpd:2.4</code>、containerPort 改 <code>80</code></li>
            <li><code>kubectl apply -f httpd-pod.yaml</code> 部署</li>
            <li>進容器 → <code>cat /usr/local/apache2/htdocs/index.html</code>（看到 "It works!"）</li>
            <li>或 <code>kubectl port-forward pod/my-httpd 8080:80</code> → 瀏覽器 localhost:8080</li>
            <li>做完 <code>kubectl delete pod my-httpd</code></li>
          </ul>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-2">題目 2：修改 nginx 歡迎頁（進階）</p>
          <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
            <li><code>kubectl apply -f pod.yaml</code> 建 my-nginx</li>
            <li>進容器 → <code>echo "Hello Kubernetes" &gt; /usr/share/nginx/html/index.html</code></li>
            <li>exit → <code>kubectl port-forward my-nginx 8080:80</code></li>
            <li>瀏覽器打開 <code>http://localhost:8080</code> 看到 "Hello Kubernetes"</li>
            <li>Ctrl+C 停止 → 想一想：<strong className="text-white">刪掉 Pod 再重建，改的內容還在嗎？</strong></li>
          </ul>
        </div>
      </div>
    ),
    notes: `兩道練習題。題目一：httpd Pod，練習改 YAML 和 CRUD 流程。題目二：修改 nginx 歡迎頁 + port-forward 驗證，思考 Pod 刪除後資料是否還在（不在，因為沒掛 Volume）。`,
  },

  // ============================================================
  // 4-11：回頭操作 + 上午總結（2 張）
  // ============================================================

  // ── 4-11（1/2）：常見踩坑 + 上午回顧 ──
  {
    title: '常見踩坑三兄弟 + 上午回顧',
    subtitle: '初學者最容易犯的錯',
    section: '4-11：上午總結',
    duration: '5',
    content: (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">常見踩坑</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">坑</th>
                <th className="pb-2 pr-4">症狀</th>
                <th className="pb-2">解法</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">1. YAML 縮排</td>
                <td className="py-2 pr-4"><code>error parsing</code></td>
                <td className="py-2">每層 2 空格，不混用 Tab</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">2. exec 忘加 --</td>
                <td className="py-2 pr-4">指令報錯</td>
                <td className="py-2"><code>exec -it pod <strong>--</strong> /bin/sh</code></td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-red-400 font-bold">3. Image tag</td>
                <td className="py-2 pr-4"><code>ImagePullBackOff</code></td>
                <td className="py-2">寫明確版本號，不用 latest</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">上午回顧</p>
          <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
            <li>Docker 五大瓶頸 → 為什麼需要 K8s</li>
            <li>八大核心概念（Pod / Service / Ingress / ConfigMap / Secret / Volume / Deployment / StatefulSet）</li>
            <li>Master-Worker 架構（4 + 3 組件）</li>
            <li>minikube 環境 + kube-system 探索</li>
            <li>YAML 四大欄位 + 第一個 Pod CRUD</li>
          </ol>
          <p className="text-slate-400 text-xs mt-2">從「為什麼需要 K8s」到「跑出第一個 Pod」，完整脈絡</p>
        </div>
      </div>
    ),
    notes: `三大踩坑：YAML 縮排（Tab vs 空格）、exec 忘加雙減號、Image tag 拼錯或用 latest。上午完整脈絡：Docker 瓶頸 → 八概念 → 架構 → 環境 → YAML → 第一個 Pod。`,
  },

  // ── 4-11（2/2）：下午預告 ──
  {
    title: '下午預告：4 個 Loop 實作',
    subtitle: '概念 → 示範 → 練習 → 回頭操作',
    section: '4-11：上午總結',
    duration: '3',
    content: (
      <div className="space-y-4">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <p className="text-cyan-400 font-semibold mb-3">Loop 結構（每個 Loop 都有練習時間）</p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap mb-3">
            <span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded">概念影片</span>
            <span className="text-slate-500">→</span>
            <span className="bg-green-900/40 text-green-300 px-3 py-1 rounded">實作示範</span>
            <span className="text-slate-500">→</span>
            <span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded">學員練習</span>
            <span className="text-slate-500">→</span>
            <span className="bg-amber-900/40 text-amber-300 px-3 py-1 rounded">回頭操作</span>
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="pb-2 pr-4">Loop</th>
                <th className="pb-2">主題</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 1</td>
                <td className="py-2">Pod 生命週期 + 排錯（故意寫錯 YAML / Image 名字）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 2</td>
                <td className="py-2">多容器 Pod + Sidecar 模式（nginx + busybox 共享日誌）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 3</td>
                <td className="py-2">kubectl 進階（port-forward、dry-run、日常必用）</td>
              </tr>
              <tr className="border-t border-slate-700">
                <td className="py-2 pr-4 text-cyan-400 font-bold">Loop 4</td>
                <td className="py-2">環境變數 + MySQL Pod（ConfigMap / Secret 注入）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
          <p className="text-green-400 font-semibold mb-1">不用擔心掉隊</p>
          <p className="text-slate-300 text-sm">做完的同學可以先往下看，沒做完的同學在<strong className="text-white">回頭操作</strong>環節跟著做。</p>
        </div>
      </div>
    ),
    notes: `下午用 Loop 結構：概念 → 示範 → 練習 → 回頭操作。四個 Loop：排錯、Sidecar、kubectl 進階、環境變數。每個 Loop 有練習時間，不用擔心掉隊。`,
  },
]
