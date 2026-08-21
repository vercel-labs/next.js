'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Header() {
  const pathname = usePathname()
  console.log('header', pathname)
  return (
    <nav>
      <Link href="/">Home</Link>{' '}
      <Link href="/page11">Page11</Link>{' '}
      <Link href="/page23">Page23</Link>{' '}
      <Link href="/page36">Page36</Link>
    </nav>
  )
}
