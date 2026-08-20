'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'

export function RedirectingClient() {
  const [go, setGo] = useState(false)
  if (go) {
    // Documented as supported: redirect() called during render of a Client Component
    redirect('/target')
  }
  return (
    <button id="go" onClick={() => setGo(true)}>
      redirect during render
    </button>
  )
}
