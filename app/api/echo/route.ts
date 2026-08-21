import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  return NextResponse.json({
    'x-session-id': request.headers.get('x-session-id'),
    'x-locale': request.headers.get('x-locale'),
  })
}
