import { NextResponse } from 'next/server'

// Simulate expensive module-level sync work performed when the middleware
// bundle is first evaluated (as in the reported CPU profile).
const start = Date.now()
let x = 0
while (Date.now() - start < 2000) { x++ }
console.log(`[middleware] module evaluated in ${Date.now() - start}ms (${x})`)

export function middleware() {
  return NextResponse.next()
}

export const config = { matcher: '/:path*' }
