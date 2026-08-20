import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse, after } from "next/server";

export async function GET(req: NextRequest) {
  after(() => {
    setTimeout(() => {
      revalidatePath("/")
      console.log("revalidated in timeout inside after")
    }, 1000)
  })
  return NextResponse.json({ revalidated: true })
}
