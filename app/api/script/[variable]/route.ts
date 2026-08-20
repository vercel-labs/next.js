import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ variable: string }> }
): Promise<NextResponse> {
  const { variable } = await ctx.params;
  return new NextResponse(`dynamic script ${variable} generated at ${Date.now()}`, {
    headers: {
      "Content-Type": "text/plain",
      "Vercel-CDN-Cache-Control": "max-age=86400",
      "CDN-Cache-Control": "max-age=86400",
    },
  });
}
