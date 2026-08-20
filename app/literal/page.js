'use client'
import { useEffect, useState } from 'react'
import { initLibrary } from '../../lib/lib2'
export default function Page() {
  const [s, setS] = useState('pending')
  useEffect(() => {
    initLibrary(true).then(k => setS('ok: ' + k.slice(0,5).join(',')), e => setS('ERROR: ' + e.message))
  }, [])
  return <p id="result">{s}</p>
}
