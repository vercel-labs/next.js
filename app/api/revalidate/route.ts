import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
  for (const tag of tags) revalidateTag(tag, 'max')
  return NextResponse.json({ revalidated: tags, now: Date.now() })
}
