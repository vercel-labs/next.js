'use client'

import { useEffect, useState } from 'react'

// `window.__sentinel` only survives soft (SPA) navigations. If a Link click
// performs a full document navigation the sentinel is destroyed with the
// document, which is how the bug is observed.
export default function Sentinel() {
  const [, force] = useState(0)
  useEffect(() => {
    const w = window as any
    if (!w.__sentinel) w.__sentinel = 'alive-' + Date.now()
    const t = setInterval(() => force((n) => n + 1), 250)
    return () => clearInterval(t)
  }, [])
  const marker =
    typeof document !== 'undefined' &&
    !!document.getElementById('__next-page-redirect')
  return (
    <pre data-testid="sentinel">
      sentinel: {typeof window === 'undefined' ? 'ssr' : String((window as any).__sentinel)}
      {'\n'}marker in document: {String(marker)}
    </pre>
  )
}
