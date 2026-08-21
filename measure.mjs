// Measures total RSS of the `next dev` process tree during startup + first request.
import { spawn, execSync } from 'node:child_process'
import fs from 'node:fs'

const args = process.argv.slice(2)
const log = fs.createWriteStream(process.env.LOG || '/tmp/next-dev.log')
const child = spawn('node', ['node_modules/next/dist/bin/next', 'dev', ...args], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
child.stdout.pipe(log); child.stderr.pipe(log)
child.stdout.pipe(process.stdout); child.stderr.pipe(process.stderr)

function tree(pid, acc = []) {
  acc.push(pid)
  let kids = ''
  try { kids = execSync(`pgrep -P ${pid} || true`).toString().trim() } catch {}
  for (const k of kids.split('\n').filter(Boolean)) tree(Number(k), acc)
  return acc
}
function rssMB() {
  const pids = tree(child.pid)
  let total = 0
  const per = []
  for (const p of pids) {
    try {
      const kb = Number(execSync(`ps -o rss= -p ${p}`).toString().trim())
      const cmd = execSync(`ps -o args= -p ${p}`).toString().trim().slice(0, 70)
      total += kb; per.push(`${p} ${(kb / 1024).toFixed(0)}MB ${cmd}`)
    } catch {}
  }
  return { total: total / 1024, per }
}

const t0 = Date.now()
let peak = 0
const iv = setInterval(() => {
  const { total } = rssMB()
  if (total > peak) peak = total
}, 500)

await new Promise((r) => setTimeout(r, 12000))
await fetch('http://localhost:3000/').then((r) => r.text())
const afterFirstRequest = rssMB()
await new Promise((r) => setTimeout(r, 5000))
const settled = rssMB()
clearInterval(iv)
console.log('\n=== memory report (' + (args.join(' ') || 'turbopack default') + ') ===')
console.log('elapsed s:', ((Date.now() - t0) / 1000).toFixed(0))
console.log('after first request total RSS MB:', afterFirstRequest.total.toFixed(0))
console.log('settled total RSS MB:', settled.total.toFixed(0))
console.log('peak total RSS MB:', peak.toFixed(0))
console.log(settled.per.join('\n'))
child.kill('SIGKILL')
process.exit(0)
