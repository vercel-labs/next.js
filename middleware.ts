import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log({
    PATH: req.nextUrl.pathname,
    HOST: req.headers.get("host"),
    X_FORWARDED_HOST: req.headers.get("x-forwarded-host"),
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
