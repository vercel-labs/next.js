'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getServerNow } from '../actions'

export default function Client() {
  const router = useRouter()
  const [status, setStatus] = useState('idle')
  useEffect(() => {
    router.push('?asdf')
    setTimeout(() => {
      setStatus('pending')
      getServerNow().then(
        (v) => setStatus('resolved:' + v),
        (e) => setStatus('rejected:' + e)
      )
    }, 0)
  }, [])
  return <p id="status">{status}</p>
}
