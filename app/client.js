'use client'
import { useState } from 'react'
export default function Client() {
  const [n, setN] = useState(0)
  return <button data-v="1" className="text-blue-500" onClick={() => setN(n + 1)}>count {n}</button>
}
