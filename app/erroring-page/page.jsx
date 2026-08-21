import Link from 'next/link'

// no metadata.title and no <h1> => route announcer announces ""
export default function ErroringPage() {
  return (
    <main>
      <p>Erroring page (no title, no h1)</p>
      <Link id="to-home" href="/">
        Back home
      </Link>
    </main>
  )
}
