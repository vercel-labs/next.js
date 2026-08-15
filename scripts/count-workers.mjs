// Counts live Turbopack Node pool workers (`node .next/dev/build/<hash>.js <port>`)
// and total node processes. Works on Windows (PowerShell CIM) and POSIX (ps).
import { execSync } from 'node:child_process'

function sample() {
  if (process.platform === 'win32') {
    const ps = `$all = @(Get-CimInstance Win32_Process -Filter "Name='node.exe'"); $pool = @($all | Where-Object { $_.CommandLine -like '*dev\\build*' }); $mem = [math]::Round((($all | Measure-Object -Property WorkingSetSize -Sum).Sum)/1GB, 2); "$($pool.Count) $($all.Count) $mem"`
    const out = execSync(`powershell -NoProfile -Command "${ps.replace(/"/g, '\\"')}"`).toString().trim()
    const [pool, total, mem] = out.split(/\s+/)
    return { pool: +pool, total: +total, rssGb: +mem }
  }
  const lines = execSync('ps -eo rss,args').toString().split('\n')
  const nodeLines = lines.filter((l) => / node\b|\/node\b/.test(l))
  const pool = nodeLines.filter((l) => /[\\/]dev[\\/]build[\\/].*\.js \d+\s*$/.test(l))
  const rss = nodeLines.reduce((a, l) => a + Number(l.trim().split(/\s+/)[0] || 0), 0)
  return { pool: pool.length, total: nodeLines.length, rssGb: +(rss / 1024 / 1024).toFixed(2) }
}

const iterations = Number(process.argv[2] ?? 30)
const intervalMs = Number(process.argv[3] ?? 2000)
const abortAt = Number(process.env.ABORT_AT_POOL_WORKERS ?? 250)
let max = 0
for (let i = 0; i < iterations; i++) {
  const s = sample()
  max = Math.max(max, s.pool)
  console.log(
    `${new Date().toISOString()} iter=${i} poolWorkers=${s.pool} nodeProcesses=${s.total} nodeRssGB=${s.rssGb}`
  )
  if (s.pool > abortAt) {
    console.log(`ABORT: pool worker count ${s.pool} exceeded ${abortAt} -> runaway spawn reproduced`)
    process.exit(2)
  }
  await new Promise((r) => setTimeout(r, intervalMs))
}
console.log(`max pool workers observed: ${max}`)
