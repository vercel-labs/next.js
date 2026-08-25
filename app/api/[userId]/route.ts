import { NextResponse } from 'next/server'

export async function PUT(
  _req: Request,
  ctx: { params: Promise<{ userId: string }> }
) {
  const { userId } = await ctx.params
  return NextResponse.json({ ok: true, userId, method: 'PUT' })
}
