import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const tag = new URL(req.url).searchParams.get('tag') || 'tag1'
  revalidateTag(tag, 'max')
  return NextResponse.json({ revalidated: [tag], now: Date.now() })
}
