import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>App Router scroll restoration repro (#70148)</h1>
      <ol>
        <li>
          Open <Link href="/shop">/shop</Link>
        </li>
        <li>Scroll down (e.g. to y = 3000)</li>
        <li>Click any product link</li>
        <li>
          Wait ~1s (the product page calls <code>router.refresh()</code>, which
          invalidates the client router cache)
        </li>
        <li>Press the browser back button</li>
      </ol>
      <p>
        Expected: <code>/shop</code> is restored at y = 3000. Actual: the page
        re-suspends into <code>loading.tsx</code>, the document height collapses,
        and the scroll position ends at y = 0.
      </p>
    </main>
  )
}
