import { mutateAndBroadcast, resetRows } from '../../../lib/store'

export const dynamic = 'force-dynamic'

// Called by the route's client consumer on mount. The server mutates the row
// and broadcasts an SSE message ~1s later, i.e. while the initial navigation
// to the route is still settling.
export async function POST(req: Request) {
  const { id = 'row-1', delay = 1000, reset = false } = await req
    .json()
    .catch(() => ({}) as any)
  if (reset) resetRows()
  setTimeout(() => mutateAndBroadcast(id), delay)
  return new Response('ok', { headers: { 'cache-control': 'no-store' } })
}
