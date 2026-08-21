import { NextRequest, NextResponse } from 'next/server'

// Two independent middleware, each forwarding its own request header,
// exactly as the docs' "Setting Headers" example shows.
function withAuth(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-session-id', 'abc')
  return NextResponse.next({ request: { headers } })
}

function withLocale(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-locale', 'en')
  return NextResponse.next({ request: { headers } })
}

export function middleware(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') ?? 'naive'

  if (mode === 'naive') {
    // Compose by calling both, then returning one response.
    // The other response's forwarded request headers are silently dropped.
    const authRes = withAuth(request)
    const i18nRes = withLocale(request)
    void authRes
    return i18nRes
  }

  if (mode === 'internal') {
    // Undocumented workaround: merge the internal
    // x-middleware-request-* / x-middleware-override-headers of both responses.
    const authRes = withAuth(request)
    const i18nRes = withLocale(request)
    const merged = NextResponse.next()
    const keys = new Set<string>()
    for (const res of [authRes, i18nRes]) {
      for (const key of (res.headers.get('x-middleware-override-headers') ?? '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)) {
        keys.add(key)
        const value = res.headers.get(`x-middleware-request-${key}`)
        if (value !== null) merged.headers.set(`x-middleware-request-${key}`, value)
      }
    }
    merged.headers.set('x-middleware-override-headers', [...keys].join(','))
    return merged
  }

  // Documented-by-nobody but working pattern: one shared Headers accumulator.
  const headers = new Headers(request.headers)
  headers.set('x-session-id', 'abc')
  headers.set('x-locale', 'en')
  return NextResponse.next({ request: { headers } })
}

export const config = { matcher: ['/', '/api/echo'] }
