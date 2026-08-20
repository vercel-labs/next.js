import {NextRequest, NextResponse} from 'next/server';
import {COOKIE_NAME} from './i18n';

export function middleware(request: NextRequest) {
  const locale = request.cookies.get(COOKIE_NAME)?.value || 'en';
  console.log(locale);
  return NextResponse.next();
}
