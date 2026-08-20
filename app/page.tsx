'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [variableStatus, setVariableStatus] = useState('pending')
  const [inlineStatus, setInlineStatus] = useState('pending')

  useEffect(() => {
    // Case A: URL stored in a variable first (issue #31009)
    try {
      const url = new URL('../workers/worker.ts', import.meta.url)
      const w = new Worker(url)
      w.onmessage = (e) => setVariableStatus('ok: ' + e.data)
      w.onerror = (e) => setVariableStatus('error: ' + (e.message || 'worker error'))
      w.postMessage('a')
    } catch (err: any) {
      setVariableStatus('throw: ' + err.message)
    }

    // Case B: everything inline (documented workaround)
    try {
      const w2 = new Worker(new URL('../workers/worker.ts', import.meta.url))
      w2.onmessage = (e) => setInlineStatus('ok: ' + e.data)
      w2.onerror = (e) => setInlineStatus('error: ' + (e.message || 'worker error'))
      w2.postMessage('b')
    } catch (err: any) {
      setInlineStatus('throw: ' + err.message)
    }
  }, [])

  return (
    <main>
      <p id="variable">variable-url: {variableStatus}</p>
      <p id="inline">inline-url: {inlineStatus}</p>
    </main>
  )
}
