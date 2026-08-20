'use client'
import { useActionState } from 'react'
export default function BindForm({ action }) {
  const [state, formAction, pending] = useActionState(action, {})
  return (
    <form action={formAction} id="bind-form">
      <input name="message" defaultValue="hi" />
      <button type="submit">send</button>
      <pre>{JSON.stringify(state)}{String(pending)}</pre>
    </form>
  )
}
