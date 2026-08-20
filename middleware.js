import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = new URL(request.url)
  const res =
    url.pathname === '/external'
      ? NextResponse.rewrite(new URL('http://localhost:4000/'))
      : NextResponse.rewrite(new URL('/api/origin', request.url))

  res.headers.set('x-added-by-middleware', 'added')
  res.headers.set('x-modify-me', 'modified-by-middleware')
  res.headers.set('cache-control', 'no-store')
  res.headers.delete('x-remove-me')
  return res
}

export const config = { matcher: ['/proxy', '/external'] }
