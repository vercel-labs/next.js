'use client'
import Link from 'next/link'

export default function Menu() {
  return (
    <nav>
      <Link href="/" prefetch={false}>Home</Link>{' | '}
      <Link href="/test" prefetch={false}>test</Link>{' | '}
      <Link href="/test2" prefetch={false}>test2</Link>
    </nav>
  )
}
