import { Suspense } from 'react'
import { connection } from 'next/server'
import { unstable_cache } from 'next/cache'

const getData = unstable_cache(async () => {
  console.log('[app] getData (unstable_cache) MISS -> computing')
  return { at: Date.now() }
}, ['unstable-key'])

async function Data() {
  await connection()
  const data = await getData()
  return <p id="data">unstable_cache: {JSON.stringify(data)}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <Data />
    </Suspense>
  )
}
