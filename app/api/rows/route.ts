import { store } from '../../../lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({ rows: store.rows, seq: store.seq }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'private, no-cache, no-store, max-age=0, must-revalidate',
    },
  })
}
