import { Suspense } from 'react'
import { connection } from 'next/server'

async function getData() {
  'use cache'
  console.log('[app] getData (use cache) MISS -> computing')
  return { at: Date.now() }
}

async function Data() {
  await connection() // make the route dynamic so the cache is read per request
  const data = await getData()
  return <p id="data">use cache: {JSON.stringify(data)}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <Data />
    </Suspense>
  )
}
