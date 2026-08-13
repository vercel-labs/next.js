import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <h1 id="home">Home</h1>
      {/* Prefetching is disabled so the navigation issues its own RSC
          request, which the test intercepts. */}
      <Link href="/target" prefetch={false} id="go">
        go to /target
      </Link>
    </main>
  )
}
