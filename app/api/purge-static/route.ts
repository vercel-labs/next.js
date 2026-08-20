import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  revalidatePath("/api/script");
  return NextResponse.json({ purged: "/api/script" });
}
