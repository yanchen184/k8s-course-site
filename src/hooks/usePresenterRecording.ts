import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type PresenterRecordingStatus =
  | 'idle'
  | 'preparing'
  | 'selecting-folder'
  | 'requesting-permission'
  | 'recording'
  | 'paused'
  | 'finishing'
  | 'stopped'
  | 'error'
  | 'unsupported'
  | 'storage-unavailable'

export interface RecordingSegmentMeta {
  index: number
  filename: string
  mimeType: string
  size: number
  startedAt: number
  endedAt: number
}

export interface RecordingStorageCapability {
  supported: boolean
  reason: 'missing-media-capture' | 'missing-storage-api' | 'missing-webm-support' | null
}

export interface LongRecordingStartOptions {
  segmentMs?: number
}

export interface UsePresenterRecordingResult {
  status: PresenterRecordingStatus
  error: string | null
  downloadUrl: string | null
  downloadFilename: string | null
  currentSegmentIndex: number
  outputDirectoryName: string | null
  isLongRecordingSupported: boolean
  start: (options?: LongRecordingStartOptions) => Promise<void>
  startLongRecording: (options?: LongRecordingStartOptions) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => Promise<void>
  abort: (message: string) => Promise<void>
  resetCompleted: () => void
}

interface RecordingDirectoryHandleLike {
  name: string
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<RecordingFileHandleLike>
}

interface RecordingFileHandleLike {
  createWritable: () => Promise<RecordingWritableLike>
}

interface RecordingWritableLike {
  write: (data: Blob) => Promise<void>
  close: () => Promise<void>
}

type DirectoryPickerLike = () => Promise<RecordingDirectoryHandleLike>

const SEGMENT_DURATION_MS = 10 * 60 * 1000
const UNSUPPORTED_MESSAGE = 'Long recording needs Chromium screen capture support.'
const STORAGE_UNAVAILABLE_MESSAGE = 'Long recording requires Chromium and local folder write access.'
const PERMISSION_MESSAGE = 'Recording needs screen sharing and microphone access.'
const SEGMENT_WRITE_ERROR_MESSAGE = 'A recording segment could not be saved.'
const RECORDER_RUNTIME_ERROR_MESSAGE = 'Recording stopped unexpectedly.'

const RECORDER_MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
]

function getDirectoryPicker(): DirectoryPickerLike | null {
  if (typeof window === 'undefined') {
    return null
  }

  const candidate = (window as Window & typeof globalThis & {
    showDirectoryPicker?: DirectoryPickerLike
  }).showDirectoryPicker

  return typeof candidate === 'function' ? candidate.bind(window) : null
}

function hasMediaCaptureSupport(): boolean {
  return typeof navigator !== 'undefined'
    && typeof MediaRecorder !== 'undefined'
    && typeof navigator.mediaDevices?.getDisplayMedia === 'function'
    && typeof navigator.mediaDevices?.getUserMedia === 'function'
}

function resolveRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return ''
  }

  for (const mimeType of RECORDER_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType
    }
  }

  return ''
}

export function getRecordingStorageCapability(): RecordingStorageCapability {
  if (!hasMediaCaptureSupport()) {
    return { supported: false, reason: 'missing-media-capture' }
  }

  if (!getDirectoryPicker()) {
    return { supported: false, reason: 'missing-storage-api' }
  }

  if (!resolveRecorderMimeType()) {
    return { supported: false, reason: 'missing-webm-support' }
  }

  return { supported: true, reason: null }
}

function buildRecordingTimestamp(date: Date): string {
  return [
    date.getFullYear().toString(),
    `${date.getMonth() + 1}`.padStart(2, '0'),
    `${date.getDate()}`.padStart(2, '0'),
  ].join('')
    + '-'
    + [
      `${date.getHours()}`.padStart(2, '0'),
      `${date.getMinutes()}`.padStart(2, '0'),
      `${date.getSeconds()}`.padStart(2, '0'),
    ].join('')
}

function buildSegmentFilename(timestamp: string, index: number): string {
  return `k8s-course-presenter-${timestamp}-part-${String(index).padStart(3, '0')}.webm`
}

function stopStreamTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
}

function isAbortLikeError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function usePresenterRecording(): UsePresenterRecordingResult {
  const capability = useMemo(() => getRecordingStorageCapability(), [])
  const [status, setStatus] = useState<PresenterRecordingStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [outputDirectoryName, setOutputDirectoryName] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const displayStreamRef = useRef<MediaStream | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const combinedStreamRef = useRef<MediaStream | null>(null)
  const stopPromiseRef = useRef<Promise<void> | null>(null)
  const stopResolverRef = useRef<(() => void) | null>(null)
  const operationIdRef = useRef(0)
  const displayEndedHandlerRef = useRef<(() => void) | null>(null)
  const segmentStartAtRef = useRef<number | null>(null)
  const recordingTimestampRef = useRef<string>('')
  const pendingSegmentWritesRef = useRef<Set<Promise<void>>>(new Set())
  const segmentsWrittenRef = useRef(0)
  const stopRef = useRef<() => Promise<void>>(async () => {})

  const clearDownloadArtifact = useCallback(() => {
    setDownloadUrl(null)
    setDownloadFilename(null)
  }, [])

  const clearSegmentState = useCallback(() => {
    setCurrentSegmentIndex(0)
    setOutputDirectoryName(null)
    segmentStartAtRef.current = null
    recordingTimestampRef.current = ''
    segmentsWrittenRef.current = 0
  }, [])

  const clearStopPromise = useCallback(() => {
    stopResolverRef.current?.()
    stopResolverRef.current = null
    stopPromiseRef.current = null
  }, [])

  const cleanupActiveRecording = useCallback(() => {
    const displayTrack = displayStreamRef.current?.getVideoTracks()[0] ?? null
    if (displayTrack && displayEndedHandlerRef.current) {
      displayTrack.removeEventListener('ended', displayEndedHandlerRef.current)
    }

    displayEndedHandlerRef.current = null

    if (recorderRef.current) {
      recorderRef.current.ondataavailable = null
      recorderRef.current.onstop = null
      recorderRef.current.onerror = null
    }

    recorderRef.current = null
    stopStreamTracks(combinedStreamRef.current)
    stopStreamTracks(displayStreamRef.current)
    stopStreamTracks(microphoneStreamRef.current)
    combinedStreamRef.current = null
    displayStreamRef.current = null
    microphoneStreamRef.current = null
  }, [])

  const finalizeStop = useCallback(async (operationId: number) => {
    try {
      await Promise.all(Array.from(pendingSegmentWritesRef.current))

      if (operationId !== operationIdRef.current) {
        cleanupActiveRecording()
        clearStopPromise()
        return
      }

      setError(null)
      setStatus('stopped')
    } catch (nextError) {
      if (operationId !== operationIdRef.current) {
        cleanupActiveRecording()
        clearStopPromise()
        return
      }

      console.error('Failed to finalize segmented presenter recording', { error: nextError })
      setError(SEGMENT_WRITE_ERROR_MESSAGE)
      setStatus('error')
    } finally {
      cleanupActiveRecording()
      clearStopPromise()
    }
  }, [cleanupActiveRecording, clearStopPromise])

  const abort = useCallback(async (message: string) => {
    operationIdRef.current += 1
    cleanupActiveRecording()
    clearStopPromise()
    clearDownloadArtifact()
    setError(message)
    setStatus('error')
  }, [cleanupActiveRecording, clearDownloadArtifact, clearStopPromise])

  const startLongRecording = useCallback(async (options?: LongRecordingStartOptions) => {
    const nextOperationId = operationIdRef.current + 1
    operationIdRef.current = nextOperationId
    cleanupActiveRecording()
    clearStopPromise()
    clearDownloadArtifact()
    clearSegmentState()
    setError(null)

    if (!hasMediaCaptureSupport()) {
      setStatus('unsupported')
      setError(UNSUPPORTED_MESSAGE)
      return
    }

    if (!capability.supported) {
      setStatus(capability.reason === 'missing-media-capture' ? 'unsupported' : 'storage-unavailable')
      setError(capability.reason === 'missing-media-capture' ? UNSUPPORTED_MESSAGE : STORAGE_UNAVAILABLE_MESSAGE)
      return
    }

    const directoryPicker = getDirectoryPicker()
    if (!directoryPicker) {
      setStatus('storage-unavailable')
      setError(STORAGE_UNAVAILABLE_MESSAGE)
      return
    }

    setStatus('preparing')

    let directoryHandle: RecordingDirectoryHandleLike
    try {
      setStatus('selecting-folder')
      directoryHandle = await directoryPicker()
    } catch (nextError) {
      if (operationIdRef.current !== nextOperationId) {
        return
      }

      if (isAbortLikeError(nextError)) {
        setStatus('idle')
        setError(null)
        return
      }

      console.error('Failed to select presenter recording directory', { error: nextError })
      setStatus('storage-unavailable')
      setError(STORAGE_UNAVAILABLE_MESSAGE)
      return
    }

    if (operationIdRef.current !== nextOperationId) {
      return
    }

    setOutputDirectoryName(directoryHandle.name)
    setStatus('requesting-permission')

    const segmentMs = options?.segmentMs ?? SEGMENT_DURATION_MS
    const recordingStartedAt = new Date()
    recordingTimestampRef.current = buildRecordingTimestamp(recordingStartedAt)
    segmentStartAtRef.current = recordingStartedAt.getTime()
    setCurrentSegmentIndex(1)

    let nextDisplayStream: MediaStream | null = null
    let nextMicrophoneStream: MediaStream | null = null

    try {
      nextDisplayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      })
      nextMicrophoneStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      if (operationIdRef.current !== nextOperationId) {
        stopStreamTracks(nextDisplayStream)
        stopStreamTracks(nextMicrophoneStream)
        return
      }

      const videoTracks = nextDisplayStream.getVideoTracks()
      const audioTracks = nextMicrophoneStream.getAudioTracks()

      if (videoTracks.length === 0 || audioTracks.length === 0) {
        throw new Error('Presenter recording is missing a required track.')
      }

      const combinedStream = new MediaStream([...videoTracks, ...audioTracks])
      const preferredMimeType = resolveRecorderMimeType()
      if (!preferredMimeType) {
        throw new Error('A supported WebM recorder codec is unavailable.')
      }

      const nextRecorder = new MediaRecorder(combinedStream, { mimeType: preferredMimeType })
      recorderRef.current = nextRecorder
      displayStreamRef.current = nextDisplayStream
      microphoneStreamRef.current = nextMicrophoneStream
      combinedStreamRef.current = combinedStream
      pendingSegmentWritesRef.current = new Set()

      const handleDisplayEnded = () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          void stopRef.current()
        }
      }

      const writeSegment = async (blob: Blob) => {
        if (blob.size === 0 || operationIdRef.current !== nextOperationId) {
          return
        }

        const segmentIndex = segmentsWrittenRef.current + 1
        const filename = buildSegmentFilename(recordingTimestampRef.current, segmentIndex)
        const segmentEndedAt = Date.now()
        segmentStartAtRef.current = segmentEndedAt

        try {
          const fileHandle = await directoryHandle.getFileHandle(filename, { create: true })
          const writable = await fileHandle.createWritable()
          await writable.write(blob)
          await writable.close()

          if (operationIdRef.current !== nextOperationId) {
            return
          }

          segmentsWrittenRef.current = segmentIndex
          setCurrentSegmentIndex(nextRecorder.state === 'inactive' ? segmentIndex : segmentIndex + 1)
        } catch (writeError) {
          console.error('Failed to persist presenter recording segment', {
            error: writeError,
            filename,
            segmentIndex,
          })
          await abort(SEGMENT_WRITE_ERROR_MESSAGE)
        }
      }

      displayEndedHandlerRef.current = handleDisplayEnded
      videoTracks[0].addEventListener('ended', handleDisplayEnded)

      nextRecorder.ondataavailable = (event) => {
        if (event.data.size === 0) {
          return
        }

        const pendingWrite = writeSegment(event.data)
        pendingSegmentWritesRef.current.add(pendingWrite)
        void pendingWrite.finally(() => {
          pendingSegmentWritesRef.current.delete(pendingWrite)
        })
      }

      nextRecorder.onerror = (event) => {
        console.error('Presenter recording error', { event })
        void abort(RECORDER_RUNTIME_ERROR_MESSAGE)
      }

      nextRecorder.onstop = () => {
        void finalizeStop(nextOperationId)
      }

      nextRecorder.start(segmentMs)

      if (operationIdRef.current !== nextOperationId) {
        nextRecorder.stop()
        return
      }

      setStatus('recording')
    } catch (nextError) {
      stopStreamTracks(nextDisplayStream)
      stopStreamTracks(nextMicrophoneStream)

      if (operationIdRef.current !== nextOperationId) {
        return
      }

      if (isAbortLikeError(nextError)) {
        cleanupActiveRecording()
        clearStopPromise()
        clearSegmentState()
        setStatus('idle')
        setError(null)
        return
      }

      console.error('Failed to start segmented presenter recording', { error: nextError })
      setError(PERMISSION_MESSAGE)
      setStatus('error')
      cleanupActiveRecording()
      clearStopPromise()
    }
  }, [abort, capability, cleanupActiveRecording, clearDownloadArtifact, clearSegmentState, clearStopPromise, finalizeStop])

  const pause = useCallback(() => {
    if (!recorderRef.current || recorderRef.current.state !== 'recording') {
      return
    }

    recorderRef.current.pause()
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    if (!recorderRef.current || recorderRef.current.state !== 'paused') {
      return
    }

    recorderRef.current.resume()
    setStatus('recording')
  }, [])

  const stop = useCallback(async () => {
    if (status === 'preparing' || status === 'selecting-folder' || status === 'requesting-permission') {
      operationIdRef.current += 1
      cleanupActiveRecording()
      clearStopPromise()
      clearSegmentState()
      setStatus('idle')
      setError(null)
      return
    }

    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') {
      return
    }

    if (!stopPromiseRef.current) {
      stopPromiseRef.current = new Promise<void>((resolve) => {
        stopResolverRef.current = resolve
      })
      setStatus('finishing')
      recorder.stop()
    }

    await stopPromiseRef.current
  }, [cleanupActiveRecording, clearSegmentState, clearStopPromise, status])

  stopRef.current = stop

  const resetCompleted = useCallback(() => {
    clearDownloadArtifact()
    clearSegmentState()
    setError(null)
    setStatus('idle')
  }, [clearDownloadArtifact, clearSegmentState])

  useEffect(() => {
    return () => {
      operationIdRef.current += 1
      cleanupActiveRecording()
      clearDownloadArtifact()
      clearSegmentState()
      clearStopPromise()
    }
  }, [cleanupActiveRecording, clearDownloadArtifact, clearSegmentState, clearStopPromise])

  return {
    status,
    error,
    downloadUrl,
    downloadFilename,
    currentSegmentIndex,
    outputDirectoryName,
    isLongRecordingSupported: capability.supported,
    start: startLongRecording,
    startLongRecording,
    pause,
    resume,
    stop,
    abort,
    resetCompleted,
  }
}
