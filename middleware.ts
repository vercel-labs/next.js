import { NextResponse } from 'next/server'

export function middleware() {
  const res = NextResponse.next()
  res.headers.set('x-mw', '1')
  return res
}
