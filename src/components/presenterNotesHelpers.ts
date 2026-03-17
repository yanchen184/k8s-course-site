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
