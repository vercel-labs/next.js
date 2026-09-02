import Link from 'next/link'

export default function LocaleHome() {
  return (
    <main>
      <h1 id="home">Home</h1>
      {/* Filler so the links sit far below the fold. */}
      <div style={{ height: 3000 }} />
      <nav>
        {/* No locale prefix: the proxy responds with a 308 to /en/about. */}
        <Link href="/about" id="link-redirected">
          Go to /about (proxy 308 to /en/about)
        </Link>
        {/* Already prefixed: same destination, but no proxy redirect. */}
        <Link href="/en/about" id="link-direct">
          Go to /en/about (no redirect)
        </Link>
      </nav>
    </main>
  )
}
