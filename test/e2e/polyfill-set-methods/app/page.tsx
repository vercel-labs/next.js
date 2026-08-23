'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  // Computed on the client only, so the assertion is about the browser
  // bundle/polyfills and not about the Node.js version used for SSR.
  const [result, setResult] = useState<string>('pending')

  useEffect(() => {
    const union = new Set([1, 2, 3]).union(new Set([1, 2, 4]))
    setResult(String(union.size))
  }, [])

  return <p id="result">{result}</p>
}
