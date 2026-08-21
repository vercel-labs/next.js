'use client'
import { useSelectedLayoutSegments, useSelectedLayoutSegment } from 'next/navigation'

export default function Example5Layout({
  children,
  header,
}: {
  children: React.ReactNode
  header: React.ReactNode
}) {
  const headerSegments = useSelectedLayoutSegments('header')
  const headerSegment = useSelectedLayoutSegment('header')
  const childSegments = useSelectedLayoutSegments()
  return (
    <div>
      <p id="segments">Header segments: {JSON.stringify(headerSegments)}</p>
      <p id="segment">Header segment: {JSON.stringify(headerSegment)}</p>
      <p id="child-segments">Children segments: {JSON.stringify(childSegments)}</p>
      {header}
      {children}
    </div>
  )
}
