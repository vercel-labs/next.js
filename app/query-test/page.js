'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function Query() {
  const sp = useSearchParams()
  return <pre id="query">{JSON.stringify(Object.fromEntries(sp.entries()))}</pre>
}

export default function QueryTest() {
  return (
    <main>
      <h1 id="title">query-test</h1>
      <Suspense fallback={<pre id="query">loading</pre>}>
        <Query />
      </Suspense>
    </main>
  )
}
