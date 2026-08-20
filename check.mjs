// Headless driver: starts tsserver with the Next.js TypeScript plugin enabled
// (tsconfig.json -> compilerOptions.plugins: [{ "name": "next" }]) and prints
// the semantic diagnostics an editor would show for the repro files.
import { spawn } from 'node:child_process'
import path from 'node:path'

const projectRoot = process.cwd()
const tsserver = path.join(projectRoot, 'node_modules/typescript/lib/tsserver.js')
const files = ['app/components.tsx', 'app/inline-default.tsx'].map((f) =>
  path.join(projectRoot, f)
)

const proc = spawn(process.execPath, [tsserver, '--disableAutomaticTypingAcquisition'], {
  cwd: projectRoot,
  stdio: ['pipe', 'pipe', 'inherit'],
})

let seq = 0
const send = (command, args) => {
  proc.stdin.write(
    JSON.stringify({ seq: ++seq, type: 'request', command, arguments: args }) + '\n'
  )
  return seq
}

const pending = new Map() // request seq -> file
const results = new Map() // file -> diagnostics
let buf = ''
proc.stdout.on('data', (chunk) => {
  buf += chunk.toString()
  const lines = buf.split('\n')
  buf = lines.pop()
  for (const line of lines) {
    if (!line.startsWith('{')) continue
    const msg = JSON.parse(line)
    if (msg.command !== 'semanticDiagnosticsSync') continue
    const file = pending.get(msg.request_seq)
    if (!file) continue
    results.set(file, msg.body || [])
    if (results.size === files.length) report()
  }
})

function report() {
  for (const f of files) {
    const diags = results.get(f) || []
    console.log(`\n--- ${path.relative(projectRoot, f)} ---`)
    if (!diags.length) console.log('  (no diagnostics)')
    for (const d of diags) {
      console.log(`  line ${d.start.line}: TS${d.code} [${d.category}] ${d.text}`)
    }
  }
  const byName = (name) =>
    (results.get(files.find((f) => f.endsWith(name))) || []).filter((d) => d.code === 71007)
  const componentDiags = byName('components.tsx')
  const inlineDiags = byName('inline-default.tsx')
  console.log(
    `\napp/components.tsx TS71007 warnings: ${componentDiags.length} (expected 3)` +
      `\napp/inline-default.tsx TS71007 warnings: ${inlineDiags.length} (expected 1)`
  )
  console.log(
    componentDiags.length === 3
      ? 'RESULT: all three export styles warn (fixed)'
      : `RESULT: BUG REPRODUCED - only ${componentDiags.length}/3 export styles warn; ` +
          '`export default <identifier>` (ExportAssignment) is skipped by the plugin'
  )
  proc.kill()
  process.exit(0)
}

send('configure', { hostInfo: 'repro' })
for (const file of files) send('open', { file })
setTimeout(() => {
  for (const file of files) {
    pending.set(send('semanticDiagnosticsSync', { file, includeLinePosition: false }), file)
  }
}, 5000)
setTimeout(() => {
  console.error('timed out waiting for diagnostics')
  proc.kill()
  process.exit(1)
}, 60000)
