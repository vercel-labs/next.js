import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Issue 62507: is `request.geo` observable/mockable in an e2e test?
  return NextResponse.json({
    geo: request.geo,
    ip: request.ip,
    nextUrlPathname: request.nextUrl.pathname,
    vercelIpHeaders: {
      country: request.headers.get('x-vercel-ip-country'),
      city: request.headers.get('x-vercel-ip-city'),
      region: request.headers.get('x-vercel-ip-country-region'),
      latitude: request.headers.get('x-vercel-ip-latitude'),
      longitude: request.headers.get('x-vercel-ip-longitude'),
    },
  })
}

export const config = { matcher: '/geo' }
