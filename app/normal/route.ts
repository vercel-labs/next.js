import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  revalidatePath("/")
  console.log("revalidated regular")
  return NextResponse.json({ revalidated: true })
}
