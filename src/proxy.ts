import { NextRequest, NextResponse } from 'next/server';

const localeConfig = {
  locales: ['en-US', 'nl-NL'],
  defaultLocale: 'en-US',
  domains: [
    { domain: 'en.example.local', locale: 'en-US' },
    { domain: 'nl.example.local', locale: 'nl-NL' },
  ],
};

function getLocaleFromHost(host: string | null): string {
  if (!host) return localeConfig.defaultLocale;

  const hostname = host.split(':')[0]; // Remove port
  const domainConfig = localeConfig.domains.find(d => d.domain === hostname);

  return domainConfig?.locale || localeConfig.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /test route (App Router) - let Pages Router handle /
  if (pathname === '/' || pathname === '') {
    return NextResponse.next();
  }

  // Skip proxy for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = localeConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Get locale from domain
  const host = request.headers.get('host');
  const locale = getLocaleFromHost(host);

  // Rewrite to include locale in path
  const rewriteUrl = new URL(`/${locale}${pathname}`, request.url);

  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    // Only match /test routes for App Router
    '/test/:path*',
  ],
};
