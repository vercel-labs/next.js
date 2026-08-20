'use client'
import { useState } from 'react'
export default function Accordion() {
  const [open, setOpen] = useState(false)
  return <button onClick={() => setOpen(!open)}>UNIQUE_MARKER_ACCORDION {String(open)}</button>
}
