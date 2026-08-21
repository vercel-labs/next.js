import { Suspense } from 'react'
import { PostUnstable } from './PostUnstable'
import { PostRevalidate } from './PostRevalidate'

export default function Page() {
  return (
    <main>
      <h1>cache bug</h1>
      <Suspense fallback={<div id="loading-unstable">Loading unstable...</div>}>
        <PostUnstable />
      </Suspense>
      <Suspense fallback={<div id="loading-revalidate">Loading revalidate...</div>}>
        <PostRevalidate />
      </Suspense>
    </main>
  )
}
