'use client'

import { useRef, useState } from 'react'
import { addTodo } from './actions'

export default function Page() {
  const [log, setLog] = useState([])
  const controllerRef = useRef(null)
  const add = (m) => setLog((l) => [...l, `${new Date().toISOString()} ${m}`])

  async function run() {
    const controller = new AbortController()
    controllerRef.current = controller
    controller.signal.addEventListener('abort', () => add('client: signal aborted'))
    add('client: calling server action')
    try {
      // There is no documented way to pass a signal to a server action call.
      // Passing it as an argument is not possible (not serializable), so we
      // just abort the controller and observe the action keeps running.
      const res = await addTodo('buy milk')
      add(`client: action resolved -> ${JSON.stringify(res)}`)
    } catch (e) {
      add(`client: action threw -> ${e && e.name}: ${e && e.message}`)
    }
  }

  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <h1>Server action + AbortController</h1>
      <button id="start" onClick={run}>start action (10s)</button>
      <button id="abort" onClick={() => controllerRef.current?.abort()}>abort()</button>
      <pre id="log">{log.join('\n')}</pre>
    </main>
  )
}
