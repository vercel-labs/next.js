'use client'

import { useActionState } from 'react'
import { updateUser } from './actions'

export function BoundForm({ userId }) {
  // Binding additional arguments to a Server Function inside a Client
  // Component, as documented in the forms guide.
  const updateUserWithId = updateUser.bind(null, userId)
  const [state, formAction] = useActionState(updateUserWithId, 'initial-state')

  return (
    <form id="form" action={formAction}>
      <p id="form-state">{state}</p>
      <input id="name-input" name="name" />
      <button id="submit-form" type="submit">
        submit
      </button>
    </form>
  )
}
