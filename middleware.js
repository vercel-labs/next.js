import { NextResponse } from 'next/server'

// Issue #76138 claims the mere presence of middleware breaks preview mode.
// MW=off  -> no middleware work at all (baseline)
// MW=pass -> NextResponse.next()
// MW=rewrite (default) -> pretty URL /p/:slug rewritten to /posts/:slug
export function middleware(request) {
  if (process.env.MW === 'off') return
  const url = request.nextUrl.clone()
  if (process.env.MW !== 'pass' && url.pathname.startsWith('/p/')) {
    url.pathname = '/posts/' + url.pathname.slice(3)
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
