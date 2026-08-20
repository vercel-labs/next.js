// Hammers /_next/image with cache-busted URLs so every request is a cache MISS,
// printing the RSS of the Next.js server process over time.
import { execSync } from 'node:child_process'

const base = process.env.BASE || 'http://localhost:3000'
const pid = process.env.SERVER_PID
const total = Number(process.env.TOTAL || 400)
const q = process.env.Q || '75'
const widths = (process.env.WIDTHS || '640,750,828,1080,1200,1920,2048,3840')
  .split(',')
  .map(Number)
const rss = () =>
  pid ? Number(execSync(`ps -o rss= -p ${pid}`).toString().trim()) / 1024 : NaN

console.log('req,rssMB,status,ms')
for (let n = 1; n <= total; n++) {
  const w = widths[n % widths.length]
  const url = encodeURIComponent(`/api/img/${n}`)
  const t = Date.now()
  const res = await fetch(`${base}/_next/image?url=${url}&w=${w}&q=${q}`)
  await res.arrayBuffer()
  if (n % 10 === 0)
    console.log(`${n},${rss().toFixed(0)},${res.status},${Date.now() - t}`)
}
