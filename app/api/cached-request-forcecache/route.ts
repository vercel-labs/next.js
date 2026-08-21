import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// BROKEN CASE 2: `cache: 'force-cache'` survives the Request constructor, so the
// response IS cached, but `next.tags` is dropped -> the cache entry has tags: []
// and revalidateTag('test-todo') can never invalidate it.
export async function GET() {
  const request = new Request('http://localhost:4000/todo', {
    cache: 'force-cache',
    next: { tags: ['test-todo'] },
  })
  const response = await fetch(request)
  return NextResponse.json(await response.json())
}
