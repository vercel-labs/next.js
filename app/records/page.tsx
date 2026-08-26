import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicRecords() {
  await connection()
  await new Promise((r) => setTimeout(r, 100))
  return <p id="records-dynamic">dynamic records at {Date.now()}</p>
}

export default function RecordsPage() {
  return (
    <main>
      <h1 id="records-shell">Records (static shell)</h1>
      <Suspense fallback={<p id="records-skeleton">loading records…</p>}>
        <DynamicRecords />
      </Suspense>
    </main>
  )
}
