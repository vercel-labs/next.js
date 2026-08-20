import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") ?? "/";
  revalidatePath(path);
  return Response.json({ revalidated: path, now: Date.now() });
}
