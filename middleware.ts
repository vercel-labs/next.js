import { NextResponse } from "next/server";

export default async function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
