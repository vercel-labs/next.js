import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  console.log('[middleware] req.url=', request.url, '| pathname=', pathname)

  // enforce trailing slash (skipTrailingSlashRedirect: true means Next won't do it)
  if (!pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname + '/'
    console.log('[middleware] redirecting to', url.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/foo', '/foo/'] }
