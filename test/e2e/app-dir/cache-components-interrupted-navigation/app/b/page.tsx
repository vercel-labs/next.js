import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicContent() {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, 100))
  return <p data-page="b">page b content</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-fallback="page-b">Loading page b...</p>}>
      <DynamicContent />
    </Suspense>
  )
}
