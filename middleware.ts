import { NextResponse } from 'next/server'

// Simulates Vercel's FUNCTION_INVOCATION_TIMEOUT (504) response for a Server Action POST.
export function middleware(request: Request) {
  if (request.method === 'POST' && request.headers.get('next-action')) {
    return new NextResponse('FUNCTION_INVOCATION_TIMEOUT', {
      status: 504,
      headers: { 'content-type': 'text/plain', 'x-vercel-error': 'FUNCTION_INVOCATION_TIMEOUT' },
    })
  }
  return NextResponse.next()
}
