import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicContent() {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, 100))
  return <p data-page="a">page a content</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-fallback="page-a">Loading page a...</p>}>
      <DynamicContent />
    </Suspense>
  )
}
