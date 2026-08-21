import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Home</h1>
      <Link id="to-a" href="/a">
        go to /a
      </Link>
    </main>
  )
}
