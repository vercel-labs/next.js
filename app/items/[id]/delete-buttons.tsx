'use client'

import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { deleteItemAction, deleteItemAndRedirectAction } from '../../actions'

export default function DeleteButtons({ id }: { id: string }) {
  const router = useRouter()
  return (
    <div>
      <button
        id="delete-push"
        onClick={async () => {
          await deleteItemAction(id)
          startTransition(() => {
            router.push('/')
          })
        }}
      >
        Delete with client-side router.push - Bug
      </button>
      <button
        id="delete-redirect"
        onClick={() => {
          startTransition(() => {
            deleteItemAndRedirectAction(id)
          })
        }}
      >
        Delete with server-side redirect - OK
      </button>
    </div>
  )
}
