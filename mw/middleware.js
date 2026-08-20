import { NextResponse } from 'next/server';

export function middleware(request) {
  const rewrite = request.nextUrl.searchParams.get('rewrite');
  if (!rewrite) return NextResponse.next();
  const url = new URL(rewrite);
  if (url.hostname === request.nextUrl.hostname) return NextResponse.next();
  return NextResponse.rewrite(url, { request });
}
