// Concurrent unique optimizations; prints peak RSS of the server process.
import { execSync } from 'node:child_process'
const pid = process.env.SERVER_PID
const conc = Number(process.env.CONC || 10)
const total = Number(process.env.TOTAL || 100)
const offset = Number(process.env.OFFSET || 100000)
const rss = () => Number(execSync(`ps -o rss= -p ${pid}`).toString().trim()) / 1024
let peak = 0, done = 0, codes = {}
const timer = setInterval(() => { const r = rss(); if (r > peak) peak = r }, 250)
let next = 0
async function worker() {
  while (next < total) {
    const n = offset + next++
    const res = await fetch(`http://localhost:3000/_next/image?url=${encodeURIComponent(`/api/img/${n}`)}&w=3840&q=75`)
    await res.arrayBuffer().catch(() => {})
    codes[res.status] = (codes[res.status] || 0) + 1
    done++
  }
}
await Promise.all(Array.from({ length: conc }, worker))
clearInterval(timer)
console.log(JSON.stringify({ conc, done, codes, peakRssMB: Math.round(peak), finalRssMB: Math.round(rss()) }))
