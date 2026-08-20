import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="plus-link" href="/20230607/+">Go to /[yyyymmdd]/+</Link>
    </main>
  )
}
