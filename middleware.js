import { NextResponse } from 'next/server'

export function middleware(req) {
  console.log('[middleware] pathname:', req.nextUrl.pathname, 'locale:', req.nextUrl.locale)
  return NextResponse.next()
}
