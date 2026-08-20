import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Legacy() {
  const router = useRouter()
  const [log, setLog] = useState([])
  const add = (line) => { console.log('[repro]', line); setLog((l) => [...l, line]) }

  async function run() {
    const start = Date.now()
    const returned = router.push('/legacy-slow')
    add(`typeof push() return = ${typeof returned}`)
    add(`push() returned a thenable = ${!!(returned && typeof returned.then === 'function')}`)
    await returned
    add(`await push() resolved after ${Date.now() - start}ms`)
    add(`pathname after await = ${window.location.pathname}`)
  }

  return (
    <main>
      <h1>pages router: next/router useRouter().push</h1>
      <button id="go" onClick={run}>push(&apos;/legacy-slow&apos;) and await it</button>
      <pre id="log">{log.join('\n')}</pre>
    </main>
  )
}
