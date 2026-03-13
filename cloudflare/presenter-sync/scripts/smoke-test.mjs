import { randomUUID } from 'node:crypto'

const HELP_TEXT = `Usage:
  npm run smoke -- --base-url https://<worker-domain> --origin https://<site-origin>

Options:
  --base-url <url>      Worker base URL or websocket URL.
  --origin <origin>     Allowed browser Origin header to send during websocket tests.
  --deny-origin <url>   Optional Origin that should be rejected by ALLOWED_ORIGINS.
  --health-only         Only verify GET /health.
  --timeout-ms <ms>     Per-request timeout in milliseconds. Default: 5000.
  --help                Show this message.

Environment:
  PRESENTER_SYNC_BASE_URL
  PRESENTER_SYNC_ORIGIN
  PRESENTER_SYNC_DENY_ORIGIN
  PRESENTER_SYNC_TIMEOUT_MS
`

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.PRESENTER_SYNC_BASE_URL ?? '',
    origin: process.env.PRESENTER_SYNC_ORIGIN ?? '',
    denyOrigin: process.env.PRESENTER_SYNC_DENY_ORIGIN ?? '',
    healthOnly: false,
    timeoutMs: Number.parseInt(process.env.PRESENTER_SYNC_TIMEOUT_MS ?? '5000', 10),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--help') {
      args.help = true
      continue
    }

    if (value === '--health-only') {
      args.healthOnly = true
      continue
    }

    if (value === '--base-url') {
      args.baseUrl = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (value === '--origin') {
      args.origin = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (value === '--deny-origin') {
      args.denyOrigin = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (value === '--timeout-ms') {
      args.timeoutMs = Number.parseInt(argv[index + 1] ?? '', 10)
      index += 1
      continue
    }

    throw new Error(`Unknown argument: ${value}`)
  }

  return args
}

function createUrls(rawBaseUrl) {
  if (!rawBaseUrl) {
    throw new Error('Missing --base-url or PRESENTER_SYNC_BASE_URL.')
  }

  const normalized = new URL(rawBaseUrl)
  const websocketUrl = new URL(normalized.toString())

  if (!websocketUrl.pathname.endsWith('/websocket')) {
    const trimmedPath = websocketUrl.pathname.endsWith('/')
      ? websocketUrl.pathname.slice(0, -1)
      : websocketUrl.pathname
    websocketUrl.pathname = `${trimmedPath}/websocket`
  }

  const healthUrl = new URL(websocketUrl.toString())
  healthUrl.pathname = websocketUrl.pathname.replace(/\/websocket$/, '/health')
  healthUrl.search = ''

  if (websocketUrl.protocol === 'https:') {
    websocketUrl.protocol = 'wss:'
  } else if (websocketUrl.protocol === 'http:') {
    websocketUrl.protocol = 'ws:'
  } else if (websocketUrl.protocol !== 'ws:' && websocketUrl.protocol !== 'wss:') {
    throw new Error(`Unsupported protocol for websocket endpoint: ${websocketUrl.protocol}`)
  }

  websocketUrl.search = ''
  return { healthUrl, websocketUrl }
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

function waitForWebSocketOpen(ws, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error(`Timed out while connecting to ${ws.url}`))
    }, timeoutMs)

    function cleanup() {
      clearTimeout(timeout)
      ws.removeEventListener('open', handleOpen)
      ws.removeEventListener('error', handleError)
      ws.removeEventListener('close', handleClose)
    }

    function handleOpen() {
      cleanup()
      resolve()
    }

    function handleError(event) {
      cleanup()
      reject(new Error(`WebSocket error while connecting to ${ws.url}: ${event.type}`))
    }

    function handleClose(event) {
      cleanup()
      reject(new Error(`WebSocket closed before opening (${event.code} ${event.reason || 'no reason'})`))
    }

    ws.addEventListener('open', handleOpen)
    ws.addEventListener('error', handleError)
    ws.addEventListener('close', handleClose)
  })
}

function waitForWebSocketFailure(ws, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error(`Expected websocket failure for ${ws.url}, but the connection stayed open.`))
    }, timeoutMs)

    function cleanup() {
      clearTimeout(timeout)
      ws.removeEventListener('open', handleOpen)
      ws.removeEventListener('error', handleError)
      ws.removeEventListener('close', handleClose)
    }

    function handleOpen() {
      cleanup()
      ws.close(1000, 'Unexpectedly accepted')
      reject(new Error(`Expected websocket rejection for ${ws.url}, but the connection opened.`))
    }

    function handleError() {
      cleanup()
      resolve()
    }

    function handleClose(event) {
      cleanup()
      if (event.code === 1000) {
        reject(new Error(`Expected websocket rejection for ${ws.url}, but it closed cleanly.`))
        return
      }

      resolve()
    }

    ws.addEventListener('open', handleOpen)
    ws.addEventListener('error', handleError)
    ws.addEventListener('close', handleClose)
  })
}

function nextMessage(ws, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error(`Timed out waiting for message from ${ws.url}`))
    }, timeoutMs)

    function cleanup() {
      clearTimeout(timeout)
      ws.removeEventListener('message', handleMessage)
      ws.removeEventListener('error', handleError)
      ws.removeEventListener('close', handleClose)
    }

    function handleMessage(event) {
      cleanup()
      resolve(event.data)
    }

    function handleError(event) {
      cleanup()
      reject(new Error(`WebSocket error while waiting for message from ${ws.url}: ${event.type}`))
    }

    function handleClose(event) {
      cleanup()
      reject(new Error(`WebSocket closed while waiting for message (${event.code} ${event.reason || 'no reason'})`))
    }

    ws.addEventListener('message', handleMessage)
    ws.addEventListener('error', handleError)
    ws.addEventListener('close', handleClose)
  })
}

async function expectNoMessage(ws, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup()
      resolve()
    }, timeoutMs)

    function cleanup() {
      clearTimeout(timeout)
      ws.removeEventListener('message', handleMessage)
      ws.removeEventListener('error', handleError)
      ws.removeEventListener('close', handleClose)
    }

    function handleMessage(event) {
      cleanup()
      reject(new Error(`Expected no message from ${ws.url}, but received: ${event.data}`))
    }

    function handleError(event) {
      cleanup()
      reject(new Error(`WebSocket error while waiting for silence from ${ws.url}: ${event.type}`))
    }

    function handleClose(event) {
      cleanup()
      reject(new Error(`WebSocket closed while waiting for silence (${event.code} ${event.reason || 'no reason'})`))
    }

    ws.addEventListener('message', handleMessage)
    ws.addEventListener('error', handleError)
    ws.addEventListener('close', handleClose)
  })
}

function createMessage(type, sessionId, lessonId, slideIndex, senderRole, controlToken) {
  const payload = {
    type,
    sessionId,
    lessonId,
    slideIndex,
    senderRole,
    sentAt: Date.now(),
  }

  if (controlToken) {
    payload.controlToken = controlToken
  }

  return JSON.stringify(payload)
}

function connectWebSocket(websocketUrl, sessionId, role, timeoutMs, origin, controlToken) {
  const url = new URL(websocketUrl.toString())
  url.searchParams.set('session', sessionId)
  url.searchParams.set('role', role)

  if (controlToken) {
    url.searchParams.set('control', controlToken)
  }

  const init = origin ? { headers: { Origin: origin } } : undefined
  const ws = new WebSocket(url, init)
  return waitForWebSocketOpen(ws, timeoutMs).then(() => ws)
}

async function closeSocket(ws) {
  if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
    return
  }

  await new Promise((resolve) => {
    const finish = () => {
      ws.removeEventListener('close', finish)
      resolve()
    }

    ws.addEventListener('close', finish)
    ws.close(1000, 'Smoke test complete')
  })
}

async function run() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(HELP_TEXT)
    return
  }

  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs <= 0) {
    throw new Error('Timeout must be a positive integer.')
  }

  const { healthUrl, websocketUrl } = createUrls(args.baseUrl)
  console.log(`Health check: ${healthUrl}`)
  const healthResponse = await fetchWithTimeout(healthUrl, args.timeoutMs)
  const healthBody = await healthResponse.text()
  if (!healthResponse.ok || healthBody.trim() !== 'ok') {
    throw new Error(`Health check failed with status ${healthResponse.status}: ${healthBody}`)
  }
  console.log('Health check passed.')

  if (args.healthOnly) {
    return
  }

  if (!args.origin) {
    throw new Error('Missing --origin or PRESENTER_SYNC_ORIGIN for websocket validation.')
  }

  const sessionId = `smoke-${randomUUID()}`
  const controlToken = randomUUID()
  const lessonId = 'lesson1-morning'
  const presenter = await connectWebSocket(websocketUrl, sessionId, 'presenter', args.timeoutMs, args.origin, controlToken)
  const readOnlyAudience = await connectWebSocket(websocketUrl, sessionId, 'audience', args.timeoutMs, args.origin)
  const controlAudience = await connectWebSocket(websocketUrl, sessionId, 'audience', args.timeoutMs, args.origin, controlToken)

  try {
    presenter.send(createMessage('SYNC_STATE', sessionId, lessonId, 1, 'presenter'))
    const audienceSync = JSON.parse(await nextMessage(readOnlyAudience, args.timeoutMs))
    if (audienceSync.type !== 'SYNC_STATE' || audienceSync.slideIndex !== 1 || audienceSync.senderRole !== 'presenter') {
      throw new Error('Read-only audience did not receive the presenter sync state.')
    }
    console.log('Presenter to audience sync passed.')

    readOnlyAudience.send(createMessage('SYNC_STATE', sessionId, lessonId, 2, 'audience', randomUUID()))
    await expectNoMessage(presenter, Math.min(args.timeoutMs, 1000))
    console.log('Read-only audience rejection passed.')

    controlAudience.send(createMessage('SYNC_STATE', sessionId, lessonId, 3, 'audience'))
    const presenterSync = JSON.parse(await nextMessage(presenter, args.timeoutMs))
    if (presenterSync.type !== 'SYNC_STATE' || presenterSync.slideIndex !== 3 || presenterSync.senderRole !== 'audience') {
      throw new Error('Control audience did not reach the presenter.')
    }
    console.log('Control audience sync passed.')

    if (args.denyOrigin) {
      const denyUrl = new URL(websocketUrl.toString())
      denyUrl.searchParams.set('session', `deny-${randomUUID()}`)
      denyUrl.searchParams.set('role', 'audience')
      const deniedSocket = new WebSocket(denyUrl, {
        headers: {
          Origin: args.denyOrigin,
        },
      })
      await waitForWebSocketFailure(deniedSocket, args.timeoutMs)
      console.log('Denied origin check passed.')
    }

    console.log('Smoke test passed.')
  } finally {
    await Promise.allSettled([
      closeSocket(presenter),
      closeSocket(readOnlyAudience),
      closeSocket(controlAudience),
    ])
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
