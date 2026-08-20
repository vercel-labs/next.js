import { NextResponse, type NextRequest } from 'next/server'
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/rw')) {
    const url = req.nextUrl.clone()
    url.pathname = '/api/stream'
    return NextResponse.rewrite(url)
  }
  if (req.nextUrl.pathname.startsWith('/page-rw')) {
    const url = req.nextUrl.clone()
    url.pathname = '/x/a/b/c'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!_next).*)'] }
