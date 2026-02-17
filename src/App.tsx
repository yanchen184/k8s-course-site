import { useState, useEffect, useCallback, useMemo } from 'react'
import { slides as lesson1MorningSlides } from './slides/lesson1-morning/index'
import type { Slide } from './slides/lesson1-morning/index'

// 課程列表
const LESSONS = [
  {
    id: 'lesson1-morning',
    label: '第一堂 早上',
    title: 'Linux 操作入門',
    time: '09:00–12:00',
    day: '第一天',
    getSlides: () => Promise.resolve(lesson1MorningSlides),
  },
  {
    id: 'lesson1-afternoon',
    label: '第一堂 下午',
    title: 'Linux 基本操作',
    time: '13:00–16:00',
    day: '第一天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson1-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson2-morning',
    label: '第二堂 早上',
    title: '程式與服務管理',
    time: '09:00–12:00',
    day: '第二天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson2-morning/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson2-afternoon',
    label: '第二堂 下午',
    title: 'Docker 入門',
    time: '13:00–17:00',
    day: '第二天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson2-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson3-morning',
    label: '第三堂 早上',
    title: '容器進階操作',
    time: '09:00–12:00',
    day: '第三天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson3-morning/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson3-afternoon',
    label: '第三堂 下午',
    title: '容器資料管理',
    time: '13:00–17:00',
    day: '第三天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson3-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson4-morning',
    label: '第四堂 早上',
    title: 'Kubernetes 架構',
    time: '09:00–12:00',
    day: '第四天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson4-morning/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson4-afternoon',
    label: '第四堂 下午',
    title: 'K8s 基本操作',
    time: '13:00–17:00',
    day: '第四天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson4-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson5-morning',
    label: '第五堂 早上',
    title: '工作負載管理',
    time: '09:00–12:00',
    day: '第五天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson5-morning/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson5-afternoon',
    label: '第五堂 下午',
    title: '服務暴露',
    time: '13:00–17:00',
    day: '第五天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson5-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson6-morning',
    label: '第六堂 早上',
    title: '組態管理',
    time: '09:00–12:00',
    day: '第六天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson6-morning/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson6-afternoon',
    label: '第六堂 下午',
    title: '資料儲存',
    time: '13:00–17:00',
    day: '第六天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson6-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson7-morning',
    label: '第七堂 早上',
    title: '安全與監控',
    time: '09:00–12:00',
    day: '第七天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson7-morning/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
  {
    id: 'lesson7-afternoon',
    label: '第七堂 下午',
    title: '實戰演練與課程總結',
    time: '13:00–17:00',
    day: '第七天',
    getSlides: async () => {
      try { const m = await import('./slides/lesson7-afternoon/index'); return m.slides }
      catch { return [{ title: '準備中...', subtitle: '內容建立中', notes: '', duration: '1' }] }
    },
  },
]

// Sidebar 章節條目
interface SectionEntry {
  name: string
  firstIndex: number
  slideCount: number
  totalMinutes: number
  totalExpectedChars: number
  totalActualChars: number
}

function buildSections(slides: Slide[]): SectionEntry[] {
  const map = new Map<string, SectionEntry>()
  slides.forEach((slide, index) => {
    const name = slide.section || '未分類'
    if (!map.has(name)) {
      map.set(name, { name, firstIndex: index, slideCount: 0, totalMinutes: 0, totalExpectedChars: 0, totalActualChars: 0 })
    }
    const entry = map.get(name)!
    const dur = parseInt(slide.duration || '2')
    entry.slideCount++
    entry.totalMinutes += dur
    entry.totalExpectedChars += dur * 150
    entry.totalActualChars += (slide.notes || '').length
  })
  return Array.from(map.values())
}

function App() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showQA, setShowQA] = useState(false)
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set())
  const [slides, setSlides] = useState<Slide[]>(lesson1MorningSlides)
  const [loading, setLoading] = useState(false)

  // 載入課程
  useEffect(() => {
    const lesson = LESSONS[currentLesson]
    setLoading(true)
    setCurrentSlide(0)
    lesson.getSlides().then((s) => {
      setSlides(s as Slide[])
      setLoading(false)
    })
  }, [currentLesson])

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index)
    }
  }, [slides.length])

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault(); nextSlide()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault(); prevSlide()
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes(prev => !prev)
      } else if (e.key === 'm' || e.key === 'M') {
        setShowMenu(prev => !prev)
      } else if (e.key === 'b' || e.key === 'B') {
        setSidebarOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setShowMenu(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  const slide: Slide = slides[currentSlide] || slides[0]
  const lesson = LESSONS[currentLesson]
  const sections = useMemo(() => buildSections(slides), [slides])

  // 解析所有投影片 notes 中的 Q&A
  const qaItems = useMemo(() => {
    const marker = '\u3010\u9810\u671f\u96e3\u641e\u5b78\u54e1\u554f\u984c'
    const items: { q: string; a: string }[] = []
    slides.forEach(slide => {
      const notes = slide.notes || ''
      const idx = notes.indexOf(marker)
      if (idx === -1) return
      const qaText = notes.slice(idx)
      const lines = qaText.split('\n')
      let currentQ = ''
      let currentA = ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('Q\uff1a') || trimmed.startsWith('Q:')) {
          if (currentQ && currentA) items.push({ q: currentQ, a: currentA })
          currentQ = trimmed.replace(/^Q[：:]/, '').trim()
          currentA = ''
        } else if (trimmed.startsWith('A\uff1a') || trimmed.startsWith('A:')) {
          currentA = trimmed.replace(/^A[：:]/, '').trim()
        } else if (currentA && trimmed) {
          currentA += ' ' + trimmed
        }
      }
      if (currentQ && currentA) items.push({ q: currentQ, a: currentA })
    })
    return items
  }, [slides])

  // 計算時間
  const totalMinutes = slides.reduce((sum, s) => sum + parseInt(s.duration || '2'), 0)
  const currentMinutes = slides.slice(0, currentSlide).reduce((sum, s) => sum + parseInt(s.duration || '2'), 0)

  // 按天分組課程
  const days = Array.from(new Set(LESSONS.map(l => l.day)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">

      {/* ===== LEFT SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-[420px]' : 'w-0 overflow-hidden'
        }`}
        style={{ background: 'rgba(15,23,42,0.97)', borderRight: '1px solid rgba(51,65,85,0.7)' }}
      >
        {/* Sidebar header */}
        <div className="p-5 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">☸️</span>
            <span className="text-white font-bold text-xl">K8s 課程大綱</span>
          </div>
          <p className="text-slate-400 text-base mt-1">{lesson.label} · {lesson.title}</p>
        </div>

        {/* 課程切換（依天分組，可收合） */}
        <div className="p-4 border-b border-slate-700/50 flex-shrink-0">
          {/* 全部收合 / 展開 按鈕 */}
          <button
            onClick={() => {
              const allCollapsed = days.every(d => collapsedDays.has(d))
              if (allCollapsed) {
                // 展開全部，但只展開當前天
                const currentDay = LESSONS[currentLesson].day
                setCollapsedDays(new Set(days.filter(d => d !== currentDay)))
              } else {
                // 收合全部，只保留當前天
                const currentDay = LESSONS[currentLesson].day
                setCollapsedDays(new Set(days.filter(d => d !== currentDay)))
              }
            }}
            className="w-full mb-3 px-4 py-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-600/70 border border-slate-600/50 text-slate-300 text-base font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>{days.every(d => d === LESSONS[currentLesson].day || collapsedDays.has(d)) ? '📂 展開所有課程' : '📁 只顯示本堂課'}</span>
          </button>
          {days.map(day => {
            const isCollapsed = collapsedDays.has(day)
            const hasActiveLesson = LESSONS.some(l => l.day === day && LESSONS.indexOf(l) === currentLesson)
            return (
              <div key={day} className="mb-2">
                <button
                  onClick={() => setCollapsedDays(prev => {
                    const next = new Set(prev)
                    if (next.has(day)) next.delete(day)
                    else next.add(day)
                    return next
                  })}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors hover:bg-slate-700/50 ${
                    hasActiveLesson ? 'text-blue-300' : 'text-slate-400'
                  }`}
                >
                  <span className="text-sm font-bold uppercase tracking-wider">{day}</span>
                  <span className="text-base">{isCollapsed ? '▶' : '▼'}</span>
                </button>
                {!isCollapsed && (
                  <div className="space-y-1 mt-1">
                    {LESSONS.filter(l => l.day === day).map((l) => {
                      const idx = LESSONS.indexOf(l)
                      return (
                        <button
                          key={l.id}
                          onClick={() => setCurrentLesson(idx)}
                          className={`w-full text-left px-3 py-2 rounded text-base transition-colors ${
                            idx === currentLesson
                              ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-600/40'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                          }`}
                        >
                          <span className="font-medium">{l.label}</span>
                          <span className="text-slate-500 ml-1">· {l.title}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 章節大綱（本堂課） */}
        <div className="flex-1 overflow-y-auto py-3">
          <p className="text-slate-500 text-sm uppercase tracking-wider px-5 mb-3">章節大綱</p>
          {loading ? (
            <div className="px-5 text-slate-500 text-lg">載入中...</div>
          ) : (
            <div className="space-y-0.5">
              {sections.map((section) => {
                const isCurrent = currentSlide >= section.firstIndex &&
                  (sections[sections.indexOf(section) + 1]
                    ? currentSlide < sections[sections.indexOf(section) + 1].firstIndex
                    : true)

                return (
                  <button
                    key={section.name}
                    onClick={() => goToSlide(section.firstIndex)}
                    className={`w-full text-left px-5 py-3 transition-all group ${
                      isCurrent
                        ? 'bg-blue-600/20 border-l-4 border-blue-500'
                        : 'hover:bg-slate-700/40 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-semibold leading-tight ${
                        isCurrent ? 'text-blue-300' : 'text-slate-300 group-hover:text-white'
                      }`}>
                        {section.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 text-sm">{section.totalMinutes} 分鐘</span>
                      <span className="text-slate-600 text-sm">·</span>
                      <span className="text-slate-500 text-sm">{section.slideCount} 張</span>
                    </div>
                    {/* 演講稿字數統計 */}
                    <div className="mt-2 space-y-1 bg-slate-800/50 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm font-medium">預計</span>
                        <span className="text-slate-300 text-sm font-bold">{section.totalExpectedChars.toLocaleString()} 字</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm font-medium">實際</span>
                        <span className={`text-sm font-bold ${
                          section.totalActualChars >= section.totalExpectedChars * 0.8
                            ? 'text-green-400'
                            : section.totalActualChars >= section.totalExpectedChars * 0.5
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}>
                          {section.totalActualChars.toLocaleString()} 字
                        </span>
                      </div>
                      {/* 進度條 */}
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all ${
                            section.totalActualChars >= section.totalExpectedChars * 0.8
                              ? 'bg-green-500'
                              : section.totalActualChars >= section.totalExpectedChars * 0.5
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (section.totalActualChars / section.totalExpectedChars) * 100)}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${
                          section.totalActualChars >= section.totalExpectedChars * 0.8
                            ? 'text-green-400'
                            : 'text-slate-500'
                        }`}>
                          {section.totalExpectedChars > 0
                            ? `${Math.round((section.totalActualChars / section.totalExpectedChars) * 100)}%`
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 演講稿總字數統計 */}
        {(() => {
          const totalExpected = slides.reduce((sum, s) => sum + parseInt(s.duration || '2') * 150, 0)
          const totalActual = slides.reduce((sum, s) => sum + (s.notes || '').length, 0)
          const pct = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0
          return (
            <div className="px-5 py-4 border-t border-slate-700/50 flex-shrink-0">
              <p className="text-slate-400 text-base font-semibold uppercase tracking-wider mb-3">📝 演講稿總計</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-base">預計字數</span>
                  <span className="text-slate-200 text-base font-bold">{totalExpected.toLocaleString()} 字</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-base">實際字數</span>
                  <span className={`text-base font-bold ${pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {totalActual.toLocaleString()} 字
                  </span>
                </div>
                <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <div className="text-right text-base font-semibold text-slate-400">{pct}% 完成</div>
              </div>
            </div>
          )
        })()}

        {/* ❓ Q&A 學員預期問題 */}
        {qaItems.length > 0 && (
          <div className="border-t border-slate-700/50 flex-shrink-0">
            <button
              onClick={() => setShowQA(prev => !prev)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-slate-400 text-base font-semibold uppercase tracking-wider">
                ❓ 學員預期問題 ({qaItems.length})
              </span>
              <span className="text-slate-500 text-xl">{showQA ? '▲' : '▼'}</span>
            </button>
            {showQA && (
              <div className="px-4 pb-4 space-y-3 max-h-[50vh] overflow-y-auto">
                {qaItems.map((item, i) => (
                  <div key={i} className="bg-slate-800/60 rounded-lg overflow-hidden border border-slate-700/50">
                    <div className="px-4 py-3 bg-blue-900/30 border-b border-slate-700/50">
                      <p className="text-blue-300 text-base font-semibold leading-snug">Q：{item.q}</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 進度 */}
        <div className="px-5 py-4 border-t border-slate-700/50 flex-shrink-0">
          <div className="flex justify-between text-base text-slate-400 mb-2">
            <span>投影片進度</span>
            <span className="font-bold">{currentSlide + 1} / {slides.length} 張</span>
          </div>
          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-slate-500 mt-1.5">
            <span>⏱ {currentMinutes} 分</span>
            <span>共 {totalMinutes} 分</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '420px' : '0' }}
      >
        {/* Top progress bar */}
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-700 z-50">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* 課程選擇浮層 */}
        {showMenu && (
          <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center" onClick={() => setShowMenu(false)}>
            <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-white mb-6">📚 選擇課程</h2>
              <div className="grid gap-3">
                {LESSONS.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => { setCurrentLesson(i); setShowMenu(false) }}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      i === currentLesson
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-400 bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${i === currentLesson ? 'text-blue-400' : 'text-white'}`}>{l.label}</span>
                      <span className="text-slate-400 text-sm">{l.time}</span>
                    </div>
                    <p className="text-slate-300 mt-1 text-sm">{l.title}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMenu(false)} className="mt-6 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                關閉（ESC）
              </button>
            </div>
          </div>
        )}

        {/* Slide area */}
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-white pb-24">
          {loading ? (
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-2xl text-slate-300">載入課程中...</p>
            </div>
          ) : (
            <div className="max-w-5xl w-full" key={`${currentLesson}-${currentSlide}`}>
              {/* breadcrumb */}
              <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                <span>{lesson.day}</span>
                <span>›</span>
                <span>{lesson.label}</span>
                {slide.section && (
                  <>
                    <span>›</span>
                    <span className="text-blue-400">{slide.section}</span>
                  </>
                )}
              </div>

              {slide.section && (
                <div className="text-blue-400 text-xl font-semibold mb-3 tracking-wider uppercase">
                  {slide.section}
                </div>
              )}

              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white">
                {slide.title}
              </h1>

              {slide.subtitle && (
                <h2 className="text-3xl md:text-4xl text-slate-300 mb-10">
                  {slide.subtitle}
                </h2>
              )}

              <div className="text-2xl md:text-3xl text-slate-200 space-y-5
                [&_p]:text-2xl [&_li]:text-2xl [&_span]:text-2xl
                [&_code]:text-xl [&_pre]:text-xl
                [&_.text-xs]:!text-lg [&_.text-sm]:!text-xl [&_.text-base]:!text-2xl">
                {slide.content}
              </div>

              {slide.code && (
                <pre className="mt-8 bg-slate-900/80 p-6 rounded-xl overflow-x-auto text-xl border border-slate-700 shadow-inner">
                  <code className="text-green-400 font-mono">{slide.code}</code>
                </pre>
              )}
            </div>
          )}
        </div>

        {/* Speaker notes */}
        {showNotes && slide.notes && (
          <div className="fixed bottom-16 right-4 left-4 md:left-auto md:w-[640px] bg-black/95 backdrop-blur-sm rounded-lg p-6 text-white border border-slate-700 max-h-[45vh] overflow-y-auto z-20 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-blue-400 font-semibold">📝 演講稿</h3>
              <div className="flex gap-4 text-slate-400 text-xs">
                <span>⏱ {slide.duration || '2-3'} 分鐘</span>
                <span className={slide.notes.length >= parseInt(slide.duration || '2') * 150 ? 'text-green-400' : 'text-yellow-400'}>
                  {slide.notes.length} / {parseInt(slide.duration || '2') * 150} 字
                  {slide.notes.length >= parseInt(slide.duration || '2') * 150 ? ' ✅' : ' ⚠️'}
                </span>
              </div>
            </div>
            <div className="text-slate-200 whitespace-pre-line leading-relaxed text-sm">
              {slide.notes}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm border-t border-slate-700/50 z-20" style={{ paddingLeft: sidebarOpen ? '420px' : '0' }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg transition-colors text-slate-300"
                title="切換側邊欄 (B)"
              >
                {sidebarOpen ? '◀' : '▶'}
              </button>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="px-4 py-2 bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
              >
                ← 上一頁
              </button>
            </div>

            <div className="flex items-center gap-3 text-center">
              <span className="text-slate-400 text-sm hidden md:block">{lesson.label}</span>
              <span className="text-slate-600 hidden md:block">·</span>
              <span className="text-slate-400 text-sm">{currentSlide + 1} / {slides.length}</span>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showNotes ? 'bg-blue-600 text-white' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {showNotes ? '收起' : '演講稿'} (N)
              </button>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
            >
              下一頁 →
            </button>
          </div>
        </div>
      </div>

      {/* Slide dots（靠右） */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
        {slides.map((s, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all ${
              index === currentSlide
                ? 'bg-blue-500 w-3 h-3 shadow-lg shadow-blue-500/50'
                : 'bg-slate-600 hover:bg-slate-400 w-2 h-2'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="fixed left-4 bottom-16 text-slate-600 text-xs hidden md:block">
        ← → 換頁 | N 演講稿 | B 側邊欄 | M 課程選單
      </div>
    </div>
  )
}

export default App
