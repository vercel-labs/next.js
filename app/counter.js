'use client'
import { useState, useEffect } from 'react'

export default function Counter() {
  const [n, setN] = useState(0)
  useEffect(() => {
    debugger // line 8: should pause when devtools/CDP debugger attached
    window.__CLIENT_EFFECT_RAN = true
  }, [])
  return <button onClick={() => setN(n + 1)}>count {n}</button>
}
