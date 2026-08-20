import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <main>
      <h1>asPath hash repro (issue #25202)</h1>
      <p>
        asPath: <code id="aspath">{router.asPath}</code>
      </p>
      <p>
        hasHash: <code id="hashash">{String(router.asPath.includes('#'))}</code>
      </p>
      <p id="mismatch-demo" className={router.asPath.includes('#') ? 'with-hash' : 'no-hash'}>
        className depends on hash (hydration mismatch demo)
      </p>
      <h2 id="my-subheading">my-subheading</h2>
    </main>
  )
}
