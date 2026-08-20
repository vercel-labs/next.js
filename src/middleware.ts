import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('x-middleware-ran', '1')
  if (request.nextUrl.pathname === '/secret') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return res
}

export const config = { matcher: ['/((?!_next).*)'] }
