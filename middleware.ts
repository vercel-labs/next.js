import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('MIDDLEWARE RAN for', request.nextUrl.pathname)
  const res = NextResponse.next()
  res.headers.set('x-middleware-ran', request.nextUrl.pathname)
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
