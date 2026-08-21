'use client'
// Any dependency that pulls in Node's `util` in client code (here directly for brevity)
import { promisify } from 'util'
import { useEffect, useState } from 'react'

export default function Client() {
  const [state, setState] = useState('pending')
  useEffect(() => {
    const fn = promisify((cb) => cb(null, 'ok'))
    fn().then((v) => setState('promisify: ' + v))
  }, [])
  return <p id="status">{state}</p>
}
