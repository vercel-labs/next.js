import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('[middleware]', request.method, request.nextUrl.pathname);
  // Simulates an auth/session check that wants to bounce POSTs (incl. Server Actions) to /login
  if (request.method === 'POST' && request.nextUrl.pathname !== '/login') {
    console.log('[middleware] -> NextResponse.redirect(/login)');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
