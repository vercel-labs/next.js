import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TAGS = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']

async function get(tag: string) {
  const res = await fetch(`http://localhost:3001/fake-data?${tag}`, {
    cache: 'force-cache',
    next: { tags: [tag] },
  })
  return (await res.json()).now
}

export async function GET() {
  const out: Record<string, number> = {}
  for (const tag of TAGS) out[tag] = await get(tag)
  return NextResponse.json(out)
}
