import Link from 'next/link'

export default function Target() {
  return (
    <main>
      <h1>Target</h1>
      <Link href="/other">/other</Link> <Link href="/">/</Link>
    </main>
  )
}
