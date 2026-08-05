'use client'

import { useEffect, useState } from 'react'

// Mirrors a real app: a client component that keeps polling a route handler
// while the page stays open, so requests are in flight across HMR updates.
export function Poller() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      fetch('/repeated-server-edits/ping')
        .then(() => setCount((current) => current + 1))
        .catch(() => {})
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p id="poller">client poller: {count}</p>
}
