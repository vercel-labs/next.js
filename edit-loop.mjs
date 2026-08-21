// Simulates the reported real-world workflow: repeated source edits (HMR
// recompiles) plus a page request after each edit, sampling the same heap
// numbers Next.js uses for its memory-threshold restart decision.
import fs from 'node:fs/promises'

const base = process.env.BASE ?? 'http://127.0.0.1:3000'
const iterations = Number(process.env.ITERATIONS ?? 60)
const file = new URL('./app/dynamic/page.jsx', import.meta.url)
const original = await fs.readFile(file, 'utf8')

async function heap(gc = false) {
  const res = await fetch(`${base}/api/heap${gc ? '?gc=1' : ''}`)
  return res.json()
}

try {
  await fetch(`${base}/dynamic`).then((r) => r.text())
  console.log('baseline', await heap(true))
  for (let i = 1; i <= iterations; i++) {
    await fs.writeFile(file, `${original}\n// edit ${i} ${Date.now()}\n`)
    // give the dev server time to pick up the change and recompile
    await new Promise((r) => setTimeout(r, 400))
    const res = await fetch(`${base}/dynamic`)
    await res.text()
    if (i % 5 === 0) console.log(`edit ${i}`, res.status, await heap())
  }
  console.log('after forced gc', await heap(true))
} catch (err) {
  console.log('error / server gone:', err.message)
} finally {
  await fs.writeFile(file, original)
}
