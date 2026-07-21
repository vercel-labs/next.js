'use client'

import { useState } from 'react'
import { createWorker } from 'worker-package'

export default function Page() {
  const [state, setState] = useState('default')

  return (
    <>
      <button
        onClick={() => {
          try {
            const worker = createWorker()
            worker.addEventListener('message', (event) => {
              setState(event.data)
            })
            worker.addEventListener('error', (event) => {
              setState(`error: ${event.message}`)
            })
          } catch (error) {
            setState(`error: ${error.message}`)
          }
        }}
      >
        Start worker
      </button>
      <p id="worker-state">{state}</p>
    </>
  )
}
