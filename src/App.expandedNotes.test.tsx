// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from './App'
import { usePresentationChannel } from './hooks/usePresentationChannel'

vi.mock('./hooks/usePresentationChannel', () => ({
  usePresentationChannel: vi.fn(),
}))

vi.mock('./components/AudienceView', () => ({
  default: () => <div>Audience View</div>,
}))

async function startPresenter(): Promise<void> {
  fireEvent.click(screen.getByRole('button', { name: /start presenter \(p\)/i }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /end presenter \(p\)/i })).toBeTruthy()
  })
}

describe('App expanded speaker notes', () => {
  beforeEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/admin')

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

    vi.mocked(usePresentationChannel).mockReturnValue({
      latestMessage: null,
      transportStatus: 'ready',
      transportKind: 'broadcast',
      transportIssue: null,
      syncCapability: 'same-browser',
      sendMessage: vi.fn(() => true),
    })

    vi.spyOn(window, 'open').mockImplementation(() => ({
      closed: false,
      close: vi.fn(),
    }) as unknown as Window)

    let nextId = 0
    vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => {
      nextId += 1
      return `00000000-0000-4000-8000-${String(nextId).padStart(12, '0')}`
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    cleanup()
  })

  it('shows the active section and title in expanded notes and updates after slide navigation', async () => {
    render(<App />)

    await startPresenter()

    fireEvent.click(screen.getByRole('button', { name: /expand speaker notes/i }))

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /expanded speaker notes/i })).toBeTruthy()
    })

    const dialog = screen.getByRole('dialog', { name: /expanded speaker notes/i })

    expect(within(dialog).getByText('第一堂課')).toBeTruthy()
    expect(within(dialog).getByText('Kubernetes 入門')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /next slide/i }))

    await waitFor(() => {
      expect(within(dialog).getByText('課程總覽')).toBeTruthy()
      expect(within(dialog).getByText('47 小時完整課程大綱')).toBeTruthy()
    })

    expect(within(dialog).queryByText('第一堂課')).toBeNull()
  }, 10000)
})
