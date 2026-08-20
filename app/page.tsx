import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Repro #53813</h1>
      <Link id="mw" href="/redirect-external" prefetch={false}>
        middleware external redirect
      </Link>
      <br />
      <Link id="rsc" href="/redirect-page" prefetch={false}>
        server component external redirect()
      </Link>
    </main>
  )
}
