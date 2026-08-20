import { NextRequest, NextResponse } from "next/server";

export const GET = (req: NextRequest) => {
  console.log("redirect called | _rsc =", req.nextUrl.searchParams.get("_rsc"));
  return NextResponse.json({ hello: "there" });
};
