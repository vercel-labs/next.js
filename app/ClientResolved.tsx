'use client'
// Workaround variant: the dynamic() calls live inside a Client Component module.
import type React from 'react'
import dynamic from 'next/dynamic'

const componentMap: Record<string, React.ComponentType<any>> = {
  Carousel: dynamic(() => import('./components/Carousel'), { ssr: true }),
  Accordion: dynamic(() => import('./components/Accordion'), { ssr: true }),
}

export default function ClientResolved({ name }: { name: string }) {
  const C = componentMap[name]
  return C ? <C /> : null
}
