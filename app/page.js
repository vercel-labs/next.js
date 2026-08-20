import Link from 'next/link'

export default function Home() {
  return (
    <ol>
      <li><Link href="/page1">Page 1</Link></li>
      <li><Link href="/page2">Page 2</Link></li>
    </ol>
  )
}
