import { Suspense } from 'react'
import { NavRail } from '../nav-rail'

// Per-section layout so the uncached (cookies()/headers()) chrome subtree
// re-suspends on every top-level navigation, as described in the issue.
export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="c">
      <Suspense fallback={<div data-fallback="nav">SKELETON / spinner</div>}>
        <NavRail section="c" />
      </Suspense>
      {children}
    </div>
  )
}
