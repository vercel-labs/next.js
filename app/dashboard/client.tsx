'use client'
import { useState } from 'react'
import { protectedAction } from '../actions'

export function Client() {
  const [state, setState] = useState('idle')
  return (
    <>
      <button
        id="set-cookie"
        onClick={() => {
          document.cookie = 'session=valid; path=/'
          setState('cookie-set')
        }}
      >
        set session cookie
      </button>
      <button
        id="clear-cookie"
        onClick={() => {
          document.cookie = 'session=; path=/; max-age=0'
          setState('cookie-cleared')
        }}
      >
        clear session cookie (simulate expiry)
      </button>
      <button
        id="run-action"
        onClick={async () => {
          setState('calling')
          try {
            const res = await protectedAction()
            setState('resolved: ' + JSON.stringify(res))
          } catch (e) {
            setState('threw: ' + (e instanceof Error ? e.message : String(e)))
          }
        }}
      >
        call server action
      </button>
      <pre id="state">{state}</pre>
    </>
  )
}
