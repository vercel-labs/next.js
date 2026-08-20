'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Page() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <main>
      <h1 id="counter">rerenders: {n}</h1>
      <Image
        src="/slowimg?which=with"
        alt="with onError"
        width={100}
        height={100}
        unoptimized
        onError={() => {}}
        onLoad={() => {
          window.__loads = window.__loads || { with: 0, without: 0 }
          window.__loads.with++
        }}
      />
      <Image
        src="/slowimg?which=without"
        alt="without onError"
        width={100}
        height={100}
        unoptimized
        onLoad={() => {
          window.__loads = window.__loads || { with: 0, without: 0 }
          window.__loads.without++
        }}
      />
    </main>
  )
}
