import Link from 'next/link'
import ActionButton from './client'

export default function Home() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <Link id="to-other" href="/other">
        go to /other
      </Link>
      <ActionButton />
    </main>
  )
}
