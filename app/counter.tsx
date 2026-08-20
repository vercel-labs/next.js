'use client'
import { useState, useEffect } from 'react'

export default function Counter() {
  const [n, setN] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return (
    <div>
      <p id="hydrated">hydrated: {String(hydrated)}</p>
      <button id="inc" onClick={() => setN(n + 1)}>count {n}</button>
    </div>
  )
}
