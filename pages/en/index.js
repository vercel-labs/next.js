import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="anchor-link" href="#about">
        About (anchor)
      </Link>
      <div style={{ height: 1200 }} />
      <h2 id="about">About</h2>
    </main>
  )
}
