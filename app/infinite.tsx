'use client'
import { useEffect, useRef, useState } from 'react'
import { increment } from './actions'

export default function Infinite() {
  const [items, setItems] = useState<number[]>([])
  const [fetching, setFetching] = useState(false)
  const done = useRef(false)

  // mimic tanstack useInfiniteQuery + intersection observer effect:
  // trigger next fetch whenever we are not currently fetching
  useEffect(() => {
    if (fetching || items.length >= 3 || done.current) return
    setFetching(true)
    console.log('[client] fetching page', items.length)
    increment(items.length).then((n) => {
      console.log('[client] resolved page', n)
      setItems((i) => [...i, n])
      setFetching(false)
    })
  }, [fetching, items])

  return (
    <div>
      <p id="inf-state">
        items={items.length} fetching={String(fetching)}
      </p>
    </div>
  )
}
