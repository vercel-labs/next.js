'use client'
import { toggleDraftMode } from './actions'
export function Toggle() {
  return (
    <form action={toggleDraftMode}>
      <button id="toggle" type="submit">Toggle draft mode</button>
    </form>
  )
}
