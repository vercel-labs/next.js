import { Suspense } from 'react'
import { PostUnstable } from '../PostUnstable'

// Isolated: only the unstable_cache component, so page latency reflects cache hit/miss.
export default function Page() {
  return (
    <Suspense fallback={<div id="loading-unstable">Loading unstable...</div>}>
      <PostUnstable />
    </Suspense>
  )
}
