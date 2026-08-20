'use client'
import { useEffect, useState } from 'react'

export default function Base({ name }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const log = (m) => {
      console.log(m)
      const el = document.getElementById('log')
      if (el) el.textContent += m + '\n'
    }
    log(`MOUNT ${name}`)
    const i = setInterval(() => setCount((c) => c + 1), 500)
    return () => {
      clearInterval(i)
      log(`UNMOUNT ${name}`)
    }
  }, [name])
  return <div data-testid={name}>{name}: {count}</div>
}
