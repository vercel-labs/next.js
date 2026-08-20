import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('MIDDLEWARE_RUN pathname =>', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = { matcher: ['/', '/dashboard', '/dynamic'] }
