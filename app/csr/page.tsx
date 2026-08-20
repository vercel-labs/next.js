'use client'

import { useEffect, useState } from 'react'

// Same markup, but only rendered on the client (not present in SSR HTML).
export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <details open onToggle={() => console.log('TOGGLE_FIRED')}>
      <summary>summary</summary>
      content
    </details>
  )
}
