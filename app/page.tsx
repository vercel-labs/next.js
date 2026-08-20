'use client'

import { useState } from 'react'
import { slowAction } from './actions'

export default function Page() {
  const [result, setResult] = useState('idle')

  async function start() {
    setResult('running...')
    const t0 = Date.now()
    await Promise.all([slowAction('A'), slowAction('B')])
    const total = Date.now() - t0
    setResult(`Promise.all of two 1s server actions took ${total}ms`)
  }

  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <button id="start" onClick={start}>
        start
      </button>
      <pre id="result">{result}</pre>
    </main>
  )
}
