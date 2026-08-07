'use client'
import { useState } from 'react'
import { ping } from './actions'

export default function ActionButton() {
  const [state, setState] = useState('idle')
  return (
    <>
      <button
        id="action"
        onClick={async () => {
          try {
            setState('result: ' + (await ping()))
          } catch (e) {
            setState('threw: ' + (e && e.message))
          }
        }}
      >
        run server action
      </button>
      <p id="action-state">{state}</p>
    </>
  )
}
