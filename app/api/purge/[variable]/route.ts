import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ variable: string }> }
): Promise<NextResponse> {
  const { variable } = await ctx.params;
  revalidatePath(`/api/script/${variable}`);
  return NextResponse.json({ purged: `/api/script/${variable}` });
}
