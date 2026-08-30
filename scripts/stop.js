// kill previously started repro servers (next start on :3001, cdn on :3100)
const fs = require('fs')
const me = process.pid
for (const d of fs.readdirSync('/proc')) {
  if (!/^\d+$/.test(d) || Number(d) === me) continue
  let cmd = ''
  try {
    cmd = fs.readFileSync(`/proc/${d}/cmdline`, 'utf8').replace(/\0/g, ' ')
  } catch {
    continue
  }
  if (/^(bash|sh|\/bin\/sh|\/bin\/bash|python3?)\b/.test(cmd)) continue
  if (
    /scripts\/cdn\.js/.test(cmd) ||
    /next\/dist\/bin\/next start/.test(cmd) ||
    /next-server/.test(cmd) ||
    /scripts\/serve-b\.sh/.test(cmd)
  ) {
    try {
      process.kill(Number(d))
      console.log('killed', d, cmd.slice(0, 80))
    } catch {}
  }
}
