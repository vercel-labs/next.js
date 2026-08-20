'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Bug() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    console.log('[effect] searchParams:', searchParams.toString())
  }, [searchParams])

  useEffect(() => {
    if (Number(searchParams.get('foo')) >= 5) {
      window.history.replaceState(null, '', '?foo=bar')
      setTimeout(() => {
        router.refresh()
      }, 1000)
    }
  }, [searchParams])

  return (
    <main>
      <p id="sp">searchParams: {searchParams.toString()}</p>
      <button
        onClick={() => {
          window.history.replaceState(null, '', '?foo=' + Math.floor(Math.random() * 10))
        }}
      >
        Update `foo` as random
      </button>
    </main>
  )
}
