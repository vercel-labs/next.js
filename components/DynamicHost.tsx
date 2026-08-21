'use client'
import dynamic from 'next/dynamic'

const DynamicCard = dynamic(() => import('./DynamicCard'), { ssr: false })

export function DynamicHost() {
  return <DynamicCard />
}
