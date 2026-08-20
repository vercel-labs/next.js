// Hammers the built-in image optimizer with *distinct* variants (never cache hits)
// and prints the next-server process RSS as it goes.
import { execSync } from 'node:child_process'

const base = process.env.BASE || 'http://127.0.0.1:3000'
const pid = process.env.SERVER_PID
const widths = [480, 500, 520, 540, 560, 640, 828, 1920]
const qualities = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]
const images = Number(process.env.IMAGES || 60)

function rssMb() {
  if (!pid) return NaN
  return Number(execSync(`ps -o rss= -p ${pid}`).toString().trim()) / 1024
}

console.log(`baseline server RSS ${rssMb().toFixed(1)} MB`)
let n = 0
for (const q of qualities) {
  for (const w of widths) {
    for (let i = 0; i < images; i++) {
      const res = await fetch(`${base}/_next/image?url=%2Fphoto${i}.jpg&w=${w}&q=${q}`)
      await res.arrayBuffer()
      if (!res.ok) throw new Error(`${res.status}`)
      n++
      if (n % 120 === 0) {
        console.log(`${n} distinct optimizer requests -> server RSS ${rssMb().toFixed(1)} MB`)
      }
    }
  }
}
