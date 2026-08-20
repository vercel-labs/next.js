// NOTE: no "use client" here - this is a Server Component module
import type React from 'react'
import dynamic from 'next/dynamic'

const componentMap: Record<string, React.ComponentType<any>> = {
  Carousel: dynamic(() => import('./components/Carousel'), { ssr: true }),
  Accordion: dynamic(() => import('./components/Accordion'), { ssr: true }),
}

export default function resolveComponent(name: string) {
  return componentMap[name] || null
}
