import { Suspense } from 'react'
import { NavRail } from '../nav-rail'

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-section="c">
      <Suspense fallback={<div data-fallback="nav-c">Loading nav c...</div>}>
        <NavRail section="c" />
      </Suspense>
      {children}
    </div>
  )
}
