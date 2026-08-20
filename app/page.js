import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="search-link" href="/search">Search</Link>
    </main>
  )
}
