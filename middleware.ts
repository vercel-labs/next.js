import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(
    '[middleware]',
    JSON.stringify({
      path: request.nextUrl.pathname,
      rsc: request.headers.get('rsc'),
      'next-router-prefetch': request.headers.get('next-router-prefetch'),
      'next-router-state-tree': request.headers.get('next-router-state-tree')
        ? '<present>'
        : null,
      purpose: request.headers.get('purpose'),
      'sec-purpose': request.headers.get('sec-purpose'),
    })
  )
  return NextResponse.next()
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
