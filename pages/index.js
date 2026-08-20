import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>home</h1>
      <p id="dpl">{process.env.NEXT_DEPLOYMENT_ID || 'n/a'}</p>
      <Link href="/other" id="to-other">
        go to /other
      </Link>
    </main>
  )
}
