/**
 * Deterministic harness for vercel/next.js#97918.
 *
 * Loads the REAL shipped Next.js 16.3.2 modules on both sides of the React
 * debug channel:
 *   server: next/dist/server/dev/debug-channel.js  -> connectReactDebugChannel
 *   client: next/dist/client/dev/debug-channel.js  -> getOrCreateDebugChannelReadableWriterPair
 * and reproduces the client call site verbatim from
 *   next/dist/client/dev/hot-reloader/app/hot-reloader-app.js (~line 411).
 *
 * Trigger used here is the server-side path called out in the issue: in the
 * Node-stream branch, `stop()` (chunk: null) runs on source 'error' while the
 * buffered transform still has a pending microtask flush, and `sendChunk` is
 * not gated on `finished`. The client then hands the late chunk to the cached
 * (already closed) writer, because the pair map deliberately outlives close.
 */
import { PassThrough } from 'node:stream'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// Minimal browser globals the client module touches.
globalThis.self = globalThis
globalThis.self.__next_r = 'document-request-id' // not our request id -> no IndexedDB path

const { connectReactDebugChannel } = require('next/dist/server/dev/debug-channel.js')
const {
  getOrCreateDebugChannelReadableWriterPair,
} = require('next/dist/client/dev/debug-channel.js')

const consoleErrors = []
const origError = console.error
console.error = (...args) => {
  consoleErrors.push(args)
  origError('[dev overlay would surface]', ...args)
}

// ---- client side: verbatim hot-reloader-app.js REACT_DEBUG_CHUNK handler ----
function handleHmrMessage(message) {
  const { requestId, chunk } = message
  const { writer } = getOrCreateDebugChannelReadableWriterPair(requestId)
  if (chunk) {
    writer.ready.then(() => writer.write(chunk)).catch(console.error)
  } else {
    writer.ready.then(() => writer.close()).catch(console.error)
  }
}

// ---- server side ----
const requestId = 'navigation-request-1'
const source = new PassThrough()
connectReactDebugChannel(requestId, { readable: source }, (message) => {
  origError(
    `[ws -> browser] REACT_DEBUG_CHUNK chunk=${
      message.chunk === null ? 'null (close)' : message.chunk.byteLength + ' bytes'
    }`
  )
  handleHmrMessage(message)
})

// Read the client readable so the stream isn't just backpressured.
const { readable } = getOrCreateDebugChannelReadableWriterPair(requestId)
;(async () => {
  const reader = readable.getReader()
  try {
    while (true) {
      const { done } = await reader.read()
      if (done) break
    }
  } catch {}
})()

// A debug chunk is buffered (flush is deferred to a microtask)...
source.write(Buffer.from('{"debug":"chunk"}'))
// ...and the source errors in the same tick: stop() sends chunk: null first,
// then the pending flush emits 'data' -> sendChunk after the close signal.
source.emit('error', new Error('boom'))

setTimeout(() => {
  const hit = consoleErrors.flat().some(
    (e) => e && /CLOSED writable stream|closed writable stream|WritableStream is closed/i.test(String(e && e.message || e))
  )
  origError('\n--- result ---')
  origError('console.error calls:', consoleErrors.length)
  for (const args of consoleErrors) origError(' *', ...args.map(String))
  origError(hit ? 'REPRODUCED: write to CLOSED writer surfaced via console.error' : 'NOT REPRODUCED')
  process.exit(hit ? 0 : 1)
}, 300)
