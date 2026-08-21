import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl
  console.log(
    `[middleware] ${request.method} ${pathname} next-action=${request.headers.get('next-action') ?? '-'} x-action-forwarded=${request.headers.get('x-action-forwarded') ?? '-'}`
  )
  // Simulate next-intl style locale rewriting
  if (!pathname.startsWith('/en')) {
    return NextResponse.rewrite(new URL(`/en${pathname === '/' ? '' : pathname}`, request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/((?!_next).*)' }
