'use client'

import { useEffect, useState } from 'react'

export function HydrationProbe() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return (
    <p id="hydration-state" style={{ color: hydrated ? 'green' : 'red' }}>
      hydration: {hydrated ? 'HYDRATED' : 'NOT HYDRATED'}
    </p>
  )
}
