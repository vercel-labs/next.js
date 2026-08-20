'use client'
import { memo, useEffect, useState } from 'react'
import Link from 'next/link'

let r = 0
const MemoNavbar = memo(function MemoNavbar() {
  r++
  if (typeof window !== 'undefined') (window).__memoRenders = r
  const [count, setCount] = useState(0)
  useEffect(() => {
    ;(window).__memoMounts = ((window).__memoMounts || 0) + 1
    console.log('MemoNavbar MOUNTED')
  }, [])
  return (
    <nav>
      <Link href="/">Homepage</Link> <Link href="/info">Info</Link>
      <button id="minc" onClick={() => setCount((c) => c + 1)}>memo count: <span id="mcount">{count}</span></button>
    </nav>
  )
})
export default MemoNavbar
