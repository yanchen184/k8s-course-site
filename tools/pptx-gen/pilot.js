// Pilot: Day 6 morning slide「今天的目標 — 從醜陋的 NodePort 到正常的 URL」
// 還原 React 投影深色主題：slate-900 背景、紅綠對比框、cyan/amber accent、JetBrains Mono code

import pptxgen from 'pptxgenjs'

const pres = new pptxgen()

// 16:9 寬螢幕（現代投影機標準）
pres.layout = 'LAYOUT_WIDE' // 13.33 x 7.5 inches

// ── 色票（對應原 React tailwind 色）──
const COLOR = {
  bg:         '0F172A', // slate-900
  panel:      '1E293B', // slate-800
  border:     '334155', // slate-700
  textMain:   'E2E8F0', // slate-200
  textMuted:  '94A3B8', // slate-400
  accent:     '06B6D4', // cyan-500
  amber:      'F59E0B', // amber-500
  redBg:      '450A0A', // red-950 (深一點易看)
  redBorder:  'EF4444', // red-500
  redText:    'F87171', // red-400
  greenBg:    '052E16', // green-950
  greenBorder:'10B981', // emerald-500
  greenText:  '34D399', // emerald-400
  cyan:       '22D3EE', // cyan-400
}

const FONT = {
  title:  'PingFang TC',     // macOS 預設中文字
  body:   'PingFang TC',
  mono:   'JetBrains Mono',  // 若沒裝，PowerPoint 會 fallback 至 Consolas/Menlo
}

// ── Slide ──
const slide = pres.addSlide()
slide.background = { color: COLOR.bg }

// 標題列
slide.addText('今天的目標 — 從醜陋的 NodePort 到正常的 URL', {
  x: 0.5, y: 0.35, w: 12.3, h: 0.6,
  fontFace: FONT.title, fontSize: 28, bold: true, color: COLOR.textMain,
})
slide.addText('一個 IP，標準 80 Port，用路徑或域名區分服務', {
  x: 0.5, y: 0.95, w: 12.3, h: 0.4,
  fontFace: FONT.body, fontSize: 16, color: COLOR.cyan,
})

// 分隔細線
slide.addShape(pres.ShapeType.line, {
  x: 0.5, y: 1.45, w: 12.3, h: 0,
  line: { color: COLOR.border, width: 1 },
})

// section / duration（左下角頁腳）
slide.addText('6-2：Ingress 概念  ·  ⏱ 2 分鐘', {
  x: 0.5, y: 7.05, w: 12.3, h: 0.3,
  fontFace: FONT.body, fontSize: 11, color: COLOR.textMuted,
})

// ── 紅框：現在的狀況 (NodePort) ──
const redY = 1.75
const redH = 1.4

slide.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: redY, w: 12.3, h: redH,
  fill: { color: COLOR.redBg },
  line: { color: COLOR.redBorder, width: 1 },
  rectRadius: 0.08,
})
slide.addText('現在的狀況（NodePort）', {
  x: 0.8, y: redY + 0.15, w: 6, h: 0.4,
  fontFace: FONT.body, fontSize: 16, bold: true, color: COLOR.redText,
})
slide.addText('http://192.168.1.100:30080', {
  x: 0.8, y: redY + 0.55, w: 8, h: 0.45,
  fontFace: FONT.mono, fontSize: 18, color: COLOR.redText,
})
slide.addText('使用者要記 IP + Port → 不可接受', {
  x: 0.8, y: redY + 1.0, w: 10, h: 0.3,
  fontFace: FONT.body, fontSize: 12, color: COLOR.textMuted,
})

// ── 綠框：今天做完的樣子 (Ingress) ──
const greenY = redY + redH + 0.3
const greenH = 3.3

slide.addShape(pres.ShapeType.roundRect, {
  x: 0.5, y: greenY, w: 12.3, h: greenH,
  fill: { color: COLOR.greenBg },
  line: { color: COLOR.greenBorder, width: 1 },
  rectRadius: 0.08,
})
slide.addText('今天做完的樣子（Ingress）', {
  x: 0.8, y: greenY + 0.15, w: 6, h: 0.4,
  fontFace: FONT.body, fontSize: 16, bold: true, color: COLOR.greenText,
})

// 表格：4 列 × 2 欄
const tableY = greenY + 0.65
const rows = [
  ['curl http://<NODE-IP>/frontend',  '→ Message: Hello from frontend', COLOR.greenText],
  ['curl http://<NODE-IP>/api',       '→ Message: Hello from api',      COLOR.greenText],
  ['curl http://www.myapp.local',     '→ Message: Hello from frontend', COLOR.cyan],
  ['curl http://api.myapp.local',     '→ Message: Hello from api',      COLOR.cyan],
]

const tableData = rows.map(([cmd, resp, cmdColor]) => [
  { text: cmd,  options: { fontFace: FONT.mono, fontSize: 13, color: cmdColor, valign: 'middle' } },
  { text: resp, options: { fontFace: FONT.mono, fontSize: 13, color: COLOR.textMuted, valign: 'middle' } },
])

slide.addTable(tableData, {
  x: 0.8, y: tableY, w: 11.7,
  colW: [5.5, 6.2],
  rowH: 0.45,
  border: { type: 'solid', color: COLOR.border, pt: 0.5 },
  fill: { color: COLOR.panel },
})

slide.addText('同一個 IP + Port 80，用路徑或域名分流', {
  x: 0.8, y: greenY + greenH - 0.45, w: 11, h: 0.3,
  fontFace: FONT.body, fontSize: 12, color: COLOR.textMuted, italic: true,
})

// 頁碼右下
slide.addText('Day 6 · pilot', {
  x: 11, y: 7.05, w: 1.8, h: 0.3,
  fontFace: FONT.body, fontSize: 11, color: COLOR.textMuted, align: 'right',
})

// 寫檔
await pres.writeFile({ fileName: 'output/pilot.pptx' })
console.log('✅ output/pilot.pptx 已產出')
