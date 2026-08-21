'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [ff, setFf] = useState('')
  useEffect(() => {
    setFf(getComputedStyle(document.body).fontFamily)
  }, [])
  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <h1>next#74134 — adjustFontFallback: false</h1>
      <p>computed body font-family: <b id="ff">{ff}</b></p>
      <p>Expected (webpack): <code>Inter</code></p>
      <p>Turbopack bug: <code>Inter, Inter Fallback</code></p>
    </main>
  )
}
