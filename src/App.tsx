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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentLesson(getLessonIndexFromHash())
      setCurrentSlide(0)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const sections = useMemo(() => buildSections(LESSONS[currentLesson].getSlides()), [currentLesson])

  return (
    <div className="flex h-screen">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
      <aside className={`fixed inset-y-0 left-0 bg-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform z-50`}>
        <button className="absolute top-4 right-4 text-gray-600" onClick={toggleSidebar}>X</button>
        <div className="p-4">
          <h2 className="text-lg font-bold">課程章節</h2>
          <ul className="mt-4">
            {sections.map(section => (
              <li key={section.name} className="mt-2">
                <button className="text-left w-full" onClick={() => setCurrentSlide(section.firstIndex)}>
                  {section.name} ({section.slideCount} slides)
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-blue-500 text-white flex justify-between items-center">
          <button className="text-white" onClick={toggleSidebar}>☰</button>
          <h1 className="text-xl">{LESSONS[currentLesson].title}</h1>
          <button className="text-white" onClick={() => setShowNotes(prev => !prev)}>Notes</button>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-2xl font-bold">{LESSONS[currentLesson].getSlides()[currentSlide].title}</h2>
            <p>{LESSONS[currentLesson].getSlides()[currentSlide].content}</p>
          </div>
        </main>
        {showNotes && (
          <aside className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 border-t border-gray-300">
            <h3 className="font-bold">Notes</h3>
            <p>{LESSONS[currentLesson].getSlides()[currentSlide].notes}</p>
          </aside>
        )}
      </div>
    </div>
  )
}

export default App
