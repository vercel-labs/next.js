'use client'

import { useState } from 'react'
import { login } from './actions'

export default function Page() {
  const [result, setResult] = useState('(not submitted)')
  return (
    <main>
      <button
        id="login"
        onClick={async () => {
          try {
            const res = await login()
            setResult('ok: ' + res.message)
          } catch (e: any) {
            setResult('caught: ' + e.message + ' | digest: ' + e.digest)
          }
        }}
      >
        login
      </button>
      <pre id="result">{result}</pre>
    </main>
  )
}
