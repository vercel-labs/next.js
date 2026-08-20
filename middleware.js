import { cache } from 'react'
import { NextResponse } from 'next/server'

let calls = 0
const getData = cache(async (key) => {
  calls++
  console.log(`[middleware] getData executed: call #${calls} (key=${key})`)
  return { key, calls }
})

export default async function middleware(request) {
  console.log('--- middleware start for', request.nextUrl.pathname, '---')
  const a = await getData('same-key')
  const b = await getData('same-key')
  console.log('[middleware] results', JSON.stringify(a), JSON.stringify(b))
  console.log('[middleware] total executions of cached fn so far:', calls)

  // fetch dedupe / data cache check
  const url = 'https://example.com/'
  const r1 = await fetch(url, { next: { revalidate: 3600 } })
  const r2 = await fetch(url, { next: { revalidate: 3600 } })
  console.log('[middleware] fetch cache headers:', r1.headers.get('x-nextjs-cache'), r2.headers.get('x-nextjs-cache'))

  const res = NextResponse.next()
  res.headers.set('x-cached-fn-executions', String(calls))
  return res
}

export const config = { matcher: '/' }
