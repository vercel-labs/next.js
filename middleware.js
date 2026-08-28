import { NextResponse } from 'next/server'

// Redirect target: '/start' (redirect-to-self, the reproducing Case 3) by default.
// Set NEXT_PUBLIC_REDIRECT_TARGET=/denied at build time for Case 1 (different route).
const REDIRECT_TARGET = process.env.NEXT_PUBLIC_REDIRECT_TARGET || '/start'

export function middleware(req) {
  const { pathname } = req.nextUrl
  if (pathname === '/target' || pathname.startsWith('/target/')) {
    const flag = req.cookies.get('flip')?.value
    if (!flag) {
      const url = req.nextUrl.clone()
      url.pathname = REDIRECT_TARGET
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
