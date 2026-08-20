import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/super-secret-admin-path/:path*', '/((?!internal-only-beta-flag).*)'],
}

export default function middleware() {
  return NextResponse.next()
}
