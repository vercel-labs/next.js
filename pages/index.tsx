import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <h1>matchers leak repro</h1>
      <Link href="/other">other</Link>
    </main>
  )
}
