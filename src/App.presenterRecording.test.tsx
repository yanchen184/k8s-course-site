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
  private listeners = new Map<string, Set<() => void>>()

  constructor(kind: 'video' | 'audio') {
    this.kind = kind
    this.stop = vi.fn()
  }

  addEventListener = vi.fn((type: string, listener: () => void) => {
    const nextListeners = this.listeners.get(type) ?? new Set<() => void>()
    nextListeners.add(listener)
    this.listeners.set(type, nextListeners)
  })

  removeEventListener = vi.fn((type: string, listener: () => void) => {
    const nextListeners = this.listeners.get(type)
    nextListeners?.delete(listener)
  })

  dispatch(type: string) {
    const nextListeners = this.listeners.get(type)
    nextListeners?.forEach((listener) => listener())
  }
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
  static isTypeSupported = vi.fn((mimeType: string) => mimeType !== 'video/webm;codecs=vp9,opus')

  stream: MockMediaStream
  mimeType: string
  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  ondataavailable: ((event: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: ((event: Event) => void) | null = null
  start: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  resume: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>

  constructor(stream: MockMediaStream, options?: { mimeType?: string }) {
    this.stream = stream
    this.mimeType = options?.mimeType ?? ''
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
        data: new Blob(['recorded-bytes'], {
          type: this.mimeType || 'video/webm',
        }),
      })
      this.onstop?.()
    })
    MockMediaRecorder.instances.push(this)
  }

  static reset() {
    MockMediaRecorder.instances = []
    MockMediaRecorder.isTypeSupported.mockClear()
  }
}

let sendMessageMock: ReturnType<typeof vi.fn>
let popupWindow: Window & {
  close: ReturnType<typeof vi.fn>
}
let popupWindowState: { closed: boolean }
let getDisplayMediaMock: ReturnType<typeof vi.fn>
let getUserMediaMock: ReturnType<typeof vi.fn>
let createObjectUrlMock: ReturnType<typeof vi.fn>
let revokeObjectUrlMock: ReturnType<typeof vi.fn>

const PRESENTER_RECORDING_TEST_TIMEOUT = 15000

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

  createObjectUrlMock = vi.fn(() => 'blob:recording-download')
  revokeObjectUrlMock = vi.fn()
  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: createObjectUrlMock,
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: revokeObjectUrlMock,
  })

  return { displayTrack, audioTrack }
}

async function startPresenter(): Promise<void> {
  fireEvent.click(screen.getByRole('button', { name: /start presenter \(p\)/i }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /end presenter \(p\)/i })).toBeTruthy()
  })
}

async function startRecording(): Promise<void> {
  fireEvent.click(await screen.findByRole('button', { name: /start recording/i }))

  await waitFor(() => {
    expect(getDisplayMediaMock).toHaveBeenCalledTimes(1)
    expect(getUserMediaMock).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /pause recording/i })).toBeTruthy()
  })
}

describe('App presenter recording', () => {
  beforeEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/admin')
    MockMediaRecorder.reset()
    installMediaMocks()

    popupWindowState = { closed: false }
    popupWindow = {
      close: vi.fn(function close() {
        popupWindowState.closed = true
      }),
    } as unknown as Window & { close: ReturnType<typeof vi.fn> }
    Object.defineProperty(popupWindow, 'closed', {
      configurable: true,
      get: () => popupWindowState.closed,
    })

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

    sendMessageMock = vi.fn(() => true)
    vi.mocked(usePresentationChannel).mockReturnValue({
      latestMessage: null,
      transportStatus: 'ready',
      transportKind: 'broadcast',
      transportIssue: null,
      syncCapability: 'same-browser',
      sendMessage: sendMessageMock,
    })

    vi.spyOn(window, 'open').mockImplementation(() => popupWindow)

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

  it('shows a manual start action when presenter mode starts', async () => {
    render(<App />)

    await startPresenter()

    expect(getDisplayMediaMock).not.toHaveBeenCalled()
    expect(getUserMediaMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /start recording/i })).toBeTruthy()
  }, PRESENTER_RECORDING_TEST_TIMEOUT)

  it('pauses and resumes the current recording', async () => {
    render(<App />)

    await startPresenter()
    await startRecording()

    const recorder = MockMediaRecorder.instances[0]
    expect(recorder).toBeTruthy()

    fireEvent.click(await screen.findByRole('button', { name: /pause recording/i }))
    expect(recorder?.pause).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /resume recording/i })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole('button', { name: /resume recording/i }))
    expect(recorder?.resume).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause recording/i })).toBeTruthy()
    })
  }, PRESENTER_RECORDING_TEST_TIMEOUT)

  it('finalizes the recording and shows a download link after stop', async () => {
    render(<App />)

    await startPresenter()
    await startRecording()

    fireEvent.click(await screen.findByRole('button', { name: /stop recording/i }))

    const downloadLink = await screen.findByRole('link', { name: /download recording/i })
    expect(createObjectUrlMock).toHaveBeenCalledTimes(1)
    expect(downloadLink.getAttribute('href')).toBe('blob:recording-download')
    expect(downloadLink.getAttribute('download')).toMatch(/^k8s-course-presenter-/)
  }, PRESENTER_RECORDING_TEST_TIMEOUT)

  it('stops the recording before ending presenter mode and keeps the download available', async () => {
    render(<App />)

    await startPresenter()
    await startRecording()

    const recorder = MockMediaRecorder.instances[0]
    fireEvent.click(screen.getByRole('button', { name: /end presenter \(p\)/i }))
    fireEvent.click(screen.getByRole('button', { name: /^end presenter$/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start presenter \(p\)/i })).toBeTruthy()
    })

    expect(recorder?.stop).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('link', { name: /download recording/i })).toBeTruthy()
  }, PRESENTER_RECORDING_TEST_TIMEOUT)

  it('shows a retry action when microphone access is denied', async () => {
    getUserMediaMock = vi.fn(async () => {
      throw new Error('microphone denied')
    })

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getDisplayMedia: getDisplayMediaMock,
        getUserMedia: getUserMediaMock,
      },
    })

    render(<App />)

    await startPresenter()
    fireEvent.click(await screen.findByRole('button', { name: /start recording/i }))

    await waitFor(() => {
      expect(screen.getByText(/recording needs screen sharing and microphone access/i)).toBeTruthy()
      expect(screen.getByRole('button', { name: /retry recording/i })).toBeTruthy()
    })
  }, PRESENTER_RECORDING_TEST_TIMEOUT)

  it('shows unsupported recording state without blocking presenter mode', async () => {
    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: undefined,
    })

    render(<App />)

    await startPresenter()
    fireEvent.click(await screen.findByRole('button', { name: /start recording/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /end presenter \(p\)/i })).toBeTruthy()
      expect(screen.getByText(/recording is unavailable in this browser/i)).toBeTruthy()
      expect(screen.getByRole('button', { name: /retry recording/i })).toBeTruthy()
    })
  }, PRESENTER_RECORDING_TEST_TIMEOUT)
})
