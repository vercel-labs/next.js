import { NextResponse } from 'next/server'

export const config = { matcher: ['/login', '/dashboard'] }

export function middleware(request) {
  const session = request.cookies.get('sessionToken')?.value || null
  console.log('[middleware]', request.nextUrl.pathname, 'session=', session)
  if (!session && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
