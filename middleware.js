import { NextResponse } from 'next/server'

// Strict `style-src`: no 'unsafe-inline' and no 'unsafe-hashes', so *any*
// inline style attribute is blocked. `script-src` is deliberately permissive
// so the only reported violation comes from next/image.
export function middleware() {
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
    `style-src 'self'`,
    `img-src 'self'`,
  ].join('; ')

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = { matcher: '/' }
