import type { ReactNode, RefObject, UIEventHandler } from 'react'
import { useMemo, useState } from 'react'

export interface PresenterNoteBlock {
  kind: 'intro' | 'point' | 'outro'
  label: string
  title: string
  body: string
}

export interface PresenterNotesMetrics {
  characterCount: number
  paragraphCount: number
  blockCount: number
}

interface PresenterNotesPanelProps {
  notes: string
  duration?: string
  variant?: 'presenter' | 'modal' | 'overlay'
  contextSection?: string
  contextTitle?: string
  fullNotesRef?: RefObject<HTMLDivElement | null>
  onFullNotesScroll?: UIEventHandler<HTMLDivElement>
  showScrollHint?: boolean
  activeTab?: PresenterNotesTab
  onActiveTabChange?: (tab: PresenterNotesTab) => void
  actions?: ReactNode
}

type PresenterNotesTab = 'key-points' | 'full-script'

function normalizeNotes(rawNotes: string): string {
  return rawNotes.replace(/\r/g, '').trim()
}

function splitParagraphs(rawNotes: string): string[] {
  const normalized = normalizeNotes(rawNotes)
  if (!normalized) {
    return []
  }

  return normalized
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function splitSentences(paragraph: string): string[] {
  const matches = paragraph.match(/[^。！？!?]+[。！？!?]?/gu) ?? []

  return matches
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

function chunkSingleParagraph(paragraph: string): string[] {
  const sentences = splitSentences(paragraph)
  if (sentences.length <= 1) {
    return [paragraph.trim()]
  }

  const chunks: string[] = []
  let currentChunk = ''
  let currentSentenceCount = 0

  for (const sentence of sentences) {
    const candidate = `${currentChunk}${sentence}`.trim()
    const shouldFlush =
      currentChunk.length > 0
      && (currentSentenceCount >= 2 || candidate.length > 90)

    if (shouldFlush) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
      currentSentenceCount = 1
      continue
    }

    currentChunk = candidate
    currentSentenceCount += 1
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

function splitBlocks(rawNotes: string): string[] {
  const paragraphs = splitParagraphs(rawNotes)

  if (paragraphs.length === 1) {
    return chunkSingleParagraph(paragraphs[0])
  }

  return paragraphs
}

function extractFirstSentence(block: string): string {
  const [firstSentence] = splitSentences(block)
  return firstSentence?.trim() || block.trim()
}

function buildBody(block: string, title: string): string {
  const normalized = block.trim()
  if (!normalized.startsWith(title)) {
    return normalized
  }

  return normalized.slice(title.length).trim()
}

function getBlockKind(index: number, total: number): PresenterNoteBlock['kind'] {
  if (total <= 1 || index === 0) {
    return 'intro'
  }

  if (index === total - 1) {
    return 'outro'
  }

  return 'point'
}

function getBlockLabel(kind: PresenterNoteBlock['kind'], index: number): string {
  if (kind === 'intro') {
    return 'Main Thread'
  }

  if (kind === 'outro') {
    return 'Wrap-up / Transition'
  }

  return `Key Point ${index}`
}

export function buildPresenterNoteBlocks(rawNotes: string): PresenterNoteBlock[] {
  const blocks = splitBlocks(rawNotes)

  return blocks.map((block, index) => {
    const kind = getBlockKind(index, blocks.length)
    const title = extractFirstSentence(block)
    return {
      kind,
      label: getBlockLabel(kind, index),
      title,
      body: buildBody(block, title),
    }
  })
}

export function getPresenterNotesMetrics(rawNotes: string): PresenterNotesMetrics {
  const normalized = normalizeNotes(rawNotes)
  const paragraphs = splitParagraphs(rawNotes)
  const blocks = splitBlocks(rawNotes)

  return {
    characterCount: normalized.replace(/\s+/g, '').length,
    paragraphCount: paragraphs.length,
    blockCount: blocks.length,
  }
}

function getDurationLabel(duration?: string): string {
  if (!duration?.trim()) {
    return '2-3 min'
  }

  return `${duration.trim()} min`
}

function getBlockAccentClasses(kind: PresenterNoteBlock['kind']): string {
  if (kind === 'intro') {
    return 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100'
  }

  if (kind === 'outro') {
    return 'border-amber-400/40 bg-amber-500/10 text-amber-100'
  }

  return 'border-blue-400/35 bg-blue-500/10 text-blue-100'
}

export default function PresenterNotesPanel({
  notes,
  duration,
  variant = 'presenter',
  contextSection,
  contextTitle,
  fullNotesRef,
  onFullNotesScroll,
  showScrollHint = false,
  activeTab,
  onActiveTabChange,
  actions,
}: PresenterNotesPanelProps) {
  const blocks = useMemo(() => buildPresenterNoteBlocks(notes), [notes])
  const metrics = useMemo(() => getPresenterNotesMetrics(notes), [notes])
  const [internalActiveTab, setInternalActiveTab] = useState<PresenterNotesTab>('key-points')
  const hasNotes = notes.trim().length > 0
  const isPresenter = variant === 'presenter'
  const isOverlay = variant === 'overlay'
  const resolvedActiveTab = activeTab ?? internalActiveTab
  const normalizedContextSection = contextSection?.trim() || ''
  const normalizedContextTitle = contextTitle?.trim() || ''
  const shouldShowContextHeader = isOverlay && normalizedContextTitle.length > 0

  const handleTabChange = (tab: PresenterNotesTab) => {
    onActiveTabChange?.(tab)
    if (activeTab === undefined) {
      setInternalActiveTab(tab)
    }
  }

  const shellClassName = isPresenter
    ? 'relative flex min-h-[320px] flex-1 flex-col rounded-[1.6rem] border border-slate-700/80 bg-slate-950/80 p-4 shadow-[0_24px_50px_rgba(2,6,23,0.35)] sm:min-h-[420px] sm:p-5 xl:min-h-0 xl:overflow-hidden'
    : isOverlay
    ? 'flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-700/80 bg-slate-950/95 p-4 shadow-[0_28px_60px_rgba(2,6,23,0.35)] sm:p-6'
    : 'flex max-h-[72vh] flex-col overflow-hidden rounded-[1.75rem] border border-slate-700/80 bg-slate-950/95 p-4 shadow-[0_28px_60px_rgba(2,6,23,0.35)] sm:p-6'

  const cardsGridClassName = isPresenter
    ? 'grid gap-3'
    : 'grid gap-3 lg:grid-cols-2'

  const contentLayoutClassName = 'flex min-h-0 flex-1 flex-col'

  const tabPanelClassName = 'flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.4rem] border border-slate-800/80 bg-slate-900/65 p-4 sm:p-5'

  const fullScriptClassName = isPresenter
    ? 'min-h-0 flex-1 overflow-y-auto pr-2 text-[1rem] leading-8 text-slate-100 whitespace-pre-line overscroll-contain sm:text-[1.05rem] xl:text-[1.1rem]'
    : 'min-h-0 flex-1 overflow-y-auto pr-2 text-[1.05rem] leading-8 text-slate-100 whitespace-pre-line overscroll-contain sm:text-[1.1rem] sm:leading-9'

  return (
    <div className={shellClassName}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-[0.08em] text-slate-50">Speaker Notes</h3>
          <p className="mt-1 text-sm text-slate-400">Scan the key beats first, then drop into the full script.</p>
          {shouldShowContextHeader && (
            <div className="mt-3 rounded-[1.2rem] border border-slate-800/80 bg-slate-900/75 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              {normalizedContextSection && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
                  {normalizedContextSection}
                </p>
              )}
              <p className={`font-semibold leading-tight text-slate-50 ${normalizedContextSection ? 'mt-2 text-xl sm:text-[1.65rem]' : 'text-xl sm:text-[1.65rem]'}`}>
                {normalizedContextTitle}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {actions}
          <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
            {getDurationLabel(duration)}
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
            {metrics.characterCount} chars
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
            {metrics.paragraphCount} paragraphs
          </span>
        </div>
      </div>

      <div className={contentLayoutClassName}>
        <div className="mb-4 flex items-center gap-2 rounded-[1.25rem] border border-slate-800/80 bg-slate-900/70 p-1.5">
          <button
            type="button"
            onClick={() => handleTabChange('key-points')}
            className={`flex-1 rounded-[1rem] px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
              resolvedActiveTab === 'key-points'
                ? 'bg-cyan-500/15 text-cyan-100 border border-cyan-400/35'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            Key Points
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('full-script')}
            className={`flex-1 rounded-[1rem] px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
              resolvedActiveTab === 'full-script'
                ? 'bg-blue-500/15 text-blue-100 border border-blue-400/35'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            Full Script
          </button>
        </div>

        <div className={tabPanelClassName}>
          {resolvedActiveTab === 'key-points' ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/85">Key Points</p>
                  <p className="mt-1 text-sm text-slate-400">Card view for the presenter&apos;s fastest scan path.</p>
                </div>
                <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  {metrics.blockCount} cards
                </span>
              </div>

              {hasNotes ? (
                <div className={`min-h-0 flex-1 overflow-y-auto pr-2 ${cardsGridClassName}`}>
                  {blocks.map((block, index) => (
                    <article
                      key={`${block.label}-${index}`}
                      className="rounded-[1.35rem] border border-slate-700/80 bg-slate-950/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getBlockAccentClasses(block.kind)}`}>
                          {block.label}
                        </span>
                        <span className="rounded-full border border-slate-800/80 bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-base font-semibold leading-7 text-slate-50 sm:text-[1.02rem]">
                        {block.title}
                      </p>
                      {block.body && (
                        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-[0.95rem]">
                          {block.body}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.3rem] border border-dashed border-slate-700/80 bg-slate-950/60 px-4 py-6 text-center">
                  <p className="text-base font-semibold text-slate-100">No speaker notes yet.</p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    Add notes to this slide to generate quick-scan cards and the full script panel.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2rem] border border-slate-800/80 bg-black/55 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300/85">Full Script</p>
                  <p className="mt-1 text-sm text-slate-400">Original notes with full detail preserved.</p>
                </div>
              </div>

              <div
                ref={fullNotesRef}
                onScroll={onFullNotesScroll}
                className={fullScriptClassName}
              >
                {hasNotes ? notes.trim() : 'No speaker notes for this slide yet.'}
              </div>

              {showScrollHint && (
                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-b-[1.2rem] bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-2 pt-10 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-600/70 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 shadow-lg shadow-slate-950/30">
                    <span aria-hidden="true" className="text-sm leading-none">↓</span>
                    <span>Scroll for more</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
