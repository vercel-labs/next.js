import { ViewTransition } from 'react'
import Link from 'next/link'
import { DirToggle } from '../dir-toggle'

export default function B() {
  return (
    <ViewTransition>
      <main
        id="page-b"
        style={{ padding: 40, background: 'rgb(0, 0, 255)', minHeight: '100vh' }}
      >
        <h1>Page B (blue)</h1>
        <Link id="to-a" href="/a">
          go to /a
        </Link>
        <DirToggle />
      </main>
    </ViewTransition>
  )
}
