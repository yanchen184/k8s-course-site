export type ViewMode = 'presenter' | 'audience' | 'single'

export type PresentationMessageType = 'SYNC_STATE' | 'REQUEST_SYNC' | 'HEARTBEAT' | 'END_SESSION'

export interface PresentationSyncMessage {
  type: PresentationMessageType
  sessionId: string
  lessonId: string
  slideIndex: number
  sentAt: number
}

const messageTypes: PresentationMessageType[] = ['SYNC_STATE', 'REQUEST_SYNC', 'HEARTBEAT', 'END_SESSION']

function isPresentationMessageType(value: unknown): value is PresentationMessageType {
  return typeof value === 'string' && messageTypes.includes(value as PresentationMessageType)
}

export function parseViewMode(search: string): ViewMode {
  const view = new URLSearchParams(search).get('view')
  if (view === 'presenter' || view === 'audience') {
    return view
  }
  return 'single'
}

export function parseSessionId(search: string): string | null {
  const raw = new URLSearchParams(search).get('session')
  if (!raw) {
    return null
  }

  const sessionId = raw.trim()
  return sessionId.length > 0 ? sessionId : null
}

export function buildPresentationChannelName(sessionId: string): string {
  return `k8s-course-presenter:${sessionId}`
}

export function createPresentationMessage(
  type: PresentationMessageType,
  sessionId: string,
  lessonId: string,
  slideIndex: number,
): PresentationSyncMessage {
  return {
    type,
    sessionId,
    lessonId,
    slideIndex,
    sentAt: Date.now(),
  }
}

export function isPresentationSyncMessage(value: unknown): value is PresentationSyncMessage {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    isPresentationMessageType(record.type) &&
    typeof record.sessionId === 'string' &&
    record.sessionId.length > 0 &&
    typeof record.lessonId === 'string' &&
    record.lessonId.length > 0 &&
    typeof record.slideIndex === 'number' &&
    Number.isInteger(record.slideIndex) &&
    record.slideIndex >= 0 &&
    typeof record.sentAt === 'number' &&
    Number.isFinite(record.sentAt)
  )
}
