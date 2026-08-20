import { NextResponse } from 'next/server'

export function middleware(request) {
  console.log('[middleware] hit', request.nextUrl.pathname)
  return NextResponse.redirect(new URL('/redirected', request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
