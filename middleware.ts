import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  // @ts-expect-error encode is not in the public ResponseCookies option types
  res.cookies.set('mw_cookie', 'qwerty123=', { encode: String })
  return res
}

export const config = { matcher: ['/mw'] }
