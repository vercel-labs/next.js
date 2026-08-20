'use client'
import { useState, useTransition } from 'react'
import { increment } from './actions'

export default function Counter() {
  const [n, setN] = useState(0)
  const [pending, setPending] = useState(false)
  const [log, setLog] = useState<string[]>([])

  async function run() {
    setPending(true)
    setLog((l) => [...l, 'calling action'])
    const next = await increment(n)
    setLog((l) => [...l, 'action resolved: ' + next])
    setN(next)
    setPending(false)
  }

  return (
    <div>
      <button id="run" onClick={run}>
        call server action
      </button>
      <p id="state">n={n} pending={String(pending)}</p>
      <pre id="log">{log.join('\n')}</pre>
    </div>
  )
}
