import { useCallback, useEffect, useRef, useState } from 'react'

export type PresenterRecordingStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'error'
  | 'unsupported'

export interface UsePresenterRecordingResult {
  status: PresenterRecordingStatus
  error: string | null
  downloadUrl: string | null
  downloadFilename: string | null
  start: () => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => Promise<void>
  resetCompleted: () => void
}

const UNSUPPORTED_MESSAGE = 'Recording is unavailable in this browser.'
const PERMISSION_MESSAGE = 'Recording needs screen sharing and microphone access.'
const FINALIZE_ERROR_MESSAGE = 'Recording could not be finalized. Try again.'

const RECORDER_MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
]

function isRecordingSupported(): boolean {
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

function inferExtension(mimeType: string): 'webm' | 'mp4' {
  return mimeType.includes('mp4') ? 'mp4' : 'webm'
}

function buildDownloadFilename(mimeType: string): string {
  const now = new Date()
  const timestamp = [
    now.getFullYear().toString(),
    `${now.getMonth() + 1}`.padStart(2, '0'),
    `${now.getDate()}`.padStart(2, '0'),
  ].join('')
    + '-'
    + [
      `${now.getHours()}`.padStart(2, '0'),
      `${now.getMinutes()}`.padStart(2, '0'),
      `${now.getSeconds()}`.padStart(2, '0'),
    ].join('')

  return `k8s-course-presenter-${timestamp}.${inferExtension(mimeType)}`
}

function stopStreamTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
}

export function usePresenterRecording(): UsePresenterRecordingResult {
  const [status, setStatus] = useState<PresenterRecordingStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const displayStreamRef = useRef<MediaStream | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const combinedStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const stopPromiseRef = useRef<Promise<void> | null>(null)
  const stopResolverRef = useRef<(() => void) | null>(null)
  const operationIdRef = useRef(0)
  const downloadUrlRef = useRef<string | null>(null)
  const displayEndedHandlerRef = useRef<(() => void) | null>(null)
  const stopRef = useRef<() => Promise<void>>(async () => {})

  const clearDownloadArtifact = useCallback(() => {
    if (downloadUrlRef.current && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(downloadUrlRef.current)
    }

    downloadUrlRef.current = null
    setDownloadUrl(null)
    setDownloadFilename(null)
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
    chunksRef.current = []
  }, [])

  const finalizeRecording = useCallback((mimeType: string, operationId: number) => {
    if (operationId !== operationIdRef.current) {
      cleanupActiveRecording()
      clearStopPromise()
      return
    }

    try {
      const nextBlob = new Blob(chunksRef.current, mimeType ? { type: mimeType } : undefined)
      const nextUrl = URL.createObjectURL(nextBlob)

      clearDownloadArtifact()
      downloadUrlRef.current = nextUrl
      setDownloadUrl(nextUrl)
      setDownloadFilename(buildDownloadFilename(mimeType || 'video/webm'))
      setError(null)
      setStatus('stopped')
    } catch (nextError) {
      console.error('Failed to finalize presenter recording', { error: nextError })
      setError(FINALIZE_ERROR_MESSAGE)
      setStatus('error')
    } finally {
      cleanupActiveRecording()
      clearStopPromise()
    }
  }, [cleanupActiveRecording, clearDownloadArtifact, clearStopPromise])

  const start = useCallback(async () => {
    const nextOperationId = operationIdRef.current + 1
    operationIdRef.current = nextOperationId
    cleanupActiveRecording()
    clearStopPromise()
    clearDownloadArtifact()
    setError(null)

    if (!isRecordingSupported()) {
      setStatus('unsupported')
      setError(UNSUPPORTED_MESSAGE)
      return
    }

    setStatus('requesting')

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
      const nextRecorder = preferredMimeType
        ? new MediaRecorder(combinedStream, { mimeType: preferredMimeType })
        : new MediaRecorder(combinedStream)
      const resolvedMimeType = nextRecorder.mimeType || preferredMimeType || 'video/webm'

      recorderRef.current = nextRecorder
      displayStreamRef.current = nextDisplayStream
      microphoneStreamRef.current = nextMicrophoneStream
      combinedStreamRef.current = combinedStream
      chunksRef.current = []

      const handleDisplayEnded = () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          void stopRef.current()
        }
      }

      displayEndedHandlerRef.current = handleDisplayEnded
      videoTracks[0].addEventListener('ended', handleDisplayEnded)

      nextRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      nextRecorder.onerror = (event) => {
        console.error('Presenter recording error', { event })
      }
      nextRecorder.onstop = () => {
        finalizeRecording(resolvedMimeType, nextOperationId)
      }
      nextRecorder.start()

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

      console.error('Failed to start presenter recording', { error: nextError })
      setError(PERMISSION_MESSAGE)
      setStatus('error')
      cleanupActiveRecording()
      clearStopPromise()
    }
  }, [cleanupActiveRecording, clearDownloadArtifact, clearStopPromise, finalizeRecording])

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
    if (status === 'requesting') {
      operationIdRef.current += 1
      cleanupActiveRecording()
      clearStopPromise()
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
      recorder.stop()
    }

    await stopPromiseRef.current
  }, [cleanupActiveRecording, clearStopPromise, status])

  stopRef.current = stop

  const resetCompleted = useCallback(() => {
    clearDownloadArtifact()
    setError(null)
    setStatus('idle')
  }, [clearDownloadArtifact])

  useEffect(() => {
    return () => {
      operationIdRef.current += 1
      cleanupActiveRecording()
      clearDownloadArtifact()
      clearStopPromise()
    }
  }, [cleanupActiveRecording, clearDownloadArtifact, clearStopPromise])

  return {
    status,
    error,
    downloadUrl,
    downloadFilename,
    start,
    pause,
    resume,
    stop,
    resetCompleted,
  }
}
