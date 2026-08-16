import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

// This route explicitly opts out of Partial Prefetching, which should override
// the app-level `partialPrefetching: true` config for this route.
export const prefetch = 'force-disabled'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  return (
    <main>
      <CachedShell>
        <Suspense fallback={<div>Loading dynamic...</div>}>
          <Dynamic searchParams={searchParams} />
        </Suspense>
      </CachedShell>
    </main>
  )
}

async function CachedShell({ children }: { children: React.ReactNode }) {
  'use cache'
  cacheLife('max')
  return (
    <div id="static-content">
      FORCE_DISABLED_SHELL_MARKER
      {children}
    </div>
  )
}

async function Dynamic({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <div id="dynamic-content">Dynamic content {q ?? 'none'}</div>
}
