// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { usePresentationChannel } from './hooks/usePresentationChannel'
import { slides as lesson1MorningSlides } from './slides/lesson1-morning/index'

vi.mock('./hooks/usePresentationChannel', () => ({
  usePresentationChannel: vi.fn(),
}))

function createSyncMessage(slideIndex: number) {
  return {
    type: 'SYNC_STATE' as const,
    sessionId: 'session-1',
    lessonId: 'lesson1-morning',
    slideIndex,
    senderRole: 'presenter' as const,
    sentAt: Date.now(),
  }
}

describe('App audience sync', () => {
  beforeEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/admin?view=audience&session=session-1&control=control-1#lesson1-morning')

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('applies presenter sync without invoking document view transitions', async () => {
    const startViewTransition = vi.fn((updateCallback: () => void) => {
      updateCallback()
      return {
        finished: Promise.resolve(),
        ready: Promise.resolve(),
        updateCallbackDone: Promise.resolve(),
        skipTransition: vi.fn(),
      }
    })

    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: startViewTransition,
    })

    vi.mocked(usePresentationChannel).mockReturnValue({
      latestMessage: createSyncMessage(1),
      transportStatus: 'ready',
      transportKind: 'broadcast',
      transportIssue: null,
      syncCapability: 'same-browser',
      sendMessage: vi.fn(() => true),
    })

    render(<App />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: lesson1MorningSlides[1].title,
        }),
      ).toBeTruthy()
    })

    expect(startViewTransition).not.toHaveBeenCalled()
  })
})
