import { Suspense } from 'react'
import { NavRail } from '../nav-rail'

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-section="b">
      <Suspense fallback={<div data-fallback="nav-b">Loading nav b...</div>}>
        <NavRail section="b" />
      </Suspense>
      {children}
    </div>
  )
}
