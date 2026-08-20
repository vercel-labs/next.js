import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'es']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const missing = locales.every(
    (l) => !pathname.startsWith(`/${l}/`) && pathname !== `/${l}`
  )
  if (missing) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
