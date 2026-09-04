import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // nonce-based style-src: 'unsafe-inline' would be ignored by the browser
    `style-src 'self' 'nonce-${nonce}'`,
  ]

  // /strict/* is served WITHOUT `style-src-attr`, so `style-src` also governs
  // style attribute / CSSOM writes. Everything else gets the policy from the
  // issue report, which includes `style-src-attr 'unsafe-inline'`.
  if (!request.nextUrl.pathname.startsWith('/strict')) {
    directives.push(`style-src-attr 'unsafe-inline'`)
  }

  const csp = directives.join('; ')

  // Next.js reads the nonce from the CSP header on the *request*
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
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
