import { describe, expect, it } from 'vitest'
import { createPresentationMessage } from '../../../src/types/presentation'
import { PresentationRoom } from './presentationRoom'

function createPeer() {
  const sent: string[] = []
  const closed: Array<{ code?: number, reason?: string }> = []
  return {
    peer: {
      send(message: string) {
        sent.push(message)
      },
      close(code?: number, reason?: string) {
        closed.push({ code, reason })
      },
    },
    sent,
    closed,
  }
}

function presenterMeta() {
  return {
    senderRole: 'presenter' as const,
    controlTokenHash: null,
    controlAuthorizationVersion: null,
  }
}

function audienceMeta(controlTokenHash: string | null = null, controlAuthorizationVersion: number | null = null) {
  return {
    senderRole: 'audience' as const,
    controlTokenHash,
    controlAuthorizationVersion,
  }
}

describe('PresentationRoom', () => {
  it('broadcasts valid messages to other peers and replays the latest presenter state to new peers', () => {
    const room = new PresentationRoom()
    const presenter = createPeer()
    const audience = createPeer()
    const lateJoiner = createPeer()

    room.addPeer(presenter.peer, presenterMeta())
    room.addPeer(audience.peer, audienceMeta())

    const syncState = JSON.stringify(
      createPresentationMessage('SYNC_STATE', 'demo-session', 'lesson1-morning', 4, 'presenter'),
    )

    expect(room.handleMessage(presenter.peer, syncState)).toBe(true)
    expect(presenter.sent).toEqual([])
    expect(audience.sent).toEqual([syncState])

    room.addPeer(lateJoiner.peer, audienceMeta())
    expect(lateJoiner.sent).toEqual([syncState])
  })

  it('ignores invalid messages without broadcasting them', () => {
    const room = new PresentationRoom()
    const sender = createPeer()
    const receiver = createPeer()

    room.addPeer(sender.peer, audienceMeta())
    room.addPeer(receiver.peer, audienceMeta())

    expect(room.handleMessage(sender.peer, '{"invalid":true}')).toBe(false)
    expect(receiver.sent).toEqual([])
  })

  it('rejects oversized payloads and sender-role mismatches', () => {
    const room = new PresentationRoom()
    const sender = createPeer()
    const receiver = createPeer()

    room.addPeer(sender.peer, audienceMeta())
    room.addPeer(receiver.peer, audienceMeta())

    const invalidAudienceEndSession = JSON.stringify(
      createPresentationMessage('END_SESSION', 'demo-session', 'lesson1-morning', 0, 'audience'),
    )

    expect(room.handleMessage(sender.peer, invalidAudienceEndSession)).toBe(false)
    expect(receiver.sent).toEqual([])

    const oversizedPayload = 'x'.repeat(PresentationRoom.MAX_MESSAGE_BYTES + 1)
    expect(room.handleMessage(sender.peer, oversizedPayload)).toBe(false)
  })

  it('enforces the room peer limit', () => {
    const room = new PresentationRoom()

    for (let index = 0; index < PresentationRoom.MAX_PEERS; index += 1) {
      expect(room.addPeer(createPeer().peer, audienceMeta())).toBe(true)
    }

    expect(room.canAcceptPeer()).toBe(false)
    expect(room.addPeer(createPeer().peer, audienceMeta())).toBe(false)
  })

  it('rejects controller sync from read-only audience connections', () => {
    const room = new PresentationRoom()
    const readOnlyAudience = createPeer()
    const receiver = createPeer()

    room.addPeer(readOnlyAudience.peer, audienceMeta())
    room.addPeer(receiver.peer, presenterMeta())

    const spoofedControlMessage = JSON.stringify(
      createPresentationMessage('SYNC_STATE', 'demo-session', 'lesson1-morning', 2, 'audience'),
    )

    expect(room.handleMessage(readOnlyAudience.peer, spoofedControlMessage)).toBe(false)
    expect(receiver.sent).toEqual([])
  })

  it('authorizes control audiences only after the presenter registers a matching control token', () => {
    const room = new PresentationRoom()
    const controlAudience = createPeer()
    const presenter = createPeer()

    room.addPeer(controlAudience.peer, audienceMeta('control-hash'))
    room.addPeer(presenter.peer, presenterMeta())

    const controlSync = JSON.stringify(
      createPresentationMessage('SYNC_STATE', 'demo-session', 'lesson1-morning', 2, 'audience'),
    )

    expect(room.handleMessage(controlAudience.peer, controlSync)).toBe(false)

    const activeControlToken = room.registerActiveControlToken('control-hash', Date.now() + 60_000)
    expect(activeControlToken.version).toBe(1)
    expect(room.handleMessage(controlAudience.peer, controlSync)).toBe(true)
  })

  it('rejects new control connections after token expiry but keeps already authorized peers active', () => {
    const room = new PresentationRoom()
    const authorizedControlAudience = createPeer()

    const expiresAt = Date.now() + 1_000
    const activeControlToken = room.registerActiveControlToken('control-hash', expiresAt)
    room.addPeer(authorizedControlAudience.peer, audienceMeta('control-hash', activeControlToken.version))

    const controlSync = JSON.stringify(
      createPresentationMessage('SYNC_STATE', 'demo-session', 'lesson1-morning', 3, 'audience'),
    )

    expect(room.authorizeControlConnection('control-hash', expiresAt + 1)).toEqual({
      status: 'rejected',
      reason: 'expired',
    })
    expect(room.handleMessage(authorizedControlAudience.peer, controlSync)).toBe(true)
  })

  it('revokes previous control peers after the token rotates', () => {
    const room = new PresentationRoom()
    const oldControlAudience = createPeer()
    const newControlAudience = createPeer()

    const firstToken = room.registerActiveControlToken('old-hash', Date.now() + 60_000)
    room.addPeer(oldControlAudience.peer, audienceMeta('old-hash', firstToken.version))

    const controlSync = JSON.stringify(
      createPresentationMessage('SYNC_STATE', 'demo-session', 'lesson1-morning', 4, 'audience'),
    )

    expect(room.handleMessage(oldControlAudience.peer, controlSync)).toBe(true)

    const secondToken = room.registerActiveControlToken('new-hash', Date.now() + 60_000)
    room.addPeer(newControlAudience.peer, audienceMeta('new-hash', secondToken.version))

    expect(oldControlAudience.closed).toEqual([{ code: 4403, reason: 'control-link-invalid' }])
    expect(room.handleMessage(oldControlAudience.peer, controlSync)).toBe(false)
    expect(room.handleMessage(newControlAudience.peer, controlSync)).toBe(true)
  })
})
