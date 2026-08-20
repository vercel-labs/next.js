import { NextResponse } from 'next/server'

export function middleware(request) {
  console.log(
    '[middleware]',
    request.method,
    request.nextUrl.pathname,
    'next-action=' + Boolean(request.headers.get('next-action'))
  )
  if (request.headers.get('next-action') && request.nextUrl.pathname === '/protected') {
    console.log('[middleware] blocking server action on /protected')
    return new NextResponse('blocked by middleware', { status: 401 })
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard', '/protected'] }
