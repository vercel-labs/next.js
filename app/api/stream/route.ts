import { after } from 'next/server'
import { cookies, headers, draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  after(async () => {
    await fetch('https://example.com', { cache: 'no-store' }).catch(() => {})
  })
  await cookies()
  await headers()
  await draftMode()
  await request.text()
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(new TextEncoder().encode('a'))
      await new Promise((r) => setTimeout(r, 30))
      controller.enqueue(new TextEncoder().encode('b'))
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'content-type': 'text/plain' } })
}
