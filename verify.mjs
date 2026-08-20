// Verifies whether a `debugger;` statement inside a next/jest test pauses the
// Node inspector. Runs the reporter's command (--watch) and the same command
// without --watch, driving the inspector over CDP instead of Chrome DevTools.
//
// Usage: npm run verify
import { spawn } from 'node:child_process'
import http from 'node:http'
import fs from 'node:fs'
import WebSocket from 'ws'

const LOG_DIR = 'logs'
fs.mkdirSync(LOG_DIR, { recursive: true })

function listTargets(port) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: '/json/list' }, (res) => {
        let d = ''
        res.on('data', (c) => (d += c))
        res.on('end', () => {
          try {
            resolve(JSON.parse(d))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

async function drive(port, timeoutMs) {
  let targets = []
  for (let i = 0; i < 60; i++) {
    try {
      targets = await listTargets(port)
      if (targets.length) break
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  if (!targets.length) throw new Error('no inspector target on port ' + port)

  const ws = new WebSocket(targets[0].webSocketDebuggerUrl, { maxPayload: 1e9 })
  const pending = new Map()
  let id = 0
  const send = (method, params = {}) =>
    new Promise((res) => {
      const myId = ++id
      pending.set(myId, res)
      ws.send(JSON.stringify({ id: myId, method, params }))
    })

  return await new Promise((resolve) => {
    let pauses = 0
    const timer = setTimeout(() => {
      ws.close()
      resolve({ hit: false, pauses })
    }, timeoutMs)

    ws.on('open', async () => {
      await send('Debugger.enable')
      await send('Runtime.enable')
      await send('Runtime.runIfWaitingForDebugger')
    })
    ws.on('message', async (raw) => {
      const msg = JSON.parse(raw.toString())
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result)
        pending.delete(msg.id)
        return
      }
      if (msg.method === 'Debugger.paused') {
        pauses++
        const f = msg.params.callFrames[0]
        const where = `${f.url}:${f.location.lineNumber + 1}:${f.location.columnNumber}`
        console.log(`  PAUSE #${pauses} reason=${msg.params.reason} at ${where}`)
        if (pauses === 1) {
          await send('Debugger.resume') // step past --inspect-brk break-on-start
        } else {
          clearTimeout(timer)
          ws.close()
          resolve({ hit: true, pauses, where })
        }
      }
    })
  })
}

async function scenario(label, args, port, timeoutMs) {
  console.log(`\n=== ${label}\n  node --inspect-brk=${port} ./node_modules/.bin/jest ${args.join(' ')}`)
  const logPath = `${LOG_DIR}/${label.replace(/\W+/g, '-')}.log`
  const log = fs.createWriteStream(logPath)
  const child = spawn(
    process.execPath,
    [`--inspect-brk=${port}`, './node_modules/.bin/jest', ...args],
    { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CI: '' } }
  )
  let out = ''
  child.stdout.on('data', (c) => ((out += c), log.write(c)))
  child.stderr.on('data', (c) => ((out += c), log.write(c)))

  const result = await drive(port, timeoutMs)
  child.kill('SIGKILL')
  const pid = out.match(/TEST_PID .*/)?.[0]
  if (pid) console.log('  ' + pid.trim())
  console.log(`  => debugger statement ${result.hit ? 'PAUSED' : 'IGNORED'} (log: ${logPath})`)
  return result
}

const watch = await scenario("reporter's command (--watch)", ['./app', '--watch', '--no-cache', '--runInBand'], 9229, 30000)
const noWatch = await scenario('same command without --watch', ['./app', '--no-cache', '--runInBand'], 9230, 30000)
const plain = await scenario('control: plain jest, no next/jest (--watch)', ['-c', 'jest.plain.config.js', '--watchAll', '--no-cache', '--runInBand'], 9231, 30000)

console.log('\n--- RESULT ---')
console.log(`--watch  --runInBand : debugger ${watch.hit ? 'paused' : 'IGNORED'}`)
console.log(`no watch --runInBand : debugger ${noWatch.hit ? 'paused' : 'IGNORED'}`)
console.log(`plain jest --watchAll : debugger ${plain.hit ? 'paused' : 'IGNORED'} (no next/jest involved)`)
process.exit(!watch.hit && noWatch.hit ? 0 : 1)
