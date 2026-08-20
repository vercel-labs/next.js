'use client'
import { useState } from 'react'

export default function Click() {
  const [clicks, setClicks] = useState(0)
  return (
    <button id="click" onClick={() => setClicks((c) => c + 1)}>
      Clicked {clicks}
    </button>
  )
}
