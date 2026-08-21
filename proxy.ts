import { NextResponse, type NextRequest } from 'next/server'
import { getTenantConfig } from './lib/config'

export async function proxy(request: NextRequest) {
  const config = await getTenantConfig()
  const res = NextResponse.next()
  res.headers.set('x-tenant', config.tenant)
  return res
}

export const config = {
  matcher: ['/proxied'] // '/' is not proxied, so the same cached fn works there,
}
