import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/gated">/gated (streams a redirect)</Link>{' '}
      <Link href="/target">/target</Link> <Link href="/other">/other</Link>
    </main>
  )
}
