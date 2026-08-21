import { NextResponse } from 'next/server'

export function middleware(request) {
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/en${newUrl.pathname}`
  return NextResponse.rewrite(newUrl)
}

export const config = {
  matcher: ['/((?!_next|en).*)'],
}
