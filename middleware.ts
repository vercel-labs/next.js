import { NextRequest, NextResponse } from 'next/server'
import { trace } from '@opentelemetry/api'

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}

export function middleware(req: NextRequest) {
  const ctx = trace.getActiveSpan()?.spanContext()
  console.log(
    'MIDDLEWARE',
    JSON.stringify({
      path: req.nextUrl.pathname,
      traceId: ctx?.traceId ?? null,
      spanId: ctx?.spanId ?? null,
    })
  )
  // i18n-style rewrite: / -> /da
  if (req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/da'
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}
