import { NextResponse } from 'next/server';

export function middleware(request) {
  const sessionId = request.cookies.get('sessionId')?.value ?? 'generated-session-id';

  // Pattern A: clone headers, pass via NextResponse.next({ request: { headers } })
  if (request.nextUrl.pathname === '/a') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-session-id', sessionId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Pattern B: mutate request.headers in place, then NextResponse.next()
  if (request.nextUrl.pathname === '/b') {
    request.headers.set('x-session-id', sessionId);
    return NextResponse.next();
  }

  // Pattern C: pattern A + also set a cookie on the response
  if (request.nextUrl.pathname === '/c') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-session-id', sessionId);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set('sessionId', sessionId);
    return response;
  }

  // Pattern D: set the header on the RESPONSE only (common mistake)
  if (request.nextUrl.pathname === '/d') {
    const response = NextResponse.next();
    response.headers.set('x-session-id', sessionId);
    return response;
  }

  // Pattern E: NextResponse.next({ headers }) (not { request: { headers } })
  if (request.nextUrl.pathname === '/e') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-session-id', sessionId);
    return NextResponse.next({ headers: requestHeaders });
  }

  // Pattern F: set cookie on response only, page reads cookies()
  if (request.nextUrl.pathname === '/f') {
    const response = NextResponse.next();
    response.cookies.set('sessionId', sessionId);
    return response;
  }

  // Pattern G: request.cookies.set + NextResponse.next({ request: { headers } })
  if (request.nextUrl.pathname === '/g') {
    request.cookies.set('sessionId', sessionId);
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // Pattern H: request header override with a non x- camelCase name
  if (request.nextUrl.pathname === '/h') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('sessionId', sessionId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Patterns I/J: edge-runtime page + edge route handler; also override an existing header
  if (request.nextUrl.pathname === '/i' || request.nextUrl.pathname === '/j') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-session-id', sessionId);
    requestHeaders.set('user-agent', 'overridden-by-middleware');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Pattern K: rewrite with request header overrides
  if (request.nextUrl.pathname === '/k') {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-session-id', sessionId);
    return NextResponse.rewrite(new URL('/k-target', request.url), { request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = { matcher: ['/a', '/b', '/c', '/d', '/e', '/f', '/g', '/h', '/i', '/j', '/k'] };
