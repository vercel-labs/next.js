import { NextResponse } from "next/server";
export function middleware(request) {
  if (request.nextUrl.pathname === "/redirectMe") {
    return NextResponse.redirect(new URL("/new", request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/redirectMe"] };
