import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()
  console.log('[middleware]', req.method, url.pathname + url.search)
  if (url.pathname === '/target' && !url.searchParams.get('identifier')) {
    url.searchParams.set('identifier', 'yolo')
    console.log('[middleware] redirecting to', url.toString())
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/target'] }
