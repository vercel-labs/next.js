import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.json({ success: true })
  response.cookies.set({ name: 'sessionToken', value: 'loggedin', path: '/' })
  return response
}
