"use client"
import { useState } from "react"

export default function Toggle() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button id="toggle" onClick={() => setOpen((o) => !o)}>
        Open popover
      </button>
      {open ? <p id="popover">popover is open — the page is interactive</p> : null}
    </div>
  )
}
