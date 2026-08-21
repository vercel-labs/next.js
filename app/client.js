'use client'
import { useEffect, useState } from 'react'
import { revalidate } from './actions'

export default function Client() {
  const [n, setN] = useState(null)
  useEffect(() => {
    revalidate().then(setN)
  }, [])
  return (
    <div>
      <p id="stamp">stamp: {String(n)}</p>
      <button id="btn" onClick={() => revalidate().then(setN)}>revalidate</button>
    </div>
  )
}
