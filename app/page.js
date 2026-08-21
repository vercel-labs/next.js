import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Home</h1>
      <p>
        <Link id="no-hash" href="/hoge">
          Without Hash
        </Link>
      </p>
      <p>
        <Link id="with-hash" href="/hoge#foo">
          With Hash (#foo does not exist)
        </Link>
      </p>
      <div style={{ height: 2000 }}>spacer so home can be scrolled</div>
    </main>
  )
}
