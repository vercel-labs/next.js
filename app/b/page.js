import Link from 'next/link'
import { connection } from 'next/server'

export default async function B() {
  // dynamic render, so a fresh timestamp proves the page was re-rendered
  // on the server instead of being served from the client Router Cache.
  await connection()
  return (
    <main>
      <h1>page /b</h1>
      <p>
        rendered at: <span id="rendered-at">{Date.now()}</span>
      </p>
      <Link href="/" id="link-home">
        back home
      </Link>
    </main>
  )
}
