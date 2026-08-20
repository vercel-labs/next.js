import { Suspense } from 'react'
import { cookies, headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return { title: 'deep' }
}

async function Slow() {
  await cookies()
  await headers()
  await new Promise((r) => setTimeout(r, 50))
  return <p>slow</p>
}

export default async function Page() {
  return (
    <Suspense fallback={<p>loading</p>}>
      <Slow />
    </Suspense>
  )
}
