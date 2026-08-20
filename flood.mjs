import http from 'node:http'
const N = Number(process.argv[2] || 300)
const agent = new http.Agent({ maxSockets: N + 50, keepAlive: false })
let open = 0
for (let i = 0; i < N; i++) {
  const req = http.get({ host: '127.0.0.1', port: 3000, path: '/api/thumbnail?f=' + i, agent })
  req.on('response', (res) => { open++; res.resume(); res.on('end', () => console.log('ended', i)) })
  req.on('error', () => {})
}
setInterval(async () => {
  const t0 = Date.now()
  try {
    const r = await fetch('http://127.0.0.1:3000/?probe=' + Date.now(), { signal: AbortSignal.timeout(10000) })
    await r.arrayBuffer()
    console.log(`open=${open} GET / -> ${r.status} in ${Date.now() - t0}ms`)
  } catch (e) {
    console.log(`open=${open} GET / -> FAILED after ${Date.now() - t0}ms: ${e.name} ${e.message}`)
  }
}, 3000)
setTimeout(() => process.exit(0), 45000)
