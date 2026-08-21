import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// BROKEN CASE: tags passed through the Request constructor.
// TypeScript accepts `next` here because Next.js augments RequestInit.
export async function GET() {
  const request = new Request('http://localhost:4000/todo', {
    next: { tags: ['test-todo'], revalidate: 3600 },
  })
  const response = await fetch(request)
  return NextResponse.json(await response.json())
}
