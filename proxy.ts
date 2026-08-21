import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  console.log('[proxy] pathname=' + request.nextUrl.pathname + ' url=' + request.url)
  return NextResponse.next()
}
