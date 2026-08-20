// Reproduction for https://github.com/vercel/next.js/issues/38863
// POST to a pages/ route returns 200 with `next dev`, but 405 with `next start`.
import { spawn } from 'node:child_process'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function status(url, method) {
  const res = await fetch(url, { method })
  return res.status
}

async function ready(url) {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(url)
      return
    } catch {
      await wait(1000)
    }
  }
  throw new Error(`server never came up: ${url}`)
}

async function run(cmd, args) {
  const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
  await new Promise((res, rej) =>
    p.on('exit', (c) => (c === 0 ? res() : rej(new Error(`${cmd} ${args.join(' ')} exited ${c}`))))
  )
}

function serve(args) {
  return spawn('npx', ['next', ...args], { stdio: 'inherit', shell: process.platform === 'win32' })
}

const results = {}

let dev = serve(['dev', '-p', '3000'])
await ready('http://localhost:3000/')
results.devGET = await status('http://localhost:3000/', 'GET')
results.devPOST = await status('http://localhost:3000/', 'POST')
dev.kill('SIGKILL')

await run('npx', ['next', 'build'])
let prod = serve(['start', '-p', '3001'])
await ready('http://localhost:3001/')
results.prodGET = await status('http://localhost:3001/', 'GET')
results.prodPOST = await status('http://localhost:3001/', 'POST')
prod.kill('SIGKILL')

console.log('\n=== results ===')
console.log(results)
const bug = results.devPOST === 200 && results.prodPOST === 405
console.log(bug ? 'REPRODUCED: dev POST 200, prod POST 405' : 'NOT reproduced')
process.exit(bug ? 0 : 1)
