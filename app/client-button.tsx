'use client'

import { useState } from 'react'

export function ClientButton({ action }: { action: () => Promise<string> }) {
  const [result, setResult] = useState('idle')
  return (
    <button
      id="run"
      onClick={async () => {
        try {
          setResult(await action())
        } catch (e) {
          setResult('client error: ' + (e as Error).message)
        }
      }}
    >
      run action ({result})
    </button>
  )
}
