'use client'
import Link from 'next/link'
export default function P() {
  return (
    <div>
      <h1 id="view">Page B</h1>
      <button id="push-c" onClick={() => window.history.pushState(null, '', '/c')}>pushState /c</button>
      <Link id="link-home" href="/">Link /</Link>
    </div>
  )
}
