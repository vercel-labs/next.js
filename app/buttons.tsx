'use client'

import React from 'react'
import { withCookie, withoutCookie } from './actions'

export function Buttons() {
  const [time, setTime] = React.useState<string | number>('empty')
  return (
    <div>
      <button id="with" onClick={async () => setTime((await withCookie()).actionNow)}>
        action WITH cookies
      </button>
      <button id="without" onClick={async () => setTime((await withoutCookie()).actionNow)}>
        action WITHOUT cookies
      </button>
      <div id="client-state">client-state:{time}</div>
    </div>
  )
}
