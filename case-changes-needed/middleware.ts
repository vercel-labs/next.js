// Control case: content change IS needed, so the file gets renamed to proxy.ts.
import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}
