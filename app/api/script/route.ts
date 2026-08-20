import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return new NextResponse(`static script generated at ${Date.now()}`, {
    headers: {
      "Content-Type": "text/plain",
      "Vercel-CDN-Cache-Control": "max-age=86400",
      "CDN-Cache-Control": "max-age=86400",
    },
  });
}
