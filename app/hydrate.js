'use client'
import { useEffect } from 'react'
export default function Hydrate() {
  useEffect(() => {
    performance.mark('hydrated')
    window.__hydrated = performance.getEntriesByName('hydrated')[0].startTime
  }, [])
  return <p id="hydrate-marker">hydration marker</p>
}
