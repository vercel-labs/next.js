import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await new Promise<void>((res) => setTimeout(() => {
    revalidatePath("/")
    console.log("revalidated in timeout")
    res();
  }, 1000))
  return NextResponse.json({ revalidated: true })
}
