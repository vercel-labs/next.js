import { ViewTransition } from 'react'
import Link from 'next/link'
import { DirToggle } from '../dir-toggle'

export default function A() {
  return (
    <ViewTransition>
      <main
        id="page-a"
        style={{ padding: 40, background: 'rgb(255, 0, 0)', minHeight: '100vh' }}
      >
        <h1>Page A (red)</h1>
        <Link id="to-b" href="/b">
          go to /b
        </Link>
        <DirToggle />
      </main>
    </ViewTransition>
  )
}
