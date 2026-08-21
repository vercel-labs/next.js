import { NextResponse } from 'next/server'
export function proxy(request) {
  console.log('[repro:mw] incoming =', request.headers.get('cookie'))
  request.cookies.set('mw', '1')
  console.log('[repro:mw] after set =', request.headers.get('cookie'))
  return NextResponse.next({ request: { headers: request.headers } })
}
export const config = { matcher: ['/'] }
