import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ revalidated: false }, { status: 400 });
  }
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}
