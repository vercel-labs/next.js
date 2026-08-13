import { connection } from 'next/server'
import { Suspense } from 'react'

async function Dynamic() {
  await connection()
  return <p id="dynamic">dynamic content resolved</p>
}

// The dynamic hole makes this route partially prerenderable, so its prefetch
// response is a partial Flight stream (leading `~` marker) by design.
export default function Page() {
  return (
    <main>
      <h1 id="target">Target</h1>
      <Suspense fallback={<p id="loading">loading...</p>}>
        <Dynamic />
      </Suspense>
    </main>
  )
}
