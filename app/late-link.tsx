'use client'
import Link from 'next/link'
import { useState } from 'react'

export function LateLink() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button id="reveal" onClick={() => setShow(true)}>
        reveal link
      </button>
      {show ? (
        <Link id="late-link" href="/records2" prefetch={true}>
          Records2 (full prefetch)
        </Link>
      ) : null}
    </div>
  )
}
