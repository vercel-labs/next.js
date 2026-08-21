export const runtime = 'nodejs'

export async function GET() {
  console.log('[node route] starting fetch to https://example.com')
  const res = await fetch('https://example.com', { cache: 'no-store' })
  console.log('[node route] finished fetch, status', res.status)
  return new Response('node ok ' + res.status)
}
