export async function POST() {
  console.log('Route: /api/sse-node triggered')
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let i = 0
      setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: tick ${i++}\n\n`))
        } catch {}
      }, 300)
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
    },
  })
}
