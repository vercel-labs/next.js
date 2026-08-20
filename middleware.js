import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl
  const host = request.headers.get('host') || ''
  const sub = host.split('.')[0]
  // only act on subdomain requests to the root path
  if (host.includes('.localhost') && url.pathname === '/') {
    const target = new URL(`http://localhost:3000/signin?domainKey=${sub}`)
    console.log('[middleware] redirecting to', target.toString())
    return NextResponse.redirect(target)
  }
  if (url.pathname === '/sub') {
    return NextResponse.redirect(new URL('http://bar.localhost:3000/signin?from=' + sub))
  }
  if (url.pathname === '/ext') {
    return NextResponse.redirect(new URL('https://example.com/signin?domainKey=' + sub))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] }
