import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()
  // v1: set the cookie on the *response* only. The browser may block/reject it.
  response.cookies.set({ name: 'session', value: 'set-by-middleware-v1', path: '/' })
  return response
}

export const config = { matcher: ['/', '/api/read'] }
