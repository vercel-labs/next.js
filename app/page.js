'use client'

import { useState } from 'react'

export default function Page() {
  const [result, setResult] = useState('idle')
  return (
    <main>
      <h1>Issue 68015 reproduction</h1>
      <button
        id="push"
        onClick={() => {
          try {
            window.history.pushState('', null, '/help')
            setResult('ok: ' + window.location.pathname)
          } catch (e) {
            setResult('ERROR: ' + e.name + ': ' + e.message)
          }
        }}
      >
        pushState("", null, "/help")
      </button>
      <button
        id="replace"
        onClick={() => {
          try {
            window.history.replaceState('', null, '/help')
            setResult('ok: ' + window.location.pathname)
          } catch (e) {
            setResult('ERROR: ' + e.name + ': ' + e.message)
          }
        }}
      >
        replaceState("", null, "/help")
      </button>
      <pre id="result">{result}</pre>
    </main>
  )
}
