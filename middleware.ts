import { NextRequest, NextResponse } from 'next/server'

export const config = { matcher: ['/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'] }

export default function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const isSubdomain = host.split('.').length >= 3

  if (isSubdomain && req.nextUrl.pathname.startsWith('/shouldredirect')) {
    // Fully-qualified, cross-host redirect to the apex domain.
    return NextResponse.redirect(new URL('http://example.test:3000/login'))
  }

  return NextResponse.next()
}
