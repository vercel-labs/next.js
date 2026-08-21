import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <h1 id="page">App Home</h1>
      <Link href="/route-1">Route 1</Link>
      <p><Link href="/pages-home">Pages router repro</Link></p>
    </main>
  )
}
