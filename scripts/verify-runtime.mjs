import { spawn } from 'node:child_process'

const port = 39621
const nextBin = new URL('../node_modules/next/dist/bin/next', import.meta.url).pathname
const server = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let serverOutput = ''
server.stdout.on('data', (chunk) => {
  serverOutput += chunk
})
server.stderr.on('data', (chunk) => {
  serverOutput += chunk
})

async function requestWhenReady() {
  const deadline = Date.now() + 30_000
  let lastError
  while (Date.now() < deadline) {
    try {
      return await fetch(`http://127.0.0.1:${port}/api/reproduce`)
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
  throw lastError ?? new Error('production server did not become ready')
}

try {
  const response = await requestWhenReady()
  const body = await response.text()
  console.log(`Runtime response: HTTP ${response.status} ${body}`)

  const parsed = JSON.parse(body)
  if (
    response.status !== 200 ||
    parsed.document?.branch !== 'created-by-null-guard' ||
    parsed.createCount !== 1
  ) {
    throw new Error('the nullable creation branch did not execute as expected')
  }
  console.log('PASS: a null read executed the protected creation branch in the production server.')
} catch (error) {
  console.error(serverOutput)
  throw error
} finally {
  server.kill('SIGTERM')
}
