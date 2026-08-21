'use client'
import { useState } from 'react'
export default function Widget({ i }: { i: number }) {
  const [n, setN] = useState(i)
  return <button onClick={() => setN(n + 1)}>w{i}: {n}</button>
}
