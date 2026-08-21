'use client'

import { useState } from 'react'

// Lets you flip the document direction live on the deployed demo.
// It only writes on click, so tests can set `dir` themselves.
export function DirToggle() {
  const [, force] = useState(0)
  const dir =
    typeof document === 'undefined' ? '' : document.documentElement.dir || 'ltr'
  return (
    <p>
      <button
        id="toggle-dir"
        onClick={() => {
          document.documentElement.dir = dir === 'rtl' ? 'ltr' : 'rtl'
          force((n) => n + 1)
        }}
        style={{ padding: '8px 12px', fontSize: 16 }}
        suppressHydrationWarning
      >
        dir = {dir || '…'} (click to switch)
      </button>
    </p>
  )
}
