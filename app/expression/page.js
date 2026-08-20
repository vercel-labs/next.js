'use client'
import { useEffect, useState } from 'react'
import { initLibrary } from '../../lib/lib'

export default function Page() {
  const [state, setState] = useState('pending')
  useEffect(() => {
    initLibrary(true).then(
      (keys) => setState('ok: ' + keys.join(',')),
      (err) => setState('ERROR: ' + err.message)
    )
  }, [])
  return <p id="result">{state}</p>
}
