'use client'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

async function failingMutation() {
  // 200 + error envelope, like a tRPC error response
  const res = await fetch('/api/fail', { method: 'POST' })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json
}

export function Reconcile() {
  const reconcile = useMutation({
    mutationFn: failingMutation,
    onError: (e) => console.log('[repro] onError', String(e)),
    onSettled: () => console.log('[repro] onSettled'),
  })
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true
    reconcile.mutate()
  }, [reconcile])

  return (
    <div>
      <p data-testid="effect-status">
        {reconcile.isPending
          ? 'pending'
          : reconcile.isError
            ? 'error'
            : reconcile.isSuccess
              ? 'success'
              : 'idle'}
      </p>
      <ClickVariant />
    </div>
  )
}

function ClickVariant() {
  const m = useMutation({ mutationFn: failingMutation })
  return (
    <div>
      <button data-testid="click-btn" onClick={() => m.mutate()}>
        run
      </button>
      <p data-testid="click-status">
        {m.isPending
          ? 'pending'
          : m.isError
            ? 'error'
            : m.isSuccess
              ? 'success'
              : 'idle'}
      </p>
    </div>
  )
}
