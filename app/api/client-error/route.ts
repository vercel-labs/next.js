import type { NextRequest } from 'next/server'

// Client errors are beaconed here so that they land in the server log, which
// makes the repro observable in browsers that cannot be driven by CDP.
export function GET(request: NextRequest) {
  const message = request.nextUrl.searchParams.get('m')
  console.error('[client-error]', message)
  return new Response(null, { status: 204 })
}
