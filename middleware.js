import { NextResponse } from 'next/server'
export const config = { matcher: ['/p/:path*'] }
export const runtime = 'nodejs'
export function middleware() { return NextResponse.next() }
