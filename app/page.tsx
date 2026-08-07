import Link from 'next/link'
import ActionButton from './action-button'

export default function Home() {
  return (
    <main>
      <h1 id="home">Home (rendered at {new Date().toISOString()})</h1>
      <p id="marker">client-state-marker</p>
      <Link id="to-protected" href="/protected">
        Go to /protected (prefetched, WAF-challenged)
      </Link>
      <ActionButton />
    </main>
  )
}
