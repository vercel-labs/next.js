export const dynamic = 'force-dynamic'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function GET(req) {
  const map = globalThis.__nextPendingOperations
  const wantGc = new URL(req.url).searchParams.get('gc') !== '0'
  const before = map ? map.size : null
  if (wantGc && global.gc) {
    global.gc()
    await sleep(150)
    global.gc()
    await sleep(150)
  }
  const mem = process.memoryUsage()
  return Response.json({
    trackedBeforeGc: before,
    trackedAfterGc: wantGc && map ? map.size : null,
    heapUsedMB: Math.round(mem.heapUsed / 1048576),
    rssMB: Math.round(mem.rss / 1048576),
  })
}
