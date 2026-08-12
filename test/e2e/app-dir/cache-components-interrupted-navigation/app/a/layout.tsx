import { Suspense } from 'react'
import { NavRail } from '../nav-rail'

export default function SectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-section="a">
      <Suspense fallback={<div data-fallback="nav-a">Loading nav a...</div>}>
        <NavRail section="a" />
      </Suspense>
      {children}
    </div>
  )
}
