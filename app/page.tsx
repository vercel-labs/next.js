'use client'

import { useState } from 'react'
import { testAction } from './actions'

export default function Page() {
  const [out, setOut] = useState('idle')
  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <button
        id="run"
        onClick={async () => {
          setOut('running')
          try {
            const res = await testAction()
            setOut('RESOLVED: ' + JSON.stringify(res))
          } catch (e: any) {
            setOut('THREW: ' + (e?.message ?? String(e)))
          }
        }}
      >
        Test Action
      </button>
      <pre id="out">{out}</pre>
    </main>
  )
}
