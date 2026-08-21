'use client'

// Reproduction for vercel/next.js#87012
// An `async` Client Component. The build succeeds (no static-analysis error),
// but in the browser React re-renders the async component forever, so the
// fetch below is re-issued in an infinite loop.
export default async function BugPage() {
  if (typeof window === 'undefined') {
    // skip during SSR: relative fetch URLs are not valid on the server
    return <p>ssr</p>
  }
  const res = await fetch('/api/data')
  const data = await res.json()
  return <pre>{JSON.stringify(data)}</pre>
}
