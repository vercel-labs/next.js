'use client'

import { useState, useTransition } from 'react'
import { saveAndRevalidateHome, saveAndRevalidateOtherPath } from './actions'

export function Buttons() {
  const [msg, setMsg] = useState('')
  const [pending, start] = useTransition()
  return (
    <div>
      <button
        id="revalidate-other"
        onClick={() => start(async () => setMsg(await saveAndRevalidateOtherPath()))}
      >
        revalidatePath(&quot;/other&quot;)
      </button>
      <button
        id="revalidate-home"
        onClick={() => start(async () => setMsg(await saveAndRevalidateHome()))}
      >
        revalidatePath(&quot;/&quot;)
      </button>
      <p id="action-result">{pending ? 'pending' : msg}</p>
    </div>
  )
}
