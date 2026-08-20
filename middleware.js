import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|636e7a2fbf227a0222432704|_next|[\\w-]+\\.\\w+).*)",
  ],
}

export default function middleware(req) {
  const url = req.nextUrl.clone()
  const { pathname } = req.nextUrl
  let hostname = req.headers.get('host').replace(/:\d+$/, '')

  if (!hostname) {
    return
  }

  url.pathname = `/${hostname}${pathname}`

  return NextResponse.rewrite(url)
}
