import { NextResponse } from 'next/server'

// A no-op middleware is enough to trigger the bug.
// Delete this file and the client-side navigation renders with props again.
export function middleware() {
  return NextResponse.next()
}
