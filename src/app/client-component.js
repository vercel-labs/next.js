'use client'

import { useState } from 'react'
// This import alone breaks the build/dev compile, even though
// `serverUtils` (which imports next/headers) is only reachable
// through a `typeof window === 'undefined'` dynamic import.
import { getCookies } from '../lib/isomorphic'

export default function ClientComponent() {
  const [value, setValue] = useState('')
  return (
    <button onClick={async () => setValue(await getCookies())}>
      cookies: {value}
    </button>
  )
}
