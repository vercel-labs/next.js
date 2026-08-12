import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicContent() {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, 100))
  return <p data-page="c">page c content</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-fallback="page-c">Loading page c...</p>}>
      <DynamicContent />
    </Suspense>
  )
}
