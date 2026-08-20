import { NextResponse } from 'next/server'

export async function middleware(req) {
  console.log(`[middleware] ${req.method} ${req.url}`)
  return NextResponse.next()
}

export const config = { matcher: '/:path*' }
