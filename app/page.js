import Link from 'next/link'
export default function Home() {
  return (
    <ul>
      <li><Link href="/parallel">/parallel</Link></li>
      <li><Link href="/non-parallel">/non-parallel</Link></li>
    </ul>
  )
}
