'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/sse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar' }),
      signal: ctrl.signal,
    })
      .then(async (res) => {
        const reader = res.body.getReader()
        while (true) {
          const { done } = await reader.read()
          if (done) break
          setN((v) => v + 1)
        }
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])
  return <div id="chunks">chunks: {n}</div>
}
