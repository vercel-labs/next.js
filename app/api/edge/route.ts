export const runtime = 'edge'

export async function GET() {
  console.log('[edge route] starting fetch to https://example.com')
  const res = await fetch('https://example.com', { cache: 'no-store' })
  console.log('[edge route] finished fetch, status', res.status)
  return new Response('edge ok ' + res.status)
}
