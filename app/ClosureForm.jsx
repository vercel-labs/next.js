'use client'
import { useActionState } from 'react'
export default function ClosureForm({ action }) {
  const [state, formAction] = useActionState(action, {})
  return (
    <form action={formAction} id="closure-form">
      <input name="message" defaultValue="hi" />
      <button type="submit">send</button>
      <pre>{JSON.stringify(state)}</pre>
    </form>
  )
}
