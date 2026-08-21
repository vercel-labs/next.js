import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  revalidateTag('test-todo', 'max')
  return NextResponse.json({ revalidated: 'test-todo' })
}
