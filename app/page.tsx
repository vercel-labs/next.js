import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <Link href="/x" id="to-x">Go to X</Link>
    </main>
  )
}
