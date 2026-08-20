import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Layouts cannot read the pathname, so it is forwarded as a request header.
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers } })
}

export const config = { matcher: '/:path*' }
