import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-middleware-ran', request.nextUrl.pathname);
  console.log('[middleware] ran for', request.nextUrl.pathname);
  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|favicon.ico).*)',
    '/', // explicit matcher for root route
  ],
};
