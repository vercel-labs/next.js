import { NextResponse } from 'next/server';

export function middleware(request) {
  const raw = request.nextUrl.searchParams.get('mw');
  const res = NextResponse.next();
  if (raw) {
    try {
      res.headers.set('X-Middleware-Reflected', raw);
    } catch (err) {
      res.headers.set('X-Middleware-Error', err.name);
    }
  }
  return res;
}
export const config = { matcher: '/:path*' };
