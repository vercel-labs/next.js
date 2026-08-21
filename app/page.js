'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import './page.css'

const Lazy = dynamic(() => import('./lazy'), { ssr: false })

export default function Page() {
  const [n, setN] = useState(0)
  const [show, setShow] = useState(false)
  return (
    <main className="box">
      <button id="btn" onClick={() => setN(n + 1)}>count {n}</button>
      <button id="lazy" onClick={() => setShow(true)}>load lazy</button>
      {show ? <Lazy /> : null}
      <Link href="/about" id="to-about">about</Link>
    </main>
  )
}
