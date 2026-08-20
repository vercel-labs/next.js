import { NextRequest, NextResponse } from 'next/server'
import { geolocation, ipAddress } from '@vercel/functions'

export function middleware(request: NextRequest) {
  return NextResponse.json({
    // @ts-expect-error removed in Next 15
    legacyGeo: request.geo,
    geolocation: geolocation(request),
    ip: ipAddress(request) ?? null,
  })
}
export const config = { matcher: '/geo' }
