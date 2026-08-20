'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Page() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), 1000)
    window.__native = { with: 0, without: 0 }
    document.addEventListener(
      'load',
      (e) => {
        if (e.target.tagName !== 'IMG') return
        if (e.target.src.includes('box.png')) window.__native.with++
        else if (e.target.src.includes('box2.png')) window.__native.without++
      },
      true
    )
    return () => clearInterval(id)
  }, [])
  return (
    <main>
      <h1 id="counter">rerenders: {n}</h1>
      <div>
        <p>with onError</p>
        <Image
          id="with-onerror"
          src="/box.png"
          alt="with onError"
          width={100}
          height={100}
          onError={() => {}}
          onLoad={() => {
            window.__loads = window.__loads || { with: 0, without: 0 }
            window.__loads.with++
          }}
        />
      </div>
      <div>
        <p>without onError</p>
        <Image
          id="without-onerror"
          src="/box2.png"
          alt="without onError"
          width={100}
          height={100}
          onLoad={() => {
            window.__loads = window.__loads || { with: 0, without: 0 }
            window.__loads.without++
          }}
        />
      </div>
    </main>
  )
}
