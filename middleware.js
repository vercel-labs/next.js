import { NextResponse } from 'next/server'
export function middleware(req) {
  const info = {
    where: 'middleware',
    reqUrl: req.url,
    nextUrl: req.nextUrl.href,
    nextUrlHost: req.nextUrl.host,
    hostHeader: req.headers.get('host'),
    xForwardedHost: req.headers.get('x-forwarded-host') ?? null,
  }
  console.log('MW ' + JSON.stringify(info))
  const res = NextResponse.next()
  res.headers.set('x-mw-req-url', String(req.url))
  res.headers.set('x-mw-nexturl', String(req.nextUrl.href))
  return res
}
export const config = { matcher: '/api/:path*' }
