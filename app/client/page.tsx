'use client'

import { useEffect, useState } from 'react'

export default function ClientPage() {
  const [result, setResult] = useState('(running)')
  const [caps, setCaps] = useState('')

  useEffect(() => {
    setCaps(
      `URL.parse=${typeof (URL as any).parse} URL.canParse=${typeof (URL as any).canParse}`
    )
    try {
      setResult('ok: ' + (URL as any).parse('https://vercel.com').hostname)
    } catch (err) {
      setResult('ERROR: ' + (err as Error).message)
    }
  }, [])

  return (
    <main>
      <h1>client URL.parse()</h1>
      <p id="caps">{caps}</p>
      <p id="result">{result}</p>
    </main>
  )
}
