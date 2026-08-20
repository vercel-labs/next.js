import { NextResponse } from 'next/server';
export function middleware(request) {
  const { locale, pathname, search } = request.nextUrl;
  if (locale === 'default' && !/\.(.*)$/.test(pathname)) {
    return NextResponse.redirect(new URL(`/en${pathname}${search}`, request.url));
  }
  return NextResponse.next();
}
