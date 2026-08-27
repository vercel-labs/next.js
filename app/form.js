'use client'
import { useActionState, useId, Suspense } from 'react'
import { publish } from './actions'
import { LazyBox } from './lazy'

export function Form({ badge, children }) {
  const [state, dispatch, isPending] = useActionState(publish, null)
  const id = useId()
  return (
    <form action={dispatch} data-fid={id}>
      <input name="name" defaultValue="x" />
      <Suspense fallback={<span>s-fallback</span>}>{badge}</Suspense>
      <Suspense fallback={<span>s2</span>}>{children}</Suspense>
      <LazyBox label="lazybox" />
      <button id="submit" type="submit">{isPending ? 'Saving…' : 'Publish'}</button>
      <p id="state">{state ? JSON.stringify(state) : 'idle'}</p>
      <p id="pending">{isPending ? 'pending' : 'settled'}</p>
    </form>
  )
}
