'use client'
import { useState } from 'react'
import { ping } from './actions'

export default function ActionButton() {
  const [result, setResult] = useState('')
  return (
    <div>
      <button
        id="action"
        onClick={async () => {
          setResult(await ping())
        }}
      >
        run server action
      </button>
      <pre id="result">{result}</pre>
    </div>
  )
}
