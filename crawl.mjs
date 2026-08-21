// Crawls every generated route in the running dev server, then re-visits them,
// sampling the exact heap numbers Next.js uses in
// packages/next/src/server/lib/utils.ts -> getMemoryRestartStats
// (used_heap_size > 0.8 * heap_size_limit  =>  dev server restarts).
const base = process.env.BASE ?? 'http://127.0.0.1:3000'
const routes = Number(process.env.ROUTES ?? 120)
const passes = Number(process.env.PASSES ?? 3)

async function heap(gc = false) {
  const res = await fetch(`${base}/api/heap${gc ? '?gc=1' : ''}`)
  if (!res.ok) throw new Error(`heap route ${res.status}`)
  return res.json()
}

function fmt(h) {
  return `used=${h.usedHeapMB}MB (${h.pctOfLimit}% of ${h.heapLimitMB}MB limit) rss=${h.rssMB}MB`
}

console.log('baseline (after gc)', fmt(await heap(true)))

for (let pass = 1; pass <= passes; pass++) {
  for (let r = 0; r < routes; r++) {
    const started = Date.now()
    let res
    try {
      res = await fetch(`${base}/gen/route-${r}`)
      await res.text()
    } catch (err) {
      console.log(
        `pass ${pass} route ${r}: request failed (dev server restarted?): ${err.message}`
      )
      await new Promise((r2) => setTimeout(r2, 3000))
      continue
    }
    if (r % 10 === 0) {
      let h
      try {
        h = fmt(await heap())
      } catch (err) {
        h = `heap sample failed: ${err.message}`
      }
      console.log(
        `pass ${pass} route ${r} ${res.status} ${Date.now() - started}ms ${h}`
      )
    }
  }
  try {
    console.log(`pass ${pass} done, after gc`, fmt(await heap(true)))
  } catch (err) {
    console.log(`pass ${pass} done, heap sample failed: ${err.message}`)
  }
}
