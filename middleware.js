import { NextResponse } from 'next/server'
export function middleware(req) {
  if (req.nextUrl.pathname === '/mw-example') {
    return NextResponse.rewrite(new URL('/404', req.url))
  }
  return NextResponse.next()
}
