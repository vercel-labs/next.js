import { NextResponse } from "next/server";

// Serves a strict, nonce-based CSP on every response.
// `style-src` carries a nonce (so 'unsafe-inline' would be ignored anyway) and
// attribute styles are separately allowed via `style-src-attr 'unsafe-inline'`.
export default function proxy(req: Request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "style-src-attr 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  // Required so that Next.js applies the nonce to the scripts it renders.
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
