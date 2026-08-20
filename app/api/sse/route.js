export const runtime = 'edge'

export async function POST() {
  console.log('Route: /api/sse (edge) triggered')
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let i = 0
      const id = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: tick ${i++}\n\n`))
        } catch {
          clearInterval(id)
        }
      }, 300)
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}

export const GET = POST
