import { NextResponse } from 'next/server'

// Middleware that runs on every request, like the reporter's setup.
export function middleware() {
  return NextResponse.next()
}

export const config = { matcher: '/:path*' }
