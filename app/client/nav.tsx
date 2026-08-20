'use client'
import Link from 'next/link'
export function Nav() {
  return (
    <div>
      <Link id="l2024" href="/client?year=2024">2024</Link>{' | '}
      <Link id="l2025" href="/client?year=2025">2025</Link>
    </div>
  )
}
