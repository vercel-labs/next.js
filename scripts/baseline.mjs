// Baseline: same source bytes served through the route handler, no image optimizer.
import { execSync } from 'node:child_process'
const pid = process.env.SERVER_PID
const total = Number(process.env.TOTAL || 400)
const rss = () => Number(execSync(`ps -o rss= -p ${pid}`).toString().trim()) / 1024
console.log('req,rssMB,status,ms')
for (let n = 1; n <= total; n++) {
  const t = Date.now()
  const res = await fetch(`http://localhost:3000/api/img/${n}`)
  await res.arrayBuffer()
  if (n % 25 === 0) console.log(`${n},${rss().toFixed(0)},${res.status},${Date.now() - t}`)
}
