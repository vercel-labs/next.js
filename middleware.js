import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  console.log('[middleware]', request.method, pathname)
  if (pathname === '/') {
    // internal rewrite, should be transparent to the client
    return NextResponse.rewrite(new URL('/target', request.url))
  }
  if (pathname === '/target') {
    // simulates next-intl `localePrefix: 'as-needed'` redirecting the
    // prefixed path back to the unprefixed one
    return NextResponse.redirect(new URL('/redirected', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next|favicon.ico).*)'] }
