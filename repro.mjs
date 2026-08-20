// Automated reproduction for https://github.com/vercel/next.js/issues/69409
// Starts `next dev`, sends a request BEFORE next.config.js finishes its async
// env mutation (t+10s), then another request AFTER it, and prints the
// middleware logs. The second request should show ENV_WITH_CONFIGURE_NEXT=true
// but it stays `undefined`.
import { spawn } from 'node:child_process'

const PORT = process.env.PORT || '3000'
const out = []
const dev = spawn('npx', ['next', 'dev', '-p', PORT], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
for (const s of [dev.stdout, dev.stderr]) {
  s.on('data', (d) => {
    out.push(d.toString())
    process.stdout.write(d)
  })
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const hit = async (label) => {
  console.log(`\n=== request: ${label} ===`)
  try {
    await fetch(`http://localhost:${PORT}/`)
  } catch (e) {
    console.log('request failed', e.message)
  }
  await wait(4000)
}

await wait(6000)
await hit('t+~6s, before next.config.js sets the env var')
await wait(14000)
await hit('t+~24s, after next.config.js set the env var')

dev.kill('SIGKILL')
const log = out.join('')
const values = [...log.matchAll(/MW ENV_WITH_CONFIGURE_NEXT: (\S+)/g)].map((m) => m[1])
console.log('\nENV_WITH_CONFIGURE_NEXT seen in middleware:', values.join(', '))
if (values.length === 2 && values[1] === 'undefined') {
  console.log('REPRODUCED: middleware never sees the env var set asynchronously in next.config.js')
  process.exit(0)
}
console.log('NOT REPRODUCED')
process.exit(1)
