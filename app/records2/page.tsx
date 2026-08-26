import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicRecords() {
  await connection()
  await new Promise((r) => setTimeout(r, 100))
  return <p id="records2-dynamic">dynamic records at {Date.now()}</p>
}

export default function RecordsPage() {
  return (
    <main>
      <h1 id="records2-shell">Records (static shell)</h1>
      <Suspense fallback={<p id="records2-skeleton">loading records…</p>}>
        <DynamicRecords />
      </Suspense>
    </main>
  )
}
