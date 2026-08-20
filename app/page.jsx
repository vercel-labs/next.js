'use client'
import { useState } from 'react'

export default function Page() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>count {n}</button>
}
