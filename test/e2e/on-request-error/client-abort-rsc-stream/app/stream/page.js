import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function NeverResolves() {
  // Keeps the RSC response open so the client can abort mid-stream.
  await new Promise(() => {})
  return null
}

export default function Page() {
  return (
    <Suspense fallback={<p>stream-started</p>}>
      <NeverResolves />
    </Suspense>
  )
}
