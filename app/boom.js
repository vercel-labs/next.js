'use client'
import { useEffect } from 'react'

export default function Boom() {
  useEffect(() => {
    // Three unhandled runtime errors -> dev error overlay opens with "1 of 3 errors"
    setTimeout(() => {
      throw new Error('Repro error 1 for next.js#47351')
    }, 100)
    setTimeout(() => {
      throw new Error('Repro error 2 for next.js#47351')
    }, 200)
    setTimeout(() => {
      throw new Error('Repro error 3 for next.js#47351')
    }, 300)
  }, [])
  return <p>Runtime errors are thrown after hydration.</p>
}
