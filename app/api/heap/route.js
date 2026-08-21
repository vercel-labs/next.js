import v8 from 'v8'

export const dynamic = 'force-dynamic'

// Reports the same numbers Next.js itself uses to decide whether to restart
// the dev server (see server/lib/utils.ts -> getMemoryRestartStats).
export async function GET(request) {
  const url = new URL(request.url)
  if (url.searchParams.has('gc') && globalThis.gc) {
    globalThis.gc()
    globalThis.gc()
  }
  const s = v8.getHeapStatistics()
  return Response.json({
    usedHeapMB: +(s.used_heap_size / 1024 / 1024).toFixed(1),
    heapLimitMB: +(s.heap_size_limit / 1024 / 1024).toFixed(1),
    pctOfLimit: +((s.used_heap_size / s.heap_size_limit) * 100).toFixed(1),
    rssMB: +(process.memoryUsage().rss / 1024 / 1024).toFixed(1),
    restartThresholdPct: 80,
  })
}
