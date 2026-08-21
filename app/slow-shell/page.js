import { Suspense } from 'react'
import { Filters } from '../filters'
import { Card } from '../card'

// Dashboard-style page: the page shell itself does some dynamic (uncached) work
// before rendering. The Suspense boundary below cannot show its fallback until
// this resolves, because the fallback only appears once the new RSC payload arrives.
export default async function Page({ searchParams }) {
  const { filter = 'a' } = await searchParams
  await new Promise((r) => setTimeout(r, 1500))
  return (
    <main>
      <Filters />
      <Suspense key={filter} fallback={<div id="fallback">Loading card…</div>}>
        <Card filter={filter} />
      </Suspense>
    </main>
  )
}
