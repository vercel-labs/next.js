import { type NextRequest, NextResponse } from "next/server";

const locales = ["de", "en"] as const;

export const config = {
  matcher: ["/", `/(${locales.join("|")})/:path*`],
};

export default function middleware(request: NextRequest) {
  return NextResponse.next();
}
