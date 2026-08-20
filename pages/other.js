import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Other() {
  const [mode, setMode] = useState('(reading)')
  useEffect(() => setMode(history.scrollRestoration), [])
  return (
    <main style={{ fontFamily: 'system-ui', padding: 16 }}>
      <h1>Other page</h1>
      <p>
        history.scrollRestoration = <b>{mode}</b>
      </p>
      <p>Now swipe back from the left screen edge on iOS Safari/Chrome. The back
      snapshot of “Home” renders blank.</p>
      <Link href="/">back via router</Link>
    </main>
  )
}
