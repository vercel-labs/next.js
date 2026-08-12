import { writeFile, readFile } from 'node:fs/promises'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const TARGET = process.env.TARGET ?? new URL('./torn.json', import.meta.url).pathname
const ROLE = process.argv[2]

function entry(variant) {
  const body = Buffer.from(JSON.stringify({
    result: Array.from({ length: 4000 }, (_, i) => ({ i, text: 'x'.repeat(200) })),
  })).toString('base64')
  return JSON.stringify({
    kind: 'FETCH',
    data: {
      headers: {
        age: variant === 'a' ? '46' : '1234567',
        'server-timing': variant === 'a' ? 'api;dur=111' : 'api;dur=9',
      },
      body, status: 200, url: 'https://example.test/q',
    },
    revalidate: 60, tags: [],
  })
}

if (ROLE === 'writer') {
  const payload = entry(process.argv[3])
  for (let i = 0; i < 250; i++) await writeFile(TARGET, payload)
  process.exit(0)
}

const kids = ['a', 'b', 'a', 'b'].map((v) =>
  fork(fileURLToPath(import.meta.url), ['writer', v], { env: { ...process.env, TARGET } }))
let outerBroken = 0, innerGarbage = 0, ok = 0
const messages = new Set()
let running = true
Promise.all(kids.map((k) => new Promise((r) => k.on('exit', r)))).then(() => { running = false })

while (running) {
  let raw
  try { raw = await readFile(TARGET, 'utf8') } catch { continue }
  let parsed
  try { parsed = JSON.parse(raw) } catch { outerBroken++; continue }
  try { JSON.parse(Buffer.from(parsed.data.body, 'base64').toString('utf8')); ok++ }
  catch (e) { innerGarbage++; messages.add(e.message.replace(/\d+/g, 'N')) }
}
console.log({ ok, outerBroken, innerGarbage, messages: [...messages] })
