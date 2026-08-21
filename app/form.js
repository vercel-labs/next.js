'use client'

import { useTransition } from 'react'
import { slowAction } from './actions'

export default function Form() {
  const [pending, startTransition] = useTransition()
  return (
    <div>
      <button
        id="submit"
        onClick={() => startTransition(async () => { await slowAction() })}
      >
        Submit
      </button>
      <span id="status">{pending ? 'loading...' : 'idle'}</span>
    </div>
  )
}
