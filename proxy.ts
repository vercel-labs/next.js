import createIntlMiddleware from 'next-intl/middleware'
import { defineRouting } from 'next-intl/routing'
import type { NextRequest } from 'next/server'

const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  localeDetection: false,
})

const intlMiddleware = createIntlMiddleware(routing)

export function proxy(request: NextRequest) {
  // Uncomment to observe the double invocation in the standalone runner:
  // one external `curl /beaches` logs `/beaches` AND `/de/beaches`.
  console.log('proxy invoked with', request.nextUrl.pathname)
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)'],
}
