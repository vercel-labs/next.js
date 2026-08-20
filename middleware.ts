import { NextResponse } from 'next/server'
import type { MiddlewareConfig } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

// Documented shape (`source`) + Node.js middleware runtime.
// `runtime` is accepted by Next.js at build/dev time but is missing from the
// exported `MiddlewareConfig` type => TS2353.
export const config: MiddlewareConfig = {
  runtime: 'nodejs',
  matcher: [{ source: '/dashboard/:path*' }],
}
