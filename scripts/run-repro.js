// One-shot reproduction for https://github.com/vercel/next.js/issues/62201
//
// Starts the upstream streaming server (stand-in for the reporter's FastAPI
// StreamingResponse endpoint) plus `next dev` twice: once with the default
// `compress: true`, once with `compress: false`, and probes both with
// `Accept-Encoding: gzip` (what every browser sends).
const { spawn } = require('child_process')
const http = require('http')
const zlib = require('zlib')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const children = []

function start(cmd, args, env, name) {
  const c = spawn(cmd, args, { env: { ...process.env, ...env }, stdio: 'inherit' })
  children.push(c)
  console.log(`[repro] started ${name}`)
  return c
}

async function waitFor(port) {
  for (let i = 0; i < 120; i++) {
    const ok = await new Promise((res) => {
      const req = http.request({ host: '127.0.0.1', port, path: '/' }, () => res(true))
      req.on('error', () => res(false))
      req.end()
    })
    if (ok) return
    await sleep(500)
  }
  throw new Error(`port ${port} never came up`)
}

function probe(port) {
  const start = Date.now()
  return new Promise((resolve) => {
    http
      .request(
        {
          host: '127.0.0.1',
          port,
          path: '/api/basicStream',
          method: 'GET',
          headers: { 'Accept-Encoding': 'gzip' },
        },
        (res) => {
          const enc = res.headers['content-encoding'] || 'none'
          console.log(`  content-encoding=${enc}`)
          let wire = 0
          let decoded = 0
          res.on('data', (b) => console.log(`  wire chunk ${++wire} @ ${Date.now() - start}ms (${b.length}B)`))
          const s = enc === 'gzip' ? res.pipe(zlib.createGunzip()) : res
          s.on('data', () => decoded++)
          s.on('end', () => {
            console.log(`  done @ ${Date.now() - start}ms wire_chunks=${wire} decoded_chunks=${decoded}`)
            resolve({ wire, decoded })
          })
        }
      )
      .end()
  })
}

;(async () => {
  start('node', ['scripts/upstream-server.js'], {}, 'upstream :8000')
  await waitFor(8000)

  console.log('\n[repro] upstream directly (:8000) -- 10 chunks expected')
  await probe(8000)

  start('npx', ['next', 'dev', '-p', '3000'], {}, 'next dev :3000 (compress: true)')
  await waitFor(3000)
  console.log('\n[repro] through next dev with default compress: true')
  const bad = await probe(3000)

  start('npx', ['next', 'dev', '-p', '3001'], { COMPRESS: 'false' }, 'next dev :3001 (compress: false)')
  await waitFor(3001)
  console.log('\n[repro] through next dev with compress: false')
  const good = await probe(3001)

  console.log(
    `\n[repro] compress:true -> ${bad.decoded} decoded chunk(s) | compress:false -> ${good.decoded} decoded chunk(s)`
  )
  console.log(
    bad.decoded === 1 && good.decoded === 10
      ? '[repro] BUG REPRODUCED: gzip buffers the whole proxied stream into a single chunk.'
      : '[repro] NOT reproduced.'
  )
  for (const c of children) c.kill()
  process.exit(0)
})()
