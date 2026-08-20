'use client'
import { useState } from 'react'
export default function Carousel() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>UNIQUE_MARKER_CAROUSEL {n}</button>
}
