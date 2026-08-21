import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE RUNNING:", request.nextUrl.pathname);
  const response = NextResponse.next();
  response.cookies.set("isGuest", "true", { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
