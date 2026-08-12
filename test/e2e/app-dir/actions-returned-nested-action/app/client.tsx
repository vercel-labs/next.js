'use client'

import { useRef, useState, useTransition } from 'react'

type Outer = (prefix: string) => Promise<(value: string) => Promise<string>>
type Inner = Awaited<ReturnType<Outer>>

export function ReturnedNestedAction({ outer }: { outer: Outer }) {
  const innerRef = useRef<Inner | null>(null)
  const [status, setStatus] = useState('idle')
  const [isPending, startTransition] = useTransition()

  function getInner() {
    startTransition(async () => {
      try {
        innerRef.current = await outer('captured')
        setStatus(`stored:${typeof innerRef.current}`)
      } catch (error) {
        setStatus(`outer-error:${formatError(error)}`)
      }
    })
  }

  function callInner() {
    startTransition(async () => {
      try {
        if (!innerRef.current) throw new Error('inner is not stored')
        setStatus(`result:${await innerRef.current('client')}`)
      } catch (error) {
        setStatus(`inner-error:${formatError(error)}`)
      }
    })
  }

  return (
    <>
      <button id="get-inner" disabled={isPending} onClick={getInner}>
        Get inner
      </button>
      <button id="call-inner" disabled={isPending} onClick={callInner}>
        Call inner
      </button>
      <output id="status">{status}</output>
    </>
  )
}

function formatError(error: unknown) {
  return error instanceof Error
    ? `${error.name}:${error.message}`
    : String(error)
}
