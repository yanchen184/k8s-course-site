import { useCallback, useEffect, useRef, useState } from 'react'
import {
  buildPresentationChannelName,
  isPresentationSyncMessage,
  type PresentationSyncMessage,
} from '../types/presentation'

type TransportStatus = 'idle' | 'unsupported' | 'ready'

interface UsePresentationChannelResult {
  latestMessage: PresentationSyncMessage | null
  transportStatus: TransportStatus
  sendMessage: (message: PresentationSyncMessage) => boolean
}

export function usePresentationChannel(sessionId: string | null): UsePresentationChannelResult {
  const [latestMessage, setLatestMessage] = useState<PresentationSyncMessage | null>(null)
  const [transportStatus, setTransportStatus] = useState<TransportStatus>('idle')
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (!sessionId) {
      channelRef.current?.close()
      channelRef.current = null
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransportStatus('idle')
      return
    }

    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      channelRef.current?.close()
      channelRef.current = null
      setTransportStatus('unsupported')
      return
    }

    const channel = new BroadcastChannel(buildPresentationChannelName(sessionId))
    channelRef.current = channel
    setTransportStatus('ready')

    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (!isPresentationSyncMessage(event.data)) {
        return
      }

      if (event.data.sessionId !== sessionId) {
        return
      }

      setLatestMessage(event.data)
    }

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [sessionId])

  const sendMessage = useCallback((message: PresentationSyncMessage): boolean => {
    if (!channelRef.current) {
      return false
    }
    channelRef.current.postMessage(message)
    return true
  }, [])

  return {
    latestMessage,
    transportStatus,
    sendMessage,
  }
}
