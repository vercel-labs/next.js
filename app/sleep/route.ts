import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function GET(req: NextRequest) {
  await sleep(100); revalidatePath("/")
  console.log("revalidated in sleep")
  return NextResponse.json({ revalidated: true })
}
