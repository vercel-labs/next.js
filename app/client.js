'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Client() {
  const router = useRouter()
  const [log, setLog] = useState([])
  const add = (line) => { console.log('[repro]', line); setLog((l) => [...l, line]) }

  async function run() {
    const start = Date.now()
    const returned = router.push('/slow')
    add(`typeof push() return = ${typeof returned}`)
    add(`push() returned a thenable = ${!!(returned && typeof returned.then === 'function')}`)
    // Awaiting a non-promise resolves immediately: navigation is NOT complete here.
    await returned
    add(`await push() resolved after ${Date.now() - start}ms`)
    add(`pathname after await = ${window.location.pathname}`)
  }

  return (
    <main>
      <h1>app router: next/navigation useRouter().push</h1>
      <button id="go" onClick={run}>
        push(&apos;/slow&apos;) and await it
      </button>
      <pre id="log">{log.join('\n')}</pre>
      <a href="/legacy">pages router comparison</a>
    </main>
  )
}
