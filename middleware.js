import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

// Note: this matcher does NOT match the pages used in this repro
export const config = { matcher: '/restricted/:path*' }
