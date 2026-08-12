import { NextResponse, type NextRequest } from 'next/server'

// An i18n proxy with an unprefixed default locale: any path that isn't already
// locale-prefixed is rewritten under `/de`. `/en/...` and `/de/...` pass
// through untouched, so `/en` renders the home route while `/alpha` renders the
// catch-all route at `/de/alpha`.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/en') || pathname.startsWith('/de')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/de${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
