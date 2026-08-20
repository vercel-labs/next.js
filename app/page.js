import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="to-query" href="/query-test?foo=bar&baz=123">
        /query-test?foo=bar&amp;baz=123
      </Link>
    </main>
  )
}
