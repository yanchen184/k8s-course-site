import { memo } from 'react'
import type { Slide } from '../slides/lesson1-morning/index'

type AudienceConnectionState =
  | 'loading'
  | 'connected'
  | 'disconnected'
  | 'missing-session'
  | 'unsupported'
  | 'invalid-control-link'
  | 'expired-control-link'

interface AudienceViewProps {
  lessonLabel: string
  lessonTitle: string
  slide: Slide | null
  loading: boolean
  connectionState: AudienceConnectionState
  controlsEnabled: boolean
  currentSlide: number
  totalSlides: number
  onPrev: () => void
  onNext: () => void
}

function getConnectionLabel(state: AudienceConnectionState): string {
  if (state === 'connected') {
    return 'Connected'
  }
  if (state === 'loading') {
    return 'Connecting'
  }
  if (state === 'disconnected') {
    return 'Disconnected'
  }
  if (state === 'unsupported') {
    return 'Unsupported browser'
  }
  if (state === 'invalid-control-link') {
    return 'Control link invalid'
  }
  if (state === 'expired-control-link') {
    return 'Control link expired'
  }
  return 'Session missing'
}

function getAudienceStatusBadge(
  connectionState: AudienceConnectionState,
  controlsEnabled: boolean,
): { label: string, className: string } | null {
  if (connectionState === 'connected') {
    if (!controlsEnabled) {
      return {
        label: 'Read-only',
        className: 'bg-slate-900/80 text-slate-300 border-slate-700/80',
      }
    }
    return null
  }

  if (connectionState === 'disconnected') {
    return {
      label: 'Disconnected',
      className: 'bg-red-900/70 text-red-200 border-red-700/80',
    }
  }

  if (connectionState === 'invalid-control-link' || connectionState === 'expired-control-link') {
    return {
      label: getConnectionLabel(connectionState),
      className: 'bg-red-900/70 text-red-200 border-red-700/80',
    }
  }

  return {
    label: getConnectionLabel(connectionState),
    className: 'bg-amber-900/70 text-amber-200 border-amber-700/80',
  }
}

function AudienceSlideBody({ slide }: { slide: Slide }) {
  return (
    <>
      {slide.section && (
        <div className="slide-section-label">
          {slide.section}
        </div>
      )}

      <h1 className="slide-title">
        {slide.title}
      </h1>

      {slide.subtitle && (
        <h2 className="slide-subtitle">
          {slide.subtitle}
        </h2>
      )}

      <div className="slide-content-responsive space-y-5">
        {slide.content}
      </div>

      {slide.code && (
        <pre className="slide-code-block">
          <code className="text-green-400 font-mono">{slide.code}</code>
        </pre>
      )}
    </>
  )
}

function AudienceView({
  lessonLabel,
  lessonTitle,
  slide,
  loading,
  connectionState,
  controlsEnabled,
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
}: AudienceViewProps) {
  const showWaitingState = loading || connectionState === 'loading'
  const showError =
    connectionState === 'missing-session' ||
    connectionState === 'unsupported' ||
    connectionState === 'invalid-control-link' ||
    connectionState === 'expired-control-link'
  const statusBadge = getAudienceStatusBadge(connectionState, controlsEnabled)

  return (
    <div className="isolate min-h-screen overflow-x-clip bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed left-3 right-3 top-3 z-20 flex flex-col gap-2 pointer-events-none sm:left-4 sm:right-4 sm:top-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 shadow-lg shadow-slate-950/20">
          {lessonLabel} · {lessonTitle}
        </div>
        {statusBadge && (
          <div
            className={`self-start rounded-xl px-3 py-2 text-xs border shadow-lg shadow-slate-950/20 ${statusBadge.className}`}
          >
            {statusBadge.label}
          </div>
        )}
      </div>

      <div className="relative z-0 flex min-h-screen items-start justify-center px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[calc(5.75rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6.5rem+env(safe-area-inset-top))] md:px-10">
        {showWaitingState && (
          <div className="max-w-xl text-center">
            <div className="mb-3 text-5xl animate-pulse">⏳</div>
            <h1 className="text-2xl md:text-3xl font-semibold">Waiting for presenter sync</h1>
            <p className="text-slate-300 mt-2">This view will update automatically once the presenter starts.</p>
          </div>
        )}

        {!showWaitingState && showError && (
          <div className="max-w-xl text-center">
            <div className="mb-3 text-5xl">⚠️</div>
            <h1 className="text-2xl md:text-3xl font-semibold">
              {connectionState === 'invalid-control-link' || connectionState === 'expired-control-link'
                ? 'This control link is no longer valid'
                : 'Audience view is unavailable'}
            </h1>
            <p className="text-slate-300 mt-2">
              {connectionState === 'missing-session'
                ? 'No active session was provided.'
                : connectionState === 'unsupported'
                ? 'Presenter sync is unavailable for the current mode.'
                : connectionState === 'expired-control-link'
                ? 'This control link has expired. Ask the presenter for a new control link.'
                : 'This control link has been rotated or is no longer authorized. Ask the presenter for a new control link.'}
            </p>
          </div>
        )}

        {!showWaitingState && !showError && !slide && (
          <div className="max-w-xl text-center">
            <div className="mb-3 text-5xl">🗂️</div>
            <h1 className="text-2xl md:text-3xl font-semibold">No slide content</h1>
            <p className="text-slate-300 mt-2">The presenter has not selected a valid slide yet.</p>
          </div>
        )}

        {!showWaitingState && !showError && slide && (
          <div className="slide-shell-wide relative [contain:layout_paint]">
            <AudienceSlideBody slide={slide} />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {!showWaitingState && !showError && totalSlides > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800/80 bg-slate-950/94 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:bottom-6 md:border-t-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
          <div className="mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/95 px-3 py-3 shadow-xl shadow-slate-950/30 md:max-w-fit md:px-4">
          <button
            onClick={onPrev}
            disabled={!controlsEnabled || currentSlide <= 0}
            className="min-w-[6.5rem] rounded-xl px-4 py-2.5 text-sm font-medium transition-all
              bg-slate-800/80 border border-slate-600/60 text-slate-200
              hover:bg-slate-700/80 hover:border-slate-500
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-800/80"
          >
            ← Prev
          </button>
          <span className="min-w-[70px] text-center text-sm tabular-nums text-slate-400">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button
            onClick={onNext}
            disabled={!controlsEnabled || currentSlide >= totalSlides - 1}
            className="min-w-[6.5rem] rounded-xl px-4 py-2.5 text-sm font-medium transition-all
              bg-slate-800/80 border border-slate-600/60 text-slate-200
              hover:bg-slate-700/80 hover:border-slate-500
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-800/80"
          >
            Next →
          </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(AudienceView)
