import { NextResponse } from 'next/server'

export default function middleware(request) {
  console.log('middleware saw url:', request.nextUrl.href)
  return NextResponse.rewrite(request.nextUrl.href)
}

export const config = {
  matcher: ['/((?!api|_next/|_vercel|favicon.ico).*)'],
}
