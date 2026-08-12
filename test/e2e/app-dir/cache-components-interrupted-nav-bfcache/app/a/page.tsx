import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicContent() {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, 100))
  return <p data-page="a">page a</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p data-page-fallback="a">loading a</p>}>
      <DynamicContent />
    </Suspense>
  )
}
