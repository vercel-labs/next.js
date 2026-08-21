import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <Link id="to-about" href="/about" prefetch>
        Go to about
      </Link>
    </main>
  )
}
