// One-shot check: boots the Fastify custom server, hits both routes, prints Set-Cookie presence.
import { spawn } from 'node:child_process'

const port = 3210
const child = spawn(process.execPath, ['server.mjs'], {
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'inherit', 'inherit'],
})

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const get = async (p) => {
  const res = await fetch(`http://localhost:${port}${p}`)
  await res.text()
  return res.headers.get('set-cookie')
}

for (let i = 0; i < 60; i++) {
  try {
    await fetch(`http://localhost:${port}/`)
    break
  } catch {
    await wait(1000)
  }
}

console.log('setHeader AFTER handle() ->', await get('/after/x'))
console.log('setHeader BEFORE handle() ->', await get('/before/x'))
child.kill()
