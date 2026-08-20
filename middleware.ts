import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('[middleware] url:', request.url)
  console.log('[middleware] test param:', request.nextUrl.searchParams.get('test'))
  console.log('[middleware] _rsc param:', request.nextUrl.searchParams.get('_rsc'))
  console.log('[middleware] rsc header:', request.headers.get('rsc'))
  console.log('[middleware] next-router-prefetch header:', request.headers.get('next-router-prefetch'))
  console.log('[middleware] all headers:', JSON.stringify(Object.fromEntries(request.headers)))
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
