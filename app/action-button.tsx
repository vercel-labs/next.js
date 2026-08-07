'use client'
import { useState } from 'react'
import { ping } from './actions'

export default function ActionButton() {
  const [out, setOut] = useState('idle')
  return (
    <div>
      <button
        id="action"
        onClick={async () => {
          try {
            setOut('result: ' + (await ping()))
          } catch (e) {
            setOut('THREW: ' + (e as Error).message)
          }
        }}
      >
        run server action
      </button>
      <pre id="action-out">{out}</pre>
    </div>
  )
}
