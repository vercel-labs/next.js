import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  return Response.json({
    'request.url': request.url,
    'request.nextUrl.href': request.nextUrl.href,
    'request.nextUrl.host': request.nextUrl.host,
    headers: Object.fromEntries(request.headers.entries()),
  })
}
