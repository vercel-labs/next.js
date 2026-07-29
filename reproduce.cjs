const assert = require('node:assert/strict')
const childProcess = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'next-96317-'))
const distDir = path.join(sandbox, '.next')
process.env.XDG_CONFIG_HOME = path.join(sandbox, 'config')
delete process.env.NEXT_TELEMETRY_DISABLED
delete process.env.NEXT_TELEMETRY_DEBUG

let requestSignal
let spawnCalls = 0

global.fetch = (_url, options) => {
  requestSignal = options.signal
  return new Promise((_resolve, reject) => {
    requestSignal.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

// Keep flushDetached's filesystem behavior, but do not launch its detached child.
childProcess.spawn = () => {
  spawnCalls += 1
  return { unref() {} }
}

const { Telemetry } = require('next/dist/telemetry/storage')
const nextVersion = require('next/package.json').version
const telemetry = new Telemetry({ distDir })
const recordPromise = telemetry.record({
  eventName: 'NEXT_CLI_SESSION_STOPPED',
  payload: { reproduction: 96317 },
})

async function waitForRequest() {
  const deadline = Date.now() + 5000
  while (!requestSignal && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  assert.ok(requestSignal, 'telemetry fetch did not start within 5 seconds')
}

async function main() {
  await waitForRequest()

  const [queuedPromise] = telemetry.queue
  assert.equal(telemetry.queue.size, 1, 'expected one in-flight telemetry item')
  assert.equal(queuedPromise, recordPromise, 'queue should contain record() result')
  assert.equal(
    queuedPromise._controller,
    undefined,
    'queued promise unexpectedly retained the AbortController'
  )
  assert.equal(requestSignal.aborted, false)

  console.log(`Next.js version: ${nextVersion}`)
  console.log(`queued promise has own _controller: ${Object.hasOwn(queuedPromise, '_controller')}`)
  console.log(`queued promise _controller: ${String(queuedPromise._controller)}`)
  console.log(`request aborted before flushDetached: ${requestSignal.aborted}`)

  telemetry.flushDetached('dev', sandbox)

  const eventsFile = fs
    .readdirSync(distDir)
    .find((name) => name.startsWith('_events_') && name.endsWith('.json'))

  console.log(`request aborted after flushDetached: ${requestSignal.aborted}`)
  console.log(`detached flush event file written: ${Boolean(eventsFile)}`)
  console.log(`detached child spawn intercepted: ${spawnCalls === 1}`)

  assert.equal(
    requestSignal.aborted,
    false,
    'expected the bug: flushDetached unexpectedly aborted the in-flight request'
  )
  assert.ok(eventsFile, 'flushDetached did not persist the queued event')
  assert.equal(spawnCalls, 1, 'flushDetached did not attempt one detached spawn')

  console.log('BUG REPRODUCED: flushDetached persisted the event but did not abort its in-flight request.')
  fs.rmSync(sandbox, { recursive: true, force: true })
}

main().catch((error) => {
  fs.rmSync(sandbox, { recursive: true, force: true })
  console.error(error)
  process.exitCode = 1
})
