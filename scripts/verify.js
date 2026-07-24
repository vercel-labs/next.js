const { spawn } = require('child_process')
const http = require('http')
const path = require('path')

const root = path.join(__dirname, '..')
const port = 3210
const child = spawn(process.execPath, ['server.js'], {
  cwd: root,
  env: {
    ...process.env,
    PORT: String(port),
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_OPTIONS: `--require=${path.join(__dirname, 'slow-initial-scan.js')}`,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let output = ''
let checkedInitial = false
let checkedRecovered = false
let failed = false

function request(pathname) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: pathname }, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => resolve({
        path: pathname,
        status: res.statusCode,
        type: res.headers['content-type'],
        body: body.slice(0, 120).replace(/\s+/g, ' '),
      }))
    })
    req.on('error', reject)
  })
}

async function initialCheck() {
  if (checkedInitial) return
  checkedInitial = true
  const [dynamic, statik] = await Promise.all([
    request('/api/123'),
    request('/api/hello'),
  ])
  console.log('[INITIAL]', JSON.stringify({ dynamic, static: statik }))
  if (dynamic.status !== 404 || !dynamic.type?.startsWith('text/html') ||
      statik.status !== 200 || !statik.type?.startsWith('application/json')) {
    failed = true
    console.error('Expected dynamic 404 HTML while static returns 200 JSON')
  }
}

async function recoveredCheck() {
  if (checkedRecovered) return
  checkedRecovered = true
  await new Promise((resolve) => setTimeout(resolve, 250))
  const dynamic = await request('/api/123')
  console.log('[RECOVERED]', JSON.stringify({ dynamic }))
  if (dynamic.status !== 200 || !dynamic.body.includes('"ok":"dynamic"')) {
    failed = true
    console.error('Expected dynamic route to recover after the complete aggregation')
  }
  child.kill('SIGTERM')
  setTimeout(() => process.exit(failed ? 1 : 0), 200)
}

function consume(chunk) {
  const text = chunk.toString()
  process.stdout.write(text)
  output += text
  if (output.includes('[CUSTOM] listening at')) initialCheck().catch(abort)
  if (output.includes('routedPages count: 5003 dynamic routes: 1')) {
    recoveredCheck().catch(abort)
  }
}

function abort(error) {
  failed = true
  console.error(error)
  child.kill('SIGTERM')
  setTimeout(() => process.exit(1), 100)
}

child.stdout.on('data', consume)
child.stderr.on('data', consume)
child.on('exit', (code) => {
  if (!checkedRecovered && code !== null) abort(new Error(`server exited ${code}`))
})
setTimeout(() => abort(new Error('timed out')), 15000).unref()
