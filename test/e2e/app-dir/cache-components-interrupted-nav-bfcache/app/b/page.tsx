import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicContent() {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, 100))
  return <p data-page="b">page b</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-page-fallback="b">loading b</p>}>
      <DynamicContent />
    </Suspense>
  )
}
