import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically importing a Server Component that contains an inline
// `"use cache"` function fails with Turbopack dev, works with webpack dev.
const Header = dynamic(() => import('./components/header'))

export default function Page() {
  return (
    <Suspense>
      <Header />
    </Suspense>
  )
}
