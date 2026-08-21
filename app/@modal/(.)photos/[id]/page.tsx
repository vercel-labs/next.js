'use client'

import { useState } from 'react'

export default function PhotoModal() {
  // client component so a page chunk is emitted for this route segment
  const [open] = useState(true)
  return open ? <dialog open>modal</dialog> : null
}
