import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/redirect-external') {
    // External redirect from middleware
    return NextResponse.redirect('https://example.com/')
  }
  return NextResponse.next()
}

export const config = { matcher: ['/redirect-external'] }
