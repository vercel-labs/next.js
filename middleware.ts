import { NextResponse, type NextRequest } from "next/server";

// Host -> scope rewrite: external URL "/" is internally served by /site-a/en
export default function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/site-a/en${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
