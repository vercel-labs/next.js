import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicPart() {
  await connection()
  return <p>Rendered at request time: {Date.now()}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <DynamicPart />
    </Suspense>
  )
}
