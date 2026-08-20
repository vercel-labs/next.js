'use client'
import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <h1 id="view">Home</h1>
      <button id="push-a" onClick={() => window.history.pushState(null, '', '/a')}>pushState /a</button>
      <button id="push-c" onClick={() => window.history.pushState(null, '', '/c')}>pushState /c</button>
      <Link id="link-b" href="/b">Link /b</Link>
    </div>
  )
}
