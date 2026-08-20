'use client'
import { revalidateTodos } from './actions'

export function Form() {
  return (
    <form action={revalidateTodos}>
      <button id="revalidate-todos" type="submit">
        revalidateTag(&apos;todos&apos;)
      </button>
    </form>
  )
}
