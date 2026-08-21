// Drives tsserver with the Next.js TypeScript plugin enabled (same as the IDE
// plugin) and prints the semantic diagnostics for the given files.
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const files = (process.argv.slice(2).length ? process.argv.slice(2) : ['app/page.tsx', 'app/annotated/page.tsx']).map(
  (f) => path.join(root, f)
)

const tsserver = spawn(
  process.execPath,
  [
    path.join(root, 'node_modules/typescript/lib/tsserver.js'),
    '--disableAutomaticTypingAcquisition',
    '--allowLocalPluginLoads',
    '--globalPlugins', 'next',
    '--pluginProbeLocations', root,
  ],
  { stdio: ['pipe', 'pipe', 'inherit'] }
)

let seq = 0
const send = (command, args) =>
  tsserver.stdin.write(JSON.stringify({ seq: ++seq, type: 'request', command, arguments: args }) + '\n')

let buf = ''
const found = new Map()
tsserver.stdout.on('data', (chunk) => {
  buf += chunk
  const lines = buf.split('\n')
  buf = lines.pop()
  for (const line of lines) {
    if (!line.startsWith('{')) continue
    const msg = JSON.parse(line)
    if (msg.type === 'event' && msg.event === 'semanticDiag') {
      found.set(msg.body.file, msg.body.diagnostics)
    }
  }
})

for (const file of files) send('open', { file })
send('geterr', { files, delay: 0 })

setTimeout(() => {
  for (const file of files) {
    const diags = found.get(file) || []
    console.log(`\n=== ${path.relative(root, file)} ===`)
    if (!diags.length) console.log('  (no diagnostics)')
    for (const d of diags) {
      console.log(`  [${d.category}] ${d.code} line ${d.start.line}: ${d.text}`)
    }
  }
  tsserver.kill()
  process.exit(0)
}, 15000)
