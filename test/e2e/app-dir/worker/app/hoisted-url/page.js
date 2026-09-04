'use client'
import { useState } from 'react'

export default function Home() {
  const [state, setState] = useState('default')
  return (
    <div>
      <button
        onClick={() => {
          // The `new URL(..., import.meta.url)` is assigned to a variable
          // instead of being inlined into the `new Worker()` call.
          const workerUrl = new URL('../worker', import.meta.url)
          const worker = new Worker(workerUrl)
          worker.addEventListener('message', (event) => {
            setState(event.data)
          })
          worker.addEventListener('error', () => {
            setState('worker-error')
          })
        }}
      >
        Get web worker data
      </button>
      <p>Worker state: </p>
      <p id="worker-state">{state}</p>
    </div>
  )
}
