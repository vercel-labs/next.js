import { NextResponse } from 'next/server'

export function proxy(request) {
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/en${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: '/((?!_next|.*\\..*).*)',
}
