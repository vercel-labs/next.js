// next#88463 - after a /_next/image request is aborted, every later request for
// the same image URL stays pending forever.
//
// Usage: node scripts/repro.mjs            (starts `next dev`)
//        MODE=start node scripts/repro.mjs (runs `next build` + `next start`)
import http from 'node:http'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const MODE = process.env.MODE || 'dev'
const PORT = Number(process.env.PORT || 3100)
const W = Number(process.env.W || 4090)
const ABORT_AFTER = Number(process.env.ABORT_AFTER || 5)
const TIMEOUT = Number(process.env.TIMEOUT || 15000)
const base = `http://localhost:${PORT}`
const logFile = process.env.SERVER_LOG || 'next-server.log'

fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true })

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
    p.on('exit', (c) => (c === 0 ? resolve() : reject(new Error(`${cmd} ${args} exited ${c}`))))
  })
}

if (MODE === 'start') await run('npx', ['next', 'build'])

const out = fs.createWriteStream(logFile)
const server = spawn('npx', ['next', MODE === 'start' ? 'start' : 'dev', '-p', String(PORT)], {
  shell: process.platform === 'win32',
})
server.stdout.pipe(out)
server.stderr.pipe(out)

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    const ok = await new Promise((r) => {
      const req = http.get(base + '/', (res) => {
        res.resume()
        r(true)
      })
      req.on('error', () => r(false))
      req.setTimeout(2000, () => req.destroy())
    })
    if (ok) return
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('server never became ready, see ' + logFile)
}

function get(name, { abortAfter = null, timeout = TIMEOUT } = {}) {
  const t0 = Date.now()
  const url = `${base}/_next/image?url=%2F${name}.jpg&w=${W}&q=75`
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let bytes = 0
      res.on('data', (c) => (bytes += c.length))
      res.on('end', () => resolve({ name, status: res.statusCode, bytes, ms: Date.now() - t0 }))
    })
    req.on('error', (e) => resolve({ name, error: e.code || e.message, ms: Date.now() - t0 }))
    if (abortAfter !== null) setTimeout(() => req.destroy(new Error('client abort')), abortAfter)
    req.setTimeout(timeout, () =>
      req.destroy(Object.assign(new Error('timeout'), { code: 'PENDING_FOREVER' }))
    )
  })
}

let reproduced = false
try {
  await waitForServer()
  console.log(`server ready (${MODE}) on ${base}, server output -> ${logFile}\n`)

  const delays = process.env.ABORT_AFTER ? [ABORT_AFTER] : [1, 3, 5, 8, 15, 30]
  for (const [attempt, delay] of delays.entries()) {
    const target = `img-${attempt * 2}`
    const control = `img-${attempt * 2 + 1}`
    console.log(`attempt ${attempt + 1}: /_next/image?url=/${target}.jpg&w=${W}&q=75`)
    console.log('  1) request it, then abort the client after %dms ->', delay, await get(target, { abortAfter: delay }))
    const retry = await get(target)
    console.log('  2) request the SAME url again (expected: 200) ->', retry)
    console.log('  3) control, a different url (expected: 200)   ->', await get(control))
    if (retry.error === 'PENDING_FOREVER') {
      reproduced = true
      console.log(
        `\nREPRODUCED: after the abort, /${target}.jpg never responds (${TIMEOUT}ms client timeout), while another image URL still works. The URL stays stuck until the server restarts.`
      )
      const again = await get(target, { timeout: 5000 })
      console.log('  4) same url once more ->', again)
      break
    }
    console.log('  attempt did not hang, trying again\n')
  }
  if (!reproduced) console.log('\nnot reproduced; re-run (race window) or try another ABORT_AFTER value')
} finally {
  server.kill('SIGKILL')
}
process.exit(reproduced ? 1 : 0)
