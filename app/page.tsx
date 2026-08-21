import Link from 'next/link'
import type { Route } from 'next'

// This works: Link infers the dynamic route
const link = <Link href="/time-card/123">time card</Link>

// This fails: Route type does not accept a filled-in dynamic segment
const route: Route = '/time-card/123'

// Workarounds suggested in the issue
const route2: Route<'/time-card/123'> = '/time-card/123'
const route3: Route<`/time-card/${string}`> = '/time-card/123'

// Sanity check: a bogus route is correctly rejected
// @ts-expect-error - unknown route
const bad: Route = '/does-not-exist/123'

export default function Page() {
  return (
    <main>
      {link}
      <p>{route}{route2}{route3}{bad}</p>
    </main>
  )
}
