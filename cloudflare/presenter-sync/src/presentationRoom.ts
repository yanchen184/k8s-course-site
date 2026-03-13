import {
  isAllowedPresentationMessageForSender,
  isFreshPresentationMessage,
  isPresentationSyncMessage,
  type PresentationSenderRole,
} from '../../../src/types/presentation'

export interface PresentationRoomPeer {
  send: (message: string) => void
}

export interface PresentationRoomPeerMetadata {
  senderRole: PresentationSenderRole
  controlTokenHash: string | null
  controlAuthorizationVersion: number | null
}

export interface PresentationRoomControlTokenState {
  tokenHash: string
  expiresAt: number
  version: number
}

export type PresentationControlAuthorizationResult =
  | { status: 'authorized', version: number }
  | { status: 'pending' }
  | { status: 'rejected', reason: 'invalid' | 'expired' }

export class PresentationRoom {
  static readonly MAX_MESSAGE_BYTES = 8_192
  static readonly MAX_PEERS = 32
  private readonly peers = new Map<PresentationRoomPeer, PresentationRoomPeerMetadata>()
  private lastPresenterState: string | null = null
  private activeControlToken: PresentationRoomControlTokenState | null = null

  restorePeer(peer: PresentationRoomPeer, metadata: PresentationRoomPeerMetadata): void {
    this.peers.set(peer, metadata)
    this.reauthorizePeer(peer)
  }

  canAcceptPeer(): boolean {
    return this.peers.size < PresentationRoom.MAX_PEERS
  }

  addPeer(peer: PresentationRoomPeer, metadata: PresentationRoomPeerMetadata): boolean {
    if (!this.canAcceptPeer()) {
      return false
    }

    this.peers.set(peer, metadata)
    this.reauthorizePeer(peer)

    if (this.lastPresenterState) {
      peer.send(this.lastPresenterState)
    }

    return true
  }

  removePeer(peer: PresentationRoomPeer): void {
    this.peers.delete(peer)
  }

  hydrateActiveControlToken(state: PresentationRoomControlTokenState | null): void {
    this.activeControlToken = state
    this.reauthorizeMatchingPeers()
  }

  getActiveControlToken(): PresentationRoomControlTokenState | null {
    return this.activeControlToken
  }

  registerActiveControlToken(tokenHash: string, expiresAt: number): PresentationRoomControlTokenState {
    if (this.activeControlToken?.tokenHash === tokenHash) {
      this.activeControlToken = {
        ...this.activeControlToken,
        expiresAt,
      }
      return this.activeControlToken
    }

    this.activeControlToken = {
      tokenHash,
      expiresAt,
      version: (this.activeControlToken?.version ?? 0) + 1,
    }
    this.reauthorizeMatchingPeers()
    return this.activeControlToken
  }

  clearActiveControlToken(): void {
    this.activeControlToken = null
  }

  authorizeControlConnection(tokenHash: string, now = Date.now()): PresentationControlAuthorizationResult {
    if (!this.activeControlToken) {
      return { status: 'pending' }
    }

    if (this.activeControlToken.tokenHash !== tokenHash) {
      return { status: 'rejected', reason: 'invalid' }
    }

    if (now > this.activeControlToken.expiresAt) {
      return { status: 'rejected', reason: 'expired' }
    }

    return {
      status: 'authorized',
      version: this.activeControlToken.version,
    }
  }

  handleMessage(sender: PresentationRoomPeer, rawMessage: string): boolean {
    if (new TextEncoder().encode(rawMessage).byteLength > PresentationRoom.MAX_MESSAGE_BYTES) {
      return false
    }

    try {
      const payload: unknown = JSON.parse(rawMessage)
      if (!isPresentationSyncMessage(payload) || !isAllowedPresentationMessageForSender(payload)) {
        return false
      }

      if (!isFreshPresentationMessage(payload)) {
        return false
      }

      const senderMetadata = this.peers.get(sender)
      if (!senderMetadata || payload.senderRole !== senderMetadata.senderRole) {
        return false
      }

      if (
        payload.senderRole === 'audience' &&
        payload.type === 'SYNC_STATE' &&
        (
          senderMetadata.controlAuthorizationVersion === null ||
          !this.activeControlToken ||
          senderMetadata.controlAuthorizationVersion !== this.activeControlToken.version
        )
      ) {
        return false
      }

      if (payload.type === 'SYNC_STATE' && payload.senderRole === 'presenter') {
        this.lastPresenterState = rawMessage
      }

      for (const peer of this.peers.keys()) {
        if (peer !== sender) {
          peer.send(rawMessage)
        }
      }

      return true
    } catch {
      return false
    }
  }

  private reauthorizeMatchingPeers(): void {
    for (const peer of this.peers.keys()) {
      this.reauthorizePeer(peer)
    }
  }

  private reauthorizePeer(peer: PresentationRoomPeer): void {
    const metadata = this.peers.get(peer)
    if (!metadata || metadata.senderRole !== 'audience' || !metadata.controlTokenHash) {
      return
    }

    if (!this.activeControlToken) {
      return
    }

    if (metadata.controlTokenHash === this.activeControlToken.tokenHash) {
      metadata.controlAuthorizationVersion = this.activeControlToken.version
    }
  }
}
