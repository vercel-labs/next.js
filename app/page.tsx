import Link from 'next/link'
export default function Home() {
  return (
    <ul>
      <li><Link href="/post-1">post 1</Link></li>
      <li><Link href="/post-2">post 2</Link></li>
      <li><Link href="/page-1">page 1</Link></li>
      <li><Link href="/page-2">page 2</Link></li>
    </ul>
  )
}
