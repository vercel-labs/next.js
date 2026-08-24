'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [result, setResult] = useState('pending')

  useEffect(() => {
    try {
      // `Set.prototype.union` is part of `core-js/features/set`, which Next.js
      // documents as a default polyfill.
      const union = (new Set([1, 2, 3]) as any).union(new Set([1, 2]))
      setResult(String(union.size))
    } catch (err: any) {
      setResult(`error: ${err.message}`)
    }
  }, [])

  return <p id="result">{result}</p>
}
