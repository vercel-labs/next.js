import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/nice-public-path')) {
    return NextResponse.rewrite(new URL('/internalPath', request.url))
  }
}
