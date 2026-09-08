import v8 from 'v8'
import os from 'os'

export const dynamic = 'force-dynamic'

export async function GET() {
  const mb = (b: number) => Math.floor(b / 1048576)
  return Response.json({
    pid: process.pid,
    osTotalMemMB: mb(os.totalmem()),
    constrainedMemoryMB: mb(process.constrainedMemory() ?? 0),
    v8HeapSizeLimitMB: mb(v8.getHeapStatistics().heap_size_limit),
    nodeOptions: process.env.NODE_OPTIONS ?? null,
    execArgv: process.execArgv,
  })
}
