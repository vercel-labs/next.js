import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/rewrite') {
    const res = NextResponse.rewrite(new URL('/origin', 'http://localhost:4000'))
    res.headers.set('custom', 'from-middleware')       // works
    res.headers.set('server', 'from-middleware')       // ignored, origin wins
    res.headers.set('cache-control', 'public, max-age=60') // ignored, origin wins
    res.headers.set('x-origin-only', 'from-middleware') // works? (origin also sets it)
    return res
  }
}

export const config = { matcher: '/rewrite' }
