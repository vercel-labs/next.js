export const dynamic = 'force-dynamic'

export async function POST(request) {
  const start = Date.now()
  let size = 0
  try {
    for await (const chunk of request.body) {
      size += chunk.length
    }
    console.log(`[route] DONE after ${((Date.now() - start) / 1000).toFixed(1)}s, ${size} bytes`)
    return new Response('Upload complete', { status: 200 })
  } catch (error) {
    console.error(
      `[route] ERROR after ${((Date.now() - start) / 1000).toFixed(1)}s, ${size} bytes received:`,
      error
    )
    return new Response('Upload failed', { status: 500 })
  }
}
