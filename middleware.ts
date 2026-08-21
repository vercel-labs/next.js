import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  if (url.pathname.startsWith('/buggy')) {
    // Rewrite without touching the query string.
    // NextURL serializes the query with URLSearchParams, so a space in a
    // parameter KEY is emitted as "+" in the x-middleware-rewrite header.
    url.pathname = '/target-page'
    return NextResponse.rewrite(url)
  }

  if (url.pathname.startsWith('/fixed')) {
    // Workaround: re-encode the query so spaces in keys become %20.
    url.pathname = '/target-page'
    url.search = Array.from(url.searchParams.entries()).length
      ? '?' +
        Array.from(url.searchParams.entries())
          .map(
            ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
          )
          .join('&')
      : ''
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/buggy/:path*', '/fixed/:path*'],
}
