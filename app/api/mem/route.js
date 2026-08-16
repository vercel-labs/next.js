export const dynamic = 'force-dynamic'
export async function GET(req) {
  const url = new URL(req.url)
  if (url.searchParams.has('gc') && global.gc) {
    global.gc(); global.gc(); await new Promise(r => setTimeout(r, 200)); global.gc()
  }
  const m = process.memoryUsage()
  return Response.json({
    rss: Math.round(m.rss / 1048576),
    heapUsed: Math.round(m.heapUsed / 1048576),
    external: Math.round(m.external / 1048576),
    arrayBuffers: Math.round(m.arrayBuffers / 1048576),
    stackTraceLimit: Error.stackTraceLimit,
    aborts: globalThis.__abortCount ? globalThis.__abortCount() : null,
    retained: globalThis.__retainedReasons ? globalThis.__retainedReasons.length : null,
  })
}
