import { store } from '../../../lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()
  let send: (data: string) => void
  const stream = new ReadableStream({
    start(controller) {
      send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {}
      }
      store.subscribers.add(send)
      controller.enqueue(encoder.encode(`: connected\n\n`))
    },
    cancel() {
      store.subscribers.delete(send)
    },
  })
  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      connection: 'keep-alive',
    },
  })
}
