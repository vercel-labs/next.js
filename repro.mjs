// Runs the custom server in dev mode and probes / and /config-test.
import { spawn } from 'child_process'

const child = spawn(process.execPath, ['server.mjs'], { stdio: 'inherit' })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(12000)
for (const p of ['/', '/config-test']) {
  const res = await fetch(`http://localhost:3000${p}`)
  console.log(`${p} -> ${res.status}`)
}
console.log('EXPECTED with basePath applied: / -> 404, /config-test -> 200')
child.kill()
