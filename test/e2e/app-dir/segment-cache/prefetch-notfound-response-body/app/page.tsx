import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <h1 id="home">Home</h1>
      {/* This id does not exist, so the card route renders notFound(). The
          router prefetches the link as soon as it enters the viewport. */}
      <Link href="/card/missing">A card that does not exist</Link>
    </main>
  )
}
