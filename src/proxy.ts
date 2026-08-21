import { NextResponse } from "next/server"

// Trivial proxy (middleware) as described in the issue.
export function proxy() {
  return NextResponse.next()
}
