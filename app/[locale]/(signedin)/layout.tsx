import { Suspense } from 'react'
import { NavRail } from './nav-rail'
import { Links } from './links'

// Synchronous static shell; app chrome is inside a Suspense subtree that
// reads cookies()/headers() (uncached runtime data), which de-opts it from
// the App Shell — as described in the issue.
export default function SignedInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-shell="signedin" style={{ display: 'flex', gap: 16 }}>
      <Suspense fallback={<div data-fallback="nav">SKELETON / spinner</div>}>
        <NavRail />
      </Suspense>
      <div style={{ flex: 1 }}>
        <Links />
        {children}
      </div>
    </div>
  )
}
