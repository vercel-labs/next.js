import { NextRequest, NextResponse } from 'next/server'

// Mimics next-intl localePrefix: 'never' — locale rewritten in proxy.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/en')) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
