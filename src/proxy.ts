import { geolocation } from "@vercel/functions";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);

  const { country } = geolocation(req);
  if (process.env.NODE_ENV === "production" && country) {
    requestHeaders.set("x-geo-country", country);
  }

  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/v1/")) {
    url.pathname = url.pathname.replace("/v1/", "/api/trpc/");
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/v1/(.*)",
    // Always run for dashboard routes
    "/",
  ],
};
