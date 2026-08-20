import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/page-a">Go to Page A</Link>
      <div style={{ height: '3000px' }} />
    </main>
  )
}
