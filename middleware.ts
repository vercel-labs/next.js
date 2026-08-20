import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  console.log(
    JSON.stringify({
      tag: 'MIDDLEWARE',
      method: request.method,
      url: request.nextUrl.pathname,
      isServerAction: request.headers.get('next-action') !== null,
      requestCookieFoo: request.cookies.get('foo')?.value ?? null,
      responseHasFoo: response.cookies.has('foo'),
      responseCookies: response.cookies.getAll(),
    })
  )
  return response
}

export const config = { matcher: '/:path*' }
