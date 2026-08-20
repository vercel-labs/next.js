import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withLogging } from 'logger'

export function middleware(request: NextRequest) {
  // request is next@14.0.1's NextRequest, withLogging expects next@13.4.12's
  withLogging(request)
  return NextResponse.next()
}
