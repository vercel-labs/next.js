import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Variant reported in the issue thread: purge using the route template path.
export async function GET(): Promise<NextResponse> {
  revalidatePath("/api/script/[variable]", "page");
  return NextResponse.json({ purged: "/api/script/[variable]" });
}
