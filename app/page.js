import Link from 'next/link'
import ActionButton from './client'

// prerendered (static) route
export default function Page() {
  return (
    <main>
      <h1 id="home">Prerendered home</h1>
      <ActionButton />
      <Link href="/dynamic" id="to-dynamic">
        client-navigate to /dynamic
      </Link>
    </main>
  )
}
