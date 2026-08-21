import { NextResponse, type NextRequest } from 'next/server'

// Mirrors the docs example: "Optimistic checks with Middleware (optional)"
// https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-middleware-optional
export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard')

  console.log(
    `[middleware] ${req.method} ${req.nextUrl.pathname} session=${session ?? 'none'} next-action=${
      req.headers.get('next-action') ? 'yes' : 'no'
    }`
  )

  if (isProtectedRoute && !session) {
    console.log('[middleware] redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'] }
