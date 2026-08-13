'use client'

import { useEffect, useState } from 'react'
import { payload } from './payload'

export default function PayloadLength() {
  const [length, setLength] = useState(0)
  useEffect(() => {
    setLength(payload.length)
  }, [])
  return <p id="payload-length">{length}</p>
}
