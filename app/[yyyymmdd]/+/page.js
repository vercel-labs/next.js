'use client'
import { useState } from 'react'
export default function Plus({ params }) {
  const [n, setN] = useState(0)
  return <h1 id="plus-page" onClick={() => setN(n+1)}>Plus page client {n}</h1>
}
