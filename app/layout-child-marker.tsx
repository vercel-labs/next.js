'use client'

// Marks the boundary of what the root layout renders as its direct child,
// so the React fiber chain between the layout and the template is visible.
export default function LayoutChildMarker({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
