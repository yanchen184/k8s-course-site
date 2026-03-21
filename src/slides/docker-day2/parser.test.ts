import { describe, expect, it } from 'vitest'
import courseScheduleRaw from './content/course-schedule.md?raw'
import day2Hour1FullRaw from './content/day2-hour1-full.md?raw'
import day2Hour1Raw from './content/day2-hour1.md?raw'
import day2Hour2FullRaw from './content/day2-hour2-full.md?raw'
import day2Hour2Raw from './content/day2-hour2.md?raw'
import day2Hour3FullRaw from './content/day2-hour3-full.md?raw'
import day2Hour3Raw from './content/day2-hour3.md?raw'
import day2Hour4FullRaw from './content/day2-hour4-full.md?raw'
import day2Hour4Raw from './content/day2-hour4.md?raw'
import day2Hour5FullRaw from './content/day2-hour5-full.md?raw'
import day2Hour5Raw from './content/day2-hour5.md?raw'
import day2Hour6FullRaw from './content/day2-hour6-full.md?raw'
import day2Hour6Raw from './content/day2-hour6.md?raw'
import day2Hour7FullRaw from './content/day2-hour7-full.md?raw'
import day2Hour7Raw from './content/day2-hour7.md?raw'
import day3Hour8FullRaw from './content/day3-hour8-full.md?raw'
import day3Hour8Raw from './content/day3-hour8.md?raw'
import day3Hour9FullRaw from './content/day3-hour9-full.md?raw'
import day3Hour9Raw from './content/day3-hour9.md?raw'
import day3Hour10FullRaw from './content/day3-hour10-full.md?raw'
import day3Hour10Raw from './content/day3-hour10.md?raw'
import day3Hour11FullRaw from './content/day3-hour11-full.md?raw'
import day3Hour11Raw from './content/day3-hour11.md?raw'
import day3Hour12FullRaw from './content/day3-hour12-full.md?raw'
import day3Hour12Raw from './content/day3-hour12.md?raw'
import day3Hour13FullRaw from './content/day3-hour13-full.md?raw'
import day3Hour13Raw from './content/day3-hour13.md?raw'
import day3Hour14FullRaw from './content/day3-hour14-full.md?raw'
import day3Hour14Raw from './content/day3-hour14.md?raw'
import day3Hour15FullRaw from './content/day3-hour15-full.md?raw'
import day3Hour15Raw from './content/day3-hour15.md?raw'
import { buildDockerDay2SlideSpecs, parseCourseSchedule } from './parser'
import type { BulletGroup } from './parser'

const documents = {
  'course-schedule.md': courseScheduleRaw,
  'day2-hour1-full.md': day2Hour1FullRaw,
  'day2-hour1.md': day2Hour1Raw,
  'day2-hour2-full.md': day2Hour2FullRaw,
  'day2-hour2.md': day2Hour2Raw,
  'day2-hour3-full.md': day2Hour3FullRaw,
  'day2-hour3.md': day2Hour3Raw,
  'day2-hour4-full.md': day2Hour4FullRaw,
  'day2-hour4.md': day2Hour4Raw,
  'day2-hour5-full.md': day2Hour5FullRaw,
  'day2-hour5.md': day2Hour5Raw,
  'day2-hour6-full.md': day2Hour6FullRaw,
  'day2-hour6.md': day2Hour6Raw,
  'day2-hour7-full.md': day2Hour7FullRaw,
  'day2-hour7.md': day2Hour7Raw,
  'day3-hour8-full.md': day3Hour8FullRaw,
  'day3-hour8.md': day3Hour8Raw,
  'day3-hour9-full.md': day3Hour9FullRaw,
  'day3-hour9.md': day3Hour9Raw,
  'day3-hour10-full.md': day3Hour10FullRaw,
  'day3-hour10.md': day3Hour10Raw,
  'day3-hour11-full.md': day3Hour11FullRaw,
  'day3-hour11.md': day3Hour11Raw,
  'day3-hour12-full.md': day3Hour12FullRaw,
  'day3-hour12.md': day3Hour12Raw,
  'day3-hour13-full.md': day3Hour13FullRaw,
  'day3-hour13.md': day3Hour13Raw,
  'day3-hour14-full.md': day3Hour14FullRaw,
  'day3-hour14.md': day3Hour14Raw,
  'day3-hour15-full.md': day3Hour15FullRaw,
  'day3-hour15.md': day3Hour15Raw,
}

function group(items: string[], label?: string): BulletGroup {
  return label ? { label, items } : { items }
}

function countItems(groups: BulletGroup[]): number {
  return groups.reduce((total, current) => total + current.items.length, 0)
}

const groupedSummarySections: Array<{ hour: number, title: string, labels: string[] }> = [
  { hour: 1, title: '開場', labels: ['學習路線圖'] },
  { hour: 4, title: '前情提要', labels: [] },
  { hour: 6, title: '前情提要', labels: ['學完指令，用 Nginx 做完整實戰'] },
  { hour: 7, title: '前情提要', labels: ['Day 2 學完'] },
]

describe('docker day 2 parser', () => {
  it('parses the official lecture minutes from the current schedule', () => {
    expect(parseCourseSchedule(courseScheduleRaw)).toEqual([
      { hour: 1, title: '環境一致性問題與容器技術', lectureMinutes: 55 },
      { hour: 2, title: 'Docker 架構與工作原理', lectureMinutes: 55 },
      { hour: 3, title: 'Docker 安裝與環境設置', lectureMinutes: 45 },
      { hour: 4, title: 'Docker 基本指令（上）', lectureMinutes: 50 },
      { hour: 5, title: 'Docker 基本指令（下）', lectureMinutes: 50 },
      { hour: 6, title: 'Nginx 容器實戰', lectureMinutes: 40 },
      { hour: 7, title: '實作練習與 Day2 總結', lectureMinutes: 30 },
      { hour: 8, title: 'Volume 資料持久化', lectureMinutes: 50 },
      { hour: 9, title: '容器網路與 Port Mapping 進階', lectureMinutes: 50 },
      { hour: 10, title: 'Dockerfile 基礎', lectureMinutes: 50 },
      { hour: 11, title: 'Dockerfile 進階與最佳化', lectureMinutes: 50 },
      { hour: 12, title: 'Dockerfile 實戰與映像檔發佈', lectureMinutes: 50 },
      { hour: 13, title: 'Docker Compose 基礎與進階', lectureMinutes: 50 },
      { hour: 14, title: 'Docker Compose 實戰練習', lectureMinutes: 45 },
      { hour: 15, title: '用 Docker 手動模擬 Kubernetes 核心機制', lectureMinutes: 60 },
    ])
  })

  it('builds slide specs with the correct day split and clean notes', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const morningSlides = slides.filter((slide) => slide.phase === 'morning')
    const afternoonSlides = slides.filter((slide) => slide.phase === 'afternoon')

    expect(morningSlides.length).toBeGreaterThan(0)
    expect(afternoonSlides.length).toBeGreaterThan(0)
    expect(new Set(morningSlides.map((slide) => slide.hour))).toEqual(new Set([1, 2, 3, 8, 9, 10]))
    expect(new Set(afternoonSlides.map((slide) => slide.hour))).toEqual(new Set([4, 5, 6, 7, 11, 12, 13, 14, 15]))
    expect(new Set(slides.map((slide) => slide.hour))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]))

    const firstSlide = morningSlides[0]
    expect(firstSlide.section).toBe('Hour 1｜環境一致性問題與容器技術')
    expect(firstSlide.title).toBe('開場')
    expect(firstSlide.duration).not.toBe('0')
    expect(firstSlide.notes).not.toContain('## ')
    expect(firstSlide.notes).not.toContain('```')

    const lastSlide = afternoonSlides[afternoonSlides.length - 1]
    expect(lastSlide.section).toBe('第8小時｜用 Docker 手動模擬 Kubernetes 核心機制')
    expect(lastSlide.notes).not.toContain('## ')
    expect(lastSlide.notes).not.toContain('```')
  })

  it('shows day 3 sections and subtitles starting from the first hour', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const firstDay3MorningSlide = slides.find((slide) => slide.hour === 8)
    const firstDay3AfternoonSlide = slides.find((slide) => slide.hour === 11)

    expect(firstDay3MorningSlide?.section).toBe('第1小時｜Volume 資料持久化')
    expect(firstDay3MorningSlide?.subtitle).toContain('Day 3 上午 · 第1小時')

    expect(firstDay3AfternoonSlide?.section).toBe('第4小時｜Dockerfile 進階與最佳化')
    expect(firstDay3AfternoonSlide?.subtitle).toContain('Day 3 下午 · 第4小時')
  })

  it('adds desktop-vs-engine context to the installation slide without changing the docker CLI path', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const desktopInstallSlide = slides.find((slide) => (
      slide.hour === 3
      && slide.title === 'Windows/Mac 安裝 Docker Desktop'
    ))

    expect(desktopInstallSlide).toBeDefined()
    expect(desktopInstallSlide?.summary).toEqual([group([
      'Docker Desktop 是 Windows/Mac 上最常見的安裝方式，本質上是把 Docker Engine 放進 Linux VM',
      'Linux 可能直接裝 Docker Engine，企業環境也可能碰到 Podman，但後面課程一律用相同的 docker CLI 操作',
      '看到教學只寫 docker run 很正常，因為你其實是在和 Linux 後端溝通，不需要每一步分平台改寫',
    ])])
  })

  it('keeps grouped lead summaries free of dangling labels and within limits', () => {
    const slides = buildDockerDay2SlideSpecs(documents)

    for (const groupedSection of groupedSummarySections) {
      const slide = slides.find((candidate) => (
        candidate.hour === groupedSection.hour
        && candidate.title === groupedSection.title
      ))

      expect(slide, `missing slide ${groupedSection.hour}-${groupedSection.title}`).toBeDefined()
      expect(slide?.summary.length).toBeGreaterThan(0)
      expect(countItems(slide?.summary ?? [])).toBeLessThanOrEqual(3)

      const labels = slide?.summary
        .map((summaryGroup) => summaryGroup.label)
        .filter((label): label is string => Boolean(label)) ?? []

      expect(labels.every((label) => !/[：:]$/.test(label))).toBe(true)

      if (groupedSection.labels.length > 0) {
        expect(slide?.summary.some((summaryGroup) => Boolean(summaryGroup.label))).toBe(true)
      }

      expect(
        labels.every((label) => groupedSection.labels.includes(label)),
        `unexpected labels for ${groupedSection.hour}-${groupedSection.title}: ${labels.join(', ')}`,
      ).toBe(true)

      for (const label of groupedSection.labels) {
        expect(
          slide?.summary.flatMap((summaryGroup) => summaryGroup.items),
          `dangling label leaked into items for ${groupedSection.hour}-${groupedSection.title}: ${label}`,
        ).not.toContain(label)
      }
    }
  })

  it('cleans day 3 nested subsection titles before rendering', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const mysqlProblemSlide = slides.find((slide) => slide.hour === 8 && slide.title === '容器的讀寫層問題')
    const mysqlReuseSlide = slides.find((slide) => slide.hour === 8 && slide.title === '用 Named Volume 啟動 MySQL（正確做法）')
    const buildContextSlide = slides.find((slide) => slide.hour === 11 && slide.title === 'Build Context 的陷阱')

    expect(mysqlProblemSlide).toBeDefined()
    expect(mysqlReuseSlide).toBeDefined()
    expect(buildContextSlide).toBeDefined()
  })

  it('does not leave duplicated punctuation in day 3 summary labels or items', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const duplicatedColonPattern = /：：|::/

    for (const slide of slides.filter((candidate) => candidate.hour >= 8)) {
      for (const summaryGroup of slide.summary) {
        expect(summaryGroup.label ? duplicatedColonPattern.test(summaryGroup.label) : false).toBe(false)

        for (const summaryItem of summaryGroup.items) {
          expect(duplicatedColonPattern.test(summaryItem)).toBe(false)
        }
      }
    }
  })

  it('adds the Day 3 bridge module as the final afternoon lesson', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const bridgeIntroSlide = slides.find((slide) => (
      slide.hour === 15
      && slide.title === '為什麼在 Day 3 最後加這堂'
    ))

    expect(bridgeIntroSlide).toBeDefined()
    expect(bridgeIntroSlide?.section).toBe('第8小時｜用 Docker 手動模擬 Kubernetes 核心機制')
    expect(bridgeIntroSlide?.subtitle).toContain('Day 3 下午 · 第8小時')
  })

  it('falls back to conservative partial title matching when outline headings are shorter', () => {
    const fallbackDocuments = {
      ...documents,
      'day2-hour3.md': day2Hour3Raw
        .replace('## 七、設定映像加速（5 分鐘）', '## 七、映像加速（5 分鐘）')
        .replace('## 八、本堂課小結（2 分鐘）', '## 八、小結（2 分鐘）'),
      'day2-hour7.md': day2Hour7Raw
        .replace('## 二、綜合練習題（30 分鐘）', '## 二、綜合練習（30 分鐘）')
        .replace('## 八、課後作業（自選）', '## 八、課後作業'),
    }
    const slides = buildDockerDay2SlideSpecs(fallbackDocuments)
    const mirrorSlide = slides.find((slide) => slide.hour === 3 && slide.title === '映像加速')
    const practiceSlide = slides.find((slide) => slide.hour === 7 && slide.title === '練習一：基礎操作')
    const homeworkSlide = slides.find((slide) => slide.hour === 7 && slide.title === '課後作業')

    expect(mirrorSlide).toBeDefined()
    expect(mirrorSlide?.notes).toContain('registry-mirrors')

    expect(practiceSlide).toBeDefined()
    expect(practiceSlide?.notes).toContain('查看本機所有映像檔')

    expect(homeworkSlide).toBeDefined()
    expect(homeworkSlide?.notes).toContain('MySQL 啟動範例')
  })

  it('never leaks markdown thematic breaks into summaries, cards, or notes', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const thematicBreakPattern = /^(?:-{3,}|\*{3,}|_{3,}|(?:-\s+){2,}-?|(?:\*\s+){2,}\*?|(?:_\s+){2,}_?)$/
    const notesThematicBreakPattern = /^(?:-{3,}|\*{3,}|_{3,}|(?:-\s+){2,}-?|(?:\*\s+){2,}\*?|(?:_\s+){2,}_?)$/m

    for (const slide of slides) {
      for (const summaryGroup of slide.summary) {
        expect(summaryGroup.label ? thematicBreakPattern.test(summaryGroup.label) : false).toBe(false)

        for (const summaryItem of summaryGroup.items) {
          expect(thematicBreakPattern.test(summaryItem)).toBe(false)
        }
      }

      for (const card of slide.cards) {
        for (const bulletGroup of card.bullets) {
          expect(bulletGroup.label ? thematicBreakPattern.test(bulletGroup.label) : false).toBe(false)

          for (const bullet of bulletGroup.items) {
            expect(thematicBreakPattern.test(bullet)).toBe(false)
          }
        }
      }

      expect(notesThematicBreakPattern.test(slide.notes)).toBe(false)
    }
  })

  it('removes exact summary/card overlaps across every docker slide', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const normalizeComparable = (value: string) => value.replace(/\s+/g, ' ').trim()

    for (const slide of slides) {
      const summaryItems = new Set(
        slide.summary.flatMap((summaryGroup) => summaryGroup.items.map(normalizeComparable)),
      )
      const cardItems = slide.cards.flatMap((card) => (
        card.bullets.flatMap((bulletGroup) => bulletGroup.items.map(normalizeComparable))
      ))

      const overlaps = [...new Set(cardItems.filter((item) => summaryItems.has(item)))]
      expect(overlaps, `summary/cards overlap in ${slide.hour}-${slide.title}`).toEqual([])
    }
  })

  it('ensures every code slide exposes visible summary or cards after chunking', () => {
    const slides = buildDockerDay2SlideSpecs(documents)
    const emptyCodeSlides = slides.filter((slide) => (
      Boolean(slide.code) && slide.summary.length === 0 && slide.cards.length === 0
    ))

    expect(emptyCodeSlides).toEqual([])
  })
})
