'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const Refresh = ({ key1, key2 }: { key1: string; key2: string }) => {
  const router = useRouter()
  const [clickedAt, setClickedAt] = useState<number | null>(null)

  const go = (href: string) => {
    setClickedAt(Date.now())
    router.replace(href)
  }

  const rnd = () => Math.ceil(Math.random() * 1e6)

  return (
    <div>
      <button id="key1" onClick={() => go(`/?key1=${rnd()}&key2=${key2}`)}>
        Refresh via router key 1
      </button>
      <button id="key2" onClick={() => go(`/?key1=${key1}&key2=${rnd()}`)}>
        Refresh via router key 2
      </button>
      <button id="both" onClick={() => go(`/?key1=${rnd()}&key2=${rnd()}`)}>
        Refresh via router (both)
      </button>
      <div id="clicked-at">{clickedAt ?? ''}</div>
    </div>
  )
}
