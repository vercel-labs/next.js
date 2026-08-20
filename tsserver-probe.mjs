import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const proj = process.argv[2] || process.cwd()
const file = path.join(proj, 'src/app/page.tsx')
const tsserver = path.join(proj, 'node_modules/typescript/lib/tsserver.js')

const p = spawn(process.execPath, [tsserver, '--disableAutomaticTypingAcquisition','--allowLocalPluginLoads','--pluginProbeLocations',proj], { cwd: proj, stdio: ['pipe','pipe','inherit'] })
let seq = 1
const pending = new Map()
const events = []
let buf = ''
p.stdout.on('data', d => {
  buf += d.toString()
  let i
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim()
    buf = buf.slice(i + 1)
    if (!line.startsWith('{')) continue
    let msg
    try { msg = JSON.parse(line) } catch { continue }
    if (msg.type === 'response' && pending.has(msg.request_seq)) { pending.get(msg.request_seq)(msg); pending.delete(msg.request_seq) }
    else events.push(msg)
  }
})
function send(command, args, wait = true) {
  const s = seq++
  const req = { seq: s, type: 'request', command, arguments: args }
  p.stdin.write(JSON.stringify(req) + '\n')
  if (!wait) return Promise.resolve()
  return new Promise(res => pending.set(s, res))
}
const sleep = ms => new Promise(r => setTimeout(r, ms))
const content = fs.readFileSync(file, 'utf8')

await send('configure', { hostInfo: 'vscode-probe' }, false)
await send('open', { file, fileContent: content, scriptKindName: 'TSX', projectRootPath: proj }, false)
await sleep(3000)
let d = await send('semanticDiagnosticsSync', { file })
console.log('--- diagnostics after open:', JSON.stringify(d.body?.map(x => x.code + ': ' + x.text)))

// simulate an edit in the file (typing a newline then removing it), like the reporter "change something of this file"
for (let round = 1; round <= 5; round++) {
  await send('change', { file, line: 3, offset: 1, endLine: 3, endOffset: 1, insertString: 'const x' + round + ' = 1\n' }, false)
  await send('updateOpen', { changedFiles: [] }, false)
  await sleep(1500)
  d = await send('semanticDiagnosticsSync', { file })
  console.log(`--- diagnostics after edit ${round}:`, JSON.stringify(d.body?.map(x => x.code + ': ' + x.text)))
}
p.kill()
