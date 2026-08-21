// Reproduces: DOMException [OperationError] ... [cause]: [Error: Cipher job failed]
// thrown from Next.js' internal AES-GCM Server Action bound-args decryption
// (next/dist/server/app-render/encryption-utils.js), returned to the client as a 500.
//
// Two `next start` instances run the SAME build but with different
// NEXT_SERVER_ACTIONS_ENCRYPTION_KEY values (what happens across a redeploy, or
// across instances / regions that do not share the build-time key, or when a
// CDN/ISR-cached RSC payload from an older deployment is replayed).
// The encrypted closure payload rendered by instance A is then sent to
// instance B, exactly like a browser (or a crawler replaying a stale page) does.
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdirSync, createWriteStream } from 'node:fs'

const LOG_DIR = process.env.REPRO_LOG_DIR || 'logs'
mkdirSync(LOG_DIR, { recursive: true })

const key = () => randomBytes(32).toString('base64')
const servers = []

function start(name, port, encryptionKey) {
  const out = createWriteStream(`${LOG_DIR}/${name}.log`)
  const p = spawn('node_modules/.bin/next', ['start', '-p', String(port)], {
    env: { ...process.env, NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: encryptionKey },
  })
  p.stdout.pipe(out)
  p.stderr.pipe(out)
  servers.push(p)
  return p
}

const waitFor = async (port) => {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${port}/`)
      if (r.ok) return await r.text()
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`server on ${port} never became ready`)
}

start('instance-a-key-a', 3000, key())
start('instance-b-key-b', 3001, key())

const html = await waitFor(3000)
await waitFor(3001)

const actionId = html.match(/id\\?":\\?"([0-9a-f]{40,})\\?"/)[1]
const payload = html.match(/([A-Za-z0-9+/]{80,}={0,2})/)[1]
console.log('action id:', actionId)
console.log('encrypted bound args from instance A:', payload.slice(0, 40) + '...')

for (const port of [3000, 3001]) {
  const res = await fetch(`http://localhost:${port}/`, {
    method: 'POST',
    headers: {
      'Next-Action': actionId,
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    body: JSON.stringify([payload]),
  })
  const body = await res.text()
  const label = port === 3000 ? 'instance A (same key that encrypted)' : 'instance B (different key)'
  console.log(`\n--- POST ${label}: HTTP ${res.status}`)
  console.log(body.trim())
}

console.log(`\nServer logs written to ${LOG_DIR}/ - instance-b-key-b.log contains:`)
console.log(`  DOMException [OperationError]: The operation failed for an operation-specific reason`)
console.log(`      at AESCipherJob.onDone (node:internal/crypto/util) { digest: '...', [cause]: [Error: Cipher job failed] }`)

for (const p of servers) p.kill()
