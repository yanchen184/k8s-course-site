import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  buildPresentationChannelName,
  isFreshPresentationMessage,
  isPresentationSyncMessage,
  type PresentationSenderRole,
  type PresentationSyncMessage,
} from '../types/presentation'
import {
  buildCloudflareWebSocketUrl,
  classifyCloudflareTransportIssue,
  getPresentationSyncCapability,
  parsePresentationSyncConfig,
  resolvePresentationTransport,
  shouldUseBroadcastFallback,
  type PresentationSyncCapability,
  type PresentationTransportKind,
  type PresentationTransportIssue,
  type PresentationTransportStatus,
} from '../types/presentationTransport'

type TransportSender = (message: PresentationSyncMessage) => boolean

interface UsePresentationChannelResult {
  latestMessage: PresentationSyncMessage | null
  transportStatus: PresentationTransportStatus
  transportKind: PresentationTransportKind | null
  transportIssue: PresentationTransportIssue | null
  syncCapability: PresentationSyncCapability
  sendMessage: (message: PresentationSyncMessage) => boolean
}

interface UsePresentationChannelOptions {
  senderRole: PresentationSenderRole
  controlToken?: string | null
}

export function usePresentationChannel(
  sessionId: string | null,
  options: UsePresentationChannelOptions,
): UsePresentationChannelResult {
  const syncConfig = useMemo(() => parsePresentationSyncConfig(import.meta.env), [])
  const [latestMessage, setLatestMessage] = useState<PresentationSyncMessage | null>(null)
  const [transportStatus, setTransportStatus] = useState<PresentationTransportStatus>('idle')
  const [transportKind, setTransportKind] = useState<PresentationTransportKind | null>(null)
  const [transportIssue, setTransportIssue] = useState<PresentationTransportIssue | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const senderRef = useRef<TransportSender | null>(null)

  const cleanupTransport = useCallback(() => {
    channelRef.current?.close()
    channelRef.current = null

    if (socketRef.current) {
      const socket = socketRef.current
      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
    socketRef.current = null
    senderRef.current = null
  }, [])

  useEffect(() => {
    let disposed = false
    let didFallback = false

    cleanupTransport()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLatestMessage(null)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransportIssue(null)

    if (!sessionId) {
      setTransportStatus('idle')
      setTransportKind(null)
      return
    }

    const attachBroadcastTransport = (status: PresentationTransportStatus) => {
      if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
        setTransportKind(null)
        setTransportStatus('unsupported')
        return
      }

      const channel = new BroadcastChannel(buildPresentationChannelName(sessionId))
      channelRef.current = channel
      senderRef.current = (message) => {
        channel.postMessage(message)
        return true
      }
      setTransportKind('broadcast')
      setTransportStatus(status)
      setTransportIssue(null)

      channel.onmessage = (event: MessageEvent<unknown>) => {
          if (!isPresentationSyncMessage(event.data) || event.data.sessionId !== sessionId || !isFreshPresentationMessage(event.data)) {
            return
          }

        setLatestMessage(event.data)
      }
    }

    const fallbackToBroadcast = () => {
      if (didFallback || !shouldUseBroadcastFallback(syncConfig.mode)) {
        return
      }
      didFallback = true
      cleanupTransport()
      attachBroadcastTransport('fallback')
    }

    const connectCloudflareTransport = () => {
      if (typeof window === 'undefined' || typeof window.WebSocket === 'undefined') {
        if (shouldUseBroadcastFallback(syncConfig.mode)) {
          fallbackToBroadcast()
          return
        }
        setTransportKind(null)
        setTransportStatus('unsupported')
        return
      }

      if (!syncConfig.cloudflareUrl) {
        if (shouldUseBroadcastFallback(syncConfig.mode)) {
          fallbackToBroadcast()
          return
        }
        setTransportKind(null)
        setTransportStatus('error')
        return
      }

      const socketUrl = buildCloudflareWebSocketUrl(syncConfig.cloudflareUrl, sessionId, options.senderRole, options.controlToken)
      if (!socketUrl) {
        if (shouldUseBroadcastFallback(syncConfig.mode)) {
          fallbackToBroadcast()
          return
        }
        setTransportKind(null)
        setTransportStatus('error')
        return
      }

      const socket = new WebSocket(socketUrl)
      socketRef.current = socket
      senderRef.current = (message) => {
        if (socket.readyState !== WebSocket.OPEN) {
          return false
        }

        socket.send(JSON.stringify(message))
        return true
      }
      setTransportKind('cloudflare')
      setTransportStatus('connecting')
      setTransportIssue(null)

      const failCloudflareTransport = (event?: CloseEvent) => {
        if (disposed) {
          return
        }

        const transportIssue = event
          ? classifyCloudflareTransportIssue(event.code, event.reason)
          : null
        if (transportIssue) {
          cleanupTransport()
          setTransportKind(null)
          setTransportIssue(transportIssue)
          setTransportStatus('error')
          return
        }

        if (shouldUseBroadcastFallback(syncConfig.mode)) {
          fallbackToBroadcast()
          return
        }

        cleanupTransport()
        setTransportKind(null)
        setTransportStatus('error')
      }

      socket.onopen = () => {
        if (disposed) {
          socket.close()
          return
        }
        setTransportStatus('ready')
      }

      socket.onmessage = (event) => {
        if (typeof event.data !== 'string') {
          return
        }

        try {
          const payload: unknown = JSON.parse(event.data)
          if (!isPresentationSyncMessage(payload) || payload.sessionId !== sessionId || !isFreshPresentationMessage(payload)) {
            return
          }

          setLatestMessage(payload)
        } catch {
          // Ignore invalid payloads from the relay.
        }
      }

      socket.onerror = () => {
        // Wait for onclose to finalize fallback/error state.
      }

      socket.onclose = (event) => {
        failCloudflareTransport(event)
      }
    }

    if (resolvePresentationTransport(syncConfig) === 'cloudflare') {
      connectCloudflareTransport()
    } else {
      attachBroadcastTransport('ready')
    }

    return () => {
      disposed = true
      cleanupTransport()
    }
  }, [cleanupTransport, options.controlToken, options.senderRole, sessionId, syncConfig])

  const sendMessage = useCallback((message: PresentationSyncMessage): boolean => {
    if (!senderRef.current) {
      return false
    }
    return senderRef.current(message)
  }, [])

  return {
    latestMessage,
    transportStatus,
    transportKind,
    transportIssue,
    syncCapability: getPresentationSyncCapability(transportKind, transportStatus),
    sendMessage,
  }
}
