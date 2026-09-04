// Reports the memory usage of the dev server process that renders `/`.
export const dynamic = 'force-dynamic'

export async function GET() {
  const gc = (global as any).gc
  if (gc) {
    gc()
    gc()
  }

  const { heapUsed, rss } = process.memoryUsage()

  return Response.json({ heapUsed, rss, exposedGc: Boolean(gc) })
}
