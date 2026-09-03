'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLastEvent } from '../event-provider'

export default function RefreshConsumer({ ids }: { ids: string[] }) {
  const router = useRouter()
  const last = useLastEvent()
  const timer = useRef<any>(null)
  const scheduled = useRef(false)

  // Ask the server to mutate a visible row and broadcast an SSE message ~1s
  // after this route mounted.
  useEffect(() => {
    if (scheduled.current) return
    scheduled.current = true
    fetch('/api/schedule', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'row-1', delay: Number(new URLSearchParams(location.search).get('delay') || 1000) }),
    })
  }, [])

  // test hook: allows the harness to issue a manual retry refresh
  useEffect(() => {
    ;(window as any).__refresh = () => {
      ;(window as any).__refreshes = ((window as any).__refreshes || 0) + 1
      router.refresh()
    }
  }, [router])

  // Trailing coalescing window of ~400ms, then refresh().
  const idKey = ids.join(',')
  useEffect(() => {
    if (!last || !idKey.split(',').includes(last.id)) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      ;(window as any).__refreshes = ((window as any).__refreshes || 0) + 1
      ;(window as any).__refreshAt = Date.now()
      router.refresh()
    }, 400)
    return () => clearTimeout(timer.current)
  }, [last, idKey, router])

  return null
}
