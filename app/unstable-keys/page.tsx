import { Suspense } from 'react'
import { connection } from 'next/server'

// The keys of the postponed Suspense boundaries are not stable between the
// build-time prerender and the runtime resume. React therefore cannot match
// the resumable slots when replaying the postponed tree.
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

async function Dynamic({ i }: { i: number }) {
  await connection()
  return <li>dynamic {i}</li>
}

export default async function Page() {
  return (
    <ul>
      {[0, 1, 2].map((i) => (
        <Suspense
          key={`item-${i}-${isBuild ? 'build' : 'runtime'}`}
          fallback={<li>loading {i}</li>}
        >
          <Dynamic i={i} />
        </Suspense>
      ))}
    </ul>
  )
}
