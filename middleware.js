import { NextResponse } from 'next/server'

const locales = ['en', 'es']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname === '/' ? '' : pathname}`
  console.log('[middleware] redirecting', pathname, '->', url.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
