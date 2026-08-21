import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/mw/plausible.js') {
    return NextResponse.rewrite(new URL('https://plausible.io/js/script.js'))
  }
  if (request.nextUrl.pathname === '/mw/local.js') {
    return NextResponse.rewrite(new URL('http://127.0.0.1:4000/gzip'))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/mw/:path*', '/dashboard/:path*'],
}
