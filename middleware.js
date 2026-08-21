import { NextResponse } from 'next/server'
export function middleware(request) {
  const url = request.nextUrl.clone()
  const ua = request.headers.get('user-agent') || ''
  const device = /mobile/i.test(ua) ? 'mobile' : 'desktop'
  url.pathname = `/${device}${url.pathname}`
  return NextResponse.rewrite(url)
}
export const config = { matcher: ['/((?!_next|favicon.ico).*)'] }
