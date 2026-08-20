import { NextResponse } from 'next/server'
export async function GET() {
  const data = Array(5000).fill({ id: 1, name: 'example' })
  return NextResponse.json(data)
}
