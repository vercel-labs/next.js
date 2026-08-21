import { Suspense } from 'react'
import { Filters } from './filters'
import { Card } from './card'

export default async function Page({ searchParams }) {
  const { filter = 'a' } = await searchParams
  return (
    <main>
      <Filters />
      <Suspense key={filter} fallback={<div id="fallback">Loading card…</div>}>
        <Card filter={filter} />
      </Suspense>
    </main>
  )
}
