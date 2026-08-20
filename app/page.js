'use client'
import { useState } from 'react'

export default function Page() {
  const [lines, setLines] = useState([])
  async function stream() {
    setLines([])
    const t0 = Date.now()
    const res = await fetch('/api/basicStream')
    const reader = res.body.getReader()
    const dec = new TextDecoder()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      setLines((p) => [...p, `+${Date.now() - t0}ms ${dec.decode(value, { stream: true }).trim()}`])
    }
  }
  return (
    <main>
      <button id="stream" onClick={stream}>stream</button>
      <pre id="out">{lines.join('\n')}</pre>
    </main>
  )
}
