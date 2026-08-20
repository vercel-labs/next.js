import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 40 }}>
      <h1>Home</h1>
      <p>
        <Link id="broken-link" href="/noop">
          Broken link (should 404)
        </Link>
      </p>
      <p>
        <Link id="ok-link" href="/hello">
          Valid link
        </Link>
      </p>
    </main>
  )
}
