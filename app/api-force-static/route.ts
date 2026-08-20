import { NextRequest } from 'next/server'

export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  return new Response(JSON.stringify({ q, url: request.url }), {
    headers: { 'content-type': 'application/json' },
  })
}
