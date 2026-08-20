import { NextResponse } from 'next/server'

export function middleware() {
  const info = {
    MY_SECRET: process.env.MY_SECRET ?? null,
    MY_SECRET_dynamic: process.env['MY_SECRET'] ?? null,
    NEXT_PUBLIC_MY_PUBLIC: process.env.NEXT_PUBLIC_MY_PUBLIC ?? null,
    VERCEL: process.env.VERCEL ?? null,
  }
  console.log('[middleware]', JSON.stringify(info))
  return NextResponse.json(info)
}

export const config = { matcher: '/mw' }
