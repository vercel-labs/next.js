'use client'
import { useEffect } from 'react'

export default function PlainClient() {
  useEffect(() => {
    console.log('[plain] MOUNT')
    return () => console.log('[plain] UNMOUNT')
  }, [])
  return <div id="plain">plain client component</div>
}
