import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Control: proves revalidatePath itself works in this deployment (ISR page re-renders).
export async function GET(): Promise<NextResponse> {
  revalidatePath("/cached");
  return NextResponse.json({ purged: "/cached" });
}
