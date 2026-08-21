// Hammers the dev server's dynamic page and samples the heap numbers Next.js
// uses for its "approaching the used memory threshold, restarting..." check.
const base = process.env.BASE ?? 'http://127.0.0.1:3000'
const total = Number(process.env.REQUESTS ?? 4000)
const concurrency = Number(process.env.CONCURRENCY ?? 8)
const sampleEvery = Number(process.env.SAMPLE_EVERY ?? 250)

async function heap(gc = false) {
  const res = await fetch(`${base}/api/heap${gc ? '?gc=1' : ''}`)
  return res.json()
}

let done = 0
let failed = 0
async function worker() {
  while (done + failed < total) {
    try {
      const res = await fetch(`${base}/dynamic`)
      await res.text()
      if (!res.ok) failed++
      else done++
    } catch (err) {
      failed++
      console.log(`request failed after ${done} ok: ${err.message}`)
      if (failed > 5) return
    }
  }
}

console.log('baseline', await heap(true))
const started = Date.now()
const timer = setInterval(async () => {
  try {
    console.log(`${done} requests`, await heap())
  } catch {}
}, 5000)
void sampleEvery
await Promise.all(Array.from({ length: concurrency }, worker))
clearInterval(timer)
console.log(`finished ${done} ok / ${failed} failed in ${((Date.now() - started) / 1000).toFixed(1)}s`)
try {
  console.log('after forced gc', await heap(true))
} catch (err) {
  console.log('server gone:', err.message)
}
