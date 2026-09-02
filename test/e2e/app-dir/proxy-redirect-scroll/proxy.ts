import { NextResponse, type NextRequest } from 'next/server'

const locales = ['en', 'no']

// Redirects any unprefixed pathname to the default locale, e.g.
// /about -> /en/about, like a typical i18n proxy.
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(`/en${pathname}${search}`, request.url),
      {
        status: 308,
      }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
