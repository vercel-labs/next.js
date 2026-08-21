// MISPLACED: project uses src/app, so Next.js only honors src/middleware.js.
// This file at the project root is silently ignored - no error, no warning.
import { NextResponse } from 'next/server'

export function middleware() {
  const res = NextResponse.next()
  res.headers.set('x-middleware-ran', 'yes')
  return res
}

export const config = { matcher: '/:path*' }
