import fs from 'node:fs'
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json()
const target = list.find(t => t.webSocketDebuggerUrl)
console.log('attaching to', target.title)
const ws = new WebSocket(target.webSocketDebuggerUrl)
let id = 0
const missing = new Set(), ok = new Set()
ws.onopen = () => { ws.send(JSON.stringify({ id: ++id, method: 'Debugger.enable' })) }
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.method === 'Debugger.scriptParsed') {
    const { url, sourceMapURL } = msg.params
    if (!sourceMapURL || sourceMapURL.startsWith('data:') || !url.startsWith('file://')) return
    const dir = new URL('.', url)
    const mapPath = new URL(sourceMapURL, dir)
    if (!fs.existsSync(mapPath)) missing.add(`${url} -> ${sourceMapURL}`); else ok.add(url)
  }
}
setTimeout(async () => {
  try { await fetch('http://localhost:3003/'); await fetch('http://localhost:3003/og') } catch (e) { console.log('fetch err', e.message) }
  setTimeout(() => {
    console.log('scripts with resolvable maps:', ok.size)
    console.log('scripts with MISSING maps:', missing.size)
    for (const m of missing) console.log('MISSING SOURCE MAP:', m)
    process.exit(0)
  }, 15000)
}, 2000)
