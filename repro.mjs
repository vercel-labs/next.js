/**
 * Headless reproduction for https://github.com/vercel/next.js/issues/79424
 *
 * Instead of clicking around in VSCode/Cursor, this script drives Microsoft's
 * real `vscode-js-debug` adapter (the exact debugger VSCode and Cursor use) over
 * DAP:
 *   1. starts `next dev` (turbopack by default, `BUNDLER=webpack` for webpack),
 *   2. attaches js-debug to the dev server inspector port,
 *   3. sets ONE breakpoint on src/app/page.tsx line 2 (the console.log),
 *   4. loads http://localhost:3000, edits the file (reporter step 5), loads again,
 *   5. prints every `stopped` event with its stack, as VSCode would show it.
 *
 * Everything is written to ./repro-logs/.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import os from 'node:os'

const ROOT = process.cwd()
const LOGS = path.join(ROOT, 'repro-logs')
fs.mkdirSync(LOGS, { recursive: true })
const BUNDLER = process.env.BUNDLER === 'webpack' ? 'webpack' : 'turbopack'
const APP_PORT = Number(process.env.APP_PORT ?? 3000)
const INSPECT_PORT = 9230
const DAP_PORT = Number(process.env.DAP_PORT ?? 4711)
const FILE = path.join(ROOT, 'src/app/page.tsx')
const BP_LINE = 2
const JS_DEBUG_VERSION = '1.117.0'
const JS_DEBUG_DIR = path.join(ROOT, '.js-debug')
const log = (...a) => process.stdout.write(`[repro:${BUNDLER}] ` + a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ') + '\n')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ---------- 0. vendored vscode-js-debug DAP server ---------- */
async function ensureJsDebug() {
  const entry = path.join(JS_DEBUG_DIR, 'js-debug/src/dapDebugServer.js')
  if (fs.existsSync(entry)) return entry
  log('downloading vscode-js-debug', JS_DEBUG_VERSION)
  fs.mkdirSync(JS_DEBUG_DIR, { recursive: true })
  const url = `https://github.com/microsoft/vscode-js-debug/releases/download/v${JS_DEBUG_VERSION}/js-debug-dap-v${JS_DEBUG_VERSION}.tar.gz`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error('download failed ' + res.status)
  const tgz = path.join(os.tmpdir(), 'js-debug.tgz')
  fs.writeFileSync(tgz, Buffer.from(await res.arrayBuffer()))
  await new Promise((r, j) => {
    const p = spawn('tar', ['xzf', tgz, '-C', JS_DEBUG_DIR], { stdio: 'inherit' })
    p.on('exit', (c) => (c === 0 ? r() : j(new Error('tar exit ' + c))))
  })
  return entry
}

/* ---------- 1. next dev ---------- */
const devLog = fs.createWriteStream(path.join(LOGS, `next-dev-${BUNDLER}.log`))
const dev = spawn('node_modules/.bin/next', ['dev', `--${BUNDLER}`, '-p', String(APP_PORT)], {
  env: { ...process.env, NODE_OPTIONS: `--inspect=${INSPECT_PORT}` },
  cwd: ROOT,
})
let devOut = ''
let serverInspectPort = null
for (const s of [dev.stdout, dev.stderr]) {
  s.on('data', (d) => {
    devOut += d
    devLog.write(d)
    const m = /Debugger listening on ws:\/\/127\.0\.0\.1:(\d+)/.exec(String(d))
    if (m && Number(m[1]) !== INSPECT_PORT) serverInspectPort = Number(m[1])
  })
}
const t0 = Date.now()
while (!/Ready in/.test(devOut) && Date.now() - t0 < 120000) await sleep(500)
await sleep(1500)
log('next dev ready; server inspector port =', String(serverInspectPort ?? INSPECT_PORT))

/* ---------- 2. js-debug DAP server ---------- */
const dapEntry = await ensureJsDebug()
const dapLog = fs.createWriteStream(path.join(LOGS, `js-debug-${BUNDLER}.log`))
const dapServer = spawn(process.execPath, [dapEntry, String(DAP_PORT)], { cwd: ROOT })
dapServer.stdout.pipe(dapLog)
dapServer.stderr.pipe(dapLog)
await sleep(1500)

/* ---------- 3. DAP client (what VSCode/Cursor is) ---------- */
const stops = []
const bpReports = []
const sessions = []
class Session {
  constructor(name) {
    this.name = name
    this.seq = 0
    this.pending = new Map()
    this.buf = Buffer.alloc(0)
  }
  async connect() {
    this.sock = net.connect(DAP_PORT, '127.0.0.1')
    await new Promise((r, j) => (this.sock.once('connect', r), this.sock.once('error', j)))
    this.sock.on('data', (d) => this.onData(d))
    return this
  }
  send(o) {
    const b = JSON.stringify(o)
    this.sock.write(`Content-Length: ${Buffer.byteLength(b)}\r\n\r\n${b}`)
  }
  req(command, args) {
    const s = ++this.seq
    this.send({ seq: s, type: 'request', command, arguments: args ?? {} })
    return new Promise((res) => this.pending.set(s, res))
  }
  onData(d) {
    this.buf = Buffer.concat([this.buf, d])
    for (;;) {
      const i = this.buf.indexOf('\r\n\r\n')
      if (i < 0) return
      const len = Number(/Content-Length: (\d+)/i.exec(this.buf.slice(0, i).toString())[1])
      if (this.buf.length < i + 4 + len) return
      const msg = JSON.parse(this.buf.slice(i + 4, i + 4 + len).toString())
      this.buf = this.buf.slice(i + 4 + len)
      this.handle(msg)
    }
  }
  handle(msg) {
    if (msg.type === 'response' && this.pending.has(msg.request_seq)) {
      const p = this.pending.get(msg.request_seq)
      this.pending.delete(msg.request_seq)
      return p(msg)
    }
    if (msg.type === 'request') {
      this.send({ seq: ++this.seq, type: 'response', request_seq: msg.seq, command: msg.command, success: true, body: {} })
      if (msg.command === 'startDebugging') startSession(msg.arguments.configuration).catch((e) => log('child error', e.message))
      return
    }
    if (msg.event === 'stopped') this.onStopped(msg.body)
    if (msg.event === 'breakpoint') log(`${this.name} breakpoint event ->`, JSON.stringify(msg.body.breakpoint))
    if (msg.event === 'output' && /could not read source map/i.test(msg.body?.output ?? ''))
      log(`${this.name} js-debug:`, msg.body.output.trim().slice(0, 220))
  }
  async onStopped(body) {
    const st = await this.req('stackTrace', { threadId: body.threadId, startFrame: 0, levels: 6 })
    const frames = (st.body?.stackFrames ?? []).map((f) => `${f.name || '(anon)'} @ ${f.source?.path || f.source?.name || '?'}:${f.line}:${f.column}`)
    stops.push({ reason: body.reason, frames })
    log(`STOPPED reason=${body.reason}\n   ` + frames.join('\n   '))
    await this.req('continue', { threadId: body.threadId })
  }
}
async function startSession(extra = {}) {
  const s = new Session(extra.__pendingTargetId ? `child(${extra.__pendingTargetId})` : 'root')
  sessions.push(s)
  await s.connect()
  await s.req('initialize', { clientID: 'repro', adapterID: 'pwa-node', linesStartAt1: true, columnsStartAt1: true, pathFormat: 'path', supportsStartDebuggingRequest: true })
  const attach = s.req('attach', {
    type: 'pwa-node',
    request: 'attach',
    name: 'Next.js: debug server-side',
    port: serverInspectPort ?? INSPECT_PORT,
    address: '127.0.0.1',
    cwd: ROOT,
    __workspaceFolder: ROOT,
    sourceMaps: true,
    skipFiles: ['<node_internals>/**'],
    autoAttachChildProcesses: true,
    ...extra,
  })
  const bp = await s.req('setBreakpoints', { source: { path: FILE, name: 'page.tsx' }, breakpoints: [{ line: BP_LINE }], lines: [BP_LINE] })
  bpReports.push({ session: s.name, breakpoints: bp.body?.breakpoints })
  log(`${s.name} setBreakpoints(page.tsx:${BP_LINE}) ->`, JSON.stringify(bp.body?.breakpoints))
  await s.req('configurationDone', {})
  const res = await attach
  log(`${s.name} attach -> success=${res.success}`)
  return s
}

await startSession()
await sleep(2500)

async function hit(n) {
  const before = stops.length
  const res = await fetch(`http://127.0.0.1:${APP_PORT}/`, { headers: { 'cache-control': 'no-cache' } }).catch((e) => ({ status: 'ERR ' + e.message }))
  await sleep(3500)
  log(`page load ${n} -> HTTP ${res.status}; pauses during this load: ${stops.length - before}`)
}
await hit(1)
const src = fs.readFileSync(FILE, 'utf8')
fs.writeFileSync(FILE, src.replace(/Add breakpoint in this line[^`]*/, `Add breakpoint in this line ${Date.now()} `))
log('edited src/app/page.tsx (reporter step 5)')
await sleep(5000)
await hit(2)
await hit(3)
fs.writeFileSync(FILE, src)

log('----- summary -----')
log('breakpoint verification per session:', JSON.stringify(bpReports))
log('total pauses for a single breakpoint over 3 page loads:', String(stops.length))
const lines = {}
for (const s of stops) {
  const k = s.frames[0]
  lines[k] = (lines[k] ?? 0) + 1
}
log('pause locations:', JSON.stringify(lines, null, 2))
fs.writeFileSync(path.join(LOGS, `dap-${BUNDLER}.json`), JSON.stringify({ bundler: BUNDLER, bpReports, stops }, null, 2))
log(`wrote ${path.relative(ROOT, path.join(LOGS, `dap-${BUNDLER}.json`))}`)
dev.kill('SIGKILL')
dapServer.kill('SIGKILL')
process.exit(0)
