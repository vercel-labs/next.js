import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Dynamic() {
  return (
    <main>
      <h1 id="dynamic">Dynamic page rendered at {Date.now()}</h1>
      <Link href="/" id="to-home">
        client-navigate back to / (prerendered)
      </Link>
    </main>
  )
}
