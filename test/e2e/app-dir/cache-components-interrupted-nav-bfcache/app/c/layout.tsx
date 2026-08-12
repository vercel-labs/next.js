import { Suspense } from 'react'
import { NavRail } from '../nav-rail'

// Each section has its own layout, so its nav rail re-suspends on every
// navigation into the section.
export default function SectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-section="c">
      <Suspense fallback={<div data-nav-fallback="c">nav rail skeleton</div>}>
        <NavRail section="c" />
      </Suspense>
      {children}
    </div>
  )
}
