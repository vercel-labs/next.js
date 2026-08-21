'use client'
import { useState } from 'react'
import { receive } from './actions'

export default function Client({ size }) {
  const [out, setOut] = useState('')
  return (
    <div>
      <button id="submit" onClick={async () => {
        const payload = 'y'.repeat(size)
        try {
          const res = await receive(payload)
          setOut(JSON.stringify({ sent: payload.length, ...res }))
        } catch (e) {
          setOut('ERROR: ' + e.message)
        }
      }}>send</button>
      <pre id="result">{out}</pre>
    </div>
  )
}
