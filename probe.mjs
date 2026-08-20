// Reproduces vercel/next.js#66526.
//
// In `next dev` (webpack) the dev server can respond to
// /_next/static/chunks/app/layout.js with a body that is TRUNCATED relative to
// the Content-Length it advertised, because the file is still being written by
// webpack while it is served. A browser then reports
//   Uncaught SyntaxError: Invalid or unexpected token
//   Uncaught ChunkLoadError: Loading chunk app/layout failed
// and a reload "fixes" it (the file is complete by then).
//
// This script cold-starts `next dev`, requests "/" once (which is what makes
// the app compile) and then requests the layout chunk a few times in a row,
// printing what the dev server actually returned.
import { spawn } from 'node:child_process'
import { rmSync, readFileSync } from 'node:fs'
import vm from 'node:vm'

const port = process.env.PORT || '3000'
const major = Number(JSON.parse(readFileSync('node_modules/next/package.json')).version.split('.')[0])
const args = ['node_modules/next/dist/bin/next', 'dev', ...(major >= 16 ? ["--webpack"] : []), '-p', port]
rmSync('.next', { recursive: true, force: true })
const dev = spawn('node', args, { stdio: ['ignore', 'pipe', 'pipe'] })
let log = ''
const onData = d => { log += d; process.stdout.write(d) }
dev.stdout.on('data', onData); dev.stderr.on('data', onData)
for (let i = 0; i < 240 && !/Ready in/.test(log); i++) await new Promise(r => setTimeout(r, 250))
await new Promise(r => setTimeout(r, 500))

const chunk = `http://localhost:${port}/_next/static/chunks/app/layout.js`
const page = await fetch(`http://localhost:${port}/`, { redirect: 'manual' })
console.log(`\n[probe] GET / -> ${page.status}`)
await page.text().catch(() => {})

let bad = 0
for (let n = 1; n <= 5; n++) {
  const res = await fetch(chunk)
  const body = await res.text()
  const cl = res.headers.get('content-length')
  let syntaxError = null
  if (res.status === 200) { try { new vm.Script(body) } catch (e) { syntaxError = e.message } }
  const size = Buffer.byteLength(body)
  const incomplete = res.status !== 200 || syntaxError || size === 0 || (cl && Number(cl) !== size)
  if (incomplete) bad++
  console.log(`[probe] req#${n} status=${res.status} content-length=${cl} received=${size} SyntaxError=${JSON.stringify(syntaxError)}${incomplete ? '  <-- BROKEN CHUNK' : ''}`)
}
dev.kill('SIGKILL')
console.log(bad ? `\n[probe] REPRODUCED: ${bad}/5 responses for app/layout.js were not a complete JS chunk` : '\n[probe] not reproduced')
process.exit(bad ? 1 : 0)
