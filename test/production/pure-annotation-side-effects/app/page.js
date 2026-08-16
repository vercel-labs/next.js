'use client'

import { useEffect, useState } from 'react'
import { startTicking } from './keep-names'

export default function Page() {
  const [state, setState] = useState('pending')

  useEffect(() => {
    let observed = 'no callback'
    const ticks = startTicking((value) => {
      observed = `callback ${value}`
    })
    setState(`ticks ${ticks} / ${observed}`)
  }, [])

  return <p id="result">{state}</p>
}
