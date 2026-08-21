import { NextResponse } from 'next/server'

// Runs on the Node.js runtime (proxy.js default in Next 16).
export const config = { matcher: ['/api/:path*', '/action'] }

export default async function proxy(request) {
  // Typical proxy work that needs to look at the request body.
  if (request.method === 'POST') {
    const text = await request.clone().text()
    const res = NextResponse.next()
    res.headers.set('x-proxy-read-bytes', String(text.length))
    return res
  }
  return NextResponse.next()
}
