import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// CONTROL CASE: same tags passed as fetch's second argument.
export async function GET() {
  const response = await fetch('http://localhost:4000/todo', {
    next: { tags: ['test-todo'], revalidate: 3600 },
  })
  return NextResponse.json(await response.json())
}
