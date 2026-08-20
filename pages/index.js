import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mode, setMode] = useState('(reading)')
  useEffect(() => setMode(history.scrollRestoration), [])
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Home</h1>
      <p>
        history.scrollRestoration = <b id="sr-value">{mode}</b>
      </p>
      <p>Scroll to the bottom, tap “GO COLL”, then swipe back from the left edge (iOS).</p>
      <div style={{ height: '400vh', background: 'linear-gradient(#fca, #acf)' }} />
      <Link href="/other" id="go" style={{ fontSize: 32 }}>
        GO COLL
      </Link>
      <div style={{ height: '20vh' }} />
    </main>
  )
}
