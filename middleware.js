import { NextResponse } from 'next/server'

// Middleware runs in the Edge Runtime. The documented CSP nonce snippet uses
// Buffer, which is NOT listed at https://nextjs.org/docs/pages/api-reference/edge
export function middleware() {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const res = NextResponse.next()
  res.headers.set('x-nonce', nonce)
  res.headers.set('x-buffer-isbuffer', String(Buffer.isBuffer(Buffer.from('a'))))
  res.headers.set('x-buffer-ctor-name', Buffer.name)
  return res
}

export const config = { matcher: '/' }
