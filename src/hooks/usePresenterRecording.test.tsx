// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePresenterRecording } from './usePresenterRecording'

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
  static isTypeSupported = vi.fn((mimeType: string) => mimeType.includes('webm'))

  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  mimeType: string
  ondataavailable: ((event: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: ((event: Event) => void) | null = null
  start: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  resume: ReturnType<typeof vi.fn>
  stop: ReturnType<typeof vi.fn>

  constructor(_stream: MockMediaStream, options?: { mimeType?: string }) {
    this.mimeType = options?.mimeType ?? 'video/webm'
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
      this.emitChunk('final-segment')
      this.onstop?.()
    })
    MockMediaRecorder.instances.push(this)
  }

  emitChunk(label: string) {
    this.ondataavailable?.({
      data: new Blob([label], { type: this.mimeType }),
    })
  }

  static reset() {
    MockMediaRecorder.instances = []
    MockMediaRecorder.isTypeSupported.mockClear()
  }
}

let getDisplayMediaMock: ReturnType<typeof vi.fn>
let getUserMediaMock: ReturnType<typeof vi.fn>
let showDirectoryPickerMock: ReturnType<typeof vi.fn>
let getFileHandleMock: ReturnType<typeof vi.fn>
let createWritableMock: ReturnType<typeof vi.fn>
let writeMock: ReturnType<typeof vi.fn>
let closeMock: ReturnType<typeof vi.fn>

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

  return { displayTrack, audioTrack }
}

function installDirectoryPickerMocks() {
  writeMock = vi.fn(async () => {})
  closeMock = vi.fn(async () => {})
  createWritableMock = vi.fn(async () => ({
    write: writeMock,
    close: closeMock,
  }))
  getFileHandleMock = vi.fn(async () => ({
    createWritable: createWritableMock,
  }))
  showDirectoryPickerMock = vi.fn(async () => ({
    name: 'Recorder Output',
    getFileHandle: getFileHandleMock,
  }))

  Object.defineProperty(window, 'showDirectoryPicker', {
    configurable: true,
    value: showDirectoryPickerMock,
  })
}

describe('usePresenterRecording', () => {
  beforeEach(() => {
    MockMediaRecorder.reset()
    installMediaMocks()
    installDirectoryPickerMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('selects a folder, starts recording, and writes sequential WebM segments', async () => {
    const { result } = renderHook(() => usePresenterRecording())

    await act(async () => {
      await result.current.startLongRecording({ segmentMs: 1234 })
    })

    expect(showDirectoryPickerMock).toHaveBeenCalledTimes(1)
    expect(getDisplayMediaMock).toHaveBeenCalledTimes(1)
    expect(getUserMediaMock).toHaveBeenCalledTimes(1)
    expect(MockMediaRecorder.instances[0]?.start).toHaveBeenCalledWith(1234)
    expect(result.current.status).toBe('recording')
    expect(result.current.outputDirectoryName).toBe('Recorder Output')
    expect(result.current.currentSegmentIndex).toBe(1)

    act(() => {
      MockMediaRecorder.instances[0]?.emitChunk('segment-1')
    })

    await waitFor(() => {
      expect(getFileHandleMock).toHaveBeenCalledWith(expect.stringMatching(/part-001\.webm$/), { create: true })
      expect(result.current.currentSegmentIndex).toBe(2)
    })

    await act(async () => {
      await result.current.stop()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('stopped')
      expect(getFileHandleMock).toHaveBeenCalledWith(expect.stringMatching(/part-002\.webm$/), { create: true })
    })

    expect(writeMock).toHaveBeenCalledTimes(2)
    expect(closeMock).toHaveBeenCalledTimes(2)
  })

  it('surfaces storage API requirements when folder access is unavailable', async () => {
    Object.defineProperty(window, 'showDirectoryPicker', {
      configurable: true,
      value: undefined,
    })

    const { result } = renderHook(() => usePresenterRecording())

    await act(async () => {
      await result.current.startLongRecording()
    })

    expect(result.current.status).toBe('storage-unavailable')
    expect(result.current.error).toMatch(/local folder write access/i)
    expect(getDisplayMediaMock).not.toHaveBeenCalled()
  })

  it('moves to an error state when persisting a segment fails', async () => {
    writeMock = vi.fn(async () => {
      throw new Error('disk full')
    })
    createWritableMock = vi.fn(async () => ({
      write: writeMock,
      close: closeMock,
    }))
    getFileHandleMock = vi.fn(async () => ({
      createWritable: createWritableMock,
    }))
    showDirectoryPickerMock = vi.fn(async () => ({
      name: 'Recorder Output',
      getFileHandle: getFileHandleMock,
    }))

    Object.defineProperty(window, 'showDirectoryPicker', {
      configurable: true,
      value: showDirectoryPickerMock,
    })

    const { result } = renderHook(() => usePresenterRecording())

    await act(async () => {
      await result.current.startLongRecording()
    })

    act(() => {
      MockMediaRecorder.instances[0]?.emitChunk('segment-1')
    })

    await waitFor(() => {
      expect(result.current.status).toBe('error')
      expect(result.current.error).toMatch(/could not be saved/i)
    })
  })
})
