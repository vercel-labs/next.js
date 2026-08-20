// Starts `next start` with the OTel preload, sends one request carrying a
// W3C `traceparent`, then prints every exported span grouped by traceId.
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const LOG = new URL('./spans.jsonl', import.meta.url).pathname
fs.writeFileSync(LOG, '')
const PORT = process.env.PORT || '3000'
const TRACE_ID = '11111111111111111111111111111111'
const SPAN_ID = '2222222222222222'

const server = spawn('npx', ['next', 'start', '-p', PORT], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SPAN_LOG: LOG,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --require ./otel-preload.cjs`,
  },
})

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
for (let i = 0; i < 40; i++) {
  try {
    await fetch(`http://localhost:${PORT}/`)
    break
  } catch {
    await wait(500)
  }
}

const res = await fetch(`http://localhost:${PORT}/`, {
  headers: { traceparent: `00-${TRACE_ID}-${SPAN_ID}-01` },
})
console.log('\nstatus', res.status)
await wait(1500)
server.kill()

const spans = fs
  .readFileSync(LOG, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))
const ids = new Set(spans.map((s) => s.spanId))
const traces = {}
for (const s of spans) (traces[s.traceId] ??= []).push(s)

for (const [traceId, list] of Object.entries(traces)) {
  const roots = list.filter((s) => !s.parentSpanId || !ids.has(s.parentSpanId))
  console.log(
    `\ntrace ${traceId}${traceId === TRACE_ID ? '  <-- incoming traceparent' : ''}`
  )
  for (const s of list) {
    console.log(
      `  ${s.name} kind=${s.kind} span=${s.spanId} parent=${s.parentSpanId}`
    )
  }
  console.log(`  roots: ${roots.map((r) => `${r.name}(parent=${r.parentSpanId})`).join(', ')}`)
}
