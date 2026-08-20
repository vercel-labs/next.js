import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  setTimeout(() => {
    revalidatePath("/")
    console.log("revalidated in timeout")
  }, 100)
  return NextResponse.json({ revalidated: true })
}
