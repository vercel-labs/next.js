import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/page2?test=1" id="to-page2">Page2?test=1</Link>
    </main>
  )
}
