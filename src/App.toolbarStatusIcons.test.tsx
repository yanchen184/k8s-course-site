// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { usePresentationChannel } from './hooks/usePresentationChannel'

vi.mock('./hooks/usePresentationChannel', () => ({
  usePresentationChannel: vi.fn(),
}))

vi.mock('./components/AudienceView', () => ({
  default: () => <div>Audience View</div>,
}))

vi.mock('./components/PresenterNotesPanel', () => ({
  default: () => <div>Presenter Notes</div>,
}))

class MockMediaStreamTrack {
  kind: 'video' | 'audio'
  stop: ReturnType<typeof vi.fn>

  constructor(kind: 'video' | 'audio') {
    this.kind = kind
    this.stop = vi.fn()
  }

  addEventListener = vi.fn()
  removeEventListener = vi.fn()
}

class MockMediaStream {
  private tracks: MockMediaStreamTrack[]

  constructor(tracks: MockMediaStreamTrack[] = []) {
    this.tracks = tracks
  }

  getTracks() {
    return this.tracks
  }

  getVideoTracks() {
    return this.tracks.filter((track) => track.kind === 'video')
  }

  getAudioTracks() {
    return this.tracks.filter((track) => track.kind === 'audio')
  }
}

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = []
  static isTypeSupported = vi.fn(() => true)

  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  onerror: ((event: Event) => void) | null = null
  ondataavailable: ((event: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  start: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  resume: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>

  constructor() {
    this.start = vi.fn(() => {
      this.state = 'recording'
    })
    this.pause = vi.fn(() => {
      this.state = 'paused'
    })
    this.resume = vi.fn(() => {
      this.state = 'recording'
    })
    this.stop = vi.fn(() => {
      this.state = 'inactive'
      this.ondataavailable?.({
        data: new Blob(['recorded-bytes'], { type: 'video/webm' }),
      })
      this.onstop?.()
    })
    MockMediaRecorder.instances.push(this)
  }

  static reset() {
    MockMediaRecorder.instances = []
  }
}

let getDisplayMediaMock: ReturnType<typeof vi.fn>
let getUserMediaMock: ReturnType<typeof vi.fn>
let showDirectoryPickerMock: ReturnType<typeof vi.fn>
let recorderWindow: Window
const TOOLBAR_STATUS_TEST_TIMEOUT = 15000

function installMediaMocks() {
  const displayTrack = new MockMediaStreamTrack('video')
  const audioTrack = new MockMediaStreamTrack('audio')

  getDisplayMediaMock = vi.fn(async () => new MockMediaStream([displayTrack]))
  getUserMediaMock = vi.fn(async () => new MockMediaStream([audioTrack]))

  Object.defineProperty(globalThis, 'MediaStream', {
    configurable: true,
    value: MockMediaStream,
  })

  Object.defineProperty(globalThis, 'MediaRecorder', {
    configurable: true,
    value: MockMediaRecorder,
  })

  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getDisplayMedia: getDisplayMediaMock,
      getUserMedia: getUserMediaMock,
    },
  })

  showDirectoryPickerMock = vi.fn(async () => ({
    name: 'Recorder Output',
    getFileHandle: vi.fn(async () => ({
      createWritable: vi.fn(async () => ({
        write: vi.fn(async () => {}),
        close: vi.fn(async () => {}),
      })),
    })),
  }))

  Object.defineProperty(window, 'showDirectoryPicker', {
    configurable: true,
    value: showDirectoryPickerMock,
  })
}

async function startPresenter() {
  fireEvent.click(screen.getByRole('button', { name: /start presenter \(p\)/i }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /end presenter \(p\)/i })).toBeTruthy()
  })
}

function emitRecorderReady() {
  window.dispatchEvent(new MessageEvent('message', {
    origin: window.location.origin,
    data: {
      type: 'k8s-course-recorder-ready',
      sessionId: '00000000-0000-4000-8000-000000000001',
    },
    source: recorderWindow as MessageEventSource,
  }))
}

describe('App toolbar status icons', () => {
  beforeEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/admin')
    MockMediaRecorder.reset()
    installMediaMocks()

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

    recorderWindow = {
      closed: false,
      close: vi.fn(),
    } as unknown as Window

    vi.spyOn(window, 'open').mockImplementation((_url, target) => {
      if (typeof target === 'string' && target.startsWith('k8s-recorder-')) {
        return recorderWindow
      }

      return {
        closed: false,
        close: vi.fn(),
      } as unknown as Window
    })

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

  it('renders icon-only presenter status items and updates the audience access label', async () => {
    render(<App />)

    await startPresenter()

    expect(screen.getByRole('img', { name: 'Connecting audience' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Same-browser only' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Both can switch' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Connecting audience' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /^presenter only$/i }))

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Presenter only' })).toBeTruthy()
    })
    expect(screen.queryByRole('img', { name: 'Both can switch' })).toBeNull()
  }, TOOLBAR_STATUS_TEST_TIMEOUT)

  it('renders recording controls as icon-only actions and keeps them clickable', async () => {
    render(<App />)

    await startPresenter()

    const startButton = screen.getByRole('button', { name: /start recording/i })
    expect(startButton.textContent).toBe('')
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(screen.getByText(/preparing recorder/i)).toBeTruthy()
    })

    emitRecorderReady()

    await waitFor(() => {
      expect(showDirectoryPickerMock).toHaveBeenCalledTimes(1)
    })
  }, TOOLBAR_STATUS_TEST_TIMEOUT)

  it('includes desktop tooltip containers for icon-only toolbar items', async () => {
    render(<App />)

    await startPresenter()

    const tooltips = Array.from(document.querySelectorAll('div[aria-hidden="true"]'))
      .filter((node) => node.textContent?.trim() === 'Connecting audience')

    expect(tooltips.length).toBeGreaterThan(0)
    expect(tooltips.some((node) => node.className.includes('md:block'))).toBe(true)
    expect(tooltips.some((node) => node.className.includes('group-hover:opacity-100'))).toBe(true)
  })
})
