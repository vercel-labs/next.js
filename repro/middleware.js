import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const hasLocale = ['/en', '/de'].some(
    (l) => pathname === l || pathname.startsWith(l + '/')
  )
  if (!hasLocale) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url))
  }
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] }
