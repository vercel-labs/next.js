// Drives tsserver with the Next.js TypeScript plugin enabled and prints
// semantic diagnostics for app/actions.ts.
import { spawn } from 'node:child_process'
import path from 'node:path'

const file = path.resolve('app/actions.ts')
const tsserver = path.resolve('node_modules/typescript/lib/tsserver.js')
const proc = spawn(process.execPath, [tsserver, '--disableAutomaticTypingAcquisition'], { stdio: ['pipe','pipe','inherit'] })

let seq = 0
const send = (command, args) => proc.stdin.write(JSON.stringify({ seq: ++seq, type: 'request', command, arguments: args }) + '\n')

let buf = ''
proc.stdout.on('data', (d) => {
  buf += d.toString()
  const lines = buf.split('\n')
  buf = lines.pop()
  for (const line of lines) {
    if (!line.startsWith('{')) continue
    const msg = JSON.parse(line)
    if (msg.command === 'semanticDiagnosticsSync') {
      const diags = msg.body || []
      console.log(`semantic diagnostics for app/actions.ts: ${diags.length}`)
      for (const d of diags) console.log(`  line ${d.start.line}: TS${d.code} ${d.text}`)
      proc.kill()
      process.exit(0)
    }
  }
})

send('configure', { preferences: {} })
send('open', { file })
setTimeout(() => send('semanticDiagnosticsSync', { file, includeLinePosition: false }), 4000)
