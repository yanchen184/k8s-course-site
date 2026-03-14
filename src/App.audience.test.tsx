// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

const AUDIENCE_TEST_TIMEOUT = 10000

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
    let latestMessage: ReturnType<typeof createSyncMessage> | null = null
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

    vi.mocked(usePresentationChannel).mockImplementation(() => ({
      latestMessage,
      transportStatus: 'ready',
      transportKind: 'broadcast',
      transportIssue: null,
      syncCapability: 'same-browser',
      sendMessage: vi.fn(() => true),
    }))

    const { rerender } = render(<App />)
    latestMessage = createSyncMessage(1)
    rerender(<App />)

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

  it('does not re-apply a stale presenter sync after the audience navigates locally', async () => {
    let latestMessage: ReturnType<typeof createSyncMessage> | null = null
    const sendMessage = vi.fn(() => true)

    vi.mocked(usePresentationChannel).mockImplementation(() => ({
      latestMessage,
      transportStatus: 'ready',
      transportKind: 'broadcast',
      transportIssue: null,
      syncCapability: 'same-browser',
      sendMessage,
    }))

    const { rerender } = render(<App />)
    latestMessage = createSyncMessage(0)
    rerender(<App />)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: lesson1MorningSlides[0].title,
        }),
      ).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: lesson1MorningSlides[1].title,
        }),
      ).toBeTruthy()
    })

    expect(sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        senderRole: 'audience',
        slideIndex: 1,
        type: 'SYNC_STATE',
      }),
    )
  })

  it('sends audience heartbeats after the presenter sync is established', async () => {
    vi.useFakeTimers()

    try {
      let latestMessage: ReturnType<typeof createSyncMessage> | null = null
      const sendMessage = vi.fn(() => true)

      vi.mocked(usePresentationChannel).mockImplementation(() => ({
        latestMessage,
        transportStatus: 'ready',
        transportKind: 'broadcast',
        transportIssue: null,
        syncCapability: 'same-browser',
        sendMessage,
      }))

      const { rerender } = render(<App />)
      latestMessage = createSyncMessage(0)
      rerender(<App />)

      await Promise.resolve()
      await Promise.resolve()

      expect(sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          senderRole: 'audience',
          type: 'REQUEST_SYNC',
        }),
      )

      sendMessage.mockClear()

      await vi.advanceTimersByTimeAsync(2000)

      expect(sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          senderRole: 'audience',
          type: 'HEARTBEAT',
        }),
      )
    } finally {
      vi.useRealTimers()
    }
  }, AUDIENCE_TEST_TIMEOUT)
})
