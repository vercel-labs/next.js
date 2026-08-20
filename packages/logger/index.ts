import type { NextRequest } from 'next/server'

// Library compiled against next@13.4.12
export function withLogging(req: NextRequest) {
  return req.nextUrl.pathname
}
