import Link from 'next/link'
import { useRouter } from 'next/router'

// Reproduction for https://github.com/vercel/next.js/issues/67951
// Pages Router: when `as` differs from the current URL only by the fragment,
// next/router takes the "hash change only" shortcut and never applies the
// query of `href`, so router.query / the visible search params go stale.
export default function Home() {
  const router = useRouter()
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24, lineHeight: 1.6 }}>
      <h1>next#67951</h1>
      <p>
        router.query.q = <b id="query">{String(router.query.q)}</b>
        {' | '}router.asPath = <b id="aspath">{router.asPath}</b>
      </p>

      <h2>Broken: anchor in `as`</h2>
      <p>
        <Link id="bug-1" href={{ pathname: '/', query: { q: '1' } }} as="/#section">q=1 (as="/#section")</Link>
        {' · '}
        <Link id="bug-2" href={{ pathname: '/', query: { q: '2' } }} as="/#section">q=2 (as="/#section")</Link>
      </p>

      <h2>Works: no anchor in `as`</h2>
      <p>
        <Link id="ok-1" href={{ pathname: '/', query: { q: '1' } }} as="/?q=1">q=1 (as="/?q=1")</Link>
        {' · '}
        <Link id="ok-2" href={{ pathname: '/', query: { q: '2' } }} as="/?q=2">q=2 (as="/?q=2")</Link>
      </p>

      <p>
        Steps: from <code>/?q=0</code> click “q=1 (as=&quot;/#section&quot;)” then
        “q=2 (as=&quot;/#section&quot;)”. The second click is a no-op:
        <code>router.query.q</code> stays <code>1</code>. The same sequence in the
        second row (no anchor) updates correctly.
      </p>
      <div id="section" style={{ marginTop: 700 }}>#section target</div>
    </main>
  )
}
