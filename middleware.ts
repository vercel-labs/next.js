import { NextResponse } from "next/server";

export default async function middleware() {
  const response = NextResponse.next();
  response.cookies.set("middleware-repro", "from-middleware");
  return response;
}

export const config = { matcher: "/:path*" };
