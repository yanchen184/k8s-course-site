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

// 從 URL hash 取得初始課程 index
function getLessonIndexFromHash(): number {
  const hash = window.location.hash.replace('#', '')
  const idx = LESSONS.findIndex(l => l.id === hash)
  return idx >= 0 ? idx : 0
}

function App() {
  const [currentLesson, setCurrentLesson] = useState(getLessonIndexFromHash)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [slides, setSlides] = useState<Slide[]>([])

  const loadSlides = useCallback(async () => {
    const lesson = LESSONS[currentLesson]
    const slides = await lesson.getSlides()
    setSlides(slides)
  }, [currentLesson])

  useEffect(() => {
    loadSlides()
  }, [loadSlides])

  return (
    <div>
      <h1>{LESSONS[currentLesson].title}</h1>
      <div>{slides.map((slide, index) => <div key={index}>{slide.title}</div>)}</div>
    </div>
  )
}

export default App;