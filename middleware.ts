// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const createNoCacheResponse = (response: NextResponse) => {
  response.headers.set("x-middleware-cache", "no-cache");
  return response;
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Simulate a flag that changes from false -> true
  // In real app: check database/cookie for user.isProcessingComplete
  const isProcessingComplete = request.cookies.get('processingComplete')?.value === 'true';
  console.log(request.cookies.get('processingComplete'));
  if (pathname === '/' && !isProcessingComplete) {
    // Redirect to /process if not complete
    console.log('Middleware: Redirecting / -> /process (not complete)');
    return createNoCacheResponse(NextResponse.redirect(new URL('/process', request.url)));
  }
  
  if (pathname === '/process' && isProcessingComplete) {
    // Redirect to / if complete
    console.log('Middleware: Redirecting /process -> / (complete)');
    return createNoCacheResponse(NextResponse.redirect(new URL('/', request.url)));
  }
  
  console.log(`Middleware: Allowing ${pathname}`);
  return createNoCacheResponse( NextResponse.next());
}

export const config = {
  matcher: ['/', '/process'],
};

